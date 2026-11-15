import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createWeChatLauncherHost, snapshotWeChatLauncherHostConfig } from '../../adapters/wechat/launcher-host.mjs';
import { fakeWeChat, originalWeChatPeer } from './helpers/wechat-tcp-fixture.mjs';
import { weChatHostConfig } from './helpers/wechat-host-fixture.mjs';

function ready(host) {
  assert.equal(host.chooseGame(0), true); assert.equal(host.chooseRegion(0), true);
  host.inputUsername('SyntheticU1'); host.inputPassword('SyntheticP1');
  assert.equal(host.beginReview(), true);
  assert.equal(host.decide(true), false);
  for (let index = 0; index < 3; index++) assert.equal(host.nextPage(), true);
  assert.equal(host.decide(true), true); assert.equal(host.snapshot().canLogin, true);
}

test('unconfigured WeChat host does not touch platform APIs or open a session', async () => {
  const fixture = fakeWeChat(), views = [], host = createWeChatLauncherHost({ wx: fixture.wx, render: view => views.push(view) });
  assert.equal(host.snapshot().configured, false); assert.equal(host.beginReview(), false);
  await host.login(); assert.equal(fixture.stats.created, 0); assert.equal(fixture.stats.entropyRequests, 0);
  assert.ok(views.length);
});

test('WeChat host config rejects credentials, accessors and invalid text/codecs before IO', () => {
  for (const extra of [{ password: 'must never be config' }, { sourceProfile: 'legacy' }, { textEncoding: 'automatic' },
    { textPages: ['incomplete'] }, { regionListXml: '<bad>' }]) {
    assert.throws(() => snapshotWeChatLauncherHostConfig(weChatHostConfig(extra)));
  }
  const input = weChatHostConfig(); let invoked = false;
  Object.defineProperty(input, 'gameListXml', { get() { invoked = true; throw new Error(); } });
  assert.throws(() => snapshotWeChatLauncherHostConfig(input)); assert.equal(invoked, false);
});

test('WeChat host rejects closed/missing/denied references and requires explicit selection', () => {
  const fixture = fakeWeChat(), host = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig() });
  assert.equal(host.snapshot().canInput, false); assert.equal(host.chooseGame(0), true);
  for (const ordinal of [1,2,3]) { assert.equal(host.chooseRegion(ordinal), false); assert.equal(host.snapshot().canInput, false); }
  assert.equal(fixture.stats.created, 0); assert.equal(host.chooseRegion(0), true); assert.equal(host.snapshot().canInput, true);
});

test('WeChat host keeps typed input private, invalidates consent on change and clears widgets on hide', () => {
  const fixture = fakeWeChat(), views = [], host = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig(), render: view => views.push(view) });
  ready(host);
  assert.doesNotMatch(JSON.stringify(views), /SyntheticU1|SyntheticP1/);
  host.inputPassword('ChangedP'); assert.equal(host.snapshot().canLogin, false);
  assert.match(host.snapshot().status, /重新.*确认|重新填写/);
  const before = host.snapshot().inputMounts[0]; host.hide();
  assert.equal(host.snapshot().canReview, false); assert.equal(host.snapshot().canLogin, false); assert.ok(host.snapshot().inputMounts[0] > before);
  assert.equal(fixture.stats.created, 0);
});

test('WeChat host uses explicit encoding and byte bounds without inferring the Windows codepage', () => {
  const fixture = fakeWeChat(), host = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig({ textEncoding: 'windows-936' }) });
  host.chooseGame(0); host.chooseRegion(0); host.inputUsername('中'.repeat(8)); host.inputPassword('文'.repeat(8));
  assert.equal(host.snapshot().canReview, true);
  host.inputUsername('中'.repeat(9)); assert.equal(host.snapshot().canReview, false);
  const ascii = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig() });
  ascii.chooseGame(0); ascii.chooseRegion(0); ascii.inputUsername('中'); ascii.inputPassword('P');
  assert.equal(ascii.snapshot().canReview, false);
});

test('WeChat host preserves source Galaxy ordinals after filtering by game', () => {
  const regionListXml = '<Regionlist><Regions><Region Code="1"><Name>原创区域</Name><BList><BIP Port="12345">fixture.invalid</BIP></BList>'
    + '<Galaxylist><Galaxy Gamecode="10" Name="其他"> ignored </Galaxy><Galaxy Gamecode="11" Name="目标"> selected </Galaxy></Galaxylist></Region></Regions></Regionlist>';
  const host = createWeChatLauncherHost({ wx: fakeWeChat().wx, config: weChatHostConfig({ regionListXml }) });
  host.chooseGame(0); assert.equal(host.chooseRegion(0), true); assert.equal(host.snapshot().canInput, false);
  assert.equal(host.chooseGalaxy(0), true); assert.equal(host.snapshot().canInput, true);
});

for (const scenario of ['profiles','wrong-group']) test(`WeChat host owns the actual source-bound exchange: ${scenario}`, async () => {
  const peer = await originalWeChatPeer(scenario), fixture = fakeWeChat({ native: true, loopbackPort: peer.port }), views = [];
  const host = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig(), render: view => views.push(view) });
  try {
    ready(host); const result = await host.login(), oracle = await peer.done;
    assert.equal(oracle.passed, true); assert.equal(result.busy, false); assert.equal(result.authentication, 'unverified');
    assert.equal(result.canLogin, false); assert.equal(result.canReview, false); assert.equal(fixture.stats.closed, 1);
    assert.doesNotMatch(JSON.stringify(views), /SyntheticU1|SyntheticP1/);
    if (scenario === 'profiles') {
      assert.equal(oracle.request_verified, true); assert.ok(result.rows.length);
      const blocked = result.rows.find(row => !row.selectable), allowed = result.rows.find(row => row.selectable);
      assert.ok(blocked && allowed); assert.equal(host.selectProfile(blocked.ordinal), false);
      assert.equal(host.selectProfile(allowed.ordinal), true); assert.ok(host.snapshot().selectedLabel);
    } else assert.equal(result.rows.length, 0);
  } finally { host.hide(); await peer.close(); }
});

test('WeChat host cancellation/hide ignores the pending session result and clears input/review', async () => {
  const fixture = fakeWeChat(), host = createWeChatLauncherHost({ wx: fixture.wx, config: weChatHostConfig() });
  ready(host); const pending = host.login(); assert.equal(host.snapshot().busy, true);
  assert.equal(host.chooseGame(0), false); host.hide(); const expected = host.snapshot(); await pending;
  assert.deepEqual(host.snapshot(), expected); assert.equal(expected.busy, false); assert.equal(expected.rows.length, 0);
  assert.equal(fixture.stats.created, fixture.stats.closed); assert.equal(expected.canReview, false);
});

test('native Page/App lifecycle wrappers forward hide/unload and never put credentials in setData', () => {
  let pageDefinition, appDefinition, listener, hidden = 0, disposed = 0; const views = [];
  const lifecycle = { listen(fn) { listener = fn; return () => { listener = null; disposed++; }; }, hide() { listener?.(); } };
  const host = { hide() { hidden++; }, inputUsername() {}, inputPassword() {} };
  const createWeChatLauncherHost = ({ render }) => { render({ status: 'original', inputMounts: [0] }); return host; };
  const sandbox = { wx: {}, Page(value) { pageDefinition = value; }, App(value) { appDefinition = value; },
    require(name) { if (name.endsWith('lifecycle.js')) return lifecycle; if (name.endsWith('runtime-config.js')) return null; return { createWeChatLauncherHost }; } };
  runInNewContext('(function(){\n' + readFileSync(new URL('../../wechat/app.js', import.meta.url), 'utf8') + '\n})()', sandbox);
  runInNewContext('(function(){\n' + readFileSync(new URL('../../wechat/pages/launcher/index.js', import.meta.url), 'utf8') + '\n})()', sandbox);
  const page = { ...pageDefinition, setData(value) { views.push(value); } }; page.onLoad();
  appDefinition.onHide(); page.onHide(); page.onUnload();
  assert.equal(hidden, 3); assert.equal(disposed, 1); assert.equal(page._host, null); assert.equal(views.length, 1);
  assert.doesNotMatch(JSON.stringify(views), /username|password/);
});

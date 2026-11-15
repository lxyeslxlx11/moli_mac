/** Generated project check: real built CommonJS/App/Page modules; Node-backed wx is not native WeChat. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { fakeWeChat, originalWeChatPeer } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';

function loadProject(path, wx) {
  const cache = new Map(); let app, definition; const frames = [];
  const sandbox = { wx, module: undefined, setTimeout, clearTimeout, Uint8Array, ArrayBuffer, DataView,
    App(value) { app = value; }, Page(value) { definition = value; },
    AbortController: undefined, AbortSignal: undefined, EventTarget: undefined, performance: undefined, crypto: undefined,
    Buffer: undefined, fetch: undefined, URL: undefined, TextEncoder: undefined, TextDecoder: undefined };
  function load(name) {
    const file = resolve(path, name);
    if (!file.startsWith(path + '/')) throw new Error('Unexpected project import.');
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const fn = runInNewContext('(function(module,exports,require){\n' + readFileSync(file, 'utf8') + '\n})', sandbox, { timeout: 1000 });
    fn(module, module.exports, request => { if (!request.startsWith('.')) throw new Error('External import.'); return load(resolve(dirname(file), request)); });
    return module.exports;
  }
  load('app.js'); load('pages/launcher/index.js');
  const page = { ...definition, setData(view) { this.data = { ...this.data, ...view }; frames.push(view); } };
  page.onLoad(); return { app, page, frames };
}

test('generated default WeChat project loads unconfigured and has no automatic IO', () => {
  const wx = fakeWeChat(), project = fileURLToPath(new URL('../../build/wechat-app/', import.meta.url));
  const { app, page } = loadProject(resolve(project), wx.wx);
  assert.equal(page.data.configured, false); assert.equal(page.data.canLogin, false); assert.equal(wx.stats.created, 0);
  app.onHide(); page.onUnload(); assert.equal(page._host, null);
});

test('generated App/Page/current host bundle completes original exchange and lifecycle cleanup without DOM APIs', async () => {
  const peer = await originalWeChatPeer(), wx = fakeWeChat({ native: true, loopbackPort: peer.port });
  const project = fileURLToPath(new URL('../../build/wechat-app-fixture/', import.meta.url));
  const { app, page, frames } = loadProject(resolve(project), wx.wx);
  try {
    page.onGame({ detail: { value: 0 } }); page.onRegion({ detail: { value: 0 } });
    page.onUsername({ detail: { value: 'SyntheticU1' } }); page.onPassword({ detail: { value: 'SyntheticP1' } });
    page.onReview(); for (let i = 0; i < 3; i++) page.onNext(); page.onAccept();
    assert.equal(page.data.canLogin, true); await page.onStart(); const oracle = await peer.done;
    assert.equal(oracle.request_verified, true); assert.ok(page.data.rows.length); assert.equal(page.data.busy, false);
    assert.doesNotMatch(JSON.stringify(frames), /SyntheticU1|SyntheticP1/);
    const allowed = page.data.rows.find(row => row.selectable); page.onProfile({ currentTarget: { dataset: { ordinal: allowed.ordinal } } });
    assert.ok(page.data.selectedLabel); app.onHide(); assert.equal(page.data.rows.length, 0); assert.equal(page.data.accepted, false);
    page.onUnload(); assert.equal(page._host, null); assert.equal(wx.stats.closed, 1);
  } finally { page.onUnload(); await peer.close(); }
});

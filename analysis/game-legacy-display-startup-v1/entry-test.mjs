/** Start the game through the published host paths and observe source-sized Canvas frames. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { prepareLegacyGameStartup } from '../../shared/index.mjs';
import { assets, startup } from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import { bootstrapOriginalPeer } from '../../web/tests/helpers/legacy-game-local-bootstrap-tcp-fixture.mjs';

function material() {
  const value = startup();
  value.context.display = 'legacy-se6000-37c4';
  return JSON.stringify(value);
}

test('legacy display material composes with v2 module and Config.dat', async () => {
  const source = JSON.parse(await readFile(new URL('source-check.json', import.meta.url))).source;
  const image = await readFile(source.path);
  const config = Buffer.from('binfolder:SelectedAssets\r\n');
  const input = JSON.parse(material());
  input.schema = 'moli.legacy-game-startup.v2';
  input.commandTailHex = '';
  delete input.resourceParametersHex;
  delete input.moduleDigestHex;
  const files = new Map([['cg_se_6000.exe', image], ['Config.dat', config]]);
  let owner;
  try {
    owner = await prepareLegacyGameStartup(input, {
      stat: name => files.get(name)?.length ?? null,
      read: (name, offset, size) => files.get(name).subarray(offset, offset + size),
    });
    const copy = owner.copy();
    assert.equal(Buffer.from(copy.moduleDigestBytes).toString('ascii'), createHash('md5').update(image).digest('hex'));
    assert.equal(Buffer.from(copy.resourceParameters).toString('ascii'), 'binfolder:SelectedAssets\n');
    assert.deepEqual(copy.context.display, { width: 640, height: 480, center: [320, 240], initialCamera: null, graphicsMode: 2, forceRender: false });
    for (const bytes of [copy.moduleDigestBytes, copy.mappingBytes, copy.resourceParameters]) bytes.fill(0);
  } finally { owner?.close(); image.fill(0); }
});

async function checkPeer(peer) {
  const receipt = await peer.receipt();
  assert.equal(receipt.total_client_requests, 5);
  assert.equal(receipt.entry_request_verified, true);
  assert.equal(receipt.source_wait_boundary, true);
  assert.equal(receipt.movement_requests_verified, 0);
  assert.equal(receipt.official_session, false);
}

if (process.env.MOLI_DISPLAY_HOST === 'web') {
  const require = createRequire(import.meta.url);
  const { chromium } = require(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for (const mobile of [false, true]) {
    test(`legacy display startup paints 640×480 in ${mobile ? 'mobile' : 'desktop'} Web`, async () => {
      const temp = await mkdtemp(join(tmpdir(), 'moli-display-entry-'));
      let peer, bridge, browser;
      try {
        const folder = join(temp, 'Game'), startupPath = join(temp, 'startup.json');
        for (const row of assets.files) {
          const path = join(folder, row.path);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, Buffer.from(row.bytesHex, 'hex'));
        }
        await writeFile(startupPath, material());
        peer = await bootstrapOriginalPeer('position-before-unit', 0);
        bridge = await createLauncherLoopbackServer({ sourceProfile: 'legacy', gameCode: 2, label: 'Original display startup',
          endpoints: [{ address: '127.0.0.1', port: peer.port }] });
        browser = await chromium.launch({ channel: 'chrome', headless: true });
        const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1100, height: 850 }, isMobile: mobile, hasTouch: mobile });
        const unexpected = [];
        await context.route('**/*', route => {
          if (new URL(route.request().url()).origin === bridge.origin) return route.continue();
          unexpected.push(route.request().url()); return route.abort();
        });
        const page = await context.newPage();
        page.on('pageerror', error => unexpected.push(error.message));
        await page.goto(bridge.origin + '/web/game.html');
        await page.locator('#game-startup').setInputFiles(startupPath);
        await page.locator('#game-folder').setInputFiles(folder);
        await page.locator('#game-connect').click();
        await page.getByRole('button', { name: '请求版本升级', exact: true }).click();
        await page.getByRole('button', { name: '返回人物列表', exact: true }).click();
        await page.getByRole('button', { name: '下一外观 OriginalA', exact: true }).click();
        await page.getByRole('button', { name: '进入 OriginalA', exact: true }).click();
        assert.equal((await peer.stage()).stage, 'initial-sent');
        assert.equal(await page.locator('#game-stage').isVisible(), false);
        peer.release();
        assert.equal((await peer.stage()).stage, 'released');
        await page.locator('#game-stage').waitFor({ state: 'visible', timeout: 10000 });
        const pixels = await page.locator('#game-canvas').evaluate(canvas => ({ width: canvas.width, height: canvas.height,
          hasPixels: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(value => value !== 0) }));
        assert.deepEqual(pixels, { width: 640, height: 480, hasPixels: true });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(unexpected, []);
        await page.locator('#game-disconnect').click();
        await checkPeer(peer);
      } finally { await browser?.close(); await bridge?.close(); await peer?.close(); await rm(temp, { recursive: true, force: true }); }
    });
  }
}

if (process.env.MOLI_DISPLAY_HOST === 'wechat') {
  const { environment, until, cleared, event } = await import('../game-wechat-page-v1/page-test.mjs');
  test('legacy display startup paints 640×480 in WeChat Page', async () => {
    const peer = await bootstrapOriginalPeer('position-before-unit', 1), env = environment(peer), page = env.startPage();
    try {
      await until(page, view => view.canvasReady);
      env.select(new Uint8Array(Buffer.from(material())));
      assert.equal(await page.onStartup(), true);
      assert.equal(await page.onResources(), true);
      const started = page.onConnect();
      await until(page, view => view.state === 'choosing');
      await page.onCharacter(event({ action: 'upgrade' }));
      await until(page, view => view.versionState === 'upgrade-success');
      await page.onCharacter(event({ action: 'version-back' }));
      await until(page, view => view.state === 'choosing' && view.characters[1]?.options.previous);
      await page.onCharacter(event({ action: 'appearance', slot: '1', direction: '3' }));
      const entered = page.onCharacter(event({ action: 'enter', slot: '1' }));
      assert.equal((await peer.stage()).stage, 'initial-sent');
      assert.equal(page.data.hasFrame, false);
      peer.release();
      assert.equal((await peer.stage()).stage, 'released');
      await until(page, view => view.state === 'playing' && view.hasFrame && view.canTouch);
      assert.ok(env.frames.some(frame => frame.width === 640 && frame.height === 480 && frame.nonzero));
      assert.equal(await entered, true);
      await started;
      page.onDisconnect();
      cleared(env, page);
      await checkPeer(peer);
    } finally { page.onUnload(); await peer.close(); }
  });
}

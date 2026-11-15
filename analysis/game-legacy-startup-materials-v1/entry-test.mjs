/** Local source-bound acceptance. Handoff, resources and TCP replies are original fixtures. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { assets, startup } from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import { prepareLegacyGameStartup } from '../../shared/index.mjs';

const source = JSON.parse(await readFile(new URL('source-check.json', import.meta.url))).legacy;
const image = resolve(source.file.path);
const hash = (algorithm, bytes) => createHash(algorithm).update(bytes).digest('hex');
const checkedImage = await readFile(image);
assert.equal(checkedImage.length, source.file.bytes);
assert.equal(hash('sha256', checkedImage), source.file.sha256);
assert.equal(hash('md5', checkedImage), source.module_file_md5);
checkedImage.fill(0);
const moduleName = 'cg_se_6000.exe';
const material = () => {
  const input = startup();
  input.schema = 'moli.legacy-game-startup.v2';
  delete input.moduleDigestHex;
  return input;
};

async function startPeer() {
  const child = spawn('python3', ['-B', fileURLToPath(new URL('original_peer.py', import.meta.url)), source.module_file_md5], { stdio: ['ignore', 'pipe', 'pipe'] });
  const lines = createInterface({ input: child.stdout }), output = lines[Symbol.asyncIterator]();
  let diagnostics = '';
  child.stderr.on('data', bytes => { diagnostics += bytes; });
  const exit = once(child, 'exit');
  const address = await output.next();
  assert.equal(address.done, false, diagnostics);
  return {
    port: JSON.parse(address.value).port,
    async verify() {
      const receipt = await output.next();
      assert.equal((await exit)[0], 0, diagnostics);
      assert.deepEqual(JSON.parse(receipt.value), { authentication_fields_match: true, list_request_match: true, normal_close: true });
    },
    async close() { if (child.exitCode === null && child.signalCode === null) child.kill(); await exit; lines.close(); },
  };
}

test('legacy startup v2 snapshots context before local file I/O', async () => {
  let size;
  const ready = new Promise(resolveSize => { size = resolveSize; });
  const input = material();
  const pending = prepareLegacyGameStartup(input, { stat: () => ready, read: () => readFile(image) });
  input.context.display.width = 1;
  size(source.file.bytes);
  const owner = await pending;
  try {
    const copy = owner.copy();
    assert.equal(copy.context.display.width, 320);
    assert.equal(Buffer.from(copy.moduleDigestBytes).toString('ascii'), source.module_file_md5);
  } finally { owner.close(); }
});

if (process.env.MOLI_STARTUP_HOST === 'web') {
  const require = createRequire(import.meta.url);
  const { chromium } = require(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for (const mobile of [false, true]) {
    test(`legacy startup v2 ${mobile ? 'mobile' : 'desktop'} Web file selection and roster`, async () => {
      const temp = await mkdtemp(join(tmpdir(), 'moli-legacy-module-'));
      let peer, bridge, browser;
      try {
        const folder = join(temp, 'Game'), json = join(temp, 'startup.json');
        for (const row of assets.files) {
          const path = join(folder, row.path);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, Buffer.from(row.bytesHex, 'hex'));
        }
        await writeFile(json, JSON.stringify(material()));
        peer = await startPeer();
        bridge = await createLauncherLoopbackServer({ sourceProfile: 'legacy', endpoints: [{ address: '127.0.0.1', port: peer.port }], gameCode: 2, label: 'Original module startup' });
        browser = await chromium.launch({ channel: 'chrome', headless: true });
        const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1100, height: 850 }, isMobile: mobile, hasTouch: mobile });
        const external = [];
        await context.route('**/*', route => {
          if (new URL(route.request().url()).origin === bridge.origin) return route.continue();
          external.push(route.request().url());
          return route.abort();
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(bridge.origin + '/web/game.html');
        await page.waitForFunction(async () => (await import('/web/game-app.mjs')).inspectGamePage().configured);
        const jsonInput = page.locator('#game-startup'), folderInput = page.locator('#game-folder'), connect = page.locator('#game-connect');
        await jsonInput.setInputFiles(json);
        await folderInput.setInputFiles(folder);
        await connect.click();
        await page.waitForFunction(() => document.querySelector('#game-status').textContent.includes('cg_se_6000.exe'));
        assert.equal(bridge.snapshot().connectionAttempts, 0);
        const selectedImage = join(folder, moduleName);
        await writeFile(selectedImage, new Uint8Array(source.file.bytes));
        await folderInput.setInputFiles(folder);
        await connect.click();
        await page.waitForFunction(() => document.querySelector('#game-status').textContent.includes('cg_se_6000.exe'));
        assert.equal(bridge.snapshot().connectionAttempts, 0);
        await copyFile(image, selectedImage);
        await folderInput.setInputFiles(folder);
        await connect.click();
        const choices = page.getByRole('button', { name: /^进入 Original/ });
        await choices.first().waitFor({ timeout: 10000 });
        assert.equal(await choices.count(), 2);
        assert.equal(await jsonInput.inputValue(), '');
        assert.equal(await folderInput.inputValue(), '');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
        await page.locator('#game-disconnect').click();
        await peer.verify();
      } finally {
        await browser?.close();
        await bridge?.close();
        await peer?.close();
        await rm(temp, { recursive: true, force: true });
      }
    });
  }
}

if (process.env.MOLI_STARTUP_HOST === 'wechat') {
  const { environment, until, cleared } = await import('../game-wechat-page-v1/page-test.mjs');
  function zipWithModule() {
    const result = spawnSync('python3', ['-B', '-c', `
import io,json,sys,zipfile
out=io.BytesIO()
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as archive:
    for row in json.load(sys.stdin):
        archive.writestr(row['path'],bytes.fromhex(row['bytesHex']))
    archive.write(sys.argv[1], 'cg_se_6000.exe')
sys.stdout.buffer.write(out.getvalue())
`, image], { input: JSON.stringify(assets.files), maxBuffer: 8 * 1024 * 1024 });
    assert.equal(result.status, 0, result.stderr.toString('utf8'));
    return new Uint8Array(result.stdout);
  }
  const selectJSON = env => env.select(new Uint8Array(Buffer.from(JSON.stringify(material()))));

  test('legacy startup v2 WeChat Page rejects missing resources then reaches roster', async () => {
    const peer = await startPeer(), env = environment(peer), page = env.startPage();
    let zip;
    try {
      await until(page, view => view.canvasReady);
      selectJSON(env);
      assert.equal(await page.onStartup(), false);
      assert.equal(page.data.errorCode, 'LEGACY_CLIENT_STARTUP_MODULE');
      assert.equal(page.data.canConnect, false);
      assert.equal(env.stats.created, 0);
      zip = zipWithModule();
      env.select(zip);
      assert.equal(await page.onResources(), true);
      selectJSON(env);
      assert.equal(await page.onStartup(), true);
      assert.equal(page.data.canConnect, true);
      assert.equal(env.stats.created, 0);
      const started = page.onConnect();
      await until(page, view => view.state === 'choosing');
      assert.deepEqual(page.data.characters.map(row => row.name), ['OriginalA', 'OriginalB']);
      assert.equal(env.stats.created, 1);
      await started;
      page.onDisconnect();
      cleared(env, page);
      await peer.verify();
    } finally { page.onUnload(); zip?.fill(0); await peer.close(); }
  });

  test('legacy startup v2 WeChat Page discards late startup selection after unload', async () => {
    const env = environment(), page = env.startPage();
    try {
      await until(page, view => view.canvasReady);
      env.hold(true);
      selectJSON(env);
      const picking = page.onStartup();
      assert.equal(env.pending.length, 1);
      page.onUnload();
      env.pending.shift()();
      assert.equal(await picking, false);
      assert.equal(page.data.hasStartup, false);
      assert.equal(env.stats.created, 0);
    } finally { page.onUnload(); }
  });
}

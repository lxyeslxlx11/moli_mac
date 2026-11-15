/** Config-derived resource paths through the product's file inputs and ordinary local login. */
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

const evidence = JSON.parse(await readFile(new URL('source-check.json', import.meta.url)));
const image = resolve(evidence.source.path), imageName = 'cg_se_6000.exe';
const originalBytes = await readFile(image);
assert.equal(originalBytes.length, evidence.source.bytes);
assert.equal(createHash('sha256').update(originalBytes).digest('hex'), evidence.source.sha256);
const moduleDigest = createHash('md5').update(originalBytes).digest('hex');
const root = 'ConfiguredBin', tail = 'binfolder:UnavailableBin ';
const config = Buffer.from(`binfolder:${root}\r\ngraphicbin:98765\r\n`);
const files = assets.files.map(row => ({ ...row, path: row.path.replace(/^bin[\\/]/i, `${root}/`) }));
assert.ok(files.some(row => row.path.startsWith(`${root}/`)));
const material = () => {
  const input = startup();
  input.schema = 'moli.legacy-game-startup.v2';
  delete input.moduleDigestHex;
  delete input.resourceParametersHex;
  input.commandTailHex = Buffer.from(tail).toString('hex');
  return input;
};

async function withPeer(run) {
  const script = fileURLToPath(new URL('../game-legacy-startup-materials-v1/original_peer.py', import.meta.url));
  const child = spawn('python3', ['-B', script, moduleDigest], { stdio: ['ignore', 'pipe', 'pipe'] });
  const exit = once(child, 'exit');
  let stderr = '';
  child.stderr.on('data', bytes => { stderr += bytes; });
  const lines = createInterface({ input: child.stdout }), output = lines[Symbol.asyncIterator]();
  try {
    const address = await output.next();
    assert.equal(address.done, false, stderr);
    await run(JSON.parse(address.value).port);
    const receipt = await output.next();
    assert.equal((await exit)[0], 0, stderr);
    assert.deepEqual(JSON.parse(receipt.value), { authentication_fields_match: true, list_request_match: true, normal_close: true });
  } finally { if (child.exitCode === null && child.signalCode === null) child.kill(); await exit; lines.close(); }
}

test('legacy config startup reads a 256-byte prefix, detects short reads and accepts an absent file', async () => {
  const padded = Buffer.alloc(256, 32);
  config.copy(padded);
  const readSizes = [];
  let size = 1000000, configBytes = padded;
  const port = {
    stat(name) { return name === imageName ? originalBytes.length : name === 'Config.dat' ? size : assert.fail(name); },
    read(name, offset, length) {
      assert.equal(offset, 0);
      if (name === imageName) return originalBytes;
      assert.equal(name, 'Config.dat');
      readSizes.push(length);
      return configBytes;
    },
  };
  const prepared = await prepareLegacyGameStartup(material(), port);
  try {
    assert.equal(prepared.inspect().configFromSelectedFiles, true);
    assert.equal(Buffer.from(prepared.copy().resourceParameters).toString(), `binfolder:${root}\n${tail}`);
  }
  finally { prepared.close(); }
  configBytes = padded.subarray(0, 255);
  await assert.rejects(prepareLegacyGameStartup(material(), port), { code: 'LEGACY_CLIENT_STARTUP_CONFIG_READ' });
  size = null;
  const fallback = await prepareLegacyGameStartup(material(), port);
  try { assert.equal(Buffer.from(fallback.copy().resourceParameters).toString(), tail); }
  finally { fallback.close(); }
  assert.deepEqual(readSizes, [256, 256]);
});

if (process.env.MOLI_CONFIG_HOST === 'web') {
  const require = createRequire(import.meta.url);
  const { chromium } = require(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for (const mobile of [false, true]) {
    test(`legacy config startup uses the configured asset root in ${mobile ? 'mobile' : 'desktop'} Web`, async () => withPeer(async port => {
      const temp = await mkdtemp(join(tmpdir(), 'moli-config-startup-'));
      let bridge, browser;
      try {
        const folder = join(temp, 'Game'), input = join(temp, 'startup.json');
        for (const file of files) {
          const path = join(folder, file.path);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, Buffer.from(file.bytesHex, 'hex'));
        }
        await copyFile(image, join(folder, imageName));
        await writeFile(join(folder, 'config.dat'), config);
        await writeFile(input, JSON.stringify(material()));
        bridge = await createLauncherLoopbackServer({ sourceProfile: 'legacy', gameCode: 2, label: 'Original config startup',
          endpoints: [{ address: '127.0.0.1', port }] });
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
        await page.locator('#game-startup').setInputFiles(input);
        await page.locator('#game-folder').setInputFiles(folder);
        await page.locator('#game-connect').click();
        const choices = page.getByRole('button', { name: /^进入 Original/ });
        await choices.first().waitFor({ timeout: 10000 });
        assert.equal(await choices.count(), 2);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(unexpected, []);
        assert.equal(bridge.snapshot().connectionAttempts, 1);
        await page.locator('#game-disconnect').click();
      } finally { await browser?.close(); await bridge?.close(); await rm(temp, { recursive: true, force: true }); }
    }));
  }
}

if (process.env.MOLI_CONFIG_HOST === 'wechat') {
  const { environment, until, cleared } = await import('../game-wechat-page-v1/page-test.mjs');
  test('legacy config startup uses the configured asset root in WeChat Page', async () => withPeer(async port => {
    const archive = spawnSync('python3', ['-B', '-c', `
import io,json,sys,zipfile
out=io.BytesIO()
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as archive:
    for row in json.load(sys.stdin):archive.writestr(row['path'],bytes.fromhex(row['bytesHex']))
    archive.write(sys.argv[1], 'cg_se_6000.exe')
sys.stdout.buffer.write(out.getvalue())
`, image], { input: JSON.stringify([...files, { path: 'config.dat', bytesHex: config.toString('hex') }]), maxBuffer: 8 * 1024 * 1024 });
    assert.equal(archive.status, 0, archive.stderr.toString());
    const zip = new Uint8Array(archive.stdout), env = environment({ port }), page = env.startPage();
    try {
      await until(page, view => view.canvasReady);
      env.select(zip);
      assert.equal(await page.onResources(), true);
      env.select(new Uint8Array(Buffer.from(JSON.stringify(material()))));
      assert.equal(await page.onStartup(), true);
      env.select(Uint8Array.of(0));
      assert.equal(await page.onResources(), false);
      assert.equal(page.data.hasStartup, true);
      env.select(zip);
      assert.equal(await page.onResources(), true);
      assert.equal(page.data.hasStartup, false);
      assert.equal(page.data.canConnect, false);
      env.select(new Uint8Array(Buffer.from(JSON.stringify(material()))));
      assert.equal(await page.onStartup(), true);
      assert.equal(env.stats.created, 0);
      const started = page.onConnect();
      await until(page, view => view.state === 'choosing');
      assert.deepEqual(page.data.characters.map(row => row.name), ['OriginalA', 'OriginalB']);
      assert.equal(env.stats.created, 1);
      await started;
      page.onDisconnect();
      cleared(env, page);
    } finally { page.onUnload(); zip.fill(0); }
  }));
}

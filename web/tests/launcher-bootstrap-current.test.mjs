import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { computeLauncherFileMd5, decodeWin32LauncherUpdatePackage } from '../../shared/index.mjs';
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createLauncherBootstrap, createWin32LauncherBootstrap } from '../launcher-bootstrap.mjs';
import { BOOTSTRAP_FIXTURES as data, createLauncherBootstrapFixture } from './helpers/launcher-bootstrap-fixture.mjs';

const utf8 = text => new TextEncoder().encode(text), calls = [];
const good = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json', import.meta.url))).cases.find(row => row.name === 'deflated-header');
const archive = Uint8Array.from(Buffer.from(good.archive_hex, 'hex'));
let fixture, bootstrap, client;
before(async () => {
  fixture = await createLauncherBootstrapFixture();
  client = createLauncherHttpClient({ allowedOrigins: [fixture.origin] });
  bootstrap = createWin32LauncherBootstrap({ cacheTick: () => 100 + calls.length,
    httpClient: { getBytes(url, options) { calls.push({ url, kind: options.kind }); return client.getBytes(url, options); } } });
});
after(async () => { await fixture.close(); });
const base = extra => ({ launcherBytes: data.launcher, gameListBytes: data.oldGames, regionListBytes: data.oldRegions,
  endpoints: fixture.endpoints, encoding: 'utf-8', allowBareAmpersands: false, ...extra });
const reset = () => { fixture.reset(); calls.length = 0; };
const paths = () => fixture.requests.map(row => row.path);
const code = (task, expected) => assert.rejects(task, error => error.code === expected);
function packageResponse() {
  fixture.set('/self', { body: utf8(good.expected_md5) });
  fixture.set('/locator', { body: utf8(fixture.origin + '/package ' + archive.length) });
  fixture.set('/package', { body: archive });
}
const fourPaths = ['/self', '/hashes', '/games', '/regions'];

test('legacy factory still ignores unrelated cacheTick accessors and sends no new query', async () => {
  reset(); let reads = 0;
  const loader = createLauncherBootstrap({ httpClient: client, get cacheTick() { reads++; throw Error('Original ignored option'); } });
  const value = await loader.prepare(base());
  assert.equal(reads, 0);
  assert.equal(value.disposition, 'catalogs-prepared');
  assert.equal(value.profile, undefined);
  assert.deepEqual(paths(), fourPaths);
});

test('current HTTP profile fetches both catalogs in order with cache ticks and owned byte comparison', async () => {
  reset();
  const value = await bootstrap.prepare(base());
  assert.deepEqual(paths(), fourPaths);
  assert.deepEqual(calls.map(row => new URL(row.url).search), ['?rtm=100', '?rtm=101', '?rtm=102', '?rtm=103']);
  assert.deepEqual(calls.map(row => row.kind), ['metadata', 'metadata', 'catalog', 'catalog']);
  assert.equal(value.profile, 'win32-current-metadata-v1');
  assert.equal(value.disposition, 'catalogs-prepared');
  assert.equal(value.comparison.requiresReplacement, true);
  assert.equal(value.comparison.gameList, 'different');
  assert.equal(value.comparison.regionList, 'different');
  assert.equal(value.catalogDigestMetadata.use, 'request-success-only');
  assert.equal(value.containers.validation, 'containers-only');
  assert.equal(value.catalogs.gameListMd5, computeLauncherFileMd5(data.newGames));
  assert.equal(value.catalogs.regionListMd5, computeLauncherFileMd5(data.newRegions));
  for (const key of ['authentication', 'trust']) assert.equal(value[key], 'unverified');
  assert.equal(value.execution, 'not-performed');
  assert.ok(Object.isFrozen(value) && Object.isFrozen(value.catalogDigestMetadata));
});

test('all four catalog change combinations always fetch both files and compare actual bytes', async () => {
  for (const gameChanged of [false, true]) for (const regionChanged of [false, true]) {
    reset();
    const value = await bootstrap.prepare(base({ gameListBytes: gameChanged ? data.oldGames : data.newGames,
      regionListBytes: regionChanged ? data.oldRegions : data.newRegions }));
    assert.deepEqual(paths(), fourPaths);
    assert.equal(value.comparison.gameList, gameChanged ? 'different' : 'identical');
    assert.equal(value.comparison.regionList, regionChanged ? 'different' : 'identical');
    assert.equal(value.comparison.requiresReplacement, gameChanged || regionChanged);
  }
});

test('the marker HTTP body is not parsed as catalog digest tokens, including empty or nontext bytes', async () => {
  for (const body of [utf8('not a digest pair'), new Uint8Array(), Uint8Array.of(0, 255, 1)]) {
    reset(); fixture.set('/hashes', { body });
    const value = await bootstrap.prepare(base({ gameListBytes: null, regionListBytes: null }));
    assert.deepEqual(paths(), fourPaths);
    assert.equal(value.catalogDigestMetadata.bytes, body.length);
    assert.equal(value.comparison.gameList, 'unavailable');
    assert.equal(value.comparison.regionList, 'unavailable');
    assert.equal(value.comparison.requiresReplacement, true);
  }
});

test('mismatching self downloads a strict Win32 candidate; package URL receives no main-worker cache tick', async () => {
  reset(); packageResponse();
  const value = await bootstrap.prepare(base({ gameListBytes: utf8('unused original bytes'), regionListBytes: null }));
  assert.deepEqual(paths(), ['/self', '/locator', '/package']);
  assert.deepEqual(calls.map(row => new URL(row.url).search), ['?rtm=100', '?rtm=101', '']);
  assert.equal(value.disposition, 'launcher-update-candidate');
  assert.equal(value.catalogs, null);
  assert.equal(value.update.actualMd5, good.expected_md5);
  assert.equal(value.update.expectedArchiveBytes, archive.length);
  assert.equal(value.update.profile, 'win32-gui-single-exe-v1');
  assert.equal(value.update.executable.validation, 'header-profile-only');
  assert.equal(value.update.replacement, 'not-performed');
});

test('uppercase matching canonical MD5 still follows the native case-sensitive update branch', async () => {
  reset(); packageResponse(); fixture.set('/self', { body: utf8(good.expected_md5.toUpperCase()) });
  const candidate = decodeWin32LauncherUpdatePackage(archive, { expectedMd5: good.expected_md5, expectedArchiveBytes: archive.length });
  const value = await bootstrap.prepare(base({ launcherBytes: candidate.payloadBytes }));
  assert.equal(value.plan.launcher.localMd5, value.plan.launcher.remoteMd5);
  assert.equal(value.plan.launcher.matches, false);
  assert.deepEqual(paths(), ['/self', '/locator', '/package']);
});

test('declared size is checked against the independent budget before any package GET', async () => {
  reset(); packageResponse(); fixture.set('/locator', { body: utf8(fixture.origin + '/package 33554433') });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_PACKAGE_BUDGET');
  assert.deepEqual(paths(), ['/self', '/locator']);
  reset(); packageResponse(); fixture.set('/locator', { body: utf8(fixture.origin + '/package ' + (archive.length + 1)) });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA');
  assert.deepEqual(paths(), ['/self', '/locator', '/package']);
});

test('strict package validation still rejects CRC damage before returning any candidate', async () => {
  reset(); packageResponse();
  const damaged = archive.slice(); damaged[40] ^= 1; fixture.set('/package', { body: damaged });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA');
  assert.deepEqual(paths(), ['/self', '/locator', '/package']);
});

test('a malformed self response, locator or unsuccessful marker stops dependent requests', async () => {
  reset(); fixture.set('/self', { body: utf8('invalid') });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self']);
  reset(); packageResponse(); fixture.set('/locator', { body: utf8('file:opaque 1') });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self', '/locator']);
  reset(); fixture.set('/hashes', { status: 500 });
  await code(bootstrap.prepare(base()), 'HTTP_STATUS'); assert.deepEqual(paths(), ['/self', '/hashes']);
  reset(); fixture.set('/games', { status: 500 });
  await code(bootstrap.prepare(base()), 'HTTP_STATUS'); assert.deepEqual(paths(), ['/self', '/hashes', '/games']);
});

test('a successful marker cannot admit wrong XML schema, malformed encoding or empty game semantics', async () => {
  for (const invalid of [utf8('<Wrong/>'), Uint8Array.of(255), utf8('<Gamelist><Games/></Gamelist>')]) {
    reset(); fixture.set('/games', { body: invalid });
    await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA');
    assert.deepEqual(paths(), fourPaths);
  }
});

test('current inputs and endpoint data are snapshotted before asynchronous work', async () => {
  reset();
  let entered, release;
  const entry = new Promise(resolve => { entered = resolve; }), held = new Promise(resolve => { release = resolve; });
  let first = true;
  const loader = createWin32LauncherBootstrap({ cacheTick: () => 0,
    httpClient: { async getBytes(...args) { if (first) { first = false; entered(); await held; } return client.getBytes(...args); } } });
  const games = data.newGames.slice(), regions = data.newRegions.slice(), launcher = data.launcher.slice(), endpoints = { ...fixture.endpoints };
  const task = loader.prepare(base({ launcherBytes: launcher, gameListBytes: games, regionListBytes: regions, endpoints }));
  await entry;
  games.fill(0); regions.fill(0); launcher.fill(0); endpoints.gameList = 'http://blocked.example.invalid/a'; release();
  const value = await task;
  assert.equal(value.comparison.requiresReplacement, false);
  assert.deepEqual(paths(), fourPaths);
  value.catalogs.gameListBytes.fill(0);
  assert.notEqual(data.newGames[0], 0);
});

test('own initialization fields and explicit decoding are required before network work', async () => {
  reset(); let reads = 0;
  const accessor = base(); Object.defineProperty(accessor, 'launcherBytes', { get() { reads++; return data.launcher; } });
  const endpoints = { ...fixture.endpoints }; Object.defineProperty(endpoints, 'gameList', { get() { reads++; return fixture.endpoints.gameList; } });
  for (const input of [Object.create(base()), accessor, base({ unknown: 1 }), base({ [Symbol('extra')]: 1 }), base({ endpoints }),
    base({ encoding: 'guess' }), base({ allowBareAmpersands: 1 }), base({ signal: {} }), base({ timeoutMs: 0 })]) {
    await code(bootstrap.prepare(input), 'BOOTSTRAP_INPUT');
  }
  assert.equal(reads, 0); assert.deepEqual(paths(), []);
});

test('cache ticks retain existing queries and duplicate rtm values without normalizing source strings', async () => {
  reset();
  const endpoints = Object.fromEntries(Object.entries(fixture.endpoints).map(([key, value]) => [key, value + '?old=1&rtm=9']));
  await bootstrap.prepare(base({ endpoints }));
  assert.deepEqual(calls.map(row => new URL(row.url).search), [
    '?old=1&rtm=9&rtm=100', '?old=1&rtm=9&rtm=101', '?old=1&rtm=9&rtm=102', '?old=1&rtm=9&rtm=103']);
  for (const tick of [-1, 1.5, NaN, 0x100000000, '1']) {
    const loader = createWin32LauncherBootstrap({ httpClient: client, cacheTick: () => tick });
    await code(loader.prepare(base()), 'BOOTSTRAP_INPUT');
  }
  assert.equal(paths().length, 4);
});

test('native prefix validation does not grant extra origins or accept undownloadable full URLs', async () => {
  reset(); packageResponse(); fixture.set('/locator', { body: utf8('https://blocked.example.invalid/u.zip 42') });
  await code(bootstrap.prepare(base()), 'HTTP_ORIGIN'); assert.deepEqual(paths(), ['/self', '/locator']);
  reset(); packageResponse(); fixture.set('/locator', { body: utf8('http://host:bad/u.zip 42') });
  await code(bootstrap.prepare(base()), 'HTTP_INPUT'); assert.deepEqual(paths(), ['/self', '/locator']);
});

test('one deadline covers hung providers and delayed synchronous work across multiple requests', async () => {
  const hung = createWin32LauncherBootstrap({ httpClient: { getBytes() { return new Promise(() => {}); } } });
  await code(hung.prepare(base({ timeoutMs: 10 })), 'BOOTSTRAP_TIMEOUT');
  let count = 0;
  const busy = createWin32LauncherBootstrap({ cacheTick: () => 0,
    httpClient: { async getBytes() { const until = performance.now() + 20; while (performance.now() < until) {} count++;
      return { bytes: count === 1 ? utf8(computeLauncherFileMd5(data.launcher)) : new Uint8Array() }; } } });
  await code(busy.prepare(base({ timeoutMs: 35 })), 'BOOTSTRAP_TIMEOUT');
  assert.equal(count, 2);
});

test('cancellation before or during a request does not disturb concurrent prepares', async () => {
  reset(); const controller = new AbortController(); controller.abort();
  await code(bootstrap.prepare(base({ signal: controller.signal })), 'BOOTSTRAP_ABORTED'); assert.deepEqual(paths(), []);
  const active = new AbortController();
  const one = bootstrap.prepare(base({ signal: active.signal })), two = bootstrap.prepare(base()); active.abort();
  const values = await Promise.allSettled([one, two]);
  assert.equal(values[0].reason.code, 'BOOTSTRAP_ABORTED');
  assert.equal(values[1].value.disposition, 'catalogs-prepared');
});

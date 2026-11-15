import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { computeLauncherFileMd5 } from '../../shared/index.mjs';
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createLauncherBootstrap } from '../launcher-bootstrap.mjs';
import { BOOTSTRAP_FIXTURES as data, createLauncherBootstrapFixture } from './helpers/launcher-bootstrap-fixture.mjs';
let fixture, bootstrap;
before(async () => { fixture = await createLauncherBootstrapFixture(); bootstrap = createLauncherBootstrap({ httpClient: createLauncherHttpClient({ allowedOrigins: [fixture.origin] }) }); });
after(async () => { await fixture.close(); });
const utf8 = text => new TextEncoder().encode(text), paths = () => fixture.requests.filter(r => !r.path.startsWith('/web/')).map(r => r.path);
const base = extra => ({ launcherBytes: data.launcher, gameListBytes: data.oldGames, regionListBytes: data.oldRegions,
  endpoints: fixture.endpoints, encoding: 'utf-8', allowBareAmpersands: false, ...extra });
const code = (task, expected) => assert.rejects(task, e => e.code === expected);
const hashes = (games = data.newGames, regions = data.newRegions) => utf8(`${computeLauncherFileMd5(games)}\n${computeLauncherFileMd5(regions)}\n`);

test('actual initialization fetches both changed catalogs in source order and returns parsed owned candidates', async () => {
  fixture.reset(); const value = await bootstrap.prepare(base());
  assert.equal(value.disposition, 'catalogs-prepared'); assert.deepEqual(paths(), ['/self', '/hashes', '/games', '/regions']);
  assert.deepEqual(value.initialPlan.catalogs.refreshOrder, ['gameList', 'regionList']);
  assert.deepEqual(value.catalogs.gameListBytes, data.newGames); assert.deepEqual(value.catalogs.regionListBytes, data.newRegions);
  assert.equal(value.catalogs.games.games.length, 2); assert.equal(value.catalogs.regions.regions.length, 3);
  assert.equal(value.authentication, 'unverified'); assert.equal(value.trust, 'unverified'); assert.equal(value.execution, 'not-performed');
});

test('all four independent catalog change combinations fetch only required files', async () => {
  for (const gameChanged of [false, true]) for (const regionChanged of [false, true]) {
    fixture.reset(); const value = await bootstrap.prepare(base({ gameListBytes: gameChanged ? data.oldGames : data.newGames, regionListBytes: regionChanged ? data.oldRegions : data.newRegions }));
    assert.deepEqual(paths(), ['/self', '/hashes', ...(gameChanged ? ['/games'] : []), ...(regionChanged ? ['/regions'] : [])]);
    assert.equal(value.disposition, 'catalogs-prepared');
  }
});

test('self mismatch downloads and verifies only the update candidate, without XML requests or parsing', async () => {
  fixture.reset(); fixture.set('/self', { body: utf8(data.packageMd5) });
  const value = await bootstrap.prepare(base({ gameListBytes: utf8('not XML'), regionListBytes: utf8('not XML either') }));
  assert.deepEqual(paths(), ['/self', '/locator', '/package']); assert.equal(value.disposition, 'launcher-update-candidate'); assert.equal(value.catalogs, null);
  assert.equal(value.update.payloadBytes.length, 256); assert.equal(value.update.digestMatches, true); assert.equal(value.update.crcVerified, true);
  assert.equal(value.update.replacement, 'not-performed'); assert.equal(value.authentication, 'unverified');
});

test('invalid self or catalog metadata stops before any dependent request', async () => {
  fixture.reset(); fixture.set('/self', { body: utf8('invalid') }); await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self']);
  fixture.reset(); fixture.set('/hashes', { body: utf8('one-token') }); await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self', '/hashes']);
});

test('game digest mismatch stops before RegionList; a region mismatch never mutates local bytes', async () => {
  fixture.reset(); fixture.set('/hashes', { body: hashes() }); fixture.set('/games', { body: utf8('wrong bytes') });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DIGEST'); assert.deepEqual(paths(), ['/self', '/hashes', '/games']);
  fixture.reset(); fixture.set('/hashes', { body: hashes() }); fixture.set('/regions', { body: utf8('wrong region bytes') });
  const games = data.oldGames.slice(), regions = data.oldRegions.slice();
  await code(bootstrap.prepare(base({ gameListBytes: games, regionListBytes: regions })), 'BOOTSTRAP_DIGEST');
  assert.deepEqual(paths(), ['/self', '/hashes', '/games', '/regions']); assert.deepEqual(games, data.oldGames); assert.deepEqual(regions, data.oldRegions);
});

test('matching digests cannot admit a downloaded wrong XML schema or malformed encoding', async () => {
  for (const invalid of [utf8('<Wrong/>'), Uint8Array.of(255), Uint8Array.of(0)]) {
    fixture.reset(); fixture.set('/games', { body: invalid });
    await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self', '/hashes', '/games', '/regions']);
  }
});

test('an already-current but invalid local catalog is parsed and rejected without a refresh', async () => {
  fixture.reset(); const bad = utf8('<Wrong/>'); fixture.set('/hashes', { body: hashes(bad, data.newRegions) });
  await code(bootstrap.prepare(base({ gameListBytes: bad, regionListBytes: data.newRegions })), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self', '/hashes']);
});

test('all local bytes and own endpoint values are snapshotted before the first request', async () => {
  fixture.reset(); let release, entered; const entry = new Promise(resolve => { entered = resolve; }), wait = new Promise(resolve => { release = resolve; });
  const client = createLauncherHttpClient({ allowedOrigins: [fixture.origin] }); let first = true;
  const loader = createLauncherBootstrap({ httpClient: { async getBytes(...args) { if (first) { first = false; entered(); await wait; } return client.getBytes(...args); } } });
  const games = data.newGames.slice(), regions = data.newRegions.slice(), endpoints = { ...fixture.endpoints };
  const task = loader.prepare(base({ gameListBytes: games, regionListBytes: regions, endpoints })); await entry;
  games.fill(0); regions.fill(0); endpoints.catalogDigests = 'https://blocked.example.invalid/metadata'; release();
  const value = await task; assert.equal(value.disposition, 'catalogs-prepared'); assert.deepEqual(paths(), ['/self', '/hashes']); assert.deepEqual(value.catalogs.gameListBytes, data.newGames);
});

test('one total monotonic deadline spans multiple requests even when timer dispatch is delayed', async () => {
  const calls = []; const bodies = { [fixture.endpoints.launcherDigest]: utf8(computeLauncherFileMd5(data.launcher)), [fixture.endpoints.catalogDigests]: hashes() };
  const loader = createLauncherBootstrap({ httpClient: { async getBytes(url) { calls.push(url); const until = performance.now() + 20; while (performance.now() < until) {} return { bytes: bodies[url] }; } } });
  await code(loader.prepare(base({ timeoutMs: 35 })), 'BOOTSTRAP_TIMEOUT'); assert.equal(calls.length, 2);
});

test('ignored cancellation and late provider failures cannot escape the initialization deadline', async () => {
  const hung = createLauncherBootstrap({ httpClient: { getBytes() { return new Promise(() => {}); } } }); await code(hung.prepare(base({ timeoutMs: 10 })), 'BOOTSTRAP_TIMEOUT');
  const late = createLauncherBootstrap({ httpClient: { async getBytes() { const end = performance.now() + 20; while (performance.now() < end) {} throw Error('Original private fixture failure'); } } });
  await code(late.prepare(base({ timeoutMs: 2 })), 'BOOTSTRAP_TIMEOUT');
});

test('pre-aborted initialization makes no request and cancellation isolates concurrent prepares', async () => {
  fixture.reset(); const cancelled = new AbortController(); cancelled.abort('Original private fixture reason');
  await code(bootstrap.prepare(base({ signal: cancelled.signal })), 'BOOTSTRAP_ABORTED'); assert.deepEqual(paths(), []);
  const active = new AbortController(), first = bootstrap.prepare(base({ signal: active.signal })), second = bootstrap.prepare(base()); active.abort();
  const values = await Promise.allSettled([first, second]); assert.equal(values[0].status, 'rejected'); assert.equal(values[0].reason.code, 'BOOTSTRAP_ABORTED'); assert.equal(values[1].value.disposition, 'catalogs-prepared');
});

test('normal HTTP failure stops a partial download sequence without a candidate result', async () => {
  fixture.reset(); fixture.set('/regions', { status: 500 }); await code(bootstrap.prepare(base()), 'HTTP_STATUS'); assert.deepEqual(paths(), ['/self', '/hashes', '/games', '/regions']);
});

test('downloaded package damage fails validation before returning any self-update result', async () => {
  fixture.reset(); fixture.set('/self', { body: utf8(data.packageMd5) }); const bytes = data.packageBytes.slice(); bytes[40] ^= 1; fixture.set('/package', { body: bytes });
  await code(bootstrap.prepare(base()), 'BOOTSTRAP_DATA'); assert.deepEqual(paths(), ['/self', '/locator', '/package']);
});

test('endpoint accessors, invalid options and byte budgets fail before network I/O', async () => {
  fixture.reset(); let invoked = false; const endpoints = { ...fixture.endpoints }; Object.defineProperty(endpoints, 'gameList', { get() { invoked = true; return fixture.endpoints.gameList; } });
  await code(bootstrap.prepare(base({ endpoints })), 'BOOTSTRAP_INPUT'); assert.equal(invoked, false);
  for (const extra of [{ encoding: 'guess' }, { allowBareAmpersands: 1 }, { timeoutMs: 0 }, { signal: {} }, { gameListBytes: new Uint8Array(1024 * 1024 + 1) }]) await assert.rejects(bootstrap.prepare(base(extra)));
  assert.deepEqual(paths(), []);
});

test('an unselected locator origin is refused before any external request', async () => {
  fixture.reset(); fixture.set('/self', { body: utf8(data.packageMd5) }); fixture.set('/locator', { body: utf8('https://blocked.example.invalid/package 372') });
  await code(bootstrap.prepare(base()), 'HTTP_ORIGIN'); assert.deepEqual(paths(), ['/self', '/locator']);
});

test('arbitrary provider messages and parse contents are not copied into bootstrap errors', async () => {
  const loader = createLauncherBootstrap({ httpClient: { async getBytes() { throw Error('Original private fixture detail'); } } });
  await assert.rejects(loader.prepare(base()), e => e.code === 'BOOTSTRAP_DATA' && !e.message.includes('private'));
});

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWin32LauncherCatalogRefresh } from '../launcher-catalog-refresh.mjs';
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { LauncherCandidateStoreError } from '../launcher-candidate-store.mjs';
import { snapshotLauncherCatalogCandidate } from '../launcher-catalog-data.mjs';
import { BOOTSTRAP_FIXTURES as data, bootstrapCandidate, createLauncherBootstrapFixture } from './helpers/launcher-bootstrap-fixture.mjs';

const utf8 = text => new TextEncoder().encode(text), delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let fixture, httpClient;
before(async () => { fixture = await createLauncherBootstrapFixture(); httpClient = createLauncherHttpClient({ allowedOrigins: [fixture.origin] }); });
after(async () => { await fixture.close(); });
const pair = (games = data.oldGames, regions = data.oldRegions) => snapshotLauncherCatalogCandidate(bootstrapCandidate(games, regions));
const base = extra => ({ launcherBytes: data.launcher, endpoints: fixture.endpoints, encoding: 'utf-8', allowBareAmpersands: false, ...extra });
const rejects = (task, code) => assert.rejects(task, error => error.code === code && !error.message.includes('private-detail'));
const paths = () => fixture.requests.map(row => row.path);
const fourPaths = ['/self', '/hashes', '/games', '/regions'];

/** Orchestration fault model only. Actual IndexedDB transaction behavior is checked separately in Chrome. */
function cache(catalogs = pair(), hooks = {}) {
  let value = { revision: catalogs ? 1 : 0, catalogs }, reads = 0, commits = 0;
  const observations = [];
  const result = {
    get value() { return value; }, get reads() { return reads; }, get commits() { return commits; }, observations,
    externalCommit(next = pair(data.newGames, data.oldRegions)) { value = { revision: value.revision + 1, catalogs: next }; },
    async read(options) {
      reads++; observations.push({ kind: 'read', timeoutMs: options.timeoutMs });
      await hooks.read?.(result, options, reads);
      if (hooks.raw !== undefined) return hooks.raw;
      return { revision: value.revision, catalogs: value.catalogs && snapshotLauncherCatalogCandidate(value.catalogs) };
    },
    async commitPair(candidate, options) {
      commits++; observations.push({ kind: 'commit', timeoutMs: options.timeoutMs, expectedRevision: options.expectedRevision });
      await hooks.beforeCommit?.(result, options);
      if (options.signal.aborted) throw new LauncherCandidateStoreError('CACHE_ABORTED', 'private-detail');
      if (value.revision !== options.expectedRevision) throw new LauncherCandidateStoreError('CACHE_CONFLICT', 'private-detail');
      value = { revision: value.revision + 1, catalogs: snapshotLauncherCatalogCandidate(candidate) };
      const receipt = { committed: true, revision: value.revision, cancellationTooLate: false, deadlineExceededAfterCommit: false };
      return hooks.afterCommit ? hooks.afterCommit(result, options, receipt) : receipt;
    },
  };
  return result;
}
function loader(store, client = httpClient) { return createWin32LauncherCatalogRefresh({ store, httpClient: client, cacheTick: () => 17 }); }

test('empty cache fetches both XMLs and commits one whole pair at revision1', async () => {
  fixture.reset(); const store = cache(null), result = await loader(store).refresh(base());
  assert.equal(result.disposition, 'catalogs-committed'); assert.equal(result.revision, 1); assert.equal(result.committed, true);
  assert.equal(result.comparison.gameList, 'unavailable'); assert.equal(result.comparison.regionList, 'unavailable');
  assert.equal(store.reads, 1); assert.equal(store.commits, 1); assert.deepEqual(paths(), fourPaths);
  assert.deepEqual(store.value.catalogs.gameListBytes, data.newGames); assert.deepEqual(store.value.catalogs.regionListBytes, data.newRegions);
  for (const key of ['trust', 'authentication']) assert.equal(result[key], 'unverified');
  assert.equal(result.execution, 'not-performed'); assert.equal(Object.isFrozen(result), true);
  result.catalogs.gameListBytes.fill(0); assert.deepEqual(store.value.catalogs.gameListBytes, data.newGames);
});

test('all four byte-change combinations store both or skip both, including a change to only one file', async () => {
  for (const gameChanged of [false, true]) for (const regionChanged of [false, true]) {
    fixture.reset(); const store = cache(pair(gameChanged ? data.oldGames : data.newGames, regionChanged ? data.oldRegions : data.newRegions));
    const result = await loader(store).refresh(base());
    assert.equal(result.committed, gameChanged || regionChanged); assert.equal(store.commits, Number(gameChanged || regionChanged));
    assert.equal(result.revision, gameChanged || regionChanged ? 2 : 1); assert.deepEqual(paths(), fourPaths);
    assert.deepEqual(store.value.catalogs.gameListBytes, data.newGames); assert.deepEqual(store.value.catalogs.regionListBytes, data.newRegions);
  }
});

test('identical pair rechecks revision and does not increment cache revision', async () => {
  fixture.reset(); const store = cache(pair(data.newGames, data.newRegions));
  const result = await loader(store).refresh(base());
  assert.equal(result.disposition, 'catalogs-unchanged'); assert.equal(store.reads, 2); assert.equal(store.commits, 0);
});

test('an explicit XML compatibility-setting change updates cache metadata even for identical bytes', async () => {
  fixture.reset(); const store = cache(pair(data.newGames, data.newRegions));
  const result = await loader(store).refresh(base({ allowBareAmpersands: true }));
  assert.equal(result.comparison.requiresReplacement, false); assert.equal(result.cacheSettingsChanged, true);
  assert.equal(result.committed, true); assert.equal(store.value.catalogs.allowBareAmpersands, true);
});

test('self-update returns a strict candidate without a catalog write or executable operation', async () => {
  fixture.reset();
  const vector = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json', import.meta.url))).cases.find(row => row.name === 'deflated-header');
  const archive = Uint8Array.from(Buffer.from(vector.archive_hex, 'hex'));
  fixture.set('/self', { body: utf8(vector.expected_md5) }); fixture.set('/locator', { body: utf8(fixture.origin + '/package ' + archive.length) });
  fixture.set('/package', { body: archive });
  const store = cache(), result = await loader(store).refresh(base());
  assert.equal(result.disposition, 'launcher-update-candidate'); assert.equal(result.cacheCommit, 'not-performed');
  assert.equal(result.prepared.update.replacement, 'not-performed'); assert.equal(store.commits, 0); assert.equal(store.value.revision, 1);
  assert.deepEqual(paths(), ['/self', '/locator', '/package']);
});

test('failed marker, second download, or XML parse retains the previous complete pair', async () => {
  for (const [path, value] of [['/hashes', { status: 503 }], ['/regions', { status: 503 }], ['/games', { body: utf8('<invalid/>') }]]) {
    fixture.reset(); fixture.set(path, value); const store = cache();
    await rejects(loader(store).refresh(base()), 'REFRESH_DATA');
    assert.equal(store.commits, 0); assert.equal(store.value.revision, 1);
    assert.deepEqual(store.value.catalogs.gameListBytes, data.oldGames); assert.deepEqual(store.value.catalogs.regionListBytes, data.oldRegions);
  }
});

test('one deadline covers cache read and HTTP rather than restarting per stage', async () => {
  fixture.reset(); fixture.set('/regions', { delayMs: 150 });
  const store = cache(pair(), { async read() { await delay(100); } });
  await rejects(loader(store).refresh(base({ timeoutMs: 200 })), 'REFRESH_TIMEOUT');
  assert.equal(store.commits, 0); assert.equal(store.value.revision, 1);
});

test('pre-aborted input performs no cache or HTTP operations', async () => {
  fixture.reset(); const control = new AbortController(); control.abort(); const store = cache();
  await rejects(loader(store).refresh(base({ signal: control.signal })), 'REFRESH_ABORTED');
  assert.equal(store.reads, 0); assert.deepEqual(paths(), []);
});

test('abort during the second download cannot start commit or publish a partial pair', async () => {
  fixture.reset(); const control = new AbortController(), store = cache();
  const client = { getBytes(url, options) { if (new URL(url).pathname === '/regions') control.abort(); return httpClient.getBytes(url, options); } };
  await rejects(loader(store, client).refresh(base({ signal: control.signal })), 'REFRESH_ABORTED');
  assert.equal(store.commits, 0); assert.deepEqual(store.value.catalogs.regionListBytes, data.oldRegions);
});

test('inputs are snapshotted before a delayed cache read can observe caller mutations', async () => {
  fixture.reset(); const input = base({ launcherBytes: data.launcher.slice(), endpoints: { ...fixture.endpoints } });
  const store = cache(pair(), { read() { input.launcherBytes.fill(0); input.endpoints.gameList = 'http://invalid.example/'; input.encoding = 'invalid'; } });
  const result = await loader(store).refresh(input);
  assert.equal(result.disposition, 'catalogs-committed'); assert.deepEqual(paths(), fourPaths);
});

test('a second refresh cannot overlap the active controller operation', async () => {
  fixture.reset(); let release; const gate = new Promise(resolve => { release = resolve; });
  const store = cache(pair(), { read() { return gate; } }), refresh = loader(store), first = refresh.refresh(base());
  await rejects(refresh.refresh(base()), 'REFRESH_BUSY'); release();
  assert.equal((await first).committed, true); assert.equal(store.commits, 1);
});

test('a concurrent cache writer wins and the older HTTP result cannot overwrite it', async () => {
  fixture.reset(); const store = cache();
  const client = { getBytes(url, options) { if (new URL(url).pathname === '/regions') store.externalCommit(); return httpClient.getBytes(url, options); } };
  await rejects(loader(store, client).refresh(base()), 'REFRESH_CONFLICT');
  assert.equal(store.value.revision, 2); assert.deepEqual(store.value.catalogs.regionListBytes, data.oldRegions);
});

test('the unchanged branch also rejects a revision changed during HTTP', async () => {
  fixture.reset(); const store = cache(pair(data.newGames, data.newRegions), { read(self, options, ordinal) { if (ordinal === 2) self.externalCommit(); } });
  await rejects(loader(store).refresh(base()), 'REFRESH_CONFLICT'); assert.equal(store.commits, 0);
});

test('a store-confirmed abort before its put leaves the old pair', async () => {
  fixture.reset(); const control = new AbortController();
  const store = cache(pair(), { beforeCommit() { control.abort(); } });
  await rejects(loader(store).refresh(base({ signal: control.signal })), 'REFRESH_ABORTED');
  assert.equal(store.value.revision, 1); assert.deepEqual(store.value.catalogs.gameListBytes, data.oldGames);
});

test('a completed commit is reported when abort arrives before its delayed receipt', async () => {
  fixture.reset(); const control = new AbortController();
  const store = cache(pair(), { async afterCommit(self, options, receipt) { control.abort(); await delay(15); return receipt; } });
  const result = await loader(store).refresh(base({ signal: control.signal }));
  assert.equal(result.committed, true); assert.equal(result.cancellationTooLate, true); assert.equal(result.revision, 2);
  assert.deepEqual(store.value.catalogs.regionListBytes, data.newRegions);
});

test('a late successful commit receipt remains authoritative after the total deadline', async () => {
  fixture.reset(); const store = cache(pair(), { async afterCommit(self, options, receipt) { await delay(250); return receipt; } });
  const result = await loader(store).refresh(base({ timeoutMs: 200 }));
  assert.equal(result.committed, true); assert.equal(result.deadlineExceededAfterCommit, true); assert.equal(result.cancellationTooLate, true);
  assert.equal(store.value.revision, 2);
});

test('an unexpected acknowledgement reports unconfirmed commit and never claims rollback', async () => {
  fixture.reset(); const store = cache(pair(), { afterCommit(self, options, receipt) { return { ...receipt, revision: 99 }; } });
  await rejects(loader(store).refresh(base()), 'REFRESH_COMMIT_UNCONFIRMED');
  assert.equal(store.value.revision, 2); assert.equal(store.commits, 1);
});

test('an unknown provider failure after its mutation is unconfirmed and sanitized', async () => {
  fixture.reset(); const store = cache(pair(), { afterCommit() { throw Error('private-detail'); } });
  await rejects(loader(store).refresh(base()), 'REFRESH_COMMIT_UNCONFIRMED'); assert.equal(store.value.revision, 2);
});

test('corrupt cached revision/pair stops before HTTP and cache writes', async () => {
  for (const raw of [{ revision: -1, catalogs: null }, { revision: 0, catalogs: pair() }, { revision: 1, catalogs: null }, { revision: 1, catalogs: {} }]) {
    fixture.reset(); const store = cache(null, { raw });
    await rejects(loader(store).refresh(base()), 'REFRESH_CACHE'); assert.deepEqual(paths(), []); assert.equal(store.commits, 0);
  }
});

test('invalid and accessor input is rejected without reading getters, cache or HTTP', async () => {
  fixture.reset(); let touched = 0;
  const getter = base(); Object.defineProperty(getter, 'launcherBytes', { get() { touched++; return data.launcher; } });
  const inherited = Object.create(base()), badEndpoints = base({ endpoints: { ...fixture.endpoints, extra: 'x' } });
  const detached = new ArrayBuffer(2); structuredClone(detached, { transfer: [detached] });
  const inputs = [getter, inherited, badEndpoints, base({ launcherBytes: detached }), base({ launcherBytes: new Uint8Array(new SharedArrayBuffer(2)) }),
    base({ timeoutMs: 0 }), base({ timeoutMs: 60001 }), base({ encoding: 'automatic' }), base({ signal: {} }), base({ unknown: 1 })];
  const store = cache(), refresh = loader(store);
  for (const input of inputs) await rejects(refresh.refresh(input), 'REFRESH_INPUT');
  assert.equal(touched, 0); assert.equal(store.reads, 0); assert.deepEqual(paths(), []);
});

test('native signal methods prevent caller hooks from masking successful cleanup', async () => {
  fixture.reset(); const control = new AbortController(); let touched = 0;
  for (const key of ['addEventListener', 'removeEventListener']) Object.defineProperty(control.signal, key, { get() { touched++; throw Error('private-detail'); } });
  const result = await loader(cache()).refresh(base({ signal: control.signal }));
  assert.equal(result.committed, true); assert.equal(touched, 0);
});

test('a failed read is sanitized and the controller can be used again after failure', async () => {
  fixture.reset(); const store = cache(pair(), { read(self, options, ordinal) { if (ordinal === 1) throw Error('private-detail'); } });
  const refresh = loader(store); await rejects(refresh.refresh(base()), 'REFRESH_CACHE');
  const result = await refresh.refresh(base()); assert.equal(result.committed, true); assert.equal(store.commits, 1);
});

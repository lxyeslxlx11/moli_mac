/** Original loopback-only browser/IndexedDB verification. Pass an installed Playwright module directory as argv2. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createLauncherBootstrapFixture, BOOTSTRAP_FIXTURES } from '../../web/tests/helpers/launcher-bootstrap-fixture.mjs';
if (!process.argv[2]) throw Error('Supply the installed Playwright module directory.');
const { chromium } = createRequire(import.meta.url)(process.argv[2]);
const fixture = await createLauncherBootstrapFixture();
const checks = [], errors = [], failures = [], requests = [], serverRequests = [];
const reset = () => { serverRequests.push(...fixture.requests); fixture.reset(); };
let activeCheck = 'setup', page;
const check = async (name, action) => { activeCheck = name; await action(); await page.waitForLoadState('networkidle'); checks.push({ name, passed: true }); };
let browser, browserVersion, failure;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true }); browserVersion = browser.version();
  const context = await browser.newContext();
  try {
    await context.route('**/*', route => new URL(route.request().url()).origin === fixture.origin ? route.continue() : route.abort());
    page = await context.newPage();
    page.on('request', request => { const url = new URL(request.url()); requests.push({ method: request.method(), path: url.pathname, query: url.search, sameOrigin: url.origin === fixture.origin }); });
    page.on('console', message => { if (['warning', 'error'].includes(message.type())) errors.push({ type: message.type(), text: message.text() }); });
    page.on('pageerror', error => errors.push({ type: 'pageerror', text: error.message }));
    page.on('requestfailed', request => failures.push({ check: activeCheck, path: new URL(request.url()).pathname, error: request.failure()?.errorText }));
    await page.goto(fixture.origin + '/harness');
    await page.evaluate(async ({ origin, endpoints, source }) => {
      const { createWin32LauncherCatalogRefresh } = await import('/web/launcher-catalog-refresh.mjs');
      const { createLauncherCandidateStore } = await import('/web/launcher-candidate-store.mjs');
      const { createLauncherHttpClient } = await import('/web/launcher-http.mjs');
      const { snapshotLauncherCatalogCandidate } = await import('/web/launcher-catalog-data.mjs');
      const { computeLauncherFileMd5 } = await import('/shared/index.mjs');
      const data = Object.fromEntries(Object.entries(source).map(([key, value]) => [key, Array.isArray(value) ? Uint8Array.from(value) : value]));
      const store = createLauncherCandidateStore({ profile: 'stage94-original-check' }), store2 = createLauncherCandidateStore({ profile: 'stage94-original-check' });
      const client = createLauncherHttpClient({ allowedOrigins: [origin] });
      const input = { launcherBytes: data.launcher, endpoints, encoding: 'utf-8', allowBareAmpersands: false };
      const makePair = (gameListBytes, regionListBytes) => snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes,
        gameListMd5: computeLauncherFileMd5(gameListBytes), regionListMd5: computeLauncherFileMd5(regionListBytes), encoding: 'utf-8', allowBareAmpersands: false });
      const make = (otherStore = store, httpClient = client) => createWin32LauncherCatalogRefresh({ store: otherStore, httpClient, cacheTick: () => 94 });
      const summary = value => ({ disposition: value.disposition, revision: value.revision, committed: value.committed,
        cancellationTooLate: value.cancellationTooLate, deadlineExceededAfterCommit: value.deadlineExceededAfterCommit,
        comparison: value.comparison, trust: value.trust, authentication: value.authentication, execution: value.execution });
      window.refreshProbe = { data, store, store2, client, input, makePair, make, summary, same: (a, b) => a.length === b.length && a.every((x, i) => x === b[i]) };
    }, { origin: fixture.origin, endpoints: fixture.endpoints,
      source: Object.fromEntries(Object.entries(BOOTSTRAP_FIXTURES).map(([key, value]) => [key, value instanceof Uint8Array ? [...value] : value])) });
    reset();
    await check('actual current-profile HTTP -> initial IndexedDB pair revision1', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; return p.summary(await p.make().refresh(p.input)); });
      assert.equal(result.disposition, 'catalogs-committed'); assert.equal(result.revision, 1);
      assert.equal(result.comparison.gameList, 'unavailable'); assert.equal(result.trust, 'unverified'); assert.equal(result.execution, 'not-performed');
      assert.deepEqual(fixture.requests.map(row => row.path), ['/self', '/hashes', '/games', '/regions']);
    });
    reset();
    await check('same pair no-op preserves actual IndexedDB revision', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; return p.summary(await p.make().refresh(p.input)); });
      assert.equal(result.disposition, 'catalogs-unchanged'); assert.equal(result.revision, 1); assert.equal(result.committed, false);
    });
    reset(); fixture.set('/games', { body: BOOTSTRAP_FIXTURES.oldGames });
    await check('only game catalog changed commits a complete pair at revision2', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe, result = await p.make().refresh(p.input), stored = await p.store2.read();
        return { ...p.summary(result), games: p.same(stored.catalogs.gameListBytes, p.data.oldGames), regions: p.same(stored.catalogs.regionListBytes, p.data.newRegions) }; });
      assert.equal(result.revision, 2); assert.equal(result.comparison.gameList, 'different'); assert.equal(result.comparison.regionList, 'identical');
      assert.equal(result.games && result.regions, true);
    });
    reset(); fixture.set('/games', { body: new TextEncoder().encode('<invalid/>') });
    await check('invalid HTTP XML cannot change the stored pair', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; let code;
        try { await p.make().refresh(p.input); } catch (error) { code = error.code; }
        const saved = await p.store.read(); return { code, revision: saved.revision, old: p.same(saved.catalogs.gameListBytes, p.data.oldGames) }; });
      assert.deepEqual(result, { code: 'REFRESH_DATA', revision: 2, old: true });
    });
    reset();
    await check('another IndexedDB writer wins CAS during HTTP preparation', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; let inserted = false, code;
        const client = { async getBytes(url, options) { const response = await p.client.getBytes(url, options);
          if (!inserted && new URL(url).pathname === '/regions') { inserted = true; const saved = await p.store2.read();
            await p.store2.commitPair(p.makePair(p.data.oldGames, p.data.oldRegions), { expectedRevision: saved.revision }); } return response; } };
        try { await p.make(p.store, client).refresh(p.input); } catch (error) { code = error.code; }
        const saved = await p.store.read(); return { code, revision: saved.revision, externalPair: p.same(saved.catalogs.regionListBytes, p.data.oldRegions) }; });
      assert.deepEqual(result, { code: 'REFRESH_CONFLICT', revision: 3, externalPair: true });
    });
    reset(); fixture.set('/games', { body: BOOTSTRAP_FIXTURES.oldGames }); fixture.set('/regions', { body: BOOTSTRAP_FIXTURES.oldRegions });
    await check('unchanged byte comparison cannot hide an intervening IndexedDB revision', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; let inserted = false, code;
        const client = { async getBytes(url, options) { const response = await p.client.getBytes(url, options);
          if (!inserted && new URL(url).pathname === '/regions') { inserted = true; const saved = await p.store2.read();
            await p.store2.commitPair(p.makePair(p.data.newGames, p.data.newRegions), { expectedRevision: saved.revision }); } return response; } };
        try { await p.make(p.store, client).refresh(p.input); } catch (error) { code = error.code; }
        return { code, revision: (await p.store.read()).revision }; });
      assert.deepEqual(result, { code: 'REFRESH_CONFLICT', revision: 4 });
    });
    reset(); fixture.set('/games', { body: BOOTSTRAP_FIXTURES.oldGames });
    await check('native store abort before opening a commit transaction keeps revision4', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe, control = new AbortController(); let code;
        const store = { read: options => p.store.read(options), commitPair(pair, options) { control.abort(); return p.store.commitPair(pair, options); } };
        try { await p.make(store).refresh({ ...p.input, signal: control.signal }); } catch (error) { code = error.code; }
        return { code, revision: (await p.store.read()).revision }; });
      assert.deepEqual(result, { code: 'REFRESH_ABORTED', revision: 4 });
    });
    reset(); fixture.set('/games', { body: BOOTSTRAP_FIXTURES.oldGames });
    await check('actual committed transaction survives cancellation before wrapper receipt', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe, control = new AbortController();
        const store = { read: options => p.store.read(options), async commitPair(pair, options) { const receipt = await p.store.commitPair(pair, options);
          control.abort(); await new Promise(resolve => setTimeout(resolve, 15)); return receipt; } };
        return p.summary(await p.make(store).refresh({ ...p.input, signal: control.signal })); });
      assert.equal(result.committed, true); assert.equal(result.cancellationTooLate, true); assert.equal(result.revision, 5);
    });
    reset();
    await check('total deadline after a delayed native read starts no write or HTTP operation', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; let code, commits = 0;
        const store = { async read(options) { const value = await p.store.read(options); await new Promise(resolve => setTimeout(resolve, 150)); return value; },
          commitPair(pair, options) { commits++; return p.store.commitPair(pair, options); } };
        try { await p.make(store).refresh({ ...p.input, timeoutMs: 80 }); } catch (error) { code = error.code; }
        return { code, commits, revision: (await p.store.read()).revision }; });
      assert.deepEqual(result, { code: 'REFRESH_TIMEOUT', commits: 0, revision: 5 }); assert.deepEqual(fixture.requests, []);
    });
    await check('reopened native store has both exact files and owns its copies', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe, first = await p.store2.read(); first.catalogs.gameListBytes.fill(0);
        const second = await p.store.read(); return { revision: second.revision, games: p.same(second.catalogs.gameListBytes, p.data.oldGames), regions: p.same(second.catalogs.regionListBytes, p.data.newRegions) }; });
      assert.deepEqual(result, { revision: 5, games: true, regions: true });
    });
    reset();
    await check('two actual controllers read revision5; one commits6 and one loses CAS', async () => {
      const result = await page.evaluate(async () => { const p = window.refreshProbe; let arrivals = 0, release;
        const gate = new Promise(resolve => { release = resolve; });
        const client = { async getBytes(url, options) { if (new URL(url).pathname === '/self') { if (++arrivals === 2) release(); await gate; } return p.client.getBytes(url, options); } };
        const values = await Promise.allSettled([p.make(p.store, client).refresh(p.input), p.make(p.store2, client).refresh(p.input)]);
        const saved = await p.store.read(); return { statuses: values.map(value => value.status), codes: values.filter(x => x.status === 'rejected').map(x => x.reason.code),
          revision: saved.revision, wholePair: p.same(saved.catalogs.gameListBytes, p.data.newGames) && p.same(saved.catalogs.regionListBytes, p.data.newRegions) }; });
      assert.deepEqual([...result.statuses].sort(), ['fulfilled', 'rejected']); assert.deepEqual(result.codes, ['REFRESH_CONFLICT']);
      assert.equal(result.revision, 6); assert.equal(result.wholePair, true);
    });
    assert.equal(errors.length, 0); assert.equal(failures.length, 0); assert.ok(requests.every(row => row.sameOrigin && row.method === 'GET'));
  } finally { await context.close(); }
} catch (error) { failure = { name: error.name, message: error.message }; }
finally { if (browser) await browser.close(); await fixture.close(); }
serverRequests.push(...fixture.requests);
const report = { schema: 'moli.launcher-current-refresh-v1.browser-validation.v1', recorded_utc: new Date().toISOString(),
  browser: browserVersion, driver: 'Installed Playwright, existing Chrome headless in fresh context', checks,
  requests, serverRequests, errors, failures, failure: failure ?? null, context_browser_and_fixture_closed: true,
  scope: 'Original loopback HTTP plus actual ESM/IndexedDB only; no user browser profile, official service, account or game.' };
await mkdir('build/analysis/launcher-current-runtime-v4', { recursive: true });
await writeFile('build/analysis/launcher-current-runtime-v4/browser-validation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: checks.length, requests: requests.length, errors: errors.length, failures: failures.length, failure: failure ?? null }));
if (failure) process.exitCode = 1;

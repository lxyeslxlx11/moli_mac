import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherHttpClient, LauncherHttpError, LAUNCHER_HTTP_LIMITS } from '../launcher-http.mjs';
import { createLauncherMetadataPlan, decodeLauncherUpdatePackage } from '../../shared/index.mjs';
import { createLauncherHttpFixtureServer, HTTP_FIXTURES, HTTP_PACKAGE_EXPECTED } from './helpers/launcher-http-fixture.mjs';

let fixture, client;
before(async () => { fixture = await createLauncherHttpFixtureServer(); client = createLauncherHttpClient({ allowedOrigins: [fixture.origin] }); });
after(async () => { await fixture.close(); });
const code = (promise, expected) => assert.rejects(promise, e => e instanceof LauncherHttpError && e.code === expected);
const fake = impl => createLauncherHttpClient({ allowedOrigins: ['https://fixture.invalid'], fetchImpl: impl });
const target = 'https://fixture.invalid/data';
const response = data => new Response(data, { status: 200 });

test('origin snapshot and URL policies reject invalid requests before any fetch', async () => {
  let calls = 0; const origins = ['https://fixture.invalid'];
  const c = createLauncherHttpClient({ allowedOrigins: origins, fetchImpl: async () => { calls++; return response('x'); } });
  origins[0] = 'https://changed.invalid';
  for (const [url, expected] of [['https://changed.invalid/a', 'HTTP_ORIGIN'], ['file:///tmp/a', 'HTTP_SCHEME'], ['https://u:p@fixture.invalid/a', 'HTTP_INPUT'], [target + '#fragment', 'HTTP_INPUT'], ['relative', 'HTTP_INPUT'], ['\n' + target, 'HTTP_INPUT']]) await code(c.getBytes(url), expected);
  assert.equal(calls, 0); assert.ok(Object.isFrozen(c) && Object.isFrozen(LAUNCHER_HTTP_LIMITS));
  for (const values of [[], new Array(1), ['https://fixture.invalid/path'], ['https://fixture.invalid?x=1']]) assert.throws(() => createLauncherHttpClient({ allowedOrigins: values }), LauncherHttpError);
  await c.getBytes(target); assert.equal(calls, 1);
});

test('GET options omit credentials/referrer, reject redirects and use an owned signal', async () => {
  let args; const c = fake(async (...a) => { args = a; return response('x'); });
  const external = new AbortController(); await c.getBytes(target, { signal: external.signal });
  assert.equal(args[0], target); assert.equal(args[1].method, 'GET'); assert.equal(args[1].credentials, 'omit');
  assert.equal(args[1].redirect, 'error'); assert.equal(args[1].cache, 'no-store'); assert.equal(args[1].referrerPolicy, 'no-referrer');
  assert.notEqual(args[1].signal, external.signal);
  for (const options of [{ kind: 'unknown' }, { kind: {} }, { timeoutMs: 0 }, { timeoutMs: 1.5 }, { timeoutMs: 60001 }, { signal: {} }]) await code(c.getBytes(target, options), 'HTTP_INPUT');
});

test('actual loopback metadata GETs compose with the existing raw-file plan', async () => {
  const self = await client.getBytes(fixture.origin + '/self-digest'), pair = await client.getBytes(fixture.origin + '/catalog-digests');
  const plan = createLauncherMetadataPlan({ launcherBytes: HTTP_FIXTURES.launcher, launcherDigestResponseBytes: self.bytes,
    catalogDigestResponseBytes: pair.bytes, gameListBytes: HTTP_FIXTURES.gameList, regionListBytes: HTTP_FIXTURES.regionList });
  assert.equal(plan.disposition, 'catalog-refresh-needed'); assert.deepEqual(plan.catalogs.refreshOrder, ['regionList']); assert.equal(plan.trust, 'unverified');
  const region = await client.getBytes(fixture.origin + '/region', { kind: 'catalog' }); assert.deepEqual(region.bytes, HTTP_FIXTURES.nextRegion);
});

test('actual chunked raw bytes preserve NUL/high bytes and support empty responses', async () => {
  assert.deepEqual((await client.getBytes(fixture.origin + '/binary')).bytes, HTTP_FIXTURES.binary);
  const chunks = await client.getBytes(fixture.origin + '/chunks', { kind: 'catalog' }); assert.deepEqual(chunks.bytes, HTTP_FIXTURES.chunks); assert.equal(chunks.byteLength, 5000);
  const empty = await client.getBytes(fixture.origin + '/empty'); assert.equal(empty.status, 204); assert.equal(empty.byteLength, 0); assert.equal(empty.trust, 'unverified');
});

test('HTTP failures and redirects are rejected without following the target route', async () => {
  for (const status of [404, 500]) await code(client.getBytes(`${fixture.origin}/status/${status}`), 'HTTP_STATUS');
  await code(client.getBytes(fixture.origin + '/redirect'), 'HTTP_NETWORK');
  assert.ok(!fixture.requests.some(r => r.path === '/redirect-target'));
});

test('declared lengths and actual decoded/chunked bytes have independent budgets', async () => {
  for (const path of ['/large-length', '/oversize', '/gzip-large']) await code(client.getBytes(fixture.origin + path), 'HTTP_BODY_LIMIT');
  assert.deepEqual((await client.getBytes(fixture.origin + '/gzip-small')).bytes, HTTP_FIXTURES.binary);
  await code(client.getBytes(fixture.origin + '/chunks'), 'HTTP_BODY_LIMIT');
});

test('truncated bodies and connection failures never return partial content', async () => {
  await code(client.getBytes(fixture.origin + '/truncated'), 'HTTP_NETWORK');
  await code(client.getBytes(fixture.origin + '/disconnect'), 'HTTP_NETWORK');
});

test('one deadline covers delayed response headers and delayed body reads', async () => {
  await code(client.getBytes(fixture.origin + '/slow-headers', { timeoutMs: 20 }), 'HTTP_TIMEOUT');
  await code(client.getBytes(fixture.origin + '/slow-body', { timeoutMs: 20 }), 'HTTP_TIMEOUT');
});

test('pre-cancellation sends no request and mid-request cancellation returns no bytes', async () => {
  const controller = new AbortController(); controller.abort('Original private cancellation reason');
  const before = fixture.requests.length; await code(client.getBytes(fixture.origin + '/binary', { signal: controller.signal }), 'HTTP_ABORTED'); assert.equal(fixture.requests.length, before);
  const active = new AbortController(); const task = client.getBytes(fixture.origin + '/slow-body', { signal: active.signal });
  setTimeout(() => active.abort(), 20); await code(task, 'HTTP_ABORTED');
});

test('deadline wins even if an injected fetch ignores abort; a late body is discarded', async () => {
  let resolveFetch, cancelled = false;
  const c = fake(() => new Promise(resolve => { resolveFetch = resolve; }));
  await code(c.getBytes(target, { timeoutMs: 10 }), 'HTTP_TIMEOUT');
  resolveFetch(response(new ReadableStream({ cancel() { cancelled = true; } })));
  await new Promise(resolve => setImmediate(resolve)); assert.equal(cancelled, true);
});

test('pending reads and unresolved cancellation do not extend the deadline', async () => {
  let cancelled = false;
  const c = fake(async () => response(new ReadableStream({ pull() { return new Promise(() => {}); }, cancel() { cancelled = true; return new Promise(() => {}); } })));
  await code(c.getBytes(target, { timeoutMs: 10 }), 'HTTP_TIMEOUT'); assert.equal(cancelled, true);
});

test('native byte copies ignore subclass metadata/iterator and reject fake byte chunks', async () => {
  class Wrong extends Uint8Array { get byteLength() { return 1; } get buffer() { return new ArrayBuffer(1); } *[Symbol.iterator]() { yield 99; } }
  const input = new Wrong([0, 255, 17]);
  const c = fake(async () => response(new ReadableStream({ start(s) { s.enqueue(input); s.close(); } })));
  const result = await c.getBytes(target); assert.deepEqual(result.bytes, Uint8Array.of(0, 255, 17)); input.fill(42); assert.deepEqual(result.bytes, Uint8Array.of(0, 255, 17));
  await code(fake(async () => response(new ReadableStream({ start(s) { s.enqueue(new Wrong(4097)); s.close(); } }))).getBytes(target), 'HTTP_BODY_LIMIT');
  for (const bad of [new Proxy(new Uint8Array(2), {}), 'text', new DataView(new ArrayBuffer(2))]) {
    await code(fake(async () => response(new ReadableStream({ start(s) { s.enqueue(bad); s.close(); } }))).getBytes(target), 'HTTP_RESPONSE');
  }
});

test('read-operation budget also bounds zero-length chunk producers', async () => {
  let cancelled = false;
  const c = fake(async () => response(new ReadableStream({ pull(s) { s.enqueue(new Uint8Array(0)); }, cancel() { cancelled = true; } })));
  await code(c.getBytes(target), 'HTTP_READ_LIMIT'); assert.equal(cancelled, true);
});

test('concurrent requests have independent cancellation and owned output', async () => {
  const abort = new AbortController(); const slow = client.getBytes(fixture.origin + '/slow-body', { signal: abort.signal });
  const fast = client.getBytes(fixture.origin + '/binary'); abort.abort(); await code(slow, 'HTTP_ABORTED');
  assert.deepEqual((await fast).bytes, HTTP_FIXTURES.binary);
});

test('opaque or redirected responses and sensitive provider errors stay bounded failures', async () => {
  for (const [extra, expected] of [[{ type: 'opaque', status: 0 }, 'HTTP_RESPONSE'], [{ redirected: true }, 'HTTP_REDIRECT'], [{ url: 'https://fixture.invalid/other' }, 'HTTP_REDIRECT']]) {
    await code(fake(async () => ({ status: 200, type: 'basic', redirected: false, headers: new Headers(), body: null, ...extra })).getBytes(target), expected);
  }
  await code(fake(async () => new Response('x', { headers: { 'Content-Length': 'invalid' } })).getBytes(target), 'HTTP_LENGTH');
  await assert.rejects(fake(async () => { throw Error('sensitive original fixture error'); }).getBytes(target), e => e.code === 'HTTP_NETWORK' && !e.message.includes('sensitive'));
});

test('actual original package GET composes with ZIP/CRC/MD5 without writing or trusting it', async () => {
  const result = await client.getBytes(fixture.origin + '/package', { kind: 'package' });
  assert.deepEqual(result.bytes, HTTP_FIXTURES.package);
  const candidate = decodeLauncherUpdatePackage(result.bytes, { expectedMd5: HTTP_PACKAGE_EXPECTED.md5 });
  assert.equal(candidate.payloadBytes.length, 256); assert.equal(candidate.crcVerified, true); assert.equal(candidate.digestMatches, true);
  assert.equal(candidate.trust, 'unverified'); assert.equal(candidate.replacement, 'not-performed');
  for (const [kind, maximum] of [['catalog', LAUNCHER_HTTP_LIMITS.catalogBytes], ['package', LAUNCHER_HTTP_LIMITS.packageBytes]]) {
    await code(fake(async () => new Response('', { headers: { 'Content-Length': String(maximum + 1) } })).getBytes(target, { kind }), 'HTTP_BODY_LIMIT');
  }
});

test('monotonic deadline rejects late success even before timer callbacks are dispatched', async () => {
  const burn = () => { const until = performance.now() + 20; while (performance.now() < until) { /* Original synchronous stall fixture. */ } };
  let cancelled = false;
  const delayedFetch = fake(async () => { burn(); return response(new ReadableStream({ cancel() { cancelled = true; } })); });
  await code(delayedFetch.getBytes(target, { timeoutMs: 2 }), 'HTTP_TIMEOUT'); assert.equal(cancelled, true);
  const delayedRead = fake(async () => ({ status: 200, type: 'basic', headers: new Headers(), body: { getReader() { return {
    read() { burn(); return Promise.resolve({ done: false, value: Uint8Array.of(1) }); }, cancel() { cancelled = true; }, releaseLock() {},
  }; } } }));
  cancelled = false; await code(delayedRead.getBytes(target, { timeoutMs: 2 }), 'HTTP_TIMEOUT'); assert.equal(cancelled, true);
  const lateRejection = fake(async () => ({ status: 200, type: 'basic', headers: new Headers(), body: { getReader() { return {
    read() { burn(); return Promise.reject(Error('Original late read rejection')); }, cancel() {}, releaseLock() {},
  }; } } }));
  await code(lateRejection.getBytes(target, { timeoutMs: 2 }), 'HTTP_TIMEOUT');
  await code(fake(async () => { burn(); throw Error('Original late fetch failure'); }).getBytes(target, { timeoutMs: 2 }), 'HTTP_TIMEOUT');
});

test('origin snapshot keeps its initially validated length when an entry getter appends', async () => {
  const origins = Array.from({ length: 16 }, (_, i) => `https://fixture${i}.invalid`); let calls = 0;
  Object.defineProperty(origins, 0, { get() { origins.push('https://extra.invalid'); return 'https://fixture0.invalid'; } });
  const c = createLauncherHttpClient({ allowedOrigins: origins, fetchImpl: async () => { calls++; return response('x'); } });
  await code(c.getBytes('https://extra.invalid/data'), 'HTTP_ORIGIN'); assert.equal(calls, 0);
  await c.getBytes('https://fixture15.invalid/data'); assert.equal(calls, 1);
});

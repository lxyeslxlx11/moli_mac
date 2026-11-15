import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LauncherManifestError, WIN32_LAUNCHER_MANIFEST_LIMITS, parseLauncherDigestResponse,
  parseWin32LauncherDigestResponse, parseWin32LauncherUpdateLocatorResponse, createWin32LauncherMetadataPlan } from '../index.mjs';

const vector = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-metadata-v1/original-vectors.json', import.meta.url)));
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex')), ascii = text => new TextEncoder().encode(text);
const code = (action, expected) => assert.throws(action, error => error instanceof LauncherManifestError && error.code === expected);
const local = () => bytes(vector.inputs.launcher_hex);
const base = extra => ({ launcherBytes: local(), launcherDigestResponseBytes: ascii(vector.inputs.launcher_md5), ...extra });

test('current digest responses match independently generated trim, cut, case and rejection vectors', () => {
  for (const row of vector.self_responses) {
    const source = bytes(row.body_hex), saved = source.slice();
    if (row.expected_error) code(() => parseWin32LauncherDigestResponse(source), row.expected_error);
    else assert.deepEqual(parseWin32LauncherDigestResponse(source), row.expected, row.name);
    assert.deepEqual(source, saved, row.name);
  }
});

test('current locator responses preserve the source prefix/size subset and independent bounds', () => {
  for (const row of vector.locator_responses) {
    const source = bytes(row.body_hex), saved = source.slice();
    if (row.expected_error) code(() => parseWin32LauncherUpdateLocatorResponse(source), row.expected_error);
    else assert.deepEqual(parseWin32LauncherUpdateLocatorResponse(source), row.expected, row.name);
    assert.deepEqual(source, saved, row.name);
  }
});

test('independent metadata plans use raw case-sensitive text and preserve unverified status', () => {
  for (const row of vector.plans) {
    const input = base({ launcherDigestResponseBytes: bytes(row.response_hex) });
    if (row.locator_hex) input.locatorResponseBytes = bytes(row.locator_hex);
    const value = createWin32LauncherMetadataPlan(input);
    assert.equal(value.disposition, row.disposition, row.name);
    assert.equal(value.launcher.matches, row.matches);
    assert.equal(value.launcher.localMd5, createHash('md5').update(local()).digest('hex'));
    assert.equal(value.launcher.remoteMd5, value.launcher.comparisonText.toLowerCase());
    assert.equal(value.profile, 'win32-current-metadata-v1');
    for (const key of ['trust', 'authentication']) assert.equal(value[key], 'unverified');
    assert.equal(value.execution, 'not-performed');
    assert.ok(Object.isFrozen(value) && Object.isFrozen(value.launcher) && Object.isFrozen(value.launcher.response));
    if (row.matches) {
      assert.deepEqual(value.catalogs.requestOrder, ['catalogDigests', 'gameList', 'regionList']);
      assert.equal(value.catalogs.catalogDigestUse, 'request-success-only');
      assert.equal(value.catalogs.comparison, 'raw-pair-bytes');
      assert.ok(Object.isFrozen(value.catalogs) && Object.isFrozen(value.catalogs.requestOrder));
    } else {
      assert.equal(value.catalogs, null);
      assert.equal(value.update.archiveBytesText, '42');
      assert.equal(value.update.expectedMd5, value.launcher.remoteMd5);
      assert.ok(Object.isFrozen(value.update));
    }
  }
});

test('mixed boundary whitespace differs from legacy sequential trims without changing the legacy API', () => {
  const source = ascii('\r\n ' + vector.inputs.launcher_md5 + ' \n\r');
  assert.equal(parseWin32LauncherDigestResponse(source).md5, vector.inputs.launcher_md5);
  code(() => parseLauncherDigestResponse(source), 'MANIFEST_DIGEST');
  assert.equal(parseLauncherDigestResponse(ascii(vector.inputs.launcher_md5.toUpperCase())).md5, vector.inputs.launcher_md5);
  const upper = createWin32LauncherMetadataPlan(base({ launcherDigestResponseBytes: ascii(vector.inputs.launcher_md5.toUpperCase()),
    locatorResponseBytes: ascii('http://original.example.invalid/u.zip 1') }));
  assert.equal(upper.launcher.matches, false);
});

test('the current branch does not inspect an unused locator accessor', () => {
  let reads = 0;
  const input = base();
  Object.defineProperty(input, 'locatorResponseBytes', { get() { reads++; throw Error('Original unused locator'); } });
  assert.equal(createWin32LauncherMetadataPlan(input).disposition, 'catalog-pair-needed');
  assert.equal(reads, 0);
  input.launcherDigestResponseBytes = ascii('f'.repeat(32));
  code(() => createWin32LauncherMetadataPlan(input), 'WIN32_MANIFEST_INPUT');
  assert.equal(reads, 0);
});

test('own data fields are required and missing, inherited, symbolic and extra inputs are rejected without reads', () => {
  let reads = 0;
  const getter = base();
  Object.defineProperty(getter, 'launcherBytes', { get() { reads++; return local(); } });
  for (const input of [null, [], true, 'metadata', Object.create(base()), {}, getter, { ...base(), unknown: 1 }, { ...base(), [Symbol('x')]: 1 }]) {
    assert.throws(() => createWin32LauncherMetadataPlan(input), LauncherManifestError);
  }
  assert.equal(reads, 0);
  code(() => createWin32LauncherMetadataPlan(base({ launcherDigestResponseBytes: ascii('f'.repeat(32)) })), 'WIN32_MANIFEST_INPUT');
  assert.equal(createWin32LauncherMetadataPlan(Object.assign(Object.create(null), base())).launcher.matches, true);
});

test('intrinsic byte ownership ignores typed-array metadata overrides and supports offset views and buffers', () => {
  let reads = 0;
  class OriginalBytes extends Uint8Array {
    get length() { reads++; throw Error('Original misleading length'); }
    get buffer() { reads++; throw Error('Original misleading buffer'); }
    [Symbol.iterator]() { reads++; throw Error('Original misleading iterator'); }
  }
  const h = ascii(vector.inputs.launcher_md5), input = new OriginalBytes(h.length); input.set(h);
  assert.equal(parseWin32LauncherDigestResponse(input).md5, vector.inputs.launcher_md5);
  assert.equal(reads, 0);
  const padded = new Uint8Array(h.length + 9); padded.set(h, 4);
  assert.equal(parseWin32LauncherDigestResponse(padded.subarray(4, 4 + h.length)).md5, vector.inputs.launcher_md5);
  assert.equal(parseWin32LauncherDigestResponse(h.buffer).md5, vector.inputs.launcher_md5);
  const source = local(), response = h.slice(), value = createWin32LauncherMetadataPlan({ launcherBytes: source, launcherDigestResponseBytes: response });
  source.fill(0); response.fill(0);
  assert.equal(value.launcher.localMd5, vector.inputs.launcher_md5);
});

test('detached, shared, proxy and wrong byte types are consistently rejected in new APIs', () => {
  const detached = new ArrayBuffer(32), detachedView = new Uint8Array(detached);
  structuredClone(detached, { transfer: [detached] });
  const invalid = [detached, detachedView, new Proxy(ascii(vector.inputs.launcher_md5), {}), [], {}, 'bytes', new DataView(new ArrayBuffer(32))];
  if (typeof SharedArrayBuffer === 'function') invalid.push(new SharedArrayBuffer(32), new Uint8Array(new SharedArrayBuffer(32)));
  for (const input of invalid) {
    code(() => parseWin32LauncherDigestResponse(input), 'INVALID_INPUT');
    code(() => parseWin32LauncherUpdateLocatorResponse(input), 'INVALID_INPUT');
    code(() => createWin32LauncherMetadataPlan(base({ launcherBytes: input })), 'INVALID_INPUT');
  }
});

test('package-size text and numeric bounds are independent from the owned file budget', () => {
  assert.equal(WIN32_LAUNCHER_MANIFEST_LIMITS.archiveBytes, 268435456);
  assert.equal(WIN32_LAUNCHER_MANIFEST_LIMITS.fileBytes, 33554432);
  assert.ok(Object.isFrozen(WIN32_LAUNCHER_MANIFEST_LIMITS));
  const value = parseWin32LauncherUpdateLocatorResponse(ascii('https://original.example.invalid/u.zip 0268435456'));
  assert.equal(value.archiveBytesText, '0268435456');
  assert.equal(value.archiveBytes, 268435456);
  code(() => createWin32LauncherMetadataPlan(base({ launcherBytes: new Uint8Array(WIN32_LAUNCHER_MANIFEST_LIMITS.fileBytes + 1) })), 'MANIFEST_BUDGET');
});

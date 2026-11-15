import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inspectWin32LauncherCatalogContainers, compareWin32LauncherCatalogPair,
  LAUNCHER_CATALOG_PAIR_LIMITS, LauncherCatalogPairError, LauncherError,
  parseGameCatalog, parseRegionCatalog } from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-catalog-v1/original-vectors.json', import.meta.url)));
const exclusions = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-catalog-v1/profile-exclusions.json', import.meta.url))).exclusions;
const expand = value => {
  if (value === null) return null;
  const bytes = Uint8Array.from({ length: value.length }, (_, at) => (at * 37 + value.seed) & 255);
  for (const [at, byte] of value.patches) bytes[at] = byte;
  return bytes;
};
const input = () => ({ currentGameListBytes: Uint8Array.of(1, 2), currentRegionListBytes: Uint8Array.of(3),
  gameListBytes: Uint8Array.of(1, 2), regionListBytes: Uint8Array.of(3) });
const pairError = (callback, code) => assert.throws(callback, error => error instanceof LauncherCatalogPairError && error.code === code);
const games = '<Gamelist><Games/></Gamelist>', regions = '<Regionlist><Regions/></Regionlist>';

test('24 independent ElementTree vectors cover exact direct containers and XML failures', () => {
  for (const row of vectors.xml) {
    const run = () => inspectWin32LauncherCatalogContainers(row.gameListText, row.regionListText, { allowBareAmpersands: row.allowBareAmpersands });
    if (Object.hasOwn(exclusions, row.name)) assert.throws(run, error => error instanceof LauncherError && error.code === exclusions[row.name].errorCode, row.name);
    else if (row.expectedError) assert.throws(run, LauncherError, row.name);
    else {
      const result = run();
      for (const [key, value] of Object.entries(row.expected)) assert.equal(result[key], value, row.name + ':' + key);
      assert.equal(result.validation, 'containers-only'); assert.equal(result.gameSemantics, 'unverified');
      assert.ok(Object.isFrozen(result)); assert.ok(Object.isFrozen(result.diagnostics));
    }
  }
});

test('the container gate permits empty fields while existing complete parsers remain strict', () => {
  assert.equal(inspectWin32LauncherCatalogContainers(games, regions).containersPresent, true);
  assert.throws(() => parseGameCatalog(games), error => error.code === 'GAME_COUNT');
  assert.throws(() => parseRegionCatalog(regions), error => error.code === 'REGION_BUDGET');
  assert.equal(inspectWin32LauncherCatalogContainers('<Gamelist>text<Games><Other/></Games></Gamelist>', regions).gameList, true);
});

test('unsupported XML and resource budgets are explicit independent policies', () => {
  for (const source of ['<!DOCTYPE Gamelist><Gamelist><Games/></Gamelist>', games + '<Extra/>',
    '<Gamelist><Games>\0</Games></Gamelist>', '<Gamelist>' + '<a>'.repeat(10) + '</a>'.repeat(10) + '</Gamelist>',
    '<Gamelist><Games>' + 'a'.repeat(262145) + '</Games></Gamelist>']) {
    assert.throws(() => inspectWin32LauncherCatalogContainers(source, regions), LauncherError);
  }
});

test('container options do not invoke accessors or accept inherited compatibility flags', () => {
  let reads = 0;
  const options = Object.defineProperty({}, 'allowBareAmpersands', { get() { reads += 1; return true; } });
  for (const value of [options, Object.create({ allowBareAmpersands: true }), { allowBareAmpersands: 1 },
    { extra: true }, null, [], { [Symbol('extra')]: false }]) {
    assert.throws(() => inspectWin32LauncherCatalogContainers(games, regions, value), error => error.code === 'INVALID_INPUT');
  }
  assert.equal(reads, 0);
  assert.equal(inspectWin32LauncherCatalogContainers(games, regions, Object.create(null)).containersPresent, true);
});

test('29 Python byte-comparison vectors include all tail sizes, chunk boundaries, unavailable and pair changes', () => {
  assert.equal(vectors.comparisons.length, 29);
  for (const row of vectors.comparisons) {
    const source = Object.fromEntries(Object.entries(row.input).map(([key, value]) => [key, expand(value)]));
    const before = structuredClone(source), result = compareWin32LauncherCatalogPair(source);
    for (const [key, value] of Object.entries(row.expected)) assert.equal(result[key], value, row.name + ':' + key);
    assert.deepEqual(source, before, row.name);
    assert.equal(result.comparison, 'raw-bytes'); assert.equal(result.xmlValidation, 'not-performed');
    assert.equal(result.fileOperations, 'not-performed'); assert.equal(result.replacementUnit, 'catalog-pair');
    assert.equal(result.trust, 'unverified'); assert.ok(Object.isFrozen(result));
  }
});

test('comparison uses exact typed-array ranges and supports actual ArrayBuffer data', () => {
  const source = input(), backing = Uint8Array.of(9, 1, 2, 9);
  source.gameListBytes = backing.subarray(1, 3); source.regionListBytes = Uint8Array.of(3).buffer;
  assert.equal(compareWin32LauncherCatalogPair(source).requiresReplacement, false);
  source.gameListBytes = backing;
  assert.equal(compareWin32LauncherCatalogPair(source).gameList, 'different');
});

test('comparison ignores forged typed-array length, iterator, buffer and slice methods', () => {
  class Forged extends Uint8Array {
    get length() { throw Error('metadata must not run'); }
    get buffer() { throw Error('metadata must not run'); }
    *[Symbol.iterator]() { throw Error('iterator must not run'); }
    slice() { throw Error('slice must not run'); }
  }
  const source = input(); source.gameListBytes = new Forged([1, 2]);
  assert.equal(compareWin32LauncherCatalogPair(source).requiresReplacement, false);
});

test('comparison rejects missing, inherited, accessor, extra and symbol input fields', () => {
  const missing = input(); delete missing.currentGameListBytes;
  let reads = 0;
  const accessor = input(); Object.defineProperty(accessor, 'gameListBytes', { get() { reads += 1; throw Error('getter'); } });
  for (const source of [missing, Object.create(input()), accessor, { ...input(), extra: 1 },
    { ...input(), [Symbol('extra')]: 1 }, null, []]) pairError(() => compareWin32LauncherCatalogPair(source), 'CATALOG_PAIR_INPUT');
  assert.equal(reads, 0);
});

test('comparison rejects unsupported, detached and shared storage without mutating other inputs', () => {
  const detached = new ArrayBuffer(2), detachedView = new Uint8Array(detached);
  structuredClone(detached, { transfer: [detached] });
  for (const value of [undefined, 'bytes', new DataView(new ArrayBuffer(1)), new Uint16Array(1),
    new Proxy(Uint8Array.of(1, 2), {}), detached, detachedView, new Uint8Array(new SharedArrayBuffer(2))]) {
    const source = input(), before = source.currentGameListBytes.slice(); source.gameListBytes = value;
    pairError(() => compareWin32LauncherCatalogPair(source), 'CATALOG_PAIR_INPUT');
    assert.deepEqual(source.currentGameListBytes, before);
  }
  pairError(() => compareWin32LauncherCatalogPair({ ...input(), gameListBytes: null }), 'CATALOG_PAIR_INPUT');
});

test('comparison byte budgets cover both current and candidate buffers', () => {
  const maximum = LAUNCHER_CATALOG_PAIR_LIMITS.fileBytes;
  const source = input(); source.gameListBytes = new Uint8Array(maximum); source.currentGameListBytes = new Uint8Array(maximum);
  assert.equal(compareWin32LauncherCatalogPair(source).gameList, 'identical');
  for (const field of Object.keys(source)) {
    pairError(() => compareWin32LauncherCatalogPair({ ...source, [field]: new Uint8Array(maximum + 1) }), 'CATALOG_PAIR_BUDGET');
    pairError(() => compareWin32LauncherCatalogPair({ ...source, [field]: new ArrayBuffer(maximum + 1) }), 'CATALOG_PAIR_BUDGET');
  }
});

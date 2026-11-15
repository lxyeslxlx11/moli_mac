import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LAUNCHER_MANIFEST_LIMITS, LauncherManifestError, parseLauncherDigestResponse, parseLauncherCatalogDigestResponse,
  parseLauncherUpdateLocatorResponse, createLauncherMetadataPlan } from '../index.mjs';

const vector = JSON.parse(readFileSync(new URL('../../analysis/launcher-v12/original-manifest-vectors.json', import.meta.url))), inputs = vector.inputs;
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex')), ascii = text => new TextEncoder().encode(text);
const code = (fn, expected) => assert.throws(fn, e => e instanceof LauncherManifestError && e.code === expected);
const base = extra => ({ launcherBytes: bytes(inputs.launcher_hex), launcherDigestResponseBytes: ascii(inputs.launcher_md5),
  gameListBytes: bytes(inputs.game_list_hex), regionListBytes: bytes(inputs.region_list_hex),
  catalogDigestResponseBytes: ascii(`${inputs.game_list_md5} ${inputs.region_list_md5}`), ...extra });

test('15 independent Python self-response projections preserve native trim and cut order', () => {
  for (const row of vector.self_responses) {
    if (row.expected.error) code(() => parseLauncherDigestResponse(bytes(row.body_hex)), row.expected.error);
    else assert.deepEqual(parseLauncherDigestResponse(bytes(row.body_hex)), row.expected);
  }
});

test('single-character trim sequence is not equivalent to generic whitespace trim', () => {
  const h = inputs.launcher_md5;
  code(() => parseLauncherDigestResponse(ascii(`\t${h}`)), 'MANIFEST_DIGEST');
  code(() => parseLauncherDigestResponse(ascii(`\r\n ${h} \n\r`)), 'MANIFEST_DIGEST');
  const value = parseLauncherDigestResponse(ascii(`${h}\n\r`));
  assert.equal(value.md5, h); assert.equal(value.normalizedBytes, 33); assert.equal(value.trimmedBytes, 1); assert.equal(value.truncatedBytes, 1);
});

test('self digest cuts a long ASCII suffix while XML tokens remain exact32 characters', () => {
  const h = inputs.launcher_md5;
  assert.equal(parseLauncherDigestResponse(ascii(h + 'extra')).truncatedBytes, 5);
  code(() => parseLauncherCatalogDigestResponse(ascii(`${h}extra ${h}`)), 'MANIFEST_DIGEST');
  code(() => parseLauncherCatalogDigestResponse(ascii(`${h} ${h}extra`)), 'MANIFEST_DIGEST');
});

test('XML first token is GameList and second is RegionList, without sorting', () => {
  const value = parseLauncherCatalogDigestResponse(ascii(`${inputs.region_list_md5.toUpperCase()} ${inputs.game_list_md5.toUpperCase()} third fourth`));
  assert.equal(value.gameListMd5, inputs.region_list_md5); assert.equal(value.regionListMd5, inputs.game_list_md5); assert.equal(value.ignoredTokenCount, 2);
});

test('classic ASCII whitespace separates two tokens and surplus tokens are counted only', () => {
  for (const space of [' ', '\t', '\n', '\v', '\f', '\r']) {
    const value = parseLauncherCatalogDigestResponse(ascii(`${space}${inputs.game_list_md5}${space}${inputs.region_list_md5}${space}`));
    assert.equal(value.ignoredTokenCount, 0); assert.equal(value.gameListMd5, inputs.game_list_md5);
  }
  for (const text of ['', ' ', inputs.game_list_md5]) code(() => parseLauncherCatalogDigestResponse(ascii(text)), 'MANIFEST_TOKENS');
});

test('locator and progress token stay separate; text is not normalized into a request', () => {
  const locator = 'HtTp://updates.example.invalid/A%20B.zip?x=Y';
  const value = parseLauncherUpdateLocatorResponse(ascii(`\r\n${locator}\t00000042\nignored other`));
  assert.deepEqual(value, { locator, progressText: '00000042', progressDenominator: 42, ignoredTokenCount: 2, trust: 'unverified' });
  assert.equal(parseLauncherUpdateLocatorResponse(ascii('file:opaque 2147483647')).progressDenominator, 0x7fffffff);
});

test('independent progress policy rejects zero, sign, junk, overflow and exponent notation', () => {
  for (const text of ['0', '-1', '+1', '42suffix', '1e3', '1.0', '2147483648', '999999999999', '00000000001']) {
    code(() => parseLauncherUpdateLocatorResponse(ascii(`locator ${text}`)), 'MANIFEST_PROGRESS');
  }
  code(() => parseLauncherUpdateLocatorResponse(ascii('x'.repeat(1024) + ' 1')), 'MANIFEST_LOCATOR');
});

test('four original independent catalog change plans hash exact raw bytes', () => {
  for (const row of vector.catalog_plans) {
    const plan = createLauncherMetadataPlan(base({ catalogDigestResponseBytes: bytes(row.catalog_response_hex) }));
    assert.equal(plan.disposition, row.expected_disposition); assert.equal(plan.catalogs.gameList.requiresRefresh, row.game_changed);
    assert.equal(plan.catalogs.regionList.requiresRefresh, row.region_changed); assert.deepEqual(plan.catalogs.refreshOrder, row.refresh_order);
    assert.equal(plan.catalogs.ignoredTokenCount, 2); assert.equal(plan.launcher.localMd5, inputs.launcher_md5);
    assert.equal(plan.catalogs.gameList.localMd5, createHash('md5').update(bytes(inputs.game_list_hex)).digest('hex'));
    assert.equal(plan.trust, 'unverified'); assert.equal(plan.execution, 'not-performed'); assert.equal(plan.authentication, 'unverified');
  }
});

test('launcher mismatch produces only candidate metadata and does not inspect catalog inputs', () => {
  const request = base({ launcherDigestResponseBytes: ascii('0'.repeat(32)), locatorResponseBytes: ascii('https://example.invalid/package 4096') });
  Object.defineProperty(request, 'catalogDigestResponseBytes', { get() { throw Error('Unused catalog accessed'); } });
  Object.defineProperty(request, 'gameListBytes', { get() { throw Error('Unused file accessed'); } });
  const value = createLauncherMetadataPlan(request);
  assert.equal(value.disposition, 'launcher-candidate-needed'); assert.equal(value.catalogs, null); assert.equal(value.update.expectedMd5, '0'.repeat(32));
  assert.equal(value.update.progressDenominator, 4096); assert.equal(value.launcher.matches, false);
});

test('current launcher skips unused locator and never returns ready or authenticated', () => {
  const request = base(); Object.defineProperty(request, 'locatorResponseBytes', { get() { throw Error('Unused locator accessed'); } });
  const value = createLauncherMetadataPlan(request);
  assert.equal(value.disposition, 'metadata-current'); assert.equal(value.update, null); assert.deepEqual(value.catalogs.refreshOrder, []);
  assert.equal(value.authentication, 'unverified'); assert.ok(Object.isFrozen(value) && Object.isFrozen(value.launcher) && Object.isFrozen(value.catalogs.refreshOrder));
});

test('metadata response character, NUL and fixed budgets fail explicitly', () => {
  for (const parse of [parseLauncherDigestResponse, parseLauncherCatalogDigestResponse, parseLauncherUpdateLocatorResponse]) {
    code(() => parse(Uint8Array.of(0)), 'MANIFEST_NUL'); code(() => parse(Uint8Array.of(128)), 'MANIFEST_CHARACTER'); code(() => parse(Uint8Array.of(27)), 'MANIFEST_CHARACTER');
    code(() => parse(new Uint8Array(4097).fill(32)), 'MANIFEST_BUDGET');
  }
  const tokens = Array.from({ length: 129 }, () => inputs.game_list_md5).join(' ');
  code(() => parseLauncherCatalogDigestResponse(ascii(tokens)), 'MANIFEST_BUDGET');
  const shortTokens = `${inputs.game_list_md5} ${inputs.region_list_md5} ` + Array(127).fill('x').join(' ');
  assert.ok(shortTokens.length < 4096);
  code(() => parseLauncherCatalogDigestResponse(ascii(shortTokens)), 'MANIFEST_BUDGET');
  code(() => createLauncherMetadataPlan(base({ launcherBytes: new Uint8Array(LAUNCHER_MANIFEST_LIMITS.fileBytes + 1) })), 'MANIFEST_BUDGET');
});

test('input offsets, ArrayBuffer and spoofed typed metadata use owned real bytes', () => {
  const src = ascii(inputs.launcher_md5), padded = new Uint8Array(src.length + 4); padded.set(src, 2);
  assert.equal(parseLauncherDigestResponse(padded.subarray(2, 34)).md5, inputs.launcher_md5);
  assert.equal(parseLauncherDigestResponse(src.buffer).md5, inputs.launcher_md5);
  class Wrong extends Uint8Array { get byteLength() { return 1; } get buffer() { return new ArrayBuffer(1); } *[Symbol.iterator]() { yield 0; } }
  assert.equal(parseLauncherDigestResponse(new Wrong(src)).md5, inputs.launcher_md5);
  for (const value of [null, '', [], new DataView(new ArrayBuffer(32)), new Proxy(src, {}), new Proxy(new ArrayBuffer(32), {})]) code(() => parseLauncherDigestResponse(value), 'INVALID_INPUT');
  const before = src.slice(); createLauncherMetadataPlan(base({ launcherDigestResponseBytes: src })); assert.deepEqual(src, before);
});

test('empty raw files are digestible without becoming valid parsed catalogs', () => {
  const empty = new Uint8Array(0), hash = createHash('md5').update(empty).digest('hex');
  const value = createLauncherMetadataPlan({ launcherBytes: empty, launcherDigestResponseBytes: ascii(hash), gameListBytes: empty, regionListBytes: empty,
    catalogDigestResponseBytes: ascii(`${hash} ${hash}`) });
  assert.equal(value.disposition, 'metadata-current'); assert.equal(value.authentication, 'unverified');
  for (const input of [null, [], 'plan']) code(() => createLauncherMetadataPlan(input), 'INVALID_INPUT');
  assert.ok(Object.isFrozen(LAUNCHER_MANIFEST_LIMITS));
});

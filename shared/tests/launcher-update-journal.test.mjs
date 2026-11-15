import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE as profile, LauncherUpdateJournalError,
  parseWin32LauncherUpdateJournalHeader as parse } from '../index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-update-recovery-v1/original-vectors.json', import.meta.url)));
const bytes = value => Uint8Array.from(Buffer.from(value, 'hex'));
const good = stage => bytes(vectors.cases.find(row => row.name === 'recorded-stage-' + stage).header_hex);
const code = (input, expected) => assert.throws(() => parse(input), error => error instanceof LauncherUpdateJournalError && error.code === expected);

test('all27 independently produced Python vectors match the declared exact-header profile', () => {
  for (const row of vectors.cases) {
    const data = bytes(row.header_hex);
    if (row.expected_error) code(data, row.expected_error);
    else assert.equal(parse(data).recordedStage, row.expected_stage, row.name);
  }
});

test('all5 recorded phases remain metadata without an update, file or ACK success claim', () => {
  const names = ['before-replacement', 'backup-moved', 'replacement-installed', 'awaiting-startup-ack', 'commit-recorded'];
  for (let stage = 1; stage <= 5; stage++) {
    const value = parse(good(stage));
    assert.equal(value.recordedPhase, names[stage - 1]); assert.equal(value.version, 1); assert.equal(value.headerBytes, 16);
    assert.equal(value.integrity, 'xor-consistency-only'); assert.equal(value.authentication, 'unverified');
    assert.equal(value.fileState, 'not-inspected'); assert.equal(value.startupAcknowledgement, 'not-proven');
    assert.equal(value.recovery, 'not-performed'); assert.equal(Object.isFrozen(value), true);
    assert.equal(Object.hasOwn(value, 'committed'), false); assert.equal(Object.hasOwn(value, 'recovered'), false);
  }
});

test('a native-readable tail is an explicit file/header coverage difference', () => {
  const rows = vectors.cases.filter(row => row.native_first16_accepts && row.expected_error);
  assert.equal(rows.length, 2);
  for (const row of rows) { code(bytes(row.header_hex), 'JOURNAL_HEADER_LENGTH'); assert.equal(parse(bytes(row.header_hex).subarray(0, 16)).version, 1); }
});

test('typed subviews and exact ArrayBuffers preserve offsets and leave all input bytes unchanged', () => {
  const padded = new Uint8Array(40).fill(255); padded.set(good(3), 7); const before = padded.slice();
  assert.equal(parse(padded.subarray(7, 23)).recordedStage, 3); assert.deepEqual(padded, before);
  assert.equal(parse(good(4).buffer).recordedStage, 4); code(padded.buffer, 'JOURNAL_HEADER_LENGTH');
});

test('intrinsic byte access ignores caller-shadowed buffer, length, offset and iterator properties', () => {
  let reads = 0;
  class View extends Uint8Array {
    get buffer() { reads++; throw Error('Unexpected getter'); }
    get length() { reads++; throw Error('Unexpected getter'); }
    get byteLength() { reads++; throw Error('Unexpected getter'); }
    get byteOffset() { reads++; throw Error('Unexpected getter'); }
    [Symbol.iterator]() { reads++; throw Error('Unexpected iterator'); }
  }
  const value = new View(16); Uint8Array.prototype.set.call(value, good(2));
  assert.equal(parse(value).recordedStage, 2); assert.equal(reads, 0);
});

test('shared and detached byte storage cannot masquerade as a header', () => {
  const shared = new SharedArrayBuffer(16); code(shared, 'JOURNAL_INPUT'); code(new Uint8Array(shared), 'JOURNAL_INPUT');
  const detached = new ArrayBuffer(16), view = new Uint8Array(detached); structuredClone(detached, { transfer: [detached] });
  code(detached, 'JOURNAL_INPUT'); code(view, 'JOURNAL_INPUT');
  code(new ArrayBuffer(0), 'JOURNAL_HEADER_LENGTH'); code(new Uint8Array(0), 'JOURNAL_HEADER_LENGTH');
});

test('opaque proxies, DataViews and nonbyte inputs are rejected without coercing them', () => {
  let touched = 0;
  const value = { toString() { touched++; throw Error('private detail'); }, valueOf() { touched++; throw Error('private detail'); } };
  for (const input of [value, null, undefined, 16, 'POLU', Symbol('private detail'), [], new DataView(new ArrayBuffer(16)),
    new Proxy(good(1), {}), new Proxy(good(1).buffer, {})]) code(input, 'JOURNAL_INPUT');
  assert.equal(touched, 0);
});

test('XOR comparison uses unsigned32 words rather than signed JavaScript bitwise output', () => {
  for (let stage = 1; stage <= 5; stage++) {
    const input = good(stage), check = new DataView(input.buffer).getUint32(12, true);
    assert.ok(check > 0x7fffffff); assert.equal(parse(input).recordedStage, stage);
    input[15] ^= 0x80; code(input, 'JOURNAL_CHECKSUM');
  }
});

test('changing stage and its XOR word together demonstrates consistency is not authentication', () => {
  const input = good(1), view = new DataView(input.buffer);
  view.setUint32(8, 5, true); view.setUint32(12, (5 ^ profile.xorMask) >>> 0, true);
  const value = parse(input); assert.equal(value.recordedStage, 5); assert.equal(value.authentication, 'unverified');
  assert.equal(value.startupAcknowledgement, 'not-proven'); assert.equal(value.recovery, 'not-performed');
});

test('profile constants are frozen and parser results do not retain caller storage', () => {
  assert.equal(Object.isFrozen(profile), true); assert.equal(profile.headerBytes, 16);
  const input = good(1), result = parse(input); input.fill(0);
  assert.equal(result.recordedStage, 1); assert.equal(Object.values(result).some(x => x instanceof ArrayBuffer || ArrayBuffer.isView(x)), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { deflateRawSync, deflateSync, gzipSync } from 'node:zlib';
import { LAUNCHER_UPDATE_LIMITS, LauncherUpdateError, inspectLauncherUpdateArchive, decodeLauncherUpdatePackage } from '../index.mjs';
import { md5Hex } from '../md5.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v11/original-update-vectors.json', import.meta.url))).cases;
const bytes = value => Uint8Array.from(Buffer.from(value, 'hex'));
const sample = name => vectors.find(value => value.name === name);
const decode = row => decodeLauncherUpdatePackage(bytes(row.archive_hex), { expectedMd5: row.expected.md5 });
const code = (action, expected) => assert.throws(action, e => e instanceof LauncherUpdateError && (Array.isArray(expected) ? expected.includes(e.code) : e.code === expected));
const clone = name => bytes(sample(name).archive_hex);
const view = data => new DataView(data.buffer, data.byteOffset, data.byteLength);
const metadata = data => inspectLauncherUpdateArchive(data);
const first = data => metadata(data).entries[0];
function setBoth(data, localOffset, centralOffset, value, width = 4) {
  const e = first(data), at = metadata(data).centralDirectoryOffset, v = view(data);
  v[width === 2 ? 'setUint16' : 'setUint32'](e.localHeaderOffset + localOffset, value, true);
  v[width === 2 ? 'setUint16' : 'setUint32'](at + centralOffset, value, true);
  return data;
}
function replaceCompressed(data, packed, declaredLength, expectedCrc) {
  const info = metadata(data), e = info.entries[0], oldEnd = e.dataOffset + e.compressedBytes;
  const delta = packed.length - e.compressedBytes, output = new Uint8Array(data.length + delta);
  output.set(data.subarray(0, e.dataOffset)); output.set(packed, e.dataOffset); output.set(data.subarray(oldEnd), e.dataOffset + packed.length);
  const v = view(output), central = info.centralDirectoryOffset + delta, end = info.endRecordOffset + delta;
  v.setUint32(e.localHeaderOffset + 18, packed.length, true); v.setUint32(central + 20, packed.length, true);
  v.setUint32(e.localHeaderOffset + 22, declaredLength, true); v.setUint32(central + 24, declaredLength, true);
  v.setUint32(e.localHeaderOffset + 14, expectedCrc, true); v.setUint32(central + 16, expectedCrc, true);
  v.setUint32(end + 16, central - info.prefixBytes, true); return output;
}

test('15 original Python ZIP cases decode to independent exact metadata and digests', () => {
  for (const row of vectors) {
    const value = decode(row), expected = row.expected;
    assert.equal(value.archive.entries.length, expected.entry_count); assert.equal(value.archive.prefixBytes, expected.prefix_bytes);
    assert.equal(Buffer.from(value.entry.nameBytes).toString('hex'), expected.name_hex);
    for (const [key, original] of [['method', 'method'], ['flags', 'flags'], ['crc32', 'crc32']]) assert.equal(value.entry[key], expected[original]);
    assert.equal(value.payloadBytes.length, expected.output_bytes); assert.equal(value.actualMd5, expected.md5);
    assert.equal(createHash('sha256').update(value.payloadBytes).digest('hex'), expected.sha256);
    assert.equal(value.crcVerified, true); assert.equal(value.trust, 'unverified'); assert.equal(value.replacement, 'not-performed'); assert.equal(value.authentication, 'unverified');
  }
});

test('central order selects first entry even when local record order differs', () => {
  const value = decode(sample('reordered-central'));
  assert.equal(Buffer.from(value.entry.nameBytes).toString(), 'central-first.bin');
  assert.equal(Buffer.from(value.payloadBytes).toString(), 'Original central-first data');
  assert.ok(value.entry.localHeaderOffset > value.archive.entries[1].localHeaderOffset);
});

test('internal multiblock MD5 matches Node across padding, block and input boundaries', () => {
  for (const length of [0, 1, 16, 55, 56, 57, 63, 64, 65, 119, 120, 127, 128, 129, 1023, 1024, 1025, 16384, 32769, 100000]) {
    const input = Uint8Array.from({ length }, (_, i) => i * 13 + 7);
    assert.equal(md5Hex(input), createHash('md5').update(input).digest('hex'));
    assert.equal(input[0], length ? 7 : undefined);
  }
});

test('input offsets, ArrayBuffer and output ownership preserve caller bytes', () => {
  const row = sample('stored-bytes'), source = bytes(row.archive_hex), padded = new Uint8Array(source.length + 10); padded.set(source, 5);
  const offset = padded.subarray(5, 5 + source.length), value = decodeLauncherUpdatePackage(offset, { expectedMd5: row.expected.md5.toUpperCase() });
  assert.equal(value.actualMd5, row.expected.md5); value.payloadBytes.fill(3); value.entry.nameBytes.fill(4);
  assert.deepEqual(offset, source); assert.equal(decodeLauncherUpdatePackage(source.buffer, { expectedMd5: row.expected.md5 }).payloadBytes.length, 256);
  assert.ok(Object.isFrozen(value) && Object.isFrozen(value.archive.entries));
});

test('input byte metadata and iterators cannot replace content or bypass budgets', () => {
  const original = clone('stored-bytes');
  class Wrong extends Uint8Array { get byteLength() { return 22; } get buffer() { return new ArrayBuffer(22); } *[Symbol.iterator]() { yield 0; } }
  assert.equal(decodeLauncherUpdatePackage(new Wrong(original), { expectedMd5: sample('stored-bytes').expected.md5 }).payloadBytes.length, 256);
  for (const input of [null, 'zip', [], new DataView(new ArrayBuffer(22))]) code(() => metadata(input), 'INVALID_INPUT');
  for (const input of [new Uint8Array(0), new Uint8Array(LAUNCHER_UPDATE_LIMITS.archiveBytes + 1)]) code(() => metadata(input), 'ZIP_INPUT_LENGTH');
  code(() => metadata(new Proxy(original, {})), 'INVALID_INPUT');
  code(() => metadata(new Proxy(new ArrayBuffer(22), {})), 'INVALID_INPUT');
});

test('all truncated prefixes and unexpected trailing bytes are rejected with stable errors', () => {
  const input = clone('stored-bytes');
  for (let at = 0; at < input.length; at += 1) assert.throws(() => metadata(input.subarray(0, at)), LauncherUpdateError);
  const trailing = new Uint8Array(input.length + 1); trailing.set(input); code(() => metadata(trailing), 'ZIP_EOCD');
});

test('EOCD disk, ZIP64, entry counts and directory bounds are validated', () => {
  for (const [offset, value, width, expected] of [[4, 1, 2, 'ZIP_UNSUPPORTED'], [8, 2, 2, 'ZIP_UNSUPPORTED'], [10, 0xffff, 2, 'ZIP_UNSUPPORTED'], [16, 0xffffffff, 4, 'ZIP_UNSUPPORTED'], [16, 0xfffffffe, 4, 'ZIP_DIRECTORY']]) {
    const data = clone('stored-bytes'), end = metadata(data).endRecordOffset; view(data)[width === 2 ? 'setUint16' : 'setUint32'](end + offset, value, true); code(() => metadata(data), expected);
  }
  for (const count of [0, 65]) {
    const data = clone('stored-bytes'), end = metadata(data).endRecordOffset; view(data).setUint16(end + 8, count, true); view(data).setUint16(end + 10, count, true); code(() => metadata(data), 'ZIP_ENTRY_BUDGET');
  }
});

test('unsupported flags, methods and ZIP versions fail explicitly', () => {
  for (const flag of [1, 16, 32, 64, 0x1000, 0x2000]) code(() => metadata(setBoth(clone('stored-bytes'), 6, 8, flag, 2)), 'ZIP_UNSUPPORTED');
  for (const method of [9, 12, 99]) code(() => metadata(setBoth(clone('stored-bytes'), 8, 10, method, 2)), 'ZIP_UNSUPPORTED');
  code(() => metadata(setBoth(clone('stored-bytes'), 4, 6, 45, 2)), 'ZIP_UNSUPPORTED');
});

test('local signatures, names, flags, CRC and size mismatches fail before extraction', () => {
  for (const [offset, width] of [[0, 4], [6, 2], [8, 2], [14, 4], [18, 4], [22, 4], [26, 2], [30, 2]]) {
    const data = clone('stored-bytes'), v = view(data); v[width === 2 ? 'setUint16' : 'setUint32'](offset, 123, true);
    code(() => metadata(data), ['ZIP_LOCAL_MISMATCH', 'ZIP_TRUNCATED']);
  }
});

test('descriptor forms require matching CRC and sizes even when CRC equals signature', () => {
  for (const name of ['descriptor-signed', 'descriptor-unsigned', 'crc-marker-signed', 'crc-marker-unsigned']) {
    const row = sample(name), input = clone(name), e = first(input);
    assert.equal(e.descriptorBytes, name.endsWith('unsigned') ? 12 : 16);
    const at = e.dataOffset + e.compressedBytes + (e.descriptorBytes === 16 ? 4 : 0); input[at] ^= 1;
    code(() => metadata(input), 'ZIP_DESCRIPTOR'); assert.ok(decode(row).crcVerified);
  }
});

test('extra TLVs are bounded and ZIP64 extension is rejected', () => {
  const data = clone('extra-comment'), e = first(data), at = e.localHeaderOffset + 30 + e.nameBytes.length;
  view(data).setUint16(at, 1, true); code(() => metadata(data), 'ZIP_UNSUPPORTED');
  const broken = clone('extra-comment'); view(broken).setUint16(at + 2, 100, true); code(() => metadata(broken), 'ZIP_TRUNCATED');
  const tooLong = clone('stored-bytes'), central = metadata(tooLong).centralDirectoryOffset; view(tooLong).setUint16(central + 28, 1025, true); code(() => metadata(tooLong), 'ZIP_METADATA_BUDGET');
});

test('local ranges and duplicate offsets cannot overlap or hide an entry', () => {
  const data = clone('multiple-entries'), m = metadata(data), central = m.centralDirectoryOffset;
  const second = central + 46 + m.entries[0].nameBytes.length; view(data).setUint32(second + 42, m.entries[0].localHeaderOffset, true);
  code(() => metadata(data), ['ZIP_LOCAL_MISMATCH', 'ZIP_LAYOUT']);
});

test('declared output is bounded before allocation and stored sizes must agree', () => {
  const data = setBoth(clone('deflate-fixed'), 22, 24, LAUNCHER_UPDATE_LIMITS.outputBytes + 1);
  code(() => metadata(data), 'ZIP_OUTPUT_BUDGET');
  code(() => metadata(setBoth(clone('stored-bytes'), 22, 24, 255)), 'ZIP_LOCAL_MISMATCH');
});

test('directories and special Unix entry types cannot be selected as candidates', () => {
  for (const mode of [0x4000, 0xa000, 0x2000]) {
    const data = clone('stored-bytes'), at = metadata(data).centralDirectoryOffset;
    view(data).setUint16(at + 4, (3 << 8) | 20, true); view(data).setUint32(at + 38, mode * 65536, true);
    code(() => metadata(data), 'ZIP_ENTRY_TYPE');
  }
});

test('CRC mismatch and digest mismatch never return candidate data', () => {
  const row = sample('stored-bytes'), input = clone(row.name), e = first(input); input[e.dataOffset] ^= 1;
  code(() => decodeLauncherUpdatePackage(input, { expectedMd5: row.expected.md5 }), 'ZIP_CRC_MISMATCH');
  code(() => decodeLauncherUpdatePackage(clone(row.name), { expectedMd5: '0'.repeat(32) }), 'UPDATE_DIGEST_MISMATCH');
  for (const expectedMd5 of [null, undefined, 0, 'a'.repeat(31), 'g'.repeat(32), ' ' + row.expected.md5, row.expected.md5 + '\n']) code(() => decodeLauncherUpdatePackage(input, { expectedMd5 }), 'UPDATE_DIGEST_INPUT');
});

test('raw Deflate requires full stream completion, exact output and zero trailing input', () => {
  const row = sample('deflate-fixed'), original = clone(row.name), entry = first(original), packed = original.subarray(entry.dataOffset, entry.dataOffset + entry.compressedBytes);
  const extra = new Uint8Array(packed.length + 1); extra.set(packed); extra[extra.length - 1] = 255;
  for (const compressed of [packed.subarray(0, packed.length - 1), extra, Uint8Array.of(7), deflateSync('wrong wrapper'), gzipSync('wrong wrapper')]) {
    const data = replaceCompressed(original, compressed, entry.uncompressedBytes, entry.crc32);
    code(() => decodeLauncherUpdatePackage(data, { expectedMd5: row.expected.md5 }), ['ZIP_DEFLATE', 'ZIP_OUTPUT_LENGTH']);
  }
  const tooMuch = deflateRawSync(new Uint8Array(entry.uncompressedBytes + 1));
  const overflow = replaceCompressed(original, tooMuch, entry.uncompressedBytes, entry.crc32);
  code(() => decodeLauncherUpdatePackage(overflow, { expectedMd5: row.expected.md5 }), 'ZIP_OUTPUT_LENGTH');
});

test('zero-length payloads and all Deflate block families remain untrusted', () => {
  for (const name of ['stored-empty', 'deflate-empty', 'deflate-fixed', 'deflate-dynamic', 'deflate-stored-block']) {
    const value = decode(sample(name)); assert.equal(value.trust, 'unverified'); assert.equal(value.replacement, 'not-performed');
  }
  assert.ok(Object.isFrozen(LAUNCHER_UPDATE_LIMITS));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readIndexFile, readFrameFile } from '../file-io.mjs';
import { makeSyntheticPair } from '../fixture.mjs';
import { LIMITS, getRecord, decodeRD } from '../../shared/index.mjs';

function mockFile(bytes, claimedSize = bytes.length) {
  const slices = [];
  return {
    size: claimedSize,
    slices,
    arrayBuffer() { throw new Error('Whole file reads are forbidden.'); },
    slice(start, end) {
      slices.push([start, end]);
      return { arrayBuffer: async () => bytes.slice(start, end).buffer };
    },
  };
}

test('index file uses one bounded slice and preserves exact bytes', async () => {
  const bytes = makeSyntheticPair().index;
  const file = mockFile(bytes);
  assert.deepEqual(await readIndexFile(file), bytes);
  assert.deepEqual(file.slices, [[0, 40]]);
});

test('index empty, partial, oversized, and unsafe sizes reject before IO', async () => {
  for (const size of [0, 39, LIMITS.indexBytes + 40, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    const file = mockFile(new Uint8Array(0), size);
    await assert.rejects(() => readIndexFile(file));
    assert.deepEqual(file.slices, []);
  }
});

test('short index read is rejected', async () => {
  await assert.rejects(() => readIndexFile(mockFile(new Uint8Array(39), 40)), /读取长度/);
});

test('large graphic file reads only the selected frame range', async () => {
  const slices = [];
  const frame = makeSyntheticPair().frame;
  const start = 1_000_000_000;
  const file = {
    size: 5 * 1024 * 1024 * 1024,
    arrayBuffer() { throw new Error('Must not read the complete graphic archive.'); },
    slice(a, b) { slices.push([a, b]); return { arrayBuffer: async () => frame.buffer }; },
  };
  assert.deepEqual(await readFrameFile(file, { start, end: start + frame.length, byteLength: frame.length }), frame);
  assert.deepEqual(slices, [[start, start + frame.length]]);
});

test('invalid or overflowing frame ranges reject before IO', async () => {
  const invalid = [
    { start: -1, end: 16, byteLength: 17 },
    { start: 0, end: 0, byteLength: 0 },
    { start: 0, end: 16, byteLength: 15 },
    { start: 100, end: 117, byteLength: 17 },
    { start: 0.5, end: 16.5, byteLength: 16 },
    { start: 0, end: Number.MAX_SAFE_INTEGER + 1, byteLength: Number.MAX_SAFE_INTEGER + 1 },
    { start: 0, end: LIMITS.frameBytes + 1, byteLength: LIMITS.frameBytes + 1 },
  ];
  for (const range of invalid) {
    const file = mockFile(new Uint8Array(116));
    await assert.rejects(() => readFrameFile(file, range));
    assert.deepEqual(file.slices, []);
  }
});

test('short selected frame read is rejected', async () => {
  const file = mockFile(new Uint8Array(31), 32);
  await assert.rejects(() => readFrameFile(file, { start: 0, end: 32, byteLength: 32 }), /读取不完整/);
});

test('original UI fixture roundtrips through shared parser without official assets', () => {
  const pair = makeSyntheticPair();
  const record = getRecord(pair.index, 0, { pairedByteCount: pair.frame.length });
  const frame = decodeRD(pair.frame, { record });
  assert.equal(record.id, 1001);
  assert.equal(frame.width, 64);
  assert.equal(frame.height, 48);
  assert.equal(frame.pixels.length, 3072);
  assert.equal(frame.opaque.headerWord12, 0x12345678);
  assert.equal(frame.pixels[0], 255);
});

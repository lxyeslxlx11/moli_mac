import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { RD_RUN_MODEL, RDRunError, decodeRDRunModel, decodeRD } from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/game-rd-runs-v1/original-vectors.json', import.meta.url))).vectors;
const bytes = row => new Uint8Array(Buffer.from(row.hex, 'hex'));
const sha = value => createHash('sha256').update(value).digest('hex');
function rejected(value, code, options) {
  assert.throws(() => decodeRDRunModel(value, options), error => error instanceof RDRunError && error.code === code);
}
function header(body, { version = 1, width = 1, height = 1, palette = 0 } = {}) {
  const raw = new Uint8Array((version === 3 ? 20 : 16) + body.length), data = new DataView(raw.buffer);
  raw.set([0x52, 0x44, version, 0]); data.setUint32(4, width, true); data.setUint32(8, height, true); data.setUint32(12, raw.length, true);
  if (version === 3) data.setUint32(16, palette, true);
  raw.set(body, version === 3 ? 20 : 16); return raw;
}

test('RD run structural model matches independent original Python encodings and every known mask', () => {
  const observed = new Set();
  for (const row of vectors) {
    const raw = bytes(row), frame = decodeRDRunModel(raw, { record: { byteLength: raw.length, width: row.width, height: row.height } });
    assert.equal(sha(frame.pixels), row.pixelsSha256, row.id); assert.equal(sha(frame.pixelKnown), row.pixelKnownSha256, row.id);
    assert.equal(sha(frame.opaque.paletteBytes), row.paletteSha256, row.id); assert.equal(sha(frame.opaque.paletteKnown), row.paletteKnownSha256, row.id);
    assert.equal(frame.stats.knownPixelBytes, row.knownPixels); assert.equal(frame.stats.knownPaletteBytes, row.knownPalette);
    assert.equal(frame.stats.commandCount, row.commandCount); assert.equal(frame.consumedBytes, raw.length);
    for (const [opcode, count] of Object.entries(row.opcodeCounts)) { assert.equal(frame.stats.opcodeCounts[opcode], count); observed.add(opcode); }
    assert.equal(frame.scope, 'structural-model-only'); assert.equal(frame.gameConsumer, 'unverified'); assert.equal(frame.color, 'unverified');
  }
  assert.deepEqual([...observed].sort(), ['0', '1', '8', '9', 'a', 'c', 'd', 'e']);
});

test('RD known zero remains distinct from an unknown run across pixel/palette boundaries', () => {
  const row = vectors.find(row => row.id === 'mixed-known-zero-and-unknown'), frame = decodeRDRunModel(bytes(row));
  assert.equal(frame.pixels[0], 0); assert.equal(frame.pixelKnown[0], 1);
  assert.equal(frame.pixels[2], 0); assert.equal(frame.pixelKnown[2], 0);
  assert.equal(frame.pixels[7], 0); assert.equal(frame.pixelKnown[7], 1);
  const cross = decodeRDRunModel(bytes(vectors.find(row => row.id === 'unknown-crosses-palette')));
  assert.deepEqual([...cross.pixelKnown], [1, 1, 1, 1, 1, 1, 0, 0]);
  assert.deepEqual([...cross.opaque.paletteKnown], [0, 0, 0, 0, 0, 1]);
});

test('RD rejects every unsupported opcode and zero count without inventing terminators', () => {
  for (let opcode = 0; opcode < 16; opcode++) {
    if (!RD_RUN_MODEL.opcodes.includes(opcode)) rejected(header([opcode << 4, 0, 1, 2, 3]), 'RD_RUN_OPCODE');
    else {
      const body = [opcode << 4]; if (opcode >= 8 && opcode <= 10) body.push(31);
      for (let n = 0; n < (opcode & 3); n++) body.push(0);
      rejected(header(body), 'RD_RUN_ZERO_COUNT');
    }
  }
});

test('RD rejects truncated operands/literals, extra commands and short/long expansion', () => {
  for (const body of [[0x10], [0x81], [0x91], [0xa1, 33, 0], [0xd1], [0xe1, 0], [0x01]]) rejected(header(body), 'RD_RUN_TRUNCATED');
  rejected(header([]), 'RD_RUN_UNDERRUN'); rejected(header([0x81, 7], { width: 2 }), 'RD_RUN_UNDERRUN');
  rejected(header([0x82, 7]), 'RD_RUN_OVERRUN'); rejected(header([0x81, 7, 0xc1]), 'RD_RUN_OVERRUN');
  rejected(header([0xc2]), 'RD_RUN_OVERRUN');
});

test('RD header lengths, dimensions, palette and optional selected record are checked before output', () => {
  rejected(new Uint8Array(15), 'RD_RUN_TRUNCATED'); const badMagic = header([0xc1]); badMagic[0] = 0; rejected(badMagic, 'RD_RUN_MAGIC');
  for (const version of [0, 2, 4, 255]) rejected(header([0xc1], { version }), 'RD_RUN_VERSION');
  const shortV3 = header([]); shortV3[2] = 3; rejected(shortV3, 'RD_RUN_TRUNCATED');
  for (const dimensions of [{ width: 0 }, { height: 0 }]) rejected(header([0xc1], dimensions), 'RD_RUN_DIMENSIONS');
  for (const dimensions of [{ width: 0xffffffff, height: 0xffffffff }, { width: RD_RUN_MODEL.pixels + 1 }]) rejected(header([0xc1], dimensions), 'RD_RUN_PIXEL_BUDGET');
  const badLength = header([0xc1]); new DataView(badLength.buffer).setUint32(12, 0, true); rejected(badLength, 'RD_RUN_LENGTH');
  for (const palette of [0, 1, 769, 0xffffffff]) rejected(header([0xc1], { version: 3, palette }), 'RD_RUN_PALETTE');
  for (const record of [{ width: 2, height: 1, byteLength: 17 }, { width: 1, height: 1, byteLength: 18 }]) rejected(header([0xc1]), 'RD_RUN_RECORD_MISMATCH', { record });
  rejected(new Uint8Array(RD_RUN_MODEL.inputBytes + 1), 'RD_RUN_INPUT_BUDGET');
});

test('RD maximum output budget is exact and repeated-byte ordering uses value before count extensions', () => {
  // Four E runs of 1,048,575 positions followed by four positions reach exactly 4 Mi.
  const raw = header([0xef, 255, 255, 0xef, 255, 255, 0xef, 255, 255, 0xef, 255, 255, 0xc4], { width: RD_RUN_MODEL.pixels });
  const frame = decodeRDRunModel(raw); assert.equal(frame.pixels.length, RD_RUN_MODEL.pixels); assert.equal(frame.stats.unknownPixelBytes, RD_RUN_MODEL.pixels);
  const repeated = decodeRDRunModel(header([0x91, 29, 3], { width: 259 }));
  assert.equal(repeated.stats.repeatBytes, 259); assert.equal(repeated.pixels[258], 29);
});

test('RD owns independent output arrays and respects actual typed subview bounds and intrinsic accessors', () => {
  const row = vectors.find(row => row.id === 'repeat-crosses-palette'), raw = bytes(row), padded = new Uint8Array(raw.length + 20); padded.set(raw, 7);
  class Adversarial extends Uint8Array {
    get buffer() { throw Error('buffer getter invoked'); }
    get byteOffset() { throw Error('offset getter invoked'); }
    get length() { throw Error('length getter invoked'); }
    slice() { throw Error('slice invoked'); }
  }
  const input = new Adversarial(padded.buffer, 7, raw.length), frame = decodeRDRunModel(input), expected = decodeRDRunModel(raw.buffer);
  assert.deepEqual(frame.pixels, expected.pixels); padded.fill(0); assert.equal(sha(frame.pixels), row.pixelsSha256);
  assert.equal(new Set([frame.pixels.buffer, frame.pixelKnown.buffer, frame.opaque.paletteBytes.buffer, frame.opaque.paletteKnown.buffer]).size, 4);
  frame.pixels.fill(255); assert.equal(sha(frame.pixelKnown), row.pixelKnownSha256); assert.equal(sha(frame.opaque.paletteBytes), row.paletteSha256);
});

test('RD rejects detached/shared/proxy/non-byte inputs and accessor metadata without executing getters', () => {
  const raw = header([0xc1]); let calls = 0;
  for (const input of [null, [], 'RD', {}, new Uint16Array(16), new DataView(raw.buffer), new Proxy(raw, {})]) rejected(input, 'RD_RUN_INPUT');
  if (typeof SharedArrayBuffer === 'function') { const shared = new SharedArrayBuffer(20); rejected(shared, 'RD_RUN_INPUT'); rejected(new Uint8Array(shared), 'RD_RUN_INPUT'); }
  const detached = header([0xc1]); structuredClone(detached.buffer, { transfer: [detached.buffer] }); rejected(detached, 'RD_RUN_INPUT'); rejected(detached.buffer, 'RD_RUN_INPUT');
  rejected(raw, 'RD_RUN_OPTIONS', { get record() { calls++; return {}; } });
  rejected(raw, 'RD_RUN_RECORD', { record: { get width() { calls++; return 1; }, height: 1, byteLength: 17 } });
  for (const options of [null, 1, 'x', { unknown: true }, { record: {} }]) rejected(raw, options?.record ? 'RD_RUN_RECORD' : 'RD_RUN_OPTIONS', options);
  assert.equal(calls, 0);
});

test('existing observed raw RD decoder stays separate and continues to reject compressed input', () => {
  assert.throws(() => decodeRD(header([0xc1])), error => error.code === 'UNSUPPORTED_VERSION');
  const raw = new Uint8Array(17), data = new DataView(raw.buffer); raw.set([0x52, 0x44]); data.setUint32(4, 1, true); data.setUint32(8, 1, true); raw[16] = 19;
  assert.deepEqual([...decodeRD(raw).pixels], [19]); assert.equal(Object.isFrozen(RD_RUN_MODEL), true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { MAP01_LIMITS, Map01Error, parseMAP01 } from '../index.mjs';

// Original synthetic bytes; dimensions/body do not encode game tile or collision semantics.
function map(width = 3, height = 2) {
  const value = new Uint8Array(20 + 6 * width * height);
  value.set([0x4d, 0x41, 0x50, 1]);
  const view = new DataView(value.buffer);
  view.setUint32(4, 0x12345678, true); view.setUint32(8, 0xfedcba98, true);
  view.setUint32(12, width, true); view.setUint32(16, height, true);
  for (let i = 20; i < value.length; i += 1) value[i] = (i * 13) % 256;
  return value;
}
const expect = (fn, code) => assert.throws(fn, e => e instanceof Map01Error && e.code === code);

test('MAP01 reads observed dimensions and keeps all other data opaque', () => {
  const bytes = map(); const result = parseMAP01(bytes);
  assert.deepEqual([result.version, result.width, result.height, result.cellCount, result.byteLength], [1, 3, 2, 6, 56]);
  assert.deepEqual(result.opaque.headerBytes4to11, new Uint8Array([0x78,0x56,0x34,0x12,0x98,0xba,0xdc,0xfe]));
  assert.deepEqual(result.opaque.bodyBytes, bytes.slice(20));
  assert.equal(Object.hasOwn(result, 'planes'), false);
  assert.equal(Object.hasOwn(result, 'collision'), false);
});

test('MAP01 supports ArrayBuffer and unaligned nonzero-offset Uint8Array views', () => {
  const bytes = map(2, 5); const wrapper = new Uint8Array(bytes.length + 19);
  wrapper.set(bytes, 7);
  assert.deepEqual(parseMAP01(wrapper.subarray(7, 7 + bytes.length)), parseMAP01(bytes.buffer));
});

test('MAP01 outputs owned copies even when Uint8Array subclasses override slice', () => {
  class SharedSlice extends Uint8Array { slice(start, end) { return this.subarray(start, end); } }
  const bytes = new SharedSlice(map()); const result = parseMAP01(bytes); bytes.fill(0);
  assert.equal(result.opaque.headerBytes4to11.constructor, Uint8Array);
  assert.equal(result.opaque.bodyBytes.constructor, Uint8Array);
  assert.equal(result.opaque.bodyBytes[0], 4);
  result.opaque.bodyBytes[0] = 88;
  assert.equal(bytes[20], 0);
});

test('MAP01 metadata containers are frozen but caller-owned raw bytes remain editable', () => {
  const result = parseMAP01(map());
  assert.equal(Object.isFrozen(result), true); assert.equal(Object.isFrozen(result.opaque), true);
  assert.throws(() => { result.width = 8; }, TypeError);
  result.opaque.bodyBytes.fill(5); assert.equal(result.opaque.bodyBytes[0], 5);
});

test('MAP01 rejects every truncated prefix and any trailing bytes', () => {
  const value = map();
  for (let length = 0; length < value.length; length += 1) expect(() => parseMAP01(value.subarray(0, length)), length < 20 ? 'MAP_TRUNCATED' : 'MAP_LENGTH');
  const extra = new Uint8Array(value.length + 1); extra.set(value); expect(() => parseMAP01(extra), 'MAP_LENGTH');
});

test('MAP01 magic and unsupported version are distinguished', () => {
  const value = map(); value[0] = 0; expect(() => parseMAP01(value), 'MAP_MAGIC');
  value[0] = 0x4d;
  for (const version of [0,2,255]) { value[3] = version; expect(() => parseMAP01(value), 'UNSUPPORTED_MAP_VERSION'); }
});

test('MAP01 rejects zero dimensions', () => {
  for (const [width,height] of [[0,1],[1,0],[0,0]]) expect(() => parseMAP01(map(width,height)), 'ZERO_DIMENSION');
});

test('MAP01 rejects overflow-shaped UInt32 products before allocation or multiplication', () => {
  for (const [width,height] of [[0xffffffff,0xffffffff],[0xffffffff,2],[65536,65536],[1,0xffffffff],[MAP01_LIMITS.cells+1,1]]) {
    const bytes = map(1,1).subarray(0,20); const view = new DataView(bytes.buffer);
    view.setUint32(12,width,true); view.setUint32(16,height,true);
    expect(() => parseMAP01(bytes), 'MAP_CELL_BUDGET');
  }
});

test('MAP01 dimension budget is inclusive and cannot be raised by extra arguments', () => {
  const value = map(1,1).subarray(0,20); const view = new DataView(value.buffer);
  view.setUint32(12,MAP01_LIMITS.cells,true); view.setUint32(16,1,true);
  expect(() => parseMAP01(value), 'MAP_LENGTH');
  view.setUint32(12,MAP01_LIMITS.cells+1,true);
  expect(() => parseMAP01(value, { cells: Number.MAX_SAFE_INTEGER }), 'MAP_CELL_BUDGET');
  assert.equal(Object.isFrozen(MAP01_LIMITS), true);
});

test('MAP01 bounds bytes before reading the header', () => {
  expect(() => parseMAP01(new Uint8Array(MAP01_LIMITS.bytes+1)), 'MAP_BUDGET');
});

test('MAP01 ignores bytes outside the supplied view and rejects partial body views', () => {
  const value = map(); const wrapper = new Uint8Array(value.length+30); wrapper.fill(255); wrapper.set(value,15);
  assert.equal(parseMAP01(wrapper.subarray(15,15+value.length)).width,3);
  expect(() => parseMAP01(wrapper.subarray(15,15+value.length-1)), 'MAP_LENGTH');
});

test('MAP01 rejects unsupported input types instead of coercing strings or DataView', () => {
  for (const value of [undefined,null,'MAP01',[],{},new DataView(new ArrayBuffer(20))]) expect(() => parseMAP01(value), 'INVALID_INPUT');
});

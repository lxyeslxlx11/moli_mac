import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LAUNCHER_MESSAGE_LIMITS, LauncherMessageError, encodeLauncherRequest10, decodeLauncherRequest10,
  encodeLauncherRequest10Frame, decodeLauncherRequest10Frame,
} from '../index.mjs';
const fields = () => ({ wordA: 0x01020304, fieldA: Uint8Array.of(0x41, 0x42), fieldB: Uint8Array.of(0, 0xff), wordB: 0xaabbccdd });
const fromHex = text => Uint8Array.from(text.match(/../g) ?? [], byte => Number.parseInt(byte, 16));
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
const expect = (fn, code) => assert.throws(fn, e => e instanceof LauncherMessageError && e.code === code);

test('request10 matches an independent explicit BE-word, byte-count golden vector', () => {
  assert.equal(hex(encodeLauncherRequest10(fields())), '0a010203040241420200ffaabbccdd');
  assert.equal(hex(encodeLauncherRequest10Frame(fields())), '000f0a010203040241420200ffaabbccdd');
  const decoded = decodeLauncherRequest10Frame(fromHex('000f0a010203040241420200ffaabbccdd'));
  assert.equal(decoded.type, 10); assert.equal(decoded.wordA, 0x01020304); assert.equal(decoded.wordB, 0xaabbccdd);
  assert.deepEqual(decoded.fieldA, Uint8Array.of(0x41, 0x42)); assert.deepEqual(decoded.fieldB, Uint8Array.of(0, 0xff));
});

test('zero-length fields and unsigned boundary words are retained without credential assumptions', () => {
  const input = { wordA: 0, wordB: 0xffffffff, fieldA: new ArrayBuffer(0), fieldB: new Uint8Array() };
  assert.equal(hex(encodeLauncherRequest10(input)), '0a000000000000ffffffff');
  const result = decodeLauncherRequest10(encodeLauncherRequest10(input));
  assert.equal(result.fieldA.length, 0); assert.equal(result.fieldB.length, 0);
  assert.equal(Object.hasOwn(result, 'authenticated'), false);
});

test('18-byte individual and 45-byte combined budgets apply before output allocation', () => {
  const input = { ...fields(), fieldA: new Uint8Array(18), fieldB: new Uint8Array(16) };
  assert.equal(encodeLauncherRequest10(input).length, LAUNCHER_MESSAGE_LIMITS.bodyBytes);
  assert.equal(encodeLauncherRequest10Frame(input).length, LAUNCHER_MESSAGE_LIMITS.frameBytes);
  expect(() => encodeLauncherRequest10({ ...input, fieldB: new Uint8Array(17) }), 'MESSAGE_BUDGET');
  expect(() => encodeLauncherRequest10({ ...input, fieldA: new Uint8Array(19) }), 'MESSAGE_FIELD_BUDGET');
  expect(() => decodeLauncherRequest10(new Uint8Array(46)), 'MESSAGE_BUDGET');
  expect(() => decodeLauncherRequest10Frame(new Uint8Array(48)), 'FRAME_BUDGET');
});

test('all truncated body and frame prefixes fail without partial decoded results', () => {
  const body = encodeLauncherRequest10(fields()), frame = encodeLauncherRequest10Frame(fields());
  for (let end = 0; end < body.length; end += 1) assert.throws(() => decodeLauncherRequest10(body.subarray(0, end)), LauncherMessageError);
  for (let end = 0; end < frame.length; end += 1) assert.throws(() => decodeLauncherRequest10Frame(frame.subarray(0, end)), LauncherMessageError);
});

test('unknown tags, overlong fields, missing final words and trailing bytes have distinct errors', () => {
  const body = encodeLauncherRequest10(fields());
  const tag = body.slice(); tag[0] = 11; expect(() => decodeLauncherRequest10(tag), 'MESSAGE_TAG');
  const length = body.slice(); length[5] = 19; expect(() => decodeLauncherRequest10(length), 'MESSAGE_FIELD_BUDGET');
  const cut = body.slice(); cut[8] = 8; expect(() => decodeLauncherRequest10(cut), 'MESSAGE_TRUNCATED');
  const trailing = new Uint8Array(body.length + 1); trailing.set(body); expect(() => decodeLauncherRequest10(trailing), 'MESSAGE_LENGTH');
});

test('frame prefix must match the exact body length and cannot swallow concatenated frames', () => {
  const frame = encodeLauncherRequest10Frame(fields());
  for (const size of [0, 14, 16, 0xffff]) {
    const changed = frame.slice(); new DataView(changed.buffer).setUint16(0, size, false);
    expect(() => decodeLauncherRequest10Frame(changed), 'FRAME_LENGTH');
  }
  const double = new Uint8Array(frame.length * 2); double.set(frame); double.set(frame, frame.length);
  expect(() => decodeLauncherRequest10Frame(double), 'FRAME_LENGTH');
});

test('ArrayBuffer and nonzero-offset views use only the supplied bytes', () => {
  const raw = encodeLauncherRequest10Frame(fields());
  const wrap = new Uint8Array(raw.length + 9); wrap.fill(99); wrap.set(raw, 3);
  assert.deepEqual(decodeLauncherRequest10Frame(wrap.subarray(3, 3 + raw.length)), decodeLauncherRequest10Frame(raw.buffer));
  const input = fields();
  const data = Uint8Array.of(99, 0x41, 0x42, 99); input.fieldA = data.subarray(1, 3);
  assert.equal(hex(encodeLauncherRequest10(input)), '0a010203040241420200ffaabbccdd');
});

test('decoded arrays are owned plain copies even for view-returning byte subclasses', () => {
  class ViewBytes extends Uint8Array { slice(start, end) { return this.subarray(start, end); } }
  const raw = new ViewBytes(encodeLauncherRequest10Frame(fields()));
  const result = decodeLauncherRequest10Frame(raw); raw.fill(0);
  assert.equal(result.fieldA.constructor, Uint8Array);
  assert.deepEqual(result.fieldA, Uint8Array.of(0x41, 0x42)); assert.equal(Object.isFrozen(result), true);
  result.fieldB.fill(7); assert.equal(result.fieldA[0], 0x41);
});

test('strings, numeric coercions, fractions and invalid input shapes are rejected', () => {
  for (const value of [-1, 0x100000000, 1.2, '1', null, undefined, NaN, Infinity]) {
    expect(() => encodeLauncherRequest10({ ...fields(), wordA: value }), 'INVALID_WORD');
    expect(() => encodeLauncherRequest10({ ...fields(), wordB: value }), 'INVALID_WORD');
  }
  for (const value of [null, 'abc', [1, 2], new DataView(new ArrayBuffer(2)), {}]) {
    expect(() => encodeLauncherRequest10({ ...fields(), fieldA: value }), 'INVALID_INPUT');
    expect(() => decodeLauncherRequest10(value), 'INVALID_INPUT');
    expect(() => decodeLauncherRequest10Frame(value), 'INVALID_INPUT');
  }
});

test('errors expose codes without copying opaque field content into diagnostics', () => {
  const sample = 'ORIGINAL-SYNTHETIC-DO-NOT-ECHO';
  try { encodeLauncherRequest10({ ...fields(), fieldA: new TextEncoder().encode(sample) }); assert.fail(); }
  catch (error) { assert.equal(error.code, 'MESSAGE_FIELD_BUDGET'); assert.equal(JSON.stringify(error).includes(sample), false); assert.equal(error.message.includes(sample), false); }
});

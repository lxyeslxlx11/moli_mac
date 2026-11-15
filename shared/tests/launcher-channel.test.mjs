import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  LAUNCHER_CHANNEL_LIMITS as LIMITS, LauncherMessageError,
  encodeLauncherHandshakeHello, decodeLauncherHandshakeChallenge, answerLauncherHandshake,
  createLauncherRecordCodec, createLauncherRecordStream, createLauncherReplyStream,
} from '../index.mjs';

const fixture = JSON.parse(readFileSync(new URL('../../analysis/launcher-v7/original-channel-vectors.json', import.meta.url), 'utf8'));
const hex = input => Buffer.from(input).toString('hex');
const fromHex = input => new Uint8Array(Buffer.from(input, 'hex'));
const key = fromHex('0001020304050607');
const join = (...parts) => Uint8Array.from(parts.flatMap(part => [...part]));
function error(code, fn) { assert.throws(fn, value => value instanceof LauncherMessageError && (!code || value.code === code)); }
function challenge(g, p, peer) {
  const output = [0, 0, 0, 0];
  for (const text of [g, p, peer]) {
    const bytes = new TextEncoder().encode(text), length = new Uint8Array(4);
    new DataView(length.buffer).setUint32(0, bytes.length, false); output.push(...length, ...bytes);
  }
  return Uint8Array.from(output);
}
function alteredHeader(cipherLength, plainLength, suffix = new Uint8Array()) {
  const header = new Uint8Array(8), view = new DataView(header.buffer);
  view.setUint32(0, cipherLength, false); view.setUint32(4, plainLength, false); return join(header, suffix);
}

test('handshake hello is the observed major version1 and key size8', () => {
  assert.equal(hex(encodeLauncherHandshakeHello()), '0000000100000008');
  const first = encodeLauncherHandshakeHello(); first.fill(255);
  assert.equal(hex(encodeLauncherHandshakeHello()), '0000000100000008');
  assert.ok(Object.isFrozen(LIMITS));
});

test('three Python pow/struct vectors match native hex public messages and leading derived key bytes', () => {
  for (const vector of fixture.key_exchange) {
    const input = fromHex(vector.challenge_hex), exponent = fromHex(vector.fixture_exponent_hex);
    const originalInput = hex(input), originalExponent = hex(exponent);
    const decoded = decodeLauncherHandshakeChallenge(input);
    assert.ok(Object.isFrozen(decoded));
    assert.deepEqual(Object.keys(decoded).sort(), ['generatorHex', 'modulusHex', 'peerPublicHex']);
    const result = answerLauncherHandshake(input, exponent);
    assert.equal(hex(result.publicMessage), vector.public_message_hex, vector.name);
    assert.equal(hex(result.keyBytes), vector.derived_fixture_key_hex, vector.name);
    assert.equal(hex(input), originalInput); assert.equal(hex(exponent), originalExponent);
    assert.deepEqual(Object.keys(result).sort(), ['keyBytes', 'publicMessage']);
  }
  const odd = fixture.key_exchange.find(vector => vector.name.includes('odd-digits'));
  assert.equal(new TextDecoder().decode(fromHex(odd.public_message_hex).subarray(4)), '02B3FB');
});

test('all challenge prefixes, extra bytes and oversized length words reject', () => {
  for (const vector of fixture.key_exchange) {
    const value = fromHex(vector.challenge_hex);
    for (let i = 0; i < value.length; i += 1) error(null, () => decodeLauncherHandshakeChallenge(value.subarray(0, i)));
    error('HANDSHAKE_LENGTH', () => decodeLauncherHandshakeChallenge(join(value, Uint8Array.of(0))));
    const tooLong = value.slice(); new DataView(tooLong.buffer).setUint32(4, 0xffffffff, false);
    error('HANDSHAKE_HEX_BUDGET', () => decodeLauncherHandshakeChallenge(tooLong));
  }
  error('HANDSHAKE_BUDGET', () => decodeLauncherHandshakeChallenge(new Uint8Array(LIMITS.challengeBytes + 1)));
  const rejected = fromHex(fixture.key_exchange[0].challenge_hex); rejected[3] = 1;
  error('HANDSHAKE_REJECTED', () => decodeLauncherHandshakeChallenge(rejected));
});

test('hex fields reject prefixes, signs, whitespace, NUL and non-ASCII rather than accepting a partial number', () => {
  for (const value of ['', '0x03', '-03', '+03', '03 ', ' 03', '0\0', 'G', '三']) {
    error(null, () => decodeLauncherHandshakeChallenge(challenge(value, '7FFFFFFF', '1234')));
  }
  error('HANDSHAKE_HEX_BUDGET', () => decodeLauncherHandshakeChallenge(challenge('1'.repeat(63), '77', '22')));
  error('HANDSHAKE_HEX_BUDGET', () => decodeLauncherHandshakeChallenge(challenge('2', 'F'.repeat(1023), '22')));
  error('HANDSHAKE_HEX_BUDGET', () => decodeLauncherHandshakeChallenge(challenge('2', '77', 'A'.repeat(1023))));
  const maximum = challenge('2'.repeat(62), 'F'.repeat(1022), '3'.repeat(1022));
  assert.equal(maximum.length, LIMITS.challengeBytes);
  assert.equal(decodeLauncherHandshakeChallenge(maximum).modulusHex.length, 1022);
});

test('unsupported group/entropy/short-key cases fail with no fabricated native fill rule', () => {
  const input = fromHex(fixture.key_exchange[0].challenge_hex), exponent = fromHex(fixture.key_exchange[0].fixture_exponent_hex);
  for (const length of [0, 1, 19, 21, 128]) error('HANDSHAKE_EXPONENT', () => answerLauncherHandshake(input, new Uint8Array(length)));
  for (const last of [0, 1]) { const small = new Uint8Array(20); small[19] = last; error('HANDSHAKE_EXPONENT', () => answerLauncherHandshake(input, small)); }
  for (const fields of [['0', 'FF', '2'], ['1', 'FF', '2'], ['FE', 'FF', '2'], ['2', '100', '2'], ['2', '3', '2'], ['2', 'FF', '1'], ['2', 'FF', 'FE']]) {
    error('HANDSHAKE_GROUP', () => answerLauncherHandshake(challenge(...fields), exponent));
  }
  error('HANDSHAKE_SHORT_KEY', () => answerLauncherHandshake(challenge('2', '25', '3'), exponent));
  error('INVALID_INPUT', () => answerLauncherHandshake(input, 'secret'));
});

test('nine PyCryptodome record vectors agree in both directions, including aligned and trailing-zero plaintext', () => {
  for (const vector of fixture.records) {
    const codec = createLauncherRecordCodec(fromHex(vector.key_hex));
    try {
      assert.equal(hex(codec.encode(fromHex(vector.plaintext_hex))), vector.record_hex, vector.name);
      assert.equal(hex(codec.decode(fromHex(vector.record_hex))), vector.plaintext_hex, vector.name);
      assert.equal(hex(codec.encode(fromHex(vector.plaintext_hex))), vector.record_hex, 'schedule remains stable across records');
    } finally { codec.close(); }
  }
});

test('maximum outgoing record matches the independent whole-record SHA256', () => {
  const vector = fixture.maximum_record, codec = createLauncherRecordCodec(fromHex(vector.key_hex));
  try {
    const plain = Uint8Array.from({ length: vector.plaintext_length }, (_, i) => i * vector.pattern_multiplier % 256);
    const record = codec.encode(plain);
    assert.equal(record.length, vector.record_bytes);
    assert.equal(createHash('sha256').update(record).digest('hex'), vector.record_sha256);
    assert.deepEqual(codec.decode(record), plain);
    error('RECORD_BUDGET', () => codec.encode(new Uint8Array(LIMITS.outgoingPlaintextBytes + 1)));
    for (let i = 0; i < record.length; i += 1) error(null, () => codec.decode(record.subarray(0, i)));
  } finally { codec.close(); }
});

test('records use an extra zero block when aligned and preserve complete zero-valued plaintext', () => {
  const codec = createLauncherRecordCodec(key);
  try {
    for (const length of [0, 8, 16, 24]) {
      const record = codec.encode(new Uint8Array(length));
      assert.equal(new DataView(record.buffer).getUint32(0, false), length + 8);
      assert.deepEqual(codec.decode(record), new Uint8Array(length));
    }
  } finally { codec.close(); }
});

test('receive returns declared plaintext prefix without trimming zeros or assuming padding contents', () => {
  const codec = createLauncherRecordCodec(key);
  try {
    const plain = Uint8Array.from({ length: 16 }, (_, i) => i + 1), record = codec.encode(plain);
    for (const length of [0, 1, 8, 16]) {
      const value = record.slice(); new DataView(value.buffer).setUint32(4, length, false);
      assert.deepEqual(codec.decode(value), plain.subarray(0, length));
    }
    // The observed receiver accepts plainLength == cipherLength; this is not PKCS unpadding.
    const value = record.slice(); new DataView(value.buffer).setUint32(4, 24, false);
    assert.deepEqual(codec.decode(value), join(plain, new Uint8Array(8)));
  } finally { codec.close(); }
});

test('record lengths are bounded before allocation and one-record APIs reject trailing data', () => {
  const codec = createLauncherRecordCodec(key);
  try {
    for (const length of [0, 1, 7, 9, 0x8000, 0x7fffffff, 0xffffffff]) error('RECORD_LENGTH', () => codec.decode(alteredHeader(length, 0)));
    error('RECORD_PLAINTEXT_LENGTH', () => codec.decode(alteredHeader(8, 9)));
    const good = codec.encode(Uint8Array.of(7));
    error('RECORD_LENGTH', () => codec.decode(join(good, Uint8Array.of(0))));
    assert.equal(codec.decode(alteredHeader(LIMITS.ciphertextBytes, 0, new Uint8Array(LIMITS.ciphertextBytes))).length, 0);
    error('INVALID_INPUT', () => codec.decode('not bytes'));
  } finally { codec.close(); }
});

test('byte offsets, ArrayBuffers and subclass inputs produce owned ordinary arrays', () => {
  class AdversarialBytes extends Uint8Array { static get [Symbol.species]() { throw new Error('species must not be consulted'); } }
  const backing = new AdversarialBytes(30); backing.set(key, 7);
  const codec = createLauncherRecordCodec(new AdversarialBytes(backing.buffer, 7, 8)); backing.fill(255);
  try {
    const vector = fixture.records[0]; assert.equal(hex(codec.encode(new ArrayBuffer(0))), vector.record_hex);
    const record = fromHex(fixture.records[6].record_hex), buffer = new AdversarialBytes(record.length + 14); buffer.set(record, 6);
    const output = codec.decode(new AdversarialBytes(buffer.buffer, 6, record.length));
    assert.equal(output.constructor, Uint8Array); buffer.fill(0); assert.equal(hex(output), fixture.records[6].plaintext_hex);
    const arithmetic = fixture.key_exchange[0], c = fromHex(arithmetic.challenge_hex), b = new AdversarialBytes(c.length + 20); b.set(c, 9);
    assert.equal(hex(answerLauncherHandshake(new AdversarialBytes(b.buffer, 9, c.length), fromHex(arithmetic.fixture_exponent_hex).buffer).publicMessage), arithmetic.public_message_hex);
  } finally { codec.close(); }
});

test('fixed profile rejects wrong key shapes and closed schedules cannot be reused', () => {
  for (const length of [0, 4, 7, 9, 56]) error('RECORD_KEY_LENGTH', () => createLauncherRecordCodec(new Uint8Array(length)));
  for (const value of ['key', null, {}, new DataView(new ArrayBuffer(8)), new Uint32Array(2)]) error('INVALID_INPUT', () => createLauncherRecordCodec(value));
  const codec = createLauncherRecordCodec(key); codec.close(); codec.close(); assert.equal(codec.closed, true);
  error('RECORD_CODEC_CLOSED', () => codec.encode(new Uint8Array())); error('RECORD_CODEC_CLOSED', () => codec.decode(new Uint8Array()));
});

test('record stream accepts every two-part split and bytewise/combined records', () => {
  const vector = fixture.records[8], record = fromHex(vector.record_hex), recordKey = fromHex(vector.key_hex);
  for (let i = 0; i <= record.length; i += 1) {
    const stream = createLauncherRecordStream(recordKey);
    const output = [...stream.push(record.subarray(0, i)), ...stream.push(record.subarray(i))]; stream.finish();
    assert.equal(output.length, 1); assert.equal(hex(output[0]), vector.plaintext_hex); assert.equal(stream.pendingByteLength, 0);
  }
  const stream = createLauncherRecordStream(recordKey), output = [];
  for (const byte of record) output.push(...stream.push(Uint8Array.of(byte)));
  assert.equal(hex(output[0]), vector.plaintext_hex);
  const combined = stream.push(join(record, record)); assert.equal(combined.length, 2); stream.finish();
  assert.equal(stream.closed, true); assert.equal(stream.failed, false);
});

test('pending encrypted bytes are copied and a partial final record fails closed', () => {
  const vector = fixture.records[6], record = fromHex(vector.record_hex), stream = createLauncherRecordStream(key);
  const prefix = record.slice(0, 10); assert.deepEqual(stream.push(prefix), []); prefix.fill(255);
  assert.equal(hex(stream.push(record.subarray(10))[0]), vector.plaintext_hex);
  stream.push(record.subarray(0, 7)); error('RECORD_TRUNCATED', () => stream.finish());
  assert.equal(stream.pendingByteLength, 0); assert.equal(stream.closed, true); assert.equal(stream.failed, true);
  error('RECORD_STREAM_CLOSED', () => stream.push(record)); error('RECORD_STREAM_CLOSED', () => stream.finish());
});

test('malformed batches emit no partial result and all terminal paths clear buffered state', () => {
  const codec = createLauncherRecordCodec(key), good = codec.encode(Uint8Array.of(1)); codec.close();
  const stream = createLauncherRecordStream(key);
  error('RECORD_LENGTH', () => stream.push(join(good, alteredHeader(9, 0))));
  assert.equal(stream.pendingByteLength, 0); assert.equal(stream.failed, true);
  const over = createLauncherRecordStream(key); over.push(good.subarray(0, 3));
  error('RECORD_CHUNK_BUDGET', () => over.push(new Uint8Array(LIMITS.chunkBytes + 1))); assert.equal(over.pendingByteLength, 0);
  const invalid = createLauncherRecordStream(key); error('INVALID_INPUT', () => invalid.push('bytes')); assert.equal(invalid.closed, true);
  const stopped = createLauncherRecordStream(key); stopped.push(good.subarray(0, 3)); stopped.close(); stopped.close();
  assert.equal(stopped.pendingByteLength, 0); assert.equal(stopped.closed, true); assert.equal(stopped.failed, false);
});

test('64KiB valid bursts are accepted independently of the pending-record budget', () => {
  const codec = createLauncherRecordCodec(key), one = codec.encode(new Uint8Array()); codec.close();
  const burst = new Uint8Array(LIMITS.chunkBytes);
  for (let i = 0; i < burst.length; i += one.length) burst.set(one, i);
  const stream = createLauncherRecordStream(key), result = stream.push(burst); stream.finish();
  assert.equal(result.length, LIMITS.chunkBytes / one.length); assert.ok(result.every(value => value.length === 0));
  assert.ok(Object.isFrozen(result));
});

test('encrypted record boundaries and inner plaintext frame boundaries are independent', () => {
  const body = Uint8Array.of(2, 0, 0, 0, 7, 0, 0, 0, 19), frame = join(Uint8Array.of(0, body.length), body);
  const codec = createLauncherRecordCodec(key);
  const wire = join(codec.encode(frame.subarray(0, 1)), codec.encode(frame.subarray(1, 6)), codec.encode(join(frame.subarray(6), frame)));
  codec.close();
  const records = createLauncherRecordStream(key), replies = createLauncherReplyStream(), output = [];
  for (let i = 0; i < wire.length; i += 7) {
    for (const plain of records.push(wire.subarray(i, i + 7))) output.push(...replies.push(plain));
  }
  records.finish(); replies.finish(); assert.deepEqual(output, [{ type: 2, wordA: 7, wordB: 19 }, { type: 2, wordA: 7, wordB: 19 }]);
});

test('errors never echo opaque bytes, exponents or derived keys', () => {
  const label = 'FIXTURE_DO_NOT_ECHO_12345';
  try { decodeLauncherHandshakeChallenge(challenge(label, 'F', '2')); assert.fail('expected rejection'); }
  catch (value) { assert.ok(value instanceof LauncherMessageError); assert.ok(!value.message.includes(label)); }
  const codec = createLauncherRecordCodec(key);
  try { codec.decode(new TextEncoder().encode(label)); assert.fail('expected rejection'); }
  catch (value) { assert.ok(value instanceof LauncherMessageError); assert.ok(!value.message.includes(label)); }
  finally { codec.close(); }
});

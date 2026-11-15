import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LAUNCHER_REPLY_LIMITS, LauncherMessageError, encodeLauncherRequest1, decodeLauncherReply,
  decodeLauncherReplyFrame, createLauncherReplyStream } from '../index.mjs';

// Independent Python struct vectors contain original synthetic data only.
const oracle = JSON.parse(readFileSync(new URL('../../analysis/launcher-v7/original-reply-vectors.json', import.meta.url), 'utf8'));
assert.equal(oracle.schema, 'moli.launcher-v7.original-reply-vectors.v1');
const raw = text => new Uint8Array(Buffer.from(text, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
const vector = name => oracle.vectors.find(value => value.name === name);
const expect = (fn, code) => assert.throws(fn, e => e instanceof LauncherMessageError && e.code === code);
const join = (...values) => { const result = new Uint8Array(values.reduce((sum, value) => sum + value.length, 0)); let at = 0; for (const value of values) { result.set(value, at); at += value.length; } return result; };
const normalized = value => value.type === 2 ? { ...value } : { ...value, byteField: undefined, byteList: undefined,
  byteFieldHex: hex(value.byteField), byteListHex: value.byteList.map(hex), wordLists: value.wordLists.map(words => [...words]) };
const expected = value => value.type === 2 ? value : { ...value, byteField: undefined, byteList: undefined };

test('request1 uses the independently observed tag and two BE words', () => {
  assert.equal(hex(encodeLauncherRequest1({ wordA: 0x01020304, wordB: 11 })), '01010203040000000b');
  assert.equal(hex(encodeLauncherRequest1({ wordA: 0xffffffff, wordB: 0 })), '01ffffffff00000000');
  for (const value of [null, [], 'x']) expect(() => encodeLauncherRequest1(value), 'INVALID_INPUT');
  for (const word of [-1, 0x100000000, NaN, 0.2, '1']) expect(() => encodeLauncherRequest1({ wordA: word, wordB: 0 }), 'INVALID_WORD');
});

test('all seven independent Python body/frame vectors decode exactly', () => {
  for (const source of oracle.vectors) {
    assert.deepEqual(normalized(decodeLauncherReply(raw(source.bodyHex))), expected(source.expected), source.name);
    assert.deepEqual(normalized(decodeLauncherReplyFrame(raw(source.frameHex))), expected(source.expected), source.name);
  }
});

test('reply11 retains five separate word lists and signed view without authentication claims', () => {
  const result = decodeLauncherReply(raw(vector('reply11-normal').bodyHex));
  assert.equal(result.wordLists.length, 5); assert.equal(result.wordLists[2][1], 0x80000000);
  assert.equal(result.wordLists[0][0], 0x01020304);
  assert.equal(Object.hasOwn(result, 'authenticated'), false);
  assert.equal(Object.hasOwn(result, 'session'), false);
  assert.equal(decodeLauncherReply(raw(vector('reply11-error').bodyHex)).signedWordB, -32);
});

test('maximum fixed-layout fields and extended FE zero-high counts are accepted', () => {
  for (const name of ['reply11-maximum', 'reply11-maximum-fe']) {
    const result = decodeLauncherReply(raw(vector(name).bodyHex));
    assert.equal(result.byteField.length, 32); assert.equal(result.byteList.length, 64);
    assert.equal(result.byteList.every(value => value.length === 41), true);
    assert.equal(result.wordLists.every(value => value.length === 64), true);
  }
});

test('every truncated prefix of both reply kinds is rejected without partial values', () => {
  for (const name of ['reply2-boundary', 'reply11-normal', 'reply11-maximum']) {
    const bytes = raw(vector(name).bodyHex);
    for (let end = 0; end < bytes.length; end += 1) assert.throws(() => decodeLauncherReply(bytes.subarray(0, end)), LauncherMessageError);
  }
});

test('FD/FE partial counts, nonzero high words and reserved FF are explicit errors', () => {
  const header = raw(vector('reply11-empty').bodyHex).subarray(0, 9);
  for (const value of [raw('fd'), raw('fd0000'), raw('fe00000000'), raw('fe0000000000')]) {
    expect(() => decodeLauncherReply(join(header, value)), 'REPLY_TRUNCATED');
  }
  expect(() => decodeLauncherReply(join(header, raw('fe0000000100000000'))), 'REPLY_COUNT_WIDTH');
  expect(() => decodeLauncherReply(join(header, raw('ff'))), 'REPLY_COUNT_ENCODING');
  expect(() => decodeLauncherReply(join(header, raw('fdffffffff'))), 'REPLY_FIELD_BUDGET');
});

test('byte, byte-list and word-list limits reject oversize before copies or multiplication', () => {
  const empty = raw(vector('reply11-empty').bodyHex);
  for (const [at, count] of [[9, 33], [10, 65], [11, 65]]) {
    const value = empty.slice(); value[at] = count;
    expect(() => decodeLauncherReply(value), 'REPLY_FIELD_BUDGET');
  }
  const bigEntry = join(empty.subarray(0, 10), Uint8Array.of(1, 42), new Uint8Array(42), empty.subarray(11));
  expect(() => decodeLauncherReply(bigEntry), 'REPLY_FIELD_BUDGET');
});

test('unsupported reply types and unverified trailing extensions are rejected', () => {
  const good = raw(vector('reply2-boundary').bodyHex);
  for (const type of [0, 1, 10, 12, 255]) { const value = good.slice(); value[0] = type; expect(() => decodeLauncherReply(value), 'REPLY_TAG'); }
  for (const name of ['reply2-boundary', 'reply11-empty']) expect(() => decodeLauncherReply(join(raw(vector(name).bodyHex), Uint8Array.of(99))), 'REPLY_LENGTH');
});

test('complete frame validation distinguishes size, truncation and mismatched lengths', () => {
  expect(() => decodeLauncherReply(new Uint8Array(LAUNCHER_REPLY_LIMITS.bodyBytes + 1)), 'REPLY_BUDGET');
  expect(() => decodeLauncherReplyFrame(Uint8Array.of(0)), 'REPLY_FRAME_TRUNCATED');
  expect(() => decodeLauncherReplyFrame(Uint8Array.of(0x20, 1)), 'REPLY_BUDGET');
  const frame = raw(vector('reply2-boundary').frameHex);
  expect(() => decodeLauncherReplyFrame(frame.subarray(0, frame.length - 1)), 'REPLY_FRAME_LENGTH');
  expect(() => decodeLauncherReplyFrame(join(frame, frame)), 'REPLY_FRAME_LENGTH');
});

test('ArrayBuffer, nonzero offsets and subclass inputs cannot alias decoded fields', () => {
  class ViewBytes extends Uint8Array { slice(start, end) { return this.subarray(start, end); } }
  const frame = raw(vector('reply11-normal').frameHex), wrapper = new ViewBytes(frame.length + 7);
  wrapper.set(frame, 3);
  const result = decodeLauncherReplyFrame(wrapper.subarray(3, frame.length + 3));
  assert.deepEqual(normalized(result), normalized(decodeLauncherReplyFrame(frame.buffer)));
  wrapper.fill(0);
  assert.equal(result.byteField.constructor, Uint8Array); assert.equal(result.byteList[0].constructor, Uint8Array);
  assert.equal(result.wordLists[0].constructor, Uint32Array); assert.equal(result.byteField[1], 0xfd);
  assert.equal(Object.isFrozen(result), true); assert.equal(Object.isFrozen(result.byteList), true); assert.equal(Object.isFrozen(result.wordLists), true);
  result.wordLists[0].fill(0); assert.equal(result.wordLists[2][0], 0xffffffff);
});

test('stream accepts every two-part split, including incomplete length headers', () => {
  const frame = raw(vector('reply11-normal').frameHex), result = decodeLauncherReplyFrame(frame);
  for (let at = 0; at <= frame.length; at += 1) {
    const stream = createLauncherReplyStream();
    const values = [...stream.push(frame.subarray(0, at)), ...stream.push(frame.subarray(at))];
    assert.deepEqual(values, [result]); assert.equal(stream.pendingByteLength, 0); stream.finish(); assert.equal(stream.closed, true);
  }
});

test('stream supports bytewise input and concatenated replies in order', () => {
  const first = raw(vector('reply2-boundary').frameHex), second = raw(vector('reply11-normal').frameHex);
  const stream = createLauncherReplyStream(), values = [];
  for (const byte of join(first, second)) values.push(...stream.push(Uint8Array.of(byte)));
  assert.deepEqual(values, [decodeLauncherReplyFrame(first), decodeLauncherReplyFrame(second)]);
  stream.finish();
  const concatenated = createLauncherReplyStream(); assert.deepEqual(concatenated.push(join(first, second)), values); concatenated.finish();
});

test('pending input bytes are copied and empty chunks do not change parser state', () => {
  const frame = raw(vector('reply11-normal').frameHex), first = frame.slice(0, 3), stream = createLauncherReplyStream();
  assert.deepEqual(stream.push(first), []); first.fill(255);
  assert.equal(stream.pendingByteLength, 3); assert.deepEqual(stream.push(new Uint8Array()), []);
  assert.deepEqual(stream.push(frame.subarray(3)), [decodeLauncherReplyFrame(frame)]); stream.finish();
});

test('finish inside a header/body fails closed and releases retained bytes', () => {
  for (const size of [1, 3, 8]) {
    const stream = createLauncherReplyStream(); stream.push(raw(vector('reply2-boundary').frameHex).subarray(0, size));
    expect(() => stream.finish(), 'REPLY_FRAME_TRUNCATED');
    assert.equal(stream.pendingByteLength, 0); assert.equal(stream.failed, true);
    expect(() => stream.push(new Uint8Array()), 'REPLY_STREAM_CLOSED');
  }
});

test('malformed later frame yields no partial batch and permanently closes the stream', () => {
  const good = raw(vector('reply2-boundary').frameHex), bad = good.slice(); bad[2] = 12;
  const stream = createLauncherReplyStream(); expect(() => stream.push(join(good, bad)), 'REPLY_TAG');
  assert.equal(stream.closed, true); assert.equal(stream.failed, true); assert.equal(stream.pendingByteLength, 0);
  expect(() => stream.push(good), 'REPLY_STREAM_CLOSED');
});

test('chunk budget fails before retaining large input; large valid reply bursts remain bounded', () => {
  const tooLarge = createLauncherReplyStream(); expect(() => tooLarge.push(new Uint8Array(LAUNCHER_REPLY_LIMITS.chunkBytes + 1)), 'REPLY_CHUNK_BUDGET');
  assert.equal(tooLarge.pendingByteLength, 0);
  const frame = raw(vector('reply2-boundary').frameHex);
  const count = Math.floor(LAUNCHER_REPLY_LIMITS.chunkBytes / frame.length), chunk = new Uint8Array(count * frame.length);
  for (let i = 0; i < count; i += 1) chunk.set(frame, i * frame.length);
  const stream = createLauncherReplyStream(); assert.equal(stream.push(chunk).length, count); stream.finish();
});

test('zero-length, over-budget declarations and invalid input close the decoder explicitly', () => {
  for (const [input, code] of [[Uint8Array.of(0, 0), 'REPLY_TRUNCATED'], [Uint8Array.of(0x20, 1), 'REPLY_BUDGET'], ['abc', 'INVALID_INPUT']]) {
    const stream = createLauncherReplyStream(); expect(() => stream.push(input), code); assert.equal(stream.failed, true);
  }
  const clean = createLauncherReplyStream(); clean.finish(); assert.equal(clean.failed, false);
  expect(() => clean.push(new Uint8Array()), 'REPLY_STREAM_CLOSED');
  for (const input of [null, [], 'x', new DataView(new ArrayBuffer(9))]) expect(() => decodeLauncherReply(input), 'INVALID_INPUT');
});

test('errors do not echo opaque reply bytes or synthetic secret-like field content', () => {
  const marker = 'ORIGINAL-SYNTHETIC-PRIVATE';
  const value = join(raw(vector('reply11-empty').bodyHex), new TextEncoder().encode(marker));
  try { decodeLauncherReply(value); assert.fail(); }
  catch (error) { assert.equal(error.code, 'REPLY_LENGTH'); assert.equal(error.message.includes(marker), false); assert.equal(JSON.stringify(error).includes(marker), false); }
});

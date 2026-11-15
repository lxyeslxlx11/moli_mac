/** Fixed-sample launcher plaintext replies after connection processing. No socket, decryption or authentication decision. */
import { LauncherMessageError } from './launcher-message10.mjs';
export const LAUNCHER_REPLY_LIMITS = Object.freeze({
  bodyBytes: 8192, chunkBytes: 64 * 1024, byteFieldBytes: 32,
  byteListEntries: 64, byteListEntryBytes: 41, wordListEntries: 64, wordLists: 5,
});
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected explicit plaintext bytes.');
}
function copy(value, start, end) {
  return new Uint8Array(new Uint8Array(value.buffer, value.byteOffset + start, end - start));
}
function word(value) {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('INVALID_WORD', 'Expected an unsigned 32-bit word.');
  return value;
}
class ReplyReader {
  constructor(value) { this.value = value; this.view = new DataView(value.buffer, value.byteOffset, value.byteLength); this.at = 1; }
  need(length) {
    if (length > this.value.byteLength - this.at) fail('REPLY_TRUNCATED', 'Plaintext reply is incomplete.');
  }
  u8() { this.need(1); return this.value[this.at++]; }
  u32() { this.need(4); const value = this.view.getUint32(this.at, false); this.at += 4; return value; }
  count(limit) {
    const marker = this.u8();
    let count;
    if (marker < 0xfd) count = marker;
    else if (marker === 0xfd) count = this.u32();
    else if (marker === 0xfe) {
      const high = this.u32(); count = this.u32();
      if (high !== 0) fail('REPLY_COUNT_WIDTH', 'Supported reply counts require a zero high word.');
    } else fail('REPLY_COUNT_ENCODING', 'Reserved count marker.');
    if (count > limit) fail('REPLY_FIELD_BUDGET', 'Reply field count exceeds the fixed supported layout.');
    return count;
  }
  byteField(limit) {
    const count = this.count(limit); this.need(count);
    const result = copy(this.value, this.at, this.at + count); this.at += count; return result;
  }
  words() {
    const count = this.count(LAUNCHER_REPLY_LIMITS.wordListEntries);
    // Count is bounded before multiplication or allocation.
    this.need(count * 4);
    const result = new Uint32Array(count);
    for (let i = 0; i < count; i += 1) result[i] = this.u32();
    return result;
  }
  end() {
    if (this.at !== this.value.byteLength) fail('REPLY_LENGTH', 'Plaintext reply contains unverified trailing bytes.');
  }
}

/** Request type1 is an observed 9-byte builder. Positional words retain unknown business meaning. */
export function encodeLauncherRequest1(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) fail('INVALID_INPUT', 'Expected explicit request words.');
  const first = word(fields.wordA), second = word(fields.wordB);
  const result = new Uint8Array(9), view = new DataView(result.buffer);
  result[0] = 1; view.setUint32(1, first, false); view.setUint32(5, second, false); return result;
}

/** Decode types2/11 at the registered plaintext callback boundary. All byte fields remain opaque. */
export function decodeLauncherReply(input) {
  const value = bytes(input);
  if (value.byteLength > LAUNCHER_REPLY_LIMITS.bodyBytes) fail('REPLY_BUDGET', 'Reply exceeds the 8 KiB implementation budget.');
  if (value.byteLength < 1) fail('REPLY_TRUNCATED', 'Missing reply type.');
  const type = value[0];
  if (type !== 2 && type !== 11) fail('REPLY_TAG', 'Only observed launcher reply types2/11 are supported.');
  const reader = new ReplyReader(value);
  const first = reader.u32(), second = reader.u32();
  if (type === 2) { reader.end(); return Object.freeze({ type, wordA: first, wordB: second }); }
  const byteField = reader.byteField(LAUNCHER_REPLY_LIMITS.byteFieldBytes);
  const listCount = reader.count(LAUNCHER_REPLY_LIMITS.byteListEntries);
  const byteList = [];
  for (let i = 0; i < listCount; i += 1) byteList.push(reader.byteField(LAUNCHER_REPLY_LIMITS.byteListEntryBytes));
  const wordLists = [];
  for (let i = 0; i < LAUNCHER_REPLY_LIMITS.wordLists; i += 1) wordLists.push(reader.words());
  const tailWordA = reader.u32(), tailWordB = reader.u32(); reader.end();
  return Object.freeze({ type, wordA: first, wordB: second, signedWordB: second > 0x7fffffff ? second - 0x100000000 : second,
    byteField, byteList: Object.freeze(byteList), wordLists: Object.freeze(wordLists), tailWordA, tailWordB });
}

export function decodeLauncherReplyFrame(input) {
  const value = bytes(input);
  if (value.byteLength < 2) fail('REPLY_FRAME_TRUNCATED', 'Missing two-byte plaintext length.');
  const length = new DataView(value.buffer, value.byteOffset, value.byteLength).getUint16(0, false);
  if (length > LAUNCHER_REPLY_LIMITS.bodyBytes) fail('REPLY_BUDGET', 'Declared plaintext body exceeds the implementation budget.');
  if (length !== value.byteLength - 2) fail('REPLY_FRAME_LENGTH', 'Length must match one complete plaintext frame.');
  return decodeLauncherReply(new Uint8Array(value.buffer, value.byteOffset + 2, length));
}

/** Incremental framing on already processed plaintext. A malformed stream is terminal and releases pending bytes. */
export function createLauncherReplyStream() {
  let pending = new Uint8Array(0), closed = false, failed = false;
  function terminal(error) { pending.fill(0); pending = new Uint8Array(0); closed = true; failed = true; throw error; }
  return Object.freeze({
    get pendingByteLength() { return pending.byteLength; },
    get closed() { return closed; },
    get failed() { return failed; },
    push(input) {
      if (closed) fail('REPLY_STREAM_CLOSED', 'Create a new decoder for a new plaintext stream.');
      try {
        const chunk = bytes(input);
        if (chunk.byteLength > LAUNCHER_REPLY_LIMITS.chunkBytes) fail('REPLY_CHUNK_BUDGET', 'Plaintext input chunk exceeds 64 KiB.');
        if (!chunk.byteLength) return Object.freeze([]);
        const combined = new Uint8Array(pending.byteLength + chunk.byteLength);
        combined.set(pending); combined.set(chunk, pending.byteLength);
        const view = new DataView(combined.buffer), replies = [];
        let at = 0;
        while (combined.byteLength - at >= 2) {
          const length = view.getUint16(at, false);
          if (length > LAUNCHER_REPLY_LIMITS.bodyBytes) fail('REPLY_BUDGET', 'Declared plaintext body exceeds the implementation budget.');
          if (combined.byteLength - at - 2 < length) break;
          replies.push(decodeLauncherReply(combined.subarray(at + 2, at + 2 + length)));
          at += 2 + length;
        }
        pending = copy(combined, at, combined.byteLength);
        return Object.freeze(replies);
      } catch (error) { return terminal(error); }
    },
    finish() {
      if (closed) fail('REPLY_STREAM_CLOSED', 'Plaintext stream is already closed.');
      if (pending.byteLength) return terminal(new LauncherMessageError('REPLY_FRAME_TRUNCATED', 'Plaintext stream ended inside a frame.'));
      closed = true;
    },
    close() { pending.fill(0); pending = new Uint8Array(0); closed = true; },
  });
}

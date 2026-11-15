/** Wire envelopes observed in the independently bound legacy SE game.
 * Payloads are opaque. This module does not transform, authenticate or interpret them.
 */
export const LEGACY_GAME_ENVELOPE_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-envelope-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  header: Object.freeze([0xaf, 0xef]), trailer: Object.freeze([0xef, 0xaf]),
  overheadBytes: 6, minimumCandidateBytes: 8, maximumPayloadBytes: 0x7fff,
  queueBytes: 0x40000, scope: 'legacy-wire-envelope-only', payload: 'opaque',
  currentVersionCompatibility: 'unverified', authentication: 'unverified',
});

export class LegacyGameEnvelopeError extends Error {
  constructor(code) {
    super('Legacy game envelope does not match the supported bounded profile.');
    this.name = 'LegacyGameEnvelopeError';
    this.code = code;
  }
}
const fail = code => { throw new LegacyGameEnvelopeError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const offsetOf = Object.getOwnPropertyDescriptor(typed, 'byteOffset').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;

function copyInput(value, maximum, budgetCode) {
  let buffer, length, offset = 0;
  try {
    if (value instanceof ArrayBuffer) {
      buffer = value;
      length = Reflect.apply(bufferLength, value, []);
    } else {
      if (!(value instanceof Uint8Array)) fail('LEGACY_GAME_INPUT');
      buffer = Reflect.apply(bufferOf, value, []);
      Reflect.apply(bufferLength, buffer, []); // Shared backing storage is rejected.
      length = Reflect.apply(lengthOf, value, []);
      offset = Reflect.apply(offsetOf, value, []);
    }
    if (length > maximum) fail(budgetCode);
    return new Uint8Array(new Uint8Array(buffer, offset, length));
  } catch (error) {
    if (error instanceof LegacyGameEnvelopeError) throw error;
    fail('LEGACY_GAME_INPUT');
  }
}

/** Caller supplies already transformed wire payload bytes, never plaintext fields. */
export function encodeLegacyGameEnvelope(value) {
  const payload = copyInput(value, 0x7fff, 'LEGACY_GAME_PAYLOAD_BUDGET');
  try {
    const length = payload.length, result = new Uint8Array(length + 6);
    result[0] = 0xaf; result[1] = 0xef;
    result[2] = length & 255; result[3] = length >>> 8;
    result.set(payload, 4);
    result[length + 4] = 0xef; result[length + 5] = 0xaf;
    return result;
  } finally { payload.fill(0); }
}

/** A bounded pull reader: append copies, next returns one event, finish requires drainage.
 * Complete malformed frames fail closed. Append/input budget failures leave state intact.
 */
export function createLegacyGameEnvelopeReader() {
  const queue = new Uint8Array(0x40000);
  let start = 0, end = 0, state = 'open';
  const pending = () => end - start;
  const wipe = () => { queue.fill(0); start = end = 0; };
  const active = () => { if (state !== 'open') fail('LEGACY_GAME_CLOSED'); };
  const terminate = code => { state = 'failed'; wipe(); fail(code); };
  const need = reason => Object.freeze({ kind: 'need-more', reason, pendingBytes: pending() });
  function consume(count) {
    queue.fill(0, start, start + count); start += count;
    if (start === end) start = end = 0;
  }
  return Object.freeze({
    append(value) {
      active();
      const bytes = copyInput(value, 0x40000, 'LEGACY_GAME_QUEUE_BUDGET');
      try {
        if (pending() + bytes.length > queue.length) fail('LEGACY_GAME_QUEUE_BUDGET');
        if (end + bytes.length > queue.length) {
          const count = pending();
          queue.copyWithin(0, start, end); queue.fill(0, count, end);
          start = 0; end = count;
        }
        queue.set(bytes, end); end += bytes.length;
        return pending();
      } finally { bytes.fill(0); }
    },
    next() {
      active();
      let at = start;
      while (at < end && queue[at] !== 0xaf) at++;
      if (at === end) return need(pending() ? 'marker' : 'empty');
      // Native receiver waits for eight bytes from the first AF, even for 0/1-byte payloads.
      if (end - at < 8) return need('candidate-guard');
      if (queue[at + 1] !== 0xef) {
        const discardedBytes = at - start + 1;
        consume(discardedBytes);
        return Object.freeze({ kind: 'discard', discardedBytes });
      }
      const length = queue[at + 2] | (queue[at + 3] << 8);
      // The source MOVSX makes high-bit lengths unsafe/undefined; no signed pointer emulation.
      if (length > 0x7fff) terminate('LEGACY_GAME_LENGTH_SIGN');
      const wireBytes = length + 6;
      if (end - at < wireBytes) return need('payload');
      if (queue[at + length + 4] !== 0xef || queue[at + length + 5] !== 0xaf) terminate('LEGACY_GAME_TRAILER');
      const payload = queue.slice(at + 4, at + 4 + length), discardedBytes = at - start;
      consume(discardedBytes + wireBytes);
      return Object.freeze({ kind: 'frame', profile: LEGACY_GAME_ENVELOPE_PROFILE.id,
        payload, wirePayloadBytes: length, wireBytes, discardedBytes });
    },
    finish() {
      active();
      if (pending()) terminate('LEGACY_GAME_INCOMPLETE');
      wipe(); state = 'finished';
    },
    close() { wipe(); if (state === 'open') state = 'closed'; },
    inspect() { return Object.freeze({ state, pendingBytes: pending(), queueBytes: queue.length }); },
  });
}

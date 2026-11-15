/** Fixed legacy game payload transforms. No account, text encoding, transport or peer identity. */
import { sha256 } from './vendor/noble-hashes/2.4.0/sha2.js';
import { hmac } from './vendor/noble-hashes/2.4.0/hmac.js';
import { cbc } from './vendor/noble-ciphers/2.4.0/aes.js';

export const LEGACY_GAME_PAYLOAD_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-payload-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  keyBytes: 64, blockBytes: 8, maximumPayloadBytes: 32760, bootstrapBytes: 112,
  derivationRounds: 8192, paddingByte: 0x11, maximumStrippedBytes: 8,
  encodePermutation: Object.freeze([7, 2, 5, 1, 6, 3, 0, 4]),
  decodePermutation: Object.freeze([6, 3, 1, 5, 7, 2, 4, 0]),
  scope: 'legacy-payload-transform-only', officialPeerIdentity: 'unverified',
  currentVersionCompatibility: 'unverified', normalPayloadIntegrity: 'unverified',
});
// Source-bound fixed derivation parameter (not a user or session key).
const derivationParameter = new Uint8Array([
  71, 43, 123, 79, 94, 39, 98, 110, 61, 97, 98, 114, 126, 83, 74, 40,
  70, 126, 76, 100, 51, 111, 115, 65, 110, 57, 74, 36, 39, 114, 100, 66,
  52, 55, 38, 72, 99, 61, 49, 63, 103, 84, 97, 49, 119, 76, 90, 119,
  99, 40, 111, 47, 118, 121, 74, 36, 98, 47, 119, 57, 77, 97, 55, 84,
  115, 74, 126, 104, 68, 110, 76, 116, 120, 117, 81, 48, 70, 106, 107, 98,
  40, 45, 124, 94, 44, 77, 113, 80, 53, 97, 52, 61, 68, 45, 88, 60,
  33, 117, 68, 35, 65, 118, 95, 95, 88, 69, 69, 66, 90, 91, 99, 88,
  81, 43, 99, 99, 90, 79, 73, 99, 42, 83, 44, 112, 61, 65, 82, 106
]);

export class LegacyGamePayloadError extends Error {
  constructor(code) {
    super('Legacy game payload does not match the supported bounded profile.');
    this.name = 'LegacyGamePayloadError'; this.code = code;
  }
}
const fail = code => { throw new LegacyGamePayloadError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const offsetOf = Object.getOwnPropertyDescriptor(typed, 'byteOffset').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function copyInput(value, maximum, budgetCode) {
  let buffer, length, offset = 0;
  try {
    if (value instanceof ArrayBuffer) { buffer = value; length = Reflect.apply(bufferLength, value, []); }
    else {
      if (!(value instanceof Uint8Array)) fail('LEGACY_GAME_PAYLOAD_INPUT');
      buffer = Reflect.apply(bufferOf, value, []); Reflect.apply(bufferLength, buffer, []);
      length = Reflect.apply(lengthOf, value, []); offset = Reflect.apply(offsetOf, value, []);
    }
    if (length > maximum) fail(budgetCode);
    return new Uint8Array(new Uint8Array(buffer, offset, length));
  } catch (error) {
    if (error instanceof LegacyGamePayloadError) throw error;
    fail('LEGACY_GAME_PAYLOAD_INPUT');
  }
}

/** Source-specific, lossy byte transform. In particular, NUL and trailing0x11 do not roundtrip. */
export function createLegacyGamePayloadCodec(value) {
  const key = copyInput(value, 64, 'LEGACY_GAME_PAYLOAD_KEY');
  if (key.length !== 64 || key.includes(0)) { key.fill(0); fail('LEGACY_GAME_PAYLOAD_KEY'); }
  let state = 'open';
  const active = () => { if (state !== 'open') fail('LEGACY_GAME_PAYLOAD_CLOSED'); };
  return Object.freeze({
    encode(value) {
      active(); const input = copyInput(value, 32760, 'LEGACY_GAME_PAYLOAD_BUDGET');
      try {
        const output = new Uint8Array(Math.ceil(input.length / 8) * 8);
        for (let at = 0; at < output.length; at++) {
          const byte = at < input.length ? input[at] : 0x11;
          output[(at & ~7) + LEGACY_GAME_PAYLOAD_PROFILE.encodePermutation[at & 7]] =
            byte === 0 ? 0 : byte ^ key[at & 63];
        }
        return output;
      } finally { input.fill(0); }
    },
    decode(value) {
      active(); const input = copyInput(value, 32760, 'LEGACY_GAME_PAYLOAD_BUDGET');
      let output;
      try {
        if (input.length === 0 || input.length % 8) fail('LEGACY_GAME_PAYLOAD_LENGTH');
        output = new Uint8Array(input.length);
        for (let at = 0; at < input.length; at++) {
          const position = (at & ~7) + LEGACY_GAME_PAYLOAD_PROFILE.decodePermutation[at & 7];
          output[position] = input[at] ^ key[position & 63];
        }
        let removed = 0;
        while (removed < 8 && output[output.length - removed - 1] === 0x11) removed++;
        return output.slice(0, output.length - removed);
      } finally { input.fill(0); output?.fill(0); }
    },
    close() { key.fill(0); state = 'closed'; },
    inspect() { return Object.freeze({ state, profile: LEGACY_GAME_PAYLOAD_PROFILE.id,
      officialPeerIdentity: 'unverified', currentVersionCompatibility: 'unverified' }); },
  });
}

/** Only the native112-byte/64-byte-result bootstrap branch. No connection/authentication claim. */
export function createLegacyGamePayloadCodecFromBootstrap(value) {
  const input = copyInput(value, 112, 'LEGACY_GAME_BOOTSTRAP_FORMAT');
  let material, work, tag, decoded;
  try {
    if (input.length !== 112 || (input[15] & 15) !== 0) fail('LEGACY_GAME_BOOTSTRAP_FORMAT');
    material = new Uint8Array(32); material.set(input.subarray(0, 16));
    work = new Uint8Array(160); work.set(derivationParameter, 32);
    for (let round = 0; round < 8192; round++) {
      work.set(material, 0); const next = sha256(work); material.fill(0); material = next;
    }
    const body = input.subarray(16, 80);
    tag = hmac(sha256, material, body);
    let difference = 0;
    for (let at = 0; at < 32; at++) difference |= tag[at] ^ input[80 + at];
    if (difference) fail('LEGACY_GAME_BOOTSTRAP_TAG');
    // Native candidate writes precede its tag check. This API releases no candidate on failure.
    decoded = cbc(material, input.subarray(0, 16), { disablePadding: true }).decrypt(body);
    return createLegacyGamePayloadCodec(decoded);
  } catch (error) {
    if (error instanceof LegacyGamePayloadError) throw error;
    fail('LEGACY_GAME_BOOTSTRAP_FORMAT');
  } finally { input.fill(0); material?.fill(0); work?.fill(0); tag?.fill(0); decoded?.fill(0); }
}

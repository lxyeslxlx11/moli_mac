/** Fixed-sample, uncompressed launcher key-exchange/record byte operations. No sockets or authentication decision. */
import { Blowfish } from './vendor/egoroof-blowfish/4.0.3/blowfish.mjs';
import { LauncherMessageError } from './launcher-message10.mjs';

/** Public group pinned by the updated6d459d launcher; this is not a peer identity check. */
export const LAUNCHER_CURRENT_CHANNEL_PROFILE = Object.freeze({
  sourceSha256: '6d459ddbdf80a86cf7a1e41b99ab7fb575b42842d7163522efb3c9fa6e6ac987',
  generatorHex: '2',
  modulusHex: 'f488fd584e49dbcd20b49de49107366b336c380d451d0f7c88b31c7c5b2d8ef6f3c923c043f0a55b188d8ebb558cb85d38d334fd7c175743a31d186cde33212cb52aff3ce1b1294018118d7c84a70a72d686c40319c807297aca950cd9969fabd00a509b0246d3083d66a45d419f9c7cbd894b221926baaba25ec355e92f78c7',
  generatorHexBytes: 256, numberHexBytes: 256, challengeBytes: 784,
});

export const LAUNCHER_CHANNEL_LIMITS = Object.freeze({
  keyBytes: 8, exponentBytes: 20, generatorHexBytes: 62, numberHexBytes: 1022,
  challengeBytes: 2122, outgoingPlaintextBytes: 0x7fc8, ciphertextBytes: 0x7ff8,
  chunkBytes: 64 * 1024,
});
/** Updated6d459d record contract; generic byte producers remain available separately. */
export const LAUNCHER_CURRENT_RECORD_PROFILE = Object.freeze({
  sourceSha256: LAUNCHER_CURRENT_CHANNEL_PROFILE.sourceSha256,
  keyBytes: 8, blockBytes: 8, outgoingPlaintextBytes: 0x7fc8, ciphertextBytes: 0x7ff8,
  minimumCiphertextBytes: 0, chunkBytes: 64 * 1024, padding: 'ceil(n/8)*8+8',
});
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected explicit channel bytes.');
}
function owned(input) {
  return new Uint8Array(new Uint8Array(input.buffer, input.byteOffset, input.byteLength));
}
function readHex(value, start, length, limit) {
  if (length < 1 || length > limit) fail('HANDSHAKE_HEX_BUDGET', 'Hexadecimal field length is outside the supported profile.');
  if (length > value.byteLength - start) fail('HANDSHAKE_TRUNCATED', 'Key-exchange field is incomplete.');
  let result = '';
  for (let i = start; i < start + length; i += 1) {
    const c = value[i];
    if (!((c >= 48 && c <= 57) || (c >= 65 && c <= 70) || (c >= 97 && c <= 102))) {
      fail('HANDSHAKE_HEX', 'Only unsigned ASCII hexadecimal fields are supported.');
    }
    result += String.fromCharCode(c);
  }
  return result;
}
function nativeHex(value) {
  const hex = value.toString(16).toUpperCase();
  return value === 0n || hex.length % 2 === 0 ? hex : `0${hex}`;
}
function powMod(base, exponent, modulus) {
  let result = 1n;
  for (base %= modulus; exponent > 0n; exponent >>= 1n) {
    if (exponent & 1n) result = result * base % modulus;
    base = base * base % modulus;
  }
  return result;
}

/** Observed handshake start: BE32 major version1, BE32 key length8. */
export function encodeLauncherHandshakeHello() {
  return Uint8Array.of(0, 0, 0, 1, 0, 0, 0, 8);
}

/** One exact server challenge, before encrypted record processing. Strict hex is independent input policy. */
export function decodeLauncherHandshakeChallenge(input) {
  return decodeHandshakeChallenge(input, LAUNCHER_CHANNEL_LIMITS);
}
function decodeHandshakeChallenge(input, limits) {
  const value = bytes(input);
  if (value.byteLength > limits.challengeBytes) fail('HANDSHAKE_BUDGET', 'Key-exchange record exceeds the supported profile.');
  if (value.byteLength < 16) fail('HANDSHAKE_TRUNCATED', 'Key-exchange header is incomplete.');
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  if (view.getUint32(0, false) !== 0) fail('HANDSHAKE_REJECTED', 'Peer rejected the key exchange.');
  let at = 4;
  function field(limit) {
    if (value.byteLength - at < 4) fail('HANDSHAKE_TRUNCATED', 'Missing key-exchange field length.');
    const length = view.getUint32(at, false); at += 4;
    const result = readHex(value, at, length, limit); at += length; return result;
  }
  const generatorHex = field(limits.generatorHexBytes);
  const modulusHex = field(limits.numberHexBytes);
  const peerPublicHex = field(limits.numberHexBytes);
  if (at !== value.byteLength) fail('HANDSHAKE_LENGTH', 'Expected one exact key-exchange record.');
  return Object.freeze({ generatorHex, modulusHex, peerPublicHex });
}

/** Current native group check includes literal spelling and the interval1<peer<p. */
export function decodeLauncherCurrentHandshakeChallenge(input) {
  const challenge = decodeHandshakeChallenge(input, LAUNCHER_CURRENT_CHANNEL_PROFILE);
  if (challenge.generatorHex !== LAUNCHER_CURRENT_CHANNEL_PROFILE.generatorHex ||
      challenge.modulusHex !== LAUNCHER_CURRENT_CHANNEL_PROFILE.modulusHex) {
    fail('HANDSHAKE_GROUP', 'Challenge does not use the source-bound public group.');
  }
  const peer = BigInt(`0x${challenge.peerPublicHex}`), modulus = BigInt(`0x${challenge.modulusHex}`);
  if (peer <= 1n || peer >= modulus) fail('HANDSHAKE_GROUP', 'Peer value is outside the source-bound group interval.');
  return challenge;
}

/** Offline arithmetic only. Caller supplies20 fresh CSPRNG bytes in a future platform adapter; never use fixture entropy for accounts. */
export function answerLauncherHandshake(challengeInput, exponentInput) {
  return deriveHandshakeAnswer(decodeLauncherHandshakeChallenge(challengeInput), exponentInput, false);
}

/** Same byte/arithmetic producer with the current native group and p-1 boundary. */
export function answerLauncherCurrentHandshake(challengeInput, exponentInput) {
  return deriveHandshakeAnswer(decodeLauncherCurrentHandshakeChallenge(challengeInput), exponentInput, true);
}
function deriveHandshakeAnswer(challenge, exponentInput, allowModulusMinusOne) {
  const exponent = bytes(exponentInput);
  if (exponent.byteLength !== LAUNCHER_CHANNEL_LIMITS.exponentBytes) fail('HANDSHAKE_EXPONENT', 'Expected20 explicit exponent bytes.');
  let secret = 0n;
  for (const byte of exponent) secret = (secret << 8n) | BigInt(byte);
  if (secret < 2n) fail('HANDSHAKE_EXPONENT', 'Exponent must be nontrivial.');
  const generator = BigInt(`0x${challenge.generatorHex}`), modulus = BigInt(`0x${challenge.modulusHex}`);
  const peer = BigInt(`0x${challenge.peerPublicHex}`);
  // Independent admissibility checks; these do not prove prime order or peer identity.
  const peerLimit = allowModulusMinusOne ? modulus : modulus - 1n;
  if (modulus < 5n || !(modulus & 1n) || generator < 2n || generator >= modulus - 1n || peer < 2n || peer >= peerLimit) {
    fail('HANDSHAKE_GROUP', 'Group values are outside the supported arithmetic profile.');
  }
  const publicHex = nativeHex(powMod(generator, secret, modulus));
  const sharedHex = nativeHex(powMod(peer, secret, modulus));
  if (sharedHex.length < LAUNCHER_CHANNEL_LIMITS.keyBytes * 2) {
    fail('HANDSHAKE_SHORT_KEY', 'Short derived material has no supported native fill rule.');
  }
  const keyBytes = new Uint8Array(LAUNCHER_CHANNEL_LIMITS.keyBytes);
  for (let i = 0; i < keyBytes.length; i += 1) keyBytes[i] = Number.parseInt(sharedHex.slice(i * 2, i * 2 + 2), 16);
  const publicMessage = new Uint8Array(4 + publicHex.length);
  new DataView(publicMessage.buffer).setUint32(0, publicHex.length, false);
  for (let i = 0; i < publicHex.length; i += 1) publicMessage[i + 4] = publicHex.charCodeAt(i);
  return Object.freeze({ publicMessage, keyBytes });
}

function recordHeader(value, current) {
  if (value.byteLength < 8) fail('RECORD_TRUNCATED', 'Encrypted record header is incomplete.');
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  const cipherLength = view.getUint32(0, false), plainLength = view.getUint32(4, false);
  if (cipherLength < (current ? 0 : 8) || cipherLength > LAUNCHER_CHANNEL_LIMITS.ciphertextBytes || cipherLength % 8 !== 0) {
    fail('RECORD_LENGTH', 'Ciphertext length is outside the supported block profile.');
  }
  if (plainLength > cipherLength) fail('RECORD_PLAINTEXT_LENGTH', 'Plaintext length exceeds the ciphertext span.');
  return { cipherLength, plainLength };
}

/** ECB schedules are reused as in the observed branch. LE word I/O is intentional; no IV, padding removal or compression. */
export function createLauncherRecordCodec(keyInput) {
  return createRecordCodec(keyInput, false);
}
export function createLauncherCurrentRecordCodec(keyInput) {
  return createRecordCodec(keyInput, true);
}
function createRecordCodec(keyInput, current) {
  const key = bytes(keyInput);
  if (key.byteLength !== LAUNCHER_CHANNEL_LIMITS.keyBytes) fail('RECORD_KEY_LENGTH', 'This launcher profile requires an8-byte key.');
  const copy = owned(key);
  let cipher = new Blowfish(copy, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
  copy.fill(0);
  function live() { if (!cipher) fail('RECORD_CODEC_CLOSED', 'Record codec is closed.'); }
  function transform(value, decrypt) {
    const output = new Uint8Array(value.byteLength), inputView = new DataView(value.buffer, value.byteOffset, value.byteLength);
    const outputView = new DataView(output.buffer);
    // These raw methods belong to the exact vendored4.0.3 artifact and are covered by independent vectors.
    for (let at = 0; at < value.byteLength; at += 8) {
      const first = inputView.getUint32(at, true), second = inputView.getUint32(at + 4, true);
      const pair = decrypt ? cipher._decryptBlock(first, second) : cipher._encryptBlock(first, second);
      outputView.setUint32(at, pair[0], true); outputView.setUint32(at + 4, pair[1], true);
    }
    return output;
  }
  return Object.freeze({
    get closed() { return cipher === null; },
    encode(input) {
      live(); const value = bytes(input);
      if (value.byteLength > LAUNCHER_CHANNEL_LIMITS.outgoingPlaintextBytes) fail('RECORD_BUDGET', 'Split outgoing plaintext into bounded records.');
      const blocks = current ? Math.ceil(value.byteLength / 8) : Math.floor(value.byteLength / 8);
      const padded = new Uint8Array(blocks * 8 + 8); padded.set(value);
      const encrypted = transform(padded, false), output = new Uint8Array(8 + encrypted.byteLength);
      const view = new DataView(output.buffer);
      view.setUint32(0, encrypted.byteLength, false); view.setUint32(4, value.byteLength, false);
      output.set(encrypted, 8); padded.fill(0); return output;
    },
    decode(input) {
      live(); const value = bytes(input), { cipherLength, plainLength } = recordHeader(value, current);
      if (value.byteLength !== cipherLength + 8) fail('RECORD_LENGTH', 'Expected one exact encrypted record.');
      const decrypted = transform(new Uint8Array(value.buffer, value.byteOffset + 8, cipherLength), true);
      const result = new Uint8Array(plainLength); result.set(decrypted.subarray(0, plainLength)); decrypted.fill(0); return result;
    },
    close() {
      if (cipher) { cipher.p.fill(0); for (const row of cipher.s) row.fill(0); cipher.iv = null; cipher = null; }
    },
  });
}

/** Encrypted TCP-style chunks only: emits complete plaintext chunks, which can contain partial or multiple inner frames. */
export function createLauncherRecordStream(keyInput) {
  return createRecordStream(keyInput, false);
}
export function createLauncherCurrentRecordStream(keyInput) {
  return createRecordStream(keyInput, true);
}
function createRecordStream(keyInput, current) {
  const codec = createRecordCodec(keyInput, current);
  let pending = new Uint8Array(0), closed = false, failed = false;
  function terminate(error) { pending.fill(0); pending = new Uint8Array(0); codec.close(); closed = true; failed = !!error; if (error) throw error; }
  return Object.freeze({
    get pendingByteLength() { return pending.byteLength; },
    get closed() { return closed; },
    get failed() { return failed; },
    push(input) {
      if (closed) fail('RECORD_STREAM_CLOSED', 'Create a new decoder for a new encrypted stream.');
      try {
        const chunk = bytes(input);
        if (chunk.byteLength > LAUNCHER_CHANNEL_LIMITS.chunkBytes) fail('RECORD_CHUNK_BUDGET', 'Encrypted input chunk exceeds64KiB.');
        if (!chunk.byteLength) return Object.freeze([]);
        const combined = new Uint8Array(pending.byteLength + chunk.byteLength);
        combined.set(pending); combined.set(chunk, pending.byteLength); pending.fill(0);
        const view = new DataView(combined.buffer), chunks = []; let at = 0;
        while (combined.byteLength - at >= 8) {
          const header = recordHeader(combined.subarray(at, at + 8), current);
          if (combined.byteLength - at < header.cipherLength + 8) break;
          const end = at + header.cipherLength + 8;
          chunks.push(codec.decode(combined.subarray(at, end))); at = end;
        }
        pending = owned(combined.subarray(at)); return Object.freeze(chunks);
      } catch (error) { return terminate(error); }
    },
    finish() {
      if (closed) fail('RECORD_STREAM_CLOSED', 'Encrypted stream is already closed.');
      if (pending.byteLength) return terminate(new LauncherMessageError('RECORD_TRUNCATED', 'Encrypted stream ended inside a record.'));
      terminate();
    },
    close() { if (!closed) terminate(); },
  });
}

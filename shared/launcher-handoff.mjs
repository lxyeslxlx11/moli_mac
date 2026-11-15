/** Proven launcher mapping-write producer only. No OS mapping, argv, account access or game acceptance. */
export const LAUNCHER_HANDOFF_LIMITS = Object.freeze({ mappingCapacity: 256, nameBytes: 41, opaqueBytes: 32, gameCodeMax: 14 });
const messages = Object.freeze({
  HANDOFF_INPUT: 'Expected explicit handoff data properties.', HANDOFF_BYTES: 'Expected bounded owned byte fields.',
  HANDOFF_GAME: 'The game code is outside the supported request slots.', HANDOFF_PROFILE: 'The selected profile is restricted or unsupported.',
  HANDOFF_STATE: 'No unconsumed mapping write is available.',
});
export class LauncherHandoffError extends Error {
  constructor(code) {
    const selected = typeof code === 'string' && Object.hasOwn(messages, code) ? code : 'HANDOFF_INPUT';
    super(messages[selected]); this.name = 'LauncherHandoffError'; this.code = selected;
  }
}
const fail = code => { throw new LauncherHandoffError(code); };
function own(value, key) {
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('HANDOFF_INPUT');
    const property = Object.getOwnPropertyDescriptor(value, key);
    if (!property || !Object.hasOwn(property, 'value')) fail('HANDOFF_INPUT');
    return property.value;
  } catch { fail('HANDOFF_INPUT'); }
}
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function bytes(value, maximum, empty = false) {
  try {
    if (value instanceof ArrayBuffer) {
      Reflect.apply(bufferLength, value, []); value = new Uint8Array(value);
    }
    if (!(value instanceof Uint8Array)) fail('HANDOFF_BYTES');
    const length = Reflect.apply(typedLength, value, []);
    // Reject shared backing memory; the write is a private snapshot, not a concurrent view.
    Reflect.apply(bufferLength, Reflect.apply(typedBuffer, value, []), []);
    if (length < (empty ? 0 : 1) || length > maximum) fail('HANDOFF_BYTES');
    return new Uint8Array(value);
  } catch { fail('HANDOFF_BYTES'); }
}
function word(value) {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('HANDOFF_INPUT');
  return value;
}
function mappingName(gameCode) {
  if (!Number.isInteger(gameCode) || gameCode < 0 || gameCode > LAUNCHER_HANDOFF_LIMITS.gameCodeMax) fail('HANDOFF_GAME');
  if (gameCode <= 2 || gameCode === 4 || gameCode === 11) return 'CGSharedMem';
  return ({ 3: 'KOHSharedMem', 5: 'ZZSharedMem', 6: 'FESharedMem', 7: 'CGCSharedMem', 9: 'CG2SharedMem' })[gameCode] ?? null;
}
function radix32(value) {
  const alphabet = '0123456789abcdefghijklmnopqrstuv'; let text = '';
  do { text = alphabet[value % 32] + text; value = Math.floor(value / 32); } while (value);
  return text;
}
const ascii = value => Uint8Array.from(value, character => character.charCodeAt(0));
const fillBytes = Uint8Array.prototype.fill;
function eraseLentBytes(value) {
  try { Reflect.apply(fillBytes, value, [0]); }
  catch { /* A transferred/detached buffer is no longer owned here; continue the remaining cleanup. */ }
}

/** Accept a selected reply snapshot; keep native raw C-string and uint32 conversion behavior. */
export function encodeLauncherHandoffWrite(input) {
  const gameCode = own(input, 'gameCode'), selected = own(input, 'selection'), profile = own(selected, 'profile');
  const name = mappingName(gameCode);
  const stateWord = word(own(profile, 'stateWord')), state = stateWord << 16 >> 16;
  const billing = word(own(profile, 'billingWord')), expired = word(own(profile, 'expiredWord'));
  if (![0, -4].includes(state) || (billing !== 0 && expired !== 0)) fail('HANDOFF_PROFILE');
  const adjustedWord = (word(own(selected, 'tailWordA')) - 0x80000000) >>> 0;
  let gid, opaque, output;
  try {
    gid = bytes(own(profile, 'nameBytes'), LAUNCHER_HANDOFF_LIMITS.nameBytes);
    opaque = bytes(own(selected, 'opaqueByteField'), LAUNCHER_HANDOFF_LIMITS.opaqueBytes, true);
    if (gid.includes(0)) fail('HANDOFF_PROFILE');
    if (name === null) return Object.freeze({ gameCode, mappingName: null, capacity: LAUNCHER_HANDOFF_LIMITS.mappingCapacity,
      bytes: new Uint8Array(0), authentication: 'unverified', gameAcceptance: 'unverified' });
    const firstNul = opaque.indexOf(0), prefix = firstNul < 0 ? opaque.length : firstNul;
    const parts = [ascii('gid:'), gid, ascii(' glt:'), opaque.subarray(0, prefix), ascii(':' + radix32(adjustedWord) + ' ')];
    const length = parts.reduce((sum, part) => sum + part.length, 1);
    if (length > LAUNCHER_HANDOFF_LIMITS.mappingCapacity) fail('HANDOFF_BYTES');
    output = new Uint8Array(length); let at = 0;
    for (const part of parts) { output.set(part, at); at += part.length; }
    // Output includes the final NUL only. A pre-existing mapping's remaining bytes are untouched.
    return Object.freeze({ gameCode, mappingName: name, capacity: LAUNCHER_HANDOFF_LIMITS.mappingCapacity,
      bytes: output, authentication: 'unverified', gameAcceptance: 'unverified' });
  } catch (error) { output?.fill(0); throw error; }
  finally { gid?.fill(0); opaque?.fill(0); }
}

/** One exposure of a lease-owned write view; close wipes that view. Consumer copies remain its responsibility. */
export function createLauncherHandoffLease(input) {
  const write = encodeLauncherHandoffWrite(input);
  let state = write.mappingName === null ? 'not-required' : 'ready';
  const snapshot = () => Object.freeze({ state, gameCode: write.gameCode, mappingName: write.mappingName, capacity: write.capacity,
    writeBytes: state === 'closed' ? 0 : write.bytes.length, authentication: 'unverified', gameAcceptance: 'unverified' });
  return Object.freeze({
    snapshot,
    takeWrite() {
      if (state !== 'ready') fail('HANDOFF_STATE');
      state = 'taken'; return write;
    },
    close() { state = 'closed'; eraseLentBytes(write.bytes); return snapshot(); },
  });
}

/** Fixed-sample launcher request body10 and its pre-queue length wrapper. No text/credential transform or transport. */
export const LAUNCHER_MESSAGE_LIMITS = Object.freeze({ fieldBytes: 18, bodyBytes: 45, frameBytes: 47 });
export class LauncherMessageError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherMessageError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected explicit bytes, without implicit text encoding.');
}
function word(value) {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('INVALID_WORD', 'Expected an unsigned 32-bit word.');
  return value;
}
function copy(input, start, end) {
  return new Uint8Array(new Uint8Array(input.buffer, input.byteOffset + start, end - start));
}

/** wordA/wordB and fieldA/fieldB retain positional names because full business transformations are unverified. */
export function encodeLauncherRequest10(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) fail('INVALID_INPUT', 'Expected explicit message fields.');
  const a = word(fields.wordA), b = word(fields.wordB);
  const first = bytes(fields.fieldA), second = bytes(fields.fieldB);
  if (first.byteLength > LAUNCHER_MESSAGE_LIMITS.fieldBytes || second.byteLength > LAUNCHER_MESSAGE_LIMITS.fieldBytes) {
    fail('MESSAGE_FIELD_BUDGET', 'Each byte field is limited to 18 bytes.');
  }
  const size = 11 + first.byteLength + second.byteLength;
  if (size > LAUNCHER_MESSAGE_LIMITS.bodyBytes) fail('MESSAGE_BUDGET', 'The two fields exceed the combined 45-byte body budget.');
  const output = new Uint8Array(size);
  const view = new DataView(output.buffer);
  output[0] = 10; view.setUint32(1, a, false);
  output[5] = first.byteLength; output.set(first, 6);
  const secondLengthAt = 6 + first.byteLength;
  output[secondLengthAt] = second.byteLength; output.set(second, secondLengthAt + 1);
  view.setUint32(secondLengthAt + 1 + second.byteLength, b, false);
  return output;
}

/** This independent decoder validates the supported body; it does not validate an account, password or session. */
export function decodeLauncherRequest10(input) {
  const value = bytes(input);
  if (value.byteLength > LAUNCHER_MESSAGE_LIMITS.bodyBytes) fail('MESSAGE_BUDGET', 'Request body exceeds 45 bytes.');
  if (value.byteLength < 11) fail('MESSAGE_TRUNCATED', 'Request body is shorter than its minimum layout.');
  if (value[0] !== 10) fail('MESSAGE_TAG', 'Only the observed request type10 is supported.');
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  let at = 5;
  function field() {
    if (at >= value.byteLength) fail('MESSAGE_TRUNCATED', 'Missing field length.');
    const length = value[at++];
    if (length > LAUNCHER_MESSAGE_LIMITS.fieldBytes) fail('MESSAGE_FIELD_BUDGET', 'Byte field exceeds 18 bytes.');
    if (length > value.byteLength - at) fail('MESSAGE_TRUNCATED', 'Byte field is truncated.');
    const result = copy(value, at, at + length); at += length; return result;
  }
  const first = field(), second = field();
  if (value.byteLength - at < 4) fail('MESSAGE_TRUNCATED', 'Missing final word.');
  if (value.byteLength - at !== 4) fail('MESSAGE_LENGTH', 'Request has trailing bytes.');
  return Object.freeze({ type: 10, wordA: view.getUint32(1, false), fieldA: first, fieldB: second, wordB: view.getUint32(at, false) });
}

/** Two-byte BE length plus body at the observed pre-queue boundary, not a complete on-wire/session codec. */
export function encodeLauncherRequest10Frame(fields) {
  const body = encodeLauncherRequest10(fields);
  const output = new Uint8Array(body.byteLength + 2);
  new DataView(output.buffer).setUint16(0, body.byteLength, false);
  output.set(body, 2); return output;
}
export function decodeLauncherRequest10Frame(input) {
  const value = bytes(input);
  if (value.byteLength > LAUNCHER_MESSAGE_LIMITS.frameBytes) fail('FRAME_BUDGET', 'Request frame exceeds the supported fixed-sample budget.');
  if (value.byteLength < 2) fail('FRAME_TRUNCATED', 'Missing two-byte length.');
  const length = new DataView(value.buffer, value.byteOffset, value.byteLength).getUint16(0, false);
  if (length !== value.byteLength - 2) fail('FRAME_LENGTH', 'Declared length disagrees with the supplied complete frame.');
  return decodeLauncherRequest10(new Uint8Array(value.buffer, value.byteOffset + 2, length));
}

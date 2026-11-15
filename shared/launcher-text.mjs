/** Explicit strict text profiles. No ACP/locale inference, normalization, best-fit, storage or platform APIs. */
import { WINDOWS_936_DOUBLE } from './vendor/windows-936/table.mjs';
export const LAUNCHER_TEXT_ENCODINGS = Object.freeze(['ascii', 'windows-936', 'utf-8']);
export const LAUNCHER_TEXT_LIMITS = Object.freeze({ credentialBytes: 16, profileNameBytes: 41, inputCodeUnits: 64,
  processFieldBytes: 4096, processFieldCodeUnits: 4096 });
const messages = Object.freeze({ TEXT_ENCODING: 'Choose an explicit supported encoding.', TEXT_INPUT: 'Expected bounded scalar text.',
  TEXT_CONTROL: 'Control characters are outside the supported text profile.', TEXT_UNREPRESENTABLE: 'The selected encoding cannot represent this text.',
  TEXT_LENGTH: 'Encoded input must contain1..16 bytes.', TEXT_BYTES: 'The encoded name is invalid or outside its byte budget.',
  TEXT_ROUNDTRIP: 'The encoded name does not round-trip without changing bytes.',
  TEXT_FIELD_LENGTH: 'Encoded process field exceeds4096 bytes.' });
export class LauncherTextError extends Error {
  constructor(code, byteLength = null) {
    const selected = typeof code === 'string' && Object.hasOwn(messages, code) ? code : 'TEXT_INPUT';
    super(messages[selected]); this.name = 'LauncherTextError'; this.code = selected;
    this.byteLength = Number.isInteger(byteLength) && byteLength >= 0 && byteLength <= 256 ? byteLength : null;
  }
}
const fail = (code, byteLength) => { throw new LauncherTextError(code, byteLength); };
function profile(options) {
  let field;
  try { field = Object.getOwnPropertyDescriptor(options, 'encoding'); } catch { fail('TEXT_ENCODING'); }
  if (!field || !Object.hasOwn(field, 'value') || !LAUNCHER_TEXT_ENCODINGS.includes(field.value)) fail('TEXT_ENCODING');
  return field.value;
}
function scalar(value, field = false) {
  if (value >= 0xd800 && value <= 0xdfff) fail('TEXT_INPUT');
  if (field && [9, 10, 13].includes(value)) return;
  if (value < 0x20 || value >= 0x7f && value <= 0x9f) fail('TEXT_CONTROL');
}
let reverse936;
function encoder936() {
  if (reverse936) return reverse936;
  const result = new Map();
  for (let index = 0; index < WINDOWS_936_DOUBLE.length; index++) {
    const codepoint = WINDOWS_936_DOUBLE.charCodeAt(index);
    if (!codepoint) continue;
    const lead = 0x81 + Math.floor(index / 190), column = index % 190;
    const trail = 0x40 + column + (column >= 63 ? 1 : 0);
    result.set(codepoint, lead << 8 | trail);
  }
  reverse936 = result; return result;
}
function encode(value, encoding, field = false) {
  if (typeof value !== 'string' || value.length > (field ? LAUNCHER_TEXT_LIMITS.processFieldCodeUnits : LAUNCHER_TEXT_LIMITS.inputCodeUnits)) fail('TEXT_INPUT');
  const result = [];
  try {
    for (const character of value) {
      const point = character.codePointAt(0); scalar(point, field);
      if (point < 0x80) result.push(point);
      else if (encoding === 'ascii') fail('TEXT_UNREPRESENTABLE');
      else if (encoding === 'windows-936') {
        if (point === 0x20ac) result.push(0x80);
        else {
          const word = encoder936().get(point);
          if (word === undefined) fail('TEXT_UNREPRESENTABLE');
          result.push(word >>> 8, word & 0xff);
        }
      } else if (point <= 0x7ff) result.push(0xc0 | point >>> 6, 0x80 | point & 63);
      else if (point <= 0xffff) result.push(0xe0 | point >>> 12, 0x80 | point >>> 6 & 63, 0x80 | point & 63);
      else result.push(0xf0 | point >>> 18, 0x80 | point >>> 12 & 63, 0x80 | point >>> 6 & 63, 0x80 | point & 63);
    }
    return Uint8Array.from(result);
  } finally { result.fill(0); }
}
/** Returns owned bytes for the native UI-sized fields. Errors contain codes/counts, never the input. */
export function encodeLauncherCredential(value, options) {
  const encoding = profile(options), result = encode(value, encoding);
  if (result.length < 1 || result.length > LAUNCHER_TEXT_LIMITS.credentialBytes) {
    const length = result.length; result.fill(0); fail('TEXT_LENGTH', length);
  }
  return result;
}
/** Explicit encoding for resolved process text; empty/HT/LF/CR retained, no implicit quote or normalization. */
export function encodeLauncherProcessField(value, options) {
  const result = encode(value, profile(options), true);
  if (result.length > LAUNCHER_TEXT_LIMITS.processFieldBytes) { result.fill(0); fail('TEXT_FIELD_LENGTH'); }
  return result;
}
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function ownedTextBytes(value,minimum,maximum) {
  try {
    if (value instanceof ArrayBuffer) {
      const length = Reflect.apply(bufferLength, value, []);
      if (length < minimum || length > maximum) fail('TEXT_BYTES');
      return new Uint8Array(new Uint8Array(value));
    }
    if (!(value instanceof Uint8Array)) fail('TEXT_BYTES');
    const length = Reflect.apply(typedLength, value, []);
    if (length < minimum || length > maximum) fail('TEXT_BYTES');
    return new Uint8Array(value);
  } catch { fail('TEXT_BYTES'); }
}
function decode(value, encoding, field = false) {
  let output = '';
  for (let at = 0; at < value.length;) {
    const first = value[at++]; let point;
    if (first < 0x80) point = first;
    else if (encoding === 'ascii') fail('TEXT_BYTES');
    else if (encoding === 'windows-936') {
      if (first === 0x80) point = 0x20ac;
      else {
        if (first < 0x81 || first > 0xfe || at === value.length) fail('TEXT_BYTES');
        const trail = value[at++];
        if (trail < 0x40 || trail > 0xfe || trail === 0x7f) fail('TEXT_BYTES');
        const column = trail - 0x40 - (trail > 0x7f ? 1 : 0);
        point = WINDOWS_936_DOUBLE.charCodeAt((first - 0x81) * 190 + column);
        if (!point) fail('TEXT_BYTES');
      }
    } else {
      let remaining, minimum;
      if (first >= 0xc2 && first <= 0xdf) { remaining = 1; minimum = 0x80; point = first & 31; }
      else if (first >= 0xe0 && first <= 0xef) { remaining = 2; minimum = 0x800; point = first & 15; }
      else if (first >= 0xf0 && first <= 0xf4) { remaining = 3; minimum = 0x10000; point = first & 7; }
      else fail('TEXT_BYTES');
      if (remaining > value.length - at) fail('TEXT_BYTES');
      while (remaining--) {
        const next = value[at++]; if (next < 0x80 || next > 0xbf) fail('TEXT_BYTES'); point = point << 6 | next & 63;
      }
      if (point < minimum || point > 0x10ffff || point >= 0xd800 && point <= 0xdfff) fail('TEXT_BYTES');
    }
    scalar(point, field); output += String.fromCodePoint(point);
  }
  return output;
}
/** Strictly decode a bounded raw name and require byte-for-byte re-encoding. Raw byte sorting remains separate. */
export function decodeLauncherProfileName(value, options) {
  const encoding = profile(options), owned = ownedTextBytes(value, 1, LAUNCHER_TEXT_LIMITS.profileNameBytes); let encoded;
  try {
    const text = decode(owned, encoding); encoded = encode(text, encoding);
    if (encoded.length !== owned.length || encoded.some((byte, index) => byte !== owned[index])) fail('TEXT_ROUNDTRIP');
    return text;
  } finally { owned.fill(0); encoded?.fill(0); }
}
function decodeLegacyGameDisplayText(value, options, maximum) {
  const encoding = profile(options), owned = ownedTextBytes(value, 0, maximum);
  try { return decode(owned, encoding, true); }
  finally { owned.fill(0); }
}
/** Decode one bounded battle chat record using the session's selected text profile. */
export function decodeLegacyGameChatText(value, options) {
  return decodeLegacyGameDisplayText(value, options, 255);
}
/** Decode a bounded item or shop display field after its inner escape pass. */
export function decodeLegacyGameDescriptionText(value, options) {
  return decodeLegacyGameDisplayText(value, options, 0x2ff);
}

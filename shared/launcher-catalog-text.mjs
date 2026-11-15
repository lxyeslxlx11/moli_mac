/** Strict whole-file catalog decoding. No DOM, platform codec, locale inference or replacement recovery. */
import { GB18030_DOUBLE, GB18030_RANGES } from './vendor/whatwg-gb18030/table.mjs';

export const LAUNCHER_CATALOG_TEXT_LIMITS = Object.freeze({ bytes: 1024 * 1024 });
export class LauncherCatalogTextError extends Error {
  constructor(code) { super(code === 'CATALOG_TEXT_BUDGET' ? 'Catalog text exceeds its byte budget.'
    : code === 'CATALOG_TEXT_ENCODING' ? 'Choose an explicit catalog encoding.' : 'Invalid catalog byte sequence.');
    this.name = 'LauncherCatalogTextError'; this.code = code; }
}
const fail = code => { throw new LauncherCatalogTextError(code); };
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function ownBytes(value) {
  let length;
  try {
    if (value instanceof ArrayBuffer) { length = Reflect.apply(bufferLength, value, []); value = new Uint8Array(value); }
    else { if (!(value instanceof Uint8Array)) fail('CATALOG_TEXT_INPUT'); length = Reflect.apply(typedLength, value, []); }
  } catch { fail('CATALOG_TEXT_INPUT'); }
  if (length > LAUNCHER_CATALOG_TEXT_LIMITS.bytes) fail('CATALOG_TEXT_BUDGET');
  const result = new Uint8Array(length); Uint8Array.prototype.set.call(result, value); return result;
}
function rangePoint(pointer) {
  if (pointer > 39419 && pointer < 189000 || pointer > 1237575) fail('CATALOG_TEXT_INPUT');
  if (pointer === 7457) return 0xe7c7;
  let lo = 0, hi = GB18030_RANGES.length / 2;
  while (lo + 1 < hi) { const mid = (lo + hi) >>> 1; if (GB18030_RANGES[mid * 2] <= pointer) lo = mid; else hi = mid; }
  return GB18030_RANGES[lo * 2 + 1] + pointer - GB18030_RANGES[lo * 2];
}
/** Whole-file, fatal UTF-8 (one leading BOM consumed) or pinned WHATWG GB18030 (no BOM stripping). */
export function decodeLauncherCatalogText(value, { encoding } = {}) {
  if (!['utf-8', 'gb18030'].includes(encoding)) fail('CATALOG_TEXT_ENCODING');
  const bytes = ownBytes(value), units = [], chunks = []; let first = true;
  function emit(point) {
    if (first && encoding === 'utf-8' && point === 0xfeff) { first = false; return; }
    first = false;
    if (point <= 0xffff) units.push(point); else { point -= 0x10000; units.push(0xd800 + (point >>> 10), 0xdc00 + (point & 1023)); }
    if (units.length >= 4096) { chunks.push(String.fromCharCode(...units)); units.length = 0; }
  }
  for (let i = 0; i < bytes.length;) {
    const lead = bytes[i++];
    if (lead < 0x80) { emit(lead); continue; }
    if (encoding === 'utf-8') {
      let count, point, minimum;
      if (lead >= 0xc2 && lead <= 0xdf) { count = 1; point = lead & 31; minimum = 0x80; }
      else if (lead >= 0xe0 && lead <= 0xef) { count = 2; point = lead & 15; minimum = 0x800; }
      else if (lead >= 0xf0 && lead <= 0xf4) { count = 3; point = lead & 7; minimum = 0x10000; }
      else fail('CATALOG_TEXT_INPUT');
      if (count > bytes.length - i) fail('CATALOG_TEXT_INPUT');
      for (let j = 0; j < count; j++) { const next = bytes[i++]; if (next < 0x80 || next > 0xbf) fail('CATALOG_TEXT_INPUT'); point = point * 64 + (next & 63); }
      if (point < minimum || point > 0x10ffff || point >= 0xd800 && point <= 0xdfff) fail('CATALOG_TEXT_INPUT');
      emit(point); continue;
    }
    if (lead === 0x80) { emit(0x20ac); continue; }
    if (lead < 0x81 || lead > 0xfe || i === bytes.length) fail('CATALOG_TEXT_INPUT');
    const second = bytes[i++];
    if (second >= 0x30 && second <= 0x39) {
      if (bytes.length - i < 2) fail('CATALOG_TEXT_INPUT');
      const third = bytes[i++], fourth = bytes[i++];
      if (third < 0x81 || third > 0xfe || fourth < 0x30 || fourth > 0x39) fail('CATALOG_TEXT_INPUT');
      emit(rangePoint((lead - 0x81) * 12600 + (second - 0x30) * 1260 + (third - 0x81) * 10 + fourth - 0x30));
    } else {
      if (!(second >= 0x40 && second <= 0x7e || second >= 0x80 && second <= 0xfe)) fail('CATALOG_TEXT_INPUT');
      emit(GB18030_DOUBLE.charCodeAt((lead - 0x81) * 190 + second - (second < 0x7f ? 0x40 : 0x41)));
    }
  }
  if (units.length) chunks.push(String.fromCharCode(...units)); return chunks.join('');
}

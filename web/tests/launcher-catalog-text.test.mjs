import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeLauncherCatalogText as decode, LAUNCHER_CATALOG_TEXT_LIMITS } from '../../shared/launcher-catalog-text.mjs';

const text = (bytes, encoding = 'utf-8') => decode(Uint8Array.from(bytes), { encoding });
const pointerBytes = pointer => [0x81 + Math.floor(pointer / 12600), 0x30 + Math.floor(pointer / 1260) % 10,
  0x81 + Math.floor(pointer / 10) % 126, 0x30 + pointer % 10];

test('portable catalog UTF-8 is fatal, preserves scalar/control text and consumes just one initial BOM', () => {
  assert.equal(text([0xef,0xbb,0xbf,0xef,0xbb,0xbf,0x61,0,0x0a]), '\ufeffa\0\n');
  assert.equal(text([0xf0,0x9f,0x99,0x82]), '🙂');
  for (const input of [[0x80],[0xc0,0x80],[0xc1,0xbf],[0xc2],[0xe0,0x9f,0xbf],[0xed,0xa0,0x80],
    [0xf0,0x8f,0xbf,0xbf],[0xf4,0x90,0x80,0x80],[0xf5,0x80,0x80,0x80],[0xe1,0x80,0x61],[0xff]]) {
    assert.throws(() => text(input), error => error.code === 'CATALOG_TEXT_INPUT');
  }
});

test('portable UTF-8 agrees with the independent native codec for every Unicode scalar', () => {
  let source = '', checked = 0;
  function verify() { const bytes = new TextEncoder().encode(source); assert.equal(decode(bytes, { encoding: 'utf-8' }), new TextDecoder('utf-8', { fatal: true }).decode(bytes)); source = ''; }
  for (let point = 0; point <= 0x10ffff; point++) {
    if (point >= 0xd800 && point <= 0xdfff) continue;
    source += String.fromCodePoint(point); checked++;
    if (source.length >= 65536) verify();
  }
  if (source.length) verify(); assert.equal(checked, 1112064);
});

test('all23940 GB18030 two-byte entries agree with native ICU; compatibility mappings stay explicit', () => {
  const bytes = new Uint8Array(23940 * 2); let index = 0;
  for (let lead = 0x81; lead <= 0xfe; lead++) for (let trail = 0x40; trail <= 0xfe; trail++) {
    if (trail === 0x7f) continue; bytes[index++] = lead; bytes[index++] = trail;
  }
  assert.equal(decode(bytes, { encoding: 'gb18030' }), new TextDecoder('gb18030', { fatal: true }).decode(bytes));
  assert.equal(text([0x80], 'gb18030'), '€'); assert.equal(text([0xa3,0xa0], 'gb18030'), '\u3000');
  assert.equal(text([0xa8,0xbc], 'gb18030'), '\u1e3f');
});

test('all1087996 valid GB18030 four-byte pointers agree with native ICU, including exceptions and supplementary limits', () => {
  let batch = [], checked = 0;
  function verify() {
    const bytes = Uint8Array.from(batch); assert.equal(decode(bytes, { encoding: 'gb18030' }), new TextDecoder('gb18030', { fatal: true }).decode(bytes)); batch = [];
  }
  for (const [start,end] of [[0,39419],[189000,1237575]]) for (let pointer = start; pointer <= end; pointer++) {
    batch.push(...pointerBytes(pointer)); checked++; if (batch.length >= 262144) verify();
  }
  if (batch.length) verify(); assert.equal(checked, 1087996);
  assert.equal(text(pointerBytes(7457), 'gb18030'), '\ue7c7');
  assert.equal(text(pointerBytes(189000), 'gb18030'), '\u{10000}');
  assert.equal(text(pointerBytes(1237575), 'gb18030'), '\u{10ffff}');
  for (const input of [[0x81],[0x81,0x7f],[0x81,0x30],[0x81,0x30,0x81],[0x81,0x30,0x80,0x30],
    [0x81,0x30,0x81,0x3a],[0xff],pointerBytes(39420),pointerBytes(188999),pointerBytes(1237576),pointerBytes(1587599)]) {
    assert.throws(() => text(input, 'gb18030'), error => error.code === 'CATALOG_TEXT_INPUT');
  }
  assert.equal(text([0x84,0x31,0x95,0x33], 'gb18030'), '\ufeff');
});

test('catalog text has a1MiB bound and intrinsic byte ownership, independent of subclass metadata/iterators', () => {
  class Bytes extends Uint8Array { get length() { throw new Error(); } *[Symbol.iterator]() { throw new Error(); } }
  assert.equal(decode(new Bytes([65,66]), { encoding: 'utf-8' }), 'AB');
  assert.equal(decode(new ArrayBuffer(0), { encoding: 'gb18030' }), '');
  assert.throws(() => decode({ length: 1 }, { encoding: 'utf-8' }));
  assert.throws(() => decode(Uint8Array.of(65), { encoding: 'automatic' }), error => error.code === 'CATALOG_TEXT_ENCODING');
  assert.equal(decode(new Uint8Array(LAUNCHER_CATALOG_TEXT_LIMITS.bytes), { encoding: 'utf-8' }).length, 1048576);
  assert.throws(() => decode(new Uint8Array(1048577), { encoding: 'utf-8' }), error => error.code === 'CATALOG_TEXT_BUDGET');
});

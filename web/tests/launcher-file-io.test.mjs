import test from 'node:test';
import assert from 'node:assert/strict';
import { readLauncherText, readLauncherCatalogBytes, LAUNCHER_FILE_BYTES } from '../launcher-file-io.mjs';

test('local launcher text is read by one exact bounded slice', async () => {
  const bytes = new TextEncoder().encode('<Demo>original 中文</Demo>');
  const calls = [];
  const text = await readLauncherText({ size: bytes.length, slice(start, end) {
    calls.push([start, end]); return { arrayBuffer: async () => bytes.buffer };
  }, arrayBuffer() { throw new Error('Full-file method must not be used.'); } }, 'utf-8');
  assert.equal(text, '<Demo>original 中文</Demo>');
  assert.deepEqual(calls, [[0, bytes.length]]);
});

test('GB18030 uses explicit fatal decoding with an original known character vector', async () => {
  const bytes = Uint8Array.of(0xd6, 0xd0, 0xce, 0xc4); // Original encoding test vector for 中文.
  assert.equal(await readLauncherText(new Blob([bytes]), 'gb18030'), '中文');
  await assert.rejects(readLauncherText(new Blob([Uint8Array.of(0xff)]), 'utf-8'));
  await assert.rejects(readLauncherText(new Blob([Uint8Array.of(0x81)]), 'gb18030'));
});

test('empty, oversized, unsafe and malformed file inputs reject before IO', async () => {
  let reads = 0;
  for (const size of [0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1, LAUNCHER_FILE_BYTES + 1]) {
    await assert.rejects(readLauncherText({ size, slice() { reads += 1; } }, 'utf-8'));
  }
  for (const value of [null, undefined, {}, { size: 1 }]) await assert.rejects(readLauncherText(value, 'utf-8'));
  assert.equal(reads, 0);
});

test('unsupported encoding and short/config-changed reads fail without partial text', async () => {
  let reads = 0;
  const file = { size: 10, slice() { reads += 1; return { arrayBuffer: async () => new ArrayBuffer(9) }; } };
  await assert.rejects(readLauncherText(file, 'auto'));
  assert.equal(reads, 0);
  await assert.rejects(readLauncherText(file, 'utf-8'));
  const changed = { size: 1, slice() { return { arrayBuffer: async () => { changed.size = 2; return new ArrayBuffer(1); } }; } };
  await assert.rejects(readLauncherText(changed, 'utf-8'));
});

test('raw catalog read owns exact bytes before decoding or cache use', async () => {
  const source = Uint8Array.of(0, 255, 65, 13, 10); const slices = [];
  const bytes = await readLauncherCatalogBytes({ size: source.length, slice(start, end) { slices.push([start, end]); return { arrayBuffer: async () => source.buffer }; } });
  source.fill(42); assert.deepEqual(bytes, Uint8Array.of(0, 255, 65, 13, 10)); assert.deepEqual(slices, [[0, 5]]);
});

test('raw catalog read rejects non-buffer and proxy arrayBuffer results', async () => {
  for (const result of [1, {}, Uint8Array.of(1), new Proxy(new ArrayBuffer(1), {})]) await assert.rejects(readLauncherCatalogBytes({ size: 1, slice() { return { arrayBuffer: async () => result }; } }));
});

test('file size is captured once before slicing and changed reads still reject', async () => {
  let sizeReads = 0, requested;
  const file = { get size() { return ++sizeReads === 1 ? 1 : LAUNCHER_FILE_BYTES + 1; }, slice(start, end) { requested = [start, end]; return { arrayBuffer: async () => new ArrayBuffer(1) }; } };
  await assert.rejects(readLauncherCatalogBytes(file)); assert.deepEqual(requested, [0, 1]);
});

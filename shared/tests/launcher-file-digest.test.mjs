import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { computeLauncherFileMd5, LauncherManifestError, LAUNCHER_MANIFEST_LIMITS } from '../index.mjs';

test('public raw-file digest matches independent crypto at MD5 block boundaries and preserves newlines', () => {
  for (const length of [0, 1, 55, 56, 63, 64, 65, 257]) {
    const data = Uint8Array.from({ length }, (_, i) => (i * 17) & 255);
    assert.equal(computeLauncherFileMd5(data), createHash('md5').update(data).digest('hex'));
  }
  assert.notEqual(computeLauncherFileMd5(Uint8Array.of(65, 13, 10)), computeLauncherFileMd5(Uint8Array.of(65, 10)));
});
test('raw-file digest owns real offset bytes and ignores typed subclass metadata', () => {
  class Wrong extends Uint8Array { get byteLength() { return 0; } *[Symbol.iterator]() { yield 99; } }
  const src = new Wrong([1, 0, 255, 2]), expected = createHash('md5').update(Uint8Array.of(0, 255)).digest('hex');
  assert.equal(computeLauncherFileMd5(src.subarray(1, 3)), expected); assert.equal(computeLauncherFileMd5(Uint8Array.of(0, 255).buffer), expected);
});
test('raw-file digest rejects fake or over-budget bytes without interpreting files', () => {
  for (const value of ['', [], null, new DataView(new ArrayBuffer(4)), new Proxy(new Uint8Array(4), {})]) assert.throws(() => computeLauncherFileMd5(value), e => e instanceof LauncherManifestError && e.code === 'INVALID_INPUT');
  assert.throws(() => computeLauncherFileMd5(new Uint8Array(LAUNCHER_MANIFEST_LIMITS.fileBytes + 1)), e => e.code === 'MANIFEST_BUDGET');
});

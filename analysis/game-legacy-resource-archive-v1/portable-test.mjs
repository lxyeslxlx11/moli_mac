import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { openCase, vectors, bytes, sourceFor } from './fixture.mjs';
const api = process.argv[2] === 'generated' ? createRequire(import.meta.url)(resolve('build/wechat-game-stage289-api-final/game.js')) : await import('../../shared/index.mjs');
for (const name of ['ordinary', 'local64', 'known-size64', 'descriptor32', 'descriptor64', 'descriptor32-no-signature', 'descriptor64-no-signature', 'prefix-comment', 'end64', 'end64-prefix',
  'wrapped', 'unicode-root', 'many', 'chunked-deflate', 'large-deflate']) {
  const f = await openCase(name, undefined, api), output = createHash('sha256'); let queries = 0;
  const prefix = f.archive.inspect().rootPrefix;
  for (const row of f.expected) {
    const path = prefix ? row.path.slice(prefix.length + 1) : row.path;
    const size = row.length ?? row.bytesHex.length / 2;
    assert.equal(await f.archive.port.stat(path), size);
    for (const at of [0, Math.floor(size / 2), Math.max(0, size - 83)]) {
      const length = Math.min(83, size - at), read = await f.archive.port.read(path, at, length);
      const expected = row.fillByte === undefined ? bytes(row.bytesHex).slice(at, at + length) : new Uint8Array(length).fill(row.fillByte);
      assert.deepEqual(read, expected); output.update(read); queries++;
    }
  }
  const snapshot = f.archive.inspect(); f.archive.close(); assert.equal(f.stats.closed, 1);
  console.log(JSON.stringify({ name, files: f.expected.length, queries, digest: output.digest('hex'),
    zip64: snapshot.zip64, root: snapshot.rootPrefix, reads: snapshot.physicalReads, readBytes: snapshot.physicalBytes, cache: snapshot.cachedBytes }));
}
for (const name of ['duplicate', 'file-directory', 'parent', 'absolute', 'missing-zip64', 'multiple-root']) {
  const source = sourceFor(bytes(vectors.cases[name].hex)); let code;
  try { await api.createLegacyGameResourceArchive(source.input); } catch (e) { code = e.code; }
  assert.ok(code?.startsWith('LEGACY_ASSET_')); assert.equal(source.stats.closed, 1); console.log(JSON.stringify({ name, code, closed: 1 }));
}

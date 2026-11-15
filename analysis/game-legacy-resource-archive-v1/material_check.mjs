/** Verify all selected material ranges against the independent original pack manifest. */
import { openSync, closeSync, readSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const P = 'build/analysis/game-legacy-resource-archive-v1';
const api = process.argv[2] === 'generated' ? createRequire(import.meta.url)(resolve('build/wechat-game-stage289-api-final/game.js')) : await import('../../shared/index.mjs');
const manifest = JSON.parse(readFileSync(join(P, 'full-material-pack.json')));
const fd = openSync(join(P, 'full-material.zip'), 'r');
let closed = 0;
const source = { size: statSync(join(P, 'full-material.zip')).size, async read(at, length) {
  const b = new Uint8Array(length); assert.equal(readSync(fd, b, 0, length, at), length); return b;
}, close() { closed++; closeSync(fd); } };
const a = await api.createLegacyGameResourceArchive(source), initial = a.inspect();
assert.equal(a.count, 1072); assert.equal(initial.zip64, true); assert.equal(initial.physicalReads, 3); assert.equal(initial.physicalBytes, 143457);
const hash = b => createHash('sha256').update(b).digest('hex');
let slices = 0; const digest = createHash('sha256');
for (const row of manifest.entries) {
  assert.equal(await a.port.stat(row.path), row.bytes);
  const original = openSync(join(P, 'material-root', row.path), 'r');
  try {
    for (const [at, size] of [[0, Math.min(31, row.bytes)], [Math.floor(row.bytes / 2), Math.min(37, row.bytes - Math.floor(row.bytes / 2))],
      [Math.max(0, row.bytes - 41), Math.min(41, row.bytes)]]) {
      const expected = new Uint8Array(size); assert.equal(readSync(original, expected, 0, size, at), size);
      const bytes = await a.port.read(row.path, at, size); assert.deepEqual(bytes, expected); digest.update(bytes); slices++;
    }
  } finally { closeSync(original); }
}
const module = await a.port.read('cg_se_6000.exe', 0, 1569280);
assert.equal(hash(module), '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'); module.fill(0);
const boot = await api.prepareLegacyGameStartup({ schema: 'moli.legacy-game-startup.v2', sourceProfile: 'legacy-se6000-37c4',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  mappingHex: Buffer.from('gid:OriginalG glt:OriginalT\0').toString('hex'), context: 'legacy-se6000-37c4', resourceParametersHex: '' }, a.port);
const startup = boot.copy(); assert.equal(startup.moduleDigestBytes.length, 32);
startup.moduleDigestBytes.fill(0); startup.mappingBytes.fill(0); startup.resourceParameters.fill(0); boot.close();
const final = a.inspect(); a.close(); assert.equal(closed, 1);
console.log(JSON.stringify({ files: 1072, contentBytes: manifest.content_bytes, archiveBytes: source.size,
  initialReads: initial.physicalReads, initialBytes: initial.physicalBytes, comparedSlices: slices,
  comparedDigest: digest.digest('hex'), finalPhysicalReads: final.physicalReads, finalPhysicalBytes: final.physicalBytes,
  cachedBytes: final.cachedBytes, ZIP64: true, fullModuleHash: true, startupV2: true, originalExecution: false }));

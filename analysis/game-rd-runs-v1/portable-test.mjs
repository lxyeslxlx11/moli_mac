/** Portable structural model in an actual neutral bundle; no native/game claim. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root = fileURLToPath(new URL('../../', import.meta.url)), output = resolve(root, 'build/analysis/game-rd-runs-v1');
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'portable-entry.mjs'), "export * from '../../../shared/rd-runs.mjs';\nexport {createLauncherResourceSnapshot} from '../../../shared/launcher-resources.mjs';\nexport {encodeLauncherResourceCacheRecord,decodeLauncherResourceCacheRecord} from '../../../shared/launcher-resource-cache.mjs';\n");
assert.equal(esbuild.version, '0.25.12');
const built = await esbuild.build({ absWorkingDir: root, entryPoints: ['build/analysis/game-rd-runs-v1/portable-entry.mjs'],
  outfile: resolve(output, 'portable.cjs'), bundle: true, format: 'cjs', platform: 'neutral', target: 'es2020', write: false, metafile: true, logLevel: 'silent' });
assert.ok(Object.values(built.metafile.outputs).every(row => row.imports.length === 0));
const sha = value => createHash('sha256').update(value).digest('hex'), inputs = [], outputs = [];
for (const path of Object.keys(built.metafile.inputs)) { const raw = await readFile(resolve(root, path)); inputs.push({ path, bytes: raw.length, sha256: sha(raw) }); }
for (const row of built.outputFiles) { await writeFile(row.path, row.contents); outputs.push({ path: row.path.slice(root.length), bytes: row.contents.length, sha256: sha(row.contents) }); }
await writeFile(resolve(output, 'portable-build-report.json'), JSON.stringify({ tool: 'esbuild0.25.12', inputs, outputs, external_imports: 0, native_or_game_acceptance: false }, null, 2) + '\n');
const source = await readFile(resolve(output, 'portable.cjs'), 'utf8');
const vectors = JSON.parse(await readFile(new URL('./original-vectors.json', import.meta.url), 'utf8')).vectors;
function instance() {
  const module = { exports: {} };
  runInNewContext(source, { module, Uint8Array, ArrayBuffer, DataView,
    TextEncoder: undefined, TextDecoder: undefined, URL: undefined, Buffer: undefined, fetch: undefined, process: undefined, require: undefined,
    wx: undefined, window: undefined, document: undefined, crypto: undefined, performance: undefined, AbortController: undefined, AbortSignal: undefined }, { timeout: 1000 });
  return module.exports;
}
const bytes = hex => new Uint8Array(Buffer.from(hex, 'hex'));
test('neutral RD run bundle matches all48 independent vectors without DOM/Node/wx/text APIs', () => {
  const api = instance();
  for (const row of vectors) {
    const decoded = api.decodeRDRunModel(bytes(row.hex));
    assert.equal(sha(decoded.pixels), row.pixelsSha256); assert.equal(sha(decoded.pixelKnown), row.pixelKnownSha256);
    assert.equal(sha(decoded.opaque.paletteBytes), row.paletteSha256); assert.equal(sha(decoded.opaque.paletteKnown), row.paletteKnownSha256);
    assert.equal(decoded.stats.commandCount, row.commandCount);
  }
});
test('neutral original resource-cache roundtrip preserves compressed bytes and explicit unknown positions', () => {
  const api = instance(), row = vectors.find(row => row.id === 'unknown-crosses-palette');
  const binding = { gameListMd5: '1'.repeat(32), regionListMd5: '2'.repeat(32), gameOrdinal: 0, referenceOrdinal: 0,
    regionOrdinal: 0, gameCodeText: '11', directoryText: 'C:\\Original', pathEncoding: 'ascii', patchSourceProfile: 'puk3-195f3afd', patchSourceOrdinal: 1 };
  const raw = bytes(row.hex), resources = api.createLauncherResourceSnapshot({ binding, files: [{ path: 'Bin/original-runs.bin', bytes: raw }] });
  const record = api.encodeLauncherResourceCacheRecord({ revision: 1, resources }); raw.fill(0);
  const recovered = api.decodeLauncherResourceCacheRecord(record), frame = api.decodeRDRunModel(recovered.resources.files[0].bytes);
  assert.equal(recovered.trust, 'unverified'); assert.equal(sha(frame.pixelKnown), row.pixelKnownSha256);
  assert.equal(sha(frame.opaque.paletteKnown), row.paletteKnownSha256); assert.equal(frame.gameConsumer, 'unverified');
});

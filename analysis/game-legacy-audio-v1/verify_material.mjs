/** Report bounded WAV metadata for the private installed files without retaining audio. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEGACY_GAME_WAVE_LIMIT, parseLegacyGameWave } from '../../shared/legacy-game-audio.mjs';

const root = 'build/analysis/diagnostic-material-20261026-_9d1ephh/source/app/bin';
const source = JSON.parse(readFileSync(new URL('./source-check.json', import.meta.url)));
const directories = new Map(['se', 'bgm'].map(directory => {
  const names = readdirSync(join(root, directory));
  const folded = new Map(names.map(name => [name.toLowerCase(), name]));
  assert.equal(folded.size, names.length);
  return [directory, folded];
}));
const rows = [{ path: source.cue.path, mode: 0, cue: source.cue.id }, ...source.music.tracks];
const results = rows.map(({ path, mode, track = null, cue = null }) => {
  const [directory, basename] = path.split('/');
  const name = directories.get(directory).get(basename.toLowerCase());
  assert.ok(name, path);
  const file = join(root, directory, name);
  assert.ok(statSync(file).size <= LEGACY_GAME_WAVE_LIMIT);
  const bytes = readFileSync(file);
  try {
    const { channels, bits, rate, frames, loop } = parseLegacyGameWave(bytes, mode === 2);
    return { track, cue, mode, file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
      declaredBytes: 8 + bytes.readUInt32LE(4), channels, bits, rate, frames, loop };
  } finally { bytes.fill(0); }
});
assert.equal(results[0].sha256, source.installed_material.member_sha256);
const distinct = new Set(results.map(row => row.file)).size;
writeFileSync(new URL('./material-check.json', import.meta.url),
  JSON.stringify({ stage: 236, scope: 'private installed files parsed offline', distinct, results }, null, 2) + '\n');
console.log(JSON.stringify({ combinations: results.length, distinct,
  largerDeclaredSize: results.filter(row => row.declaredBytes > row.bytes).map(row => row.file.split('/').at(-1)) }));

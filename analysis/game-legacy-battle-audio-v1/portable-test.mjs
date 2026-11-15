import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { source, originalFrames, originalSelection, originalPanTable } from './reference.mjs';
const api = process.env.MOLI_SHARED_BUILD ? createRequire(import.meta.url)(resolve(process.env.MOLI_SHARED_BUILD)) : await import('../../shared/index.mjs');
const selector = api.createLegacyGameBattleAudio(), frames = originalFrames();
const result = frames.map(frame => selector.advance(frame));
assert.deepEqual(result, originalSelection(frames));
for (const row of source.catalog) assert.deepEqual(api.legacyGameSound(row.id), row);
assert.deepEqual(Array.from({ length: 128 }, (_, i) => api.legacyGameSoundPan(i * 5).hundredthsDb), originalPanTable());
selector.close();
console.log(JSON.stringify({ catalog: source.catalog.length, panCells: 128, frames: frames.length,
  cues: result.reduce((n, row) => n + (row?.cues.length ?? 0), 0), wholeStates: result }));

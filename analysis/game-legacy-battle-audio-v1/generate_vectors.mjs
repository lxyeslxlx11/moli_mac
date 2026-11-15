/** Export the independent source equations,without loading product code. */
import { writeFileSync } from 'node:fs';
import { source, originalFrames, originalSelection, originalPanTable } from './reference.mjs';
const frames = originalFrames();
writeFileSync(new URL('./original-vectors.json', import.meta.url), JSON.stringify({
  schema: 'moli.fixed37c4.battle-audio-source-equations.v1',
  authority: 'REA/PE catalog and logarithmic tables;owned logical frame scheduling is inferred',
  originalExecution: false, sampleSha256: source.sample.sha256,
  pan: originalPanTable(), frames, expected: originalSelection(frames),
}, null, 2) + '\n');

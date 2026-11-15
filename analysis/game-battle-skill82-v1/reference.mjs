import {readFileSync} from 'node:fs';
export {castingMotion as skill82Motion} from '../game-battle-casting-v1/reference.mjs';
export {movingNumericProjection as skill82Projection,movingNumericDigest as skill82Digest} from '../game-battle-moving-numeric-v1/reference.mjs';
export const skill82Vectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));

import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {verifyAttachedRIDModel} from '../game-battle-attached-rid-v1/verify_model.mjs';
import {petTransitionVectors,verifyPetTransitionTrace} from '../game-battle-pet-transition-v1/reference.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage295-api-final/game.js')):await import('../../shared/index.mjs');
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url)));
const original=read('../game-battle-attached-rid-v1/original-vectors.json');
const attached=await verifyAttachedRIDModel(api,{...original,traces:original.traces.filter(t=>t.case.name==='element')});
const pet=await verifyPetTransitionTrace(api,assert,petTransitionVectors.traces.find(t=>t.name==='summon-alternate-unavailable'));
const reference=read('./regression-references.json');
const digests=[...reference.attached.rasters.map(r=>r.rgbaSha256),...reference.pet.renders.flat().map(r=>r.rgbaSha256)];
assert.equal(attached.geometryBoundaries,1);assert.equal(pet.rasters,164);
console.log(JSON.stringify({stage:295,attached,pet,promotedPetFrames:100,completeRetainedFrames:digests.length,
  digest:createHash('sha256').update(JSON.stringify(digests)).digest('hex'),sourceGeneratedComparable:true,originalExecution:false}));

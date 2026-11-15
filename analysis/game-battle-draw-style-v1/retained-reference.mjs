/** Current independent references retain archived vectors and their exact input identities. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=path=>readFileSync(new URL(path,import.meta.url));
const reference=JSON.parse(read('./regression-references.json'));
for(const input of reference.inputs){const raw=read('../../'+input.path);assert.equal(raw.length,input.bytes);assert.equal(createHash('sha256').update(raw).digest('hex'),input.sha256);}
const originalPet=JSON.parse(read('../game-battle-pet-transition-v1/original-vectors.json'));
export function currentAttachedRIDDrawStyleReference(value){
  return {...value,traces:value.traces.map(trace=>{
    if(trace.case.name!==reference.attached.case.name)return trace;
    const next=reference.attached;
    assert.deepEqual(trace.case,next.case);assert.deepEqual(trace.initial,next.initial);
    assert.deepEqual(trace.states.slice(0,-1),next.states.slice(0,-1));assert.deepEqual(trace.rasters,next.rasters);
    return next;
  })};
}
export function currentPetDrawStyleReference(row){
  if(row.name!==reference.pet.name)return row;
  assert.deepEqual(row,originalPet.traces.find(t=>t.name===row.name));
  assert.equal(row.frames.length,reference.pet.frames_unchanged);
  return {...row,renders:reference.pet.renders};
}

import {specialsProjection,specialsDigest} from '../game-battle-physical-specials-v1/projection.mjs';
export {specialsDigest as guardDigest};
export function guardProjection(owner){
 const p=specialsProjection(owner),bodies=owner.copyState().bodies.filter(Boolean);
 for(const row of p.bodies){const b=bodies.find(b=>b.slot===row.slot);
  for(const key of ['frozen','actionRead','actionWrite','tupleWrite','pairedTarget','messageResource','effectResource'])row[key]=b[key];
 }return p;
}
export function guardOwned(owner){return owner.copyState().bodies.filter(Boolean).map(b=>({slot:b.slot,actions:Array.from(b.actions),actionRead:b.actionRead,actionWrite:b.actionWrite,tuples:Array.from(b.tuples),tupleRead:b.tupleRead,tupleWrite:b.tupleWrite}));}

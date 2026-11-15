import{guardProjection}from'../game-battle-physical-guard-v1/projection.mjs';
export{guardDigest as specialPairsDigest,guardOwned as specialPairsOwned}from'../game-battle-physical-guard-v1/projection.mjs';
export function specialPairsProjection(owner){const p=guardProjection(owner),bodies=owner.copyState().bodies;for(const r of p.bodies)r.statusScalar=bodies[r.slot].statusScalar??0;return p;}

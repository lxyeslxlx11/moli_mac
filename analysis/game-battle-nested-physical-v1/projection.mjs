import{guardProjection}from'../game-battle-physical-guard-v1/projection.mjs';
export{guardDigest as nestedPhysicalDigest,guardOwned as nestedPhysicalOwned}from'../game-battle-physical-guard-v1/projection.mjs';
export function nestedPhysicalProjection(owner){const p=guardProjection(owner),bodies=owner.copyState().bodies;for(const r of p.bodies)r.scriptSound=bodies[r.slot].scriptSound??0;return p;}

import{nestedPhysicalProjection}from'../game-battle-nested-physical-v1/projection.mjs';
export{nestedPhysicalDigest as special96Digest,nestedPhysicalOwned as special96Owned}from'../game-battle-nested-physical-v1/projection.mjs';
export function special96Projection(owner){const p=nestedPhysicalProjection(owner),bodies=owner.copyState().bodies;for(const r of p.bodies)r.scriptAuxSound=bodies[r.slot].scriptAuxSound??0;return p;}

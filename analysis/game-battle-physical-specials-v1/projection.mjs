import {projectileProjection,projectileDigest} from '../game-battle-physical-projectiles-v1/projection.mjs';
export {projectileDigest as specialsDigest};
export function specialsProjection(owner){const p=projectileProjection(owner),raw=owner.copyPlayback();for(const row of p.nodes){const n=raw.nodes.find(n=>n.id===row.id);if(n.physicalSpecial)row.physicalSpecial=n.physicalSpecial;}if(raw.directSubmissions)p.directSubmissions=Array.from(raw.directSubmissions);return p;}

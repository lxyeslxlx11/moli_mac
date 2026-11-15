/** Observable source-equation projection; host-only comparison helper. */
import {physicalProjection,physicalDigest} from '../game-battle-physical-family-runtime-v1/reference.mjs';
export {physicalDigest as projectileDigest};
export function projectileProjection(owner){const projected=physicalProjection(owner),raw=owner.copyPlayback();
 for(const row of projected.nodes){const n=raw.nodes.find(n=>n.id===row.id);if(n.physical)row.physical={...n.physical,tuples:Array.from(n.physical.tuples)};}
 return projected;
}

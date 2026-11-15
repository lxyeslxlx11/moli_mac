import {readFileSync} from 'node:fs';
import {numericSkillMotion,numericSkillProjection,numericSkillDigest} from '../game-battle-numeric-skills-v1/reference.mjs';
export const movingNumericVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export {numericSkillMotion as movingNumericMotion,numericSkillDigest as movingNumericDigest};
export function movingNumericProjection(owner){const p=numericSkillProjection(owner),raw=owner.copyPlayback(),bodies=owner.copyState().bodies.filter(Boolean);
 for(const row of p.bodies){const b=bodies.find(b=>b.slot===row.slot);row.afterImageEnabled=b.afterImageEnabled;row.afterImageCounter=b.afterImageCounter;}
 for(const row of p.nodes)row.scale=Array.from(raw.nodes.find(n=>n.id===row.id).scale);return p;
}

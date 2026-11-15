import {readFileSync} from 'node:fs';
import {statusSkillProjection,statusSkillDigest} from '../game-battle-status-skills-v1/reference.mjs';
import {castingHex} from '../game-battle-casting-v1/reference.mjs';
export const numericSkillVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const slot=n=>n===20?50:n===21?51:n;
export function numericSkillMotion(c){const fields=[c.code??c.category*100+c.level,c.cost??3,c.ignoredWord??0,slot(c.caster)];for(const h of c.hits)fields.push(slot(h[0]),h[1]|0,h[2]);fields.push(255);return Uint8Array.from('M|SKL|'+fields.map(castingHex).join('|')+'|',c=>c.charCodeAt(0));}
export {statusSkillProjection as numericSkillProjection,statusSkillDigest as numericSkillDigest};

import {readFileSync} from 'node:fs';
import {castingProjection,castingDigest,castingHex} from '../game-battle-casting-v1/reference.mjs';
const original=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const corrected=JSON.parse(readFileSync(new URL('../game-legacy-battle-status-variant-v1/hp-zero-traces.json',import.meta.url)));
const overrides=new Map(corrected.traces.map(trace=>[trace.case.name,trace]));
const traces=original.traces.map(trace=>overrides.get(trace.case.name)??trace);
export const statusSkillVectors={...original,traces,frames:traces.reduce((total,trace)=>total+trace.states.length,0),
 rgbaFrames:traces.reduce((total,trace)=>total+trace.rasters.length,0)};
const selfClasses=new Set([50,51,52,53,88]),slot=n=>n===20?50:n===21?51:n;
export function statusSkillMotion(c){const fields=[c.category*100+c.level,c.cost??3,c.ignoredWord??0,slot(c.caster)];
 if(selfClasses.has(c.category))fields.push(c.hits.length?c.hits[0][1]|0:255);
 else{for(const h of c.hits)fields.push(slot(h[0]),h[1]|0,...(c.category===68?[h[2]]:[]));fields.push(255);}
 return Uint8Array.from('M|SKL|'+fields.map(castingHex).join('|')+'|',c=>c.charCodeAt(0));
}
export {castingDigest as statusSkillDigest};
export function statusSkillProjection(owner){const p=castingProjection(owner),raw=owner.copyPlayback(),bodies=owner.copyState().bodies.filter(Boolean);
 for(const b of p.bodies){const raw=bodies.find(r=>r.slot===b.slot);b.numberStyle=raw.numberStyle;b.numberValue=raw.numberValue;b.rawStatusFlags=raw.rawStatusFlags;}
 for(const n of p.nodes){const rawNode=raw.nodes.find(r=>r.id===n.id);if(rawNode.statusSkill)n.statusSkill={...rawNode.statusSkill,emitterSlots:rawNode.statusSkill.emitterSlots?Array.from(rawNode.statusSkill.emitterSlots):null};}
 if(raw.statusSkills)p.statusSkills=raw.statusSkills;return p;
}

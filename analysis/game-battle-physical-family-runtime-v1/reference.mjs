import {readFileSync} from 'node:fs';
export {movingNumericProjection as physicalProjection,movingNumericDigest as physicalDigest} from '../game-battle-moving-numeric-v1/reference.mjs';
export const physicalVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const slot=n=>n===20?50:n===21?51:n;
export function physicalMotion(c){const fields=[c.code??c.category*100+c.level,c.cost??3,c.variant??0];
 if(c.variant>0){fields.push(slot(c.caster??c.hits[0][0]));for(const h of c.hits){fields.push(slot(h[1]),h[2]|0,h[3]);if(h[2]&0x800000)fields.push(...h[4]);if(h[1]===(c.caster??c.hits[0][0])&&(h[2]&0x200))fields.push(slot(h.guard));}}
 else for(let i=0;i<c.hits.length;i++){const h=c.hits[i];fields.push(slot(h[0]),slot(h[1]),h[2]|0,h[3]);if(i===0&&c.category===81)fields.push(c.extra??7);if(h[2]&0x800000)fields.push(...h[4]);if(h[2]&0x200)fields.push(slot(h.guard));if(i===0&&c.category===94)fields.push(c.extra??1);}
 fields.push(255);return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',c=>c.charCodeAt(0));
}

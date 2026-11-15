import {physicalMotion} from '../game-battle-physical-family-runtime-v1/reference.mjs';
export {projectileProjection,projectileDigest} from './projection.mjs';
const slot=n=>n===20?50:n===21?51:n;
// Source3654..3779: related73 positive records never consume a self-guard scalar.
export function projectileMotion(c){
 if(c.category!==73||!(c.variant>0))return physicalMotion(c);
 const fields=[c.code??c.category*100+c.level,c.cost??3,c.variant,slot(c.caster??c.hits[0][0])];
 for(const h of c.hits){fields.push(slot(h[1]),h[2]|0,h[3]);if(h[2]&0x800000)fields.push(...h[4]);}
 fields.push(255);
 return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',ch=>ch.charCodeAt(0));
}

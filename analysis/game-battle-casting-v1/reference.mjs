import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const castingVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export const castingHex=n=>(n>>>0).toString(16).toUpperCase();
export function castingMotion(c){const fields=[c.category*100+c.level,c.cost??3,c.ignoredWord??0,c.caster===20?50:c.caster===21?51:c.caster];
 for(const h of c.hits)fields.push(h[0]===20?50:h[0]===21?51:h[0],h[1]|0,h[2],...(h[1]&0x800000?h[3]:[]));fields.push(255);
 return Uint8Array.from('M|SKL|'+fields.map(castingHex).join('|')+'|',c=>c.charCodeAt(0));}
const bodyFields=['slot','state','busy','position','angle','facing','animationAction','speed','speedPercent','counter','dynamicFlags','actorFlags','vitals','skillStatus','mpCost','classCode','rememberedPosition','reactionCounter','attackCooldown','attackFinishCounter','sourceTimer','auxFF8','tupleRead','resourceId','savedFlags'];
const nodeFields=['id','kind','slot','parentId','deleted','priority','drawPriority','position','screen','state','counter','height','actorFlags','resourceId','alternateY','drawFlagMask','drawFlagValue'];
const animationFields=['graphicIndex','drawOffsetX','drawOffsetY','nextFrame','delay','signal','lastAction','lastResource','lastFacing','mode','attachmentX','attachmentY','drawFlags','color'];
const pick=(o,keys)=>Object.fromEntries(keys.map(k=>[k,o[k]]));
export function castingProjection(owner){const p=owner.copyPlayback(),state=p.casting??{};return{phase:p.phase,seed:p.seed,bodies:owner.copyState().bodies.filter(Boolean).map(b=>pick(b,bodyFields)),
 nodes:p.nodes.map(n=>({...pick(n,nodeFields),animation:pick(n.animation,animationFields),...(n.casting?{casting:{...n.casting,tuples:Array.from(n.casting.tuples)}}:{})})),
 overlayCounter:state.overlayCounter??0,overlayDirection:state.overlayDirection??0,submissions:state.submissions??[],background:p.backgroundState};}
/** Typed IEEE754 digest avoids Python/JS JSON float spelling and negative-zero differences. */
export function castingDigest(value){const h=createHash('sha256'),size=n=>{const b=Buffer.alloc(4);b.writeUInt32BE(n);return b;};
 const walk=v=>{if(v===null)h.update('n');else if(typeof v==='boolean')h.update(v?'t':'f');else if(typeof v==='number'){const b=Buffer.alloc(8);b.writeDoubleBE(v===0?0:v);h.update('d').update(b);}
  else if(typeof v==='string'){const b=Buffer.from(v);h.update('s').update(size(b.length)).update(b);}
  else if(Array.isArray(v)){h.update('[').update(size(v.length));for(const x of v)walk(x);}
  else if(v&&typeof v==='object'){const keys=Object.keys(v).sort();h.update('{').update(size(keys.length));for(const k of keys){walk(k);walk(v[k]);}}
  else throw Error('Unsupported reference digest value.');};walk(value);return h.digest('hex');}

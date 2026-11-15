const slot=n=>n===20?50:n===21?51:n;
export function nestedPhysicalMotion(c){
 const fields=[c.code??c.category*100+c.level,c.cost??4,c.variant];
 for(let i=0;i<c.hits.length;i++){const h=c.hits[i];fields.push(slot(h[0]),slot(h[1]),h[2]|0,h[3]);if(h[2]&0x800000)fields.push(...h[4]);if(h[2]&512)fields.push(slot(h[5]));
  if(i===0&&(h[2]&1)){const n=c.nested;fields.push(slot(n.target),n.flags|0,n.amount);if(n.flags&0x800000)fields.push(...n.resources);if(n.flags&512)fields.push(slot(n.guard));}
 }
 fields.push(255);return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',ch=>ch.charCodeAt(0));
}
/** 435000 only reads nested words for72. This fixture exercises424310's
 * separate113 runtime branch; it is not evidence of accepted113 wire input. */
export function nestedPhysicalRuntimeCommand(api,c){
 if(c.category!==113||!(c.hits[0][2]&1))return api.decodeLegacyGameBattleMotion(nestedPhysicalMotion(c)).commands[0];
 const parsed=api.decodeLegacyGameBattleMotion(nestedPhysicalMotion({...c,category:72,code:undefined})).commands[0];
 return Object.freeze({...parsed,classCode:113,fields:Object.freeze([c.code??11300+c.level,...parsed.fields.slice(1)])});
}

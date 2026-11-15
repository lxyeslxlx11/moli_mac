const slot=n=>n===20?50:n===21?51:n;
export function selfPhysicalMotion(c){
 const fields=[c.code??c.category*100+c.level,c.cost??4,c.variant,slot(c.caster)];
 for(const h of c.hits){fields.push(slot(h[1]),h[2]|0,h[3]);if(h[2]&0x800000)fields.push(...h[4]);if(c.category!==73&&h[1]===c.caster&&(h[2]&0x200))fields.push(slot(h[5]));}
 fields.push(255);return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',ch=>ch.charCodeAt(0));
}

export function guardedSelfFlight(c) {
 if(c.category!==266||c.variant!==2||!c.hits.some(hit=>hit[1]!==c.caster))return null;
 const saved=c.hits.filter(hit=>hit[1]===c.caster).at(-1);
 if(!saved||!(saved[2]&0x200)||saved[5]===c.caster)return null;
 return {slot:saved[5],flags:(saved[2]&~0x200)>>>0,amount:saved[3]};
}

export function directSelfFlight(c) {
 if(c.category!==266||c.variant!==2||!c.hits.some(hit=>hit[1]!==c.caster))return null;
 const saved=c.hits.filter(hit=>hit[1]===c.caster).at(-1);
 if(!saved||((saved[2]&0x200)&&saved[5]!==c.caster))return null;
 return {slot:c.caster,flags:(saved[2]&~0x200)>>>0,amount:saved[3],alias:!!(saved[2]&0x200)};
}

export function guardedSelfHP(vitals,{flags,amount}) {
 if(flags&0x8000)return vitals[0];
 if(flags&0x4000)return Math.min(vitals[1],(vitals[0]+amount)|0);
 return flags&0x2000?vitals[0]:Math.max(0,(vitals[0]-amount)|0);
}

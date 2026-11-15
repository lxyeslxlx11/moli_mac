import{readFileSync}from'node:fs';
export const mountedInputVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export const petBytes=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
export const petProjection=r=>({present:r.present,fields:{...r.fields},nameHex:Buffer.from(r.nameBytes).toString('hex'),nicknameHex:Buffer.from(r.nicknameBytes).toString('hex'),skills:r.skills.map(s=>({present:s.present,id:s.id,flags:s.flags,targetMask:s.targetMask,mpCost:s.mpCost,sortKey:s.sortKey,nameHex:Buffer.from(s.nameBytes).toString('hex'),descriptionHex:Buffer.from(s.descriptionBytes).toString('hex')}))});

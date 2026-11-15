import{readFileSync}from'node:fs';
export const playerSkillVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export const playerBytes=s=>Uint8Array.from(s,c=>c.charCodeAt(0)),playerHex=b=>Buffer.from(b).toString('hex');
export const playerRecordProjection=r=>({slot:r.slot,present:r.present,nameHex:playerHex(r.nameBytes),fields:{...r.fields},levels:Array.from(r.levels,l=>({present:l.present,nameHex:playerHex(l.nameBytes),descriptionHex:playerHex(l.descriptionBytes),fields:{...l.fields}}))});
export function verifyPlayerSkillReceives(api,assert){const owner=api.createLegacyGamePlayerSkills();try{for(const event of playerSkillVectors.receives){const out=owner.apply(event.consumer,event.slot,new Uint8Array(Buffer.from(event.bytesHex,'hex'))),s=owner.copyState(),e=event.expected;
  assert.equal(s.version,e.version);assert.equal(s.headerCode,e.headerCode);assert.equal(playerHex(s.headerNameBytes),e.headerNameHex);assert.deepEqual(Array.from(s.order),e.order);assert.deepEqual(Array.from(s.records,playerRecordProjection),e.records);assert.deepEqual(Array.from(out.requests,r=>({id:r.operationId,slot:r.arguments[0]})),e.queries.map(slot=>({id:'send-004f6d00',slot})));assert.deepEqual(Array.from(out.slots),e.changed);assert.deepEqual(Array.from(out.craftResetSlots),e.craftResetSlots);
  const filtered=Array.from(s.order).filter(slot=>s.records[slot].present&&[0,5].includes(s.records[slot].fields[0x2c]));assert.deepEqual(Array.from(owner.battleRecords(),r=>r.slot),filtered);
 }return playerSkillVectors.receives.length;}finally{owner.close();}}

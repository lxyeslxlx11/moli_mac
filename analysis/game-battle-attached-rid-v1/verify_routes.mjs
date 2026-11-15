import assert from'node:assert/strict';import{castingMotion}from'../game-battle-casting-v1/reference.mjs';import{attachedRIDFixture}from'./fixture.mjs';import{attachedRIDMotion}from'./reference.mjs';
const json=value=>JSON.stringify(value,(_,v)=>ArrayBuffer.isView(v)?Array.from(v):v);
export async function verifyAttachedRIDRoutes(api,v){const c=v.traces.find(t=>t.case.name==='level-0').case;let checks=0;
 const f=await attachedRIDFixture(api,v,c);try{
  assert.equal(f.additionalCommands.length,0);assert.equal(f.command.attachedRID,1);assert.equal(f.command.fields.length,29);const plan=api.planBattleAttachedRID(f.command,s=>f.owner.copyState().bodies[s],0,0);assert.equal(plan.kind,'attached-rid-plan');assert.equal(plan.records[0].first.vitals[0],40);assert.equal(plan.records[0].second.flags,2);checks+=6;
  const before=json(f.owner.copyState());assert.equal(f.owner.queuePhysicalFamily({...f.command},1,0,0).kind,'physical-family-unavailable');assert.equal(json(f.owner.copyState()),before);checks+=2;
  const q=f.owner.queuePhysicalFamily(f.command,1,0,0);assert.equal(q.attachedRID,1);const p=f.owner.copyPlayback();assert.equal(p.attachedRID.handoffs[0].birthIntegerBoxes.length,8);assert.equal(p.attachedRID.registry[5],null);assert.equal(p.attachedRID.bodies.filter(n=>!n.callbackEnabled).length,2);checks+=4;
  const mutate=f.owner.copyPlayback();mutate.attachedRID.bodies.find(n=>n.body.nameBytes).body.nameBytes.fill(0);assert.notEqual(f.owner.copyPlayback().attachedRID.bodies.find(n=>n.body.nameBytes).body.nameBytes[0],0);checks++;
  const storage=json(f.owner.copyState());f.owner.stepPlayback({mainState:10,substate:7,slowEffects:false,localSlot:0});assert.equal(json(f.owner.copyState()),storage);checks++;
 }finally{f.close();}
 for(const context of['no-rider','missing-local','unmodeled-flags']){const next={...c,...(context==='no-rider'?{mounts:[]}:{}),rids:c.rids.map(r=>r.slice())};if(context==='unmodeled-flags')next.rids[0][12]=0x4000;const x=await attachedRIDFixture(api,v,next);try{const before=json([x.owner.copyState(),x.owner.copyPlayback()]);const q=x.owner.queuePhysicalFamily(x.command,1,context==='missing-local'?undefined:0,0);assert.equal(q.kind,'physical-family-unavailable');assert.equal(json([x.owner.copyState(),x.owner.copyPlayback()]),before);checks+=2;}finally{x.close();}}
 const notDead={...c,rids:c.rids.map(r=>r.slice())};notDead.rids[0][20]=0;const d=api.decodeLegacyGameBattleMotion(attachedRIDMotion(notDead));assert.equal(d.commands.length,2);assert.equal(d.commands[0].attachedRID,0);assert.equal(d.commands[1].index,22);checks+=3;
 const raw=Uint8Array.from([...attachedRIDMotion(c),...Uint8Array.from('END|',c=>c.charCodeAt(0))]),decoded=api.decodeLegacyGameBattleMotion(raw);assert.equal(decoded.commands[0].attachedRID,1);assert.ok(decoded.commands.length>1);checks+=2;
 const alias={...c,rids:c.rids.map(r=>r.slice())};alias.rids[0][1]=50;assert.throws(()=>api.decodeLegacyGameBattleMotion(attachedRIDMotion(alias)),e=>e.code?.includes('SLOT'));checks++;
 const x=await attachedRIDFixture(api,v,c);try{x.owner.appendActions(0,1,Array(190).fill(0));const before=json([x.owner.copyState(),x.owner.copyPlayback()]);assert.throws(()=>x.owner.queuePhysicalFamily(x.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(json([x.owner.copyState(),x.owner.copyPlayback()]),before);checks+=2;}finally{x.close();}
 const caster=await attachedRIDFixture(api,v,c);try{const primary=castingMotion({category:19,level:0,caster:0,cost:3,hits:[[10,1,12]]}),rid=attachedRIDMotion(c),ridAt=rid.findIndex((x,i)=>x===82&&rid[i+1]===73&&rid[i+2]===68);const raw=Uint8Array.from([...primary,...rid.subarray(ridAt)]),command=api.decodeLegacyGameBattleMotion(raw).commands[0];assert.equal(caster.owner.queueCasting(command,1,0,0).kind,'casting-queued');let handoff;
  for(let i=0;i<40;i++){
   caster.step();
   handoff=caster.owner.copyPlayback().attachedRID.handoffs[0];
   if(handoff.complete)break;
  }
  assert.deepEqual([handoff.complete,Array.from(handoff.lastReadSlots)],[true,[0,5]]);checks+=2;}finally{caster.close();}
 return{checks,atomicUnsupportedContexts:3,hiddenReplacementBodies:2,integerBoxConstructions:8,untrustedCopiesRejected:true,rawRIDSlotsNotRemapped:true};}

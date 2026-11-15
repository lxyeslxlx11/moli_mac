/** Physical guard acceptance boundaries, owned storage and actual manager callbacks. */
import assert from 'node:assert/strict';
import {guardFixture} from './fixture.mjs';
import {guardMotion} from './reference.mjs';
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
const command=(api,c)=>api.decodeLegacyGameBattleMotion(guardMotion(c)).commands[0];
export async function verifyGuardCallbacks(api,v){
 let cases=0,charges=0,puffs=0;
 for(const name of ['guard','charge0','charge3','guard-charge0','guard-charge3','guard-RID','guard2599','guard-zero','guard-lookahead','guard-RID-old-fourth']){
  const t=v.traces.find(t=>t.case.name===name),f=await guardFixture(api,v,t.case);let charge=false,puff=false;
  try{
   assert.equal(f.owner.queuePhysicalFamily(f.command,1,t.case.local,0).kind,'strike-queued');
   if(name==='guard-RID-old-fourth')assert.equal(f.owner.copy(0).tuples[4*4+3],0x11223344);
   for(let i=0;i<t.states.length;i++){
    f.step();const p=f.owner.copyPlayback();
    for(const n of p.nodes.filter(n=>n.kind==='physical-guard-charge')){
     if(!charge){const parent=p.nodes.find(b=>b.id===n.parentId),b=f.owner.copy(parent.slot),target=f.owner.copy(b.tuples[b.tupleRead*4]);assert.equal(b.frozen,1);assert.equal(target.frozen,1);assert.equal(n.position[1],Math.fround(b.position[1]-32));}
     assert.equal(n.resourceId,name.endsWith('3')?0x1ae49:0x1adb9);assert.equal(n.drawFlagMask,4);assert.equal(n.drawFlagValue,4);charge=true;
    }
    puff||=p.nodes.some(n=>n.kind==='puff');assert.equal(p.casting?.overlayCounter??0,0);
   }
   assert.equal(charge,t.case.hits.some(h=>h[2]&0x1010),name);assert.equal(f.owner.copy(0).frozen,0);assert.equal(f.owner.copy(0).vitals[2],7);charges+=+charge;puffs+=+puff;
   if(name.startsWith('guard-charge'))assert.equal(f.owner.copy(10).frozen,1,'source freeze persists on the protected role until queue reset');
   f.owner.resetQueues((1<<0)|(1<<10)|(1<<11));assert.equal(f.owner.copy(10).frozen,0);
   assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),true);cases++;
  }finally{f.close();}
 }return {callbackCases:cases,chargeCases:charges,puffCases:puffs};
}
export async function verifyGuardAtomic(api,v,{supportsEmptyTargets=false}={}){
 const c=v.traces[0].case,f=await guardFixture(api,v,c);let rejected=0,reads=0;
 try{
  const before=JSON.stringify(f.owner.copyState());
  for(const flags of supportsEmptyTargets?[]:[0x201,0x211,0x1201,0x2201,0x4201,0x8201]){
   const bytes=Uint8Array.from('M|SKL|'+[c.category*100+c.level,3,1,0,0,flags,12,11,255].map(n=>n.toString(16).toUpperCase()+'|').join(''),ch=>ch.charCodeAt(0)),positive=api.decodeLegacyGameBattleMotion(bytes).commands[0],r=f.owner.queuePhysicalFamily(positive,1,0,0);
   assert.equal(r.reason,'physical-family-empty-after-self-runtime-unobserved');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;
  }
  const malformed=[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},
   {...f.command,fields:Object.defineProperty([...f.command.fields],3,{get(){reads++;return 0;}})},command(api,{...c,hits:[[0,10,0x201,12,null,9]]})];
  for(const value of malformed){assert.equal(f.owner.queuePhysicalFamily(value,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  assert.equal(reads,0);f.owner.appendActions(11,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());
  assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
 const rid={...c,hits:[[0,10,0x800201,9,[100040,100041,100050],11]]};
 assert.equal(api.planBattlePhysicalFamily(command(api,rid),()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),0,0).reason,'physical-family-tuple-storage-context');
 const files=v.files.map(row=>{if(row.path!=='Bin/GraphicInfo.bin')return row;const b=Buffer.from(row.bytesHex,'hex'),keep=[];for(let at=0;at<b.length;at+=40)if(b.readUInt32LE(at+36)!==0x5748)keep.push(b.subarray(at,at+40));return {...row,bytesHex:Buffer.concat(keep).toString('hex')};});
 const g=await guardFixture(api,{...v,files},c);
 try{const before=JSON.stringify(g.owner.copyState());assert.throws(()=>g.owner.queuePhysicalFamily(g.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(g.owner.copyState()),before);}finally{g.close();}
 return {atomicRejections:rejected,capacityRejections:1,getterReads:reads,tupleContextRejections:1,missingGraphicRejections:1};
}
export async function verifyGuardManagers(api,v){
 let rounds=0,exits=0,recoveries=0;const results=[];
 for(const name of ['guard','charge0','charge3','guard-charge0','guard-charge3','guard-RID','guard2599','guard-zero','guard-lookahead','guard-local-exit','guard-lookahead-RID','guard-alias-actor','guard-alias-target']){
  const t=v.traces.find(t=>t.case.name===name),c=t.case,f=await guardFixture(api,v,c,{commands:true});let finished=false,stoppedAt=0,recoveredAt=0,finishedAt=0;
  try{
   f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=1;i<=9000;i++){
    const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);
    for(const r of [out.manager,...out.commands])if(r.wait?.recovered?.length){assert.equal(recoveredAt,0);assert.equal(r.wait.counter,0);recoveredAt=i;}
    if(out.body.stopRequested)stoppedAt=i;
    if(out.nextSubstate===7){assert.ok(stoppedAt>0);assert.equal(i,stoppedAt+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finished=true;finishedAt=i;break;}
    if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(f.owner.copyState().activeMask,0);rounds++;finished=true;finishedAt=i;break;}
    f.owner.advanceBackground();
   }
   assert.equal(finished,true,name);const needsRecovery=['guard-lookahead-RID','guard-alias-actor','guard-alias-target'].includes(name);assert.equal(!!recoveredAt,needsRecovery,name);if(recoveredAt){assert.equal(recoveredAt,7203,name);recoveries++;}results.push({name,stoppedAt,recoveredAt,finishedAt});
  }finally{f.close();}
 }return {managerCases:results.length,rounds,exits,recoveries,results};
}

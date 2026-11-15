/** Actual E000 consumers,source corrections and owned lifetime;no injected ready/state. */
import assert from 'node:assert/strict';
import {resultFixture} from './fixture.mjs';
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
export async function verifyResultCallbacks(api,v){
 const expected={reflect:[58,70,6,10],heal:[70,82,6,10],skip:[70,70,6,10],'reflect-MP':[70,70,0,10],'heal-MP':[70,70,6,0],'skip-MP':[70,70,6,0],reflect84:[58,70,6,10],heal84:[70,82,6,10]};let cases=0;
 for(const[name,values]of Object.entries(expected)){
  const t=v.traces.find(t=>t.case.name===name),f=await resultFixture(api,v,t.case);const charges=new Set();
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');
   for(let i=0;i<t.states.length;i++){f.step();for(const n of f.owner.copyPlayback().nodes)if(n.kind==='physical-result-charge')charges.add(n.resourceId);}
   const a=f.owner.copy(0),b=f.owner.copy(10);assert.deepEqual([a.vitals[0],b.vitals[0],a.vitals[2],b.vitals[2]],values,name);
   assert.ok(charges.has(name.startsWith('reflect')?0x1ae1d:name.startsWith('heal')?0x1ae25:0x1ae2d),name);cases++;
  }finally{f.close();}
 }
 for(const name of ['reflect-RID','guard-RID-old-fourth']){
  const t=v.traces.find(t=>t.case.name===name),f=await resultFixture(api,v,t.case);
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');if(name==='guard-RID-old-fourth')assert.equal(f.owner.copy(0).tuples[19],0x11223344);
   for(let i=0;i<t.states.length;i++)f.step();assert.equal(f.owner.copy(0).resourceId,100041);assert.equal(f.owner.copy(11).resourceId,100080);assert.ok(f.owner.copyPlayback().nodes.some(n=>n.kind==='rider'&&n.parentId===f.owner.copyPlayback().nodes.find(n=>n.kind==='body'&&n.slot===0).id));cases++;
  }finally{f.close();}
 }return {callbackCases:cases,HP_MP_recipient_and_RID_verified:true};
}
export async function verifyResultCorrections(api,v){
 const c=v.traces.find(t=>t.case.name==='reflect-guard').case,f=await resultFixture(api,v,c);let enabled=false,disabled=false;
 try{f.owner.queuePhysicalFamily(f.command,1,0,0);
  for(let i=0;i<500;i++){const before=f.owner.copy(11);f.step();const after=f.owner.copy(11);
   if(before.state===73){assert.equal(after.afterImageEnabled,1);assert.equal(after.attackFinishCounter,0);enabled=true;assert.ok(f.owner.copyPlayback().nodes.some(n=>n.kind==='moving-numeric-afterimage'));}
   if(before.state===74){assert.equal(after.afterImageEnabled,0);assert.equal(after.afterImageCounter,before.afterImageCounter);assert.equal(after.attackFinishCounter,before.attackFinishCounter);disabled=true;}
  }assert.equal(enabled&&disabled,true);
 }finally{f.close();}
 let ordinary=0;
 for(const name of ['reflect266','reflect-plain-class266-level0']){const t=v.traces.find(t=>t.case.name===name),f=await resultFixture(api,v,t.case);
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);let observed=false;const actions=Array.from(f.owner.copy(0).actions).slice(0,f.owner.copy(0).actionWrite+1);
   assert.equal(actions.includes(205),false,name+' source0x106 is262');assert.equal(actions.includes(73),false,name+' no262 maximum-level prefix');assert.ok(actions.includes(9),name+' actual ordinary approach');
   for(let i=0;i<300;i++){const b=f.owner.copy(0);if(b.state!==9){f.step();continue;}
    const before=f.owner.copyPlayback(),old=new Set(before.nodes.map(n=>n.id));f.owner.stepPlayback(ctx);const after=f.owner.copyPlayback(),puffs=after.nodes.filter(n=>!old.has(n.id)&&n.kind==='puff');
    assert.equal(puffs.length,0,name+' ordinary approach has no205 smoke');assert.equal(after.seed,before.seed,name+' ordinary approach consumes no205 rand');
    assert.equal(b.afterImageEnabled,0);assert.equal(b.attackFinishCounter,0);observed=true;ordinary++;break;
   }assert.equal(observed,true,name);
  }finally{f.close();}
 }return {distinct_native_fields:true,source266_ordinary_approach_cases:ordinary,source205_applies_to_class262_not266:true};
}
export async function verifyResultAtomic(api,v,{supportsEmptyTargets=false}={}){
 const c=v.traces[0].case,f=await resultFixture(api,v,c);let rejected=0;
 try{f.owner.applyCharacter(11,0,c.resource,[0,0],[70,100,10,10]);const before=JSON.stringify(f.owner.copyState()),classes=supportsEmptyTargets?[]:api.LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.classes.filter(n=>n!==72&&n!==73&&n!==113);
  for(const category of classes)for(const variant of[1,2,3])for(const mask of[0x2000,0x4000,0x8000]){
   const raw=Uint8Array.from('M|SKL|'+[category*100+c.level,4,variant,0,0,mask|0x201,12,11,255].map(n=>n.toString(16).toUpperCase()+'|').join(''),ch=>ch.charCodeAt(0)),command=api.decodeLegacyGameBattleMotion(raw).commands[0],r=f.owner.queuePhysicalFamily(command,1,0,0);
   assert.equal(r.reason,'physical-family-empty-after-self-runtime-unobserved');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;
  }
  f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
 const files=v.files.map(row=>{if(row.path!=='Bin/GraphicInfo.bin')return row;const bytes=Buffer.from(row.bytesHex,'hex'),kept=[];for(let at=0;at<bytes.length;at+=40)if(bytes.readUInt32LE(at+36)!==243751)kept.push(bytes.subarray(at,at+40));return {...row,bytesHex:Buffer.concat(kept).toString('hex')};});
 const h=await resultFixture(api,{...v,files},v.traces.find(t=>t.case.name==='heal').case);
 try{const before=JSON.stringify(h.owner.copyState());assert.throws(()=>h.owner.queuePhysicalFamily(h.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(h.owner.copyState()),before);}finally{h.close();}
 return {positive_self_only_rejections:rejected,capacity_rejections:1,missing_heal_glyph_rejections:1};
}
export async function verifyResultLifetime(api,v){
 const c=v.traces.find(t=>t.case.name==='heal').case,f=await resultFixture(api,v,c);let child;
 try{f.owner.queuePhysicalFamily(f.command,1,0,0);
  for(let i=0;i<300&&!child;i++){f.step();child=f.owner.copyPlayback().nodes.find(n=>n.kind==='physical-result-charge'&&!n.deleted);}
  assert.ok(child);f.owner.remove(0);f.owner.remove(10);f.owner.applyCharacter(10,0,c.resource,[0,0],[70,100,10,10]);
  for(let i=0;i<12;i++)f.owner.stepPlayback(ctx);
  assert.equal(f.owner.copy(10).skillStatus,0);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.id===child.id),false);return {removed_parent_and_reused_slot_do_not_complete_new_body:true};
 }finally{f.close();}
}
export async function verifyResultManagers(api,v){
 const names=['reflect','heal','skip','reflect-guard','heal-guard','skip-guard','reflect-MP','heal-MP','skip-MP','reflect266','reflect-RID','heal84','reflect84','priority-6001','priority-e001','reflect-then-plain','reflect-guard-followup','reflect-KO','reflect-scatter'];
 const results=[];let rounds=0,exits=0;
 for(const name of names){const trace=v.traces.find(t=>t.case.name===name),c=trace.case,f=await resultFixture(api,v,c,{commands:true});let recoveredAt=0,stoppedAt=0,finishedAt=0;
  try{f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=1;i<=9000;i++){
    const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);
    for(const r of[out.manager,...out.commands])if(r.wait?.recovered?.length){assert.equal(recoveredAt,0,name);assert.equal(r.wait.counter,0);recoveredAt=i;}
    if(out.body.stopRequested)stoppedAt=i;
    if(out.nextSubstate===7){assert.ok(stoppedAt>0);assert.equal(i,stoppedAt+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finishedAt=i;break;}
    if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(f.owner.copyState().activeMask,0);rounds++;finishedAt=i;break;}
    f.owner.advanceBackground();
   }
   assert.ok(finishedAt,name);assert.equal(!!stoppedAt,trace.stopped,name);
   for(const expected of trace.final.bodies)assert.deepEqual(Array.from(f.owner.copyState().bodies.bodies[expected.slot].vitals),expected.vitals,name+' slot'+expected.slot);
   assert.equal(recoveredAt,0,name);
   results.push({name,recoveredAt,stoppedAt,finishedAt});
  }finally{f.close();}
 }
 return {managerCases:results.length,rounds,exits,recoveries:results.filter(r=>r.recoveredAt).length,results};
}

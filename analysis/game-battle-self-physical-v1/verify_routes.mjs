/** Real saved-self/216 ownership,without injected callbacks or readiness. */
import assert from 'node:assert/strict';
import {selfPhysicalFixture} from './fixture.mjs';
import {directSelfFlight,guardedSelfFlight,guardedSelfHP,selfPhysicalMotion} from './reference.mjs';
const ctx=Object.freeze({mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false});
const find=(v,name)=>{const t=v.traces.find(t=>t.case.name===name);assert.ok(t,name);return t;};
export async function verifySelfPhysicalCallbacks(api,v){
 const cases=[];
 for(const[name,hp,style,primary]of[
  ['self-damage',58,6,null],['self-heal',82,5,null],['suppress-level0-self',70,0,null],['skip-level0-self',70,0,null],['heal-suppress-level0-self',82,5,null],
  ['immune-level0-self',58,6,null],['no-hit-bit-level0-self',58,6,null],['zero-level0-self',70,6,null],['heal-zero-level0-self',70,5,null],
  ['primary400-level0-self',58,6,0x1ae12],['primary-priority-level0-self',58,6,110000],['ordinary-level9-self',58,6,0x1adbe],
  ['heal-message-level0-self',82,5,null],['heal-zero-message-level0-self',70,0,null],['damage-message-level0-self',58,0,null],['last-self-only',65,6,null],
 ]){
  const t=find(v,name),f=await selfPhysicalFixture(api,v,t.case);let observed=false;const resources=new Set(),digits=new Set();
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,t.case.local,0).kind,'strike-queued');
   for(let i=0;i<t.states.length;i++){
    const before=f.owner.copy(0),old=new Set(f.owner.copyPlayback().nodes.map(n=>n.id));f.step();
    if(before.state===216){assert.equal(observed,false);observed=true;assert.equal(f.owner.copy(0).vitals[0],hp,name);assert.equal(f.owner.copy(0).tupleRead,before.tupleRead+1+(t.case.hits.at(-1)[2]&0x800000?3:0)+1,name+' owns two tuples and optional RID');
     for(const n of f.owner.copyPlayback().nodes.filter(n=>!old.has(n.id))){if(n.kind==='impact')resources.add(n.resourceId);if(n.kind==='damage-digit')digits.add(v.geometry.find(g=>g.index===n.animation.graphicIndex)?.resourceId);}
    }
   }
   assert.equal(observed,true,name);assert.deepEqual(Array.from(f.owner.copy(0).vitals),[hp,100,6,10],name);assert.equal(f.owner.copy(10).vitals[0],63,name+' ordinary foreign result remains separate');
   if(style)assert.ok([...digits].length&&[...digits].every(n=>n>=243700+style*10-3&&n<=243700+style*10+9),name+' number style');else assert.equal(digits.size,0,name+' source message/suppress/skip');
   if(primary!==null)assert.ok(resources.has(primary),name+' primary effect');if(name==='primary400-level0-self')assert.ok(resources.has(0x1adbe),name+' unconditional400 pre-effect');
   cases.push({name,hp,style,observed216:observed});
  }finally{f.close();}
 }return {callbackCases:cases.length,cases,native108_does_not_skip216:true,native_nonzero_heal_message_bit_still_numbers:true,last_self_record_only:true};
}
export async function verifySelfPhysicalMetadata(api,v){
 let cases=0;
 for(const name of['RID-level0-self','heal-RID-level0-self','suppress-RID-level0-self','composite-RID-level0-self','self-RID-last-foreign-tail']){
  const t=find(v,name),f=await selfPhysicalFixture(api,v,t.case);
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++)f.step();
   const expected=t.final.bodies.find(b=>b.slot===0),actual=f.owner.copy(0),foreign=t.case.hits.filter(h=>h[1]!==0&&(h[2]&0x800000)).at(-1);assert.equal(actual.resourceId,expected.resourceId,name);assert.equal(actual.resourceId,foreign[4][1],name+' last foreign RID tail');if(name!=='self-RID-last-foreign-tail')assert.notEqual(actual.resourceId,t.case.hits.find(h=>h[1]===0&&h[2]&0x800000)[4][1],name+' self second RID word is discarded');
   const nodes=f.owner.copyPlayback().nodes,parent=nodes.find(n=>n.kind==='body'&&n.slot===0);assert.ok(nodes.some(n=>n.kind==='rider'&&n.parentId===parent.id),name);assert.ok(nodes.some(n=>n.kind==='attachment'&&n.parentId===parent.id),name);cases++;
  }finally{f.close();}
 }return {RIDCases:cases,saved_first_self_RID_and_last_foreign_tail:true};
}
const without=(v,predicate)=>({...v,files:v.files.map(r=>{if(r.path!=='Bin/GraphicInfo.bin')return r;const b=Buffer.from(r.bytesHex,'hex'),rows=[];for(let i=0;i<b.length;i+=40)if(!predicate(b.readUInt32LE(i+36)))rows.push(b.subarray(i,i+40));return {...r,bytesHex:Buffer.concat(rows).toString('hex')};})});
export async function verifySelfPhysicalAtomic(api,v){
 const t=find(v,'self-damage'),f=await selfPhysicalFixture(api,v,t.case);let rejections=0;
 try{
  const before=JSON.stringify(f.owner.copyState());
  for(const guard of[null,11]){
   const h=[0,0,0x800001|(guard===null?0:512),9,[100050,100040,100041],...(guard===null?[]:[guard])],c={...t.case,hits:[[0,10,1,7],h]};if(guard!==null)f.owner.applyCharacter(11,0,t.case.resource,[0,0],[70,100,10,10]);const saved=JSON.stringify(f.owner.copyState());
   const r=f.owner.queuePhysicalFamily(api.decodeLegacyGameBattleMotion(selfPhysicalMotion(c)).commands[0],1,0,0);assert.equal(r.reason,'physical-family-self-RID-prior-context');assert.equal(JSON.stringify(f.owner.copyState()),saved);rejections++;
  }
  f.owner.appendActions(0,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
  assert.notEqual(JSON.stringify(f.owner.copyState()),before);
 }finally{f.close();}
 const missing=await selfPhysicalFixture(api,without(v,id=>id===243761),t.case);
 try{const before=JSON.stringify(missing.owner.copyState());assert.throws(()=>missing.owner.queuePhysicalFamily(missing.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(missing.owner.copyState()),before);}finally{missing.close();}
 let unused=0;
 for(const[name,predicate]of[['skip-level0-self',id=>id>=243748&&id<=243759||id===0x57b6],['heal-zero-message-level0-self',id=>id>=243748&&id<=243759],['ignored-self-scalar-class0-v1',id=>id===0x5748]]){
  const t=find(v,name),h=await selfPhysicalFixture(api,without(v,predicate),t.case);
  try{assert.equal(h.owner.queuePhysicalFamily(h.command,1,0,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++)h.step();unused++;}finally{h.close();}
 }return {undefined_self_RID_context_rejections:rejections,capacity_atomic:1,missing_actual_glyph_atomic:1,unused_graphics_not_required:unused};
}
export async function verifySelfPhysicalManagers(api,v,{sourceGuardReturn=false,sourceSelfCatch=false}={}){
 const names=['self-damage','self-heal','suppress-level0-self','skip-level0-self','heal-suppress-level0-self','immune-level0-self','RID-level0-self','composite-RID-level0-self','last-self-only','self-guard','self-guard-heal','self-guard-alias-caster','scatter-level0-self'];const cases=[];let rounds=0,exits=0,recoveries=0;
 for(const name of names){const t=find(v,name),c=t.case,f=await selfPhysicalFixture(api,v,c,{commands:true}),guard=sourceGuardReturn?guardedSelfFlight(c):null;
  const direct=sourceSelfCatch?directSelfFlight(c):null,result=direct?.alias?direct:guard;
  let recoveredAt=0,finishedAt=0,stoppedAt=0,lastCounter=0,waitCalls=0,repositionCalls=0,recoveryWaitCalls=0;
  try{f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});const mask=f.command.dependencyMask,slots=Array.from({length:22},(_,i)=>i).filter(i=>mask&(1<<i));
   for(let i=1;i<=9000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);
    for(const r of[out.manager,...out.commands])if(r.wait){waitCalls++;if(r.wait.recovered?.length){assert.equal(recoveredAt,0,name);assert.equal(lastCounter,7200,name);assert.equal(r.wait.counter,0,name);assert.equal(waitCalls,7201+repositionCalls,name+' busy calls plus position-only waits');recoveryWaitCalls=waitCalls;recoveredAt=i;assert.deepEqual(Array.from(r.wait.recovered),slots,name+' complete dependency mask');}else if(r.wait.repositioned!==null){repositionCalls++;assert.equal(r.wait.counter,lastCounter,name);}else if(!r.wait.ready)assert.equal(r.wait.counter,lastCounter+1,name);lastCounter=r.wait.counter;}
    if(out.body.stopRequested)stoppedAt=i;if(out.nextSubstate===7){exits++;finishedAt=i;break;}if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(f.owner.copyState().activeMask,0);rounds++;finishedAt=i;break;}f.owner.advanceBackground();
   }
   assert.ok(finishedAt,name);assert.equal(!!stoppedAt,t.stopped,name);assert.equal(!!recoveredAt,!result&&!t.bodySettled&&!t.stopped,name);if(recoveredAt)recoveries++;
   for(const expected of t.final.bodies){
    const vitals=expected.slot===result?.slot?[guardedSelfHP(expected.vitals,result),...expected.vitals.slice(1)]:expected.vitals;
    assert.deepEqual(Array.from(f.owner.copyState().bodies.bodies[expected.slot].vitals),vitals,name+' slot'+expected.slot);
   }
   cases.push({name,recoveredAt,recoveryWaitCalls,repositionCalls,stoppedAt,finishedAt});
  }finally{f.close();}
 }return {managerCases:cases.length,rounds,exits,recoveries,cases,guard_round_recovery_is_not_natural_hit_completion:true};
}

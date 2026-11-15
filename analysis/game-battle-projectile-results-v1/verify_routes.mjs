/** Real positive-result callbacks and manager ownership,without injected states/readiness. */
import assert from 'node:assert/strict';
import {positiveResultFixture,positiveResultContext as ctx} from './fixture.mjs';
const find=(v,name)=>{const t=v.traces.find(t=>t.case.name===name);assert.ok(t,name);return t;};
export async function verifyPositiveResultCallbacks(api,v){
 let cases=0;const glyphs=new Map(v.geometry.map(r=>[r.index,r.resourceId]));
 for(const variant of[1,2,3])for(const[label,hp,resource,style,category]of[
  ['suppress',70,0x1ae1d,0,0],['heal',82,0x1ae25,5,0],['skip',70,0x1ae2d,0,0],['heal-suppress',82,0x1ae25,5,0],
  ['heal-class6',82,0x1ae25,5,6],['suppress-class6',70,0x1ae1d,0,6],['skip-class6',70,0x1ae2d,0,6],
  ['extended-heal-suppress',variant===2?58:82,0,variant===2?6:5,0],['extended-all',variant===2?58:70,0,variant===2?6:0,0],
 ]){
  const name=label+'-variant'+variant,t=find(v,name),f=await positiveResultFixture(api,v,t.case);let charge=false;const digits=new Set();
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');
   for(let i=0;i<t.states.length;i++){f.step();const nodes=f.owner.copyPlayback().nodes;
    for(const n of nodes){if(n.kind==='physical-result-charge'){assert.equal(n.resourceId,resource,name);assert.equal(n.parentId,nodes.find(n=>n.kind==='body'&&n.slot===10).id,name);charge=true;}if(n.kind==='damage-digit')digits.add(glyphs.get(n.animation.graphicIndex));}
   }
   assert.equal(t.case.category,category);assert.deepEqual(Array.from(f.owner.copy(10).vitals),[hp,100,10,10],name);assert.deepEqual(Array.from(f.owner.copy(0).vitals),[70,100,6,10],name);assert.equal(charge,!!resource,name);
   if(style)assert.deepEqual([...digits].sort((a,b)=>a-b),[243700+style*10+1,243700+style*10+2],name);else assert.equal(digits.size,0,name);
   cases++;
  }finally{f.close();}
 }return {callbackCases:cases,positive_class6_uses_target_HP:true,composite_heal_number_priority:true,single_and_multi_extended_masks_distinct:true};
}
export async function verifyPositiveResultMetadata(api,v){
 let cases=0;
 for(const variant of[1,2,3])for(const[label,recipient,hp]of[['suppress-RID',0,70],['heal-RID',10,79],['composite-RID',0,79]]){
  const name=label+'-variant'+variant,t=find(v,name),f=await positiveResultFixture(api,v,t.case);
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++)f.step();
   assert.equal(f.owner.copy(recipient).resourceId,100041,name);assert.equal(f.owner.copy(recipient===0?10:0).resourceId,100090,name);assert.equal(f.owner.copy(10).vitals[0],hp,name);assert.equal(f.owner.copy(0).vitals[0],70,name);
   const nodes=f.owner.copyPlayback().nodes,parent=nodes.find(n=>n.kind==='body'&&n.slot===recipient);assert.ok(nodes.some(n=>n.kind==='rider'&&n.parentId===parent.id),name);assert.ok(nodes.some(n=>n.kind==='attachment'&&n.parentId===parent.id),name);cases++;
  }finally{f.close();}
 }return {RIDCases:cases,metadata_targets_named_principal_not_anonymous_projectile:true};
}
export async function verifyPositiveResultAtomic(api,v){
 const t=find(v,'heal-suppress-variant1'),f=await positiveResultFixture(api,v,t.case);
 try{f.owner.appendActions(10,1,Array(199).fill(0));const before=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),before);}finally{f.close();}
 const without=predicate=>({...v,files:v.files.map(r=>{if(r.path!=='Bin/GraphicInfo.bin')return r;const bytes=Buffer.from(r.bytesHex,'hex'),rows=[];for(let i=0;i<bytes.length;i+=40)if(!predicate(bytes.readUInt32LE(i+36)))rows.push(bytes.subarray(i,i+40));return {...r,bytesHex:Buffer.concat(rows).toString('hex')};})});
 // This fixture builder executes in the host;the generated API still receives only explicit byte ports.
 const h=await positiveResultFixture(api,without(id=>id===243751),t.case);
 try{const before=JSON.stringify(h.owner.copyState());assert.throws(()=>h.owner.queuePhysicalFamily(h.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(h.owner.copyState()),before);}finally{h.close();}
 let unused=0;
 for(const name of['suppress-variant1','skip-variant2','skip-variant3']){const t=find(v,name),h=await positiveResultFixture(api,without(id=>id>=243748&&id<=243769),t.case);
  try{assert.equal(h.owner.queuePhysicalFamily(h.command,1,0,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++)h.step();assert.equal(h.owner.copy(10).vitals[0],70);unused++;}finally{h.close();}
 }return {capacity_atomic:1,missing_actual_healing_glyph_atomic:1,unused_number_glyphs_not_required:unused};
}
export async function verifyPositiveResultLifetime(api,v){
 const t=find(v,'heal-variant1'),f=await positiveResultFixture(api,v,t.case);let child;
 try{f.owner.queuePhysicalFamily(f.command,1,0,0);for(let i=0;i<300&&!child;i++){f.step();child=f.owner.copyPlayback().nodes.find(n=>n.kind==='physical-result-charge'&&!n.deleted);}assert.ok(child);
  f.owner.remove(10);f.owner.applyCharacter(10,0,t.case.resource,[0,0],[70,100,10,10]);for(let i=0;i<14;i++)f.owner.stepPlayback(ctx);
  assert.equal(f.owner.copy(10).skillStatus,0);assert.equal(f.owner.copy(10).vitals[0],70);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.id===child.id),false);return {old_charge_cannot_complete_replacement_target:true};
 }finally{f.close();}
}
export async function verifyPositiveResultManagers(api,v){
 const names=[];for(const variant of[1,2,3])for(const label of['suppress','heal','skip','heal-suppress','suppress-RID','heal-class6','local-scatter','repeat-heal','self73-ignored200'])names.push(label+'-variant'+variant);
 let rounds=0,exits=0,recoveries=0;const cases=[];
 for(const name of names){const t=find(v,name),c=t.case,f=await positiveResultFixture(api,v,c,{commands:true});let recoveredAt=0,stoppedAt=0,finishedAt=0,recoveredSlots=[];
  try{f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=1;i<=9000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);
    for(const r of[out.manager,...out.commands])if(r.wait?.recovered?.length){assert.equal(recoveredAt,0,name);assert.equal(r.wait.counter,0);recoveredAt=i;recoveredSlots=Array.from(r.wait.recovered);assert.deepEqual(recoveredSlots,[...new Set(c.hits.flatMap(h=>h.slice(0,2)))].sort((a,b)=>a-b),name+' dependency mask recovery');}
    if(out.body.stopRequested)stoppedAt=i;
    if(out.nextSubstate===7){assert.equal(i,stoppedAt+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finishedAt=i;break;}
    if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(f.owner.copyState().activeMask,0);rounds++;finishedAt=i;break;}f.owner.advanceBackground();
   }
   assert.ok(finishedAt,name);assert.equal(!!stoppedAt,t.stopped,name);const expectedRecovery=!t.bodySettled&&!t.stopped;assert.equal(!!recoveredAt,expectedRecovery,name);if(expectedRecovery){assert.equal(recoveredAt,7203,name);recoveries++;}
   for(const expected of t.final.bodies)assert.deepEqual(Array.from(f.owner.copyState().bodies.bodies[expected.slot].vitals),expected.vitals,name+' slot'+expected.slot);cases.push({name,recoveredAt,recoveredSlots,stoppedAt,finishedAt});
  }finally{f.close();}
 }return {managerCases:cases.length,rounds,exits,recoveries,cases};
}

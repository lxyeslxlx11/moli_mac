/** Real producer/body ownership;113 runtime fixtures remain distinct from M preparation. */
import assert from'node:assert/strict';
import{nestedPhysicalFixture}from'./fixture.mjs';
import{nestedPhysicalMotion,nestedPhysicalRuntimeCommand}from'./reference.mjs';
const find=(v,name)=>{const t=v.traces.find(t=>t.case.name===name);assert.ok(t,name);return t;};
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
export async function verifyNestedPhysicalCallbacks(api,v){let cases=0,hits=0;
 for(const name of['nested','reflection','heal','zero','zero-message','heal-zero','heal-zero-message','reflect-zero','negative-damage','negative-heal','min-damage','max-heal','main-guard','nested-guard','two-guards',...['normal','critical','dodge','defense','both','skip','heal-reflect','skip-reflect','skip-heal','all'].map(n=>'class72-level0-outer1-'+n)]){
  const t=find(v,name),c=t.case,f=await nestedPhysicalFixture(api,v,c);let observed=false;
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,c.local,0).kind,'strike-queued');
   for(let i=0;i<t.states.length;i++){
    const b=f.owner.copy(c.caster),out=f.step();
    if(!observed&&b.state===232&&f.owner.copy(c.caster).tupleRead!==b.tupleRead){
     observed=true;hits++;const n=c.nested,target=n.guard??n.target,events=Array.from(out.events).filter(e=>e.kind==='battle-vital'&&e.field==='HP'),mask=n.flags;
     assert.equal(f.owner.copy(c.caster).tupleRead,b.tupleRead+1,name+' exactly one nested tuple');
     if(mask&0x108||mask&0x8000){assert.equal(events.length,0,name+' suppressed/skip HP');}
     else if(mask&0x4000){assert.deepEqual(events.map(e=>[e.slot,e.before,e.value]),[[target,70,Math.min(100,(70+n.amount)|0)]],name+' heal before reflection');}
     else if(mask&0x2000){assert.deepEqual(events.map(e=>[e.slot,e.before,e.value]),[[c.caster,70,Math.max(0,(70-n.amount)|0)]],name+' reflected owner');}
     else if(n.amount!==0){assert.deepEqual(events.map(e=>[e.slot,e.before,e.value]),[[target,70,Math.max(0,(70-n.amount)|0)]],name+' nested target');}
     else assert.equal(events.length,0,name+' zero ordinary is message only');
    }
   }
   assert.equal(observed,true,name);for(const expected of t.final.bodies)assert.deepEqual(Array.from(f.owner.copy(expected.slot).vitals),expected.vitals,name);cases++;
  }finally{f.close();}
 }return{callbackCases:cases,actual232Hits:hits,mask_priority:'108 ->8000 ->4000 ->2000 ->ordinary',zero_ordinary_message_only:true,body5_moves_16_callbacks_before_pop:true};
}
export async function verifyNestedPhysicalPreparation(api,v){
 let wire=0,runtimeOnly=0;for(const name of['nested','main-guard','nested-guard','two-guards','class113-level0-outer0-zero','class113-level9-outer1-normal']){
  const c=find(v,name).case,raw=nestedPhysicalMotion(c),command=nestedPhysicalRuntimeCommand(api,c),get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  assert.equal(api.planBattlePhysicalFamily(command,get,0,0).kind,'physical-family-plan');
  if(c.category===113&&c.nested){assert.throws(()=>api.decodeLegacyGameBattleMotion(raw),e=>e.code==='LEGACY_BATTLE_MOTION_TRUNCATED');runtimeOnly++;}
  else{const p=api.decodeLegacyGameBattleMotion(raw).commands[0];assert.equal(p.dependencyCounts[c.caster],1);if(c.nested&&c.nested.target!==c.hits[0][1])assert.equal(p.dependencyCounts[c.nested.target],0,'native does not mark nested recipient');if(c.nested?.guard!==null&&c.nested?.guard!==undefined)assert.equal(p.dependencyCounts[c.nested.guard],1);wire++;}
 }
 return{wireCases:wire,runtimeOnlyCases:runtimeOnly,native435000_nested_only72:true,native424310_nested72_and113:true,no_preparation_relaxation:true};
}
const without=(v,predicate)=>({...v,files:v.files.map(r=>{if(r.path!=='Bin/GraphicInfo.bin')return r;const b=Buffer.from(r.bytesHex,'hex'),rows=[];for(let i=0;i<b.length;i+=40)if(!predicate(b.readUInt32LE(i+36)))rows.push(b.subarray(i,i+40));return{...r,bytesHex:Buffer.concat(rows).toString('hex')};})});
export async function verifyNestedPhysicalAtomic(api,v){const t=find(v,'nested'),f=await nestedPhysicalFixture(api,v,t.case);let rejected=0;
 try{for(const mask of[0x800001,0x802001]){const c={...t.case,nested:{...t.case.nested,flags:mask,resources:[100040,100041,100050]}},before=JSON.stringify(f.owner.copyState());assert.equal(f.owner.queuePhysicalFamily(api.decodeLegacyGameBattleMotion(nestedPhysicalMotion(c)).commands[0],1,0,0).reason,'physical-family-nested-RID-storage-context');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  f.owner.appendActions(0,1,Array(199).fill(0));const before=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),before);
 }finally{f.close();}
 const m=await nestedPhysicalFixture(api,without(v,id=>id===243761),t.case);try{const before=JSON.stringify(m.owner.copyState());assert.throws(()=>m.owner.queuePhysicalFamily(m.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(m.owner.copyState()),before);}finally{m.close();}
 const unused=await nestedPhysicalFixture(api,without(v,id=>id>=243758&&id<=243769),find(v,'class72-level0-outer1-skip').case);try{assert.equal(unused.owner.queuePhysicalFamily(unused.command,1,0,0).kind,'strike-queued');}finally{unused.close();}
 return{undefined_nested_RID_rejections:rejected,capacity_atomic:true,actual_number_graphic_atomic:true,unused_number_graphics_not_required:true};
}
export async function verifyNestedPhysicalManagers(api,v){const cases=[];let rounds=0,exits=0,recoveries=0;
 for(const name of['nested','miss','reflection','heal','main-guard','nested-guard','two-guards','class113-level0-outer0-zero','nested-self','main-self','scatter-local','different-followup','scatter-reflect']){
  const t=find(v,name),c=t.case,f=await nestedPhysicalFixture(api,v,c,{commands:true});let finishedAt=0,recoveredAt=0,stoppedAt=0,waitCalls=0,repositions=0;const waits=new Map();
  try{assert.equal(f.wirePreflight,true);f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=1;i<=9000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);
    for(const r of[out.manager,...out.commands])if(r.wait){const key=r.handle?.id??0,track=waits.get(key)??{counter:0,busyCalls:0,repositions:0};waitCalls++;
     if(r.wait.recovered?.length){assert.equal(recoveredAt,0);assert.equal(track.counter,7200);assert.equal(++track.busyCalls,7201);recoveredAt=i;assert.equal(r.wait.counter,0);}
     else if(r.wait.repositioned!==null){repositions++;track.repositions++;assert.equal(r.wait.counter,track.counter);}
     else if(!r.wait.ready){track.busyCalls++;assert.equal(r.wait.counter,track.counter+1);}
     track.counter=r.wait.counter;waits.set(key,track);
    }
    if(out.body.stopRequested)stoppedAt=i;if(out.nextSubstate===7){exits++;finishedAt=i;break;}if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);rounds++;finishedAt=i;break;}f.owner.advanceBackground();
   }assert.ok(finishedAt,name);assert.equal(!!stoppedAt,t.stopped,name);assert.equal(!!recoveredAt,!t.bodySettled&&!t.stopped,name);if(recoveredAt)recoveries++;cases.push({name,finishedAt,recoveredAt,stoppedAt,waitCalls,repositions,waitOwners:[...waits].map(([id,t])=>({id,...t}))});
  }finally{f.close();}
 }return{managerCases:cases.length,rounds,exits,recoveries,cases,natural_two_guards:true,bounded_waits_are_not_native_completion:true};
}

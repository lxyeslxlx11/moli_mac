/** Actual class96 callbacks and native queue lifecycle;no injected state/readiness. */
import assert from'node:assert/strict';
import{special96Fixture}from'./fixture.mjs';
import{special96Motion}from'./reference.mjs';
const find=(v,name)=>{const t=v.traces.find(t=>t.case.name===name);assert.ok(t,name);return t;};
export async function verifySpecial96Callbacks(api,v){let cases=0,zeroAssignments=0,boxedRNG=0;
 const names=['KO','ordinary','zero-input','negative','min','max','guard','guard-zero','guard-heal','guard-reflect','guard-RID',...v.traces.filter(t=>t.case.name.startsWith('level0-mask')).map(t=>t.case.name)];
 for(const name of names){const t=find(v,name),c=t.case,f=await special96Fixture(api,v,c),target=c.hits[0][5]??c.hits[0][1];let seen=0;const changes=[],sounds=[];
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,c.local,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++){
   const before=f.owner.copy(c.caster),seed=f.owner.copyPlayback().seed,priorHP=f.owner.copy(target)?.vitals[0],out=f.step();changes.push(...out.events.filter(e=>e.kind==='battle-vital'));sounds.push(...out.events.filter(e=>e.kind==='sound'&&e.slot===c.caster).map(e=>e.value));
   if(before.state===93&&before.counter===16){seen++;zeroAssignments++;assert.equal(f.owner.copy(target).vitals[0],0,name+' original zero constructor,not received amount');assert.deepEqual(Array.from(out.events).filter(e=>e.kind==='battle-vital').map(e=>[e.slot,e.field,e.before,e.value]),[[target,'HP',priorHP,0]],name+' immediate HP assignment');
    if(['KO','ordinary','zero-input'].includes(name)){assert.equal(f.lastCallbackSeed,(Math.imul(seed,0x343fd)+0x269ec3)>>>0,name+' one temporary zero-box rand');boxedRNG++;}
   }
  }assert.equal(seen,1,name);assert.equal(changes.filter(e=>e.field==='MP').length,1,name);assert.equal(changes.filter(e=>e.field==='HP').length,1,name);assert.ok(sounds.indexOf(62)>=0&&sounds.indexOf(62)<sounds.indexOf(210)&&sounds.indexOf(210)<sounds.indexOf(133),name+' 1018/101c/1020 sounds preserve order');cases++;}finally{f.close();}
 }return{callbackCases:cases,zeroAssignments,explicit_zero_box_RNG_checks:boxedRNG,received_amount_and_result_mask_do_not_gate93:true,script_sound_order:[62,210,133]};
}
export async function verifySpecial96Visibility(api,v){let callbacks=0,rendererBranches=0,freezes=0,teleports=0;
 for(const name of['ordinary']){const t=find(v,name),c=t.case,f=await special96Fixture(api,v,c);const seen=new Set();
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,c.local,0).kind,'strike-queued');for(let i=0;i<t.states.length;i++){
   const b=f.owner.copy(c.caster),target=f.owner.copy(10),out=f.step(),now=f.owner.copy(c.caster);if(seen.has(b.state))continue;
   if(b.state===75||b.state===76){const flag=c.alternative?0x100000:0x8000;assert.equal(!!(now.actorFlags&flag),b.state===75);rendererBranches++;if(b.state===75)for(const selector of[0,1]){
    if(c.alternative)assert.throws(()=>f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,selector),e=>e.code==='LEGACY_BATTLE_FRAME_DRAW_STYLE');
    else{const draw=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,selector);assert.equal(draw.submitted.some(n=>n.kind==='body'&&n.slot===0),selector===1);}
   }}else if(b.state===89||b.state===90)assert.equal(!!(now.actorFlags&2),b.state===89);
   else if(b.state===92){let angle=Math.fround(target.angle-180);if(angle<0)angle=Math.fround(angle+360);if(angle>=360)angle=Math.fround(angle-360);assert.deepEqual(Array.from(now.position),Array.from(api.legacyGameBattleMovement(...target.position,angle,50)));assert.equal(now.speed,50);teleports++;}
   else if(b.state===94||b.state===95){assert.equal(f.owner.copy(10).frozen,b.state===95?1:0);freezes++;}
   else if(b.state===80)assert.ok(out.events.some(e=>e.kind==='sound'&&e.value===133&&e.slot===0));
   else continue;seen.add(b.state);callbacks++;
  }assert.deepEqual([...seen].sort((a,b)=>a-b),[75,76,80,89,90,92,94,95]);}finally{f.close();}
 }
 for(const name of['alternative','alternative-guard'])await assert.rejects(()=>special96Fixture(api,v,find(v,name).case),e=>e.code==='LEGACY_BATTLE_SKILL_CONFIGURATION');
 return{configurationRejections:2,visibilityCallbacks:callbacks,rendererBranches,teleports,freezeCallbacks:freezes,alternative_configuration_and_native_alpha_backend_unavailable:true,default_two_selector_filters_verified:true};
}
const without=(v,predicate)=>({...v,files:v.files.map(r=>{if(r.path!=='Bin/GraphicInfo.bin')return r;const b=Buffer.from(r.bytesHex,'hex'),rows=[];for(let i=0;i<b.length;i+=40)if(!predicate(b.readUInt32LE(i+36)))rows.push(b.subarray(i,i+40));return{...r,bytesHex:Buffer.concat(rows).toString('hex')};})});
export async function verifySpecial96Atomic(api,v){const c=find(v,'KO').case;let capacities=0;
 for(const kind of['actions','tuples']){const f=await special96Fixture(api,v,c);try{if(kind==='actions')f.owner.appendActions(10,1,Array(199).fill(0));else for(let i=0;i<199;i++)f.owner.appendTuple(0,[0,0,0]);const before=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),before);capacities++;}finally{f.close();}}
 const missing=await special96Fixture(api,without(v,id=>id===0x5783),c);try{const before=JSON.stringify(missing.owner.copyState());assert.throws(()=>missing.owner.queuePhysicalFamily(missing.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(missing.owner.copyState()),before);}finally{missing.close();}
 const unused=await special96Fixture(api,without(v,id=>id>=243748&&id<=243769),c);try{assert.equal(unused.owner.queuePhysicalFamily(unused.command,1,0,0).kind,'strike-queued');for(let i=0;i<find(v,'KO').states.length;i++)unused.step();}finally{unused.close();}
 return{capacity_atomic:capacities,actual5783_required_before_mutation:true,unused_damage_digits_not_required:true};
}

const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
export async function verifySpecial96Managers(api,v){const cases=[];let rounds=0,exits=0,recoveries=0;
 for(const name of['KO','ordinary','zero-input','guard','guard-zero','guard-heal','guard-reflect','followup','followup-RID','self','self-KO','self-no-KO','guard-alias-caster','guard-alias-target','counter','level0-mask2041']){
  const t=find(v,name),c=t.case,f=await special96Fixture(api,v,c,{commands:true});let finishedAt=0,recoveredAt=0,stoppedAt=0,waitCalls=0,repositions=0;const waits=new Map();
  try{f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
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
 }return{managerCases:cases.length,rounds,exits,recoveries,cases,natural96_guard:true,bounded_waits_are_not_native_completion:true};
}

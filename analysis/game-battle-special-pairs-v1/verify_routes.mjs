import assert from'node:assert/strict';
import{specialPairsFixture}from'./fixture.mjs';
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
export async function verifySpecialPairsCallbacks(api,v){
 const expected={'normal-94-0':[70,58,16],'status-0-0':[70,58,0],'status-1-2001':[58,70,0],'status-2-4001':[70,82,32],'status-3-8001':[70,70,64]};let checked=0,frontFrames=0,frontImpacts=0;
 for(const[name,values]of Object.entries(expected)){
  const t=v.traces.find(t=>t.case.name===name),f=await specialPairsFixture(api,v,t.case);const seen=new Set();
  try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,t.case.local,0).kind,'strike-queued');
   for(let i=0;i<t.states.length;i++){const before=f.owner.copy(0),hp=f.owner.copy(10)?.vitals[0];f.step();if(before.state===96){assert.equal(f.owner.copy(10)?.vitals[0],hp,name+' front animation does not settle HP');frontFrames++;}for(const n of f.owner.copyPlayback().nodes)if(n.kind==='impact'&&n.resourceId===0x1adfa)seen.add(n.id);}
   assert.deepEqual([f.owner.copy(0).vitals[0],f.owner.copy(10).vitals[0],f.owner.copy(10).dynamicFlags&0x3f0],values,name);if(name==='status-1-2001')assert.equal(f.owner.copy(0).dynamicFlags&0x3f0,16,name+' condition follows literal reflection recipient');assert.ok(seen.size>=2,name+' signal and completion impacts');assert.ok(f.events.some(e=>e.kind==='sound'&&e.value===260),name+' source78 sound');frontImpacts+=seen.size;checked++;
  }finally{f.close();}
 }
 for(const[name,resource,facing]of[['normal-257-9',0x1af8c,0],['normal-262-9',0x1af89,1],['mask-262-9-400',0x1ae12,0],['mask-262-9-404',110000,0]]){
  const t=v.traces.find(t=>t.case.name===name),f=await specialPairsFixture(api,v,t.case);let found=false;
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);for(let i=0;i<t.states.length;i++){f.step();for(const n of f.owner.copyPlayback().nodes)if(n.kind==='impact'&&n.resourceId===resource&&n.animation.lastResource===resource){assert.equal(n.animation.lastFacing,facing,name);found=true;}}assert.equal(found,true,name+' source-selected effect');checked++;}finally{f.close();}
 }
 return{callback_cases:checked,front_animation_frames:frontFrames,signal_and_completion_impacts:frontImpacts,condition_HP_and_effect_facing_verified:true};
}
export async function verifySpecialPairsDash(api,v){
 let cases=0;for(const name of ['normal-262-0','normal-262-9']){const t=v.traces.find(t=>t.case.name===name),f=await specialPairsFixture(api,v,t.case);let seen=false;
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);for(let i=0;i<300;i++){const b=f.owner.copy(0);if(b.state!==205){f.step();continue;}const before=f.owner.copyPlayback(),old=new Set(before.nodes.map(n=>n.id)),r=api.createLegacyGameBattleRandom(before.seed),choice=r.next();r.close?.();f.owner.stepPlayback(ctx);const after=f.owner.copyPlayback(),puffs=after.nodes.filter(n=>n.kind==='puff'&&!old.has(n.id));assert.equal(after.seed,(Math.imul(before.seed,214013)+2531011)>>>0);assert.equal(puffs.length,1);assert.equal(puffs[0].resourceId,0x1adb4+(choice&3));assert.deepEqual(Array.from(puffs[0].position),Array.from(f.owner.copy(0).position));assert.equal(puffs[0].parentId,null);assert.equal(b.afterImageEnabled,t.case.level===9?1:0);seen=true;cases++;break;}assert.equal(seen,true,name);}finally{f.close();}
 }return{actual_source205_callbacks:cases,one_rand_per_callback:true,real262_producer:true};
}
export async function verifySpecialPairsRID(api,v){
 let cases=0;for(const k of [94,257,262]){const t=v.traces.find(t=>t.case.name==='guard-stale-fourth-'+k),f=await specialPairsFixture(api,v,t.case);
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);assert.equal(f.owner.copy(0).tuples[7],0x11223344);for(let i=0;i<t.states.length;i++)f.step();assert.equal(f.owner.copy(12).resourceId,100041);assert.equal(f.owner.copy(10).resourceId,t.case.resource);assert.equal(f.owner.copy(0).resourceId,t.case.resource);cases++;}finally{f.close();}
 }return{guard_RID_recipients:cases,old_fourth_word_preserved:true};
}
export async function verifySpecialPairsAtomic(api,v){
 const t=v.traces.find(t=>t.case.name==='normal-257-9'),f=await specialPairsFixture(api,v,t.case);let rejected=0;
 try{const before=JSON.stringify(f.owner.copyState());for(const c of [{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:[25709,4,0,0,99,1,12,255]}]){assert.equal(f.owner.queuePhysicalFamily(c,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);}finally{f.close();}
 const files=v.files.map(row=>{if(row.path!=='Bin/GraphicInfo.bin')return row;const raw=Buffer.from(row.bytesHex,'hex'),kept=[];for(let at=0;at<raw.length;at+=40)if(raw.readUInt32LE(at+36)!==28897)kept.push(raw.subarray(at,at+40));return{...row,bytesHex:Buffer.concat(kept).toString('hex')};}),missing=await specialPairsFixture(api,{...v,files},t.case);
 try{const before=JSON.stringify(missing.owner.copyState());assert.throws(()=>missing.owner.queuePhysicalFamily(missing.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(missing.owner.copyState()),before);}finally{missing.close();}
 return{field_rejections:rejected,capacity_rejections:1,missing_selector2_tile_rejections:1,before_mutation:true};
}
export async function verifySpecialPairsManagers(api,v){
 const names=['normal-94-0','normal-257-9','normal-262-9','guard-94','guard-257','guard-262','status-1-2001','status-2-4001','status-3-8001','guard-stale-fourth-94','guard-stale-fourth-257','guard-stale-fourth-262','self-94','self-257','self-262','guard-alias-caster-94','guard-alias-target-262','mask-262-9-2041'];let rounds=0,exits=0;const results=[];
 for(const name of names){const t=v.traces.find(t=>t.case.name===name),c=t.case,f=await specialPairsFixture(api,v,c,{commands:true});let finished=0,stopped=0;const recoveries=[];
  try{f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});for(let i=1;i<=12000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);for(const r of [out.manager,...out.commands])if(r.wait?.recovered?.length)recoveries.push({call:i,slots:r.wait.recovered,counter:r.wait.counter});if(out.body.stopRequested)stopped=i;if(out.nextSubstate===7){assert.ok(stopped);assert.equal(i,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finished=i;break;}if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(f.owner.copyState().activeMask,0);rounds++;finished=i;break;}f.owner.advanceBackground();}assert.ok(finished,name);assert.equal(!!stopped,t.stopped,name);if(t.bodySettled)assert.equal(recoveries.length,0,name);else if(!t.stopped)assert.ok(recoveries.length>0,name+' source wait recovery');results.push({name,finished,stopped,recoveries});}finally{f.close();}
 }return{manager_cases:results.length,rounds,exits,recovered_rounds:results.filter(r=>r.recoveries.length).length,results};
}

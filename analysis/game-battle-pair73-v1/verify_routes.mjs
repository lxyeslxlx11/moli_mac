import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{pair73Fixture}from'./fixture.mjs';
import{pair73Motion}from'./reference.mjs';
import{sharedMotion}from'../game-battle-shared-storage-v1/fixture.mjs';
import{pair73Digest}from'./projection.mjs';
import{verifyPositiveResultModel}from'../game-battle-projectile-results-v1/verify_model.mjs';
import{positiveResultMotion}from'../game-battle-projectile-results-v1/reference.mjs';
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
export function verifyPair73Protocol(api,v){
 let streams=0,aliases=0;
 for(const row of v.queues){const c=row.case,command=api.decodeLegacyGameBattleMotion(pair73Motion(c)).commands[0],counts=Array(22).fill(0);
  for(const h of c.hits){counts[h[0]]++;counts[h[1]]++;if(h[2]&512)counts[h[5]]++;}
  assert.deepEqual([...command.fields],row.fields);assert.deepEqual([...command.dependencyCounts],counts);assert.equal(command.principalSlot,c.caster);assert.equal(command.classCode,73);
  const p=api.planBattlePhysicalFamily(command,get,0,0);assert.equal(p.kind,'physical-family-plan');assert.equal(pair73Digest(p.rows),row.expected_digest);
  const principal=p.rows.find(r=>r.slot===c.caster);assert.deepEqual([...principal.actions.slice(0,2)],[38,53]);assert.equal(principal.actions.includes(147),false);assert.equal(principal.assignments.mpCost,4);streams++;aliases+=Number(c.caster>=20);
 }return{streams,slot50or51Aliases:aliases,pairPrefix:[38,53],noGeneric147:true,nativePreparationPreserved:true};
}
export async function verifyPair73PositiveRegression(api){
 const old=JSON.parse(readFileSync(new URL('../game-battle-projectile-results-v1/original-vectors.json',import.meta.url))),queues=old.queues.filter(r=>r.input[0]===73),traces=old.traces.filter(t=>t.case.category===73),v={...old,queues,traces,frames:traces.reduce((n,t)=>n+t.states.length,0),rgbaFrames:traces.reduce((n,t)=>n+t.rasters.length,0)};
 const checked=await verifyPositiveResultModel(api,v,{mismatchDirectory:new URL('../../build/analysis/game-battle-pair73-v1/',import.meta.url)});
 for(const row of queues){const[category,level,variant,caster,target,flags]=row.input,c={category,level,variant,caster,cost:4,local:0,hits:[[caster,target,flags,12,...(flags&0x800000?[[100040,100041,100050]]:[])]]},p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(positiveResultMotion(c)).commands[0],get,0,0),r=p.rows.find(r=>r.slot===caster);
  assert.equal(p.pairMode,false);assert.equal(Object.hasOwn(r.assignments,'mpCost'),false);assert.equal(r.actions.includes(53),false);assert.equal(r.actions.includes(147),false);
 }return{...checked,oldVectorsUnchanged:true,positiveVariantsHaveNoPairMPCost:true};
}
export async function verifyPair73Callbacks(api,v){const detail=[];
 for(let level=0;level<10;level++){const trace=v.traces.find(t=>t.case.name==='level-'+level),f=await pair73Fixture(api,v,trace.case),impacts=new Set();
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);let firstMP=0,firstHP=0;
   for(let i=0;i<trace.states.length;i++){f.step();for(const n of f.owner.copyPlayback().nodes)if(n.kind==='impact'){assert.ok(n.resourceId>=0x1adb1&&n.resourceId<=0x1adb3);impacts.add(n.id);}if(!firstMP&&f.owner.copy(0).vitals[2]!==10)firstMP=i+1;if(!firstHP&&f.owner.copy(10).vitals[0]!==70)firstHP=i+1;}
   const events=f.events.filter(e=>e.kind==='battle-vital');assert.equal(events.filter(e=>e.field==='MP').length,1);assert.equal(events.filter(e=>e.field==='HP').length,1);assert.equal(f.owner.copy(0).vitals[2],6);assert.equal(f.owner.copy(10).vitals[0],58);assert.equal(impacts.size,1);assert.ok(firstMP>0&&firstHP>firstMP);detail.push({level,firstMP,firstHP,defaultRandomImpacts:impacts.size});
  }finally{f.close();}
 }return{grades:detail,oneMPCostPerCommand:true,oneDirectHPResult:true,default14RandomResource:true};
}
export async function verifyPair73Boundaries(api,v){const trace=v.traces.find(t=>t.case.name==='RID-followup-guard-0'),f=await pair73Fixture(api,v,trace.case);let refused=0,accessors=0;
 try{const original=f.command,before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);const invalid=[{...original},{...original,attachedRID:1},{...original,fields:original.fields.slice(0,-1)},{...original,fields:[7300,4,0,0,99,1,12,255]}];
  const accessor={index:0,attachedRID:0,get fields(){accessors++;return original.fields;}};invalid.push(accessor);
  for(const command of invalid){assert.equal(f.owner.queuePhysicalFamily(command,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);refused++;}assert.equal(accessors,0);
  assert.equal(api.planBattlePhysicalFamily({...original},get,0,0).reason,'physical-family-lookahead-context');assert.equal(f.owner.queuePhysicalFamily(original,1,0,0).kind,'strike-queued');for(let i=0;i<trace.states.length;i++)f.step();assert.equal(f.owner.copy(10).vitals[0],58);assert.equal(f.owner.copy(12).vitals[0],70);assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),false);
 }finally{f.close();}
 const ordinary=v.traces.find(t=>t.case.name==='level-0'),g=await pair73Fixture(api,v,ordinary.case);
 try{g.owner.appendActions(0,1,Array(199).fill(0));const before=JSON.stringify([g.owner.copyState(),g.owner.copyPlayback()]);assert.throws(()=>g.owner.queuePhysicalFamily(g.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify([g.owner.copyState(),g.owner.copyPlayback()]),before);}finally{g.close();}
 const pending401SelfEffect=api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[40100,4,0,0,0x80000,255])).commands[0];assert.equal(api.planBattlePhysicalFamily(pending401SelfEffect,get,0,0).reason,'physical-family-category');
 return{atomicRefusals:refused,accessorsInvoked:accessors,capacityAtomic:true,rawTailOwnedByDecoder:true,guardWordNotNormalized:true,boundedRIDFollowupWait:true,attachedRIDStillUnavailable:true,pending401SelfEffectStillUnavailable:true};
}
export async function verifyPair73Managers(api,v){const names=[...Array.from({length:10},(_,i)=>'level-'+i),'guard-9','guard-RID-9','guard-reflect-9','guard-heal-9','guard-skip-9','suffix-9','counter-9','self-0','guard-alias-caster-0','no-final-signal-0','RID-followup-guard-0','mask-9-2041'],results=[];let rounds=0,exits=0;
 for(const name of names){const trace=v.traces.find(t=>t.case.name===name),f=await pair73Fixture(api,v,trace.case,{commands:true});let finished=0,stopped=0;const recoveries=[];
  try{f.owner.load(f.raw,{...ctx,substate:5});for(let i=1;i<=12000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:trace.case.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);for(const r of[out.manager,...out.commands])if(r.wait?.recovered?.length)recoveries.push({call:i,slots:[...r.wait.recovered],counter:r.wait.counter});if(out.body.stopRequested)stopped=i;if(out.nextSubstate===7){assert.equal(i,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finished=i;break;}if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);rounds++;finished=i;break;}f.owner.advanceBackground();}assert.ok(finished,name);assert.equal(!!stopped,trace.stopped,name);results.push({name,finished,stopped,recoveries});}finally{f.close();}
 }return{managerCases:results.length,rounds,exits,recoveredRounds:results.filter(r=>r.recoveries.length).length,results};
}

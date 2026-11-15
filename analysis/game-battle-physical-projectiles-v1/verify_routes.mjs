/** Real resource owners and manager callbacks; no injected body/readiness state. */
import assert from 'node:assert/strict';
import {projectileFixture,projectileContext as ctx} from './fixture.mjs';
import {projectileMotion} from './reference.mjs';
const sample=(v,category=0,variant=1)=>v.traces.find(t=>t.case.category===category&&t.case.variant===variant&&t.case.name.startsWith('class')).case;
const command=(api,c)=>api.decodeLegacyGameBattleMotion(projectileMotion(c)).commands[0];
export function verifyProjectileQueues(api,v){
 let checked=0;
 for(const category of[73,94,95,96,105,110])for(const variant of[1,2,3]){
  const c=sample(v,category,variant),p=api.planBattlePhysicalFamily(command(api,c),()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),0,0),own=p.rows.find(r=>r.slot===0);
  assert.equal(p.kind,'physical-family-plan');
  const flight=variant===3?[18]:variant===2?[15,41]:[15];
  assert.deepEqual(Array.from(own.actions),category===73?[24,...flight,...(variant===2?[23]:[])]:[38,...([94,96].includes(category)?[]:[147]),53,24,...flight,72,...(variant===2?[23]:[])]);
  assert.equal(Object.hasOwn(own.assignments,'mpCost'),category!==73);assert.equal(own.tuples.length,category===73?2:3);
  if(category===105){assert.equal(own.assignments.afterImageEnabled,1);assert.equal(own.assignments.attackFinishCounter,undefined);}
  if(category===95)assert.equal(p.rows.some(r=>r.actions.includes(74)),false);
  checked++;
 }
 // A self73 flag200 is a flag only; an extra scalar would corrupt this wire boundary.
 for(const variant of[1,2,3]){
  const c={...sample(v,73,variant),hits:[[0,0,0x201,12]]},p=api.planBattlePhysicalFamily(command(api,c),()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),0,0);
  assert.equal(p.kind,'physical-family-plan');assert.equal(p.hits[0].guard,null);assert.equal(p.rows.find(r=>r.slot===0).tuples[0][1],0x201);checked++;
 }
 assert.equal(api.LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.completeSKL,false);return {queueContracts:checked};
}
export async function verifyProjectileCallbacks(api,v){
 let cases=0,arrows=0,multis=0;
 for(const category of[0,6,73,84,85,87,95,105,110,257,259,260,262,266])for(const variant of[1,2,3]){
  const c=sample(v,category,variant),f=await projectileFixture(api,v,c);let settled=false,sawArrow=false,sawMulti=false,sawCooldown=false;
  try{
   assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');
   assert.equal(f.events.length,0);assert.equal(f.owner.copy(10).vitals[0],70);
   for(let i=0;i<3000;i++){
    const out=f.step();assert.equal(out.results.some(r=>r.result.endsWith('unavailable')),false);
    const nodes=f.owner.copyPlayback().nodes;
    sawArrow||=nodes.some(n=>n.kind==='physical-arrow'&&n.resourceId<100000);
    sawMulti||=nodes.some(n=>n.physical?.role==='multi');sawCooldown||=nodes.some(n=>n.physical?.cooldown>0);
    if(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy)&&!nodes.some(n=>n.kind==='physical-arrow'||n.physical)){settled=true;break;}
   }
   assert.equal(settled,true,c.name);assert.equal(f.stopped,false);assert.equal(sawCooldown,true);
   assert.equal(sawMulti,variant===2);assert.equal(sawArrow,variant!==2);arrows+=+sawArrow;multis+=+sawMulti;
   assert.deepEqual(Array.from(f.owner.copy(10).vitals),[58,100,10,10]);assert.deepEqual(Array.from(f.owner.copy(11).vitals),[63,100,10,10]);
   assert.equal(f.owner.copy(0).vitals[2],category===73?10:7);
   assert.equal(f.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,2);cases++;
  }finally{f.close();}
 }
 return {callbackCases:cases,singleArrowCases:arrows,multiTargetCases:multis};
}
export async function verifyProjectileManagers(api,v){
 const rows=[];
 for(const variant of[1,2,3])for(const kind of['normal','related','self73','repeat-target','local-exit']){
  const ordinary=sample(v,kind==='related'||kind==='self73'?73:0,variant),c=kind==='self73'?{...ordinary,hits:[[0,0,1,12]]}:kind==='repeat-target'?v.traces.find(t=>t.case.name==='repeat-variant'+variant).case:kind==='local-exit'?{...ordinary,local:10,hits:[[0,10,0x41,12]]}:ordinary;
  const needsRecovery=kind==='self73'||kind==='repeat-target';
  const f=await projectileFixture(api,v,c,{commands:true});let finished=false,stopped=0,recoveredAt=0,recoveries=0;
  try{
   f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=1;i<=7400;i++){
    const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false);
    for(const r of out.commands)if(r.wait?.recovered?.length){assert.equal(needsRecovery,true);assert.deepEqual(Array.from(r.wait.recovered),kind==='self73'?[0]:[0,10]);assert.equal(r.wait.counter,0);recoveredAt=i;recoveries++;}
    if(out.body.stopRequested)stopped=i;
    if(out.nextSubstate===7){assert.equal(kind,'local-exit');assert.equal(i,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);
     assert.equal(f.owner.prepareExit({...ctx,substate:7,localSlot:c.local}).kind,'battle-exit-cleanup');f.owner.markExitDeleted();finished=true;break;}
    if(out.manager.kind==='battle-round-drained'){
     assert.notEqual(kind,'local-exit');assert.equal(out.manager.roundCounter,1);assert.equal(out.manager.nextSubstate,2);
     assert.equal(recoveries,needsRecovery?1:0);if(needsRecovery)assert.equal(recoveredAt,7203);
     if(kind==='repeat-target')assert.equal(f.owner.copyState().bodies.bodies[10].vitals[0],54);
     assert.equal(f.owner.copyState().activeMask,0);finished=true;break;
    }
    f.owner.advanceBackground();
   }
   assert.equal(finished,true,kind+'/'+variant);rows.push({kind,variant,recoveredAt,recoveries});
  }finally{f.close();}
 }
 return {managerCases:rows.length,selfRecoveryCases:rows.filter(r=>r.kind==='self73'&&r.recoveries).length,repeatedTargetRecoveryCases:rows.filter(r=>r.kind==='repeat-target'&&r.recoveries).length,rows};
}
export async function verifyProjectileAtomic(api,v){
 const c=sample(v),f=await projectileFixture(api,v,c);let rejected=0,reads=0;
 try{
  const before=JSON.stringify(f.owner.copyState());
  const specs=[];
  for(const variant of[1,2,3])specs.push([{...c,category:258,variant},'physical-family-emission-overlay-consumer-pending']);
  for(const category of[259,266])specs.push([{...c,category,level:9},'physical-family-tiled-producer-pending']);
  specs.push([{...c,category:266,variant:2,hits:[[0,0,1,12]]},'physical-family-empty-after-self-runtime-unobserved']);
  for(const [value,reason]of specs){assert.equal(f.owner.queuePhysicalFamily(command(api,value),1,0,0).reason,reason);assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  const malformed=[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},
   {...f.command,fields:Object.defineProperty([...f.command.fields],3,{get(){reads++;return 0;}})},
   command(api,{...c,hits:[[0,0,0x201,12]] .map(h=>Object.assign(h,{guard:0}))}),command(api,{...c,hits:[[0,10,0x1011,12]]})];
  for(const value of malformed){assert.equal(f.owner.queuePhysicalFamily(value,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  assert.equal(reads,0);f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());
  assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
 return {atomicRejections:rejected,capacityRejections:1,getterReads:reads};
}

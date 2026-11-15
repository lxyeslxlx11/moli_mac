import test from'node:test';
import*as api from'../index.mjs';
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{appendPhysicalGuardRelease}from'../legacy-game-battle-physical-guard-plan.mjs';
import{verifySelfGuardModel}from'../../analysis/game-legacy-battle-self-guard-v1/model.mjs';
import{cases,runSelfGuard}from'../../analysis/game-legacy-battle-self-guard-v1/fixture.mjs';
import{guardFixture}from'../../analysis/game-battle-physical-guard-v1/fixture.mjs';
import{guardMotion}from'../../analysis/game-battle-physical-guard-v1/reference.mjs';
test('self guard aliases preserve independent native queues,callbacks and full RGBA',async()=>console.log('self-guard-independent '+JSON.stringify(await verifySelfGuardModel(api))));
test('guard release preserves every original E000,zero,knockout and next-target branch',()=>{
 const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-battle-self-guard-v1/original-vectors.json',import.meta.url)));
 for(const v of vectors.releases){const[flags,amount,next]=v.input,r={actions:[],tuples:[],assignments:{}};
  appendPhysicalGuardRelease(0,{flags,amount},next,{row:s=>{assert.equal(s,0);return r;},act:(s,...a)=>{assert.equal(s,0);r.actions.push(...a);},raw:(s,h)=>{assert.equal(s,0);r.tuples.push([h.target,h.flags,h.amount,0]);}});
  assert.deepEqual(r.actions,v.actions);assert.deepEqual(r.tuples,v.tuples);assert.equal(r.assignments.physicalFamily,1);
 }
});
test('self guard missing roles,accessors and combined alias capacity reject before mutation',async()=>{
 const v=JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
 const c={category:0,level:0,cost:3,local:0,resource:100080,hits:[[0,0,0x201,12,null,0]]},f=await guardFixture(api,v,c);
 const command=hits=>api.decodeLegacyGameBattleMotion(guardMotion({...c,hits})).commands[0];
 try{
  const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);let reads=0;
  const accessor={...f.command,fields:Object.defineProperty([...f.command.fields],7,{get(){reads++;return 0;}})};
  for(const raw of[accessor,command([[0,0,0x201,12,null,9]])]){
   assert.equal(f.owner.queuePhysicalFamily(raw,1,0,0).kind,'physical-family-unavailable');
   assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);
  }
  assert.equal(reads,0);
  assert.throws(()=>f.owner.queuePhysicalFamily(command(Array.from({length:8},()=>[0,0,0x201,12,null,0])),1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');
  assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);
  const rid=command([[0,0,0x800201,12,[100040,100041,100050],0]]);
  assert.equal(api.planBattlePhysicalFamily(rid,()=>({vitals:[70,100,10,10]}),0,0).reason,'physical-family-tuple-storage-context');
 }finally{f.close();}
});
for(const kind of Object.keys(cases))test('self guard aliases retain actual callbacks,wait and result ownership: '+kind,async()=>console.log(JSON.stringify(await runSelfGuard(api,kind))));

import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {verifySkill99Model} from '../../analysis/game-legacy-battle-skill99-v1/model.mjs';
import {vectors,skill99Fixture,runSkill99Manager} from '../../analysis/game-legacy-battle-skill99-v1/fixture.mjs';
import {sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';

test('SKL99..104 independent native queues,complete callbacks and full scaled RGBA',async()=>
 console.log('skill99-independent '+JSON.stringify(await verifySkill99Model(api))));

test('malformed numeric variants preserve their original parse error after a frozen command',()=>{
 for(const fields of[[9500,3,4,0,0,1,12,255],[200,3,0,0,0,1,12,255]])
  assert.throws(()=>api.decodeLegacyGameBattleMotion(sharedMotion('SKL',fields)),error=>error.code==='LEGACY_BATTLE_MOTION_OPCODE');
 const valid=api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[9900,3,0,0,10,0x80000,255])).commands[0];
 assert.ok(Object.isFrozen(valid.fields));assert.equal(valid.fields[0],9900);
});

for(const trace of vectors.traces)test('SKL99 family real manager callbacks and completion: '+trace.case.name,async()=>
 console.log('skill99-manager '+JSON.stringify(await runSkill99Manager(api,trace.case))));

test('SKL99 three-field records preserve both old fourth cells and existing target number style',async()=>{
 const c=vectors.traces[0].case,f=await skill99Fixture(api,c);
 try{
  f.owner.appendTuple(0,[0,0,0,0x11223344]);f.owner.appendTuple(0,[0,0,0,0x55667788]);f.owner.resetQueues(1);
  assert.equal(f.owner.queueStatusSkill(f.command,1,0).kind,'status-skill-queued');
  const body=f.owner.copy(0);assert.deepEqual([...body.tuples.slice(0,8)],[10,0x80000,0,0x11223344,-1,0,0,0x55667788]);
  assert.equal(f.owner.copy(10).numberStyle,0);
 }finally{f.close();}
});

test('missing SKL99 target interruption keeps the source three-field tail',async()=>{
 const c=vectors.traces[0].case,f=await skill99Fixture(api,c);
 try{
  f.owner.appendTuple(0,[0,0,0,0x11223344]);f.owner.resetQueues(1);
  const command=api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[9900,3,0,0,11,0x80000,255])).commands[0];
  const queued=f.owner.queueStatusSkill(command,1,0,0,true);
  assert.equal(queued.kind,'status-skill-interrupted');assert.equal(queued.missing.slot,11);
  f.owner.completeSkillInterruption(queued,1,true);
  assert.deepEqual([...f.owner.copy(0).tuples.slice(0,4)],[-1,0,0,0x11223344]);
 }finally{f.close();}
});

test('C status icon priority and paired bit clearing preserve the first native child',async()=>{
 for(let index=0;index<6;index++){
  const c=vectors.traces[0].case,f=await skill99Fixture(api,c);
  try{
   const bit=0x4000<<index;
   f.owner.applyCharacter(10,bit,100060,[0,0],[70,100,10,10]);
   const icon=f.owner.copyPlayback().nodes.find(n=>n.kind==='status-skill-modifier');
   assert.equal(icon.resourceId,0x1926a+index);
   assert.equal(f.owner.copy(10).dynamicFlags&0xfc000,index&1?bit:0);
   f.owner.applyCharacter(10,0,100060,[0,0],[70,100,10,10]);
   assert.equal(f.owner.copy(10).dynamicFlags&0xfc000,index&1?bit:0);
   f.owner.applyCharacter(10,0x4000,100060,[0,0],[70,100,10,10]);
   const retained=f.owner.copyPlayback().nodes.filter(n=>n.kind==='status-skill-modifier');
   assert.equal(retained.length,1);assert.equal(retained[0].id,icon.id);assert.equal(retained[0].resourceId,icon.resourceId);
   f.owner.remove(10);f.step();assert.equal(f.owner.copyPlayback().nodes.some(n=>n.id===icon.id),false);
  }finally{f.close();}
 }
});

test('source status icon follows indicator visibility through its ten-pixel displacement',async()=>{
 const c=vectors.traces[0].case,f=await skill99Fixture(api,c);
 try{
  f.owner.applyCharacter(10,0x8400,100060,[0,0],[70,100,10,10]);
  for(let pass=0;pass<10;pass++)f.step();
  let icon=f.owner.copyPlayback().nodes.find(n=>n.kind==='status-skill-modifier');
  assert.equal(icon.statusSkill.modifier.offsetX,10);assert.deepEqual(icon.scale,[1,1]);
  const id=icon.id;f.owner.applyCharacter(10,0x8000,100060,[0,0],[70,100,10,10]);
  for(let pass=0;pass<10;pass++)f.step();
  icon=f.owner.copyPlayback().nodes.find(n=>n.id===id);assert.equal(icon.statusSkill.modifier.offsetX,0);
 }finally{f.close();}
});

test('required status animation and merged queue capacity fail before mutation;existing icon avoids a false resource dependency',async()=>{
 const c=vectors.traces[0].case,f=await skill99Fixture(api,c,{omitIcons:[0x1926a]});
 try{
  const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);
  assert.throws(()=>f.owner.queueStatusSkill(f.command,1,0),error=>error.code==='LEGACY_BATTLE_SKILL_ANIMATION_REQUIRED');
  assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);
 }finally{f.close();}
 const g=await skill99Fixture(api,{...c,flags:{10:0x8000}},{omitIcons:[0x1926a]});
 try{
  assert.equal(g.owner.queueStatusSkill(g.command,1,0).kind,'status-skill-queued');
  for(let pass=0;pass<400;pass++)g.step();
  assert.deepEqual(g.owner.copyPlayback().nodes.filter(n=>n.kind==='status-skill-modifier').map(n=>n.resourceId),[0x1926b]);
 }finally{g.close();}
 const h=await skill99Fixture(api,{...c,hits:[[0,0x80000]]});
 try{
  h.owner.appendActions(0,1,Array(194).fill(0));
  const before=JSON.stringify([h.owner.copyState(),h.owner.copyPlayback()]);
  assert.throws(()=>h.owner.queueStatusSkill(h.command,1,0),error=>error.code==='LEGACY_BATTLE_BODY_CAPACITY');
  assert.equal(JSON.stringify([h.owner.copyState(),h.owner.copyPlayback()]),before);
 }finally{h.close();}
});

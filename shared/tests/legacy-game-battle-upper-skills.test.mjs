import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {vectors,context,upperSkillMotion,upperSkillFixture,runUpperSkillManager} from '../../analysis/game-legacy-battle-upper-skills-v1/fixture.mjs';
import {verifyUpperSkillModel} from '../../analysis/game-legacy-battle-upper-skills-v1/model.mjs';

test('upper six classes match4320 independent queues,4825 callbacks and474 full authored RGBA',async()=>
 console.log('upper-skills-independent '+JSON.stringify(await verifyUpperSkillModel(api))));

for(const c of vectors.cases)test('upper source manager and source wait recovery: '+c.name,async()=>{
 const out=await runUpperSkillManager(api,c),mp=out.events.filter(e=>e.kind==='battle-vital'&&e.field==='MP');
 assert.equal(mp.length,1);assert.equal(mp[0].delta,-3);
 if(['gesture-self','gesture-multi'].includes(c.name))assert.equal(out.end.pass,7207);
 else assert.ok(out.end.pass<7200);
 if(c.category===107){const info=out.events.filter(e=>e.kind==='battle-information');
  assert.equal(info.length,c.caster===c.local?c.hits.length:0);
  for(const e of info){
   if(e.success){assert.deepEqual(e.values,[70,100,10,10]);assert.equal(e.legacyPrintf,'boxed-varargs-unmodeled');}
   else{assert.equal(Object.hasOwn(e,'values'),false);assert.equal(e.legacyPrintf,'name-only');}
  }
 }
 console.log('upper-skills-manager '+JSON.stringify({name:c.name,end:out.end,draws:out.draws,HP:out.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,MP:mp.length}));
});

test('SKL108 amount-before-flags is retained independently from the public hit representation',()=>{
 const c=vectors.cases.find(c=>c.name==='class108'),command=api.decodeLegacyGameBattleMotion(upperSkillMotion(c)).commands[0];
 assert.deepEqual(command.fields,[10800,3,0,0,10,7,0x80000,255]);
 const plan=api.planBattleStatusSkill(command,()=>({vitals:[70,100,10,10]}),0);
 assert.deepEqual(plan.hits,[{slot:10,flags:0x80000,amount:7}]);
});

test('upper consumers preserve the fourth tuple cell and distinct native EOF policies',async()=>{
 for(const c of vectors.cases.slice(0,6)){
  const f=await upperSkillFixture(api,c);
  try{
   f.owner.appendTuple(c.caster,[0,0,0,0x11223344]);f.owner.appendTuple(c.caster,[0,0,0,0x55667788]);f.owner.resetQueues(1<<c.caster);
   assert.equal(f.owner.queueStatusSkill(f.command,1,0).kind,'status-skill-queued');const b=f.owner.copy(c.caster);
   assert.equal(b.tuples[3],0x11223344);assert.equal(b.tuples[7],0x55667788);
   assert.equal(b.tupleWrite,[107,114].includes(c.category)?2:1);
  }finally{f.close();}
 }
});

test('missing upper target cleanup appends only its source-owned final action or three-word sentinel',async()=>{
 for(const c of vectors.cases.slice(0,6)){
  const f=await upperSkillFixture(api,c);
  try{
   const missing={...c,hits:[[11,0x80000,7]]},command=api.decodeLegacyGameBattleMotion(upperSkillMotion(missing)).commands[0];
   const out=f.owner.queueStatusSkill(command,1,c.local,0,true);assert.equal(out.kind,'status-skill-interrupted');assert.equal(out.missing.slot,11);
   f.owner.completeSkillInterruption(out,1,true);const b=f.owner.copy(c.caster);
   assert.equal(b.tupleWrite,[107,114].includes(c.category)?1:0);
   const actions=[...b.actions.slice(0,b.actionWrite+1)];
   if([108,109].includes(c.category))assert.deepEqual(actions,[24,147,53]);
   else assert.equal(actions.at(-1),{107:102,112:108,114:62,117:62}[c.category]);
  }finally{f.close();}
 }
});

test('detached clone resources and merged action capacity fail before mutating any body',async()=>{
 const c=vectors.cases.find(c=>c.category===112),f=await upperSkillFixture(api,c,{omit:[0x18aa7]});
 try{const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);
  assert.throws(()=>f.owner.queueStatusSkill(f.command,1,0),e=>e.code==='LEGACY_BATTLE_SKILL_ANIMATION_REQUIRED');
  assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);
 }finally{f.close();}
 const g=await upperSkillFixture(api,{...vectors.cases[1],hits:[[0,0x80000,7]]});
 try{g.owner.appendActions(0,1,Array(194).fill(0));const before=JSON.stringify([g.owner.copyState(),g.owner.copyPlayback()]);
  assert.throws(()=>g.owner.queueStatusSkill(g.command,1,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');
  assert.equal(JSON.stringify([g.owner.copyState(),g.owner.copyPlayback()]),before);
 }finally{g.close();}
});

test('SKL112 clone is detached,never replaces a registry slot and is deleted by its own105',async()=>{
 const c=vectors.cases.find(c=>c.name==='rush-fail'),f=await upperSkillFixture(api,c);let cloneId=null,cloneSeen=false;
 try{
  f.owner.queueStatusSkill(f.command,1,0);
  for(let pass=0;pass<230;pass++){
   f.step();const p=f.owner.copyPlayback(),clone=p.nodes.find(n=>n.kind==='body'&&n.slot===-1);
   if(clone){cloneSeen=true;cloneId=clone.id;assert.equal(clone.resourceId,0x18aa7);assert.equal(clone.parentId,p.nodes.find(n=>n.kind==='body'&&n.slot===0).id);}
   assert.deepEqual(f.owner.copyState().bodies.filter(Boolean).map(b=>b.slot),[0,10]);
  }
  assert.equal(cloneSeen,true);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.id===cloneId),false);
 }finally{f.close();}
});

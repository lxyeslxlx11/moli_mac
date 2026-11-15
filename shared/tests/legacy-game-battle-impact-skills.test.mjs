import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {vectors,impactSkillMotion,impactSkillFixture,runImpactSkillManager} from '../../analysis/game-legacy-battle-impact-skills-v1/fixture.mjs';
import {verifyImpactSkillModel} from '../../analysis/game-legacy-battle-impact-skills-v1/model.mjs';

test('five impact classes match independent queues,callbacks and complete authored RGBA',async()=>{
 console.log('impact-skills-independent '+JSON.stringify(await verifyImpactSkillModel(api)));
});
for(const trace of vectors.traces)test('impact source manager and ownership: '+trace.case.name,async()=>{
 const c=trace.case,out=await runImpactSkillManager(api,c),mp=out.events.filter(e=>e.kind==='battle-vital'&&e.field==='MP');
 assert.equal(mp.length,1);assert.equal(mp[0].delta,-3);
 for(const expected of trace.final.bodies){const actual=out.bodies.find(b=>b.slot===expected.slot);assert.deepEqual(actual.vitals,expected.vitals,c.name+' source final vitals');}
 if(c.name==='KO97')assert.equal(out.bodies.some(b=>b.slot===10),false);
 if(trace.settled)assert.ok(out.end.pass<7200,c.name+' natural completion');else assert.equal(out.end.pass,7207,c.name+' source wait recovery');
 console.log('impact-skills-manager '+JSON.stringify({name:c.name,end:out.end,draws:out.draws,HP:out.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,MP:mp.length}));
});

test('RID clone/front and hidden-deflection boundaries preserve every body and player state',async()=>{
 for(const[category,level,flags,reason]of[[106,0,0x800001,'impact-skill-detached-RID-storage'],[116,0,0x800001,'impact-skill-detached-RID-storage'],[4,0,0x20000001,'impact-skill-hidden-deflection-geometry']]){
  const c={...vectors.traces[0].case,category,level,hits:[[10,flags,7,...(flags&0x800000?[[100040,100041,100050]]:[])]]},f=await impactSkillFixture(api,c);
  try{const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);assert.equal(f.owner.queueImpactSkill(f.command,1,0,0).reason,reason);assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);}finally{f.close();}
 }
});
test('missing impact target retains source prefix and only the source-owned completion tail',async()=>{
 for(const category of[4,97,106,111,116]){
  const c={...vectors.traces[0].case,category,hits:[[10,1,7]]},f=await impactSkillFixture(api,c);
  try{const missing={...c,hits:[[11,1,7]]},command=api.decodeLegacyGameBattleMotion(impactSkillMotion(missing)).commands[0],out=f.owner.queueImpactSkill(command,1,0,0,true);
   assert.equal(out.kind,'impact-skill-interrupted');assert.equal(out.missing.slot,11);f.owner.completeSkillInterruption(out,1,true);const b=f.owner.copy(0);
   assert.equal(b.tupleWrite,0);const actions=Array.from(b.actions.slice(0,b.actionWrite+1));
   assert.deepEqual(actions,category===4?[24,53,147,68]:category===97?[24,53,38,147,135,62,78,86,85,84,87]:category===106?[24,53,156,75,34,89,101]:category===111?[24,53,156,7,9,10,73,106,74,7,11,10]:[24,53,156,62]);
  }finally{f.close();}
 }
});
test('merged action/tuple capacities and missing static front are checked before mutation',async()=>{
 for(const mode of['actions','tuples','graphic']){
  const c={...vectors.traces[0].case,category:116},f=await impactSkillFixture(api,c,{omit:mode==='graphic'?[0x666c]:[]});
  try{
   if(mode==='actions')f.owner.appendActions(0,1,Array(194).fill(0));
   if(mode==='tuples')for(let i=0;i<199;i++)f.owner.appendTuple(0,[10,0,0,0]);
   const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);assert.throws(()=>f.owner.queueImpactSkill(f.command,1,0,0),e=>e.code===(mode==='graphic'?'LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED':'LEGACY_BATTLE_BODY_CAPACITY'));assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);
  }finally{f.close();}
 }
});
test('impact parser ignores accessors,requires an exact EOF and retains dense signed words',()=>{
 const c=vectors.traces[0].case,command=api.decodeLegacyGameBattleMotion(impactSkillMotion(c)).commands[0],get=()=>({vitals:[70,100,10,10]});let reads=0;
 for(const bad of[{...command,attachedRID:1},{...command,fields:command.fields.slice(0,-1)},{...command,fields:[...command.fields,0]},Object.defineProperty({...command},'fields',{get(){reads++;return command.fields;}})])assert.equal(api.planBattleImpactSkill(bad,get,0,0).kind,'impact-skill-unavailable');
 assert.equal(reads,0);const empty=api.decodeLegacyGameBattleMotion(impactSkillMotion({...c,hits:[]})).commands[0];assert.equal(api.planBattleImpactSkill(empty,get,0,0).reason,'impact-skill-empty-target-runtime-unobserved');
});
test('unregistered106 clone never replaces its caster and disappears through105',async()=>{
 const c=vectors.traces.find(t=>t.case.name==='class106').case,f=await impactSkillFixture(api,c);let seen=false,id=null;
 try{f.owner.queueImpactSkill(f.command,1,0,0);
  for(let i=0;i<220;i++){f.step();const p=f.owner.copyPlayback(),clones=p.nodes.filter(n=>n.kind==='body'&&n.parentId!==null);
   for(const n of clones){seen=true;id=n.id;assert.equal(n.slot,0);assert.equal(n.parentId,p.nodes.find(x=>x.kind==='body'&&x.priority===2&&x.parentId===null).id);}
   assert.deepEqual(f.owner.copyState().bodies.filter(Boolean).map(b=>b.slot),[0,10]);assert.equal(f.owner.copy(0).vitals[0],70);
  }assert.equal(seen,true);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.id===id),false);
 }finally{f.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {vectors,detachedRIDFixture,runDetachedRIDManager,impactSkillMotion} from '../../analysis/game-legacy-battle-detached-rid-v1/fixture.mjs';
import {verifyDetachedRIDModel} from '../../analysis/game-legacy-battle-detached-rid-v1/model.mjs';

test('106 reflected RID matches720 independent queues,full callback states and authored RGBA',async()=>
 console.log('detached-RID-independent '+JSON.stringify(await verifyDetachedRIDModel(api))));
for(const trace of vectors.traces)test('106 reflected RID source manager and preserved wait: '+trace.case.name,async()=>{
 const c=trace.case,out=await runDetachedRIDManager(api,c),mp=out.events.filter(e=>e.kind==='battle-vital'&&e.field==='MP');
 assert.equal(mp.length,1);assert.equal(mp[0].slot,c.caster);assert.equal(mp[0].delta,-3);
 assert.equal(out.bodies.find(b=>b.slot===c.caster).resourceId,0);
 for(const expected of trace.final.bodies)assert.deepEqual(out.bodies.find(b=>b.slot===expected.slot).vitals,expected.vitals,c.name);
 assert.equal(out.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,c.name==='followup'?1:0);
 if(trace.settled)assert.ok(out.end.pass<7200);else assert.equal(out.end.pass,7207);
 console.log('detached-RID-manager '+JSON.stringify({name:c.name,end:out.end,draws:out.draws,HP:out.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,MP:mp.length,blankSlot:c.caster}));
});
test('one reflected RID creates four independent single-row clones and messages on registered slot0',async()=>{
 const c=vectors.traces[0].case,f=await detachedRIDFixture(api,c),clones=new Set(),messages=new Set();let blank=false,busyPastSentinel=false;
 try{
  f.owner.queueImpactSkill(f.command,1,0,0);
  for(let i=0;i<220;i++){
   f.step();const p=f.owner.copyPlayback(),caster=p.nodes.find(n=>n.kind==='body'&&n.slot===0&&n.parentId===null);
   for(const n of p.nodes){
    if(n.kind==='body'&&n.parentId===caster.id){clones.add(n.id);assert.equal(n.slot,0);assert.equal(n.resourceId,100095);}
    if(n.kind==='message'&&n.resourceId===0x573b&&!messages.has(n.id)){messages.add(n.id);assert.equal(n.position[0],f.owner.copy(0).position[0]);}
   }
   if(caster.resourceId===0&&caster.animation.graphicIndex===0){blank=true;assert.equal(caster.animation.geometry,null);const visible=f.frame.step({width:640,height:480},p,1000,1);assert.ok(visible.skipped.some(n=>n.id===caster.id&&n.reason==='graphic-empty'));}
   const target=f.owner.copy(10);if(target.actionRead===4){busyPastSentinel=true;assert.equal(target.state,0);assert.equal(target.busy,1);}
   assert.deepEqual(f.owner.copyState().bodies.filter(Boolean).map(b=>b.slot),[0,10]);
  }
  assert.equal(clones.size,4);assert.equal(messages.size,4);assert.equal(blank,true);assert.equal(busyPastSentinel,true);
  assert.equal(f.owner.copyPlayback().nodes.some(n=>clones.has(n.id)),false);
 }finally{f.close();}
});
test('zero metadata removes existing rider and attachment while preserving original HP/MP ownership',async()=>{
 const c=vectors.traces[0].case,f=await detachedRIDFixture(api,c);let cleared=false;
 try{
  f.owner.applyCharacter(0,0,100040,[100095,100050],[70,100,10,10]);
  let p=f.owner.copyPlayback();assert.equal(p.nodes.filter(n=>['rider','attachment'].includes(n.kind)&&!n.deleted).length,2);
  f.owner.resetQueues((1<<0)|(1<<10));f.owner.queueImpactSkill(f.command,1,0,0);
  for(let i=0;i<220;i++){f.step();if(f.owner.copy(0).resourceId===0){cleared=true;}}
  assert.equal(cleared,true);p=f.owner.copyPlayback();assert.equal(p.nodes.some(n=>['rider','attachment'].includes(n.kind)&&!n.deleted),false);
  assert.deepEqual(f.owner.copy(0).vitals,[70,100,7,10]);assert.deepEqual(f.owner.copy(10).vitals,[70,100,10,10]);
 }finally{f.close();}
});
test('missing slot0 and unsupported detached storage fail before charging or changing any owner',async()=>{
 for(const spec of[{caster:1,initialSlots:[],flags:0x802001,reason:'impact-skill-detached-RID-slot0'},
  {caster:0,initialSlots:[0],flags:0x800001,reason:'impact-skill-detached-RID-storage'},
  {caster:0,initialSlots:[0],category:116,flags:0x802001,reason:'impact-skill-detached-RID-storage'}]){
  const c={...vectors.traces[0].case,...spec,hits:[[10,spec.flags,9,[100040,100041,100050]]]},f=await detachedRIDFixture(api,c);
  try{const before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);assert.equal(f.owner.queueImpactSkill(f.command,1,0,0).reason,spec.reason);assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);}finally{f.close();}
 }
});
test('the weather self-effect rejection remains separate from a reflected106 RID',()=>{
 const command=api.decodeLegacyGameBattleMotion(Uint8Array.from('M|SKL|9CA4|3|0|0|80000|FF|',c=>c.charCodeAt(0))).commands[0];
 assert.equal(api.planBattleCasting(command,()=>({vitals:[70,100,10,10]}),0,0).reason,'skill401-self-effect-tuple');
 assert.equal(api.planBattleImpactSkill(api.decodeLegacyGameBattleMotion(impactSkillMotion(vectors.traces[0].case)).commands[0],()=>({vitals:[70,100,10,10]}),0,0).kind,'impact-skill-plan');
});
test('four pops retain the actual previous action50 beyond the newly written sentinel',async()=>{
 const c=vectors.traces[0].case,f=await detachedRIDFixture(api,c);let released=false;
 try{
  f.owner.appendActions(10,7,[0,0,0,0,50]);f.owner.resetQueues(1<<10);assert.equal(f.owner.copy(10).actions[4],50);
  f.owner.queueImpactSkill(f.command,1,0,0);assert.deepEqual(Array.from(f.owner.copy(10).actions.slice(0,6)),[0,119,-1,0,50,-1]);
  for(let i=0;i<180;i++){f.step();const target=f.owner.copy(10);released||=target.actionRead===5&&target.state===0&&target.busy===0;}
  assert.equal(released,true);assert.deepEqual(f.owner.copy(10).vitals,[70,100,10,10]);
 }finally{f.close();}
});
test('removing registered slot0 after preflight produces an explicit message-owner failure',async()=>{
 const c={...vectors.traces[0].case,caster:1},f=await detachedRIDFixture(api,c);let error=null;
 try{
  f.owner.queueImpactSkill(f.command,1,0,0);f.owner.remove(0);
  for(let i=0;i<220&&!error;i++)try{f.step();}catch(e){error=e;}
  assert.equal(error?.code,'LEGACY_BATTLE_IMPACT_MESSAGE_TARGET_REMOVED');
  assert.deepEqual(f.owner.copy(1).vitals,[70,100,7,10]);assert.deepEqual(f.owner.copy(10).vitals,[70,100,10,10]);
 }finally{f.close();}
});

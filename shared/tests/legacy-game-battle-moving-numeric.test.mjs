import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {movingNumericAssets} from '../../analysis/game-battle-moving-numeric-v1/original_assets.mjs';
import {movingNumericVectors as v,movingNumericMotion,movingNumericProjection,movingNumericDigest} from '../../analysis/game-battle-moving-numeric-v1/reference.mjs';
const base=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url)));
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
async function setup(c,{commands=false}={}){const files=originalFiles(movingNumericAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();
 const owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local??0});owner.applyCharacterFlags(c.C_flags??0);
 const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
 const command=api.decodeLegacyGameBattleMotion(movingNumericMotion(c)).commands[0],frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});if(!commands)owner.resetQueues(slots.reduce((m,s)=>m|(1<<s),0));
 return{owner,files,library,frame,command,phase2:true,stopped:false,reflectors:api.planBattleNumericSkill(command,()=>({vitals:[70,100,10,10]}),c.local).reflectors??[],c,close(){frame.close();owner.close();library.close();files.close();}};
}
const sample=(extras={})=>({category:83,level:0,caster:0,cost:3,local:0,hits:[[10,0,12]],...extras});
function advance(f){if(f.phase2){const list=f.reflectors,p=f.owner.copy(f.c.caster);if(!list.length)f.phase2=false;
 else if(list.slice(0,-1).every(s=>f.owner.copy(s).state===0)&&f.owner.copy(list.at(-1)).state===1&&[0,1].includes(p.state)){f.owner.popAction(list.at(-1));f.phase2=false;}}
 const result=f.owner.stepPlayback({...ctx,localSlot:f.c.local});f.stopped||=result.stopRequested;f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000);f.owner.applyDrawPriorities(p.depthPriorities);return p;
}
function finish(f,limit=1500){for(let i=0;i<limit;i++){advance(f);if(f.stopped)return;if(!f.phase2&&f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))return;}assert.fail('actual numeric callbacks did not settle');}
test('source83 integer midpoint, complete queues/flags and explicit unobserved removed-caster boundaries match independent equations',()=>{
 let supported=0,boundaries=0;for(const row of v.queues){const c=row.case,p=api.planBattleNumericSkill(api.decodeLegacyGameBattleMotion(movingNumericMotion(c)).commands[0],()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),c.local);
  if(row.portableBoundary){assert.equal(p.kind,'numeric-skill-unavailable');assert.equal(p.reason,row.portableBoundary);boundaries++;}
  else{assert.equal(p.kind,'numeric-skill-plan',c.name);assert.deepEqual(p.rows,row.expected.rows,c.name);assert.deepEqual(p.reflectors,row.expected.reflectors);assert.equal(p.reflectedAmount,row.expected.reflectedAmount);assert.equal(p.chantResource,null);supported++;}
 }assert.equal(supported+boundaries,v.queues.length);assert.deepEqual(api.LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE.midpoint,[318,270]);assert.equal(api.LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE.afterImageVisits,12);assert.equal(api.LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE.completeSKL,false);
});
test('independent83 complete callback/afterimage states and two-selector complete RGBA match actual owners',async()=>{
 let states=0,rasters=0,stops=0;
 for(const trace of v.traces){const c=trace.case,f=await setup(c);try{const q=f.owner.queueNumericSkill(f.command,1,c.local);
  if(trace.portableBoundary){assert.equal(q.kind,'numeric-skill-unavailable');assert.equal(q.reason,trace.portableBoundary);continue;}
  assert.equal(q.kind,'numeric-skill-queued',c.name);assert.equal(f.owner.copy(c.caster).vitals[2],10);
  for(let i=0;i<trace.states.length;i++){advance(f);const actual=movingNumericProjection(f.owner),hash=movingNumericDigest(actual);
   if(hash!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-moving-numeric-v1/first-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual},null,2));assert.fail(c.name+' callback#'+(i+1)+' '+hash+' expected '+trace.states[i]);}
   for(const r of trace.rasters.filter(r=>r.frame===i+1)){const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
    assert.equal(movingNumericDigest(plan),r.planDigest,c.name+' plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' RGBA#'+r.frame+'/'+r.selector);assert.equal(movingNumericDigest(movingNumericProjection(f.owner)),hash,'Rendering cannot repeat body/afterimage callbacks');rasters++;
   }states++;
  }assert.equal(f.stopped,trace.stopped,c.name);assert.equal(f.phase2,trace.commandPhase2Waiting,c.name);assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),trace.bodySettled,c.name);stops+=Number(f.stopped);
 }finally{f.close();}}
 console.log('moving-numeric-independent '+JSON.stringify({scenarios:v.traces.length,states,rasters,stops}));assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);
});
test('local83 uses actual244 stop and next manager callback exits without a successful round or fabricated HP0',async()=>{
 for(const hits of[[[10,0,12]],[[0,0,12]],[[10,0x10000,7]],[]]){const c=sample({hits}),f=await setup(c,{commands:true});try{f.owner.load(movingNumericMotion(c),{...ctx,substate:5});let stopped=0,exit=0;
  for(let i=1;i<1800;i++){const r=f.owner.callCallbacks(ctx);assert.equal(r.commands.some(q=>q.kind==='command-unavailable'),false);if(r.body.stopRequested){stopped=i;assert.equal(r.nextSubstate,null);assert.equal(f.owner.copyState().stop,1);}if(r.nextSubstate===7){exit=i;break;}f.owner.advanceBackground();}
  assert.ok(stopped>0);assert.equal(exit,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);assert.equal(f.owner.copyState().bodies.bodies[0].vitals[0],70);assert.equal(f.owner.copyState().bodies.bodies[0].vitals[2],7);
  assert.equal(f.owner.prepareExit({...ctx,substate:7}).kind,'battle-exit-cleanup');f.owner.markExitDeleted();
 }finally{f.close();}}
});
test('nonlocal83 actually triggers targets then deletes its source body and drains a real round',async()=>{
 const c=sample({caster:1}),f=await setup(c,{commands:true});try{f.owner.load(movingNumericMotion(c),{...ctx,substate:5});let queued=0,drained=false;
  for(let i=0;i<1800;i++){const r=f.owner.callCallbacks(ctx);assert.equal(r.commands.some(q=>q.kind==='command-unavailable'),false);queued+=r.commands.filter(q=>q.kind==='command-numeric-skill').length;if(r.manager.kind==='battle-round-drained'){drained=true;break;}f.owner.advanceBackground();}
  assert.equal(queued,1);assert.equal(drained,true);assert.equal(f.owner.copyState().roundCounter,1);assert.equal(f.owner.copyState().bodies.bodies[1],null);assert.equal(f.owner.copyState().bodies.bodies[10].vitals[0],82);
 }finally{f.close();}
});
test('afterimage copies prior screen/current float/frame, keeps inserted list links and12 visits, survives parent deletion',async()=>{
 const f=await setup(sample({caster:1}));try{f.owner.queueNumericSkill(f.command,1,0);let ghost=null,before=null;
  for(let i=0;i<500;i++){const nodes=f.owner.copyPlayback().nodes;before=nodes.find(n=>n.kind==='body'&&n.slot===1).screen;advance(f);ghost=f.owner.copyPlayback().nodes.find(n=>n.kind==='moving-numeric-afterimage'&&!n.deleted);if(ghost)break;}
  assert.ok(ghost);assert.equal(ghost.priority,12);assert.equal(ghost.parentId,null);assert.deepEqual(ghost.screen,before);assert.deepEqual(ghost.position,f.owner.copy(1).position);assert.equal(ghost.counter,0);const saved=JSON.stringify(ghost.animation),id=ghost.id;
  for(let i=1;i<=12;i++){advance(f);const n=f.owner.copyPlayback().nodes.find(n=>n.id===id);assert.equal(n.counter,i);assert.equal(JSON.stringify(n.animation),saved);assert.deepEqual(n.screen,before);assert.equal(n.deleted,i===12);}
  let survived=false;for(let i=0;i<1200;i++){advance(f);if(!f.owner.copy(1)){survived=f.owner.copyPlayback().nodes.some(n=>n.kind==='moving-numeric-afterimage'&&!n.deleted);break;}}assert.equal(survived,true);
  for(let i=0;i<20;i++)advance(f);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='moving-numeric-afterimage'),false);
 }finally{f.close();}
});
test('special193 preserves source target wait and existing7201 recovery instead of releasing targets through135',async()=>{
 const c=sample({caster:20,hits:[[0,0,7]]}),f=await setup(c,{commands:true});try{f.owner.load(movingNumericMotion(c),{...ctx,substate:5});let done=0;
  for(let i=1;i<=10000;i++){const r=f.owner.callCallbacks(ctx);assert.equal(r.commands.some(q=>q.kind==='command-unavailable'),false);assert.equal(f.owner.copyState().bodies.bodies[0].vitals[0],70);if(r.manager.kind==='battle-round-drained'){done=i;break;}}
  assert.ok(done>7201&&done<10000);assert.equal(f.owner.copyState().roundCounter,1);assert.equal(f.owner.copyState().bodies.bodies[20],null);
 }finally{f.close();}
});
test('nonlocal zero-sum reflectors preserve phase2 after source deletion; unavailable reflection rejects atomically',async()=>{
 const c=sample({caster:1,hits:[[10,0x10000,7],[11,0x10000,-7]]}),f=await setup(c,{commands:true});try{f.owner.load(movingNumericMotion(c),{...ctx,substate:5});for(let i=0;i<700;i++){const r=f.owner.callCallbacks(ctx);assert.notEqual(r.manager.kind,'battle-round-drained');}assert.equal(f.owner.copyState().bodies.bodies[1],null);assert.equal(f.owner.copyState().roundCounter,0);
 }finally{f.close();}
 const b=await setup(sample({caster:1,hits:[[10,0x10000,7]]}));try{const before=JSON.stringify(b.owner.copyState());assert.equal(b.owner.queueNumericSkill(b.command,1,0).reason,'moving-numeric-removed-caster-reflection-runtime-unobserved');assert.equal(JSON.stringify(b.owner.copyState()),before);}finally{b.close();}
});
test('83 context/getter/attachedRID and exhausted queues reject before moving or spending values',async()=>{
 const f=await setup(sample());let reads=0;try{const before=JSON.stringify(f.owner.copyState());for(const command of[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:Object.defineProperty([...f.command.fields],4,{get(){reads++;return 10;}})}]){assert.equal(f.owner.queueNumericSkill(command,1,0).kind,'numeric-skill-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);}assert.equal(reads,0);assert.equal(f.owner.queueNumericSkill(f.command,1,NaN).reason,'moving-numeric-local-context');assert.equal(JSON.stringify(f.owner.copyState()),before);f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queueNumericSkill(f.command,1,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
});
test('afterimage copies the actual portable point scale instead of dropping its actor transform',async()=>{
 const f=await setup(sample());try{f.owner.applyCharacter(0,0x1000,100060,[0,0],[70,100,10,10]);f.owner.resetQueues((1<<0)|(1<<10));f.owner.queueNumericSkill(f.command,1,0);let n;
  for(let i=0;i<300;i++){advance(f);n=f.owner.copyPlayback().nodes.find(n=>n.kind==='moving-numeric-afterimage');if(n)break;}assert.ok(n);assert.deepEqual(n.scale,f.owner.copy(0).scale);assert.equal(n.scale[0],Math.fround(1.3));
 }finally{f.close();}
});

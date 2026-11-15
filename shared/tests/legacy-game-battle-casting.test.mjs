import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {castingAssets} from '../../analysis/game-battle-casting-v1/original_assets.mjs';
import {castingVectors as v,castingMotion,castingProjection,castingDigest} from '../../analysis/game-battle-casting-v1/reference.mjs';
const base=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url))),ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
async function setup(c,{commands=false,source={},flags={}}={}){const files=originalFiles(castingAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();
 const owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies(),configure=commands?'configureBodyPlayback':'configurePlayback';
 owner[configure]({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local??0,...source});
 const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);for(const slot of slots)owner.applyCharacter(slot,flags[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
 const command=api.decodeLegacyGameBattleMotion(castingMotion(c)).commands[0],frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});
 if(!commands)owner.resetQueues(slots.reduce((mask,s)=>mask|(1<<s),0));
 return{owner,library,files,command,frame,close(){frame.close();owner.close();library.close();files.close();}};
}
test('SKL19..31/10 levels/ignored variants/flags/RID queues equal the independent original source model',()=>{
 for(const r of v.queues){const command=api.decodeLegacyGameBattleMotion(castingMotion(r.case)).commands[0],plan=api.planBattleCasting(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),r.case.local,0);
  assert.equal(plan.kind,'casting-plan');assert.deepEqual(plan.rows,r.expected.rows,r.case.name);assert.deepEqual(plan.reflectors,r.expected.reflectors);assert.equal(plan.reflectedAmount,r.expected.reflectedAmount);}
 assert.equal(api.LEGACY_GAME_BATTLE_CASTING_PROFILE.completeSKL,false);
});
test('all casting families and levels have independent complete callback/node/resource/CRT/geometry state parity',async()=>{
 let checked=0,settled=0,rendered=0;
 for(const trace of v.traces){const c=trace.case,f=await setup(c);try{const before=JSON.stringify(f.owner.copyState()),out=f.owner.queueCasting(f.command,1,c.local,0);if(trace.unavailable){assert.equal(out.reason,trace.unavailable);assert.equal(JSON.stringify(f.owner.copyState()),before);continue;}assert.equal(out.kind,'casting-queued');assert.equal(f.owner.copy(c.caster).vitals[2],10,'Queue construction must not spend MP');let phase2=true;
  for(let i=0;i<trace.states.length;i++){
   if(phase2){const list=out.reflectors;if(!list.length)phase2=false;else if(list.slice(0,-1).every(s=>f.owner.copy(s)?.state===0)&&f.owner.copy(list.at(-1))?.state===1&&[0,1].includes(f.owner.copy(c.caster)?.state)){f.owner.popAction(list.at(-1));phase2=false;}}
   f.owner.stepPlayback({...ctx,localSlot:c.local});f.owner.advanceBackground();const frame=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000);f.owner.applyDrawPriorities(frame.depthPriorities);
   const actual=castingProjection(f.owner),digest=castingDigest(actual);
   if(digest!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-casting-v1/first-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual},null,2));assert.fail(c.name+' callback#'+(i+1)+' digest '+digest+' expected '+trace.states[i]);}
   for(const r of trace.rasters.filter(r=>r.frame===i+1)){const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
    assert.equal(castingDigest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' RGBA#'+r.frame+'/'+r.selector);assert.equal(castingDigest(castingProjection(f.owner)),digest,'A render must not advance source/RNG/overlay');rendered++;}
   checked++;
  }
  assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>b.busy===0),trace.settled,c.name);if(trace.settled)settled++;
 }finally{f.close();}}
 console.log('casting-independent '+JSON.stringify({traces:v.traces.length,states:checked,settled,rgbaFrames:rendered}));assert.equal(checked,v.frames);assert.equal(rendered,v.rgbaFrames);
});
test('source homing uses wrapped delta and truncated absolute angle; invalid floats/resources stay explicit',()=>{for(const r of v.homing)assert.equal(api.legacyGameBattleHomingAngle(r.angle,r.x,r.y,r.limit),r.expected,JSON.stringify(r));for(const a of[NaN,Infinity,{},1e50])assert.throws(()=>api.legacyGameBattleHomingAngle(a,1,1,.1));for(const [category,level]of[[18,0],[32,0],[19,-1],[19,10]])assert.throws(()=>api.battleCastingResources(category,level));});
test('actual command phase2 owns reflection release and real body busy/position completion for all13 families',async()=>{
 for(const trace of [...v.traces.filter(r=>r.case.level===0&&r.case.name.startsWith('class')),...v.traces.filter(r=>['reflect-19','reflect-20','reflect-31','RID-22','multiple-reflectors'].includes(r.case.name))]){
  const c=trace.case,f=await setup(c,{commands:true});try{f.owner.load(castingMotion(c),{...ctx,substate:5});let drained=false,phase2=false,casts=0;
   for(let i=0;i<1500;i++){const r=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(r.commands.some(r=>r.kind==='command-unavailable'),false,c.name);casts+=r.commands.filter(r=>r.kind==='command-casting').length;phase2||=f.owner.copyState().slots.some(o=>o?.phase===2);
    if(r.manager.kind==='battle-round-drained'){drained=true;break;}f.owner.advanceBackground();const out=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);f.owner.applyDrawPriorities(out.depthPriorities);
   }
   assert.equal(drained,true,c.name);assert.equal(casts,1);assert.equal(phase2,true);assert.equal(f.owner.copyState().roundCounter,1);
  }finally{f.close();}
 }
});
test('no source cast signal leaves real target busy and never fabricates HP results or a completed round',async()=>{
 const c={category:19,level:0,caster:0,local:0,cost:3,resource:100020,hits:[[10,1,12]]},f=await setup(c,{commands:true});try{f.owner.load(castingMotion(c),{...ctx,substate:5});for(let i=0;i<100;i++){const r=f.owner.callCallbacks(ctx);assert.notEqual(r.manager.kind,'battle-round-drained');}
  const s=f.owner.copyState();assert.equal(s.bodies.bodies[10].vitals[0],70);assert.equal(s.bodies.bodies[10].busy,1);assert.equal(s.bodies.bodies[0].vitals[2],7);assert.equal(s.playback.nodes.some(n=>n.kind==='casting-projectile'),false);
 }finally{f.close();}
});
test('RID result mutates real rider/base/attachment owners at impact and leaves received C resource metadata distinct',async()=>{
 const c=v.traces.find(t=>t.case.name==='RID-22').case,f=await setup(c);try{f.owner.queueCasting(f.command,1,c.local,0);assert.equal(f.owner.copy(10).resourceId,100060);let changed=false;
  for(let i=0;i<500;i++){f.owner.stepPlayback(ctx);if(f.owner.copy(10)?.resourceId===100041){changed=true;break;}}
  assert.equal(changed,true);const p=f.owner.copyPlayback(),parent=p.nodes.find(n=>n.kind==='body'&&n.slot===10);assert.equal(p.nodes.some(n=>n.kind==='rider'&&n.parentId===parent.id&&!n.deleted),true);assert.equal(p.nodes.some(n=>n.kind==='attachment'&&n.parentId===parent.id&&n.resourceId===100050&&!n.deleted),true);assert.deepEqual(f.owner.copy(10).linkedResources,[0,0]);
 }finally{f.close();}
});
test('casting malformed fields/attached RID/capacity are rejected before any partial queue/vital mutation',async()=>{
 const c=v.traces[0].case,f=await setup(c);let reads=0;try{const before=JSON.stringify(f.owner.copyState());for(const q of [{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:Object.defineProperty([...f.command.fields],2,{get(){reads++;return 0;}})}]){assert.equal(f.owner.queueCasting(q,1,0,0).kind,'casting-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);}assert.equal(reads,0);
  f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queueCasting(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
});
test('source element feedback uses captured1101 value, mode gates and real local/paired savedFE0 classification',async()=>{
 const c={category:19,level:0,caster:0,local:0,hits:[[5,1,12]]};
 for(const[entryMode,labelFlag,expected]of[[1,0,false],[1,5,true],[2,5,false],[5,0,false],[5,5,true],[6,5,true]]){
  const f=await setup(c,{source:{entryMode,labelFlag},flags:{5:0x02000000}});try{assert.equal(f.owner.copy(0).savedFlags&1,1);assert.equal(f.owner.copy(5).savedFlags&1,1);assert.deepEqual(f.owner.copy(5).statusMetadata,[0,1,0,0]);f.owner.queueCasting(f.command,1,0,0);
   let hit=false;for(let i=0;i<500;i++){f.owner.stepPlayback(ctx);if(f.owner.copy(5).vitals[0]!==70){hit=true;break;}}assert.equal(hit,true);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='message'&&n.resourceId===0x57b7),expected,entryMode+'/'+labelFlag);
  }finally{f.close();}
 }
});
test('opposite-team feedback reports the actual missing friend-roster consumer instead of inventing a source classification',async()=>{
 const c={category:19,level:0,caster:0,local:0,hits:[[10,1,12]]},f=await setup(c,{source:{entryMode:1,labelFlag:5},flags:{10:0x02000000}});try{f.owner.queueCasting(f.command,1,0,0);let event;
  for(let i=0;i<500&&!event;i++)event=f.owner.stepPlayback(ctx).events.find(e=>e.kind==='battle-casting-feedback-unavailable');assert.equal(event?.reason,'opposite-team-friend-roster');assert.equal(f.owner.copy(10).vitals[0],58);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.resourceId===0x57b7),false);
 }finally{f.close();}
});
test('actual C element-property owners create four followers and use independently verified caster/target impact tables',async()=>{
 const c={category:20,level:0,caster:0,local:0,hits:[[10,1,12]]},f=await setup(c,{flags:{0:0x11000000,10:0x12000000}});try{assert.equal(f.owner.copyPlayback().nodes.filter(n=>n.kind==='element-follow').length,8);assert.equal(f.owner.copy(0).elementProperty,1);assert.equal(f.owner.copy(10).elementProperty,2);f.owner.queueCasting(f.command,1,0,0);let hit=false;
  for(let i=0;i<500;i++){f.owner.stepPlayback(ctx);if(f.owner.copy(10).vitals[0]!==70){hit=true;break;}}assert.equal(hit,true);const nodes=f.owner.copyPlayback().nodes;for(const resource of[0x1af5f,0x1af6a])assert.equal(nodes.some(n=>n.kind==='impact'&&n.resourceId===resource),true,resource.toString(16));
 }finally{f.close();}
});
test('source100000 result deletes the actual status child at hit while received C status remains authoritative metadata',async()=>{
 const c={category:22,level:0,caster:0,local:0,hits:[[10,0x100001,12]]},f=await setup(c,{flags:{10:0x20}});try{const p=f.owner.copyPlayback(),target=p.nodes.find(n=>n.kind==='body'&&n.slot===10),status=p.nodes.find(n=>n.kind==='status'&&n.parentId===target.id);assert.ok(status);f.owner.queueCasting(f.command,1,0,0);
  for(let i=0;i<500&&f.owner.copy(10).vitals[0]===70;i++)f.owner.stepPlayback(ctx);assert.equal(f.owner.copy(10).vitals[0],58);assert.equal(f.owner.copy(10).dynamicFlags&0x20,0);assert.equal(f.owner.copy(10).rawStatusFlags,0x20);assert.equal(f.owner.copyPlayback().nodes.find(n=>n.id===status.id)?.deleted,true);
 }finally{f.close();}
});
test('source zero-sum reflection waits in phase2 even after body busy flags clear; no fabricated completed round',async()=>{
 const c={category:20,level:0,caster:0,local:0,cost:3,hits:[[10,0x10001,0]]},f=await setup(c,{commands:true});try{f.owner.load(castingMotion(c),{...ctx,substate:5});for(let i=0;i<250;i++)assert.notEqual(f.owner.callCallbacks(ctx).manager.kind,'battle-round-drained');const s=f.owner.copyState();assert.equal(s.slots.filter(Boolean)[0].phase,2);assert.equal(s.bodies.bodies[10].busy,0);assert.equal(s.bodies.bodies[0].vitals[2],7);assert.equal(s.bodies.bodies[10].vitals[0],70);assert.equal(s.roundCounter,0);
 }finally{f.close();}
});
test('CRT negative divisors, int32 wrap and high=-1 preserve independent values and exact seed consumption',()=>{
 const rows=JSON.parse(readFileSync(new URL('../../analysis/game-battle-casting-v1/original-boundaries.json',import.meta.url))).rows;for(const r of rows){const random=api.createLegacyGameBattleRandom(r.initial);for(const step of r.steps){assert.equal(random.copySeed(),step.before);assert.equal(random.range(step.low,step.high),step.value);assert.equal(random.copySeed(),step.after);}}
 const random=api.createLegacyGameBattleRandom(12345),before=random.copySeed();assert.throws(()=>random.range(2,1),e=>e.code==='LEGACY_BATTLE_RANDOM_RANGE');assert.equal(random.copySeed(),before);
});

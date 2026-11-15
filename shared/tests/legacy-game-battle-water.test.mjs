import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {setImmediate as turn} from 'node:timers/promises';
import * as source from '../index.mjs';
import {battleWaterFixture,characterText} from '../../analysis/game-battle-water-v1/fixture.mjs';
import {verifyBattleWater} from '../../analysis/game-battle-water-v1/reference.mjs';
import {waterFixture} from '../../analysis/game-special-graphics-v1/fixture.mjs';
import {loadWaterReturnProbe} from '../../analysis/game-battle-water-v1/prepare-return-probe.mjs';
const {runWaterReturnTCP}=await loadWaterReturnProbe();
const api=process.env.MOLI_BATTLE_WATER_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_BATTLE_WATER_BUILD)):source;
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),v=read('../../analysis/game-battle-water-v1/original-vectors.json'),sha=b=>createHash('sha256').update(b).digest('hex'),code=s=>e=>e.code===s;
const ctx={mainState:10,substate:6,slowEffects:false,localSlot:0,controlFlags:0,resourceCode:0},text=s=>new TextEncoder().encode(s);
function startBody(f,background=0,battle=f.battle){battle.applyEntry(1,background);battle.receive(text(characterText),10);battle.consumeCharacters();battle.callCallbacks(ctx);}
test('all10 special indices through actual owned C bodies match1060 independent wholeRGBA and1200 ordered state events',async()=>{
 const result=await verifyBattleWater(api,v);assert.equal(result.scenarios,40);assert.equal(result.completeFrames,1060);assert.equal(result.orderedEvents,1200);
});
test('cached background copy does not trigger marker; two nested entry captures reset amplitude without ticks or body callbacks',async()=>{
 const water=api.createLegacyGameWater();for(let i=0;i<51;i++){water.advance();water.present(true,40000,[0,0],[0,0],[320,240]);}const f=await battleWaterFixture(api,3096,water);
 try{f.battle.configureWaterContext(f.context);f.battle.applyEntry(1,5000);f.battle.receive(text('C|20|'),10);f.battle.consumeCharacters();const cached=f.battle.stepFrame({width:640,height:480});assert.equal(cached.waterRequested,undefined);assert.equal(water.copyState().amplitude,100);assert.equal(cached.drawPlan.commands[0].image.index,3096);
  const before=water.copyState();f.battle.configureEntry({entryWindowPresent:false});const first=f.battle.advanceEntry(1000);assert.equal(first.capturePlan.commands[0].image.index,3096);assert.ok(!first.capturePlan.commands.some(c=>c.waterStrip));assert.equal(water.copyState().amplitude,0);assert.equal(water.copyState().phase,before.phase);assert.equal(water.copyState().passes-before.passes,2);
  let second;for(let i=1;i<54;i++)second=f.battle.advanceEntry(1000+i*16);assert.ok(second.capturePlan);assert.equal(second.phaseAfter,2);assert.equal(water.copyState().phase,before.phase);assert.equal(water.copyState().updates,before.updates);assert.equal(water.copyState().passes-before.passes,56);assert.equal(f.battle.copyCommands().playback.passes,0);
 }finally{f.close();water.copyState();water.close();}
});
test('special body requires explicit source context in bare battle owner; supplying it retries without callback replay',async()=>{
 const f=await battleWaterFixture(api,3105);try{startBody(f);const before=JSON.stringify(f.battle.copyCommands()),state=f.battle.copyWaterState();assert.throws(()=>f.battle.stepFrame({width:640,height:480}),code('LEGACY_BATTLE_WATER_CONTEXT_REQUIRED'));assert.deepEqual(f.battle.copyWaterState(),state);assert.equal(f.library.inspect().stats.imagesDecoded,0);
  f.battle.configureWaterContext(f.context);const frame=f.battle.stepFrame({width:640,height:480});assert.equal(frame.waterRequested,true);const output=await f.library.startRender(frame.drawPlan).done;assert.ok(output.rgba.some(n=>n));assert.equal(JSON.stringify(f.battle.copyCommands()),before);
 }finally{f.close();}
});
test('battle queue reserves3/4 helpers from marker beforetrim,while cachedbackground is excluded',async()=>{
 const f=await battleWaterFixture(api);try{startBody(f);const p=f.battle.copyCommands().playback,n=p.nodes[0];for(const special of [false,true]){const nodes=Array.from({length:4096},(_,i)=>({...n,id:i+1,actorFlags:0,drawPriority:10,animation:{...n.animation,graphicIndex:special&&i===4095?3096:1002,geometry:special&&i===4095?n.animation.geometry:{index:1002,originX:-2,originY:0,width:4,height:4}}})),frame=api.createLegacyGameBattleFrameController({graphics:f.library.catalogs().graphics});
   try{const out=frame.step({width:640,height:480},{...p,nodes},5001);assert.equal(out.waterRequested,special?true:undefined);assert.equal(out.dropped,special?4:3);assert.equal(out.submitted.length,special?4093:4094);assert.ok(!out.drawPlan.commands.some(c=>c.image?.index===3096));assert.equal(out.drawPlan.commands.at(-1).image.index,3097);}finally{frame.close();}
  }
 }finally{f.close();}
});
test('nested ordinary scene capture performs water consume before outer tick andposition snapshot,including deferred preparation',()=>{
 const sv=read('../../analysis/game-legacy-scene-frame-v1/original-vectors.json'),av=read('../../analysis/game-legacy-animation-v1/original-vectors.json');
 for(const deferred of [false,true]){const f=waterFixture(api,sv,av);try{let layer=f.controller.step(f.request,f.scene,f.map,[],undefined,[],deferred,[0,64],'capture');if(deferred){assert.equal(f.controller.copyWaterState().passes,0);layer=f.controller.preparePresentation(layer);assert.equal(f.controller.preparePresentation(layer),layer);}
   assert.deepEqual(layer.waterEffect,{phase:3,amplitude:0});assert.deepEqual(f.controller.copyWaterState(),{phase:3,amplitude:2,lastMap:40000,previous:[0,0],updates:0,passes:1});
  }finally{f.close();}}
});
test('context validation invokes no getters andprovider cannot reenter aprocessing battle owner',async()=>{
 const f=await battleWaterFixture(api);let b;try{let reads=0;assert.throws(()=>f.battle.configureWaterContext({...f.context,get position(){reads++;return[0,0];}}));assert.equal(reads,0);for(const patch of [{camera:[Infinity,0]},{localPresent:1},{unknown:true}])assert.throws(()=>f.battle.configureWaterContext({...f.context,...patch}));
  b=api.createLegacyGameBattleState({waterContext(){b.copyWaterState();return f.context;}});b.configureBodyPlayback({animations:f.library.catalogs().animations,geometry:f.library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});b.configureFrames({graphics:f.library.catalogs().graphics});startBody(f,0,b);
  assert.throws(()=>b.stepFrame({width:640,height:480}),code('LEGACY_BATTLE_PLAYBACK_REENTRANT'));assert.equal(b.copyWaterState().passes,0);b.configureWaterContext(f.context);assert.equal(b.stepFrame({width:640,height:480}).waterRequested,true);
 }finally{b?.close();f.close();}
});
for(const mode of ['normal','new-own-unit','reentry-return'])test('realworld source-order phase/presence/capture accounting over OS TCP '+mode,async()=>{
 const adapters=process.env.MOLI_BATTLE_WATER_BUILD?api:await import('../../adapters/wechat/game.mjs'),r=await runWaterReturnTCP(adapters,mode);assert.ok(r.waterChecks>=237);assert.equal(r.waterChecks,r.rendered);assert.ok(r.waterPasses>r.waterChecks);assert.ok(r.waterUpdates>=55);assert.ok(r.resumedMovement&&r.closedOwners);assert.equal(r.officialSessions,0);
});
test('cancelled range read retries same water frame without advancing source state or registered body callbacks',async()=>{
 const f=await battleWaterFixture(api);try{f.battle.configureWaterContext({...f.context,nativeGate:0});startBody(f,5001);const frame=f.battle.stepFrame({width:640,height:480}),state=f.battle.copyWaterState(),bodies=JSON.stringify(f.battle.copyCommands());f.files.controls.hold='Bin/Graphic.bin';const pending=f.library.startRender(frame.drawPlan);
  for(let i=0;i<30&&!f.files.pending.length;i++)await turn();assert.equal(f.files.pending.length,1);pending.cancel();f.files.pending.shift()();await assert.rejects(pending.done,code('LEGACY_ASSET_CANCELLED'));const out=await f.library.startRender(frame.drawPlan).done;assert.equal(sha(out.rgba),v.scenarios.find(r=>r.index===3096&&r.gate===0&&r.background===5001).frames[0].rgbaSha256);assert.deepEqual(f.battle.copyWaterState(),state);assert.equal(JSON.stringify(f.battle.copyCommands()),bodies);
 }finally{f.close();}
});

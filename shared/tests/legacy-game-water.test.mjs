import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as source from '../index.mjs';
import {verifyWater} from '../../analysis/game-special-graphics-v1/reference.mjs';
import {waterFixture} from '../../analysis/game-special-graphics-v1/fixture.mjs';
import {mapBytes} from '../../analysis/game-legacy-scene-frame-v1/original_resources.mjs';
import {originalInput} from '../../analysis/game-input-runtime-v1/original_world.mjs';
const api=process.env.MOLI_WATER_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_WATER_BUILD)):source;
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),v=read('../../analysis/game-legacy-scene-frame-v1/original-vectors.json'),av=read('../../analysis/game-legacy-animation-v1/original-vectors.json');
const sha=b=>createHash('sha256').update(b).digest('hex'),code=c=>e=>e.code===c;
test('Python all64 phases x51 amplitudes,24 viewports,16 queue orders and650 state passes match full RGBA',()=>{
 const result=verifyWater(api,read('../../analysis/game-special-graphics-v1/original-vectors.json'));assert.equal(result.completeFrames,3304);assert.equal(result.statePasses,650);
});
test('twenty skipped source updates prepare one water pass; repeated frame rendering is read only',()=>{
 const f=waterFixture(api,v,av);try{let layer,first;for(let i=0;i<20;i++){layer=f.controller.step({...f.request,tick:i},f.scene,f.map,[],undefined,[],true);first??=layer;assert.equal(layer.waterEffect,undefined);}
  assert.deepEqual(f.controller.copyWaterState(),{phase:5,amplitude:0,lastMap:0,previous:[0,0],updates:20,passes:0});
  assert.throws(()=>f.controller.preparePresentation(first),code('LEGACY_SCENE_FRAME_PRESENTATION_STALE'));
  const result=f.controller.preparePresentation(layer),state=f.controller.copyWaterState();assert.deepEqual(result.waterEffect,{phase:5,amplitude:0});assert.equal(state.amplitude,2);assert.equal(state.passes,1);assert.equal(f.controller.preparePresentation(layer),result);assert.equal(f.controller.preparePresentation(result),result);
  const cmds=result.drawPlan.commands.map(c=>{if(c.waterStrip)return c;const{image,...rest}=c;return {...rest,sprite:f.res.sprite(image)};});
  const a=api.composeLegacyGameFrame(640,480,cmds),b=api.composeLegacyGameFrame(640,480,cmds);assert.equal(sha(a.rgba),sha(b.rgba));assert.deepEqual(f.controller.copyWaterState(),state);
  assert.deepEqual(result.drawOrder.map(c=>c.kind),['map','water-strip']);
 }finally{f.close();}
});
test('special marker survives native queue trim; normal3 andspecial4 helper reservations are distinct',()=>{
 const f=waterFixture(api,v,av),empty=api.createLegacyGameMapState(7,40000,mapBytes(1,1,[[0],[0],[16384]]),0);
 try{for(const special of [false,true]){const overlays=Array.from({length:4096},(_,i)=>({id:i,kind:'fill',command:{image:{index:special&&i===4095?3096:1002,paletteSelector:0,flags:0,color:0xffffffff},x:0,y:0,priority:5}})),layer=f.controller.step(f.request,f.scene,empty,[],undefined,overlays);
   assert.equal(layer.droppedDraws,special?4:3);assert.equal(layer.drawPlan.commands.length,4093);assert.equal(layer.waterRequested,special?true:undefined);assert.equal(layer.drawPlan.commands.some(c=>c.image?.index===3096),false);assert.equal(layer.drawPlan.commands.filter(c=>c.waterStrip).length,special?1:0);
  }
 }finally{empty.close();f.close();}
});
test('prepared anddeferred map paths agree; reset andscene identity changes preserve phase butreset eligible amplitude',()=>{
 const a=waterFixture(api,v,av),b=waterFixture(api,v,av,{deferImages:false});
 try{for(let i=0;i<70;i++){const scene={identity:[7,i<65?40000:59000],checksumMode:0};if(i===30){a.controller.reset();b.controller.reset();}
   const request={...a.request,tick:i,camera:[i*.5,i*.25]},deferred=a.controller.step(request,scene,a.map,[]),prepared=b.controller.step(request,scene,b.map,[]),commands=deferred.drawPlan.commands.map(c=>{if(c.waterStrip)return c;const{image,...rest}=c;return {...rest,sprite:a.res.sprite(image)};});
   assert.equal(sha(api.composeLegacyGameFrame(640,480,commands).rgba),sha(prepared.rgba));assert.deepEqual(a.controller.copyWaterState(),b.controller.copyWaterState());if(i===65)assert.equal(deferred.waterEffect.amplitude,0);
  }
 }finally{a.close();b.close();}
});
test('gate values andmap range are explicit; 5009-style resource names do not replace graphic-index detection',()=>{
 const water=api.createLegacyGameWater();try{for(const map of [39999,40000,41999,42000,59000,59001,59100,59002]){water.advance();const result=water.present(true,map,[0,0],[0,0],[320,240]);assert.equal(result!==null,[40000,41999,59000,59001,59100].includes(map));}
  assert.equal(water.present(true,40000,[0,0],[0,0],[320,240],1),null);assert.equal(water.copyState().amplitude,0);
  assert.equal(api.isLegacyGameWaterGraphic(3095),false);assert.equal(api.isLegacyGameWaterGraphic(3096),true);assert.equal(api.isLegacyGameWaterGraphic(3105),true);assert.equal(api.isLegacyGameWaterGraphic(3106),false);
 }finally{water.close();}assert.throws(()=>water.advance(),code('LEGACY_WATER_CLOSED'));
});
function wireWorld(f){
 const world=api.createLegacyGameWorldProtocol();world.configureLocalMovement(f.res.graphics,v.sourceContext);world.configureActorResources(8);world.configureActorFrames({animations:f.res.animations,graphics:f.res.graphics,source:()=>v.actorSource,geometry:f.res.geometry,sprite:f.res.sprite,initialPhase:0,deferImages:true});
 world.configureSceneFrames({...f.config,context:()=>({tileCenter:world.copyGameState().localMovement.display,drawPrimitives:false})});
 const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex'));world.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(world.next().kind,'bootstrap');const codec=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));
 const base62=n=>{let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;};
 try{for(const hex of v.protocol.beforePlainHex){const words=Buffer.from(hex,'hex').toString().split(' ');if(words[0]==='TfD'){words[2]=base62(40000);words[9]='0';}if(words[0]==='=mJ'){words[2]=base62(40000);const planes=words[7].split('|').map(p=>p.split(','));planes[0].fill(base62(5000));planes[1].fill('0');planes[2].fill(base62(16384));words[7]=planes.map(p=>p.join(',')).join('|');}world.append(api.encodeLegacyGameEnvelope(codec.encode(new TextEncoder().encode(words.join(' ')))));assert.equal(world.next().kind,'message');}}
 finally{codec.close();}return world;
}
test('actual original wire world andclock choose20th frame; owned water survives scene-controller replacement',()=>{
 const f=waterFixture(api,v,av),world=wireWorld(f),runtime=api.createLegacyGameRuntime({world,initialTick:1000,initialCamera:[128,192]});
 try{assert.equal(world.copyScene().identity[1],40000);const frame={tick:10000,runtime:v.runtime,center:[320,240],width:640,height:480,input:originalInput(world,read('../../analysis/game-input-runtime-v1/original-vectors.json').context),graphicsMode:2,forceRender:false},r=runtime.pump(frame);
  assert.equal(r.error,null);assert.equal(r.updates,20);assert.equal(r.present,true);assert.equal(r.frame.sceneLayer.waterEffect.amplitude,0);assert.equal(world.copyWaterState().updates,20);assert.equal(world.copyWaterState().passes,1);assert.equal(world.copyWaterState().amplitude,2);assert.equal(world.prepareFramePresentation(r.frame),r.frame);assert.equal(world.copyWaterState().passes,1);
  const state=world.copyWaterState();world.configureSceneFrames({...f.config,context:()=>({tileCenter:world.copyGameState().localMovement.display,drawPrimitives:false})});assert.deepEqual(world.copyWaterState(),state);
 }finally{runtime.close();world.close();f.close();}
});
test('water source position is separate fromcamera; rejected old presentation cannot advance the owner',()=>{
 const f=waterFixture(api,v,av);try{const first=f.controller.step(f.request,f.scene,f.map,[],undefined,[],true,[0,64]);const result=f.controller.preparePresentation(first);assert.deepEqual(result.waterEffect,{phase:3,amplitude:0});assert.deepEqual(f.controller.copyWaterState().previous,[0,64]);
  f.controller.step(f.request,f.scene,f.map,[],undefined,[],true,[0,128]);const state=f.controller.copyWaterState();assert.throws(()=>f.controller.preparePresentation(first),code('LEGACY_SCENE_FRAME_PRESENTATION_STALE'));assert.deepEqual(f.controller.copyWaterState(),state);
 }finally{f.close();}
});
test('water draw descriptors own numeric values and reject invalid rectangles,accessors,and work overflow',()=>{
 const value={phase:0,amplitude:0},p=api.createLegacyGameDrawPlan(640,480,[{waterStrip:value,priority:2}]);value.phase=63;assert.equal(p.commands[0].waterStrip.phase,0);assert.ok(Object.isFrozen(p.commands[0].waterStrip));
 for(const waterStrip of [{phase:-1,amplitude:0},{phase:64,amplitude:0},{phase:0,amplitude:1},{phase:0,amplitude:102},{phase:0,amplitude:0,extra:true}])assert.throws(()=>api.createLegacyGameDrawPlan(640,480,[{waterStrip,priority:2}]));
 let reads=0;assert.throws(()=>api.createLegacyGameDrawPlan(640,480,[{get waterStrip(){reads++;},priority:2}]));assert.equal(reads,0);assert.throws(()=>api.createLegacyGameDrawPlan(640,480,[{waterStrip:{phase:0,amplitude:0},priority:1}]));
 assert.throws(()=>api.composeLegacyGameFrame(640,480,Array.from({length:128},()=>({waterStrip:{phase:0,amplitude:0},priority:2}))),code('LEGACY_RENDER_WORK_BUDGET'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as source from '../index.mjs';
import {verifyCityWater} from '../../analysis/game-city-water-v1/reference.mjs';
import {cityFixture} from '../../analysis/game-city-water-v1/fixture.mjs';
import {createLegacyGameCityReturnCanvas} from '../../web/legacy-game-city-return-canvas.mjs';
const api=process.env.MOLI_CITY_WATER_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_CITY_WATER_BUILD)):source,turn=()=>new Promise(r=>setImmediate(r)),v=JSON.parse(readFileSync(new URL('../../analysis/game-city-water-v1/original-vectors.json',import.meta.url)));
test('actual client/wire/world matches1800 independent city states and98 complete water/type15 frames',async()=>{
 const r=await verifyCityWater(api,v);assert.equal(r.stateChecks,1800);assert.equal(r.completeFrames,98);assert.equal(r.traces,12);
});
test('held nested capture commits one outer update beforeIO; retarget cancels it without replay or stale paint',async()=>{
 let release,cancels=0,updates=0;const image=new Uint8Array(640*480*4).fill(7),c=api.createLegacyGameCityReturn(null,()=>({done:new Promise(r=>release=r),cancel(){cancels++;}}),'map',()=>updates++);
 try{c.begin('scene');for(let i=0;i<5;i++)c.present(await c.advance(i),()=>{});const job=c.advance(5);assert.equal(updates,6);assert.equal(await c.advance(5),null);assert.equal(updates,6);c.begin('boundary');release({rgba:image});assert.equal(await job,null);assert.equal(cancels,1);assert.ok(image.every(n=>n===0));assert.equal(updates,6);assert.equal(await c.advance(6),null);assert.equal(updates,7);}finally{c.close();}
});
test('unpresented ordinary awaiting image is not advanced twice; a new scene owns the newest committed capture',async()=>{
 let updates=0,ordinary=0;const image=new Uint8Array(640*480*4).fill(9),c=api.createLegacyGameCityReturn(null,(tick,mode)=>{assert.equal(mode,'awaiting');ordinary++;return{done:Promise.resolve({rgba:image}),cancel(){}};},'map',(tick,prepared)=>{assert.equal(prepared,true);updates++;});
 try{const first=await c.advance(1);assert.equal(updates,1);assert.equal(ordinary,1);assert.equal(await c.advance(2),null);assert.equal(updates,1);c.present(first,()=>{});c.begin('scene');assert.equal(c.inspect().phase,'leaving');}finally{c.close();assert.ok(image.every(n=>n===0));}
});
test('an awaiting resource read canceled by a scene switch settles once and releases its image',async()=>{
 let release,updates=0,cancels=0;const image=new Uint8Array(640*480*4).fill(5),c=api.createLegacyGameCityReturn(null,()=>({done:new Promise(r=>release=r),cancel(){cancels++;}}),'map',()=>updates++);
 try{const held=c.advance(0);assert.equal(updates,1);c.begin('scene');release({rgba:image});assert.equal(await held,null);assert.equal(cancels,1);assert.ok(image.every(n=>n===0));assert.equal(updates,1);}finally{c.close();}
});
test('scene capture leaves the ordinary body absent until a real own-unit callback recreates it',async()=>{
 const c=await cityFixture(api);try{c.world.beginCityReturn();await c.send(c.scene(59000));await c.send(c.patch(59000));await c.f.drive(()=>c.f.client.inspect().sceneReady);assert.equal(c.world.copyGameState().actors.localActor,null);const state=c.world.copyWaterState();const captured=c.world.captureCityReturn(100,c.request,'scene');assert.equal(captured.actorFrameError,null);assert.equal(captured.sceneFrameError,null);assert.equal(c.world.copyWaterState().updates,state.updates);assert.equal(c.world.copyGameState().actors.localActor,null);await c.send(c.own);assert.ok(c.world.copyGameState().actors.localActor);c.world.finishCityReturn();}finally{c.close();}
});
test('city water APIs reject foreign routes and noncity use before state changes',async()=>{
 const c=await cityFixture(api);try{const before=c.world.copyWaterState();assert.throws(()=>c.world.advanceCityReturnWater(c.request),{code:'LEGACY_GAME_CITY_RETURN_STATE'});c.world.beginCityReturn();assert.throws(()=>c.world.captureCityReturn(1,c.request,'invented'),{code:'LEGACY_GAME_CITY_RETURN_STATE'});assert.deepEqual(c.world.copyWaterState(),before);c.world.finishCityReturn();}finally{c.close();}
});
test('shared Canvas continues waiting-server frames and close invalidates an already scheduled callback',async()=>{
 const timers=[],draws=[];let advances=0,closed=0;const rgba=new Uint8Array(640*480*4).fill(3),client={inspect:()=>({cityReturn:{phase:'awaiting-server'}}),async advanceCityReturn(){advances++;return{rgba};},presentCityReturn(frame,paint){paint(frame.rgba,640,480);},fail(e){throw e;}},context={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),putImageData:i=>draws.push(i.data[0])};
 const c=createLegacyGameCityReturnCanvas({canvas:{width:640,height:480,getContext:()=>context},client,clock:()=>0,schedule(fn,delay){const t={fn,delay};timers.push(t);return t;},cancel(){closed++;},onImage(){}});
 c.sync();assert.equal(timers.length,1);const first=timers.shift();first.fn();await turn();assert.equal(advances,1);assert.deepEqual(draws,[3]);const stale=timers.shift();c.close();stale.fn();await turn();assert.equal(advances,1);assert.equal(closed,1);
});
test('client close cancels an awaiting RD request and releases retained water resources',async()=>{
 const c=await cityFixture(api);try{assert.equal(c.f.client.requestCityReturn(),true);c.f.files.controls.hold='Bin/Graphic.bin';const job=c.f.client.advanceCityReturn(1);for(let i=0;i<40&&!c.f.files.pending.length;i++)await turn();assert.equal(c.f.files.pending.length,1);const state=c.world.copyWaterState();assert.equal(state.updates,1);c.f.client.close();c.f.files.pending.shift()();assert.equal(await job,null);assert.equal(c.f.client.inspect().state,'closed');assert.equal(c.f.client.inspect().cleanupErrors,0);}finally{c.close();}
});

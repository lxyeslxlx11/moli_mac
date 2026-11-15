import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import * as api from '../index.mjs';
import { originalWorld,originalFrame } from '../../analysis/game-input-runtime-v1/original_world.mjs';
const directory=new URL('../../analysis/game-input-runtime-v1/',import.meta.url),read=url=>JSON.parse(readFileSync(url)),v=read(new URL('original-vectors.json',directory)),sv=read(new URL('../../analysis/game-legacy-scene-frame-v1/original-vectors.json',import.meta.url)),av=read(new URL('../../analysis/game-legacy-animation-v1/original-vectors.json',import.meta.url));
const plain=x=>JSON.parse(JSON.stringify(x)),error=code=>e=>e.code===code,sha=x=>createHash('sha256').update(x).digest('hex');
function setup(extra){const fixture=originalWorld(api,sv,av,extra);fixture.seed();const runtime=api.createLegacyGameRuntime({world:fixture.world,initialTick:1000,initialCamera:[128,192]});return{...fixture,runtime,close(){runtime.close();fixture.close();}};}
test('1213 independent inverse/bias/C-truncation picks include negative boundaries',()=>{
 for(const row of v.picks){assert.deepEqual(api.unprojectLegacyGamePosition(row.screen,row.camera,row.center),row.expected.position);assert.deepEqual(plain(api.pickLegacyGameTile(row.screen,row.camera,row.center)),row.expected);}
 assert.deepEqual(api.pickLegacyGameTile([0,0],[-64,-64],[0,0]).tile,[0,0]);
});
test('inverse inputs reject nonfinite,sparse,accessor andundefined ftol overflow domains',()=>{
 let reads=0;const screen=[0,0];Object.defineProperty(screen,'0',{get(){reads++;return 0;}});assert.throws(()=>api.pickLegacyGameTile(screen,[0,0],[0,0]),error('LEGACY_INPUT_FIELDS'));assert.equal(reads,0);
 for(const pair of [[Infinity,0],new Array(2),[1,2,3],[0,0x100000000]])assert.throws(()=>api.pickLegacyGameTile([0,0],[0,0],pair));
 assert.throws(()=>api.pickLegacyGameTile([0,0],[2147483648,0],[0,0]),error('LEGACY_INPUT_INTEGER'));
});
test('independent raw edges/double down/hold/auto cancellation/gates/tick-wrap traces',()=>{
 for(const trace of v.pointerTraces){const p=api.createLegacyGamePointer();try{for(const row of trace.rows){for(const [op,...args] of row.events){if(op==='reset')p.resetButtons();else p[op](...args);}assert.deepEqual(plain(p.step(row.request)),row.expected,trace.name);p.endUpdate(row.graphicsMode);assert.deepEqual(plain(p.copyState()),row.state,trace.name);}}finally{p.close();}}
});
test('down+up between updates retains primary edge andauto walking continues after release',()=>{
 const fast=v.pointerTraces.find(t=>t.name==='fast-click').rows[0],p=api.createLegacyGamePointer();try{p.move([256,48]);p.press(0);p.release(0);const result=p.step(fast.request);assert.deepEqual(result.destination,[5,3]);assert.equal(result.leftHeld,false);assert.equal(result.leftPress,true);}finally{p.close();}
 const rows=v.pointerTraces[0].rows;assert.equal(rows[2].expected.autoWalk,1);assert.deepEqual(rows[4].expected.destination,[5,3]);assert.equal(rows[5].expected.autoWalk,0);assert.equal(rows[5].expected.destination,null);
});
test('pointer reset clears only raw buttons;closed ownership rejects mutation',()=>{
 const p=api.createLegacyGamePointer(),rows=v.pointerTraces[0].rows;for(const row of rows.slice(0,3)){for(const [op,...args] of row.events)p[op](...args);p.step(row.request);p.endUpdate(2);}p.resetButtons();assert.equal(p.copyState().autoWalk,1);assert.equal(p.copyState().pressedBits,0);p.close();p.close();assert.throws(()=>p.press(0),error('LEGACY_INPUT_CLOSED'));
});
test('1800 independent clock calls cover strictwait,late skip,force/mode0 anduint32 rollover',()=>{
 for(const trace of v.clockTraces){const clock=api.createLegacyGameClock(trace.initialTick);try{for(const row of trace.rows){assert.deepEqual(clock.begin(row.tick),row.begin,trace.name);if(row.finish)assert.deepEqual(clock.finish(row.tick,{graphicsMode:row.mode,forceRender:row.force}),row.finish,trace.name);assert.deepEqual(clock.copyState(),row.state,trace.name);}}finally{clock.close();}}
});
test('source clock skips exactly19logic updates thenmustpresent;forced mode0 presents',()=>{
 const c=api.createLegacyGameClock(0);try{for(let i=0;i<19;i++){assert.equal(c.begin(10000).ready,true);assert.equal(c.finish(10000,{graphicsMode:2,forceRender:false}).repeat,true);}c.begin(10000);assert.equal(c.finish(10000,{graphicsMode:2,forceRender:false}).present,true);assert.equal(c.copyState().updates,20);
 c.reset(10000);c.begin(10000);assert.deepEqual(c.finish(10000,{graphicsMode:0,forceRender:true}),{present:true,repeat:false,graphicsMode:0,waitMilliseconds:1});assert.equal(c.begin(10000).ready,false);assert.equal(c.begin(10001).ready,true);
 }finally{c.close();}assert.throws(()=>c.begin(0),error('LEGACY_CLOCK_CLOSED'));
});
test('clock misuse fails before accounting;reset isexplicit andcannot interrupt an update',()=>{
 const c=api.createLegacyGameClock(100);assert.throws(()=>c.finish(100,{graphicsMode:2,forceRender:false}),error('LEGACY_CLOCK_SEQUENCE'));c.begin(100);assert.throws(()=>c.reset(1),error('LEGACY_CLOCK_SEQUENCE'));assert.throws(()=>c.begin(100),error('LEGACY_CLOCK_SEQUENCE'));assert.throws(()=>c.finish(100,{graphicsMode:2,forceRender:1}),error('LEGACY_CLOCK_ARGUMENTS'));assert.equal(c.copyState().updates,0);c.finish(100,{graphicsMode:2,forceRender:false});c.reset(0);assert.equal(c.copyState().deadline,0);c.close();
});
test('actual wire world -> fastclick ->52 independent camera-follow sceneRGBA frames',()=>{
 const f=setup();try{f.runtime.move([256,48]);f.runtime.press(0);f.runtime.release(0);const requests=[];for(const row of v.worldFrames){const r=f.runtime.pump(originalFrame(f.world,sv,v.context,{tick:row.tick}));assert.equal(r.updates,1);assert.equal(r.present,true);assert.equal(r.error,null);assert.deepEqual(r.frame.camera,row.camera);assert.deepEqual(r.frame.actorLayer.actors[0].screenPosition,row.actorScreen);assert.equal(sha(r.frame.sceneLayer.rgba),row.scene.rgbaSha256);assert.deepEqual(f.world.copyLocalMovement().display,row.display);requests.push(...r.requests);}assert.equal(requests.length,2);assert.deepEqual(f.world.copyLocalMovement().position,[320,192]);}finally{f.close();}
});
test('late runtime advances20 source steps,keeps allrequests,andpublishes onlythe20th',()=>{
 const f=setup();try{f.runtime.move([256,48]);f.runtime.press(0);f.runtime.release(0);const r=f.runtime.pump(originalFrame(f.world,sv,v.context,{tick:10000}));assert.equal(r.error,null);assert.equal(r.updates,20);assert.equal(r.inputUpdates.length,20);assert.equal(r.present,true);assert.equal(r.requests.length,1);assert.equal(f.world.copyLocalMovement().frames,20);assert.equal(f.world.copyGameState().sceneFrames.frames,20);assert.equal(f.runtime.copyState().pointer.pressedBits,0);
 }finally{f.close();}
});
test('waiting pumps preserve queuedpress anddo not advanceworld orclear edges',()=>{
 const f=setup();try{f.runtime.pump(originalFrame(f.world,sv,v.context));f.runtime.move([256,48]);f.runtime.press(0);f.runtime.release(0);const wait=f.runtime.pump(originalFrame(f.world,sv,v.context));assert.equal(wait.updates,0);assert.equal(f.runtime.copyState().pointer.pressedBits,5);const next=f.runtime.pump(originalFrame(f.world,sv,v.context,{tick:1017}));assert.deepEqual(next.inputUpdates[0].destination,[5,3]);assert.equal(next.requests.length,1);}finally{f.close();}
});
test('follow camera uses postmovement position andupdated source window;old advanceFrame camera remainscaller-owned',()=>{
 const f=setup();try{f.world.requestLocalDestination([5,3]);const initial=f.world.copyLocalMovement(),r=f.world.advanceFrameFollowingLocal({tick:1000,runtime:sv.runtime,camera:[-9,-9],center:[160,120],width:320,height:240});assert.equal(r.camera[0],initial.position[0]+4);assert.deepEqual(r.camera,f.world.copyLocalMovement().position);assert.deepEqual(r.actorLayer.actors[0].screenPosition,[160,120]);const old=f.world.advanceFrame({tick:1001,runtime:sv.runtime,camera:[0,0],center:[0,0],width:320,height:240});assert.equal(Object.hasOwn(old,'camera'),false);assert.notDeepEqual(old.actorLayer.actors[0].screenPosition,[160,120]);}finally{f.close();}
});
test('own-gate skips localmovement whileallowed actionreset precedes return',()=>{
 const f=setup();try{f.world.setLocalMovementContext({...sv.sourceContext,nativeActionGuard:1});const runtime={...sv.runtime,ownGateByte:128};const r=f.runtime.pump(originalFrame(f.world,sv,v.context,{runtime,input:{...v.context,ownGateByte:128,nativeActionGuard:1,actionResetEligible:true}}));assert.equal(r.frame.movement,null);assert.equal(f.world.copyLocalMovement().frames,0);assert.equal(f.world.copyLocalMovement().context.nativeActionGuard,0);assert.equal(r.inputUpdates[0].advanceLocal,false);}finally{f.close();}
});
test('local context setter preserves path andposition ratherthan replacing movementcontroller',()=>{
 const f=setup();try{f.world.requestLocalDestination([5,3]);f.world.advanceLocalMovement(1000);const before=f.world.copyLocalMovement();f.world.setLocalMovementContext({...before.context,nativeActionGuard:1});const after=f.world.copyLocalMovement();assert.deepEqual(after.position,before.position);assert.deepEqual(after.route,before.route);assert.deepEqual(after.queuedDirections,before.queuedDirections);assert.equal(after.frames,before.frames);assert.equal(after.context.nativeActionGuard,1);}finally{f.close();}
});
test('runtime rejects mismatched shared gates andfake world,borrows genuineworld onclose',()=>{
 assert.throws(()=>api.createLegacyGameRuntime({world:{inspect:()=>({worldStateEnabled:true})},initialTick:0,initialCamera:[0,0]}),error('LEGACY_GAME_RUNTIME_WORLD_REQUIRED'));const f=setup();try{assert.throws(()=>f.runtime.pump(originalFrame(f.world,sv,v.context,{input:{...v.context,ownGateByte:128}})),error('LEGACY_RUNTIME_CONTEXT_MISMATCH'));assert.equal(f.runtime.copyState().clock.updates,0);f.runtime.close();assert.equal(f.world.inspect().state,'open');assert.throws(()=>f.runtime.move([0,0]),error('LEGACY_RUNTIME_CLOSED'));}finally{f.close();}
});
test('wire positioncorrection is picked through priorcamera thenfollowed after sourceupdate',()=>{
 const f=setup();try{f.runtime.pump(originalFrame(f.world,sv,v.context));const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),codec=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));try{f.world.append(api.encodeLegacyGameEnvelope(codec.encode(bytes(v.protocol.afterPlainHex[0]))));f.world.next();}finally{codec.close();}
 assert.deepEqual(f.world.copyLocalMovement().position,[384,256]);assert.deepEqual(f.runtime.copyState().camera,[128,192]);f.runtime.move([160,120]);const r=f.runtime.pump(originalFrame(f.world,sv,v.context,{tick:1017}));assert.deepEqual(r.inputUpdates[0].tile,[2,3]);assert.deepEqual(r.frame.camera,[384,256]);assert.deepEqual(f.runtime.copyState().camera,[384,256]);
 }finally{f.close();}
});
test('own gate keeps previous camera evenif a wire message alreadycorrected localposition',()=>{
 const f=setup();try{f.runtime.pump(originalFrame(f.world,sv,v.context));const codec=api.createLegacyGamePayloadCodec(new Uint8Array(Buffer.from(v.bootstrap.keyHex,'hex')));try{f.world.append(api.encodeLegacyGameEnvelope(codec.encode(new Uint8Array(Buffer.from(v.protocol.afterPlainHex[0],'hex')))));f.world.next();}finally{codec.close();}
 const runtime={...sv.runtime,ownGateByte:128};const r=f.runtime.pump(originalFrame(f.world,sv,v.context,{tick:1017,runtime,input:{...v.context,ownGateByte:128}}));assert.equal(r.frame.movement,null);assert.deepEqual(r.frame.camera,[128,192]);assert.deepEqual(f.runtime.copyState().camera,[128,192]);assert.deepEqual(f.world.copyLocalMovement().position,[384,256]);
 }finally{f.close();}
});
test('scene failure preserves actual pending request anddoes notclaim presentation',()=>{
 const f=setup({sprite:()=>{throw Error('private provider detail');}});try{f.runtime.move([256,48]);f.runtime.press(0);const r=f.runtime.pump(originalFrame(f.world,sv,v.context));assert.equal(r.present,false);assert.equal(r.requests.length,1);assert.deepEqual(r.error,{code:'LEGACY_GAME_SCENE_FRAME_FAILED'});assert.ok(r.frame.actorLayer.rgba.length);assert.equal(f.world.inspect().state,'open');assert.doesNotMatch(JSON.stringify(r.error),/private/);}finally{f.close();}
});
test('providers cannot reenter runtime;descriptor close cancellation cannot commitpixels',()=>{
 let f,frame;f=setup({context:()=>{f.runtime.pump(frame);}});try{frame=originalFrame(f.world,sv,v.context);const r=f.runtime.pump(frame);assert.equal(r.present,false);assert.equal(r.error.code,'LEGACY_RUNTIME_REENTRANT');}finally{f.close();}
 let g;g=setup({context:()=>{g.runtime.close();return{tileCenter:[2,3],drawPrimitives:false};}});try{assert.throws(()=>g.runtime.pump(originalFrame(g.world,sv,v.context)),error('LEGACY_RUNTIME_CLOSED'));assert.equal(g.runtime.inspect().state,'closed');assert.equal(g.world.inspect().state,'open');}finally{g.close();}
});
test('independent Python TCP -> actual pointer/runtime/52scene digests ->2verified outgoing frames',{timeout:15000},async()=>{
 const temp=await mkdtemp(join(tmpdir(),'moli-original-input-'));for(const [source,target] of [['../game-legacy-scene-frame-v1/original_peer.py','original_peer.py'],['original-vectors.json','original-vectors.json'],['../game-legacy-message-v1/generate_vectors.py','wire_reference.py']])await copyFile(new URL(source,directory),join(temp,target));
 const child=spawn('python3',[join(temp,'original_peer.py')],{stdio:['ignore','pipe','pipe']}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),f=originalWorld(api,sv,av);let socket,runtime,events=0,final,diagnostics='';child.stderr.on('data',b=>{diagnostics+=b;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
 try{const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{f.world.append(chunk);for(;;){const e=f.world.next();if(e.kind==='need-more')break;if(!e.effect)continue;events++;
  if(events===v.protocol.beforePlainHex.length){runtime=api.createLegacyGameRuntime({world:f.world,initialTick:1000,initialCamera:[128,192]});runtime.move([256,48]);runtime.press(0);runtime.release(0);for(const row of v.worldFrames){const r=runtime.pump(originalFrame(f.world,sv,v.context,{tick:row.tick}));assert.equal(r.error,null);assert.equal(sha(r.frame.sceneLayer.rgba),row.scene.rgbaSha256);for(const q of r.requests)socket.write(f.world.encodeCommand(q.operationId,q.arguments));}}
  if(events===v.protocol.beforePlainHex.length+1)final=f.world.copyLocalMovement();}}catch(error){reject(error);}});socket.once('end',resolve);});assert.deepEqual(final.position,[384,256]);const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,2);assert.equal(await exit,0,diagnostics);f.world.finish();
 }finally{runtime?.close();f.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
});

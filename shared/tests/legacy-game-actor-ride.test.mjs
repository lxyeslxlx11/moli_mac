import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vectors as v,ascii,sha,unit,action,rideFixture,send,enterRide,checkRideFrame} from '../../web/tests/helpers/legacy-game-actor-ride-fixture.mjs';
const source=r=>({...scene.actorSource,...r});
function controller(f,options={}){const a=api.createLegacyGameActors();a.prepareCharacterEntry();a.configureResources(8);a.configureSceneMode(1);a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,100);a.applyUnits(ascii(unit()+'\t'+unit('3e',2,100001,71)));const c=f.client.library().catalogs();
 const frame=createLegacyGameActorFrameController(a,{graphics:c.graphics,animations:c.animations,source:()=>source(options.source?.()),geometry:(q,actor)=>options.geometry?options.geometry(q,actor,a,f.client.library()):f.client.library().geometry(q),initialPhase:0,deferImages:true,bindActorSource:true});
 return {a,frame,request:{tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240},close(){frame.close();a.close();}};}
async function withController(fn,options){const f=rideFixture();try{await clientEnter(f);const c=controller(f,options);try{await fn(c,f);}finally{c.close();}}finally{f.close();}}
test('independent native mapping ranges, action classes, previous/current attachment plans and outcomes',()=>{
 for(const r of v.resourceCases)assert.equal(api.resolveLegacyGameMountedResource(r.input),r.expected);
 for(const r of v.actionCases)assert.deepEqual(api.projectLegacyGameMountedAction(r.resource,r.action),r.expected);
 for(const r of v.plans)assert.deepEqual(api.planLegacyGameActorRide(r.input),r.expected);
 for(const r of v.outcomes)assert.deepEqual(api.legacyGameActorRideOutcome(...r.input),r.expected);
});
test('ride pure inputs reject accessors, unknown fields and native integer overflow domains without reading getters',()=>{
 let reads=0;const r={state:1,counter:0,attachmentX:1,attachmentY:-30};Object.defineProperty(r,'counter',{get(){reads++;return 0;}});assert.throws(()=>api.planLegacyGameActorRide(r),api.LegacyGameActorRideError);assert.equal(reads,0);
 for(const r of [{state:0,counter:0,attachmentX:0,attachmentY:0},{state:2,counter:46341,attachmentX:0,attachmentY:0},{state:1,counter:30,attachmentX:2147483647,attachmentY:0},{state:1,counter:0,attachmentX:0,attachmentY:0,other:0}])assert.throws(()=>api.planLegacyGameActorRide(r));
 assert.throws(()=>api.resolveLegacyGameMountedResource(1.5));assert.ok(Object.isFrozen(api.planLegacyGameActorRide({state:1,counter:0,attachmentX:0,attachmentY:0}).offset));
});
test('actual local and remote70 owns children, ignores packet facing and coordinates, preserves normal resources',()=>withController(c=>{
 c.a.applyActions(ascii(action() + ',' + action('3e',70,100007,123)));const s=c.a.copyState();for(const a of [s.localActor,...s.remoteActors]){assert.equal(a.rawResourceId,114000);assert.equal(a.normalRawResourceId,100001);assert.equal(a.ride.state,1);assert.equal(a.ride.counter,0);assert.equal(a.sourceControlUnmodeled,false);assert.deepEqual(a.motion.display,[2,3]);assert.equal(a.ride.child.action,0);}
 assert.equal(s.localActor.motion.facingCode,4);assert.equal(s.remoteActors[0].motion.facingCode,2);
}));
test('actual persistent client produces110 independent complete scene rasters through enter, ordinary, exit and reentry',async()=>{
 const f=rideFixture();try{await enterRide(f);for(let i=0;i<v.full.frames.length;i++){if(i===v.full.exitAt)await send(f,Buffer.from(v.full.exitPlainHex,'hex').toString('ascii'));if(i===v.full.reenterAt)await send(f,Buffer.from(v.full.entryPlainHex,'hex').toString('ascii'));
  const e=v.full.frames[i],out=f.client.runtime().pump({...f.client.readFrame(),tick:e.tick});checkRideFrame(api,f.client,out,e);const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),e.rgbaSha256,'source70 full scene frame '+(i+1));}
 }finally{f.close();}
});
test('entry completion uses current childY while interpolation clamp uses previous childY',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',70,100007)));let last;for(let i=0;i<16;i++)last=c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().ride.state,0);assert.equal(c.a.copyLocalActor().ride.counter,16);assert.equal(last.actors.find(a=>a.local).ridePlan.offset[1],-225);assert.equal(last.actors.find(a=>a.local).childAnimation.attachmentY,-300);assert.equal(last.events.some(e=>e.value===462),true);assert.equal(c.frame.inspect().childPlayers,1);
}));
test('exit fastforward keeps original counter forX and suppresses463 when working counter becomes positive',()=>withController(c=>{
 c.a.applyActions(ascii(action()+','+action('3e')));for(let i=0;i<8;i++)c.frame.step(c.request,1);c.a.applyActions(ascii(action('1C',70,-1)));const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local);assert.ok(a.ridePlan.counter>0);assert.equal(out.events.some(e=>e.actorId===100&&e.value===463),false);assert.equal(a.ridePlan.offset[0],a.ridePlan.offset[0]|0);const before=c.a.copyLocalActor().ride.counter;
 c.a.applyActions(ascii(action('1C',70,-1)));assert.equal(c.a.copyLocalActor().ride.counter,before);c.a.applyActions(ascii(action('3e',70,-1)));c.frame.step(c.request,1);assert.ok(c.a.copyState().remoteActors[0].ride.counter>0);c.a.applyActions(ascii(action('3e',70,-1)));assert.equal(c.a.copyState().remoteActors[0].ride.counter,0);
}));
test('source gates stall ride counters; frozen parent still steps independently owned child/effect',()=>withController(c=>{
 c.a.applyActions(ascii(action()));c.frame.step({...c.request,runtime:{...scene.runtime,ownGateByte:128}},1);assert.equal(c.a.copyLocalActor().ride.counter,0);const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local);assert.equal(a.animation.graphicIndex,-1);assert.equal(a.childAnimation.graphicIndex,1002);assert.equal(a.effectAnimation.graphicIndex,1005);assert.equal(a.helperCalls,3);
},{source:()=>({frozen:1})}));
test('special compound enqueue is effect, body, mount; depth has source float epsilon and zero own flag',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const out=c.frame.step(c.request,1),root=c.frame.copySceneRoots().find(r=>r.id===100);assert.deepEqual(root.commands.map(x=>x.image.index),[1005,1005,1002]);assert.equal(root.sortFlag,0);assert.equal(root.position[1],Math.fround(192+Math.fround(.001)));const inserted=out.submittedActorIds.map((id,i)=>id===100?i:-1).filter(i=>i>=0);assert.equal(inserted.length,3);assert.deepEqual(out.drawPlan.drawOrder.filter(i=>inserted.includes(i)),[...inserted].reverse());
}));
test('sound events use unshifted parent coordinates and zero-initialized child coordinates; scene9 masks only mount sounds',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const out=c.frame.step({...c.request,runtime:{...scene.runtime,soundScene:9}},1),events=out.events.filter(e=>e.actorId===100);assert.ok(events.some(e=>e.kind==='sound'&&e.value===465&&e.screenPosition[0]===160&&e.screenPosition[1]===120));assert.equal(events.some(e=>e.child==='child'&&e.kind==='sound'),false);assert.ok(events.some(e=>e.child==='effect'&&e.screenPosition.every(n=>n===0)));
}));
test('no-child exit consumes special frame without a fabricated root and restores normal resource',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',80,114000)));c.a.applyActions(ascii(action('1C',70,-1)));const out=c.frame.step(c.request,1);assert.equal(out.actors.find(a=>a.local).helperCalls,0);assert.equal(c.frame.copySceneRoots().some(r=>r.id===100),false);assert.equal(c.a.copyLocalActor().rawResourceId,100001);assert.equal(c.a.copyLocalActor().ride.state,0);
}));
test('ordinary mounted action projection and loop mode use child action; child resources declared1 are still drawn',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',70,100008)));for(let i=0;i<35;i++)c.frame.step(c.request,1);c.a.applyActions(ascii(action('1C',2,0,0)));const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local);assert.equal(a.handler,'source-mounted');assert.equal(a.motion.animation,3);assert.equal(a.ride.child.action,2);assert.equal(a.animation.mode,1);assert.equal(a.childAnimation.mode,1);assert.equal(c.frame.copySceneRoots().find(r=>r.id===100).commands.length,2);assert.equal(a.helperCalls,2);
}));
test('local movement performs native transition motion and synchronizes its owner for the following input tick',async()=>{
 const f=rideFixture();try{await enterRide(f);const r=f.client.runtime();r.move([192,136]);r.press(0);let previous=192;
 for(let i=0;i<5;i++){const out=r.pump({...f.client.readFrame(),tick:v.full.frames[i].tick});assert.equal(out.error,null);const a=f.client.copyWorldState().actors.localActor;if(i===0)assert.deepEqual(out.frame.actorLayer.actors.find(a=>a.local).screenPosition,[160,120]);assert.equal(a.motion.position[1]-previous,8);previous=a.motion.position[1];assert.equal(a.ride.child.action,1);assert.equal(a.motion.animation,11);}r.release(0);
 }finally{f.close();}
});
test('a source80 interruption keeps mount player cached, hides its composite, and resumes mounted callback after real completion',()=>withController(c=>{
 c.a.applyActions(ascii(action()));for(let i=0;i<35;i++)c.frame.step(c.request,1);const before=c.frame.step(c.request,1).actors.find(a=>a.local).childAnimation;c.a.applyActions(ascii(action('1C',80,114000)));let out;
 for(let i=0;i<365;i++){out=c.frame.step(c.request,1);if(c.a.copyLocalActor().specialSpin.state===0)break;}assert.equal(c.a.copyLocalActor().specialSpin.state,0);assert.equal(c.frame.inspect().childPlayers,1);assert.equal(out.actors.find(a=>a.local).handler,'source-spin');const next=c.frame.step(c.request,1).actors.find(a=>a.local);assert.equal(next.handler,'source-mounted');assert.equal(next.childAnimation.nextFrame,before.delay?before.nextFrame:before.nextFrame>=3?1:before.nextFrame+1);
}));
test('source60 updates normal/body during a mount, exit restores normal, and hidden source attachment is owned',()=>withController(c=>{
 c.a.applyActions(ascii(action()));c.frame.step(c.request,1);c.a.applyActions(ascii(action('1C',60,80004,0)));assert.equal(c.a.copyLocalActor().normalRawResourceId,80004);c.a.applyActions(ascii(action('1C',70,-1)));for(let i=0;i<35;i++)c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().resolvedResourceId,80004);assert.equal(c.a.copyLocalActor().ride.child,null);assert.equal(c.frame.inspect().childPlayers,0);
 c.a.applyActions(ascii(action('1C',60,80004,1)));const out=c.frame.step(c.request,1);assert.equal(out.actors.find(a=>a.local).attachment.animation.graphicIndex,0);assert.equal(c.a.copyLocalActor().attached.rawResourceId,1);assert.equal(c.frame.inspect().childPlayers,1);
}));
test('source reentry reuses previous cached child state and already allocated effect instead of inventing a fresh animation',()=>withController(c=>{
 c.a.applyActions(ascii(action()));for(let i=0;i<8;i++)c.frame.step(c.request,1);const before=c.frame.inspect();c.a.applyActions(ascii(action()));const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local);assert.equal(a.ridePlan.offset[1],0);assert.equal(a.childAnimation.nextFrame,2);assert.equal(a.effectAnimation.nextFrame,2);assert.equal(a.ridePlan.offset[0],0);assert.equal(c.frame.inspect().childPlayers,before.childPlayers);assert.equal(a.effectAnimation.lastResource,110096);
}));
test('actor removal, recreated scene and owner close release every child player',()=>withController(c=>{
 c.a.applyActions(ascii(action()+','+action('3e')));c.frame.step(c.request,1);assert.equal(c.frame.inspect().childPlayers,4);c.a.remove(ascii('3e'));c.frame.synchronize();assert.equal(c.frame.inspect().childPlayers,2);c.a.beginScene([6,4],true);c.frame.synchronize();assert.equal(c.frame.inspect().players,0);assert.equal(c.frame.inspect().childPlayers,0);assert.equal(c.a.copyLocalActor().ride,null);c.frame.close();assert.equal(c.frame.inspect().childPlayers,0);
}));
test('ownership changes during child geometry validation fail closed and release all parent/child players',()=>withController(c=>{
 c.a.applyActions(ascii(action()));assert.throws(()=>c.frame.step(c.request,1),e=>e.code==='LEGACY_FRAME_ACTORS_CHANGED');assert.equal(c.frame.inspect().players,0);assert.equal(c.frame.inspect().childPlayers,0);
},{geometry(q,actor,a,library){if(q.value===1002&&actor.ride)a.beginScene([6,4],true);return library.geometry(q);}}));
test('native1024 child queue slots are distinct from1001 roots, and dropping draws does not skip helpers',()=>withController(c=>{
 const enc=n=>{let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;};
 for(let start=1000;start<1999;start+=40)c.a.applyUnits(ascii(Array.from({length:Math.min(40,1999-start)},(_,i)=>unit(enc(start+i),0,100001,1)).join('\t')));
 for(const rows of Array.from({length:26},(_,i)=>[100,200,...Array.from({length:999},(_,j)=>1000+j)].slice(i*40,i*40+40)))if(rows.length)c.a.applyActions(ascii(rows.map(id=>action(enc(id))).join(',')));
 const out=c.frame.step(c.request,1);assert.equal(out.actors.length,1001);assert.equal(out.helperCalls,3003);assert.equal(out.submittedActorIds.length,2025);assert.equal(c.frame.copySceneRoots().length,1001);assert.equal(c.frame.inspect().childPlayers,2002);
}));

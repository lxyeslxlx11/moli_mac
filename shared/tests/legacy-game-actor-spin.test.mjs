import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLegacyGameActors,planLegacyGameActorSpin,legacyGameActorSpinOutcome,LegacyGameActorSpinError,planLegacyGameActorFrame,createLegacyGameLocalMovement,createLegacyGameCollisionGridFromRectangle} from '../index.mjs';
import {legacyGameLocalMovementBodyFacing,legacyGameLocalMovementFacingAssigned} from '../legacy-game-local-movement.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientFixture,clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {flush} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-actor-spin-v1/original-vectors.json',import.meta.url))),ascii=s=>new Uint8Array(Buffer.from(s,'ascii')),
  sha=b=>createHash('sha256').update(b).digest('hex'),unit=(id='1C',face=4,resource=100001,category=1)=>[category,id,2,3,face,resource,0,0,'OriginalSpin','OriginalGuild',0,0,0,'OriginalTail',0,0,''].join('|'),
  action=(id='1C',code=80,p1=100006,p2=999,face=7)=>`${id}|99|-99|${code}|${face}|${p1}|${p2}|0`,source=(r={})=>({...scene.actorSource,...r});
function fixture(){const f=clientFixture();for(const row of v.files)f.files.files.set(row.path.toLowerCase(),new Uint8Array(Buffer.from(row.bytesHex,'hex')));return f;}
async function send(f,plain){f.offer(f.frame(Buffer.from(plain,'ascii').toString('hex')));await flush();}
function pump(f,index,extra={}){const r=f.client.runtime().pump({...f.client.readFrame(),tick:v.full.frames[index].tick,...extra});assert.equal(r.error,null);assert.equal(r.updates,1);return r;}
function actorController(f,options={}){const a=createLegacyGameActors();a.configureResources(8);a.configureSceneMode(1);a.setContext([100,0,1,0]);a.observeGlobals(null,null,null,100);a.applyUnits(ascii(unit()+'\t'+unit('3e',2,100001,71)));const c=f.client.library().catalogs();
  const frame=createLegacyGameActorFrameController(a,{graphics:c.graphics,animations:c.animations,source:()=>source(options.source?.()),geometry:(q,actor)=>options.geometry?options.geometry(q,actor,a):f.client.library().geometry(q),initialPhase:0,deferImages:true,bindActorSource:true});
  return {a,frame,request:{tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240},close(){frame.close();a.close();}};
}
test('actual client source action80 enters the native rotating action instead of ordinary resource drawing',async()=>{
  const f=clientFixture();try{
    await clientEnter(f);f.offer(f.frame(Buffer.from('Hx! 1C|2|3|80|4|80004|999|0 ','ascii').toString('hex')));await flush();
    const runtime=f.client.runtime();runtime.resetClock(1000);const result=runtime.pump({...f.client.readFrame(),tick:1017});
    assert.equal(result.error,null);assert.ok(result.updates>0);assert.equal(f.client.copyWorldState().actors.localActor.motion.animation,3);
  }finally{f.close();}
});
test('3285 independent source facing/offset/probe plans and24 return-code outcomes cover every supported initial facing',()=>{
  assert.equal(v.purePlans.length,3285);assert.equal(v.outcomes.length,24);
  for(const row of v.purePlans)assert.deepEqual(planLegacyGameActorSpin(row.input),row.expected);
  for(const row of v.outcomes)assert.deepEqual(legacyGameActorSpinOutcome(row.counter,row.probeCode),row.expected);
});
test('spin inputs are owned and reject accessors, invalid phases and unsafe source overflow domains',()=>{
  let reads=0;const input={counter:0,initialFacing:null,facingCode:4};Object.defineProperty(input,'counter',{get(){reads++;return 0;}});
  assert.throws(()=>planLegacyGameActorSpin(input),e=>e instanceof LegacyGameActorSpinError);assert.equal(reads,0);
  for(const row of [{counter:-1,initialFacing:null,facingCode:4},{counter:2147483647,initialFacing:4,facingCode:4},{counter:1,initialFacing:null,facingCode:4},{counter:0,initialFacing:4,facingCode:4},{counter:0,initialFacing:null,facingCode:8}])assert.throws(()=>planLegacyGameActorSpin(row));
  assert.throws(()=>legacyGameActorSpinOutcome(360,1));assert.throws(()=>legacyGameActorSpinOutcome(361,null));
  const p=planLegacyGameActorSpin({counter:0,initialFacing:null,facingCode:4});assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.offset));
});
test('source80 ignores packet facing/coordinates/parameter2 and keeps normal local resource separate from temporary body',()=>{
  const a=createLegacyGameActors();try{a.prepareCharacterEntry();a.setContext([100,0,1,0]);a.beginScene([2,3]);a.configureResources(8);a.applyUnits(ascii(unit()));a.applyActions(ascii(action()));let local=a.copyLocalActor();
    assert.equal(local.rawResourceId,100006);assert.equal(local.normalRawResourceId,100001);assert.equal(local.normalFacingCode,4);assert.equal(local.motion.facingCode,4);assert.deepEqual(local.motion.display,[2,3]);assert.equal(local.sourceControlUnmodeled,false);assert.deepEqual(local.specialSpin,{state:3,counter:0,initialFacing:null});
    a.applyActions(ascii(action('1C',60,80002,0)));assert.equal(a.copyLocalActor().normalRawResourceId,80002);assert.equal(a.copyLocalActor().specialSpin.state,3);
    a.beginScene([6,4],true);local=a.copyLocalActor();assert.equal(local.rawResourceId,80002);assert.equal(local.specialSpin,null);assert.deepEqual(local.motion.display,[6,4]);assert.equal(local.motion.facingCode,4);
  }finally{a.close();}
});
test('actual client renders400 independent full scene rasters, complete probe cadence, events and source depth flags',async()=>{
  const f=fixture();try{await clientEnter(f,false);for(const p of scene.protocol.beforePlainHex.slice(0,3)){f.offer(f.frame(p));await flush();}f.offer(f.frame(v.full.unitPlainHex));await flush();f.offer(f.frame(v.full.actionPlainHex));await flush();f.offer(f.frame(scene.protocol.beforePlainHex[4]));await flush();await f.drive(()=>f.client.inspect().state==='playing');
    const runtime=f.client.runtime();runtime.resetClock(1000);
    for(const row of v.full.frames){const out=pump(f,row.update-1),layer=out.frame.actorLayer;assert.equal(out.requests.length,0);assert.deepEqual(layer.submittedActorIds,row.submittedActorIds);assert.deepEqual(layer.events,row.events);
      for(const expected of row.actors){const actor=layer.actors.find(a=>a.id===expected.id),current=f.client.copyWorldState().actors;const state=current.localActor.id===expected.id?current.localActor:current.remoteActors.find(a=>a.id===expected.id);
        assert.equal(actor.handler??'ordinary',expected.handler);assert.equal(actor.helperCalls,expected.helperCalls);assert.equal(actor.probeCode??null,expected.probeCode);assert.deepEqual(actor.screenPosition,expected.screenPosition);assert.equal(actor.motion.animation,expected.action);assert.equal(actor.motion.facingCode,expected.facingCode);assert.deepEqual(state.specialSpin,{state:expected.state,counter:expected.counter,initialFacing:expected.initialFacing});}
      const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),row.rgbaSha256,'source spin scene frame '+row.update);
    }
    const state=f.client.copyWorldState();assert.equal(state.actors.remoteCount,2);assert.equal(state.actorFrames.players,3);assert.equal(state.actors.localActor.normalRawResourceId,100001);assert.equal(state.actors.localActor.rawResourceId,100006);assert.equal(state.actors.localActor.normalFacingCode,4);assert.equal(state.actors.remoteActors.find(a=>a.id===300).specialSpin.counter,400);
  }finally{f.close();}
});
test('real local movement facing writers are separate from spin facing, including same-direction restart and unit refresh',async()=>{
  const f=fixture();try{await clientEnter(f);await send(f,'Hx! '+action()+' ');let runtime=f.client.runtime();runtime.resetClock(1000);for(let i=0;i<13;i++)pump(f,i);
    let actor=f.client.copyWorldState().actors.localActor;assert.equal(actor.motion.facingCode,5);assert.equal(actor.normalFacingCode,4);assert.equal(f.client.copyWorldState().localMovement.facingCode,4);
    await send(f,'Hx! '+action('1C',0,0,0)+' ');assert.equal(f.client.copyWorldState().actors.localActor.normalFacingCode,4);
    await send(f,'Hx! '+action()+' ');pump(f,13);actor=f.client.copyWorldState().actors.localActor;assert.equal(actor.specialSpin.initialFacing,5);assert.equal(actor.normalFacingCode,4);
    await send(f,'H#| '+unit('1C',0)+' ');actor=f.client.copyWorldState().actors.localActor;assert.equal(actor.motion.facingCode,4);assert.equal(actor.normalFacingCode,4);assert.equal(actor.specialSpin.state,3);
    const words=Buffer.from(scene.protocol.beforePlainHex[1],'hex').toString('ascii').split(' ');words[5]='6';words[6]='4';await send(f,words.join(' '));await f.drive(()=>f.client.inspect().sceneRevision===2&&f.client.inspect().state==='playing');
    actor=f.client.copyWorldState().actors.localActor;assert.equal(runtime.inspect().state,'closed');assert.equal(actor.specialSpin,null);assert.equal(actor.rawResourceId,100001);assert.equal(actor.motion.facingCode,4);assert.deepEqual(actor.motion.display,[6,4]);assert.equal(f.client.copyWorldState().actorFrames.players,0);
  }finally{f.close();}
});
test('source spin observes actual pointer-start facing writes even when the normal facing value is unchanged',async()=>{
  const f=fixture();try{await clientEnter(f);await send(f,'Hx! '+action()+' ');const runtime=f.client.runtime();runtime.resetClock(1000);for(let i=0;i<13;i++)pump(f,i);assert.equal(f.client.copyWorldState().actors.localActor.motion.facingCode,5);
    await send(f,'Hx! '+action()+' ');runtime.move([192,136]);runtime.press(0);const result=pump(f,13);runtime.release(0);
    assert.ok(result.inputUpdates.some(a=>a.destination));assert.ok(result.requests.length>0);const actor=f.client.copyWorldState().actors.localActor;assert.equal(actor.normalFacingCode,4);assert.equal(actor.specialSpin.initialFacing,4);
  }finally{f.close();}
});
test('after a spin finishes the body keeps its final facing until a real writer, while scene reconstruction uses the normal facing',async()=>{
  const f=fixture();try{await clientEnter(f);await send(f,'Hx! '+action()+' ');const runtime=f.client.runtime();runtime.resetClock(1000);for(let i=0;i<13;i++)pump(f,i);
    runtime.move([160,152]);runtime.press(0);pump(f,13);runtime.release(0);for(let i=14;i<400;i++)pump(f,i);
    let actor=f.client.copyWorldState().actors.localActor;assert.equal(actor.specialSpin.state,0);assert.equal(actor.normalFacingCode,5);assert.equal(actor.motion.facingCode,4);
    const words=Buffer.from(scene.protocol.beforePlainHex[1],'hex').toString('ascii').split(' ');words[5]='6';words[6]='4';await send(f,words.join(' '));await f.drive(()=>f.client.inspect().sceneRevision===2&&f.client.inspect().state==='playing');actor=f.client.copyWorldState().actors.localActor;
    assert.equal(actor.motion.facingCode,5);assert.equal(actor.rawResourceId,100001);assert.equal(actor.specialSpin,null);
  }finally{f.close();}
});
test('existing gates stall spin counters; frozen and static animation return0 never fabricate one-shot completion',async()=>{
  const f=fixture();try{await clientEnter(f);let gate=0;const c=actorController(f,{source:()=>({recordGateFlags:gate,frozen:1})});try{
    c.a.applyActions(ascii(action('3e')));gate=0x80000000;c.frame.step(c.request,1);assert.equal(c.a.copyState().remoteActors[0].specialSpin.counter,0);gate=0;
    for(let i=0;i<370;i++)c.frame.step(c.request,1);const actor=c.a.copyState().remoteActors[0];assert.equal(actor.specialSpin.state,3);assert.equal(actor.specialSpin.counter,370);assert.equal(c.frame.inspect().players,2);
  }finally{c.close();}
    const s=actorController(f);try{s.a.applyActions(ascii(action('3e',80,80004)));for(let i=0;i<370;i++)s.frame.step(s.request,1);assert.equal(s.a.copyState().remoteActors[0].specialSpin.state,3);assert.equal(s.a.copyState().remoteActors[0].specialSpin.counter,370);}finally{s.close();}
  }finally{f.close();}
});
test('remote queued motion pauses in the special callback and resumes on the following ordinary source frame',async()=>{
  const f=fixture();try{await clientEnter(f);const c=actorController(f);try{
    c.a.applyActions(ascii('3e|4|3|1|7|100|0|0'));c.a.applyActions(ascii(action('3e')));const before=c.a.copyState().remoteActors[0].motion.position;
    for(let i=0;i<365;i++)c.frame.step(c.request,1);let actor=c.a.copyState().remoteActors[0];assert.deepEqual(actor.motion.position,before);assert.equal(actor.specialSpin.state,0);assert.ok(actor.motion.queue.length>0);
    c.frame.step(c.request,1);actor=c.a.copyState().remoteActors[0];assert.notDeepEqual(actor.motion.position,before);
  }finally{c.close();}}finally{f.close();}
});
test('source spin has no ordinary static flip/local depth flag and events retain the unshifted body screen coordinates',async()=>{
  const f=fixture();try{await clientEnter(f);const c=actorController(f);try{c.a.applyActions(ascii(action()));const out=c.frame.step({...c.request,camera:[129,192]},1),local=out.actors.find(a=>a.local);assert.equal(local.handler,'source-spin');assert.ok(out.events.some(e=>e.actorId===100));assert.deepEqual(out.events.filter(e=>e.actorId===100).map(e=>e.screenPosition),[[159,120]]);assert.equal(c.frame.copySceneRoots().find(r=>r.id===100).sortFlag,0);
    c.a.applyActions(ascii(action('3e',80,80004)));const next=c.frame.step(c.request,1).actors.find(a=>a.id===200);assert.equal(next.animation.drawFlags,0);
  }finally{c.close();}}finally{f.close();}
});
test('source70 replaces the spin with an owned ride; an ownership-changing spin provider closes players',async()=>{
  const f=fixture();try{await clientEnter(f);const c=actorController(f);try{c.a.applyActions(ascii(action('3e')));c.a.applyActions(ascii(action('3e',70,100001,0)));assert.equal(c.a.copyState().remoteActors[0].specialSpin,null);assert.equal(c.a.copyState().remoteActors[0].sourceControlUnmodeled,false);assert.equal(c.a.copyState().remoteActors[0].ride.state,1);assert.equal(c.frame.step(c.request,1).actors.find(a=>a.id===200).handler,'source-ride');assert.equal(c.frame.inspect().players,2);}finally{c.close();}
    const d=actorController(f,{geometry(q,actor,a){if(actor.specialSpin)a.beginScene();return f.client.library().geometry(q);}});try{d.a.applyActions(ascii(action('3e')));assert.throws(()=>d.frame.step(d.request,1),e=>e.code==='LEGACY_FRAME_ACTORS_CHANGED');assert.equal(d.frame.inspect().players,0);}finally{d.close();}
  }finally{f.close();}
});
test('an explicit unowned specialState remains unsupported and source gating precedes the owned handler',()=>{
  const base={local:true,action:0,queueLength:0,sceneMode:1,enginePhase:0,runtime:scene.runtime,source:source({specialState:3})};assert.equal(planLegacyGameActorFrame(base).supported,false);assert.equal(planLegacyGameActorFrame({...base,sourceSpin:true}).sortFlag,0);assert.equal(planLegacyGameActorFrame({...base,sourceSpin:true,runtime:{...scene.runtime,ownGateByte:128}}).blocked,true);
});
test('native turn eligibility compares the actual body facing even when its normal facing already equals the requested direction',()=>{
  const reference=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-local-movement-v1/original-vectors.json',import.meta.url))),row=reference.pathCases.find(r=>r.expected?.steps.length>0&&r.expected.steps.length<10&&r.expected.finalFacing>=0&&r.expected.steps.at(-1).direction!==r.expected.finalFacing),flags=Uint16Array.from(row.cells,c=>0xc000|(c===1?256:0)),grid=createLegacyGameCollisionGridFromRectangle(row.width,row.height,[0,0,row.width,row.height],[new Uint16Array(flags.length),new Uint16Array(flags.length),flags],1),movement=createLegacyGameLocalMovement(row.start,100,4,{...scene.sourceContext,lastTurnTick:1000},0,0);
  try{movement.requestDestination(row.goal);let arrived=false;for(let i=0;i<1000;i++){movement.step(grid,1000,[7,23],99);const s=movement.copyState();if(s.destination===null&&s.route.length===0&&s.queuedDirections.length===0&&s.position[0]===s.target[0]*64&&s.position[1]===s.target[1]*64){arrived=true;break;}}assert.equal(arrived,true);
    const body=movement.copyState().facingCode;assert.notEqual(body,row.expected.finalFacing);movement.observeAnimation(0,0,row.expected.finalFacing);legacyGameLocalMovementBodyFacing(movement,body);const step=movement.step(grid,1501,[7,23],99);assert.equal(step.requests.length,1);assert.equal(step.requests[0].operationId,'send-004f6470');assert.deepEqual([...step.requests[0].arguments[2]],[row.expected.finalFacing+65]);assert.equal(legacyGameLocalMovementFacingAssigned(movement),true);assert.equal(movement.copyState().facingCode,row.expected.finalFacing);
  }finally{movement.close();grid.close();}
});

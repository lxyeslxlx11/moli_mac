import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLegacyGameActors,legacyGameActorRecordTypeFlags as typeFlags,legacyGameActorRecordDrawFlags as drawFlags,
  legacyGameActorInitialFacing as initialFacing,resolveLegacyGameActorFrameSource as bind,createLegacyGameGraphicActorFilter as filter,planLegacyGameActorFrame} from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientFixture,clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {flush} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-actor-context-v1/original-vectors.json',import.meta.url))),ascii=s=>new Uint8Array(Buffer.from(s,'ascii')),
  sha=b=>createHash('sha256').update(b).digest('hex'),source=(r={})=>({...scene.actorSource,...r});
function base62(n){let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;}
const unit=(r={})=>[r.category??1,base62(r.id??200),...(r.coordinates??[3,3]),r.facing??4,r.resource??100001,r.value7??0,r.value8??0,'Original','OriginalGuild',r.flag11??0,r.flag12??0,0,'OriginalTail',0,0,''].join('|');
const graphic=(id=300,xy=[4,4],resource=80002)=>[base62(id),...xy,resource,0,'OriginalGraphic',0].join('|');
test('84 independent native category/value flags and270 normalized-resource constructor facing cases',()=>{
  assert.equal(v.flags.length,84);assert.equal(v.facing.length,270);
  for(const row of v.flags){assert.equal(typeFlags(row.category),row.typeFlags);assert.equal(drawFlags(row.category,row.value7),row.drawFlags);}
  for(const row of v.facing)assert.equal(initialFacing(row.category,row.resource,row.sceneMode,row.facing),row.expected);
});
test('per-record binding replaces proven masks and retains explicit gates, unresolved bits and compound state',()=>{
  const a=createLegacyGameActors();try{
    a.configureResources(8);a.configureSceneMode(0);a.setContext([100,0,1,0]);a.applyUnits(ascii(unit({category:0,value7:320,value8:-1,flag11:1,flag12:1})));
    const raw=source({unindexed:true,recordGateFlags:0x80000000,recordMotionFlags:0x02001234,recordTypeFlags:65535,recordDrawFlags:0x80001780,bodyFlags:0x40000,specialState:2,frozen:1,childAction:12});
    const b=bind(a.copyState().remoteActors[0],raw);assert.equal(b.unindexed,false);assert.equal(b.recordGateFlags,0x80000000);assert.equal(b.recordMotionFlags,0x02c0ffff);assert.equal(b.recordTypeFlags,1);
    assert.equal(b.recordDrawFlags,0x80401080);assert.equal(b.bodyFlags,0x441034);assert.equal(b.specialState,2);assert.equal(b.frozen,1);assert.equal(b.childAction,12);assert.ok(Object.isFrozen(b));
    raw.recordGateFlags=0;assert.equal(b.recordGateFlags,0x80000000);
  }finally{a.close();}
});
test('native registration type is stable while current draw flags replace their mask and body flags accumulate',()=>{
  const a=createLegacyGameActors();try{
    a.configureResources(8);a.configureSceneMode(0);a.applyUnits(ascii(unit({category:1,flag11:1})));let actor=a.copyState().remoteActors[0];assert.equal(actor.sourceFrame.recordTypeFlags,8);assert.equal(bind(actor,source()).bodyFlags,0x134);
    a.applyUnits(ascii(unit({category:3})));actor=a.copyState().remoteActors[0];assert.equal(actor.sourceFrame.recordTypeFlags,8);assert.equal(bind(actor,source()).recordDrawFlags,0x200);assert.equal(bind(actor,source()).bodyFlags,0x334);
    a.applyUnits(ascii(unit({category:0,value7:320})));actor=a.copyState().remoteActors[0];const b=bind(actor,source());assert.equal(b.recordTypeFlags,8);assert.equal(b.recordDrawFlags,0x401000);assert.equal(b.bodyFlags,0x401334);assert.equal(b.recordMotionFlags&0x00400000,0x00400000);
  }finally{a.close();}
});
test('graphic and value records bind types 2 and 4 with a shared body flag and retained motion bits',()=>{
  const a=createLegacyGameActors();try{
    a.configureSceneMode(0);a.setContext([100,0,1,0]);a.applyUnits(ascii([unit({id:100,category:71}),graphic(),[base62(301),5,5,20].join('|')].join('\t')));
    const s=a.copyState();assert.equal(bind(s.localActor,source()).bodyFlags,0xb4);assert.equal(s.localActor.sourceFrame.recordTypeFlags,null);
    const objects=s.remoteActors.map(actor=>bind(actor,source({recordMotionFlags:0x02001234})));
    assert.deepEqual(objects.map(body=>body.recordTypeFlags),[2,4]);
    for(const b of objects){assert.equal(b.recordDrawFlags,0x400);assert.equal(b.bodyFlags,0x434);assert.equal(b.recordMotionFlags,0x02001234);}
    a.applyUnits(ascii(unit({id:300,category:0,value8:65538})));const b=bind(a.copyState().remoteActors.find(x=>x.id===300),source());assert.equal(b.recordTypeFlags,2);assert.equal(b.bodyFlags,0x1434);assert.equal(b.recordMotionFlags&65535,2);
  }finally{a.close();}
});
test('scene mode controls fresh construction, mode updates preserve existing facing and unobserved mode stays unknown',()=>{
  for(const mode of [0,9,null]){const a=createLegacyGameActors();try{
    a.configureResources(8);if(mode!==null)a.configureSceneMode(mode);a.applyUnits(ascii(unit({category:71,resource:80002,facing:4})));const actor=a.copyState().remoteActors[0];
    assert.equal(actor.motion.facingCode,mode===0?0:4);if(mode===null)assert.throws(()=>bind(actor,source()),e=>e.code==='LEGACY_ACTOR_CONTEXT_SCENE_MODE_REQUIRED');else assert.equal(bind(actor,source()).recordTypeFlags,257);
    a.configureSceneMode(-1);assert.equal(a.copyState().sourceSceneMode,-1);assert.equal(a.copyState().remoteActors[0].motion.facingCode,actor.motion.facingCode);
    a.configureResources(null);a.applyUnits(ascii(unit({id:201,category:71,resource:111000,facing:7})));assert.equal(a.copyState().remoteActors[1].motion.facingCode,7);
    a.configureSceneMode(0);a.applyUnits(ascii(unit({id:202,category:71,resource:80002,facing:7})));assert.equal(a.copyState().remoteActors[2].motion.facingCode,0);
    const before=a.copyState();assert.throws(()=>a.configureSceneMode(NaN));assert.deepEqual(a.copyState(),before);
  }finally{a.close();}}
  const entry=createLegacyGameActors();try{assert.equal(entry.copyState().sourceSceneMode,null);entry.prepareCharacterEntry();assert.equal(entry.copyState().sourceSceneMode,0);}finally{entry.close();}
});
test('missing resource normalization cannot fabricate a constructor facing or partially allocate records',()=>{
  const a=createLegacyGameActors();try{a.configureSceneMode(0);const before=a.copyState();assert.throws(()=>a.applyUnits(ascii(unit({category:71,resource:111000}))),e=>e.code==='LEGACY_ACTOR_RESOURCE_CONTEXT');assert.deepEqual(a.copyState(),before);}finally{a.close();}
});
test('category71 source type selects the special loop set without changing unrelated gates',()=>{
  const a=createLegacyGameActors();try{
    a.configureSceneMode(0);a.applyUnits(ascii([unit({category:71}),unit({id:201,category:1})].join('\t')));
    const plans=a.copyState().remoteActors.map(actor=>planLegacyGameActorFrame({local:false,action:18,queueLength:0,sceneMode:1,enginePhase:0,runtime:scene.runtime,source:bind(actor,source())}));
    assert.equal(plans[0].mode,0);assert.equal(plans[1].mode,1);
  }finally{a.close();}
});
test('51 inclusive-range/local cases and103 overflow/dedup cases follow independent native helper arithmetic',()=>{
  for(const rows of [v.range,v.overflow]){const f=filter([0,0]);try{for(const row of rows)assert.deepEqual(f.submit(row.input),row.expected);assert.equal(f.inspect().tracked,rows===v.overflow?100:26);}finally{f.close();}assert.equal(f.inspect().tracked,0);assert.throws(()=>f.submit(rows[0].input));}
  const a=filter([0,0]),b=filter([0,0]),input={local:false,graphicIndex:1002,coordinates:[0,0]};try{assert.equal(a.submit(input).visible,true);assert.equal(a.submit(input).visible,false);assert.equal(b.submit(input).visible,true);}finally{a.close();b.close();}
});
test('source/filter inputs are owned and reject getters, missing fields and unsupported numeric ranges',()=>{
  const origin=[2,3],f=filter(origin);origin[0]=999;let reads=0;const hostile=[0,0];Object.defineProperty(hostile,0,{get(){reads++;return 0;}});
  try{assert.equal(f.submit({local:false,graphicIndex:1002,coordinates:[19,3]}).remove,true);assert.throws(()=>filter(hostile));assert.throws(()=>filter(new Array(2)));assert.throws(()=>typeFlags(1.2));assert.throws(()=>initialFacing(1,null,0,0));
    assert.throws(()=>bind({get sourceFrame(){reads++;return null;}},source()));const baseline=source();Object.defineProperty(baseline,'bodyFlags',{get(){reads++;return 0;}});assert.throws(()=>bind({sourceFrame:{}},baseline));assert.equal(reads,0);
  }finally{f.close();}
});
test('actual owning client renders120 independent mixed-actor scene rasters, culls duplicates/far objects and releases the far player',async()=>{
  const f=clientFixture();try{
    await clientEnter(f);f.offer(f.frame(v.mixed.plainHex));await flush();assert.equal(f.client.copyWorldState().actors.remoteCount,8);const runtime=f.client.runtime();runtime.resetClock(1000);
    for(const row of v.mixed.frames){const result=runtime.pump({...f.client.readFrame(),tick:row.tick});assert.equal(result.error,null);assert.equal(result.updates,1);
      const frame=result.frame.actorLayer;assert.deepEqual(frame.actors.filter(x=>x.state==='culled').map(x=>({id:x.id,reason:x.reason})),row.culled);assert.deepEqual(frame.submittedActorIds,row.submittedActorIds);
      const pixels=await f.client.library().startRender(result.frame.sceneLayer.drawPlan).done;assert.equal(sha(pixels.rgba),row.rgbaSha256,'mixed source frame '+row.update);assert.equal(result.requests.length,0);
    }
    const state=f.client.copyWorldState();assert.equal(state.actors.remoteCount,7);assert.equal(state.actorFrames.players,8);assert.equal(state.actors.remoteActors.some(x=>x.id===303),false);assert.equal(state.actors.remoteActors.some(x=>x.id===304),true);
    const before=state.actorFrames.players;f.offer(f.frame(Buffer.from('IZL '+base62(301)+' ','ascii').toString('hex')));await flush();assert.equal(f.client.copyWorldState().actorFrames.players,before-1);
    f.offer(f.frame(Buffer.from('H#| '+graphic(301)+' ','ascii').toString('hex')));await flush();const next=runtime.pump({...f.client.readFrame(),tick:v.mixed.frames.at(-1).tick+17});assert.equal(next.error,null);assert.ok(next.frame.actorLayer.actors.some(x=>x.id===301&&x.reason==='duplicate-graphic-cell'));assert.equal(f.client.copyWorldState().actorFrames.players,8);
  }finally{f.close();}
});
test('source-bound graphic frames require actual local coordinates and close players on a lease-changing provider',async()=>{
  const f=clientFixture();try{
    await clientEnter(f);const library=f.client.library(),catalogs=library.catalogs(),request={tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240};
    for(const mode of ['missing-local','changed-owner']){const actors=createLegacyGameActors();actors.configureSceneMode(0);actors.setContext([100,0,1,0]);actors.observeGlobals(null,null,null,100);actors.configureResources(8);
      actors.applyUnits(ascii((mode==='changed-owner'?unit({id:100})+'\t':'')+graphic()));let frame;frame=createLegacyGameActorFrameController(actors,{graphics:catalogs.graphics,animations:catalogs.animations,source:()=>source(),geometry:q=>{if(mode==='changed-owner')actors.beginScene();return library.geometry(q);},initialPhase:0,deferImages:true,bindActorSource:true});
      try{assert.throws(()=>frame.step(request,1),e=>e.code===(mode==='missing-local'?'LEGACY_FRAME_LOCAL_CULLING_CONTEXT_REQUIRED':'LEGACY_FRAME_ACTORS_CHANGED'));assert.equal(frame.inspect().state,'failed');assert.equal(frame.inspect().players,0);}finally{frame.close();actors.close();}}
  }finally{f.close();}
});
test('remote initial facing reads the real scene mode, independently of the explicit animation sound context',async()=>{
  const f=clientFixture();try{
    await clientEnter(f);assert.equal(scene.runtime.soundScene,0);assert.equal(f.client.copyWorldState().scene.fields[8],1);
    f.offer(f.frame(Buffer.from('H#| '+unit({category:71,resource:80002,facing:4})+' ','ascii').toString('hex')));await flush();
    assert.equal(f.client.copyWorldState().actors.remoteActors.find(x=>x.id===200).motion.facingCode,4);
  }finally{f.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLegacyGameActors, createLegacyGameWorldProtocol, encodeLegacyGameEnvelope } from '../index.mjs';
import { legacyGameActorFrameAccess } from '../legacy-game-actors.mjs';
import { clientFixture, clientEnter, scene, post } from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import { flush, bytes } from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-local-bootstrap-v1/original-vectors.json',import.meta.url)));
const ascii=s=>new Uint8Array(Buffer.from(s,'ascii')),text=b=>Buffer.from(b).toString('ascii');
const unit=(r={})=>ascii([1,'1C',...(r.coordinates??[11,10]),r.facing??2,r.resource??100001,77,8,'UnitHero','UnitGuild\\zBadge\\zNote',0,0,999,'Tail',0,0,''].join('|'));
const first=s=>({id:s.id,coordinates:[...s.motion.display],position:[...s.motion.position],facing:s.motion.facingCode,resource:s.rawResourceId,speed:s.motion.speed,value7:s.value7,label0:text(s.labels[0]),label1:text(s.labels[1])});
test('288 independent source constructor/order cases distinguish identity, position, facing and body resource',()=>{
  assert.equal(vectors.cases.length,288);
  for(const r of vectors.cases){const a=createLegacyGameActors();
    try{
      a.prepareCharacterEntry();a.observeGlobals(987654,ascii('StateHero'),ascii('StateGuild'),r.speed);
      for(const event of r.order.split('-')){
        if(event==='identity')a.setContext([r.identity,0,1,0]);
        else if(event==='scene')a.beginScene(r.scene);
        else if(event==='position')a.applyNetworkPosition(...r.network,r.facing,false);
        else a.applyUnits(unit({coordinates:r.unitCoordinates,facing:r.unitFacing,resource:r.resource}));
      }
      assert.deepEqual(first(a.copyLocalActor()),r.expected,r.order+JSON.stringify(r.scene));
      assert.equal(a.copyState().remoteCount,0);assert.equal(a.copyState().localBootstrap.entryPrepared,true);
    }finally{a.close();}
  }
});
test('main9 projection needs a real scene and @Qu identity; known raw reset never substitutes selected appearance or numeric field15',()=>{
  const a=createLegacyGameActors();try{
    a.prepareCharacterEntry();assert.equal(a.copyLocalActor(),null);a.beginScene([2,3]);assert.equal(a.copyLocalActor(),null);
    a.observeGlobals(987654,ascii('Hero'),ascii('Guild'));a.setContext([100,9,1,8]);const local=a.copyLocalActor();
    assert.equal(local.id,100);assert.equal(local.rawResourceId,0);assert.equal(local.motion.facingCode,-1);assert.equal(local.motion.speed,null);assert.equal(local.value7,987654);
    assert.equal(local.materialization,'source-main9');assert.equal(text(local.labels[0]),'Hero');assert.deepEqual(local.motion.position,[128,192]);
    assert.throws(()=>a.prepareCharacterEntry());
  }finally{a.close();}
});
test('a later identity notification does not rewind an existing local motion owner',()=>{
  const a=createLegacyGameActors();try{
    a.prepareCharacterEntry();a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,100);a.applyUnits(unit());
    a.applyLocalMovement([200,210],[3,3],[5,4],[2,1],7,100,true,1,0);const before=a.copyLocalActor().motion;
    a.setContext([100,5,1,6]);assert.deepEqual(a.copyLocalActor().motion,before);
  }finally{a.close();}
});
test('ready ordinary scene reconstruction expires the old frame key and uses cached source resource/facing/labels with the new coordinates',()=>{
  const a=createLegacyGameActors();try{
    a.prepareCharacterEntry();a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,37);a.applyUnits(unit({facing:4}));
    a.applyNetworkPosition(4,2,6,false);a.applyLocalMovement([270,145],[4,2],[7,4],[3,2],6,37,true,1,0);
    const access=legacyGameActorFrameAccess(a),old=access.entries()[0].key;a.observeGlobals(987654,ascii('Changed'),ascii('ChangedGuild'));
    assert.equal(text(a.copyLocalActor().labels[0]),'UnitHero','raw state labels are copied at materialization, not on an unrelated field update');
    a.beginScene([6,4],true);const local=a.copyLocalActor();assert.notEqual(access.entries()[0].key,old);assert.throws(()=>access.current(old));
    assert.equal(local.id,100);assert.equal(local.rawResourceId,100001);assert.equal(local.motion.facingCode,6);assert.equal(local.motion.speed,37);
    assert.deepEqual(local.motion.position,[384,256]);assert.deepEqual(local.motion.velocity,[0,0]);assert.equal(local.motion.animation,0);assert.equal(local.motion.phase,0);
    assert.equal(local.value7,987654);assert.equal(text(local.labels[0]),'Changed');assert.equal(text(local.labels[1]),'ChangedGuild');assert.equal(a.copyState().localBootstrap.materializations,2);
  }finally{a.close();}
});
test('scene coordinates are owned, validated without reading accessors and rejected atomically',()=>{
  const a=createLegacyGameActors();try{
    a.prepareCharacterEntry();a.setContext([100,0,1,0]);const coordinates=[2,3];a.beginScene(coordinates);coordinates[0]=99;const before=a.copyState();let reads=0;
    const hostile=[2,3];Object.defineProperty(hostile,0,{get(){reads++;return 8;}});
    for(const value of [hostile,new Array(2),[1],[1,2,3],[1,Infinity],[33554432,0]])assert.throws(()=>a.beginScene(value,true));
    assert.equal(reads,0);assert.deepEqual(a.copyState(),before);
  }finally{a.close();}
});
test('a repeated identity packet cannot resurrect a removed local owner without a new scene or unit record',()=>{
  const a=createLegacyGameActors();try{
    a.prepareCharacterEntry();a.setContext([100,0,1,0]);a.beginScene([2,3]);a.applyUnits(unit());a.remove(ascii('1C'));assert.equal(a.copyLocalActor(),null);
    a.setContext([100,1,1,2]);assert.equal(a.copyLocalActor(),null);a.applyUnits(unit());assert.ok(a.copyLocalActor());
  }finally{a.close();}
});
function worldFixture(){
  const f=clientFixture(),world=createLegacyGameWorldProtocol();world.append(encodeLegacyGameEnvelope(bytes(post.bootstrap.payloadHex)));assert.equal(world.next().kind,'bootstrap');world.prepareCharacterEntry(123456);
  return {world,feed(plain){world.append(f.frame(plain));return world.next();},close(){world.close();f.close();}};
}
test('source waitmask survives a materialized, fast local owner and map data until the real local unit arrives',()=>{
  const f=worldFixture();try{
    const {world}=f;f.feed(scene.protocol.beforePlainHex[0]);f.feed(scene.protocol.beforePlainHex[1]);f.feed(scene.protocol.beforePlainHex[2]);
    assert.equal(world.copyGameState().sourceEntryWaitMask,3);const early=world.copyGameState().actors.localActor;assert.equal(early.id,100);assert.equal(early.rawResourceId,0);assert.equal(early.motion.speed,100);
    f.feed(scene.protocol.beforePlainHex[4]);assert.equal(world.copyGameState().sourceEntryWaitMask,2);assert.equal(world.copyLocalSceneReadiness().missing,'source-entry-local-unit');
    world.configureLocalMovement(null,scene.sourceContext);assert.throws(()=>world.copyLocalMovement(),e=>e.code==='LEGACY_GAME_LOCAL_ENTRY_WAIT');
    const effect=f.feed(scene.protocol.beforePlainHex[3]).effect;assert.equal(effect.changes.find(c=>c.local).created,false);assert.equal(world.copyGameState().sourceEntryWaitMask,0);assert.equal(world.copyLocalSceneReadiness().ready,true);
    const state=world.copyGameState();assert.equal(state.actors.localActor.rawResourceId,100001);assert.equal(state.actors.localActor.id,100);assert.equal(state.records.records[1].fields.find(x=>x.id==='field-16').value,123456);
  }finally{f.close();}
});
test('a local unit without accepted local map data cannot release source entry; incompatible patch is rejected by the conservative host gate',()=>{
  const f=worldFixture();try{
    for(const i of [0,1,2,3])f.feed(scene.protocol.beforePlainHex[i]);assert.equal(f.world.copyGameState().sourceEntryWaitMask,1);
    const wrong=text(bytes(scene.protocol.beforePlainHex[4])).replace('=mJ 7 ','=mJ 8 ');assert.equal(f.feed(Buffer.from(wrong).toString('hex')).effect.kind,'map-cache-unavailable');
    assert.equal(f.world.copyGameState().sourceEntryWaitMask,1);assert.equal(f.world.copyLocalSceneReadiness().missing,'source-entry-map');
    f.feed(scene.protocol.beforePlainHex[4]);assert.equal(f.world.copyLocalSceneReadiness().ready,true);
  }finally{f.close();}
});
test('an independently checksummed accepted cache notice releases only the map wait bit',()=>{
  const f=worldFixture(),reference=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-world-v1/original-vectors.json',import.meta.url))).protocol;
  try{
    for(const i of [0,1,2,3])f.feed(scene.protocol.beforePlainHex[i]);assert.equal(f.world.copyGameState().sourceEntryWaitMask,1);
    f.world.configureMapCache(...reference.identity,bytes(reference.updatedHex),reference.mode);
    const effect=f.feed(reference.finalNoticeHex).effect;assert.equal(effect.kind,'map-cache-notice');assert.equal(effect.matches,true);assert.equal(f.world.copyGameState().sourceEntryWaitMask,0);
  }finally{f.close();}
});
test('actual owning client retains early position/facing and waits for its real unit, then starts with that source pose',async()=>{
  const f=clientFixture();try{
    await clientEnter(f,false);for(const i of [0,1,2,4]){f.offer(f.frame(scene.protocol.beforePlainHex[i]));await flush();}
    f.offer(f.frame(Buffer.from('=X# 4 2 6 ','ascii').toString('hex')));await flush();
    assert.equal(f.client.inspect().state,'preparing-scene');assert.equal(f.client.inspect().runtimeRevision,0);assert.equal(f.client.copyWorldState().sourceEntryWaitMask,2);
    f.offer(f.frame(scene.protocol.beforePlainHex[3]));await flush();await f.drive(()=>f.client.inspect().state==='playing');
    const state=f.client.copyWorldState();assert.deepEqual(state.localMovement.display,[4,2]);assert.equal(state.localMovement.facingCode,6);assert.equal(state.actors.localActor.rawResourceId,100001);assert.equal(state.actors.localActor.id,100);
  }finally{f.close();}
});
test('actual client scene relocation uses cached body/facing and fresh animation ownership without requiring an invented extra unit record',async()=>{
  const f=clientFixture();try{
    await clientEnter(f);const runtime=f.client.runtime();runtime.resetClock(1000);assert.equal(runtime.pump({...f.client.readFrame(),tick:1000}).error,null);
    assert.equal(f.client.copyWorldState().actorFrames.players,1);
    const next=text(bytes(scene.protocol.beforePlainHex[1])).replace('c c 2 3 ','c c 6 4 ');f.offer(f.frame(Buffer.from(next).toString('hex')));await flush();
    assert.equal(runtime.inspect().state,'closed');assert.equal(f.client.copyWorldState().actorFrames.players,0);
    f.offer(f.frame(scene.protocol.beforePlainHex[4]));await flush();await f.drive(()=>f.client.inspect().state==='playing');
    const state=f.client.copyWorldState();assert.deepEqual(state.localMovement.display,[6,4]);assert.equal(state.actors.localActor.rawResourceId,100001);assert.equal(state.actors.localActor.motion.facingCode,4);
    assert.equal(state.sourceEntryWaitMask,0);assert.equal(state.actors.localBootstrap.materializations,2);assert.equal(f.client.inspect().runtimeRevision,2);assert.equal(f.client.inspect().session.io.writes,3);
    const frame=f.client.runtime().pump({...f.client.readFrame(),tick:f.tick});assert.equal(frame.error,null);assert.equal(frame.frame.actorLayer.actors[0].animation.lastAction,0);
  }finally{f.close();}
});

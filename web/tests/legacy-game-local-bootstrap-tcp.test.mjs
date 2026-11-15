import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../../shared/index.mjs';
import { createLegacyGameSession } from '../legacy-game-session.mjs';
import { createWeChatLegacyGameSession } from '../../adapters/wechat/legacy-game-session.mjs';
import { fakeWeChat } from './helpers/wechat-tcp-fixture.mjs';
import { clientTCPOpen,clientWait } from './helpers/legacy-game-client-tcp-fixture.mjs';
import { bootstrapOriginalPeer } from './helpers/legacy-game-local-bootstrap-tcp-fixture.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { assets,startup } from './helpers/legacy-game-client-fixture.mjs';
const options=JSON.parse(readFileSync(new URL('../../analysis/game-character-options-v1/original-vectors.json',import.meta.url)));
async function run(mode,platform){
  const index=platform==='wechat'?1:0,row=options.flows[index],peer=await bootstrapOriginalPeer(mode,index),files=originalFiles(assets),handle=api.createLegacyGameStartup(startup()),material=handle.copy();handle.close();
  const native=platform==='wechat'?fakeWeChat({native:true,loopbackPort:peer.port}):null;
  const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(material.resourceParameters),files:files.port,context:material.context,clock:()=>Math.trunc(performance.now())>>>0,onInvalidate(){},onState(){},
    createSession({world,graphics,onPacket,onState}){
      const base={sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,moduleDigestBytes:material.moduleDigestBytes,postLogin:{graphics},pollMilliseconds:1,onPacket,onState};
      return native?createWeChatLegacyGameSession({...base,wx:native.wx,endpoint:{address:'fixture.invalid',port:12345}}):createLegacyGameSession({...base,endpoint:{address:'127.0.0.1',port:peer.port},openStream:clientTCPOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController()});
    }});
  try{
    await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');
    for(const action of row.actions)session.changeCharacterAppearance(row.slot,action);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');
    await clientWait(()=>{
      const state=client.copyWorldState();return state.actors.localActor?.motion.speed===100&&(mode==='scene-relocate'||(client.inspect().state==='preparing-scene'&&client.inspect().session.sourceCharacterEntered&&state.sourceEntryWaitMask===(mode==='unit-before-map'?1:2)&&(mode==='unit-before-map'||state.actors.localActor.motion.facingCode===6)));
    });
    if(mode==='scene-relocate'){
      await client.ready;assert.equal(client.inspect().state,'playing');const previous=client.runtime();previous.pump({...client.readFrame(),tick:Math.trunc(performance.now())>>>0});assert.equal(client.copyWorldState().actorFrames.players,1);
      peer.release();assert.equal((await peer.stage()).stage,'released');await clientWait(()=>client.inspect().sceneRevision===2&&client.inspect().state==='playing');
      const state=client.copyWorldState();assert.equal(previous.inspect().state,'closed');assert.deepEqual(state.localMovement.display,[6,4]);assert.equal(state.actors.localActor.motion.facingCode,4);assert.equal(state.actors.localActor.rawResourceId,100001);assert.equal(state.actors.localBootstrap.materializations,2);assert.equal(state.actorFrames.players,0);assert.equal(state.sourceEntryWaitMask,0);assert.equal(client.inspect().runtimeRevision,2);
    }else{
      assert.equal(client.inspect().state,'preparing-scene');assert.equal(client.inspect().runtimeRevision,0);const early=client.copyWorldState();assert.equal(early.sourceEntryWaitMask,mode==='unit-before-map'?1:2);
      assert.equal(early.actors.localActor.id,100);assert.equal(early.actors.localActor.rawResourceId,mode==='unit-before-map'?100001:0);assert.throws(()=>client.runtime());
      if(mode!=='close-waiting'){
        peer.release();assert.equal((await peer.stage()).stage,'released');assert.equal((await client.ready).state,'playing');const state=client.copyWorldState();assert.equal(state.sourceEntryWaitMask,0);
        assert.deepEqual(state.localMovement.display,mode==='position-before-unit'?[4,2]:[2,3]);assert.equal(state.localMovement.facingCode,mode==='position-before-unit'?6:4);assert.equal(state.actors.localActor.rawResourceId,100001);
      }
    }
    assert.equal(session.inspect().io.writes,5);client.close();const end=await client.done;assert.equal(end.world.state,'closed');assert.equal(end.library.state,'closed');assert.equal(end.cleanupErrors,0);
    const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.movement_requests_verified,0);assert.equal(receipt.source_wait_boundary,true);assert.equal(receipt.extra_unit_on_relocation,false);assert.equal(receipt.scene_reloaded,mode==='scene-relocate');assert.equal(receipt.official_session,false);
    if(native){assert.equal(native.stats.closed,1);assert.equal(native.sockets[0].listenerCount(),0);}assert.ok(await files.port.stat('Bin/Graphic.bin'));
  }finally{client.close();files.close();material.mappingBytes.fill(0);material.moduleDigestBytes.fill(0);material.resourceParameters.fill(0);await peer.close();}
}
for(const platform of ['node','wechat'])for(const mode of ['position-before-unit','unit-before-map','scene-relocate','close-waiting'])test('actual '+platform+' TCP source bootstrap: '+mode,{timeout:20000},()=>run(mode,platform));

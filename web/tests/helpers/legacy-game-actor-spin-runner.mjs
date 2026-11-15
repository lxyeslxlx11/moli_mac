/** Actual original TCP, source80 actor frames and owning resources, shared with private receipt capture. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../../../shared/index.mjs';
import {createLegacyGameSession} from '../../legacy-game-session.mjs';
import {createWeChatLegacyGameSession} from '../../../adapters/wechat/legacy-game-session.mjs';
import {fakeWeChat} from './wechat-tcp-fixture.mjs';
import {clientTCPOpen,clientWait} from './legacy-game-client-tcp-fixture.mjs';
import {actorSpinOriginalPeer} from './legacy-game-actor-spin-tcp-fixture.mjs';
import {originalFiles} from '../../../analysis/game-resource-runtime-v1/original_files.mjs';
import {spinAssets} from '../../../analysis/game-actor-spin-v1/original_assets.mjs';
import {assets,startup} from './legacy-game-client-fixture.mjs';
const v=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-spin-v1/original-vectors.json',import.meta.url))),options=JSON.parse(readFileSync(new URL('../../../analysis/game-character-options-v1/original-vectors.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function runActorSpinCase(mode,platform){
  const index=platform==='wechat'?1:0,row=options.flows[index],peer=await actorSpinOriginalPeer(mode,index),files=originalFiles(spinAssets(assets,v)),handle=api.createLegacyGameStartup(startup()),material=handle.copy();handle.close();
  const native=platform==='wechat'?fakeWeChat({native:true,loopbackPort:peer.port}):null;let sourceFrames=0;
  const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(material.resourceParameters),files:files.port,context:material.context,clock:()=>Math.trunc(performance.now())>>>0,onInvalidate(){},onState(){},
    createSession({world,graphics,onPacket,onState}){
      const base={sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,moduleDigestBytes:material.moduleDigestBytes,postLogin:{graphics},pollMilliseconds:1,onPacket,onState};
      return native?createWeChatLegacyGameSession({...base,wx:native.wx,endpoint:{address:'fixture.invalid',port:12345}}):createLegacyGameSession({...base,endpoint:{address:'127.0.0.1',port:peer.port},openStream:clientTCPOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController()});
    }});
  try{
    await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');
    for(const action of row.actions)session.changeCharacterAppearance(row.slot,action);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');
    assert.equal(client.copyWorldState().actors.remoteCount,2);const runtime=client.runtime();runtime.resetClock(1000);const limit=mode==='spin-reload'?v.reloadAt:mode==='spin-close'?v.closeAt:v.full.frames.length;
    for(const expected of v.full.frames.slice(0,limit)){
      const out=runtime.pump({...client.readFrame(),tick:expected.tick});assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);const layer=out.frame.actorLayer;assert.deepEqual(layer.submittedActorIds,expected.submittedActorIds);assert.deepEqual(layer.events,expected.events);
      const state=client.copyWorldState().actors;
      for(const e of expected.actors){const a=layer.actors.find(a=>a.id===e.id),live=e.id===state.localId?state.localActor:state.remoteActors.find(a=>a.id===e.id);assert.equal(a.handler??'ordinary',e.handler);assert.equal(a.helperCalls,e.helperCalls);assert.equal(a.motion.facingCode,e.facingCode);assert.deepEqual(live.specialSpin,{state:e.state,counter:e.counter,initialFacing:e.initialFacing});}
      const image=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),expected.rgbaSha256,'source80 TCP scene frame '+expected.update);sourceFrames++;
    }
    let state=client.copyWorldState(),relocated=null;assert.equal(state.actors.remoteCount,2);assert.equal(state.actorFrames.players,3);assert.equal(state.actors.localActor.normalRawResourceId,100001);assert.equal(state.actors.localActor.normalFacingCode,4);assert.equal(state.actors.localActor.sourceControlUnmodeled,false);
    if(mode!=='spin-close'){
      peer.release();assert.equal((await peer.stage()).stage,'released');
      if(mode==='spin-reload'){
        await clientWait(()=>client.inspect().sceneRevision===2&&client.inspect().state==='playing');relocated=client.copyWorldState();assert.equal(runtime.inspect().state,'closed');assert.equal(relocated.actors.remoteCount,0);assert.equal(relocated.actorFrames.players,0);assert.deepEqual(relocated.localMovement.display,[6,4]);assert.equal(relocated.actors.localActor.specialSpin,null);assert.equal(relocated.actors.localActor.rawResourceId,100001);assert.equal(relocated.actors.localActor.motion.facingCode,4);assert.equal(client.inspect().runtimeRevision,2);
        const resumed=client.runtime();resumed.resetClock(1000);const frame=resumed.pump({...client.readFrame(),tick:1000});assert.equal(frame.error,null);assert.equal(frame.frame.actorLayer.actors[0].handler,undefined);const image=await client.library().startRender(frame.frame.sceneLayer.drawPlan).done;assert.equal(image.rgba.length,320*240*4);
      }
    }
    state=client.copyWorldState();const owner=client.inspect();assert.equal(session.inspect().io.writes,5);client.close();const end=await client.done;assert.equal(end.world.state,'closed');assert.equal(end.library.state,'closed');assert.equal(end.cleanupErrors,0);
    const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_spin_boundary,true);assert.equal(receipt.spin_actions_sent,3);assert.equal(receipt.spin_parameter2_sent,999);assert.equal(receipt.scene_reloaded,mode==='spin-reload');assert.equal(receipt.extra_unit_on_relocation,false);assert.equal(receipt.official_session,false);
    if(native){assert.equal(native.stats.closed,1);assert.equal(native.sockets[0].listenerCount(),0);}
    return {mode,platform,sourceFrames,independentRastersVerified:sourceFrames,originalOnly:true,host:{state:owner.state,runtimeRevision:owner.runtimeRevision,remoteCount:state.actors.remoteCount,players:state.actorFrames.players,normalRawResourceId:state.actors.localActor.normalRawResourceId,bodyRawResourceId:state.actors.localActor.rawResourceId,normalFacing:state.actors.localActor.normalFacingCode,localSpin:state.actors.localActor.specialSpin},relocated:relocated?{remoteCount:relocated.actors.remoteCount,players:relocated.actorFrames.players,position:relocated.localMovement.display,bodyRawResourceId:relocated.actors.localActor.rawResourceId,specialSpin:relocated.actors.localActor.specialSpin}:null,receipt,closed:end};
  }finally{client.close();files.close();material.mappingBytes.fill(0);material.moduleDigestBytes.fill(0);material.resourceParameters.fill(0);await peer.close();}
}

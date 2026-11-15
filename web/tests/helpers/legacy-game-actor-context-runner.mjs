/** Actual original peer/TCP/client/owned resources with source-derived mixed actors. Returns nonsensitive synthetic receipts. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../../../shared/index.mjs';
import {createLegacyGameSession} from '../../legacy-game-session.mjs';
import {createWeChatLegacyGameSession} from '../../../adapters/wechat/legacy-game-session.mjs';
import {fakeWeChat} from './wechat-tcp-fixture.mjs';
import {clientTCPOpen,clientWait} from './legacy-game-client-tcp-fixture.mjs';
import {actorContextOriginalPeer} from './legacy-game-actor-context-tcp-fixture.mjs';
import {originalFiles} from '../../../analysis/game-resource-runtime-v1/original_files.mjs';
import {assets,startup} from './legacy-game-client-fixture.mjs';
const v=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-context-v1/original-vectors.json',import.meta.url))),options=JSON.parse(readFileSync(new URL('../../../analysis/game-character-options-v1/original-vectors.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function runActorContextCase(mode,platform){
  const index=platform==='wechat'?1:0,row=options.flows[index],peer=await actorContextOriginalPeer(mode,index),files=originalFiles(assets),handle=api.createLegacyGameStartup(startup()),material=handle.copy();handle.close();
  const native=platform==='wechat'?fakeWeChat({native:true,loopbackPort:peer.port}):null;let sourceFrames=0;
  const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(material.resourceParameters),files:files.port,context:material.context,clock:()=>Math.trunc(performance.now())>>>0,onInvalidate(){},onState(){},
    createSession({world,graphics,onPacket,onState}){
      const base={sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,moduleDigestBytes:material.moduleDigestBytes,postLogin:{graphics},pollMilliseconds:1,onPacket,onState};
      return native?createWeChatLegacyGameSession({...base,wx:native.wx,endpoint:{address:'fixture.invalid',port:12345}}):createLegacyGameSession({...base,endpoint:{address:'127.0.0.1',port:peer.port},openStream:clientTCPOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController()});
    }});
  try{
    await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');
    for(const action of row.actions)session.changeCharacterAppearance(row.slot,action);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');
    assert.equal(client.copyWorldState().actors.remoteCount,8);let relocated=null;
    if(mode!=='mixed-close'){
      const runtime=client.runtime();runtime.resetClock(1000);
      for(const expected of v.mixed.frames){const out=runtime.pump({...client.readFrame(),tick:expected.tick});assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);assert.deepEqual(out.frame.actorLayer.submittedActorIds,expected.submittedActorIds);assert.deepEqual(out.frame.actorLayer.actors.filter(x=>x.state==='culled').map(x=>({id:x.id,reason:x.reason})),expected.culled);
        const image=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),expected.rgbaSha256,'source mixed actor TCP frame'+expected.update);sourceFrames++;}
      const state=client.copyWorldState();assert.equal(state.actors.remoteCount,7);assert.equal(state.actorFrames.players,8);assert.equal(state.actors.remoteActors.some(x=>x.id===303),false);assert.equal(state.actors.remoteActors.some(x=>x.id===304),true);
      peer.release();assert.equal((await peer.stage()).stage,'released');
      if(mode==='mixed-reload'){
        await clientWait(()=>client.inspect().sceneRevision===2&&client.inspect().state==='playing');relocated=client.copyWorldState();assert.equal(runtime.inspect().state,'closed');assert.equal(relocated.actors.remoteCount,0);assert.equal(relocated.actorFrames.players,0);assert.deepEqual(relocated.localMovement.display,[6,4]);assert.equal(relocated.actors.localActor.sourceFrame.bodyOrMask,0xb4);assert.equal(client.inspect().runtimeRevision,2);
      }
    }
    const state=client.copyWorldState(),owner=client.inspect();assert.equal(session.inspect().io.writes,5);client.close();const end=await client.done;assert.equal(end.world.state,'closed');assert.equal(end.library.state,'closed');assert.equal(end.cleanupErrors,0);
    const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_context_boundary,true);assert.equal(receipt.mixed_actors_sent,9);assert.equal(receipt.scene_reloaded,mode==='mixed-reload');assert.equal(receipt.extra_unit_on_relocation,false);assert.equal(receipt.official_session,false);
    if(native){assert.equal(native.stats.closed,1);assert.equal(native.sockets[0].listenerCount(),0);}assert.ok(await files.port.stat('Bin/Graphic.bin'));
    return {mode,platform,sourceFrames,independentRastersVerified:sourceFrames,originalOnly:true,host:{state:owner.state,runtimeRevision:owner.runtimeRevision,remoteCount:state.actors.remoteCount,players:state.actorFrames.players,localPosition:state.localMovement?.display,bodySource:state.actors.localActor.sourceFrame},relocated:relocated?{remoteCount:relocated.actors.remoteCount,players:relocated.actorFrames.players,position:relocated.localMovement.display}:null,receipt,closed:end};
  }finally{client.close();files.close();material.mappingBytes.fill(0);material.moduleDigestBytes.fill(0);material.resourceParameters.fill(0);await peer.close();}
}

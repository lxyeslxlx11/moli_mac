/** Actual loopback TCP through original source status messages and owning render clients. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../../../shared/index.mjs';
import {createLegacyGameSession} from '../../legacy-game-session.mjs';
import {createWeChatLegacyGameSession} from '../../../adapters/wechat/legacy-game-session.mjs';
import {fakeWeChat} from './wechat-tcp-fixture.mjs';
import {clientTCPOpen,clientWait} from './legacy-game-client-tcp-fixture.mjs';
import {actorTextOriginalPeer} from './legacy-game-actor-text-tcp-fixture.mjs';
import {originalFiles} from '../../../analysis/game-resource-runtime-v1/original_files.mjs';
import {textAssets} from '../../../analysis/game-actor-text-v1/original_assets.mjs';
import {assets,startup} from './legacy-game-client-fixture.mjs';
import {vectors as v,sha,checkTextFrame,textEventApplied,originalTextMask} from './legacy-game-actor-text-fixture.mjs';
const options=JSON.parse(readFileSync(new URL('../../../analysis/game-character-options-v1/original-vectors.json',import.meta.url)));
export async function runActorTextCase(mode,platform){
 const index=platform==='wechat'?1:0,row=options.flows[index],peer=await actorTextOriginalPeer(mode,index),files=originalFiles(textAssets(assets,v)),handle=api.createLegacyGameStartup(startup()),material=handle.copy();handle.close();
 const native=platform==='wechat'?fakeWeChat({native:true,loopbackPort:peer.port}):null;let sourceFrames=0;
 const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(material.resourceParameters),files:files.port,context:material.context,clock:()=>Math.trunc(performance.now())>>>0,rasterText:originalTextMask,onInvalidate(){},onState(){},
  createSession({world,graphics,onPacket,onState}){const base={sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,moduleDigestBytes:material.moduleDigestBytes,postLogin:{graphics},pollMilliseconds:1,onPacket,onState};return native?createWeChatLegacyGameSession({...base,wx:native.wx,endpoint:{address:'fixture.invalid',port:12345}}):createLegacyGameSession({...base,endpoint:{address:'127.0.0.1',port:peer.port},openStream:clientTCPOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController()});}});
 try{await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');for(const action of row.actions)session.changeCharacterAppearance(row.slot,action);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');
  client.setLabelMode(1);const runtime=client.runtime();runtime.resetClock(1000);const limit=mode==='text-reload'?v.reloadAt:mode==='text-close'?v.closeAt:v.full.frames.length;
  for(let i=0;i<limit;i++){
   for(const event of v.full.events.filter(e=>e.at===i)){if(event.kind==='cycle')assert.equal(client.cycleLabels(),event.mode);peer.send(event.key);assert.equal((await peer.stage()).stage,event.key+'-sent');await clientWait(()=>textEventApplied(client,event.key));}
   const expected=v.full.frames[i],out=runtime.pump({...client.readFrame(),tick:expected.tick});checkTextFrame(client,out,expected);const image=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),expected.rgbaSha256,'ordinary actor text TCP scene frame '+expected.update);sourceFrames++;
  }
  const active=client.copyWorldState();let relocated=null;assert.equal(active.actors.remoteCount,3);assert.equal(active.actors.labelCatalog.received,true);
  if(mode!=='text-close'){peer.release();assert.equal((await peer.stage()).stage,'released');if(mode==='text-reload'){await clientWait(()=>client.inspect().sceneRevision===2&&client.inspect().state==='playing');relocated=client.copyWorldState();assert.equal(relocated.actors.remoteCount,0);assert.equal(relocated.actors.localActor.attached,null);assert.equal(relocated.actorFrames.players,0);assert.equal(relocated.actorFrames.childPlayers,0);assert.deepEqual(relocated.actors.localActor.motion.display,[6,4]);assert.equal(relocated.actorLabelMode,3);assert.equal(relocated.actors.labelCatalog.received,true);assert.equal(relocated.actors.labelCatalog.selectedIndex,0);}}
  assert.equal(session.inspect().io.writes,5);client.close();const end=await client.done;assert.equal(end.world.state,'closed');assert.equal(end.library.state,'closed');assert.equal(end.cleanupErrors,0);const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_text_boundary,true);const events=v.full.events.filter(e=>e.at<limit);assert.equal(receipt.source_packets_sent,v.full.initialPlainHex.length+events.filter(e=>e.kind==='packet').length);assert.equal(receipt.local_option_changes,events.filter(e=>e.kind==='cycle').length);assert.equal(receipt.scene_reloaded,mode==='text-reload');
  return {mode,platform,sourceFrames,receipt,active:{players:active.actorFrames.players,childPlayers:active.actorFrames.childPlayers,localAttached:active.actors.localActor.attached,remoteCount:active.actors.remoteCount},relocated:relocated?{players:relocated.actorFrames.players,childPlayers:relocated.actorFrames.childPlayers}:null,closedOwners:true,nativeWeChatAcceptance:false,officialSession:false};
 }finally{client.close();files.close();material.mappingBytes.fill(0);material.moduleDigestBytes.fill(0);material.resourceParameters.fill(0);await peer.close();}
}

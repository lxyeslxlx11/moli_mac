import {runPartyTCP} from '../game-party-follow-v1/tcp-flow.mjs';
import {vitalsAssets} from '../game-actor-vitals-v1/original_assets.mjs';
import {originalTextMask as vitalsMask} from '../game-actor-vitals-v1/original_font.mjs';
import {actorVitalsOriginalPeer} from '../../web/tests/helpers/legacy-game-actor-vitals-tcp-fixture.mjs';
import {vitalsEventApplied} from '../../web/tests/helpers/legacy-game-actor-vitals-fixture.mjs';
import {textAssets} from '../game-actor-text-v1/original_assets.mjs';
import {originalTextMask} from '../game-actor-text-v1/original_font.mjs';
import {textEventApplied} from '../../web/tests/helpers/legacy-game-actor-text-fixture.mjs';
import {actorTextOriginalPeer} from '../../web/tests/helpers/legacy-game-actor-text-tcp-fixture.mjs';
import {fakeWeChat} from '../../web/tests/helpers/wechat-tcp-fixture.mjs';
import {clientWait} from '../../web/tests/helpers/legacy-game-client-tcp-fixture.mjs';
import {presentationAssets} from '../game-actor-presentation-v1/original_assets.mjs';
import {presentationEventApplied} from '../../web/tests/helpers/legacy-game-actor-presentation-fixture.mjs';
import {rideAssets} from '../game-actor-ride-v1/original_assets.mjs';
/** Actual generated portable client/API in a neutral JS context; explicit original native ports only. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { originalFiles } from '../game-resource-runtime-v1/original_files.mjs';
import { originalStartup } from '../game-browser-owner-v1/original_startup.mjs';
import { characterAssets } from '../game-post-login-v1/original_assets.mjs';
import {spinAssets} from '../game-actor-spin-v1/original_assets.mjs';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url))), post = read('../game-post-login-v1/original-vectors.json'), scene = read('../game-legacy-scene-frame-v1/original-vectors.json'), input = read('../game-input-runtime-v1/original-vectors.json'), options = read('../game-character-options-v1/original-vectors.json');
const assets = characterAssets(read('../game-resource-runtime-v1/original-vectors.json')), startup = () => originalStartup({ post, scene, input });
const mixedVectors = read('../game-actor-context-v1/original-vectors.json'),spinVectors=read('../game-actor-spin-v1/original-vectors.json'),rideVectors=read('../game-actor-ride-v1/original-vectors.json'),presentationVectors=read('../game-actor-presentation-v1/original-vectors.json');
const code = readFileSync(new URL('../../build/wechat-game-stage207-verified/game.js', import.meta.url), 'utf8'), bytes = h => new Uint8Array(Buffer.from(h, 'hex')), hex = b => Buffer.from(b).toString('hex');
function instance() {
  const module = { exports: {} }; runInNewContext(code, { module, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, ArrayBuffer, DataView,
    Buffer: undefined, URL: undefined, TextEncoder: undefined, TextDecoder: undefined, process: undefined, require: undefined, window: undefined, document: undefined,
    fetch: undefined, crypto: undefined, AbortController: undefined, AbortSignal: undefined, EventTarget: undefined, performance: undefined, setTimeout: undefined, clearTimeout: undefined }, { timeout: 1500 }); return module.exports;
}
test('neutral bundled world materializes from real source coordinates and retains native entry waits until the real unit/map records',()=>{
  const api=instance(),world=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(post.bootstrap.keyHex));
  const feed=plain=>{world.append(api.encodeLegacyGameEnvelope(c.encode(bytes(plain))));return world.next();};
  try{
    world.append(api.encodeLegacyGameEnvelope(bytes(post.bootstrap.payloadHex)));assert.equal(world.next().kind,'bootstrap');world.prepareCharacterEntry(123456);world.configureLocalMovement(null,scene.sourceContext);
    for(const i of [0,1,2,4])feed(scene.protocol.beforePlainHex[i]);let state=world.copyGameState();assert.equal(state.sourceEntryWaitMask,2);assert.equal(state.actors.localActor.rawResourceId,0);assert.equal(world.copyLocalSceneReadiness().ready,false);
    feed(Buffer.from('=X# 4 2 6 ','ascii').toString('hex'));feed(scene.protocol.beforePlainHex[3]);state=world.copyGameState();assert.equal(state.sourceEntryWaitMask,0);assert.equal(state.actors.localActor.id,100);assert.equal(state.actors.localActor.rawResourceId,100001);assert.deepEqual(Array.from(state.actors.localActor.motion.position),[256,128]);assert.equal(state.actors.localActor.motion.facingCode,6);assert.equal(world.copyLocalSceneReadiness().ready,true);
  }finally{world.close();c.close();}
});
test('actual neutral bundle validates owned startup/full explicit context without DOM/Buffer/text/network/timer globals', () => {
  const api = instance(), raw = startup(), handle = api.createLegacyGameStartup(raw), copy = handle.copy();
  try {
    assert.equal(copy.context.display.width, 320); assert.equal(handle.inspect().ownedBytes, 60); raw.context.runtime.ownGateByte = 128; assert.equal(copy.context.runtime.ownGateByte, 0);
    for (const edit of [r => r.sourceProfile = 'win32-current', r => delete r.context.movement.nativeInputGuard, r => r.context.actor.specialState = 1, r => r.context.input.nativePartyFlags = 256, r => r.moduleDigestHex = '00']) { const value = startup(); edit(value); assert.throws(() => api.createLegacyGameStartup(value)); }
  } finally { copy.mappingBytes.fill(0); copy.moduleDigestBytes.fill(0); copy.resourceParameters.fill(0); handle.close(); }
  assert.equal(handle.inspect().ownedBytes, 0); assert.throws(() => handle.copy());
});
async function bundledWeChatFlow(mixed = false, spin=false,ride=false,presentation=false) {
  const api = instance(), files = originalFiles(presentation?presentationAssets(assets,presentationVectors):ride?rideAssets(assets,rideVectors):spin?spinAssets(assets,spinVectors):assets), handle = api.createLegacyGameStartup(startup()), material = handle.copy(), row = options.flows[1], listeners = {}, writes = [];
  handle.close(); let wall = 0, closed = 0, created = 0;
  const frame = plain => { const c = api.createLegacyGamePayloadCodec(bytes(post.bootstrap.keyHex)); try { return api.encodeLegacyGameEnvelope(c.encode(bytes(plain))); } finally { c.close(); } };
  const socket = { connect() { queueMicrotask(() => { listeners.Connect(); listeners.Message({ message: api.encodeLegacyGameEnvelope(bytes(post.bootstrap.payloadHex)).buffer }); }); },
    write(raw) {
      const value = new Uint8Array(raw); writes.push(value.slice());
      if (writes.length <= 5) assert.equal(hex(value), [post.authFrameHex, post.flow.requests.list.frameHex, options.wire.request.frameHex, post.flow.requests.list.frameHex, row.entry.frameHex][writes.length - 1]);
      else assert.equal(hex(value), hex(frame(input.protocol.requestPlainHex[writes.length - 6])));
      const response = writes.length === 1 ? [bytes(post.authReplyFrameHex)] : writes.length === 2 ? [bytes(options.wire.category5.frameHex), bytes(row.initial.frameHex)] : writes.length === 3 ? [bytes(options.wire.accepted.frameHex)] : writes.length === 4 ? [bytes(options.wire.category8.frameHex), bytes(row.initial.frameHex)] : writes.length === 5 ? [bytes(post.flow.replies.entered.frameHex), ...(presentation?[...input.protocol.beforePlainHex.slice(0,3),presentationVectors.full.unitPlainHex,...presentationVectors.full.initialPlainHex,input.protocol.beforePlainHex[4]]:ride?[...input.protocol.beforePlainHex.slice(0,3),rideVectors.full.unitPlainHex,rideVectors.full.entryPlainHex,input.protocol.beforePlainHex[4]]:spin?[...input.protocol.beforePlainHex.slice(0,3),spinVectors.full.unitPlainHex,spinVectors.full.actionPlainHex,input.protocol.beforePlainHex[4]]:input.protocol.beforePlainHex.map((plain,index)=>mixed&&index===3?mixedVectors.mixed.plainHex:plain)).map(frame)] : [];
      queueMicrotask(() => { for (const b of response) listeners.Message({ message: b.buffer }); });
    }, close() { closed++; } };
  for (const name of ['Connect', 'Message', 'Error', 'Close']) { socket['on' + name] = fn => { listeners[name] = fn; }; socket['off' + name] = fn => { if (listeners[name] === fn) delete listeners[name]; }; }
  const wx = { createTCPSocket() { created++; return socket; } }, client = api.createLegacyGameClient({ plan: api.createLegacyGameResourcePlan(material.resourceParameters), files: files.port, context: material.context,
    clock: () => wall, onState() {}, onInvalidate() {}, createSession({ world, graphics, onPacket, onState }) { return api.createWeChatLegacyGameSession({ sourceProfile: material.sourceProfile, world, mappingBytes: material.mappingBytes, moduleDigestBytes: material.moduleDigestBytes, postLogin: { graphics }, endpoint: { address: 'fixture.invalid', port: 12345 }, pollMilliseconds: 1, wx, wallNow: () => wall,
      setTimer(fn, delay) { return setTimeout(() => { wall += delay; fn(); }, 1); }, clearTimer: clearTimeout, onPacket, onState }); } });
  try {
    await client.start(); const session = client.session(); await session.charactersReady; assert.equal((await session.beginVersionUpgrade()).characters.state, 'upgrade-success'); session.acknowledgeVersionUpgrade();
    for (let i = 0; i < 1000 && session.inspect().characters.state !== 'choosing'; i++) await new Promise(r => setTimeout(r, 1)); assert.equal(session.inspect().characters.state, 'choosing'); session.changeCharacterAppearance(1, 3); session.enterCharacter(1);
    assert.equal((await client.ready).state, 'playing'); const runtime = client.runtime(); runtime.resetClock(1000); if(!mixed&&!spin&&!ride&&!presentation){runtime.move([256, 48]); runtime.press(0); runtime.release(0);}
    for (const row of (presentation?presentationVectors.full.frames:ride?rideVectors.full.frames:spin?spinVectors.full.frames:mixed?mixedVectors.mixed.frames:input.worldFrames)) { if(presentation)for(const e of presentationVectors.full.events.filter(e=>e.at===row.update-1)){
        listeners.Message({message:frame(e.plainHex).buffer});for(let i=0;i<1000&&!presentationEventApplied(client,e.key);i++)await new Promise(resolve=>setTimeout(resolve,1));assert.equal(presentationEventApplied(client,e.key),true);
      }if(ride&&(row.update-1===rideVectors.full.exitAt||row.update-1===rideVectors.full.reenterAt)){
        const next=row.update-1===rideVectors.full.exitAt?2:1,plain=next===2?rideVectors.full.exitPlainHex:rideVectors.full.entryPlainHex;listeners.Message({message:frame(plain).buffer});
        for(let i=0;i<1000&&client.copyWorldState().actors.localActor.ride.state!==next;i++)await new Promise(resolve=>setTimeout(resolve,1));assert.equal(client.copyWorldState().actors.localActor.ride.state,next);
      }const result = runtime.pump({ ...client.readFrame(), tick: row.tick }); assert.equal(result.error, null); const rendered = await client.library().startRender(result.frame.sceneLayer.drawPlan).done; assert.equal(createHash('sha256').update(rendered.rgba).digest('hex'), (mixed||spin||ride||presentation?row.rgbaSha256:row.scene.rgbaSha256)); if (result.requests.length) await session.sendCommands(result.requests); }
    assert.equal(writes.length,mixed||spin||ride||presentation?5:7); if(spin){const state=client.copyWorldState();assert.equal(state.actors.remoteCount,2);assert.equal(state.actorFrames.players,3);assert.equal(state.actors.localActor.specialSpin.state,0);assert.equal(state.actors.localActor.normalRawResourceId,100001);assert.equal(state.actors.localActor.normalFacingCode,4);assert.equal(state.actors.remoteActors.find(a=>a.id===300).specialSpin.counter,400);} if(mixed){assert.equal(client.copyWorldState().actors.remoteCount,7);assert.equal(client.copyWorldState().actorFrames.players,8);} client.pause(); wall += 1000000; client.resume(); assert.equal(client.inspect().state, 'playing'); client.close(); const end = await client.done;
    assert.equal(end.world.state, 'closed'); assert.equal(end.library.state, 'closed'); assert.equal(end.runtime, null); assert.equal(end.cleanupErrors, 0); assert.equal(closed, 1); assert.equal(created, 1); assert.equal(Object.keys(listeners).length, 0); assert.ok(await files.port.stat('Bin/Graphic.bin'));
  } finally { client.close(); files.close(); material.mappingBytes.fill(0); material.moduleDigestBytes.fill(0); material.resourceParameters.fill(0); }
}
test('actual neutral bundled WeChat client retains source52frame movement and ownership',()=>bundledWeChatFlow(false));
test('actual neutral bundled WeChat client binds mixed actors and120 independent source rasters',()=>bundledWeChatFlow(true));
test('actual neutral bundled WeChat client completes source80 over400 independent scene rasters and preserves local normal sources',()=>bundledWeChatFlow(false,true));

test('actual neutral bundled WeChat client enters, exits and reenters rides over110 independent complete scene rasters',()=>bundledWeChatFlow(false,false,true));

test('actual neutral bundled WeChat client owns status words and icons over720 independent complete scenes',()=>bundledWeChatFlow(false,false,false,true));

test('neutral actual API bundle renders120 ordinary text scenes through explicit original glyph and OS TCP ports',async()=>{
 const api=instance(),v=read('../game-actor-text-v1/original-vectors.json'),peer=await actorTextOriginalPeer('text-full',1),native=fakeWeChat({native:true,loopbackPort:peer.port}),files=originalFiles(textAssets(assets,v)),handle=api.createLegacyGameStartup(startup()),m=handle.copy(),row=options.flows[1];handle.close();let wall=0;
 const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(m.resourceParameters),files:files.port,context:m.context,rasterText:originalTextMask,clock:()=>wall,onInvalidate(){},onState(){},
  createSession({world,graphics,onPacket,onState}){return api.createWeChatLegacyGameSession({sourceProfile:m.sourceProfile,world,mappingBytes:m.mappingBytes,moduleDigestBytes:m.moduleDigestBytes,postLogin:{graphics},endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,wx:native.wx,wallNow:()=>wall,setTimer(fn,delay){return setTimeout(()=>{wall+=delay;fn();},1);},clearTimer:clearTimeout,onPacket,onState});}});
 try{await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');for(const a of row.actions)session.changeCharacterAppearance(row.slot,a);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');client.setLabelMode(1);client.runtime().resetClock(1000);
  for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i)){if(e.kind==='cycle')assert.equal(client.cycleLabels(),e.mode);peer.send(e.key);assert.equal((await peer.stage()).stage,e.key+'-sent');await clientWait(()=>textEventApplied(client,e.key));}const r=v.full.frames[i],out=client.runtime().pump({...client.readFrame(),tick:r.tick});assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);assert.equal(JSON.stringify(out.frame.sceneLayer.drawPlan.text?.runs??[]),JSON.stringify(r.runs));const pixels=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256);}
  assert.equal(client.copyWorldState().actors.remoteCount,3);peer.release();assert.equal((await peer.stage()).stage,'released');client.close();const end=await client.done;assert.equal(end.cleanupErrors,0);assert.equal(end.library.state,'closed');assert.equal(end.world.state,'closed');const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_text_boundary,true);assert.equal(receipt.source_packets_sent,v.full.events.filter(e=>e.kind==='packet').length);
 }finally{client.close();files.close();m.mappingBytes.fill(0);m.moduleDigestBytes.fill(0);m.resourceParameters.fill(0);await peer.close();}
});
test('neutral actual API bundle renders120 ordinary value-bar and party scenes through explicit original glyph and OS TCP ports',async()=>{
 const api=instance(),v=read('../game-actor-vitals-v1/original-vectors.json'),peer=await actorVitalsOriginalPeer('vitals-full',1),native=fakeWeChat({native:true,loopbackPort:peer.port}),files=originalFiles(vitalsAssets(assets,v)),handle=api.createLegacyGameStartup(startup()),m=handle.copy(),row=options.flows[1];handle.close();let wall=0;
 const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(m.resourceParameters),files:files.port,context:m.context,rasterText:vitalsMask,clock:()=>wall,onInvalidate(){},onState(){},
  createSession({world,graphics,onPacket,onState}){return api.createWeChatLegacyGameSession({sourceProfile:m.sourceProfile,world,mappingBytes:m.mappingBytes,moduleDigestBytes:m.moduleDigestBytes,postLogin:{graphics},endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,wx:native.wx,wallNow:()=>wall,setTimer(fn,delay){return setTimeout(()=>{wall+=delay;fn();},1);},clearTimer:clearTimeout,onPacket,onState});}});
 try{await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');for(const a of row.actions)session.changeCharacterAppearance(row.slot,a);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');client.setLabelMode(1);client.setBarsVisible(true);client.runtime().resetClock(1000);
  for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i)){if(e.kind==='cycle')assert.equal(client.cycleLabels(),e.mode);else if(e.kind==='bars')assert.equal(client.setBarsVisible(e.visible),e.visible);peer.send(e.key);assert.equal((await peer.stage()).stage,e.key+'-sent');await clientWait(()=>vitalsEventApplied(client,e.key));}const r=v.full.frames[i],out=client.runtime().pump({...client.readFrame(),tick:r.tick});assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);assert.equal(JSON.stringify(out.frame.sceneLayer.drawPlan.text?.runs??[]),JSON.stringify(r.runs));const pixels=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256);}
  assert.equal(client.copyWorldState().actors.remoteCount,3);peer.release();assert.equal((await peer.stage()).stage,'released');client.close();const end=await client.done;assert.equal(end.cleanupErrors,0);assert.equal(end.library.state,'closed');assert.equal(end.world.state,'closed');const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_vitals_boundary,true);assert.equal(receipt.source_packets_sent,v.full.initialPlainHex.length+v.full.events.filter(e=>e.kind==='packet').length);
 }finally{client.close();files.close();m.mappingBytes.fill(0);m.moduleDigestBytes.fill(0);m.resourceParameters.fill(0);await peer.close();}
});

for(const name of ['leader','follower','removal'])test('neutral actual API bundle party '+name+' follows independent complete scenes over OS TCP without ambient platform globals',()=>runPartyTCP(instance(),name));

import {runActionsTCP} from '../game-party-actions-v1/tcp-flow.mjs';
for(const mode of ['actions','full'])test('neutral generated API actual OS TCP party '+mode,()=>runActionsTCP(instance(),mode));

import {runBattleTCP} from '../game-battle-transition-v1/tcp-flow.mjs';
for(const mode of ['records','ring-wrap'])test('neutral generated API actual OS TCP battle '+mode,()=>runBattleTCP(instance(),mode));

import {runMotionTCP} from '../game-battle-runtime-v1/tcp-flow.mjs';
for(const mode of ['records','ring-wrap'])test('neutral generated API actual OS TCP battle motion preparation '+mode,()=>runMotionTCP(instance(),mode));

import {runCommandTCP} from '../game-battle-commands-v1/tcp-flow.mjs';
for(const mode of ['queues','end','eof'])test('neutral generated API source battle command calls over actual OS TCP '+mode,()=>runCommandTCP(instance(),mode));

import {runBodyTCP} from '../game-battle-body-v1/tcp-flow.mjs';
for(const mode of ['sup','escape-failed','escape-other','escape-local','status','end','dead-sup'])test('neutral generated actual client resource body callback TCP '+mode,async()=>{const result=await runBodyTCP(instance(),mode);console.log('battle-body-neutral-tcp '+JSON.stringify(result));});

import {runBattleFrameTCP} from '../game-battle-scene-v1/tcp-flow.mjs';
for(const mode of ['status','escape-other','pause','close','read-fail'])test('neutral generated actual client battle frame TCP/resources/ownership '+mode,{timeout:30000},async()=>{
  console.log('battle-frame-neutral-tcp '+JSON.stringify(await runBattleFrameTCP(instance(),mode)));
});
test('neutral actual bundle retains36 independently authored native battle depth sort cases',()=>{const api=instance(),v=read('../game-battle-scene-v1/original-vectors.json');for(const row of v.sorts)assert.equal(JSON.stringify(api.sortLegacyGameBattleDepth(row.rows)),JSON.stringify(row.expected));});

import {runEntryTCP}from'../game-battle-entry-v1/tcp-flow.mjs';
for(const mode of ['normal','delayed','arrivals','pause-capture','pause-C','close-capture','read-fail','reentry','popup','ring-wrap','handoff'])test('neutral generated actual client main10 entry/C/capture TCP '+mode,{timeout:30000},async()=>{console.log('battle-entry-neutral-tcp '+JSON.stringify(await runEntryTCP(instance(),mode)));});
test('neutral actual bundle computes all54 source fade steps without ambient platform globals',()=>{const api=instance(),v=read('../game-battle-entry-v1/original-vectors.json'),player=api.createLegacyGameBattleEntryFade();try{for(const row of v.fade){const out=player.step();assert.equal(out.complete,row.complete);assert.equal(JSON.stringify(out.rowOffsets),JSON.stringify(row.rowOffsets));assert.equal(JSON.stringify(Array.from(player.copyState().velocities)),JSON.stringify(row.velocities));}}finally{player.close();}});

import {inputTCPModes,runInputTCP}from'../game-battle-input-v1/tcp-flow.mjs';
for(const mode of inputTCPModes)test('neutral generated actual basic battle input TCP '+mode,{timeout:30000},async()=>{console.log('battle-input-neutral-tcp '+JSON.stringify(await runInputTCP(instance(),mode)));});
test('neutral generated target eligibility/code reference has no implicit platform globals',()=>{const api=instance(),v=read('../game-battle-input-v1/original-vectors.json');for(const r of v.targetMasks)assert.equal(JSON.stringify(api.legacyGameBattleTargetMask(r.rows,r.actingSlot,r.mask,r.controlFlags,r.localSlot)),JSON.stringify(r.expected));for(const r of v.targetCodes)assert.equal(JSON.stringify(api.legacyGameBattleTargetCode(r.slot,r.mask,r.eligibleMask)),JSON.stringify(r.expected));});

import {loopVectors,runLoopReference}from'../game-battle-loop-v1/reference-flow.mjs';
import {loopTCPModes,runLoopTCP}from'../game-battle-loop-v1/tcp-flow.mjs';
test('neutral generated API follows8 independent M scheduling and round traces',async()=>{let steps=0;for(const row of loopVectors.scenarios)steps+=await runLoopReference(instance(),row);assert.equal(steps,33);});
for(const mode of loopTCPModes)test('neutral generated automatic M/round and actual OS TCP '+mode,{timeout:30000},async()=>{console.log('battle-loop-neutral-tcp '+JSON.stringify(await runLoopTCP(instance(),mode)));});

import{exitTCPModes,runExitTCP}from'../game-battle-exit-v1/tcp-flow.mjs';
import{exitVectors,originalExitCapture}from'../game-battle-exit-v1/reference.mjs';
test('neutral generated exit12/14 matches105 source numeric/copy updates and32 clipping cases',()=>{const api=instance(),rgba=originalExitCapture(),sha=b=>createHash('sha256').update(b).digest('hex');for(const mode of exitVectors.modes){const f=api.createLegacyGameBattleExitFade(mode.type);try{for(const row of mode.frames){const out=f.step();assert.equal(JSON.stringify(Array.from(out.rowPositions)),JSON.stringify(row.rowPositions));assert.equal(out.complete,row.complete);assert.equal(sha(api.composeLegacyGameBattleExitFade({width:640,height:480,rgba},out.rowPositions,mode.type,640,480).rgba),row.rgbaSha256);}for(const clip of mode.clips)assert.equal(sha(api.composeLegacyGameBattleExitFade({width:640,height:480,rgba},mode.frames[clip.call-1].rowPositions,mode.type,clip.width,clip.height).rgba),clip.rgbaSha256);}finally{f.close();}}});
for(const mode of exitTCPModes)test('neutral generated exit capture/source9 boundary and actual OS TCP '+mode,{timeout:30000},async()=>{console.log('battle-exit-neutral-tcp '+JSON.stringify(await runExitTCP(instance(),mode)));});

import{returnTCPModes,runReturnTCP}from'../game-battle-return-v1/tcp-flow.mjs';
for(const mode of returnTCPModes)test('neutral generated actual ordinary return/resumed movement OS TCP '+mode,{timeout:30000},async()=>{console.log('battle-return-neutral-tcp '+JSON.stringify(await runReturnTCP(instance(),mode)));});
test('neutral actual bundle exposes the constrained normal-origin return profile without platform globals',()=>{const api=instance();assert.equal(api.LEGACY_GAME_BATTLE_RETURN_PROFILE.sourceInitialization,'derived-normal-main9-3-origin');assert.equal(api.LEGACY_GAME_BATTLE_RETURN_PROFILE.completeNativeMain9,false);});

import{runSkillTCP,skillTCPModes}from'../game-battle-skill-v1/tcp-flow.mjs';
for(const mode of skillTCPModes)test('neutral generated actual physical skill/result/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-skill-neutral-tcp '+JSON.stringify(await runSkillTCP(instance(),mode))));

function freshViewportClient(){const api=instance(),files=originalFiles(assets),handle=api.createLegacyGameStartup(startup()),m=handle.copy();handle.close();const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(m.resourceParameters),files:files.port,context:m.context,clock:()=>0,onState(){},onInvalidate(){},createSession(){throw Error('Unexpected session creation.');}});return{api,files,m,client,close(){client.close();files.close();m.mappingBytes.fill(0);m.moduleDigestBytes.fill(0);m.resourceParameters.fill(0);}};}
test('neutral new battle state/viewport ports expose the real unstarted owner without implicit resource/network activity',()=>{const f=freshViewportClient();try{const s=f.client.copyBattleState();assert.equal(s.pending,false);assert.equal(s.rows.length,22);assert.equal(s.characters.read,0);assert.equal(s.motion.read,0);assert.throws(()=>f.client.configureBattleViewport({width:640,height:480}),e=>e.code==='LEGACY_CLIENT_NOT_READY');assert.equal(f.files.calls.length,0);assert.equal(f.client.inspect().state,'idle');}finally{f.close();}});
test('neutral new battle read/presentation ports retain actual closed-owner and borrowed-file boundaries',async()=>{const f=freshViewportClient();try{const snapshot=f.client.copyBattleState();f.client.close();assert.throws(()=>f.client.copyBattleState(),e=>e.code==='LEGACY_CLIENT_CLOSED');assert.throws(()=>f.client.configureBattleViewport({width:640,height:480}),e=>e.code==='LEGACY_CLIENT_NOT_READY');assert.equal(snapshot.rows.every(r=>r===null),true);assert.equal((await f.client.done).cleanupErrors,0);assert.ok(await f.files.port.stat('Bin/Graphic.bin'));}finally{f.close();}});

import{runStatusTCP,statusTCPModes}from'../game-battle-status-v1/tcp-flow.mjs';
for(const mode of statusTCPModes)test('generated neutral actual PSN/resource/round/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-status-generated-tcp '+JSON.stringify(await runStatusTCP(instance(),mode))));
test('generated neutral PSN profile and constructor preserve explicit numeric/resource ownership',()=>{const api=instance();assert.deepEqual(Array.from(api.LEGACY_GAME_BATTLE_STATUS_PROFILE.selectors),[0,1,2]);const bodies=api.createLegacyGameBattleBodies();assert.equal(typeof bodies.queueStatus,'function');assert.equal(bodies.queueStatus({index:9,attachedRID:0,fields:[0,0,0,0,1]},1).kind,'status-unavailable');bodies.close();});

import{runChangeTCP,changeTCPModes}from'../game-battle-change-v1/tcp-flow.mjs';
for(const mode of changeTCPModes)test('generated neutral actual POS/EQU/row/current-local/round/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-change-generated-tcp '+JSON.stringify(await runChangeTCP(instance(),mode))));
test('generated neutral POS/EQU profiles and owners remain inert without explicit playback/resource ports',()=>{const api=instance();assert.equal(api.LEGACY_GAME_BATTLE_CHANGE_PROFILE.fixedObjectPriority,true);assert.equal(api.LEGACY_GAME_BATTLE_CHANGE_PROFILE.completeCharacterChanges,false);const b=api.createLegacyGameBattleBodies(),before=JSON.stringify(b.copyState());assert.equal(b.queuePosition({index:4,attachedRID:0,fields:[0]},1).kind,'change-unavailable');assert.equal(b.queueEquipment({index:6,attachedRID:0,fields:[0,100030,0]},1,0).kind,'change-unavailable');assert.equal(JSON.stringify(b.copyState()),before);b.close();assert.throws(()=>b.queuePosition({index:4,attachedRID:0,fields:[0]},1));});

import{runCharacterChangeTCP,characterChangeTCPModes}from'../game-battle-character-change-v1/tcp-flow.mjs';
for(const mode of characterChangeTCPModes)test('neutral generated actual CBC/vitals/linked/round/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-character-change-generated-tcp '+JSON.stringify(await runCharacterChangeTCP(instance(),mode))));
test('neutral generated CBC profile and real owner constructor remain inert without injected ports',()=>{const api=instance();assert.equal(api.LEGACY_GAME_BATTLE_CHARACTER_CHANGE_PROFILE.token,'CBC');assert.equal(api.LEGACY_GAME_BATTLE_CHARACTER_CHANGE_PROFILE.immediateCompletion,true);const b=api.createLegacyGameBattleBodies();assert.equal(b.copyState().bodies.filter(Boolean).length,0);b.close();assert.throws(()=>b.copyState());});

import{runMountedInputTCP,mountedInputTCPModes}from'../game-battle-mounted-input-v1/tcp-flow.mjs';
for(const mode of mountedInputTCPModes)test('neutral generated received pet/mounted input/round/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-mounted-input-generated-tcp '+JSON.stringify(await runMountedInputTCP(instance(),mode))));

import{runPetTransitionTCP,petTransitionTCPModes}from'../game-battle-pet-transition-v1/tcp-flow.mjs';
for(const mode of petTransitionTCPModes)test('neutral generated normal M/received MON/selector/nextC/return OS TCP '+mode,{timeout:30000},async()=>console.log('battle-pet-transition-generated-tcp '+JSON.stringify(await runPetTransitionTCP(instance(),mode))));
import{petTransitionVectors,verifyPetTransitionTrace}from'../game-battle-pet-transition-v1/reference.mjs';
for(const row of petTransitionVectors.traces)test('neutral generated independent MON callback/queue/two-selector/pixel reference '+row.name,()=>verifyPetTransitionTrace(instance(),assert,row));
test('neutral presentation factory keeps per-owner identity/parity without browser or process globals',()=>{const a=instance(),p=a.createLegacyGamePresentation(),q=a.createLegacyGamePresentation(),stamp=p.capture();assert.equal(p.present(q.capture()),false);assert.equal(p.inspect().serial,0);assert.equal(p.present(stamp),true);assert.equal(p.inspect().selector,1);assert.equal(p.present(stamp),false);const next=p.capture();p.invalidate();assert.equal(p.present(next),false);p.close();q.close();});

import{playerSkillTCPModes,runPlayerSkillTCP}from'../game-battle-player-skills-v1/tcp-flow.mjs';
import{playerSkillVectors as primarySkillVectors,verifyPlayerSkillReceives}from'../game-battle-player-skills-v1/reference.mjs';
test('neutral actual API45 independent complete player receive states without platform globals',()=>assert.equal(verifyPlayerSkillReceives(instance(),assert),45));
test('neutral actual API110 independent signed primary MP cost boundaries',()=>{const api=instance();for(const r of primarySkillVectors.costs)assert.equal(api.legacyGamePlayerSkillCost(r.main,r.level),r.expected);});
for(const mode of playerSkillTCPModes)test('neutral actual API received player skills/S/real result/round/return TCP '+mode,{timeout:30000},async()=>console.log('player-skills-generated-tcp '+JSON.stringify(await runPlayerSkillTCP(instance(),mode))));

import{castingTCPModes,runCastingTCP}from'../game-battle-casting-v1/tcp-flow.mjs';
import{castingVectors,castingMotion}from'../game-battle-casting-v1/reference.mjs';
for(const mode of castingTCPModes)test('neutral actual casting S/M/projectile/round/return TCP '+mode,{timeout:30000},async()=>console.log('casting-generated-tcp '+JSON.stringify(await runCastingTCP(instance(),mode))));
test('neutral casting queues and homing equations match4686 independent source branches and294 angle boundaries',()=>{const api=instance();for(const row of castingVectors.queues){const c=api.decodeLegacyGameBattleMotion(castingMotion(row.case)).commands[0],plan=api.planBattleCasting(c,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local,0);assert.equal(JSON.stringify(plan.rows),JSON.stringify(row.expected.rows));assert.equal(plan.reflectedAmount,row.expected.reflectedAmount);}for(const r of castingVectors.homing)assert.equal(api.legacyGameBattleHomingAngle(r.angle,r.x,r.y,r.limit),r.expected);assert.equal(api.LEGACY_GAME_BATTLE_CASTING_PROFILE.completeSKL,false);});

test('neutral CRT negative-divisor/overflow boundaries consume the exact source seeds',()=>{const api=instance(),v=read('../game-battle-casting-v1/original-boundaries.json');for(const r of v.rows){const rng=api.createLegacyGameBattleRandom(r.initial);for(const s of r.steps){assert.equal(rng.copySeed(),s.before);assert.equal(rng.range(s.low,s.high),s.value);assert.equal(rng.copySeed(),s.after);}}});

import{statusSkillTCPModes,runStatusSkillTCP}from'../game-battle-status-skills-v1/tcp-flow.mjs';
import{statusSkillVectors,statusSkillMotion}from'../game-battle-status-skills-v1/reference.mjs';
for(const mode of statusSkillTCPModes)test('neutral actual status/utility S/M/callback/round/return TCP '+mode,{timeout:40000},async()=>console.log('status-skills-generated-tcp '+JSON.stringify(await runStatusSkillTCP(instance(),mode))));
test('neutral all36 status/utility ten-level queues equal2912 independent source cases',()=>{const api=instance();for(const row of statusSkillVectors.queues){const command=api.decodeLegacyGameBattleMotion(statusSkillMotion(row.case)).commands[0],p=api.planBattleStatusSkill(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local);assert.equal(JSON.stringify(p.rows),JSON.stringify(row.expected.rows));}assert.equal(api.LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE.completeSKL,false);});

import{numericSkillTCPModes,runNumericSkillTCP}from'../game-battle-numeric-skills-v1/tcp-flow.mjs';
import{numericSkillVectors,numericSkillMotion}from'../game-battle-numeric-skills-v1/reference.mjs';
for(const mode of numericSkillTCPModes)test('neutral actual numeric/healing S/M/callback/round/return TCP '+mode,{timeout:40000},async()=>console.log('numeric-skills-generated-tcp '+JSON.stringify(await runNumericSkillTCP(instance(),mode))));
test('neutral all3 numeric/healing ten-level queues equal2317 independent source cases',()=>{const api=instance();for(const row of numericSkillVectors.queues){const command=api.decodeLegacyGameBattleMotion(numericSkillMotion(row.case)).commands[0],p=api.planBattleNumericSkill(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local);assert.equal(JSON.stringify(p.rows),JSON.stringify(row.expected.rows));assert.equal(p.reflectedAmount,row.expected.reflectedAmount);}assert.equal(api.LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.completeSKL,false);});

import{movingNumericTCPModes,runMovingNumericTCP}from'../game-battle-moving-numeric-v1/tcp-flow.mjs';
import{movingNumericVectors,movingNumericMotion}from'../game-battle-moving-numeric-v1/reference.mjs';
for(const mode of movingNumericTCPModes)test('neutral actual moving83 S/M/afterimage/stop/round/return TCP '+mode,{timeout:40000},async()=>console.log('moving-numeric-generated-tcp '+JSON.stringify(await runMovingNumericTCP(instance(),mode))));
test('neutral all939 source83 queues, midpoint and explicit removed-caster boundaries',()=>{const api=instance();for(const row of movingNumericVectors.queues){const command=api.decodeLegacyGameBattleMotion(movingNumericMotion(row.case)).commands[0],p=api.planBattleNumericSkill(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local);if(row.portableBoundary){assert.equal(p.kind,'numeric-skill-unavailable');assert.equal(p.reason,row.portableBoundary);}else{assert.deepEqual(JSON.parse(JSON.stringify(p.rows)),row.expected.rows);assert.equal(p.reflectedAmount,row.expected.reflectedAmount);}}assert.deepEqual(Array.from(api.LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE.midpoint),[318,270]);assert.equal(api.LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE.completeSKL,false);});

import{skill82TCPModes,runSkill82TCP}from'../game-battle-skill82-v1/tcp-flow.mjs';
import{skill82Vectors,skill82Motion}from'../game-battle-skill82-v1/reference.mjs';
for(const mode of skill82TCPModes)test('neutral actual82 scale/spin/metadata/target/shake/stop/round/return TCP '+mode,{timeout:40000},async()=>console.log('skill82-generated-tcp '+JSON.stringify(await runSkill82TCP(instance(),mode))));
test('neutral source82 queues and empty sentinel boundary match1463 independent cases',()=>{const api=instance();for(const row of skill82Vectors.queues){const c=api.decodeLegacyGameBattleMotion(skill82Motion(row.case)).commands[0],p=api.planBattleSkill82(c,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local,0);if(row.portableBoundary){assert.equal(p.kind,'skill82-unavailable');assert.equal(p.reason,row.portableBoundary);}else assert.deepEqual(JSON.parse(JSON.stringify(p.rows)),row.expected.rows);}assert.deepEqual(Array.from(api.LEGACY_GAME_BATTLE_SKILL82_PROFILE.midpoints,v=>Array.from(v)),[[188,203],[449,336]]);assert.equal(api.LEGACY_GAME_BATTLE_SKILL82_PROFILE.completeSKL,false);});

import{physicalTCPModes,runPhysicalTCP}from'../game-battle-physical-family-runtime-v1/tcp-flow.mjs';
import{physicalVectors,physicalMotion}from'../game-battle-physical-family-runtime-v1/reference.mjs';
for(const mode of physicalTCPModes)test('neutral actual physical family S/M/result/round/return TCP '+mode,{timeout:mode==='zero-KO'?180000:40000},async()=>console.log('physical-generated-tcp '+JSON.stringify(await runPhysicalTCP(instance(),mode))));
test('neutral current common physical queues match15995 independent cases',()=>{const api=instance();for(const row of physicalVectors.queues){const p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(physicalMotion(row.case)).commands[0],()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local,0);assert.equal(p.kind,'physical-family-plan',row.case.name);assert.deepEqual(JSON.parse(JSON.stringify(p.rows)),row.expected.rows,row.case.name);}assert.equal(api.LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.completeSKL,false);});

import{verifyReactionSmoke}from'../game-battle-physical-consumers-v1/verify-smoke-flow.mjs';
test('neutral source41f310 reaction factory retains body position and RNG',()=>verifyReactionSmoke(instance()));

import {verifyProjectileModel}from'../game-battle-physical-projectiles-v1/verify_model.mjs';
import {verifyProjectileQueues,verifyProjectileCallbacks,verifyProjectileManagers}from'../game-battle-physical-projectiles-v1/verify_routes.mjs';
import {verifySpecialsAtomic as verifyProjectileAtomic}from'./verify_routes.mjs';
import {projectileTCPModes,runProjectileTCP}from'./tcp-flow.mjs';
const projectileVectors=read('../game-battle-physical-projectiles-v1/original-vectors.json');
test('neutral generated full positive physical states and complete RGBA match independent source equations',async()=>console.log('projectile-generated-model '+JSON.stringify(await verifyProjectileModel(instance(),projectileVectors))));
test('neutral generated positive family and related73 producer/cursor contracts',()=>console.log('projectile-generated-queues '+JSON.stringify(verifyProjectileQueues(instance(),projectileVectors))));
test('neutral generated positive physical callbacks own probe/flight/multi target/cost/HP',async()=>console.log('projectile-generated-callbacks '+JSON.stringify(await verifyProjectileCallbacks(instance(),projectileVectors))));
test('neutral generated real manager owns round,244 and self73 wait recovery',async()=>console.log('projectile-generated-managers '+JSON.stringify(await verifyProjectileManagers(instance(),projectileVectors))));
test('neutral generated pending physical producers/accessors/capacity reject atomically',async()=>console.log('projectile-generated-atomic '+JSON.stringify(await verifyProjectileAtomic(instance(),projectileVectors))));
for(const mode of projectileTCPModes)test('neutral generated real positive physical S/M/result/round/return TCP '+mode,{timeout:40000},async()=>console.log('projectile-generated-tcp '+JSON.stringify(await runProjectileTCP(instance(),mode))));

import {verifySpecialsModel}from'./verify_model.mjs';
import {verifySpecialsCallbacks,verifySpecialsManagers,verifySpecialsAtomic,verifySpecialsMissingGraphics}from'./verify_routes.mjs';
const specialVectors=read('./original-vectors.json');
test('neutral generated64800 physical queues and new special state/draw/full RGBA equations',async()=>console.log('specials-generated-model '+JSON.stringify(await verifySpecialsModel(instance(),specialVectors))));
test('neutral generated special callback and tile deletion publication contracts',async()=>console.log('specials-generated-callbacks '+JSON.stringify(await verifySpecialsCallbacks(instance(),specialVectors))));
test('neutral generated new physical highest-tier real manager round ownership',async()=>console.log('specials-generated-managers '+JSON.stringify(await verifySpecialsManagers(instance(),specialVectors))));
test('neutral generated physical remaining branches and malformed/capacity atomic rejection',async()=>console.log('specials-generated-atomic '+JSON.stringify(await verifySpecialsAtomic(instance(),specialVectors))));
test('neutral generated missing special graphics reject before queue mutation',async()=>console.log('specials-generated-graphics '+JSON.stringify(await verifySpecialsMissingGraphics(instance(),specialVectors))));

import {vitalsAssets} from './original_assets.mjs';
import {originalTextMask as vitalsMask} from './original_font.mjs';
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
const code = readFileSync(new URL('../../build/wechat-game-stage177-final/game.js', import.meta.url), 'utf8'), bytes = h => new Uint8Array(Buffer.from(h, 'hex')), hex = b => Buffer.from(b).toString('hex');
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
 const api=instance(),v=read('./original-vectors.json'),peer=await actorVitalsOriginalPeer('vitals-full',1),native=fakeWeChat({native:true,loopbackPort:peer.port}),files=originalFiles(vitalsAssets(assets,v)),handle=api.createLegacyGameStartup(startup()),m=handle.copy(),row=options.flows[1];handle.close();let wall=0;
 const client=api.createLegacyGameClient({plan:api.createLegacyGameResourcePlan(m.resourceParameters),files:files.port,context:m.context,rasterText:vitalsMask,clock:()=>wall,onInvalidate(){},onState(){},
  createSession({world,graphics,onPacket,onState}){return api.createWeChatLegacyGameSession({sourceProfile:m.sourceProfile,world,mappingBytes:m.mappingBytes,moduleDigestBytes:m.moduleDigestBytes,postLogin:{graphics},endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,wx:native.wx,wallNow:()=>wall,setTimer(fn,delay){return setTimeout(()=>{wall+=delay;fn();},1);},clearTimer:clearTimeout,onPacket,onState});}});
 try{await client.start();const session=client.session();await session.charactersReady;assert.equal((await session.beginVersionUpgrade()).characters.state,'upgrade-success');session.acknowledgeVersionUpgrade();await clientWait(()=>session.inspect().characters.state==='choosing');for(const a of row.actions)session.changeCharacterAppearance(row.slot,a);session.enterCharacter(row.slot);assert.equal((await peer.stage()).stage,'initial-sent');assert.equal((await client.ready).state,'playing');client.setLabelMode(1);client.setBarsVisible(true);client.runtime().resetClock(1000);
  for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i)){if(e.kind==='cycle')assert.equal(client.cycleLabels(),e.mode);else if(e.kind==='bars')assert.equal(client.setBarsVisible(e.visible),e.visible);peer.send(e.key);assert.equal((await peer.stage()).stage,e.key+'-sent');await clientWait(()=>vitalsEventApplied(client,e.key));}const r=v.full.frames[i],out=client.runtime().pump({...client.readFrame(),tick:r.tick});assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);assert.equal(JSON.stringify(out.frame.sceneLayer.drawPlan.text?.runs??[]),JSON.stringify(r.runs));const pixels=await client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256);}
  assert.equal(client.copyWorldState().actors.remoteCount,3);peer.release();assert.equal((await peer.stage()).stage,'released');client.close();const end=await client.done;assert.equal(end.cleanupErrors,0);assert.equal(end.library.state,'closed');assert.equal(end.world.state,'closed');const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,5);assert.equal(receipt.actor_vitals_boundary,true);assert.equal(receipt.source_packets_sent,v.full.initialPlainHex.length+v.full.events.filter(e=>e.kind==='packet').length);
 }finally{client.close();files.close();m.mappingBytes.fill(0);m.moduleDigestBytes.fill(0);m.resourceParameters.fill(0);await peer.close();}
});

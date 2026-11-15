import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as api from '../../shared/index.mjs';
import { createLegacyGameSession } from '../legacy-game-session.mjs';
import { createWeChatLegacyGameSession } from '../../adapters/wechat/legacy-game-session.mjs';
import { fakeWeChat } from './helpers/wechat-tcp-fixture.mjs';
import { clientOriginalPeer, clientTCPOpen, clientWait } from './helpers/legacy-game-client-tcp-fixture.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { assets, startup, input } from './helpers/legacy-game-client-fixture.mjs';
const options = JSON.parse(readFileSync(new URL('../../analysis/game-character-options-v1/original-vectors.json', import.meta.url)));
const sha = b => createHash('sha256').update(b).digest('hex');
async function run(mode, platform, index = platform === 'wechat' ? 1 : 0) {
  const peer = await clientOriginalPeer(mode, index), files = originalFiles(assets), material = api.createLegacyGameStartup(startup()).copy(), reference = options.flows[index];
  const native = platform === 'wechat' ? fakeWeChat({ native: true, loopbackPort: peer.port }) : null; let lastPosition = null;
  const client = api.createLegacyGameClient({ plan: api.createLegacyGameResourcePlan(material.resourceParameters), files: files.port, context: material.context, clock: () => Math.trunc(performance.now()) >>> 0,
    onInvalidate() {}, onState(s) { if (!['closed', 'failed'].includes(s.state)) { const state = client.copyWorldState(); lastPosition = state.localMovement?.position ?? lastPosition; for (const actor of [state.actors.localActor, ...state.actors.remoteActors]) if (actor) { actor.labels.forEach(b => b?.fill(0)); actor.labelBytes?.fill(0); actor.attachmentBytes?.fill(0); } } },
    createSession({ world, graphics, onPacket, onState }) {
      const base = { sourceProfile: material.sourceProfile, world, mappingBytes: material.mappingBytes, moduleDigestBytes: material.moduleDigestBytes, postLogin: { graphics }, pollMilliseconds: 1, onPacket, onState };
      return native ? createWeChatLegacyGameSession({ ...base, wx: native.wx, endpoint: { address: 'fixture.invalid', port: 12345 } }) : createLegacyGameSession({ ...base, endpoint: { address: '127.0.0.1', port: peer.port }, openStream: clientTCPOpen(peer.port), clock: () => Math.trunc(performance.now()) >>> 0, setTimer: setTimeout, clearTimer: clearTimeout, createControl: () => new AbortController() });
    } });
  try {
    await client.start(); const session = client.session(); await session.charactersReady; let upgraded = await session.beginVersionUpgrade();
    if (mode === 'denied') { assert.equal(upgraded.characters.state, 'upgrade-error'); client.close(); const receipt = await peer.receipt(); assert.equal(receipt.total_client_requests, 3); assert.equal(receipt.roster_refresh_verified, false); return; }
    if (mode === 'retry') { assert.equal(upgraded.characters.state, 'upgrade-error'); upgraded = await session.retryVersionUpgrade(); }
    assert.equal(upgraded.characters.state, 'upgrade-success'); session.acknowledgeVersionUpgrade(); await clientWait(() => session.inspect().characters.state === 'choosing');
    for (const action of reference.actions) session.changeCharacterAppearance(reference.slot, action); const entry = session.enterCharacter(reference.slot);
    if (mode === 'cancel') { await clientWait(() => session.inspect().io.writes === 5); client.close(); assert.equal((await entry).sourceCharacterEntered, false); const receipt = await peer.receipt(); assert.equal(receipt.total_client_requests, 5); return; }
    const ready = await client.ready; assert.equal(ready.state, 'playing'); assert.equal((await entry).sourceCharacterEntered, true); assert.equal(ready.sceneRevision, 1);
    const runtime = client.runtime(); runtime.resetClock(1000); runtime.move([256, 48]); runtime.press(0); runtime.release(0); let requests = 0;
    for (const row of input.worldFrames) { const result = runtime.pump({ ...client.readFrame(), tick: row.tick }); assert.equal(result.error, null); const pixels = await client.library().startRender(result.frame.sceneLayer.drawPlan).done; assert.equal(sha(pixels.rgba), row.scene.rgbaSha256); requests += result.requests.length; if (result.requests.length) await session.sendCommands(result.requests); }
    assert.equal(requests, 2);
    if (mode === 'scene-switch') { client.pause(); peer.release(); await clientWait(() => client.inspect().sceneRevision === 2); assert.equal(client.inspect().paused, true); assert.equal(client.inspect().state, 'paused'); assert.equal(runtime.inspect().state, 'closed'); client.resume(); assert.equal(client.inspect().runtimeRevision, 2); client.close(); }
    const end = await client.done; assert.equal(end.state, 'closed'); assert.equal(end.errorCode, null); assert.equal(end.world.state, 'closed'); assert.equal(end.library.state, 'closed'); assert.equal(end.session.io.closeCalls, 1); assert.equal(end.cleanupErrors, 0);
    if (mode !== 'scene-switch') assert.deepEqual(lastPosition, [384, 256]); const receipt = await peer.receipt(); assert.deepEqual(receipt.entry_arguments, reference.entry.arguments); assert.equal(receipt.total_client_requests, mode === 'retry' ? 8 : 7); assert.equal(receipt.movement_requests_verified, 2); assert.equal(receipt.scene_reloaded, mode === 'scene-switch');
    if (native) { assert.equal(native.stats.created, 1); assert.equal(native.stats.closed, 1); assert.equal(native.sockets[0].listenerCount(), 0); }
  } finally { client.close(); files.close(); material.mappingBytes.fill(0); material.moduleDigestBytes.fill(0); material.resourceParameters.fill(0); await peer.close(); }
}
test('actual TCP portable client owns resource/auth/upgrade/selection/52frames/two moves andEOF disposal', { timeout: 20000 }, () => run('success', 'generic'));
test('actual WeChat-shaped client uses the same owner and second modified character with duplicate reply', { timeout: 20000 }, () => run('duplicate', 'wechat'));
test('actual TCP owner keeps corrected33100 fallback through source entry/render andclose', { timeout: 20000 }, () => run('success', 'generic', 2));
test('actual TCP source scene reload disposes runtime andpreserves pause beforeexplicit resume', { timeout: 20000 }, () => run('scene-switch', 'generic'));
test('actual TCP source upgrade retry uses explicit owner before authoritative refresh andscene', { timeout: 20000 }, () => run('retry', 'generic'));
test('actual TCP client denied upgrade never invents a refreshed roster orenters', { timeout: 20000 }, () => run('denied', 'generic'));
test('actual TCP disconnect before entry reply closes all owned resources without a scene', { timeout: 20000 }, () => run('cancel', 'generic'));

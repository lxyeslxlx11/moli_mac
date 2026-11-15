import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { clientFixture, clientMenu, clientEnter, scene, input, post, assets } from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import { flush, bytes, plain } from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
import { unit, action, send } from '../../web/tests/helpers/legacy-game-actor-attachment-fixture.mjs';
import { groundItemResource, groundPickupAssets } from '../../analysis/game-battle-shared-storage-v1/ground-pickup-fixture.mjs';
import { createLegacyGameMapChat } from '../legacy-game-map-chat.mjs';
import {
  createLegacyGameMapDialogGraphics, decodeLegacyGameChatText, decodeLegacyGameDescriptionText, encodeLauncherProcessField,
  encodeLegacyGameInteger, encodeLegacyGameTextField,
} from '../index.mjs';
const sha = b => createHash('sha256').update(b).digest('hex');
function offerGameText(f, tag, fields, text) {
  const args = fields.map(value => Buffer.from(encodeLegacyGameInteger(value)).toString('ascii'));
  const packet = Buffer.concat([Buffer.from([tag, ...args, ''].join(' ')), encodeLegacyGameTextField(Buffer.from(text)), Buffer.from(' ')]);
  f.offer(f.frame(packet.toString('hex')));
}
test('source display seeds from scene position and corrects camera before the next pointer update', async () => {
  const f = clientFixture({ display: 'legacy-se6000-37c4' });
  try {
    await clientEnter(f);
    const runtime = f.client.runtime(), frame = f.client.readFrame();
    assert.deepEqual([frame.width, frame.height, frame.center, frame.graphicsMode, frame.forceRender], [640, 480, [320, 240], 2, false]);
    assert.deepEqual(runtime.copyState().camera, [128, 192]);
    f.offer(f.frame(scene.protocol.afterPlainHex[0]));
    await f.drive(() => runtime.copyState().camera[0] === 384);
    assert.deepEqual(runtime.copyState().camera, [384, 256]);
    assert.equal(f.client.runtime(), runtime);
    assert.equal(runtime.copyState().updates, 0);
    runtime.move(frame.center);
    runtime.press(0);
    runtime.release(0);
    runtime.resetClock(f.tick);
    const result = runtime.pump({ ...frame, tick: f.tick });
    assert.equal(result.error, null);
    assert.deepEqual(result.inputUpdates[0].tile, [6, 4]);
    assert.deepEqual([result.frame.sceneLayer.drawPlan.width, result.frame.sceneLayer.drawPlan.height], [640, 480]);
  } finally { f.close(); }
});

test('explicit camera callers retain their first camera until the ordinary frame update', async () => {
  const f = clientFixture({ display: { width: 320, height: 240, center: [160, 120], initialCamera: [0, 0], graphicsMode: 2, forceRender: false } });
  try {
    await clientEnter(f);
    const runtime = f.client.runtime();
    assert.deepEqual(runtime.copyState().camera, [0, 0]);
    f.offer(f.frame(scene.protocol.afterPlainHex[0]));
    await f.drive(() => f.client.copyWorldState().localMovement.position[0] === 384);
    assert.deepEqual(runtime.copyState().camera, [0, 0]);
  } finally { f.close(); }
});

test('the source startup uses main 9 audio and lets received action gates take ownership', async () => {
  const f = clientFixture({ context: 'legacy-se6000-37c4', wallSeconds: () => 7000 });
  try {
    await clientEnter(f);
    await send(f, 'H#| ' + unit('3e', 4, 100001, 3) + '\t' + unit('4Q', 4, 100001, 1) + ' ');
    const actors = () => f.client.copyWorldState().actors;
    await f.drive(() => actors().remoteActors.length === 2);
    const runtime = f.client.runtime();
    runtime.resetClock(1000);
    const step = tick => {
      const result = runtime.pump({ ...f.client.readFrame(), tick });
      assert.equal(result.error, null);
      assert.equal(result.frame.actorFrameError, null);
      return result.frame.actorLayer;
    };
    const initial = step(1000);
    assert.deepEqual(initial.actors.map(a => [a.id, a.state, a.animation.graphicIndex]),
      [[100, 'advanced', 1002], [200, 'advanced', 1002], [300, 'advanced', 1002]]);
    assert.deepEqual(initial.events.filter(e => e.kind === 'sound').map(e => [e.actorId, e.value]), [[100, 7], [300, 7]]);
    await send(f, 'Hx! ' + [action('1C', 99, 5), action('3e', 99, 5)].join(',') + ' ');
    await f.drive(() => (actors().localActor.presentation.secondary & 128) !== 0 &&
      (actors().remoteActors[0].presentation.secondary & 128) !== 0);
    assert.deepEqual(step(1017).actors.map(a => [a.id, a.state, a.reason]),
      [[100, 'blocked', 'own-gate'], [200, 'blocked', 'record-gate'], [300, 'advanced', 'countdown']]);
  } finally { f.close(); }
});

test('an admitted VKW success parks input, preserves the notice and leaves later frames unread', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    const session = f.client.session(), runtime = f.client.runtime();
    for (const message of ['VKW refused successful ', 'VKW Successful detail ', 'VKW successful-extra detail ']) {
      await send(f, message);
      assert.equal(f.client.inspect().state, 'playing');
    }
    const position = f.client.copyWorldState().pose;
    const notice = f.frame(Buffer.from('VKW successful ignored ').toString('hex'));
    const later = f.frame(scene.protocol.afterPlainHex[0]);
    f.offer(new Uint8Array(Buffer.concat([notice, notice, later])));
    await f.drive(() => f.client.inspect().state === 'returning-server');
    assert.equal(session.inspect().state, 'returning-server');
    assert.equal(f.client.inspect().world.pendingBytes, notice.length + later.length);
    assert.deepEqual(f.client.copyWorldState().pose, position);
    assert.equal(runtime.inspect().state, 'closed');
    assert.equal(f.stats.closeCalls, 0);
    assert.equal(f.client.pause().state, 'returning-server');
    await assert.rejects(session.sendCommand('send-004f6710', [1, 2]), { code: 'LEGACY_SESSION_SERVER_RETURN' });
    assert.equal(f.writes.length, 3);
    f.client.close();
    assert.equal((await session.done).reason, 'source-server-return');
    assert.equal(f.stats.closeCalls, 1);
  } finally { f.close(); }
});

test('VKW while paused in battle retires the frame and discards unsent commands', async () => {
  let hold = false, rejectWrite;
  const f = clientFixture({ write: () => hold ? new Promise((_, reject) => { rejectWrite = reject; }) : undefined });
  try {
    await clientEnter(f);
    await send(f, '>HY 1 g8 ');
    await f.drive(() => f.client.inspect().state === 'battle-pending');
    f.client.pause();
    const session = f.client.session();
    hold = true;
    const submitted = assert.rejects(session.sendCommand('send-004f6710', [1, 2]).catch(error => {
      f.client.fail(error);
      throw error;
    }), { code: 'LEGACY_SESSION_SERVER_RETURN' });
    await f.drive(() => typeof rejectWrite === 'function');
    const queued = assert.rejects(session.sendCommand('send-004f6710', [2, 3]), { code: 'LEGACY_SESSION_SERVER_RETURN' });
    await send(f, 'VKW successful ignored ');
    await f.drive(() => f.client.inspect().state === 'returning-server');
    await queued;
    assert.equal(f.client.inspect().paused, false);
    rejectWrite(new Error('held write failed'));
    await submitted;
    assert.equal(f.client.inspect().state, 'returning-server');
    assert.equal(f.writes.length, 4);
    assert.equal(session.inspect().pendingWriteBytes, 0);
    assert.equal(f.stats.closeCalls, 0);
    f.client.close();
    assert.equal((await session.done).reason, 'source-server-return');
    assert.equal(f.stats.closeCalls, 1);
  } finally { f.close(); }
});

test('ordinary input uses the @Qu time slot for a tile event and carries sequence and pointer throttle across scenes', async () => {
  let wall = 7000;
  const profile = 'legacy-se6000-37c4';
  const f = clientFixture({ display: profile, movement: profile, input: profile, wallSeconds: () => wall });
  const value = n => Buffer.from(encodeLegacyGameInteger(n)).toString('ascii');
  const contextPacket = (seconds, offset = 0) => Buffer.from(`@Qu 1C ${value(seconds)} 1 ${value(offset)} `).toString('hex');
  const scenePackets = [...scene.protocol.beforePlainHex];
  scenePackets[0] = contextPacket(0x3ae805e7 + 1199);
  const fields = Buffer.from(scenePackets[4], 'hex').toString('ascii').split(' ');
  const planes = fields[7].split('|').map(plane => plane.split(','));
  planes[2][3 * 12 + 3] = value(0xc006);
  fields[7] = planes.map(plane => plane.join(',')).join('|');
  scenePackets[4] = Buffer.from(fields.join(' ')).toString('hex');
  try {
    await clientEnter(f, false);
    for (const packet of scenePackets) { f.offer(f.frame(packet)); await flush(); }
    await f.drive(() => f.client.inspect().state === 'playing');
    const runtime = f.client.runtime();
    const local = () => f.client.copyWorldState().localMovement;
    assert.equal(local().context.nativeEventSelector, 3);
    assert.equal(local().context.nativeInteractionSequence, 0);
    assert.equal(runtime.copyState().pointer.lastRequestTick, 0xffffffff);
    let tick = f.tick + 20;
    runtime.resetClock(tick);
    function pump() {
      const frame = runtime.pump({ ...f.client.readFrame(), tick });
      tick += 17;
      assert.equal(frame.error, null);
      return frame;
    }
    assert.equal(pump().inputUpdates[0].clearActionGuard, true);
    wall++;
    runtime.move([352, 216]); runtime.press(0); runtime.release(0);
    const first = pump();
    assert.deepEqual(first.inputUpdates[0].destination, [3, 3]);
    assert.equal(local().context.nativeEventSelector, 4);
    assert.equal(local().pendingInteraction.tileCode, 6);
    const requestTick = runtime.copyState().pointer.lastRequestTick;
    let event;
    for (let i = 0; i < 80 && !event; i++) event = pump().requests.find(row => row.operationId === 'send-004f6530');
    assert.deepEqual(event?.arguments, [6, 0, 3, 3, -1]);
    assert.equal(local().context.nativeActionGuard, 1);
    runtime.move([384, 192]); runtime.press(0); runtime.release(0);
    const held = pump().inputUpdates[0];
    assert.equal(held.clearActionGuard, false);
    assert.equal(held.destination, null);
    f.offer(f.frame(contextPacket(0x3ae805e7, -1))); await flush();
    pump();
    assert.equal(local().context.nativeEventSelector, 5);
    f.offer(f.frame(scenePackets[1])); await flush();
    await f.drive(() => f.client.inspect().state === 'playing' && f.client.inspect().runtimeRevision === 2);
    assert.equal(local().context.nativeInteractionSequence, 1);
    assert.equal(f.client.runtime().copyState().pointer.lastRequestTick, requestTick);
  } finally { f.close(); }
});

test('portable owner waits for actual entry/scene/actor data then renders52 independent frames and preserves source commands', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f, false); assert.equal(f.client.inspect().state, 'preparing-scene'); assert.throws(() => f.client.runtime());
    // A valid additional state packet cannot substitute for the real scene/local actor/speed prerequisites.
    const options = await import('../../analysis/game-character-options-v1/original-vectors.json', { with: { type: 'json' } }); f.offer(bytes(options.default.wire.field16.frameHex)); await flush();
    assert.equal(f.client.inspect().state, 'preparing-scene');
    for (const [i, plain] of scene.protocol.beforePlainHex.entries()) { f.offer(f.frame(plain)); await flush(); if (i < 4) assert.equal(f.client.inspect().state, 'preparing-scene', 'missing actual local map data must keep presentation stopped'); } await f.drive(() => f.client.inspect().state === 'playing');
    const runtime = f.client.runtime(); runtime.move([256, 48]); runtime.press(0); runtime.release(0); let requests = 0;
    // Same explicitly sampled clock as the independent original oracle.
    runtime.resetClock(1000);
    for (const row of input.worldFrames) {
      const result = runtime.pump({ ...f.client.readFrame(), tick: row.tick }); assert.equal(result.error, null);
      const pixels = await f.client.library().startRender(result.frame.sceneLayer.drawPlan).done; assert.equal(sha(pixels.rgba), row.scene.rgbaSha256); requests += result.requests.length;
      if (result.requests.length) await f.client.session().sendCommands(result.requests);
    }
    assert.equal(requests, 2); assert.equal(f.writes.length, 5); assert.equal(f.client.inspect().sceneRevision, 1);
    const before = f.client.copyWorldState(); assert.equal(before.records.records[1].fields.find(x => x.id === 'field-16').value, 123456);
    assert.equal(JSON.stringify(f.states).includes('OriginalG'), false); assert.equal(JSON.stringify(f.states).includes('OriginalA'), false);
    f.eof(); const end = await f.client.done; assert.equal(end.state, 'closed'); assert.equal(end.world.state, 'closed'); assert.equal(end.library.state, 'closed'); assert.equal(end.runtime, null); assert.equal(f.stats.closeCalls, 1);
    assert.ok(await f.files.port.stat('Bin/Graphic.bin')); assert.equal(f.timers.size, 0);
  } finally { f.close(); }
});
test('close while metadata I/O is held creates no session and late read cannot resurrect owners', async () => {
  const f = clientFixture(); f.files.controls.hold = 'Bin/GraphicInfo.bin';
  try {
    const pending = f.client.start(); await f.drive(() => f.files.pending.length === 1); f.client.close(); const final = JSON.stringify(f.client.inspect());
    f.files.pending.shift()(); await pending; assert.equal(JSON.stringify(f.client.inspect()), final); assert.equal(f.stats.factories, 0); assert.equal(f.stats.opens, 0); assert.equal(f.client.inspect().library.state, 'closed');
    assert.ok(await f.files.port.stat('Bin/Graphic.bin'));
  } finally { f.close(); }
});
test('resource initialization errors close actual owners with a safe code before any connection', async () => {
  const f = clientFixture(); f.files.controls.fail = true;
  try { const result = await f.client.start(); assert.equal(result.state, 'failed'); assert.equal(result.errorCode, 'LEGACY_ASSET_READ_FAILED'); assert.equal(f.stats.factories, 0); assert.equal(result.world.state, 'closed'); assert.equal(JSON.stringify(result).includes('private'), false); }
  finally { f.close(); }
});
test('pause retains source connection and resume resets the clock rather than replaying a long hidden interval', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f); const runtime = f.client.runtime(), count = f.stats.invalidations; f.client.pause(); assert.equal(f.client.inspect().state, 'paused'); assert.equal(f.stats.closeCalls, 0); assert.equal(f.stats.invalidations, count + 1); assert.throws(() => f.client.readFrame());
    f.tick = (f.tick + 3000000) >>> 0; f.client.resume(); assert.equal(f.client.runtime(), runtime); assert.equal(f.client.inspect().state, 'playing');
    const frame = runtime.pump({ ...f.client.readFrame(), tick: f.tick }); assert.equal(frame.error, null); assert.ok(frame.updates <= 1);
  } finally { f.close(); }
});
test('ordinary inventory commits real commands at the current tile and waits for received slot changes',async()=>{
  const f=clientFixture();
  const packet=text=>f.frame(Buffer.from(text,'ascii').toString('hex'));
  const sent=()=>Buffer.from(plain(f.writes.at(-1)),'hex').toString('ascii');
  try{
    await assert.rejects(f.client.useInventoryItem(8,0),e=>e.code==='LEGACY_CLIENT_NOT_PLAYING');
    await clientEnter(f);
    f.offer(packet('?l) 8|Tonic|0||2|1|0|0|0|0|0|23|6| '));
    await f.drive(()=>f.client.copyInventory()[8].present);
    const runtime=f.client.runtime();
    runtime.resetClock(1000);runtime.move([256,48]);runtime.press(0);runtime.release(0);
    const frame=runtime.pump({...f.client.readFrame(),tick:1000});
    assert.equal(frame.error,null);
    const {display,target}=f.client.copyWorldState().actors.localActor.motion;
    assert.deepEqual([display,target],[[2,3],[3,3]]);
    await f.client.useInventoryItem(8,1);
    assert.equal(sent(),'$fa 2 3 8 0 ');
    assert.equal(f.client.copyInventory()[8].quantity,6);
    const move=f.client.moveInventoryItem(8,1,2,0);
    await assert.rejects(f.client.moveInventoryItem(8,1,2,0),e=>e.code==='LEGACY_CLIENT_ITEM_BUSY');
    await move;
    assert.equal(sent(),"'#Q 8 2 -1 ");
    assert.equal(f.client.copyInventory()[2].present,false);
    f.offer(packet('@Y) 8 2 '));
    await f.drive(()=>f.client.copyInventory()[2].present);
    assert.equal(f.client.copyInventory()[8].present,false);
    f.offer(packet('?l) 11|Charm|0||26569|1|0|0|0|1|0|23|0||12|Target|0||4000|0|0|0|0|1536|0|1|0| '));
    await f.drive(()=>f.client.copyInventory()[11].canUseOnItem);
    await f.client.useInventoryItemOnItem(11,3,12,3);
    assert.equal(sent(),'6=L c b ');
    assert.equal(f.client.copyInventory()[11].present,true);
    await f.client.dropInventoryItem(2,2);
    assert.equal(sent(),'&E1 2 3 2 ');
    assert.equal(f.client.copyInventory()[2].present,true);
    const count=f.writes.length;
    await assert.rejects(f.client.useInventoryItem(8,1),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    f.client.pause();
    await assert.rejects(f.client.moveInventoryItem(2,2,8,2),e=>e.code==='LEGACY_CLIENT_NOT_PLAYING');
    f.client.resume();
    f.offer(packet('Hx! 1C|2|3|99|2|5|0|0 '));
    await f.drive(()=>Boolean(f.client.copyWorldState().actors.localActor.presentation.secondary&0x80));
    await assert.rejects(f.client.useInventoryItem(2,2),e=>e.code==='LEGACY_GAME_ITEM_CONTEXT');
    await assert.rejects(f.client.dropInventoryItem(2,2),e=>e.code==='LEGACY_GAME_ITEM_CONTEXT');
    assert.equal(f.writes.length,count);
    assert.equal(f.client.inspect().state,'playing');
  }finally{f.close();}
});
test('ordinary right press turns and picks up active ground records with separate source cooldowns', async () => {
  const f = clientFixture({ assets: groundPickupAssets(assets) });
  const offer = text => f.offer(f.frame(Buffer.from(text, 'ascii').toString('hex')));
  const item = `H#| 3e|3|3|${groundItemResource}|0|FloorTonic|0 `;
  const actor = id => f.client.copyWorldState().actors.remoteActors.find(row => row.id === id);
  try {
    await clientEnter(f);
    offer(item);
    offer('H#| 3f|2|3|49 ');
    offer('H#| 1|3g|2|4|4|100111|77|8|Visitor||1 ');
    offer(`H#| 3h|4|3|${groundItemResource}|0|DistantTonic|0 `);
    await f.drive(() => Boolean(actor(203)));
    assert.deepEqual([200, 201, 202].map(id => actor(id).sourceFrame.recordTypeFlags), [2, 4, 8]);

    const runtime = f.client.runtime();
    async function click(point, tile, tick, { release = true, press = true } = {}) {
      runtime.resetClock(tick);
      runtime.move(point);
      if (press) runtime.press(2);
      if (release) runtime.release(2);
      const result = runtime.pump({ ...f.client.readFrame(), tick });
      assert.equal(result.error, null, result.frame?.actorFrameError?.code);
      assert.deepEqual(result.inputUpdates[0].tile, tile);
      const start = f.writes.length;
      if (result.requests.length) await f.client.session().sendCommands(result.requests);
      return f.writes.slice(start).map(frame => Buffer.from(plain(frame), 'hex').toString('ascii'));
    }

    assert.deepEqual(await click([192, 96], [3, 3], 500), []);
    assert.deepEqual(await click([192, 96], [3, 3], 501, { release: false }), ['!0b 2 3 C 1B ', '&?S 2 3 2 ']);
    assert.equal(f.client.copyWorldState().actors.localActor.motion.facingCode, 2);
    assert.ok(actor(200));
    assert.equal(f.client.copyInventory()[8].present, false);
    assert.deepEqual(await click([192, 96], [3, 3], 1002, { press: false, release: false }), []);
    assert.deepEqual(await click([160, 120], [2, 3], 1003, { press: false }), []);
    assert.deepEqual(await click([160, 120], [2, 3], 1004), ['&?S 2 3 2 ']);
    assert.deepEqual(await click([224, 72], [4, 3], 1005), ['!0b 2 3 C 1B ']);
    assert.deepEqual(await click([192, 96], [3, 3], 1504), []);
    assert.deepEqual(await click([192, 96], [3, 3], 1505), ['&?S 2 3 2 ']);

    offer('IZL 3e,3f ');
    offer('?l) 8|FloorTonic|0||2|1|0|0|0|1|0|23|1| ');
    await f.drive(() => !actor(200) && !actor(201) && f.client.copyInventory()[8].present);
    assert.deepEqual(await click([192, 144], [2, 4], 2007), ['!0b 2 3 E 1B ', ';JE 3 3g ']);
    offer(item);
    await f.drive(() => Boolean(actor(200)));
    runtime.resetClock(2508);
    runtime.move([192, 96]);
    runtime.press(0);
    runtime.release(0);
    const moving = runtime.pump({ ...f.client.readFrame(), tick: 2508 });
    assert.equal(moving.error, null);
    await f.client.session().sendCommands(moving.requests);
    assert.deepEqual(f.client.copyWorldState().actors.localActor.motion.target, [3, 3]);
    assert.deepEqual(await click([192, 96], [3, 3], 2524), ['&?S 2 3 2 ']);

    offer('Hx! 1C|2|3|99|2|5|0|0 ');
    await f.drive(() => actor(200) && Boolean(f.client.copyWorldState().actors.localActor.presentation.secondary & 0x80));
    assert.deepEqual(await click([192, 96], [3, 3], 3025), []);
  } finally { f.close(); }
});
test('ordinary right click uses live slot order and dialog responses consume the received revision', async () => {
  const f = clientFixture({ assets: groundPickupAssets(assets) });
  const packet = raw => f.offer(f.frame(Buffer.from(raw).toString('hex')));
  const character = (id, x) => packet(`H#| 1|${id}|${x}|3|4|100001|77|8|OriginalGuide||1 `);
  const info = () => f.client.inspect().world.mapDialog;
  const dialog = (mode, buttons, sequence, actor, text = '') => offerGameText(f, 'Q?m', [mode, buttons, sequence, actor], text);
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex');
  try {
    await clientEnter(f);
    character('3e', 3);
    character('3f', 3);
    packet(`H#| 3h|3|3|${groundItemResource}|0|GroundObject|0 `);
    await f.drive(() => f.client.copyWorldState().actors.remoteCount === 3);
    const runtime = f.client.runtime();
    async function click(x, y, tick, button = 2) {
      runtime.resetClock(tick);
      runtime.move([x, y]);
      runtime.press(button);
      runtime.release(button);
      const result = runtime.pump({ ...f.client.readFrame(), tick });
      assert.equal(result.error, null);
      const start = f.writes.length;
      if (result.requests.length) await f.client.session().sendCommands(result.requests);
      return f.writes.slice(start).map(frame => Buffer.from(plain(frame), 'hex').toString('ascii'));
    }
    assert.deepEqual(await click(192, 96, 1000), ['!0b 2 3 C 1B ', '&?S 2 3 2 ', ';JE 3 3e ']);
    assert.deepEqual(await click(192, 96, 1001), [';JE 3 3e ']);
    assert.equal(info(), null);
    packet('IZL 3e ');
    character('3g', 3);
    character('3i', 5);
    await f.drive(() => f.client.copyWorldState().actors.remoteCount === 4);
    assert.deepEqual(await click(192, 96, 1002), [';JE 3 3g ']);
    assert.deepEqual(await click(256, 48, 1003), [';JE 3 3i ']);

    dialog(2, 2, 17, 204, '2\\nOriginal menu\\nSelect a route\\nNorth\\n\\nSouth');
    await f.drive(() => info()?.revision === 1);
    const menu = f.client.copyMapDialog();
    assert.deepEqual(menu.lines.map(line => Buffer.from(line).toString()), ['Original menu', 'Select a route', 'North', '', 'South']);
    menu.lines[0].fill(0);
    assert.equal(Buffer.from(f.client.copyMapDialog().lines[0]).toString(), 'Original menu');
    assert.deepEqual(menu.buttons, [2]);
    assert.deepEqual(await click(256, 48, 2000), []);
    assert.deepEqual(await click(192, 96, 2001, 0), []);
    await assert.rejects(f.client.replyMapDialog(1, 0, 2), e => e.code === 'LEGACY_GAME_DIALOG_CHOICE');
    dialog(0, -1, 0, 204);
    dialog(2, -1, 0, 202);
    dialog(1, 1, 18, 204, 'Duplicate context');
    await flush();
    assert.equal(info().revision, 1);
    await f.client.replyMapDialog(1, 0, 3);
    assert.equal(sent().toString(), '/1I 2 3 h 3i 0 3 ');
    assert.equal(info(), null);
    await assert.rejects(f.client.replyMapDialog(1, 2), e => e.code === 'LEGACY_GAME_DIALOG_STALE');

    dialog(2, 2, 18, 204, '1\\nContinue?\\nYes');
    await f.drive(() => info()?.revision === 2);
    await f.client.replyMapDialog(2, 2);
    assert.equal(sent().toString(), '/1I 2 3 i 3i 2 -1 ');

    dialog(1, 1, 19, 204, 'Original prompt');
    await f.drive(() => info()?.revision === 3);
    assert.equal(info().input, true);
    dialog(11, 1, 0x146, 204, 'Wide prompt');
    await f.drive(() => info()?.revision === 4);
    await assert.rejects(f.client.replyMapDialog(3, 1), e => e.code === 'LEGACY_GAME_DIALOG_STALE');
    await assert.rejects(f.client.replyMapDialog(4, 1, null, new Uint8Array(128).fill(92)), e => e.code === 'LEGACY_GAME_DIALOG_TEXT');
    await f.client.replyMapDialog(4, 1, null, encodeLauncherProcessField('走,|\\A', { encoding: 'windows-936' }));
    assert.deepEqual(sent(), Buffer.concat([Buffer.from('/1I 2 3 5g 3i 1 '), Buffer.from('d7df', 'hex'), Buffer.from('\\\\c\\\\z\\\\yA ')]));

    dialog(10, 32, 20, 204, 'X'.repeat(61));
    await f.drive(() => info()?.revision === 5);
    assert.deepEqual(f.client.copyMapDialog().lines.map(line => line.length), [60, 1]);
    dialog(10, -1, 0, 204);
    await f.drive(() => info() === null);
    const count = f.writes.length;
    dialog(2, 1, 21, 204, 'Menu without a header separator');
    await flush();
    assert.equal(info(), null);
    dialog(0, 0, -1, 204, 'Local dismissal with a signed sequence');
    await f.drive(() => info()?.revision === 6);
    assert.equal(info().sequence, -1);
    f.client.dismissMapDialog(6);
    assert.equal(info(), null);
    assert.equal(f.writes.length, count);
    assert.equal(f.client.inspect().state, 'playing');
  } finally { f.close(); }
});
const shopBalanceMask = Buffer.from(encodeLegacyGameInteger(1 << 27)).toString('ascii');
function offerShopBalance(f, balance) { offerGameText(f, 'E(9', [], shopBalanceMask + '|' + balance); }
function specialMapFixture() {
  const f = clientFixture(), info = () => f.client.inspect().world.mapDialog;
  const int = value => Buffer.from(encodeLegacyGameInteger(value)).toString('ascii');
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex');
  const receive = (mode, mask, sequence, body) => offerGameText(f, 'Q?m', [mode, mask, sequence, 204], body);
  async function open(mode, mask, sequence, body) {
    receive(mode, mask, sequence, body);
    await f.drive(() => info()?.sequence === sequence);
    return f.client.copyMapDialog();
  }
  function expectReply(sequence, button, bytes) {
    assert.deepEqual(sent(), Buffer.concat([Buffer.from(`/1I 2 3 ${int(sequence)} 3i ${button} `), Buffer.from(bytes), Buffer.from(' ')]));
    assert.equal(info(), null);
  }
  return { f, info, int, receive, open, expectReply };
}

test('map handoff choices and illustrated confirmation retain their distinct reply values', async () => {
  const { f, info, open, expectReply } = specialMapFixture();
  try {
    await clientEnter(f);
    const giving = await open(0x1e, 0, 141, '87000|Courier|0|Deliver\\nthis');
    assert.deepEqual(giving.npcService.choices.map(({ action, sends }) => [action, sends]), [['give', true], ['leave', true]]);
    assert.deepEqual(giving.npcService.lines.map(line => Buffer.from(line).toString()), ['Deliver', 'this']);
    await f.client.replyMapDialog(giving.revision, 0, 1);
    expectReply(141, 0, '1');
    const receiving = await open(0x1e, 0, 142, '87000|Courier|-1|Collect this');
    assert.equal(receiving.npcService.choices[0].action, 'receive');
    await f.client.replyMapDialog(receiving.revision, 0, 2);
    expectReply(142, 0, '2');

    const graphic = await open(0x25, 3, 143, `87000|${'A'.repeat(33)}\\nImage`);
    assert.deepEqual(graphic.illustration, { width: 448, height: 240, graphics: [{ resourceId: 87000, facing: 0, x: 86, y: 98 }] });
    assert.deepEqual(graphic.lines.map(line => Buffer.from(line).toString()), ['A'.repeat(32), 'A', 'Image']);
    await assert.rejects(f.client.replyMapDialog(graphic.revision, 4), { code: 'LEGACY_GAME_DIALOG_BUTTON' });
    await f.client.replyMapDialog(graphic.revision, 1);
    expectReply(143, 1, '87000');
    const cancel = await open(0x25, 2, 144, '-1|Missing image');
    await f.client.replyMapDialog(cancel.revision, 2);
    expectReply(144, 2, '-1');
    const local = await open(0x25, 0, 145, '87000|Read only');
    const writes = f.writes.length;
    f.client.dismissMapDialog(local.revision);
    assert.equal(info(), null);
    assert.equal(f.writes.length, writes);
  } finally { f.close(); }
});

test('paired map input applies the two escape passes and validates confirmation without discarding drafts', async () => {
  const { f, info, open, expectReply } = specialMapFixture();
  const field = text => encodeLauncherProcessField(text, { encoding: 'windows-936' });
  const escaped = text => text.replaceAll('\\', '\\\\');
  try {
    await clientEnter(f);
    const paired = await open(0x23, 3, 146, 'Two fields');
    assert.deepEqual([paired.inputCount, paired.inputByteLimit, paired.buttons], [2, 46, [1, 2]]);
    const writes = f.writes.length;
    for (const value of ['', '  ', 'A,B', 'A|B', 'A\\B', 'A'.repeat(47)]) {
      await assert.rejects(f.client.replyMapDialog(paired.revision, 1, null, [field('Valid'), field(value)]), { code: 'LEGACY_GAME_DIALOG_TEXT' }, value);
    }
    await assert.rejects(f.client.replyMapDialog(paired.revision, 1, null, [field('A'), Uint8Array.of(32, 0x81, 0x40)]), { code: 'LEGACY_GAME_DIALOG_TEXT' });
    await assert.rejects(f.client.replyMapDialog(paired.revision, 1, null, [field('A'), Uint8Array.of(0x81)]), { code: 'LEGACY_GAME_DIALOG_TEXT' });
    assert.equal(info().revision, paired.revision);
    assert.equal(f.writes.length, writes);
    await f.client.replyMapDialog(paired.revision, 1, null, [field('Alpha'), field('乗')]);
    assert.deepEqual(Buffer.from(field('乗')), Buffer.from('815c', 'hex'));
    expectReply(146, 1, Buffer.concat([Buffer.from(escaped('Alpha\\z')), Buffer.from('8166', 'hex')]));

    const cancel = await open(0x23, 3, 147, 'Cancel with current text');
    await f.client.replyMapDialog(cancel.revision, 2, null, [field('A,'), field('\\B|')]);
    expectReply(147, 2, escaped('A\\yc\\z\\yyB\\yz'));
    const empty = await open(0x23, 3, 148, 'Cancel both empty');
    await f.client.replyMapDialog(empty.revision, 2);
    expectReply(148, 2, escaped('\\z'));
    const bounded = await open(0x23, 3, 149, 'Bounded text');
    const manyEscapes = field('\\'.repeat(46));
    await f.client.replyMapDialog(bounded.revision, 2, null, [manyEscapes, manyEscapes]);
    expectReply(149, 2, escaped('\\yy'.repeat(46) + '\\z' + '\\yy'.repeat(38)));
  } finally { f.close(); }
});

test('map appearance edits a draft using the live source context and submits only on confirmation', async () => {
  const { f, info, int, receive, open, expectReply } = specialMapFixture();
  const code = () => f.client.copyWorldState().records.records[1].fields.find(field => field.id === 'field-16').value;
  try {
    await clientEnter(f);
    offerGameText(f, 'F8%', [], int(1 << 16) + '|123456');
    await f.drive(() => code() === 123456);
    receive(0x24, 0, 151, '87000|Stylist|Unsupported context');
    await flush();
    assert.equal(info(), null);
    offerGameText(f, 'F8%', [], int(1 << 16) + '|33000');
    await f.drive(() => code() === 33000);
    const draft = await open(0x24, 0, 152, '87000|Appearance editor title|Pick a look');
    assert.deepEqual(draft.buttons, [1]);
    assert.equal(Buffer.from(draft.appearance.title).toString(), 'Appearance edito');
    assert.deepEqual([draft.appearance.variant, draft.appearance.appearanceCode, draft.appearance.previewResourceId], [0, 33000, 33000]);
    const writes = f.writes.length;
    await assert.rejects(f.client.replyMapDialog(draft.revision, 0, 4), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    for (const [control, variant, detail1, detail2, candidate] of [
      [5, 1, 0, 0, 202875], [3, 0, 0, 0, 33000], [3, 2, 0, 0, 240075],
      [6, 2, 4, 0, 240095], [11, 2, 4, 1, 240096],
    ]) {
      await f.client.replyMapDialog(draft.revision, 0, control);
      const model = info().appearance;
      assert.deepEqual([model.variant, model.detail1, model.detail2, model.appearanceCode], [variant, detail1, detail2, candidate]);
    }
    assert.equal(f.writes.length, writes);
    assert.equal(code(), 33000);
    await f.client.replyMapDialog(draft.revision, 1);
    expectReply(152, 1, '240096');
    assert.equal(code(), 33000);
    const dismissed = await open(0x24, 0, 153, '87000|Stylist|Discard');
    assert.equal(dismissed.appearance.appearanceCode, 33000);
    f.client.dismissMapDialog(dismissed.revision);
    assert.equal(f.writes.length, writes + 1);
  } finally { f.close(); }
});

function storageSnapshot(balance) {
  const fields = Array(287).fill('');
  fields[0] = 'A';
  fields.splice(1 + 3 * 6, 6, '87000','7','1','Bank Tonic','','Keep\\nsealed');
  fields[121 + 4 * 33] = 'Bank Finch';
  fields[122 + 4 * 33] = '12';
  fields[286] = String(balance);
  return fields.join('|');
}

test('map storage applies sparse and atomic records and sends slot transfers using the opening sequence', async () => {
  const { f, info, int, receive, open } = specialMapFixture();
  const snapshot = () => f.client.copyMapDialog().bank;
  const bag = () => f.client.copyInventory();
  const update = (body, actor = 204) => offerGameText(f,'Q?m',[0x17,0,190,actor],body);
  const reply = () => Buffer.from(plain(f.writes.at(-1)),'hex').toString('ascii');
  const transfer = action => f.client.actOnMapBank(info().revision,{version:info().bank.version,...action});
  const itemRow = (slot, name, permission, quantity) => `${slot}|${name}|0||2|1|0|0|0|${permission}|0|23|${quantity}|`;
  try {
    await clientEnter(f);
    update('G|900');await flush();assert.equal(info(),null);
    offerGameText(f,'?l)',[],[itemRow(8,'Wallet Tonic',1,6),itemRow(9,'Restricted',96,1)].join('|'));
    offerGameText(f,'FBY',[1],int(1<<22)+'|Moth');
    await f.drive(()=>bag()[8].present&&f.client.copyWorldState().battle.pets.records[1].present);
    const { revision, bank } = await open(0x17,0,181,storageSnapshot(200));
    assert.equal(bank.items.length,20);assert.equal(bank.pets.length,5);
    assert.deepEqual(bank.items[3].lines.map(line=>Buffer.from(line).toString()),['Keep','sealed']);
    assert.equal(Buffer.from(bank.pets[4].name).toString(),'Bank Finch');
    bank.items[3].name.fill(0);
    assert.equal(Buffer.from(snapshot().items[3].name).toString(),'Bank Tonic');
    update('G|99',205);
    update('I|1|87000|2|0|Decoy|||22|0');await flush();
    assert.equal(snapshot().balance,200);assert.equal(snapshot().items[1],null);assert.equal(snapshot().version,1);

    const fromRevision=bag()[8].revision;
    await assert.rejects(transfer({kind:'item',from:9,to:101,amount:-1,fromRevision:bag()[9].revision}),{code:'LEGACY_GAME_BANK_SLOT'});
    await assert.rejects(transfer({kind:'item',from:8,to:103,amount:2,fromRevision}),{code:'LEGACY_GAME_BANK_AMOUNT'});
    await assert.rejects(transfer({kind:'item',from:8,to:101,amount:7,fromRevision}),{code:'LEGACY_GAME_BANK_AMOUNT'});
    await transfer({kind:'item',from:8,to:101,amount:2,fromRevision});
    assert.equal(reply(),`/1I 2 3 ${int(181)} 3i 0 I\\\\z8\\\\z101\\\\z2 `);
    assert.equal(snapshot().items[1],null);assert.equal(bag()[8].quantity,6);
    await assert.rejects(transfer({kind:'item',from:8,to:101,amount:2,fromRevision}),{code:'LEGACY_GAME_BANK_BUSY'});
    update('I|2|87000|3|0|Unrelated||');await f.drive(()=>snapshot().items[2]?.quantity===3);
    assert.equal(info().bank.pending,true);
    update('I|1|87000|2|0|Wallet Tonic||');await f.drive(()=>!info().bank.pending);
    offerGameText(f,'?l)',[],itemRow(8,'Wallet Tonic',1,4));await f.drive(()=>bag()[8].quantity===4);
    await assert.rejects(transfer({kind:'item',from:8,to:100,amount:-1,fromRevision}),{code:'LEGACY_GAME_BANK_STALE'});
    await transfer({kind:'item',from:103,to:10,amount:-1,toRevision:bag()[10].revision});
    assert.equal(reply(),`/1I 2 3 ${int(181)} 3i 0 I\\\\z103\\\\z10\\\\z-1 `);
    update('I|3|0');await f.drive(()=>!info().bank.pending);assert.equal(snapshot().items[3],null);

    await transfer({kind:'pet',from:1,to:102,petVersion:info().petVersion});
    assert.equal(reply(),`/1I 2 3 ${int(181)} 3i 0 P\\\\z1\\\\z102 `);
    update('P|2|Moth|8');await f.drive(()=>!info().bank.pending);
    assert.equal(Buffer.from(snapshot().pets[2].name).toString(),'Moth');
    await transfer({kind:'pet',from:104,to:4,petVersion:info().petVersion});
    assert.equal(reply(),`/1I 2 3 ${int(181)} 3i 0 P\\\\z104\\\\z4 `);
    update('P|4||-1');await f.drive(()=>!info().bank.pending);assert.equal(snapshot().pets[4],null);
    assert.equal(info().revision,revision);
    await f.client.replyMapDialog(revision,0);
    assert.equal(reply(),`/1I 2 3 ${int(181)} 3i 0 C `);
    assert.equal(info(),null);
  } finally { f.close(); }
});

test('map storage constrains gold at both ends and acknowledges a matching server close once', async () => {
  const { f, info, int, receive, open, expectReply } = specialMapFixture();
  const transfer = (kind, amount, wallet, version = info().bank.version) =>
    f.client.actOnMapBank(info().revision,{kind,amount,wallet,version});
  try {
    await clientEnter(f);
    offerShopBalance(f,50);
    const { revision } = await open(0x21,0,182,storageSnapshot(999990));
    assert.equal(info().gold,50);
    await assert.rejects(transfer('deposit-gold',11,50),{code:'LEGACY_GAME_BANK_AMOUNT'});
    await assert.rejects(transfer('deposit-gold',10,49),{code:'LEGACY_GAME_BANK_STALE'});
    await transfer('deposit-gold',10,50);
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),`/1I 2 3 ${int(182)} 3i 0 G\\\\z10 `);
    assert.equal(info().bank.balance,999990);assert.equal(info().gold,50);
    receive(0x21,0,191,'G|1000000');offerShopBalance(f,40);
    await f.drive(()=>info().bank.balance===1000000&&info().gold===40);
    await assert.rejects(transfer('withdraw-gold',999961,40),{code:'LEGACY_GAME_BANK_AMOUNT'});
    await assert.rejects(transfer('withdraw-gold',5,40,1),{code:'LEGACY_GAME_BANK_STALE'});
    await transfer('withdraw-gold',5,40);
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),`/1I 2 3 ${int(182)} 3i 0 D\\\\z5 `);
    const writes=f.writes.length;
    offerGameText(f,'Q?m',[0x21,-1,0,205],'');await flush();
    assert.equal(info().revision,revision);assert.equal(f.writes.length,writes);
    receive(0x21,-1,0,'');await f.drive(()=>info()===null&&f.writes.length===writes+1);
    expectReply(182,0,'C');
    receive(0x21,-1,0,'');await flush();assert.equal(f.writes.length,writes+1);
  } finally { f.close(); }
});

test('family pet actions follow received permissions, live slots and the opening reply context', async () => {
  const { f, info, int, receive, open, expectReply } = specialMapFixture();
  const row = (slot, name, category, quantity) => slot+'|'+name+'|0||2|1|0|0|0|1|0|'+category+'|'+quantity+'|';
  const updateItems = (...rows) => offerGameText(f,'?l)',[],rows.join('|'));
  const permission = (mask, fields) => offerGameText(f,'Y&3',[],int(mask)+'|'+fields);
  const act = action => f.client.actOnMapFamilyPet(info().revision,action);
  const inventory = () => f.client.copyInventory();
  const feed = slot => act({kind:'feed',slot,revision:inventory()[slot].revision});
  const sent = () => Buffer.from(plain(f.writes.at(-1)),'hex').toString('ascii');
  const title = () => Buffer.from(f.client.copyMapDialog().familyPet.title).toString();
  try {
    await clientEnter(f);
    updateItems(row(8,'Ordinary',23,2),row(9,'Family Food',0x35,3));
    await f.drive(()=>inventory()[9].present);
    const { familyPet } = await open(0x20,0,193,'Finch\\zOne|'+'x'.repeat(30)+'\\nMood\\z calm');
    assert.equal(title(),'Finch|One');
    assert.deepEqual(familyPet.lines.map(line=>Buffer.from(line).toString()),['x'.repeat(30),'Mood| calm']);
    assert.deepEqual([familyPet.canFeed,familyPet.canRename],[false,false]);
    const before=f.writes.length;
    await assert.rejects(feed(8),{code:'LEGACY_GAME_FAMILY_PET_PERMISSION'});
    await assert.rejects(act({kind:'rename',name:Buffer.from('Finch')}),{code:'LEGACY_GAME_FAMILY_PET_PERMISSION'});
    assert.equal(f.writes.length,before);
    await feed(9);
    assert.equal(sent(),'/1I 2 3 '+int(193)+' 3i 0 I|9 ');
    assert.equal(inventory()[9].quantity,3);
    await assert.rejects(feed(9),{code:'LEGACY_GAME_FAMILY_PET_BUSY'});
    updateItems(row(8,'Ordinary',23,3));await f.drive(()=>inventory()[8].quantity===3);
    assert.equal(info().familyPet.pending,true);
    updateItems(row(9,'Family Food',0x35,2));await f.drive(()=>!info().familyPet.pending);

    permission(1,'10|Clan|Leader|11|12|13|14|132');
    await f.drive(()=>info().familyPet.canFeed&&info().familyPet.canRename);
    permission(2,'20');await flush();
    assert.equal(info().familyPet.canRename,true);
    await assert.rejects(act({kind:'feed',slot:8,revision:0}),{code:'LEGACY_GAME_FAMILY_PET_STALE'});
    await feed(8);
    assert.equal(sent(),'/1I 2 3 '+int(193)+' 3i 0 I|8 ');
    updateItems(row(8,'Ordinary',23,2));await f.drive(()=>!info().familyPet.pending);
    await assert.rejects(act({kind:'rename',name:Buffer.alloc(17,65)}),{code:'LEGACY_GAME_FAMILY_PET_NAME'});
    await assert.rejects(act({kind:'rename',name:Buffer.of(0x81)}),{code:'LEGACY_GAME_DIALOG_TEXT'});
    await act({kind:'rename',name:Buffer.from('A,\\B|')});
    assert.equal(sent(),'/1I 2 3 '+int(193)+' 3i 0 N\\\\zA\\\\yc\\\\yyB\\\\yz ');
    assert.equal(title(),'Finch|One');assert.equal(info().familyPet.pending,true);
    offerGameText(f,'Q?m',[0x20,0,194,205],'Other|Ignore');await flush();
    assert.equal(title(),'Finch|One');assert.equal(info().familyPet.pending,true);
    const oldRevision=info().revision;
    receive(0x20,0,194,'New Finch|Settled');
    await f.drive(()=>info().revision!==oldRevision);
    assert.equal(info().sequence,193);assert.equal(title(),'New Finch');assert.equal(info().familyPet.pending,false);
    await assert.rejects(f.client.actOnMapFamilyPet(oldRevision,{kind:'rename',name:Buffer.from('Old')}),{code:'LEGACY_GAME_DIALOG_STALE'});
    permission(0x102,'10|');await f.drive(()=>!info().familyPet.canFeed&&!info().familyPet.canRename);
    await assert.rejects(feed(8),{code:'LEGACY_GAME_FAMILY_PET_PERMISSION'});
    const writes=f.writes.length;
    offerGameText(f,'Q?m',[0x20,-1,0,205],'');await flush();
    assert.equal(info().sequence,193);assert.equal(f.writes.length,writes);
    receive(0x20,-1,0,'');await f.drive(()=>info()===null&&f.writes.length===writes+1);
    expectReply(193,0,'C');
    receive(0x20,-1,0,'');await flush();assert.equal(f.writes.length,writes+1);
  } finally { f.close(); }
});

test('family feed box exposes item transfers and closes locally or on a matching server request', async () => {
  const { f, info, int, receive, open } = specialMapFixture();
  const inventory = () => f.client.copyInventory();
  const bank = () => f.client.copyMapDialog().bank;
  const sent = () => Buffer.from(plain(f.writes.at(-1)),'hex').toString('ascii');
  const action = fields => f.client.actOnMapBank(info().revision,{version:bank().version,...fields});
  const item = (slot,name,category,flags) => slot+'|'+name+'|0||2|1|0|0|0|'+flags+'|0|'+category+'|4|';
  try {
    await clientEnter(f);
    offerGameText(f,'?l)',[],[item(8,'Food',23,1),item(9,'Restricted type',0x26,1),
      item(10,'Other restricted type',0x34,1),item(11,'Restricted flag',23,0x60)].join('|'));
    await f.drive(()=>inventory()[11].present);
    const { revision } = await open(0x22,0,195,storageSnapshot(900));
    const transfer = from => action({kind:'item',from,to:101,amount:2,fromRevision:inventory()[from].revision});
    for (const from of [9,10,11]) await assert.rejects(transfer(from),{code:'LEGACY_GAME_BANK_SLOT'});
    for (const kind of ['pet','deposit-gold','withdraw-gold']) await assert.rejects(action({kind}),{code:'LEGACY_GAME_BANK_ACTION'});
    receive(0x20,0,0x146,'Other window|Does not replace');
    await flush();assert.equal(info().revision,revision);
    await transfer(8);
    assert.equal(sent(),'/1I 2 3 '+int(195)+' 3i 0 I\\\\z8\\\\z101\\\\z2 ');
    assert.equal(bank().items[1],null);assert.equal(inventory()[8].quantity,4);
    receive(0x22,0,196,'I|1|87000|2|0|Food||');await f.drive(()=>bank().items[1]?.quantity===2);
    await action({kind:'item',from:103,to:12,amount:-1,toRevision:inventory()[12].revision});
    assert.equal(sent(),'/1I 2 3 '+int(195)+' 3i 0 I\\\\z103\\\\z12\\\\z-1 ');
    const writes=f.writes.length;
    await f.client.replyMapDialog(revision,0);assert.equal(info(),null);assert.equal(f.writes.length,writes);
    await open(0x22,0,197,storageSnapshot(0));
    receive(0x22,-1,0,'');await f.drive(()=>info()===null);
    assert.equal(f.writes.length,writes);
  } finally { f.close(); }
});

test('family profile requests honor permissions, revisions and authoritative field updates', async () => {
  const f = clientFixture(), copy = () => f.client.copyFamily();
  const send = (tag,args,text) => offerGameText(f,tag,args,text);
  const role = (slot,permissions,name) => ({kind:'role',slot,permissions,name});
  const name = value => ({kind:'name',name:Buffer.from(value)});
  const act = action => f.client.actOnFamily(copy().version,action);
  const text = bytes => Buffer.from(bytes).toString();
  const sent = () => Buffer.from(plain(f.writes.at(-1)),'hex').toString('ascii');
  try {
    await clientEnter(f);
    assert.equal(copy(),null);
    send('Y&3',[],'1|42|Harbor|Hall|2|0|0|0|132|a|b|c|501');
    send('Y0[',[],'3|0|128|Founder|2|0|Reader|3|33|Courier');
    await f.drive(()=>copy()?.roles.length===3);
    const stale = copy().version;
    assert.equal(copy().id,42);
    assert.equal(copy().ownRole,2);
    assert.equal(text(copy().hall),'Hall');
    assert.equal(copy().canManage,false);
    const initialWrites = f.writes.length;
    await assert.rejects(act(name('New Harbor')),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    send('Y0[',[],'1|2|128|Officer');
    await f.drive(()=>copy().canManage);
    await assert.rejects(f.client.actOnFamily(stale,name('New Harbor')),{code:'LEGACY_GAME_FAMILY_STALE'});
    for (const value of [Buffer.alloc(25,65),Buffer.from('A,B'),Buffer.from('A\\B'),Buffer.from('A|B'),Buffer.of(0x81,0x40)])
      await assert.rejects(act({kind:'name',name:value}),{code:'LEGACY_GAME_FAMILY_NAME'});
    await assert.rejects(act(role(0,1,Buffer.from('Founder'))),{code:'LEGACY_GAME_FAMILY_ROLE'});
    await assert.rejects(act(role(2,1,Buffer.from('Officer'))),{code:'LEGACY_GAME_FAMILY_ROLE'});
    await act(name('Harbor'));
    assert.equal(f.writes.length,initialWrites);
    await act(name('New Harbor'));
    assert.equal(sent(),'7nu 2 New\\SHarbor ');
    assert.equal(copy().pending,'name');
    assert.equal(text(copy().name),'Harbor');
    await assert.rejects(act(name('New Harbor')),{code:'LEGACY_GAME_FAMILY_BUSY'});
    send('Y&3',[],'8|Other Hall');
    await f.drive(()=>text(copy().hall)==='Other Hall');
    assert.equal(copy().pending,'name');
    send('Y&3',[],'4|New Harbor');
    await f.drive(()=>!copy().pending);
    assert.equal(text(copy().name),'New Harbor');
    await act({kind:'hall',name:Buffer.of(0x81,0x5c)});
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString('hex'),'376e75203320816620');
    send('Y&3',[],'8|New Hall');
    await f.drive(()=>!copy().pending);
    await act(role(3,5));
    assert.equal(sent(),'80i 3 B Courier ');
    assert.equal(copy().roles.find(row=>row.slot===3).flags,33);
    send('Y0[',[],'1|0|128|New Founder');
    await f.drive(()=>text(copy().roles[0].name)==='New Founder');
    assert.equal(copy().pending,'role');
    send('Y0[',[],'1|3|37|Courier');
    await f.drive(()=>!copy().pending);
    assert.equal(copy().roles.find(row=>row.slot===3).flags,37);
    send('Y0[',[],'1|2|-1|');
    await f.drive(()=>!copy().canManage);
    await assert.rejects(act(name('Again')),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    assert.equal(f.writes.length,initialWrites+3);
  } finally { f.close(); }
});

test('family roster applies bounded full, single and removal records and clears only its matching family', async () => {
  const f = clientFixture(), copy = () => f.client.copyFamily();
  const send = (tag,args,text) => offerGameText(f,tag,args,text);
  const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString();
  const remove = (tag,id) => f.offer(f.frame(Buffer.from(tag+' '+int(id)+' ').toString('hex')));
  const row = (id,names,slot) => '1|'+id+'|'+names+'|0|0|0|0|'+slot;
  const ids = () => copy().members.map(member=>member.id);
  try {
    await clientEnter(f);
    send('Y0[',[],'2|2|128|Officer|3|33|Courier');
    send('[qD',[],row(501,'Iris\\zOne',2)+'|'+row(502,'Birch\\zTwo',3));
    send('Y&3',[],'1|42|Harbor|Hall|2|0|0|0|132|a|b|c|501');
    await f.drive(()=>copy()?.id===42);
    const roster = copy().members;
    assert.deepEqual(roster.map(({id,self,roleSlot,name,secondaryName})=>
      [id,self,roleSlot,Buffer.from(name).toString(),Buffer.from(secondaryName).toString()]),
    [[501,true,2,'Iris','One'],[502,false,3,'Birch','Two']]);
    roster[0].name.fill(0);
    assert.equal(Buffer.from(copy().members[0].name).toString(),'Iris');
    const initial = copy().version;
    send('[qD',[],row(501,'Iris',2)+'|'+row(501,'Duplicate',2));
    send('[qD',[],row(501,'X'.repeat(17),2));
    send('Y0[',[],'2|2|0|Revoke|32|128|Bad');
    await flush();
    assert.equal(copy().version,initial);
    assert.equal(copy().canManage,true);
    assert.deepEqual(ids(),[501,502]);
    send(']^M',[55],row(502,'Birch New\\zTwo',2));
    await f.drive(()=>copy().members[1].roleSlot===2);
    send(']^M',[55],row(503,'Cedar',3));
    await f.drive(()=>ids().includes(503));
    send(']^M',[55],'0|502');
    await f.drive(()=>!ids().includes(502));
    remove('ZCY',503);
    await f.drive(()=>!ids().includes(503));
    send('[qD',[],row(504,'Dove',3));
    await f.drive(()=>ids()[0]===504);
    assert.deepEqual(ids(),[504]);
    remove('Zi8',41);
    await flush();
    assert.equal(copy().id,42);
    remove('Zi8',42);
    await f.drive(()=>copy().id===-1);
    assert.deepEqual(ids(),[]);
    assert.deepEqual(copy().roles,[]);
    assert.equal(copy().canManage,false);
  } finally { f.close(); }
});

test('family member actions use current IDs, title protections and authoritative roster updates', async () => {
  const f = clientFixture(), copy = () => f.client.copyFamily();
  const send = (tag,args,text) => offerGameText(f,tag,args,text);
  const row = (id,name,slot) => '1|'+id+'|'+name+'|0|0|0|0|'+slot;
  const member = id => copy().members.find(value=>value.id===id);
  const act = (kind,memberId,slot) => f.client.actOnFamily(copy().version,{kind,memberId,slot});
  const sent = () => Buffer.from(plain(f.writes.at(-1)),'hex').toString();
  const remove = id => f.offer(f.frame(Buffer.from('ZCY '+Buffer.from(encodeLegacyGameInteger(id)).toString()+' ').toString('hex')));
  try {
    await clientEnter(f);
    send('Y&3',[],'1|42|Harbor|Hall|2|0|0|0|0|a|b|c|501');
    send('Y0[',[],'4|0|128|Founder|2|131|Officer|3|0|Reader|4|0|Courier');
    send('[qD',[],[row(501,'Iris',2),row(502,'Founder',0),row(503,'Birch',3),row(504,'Cedar',3)].join('|'));
    await f.drive(()=>copy()?.members.length===4);
    const initial=f.writes.length, old=copy().version;
    assert.equal(member(501).canRemove,false);
    assert.equal(member(502).canAssignRole,false);
    assert.equal(member(503).canAssignRole,true);
    await assert.rejects(act('assign-role',502,4),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    await assert.rejects(act('remove-member',502),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    await assert.rejects(act('assign-role',503,0),{code:'LEGACY_GAME_FAMILY_ROLE'});
    await assert.rejects(act('assign-role',503,31),{code:'LEGACY_GAME_FAMILY_ROLE'});
    await assert.rejects(act('remove-member',701),{code:'LEGACY_GAME_FAMILY_MEMBER'});
    await act('assign-role',503,3);
    assert.equal(f.writes.length,initial);
    await act('assign-role',503,4);
    assert.equal(sent(),'8MV 87 4 ');
    assert.equal(copy().pending,'assign-role');
    assert.equal(member(503).roleSlot,3);
    await assert.rejects(act('remove-member',503),{code:'LEGACY_GAME_FAMILY_BUSY'});
    send(']^M',[55],row(503,'Birch New',3));
    await f.drive(()=>copy().version>old);
    assert.equal(copy().pending,'assign-role');
    send(']^M',[55],row(503,'Birch New',4));
    await f.drive(()=>!copy().pending);
    assert.equal(member(503).roleSlot,4);
    send('Y0[',[],'1|2|2|Officer');
    await f.drive(()=>!copy().canManage);
    assert.equal(member(503).canRemove,true);
    await assert.rejects(f.client.actOnFamily(old,{kind:'remove-member',memberId:503}),{code:'LEGACY_GAME_FAMILY_STALE'});
    await assert.rejects(act('assign-role',503,3),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    await act('remove-member',503);
    assert.equal(sent(),'8u6 87 ');
    remove(504);
    await f.drive(()=>!member(504));
    assert.equal(copy().pending,'remove-member');
    assert.ok(member(503));
    send('[qD',[],[row(501,'Iris',2),row(502,'Founder',0)].join('|'));
    await f.drive(()=>!copy().pending);
    assert.equal(member(503),undefined);
    send('Y0[',[],'1|2|0|Reader');
    await f.drive(()=>!member(502).canRemove&&member(501).canRemove);
    await act('remove-member',501);
    assert.equal(sent(),'8u6 85 ');
    remove(501);
    await f.drive(()=>!copy().pending);
    assert.equal(f.writes.length,initial+3);
  } finally { f.close(); }
});

test('family invitation uses the local tile with an eligible adjacent actor and strict shortcut cooldown', async () => {
  const f=clientFixture(), copy=()=>f.client.copyFamily();
  const invite=()=>f.client.actOnFamily(copy().version,{kind:'invite'});
  const send=(tag,text)=>offerGameText(f,tag,[],text);
  try {
    await clientEnter(f);
    send('Y&3','1|42|Harbor|Hall|2|0|0|0|0|a|b|c|501');
    send('Y0[','1|2|0|Reader');
    await f.drive(()=>copy()?.roles.length===1);
    await assert.rejects(invite(),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    const initial=f.writes.length;
    send('Y0[','1|2|1|Recruiter');
    send('H#|','1|3e|2|5|4|100001|77|8|Far||1');
    await f.drive(()=>copy().canInvite&&f.client.copyWorldState().actors.remoteActors.some(row=>row.id===200));
    await assert.rejects(invite(),{code:'LEGACY_GAME_FAMILY_TARGET'});
    send('H#|','1|3f|2|4|4|100001|77|8|Near||1');
    await f.drive(()=>f.client.copyWorldState().actors.remoteActors.some(row=>row.id===201));
    const time=f.tick;
    await invite();
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'8^J 2 3 ');
    assert.equal(copy().pending,null);
    f.tick=time+500;
    await assert.rejects(invite(),{code:'LEGACY_GAME_FAMILY_COOLDOWN'});
    await assert.rejects(f.client.actOnPlayerTrade('request'),{code:'LEGACY_GAME_TRADE_COOLDOWN'});
    f.tick=time+501;
    await invite();
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'8^J 2 3 ');
    send('Y0[','1|2|0|Reader');
    await f.drive(()=>!copy().canInvite);
    await assert.rejects(invite(),{code:'LEGACY_GAME_FAMILY_PERMISSION'});
    assert.equal(f.writes.length,initial+2);
  } finally { f.close(); }
});

test('ordinary map chat sends tile, escaped text and display options with source chat mode and rate guards', async () => {
  const f = clientFixture(), send = (text,options) => f.client.sendMapChat(Buffer.from(text),options);
  const write = () => Buffer.from(plain(f.writes.at(-1)),'hex');
  const settings = value => f.offer(f.frame(Buffer.from('K0c '+Buffer.from(encodeLegacyGameInteger(value)).toString()+' ').toString('hex')));
  const info = () => f.client.inspect().world.mapChat;
  try {
    await assert.rejects(send('Hello'),{code:'LEGACY_CLIENT_NOT_PLAYING'});
    await clientEnter(f);
    await assert.rejects(f.client.setPartyChat(false),{code:'LEGACY_GAME_CHAT_MODE'});
    settings(0x33);
    await f.drive(()=>info()?.flagsKnown);
    await assert.rejects(f.client.setPartyChat(true),{code:'LEGACY_GAME_CHAT_MODE'});
    const count=f.writes.length;
    await assert.rejects(send('A'.repeat(77)),{code:'LEGACY_GAME_CHAT_TEXT'});
    await assert.rejects(send('Line\nbreak'),{code:'LEGACY_GAME_CHAT_TEXT'});
    await assert.rejects(send('Hello',{range:6}),{code:'LEGACY_GAME_CHAT_OPTIONS'});
    f.tick=1000;
    const raw=Buffer.from('c4a7c1a6207c2c5c','hex');
    await send(raw,{color:4,range:3,size:2});
    const expected=Buffer.concat([Buffer.from(')bX 2 3 P|'),Buffer.from('c4a7c1a6','hex'),Buffer.from('\\S\\\\z\\\\c\\\\y 5 3 2 ')]);
    assert.deepEqual(write(),expected);
    assert.deepEqual(f.client.copyMapChat(),[]);
    f.tick=1999;
    await assert.rejects(send('Too soon'),{code:'LEGACY_GAME_CHAT_RATE'});
    f.tick=2000;
    await assert.rejects(send('Still muted'),{code:'LEGACY_GAME_CHAT_MUTED'});
    assert.equal(f.writes.length,count+1);
    offerGameText(f,'HFs',[1],'1|100|0|0|0|0|Hero ');
    await f.drive(()=>f.client.inspect().world.partyMode===1);
    await f.client.setPartyChat(true);
    assert.equal(write().toString(),'*(2 V ');
    assert.equal(info().partySelected,true);
    await f.client.setPartyChat(true);
    assert.equal(f.writes.length,count+2);
    await send('Small group');
    assert.equal(write().toString(),')bX 2 3 P|Small\\Sgroup 0 1 0 ');
    await f.client.setPartyChat(false);
    assert.equal(write().toString(),'*(2 N ');
    assert.equal(info().partySelected,false);
    settings(0x3b);
    await f.drive(()=>info().partySelected);
    settings(0x33);
    await f.drive(()=>!info().partySelected);
    f.tick=181999;
    await assert.rejects(send('Not yet'),{code:'LEGACY_GAME_CHAT_MUTED'});
    f.tick=182000;
    await send('Ready');
    assert.equal(write().toString(),')bX 2 3 P|Ready 0 1 0 ');
    assert.equal(f.writes.length,count+5);
  } finally { f.close(); }
});

test('map chat retains only bounded received player and system records in chronological order', async () => {
  const f = clientFixture(), copy = () => f.client.copyMapChat();
  const current = () => f.client.inspect().world.mapChat;
  const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString();
  function player(id, body, color, style) {
    const raw=Buffer.concat([Buffer.from('Cz> '+int(id)+' '),encodeLegacyGameTextField(Buffer.from(body)),
      Buffer.from(' '+int(color)+' '+int(style)+' ')]);
    f.offer(f.frame(raw.toString('hex')));
  }
  const system=text=>offerGameText(f,'DMK',[],text);
  try {
    await clientEnter(f);
    player(200,'P|Visitor: Hello\\zworld',6,2);
    player(-1,'P|Another\\nline',-1,9);
    system('System\\c message');
    await f.drive(()=>current()?.version===3);
    const rows=copy();
    assert.deepEqual(rows.map(({kind,actorId,color,style,text})=>[kind,actorId,color,style,Buffer.from(text).toString()]),[
      ['player',200,6,2,'Visitor: Hello|world'],['player',-1,0,1,'Another\nline'],['system',null,4,3,'System, message'],
    ]);
    rows[0].text.fill(0);
    assert.equal(Buffer.from(copy()[0].text).toString(),'Visitor: Hello|world');
    assert.equal(JSON.stringify(f.states).includes('Hello|world'),false);
    player(200,'X|Wrong prefix',0,0);
    player(200,'P|'+'A'.repeat(292),0,0);
    player(200,'P|Wrong color',12,0);
    system(Buffer.from('5bb9abb8e65d','hex'));
    system(Buffer.from('5bcde6bcd2b9abb8e65d','hex'));
    await flush();
    assert.equal(current().version,3);
    for(let i=0;i<512;i++)system('Log '+i);
    await f.drive(()=>current().version===515,700);
    assert.equal(copy().length,512);
    assert.equal(Buffer.from(copy()[0].text).toString(),'Log 0');
    assert.equal(Buffer.from(copy().at(-1).text).toString(),'Log 511');
    f.client.close();
    assert.equal(f.client.inspect().world.mapChat,undefined);
    assert.throws(copy,{code:'LEGACY_CLIENT_CLOSED'});
  } finally { f.close(); }
});

test('map chat blacklist matches stripped sender bytes and speech belongs to the live actor', async () => {
  const f = clientFixture();
  const message = (id,text,color=6,style=1) => {
    const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString('ascii');
    const packet = Buffer.concat([Buffer.from('Cz> '+int(id)+' '),encodeLegacyGameTextField(Buffer.from(text)),
      Buffer.from(' '+int(color)+' '+int(style)+' ')]);
    f.offer(f.frame(packet.toString('hex')));
  };
  const history = () => f.client.copyMapChat().map(row=>Buffer.from(row.text).toString('latin1'));
  const actor = () => f.client.copyWorldState().actors.remoteActors.find(row=>row.id===200);
  const unit = () => offerGameText(f,'H#|',[],'1|3e|2|4|4|100111|77|8|Visitor||1');
  try {
    const name = Buffer.from('Visitor');
    assert.equal(f.client.setMapChatBlockedName(name,true),true);
    name.fill(0);
    assert.equal(f.client.setMapChatBlockedName(Buffer.from('Visitor'),true),false);
    await clientEnter(f);
    unit();await f.drive(actor);
    const writes = f.writes.length;
    const frameAt = tick => {
      f.client.runtime().resetClock(tick);
      const result = f.client.runtime().pump({...f.client.readFrame(),tick});
      assert.equal(result.error,null);
      return result.frame;
    };
    message(200,'P|[GP]Visitor: Hidden group');
    message(200,'P|[MIC]Visitor: Hidden mic');
    message(200,'P|visitor: Other case');
    await f.drive(()=>history().length===1);
    assert.deepEqual(history(),['visitor: Other case']);
    assert.equal(frameAt(f.tick).mapChatPresentation,undefined);
    const owned = f.client.copyMapChatBlockedNames();owned[0].fill(0);
    assert.equal(Buffer.from(f.client.copyMapChatBlockedNames()[0]).toString(),'Visitor');
    assert.equal(f.client.setMapChatBlockedName(Buffer.from('Visitor'),false),true);
    const wide = Buffer.from('c4a7c1a6','hex');
    message(200,Buffer.concat([Buffer.from('P|[GP]Visitor: '+'A'.repeat(39)),wide,Buffer.from(' Tail')]));
    await f.drive(()=>history().length===2);
    const frame=frameAt(f.tick), [speech]=frame.mapChatPresentation.speech;
    const [x,y]=frame.actorLayer.actors.find(row=>row.id===200).screenPosition;
    assert.deepEqual([speech.actorId,speech.color,speech.style,speech.width,speech.height],[200,6,1,283,38]);
    assert.deepEqual([speech.x,speech.y],[x-Math.trunc(273/2)-5,y-88-33-14]);
    assert.deepEqual(speech.lines.map(line=>Buffer.from(line)),[Buffer.alloc(39,65),Buffer.concat([wide,Buffer.from(' Tail')])]);
    speech.lines[0].fill(0);
    assert.equal(frameAt((speech.tick+999)>>>0).mapChatPresentation.speech[0].lines[0][0],65);
    assert.equal(frameAt((speech.tick+1000)>>>0).mapChatPresentation,undefined);
    f.tick += 1500;
    message(200,'P|Visitor: First');message(200,'P|Visitor: Replacement');
    await f.drive(()=>history().length===4);
    assert.equal(Buffer.from(frameAt(f.tick).mapChatPresentation.speech[0].lines[0]).toString(),'Replacement');
    offerGameText(f,'IZL',[],'3e');await f.drive(()=>!actor());
    unit();await f.drive(actor);
    assert.equal(frameAt(f.tick).mapChatPresentation,undefined);
    assert.equal(f.writes.length,writes);
  } finally { f.close(); }
});

test('chat blacklist capacity rejects invalid names and keeps prior entries on failed edits', () => {
  const chat=createLegacyGameMapChat(()=>false);
  for (const invalid of [Buffer.alloc(17,65),Buffer.from([0]),Buffer.from([0xc4])]) {
    assert.throws(()=>chat.setBlocked(invalid,true),{code:'LEGACY_GAME_CHAT_BLOCKED_NAME'});
  }
  for (let index=0;index<100;index++)chat.setBlocked(Buffer.from('Name'+index),true);
  assert.equal(chat.setBlocked(Buffer.from('Name0'),true),false);
  assert.throws(()=>chat.setBlocked(Buffer.from('Overflow'),true),{code:'LEGACY_GAME_CHAT_BLACKLIST_FULL'});
  assert.equal(chat.copyBlocked().length,100);
  assert.equal(chat.setBlocked(Buffer.from('Name0'),false),true);
  assert.equal(chat.setBlocked(Buffer.from('Replacement'),true),true);
  assert.deepEqual(chat.copyBlocked().slice(0,2).map(name=>Buffer.from(name).toString()),['Name1','Name2']);
  chat.close();assert.deepEqual(chat.copyBlocked(),[]);
});

test('DMK announcements have independent markers, bounded text and strict frame intervals', () => {
  const chat=createLegacyGameMapChat(()=>false);
  const player=Buffer.from('5bcde6bcd2b9abb8e65d','hex'), regular=Buffer.from('5bb9abb8e65d','hex');
  const system=raw=>chat.receive('0x4f30d0',[Buffer.from(raw)],0);
  const text=row=>Buffer.from(row.text);
  system(Buffer.concat([regular,Buffer.from(' No GM marker')]));
  assert.deepEqual(chat.advanceAnnouncements(0),[]);
  system('Ordinary [gm]notice');
  system(Buffer.concat([player,Buffer.from(' Player notice')]));
  assert.deepEqual(chat.copy().map(text),[Buffer.from('Ordinary [gm]notice')]);
  assert.deepEqual(chat.advanceAnnouncements(10).map(row=>[row.kind,row.x,row.y,row.color]),[
    ['operator',640,60,4],['player',640,76,5],
  ]);
  assert.deepEqual(chat.advanceAnnouncements(11).map(row=>row.x),[639,639]);
  assert.deepEqual(chat.advanceAnnouncements(21).map(row=>row.x),[639,639]);
  assert.deepEqual(chat.advanceAnnouncements(22).map(row=>row.x),[638,638]);
  system(Buffer.concat([regular,Buffer.from(' [GM]Replacement \\yX')]));
  let rows=chat.advanceAnnouncements(22);
  assert.equal(rows[0].x,638);
  assert.deepEqual(text(rows[0]),Buffer.concat([regular,Buffer.from(' [GM]Replacement   ')]));
  rows[0].text.fill(0);
  assert.notEqual(chat.advanceAnnouncements(22)[0].text[0],0);
  const passes={operator:new Set(),player:new Set()};
  for (let tick=33;tick<40000;tick+=11) {
    for (const row of chat.advanceAnnouncements(tick))passes[row.kind].add(row.pass);
  }
  assert.deepEqual([...passes.operator],[0,1,2,3]);assert.deepEqual([...passes.player],[0,1,2]);
  assert.deepEqual(chat.advanceAnnouncements(40000),[]);
  system(Buffer.concat([player,Buffer.alloc(276,65),Buffer.from('c4a7','hex')]));
  rows=chat.advanceAnnouncements(40011);
  assert.equal(rows[0].text.length,286);
  chat.close();assert.deepEqual(chat.advanceAnnouncements(40022),[]);
});

test('NPC merchant and exchange entry keep their native flags, ordinals and local leave paths', async () => {
  const f = clientFixture();
  const current = () => f.client.copyMapDialog();
  const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString();
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  async function open(mode, sequence, text) {
    offerGameText(f, 'Q?m', [mode, 32, sequence, 204], text);
    await f.drive(() => current()?.sequence === sequence);
    return current();
  }
  async function reply(dialog, id, bytes = String(id)) {
    await f.client.replyMapDialog(dialog.revision, 0, id);
    assert.equal(sent(), `/1I 2 3 ${int(dialog.sequence)} 3i 0 ${bytes} `);
    assert.equal(current(), null);
  }
  try {
    await clientEnter(f);
    const merchant = await open(5, 101, '123|Market\\zShop|Buy\\nOr sell|3');
    assert.equal(merchant.npcService.graphicResource, 123);
    assert.equal(Buffer.from(merchant.npcService.title).toString(), 'Market|Shop');
    assert.deepEqual(merchant.npcService.lines.map(line => Buffer.from(line).toString()), ['Buy', 'Or sell']);
    assert.deepEqual(merchant.npcService.choices.map(({id, sends}) => [id, sends]), [[1,true],[2,true],[3,false]]);
    merchant.npcService.title.fill(0);
    assert.equal(Buffer.from(current().npcService.title).toString(), 'Market|Shop');
    const count = f.writes.length;
    await f.client.replyMapDialog(merchant.revision, 0, 3);
    assert.equal(f.writes.length, count);
    assert.equal(current(), null);
    await reply(await open(5, 102, '1|Market|Welcome|1'), 1);
    const buy = await open(6, 103, '0|Market|Choose|||Herb|23|8||0|1');
    assert.equal(buy.shop.direction, 'buy');
    await f.client.replyMapDialog(buy.revision, 2);
    const sell = await open(5, 104, '1|Market|Welcome|2');
    await assert.rejects(f.client.replyMapDialog(sell.revision, 0, 1), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    await reply(sell, 2);
    await reply(await open(5, 105, '1|Market|Welcome|2'), 3);
    await reply(await open(5, 106, '1|Market|Welcome|0'), 3);
    const exchange = await open(0x1b, 107, '1|Trader|Trade');
    assert.deepEqual(exchange.npcService.choices.map(({id, sends}) => [id, sends]), [[1,true],[2,false]]);
    await reply(exchange, 1);
    const leave = await open(0x1b, 108, '1|Trader|Trade');
    await f.client.replyMapDialog(leave.revision, 0, 2);
    assert.equal(current(), null);
    assert.equal(sent(), `/1I 2 3 ${int(exchange.sequence)} 3i 0 1 `);
  } finally { f.close(); }
});

test('ordinary skill NPC replies leave skill and gold changes to received packets and guard compact forget ordinals', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const skills = () => f.client.copyWorldState().battle.playerSkills;
  const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString();
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  const header = (slot, name, units, order) => [slot,1,name,1,2,3,4,units,0,0,order].join('|');
  const initial = [header(2,'First',2,40),header(8,'Second',255,10)].join('|') + '|';
  const forget = '23|Instructor|Choose|First|10|4|Second|3|5';
  async function receiveRoster(raw) {
    const version = skills().version;
    offerGameText(f, 'J<=', [], raw);
    await f.drive(() => skills().version > version);
  }
  async function open(mode, sequence, text) {
    offerGameText(f, 'Q?m', [mode, 32, sequence, 204], text);
    await f.drive(() => info()?.sequence === sequence);
    return f.client.copyMapDialog();
  }
  async function reply(dialog, id) {
    await f.client.replyMapDialog(dialog.revision, 0, id);
    assert.equal(sent(), `/1I 2 3 ${int(dialog.sequence)} 3i 0 ${id} `);
    assert.equal(info(), null);
  }
  try {
    await clientEnter(f);
    const trainer = await open(0x10, 111, '23|Instructor|Select');
    assert.deepEqual(trainer.npcService.choices.map(({id,sends}) => [id,sends]), [[1,true],[2,true],[3,false]]);
    await reply(trainer, 1);
    offerGameText(f, 'Q?m', [0x11, 0, 112, 204], '23|Instructor|Practice|Wind');
    await flush();
    assert.equal(info(), null);
    const learn = await open(0x11, 113, '23|Instructor|Practice|Wind\\zStep|Fast\\nMove|2|12');
    const { npcService } = learn;
    assert.deepEqual([learn.gold,learn.skillUsed,learn.skillCapacity,npcService.slotUnits,npcService.fee], [null,0,null,2,12]);
    assert.equal(Buffer.from(npcService.name).toString(), 'Wind|Step');
    assert.deepEqual(npcService.description.map(line => Buffer.from(line).toString()), ['Fast','Move']);
    offerShopBalance(f, 8);
    offerGameText(f, 'F8%', [], int(1 << 17) + '|9');
    await receiveRoster(initial);
    await f.drive(() => info()?.gold === 8 && info()?.skillCapacity === 9);
    assert.equal(info().skillUsed, 1);
    const before = skills();
    await reply(learn, 1);
    assert.deepEqual(skills(), before);
    const back = await open(0x11, 114, '23|Instructor|Practice|Wind||2|12');
    assert.equal(back.gold, 8);
    await reply(back, 2);
    await reply(await open(0x10, 115, '23|Instructor|Select'), 2);
    const list = await open(0x12, 116, forget);
    assert.deepEqual(list.npcService.rows.map(({id,slot,name,firstValue,secondValue}) =>
      [id,slot,Buffer.from(name).toString(),firstValue,secondValue]), [[2,8,'Second',3,5],[1,2,'First',10,4]]);
    list.npcService.rows[0].name.fill(0);
    assert.equal(Buffer.from(f.client.copyMapDialog().npcService.rows[0].name).toString(), 'Second');
    await receiveRoster(initial);
    assert.equal(info().skillListStale, false);
    await assert.rejects(f.client.replyMapDialog(list.revision, 0, 3), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    await reply(list, 2);
    assert.equal(skills().records[8].present, true);
    const stale = await open(0x12, 117, forget);
    await receiveRoster('2|0||-1|-1|0|0|0|0|0|0|');
    assert.equal(info().skillListStale, true);
    const count = f.writes.length;
    await assert.rejects(f.client.replyMapDialog(stale.revision, 0, 2), { code: 'LEGACY_GAME_SKILL_LIST_STALE' });
    assert.equal(f.writes.length, count);
    await reply(stale, 99);
    const sparse = await open(0x12, 118, '23|Instructor|Choose|Second|-1|5|Ghost|9|2');
    assert.deepEqual(sparse.npcService.rows, []);
    f.client.dismissMapDialog(sparse.revision);
    assert.equal(sent(), `/1I 2 3 ${int(stale.sequence)} 3i 0 99 `);
    await receiveRoster(Array.from({length:15}, (_, slot) => header(slot,'Skill'+slot,1,slot)).join('|'));
    const full = await open(0x12, 119, '23|Instructor|Choose|' +
      Array.from({length:16}, (_, index) => `Skill${index}|1|2`).join('|'));
    assert.equal(full.npcService.rows.length, 15);
    await reply(full, 15);
  } finally { f.close(); }
});
function petTrainingFixture() {
  const f = clientFixture(), info = () => f.client.inspect().world.mapDialog;
  const state = () => f.client.copyWorldState().battle.pets;
  const int = n => Buffer.from(encodeLegacyGameInteger(n)).toString();
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  const window = (mode, sequence, body, actor = 204, mask = 0) => offerGameText(f, 'Q?m', [mode, mask, sequence, actor], body);
  async function open(mode, sequence, body) {
    window(mode, sequence, body);
    await f.drive(() => info()?.sequence === sequence);
    return f.client.copyMapDialog();
  }
  async function reply(dialog, button, id = null) {
    await f.client.replyMapDialog(dialog.revision, button, id);
    assert.equal(sent(), '/1I 2 3 '+int(dialog.sequence)+' 3i '+button+' '+(id ?? '')+' ');
    assert.equal(info(), null);
  }
  function addPets() {
    offerGameText(f, 'FBY', [1], int(1 << 22) + '|Finch');
    offerGameText(f, 'FBY', [4], int(1 << 22) + '|Hound');
  }
  return {f,info,state,window,open,reply,addPets};
}
test('pet training preserves the independent zero-based lesson, occupied pet and skill slot choices', async () => {
  const {f,info,state,window,open,reply,addPets} = petTrainingFixture();
  const offers = '23|Pet Instructor|Select a skill|More lessons|Try again|Rush|9|15|Dash\\nfast|Wind\\zStep|10|20|Move';
  const pets = '23|Pet Instructor|Select your pet|10|Finch|8|2|Hound|10|3';
  try {
    await clientEnter(f);
    window(0x19, 120, pets);
    await flush();
    assert.equal(info(), null);
    const menu = await open(0x18, 121, offers);
    assert.deepEqual(menu.petTraining.rows.map(row => [row.id,Buffer.from(row.name).toString(),row.fee]), [[0,'Rush',15],[1,'Wind|Step',20]]);
    assert.deepEqual(menu.petTraining.rows[0].description.map(line => Buffer.from(line).toString()), ['Dash','fast']);
    await assert.rejects(f.client.replyMapDialog(menu.revision, 0, 1), { code: 'LEGACY_GAME_PET_TRAINING_BALANCE' });
    offerShopBalance(f, 21);
    await f.drive(() => info()?.gold === 21);
    await assert.rejects(f.client.replyMapDialog(menu.revision, 0, 1), { code: 'LEGACY_GAME_PET_TRAINING_NO_PET' });
    addPets();
    await f.drive(() => info()?.petCount === 2);
    await reply(menu, 0, 1);
    window(0x19, 122, pets, 205);
    await flush();
    assert.equal(info(), null);
    const chooser = await open(0x19, 123, pets);
    assert.deepEqual(chooser.petTraining.rows.map(({id,slot,eligible}) => [id,slot,eligible]), [[0,1,false],[1,4,true]]);
    await assert.rejects(f.client.replyMapDialog(chooser.revision, 0, 0), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    const version = state().version;
    offerGameText(f, 'G:w', [4], '2|19');
    await f.drive(() => state().version > version);
    assert.equal(info().petTrainingStale, false);
    await reply(chooser, 0, 1);
    const slots = await open(0x1a, 124, '23|Pet Instructor|Select a skill slot|Scratch|2|Old skill||||Talon|4|Other skill');
    assert.deepEqual(slots.petTraining.rows.map(({id,name,occupied}) => [id,Buffer.from(name).toString(),occupied]),
      [[0,'Scratch',true],[1,'',false],[2,'Talon',true]]);
    assert.deepEqual([slots.petTraining.selectedPet.slot,slots.petTraining.selectedPet.capacity], [4,3]);
    slots.petTraining.lesson.name.fill(0);
    assert.equal(Buffer.from(f.client.copyMapDialog().petTraining.lesson.name).toString(), 'Wind|Step');
    const before = state();
    await reply(slots, 0, 1);
    assert.deepEqual(state(), before);
    const next = await open(0x18, 125, offers);
    assert.equal(next.gold, 21);
    const count = f.writes.length;
    await f.client.replyMapDialog(next.revision, 2);
    assert.equal(f.writes.length, count);
    assert.equal(info(), null);
  } finally { f.close(); }
});

test('extended pet training enforces type and slot bounds and invalidates a changed skill', async () => {
  const {f,info,state,window,open,reply,addPets} = petTrainingFixture();
  const offers = '23|Pet Instructor|Select a skill|More lessons|Try again|Guard|9|5|Stay';
  const pets = '23|Pet Instructor|Choose your pet|Trainer message|Other message|10|6|Finch|11|3|3|1|Hound|10|10|6|0';
  try {
    await clientEnter(f);
    offerShopBalance(f, 40);
    addPets();
    const occupied = '0|7|Guard|Description|2|0|1|3|';
    offerGameText(f, 'J_J', [4], occupied);
    await f.drive(() => state().records[4].skills[0].present);
    await reply(await open(0x2a, 130, offers), 0, 0);
    window(0x2a, 131, '', 204, -1);
    window(0x2b, 132, pets);
    await flush();
    assert.equal(info(), null);
    await reply(await open(0x2a, 133, offers), 0, 0);
    const chooser = await open(0x2b, 134, pets);
    assert.equal(chooser.petTraining.requiredType, 6);
    assert.deepEqual(chooser.petTraining.rows.map(({type,hintFlag,eligible}) => [type,hintFlag,eligible]), [[3,1,false],[6,0,true]]);
    await assert.rejects(f.client.replyMapDialog(chooser.revision, 0, 0), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    await reply(chooser, 0, 1);
    const layout = ['23','Pet Instructor','Choose',...Array.from({length:11}, (_, i) => ['Skill'+i,'3','Old']).flat()].join('|');
    const slots = await open(0x2c, 135, layout);
    assert.deepEqual(slots.petTraining.rows.map(row => row.id), Array.from({length:10}, (_, i) => i));
    await assert.rejects(f.client.replyMapDialog(slots.revision, 0, 10), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    const version = state().version;
    offerGameText(f, 'J_J', [4], occupied);
    await f.drive(() => state().version > version);
    assert.equal(info().petTrainingStale, false);
    offerGameText(f, 'J_J', [4], '0|8|New Guard|Description|2|0|1|3|');
    await f.drive(() => info()?.petTrainingStale === true);
    const count = f.writes.length;
    await assert.rejects(f.client.replyMapDialog(slots.revision, 0, 0), { code: 'LEGACY_GAME_PET_TRAINING_STALE' });
    assert.equal(f.writes.length, count);
    await reply(slots, 2);
  } finally { f.close(); }
});
test('NPC treatment keeps source row positions, wound bands and server-owned gold', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const rows = '20|25|Wounded\\zHero|5|0|0|Unused|0|23|76|ABCDEFGHIJKLMNOPQ|8|-1|88|Ignored|99';
  const open = (sequence, text = rows) => offerGameText(f, 'Q?m', [19, 32, sequence, 204], text);
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  try {
    await clientEnter(f);
    offerShopBalance(f, 30);
    open(19, '20|25|Incomplete');
    await flush();
    assert.equal(info(), null);
    open(20);
    await f.drive(() => info()?.revision === 1);
    const dialog = f.client.copyMapDialog();
    assert.deepEqual([dialog.gold, dialog.buttons, dialog.treatment.allChoice, dialog.treatment.allFee, dialog.treatment.totalInjury],
      [30, [2], 9, 13, 101]);
    assert.deepEqual(dialog.treatment.rows.map(row => [row.choice, row.level, row.injury, row.injuryGrade, row.fee, Buffer.from(row.name).toString()]),
      [[3, 20, 25, 1, 5, 'Wounded|Hero'], [5, 23, 76, 4, 8, '???']]);
    dialog.treatment.rows[0].name.fill(0);
    assert.equal(Buffer.from(f.client.copyMapDialog().treatment.rows[0].name).toString(), 'Wounded|Hero');
    await assert.rejects(f.client.replyMapDialog(1, 0, 4), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    await assert.rejects(f.client.replyMapDialog(1, 32), { code: 'LEGACY_GAME_DIALOG_CHOICE' });
    await f.client.replyMapDialog(1, 0, 5);
    assert.equal(sent(), '/1I 2 3 k 3i 0 5 ');
    open(21);
    await f.drive(() => info()?.revision === 2);
    assert.equal(info().gold, 30);
    offerShopBalance(f, 22);
    await f.drive(() => info()?.gold === 22);
    assert.equal(info().revision, 2);
    await f.client.replyMapDialog(2, 0, 9);
    assert.equal(sent(), '/1I 2 3 l 3i 0 9 ');
    open(22);
    await f.drive(() => info()?.revision === 3);
    await assert.rejects(f.client.replyMapDialog(2, 0, 9), { code: 'LEGACY_GAME_DIALOG_STALE' });
    await f.client.replyMapDialog(3, 2);
    assert.equal(sent(), '/1I 2 3 m 3i 2  ');
    open(23, '2|0|Healthy|0');
    await f.drive(() => info()?.revision === 4);
    assert.equal(f.client.copyMapDialog().treatment.rows[0].injuryGrade, 0);
    f.client.dismissMapDialog(4);
    assert.equal(info(), null);
    assert.equal(sent(), '/1I 2 3 m 3i 2  ');
  } finally { f.close(); }
});
test('ordinary illustrated dialog keeps text choices and draws source static and animated graphics', async () => {
  const f = clientFixture({ assets: groundPickupAssets(assets) });
  const info = () => f.client.inspect().world.mapDialog;
  let renderer;
  try {
    await clientEnter(f);
    offerGameText(f, 'Q?m', [2, 2, 21, 204],
      '1\\nGuide @g,87000@\\nSouth @g\\c100001\\c 5\\c(60\\c80)@\\nNorth@@! route');
    await f.drive(() => info()?.graphicsCount === 2);
    const dialog = f.client.copyMapDialog(), art = dialog.illustration;
    assert.deepEqual(dialog.lines.map(line => Buffer.from(line).toString()), ['Guide ', 'South ', 'North@@ route']);
    assert.deepEqual(art, { width: 448, height: 240, graphics: [
      { resourceId: 87000, facing: 0, x: 224, y: 120 },
      { resourceId: 100001, facing: 5, x: 60, y: 80 },
    ] });
    const library = f.client.library();
    renderer = createLegacyGameMapDialogGraphics(art, library);
    const first = renderer.advance();
    assert.deepEqual(first.commands.slice(0, 1).map(row => [row.x, row.y, ...row.expectedDimensions]), [[218, 115, 12, 10]]);
    assert.equal(first.commands[1].image.index, 1002);
    const pixels = await library.startRender(first).done;
    assert.deepEqual(Array.from(pixels.rgba.slice((115 * art.width + 218) * 4, (115 * art.width + 218) * 4 + 4)), [239, 88, 220, 255]);
    assert.equal(renderer.advance(), null);
    assert.equal(renderer.advance(), null);
    const next = renderer.advance();
    assert.notEqual(next.commands[1].image.index, first.commands[1].image.index);
    const later = await library.startRender(next).done;
    assert.notEqual(sha(later.rgba), sha(pixels.rgba));
    await f.client.replyMapDialog(dialog.revision, 0, 2);
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '/1I 2 3 l 3i 0 2 ');
    offerGameText(f, 'Q?m', [10, 1, 22, 204], 'Wide' + '@g,87000@.'.repeat(11) + ' @g,unterminated');
    await f.drive(() => info()?.graphicsCount === 10);
    const wide = f.client.copyMapDialog();
    assert.deepEqual([wide.illustration.width, wide.illustration.height], [576, 432]);
    assert.deepEqual(wide.illustration.graphics.at(-1), { resourceId: 87000, facing: 0, x: 288, y: 216 });
    assert.equal(Buffer.from(wide.lines[0]).toString(), 'Wide........... @g,unterminated');
  } finally { renderer?.close(); f.close(); }
});
function itemRow(slot, name, quantity, description = '', { exchangeCode = 0, code = 2, qualification = 0 } = {}) {
  return [slot, name, 0, description, code, 1, 0, 0, 0, qualification, exchangeCode, 23, quantity, ''].join('|');
}
test('ordinary purchase uses stack capacity and sends selected source row numbers in order', async () => {
  const f = clientFixture();
  const open = text => offerGameText(f, 'Q?m', [6, 0, 17, 204], text);
  const info = () => f.client.inspect().world.mapDialog;
  const choice = [{ row: 2, quantity: 1 }, { row: 0, quantity: 2 }];
  try {
    await clientEnter(f);
    const writes = f.writes.length;
    offerShopBalance(f, '');
    open('0|Market|Partial');
    await flush();
    assert.equal(info(), null);
    const rows = [
      ['Herb\\zLeaf', 23, 8, 'First\\nSecond', 1, 3],
      ['Role gear', 24, 1, '', 0, 2],
      ['Potion', 24, 15, '', 1, 0],
      ['X'.repeat(29), 25, 1, '', 1, 1],
    ];
    open([0, 'Market', 'Please choose', '', '', ...rows.flat(), ''].join('|'));
    await f.drive(() => info()?.shopDirection === 'buy');
    const { shop } = f.client.copyMapDialog();
    assert.equal(shop.gold, null);
    assert.equal(Buffer.from(shop.rows[0].name).toString(), 'Herb|Leaf');
    assert.equal(Buffer.from(shop.rows[0].description).toString(), 'First\nSecond');
    assert.equal(Buffer.from(shop.rows[3].name).toString(), '???');
    assert.deepEqual(shop.rows.map(row => [row.maximum, row.stackSize]), [[20, 3], [20, 2], [20, 2], [20, 1]]);
    assert.equal(shop.rows[1].canEquip, false);
    shop.rows[0].name.fill(0);
    assert.equal(Buffer.from(f.client.copyMapDialog().shop.rows[0].name).toString(), 'Herb|Leaf');
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_SHOP_BALANCE_UNKNOWN');
    await assert.rejects(f.client.submitMapShop(1, [choice[0], choice[0]]), e => e.code === 'LEGACY_GAME_SHOP_ORDER');
    await assert.rejects(f.client.submitMapShop(1, [{ row: 0, quantity: 21 }]), e => e.code === 'LEGACY_GAME_SHOP_QUANTITY');
    offerShopBalance(f, 30);
    await f.drive(() => info()?.gold === 30);
    assert.equal(f.client.quoteMapShop(1, [{ row: 1, quantity: 1 }]).total, 1);
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_SHOP_FUNDS');
    offerShopBalance(f, 31);
    offerGameText(f, '?l)', [], Array.from({ length: 19 }, (_, i) => itemRow(8 + i, 'Test item', 1)).join('|'));
    await f.drive(() => f.client.copyMapDialog().shop.freeBagSlots === 1);
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_SHOP_SPACE');
    offerGameText(f, '?l)', [], '26||');
    await f.drive(() => f.client.copyMapDialog().shop.freeBagSlots === 2);
    const quote = f.client.quoteMapShop(1, choice);
    assert.deepEqual([quote.total, quote.requiredBagSlots, quote.lines.map(row => row.key)], [31, 2, [0, 2]]);
    assert.equal(f.writes.length, writes);
    const submitted = f.client.submitMapShop(1, choice);
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_DIALOG_STALE');
    await submitted;
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '/1I 2 3 h 3i 0 0\\\\z2\\\\z2\\\\z1 ');
    assert.equal(f.writes.length, writes + 1);
    assert.equal(info(), null);
    assert.equal(f.client.copyInventory()[26].present, false);
    open('0|Market|||');
    await f.drive(() => info()?.revision === 2);
    assert.equal(f.client.copyMapDialog().shop.gold, 31);
  } finally { f.close(); }
});
test('ordinary sale binds first quotes to live bag revisions and leaves money and slots to inbound owners', async () => {
  const f = clientFixture();
  const offers = [
    ['Large stack', 4, 40, 9, 10, 512, '', 'A stack', 4, 1],
    ['Single', 1, 41, 7, 9, 256, 'Special', '', -1, 0],
    ['Duplicate', 4, 99, 99, 10, 0, '', '', 4, 0],
    ['Equipment', 1, 42, 11, 4, 0, '', '', 1, 0],
    ['Unavailable', 1, 42, 11, 11, 0, '', '', 0, 0],
  ];
  const open = sequence => offerGameText(f, 'Q?m', [7, 0, sequence, 204], [0, 'Market', 'Sell here', ...offers.flat()].join('|'));
  const info = () => f.client.inspect().world.mapDialog;
  const choice = [{ row: 1, quantity: 1 }, { row: 0, quantity: 2 }];
  try {
    await clientEnter(f);
    offerGameText(f, '?l)', [], [itemRow(9, 'Single', 0), itemRow(10, 'Large stack', 4), itemRow(11, 'Unavailable', 1)].join('|'));
    offerShopBalance(f, 999990);
    open(18);
    await f.drive(() => info()?.shopDirection === 'sell');
    const rows = f.client.copyMapDialog().shop.rows;
    assert.deepEqual(rows.map(row => [row.row, row.slot, row.maximum]), [[0, 10, 4], [1, 9, 1], [4, 11, 0]]);
    assert.equal(Buffer.from(rows[1].alternateLabel).toString(), 'Special');
    const writes = f.writes.length;
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_SHOP_GOLD_LIMIT');
    offerShopBalance(f, 999975);
    await f.drive(() => info()?.gold === 999975);
    assert.equal(f.client.quoteMapShop(1, choice).total, 25);
    const oldRevision = f.client.copyInventory()[10].revision;
    offerGameText(f, '?l)', [], itemRow(10, 'Replacement', 4));
    await f.drive(() => f.client.copyInventory()[10].revision > oldRevision);
    assert.equal(f.client.copyMapDialog().shop.rows[0].unavailable, 'slot-changed');
    await assert.rejects(f.client.submitMapShop(1, choice), e => e.code === 'LEGACY_GAME_SHOP_SLOT_CHANGED');
    assert.equal(f.writes.length, writes);
    offerGameText(f, 'Q?m', [7, -1, 88, 204], '');
    await f.drive(() => info() === null);
    open(19);
    await f.drive(() => info()?.revision === 2);
    await f.client.submitMapShop(2, choice);
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '/1I 2 3 j 3i 0 10\\\\z2\\\\z9\\\\z1 ');
    assert.equal(f.client.copyInventory()[10].quantity, 4);
    assert.equal(f.client.copyInventory()[9].present, true);
    open(20);
    await f.drive(() => info()?.revision === 3);
    assert.equal(info().gold, 999975);
    offerGameText(f, '?l)', [], itemRow(10, 'Replacement', 2));
    offerShopBalance(f, 1000000);
    await f.drive(() => info()?.gold === 1000000);
    assert.equal(f.client.copyInventory()[10].quantity, 2);
    await f.client.replyMapDialog(3, 2);
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '/1I 2 3 k 3i 2  ');
    assert.equal(f.writes.length, writes + 2);
  } finally { f.close(); }
});
test('ordinary appraisal and repair confirm source slot lists and expose server-updated item descriptions', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const bag = () => f.client.copyInventory();
  const open = (mode, sequence, title, rows) => offerGameText(f, 'Q?m', [mode, 0, sequence, 204], [3, title, ...rows.flat()].join('|'));
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  const durability = value => 'Original item details '.repeat(14) + '\\nDurability ' + value + '/30';
  const readDescription = slot => decodeLegacyGameDescriptionText(bag()[slot].descriptionBytes, { encoding: 'ascii' });
  try {
    await clientEnter(f);
    const writes = f.writes.length;
    offerGameText(f, '?l)', [], [
      itemRow(8, 'Unknown Amulet', 0), itemRow(9, 'Worn Shield', 0, durability(2)), itemRow(10, 'Unknown Ring', 0),
    ].join('|'));
    offerShopBalance(f, 11);
    open(20, 20, 'Lab', [['Partial']]);
    await f.drive(() => bag()[9].present);
    assert.equal(info(), null);
    open(20, 21, 'Lab', [
      ['Unknown Ring', 503, 7, 10, 0, '', 'Ring'],
      ['Unknown Amulet', 504, 5, 8, 256, 'Sealed', 'Pendant\\zunknown'],
      ['Duplicate', 505, 1, 8, 0, '', ''],
      ['Equipment', 506, 1, 2, 0, '', ''],
      ['Missing', 507, 1, 11, 0, '', ''],
    ]);
    await f.drive(() => info()?.shopDirection === 'appraise');
    const appraisal = f.client.copyMapDialog().shop;
    assert.deepEqual(appraisal.messages, []);
    assert.deepEqual(appraisal.rows.map(r => [r.row, r.slot, r.unitPrice, r.maximum]), [[0, 10, 7, 1], [1, 8, 5, 1], [4, 11, 1, 0]]);
    assert.equal(Buffer.from(appraisal.rows[1].alternateLabel).toString(), 'Sealed');
    assert.equal(Buffer.from(appraisal.rows[1].description).toString(), 'Pendant|unknown');
    const reverseSelection = [{ row: 1, quantity: 1 }, { row: 0, quantity: 1 }];
    await assert.rejects(f.client.submitMapShop(1, [{ row: 0, quantity: 2 }]), e => e.code === 'LEGACY_GAME_SHOP_QUANTITY');
    await assert.rejects(f.client.submitMapShop(1, reverseSelection), e => e.code === 'LEGACY_GAME_SHOP_FUNDS');
    offerShopBalance(f, 12);
    await f.drive(() => info()?.gold === 12);
    const quote = f.client.quoteMapShop(1, reverseSelection);
    assert.deepEqual([quote.total, quote.requiredBagSlots, quote.lines.map(line => line.key)], [12, 0, [10, 8]]);
    assert.equal(f.writes.length, writes);
    await f.client.submitMapShop(1, reverseSelection);
    assert.equal(sent(), '/1I 2 3 l 3i 0 10\\\\z8 ');
    assert.equal(Buffer.from(bag()[8].nameBytes).toString(), 'Unknown Amulet');

    offerGameText(f, '?l)', [], itemRow(8, 'Appraised Amulet', 0, 'Silver\\zblue'));
    offerShopBalance(f, 8);
    const repair = [['Worn Shield', 512, 8, 9, 0, '', 'Repair the shield']];
    open(22, 22, 'Workshop', repair);
    await f.drive(() => info()?.shopDirection === 'repair');
    assert.equal(Buffer.from(bag()[8].nameBytes).toString(), 'Appraised Amulet');
    assert.equal(readDescription(8), 'Silver|blue');
    assert.throws(() => decodeLegacyGameChatText(bag()[9].descriptionBytes, { encoding: 'ascii' }), e => e.code === 'TEXT_BYTES');
    const selection = [{ row: 0, quantity: 1 }];
    assert.equal(f.client.quoteMapShop(2, selection).total, 8);
    const revision = bag()[9].revision;
    offerGameText(f, '?l)', [], itemRow(9, 'Worn Shield', 0, durability(3)));
    await f.drive(() => bag()[9].revision > revision);
    await assert.rejects(f.client.submitMapShop(2, selection), e => e.code === 'LEGACY_GAME_SHOP_SLOT_CHANGED');
    assert.equal(f.writes.length, writes + 1);
    offerGameText(f, 'Q?m', [20, -1, 88, 204], '');
    await flush();
    assert.equal(info()?.revision, 2);
    offerGameText(f, 'Q?m', [22, -1, 89, 204], '');
    await f.drive(() => info() === null);
    open(22, 23, 'Workshop', repair);
    await f.drive(() => info()?.revision === 3);
    await f.client.submitMapShop(3, selection);
    assert.equal(sent(), '/1I 2 3 n 3i 0 9 ');
    assert.match(readDescription(9), /\nDurability 3\/30$/);
    offerGameText(f, '?l)', [], itemRow(9, 'Worn Shield', 0, durability(30)));
    offerShopBalance(f, 0);
    open(22, 24, 'Workshop', []);
    await f.drive(() => info()?.revision === 4);
    assert.equal(info().gold, 0);
    assert.match(readDescription(9), /\nDurability 30\/30$/);
    bag()[9].descriptionBytes.fill(0);
    assert.match(readDescription(9), /\nDurability 30\/30$/);
    await f.client.replyMapDialog(4, 2);
    assert.equal(sent(), '/1I 2 3 o 3i 2  ');
    assert.equal(f.writes.length, writes + 3);
  } finally { f.close(); }
});
test('item exchange prices use item field 11 and only free fully spent bag stacks in slot order', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const shop = () => f.client.copyMapDialog().shop;
  const bag = () => f.client.copyInventory();
  const currencyCode = 753;
  const token = (slot, quantity, exchangeCode = currencyCode) => itemRow(slot, 'Voucher', quantity, '', { exchangeCode });
  const open = (sequence, currency, rows) => offerGameText(f, 'Q?m', [28, 0, sequence, 204],
    [3, 'Exchange', 'First note', '', 'Third note', currency, 'Voucher\\zBlue', ...rows.flat()].join('|'));
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  const offers = [
    ['Silk', 550, 2, 4, 'Woven\\ncloth'],
    ['Dye', 551, 3, 2, 'For cloth'],
    ['Spare', 552, 1, 0, 'Single'],
    ['Bulk order', 553, 1, 30, 'Up to thirty in one slot'],
  ];
  try {
    await clientEnter(f);
    const writes = f.writes.length;
    const rows = Array.from({ length: 20 }, (_, i) => itemRow(i + 8, 'Decoy', 400, '', { code: currencyCode }));
    rows[0] = token(8, 7); rows[4] = token(12, 3); rows[12] = token(20, 8);
    offerGameText(f, '?l)', [], [token(0, 5), ...rows].join('|'));
    offerShopBalance(f, '');
    open(24, 'invalid', offers);
    await f.drive(() => bag()[27].present);
    assert.equal(info(), null);
    open(25, currencyCode, offers);
    await f.drive(() => info()?.shopDirection === 'exchange');
    const snapshot = shop();
    assert.equal(snapshot.gold, null);
    assert.equal(snapshot.freeBagSlots, 0);
    assert.deepEqual([snapshot.currency.code, snapshot.currency.balance], [753, 23]);
    assert.equal(Buffer.from(snapshot.currency.label).toString(), 'Voucher|Blue');
    assert.deepEqual(snapshot.messages.map(bytes => Buffer.from(bytes).toString()), ['First note', '', 'Third note']);
    assert.deepEqual(snapshot.rows.map(row => [row.stackSize, row.maximum]), [[4, 80], [2, 40], [1, 20], [30, 600]]);
    assert.equal(Buffer.from(snapshot.rows[0].description).toString(), 'Woven\ncloth');
    snapshot.currency.label.fill(0);
    assert.equal(Buffer.from(shop().currency.label).toString(), 'Voucher|Blue');
    const one = quantity => [{ row: 0, quantity }];
    await assert.rejects(f.client.submitMapShop(1, one(2)), e => e.code === 'LEGACY_GAME_SHOP_SPACE');
    await assert.rejects(f.client.submitMapShop(1, one(12)), e => e.code === 'LEGACY_GAME_SHOP_EXCHANGE_FUNDS');
    const expensive = f.client.quoteMapShop(1, one(11));
    assert.deepEqual([expensive.total, expensive.requiredBagSlots, expensive.releasedBagSlots], [22, 3, 3]);
    const bulk = f.client.quoteMapShop(1, [{ row: 3, quantity: 21 }]);
    assert.deepEqual([bulk.total, bulk.requiredBagSlots, bulk.releasedBagSlots], [21, 1, 3]);
    const order = [{ row: 1, quantity: 2 }, { row: 0, quantity: 4 }];
    let quote = f.client.quoteMapShop(1, order);
    assert.deepEqual([quote.total, quote.requiredBagSlots, quote.releasedBagSlots], [14, 2, 2]);
    assert.deepEqual(quote.lines.map(line => [line.key, line.quantity]), [[0, 4], [1, 2]]);
    offerGameText(f, '?l)', [], token(12, 3, 754));
    await f.drive(() => shop().currency.balance === 20);
    await assert.rejects(f.client.submitMapShop(1, order), e => e.code === 'LEGACY_GAME_SHOP_SPACE');
    assert.equal(f.writes.length, writes);
    offerGameText(f, '?l)', [], token(12, 3));
    await f.drive(() => shop().currency.balance === 23);
    await f.client.submitMapShop(1, order);
    assert.equal(sent(), '/1I 2 3 p 3i 0 0\\\\z4\\\\z1\\\\z2 ');
    assert.equal(bag()[8].quantity, 7);
    assert.equal(bag()[20].quantity, 8);
    offerGameText(f, '?l)', [], [itemRow(8, 'Silk', 4), itemRow(12, 'Dye', 2), token(20, 4)].join('|'));
    open(26, currencyCode, []);
    await f.drive(() => info()?.revision === 2);
    assert.equal(shop().currency.balance, 9);
    assert.equal(Buffer.from(bag()[8].nameBytes).toString(), 'Silk');
    await f.client.replyMapDialog(2, 2);
    assert.equal(sent(), '/1I 2 3 q 3i 2  ');
    assert.equal(f.writes.length, writes + 2);
  } finally { f.close(); }
});
function offerConversion(f, sequence, { variant = 0, rate = 2, itemCode = 753, countLimit = 7, quotaLimit = 14, quotaCount = 11, name = 'Lantern\\zPaper' } = {}) {
  offerGameText(f, 'Q?m', [31, 0, sequence, 204],
    [3, 'Offering', variant, 'Choose a quantity', 'Count limit', 'Quota limit', 'Value limit',
      rate, itemCode, name, 'Folded\\nby hand', countLimit, 552, quotaLimit, quotaCount, ''].join('|'));
}
test('item conversion quota uses its one-row packet and confirms with the literal one prefix', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const shop = () => f.client.copyMapDialog().shop;
  const one = quantity => [{ row: 0, quantity }];
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  try {
    await clientEnter(f);
    const writes = f.writes.length;
    offerShopBalance(f, '');
    offerConversion(f, 24, { rate: '-1' });
    await flush();
    assert.equal(info(), null);
    offerConversion(f, 25, { itemCode: '' });
    await f.drive(() => info()?.shopDirection === 'conversion');
    const { conversion, messages, rows: [row], gold } = shop();
    assert.equal(gold, null);
    assert.deepEqual(conversion, { variant: 0, itemCode: 0, countLimit: 7, quotaLimit: 14, quotaCount: 11, held: 7 });
    assert.deepEqual(messages.map(bytes => Buffer.from(bytes).toString()), ['Choose a quantity', 'Count limit', 'Quota limit', 'Value limit']);
    assert.deepEqual([row.slot, row.maximum, row.graphicResource, row.unitPrice], [null, 3, 552, 2]);
    assert.equal(Buffer.from(row.name).toString(), 'Lantern|Paper');
    assert.equal(Buffer.from(row.description).toString(), 'Folded\nby hand');
    assert.throws(() => f.client.quoteMapShop(1, [{ row: 1, quantity: 1 }]), { code: 'LEGACY_GAME_SHOP_ORDER' });
    await assert.rejects(f.client.submitMapShop(1, one(4)), { code: 'LEGACY_GAME_SHOP_QUANTITY' });
    const quote = f.client.quoteMapShop(1, one(3));
    assert.deepEqual([quote.lines, quote.total, quote.requiredBagSlots], [[{ row: 0, key: 1, quantity: 3 }], 6, 0]);
    assert.equal(f.writes.length, writes);
    await f.client.submitMapShop(1, one(3));
    assert.equal(sent(), '/1I 2 3 p 3i 0 1\\\\z3 ');
    offerConversion(f, 26, { countLimit: 1200, quotaLimit: 2000, quotaCount: 1000, name: 'x'.repeat(29) });
    await f.drive(() => info()?.revision === 2);
    assert.equal(Buffer.from(shop().rows[0].name).toString(), '???');
    assert.equal(shop().rows[0].maximum, 999);
    assert.throws(() => f.client.quoteMapShop(2, one(1000)), { code: 'LEGACY_GAME_SHOP_QUANTITY' });
    offerGameText(f, 'Q?m', [28, -1, 26, 204], '');
    await flush();
    assert.equal(info()?.revision, 2);
    await f.client.replyMapDialog(2, 2);
    assert.equal(sent(), '/1I 2 3 q 3i 2  ');
    assert.equal(f.writes.length, writes + 2);
  } finally { f.close(); }
});
test('item conversion with a nonzero flag rechecks holdings and the pre-increment gold threshold', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const shop = () => f.client.copyMapDialog().shop;
  const one = quantity => [{ row: 0, quantity }];
  const matching = (slot, quantity) => itemRow(slot, 'Lamp', quantity, '', { exchangeCode: 753 });
  try {
    await clientEnter(f);
    const writes = f.writes.length;
    const updates = [...Array.from({ length: 19 }, (_, i) => itemRow(i + 8, 'Other', 40, '', { code: 753 })), matching(27, 1)];
    offerGameText(f, '?l)', [], [matching(0, 1), ...updates].join('|'));
    offerShopBalance(f, '');
    offerConversion(f, 27, { variant: -1, rate: 3, countLimit: 6, quotaLimit: 1, quotaCount: 4 });
    await f.drive(() => info()?.shopDirection === 'conversion');
    assert.deepEqual([shop().conversion.held, shop().gold, shop().freeBagSlots], [2, null, 0]);
    assert.throws(() => f.client.quoteMapShop(1, one(1)), { code: 'LEGACY_GAME_SHOP_BALANCE_UNKNOWN' });
    offerShopBalance(f, 7);
    await f.drive(() => shop().rows[0].maximum === 3);
    assert.equal(f.client.quoteMapShop(1, one(3)).total, 9);
    offerShopBalance(f, 6);
    await f.drive(() => shop().rows[0].maximum === 2);
    await assert.rejects(f.client.submitMapShop(1, one(3)), { code: 'LEGACY_GAME_SHOP_QUANTITY' });
    offerGameText(f, '?l)', [], [matching(0, 0), matching(27, 0)].join('|'));
    await f.drive(() => shop().conversion.held === 0);
    await assert.rejects(f.client.submitMapShop(1, one(1)), { code: 'LEGACY_GAME_SHOP_CONVERSION_ITEMS' });
    assert.equal(f.writes.length, writes);
    offerGameText(f, '?l)', [], matching(27, 1));
    offerShopBalance(f, 100);
    await f.drive(() => shop().rows[0].maximum === 4);
    await f.client.submitMapShop(1, one(4));
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '/1I 2 3 r 3i 0 1\\\\z4 ');
    assert.equal(f.client.copyInventory()[27].quantity, 1);
    offerGameText(f, '?l)', [], matching(27, 0));
    offerShopBalance(f, 0);
    offerConversion(f, 28, { variant: 1, rate: 0 });
    await f.drive(() => info()?.revision === 2);
    assert.deepEqual([shop().conversion.held, shop().gold], [0, 0]);
    offerGameText(f, '?l)', [], matching(27, 1));
    await f.drive(() => shop().conversion.held === 1);
    assert.throws(() => f.client.quoteMapShop(2, one(1)), { code: 'LEGACY_GAME_SHOP_FUNDS' });
    offerShopBalance(f, 1);
    await f.drive(() => shop().rows[0].maximum === 7);
    assert.equal(f.client.quoteMapShop(2, one(7)).total, 0);
    offerGameText(f, 'Q?m', [31, -1, 28, 204], '');
    await f.drive(() => info() === null);
    assert.equal(f.writes.length, writes + 1);
  } finally { f.close(); }
});
const escapeBoardField = value => value.replaceAll('\\', '\\y').replaceAll('|', '\\z').replaceAll(',', '\\c').replaceAll('\n', '\\n');
function offerBoard(f, mask, sequence, rows, actor = 204) {
  const content = ['Harbor Board', ...rows.flatMap(([graphic, seconds, flag, name, text]) =>
    [graphic, seconds, flag, escapeBoardField(name), escapeBoardField(text)])].join('|');
  offerGameText(f, 'Q?m', [0x15, mask, sequence, actor], escapeBoardField(content));
}
test('message board decodes two layers, preserves source slots and atomically refreshes the active page', async () => {
  const f = clientFixture();
  const current = () => f.client.copyMapDialog();
  const rows = [
    [100001, 1700000000, 0, 'Harbor|Guide', 'First, line\rNext\\line'],
    [0, 0, 0, '', ''],
    [100002, 0, -1, 'x'.repeat(17), 'x'.repeat(141)],
    [0, -1, 0, 'Notice', 'y'.repeat(140)],
  ];
  try {
    await clientEnter(f);
    const before = f.writes.length;
    offerBoard(f, 0x20, 22, rows);
    await f.drive(() => current()?.revision === 1);
    const board = current().board;
    assert.equal(Buffer.from(board.title).toString(), 'Harbor Board');
    assert.deepEqual(current().buttons, [1, 0x20]);
    assert.deepEqual(board.entries.map(row => [row.row, row.graphicResource, row.timestamp, row.canDelete, Buffer.from(row.name).toString()]), [
      [0, 100001, 1700000000, false, 'Harbor|Guide'], [2, 100002, null, true, '???'], [3, 0, null, false, 'Notice'],
    ]);
    assert.deepEqual(board.entries[0].lines.map(line => Buffer.from(line).toString()), ['First, line', 'Next\\line']);
    assert.deepEqual(board.entries[1].lines, []);
    assert.deepEqual(board.entries[2].lines.map(line => line.length), [70, 70]);
    board.title.fill(0); board.entries[0].lines[0].fill(0);
    assert.equal(Buffer.from(current().board.entries[0].lines[0]).toString(), 'First, line');
    await assert.rejects(f.client.replyMapDialog(1, 0x40, 0), { code: 'LEGACY_GAME_DIALOG_BUTTON' });
    await assert.rejects(f.client.replyMapDialog(1, 0x40, 1), { code: 'LEGACY_GAME_DIALOG_BUTTON' });
    await assert.rejects(f.client.replyMapDialog(1, 0x10), { code: 'LEGACY_GAME_DIALOG_BUTTON' });
    offerGameText(f, 'Q?m', [0x15, 0x10, 23, 205], 'Broken|100001|1');
    await flush();
    assert.equal(current().revision, 1);
    offerBoard(f, 0x10, 24, [rows[0]], 205);
    await f.drive(() => current()?.revision === 2);
    assert.equal(current().actorId, 205);
    assert.deepEqual(current().buttons, [1, 0x10]);
    await assert.rejects(f.client.replyMapDialog(1, 0x20), { code: 'LEGACY_GAME_DIALOG_STALE' });
    offerGameText(f, 'Q?m', [0x15, -1, 24, 204], '');
    await flush();
    assert.equal(current().revision, 2);
    offerGameText(f, 'Q?m', [0x15, -1, 24, 205], '');
    await f.drive(() => current() === null);
    offerBoard(f, 0, 25, []);
    await f.drive(() => current()?.revision === 3);
    assert.deepEqual(current().board.entries, []);
    f.client.dismissMapDialog(3);
    assert.equal(current(), null);
    assert.equal(f.writes.length, before);
  } finally { f.close(); }
});
test('message board sends original paging, posting and deletion actions from the current page', async () => {
  const f = clientFixture();
  const info = () => f.client.inspect().world.mapDialog;
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex');
  const rows = [[0, 0, 0, '', ''], [100002, 1700000000, 1, 'Keeper', 'Two lines\rHere']];
  try {
    await clientEnter(f);
    const before = f.writes.length;
    offerBoard(f, 0x20, 25, rows);
    await f.drive(() => info()?.revision === 1);
    await f.client.replyMapDialog(1, 0x20);
    assert.equal(sent().toString(), '/1I 2 3 p 3i w  ');
    assert.equal(info(), null);
    offerBoard(f, 0x10, 26, rows);
    await f.drive(() => info()?.revision === 2);
    await f.client.replyMapDialog(2, 0x10);
    assert.equal(sent().toString(), '/1I 2 3 q 3i g  ');
    offerBoard(f, 0, 27, rows);
    await f.drive(() => info()?.revision === 3);
    for (const value of ['', 'x'.repeat(141), 'x\ny', 'a\rb\rc']) {
      await assert.rejects(f.client.replyMapDialog(3, 1, null, Buffer.from(value)), { code: 'LEGACY_GAME_BOARD_TEXT' });
    }
    await assert.rejects(f.client.replyMapDialog(3, 1, null, Buffer.from('|'.repeat(140))), { code: 'LEGACY_GAME_DIALOG_TEXT' });
    assert.equal(f.writes.length, before + 2);
    const message = encodeLauncherProcessField('魔力|,\\\rSecond', { encoding: 'windows-936' });
    await f.client.replyMapDialog(3, 1, null, message);
    assert.deepEqual(sent(), Buffer.concat([
      Buffer.from('/1I 2 3 r 3i 1 '), Buffer.from('c4a7c1a6', 'hex'), Buffer.from('\\\\z\\\\c\\\\y\\rSecond '),
    ]));
    assert.equal(info(), null);
    offerBoard(f, 0, 28, rows);
    await f.drive(() => info()?.revision === 4);
    await f.client.replyMapDialog(4, 0x40, 1);
    assert.equal(sent().toString(), '/1I 2 3 s 3i 12 1 ');
    assert.equal(info(), null);
    assert.equal(f.writes.length, before + 4);
  } finally { f.close(); }
});
function offerTradePlain(f, text) {
  f.offer(f.frame(Buffer.from(text).toString('hex')));
}
function offerTradeOpen(f, partner) {
  const packet = Buffer.concat([Buffer.from('M6c '), encodeLegacyGameTextField(Buffer.from(partner)), Buffer.from(' 7 ')]);
  f.offer(f.frame(packet.toString('hex')));
}
function offerTradePet(f, slot, name) {
  const mask = Buffer.from(encodeLegacyGameInteger(1 << 22)).toString('ascii');
  offerGameText(f, 'FBY', [slot], mask + '|' + name);
}
test('player trade uses server candidates and original item, pet, gold, withdrawal and confirm packets', async () => {
  const f = clientFixture();
  const trade = () => f.client.copyPlayerTrade();
  const act = (action, value) => f.client.actOnPlayerTrade(action, trade()?.revision ?? null, value);
  const sent = () => Buffer.from(plain(f.writes.at(-1)), 'hex').toString();
  const tradeItem = (slot, name, quantity) => itemRow(slot, name, quantity, 'Offer details', { qualification: 1 });
  const rowRef = row => ({ slot: row.slot, revision: row.revision });
  try {
    await clientEnter(f);
    await assert.rejects(act('request'), { code: 'LEGACY_GAME_TRADE_TARGET' });
    offerGameText(f, 'H#|', [], '1|3e|2|4|4|100001|77|8|Partner||1');
    offerGameText(f, '?l)', [], [tradeItem(8, 'Silk', 2), itemRow(9, 'Bound', 1), tradeItem(10, 'Herb', 3)].join('|'));
    offerShopBalance(f, 25);
    offerTradePet(f, 2, 'Own Pet');
    await f.drive(() => f.client.copyWorldState().actors.remoteActors.some(row => row.id === 200) &&
      f.client.copyBattleState().pets.version === 1);
    await act('request');
    assert.equal(sent(), '+BQ ');
    offerGameText(f, 'LsH', [], 'First|Partner\\zNorth|Tail without delimiter');
    await f.drive(() => trade()?.kind === 'candidates');
    assert.deepEqual(trade().candidates.map(row => [row.index, Buffer.from(row.nameBytes).toString()]), [[0, 'First'], [1, 'Partner|North']]);
    await assert.rejects(act('select', 2), { code: 'LEGACY_GAME_TRADE_SELECTION' });
    await act('select', 1);
    assert.equal(sent(), '+i@ 1 ');
    assert.equal(Buffer.from(trade().partner).toString(), 'Partner|North');
    assert.deepEqual(trade().availableItems.map(row => row.slot), [8, 10]);
    const initial = trade(), item = slot => rowRef(initial.availableItems.find(row => row.slot === slot));
    const choices = { items: [item(10), item(8)], pets: [rowRef(initial.availablePets[0])], gold: 19 };
    await assert.rejects(act('publish', { ...choices, gold: 26 }), { code: 'LEGACY_GAME_TRADE_GOLD' });
    await assert.rejects(act('publish', { ...choices, items: [rowRef(f.client.copyInventory()[9])] }), { code: 'LEGACY_GAME_TRADE_SELECTION' });
    await assert.rejects(act('publish', { ...choices, items: [item(8), item(8)] }), { code: 'LEGACY_GAME_TRADE_SELECTION' });
    await act('publish', choices);
    assert.equal(sent(), '+oj 10|0|8|1 2|0 j ');
    assert.equal(trade().localPhase, 1);
    assert.deepEqual([trade().gold, f.client.copyInventory()[10].quantity, f.client.copyBattleState().pets.count], [25, 3, 1]);
    await assert.rejects(act('confirm'), { code: 'LEGACY_GAME_TRADE_PHASE' });

    offerGameText(f, 'Mlt', [], [itemRow(1, 'Copper', 2, 'Notes\\nHere'), itemRow(4, 'Badge', 1)].join('|'));
    offerGameText(f, 'N)u', [3], ['Peer Pet', 100003, 2, 17, 20, 30, 40, 50, 60, 70, 80, 90, 'Pet Nick', ...Array(10).fill(10)].join('|'));
    offerGameText(f, 'N4(', [3], 'Guard|Bite|');
    offerTradePlain(f, 'Mv@ 7 ');
    offerTradePlain(f, 'MP? ');
    await f.drive(() => trade()?.remotePhase === 1);
    assert.deepEqual(trade().remoteItems.map(row => [row.row, row.quantity]), [[1, 2], [4, 1]]);
    assert.equal(Buffer.from(trade().remoteItems[0].descriptionBytes).toString(), 'Notes\nHere');
    assert.deepEqual(trade().remotePets[0].skills.map(bytes => Buffer.from(bytes).toString()), ['Guard', 'Bite']);
    assert.equal(trade().remotePets[0].values[3], 17);
    assert.equal(trade().remoteGold, 7);
    const offered = trade().revision;
    offerGameText(f, 'Mlt', [], itemRow(20, 'Outside offer', 1));
    await flush();
    assert.equal(trade().revision, offered);
    f.tick += 600;
    await act('confirm');
    assert.equal(sent(), ',ua 1 ');
    offerTradePlain(f, 'Ofl 1 ');
    await f.drive(() => trade()?.remotePhase === 2);
    assert.equal(trade().localPhase, 2);
    offerTradePlain(f, 'O#3 ');
    await f.drive(() => trade()?.remotePhase === 0);
    assert.deepEqual([trade().localPhase, trade().remoteGold, trade().remoteItems.length, trade().remotePets.length], [1, 0, 0, 0]);
    offerGameText(f, '?l)', [], tradeItem(10, 'New Herb', 3));
    offerTradePlain(f, 'MP? ');
    await f.drive(() => trade()?.remotePhase === 1 && trade().offerStale);
    await assert.rejects(act('confirm'), { code: 'LEGACY_GAME_TRADE_OFFER_STALE' });
    await act('withdraw');
    assert.equal(sent(), ',3K ');
    await assert.rejects(act('publish', choices), { code: 'LEGACY_GAME_TRADE_SELECTION' });
    await act('publish', { items: [], pets: [], gold: 0 });
    assert.equal(sent(), '+oj   0 ');
    f.tick += 600;
    await act('confirm');
    assert.equal(sent(), ',ua 1 ');
    const writes = f.writes.length;
    offerTradePlain(f, 'Ofl 2 ');
    await f.drive(() => trade()?.kind === 'ended');
    assert.equal(trade().resultCode, 2);
    assert.equal(f.client.copyInventory()[8].quantity, 2);
    assert.equal(f.writes.length, writes);
    offerGameText(f, '?l)', [], tradeItem(8, 'New Badge', 1));
    offerShopBalance(f, 20);
    await f.drive(() => f.client.copyInventory()[8].quantity === 1);
    assert.equal(Buffer.from(f.client.copyInventory()[8].nameBytes).toString(), 'New Badge');
  } finally { f.close(); }
});
test('incoming player trade replaces the ordinary modal, detects changed pets and uses the native exit packet', async () => {
  const f = clientFixture();
  const trade = () => f.client.copyPlayerTrade();
  const act = (action, value) => f.client.actOnPlayerTrade(action, trade()?.revision ?? null, value);
  try {
    await clientEnter(f);
    offerGameText(f, 'Q?m', [0, 1, 12, 204], 'Ordinary dialog');
    await f.drive(() => f.client.copyMapDialog() !== null);
    offerTradePet(f, 1, 'First Pet');
    offerTradeOpen(f, 'Partner\\zWest');
    await f.drive(() => trade()?.kind === 'open');
    assert.equal(f.client.copyMapDialog(), null);
    assert.equal(Buffer.from(trade().partner).toString(), 'Partner|West');
    const { slot, revision } = trade().availablePets[0];
    await act('publish', { items: [], pets: [{ slot, revision }], gold: 0 });
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), '+oj  1|0 0 ');
    offerTradePet(f, 1, 'Changed Pet');
    offerTradePlain(f, 'MP? ');
    await f.drive(() => trade()?.offerStale && trade().remotePhase === 1);
    await assert.rejects(act('confirm'), { code: 'LEGACY_GAME_TRADE_OFFER_STALE' });
    await act('close');
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), ',ua 0 ');
    assert.equal(trade(), null);
    offerTradePlain(f, 'Mv@ 7 ');
    await flush();
    assert.equal(trade(), null);
    offerTradePlain(f, '>HY 1 0 ');
    await f.drive(() => f.client.inspect().state === 'battle-pending');
    const before = f.writes.length;
    offerTradeOpen(f, 'Incoming during battle');
    await f.drive(() => f.writes.length === before + 1);
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), ',ua 0 ');
    assert.equal(trade(), null);
  } finally { f.close(); }
});
test('scene transition invalidates old runtime/CUT work immediately and preserves explicit pause across re-preparation', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f); const runtime = f.client.runtime(); f.client.pause();
    f.files.controls.hold = 'bin/PUK2/cutdat/23.cut'; f.offer(f.frame(scene.protocol.beforePlainHex[1])); await f.drive(() => f.files.pending.length === 1);
    assert.equal(runtime.inspect().state, 'closed'); assert.equal(f.client.inspect().sceneLoading, true); assert.equal(f.client.inspect().paused, true);
    f.files.pending.shift()(); await flush(); for (const plain of scene.protocol.beforePlainHex.filter((_, i) => i !== 1)) { f.offer(f.frame(plain)); await flush(); }
    await f.drive(() => f.client.inspect().state === 'paused'); assert.equal(f.client.inspect().sceneRevision, 2); assert.equal(f.client.inspect().runtimeRevision, 2); f.client.resume(); assert.equal(f.client.inspect().state, 'playing');
  } finally { f.close(); }
});
test('close during source CUT loading settles immediately and discards a late read without restarting scene or input', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f); f.files.controls.hold = 'bin/PUK2/cutdat/23.cut'; f.offer(f.frame(scene.protocol.beforePlainHex[1])); await f.drive(() => f.files.pending.length === 1);
    f.client.close(); const closed = JSON.stringify(f.client.inspect()); assert.equal((await f.client.done).state, 'closed'); f.files.pending.shift()(); await flush();
    assert.equal(JSON.stringify(f.client.inspect()), closed); assert.equal(f.stats.closeCalls, 1); assert.equal(f.timers.size, 0);
  } finally { f.close(); }
});
test('observer close at material readiness cannot leak runtime or restart after subsequent callbacks', async () => {
  let client; const f = clientFixture({ onState(s) { if (s.state === 'playing') client.close(); } }); client = f.client;
  try {
    await clientEnter(f, false); for (const plain of scene.protocol.beforePlainHex) { f.offer(f.frame(plain)); await flush(); }
    await f.drive(() => client.inspect().state === 'closed'); const final = JSON.stringify(client.inspect()); for (const t of f.allTimers) t.fn(); await flush();
    assert.equal(JSON.stringify(client.inspect()), final); assert.equal(client.inspect().runtime, null); assert.equal(f.stats.closeCalls, 1);
  } finally { f.close(); }
});
test('a failing pause invalidation hook closes every actual owner and does not leave active input behind', async () => {
  let armed = false; const f = clientFixture({ onInvalidate() { if (armed) throw Error('private callback detail'); } });
  try { await clientEnter(f); const runtime = f.client.runtime(); armed = true; const result = f.client.pause(); assert.equal(result.state, 'failed'); assert.equal(result.errorCode, 'LEGACY_CLIENT_FAILED'); assert.equal(result.world.state, 'closed'); assert.equal(result.library.state, 'closed'); assert.equal(runtime.inspect().state, 'closed'); assert.equal(f.stats.closeCalls, 1); assert.equal(f.timers.size, 0); }
  finally { f.close(); }
});
test('an invalid factory result is never adopted and cannot prevent resource/world disposal', async () => {
  const f = clientFixture({ invalidSession: true });
  try { const result = await f.client.start(); assert.equal(result.state, 'failed'); assert.equal(result.errorCode, 'LEGACY_CLIENT_SESSION'); assert.equal(result.session, null); assert.equal(result.world.state, 'closed'); assert.equal(result.library.state, 'closed'); assert.equal(f.stats.opens, 0); }
  finally { f.close(); }
});
test('automatic-clock idle scene matches240 independently composed source updates, including animation phases after the first frame', async () => {
  const reference = JSON.parse(readFileSync(new URL('../../analysis/game-browser-owner-v1/original-idle-vectors.json', import.meta.url))), f = clientFixture();
  try {
    await clientEnter(f); const runtime = f.client.runtime(); runtime.resetClock(1000); assert.equal(reference.frames.length, 240);
    for (const row of reference.frames) { const result = runtime.pump({ ...f.client.readFrame(), tick: row.tick }); assert.equal(result.error, null); assert.equal(result.updates, 1); assert.equal(result.requests.length, 0); const pixels = await f.client.library().startRender(result.frame.sceneLayer.drawPlan).done; assert.equal(sha(pixels.rgba), row.rgbaSha256, 'idle source update ' + row.sourceUpdate); }
  } finally { f.close(); }
});
test('losing local actor readiness stops the old runtime immediately and a real later actor record can prepare a fresh one', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f); const runtime = f.client.runtime(), invalidations = f.stats.invalidations;
    f.offer(f.frame(Buffer.from('IZL 1C ', 'ascii').toString('hex'))); await flush();
    assert.equal(f.client.inspect().state, 'preparing-scene'); assert.equal(runtime.inspect().state, 'closed'); assert.equal(f.stats.invalidations, invalidations + 1); assert.equal(f.client.inspect().runtime, null);
    f.offer(f.frame(scene.protocol.beforePlainHex[3])); await flush(); await f.drive(() => f.client.inspect().state === 'playing'); assert.equal(f.client.inspect().runtimeRevision, 2); assert.equal(f.client.inspect().session.io.closeCalls, 0);
  } finally { f.close(); }
});

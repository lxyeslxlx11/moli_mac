import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as api from '../../shared/index.mjs';
import { WebSocket } from '../../adapters/node/vendor/ws/wrapper.mjs';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { createBrowserLegacyGameSession } from '../legacy-game-browser.mjs';
import { createLegacyGameServerReturnCanvas } from '../legacy-game-server-return-canvas.mjs';
import { composeLegacyGameCityEntryFade, createLegacyGameCityEntryFade } from '../../shared/legacy-game-battle-exit-fade.mjs';
import { createLegacyGameCityReturn } from '../../shared/legacy-game-city-return.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
import { clientOriginalPeer, clientWait } from './helpers/legacy-game-client-tcp-fixture.mjs';
import { credentials } from './helpers/legacy-game-session-fixture.mjs';

const image = (width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) });
const sha = data => createHash('sha256').update(data).digest('hex');

test('city entry type15 restores all 49 source frames and all 480 rows', () => {
  const reference = JSON.parse(readFileSync(new URL('../../analysis/game-legacy-city-return-v1/original-vectors.json', import.meta.url)));
  const captured = { width: 640, height: 480, rgba: new Uint8Array(640 * 480 * 4) };
  for (let y = 0, at = 0; y < 480; y++) for (let x = 0; x < 640; x++, at += 4) {
    captured.rgba[at] = (x * 3 + y * 7) & 255;
    captured.rgba[at + 1] = (x * 11 + y * 5) & 255;
    captured.rgba[at + 2] = (x ^ y) & 255;
    captured.rgba[at + 3] = 255;
  }
  assert.equal(sha(captured.rgba), reference.capture_sha256);
  const fade = createLegacyGameCityEntryFade(), rows = Buffer.alloc(960);
  try {
    for (const expected of reference.frames) {
      const frame = fade.step();
      assert.deepEqual([frame.calls, frame.counter, frame.complete], [expected.call, expected.counter, expected.complete]);
      frame.rowPositions.forEach((y, row) => rows.writeInt16LE(y, row * 2));
      assert.equal(sha(rows), expected.rows_sha256);
      assert.equal(sha(composeLegacyGameCityEntryFade(captured, frame.rowPositions, 640, 480).rgba), expected.rgba_sha256);
    }
    assert.equal(reference.frames.at(-1).rgba_sha256, reference.capture_sha256);
    assert.throws(() => fade.step(), { code: 'LEGACY_CITY_ENTRY_FADE_COMPLETE' });
  } finally { fade.close(); }
});

test('a city return boundary cancels a superseded scene render before presentation', async () => {
  let resolve, cancellations = 0;
  const output = new Uint8Array(640 * 480 * 4).fill(7);
  const transition = createLegacyGameCityReturn(null, () => ({
    done: new Promise(result => { resolve = result; }),
    cancel() { cancellations++; },
  }));
  try {
    transition.begin('scene');
    for (let i = 0; i < 5; i++) {
      const frame = await transition.advance(i);
      transition.present(frame, rgba => assert.equal(rgba, null));
    }
    const pending = transition.advance(5);
    assert.equal(typeof resolve, 'function');
    transition.begin('boundary');
    resolve({ rgba: output });
    assert.equal(await pending, null);
    assert.equal(cancellations, 1);
    assert.ok(output.every(byte => byte === 0));
    assert.equal(transition.inspect().route, 'boundary');
  } finally { transition.close(); }
});

test('city retarget keeps the last painted surface and counts a blank but available type14', async () => {
  const previous = new Uint8Array(640 * 480 * 4).fill(7);
  const transition = createLegacyGameCityReturn(previous, () => null, 'battle');
  try {
    transition.begin('battle');
    transition.begin('boundary');
    transition.begin('scene');
    let frame = await transition.advance(1);
    transition.present(frame, rgba => assert.equal(rgba[640 * 4], 7));
    transition.begin('boundary');
    assert.equal(await transition.advance(2), null);
    frame = await transition.advance(3);
    transition.present(frame, rgba => assert.equal(rgba, null));
    transition.begin('scene');
    assert.equal(transition.inspect().phase, 'leaving');
    for (let step = 1; step <= 50; step++) {
      frame = await transition.advance(3 + step);
      assert.equal(frame.battleBoundary, false);
      transition.present(frame, rgba => assert.equal(rgba, null));
    }
    assert.deepEqual([transition.inspect().leftFrames, transition.inspect().phase], [50, 'waiting-map']);
    assert.ok(previous.every(byte => byte === 0));
  } finally { transition.close(); }
});

test('server return presents all 50 original type14 frames from the latest committed image', () => {
  const reference = JSON.parse(readFileSync(new URL('../../analysis/game-battle-exit-v1/original-vectors.json', import.meta.url)));
  const expected = reference.modes.find(row => row.type === 14).frames;
  const old = image(640, 480), captured = image(640, 480), output = image(640, 480);
  old.data.fill(6);
  for (let y = 0, at = 0; y < 480; y++) for (let x = 0; x < 640; x++, at += 4) {
    captured.data[at] = (x * 3 + y * 7) & 255;
    captured.data[at + 1] = (x * 11 + y * 5) & 255;
    captured.data[at + 2] = (x ^ y) & 255;
    captured.data[at + 3] = 255;
  }
  assert.equal(sha(captured.data), reference.captureSha256);
  const written = [], jobs = [];
  let tick = 0xfffffff0, elapsed = 0, ready = 0;
  const canvas = { width: 640, height: 480, getContext: () => ({ createImageData: () => output,
    putImageData(frame, x, y) { assert.deepEqual([frame.width, frame.height, x, y], [640, 480, 0, 0]); written.push(sha(frame.data)); },
  }) };
  const transition = createLegacyGameServerReturnCanvas({ canvas, clock: () => tick,
    schedule(fn, delay) { jobs.push({ fn, delay }); return jobs.at(-1); },
    cancel() { assert.fail('completed transitions do not leave scheduled work'); }, onReady() { ready++; },
  });
  try {
    transition.remember(old); transition.remember(captured);
    assert.ok(old.data.every(value => value === 0));
    transition.start(); transition.start();
    assert.deepEqual([written.length, jobs.length, ready], [0, 1, 0]);
    for (const frame of expected) {
      const job = jobs.shift();
      tick = (tick + job.delay) >>> 0;
      elapsed += job.delay;
      job.fn(); job.fn();
      assert.equal(written.length, frame.call);
      assert.equal(written.at(-1), frame.rgbaSha256);
    }
    assert.deepEqual(transition.inspect(), { state: 'complete', frames: 50 });
    assert.deepEqual([jobs.length, ready, elapsed], [0, 1, 834]);
    assert.ok(captured.data.every(value => value === 0));
    assert.ok(output.data.every(value => value === 0));
  } finally { transition.close(); }
});

test('server return releases captures on close and permits confirmation without a matching image', () => {
  const captured = image(640, 480);
  captured.data.fill(7);
  let pending, cancelled = 0;
  const canvas = { width: 640, height: 480, getContext: () => ({ createImageData: image, putImageData() { assert.fail('stale frame'); } }) };
  const ports = { canvas, clock: () => 0, schedule(fn) { pending = fn; return fn; },
    cancel(token) { assert.equal(token, pending); cancelled++; }, onReady() { assert.fail('no completed frame'); } };
  const transition = createLegacyGameServerReturnCanvas(ports);
  transition.remember(captured); transition.start(); transition.close(); transition.close();
  pending();
  assert.equal(cancelled, 1);
  assert.ok(captured.data.every(value => value === 0));
  assert.deepEqual(transition.inspect(), { state: 'closed', frames: 0 });
  const other = createLegacyGameServerReturnCanvas(ports);
  other.remember(image(320, 240)); other.start();
  assert.deepEqual(other.inspect(), { state: 'unavailable', frames: 0 });
  other.close();
});

test('actual browser transport preserves second endpoint ordinal with zero connections to first target', { timeout: 20000 }, async () => {
  let wrongConnections = 0; const trap = createServer(socket => { wrongConnections++; socket.destroy(); }); trap.listen(0, '127.0.0.1'); await once(trap, 'listening');
  const peer = await clientOriginalPeer('cancel'), endpoints = [{ address: '127.0.0.1', port: trap.address().port }, { address: '127.0.0.1', port: peer.port }];
  const bridge = await createLauncherLoopbackServer({ sourceProfile: 'legacy', endpoints, gameCode: 2, label: 'Original two-target ordinal regression' }), runtime = await fetch(bridge.origin + '/runtime.json').then(r => r.json());
  class BrowserSocket extends WebSocket { constructor(url, protocol) { super(url, protocol, { origin: bridge.origin }); } }
  const world = api.createLegacyGameWorldProtocol(), graphics = contentGraphics(api, 4), session = createBrowserLegacyGameSession({ sourceProfile: 'legacy-se6000-37c4', world, ...credentials(), origin: bridge.origin, token: runtime.token,
    endpoint: endpoints[1], endpoints, pollMilliseconds: 1, WebSocket: BrowserSocket, postLogin: { graphics } });
  try {
    assert.equal((await session.start()).state, 'ready'); await session.charactersReady; assert.equal((await session.beginVersionUpgrade()).characters.state, 'upgrade-success'); session.acknowledgeVersionUpgrade();
    await clientWait(() => session.inspect().characters.state === 'choosing'); session.changeCharacterAppearance(0, 4); const entry = session.enterCharacter(0); await clientWait(() => session.inspect().io.writes === 5); session.close();
    assert.equal((await entry).sourceCharacterEntered, false); assert.equal((await session.done).io.closeCalls, 1); assert.equal(wrongConnections, 0);
    const receipt = await peer.receipt(); assert.equal(receipt.authentication_verified, true); assert.equal(receipt.total_client_requests, 5); assert.equal(receipt.selected_slot, 0); assert.equal(world.inspect().state, 'open');
  } finally { session.close(); world.close(); graphics.close(); await bridge.close(); await peer.close(); await new Promise(resolve => trap.close(resolve)); }
});

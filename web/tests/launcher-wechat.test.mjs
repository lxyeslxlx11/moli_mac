import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWeChatLauncherTransport, createWeChatLauncherSession } from '../../adapters/wechat/launcher.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { fakeWeChat, originalWeChatPeer } from './helpers/wechat-tcp-fixture.mjs';

const endpoint = { address: 'fixture.invalid', port: 12345 };
function open(fixture, options) {
  const port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [endpoint] });
  const ready = port.openStream(endpoint, options); fixture.sockets[0].emit('Connect'); return ready;
}
function input(wx) { return { wx, endpoints: [endpoint], firstEndpointOrdinal: 0, requestCounter: 7,
  gameCode: 11, usernameBytes: Uint8Array.of(65), passwordBytes: Uint8Array.of(66) }; }

test('WeChat transport rejects unsupported targets before native socket creation', () => {
  for (const entry of [{ address: '127.0.0.1', port: 12345 }, { address: 'localhost', port: 12345 },
    { address: '8.8.8.8', port: 12345 }, { address: '10.00.0.1', port: 12345 }, { address: '10.0.0.255', port: 12345 },
    { address: 'bad/name', port: 12345 }, { address: '::1', port: 12345 },
    ...[80, 3306, 8000, 8100, 8443].map(port => ({ address: 'fixture.invalid', port }))]) {
    const fixture = fakeWeChat();
    assert.throws(() => createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [entry] }));
    assert.equal(fixture.stats.created, 0);
  }
  const fixture = fakeWeChat(), port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [endpoint] });
  assert.throws(() => port.openStream({ ...endpoint, port: 12346 }), error => error.code === 'STREAM_DENIED');
  assert.equal(fixture.stats.created, 0);
});

test('WeChat transport snapshots allowlist and opens only after Connect event', async () => {
  const fixture = fakeWeChat(), selected = { ...endpoint }, allowed = [selected];
  const port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: allowed });
  selected.port = 12346; allowed.length = 0;
  let completed = false; const ready = port.openStream(endpoint).then(value => { completed = true; return value; });
  await Promise.resolve(); assert.equal(completed, false);
  fixture.sockets[0].emit('Connect'); const stream = await ready;
  assert.deepEqual(fixture.sockets[0].options, { ...endpoint, timeout: 2000 });
  stream.close(); assert.equal(fixture.sockets[0].listenerCount(), 0); assert.equal(fixture.stats.closed, 1);
});

test('WeChat writes retain an owned native buffer until close; completion means acceptance only', async () => {
  const fixture = fakeWeChat(), stream = await open(fixture), bytes = Uint8Array.of(1,2,3);
  await stream.write(bytes); bytes.fill(9);
  assert.deepEqual(new Uint8Array(fixture.sockets[0].writes[0]), Uint8Array.of(1,2,3));
  stream.close(); assert.deepEqual(new Uint8Array(fixture.sockets[0].writes[0]), Uint8Array.of(0,0,0));
  await assert.rejects(stream.write(bytes), error => error.code === 'STREAM_CLOSED');
});

test('WeChat incoming native buffers are copied, split and drained before remote EOF', async () => {
  const fixture = fakeWeChat(), stream = await open(fixture), incoming = new Uint8Array(65539); incoming.fill(7);
  fixture.sockets[0].emit('Message', { message: incoming.buffer }); incoming.fill(0);
  fixture.sockets[0].emit('Close');
  const a = await stream.read(), b = await stream.read();
  assert.equal(a.length, 65536); assert.equal(b.length, 3); assert.equal(a[0], 7); assert.equal(b[2], 7);
  assert.equal(await stream.read(), null); assert.equal(fixture.sockets[0].listenerCount(), 0);
});

test('WeChat read is exclusive; cancel rejects a pending read and removes every listener', async () => {
  const fixture = fakeWeChat(), controller = createWeChatAbortController();
  const stream = await open(fixture, { signal: controller.signal });
  const read = stream.read(); await assert.rejects(stream.read(), error => error.code === 'STREAM_BUSY');
  controller.abort(); await assert.rejects(read, error => error.code === 'STREAM_ABORTED');
  assert.equal(fixture.sockets[0].listenerCount(), 0); assert.equal(fixture.stats.closed, 1);
  fixture.sockets[0].emit('Message', { message: Uint8Array.of(1).buffer });
  await assert.rejects(stream.read(), error => error.code === 'STREAM_ABORTED');
});

test('WeChat cancellation closes a pending connection; late Connect cannot reopen it', async () => {
  const fixture = fakeWeChat(), controller = createWeChatAbortController();
  const port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [endpoint] });
  const pending = port.openStream(endpoint, { signal: controller.signal }); controller.abort();
  await assert.rejects(pending, error => error.code === 'STREAM_ABORTED');
  fixture.sockets[0].emit('Connect'); assert.equal(fixture.stats.closed, 1); assert.equal(fixture.sockets[0].listenerCount(), 0);
});

test('WeChat receive budget and invalid native payload terminate safely', async () => {
  for (const message of [new ArrayBuffer(4*1024*1024 + 1), 'not bytes', new SharedArrayBuffer(1)]) {
    const fixture = fakeWeChat(), stream = await open(fixture);
    fixture.sockets[0].emit('Message', { message });
    await assert.rejects(stream.read(), error => error.code === 'STREAM_READ');
    assert.equal(fixture.stats.closed, 1);
  }
});

test('WeChat errors before/after open and write exceptions are sanitized', async () => {
  const fixture = fakeWeChat(), port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [endpoint] });
  const pending = port.openStream(endpoint); fixture.sockets[0].emit('Error', { errMsg: 'private text' });
  await assert.rejects(pending, error => error.code === 'STREAM_CONNECT' && !error.message.includes('private'));
  const other = fakeWeChat(), stream = await open(other);
  other.sockets[0].write = () => { throw new Error('private write'); };
  await assert.rejects(stream.write(Uint8Array.of(1)), error => error.code === 'STREAM_WRITE' && !error.message.includes('private'));
  assert.equal(other.stats.closed, 1);
});

test('WeChat factory requires platform capabilities and rejects caller crypto/profile substitutions', () => {
  const fixture = fakeWeChat();
  for (const name of ['getUserCryptoManager', 'createTCPSocket']) {
    const wx = { ...fixture.wx, [name]: undefined };
    assert.throws(() => createWeChatLauncherSession(input(wx)));
  }
  for (const extra of [{ randomBytes: () => new Uint8Array(20) }, { handshakeProfile: 'generic' }]) {
    assert.throws(() => createWeChatLauncherSession({ ...input(fixture.wx), ...extra }), error => error.code === 'SESSION_INPUT');
  }
});

test('WeChat local clock never moves backwards when the wall clock changes', () => {
  let wall = 1000;
  const clock = createWeChatDeadlineClock({ wallNow: () => wall });
  wall = 1050; assert.equal(clock.now(), 50);
  wall = 500; assert.equal(clock.now(), 50);
  wall = 1060; assert.equal(clock.now(), 60);
});

test('WeChat deadline timer forces its elapsed floor even after a backwards wall-clock jump', () => {
  let wall = 1000, callback, fired = false;
  const clock = createWeChatDeadlineClock({ wallNow: () => wall, setTimer(fn) { callback = fn; } });
  clock.setTimer(() => { fired = true; }, 10000);
  wall = 500; callback(); assert.equal(fired, true); assert.equal(clock.now(), 10000);
});

test('WeChat cleared deadline ignores a late native timer callback', () => {
  let callback, calls = 0, cleared = 0;
  const clock = createWeChatDeadlineClock({ wallNow: () => 1000,
    setTimer(fn) { callback = fn; return 7; }, clearTimer(id) { assert.equal(id, 7); cleared++; } });
  const token = clock.setTimer(() => calls++, 10000); clock.clearTimer(token); callback();
  assert.equal(cleared, 1); assert.equal(calls, 0); assert.equal(clock.now(), 0);
});

test('WeChat public session cancellation closes the injected native port without a DOM signal', async () => {
  const fixture = fakeWeChat(), session = createWeChatLauncherSession(input(fixture.wx));
  const pending = session.start(); await Promise.resolve();
  session.cancel(); const result = await pending;
  assert.equal(result.snapshot.state, 'cancelled'); assert.equal(result.snapshot.authentication, 'unverified');
  assert.equal(fixture.stats.created, fixture.stats.closed);
  assert.throws(() => session.start({ signal: {} }), error => error.code === 'SESSION_INPUT');
});

test('WeChat CSPRNG failure after valid source challenge is fail-closed and sanitized', async () => {
  const fixture = fakeWeChat({ entropyFailure: true }), session = createWeChatLauncherSession(input(fixture.wx));
  const pending = session.start(); await Promise.resolve(); fixture.sockets[0].emit('Connect');
  const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-channel-v1/original-vectors.json', import.meta.url)));
  fixture.sockets[0].emit('Message', { message: Uint8Array.from(Buffer.from(vectors.valid[0].challenge_hex, 'hex')).buffer });
  const result = await pending;
  assert.equal(result.snapshot.state, 'failed'); assert.equal(result.error.code, 'SESSION_RANDOM');
  assert.equal(fixture.stats.entropyRequests, 1); assert.equal(fixture.stats.closed, 1);
  assert.doesNotMatch(JSON.stringify(result), /private platform/);
});

for (const scenario of ['profiles','wrong-group']) test(`WeChat entry exchanges with independent original Python peer: ${scenario}`, async () => {
  const peer = await originalWeChatPeer(scenario), fixture = fakeWeChat({ native: true, loopbackPort: peer.port });
  const session = createWeChatLauncherSession({ ...input(fixture.wx), requestCounter: 0,
    usernameBytes: new TextEncoder().encode('SyntheticU1'), passwordBytes: new TextEncoder().encode('SyntheticP1') });
  try {
    const result = await session.start(), oracle = await peer.done;
    assert.equal(oracle.passed, true); assert.equal(fixture.stats.created, 1); assert.equal(fixture.stats.closed, 1);
    assert.equal(fixture.sockets[0].listenerCount(), 0); assert.equal(result.snapshot.authentication, 'unverified');
    if (scenario === 'profiles') {
      assert.equal(result.snapshot.state, 'profiles'); assert.equal(oracle.request_verified, true);
      assert.equal(result.snapshot.io.writesCompleted, 3); assert.equal(fixture.stats.entropyRequests, 1);
      const choices = session.getChoices(); assert.ok(choices);
      assert.throws(() => session.selectProfile(0), error => error.code === 'PROFILE_RESTRICTED');
      const allowed = choices.rows.find(row => row.selectionGate.passes); assert.ok(allowed);
      const selected = session.selectProfile(allowed.displayOrdinal); assert.equal(selected.snapshot.state, 'selected');
    } else { assert.equal(result.snapshot.state, 'failed'); assert.equal(fixture.stats.entropyRequests, 0); }
  } finally { session.cancel(); await peer.close(); }
});

test('WeChat close after remote EOF discards remaining queued data and stays closed', async () => {
  const fixture = fakeWeChat(), stream = await open(fixture);
  fixture.sockets[0].emit('Message', { message: Uint8Array.of(7).buffer }); fixture.sockets[0].emit('Close');
  stream.close(); await assert.rejects(stream.read(), error => error.code === 'STREAM_CLOSED');
});

test('WeChat retained outbound and native-message counts have hard budgets', async () => {
  const fixture = fakeWeChat(), stream = await open(fixture), chunk = new Uint8Array(65536);
  for (let index = 0; index < 64; index++) await stream.write(chunk);
  await assert.rejects(stream.write(Uint8Array.of(1)), error => error.code === 'STREAM_WRITE');
  assert.equal(fixture.sockets[0].writes.length, 64); assert.equal(fixture.stats.closed, 1);
  const other = fakeWeChat(), incoming = await open(other);
  for (let index = 0; index < 4097; index++) other.sockets[0].emit('Message', { message: new ArrayBuffer(0) });
  await assert.rejects(incoming.read(), error => error.code === 'STREAM_READ');
});

test('WeChat incomplete native event API closes all partially registered listeners', async () => {
  const fixture = fakeWeChat(), original = fixture.wx.createTCPSocket;
  fixture.wx.createTCPSocket = () => { const socket = original(); delete socket.offMessage; return socket; };
  const port = createWeChatLauncherTransport({ wx: fixture.wx, allowedEndpoints: [endpoint] });
  await assert.rejects(port.openStream(endpoint), error => error.code === 'STREAM_CONNECT');
  assert.equal(fixture.stats.closed, 1); assert.equal(fixture.sockets[0].listenerCount(), 0);
});


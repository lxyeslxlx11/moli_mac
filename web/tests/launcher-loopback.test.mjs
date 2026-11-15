import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { request } from 'node:http';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { WebSocket } from '../../adapters/node/vendor/ws/wrapper.mjs';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { createBrowserGameTransport, createBrowserLauncherTransport } from '../launcher-websocket.mjs';
import { createLauncherSession } from '../launcher-session.mjs';
import { encodeLauncherASCII } from '../launcher-ascii.mjs';
import { startOriginalPeer } from '../../analysis/launcher-v17/peer-helper.mjs';

const vectors = JSON.parse(await readFile(new URL('../../analysis/launcher-v9/original-flow-vectors.json', import.meta.url))).flows;
const bytes = hex => new Uint8Array(Buffer.from(hex, 'hex'));
async function bridge(endpoint = { address: '127.0.0.1', port: 9 }) {
  return createLauncherLoopbackServer({ endpoints: [endpoint], gameCode: 0 });
}
async function runtime(server) { return (await fetch(server.origin + '/runtime.json')).json(); }
function browserSocket(origin) {
  return class extends WebSocket { constructor(url, protocol) { super(url, protocol, { origin }); } };
}
async function localPeer(handler) {
  const peers = new Set();
  let accepted;
  const acceptance = new Promise(done => { accepted = done; });
  const server = createServer(socket => {
    peers.add(socket); socket.on('error', () => {}); socket.on('close', () => peers.delete(socket));
    accepted(socket); handler(socket);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  return { endpoint: { address: '127.0.0.1', port: server.address().port }, acceptance,
    async close() { for (const socket of peers) socket.destroy(); await new Promise(done => server.close(done)); } };
}
async function raw(server, headers = {}, path = '/stream', protocol = 'moli-launcher-v1') {
  return new Promise(resolve => {
    const ws = new WebSocket(server.origin.replace('http:', 'ws:') + path, protocol,
      { headers: { Origin: server.origin, ...headers } });
    ws.on('error', () => {});
    ws.on('unexpected-response', (_request, response) => { const status = response.statusCode; response.resume(); ws.terminate(); resolve({ denied: status }); });
    ws.once('open', () => resolve({ ws }));
  });
}
async function textReply(ws, message) {
  const next = once(ws, 'message'); ws.send(message); return JSON.parse((await next)[0].toString());
}

test('explicit printable ASCII preserves case/spaces and rejects ambiguous encodings', () => {
  assert.deepEqual([...encodeLauncherASCII(' A a ')], [32, 65, 32, 97, 32]);
  assert.equal(encodeLauncherASCII('A'.repeat(16)).length, 16);
  for (const value of ['', 'a'.repeat(17), '中文', 'é', '\0', '\n', '\x7f', null, 23, { toString() { throw new Error('Must not coerce'); } }]) {
    assert.throws(() => encodeLauncherASCII(value), { code: 'INPUT_ASCII' });
  }
});
test('bridge rejects absent or non-loopback targets and invalid settings before listen', async () => {
  for (const input of [{}, { endpoints: [], gameCode: 0 }, { endpoints: [{ address: 'localhost', port: 9 }], gameCode: 0 },
    { endpoints: [{ address: '192.0.2.1', port: 9 }], gameCode: 0 }, { endpoints: [{ address: '127.0.0.1', port: 9 }], gameCode: 15 }]) {
    await assert.rejects(createLauncherLoopbackServer(input));
  }
});
test('explicit bridge lifetime rejects invalid values before opening a server', async () => {
  for (const lifetimeMilliseconds of [null, 0, -1, 1.5, 60001, Infinity, NaN, '30000']) {
    await assert.rejects(createLauncherLoopbackServer({ endpoints: [{ address: '127.0.0.1', port: 9 }], lifetimeMilliseconds }));
  }
});
test('explicit bridge lifetime expires an authorized real stream and cleans up both sockets', { timeout: 10000 }, async () => {
  let peerClosed;
  const closed = new Promise(done => { peerClosed = done; });
  const peer = await localPeer(socket => socket.once('close', peerClosed));
  const server = await createLauncherLoopbackServer({ endpoints: [peer.endpoint], lifetimeMilliseconds: 1000 });
  let ws;
  try {
    const settings = await runtime(server);
    ({ ws } = await raw(server));
    const ready = await textReply(ws, JSON.stringify({ v: 1, token: settings.token, endpointOrdinal: 0 }));
    assert.equal(ready.type, 'ready');
    await peer.acceptance;
    assert.equal(server.snapshot().activeStreams, 1);
    const closing = once(ws, 'close');
    const [message] = await once(ws, 'message');
    assert.deepEqual(JSON.parse(message.toString()), { type: 'failed', code: 'BRIDGE_TIMEOUT' });
    assert.equal((await closing)[0], 1008);
    await closed;
    assert.equal(server.snapshot().activeStreams, 0);
    assert.equal(server.snapshot().connectionAttempts, 1);
  } finally { ws?.terminate(); await server.close(); await peer.close(); }
});
test('game bridge must be enabled for the legacy profile and still enforces authorization and setup timeout', { timeout: 10000 }, async () => {
  const endpoint = { address: '127.0.0.1', port: 9 };
  await assert.rejects(createLauncherLoopbackServer({ endpoints: [endpoint], gameStream: null }));
  await assert.rejects(createLauncherLoopbackServer({ sourceProfile: 'win32-current', endpoints: [endpoint], gameStream: true }));
  const legacy = await bridge(endpoint);
  try {
    assert.equal((await runtime(legacy)).gameStream, undefined);
    assert.equal((await raw(legacy, {}, '/game-stream')).denied, 403);
  } finally { await legacy.close(); }
  const server = await createLauncherLoopbackServer({ endpoints: [endpoint], gameStream: true, lifetimeMilliseconds: 500 });
  try {
    const settings = await runtime(server);
    assert.equal(settings.gameStream, true);
    assert.equal((await raw(server, { Origin: 'http://example.invalid' }, '/game-stream')).denied, 403);
    assert.equal((await raw(server, {}, '/game-stream?extra')).denied, 403);
    for (const message of [{ v: 1, token: '0'.repeat(64), endpointOrdinal: 0 }, { v: 1, token: settings.token, endpointOrdinal: 1 }]) {
      const { ws } = await raw(server, {}, '/game-stream');
      try { assert.deepEqual(await textReply(ws, JSON.stringify(message)), { type: 'failed', code: 'BRIDGE_DENIED' }); }
      finally { ws.terminate(); }
    }
    const { ws } = await raw(server, {}, '/game-stream');
    try {
      const closing = once(ws, 'close');
      const [message] = await once(ws, 'message');
      assert.deepEqual(JSON.parse(message.toString()), { type: 'failed', code: 'BRIDGE_TIMEOUT' });
      assert.equal((await closing)[0], 1008);
    } finally { ws.terminate(); }
    assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});
test('game bridge sustains one TCP stream past setup and launcher traffic budgets, then drains EOF', { timeout: 15000 }, async () => {
  const chunk = new Uint8Array(640).fill(85), writes = 8200, bodyBytes = chunk.length * writes;
  const tail = Buffer.from([4, 3, 2, 1]);
  let received = 0, receivedBody;
  const body = new Promise(resolve => { receivedBody = resolve; });
  const peer = await localPeer(socket => socket.on('data', value => {
    received += value.length; socket.write(value);
    if (received >= bodyBytes) receivedBody();
  }));
  const server = await createLauncherLoopbackServer({ endpoints: [peer.endpoint], gameStream: true, lifetimeMilliseconds: 1000 });
  let port;
  try {
    const settings = await runtime(server);
    port = await createBrowserGameTransport({ ...settings, WebSocket: browserSocket(server.origin) }).openStream(peer.endpoint);
    const socket = await peer.acceptance;
    await delay(1100);
    assert.deepEqual(server.snapshot(), { activeStreams: 1, connectionAttempts: 1, peerEOFs: 0 });
    const input = Buffer.alloc(bodyBytes + tail.length);
    await Promise.all([
      (async () => {
        let length = 0;
        for (let bytes; (bytes = await port.read()) !== null;) {
          assert.ok(bytes.length <= 65536 && length + bytes.length <= input.length);
          input.set(bytes, length); length += bytes.length;
        }
        assert.equal(length, input.length);
      })(),
      (async () => {
        for (let index = 0; index < writes; index++) await port.write(chunk);
        await body;
        socket.end(tail);
      })(),
    ]);
    assert.equal(received, bodyBytes);
    assert.ok(input.subarray(0, bodyBytes).every(value => value === 85));
    assert.deepEqual(input.subarray(bodyBytes), tail);
    assert.equal(await port.read(), null);
    assert.deepEqual(server.snapshot(), { activeStreams: 0, connectionAttempts: 1, peerEOFs: 1 });
  } finally { port?.close(); await server.close(); await peer.close(); }
});
test('browser game port bounds unread bytes and queued chunks', async () => {
  class LocalSocket extends EventTarget {
    constructor() { super(); LocalSocket.current = this; }
    send() {}
    close() { this.closed = true; }
    message(data) { this.dispatchEvent(new MessageEvent('message', { data })); }
  }
  const endpoint = { address: '127.0.0.1', port: 9 };
  for (const [count, bytes] of [[65, 65536], [8193, 1]]) {
    const transport = createBrowserGameTransport({ origin: 'http://127.0.0.1:1234', token: 'a'.repeat(64), endpoints: [endpoint], WebSocket: LocalSocket });
    const opening = transport.openStream(endpoint);
    const socket = LocalSocket.current;
    socket.message('{"type":"ready"}');
    const port = await opening;
    const frame = new ArrayBuffer(bytes);
    for (let index = 1; index < count; index++) socket.message(frame);
    assert.equal(socket.closed, undefined);
    socket.message(frame);
    assert.equal(socket.closed, true);
    assert.throws(() => port.read(), { code: 'STREAM_READ' });
  }
});
test('HTTP exposes only source/runtime and protects host, method, query and cross-site reads', async () => {
  const server = await bridge();
  try {
    const redirect = await fetch(server.origin + '/', { redirect: 'manual' });
    assert.equal(redirect.status, 302); assert.equal(redirect.headers.get('location'), '/web/login.html');
    const page = await fetch(server.origin + '/');
    assert.equal(new URL(page.url).pathname, '/web/login.html');
    assert.equal(page.status, 200); assert.match(await page.text(), /本地登录流程/);
    assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.match(page.headers.get('content-security-policy'), new RegExp(server.origin.replace('http:', 'ws:')));
    for (const path of ['/moli/POLCN_Setup.exe', '/analysis/launcher-v18/preflight.json', '/adapters/node/launcher-loopback.mjs', '/%2e%2e%2fmoli/x.exe', '/runtime.json?x=1']) {
      assert.equal((await fetch(server.origin + path)).status, 404, path);
    }
    assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405);
    assert.equal((await fetch(server.origin + '/runtime.json', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
    const status = await new Promise(done => {
      const req = request(server.origin + '/runtime.json', { headers: { Host: 'example.invalid' } }, res => { res.resume(); done(res.statusCode); }); req.end();
    });
    assert.equal(status, 403); assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});
test('upgrade requires exact origin/path/subprotocol; no TCP on rejection', async () => {
  const server = await bridge();
  try {
    for (const [headers, path, protocol] of [[{ Origin: 'http://example.invalid' }, '/stream', 'moli-launcher-v1'], [{}, '/other', 'moli-launcher-v1'], [{}, '/stream', 'other']]) {
      assert.equal((await raw(server, headers, path, protocol)).denied, 403);
    }
    assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});
test('per-start token and endpoint ordinal are checked before TCP', async () => {
  const server = await bridge();
  try {
    const settings = await runtime(server);
    for (const message of [{ v: 1, token: '0'.repeat(64), endpointOrdinal: 0 }, { v: 1, token: settings.token, endpointOrdinal: 1 }, { v: 1, token: settings.token, endpointOrdinal: 0, extra: true }]) {
      const { ws } = await raw(server);
      const response = await textReply(ws, JSON.stringify(message));
      assert.deepEqual(response, { type: 'failed', code: 'BRIDGE_DENIED' }); ws.terminate();
    }
    assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});
for (const [index, mode] of ['profiles', 'empty', 'rejected'].entries()) {
  test(`actual WebSocket→TCP→independent Python: ${mode}`, async () => {
    const peer = await startOriginalPeer(mode), server = await bridge(peer.endpoint);
    let session;
    try {
      const settings = await runtime(server);
      const transport = createBrowserLauncherTransport({ ...settings, WebSocket: browserSocket(server.origin) });
      const input = vectors[index].request_fields;
      session = createLauncherSession({ endpoints: settings.endpoints, firstEndpointOrdinal: 0,
        requestCounter: input.counter, gameCode: input.game_code, usernameBytes: bytes(input.username_hex),
        passwordBytes: bytes(input.password_hex), openStream: transport.openStream });
      const result = await session.start();
      assert.equal(result.snapshot.state, mode === 'empty' ? 'no-profiles' : mode === 'rejected' ? 'rejected' : 'profiles');
      assert.equal(result.snapshot.entropy, 'platform-csprng');
      assert.equal(result.snapshot.authentication, 'unverified');
      const checked = await peer.done; assert.ok(checked.rows.every(row => row.request_verified && row.client_closed));
      if (mode === 'profiles') assert.ok(session.selectProfile(3).selection.profile.selectionGate.passes);
    } finally { session?.cancel(); await server.close(); await peer.stop(); }
  });
}
test('browser port snapshots written views, reads actual bytes and preserves queued EOF data', async () => {
  const peer = await localPeer(socket => { socket.once('data', value => { socket.end(Buffer.concat([value, Buffer.alloc(150000, 85)])); }); });
  const server = await bridge(peer.endpoint);
  let port;
  try {
    const settings = await runtime(server);
    const transport = createBrowserLauncherTransport({ ...settings, WebSocket: browserSocket(server.origin) });
    port = await transport.openStream(peer.endpoint);
    const source = new Uint8Array([99, 1, 2, 3, 99]);
    const write = port.write(source.subarray(1, 4)); source.fill(0); await write;
    const parts = [];
    while (true) { const next = await port.read(); if (next === null) break; assert.ok(next.length <= 65536); parts.push(next); }
    const all = Buffer.concat(parts);
    assert.equal(all.length, 150003); assert.deepEqual([...all.subarray(0, 3)], [1, 2, 3]);
    assert.ok(all.subarray(3).every(value => value === 85)); assert.equal(await port.read(), null);
  } finally { port?.close(); await server.close(); await peer.close(); }
});
test('pending browser read cancellation closes actual TCP and keeps abort reason private', async () => {
  const peer = await localPeer(() => {}), server = await bridge(peer.endpoint);
  try {
    const settings = await runtime(server), controller = new AbortController();
    const transport = createBrowserLauncherTransport({ ...settings, WebSocket: browserSocket(server.origin) });
    const port = await transport.openStream(peer.endpoint);
    const accepted = await peer.acceptance, closed = once(accepted, 'close');
    const pending = port.read({ signal: controller.signal });
    controller.abort('private-synthetic-reason');
    await assert.rejects(pending, error => error.code === 'STREAM_ABORTED' && !error.message.includes('synthetic'));
    await closed; assert.equal(server.snapshot().activeStreams, 0);
    port.close(); port.close();
  } finally { await server.close(); await peer.close(); }
});
test('one pending read only and explicit server close settles it', async () => {
  const peer = await localPeer(() => {}), server = await bridge(peer.endpoint);
  try {
    const settings = await runtime(server);
    const transport = createBrowserLauncherTransport({ ...settings, WebSocket: browserSocket(server.origin) });
    const port = await transport.openStream(peer.endpoint), pending = port.read();
    assert.throws(() => port.read(), { code: 'STREAM_BUSY' });
    const failed = assert.rejects(pending, { code: 'STREAM_READ' });
    await server.close(); await failed;
  } finally { await server.close(); await peer.close(); }
});
test('client validates explicit origins/endpoints and refuses caller targets outside its list', async () => {
  const config = { origin: 'http://127.0.0.1:1234', token: 'a'.repeat(64), endpoints: [{ address: '127.0.0.1', port: 9 }] };
  for (const change of [{ origin: 'https://example.invalid' }, { origin: 'http://localhost:1234' }, { origin: 'http://127.0.0.1:1234/' }, { token: 'bad' }]) {
    assert.throws(() => createBrowserLauncherTransport({ ...config, ...change }), { code: 'STREAM_INPUT' });
  }
  const transport = createBrowserLauncherTransport(config);
  assert.throws(() => transport.openStream({ address: '127.0.0.1', port: 10 }), { code: 'STREAM_DENIED' });
  const controller = new AbortController(); controller.abort();
  assert.throws(() => transport.openStream(config.endpoints[0], { signal: controller.signal }), { code: 'STREAM_ABORTED' });
});

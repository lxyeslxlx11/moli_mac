import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { setImmediate as turn } from 'node:timers/promises';
import { createNodeLauncherTransport } from '../../adapters/node/launcher-stream.mjs';
async function localServer(handler = socket => socket.end()) {
  const sockets = new Set();
  let acceptedResolve;
  const accepted = new Promise(resolve => { acceptedResolve = resolve; });
  const server = createServer(socket => {
    sockets.add(socket); socket.once('close', () => sockets.delete(socket)); socket.on('error', () => {});
    acceptedResolve(socket); handler(socket);
  });
  await new Promise((yes, no) => { server.once('error', no); server.listen({ host: '127.0.0.1', port: 0 }, yes); });
  const endpoint = Object.freeze({ address: '127.0.0.1', port: server.address().port });
  return { endpoint, sockets, accepted,
    async close() { for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); },
  };
}
const rejects = (promise, code) => assert.rejects(promise, error => error.code === code);

test('TCP factory performs no connection until explicit open and rejects non-allowlisted tuples', async () => {
  let connections = 0; const server = await localServer(socket => { connections++; socket.end(); });
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }); await turn(); assert.equal(connections, 0);
    await rejects(transport.openStream({ address: '127.0.0.2', port: server.endpoint.port }), 'STREAM_DENIED');
    await turn(); assert.equal(connections, 0);
    const port = await transport.openStream(server.endpoint); assert.equal(await port.read(), null); port.close();
    assert.equal(connections, 1);
  } finally { await server.close(); }
});

test('actual large socket reads are owned plain chunks no larger than64KiB', async () => {
  const original = Buffer.from(Array.from({ length: 200000 }, (_, i) => i % 251));
  const before = Buffer.from(original), server = await localServer(socket => socket.end(original));
  let port;
  try {
    port = await createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }).openStream(server.endpoint);
    const received = [];
    for (;;) {
      const chunk = await port.read(); if (chunk === null) break;
      assert.equal(Buffer.isBuffer(chunk), false); assert.ok(chunk.length >= 1 && chunk.length <= 65536);
      received.push(Buffer.from(chunk)); chunk.fill(255);
    }
    assert.deepEqual(Buffer.concat(received), before); assert.deepEqual(original, before); assert.equal(await port.read(), null);
  } finally { port?.close(); await server.close(); }
});

test('actual writes snapshot an offset view before caller mutation and preserve sequential order', async () => {
  let resolve, accumulated = Buffer.alloc(0); const received = new Promise(yes => { resolve = yes; });
  const server = await localServer(socket => socket.on('data', data => {
    accumulated = Buffer.concat([accumulated, data]); if (accumulated.length === 6) resolve();
  }));
  let port;
  try {
    port = await createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }).openStream(server.endpoint);
    const input = Uint8Array.of(255, 1, 0, 3, 255).subarray(1, 4);
    const pending = port.write(input); input.fill(99); await pending;
    await port.write(Uint8Array.of(4, 0, 6)); await received;
    assert.deepEqual(accumulated, Buffer.from([1, 0, 3, 4, 0, 6]));
  } finally { port?.close(); await server.close(); }
});

test('one pending read is enforced and explicit close settles the original pending read', async () => {
  const server = await localServer(() => {}); let port;
  try {
    port = await createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }).openStream(server.endpoint);
    const pending = port.read(); await turn(); await rejects(port.read(), 'STREAM_BUSY');
    port.close(); await rejects(pending, 'STREAM_CLOSED');
    await rejects(port.read(), 'STREAM_CLOSED'); await rejects(port.write(Uint8Array.of(1)), 'STREAM_CLOSED');
    port.close();
  } finally { port?.close(); await server.close(); }
});

test('operation AbortSignal cancels a pending actual read and closes its socket', { timeout: 2000 }, async () => {
  const server = await localServer(() => {}); let port;
  try {
    port = await createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }).openStream(server.endpoint);
    const socket = await server.accepted;
    const peerClosed = new Promise(resolve => socket.once('close', resolve));
    const controller = new AbortController(), pending = port.read({ signal: controller.signal });
    pending.catch(() => {});
    controller.abort('private cancellation reason'); await rejects(pending, 'STREAM_ABORTED');
    await peerClosed; assert.equal(server.sockets.size, 0);
  } finally { port?.close(); await server.close(); }
});

test('already-aborted connection and write do not create a connection or send a payload', async () => {
  let connections = 0, bytes = 0;
  const server = await localServer(socket => { connections++; socket.on('data', data => { bytes += data.length; }); });
  let port;
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] });
    const controller = new AbortController(); controller.abort('private reason');
    await rejects(transport.openStream(server.endpoint, { signal: controller.signal }), 'STREAM_ABORTED');
    await turn(); assert.equal(connections, 0);
    port = await transport.openStream(server.endpoint); await rejects(port.write(Uint8Array.of(1, 2, 3), { signal: controller.signal }), 'STREAM_ABORTED');
    await turn(); assert.equal(bytes, 0);
  } finally { port?.close(); await server.close(); }
});

test('native connection refusal exposes a controlled code without endpoint/provider text', async () => {
  const server = await localServer(); const endpoint = server.endpoint; await server.close();
  const transport = createNodeLauncherTransport({ allowedEndpoints: [endpoint] });
  await assert.rejects(transport.openStream(endpoint), error => error.code === 'STREAM_CONNECT'
    && !error.message.includes(endpoint.address) && !error.message.includes(String(endpoint.port)));
});

test('allowlist snapshot is stable after source array and endpoint mutation', async () => {
  const server = await localServer(), original = { ...server.endpoint }, source = [{ ...original }]; let port;
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: source }); source[0].port = original.port + 1; source.push({ address: '127.0.0.2', port: 1 });
    port = await transport.openStream(original); assert.equal(await port.read(), null);
    await rejects(transport.openStream(source[1]), 'STREAM_DENIED');
  } finally { port?.close(); await server.close(); }
});

test('invalid native hosts, ports, accessors and sparse allowlists are rejected before I/O', async () => {
  for (const value of [[], new Array(1), [{ address: 'bad/host', port: 1 }], [{ address: 'a..b', port: 1 }],
    [{ address: '[::1]', port: 1 }], [{ address: '999.999.0.1', port: 1 }], [{ address: '127.0.0.1', port: 0 }],
    [{ address: '127.0.0.1', port: '1' }]]) assert.throws(() => createNodeLauncherTransport({ allowedEndpoints: value }));
  const accessor = {}; Object.defineProperty(accessor, 'allowedEndpoints', { get() { throw new Error('must not read'); } });
  assert.throws(() => createNodeLauncherTransport(accessor), error => error.code === 'SESSION_INPUT');
});

test('write budget and native byte-brand checks run before any socket write', async () => {
  let bytes = 0; const server = await localServer(socket => socket.on('data', value => { bytes += value.length; })); let port;
  try {
    port = await createNodeLauncherTransport({ allowedEndpoints: [server.endpoint] }).openStream(server.endpoint);
    class Hidden extends Uint8Array { get length() { return 1; } get byteLength() { return 1; } }
    for (const value of [new Uint8Array(0), new Uint8Array(65537), new Hidden(65537), new Proxy(Uint8Array.of(1), {}), 'private bytes']) {
      await rejects(port.write(value), 'SESSION_BYTES');
    }
    await turn(); assert.equal(bytes, 0);
  } finally { port?.close(); await server.close(); }
});

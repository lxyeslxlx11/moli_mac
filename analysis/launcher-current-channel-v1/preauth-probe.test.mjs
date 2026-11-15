import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { setImmediate as turn } from 'node:timers/promises';
import { probeLauncherPreauth } from './preauth-probe.mjs';
const vectors = JSON.parse(readFileSync(new URL('./original-vectors.json', import.meta.url)));
const challenge = Buffer.from(vectors.valid[0].challenge_hex, 'hex');
async function withPeer(action, body) {
  const sockets = new Set(), received = [];
  const server = net.createServer(socket => {
    sockets.add(socket); socket.on('error', () => {}); socket.once('close', () => sockets.delete(socket));
    socket.on('data', value => { received.push(Buffer.from(value)); action(socket); });
  });
  await new Promise((yes, no) => { server.once('error', no); server.listen(0, '127.0.0.1', yes); });
  try { await body(server.address().port, received); }
  finally { for (const socket of sockets) socket.destroy(); await new Promise(yes => server.close(yes)); }
}
test('probe actually sends only8 bytes, accepts a split challenge and closes without returning raw fields', async () => {
  await withPeer(async socket => {
    for (const part of [challenge.subarray(0, 3), challenge.subarray(3, 19), challenge.subarray(19)]) {
      socket.write(part); await turn();
    }
  }, async (port, received) => {
    const result = await probeLauncherPreauth({ host: '127.0.0.1', port, timeoutMs: 1000 });
    assert.equal(Buffer.concat(received).toString('hex'), vectors.hello_hex);
    assert.equal(result.status, 'challenge-validated'); assert.equal(result.challenge_validated, true);
    assert.equal(result.challenge_sha256, createHash('sha256').update(challenge).digest('hex'));
    assert.equal(result.outbound_requested_bytes, 8); assert.equal(result.close_event_observed, true);
    assert.equal(result.peak_retained_inbound_bytes, challenge.length);
    assert.ok(!/peerPublicHex|modulusHex|challenge_hex/.test(JSON.stringify(result)));
    assert.equal(result.account_request_sent, false); assert.equal(result.public_key_answer_sent, false);
  });
});
test('a changed pinned group closes after hello and reports only a typed failure', async () => {
  await withPeer(socket => socket.write(Buffer.from(vectors.invalid[2].hex, 'hex')), async port => {
    const result = await probeLauncherPreauth({ host: '127.0.0.1', port, timeoutMs: 1000 });
    assert.equal(result.status, 'protocol-rejected'); assert.equal(result.error_code, 'HANDSHAKE_GROUP');
    assert.equal(result.close_event_observed, true); assert.equal(result.outbound_requested_bytes, 8);
  });
});
test('oversized input closes without retaining more than the784-byte native buffer', async () => {
  await withPeer(socket => socket.write(Buffer.alloc(785)), async port => {
    const result = await probeLauncherPreauth({ host: '127.0.0.1', port, timeoutMs: 1000 });
    assert.equal(result.status, 'input-budget'); assert.ok(result.peak_retained_inbound_bytes <= 784);
    assert.equal(result.close_event_observed, true);
  });
});
test('a partial challenge reaches the explicit deadline and observes close', async () => {
  await withPeer(socket => socket.write(challenge.subarray(0, 7)), async port => {
    const result = await probeLauncherPreauth({ host: '127.0.0.1', port, timeoutMs: 40 });
    assert.equal(result.status, 'timed-out'); assert.equal(result.observed_inbound_bytes, 7);
    assert.ok(result.elapsed_ms >= 30 && result.elapsed_ms < 2000); assert.equal(result.close_event_observed, true);
  });
});
test('EOF in a challenge remains incomplete rather than a successful handshake', async () => {
  await withPeer(socket => socket.end(challenge.subarray(0, 7)), async port => {
    const result = await probeLauncherPreauth({ host: '127.0.0.1', port, timeoutMs: 1000 });
    assert.equal(result.status, 'incomplete-challenge'); assert.equal(result.challenge_validated, false);
    assert.equal(result.close_event_observed, true);
  });
});
test('no implicit host, port or multi-address resolution is allowed', async () => {
  for (const input of [{ host: 'example.invalid', port: 9030 }, { host: '127.0.0.1', port: 0 },
    { host: '127.0.0.1', port: 9030, timeoutMs: 10001 }]) await assert.rejects(probeLauncherPreauth(input));
});

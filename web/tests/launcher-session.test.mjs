import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setImmediate as turn } from 'node:timers/promises';
import { createLauncherSession, LAUNCHER_SESSION_LIMITS, LauncherSessionError } from '../launcher-session.mjs';
import { createNodeLauncherTransport } from '../../adapters/node/launcher-stream.mjs';
import { startOriginalPeer } from '../../analysis/launcher-v17/peer-helper.mjs';
import { createLauncherRecordCodec } from '../../shared/index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v9/original-flow-vectors.json', import.meta.url))).flows;
const b = hex => new Uint8Array(Buffer.from(hex, 'hex'));
const endpoint = Object.freeze({ address: 'original.invalid', port: 12345 });
function config(vector = vectors[0], extra = {}) {
  const fields = vector.request_fields;
  return { endpoints: [endpoint], firstEndpointOrdinal: 0, requestCounter: fields.counter, gameCode: fields.game_code,
    usernameBytes: b(fields.username_hex), passwordBytes: b(fields.password_hex),
    randomBytes: () => b(vector.fixture_exponent_hex), ...extra };
}
function originalPort(vector = vectors[0], extra = {}) {
  const parts = [b(vector.challenge_hex), b(vector.peer_wire_hex)], writes = [];
  let closes = 0;
  const port = { async read() { return parts.shift() ?? null; }, async write(bytes) { writes.push(new Uint8Array(bytes)); }, close() { closes++; }, ...extra };
  return { port, writes, closes: () => closes };
}
const errorCode = (call, code) => assert.throws(call, error => error.code === code);
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test('stream runner matches all3 independently generated full exchange byte vectors', async () => {
  for (const vector of vectors) {
    const io = originalPort(vector), session = createLauncherSession(config(vector, { openStream: () => io.port }));
    const first = session.start(); assert.equal(session.start(), first);
    const result = await first;
    assert.equal(result.snapshot.state, vector.expected_disposition === 'nonzero-result' ? 'rejected' : vector.expected_disposition);
    assert.deepEqual(io.writes.map(x => Buffer.from(x).toString('hex')), ['0000000100000008', vector.public_message_hex, vector.request_record_hex]);
    assert.equal(io.closes(), 1); assert.equal(result.snapshot.io.cleanupErrors, 0);
    assert.equal(result.snapshot.entropy, 'caller-provided'); assert.equal(result.snapshot.authentication, 'unverified');
    session.cancel();
  }
});

test('real Python TCP oracle verifies fresh-entropy requests and closes for profiles/empty/rejected', async () => {
  for (const [index, mode] of ['profiles', 'empty', 'rejected'].entries()) {
    const peer = await startOriginalPeer(mode); let session;
    try {
      const transport = createNodeLauncherTransport({ allowedEndpoints: [peer.endpoint] });
      const options = config(vectors[index], { endpoints: [peer.endpoint], openStream: transport.openStream });
      delete options.randomBytes;
      session = createLauncherSession(options);
      const result = await session.start(), proof = await peer.done;
      assert.equal(result.snapshot.state, mode === 'empty' ? 'no-profiles' : mode === 'rejected' ? 'rejected' : 'profiles');
      assert.equal(result.snapshot.entropy, 'platform-csprng'); assert.equal(result.snapshot.io.entropyRequests, 1);
      assert.equal(result.snapshot.io.writesCompleted, 3); assert.equal(proof.connections, 1);
      assert.ok(proof.rows.every(x => x.hello_verified && x.request_verified && x.client_closed));
      assert.equal(result.snapshot.authentication, 'unverified');
      if (result.choices) { const selected = session.selectProfile(3); assert.equal(selected.selection.profile.sourceOrdinal, 0); }
    } finally { session?.cancel(); await peer.stop(); }
  }
});

test('separate real TCP sessions each invoke platform entropy and independently verify new public values', async () => {
  const peer = await startOriginalPeer('profiles', 2);
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: [peer.endpoint] });
    for (let i = 0; i < 2; i++) {
      const options = config(vectors[0], { endpoints: [peer.endpoint], openStream: transport.openStream }); delete options.randomBytes;
      const session = createLauncherSession(options);
      try { assert.equal((await session.start()).snapshot.io.entropyRequests, 1); } finally { session.cancel(); }
    }
    const proof = await peer.done; assert.equal(proof.connections, 2); assert.equal(proof.public_values_differ, true);
  } finally { await peer.stop(); }
});

test('real stream EOF, rejected challenge and truncated encrypted record fail without replay', async () => {
  for (const [mode, expected] of [['drop', 'FLOW_REMOTE_CLOSED'], ['bad-challenge', 'HANDSHAKE_REJECTED'], ['truncated-record', 'RECORD_TRUNCATED']]) {
    const peer = await startOriginalPeer(mode); let session;
    try {
      const transport = createNodeLauncherTransport({ allowedEndpoints: [peer.endpoint] });
      const options = config(vectors[0], { endpoints: [peer.endpoint], openStream: transport.openStream }); delete options.randomBytes;
      session = createLauncherSession(options);
      const result = await session.start(); await peer.done;
      assert.equal(result.snapshot.state, 'failed'); assert.equal(result.snapshot.errorCode, expected);
      assert.equal(result.snapshot.io.opensRequested, 1); assert.equal(result.choices, null);
    } finally { session?.cancel(); await peer.stop(); }
  }
});

test('actual10s total deadline cancels a stalled TCP peer and the peer observes client close', { timeout: 15000 }, async () => {
  const peer = await startOriginalPeer('stall'); let session;
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: [peer.endpoint] });
    session = createLauncherSession(config(vectors[0], { endpoints: [peer.endpoint], openStream: transport.openStream }));
    const began = performance.now(), result = await session.start(), elapsed = performance.now() - began;
    const proof = await peer.done;
    assert.equal(result.snapshot.state, 'timed-out'); assert.equal(result.snapshot.errorCode, 'FLOW_TIMEOUT');
    assert.ok(elapsed >= 9900 && elapsed < 14000); assert.equal(result.snapshot.io.entropyRequests, 0);
    assert.equal(proof.rows[0].client_closed, true); assert.equal(result.snapshot.io.opensRequested, 1);
  } finally { session?.cancel(); await peer.stop(); }
});

test('pre-open failures rotate finite endpoints and never reset deadline or send early bytes', async () => {
  const io = originalPort(), opens = [];
  const session = createLauncherSession(config(vectors[0], { endpoints: [endpoint, { address: 'second.invalid', port: 12346 }],
    openStream(selected) { opens.push(selected.address); if (opens.length === 1) throw new Error('private provider detail'); return io.port; } }));
  const result = await session.start();
  assert.deepEqual(opens, ['original.invalid', 'second.invalid']); assert.equal(result.snapshot.state, 'profiles');
  assert.equal(result.snapshot.flow.attemptsMade, 2); assert.equal(result.snapshot.lastIOErrorCode, 'STREAM_CONNECT');
  assert.equal(io.writes.length, 3); session.cancel();
});

test('opening all endpoints fails finitely without leaking provider text or requesting entropy', async () => {
  const session = createLauncherSession(config(vectors[0], { endpoints: [endpoint, endpoint], openStream() { throw new Error('secret provider message'); } }));
  const result = await session.start(); assert.equal(result.snapshot.errorCode, 'FLOW_ENDPOINTS_EXHAUSTED');
  assert.equal(result.snapshot.io.opensRequested, 2); assert.equal(result.snapshot.io.entropyRequests, 0);
  assert.ok(!JSON.stringify(result).includes('secret')); assert.equal(result.snapshot.io.writesRequested, 0);
});

test('cancelling a pending open returns promptly and closes the same late stream once', async () => {
  const pending = deferred(), io = originalPort();
  const session = createLauncherSession(config(vectors[0], { openStream: () => pending.promise }));
  const resultPromise = session.start(); await turn(); session.cancel();
  assert.equal((await resultPromise).snapshot.state, 'cancelled');
  pending.resolve(io.port); await turn();
  assert.equal(io.closes(), 1); assert.equal(io.writes.length, 0); assert.equal(session.snapshot().io.closeRequests, 1);
});

test('AbortSignal cancels a pending read and write, without another request or retry', async () => {
  for (const pendingOperation of ['read', 'write']) {
    const entered = deferred(), pending = deferred(), controller = new AbortController();
    const io = originalPort(vectors[0], { [pendingOperation]() { entered.resolve(); return pending.promise; } });
    const session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
    const done = session.start({ signal: controller.signal }); await entered.promise; controller.abort('private reason');
    const result = await done;
    assert.equal(result.snapshot.state, 'cancelled'); assert.equal(result.snapshot.io.opensRequested, 1);
    assert.equal(result.snapshot.io.entropyRequests, 0); assert.equal(io.closes(), 1);
    assert.ok(!JSON.stringify(result).includes('private reason')); pending.resolve(null); await turn();
  }
});

test('cancelling pending entropy closes wire and does not mutate late caller-owned entropy', async () => {
  const entered = deferred(), pending = deferred(), nonce = b(vectors[0].fixture_exponent_hex), before = nonce.slice();
  const io = originalPort();
  const session = createLauncherSession(config(vectors[0], { openStream: () => io.port, randomBytes() { entered.resolve(); return pending.promise; } }));
  const done = session.start(); await entered.promise; session.cancel(); assert.equal((await done).snapshot.state, 'cancelled');
  pending.resolve(nonce); await turn(); assert.deepEqual(nonce, before); assert.equal(io.writes.length, 1); assert.equal(io.closes(), 1);
});

test('deadline wins over late open success and rejection even before timer callback delivery', async () => {
  for (const success of [true, false]) {
    let now = 0; const pending = deferred(), io = originalPort();
    const session = createLauncherSession(config(vectors[0], { now: () => now, openStream: () => pending.promise }));
    const done = session.start(); await turn(); now = 10000;
    if (success) pending.resolve(io.port); else pending.reject(new Error('late private error'));
    const result = await done; await turn();
    assert.equal(result.snapshot.state, 'timed-out'); assert.equal(result.snapshot.errorCode, 'FLOW_TIMEOUT');
    assert.equal(result.snapshot.io.opensRequested, 1); assert.equal(result.snapshot.io.writesRequested, 0);
    assert.equal(io.closes(), success ? 1 : 0);
  }
});

test('a deadline crossed by synchronous write completion prevents all subsequent writes', async () => {
  let now = 0, writes = 0;
  const io = originalPort(vectors[0], { write() { writes++; now = 10000; } });
  const session = createLauncherSession(config(vectors[0], { now: () => now, openStream: () => io.port }));
  const result = await session.start();
  assert.equal(result.snapshot.state, 'timed-out'); assert.equal(writes, 1);
  assert.equal(result.snapshot.io.entropyRequests, 0); assert.equal(io.closes(), 1);
});

test('input, endpoint and request bytes are snapshotted before any connection', async () => {
  const io = originalPort(), input = config(vectors[0], { openStream: () => io.port });
  const session = createLauncherSession(input);
  input.endpoints[0] = { address: 'changed.invalid', port: 999 }; input.usernameBytes.fill(255); input.passwordBytes.fill(255);
  const result = await session.start(); assert.equal(result.snapshot.state, 'profiles');
  assert.equal(Buffer.from(io.writes[2]).toString('hex'), vectors[0].request_record_hex); session.cancel();
});

test('profile choices remain owned and can be explicitly selected or abandoned after wire closes', async () => {
  const io = originalPort(), session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
  const result = await session.start(); assert.equal(io.closes(), 1);
  assert.equal(result.choices.rows.length, 4); result.choices.reply.byteField.fill(255);
  assert.equal(session.selectProfile(3).selection.profile.sourceOrdinal, 0);
  assert.equal(session.getChoices(), null); assert.equal(session.snapshot().state, 'selected');
  const otherIO = originalPort(), other = createLauncherSession(config(vectors[0], { openStream: () => otherIO.port }));
  await other.start(); assert.equal(other.cancel().state, 'cancelled'); assert.equal(other.getChoices(), null);
});

test('bad read shapes and empty/oversized chunks fail without spinning or reusing stale data', async () => {
  for (const raw of [new Uint8Array(0), new Uint8Array(65537), 'private bytes', new Proxy(new Uint8Array([1]), {})]) {
    const io = originalPort(vectors[0], { async read() { return raw; } });
    const session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
    const result = await session.start(); assert.equal(result.snapshot.errorCode, 'SESSION_BYTES');
    assert.equal(result.snapshot.io.readsCompleted, 1); assert.equal(io.closes(), 1);
  }
});

test('valid empty encrypted records still stop at the cumulative4MiB input budget', async () => {
  const codec = createLauncherRecordCodec(b(vectors[0].fixture_key_hex));
  const empty = codec.encode(new Uint8Array(0)); codec.close();
  const chunk = new Uint8Array(65536);
  for (let at = 0; at < chunk.length; at += empty.length) chunk.set(empty, at);
  let first = true;
  const io = originalPort(vectors[0], { async read() { if (first) { first = false; return b(vectors[0].challenge_hex); } return chunk; } });
  const session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
  const result = await session.start();
  assert.equal(result.snapshot.errorCode, 'SESSION_BUDGET'); assert.equal(result.snapshot.state, 'failed');
  assert.ok(result.snapshot.io.inboundBytes > LAUNCHER_SESSION_LIMITS.inboundBytes);
  assert.ok(result.snapshot.io.inboundBytes <= LAUNCHER_SESSION_LIMITS.inboundBytes + 65536);
  assert.equal(io.closes(), 1); assert.equal(result.choices, null);
});

test('uncooperative or rejected close calls are reported without hanging or unhandled provider errors', async () => {
  for (const reject of [false, true]) {
    const io = originalPort(vectors[0], { close() { return reject ? Promise.reject(new Error('private close text')) : new Promise(() => {}); } });
    const session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
    const result = await session.start(); await turn();
    assert.equal(result.snapshot.state, 'profiles'); assert.equal(session.snapshot().io.closeRequests, 1);
    assert.equal(session.snapshot().io.closeCallsCompleted, 0);
    assert.equal(session.snapshot().io.cleanupErrors, reject ? 1 : 0);
    assert.ok(!JSON.stringify(result).includes('private close text')); session.cancel();
  }
});

test('invalid entropy is a controlled failure and caller-owned nonce input remains intact', async () => {
  for (const raw of [new Uint8Array(19), new Uint8Array(21), {}, new Proxy(new Uint8Array(20), {})]) {
    const io = originalPort(), session = createLauncherSession(config(vectors[0], { openStream: () => io.port, randomBytes: () => raw }));
    assert.equal((await session.start()).snapshot.errorCode, 'SESSION_RANDOM'); assert.equal(io.writes.length, 1); assert.equal(io.closes(), 1);
  }
  const nonce = b(vectors[0].fixture_exponent_hex), before = nonce.slice(), io = originalPort();
  const session = createLauncherSession(config(vectors[0], { openStream: () => io.port, randomBytes: () => nonce }));
  assert.equal((await session.start()).snapshot.state, 'profiles'); assert.deepEqual(nonce, before); session.cancel();
});

test('zero entropy retains the core nontrivial-exponent rejection and never retries', async () => {
  const io = originalPort(), session = createLauncherSession(config(vectors[0], { openStream: () => io.port, randomBytes: () => new Uint8Array(20) }));
  const result = await session.start(); assert.equal(result.snapshot.errorCode, 'HANDSHAKE_EXPONENT');
  assert.equal(result.snapshot.io.opensRequested, 1); assert.equal(io.writes.length, 1);
});

test('own properties and native byte lengths reject coercion, sparse endpoints and hostile metadata', () => {
  const valid = config(vectors[0], { openStream: () => ({}) });
  errorCode(() => createLauncherSession(Object.create(valid)), 'SESSION_INPUT');
  const accessor = { ...valid }; Object.defineProperty(accessor, 'endpoints', { get() { throw new Error('must not execute'); } });
  errorCode(() => createLauncherSession(accessor), 'SESSION_INPUT');
  for (const endpoints of [[], new Array(1), [{ address: 'bad\0address', port: 1 }], [{ address: '127.0.0.1', port: '1' }], Array(11).fill(endpoint)]) {
    assert.throws(() => createLauncherSession({ ...valid, endpoints }));
  }
  class Hidden extends Uint8Array { get length() { return 1; } get byteLength() { return 1; } }
  errorCode(() => createLauncherSession({ ...valid, usernameBytes: new Hidden(17).fill(65) }), 'SESSION_BYTES');
  const { proxy, revoke } = Proxy.revocable({}, {}); revoke(); errorCode(() => createLauncherSession(proxy), 'SESSION_INPUT');
  assert.equal(LAUNCHER_SESSION_LIMITS.timeoutMs, 10000);
  for (const code of ['toString', '__proto__', 'constructor', { toString() { throw new Error('must not coerce'); } }]) {
    assert.equal(new LauncherSessionError(code).code, 'SESSION_INTERNAL');
  }
  errorCode(() => createLauncherSession({ ...valid, setTimer: null }), 'SESSION_TIMER');
  errorCode(() => createLauncherSession({ ...valid, clearTimer: null }), 'SESSION_TIMER');
});

test('accepted read/write/close methods are captured before a mutable provider changes them', async () => {
  const reads = [b(vectors[0].challenge_hex), b(vectors[0].peer_wire_hex)]; let originalCloses = 0, replacementCloses = 0;
  const port = { async read() {
    port.close = () => { replacementCloses++; }; port.write = () => { throw new Error('changed writer'); };
    return reads.shift() ?? null;
  }, async write() {}, close() { originalCloses++; } };
  const session = createLauncherSession(config(vectors[0], { openStream: () => port }));
  assert.equal((await session.start()).snapshot.state, 'profiles');
  assert.equal(originalCloses, 1); assert.equal(replacementCloses, 0); session.cancel();
});

test('cancel before start and already-aborted signal perform no transport or entropy requests', async () => {
  for (const before of [true, false]) {
    const session = createLauncherSession(config(vectors[0], { openStream() { throw new Error('must not open'); } }));
    const controller = new AbortController(); controller.abort(); if (before) session.cancel();
    const result = await session.start({ signal: controller.signal });
    assert.equal(result.snapshot.state, 'cancelled'); assert.equal(result.snapshot.io.opensRequested, 0); assert.equal(result.snapshot.io.entropyRequests, 0);
  }
});

test('invalid signals, clock and timer providers fail without leaking provider messages', async () => {
  const io = originalPort(), session = createLauncherSession(config(vectors[0], { openStream: () => io.port }));
  errorCode(() => session.start({ signal: 'private signal' }), 'SESSION_INPUT'); assert.equal(session.snapshot().flow.state, 'cancelled');
  for (const options of [{ now: () => NaN }, { now() { throw new Error('private clock'); } }, { setTimer() { throw new Error('private timer'); } }]) {
    const item = createLauncherSession(config(vectors[0], { openStream: () => io.port, ...options }));
    const result = await item.start(); assert.equal(result.snapshot.state, 'failed');
    assert.ok(!JSON.stringify(result).includes('private')); assert.equal(result.snapshot.io.opensRequested, 0);
  }
});

test('a malformed opened port is disposed and exhausted as a pre-open contract failure', async () => {
  let closes = 0;
  const session = createLauncherSession(config(vectors[0], { openStream: () => ({ read: 'bad', write() {}, close() { closes++; } }) }));
  const result = await session.start(); assert.equal(result.snapshot.state, 'failed'); assert.equal(closes, 1);
  assert.equal(result.snapshot.lastIOErrorCode, 'SESSION_STREAM'); assert.equal(result.snapshot.io.writesRequested, 0);
});

test('write failures close the opened stream without another endpoint or raw error exposure', async () => {
  const io = originalPort(vectors[0], { write() { throw new Error('private write failure'); } });
  const session = createLauncherSession(config(vectors[0], { endpoints: [endpoint, endpoint], openStream: () => io.port }));
  const result = await session.start(); assert.equal(result.snapshot.errorCode, 'SESSION_WRITE');
  assert.equal(result.snapshot.io.opensRequested, 1); assert.equal(io.closes(), 1); assert.ok(!JSON.stringify(result).includes('private'));
  assert.equal(Object.isFrozen(result.error), true); assert.equal(Reflect.set(result.error, 'code', 'CHANGED'), false);
  assert.equal(session.snapshot().errorCode, 'SESSION_WRITE');
});

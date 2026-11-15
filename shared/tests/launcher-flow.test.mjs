import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LauncherMessageError, LAUNCHER_FLOW_LIMITS, createLauncherLoginFlow,
  createLauncherRecordCodec, createLauncherReplyStream,
} from '../index.mjs';

const fixtures = JSON.parse(readFileSync(new URL('../../analysis/launcher-v9/original-flow-vectors.json', import.meta.url), 'utf8')).flows;
const bytes = value => new Uint8Array(Buffer.from(value, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
const join = (...parts) => Uint8Array.from(parts.flatMap(part => [...part]));
const vector = fixtures[0];
function config(v = vector, extra = {}) {
  const f = v.request_fields;
  return { endpointCount: 3, firstEndpointOrdinal: 1, requestCounter: f.counter, gameCode: f.game_code,
    usernameBytes: bytes(f.username_hex), passwordBytes: bytes(f.password_hex), ...extra };
}
function setup(v = vector, { answer = true } = {}) {
  const flow = createLauncherLoginFlow(config(v)); flow.start(0); flow.opened(1, 1);
  const challenge = flow.receive(bytes(v.challenge_hex), 1, 2); assert.equal(challenge.snapshot.state, 'challenge-ready');
  if (answer) assert.equal(flow.answerChallenge(bytes(v.fixture_exponent_hex), 1, 3).snapshot.state, 'awaiting-reply');
  return flow;
}
function assertFailure(step, code) {
  assert.equal(step.snapshot.state, 'failed'); assert.equal(step.error.code, code);
  assert.equal(step.snapshot.errorCode, code); assert.equal(step.snapshot.authentication, 'unverified');
  assert.equal(step.writes.length, 0); assert.equal(step.connectRequested, null);
}
function frame(body) { const output = new Uint8Array(body.length + 2); new DataView(output.buffer).setUint16(0, body.length, false); output.set(body, 2); return output; }
function peerRecord(plain, v = vector) {
  const codec = createLauncherRecordCodec(bytes(v.fixture_key_hex));
  try { return codec.encode(plain); } finally { codec.close(); }
}
const note = frame(Uint8Array.of(2, 0, 0, 0, 7, 0, 0, 0, 19));

test('three independent full exchanges match hello, public value and encrypted credential request bytes', () => {
  for (const v of fixtures) {
    const flow = createLauncherLoginFlow(config(v));
    const start = flow.start(0); assert.deepEqual(start.connectRequested, { attemptId: 1, endpointOrdinal: 1 });
    const opened = flow.opened(1, 1); assert.equal(hex(opened.writes[0].bytes), '0000000100000008');
    flow.receive(bytes(v.challenge_hex), 1, 2);
    const sent = flow.answerChallenge(bytes(v.fixture_exponent_hex), 1, 3);
    assert.deepEqual(sent.writes.map(value => value.attemptId), [1, 1]);
    assert.equal(hex(sent.writes[0].bytes), v.public_message_hex);
    assert.equal(hex(sent.writes[1].bytes), v.request_record_hex);
    const received = flow.receive(bytes(v.peer_wire_hex), 1, 4);
    const expected = v.expected_disposition === 'nonzero-result' ? 'rejected' : v.expected_disposition;
    assert.equal(received.snapshot.state, expected); assert.equal(received.snapshot.noticeCount, 1);
    assert.deepEqual(received.closeRequested, { attemptId: 1 }); assert.equal(received.snapshot.deadlineAtMs, null);
    assert.equal(received.snapshot.authentication, 'unverified');
    if (expected === 'profiles') assert.equal(flow.getChoices().rows.length, 4);
    else assert.equal(flow.getChoices(), null);
  }
});

test('every two-part challenge split and bytewise encrypted replies produce the same final model', () => {
  const challenge = bytes(vector.challenge_hex);
  for (let split = 0; split <= challenge.length; split += 1) {
    const flow = createLauncherLoginFlow(config()); flow.start(0); flow.opened(1, 0);
    if (split) flow.receive(challenge.subarray(0, split), 1, 1);
    if (split < challenge.length) flow.receive(challenge.subarray(split), 1, 1);
    assert.equal(flow.snapshot().state, 'challenge-ready'); flow.answerChallenge(bytes(vector.fixture_exponent_hex), 1, 2);
    let final;
    for (const value of bytes(vector.peer_wire_hex)) final = flow.receive(Uint8Array.of(value), 1, 3);
    assert.equal(final.snapshot.state, 'profiles'); assert.deepEqual(flow.getChoices().rows.map(row => row.sourceOrdinal), [1, 3, 2, 0]);
    flow.cancel();
  }
});

test('opening failures rotate one bounded endpoint cycle while keeping one deadline and no login retransmission', () => {
  const flow = createLauncherLoginFlow(config()); const states = [flow.start(100)];
  states.push(flow.openFailed(1, 101)); states.push(flow.openFailed(2, 102));
  assert.deepEqual(states.map(value => value.snapshot.endpointOrdinal), [1, 2, 0]);
  assert.deepEqual(states.map(value => value.snapshot.deadlineAtMs), [10100, 10100, 10100]);
  assert.deepEqual(states.map(value => value.snapshot.attemptId), [1, 2, 3]);
  assert.ok(states.every(value => value.writes.length === 0));
  assert.deepEqual(states[1].closeRequested, { attemptId: 1 });
  const end = flow.openFailed(3, 103); assertFailure(end, 'FLOW_ENDPOINTS_EXHAUSTED'); assert.deepEqual(end.closeRequested, { attemptId: 3 });
});

test('all endpoint counts and initial ordinals cycle finitely including initial0 and one-endpoint inputs', () => {
  for (let count = 1; count <= 10; count += 1) for (let first = 0; first < count; first += 1) {
    const flow = createLauncherLoginFlow(config(vector, { endpointCount: count, firstEndpointOrdinal: first }));
    const order = []; flow.start(0);
    for (let id = 1; id <= count; id += 1) { order.push(flow.snapshot().endpointOrdinal); flow.openFailed(id, id); }
    assert.equal(new Set(order).size, count); assert.deepEqual(order, Array.from({ length: count }, (_, i) => (first + i) % count));
    assert.equal(flow.snapshot().state, 'failed'); assert.equal(flow.snapshot().attemptsMade, count);
  }
});

test('late events from earlier attempts cannot change the current connection or its clock', () => {
  const flow = createLauncherLoginFlow(config()); flow.start(0); flow.openFailed(1, 10);
  const before = flow.snapshot();
  for (const result of [flow.opened(1, -1), flow.openFailed(1, -1), flow.receive(null, 1, -1), flow.remoteClosed(1, -1)]) {
    assert.equal(result.ignored, true); assert.deepEqual(result.snapshot, before); assert.equal(result.closeRequested, null);
  }
  assert.equal(flow.opened(2, 11).snapshot.state, 'awaiting-challenge');
  flow.receive(bytes(vector.challenge_hex), 2, 12);
  assert.equal(hex(flow.answerChallenge(bytes(vector.fixture_exponent_hex), 2, 13).writes[1].bytes), vector.request_record_hex);
  flow.cancel();
});

test('only pre-request opening failures rotate; opened-connection failures do not replay credentials', () => {
  const flow = createLauncherLoginFlow(config()); flow.start(0); flow.opened(1, 1);
  const wrong = flow.openFailed(1, 2); assertFailure(wrong, 'FLOW_STATE'); assert.equal(wrong.connectRequested, null);
  const closed = setup(); const result = closed.remoteClosed(1, 4); assertFailure(result, 'FLOW_REMOTE_CLOSED'); assert.equal(result.snapshot.attemptsMade, 1);
});

test('10s deadline terminates each waiting phase and clears the active connection', () => {
  for (const target of ['connecting', 'awaiting-challenge', 'challenge-ready', 'awaiting-reply']) {
    const flow = createLauncherLoginFlow(config()); flow.start(0);
    if (target !== 'connecting') flow.opened(1, 1);
    if (['challenge-ready', 'awaiting-reply'].includes(target)) flow.receive(bytes(vector.challenge_hex), 1, 2);
    if (target === 'awaiting-reply') flow.answerChallenge(bytes(vector.fixture_exponent_hex), 1, 3);
    assert.equal(flow.tick(9999).snapshot.state, target);
    const end = flow.tick(10000); assert.equal(end.snapshot.state, 'timed-out'); assert.equal(end.error.code, 'FLOW_TIMEOUT');
    assert.deepEqual(end.closeRequested, { attemptId: 1 }); assert.equal(end.snapshot.deadlineAtMs, null);
    assert.equal(flow.getChoices(), null); assert.equal(flow.receive(bytes(vector.peer_wire_hex), 1, 10001).ignored, true);
  }
});

test('deadline wins over a packet/open event at the boundary and never resets on failover', () => {
  const flow = setup(); const result = flow.receive(bytes(vector.peer_wire_hex), 1, 10000);
  assert.equal(result.snapshot.state, 'timed-out'); assert.equal(flow.getChoices(), null);
  const retry = createLauncherLoginFlow(config()); retry.start(0); retry.openFailed(1, 9999);
  const late = retry.opened(2, 10000); assert.equal(late.snapshot.state, 'timed-out'); assert.equal(late.writes.length, 0);
});

test('a completed reply disarms the wait deadline and ignores late timer/close/data events', () => {
  const flow = setup(); flow.receive(bytes(vector.peer_wire_hex), 1, 9999);
  assert.equal(flow.tick(999999).snapshot.state, 'profiles');
  const before = flow.snapshot();
  for (const result of [flow.remoteClosed(1, 0), flow.receive(null, 1, 0), flow.openFailed(1, 0), flow.opened(1, 0)]) {
    assert.equal(result.ignored, true); assert.deepEqual(result.snapshot, before);
  }
  flow.cancel();
});

test('clock inputs are explicit monotonic safe integers, without hidden Date or sleeping', () => {
  for (const now of [-1, NaN, Infinity, 1.5, '0', undefined, Number.MAX_SAFE_INTEGER]) {
    const flow = createLauncherLoginFlow(config()); assertFailure(flow.start(now), 'FLOW_CLOCK');
  }
  const flow = createLauncherLoginFlow(config()); flow.start(100);
  assertFailure(flow.opened(1, 99), 'FLOW_CLOCK');
  const running = setup(); assertFailure(running.tick(2), 'FLOW_CLOCK');
});

test('partial challenge bytes are owned and malformed status/count/hex/trailing data fail closed', () => {
  const flow = createLauncherLoginFlow(config()); flow.start(0); flow.opened(1, 0);
  const input = bytes(vector.challenge_hex), prefix = input.slice(0, 10); flow.receive(prefix, 1, 1); prefix.fill(255);
  assert.equal(flow.receive(input.subarray(10), 1, 2).snapshot.state, 'challenge-ready');
  assert.equal(hex(flow.answerChallenge(bytes(vector.fixture_exponent_hex), 1, 3).writes[0].bytes), vector.public_message_hex); flow.cancel();
  const cases = [
    [Uint8Array.of(0,0,0,1), 'HANDSHAKE_REJECTED'],
    [Uint8Array.of(0,0,0,0,0,0,0,0), 'HANDSHAKE_HEX_BUDGET'],
    [Uint8Array.of(0,0,0,0,0,0,0,63), 'HANDSHAKE_HEX_BUDGET'],
    [join(input, Uint8Array.of(0)), 'FLOW_HANDSHAKE_TRAILING'],
    [new Uint8Array(2123), 'HANDSHAKE_BUDGET'],
    [new Uint8Array(65537), 'FLOW_CHUNK_BUDGET'],
  ];
  const wrongHex = input.slice(); wrongHex[8] = 71; cases.push([wrongHex, 'HANDSHAKE_HEX']);
  for (const [data, code] of cases) {
    const candidate = createLauncherLoginFlow(config()); candidate.start(0); candidate.opened(1, 0);
    const failed = candidate.receive(data, 1, 1); assertFailure(failed, code); assert.deepEqual(failed.closeRequested, { attemptId: 1 });
  }
});

test('missing challenge bytes or private exponent fail without fabricating a response', () => {
  const flow = createLauncherLoginFlow(config()); flow.start(0); flow.opened(1, 0); flow.receive(bytes(vector.challenge_hex).subarray(0, 9), 1, 1);
  assertFailure(flow.remoteClosed(1, 2), 'HANDSHAKE_TRUNCATED');
  const unready = createLauncherLoginFlow(config()); unready.start(0); unready.opened(1, 0);
  assertFailure(unready.answerChallenge(bytes(vector.fixture_exponent_hex), 1, 1), 'FLOW_STATE');
  const ready = setup(vector, { answer: false }); assertFailure(ready.answerChallenge(new Uint8Array(19), 1, 3), 'HANDSHAKE_EXPONENT');
});

test('unexpected state/attempt events close safely and repeated start does not reset the deadline', () => {
  const flow = createLauncherLoginFlow(config()); flow.start(10); const first = flow.snapshot();
  assert.equal(flow.start(1000).ignored, true); assert.deepEqual(flow.snapshot(), first);
  assertFailure(flow.receive(Uint8Array.of(1), 1, 11), 'FLOW_STATE');
  for (const id of [0, -1, 0.5, '1', NaN]) {
    const candidate = createLauncherLoginFlow(config()); candidate.start(0); assertFailure(candidate.opened(id, 1), 'FLOW_ATTEMPT');
  }
});

test('truncated record and inner frame EOFs preserve their first error and close all processing', () => {
  const record = bytes(vector.peer_wire_hex), partialRecord = setup(); partialRecord.receive(record.subarray(0, 9), 1, 4);
  assertFailure(partialRecord.remoteClosed(1, 5), 'RECORD_TRUNCATED');
  const partialFrame = setup(); partialFrame.receive(peerRecord(Uint8Array.of(0)), 1, 4);
  assertFailure(partialFrame.remoteClosed(1, 5), 'REPLY_FRAME_TRUNCATED');
  const noteOnly = setup(); assert.equal(noteOnly.receive(peerRecord(note), 1, 4).snapshot.noticeCount, 1);
  assertFailure(noteOnly.remoteClosed(1, 5), 'FLOW_REMOTE_CLOSED');
});

test('a malformed final batch never exposes partial choices, duplicate messages or trailing fragments', () => {
  const final = frame(bytes(vector.profile_body_hex));
  for (const wire of [peerRecord(join(final, final)), peerRecord(join(final, note)), peerRecord(join(final, Uint8Array.of(0))),
    join(peerRecord(final), Uint8Array.of(0))]) {
    const flow = setup(); const result = flow.receive(wire, 1, 4); assertFailure(result, 'FLOW_REPLY_ORDER');
    assert.equal(flow.getChoices(), null); assert.equal(result.notices.length, 0);
  }
});

test('preliminary type2 replies are bounded and never advance to authenticated/profile state', () => {
  const flow = setup(), full = new Uint8Array(note.length * 64);
  for (let i = 0; i < 64; i += 1) full.set(note, i * note.length);
  const accepted = flow.receive(peerRecord(full), 1, 4); assert.equal(accepted.notices.length, 64);
  assert.equal(accepted.snapshot.state, 'awaiting-reply'); assert.equal(flow.getChoices(), null);
  assertFailure(flow.receive(peerRecord(note), 1, 5), 'FLOW_NOTICE_BUDGET');
});

test('profile outputs are isolated and cannot mutate internal state to bypass row restrictions', () => {
  const flow = setup(); flow.receive(bytes(vector.peer_wire_hex), 1, 4);
  const model = flow.getChoices(); model.reply.wordLists[1].fill(0); model.reply.wordLists[2].fill(0); model.reply.wordLists[4].fill(0);
  model.rows[3].nameBytes.fill(0); model.reply.byteField.fill(0);
  assert.throws(() => flow.selectProfile(0), e => e instanceof LauncherMessageError && e.code === 'PROFILE_RESTRICTED');
  assert.equal(flow.snapshot().state, 'profiles');
  const result = flow.selectProfile(3); assert.equal(result.snapshot.state, 'selected'); assert.equal(result.selection.profile.sourceOrdinal, 0);
  assert.equal(hex(result.selection.profile.nameBytes), hex(new TextEncoder().encode('zeta')));
  assert.equal(result.selection.opaqueByteField[31], 31); assert.equal(result.selection.authentication, 'unverified');
  assert.equal(flow.getChoices(), null); assert.equal(flow.cancel().ignored, true);
});

test('cancel is idempotent across idle, live wire and profile states and clears retained choices', () => {
  const idle = createLauncherLoginFlow(config()); assert.equal(idle.cancel().closeRequested, null); assert.equal(idle.snapshot().state, 'cancelled');
  for (const phase of ['connecting', 'challenge-ready', 'awaiting-reply', 'profiles']) {
    const flow = phase === 'connecting' ? createLauncherLoginFlow(config()) : setup(vector, { answer: phase !== 'challenge-ready' });
    if (phase === 'connecting') flow.start(0);
    if (phase === 'profiles') flow.receive(bytes(vector.peer_wire_hex), 1, 4);
    const result = flow.cancel(); assert.equal(result.snapshot.state, 'cancelled'); assert.equal(flow.getChoices(), null);
    assert.equal(result.closeRequested?.attemptId ?? null, phase === 'profiles' ? null : 1);
    assert.equal(flow.cancel().ignored, true); assert.equal(flow.snapshot().errorCode, null);
  }
});

test('owned buffers and offset subclasses preserve complete exchange bytes without species calls', () => {
  class Input extends Uint8Array { static get [Symbol.species]() { throw new Error('no species'); } }
  const fields = config(), input = fields.usernameBytes; const flow = createLauncherLoginFlow(fields); input.fill(0);
  flow.start(0); const hello = flow.opened(1, 0); hello.writes[0].bytes.fill(255);
  const challenge = bytes(vector.challenge_hex), backing = new Input(challenge.length + 20); backing.set(challenge, 9);
  flow.receive(new Input(backing.buffer, 9, challenge.length), 1, 1); backing.fill(0);
  assert.equal(hex(flow.answerChallenge(bytes(vector.fixture_exponent_hex).buffer, 1, 2).writes[1].bytes), vector.request_record_hex);
  flow.cancel();
});

test('configuration bounds and safe metadata prevent endpoint coercion or secret output', () => {
  assert.ok(Object.isFrozen(LAUNCHER_FLOW_LIMITS));
  for (const extra of [{ endpointCount: 0 }, { endpointCount: 11 }, { endpointCount: '3' }, { firstEndpointOrdinal: -1 }, { firstEndpointOrdinal: 3 }, { firstEndpointOrdinal: 0.5 }]) {
    assert.throws(() => createLauncherLoginFlow(config(vector, extra)), e => e.code === 'FLOW_ENDPOINTS');
  }
  const flow = setup(); const metadata = JSON.stringify(flow.snapshot());
  assert.ok(!/username|password|keyBytes|challenge|byteField/i.test(metadata)); assert.equal(flow.snapshot().authentication, 'unverified');
  assert.ok(Object.isFrozen(flow.snapshot())); flow.cancel();
});

test('reply stream explicit close discards partial plaintext without turning a cancellation into a parse failure', () => {
  const stream = createLauncherReplyStream(); stream.push(Uint8Array.of(0, 9, 2)); assert.equal(stream.pendingByteLength, 3);
  stream.close(); stream.close(); assert.equal(stream.pendingByteLength, 0); assert.equal(stream.closed, true); assert.equal(stream.failed, false);
  assert.throws(() => stream.push(new Uint8Array()), e => e.code === 'REPLY_STREAM_CLOSED');
  const bad = createLauncherReplyStream(); assert.throws(() => bad.push(Uint8Array.of(0, 1, 255))); bad.close(); assert.equal(bad.failed, true);
});

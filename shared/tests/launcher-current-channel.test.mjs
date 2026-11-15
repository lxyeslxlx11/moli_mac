import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as core from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-channel-v1/original-vectors.json', import.meta.url)));
const group = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-channel-v1/public-group.json', import.meta.url)));
const bytes = value => Uint8Array.from(Buffer.from(value, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
const config = extra => ({ endpointCount: 1, firstEndpointOrdinal: 0, requestCounter: 7, gameCode: 11,
  usernameBytes: new TextEncoder().encode('FixtureU'), passwordBytes: new TextEncoder().encode('FixtureP'),
  handshakeProfile: 'current', ...extra });

test('current profile rejects a changed source group before becoming challenge-ready', () => {
  const flow = core.createLauncherLoginFlow(config());
  try {
    flow.start(0); flow.opened(1, 1);
    const step = flow.receive(bytes(vectors.invalid[2].hex), 1, 2);
    assert.equal(step.snapshot.state, 'failed');
    assert.equal(step.error.code, 'HANDSHAKE_GROUP');
    assert.equal(step.writes.length, 0);
    assert.equal(step.snapshot.authentication, 'unverified');
  } finally { flow.cancel(); }
});

test('current public group and arithmetic match independent Python fixtures including native p-1', () => {
  assert.equal(core.LAUNCHER_CURRENT_CHANNEL_PROFILE.modulusHex, group.modulusHex);
  assert.equal(core.LAUNCHER_CURRENT_CHANNEL_PROFILE.challengeBytes, 784);
  for (const v of vectors.valid) {
    const input = bytes(v.challenge_hex), exponent = bytes(v.public_fixture_exponent_hex);
    const decoded = core.decodeLauncherCurrentHandshakeChallenge(input);
    assert.equal(decoded.generatorHex, '2');
    assert.equal(decoded.modulusHex, group.modulusHex);
    const result = core.answerLauncherCurrentHandshake(input, exponent);
    assert.equal(hex(result.publicMessage), v.expected_public_message_hex, v.name);
    assert.equal(hex(result.keyBytes), v.public_fixture_key_hex, v.name);
    result.keyBytes.fill(0);
  }
});

test('current decoder rejects source spelling/value and peer bounds without changing generic decode', () => {
  for (const v of vectors.invalid) {
    assert.throws(() => core.decodeLauncherCurrentHandshakeChallenge(bytes(v.hex)), undefined, v.name);
  }
  const otherCase = bytes(vectors.invalid[2].hex);
  assert.equal(core.decodeLauncherHandshakeChallenge(otherCase).modulusHex, group.modulusHex.toUpperCase());
  assert.throws(() => core.decodeLauncherCurrentHandshakeChallenge(new Uint8Array(785)), { code: 'HANDSHAKE_BUDGET' });
  for (const value of [null, '', {}, new Uint16Array(1)]) {
    assert.throws(() => core.decodeLauncherCurrentHandshakeChallenge(value));
  }
});

test('current flow handles every challenge split and emits the independent public answer', () => {
  const v = vectors.valid[0], challenge = bytes(v.challenge_hex);
  for (let at = 0; at <= challenge.length; at++) {
    const flow = core.createLauncherLoginFlow(config());
    flow.start(0);
    assert.equal(hex(flow.opened(1, 1).writes[0].bytes), vectors.hello_hex);
    if (at) flow.receive(challenge.subarray(0, at), 1, 2);
    if (at < challenge.length) flow.receive(challenge.subarray(at), 1, 2);
    assert.equal(flow.snapshot().state, 'challenge-ready');
    assert.equal(flow.snapshot().handshakeProfile, 'current');
    const sent = flow.answerChallenge(bytes(v.public_fixture_exponent_hex), 1, 3);
    assert.equal(hex(sent.writes[0].bytes), v.expected_public_message_hex);
    assert.equal(sent.snapshot.authentication, 'unverified');
    flow.cancel();
  }
});

test('unknown profile and current field overflow fail before any answer', () => {
  for (const value of [null, 'other', 0, {}, true]) {
    assert.throws(() => core.createLauncherLoginFlow(config({ handshakeProfile: value })), { code: 'INVALID_INPUT' });
  }
  const flow = core.createLauncherLoginFlow(config());
  flow.start(0); flow.opened(1, 1);
  const value = new Uint8Array(8); new DataView(value.buffer).setUint32(4, 257, false);
  assert.equal(flow.receive(value, 1, 2).snapshot.state, 'failed');
});

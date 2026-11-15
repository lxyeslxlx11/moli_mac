import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLauncherSession } from '../launcher-session.mjs';
import { createLauncherRecordCodec } from '../../shared/index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-channel-v1/original-vectors.json', import.meta.url)));
const replies = JSON.parse(readFileSync(new URL('../../analysis/launcher-v8/original-login-vectors.json', import.meta.url)));
const bytes = text => Uint8Array.from(Buffer.from(text, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
const empty = replies.profiles.find(v => v.expected.disposition === 'no-profiles');
const body = bytes(empty.body_hex), frame = new Uint8Array(body.length + 2);
new DataView(frame.buffer).setUint16(0, body.length, false); frame.set(body, 2);
function input(v, port, extra = {}) {
  return { endpoints: [{ address: 'original.invalid', port: 12345 }], firstEndpointOrdinal: 0,
    requestCounter: 7, gameCode: 11, usernameBytes: new TextEncoder().encode('FixtureU'),
    passwordBytes: new TextEncoder().encode('FixtureP'), handshakeProfile: 'current',
    openStream: () => port, randomBytes: () => bytes(v.public_fixture_exponent_hex), ...extra };
}

test('web session forwards the current profile through all independent public-answer vectors', async () => {
  for (const v of vectors.valid) {
    const codec = createLauncherRecordCodec(bytes(v.public_fixture_key_hex));
    const parts = [bytes(v.challenge_hex), codec.encode(frame)]; codec.close();
    const writes = []; let closes = 0;
    const port = { async read() { return parts.shift() ?? null; },
      async write(value) { writes.push(new Uint8Array(value)); }, close() { closes++; } };
    const session = createLauncherSession(input(v, port));
    const result = await session.start();
    assert.equal(result.snapshot.flow.handshakeProfile, 'current');
    assert.equal(result.snapshot.state, 'no-profiles');
    assert.equal(hex(writes[0]), vectors.hello_hex);
    assert.equal(hex(writes[1]), v.expected_public_message_hex);
    assert.equal(writes.length, 3); assert.equal(closes, 1);
    assert.equal(result.snapshot.io.entropyRequests, 1);
    assert.equal(result.snapshot.authentication, 'unverified');
  }
});

test('current group mismatch closes after only hello, before entropy or credential writes', async () => {
  const writes = []; let closes = 0, entropy = 0;
  const port = { async read() { return bytes(vectors.invalid[2].hex); },
    async write(value) { writes.push(new Uint8Array(value)); }, close() { closes++; } };
  const session = createLauncherSession(input(vectors.valid[0], port, { randomBytes() { entropy++; throw new Error('not reached'); } }));
  const result = await session.start();
  assert.equal(result.snapshot.state, 'failed'); assert.equal(result.snapshot.errorCode, 'HANDSHAKE_GROUP');
  assert.equal(entropy, 0); assert.equal(result.snapshot.io.entropyRequests, 0);
  assert.deepEqual(writes.map(hex), [vectors.hello_hex]); assert.equal(closes, 1);
});

test('session profile must be an own data property when supplied', () => {
  const options = input(vectors.valid[0], {}); let touched = false;
  Object.defineProperty(options, 'handshakeProfile', { get() { touched = true; return 'current'; } });
  assert.throws(() => createLauncherSession(options), { code: 'SESSION_INPUT' });
  assert.equal(touched, false);
});

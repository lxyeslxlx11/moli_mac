import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLauncherSession } from '../launcher-session.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-record-v1/original-vectors.json', import.meta.url)));
const bytes = text => Uint8Array.from(Buffer.from(text, 'hex'));
const hex = value => Buffer.from(value).toString('hex');

test('current session uses exact current writes and consumes empty plus reply records for3 synthetic exchanges', async () => {
  for (const row of v.flow_exchanges) {
    const parts = [bytes(row.challenge_hex), bytes('0000000000000000' + row.empty_reply_record_hex)];
    const writes = []; let closes = 0;
    const session = createLauncherSession({ endpoints: [{ address: 'original.invalid', port: 12345 }],
      firstEndpointOrdinal: 0, requestCounter: 7, gameCode: 11, usernameBytes: new TextEncoder().encode('FixtureU'),
      passwordBytes: new TextEncoder().encode('FixtureP'), handshakeProfile: 'current',
      randomBytes: () => bytes(row.public_fixture_exponent_hex), openStream: () => ({
        async read() { return parts.shift() ?? null; }, async write(value) { writes.push(hex(value)); }, close() { closes++; },
      }) });
    const result = await session.start();
    assert.equal(result.snapshot.state, 'no-profiles');
    assert.deepEqual(writes, ['0000000100000008', row.public_message_hex, row.request_record_hex]);
    assert.equal(result.snapshot.authentication, 'unverified'); assert.equal(result.snapshot.io.entropyRequests, 1);
    assert.equal(closes, 1);
  }
});

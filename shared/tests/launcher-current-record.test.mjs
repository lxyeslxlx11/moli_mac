import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as core from '../index.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-record-v1/original-vectors.json', import.meta.url)));
const bytes = text => Uint8Array.from(Buffer.from(text, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
const config = { endpointCount: 1, firstEndpointOrdinal: 0, requestCounter: 7, gameCode: 11,
  usernameBytes: new TextEncoder().encode('FixtureU'), passwordBytes: new TextEncoder().encode('FixtureP'), handshakeProfile: 'current' };

test('current flow emits source-current ceil-plus-extra record bytes, not the older floor rule', () => {
  for (const row of v.flow_exchanges) {
    const flow = core.createLauncherLoginFlow(config);
    try {
      flow.start(0); flow.opened(1, 1); flow.receive(bytes(row.challenge_hex), 1, 2);
      const sent = flow.answerChallenge(bytes(row.public_fixture_exponent_hex), 1, 3);
      assert.equal(hex(sent.writes[0].bytes), row.public_message_hex);
      assert.equal(hex(sent.writes[1].bytes), row.request_record_hex, row.name);
      assert.equal(sent.snapshot.authentication, 'unverified');
    } finally { flow.cancel(); }
  }
});

test('current record encoder and decoder match independent ECB vectors and maximum digest', () => {
  assert.equal(core.LAUNCHER_CURRENT_RECORD_PROFILE.minimumCiphertextBytes, 0);
  assert.equal(core.LAUNCHER_CURRENT_RECORD_PROFILE.outgoingPlaintextBytes, 0x7fc8);
  assert.equal(core.LAUNCHER_CURRENT_RECORD_PROFILE.ciphertextBytes, 0x7ff8);
  for (const row of v.records) {
    const codec = core.createLauncherCurrentRecordCodec(bytes(row.public_fixture_key_hex));
    try {
      const encoded = codec.encode(bytes(row.plaintext_hex));
      assert.equal(hex(encoded), row.record_hex, row.name);
      assert.equal(hex(codec.decode(bytes(row.record_hex))), row.plaintext_hex, row.name);
      assert.equal(hex(codec.encode(bytes(row.plaintext_hex))), row.record_hex, 'schedule unchanged');
    } finally { codec.close(); }
  }
  const codec = core.createLauncherCurrentRecordCodec(bytes(v.maximum.public_fixture_key_hex));
  try {
    const plain = Uint8Array.from({ length: v.maximum.plaintext_bytes }, (_, i) => i * v.maximum.pattern_multiplier % 256);
    const encoded = codec.encode(plain);
    assert.equal(encoded.length, v.maximum.record_bytes);
    assert.equal(createHash('sha256').update(encoded).digest('hex'), v.maximum.record_sha256);
    assert.deepEqual(codec.decode(encoded), plain);
  } finally { codec.close(); }
});

test('current receive accepts native zero-cipher and declared prefixes, preserving older generic policy', () => {
  for (const row of v.decode_only) {
    const codec = core.createLauncherCurrentRecordCodec(bytes(row.public_fixture_key_hex));
    try { assert.equal(hex(codec.decode(bytes(row.record_hex))), row.plaintext_hex, row.name); }
    finally { codec.close(); }
  }
  const codec = core.createLauncherRecordCodec(bytes(v.decode_only[0].public_fixture_key_hex));
  try { assert.throws(() => codec.decode(bytes(v.decode_only[0].record_hex)), { code: 'RECORD_LENGTH' }); }
  finally { codec.close(); }
});

test('current stream accepts zero plus nonempty records across all65 two-part splits', () => {
  const rows = [v.decode_only[0], v.records[1], v.records[4]];
  // Re-encode the nonempty original data under one public fixture key for this stream.
  const key = bytes(rows[0].public_fixture_key_hex), encoder = core.createLauncherCurrentRecordCodec(key);
  const wire = Uint8Array.from(Buffer.concat([Buffer.from(rows[0].record_hex, 'hex'),
    ...rows.slice(1).map(row => Buffer.from(encoder.encode(bytes(row.plaintext_hex))))]));
  encoder.close(); assert.equal(wire.length, 64);
  for (let at = 0; at <= wire.length; at++) {
    const stream = core.createLauncherCurrentRecordStream(key);
    try {
      const got = [...stream.push(wire.subarray(0, at)), ...stream.push(wire.subarray(at))];
      assert.deepEqual(got.map(hex), rows.map(row => row.plaintext_hex));
      assert.equal(stream.pendingByteLength, 0); stream.finish(); assert.equal(stream.closed, true);
    } finally { stream.close(); }
  }
});

test('current record boundaries fail explicitly and terminate an invalid stream', () => {
  const key = bytes(v.records[0].public_fixture_key_hex), codec = core.createLauncherCurrentRecordCodec(key);
  const header = (cipher, plain) => { const b = new Uint8Array(8), d = new DataView(b.buffer); d.setUint32(0, cipher, false); d.setUint32(4, plain, false); return b; };
  try {
    for (const b of [header(1, 0), header(0x8000, 0), header(0, 1), new Uint8Array(7)]) assert.throws(() => codec.decode(b));
    assert.throws(() => codec.encode(new Uint8Array(0x7fc9)), { code: 'RECORD_BUDGET' });
  } finally { codec.close(); }
  assert.throws(() => core.createLauncherCurrentRecordCodec(new Uint8Array(7)), { code: 'RECORD_KEY_LENGTH' });
  for (const input of [header(0, 1), new Uint8Array(65537)]) {
    const stream = core.createLauncherCurrentRecordStream(key);
    assert.throws(() => stream.push(input)); assert.equal(stream.closed, true); assert.equal(stream.failed, true);
  }
  const truncated = core.createLauncherCurrentRecordStream(key); truncated.push(new Uint8Array(7));
  assert.throws(() => truncated.finish(), { code: 'RECORD_TRUNCATED' }); assert.equal(truncated.closed, true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { encodeLauncherHandoffWrite, createLauncherHandoffLease, LauncherHandoffError,
  decodeLauncherReply, selectLauncherProfile } from '../index.mjs';
const vectors = JSON.parse(await readFile(new URL('../../analysis/launcher-v22/original-handoff-vectors.json', import.meta.url)));
const replies = JSON.parse(await readFile(new URL('../../analysis/launcher-v8/original-login-vectors.json', import.meta.url)));
const unhex = value => Uint8Array.from(Buffer.from(value, 'hex'));
const hex = value => Buffer.from(value).toString('hex');
function input(value = vectors.cases[0]) {
  return { gameCode: value.game_code, selection: { profile: { nameBytes: unhex(value.name_hex), stateWord: 0, billingWord: 0, expiredWord: 0 },
    opaqueByteField: unhex(value.opaque_hex), tailWordA: value.tail_word_a } };
}

test('126 independent raw-byte/radix/mapping vectors match the actual producer exactly', () => {
  assert.equal(vectors.cases.length, 126); assert.equal(vectors.scalar_cases, 94);
  for (const vector of vectors.cases) {
    const write = encodeLauncherHandoffWrite(input(vector));
    assert.equal(hex(write.bytes), vector.expected.write_hex, vector.name);
    assert.equal(write.mappingName, vector.expected.mapping_name); assert.equal(write.capacity, 256);
    assert.equal(write.authentication, 'unverified'); assert.equal(write.gameAcceptance, 'unverified');
    write.bytes.fill(0);
  }
});
test('42 original decoded-reply selections project to independent native-format handoffs', () => {
  assert.equal(vectors.reply_projections.length, 42);
  for (const projection of vectors.reply_projections) {
    const fixture = replies.profiles.find(row => row.name === projection.fixture);
    const selection = selectLauncherProfile(decodeLauncherReply(unhex(fixture.body_hex)), projection.display_ordinal);
    const write = encodeLauncherHandoffWrite({ gameCode: 11, selection });
    assert.equal(hex(write.bytes), projection.expected.write_hex, projection.fixture);
    write.bytes.fill(0); selection.opaqueByteField.fill(0); selection.profile.nameBytes.fill(0);
  }
});
test('opaque byte fields use the first NUL, retain native trailing space and encode zero as one digit', () => {
  const fields = input(); fields.selection.profile.nameBytes = unhex('41');
  fields.selection.opaqueByteField = unhex('80420043ff'); fields.selection.tailWordA = 0x80000000;
  const write = encodeLauncherHandoffWrite(fields);
  assert.equal(hex(write.bytes), '6769643a4120676c743a80423a302000');
  assert.deepEqual(fields.selection.opaqueByteField, unhex('80420043ff'));
});
test('only the NUL-terminated prefix is written, preserving an existing mapping tail', () => {
  const vector = vectors.cases.find(row => row.name === 'max-name-nul-32'), write = encodeLauncherHandoffWrite(input(vector));
  assert.equal(write.bytes.length, 92); assert.equal(write.bytes.at(-1), 0); assert.equal(write.bytes.at(-2), 0x20);
  const mapping = new Uint8Array(256).fill(0xa5); mapping.set(write.bytes);
  assert.equal(mapping.subarray(92).every(byte => byte === 0xa5), true);
});
test('profile raw state and billing gates are rechecked instead of trusting a supplied passes flag', () => {
  for (const profile of [{ stateWord: 0xffffffff }, { stateWord: 0x10001 }, { stateWord: 0x1234fffd },
    { billingWord: 1, expiredWord: 1 }]) {
    const fields = input(); Object.assign(fields.selection.profile, profile, { selectionGate: { passes: true } });
    assert.throws(() => encodeLauncherHandoffWrite(fields), { code: 'HANDOFF_PROFILE' });
  }
  for (const stateWord of [0xfffffffc, 0xfffc, 0x10000, 0x1234fffc]) {
    const allowed = input(); allowed.selection.profile.stateWord = stateWord;
    assert.equal(encodeLauncherHandoffWrite(allowed).mappingName, 'CGSharedMem');
  }
});
test('invalid game, word, name and opaque bounds are rejected before producing a write', () => {
  for (const code of [-1, 15, '11', NaN, {}, 1n]) assert.throws(() => encodeLauncherHandoffWrite({ ...input(), gameCode: code }), { code: 'HANDOFF_GAME' });
  for (const value of [-1, 0x100000000, '1', Infinity]) {
    const fields = input(); fields.selection.tailWordA = value;
    assert.throws(() => encodeLauncherHandoffWrite(fields), { code: 'HANDOFF_INPUT' });
  }
  for (const value of [new Uint8Array(0), new Uint8Array(42), new Uint16Array(2), new Proxy(new Uint8Array([65]), {})]) {
    const fields = input(); fields.selection.profile.nameBytes = value;
    assert.throws(() => encodeLauncherHandoffWrite(fields), { code: 'HANDOFF_BYTES' });
  }
  const zero = input(); zero.selection.profile.nameBytes = new Uint8Array([65, 0]);
  assert.throws(() => encodeLauncherHandoffWrite(zero), { code: 'HANDOFF_PROFILE' });
  const long = input(); long.selection.opaqueByteField = new Uint8Array(33);
  assert.throws(() => encodeLauncherHandoffWrite(long), { code: 'HANDOFF_BYTES' });
  if (typeof SharedArrayBuffer === 'function') {
    const shared = input(); shared.selection.opaqueByteField = new Uint8Array(new SharedArrayBuffer(8));
    assert.throws(() => encodeLauncherHandoffWrite(shared), { code: 'HANDOFF_BYTES' });
  }
});
test('inputs require own data properties and never invoke getters or echo supplied fields', () => {
  let touched = false; const fields = input();
  assert.throws(() => encodeLauncherHandoffWrite(Object.create(fields)), { code: 'HANDOFF_INPUT' });
  assert.throws(() => encodeLauncherHandoffWrite({ ...fields, get selection() { touched = true; return fields.selection; } }), { code: 'HANDOFF_INPUT' });
  const nested = input(); Object.defineProperty(nested.selection.profile, 'nameBytes', { get() { touched = true; return new Uint8Array([65]); } });
  assert.throws(() => encodeLauncherHandoffWrite(nested), { code: 'HANDOFF_INPUT' });
  assert.equal(touched, false);
  const error = new LauncherHandoffError({ toString() { throw new Error('No coercion'); } });
  assert.equal(error.code, 'HANDOFF_INPUT'); assert.deepEqual(Object.keys(error).sort(), ['code', 'name']);
});
test('byte subclasses, offsets and later caller mutations cannot alter prepared output', () => {
  class MisleadingBytes extends Uint8Array { get length() { throw new Error(); } [Symbol.iterator]() { throw new Error(); } }
  const fields = input(), backing = new Uint8Array([0xff, 65, 66, 0xff]);
  fields.selection.profile.nameBytes = new MisleadingBytes(backing.buffer, 1, 2);
  const original = fields.selection.opaqueByteField.slice(), write = encodeLauncherHandoffWrite(fields), copy = write.bytes.slice();
  assert.deepEqual(fields.selection.opaqueByteField, original); backing.fill(0); fields.selection.opaqueByteField.fill(0);
  assert.deepEqual(write.bytes, copy);
});
test('lease exposes one write, close wipes its borrowed view, and snapshots contain no payload', () => {
  const fields = input(), lease = createLauncherHandoffLease(fields);
  assert.equal(lease.snapshot().state, 'ready'); assert.equal(Object.hasOwn(lease.snapshot(), 'bytes'), false);
  assert.ok(Object.isFrozen(lease)); assert.ok(Object.isFrozen(lease.snapshot()));
  const write = lease.takeWrite(); assert.equal(lease.snapshot().state, 'taken');
  assert.throws(() => lease.takeWrite(), { code: 'HANDOFF_STATE' }); assert.ok(write.bytes.some(byte => byte !== 0));
  lease.close(); assert.equal(lease.snapshot().state, 'closed'); assert.equal(lease.snapshot().writeBytes, 0);
  assert.equal(write.bytes.every(byte => byte === 0), true); lease.close();
  assert.throws(() => lease.takeWrite(), { code: 'HANDOFF_STATE' });
  assert.deepEqual(fields.selection.profile.nameBytes, unhex(vectors.cases[0].name_hex));
});
test('closing before exposure and native no-mapping branches never produce a consumable write', () => {
  const lease = createLauncherHandoffLease(input()); lease.close();
  assert.throws(() => lease.takeWrite(), { code: 'HANDOFF_STATE' });
  for (const gameCode of [8, 10, 12, 13, 14]) {
    const unused = createLauncherHandoffLease({ ...input(), gameCode });
    assert.equal(unused.snapshot().state, 'not-required'); assert.equal(unused.snapshot().mappingName, null);
    assert.throws(() => unused.takeWrite(), { code: 'HANDOFF_STATE' }); unused.close();
  }
});

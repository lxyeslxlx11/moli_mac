import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LAUNCHER_LOGIN_LIMITS, LauncherMessageError, decodeLauncherRequest10, decodeLauncherRequest10Frame,
  encodeLauncherRequest10, encodeLauncherLoginRequest, encodeLauncherLoginRequestFrame,
  decodeLauncherReply, createLauncherReplyStream, createLauncherProfileChoices,
  decodeLauncherProfileChoices, selectLauncherProfile, createLauncherRecordCodec, createLauncherRecordStream,
} from '../index.mjs';

const fixture = JSON.parse(readFileSync(new URL('../../analysis/launcher-v8/original-login-vectors.json', import.meta.url), 'utf8'));
const fromHex = text => new Uint8Array(Buffer.from(text, 'hex'));
const hex = input => Buffer.from(input).toString('hex');
const pub = text => new TextEncoder().encode(text);
const join = (...parts) => Uint8Array.from(parts.flatMap(part => [...part]));
function error(code, action) { assert.throws(action, e => e instanceof LauncherMessageError && (!code || e.code === code)); }
const baseFields = () => ({ requestCounter: 7, gameCode: 11, usernameBytes: pub('SyntheticU'), passwordBytes: pub('SyntheticP') });
function oneRow({ state = 0, billing = 0, expired = 0, name = pub('FixtureID') } = {}) {
  return { type: 11, wordA: 7, wordB: 0, byteField: Uint8Array.of(1, 2, 3), byteList: [name],
    wordLists: [new Uint32Array(), Uint32Array.of(state), Uint32Array.of(billing), Uint32Array.of(99), Uint32Array.of(expired)],
    tailWordA: 0x80000001, tailWordB: 19 };
}

test('UI-bound requests match three independent Python struct vectors without text transformations', () => {
  assert.ok(Object.isFrozen(LAUNCHER_LOGIN_LIMITS));
  for (const v of fixture.requests) {
    const fields = { requestCounter: v.counter, gameCode: v.game_code, usernameBytes: fromHex(v.username_hex), passwordBytes: fromHex(v.password_hex) };
    assert.equal(hex(encodeLauncherLoginRequest(fields)), v.body_hex, v.name);
    assert.equal(hex(encodeLauncherLoginRequestFrame(fields)), v.frame_hex, v.name);
    const decoded = decodeLauncherRequest10Frame(encodeLauncherLoginRequestFrame(fields));
    assert.equal(decoded.wordA, v.counter); assert.equal(decoded.wordB, v.game_code);
    assert.equal(hex(decoded.fieldA), v.username_hex); assert.equal(hex(decoded.fieldB), v.password_hex);
  }
});

test('UI16-byte subset is distinct from the existing protocol18-byte field support', () => {
  const fields = baseFields(); fields.usernameBytes = new Uint8Array(16).fill(65); fields.passwordBytes = new Uint8Array(16).fill(66);
  assert.equal(encodeLauncherLoginRequest(fields).length, 43); assert.equal(encodeLauncherLoginRequestFrame(fields).length, 45);
  for (const name of ['usernameBytes', 'passwordBytes']) {
    for (const length of [0, 17, 18, 100]) {
      const changed = { ...fields, [name]: new Uint8Array(length).fill(65) };
      error(name === 'usernameBytes' ? 'LOGIN_USERNAME_LENGTH' : 'LOGIN_PASSWORD_LENGTH', () => encodeLauncherLoginRequest(changed));
    }
  }
  assert.equal(decodeLauncherRequest10(encodeLauncherRequest10({ wordA: 0, wordB: 15,
    fieldA: new Uint8Array(18), fieldB: new Uint8Array(1) })).fieldA.length, 18);
});

test('username/password input is encoded bytes, preserves nonzero bytes and rejects embedded NUL', () => {
  const fields = baseFields(); fields.usernameBytes = Uint8Array.of(32, 65, 97, 32, 128, 255); fields.passwordBytes = Uint8Array.of(32);
  const decoded = decodeLauncherRequest10(encodeLauncherLoginRequest(fields));
  assert.deepEqual(decoded.fieldA, fields.usernameBytes); assert.deepEqual(decoded.fieldB, fields.passwordBytes);
  for (const name of ['usernameBytes', 'passwordBytes']) {
    for (const value of ['string', null, {}, new Uint16Array(3)]) error('INVALID_INPUT', () => encodeLauncherLoginRequest({ ...fields, [name]: value }));
    for (const at of [0, 5, 15]) { const value = new Uint8Array(16).fill(65); value[at] = 0; error('LOGIN_NUL', () => encodeLauncherLoginRequest({ ...fields, [name]: value })); }
  }
});

test('counter words and supported numeric Gamecode slots reject coercion or overflow', () => {
  for (const counter of [0, 0x7fffffff, 0x80000000, 0xffffffff]) {
    for (const gameCode of [0, 1, 11, 14]) {
      assert.equal(decodeLauncherRequest10(encodeLauncherLoginRequest({ ...baseFields(), requestCounter: counter, gameCode })).wordA, counter);
    }
  }
  for (const value of [-1, 1.5, 0x100000000, NaN, Infinity, '11', null]) {
    error('INVALID_WORD', () => encodeLauncherLoginRequest({ ...baseFields(), requestCounter: value }));
    error('INVALID_WORD', () => encodeLauncherLoginRequest({ ...baseFields(), gameCode: value }));
  }
  error('LOGIN_GAME_CODE', () => encodeLauncherLoginRequest({ ...baseFields(), gameCode: 15 }));
  for (const value of [null, 1, [], 'fields']) error('INVALID_INPUT', () => encodeLauncherLoginRequest(value));
});

test('six independent reply vectors preserve parallel columns, native tie order and source/display ordinals', () => {
  for (const v of fixture.profiles) {
    const model = decodeLauncherProfileChoices(fromHex(v.body_hex));
    assert.equal(model.disposition, v.expected.disposition, v.name);
    assert.equal(model.remainingPointsSigned, v.expected.remaining_points_signed, v.name);
    assert.equal(model.authentication, 'unverified');
    assert.deepEqual(model.rows.map(row => ({ source_ordinal: row.sourceOrdinal, display_ordinal: row.displayOrdinal,
      name_hex: hex(row.nameBytes), state: row.state, words: [row.stateWord, row.billingWord, row.expiryWord, row.expiredWord],
      passes: row.selectionGate.passes, blocked_reason: row.selectionGate.blockedReason })), v.expected.rows, v.name);
    assert.equal(model.reply.tailWordA, decodeLauncherReply(fromHex(v.body_hex)).tailWordA);
    assert.equal(model.reply.tailWordB, decodeLauncherReply(fromHex(v.body_hex)).tailWordB);
  }
  const tie = decodeLauncherProfileChoices(fromHex(fixture.profiles[1].body_hex));
  assert.deepEqual(tie.rows.map(row => row.sourceOrdinal), [2, 1, 0]);
  assert.deepEqual(tie.rows.map(row => row.expiryWord), [303, 202, 101]);
});

test('sorting uses unsigned opaque bytes rather than Unicode/case-folding or current locale', () => {
  const model = decodeLauncherProfileChoices(fromHex(fixture.profiles[2].body_hex));
  assert.deepEqual(model.rows.map(row => hex(row.nameBytes)), ['41', '4141', '61', '80', 'ff']);
  assert.deepEqual(model.rows.map(row => row.expiryWord), [3, 4, 2, 1, 0]);
});

test('low16 state0 and -4 pass only when the observed billing/expiry conjunction permits selection', () => {
  for (const v of [
    { state: 0, billing: 0, expired: 1, pass: true },
    { state: 0xfffffffc, billing: 0, expired: 1, pass: true },
    { state: 0, billing: 1, expired: 0, pass: true },
    { state: 0xfffffffc, billing: 0xffffffff, expired: 0, pass: true },
    { state: 0, billing: 1, expired: 1, pass: false },
    { state: 0xfffffffc, billing: 0xffffffff, expired: 0xffffffff, pass: false },
    { state: 1, billing: 0, expired: 0, pass: false },
    { state: 0xffffffff, billing: 0, expired: 0, pass: false },
    { state: 0xfffffffd, billing: 0, expired: 0, pass: false },
    { state: 0x7fff, billing: 0, expired: 0, pass: false },
    { state: 0xffff8000, billing: 0, expired: 0, pass: false },
  ]) {
    const reply = oneRow(v), model = createLauncherProfileChoices(reply);
    assert.equal(model.rows[0].selectionGate.passes, v.pass);
    if (v.pass) { const chosen = selectLauncherProfile(reply, 0); assert.equal(chosen.authentication, 'unverified'); assert.equal(chosen.profile.stateWord, v.state); }
    else error('PROFILE_RESTRICTED', () => selectLauncherProfile(reply, 0));
  }
});

test('raw UInt32 words preserve upper bits while selection reads the native signed16 state', () => {
  for (const [stateWord, state, passes] of [[0x10000, 0, true], [0x1fffc, -4, true],
    [0x8000, -32768, false], [0xffff, -1, false], [0x12340000, 0, true], [0x1234fffc, -4, true]]) {
    const reply = oneRow({ state: stateWord }), model = createLauncherProfileChoices(reply);
    assert.equal(model.rows[0].stateWord, stateWord);
    assert.equal(model.rows[0].state, state);
    assert.equal(model.rows[0].selectionGate.passes, passes);
    if (passes) assert.equal(selectLauncherProfile(reply, 0).profile.stateWord, stateWord);
    else error('PROFILE_RESTRICTED', () => selectLauncherProfile(reply, 0));
  }
});

test('all four used word columns must cover names; ignored W0 and extra column elements remain opaque', () => {
  for (const column of [1, 2, 3, 4]) {
    const reply = oneRow(); reply.wordLists[column] = new Uint32Array();
    error('PROFILE_COLUMNS', () => createLauncherProfileChoices(reply));
  }
  const reply = oneRow(); reply.wordLists[0] = Uint32Array.of(11, 22, 33);
  for (let column = 1; column < 5; column += 1) reply.wordLists[column] = Uint32Array.of(reply.wordLists[column][0], 0xdeadbeef);
  const model = createLauncherProfileChoices(reply);
  assert.deepEqual(model.reply.wordLists[0], reply.wordLists[0]); assert.equal(model.rows.length, 1);
  assert.equal(model.reply.wordLists[1][1], 0xdeadbeef);
});

test('zero-result choice labels reject hidden NUL or empty labels; all41 bytes are otherwise preserved', () => {
  for (const name of [new Uint8Array(), Uint8Array.of(0), Uint8Array.of(65, 0, 66)]) {
    error('PROFILE_NAME', () => createLauncherProfileChoices(oneRow({ name })));
  }
  const name = new Uint8Array(41).fill(255), model = createLauncherProfileChoices(oneRow({ name }));
  assert.deepEqual(model.rows[0].nameBytes, name);
});

test('nonzero results and empty profile lists cannot be selected or acquire a synthetic authentication state', () => {
  for (const v of fixture.profiles.slice(3, 5)) {
    const reply = decodeLauncherReply(fromHex(v.body_hex)), model = createLauncherProfileChoices(reply);
    assert.deepEqual(model.rows, []); assert.equal(model.authentication, 'unverified');
    assert.equal(model.remainingPointsWord, null); error('PROFILE_RESULT', () => selectLauncherProfile(reply, 0));
  }
  const reply = oneRow({ name: Uint8Array.of(0) }); reply.wordB = 0xffffffff; reply.wordLists[1] = new Uint32Array();
  assert.equal(createLauncherProfileChoices(reply).disposition, 'nonzero-result');
});

test('selected data is copied with both tail words; source ordinal remains bound after sorting', () => {
  const reply = decodeLauncherReply(fromHex(fixture.profiles[0].body_hex));
  const chosen = selectLauncherProfile(reply, 3); // zeta was source row0.
  assert.equal(chosen.profile.sourceOrdinal, 0); assert.equal(hex(chosen.profile.nameBytes), hex(pub('zeta')));
  assert.equal(chosen.tailWordA, 0x80000001); assert.equal(chosen.tailWordB, 0xffffffff);
  reply.byteField.fill(0); reply.byteList[0].fill(0);
  assert.equal(chosen.opaqueByteField[31], 31); assert.equal(hex(chosen.profile.nameBytes), hex(pub('zeta')));
  for (const ordinal of [-1, 4, 0.5, NaN, '0']) error('PROFILE_ORDINAL', () => selectLauncherProfile(oneRow(), ordinal));
});

test('caller data and decoded input are not reordered or aliased into independent profile rows', () => {
  const reply = decodeLauncherReply(fromHex(fixture.profiles[1].body_hex));
  const before = reply.byteList.map(hex), columns = reply.wordLists.map(values => [...values]);
  const model = createLauncherProfileChoices(reply);
  assert.deepEqual(reply.byteList.map(hex), before); assert.deepEqual(reply.wordLists.map(values => [...values]), columns);
  model.reply.byteList[2].fill(0); model.reply.wordLists[3].fill(0);
  assert.equal(hex(model.rows[0].nameBytes), hex(pub('Alpha'))); assert.equal(model.rows[0].expiryWord, 303);
  assert.ok(Object.isFrozen(model)); assert.ok(Object.isFrozen(model.rows)); assert.ok(Object.isFrozen(model.rows[0]));
  assert.ok(Object.isFrozen(model.rows[0].selectionGate)); assert.ok(Object.isFrozen(model.reply.wordLists));
});

test('byte offsets, ArrayBuffers and subclass inputs yield owned plain output without species methods', () => {
  class Bytes extends Uint8Array { static get [Symbol.species]() { throw new Error('no species'); } }
  class Words extends Uint32Array { static get [Symbol.species]() { throw new Error('no species'); } }
  const buffer = new Bytes(30); buffer.set(pub('SyntheticU'), 7);
  const fields = baseFields(); fields.usernameBytes = new Bytes(buffer.buffer, 7, 10); fields.passwordBytes = fields.passwordBytes.buffer;
  assert.equal(hex(decodeLauncherRequest10(encodeLauncherLoginRequest(fields)).fieldA), hex(pub('SyntheticU')));
  const reply = oneRow(); const name = new Bytes(50); name.set(pub('FixtureID'), 8); reply.byteList[0] = new Bytes(name.buffer, 8, 9);
  const words = new Words(10); words[5] = 0; reply.wordLists[1] = new Words(words.buffer, 20, 1);
  const model = createLauncherProfileChoices(reply); name.fill(0); words.fill(0xffffffff);
  assert.equal(model.rows[0].nameBytes.constructor, Uint8Array); assert.equal(model.reply.wordLists[1].constructor, Uint32Array);
  assert.equal(hex(model.rows[0].nameBytes), hex(pub('FixtureID'))); assert.equal(model.rows[0].state, 0);
  const input = fromHex(fixture.profiles[0].body_hex), larger = new Bytes(input.length + 20); larger.set(input, 9);
  assert.equal(decodeLauncherProfileChoices(new Bytes(larger.buffer, 9, input.length)).rows.length, 4);
});

test('structured reply boundaries reject wrong types, counts, words and unsupported layouts without coercion', () => {
  for (const value of [null, {}, [], { type: 2 }, 'reply']) error('PROFILE_REPLY_TYPE', () => createLauncherProfileChoices(value));
  for (const key of ['wordA', 'wordB', 'tailWordA', 'tailWordB']) {
    for (const value of [-1, '0', 1.1, 0x100000000]) error('INVALID_WORD', () => createLauncherProfileChoices({ ...oneRow(), [key]: value }));
  }
  error('PROFILE_BUDGET', () => createLauncherProfileChoices({ ...oneRow(), byteField: new Uint8Array(33) }));
  error('PROFILE_BUDGET', () => createLauncherProfileChoices(oneRow({ name: new Uint8Array(42) })));
  for (const change of [{ byteList: new Array(65).fill(pub('x')) }, { byteList: {} }, { wordLists: [] }, { wordLists: new Array(6).fill(new Uint32Array()) }]) {
    error('PROFILE_LAYOUT', () => createLauncherProfileChoices({ ...oneRow(), ...change }));
  }
  for (const value of [[], new Uint16Array(1), new Uint32Array(65), null]) {
    const reply = oneRow(); reply.wordLists[1] = value; error('PROFILE_LAYOUT', () => createLauncherProfileChoices(reply));
  }
  const reply = oneRow(); reply.signedWordB = -100;
  assert.equal(createLauncherProfileChoices(reply).resultSigned, 0); // Derived from the actual UInt32, not caller's stale view.
});

test('all profile body truncation prefixes and trailing bytes reject before a choice can be produced', () => {
  for (const v of fixture.profiles) {
    const input = fromHex(v.body_hex);
    for (let length = 0; length < input.length; length += 1) error(null, () => decodeLauncherProfileChoices(input.subarray(0, length)));
    error('REPLY_LENGTH', () => decodeLauncherProfileChoices(join(input, Uint8Array.of(0))));
  }
});

test('record/reply streams feed the business projection directly across independent boundaries', () => {
  const body = fromHex(fixture.profiles[0].body_hex), length = new Uint8Array(2); new DataView(length.buffer).setUint16(0, body.length, false);
  const frame = join(length, body), fixtureKey = Uint8Array.of(0,1,2,3,4,5,6,7), codec = createLauncherRecordCodec(fixtureKey);
  const wire = join(codec.encode(frame.subarray(0, 7)), codec.encode(frame.subarray(7))); codec.close();
  const records = createLauncherRecordStream(fixtureKey), replies = createLauncherReplyStream(), models = [];
  for (let at = 0; at < wire.length; at += 13) {
    for (const plain of records.push(wire.subarray(at, at + 13))) for (const reply of replies.push(plain)) models.push(createLauncherProfileChoices(reply));
  }
  records.finish(); replies.finish();
  assert.equal(models.length, 1); assert.deepEqual(models[0].rows.map(row => row.sourceOrdinal), [1, 3, 2, 0]);
  assert.equal(selectLauncherProfile(models[0].reply, 3).profile.sourceOrdinal, 0);
});

test('errors never include original fixture username/password or opaque profile bytes', () => {
  const marker = 'PUBLIC_FIXTURE_VALUE_MUST_NOT_BE_ECHOED';
  for (const action of [() => encodeLauncherLoginRequest({ ...baseFields(), usernameBytes: pub(marker) }),
    () => createLauncherProfileChoices(oneRow({ name: join(pub(marker), Uint8Array.of(0)) }))]) {
    try { action(); assert.fail('expected rejection'); }
    catch (e) { assert.ok(e instanceof LauncherMessageError); assert.ok(!e.message.includes(marker)); }
  }
});

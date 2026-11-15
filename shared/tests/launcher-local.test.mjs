import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { LAUNCHER_LOCAL_LIMITS, createLauncherLicenseIdentity, createLauncherLicenseReview, resetLauncherLoginInputs,
  planLauncherUserModeInitialization, planLauncherUserModeChange } from '../index.mjs';

const b = value => Uint8Array.from(value);
const username = b([65, 98, 67]);
const opts = extra => ({ gameCodeText: '11', usernameBytes: username, recordedVersion: 0, forcePrompt: false, pageAvailability: [true, true, true, true], ...extra });
const code = (fn, expected) => assert.throws(fn, error => error.code === expected);
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v10/original-local-vectors.json', import.meta.url))).vectors;
const modeVectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v16/original-mode-vectors.json', import.meta.url))).vectors;
const initialMode = extra => ({ recordedMode: -1, initialRememberUsername: false, settingsSection: 'Original.Settings', ...extra });
const changedMode = extra => ({ currentMode: 1, requestedMode: 2, settingsSection: 'Original.Settings', ...extra });

test('mode plans match54 independent non-secret Python policy vectors', () => {
  assert.equal(modeVectors.length, 54);
  for (const row of modeVectors) assert.deepEqual((row.kind === 'initialization'
    ? planLauncherUserModeInitialization : planLauncherUserModeChange)(row.input), row.expected);
});

test('stored modes skip unused choice and mode2 initialization preserves username retention', () => {
  const input = initialMode({ recordedMode: 2, initialRememberUsername: true });
  Object.defineProperty(input, 'choice', { get() { throw new Error('unused decision'); } });
  const plan = planLauncherUserModeInitialization(input);
  assert.equal(plan.writeRequested, null); assert.equal(plan.clearInputs, false);
  assert.deepEqual(plan.retention, { rememberUsername: true, rememberPassword: false, passwordControlVisible: false });
  assert.equal(planLauncherUserModeInitialization(initialMode({ recordedMode: 1 })).retention.rememberUsername, true);
});

test('unknown recorded modes need an explicit decision with no default write', () => {
  for (const recordedMode of [-1, 0, 3, 0xffffffff]) {
    const plan = planLauncherUserModeInitialization(initialMode({ recordedMode }));
    assert.equal(plan.state, 'choice-required'); assert.equal(plan.mode, null);
    assert.equal(plan.retention, null); assert.equal(plan.writeRequested, null);
  }
});

test('mode2 to mode1 needs a separate confirmation and decline has no reset or write', () => {
  const input = changedMode({ currentMode: 2, requestedMode: 1 });
  assert.equal(planLauncherUserModeChange(input).state, 'confirmation-required');
  const declined = planLauncherUserModeChange({ ...input, confirmMode1: false });
  assert.equal(declined.mode, 2); assert.equal(declined.state, 'declined');
  assert.equal(declined.clearInputs, false); assert.equal(declined.retention, null); assert.equal(declined.writeRequested, null);
  const accepted = planLauncherUserModeChange({ ...input, confirmMode1: true });
  assert.equal(accepted.mode, 1); assert.equal(accepted.clearInputs, true); assert.equal(accepted.writeRequested.value, 1);
});

test('explicit mode cancellation never becomes the native non1-result mode2 fallback', () => {
  const first = planLauncherUserModeInitialization(initialMode({ choice: 'cancel' }));
  const second = planLauncherUserModeChange(changedMode({ requestedMode: 'cancel' }));
  for (const plan of [first, second]) {
    assert.equal(plan.state, 'cancelled'); assert.equal(plan.writeRequested, null); assert.equal(plan.clearInputs, false);
  }
  assert.equal(first.mode, null); assert.equal(second.mode, 1);
});

test('same-mode selection still emits native-observed reset and integer-write effects', () => {
  for (const mode of [1, 2]) {
    const plan = planLauncherUserModeChange(changedMode({ currentMode: mode, requestedMode: mode }));
    assert.equal(plan.state, 'changed'); assert.equal(plan.clearInputs, true);
    assert.deepEqual(plan.writeRequested, { section: 'Original.Settings', key: 'UserMode', value: mode });
    assert.equal(plan.retention.rememberUsername, mode === 1); assert.equal(plan.retention.rememberPassword, false);
  }
});

test('mode reset plans compose with owned input clearing without retaining either old field', () => {
  const plan = planLauncherUserModeChange(changedMode());
  const input = { usernameBytes: b([65]), passwordBytes: b([66]), rememberUsername: false, rememberPassword: false };
  assert.equal(plan.clearInputs, true);
  const cleared = resetLauncherLoginInputs(input);
  assert.equal(cleared.usernameBytes.length, 0); assert.equal(cleared.passwordBytes.length, 0);
  assert.deepEqual(input.usernameBytes, b([65])); assert.deepEqual(input.passwordBytes, b([66]));
  assert.equal(cleared.persisted, false);
});

test('mode input integers, choices and confirmation flags reject coercion', () => {
  for (const recordedMode of [-2, 0x100000000, 1.5, NaN, Infinity, '1', true]) code(() => planLauncherUserModeInitialization(initialMode({ recordedMode })), 'LOCAL_MODE_VALUE');
  for (const choice of [0, 3, false, '1', [], {}]) code(() => planLauncherUserModeInitialization(initialMode({ choice })), 'LOCAL_MODE_CHOICE');
  for (const currentMode of [0, 3, '1', null]) code(() => planLauncherUserModeChange(changedMode({ currentMode })), 'LOCAL_MODE_CHOICE');
  for (const requestedMode of [0, 3, undefined, null, '2']) code(() => planLauncherUserModeChange(changedMode({ requestedMode })), 'LOCAL_MODE_CHOICE');
  for (const confirmMode1 of [0, 1, 'true', {}]) code(() => planLauncherUserModeChange(changedMode({ currentMode: 2, requestedMode: 1, confirmMode1 })), 'LOCAL_FLAG');
});

test('explicit resolved settings sections keep exact Unicode and enforce bounded non-control syntax', () => {
  const settingsSection = ' 原创.Settings ';
  assert.equal(planLauncherUserModeInitialization(initialMode({ settingsSection, choice: 1 })).writeRequested.section, settingsSection);
  assert.equal(planLauncherUserModeChange(changedMode({ settingsSection: 'S'.repeat(256) })).writeRequested.section.length, 256);
  for (const settingsSection of ['', 'S'.repeat(257), 'A\nB', 'A\0B', '[Settings]', 'A\x7fB', null, {}]) {
    code(() => planLauncherUserModeInitialization(initialMode({ settingsSection })), 'LOCAL_SETTINGS_SECTION');
  }
});

test('mode snapshots require own data fields and sanitize provider traps without reading unrelated fields', () => {
  code(() => planLauncherUserModeInitialization(Object.create(initialMode())), 'INVALID_INPUT');
  const accessor = initialMode(); Object.defineProperty(accessor, 'recordedMode', { get() { throw new Error('must not execute'); } });
  code(() => planLauncherUserModeInitialization(accessor), 'INVALID_INPUT');
  const trapped = new Proxy(initialMode(), { getOwnPropertyDescriptor() { throw new Error('private provider text'); } });
  code(() => planLauncherUserModeInitialization(trapped), 'INVALID_INPUT');
  const { proxy, revoke } = Proxy.revocable({}, {}); revoke(); code(() => planLauncherUserModeChange(proxy), 'INVALID_INPUT');
  const unrelated = initialMode({ recordedMode: 1 }); Object.defineProperty(unrelated, 'account', { get() { throw new Error('unrelated field'); } });
  assert.equal(planLauncherUserModeInitialization(unrelated).mode, 1);
});

test('mode plans and nested effects are immutable and contain no input or account values', () => {
  const input = initialMode({ choice: 2 }), plan = planLauncherUserModeInitialization(input);
  input.choice = 1; input.settingsSection = 'Changed';
  assert.equal(plan.mode, 2); assert.equal(plan.writeRequested.section, 'Original.Settings');
  for (const value of [plan, plan.retention, plan.writeRequested]) assert.equal(Object.isFrozen(value), true);
  assert.equal(plan.authentication, 'unverified'); assert.equal(plan.persistence, 'unconfirmed');
  assert.deepEqual(Object.keys(plan.writeRequested), ['section', 'key', 'value']);
});

test('unneeded confirmation is not read and cannot change other mode transitions', () => {
  const input = changedMode(); Object.defineProperty(input, 'confirmMode1', { get() { throw new Error('unneeded confirmation'); } });
  assert.equal(planLauncherUserModeChange(input).mode, 2);
});

test('local license keys match23 independent Python hashlib vectors', () => {
  for (const row of vectors) {
    const input = Uint8Array.from(Buffer.from(row.username_hex, 'hex'));
    const identity = createLauncherLicenseIdentity(opts({ usernameBytes: input }));
    assert.equal(identity.key, row.key); assert.equal(identity.section, 'Game11_License');
    assert.deepEqual(input, Uint8Array.from(Buffer.from(row.username_hex, 'hex')));
    assert.equal(identity.authentication, 'unverified');
  }
});

test('single-block compatibility digest matches Node for every length and nonzero repeated byte', () => {
  for (let length = 1; length <= 16; length += 1) for (let byte = 1; byte <= 255; byte += 1) {
    const input = new Uint8Array(length).fill(byte);
    assert.equal(createLauncherLicenseIdentity(opts({ usernameBytes: input })).key, createHash('md5').update(input).digest('hex'));
  }
});

test('game code text, case and whitespace remain distinct in local identity', () => {
  const identity = createLauncherLicenseIdentity(opts({ gameCodeText: '00000011' }));
  assert.equal(identity.section, 'Game00000011_License');
  assert.notEqual(createLauncherLicenseIdentity(opts({ usernameBytes: b([65]) })).key, createLauncherLicenseIdentity(opts({ usernameBytes: b([97]) })).key);
  assert.notEqual(createLauncherLicenseIdentity(opts({ usernameBytes: b([32, 65, 32]) })).key, createLauncherLicenseIdentity(opts({ usernameBytes: b([65]) })).key);
  for (const codeText of ['', '0', '16', '100000000', ' 11', '+11', '1e1', 11]) code(() => createLauncherLicenseIdentity(opts({ gameCodeText: codeText })), 'LOCAL_GAME_CODE');
});

test('resource table is fixed to15 observed slots, with six configured rows', () => {
  const rows = new Map([[1, [283, 329, 331, 332]], [2, [283, 329, 331, 332]], [3, [293, 294, 331, 332]],
    [4, [283, 329, 331, 332]], [5, [319, 330, 331, 332]], [11, [335, 329, 331, 332]]]);
  for (let number = 1; number <= 15; number += 1) {
    const identity = createLauncherLicenseIdentity(opts({ gameCodeText: String(number) }));
    assert.deepEqual(identity.resourceIds, rows.get(number) ?? [0, 0, 0, 0]);
    assert.ok(Object.isFrozen(identity) && Object.isFrozen(identity.resourceIds));
    assert.equal(createLauncherLicenseReview(opts({ gameCodeText: String(number) })).snapshot().state, rows.has(number) ? 'reviewing' : 'not-configured');
  }
});

test('offset views, array buffers and hostile iterators use owned exact bytes', () => {
  const view = b([255, 65, 98, 67, 255]).subarray(1, 4);
  assert.equal(createLauncherLicenseIdentity(opts({ usernameBytes: view })).key, createLauncherLicenseIdentity(opts()).key);
  assert.equal(createLauncherLicenseIdentity(opts({ usernameBytes: username.slice().buffer })).key, createLauncherLicenseIdentity(opts()).key);
  class HiddenNul extends Uint8Array { *[Symbol.iterator]() { yield 65; } }
  code(() => createLauncherLicenseIdentity(opts({ usernameBytes: new HiddenNul([65, 0]) })), 'LOGIN_NUL');
  for (const value of [new Uint8Array(0), new Uint8Array(17).fill(65)]) code(() => createLauncherLicenseIdentity(opts({ usernameBytes: value })), 'LOCAL_INPUT_LENGTH');
  for (const value of ['AbC', [65], new DataView(new ArrayBuffer(3)), null]) code(() => createLauncherLicenseIdentity(opts({ usernameBytes: value })), 'INVALID_INPUT');
});

test('version5 suppresses prompt only when force flag is explicitly false', () => {
  const recorded = createLauncherLicenseReview(opts({ recordedVersion: 5, pageAvailability: [false, false, false, false] }));
  assert.equal(recorded.snapshot().state, 'recorded'); assert.equal(recorded.snapshot().pageOrdinal, null);
  assert.equal(recorded.cancel().writeRequested, null); assert.equal(recorded.cancel().ignored, true);
  code(() => recorded.decide(true), 'LICENSE_STATE');
  assert.equal(createLauncherLicenseReview(opts({ recordedVersion: 5, forcePrompt: true })).snapshot().state, 'reviewing');
  for (const recordedVersion of [0, 1, 4, 6, 0xffffffff]) assert.equal(createLauncherLicenseReview(opts({ recordedVersion })).snapshot().state, 'reviewing');
});

test('input validation and digest use internal typed-array length and bytes', () => {
  class HiddenTail extends Uint8Array { get byteLength() { return 1; } get length() { return 1; } }
  class WrongBuffer extends Uint8Array { get buffer() { return b([66]).buffer; } get byteOffset() { return 0; } }
  code(() => createLauncherLicenseIdentity(opts({ usernameBytes: new HiddenTail([65, 0]) })), 'LOGIN_NUL');
  code(() => createLauncherLicenseIdentity(opts({ usernameBytes: new HiddenTail(17).fill(65) })), 'LOCAL_INPUT_LENGTH');
  const identity = createLauncherLicenseIdentity(opts({ usernameBytes: new WrongBuffer([65]) }));
  assert.equal(identity.key, createLauncherLicenseIdentity(opts({ usernameBytes: b([65]) })).key);
  code(() => resetLauncherLoginInputs({ usernameBytes: b([]), passwordBytes: new HiddenTail([65, 0]), rememberUsername: false, rememberPassword: false }), 'LOGIN_NUL');
  const reset = resetLauncherLoginInputs({ usernameBytes: new WrongBuffer([65]), passwordBytes: b([]), rememberUsername: true, rememberPassword: false });
  assert.deepEqual(reset.usernameBytes, b([65]));
  for (const target of [b([65]), new ArrayBuffer(1)]) {
    let iterated = false;
    const proxy = new Proxy(target, { get(object, key) {
      if (key === Symbol.iterator) return function* () { iterated = true; yield 65; };
      return Reflect.get(object, key, object);
    } });
    code(() => createLauncherLicenseIdentity(opts({ usernameBytes: proxy })), 'INVALID_INPUT');
    assert.equal(iterated, false);
  }
});

test('four page progression precedes a separate final decision and one write intent', () => {
  const flow = createLauncherLicenseReview(opts());
  for (const [ordinal, resourceId] of [335, 329, 331, 332].entries()) {
    const snapshot = flow.snapshot(); assert.equal(snapshot.pageOrdinal, ordinal); assert.equal(snapshot.resourceId, resourceId);
    assert.equal(snapshot.canConfirm, ordinal === 3); assert.ok(Object.isFrozen(snapshot));
    if (ordinal < 3) { code(() => flow.decide(true), 'LICENSE_PAGES_REMAIN'); assert.equal(flow.advance().writeRequested, null); }
  }
  code(() => flow.advance(), 'LICENSE_PAGE');
  const result = flow.decide(true); assert.equal(result.snapshot.state, 'accepted'); assert.equal(result.snapshot.authentication, 'unverified');
  assert.equal(result.snapshot.persistence, 'unconfirmed'); assert.deepEqual(result.writeRequested, { section: 'Game11_License', key: createLauncherLicenseIdentity(opts()).key, value: 5 });
  assert.ok(Object.isFrozen(result.writeRequested)); assert.equal(flow.cancel().ignored, true);
  code(() => flow.decide(true), 'LICENSE_STATE');
});

test('decline and cancel at any page produce no write or automatic acceptance', () => {
  for (let page = 0; page < 4; page += 1) for (const action of ['decline', 'cancel']) {
    const flow = createLauncherLicenseReview(opts());
    for (let index = 0; index < page; index += 1) flow.advance();
    const result = action === 'decline' ? flow.decide(false) : flow.cancel();
    assert.equal(result.writeRequested, null); assert.equal(result.snapshot.state, action === 'decline' ? 'declined' : 'cancelled');
    code(() => flow.advance(), 'LICENSE_STATE'); code(() => flow.decide(true), 'LICENSE_STATE');
    assert.equal(flow.cancel().ignored, true);
  }
});

test('missing pages remain unavailable and availability is snapshotted', () => {
  for (let page = 0; page < 4; page += 1) {
    const availability = [true, true, true, true]; availability[page] = false;
    const flow = createLauncherLicenseReview(opts({ pageAvailability: availability })); availability[page] = true;
    assert.equal(flow.snapshot().state, 'unavailable'); code(() => flow.advance(), 'LICENSE_STATE'); code(() => flow.decide(true), 'LICENSE_STATE');
  }
  const values = [[], [true], [true, true, true, true, true], new Array(4), [true, true, true, 1]];
  for (const pageAvailability of values) assert.throws(() => createLauncherLicenseReview(opts({ pageAvailability })));
});

test('review snapshot contains no username or identity key and never becomes authenticated', () => {
  const flow = createLauncherLicenseReview(opts()); const snapshot = flow.snapshot();
  assert.deepEqual(Object.keys(snapshot), ['state', 'pageOrdinal', 'resourceId', 'canConfirm', 'authentication', 'persistence']);
  assert.equal(snapshot.authentication, 'unverified'); assert.equal(snapshot.persistence, 'unconfirmed');
  assert.equal(JSON.stringify(snapshot).includes(createLauncherLicenseIdentity(opts()).key), false);
});

test('page availability uses four own indexed values despite custom array iterators', () => {
  const unavailable = [false, false, false, false]; unavailable[Symbol.iterator] = function* () { yield true; };
  const flow = createLauncherLicenseReview(opts({ pageAvailability: unavailable }));
  assert.equal(flow.snapshot().state, 'unavailable'); code(() => flow.advance(), 'LICENSE_STATE');
  const hole = new Array(4); hole[Symbol.iterator] = function* () {};
  code(() => createLauncherLicenseReview(opts({ pageAvailability: hole })), 'LICENSE_AVAILABILITY');
  const inherited = [true, true, true, true]; delete inherited[2];
  Object.setPrototypeOf(inherited, Object.assign(Object.create(Array.prototype), { 2: true }));
  code(() => createLauncherLicenseReview(opts({ pageAvailability: inherited })), 'LICENSE_AVAILABILITY');
});

test('local version and boolean flags are explicit with no string coercion', () => {
  for (const recordedVersion of [-1, 0x100000000, 1.5, '5', NaN, undefined]) code(() => createLauncherLicenseReview(opts({ recordedVersion })), 'LOCAL_VERSION');
  for (const forcePrompt of [0, 1, 'false', undefined]) code(() => createLauncherLicenseReview(opts({ forcePrompt })), 'LOCAL_FLAG');
  const flow = createLauncherLicenseReview(opts()); code(() => flow.decide(1), 'LOCAL_FLAG'); assert.equal(flow.snapshot().pageOrdinal, 0);
  for (const value of [null, [], 'x']) code(() => createLauncherLicenseIdentity(value), 'INVALID_INPUT');
  assert.equal(LAUNCHER_LOCAL_LIMITS.licenseVersion, 5); assert.ok(Object.isFrozen(LAUNCHER_LOCAL_LIMITS));
});

test('re-entry reset covers all four checkbox combinations and never persists', () => {
  for (const rememberUsername of [false, true]) for (const rememberPassword of [false, true]) {
    const user = b([32, 65, 255]), password = b([80, 128, 32]);
    const result = resetLauncherLoginInputs({ usernameBytes: user, passwordBytes: password, rememberUsername, rememberPassword });
    assert.deepEqual(result.usernameBytes, rememberUsername ? user : b([])); assert.deepEqual(result.passwordBytes, rememberPassword ? password : b([]));
    assert.equal(result.authentication, 'unverified'); assert.equal(result.persisted, false);
    result.usernameBytes.fill(2); result.passwordBytes.fill(3); assert.deepEqual(user, b([32, 65, 255])); assert.deepEqual(password, b([80, 128, 32]));
  }
});

test('re-entry reset validates discarded bytes and flags as well as retained bytes', () => {
  const input = { usernameBytes: b([]), passwordBytes: b([]), rememberUsername: false, rememberPassword: false };
  assert.deepEqual(resetLauncherLoginInputs(input).usernameBytes, b([]));
  for (const key of ['usernameBytes', 'passwordBytes']) {
    code(() => resetLauncherLoginInputs({ ...input, [key]: b([0]) }), 'LOGIN_NUL');
    code(() => resetLauncherLoginInputs({ ...input, [key]: new Uint8Array(17).fill(2) }), 'LOCAL_INPUT_LENGTH');
  }
  for (const key of ['rememberUsername', 'rememberPassword']) code(() => resetLauncherLoginInputs({ ...input, [key]: 0 }), 'LOCAL_FLAG');
});

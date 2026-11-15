import test from 'node:test';
import assert from 'node:assert/strict';
import { LAUNCHER_PREFERENCE_FORMAT, LauncherPreferenceError, encodeLauncherUserModePreference,
  decodeLauncherUserModePreference, planLauncherUserModeInitialization, planLauncherUserModeChange } from '../index.mjs';

test('non-secret mode records have two fixed fields and exact versioned roundtrip', () => {
  for (const userMode of [1, 2]) {
    const record = encodeLauncherUserModePreference(userMode), decoded = decodeLauncherUserModePreference(record);
    assert.deepEqual(JSON.parse(record), { schema: 'moli.launcher.preferences.v1', userMode });
    assert.equal(decoded.userMode, userMode); assert.ok(Object.isFrozen(decoded));
    assert.ok(record.length < LAUNCHER_PREFERENCE_FORMAT.maxChars);
  }
  assert.ok(Object.isFrozen(LAUNCHER_PREFERENCE_FORMAT));
});
test('only primitive numeric modes enter the record, without input coercion', () => {
  let touched = false;
  const bad = { valueOf() { touched = true; return 1; }, toString() { touched = true; return '1'; } };
  for (const value of [undefined, null, -1, 0, 3, 0xffffffff, NaN, Infinity, '1', '2', true, [1], bad, 1n]) {
    assert.throws(() => encodeLauncherUserModePreference(value), { code: 'PREFERENCE_MODE' });
  }
  assert.equal(touched, false);
});
test('unknown, noncanonical, duplicate and extra record data never becomes a mode', () => {
  const record = encodeLauncherUserModePreference(1);
  for (const value of [null, undefined, {}, new String(record), '', '[1]', 'null', '{',
    record + ' ', record.replace('v1', 'v2'), record.replace(':1}', ':3}'),
    record.replace(':1}', ':true}'), record.replace('}', ',"userMode":2}'),
    record.replace('}', ',"username":"OriginalFixture"}'),
    record.replace('"userMode"', '"user\\u004dode"'), 'x'.repeat(129)]) {
    assert.throws(() => decodeLauncherUserModePreference(value), { code: 'PREFERENCE_RECORD' });
  }
});
test('invalid preference data and provider-like errors are never echoed by the pure API', () => {
  const invalid = '{"privateFixture":"public-original-test-only"}';
  try { decodeLauncherUserModePreference(invalid); assert.fail(); }
  catch (error) {
    assert.equal(error.code, 'PREFERENCE_RECORD');
    assert.equal(error.message.includes('public-original'), false);
    assert.deepEqual(Object.keys(error).sort(), ['code', 'name']);
  }
  assert.equal(new LauncherPreferenceError({ toString() { throw new Error(); } }).code, 'PREFERENCE_RECORD');
});
test('saved mode restores only observed default retention, never prior input or checkbox state', () => {
  const plan = planLauncherUserModeChange({ currentMode: 2, requestedMode: 1, confirmMode1: true, settingsSection: 'LocalLauncher' });
  const record = encodeLauncherUserModePreference(plan.writeRequested.value);
  const restored = planLauncherUserModeInitialization({ recordedMode: decodeLauncherUserModePreference(record).userMode,
    initialRememberUsername: false, settingsSection: 'LocalLauncher' });
  assert.equal(restored.mode, 1); assert.equal(restored.retention.rememberUsername, true);
  assert.equal(restored.retention.rememberPassword, false); assert.equal(restored.writeRequested, null);
  const shared = planLauncherUserModeInitialization({ recordedMode: decodeLauncherUserModePreference(encodeLauncherUserModePreference(2)).userMode,
    initialRememberUsername: false, settingsSection: 'LocalLauncher' });
  assert.equal(shared.retention.rememberUsername, false); assert.equal(shared.retention.rememberPassword, false);
  assert.equal(shared.authentication, 'unverified');
});

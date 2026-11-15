import test from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherPreferenceStore } from '../launcher-preferences.mjs';
import { LAUNCHER_PREFERENCE_FORMAT, encodeLauncherUserModePreference } from '../../shared/launcher-preferences.mjs';

const key = LAUNCHER_PREFERENCE_FORMAT.storageKey;
function storage(initial = []) {
  const values = new Map(initial), calls = [];
  const port = {
    getItem(name) { assert.equal(this, port); calls.push(['get', name]); return values.get(name) ?? null; },
    setItem(name, value) { assert.equal(this, port); calls.push(['set', name, value]); values.set(name, value); },
  };
  return { values, calls, port, store: createLauncherPreferenceStore({ storageProvider: () => port }) };
}
test('preference adapter defers access and writes only a fixed key and two non-secret fields', () => {
  const original = storage([['other-project-key', 'untouched']]); let accesses = 0;
  const store = createLauncherPreferenceStore({ storageProvider: () => { accesses++; return original.port; } });
  assert.equal(accesses, 0); assert.equal(store.readMode().state, 'missing'); assert.equal(accesses, 1);
  const receipt = store.saveMode(1); assert.deepEqual(receipt, { state: 'saved', userMode: 1, writeAttempted: true });
  assert.ok(Object.isFrozen(receipt)); assert.equal(store.readMode().userMode, 1);
  assert.deepEqual([...original.values.keys()].sort(), [key, 'other-project-key'].sort());
  assert.equal(original.values.get('other-project-key'), 'untouched');
  assert.deepEqual(JSON.parse(original.values.get(key)), { schema: key, userMode: 1 });
  assert.equal(original.calls.every(row => row[1] === key), true);
});
test('missing, invalid or future records are retained by a read and changed only by explicit save', () => {
  const original = '{"schema":"future","privateFixture":"OriginalOnly"}', fixture = storage([[key, original]]);
  assert.equal(fixture.store.readMode().state, 'invalid'); assert.equal(fixture.values.get(key), original);
  assert.equal(fixture.calls.filter(row => row[0] === 'set').length, 0);
  assert.equal(fixture.store.saveMode(2).state, 'saved'); assert.equal(fixture.values.get(key), encodeLauncherUserModePreference(2));
});
test('blocked Storage or throwing method lookup returns controlled unavailable without exception details', () => {
  for (const provider of [() => { throw new Error('Original provider detail'); }, () => null,
    () => ({ get getItem() { throw new Error('Original provider detail'); } })]) {
    const store = createLauncherPreferenceStore({ storageProvider: provider });
    assert.deepEqual(store.readMode(), { state: 'unavailable', userMode: null, writeAttempted: false });
    assert.deepEqual(store.saveMode(1), { state: 'unavailable', userMode: null, writeAttempted: false });
  }
});
test('quota failure or failed readback reports an attempted unconfirmed write, never success', () => {
  for (const [setItem, getItem] of [
    [() => { throw new Error('Original quota detail'); }, () => null],
    [() => {}, () => { throw new Error('Original read detail'); }],
    [() => {}, () => encodeLauncherUserModePreference(2)],
  ]) {
    const store = createLauncherPreferenceStore({ storageProvider: () => ({ setItem, getItem }) });
    assert.deepEqual(store.saveMode(1), { state: 'unconfirmed', userMode: 1, writeAttempted: true });
  }
});
test('invalid modes fail before provider access, and nonstring or oversized stored values are invalid', () => {
  let reads = 0; const store = createLauncherPreferenceStore({ storageProvider: () => { reads++; throw new Error(); } });
  for (const value of [{ userMode: 1, username: 'OriginalOnly' }, '1', null, 0]) assert.throws(() => store.saveMode(value), { code: 'PREFERENCE_MODE' });
  assert.equal(reads, 0);
  for (const value of [undefined, 1, {}, 'x'.repeat(129)]) {
    const bad = createLauncherPreferenceStore({ storageProvider: () => ({ getItem: () => value, setItem() {} }) });
    assert.equal(bad.readMode().state, 'invalid');
  }
});
test('one save uses stable method snapshots and readback observes real competing changes', () => {
  const fixture = storage(), get = fixture.port.getItem;
  fixture.port.setItem = function(name, value) {
    assert.equal(this, fixture.port); fixture.values.set(name, value);
    fixture.port.getItem = () => { throw new Error('Later method must not be selected'); };
  };
  assert.equal(fixture.store.saveMode(1).state, 'saved');
  fixture.port.getItem = get;
  fixture.values.set(key, encodeLauncherUserModePreference(2));
  assert.equal(fixture.store.readMode().userMode, 2);
  assert.equal(fixture.store.saveMode(1).state, 'saved');
});

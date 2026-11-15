import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWin32LauncherPatchPlan, interpretWin32LauncherPatchPoll, interpretWin32LauncherPatchExit,
  WIN32_LAUNCHER_PATCH_PROFILE, Win32LauncherPatchError, createLauncherPatchPlan, encodeWin32LauncherPatchCommand } from '../index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-patch-v1/original-vectors.json', import.meta.url)));
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex')), hex = value => Buffer.from(value).toString('hex');
const input = row => ({ ...Object.fromEntries(Object.entries(row.input).map(([key, value]) => [key.replace('_hex', 'Bytes'), bytes(value)])), alreadyPatched: row.alreadyPatched, caseProfile: 'ascii' });
const throws = (fn, code) => assert.throws(fn, error => error instanceof Win32LauncherPatchError && error.code === code);

test('independent Python current vectors preserve always-quoted path, escapes, raw endpoint and original Code', () => {
  for (const row of vectors.commands) {
    const source = input(row), backupPathBytes = bytes(row.expected.applicationName_hex).subarray(0, -1);
    assert.equal(hex(encodeWin32LauncherPatchCommand({ backupPathBytes, addressBytes: source.addressBytes, portBytes: source.portBytes })), row.expected.commandLine_hex, row.name);
  }
  for (const row of vectors.commands.slice(0, 4)) {
    const source = input(row), before = structuredClone(source), plan = createWin32LauncherPatchPlan(source);
    for (const [key, expected] of Object.entries(row.expected)) assert.equal(key === 'disposition' ? plan.disposition : hex(plan[key.replace('_hex', 'Bytes')]), expected, row.name + ':' + key);
    assert.deepEqual(source, before); assert.equal(plan.profile, WIN32_LAUNCHER_PATCH_PROFILE);
    assert.equal(plan.lifecycle, 'timer-polled-process'); assert.equal(plan.execution, 'not-performed');
    assert.equal(plan.packagedSourceStatus, 'legacy-derived-unverified-for-current');
    assert.equal(plan.quoting, 'win32-quoted-backup-path-raw-endpoint');
  }
  const source = input(vectors.commands[1]);
  assert.notDeepEqual(createWin32LauncherPatchPlan(source).commandLineBytes, createLauncherPatchPlan(source).commandLineBytes);
});
test('current plan keeps native root separator, bounded path and endpoint guards with explicit pathname subset', () => {
  const source = input(vectors.commands[0]), raw = value => new TextEncoder().encode(value);
  const root = createWin32LauncherPatchPlan({ ...source, directoryBytes: raw('C:\\') });
  assert.equal(new TextDecoder().decode(root.applicationNameBytes), 'C:\\PATCH.BAK.EXE\0');
  assert.equal(root.nativePathValidation, 'not-performed');
  assert.equal(createWin32LauncherPatchPlan({ ...source, directoryBytes: raw('C:\\' + 'a'.repeat(242)) }).applicationNameBytes.length, 260);
  throws(() => createWin32LauncherPatchPlan({ ...source, directoryBytes: raw('C:\\' + 'a'.repeat(243)) }), 'WIN32_PATCH_PATH');
  for (const directoryBytes of [raw('C:\\Original\\'), raw('C:/Original'), raw('C:\\a\\..\\b'), raw('C:\\' + 'a'.repeat(245)), new Uint8Array([67, 58, 92, 0x81, 0x5c])])
    throws(() => createWin32LauncherPatchPlan({ ...source, directoryBytes }), 'WIN32_PATCH_PATH');
  for (const patcherBytes of [raw('dir\\patch.exe'), raw('CON.exe'), raw('patch.exe '), raw('p".exe')])
    throws(() => createWin32LauncherPatchPlan({ ...source, patcherBytes }), 'WIN32_PATCH_PATH');
  for (const address of ['', 'a'.repeat(256), 'a b', 'user@host', 'host/path'])
    throws(() => createWin32LauncherPatchPlan({ ...source, addressBytes: raw(address) }), 'WIN32_PATCH_ENDPOINT');
  for (const port of ['', '0', '65536', '000001', '80 '])
    throws(() => createWin32LauncherPatchPlan({ ...source, portBytes: raw(port) }), 'WIN32_PATCH_ENDPOINT');
  assert.equal(new TextDecoder().decode(createWin32LauncherPatchPlan({ ...source, addressBytes: raw('[::1]'), portBytes: raw('00080') }).portBytes), '00080');
});
test('standalone current command formatter owns bytes and rejects invalid field storage, descriptors and NUL', () => {
  const value = { backupPathBytes: bytes('435c6122'), addressBytes: bytes('484f5354'), portBytes: bytes('3030303830') };
  const before = structuredClone(value), command = encodeWin32LauncherPatchCommand(value); command.fill(0);
  assert.deepEqual(value, before);
  let calls = 0; const getter = { ...value }; Object.defineProperty(getter, 'backupPathBytes', { get() { calls++; return value.backupPathBytes; } });
  throws(() => encodeWin32LauncherPatchCommand(getter), 'WIN32_PATCH_COMMAND_INPUT'); assert.equal(calls, 0);
  for (const field of [new Uint8Array([0]), new Uint8Array(8194), new Uint8Array(new SharedArrayBuffer(1)), new Proxy(new Uint8Array([65]), {})])
    throws(() => encodeWin32LauncherPatchCommand({ ...value, backupPathBytes: field }), 'WIN32_PATCH_COMMAND_INPUT');
  throws(() => encodeWin32LauncherPatchCommand({ ...value, extra: 1 }), 'WIN32_PATCH_COMMAND_INPUT');
});
test('current byte outputs are independently owned and reject accessors, unknown fields, shared, detached and fake byte inputs', () => {
  const source = input(vectors.commands[0]), one = createWin32LauncherPatchPlan(source), two = createWin32LauncherPatchPlan(source);
  const original = one.backupPatcherPathBytes.slice(); one.applicationNameBytes.fill(9); one.commandLineBytes.fill(8);
  assert.deepEqual(one.backupPatcherPathBytes, original); assert.deepEqual(two.backupPatcherPathBytes, original);
  assert.notEqual(one.backupNameBytes.buffer, two.backupNameBytes.buffer);
  let calls = 0; const accessor = { ...source }; Object.defineProperty(accessor, 'directoryBytes', { get() { calls++; return source.directoryBytes; } });
  throws(() => createWin32LauncherPatchPlan(accessor), 'WIN32_PATCH_INPUT'); assert.equal(calls, 0);
  for (const value of [new Uint8Array(new SharedArrayBuffer(1)), new Proxy(new Uint8Array([67]), {}), new ArrayBuffer(1)])
    throws(() => createWin32LauncherPatchPlan({ ...source, directoryBytes: value }), 'WIN32_PATCH_INPUT');
  const detached = new Uint8Array([67]); structuredClone(detached.buffer, { transfer: [detached.buffer] });
  throws(() => createWin32LauncherPatchPlan({ ...source, directoryBytes: detached }), 'WIN32_PATCH_INPUT');
  throws(() => createWin32LauncherPatchPlan({ ...source, other: true }), 'WIN32_PATCH_INPUT');
});
test('independent polls cover UInt32 wrap, threshold equality, query failure, absent handle and final exits', () => {
  for (const row of vectors.polls) {
    const value = interpretWin32LauncherPatchPoll(row.input);
    assert.deepEqual(Object.fromEntries(Object.keys(row.expected).map(key => [key, value[key]])), row.expected);
    assert.equal(value.termination, 'not-requested'); assert.equal(value.execution, 'not-performed');
  }
  const source = vectors.polls.find(row => row.expected.warn).input, first = interpretWin32LauncherPatchPoll(source);
  assert.equal(first.continuePolling, true);
  assert.equal(interpretWin32LauncherPatchPoll({ ...source, warningShown: first.warningShown }).warn, false);
});
test('current completed exits require valid selected game and describe at most three attempts', () => {
  for (const exitCode of [0, 100, 101, 102, 0xc0000005, 0xffffffff]) for (const attempt of [1, 2, 3]) for (const selectionValid of [false, true]) {
    const result = interpretWin32LauncherPatchExit({ exitCode, attempt, selectionValid });
    assert.equal(result.markPatched, exitCode === 100 && selectionValid);
    assert.equal(result.retry, exitCode === 102 && attempt < 3);
    assert.equal(result.nextAttempt, result.retry ? attempt + 1 : null);
    assert.equal(result.resultCode, result.retry ? null : exitCode === 100 && !selectionValid ? 0x585 : exitCode);
    assert.equal(result.deleteBackup, true); assert.equal(result.execution, 'not-performed');
    assert.equal(result.fileIntegrity, 'unverified'); assert.equal(result.authentication, 'unverified');
  }
});
test('malformed current poll/exit scalars and getters never produce bookkeeping actions', () => {
  const poll = vectors.polls[0].input;
  for (const change of [{ nowTick: -1 }, { nowTick: 0x100000000 }, { startTick: 1.1 }, { exitCode: '100' }, { hasProcess: 1 }, { warningShown: 0 }, { querySucceeded: null }, { extra: true }])
    throws(() => interpretWin32LauncherPatchPoll({ ...poll, ...change }), 'WIN32_PATCH_POLL_INPUT');
  const exit = { exitCode: 100, attempt: 1, selectionValid: true };
  for (const change of [{ exitCode: 259 }, { exitCode: -1 }, { exitCode: 0x100000000 }, { attempt: 0 }, { attempt: 4 }, { selectionValid: 1 }, { extra: true }])
    throws(() => interpretWin32LauncherPatchExit({ ...exit, ...change }), 'WIN32_PATCH_EXIT_INPUT');
  let calls = 0; Object.defineProperty(exit, 'selectionValid', { get() { calls++; return true; } });
  throws(() => interpretWin32LauncherPatchExit(exit), 'WIN32_PATCH_EXIT_INPUT'); assert.equal(calls, 0);
});

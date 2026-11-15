/** Current c82 launcher patch caller: owned data only. No native process or filesystem access. */
import { createLauncherPatchPlan, LAUNCHER_PATCH_LIMITS } from './launcher-patch.mjs';
import { ownLauncherInputBytes } from './launcher-catalog-data.mjs';
import { localDirectoryPath, localRelativePath } from './local-paths.mjs';

export const WIN32_LAUNCHER_PATCH_PROFILE = Object.freeze({
  id: 'win32-patch-c82fc98d-v1',
  sourceSha256: 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152',
  timerId: 0x2329, pollIntervalMs: 250, runningExitCode: 259,
  warningAfterMs: 1800000, attempts: 3,
});
export class Win32LauncherPatchError extends Error {
  constructor(code, message) { super(message); this.name = 'Win32LauncherPatchError'; this.code = code; }
}
const fail = code => { throw new Win32LauncherPatchError(code, 'Expected the explicit current patch data contract.'); };
function record(value, names, code) {
  let fields;
  try { fields = Object.getOwnPropertyDescriptors(value); } catch { fail(code); }
  if (Reflect.ownKeys(fields).length !== names.length || names.some(name => !fields[name] || !Object.hasOwn(fields[name], 'value'))) fail(code);
  return Object.fromEntries(names.map(name => [name, fields[name].value]));
}
const uint32 = value => Number.isInteger(value) && value >= 0 && value <= 0xffffffff;
const typedBuffer = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const latin = value => { let text = ''; for (const byte of value) text += String.fromCharCode(byte); return text; };
function ownedBytes(value, maximum, code) {
  if (!(value instanceof Uint8Array)) fail(code);
  try {
    const buffer = Reflect.apply(typedBuffer, value, []);
    Reflect.apply(bufferLength, buffer, []); new Uint8Array(buffer);
    const copy = ownLauncherInputBytes(value, maximum, { allowEmpty: true });
    if (copy.includes(0)) fail(code);
    return copy;
  } catch { fail(code); }
}
function quotedPath(bytes) {
  const output = [0x22]; let pending = 0;
  for (const byte of bytes) {
    if (byte === 0x5c) { pending++; continue; }
    const count = byte === 0x22 ? pending * 2 + 1 : pending;
    for (let n = 0; n < count; n++) output.push(0x5c);
    output.push(byte); pending = 0;
  }
  for (let n = 0; n < pending * 2; n++) output.push(0x5c);
  output.push(0x22); return Uint8Array.from(output);
}

/** Source-bound byte formatter only; arbitrary path bytes here do not establish native pathname acceptance. */
export function encodeWin32LauncherPatchCommand(value) {
  const input = record(value, ['backupPathBytes', 'addressBytes', 'portBytes'], 'WIN32_PATCH_COMMAND_INPUT');
  const path = ownedBytes(input.backupPathBytes, 8193, 'WIN32_PATCH_COMMAND_INPUT');
  const address = ownedBytes(input.addressBytes, 4096, 'WIN32_PATCH_COMMAND_INPUT'), port = ownedBytes(input.portBytes, 4096, 'WIN32_PATCH_COMMAND_INPUT');
  const prefix = quotedPath(path), length = prefix.length + address.length + port.length + 3;
  if (length > LAUNCHER_PATCH_LIMITS.commandBytes) fail('WIN32_PATCH_BUDGET');
  const command = new Uint8Array(length); let at = 0;
  for (const bytes of [prefix, Uint8Array.of(0x20), address, Uint8Array.of(0x20), port]) { command.set(bytes, at); at += bytes.length; }
  return command;
}

/** Canonical ASCII drive directory + basename subset. No GetFullPathName, locale or filesystem emulation. */
export function createWin32LauncherPatchPlan(value) {
  const input = record(value, ['alreadyPatched', 'caseProfile', 'directoryBytes', 'patcherBytes', 'codeTextBytes', 'addressBytes', 'portBytes'], 'WIN32_PATCH_INPUT');
  for (const name of ['directoryBytes', 'patcherBytes', 'codeTextBytes', 'addressBytes', 'portBytes']) {
    input[name] = ownedBytes(input[name], LAUNCHER_PATCH_LIMITS.fieldBytes, 'WIN32_PATCH_INPUT');
  }
  const directory = latin(input.directoryBytes), patcher = latin(input.patcherBytes);
  try {
    if (input.directoryBytes.some(byte => byte < 32 || byte > 126) || localDirectoryPath(directory) !== directory
        || (patcher && (localRelativePath(patcher) !== patcher || patcher.includes('\\')))) fail('WIN32_PATCH_PATH');
  } catch { fail('WIN32_PATCH_PATH'); }
  const base = createLauncherPatchPlan(input), join = name => directory + (directory.endsWith('\\') ? '' : '\\') + name;
  const backup = join(latin(base.backupNameBytes)), original = join(patcher);
  if (backup.length >= 260 || original.length >= 260) fail('WIN32_PATCH_PATH');
  if (base.disposition === 'patch-requested') {
    const address = latin(base.addressBytes), port = latin(base.portBytes);
    if (!/^[A-Za-z0-9.:\[\]-]{1,255}$/.test(address) || !/^[0-9]{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65535) fail('WIN32_PATCH_ENDPOINT');
  }
  const raw = value => Uint8Array.from(value, character => character.charCodeAt(0));
  const backupPathBytes = raw(backup), command = encodeWin32LauncherPatchCommand({ backupPathBytes, addressBytes: base.addressBytes, portBytes: base.portBytes });
  // The old command is an intermediate, never a current-profile output.
  base.commandLineBytes.fill(0);
  return Object.freeze({ ...base, commandLineBytes: command,
    originalPatcherPathBytes: raw(original + '\0'), backupPatcherPathBytes: raw(backup + '\0'), applicationNameBytes: raw(backup + '\0'),
    profile: WIN32_LAUNCHER_PATCH_PROFILE, quoting: 'win32-quoted-backup-path-raw-endpoint',
    pathProfile: 'canonical-ascii-drive-and-basename', nativePathValidation: 'not-performed',
    packagedSourceStatus: 'legacy-derived-unverified-for-current',
    lifecycle: 'timer-polled-process',
    warningEffect: 'notify-once-and-continue-polling',
    nativeOperations: Object.freeze(['if-missing-native-patcher-preparation-required', 'delete-existing-backup-or-report-error',
      'copy-patcher-to-derived-backup-fail-if-exists', 'set-backup-hidden', 'arm-poll-timer',
      'create-process-with-explicit-backup-application-name-in-install-directory', 'retain-process-handle',
      'poll-exit-code', 'on-exit-stop-timer-close-handle-clear-slot', 'delete-backup', 'dispatch-exit-policy']),
  });
}

/** Describe one native poll. The 30-minute threshold warns once; it neither kills nor finishes the process. */
export function interpretWin32LauncherPatchPoll(value) {
  const input = record(value, ['hasProcess', 'querySucceeded', 'exitCode', 'startTick', 'nowTick', 'warningShown'], 'WIN32_PATCH_POLL_INPUT');
  if (typeof input.hasProcess !== 'boolean' || typeof input.querySucceeded !== 'boolean' || typeof input.warningShown !== 'boolean'
      || ![input.exitCode, input.startTick, input.nowTick].every(uint32)) fail('WIN32_PATCH_POLL_INPUT');
  const elapsedMs = (input.nowTick - input.startTick) >>> 0;
  const disposition = !input.hasProcess ? 'no-process' : !input.querySucceeded ? 'query-failed'
    : input.exitCode === WIN32_LAUNCHER_PATCH_PROFILE.runningExitCode ? 'running' : 'exited';
  const exited = disposition === 'exited', running = disposition === 'running';
  const warn = running && !input.warningShown && elapsedMs >= WIN32_LAUNCHER_PATCH_PROFILE.warningAfterMs;
  return Object.freeze({ disposition, elapsedMs, warn, warningShown: input.warningShown || warn,
    continuePolling: running || disposition === 'query-failed', killTimer: exited || disposition === 'no-process',
    closeProcess: exited, clearProcess: exited, dispatchExit: exited,
    exitCode: input.hasProcess && input.querySucceeded ? input.exitCode : null,
    termination: 'not-requested', execution: 'not-performed', authentication: 'unverified' });
}

/** A completed poll dispatch only. Retry is descriptive, and a valid selection is required to mark completion. */
export function interpretWin32LauncherPatchExit(value) {
  const input = record(value, ['exitCode', 'attempt', 'selectionValid'], 'WIN32_PATCH_EXIT_INPUT');
  if (!uint32(input.exitCode) || input.exitCode === 259 || !Number.isInteger(input.attempt) || input.attempt < 1 || input.attempt > 3
      || typeof input.selectionValid !== 'boolean') fail('WIN32_PATCH_EXIT_INPUT');
  const { exitCode, attempt, selectionValid } = input;
  const disposition = exitCode === 100 ? selectionValid ? 'completed' : 'selection-invalid'
    : exitCode === 101 ? 'source-failed' : exitCode === 102 ? attempt < 3 ? 'retry' : 'retry-exhausted' : 'unexpected-exit';
  const retry = disposition === 'retry';
  return Object.freeze({ exitCode, attempt, disposition, markPatched: disposition === 'completed', retry,
    nextAttempt: retry ? attempt + 1 : null, deleteBackup: true, emitResult: !retry,
    resultCode: retry ? null : disposition === 'selection-invalid' ? 0x585 : exitCode,
    execution: 'not-performed', authentication: 'unverified', fileIntegrity: 'unverified' });
}

/** Fixed launcher PatchEXE producer and exit policy, expressed only as owned bytes and data. Never executes or writes files. */
export const LAUNCHER_PATCH_LIMITS = Object.freeze({ fieldBytes: 4096, commandBytes: 32767, attempts: 3 });
export class LauncherPatchError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherPatchError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherPatchError(code, message); };
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
function own(value, key) {
  let descriptor; try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch { fail('PATCH_PLAN_INPUT', 'Expected own data fields.'); }
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('PATCH_PLAN_INPUT', 'Expected own data fields.');
  return descriptor.value;
}
function bytes(value) {
  let length; try { length = Reflect.apply(typedLength, value, []); } catch { fail('PATCH_PLAN_INPUT', 'Expected actual Uint8Array fields.'); }
  if (!(value instanceof Uint8Array) || !Number.isInteger(length)) fail('PATCH_PLAN_INPUT', 'Expected actual Uint8Array fields.');
  if (length > LAUNCHER_PATCH_LIMITS.fieldBytes) fail('PATCH_PLAN_BUDGET', 'Field exceeds the byte budget.');
  let output; try { output = new Uint8Array(value); } catch { fail('PATCH_PLAN_INPUT', 'Expected attached byte fields.'); }
  if (output.includes(0)) fail('PATCH_PLAN_NUL', 'Embedded NUL is outside the supported producer profile.');
  return output;
}
function concat(...parts) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  if (size + 1 > LAUNCHER_PATCH_LIMITS.commandBytes) fail('PATCH_PLAN_BUDGET', 'Constructed byte string exceeds the command budget.');
  const output = new Uint8Array(size); let at = 0;
  for (const part of parts) { output.set(part, at); at += part.length; }
  return output;
}
const ascii = value => Uint8Array.from(value, character => character.charCodeAt(0));
const latin = value => { let text = ''; for (const byte of value) text += String.fromCharCode(byte); return text; };
const terminated = value => { const output = new Uint8Array(value.length+1); output.set(value); return output; };

/** ASCII/C case profile for PatchEXE only. Directory/address/port are unchanged raw bytes; no quoting or ACP inference. */
export function createLauncherPatchPlan(value) {
  const alreadyPatched = own(value, 'alreadyPatched');
  if (typeof alreadyPatched !== 'boolean' || own(value, 'caseProfile') !== 'ascii') fail('PATCH_PLAN_INPUT', 'Choose explicit completion and ASCII case policies.');
  const directory = bytes(own(value, 'directoryBytes')), patcher = bytes(own(value, 'patcherBytes')),
    code = bytes(own(value, 'codeTextBytes')), address = bytes(own(value, 'addressBytes')), port = bytes(own(value, 'portBytes'));
  if (!directory.length || !/^[0-9]{1,10}$/.test(latin(code)) || Number(latin(code)) > 14) fail('PATCH_PLAN_INPUT', 'Expected a directory and supported original game Code text.');
  if (patcher.some(byte => byte < 32 || byte > 126)) fail('PATCH_PLAN_CASE', 'Non-ASCII patcher casing is not established.');
  const backupName = ascii(latin(patcher).replace(/[a-z]/g, character => character.toUpperCase()).replaceAll('.EXE', '.BAK.EXE'));
  const slash = ascii('\\'), space = ascii(' '), originalPath = concat(directory, slash, patcher), backupPath = concat(directory, slash, backupName);
  const command = concat(backupPath, space, address, space, port);
  const disposition = alreadyPatched ? 'already-patched' : !patcher.length ? 'no-patcher' : 'patch-requested';
  return Object.freeze({ disposition, commandLineBytes: terminated(command), workingDirectoryBytes: terminated(directory),
    originalPatcherPathBytes: terminated(originalPath), backupPatcherPathBytes: terminated(backupPath), backupNameBytes: backupName,
    packagedSourceRelativeBytes: terminated(concat(code, slash, patcher)),
    addressBytes: address, portBytes: port, codeTextBytes: code,
    caseProfile: 'ascii', quoting: 'native-raw-unquoted', attempts: 3, hiddenBackupAttribute: 2,
    nativeOperations: Object.freeze(['if-missing-copy-from-Code-directory', 'copy-patcher-to-derived-backup', 'set-backup-hidden',
      'create-process-in-install-directory', 'wait-read-exit', 'delete-backup']),
    execution: 'not-performed', fileOperations: 'not-performed', trust: 'unverified', authentication: 'unverified' });
}

/** Native return codes are update bookkeeping only, never authentication or verified file integrity. */
export function interpretLauncherPatchExit(value) {
  const exitCode = own(value, 'exitCode'), attempt = own(value, 'attempt');
  if (!Number.isInteger(exitCode) || exitCode < 0 || exitCode > 0xffffffff || !Number.isInteger(attempt) || attempt < 1 || attempt > 3) fail('PATCH_EXIT_INPUT', 'Expected an unsigned exit code and attempt1..3.');
  const disposition = exitCode === 100 ? 'completed' : exitCode === 101 ? 'source-failed' : exitCode === 102 ? attempt < 3 ? 'retry' : 'retry-exhausted' : 'unexpected-exit';
  return Object.freeze({ exitCode, attempt, disposition, markPatched: exitCode === 100, retry: disposition === 'retry',
    nextAttempt: disposition === 'retry' ? attempt+1 : null, authentication: 'unverified', fileIntegrity: 'unverified' });
}

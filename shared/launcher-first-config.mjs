/** Fixed launcher first-Config producer. Account-derived lookup bytes are caller-owned; no profile/file/process I/O. */
import { md5Hex } from './md5.mjs';
export const LAUNCHER_FIRST_CONFIG_LIMITS = Object.freeze({ usernameBytes: 16, fieldBytes: 4096, commandBytes: 32767 });
export class LauncherFirstConfigError extends Error {
  constructor(code) { super('First configuration input or observation is unsupported.'); this.name = 'LauncherFirstConfigError'; this.code = code; }
}
const fail = code => { throw new LauncherFirstConfigError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype), lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get,
  bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get, bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const fill = Uint8Array.prototype.fill;
function own(value, key) {
  let field; try { field = Object.getOwnPropertyDescriptor(value, key); } catch { fail('FIRST_CONFIG_INPUT'); }
  if (!field || !Object.hasOwn(field, 'value')) fail('FIRST_CONFIG_INPUT');
  return field.value;
}
function bytes(value, maximum = LAUNCHER_FIRST_CONFIG_LIMITS.fieldBytes) {
  try {
    if (value instanceof ArrayBuffer) { Reflect.apply(bufferLength, value, []); value = new Uint8Array(value); }
    if (!(value instanceof Uint8Array)) fail('FIRST_CONFIG_INPUT');
    const length = Reflect.apply(lengthOf, value, []); Reflect.apply(bufferLength, Reflect.apply(bufferOf, value, []), []);
    if (length > maximum) fail('FIRST_CONFIG_BUDGET');
    const copy = new Uint8Array(value);
    if (copy.includes(0)) { Reflect.apply(fill, copy, [0]); fail('FIRST_CONFIG_NUL'); }
    return copy;
  } catch (error) { if (error instanceof LauncherFirstConfigError) throw error; fail('FIRST_CONFIG_INPUT'); }
}
const ascii = value => Uint8Array.from(value, character => character.charCodeAt(0));
function concat(...parts) {
  const length = parts.reduce((n, row) => n + row.length, 0);
  if (length + 1 > LAUNCHER_FIRST_CONFIG_LIMITS.commandBytes) fail('FIRST_CONFIG_BUDGET');
  const result = new Uint8Array(length + 1); let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}
const word = value => { if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('FIRST_CONFIG_INPUT'); return value; };

/** firstConfigWord is an explicit GetPrivateProfileInt result, not an authentication/permission state. */
export function createLauncherFirstConfigPlan(input) {
  const owned = [];
  const take = (key, maximum) => { const value = bytes(own(input, key), maximum); owned.push(value); return value; };
  try {
    const username = take('usernameBytes', LAUNCHER_FIRST_CONFIG_LIMITS.usernameBytes), code = take('codeTextBytes'),
      directory = take('directoryBytes'), configurer = take('configurerBytes'), firstConfigWord = word(own(input, 'firstConfigWord'));
    let codeText = ''; for (const byte of code) codeText += String.fromCharCode(byte);
    if (!/^[0-9]{1,10}$/.test(codeText) || Number(codeText) > 14) fail('FIRST_CONFIG_INPUT');
    const lookup = Object.freeze({ sectionBytes: concat(ascii(md5Hex(username))), keyBytes: concat(ascii('Game'), code, ascii('_Config')),
      defaultWord: 1, accountDerived: true, authentication: 'unverified' });
    const disposition = firstConfigWord === 0 ? 'flag-clear' : configurer.length === 0 ? 'no-configuration-program' : 'configuration-requested';
    return Object.freeze({ disposition, firstConfigWord, lookup,
      commandLineBytes: disposition === 'configuration-requested' ? concat(directory, ascii('\\'), configurer) : new Uint8Array(),
      workingDirectoryBytes: disposition === 'configuration-requested' ? concat(directory) : new Uint8Array(),
      applicationName: null, inheritHandles: false, creationFlags: 0, environment: 'inherit', quoting: 'native-raw-unquoted',
      waitTimeoutWord: 0xffffffff, profileWrites: 'not-performed', execution: 'not-performed', configurationVerified: 'unverified', authentication: 'unverified' });
  } finally { for (const value of owned) Reflect.apply(fill, value, [0]); }
}

/** Interprets explicit local observations. No process wait, flag mutation or profile write is performed. */
export function interpretLauncherFirstConfigOutcome(input) {
  const requested = own(input, 'planDisposition');
  if (!['flag-clear', 'no-configuration-program', 'configuration-requested'].includes(requested)) fail('FIRST_CONFIG_STATE');
  let disposition = 'not-requested', writeValue = null, continueContextPreparation = true, waiting = false;
  if (requested === 'configuration-requested') {
    const created = own(input, 'processCreated'); if (typeof created !== 'boolean') fail('FIRST_CONFIG_STATE');
    if (!created) disposition = 'create-failed-continue';
    else {
      const returned = own(input, 'waitReturned'); if (typeof returned !== 'boolean') fail('FIRST_CONFIG_STATE');
      if (!returned) { disposition = 'waiting'; waiting = true; continueContextPreparation = false; }
      else { disposition = 'profile-write-requested'; writeValue = 0; }
    }
  }
  return Object.freeze({ disposition, waiting, writeRequested: writeValue !== null, writeValue, continueContextPreparation,
    waitResultChecked: false, processExitCodeChecked: false, writeResultChecked: false,
    profileWrites: 'not-performed', execution: 'not-performed', configurationVerified: 'unverified', authentication: 'unverified' });
}

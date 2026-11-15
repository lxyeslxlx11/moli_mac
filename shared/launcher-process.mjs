/** Proven launcher command/resource production from explicit byte snapshots. No file access or execution. */
export const LAUNCHER_PROCESS_LIMITS = Object.freeze({ fieldBytes: 4096, commandBytes: 32767,
  entriesPerGroup: 4096, fileNameBytes: 259, fileTitleBytes: 255, gameCodeMax: 14 });
export const LAUNCHER_RESOURCE_GROUPS = Object.freeze([
  ['bin-anime', '\\Bin\\anime*.bin'], ['bin-graphic', '\\Bin\\graphic*.bin'],
  ['puk2-anime', '\\Bin\\Puk2\\anime*.bin'], ['puk2-graphic', '\\Bin\\Puk2\\graphic*.bin'],
  ['puk3-anime', '\\Bin\\Puk3\\anime*.bin'], ['puk3-graphic', '\\Bin\\Puk3\\graphic*.bin'],
  ['bin-coordinate', '\\Bin\\coordinate*.bin'],
].map(([id, suffix]) => Object.freeze({ id, suffix })));
const messages = Object.freeze({ PROCESS_INPUT: 'Expected explicit process snapshot data properties.',
  PROCESS_BYTES: 'Expected bounded non-NUL byte fields.', PROCESS_BUDGET: 'Process snapshot exceeds the supported budget.',
  PROCESS_GAME: 'Game code is outside the supported request slots.', RESOURCE_SNAPSHOT: 'Resource enumeration snapshot is invalid.',
  RESOURCE_PROFILE: 'Select the explicit ASCII file-title profile.', RESOURCE_NAME: 'Unsupported resource filename or title.' });
export class LauncherProcessError extends Error {
  constructor(code) { const selected = typeof code === 'string' && Object.hasOwn(messages, code) ? code : 'PROCESS_INPUT';
    super(messages[selected]); this.name = 'LauncherProcessError'; this.code = selected; }
}
const fail = code => { throw new LauncherProcessError(code); };
function own(value, key) {
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('PROCESS_INPUT');
    const property = Object.getOwnPropertyDescriptor(value, key);
    if (!property || !Object.hasOwn(property, 'value')) fail('PROCESS_INPUT');
    return property.value;
  } catch { fail('PROCESS_INPUT'); }
}
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function bytes(value, limit, empty = true) {
  let output;
  try {
    if (value instanceof ArrayBuffer) { Reflect.apply(bufferLength, value, []); value = new Uint8Array(value); }
    if (!(value instanceof Uint8Array)) fail('PROCESS_BYTES');
    const length = Reflect.apply(typedLength, value, []);
    Reflect.apply(bufferLength, Reflect.apply(typedBuffer, value, []), []);
    if (length < (empty ? 0 : 1) || length > limit) fail('PROCESS_BUDGET');
    output = new Uint8Array(value);
    if (output.includes(0)) fail('PROCESS_BYTES');
    return output;
  } catch (error) { output?.fill(0); if (error instanceof LauncherProcessError) throw error; fail('PROCESS_BYTES'); }
}
function array(value, limit) {
  try {
    if (!Array.isArray(value)) fail('RESOURCE_SNAPSHOT');
    const length = Object.getOwnPropertyDescriptor(value, 'length')?.value;
    if (!Number.isInteger(length) || length < 0 || length > limit) fail('PROCESS_BUDGET');
    return { length, at(index) {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
        if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('RESOURCE_SNAPSHOT');
        return descriptor.value;
      } catch { fail('RESOURCE_SNAPSHOT'); }
    } };
  } catch (error) { if (error instanceof LauncherProcessError) throw error; fail('RESOURCE_SNAPSHOT'); }
}
const ascii = text => Uint8Array.from(text, character => character.charCodeAt(0));
function concatenate(parts, terminate = false) {
  const length = parts.reduce((sum, part) => sum + part.length, terminate ? 1 : 0);
  if (length > LAUNCHER_PROCESS_LIMITS.commandBytes) fail('PROCESS_BUDGET');
  const output = new Uint8Array(length); let at = 0;
  for (const part of parts) { output.set(part, at); at += part.length; }
  return output;
}
const word = value => { if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('PROCESS_INPUT'); return value; };
const cgBranch = gameCode => gameCode <= 2 || gameCode === 4 || gameCode === 11;
function fileName(value) {
  const input = bytes(value, LAUNCHER_PROCESS_LIMITS.fileNameBytes, false);
  try {
    let text = '';
    for (const byte of input) {
      if (byte < 0x20 || byte > 0x7e || byte === 0x2f || byte === 0x5c || byte === 0x3a) fail('RESOURCE_NAME');
      text += String.fromCharCode(byte);
    }
    return text;
  } finally { input.fill(0); }
}
function argument(title) {
  let text = title.replace(/[A-Z]/g, letter => String.fromCharCode(letter.charCodeAt(0) + 32));
  const last = text.lastIndexOf('_');
  // The native backward loop includes index length but stops before index0.
  if (last > 0) text = text.slice(0, last) + ':' + text.slice(last + 1);
  for (const keyword of ['info', 'graphic', 'anime', 'coordinate']) {
    if (text.includes(keyword)) return text.split(keyword).join(keyword + 'bin');
  }
  return text;
}

/** Entries are an ordered FindFile/FindNext result snapshot. No wildcard matching or native order inference. */
export function createLauncherResourceArguments(input) {
  if (own(input, 'caseProfile') !== 'ascii') fail('RESOURCE_PROFILE');
  const state = own(input, 'state'), rows = [];
  if (state === 'find-failed') return Object.freeze({ state, bytes: new Uint8Array(0), rows: Object.freeze(rows),
    entriesSeen: 0, skippedDirectories: 0, enumerationOrder: 'provided', sourceCompletion: 'unverified' });
  if (state !== 'enumerated') fail('RESOURCE_SNAPSHOT');
  const entries = array(own(input, 'entries'), LAUNCHER_PROCESS_LIMITS.entriesPerGroup);
  let text = '', skippedDirectories = 0;
  for (let index = 0; index < entries.length; index++) {
    const entry = entries.at(index), attributes = word(own(entry, 'attributes'));
    const name = fileName(own(entry, 'fileNameBytes')), directory = (attributes & 0x10) !== 0;
    if (directory && (name === '.' || name === '..')) { skippedDirectories++; continue; }
    const dot = name.lastIndexOf('.'), title = dot < 0 ? name : name.slice(0, dot);
    if (title.length > LAUNCHER_PROCESS_LIMITS.fileTitleBytes) fail('RESOURCE_NAME');
    if (directory) { skippedDirectories++; continue; }
    const token = argument(title);
    if (text.length + token.length + 1 > LAUNCHER_PROCESS_LIMITS.commandBytes) fail('PROCESS_BUDGET');
    text += ' ' + token;
    rows.push(Object.freeze({ sourceOrdinal: index, fileName: name, argument: token }));
  }
  return Object.freeze({ state, bytes: ascii(text), rows: Object.freeze(rows), entriesSeen: entries.length,
    skippedDirectories, enumerationOrder: 'provided', sourceCompletion: 'unverified' });
}

/** Raw current-field bytes, not decoded paths/argv. This describes a native branch; it never authorizes execution. */
export function createLauncherProcessPlan(input) {
  const gameCode = own(input, 'gameCode'), onlyRefreshWord = word(own(input, 'onlyRefreshWord'));
  if (!Number.isInteger(gameCode) || gameCode < 0 || gameCode > LAUNCHER_PROCESS_LIMITS.gameCodeMax) fail('PROCESS_GAME');
  const owned = [], groups = []; let commandLineBytes, workingDirectoryBytes;
  try {
    const read = name => { const result = bytes(own(input, name), LAUNCHER_PROCESS_LIMITS.fieldBytes); owned.push(result); return result; };
    const directory = read('directoryBytes'), executable = read('executablePathBytes'), base = read('argsLineBytes');
    const region = read('regionArgsBytes'), galaxy = read('galaxyArgsBytes');
    const parts = [executable, ascii(' '), base];
    if (region.length) parts.push(ascii(' '), region);
    if (galaxy.length) parts.push(ascii(' '), galaxy);
    const resourceEnumerationRequested = cgBranch(gameCode) && onlyRefreshWord === 0;
    if (resourceEnumerationRequested) {
      const caseProfile = own(input, 'caseProfile'), snapshots = array(own(input, 'resourceGroups'), 7);
      if (snapshots.length !== 7) fail('RESOURCE_SNAPSHOT');
      for (let index = 0; index < 7; index++) {
        const descriptor = LAUNCHER_RESOURCE_GROUPS[index], source = snapshots.at(index);
        if (own(source, 'id') !== descriptor.id) fail('RESOURCE_SNAPSHOT');
        const state = own(source, 'state');
        const args = createLauncherResourceArguments(state === 'find-failed' ? { caseProfile, state } :
          { caseProfile, state, entries: own(source, 'entries') });
        owned.push(args.bytes); parts.push(args.bytes);
        groups.push(Object.freeze({ id: descriptor.id, patternBytes: concatenate([directory, ascii(descriptor.suffix)], true),
          rows: args.rows, entriesSeen: args.entriesSeen, skippedDirectories: args.skippedDirectories,
          state: args.state, enumerationOrder: args.enumerationOrder, sourceCompletion: args.sourceCompletion }));
      }
    }
    commandLineBytes = concatenate(parts, true);
    const suffix = gameCode === 3 ? '\\Bin\\' : gameCode === 5 ? '\\GBrowser\\' : '';
    workingDirectoryBytes = concatenate([directory, ascii(suffix)], true);
    return Object.freeze({ gameCode, onlyRefreshWord, commandLineBytes, workingDirectoryBytes,
      resourceEnumerationRequested, resourceGroups: Object.freeze(groups),
      clientCreationRequested: !(cgBranch(gameCode) && onlyRefreshWord !== 0),
      applicationName: null, inheritHandles: false, creationFlags: 0, environment: 'inherit',
      upstreamReady: 'unverified', authentication: 'unverified', gameAcceptance: 'unverified', execution: 'not-performed' });
  } catch (error) {
    commandLineBytes?.fill(0); workingDirectoryBytes?.fill(0); for (const group of groups) group.patternBytes.fill(0);
    throw error;
  } finally { for (const item of owned) item.fill(0); }
}

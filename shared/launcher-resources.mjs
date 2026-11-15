/** Independent resource-cache format. No credentials, filesystem, network, native install or authentication. */
import { applyGamePatchCandidates, GAME_PATCH_LIMITS } from './game-patch.mjs';
import { md5Hex } from './md5.mjs';
import { localDirectoryPath } from './local-paths.mjs';
import { PUK3_PATCH_SOURCE_PROFILE } from './launcher-patch-sources.mjs';

export const LAUNCHER_RESOURCE_FORMAT = Object.freeze({ schema: 'moli.launcher.resources.v1', sourceSchema: 'moli.launcher.resources.v2',
  files: GAME_PATCH_LIMITS.files, fileBytes: GAME_PATCH_LIMITS.fileBytes, totalBytes: GAME_PATCH_LIMITS.totalBytes });
export class LauncherResourceError extends Error {
  constructor(code = 'RESOURCE_INPUT') { super('Resource snapshot does not match the supported local format.'); this.name = 'LauncherResourceError'; this.code = code; }
}
const fail = code => { throw new LauncherResourceError(code); };
const requiredBinding = ['gameListMd5', 'regionListMd5', 'gameOrdinal', 'referenceOrdinal', 'regionOrdinal', 'gameCodeText', 'directoryText', 'pathEncoding'];
const sourceBindingFields = ['patchSourceProfile', 'patchSourceOrdinal'];
const allowedBinding = [...requiredBinding, 'galaxyOrdinal', ...sourceBindingFields];
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const typedPrototype = Object.getPrototypeOf(Uint8Array.prototype);
const typedLength = Object.getOwnPropertyDescriptor(typedPrototype, 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(typedPrototype, 'buffer').get;
function own(value, name, optional = false) {
  let descriptor;
  try { descriptor = Object.getOwnPropertyDescriptor(value, name); } catch { fail('RESOURCE_INPUT'); }
  if (!descriptor && optional) return undefined;
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('RESOURCE_INPUT');
  return descriptor.value;
}
function keys(value, required, optional = []) {
  let names;
  try { if (!value || typeof value !== 'object' || Array.isArray(value)) fail('RESOURCE_INPUT'); names = Reflect.ownKeys(value); }
  catch { fail('RESOURCE_INPUT'); }
  if (required.some(name => !names.includes(name)) || names.some(name => !required.includes(name) && !optional.includes(name))) fail('RESOURCE_FORMAT');
}
const ordinal = value => { if (!Number.isSafeInteger(value) || value < 0 || value > 0x7fffffff) fail('RESOURCE_BINDING'); return value; };
const digest = value => { if (typeof value !== 'string' || !/^[0-9a-f]{32}$/.test(value)) fail('RESOURCE_BINDING'); return value; };

/** Picks only these non-secret fields from the already validated catalog patch binding. */
export function snapshotLauncherResourceBinding(value) {
  const gameListMd5 = digest(own(value, 'gameListMd5')), regionListMd5 = digest(own(value, 'regionListMd5'));
  const gameOrdinal = ordinal(own(value, 'gameOrdinal')), referenceOrdinal = ordinal(own(value, 'referenceOrdinal')), regionOrdinal = ordinal(own(value, 'regionOrdinal'));
  const gameCodeText = own(value, 'gameCodeText'), directory = own(value, 'directoryText'), pathEncoding = own(value, 'pathEncoding'), galaxyOrdinal = own(value, 'galaxyOrdinal', true);
  if (typeof gameCodeText !== 'string' || gameCodeText.length < 1 || gameCodeText.length > 4096 || !/^[0-9]+$/.test(gameCodeText) || Number(gameCodeText) > 14 ||
      !['ascii', 'windows-936', 'utf-8'].includes(pathEncoding)) fail('RESOURCE_BINDING');
  let directoryText; try { directoryText = localDirectoryPath(directory); } catch { fail('RESOURCE_BINDING'); }
  const patchSourceProfile = own(value, 'patchSourceProfile', true), patchSourceOrdinal = own(value, 'patchSourceOrdinal', true);
  let sourceBinding = {};
  if (patchSourceProfile !== undefined || patchSourceOrdinal !== undefined) {
    if (patchSourceProfile === 'configured-only' && patchSourceOrdinal === 0) {
      // Keep the legacy default key and v1 representation byte-for-byte stable.
    } else if (patchSourceProfile === PUK3_PATCH_SOURCE_PROFILE.id && [0, 1].includes(patchSourceOrdinal)) {
      sourceBinding = { patchSourceProfile, patchSourceOrdinal };
    } else fail('RESOURCE_BINDING');
  }
  return Object.freeze({ gameListMd5, regionListMd5, gameOrdinal, referenceOrdinal, regionOrdinal, gameCodeText, directoryText, pathEncoding,
    ...(galaxyOrdinal === undefined ? {} : { galaxyOrdinal: ordinal(galaxyOrdinal) }), ...sourceBinding });
}
export function launcherResourceBindingKey(value) { return JSON.stringify(snapshotLauncherResourceBinding(value)); }

function inputFiles(value, stored = false) {
  if (!Array.isArray(value)) fail('RESOURCE_INPUT');
  const count = own(value, 'length'); if (count > GAME_PATCH_LIMITS.files) fail('RESOURCE_BUDGET');
  const rows = [], digests = []; let total = 0;
  for (let i = 0; i < count; i++) {
    const row = own(value, String(i)); if (stored) keys(row, ['path', 'bytes', 'md5']);
    const path = own(row, 'path'), bytes = own(row, 'bytes'); let length;
    try {
      if (bytes instanceof ArrayBuffer) length = Reflect.apply(bufferLength, bytes, []);
      else { length = Reflect.apply(typedLength, bytes, []); Reflect.apply(bufferLength, Reflect.apply(typedBuffer, bytes, []), []); }
      if (!(bytes instanceof ArrayBuffer) && !(bytes instanceof Uint8Array)) fail('RESOURCE_INPUT');
    } catch { fail('RESOURCE_INPUT'); }
    if (length > GAME_PATCH_LIMITS.fileBytes || (total += length) > GAME_PATCH_LIMITS.totalBytes) fail('RESOURCE_BUDGET');
    rows.push({ path, bytes }); if (stored) digests.push(own(row, 'md5'));
  }
  return { rows, digests };
}
function candidateFiles(rows) {
  try { return applyGamePatchCandidates({ manifestBytes: new Uint8Array(), files: rows, archives: [] }).files; }
  catch { fail('RESOURCE_FILES'); }
}

/** Owns all payload bytes and computes compatibility digests; does not assert their source or installation. */
export function createLauncherResourceSnapshot(value) {
  keys(value, ['binding', 'files']);
  const binding = snapshotLauncherResourceBinding(own(value, 'binding')), { rows } = inputFiles(own(value, 'files'));
  const files = candidateFiles(rows).map(row => Object.freeze({ path: row.path, bytes: row.bytes, md5: md5Hex(row.bytes) }));
  const schema = Object.hasOwn(binding, 'patchSourceProfile') ? LAUNCHER_RESOURCE_FORMAT.sourceSchema : LAUNCHER_RESOURCE_FORMAT.schema;
  return Object.freeze({ schema, binding, files: Object.freeze(files), trust: 'unverified' });
}

/** Strict own-format read with fresh path/tree/budget/digest validation and independent byte ownership. */
export function readLauncherResourceSnapshot(value) {
  keys(value, ['schema', 'binding', 'files', 'trust']);
  const schema = own(value, 'schema');
  if (![LAUNCHER_RESOURCE_FORMAT.schema, LAUNCHER_RESOURCE_FORMAT.sourceSchema].includes(schema) || own(value, 'trust') !== 'unverified') fail('RESOURCE_FORMAT');
  const rawBinding = own(value, 'binding');
  keys(rawBinding, schema === LAUNCHER_RESOURCE_FORMAT.sourceSchema ? [...requiredBinding, ...sourceBindingFields] : requiredBinding, ['galaxyOrdinal']);
  const binding = snapshotLauncherResourceBinding(rawBinding);
  for (const name of ['galaxyOrdinal', ...sourceBindingFields]) {
    if (Object.hasOwn(rawBinding, name) !== Object.hasOwn(binding, name)) fail('RESOURCE_FORMAT');
  }
  for (const name of allowedBinding) if (own(rawBinding, name, true) !== binding[name]) fail('RESOURCE_FORMAT');
  const { rows, digests } = inputFiles(own(value, 'files'), true), files = candidateFiles(rows).map((row, index) => {
    const actual = md5Hex(row.bytes);
    if (rows[index].path !== row.path || digests[index] !== actual) fail('RESOURCE_DIGEST');
    return Object.freeze({ path: row.path, bytes: row.bytes, md5: actual });
  });
  return Object.freeze({ schema, binding, files: Object.freeze(files), trust: 'unverified' });
}

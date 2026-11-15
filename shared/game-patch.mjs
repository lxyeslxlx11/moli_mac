/** Fixed Patcher_PUK3 manifest and in-memory ZIP candidates. No I/O, process, network or source authentication. */
import { decodeGamePatchArchive } from './launcher-update.mjs';
import { md5Hex } from './md5.mjs';

import { GAME_PATCH_LIMITS, GamePatchError } from './game-patch-data.mjs';
export { GAME_PATCH_LIMITS, GamePatchError } from './game-patch-data.mjs';
import { gamePatchPath as path, gamePatchKey as key, validateGamePatchTree as validateTree } from './game-patch-paths.mjs';
const fail = (code, message) => { throw new GamePatchError(code, message); };
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function bytes(value, maximum) {
  try {
    if (value instanceof ArrayBuffer) { Reflect.apply(bufferLength, value, []); value = new Uint8Array(value); }
    if (!(value instanceof Uint8Array)) fail('PATCH_INPUT', 'Expected actual bytes.');
    const length = Reflect.apply(typedLength, value, []);
    if (!Number.isInteger(length)) fail('PATCH_INPUT', 'Expected actual bytes.');
    if (length > maximum) fail('PATCH_BUDGET', 'Byte input exceeds the explicit implementation budget.');
    return new Uint8Array(value);
  } catch (error) {
    if (error instanceof GamePatchError) throw error;
    fail('PATCH_INPUT', 'Expected attached byte storage.');
  }
}
const latin = data => { let result = ''; for (const byte of data) result += String.fromCharCode(byte); return result; };
const raw = text => Uint8Array.from(text, character => character.charCodeAt(0));
const trim = text => text.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
// Native helper emits empty interior pieces, and omits only the final empty tail.
function split(text, separator) { if (!text) return []; const parts = text.split(separator); if (!parts.at(-1)) parts.pop(); return parts; }
function record(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('PATCH_INPUT', 'Expected an explicit record.');
  return value;
}
function field(value, name) {
  const descriptor = Object.getOwnPropertyDescriptor(record(value), name);
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('PATCH_INPUT', 'Expected an own data field.');
  return descriptor.value;
}

/** Byte grammar is observed. Budgets and NUL rejection are independent strict policies. Unknown commands are reported and skipped. */
export function parseGamePatchManifest(value) {
  const data = bytes(value, GAME_PATCH_LIMITS.manifestBytes);
  if (data.includes(0)) fail('PATCH_NUL', 'NUL truncation is outside the supported manifest profile.');
  const blocks = split(trim(latin(data)), '}'), operations = [], skippedBlocks = [];
  if (blocks.length > GAME_PATCH_LIMITS.blocks) fail('PATCH_BUDGET', 'Manifest has too many blocks.');
  for (let blockOrdinal = 0; blockOrdinal < blocks.length; blockOrdinal += 1) {
    let block = blocks[blockOrdinal];
    for (const pattern of ['\r', '\t', ' ', '{\n']) block = block.replaceAll(pattern, '');
    const lines = split(trim(block), '\n');
    if (lines.length > GAME_PATCH_LIMITS.linesPerBlock) fail('PATCH_BUDGET', 'Manifest block has too many lines.');
    const operation = lines[0];
    if (lines.length < 2 || !['create', 'append', 'replaceto'].includes(operation)) {
      skippedBlocks.push(Object.freeze({ blockOrdinal, reason: lines.length < 2 ? 'too-few-lines' : 'unknown-command' })); continue;
    }
    const values = new Map(); let ignoredLineCount = 0, duplicateFieldCount = 0;
    for (const line of lines.slice(1)) {
      const pair = split(line, ':');
      if (pair.length !== 2) { ignoredLineCount += 1; continue; }
      if (pair.some(item => item.length > GAME_PATCH_LIMITS.fieldBytes)) fail('PATCH_BUDGET', 'Field exceeds the byte budget.');
      if (values.has(pair[0])) { duplicateFieldCount += 1; continue; }
      values.set(pair[0], pair[1]);
    }
    operations.push(Object.freeze({ blockOrdinal, operation, fields: Object.freeze(Array.from(values,
      ([key, value]) => Object.freeze({ keyBytes: raw(key), valueBytes: raw(value) }))), ignoredLineCount, duplicateFieldCount }));
    if (operations.length > GAME_PATCH_LIMITS.operations) fail('PATCH_BUDGET', 'Manifest has too many operations.');
  }
  return Object.freeze({ inputBytes: data.length, blockCount: blocks.length, operations: Object.freeze(operations),
    skippedBlocks: Object.freeze(skippedBlocks), trust: 'unverified' });
}

const join = (directory, name) => path(directory ? directory + '/' + name : name);
function parameters(operation) {
  const values = new Map(operation.fields.map(row => [latin(row.keyBytes), latin(row.valueBytes)]));
  const name = values.get('name') || '', directory = path(values.get('path') || '', true), old = values.get('old_name') || '';
  // Original append treats missing names as a successful no-op; create/replaceto additionally require nonempty md5.
  if (!name || (operation.operation === 'append' ? !old : !values.get('md5'))) return null;
  const target = join(directory, path(name)), oldPath = old ? join(directory, path(old)) : null;
  const expectedMd5 = values.get('md5');
  if (!expectedMd5 || !/^[0-9a-f]{32}$/.test(expectedMd5)) fail('PATCH_DIGEST_POLICY', 'Candidate verification requires a lowercase full MD5, including append.');
  if (operation.operation === 'replaceto' && oldPath && oldPath.toLowerCase() === target.toLowerCase()) fail('PATCH_PATH_ALIAS', 'Replacement source and destination must be distinct.');
  return { directory, name: path(name), target, oldPath, expectedMd5 };
}

function snapshotFiles(fileRows) {
  if (!Array.isArray(fileRows) || fileRows.length > GAME_PATCH_LIMITS.files) fail('PATCH_INPUT', 'Expected a bounded explicit file array.');
  const files = new Map(); let inputTotal = 0;
  for (const row of fileRows) {
    const name = path(field(row, 'path'));
    if (key(files, name) !== null) fail('PATCH_PATH_ALIAS', 'Input files contain duplicate or case alias paths.');
    const data = bytes(field(row, 'bytes'), GAME_PATCH_LIMITS.fileBytes); inputTotal += data.length;
    if (inputTotal > GAME_PATCH_LIMITS.totalBytes) fail('PATCH_BUDGET', 'Input files exceed the total byte budget.');
    files.set(name, data);
  }
  validateTree(files);
  return files;
}
function* candidateSteps(manifest, files) {
  const operations = []; let archiveTotal = 0;
  for (const operation of manifest.operations) {
    const params = parameters(operation), report = { blockOrdinal: operation.blockOrdinal, operation: operation.operation };
    if (!params) { operations.push(Object.freeze({ ...report, disposition: 'skipped-missing-fields' })); continue; }
    const { directory, name, target, oldPath, expectedMd5 } = params;
    let current = key(files, target), oldKey = oldPath ? key(files, oldPath) : null;
    if (operation.operation !== 'append' && current !== null && md5Hex(files.get(current)) === expectedMd5) {
      operations.push(Object.freeze({ ...report, disposition: 'current', targetPath: current, actualMd5: expectedMd5, md5Verified: true })); continue;
    }
    if (operation.operation === 'append' && oldKey === null) {
      operations.push(Object.freeze({ ...report, disposition: 'skipped-base-missing', targetPath: target })); continue;
    }
    const archive = bytes(yield Object.freeze({ blockOrdinal: operation.blockOrdinal, operation: operation.operation,
      directory, name, targetPath: target, expectedMd5 }), GAME_PATCH_LIMITS.fileBytes);
    archiveTotal += archive.length;
    if (archiveTotal > GAME_PATCH_LIMITS.totalBytes) fail('PATCH_BUDGET', 'Archives exceed the total input budget.');
    const decoded = decodeGamePatchArchive(archive);
    const extracted = new Map(), directories = new Set();
    for (const row of decoded.entries) {
      const entryName = latin(row.entry.nameBytes), entryPath = path(row.entry.directory ? entryName.replace(/[\\/]$/, '') : entryName);
      if (key(extracted, entryPath) !== null || directories.has(entryPath.toLowerCase())) fail('PATCH_PATH_ALIAS', 'Archive paths are duplicated or ambiguous.');
      if (row.entry.directory) directories.add(entryPath.toLowerCase()); else extracted.set(entryPath, row.payloadBytes);
    }
    validateTree(extracted);
    for (const entry of directories) {
      let parent = entry;
      while (parent) {
        if (key(extracted, parent) !== null) fail('PATCH_PATH_ALIAS', 'Archive directory shadows a file.');
        parent = parent.includes('/') ? parent.slice(0, parent.lastIndexOf('/')) : '';
      }
    }
    const next = new Map(files);
    if (operation.operation === 'append') {
      const chunkKey = key(extracted, name);
      if (chunkKey === null) fail('PATCH_APPEND_CHUNK', 'Archive does not contain the named append chunk.');
      if (current !== null && current !== oldKey) fail('PATCH_PATH_ALIAS', 'Append rename destination already exists.');
      const base = files.get(oldKey), chunk = extracted.get(chunkKey);
      if (base.length + chunk.length > GAME_PATCH_LIMITS.fileBytes) fail('PATCH_BUDGET', 'Append output exceeds the byte budget.');
      const combined = new Uint8Array(base.length + chunk.length); combined.set(base); combined.set(chunk, base.length);
      next.delete(oldKey); next.set(target, combined);
    } else {
      const parent = target.includes('/') ? target.slice(0, target.lastIndexOf('/')) : '';
      for (const [entryName, data] of extracted) {
        const outputPath = join(parent, entryName), existing = key(next, outputPath);
        if (existing !== null) next.delete(existing);
        next.set(outputPath, data);
      }
      if (operation.operation === 'replaceto' && oldKey !== null) next.delete(oldKey);
    }
    validateTree(next); current = key(next, target);
    if (current === null || md5Hex(next.get(current)) !== expectedMd5) fail('PATCH_DIGEST_MISMATCH', 'Final target candidate does not match the supplied compatibility digest.');
    files = next;
    operations.push(Object.freeze({ ...report, disposition: 'updated', targetPath: current, actualMd5: expectedMd5, md5Verified: true,
      removedPath: operation.operation === 'append' || operation.operation === 'replaceto' ? oldKey : null,
      archiveEntryCount: decoded.entries.length }));
  }
  return Object.freeze({ manifest, operations: Object.freeze(operations), files: Object.freeze(Array.from(files,
    ([path, bytes]) => Object.freeze({ path, bytes }))), trust: 'unverified', authentication: 'unverified', replacement: 'not-performed' });
}

/** Snapshots immediately, yields only the next required package, and returns files only on completion. return() discards pending work. */
export function createGamePatchCandidateRun(value) {
  return candidateSteps(parseGamePatchManifest(field(value, 'manifestBytes')), snapshotFiles(field(value, 'files')));
}

/** All changes are provisional owned bytes. A failure returns no partial candidate and never mutates caller files. */
export function applyGamePatchCandidates(value) {
  const manifest = parseGamePatchManifest(field(value, 'manifestBytes')), run = candidateSteps(manifest, snapshotFiles(field(value, 'files'))),
    archiveRows = field(value, 'archives'), archives = new Map(), used = new Set();
  if (!Array.isArray(archiveRows) || archiveRows.length > GAME_PATCH_LIMITS.operations) fail('PATCH_INPUT', 'Expected a bounded explicit archive array.');
  const blockCount = manifest.blockCount; let total = 0;
  try {
    for (const row of archiveRows) {
      const ordinal = field(row, 'blockOrdinal');
      if (!Number.isInteger(ordinal) || ordinal < 0 || ordinal >= blockCount || archives.has(ordinal)) fail('PATCH_ARCHIVE_INPUT', 'Expected unique manifest block ordinals.');
      const data = bytes(field(row, 'bytes'), GAME_PATCH_LIMITS.fileBytes); total += data.length;
      if (total > GAME_PATCH_LIMITS.totalBytes) fail('PATCH_BUDGET', 'Archives exceed the total input budget.');
      archives.set(ordinal, data);
    }
    let step = run.next();
    while (!step.done) {
      const ordinal = step.value.blockOrdinal;
      if (!archives.has(ordinal)) fail('PATCH_ARCHIVE_MISSING', 'An operation requiring an update has no explicit archive.');
      used.add(ordinal); step = run.next(archives.get(ordinal));
    }
    if (used.size !== archives.size) fail('PATCH_ARCHIVE_UNUSED', 'An archive was not consumed by a manifest operation.');
    return step.value;
  } finally { run.return(); }
}

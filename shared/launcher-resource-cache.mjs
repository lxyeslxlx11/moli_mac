/** Original binary envelope for owned v1/v2 resource snapshots. No I/O; digests detect corruption, not authenticity. */
import { readLauncherResourceSnapshot, LAUNCHER_RESOURCE_FORMAT } from './launcher-resources.mjs';
import { md5Hex } from './md5.mjs';
export const LAUNCHER_RESOURCE_CACHE_FORMAT = Object.freeze({ id: 'moli.launcher.resource-cache.v1', headerBytes: 48,
  metadataBytes: 1048576, recordBytes: 48 + 1048576 + LAUNCHER_RESOURCE_FORMAT.totalBytes,
  maximumRevision: Number.MAX_SAFE_INTEGER - 1 });
export class LauncherResourceCacheError extends Error {
  constructor(code) { super('Local resource record failed validation.'); this.name = 'LauncherResourceCacheError'; this.code = code; }
}
const fail = code => { throw new LauncherResourceCacheError(code); };
const magic = Object.freeze([77,79,76,73,82,69,83,49]);
const typed = Object.getPrototypeOf(Uint8Array.prototype),
  typedLength = Object.getOwnPropertyDescriptor(typed, 'length').get,
  typedBuffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get,
  bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const release = resources => { for (const file of resources?.files ?? []) file.bytes.fill(0); };
function fields(value, names) {
  let descriptors;
  try { descriptors = Object.getOwnPropertyDescriptors(value); } catch { fail('RESOURCE_RECORD_INPUT'); }
  if (Reflect.ownKeys(descriptors).length !== names.length || names.some(name => !descriptors[name] || !Object.hasOwn(descriptors[name], 'value'))) fail('RESOURCE_RECORD_INPUT');
  return Object.fromEntries(names.map(name => [name, descriptors[name].value]));
}
function ownedRecord(value) {
  let length;
  try {
    if (value instanceof ArrayBuffer) { length = Reflect.apply(bufferLength, value, []); new Uint8Array(value); }
    else {
      if (!(value instanceof Uint8Array)) fail('RESOURCE_RECORD_INPUT');
      const buffer = Reflect.apply(typedBuffer, value, []); Reflect.apply(bufferLength, buffer, []); new Uint8Array(buffer);
      length = Reflect.apply(typedLength, value, []);
    }
  } catch { fail('RESOURCE_RECORD_INPUT'); }
  if (length < 50 || length > LAUNCHER_RESOURCE_CACHE_FORMAT.recordBytes) fail('RESOURCE_RECORD_BUDGET');
  return value instanceof ArrayBuffer ? new Uint8Array(new Uint8Array(value)) : new Uint8Array(value);
}
const validRevision = value => Number.isSafeInteger(value) && value >= 1 && value <= LAUNCHER_RESOURCE_CACHE_FORMAT.maximumRevision;
function metadata(resources) {
  // Escape UTF-16 code units to ASCII; JSON.parse restores surrogate pairs without a platform text codec.
  return JSON.stringify({ schema: resources.schema, binding: resources.binding,
    files: resources.files.map(file => ({ path: file.path, length: file.bytes.length, md5: file.md5 })), trust: 'unverified' })
    .replace(/[\u0080-\uffff]/g, character => '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'));
}
function checksum(header, meta) {
  const bytes = new Uint8Array(32 + meta.length); bytes.set(header.subarray(0, 32)); bytes.set(meta, 32);
  const hex = md5Hex(bytes); bytes.fill(0);
  return Uint8Array.from({ length: 16 }, (_, i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16));
}
function ascii(bytes) {
  let result = '';
  for (let at = 0; at < bytes.length; at += 4096) result += String.fromCharCode(...bytes.subarray(at, at + 4096));
  return result;
}

export function encodeLauncherResourceCacheRecord(value) {
  const { revision, resources: input } = fields(value, ['revision', 'resources']);
  if (!validRevision(revision)) fail('RESOURCE_RECORD_REVISION');
  let resources;
  try { resources = readLauncherResourceSnapshot(input); } catch { fail('RESOURCE_RECORD_CANDIDATE'); }
  try {
    const text = metadata(resources);
    if (text.length > LAUNCHER_RESOURCE_CACHE_FORMAT.metadataBytes) fail('RESOURCE_RECORD_BUDGET');
    const meta = Uint8Array.from(text, character => character.charCodeAt(0)), total = resources.files.reduce((sum, file) => sum + file.bytes.length, 0);
    const bytes = new Uint8Array(48 + meta.length + total), view = new DataView(bytes.buffer);
    bytes.set(magic); view.setUint32(8, revision % 0x100000000, true); view.setUint32(12, Math.floor(revision / 0x100000000), true);
    view.setUint32(16, meta.length, true); view.setUint32(20, total, true); view.setUint32(24, resources.files.length, true);
    bytes.set(meta, 48); let at = 48 + meta.length;
    for (const file of resources.files) { bytes.set(file.bytes, at); at += file.bytes.length; }
    bytes.set(checksum(bytes, meta), 32); return bytes;
  } finally { release(resources); }
}

export function decodeLauncherResourceCacheRecord(value) {
  const bytes = ownedRecord(value); let resources, returned = false;
  try {
    if (magic.some((byte, i) => bytes[i] !== byte) || bytes.subarray(28, 32).some(byte => byte !== 0)) fail('RESOURCE_RECORD_HEADER');
    const view = new DataView(bytes.buffer), revision = view.getUint32(8, true) + view.getUint32(12, true) * 0x100000000,
      metadataLength = view.getUint32(16, true), total = view.getUint32(20, true), count = view.getUint32(24, true);
    if (!validRevision(revision)) fail('RESOURCE_RECORD_REVISION');
    if (metadataLength < 2 || metadataLength > LAUNCHER_RESOURCE_CACHE_FORMAT.metadataBytes || total > LAUNCHER_RESOURCE_FORMAT.totalBytes
        || count > LAUNCHER_RESOURCE_FORMAT.files || bytes.length !== 48 + metadataLength + total) fail('RESOURCE_RECORD_BUDGET');
    const meta = bytes.subarray(48, 48 + metadataLength);
    if (checksum(bytes, meta).some((byte, i) => byte !== bytes[32 + i])) fail('RESOURCE_RECORD_DIGEST');
    if (meta.some(byte => byte < 32 || byte > 126)) fail('RESOURCE_RECORD_FORMAT');
    const text = ascii(meta); let parsed;
    try { parsed = fields(JSON.parse(text), ['schema', 'binding', 'files', 'trust']); } catch { fail('RESOURCE_RECORD_FORMAT'); }
    if (!Array.isArray(parsed.files) || parsed.files.length !== count) fail('RESOURCE_RECORD_BUDGET');
    let at = 48 + metadataLength;
    const files = parsed.files.map(row => {
      let file; try { file = fields(row, ['path', 'length', 'md5']); } catch { fail('RESOURCE_RECORD_FORMAT'); }
      if (!Number.isInteger(file.length) || file.length < 0 || file.length > LAUNCHER_RESOURCE_FORMAT.fileBytes || file.length > bytes.length - at) fail('RESOURCE_RECORD_BUDGET');
      const payload = bytes.subarray(at, at + file.length); at += file.length;
      return { path: file.path, bytes: payload, md5: file.md5 };
    });
    if (at !== bytes.length) fail('RESOURCE_RECORD_BUDGET');
    try { resources = readLauncherResourceSnapshot({ schema: parsed.schema, binding: parsed.binding, files, trust: parsed.trust }); }
    catch { fail('RESOURCE_RECORD_CANDIDATE'); }
    if (metadata(resources) !== text) fail('RESOURCE_RECORD_FORMAT');
    returned = true;
    return Object.freeze({ format: LAUNCHER_RESOURCE_CACHE_FORMAT.id, revision, resources, trust: 'unverified' });
  } finally { bytes.fill(0); if (!returned) release(resources); }
}

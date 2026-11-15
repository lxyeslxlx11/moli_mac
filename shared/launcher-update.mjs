/** Offline fixed-updater ZIP/CRC/MD5 processing. Returns untrusted candidate bytes; no download, file replacement or execution. */
import { Inflate } from './vendor/pako/3.0.2/pako_inflate.esm.min.mjs';
import { md5Hex } from './md5.mjs';

export const LAUNCHER_UPDATE_LIMITS = Object.freeze({ archiveBytes: 32 * 1024 * 1024, outputBytes: 32 * 1024 * 1024,
  entries: 64, nameBytes: 1024, extraBytes: 4096, entryCommentBytes: 4096, inflateChunkBytes: 16384 });
export class LauncherUpdateError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherUpdateError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherUpdateError(code, message); };
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function ownedBytes(value) {
  if (value instanceof ArrayBuffer) {
    try { Reflect.apply(bufferLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual ArrayBuffer.'); }
    value = new Uint8Array(value);
  }
  if (!(value instanceof Uint8Array)) fail('INVALID_INPUT', 'Expected explicit archive bytes.');
  let length;
  try { length = Reflect.apply(typedLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual Uint8Array.'); }
  if (!Number.isInteger(length)) fail('INVALID_INPUT', 'Expected an actual Uint8Array.');
  if (length < 22 || length > LAUNCHER_UPDATE_LIMITS.archiveBytes) fail('ZIP_INPUT_LENGTH', 'Archive length exceeds the supported profile.');
  return new Uint8Array(value);
}
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (let at = 0; at < bytes.length; at += 1) crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[at]) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
const equal = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
function parseArchive(input, allowLeadingDirectory = false) {
  const data = ownedBytes(input), view = new DataView(data.buffer), size = data.length;
  const need = (at, count, end = size) => {
    if (!Number.isSafeInteger(at) || at < 0 || count < 0 || at > end || count > end - at) fail('ZIP_TRUNCATED', 'Archive range is truncated or inconsistent.');
  };
  const u16 = at => { need(at, 2); return view.getUint16(at, true); };
  const u32 = at => { need(at, 4); return view.getUint32(at, true); };
  const extras = (at, length) => {
    if (length > LAUNCHER_UPDATE_LIMITS.extraBytes) fail('ZIP_METADATA_BUDGET', 'Extra fields exceed the fixed budget.');
    need(at, length); const end = at + length;
    while (at < end) {
      need(at, 4, end); const id = u16(at), bytes = u16(at + 2); at += 4; need(at, bytes, end);
      if (id === 1) fail('ZIP_UNSUPPORTED', 'ZIP64 is outside the supported profile.');
      at += bytes;
    }
  };
  const endCandidates = [];
  for (let at = size - 22; at >= Math.max(0, size - 22 - 65535); at -= 1) {
    if (u32(at) === 0x06054b50 && at + 22 + u16(at + 20) === size) endCandidates.push(at);
  }
  if (endCandidates.length !== 1) fail('ZIP_EOCD', 'Expected one complete end record without trailing bytes.');
  const end = endCandidates[0], count = u16(end + 10), directoryBytes = u32(end + 12), directoryRelative = u32(end + 16);
  if (u16(end + 4) || u16(end + 6) || u16(end + 8) !== count || count === 0xffff || directoryBytes === 0xffffffff || directoryRelative === 0xffffffff) {
    fail('ZIP_UNSUPPORTED', 'Multidisk and ZIP64 are outside the supported profile.');
  }
  if (!count || count > LAUNCHER_UPDATE_LIMITS.entries) fail('ZIP_ENTRY_BUDGET', 'Expected1..64 central directory entries.');
  const prefixBytes = end - directoryBytes - directoryRelative, directoryStart = end - directoryBytes;
  if (prefixBytes < 0) fail('ZIP_DIRECTORY', 'Central directory location is inconsistent.');
  need(directoryStart, directoryBytes, end);
  const entries = [], ranges = []; let at = directoryStart, totalOutput = 0;
  for (let ordinal = 0; ordinal < count; ordinal += 1) {
    need(at, 46, end);
    if (u32(at) !== 0x02014b50) fail('ZIP_DIRECTORY', 'Expected a central directory entry.');
    const madeBy = u16(at + 4), version = u16(at + 6), flags = u16(at + 8), method = u16(at + 10), checksum = u32(at + 16);
    const compressedBytes = u32(at + 20), uncompressedBytes = u32(at + 24), nameLength = u16(at + 28), extraLength = u16(at + 30), commentLength = u16(at + 32);
    const localRelative = u32(at + 42), externalAttributes = u32(at + 38);
    if (version > 20 || (flags & ~0x080e) || ![0, 8].includes(method) || (method === 0 && (flags & 6)) || u16(at + 34) ||
        compressedBytes === 0xffffffff || uncompressedBytes === 0xffffffff || localRelative === 0xffffffff) {
      fail('ZIP_UNSUPPORTED', 'Unsupported ZIP method, version, flags or disk profile.');
    }
    if (compressedBytes > LAUNCHER_UPDATE_LIMITS.archiveBytes || uncompressedBytes > LAUNCHER_UPDATE_LIMITS.outputBytes ||
        totalOutput + uncompressedBytes > LAUNCHER_UPDATE_LIMITS.outputBytes) fail('ZIP_OUTPUT_BUDGET', 'Declared output exceeds the fixed budget.');
    totalOutput += uncompressedBytes;
    if (!nameLength || nameLength > LAUNCHER_UPDATE_LIMITS.nameBytes || commentLength > LAUNCHER_UPDATE_LIMITS.entryCommentBytes) fail('ZIP_METADATA_BUDGET', 'Entry metadata exceeds the fixed profile.');
    need(at + 46, nameLength + extraLength + commentLength, end); extras(at + 46 + nameLength, extraLength);
    const nameBytes = data.slice(at + 46, at + 46 + nameLength), local = prefixBytes + localRelative;
    need(local, 30, directoryStart);
    if (u32(local) !== 0x04034b50 || u16(local + 4) !== version || u16(local + 6) !== flags || u16(local + 8) !== method || u16(local + 26) !== nameLength) {
      fail('ZIP_LOCAL_MISMATCH', 'Local and central header identities disagree.');
    }
    const localExtra = u16(local + 28), dataOffset = local + 30 + nameLength + localExtra;
    need(local + 30, nameLength + localExtra, directoryStart); extras(local + 30 + nameLength, localExtra);
    if (!equal(nameBytes, data.subarray(local + 30, local + 30 + nameLength))) fail('ZIP_LOCAL_MISMATCH', 'Local and central entry names disagree.');
    for (const [offset, expected] of [[14, checksum], [18, compressedBytes], [22, uncompressedBytes]]) {
      const actual = u32(local + offset);
      if (actual !== expected && (!(flags & 8) || actual !== 0)) fail('ZIP_LOCAL_MISMATCH', 'Local and central sizes or CRC disagree.');
    }
    need(dataOffset, compressedBytes, directoryStart);
    let localEnd = dataOffset + compressedBytes, descriptorBytes = 0;
    if (flags & 8) {
      need(localEnd, 12, directoryStart);
      const candidates = [];
      if (u32(localEnd) === checksum && u32(localEnd + 4) === compressedBytes && u32(localEnd + 8) === uncompressedBytes) candidates.push(12);
      if (localEnd + 16 <= directoryStart && u32(localEnd) === 0x08074b50 && u32(localEnd + 4) === checksum &&
          u32(localEnd + 8) === compressedBytes && u32(localEnd + 12) === uncompressedBytes) candidates.push(16);
      if (candidates.length !== 1) fail('ZIP_DESCRIPTOR', 'Expected one descriptor matching the central CRC and sizes.');
      descriptorBytes = candidates[0];
      localEnd += descriptorBytes;
    }
    if (method === 0 && compressedBytes !== uncompressedBytes) fail('ZIP_LOCAL_MISMATCH', 'Stored entry sizes must match.');
    const unixType = madeBy >>> 8 === 3 ? externalAttributes >>> 16 & 0xf000 : 0;
    if (unixType && ![0x4000, 0x8000].includes(unixType)) fail('ZIP_ENTRY_TYPE', 'Special filesystem entries are unsupported.');
    const directory = unixType === 0x4000 || Boolean(externalAttributes & 16) || nameBytes[nameBytes.length - 1] === 47;
    ranges.push({ start: local, end: localEnd });
    entries.push(Object.freeze({ ordinal, method, flags, crc32: checksum, compressedBytes, uncompressedBytes, localHeaderOffset: local,
      dataOffset, descriptorBytes, nameBytes, directory }));
    at += 46 + nameLength + extraLength + commentLength;
  }
  if (at !== end) fail('ZIP_DIRECTORY', 'Central directory size or entry count is inconsistent.');
  let expectedStart = prefixBytes;
  for (const range of ranges.sort((a, b) => a.start - b.start)) {
    if (range.start !== expectedStart) fail('ZIP_LAYOUT', 'Local entry ranges overlap or contain unaccounted bytes.');
    expectedStart = range.end;
  }
  if (expectedStart !== directoryStart) fail('ZIP_LAYOUT', 'Local entries must end at the central directory.');
  if (!allowLeadingDirectory && entries[0].directory) fail('ZIP_ENTRY_TYPE', 'The selected first entry must be a regular candidate.');
  return { data, metadata: Object.freeze({ entries: Object.freeze(entries), firstEntryOrdinal: 0, prefixBytes,
    centralDirectoryOffset: directoryStart, centralDirectoryBytes: directoryBytes, endRecordOffset: end,
    commentBytes: size - end - 22, trust: 'unverified' }) };
}

/** Metadata only; entry names stay opaque bytes and are never output filesystem paths. */
export function inspectLauncherUpdateArchive(bytes) { return parseArchive(bytes).metadata; }

/** Decode one already selected entry. CRC equality never authenticates the source. */
function decodeEntry(data, entry) {
  const compressed = data.subarray(entry.dataOffset, entry.dataOffset + entry.compressedBytes), output = new Uint8Array(entry.uncompressedBytes);
  try {
    if (entry.method === 0) output.set(compressed);
    else {
      let written = 0, stream = null;
      const decoder = new Inflate({ raw: true, windowBits: 15, chunkSize: LAUNCHER_UPDATE_LIMITS.inflateChunkBytes });
      decoder.onStart = value => { stream = value; };
      decoder.onData = chunk => {
        if (chunk.length > output.length - written) fail('ZIP_OUTPUT_LENGTH', 'Deflate output exceeds the declared length.');
        output.set(chunk, written); written += chunk.length;
      };
      decoder.onEnd = () => {};
      const success = decoder.push(compressed, true);
      if (!success || !decoder.ended || decoder.err !== 0 || !stream || stream.avail_in !== 0 || stream.total_in !== compressed.length || written !== output.length) {
        fail('ZIP_DEFLATE', 'Expected one complete raw Deflate stream with exact input and output lengths.');
      }
    }
    if (crc32(output) !== entry.crc32) fail('ZIP_CRC_MISMATCH', 'Candidate CRC does not match the archive entry.');
    return output;
  } catch (error) {
    output.fill(0);
    if (error instanceof LauncherUpdateError) throw error;
    fail('ZIP_DEFLATE', 'Candidate decoding failed.');
  }
}

/** Original fixed self-updater: only the first central entry is selected. */
export function decodeLauncherUpdatePackage(bytes, options) {
  if (!options || typeof options !== 'object' || Array.isArray(options) || typeof options.expectedMd5 !== 'string' || !/^[0-9a-fA-F]{32}$/.test(options.expectedMd5)) {
    fail('UPDATE_DIGEST_INPUT', 'Expected an explicit32-character hexadecimal compatibility digest.');
  }
  const expectedMd5 = options.expectedMd5.toLowerCase(), { data, metadata } = parseArchive(bytes), entry = metadata.entries[0];
  const output = decodeEntry(data, entry), actualMd5 = md5Hex(output);
  if (actualMd5 !== expectedMd5) { output.fill(0); fail('UPDATE_DIGEST_MISMATCH', 'Candidate does not match the supplied compatibility digest.'); }
  return Object.freeze({ archive: metadata, entry, payloadBytes: output, actualMd5, digestMatches: true, crcVerified: true,
    trust: 'unverified', replacement: 'not-performed', authentication: 'unverified' });
}

// Selected PE resource lookup only. Input is the decoder's owned output, never a loader or an event handle.
function startupAckDeclaration(data, peOffset) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength), optional = peOffset + 24;
  const format = () => fail('UPDATE_ACK_RESOURCE_FORMAT', 'Selected startup resource is outside the supported PE profile.');
  const budget = () => fail('UPDATE_ACK_RESOURCE_BUDGET', 'Selected startup resource exceeds the metadata budget.');
  const result = (declaration, languageCount = 0) => Object.freeze({ declaration, languageCount,
    validation: 'resource-declaration-only', acknowledgement: 'not-observed' });
  if (view.getUint32(optional + 92, true) < 3) return result('absent');
  const optionalBytes = view.getUint16(peOffset + 20, true);
  if (optionalBytes < 120) format();
  const resourceRva = view.getUint32(optional + 112, true), resourceBytes = view.getUint32(optional + 116, true);
  if (!resourceRva && !resourceBytes) return result('absent');
  if (!resourceRva || resourceBytes < 16) format();
  const sectionCount = view.getUint16(peOffset + 6, true), sectionStart = optional + optionalBytes;
  if (sectionCount > 64) budget();
  if (!sectionCount || sectionStart > data.length || sectionCount * 40 > data.length - sectionStart) format();
  const sections = [];
  for (let index = 0; index < sectionCount; index++) {
    const at = sectionStart + index * 40, virtualBytes = view.getUint32(at + 8, true);
    const rva = view.getUint32(at + 12, true), rawBytes = view.getUint32(at + 16, true), raw = view.getUint32(at + 20, true);
    const span = Math.min(rawBytes, virtualBytes || rawBytes);
    if (raw > data.length || rawBytes > data.length - raw || rva + span > 0x100000000) format();
    sections.push({ rva, raw, span });
  }
  function map(rva, length) {
    if (rva + length > 0x100000000) format();
    const matches = sections.filter(section => rva >= section.rva && rva - section.rva <= section.span
      && length <= section.span - (rva - section.rva));
    if (matches.length !== 1) format();
    return matches[0].raw + rva - matches[0].rva;
  }
  const resourceStart = map(resourceRva, resourceBytes), visited = new Set();
  let entriesSeen = 0;
  function range(relative, length) {
    if (relative > resourceBytes || length > resourceBytes - relative) format();
    return resourceStart + relative;
  }
  function directory(relative) {
    if (visited.has(relative)) format();
    visited.add(relative);
    const at = range(relative, 16), count = view.getUint16(at + 12, true) + view.getUint16(at + 14, true);
    entriesSeen += count;
    if (entriesSeen > 2048) budget();
    range(relative + 16, count * 8);
    return Array.from({ length: count }, (_, index) => ({ name: view.getUint32(at + 16 + index * 8, true),
      target: view.getUint32(at + 20 + index * 8, true) }));
  }
  const type = directory(0).filter(entry => entry.name === 10);
  if (!type.length) return result('absent');
  if (type.length !== 1 || !(type[0].target & 0x80000000)) format();
  const expectedName = 'POLCN_LAUNCHER_ACK_PROTOCOL';
  let selected = null;
  for (const entry of directory(type[0].target & 0x7fffffff)) {
    if (!(entry.name & 0x80000000)) continue;
    const relative = entry.name & 0x7fffffff, at = range(relative, 2), length = view.getUint16(at, true);
    if (length > 256) budget();
    range(relative + 2, length * 2);
    let name = '';
    for (let index = 0; index < length; index++) name += String.fromCharCode(view.getUint16(at + 2 + index * 2, true));
    if (name !== expectedName && name.toUpperCase() === expectedName) format();
    if (name !== expectedName) continue;
    if (selected) format();
    selected = entry;
  }
  if (!selected) return result('absent');
  if (!(selected.target & 0x80000000)) format();
  const languages = directory(selected.target & 0x7fffffff), seenLanguages = new Set(), marker = 'POLCN_LAUNCHER_ACK_V1';
  if (!languages.length) format();
  for (const entry of languages) {
    if (entry.name > 0xffff || seenLanguages.has(entry.name) || (entry.target & 0x80000000)) format();
    seenLanguages.add(entry.name);
    const at = range(entry.target, 16), rva = view.getUint32(at, true), length = view.getUint32(at + 4, true);
    if (length !== 21 && length !== 22) fail('UPDATE_ACK_RESOURCE', 'Startup acknowledgement declaration is malformed.');
    const start = map(rva, length);
    if ((length === 22 && data[start + 21] !== 0) ||
        Array.from(marker).some((value, index) => data[start + index] !== value.charCodeAt(0))) {
      fail('UPDATE_ACK_RESOURCE', 'Startup acknowledgement declaration is malformed.');
    }
  }
  return result('v1', languages.length);
}

/** Current updater's single-EXE header profile, within the shared core's32MiB/ASCII limits. No loader or signature validation. */
export function decodeWin32LauncherUpdatePackage(bytes, options) {
  let fields;
  if (!options || typeof options !== 'object' || Array.isArray(options)) fail('UPDATE_PROFILE_INPUT', 'Expected explicit candidate options.');
  try { fields = Object.getOwnPropertyDescriptors(options); } catch { fail('UPDATE_PROFILE_INPUT', 'Expected candidate data properties.'); }
  const digest = fields.expectedMd5, size = fields.expectedArchiveBytes;
  if (Reflect.ownKeys(fields).length !== 2 || !digest || !size || !Object.hasOwn(digest, 'value') || !Object.hasOwn(size, 'value') ||
      typeof digest.value !== 'string' || !/^[0-9a-fA-F]{32}$/.test(digest.value) || !Number.isInteger(size.value) ||
      size.value < 1 || size.value > LAUNCHER_UPDATE_LIMITS.archiveBytes) {
    fail('UPDATE_PROFILE_INPUT', 'Expected an own digest and bounded archive byte count.');
  }
  const expectedMd5 = digest.value.toLowerCase(), expectedArchiveBytes = size.value, { data, metadata } = parseArchive(bytes);
  if (data.length !== expectedArchiveBytes) fail('UPDATE_ARCHIVE_SIZE', 'Archive does not match the declared byte count.');
  if (metadata.entries.length !== 1) fail('UPDATE_ENTRY_COUNT', 'Expected exactly one launcher entry.');
  const entry = metadata.entries[0], name = entry.nameBytes;
  if (name.length < 4 || !name.every(value => value >= 32 && value <= 126 && ![47, 92, 58].includes(value)) ||
      String.fromCharCode(...name.subarray(name.length - 4)).toLowerCase() !== '.exe') {
    fail('UPDATE_ENTRY_NAME', 'Expected a printable ASCII EXE entry without a path.');
  }
  if (!entry.uncompressedBytes || (entry.compressedBytes > 0 && entry.uncompressedBytes > entry.compressedBytes * 200 + 1048576)) {
    fail('UPDATE_EXPANSION_BUDGET', 'Candidate output exceeds the supported expansion profile.');
  }
  const output = decodeEntry(data, entry);
  try {
    const actualMd5 = md5Hex(output);
    if (actualMd5 !== expectedMd5) fail('UPDATE_DIGEST_MISMATCH', 'Candidate does not match the supplied compatibility digest.');
    if (output.length < 64) fail('UPDATE_EXECUTABLE_HEADER', 'Candidate does not match the Win32 GUI header profile.');
    const view = new DataView(output.buffer), peOffset = view.getUint32(60, true);
    if (view.getUint16(0, true) !== 0x5a4d || peOffset < 64 || peOffset > 1048575 || peOffset + 248 > output.length ||
        view.getUint32(peOffset, true) !== 0x4550 || view.getUint16(peOffset + 4, true) !== 0x14c ||
        view.getUint16(peOffset + 24, true) !== 0x10b || view.getUint16(peOffset + 92, true) !== 2) {
      fail('UPDATE_EXECUTABLE_HEADER', 'Candidate does not match the Win32 GUI header profile.');
    }
    const startupAcknowledgement = startupAckDeclaration(output, peOffset);
    return Object.freeze({ archive: metadata, entry, payloadBytes: output, actualMd5, digestMatches: true, crcVerified: true,
      expectedArchiveBytes, archiveSizeMatches: true, profile: 'win32-gui-single-exe-v1',
      executable: Object.freeze({ peOffset, machine: 0x14c, optionalHeaderMagic: 0x10b, subsystem: 2, headerBytes: 248, validation: 'header-profile-only' }),
      startupAcknowledgement,
      trust: 'unverified', replacement: 'not-performed', authentication: 'unverified' });
  } catch (error) { output.fill(0); throw error; }
}

/** Fixed game patcher ZIP consumer: every central entry is decoded. Names are still opaque, never filesystem paths. */
export function decodeGamePatchArchive(bytes) {
  const { data, metadata } = parseArchive(bytes, true), entries = [];
  try {
    for (const entry of metadata.entries) {
      const payloadBytes = decodeEntry(data, entry);
      entries.push(Object.freeze({ entry, payloadBytes }));
      if (entry.directory && payloadBytes.length) fail('ZIP_ENTRY_TYPE', 'Directory entries must have no payload.');
    }
    return Object.freeze({ archive: metadata, entries: Object.freeze(entries), crcVerified: true,
      trust: 'unverified', replacement: 'not-performed', authentication: 'unverified' });
  } catch (error) {
    for (const entry of entries) entry.payloadBytes.fill(0);
    throw error;
  }
}

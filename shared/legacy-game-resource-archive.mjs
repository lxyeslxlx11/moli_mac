/** Read-only random-access game resources; independent of launcher/update ZIP policy. */
import { Inflate } from './vendor/pako/3.0.2/pako_inflate.esm.min.mjs';
import { assetFail, assetFields, assetPath, assetKey } from './legacy-game-resource-values.mjs';

export const LEGACY_GAME_RESOURCE_ARCHIVE_PROFILE = Object.freeze({
  id: 'legacy-game-selected-resource-archive-v1', entries: 65536,
  directoryBytes: 32 * 1024 * 1024, readBytes: 32 * 1024 * 1024,
  inflateCacheBytes: 32 * 1024 * 1024, chunkBytes: 65536,
  methods: Object.freeze([0, 8]), zip64: true,
});
const L = LEGACY_GAME_RESOURCE_ARCHIVE_PROFILE;
const fail = suffix => assetFail('LEGACY_ASSET_ARCHIVE_' + suffix);
const integer = n => Number.isSafeInteger(n) && n >= 0;
const view = b => new DataView(b.buffer, b.byteOffset, b.byteLength);
const u64 = (v, at) => {
  const n = v.getUint32(at, true) + v.getUint32(at + 4, true) * 4294967296;
  if (!integer(n)) fail('INTEGER'); return n;
};
const crcTable = Uint32Array.from({ length: 256 }, (_, i) => {
  let c = i; for (let n = 0; n < 8; n++) c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
  return c >>> 0;
});
function crcUpdate(crc, bytes) {
  for (const b of bytes) crc = crcTable[(crc ^ b) & 255] ^ crc >>> 8;
  return crc >>> 0;
}
function decodeName(bytes, utf8) {
  let out = '';
  for (let at = 0; at < bytes.length;) {
    const first = bytes[at++]; let cp = first, count = 0, minimum = 0;
    if (first >= 128) {
      if (!utf8) fail('NAME');
      if (first >= 0xc2 && first <= 0xdf) { cp &= 31; count = 1; minimum = 128; }
      else if (first >= 0xe0 && first <= 0xef) { cp &= 15; count = 2; minimum = 2048; }
      else if (first >= 0xf0 && first <= 0xf4) { cp &= 7; count = 3; minimum = 65536; }
      else fail('NAME');
      for (let i = 0; i < count; i++) {
        const b = bytes[at++]; if (b === undefined || (b & 0xc0) !== 0x80) fail('NAME'); cp = cp * 64 + (b & 63);
      }
      if (cp < minimum || cp > 0x10ffff || cp >= 0xd800 && cp <= 0xdfff) fail('NAME');
    }
    out += String.fromCodePoint(cp);
  }
  out = out.replace(/\\/g, '/');
  if (!out || out.length > 1024 || /[\x00-\x1f\x7f:*?"<>|]/.test(out) ||
      out.replace(/\/$/, '').split('/').some(p => !p || p === '.' || p === '..' || /[. ]$/.test(p))) fail('NAME');
  return out;
}
function extra64(bytes, needs) {
  const v = view(bytes); let at = 0, block = null;
  while (at < bytes.length) {
    if (at + 4 > bytes.length) fail('EXTRA');
    const id = v.getUint16(at, true), size = v.getUint16(at + 2, true); at += 4;
    if (size > bytes.length - at) fail('EXTRA');
    if (id === 1) { if (block) fail('EXTRA'); block = bytes.subarray(at, at + size); }
    at += size;
  }
  if (!needs.length) return Object.assign([], { present: !!block });
  if (!block) fail('ZIP64');
  const data = view(block), result = []; at = 0;
  for (const size of needs) {
    if (at + size > block.length) fail('ZIP64');
    result.push(size === 8 ? u64(data, at) : data.getUint32(at, true)); at += size;
  }
  return Object.assign(result, { present: true });
}

/** Takes ownership of the selected range-file port,including initialization failure. */
export async function createLegacyGameResourceArchive(value, options) {
  const source = assetFields(value, ['size', 'read', 'close']);
  const settings = options === undefined ? {} : assetFields(options, [], ['rootPrefix']);
  let closed = false, rows = [], files = new Map(), cache = new Map(), cached = 0, inflateTail = Promise.resolve();
  let rootPrefix = '', zip64 = false, directoryBytes = 0, physicalReads = 0, physicalBytes = 0;
  const active = () => { if (closed) fail('CLOSED'); };
  function close() {
    if (closed) return; closed = true;
    for (const b of cache.values()) b.fill(0); cache.clear(); cached = 0;
    for (const row of rows) row.nameBytes.fill(0); rows = []; files.clear();
    if (typeof source.close === 'function') source.close();
  }
  async function read(at, length) {
    active(); if (!integer(at) || !integer(length) || length > L.readBytes || at > source.size || length > source.size - at) fail('RANGE');
    const bytes = await source.read(at, length);
    if (!(bytes instanceof Uint8Array)) fail('READ');
    if (closed || bytes.length !== length) { bytes.fill(0); active(); fail('SHORT_READ'); }
    physicalReads++; physicalBytes += length; return bytes;
  }
  try {
    if (!integer(source.size) || source.size < 22 || typeof source.read !== 'function' || typeof source.close !== 'function') fail('INPUT');
    const tailStart = Math.max(0, source.size - (65535 + 22 + 20 + 56));
    const tail = await read(tailStart, source.size - tailStart);
    let count, centralOffset, prefix = 0, centralEnd;
    try {
      const v = view(tail), ends = [];
      for (let at = tail.length - 22; at >= 0; at--) if (v.getUint32(at, true) === 0x06054b50 && at + 22 + v.getUint16(at + 20, true) === tail.length) ends.push(at);
      if (ends.length !== 1) fail('END'); const end = ends[0], absoluteEnd = tailStart + end;
      if (v.getUint16(end + 4, true) || v.getUint16(end + 6, true) || v.getUint16(end + 8, true) !== v.getUint16(end + 10, true)) fail('DISK');
      count = v.getUint16(end + 10, true); directoryBytes = v.getUint32(end + 12, true); centralOffset = v.getUint32(end + 16, true); centralEnd = absoluteEnd;
      if (end >= 20 && v.getUint32(end - 20, true) === 0x07064b50) {
        zip64 = true;
        if (v.getUint32(end - 16, true) || v.getUint32(end - 4, true) !== 1) fail('DISK');
        const relative = u64(v, end - 12); let actual = relative, z;
        if (relative <= source.size - 56) z = await read(relative, 56);
        const valid = b => b && view(b).getUint32(0, true) === 0x06064b50 && u64(view(b), 4) >= 44 && actual + 12 + u64(view(b), 4) === absoluteEnd - 20;
        if (!valid(z)) {
          z?.fill(0); z = null;
          for (let at = end - 20 - 56; at >= 0; at--) if (v.getUint32(at, true) === 0x06064b50 && u64(v, at + 4) >= 44 && tailStart + at + 12 + u64(v, at + 4) === absoluteEnd - 20) {
            if (z) fail('ZIP64'); actual = tailStart + at; z = tail.slice(at, at + 56);
          }
          if (!z) fail('ZIP64');
        }
        try {
          const zv = view(z); prefix = actual - relative;
          if (prefix < 0 || zv.getUint16(14, true) > 45 || zv.getUint32(16, true) || zv.getUint32(20, true) || u64(zv, 24) !== u64(zv, 32)) fail('ZIP64');
          const n = u64(zv, 32), size = u64(zv, 40), offset = u64(zv, 48);
          if (count !== 0xffff && count !== n || directoryBytes !== 0xffffffff && directoryBytes !== size || centralOffset !== 0xffffffff && centralOffset !== offset) fail('ZIP64');
          count = n; directoryBytes = size; centralOffset = prefix + offset; centralEnd = actual;
        } finally { z.fill(0); }
      } else {
        if (count === 0xffff || directoryBytes === 0xffffffff || centralOffset === 0xffffffff) fail('ZIP64');
        prefix = absoluteEnd - directoryBytes - centralOffset; centralOffset += prefix;
      }
      if (prefix < 0 || !count || count > L.entries || directoryBytes > L.directoryBytes || centralOffset + directoryBytes !== centralEnd) fail('DIRECTORY');
    } finally { tail.fill(0); }
    const directory = await read(centralOffset, directoryBytes);
    try {
      const v = view(directory); let at = 0;
      for (let ordinal = 0; ordinal < count; ordinal++) {
        if (at + 46 > directory.length || v.getUint32(at, true) !== 0x02014b50) fail('DIRECTORY');
        const made = v.getUint16(at + 4, true), version = v.getUint16(at + 6, true), flags = v.getUint16(at + 8, true), method = v.getUint16(at + 10, true);
        const nameLength = v.getUint16(at + 28, true), extraLength = v.getUint16(at + 30, true), commentLength = v.getUint16(at + 32, true), disk = v.getUint16(at + 34, true), attributes = v.getUint32(at + 38, true);
        if (version > 45 || flags & ~0x080e || ![0, 8].includes(method) || method === 0 && flags & 6 || !nameLength || nameLength > 1024 || at + 46 + nameLength + extraLength + commentLength > directory.length) fail('ENTRY');
        const nameBytes = directory.slice(at + 46, at + 46 + nameLength), name = decodeName(nameBytes, !!(flags & 0x800));
        let size = v.getUint32(at + 24, true), compressed = v.getUint32(at + 20, true), offset = v.getUint32(at + 42, true);
        const needs = []; for (const n of [size, compressed, offset]) if (n === 0xffffffff) needs.push(8); if (disk === 0xffff) needs.push(4);
        const words = extra64(directory.subarray(at + 46 + nameLength, at + 46 + nameLength + extraLength), needs); let wi = 0;
        if (size === 0xffffffff) size = words[wi++]; if (compressed === 0xffffffff) compressed = words[wi++]; if (offset === 0xffffffff) offset = words[wi++];
        if ((disk === 0xffff ? words[wi++] : disk) !== 0) fail('DISK');
        const type = made >>> 8 === 3 ? attributes >>> 16 & 0xf000 : 0;
        if (type && ![0x4000, 0x8000].includes(type)) fail('TYPE');
        const isDirectory = name.endsWith('/') || type === 0x4000 || !!(attributes & 16);
        if (isDirectory && size !== 0 || method === 0 && size !== compressed) fail('ENTRY');
        offset += prefix;
        if (!integer(offset) || offset < prefix || offset + 30 + nameLength + compressed > centralOffset) fail('RANGE');
        rows.push({ name, nameBytes, size, compressed, offset, version, flags, method, crc: v.getUint32(at + 16, true), directory: isDirectory, header: null });
        at += 46 + nameLength + extraLength + commentLength;
      }
      if (at !== directory.length) fail('DIRECTORY');
    } finally { directory.fill(0); }
    const ordered = [...rows].sort((a, b) => a.offset - b.offset);
    for (let i = 0; i < ordered.length; i++) {
      const row = ordered[i]; row.limit = ordered[i + 1]?.offset ?? centralOffset;
      if (row.offset + 30 + row.nameBytes.length + row.compressed > row.limit) fail('OVERLAP');
    }
    if (settings.rootPrefix !== undefined) {
      if (typeof settings.rootPrefix !== 'string') fail('ROOT');
      rootPrefix = settings.rootPrefix.replace(/\\/g, '/').replace(/\/$/, '');
      if (rootPrefix.length > 1024 || /[\x00-\x1f\x7f:*?"<>|]/.test(rootPrefix) ||
          rootPrefix && rootPrefix.split('/').some(p => !p || p === '.' || p === '..' || /[. ]$/.test(p))) fail('ROOT');
    } else {
      // Resolve the installation root through its source-defined module name,
      // rather than stripping an arbitrary common directory such as Bin.
      const candidates = new Map();
      for (const row of rows) if (!row.directory && row.name.split('/').at(-1).toLowerCase() === 'cg_se_6000.exe') {
        const root = row.name.slice(0, -'cg_se_6000.exe'.length).replace(/\/$/, ''); candidates.set(root.toLowerCase(), root);
      }
      if (candidates.size > 1) fail('ROOT'); rootPrefix = candidates.values().next().value ?? '';
    }
    const directories = new Set();
    for (const row of rows) {
      let name = row.name.replace(/\/$/, '');
      if (rootPrefix) {
        if (name.toLowerCase() === rootPrefix.toLowerCase() && row.directory) continue;
        if (!name.toLowerCase().startsWith(rootPrefix.toLowerCase() + '/')) continue;
        name = name.slice(rootPrefix.length + 1);
      }
      const path = assetPath(name), key = assetKey(path); row.path = path;
      if (files.has(key) || directories.has(key)) fail('ALIAS');
      if (row.directory) directories.add(key); else files.set(key, row);
    }
    if (!files.size) fail('EMPTY');
    for (const key of [...files.keys(), ...directories]) {
      let at = key.lastIndexOf('/'); while (at >= 0) { if (files.has(key.slice(0, at))) fail('ALIAS'); at = key.lastIndexOf('/', at - 1); }
    }

    async function header(row) {
      if (!row.header) row.header = (async () => {
        const h = await read(row.offset, 30); let metadata;
        try {
          const v = view(h);
          if (v.getUint32(0, true) !== 0x04034b50 || v.getUint16(4, true) > 45 || v.getUint16(6, true) !== row.flags || v.getUint16(8, true) !== row.method || v.getUint16(26, true) !== row.nameBytes.length) fail('LOCAL');
          const extraLength = v.getUint16(28, true), start = row.offset + 30 + row.nameBytes.length + extraLength;
          if (start + row.compressed > row.limit) fail('OVERLAP');
          metadata = await read(row.offset + 30, row.nameBytes.length + extraLength);
          if (!row.nameBytes.every((b, i) => metadata[i] === b)) fail('LOCAL');
          let size = v.getUint32(22, true), compressed = v.getUint32(18, true);
          const sentinel64 = size === 0xffffffff || compressed === 0xffffffff;
          const extra = metadata.subarray(row.nameBytes.length);
          let words = extra64(extra, sentinel64 ? [8, 8] : []);
          if (words.present && !sentinel64) words = extra64(extra, [8, 8]);
          const local64 = words.present;
          if (local64) { size = words[0]; compressed = words[1]; }
          const equals = (actual, expected) => actual === expected || !!(row.flags & 8) && actual === 0;
          if (!equals(v.getUint32(14, true), row.crc) || !equals(size, row.size) || !equals(compressed, row.compressed)) fail('LOCAL');
          if (row.flags & 8) {
            const wide = local64 || row.size > 0xffffffff || row.compressed > 0xffffffff;
            const sizeBytes = wide ? 8 : 4, min = 4 + 2 * sizeBytes, at = start + row.compressed;
            if (at + min > row.limit) fail('DESCRIPTOR');
            const bytes = await read(at, Math.min(min + 4, row.limit - at));
            try {
              const d = view(bytes), candidates = [];
              for (const skip of [0, 4]) {
                if (skip && d.getUint32(0, true) !== 0x08074b50 || skip + min > bytes.length) continue;
                const c = d.getUint32(skip, true), a = wide ? u64(d, skip + 4) : d.getUint32(skip + 4, true), b = wide ? u64(d, skip + 12) : d.getUint32(skip + 8, true);
                if (c === row.crc && a === row.compressed && b === row.size) candidates.push(skip + min);
              }
              if (candidates.length !== 1) fail('DESCRIPTOR');
            } finally { bytes.fill(0); }
          }
          active(); return start;
        } finally { h.fill(0); metadata?.fill(0); }
      })();
      return row.header;
    }

    function remember(row, bytes) {
      while (cached + bytes.length > L.inflateCacheBytes) {
        const [old, data] = cache.entries().next().value; cache.delete(old); cached -= data.length; data.fill(0);
      }
      cache.set(row, bytes); cached += bytes.length;
    }
    async function inflated(row, offset, length, start) {
      const previous = cache.get(row);
      if (previous) { cache.delete(row); cache.set(row, previous); return previous.slice(offset, offset + length); }
      const output = new Uint8Array(length), whole = row.size <= L.inflateCacheBytes ? new Uint8Array(row.size) : null;
      let written = 0, crc = 0xffffffff, stream = null, retained = false;
      const decoder = new Inflate({ raw: true, windowBits: 15, chunkSize: L.chunkBytes });
      decoder.onStart = value => { stream = value; };
      decoder.onData = chunk => {
        if (chunk.length > row.size - written) fail('DEFLATE_LENGTH');
        crc = crcUpdate(crc, chunk); whole?.set(chunk, written);
        const from = Math.max(offset, written), to = Math.min(offset + length, written + chunk.length);
        if (to > from) output.set(chunk.subarray(from - written, to - written), from - offset);
        written += chunk.length;
      };
      decoder.onEnd = () => {};
      try {
        let consumed = 0;
        while (consumed < row.compressed) {
          const bytes = await read(start + consumed, Math.min(L.chunkBytes, row.compressed - consumed));
          try {
            consumed += bytes.length;
            const ok = decoder.push(bytes, consumed === row.compressed);
            if (!ok || decoder.err || decoder.ended && consumed !== row.compressed) fail('DEFLATE');
          } finally { bytes.fill(0); }
        }
        if (!decoder.ended || !stream || stream.avail_in !== 0 || stream.total_in !== row.compressed || written !== row.size || (crc ^ 0xffffffff) >>> 0 !== row.crc) fail('CRC');
        active(); if (whole) { remember(row, whole); retained = true; } return output;
      } catch (error) { output.fill(0); throw error; }
      finally { if (!retained) whole?.fill(0); }
    }

    return Object.freeze({ count: files.size,
      port: Object.freeze({
        async stat(path) { active(); return files.get(assetKey(path))?.size ?? null; },
        async read(path, offset, length) {
          active(); const row = files.get(assetKey(path));
          if (!row || !integer(offset) || !integer(length) || length > L.readBytes || offset > row.size || length > row.size - offset) fail('FILE_RANGE');
          const start = await header(row); active();
          if (row.method === 0) {
            const output = await read(start + offset, length);
            if (offset === 0 && length === row.size && (crcUpdate(0xffffffff, output) ^ 0xffffffff) >>> 0 !== row.crc) { output.fill(0); fail('CRC'); }
            return output;
          }
          const run = () => { active(); return inflated(row, offset, length, start); };
          const job = inflateTail.then(run); inflateTail = job.then(() => {}, () => {}); return job;
        },
      }),
      inspect() { return Object.freeze({ state: closed ? 'closed' : 'open', files: files.size, archiveBytes: source.size,
        directoryBytes, zip64, rootPrefix, physicalReads, physicalBytes, cachedBytes: cached, access: 'selected-archive-read-only-ranges' }); },
      close,
    });
  } catch (error) { close(); throw error; }
}

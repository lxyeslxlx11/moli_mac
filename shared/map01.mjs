/** Observed MAP01 layout only. The body and header words have no assigned game semantics. */
export const MAP01_LIMITS = Object.freeze({ headerBytes: 20, bytes: 32 * 1024 * 1024, cells: 4 * 1024 * 1024 });
export class Map01Error extends Error {
  constructor(code, message) { super(message); this.name = 'Map01Error'; this.code = code; }
}
function fail(code, message) { throw new Map01Error(code, message); }
function copy(value, start, length) {
  return new Uint8Array(new Uint8Array(value.buffer, value.byteOffset + start, length));
}
export function parseMAP01(input) {
  const bytes = input instanceof Uint8Array ? input
    : input instanceof ArrayBuffer ? new Uint8Array(input) : null;
  if (!bytes) fail('INVALID_INPUT', 'Expected Uint8Array or ArrayBuffer.');
  if (bytes.byteLength > MAP01_LIMITS.bytes) fail('MAP_BUDGET', 'Map exceeds the 32 MiB budget.');
  if (bytes.byteLength < MAP01_LIMITS.headerBytes) fail('MAP_TRUNCATED', 'MAP01 needs a 20-byte header.');
  if (bytes[0] !== 0x4d || bytes[1] !== 0x41 || bytes[2] !== 0x50) fail('MAP_MAGIC', 'Missing MAP magic.');
  if (bytes[3] !== 1) fail('UNSUPPORTED_MAP_VERSION', 'Only observed MAP version 01 is supported.');
  const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = data.getUint32(12, true);
  const height = data.getUint32(16, true);
  if (width === 0 || height === 0) fail('ZERO_DIMENSION', 'Candidate dimensions must be positive.');
  // Divide first: UInt32*UInt32 can exceed the exact integer range of Number.
  if (width > MAP01_LIMITS.cells || height > Math.floor(MAP01_LIMITS.cells / width)) {
    fail('MAP_CELL_BUDGET', 'Candidate dimensions exceed the fixed cell budget.');
  }
  const cellCount = width * height;
  const expectedBytes = MAP01_LIMITS.headerBytes + 6 * cellCount;
  if (bytes.byteLength !== expectedBytes) fail('MAP_LENGTH', 'Map has truncated or trailing body bytes for the observed layout.');
  return Object.freeze({ version: 1, width, height, cellCount, byteLength: expectedBytes,
    opaque: Object.freeze({ headerBytes4to11: copy(bytes, 4, 8), bodyBytes: copy(bytes, 20, 6 * cellCount) }) });
}

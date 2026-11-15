/** Bounded raw catalog ownership, digest and explicit text/structure validation. No I/O. */
import { computeLauncherFileMd5 } from './launcher-manifest.mjs';
import { parseGameCatalog, parseRegionCatalog } from './launcher.mjs';
export const CATALOG_CANDIDATE_BYTES = 1024 * 1024;
export class LauncherCatalogError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherCatalogError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherCatalogError(code, message); };
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
export function ownLauncherInputBytes(value, maximum, { allowEmpty = false } = {}) {
  if (value instanceof ArrayBuffer) {
    try { Reflect.apply(bufferLength, value, []); value = new Uint8Array(value); } catch { fail('CATALOG_INPUT', 'Expected actual bytes.'); }
  }
  let length;
  try { length = Reflect.apply(typedLength, value, []); } catch { fail('CATALOG_INPUT', 'Expected actual byte input.'); }
  if (!(value instanceof Uint8Array) || !Number.isInteger(length)) fail('CATALOG_INPUT', 'Expected Uint8Array input.');
  if (length > maximum || (!allowEmpty && length === 0)) fail('CATALOG_BUDGET', 'Input is empty or exceeds its byte budget.');
  return new Uint8Array(value);
}

export function snapshotLauncherCatalogCandidate(value, { decodeText } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('CATALOG_INPUT', 'Expected a catalog pair.');
  const encoding = value.encoding, allowBareAmpersands = value.allowBareAmpersands;
  if (!['utf-8', 'gb18030'].includes(encoding) || typeof allowBareAmpersands !== 'boolean') fail('CATALOG_INPUT', 'Choose explicit encoding and XML compatibility mode.');
  const gameListBytes = ownLauncherInputBytes(value.gameListBytes, CATALOG_CANDIDATE_BYTES);
  const regionListBytes = ownLauncherInputBytes(value.regionListBytes, CATALOG_CANDIDATE_BYTES);
  const gameListMd5 = value.gameListMd5, regionListMd5 = value.regionListMd5;
  for (const md5 of [gameListMd5, regionListMd5]) if (typeof md5 !== 'string' || !/^[0-9a-f]{32}$/.test(md5)) fail('CATALOG_DIGEST', 'Expected a canonical explicit file digest.');
  if (computeLauncherFileMd5(gameListBytes) !== gameListMd5 || computeLauncherFileMd5(regionListBytes) !== regionListMd5) fail('CATALOG_DIGEST', 'Candidate file digest does not match.');
  let games, regions;
  try {
    if (typeof decodeText !== 'function') throw new TypeError();
    const gameText = decodeText(gameListBytes, encoding), regionText = decodeText(regionListBytes, encoding);
    if (typeof gameText !== 'string' || typeof regionText !== 'string'
        || gameText.length > CATALOG_CANDIDATE_BYTES || regionText.length > CATALOG_CANDIDATE_BYTES) throw new TypeError();
    games = parseGameCatalog(gameText, { allowBareAmpersands });
    regions = parseRegionCatalog(regionText, { allowBareAmpersands });
  } catch { fail('CATALOG_PARSE', 'Candidate text or XML structure is invalid.'); }
  return Object.freeze({ gameListBytes, regionListBytes, gameListMd5, regionListMd5, encoding, allowBareAmpersands,
    games, regions, trust: 'unverified' });
}

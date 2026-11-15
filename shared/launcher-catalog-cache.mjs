/** Original local cache container, not an official wire/file format. Checks corruption, never authenticity. */
import { snapshotLauncherCatalogCandidate, ownLauncherInputBytes, CATALOG_CANDIDATE_BYTES } from './launcher-catalog-data.mjs';
import { decodeLauncherCatalogText } from './launcher-catalog-text.mjs';
import { computeLauncherFileMd5 } from './launcher-manifest.mjs';
export const LAUNCHER_CATALOG_CACHE_FORMAT = Object.freeze({ id: 'moli.launcher.catalog-cache.v1', headerBytes: 44,
  recordBytes: CATALOG_CANDIDATE_BYTES * 2 + 44, maximumRevision: Number.MAX_SAFE_INTEGER - 1 });
export class LauncherCatalogCacheError extends Error {
  constructor(code) { super('Local catalog record failed validation.'); this.name = 'LauncherCatalogCacheError'; this.code = code; }
}
const fail = code => { throw new LauncherCatalogCacheError(code); };
const magic = Object.freeze([77,79,76,73,67,65,84,49]);
const decodeText = (bytes, encoding) => decodeLauncherCatalogText(bytes, { encoding });
export const snapshotPortableLauncherCatalogs = value => snapshotLauncherCatalogCandidate(value, { decodeText });
const revisionValid = value => Number.isSafeInteger(value) && value >= 1 && value <= LAUNCHER_CATALOG_CACHE_FORMAT.maximumRevision;
function checksum(bytes) {
  const input = new Uint8Array(bytes.length - 16); input.set(bytes.subarray(0,28)); input.set(bytes.subarray(44),28);
  const hex = computeLauncherFileMd5(input); input.fill(0);
  return Uint8Array.from({ length:16 }, (_, i) => Number.parseInt(hex.slice(i*2,i*2+2),16));
}
function own(value, name) {
  const field = value && Object.getOwnPropertyDescriptor(value,name);
  if (!field || !Object.hasOwn(field,'value')) fail('CATALOG_CACHE_INPUT'); return field.value;
}
export function encodeLauncherCatalogCacheRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Reflect.ownKeys(value).length !== 2
      || Reflect.ownKeys(value).some(key => !['revision','catalogs'].includes(key))) fail('CATALOG_CACHE_INPUT');
  const revision = own(value,'revision'); if (!revisionValid(revision)) fail('CATALOG_CACHE_REVISION');
  let catalogs;
  try { catalogs = snapshotPortableLauncherCatalogs(own(value,'catalogs')); } catch { fail('CATALOG_CACHE_CANDIDATE'); }
  try {
    const bytes = new Uint8Array(44 + catalogs.gameListBytes.length + catalogs.regionListBytes.length), view = new DataView(bytes.buffer);
    bytes.set(magic); view.setUint32(8,revision % 0x100000000,true); view.setUint32(12,Math.floor(revision/0x100000000),true);
    bytes[16] = catalogs.encoding === 'utf-8' ? 0 : 1; bytes[17] = Number(catalogs.allowBareAmpersands);
    view.setUint32(20,catalogs.gameListBytes.length,true); view.setUint32(24,catalogs.regionListBytes.length,true);
    bytes.set(catalogs.gameListBytes,44); bytes.set(catalogs.regionListBytes,44+catalogs.gameListBytes.length); bytes.set(checksum(bytes),28); return bytes;
  } finally { catalogs.gameListBytes.fill(0); catalogs.regionListBytes.fill(0); }
}
export function decodeLauncherCatalogCacheRecord(value) {
  let bytes;
  try { bytes = ownLauncherInputBytes(value,LAUNCHER_CATALOG_CACHE_FORMAT.recordBytes); } catch { fail('CATALOG_CACHE_BUDGET'); }
  try {
    if (bytes.length < 46 || magic.some((byte,i) => bytes[i] !== byte) || bytes[16] > 1 || bytes[17] > 1 || bytes[18] || bytes[19]) fail('CATALOG_CACHE_HEADER');
    const view = new DataView(bytes.buffer), revision = view.getUint32(8,true) + view.getUint32(12,true) * 0x100000000,
      gameLength = view.getUint32(20,true), regionLength = view.getUint32(24,true);
    if (!revisionValid(revision)) fail('CATALOG_CACHE_REVISION');
    if (!gameLength || !regionLength || gameLength > CATALOG_CANDIDATE_BYTES || regionLength > CATALOG_CANDIDATE_BYTES
        || bytes.length !== 44 + gameLength + regionLength) fail('CATALOG_CACHE_BUDGET');
    const digest = checksum(bytes); if (digest.some((byte,i) => byte !== bytes[28+i])) fail('CATALOG_CACHE_DIGEST');
    const gameListBytes = bytes.subarray(44,44+gameLength), regionListBytes = bytes.subarray(44+gameLength);
    let catalogs;
    try { catalogs = snapshotPortableLauncherCatalogs({ gameListBytes,regionListBytes,
      gameListMd5:computeLauncherFileMd5(gameListBytes),regionListMd5:computeLauncherFileMd5(regionListBytes),
      encoding:bytes[16] === 0 ? 'utf-8' : 'gb18030',allowBareAmpersands:!!bytes[17] }); }
    catch { fail('CATALOG_CACHE_CANDIDATE'); }
    return Object.freeze({ format:LAUNCHER_CATALOG_CACHE_FORMAT.id,revision,catalogs,trust:'unverified' });
  } finally { bytes.fill(0); }
}

/** Fixed-launcher metadata parsing and branch planning. No request, download, file write, trust decision or process start. */
import { md5Hex } from './md5.mjs';

export const LAUNCHER_MANIFEST_LIMITS = Object.freeze({ responseBytes: 4096, fileBytes: 32 * 1024 * 1024, tokens: 128, locatorBytes: 1023, progressMax: 0x7fffffff });
export const WIN32_LAUNCHER_MANIFEST_LIMITS = Object.freeze({ responseBytes: 4096, fileBytes: 32 * 1024 * 1024,
  locatorBytes: 255, archiveBytes: 256 * 1024 * 1024, archiveTextBytes: 10 });
export class LauncherManifestError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherManifestError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherManifestError(code, message); };
const arrayLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const arrayBuffer = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'buffer').get;
function ownedBytes(value, maximum) {
  if (value instanceof ArrayBuffer) {
    try { Reflect.apply(bufferLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual ArrayBuffer.'); }
    value = new Uint8Array(value);
  }
  if (!(value instanceof Uint8Array)) fail('INVALID_INPUT', 'Expected explicit bytes.');
  let length;
  try { length = Reflect.apply(arrayLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual Uint8Array.'); }
  if (!Number.isInteger(length)) fail('INVALID_INPUT', 'Expected an actual Uint8Array.');
  if (length > maximum) fail('MANIFEST_BUDGET', 'Input exceeds the fixed metadata budget.');
  return new Uint8Array(value);
}
const whitespace = new Set([9, 10, 11, 12, 13, 32]);
function responseText(value, snapshot = ownedBytes) {
  const data = snapshot(value, LAUNCHER_MANIFEST_LIMITS.responseBytes); let text = '';
  for (const byte of data) {
    if (byte === 0) fail('MANIFEST_NUL', 'Embedded NUL is outside the supported profile.');
    if (byte >= 127 || (byte < 32 && !whitespace.has(byte))) fail('MANIFEST_CHARACTER', 'Expected printable ASCII or classic ASCII whitespace.');
    text += String.fromCharCode(byte);
  }
  return text;
}
function digest(token) {
  if (!/^[0-9a-fA-F]{32}$/.test(token)) fail('MANIFEST_DIGEST', 'Expected exactly32 hexadecimal digest characters.');
  return token.toLowerCase();
}
function firstTokens(value) {
  const text = responseText(value), tokens = text.split(/[\t\n\v\f\r ]+/).filter(Boolean);
  if (tokens.length < 2) fail('MANIFEST_TOKENS', 'Expected at least two metadata tokens.');
  if (tokens.length > LAUNCHER_MANIFEST_LIMITS.tokens) fail('MANIFEST_BUDGET', 'Token count exceeds the fixed metadata budget.');
  return tokens;
}
function options(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_INPUT', 'Expected explicit metadata inputs.');
  return value;
}

/** Three sequential single-character boundary trims, then the observed32-character cut. This is not a general trim. */
export function parseLauncherDigestResponse(value) {
  let text = responseText(value); const inputBytes = text.length;
  for (const character of [' ', '\n', '\r']) {
    let start = 0, end = text.length;
    while (end > start && text[end - 1] === character) end -= 1;
    while (start < end && text[start] === character) start += 1;
    text = text.slice(start, end);
  }
  const trimmedBytes = inputBytes - text.length, normalizedBytes = text.length, truncatedBytes = Math.max(0, text.length - 32);
  return Object.freeze({ md5: digest(text.slice(0, 32)), inputBytes, trimmedBytes, normalizedBytes, truncatedBytes,
    truncated: truncatedBytes !== 0, trust: 'unverified' });
}

/** Only the first two extracted tokens have identified consumers. XML tokens are not truncated. */
export function parseLauncherCatalogDigestResponse(value) {
  const tokens = firstTokens(value);
  return Object.freeze({ gameListMd5: digest(tokens[0]), regionListMd5: digest(tokens[1]), ignoredTokenCount: tokens.length - 2, trust: 'unverified' });
}

/** Locator stays opaque text. Positive full decimal progress input is an independent policy, not native atoi error emulation. */
export function parseLauncherUpdateLocatorResponse(value) {
  const tokens = firstTokens(value), locator = tokens[0], progressText = tokens[1];
  if (locator.length > LAUNCHER_MANIFEST_LIMITS.locatorBytes) fail('MANIFEST_LOCATOR', 'Locator exceeds the supported byte budget.');
  if (!/^[0-9]{1,10}$/.test(progressText) || Number(progressText) < 1 || Number(progressText) > LAUNCHER_MANIFEST_LIMITS.progressMax) {
    fail('MANIFEST_PROGRESS', 'Expected a positive full decimal32-bit progress denominator.');
  }
  return Object.freeze({ locator, progressText, progressDenominator: Number(progressText), ignoredTokenCount: tokens.length - 2, trust: 'unverified' });
}

/** Raw fixed-file digest, also exposed for branch selection before an async metadata fetch. */
export function computeLauncherFileMd5(value) { return md5Hex(ownedBytes(value, LAUNCHER_MANIFEST_LIMITS.fileBytes)); }
/** Normal-start metadata branch order. A current digest is not launcher readiness or authentication. */
export function createLauncherMetadataPlan(value) {
  value = options(value);
  const remote = parseLauncherDigestResponse(value.launcherDigestResponseBytes), localMd5 = computeLauncherFileMd5(value.launcherBytes);
  const launcher = Object.freeze({ localMd5, remoteMd5: remote.md5, matches: localMd5 === remote.md5, response: remote });
  if (!launcher.matches) {
    const locator = parseLauncherUpdateLocatorResponse(value.locatorResponseBytes);
    return Object.freeze({ disposition: 'launcher-candidate-needed', launcher,
      update: Object.freeze({ ...locator, expectedMd5: remote.md5 }), catalogs: null,
      trust: 'unverified', execution: 'not-performed', authentication: 'unverified' });
  }
  const pair = parseLauncherCatalogDigestResponse(value.catalogDigestResponseBytes);
  const gameMd5 = computeLauncherFileMd5(value.gameListBytes), regionMd5 = computeLauncherFileMd5(value.regionListBytes);
  const refreshOrder = [];
  if (gameMd5 !== pair.gameListMd5) refreshOrder.push('gameList');
  if (regionMd5 !== pair.regionListMd5) refreshOrder.push('regionList');
  const catalogs = Object.freeze({ gameList: Object.freeze({ localMd5: gameMd5, remoteMd5: pair.gameListMd5, requiresRefresh: gameMd5 !== pair.gameListMd5 }),
    regionList: Object.freeze({ localMd5: regionMd5, remoteMd5: pair.regionListMd5, requiresRefresh: regionMd5 !== pair.regionListMd5 }),
    refreshOrder: Object.freeze(refreshOrder), ignoredTokenCount: pair.ignoredTokenCount });
  return Object.freeze({ disposition: catalogs.gameList.requiresRefresh || catalogs.regionList.requiresRefresh ? 'catalog-refresh-needed' : 'metadata-current',
    launcher, update: null, catalogs, trust: 'unverified', execution: 'not-performed', authentication: 'unverified' });
}

function ownedWin32Bytes(value, maximum) {
  try {
    if (value instanceof ArrayBuffer) Reflect.apply(bufferLength, value, []);
    else Reflect.apply(bufferLength, Reflect.apply(arrayBuffer, value, []), []);
    return ownedBytes(value, maximum);
  } catch (error) {
    if (error instanceof LauncherManifestError) throw error;
    fail('INVALID_INPUT', 'Expected attached, nonshared byte input.');
  }
}

/** Current Win32 trim set and comparison casing; canonical MD5 is separately exposed for package checking. */
export function parseWin32LauncherDigestResponse(value) {
  let text = responseText(value, ownedWin32Bytes);
  const inputBytes = text.length;
  text = text.replace(/^[ \r\n]+|[ \r\n]+$/g, '');
  const normalizedBytes = text.length, trimmedBytes = inputBytes - normalizedBytes;
  const comparisonText = text.slice(0, 32), truncatedBytes = Math.max(0, normalizedBytes - 32);
  return Object.freeze({ md5: digest(comparisonText), comparisonText, inputBytes, trimmedBytes, normalizedBytes,
    truncatedBytes, truncated: truncatedBytes !== 0, trust: 'unverified' });
}

/** Effective worker + handoff-builder subset. The preserved locator only passes native prefix checks, not a full URL parser. */
export function parseWin32LauncherUpdateLocatorResponse(value) {
  const text = responseText(value, ownedWin32Bytes), tokens = text.split(/[\t\n\v\f\r ]+/).filter(Boolean);
  if (tokens.length < 2) fail('MANIFEST_TOKENS', 'Expected the locator and declared archive size.');
  if (tokens.length > LAUNCHER_MANIFEST_LIMITS.tokens) fail('MANIFEST_BUDGET', 'Token count exceeds the metadata budget.');
  const [locator, archiveBytesText] = tokens;
  const prefix = /^https?:\/\//i.exec(locator);
  if (locator.length > WIN32_LAUNCHER_MANIFEST_LIMITS.locatorBytes || !prefix
    || locator.length === prefix[0].length || /[|"]/.test(locator)
    || /[\/\\ ]/.test(locator[prefix[0].length])) {
    fail('WIN32_MANIFEST_LOCATOR', 'Expected the bounded native HTTP/S prefix subset.');
  }
  if (!/^[0-9]{1,10}$/.test(archiveBytesText) || Number(archiveBytesText) < 1
    || Number(archiveBytesText) > WIN32_LAUNCHER_MANIFEST_LIMITS.archiveBytes) {
    fail('WIN32_MANIFEST_ARCHIVE_SIZE', 'Expected declared decimal archive bytes in 1..256 MiB.');
  }
  return Object.freeze({ locator, archiveBytesText, archiveBytes: Number(archiveBytesText),
    ignoredTokenCount: tokens.length - 2, locatorValidation: 'native-prefix-only', trust: 'unverified' });
}

function win32Data(value, field) {
  const property = Object.getOwnPropertyDescriptor(value, field);
  if (!property || !Object.hasOwn(property, 'value')) fail('WIN32_MANIFEST_INPUT', 'Expected own metadata data fields.');
  return property.value;
}

/** Current-source planning is explicit; the legacy factory and digest-driven catalog selection remain unchanged. */
export function createWin32LauncherMetadataPlan(value) {
  value = options(value);
  if (Reflect.ownKeys(value).some(key => !['launcherBytes', 'launcherDigestResponseBytes', 'locatorResponseBytes'].includes(key))) {
    fail('WIN32_MANIFEST_INPUT', 'Unexpected current metadata field.');
  }
  const remote = parseWin32LauncherDigestResponse(win32Data(value, 'launcherDigestResponseBytes'));
  const localMd5 = md5Hex(ownedWin32Bytes(win32Data(value, 'launcherBytes'), WIN32_LAUNCHER_MANIFEST_LIMITS.fileBytes));
  const launcher = Object.freeze({ localMd5, remoteMd5: remote.md5, comparisonText: remote.comparisonText,
    matches: localMd5 === remote.comparisonText, response: remote });
  if (!launcher.matches) {
    const locator = parseWin32LauncherUpdateLocatorResponse(win32Data(value, 'locatorResponseBytes'));
    return Object.freeze({ disposition: 'launcher-candidate-needed', profile: 'win32-current-metadata-v1', launcher,
      update: Object.freeze({ ...locator, expectedMd5: remote.md5 }), catalogs: null,
      trust: 'unverified', execution: 'not-performed', authentication: 'unverified' });
  }
  return Object.freeze({ disposition: 'catalog-pair-needed', profile: 'win32-current-metadata-v1', launcher, update: null,
    catalogs: Object.freeze({ requestOrder: Object.freeze(['catalogDigests', 'gameList', 'regionList']),
      catalogDigestUse: 'request-success-only', comparison: 'raw-pair-bytes' }),
    trust: 'unverified', execution: 'not-performed', authentication: 'unverified' });
}

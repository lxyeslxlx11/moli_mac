/** Current Win32 catalog comparison over supplied bytes. No XML decoding, file access, publication or recovery. */
export const LAUNCHER_CATALOG_PAIR_LIMITS = Object.freeze({ fileBytes: 1024 * 1024 });
export class LauncherCatalogPairError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherCatalogPairError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherCatalogPairError(code, message); };
const typedPrototype = Object.getPrototypeOf(Uint8Array.prototype);
const typedLength = Object.getOwnPropertyDescriptor(typedPrototype, 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(typedPrototype, 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const fields = Object.freeze(['currentGameListBytes', 'currentRegionListBytes', 'gameListBytes', 'regionListBytes']);

function snapshot(value, nullable) {
  if (nullable && value === null) return null;
  let length, copy;
  try {
    if (value instanceof ArrayBuffer) {
      length = Reflect.apply(bufferLength, value, []);
      if (length <= LAUNCHER_CATALOG_PAIR_LIMITS.fileBytes) copy = new Uint8Array(new Uint8Array(value));
    } else {
      if (!(value instanceof Uint8Array)) fail('CATALOG_PAIR_INPUT', 'Expected actual byte input.');
      length = Reflect.apply(typedLength, value, []);
      // An ArrayBuffer getter rejects shared backing storage without invoking subclass metadata.
      Reflect.apply(bufferLength, Reflect.apply(typedBuffer, value, []), []);
      if (length <= LAUNCHER_CATALOG_PAIR_LIMITS.fileBytes) copy = new Uint8Array(value);
    }
  } catch { fail('CATALOG_PAIR_INPUT', 'Expected attached, nonshared Uint8Array or ArrayBuffer input.'); }
  if (!Number.isInteger(length)) fail('CATALOG_PAIR_INPUT', 'Expected actual byte input.');
  if (length > LAUNCHER_CATALOG_PAIR_LIMITS.fileBytes) fail('CATALOG_PAIR_BUDGET', 'Catalog input exceeds its byte budget.');
  return copy;
}

function compare(current, candidate) {
  if (current === null) return 'unavailable';
  if (current.length !== candidate.length) return 'different';
  for (let at = 0; at < current.length; at += 1) if (current[at] !== candidate[at]) return 'different';
  return 'identical';
}

/** Null current input denotes unavailable bytes, without claiming that a file is absent or why reading failed. */
export function compareWin32LauncherCatalogPair(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('CATALOG_PAIR_INPUT', 'Expected four explicit byte inputs.');
  const keys = Reflect.ownKeys(input);
  if (keys.length !== fields.length || keys.some(key => !fields.includes(key))) fail('CATALOG_PAIR_INPUT', 'Expected exactly four own byte inputs.');
  const values = fields.map((field, ordinal) => {
    const property = Object.getOwnPropertyDescriptor(input, field);
    if (!property || !Object.hasOwn(property, 'value')) fail('CATALOG_PAIR_INPUT', 'Expected own data fields.');
    return snapshot(property.value, ordinal < 2);
  });
  const gameList = compare(values[0], values[2]), regionList = compare(values[1], values[3]);
  return Object.freeze({ gameList, regionList, requiresReplacement: gameList !== 'identical' || regionList !== 'identical',
    replacementUnit: 'catalog-pair', comparison: 'raw-bytes', xmlValidation: 'not-performed',
    fileOperations: 'not-performed', trust: 'unverified' });
}

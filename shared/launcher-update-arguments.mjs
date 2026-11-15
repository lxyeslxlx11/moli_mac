/** Source-bound updater argument bytes. No process, event, filesystem, URL request or permission operations. */
export const WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE = Object.freeze({
  id: 'win32-updater-arguments-ascii-v1',
  sourceSha256: 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152',
  fields: 5, urlBytes: 255, launcherPathBytes: 259, archiveSizeBytes: 10,
  archiveBytesMax: 268435456, md5Bytes: 32, argumentBytes: 570,
});
export class LauncherUpdateArgumentError extends Error {
  constructor(code) {
    super('Updater arguments are outside the supported ASCII profile.');
    this.name = 'LauncherUpdateArgumentError'; this.code = code;
  }
}
const fail = code => { throw new LauncherUpdateArgumentError(code); };
const fields = Object.freeze(['parentPid', 'urlBytes', 'launcherPathBytes', 'archiveSizeBytes', 'launcherMd5Bytes']);
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const typedLength = Object.getOwnPropertyDescriptor(typed, 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;

function data(input) {
  try {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('UPDATE_ARGUMENT_INPUT');
    const descriptors = Object.getOwnPropertyDescriptors(input);
    if (Reflect.ownKeys(descriptors).length !== fields.length) fail('UPDATE_ARGUMENT_INPUT');
    for (const key of fields) {
      if (!Object.hasOwn(descriptors, key) || !Object.hasOwn(descriptors[key], 'value')) fail('UPDATE_ARGUMENT_INPUT');
    }
    return fields.map(key => descriptors[key].value);
  } catch { fail('UPDATE_ARGUMENT_INPUT'); }
}

function snapshot(input, minimum, maximum) {
  let buffer, length;
  try {
    if (input instanceof ArrayBuffer) {
      buffer = input; length = Reflect.apply(bufferLength, input, []);
    } else {
      if (!(input instanceof Uint8Array)) fail('UPDATE_ARGUMENT_BYTES');
      buffer = Reflect.apply(typedBuffer, input, []);
      Reflect.apply(bufferLength, buffer, []); // Shared storage is outside this owned snapshot contract.
      length = Reflect.apply(typedLength, input, []);
    }
    new Uint8Array(buffer, 0, 0); // Reject detached storage before treating it as an empty field.
  } catch { fail('UPDATE_ARGUMENT_BYTES'); }
  if (length < minimum || length > maximum) fail('UPDATE_ARGUMENT_LENGTH');
  try { return new Uint8Array(input instanceof ArrayBuffer ? new Uint8Array(input) : input); }
  catch { fail('UPDATE_ARGUMENT_BYTES'); }
}

function textField(bytes) {
  if (bytes.some(byte => byte < 32 || byte > 126 || byte === 34 || byte === 124)
      || bytes[0] === 32 || bytes[bytes.length - 1] === 32) fail('UPDATE_ARGUMENT_TEXT');
  return String.fromCharCode(...bytes);
}
const alpha = byte => byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122;
const hex = byte => byte >= 48 && byte <= 57 || byte >= 65 && byte <= 70 || byte >= 97 && byte <= 102;

/** Logical CString bytes, without its terminating NUL. ASCII is an explicit subset of the native MBCS behavior. */
export function encodeWin32LauncherUpdateArguments(input) {
  const [parentPid, urlInput, pathInput, sizeInput, md5Input] = data(input);
  if (!Number.isInteger(parentPid) || parentPid < 1 || parentPid > 0xffffffff) fail('UPDATE_ARGUMENT_PID');
  const owned = [];
  try {
    const copy = (value, minimum, maximum) => {
      const bytes = snapshot(value, minimum, maximum); owned.push(bytes); return bytes;
    };
    const url = copy(urlInput, 1, 255), path = copy(pathInput, 4, 259);
    const size = copy(sizeInput, 1, 10), md5 = copy(md5Input, 32, 32);
    const urlText = textField(url); textField(path);
    const lower = urlText.toLowerCase();
    const prefix = lower.startsWith('http://') ? 7 : lower.startsWith('https://') ? 8 : 0;
    if (!prefix || url.length <= prefix || [32, 47, 92].includes(url[prefix])) fail('UPDATE_ARGUMENT_URL');
    if (!alpha(path[0]) || path[1] !== 58 || path[2] !== 92) fail('UPDATE_ARGUMENT_PATH');
    let archiveBytes = 0;
    for (const byte of size) {
      if (byte < 48 || byte > 57) fail('UPDATE_ARGUMENT_SIZE');
      archiveBytes = archiveBytes * 10 + byte - 48;
    }
    if (archiveBytes < 1 || archiveBytes > WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE.archiveBytesMax) fail('UPDATE_ARGUMENT_SIZE');
    if (!md5.every(hex)) fail('UPDATE_ARGUMENT_MD5');
    const pid = Uint8Array.from(String(parentPid), char => char.charCodeAt(0));
    const parts = [pid, url, path, size, md5];
    const argumentBytes = new Uint8Array(parts.reduce((total, part) => total + part.length, 4));
    let at = 0;
    for (let index = 0; index < parts.length; index++) {
      if (index) argumentBytes[at++] = 32;
      for (const byte of parts[index]) argumentBytes[at++] = byte === 32 ? 124 : byte;
    }
    return Object.freeze({ profile: WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE.id, argumentBytes, fields: 5,
      archiveBytes, trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
  } finally { for (const bytes of owned) bytes.fill(0); }
}

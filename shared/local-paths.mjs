/** Internal pure local-path policy, shared by legacy-config planning and inventory checks. */
export const LOCAL_PATH_LIMITS = Object.freeze({ characters: 4096 });
export class LocalPathError extends Error {
  constructor(code, message) { super(message); this.name = 'LocalPathError'; this.code = code; }
}
function fail(code, message) { throw new LocalPathError(code, message); }
function text(value) {
  if (typeof value !== 'string') fail('INVALID_INPUT', 'Expected a local path string.');
  if (value.length > LOCAL_PATH_LIMITS.characters) fail('FIELD_BUDGET', 'Path exceeds the fixed character budget.');
  for (const character of value) {
    const c = character.codePointAt(0);
    if (!(c === 9 || c === 10 || c === 13 || (c >= 0x20 && c <= 0xd7ff)
      || (c >= 0xe000 && c <= 0xfffd) || (c >= 0x10000 && c <= 0x10ffff))) {
      fail('INVALID_CHARACTER', 'Path contains a forbidden character or unpaired surrogate.');
    }
  }
}
function component(value) {
  if (!value || value === '.' || value === '..' || /[<>:"|?*\x00-\x1f\x7f]/.test(value)
    || /[. ]$/.test(value) || /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(value)) {
    fail('UNSAFE_PATH', 'Unsupported or ambiguous local path component.');
  }
}
export function localRelativePath(value, optional = false) {
  text(value);
  if (!value && optional) return null;
  if (!value || /^[\\/]|^[A-Za-z]:/.test(value)) fail('UNSAFE_PATH', 'Expected a local relative file path.');
  const segments = value.split(/[\\/]/);
  segments.forEach(component);
  return segments.join('\\');
}
export function localDirectoryPath(value) {
  text(value);
  if (!/^[A-Za-z]:[\\/]/.test(value)) fail('UNSUPPORTED_DIRECTORY', 'Expected a drive-rooted local Windows directory snapshot.');
  const path = value.replace(/\//g, '\\');
  const tail = path.slice(3).replace(/\\$/, '');
  if (tail) tail.split('\\').forEach(component);
  return `${path.slice(0, 3)}${tail}`;
}
// A conservative collision policy, not a complete emulation of Windows/filesystem Unicode rules.
export function localPathKey(value) {
  return value.normalize('NFC').replace(/[A-Z]/g, character => character.toLowerCase());
}
export function joinLocalPath(directory, relative) {
  const joined = `${localDirectoryPath(directory).replace(/\\$/, '')}\\${localRelativePath(relative)}`;
  text(joined);
  return joined;
}

import { GAME_PATCH_LIMITS, GamePatchError } from './game-patch-data.mjs';
const fail = (code,message) => { throw new GamePatchError(code,message); };
// Paths are memory keys. This intentionally supports a strict portable ASCII subset of native ANSI paths.
export function gamePatchPath(text, allowEmpty = false) {
  if (typeof text !== 'string' || text.length > GAME_PATCH_LIMITS.pathBytes ||
      /[^\x21-\x7e]|[:*?"<>|]/.test(text) || /^[\\/]/.test(text)) fail('PATCH_PATH', 'Expected a bounded relative ASCII path.');
  text = text.replaceAll('\\', '/');
  if (!text && allowEmpty) return '';
  if (!text || text.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part) ||
      /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) fail('PATCH_PATH', 'Path contains unsupported components.');
  return text;
}
export function gamePatchKey(map, name) { const wanted = name.toLowerCase(); for (const existing of map.keys()) if (existing.toLowerCase() === wanted) return existing; return null; }
export function validateGamePatchTree(map) {
  const names = new Set(); let total = 0;
  for (const [name, value] of map) {
    const folded = name.toLowerCase();
    if (names.has(folded)) fail('PATCH_PATH_ALIAS', 'Case aliases are ambiguous.');
    names.add(folded); total += value.length;
    if (map.size > GAME_PATCH_LIMITS.files || value.length > GAME_PATCH_LIMITS.fileBytes || total > GAME_PATCH_LIMITS.totalBytes) fail('PATCH_BUDGET', 'Candidate files exceed the byte or file budget.');
  }
  for (const name of names) { let parent = name; while (parent.includes('/')) { parent = parent.slice(0, parent.lastIndexOf('/')); if (names.has(parent)) fail('PATCH_PATH_ALIAS', 'A file shadows a directory.'); } }
}

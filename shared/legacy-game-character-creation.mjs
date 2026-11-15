/** Fixed37c4 creation controls and numeric request values. No native preview pixels or profile.dat writes. */
import { source501200, source500dd0 } from './legacy-game-character-codes.mjs';
export const LEGACY_GAME_CHARACTER_CREATION_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-creation-v1', request: 'send-004f8460', reply: 'receive-00567c48',
  nameBytes: 16, timeoutMilliseconds: 600001, previewPixels: 'unmodeled', officialAcceptance: 'unverified',
});
export class LegacyGameCharacterCreationError extends Error {
  constructor(code) { super('Character creation requires the bounded source controls.'); this.name = 'LegacyGameCharacterCreationError'; this.code = code; }
}
const fail = code => { throw new LegacyGameCharacterCreationError(code); };
const zero = value => Uint8Array.prototype.fill.call(value, 0);
function integer(value, low, high) {
  if (!Number.isInteger(value) || value < low || value > high) fail('LEGACY_CREATION_VALUE');
  return value;
}
function bytes(value) {
  if (!(value instanceof Uint8Array)) fail('LEGACY_CREATION_NAME_BYTES');
  let copy;
  try { copy = new Uint8Array(value); } catch { fail('LEGACY_CREATION_NAME_BYTES'); }
  if (copy.length > 16 || copy.includes(0)) { zero(copy); fail('LEGACY_CREATION_NAME_BYTES'); }
  return copy;
}
function step(value, maximum) { return (value + maximum + 1) % (maximum + 1); }
function delta(value) { if (value !== -1 && value !== 1) fail('LEGACY_CREATION_VALUE'); return value; }
function change(value, maximum) {
  if (!value || typeof value !== 'object' || Reflect.ownKeys(value).length !== 2) fail('LEGACY_CREATION_VALUE');
  const d = Object.getOwnPropertyDescriptors(value);
  if (!Object.hasOwn(d.index ?? {}, 'value') || !Object.hasOwn(d.delta ?? {}, 'value')) fail('LEGACY_CREATION_VALUE');
  return [integer(d.index.value, 0, maximum), delta(d.delta.value)];
}
function contains(value, pattern) {
  outer: for (let i = 0; i + pattern.length <= value.length; i++) {
    for (let j = 0; j < pattern.length; j++) if (value[i + j] !== pattern[j]) continue outer;
    return true;
  }
  return false;
}
function duplicate(value, names) {
  if (!Array.isArray(names) || names.length > 2) fail('LEGACY_CREATION_NAMES');
  return names.some(name => {
    if (!(name instanceof Uint8Array)) fail('LEGACY_CREATION_NAMES');
    const end = name.indexOf(0), n = end < 0 ? name.length : end;
    return n === value.length && value.every((b, i) => b === name[i]);
  });
}
function validName(name, names) {
  if (!name.length) fail('LEGACY_CREATION_NAME_EMPTY');
  if (duplicate(name, names)) fail('LEGACY_CREATION_NAME_DUPLICATE');
  if (contains(name, [32]) || contains(name, [0x81, 0x40]) || contains(name, [0xa1, 0x40]) || contains(name, [91, 71, 80, 93])) fail('LEGACY_CREATION_NAME_RESERVED');
  for (let i = 0; i < name.length; i++) {
    const b = name[i];
    if (b & 128) { i++; continue; }
    if (b === 124 || b === 92 || b === 47 || b <= 32 || b === 127) fail('LEGACY_CREATION_NAME_RESERVED');
  }
  let trail = false;
  for (const b of name) {
    if (trail) trail = false;
    else if (b >= 0x81) trail = true;
    else if (b === 124 || b === 92) fail('LEGACY_CREATION_NAME_RESERVED');
  }
}
export function createLegacyGameCharacterDraft(category) {
  let currentCategory = integer(category, -0x80000000, 0x7fffffff) & 255;
  let state = 'appearance', family = currentCategory > 4 ? 1 : 0, appearance = 0, color = 0, mode = 0;
  let name = new Uint8Array(), statRemaining = 30, elementRemaining = 10;
  const stats = [0, 0, 0, 0, 0], elements = [0, 0, 0, 0], details = [0, 0];
  const maximumMode = () => currentCategory < 5 ? 0 : currentCategory < 7 ? 1 : 2;
  const active = () => { if (state === 'closed') fail('LEGACY_CREATION_CLOSED'); };
  function inspect() {
    return Object.freeze({ profile: LEGACY_GAME_CHARACTER_CREATION_PROFILE.id, state, category: currentCategory,
      family, appearance, color, mode, maximumMode: maximumMode(), canToggleFamily: currentCategory > 4,
      canCycleMode: family !== maximumMode(), nameBytesLength: name.length,
      stats: Object.freeze([...stats]), statRemaining, elements: Object.freeze([...elements]), elementRemaining,
      details: Object.freeze([...details]), elementControls: Object.freeze(elements.map((_, i) => elements[(i + 2) % 4] === 0)),
      previewPixels: 'unmodeled', nativeProfilePersistence: 'unmodeled' });
  }
  function validate(names) {
    if (!name.length) fail('LEGACY_CREATION_NAME_EMPTY');
    if (statRemaining > 0) fail('LEGACY_CREATION_STAT_POINTS');
    if (elementRemaining > 0) fail('LEGACY_CREATION_ELEMENT_POINTS');
    validName(name, names);
  }
  return Object.freeze({ inspect,
    setCategory(value) { active(); currentCategory = integer(value, -0x80000000, 0x7fffffff) & 255; },
    copy() { active(); return Object.freeze({ ...inspect(), nameBytes: name.slice() }); },
    update(action, value, names = []) {
      active(); let changed = true;
      if (state === 'appearance') {
        if (action === 'appearance') { appearance = integer(value, 0, 13); color = 0; }
        else if (action === 'family') { if (!currentCategory || currentCategory < 5) changed = false; else family = 1 - family; }
        else if (action === 'color') color = step(color + delta(value), 3);
        else if (action === 'continue') {
          zero(name); name = new Uint8Array(); stats.fill(0); elements.fill(0); details.fill(0);
          statRemaining = 30; elementRemaining = 10; mode = maximumMode(); state = 'details';
        } else fail('LEGACY_CREATION_ACTION');
      } else if (state === 'details') {
        if (action === 'name') { const next = bytes(value); zero(name); name = next; }
        else if (action === 'back') { zero(name); name = new Uint8Array(); state = 'appearance'; }
        else if (action === 'detail') { const [index, by] = change(value, 1); details[index] = step(details[index] + by, 4); }
        else if (action === 'mode') {
          const by = delta(value), maximum = maximumMode(), low = family === 0 ? 0 : 1;
          if (family === maximum) changed = false;
          else { mode += by; if (mode < low) mode = maximum; else if (mode > maximum) mode = low; }
        } else if (action === 'stat') {
          const [index, by] = change(value, 4), limit = Math.trunc((statRemaining + stats.reduce((a, b) => a + b, 0)) / 2);
          if (by < 0 ? stats[index] === 0 : statRemaining <= 0 || stats[index] >= limit) changed = false;
          else { stats[index] += by; statRemaining -= by; }
        } else if (action === 'element') {
          const [index, by] = change(value, 3);
          if (by < 0) { if (!elements[index]) changed = false; else { elements[index]--; elementRemaining++; } }
          else if (elements[index] >= 10) changed = false;
          else if (!elements[(index + 2) % 4] && elementRemaining > 0) { elements[index]++; elementRemaining--; }
          else { const from = elements.findIndex((n, i) => i !== index && n > 0); if (from < 0) changed = false; else { elements[from]--; elements[index]++; } }
        } else if (action === 'request-confirmation') { validate(names); state = 'confirmation'; }
        else fail('LEGACY_CREATION_ACTION');
      } else if (state === 'confirmation' && action === 'cancel-confirmation') state = 'details';
      else fail('LEGACY_CREATION_ACTION');
      return Object.freeze({ changed, snapshot: inspect() });
    },
    prepare(slot, names = []) {
      active(); integer(slot, 0, 1); if (state !== 'confirmation') fail('LEGACY_CREATION_NOT_CONFIRMED'); validate(names);
      const resource = 240000 + (appearance + family * 14) * 100;
      const animation = (family === 1 ? 106002 : mode === 0 ? 100002 : 105002) + 25 * (appearance < 7 ? appearance : appearance + 3) + color * 6;
      let icon;
      if (mode === 0) icon = source500dd0(source501200(resource)) + (details[0] + color * 100) * 10 + details[1];
      else if (mode === 1) icon = source501200(resource) + (color * 5 + details[0]) * 5 + details[1];
      else icon = resource + (color * 5 + details[0]) * 5 + details[1];
      return Object.freeze({ operationId: LEGACY_GAME_CHARACTER_CREATION_PROFILE.request,
        arguments: Object.freeze([slot, name.slice(), animation, icon, ...stats, ...elements]), nativeVariant: mode === 0 ? 0 : 1 });
    },
    close() { if (state === 'closed') return; zero(name); name = new Uint8Array(); stats.fill(0); elements.fill(0); details.fill(0); state = 'closed'; },
  });
}

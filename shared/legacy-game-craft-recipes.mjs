/** Fixed 37c4 recipe replies and partial resets. Numeric meanings keep source offsets. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {
  splitLegacyGameStateFields as split,
  unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal,
} from './legacy-game-state.mjs';

export const LEGACY_GAME_CRAFT_RECIPE_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-craft-recipes-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  slots: 15, recipes: 56, materials: 5, fieldsPerRecipe: 22,
  skillBytes: 0x49fc, recipeOffset: 0x698, recipeBytes: 0x134,
  materialOffset: 0x6c, materialBytes: 0x28, contextMode: 0,
  completeCrafting: false,
});

export class LegacyGameCraftRecipeError extends Error {
  constructor(code) {
    super('Craft recipe data is outside the evidenced source profile.');
    this.name = 'LegacyGameCraftRecipeError';
    this.code = code;
  }
}
const fail = code => { throw new LegacyGameCraftRecipeError(code); };
const skillSlot = slot => {
  if (!Number.isInteger(slot) || slot < 0 || slot >= 15) fail('LEGACY_CRAFT_SLOT');
  return slot;
};
const blankMaterial = () => ({fields: {0: -1, 4: 0}, nameBytes: new Uint8Array()});
const blankRecipe = () => ({
  fields: {0: -1, 4: 0, 8: 0, 12: 0, 16: 0},
  nameBytes: new Uint8Array(), descriptionBytes: new Uint8Array(),
  materials: Array.from({length: 5}, blankMaterial),
});
const clone = row => ({
  ...row, fields: {...row.fields}, nameBytes: row.nameBytes.slice(),
  descriptionBytes: row.descriptionBytes.slice(),
  materials: row.materials.map(m => ({fields: {...m.fields}, nameBytes: m.nameBytes.slice()})),
});
const wipe = row => {
  row.nameBytes.fill(0);
  row.descriptionBytes.fill(0);
  for (const material of row.materials) material.nameBytes.fill(0);
};
function replaceText(current, bytes, maximum) {
  const decoded = unescape(bytes);
  try {
    if (decoded.length > maximum) return current;
    current.fill(0);
    return decoded.slice();
  } finally { decoded.fill(0); }
}
const copy = (row, index) => Object.freeze({
  index, fields: Object.freeze({...row.fields}), nameBytes: row.nameBytes.slice(),
  descriptionBytes: row.descriptionBytes.slice(),
  materials: Object.freeze(row.materials.map((m, index) => Object.freeze({
    index, fields: Object.freeze({...m.fields}), nameBytes: m.nameBytes.slice(),
  }))),
});

export function createLegacyGameCraftRecipes() {
  let closed = false;
  const records = Array.from({length: 15}, () => Array.from({length: 56}, blankRecipe));
  const versions = new Uint32Array(15);
  const contexts = new Uint8Array(15);
  const active = () => { if (closed) fail('LEGACY_CRAFT_CLOSED'); };
  return Object.freeze({
    apply(slot, value, contextMode=0) {
      active(); skillSlot(slot);
      if(contextMode!==0&&contextMode!==1)fail('LEGACY_WORK_CONTEXT_MODE');
      const raw = assetBytes(value, 32760);
      let pending = records[slot].map(clone);
      try {
        const tokens = split(raw);
        const field = (at, maximum) => tokens[at]?.subarray(0, maximum) ?? new Uint8Array();
        const number = at => {
          const bytes = field(at, 127);
          return bytes.length ? decimal(bytes) : -1;
        };
        for (let index = 0; index < 56; index++) {
          const at = index * 22, row = pending[index];
          for (const [offset, token] of [[0, 0], [4, 5], [8, 1], [12, 6], [16, 2]]) {
            row.fields[offset] = number(at + token);
          }
          row.nameBytes = replaceText(row.nameBytes, field(at + 3, 255), 28);
          row.descriptionBytes = replaceText(row.descriptionBytes, field(at + 4, 255), 56);
          for (let material = 0; material < 5; material++) {
            const start = at + 7 + material * 3, item = row.materials[material];
            item.fields[0] = number(start);
            item.fields[4] = number(start + 2);
            item.nameBytes = replaceText(item.nameBytes, field(start + 1, 255), 28);
          }
        }
        for (const row of records[slot]) wipe(row);
        records[slot] = pending;
        pending = null;
        versions[slot]++;
        contexts[slot]=contextMode;
        return Object.freeze({kind: 'player-craft-recipes-updated', slot,
          version: versions[slot], rows: 56, contextMode, requests: Object.freeze([])});
      } finally {
        raw.fill(0);
        if (pending) for (const row of pending) wipe(row);
      }
    },
    reset(slot) {
      active(); skillSlot(slot);
      for (const row of records[slot]) {
        row.fields[0] = -1;
        for (const material of row.materials) material.fields[0] = -1;
      }
      versions[slot]++;
    },
    containsProductId(slot,id){active();skillSlot(slot);return records[slot].some(row=>row.fields[0]===id);},
    copy(slot) {
      active(); skillSlot(slot);
      return Object.freeze({profile: LEGACY_GAME_CRAFT_RECIPE_PROFILE.id, slot,
        version: versions[slot], contextMode: contexts[slot], recipes: Object.freeze(records[slot].map(copy))});
    },
    close() {
      if (closed) return;
      closed = true;
      for (const rows of records) for (const row of rows) wipe(row);
      records.length = 0;
      versions.fill(0);
      contexts.fill(0);
    },
  });
}

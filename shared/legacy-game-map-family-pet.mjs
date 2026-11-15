/** Fixed 37c4 family pet window and its feeding rules. */
import {
  splitLegacyGameStateFields, unescapeLegacyGameInnerField,
} from './legacy-game-state.mjs';

export const legacyGameFamilyPetMode = 0x20;
export const legacyGameFamilyPetNameBytes = 16;

export function readLegacyGameFamilyPet(bytes, linesFor) {
  const [name, description] = splitLegacyGameStateFields(bytes);
  if (!description) return null;
  const title = unescapeLegacyGameInnerField(name.subarray(0, 1023));
  const body = unescapeLegacyGameInnerField(description.subarray(0, 1023));
  try {
    const lines = splitLegacyGameStateFields(body, 10).flatMap(line => line.length ? linesFor(line, 30, 36) : [line.slice()]);
    return { title, lines, pending: null };
  } finally {
    body.fill(0);
  }
}

export function canFeedLegacyGameFamilyPet(row, allowed) {
  return !!row?.present && !row.equipment && (allowed || row.category === 0x35);
}

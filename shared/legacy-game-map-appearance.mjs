/** Local appearance draft for the fixed 37c4 map editor. */
import { source500dd0, source500e90, source501200, source5012d0 } from './legacy-game-character-codes.mjs';

export function createLegacyGameMapAppearance(code, category) {
  if (!Number.isInteger(code) || !Number.isInteger(category)) return null;
  const normalized = source5012d0(source500e90(code));
  if (normalized < 240000 || normalized >= 242800) return null;
  const detail2 = normalized % 5;
  const detail1 = Math.trunc(normalized / 5) % 5;
  const color = Math.trunc(normalized / 25) % 4;
  const base = normalized - color * 25 - detail1 * 5 - detail2;
  const variant = code >= 240000 ? 2 : code >= 200000 ? 1 : 0;
  const low = normalized >= 241400 ? 1 : 0;
  const region = category & 255;
  const high = region >= 7 ? 2 : region >= 5 ? 1 : 0;

  return { base, color, low, high, variant, detail1, detail2 };
}

export function copyLegacyGameMapAppearance(draft) {
  const { base, color, low, high, variant, detail1, detail2 } = draft;
  const intermediate = variant === 2 ? base : source501200(base);
  const appearanceCode = variant === 0 ? source500dd0(intermediate) + (color * 100 + detail1) * 10 + detail2
    : intermediate + color * 25 + detail1 * 5 + detail2;
  return Object.freeze({ variant, detail1, detail2, appearanceCode, canChangeVariant: low < high,
    previewResourceId: variant === 0 && appearanceCode >= 30000 && appearanceCode < 98000 ? appearanceCode : null });
}

export function adjustLegacyGameMapAppearance(draft, control) {
  const { low, high, variant } = draft;
  if ((control === 3 || control === 5) && low < high) {
    const next = variant + (control === 3 ? -1 : 1);
    draft.variant = next < low ? high : next > high ? low : next;
    return true;
  }
  if (control === 6 || control === 8) {
    draft.detail1 = (draft.detail1 + (control === 6 ? 4 : 1)) % 5;
    return true;
  }
  if (control === 9 || control === 11) {
    draft.detail2 = (draft.detail2 + (control === 9 ? 4 : 1)) % 5;
    return true;
  }
  return false;
}

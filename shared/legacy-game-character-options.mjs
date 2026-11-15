/** Fixed37c4 local character options and known version-upgrade request branches. */
import { source500dd0, source500e90, source501200, source5012d0, prepareCharacterPreviewRecord } from './legacy-game-character-codes.mjs';
export const LEGACY_GAME_CHARACTER_OPTIONS_PROFILE = Object.freeze({ id: 'legacy-se6000-37c4-options-v1', upgradeRequest: 'send-004f8880', upgradeReply: 'receive-00567c1c', previewPixels: 'unmodeled', officialAcceptance: 'unverified' });
export class LegacyGameCharacterOptionError extends Error {
  constructor(code) { super('Character option requires the supported fixed source branch.'); this.name = 'LegacyGameCharacterOptionError'; this.code = code; }
}
const fail = code => { throw new LegacyGameCharacterOptionError(code); };
function integer(value, low = -0x80000000, high = 0x7fffffff) { if (!Number.isInteger(value) || value < low || value > high) fail('LEGACY_CHARACTER_OPTION_VALUE'); return value; }
function recordCopy(value) {
  let copy;
  try { if (!(value instanceof Uint8Array)) fail('LEGACY_CHARACTER_OPTION_RECORD'); copy = new Uint8Array(value); } catch { fail('LEGACY_CHARACTER_OPTION_RECORD'); }
  if (copy.length !== 148) { copy.fill(0); fail('LEGACY_CHARACTER_OPTION_RECORD'); }
  return copy;
}
export function legacyGameCharacterOptionPolicy(category, present, variant) {
  const c = integer(category) & 255; integer(variant); if (typeof present !== 'boolean') fail('LEGACY_CHARACTER_OPTION_VALUE');
  const enabled = present && c > 4, knownVariant = variant === 0 || variant === 1;
  return Object.freeze({ previous: enabled && (knownVariant || c > 6), next: enabled && (knownVariant || c > 6), togglePreview: enabled && knownVariant,
    nativeActions: Object.freeze(enabled ? [...(knownVariant || c > 6 ? [3, 4] : []), ...(knownVariant ? [5, 6] : [])] : []) });
}
export function transformLegacyGameCharacterOption(value, category, action) {
  const c = integer(category) & 255; integer(action, 3, 6); const record = recordCopy(value);
  try {
    const view = new DataView(record.buffer), before = [view.getInt32(24, true), view.getInt32(36, true), view.getInt32(80, true)];
    if (!legacyGameCharacterOptionPolicy(c, record[0] !== 0, before[2]).nativeActions.includes(action)) fail('LEGACY_CHARACTER_OPTION_UNAVAILABLE');
    let normalizedCode = null, requestedPreviewVariant = null;
    if (action < 5) {
      let [code, type] = before;
      if (code !== 0x814c && code !== 0x814d) {
        if (code >= 30000 && code < 98000) type = 0;
        else if ((code >= 202800 && code < 204200) || (c >= 7 && code >= 200000 && code <= 202699)) type = 1;
        else if (c >= 7 && code >= 240000 && code <= 242800) type = 2;
        if (c < 7) { if (type === 0) code = source500e90(code); else if (type === 1) code = source500dd0(code); }
        else if (type === 0) { code = source500e90(code); if (action === 3) code = source5012d0(code); }
        else if (type === 1) code = action === 4 || (code >= 200000 && code <= 202699) ? source5012d0(code) : source500dd0(code);
        else if (type === 2) { const original = code; code = source501200(code); if (action === 4 && original >= 240000 && original < 241400) code = source500dd0(code); }
        view.setInt32(24, code, true); view.setInt32(36, type, true);
      }
    } else {
      requestedPreviewVariant = before[2] === 0 ? 1 : 0; view.setInt32(80, requestedPreviewVariant, true);
      normalizedCode = prepareCharacterPreviewRecord(record);
    }
    const after = [view.getInt32(24, true), view.getInt32(36, true), view.getInt32(80, true)];
    return Object.freeze({ recordBytes: record, changed: before.some((n, i) => n !== after[i]), previewPrepared: action >= 5,
      normalizedCode, requestedPreviewVariant, nativeAction: action, previewPixels: 'unmodeled' });
  } catch (error) { record.fill(0); throw error; }
}
export function legacyGameVersionUpgradeCapability(category, generation) {
  const c = integer(category) & 255; integer(generation, -1, 4);
  if (generation < 2) return Object.freeze({ available: false, reason: 'LEGACY_CHARACTER_UPGRADE_CONTENT', requestKind: null });
  if (c === 0 || c === 2) return Object.freeze({ available: true, reason: null, requestKind: 2 });
  if (generation >= 3 && (c === 5 || c === 6)) return Object.freeze({ available: true, reason: null, requestKind: 4 });
  return Object.freeze({ available: false, reason: c === 7 && generation >= 3 ? 'LEGACY_CHARACTER_UPGRADE_MATERIAL' : 'LEGACY_CHARACTER_UPGRADE_CATEGORY', requestKind: null });
}
export function createLegacyGameVersionUpgradeCommand(category, generation) {
  const capability = legacyGameVersionUpgradeCapability(category, generation); if (!capability.available) fail(capability.reason);
  const text = generation === 2 ? 'abcdefg' : capability.requestKind === 2 ? '20031229_20' : '20031229_30';
  return Object.freeze({ operationId: LEGACY_GAME_CHARACTER_OPTIONS_PROFILE.upgradeRequest, arguments: Object.freeze([capability.requestKind, Uint8Array.from(text, c => c.charCodeAt(0))]) });
}

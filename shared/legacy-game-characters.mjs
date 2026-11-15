/** Fixed37c4 two-slot records and existing-character entry. Native UI/global reset and creation/deletion remain separate. */
import { splitLegacyGameStateFields as fields, unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal } from './legacy-game-state.mjs';
import { legacyGameGraphicMetadata } from './legacy-game-graphics.mjs';
import { prepareCharacterPreviewRecord } from './legacy-game-character-codes.mjs';
import { legacyGameCharacterOptionPolicy,transformLegacyGameCharacterOption,legacyGameVersionUpgradeCapability,createLegacyGameVersionUpgradeCommand,LEGACY_GAME_CHARACTER_OPTIONS_PROFILE } from './legacy-game-character-options.mjs';
import { createLegacyGameCharacterDraft, LEGACY_GAME_CHARACTER_CREATION_PROFILE } from './legacy-game-character-creation.mjs';

export const LEGACY_GAME_CHARACTER_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-characters-v1', slots: 2, recordBytes: 148, maximumBytes: 32760,
  query: 'send-004f86e0', listReply: 'receive-00567c3c', category: 'receive-00567c20',
  enter: 'send-004f8650', enterReply: 'receive-00567c40', timeoutMilliseconds: 600001,
  previewPixels: 'unmodeled', currentVersionCompatibility: 'unverified', officialAcceptance: 'unverified',
});
export class LegacyGameCharacterError extends Error {
  constructor(code) { super('Character data requires the bounded legacy source profile.'); this.name = 'LegacyGameCharacterError'; this.code = code; }
}
const fail = code => { throw new LegacyGameCharacterError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const byteLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const zero = bytes => Uint8Array.prototype.fill.call(bytes, 0);
function owned(value, maximum = 32760) {
  try {
    if (!(value instanceof Uint8Array)) fail('LEGACY_CHARACTER_BYTES');
    const n = Reflect.apply(lengthOf, value, []);
    Reflect.apply(byteLength, Reflect.apply(bufferOf, value, []), []);
    if (n > maximum) fail('LEGACY_CHARACTER_BYTES');
    return new Uint8Array(value);
  } catch { fail('LEGACY_CHARACTER_BYTES'); }
}
const cPrefix = bytes => { const at = bytes.indexOf(0); return at < 0 ? bytes : bytes.subarray(0, at); };
function integer(value, low = -0x80000000, high = 0x7fffffff) {
  if (!Number.isInteger(value) || value < low || value > high) fail('LEGACY_CHARACTER_INTEGER');
  return value;
}
function args(value, count) {
  if (!Array.isArray(value) || value.length !== count) fail('LEGACY_CHARACTER_ARGUMENTS');
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = Object.getOwnPropertyDescriptor(value, String(i));
    if (!d || !Object.hasOwn(d, 'value')) fail('LEGACY_CHARACTER_ARGUMENTS'); out.push(d.value);
  }
  return out;
}
const token = (row, number, cap) => row[number - 1]?.subarray(0, cap) ?? new Uint8Array();
const nativeInteger = (row, number) => { const selected = token(row, number, 127); return selected.length ? decimal(selected) : -1; };
const numericFields = [[2, 24], [4, 40], [5, 44], [6, 48], [7, 52], [8, 56], [13, 20], [15, 76], [17, 80], [18, 28], [19, 32]];
export function decodeLegacyGameCharacterList(value) {
  const raw = owned(value), records = [new Uint8Array(148), new Uint8Array(148)]; let applied = 0, ignored = 0, fallbacks = 0;
  try {
    const outer = fields(raw);
    for (let pair = 0; pair < 2; pair++) {
      let inner;
      try {
        inner = unescape(token(outer, pair * 2 + 2, 1023));
        const row = fields(inner), slot = nativeInteger(row, 1);
        if (slot !== 0 && slot !== 1) { ignored++; continue; }
        const record = records[slot], view = new DataView(record.buffer); zero(record);
        let name = cPrefix(token(outer, pair * 2 + 1, 1023));
        if (name.length > 16) { name = new Uint8Array([63, 63, 63]); fallbacks++; }
        record.set(name, 0);
        for (const [field, offset] of numericFields) view.setInt32(offset, nativeInteger(row, field), true);
        view.setInt16(18, nativeInteger(row, 3), true);
        for (let field = 9; field <= 12; field++) view.setInt32(60 + (field - 9) * 4, Math.trunc(nativeInteger(row, field) / 10), true);
        record.set(cPrefix(token(row, 16, 63)), 84); applied++;
      } finally { if (inner) zero(inner); }
    }
    return Object.freeze({ profile: LEGACY_GAME_CHARACTER_PROFILE.id, records: Object.freeze(records), applied, ignored, nameFallbacks: fallbacks });
  } catch (error) { for (const record of records) zero(record); throw error; }
  finally { zero(raw); }
}
const probes = Object.freeze([0x3c39f, 0x3bd9f, 0x5727, 0x56c4, 0x55f2]);
export function detectLegacyGameCharacterContent(graphics) {
  for (let i = 0; i < probes.length; i++) if (legacyGameGraphicMetadata(graphics, probes[i]).index !== 0) return 4 - i;
  return -1;
}
export function legacyGameCharacterPolicy(category, generation) {
  const c = integer(category) & 255; integer(generation, -1, 4);
  const allowed = c === 1 || !((generation < 2 && c > 4) || (generation < 1 && c > 2) || (generation < 3 && c > 6) || (generation < 4 && c > 7));
  const auxiliary = c !== 1 && ((generation >= 1 && (c === 0 || c === 2)) || (generation >= 3 && (c === 5 || c === 6)) || (generation === 4 && c === 7));
  return Object.freeze({ category: c, generation, allowed, nativeAuxiliaryOption: auxiliary });
}
export function prepareLegacyGameCharacterPreview(value) {
  const record = owned(value, 148);
  if (record.length !== 148) { zero(record); fail('LEGACY_CHARACTER_RECORD'); }
  const normalizedCode = prepareCharacterPreviewRecord(record);
  return Object.freeze({ recordBytes: record, normalizedCode, previewPixels: 'unmodeled' });
}
function slotCopy(bytes, slot, normalizedCode, category) {
  const copy = bytes.slice(), view = new DataView(copy.buffer), values = {};
  for (const [field, offset] of numericFields) values['field-' + field] = view.getInt32(offset, true);
  values['field-3'] = view.getInt16(18, true);
  for (let field = 9; field <= 12; field++) values['field-' + field] = view.getInt32(60 + (field - 9) * 4, true);
  return Object.freeze({ slot, present: copy[0] !== 0, nameBytes: cPrefix(copy.subarray(0, 17)).slice(),
    field16Bytes: cPrefix(copy.subarray(84, 148)).slice(), values: Object.freeze(values), normalizedPreviewCode: normalizedCode,
    options: legacyGameCharacterOptionPolicy(category, copy[0] !== 0, view.getInt32(80, true)), recordBytes: copy, previewPixels: 'unmodeled' });
}
export function createLegacyGameCharacterFlow(input) {
  let d; try { d = Object.getOwnPropertyDescriptors(input); } catch { fail('LEGACY_CHARACTER_INPUT'); }
  if (!input || typeof input !== 'object' || Reflect.ownKeys(d).length !== 1 || !Object.hasOwn(d.graphics ?? {}, 'value')) fail('LEGACY_CHARACTER_INPUT');
  const graphics = d.graphics.value; legacyGameGraphicMetadata(graphics, 0);
  let records = [new Uint8Array(148), new Uint8Array(148)], previewCodes = [null, null];
  let state = 'idle', main = 3, phase = 0, category = 0, generation = null, auxiliary = false, armed = false;
  let ack = 0, listSent = false, listResult = 0, entrySent = false, entryGood = false, origin = null, result = 0;
  let selected = null, errorCode = null, errorBytes = 0, entered = false, nativeGameFlag = false, ignored = 0, requests = 0;
  let draft = null, creationArguments = null, creationVariant = 0, creationSent = false, creationGood = false;
  let created = 0, creationResult = null;
  let lastAppearanceAction = null, upgradePending = false, upgradeReply = null, upgradeKind = null, upgradeReplies = 0;
  const active = () => { if (state === 'closed') fail('LEGACY_CHARACTER_CLOSED'); };
  const clearRecords = () => { for (const row of records) zero(row); previewCodes = [null, null]; };
  function resetListing() { main = 3; phase = 0; state = 'initializing'; listSent = false; listResult = 0; origin = null; auxiliary = false; generation = null; armed = false; lastAppearanceAction = null; }
  function inspect() {
    const capability = legacyGameVersionUpgradeCapability(category, generation ?? -1);
    return Object.freeze({ profile: LEGACY_GAME_CHARACTER_PROFILE.id, state, nativeMainPhase: main, nativeSubphase: phase,
      category, contentGeneration: generation, nativeAuxiliaryOption: auxiliary, menuArmed: armed, nativeAckState: ack,
      nativeResult: result, selectedSlot: selected, presentSlots: records.filter(r => r[0] !== 0).length,
      sourceEnterComplete: entered, nativeGameFlag, errorCode, errorDetailBytes: errorBytes, ignoredReplies: ignored, requests,
      creation: draft?.inspect() ?? null, sourceCreateCompletions: created, sourceCreationResult: creationResult,
      lastAppearanceAction, versionUpgrade: Object.freeze({ enabled: armed && auxiliary && capability.available, requestSupported: capability.available, reason: capability.reason,
        requestKind: upgradeKind ?? capability.requestKind, pending: upgradePending, replyByte: upgradeReply, sourceReplies: upgradeReplies }),
      pendingRequest: listSent && main === 3 && phase === 1 && ack === 1 ? 'list' : entrySent && main === 6 && ack === 1 ? 'enter' : creationSent && main === 4 && phase === 31 && ack === 1 ? 'create' : upgradePending ? 'version-upgrade' : null,
      requiresPolling: !['idle', 'closed', 'choosing', 'creating', 'creation-error', 'upgrade-success', 'upgrade-error', 'entered', 'failed', 'blocked-content'].includes(state),
      nativeFullWorldReset: 'unmodeled', officialAcceptance: 'unverified', currentVersionCompatibility: 'unverified' });
  }
  function rejected(code, nativeResult, sourcePhase) {
    state = 'failed'; errorCode = code; result = nativeResult; phase = sourcePhase; armed = false;
  }
  return Object.freeze({ inspect,
    begin() { active(); if (state !== 'idle') fail('LEGACY_CHARACTER_ALREADY_STARTED'); state = 'initializing'; main = 3; phase = 0; return inspect(); },
    observe(operationId, supplied) {
      active();
      if (operationId === LEGACY_GAME_CHARACTER_PROFILE.category) { const a = args(supplied, 1); category = integer(a[0]) & 255; draft?.setCategory(category); return true; }
      if (operationId === LEGACY_GAME_CHARACTER_OPTIONS_PROFILE.upgradeReply) {
        if (main !== 13 || !upgradePending) { ignored++; return true; }
        const a = args(supplied, 1); upgradeReply = integer(a[0]) & 255; upgradeReplies++; upgradePending = false;
        phase = upgradeReply === 0 ? 100 : 200; state = 'preparing-upgrade-result'; return true;
      }
      if (operationId === LEGACY_GAME_CHARACTER_CREATION_PROFILE.reply) {
        if (main !== 4 || phase !== 31 || !creationSent || ack !== 1) { ignored++; return true; }
        const a = args(supplied, 3), returnedField = integer(a[1]), raw = owned(a[0]); let detail;
        try {
          detail = owned(a[2]); const text = cPrefix(raw);
          creationGood = text.length === 10 && [...text].every((b, i) => b === 'successful'.charCodeAt(i)); ack = 2;
          if (creationGood) { const view = new DataView(records[selected].buffer); view.setInt32(76, returnedField, true); view.setInt32(80, creationVariant, true); }
        } finally { zero(raw); if (detail) zero(detail); }
        return true;
      }
      if (operationId === LEGACY_GAME_CHARACTER_PROFILE.listReply) {
        if (main !== 3 || phase !== 1 || !listSent || ack !== 1) { ignored++; return true; }
        const a = args(supplied, 2), status = integer(a[0]), raw = owned(a[1]);
        try {
          if (status === 0) { const decoded = decodeLegacyGameCharacterList(raw); clearRecords(); records = [...decoded.records]; listResult = 1; }
          else { const text = cPrefix(raw); listResult = text.length === 12 && [...text].every((b, i) => b === 'OUTOFSERVICE'.charCodeAt(i)) ? 2 : 0; }
          ack = 2;
        } finally { zero(raw); }
        return true;
      }
      if (operationId === LEGACY_GAME_CHARACTER_PROFILE.enterReply) {
        if (main !== 6 || !entrySent || ack !== 1) { ignored++; return true; }
        const a = args(supplied, 2), raw = owned(a[0]), detail = owned(a[1]);
        try { const text = cPrefix(raw); entryGood = text.length === 10 && [...text].every((b, i) => b === 'successful'.charCodeAt(i)); ack = 2;
          if (entryGood) nativeGameFlag = true; else errorBytes = cPrefix(detail).length;
        } finally { zero(raw); zero(detail); }
        return true;
      }
      return false;
    },
    remainingMilliseconds(tick) {
      active(); const now = integer(tick, 0, 0xffffffff);
      if (main === 13) return null;
      return origin !== null && ack === 1 ? Math.max(0, 600001 - ((now - origin) >>> 0)) : null;
    },
    advance(tick, connected = true) {
      active(); const now = integer(tick, 0, 0xffffffff); if (typeof connected !== 'boolean') fail('LEGACY_CHARACTER_CONNECTED');
      if (state === 'idle') fail('LEGACY_CHARACTER_NOT_STARTED');
      const commands = []; let effect = null;
      if (state === 'failed' || state === 'blocked-content' || state === 'entered') return Object.freeze({ commands: Object.freeze(commands), effect, snapshot: inspect() });
      if (main === 3) {
        if (phase === 0) { category = 0; phase = 1; state = 'listing'; }
        else if (phase === 1) {
          if (!listSent) { clearRecords(); listSent = true; ack = 1; listResult = 0; origin = now; requests++; commands.push(Object.freeze({ operationId: LEGACY_GAME_CHARACTER_PROFILE.query, arguments: Object.freeze([]) })); }
          else if (ack === 2) { ack = 0; result = listResult === 1 ? 1 : listResult === 2 ? -3 : -2;
            if (result === 1) { phase = 9; state = 'preparing'; } else rejected(listResult === 2 ? 'LEGACY_CHARACTER_OUT_OF_SERVICE' : 'LEGACY_CHARACTER_LIST_REJECTED', result, listResult === 2 ? 2 : 4);
          } else if (((now - origin) >>> 0) >= 600001) rejected('LEGACY_CHARACTER_LIST_TIMEOUT', -1, 4);
        } else if (phase === 9) {
          generation = detectLegacyGameCharacterContent(graphics); const policy = legacyGameCharacterPolicy(category, generation); auxiliary = policy.nativeAuxiliaryOption;
          if (!policy.allowed) { state = 'blocked-content'; errorCode = 'LEGACY_CHARACTER_CONTENT'; phase = 19; }
          else phase = 10;
        } else if (phase === 10) {
          const next = [];
          try { for (const row of records) next.push(prepareLegacyGameCharacterPreview(row)); }
          catch (error) { for (const row of next) zero(row.recordBytes); throw error; }
          clearRecords(); records = next.map(r => r.recordBytes); previewCodes = next.map(r => r.normalizedCode); phase = 11;
        } else if (phase === 11) { armed = true; state = 'choosing'; }
      } else if (main === 4) {
        if (phase === 0) { phase = 3; state = 'creating'; }
        else if (phase === 30) {
          phase = 31; state = 'waiting-creation'; ack = 1; origin = now; creationSent = true; requests++;
          effect = Object.freeze({ kind: 'native-creation-profile-boundary', selectedSlot: selected, profilePersistence: 'unmodeled' });
          commands.push(Object.freeze({ operationId: LEGACY_GAME_CHARACTER_CREATION_PROFILE.request, arguments: creationArguments })); creationArguments = null;
        } else if (phase === 31) {
          if (ack === 2) {
            ack = 0; result = creationGood ? 1 : -2; creationResult = result;
            if (creationGood) { created++; resetListing(); }
            else { phase = 101; state = 'creation-error'; errorCode = 'LEGACY_CHARACTER_CREATE_REJECTED'; }
          } else if (((now - origin) >>> 0) >= 600001) { result = -1; creationResult = -1; phase = 101; state = 'creation-error'; errorCode = 'LEGACY_CHARACTER_CREATE_TIMEOUT'; }
        }
      } else if (main === 13) {
        if (phase === 0 || phase === 1) { phase = 2; state = 'preparing-upgrade'; }
        else if (phase === 2) {
          const capability = legacyGameVersionUpgradeCapability(category, generation);
          if (!capability.available) { errorCode = capability.reason; phase = 202; state = 'preparing-upgrade-result'; }
          else { const command = createLegacyGameVersionUpgradeCommand(category, generation); upgradeKind = command.arguments[0]; commands.push(command); requests++; upgradePending = true; phase = 3; state = 'waiting-upgrade'; }
        } else if (phase === 3) { phase = 4; state = 'waiting-upgrade'; }
        else if (phase === 100 || phase === 200 || phase === 202) { const successful = phase === 100; phase++; state = successful ? 'upgrade-success' : 'upgrade-error'; }
      } else if (main === 5) { main = 6; phase = 0; effect = Object.freeze({ kind: 'native-entry-reset-boundary', selectedSlot: selected,
        selectedAppearanceCode: new DataView(records[selected].buffer).getInt32(24, true), fullNativeReset: 'unmodeled' }); }
      else if (main === 6) {
        if (!entrySent) {
          const view = new DataView(records[selected].buffer); entrySent = true; entryGood = false; ack = 1; result = 0; origin = now; phase = 1; state = 'waiting-entry'; requests++;
          commands.push(Object.freeze({ operationId: LEGACY_GAME_CHARACTER_PROFILE.enter, arguments: Object.freeze([view.getInt32(76, true), view.getInt32(80, true), view.getInt32(24, true)]) }));
        } else if (connected) {
          if (ack === 2) { ack = 0; result = entryGood ? 1 : -2;
            if (entryGood) { nativeGameFlag = true; entered = true; main = 9; phase = 0; state = 'entered'; }
            else rejected('LEGACY_CHARACTER_ENTER_REJECTED', -2, 100);
          } else if (((now - origin) >>> 0) >= 600001) rejected('LEGACY_CHARACTER_ENTER_TIMEOUT', -1, 100);
        }
      }
      return Object.freeze({ commands: Object.freeze(commands), effect, snapshot: inspect() });
    },
    select(slot) {
      active(); integer(slot, 0, 1);
      if (state !== 'choosing' || !armed) fail('LEGACY_CHARACTER_NOT_SELECTABLE');
      if (!records[slot][0]) fail('LEGACY_CHARACTER_EMPTY_SLOT');
      selected = slot; armed = false; main = 5; phase = 0; state = 'preparing-entry'; return inspect();
    },
    changeAppearance(slot, action) {
      active(); integer(slot, 0, 1); if (state !== 'choosing' || !armed) fail('LEGACY_CHARACTER_NOT_SELECTABLE');
      const change = transformLegacyGameCharacterOption(records[slot], category, action);
      zero(records[slot]); records[slot] = change.recordBytes; if (change.previewPrepared) previewCodes[slot] = change.normalizedCode;
      lastAppearanceAction = Object.freeze({ slot, action: change.nativeAction, changed: change.changed, previewPrepared: change.previewPrepared, requestedPreviewVariant: change.requestedPreviewVariant });
      return inspect();
    },
    beginVersionUpgrade() {
      active(); if (state !== 'choosing' || !armed) fail('LEGACY_CHARACTER_NOT_SELECTABLE');
      if (!auxiliary) fail('LEGACY_CHARACTER_UPGRADE_UNAVAILABLE');
      const capability = legacyGameVersionUpgradeCapability(category, generation); if (!capability.available) fail(capability.reason);
      main = 13; phase = 0; armed = false; state = 'preparing-upgrade'; upgradePending = false; upgradeReply = null; upgradeKind = null; errorCode = null; return inspect();
    },
    retryVersionUpgrade() {
      active(); if (state !== 'upgrade-error') fail('LEGACY_CHARACTER_UPGRADE_STATE');
      phase = 1; state = 'preparing-upgrade'; upgradePending = false; upgradeReply = null; errorCode = null; return inspect();
    },
    acknowledgeVersionUpgrade() {
      active(); if (state !== 'upgrade-success') fail('LEGACY_CHARACTER_UPGRADE_STATE'); resetListing(); return inspect();
    },
    beginCreation(slot) {
      active(); integer(slot, 0, 1);
      if (state !== 'choosing' || !armed) fail('LEGACY_CHARACTER_NOT_SELECTABLE');
      if (records[slot][0]) fail('LEGACY_CHARACTER_SLOT_OCCUPIED');
      draft = createLegacyGameCharacterDraft(category); selected = slot; armed = false; main = 4; phase = 0;
      creationSent = false; creationResult = null; state = 'preparing-creation'; errorCode = null; return inspect();
    },
    creationAction(action, value) {
      active();
      if (state === 'creation-error' && action === 'dismiss-error') { main = 3; phase = 10; state = 'preparing'; errorCode = null; return inspect(); }
      if (state !== 'creating' || !draft) fail('LEGACY_CHARACTER_NOT_CREATING');
      if (action === 'cancel' && phase === 3) { draft.close(); draft = null; main = 3; phase = 10; state = 'preparing'; return inspect(); }
      draft.update(action, value, records.map(r => r.subarray(0, 17)));
      phase = draft.inspect().state === 'appearance' ? 3 : 12; return inspect();
    },
    confirmCreation() {
      active(); if (state !== 'creating' || !draft || phase !== 12) fail('LEGACY_CHARACTER_NOT_CREATING');
      const command = draft.prepare(selected, records.map(r => r.subarray(0, 17)));
      creationArguments = command.arguments; creationVariant = command.nativeVariant; draft.close(); draft = null;
      zero(records[selected]); creationSent = false; creationGood = false; creationResult = null; result = 0; ack = 0;
      main = 4; phase = 30; state = 'preparing-creation'; return inspect();
    },
    copyCreation() { active(); return draft?.copy() ?? null; },
    copySlots() { active(); return Object.freeze(records.map((r, slot) => slotCopy(r, slot, previewCodes[slot], category))); },
    close() { if (state === 'closed') return; clearRecords(); draft?.close(); draft = null; if (creationArguments) for (const value of creationArguments) if (value instanceof Uint8Array) zero(value); creationArguments = null; upgradePending = false; ack = 0; armed = false; state = 'closed'; },
  });
}

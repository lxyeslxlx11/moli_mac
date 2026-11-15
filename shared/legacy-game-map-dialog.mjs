/** Q?m text and NPC services with the shared /1I response route. */
import { readLegacyGameStateDecimal, splitLegacyGameStateFields, unescapeLegacyGameInnerField } from './legacy-game-state.mjs';
import { readLegacyGameMapDialogGraphics } from './legacy-game-map-dialog-graphics.mjs';
import { createLegacyGameMapAppearance, copyLegacyGameMapAppearance, adjustLegacyGameMapAppearance } from './legacy-game-map-appearance.mjs';
import {
  legacyGameFeedBoxMode, legacyGameMapBankModes, readLegacyGameMapBank, updateLegacyGameMapBank, prepareLegacyGameMapBankAction,
  inspectLegacyGameMapBank, copyLegacyGameMapBank, clearLegacyGameMapBank,
} from './legacy-game-map-bank.mjs';
import {
  canFeedLegacyGameFamilyPet, legacyGameFamilyPetMode, legacyGameFamilyPetNameBytes,
  readLegacyGameFamilyPet,
} from './legacy-game-map-family-pet.mjs';
import {
  legacyGameMapNpcServiceKinds, readLegacyGameMapNpcService, copyLegacyGameMapNpcService, clearLegacyGameMapNpcService,
} from './legacy-game-map-npc-services.mjs';
import {
  legacyGamePetTrainingSteps, readLegacyGamePetTraining, legacyGamePetTrainingStale, prepareLegacyGamePetTraining,
  copyLegacyGamePetTraining, clearLegacyGamePetTraining,
} from './legacy-game-map-pet-training.mjs';
import {
  legacyGameMapShopDirections, readLegacyGameMapShop, clearLegacyGameMapShop, copyLegacyGameMapShop, quoteLegacyGameMapShop,
} from './legacy-game-map-shop.mjs';

const pairMode = 0x23;
const appearanceMode = 0x24;
const illustratedMode = 0x25;
const pairFieldBytes = 46;
const replyTextBytes = 254;
const textModes = [0, 1, 2, 10, 11, pairMode];
const treatmentMode = 0x13;
const treatmentAll = 9;
const boardMode = 0x15;
const boardPageButtons = [0x10, 0x20];
const boardColumns = 70;
const boardTextBytes = 2 * boardColumns;
const replacingSequences = [0x146, 0x147, 0x171, 0x184, 0x185, 0x186];
const buttonBits = [1, 2, 4, 8, 16, 32];
const escapes = { 10: 110, 44: 99, 92: 121, 124: 122 };

function fail(code) {
  const error = new Error('The requested map dialog action is unavailable.');
  error.code = code;
  throw error;
}

function linesFor(bytes, columns, limit) {
  const lines = [];
  let start = 0, at = 0;
  while (at < bytes.length && lines.length < limit) {
    const first = bytes[at];
    const newline = first === 10 || first === 13;
    const size = first >= 128 ? 2 : 1;
    if (at + size > bytes.length) break;
    if (newline || at - start + size > columns) {
      lines.push(bytes.slice(start, at));
      if (newline) at++;
      start = at;
      continue;
    }
    at += size;
    if (at - start === columns) {
      lines.push(bytes.slice(start, at));
      start = at;
    }
  }
  if (lines.length < limit && start < at) lines.push(bytes.slice(start, at));
  return lines;
}

function textLayout(mode, buttons, bytes) {
  const text = unescapeLegacyGameInnerField(bytes);
  try {
    const pair = mode === pairMode;
    const input = pair || mode === 1 || mode === 11;
    const wide = mode === 10 || mode === 11;
    const headerEnd = mode === 2 ? text.indexOf(10) : -1;
    if (mode === 2 && headerEnd < 0) return null;
    const header = mode === 2 ? readLegacyGameStateDecimal(text.subarray(0, headerEnd)) : 0;
    const width = wide ? 576 : 448, height = wide ? 432 : 240;
    const content = readLegacyGameMapDialogGraphics(text.subarray(headerEnd + 1), width, height);
    const availableHeight = height - (input && !pair ? 28 : 0) - (buttons !== 0 ? 24 : 0) - 32;
    const lines = linesFor(content.text, wide ? 60 : 46, Math.floor(availableHeight / (mode === 2 ? 20 : 16)));
    return { input, header, lines, ...(pair ? { inputCount: 2, inputByteLimit: pairFieldBytes } : {}),
      ...(content.illustration ? { illustration: content.illustration } : {}) };
  } finally {
    text.fill(0);
  }
}

function appearanceLayout(bytes, readAppearanceContext) {
  const [portrait, name, body] = splitLegacyGameStateFields(bytes);
  if (!portrait?.length || !name || !body) return null;
  const { code, category } = readAppearanceContext();
  const draft = createLegacyGameMapAppearance(code, category);
  if (!draft) return null;
  const graphicResource = readLegacyGameStateDecimal(portrait.subarray(0, 127));
  const title = unescapeLegacyGameInnerField(name.subarray(0, 16));
  const text = unescapeLegacyGameInnerField(body.subarray(0, 1023));
  try {
    return { appearance: { draft, graphicResource, title }, lines: linesFor(text, 45, 2) };
  } finally {
    text.fill(0);
  }
}

function illustratedLayout(bytes, mask) {
  const [resource, body] = splitLegacyGameStateFields(bytes);
  if (!resource?.length || !body) return null;
  const resourceId = readLegacyGameStateDecimal(resource.subarray(0, 127));
  const graphics = Object.freeze([Object.freeze({ resourceId, facing: 0, x: 86, y: 98 })]);
  const text = unescapeLegacyGameInnerField(body.subarray(0, 1000));
  try {
    return { graphicReply: resourceId, lines: linesFor(text, 32, mask ? 8 : 10),
      illustration: Object.freeze({ width: 448, height: 240, graphics }) };
  } finally {
    text.fill(0);
  }
}

function boardLayout(bytes) {
  const decoded = unescapeLegacyGameInnerField(bytes);
  try {
    const fields = splitLegacyGameStateFields(decoded);
    if ((fields.length - 1) % 5 === 1 && fields.at(-1).length === 0) fields.pop();
    const count = (fields.length - 1) / 5;
    if (!Number.isInteger(count) || count > 4) return null;
    const entries = [];
    for (let row = 0; row < count; row++) {
      const [graphic, seconds, deleteFlag, author, body] = fields.slice(1 + row * 5, 6 + row * 5);
      const [graphicResource, timestamp, removable] =
        [graphic, seconds, deleteFlag].map(field => readLegacyGameStateDecimal(field.subarray(0, 127)));
      const message = unescapeLegacyGameInnerField(body.subarray(0, 0x2ff));
      const lines = message.length <= boardTextBytes ? linesFor(message, boardColumns, 3) : [];
      message.fill(0);
      let name = unescapeLegacyGameInnerField(author.subarray(0, 0x2ff));
      if (name.length > 16) {
        name.fill(0);
        name = Uint8Array.of(63, 63, 63);
      }
      if (graphicResource || timestamp > 0 || removable || name.length || lines.length) {
        entries.push({ row, graphicResource, timestamp: timestamp > 0 ? timestamp : null, canDelete: removable !== 0, name, lines });
      }
    }
    return { title: fields[0].slice(0, 16), entries };
  } finally {
    decoded.fill(0);
  }
}

function treatmentLayout(bytes) {
  const fields = splitLegacyGameStateFields(bytes), rows = [];
  let allFee = 0, totalInjury = 0;
  for (let row = 0; row < 6; row++) {
    const [levelField, injuryField, nameField, feeField] = fields.slice(row * 4, row * 4 + 4);
    if (!levelField?.length) break;
    const level = readLegacyGameStateDecimal(levelField.subarray(0, 127));
    if (level < 0) break;
    if (!injuryField?.length || !nameField || !feeField?.length) {
      for (const entry of rows) entry.name.fill(0);
      return null;
    }
    const injury = readLegacyGameStateDecimal(injuryField.subarray(0, 127));
    const fee = readLegacyGameStateDecimal(feeField.subarray(0, 127));
    allFee = (allFee + fee) | 0;
    totalInjury = (totalInjury + injury) | 0;
    if (level === 0) continue;
    let name = unescapeLegacyGameInnerField(nameField.subarray(0, 255));
    if (name.length > 16) {
      name.fill(0);
      name = Uint8Array.of(63, 63, 63);
    }
    const injuryGrade = injury === 0 ? 0 : injury < 26 ? 1 : injury < 51 ? 2 : injury < 76 ? 3 : 4;
    rows.push({ choice: row + 3, level, injury, injuryGrade, fee, name });
  }
  return { rows, allFee, totalInjury, allChoice: treatmentAll };
}

function encodeReplyText(bytes, truncate = false) {
  if (!(bytes instanceof Uint8Array) || bytes.length > replyTextBytes || bytes.includes(0)) fail('LEGACY_GAME_DIALOG_TEXT');
  const encoded = [];
  try {
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      const escaped = Object.hasOwn(escapes, b);
      if (encoded.length + (b >= 128 || escaped ? 2 : 1) > replyTextBytes) {
        if (truncate) break;
        fail('LEGACY_GAME_DIALOG_TEXT');
      }
      if (b >= 128) {
        if (b === 255 || i + 1 >= bytes.length) fail('LEGACY_GAME_DIALOG_TEXT');
        encoded.push(b, bytes[++i]);
      } else if (escaped) {
        encoded.push(92, escapes[b]);
      } else {
        encoded.push(b);
      }
    }
    return Uint8Array.from(encoded);
  } finally {
    encoded.fill(0);
  }
}

function validPairField(field) {
  let meaningful = false;
  for (let at = 0; at < field.length; at++) {
    const first = field[at];
    if (first >= 128) {
      const second = field[++at];
      if (first !== 129 || second !== 64) meaningful = true;
    } else {
      if (first === 44 || first === 92 || first === 124) return false;
      if (first !== 32) meaningful = true;
    }
  }
  return meaningful;
}
export { encodeReplyText as encodeLegacyGameInnerReplyText, validPairField as isValidLegacyGameReplyField };

function pairedReply(text, confirm) {
  if (text === null && !confirm) text = [new Uint8Array(), new Uint8Array()];
  if (!Array.isArray(text) || text.length !== 2) fail('LEGACY_GAME_DIALOG_TEXT');
  const encoded = [];
  let joined;
  try {
    for (const field of text) {
      if (!(field instanceof Uint8Array) || field.length > pairFieldBytes || (confirm && !validPairField(field))) {
        fail('LEGACY_GAME_DIALOG_TEXT');
      }
      encoded.push(encodeReplyText(field));
    }
    const [first, second] = encoded;
    joined = new Uint8Array(first.length + 1 + second.length);
    joined.set(first);
    joined[first.length] = 124;
    joined.set(second, first.length + 1);
    return encodeReplyText(joined, true);
  } finally {
    for (const field of encoded) field.fill(0);
    joined?.fill(0);
  }
}

function boardReply({ board, buttons }, button, choice, text) {
  if (button === 1 && choice === null) {
    if (!(text instanceof Uint8Array) || text.length === 0 || text.length > boardTextBytes ||
        text.some(byte => byte < 32 && byte !== 13)) fail('LEGACY_GAME_BOARD_TEXT');
    const lines = linesFor(text, boardColumns, 3);
    for (const line of lines) line.fill(0);
    if (lines.length > 2) fail('LEGACY_GAME_BOARD_TEXT');
    return encodeReplyText(text);
  }
  if (text === null) {
    if (button === 0x40 && board.entries.some(entry => entry.row === choice && entry.canDelete)) return Uint8Array.of(48 + choice);
    if (choice === null && boardPageButtons.includes(button) && buttons.includes(button)) return new Uint8Array();
  }
  fail('LEGACY_GAME_DIALOG_BUTTON');
}

function replyCommand({ sequence, actorId }, button, bytes, x, y) {
  return Object.freeze({ operationId: 'send-004f8240', arguments: Object.freeze([x, y, sequence, actorId, button, bytes]) });
}

function needsCloseReply(dialog) {
  return !!dialog.familyPet || (!!dialog.bank && dialog.mode !== legacyGameFeedBoxMode);
}

function familyPetRename(name) {
  if (!(name instanceof Uint8Array) || name.length > legacyGameFamilyPetNameBytes ||
      name.some(byte => byte < 32 || byte === 127)) fail('LEGACY_GAME_FAMILY_PET_NAME');
  const escaped = encodeReplyText(name), body = new Uint8Array(2 + escaped.length);
  try {
    body.set([78, 124]);
    body.set(escaped, 2);
    return encodeReplyText(body);
  } finally {
    escaped.fill(0);
    body.fill(0);
  }
}

export function createLegacyGameMapDialog(readShopContext, readSkillContext, readPetTrainingContext, readAppearanceContext,
  readFamilyPetPermissions = () => 0) {
  let current = null, revision = 0, petTrainingProgress = null;
  function clearPetTrainingProgress() {
    petTrainingProgress?.lesson.name.fill(0);
    petTrainingProgress?.pet?.name.fill(0);
    petTrainingProgress = null;
  }
  function clear() {
    if (current?.bank) clearLegacyGameMapBank(current.bank);
    else if (current?.familyPet) {
      current.familyPet.title.fill(0);
      for (const line of current.familyPet.lines) line.fill(0);
    }
    else if (current?.shop) clearLegacyGameMapShop(current.shop);
    else if (current?.npcService) clearLegacyGameMapNpcService(current.npcService);
    else if (current?.petTraining) clearLegacyGamePetTraining(current.petTraining);
    else if (current?.board) {
      current.board.title.fill(0);
      for (const entry of current.board.entries) {
        entry.name.fill(0);
        for (const line of entry.lines) line.fill(0);
      }
    } else if (current?.treatment) {
      for (const row of current.treatment.rows) row.name.fill(0);
    } else if (current) {
      current.appearance?.title.fill(0);
      for (const line of current.lines) line.fill(0);
    }
    current = null;
    clearPetTrainingProgress();
  }
  function familyPetStatus({ pending }) {
    const permissions = readFamilyPetPermissions();
    const waiting = pending !== null &&
      (pending.kind === 'rename' || readShopContext().slots[pending.slot].revision === pending.revision);
    return Object.freeze({ canFeed: !!(permissions & 4), canRename: !!(permissions & 128), pending: waiting });
  }
  function inspect() {
    if (!current) return null;
    const { lines, shop, board, treatment, illustration, npcService, petTraining, appearance, bank, familyPet, ...info } = current;
    if (bank) return Object.freeze({ ...info, bank: inspectLegacyGameMapBank(bank) });
    if (familyPet) return Object.freeze({ ...info, familyPet: familyPetStatus(familyPet) });
    if (petTraining) {
      const { gold, roster } = readPetTrainingContext();
      return Object.freeze({ ...info, petTrainingStep: petTraining.step, gold, petCount: roster.length,
        petTrainingStale: legacyGamePetTrainingStale(petTraining, petTrainingProgress, roster) });
    }
    if (npcService) {
      const { kind, rosterVersion } = npcService;
      if (kind !== 'learn' && kind !== 'forget') return Object.freeze({ ...info, npcServiceKind: kind });
      const { gold, capacity, roster } = readSkillContext();
      return Object.freeze({ ...info, npcServiceKind: kind, skillUsed: roster.usedSlotUnits, skillCapacity: capacity,
        ...(kind === 'learn' ? { gold } : { skillListStale: roster.version !== rosterVersion }) });
    }
    if (shop) return Object.freeze({ ...info, shopDirection: shop.direction, shopRows: shop.rows.length });
    if (treatment) return Object.freeze({ ...info, treatmentRows: treatment.rows.length });
    if (board) return Object.freeze({ ...info, boardEntries: board.entries.length });
    if (appearance) return Object.freeze({ ...info, appearance: Object.freeze({
      ...copyLegacyGameMapAppearance(appearance.draft), graphicResource: appearance.graphicResource,
    }) });
    return Object.freeze(illustration ? { ...info, graphicsCount: illustration.graphics.length } : info);
  }
  function selected(expected) {
    if (!current || current.revision !== expected) fail('LEGACY_GAME_DIALOG_STALE');
    return current;
  }
  function response(expected, button, bytes, x, y, nextTraining = null) {
    const dialog = selected(expected);
    const command = replyCommand(dialog, button, bytes, x, y);
    clear();
    if (nextTraining) petTrainingProgress = { ...nextTraining, actorId: dialog.actorId, mode: dialog.mode };
    return command;
  }
  function quoteShop(expected, selections) {
    const { shop } = selected(expected);
    if (!shop) fail('LEGACY_GAME_SHOP_CONTEXT');
    const quote = quoteLegacyGameMapShop(shop, selections, readShopContext);
    selected(expected);
    return quote;
  }
  return Object.freeze({
    active: () => current !== null,
    inspect,
    copy() {
      if (!current) return null;
      if (current.bank) return Object.freeze({ ...inspect(), bank: copyLegacyGameMapBank(current.bank) });
      if (current.familyPet) {
        const { title, lines } = current.familyPet, info = inspect();
        return Object.freeze({ ...info, familyPet: Object.freeze({
          ...info.familyPet, title: title.slice(), lines: Object.freeze(lines.map(line => line.slice())),
        }) });
      }
      if (current.petTraining) return Object.freeze({ ...inspect(),
        petTraining: copyLegacyGamePetTraining(current.petTraining, petTrainingProgress) });
      if (current.npcService) return Object.freeze({ ...inspect(), npcService: copyLegacyGameMapNpcService(current.npcService) });
      if (current.shop) return Object.freeze({ ...inspect(), shop: copyLegacyGameMapShop(current.shop, readShopContext()) });
      if (current.board) {
        const { title, entries } = current.board;
        return Object.freeze({ ...inspect(), board: Object.freeze({
          title: title.slice(), entries: Object.freeze(entries.map(entry => Object.freeze({
            ...entry, name: entry.name.slice(), lines: Object.freeze(entry.lines.map(line => line.slice())),
          }))),
        }) });
      }
      if (current.treatment) {
        const { rows, ...treatment } = current.treatment;
        return Object.freeze({ ...inspect(), gold: readShopContext().gold, treatment: Object.freeze({
          ...treatment, rows: Object.freeze(rows.map(row => Object.freeze({ ...row, name: row.name.slice() }))),
        }) });
      }
      const { illustration, lines, appearance } = current;
      const info = inspect();
      return Object.freeze({ ...info, lines: Object.freeze(lines.map(line => line.slice())),
        ...(illustration ? { illustration } : {}),
        ...(appearance ? { appearance: Object.freeze({ ...info.appearance, title: appearance.title.slice() }) } : {}) });
    },
    receive([mode, mask, sequence, actorId, bytes], readClosePosition) {
      let closeRequest;
      const result = status => Object.freeze({ kind: 'map-dialog', status,
        ...(closeRequest ? { requests: Object.freeze([closeRequest]) } : {}) });
      function closeForServer() {
        if (current && needsCloseReply(current)) {
          const position = readClosePosition();
          if (position) closeRequest = replyCommand(current, 0, Uint8Array.of(67), ...position);
        }
        clear();
      }
      if (mask === -1) {
        const owner = current ?? petTrainingProgress;
        if (!owner || owner.mode !== mode || owner.actorId !== actorId) return result('close-mismatch');
        closeForServer();
        return result('server-closed');
      }
      if (current && mode !== legacyGameFamilyPetMode && replacingSequences.includes(sequence)) closeForServer();
      if (current?.bank && current.mode === mode) {
        if (current.actorId !== actorId) return result('existing-dialog');
        return result(updateLegacyGameMapBank(current.bank, bytes, linesFor) ? 'bank-updated' : 'unsupported-content');
      }
      if (mode === legacyGameFamilyPetMode && (!current || current.familyPet)) {
        if (current && current.actorId !== actorId) return result('existing-dialog');
        const familyPet = readLegacyGameFamilyPet(bytes, linesFor);
        if (!familyPet) return result('unsupported-content');
        const opening = current?.sequence ?? sequence, status = current ? 'family-pet-updated' : 'opened';
        clear();
        current = { revision: ++revision, mode, sequence: opening, actorId, buttons: Object.freeze([]), familyPet };
        return result(status);
      }
      const refreshBoard = current?.mode === boardMode && mode === boardMode;
      if (current && !refreshBoard) return result('existing-dialog');
      if (Object.hasOwn(legacyGamePetTrainingSteps, mode)) {
        const step = legacyGamePetTrainingSteps[mode];
        if (step !== 'offer' && (petTrainingProgress?.step !== step || petTrainingProgress.actorId !== actorId)) {
          return result('pet-training-context-required');
        }
        const petTraining = readLegacyGamePetTraining(mode, bytes, linesFor, petTrainingProgress, readPetTrainingContext().roster);
        if (!petTraining) return result('unsupported-content');
        if (step === 'offer') clearPetTrainingProgress();
        current = { revision: ++revision, mode, sequence, actorId, buttons: Object.freeze([2]), petTraining };
        return result('opened');
      }
      clearPetTrainingProgress();
      if (legacyGameMapBankModes.includes(mode)) {
        const bank = readLegacyGameMapBank(bytes, linesFor, mode === legacyGameFeedBoxMode);
        if (!bank) return result('unsupported-content');
        current = { revision: ++revision, mode, sequence, actorId, buttons: Object.freeze([]), bank };
        return result('opened');
      }
      if (Object.hasOwn(legacyGameMapNpcServiceKinds, mode)) {
        const npcService = readLegacyGameMapNpcService(legacyGameMapNpcServiceKinds[mode], bytes, linesFor, readSkillContext);
        if (!npcService) return result('unsupported-content');
        current = { revision: ++revision, mode, sequence, actorId, buttons: Object.freeze([]), npcService };
        return result('opened');
      }
      if (mode === treatmentMode) {
        const treatment = treatmentLayout(bytes);
        if (!treatment) return result('unsupported-content');
        current = { revision: ++revision, mode, sequence, actorId, buttons: Object.freeze([2]), treatment };
        return result('opened');
      }
      if (mode === boardMode) {
        const board = boardLayout(bytes);
        if (!board) return result('unsupported-content');
        const buttons = Object.freeze([1, ...boardPageButtons.filter(bit => (mask & bit) !== 0)]);
        clear();
        current = { revision: ++revision, mode, sequence, actorId, buttons, board };
        return result(refreshBoard ? 'refreshed' : 'opened');
      }
      if (Object.hasOwn(legacyGameMapShopDirections, mode)) {
        const direction = legacyGameMapShopDirections[mode];
        const fromInventory = direction === 'sell' || direction === 'appraise' || direction === 'repair';
        const shop = readLegacyGameMapShop(mode, bytes, fromInventory ? readShopContext().slots : null);
        if (!shop) return result('unsupported-content');
        current = { revision: ++revision, mode, sequence, actorId, buttons: Object.freeze([2]), shop };
        return result('opened');
      }
      let layout;
      if (mode === appearanceMode) layout = appearanceLayout(bytes, readAppearanceContext);
      else if (mode === illustratedMode) layout = illustratedLayout(bytes, mask);
      else if (textModes.includes(mode)) layout = textLayout(mode, mask, bytes);
      else return result('unsupported-mode');
      if (!layout) return result('unsupported-content');
      const buttons = Object.freeze(mode === appearanceMode ? [1] : buttonBits.filter(bit => (mask & bit) !== 0));
      current = { revision: ++revision, mode, sequence, actorId, buttons, ...layout };
      return result('opened');
    },
    reply(expected, button, choice, text, x, y) {
      const dialog = selected(expected);
      if (dialog.bank || dialog.familyPet) {
        if (button !== 0 || choice !== null || text !== null) fail('LEGACY_GAME_DIALOG_BUTTON');
        if (needsCloseReply(dialog)) return response(expected, 0, Uint8Array.of(67), x, y);
        clear();
        return null;
      }
      if (dialog.petTraining) {
        if (text !== null) fail('LEGACY_GAME_DIALOG_CHOICE');
        const { body, next } = prepareLegacyGamePetTraining(dialog.petTraining, petTrainingProgress,
          button, choice, readPetTrainingContext());
        if (body === null) { clear(); return null; }
        return response(expected, button, Uint8Array.from(body, c => c.charCodeAt(0)), x, y, next);
      }
      if (dialog.npcService) {
        const service = dialog.npcService;
        if (button !== 0 || text !== null) fail('LEGACY_GAME_DIALOG_CHOICE');
        const option = service.choices.find(option => option.id === choice);
        if (!option) {
          if (!service.rows?.some(row => row.id === choice)) fail('LEGACY_GAME_DIALOG_CHOICE');
          if (readSkillContext().roster.version !== service.rosterVersion) fail('LEGACY_GAME_SKILL_LIST_STALE');
        }
        if (option && !option.sends) { clear(); return null; }
        return response(expected, 0, Uint8Array.from(String(choice), c => c.charCodeAt(0)), x, y);
      }
      if (dialog.board) return response(expected, button, boardReply(dialog, button, choice, text), x, y);
      if (dialog.treatment) {
        if (text !== null) fail('LEGACY_GAME_DIALOG_BUTTON');
        if (button === 2 && choice === null) return response(expected, 2, new Uint8Array(), x, y);
        if (button !== 0 || (choice !== treatmentAll && !dialog.treatment.rows.some(row => row.choice === choice))) {
          fail('LEGACY_GAME_DIALOG_CHOICE');
        }
        return response(expected, 0, Uint8Array.of(48 + choice), x, y);
      }
      if (dialog.appearance) {
        if (text !== null) fail('LEGACY_GAME_DIALOG_CHOICE');
        const { draft } = dialog.appearance;
        if (button === 0 && adjustLegacyGameMapAppearance(draft, choice)) return null;
        if (button !== 1 || choice !== null) fail('LEGACY_GAME_DIALOG_CHOICE');
        const { appearanceCode } = copyLegacyGameMapAppearance(draft);
        return response(expected, 1, Uint8Array.from(String(appearanceCode), c => c.charCodeAt(0)), x, y);
      }
      const { mode, buttons, lines, header, input } = dialog;
      let value;
      if (button === 0) {
        if (mode !== 2 || header <= 0 || !Number.isInteger(choice) || choice < 1 || !lines[header + choice - 1]?.length || text !== null) {
          fail('LEGACY_GAME_DIALOG_CHOICE');
        }
        value = String(choice);
      } else {
        if (!buttons.includes(button) || choice !== null || (!input && text !== null)) fail('LEGACY_GAME_DIALOG_BUTTON');
        if (mode === pairMode) return response(expected, button, pairedReply(text, (button & 1) !== 0), x, y);
        if (mode === illustratedMode) value = String(dialog.graphicReply);
        if (mode === 2) value = String((-header) | 0);
      }
      const bytes = input && text !== null ? encodeReplyText(text) : Uint8Array.from(value ?? '', c => c.charCodeAt(0));
      return response(expected, button, bytes, x, y);
    },
    quoteShop,
    prepareFamilyPet(expected, action, x, y) {
      const dialog = selected(expected), pet = dialog.familyPet;
      if (!pet || !action) fail('LEGACY_GAME_FAMILY_PET_CONTEXT');
      const status = familyPetStatus(pet);
      if (status.pending) fail('LEGACY_GAME_FAMILY_PET_BUSY');
      if (action.kind === 'rename') {
        if (!status.canRename) fail('LEGACY_GAME_FAMILY_PET_PERMISSION');
        const command = replyCommand(dialog, 0, familyPetRename(action.name), x, y);
        pet.pending = { kind: 'rename' };
        return command;
      }
      if (action.kind !== 'feed' || !Number.isInteger(action.slot) || action.slot < 8 || action.slot >= 28) {
        fail('LEGACY_GAME_FAMILY_PET_SLOT');
      }
      const row = readShopContext().slots[action.slot];
      if (row.revision !== action.revision) fail('LEGACY_GAME_FAMILY_PET_STALE');
      if (!canFeedLegacyGameFamilyPet(row, status.canFeed)) fail('LEGACY_GAME_FAMILY_PET_PERMISSION');
      const body = Uint8Array.from('I|' + action.slot, char => char.charCodeAt(0));
      pet.pending = { kind: 'feed', slot: action.slot, revision: row.revision };
      return replyCommand(dialog, 0, body, x, y);
    },
    prepareBank(expected, action, x, y) {
      const dialog = selected(expected);
      if (!dialog.bank) fail('LEGACY_GAME_BANK_CONTEXT');
      const body = prepareLegacyGameMapBankAction(dialog.bank, action, readShopContext, readPetTrainingContext);
      try {
        return replyCommand(dialog, 0, encodeReplyText(body), x, y);
      } finally {
        body.fill(0);
      }
    },
    submitShop(expected, selections, x, y) {
      const quote = quoteShop(expected, selections);
      const slotOnly = quote.direction === 'appraise' || quote.direction === 'repair';
      const fields = quote.lines.map(({ key, quantity }) => slotOnly ? String(key) : `${key}|${quantity}`);
      const text = Uint8Array.from(fields.join('|'), c => c.charCodeAt(0));
      let bytes;
      try {
        bytes = encodeReplyText(text);
        return response(expected, 0, bytes, x, y);
      } catch (error) {
        bytes?.fill(0);
        throw error;
      } finally {
        text.fill(0);
      }
    },
    dismiss(expected) {
      const dialog = selected(expected);
      if (needsCloseReply(dialog)) fail(dialog.bank ? 'LEGACY_GAME_BANK_CLOSE' : 'LEGACY_GAME_FAMILY_PET_CLOSE');
      clear();
    },
    clear,
  });
}

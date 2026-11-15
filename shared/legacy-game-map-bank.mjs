/** Storage records and transfer requests for the fixed 37c4 window 0x29. */
import { splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape } from './legacy-game-state.mjs';

export const legacyGameFeedBoxMode = 0x22;
export const legacyGameMapBankModes = Object.freeze([0x17, 0x21, legacyGameFeedBoxMode]);
export const legacyGameBankGoldLimit = 1000000;
const itemSlots = 20;
const petSlots = 5;
const itemFields = 6;
const petFields = 33;
const firstPetField = 1 + itemSlots * itemFields;
const balanceField = firstPetField + petSlots * petFields;
const storageBase = 100;
const bagBase = 8;
const empty = new Uint8Array();

function integer(field) {
  if (!field?.length) return -1;
  if (field.length > 127) return null;
  const text = String.fromCharCode(...field).trim();
  if (!/^[+-]?\d+$/.test(text)) return null;
  const value = Number(text);
  return value >= -0x80000000 && value <= 0x7fffffff ? value : null;
}

function name(field, limit) {
  const bytes = unescape(field?.subarray(0, 1023) ?? empty);
  if (bytes.length <= limit) return bytes;
  bytes.fill(0);
  return Uint8Array.of(63, 63, 63);
}

function item(fields, at, linesFor) {
  const graphicResource = integer(fields[at]);
  if (graphicResource === null) return undefined;
  if (graphicResource <= 0) return null;
  const quantity = integer(fields[at + 1]);
  if (quantity === null) return undefined;
  const text = unescape(fields[at + 5]?.subarray(0, 1023) ?? empty);
  try {
    return { graphicResource, quantity, name: name(fields[at + 3], 28),
      lines: linesFor(text, 32, 16) };
  } finally {
    text.fill(0);
  }
}

function pet(fields, at) {
  const value = integer(fields[at + 1]);
  if (value === null) return undefined;
  if (value < 0) return null;
  return { name: name(fields[at], 16) };
}

function wipe(record) {
  record?.name.fill(0);
  for (const line of record?.lines ?? []) line.fill(0);
}

function replace(rows, changes) {
  for (const [slot, row] of changes) {
    wipe(rows[slot]);
    rows[slot] = row;
  }
}

function delta(fields, limit, width, readRow) {
  const changes = [];
  for (let at = 1; at < fields.length; at += width + 1) {
    const slot = integer(fields[at]);
    if (slot === -1) break;
    const row = slot === null || slot < 0 || slot >= limit ? undefined : readRow(fields, at + 1);
    if (row === undefined || changes.length >= limit) {
      wipe(row);
      for (const [, staged] of changes) wipe(staged);
      return null;
    }
    changes.push([slot, row]);
  }
  return changes;
}

export function updateLegacyGameMapBank(bank, bytes, linesFor) {
  const fields = split(bytes);
  const operation = fields[0].length === 1 ? String.fromCharCode(fields[0][0]) : '';
  if (operation === 'A') {
    if (fields.length > balanceField + 2 || (fields.length === balanceField + 2 && fields.at(-1).length)) return null;
    const balance = integer(fields[balanceField]);
    if (balance === null) return null;
    const items = Array.from({ length: itemSlots }, (_, i) => item(fields, 1 + i * itemFields, linesFor));
    const pets = Array.from({ length: petSlots }, (_, i) => pet(fields, firstPetField + i * petFields));
    if (items.includes(undefined) || pets.includes(undefined)) {
      for (const row of [...items, ...pets]) wipe(row);
      return null;
    }
    for (const row of [...bank.items, ...bank.pets]) wipe(row);
    bank.items = items;
    bank.pets = pets;
    bank.balance = balance < 0 ? null : balance;
    bank.pending = null;
  } else if (operation === 'G') {
    const balance = integer(fields[1]);
    if (balance === null || balance < 0) return null;
    bank.balance = balance;
    if (bank.pending?.kind === 'G') bank.pending = null;
  } else if (operation === 'I' || operation === 'P') {
    const changes = operation === 'I' ? delta(fields, itemSlots, itemFields, (rows, at) => item(rows, at, linesFor))
      : delta(fields, petSlots, petFields, pet);
    if (!changes?.length) return null;
    replace(operation === 'I' ? bank.items : bank.pets, changes);
    if (bank.pending?.kind === operation && changes.some(([slot]) => bank.pending.slots.includes(slot))) bank.pending = null;
  } else return null;
  bank.version++;
  return operation;
}

export function readLegacyGameMapBank(bytes, linesFor, feedBox) {
  if (bytes[0] !== 65) return null;
  const bank = { items: [], pets: [], version: 0, balance: null, pending: null, feedBox };
  return updateLegacyGameMapBank(bank, bytes, linesFor) === 'A' ? bank : null;
}

export function clearLegacyGameMapBank(bank) {
  for (const row of [...bank.items, ...bank.pets]) wipe(row);
}

export function inspectLegacyGameMapBank(bank) {
  return Object.freeze({ version: bank.version, balance: bank.balance, pending: bank.pending !== null });
}

export function copyLegacyGameMapBank(bank) {
  const copy = row => row ? Object.freeze({ ...row, name: row.name.slice(),
    ...(row.lines ? { lines: Object.freeze(row.lines.map(line => line.slice())) } : {}) }) : null;
  return Object.freeze({ ...inspectLegacyGameMapBank(bank), items: Object.freeze(bank.items.map(copy)),
    pets: Object.freeze(bank.pets.map(copy)) });
}

function fail(code) {
  const error = new Error('The storage operation is unavailable.');
  error.code = code;
  throw error;
}

function validSlot(slot, ownBase, count) {
  return Number.isInteger(slot) && ((slot >= ownBase && slot < ownBase + count) ||
    (slot >= storageBase && slot < storageBase + count));
}

export function canStoreLegacyGameFeedBoxItem(row) {
  return row.canStore && row.category !== 0x26 && row.category !== 0x34;
}

export function prepareLegacyGameMapBankAction(bank, action, readInventory, readPets) {
  if (!action || action.version !== bank.version) fail('LEGACY_GAME_BANK_STALE');
  if (bank.pending) fail('LEGACY_GAME_BANK_BUSY');
  const { kind, from, to, amount } = action;
  if (bank.feedBox && kind !== 'item') fail('LEGACY_GAME_BANK_ACTION');
  let body, pending;
  if (kind === 'deposit-gold' || kind === 'withdraw-gold') {
    const { gold } = readInventory();
    if (action.wallet !== gold || gold === null || bank.balance === null) fail('LEGACY_GAME_BANK_STALE');
    const deposit = kind === 'deposit-gold';
    const maximum = deposit ? Math.min(gold, legacyGameBankGoldLimit - bank.balance) :
      Math.min(bank.balance, legacyGameBankGoldLimit - gold);
    if (!Number.isInteger(amount) || amount < 1 || amount > maximum) fail('LEGACY_GAME_BANK_AMOUNT');
    body = `${deposit ? 'G' : 'D'}|${amount}`;
    pending = { kind: 'G' };
  } else if (kind === 'item' || kind === 'pet') {
    const items = kind === 'item';
    const ownBase = items ? bagBase : 0, count = items ? itemSlots : petSlots;
    if (!validSlot(from, ownBase, count) || !validSlot(to, ownBase, count) || from === to ||
        Math.max(from, to) < storageBase) fail('LEGACY_GAME_BANK_SLOT');
    const pets = items ? null : readPets();
    const own = items ? readInventory().slots : pets.roster;
    const source = from >= storageBase ? (items ? bank.items : bank.pets)[from - storageBase] :
      items ? own[from] : own.find(row => row.slot === from);
    if (!source || (items && from < storageBase &&
        !(bank.feedBox ? canStoreLegacyGameFeedBoxItem(source) : source.canStore))) fail('LEGACY_GAME_BANK_SLOT');
    if (items) {
      const destination = to >= storageBase ? bank.items[to - storageBase] : own[to];
      if (from < storageBase && action.fromRevision !== source.revision ||
          to < storageBase && action.toRevision !== destination.revision) fail('LEGACY_GAME_BANK_STALE');
      if (amount !== -1 && (!Number.isInteger(amount) || amount < 1 || amount > source.quantity ||
          (to >= storageBase ? destination !== null : destination.present))) fail('LEGACY_GAME_BANK_AMOUNT');
      body = `I|${from}|${to}|${amount}`;
    } else {
      if (action.petVersion !== pets.version) fail('LEGACY_GAME_BANK_STALE');
      body = `P|${from}|${to}`;
    }
    pending = { kind: items ? 'I' : 'P', slots: [from, to].filter(slot => slot >= storageBase).map(slot => slot - storageBase) };
  } else fail('LEGACY_GAME_BANK_ACTION');
  bank.pending = pending;
  return Uint8Array.from(body, char => char.charCodeAt(0));
}

/** Ordinary player trade, with source positions and separate local and peer phases. */
import {
  splitLegacyGameStateFields as split,
  unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal,
} from './legacy-game-state.mjs';

const incoming = Object.freeze({
  '0x4f46c0': 'candidates', '0x4f46f0': 'open', '0x4f4740': 'peer-offer',
  '0x4f4770': 'gold', '0x4f47a0': 'items', '0x4f47d0': 'pet',
  '0x4f4800': 'skills', '0x4f4830': 'peer-withdrawal', '0x4f4870': 'result',
});
const itemSlots = 20, petSlots = 5;
const number = field => field?.length ? decimal(field.subarray(0, 127)) : -1;
const text = (field, limit = 255) => field ? unescape(field.subarray(0, limit)) : new Uint8Array();
const clearBytes = row => {
  row?.nameBytes?.fill(0);
  row?.descriptionBytes?.fill(0);
  row?.nicknameBytes?.fill(0);
  for (const skill of row?.skills ?? []) skill.fill(0);
};
const command = (producer, ...args) => Object.freeze({ operationId: 'send-004f' + producer, arguments: Object.freeze(args) });
const status = value => Object.freeze({ kind: 'player-trade', status: value });

export function isLegacyGamePlayerTradeConsumer(consumer) {
  return Object.hasOwn(incoming, consumer);
}

function fail(code) {
  const error = new Error('The requested player trade action is unavailable.');
  error.code = code;
  throw error;
}

function name(field, limit = 16) {
  const bytes = text(field, field.length);
  if (bytes.length <= limit) return bytes;
  bytes.fill(0);
  return Uint8Array.of(63, 63, 63);
}

function remoteItems(bytes) {
  if (!bytes.length) return [];
  const fields = split(bytes), width = 14;
  if (fields.length % width === 1 && !fields.at(-1).length) fields.pop();
  const count = fields.length / width;
  if (!Number.isInteger(count) || count > itemSlots) return null;
  const positions = Array.from({ length: count }, (_, i) => number(fields[i * width]));
  if (positions.some(row => row < 0 || row >= itemSlots) || new Set(positions).size !== count) return null;
  return positions.map((row, i) => {
    const field = fields.slice(i * width, (i + 1) * width);
    return {
      row, nameBytes: name(field[1].subarray(0, 255), 28), descriptionBytes: text(field[3], 0x2ff),
      graphicResource: number(field[4]), flags: number(field[9]), exchangeCode: number(field[10]),
      quantity: number(field[12]), nicknameBytes: name(field[13].subarray(0, 255)),
    };
  });
}

function remotePet(row, bytes) {
  const fields = split(bytes), graphicResource = number(fields[1]);
  if (graphicResource < 0) return null;
  return {
    row, graphicResource, nameBytes: name(fields[0].subarray(0, 255)),
    nicknameBytes: fields[12] ? name(fields[12].subarray(0, 255)) : new Uint8Array(),
    values: Object.freeze(Array.from({ length: 23 }, (_, i) => i === 0 || i === 12 ? null : number(fields[i]))),
    skills: [],
  };
}

function copyRemote(row) {
  return Object.freeze({
    ...row, nameBytes: row.nameBytes.slice(), nicknameBytes: row.nicknameBytes.slice(),
    ...(row.skills ? { skills: Object.freeze(row.skills.map(skill => skill.slice())) } : { descriptionBytes: row.descriptionBytes.slice() }),
  });
}

function wipeOffer(offer) {
  if (!offer) return;
  for (const row of [...offer.items, ...offer.pets]) row.nameBytes.fill(0);
}

function offerStillCurrent(offer, { items, pets, gold }) {
  if (!offer) return false;
  return (offer.gold === 0 || (gold !== null && offer.gold <= gold)) &&
    offer.items.every(({ slot, revision }) => items[slot]?.canTrade && items[slot].revision === revision) &&
    (!offer.pets.length || (offer.petVersion === pets.version && offer.pets.every(({ slot }) => pets.records[slot]?.present)));
}

function offerRows(selected, available, limit, eligible, revisionFor) {
  if (!Array.isArray(selected) || selected.length > limit) fail('LEGACY_GAME_TRADE_SELECTION');
  const seen = new Set();
  return selected.map(selection => {
    const { slot, revision } = selection ?? {};
    const row = Number.isInteger(slot) ? available[slot] : null;
    if (!row || seen.has(slot) || !eligible(row) || revisionFor(row) !== revision) {
      fail('LEGACY_GAME_TRADE_SELECTION');
    }
    seen.add(slot);
    const label = row.nicknameBytes?.length ? row.nicknameBytes : row.nameBytes;
    return { slot, revision, nameBytes: label.slice(), quantity: row.quantity ?? null };
  });
}

function slotPairs(rows) {
  return Uint8Array.from(rows.map(({ slot }, row) => slot + '|' + row).join('|'), char => char.charCodeAt(0));
}

export function createLegacyGamePlayerTrade(readContext) {
  let panel = null, resultCode = null, revision = 0, lastTick = 0;

  function clearPeer() {
    for (const row of [...panel.items, ...panel.pets]) clearBytes(row);
    panel.items.fill(null);
    panel.pets.fill(null);
    panel.remoteGold = 0;
  }

  function clear() {
    if (panel?.kind === 'candidates') for (const row of panel.candidates) clearBytes(row);
    if (panel?.kind === 'open') {
      panel.partner.fill(0);
      clearPeer();
      wipeOffer(panel.offer);
    }
    panel = null;
    resultCode = null;
  }

  function open(partner) {
    clear();
    panel = { kind: 'open', session: ++revision, partner, localPhase: 0, remotePhase: 0, offer: null,
      items: Array(itemSlots).fill(null), pets: Array(petSlots).fill(null), remoteGold: 0 };
  }

  function inspect() {
    if (!panel) return resultCode === null ? null : Object.freeze({ kind: 'ended', revision, resultCode });
    const { kind, session, localPhase, remotePhase } = panel;
    return Object.freeze({ kind, session, revision, ...(kind === 'open' ? { localPhase, remotePhase } : {}) });
  }

  function receive(consumer, args) {
    const action = incoming[consumer], [first, second] = args;
    if (action === 'candidates') {
      if (panel?.kind === 'open') return status('existing-trade');
      const candidates = split(first).slice(0, -1).slice(0, 10)
        .map((field, index) => ({ index, nameBytes: name(field.subarray(0, 255)) }));
      clear();
      panel = { kind: 'candidates', session: ++revision, candidates };
      return status('candidates');
    }
    if (action === 'open') {
      open(name(first));
      return status('opened');
    }
    if (panel?.kind !== 'open') return status('no-trade');
    switch (action) {
      case 'gold':
        if (first < 0) return status('invalid-gold');
        panel.remoteGold = first;
        break;
      case 'items': {
        const rows = remoteItems(first);
        if (!rows) return status('invalid-items');
        for (const row of rows) {
          clearBytes(panel.items[row.row]);
          panel.items[row.row] = row;
        }
        break;
      }
      case 'pet':
        if (first < 0 || first >= petSlots) return status('invalid-pet');
        clearBytes(panel.pets[first]);
        panel.pets[first] = remotePet(first, second);
        break;
      case 'skills': {
        const pet = panel.pets[first];
        if (!pet) return status('no-pet');
        for (const skill of pet.skills) skill.fill(0);
        pet.skills = split(second).slice(0, -1).slice(0, 10).map(field => name(field.subarray(0, 255), 24));
        break;
      }
      case 'peer-offer':
        panel.remotePhase = 1;
        break;
      case 'peer-withdrawal':
        clearPeer();
        panel.remotePhase = 0;
        if (panel.localPhase === 2) panel.localPhase = 1;
        break;
      case 'result':
        if (first === 1) panel.remotePhase = 2;
        else if (first === 0 || first === 2) {
          clear();
          resultCode = first;
          revision++;
          return status('ended');
        } else return status('invalid-result');
        break;
      default:
        return status('unsupported');
    }
    revision++;
    return status(action);
  }

  function prepare(action, expected, value, tick) {
    if (action === 'request') {
      if (panel) fail('LEGACY_GAME_TRADE_CONTEXT');
      if (((lastTick + 500) >>> 0) >= tick) fail('LEGACY_GAME_TRADE_COOLDOWN');
      resultCode = null;
      lastTick = tick;
      return command('7d30');
    }
    if (!panel || revision !== expected) fail('LEGACY_GAME_TRADE_STALE');
    if (panel.kind === 'candidates') {
      if (action === 'close') { clear(); return null; }
      const candidate = Number.isInteger(value) ? panel.candidates[value] : null;
      if (action !== 'select' || !candidate?.nameBytes.length) fail('LEGACY_GAME_TRADE_SELECTION');
      open(candidate.nameBytes.slice());
      return command('7d70', value);
    }
    switch (action) {
      case 'publish': {
        if (panel.localPhase !== 0) fail('LEGACY_GAME_TRADE_PHASE');
        const context = readContext(), gold = value?.gold;
        if (!Number.isInteger(gold) || gold < 0 || (gold > 0 && (context.gold === null || gold > context.gold))) {
          fail('LEGACY_GAME_TRADE_GOLD');
        }
        const items = offerRows(value.items, context.items, itemSlots, row => row.canTrade, row => row.revision);
        const pets = offerRows(value.pets, context.pets.records, petSlots, row => row.present, () => context.pets.version);
        wipeOffer(panel.offer);
        panel.offer = { items, pets, gold, petVersion: context.pets.version };
        panel.localPhase = 1;
        revision++;
        lastTick = tick;
        return command('7dc0', slotPairs(items), slotPairs(pets), gold);
      }
      case 'withdraw':
        if (panel.localPhase === 0) fail('LEGACY_GAME_TRADE_PHASE');
        panel.localPhase = 0;
        if (panel.remotePhase === 2) panel.remotePhase = 1;
        revision++;
        return command('7e50');
      case 'confirm':
        if (panel.localPhase !== 1 || panel.remotePhase < 1) fail('LEGACY_GAME_TRADE_PHASE');
        if (!offerStillCurrent(panel.offer, readContext())) fail('LEGACY_GAME_TRADE_OFFER_STALE');
        if (((lastTick + 500) >>> 0) >= tick) fail('LEGACY_GAME_TRADE_COOLDOWN');
        panel.localPhase = 2;
        revision++;
        lastTick = tick;
        return command('7e90', 1);
      case 'close':
        clear();
        return command('7e90', 0);
      default:
        fail('LEGACY_GAME_TRADE_CONTEXT');
    }
  }

  return Object.freeze({
    active: () => panel !== null, inspect, receive, prepare, clear,
    copy() {
      if (panel?.kind === 'candidates') return Object.freeze({
        ...inspect(), candidates: Object.freeze(panel.candidates.map(row => Object.freeze({ ...row, nameBytes: row.nameBytes.slice() }))),
      });
      if (panel?.kind !== 'open') return inspect();
      const context = readContext(), { items, pets, gold } = context;
      const copyOfferRows = rows => Object.freeze(rows.map(row => Object.freeze({ ...row, nameBytes: row.nameBytes.slice() })));
      return Object.freeze({
        ...inspect(), partner: panel.partner.slice(), gold, remoteGold: panel.remoteGold,
        availableItems: Object.freeze(items.filter(row => row.canTrade)),
        availablePets: Object.freeze(pets.records.filter(row => row.present).map(row => Object.freeze({
          slot: row.slot, revision: pets.version, nameBytes: row.nicknameBytes.length ? row.nicknameBytes : row.nameBytes,
        }))),
        remoteItems: Object.freeze(panel.items.filter(Boolean).map(copyRemote)),
        remotePets: Object.freeze(panel.pets.filter(Boolean).map(copyRemote)),
        offerStale: panel.localPhase !== 0 && !offerStillCurrent(panel.offer, context),
        offer: panel.offer ? Object.freeze({ gold: panel.offer.gold, items: copyOfferRows(panel.offer.items), pets: copyOfferRows(panel.offer.pets) }) : null,
      });
    },
  });
}

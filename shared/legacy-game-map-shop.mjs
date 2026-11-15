/** Ordinary shop rows and confirmation rules from the fixed 37c4 client. */
import { splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape } from './legacy-game-state.mjs';

const rowLimit = 20;
const purchaseLimit = 20;
const bagSlotCount = 20;
const saleGoldLimit = 1000000;
const textLimit = 0x2ff;
const conversionLimit = 999;

export const legacyGameMapShopDirections = Object.freeze({
  6: 'buy', 7: 'sell', 0x14: 'appraise', 0x16: 'repair', 0x1c: 'exchange', 0x1f: 'conversion',
});
const purchaseLayout = { headerSize: 5, rowSize: 6, graphic: 1, price: 2, description: 3 };
const saleLayout = { headerSize: 3, rowSize: 10, graphic: 2, price: 3, slot: 4, flags: 5, label: 6, description: 7 };
const serviceLayout = { headerSize: 2, rowSize: 7, graphic: 1, price: 2, slot: 3, flags: 4, label: 5, description: 6 };
const exchangeLayout = { headerSize: 7, rowSize: 5, graphic: 1, price: 2, description: 4 };
const layouts = { buy: purchaseLayout, sell: saleLayout, appraise: serviceLayout, repair: serviceLayout, exchange: exchangeLayout };

function fail(code) {
  const error = new Error('The requested shop order is unavailable.');
  error.code = code;
  throw error;
}

function number(field) {
  const text = field.length <= 127 ? String.fromCharCode(...field).trim() : '';
  if (!/^[+-]?\d+$/.test(text)) return null;
  const value = Number(text);
  return value >= -0x80000000 && value <= 0x7fffffff ? value : null;
}

function text(field, limit = textLimit) {
  return unescape(field.subarray(0, limit));
}

function readConversion(fields) {
  if (fields.length === 16 && fields[15].length === 0) fields.pop();
  if (fields.length !== 15) return null;
  const [variant, rate, itemCode, countLimit, quotaLimit, quotaCount] =
    [2, 7, 8, 11, 13, 14].map(index => fields[index].length ? number(fields[index]) : 0);
  if (variant === null || [rate, itemCode, countLimit, quotaLimit, quotaCount].some(value => value === null || value < 0)) return null;
  let name = text(fields[9], 0x300);
  if (name.length > 28) {
    name.fill(0);
    name = Uint8Array.of(63, 63, 63);
  }
  return {
    direction: 'conversion', portraitResource: number(fields[0]), title: text(fields[1], 16),
    messages: fields.slice(3, 7).map(field => text(field)),
    conversion: { variant, itemCode, countLimit, quotaLimit, quotaCount },
    rows: [{
      row: 0, slot: null, name, description: text(fields[10]),
      graphicResource: number(fields[12]), unitPrice: rate, available: true,
      canEquip: null, stackSize: null, slotRevision: null, displayCount: null, flags: 0, alternateLabel: null,
    }],
  };
}

export function readLegacyGameMapShop(mode, bytes, slots) {
  const direction = legacyGameMapShopDirections[mode];
  const fields = split(bytes);
  if (direction === 'conversion') return readConversion(fields);
  const buy = direction === 'buy', sell = direction === 'sell', exchange = direction === 'exchange';
  const purchase = buy || exchange;
  const layout = layouts[direction];
  const { headerSize, rowSize } = layout;
  if ((fields.length - headerSize) % rowSize === 1 && fields.at(-1).length === 0) fields.pop();
  const count = (fields.length - headerSize) / rowSize;
  if (!Number.isInteger(count) || count < 0 || count > rowLimit) return null;
  const currencyCode = exchange ? number(fields[5]) : null;
  if (exchange && (currencyCode === null || currencyCode < 0)) return null;

  const portraitResource = number(fields[0]), title = text(fields[1], 16);
  const messages = fields.slice(2, exchange ? 5 : headerSize).map(field => text(field));
  const rows = [], seenSlots = new Set();
  for (let row = 0; row < count; row++) {
    const field = fields.slice(headerSize + row * rowSize, headerSize + (row + 1) * rowSize);
    const slot = purchase ? null : number(field[layout.slot]);
    const bagItem = purchase ? null : slots[slot];
    if (!purchase && (!bagItem || bagItem.equipment || seenSlots.has(slot))) continue;
    if (!purchase) seenSlots.add(slot);

    let name = text(field[0]);
    if (name.length > 28) {
      name.fill(0);
      name = Uint8Array.of(63, 63, 63);
    }
    const availabilityField = buy ? field[4] : sell ? field[8] : null;
    const availability = availabilityField ? (number(availabilityField) ?? (availabilityField.length ? 0 : -1)) & 0xff : 1;
    const stack = purchase ? number(field[exchange ? 3 : 5]) : null;
    const stackSize = purchase ? (stack > 0 ? stack : exchange ? 1 : 2) : null;
    const flags = purchase ? 0 : number(field[layout.flags]) ?? 0;
    const tradeMaximum = buy ? purchaseLimit : sell ? Math.max(1, (availability << 24) >> 24) : 1;
    rows.push({
      row, slot, name, description: text(field[layout.description]),
      graphicResource: number(field[layout.graphic]), unitPrice: number(field[layout.price]),
      available: !sell || availability !== 0,
      canEquip: buy ? availability !== 0 : null,
      stackSize,
      maximum: exchange ? Math.min(0x7fffffff, bagSlotCount * stackSize) : tradeMaximum,
      slotRevision: bagItem?.present ? bagItem.revision : null,
      displayCount: sell ? number(field[1]) : null, flags,
      alternateLabel: !purchase && (flags & 0x100) ? text(field[layout.label]) : null,
    });
  }
  const shop = { direction, portraitResource, title, messages, rows };
  if (exchange) shop.currency = { code: currencyCode, label: text(fields[6], 28) };
  return shop;
}

export function clearLegacyGameMapShop(shop) {
  shop.title.fill(0);
  shop.currency?.label.fill(0);
  for (const message of shop.messages) message.fill(0);
  for (const row of shop.rows) {
    row.name.fill(0);
    row.description.fill(0);
    row.alternateLabel?.fill(0);
  }
}

function rowLimitFor(row, slots) {
  if (row.slot !== null) {
    const item = slots[row.slot];
    if (!item.present || row.slotRevision !== item.revision) return { maximum: 0, unavailable: 'slot-changed' };
  }
  if (!row.available || row.unitPrice === null || row.unitPrice < 0) return { maximum: 0, unavailable: 'unavailable' };
  const maximum = row.slot === null ? row.maximum : Math.min(row.maximum, Math.max(1, slots[row.slot].quantity));
  return { maximum, unavailable: null };
}

const freeBagSlots = slots => slots.filter(slot => !slot.equipment && !slot.present).length;

function exchangePayment(slots, code, total = 0) {
  let balance = 0, releasedBagSlots = 0, remaining = total;
  // Funds include equipment. Capacity only reuses fully spent bag stacks in slot order.
  for (const slot of slots) {
    if (!slot.present || slot.exchangeCode !== code || slot.quantity <= 0) continue;
    balance += slot.quantity;
    if (slot.equipment || remaining < 0) continue;
    remaining -= slot.quantity;
    if (remaining >= 0) releasedBagSlots++;
  }
  return { balance, releasedBagSlots };
}

function conversionAvailability(shop, gold, slots) {
  const { variant, itemCode, countLimit, quotaLimit, quotaCount } = shop.conversion;
  const rate = shop.rows[0].unitPrice, quota = variant === 0;
  const held = quota ? countLimit : exchangePayment(slots, itemCode).balance;
  let maximum = Math.min(conversionLimit, countLimit, quota ? quotaLimit - quotaCount : quotaCount);
  let unavailable = null;
  if (!quota) {
    if (held === 0) unavailable = 'LEGACY_GAME_SHOP_CONVERSION_ITEMS';
    else if (gold === null) unavailable = 'LEGACY_GAME_SHOP_BALANCE_UNKNOWN';
    else if (gold === 0) unavailable = 'LEGACY_GAME_SHOP_FUNDS';
    // The increment checks the converted value of the quantity before adding one.
    else if (rate > 0) maximum = Math.min(maximum, Math.ceil(gold / rate));
  }
  if (rate > 0) maximum = Math.min(maximum, Math.floor(0x7fffffff / rate));
  return { held, maximum: unavailable ? 0 : Math.max(0, maximum), unavailable };
}

export function copyLegacyGameMapShop(shop, { gold, slots }) {
  const currency = shop.currency && Object.freeze({
    ...shop.currency, label: shop.currency.label.slice(), balance: exchangePayment(slots, shop.currency.code).balance,
  });
  const conversion = shop.conversion && conversionAvailability(shop, gold, slots);
  return Object.freeze({
    ...shop, gold, freeBagSlots: freeBagSlots(slots), title: shop.title.slice(),
    ...(currency ? { currency } : {}),
    ...(conversion ? { conversion: Object.freeze({ ...shop.conversion, held: conversion.held }) } : {}),
    messages: Object.freeze(shop.messages.map(message => message.slice())),
    rows: Object.freeze(shop.rows.map(row => Object.freeze({
      ...row, ...(conversion ? { maximum: conversion.maximum, unavailable: conversion.unavailable } : rowLimitFor(row, slots)),
      name: row.name.slice(), description: row.description.slice(),
      alternateLabel: row.alternateLabel?.slice() ?? null,
    }))),
  });
}

export function quoteLegacyGameMapShop(shop, selections, readContext) {
  if (!Array.isArray(selections) || selections.length < 1 || selections.length > rowLimit) fail('LEGACY_GAME_SHOP_ORDER');
  const amounts = new Map();
  for (const selection of selections) {
    const { row, quantity } = selection ?? {};
    if (!Number.isInteger(row) || row < 0 || row >= rowLimit || !Number.isInteger(quantity) ||
        quantity < 1 || amounts.has(row)) fail('LEGACY_GAME_SHOP_ORDER');
    amounts.set(row, quantity);
  }
  const { gold, slots } = readContext();
  if (shop.conversion) {
    if (amounts.size !== 1 || !amounts.has(0)) fail('LEGACY_GAME_SHOP_ORDER');
    const quantity = amounts.get(0), { maximum, unavailable } = conversionAvailability(shop, gold, slots);
    if (unavailable) fail(unavailable);
    if (quantity > maximum) fail('LEGACY_GAME_SHOP_QUANTITY');
    const lines = Object.freeze([Object.freeze({ row: 0, key: 1, quantity })]);
    return Object.freeze({ direction: shop.direction, lines, total: quantity * shop.rows[0].unitPrice, requiredBagSlots: 0 });
  }
  const purchase = shop.direction === 'buy' || shop.direction === 'exchange';
  const sell = shop.direction === 'sell', lines = [];
  let total = 0, requiredBagSlots = 0;
  for (const row of shop.rows) {
    const quantity = amounts.get(row.row);
    if (quantity === undefined) continue;
    const limit = rowLimitFor(row, slots);
    if (limit.unavailable === 'slot-changed') fail('LEGACY_GAME_SHOP_SLOT_CHANGED');
    if (quantity > limit.maximum) fail('LEGACY_GAME_SHOP_QUANTITY');
    total += quantity * row.unitPrice;
    if (purchase) requiredBagSlots += Math.ceil(quantity / row.stackSize);
    lines.push(Object.freeze({ row: row.row, key: purchase ? row.row : row.slot, quantity }));
  }
  if (lines.length !== amounts.size) fail('LEGACY_GAME_SHOP_ORDER');
  const quote = { direction: shop.direction, lines: Object.freeze(lines), total, requiredBagSlots };
  if (shop.currency) {
    const { balance, releasedBagSlots } = exchangePayment(slots, shop.currency.code, total);
    if (!Number.isSafeInteger(total) || total > balance) fail('LEGACY_GAME_SHOP_EXCHANGE_FUNDS');
    if (requiredBagSlots > freeBagSlots(slots) + releasedBagSlots) fail('LEGACY_GAME_SHOP_SPACE');
    return Object.freeze({ ...quote, releasedBagSlots });
  }
  if (gold === null) fail('LEGACY_GAME_SHOP_BALANCE_UNKNOWN');
  if (!sell && total > gold) fail('LEGACY_GAME_SHOP_FUNDS');
  if (purchase && requiredBagSlots > freeBagSlots(slots)) fail('LEGACY_GAME_SHOP_SPACE');
  if (sell && gold + total > saleGoldLimit) fail('LEGACY_GAME_SHOP_GOLD_LIMIT');
  return Object.freeze(quote);
}

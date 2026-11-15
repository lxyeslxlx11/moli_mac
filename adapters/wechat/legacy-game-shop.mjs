/** Native Page order draft. Prices, limits and wire commands come from the shared shop owner. */
import { clearLegacyGameMapShop } from '../../shared/legacy-game-map-shop.mjs';

const actions = {
  buy: '购买', sell: '出售', appraise: '鉴定', repair: '修理', exchange: '兑换', conversion: '折算',
};
const notices = {
  LEGACY_GAME_SHOP_BALANCE_UNKNOWN: '等待服务器同步金币。',
  LEGACY_GAME_SHOP_FUNDS: '金币不足。',
  LEGACY_GAME_SHOP_EXCHANGE_FUNDS: '兑换物不足。',
  LEGACY_GAME_SHOP_CONVERSION_ITEMS: '等待匹配的持有物品。',
  LEGACY_GAME_SHOP_SPACE: '背包空位不足。',
  LEGACY_GAME_SHOP_GOLD_LIMIT: '出售后将超过金币上限。',
  LEGACY_GAME_SHOP_SLOT_CHANGED: '背包槽位已更新，请重新打开商店。',
  LEGACY_GAME_SHOP_QUANTITY: '请核对可交易的数量。',
  LEGACY_GAME_SHOP_ORDER: '请输入有效数量。',
};

function readOffer(client, revision, decode) {
  const dialog = client.copyMapDialog();
  const shop = dialog?.shop;
  if (!shop) return null;
  try {
    if (dialog.revision !== revision) return null;
    const { direction, currency, conversion } = shop;
    const action = actions[direction];
    const unit = currency ? decode(currency.label) || '兑换物' : '金币';
    const purchase = direction === 'buy' || direction === 'exchange';
    const service = direction === 'appraise' || direction === 'repair';
    let balance = currency ? '持有' + unit + ' ' + currency.balance : '持有金币 ' + (shop.gold ?? '待同步');
    if (conversion) {
      balance = conversion.variant === 0
        ? '限量 ' + conversion.held + ' · 配额 ' + conversion.quotaCount + '/' + conversion.quotaLimit
        : '持有物品 ' + conversion.held + ' · ' + balance;
    }
    const rows = shop.rows.map(row => {
      const name = (row.alternateLabel && decode(row.alternateLabel)) || decode(row.name) || '未命名物品';
      let details = '不可交易';
      if (row.unavailable === 'slot-changed') details = '槽位已更新';
      else if (row.unavailable) details = notices[row.unavailable] ?? details;
      else if (service) details = '费用 ' + row.unitPrice + ' 金币';
      else if (conversion) details = '折算比例 ' + row.unitPrice + ' · 最多 ' + row.maximum + ' 件';
      else details = '单价 ' + row.unitPrice + ' ' + unit + ' · 最多 ' + row.maximum + ' 件';
      if (row.canEquip === false) details += ' · 当前无法装备';
      return {
        row: row.row, name: row.slot === null ? name : name + ' · 背包槽 ' + (row.slot - 7),
        details, maximum: row.maximum, description: decode(row.description),
      };
    });
    return {
      direction, action, unit, purchase, service, conversion: !!conversion, rows,
      title: decode(shop.title) || action, balance, freeBagSlots: shop.freeBagSlots,
      messages: shop.messages.map((bytes, id) => ({ id, text: decode(bytes) }))
        .filter(row => row.text && (!conversion || row.id === 0)),
    };
  } finally {
    clearLegacyGameMapShop(shop);
  }
}

export function createWeChatShop({ client, revision, decode, notify }) {
  let offer = null, quote = null, review = null, notice = '';
  let inventoryRevision = null, gold = null, busy = false, closed = false;
  const amounts = new Map();
  function selections() {
    const order = [];
    for (const [row, text] of amounts) {
      if (!/^[0-9]{1,10}$/.test(text)) return null;
      const quantity = Number(text);
      if (quantity > 0) order.push({ row, quantity });
    }
    return order;
  }
  function reprice(order = selections()) {
    quote = null;
    notice = '';
    if (!order) notice = notices.LEGACY_GAME_SHOP_ORDER;
    else if (order.length) {
      try { quote = client.quoteMapShop(revision, order); }
      catch (error) { notice = notices[error?.code] ?? '无法核对订单。'; }
    }
  }
  function sync(nextRevision, nextGold) {
    if (closed || (offer && inventoryRevision === nextRevision && gold === nextGold)) return;
    offer = readOffer(client, revision, decode);
    inventoryRevision = nextRevision;
    gold = nextGold;
    const reviewed = review !== null;
    review = null;
    reprice();
    if (reviewed && quote) notice = '余额或背包已更新，请重新核对。';
  }
  function snapshot() {
    if (!offer) return null;
    const { rows, ...summary } = offer;
    return {
      ...summary, revision, busy, notice, reviewing: review !== null,
      canReview: !busy && review === null && !!quote, canConfirm: !busy && review !== null,
      rows: rows.map(row => ({
        ...row, quantity: amounts.get(row.row) ?? '0', selected: amounts.get(row.row) === '1',
      })),
      quote: quote && {
        total: quote.total, requiredBagSlots: quote.requiredBagSlots,
        releasedBagSlots: quote.releasedBagSlots ?? 0,
        lines: quote.lines.map(line => ({
          row: line.row, name: rows.find(row => row.row === line.row).name, quantity: line.quantity,
        })),
      },
    };
  }
  async function send(request) {
    busy = true;
    notify();
    try { await request(); return true; }
    catch (error) { notice = notices[error?.code] ?? '请求未完成。'; return false; }
    finally { busy = false; if (!closed) notify(); }
  }
  async function act(action, row, text) {
    if (closed || busy || !offer) return false;
    if (action === 'cancel') return send(() => client.replyMapDialog(revision, 2));
    if (action === 'confirm') {
      if (review === null) return false;
      const order = selections(), previous = review;
      reprice(order);
      if (quote && JSON.stringify(quote) === previous) return send(() => client.submitMapShop(revision, order));
      review = null;
      if (quote) notice = '报价已更新，请重新核对。';
      notify();
      return false;
    }
    if (action === 'back' && review !== null) {
      review = null;
      reprice();
    } else if (review !== null) {
      return false;
    } else if (action === 'review') {
      reprice();
      if (quote) review = JSON.stringify(quote);
      notify();
      return review !== null;
    } else if (action === 'clear') {
      amounts.clear();
      reprice();
    } else if (action === 'quantity' || action === 'toggle') {
      const entry = offer.rows.find(entry => entry.row === row);
      if (!entry || entry.maximum === 0 || offer.service !== (action === 'toggle')) return false;
      const quantity = action === 'toggle' ? (amounts.get(row) === '1' ? '' : '1') : text;
      if (typeof quantity !== 'string' || quantity.length > 10) return false;
      if (quantity === '' || quantity === '0') amounts.delete(row);
      else amounts.set(row, quantity);
      reprice();
    } else {
      return false;
    }
    notify();
    return true;
  }
  return {
    revision, sync, snapshot, act,
    close() { closed = true; offer = quote = review = null; amounts.clear(); },
  };
}

import {
  canStoreLegacyGameFeedBoxItem, clearLegacyGameMapBank, legacyGameBankGoldLimit, legacyGameFeedBoxMode,
} from '../../shared/legacy-game-map-bank.mjs';

const tabs = [{ id: 'item', label: '物品' }, { id: 'pet', label: '宠物' }, { id: 'gold', label: '金币' }];
const titles = { 0x17: '银行', 0x21: '仓储', [legacyGameFeedBoxMode]: '饲料箱' };
const errors = {
  LEGACY_GAME_BANK_STALE: '仓储或持有记录已更新，请重新选择。',
  LEGACY_GAME_BANK_SLOT: '请选择可移动的来源和目标槽位。',
  LEGACY_GAME_BANK_AMOUNT: '请核对数量和余额上限。',
  LEGACY_GAME_BANK_BUSY: '正在等待仓储更新。',
};

function itemRows(client, feedBox, decodeName, decode) {
  const slots = client.copyInventory();
  try {
    return slots.filter(row => !row.equipment).map(row => ({
      slot: row.slot, revision: row.revision, occupied: row.present, quantity: row.quantity,
      name: row.present ? decodeName(row.nameBytes) : '', label: '背包槽 ' + (row.slot - 7),
      description: row.descriptionBytes ? decode(row.descriptionBytes) : '',
      canMove: feedBox ? canStoreLegacyGameFeedBoxItem(row) : row.canStore,
    }));
  } finally {
    for (const row of slots) {
      row.nameBytes?.fill(0);
      row.descriptionBytes?.fill(0);
    }
  }
}

function petRows(client, decodeName) {
  const { records } = client.copyBattleState().pets;
  try {
    return records.map(row => ({
      slot: row.slot, occupied: row.present, canMove: row.present,
      name: row.present ? decodeName(row.nameBytes) : '', label: '携带宠物槽 ' + (row.slot + 1),
    }));
  } finally {
    for (const row of records) {
      row.nameBytes.fill(0);
      row.nicknameBytes.fill(0);
    }
  }
}

function storageRows(client, tab, feedBox, decodeName, decode) {
  const { bank } = client.copyMapDialog();
  try {
    const items = tab === 'item';
    const own = items ? itemRows(client, feedBox, decodeName, decode) : petRows(client, decodeName);
    const stored = (items ? bank.items : bank.pets).map((row, index) => ({
      slot: index + 100, occupied: !!row, canMove: !!row, quantity: row?.quantity,
      name: row ? decodeName(row.name) : '', label: (feedBox ? '饲料箱槽 ' : '仓储槽 ') + (index + 1),
      description: row?.lines?.map(decode).join('\n'),
    }));
    return [...own, ...stored].map(row => ({
      ...row, label: row.label + ' · ' + (row.name || (row.occupied ? items ? '物品' : '宠物' : '空')) +
        (row.quantity > 0 ? ' × ' + row.quantity : ''),
    }));
  } finally {
    clearLegacyGameMapBank(bank);
  }
}

export function createWeChatBank({ client, revision, mode, decodeName, decode, notify }) {
  const feedBox = mode === legacyGameFeedBoxMode;
  let info, itemRevision, rows = [], stamp = '', version = 0;
  let tab = 'item', from = null, to = null, direction = 'deposit-gold', amount = '';
  let sending = false, closed = false, notice = '';

  function refreshRows() {
    const owned = tab === 'item' ? itemRevision : tab === 'pet' ? info.petVersion : info.gold;
    const key = `${tab}/${info.bank.version}/${owned}`;
    if (key === stamp) return;
    if ((from || amount) && !sending) notice = '仓储或持有记录已更新，请重新选择。';
    from = to = null;
    amount = '';
    rows = tab === 'gold' ? [] : storageRows(client, tab, feedBox, decodeName, decode);
    stamp = key;
    version++;
  }

  function targets() {
    return from ? rows.filter(row => row.slot !== from.slot && (from.slot >= 100 || row.slot >= 100)) : [];
  }

  function maximum() {
    if (tab === 'gold') {
      const { gold, bank: { balance } } = info;
      if (gold === null || balance === null) return 0;
      return Math.max(0, direction === 'deposit-gold' ?
        Math.min(gold, legacyGameBankGoldLimit - balance) : Math.min(balance, legacyGameBankGoldLimit - gold));
    }
    return tab === 'item' && to && !to.occupied && from.quantity > 0 ? from.quantity : 0;
  }

  function request() {
    const limit = maximum(), quantity = Number(amount);
    if (amount !== '' && (quantity < 1 || quantity > limit)) return null;
    const bankVersion = info.bank.version;
    if (tab === 'gold') return amount === '' ? null : { kind: direction, version: bankVersion, amount: quantity, wallet: info.gold };
    if (!from || !to) return null;
    return { kind: tab, version: bankVersion, from: from.slot, to: to.slot,
      amount: amount === '' ? -1 : quantity, fromRevision: from.revision, toRevision: to.revision, petVersion: info.petVersion };
  }

  function snapshot() {
    const sources = rows.filter(row => row.canMove), destinations = targets(), busy = sending || info.bank.pending;
    return {
      revision, version, mounts: [version], title: titles[mode], tabs: feedBox ? [] : tabs, tab,
      wallet: info.gold, balance: info.bank.balance, sources, destinations,
      sourceIndex: Math.max(0, sources.indexOf(from)), targetIndex: Math.max(0, destinations.indexOf(to)),
      fromLabel: from?.label ?? '', toLabel: to?.label ?? '', description: from?.description ?? '',
      direction, amount, maximum: maximum(), busy, sending, canSubmit: !busy && !!request(),
      notice: info.bank.pending ? '正在等待仓储更新。' : notice,
    };
  }

  async function act(action, expected, value) {
    if (closed || sending || expected !== version || (info.bank.pending && action !== 'close')) return false;
    if (action === 'submit' || action === 'close') {
      const operation = action === 'submit' ? request() : null;
      if (action === 'submit' && !operation) return false;
      sending = true;
      notice = '';
      notify();
      try {
        if (operation) await client.actOnMapBank(revision, operation);
        else await client.replyMapDialog(revision, 0);
        return true;
      } catch (error) {
        notice = errors[error.code] ?? '仓储操作未完成。';
        return false;
      } finally {
        sending = false;
        if (!closed) notify();
      }
    }
    notice = '';
    if (action === 'tab' && !feedBox && tabs.some(row => row.id === value)) {
      tab = value;
      refreshRows();
    } else if (action === 'direction' && tab === 'gold' && ['deposit-gold', 'withdraw-gold'].includes(value)) {
      direction = value;
      amount = '';
      version++;
    } else if (action === 'from' || action === 'to') {
      if (!Number.isInteger(value)) return false;
      const options = action === 'from' ? rows.filter(row => row.canMove) : targets();
      const selected = options[value];
      if (!selected) return false;
      if (action === 'from') { from = selected; to = null; }
      else to = selected;
      amount = '';
      version++;
    } else if (action === 'amount' && maximum() > 0 && typeof value === 'string' && /^\d{0,10}$/.test(value)) {
      amount = value;
    } else return false;
    notify();
    return true;
  }

  return Object.freeze({
    revision, snapshot, act,
    sync(current, inventoryRevision) {
      info = current;
      itemRevision = inventoryRevision;
      refreshRows();
    },
    close() {
      closed = true;
      rows = [];
      from = to = null;
    },
  });
}

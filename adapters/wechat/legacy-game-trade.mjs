const phases = ['编辑中', '已发布', '已确认'];
const errors = {
  LEGACY_GAME_TRADE_TARGET: '请面向附近可交易的玩家。',
  LEGACY_GAME_TRADE_COOLDOWN: '请稍候再试。',
  LEGACY_GAME_TRADE_SELECTION: '物品或宠物已更新，请重新选择。',
  LEGACY_GAME_TRADE_GOLD: '请核对可用金币和报价金额。',
  LEGACY_GAME_TRADE_OFFER_STALE: '持有记录已变动，请撤回后重新报价。',
  LEGACY_GAME_TRADE_STALE: '交易页面已更新，请重新核对。',
};
const quantity = row => row.quantity > 0 ? ' × ' + row.quantity : '';

function projectTrade(model, decodeName, decode) {
  if (model.kind === 'candidates') {
    try {
      return { ...model, candidates: model.candidates.filter(row => row.nameBytes.length)
        .map(row => ({ id: row.index, label: decodeName(row.nameBytes) || '玩家 ' + (row.index + 1) })) };
    } finally {
      for (const row of model.candidates) row.nameBytes.fill(0);
    }
  }
  const { kind, session, revision, gold, partner, localPhase, remotePhase, remoteGold, availableItems,
    availablePets, remoteItems, remotePets, offerStale, offer } = model;
  try {
    const item = row => ({ slot: row.slot, revision: row.revision, label: (decodeName(row.nameBytes) || '物品') + quantity(row) });
    const pet = row => ({ slot: row.slot, revision: row.revision, label: decodeName(row.nameBytes) || '宠物' });
    const peerItems = remoteItems.map(row => {
      const name = decodeName(row.nameBytes) || '物品', alias = decodeName(row.nicknameBytes);
      return { id: row.row, label: name + (alias && alias !== name ? ' · ' + alias : '') + quantity(row),
        description: decode(row.descriptionBytes) };
    });
    const peerPets = remotePets.map(row => {
      const name = decodeName(row.nameBytes) || '宠物', alias = decodeName(row.nicknameBytes);
      const skills = row.skills.map(decodeName).filter(Boolean);
      return { id: row.row, label: name + (alias ? ' · ' + alias : ''), description: skills.length ? '技能 ' + skills.join('、') : '' };
    });
    return {
      kind, session, revision, gold, title: '玩家交易 · ' + (decodeName(partner) || '交易对象'),
      localPhase, remotePhase, remoteGold, peerItems, peerPets, offerStale,
      items: availableItems.map(item), pets: availablePets.map(pet),
      offer: offer ? { items: offer.items.map(item), pets: offer.pets.map(pet), gold: offer.gold } : null,
    };
  } finally {
    partner.fill(0);
    for (const row of [...availableItems, ...availablePets, ...remoteItems, ...remotePets, ...(offer?.items ?? []), ...(offer?.pets ?? [])]) {
      row.nameBytes.fill(0);
      row.nicknameBytes?.fill(0);
      row.descriptionBytes?.fill(0);
      for (const skill of row.skills ?? []) skill.fill(0);
    }
  }
}

export function createWeChatTrade({ client, decodeName, decode, notify }) {
  const items = new Map(), pets = new Map();
  let model = null, stamp = '', version = 0, goldText = '0', notice = '', allowed = false, busy = false, closed = false;
  const canRequest = () => allowed && !model && !busy && !closed;
  const canConfirm = () => model.localPhase === 1 && model.remotePhase >= 1 && !model.offerStale;
  const canPublish = () => model.localPhase === 0 && Number(goldText) <= (model.gold ?? 0);

  function sync(world) {
    allowed = !world.mapDialog;
    const info = world.playerTrade;
    if (!info || info.kind === 'ended') {
      if (info?.kind === 'ended') notice = '交易已结束。';
      else if (model) notice = '';
      model = null;
      stamp = '';
      return;
    }
    const key = `${info.revision}/${info.gold}/${info.petVersion}/${world.battle.items.revision}`;
    if (key === stamp) return;
    const next = projectTrade(client.copyPlayerTrade(), decodeName, decode);
    if (next.session !== model?.session) {
      items.clear();
      pets.clear();
      for (const row of next.offer?.items ?? []) items.set(row.slot, row.revision);
      for (const row of next.offer?.pets ?? []) pets.set(row.slot, row.revision);
      goldText = String(next.offer?.gold ?? 0);
      notice = '';
    }
    if (next.kind === 'open') {
      for (const [selected, available] of [[items, next.items], [pets, next.pets]]) {
        for (const [slot, revision] of selected) {
          if (available.some(row => row.slot === slot && row.revision === revision)) continue;
          selected.delete(slot);
          notice = '持有物品或宠物已更新，请重新核对报价。';
        }
      }
    }
    stamp = key;
    model = next;
    version++;
  }

  function snapshot() {
    if (!model || !allowed) return null;
    const { kind, revision } = model;
    if (kind === 'candidates') return { kind, revision, version, title: '选择交易对象', candidates: model.candidates, busy, notice };
    const selected = (rows, draft) => rows.map(row => ({ ...row, selected: draft.get(row.slot) === row.revision }));
    return {
      ...model, version, busy, notice: model.offerStale ? '持有记录已变动，请撤回后重新报价。' : notice,
      localPhaseText: phases[model.localPhase], remotePhaseText: phases[model.remotePhase],
      items: selected(model.items, items), pets: selected(model.pets, pets), goldText,
      canPublish: !busy && canPublish(), canConfirm: !busy && canConfirm(),
    };
  }

  async function act(action, revision, expected, value, rowRevision) {
    if (closed || busy || !allowed) return false;
    const requesting = action === 'request';
    if (requesting ? !canRequest() : !model || model.revision !== revision || expected !== version) return false;
    if (action === 'item' || action === 'pet' || action === 'gold') {
      if (model.kind !== 'open' || model.localPhase !== 0) return false;
      if (action === 'gold') {
        if (typeof value !== 'string' || !/^\d{0,10}$/.test(value)) return false;
        goldText = value;
      } else {
        const selectingItems = action === 'item';
        const row = (selectingItems ? model.items : model.pets).find(row => row.slot === value && row.revision === rowRevision);
        if (!row) return false;
        const draft = selectingItems ? items : pets;
        if (draft.has(row.slot)) draft.delete(row.slot);
        else draft.set(row.slot, row.revision);
      }
      notice = '';
      notify();
      return true;
    }
    if (action === 'select' && (model.kind !== 'candidates' || !model.candidates.some(row => row.id === value))) return false;
    if (action === 'publish') {
      if (model.kind !== 'open' || !canPublish()) return false;
      const references = draft => Array.from(draft, ([slot, revision]) => ({ slot, revision }));
      value = { items: references(items), pets: references(pets), gold: Number(goldText) };
    }
    if (action === 'confirm' && (model.kind !== 'open' || !canConfirm())) return false;
    if (action === 'withdraw' && (model.kind !== 'open' || model.localPhase === 0)) return false;
    if (!['request', 'select', 'publish', 'confirm', 'withdraw', 'close'].includes(action)) return false;
    busy = true;
    notice = '';
    notify();
    try {
      await client.actOnPlayerTrade(action, requesting ? null : revision, value ?? null);
      if (requesting && !model) notice = '已请求交易对象。';
      return true;
    } catch (error) {
      notice = errors[error.code] ?? '交易操作未完成。';
      return false;
    } finally {
      busy = false;
      if (!closed) notify();
    }
  }

  return Object.freeze({
    sync, snapshot, act, canRequest,
    notice: () => allowed && !model ? notice : '',
    close() { closed = true; model = null; items.clear(); pets.clear(); },
  });
}

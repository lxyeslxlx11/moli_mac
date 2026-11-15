/** Ordinary inventory selection on top of the shared revisioned item owner. */
function readRows(client, decodeName, decode) {
  const slots = client.copyInventory();
  try {
    return slots.map(({ slot, revision, equipment, present, quantity, canUse, canUseOnItem,
      canReceiveItemUse, nameBytes, descriptionBytes }) => {
      let name = '空';
      if (present) {
        try { name = decodeName(nameBytes) || '物品'; }
        catch { name = '物品'; }
      }
      return {
        slot, revision, equipment, present, quantity, canUse, canUseOnItem, canReceiveItemUse, name,
        label: equipment ? '装备槽 ' + (slot + 1) : '背包槽 ' + (slot - 7),
        description: descriptionBytes ? decode(descriptionBytes) : '',
      };
    });
  } finally {
    for (const row of slots) {
      row.nameBytes?.fill(0);
      row.descriptionBytes?.fill(0);
    }
  }
}

export function createWeChatInventory({ client, decodeName, decode, notify }) {
  let revision = null, rows = [], source = null, destination = null, mode = null;
  let closed = false, busy = false, notice = '';
  function clearSelection() { source = destination = mode = null; }
  function sync(next) {
    if (closed || next === revision) return;
    rows = readRows(client, decodeName, decode);
    revision = next;
    if ([source, destination].some(row => row && row.revision !== rows[row.slot]?.revision)) {
      clearSelection();
      if (!busy) notice = '槽位已更新，请重新选择。';
    }
  }
  function canSplit() {
    return !!(source && destination && !mode && !source.equipment && !destination.equipment &&
      !destination.present && source.quantity > 0);
  }
  function snapshot() {
    const targeting = mode === 'target', dropping = mode === 'drop';
    const groups = [{ name: '装备', rows: [] }, { name: '背包', rows: [] }];
    for (const row of rows) {
      const selected = source?.slot === row.slot, target = destination?.slot === row.slot;
      groups[row.equipment ? 0 : 1].rows.push({
        slot: row.slot, revision: row.revision, name: row.name, label: row.label, quantity: row.quantity,
        selected, target, disabled: busy || dropping || (targeting ? selected || !row.canReceiveItemUse : !source && !row.present),
      });
    }
    let hint = '请选择物品。';
    if (targeting) hint = '请选择「' + source.name + '」要使用的物品。';
    else if (dropping) hint = '将「' + source.name + '」丢在当前位置？';
    else if (destination) hint = '将「' + source.name + '」移到' + destination.label + '。';
    else if (source) hint = '已选「' + source.name + '」，请选择操作或目标槽位。';
    return {
      groups, busy, notice: notice || hint, description: source?.description ?? '',
      canUse: !busy && !mode && !destination && !!(source?.canUse || source?.canUseOnItem),
      canMove: !busy && !mode && !!destination, canDrop: !busy && !mode && !!source && !destination,
      canClear: !busy && !!source, confirmingDrop: dropping, canSplit: !busy && canSplit(),
    };
  }
  async function send(request) {
    busy = true;
    notice = '正在发送…';
    notify();
    try {
      await request();
      if (closed) return false;
      clearSelection();
      notice = '请求已发送，等待服务器更新。';
      return true;
    } catch (error) {
      if (error?.code === 'LEGACY_GAME_ITEM_STALE') {
        clearSelection();
        notice = '槽位已更新，请重新选择。';
      } else {
        notice = '当前无法进行该物品操作。';
      }
      return false;
    } finally {
      busy = false;
      if (!closed) notify();
    }
  }
  async function act(action, value) {
    if (closed || busy) return false;
    const from = source, to = destination;
    if (action === 'select') {
      const row = rows[value?.slot];
      if (!row || row.revision !== value.revision) {
        notice = '槽位已更新，请重新选择。';
        notify();
        return false;
      }
      if (mode === 'drop') return false;
      if (mode === 'target') {
        if (row.slot === from.slot || !row.canReceiveItemUse) return false;
        return send(() => client.useInventoryItemOnItem(from.slot, from.revision, row.slot, row.revision));
      }
      if (from?.slot === row.slot) clearSelection();
      else if (from) destination = row;
      else if (row.present) source = row;
      else return false;
    } else if (action === 'clear') {
      clearSelection();
    } else if (action === 'use' && from && !to && !mode) {
      if (from.canUseOnItem) mode = 'target';
      else if (from.canUse) return send(() => client.useInventoryItem(from.slot, from.revision));
      else return false;
    } else if (action === 'drop' && from && !to && !mode) {
      mode = 'drop';
    } else if (action === 'confirm-drop' && mode === 'drop') {
      return send(() => client.dropInventoryItem(from.slot, from.revision));
    } else if (action === 'move' && from && to && !mode) {
      return send(() => client.moveInventoryItem(from.slot, from.revision, to.slot, to.revision));
    } else if (action === 'split' && canSplit()) {
      const amount = typeof value === 'string' && /^[0-9]{1,10}$/.test(value) ? Number(value) : 0;
      if (amount < 1 || amount > from.quantity) {
        notice = '请输入有效的移动数量。';
        notify();
        return false;
      }
      return send(() => client.moveInventoryItem(from.slot, from.revision, to.slot, to.revision, amount));
    } else {
      return false;
    }
    notice = '';
    notify();
    return true;
  }
  return {
    sync, snapshot, act,
    close() { closed = true; clearSelection(); rows = []; },
  };
}

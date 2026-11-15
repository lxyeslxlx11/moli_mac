import { canFeedLegacyGameFamilyPet, legacyGameFamilyPetNameBytes } from '../../shared/legacy-game-map-family-pet.mjs';

const errors = {
  LEGACY_GAME_FAMILY_PET_PERMISSION: '当前家族兽权限不允许此操作。',
  LEGACY_GAME_FAMILY_PET_STALE: '背包已更新，请重新选择。',
  LEGACY_GAME_FAMILY_PET_NAME: '名称最多 16 字节，请检查输入。',
};

export function createWeChatFamilyPet({ client, revision, decode, decodeName, encode, notify }) {
  const { familyPet } = client.copyMapDialog();
  let title, lines;
  try {
    title = decode(familyPet.title) || '家族兽';
    lines = familyPet.lines.map((bytes, id) => ({ id, text: decode(bytes) }));
  } finally {
    familyPet.title.fill(0);
    for (const line of familyPet.lines) line.fill(0);
  }
  let current = familyPet, stamp = '', rows = [], selected = null, name = '', sending = false, closed = false, notice = '';

  function sync(info, inventoryRevision) {
    current = info;
    if (!info.canRename) name = '';
    const key = inventoryRevision + '/' + info.canFeed;
    if (key === stamp) return;
    const slots = client.copyInventory();
    try {
      rows = slots.filter(row => canFeedLegacyGameFamilyPet(row, info.canFeed)).map(row => ({
        slot: row.slot, revision: row.revision, quantity: row.quantity,
        label: '背包槽 ' + (row.slot - 7) + ' · ' + (decodeName(row.nameBytes) || '物品') +
          (row.quantity > 0 ? ' × ' + row.quantity : ''),
      }));
    } finally {
      for (const row of slots) {
        row.nameBytes?.fill(0);
        row.descriptionBytes?.fill(0);
      }
    }
    if (selected) {
      const match = rows.find(row => row.slot === selected.slot && row.revision === selected.revision);
      if (!match && !sending && !info.pending) notice = '背包或权限已更新，请重新选择。';
      selected = match ?? null;
    }
    stamp = key;
  }

  function snapshot() {
    const busy = sending || current.pending;
    return {
      revision, title, lines, rows: rows.map(row => ({ ...row, selected: row === selected })),
      name, nameLimit: legacyGameFamilyPetNameBytes, canRename: current.canRename,
      busy, sending, canSubmitFeed: !busy && !!selected,
      notice: current.pending ? '正在等待家族兽或背包更新。' : notice,
    };
  }

  async function act(action, value, itemRevision) {
    if (closed || sending || (current.pending && action !== 'close')) return false;
    if (action === 'select') {
      const row = rows.find(row => row.slot === value && row.revision === itemRevision);
      if (!row) return false;
      selected = row;
    } else if (action === 'name' && current.canRename && typeof value === 'string' && value.length <= legacyGameFamilyPetNameBytes) {
      name = value;
    } else {
      if (!(action === 'close' || (action === 'feed' && selected) || (action === 'rename' && current.canRename))) return false;
      sending = true;
      notice = '';
      notify();
      let bytes;
      try {
        if (action === 'close') await client.replyMapDialog(revision, 0);
        else if (action === 'feed') await client.actOnMapFamilyPet(revision, {
          kind: 'feed', slot: selected.slot, revision: selected.revision,
        });
        else {
          bytes = encode(name);
          await client.actOnMapFamilyPet(revision, { kind: 'rename', name: bytes });
        }
        return true;
      } catch (error) {
        notice = errors[error.code] ?? '家族兽操作未完成。';
        return false;
      } finally {
        bytes?.fill(0);
        sending = false;
        if (!closed) notify();
      }
    }
    notice = '';
    notify();
    return true;
  }

  return Object.freeze({ revision, snapshot, sync, act, close() { closed = true; selected = null; rows = []; name = ''; } });
}

import {
  legacyGameFamilyNameBytes, legacyGameFamilyRoleCapacity, legacyGameFamilyRoleNameBytes,
} from '../../shared/legacy-game-family.mjs';

const permissionLabels = [
  [1, '邀请入会'], [2, '移除成员'], [4, '喂食家族兽'], [8, '管理仓储'], [16, '删除留言'],
];
const errors = {
  LEGACY_GAME_FAMILY_BUSY: '等待家族资料更新。',
  LEGACY_GAME_FAMILY_STALE: '家族资料已更新，请重新编辑。',
  LEGACY_GAME_FAMILY_NAME: '请检查名称的字节长度和字符。',
  LEGACY_GAME_FAMILY_PERMISSION: '当前权限无法执行此操作。',
  LEGACY_GAME_FAMILY_ROLE: '请核对当前称号和可选称号。',
  LEGACY_GAME_FAMILY_MEMBER: '名单已更新，请重新选择成员。',
  LEGACY_GAME_FAMILY_TARGET: '请先面向相邻玩家。',
  LEGACY_GAME_FAMILY_COOLDOWN: '请稍候再试。',
};

function readFamily(client, decode) {
  const model = client.copyFamily();
  if (!model) return null;
  const { name, hall, roles, members, ownRole, ...info } = model;
  try {
    const roleRows = Array.from({ length: legacyGameFamilyRoleCapacity }, (_, slot) => ({ slot, name: '', flags: 0 }));
    for (const row of roles) roleRows[row.slot] = { slot: row.slot, name: decode(row.name), flags: row.flags };
    const roleLabel = slot => roleRows[slot]?.name || '未同步';
    const memberRows = members.map(row => {
      const label = [decode(row.name) || '未命名'];
      const secondary = decode(row.secondaryName);
      if (secondary) label.push('附名 ' + secondary);
      label.push(roleLabel(row.roleSlot));
      if (row.self) label.push('自己');
      return { id: row.id, label: label.join(' · '), roleSlot: row.roleSlot, self: row.self,
        canAssignRole: row.canAssignRole, canRemove: row.canRemove };
    });
    return { ...info, name: decode(name), hall: decode(hall), ownTitle: roleLabel(ownRole), roles: roleRows, members: memberRows };
  } finally {
    name.fill(0);
    hall.fill(0);
    for (const row of roles) row.name.fill(0);
    for (const row of members) {
      row.name.fill(0);
      row.secondaryName.fill(0);
    }
  }
}

export function createWeChatFamily({ client, decode, encode, notify }) {
  let model = null, version = 0, roleSlot = 0, member = null, targetRole = null, review = false;
  let name = '', hall = '', roleName = '', roleMask = 0, sending = false, closed = false, notice = '';
  const editableMembers = () => model.members.filter(row => row.canRemove || row.canAssignRole);
  const roleChoices = () => member?.canAssignRole ?
    model.roles.filter(row => row.slot > 0 && row.name && row.slot !== member.roleSlot) : [];
  const roleCanEditFlags = () => roleSlot !== 0 && !(model.roles[roleSlot].flags & 0x80);

  function selectRole(slot) {
    roleSlot = slot;
    const row = model.roles[slot];
    roleName = row.name;
    roleMask = row.flags & 31;
  }

  function sync(info) {
    const previous = model?.version ?? 0, current = info?.version ?? 0;
    if (current === previous) {
      if (model && info.pending !== model.pending) model = { ...model, pending: info.pending };
      return;
    }
    model = readFamily(client, decode);
    version++;
    name = model?.name ?? '';
    hall = model?.hall ?? '';
    if (model) selectRole(roleSlot);
    member = targetRole = null;
    review = false;
    notice = '';
  }

  function snapshot() {
    const active = model?.id !== null && model?.id >= 0, busy = sending || !!model?.pending;
    const view = {
      revision: model?.version ?? 0, version, mounts: [version], active, busy, pending: model?.pending ?? null,
      notice: model?.pending ? '请求已发送，等待家族资料更新。' : notice,
      empty: model?.id < 0 ? '当前没有家族。' : '等待家族资料同步。',
    };
    if (!active) return view;
    const eligible = editableMembers(), choices = roleChoices();
    return {
      ...view, name: model.name, hall: model.hall, ownTitle: model.ownTitle, members: model.members, canInvite: model.canInvite,
      identity: model.canManage ? { name, hall, limit: legacyGameFamilyNameBytes } : null,
      role: model.canManage ? { slot: roleSlot, name: roleName, limit: legacyGameFamilyRoleNameBytes,
        options: model.roles.map(row => (row.slot + 1) + ' · ' + (row.name || '空称号')),
        canEditFlags: roleCanEditFlags(), permissions: permissionLabels.map(([bit,label]) => ({ bit,label,selected: !!(roleMask & bit) })),
      } : null,
      member: eligible.length ? { options: eligible, index: Math.max(0, eligible.indexOf(member)), label: member?.label ?? '',
        roles: choices, roleIndex: Math.max(0, choices.indexOf(targetRole)), roleLabel: targetRole?.name ?? '',
        canAssign: !!targetRole, canRemove: !!member?.canRemove, removeLabel: member?.self ? '退出家族' : '移除成员',
        review: review && member ? '确认' + (member.self ? '退出家族' : '移除 ' + member.label) + '？' : '',
      } : null,
    };
  }

  function edit(action, value) {
    if (action === 'select-member' && Number.isInteger(value)) {
      const chosen = editableMembers()[value];
      if (!chosen) return false;
      member = chosen;
      targetRole = null;
      review = false;
      version++;
    } else if (action === 'select-member-role' && Number.isInteger(value)) {
      const chosen = roleChoices()[value];
      if (!chosen) return false;
      targetRole = chosen;
    } else if (action === 'review-remove' && member?.canRemove) {
      review = true;
    } else if (action === 'cancel-remove' && review) {
      review = false;
    } else if (!model.canManage) return false;
    else if ((action === 'name' || action === 'hall') && typeof value === 'string' && value.length <= legacyGameFamilyNameBytes) {
      if (action === 'name') name = value;
      else hall = value;
    } else if (action === 'select-role' && Number.isInteger(value) && model.roles[value]) {
      selectRole(value);
      version++;
    } else if (action === 'role-name' && typeof value === 'string' && value.length <= legacyGameFamilyRoleNameBytes) {
      roleName = value;
    } else if (action === 'permission' && roleCanEditFlags() && permissionLabels.some(([bit]) => bit === value)) {
      roleMask ^= value;
    } else return false;
    notice = '';
    notify();
    return true;
  }

  async function act(action, revision, expected, value) {
    if (closed || sending || !model || model.id === null || model.id < 0 || model.pending ||
        revision !== model.version || expected !== version) return false;
    let request, text;
    if (action === 'invite' && model.canInvite) request = { kind: 'invite' };
    else if (action === 'assign-role' && targetRole && member.canAssignRole && !review) {
      request = { kind: 'assign-role', memberId: member.id, slot: targetRole.slot };
    } else if (action === 'confirm-remove' && review && member?.canRemove) {
      request = { kind: 'remove-member', memberId: member.id };
      review = false;
    } else if (model.canManage && (action === 'save-name' || action === 'save-hall')) {
      request = { kind: action === 'save-name' ? 'name' : 'hall' };
      text = action === 'save-name' ? name : hall;
    } else if (model.canManage && action === 'save-role') {
      request = { kind: 'role', slot: roleSlot, permissions: roleMask };
      if (roleName !== model.roles[roleSlot].name) text = roleName;
    } else return edit(action, value);
    sending = true;
    notice = '';
    notify();
    let bytes;
    try {
      if (text !== undefined) bytes = encode(text);
      await client.actOnFamily(revision, { ...request, name: bytes });
      if (!closed && action === 'invite' && revision === model?.version) notice = '邀请请求已发送。';
      return true;
    } catch (error) {
      notice = errors[error.code] ?? '家族操作未完成，请核对输入与当前编码。';
      return false;
    } finally {
      bytes?.fill(0);
      sending = false;
      if (!closed) notify();
    }
  }

  return Object.freeze({
    sync, snapshot, act,
    close() { closed = true; model = null; member = targetRole = null; name = hall = roleName = ''; },
  });
}

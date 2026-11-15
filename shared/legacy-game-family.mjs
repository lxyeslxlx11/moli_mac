/** The fixed 37c4 family profile, role definitions and member roster. */
import { readLegacyGameStateBase62 as base62, splitLegacyGameStateFields as split,
  unescapeLegacyGameInnerField as unescape } from './legacy-game-state.mjs';
import { encodeLegacyGameInnerReplyText, isValidLegacyGameReplyField } from './legacy-game-map-dialog.mjs';

const roleCapacity = 32, memberCapacity = 200, memberFields = 8;
const invitePermission = 1, removePermission = 2, editablePermissions = 0x1f, adminPermission = 0x80;
const empty = new Uint8Array();
export const legacyGameFamilyRoleCapacity = roleCapacity;
export const legacyGameFamilyNameBytes = 24;
export const legacyGameFamilyRoleNameBytes = 16;

const consumers = new Set(['0x4f4af0','0x4f4de0','0x4f4ef0','0x4f5150','0x4f53d0','0x4f5520']);
export const isLegacyGameFamilyConsumer = consumer => consumers.has(consumer);

function decimal(field) {
  if (!field?.length) return -1;
  if (field.length > 127) return null;
  const text = String.fromCharCode(...field).trim();
  const value = Number(text);
  return /^[+-]?\d+$/.test(text) && value >= -2147483647 && value <= 2147483647 ? value : null;
}

function textField(field, maximum) {
  const bytes = unescape(field?.subarray(0,255) ?? empty);
  if (bytes.length <= maximum) return bytes;
  bytes.fill(0);
  return null;
}

function readProfile(bytes) {
  const fields = split(bytes), mask = fields[0];
  if (!mask.length || mask.length > 7 || !/^-?[0-9a-zA-Z]+$/.test(String.fromCharCode(...mask))) return null;
  const flags = base62(mask), selected = new Map();
  let at = 1;
  for (let bit = 2; bit <= 0x1000; bit <<= 1) {
    if (flags & (bit | 1)) selected.set(bit, fields[at++]);
  }
  return selected.size ? selected : null;
}

function readRoles(bytes) {
  const fields = split(bytes), count = decimal(fields[0]), rows = new Map();
  if (count === null || count < 0 || count > roleCapacity) return null;
  for (let i = 0; i < count; i++) {
    const at = 1 + i * 3, slot = decimal(fields[at]), flags = decimal(fields[at + 1]);
    const valid = slot !== null && slot >= 0 && slot < roleCapacity && !rows.has(slot) &&
      !!fields[at + 1]?.length && flags !== null && flags >= -1;
    if (valid && flags === -1) {
      rows.set(slot,null);
      continue;
    }
    const name = valid && fields[at + 2] ? textField(fields[at + 2],40) : null;
    if (!name) {
      for (const row of rows.values()) row?.name.fill(0);
      return null;
    }
    rows.set(slot,{ slot,flags,name });
  }
  return rows;
}

function readMember(fields, at) {
  const present = decimal(fields[at]);
  if (present === null) return undefined;
  if (present < 1) return null;
  const id = decimal(fields[at + 1]), roleSlot = decimal(fields[at + 7]);
  if (id === null || id < 0 || roleSlot === null || !fields[at + 2]?.length || !fields[at + 7]) return undefined;
  const packed = unescape(fields[at + 2].subarray(0,255));
  try {
    const [primary,secondary] = split(packed);
    const name = textField(primary,16), secondaryName = textField(secondary,16);
    if (name && secondaryName) return { id,roleSlot,name,secondaryName };
    name?.fill(0);
    secondaryName?.fill(0);
    return undefined;
  } finally {
    packed.fill(0);
  }
}

function wipeMember(row) {
  row?.name.fill(0);
  row?.secondaryName.fill(0);
}

function readMembers(bytes) {
  const fields = split(bytes);
  if (fields.length > memberCapacity * memberFields + 1 ||
      (fields.length > memberCapacity * memberFields && fields.at(-1).length)) return null;
  const rows = Array(memberCapacity).fill(null), seen = new Set();
  for (let slot = 0; slot < memberCapacity && slot * memberFields < fields.length; slot++) {
    const row = readMember(fields,slot * memberFields);
    if (row === undefined || (row && seen.has(row.id))) {
      wipeMember(row);
      for (const staged of rows) wipeMember(staged);
      return null;
    }
    if (row) seen.add(row.id);
    rows[slot] = row;
  }
  return rows;
}

function fail(code) {
  const error = new Error('The requested family action is unavailable.');
  error.code = code;
  throw error;
}

function sameText(left, right) {
  return left.length === right?.length && left.every((value,at) => value === right[at]);
}

function encodeName(name, limit) {
  if (!(name instanceof Uint8Array) || name.length > limit || name.some(byte => byte < 32 || byte === 127) ||
      !isValidLegacyGameReplyField(name)) fail('LEGACY_GAME_FAMILY_NAME');
  return encodeLegacyGameInnerReplyText(name);
}

function command(producer, args) {
  return Object.freeze({ operationId: 'send-' + producer, arguments: Object.freeze(args) });
}

export function createLegacyGameFamily() {
  let profile, roles, members, pending, version = 0;
  function clear() {
    profile?.name.fill(0);
    profile?.hall.fill(0);
    for (const row of roles ?? []) row?.name.fill(0);
    for (const row of members ?? []) wipeMember(row);
    profile = { id:null,roleSlot:-1,selfId:-1,name:empty,hall:empty,petPermissions:0 };
    roles = Array(roleCapacity).fill(null);
    members = Array(memberCapacity).fill(null);
    pending = null;
  }
  clear();
  const flagsFor = slot => slot === -1 ? 0 : roles[slot]?.flags ?? null;
  const ownFlags = () => profile.id !== null && profile.id >= 0 ? flagsFor(profile.roleSlot) : null;
  const canManage = () => !!(ownFlags() & adminPermission);
  const findMember = id => members.findIndex(row => row?.id === id);
  function memberActions(row) {
    const own = ownFlags(), target = flagsFor(row.roleSlot), self = row.id === profile.selfId;
    const unprotected = target !== null && !(target & adminPermission);
    return {
      self,
      canAssignRole: !!(own & adminPermission) && unprotected,
      canRemove: own !== null && (own & removePermission ? unprotected : self),
    };
  }
  function settleMember(id) {
    if (pending?.memberId !== id) return;
    const row = members[findMember(id)];
    if (!row || (pending.kind === 'assign-role' && row.roleSlot === pending.slot)) pending = null;
  }
  function applyProfile(bytes) {
    const selected = readProfile(bytes);
    if (!selected) return false;
    if (selected.has(2)) {
      const id = decimal(selected.get(2));
      if (id === null) return false;
      if (profile.id !== null && profile.id >= 0 && id !== profile.id) {
        const petPermissions = profile.petPermissions;
        clear();
        profile.petPermissions = petPermissions;
      }
      profile.id = id;
    }
    for (const [bit,key] of [[4,'name'],[8,'hall']]) {
      if (!selected.has(bit)) continue;
      const name = textField(selected.get(bit),40);
      if (!name) continue;
      profile[key].fill(0);
      profile[key] = name;
      if (pending?.kind === key) pending = null;
    }
    if (selected.has(16)) profile.roleSlot = decimal(selected.get(16)) ?? -1;
    if (selected.has(0x1000)) profile.selfId = decimal(selected.get(0x1000)) ?? -1;
    if (selected.has(0x100)) profile.petPermissions = Math.max(0,decimal(selected.get(0x100)) ?? 0) & 0x84;
    return true;
  }
  function applyRoles(bytes) {
    const rows = readRoles(bytes);
    if (!rows) return false;
    for (const [slot,row] of rows) {
      roles[slot]?.name.fill(0);
      roles[slot] = row;
      if (pending?.kind === 'role' && pending.slot === slot) pending = null;
    }
    return rows.size > 0;
  }
  function applyRoster(bytes) {
    const rows = readMembers(bytes);
    if (!rows) return false;
    for (const old of members) wipeMember(old);
    members = rows;
    if (pending?.memberId !== undefined) settleMember(pending.memberId);
    return true;
  }
  function removeMember(id) {
    const slot = findMember(id);
    if (slot < 0) return false;
    wipeMember(members[slot]);
    members[slot] = null;
    settleMember(id);
    return true;
  }
  function applyMember(bytes) {
    const fields = split(bytes), id = decimal(fields[1]);
    if (id === null || id < 0) return false;
    const row = readMember(fields,0);
    if (row === null) return removeMember(id);
    if (!row) return false;
    const prior = findMember(id), slot = prior < 0 ? members.indexOf(null) : prior;
    if (slot < 0) {
      wipeMember(row);
      return false;
    }
    wipeMember(members[slot]);
    members[slot] = row;
    settleMember(id);
    return true;
  }
  function inspect() {
    return version === 0 ? null : Object.freeze({ version,id:profile.id,canManage:canManage(),
      canInvite:!!(ownFlags() & invitePermission),pending:pending?.kind ?? null });
  }
  return Object.freeze({
    inspect,
    petPermissions: () => profile.petPermissions,
    receive(consumer, args) {
      let updated;
      switch (consumer) {
        case '0x4f4af0': updated = applyProfile(args[0]); break;
        case '0x4f4de0': updated = applyRoles(args[0]); break;
        case '0x4f4ef0': updated = applyRoster(args[0]); break;
        case '0x4f5150': updated = applyMember(args[1]); break;
        case '0x4f53d0': updated = removeMember(args[0]); break;
        case '0x4f5520':
          updated = profile.id !== null && profile.id >= 0 && args[0] === profile.id;
          if (updated) {
            clear();
            profile.id = -1;
          }
          break;
      }
      if (updated) version++;
      return Object.freeze({ kind:'family-state',updated:!!updated,version });
    },
    copy() {
      const info = inspect();
      if (!info) return null;
      return Object.freeze({ ...info, name:profile.name.slice(), hall:profile.hall.slice(), ownRole:profile.roleSlot,
        roles:Object.freeze(roles.filter(Boolean).map(row=>Object.freeze({ ...row,name:row.name.slice() }))),
        members:Object.freeze(members.filter(Boolean).map(row=>Object.freeze({
          ...row,name:row.name.slice(),secondaryName:row.secondaryName.slice(),...memberActions(row),
        }))) });
    },
    prepare(expected, action) {
      if (expected !== version) fail('LEGACY_GAME_FAMILY_STALE');
      const { kind,slot,permissions,memberId } = action ?? {};
      if (kind === 'remove-member' || kind === 'assign-role') {
        const row = members[findMember(memberId)];
        if (!row) fail('LEGACY_GAME_FAMILY_MEMBER');
        const allowed = memberActions(row);
        if (kind === 'remove-member' ? !allowed.canRemove : !allowed.canAssignRole) fail('LEGACY_GAME_FAMILY_PERMISSION');
        if (pending) fail('LEGACY_GAME_FAMILY_BUSY');
        if (kind === 'remove-member') {
          pending = { kind,memberId };
          return command('004f71b0',[memberId]);
        }
        if (!Number.isInteger(slot) || slot < 1 || slot >= roleCapacity || !roles[slot]?.name.length) fail('LEGACY_GAME_FAMILY_ROLE');
        if (row.roleSlot === slot) return null;
        pending = { kind,memberId,slot };
        return command('004f70d0',[memberId,slot]);
      }
      if (!canManage()) fail('LEGACY_GAME_FAMILY_PERMISSION');
      if (pending) fail('LEGACY_GAME_FAMILY_BUSY');
      let name = action?.name;
      if (kind === 'name' || kind === 'hall') {
        if (sameText(profile[kind],name)) return null;
        const request = command('004f6fd0',[kind === 'name' ? 2 : 3,encodeName(name,legacyGameFamilyNameBytes)]);
        pending = { kind };
        return request;
      }
      if (kind !== 'role' || !Number.isInteger(slot) || slot < 0 || slot >= roleCapacity ||
          !Number.isInteger(permissions) || permissions < 0 || permissions > editablePermissions) fail('LEGACY_GAME_FAMILY_ROLE');
      const row = roles[slot], before = row?.flags ?? 0, currentName = row?.name ?? empty;
      if (name === undefined) name = currentName;
      const flags = (before & ~editablePermissions) | permissions;
      if ((slot === 0 || (before & adminPermission)) && flags !== before) fail('LEGACY_GAME_FAMILY_ROLE');
      const nameMatches = sameText(currentName,name);
      if (flags === before && nameMatches) return null;
      const limit = nameMatches ? 40 : legacyGameFamilyRoleNameBytes;
      const request = command('004f7040',[slot,flags,encodeName(name,limit)]);
      pending = { kind,slot };
      return request;
    },
    clear,
  });
}

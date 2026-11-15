import {
  readLegacyGameStateDecimal as decimal, splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape,
} from './legacy-game-state.mjs';

export const legacyGameMapNpcServiceKinds = Object.freeze({
  0x05: 'merchant', 0x10: 'trainer', 0x11: 'learn', 0x12: 'forget', 0x1b: 'exchange', 0x1e: 'handoff',
});

const empty = new Uint8Array();

function number(field) {
  return field?.length ? decimal(field.subarray(0, 127)) : -1;
}

function text(field, limit) {
  return unescape(field?.subarray(0, limit) ?? empty);
}

function wrap(field, limit, columns, count, linesFor) {
  const decoded = text(field, limit);
  try {
    return linesFor(decoded, columns, count);
  } finally {
    decoded.fill(0);
  }
}

function choice(id, action, sends = true) {
  return Object.freeze({ id, action, sends });
}

function menuChoices(kind, flags) {
  if (kind === 'trainer') return [choice(1, 'learn'), choice(2, 'forget'), choice(3, 'leave', false)];
  if (kind === 'exchange') return [choice(1, 'exchange'), choice(2, 'leave', false)];
  if (kind === 'handoff') return [choice(1, flags === 0 ? 'give' : 'receive'), choice(2, 'leave')];
  const choices = [];
  if (flags & 1) choices.push(choice(1, 'buy'));
  if (flags & 2) choices.push(choice(2, 'sell'));
  // The original callback accepts only the first two displayed rows.
  choices.push(choice(3, 'leave', choices.length < 2));
  return choices;
}

function forgetRows(fields, roster) {
  const choicesBySlot = new Map(roster.occupiedSlots.map((slot, index) => [slot, index + 1]));
  const rows = [];
  for (const slot of roster.displaySlots) {
    const id = choicesBySlot.get(slot);
    const at = 3 + (id - 1) * 3;
    const firstValue = number(fields[at + 1]);
    if (firstValue < 0) continue;
    const name = text(fields[at], 21);
    if (!name.length) continue;
    rows.push({ id, slot, name, firstValue, secondValue: number(fields[at + 2]) });
  }
  return rows;
}

export function readLegacyGameMapNpcService(kind, bytes, linesFor, readSkillContext) {
  const fields = split(bytes);
  if (fields.length < 3 || (kind === 'merchant' && !fields[3]?.length)) return null;
  const handoff = kind === 'handoff';
  if (handoff && (!fields[2].length || !fields[3])) return null;
  const graphicResource = number(fields[0]);
  const title = text(fields[1], 21);
  const skillDetail = kind === 'learn' || kind === 'forget';
  const lines = wrap(handoff ? fields[3] : fields[2], handoff ? 256 : skillDetail ? 511 : 255,
    skillDetail ? 21 : 20, 5, linesFor);
  const service = { kind, graphicResource, title, lines };
  if (kind === 'learn') {
    const name = text(fields[3], 80);
    const slotUnits = number(fields[5]);
    const fee = number(fields[6]);
    if (!name.length || slotUnits < 0 || fee < 0) {
      name.fill(0);
      clearLegacyGameMapNpcService(service);
      return null;
    }
    return { ...service, name, slotUnits, fee, description: wrap(fields[4], 511, 32, 8, linesFor),
      choices: Object.freeze([choice(1, 'confirm-learn'), choice(2, 'back')]) };
  }
  if (kind === 'forget') {
    const { roster } = readSkillContext();
    return { ...service, rosterVersion: roster.version, rows: forgetRows(fields, roster),
      choices: Object.freeze([choice(99, 'back')]) };
  }
  return { ...service, choices: Object.freeze(menuChoices(kind, number(fields[handoff ? 2 : 3]))) };
}

export function copyLegacyGameMapNpcService(service) {
  const { title, lines, name, description, rows, rosterVersion, ...info } = service;
  return Object.freeze({
    ...info, title: title.slice(), lines: Object.freeze(lines.map(line => line.slice())),
    ...(name ? { name: name.slice(), description: Object.freeze(description.map(line => line.slice())) } : {}),
    ...(rows ? { rows: Object.freeze(rows.map(row => Object.freeze({ ...row, name: row.name.slice() }))) } : {}),
  });
}

export function clearLegacyGameMapNpcService(service) {
  service.title.fill(0);
  for (const line of service.lines) line.fill(0);
  service.name?.fill(0);
  for (const line of service.description ?? []) line.fill(0);
  for (const row of service.rows ?? []) row.name.fill(0);
}

import {
  readLegacyGameStateDecimal as decimal, splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape,
} from './legacy-game-state.mjs';

export const legacyGamePetTrainingSteps = Object.freeze({
  0x18: 'offer', 0x19: 'pet', 0x1a: 'slot', 0x2a: 'offer', 0x2b: 'pet', 0x2c: 'slot',
});

const empty = new Uint8Array();

function fail(code) {
  const error = new Error('The requested pet training action is unavailable.');
  error.code = code;
  throw error;
}

function number(field) {
  return field?.length ? decimal(field.subarray(0, 127)) : -1;
}

function text(field, limit) {
  return unescape(field?.subarray(0, limit) ?? empty);
}

function nameFor(field, readLimit, nameLimit) {
  const name = text(field, readLimit);
  if (name.length <= nameLimit) return name;
  name.fill(0);
  return Uint8Array.of(63, 63, 63);
}

function wrap(field, limit, columns, count, linesFor) {
  const decoded = text(field, limit);
  try {
    return linesFor(decoded, columns, count);
  } finally {
    decoded.fill(0);
  }
}

function readOffers(fields, linesFor) {
  const rows = [];
  for (let id = 0; id < 16; id++) {
    const at = 5 + id * 4;
    if (at >= fields.length - 1 || fields[at].length >= 255) break;
    const fee = number(fields[at + 2]);
    const name = nameFor(fields[at], 255, 24);
    if (!name.length || fee < 0) {
      name.fill(0);
      continue;
    }
    rows.push({ id, name, value: number(fields[at + 1]), fee,
      description: wrap(fields[at + 3], 255, 28, 2, linesFor) });
  }
  return rows;
}

function readPetRows(fields, roster, extended) {
  const at = extended ? 7 : 4, stride = extended ? 5 : 3;
  const threshold = number(fields[at - (extended ? 2 : 1)]);
  const requiredType = extended ? number(fields[6]) : -1;
  const rows = [];
  for (let id = 0; id < roster.length; id++) {
    const start = at + id * stride;
    if (start >= fields.length - 1 || fields[start].length >= 255) break;
    const name = nameFor(fields[start], 255, 16);
    if (!name.length) continue;
    const type = extended ? number(fields[start + 3]) : -1;
    const hintFlag = extended ? number(fields[start + 4]) & 255 : 1;
    const value = number(fields[start + 1]), capacity = number(fields[start + 2]);
    const eligible = value >= threshold && (requiredType < 0 || type === requiredType) &&
      capacity >= 0 && capacity <= 10;
    rows.push({ id, slot: roster[id].slot, name, value, capacity, type, hintFlag, eligible });
  }
  return { rows, threshold, requiredType };
}

function readSlots(fields, capacity, linesFor) {
  return Array.from({ length: capacity }, (_, id) => {
    const at = 3 + id * 3;
    const name = nameFor(fields[at], 511, 16);
    return { id, name, occupied: name.length > 0, value: name.length ? number(fields[at + 1]) : null,
      description: name.length ? wrap(fields[at + 2], 511, 28, 2, linesFor) : [] };
  });
}

function samePet(a, b) {
  return a && b && a.slot === b.slot && a.identity === b.identity;
}

export function readLegacyGamePetTraining(mode, bytes, linesFor, progress, roster) {
  const step = legacyGamePetTrainingSteps[mode];
  const fields = split(bytes);
  const groups = step === 'offer' || mode === 0x2b ? 3 : 1;
  if (fields.length < (step === 'pet' ? (mode === 0x2b ? 7 : 4) : 2 + groups)) return null;
  const slotStep = step === 'slot';
  const model = {
    step, graphicResource: number(fields[0]), title: text(fields[1], slotStep ? 21 : 16),
    lines: fields.slice(2, 2 + groups).flatMap(field =>
      wrap(field, slotStep ? 511 : 255, slotStep ? 21 : 20, slotStep ? 5 : 4, linesFor)),
  };
  if (step === 'offer') return { ...model, rows: readOffers(fields, linesFor) };
  if (step === 'pet') return { ...model, roster, ...readPetRows(fields, roster, mode === 0x2b) };
  const live = roster[progress.pet.id];
  return { ...model, pet: samePet(live, progress.pet) ? live : null,
    rows: readSlots(fields, progress.pet.capacity, linesFor) };
}

export function legacyGamePetTrainingStale(model, progress, roster) {
  if (model.step === 'pet') {
    return model.roster.length !== roster.length || model.roster.some((pet, id) => !samePet(pet, roster[id]));
  }
  if (model.step === 'slot') {
    const pet = roster[progress.pet.id];
    return !samePet(model.pet, pet) || model.pet.skills !== pet.skills;
  }
  return false;
}

export function copyLegacyGamePetTraining(model, progress) {
  const { title, lines, rows, roster, pet, ...info } = model;
  return Object.freeze({
    ...info, title: title.slice(), lines: Object.freeze(lines.map(line => line.slice())),
    rows: Object.freeze(rows.map(({ name, description, ...row }) => Object.freeze({
      ...row, name: name.slice(), ...(description ? { description: Object.freeze(description.map(line => line.slice())) } : {}),
    }))),
    ...(progress ? { lesson: Object.freeze({ name: progress.lesson.name.slice(), fee: progress.lesson.fee }) } : {}),
    ...(progress?.pet ? { selectedPet: Object.freeze({ name: progress.pet.name.slice(), slot: progress.pet.slot,
      capacity: progress.pet.capacity }) } : {}),
  });
}

export function clearLegacyGamePetTraining(model) {
  model.title.fill(0);
  for (const line of model.lines) line.fill(0);
  for (const row of model.rows) {
    row.name.fill(0);
    for (const line of row.description ?? []) line.fill(0);
  }
}

export function prepareLegacyGamePetTraining(model, progress, button, choice, context) {
  if (button === 2 && choice === null) return { body: model.step === 'offer' ? null : '', next: null };
  if (button !== 0) fail('LEGACY_GAME_DIALOG_CHOICE');
  const row = model.rows.find(entry => entry.id === choice);
  if (!row) fail('LEGACY_GAME_DIALOG_CHOICE');
  const { gold, roster } = context;
  if (legacyGamePetTrainingStale(model, progress, roster)) fail('LEGACY_GAME_PET_TRAINING_STALE');
  let next = null;
  if (model.step === 'offer') {
    if (row.fee > (gold ?? 0)) fail('LEGACY_GAME_PET_TRAINING_BALANCE');
    if (!roster.length) fail('LEGACY_GAME_PET_TRAINING_NO_PET');
    next = { step: 'pet', lesson: { name: row.name.slice(), fee: row.fee } };
  } else if (model.step === 'pet') {
    if (!row.eligible) fail('LEGACY_GAME_DIALOG_CHOICE');
    next = { step: 'slot', lesson: { ...progress.lesson, name: progress.lesson.name.slice() },
      pet: { ...roster[row.id], id: row.id, name: row.name.slice(), capacity: row.capacity } };
  }
  return { body: String(row.id), next };
}

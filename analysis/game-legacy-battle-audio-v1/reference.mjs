/** Independent source equations and authored observation ports; never imports the implementation. */
import { readFileSync } from 'node:fs';
import { cueBytes, observeAudio } from '../game-legacy-audio-v1/original-audio.mjs';
export const source = JSON.parse(readFileSync(new URL('./source-check.json', import.meta.url)));
export const frame = (steps, body = [], input = [], generation = 1) => ({ generation, steps,
  callbacks: { body: { events: body.map(([value, x = 320]) => ({ kind: 'sound', value, position: [x, 240] })) } },
  input: { sounds: input } });

export function originalPanTable() {
  const table = Array(128).fill(0), reference = Math.trunc(5000 * Math.log(127) / Math.log(100));
  let right = 64, left = 64;
  for (let word = 127; word >= 0; word--) if (word & 1) {
    let attenuation = reference - Math.trunc(5000 * Math.log(word) / Math.log(100));
    if (attenuation > 5000) attenuation = 10000;
    table[right++] = attenuation;
    table[left--] = -attenuation;
  }
  table[0] = -10000; table[127] = 10000; table[64] = 0;
  return table;
}

export function originalSelection(frames) {
  const rows = new Map(source.catalog.map(row => [row.id, row])), blocked = new Map();
  const pans = originalPanTable();
  let update = 0, generation = 0, step = 0, channel = 0;
  return frames.map(f => {
    if (f.generation < generation || f.generation === generation && f.steps <= step) return null;
    update++; generation = f.generation; step = f.steps;
    const signals = [...f.callbacks.body.events.map(e => [e.value, e.position[0]]), ...f.input.sounds.map(id => [id, 320])];
    const cues = [];
    for (const [id, x] of signals) {
      if (!rows.has(id) || (blocked.get(id) ?? 0) > update || !Number.isFinite(x)) continue;
      const index = Math.min(127, Math.max(0, Math.trunc(x / 5))), db = pans[index];
      cues.push({ ...rows.get(id), pan: { index, hundredthsDb: db,
        left: db > 0 ? 10 ** (-db / 2000) : 1, right: db < 0 ? 10 ** (db / 2000) : 1 }, voice: channel });
      channel = (channel + 1) % 64; blocked.set(id, update + 5);
    }
    return { generation, steps: step, updates: update, cues };
  });
}

export function originalFrames() {
  const frames = [frame(1, [[134, -10], [134, 600], [255, 320], [0, 0]], [56, 56, 57]),
    ...Array.from({ length: 5 }, (_, i) => frame(i + 2, [[134, 640]], [56])), frame(6), frame(5)];
  for (let i = 0; i < 30; i++) {
    const sounds = source.catalog.slice(i * 9, i * 9 + 9).map((r, n) => [r.id, (i * 31 + n * 67) % 700 - 30]);
    frames.push(frame(i + 7, sounds, [55, 55, 56]));
  }
  frames.push(frame(1, [[134, 120]], [57], 2), frame(40, [[255, 100]], [], 1));
  return frames;
}

export function observeSoundAudio() {
  const out = observeAudio(), createBuffer = out.context.createBuffer;
  out.context.createBuffer = (...args) => {
    const buffer = createBuffer(...args);
    buffer.getChannelData = channel => buffer.samples[channel];
    return buffer;
  };
  return out;
}

export const soundFiles = (ids = [51, 55, 56, 57, 134, 202, 255, 263]) => source.catalog
  .filter(row => ids.includes(row.id)).map(row => ({ path: 'Bin/' + row.path, bytes: cueBytes() }));

export function taggedSoundRows() {
  const ids = [1, 51, 55, 56, 57, 60, 64, 132, 134, 207, 208, 210, 214, 254, 255, 259, 261, 263, 267, 268, 269];
  const paths = new Map(source.catalog.filter(row => ids.includes(row.id)).map(row => [row.path, row]));
  return [...paths.values()].map(row => {
    const bytes = cueBytes(), view = new DataView(bytes.buffer);
    for (let at = 44; at < bytes.length; at += 2) view.setInt16(at, (row.id + 1) * 64, true);
    return { path: 'Bin/' + row.path, bytesHex: Buffer.from(bytes).toString('hex') };
  });
}

export function verifyPlayedSounds(rows, muted) {
  if (muted) { if (rows.length) throw Error('Muted source sound played'); return { muted: true, starts: 0 }; }
  for (const id of [56, 57, 1]) if (!rows.some(row => row.id === id)) throw Error('Source sound missing: ' + id + ';observed=' + rows.map(row => row.id));
  if (!rows.some(row => row.id === 1 && row.channels === 2 && row.left !== row.right)) throw Error('Spatial source hit missing');
  for (const row of rows) {
    const metadata = source.catalog.find(c => c.id === row.id);
    if (!metadata || row.rate !== 22050 || Math.max(row.left, row.right) !== (row.id + 1) / 512) throw Error('Wrong authored sound PCM');
  }
  return { muted: false, starts: rows.length, ids: [...new Set(rows.map(row => row.id))],
    hitSpatial: true, PCM: true };
}

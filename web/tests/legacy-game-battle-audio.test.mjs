import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as flush } from 'node:timers/promises';
import { createLegacyGameResourcePlan } from '../../shared/legacy-game-resource-paths.mjs';
import { createLegacyGameAudioHost } from '../legacy-game-audio-host.mjs';
import { legacyGameAudioGain } from '../../shared/legacy-game-audio.mjs';
import { source, frame, observeSoundAudio, soundFiles } from '../../analysis/game-legacy-battle-audio-v1/reference.mjs';
import { musicBytes } from '../../analysis/game-legacy-audio-v1/original-audio.mjs';

function fixture({ rows = soundFiles(), config = '', gate = async () => {} } = {}) {
  const output = observeSoundAudio(), reads = [], wiped = [];
  const files = new Map(rows.map(row => [row.path, row.bytes]));
  const host = createLegacyGameAudioHost({ context: output.context,
    plan: createLegacyGameResourcePlan(new TextEncoder().encode(config)), clock: () => 0,
    schedule: () => null, cancel() {}, files: {
      async stat(path) { return files.get(path)?.length ?? null; },
      async read(path, at, size) {
        assert.equal(at, 0); const bytes = files.get(path).slice(); assert.equal(bytes.length, size);
        reads.push(path); wiped.push(bytes); await gate(path); return bytes;
      },
    } });
  return { host, output, reads, wiped };
}

test('real decoded mono PCM duplicates to stereo and attenuates only the source pan channel', async () => {
  const f = fixture();
  f.host.battle(frame(1, [[134, 0], [255, 640]], [56])); await flush();
  assert.equal(f.output.starts.length, 3);
  const [left, right, center] = f.output.starts;
  assert.equal(left.buffer.samples.length, 2); assert.equal(right.buffer.samples.length, 2);
  assert.equal(left.buffer.samples[0][0], -0.5); assert.equal(left.buffer.samples[1][0], Math.fround(-0.5e-5));
  assert.equal(right.buffer.samples[0][0], Math.fround(-0.5e-5)); assert.equal(right.buffer.samples[1][0], -0.5);
  assert.equal(center.buffer.samples[0][0], -0.5);
  for (const [node, id] of [[left, 134], [right, 255], [center, 56]]) {
    assert.deepEqual(node.connected.changes, [legacyGameAudioGain(source.catalog.find(row => row.id === id).level)]);
    assert.equal(node.loop, false); assert.equal(node.buffer.sampleRate, 22050);
  }
  assert.ok(f.wiped.every(bytes => bytes.every(n => n === 0)));
  f.host.close(); assert.ok(f.output.starts.every(node => node.stopped && node.disconnected));
  assert.equal(f.output.closed, 1);
});

test('stereo source channels remain independent under native attenuation', async () => {
  const f = fixture({ rows: [{ path: 'Bin/se/cgply11b.wav', bytes: musicBytes() }] });
  f.host.battle(frame(1, [[134, 640]])); await flush();
  const [sound] = f.output.starts;
  assert.equal(sound.buffer.samples[0][0], Math.fround(0.75e-5));
  assert.equal(sound.buffer.samples[1][0], -0.25);
  assert.equal(sound.buffer.sampleRate, 44100); assert.equal(sound.loop, false);
  f.host.close();
});

test('one selected source frame stays ordered across reversed resource-read completion', async () => {
  let unblock; const waiting = new Promise(resolve => { unblock = resolve; });
  const f = fixture({ gate: path => path.includes('cgply') ? waiting : undefined });
  const first = frame(1, [[134, 0], [255, 640]], [56]);
  f.host.battle(first); f.host.battle(first); await flush(); assert.equal(f.output.starts.length, 0);
  unblock(); await flush();
  assert.deepEqual(f.output.starts.map(node => node.buffer.samples.length), [2, 2, 1]);
  for (let step = 2; step < 6; step++) f.host.battle(frame(step, [[134, 0], [255, 640]], [56]));
  await flush(); assert.equal(f.output.starts.length, 3);
  f.host.battle(frame(6, [[134, 0], [255, 640]], [56])); await flush();
  assert.equal(f.output.starts.length, 6);
  assert.equal(f.reads.length, 3); f.host.close();
});

test('64 unprotected native slots replace their own previous one-shot voices', async () => {
  const rows = soundFiles(source.catalog.map(row => row.id)), f = fixture({ rows });
  f.host.battle(frame(1, source.catalog.slice(0, 64).map(row => [row.id, 320]))); await flush();
  assert.equal(f.output.starts.length, 64);
  f.host.battle(frame(2, source.catalog.slice(64, 128).map(row => [row.id, 320]))); await flush();
  assert.equal(f.output.starts.length, 128);
  assert.ok(f.output.starts.slice(0, 64).every(node => node.stopped && node.disconnected));
  assert.ok(f.output.starts.slice(64).every(node => !node.stopped)); f.host.close();
});

for (const reason of ['pause', 'generation', 'expired', 'close']) test('slow output never replays a stale sound after ' + reason, async () => {
  let unblock; const waiting = new Promise(resolve => { unblock = resolve; });
  const f = fixture({ gate: () => waiting });
  f.host.battle(frame(1, [[134, 0]])); await flush();
  if (reason === 'pause') f.host.sync({ state: 'battle-pending', paused: true });
  if (reason === 'generation') f.host.battle(frame(1, [], [], 2));
  if (reason === 'expired') for (let i = 2; i <= 6; i++) f.host.battle(frame(i));
  if (reason === 'close') f.host.close();
  unblock(); await flush();
  assert.equal(f.output.starts.length, 0); assert.ok(f.wiped.every(bytes => bytes.every(n => n === 0)));
  f.host.close();
});

test('soundoff,missing WAV and unavailable PCM output preserve optional playback', async () => {
  for (const options of [{ config: 'soundoff' }, { rows: [] },
    { rows: [{ path: 'Bin/se/cgply11b.wav', bytes: new Uint8Array(44) }] }]) {
    const f = fixture(options); f.host?.battle(frame(1, [[134, 0]])); await flush();
    assert.equal(f.output.starts.length, 0); f.host?.close();
    assert.ok(f.wiped.every(bytes => bytes.every(n => n === 0)));
  }
  const f = fixture(); f.output.context.createBufferSource = () => { throw Error('output unavailable'); };
  f.host.battle(frame(1, [[134, 0]])); await flush(); assert.equal(f.output.starts.length, 0); f.host.close();
});

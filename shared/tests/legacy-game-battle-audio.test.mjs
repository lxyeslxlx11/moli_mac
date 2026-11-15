import test from 'node:test';
import assert from 'node:assert/strict';
import { createLegacyGameBattleAudio, legacyGameSound, legacyGameSoundPan } from '../legacy-game-battle-audio.mjs';
import { source, frame, originalFrames, originalPanTable, originalSelection } from '../../analysis/game-legacy-battle-audio-v1/reference.mjs';

test('all270 source sound IDs and all absent IDs retain exact file metadata', () => {
  const expected = new Map(source.catalog.map(row => [row.id, row]));
  for (let id = -1; id <= 501; id++) assert.deepEqual(legacyGameSound(id), expected.get(id));
  for (const invalid of [NaN, Infinity, '56', 56.5, null]) assert.equal(legacyGameSound(invalid), undefined);
  assert.ok(Object.isFrozen(legacyGameSound(56)));
});

test('every native pan cell and its coordinate boundaries preserve one-channel attenuation', () => {
  const table = originalPanTable();
  for (let x = -25; x <= 665; x++) {
    const pan = legacyGameSoundPan(x), index = Math.min(127, Math.max(0, Math.trunc(x / 5)));
    assert.equal(pan.hundredthsDb, table[index]);
    assert.equal(pan.index, index);
    assert.equal(Math.max(pan.left, pan.right), 1);
    assert.equal(Math.min(pan.left, pan.right), 10 ** (-Math.abs(table[index]) / 2000));
  }
  assert.equal(legacyGameSoundPan(-2147483648).hundredthsDb, -10000);
  assert.equal(legacyGameSoundPan(2147483647).hundredthsDb, 10000);
  assert.deepEqual(legacyGameSoundPan(0, false), { index: 64, hundredthsDb: 0, left: 1, right: 1 });
});

test('source equations match complete ordered cues,cooldown,64-slot wrap and stale generations', () => {
  const audio = createLegacyGameBattleAudio(), inputs = originalFrames();
  assert.deepEqual(inputs.map(f => audio.advance(f)), originalSelection(inputs));
  audio.close(); audio.close(); assert.equal(audio.advance(frame(100)), null);
});

test('five source updates and first-writer priority survive duplicate output and new generations', () => {
  const a = createLegacyGameBattleAudio();
  assert.deepEqual(a.advance(frame(1, [[56, 0]], [56])).cues.map(c => [c.id, c.pan.index]), [[56, 0]]);
  assert.equal(a.advance(frame(1, [], [56])), null);
  for (let step = 2; step < 6; step++) assert.equal(a.advance(frame(step, [], [56])).cues.length, 0);
  assert.equal(a.advance(frame(6, [], [56])).cues.length, 1);
  assert.equal(a.advance(frame(1, [], [56], 2)).cues.length, 0);
  a.close();
});

test('malformed or unpositioned audio cannot synthesize a playable source cue', () => {
  const a = createLegacyGameBattleAudio();
  assert.throws(() => a.advance(frame(0)), /LEGACY_AUDIO_FRAME/);
  const f = frame(1); f.callbacks.body.events = [{ kind: 'signal', value: 56, position: [0, 0] },
    { kind: 'sound', value: 56 }, { kind: 'sound', value: 134, position: [NaN, 0] }];
  assert.equal(a.advance(f).cues.length, 0);
  assert.throws(() => legacyGameSoundPan(NaN), /LEGACY_AUDIO_POSITION/);
  a.close();
});

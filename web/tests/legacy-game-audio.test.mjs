import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setImmediate as flush } from 'node:timers/promises';
import { createLegacyGameResourcePlan } from '../../shared/legacy-game-resource-paths.mjs';
import {
  fillLegacyGamePcmChannel, legacyGameAudioGain, legacyGameBattleMusic, legacyGameSceneMusic, parseLegacyGameWave,
  LEGACY_GAME_DEFAULT_SCENE_MUSIC, LEGACY_GAME_LOBBY_MUSIC, LEGACY_GAME_MUSIC_RATE, LEGACY_GAME_RETURN_SOUND,
} from '../../shared/legacy-game-audio.mjs';
import { createLegacyGameAudioHost, openLegacyGameAudioContext } from '../legacy-game-audio-host.mjs';
import { cueBytes, musicBytes, observeAudio } from '../../analysis/game-legacy-audio-v1/original-audio.mjs';

const source = JSON.parse(readFileSync(new URL('../../analysis/game-legacy-audio-v1/source-check.json', import.meta.url)));
const phaseSource = JSON.parse(readFileSync(new URL('../../analysis/game-legacy-music-phases-v1/source-check.json', import.meta.url)));
const scene = sceneMusicCode => ({ state: 'playing', sceneReady: true, sceneMusicCode });
const returnNotice = { state: 'returning-server' };
const plan = (text = '') => createLegacyGameResourcePlan(Uint8Array.from(Buffer.from(text)));

test('the complete scene selector and return cue match the fixed PE tables', () => {
  assert.equal(LEGACY_GAME_MUSIC_RATE, source.music.default_rate);
  assert.deepEqual(LEGACY_GAME_RETURN_SOUND, { path: source.cue.path, level: source.cue.level });
  for (const row of source.music.selectors) {
    const track = source.music.tracks[row.track];
    assert.deepEqual(legacyGameSceneMusic(row.code), track ? { path: track.path, level: track.level, loop: track.mode === 2 } : null);
  }
  for (const missing of [null, 0, -1, 199, 245, 2147483647]) assert.equal(legacyGameSceneMusic(missing), undefined);
  assert.equal(legacyGameAudioGain(100), 1);
  assert.equal(legacyGameAudioGain(90), 10 ** (-217 / 2000));
  assert.equal(legacyGameAudioGain(89), 10 ** (-240 / 2000));
  assert.equal(legacyGameAudioGain(0), 0);
});

test('lobby and battle music match the fixed choices and both inclusive override ranges', () => {
  const { tracks, battle, lobby } = phaseSource;
  assert.equal(LEGACY_GAME_LOBBY_MUSIC.path, tracks[lobby.track]);
  assert.equal(LEGACY_GAME_DEFAULT_SCENE_MUSIC.path, tracks[0]);
  const [firstBackground, lastBackground] = battle.special_background;
  const [firstMap, lastMap] = battle.map_override;
  for (let mode = 1; mode <= 6; mode++) {
    for (const sceneMode of [0, 1, 2]) {
      for (const background of [firstBackground - 1, firstBackground, lastBackground, lastBackground + 1]) {
        const special = background === firstBackground || background === lastBackground;
        const list = sceneMode === 1 ? battle.tables[special ? 'special' : 'mode1'].tracks : battle.other;
        for (const mapId of [firstMap - 1, firstMap, lastMap, lastMap + 1]) {
          const expected = mapId === firstMap || mapId === lastMap ? battle.override_track : list[mode - 1];
          assert.equal(legacyGameBattleMusic(mode, background, sceneMode, mapId).path, tracks[expected]);
        }
      }
    }
  }
  assert.equal(legacyGameBattleMusic(7, 1000, 0, firstMap - 1), undefined);
  assert.equal(legacyGameBattleMusic(7, 1000, 0, firstMap).path, tracks[battle.override_track]);
});

test('PCM handles 8-bit stereo, 16-bit mono, padded chunks and the exclusive sample endpoint', () => {
  const music = parseLegacyGameWave(musicBytes(), true);
  assert.deepEqual([music.channels, music.rate, music.bits, music.frames], [2, 44100, 8, 22050]);
  assert.deepEqual(music.loop, { start: 2205, end: 11025 });
  const scratch = new Float32Array(2);
  fillLegacyGamePcmChannel(music, 0, 4, scratch);
  assert.deepEqual([...scratch], [0.75, -0.75]);
  fillLegacyGamePcmChannel(music, 1, 4, scratch);
  assert.deepEqual([...scratch], [-0.25, -0.25]);
  const cue = parseLegacyGameWave(cueBytes(), false);
  assert.deepEqual([cue.channels, cue.rate, cue.bits, cue.frames, cue.loop], [1, 22050, 16, 2205, null]);
  fillLegacyGamePcmChannel(cue, 0, 4, scratch);
  assert.deepEqual([...scratch], [-0.5, 0.25]);
  const metadataTail = musicBytes();
  new DataView(metadataTail.buffer).setUint32(4, metadataTail.length + 54, true);
  assert.deepEqual(parseLegacyGameWave(metadataTail, true).loop, music.loop);
});

test('PCM rejects truncated RIFF and chunks, mismatched format, missing or invalid loops', () => {
  const valid = musicBytes();
  const invalid = { code: 'LEGACY_ASSET_WAVE' };
  assert.throws(() => parseLegacyGameWave(valid.subarray(0, -1), true), invalid);
  assert.throws(() => parseLegacyGameWave(cueBytes(), true), invalid);
  for (const [offset, word] of [[16, 0xffffffff], [28, 1], [valid.length - 12, 0xffffffff]]) {
    const damaged = valid.slice();
    new DataView(damaged.buffer).setUint32(offset, word, true);
    assert.throws(() => parseLegacyGameWave(damaged, true), invalid);
  }
});

function fixture(text, read) {
  const output = observeAudio(), timers = new Map(), reads = [], wiped = [];
  const entries = new Map([
    ['Art/se/cgsys09.wav', cueBytes()], ['Art/bgm/cgbgm_m0.wav', musicBytes()], ['Art/bgm/cgbgm_m1.wav', musicBytes()],
    ['Art/bgm/cgbgm_t0.wav', musicBytes()], ['Art/bgm/cgbgm_b0.wav', musicBytes()],
  ]);
  let tick = 0xfffffff9;
  const host = createLegacyGameAudioHost({
    context: openLegacyGameAudioContext(() => output.context), plan: plan('binfolder:Art ' + text),
    files: {
      async stat(path) { return entries.get(path)?.length ?? null; },
      async read(path, offset, size) {
        assert.equal(offset, 0);
        reads.push(path);
        await read?.(path);
        const copy = entries.get(path).slice();
        assert.equal(copy.length, size);
        wiped.push(copy);
        return copy;
      },
    },
    clock: () => tick,
    schedule(fn, wait) { const handle = {}; timers.set(handle, { fn, wait }); return handle; },
    cancel(handle) { timers.delete(handle); },
  });
  return { host, output, reads, wiped, timers, fire() {
    const [handle, timer] = timers.entries().next().value;
    timers.delete(handle);
    tick = (tick + timer.wait) >>> 0;
    timer.fn();
  } };
}

test('exit plays one center cue and drops music one level per tick across clock wrap', async () => {
  const { host, output, reads, wiped, timers, fire } = fixture('');
  host.sync(scene(200));
  await flush();
  const [music] = output.starts;
  assert.deepEqual([music.buffer.sampleRate, music.loopStart, music.loopEnd], [22050, 0.1, 0.5]);
  assert.equal(music.loop, true);
  host.sync(scene(0)); host.sync(scene(999)); host.sync(scene(200));
  host.sync(returnNotice); host.sync(returnNotice);
  await flush();
  assert.deepEqual(reads, ['Art/se/cgsys09.wav', 'Art/bgm/cgbgm_m0.wav']);
  assert.equal(output.starts.length, 2);
  const cue = output.starts[1];
  assert.equal(cue.loop, false);
  assert.equal(cue.buffer.samples[0][0], -0.5);
  assert.deepEqual(cue.connected.changes, [1]);
  for (let i = 0; i < 90; i++) fire();
  assert.deepEqual(music.connected.changes, Array.from({ length: 91 }, (_, i) => legacyGameAudioGain(90 - i)));
  assert.equal(music.stopped, false);
  fire();
  assert.equal(music.stopped, true);
  assert.equal(timers.size, 0);
  assert.ok(wiped.every(bytes => bytes.every(byte => byte === 0)));
  cue.onended();
  assert.equal(cue.disconnected, true);
  host.close(); host.close();
  assert.equal(output.closed, 1);
});

test('scene selection serializes replacements and stop never plays a stale load', async () => {
  let unblock;
  const pending = new Promise(resolve => { unblock = resolve; });
  const { host, output, reads } = fixture('soundoff', path => path.includes('m0') ? pending : undefined);
  host.sync(scene(200)); await flush();
  host.sync(scene(201)); await flush();
  assert.deepEqual(reads, ['Art/bgm/cgbgm_m0.wav']);
  unblock(); await flush();
  assert.deepEqual(reads, ['Art/bgm/cgbgm_m0.wav', 'Art/bgm/cgbgm_m1.wav']);
  assert.equal(output.starts.length, 1);
  host.sync(scene(218));
  assert.equal(output.starts[0].stopped, true);
  host.sync(returnNotice); await flush();
  assert.equal(output.starts.length, 1);
  host.close();
});

test('music mute and closed sessions leave resources and pending output isolated', async () => {
  let unblock;
  const pending = new Promise(resolve => { unblock = resolve; });
  const { host, output, reads, wiped } = fixture('musicoff', () => pending);
  host.sync(scene(200)); host.sync(returnNotice); await flush();
  assert.deepEqual(reads, ['Art/se/cgsys09.wav']);
  host.close(); unblock(); await flush();
  assert.equal(output.closed, 1);
  assert.equal(output.starts.length, 0);
  assert.ok(wiped.every(bytes => bytes.every(byte => byte === 0)));
  const muted = fixture('soundoff musicoff');
  assert.equal(muted.host, null);
  assert.equal(muted.output.closed, 1);
  assert.deepEqual(muted.reads, []);
});

test('lobby fades on character selection and battle resumes the map at rebuild', async () => {
  const { host, output, reads, timers, fire } = fixture('soundoff');
  host.sync({ state: 'connecting' }); await flush();
  const [lobby] = output.starts;
  host.sync({ state: 'choosing' }); await flush();
  assert.equal(output.starts.length, 1);
  host.sync({ state: 'characters', session: { characters: { nativeMainPhase: 5 } } });
  fire();
  assert.ok(lobby.connected.changes.at(-1) < lobby.connected.changes[0]);
  host.sync(scene(null)); await flush();
  assert.equal(lobby.stopped, true);
  assert.equal(timers.size, 0);
  const [_, map] = output.starts;
  const battle = { ...scene(null), state: 'battle-pending' };
  host.sync(battle); await flush();
  assert.equal(map.stopped, false);
  const play = { kind: 'play', track: legacyGameBattleMusic(1, 1000, 0, 23) };
  host.sync({ ...battle, battleMusic: play }); await flush();
  assert.equal(map.stopped, true);
  const combat = output.starts[2];
  const changed = { ...battle, sceneMusicCode: 201 };
  host.sync({ ...changed, battleMusic: play }); await flush();
  assert.equal(output.starts.length, 3);
  const fade = { kind: 'fade' };
  host.sync({ ...changed, battleMusic: fade }); fire();
  const stale = timers.values().next().value.fn;
  host.sync({ ...changed, battleMusic: fade });
  host.sync({ ...changed, battleMusic: { kind: 'restore' } }); await flush();
  stale();
  host.sync(scene(201)); await flush();
  assert.equal(combat.stopped, true);
  assert.deepEqual(output.starts.map(node => node.stopped), [true, true, true, false]);
  assert.deepEqual(reads, ['Art/bgm/cgbgm_t0.wav', 'Art/bgm/cgbgm_m0.wav', 'Art/bgm/cgbgm_b0.wav', 'Art/bgm/cgbgm_m1.wav']);
  assert.equal(timers.size, 0);
  host.sync({ ...battle, battleMusic: { ...play } }); await flush();
  host.sync({ ...battle, battleMusic: { ...fade } }); fire();
  host.sync({ ...battle, battleMusic: { kind: 'restore' } }); await flush();
  assert.deepEqual(reads.slice(-2), ['Art/bgm/cgbgm_b0.wav', 'Art/bgm/cgbgm_m1.wav']);
  assert.equal(output.starts.length, 6);
  assert.equal(output.starts[5].stopped, false);
  host.close();
});

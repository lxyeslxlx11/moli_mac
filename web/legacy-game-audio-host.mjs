/** Own one optional Web Audio context and its nodes for the game session. */
import {
  fillLegacyGamePcmChannel, legacyGameAudioGain, legacyGameSceneMusic, parseLegacyGameWave,
  LEGACY_GAME_DEFAULT_SCENE_MUSIC, LEGACY_GAME_LOBBY_MUSIC, LEGACY_GAME_MUSIC_RATE,
  LEGACY_GAME_RETURN_SOUND, LEGACY_GAME_WAVE_LIMIT,
} from '../shared/legacy-game-audio.mjs';
import { LEGACY_GAME_CLOCK_PROFILE } from '../shared/legacy-game-clock.mjs';
import { legacyGameResourceAudio } from '../shared/legacy-game-resource-paths.mjs';
import { assetPath } from '../shared/legacy-game-resource-values.mjs';
import { createLegacyGameBattleAudio } from '../shared/legacy-game-battle-audio.mjs';

const period = LEGACY_GAME_CLOCK_PROFILE.period;

export function closeLegacyGameAudioContext(context) {
  try { Promise.resolve(context?.close()).catch(() => {}); } catch { /* Optional output port. */ }
}

export function openLegacyGameAudioContext(create) {
  let context;
  try {
    context = create();
    if (!context?.createBuffer || !context.createBufferSource || !context.createGain) {
      closeLegacyGameAudioContext(context);
      return null;
    }
    Promise.resolve(context.resume()).catch(() => {});
    return context;
  } catch {
    closeLegacyGameAudioContext(context);
    return null;
  }
}

export function createLegacyGameAudioHost({ context, files, plan, clock, schedule, cancel }) {
  if (!context) return null;
  const options = legacyGameResourceAudio(plan);
  if (!options.sound && !options.music) {
    closeLegacyGameAudioContext(context);
    return null;
  }
  const voices = new Set();
  const soundSelector = options.sound ? createLegacyGameBattleAudio() : null;
  const soundSlots = Array(64).fill(null), soundCache = new Map();
  const soundCacheLimit = 32 * 1024 * 1024;
  let soundUpdates = 0, soundGeneration = 0, cachedSoundBytes = 0, soundEpoch = 0, battleAudible = true;
  let closed = false, returning = false, wanted = null, music = null, readingMusic = false, fadeTimer = null;
  let sceneTrack = LEGACY_GAME_DEFAULT_SCENE_MUSIC, battleMusic = null, leavingLobby = false, cityReturn = false;
  let cue = options.sound ? load(LEGACY_GAME_RETURN_SOUND, null, 256 * 1024, () => !closed).catch(() => null) : null;

  async function load(track, rate, limit, current, pcmLimit = Infinity) {
    const path = assetPath(plan.directory + '/' + track.path);
    const size = await files.stat(path);
    if (!current() || !Number.isInteger(size) || size < 12 || size > limit) return null;
    const bytes = await files.read(path, 0, size);
    try {
      if (!current() || bytes.byteLength !== size) return null;
      const wave = parseLegacyGameWave(bytes, track.loop);
      if (wave.channels * wave.frames * 4 > pcmLimit) return null;
      const sampleRate = rate ?? wave.rate;
      const buffer = context.createBuffer(wave.channels, wave.frames, sampleRate);
      const scratch = new Float32Array(Math.min(wave.frames, 65536));
      try {
        for (let channel = 0; channel < wave.channels; channel++) {
          for (let frame = 0; frame < wave.frames; frame += scratch.length) {
            const output = scratch.subarray(0, Math.min(scratch.length, wave.frames - frame));
            fillLegacyGamePcmChannel(wave, channel, frame, output);
            buffer.copyToChannel(output, channel, frame);
          }
        }
      } finally { scratch.fill(0); }
      return { buffer, sampleRate, loop: wave.loop, channels: wave.channels, frames: wave.frames };
    } finally { bytes.fill(0); }
  }

  function release(voice, stop) {
    if (!voices.delete(voice)) return;
    if (voice === music) music = null;
    const { source, gain } = voice;
    try { source.onended = null; } catch { /* The node may already be closed. */ }
    if (stop) { try { source.stop(); } catch { /* The node may already have ended. */ } }
    try { source.disconnect(); } catch { /* The node may already be disconnected. */ }
    try { gain.disconnect(); } catch { /* The node may already be disconnected. */ }
  }

  function play(decoded, level) {
    const source = context.createBufferSource(), gain = context.createGain();
    const voice = { source, gain, level };
    voices.add(voice);
    try {
      source.buffer = decoded.buffer;
      if (decoded.loop) {
        source.loop = true;
        source.loopStart = decoded.loop.start / decoded.sampleRate;
        source.loopEnd = decoded.loop.end / decoded.sampleRate;
      }
      source.onended = () => release(voice, false);
      gain.gain.value = legacyGameAudioGain(level);
      source.connect(gain);
      gain.connect(context.destination);
      source.start();
      return voice;
    } catch (error) {
      release(voice, true);
      throw error;
    }
  }

  async function readLatestMusic() {
    readingMusic = true;
    try {
      while (!closed && !returning && wanted) {
        const track = wanted;
        const current = () => !closed && !returning && wanted === track;
        try {
          const decoded = await load(track, LEGACY_GAME_MUSIC_RATE, LEGACY_GAME_WAVE_LIMIT, current);
          if (current() && decoded) music = play(decoded, track.level);
        } catch { /* Missing audio or an unavailable output port leaves game state intact. */ }
        if (current()) return;
      }
    } finally { readingMusic = false; }
  }

  async function playReturnCue() {
    const decoded = await cue;
    if (closed || !decoded) return;
    try { play(decoded, LEGACY_GAME_RETURN_SOUND.level); } catch { /* Optional output port. */ }
  }

  function readSound(cue) {
    let entry = soundCache.get(cue.id);
    if (entry) {
      soundCache.delete(cue.id); soundCache.set(cue.id, entry);
      return entry.promise;
    }
    entry = { bytes: 0, promise: null };
    soundCache.set(cue.id, entry);
    entry.promise = load(cue, null, LEGACY_GAME_WAVE_LIMIT, () => !closed, soundCacheLimit)
      .catch(() => null).then(decoded => {
        if (closed) return null;
        if (soundCache.get(cue.id) !== entry) return decoded;
        entry.bytes = decoded ? decoded.frames * decoded.channels * 4 : 0;
        cachedSoundBytes += entry.bytes;
        while (cachedSoundBytes > soundCacheLimit) {
          const [key, oldest] = soundCache.entries().next().value;
          soundCache.delete(key); cachedSoundBytes -= oldest.bytes;
        }
        return decoded;
      });
    return entry.promise;
  }

  function panSound(decoded, pan) {
    if (pan.hundredthsDb === 0) return decoded;
    // A stereo PCM buffer preserves DirectSound's independent channel attenuation
    // on both browser and wx output ports,without a platform-specific panner law.
    const buffer = context.createBuffer(2, decoded.frames, decoded.sampleRate);
    const scratch = new Float32Array(Math.min(decoded.frames, 65536));
    try {
      for (let channel = 0; channel < 2; channel++) {
        const input = decoded.buffer.getChannelData(decoded.channels === 1 ? 0 : channel);
        const gain = channel === 0 ? pan.left : pan.right;
        for (let frame = 0; frame < decoded.frames; frame += scratch.length) {
          const output = scratch.subarray(0, Math.min(scratch.length, decoded.frames - frame));
          for (let i = 0; i < output.length; i++) output[i] = input[frame + i] * gain;
          buffer.copyToChannel(output, channel, frame);
        }
      }
      return { ...decoded, buffer, channels: 2 };
    } finally { scratch.fill(0); }
  }

  function battle(frame) {
    if (closed || returning || !battleAudible || !soundSelector) return;
    try {
      const batch = soundSelector.advance(frame);
      if (!batch) return;
      soundUpdates = batch.updates; soundGeneration = batch.generation;
      const epoch = soundEpoch;
      const selected = batch.cues.map(cue => {
        const reservation = { voice: soundSlots[cue.voice]?.voice ?? null };
        soundSlots[cue.voice] = reservation;
        return { cue, reservation, decoded: readSound(cue) };
      });
      // A slow resource read must neither reorder this frame's cues nor replay
      // an old sound after a pause,new battle or teardown.
      void Promise.all(selected.map(row => row.decoded)).then(decoded => {
        if (closed || returning || epoch !== soundEpoch || soundGeneration !== batch.generation || soundUpdates - batch.updates >= 5) return;
        for (let i = 0; i < selected.length; i++) {
          const { cue, reservation } = selected[i];
          if (!decoded[i] || soundSlots[cue.voice] !== reservation) continue;
          try {
            const output = panSound(decoded[i], cue.pan);
            if (reservation.voice) release(reservation.voice, true);
            reservation.voice = play(output, cue.level);
          } catch { /* An unavailable optional output never changes battle state. */ }
        }
      }).catch(() => {});
    } catch { /* An optional output frame never changes game progression. */ }
  }

  function clearFade() {
    const timer = fadeTimer;
    fadeTimer = null;
    if (timer) {
      try { cancel(timer.handle); } catch { /* The clock may already be closed. */ }
    }
  }

  function selectMusic(track, restart = false) {
    if (track === wanted && !restart && !fadeTimer) return;
    wanted = track;
    clearFade();
    if (music) release(music, true);
    if (wanted && !readingMusic) void readLatestMusic();
  }

  function fadeMusic() {
    wanted = null;
    clearFade();
    if (!music) return;
    const voice = music;
    const origin = clock();
    let step = 0;
    function arm() {
      const elapsed = (clock() - origin) >>> 0;
      const timer = { handle: null };
      fadeTimer = timer;
      timer.handle = schedule(() => {
        if (fadeTimer !== timer) return;
        fadeTimer = null;
        advance();
      }, Math.max(1, Math.floor((step + 1) * period) + 1 - elapsed));
    }
    function advance() {
      if (music !== voice) return;
      step = Math.floor(((clock() - origin) >>> 0) / period);
      if (step > voice.level) { release(voice, true); return; }
      try {
        voice.gain.gain.value = legacyGameAudioGain(voice.level - step);
        arm();
      } catch { clearFade(); release(voice, true); }
    }
    try { arm(); } catch { clearFade(); release(voice, true); }
  }

  return Object.freeze({
    battle,
    sync(view) {
      if (closed || returning) return;
      const audible = view.state === 'battle-pending' && !view.paused;
      if (battleAudible && !audible) soundEpoch++;
      battleAudible = audible;
      const returningToCity = view.state === 'returning-city';
      if (returningToCity && !cityReturn) void playReturnCue();
      cityReturn = returningToCity;
      if (view.state === 'returning-server') {
        returning = true;
        void playReturnCue();
        fadeMusic();
        return;
      }
      if (!options.music) return;
      if (view.sceneReady) {
        const track = legacyGameSceneMusic(view.sceneMusicCode);
        if (track !== undefined) sceneTrack = track;
      }
      if (view.state === 'battle-pending' || (returningToCity && view.cityReturn?.origin === 'battle')) {
        const command = view.battleMusic;
        if (!command || command === battleMusic) return;
        battleMusic = command;
        if (command.kind === 'play') selectMusic(command.track);
        else if (command.kind === 'fade') fadeMusic();
        else if (command.kind === 'restore') selectMusic(sceneTrack, true);
      } else if (view.sceneReady) {
        selectMusic(sceneTrack);
      } else if (['connecting', 'characters', 'choosing'].includes(view.state)) {
        const phase = view.session?.characters?.nativeMainPhase;
        if (phase === 5 || phase === 6) {
          if (!leavingLobby) { leavingLobby = true; fadeMusic(); }
        } else if (!leavingLobby) selectMusic(LEGACY_GAME_LOBBY_MUSIC);
      }
    },
    close() {
      if (closed) return;
      closed = true;
      cue = wanted = null;
      soundSelector?.close(); soundSlots.fill(null); soundCache.clear(); cachedSoundBytes = 0;
      clearFade();
      for (const voice of voices) release(voice, true);
      closeLegacyGameAudioContext(context);
    },
  });
}

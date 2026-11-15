/** Fixed37c4 one-shot sound selection over the owned battle frame cadence. */
import { LEGACY_GAME_SOUND_ROWS } from './legacy-game-sound-data.mjs';

export const LEGACY_GAME_BATTLE_AUDIO_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-battle-audio-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  sounds: 270, voices: 64, cooldownUpdates: 5,
  nativeCadenceComplete: false, protectedAmbientVoices: false,
});
const catalog = new Map(LEGACY_GAME_SOUND_ROWS.map(([id, path, level, pitch, kind]) =>
  [id, Object.freeze({ id, path, level, pitch, kind })]));

export const legacyGameSound = id => Number.isInteger(id) ? catalog.get(id) : undefined;

/** DirectSound attenuates one channel; it does not use an equal-power crossfade. */
export function legacyGameSoundPan(x, enabled = true) {
  if (!Number.isFinite(x)) throw Error('LEGACY_AUDIO_POSITION');
  const index = enabled ? Math.max(0, Math.min(127, Math.trunc(x / 5))) : 64;
  let db = 0;
  if (index !== 64) {
    if (index === 0 || index === 127) db = 10000;
    else {
      const word = 127 - 2 * Math.abs(index - 64), scale = 5000 / Math.log(100);
      db = Math.trunc(scale * Math.log(127)) - Math.trunc(scale * Math.log(word));
      if (db > 5000) db = 10000;
    }
    if (index < 64) db = -db;
  }
  return Object.freeze({ index, hundredthsDb: db,
    left: db > 0 ? 10 ** (-db / 2000) : 1,
    right: db < 0 ? 10 ** (db / 2000) : 1 });
}

export function createLegacyGameBattleAudio() {
  const cooldown = new Uint8Array(501);
  let closed = false, generation = 0, steps = 0, updates = 0, nextVoice = 0;
  return Object.freeze({
    advance(frame) {
      if (closed) return null;
      if (!Number.isSafeInteger(frame?.generation) || frame.generation < 1 ||
          !Number.isSafeInteger(frame.steps) || frame.steps < 1) throw Error('LEGACY_AUDIO_FRAME');
      if (frame.generation < generation || frame.generation === generation && frame.steps <= steps) return null;
      generation = frame.generation; steps = frame.steps; updates++;
      for (let id = 0; id < cooldown.length; id++) if (cooldown[id]) cooldown[id]--;
      const cues = [];
      const append = (id, x) => {
        const sound = legacyGameSound(id);
        if (!sound || cooldown[id] || !Number.isFinite(x)) return;
        const pan = legacyGameSoundPan(x);
        cooldown[id] = 5;
        cues.push(Object.freeze({ ...sound, pan, voice: nextVoice }));
        nextVoice = (nextVoice + 1) & 63;
      };
      // Preserve the actual owned entry consumer order: body/animation,then input.
      for (const event of frame.callbacks?.body?.events ?? []) {
        if (event.kind === 'sound') append(event.value, event.position?.[0]);
      }
      for (const id of frame.input?.sounds ?? []) append(id, 320);
      return Object.freeze({ generation, steps, updates, cues: Object.freeze(cues) });
    },
    close() { if (closed) return; closed = true; cooldown.fill(0); generation = steps = updates = nextVoice = 0; },
  });
}

/** Fixed 37c4 loose WAV catalog and PCM reader. */
import { assetFail } from './legacy-game-resource-values.mjs';

export const LEGACY_GAME_RETURN_SOUND = Object.freeze({ path: 'se/cgsys09.wav', level: 100 });
export const LEGACY_GAME_MUSIC_RATE = 22050;
export const LEGACY_GAME_WAVE_LIMIT = 16 * 1024 * 1024;

const names = [
  'cgbgm_m0', 'cgbgm_m1', 'cgbgm_m2', 'cgbgm_m3', 'cgbgm_m4',
  'cgbgm_f0', 'cgbgm_f1', 'cgbgm_f2', 'cgbgm_d0', 'cgbgm_d1', 'cgbgm_d2', 'cgbgm_d3', 'cgbgm_d4',
  'cgbgm_b0', 'cgbgm_b1', 'cgbgm_b2', 'cgbgm_b3', 'cgbgm_t0',
  'exbgm_s0', 'exbgm_f0', 'exbgm_m0', 'v2bgm_f0', 'v2bgm_m0', 'v2bgm_ex', 'v2bgm_ex',
  'puk2_battle1', 'puk2_battle2', 'puk2_field1', 'puk2_mati', 'puk2_sinden', 'puk2_yama',
  'puk2_haikyo', 'puk2_m_town', 'puk2_OP', 'puk3_battle1', 'puk3_battle2', 'puk3_dungeon',
  'puk3_kame', 'puk3_kujira', 'puk3_kumo', 'puk3_love', 'puk3_playerbattle', 'PUK3_title', 'PUK3_orgel',
];
const tracks = names.map((name, track) =>
  Object.freeze({ path: 'bgm/' + name + '.wav', level: 90, loop: track !== 24 }));
export const LEGACY_GAME_LOBBY_MUSIC = tracks[17];
export const LEGACY_GAME_DEFAULT_SCENE_MUSIC = tracks[0];
const sceneTracks = [
  0, 1, 2, 3, 4, 13, 14, 15, 16, 5, 6, 7, 8, 9, 10, 11, 12, 17, -2, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
];

export function legacyGameSceneMusic(code) {
  const track = sceneTracks[code - 200];
  return track === -2 ? null : tracks[track];
}

const ordinaryBattle = [13, 16, 16, 13, 14, 15];
const expansionBattle = [25, 16, 16, 25, 26, 26];
const specialBattle = [34, 16, 16, 34, 35, 26];

export function legacyGameBattleMusic(mode, background, sceneMode, mapId) {
  if (mapId >= 0x5b1 && mapId <= 0x5c8) return tracks[16];
  if (sceneMode !== 1) return tracks[ordinaryBattle[mode - 1]];
  const table = background >= 0x3a40f && background <= 0x3a41a ? specialBattle : expansionBattle;
  return tracks[table[mode - 1]];
}

const soundScale = 10000 / Math.log(127);
const referenceLevel = Math.trunc(soundScale * Math.log(100));
export function legacyGameAudioGain(level) {
  if (level === 0) return 0;
  const hundredthsDb = Math.max(-10000, Math.min(0, Math.trunc(soundScale * Math.log(level)) - referenceLevel));
  return 10 ** (hundredthsDb / 2000);
}

const RIFF = 0x52494646, WAVE = 0x57415645, FMT = 0x666d7420, DATA = 0x64617461, SMPL = 0x736d706c;
const invalidWave = () => assetFail('LEGACY_ASSET_WAVE');

/** Borrow the exact file bytes until the playback buffer has been filled. */
export function parseLegacyGameWave(bytes, loop) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < 12 || bytes.byteLength > LEGACY_GAME_WAVE_LIMIT) invalidWave();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const declaredEnd = 8 + view.getUint32(4, true);
  if (view.getUint32(0) !== RIFF || view.getUint32(8) !== WAVE || declaredEnd < 12 || declaredEnd > LEGACY_GAME_WAVE_LIMIT) invalidWave();
  // Some local releases have a truncated metadata tail. Required chunks must still fit both limits.
  const end = Math.min(declaredEnd, view.byteLength);
  let format, data, points;
  for (let offset = 12; offset + 8 <= end;) {
    const kind = view.getUint32(offset), size = view.getUint32(offset + 4, true);
    const start = offset + 8;
    if (size > end - start) invalidWave();
    if (kind === FMT && !format) {
      if (size < 16 || view.getUint16(start, true) !== 1) invalidWave();
      const channels = view.getUint16(start + 2, true), rate = view.getUint32(start + 4, true);
      const align = view.getUint16(start + 12, true), bits = view.getUint16(start + 14, true);
      if ((channels !== 1 && channels !== 2) || (bits !== 8 && bits !== 16) || rate < 8000 || rate > 96000 ||
          align !== channels * bits / 8 || view.getUint32(start + 8, true) !== rate * align) invalidWave();
      format = { channels, rate, align, bits };
    } else if (kind === DATA && !data) {
      data = { start, size };
    } else if (kind === SMPL && loop && !points) {
      if (size < 52 || view.getUint32(start + 28, true) === 0 || view.getUint32(start + 40, true) !== 0) invalidWave();
      points = { start: view.getUint32(start + 44, true), end: view.getUint32(start + 48, true) };
    }
    if (format && data && (!loop || points)) break;
    offset = start + size + size % 2;
  }
  if (!format || !data || (loop && !points)) invalidWave();
  const frames = Math.floor(data.size / format.align);
  if (!frames || (points && (points.start >= points.end || points.end > frames))) invalidWave();
  return { view, ...format, frames, dataOffset: data.start, loop: points ?? null };
}

export function fillLegacyGamePcmChannel(wave, channel, firstFrame, output) {
  let offset = wave.dataOffset + firstFrame * wave.align + channel * (wave.bits / 8);
  if (wave.bits === 8) {
    for (let i = 0; i < output.length; i++, offset += wave.align) output[i] = (wave.view.getUint8(offset) - 128) / 128;
  } else {
    for (let i = 0; i < output.length; i++, offset += wave.align) output[i] = wave.view.getInt16(offset, true) / 32768;
  }
}

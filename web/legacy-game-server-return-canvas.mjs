/** Canvas presentation for the captured main7/type14 transition. */
import { composeLegacyGameBattleExitFade, createLegacyGameBattleExitFade, LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE } from '../shared/legacy-game-battle-exit-fade.mjs';
import { LEGACY_GAME_CLOCK_PROFILE } from '../shared/legacy-game-clock.mjs';

const { width, height } = LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE;
const period = LEGACY_GAME_CLOCK_PROFILE.period;

export function createLegacyGameServerReturnCanvas({ canvas, clock, schedule, cancel, onReady }) {
  let state = 'idle', capture = null, fade = null, target = null, context = null, timer = null;
  let frames = 0, origin = 0;

  function finish(next) {
    state = next;
    const pending = timer;
    timer = null;
    capture?.fill(0); capture = null;
    fade?.close(); fade = null;
    target?.data.fill(0); target = context = null;
    if (pending) cancel(pending.handle);
  }

  function arm() {
    const elapsed = (clock() - origin) >>> 0;
    const delay = Math.max(1, Math.floor((frames + 1) * period) + 1 - elapsed);
    const pending = { handle: null };
    timer = pending;
    pending.handle = schedule(() => {
      if (timer !== pending || state !== 'running') return;
      timer = null;
      try {
        const frame = fade.step();
        const output = composeLegacyGameBattleExitFade({ width, height, rgba: capture }, frame.rowPositions, 14, width, height);
        try {
          target.data.set(output.rgba);
          context.putImageData(target, 0, 0);
        } finally { output.rgba.fill(0); }
        frames++;
        if (!frame.complete) { arm(); return; }
        finish('complete');
      } catch { finish('unavailable'); }
      onReady();
    }, delay);
  }

  return Object.freeze({
    // The drawing port hands over a fresh ImageData after putImageData has committed it.
    remember(image) {
      if (state !== 'idle') return;
      const data = image.data;
      const next = image.width === width && image.height === height && ArrayBuffer.isView(data) &&
        data.BYTES_PER_ELEMENT === 1 && data.byteLength === width * height * 4 ?
        new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : null;
      if (capture && capture.buffer !== next?.buffer) capture.fill(0);
      capture = next;
    },
    takeCapture() {
      if (state !== 'idle') return null;
      const rgba = capture;
      capture = null;
      return rgba;
    },
    start() {
      if (state !== 'idle') return;
      if (!capture || canvas.width !== width || canvas.height !== height) { finish('unavailable'); return; }
      try {
        context = canvas.getContext('2d', { alpha: true });
        target = context.createImageData(width, height);
        fade = createLegacyGameBattleExitFade(14);
        origin = clock();
        state = 'running';
        arm();
      } catch { finish('unavailable'); }
    },
    inspect() { return Object.freeze({ state, frames }); },
    close() { if (state !== 'closed') finish('closed'); },
  });
}

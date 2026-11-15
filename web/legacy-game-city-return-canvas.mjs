/** Present the ordinary city return through either Canvas port. */
import { LEGACY_GAME_CLOCK_PROFILE } from '../shared/legacy-game-clock.mjs';

export function createLegacyGameCityReturnCanvas({ canvas, client, clock, schedule, cancel, onImage }) {
  let timer = null, closed = false, stepping = false, target = null;

  function sync(delay = 1) {
    const phase = client.inspect().cityReturn?.phase;
    if (closed || timer || stepping || !phase) return;
    const scheduled = { handle: null };
    timer = scheduled;
    scheduled.handle = schedule(() => {
      if (closed || timer !== scheduled) return;
      timer = null;
      void step();
    }, delay);
  }

  async function step() {
    stepping = true;
    const started = clock();
    try {
      const frame = await client.advanceCityReturn(started);
      if (!closed && frame) client.presentCityReturn(frame, (rgba, width, height) => {
        const context = canvas.getContext('2d', { alpha: true });
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        target ??= context.createImageData(width, height);
        if (rgba) target.data.set(rgba); else target.data.fill(0);
        context.putImageData(target, 0, 0);
        onImage(target);
      });
    } catch (error) { if (!closed) client.fail(error); }
    finally {
      stepping = false;
      if (!closed) sync(Math.max(1, Math.ceil(LEGACY_GAME_CLOCK_PROFILE.period - ((clock() - started) >>> 0))));
    }
  }

  return Object.freeze({
    sync,
    close() {
      if (closed) return;
      closed = true;
      if (timer) cancel(timer.handle);
      timer = null; target = null;
    },
  });
}

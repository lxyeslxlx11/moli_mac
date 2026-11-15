/** Local deadline clock: never moves backwards; firing a timer advances to its scheduled floor. */
import { sessionFail } from '../../web/launcher-session-data.mjs';

export function createWeChatDeadlineClock({ wallNow = Date.now, setTimer = globalThis.setTimeout, clearTimer = globalThis.clearTimeout } = {}) {
  if ([wallNow, setTimer, clearTimer].some(value => typeof value !== 'function')) sessionFail('SESSION_TIMER');
  const origin = wallNow(); let last = 0;
  if (!Number.isSafeInteger(origin)) sessionFail('SESSION_CLOCK');
  function now() {
    const elapsed = wallNow() - origin;
    if (!Number.isSafeInteger(elapsed)) sessionFail('SESSION_CLOCK');
    last = Math.max(last, elapsed, 0); return last;
  }
  return Object.freeze({ now,
    setTimer(callback, delay) {
      const floor = now() + delay;
      if (typeof callback !== 'function' || !Number.isSafeInteger(delay) || delay < 0 || !Number.isSafeInteger(floor)) sessionFail('SESSION_TIMER');
      const token = { active: true, native: null };
      token.native = setTimer(() => {
        if (!token.active) return;
        token.active = false; last = Math.max(last, floor); callback();
      }, delay);
      return token;
    },
    clearTimer(token) { if (!token?.active) return; token.active = false; clearTimer(token.native); },
  });
}

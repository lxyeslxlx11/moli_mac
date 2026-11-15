/** WeChat port for the source-bound current launcher session. No default endpoint or account decision. */
import { createLauncherSession } from '../../web/launcher-session.mjs';
import { ownSessionValue, ownedSessionBytes, snapshotSessionEndpoints, sessionFail } from '../../web/launcher-session-data.mjs';
import { createWeChatAbortController } from './launcher-control.mjs';
import { createWeChatLauncherTransport } from './launcher-stream.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
export { createWeChatLauncherTransport, WECHAT_LAUNCHER_STREAM_LIMITS } from './launcher-stream.mjs';

function bound(object, name, code) {
  let fn;
  try { fn = object[name]; } catch { sessionFail(code); }
  if (typeof fn !== 'function') sessionFail(code);
  return (...args) => Reflect.apply(fn, object, args);
}
export function createWeChatLauncherSession(input) {
  const fields = ['wx', 'endpoints', 'firstEndpointOrdinal', 'requestCounter', 'gameCode', 'usernameBytes', 'passwordBytes', 'setTimer', 'clearTimer'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).some(key => !fields.includes(key))) sessionFail('SESSION_INPUT');
  const wx = ownSessionValue(input, 'wx'), endpoints = snapshotSessionEndpoints(ownSessionValue(input, 'endpoints'));
  if (typeof BigInt !== 'function' || typeof Object.hasOwn !== 'function') sessionFail('SESSION_INPUT');
  const transport = createWeChatLauncherTransport({ wx, allowedEndpoints: endpoints });
  let crypto;
  try { crypto = bound(wx, 'getUserCryptoManager', 'SESSION_RANDOM')(); } catch { sessionFail('SESSION_RANDOM'); }
  const clock = createWeChatDeadlineClock({ setTimer: ownSessionValue(input, 'setTimer', true), clearTimer: ownSessionValue(input, 'clearTimer', true) });
  const fill = bound(crypto, 'getRandomValues', 'SESSION_RANDOM');
  const entropy = new Set(); let ended = false;
  const clearEntropy = () => { ended = true; for (const bytes of entropy) bytes.fill(0); entropy.clear(); };
  const randomBytes = length => new Promise((resolve, reject) => {
    let completed = false;
    try { fill({ length, success(result) {
      if (completed) return; completed = true;
      try {
        const bytes = ownedSessionBytes(ownSessionValue(result, 'randomValues'), length, length);
        if (ended) { bytes.fill(0); reject(new Error('WeChat entropy failed.')); return; }
        entropy.add(bytes); resolve(bytes);
      }
      catch { reject(new Error('WeChat entropy failed.')); }
    }, fail() { completed = true; reject(new Error('WeChat entropy failed.')); } }); }
    catch { reject(new Error('WeChat entropy failed.')); }
  });
  const session = createLauncherSession({ endpoints, openStream: transport.openStream,
    firstEndpointOrdinal: ownSessionValue(input, 'firstEndpointOrdinal'), requestCounter: ownSessionValue(input, 'requestCounter'),
    gameCode: ownSessionValue(input, 'gameCode'), usernameBytes: ownSessionValue(input, 'usernameBytes'), passwordBytes: ownSessionValue(input, 'passwordBytes'),
    handshakeProfile: 'current', now: clock.now, randomBytes, createAbortController: createWeChatAbortController,
    setTimer: clock.setTimer, clearTimer: clock.clearTimer });
  let running = null;
  return Object.freeze({ snapshot: session.snapshot, cancel() { const result = session.cancel(); clearEntropy(); return result; }, getChoices: session.getChoices,
    selectProfile: session.selectProfile,
    start(...options) {
      if (options.length) sessionFail('SESSION_INPUT');
      if (!running) running = session.start().finally(clearEntropy);
      return running;
    } });
}

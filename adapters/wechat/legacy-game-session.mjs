/** Fixed37c4 game byte-session port. Existing WeChat TCP restrictions and explicit native clock remain in force. */
import { createLegacyGameSession } from '../../web/legacy-game-session.mjs';
import { createWeChatLauncherTransport } from './launcher-stream.mjs';
import { createWeChatAbortController } from './launcher-control.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { ownSessionValue, snapshotSessionEndpoint } from '../../web/launcher-session-data.mjs';

export function createWeChatLegacyGameSession(input) {
  const required = ['wx', 'sourceProfile', 'world', 'mappingBytes', 'moduleDigestBytes', 'endpoint', 'pollMilliseconds'];
  const optional = ['wallNow', 'setTimer', 'clearTimer', 'onPacket', 'onState', 'postLogin', 'keepalive'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).some(k => !required.includes(k) && !optional.includes(k))) throw new TypeError('Expected explicit WeChat game ports.');
  const v = Object.fromEntries(required.map(name => [name, ownSessionValue(input, name)]));
  const endpoint = snapshotSessionEndpoint(v.endpoint);
  const transport = createWeChatLauncherTransport({ wx: v.wx, allowedEndpoints: [endpoint] });
  const clock = createWeChatDeadlineClock(Object.fromEntries(['wallNow', 'setTimer', 'clearTimer'].map(name => [name, ownSessionValue(input, name, true)])));
  return createLegacyGameSession({ sourceProfile: v.sourceProfile, world: v.world, mappingBytes: v.mappingBytes,
    moduleDigestBytes: v.moduleDigestBytes, endpoint, pollMilliseconds: v.pollMilliseconds,
    keepalive: ownSessionValue(input, 'keepalive', true),
    openStream: transport.openStream, clock: () => clock.now() % 4294967296,
    setTimer: clock.setTimer, clearTimer: clock.clearTimer, createControl: createWeChatAbortController,
    ...(ownSessionValue(input, 'onPacket', true) === undefined ? {} : { onPacket: ownSessionValue(input, 'onPacket') }),
    ...(ownSessionValue(input, 'onState', true) === undefined ? {} : { onState: ownSessionValue(input, 'onState') }),
    ...(ownSessionValue(input, 'postLogin', true) === undefined ? {} : { postLogin: ownSessionValue(input, 'postLogin') }),
  });
}

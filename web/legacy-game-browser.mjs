/** Browser port for the explicit original-only loopback bridge, sharing the game-session owner. */
import { createBrowserGameTransport, createBrowserLauncherTransport } from './launcher-websocket.mjs';
import { createLegacyGameSession } from './legacy-game-session.mjs';
import { ownSessionValue, snapshotSessionEndpoint } from './launcher-session-data.mjs';

export function createBrowserLegacyGameSession(input) {
  const required = ['sourceProfile', 'world', 'mappingBytes', 'moduleDigestBytes', 'origin', 'token', 'endpoint', 'pollMilliseconds'];
  const optional = ['WebSocket', 'clock', 'setTimer', 'clearTimer', 'createControl', 'onPacket', 'onState', 'postLogin', 'endpoints', 'gameStream'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).some(k => !required.includes(k) && !optional.includes(k))) throw new TypeError('Expected explicit browser game ports.');
  const v = Object.fromEntries(required.map(name => [name, ownSessionValue(input, name)]));
  const endpoint = snapshotSessionEndpoint(v.endpoint);
  const gameStream = ownSessionValue(input, 'gameStream', true);
  if (gameStream !== undefined && typeof gameStream !== 'boolean') throw new TypeError('Expected explicit browser game ports.');
  const createTransport = gameStream ? createBrowserGameTransport : createBrowserLauncherTransport;
  // endpointOrdinal is relative to the bridge's full, ordered allowlist.
  const transport = createTransport({ origin: v.origin, token: v.token, endpoints: ownSessionValue(input, 'endpoints', true) ?? [endpoint],
    ...(ownSessionValue(input, 'WebSocket', true) === undefined ? {} : { WebSocket: ownSessionValue(input, 'WebSocket') }) });
  return createLegacyGameSession({ sourceProfile: v.sourceProfile, world: v.world, mappingBytes: v.mappingBytes,
    moduleDigestBytes: v.moduleDigestBytes, endpoint, pollMilliseconds: v.pollMilliseconds, keepalive: gameStream === true,
    openStream: transport.openStream,
    clock: ownSessionValue(input, 'clock', true) ?? (() => Math.trunc(performance.now()) % 4294967296),
    setTimer: ownSessionValue(input, 'setTimer', true) ?? ((callback, delay) => globalThis.setTimeout(callback, delay)),
    clearTimer: ownSessionValue(input, 'clearTimer', true) ?? (handle => globalThis.clearTimeout(handle)),
    createControl: ownSessionValue(input, 'createControl', true) ?? (() => new AbortController()),
    ...(ownSessionValue(input, 'onPacket', true) === undefined ? {} : { onPacket: ownSessionValue(input, 'onPacket') }),
    ...(ownSessionValue(input, 'onState', true) === undefined ? {} : { onState: ownSessionValue(input, 'onState') }),
    ...(ownSessionValue(input, 'postLogin', true) === undefined ? {} : { postLogin: ownSessionValue(input, 'postLogin') }),
  });
}

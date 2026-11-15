/** Bind existing current bootstrap to native WeChat byte, deadline and cancellation ports. */
import { createWin32LauncherBootstrap } from '../../web/launcher-bootstrap.mjs';
import { decodeLauncherCatalogText } from '../../shared/launcher-catalog-text.mjs';
import { createWeChatLauncherHttpClient } from './launcher-http.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { createWeChatAbortController, weChatSignal } from './launcher-control.mjs';

export function createWeChatLauncherBootstrap({ wx, allowedOrigins, clock = createWeChatDeadlineClock() } = {}) {
  const httpClient = createWeChatLauncherHttpClient({ wx, allowedOrigins, clock });
  const platform = Object.freeze({ now: clock.now, setTimer: clock.setTimer, clearTimer: clock.clearTimer,
    createAbortController: createWeChatAbortController, readSignal: weChatSignal,
    decodeText: (bytes, encoding) => decodeLauncherCatalogText(bytes, { encoding }) });
  return createWin32LauncherBootstrap({ httpClient, platform, cacheTick: () => Math.floor(clock.now()) >>> 0 });
}

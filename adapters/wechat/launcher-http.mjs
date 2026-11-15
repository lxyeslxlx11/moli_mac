/** Native WeChat GET port. Explicit HTTPS DNS origins, manual redirects, byte/deadline budgets; no storage. */
import { LAUNCHER_HTTP_LIMITS, LauncherHttpError } from '../../web/launcher-http-data.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { weChatSignal } from './launcher-control.mjs';
export { LAUNCHER_HTTP_LIMITS, LauncherHttpError } from '../../web/launcher-http-data.mjs';

const fail = (code, message) => { throw new LauncherHttpError(code, message); };
const budgets = Object.freeze({ metadata: LAUNCHER_HTTP_LIMITS.metadataBytes,
  catalog: LAUNCHER_HTTP_LIMITS.catalogBytes, package: LAUNCHER_HTTP_LIMITS.packageBytes });
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;

/** Deliberate complete-URL subset: HTTPS DNS, default/443 port, ASCII URI path/query; no URL global required. */
export function snapshotWeChatHttpUrl(value) {
  if (typeof value !== 'string' || !value.length || value.length > LAUNCHER_HTTP_LIMITS.urlChars) fail('HTTP_INPUT', 'Expected a bounded HTTPS URL.');
  const match = /^https:\/\/([A-Za-z0-9.-]+)(?::443)?(\/[^#]*)?$/.exec(value);
  if (!match) fail('HTTP_INPUT', 'Expected HTTPS DNS without credentials, fragments or other ports.');
  const host = match[1].toLowerCase(), labels = host.split('.'), path = match[2] ?? '/';
  if (host.length > 253 || labels.length < 2 || /^[0-9]+$/.test(labels[labels.length - 1])
      || labels.some(label => label.length < 1 || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))
      || !/^[A-Za-z0-9\-._~!$&'()*+,;=:@/%?]*$/.test(path) || /%(?![0-9a-f]{2})/i.test(path)) fail('HTTP_INPUT', 'URL is outside the configured native HTTPS subset.');
  const origin = 'https://' + host;
  return Object.freeze({ origin, href: origin + path, path });
}
export function snapshotWeChatHttpOrigins(values) {
  if (!Array.isArray(values) || values.length < 1 || values.length > LAUNCHER_HTTP_LIMITS.origins) fail('HTTP_INPUT', 'Supply a bounded origin list.');
  return Object.freeze(Array.from({ length: values.length }, (_, i) => {
    const row = Object.getOwnPropertyDescriptor(values, String(i));
    if (!row || !Object.hasOwn(row, 'value')) fail('HTTP_INPUT', 'Expected own origin entries.');
    const url = snapshotWeChatHttpUrl(row.value);
    if (url.path !== '/') fail('HTTP_INPUT', 'An allowed origin cannot contain a path or query.');
    return url.origin;
  }));
}
function capabilities(wx) {
  if (!wx || ['request','getAppBaseInfo','getDeviceInfo'].some(name => typeof wx[name] !== 'function')) fail('HTTP_CAPABILITY', 'Native HTTP capability is unavailable.');
  let info, platform;
  try { info = wx.getAppBaseInfo(); platform = wx.getDeviceInfo()?.platform; } catch { fail('HTTP_CAPABILITY', 'Native HTTP capability is unavailable.'); }
  const version = typeof info?.SDKVersion === 'string' && /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(info.SDKVersion);
  if (!version || !['ios','android','devtools'].includes(platform)
      || (+version[1] < 3 || +version[1] === 3 && (+version[2] < 2 || +version[2] === 2 && +version[3] < 2))) fail('HTTP_CAPABILITY', 'Manual redirects require a documented platform and base library >=3.2.2.');
  return wx.request.bind(wx);
}

export function createWeChatLauncherHttpClient({ wx, allowedOrigins, clock = createWeChatDeadlineClock() } = {}) {
  const origins = new Set(snapshotWeChatHttpOrigins(allowedOrigins)), request = capabilities(wx);
  if (!clock || ['now','setTimer','clearTimer'].some(name => typeof clock[name] !== 'function')) fail('HTTP_INPUT', 'Expected deadline clock ports.');
  return Object.freeze({
    async getBytes(value, { kind = 'metadata', signal, timeoutMs = LAUNCHER_HTTP_LIMITS.defaultTimeoutMs } = {}) {
      const url = snapshotWeChatHttpUrl(value);
      if (!origins.has(url.origin)) fail('HTTP_ORIGIN', 'The URL origin was not explicitly selected.');
      if (typeof kind !== 'string' || !Object.hasOwn(budgets, kind) || !Number.isInteger(timeoutMs)
          || timeoutMs < 1 || timeoutMs > LAUNCHER_HTTP_LIMITS.maximumTimeoutMs) fail('HTTP_INPUT', 'Expected known kind and bounded deadline.');
      let external;
      try { external = weChatSignal(signal); } catch { fail('HTTP_INPUT', 'Expected an owned cancellation signal.'); }
      if (external?.aborted()) fail('HTTP_ABORTED', 'The request was cancelled.');
      const maximum = budgets[kind], deadline = clock.now() + timeoutMs, chunks = [];
      let task, timer, settled = false, completed = false, starting = true, synchronousCallback = false;
      let total = 0, count = 0, declaredLength = null, resolveDone, rejectDone;
      const done = new Promise((resolve, reject) => { resolveDone = resolve; rejectDone = reject; }); done.catch(() => {});
      function stop(code, message) {
        if (settled) return;
        settled = true; rejectDone(new LauncherHttpError(code, message));
        try { task?.abort(); } catch { /* Preserve primary failure. */ }
      }
      function check() { if (!settled && clock.now() >= deadline) stop('HTTP_TIMEOUT', 'The request deadline expired.'); return !settled; }
      const onAbort = () => { if (check()) stop('HTTP_ABORTED', 'The request was cancelled.'); };
      function callback(fn) { return value => {
        if (starting) { synchronousCallback = true; return; }
        if (settled) return;
        try { if (check()) fn(value); }
        catch (error) { stop(error instanceof LauncherHttpError ? error.code : 'HTTP_RESPONSE', 'The HTTP response failed validation.'); }
      }; }
      function headers(value, statusRequired = false) {
        const status = value?.statusCode;
        if (status !== undefined || statusRequired) {
          if (!Number.isInteger(status)) fail('HTTP_RESPONSE', 'Expected an inspectable status.');
          if (status >= 300 && status < 400) fail('HTTP_REDIRECT', 'Redirects are outside this adapter.');
          if (status < 200 || status >= 300) fail('HTTP_STATUS', 'The HTTP response was not successful.');
        }
        const header = value?.header;
        if (!header || typeof header !== 'object' || Array.isArray(header)) fail('HTTP_RESPONSE', 'Expected response headers.');
        const keys = Object.keys(header);
        if (keys.length > 128) fail('HTTP_RESPONSE', 'Response header budget exceeded.');
        let lengthSeen = false;
        for (const key of keys) {
          if (key.length > 128) fail('HTTP_RESPONSE', 'Invalid response header.');
          const lower = key.toLowerCase();
          if (!['content-length','location'].includes(lower)) continue;
          const field = Object.getOwnPropertyDescriptor(header, key);
          if (!field || !Object.hasOwn(field, 'value')) fail('HTTP_RESPONSE', 'Expected own response headers.');
          if (lower === 'location') fail('HTTP_REDIRECT', 'Redirects are outside this adapter.');
          if (lengthSeen || typeof field.value !== 'string' || !/^[0-9]{1,20}$/.test(field.value)) fail('HTTP_LENGTH', 'Invalid content length.');
          lengthSeen = true;
          const length = Number(field.value);
          if (length > maximum) fail('HTTP_BODY_LIMIT', 'Declared response exceeds its byte budget.');
          if (declaredLength !== null && declaredLength !== length) fail('HTTP_LENGTH', 'Conflicting content lengths.');
          declaredLength = length;
        }
      }
      function bytes(value, remaining) {
        let length;
        try { length = Reflect.apply(bufferLength, value, []); } catch { fail('HTTP_RESPONSE', 'Expected an actual ArrayBuffer response.'); }
        if (length > remaining) fail('HTTP_BODY_LIMIT', 'Response exceeds its byte budget.');
        return new Uint8Array(new Uint8Array(value));
      }
      const onHeaders = callback(value => headers(value));
      const onChunk = callback(value => {
        if (++count > LAUNCHER_HTTP_LIMITS.readCalls) fail('HTTP_READ_LIMIT', 'Response exceeded its chunk budget.');
        const chunk = bytes(value?.data, maximum - total); chunks.push(chunk); total += chunk.length;
      });
      const onSuccess = callback(value => {
        headers(value, true);
        const finalBytes = bytes(value?.data, maximum);
        let output = finalBytes;
        if (count) {
          if (finalBytes.length && finalBytes.length !== total) fail('HTTP_RESPONSE', 'Inconsistent streamed response.');
          output = new Uint8Array(total); let offset = 0;
          for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length; }
          if (finalBytes.length) for (let i = 0; i < total; i++) if (output[i] !== finalBytes[i]) fail('HTTP_RESPONSE', 'Inconsistent streamed response.');
        }
        if (!check()) return;
        completed = settled = true;
        resolveDone(Object.freeze({ bytes: output, byteLength: output.length, status: value.statusCode, declaredLength, trust: 'unverified' }));
      });
      const onFail = callback(() => stop('HTTP_NETWORK', 'The native HTTP request failed.'));
      try {
        timer = clock.setTimer(() => stop('HTTP_TIMEOUT', 'The request deadline expired.'), timeoutMs);
        external?.add(onAbort); if (external?.aborted()) onAbort();
        if (check()) {
          task = request({ url: url.href, method: 'GET', dataType: 'text', responseType: 'arraybuffer', redirect: 'manual',
            enableCache: false, enableChunked: true, timeout: timeoutMs, header: { Accept: 'application/octet-stream' },
            success: onSuccess, fail: onFail });
          starting = false;
          if (!task || ['abort','onHeadersReceived','offHeadersReceived','onChunkReceived','offChunkReceived'].some(name => typeof task[name] !== 'function')) fail('HTTP_CAPABILITY', 'Expected the native request task events.');
          if (synchronousCallback) fail('HTTP_RESPONSE', 'Unexpected synchronous native callback.');
          task.onHeadersReceived(onHeaders); task.onChunkReceived(onChunk); check();
        } else starting = false;
        return await done;
      } catch (error) {
        if (!settled) stop(error instanceof LauncherHttpError ? error.code : 'HTTP_NETWORK', 'The native HTTP request could not complete.');
        return await done;
      } finally {
        settled = true;
        try { clock.clearTimer(timer); } catch { /* Continue cleanup. */ }
        external?.remove(onAbort);
        for (const [name, listener] of [['offHeadersReceived',onHeaders],['offChunkReceived',onChunk]]) {
          try { task?.[name]?.(listener); } catch { /* Continue cleanup. */ }
        }
        if (!completed) { try { task?.abort(); } catch { /* Preserve primary failure. */ } }
        for (const chunk of chunks) chunk.fill(0); chunks.length = 0;
      }
    },
  });
}

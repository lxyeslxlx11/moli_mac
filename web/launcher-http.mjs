/** Browser Fetch adapter for explicit launcher metadata/catalog/package GETs.
 * No default endpoint, parsing, account, file write or execution. The existing offline UI does not call this module.
 */
import { LAUNCHER_HTTP_LIMITS, LauncherHttpError } from './launcher-http-data.mjs';
export { LAUNCHER_HTTP_LIMITS, LauncherHttpError } from './launcher-http-data.mjs';
const fail = (code, message) => { throw new LauncherHttpError(code, message); };
const budgets = Object.freeze({ metadata: LAUNCHER_HTTP_LIMITS.metadataBytes, catalog: LAUNCHER_HTTP_LIMITS.catalogBytes, package: LAUNCHER_HTTP_LIMITS.packageBytes });
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const signalAborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
function absoluteUrl(value) {
  if (typeof value !== 'string' || !value.length || value.length > LAUNCHER_HTTP_LIMITS.urlChars || /[\x00-\x20\x7f]/.test(value)) {
    fail('HTTP_INPUT', 'Expected a bounded absolute URL without whitespace.');
  }
  let url; try { url = new URL(value); } catch { fail('HTTP_INPUT', 'Expected an absolute URL.'); }
  if (!['http:', 'https:'].includes(url.protocol)) fail('HTTP_SCHEME', 'Expected HTTP or HTTPS.');
  if (url.username || url.password || url.hash) fail('HTTP_INPUT', 'Credentials and fragments are outside this adapter.');
  return url;
}
function originsSnapshot(values) {
  if (!Array.isArray(values)) fail('HTTP_INPUT', 'Supply explicit allowed origins.');
  const length = values.length;
  if (!Number.isInteger(length) || length < 1 || length > LAUNCHER_HTTP_LIMITS.origins) fail('HTTP_INPUT', 'Supply a bounded origin list.');
  const result = new Set();
  for (let i = 0; i < length; i += 1) {
    if (!Object.hasOwn(values, i)) fail('HTTP_INPUT', 'Expected an own origin entry.');
    const url = absoluteUrl(values[i]);
    if (url.pathname !== '/' || url.search) fail('HTTP_INPUT', 'Allowed origins cannot contain a path or query.');
    result.add(url.origin);
  }
  return result;
}
function cancelQuietly(value) {
  // Cleanup is best effort; it must not replace the primary failure or extend the deadline.
  try { Promise.resolve(value?.cancel()).catch(() => {}); } catch { /* Preserve the primary error. */ }
}

export function createLauncherHttpClient({ allowedOrigins, fetchImpl = globalThis.fetch } = {}) {
  const origins = originsSnapshot(allowedOrigins);
  if (typeof fetchImpl !== 'function') fail('HTTP_INPUT', 'Fetch support is required.');
  return Object.freeze({
    async getBytes(value, { kind = 'metadata', signal, timeoutMs = LAUNCHER_HTTP_LIMITS.defaultTimeoutMs } = {}) {
      const url = absoluteUrl(value);
      if (!origins.has(url.origin)) fail('HTTP_ORIGIN', 'The URL origin was not explicitly selected.');
      if (typeof kind !== 'string' || !Object.hasOwn(budgets, kind)) fail('HTTP_INPUT', 'Expected a known response kind.');
      if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > LAUNCHER_HTTP_LIMITS.maximumTimeoutMs) fail('HTTP_INPUT', 'Expected a bounded whole-millisecond deadline.');
      if (signal !== undefined) {
        let aborted; try { aborted = Reflect.apply(signalAborted, signal, []); } catch { fail('HTTP_INPUT', 'Expected an actual AbortSignal.'); }
        if (aborted) fail('HTTP_ABORTED', 'The request was cancelled.');
      }
      const maximum = budgets[kind], controller = new AbortController(), deadline = performance.now() + timeoutMs;
      let stopError, reader, response, completed = false, rejectStop;
      const stopped = new Promise((resolve, reject) => { rejectStop = reject; });
      // A cancellation may win before the first race attaches its handlers.
      stopped.catch(() => {});
      const stop = code => {
        if (stopError) return;
        stopError = new LauncherHttpError(code, code === 'HTTP_TIMEOUT' ? 'The request deadline expired.' : 'The request was cancelled.');
        rejectStop(stopError); controller.abort(); cancelQuietly(reader);
      };
      const checkDeadline = () => {
        if (performance.now() >= deadline) stop('HTTP_TIMEOUT');
        if (stopError) throw stopError;
      };
      const onAbort = () => stop(performance.now() >= deadline ? 'HTTP_TIMEOUT' : 'HTTP_ABORTED');
      const timer = setTimeout(() => stop('HTTP_TIMEOUT'), timeoutMs);
      const guard = async promise => {
        // Observe a read/fetch promise even when its synchronous work exhausted the deadline.
        if (performance.now() >= deadline) stop('HTTP_TIMEOUT');
        const result = await Promise.race([promise, stopped]); checkDeadline(); return result;
      };
      try {
        signal?.addEventListener('abort', onAbort, { once: true });
        if (signal?.aborted) onAbort();
        checkDeadline();
        response = await guard(Promise.resolve().then(() => { checkDeadline(); return fetchImpl(url.href, {
          method: 'GET', credentials: 'omit', redirect: 'error', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal,
        }); }).then(result => {
          response = result;
          if (performance.now() >= deadline) stop('HTTP_TIMEOUT');
          if (stopError) cancelQuietly(result?.body);
          return result;
        }));
        if (!response || !Number.isInteger(response.status) || ['opaque', 'opaqueredirect', 'error'].includes(response.type)) fail('HTTP_RESPONSE', 'Expected an inspectable HTTP response.');
        if (response.redirected || (response.url && response.url !== url.href)) fail('HTTP_REDIRECT', 'Redirected responses are outside this adapter.');
        if (response.status < 200 || response.status >= 300) fail('HTTP_STATUS', 'The HTTP response was not successful.');
        const lengthText = response.headers.get('content-length'); let declaredLength = null;
        if (lengthText !== null) {
          if (!/^[0-9]{1,20}$/.test(lengthText)) fail('HTTP_LENGTH', 'Expected a bounded decimal content length.');
          const declared = BigInt(lengthText);
          if (declared > BigInt(maximum)) fail('HTTP_BODY_LIMIT', 'The declared response exceeds its byte budget.');
          declaredLength = Number(declared);
        }
        let output = new Uint8Array(Math.min(4096, maximum)), total = 0;
        if (response.body !== null) {
          reader = response.body.getReader();
          let reads = 0;
          for (;;) {
            if (++reads > LAUNCHER_HTTP_LIMITS.readCalls) fail('HTTP_READ_LIMIT', 'The response exceeded its read-operation budget.');
            const item = await guard(reader.read());
            if (stopError) throw stopError;
            if (item.done) break;
            let count;
            try { count = Reflect.apply(typedLength, item.value, []); } catch { fail('HTTP_RESPONSE', 'Expected actual byte chunks.'); }
            if (!(item.value instanceof Uint8Array)) fail('HTTP_RESPONSE', 'Expected Uint8Array chunks.');
            if (count > maximum - total) fail('HTTP_BODY_LIMIT', 'The response exceeds its byte budget.');
            if (total + count > output.length) {
              const grown = new Uint8Array(Math.min(maximum, Math.max(total + count, output.length * 2)));
              grown.set(output); output = grown;
            }
            // Intrinsic typed-array copy ignores a subclass iterator/metadata.
            Uint8Array.prototype.set.call(output, item.value, total); total += count;
          }
        }
        checkDeadline();
        const result = Object.freeze({ bytes: output.slice(0, total), byteLength: total, status: response.status, declaredLength, trust: 'unverified' });
        checkDeadline();
        completed = true;
        return result;
      } catch (error) {
        // A synchronous provider failure can also delay the timeout callback.
        if (performance.now() >= deadline) stop('HTTP_TIMEOUT');
        if (stopError) throw stopError;
        if (error instanceof LauncherHttpError) throw error;
        throw new LauncherHttpError('HTTP_NETWORK', 'The HTTP request or body read failed.');
      } finally {
        clearTimeout(timer); signal?.removeEventListener('abort', onAbort);
        if (!completed) { controller.abort(); cancelQuietly(reader ?? response?.body); }
        try { reader?.releaseLock(); } catch { /* Cancellation can still have a pending read. */ }
      }
    },
  });
}

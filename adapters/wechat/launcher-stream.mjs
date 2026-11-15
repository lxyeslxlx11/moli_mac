/** WeChat TCP port. Explicit targets only; native domain/quota checks are never disabled. */
import { LauncherSessionError, sessionFail, ownSessionValue, snapshotSessionEndpoints,
  snapshotSessionEndpoint } from '../../web/launcher-session-data.mjs';
import { weChatSignal } from './launcher-control.mjs';

export const WECHAT_LAUNCHER_STREAM_LIMITS = Object.freeze({ chunkBytes: 65536, inboundBytes: 4 * 1024 * 1024,
  outboundBytes: 4 * 1024 * 1024, messages: 4096, connectTimeoutMs: 2000 });
const blocked = new Set([1099,1433,1521,1719,1720,1723,2049,2375,3128,3306,3389,3659,4045,5060,5061,
  5432,5984,6379,6000,6566,7001,7002,8443,8888,9200,9300,10051,10080,11211,27017,27018,27019]);
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const key = value => JSON.stringify([value.address, value.port]);

export function snapshotWeChatTCPEndpoint(value) {
  const selected = snapshotSessionEndpoint(value), address = selected.address.toLowerCase(), port = selected.port;
  if (port < 1024 || blocked.has(port) || (port >= 8000 && port <= 8100) || address === 'localhost') sessionFail('STREAM_INPUT');
  if (/^[\d.]+$/.test(address)) {
    const numbers = address.split('.');
    if (numbers.length !== 4 || numbers.some(v => !/^(0|[1-9]\d{0,2})$/.test(v) || Number(v) > 255)) sessionFail('STREAM_INPUT');
    const [a,b,c,d] = numbers.map(Number);
    if (!(a === 10 || a === 192 && b === 168 || a === 172 && b >= 16 && b <= 31) || d === 255) sessionFail('STREAM_INPUT');
  } else if (!address.split('.').every(label => label.length >= 1 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) {
    sessionFail('STREAM_INPUT');
  }
  return Object.freeze({ address, port });
}
function owned(value, maximum) {
  try {
    if (value instanceof ArrayBuffer) {
      const length = Reflect.apply(bufferLength, value, []);
      if (!length || length > maximum) sessionFail('STREAM_INPUT');
      return new Uint8Array(new Uint8Array(value));
    }
    if (!(value instanceof Uint8Array)) sessionFail('STREAM_INPUT');
    const length = Reflect.apply(lengthOf, value, []);
    Reflect.apply(bufferLength, Reflect.apply(bufferOf, value, []), []);
    if (!length || length > maximum) sessionFail('STREAM_INPUT');
    return new Uint8Array(value);
  } catch { sessionFail('STREAM_INPUT'); }
}
function signalFrom(options) {
  try { return weChatSignal(ownSessionValue(options, 'signal', true)); } catch { sessionFail('STREAM_INPUT'); }
}
function method(object, name) {
  let fn;
  try { fn = object[name]; } catch { sessionFail('STREAM_INPUT'); }
  if (typeof fn !== 'function') sessionFail('STREAM_INPUT');
  return (...args) => Reflect.apply(fn, object, args);
}

export function createWeChatLauncherTransport(input) {
  const wx = ownSessionValue(input, 'wx'), create = method(wx, 'createTCPSocket');
  const allowed = snapshotSessionEndpoints(ownSessionValue(input, 'allowedEndpoints')).map(snapshotWeChatTCPEndpoint);
  const whitelist = new Set(allowed.map(key)), limits = WECHAT_LAUNCHER_STREAM_LIMITS;
  return Object.freeze({ openStream(value, options = {}) {
    const selected = snapshotWeChatTCPEndpoint(value), signal = signalFrom(options);
    if (!whitelist.has(key(selected))) sessionFail('STREAM_DENIED');
    if (signal?.aborted()) sessionFail('STREAM_ABORTED');
    return new Promise((resolve, reject) => {
      let socket, ready = false, closed = false, eof = false, failure = null, pendingRead = null;
      let readBusy = false, writeBusy = false, received = 0, queued = 0, sentBytes = 0, messages = 0;
      const queue = [], sent = [], remove = [];
      function settleRead() {
        if (!pendingRead) return;
        const pending = pendingRead;
        if (queue.length) { const bytes = queue.shift(); queued -= bytes.length; pendingRead = null; pending.resolve(bytes); }
        else if (failure) { pendingRead = null; pending.reject(new LauncherSessionError(failure)); }
        else if (eof) { pendingRead = null; pending.resolve(null); }
      }
      function finish(code = null, remoteEnd = false) {
        if (closed) {
          if (eof && !remoteEnd) {
            eof = false; failure = code ?? 'STREAM_CLOSED';
            for (const bytes of queue) bytes.fill(0); queue.length = 0; queued = 0; settleRead();
          }
          return;
        }
        closed = true; eof = remoteEnd; failure = code ?? (remoteEnd ? null : 'STREAM_CLOSED');
        signal?.remove(abort);
        for (const off of remove) { try { off(); } catch { /* Host callback removal is best effort. */ } }
        remove.length = 0;
        try { socket?.close(); } catch { /* Host close may already have occurred. */ }
        for (const bytes of sent) bytes.fill(0); sent.length = 0;
        if (!remoteEnd) { for (const bytes of queue) bytes.fill(0); queue.length = 0; queued = 0; }
        if (!ready) reject(new LauncherSessionError(code ?? 'STREAM_CONNECT'));
        settleRead();
      }
      const abort = () => finish('STREAM_ABORTED');
      function operationSignal(operationOptions) {
        const current = signalFrom(operationOptions) ?? signal;
        if (current?.aborted()) { finish('STREAM_ABORTED'); sessionFail('STREAM_ABORTED'); }
        return current;
      }
      const stream = Object.freeze({
        async read(readOptions = {}) {
          const current = operationSignal(readOptions);
          if (readBusy) sessionFail('STREAM_BUSY');
          if (failure) sessionFail(failure);
          readBusy = true; const cancelled = () => finish('STREAM_ABORTED');
          try {
            current?.add(cancelled);
            if (current?.aborted()) cancelled();
            return await new Promise((resolveRead, rejectRead) => { pendingRead = { resolve: resolveRead, reject: rejectRead }; settleRead(); });
          } finally { current?.remove(cancelled); readBusy = false; }
        },
        async write(value, writeOptions = {}) {
          const current = operationSignal(writeOptions);
          if (writeBusy) sessionFail('STREAM_BUSY');
          if (closed || failure) sessionFail(failure ?? 'STREAM_CLOSED');
          const copy = owned(value, limits.chunkBytes);
          if (sentBytes + copy.length > limits.outboundBytes) { copy.fill(0); finish('STREAM_WRITE'); sessionFail('STREAM_WRITE'); }
          writeBusy = true; const cancelled = () => finish('STREAM_ABORTED');
          try {
            current?.add(cancelled);
            if (current?.aborted()) { cancelled(); sessionFail('STREAM_ABORTED'); }
            sent.push(copy); sentBytes += copy.length;
            try { socket.write(copy.buffer); } catch { finish('STREAM_WRITE'); }
            if (closed || failure) sessionFail(failure ?? 'STREAM_CLOSED');
            await Promise.resolve(); // Native API returns void: acceptance, not a delivery acknowledgement.
          } finally { current?.remove(cancelled); writeBusy = false; }
        },
        close() { finish(); },
      });
      try {
        socket = create();
        const connect = method(socket, 'connect');
        const callbacks = {
          Connect() { if (closed || ready) return; ready = true; resolve(stream); },
          Message(event) {
            if (closed) return;
            try {
              const message = ownSessionValue(event, 'message');
              const length = Reflect.apply(bufferLength, message, []);
              messages++;
              if (messages > limits.messages || received + length > limits.inboundBytes || queued + length > limits.inboundBytes) { finish('STREAM_READ'); return; }
              const bytes = new Uint8Array(message); // Borrow native non-shared bytes only while making owned chunks.
              received += length;
              for (let at = 0; at < length; at += limits.chunkBytes) {
                const part = bytes.slice(at, at + limits.chunkBytes); queue.push(part); queued += part.length;
              }
              settleRead();
            } catch { finish('STREAM_READ'); }
          },
          Error() { finish(ready ? 'STREAM_READ' : 'STREAM_CONNECT'); },
          Close() { finish(null, ready); },
        };
        for (const [name, callback] of Object.entries(callbacks)) {
          const on = method(socket, 'on' + name), off = method(socket, 'off' + name);
          on(callback); remove.push(() => off(callback));
        }
        signal?.add(abort);
        if (signal?.aborted()) { abort(); return; }
        connect({ address: selected.address, port: selected.port, timeout: limits.connectTimeoutMs });
      } catch { finish('STREAM_CONNECT'); }
    });
  } });
}

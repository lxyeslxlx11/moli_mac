/** Browser-native WebSocket streams for the explicit loopback bridge. */
import { LauncherSessionError, sessionFail, ownSessionValue, ownedSessionBytes,
  snapshotSessionEndpoints, snapshotSessionEndpoint, sessionSignal } from './launcher-session-data.mjs';

const MAX = 4 * 1024 * 1024, CHUNK = 65536, GAME_QUEUE_CHUNKS = 8192;
const key = endpoint => `${endpoint.address}:${endpoint.port}`;
function checkedSignal(options) {
  try { return sessionSignal(ownSessionValue(options, 'signal', true)); }
  catch { sessionFail('STREAM_INPUT'); }
}

export function createBrowserLauncherTransport(input) {
  return createBrowserStreamTransport(input, false);
}

export function createBrowserGameTransport(input) {
  return createBrowserStreamTransport(input, true);
}

function createBrowserStreamTransport(input, game) {
  const origin = ownSessionValue(input, 'origin'), token = ownSessionValue(input, 'token');
  const endpoints = snapshotSessionEndpoints(ownSessionValue(input, 'endpoints'));
  const WebSocketClass = ownSessionValue(input, 'WebSocket', true) ?? globalThis.WebSocket;
  let parsed;
  try { parsed = new URL(origin); } catch { sessionFail('STREAM_INPUT'); }
  if (typeof origin !== 'string' || parsed.origin !== origin || parsed.protocol !== 'http:'
      || parsed.hostname !== '127.0.0.1' || parsed.username || parsed.password || parsed.pathname !== '/'
      || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || typeof WebSocketClass !== 'function'
      || endpoints.some(endpoint => endpoint.address !== '127.0.0.1')) sessionFail('STREAM_INPUT');
  return Object.freeze({
    openStream(value, options = {}) {
      const endpoint = snapshotSessionEndpoint(value), signal = checkedSignal(options);
      const selected = endpoints.findIndex(item => key(item) === key(endpoint));
      if (selected === -1) sessionFail('STREAM_DENIED');
      if (signal?.aborted()) sessionFail('STREAM_ABORTED');
      return new Promise((opened, openFailed) => {
        let socket, ready = false, closed = false, eof = false, failure = null;
        let waitingRead = null, waitingWrite = null, readBusy = false, writeBusy = false, ordinal = 0;
        let queued = 0, received = 0, messages = 0;
        const queue = [];
        function settleRead() {
          if (!waitingRead) return;
          if (queue.length) {
            const bytes = queue.shift(); queued -= bytes.length;
            const pending = waitingRead; waitingRead = null; pending.resolve(bytes);
          } else if (failure) {
            const pending = waitingRead; waitingRead = null; pending.reject(new LauncherSessionError(failure));
          } else if (eof) {
            const pending = waitingRead; waitingRead = null; pending.resolve(null);
          }
        }
        function finish(code = null, preserveQueue = false) {
          if (closed) return;
          closed = true; failure = code;
          try { signal?.remove(abort); } catch { /* Native listener cleanup is best effort. */ }
          if (!preserveQueue) { for (const bytes of queue) bytes.fill(0); queue.length = 0; queued = 0; }
          if (!ready) openFailed(new LauncherSessionError(code ?? 'STREAM_CLOSED'));
          if (waitingWrite) { waitingWrite.reject(new LauncherSessionError(code ?? 'STREAM_CLOSED')); waitingWrite = null; }
          if (!failure && !preserveQueue) failure = 'STREAM_CLOSED';
          settleRead();
          try { socket?.close(); } catch { /* Already closing. */ }
        }
        const abort = () => finish('STREAM_ABORTED');
        function operation(action, operationOptions, busyKind) {
          const operationSignal = checkedSignal(operationOptions) ?? signal;
          if (operationSignal?.aborted()) { finish('STREAM_ABORTED'); sessionFail('STREAM_ABORTED'); }
          if (failure) sessionFail(failure);
          if (closed && !eof) sessionFail('STREAM_CLOSED');
          if (busyKind === 'read' ? readBusy : writeBusy) sessionFail('STREAM_BUSY');
          if (busyKind === 'read') readBusy = true; else writeBusy = true;
          const cancelled = () => finish('STREAM_ABORTED');
          return (async () => {
            try {
              operationSignal?.add(cancelled);
              if (operationSignal?.aborted()) cancelled();
              if (failure) sessionFail(failure);
              return await action();
            } finally {
              operationSignal?.remove(cancelled);
              if (busyKind === 'read') readBusy = false; else writeBusy = false;
            }
          })();
        }
        const stream = Object.freeze({
          read(readOptions = {}) {
            return operation(() => new Promise((resolve, reject) => { waitingRead = { resolve, reject }; settleRead(); }), readOptions, 'read');
          },
          write(value, writeOptions = {}) {
            const copy = ownedSessionBytes(value);
            try {
              return operation(() => new Promise((resolve, reject) => {
                if (eof || socket.readyState !== 1) { reject(new LauncherSessionError('STREAM_CLOSED')); return; }
                waitingWrite = { resolve, reject, ordinal };
                try { socket.send(copy); } catch { finish('STREAM_WRITE'); }
              }), writeOptions, 'write');
            } finally { copy.fill(0); }
          },
          close() { finish(); },
        });
        try {
          const path = game ? '/game-stream' : '/stream';
          socket = new WebSocketClass(origin.replace('http:', 'ws:') + path, 'moli-launcher-v1');
          socket.binaryType = 'arraybuffer';
          socket.addEventListener('open', () => {
            if (closed) return;
            try { socket.send(JSON.stringify({ v: 1, token, endpointOrdinal: selected })); }
            catch { finish('STREAM_CONNECT'); }
          });
          socket.addEventListener('message', event => {
            if (closed) return;
            if (!game) {
              messages += 1;
              if (messages > 16384) { finish('STREAM_READ'); return; }
            }
            if (typeof event.data === 'string') {
              if (event.data.length > 128) { finish('STREAM_READ'); return; }
              let message;
              try { message = JSON.parse(event.data); } catch { finish('STREAM_READ'); return; }
              if (!message || typeof message !== 'object') { finish('STREAM_READ'); return; }
              if (!ready && message.type === 'ready' && Object.keys(message).length === 1) {
                ready = true; opened(stream); return;
              }
              if (ready && message.type === 'written' && waitingWrite && message.ordinal === waitingWrite.ordinal
                  && Object.keys(message).length === 2) {
                const pending = waitingWrite; waitingWrite = null; ordinal += 1; pending.resolve(); return;
              }
              if (ready && message.type === 'eof' && Object.keys(message).length === 1) {
                eof = true; finish(null, true); return;
              }
              finish(ready ? 'STREAM_READ' : 'STREAM_CONNECT'); return;
            }
            if (!ready || !(event.data instanceof ArrayBuffer)) { finish('STREAM_READ'); return; }
            let bytes;
            try { bytes = ownedSessionBytes(event.data, CHUNK); } catch { finish('STREAM_READ'); return; }
            queued += bytes.length;
            if (!game) received += bytes.length;
            if (queued > MAX || received > MAX || (game && queue.length >= GAME_QUEUE_CHUNKS)) {
              bytes.fill(0); finish('STREAM_READ'); return;
            }
            queue.push(bytes); settleRead();
          });
          socket.addEventListener('error', () => finish(ready ? 'STREAM_READ' : 'STREAM_CONNECT'));
          socket.addEventListener('close', () => { if (!closed) finish(ready ? 'STREAM_READ' : 'STREAM_CONNECT'); });
          signal?.add(abort);
          if (signal?.aborted()) abort();
        } catch { finish('STREAM_CONNECT'); }
      });
    },
  });
}

/** Node TCP development/verification port. Only an explicit endpoint allowlist can be opened. */
import { createConnection, isIP } from 'node:net';
import { Buffer } from 'node:buffer';
import { LauncherSessionError, LAUNCHER_SESSION_LIMITS, sessionFail, ownSessionValue,
  ownedSessionBytes, snapshotSessionEndpoint, snapshotSessionEndpoints, sessionSignal } from '../../web/launcher-session-data.mjs';

function endpoint(value) {
  let selected;
  try { selected = snapshotSessionEndpoint(value); } catch { sessionFail('STREAM_INPUT'); }
  const address = selected.address.toLowerCase();
  if (!isIP(address) && (/^[\d.]+$/.test(address) || !address.split('.').every(label =>
    label.length >= 1 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)))) {
    sessionFail('STREAM_INPUT');
  }
  return Object.freeze({ address, port: selected.port });
}
const key = value => JSON.stringify([value.address, value.port]);
function signalFrom(options) {
  try { return sessionSignal(ownSessionValue(options, 'signal', true)); } catch { sessionFail('STREAM_INPUT'); }
}
const isAborted = signal => { try { return signal?.aborted() ?? false; } catch { return true; } };

export function createNodeLauncherTransport(input) {
  const allowed = snapshotSessionEndpoints(ownSessionValue(input, 'allowedEndpoints')).map(endpoint);
  const whitelist = new Set(allowed.map(key));
  return Object.freeze({
    async openStream(value, options = {}) {
      const selected = endpoint(value), signal = signalFrom(options);
      if (!whitelist.has(key(selected))) sessionFail('STREAM_DENIED');
      if (isAborted(signal)) sessionFail('STREAM_ABORTED');
      return new Promise((resolve, reject) => {
        let socket, opened = false;
        try {
          socket = createConnection({ host: selected.address, port: selected.port,
            highWaterMark: LAUNCHER_SESSION_LIMITS.chunkBytes, allowHalfOpen: false,
            ...(signal ? { signal: signal.value } : {}) });
        } catch { reject(new LauncherSessionError('STREAM_CONNECT')); return; }
        // Error delivery remains owned while opening, reading, writing, and closing.
        socket.on('error', () => {});
        socket.once('error', () => {
          if (!opened) reject(new LauncherSessionError(isAborted(signal) ? 'STREAM_ABORTED' : 'STREAM_CONNECT'));
        });
        socket.once('close', () => {
          if (!opened) reject(new LauncherSessionError(isAborted(signal) ? 'STREAM_ABORTED' : 'STREAM_CONNECT'));
        });
        socket.once('connect', () => {
          if (isAborted(signal)) { socket.destroy(); reject(new LauncherSessionError('STREAM_ABORTED')); return; }
          opened = true; socket.setNoDelay(true);
          const iterator = socket[Symbol.asyncIterator]();
          let closed = false, ended = false, reading = false, writing = false, pending = null, at = 0;
          function close() {
            if (closed) return;
            closed = true;
            pending?.fill(0); pending = null; at = 0;
            socket.destroy();
            try { Promise.resolve(iterator.return()).catch(() => {}); } catch { /* Socket is already destroyed. */ }
          }
          async function operation(action, operationSignal, code) {
            if (isAborted(operationSignal)) { close(); sessionFail('STREAM_ABORTED'); }
            let rejectAbort, cancelled = false;
            const stopped = new Promise((_, rejectStop) => { rejectAbort = rejectStop; });
            const abort = () => { cancelled = true; close(); rejectAbort(new LauncherSessionError('STREAM_ABORTED')); };
            try {
              operationSignal?.add(abort);
              if (isAborted(operationSignal)) abort();
              const work = Promise.resolve().then(() => {
                if (cancelled || isAborted(operationSignal)) sessionFail('STREAM_ABORTED');
                if (closed) sessionFail('STREAM_CLOSED');
                return action();
              });
              return await Promise.race([work, stopped]);
            } catch {
              throw new LauncherSessionError(cancelled || isAborted(operationSignal) ? 'STREAM_ABORTED' : closed ? 'STREAM_CLOSED' : code);
            } finally { try { operationSignal?.remove(abort); } catch { close(); } }
          }
          resolve(Object.freeze({
            async read(readOptions = {}) {
              if (reading) sessionFail('STREAM_BUSY');
              if (closed) sessionFail('STREAM_CLOSED');
              if (ended) return null;
              const readSignal = signalFrom(readOptions) ?? signal;
              reading = true;
              try {
                return await operation(async () => {
                  while (!pending) {
                    const next = await iterator.next();
                    if (closed || isAborted(readSignal)) {
                      next.value?.fill(0); sessionFail(isAborted(readSignal) ? 'STREAM_ABORTED' : 'STREAM_CLOSED');
                    }
                    if (next.done) { ended = true; return null; }
                    if (!next.value.length) continue;
                    pending = next.value; at = 0;
                  }
                  const end = Math.min(pending.length, at + LAUNCHER_SESSION_LIMITS.chunkBytes);
                  const output = new Uint8Array(pending.subarray(at, end)); at = end;
                  if (at === pending.length) { pending.fill(0); pending = null; at = 0; }
                  return output;
                }, readSignal, 'STREAM_READ');
              } finally { reading = false; }
            },
            async write(value, writeOptions = {}) {
              if (writing) sessionFail('STREAM_BUSY');
              if (closed) sessionFail('STREAM_CLOSED');
              const writeSignal = signalFrom(writeOptions) ?? signal;
              const copy = ownedSessionBytes(value), buffer = Buffer.from(copy); copy.fill(0);
              writing = true;
              try {
                await operation(() => new Promise((written, failed) => {
                  socket.write(buffer, error => error ? failed(error) : written());
                }), writeSignal, 'STREAM_WRITE');
              } finally { buffer.fill(0); writing = false; }
            }, close,
          }));
        });
      });
    },
  });
}

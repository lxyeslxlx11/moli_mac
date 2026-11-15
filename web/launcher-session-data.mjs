/** Internal byte-stream contract helpers. No transport, account lookup or I/O. */
export const LAUNCHER_SESSION_LIMITS = Object.freeze({ endpoints: 10, endpointChars: 253,
  chunkBytes: 65536, inboundBytes: 4 * 1024 * 1024, exponentBytes: 20, timeoutMs: 10000 });
const messages = Object.freeze({
  SESSION_INPUT: 'Expected explicit launcher session inputs.',
  SESSION_BYTES: 'Expected an owned, bounded nonempty byte chunk.',
  SESSION_ENDPOINTS: 'Expected bounded explicit address and port endpoints.',
  SESSION_STREAM: 'Expected own read, write and close stream methods.',
  SESSION_CLOCK: 'The monotonic session clock is unavailable or invalid.',
  SESSION_TIMER: 'The session timer is unavailable or failed.',
  SESSION_CONTROL: 'The session cancellation controller is unavailable or invalid.',
  SESSION_RANDOM: 'The session entropy provider is unavailable or invalid.',
  SESSION_READ: 'The launcher stream read failed.',
  SESSION_WRITE: 'The launcher stream write failed.',
  SESSION_BUDGET: 'The launcher exchange exceeded its total input budget.',
  SESSION_INTERNAL: 'The launcher session could not continue.',
  STREAM_INPUT: 'Expected explicit byte-stream operation inputs.',
  STREAM_DENIED: 'The endpoint is outside the explicit transport allowlist.',
  STREAM_CONNECT: 'The allowed stream connection could not open.',
  STREAM_READ: 'The stream read could not complete.',
  STREAM_WRITE: 'The stream write could not complete.',
  STREAM_ABORTED: 'The stream operation was cancelled.',
  STREAM_CLOSED: 'The stream is closed.',
  STREAM_BUSY: 'Only one read and one write may be pending per stream.',
});
export class LauncherSessionError extends Error {
  constructor(code) {
    const selected = typeof code === 'string' && Object.prototype.hasOwnProperty.call(messages, code) ? code : 'SESSION_INTERNAL';
    super(messages[selected]); this.name = 'LauncherSessionError'; this.code = selected;
  }
}
export const sessionFail = code => { throw new LauncherSessionError(code); };
export function ownSessionValue(value, key, optional = false) {
  let descriptor;
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) sessionFail('SESSION_INPUT');
    descriptor = Object.getOwnPropertyDescriptor(value, key);
  } catch { sessionFail('SESSION_INPUT'); }
  if (!descriptor && optional) return undefined;
  if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) sessionFail('SESSION_INPUT');
  return descriptor.value;
}
export function safeSessionError(error, fallback) {
  let code;
  try { code = Object.getOwnPropertyDescriptor(error, 'code')?.value; } catch { /* Provider text is never copied. */ }
  return new LauncherSessionError(typeof code === 'string' && Object.prototype.hasOwnProperty.call(messages, code) ? code : fallback);
}
const typedLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
export function ownedSessionBytes(value, maximum = LAUNCHER_SESSION_LIMITS.chunkBytes, minimum = 1) {
  try {
    if (value instanceof ArrayBuffer) {
      const length = Reflect.apply(bufferLength, value, []);
      if (length < minimum || length > maximum) sessionFail('SESSION_BYTES');
      return new Uint8Array(new Uint8Array(value));
    }
    if (!(value instanceof Uint8Array)) sessionFail('SESSION_BYTES');
    const length = Reflect.apply(typedLength, value, []);
    if (length < minimum || length > maximum) sessionFail('SESSION_BYTES');
    return new Uint8Array(value);
  } catch { sessionFail('SESSION_BYTES'); }
}
export function snapshotSessionEndpoint(value) {
  const address = ownSessionValue(value, 'address'), port = ownSessionValue(value, 'port');
  if (typeof address !== 'string' || !address.length || address.length > LAUNCHER_SESSION_LIMITS.endpointChars
      || /[^\x21-\x7e]|[\\/@?#\[\]]/.test(address) || !Number.isInteger(port) || port < 1 || port > 65535) {
    sessionFail('SESSION_ENDPOINTS');
  }
  return Object.freeze({ address, port });
}
export function snapshotSessionEndpoints(value) {
  let length;
  try { if (!Array.isArray(value)) sessionFail('SESSION_ENDPOINTS'); length = Object.getOwnPropertyDescriptor(value, 'length')?.value; }
  catch { sessionFail('SESSION_ENDPOINTS'); }
  if (!Number.isInteger(length) || length < 1 || length > LAUNCHER_SESSION_LIMITS.endpoints) sessionFail('SESSION_ENDPOINTS');
  const output = [];
  for (let i = 0; i < length; i++) {
    let descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(value, String(i)); } catch { sessionFail('SESSION_ENDPOINTS'); }
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) sessionFail('SESSION_ENDPOINTS');
    output.push(snapshotSessionEndpoint(descriptor.value));
  }
  return Object.freeze(output);
}
export function sessionSignal(value) {
  if (value === undefined) return null;
  try {
    const getter = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
    Reflect.apply(getter, value, []);
    return Object.freeze({ value, aborted: () => Reflect.apply(getter, value, []),
      add: listener => Reflect.apply(EventTarget.prototype.addEventListener, value, ['abort', listener, { once: true }]),
      remove: listener => Reflect.apply(EventTarget.prototype.removeEventListener, value, ['abort', listener]) });
  } catch { sessionFail('SESSION_INPUT'); }
}

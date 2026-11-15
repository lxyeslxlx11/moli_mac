/** Explicit local resource cache. One complete record and CAS revision per independent browser profile. */
import { readLauncherResourceSnapshot } from '../shared/launcher-resources.mjs';
export const LAUNCHER_RESOURCE_STORE = Object.freeze({ prefix: 'moli-mac.launcher.resources.', version: 1,
  store: 'snapshots', key: 'selected', timeoutMs: 10000, maximumTimeoutMs: 60000 });
export class LauncherResourceStoreError extends Error {
  constructor(code) { super('Local resource cache operation could not complete.'); this.name = 'LauncherResourceStoreError'; this.code = code; }
}
const error = code => new LauncherResourceStoreError(code);
const signalAborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
const fill = Uint8Array.prototype.fill;
const revisionValid = value => Number.isSafeInteger(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER;
const release = value => { for (const row of value?.files ?? []) Reflect.apply(fill, row.bytes, [0]); };
function recordSnapshot(value) {
  if (value === undefined) return Object.freeze({ revision: 0, resources: null, trust: 'unverified' });
  try {
    if (!value || typeof value !== 'object' || Reflect.ownKeys(value).length !== 4 ||
        value.key !== LAUNCHER_RESOURCE_STORE.key || value.schema !== 1 || !revisionValid(value.revision) || value.revision === 0 ||
        !Object.hasOwn(value, 'resources')) throw new Error();
    return Object.freeze({ revision: value.revision, resources: readLauncherResourceSnapshot(value.resources), trust: 'unverified' });
  } catch { throw error('RESOURCE_CACHE_CORRUPT'); }
}

export function createLauncherResourceStore({ profile, indexedDB: factory = globalThis.indexedDB } = {}) {
  if (typeof profile !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(profile)) throw error('RESOURCE_CACHE_INPUT');
  let open;
  try { open = factory?.open; if (typeof open !== 'function') throw new Error(); }
  catch { throw error('RESOURCE_CACHE_UNAVAILABLE'); }
  const databaseName = LAUNCHER_RESOURCE_STORE.prefix + profile;

  async function operate(mode, value, options = {}) {
    const timeoutMs = options.timeoutMs ?? LAUNCHER_RESOURCE_STORE.timeoutMs, signal = options.signal, expectedRevision = options.expectedRevision;
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > LAUNCHER_RESOURCE_STORE.maximumTimeoutMs) throw error('RESOURCE_CACHE_INPUT');
    const deadline = performance.now() + timeoutMs;
    if (signal !== undefined) {
      let stopped; try { stopped = Reflect.apply(signalAborted, signal, []); } catch { throw error('RESOURCE_CACHE_INPUT'); }
      if (stopped) throw error('RESOURCE_CACHE_ABORTED');
    }
    let candidate;
    if (mode === 'readwrite') {
      if (!revisionValid(expectedRevision)) throw error('RESOURCE_CACHE_INPUT');
      try { candidate = readLauncherResourceSnapshot(value); } catch { throw error('RESOURCE_CACHE_CANDIDATE'); }
    }
    if (performance.now() >= deadline) { release(candidate); throw error('RESOURCE_CACHE_TIMEOUT'); }
    return new Promise((resolve, reject) => {
      let db, transaction, request, settled = false, pendingFailure, result, putSucceeded = false;
      const finish = (failure, output) => {
        if (settled) return;
        settled = true; clearTimeout(timer); signal?.removeEventListener('abort', onAbort); db?.close(); release(candidate);
        if (failure) { release(result?.resources); reject(failure); } else resolve(output);
      };
      const stop = code => {
        if (settled) return;
        pendingFailure ??= error(code);
        if (!transaction) finish(pendingFailure);
        else { try { transaction.abort(); } catch { /* A completed/committing transaction settles through its event. */ } }
      };
      const onAbort = () => stop(performance.now() >= deadline ? 'RESOURCE_CACHE_TIMEOUT' : 'RESOURCE_CACHE_ABORTED');
      const timer = setTimeout(() => stop('RESOURCE_CACHE_TIMEOUT'), Math.max(1, Math.ceil(deadline - performance.now())));
      signal?.addEventListener('abort', onAbort, { once: true });
      if (signal !== undefined && Reflect.apply(signalAborted, signal, [])) onAbort();
      if (settled) return;
      try { request = Reflect.apply(open, factory, [databaseName, LAUNCHER_RESOURCE_STORE.version]); }
      catch { finish(error('RESOURCE_CACHE_STORAGE')); return; }
      request.onblocked = () => stop('RESOURCE_CACHE_BLOCKED');
      request.onerror = () => finish(pendingFailure ?? error(request.error?.name === 'VersionError' ? 'RESOURCE_CACHE_SCHEMA' : 'RESOURCE_CACHE_STORAGE'));
      request.onupgradeneeded = event => {
        if (settled) { try { request.transaction.abort(); } catch { /* Already closing. */ } return; }
        try {
          if (event.oldVersion !== 0) throw new Error();
          request.result.createObjectStore(LAUNCHER_RESOURCE_STORE.store, { keyPath: 'key' });
        } catch { pendingFailure = error('RESOURCE_CACHE_SCHEMA'); try { request.transaction.abort(); } catch { /* Open error settles. */ } }
      };
      request.onsuccess = () => {
        db = request.result;
        if (settled) { db.close(); return; }
        db.onversionchange = () => db.close();
        try {
          if (performance.now() >= deadline) { stop('RESOURCE_CACHE_TIMEOUT'); return; }
          if (db.objectStoreNames.length !== 1 || !db.objectStoreNames.contains(LAUNCHER_RESOURCE_STORE.store)) throw error('RESOURCE_CACHE_SCHEMA');
          transaction = db.transaction(LAUNCHER_RESOURCE_STORE.store, mode);
          transaction.onabort = () => finish(pendingFailure ?? error('RESOURCE_CACHE_STORAGE'));
          transaction.onerror = () => { pendingFailure ??= error('RESOURCE_CACHE_STORAGE'); };
          transaction.oncomplete = () => {
            if (mode === 'readonly') {
              if (performance.now() >= deadline) pendingFailure ??= error('RESOURCE_CACHE_TIMEOUT');
              finish(pendingFailure, result);
            } else if (!putSucceeded) finish(pendingFailure ?? error('RESOURCE_CACHE_STORAGE'));
            else finish(null, Object.freeze({ revision: result.revision, committed: true,
              cancellationTooLate: !!pendingFailure, deadlineExceededAfterCommit: performance.now() >= deadline, trust: 'unverified' }));
          };
          const store = transaction.objectStore(LAUNCHER_RESOURCE_STORE.store);
          if (store.keyPath !== 'key' || store.autoIncrement || store.indexNames.length) throw error('RESOURCE_CACHE_SCHEMA');
          const get = store.get(LAUNCHER_RESOURCE_STORE.key);
          get.onsuccess = () => {
            try {
              result = recordSnapshot(get.result);
              if (performance.now() >= deadline) { stop('RESOURCE_CACHE_TIMEOUT'); return; }
              if (mode === 'readonly') return;
              const previousRevision = result.revision; release(result.resources); result = null;
              if (previousRevision !== expectedRevision) { stop('RESOURCE_CACHE_CONFLICT'); return; }
              const revision = previousRevision + 1;
              if (!revisionValid(revision)) { stop('RESOURCE_CACHE_CORRUPT'); return; }
              const put = store.put({ key: LAUNCHER_RESOURCE_STORE.key, schema: 1, revision, resources: candidate }); result = { revision };
              put.onsuccess = () => { putSucceeded = true; };
            } catch (failure) {
              pendingFailure = failure instanceof LauncherResourceStoreError ? failure : error('RESOURCE_CACHE_STORAGE'); stop(pendingFailure.code);
            }
          };
        } catch (failure) {
          pendingFailure = failure instanceof LauncherResourceStoreError ? failure : error('RESOURCE_CACHE_STORAGE');
          if (transaction) stop(pendingFailure.code); else finish(pendingFailure);
        }
      };
    });
  }
  return Object.freeze({ databaseName,
    read: options => operate('readonly', undefined, options),
    commitResources: (resources, options) => operate('readwrite', resources, options),
  });
}

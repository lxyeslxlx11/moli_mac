/** One explicit browser profile's candidate pair. No original files, account data or source-trust state. */
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';

export const LAUNCHER_CANDIDATE_STORE = Object.freeze({ prefix: 'moli-mac.launcher.candidates.', version: 1, store: 'pairs', key: 'pair', timeoutMs: 10000, maximumTimeoutMs: 60000 });
export class LauncherCandidateStoreError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherCandidateStoreError'; this.code = code; }
}
const error = code => new LauncherCandidateStoreError(code, 'Candidate cache operation could not complete.');
const signalAborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
const validRevision = value => Number.isSafeInteger(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER;
function recordSnapshot(value) {
  if (value === undefined) return Object.freeze({ revision: 0, catalogs: null, trust: 'unverified' });
  if (!value || value.key !== LAUNCHER_CANDIDATE_STORE.key || value.schema !== 1 || !validRevision(value.revision) || value.revision === 0) throw error('CACHE_CORRUPT');
  let catalogs; try { catalogs = snapshotLauncherCatalogCandidate(value); } catch { throw error('CACHE_CORRUPT'); }
  return Object.freeze({ revision: value.revision, catalogs, trust: 'unverified' });
}

export function createLauncherCandidateStore({ profile, indexedDB: factory = globalThis.indexedDB } = {}) {
  if (typeof profile !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(profile)) throw error('CACHE_INPUT');
  if (!factory || typeof factory.open !== 'function') throw error('CACHE_UNAVAILABLE');
  const databaseName = LAUNCHER_CANDIDATE_STORE.prefix + profile;

  async function operate(mode, value, options = {}) {
    const timeoutMs = options.timeoutMs ?? LAUNCHER_CANDIDATE_STORE.timeoutMs, signal = options.signal, expectedRevision = options.expectedRevision;
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > LAUNCHER_CANDIDATE_STORE.maximumTimeoutMs) throw error('CACHE_INPUT');
    const deadline = performance.now() + timeoutMs;
    if (signal !== undefined) {
      let aborted; try { aborted = Reflect.apply(signalAborted, signal, []); } catch { throw error('CACHE_INPUT'); }
      if (aborted) throw error('CACHE_ABORTED');
    }
    let candidate;
    if (mode === 'readwrite') {
      if (!validRevision(expectedRevision)) throw error('CACHE_INPUT');
      try { candidate = snapshotLauncherCatalogCandidate(value); } catch { throw error('CACHE_CANDIDATE'); }
    }
    if (performance.now() >= deadline) throw error('CACHE_TIMEOUT');
    return new Promise((resolve, reject) => {
      let db, transaction, request, settled = false, pendingFailure, result, putSucceeded = false;
      const finish = (failure, output) => {
        if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', onAbort); db?.close();
        if (failure) reject(failure); else resolve(output);
      };
      const stop = code => {
        if (settled) return;
        pendingFailure ??= error(code);
        if (!transaction) finish(pendingFailure);
        else {
          try { transaction.abort(); }
          catch { /* A committing/finished transaction is resolved by its complete/abort event. */ }
        }
      };
      const onAbort = () => stop(performance.now() >= deadline ? 'CACHE_TIMEOUT' : 'CACHE_ABORTED');
      const timer = setTimeout(() => stop('CACHE_TIMEOUT'), Math.max(1, Math.ceil(deadline - performance.now())));
      signal?.addEventListener('abort', onAbort, { once: true });
      if (signal?.aborted) onAbort();
      if (settled) return;
      try { request = factory.open(databaseName, LAUNCHER_CANDIDATE_STORE.version); }
      catch { finish(error('CACHE_STORAGE')); return; }
      request.onblocked = () => stop('CACHE_BLOCKED');
      request.onerror = () => finish(pendingFailure ?? error('CACHE_STORAGE'));
      request.onupgradeneeded = event => {
        if (settled) { try { request.transaction.abort(); } catch { /* Already closing. */ } return; }
        try {
          if (event.oldVersion !== 0) throw error('CACHE_SCHEMA');
          request.result.createObjectStore(LAUNCHER_CANDIDATE_STORE.store, { keyPath: 'key' });
        } catch { pendingFailure = error('CACHE_SCHEMA'); try { request.transaction.abort(); } catch { /* Open error will settle. */ } }
      };
      request.onsuccess = () => {
        db = request.result;
        if (settled) { db.close(); return; }
        db.onversionchange = () => db.close();
        try {
          if (performance.now() >= deadline) { stop('CACHE_TIMEOUT'); return; }
          if (db.objectStoreNames.length !== 1 || !db.objectStoreNames.contains(LAUNCHER_CANDIDATE_STORE.store)) throw error('CACHE_SCHEMA');
          transaction = db.transaction(LAUNCHER_CANDIDATE_STORE.store, mode);
          transaction.onabort = () => finish(pendingFailure ?? error('CACHE_STORAGE'));
          transaction.onerror = () => { pendingFailure ??= error('CACHE_STORAGE'); };
          transaction.oncomplete = () => {
            if (mode === 'readonly') {
              if (performance.now() >= deadline) pendingFailure ??= error('CACHE_TIMEOUT');
              finish(pendingFailure, result);
            } else if (!putSucceeded) finish(pendingFailure ?? error('CACHE_STORAGE'));
            else finish(null, Object.freeze({ revision: result.revision, committed: true,
              cancellationTooLate: !!pendingFailure, deadlineExceededAfterCommit: performance.now() >= deadline, trust: 'unverified' }));
          };
          const store = transaction.objectStore(LAUNCHER_CANDIDATE_STORE.store);
          if (store.keyPath !== 'key' || store.autoIncrement || store.indexNames.length) throw error('CACHE_SCHEMA');
          const get = store.get(LAUNCHER_CANDIDATE_STORE.key);
          get.onsuccess = () => {
            try {
              result = recordSnapshot(get.result);
              if (performance.now() >= deadline) { stop('CACHE_TIMEOUT'); return; }
              if (mode === 'readonly') return;
              if (result.revision !== expectedRevision) { stop('CACHE_CONFLICT'); return; }
              const revision = result.revision + 1;
              if (!validRevision(revision)) { stop('CACHE_CORRUPT'); return; }
              const record = { key: LAUNCHER_CANDIDATE_STORE.key, schema: 1, revision,
                gameListBytes: candidate.gameListBytes, regionListBytes: candidate.regionListBytes,
                gameListMd5: candidate.gameListMd5, regionListMd5: candidate.regionListMd5,
                encoding: candidate.encoding, allowBareAmpersands: candidate.allowBareAmpersands };
              const put = store.put(record); result = { revision };
              put.onsuccess = () => { putSucceeded = true; };
            } catch (failure) { pendingFailure = failure instanceof LauncherCandidateStoreError ? failure : error('CACHE_STORAGE'); stop(pendingFailure.code); }
          };
        } catch (failure) {
          pendingFailure = failure instanceof LauncherCandidateStoreError ? failure : error('CACHE_STORAGE');
          if (transaction) stop(pendingFailure.code); else finish(pendingFailure);
        }
      };
    });
  }
  return Object.freeze({ databaseName,
    read: options => operate('readonly', undefined, options),
    commitPair: (candidate, options) => operate('readwrite', candidate, options),
  });
}

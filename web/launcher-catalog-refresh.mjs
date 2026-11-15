/** Current-profile HTTP preparation -> one revision-checked browser catalog pair. No executable or account operations. */
import { createWin32LauncherBootstrap, LAUNCHER_BOOTSTRAP_LIMITS } from './launcher-bootstrap.mjs';
import { ownLauncherInputBytes, snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
import { LauncherCandidateStoreError } from './launcher-candidate-store.mjs';

export class LauncherCatalogRefreshError extends Error {
  constructor(code) { super('Catalog refresh could not complete.'); this.name = 'LauncherCatalogRefreshError'; this.code = code; }
}
const fail = code => { throw new LauncherCatalogRefreshError(code); };
const aborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
const addListener = EventTarget.prototype.addEventListener, removeListener = EventTarget.prototype.removeEventListener;
const typedBuffer = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const required = ['launcherBytes', 'endpoints', 'encoding', 'allowBareAmpersands'];
const optional = ['timeoutMs', 'signal'];
const endpointKeys = ['launcherDigest', 'updateLocator', 'catalogDigests', 'gameList', 'regionList'];
const revisionValid = value => Number.isSafeInteger(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER;

function data(value, key, code = 'REFRESH_INPUT') {
  const property = value && Object.getOwnPropertyDescriptor(value, key);
  if (!property || !Object.hasOwn(property, 'value')) fail(code);
  return property.value;
}
function inputSnapshot(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Reflect.ownKeys(input).some(key => ![...required, ...optional].includes(key))) fail('REFRESH_INPUT');
  const fixed = Object.fromEntries(required.map(key => [key, data(input, key)]));
  for (const key of optional) if (Object.hasOwn(input, key)) fixed[key] = data(input, key);
  if (!['utf-8', 'gb18030'].includes(fixed.encoding) || typeof fixed.allowBareAmpersands !== 'boolean') fail('REFRESH_INPUT');
  const endpoints = fixed.endpoints;
  if (!endpoints || typeof endpoints !== 'object' || Array.isArray(endpoints)
    || Reflect.ownKeys(endpoints).length !== endpointKeys.length) fail('REFRESH_INPUT');
  fixed.endpoints = Object.freeze(Object.fromEntries(endpointKeys.map(key => {
    const value = data(endpoints, key);
    if (typeof value !== 'string' || !value.length || value.length > 4096) fail('REFRESH_INPUT');
    return [key, value];
  })));
  try {
    const buffer = fixed.launcherBytes instanceof ArrayBuffer ? fixed.launcherBytes : Reflect.apply(typedBuffer, fixed.launcherBytes, []);
    Reflect.apply(bufferLength, buffer, []);
    fixed.launcherBytes = ownLauncherInputBytes(fixed.launcherBytes, LAUNCHER_BOOTSTRAP_LIMITS.launcherBytes, { allowEmpty: true });
  } catch { fail('REFRESH_INPUT'); }
  fixed.timeoutMs ??= LAUNCHER_BOOTSTRAP_LIMITS.timeoutMs;
  if (!Number.isInteger(fixed.timeoutMs) || fixed.timeoutMs < 1 || fixed.timeoutMs > LAUNCHER_BOOTSTRAP_LIMITS.maximumTimeoutMs) fail('REFRESH_INPUT');
  if (fixed.signal !== undefined) {
    let stopped;
    try { stopped = Reflect.apply(aborted, fixed.signal, []); } catch { fail('REFRESH_INPUT'); }
    if (stopped) fail('REFRESH_ABORTED');
  }
  return fixed;
}
function cacheSnapshot(value) {
  try {
    const revision = data(value, 'revision', 'REFRESH_CACHE'), pair = data(value, 'catalogs', 'REFRESH_CACHE');
    if (!revisionValid(revision) || (revision === 0) !== (pair === null)) fail('REFRESH_CACHE');
    return { revision, catalogs: pair === null ? null : snapshotLauncherCatalogCandidate(pair) };
  } catch { fail('REFRESH_CACHE'); }
}

/** Store contract: existing candidate-store read/commitPair, including its authoritative late-commit receipt. */
export function createWin32LauncherCatalogRefresh({ httpClient, store, cacheTick } = {}) {
  if (!store || typeof store.read !== 'function' || typeof store.commitPair !== 'function') fail('REFRESH_INPUT');
  const readCache = store.read.bind(store), commitPair = store.commitPair.bind(store);
  const bootstrap = createWin32LauncherBootstrap({ httpClient, cacheTick });
  let busy = false;
  return Object.freeze({
    async refresh(input) {
      if (busy) fail('REFRESH_BUSY');
      const started = performance.now(), fixed = inputSnapshot(input), deadline = started + fixed.timeoutMs;
      const control = new AbortController();
      let stopError, rejectStop, phase = 'read';
      const stopped = new Promise((resolve, reject) => { rejectStop = reject; }); stopped.catch(() => {});
      const stop = code => {
        if (stopError) return;
        stopError = new LauncherCatalogRefreshError(code); control.abort(); rejectStop(stopError);
      };
      const check = () => { if (performance.now() >= deadline) stop('REFRESH_TIMEOUT'); if (stopError) throw stopError; };
      const remaining = () => { check(); return Math.max(1, Math.ceil(deadline - performance.now())); };
      const onAbort = () => stop(performance.now() >= deadline ? 'REFRESH_TIMEOUT' : 'REFRESH_ABORTED');
      const timer = setTimeout(() => stop('REFRESH_TIMEOUT'), Math.max(1, Math.ceil(deadline - performance.now())));
      const read = async () => {
        const request = Promise.resolve().then(() => readCache({ signal: control.signal, timeoutMs: remaining() }));
        const value = await Promise.race([request, stopped]); check(); return cacheSnapshot(value);
      };
      busy = true;
      try {
        if (fixed.signal !== undefined) {
          Reflect.apply(addListener, fixed.signal, ['abort', onAbort, { once: true }]);
          if (Reflect.apply(aborted, fixed.signal, [])) onAbort();
        }
        check();
        const previous = await read();
        phase = 'prepare';
        const request = bootstrap.prepare({ launcherBytes: fixed.launcherBytes,
          gameListBytes: previous.catalogs?.gameListBytes ?? null, regionListBytes: previous.catalogs?.regionListBytes ?? null,
          endpoints: fixed.endpoints, encoding: fixed.encoding, allowBareAmpersands: fixed.allowBareAmpersands,
          signal: control.signal, timeoutMs: remaining() });
        const prepared = await Promise.race([request, stopped]); check();
        if (prepared.disposition === 'launcher-update-candidate') {
          return Object.freeze({ disposition: prepared.disposition, prepared, revision: previous.revision, committed: false,
            cacheCommit: 'not-performed', trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
        }
        const catalogs = snapshotLauncherCatalogCandidate(prepared.catalogs);
        const cacheSettingsChanged = !!previous.catalogs && (previous.catalogs.encoding !== catalogs.encoding
          || previous.catalogs.allowBareAmpersands !== catalogs.allowBareAmpersands);
        if (!prepared.comparison.requiresReplacement && !cacheSettingsChanged) {
          phase = 'read';
          const latest = await read();
          if (latest.revision !== previous.revision) fail('REFRESH_CONFLICT');
          return Object.freeze({ disposition: 'catalogs-unchanged', catalogs, comparison: prepared.comparison,
            revision: previous.revision, committed: false, cacheSettingsChanged, trust: 'unverified',
            authentication: 'unverified', execution: 'not-performed' });
        }
        const timeoutMs = remaining();
        phase = 'commit';
        // Never race a write against cancellation: the transaction can have committed before cancellation arrives.
        const receipt = await commitPair(catalogs, { expectedRevision: previous.revision, signal: control.signal, timeoutMs });
        let revision, cancellationTooLate, deadlineExceededAfterCommit;
        try {
          revision = data(receipt, 'revision'); cancellationTooLate = data(receipt, 'cancellationTooLate');
          deadlineExceededAfterCommit = data(receipt, 'deadlineExceededAfterCommit');
          if (data(receipt, 'committed') !== true || !revisionValid(revision) || revision !== previous.revision + 1
            || typeof cancellationTooLate !== 'boolean' || typeof deadlineExceededAfterCommit !== 'boolean') fail('REFRESH_COMMIT_UNCONFIRMED');
        } catch { fail('REFRESH_COMMIT_UNCONFIRMED'); }
        return Object.freeze({ disposition: 'catalogs-committed', catalogs, comparison: prepared.comparison, revision, committed: true,
          cacheSettingsChanged, cancellationTooLate: cancellationTooLate || !!stopError,
          deadlineExceededAfterCommit: deadlineExceededAfterCommit || performance.now() >= deadline,
          trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
      } catch (error) {
        if (error instanceof LauncherCatalogRefreshError) throw error;
        if (error instanceof LauncherCandidateStoreError) {
          if (error.code === 'CACHE_CONFLICT') fail('REFRESH_CONFLICT');
          if (stopError) throw stopError;
          if (error.code === 'CACHE_ABORTED') fail('REFRESH_ABORTED');
          if (error.code === 'CACHE_TIMEOUT') fail('REFRESH_TIMEOUT');
          fail('REFRESH_CACHE');
        }
        if (phase === 'commit') fail('REFRESH_COMMIT_UNCONFIRMED');
        if (stopError) throw stopError;
        if (phase === 'read') fail('REFRESH_CACHE');
        fail('REFRESH_DATA');
      } finally {
        clearTimeout(timer); busy = false;
        if (fixed.signal !== undefined) Reflect.apply(removeListener, fixed.signal, ['abort', onAbort]);
      }
    },
  });
}

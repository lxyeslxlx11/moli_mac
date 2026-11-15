/** Explicit-endpoint launcher initialization. Prepares candidates; never writes, authenticates or starts a process. */
import { computeLauncherFileMd5, parseLauncherDigestResponse, createLauncherMetadataPlan, decodeLauncherUpdatePackage,
  parseWin32LauncherDigestResponse, createWin32LauncherMetadataPlan, decodeWin32LauncherUpdatePackage,
  inspectWin32LauncherCatalogContainers, compareWin32LauncherCatalogPair } from '../shared/index.mjs';
import { LauncherHttpError } from './launcher-http-data.mjs';
import { ownLauncherInputBytes, snapshotLauncherCatalogCandidate, CATALOG_CANDIDATE_BYTES } from './launcher-catalog-data.mjs';

export const LAUNCHER_BOOTSTRAP_LIMITS = Object.freeze({ timeoutMs: 10000, maximumTimeoutMs: 60000, launcherBytes: 32 * 1024 * 1024 });
export class LauncherBootstrapError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherBootstrapError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherBootstrapError(code, message); };
function browserSignal(value) {
  if (value === undefined) return null;
  try {
    const getter = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
    Reflect.apply(getter, value, []);
    return { aborted: () => Reflect.apply(getter, value, []),
      add: listener => value.addEventListener('abort', listener, { once: true }), remove: listener => value.removeEventListener('abort', listener) };
  } catch { fail('BOOTSTRAP_INPUT', 'Expected a platform AbortSignal.'); }
}
const browserPlatform = Object.freeze({ now: () => performance.now(), setTimer: (fn, ms) => setTimeout(fn, ms),
  clearTimer: token => clearTimeout(token), createAbortController: () => new AbortController(), readSignal: browserSignal,
  decodeText: (bytes, encoding) => new TextDecoder(encoding, { fatal: true }).decode(bytes) });
function endpointSnapshot(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('BOOTSTRAP_INPUT', 'Expected explicit endpoints.');
  const result = {};
  for (const key of ['launcherDigest', 'updateLocator', 'catalogDigests', 'gameList', 'regionList']) {
    const property = Object.getOwnPropertyDescriptor(value, key);
    if (!property || !Object.hasOwn(property, 'value') || typeof property.value !== 'string' || !property.value.length || property.value.length > 4096) fail('BOOTSTRAP_INPUT', 'Expected own bounded endpoint strings.');
    result[key] = property.value;
  }
  return Object.freeze(result);
}

function currentInputSnapshot(value) {
  const required = ['launcherBytes', 'gameListBytes', 'regionListBytes', 'endpoints', 'encoding', 'allowBareAmpersands'];
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Reflect.ownKeys(value).some(key => ![...required, 'timeoutMs', 'signal'].includes(key))) {
    fail('BOOTSTRAP_INPUT', 'Expected explicit current-profile initialization data.');
  }
  const result = {};
  for (const key of [...required, 'timeoutMs', 'signal']) {
    const property = Object.getOwnPropertyDescriptor(value, key);
    if (!property) { if (required.includes(key)) fail('BOOTSTRAP_INPUT', 'Missing current-profile input.'); continue; }
    if (!Object.hasOwn(property, 'value')) fail('BOOTSTRAP_INPUT', 'Expected own initialization data fields.');
    result[key] = property.value;
  }
  return Object.freeze(result);
}

function createBootstrap({ httpClient, platform = browserPlatform } = {}, currentProfile = false, cacheTick = () => Math.floor(platform.now()) >>> 0) {
  if (!httpClient || typeof httpClient.getBytes !== 'function') fail('BOOTSTRAP_INPUT', 'Supply an explicit HTTP client.');
  if (currentProfile && typeof cacheTick !== 'function') fail('BOOTSTRAP_INPUT', 'Supply a cache tick function.');
  const ports = {};
  for (const name of ['now','setTimer','clearTimer','createAbortController','readSignal','decodeText']) {
    const value = platform && Object.getOwnPropertyDescriptor(platform, name);
    if (!value || !Object.hasOwn(value, 'value') || typeof value.value !== 'function') fail('BOOTSTRAP_INPUT', 'Supply complete platform ports.');
    ports[name] = value.value;
  }
  let lastNow = -Infinity;
  function now() {
    const value = ports.now();
    if (!Number.isFinite(value) || value < 0 || value < lastNow) fail('BOOTSTRAP_INPUT', 'Expected a monotonic platform clock.');
    lastNow = value; return value;
  }
  function readSignal(value) {
    try {
      const result = ports.readSignal(value);
      if (value === undefined && result === null) return null;
      if (!result || ['aborted','add','remove'].some(name => typeof result[name] !== 'function') || typeof result.aborted() !== 'boolean') throw new TypeError();
      return result;
    } catch { fail('BOOTSTRAP_INPUT', 'Expected a platform cancellation signal.'); }
  }
  const fetchBytes = httpClient.getBytes.bind(httpClient);
  return Object.freeze({
    async prepare(input) {
      if (currentProfile) input = currentInputSnapshot(input);
      if (!input || typeof input !== 'object' || Array.isArray(input)) fail('BOOTSTRAP_INPUT', 'Expected explicit initialization inputs.');
      const timeoutMs = input.timeoutMs ?? LAUNCHER_BOOTSTRAP_LIMITS.timeoutMs, signal = readSignal(input.signal);
      if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > LAUNCHER_BOOTSTRAP_LIMITS.maximumTimeoutMs) fail('BOOTSTRAP_INPUT', 'Expected a bounded total deadline.');
      if (signal?.aborted()) fail('BOOTSTRAP_ABORTED', 'Initialization was cancelled.');
      const deadline = now() + timeoutMs, control = ports.createAbortController();
      if (!control || typeof control.abort !== 'function' || !control.signal || !readSignal(control.signal)) fail('BOOTSTRAP_INPUT', 'Invalid cancellation port.');
      let stopError, rejectStop;
      const stopped = new Promise((resolve, reject) => { rejectStop = reject; }); stopped.catch(() => {});
      const stop = code => {
        if (stopError) return;
        stopError = new LauncherBootstrapError(code, code === 'BOOTSTRAP_TIMEOUT' ? 'Initialization deadline expired.' : 'Initialization was cancelled.');
        try { control.abort(); } catch { /* Cancellation still rejects and cleans up its own deadline. */ }
        rejectStop(stopError);
      };
      const check = () => { if (now() >= deadline) stop('BOOTSTRAP_TIMEOUT'); if (stopError) throw stopError; };
      const abort = () => stop(now() >= deadline ? 'BOOTSTRAP_TIMEOUT' : 'BOOTSTRAP_ABORTED');
      const timer = ports.setTimer(() => stop('BOOTSTRAP_TIMEOUT'), timeoutMs);
      try {
        signal?.add(abort); if (signal?.aborted()) abort(); check();
        const endpoints = endpointSnapshot(input.endpoints), encoding = input.encoding, allowBareAmpersands = input.allowBareAmpersands;
        if (!['utf-8', 'gb18030'].includes(encoding) || typeof allowBareAmpersands !== 'boolean') fail('BOOTSTRAP_INPUT', 'Choose explicit catalog decoding options.');
        // All already-loaded local inputs are snapshotted before the first asynchronous request.
        const launcherBytes = ownLauncherInputBytes(input.launcherBytes, LAUNCHER_BOOTSTRAP_LIMITS.launcherBytes, { allowEmpty: true });
        let gameListBytes = currentProfile && input.gameListBytes === null ? null : ownLauncherInputBytes(input.gameListBytes, CATALOG_CANDIDATE_BYTES, { allowEmpty: true });
        let regionListBytes = currentProfile && input.regionListBytes === null ? null : ownLauncherInputBytes(input.regionListBytes, CATALOG_CANDIDATE_BYTES, { allowEmpty: true });
        const localMd5 = computeLauncherFileMd5(launcherBytes); check();
        const get = async (url, kind) => {
          check();
          if (currentProfile && kind !== 'package') {
            const tick = cacheTick();
            if (!Number.isInteger(tick) || tick < 0 || tick > 0xffffffff) fail('BOOTSTRAP_INPUT', 'Expected an unsigned 32-bit cache tick.');
            url += (url.includes('?') ? '&' : '?') + 'rtm=' + tick;
            check();
          }
          const request = Promise.resolve().then(() => { check(); return fetchBytes(url, { kind, signal: control.signal, timeoutMs: Math.max(1, Math.ceil(deadline - now())) }); });
          const result = await Promise.race([request, stopped]); check();
          const maximum = kind === 'metadata' ? 4096 : kind === 'catalog' ? CATALOG_CANDIDATE_BYTES : LAUNCHER_BOOTSTRAP_LIMITS.launcherBytes;
          return ownLauncherInputBytes(result.bytes, maximum, { allowEmpty: true });
        };
        const launcherDigestResponseBytes = await get(endpoints.launcherDigest, 'metadata');
        const remote = currentProfile ? parseWin32LauncherDigestResponse(launcherDigestResponseBytes) : parseLauncherDigestResponse(launcherDigestResponseBytes);
        if (localMd5 !== (currentProfile ? remote.comparisonText : remote.md5)) {
          const locatorResponseBytes = await get(endpoints.updateLocator, 'metadata');
          const plan = (currentProfile ? createWin32LauncherMetadataPlan : createLauncherMetadataPlan)({ launcherBytes, launcherDigestResponseBytes, locatorResponseBytes }); check();
          if (currentProfile && plan.update.archiveBytes > LAUNCHER_BOOTSTRAP_LIMITS.launcherBytes) fail('BOOTSTRAP_PACKAGE_BUDGET', 'Declared package exceeds the independent download budget.');
          // Only the explicit HTTP client's supported complete-URL subset is downloadable; no inferred URL prefix or origin grant.
          const packageBytes = await get(plan.update.locator, 'package');
          const update = currentProfile ? decodeWin32LauncherUpdatePackage(packageBytes, { expectedMd5: plan.update.expectedMd5, expectedArchiveBytes: plan.update.archiveBytes })
            : decodeLauncherUpdatePackage(packageBytes, { expectedMd5: plan.update.expectedMd5 }); check();
          return Object.freeze({ disposition: 'launcher-update-candidate', plan, update, catalogs: null, trust: 'unverified', authentication: 'unverified', execution: 'not-performed',
            ...(currentProfile ? { profile: 'win32-current-metadata-v1' } : {}) });
        }
        const catalogDigestResponseBytes = await get(endpoints.catalogDigests, 'metadata');
        if (currentProfile) {
          const initialPlan = createWin32LauncherMetadataPlan({ launcherBytes, launcherDigestResponseBytes }); check();
          const currentGameListBytes = gameListBytes, currentRegionListBytes = regionListBytes;
          gameListBytes = await get(endpoints.gameList, 'catalog');
          regionListBytes = await get(endpoints.regionList, 'catalog');
          const containers = inspectWin32LauncherCatalogContainers(ports.decodeText(gameListBytes, encoding), ports.decodeText(regionListBytes, encoding), { allowBareAmpersands });
          const catalogs = snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes, encoding, allowBareAmpersands,
            gameListMd5: computeLauncherFileMd5(gameListBytes), regionListMd5: computeLauncherFileMd5(regionListBytes) }, { decodeText: ports.decodeText }); check();
          const comparison = compareWin32LauncherCatalogPair({ currentGameListBytes, currentRegionListBytes, gameListBytes, regionListBytes }); check();
          return Object.freeze({ disposition: 'catalogs-prepared', profile: 'win32-current-metadata-v1', initialPlan, catalogs, comparison, containers,
            catalogDigestMetadata: Object.freeze({ bytes: catalogDigestResponseBytes.length, use: 'request-success-only' }),
            update: null, trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
        }
        const initialPlan = createLauncherMetadataPlan({ launcherBytes, launcherDigestResponseBytes, gameListBytes, regionListBytes, catalogDigestResponseBytes }); check();
        for (const key of initialPlan.catalogs.refreshOrder) {
          const bytes = await get(endpoints[key], 'catalog');
          if (key === 'gameList') gameListBytes = bytes; else regionListBytes = bytes;
          const expected = initialPlan.catalogs[key].remoteMd5;
          if (computeLauncherFileMd5(bytes) !== expected) fail('BOOTSTRAP_DIGEST', 'Downloaded catalog digest does not match.');
        }
        const catalogs = snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes, encoding, allowBareAmpersands,
          gameListMd5: initialPlan.catalogs.gameList.remoteMd5, regionListMd5: initialPlan.catalogs.regionList.remoteMd5 }, { decodeText: ports.decodeText }); check();
        return Object.freeze({ disposition: 'catalogs-prepared', initialPlan, catalogs, update: null, trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
      } catch (error) {
        if (now() >= deadline) stop('BOOTSTRAP_TIMEOUT');
        if (stopError) throw stopError;
        if (error instanceof LauncherBootstrapError || error instanceof LauncherHttpError) throw error;
        throw new LauncherBootstrapError('BOOTSTRAP_DATA', 'Initialization metadata, candidate or provider failed validation.');
      } finally { try { ports.clearTimer(timer); } finally { signal?.remove(abort); } }
    },
  });
}

export function createLauncherBootstrap(options) { return createBootstrap(options, false); }
/** Explicit current-source factory. It never replaces the legacy page/default initialization profile. */
export function createWin32LauncherBootstrap({ httpClient, cacheTick, platform } = {}) { return createBootstrap({ httpClient, platform }, true, cacheTick); }

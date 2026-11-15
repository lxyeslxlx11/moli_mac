/** Browser-only non-secret mode preference. Storage access is deferred to explicit operations. */
import { LAUNCHER_PREFERENCE_FORMAT, encodeLauncherUserModePreference,
  decodeLauncherUserModePreference } from '../shared/launcher-preferences.mjs';

const result = (state, userMode = null, writeAttempted = false) => Object.freeze({ state, userMode, writeAttempted });

export function createLauncherPreferenceStore({ storageProvider = () => globalThis.localStorage } = {}) {
  if (typeof storageProvider !== 'function') throw new TypeError('Expected a storage provider.');
  function storage() {
    const owner = storageProvider();
    const get = owner?.getItem, set = owner?.setItem;
    if (typeof get !== 'function' || typeof set !== 'function') throw new Error();
    return { owner, get, set };
  }
  return Object.freeze({
    readMode() {
      let record;
      try {
        const { owner, get } = storage();
        record = Reflect.apply(get, owner, [LAUNCHER_PREFERENCE_FORMAT.storageKey]);
      } catch { return result('unavailable'); }
      if (record === null) return result('missing');
      try { return result('loaded', decodeLauncherUserModePreference(record).userMode); }
      catch { return result('invalid'); }
    },
    saveMode(userMode) {
      // Validate before touching a provider; no account/string/object is an accepted write input.
      const record = encodeLauncherUserModePreference(userMode);
      let port;
      try { port = storage(); } catch { return result('unavailable'); }
      try { Reflect.apply(port.set, port.owner, [LAUNCHER_PREFERENCE_FORMAT.storageKey, record]); }
      catch { return result('unconfirmed', userMode, true); }
      try {
        if (Reflect.apply(port.get, port.owner, [LAUNCHER_PREFERENCE_FORMAT.storageKey]) === record) {
          return result('saved', userMode, true);
        }
      } catch { /* A completed write and failed readback cannot be claimed as durable or absent. */ }
      return result('unconfirmed', userMode, true);
    },
  });
}

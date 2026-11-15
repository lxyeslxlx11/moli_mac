/** Independent non-secret UserMode record. No account inputs, I/O, consent or authentication. */
export const LAUNCHER_PREFERENCE_FORMAT = Object.freeze({
  schema: 'moli.launcher.preferences.v1', storageKey: 'moli.launcher.preferences.v1', maxChars: 128,
});
export class LauncherPreferenceError extends Error {
  constructor(code = 'PREFERENCE_RECORD') {
    const input = code === 'PREFERENCE_MODE';
    super(input ? 'Expected an explicit mode1 or mode2.' : 'Unsupported launcher preference record.');
    this.name = 'LauncherPreferenceError';
    this.code = input ? 'PREFERENCE_MODE' : 'PREFERENCE_RECORD';
  }
}
const mode = value => {
  if (value !== 1 && value !== 2) throw new LauncherPreferenceError('PREFERENCE_MODE');
  return value;
};

/** Canonical, versioned, fixed-key representation; accepts only the non-secret numeric setting. */
export function encodeLauncherUserModePreference(userMode) {
  return `{"schema":"${LAUNCHER_PREFERENCE_FORMAT.schema}","userMode":${mode(userMode)}}`;
}

/** Strict own-format reader. Noncanonical, unknown-version or additional data is never interpreted. */
export function decodeLauncherUserModePreference(record) {
  try {
    if (typeof record !== 'string' || record.length > LAUNCHER_PREFERENCE_FORMAT.maxChars) throw new Error();
    const value = JSON.parse(record);
    if (!value || typeof value !== 'object' || Array.isArray(value)
        || Object.keys(value).length !== 2 || value.schema !== LAUNCHER_PREFERENCE_FORMAT.schema
        || !Object.hasOwn(value, 'schema') || !Object.hasOwn(value, 'userMode')
        || record !== encodeLauncherUserModePreference(value.userMode)) throw new Error();
    return Object.freeze({ schema: LAUNCHER_PREFERENCE_FORMAT.schema, userMode: value.userMode });
  } catch { throw new LauncherPreferenceError(); }
}

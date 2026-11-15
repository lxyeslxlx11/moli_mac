/** Fixed-launcher local review and in-session input rules. No storage, consent action, account access or I/O. */
import { LauncherMessageError } from './launcher-message10.mjs';
import { md5Hex } from './md5.mjs';

export const LAUNCHER_LOCAL_LIMITS = Object.freeze({ inputBytes: 16, licenseVersion: 5, licensePages: 4, gameSlots: 15, settingsSectionChars: 256 });
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
const options = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_INPUT', 'Expected explicit local launcher inputs.');
  return value;
};
const typedArrayLength = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), 'length').get;
const arrayBufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function inputBytes(value, name, allowEmpty = false) {
  if (value instanceof ArrayBuffer) {
    try { Reflect.apply(arrayBufferLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual ArrayBuffer.'); }
    value = new Uint8Array(value);
  }
  if (!(value instanceof Uint8Array)) fail('INVALID_INPUT', 'Expected explicit encoded input bytes.');
  let length;
  try { length = Reflect.apply(typedArrayLength, value, []); } catch { fail('INVALID_INPUT', 'Expected an actual Uint8Array.'); }
  if (!Number.isInteger(length)) fail('INVALID_INPUT', 'Expected an actual Uint8Array.');
  if (length < (allowEmpty ? 0 : 1) || length > LAUNCHER_LOCAL_LIMITS.inputBytes) {
    fail('LOCAL_INPUT_LENGTH', `${name} exceeds the supported UI byte range.`);
  }
  // TypedArray construction uses internal slots, ignoring subclass metadata/iterator overrides.
  value = new Uint8Array(value);
  for (const byte of value) if (byte === 0) fail('LOGIN_NUL', 'UI byte fields cannot contain an embedded NUL.');
  return value;
}
function flag(value) {
  if (typeof value !== 'boolean') fail('LOCAL_FLAG', 'Expected an explicit boolean flag.');
  return value;
}
const pages = Object.freeze(Array.from({ length: 15 }, (_, index) => Object.freeze(
  [0, 1, 3].includes(index) ? [283, 329, 331, 332] : index === 2 ? [293, 294, 331, 332]
    : index === 4 ? [319, 330, 331, 332] : index === 10 ? [335, 329, 331, 332] : [0, 0, 0, 0])));

function usernameDigest(value) {
  try { return md5Hex(value); } finally { value.fill(0); }
}

/** Returns a compatibility lookup identity. The digest is not authentication or a secrecy guarantee. */
export function createLauncherLicenseIdentity(value) {
  const { gameCodeText, usernameBytes } = options(value);
  if (typeof gameCodeText !== 'string' || !/^[0-9]{1,8}$/.test(gameCodeText) || Number(gameCodeText) < 1 || Number(gameCodeText) > 15) {
    fail('LOCAL_GAME_CODE', 'Expected a preserved decimal game code in the observed1..15 resource slots.');
  }
  const key = usernameDigest(inputBytes(usernameBytes, 'Username'));
  return Object.freeze({ section: `Game${gameCodeText}_License`, key, version: 5,
    resourceIds: pages[Number(gameCodeText) - 1], authentication: 'unverified' });
}

/** Requires explicit page availability and a final decision; emits a write intent without performing storage. */
export function createLauncherLicenseReview(value) {
  const { gameCodeText, usernameBytes, recordedVersion, forcePrompt, pageAvailability } = options(value);
  if (!Number.isInteger(recordedVersion) || recordedVersion < 0 || recordedVersion > 0xffffffff) fail('LOCAL_VERSION', 'Expected an explicit unsigned32-bit snapshot version.');
  flag(forcePrompt);
  if (!Array.isArray(pageAvailability) || pageAvailability.length !== 4) fail('LICENSE_AVAILABILITY', 'Expected four explicit page availability flags.');
  const availability = [];
  for (let index = 0; index < 4; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(pageAvailability, index)) fail('LICENSE_AVAILABILITY', 'Every page needs its own explicit availability flag.');
    availability.push(flag(pageAvailability[index]));
  }
  const identity = createLauncherLicenseIdentity({ gameCodeText, usernameBytes });
  const configured = identity.resourceIds[0] !== 0 && identity.resourceIds[1] !== 0;
  let state = !forcePrompt && recordedVersion === 5 ? 'recorded' : !configured ? 'not-configured'
    : !availability.every(Boolean) ? 'unavailable' : 'reviewing';
  let pageOrdinal = state === 'reviewing' ? 0 : null;
  function snapshot() {
    return Object.freeze({ state, pageOrdinal, resourceId: pageOrdinal === null ? null : identity.resourceIds[pageOrdinal],
      canConfirm: state === 'reviewing' && pageOrdinal === 3, authentication: 'unverified', persistence: 'unconfirmed' });
  }
  const step = (writeRequested = null, ignored = false) => Object.freeze({ snapshot: snapshot(), writeRequested, ignored });
  return Object.freeze({
    snapshot,
    advance() {
      if (state !== 'reviewing') fail('LICENSE_STATE', 'No license review is active.');
      if (pageOrdinal >= 3) fail('LICENSE_PAGE', 'The final page requires an explicit decision.');
      pageOrdinal += 1; return step();
    },
    decide(accepted) {
      flag(accepted);
      if (state !== 'reviewing') fail('LICENSE_STATE', 'No license review is active.');
      if (accepted && pageOrdinal !== 3) fail('LICENSE_PAGES_REMAIN', 'All four pages must precede the explicit final decision.');
      state = accepted ? 'accepted' : 'declined'; pageOrdinal = null;
      return step(accepted ? Object.freeze({ section: identity.section, key: identity.key, value: 5 }) : null);
    },
    cancel() {
      if (state !== 'reviewing') return step(null, true);
      state = 'cancelled'; pageOrdinal = null; return step();
    },
  });
}

/** Implements re-entry clearing from the two explicit checkbox snapshots; never persists either field. */
export function resetLauncherLoginInputs(value) {
  const { usernameBytes, passwordBytes, rememberUsername, rememberPassword } = options(value);
  flag(rememberUsername); flag(rememberPassword);
  const username = inputBytes(usernameBytes, 'Username', true), password = inputBytes(passwordBytes, 'Password', true);
  if (!rememberUsername) username.fill(0);
  if (!rememberPassword) password.fill(0);
  return Object.freeze({ usernameBytes: rememberUsername ? username : new Uint8Array(0),
    passwordBytes: rememberPassword ? password : new Uint8Array(0), authentication: 'unverified', persisted: false });
}

function modeInputs(value) {
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
  } catch { fail('INVALID_INPUT', 'Expected explicit mode input properties.'); }
  return (name, optional = false) => {
    let descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(value, name); }
    catch { fail('INVALID_INPUT', 'Expected readable own mode input properties.'); }
    if (!descriptor && optional) return undefined;
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
      fail('INVALID_INPUT', 'Mode inputs must be own data properties.');
    }
    return descriptor.value;
  };
}
function settingsSection(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > LAUNCHER_LOCAL_LIMITS.settingsSectionChars
      || /[\x00-\x1f\x7f\[\]]/.test(value)) {
    fail('LOCAL_SETTINGS_SECTION', 'Expected an explicit bounded settings section.');
  }
  return value;
}
function selectedMode(value) {
  if (value !== 1 && value !== 2) fail('LOCAL_MODE_CHOICE', 'Select an explicit mode1 or mode2.');
  return value;
}
function retention(mode, initialRememberUsername = false) {
  return Object.freeze({ rememberUsername: mode === 1 || initialRememberUsername,
    rememberPassword: false, passwordControlVisible: mode === 1 });
}
function modePlan(state, mode, flags = null, clearInputs = false, writeRequested = null) {
  return Object.freeze({ state, mode, retention: flags, clearInputs, writeRequested,
    authentication: 'unverified', persistence: 'unconfirmed' });
}
const modeWrite = (section, mode) => Object.freeze({ section, key: 'UserMode', value: mode });

/** Pure initialization effects. Explicit cancel differs from the native non1-modal-result fallback. */
export function planLauncherUserModeInitialization(value) {
  const read = modeInputs(value), recordedMode = read('recordedMode');
  if (!Number.isInteger(recordedMode) || recordedMode < -1 || recordedMode > 0xffffffff) {
    fail('LOCAL_MODE_VALUE', 'Expected an unsigned32 recorded mode or the explicit missing sentinel.');
  }
  const initialRememberUsername = flag(read('initialRememberUsername'));
  const section = settingsSection(read('settingsSection'));
  if (recordedMode === 1 || recordedMode === 2) {
    return modePlan('initialized', recordedMode, retention(recordedMode, initialRememberUsername));
  }
  const choice = read('choice', true);
  if (choice === undefined || choice === null) return modePlan('choice-required', null);
  if (choice === 'cancel') return modePlan('cancelled', null);
  const mode = selectedMode(choice);
  return modePlan('initialized', mode, retention(mode, initialRememberUsername), false, modeWrite(section, mode));
}

/** Emits only a non-secret mode/checkbox/reset/write plan; does not touch input buffers or storage. */
export function planLauncherUserModeChange(value) {
  const read = modeInputs(value), current = selectedMode(read('currentMode'));
  const requested = read('requestedMode'), section = settingsSection(read('settingsSection'));
  if (requested === 'cancel') return modePlan('cancelled', current);
  const mode = selectedMode(requested);
  if (current === 2 && mode === 1) {
    const confirmed = read('confirmMode1', true);
    if (confirmed === undefined || confirmed === null) return modePlan('confirmation-required', current);
    if (!flag(confirmed)) return modePlan('declined', current);
  }
  return modePlan('changed', mode, retention(mode), true, modeWrite(section, mode));
}

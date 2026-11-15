/** Observed launcher UI byte limits and reply11 choice projection. No account access, transport or authentication decision. */
import { LauncherMessageError, encodeLauncherRequest10, encodeLauncherRequest10Frame } from './launcher-message10.mjs';
import { LAUNCHER_REPLY_LIMITS, decodeLauncherReply } from './launcher-replies.mjs';

export const LAUNCHER_LOGIN_LIMITS = Object.freeze({ usernameBytes: 16, passwordBytes: 16, gameCodeMax: 14 });
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected explicit encoded bytes; the Windows code page is not inferred.');
}
function copy(input) { return new Uint8Array(new Uint8Array(input.buffer, input.byteOffset, input.byteLength)); }
function word(input) {
  if (!Number.isInteger(input) || input < 0 || input > 0xffffffff) fail('INVALID_WORD', 'Expected an unsigned32-bit word.');
  return input;
}
const signed = value => value > 0x7fffffff ? value - 0x100000000 : value;
function loginFields(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) fail('INVALID_INPUT', 'Expected explicit launcher login fields.');
  const username = bytes(fields.usernameBytes), password = bytes(fields.passwordBytes);
  if (username.byteLength < 1 || username.byteLength > LAUNCHER_LOGIN_LIMITS.usernameBytes) {
    fail('LOGIN_USERNAME_LENGTH', 'Encoded username must contain1..16 bytes.');
  }
  if (password.byteLength < 1 || password.byteLength > LAUNCHER_LOGIN_LIMITS.passwordBytes) {
    fail('LOGIN_PASSWORD_LENGTH', 'Encoded password must contain1..16 bytes.');
  }
  for (const value of [username, password]) {
    for (let at = 0; at < value.byteLength; at += 1) if (value[at] === 0) fail('LOGIN_NUL', 'UI byte fields cannot contain an embedded NUL.');
  }
  const counter = word(fields.requestCounter), gameCode = word(fields.gameCode);
  if (gameCode > LAUNCHER_LOGIN_LIMITS.gameCodeMax) fail('LOGIN_GAME_CODE', 'Gamecode is outside the supported launcher slot range.');
  return { wordA: counter, fieldA: username, fieldB: password, wordB: gameCode };
}

/** UI-bound subset of request10. Bytes are already encoded by the caller; no case/space/hash transformation is introduced. */
export function encodeLauncherLoginRequest(fields) { return encodeLauncherRequest10(loginFields(fields)); }
export function encodeLauncherLoginRequestFrame(fields) { return encodeLauncherRequest10Frame(loginFields(fields)); }

function normalizeReply(value) {
  if (!value || typeof value !== 'object' || value.type !== 11) fail('PROFILE_REPLY_TYPE', 'Expected a decoded type11 launcher reply.');
  const wordA = word(value.wordA), wordB = word(value.wordB), tailWordA = word(value.tailWordA), tailWordB = word(value.tailWordB);
  const byteField = bytes(value.byteField);
  if (byteField.byteLength > LAUNCHER_REPLY_LIMITS.byteFieldBytes) fail('PROFILE_BUDGET', 'Byte field exceeds the supported reply layout.');
  if (!Array.isArray(value.byteList) || value.byteList.length > LAUNCHER_REPLY_LIMITS.byteListEntries ||
      !Array.isArray(value.wordLists) || value.wordLists.length !== LAUNCHER_REPLY_LIMITS.wordLists) {
    fail('PROFILE_LAYOUT', 'Reply list containers do not match the supported layout.');
  }
  const byteList = [];
  for (const item of value.byteList) {
    const entry = bytes(item);
    if (entry.byteLength > LAUNCHER_REPLY_LIMITS.byteListEntryBytes) fail('PROFILE_BUDGET', 'List entry exceeds the supported reply layout.');
    byteList.push(copy(entry));
  }
  const wordLists = [];
  for (const item of value.wordLists) {
    if (!(item instanceof Uint32Array) || item.length > LAUNCHER_REPLY_LIMITS.wordListEntries) fail('PROFILE_LAYOUT', 'Expected bounded UInt32 word columns.');
    wordLists.push(new Uint32Array(new Uint32Array(item.buffer, item.byteOffset, item.length)));
  }
  return Object.freeze({ type: 11, wordA, wordB, signedWordB: signed(wordB), byteField: copy(byteField),
    byteList: Object.freeze(byteList), wordLists: Object.freeze(wordLists), tailWordA, tailWordB });
}
function compareBytes(first, second) {
  for (let at = 0; at < Math.min(first.length, second.length); at += 1) {
    if (first[at] !== second[at]) return first[at] - second[at];
  }
  return first.length - second.length;
}
function choices(reply) {
  const rows = [];
  let disposition = 'nonzero-result';
  if (reply.wordB === 0) {
    disposition = reply.byteList.length ? 'profiles' : 'no-profiles';
    // Require row coverage before projecting the four UI columns; W0 remains opaque.
    for (let column = 1; column < 5; column += 1) {
      if (reply.wordLists[column].length < reply.byteList.length) fail('PROFILE_COLUMNS', 'Word columns must cover every displayed row.');
    }
    for (let sourceOrdinal = 0; sourceOrdinal < reply.byteList.length; sourceOrdinal += 1) {
      const name = reply.byteList[sourceOrdinal];
      if (!name.length) fail('PROFILE_NAME', 'Empty choice labels are outside the supported UI subset.');
      for (let at = 0; at < name.length; at += 1) if (name[at] === 0) fail('PROFILE_NAME', 'Choice labels cannot contain an embedded NUL.');
      const stateWord = reply.wordLists[1][sourceOrdinal], state = stateWord << 16 >> 16;
      // Preserve the raw word; the native consumer stores and gates on its signed low16 bits.
      const billingWord = reply.wordLists[2][sourceOrdinal], expiryWord = reply.wordLists[3][sourceOrdinal];
      const expiredWord = reply.wordLists[4][sourceOrdinal];
      const blockedReason = state !== 0 && state !== -4 ? 'state' : billingWord !== 0 && expiredWord !== 0 ? 'billing-expired' : null;
      rows.push({ sourceOrdinal, nameBytes: copy(name), stateWord, state, billingWord, expiryWord, expiredWord,
        selectionGate: Object.freeze({ passes: blockedReason === null, blockedReason }) });
    }
    // Reproduce the observed pairwise swaps, including tie order. A stable Array.sort differs when duplicate labels move.
    for (let current = 0; current < rows.length; current += 1) {
      for (let prior = 0; prior < current; prior += 1) {
        if (compareBytes(rows[current].nameBytes, rows[prior].nameBytes) < 0) [rows[current], rows[prior]] = [rows[prior], rows[current]];
      }
    }
  }
  return Object.freeze({ disposition, resultWord: reply.wordB, resultSigned: reply.signedWordB,
    rows: Object.freeze(rows.map((row, displayOrdinal) => Object.freeze({ ...row, displayOrdinal }))),
    remainingPointsWord: disposition === 'profiles' ? reply.tailWordB : null,
    remainingPointsSigned: disposition === 'profiles' ? signed(reply.tailWordB) : null,
    reply, authentication: 'unverified' });
}

/** Consumes the existing reply decoder/stream result. Names remain opaque bytes; no registration, URL or launch action. */
export function createLauncherProfileChoices(decodedReply) { return choices(normalizeReply(decodedReply)); }
export function decodeLauncherProfileChoices(bodyInput) { return createLauncherProfileChoices(decodeLauncherReply(bodyInput)); }

/** Select by displayed ordinal after sorting. Passing the observed gate does not prove authentication or game readiness. */
export function selectLauncherProfile(decodedReply, displayOrdinal) {
  const model = createLauncherProfileChoices(decodedReply);
  if (model.disposition !== 'profiles') fail('PROFILE_RESULT', 'Reply does not provide a profile choice list.');
  if (!Number.isInteger(displayOrdinal) || displayOrdinal < 0 || displayOrdinal >= model.rows.length) fail('PROFILE_ORDINAL', 'Expected a valid displayed row ordinal.');
  const row = model.rows[displayOrdinal];
  if (!row.selectionGate.passes) fail('PROFILE_RESTRICTED', 'Observed profile selection checks reject this row.');
  return Object.freeze({ profile: row, opaqueByteField: copy(model.reply.byteField),
    tailWordA: model.reply.tailWordA, tailWordB: model.reply.tailWordB, authentication: 'unverified' });
}

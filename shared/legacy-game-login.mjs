/** Fixed 37c4 post-connect login consumers. No socket, clock, digest fabrication or current-launcher binding. */
export const LEGACY_GAME_LOGIN_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-login-v1', command: 'send-004f83d0', reply: 'receive-00567c4c',
  timeoutMilliseconds: 20001, nextNativeMainPhase: 3, officialAuthentication: 'unverified',
});
export class LegacyGameLoginError extends Error {
  constructor(code) { super('Legacy game login requires bounded source fields.'); this.name = 'LegacyGameLoginError'; this.code = code; }
}
const fail = code => { throw new LegacyGameLoginError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const getLength = Object.getOwnPropertyDescriptor(typed, 'length').get;
const getBuffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const byteLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const zero = bytes => Uint8Array.prototype.fill.call(bytes, 0);
function owned(value, maximum, minimum = 0) {
  try {
    if (!(value instanceof Uint8Array)) fail('LEGACY_LOGIN_BYTES');
    const size = Reflect.apply(getLength, value, []);
    Reflect.apply(byteLength, Reflect.apply(getBuffer, value, []), []);
    if (size < minimum || size > maximum) fail('LEGACY_LOGIN_BYTES');
    return new Uint8Array(value);
  } catch { fail('LEGACY_LOGIN_BYTES'); }
}
function properties(value, names) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('LEGACY_LOGIN_INPUT');
  let descriptors;
  try { descriptors = Object.getOwnPropertyDescriptors(value); } catch { fail('LEGACY_LOGIN_INPUT'); }
  if (Reflect.ownKeys(descriptors).length !== names.length) fail('LEGACY_LOGIN_INPUT');
  const result = {};
  for (const name of names) {
    const entry = descriptors[name];
    if (!entry || !Object.hasOwn(entry, 'value')) fail('LEGACY_LOGIN_INPUT');
    result[name] = entry.value;
  }
  return result;
}
const whitespace = byte => byte === 32 || byte >= 9 && byte <= 13;
function scan(bytes, end, marker) {
  let at = -1;
  for (let i = 0; i + marker.length <= end; i++) {
    if (marker.every((byte, k) => bytes[i + k] === byte)) { at = i + marker.length; break; }
  }
  if (at < 0) fail('LEGACY_LOGIN_HANDOFF_FIELD');
  while (at < end && whitespace(bytes[at])) at++;
  let stop = at;
  while (stop < end && !whitespace(bytes[stop])) stop++;
  if (stop === at || stop - at > 50) fail('LEGACY_LOGIN_HANDOFF_FIELD');
  return bytes.slice(at, stop);
}
export function readLegacyGameHandoff(value) {
  const bytes = owned(value, 256, 1); let gid, glt;
  try {
    const end = bytes.indexOf(0);
    if (end < 0) fail('LEGACY_LOGIN_HANDOFF_TERMINATOR');
    gid = scan(bytes, end, [103, 105, 100, 58]);
    glt = scan(bytes, end, [103, 108, 116, 58]);
    return Object.freeze({ profile: LEGACY_GAME_LOGIN_PROFILE.id, gidBytes: gid, gltBytes: glt });
  } catch (error) { if (gid) zero(gid); if (glt) zero(glt); throw error; }
  finally { zero(bytes); }
}
function uint32(value) {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('LEGACY_LOGIN_TICK');
  return value;
}
export function createLegacyGameLogin(value) {
  const input = properties(value, ['mappingBytes', 'moduleDigestBytes']);
  let fields, digest;
  try {
    fields = readLegacyGameHandoff(input.mappingBytes);
    digest = owned(input.moduleDigestBytes, 32);
    if ((digest.length !== 0 && digest.length !== 32) || digest.some(b => !(b >= 48 && b <= 57 || b >= 97 && b <= 102))) fail('LEGACY_LOGIN_DIGEST');
  } catch (error) { fields?.gidBytes.fill(0); fields?.gltBytes.fill(0); digest?.fill(0); throw error; }
  let state = 'idle', stage = 0, origin = null, ack = 0, good = false, statusWord = null;
  let reply = null, prefixBytes = 0, auxiliary = false, errorCode = null, result = 0, polls = 0;
  const active = () => { if (state === 'closed') fail('LEGACY_LOGIN_CLOSED'); };
  const clearFields = () => { zero(digest); zero(fields.gltBytes); zero(fields.gidBytes); };
  const clearReply = () => { if (reply) zero(reply); reply = null; prefixBytes = 0; auxiliary = false; };
  const stop = (code, nativeResult) => { state = 'failed'; errorCode = code; result = nativeResult; clearFields(); clearReply(); };
  function inspect() {
    return Object.freeze({ profile: LEGACY_GAME_LOGIN_PROFILE.id, state, nativeStage: stage, nativeAckState: ack,
      nativeResult: result, polls, statusWord, replyBytes: reply?.length ?? 0, replyPrefixBytes: prefixBytes,
      nativeOuterResult: state === 'accepted' ? 1 : state === 'failed' ? -2 : 0,
      auxiliaryReplyUnmodeled: auxiliary, sourceLoginComplete: state === 'accepted', nextNativeMainPhase: state === 'accepted' ? 3 : null,
      errorCode, ownedCredentialBytes: digest.length + fields.gltBytes.length + fields.gidBytes.length,
      credentialsCleared: digest.every(b => b === 0) && fields.gltBytes.every(b => b === 0) && fields.gidBytes.every(b => b === 0),
      officialAuthentication: 'unverified', currentVersionCompatibility: 'unverified' });
  }
  return Object.freeze({
    inspect,
    start(tick) {
      active(); if (state !== 'idle') fail('LEGACY_LOGIN_ALREADY_STARTED');
      origin = uint32(tick); state = 'awaiting-connection'; return inspect();
    },
    connected() {
      active(); if (state !== 'awaiting-connection') return false;
      stage = 71; state = 'awaiting-bootstrap'; return true;
    },
    bootstrap() {
      active(); if (state !== 'awaiting-bootstrap') return null;
      const args = Object.freeze([digest.slice(), fields.gltBytes.slice(), fields.gidBytes.slice()]);
      clearFields(); stage = 73; ack = 1; good = false; state = 'awaiting-reply';
      return Object.freeze({ operationId: LEGACY_GAME_LOGIN_PROFILE.command, arguments: args });
    },
    observeReply(status, detail) {
      active(); if (ack !== 1 || state !== 'awaiting-reply') return false;
      if (!Number.isInteger(status) || status < -0x80000000 || status > 0x7fffffff) fail('LEGACY_LOGIN_REPLY');
      const bytes = owned(detail, 32767);
      try {
        const nul = bytes.indexOf(0), end = nul < 0 ? bytes.length : nul;
        let prefix = bytes.subarray(0, end).indexOf(124); if (prefix < 0) prefix = end;
        if (status === 0 && prefix > 127) fail('LEGACY_LOGIN_REPLY_PREFIX');
        statusWord = status & 65535;
        if (status !== 0 && end === 4 && bytes[0] === 98 && bytes[1] === 117 && bytes[2] === 115 && bytes[3] === 121) statusWord = 1234;
        good = status === 0; ack = 2; reply = bytes.slice(0, end); prefixBytes = good ? prefix : 0;
        auxiliary = good && prefix < end; return true;
      } finally { zero(bytes); }
    },
    poll(tick) {
      active(); const now = uint32(tick);
      if (state === 'idle') fail('LEGACY_LOGIN_NOT_STARTED');
      if (state === 'failed' || state === 'accepted') return inspect();
      polls++;
      // 4ee730 returns1 at99 before455500 checks its outer20s deadline.
      if (stage === 99) { ack = 0; state = 'accepted'; result = 1; return inspect(); }
      if (stage >= 73 && stage <= 80) {
        if (ack === 2) {
          if (!good) { ack = 0; stop('LEGACY_LOGIN_REJECTED', -7); return inspect(); }
          stage = 82; state = 'delaying';
        } else stage = Math.min(80, stage + 1);
      } else if (stage >= 81 && stage <= 98) stage++;
      const elapsed = (now - origin) >>> 0;
      if (elapsed >= LEGACY_GAME_LOGIN_PROFILE.timeoutMilliseconds) stop('LEGACY_LOGIN_TIMEOUT', elapsed >= 600001 ? -1 : 0);
      return inspect();
    },
    copyReply() { active(); return reply?.slice() ?? null; },
    close() { if (state === 'closed') return; clearFields(); clearReply(); state = 'closed'; ack = 0; },
  });
}

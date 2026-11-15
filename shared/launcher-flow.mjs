/** Explicit offline launcher exchange controller. Emits byte/connection intents; never opens sockets or authenticates an account. */
import { LauncherMessageError } from './launcher-message10.mjs';
import { encodeLauncherLoginRequestFrame, createLauncherProfileChoices, selectLauncherProfile } from './launcher-login.mjs';
import { createLauncherReplyStream } from './launcher-replies.mjs';
import {
  LAUNCHER_CHANNEL_LIMITS, encodeLauncherHandshakeHello, decodeLauncherHandshakeChallenge, answerLauncherHandshake,
  createLauncherRecordCodec, createLauncherRecordStream,
  LAUNCHER_CURRENT_CHANNEL_PROFILE, decodeLauncherCurrentHandshakeChallenge, answerLauncherCurrentHandshake,
  createLauncherCurrentRecordCodec, createLauncherCurrentRecordStream,
} from './launcher-channel.mjs';

export const LAUNCHER_FLOW_LIMITS = Object.freeze({ endpoints: 10, timeoutMs: 10000, chunkBytes: 65536, noticeReplies: 64 });
const fail = (code, message) => { throw new LauncherMessageError(code, message); };
const waitingStates = new Set(['connecting', 'awaiting-challenge', 'challenge-ready', 'awaiting-reply']);
function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected explicit received bytes.');
}
function challengeComplete(value, limits) {
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  if (value.length < 4) return false;
  if (view.getUint32(0, false) !== 0) fail('HANDSHAKE_REJECTED', 'Peer rejected the key exchange.');
  let at = 4;
  for (const limit of [limits.generatorHexBytes, limits.numberHexBytes, limits.numberHexBytes]) {
    if (value.length - at < 4) return false;
    const length = view.getUint32(at, false); at += 4;
    if (length < 1 || length > limit) fail('HANDSHAKE_HEX_BUDGET', 'Challenge field length exceeds the supported profile.');
    if (value.length - at < length) return false;
    at += length;
  }
  if (at !== value.length) fail('FLOW_HANDSHAKE_TRAILING', 'Challenge must end before encrypted reply processing.');
  return true;
}
function clearReply(reply) {
  if (!reply) return;
  reply.byteField.fill(0);
  for (const value of reply.byteList) value.fill(0);
  for (const value of reply.wordLists) value.fill(0);
}

/** The caller supplies an explicit bounded first endpoint and clock. Local consent/update/text conversion are outside this exchange boundary. */
export function createLauncherLoginFlow(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) fail('INVALID_INPUT', 'Expected explicit launcher flow inputs.');
  const suppliedHandshakeProfile = options.handshakeProfile;
  const handshakeProfile = suppliedHandshakeProfile === undefined ? 'generic' : suppliedHandshakeProfile;
  if (handshakeProfile !== 'generic' && handshakeProfile !== 'current') fail('INVALID_INPUT', 'Expected a supported explicit handshake profile.');
  const limits = handshakeProfile === 'current' ? LAUNCHER_CURRENT_CHANNEL_PROFILE : LAUNCHER_CHANNEL_LIMITS;
  const decodeChallenge = handshakeProfile === 'current' ? decodeLauncherCurrentHandshakeChallenge : decodeLauncherHandshakeChallenge;
  const answerChallenge = handshakeProfile === 'current' ? answerLauncherCurrentHandshake : answerLauncherHandshake;
  const makeRecordCodec = handshakeProfile === 'current' ? createLauncherCurrentRecordCodec : createLauncherRecordCodec;
  const makeRecordStream = handshakeProfile === 'current' ? createLauncherCurrentRecordStream : createLauncherRecordStream;
  const count = options.endpointCount, first = options.firstEndpointOrdinal;
  if (!Number.isInteger(count) || count < 1 || count > LAUNCHER_FLOW_LIMITS.endpoints ||
      !Number.isInteger(first) || first < 0 || first >= count) fail('FLOW_ENDPOINTS', 'Expected1..10 endpoints and a valid first ordinal.');
  let requestFrame = encodeLauncherLoginRequestFrame(options);
  options = null;
  let state = 'idle', attemptId = 0, endpointOrdinal = first, lastNow = null, deadline = null;
  let activeTransport = false, lastError = null, resultWord = null, noticeCount = 0;
  let challenge = new Uint8Array(0), records = null, replies = null, profileReply = null;

  function snapshot() {
    return Object.freeze({ state, handshakeProfile, attemptId, endpointOrdinal, attemptsMade: attemptId, deadlineAtMs: deadline,
      noticeCount, resultWord, errorCode: lastError?.code ?? null, authentication: 'unverified' });
  }
  function step({ writes = [], connect = false, closeId = null, ignored = false, notices = [] } = {}) {
    return Object.freeze({ snapshot: snapshot(),
      connectRequested: connect ? Object.freeze({ attemptId, endpointOrdinal }) : null,
      closeRequested: closeId === null ? null : Object.freeze({ attemptId: closeId }),
      writes: Object.freeze(writes.map(value => Object.freeze({ attemptId, bytes: value }))),
      notices: Object.freeze(notices), ignored, error: lastError });
  }
  function releaseWire() {
    challenge.fill(0); challenge = new Uint8Array(0);
    records?.close(); records = null; replies?.close(); replies = null;
  }
  function releaseAll() {
    releaseWire(); requestFrame?.fill(0); requestFrame = null; clearReply(profileReply); profileReply = null;
  }
  function stop(nextState, error = null) {
    const closeId = activeTransport ? attemptId : null;
    state = nextState; deadline = null; activeTransport = false;
    lastError = error ? Object.freeze({ code: error.code, message: error.message }) : null;
    releaseAll(); return step({ closeId });
  }
  function failed(error) {
    const safe = error instanceof LauncherMessageError ? error : new LauncherMessageError('FLOW_INTERNAL', 'Offline exchange processing failed.');
    return stop('failed', safe);
  }
  function clock(now) {
    if (!Number.isSafeInteger(now) || now < 0 || now > Number.MAX_SAFE_INTEGER - LAUNCHER_FLOW_LIMITS.timeoutMs || (lastNow !== null && now < lastNow)) {
      fail('FLOW_CLOCK', 'Expected an explicit monotonic safe millisecond clock.');
    }
    lastNow = now;
    return deadline !== null && now >= deadline ? stop('timed-out', new LauncherMessageError('FLOW_TIMEOUT', 'Launcher exchange deadline elapsed.')) : null;
  }
  function event(id, now, expected, action) {
    if (state !== 'idle' && !waitingStates.has(state)) return step({ ignored: true });
    try {
      if (!Number.isInteger(id) || id < 1) fail('FLOW_ATTEMPT', 'Expected a positive local attempt identifier.');
      if (attemptId > 0 && id !== attemptId) return step({ ignored: true });
      const expired = clock(now); if (expired) return expired;
      if (!expected.includes(state)) fail('FLOW_STATE', 'Event is not valid in the current exchange state.');
      return action();
    } catch (error) { return failed(error); }
  }

  return Object.freeze({
    snapshot,
    start(now) {
      if (state !== 'idle') return step({ ignored: true });
      try {
        clock(now); deadline = now + LAUNCHER_FLOW_LIMITS.timeoutMs; attemptId = 1;
        activeTransport = true; state = 'connecting'; return step({ connect: true });
      } catch (error) { return failed(error); }
    },
    opened(id, now) {
      return event(id, now, ['connecting'], () => { state = 'awaiting-challenge'; return step({ writes: [encodeLauncherHandshakeHello()] }); });
    },
    openFailed(id, now) {
      return event(id, now, ['connecting'], () => {
        // Independent bounded policy: only pre-request opening failures rotate, once per endpoint, within the original deadline.
        if (attemptId >= count) return stop('failed', new LauncherMessageError('FLOW_ENDPOINTS_EXHAUSTED', 'Every configured endpoint opening failed.'));
        const closeId = attemptId; attemptId += 1; endpointOrdinal = (endpointOrdinal + 1) % count;
        return step({ connect: true, closeId });
      });
    },
    receive(input, id, now) {
      return event(id, now, ['awaiting-challenge', 'awaiting-reply'], () => {
        const chunk = bytes(input);
        if (chunk.length > LAUNCHER_FLOW_LIMITS.chunkBytes) fail('FLOW_CHUNK_BUDGET', 'Input chunk exceeds64KiB.');
        if (!chunk.length) return step();
        if (state === 'awaiting-challenge') {
          if (challenge.length + chunk.length > limits.challengeBytes) fail('HANDSHAKE_BUDGET', 'Challenge exceeds the supported profile.');
          const combined = new Uint8Array(challenge.length + chunk.length);
          combined.set(challenge); combined.set(chunk, challenge.length); challenge.fill(0); challenge = combined;
          if (challengeComplete(challenge, limits)) { decodeChallenge(challenge); state = 'challenge-ready'; }
          return step();
        }
        const notices = []; let finalReply = null;
        for (const plain of records.push(chunk)) {
          for (const reply of replies.push(plain)) {
            if (finalReply) fail('FLOW_REPLY_ORDER', 'No messages may follow the final type11 reply.');
            if (reply.type === 2) {
              noticeCount += 1;
              if (noticeCount > LAUNCHER_FLOW_LIMITS.noticeReplies) fail('FLOW_NOTICE_BUDGET', 'Too many preliminary launcher replies.');
              notices.push(reply);
            } else finalReply = reply;
          }
        }
        if (!finalReply) return step({ notices });
        if (records.pendingByteLength || replies.pendingByteLength) fail('FLOW_REPLY_ORDER', 'Final reply cannot leave an incomplete trailing record or frame.');
        const model = createLauncherProfileChoices(finalReply);
        resultWord = model.resultWord; const closeId = attemptId;
        records.finish(); replies.finish(); releaseWire(); requestFrame?.fill(0); requestFrame = null;
        deadline = null; activeTransport = false;
        if (model.disposition === 'profiles') { profileReply = model.reply; state = 'profiles'; }
        else state = model.disposition === 'no-profiles' ? 'no-profiles' : 'rejected';
        return step({ notices, closeId });
      });
    },
    answerChallenge(exponentBytes, id, now) {
      return event(id, now, ['challenge-ready'], () => {
        const derived = answerChallenge(challenge, exponentBytes);
        let encoder = null;
        try {
          encoder = makeRecordCodec(derived.keyBytes);
          const encrypted = encoder.encode(requestFrame);
          records = makeRecordStream(derived.keyBytes); replies = createLauncherReplyStream();
          challenge.fill(0); challenge = new Uint8Array(0); requestFrame.fill(0); requestFrame = null;
          state = 'awaiting-reply'; return step({ writes: [derived.publicMessage, encrypted] });
        } finally { encoder?.close(); derived.keyBytes.fill(0); }
      });
    },
    remoteClosed(id, now) {
      return event(id, now, [...waitingStates], () => {
        if (state === 'awaiting-reply') { records.finish(); replies.finish(); }
        if (state === 'awaiting-challenge' && challenge.length) fail('HANDSHAKE_TRUNCATED', 'Remote stream ended inside the challenge.');
        return stop('failed', new LauncherMessageError('FLOW_REMOTE_CLOSED', 'Remote connection closed before a final reply.'));
      });
    },
    tick(now) {
      if (!waitingStates.has(state)) return step();
      try { return clock(now) ?? step(); } catch (error) { return failed(error); }
    },
    getChoices() { return profileReply ? createLauncherProfileChoices(profileReply) : null; },
    selectProfile(displayOrdinal) {
      if (state !== 'profiles' || !profileReply) fail('FLOW_STATE', 'No profile choices are active.');
      const selection = selectLauncherProfile(profileReply, displayOrdinal);
      state = 'selected'; releaseAll(); return Object.freeze({ snapshot: snapshot(), selection });
    },
    cancel() {
      if (state !== 'idle' && !waitingStates.has(state) && state !== 'profiles') return step({ ignored: true });
      return stop('cancelled');
    },
  });
}

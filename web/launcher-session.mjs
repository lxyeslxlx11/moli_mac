/** Executes the REA-backed exchange using explicit stream/entropy/clock ports. No default endpoint or consent decision. */
import { createLauncherLoginFlow } from '../shared/index.mjs';
import { LAUNCHER_SESSION_LIMITS, LauncherSessionError, sessionFail, ownSessionValue,
  ownedSessionBytes, snapshotSessionEndpoints, safeSessionError, sessionSignal } from './launcher-session-data.mjs';
export { LAUNCHER_SESSION_LIMITS, LauncherSessionError } from './launcher-session-data.mjs';
const terminal = new Set(['profiles', 'no-profiles', 'rejected', 'failed', 'timed-out', 'cancelled', 'selected']);
const STOP = Symbol('session stopped');
function failureMetadata(error, fallback) {
  const safe = safeSessionError(error, fallback);
  return Object.freeze({ code: safe.code, message: safe.message });
}

export function createLauncherSession(input) {
  const endpoints = snapshotSessionEndpoints(ownSessionValue(input, 'endpoints'));
  const openStream = ownSessionValue(input, 'openStream');
  const suppliedNow = ownSessionValue(input, 'now', true), suppliedRandom = ownSessionValue(input, 'randomBytes', true);
  const setTimer = ownSessionValue(input, 'setTimer', true), clearTimer = ownSessionValue(input, 'clearTimer', true);
  const suppliedControl = ownSessionValue(input, 'createAbortController', true);
  const createControl = suppliedControl === undefined ? () => new AbortController() : suppliedControl;
  const schedule = setTimer === undefined ? globalThis.setTimeout : setTimer;
  const unschedule = clearTimer === undefined ? globalThis.clearTimeout : clearTimer;
  if (typeof openStream !== 'function') sessionFail('SESSION_INPUT');
  if (typeof schedule !== 'function' || typeof unschedule !== 'function') sessionFail('SESSION_TIMER');
  if (typeof createControl !== 'function') sessionFail('SESSION_CONTROL');
  let clock = suppliedNow, random = suppliedRandom;
  if (clock === undefined) {
    const performance = globalThis.performance, now = performance?.now;
    if (typeof now !== 'function') sessionFail('SESSION_CLOCK');
    clock = () => Math.floor(Reflect.apply(now, performance, []));
  }
  if (typeof clock !== 'function') sessionFail('SESSION_CLOCK');
  if (random === undefined) {
    const crypto = globalThis.crypto, fill = crypto?.getRandomValues;
    if (typeof fill !== 'function') sessionFail('SESSION_RANDOM');
    random = () => {
      const bytes = new Uint8Array(LAUNCHER_SESSION_LIMITS.exponentBytes);
      try { Reflect.apply(fill, crypto, [bytes]); return bytes; }
      catch { bytes.fill(0); sessionFail('SESSION_RANDOM'); }
    };
  }
  if (typeof random !== 'function') sessionFail('SESSION_RANDOM');
  let username = null, password = null, flow;
  try {
    username = ownedSessionBytes(ownSessionValue(input, 'usernameBytes'), 16);
    password = ownedSessionBytes(ownSessionValue(input, 'passwordBytes'), 16);
    flow = createLauncherLoginFlow({ endpointCount: endpoints.length,
      handshakeProfile: ownSessionValue(input, 'handshakeProfile', true),
      firstEndpointOrdinal: ownSessionValue(input, 'firstEndpointOrdinal'),
      requestCounter: ownSessionValue(input, 'requestCounter'), gameCode: ownSessionValue(input, 'gameCode'),
      usernameBytes: username, passwordBytes: password });
  } finally { username?.fill(0); password?.fill(0); }
  const stats = { opensRequested: 0, opensCompleted: 0, writesRequested: 0, writesCompleted: 0,
    outboundRequestedBytes: 0, readsCompleted: 0, inboundBytes: 0, entropyRequests: 0,
    closeRequests: 0, closeCallsCompleted: 0, cleanupErrors: 0 };
  let running = null, active = null, activeId = null, timer = null, control = null, rejectStop = null;
  let localError = null, coreError = null, lastIOErrorCode = null, operation = 'SESSION_INTERNAL';
  const note = step => { if (step.error) coreError = step.error; return step; };
  function snapshot() {
    const core = flow.snapshot();
    return Object.freeze({ state: localError ? 'failed' : core.state, flow: core,
      errorCode: localError?.code ?? core.errorCode, lastIOErrorCode,
      entropy: suppliedRandom === undefined ? 'platform-csprng' : 'caller-provided',
      io: Object.freeze({ ...stats }), authentication: 'unverified' });
  }
  function closeRaw(raw, acceptedClose = undefined) {
    try {
      const close = acceptedClose ?? Object.getOwnPropertyDescriptor(raw, 'close')?.value;
      if (typeof close !== 'function') { stats.cleanupErrors++; return; }
      stats.closeRequests++;
      const returned = Reflect.apply(close, raw, []);
      if (returned === undefined) stats.closeCallsCompleted++;
      else Promise.resolve(returned).then(() => stats.closeCallsCompleted++, () => stats.cleanupErrors++);
    } catch { stats.cleanupErrors++; }
  }
  function closeActive(id = activeId) {
    if (!active || id !== activeId) return;
    const old = active; active = null; activeId = null; closeRaw(old.raw, old.close);
  }
  function interrupt() {
    try { control?.abort(); } catch { stats.cleanupErrors++; }
    closeActive(); rejectStop?.(STOP);
  }
  function cancel() {
    const step = note(flow.cancel());
    if (!step.ignored) interrupt();
    return snapshot();
  }
  function now() {
    let value;
    try { value = clock(); } catch { sessionFail('SESSION_CLOCK'); }
    if (!Number.isSafeInteger(value) || value < 0) sessionFail('SESSION_CLOCK');
    return value;
  }
  function guard() {
    if (terminal.has(flow.snapshot().state) || control?.signal.aborted) throw STOP;
    note(flow.tick(now()));
    if (terminal.has(flow.snapshot().state)) { interrupt(); throw STOP; }
  }
  function clearDeadline() {
    if (timer === null) return;
    try { unschedule(timer); } catch { stats.cleanupErrors++; }
    timer = null;
  }
  function armDeadline() {
    const remaining = Math.max(0, flow.snapshot().deadlineAtMs - now());
    try {
      timer = schedule(() => {
        timer = null;
        if (terminal.has(flow.snapshot().state)) return;
        try {
          note(flow.tick(now()));
          if (terminal.has(flow.snapshot().state)) interrupt();
          else armDeadline();
        } catch (error) {
          localError = failureMetadata(error, 'SESSION_TIMER'); note(flow.cancel()); interrupt();
        }
      }, remaining);
    } catch { sessionFail('SESSION_TIMER'); }
  }
  function stream(raw) {
    try {
      const read = ownSessionValue(raw, 'read'), write = ownSessionValue(raw, 'write'), close = ownSessionValue(raw, 'close');
      if ([read, write, close].some(value => typeof value !== 'function')) sessionFail('SESSION_STREAM');
      return { raw, close, read: options => Reflect.apply(read, raw, [options]), write: (bytes, options) => Reflect.apply(write, raw, [bytes, options]) };
    } catch { sessionFail('SESSION_STREAM'); }
  }
  async function run(external) {
    let step = null, stopPromise;
    async function perform(action, dispose = null) {
      let arrived = false, value, abandoned = false, disposed = false;
      const discard = () => {
        if (arrived && !disposed && dispose) { disposed = true; try { dispose(value); } catch { stats.cleanupErrors++; } }
      };
      try {
        guard();
        const task = Promise.resolve(action());
        task.then(result => { arrived = true; value = result; if (abandoned) discard(); }, () => {});
        const result = await Promise.race([task, stopPromise]);
        guard(); return result;
      } catch (error) {
        abandoned = true; discard();
        if (error !== STOP) guard();
        throw error;
      }
    }
    try {
      if (terminal.has(flow.snapshot().state)) return;
      operation = 'SESSION_CONTROL';
      try {
        control = createControl();
        if (!control || typeof control.abort !== 'function' || !control.signal || typeof control.signal.aborted !== 'boolean') sessionFail('SESSION_CONTROL');
      } catch { control = null; sessionFail('SESSION_CONTROL'); }
      stopPromise = new Promise((_, reject) => { rejectStop = reject; });
      stopPromise.catch(() => {});
      external?.add(cancel);
      if (external?.aborted()) { cancel(); return; }
      step = note(flow.start(now()));
      if (terminal.has(step.snapshot.state)) return;
      operation = 'SESSION_TIMER'; armDeadline();
      while (true) {
        if (step.closeRequested) closeActive(step.closeRequested.attemptId);
        if (terminal.has(flow.snapshot().state)) break;
        if (step.connectRequested) {
          const { attemptId, endpointOrdinal } = step.connectRequested;
          operation = 'STREAM_CONNECT';
          try {
            const raw = await perform(() => {
              stats.opensRequested++;
              return openStream(endpoints[endpointOrdinal], { signal: control.signal });
            }, closeRaw);
            try { active = stream(raw); activeId = attemptId; }
            catch (error) { closeRaw(raw); throw error; }
            stats.opensCompleted++;
            step = note(flow.opened(attemptId, now()));
          } catch (error) {
            if (error === STOP) throw error;
            lastIOErrorCode = safeSessionError(error, 'STREAM_CONNECT').code;
            step = note(flow.openFailed(attemptId, now()));
          }
          continue;
        }
        for (const write of step.writes) {
          operation = 'SESSION_WRITE';
          try {
            if (!active || write.attemptId !== activeId) sessionFail('SESSION_STREAM');
            await perform(() => {
              stats.writesRequested++; stats.outboundRequestedBytes += write.bytes.length;
              return active.write(write.bytes, { signal: control.signal });
            });
            stats.writesCompleted++;
          } finally { write.bytes.fill(0); }
        }
        if (flow.snapshot().state === 'challenge-ready') {
          operation = 'SESSION_RANDOM';
          let raw = null, exponent = null;
          try {
            raw = await perform(() => { stats.entropyRequests++; return random(LAUNCHER_SESSION_LIMITS.exponentBytes); },
              suppliedRandom === undefined ? bytes => bytes.fill(0) : null);
            try { exponent = ownedSessionBytes(raw, LAUNCHER_SESSION_LIMITS.exponentBytes, LAUNCHER_SESSION_LIMITS.exponentBytes); }
            catch { sessionFail('SESSION_RANDOM'); }
            step = note(flow.answerChallenge(exponent, activeId, now()));
          } finally { exponent?.fill(0); if (suppliedRandom === undefined) raw?.fill(0); }
          continue;
        }
        operation = 'SESSION_READ';
        if (!active) sessionFail('SESSION_STREAM');
        const raw = await perform(() => active.read({ signal: control.signal }));
        stats.readsCompleted++;
        if (raw === null) { step = note(flow.remoteClosed(activeId, now())); continue; }
        const chunk = ownedSessionBytes(raw);
        try {
          stats.inboundBytes += chunk.length;
          if (stats.inboundBytes > LAUNCHER_SESSION_LIMITS.inboundBytes) sessionFail('SESSION_BUDGET');
          step = note(flow.receive(chunk, activeId, now()));
        } finally { chunk.fill(0); }
      }
    } catch (error) {
      if (error !== STOP) { localError = failureMetadata(error, operation); note(flow.cancel()); }
    } finally {
      if (step) for (const write of step.writes) write.bytes.fill(0);
      clearDeadline();
      try { external?.remove(cancel); } catch { stats.cleanupErrors++; }
      rejectStop = null;
      try { control?.abort(); } catch { stats.cleanupErrors++; }
      closeActive();
    }
  }
  return Object.freeze({ snapshot, cancel,
    start(options = {}) {
      if (running) return running;
      let external;
      try { external = sessionSignal(ownSessionValue(options, 'signal', true)); }
      catch (error) { note(flow.cancel()); throw error; }
      running = run(external).then(() => Object.freeze({ snapshot: snapshot(), choices: flow.getChoices(), error: localError ?? coreError }));
      return running;
    },
    getChoices: () => flow.getChoices(),
    selectProfile(displayOrdinal) { const selected = flow.selectProfile(displayOrdinal); return Object.freeze({ snapshot: snapshot(), selection: selected.selection }); },
  });
}

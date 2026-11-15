import test from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherSession } from '../launcher-session.mjs';

function input(extra = {}) {
  return { endpoints: [{ address: 'fixture.invalid', port: 12345 }], firstEndpointOrdinal: 0,
    requestCounter: 7, gameCode: 11, usernameBytes: Uint8Array.of(65), passwordBytes: Uint8Array.of(66),
    handshakeProfile: 'current', now: () => 0, randomBytes: () => new Uint8Array(20),
    openStream: () => new Promise(() => {}), ...extra };
}
function control() {
  const listeners = new Set(); let stopped = false;
  const signal = { get aborted() { return stopped; },
    addEventListener(_, fn) { listeners.add(fn); }, removeEventListener(_, fn) { listeners.delete(fn); } };
  return { signal, abort() { if (stopped) return; stopped = true; for (const fn of listeners) fn(); listeners.clear(); } };
}

test('session uses an explicit cancellation controller and cancels pending connection', async () => {
  let calls = 0, current;
  const session = createLauncherSession(input({ createAbortController() { calls++; current = control(); return current; } }));
  const running = session.start();
  try { assert.equal(calls, 1); assert.equal(current.signal.aborted, false); }
  finally { session.cancel(); await running; }
  const result = await running;
  assert.equal(result.snapshot.state, 'cancelled'); assert.equal(current.signal.aborted, true);
});

test('session rejects non-function/accessor platform cancellation port before opening', () => {
  for (const value of [null, 0, {}, 'controller']) {
    assert.throws(() => createLauncherSession(input({ createAbortController: value })), error => error.code === 'SESSION_CONTROL');
  }
  let called = false; const value = input();
  Object.defineProperty(value, 'createAbortController', { get() { called = true; return control; } });
  assert.throws(() => createLauncherSession(value), error => error.code === 'SESSION_INPUT');
  assert.equal(called, false);
});

test('broken platform controller fails before transport and retains sanitized error', async () => {
  for (const createAbortController of [() => null, () => ({}), () => ({ signal: {}, abort() {} }), () => { throw new Error('private provider detail'); }]) {
    let opens = 0;
    const session = createLauncherSession(input({ createAbortController, openStream() { opens++; } }));
    const result = await session.start();
    assert.equal(opens, 0); assert.equal(result.snapshot.state, 'failed');
    assert.equal(result.error.code, 'SESSION_CONTROL'); assert.doesNotMatch(JSON.stringify(result), /private provider detail/);
  }
});

test('throwing abort port cannot prevent cancellation or leak the pending driver', async () => {
  const session = createLauncherSession(input({ createAbortController: () => ({ signal: { aborted: false }, abort() { throw new Error('private'); } }) }));
  const running = session.start();
  session.cancel();
  const result = await running;
  assert.equal(result.snapshot.state, 'cancelled'); assert.ok(result.snapshot.io.cleanupErrors >= 1);
});

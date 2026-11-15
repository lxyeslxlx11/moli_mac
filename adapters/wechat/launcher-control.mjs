import { sessionFail } from '../../web/launcher-session-data.mjs';

const signals = new WeakMap();
export function createWeChatAbortController() {
  const state = { aborted: false, listeners: new Set() };
  const signal = Object.freeze({ get aborted() { return state.aborted; } });
  signals.set(signal, state);
  return Object.freeze({ signal, abort() {
    if (state.aborted) return;
    state.aborted = true;
    for (const listener of state.listeners) { try { listener(); } catch { /* Notify all owned operations. */ } }
    state.listeners.clear();
  } });
}

export function weChatSignal(value) {
  if (value === undefined) return null;
  const state = signals.get(value);
  if (!state) sessionFail('STREAM_INPUT');
  return Object.freeze({ aborted: () => state.aborted,
    add: listener => state.listeners.add(listener), remove: listener => state.listeners.delete(listener) });
}

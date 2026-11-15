/** Fresh actual CJS game API in a neutral JS context; native ports are explicit original test facades. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { contentGraphics } from '../game-post-login-v1/original_assets.mjs';
const code = readFileSync(new URL('../../build/wechat-game-stage167/game.js', import.meta.url), 'utf8');
const v = JSON.parse(readFileSync(new URL('./original-vectors.json', import.meta.url)));
const old = JSON.parse(readFileSync(new URL('../game-post-login-v1/original-vectors.json', import.meta.url)));
const b = value => new Uint8Array(Buffer.from(value, 'hex')), a = value => new Uint8Array(Buffer.from(value, 'ascii')), hex = value => Buffer.from(value).toString('hex');
function instance() {
  const module = { exports: {} }; runInNewContext(code, { module, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, ArrayBuffer, DataView,
    Buffer: undefined, URL: undefined, TextEncoder: undefined, TextDecoder: undefined, process: undefined, require: undefined, window: undefined, document: undefined,
    fetch: undefined, crypto: undefined, AbortController: undefined, AbortSignal: undefined, EventTarget: undefined, performance: undefined, setTimeout: undefined, clearTimeout: undefined }, { timeout: 1500 });
  return module.exports;
}
function configure(draft, row, action = (name, value) => draft.update(name, value)) {
  const [category, family, ordinal, color, d0, d1, mode] = row;
  if ((category > 4 ? 1 : 0) !== family) action('family'); action('appearance', ordinal);
  for (let i = 0; i < color; i++) action('color', 1); action('continue');
  const maximum = category < 5 ? 0 : category < 7 ? 1 : 2;
  for (let i = mode; i < maximum; i++) action('mode', -1);
  for (let i = 0; i < d0; i++) action('detail', { index: 0, delta: 1 });
  for (let i = 0; i < d1; i++) action('detail', { index: 1, delta: 1 });
  action('name', a('OriginalNew'));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) action('stat', { index: i, delta: 1 });
  for (let i = 0; i < 2; i++) for (let j = 0; j < (i ? 4 : 6); j++) action('element', { index: i, delta: 1 });
  action('request-confirmation');
}
test('actual neutral bundle matches8400 creation values/6000 allocation steps without DOM/Buffer/text/network/timer globals', () => {
  const api = instance();
  for (const row of v.appearances) {
    const draft = api.createLegacyGameCharacterDraft(row[0]);
    try { configure(draft, row); const value = draft.prepare(1); assert.deepEqual([...value.arguments.slice(2, 4), value.nativeVariant], row.slice(7)); value.arguments[1].fill(0); } finally { draft.close(); }
  }
  const draft = api.createLegacyGameCharacterDraft(8); draft.update('continue');
  try { for (const row of v.traces) { const value = draft.update(row[0] ? 'element' : 'stat', { index: row[1], delta: row[2] }); assert.equal(value.changed, !!row[3]); const s = value.snapshot; assert.deepEqual([...s.stats, s.statRemaining, ...s.elements, s.elementRemaining], row.slice(4)); } } finally { draft.close(); }
});
test('actual bundled WeChat port authenticates, creates, refreshes authoritative roster, enters and closes without browser globals', async () => {
  const api = instance(), foreign = instance(), row = v.flows[0], listeners = {}, writes = [], graphics = contentGraphics(api, 4);
  let wall = 0, created = 0, closed = 0;
  const socket = { connect() { queueMicrotask(() => { listeners.Connect(); listeners.Message({ message: api.encodeLegacyGameEnvelope(b(old.bootstrap.payloadHex)).buffer }); }); },
    write(raw) { const value = new Uint8Array(raw); writes.push(value.slice()); const expected = [old.authFrameHex, old.flow.requests.list.frameHex, row.create.frameHex, old.flow.requests.list.frameHex, row.entry.frameHex][writes.length - 1]; assert.equal(hex(value), expected);
      const responses = writes.length === 1 ? [old.authReplyFrameHex] : writes.length === 2 ? [old.flow.replies.category.frameHex, row.initial.frameHex] : writes.length === 3 ? [row.created.frameHex] : writes.length === 4 ? [old.flow.replies.category.frameHex, row.refreshed.frameHex] : [old.flow.replies.entered.frameHex];
      queueMicrotask(() => { for (const frame of responses) listeners.Message({ message: b(frame).buffer }); }); }, close() { closed++; } };
  for (const name of ['Connect', 'Message', 'Error', 'Close']) { socket['on' + name] = fn => { listeners[name] = fn; }; socket['off' + name] = fn => { if (listeners[name] === fn) delete listeners[name]; }; }
  const wx = { createTCPSocket() { created++; return socket; } }, credentials = () => ({ mappingBytes: a('gid:OriginalG glt:OriginalT\0'), moduleDigestBytes: a(old.authentication.moduleDigest) });
  const otherWorld = foreign.createLegacyGameWorldProtocol();
  try { assert.throws(() => foreign.createWeChatLegacyGameSession({ sourceProfile: 'legacy-se6000-37c4', world: otherWorld, ...credentials(), postLogin: { graphics }, endpoint: { address: 'fixture.invalid', port: 12345 }, pollMilliseconds: 1, wx, wallNow: () => wall, setTimer: setTimeout, clearTimer: clearTimeout })); assert.equal(created, 0); } finally { otherWorld.close(); }
  const world = api.createLegacyGameWorldProtocol(), session = api.createWeChatLegacyGameSession({ sourceProfile: 'legacy-se6000-37c4', world, ...credentials(), postLogin: { graphics }, endpoint: { address: 'fixture.invalid', port: 12345 }, pollMilliseconds: 1, wx, wallNow: () => wall,
    setTimer(fn, delay) { return setTimeout(() => { wall += delay; fn(); }, 1); }, clearTimer: clearTimeout });
  try {
    assert.equal((await session.start()).sourceLoginComplete, true); await session.charactersReady; session.beginCharacterCreation(1);
    for (let i = 0; i < 1000 && session.inspect().characters.state !== 'creating'; i++) await new Promise(r => setTimeout(r, 1));
    assert.equal(session.inspect().characters.state, 'creating'); configure(null, [8, 1, 3, 2, 1, 4, 2], (name, value) => session.editCharacterCreation(name, value));
    assert.equal((await session.confirmCharacterCreation()).characters.sourceCreateCompletions, 1);
    for (let i = 0; i < 1000 && session.inspect().characters.state !== 'choosing'; i++) await new Promise(r => setTimeout(r, 1));
    assert.equal(session.inspect().characters.state, 'choosing'); assert.equal((await session.enterCharacter(1)).sourceCharacterEntered, true); assert.equal(writes.length, 5);
    session.close(); assert.equal((await session.done).characters.presentSlots, 0); assert.equal(closed, 1); assert.equal(Object.keys(listeners).length, 0); assert.equal(world.inspect().state, 'open'); assert.equal(api.detectLegacyGameCharacterContent(graphics), 4);
  } finally { session.close(); world.close(); graphics.close(); }
});

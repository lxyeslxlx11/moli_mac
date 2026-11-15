/** Fresh actual CJS API with browser/Node platform globals absent. Explicit original native-port facade only. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { contentGraphics } from '../game-post-login-v1/original_assets.mjs';
const code = readFileSync(new URL('../../build/wechat-game-stage168/game.js', import.meta.url), 'utf8');
const v = JSON.parse(readFileSync(new URL('./original-vectors.json', import.meta.url)));
const old = JSON.parse(readFileSync(new URL('../game-post-login-v1/original-vectors.json', import.meta.url)));
const b = h => new Uint8Array(Buffer.from(h, 'hex')), a = s => new Uint8Array(Buffer.from(s, 'ascii')), hex = b => Buffer.from(b).toString('hex');
function instance() {
  const module = { exports: {} }; runInNewContext(code, { module, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, ArrayBuffer, DataView,
    Buffer: undefined, URL: undefined, TextEncoder: undefined, TextDecoder: undefined, process: undefined, require: undefined, window: undefined, document: undefined,
    fetch: undefined, crypto: undefined, AbortController: undefined, AbortSignal: undefined, EventTarget: undefined, performance: undefined, setTimeout: undefined, clearTimeout: undefined }, { timeout: 1500 });
  return module.exports;
}
test('neutral API matches15296 source option cases,1566 capabilities and1128 corrected preview rows without DOM/Buffer/text/network/timer globals', () => {
  const api = instance();
  for (const row of v.options) {
    const [category, code, temporary, variant, action, present] = row.input, raw = new Uint8Array(148), view = new DataView(raw.buffer);
    raw[0] = present ? 65 : 0; for (const [offset, value] of [[24, code], [36, temporary], [80, variant]]) view.setInt32(offset, value, true);
    if (row.error) assert.throws(() => api.transformLegacyGameCharacterOption(raw, category, action), e => e.code === row.error);
    else { const r = api.transformLegacyGameCharacterOption(raw, category, action), d = new DataView(r.recordBytes.buffer); assert.deepEqual([d.getInt32(24, true), d.getInt32(36, true), d.getInt32(80, true), +r.previewPrepared, r.normalizedCode, r.requestedPreviewVariant], row.expected); r.recordBytes.fill(0); }
  }
  for (const row of v.upgradeCapabilities) { const r = api.legacyGameVersionUpgradeCapability(row.category, row.generation); assert.deepEqual([r.available, r.requestKind, r.reason], row.expected); }
  for (const row of old.previews) { const r = api.prepareLegacyGameCharacterPreview(b(row.recordHex)); assert.equal(hex(r.recordBytes), row.expected.recordHex); assert.equal(r.normalizedCode, row.expected.normalizedCode); r.recordBytes.fill(0); }
});
test('actual bundled WeChat port upgrades, explicitly refreshes, changes second look, binds proven field16, enters and closes without browser globals', async () => {
  const api = instance(), foreign = instance(), row = v.flows[1], listeners = {}, writes = [], graphics = contentGraphics(api, 4);
  let wall = 0, created = 0, closed = 0;
  const socket = { connect() { queueMicrotask(() => { listeners.Connect(); listeners.Message({ message: api.encodeLegacyGameEnvelope(b(old.bootstrap.payloadHex)).buffer }); }); },
    write(raw) { const value = new Uint8Array(raw); writes.push(value.slice()); const expected = [old.authFrameHex, old.flow.requests.list.frameHex, v.wire.request.frameHex, old.flow.requests.list.frameHex, row.entry.frameHex][writes.length - 1]; assert.equal(hex(value), expected);
      const responses = writes.length === 1 ? [old.authReplyFrameHex] : writes.length === 2 ? [v.wire.category5.frameHex, row.initial.frameHex] : writes.length === 3 ? [v.wire.accepted.frameHex] : writes.length === 4 ? [v.wire.category8.frameHex, row.initial.frameHex] : [old.flow.replies.entered.frameHex];
      queueMicrotask(() => { for (const frame of responses) listeners.Message({ message: b(frame).buffer }); }); }, close() { closed++; } };
  for (const name of ['Connect', 'Message', 'Error', 'Close']) { socket['on' + name] = fn => { listeners[name] = fn; }; socket['off' + name] = fn => { if (listeners[name] === fn) delete listeners[name]; }; }
  const wx = { createTCPSocket() { created++; return socket; } }, credentials = () => ({ mappingBytes: a('gid:OriginalG glt:OriginalT\0'), moduleDigestBytes: a(old.authentication.moduleDigest) });
  const otherWorld = foreign.createLegacyGameWorldProtocol();
  try { assert.throws(() => foreign.createWeChatLegacyGameSession({ sourceProfile: 'legacy-se6000-37c4', world: otherWorld, ...credentials(), postLogin: { graphics }, endpoint: { address: 'fixture.invalid', port: 12345 }, pollMilliseconds: 1, wx, wallNow: () => wall, setTimer: setTimeout, clearTimer: clearTimeout })); assert.equal(created, 0); } finally { otherWorld.close(); }
  const world = api.createLegacyGameWorldProtocol(), session = api.createWeChatLegacyGameSession({ sourceProfile: 'legacy-se6000-37c4', world, ...credentials(), postLogin: { graphics }, endpoint: { address: 'fixture.invalid', port: 12345 }, pollMilliseconds: 1, wx, wallNow: () => wall,
    setTimer(fn, delay) { return setTimeout(() => { wall += delay; fn(); }, 1); }, clearTimer: clearTimeout });
  try {
    assert.equal((await session.start()).sourceLoginComplete, true); await session.charactersReady;
    const upgraded = await session.beginVersionUpgrade(); assert.equal(upgraded.characters.state, 'upgrade-success'); assert.equal(upgraded.characters.category, 5); assert.equal(writes.length, 3);
    session.acknowledgeVersionUpgrade(); for (let i = 0; i < 1000 && session.inspect().characters.state !== 'choosing'; i++) await new Promise(r => setTimeout(r, 1));
    assert.equal(session.inspect().characters.category, 8); session.changeCharacterAppearance(1, 3); assert.equal(writes.length, 4);
    assert.equal((await session.enterCharacter(1)).sourceCharacterEntered, true); assert.equal(writes.length, 5);
    assert.equal(world.copyGameState().records.records[1].fields.find(f => f.id === 'field-16').value, 240076); assert.equal(world.copyGameState().actors.localActor, null);
    session.close(); assert.equal((await session.done).characters.presentSlots, 0); assert.equal(closed, 1); assert.equal(Object.keys(listeners).length, 0); assert.equal(world.inspect().state, 'open');
  } finally { session.close(); world.close(); graphics.close(); }
});

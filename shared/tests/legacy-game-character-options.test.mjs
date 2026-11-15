import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/game-character-options-v1/original-vectors.json', import.meta.url)));
const b = h => new Uint8Array(Buffer.from(h, 'hex')), error = code => e => e.code === code;
const wipe = rows => rows.forEach(r => { r.nameBytes.fill(0); r.recordBytes.fill(0); r.field16Bytes.fill(0); });
function menu(category = 5, generation = 4, index = 0) {
  const graphics = contentGraphics(api, generation), core = api.createLegacyGameCharacterFlow({ graphics });
  core.begin(); core.advance(100); core.advance(101); core.observe('receive-00567c20', [category]);
  core.observe('receive-00567c3c', [0, b(v.flows[index].bodyHex)]);
  for (let i = 0; i < 4; i++) core.advance(102 + i);
  assert.equal(core.inspect().state, 'choosing');
  return { core, close() { core.close(); graphics.close(); } };
}
test('independent source option oracle covers every byte category, boundary classification, both toggles and inverse table refusal', () => {
  for (const row of v.options) {
    const [category, code, temporary, variant, action, present] = row.input;
    const raw = new Uint8Array(148).fill(0x35), view = new DataView(raw.buffer);
    raw[0] = present ? 65 : 0; view.setInt32(24, code, true); view.setInt32(36, temporary, true); view.setInt32(80, variant, true);
    const saved = raw.slice();
    if (row.error) assert.throws(() => api.transformLegacyGameCharacterOption(raw, category, action), error(row.error), JSON.stringify(row.input));
    else {
      const r = api.transformLegacyGameCharacterOption(raw, category, action), a = new DataView(r.recordBytes.buffer);
      assert.deepEqual([a.getInt32(24, true), a.getInt32(36, true), a.getInt32(80, true), +r.previewPrepared, r.normalizedCode, r.requestedPreviewVariant], row.expected, JSON.stringify(row.input));
      for (let i = 0; i < 148; i++) if (![24, 25, 26, 27, 36, 37, 38, 39, 80, 81, 82, 83].includes(i)) assert.equal(r.recordBytes[i], saved[i]);
      r.recordBytes.fill(0);
    }
    assert.deepEqual(raw, saved);
  }
});
test('1566 independent upgrade capabilities and all known fixed markers preserve missing material and content guards', () => {
  assert.equal(v.upgradeCapabilities.length, 1566);
  for (const row of v.upgradeCapabilities) {
    const c = api.legacyGameVersionUpgradeCapability(row.category, row.generation);
    assert.deepEqual([c.available, c.requestKind, c.reason], row.expected);
    if (!c.available) assert.throws(() => api.createLegacyGameVersionUpgradeCommand(row.category, row.generation), error(c.reason));
    else {
      const command = api.createLegacyGameVersionUpgradeCommand(row.category, row.generation);
      assert.equal(command.operationId, 'send-004f8880'); assert.equal(command.arguments[0], c.requestKind);
      assert.equal(Buffer.from(command.arguments[1]).toString(), row.generation === 2 ? 'abcdefg' : c.requestKind === 2 ? '20031229_20' : '20031229_30');
      command.arguments[1].fill(0);
    }
  }
});
test('local actions change only owned records, preserve cached preview for3/4 and enter with exact modified field15/17/2', () => {
  for (let index = 0; index < v.flows.length; index++) {
    const f = menu(8, 4, index), row = v.flows[index];
    try {
      const before = f.core.copySlots(), normalized = before[row.slot].normalizedPreviewCode; assert.equal(typeof normalized, 'number'); wipe(before);
      for (const action of row.actions) f.core.changeAppearance(row.slot, action);
      const slots = f.core.copySlots(); assert.equal(Buffer.from(slots[row.slot].recordBytes).toString('hex'), row.expectedRecordHex);
      if (row.actions[0] < 5) assert.equal(slots[row.slot].normalizedPreviewCode, normalized);
      assert.equal(f.core.inspect().requests, 1); assert.equal(f.core.inspect().lastAppearanceAction.previewPrepared, row.actions[0] >= 5); wipe(slots);
      f.core.select(row.slot); const boundary = f.core.advance(106); assert.equal(boundary.effect.selectedAppearanceCode, row.entry.arguments[2]);
      assert.equal(boundary.effect.fullNativeReset, 'unmodeled'); assert.deepEqual(f.core.advance(107).commands[0].arguments, row.entry.arguments);
      assert.throws(() => f.core.changeAppearance(row.slot, 3), error('LEGACY_CHARACTER_NOT_SELECTABLE'));
    } finally { f.close(); }
  }
});
test('source0x814c fallback is33100 and sentinels33100/33101 suppress3/4 while33000 remains a valid appearance', () => {
  for (const code of [-2147483648, -1, 0, 29999]) {
    const raw = new Uint8Array(148); raw[0] = 65; const d = new DataView(raw.buffer); d.setInt32(24, code, true); d.setInt32(80, -1, true);
    const prepared = api.prepareLegacyGameCharacterPreview(raw); assert.equal(new DataView(prepared.recordBytes.buffer).getInt32(24, true), 33100); prepared.recordBytes.fill(0);
  }
  for (const code of [33100, 33101]) for (const action of [3, 4]) {
    const raw = new Uint8Array(148); raw[0] = 65; const d = new DataView(raw.buffer); d.setInt32(24, code, true); d.setInt32(36, 2, true);
    const r = api.transformLegacyGameCharacterOption(raw, 8, action); assert.deepEqual(r.recordBytes, raw); assert.equal(r.changed, false); r.recordBytes.fill(0);
  }
});
test('upgrade request has its own phases and low-byte reply, no source timeout, then explicit acknowledgement re-queries authoritative roster', () => {
  const f = menu();
  try {
    f.core.observe('receive-00567c1c', [null]); assert.equal(f.core.inspect().ignoredReplies, 1);
    f.core.beginVersionUpgrade(); assert.equal(f.core.advance(0xfffffffe).snapshot.nativeSubphase, 2);
    let step = f.core.advance(0xffffffff); assert.equal(step.snapshot.nativeSubphase, 3); assert.equal(step.snapshot.pendingRequest, 'version-upgrade'); assert.equal(f.core.remainingMilliseconds(1), null);
    assert.deepEqual(step.commands[0].arguments, [4, b('32303033313232395f3330')]); step.commands[0].arguments[1].fill(0);
    assert.equal(f.core.advance(600001, false).snapshot.nativeSubphase, 4); assert.equal(f.core.advance(4000000000, false).snapshot.state, 'waiting-upgrade');
    f.core.observe('receive-00567c1c', [256]); f.core.observe('receive-00567c1c', [1]);
    step = f.core.advance(4000000001, false); assert.equal(step.snapshot.state, 'upgrade-success'); assert.equal(step.snapshot.nativeSubphase, 101);
    assert.equal(step.snapshot.category, 5); assert.equal(step.snapshot.versionUpgrade.replyByte, 0); assert.equal(step.snapshot.versionUpgrade.sourceReplies, 1); assert.equal(step.snapshot.requiresPolling, false);
    assert.equal(f.core.advance(2).commands.length, 0); assert.throws(() => f.core.select(0), error('LEGACY_CHARACTER_NOT_SELECTABLE'));
    f.core.acknowledgeVersionUpgrade(); f.core.advance(3); assert.equal(f.core.advance(4).commands[0].operationId, 'send-004f86e0');
    assert.equal(f.core.inspect().presentSlots, 0); assert.equal(f.core.inspect().ignoredReplies, 2);
  } finally { f.close(); }
});
test('denied upgrade requires explicit retry; live category changes can make the next send unavailable without invented bytes', () => {
  const f = menu();
  try {
    f.core.beginVersionUpgrade(); f.core.advance(1); const first = f.core.advance(2).commands[0]; first.arguments[1].fill(0);
    f.core.observe('receive-00567c1c', [-1]); const denied = f.core.advance(3); assert.equal(denied.snapshot.nativeSubphase, 201); assert.equal(denied.snapshot.versionUpgrade.replyByte, 255);
    assert.equal(denied.snapshot.state, 'upgrade-error'); assert.equal(f.core.advance(999999).commands.length, 0); assert.equal(f.core.inspect().requests, 2);
    f.core.retryVersionUpgrade(); f.core.advance(4); f.core.observe('receive-00567c20', [7]); assert.equal(f.core.advance(5).commands.length, 0);
    assert.equal(f.core.advance(6).snapshot.nativeSubphase, 203); assert.equal(f.core.inspect().errorCode, 'LEGACY_CHARACTER_UPGRADE_MATERIAL');
    f.core.observe('receive-00567c20', [6]); f.core.retryVersionUpgrade(); f.core.advance(7); const retry = f.core.advance(8).commands[0]; assert.equal(retry.arguments[0], 4); retry.arguments[1].fill(0);
    assert.equal(f.core.inspect().requests, 3);
  } finally { f.close(); }
  const old = menu(0, 1); try { assert.equal(old.core.inspect().nativeAuxiliaryOption, true); assert.throws(() => old.core.beginVersionUpgrade(), error('LEGACY_CHARACTER_UPGRADE_CONTENT')); } finally { old.close(); }
});
test('entry appearance binds only the proven field16 once in a fresh keyed world, preserves unknown slots and accepts later source updates', () => {
  const w = api.createLegacyGameWorldProtocol();
  try {
    assert.throws(() => w.prepareCharacterEntry(202800), error('LEGACY_GAME_PROTOCOL_KEY_REQUIRED'));
    const base = JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json', import.meta.url)));
    w.append(api.encodeLegacyGameEnvelope(b(base.bootstrap.payloadHex))); assert.equal(w.next().kind, 'bootstrap');
    const result = w.prepareCharacterEntry(202800); assert.equal(result.nativeStorage, '0xf536a4');
    const records = w.copyGameState().records.records, selected = records.find(r => r.id === 'state-4f0000');
    assert.equal(selected.fields.find(f => f.id === 'field-16').value, 202800);
    for (const record of records) for (const field of record.fields) if (record.id !== selected.id || field.id !== 'field-16') assert.equal(field.value, null);
    assert.equal(w.copyGameState().actors.localActor, null); assert.throws(() => w.prepareCharacterEntry(1), error('LEGACY_GAME_ENTRY_PREPARED'));
    w.append(b(v.wire.field16.frameHex)); const packet = w.next(); assert.equal(packet.kind, 'message');
    assert.equal(w.copyGameState().records.records.find(r => r.id === selected.id).fields.find(f => f.id === 'field-16').value, 123456);
    for (const x of packet.arguments ?? []) if (x instanceof Uint8Array) x.fill(0);
  } finally { w.close(); }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/game-character-lifecycle-v1/original-vectors.json', import.meta.url)));
const bytes = value => new Uint8Array(Buffer.from(value, 'hex'));
const ascii = value => new Uint8Array(Buffer.from(value, 'ascii'));
const names = () => [ascii('OriginalA'), new Uint8Array()];
const error = code => e => e.code === code;
const wipe = rows => rows.forEach(row => { row.nameBytes.fill(0); row.recordBytes.fill(0); row.field16Bytes.fill(0); });
function configure(update, row) {
  const [category, family, ordinal, color, a, b, mode] = row;
  if ((category > 4 ? 1 : 0) !== family) update('family');
  update('appearance', ordinal);
  for (let i = 0; i < color; i++) update('color', 1);
  update('continue');
  for (let i = 0; i < a; i++) update('detail', { index: 0, delta: 1 });
  for (let i = 0; i < b; i++) update('detail', { index: 1, delta: 1 });
  const maximum = category < 5 ? 0 : category < 7 ? 1 : 2;
  for (let i = mode; i < maximum; i++) update('mode', -1);
  update('name', ascii('OriginalNew'));
  for (let i = 0; i < 5; i++) for (let n = 0; n < 6; n++) update('stat', { index: i, delta: 1 });
  for (let i = 0; i < 2; i++) for (let n = 0; n < (i ? 4 : 6); n++) update('element', { index: i, delta: 1 });
  update('request-confirmation');
}
function core() {
  const graphics = contentGraphics(api, 4), flow = api.createLegacyGameCharacterFlow({ graphics }); let tick = 100;
  flow.begin(); flow.advance(tick++); flow.advance(tick++); flow.observe('receive-00567c20', [8]);
  flow.observe('receive-00567c3c', [0, bytes(v.flows[0].initialBodyHex)]);
  for (let i = 0; i < 4; i++) flow.advance(tick++);
  return { flow, graphics, next: () => flow.advance(tick++), close() { flow.close(); graphics.close(); } };
}

test('8400 independently derived appearance combinations produce exact source animation/icon/native variant and13 wire arguments', () => {
  for (const row of v.appearances) {
    const draft = api.createLegacyGameCharacterDraft(row[0]);
    try {
      configure((action, value) => draft.update(action, value, names()), row);
      const command = draft.prepare(1, names());
      assert.equal(command.operationId, 'send-004f8460');
      assert.deepEqual(command.arguments.slice(2, 4), row.slice(7, 9));
      assert.equal(command.nativeVariant, row[9]); assert.equal(command.arguments.length, 13);
      assert.deepEqual(command.arguments.slice(4), [6, 6, 6, 6, 6, 6, 4, 0, 0]);
      command.arguments[1].fill(0);
    } finally { draft.close(); }
  }
});
test('6000 independent source hitbox steps preserve point budgets, caps, opposite rendering gate and ordered redistribution', () => {
  const draft = api.createLegacyGameCharacterDraft(8); draft.update('continue');
  try { for (const row of v.traces) {
    const step = draft.update(row[0] ? 'element' : 'stat', { index: row[1], delta: row[2] });
    assert.equal(step.changed, !!row[3]); const s = step.snapshot;
    assert.deepEqual([...s.stats, s.statRemaining, ...s.elements, s.elementRemaining], row.slice(4));
    assert.deepEqual(s.elementControls, s.elements.map((_, i) => s.elements[(i + 2) % 4] === 0));
  } } finally { draft.close(); }
});
test('306 independently classified byte names retain native pair rules, reserved sequences and explicit16B host limit', () => {
  assert.equal(v.names.length, 306);
  for (const row of v.names) {
    const draft = api.createLegacyGameCharacterDraft(8);
    try {
      draft.update('continue'); for (let i = 0; i < 5; i++) for (let n = 0; n < 6; n++) draft.update('stat', { index: i, delta: 1 });
      for (let n = 0; n < 10; n++) draft.update('element', { index: 0, delta: 1 });
      let actual = null;
      try { draft.update('name', bytes(row.hex)); draft.update('request-confirmation', undefined, names()); } catch (e) { actual = e.code; }
      assert.equal(actual, row.error, row.hex);
    } finally { draft.close(); }
  }
});
test('wizard cancellation, live category and owned name copies follow their source boundaries', () => {
  const draft = api.createLegacyGameCharacterDraft(8), name = ascii('OriginalNew');
  try {
    assert.equal(draft.inspect().family, 1); draft.update('appearance', 13); draft.update('color', -1); draft.update('continue');
    assert.equal(draft.inspect().mode, 2); draft.update('name', name); name.fill(0); const copy = draft.copy();
    assert.equal(Buffer.from(copy.nameBytes).toString(), 'OriginalNew'); copy.nameBytes.fill(0); assert.equal(draft.inspect().nameBytesLength, 11);
    assert.throws(() => draft.update('request-confirmation'), error('LEGACY_CREATION_STAT_POINTS'));
    draft.update('back'); assert.equal(draft.inspect().appearance, 13); assert.equal(draft.inspect().color, 3);
    draft.update('appearance', 13); assert.equal(draft.inspect().color, 0); draft.setCategory(0); assert.equal(draft.update('family').changed, false);
    draft.update('continue'); assert.equal(draft.inspect().mode, 0); assert.equal(draft.inspect().family, 1); assert.equal(draft.inspect().nameBytesLength, 0);
    assert.throws(() => draft.prepare(1), error('LEGACY_CREATION_NOT_CONFIRMED'));
  } finally { draft.close(); }
  assert.throws(() => draft.copy(), error('LEGACY_CREATION_CLOSED'));
});
test('empty-slot creation owns one request, prioritizes acknowledged success and refreshes real roster before entering', () => {
  const f = core(), flow = f.flow, reference = v.flows[0];
  try {
    assert.throws(() => flow.beginCreation(0), error('LEGACY_CHARACTER_SLOT_OCCUPIED'));
    flow.observe('receive-00567c48', [null, null, null]); flow.beginCreation(1); f.next();
    configure((action, value) => flow.creationAction(action, value), [8, 1, 3, 2, 1, 4, 2]);
    assert.equal(flow.inspect().creation.state, 'confirmation'); flow.confirmCreation(); const sent = flow.advance(0xfffffffa);
    assert.equal(sent.commands.length, 1); assert.equal(sent.snapshot.pendingRequest, 'create');
    const expected = reference.create.arguments.map(x => typeof x === 'number' ? x : bytes(x.hex));
    assert.deepEqual(sent.commands[0].arguments, expected); sent.commands[0].arguments[1].fill(0);
    flow.observe('receive-00567c48', [ascii('successful\0tail'), 901, ascii('ignored')]);
    let slots = flow.copySlots(); assert.equal(slots[1].present, false); assert.equal(slots[1].values['field-15'], 901); assert.equal(slots[1].values['field-17'], 1); wipe(slots);
    const accepted = flow.advance((0xfffffffa + 600001) >>> 0); assert.equal(accepted.snapshot.sourceCreateCompletions, 1); assert.equal(accepted.snapshot.nativeMainPhase, 3);
    flow.advance(2); const query = flow.advance(3); assert.equal(query.commands[0].operationId, 'send-004f86e0'); assert.equal(flow.inspect().presentSlots, 0);
    flow.observe('receive-00567c48', [ascii('successful'), -1, new Uint8Array()]);
    flow.observe('receive-00567c20', [8]); flow.observe('receive-00567c3c', [0, bytes(reference.finalBodyHex)]);
    for (let i = 0; i < 4; i++) flow.advance(4 + i);
    slots = flow.copySlots(); assert.equal(Buffer.from(slots[1].nameBytes).toString(), 'OriginalNew'); assert.equal(slots[1].values['field-17'], 2); wipe(slots);
    flow.select(1); flow.advance(8); const entry = flow.advance(9); assert.deepEqual(entry.commands[0].arguments, reference.entry.arguments);
    assert.equal(flow.inspect().sourceEnterComplete, false); assert.equal(flow.inspect().ignoredReplies, 2);
  } finally { f.close(); }
});
test('creation denial and unsigned600001 deadline keep connection policy distinct and require error acknowledgement without retry', () => {
  for (const mode of ['denied', 'timeout']) {
    const f = core(), flow = f.flow;
    try {
      flow.beginCreation(1); f.next(); configure((action, value) => flow.creationAction(action, value), [8, 1, 0, 0, 0, 0, 2]);
      flow.confirmCreation(); const command = flow.advance(100).commands[0]; command.arguments[1].fill(0);
      if (mode === 'denied') flow.observe('receive-00567c48', [ascii('Successful'), 901, ascii('not retained')]);
      const result = flow.advance(mode === 'denied' ? 101 : 600101);
      assert.equal(result.snapshot.nativeResult, mode === 'denied' ? -2 : -1); assert.equal(result.snapshot.state, 'creation-error');
      assert.equal(result.snapshot.sourceCreateCompletions, 0); assert.equal(result.snapshot.requiresPolling, false);
      flow.creationAction('dismiss-error'); f.next(); f.next(); assert.equal(flow.inspect().state, 'choosing');
      assert.equal(flow.inspect().requests, 2); assert.equal(flow.inspect().presentSlots, 1);
    } finally { f.close(); }
  }
});
test('appearance cancel returns preview/menu without query; closing draft clears private data and preserves caller-owned copies', () => {
  const f = core(), flow = f.flow;
  try {
    flow.beginCreation(1); f.next(); flow.creationAction('cancel'); f.next(); f.next(); assert.equal(flow.inspect().state, 'choosing'); assert.equal(flow.inspect().requests, 1);
    flow.beginCreation(1); f.next(); flow.creationAction('continue'); flow.creationAction('name', ascii('OriginalNew')); const copy = flow.copyCreation();
    flow.close(); assert.equal(Buffer.from(copy.nameBytes).toString(), 'OriginalNew'); copy.nameBytes.fill(0);
    assert.equal(flow.inspect().creation, null); assert.equal(flow.inspect().presentSlots, 0);
  } finally { f.close(); }
});

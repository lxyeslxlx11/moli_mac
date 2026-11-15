import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../../shared/index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
import { harness, sourceReady, flush, bytes, ascii } from './helpers/legacy-game-session-fixture.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/game-character-lifecycle-v1/original-vectors.json', import.meta.url)));
const old = JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json', import.meta.url)));
const row = v.flows[0], error = code => e => e.code === code;
function setup(options = {}) {
  const graphics = contentGraphics(api, 4), f = harness({ ...options, settings: { postLogin: { graphics } } });
  return { ...f, graphics, get stats() { return f.stats; }, get tick() { return f.tick; }, set tick(n) { f.tick = n; }, close() { f.close(); graphics.close(); } };
}
async function menu(f) {
  await sourceReady(f); f.fire(); await flush(); f.fire(); await flush();
  f.offer(bytes(old.flow.replies.category.frameHex)); await flush(); f.offer(bytes(row.initial.frameHex)); await flush();
  for (let i = 0; i < 4; i++) { f.fire(); await flush(); }
  assert.equal((await f.session.charactersReady).characters.state, 'choosing');
}
async function prepare(f) {
  f.session.beginCharacterCreation(1); f.fire(); await flush(); const edit = (a, b) => f.session.editCharacterCreation(a, b);
  edit('appearance', row.ordinal); for (let i = 0; i < row.color; i++) edit('color', 1); edit('continue');
  for (let i = 0; i < 2; i++) for (let j = 0; j < row.details[i]; j++) edit('detail', { index: i, delta: 1 });
  edit('name', ascii('OriginalNew'));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) edit('stat', { index: i, delta: 1 });
  for (let i = 0; i < 2; i++) for (let j = 0; j < (i ? 4 : 6); j++) edit('element', { index: i, delta: 1 });
  edit('request-confirmation');
}
async function sending(f) { await prepare(f); const pending = f.session.confirmCharacterCreation(); f.fire(); await flush(); assert.equal(Buffer.from(f.writes[2]).toString('hex'), row.create.frameHex); return { pending }; }

test('owned session serializes one source creation, consumes gated reply, refreshes roster and uses refreshed field17 for entry', async () => {
  const f = setup();
  try {
    await menu(f); const { pending } = await sending(f);
    f.offer(bytes(row.created.frameHex)); await flush(); f.fire(); await flush(); const result = await pending;
    assert.equal(result.state, 'ready'); assert.equal(result.characters.sourceCreateCompletions, 1); assert.equal(result.sourceCharacterEntered, false);
    f.fire(); await flush(); f.fire(); await flush(); assert.equal(f.writes.length, 4); assert.equal(Buffer.from(f.writes[3]).toString('hex'), old.flow.requests.list.frameHex);
    f.offer(bytes(row.created.frameHex)); await flush(); f.offer(bytes(old.flow.replies.category.frameHex)); await flush(); f.offer(bytes(row.refreshed.frameHex)); await flush();
    for (let i = 0; i < 4; i++) { f.fire(); await flush(); }
    assert.equal(f.session.inspect().characters.presentSlots, 2); assert.equal(f.session.inspect().characters.ignoredReplies, 1);
    const entered = f.session.enterCharacter(1); f.fire(); await flush(); f.fire(); await flush(); assert.equal(Buffer.from(f.writes[4]).toString('hex'), row.entry.frameHex);
    f.offer(bytes(old.flow.replies.entered.frameHex)); await flush(); f.fire(); await flush(); assert.equal((await entered).sourceCharacterEntered, true);
    await assert.rejects(f.session.sendCommand('send-004f8460', row.create.arguments), error('LEGACY_SESSION_CHARACTER_REPLAY'));
    assert.equal(JSON.stringify(f.states).includes('OriginalNew'), false); assert.equal(JSON.stringify(f.states).includes('Original ignored detail'), false);
  } finally { f.close(); }
});
test('creation denial leaves the stream ready, requires explicit error acknowledgement and does not retry or requery', async () => {
  const f = setup();
  try {
    await menu(f); const { pending } = await sending(f); f.offer(bytes(row.denied.frameHex)); await flush(); f.fire(); await flush();
    const result = await pending; assert.equal(result.state, 'ready'); assert.equal(result.characters.state, 'creation-error'); assert.equal(result.characters.nativeResult, -2);
    assert.equal(f.stats.closeCalls, 0); assert.equal(f.timers.size, 0); assert.equal(f.writes.length, 3);
    await assert.rejects(f.session.sendCommand('send-004f6710', [1, 2]), error('LEGACY_SESSION_GAME_NOT_ENTERED'));
    f.session.editCharacterCreation('dismiss-error'); f.fire(); await flush(); f.fire(); await flush();
    assert.equal(f.session.inspect().characters.state, 'choosing'); assert.equal(f.writes.length, 3); assert.equal(f.stats.closeCalls, 0);
  } finally { f.close(); }
});
test('source creation timeout uses600001ms, settles its result and returns to menu without an automatic retry', async () => {
  const f = setup();
  try {
    await menu(f); const { pending } = await sending(f); const origin = f.tick; f.tick = (origin + 20000) >>> 0; f.fire(); await flush();
    assert.equal(f.session.inspect().characters.pendingRequest, 'create'); f.tick = (origin + 600000) >>> 0; f.fire(); await flush();
    assert.equal((await pending).characters.nativeResult, -1); assert.equal(f.session.inspect().state, 'ready'); assert.equal(f.writes.length, 3);
    f.session.editCharacterCreation('dismiss-error'); f.fire(); await flush(); f.fire(); await flush(); assert.equal(f.session.inspect().characters.state, 'choosing');
  } finally { f.close(); }
});
test('unconfirmed or invalid creation does not write and caller-owned name bytes are independent of closure', async () => {
  const f = setup();
  try {
    await menu(f); assert.throws(() => f.session.beginCharacterCreation(0), error('LEGACY_CHARACTER_SLOT_OCCUPIED'));
    await assert.rejects(f.session.confirmCharacterCreation(), error('LEGACY_CHARACTER_NOT_CREATING'));
    f.session.beginCharacterCreation(1); f.fire(); await flush(); f.session.editCharacterCreation('continue');
    const name = ascii('OriginalNew'); f.session.editCharacterCreation('name', name); name.fill(0); const copy = f.session.copyCharacterCreation();
    assert.equal(Buffer.from(copy.nameBytes).toString(), 'OriginalNew'); assert.throws(() => f.session.editCharacterCreation('request-confirmation'), error('LEGACY_CREATION_STAT_POINTS'));
    await assert.rejects(f.session.confirmCharacterCreation(), error('LEGACY_CREATION_NOT_CONFIRMED')); assert.equal(f.writes.length, 2);
    f.session.close(); assert.equal(f.world.inspect().state, 'open'); assert.equal(f.session.inspect().characters.creation, null); assert.equal(Buffer.from(copy.nameBytes).toString(), 'OriginalNew'); copy.nameBytes.fill(0);
  } finally { f.close(); }
});
test('close during pending creation write clears in-flight wire, settles commit and suppresses late writer/timer callbacks', async () => {
  let writes = 0, release; const f = setup({ write: () => ++writes === 3 ? new Promise(resolve => { release = resolve; }) : Promise.resolve() });
  try {
    await menu(f); const { pending } = await sending(f), raw = f.writeRefs[2], stale = f.allTimers.at(-1); assert.ok(raw.some(x => x));
    f.session.close(); assert.equal((await pending).state, 'closed'); assert.equal(raw.every(x => x === 0), true); release(); stale.fn(); await flush();
    assert.equal(f.writes.length, 3); assert.equal(f.timers.size, 0); assert.equal(f.session.inspect().pendingWriteBytes, 0); assert.equal(f.stats.closeCalls, 1);
  } finally { f.close(); }
});
test('observer close at source creation completion resolves closed history and never issues the roster refresh', async () => {
  let session; const f = setup({ onState: s => { if (s.state === 'ready' && s.characters?.sourceCreateCompletions === 1) session.close(); } }); session = f.session;
  try {
    await menu(f); const { pending } = await sending(f); f.offer(bytes(row.created.frameHex)); await flush(); f.fire(); await flush();
    const end = await pending; assert.equal(end.state, 'closed'); assert.equal(end.characters.sourceCreateCompletions, 1); assert.equal(end.characters.creation, null); assert.equal(f.writes.length, 3);
  } finally { f.close(); }
});
test('late creation reply cannot consume the next list acknowledgement or mutate a cancelled draft', async () => {
  const f = setup();
  try {
    await menu(f); f.session.beginCharacterCreation(1); f.fire(); await flush(); f.session.editCharacterCreation('cancel'); f.fire(); await flush(); f.fire(); await flush();
    f.offer(bytes(row.created.frameHex)); await flush(); assert.equal(f.session.inspect().characters.state, 'choosing'); assert.equal(f.session.inspect().characters.sourceCreateCompletions, 0); assert.equal(f.writes.length, 2);
    const copy = f.session.copyCharacters(); assert.equal(copy[1].present, false); for (const x of copy) { x.recordBytes.fill(0); x.nameBytes.fill(0); x.field16Bytes.fill(0); }
  } finally { f.close(); }
});

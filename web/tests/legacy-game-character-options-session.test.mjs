import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../../shared/index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
import { harness, sourceReady, flush, bytes } from './helpers/legacy-game-session-fixture.mjs';
const v = JSON.parse(readFileSync(new URL('../../analysis/game-character-options-v1/original-vectors.json', import.meta.url)));
const old = JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json', import.meta.url)));
const error = code => e => e.code === code;
function setup(options = {}) {
  const graphics = contentGraphics(api, 4), f = harness({ ...options, settings: { postLogin: { graphics } } });
  return { ...f, get stats() { return f.stats; }, get tick() { return f.tick; }, set tick(n) { f.tick = n; }, close() { f.close(); graphics.close(); } };
}
async function fire(f, n = 1) { for (let i = 0; i < n; i++) { f.fire(); await flush(); } }
async function menu(f) {
  await sourceReady(f); await fire(f, 2); f.offer(bytes(v.wire.category5.frameHex)); await flush(); f.offer(bytes(v.flows[0].initial.frameHex)); await flush(); await fire(f, 4);
  assert.equal((await f.session.charactersReady).characters.state, 'choosing');
}
async function sending(f, retry = false) {
  const pending = retry ? f.session.retryVersionUpgrade() : f.session.beginVersionUpgrade(); await fire(f, 2);
  assert.equal(Buffer.from(f.writes.at(-1)).toString('hex'), v.wire.request.frameHex); return { pending };
}
test('session upgrade owns its reply, requires explicit successful return, refreshes real roster, changes look locally and binds entry field16', async () => {
  const f = setup();
  try {
    await menu(f); const { pending } = await sending(f); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); await fire(f);
    const accepted = await pending; assert.equal(accepted.characters.state, 'upgrade-success'); assert.equal(accepted.characters.versionUpgrade.sourceReplies, 1);
    assert.equal(accepted.characters.category, 5); assert.equal(f.writes.length, 3); assert.equal(f.timers.size, 0);
    f.session.acknowledgeVersionUpgrade(); await fire(f, 2); assert.equal(Buffer.from(f.writes[3]).toString('hex'), old.flow.requests.list.frameHex);
    f.offer(bytes(v.wire.category8.frameHex)); await flush(); f.offer(bytes(v.flows[0].initial.frameHex)); await flush(); await fire(f, 4);
    assert.equal(f.session.inspect().characters.category, 8); f.session.changeCharacterAppearance(0, 4); assert.equal(f.writes.length, 4);
    const pendingEntry = f.session.enterCharacter(0); await fire(f); const records = f.world.copyGameState().records.records;
    assert.equal(records[1].fields.find(x => x.id === 'field-16').value, 202800); assert.equal(f.world.copyGameState().actors.localActor, null);
    await fire(f); assert.equal(Buffer.from(f.writes[4]).toString('hex'), v.flows[0].entry.frameHex);
    f.offer(bytes(old.flow.replies.entered.frameHex)); await flush(); await fire(f); assert.equal((await pendingEntry).sourceCharacterEntered, true);
    await assert.rejects(f.session.sendCommand('send-004f8880', [4, new Uint8Array()]), error('LEGACY_SESSION_CHARACTER_REPLAY'));
    assert.equal(JSON.stringify(f.states).includes('OriginalA'), false); assert.equal(JSON.stringify(f.states).includes('20031229'), false);
  } finally { f.close(); }
});
test('denial preserves stream, has no automatic retry or invented source deadline and explicit retry owns a separate result', async () => {
  const f = setup();
  try {
    await menu(f); const first = await sending(f); f.tick = 4000000000; await fire(f); assert.equal(f.session.inspect().characters.state, 'waiting-upgrade');
    f.offer(bytes(v.wire.denied.frameHex)); await flush(); await fire(f); assert.equal((await first.pending).characters.state, 'upgrade-error');
    assert.equal(f.stats.closeCalls, 0); assert.equal(f.timers.size, 0); assert.equal(f.writes.length, 3);
    const second = await sending(f, true); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); await fire(f);
    assert.equal((await second.pending).characters.state, 'upgrade-success'); assert.equal(f.writes.length, 4); assert.equal(f.stats.closeCalls, 0);
  } finally { f.close(); }
});
test('closing a pending upgrade clears the actual in-flight wire and settles its promise before late write/timer callbacks', async () => {
  let n = 0, release; const f = setup({ write: () => ++n === 3 ? new Promise(resolve => { release = resolve; }) : Promise.resolve() });
  try {
    await menu(f); const { pending } = await sending(f), wire = f.writeRefs[2], timer = f.allTimers.at(-1); assert.ok(wire.some(Boolean));
    f.session.close(); assert.equal((await pending).state, 'closed'); assert.equal(wire.every(x => x === 0), true); release(); timer.fn(); await flush();
    assert.equal(f.writes.length, 3); assert.equal(f.stats.closeCalls, 1); assert.equal(f.timers.size, 0); assert.equal(f.session.inspect().pendingWriteBytes, 0);
  } finally { f.close(); }
});
test('reentrant error observer cannot overwrite the pending upgrade result owner with a retry', async () => {
  let session, rejected; const f = setup({ onState(s) { if (s.state === 'ready' && s.characters?.state === 'upgrade-error') rejected = session.retryVersionUpgrade(); } }); session = f.session;
  try {
    await menu(f); const { pending } = await sending(f); f.offer(bytes(v.wire.denied.frameHex)); await flush(); await fire(f);
    assert.equal((await pending).characters.state, 'upgrade-error'); await assert.rejects(rejected, error('LEGACY_SESSION_UPGRADE_PENDING')); assert.equal(f.writes.length, 3);
    const retry = await sending(f, true); f.session.close(); assert.equal((await retry.pending).state, 'closed');
  } finally { f.close(); }
});
test('observer close on successful upgrade suppresses refresh and settles with closed history', async () => {
  let session; const f = setup({ onState(s) { if (s.state === 'ready' && s.characters?.state === 'upgrade-success') session.close(); } }); session = f.session;
  try {
    await menu(f); const { pending } = await sending(f); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); await fire(f);
    const end = await pending; assert.equal(end.state, 'closed'); assert.equal(end.characters.versionUpgrade.sourceReplies, 1); assert.equal(f.writes.length, 3); assert.equal(f.timers.size, 0);
  } finally { f.close(); }
});
test('duplicate upgrade replies cannot consume a pending list reply and a changed live category refuses unknown upgrade bytes', async () => {
  const f = setup();
  try {
    await menu(f); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); assert.equal(f.session.inspect().characters.versionUpgrade.sourceReplies, 0);
    const { pending } = await sending(f); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); await fire(f); await pending;
    f.session.acknowledgeVersionUpgrade(); await fire(f, 2); f.offer(bytes(v.wire.accepted.frameHex)); await flush(); assert.equal(f.session.inspect().characters.pendingRequest, 'list');
    f.offer(bytes(v.wire.category8.frameHex)); await flush(); f.offer(bytes(v.flows[0].initial.frameHex)); await flush(); await fire(f, 4);
    await assert.rejects(f.session.beginVersionUpgrade(), error('LEGACY_CHARACTER_UPGRADE_UNAVAILABLE')); assert.equal(f.writes.length, 4); assert.equal(f.session.inspect().characters.versionUpgrade.sourceReplies, 1);
  } finally { f.close(); }
});

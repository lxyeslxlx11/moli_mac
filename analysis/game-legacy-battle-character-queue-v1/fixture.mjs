/** Authored resources; drive the actual entry, input, callback and C consumers. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { originalFiles } from '../game-resource-runtime-v1/original_files.mjs';
import { projectileAssets } from '../game-battle-physical-projectiles-v1/original_assets.mjs';
import { actorTransitionAssets } from '../game-battle-shared-storage-v1/actor-transitions-fixture.mjs';
import { rid0FallAssets } from '../game-legacy-battle-rid0-ownership-v1/fixture.mjs';

const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url)));
export const bytes = text => Uint8Array.from(text, c => c.charCodeAt(0));
const hex = value => value.toString(16).toUpperCase();
export const character = (name = 'Original', hp = 70, mp = 10, slots = [0, 2, 10]) => 'C|0|' +
  slots.map(slot => [hex(slot), name + slot, '186F0', '0', '1', hex(hp), '64', hex(mp), 'A',
    '0', slot === 2 ? '186DC' : '0', '0'].join('|') + '|').join('');
export const reflection = 'M|SKL|76C|3|0|2|A|10001|C|FF|' +
  'RID|0|2|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|';
export const bodyRows = battle => battle.copyCommands().bodies.bodies;
export const play = battle => battle.copyCommands().playback;
export const ring = battle => {
  const row = battle.copyState().characters;
  return [row.read, row.write];
};

export async function fixture(api) {
  const base = read('../game-resource-runtime-v1/original-vectors.json');
  const vectors = read('../game-battle-nested-physical-v1/original-vectors.json');
  const files = originalFiles(rid0FallAssets(actorTransitionAssets(projectileAssets(base, vectors))));
  const library = api.createLegacyGameResourceLibrary({ plan: api.createLegacyGameResourcePlan(new Uint8Array()),
    files: files.port, paletteMode: 'neutral' });
  const battle = api.createLegacyGameBattleState();
  await library.initialize();
  const { animations, graphics } = library.catalogs();
  battle.configureResources(0);
  battle.configureBodyPlayback({ animations, geometry: library.geometry, seed: 12345, initialPhase: 0,
    alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
  battle.configureFrames({ graphics });
  battle.configureSkills({ graphics });
  battle.configureEntry({ entryWindowPresent: false });
  battle.configureInput(); battle.configureLoop(); battle.configureExit();
  battle.applyEntry(1, 1000);
  for (const message of ['P|0|10|0|0|0|0|', character(), 'A|0|0|', reflection]) battle.receive(bytes(message), 10);
  let tick = 0, at = 0;
  const step = () => ({ at: ++at, ...battle.advanceEntry(tick += 16) });
  const until = (accept, limit = 1600) => {
    for (let i = 0; i < limit; i++) { const out = step(); if (accept(out)) return out; }
    assert.fail('Normal battle entry did not reach the expected consumer');
  };
  until(() => battle.copyEntry().phase === 4);
  const guard = () => {
    let selected = false;
    const requests = [];
    until(out => {
      if (!selected && battle.copyInput().state === 1 && battle.copyInput().menu.state === 0) {
        battle.chooseInputCommand('guard'); selected = true;
      }
      requests.push(...(out.input?.requests ?? []).map(r => String.fromCharCode(...r.arguments[0])));
      return battle.copyEntry().phase === 5;
    });
    assert.deepEqual(requests, ['G']);
  };
  guard();
  return { battle, step, until, guard, get at() { return at; },
    close() { battle.close(); library.close(); files.close(); } };
}

export async function runQueueCase(api, kind) {
  const f = await fixture(api), b = f.battle;
  try {
    const launched = f.until(() => play(b).nodes.some(n => n.kind === 'casting-projectile' && !n.deleted &&
      !n.casting.finish && n.casting.ownerSlot === 10 && n.casting.tuples[n.casting.tupleRead * 4] === 2));
    const initial = play(b), sourceId = initial.attachedRID.registry[2];
    assert.equal(b.copyEntry().phase, 6);
    assert.deepEqual(ring(b), [1, 1]);
    assert.ok(initial.attachedRID.handoffs.some(h => h.sourceId === sourceId && !h.complete));
    const wire = kind === 'end' ? 'C|20|' : character('Queued', 90, 9, [0, 2]);
    assert.equal(b.receive(bytes(wire), 10).command, 'characters');
    assert.deepEqual(ring(b), [1, 2]);
    if (kind === 'ordered') {
      b.receive(bytes(character('Later', 80, 8, [0, 2])), 10);
      b.receive(bytes(character('Last', 60, 6, [0, 2])), 10);
      assert.deepEqual(ring(b), [1, 0]);
    }
    const write = kind === 'ordered' ? 0 : 2;
    assert.deepEqual(bodyRows(b).filter(Boolean).map(row => [row.slot, row.vitals]),
      [[0, [70, 100, 10, 10]], [2, [70, 100, 7, 10]], [10, [70, 100, 10, 10]]]);
    if (kind === 'notice') b.receive(bytes('xU'), 10);
    const events = [];
    let calls = 0;
    const drained = f.until(out => {
      calls++;
      assert.equal(out.characters, null);
      assert.deepEqual(ring(b), [1, write]);
      events.push(...(out.callbacks?.body.events ?? []).filter(e => e.kind === 'battle-vital'));
      return kind === 'notice' ? out.phaseAfter === 7 : out.callbacks?.manager.kind === 'battle-round-drained';
    });
    if (kind === 'notice') {
      assert.equal(drained.phaseBefore, 6);
      assert.equal(calls, 1);
      assert.equal(b.copyState().roundCounter, 0);
      return { kind, launched: launched.at, stopped: drained.at, phase: 7, ring: ring(b), round: 0 };
    }
    assert.deepEqual([drained.phaseBefore, drained.phaseAfter], [6, 2]);
    assert.equal(b.copyState().roundCounter, 1);
    assert.ok(events.some(e => e.slot === 2 && e.field === 'HP' && e.before === 70 && e.value === 58));
    assert.equal(String.fromCharCode(...bodyRows(b)[2].nameBytes), 'AfterCast');
    assert.ok(bodyRows(b)[10]);
    const applied = f.step();
    assert.ok(applied.frame.submitted.some(row => row.kind === 'body' && row.slot === 10));
    assert.deepEqual([applied.phaseBefore, applied.phaseAfter, applied.characters.end], [2, kind === 'end' ? 7 : 3, kind === 'end']);
    assert.deepEqual(ring(b), [2, write]);
    if (kind !== 'end') {
      assert.equal(bodyRows(b)[10], null);
      assert.equal(bodyRows(b)[5], null);
      assert.deepEqual(bodyRows(b).filter(Boolean).map(row => [row.slot, String.fromCharCode(...row.nameBytes), row.vitals]),
        [[0, 'Queued0', [90, 100, 9, 10]], [2, 'Queued2', [90, 100, 9, 10]]]);
      f.until(() => b.copyEntry().phase === 4);
      assert.ok(!f.step().frame.submitted.some(row => row.kind === 'body' && row.slot === 10));
    }
    if (kind === 'ordered') {
      for (const [name, hp, mp, read, round] of [['Later', 80, 8, 3, 2], ['Last', 60, 6, 0, 3]]) {
        for (let i = 0; i < 40; i++) {
          assert.equal(f.step().characters, null);
          assert.equal(b.copyState().characters.read, (read + 3) % 4);
        }
        b.receive(bytes('A|0|' + hex(round - 1) + '|'), 10);
        b.receive(bytes('M|ACT|0|'), 10);
        f.guard();
        const nextDrain = f.until(out => out.callbacks?.manager.kind === 'battle-round-drained');
        assert.deepEqual([nextDrain.phaseBefore, nextDrain.phaseAfter], [6, 2]);
        const consumed = f.step();
        assert.equal(consumed.characters.records, 2);
        assert.deepEqual(ring(b), [read, 0]);
        assert.deepEqual(bodyRows(b).filter(Boolean).map(row => [row.slot, String.fromCharCode(...row.nameBytes), row.vitals]),
          [[0, name + '0', [hp, 100, mp, 10]], [2, name + '2', [hp, 100, mp, 10]]]);
        assert.equal(b.copyState().roundCounter, round);
        f.until(() => b.copyEntry().phase === 4);
      }
    }
    return { kind, launched: launched.at, drained: drained.at, consumed: applied.at, callbacksAfterEnqueue: calls,
      phase: b.copyEntry().phase, ring: ring(b), round: b.copyState().roundCounter,
      oldSourceId: sourceId, reflectedHP: 58, finalSlots: bodyRows(b).filter(Boolean).map(row => row.slot) };
  } finally { f.close(); }
}

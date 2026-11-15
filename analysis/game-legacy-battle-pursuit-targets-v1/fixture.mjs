/** Authored duplicate-target inputs and literal queues from the source append sites. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedFixture, sharedMotion } from '../game-battle-shared-storage-v1/fixture.mjs';
import { transformationAssets } from '../game-battle-shared-storage-v1/recovery-fixture.mjs';

const original = JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json', import.meta.url)));
const assets = transformationAssets(original);
export const motion = (hits, caster = 0) => sharedMotion('SKL', [40098, 3, caster, ...hits.flat(), 255]);
export const cases = Object.freeze({
  duplicate: [[10, 0], [10, 0]],
  notice: [[10, 0x10000000], [10, 0x10000000]],
  interleaved: [[10, 0], [11, 0x10000000], [10, 0]],
  self: [[0, 0], [0, 0]],
});
export const expected = Object.freeze({
  duplicate: [
    [0, [241, 24, 53, 38, 211, 62], [[0, 0, 400, 0], [10, 0, 0, 0], [10, 0, 0, 0], [255, 0, 0, 0]]],
    [10, [0, 0, 241, 11, 0, 0, 241, 11], [[10, 0, 400, 0], [10, 0, 400, 0]]],
  ],
  notice: [
    [0, [241, 24, 53, 38, 211, 62], [[0, 0, 400, 0], [10, 0x10000000, 0, 0], [10, 0x10000000, 0, 0], [255, 0, 0, 0]]],
    [10, [0, 0, 241, 0, 0, 241], [[10, 0, 400, 0], [10, 0, 400, 0]]],
  ],
  interleaved: [
    [0, [241, 24, 53, 38, 211, 62], [[0, 0, 400, 0], [10, 0, 0, 0], [11, 0x10000000, 0, 0], [10, 0, 0, 0], [255, 0, 0, 0]]],
    [10, [0, 0, 241, 11, 0, 0, 241, 11], [[10, 0, 400, 0], [10, 0, 400, 0]]],
    [11, [0, 0, 241], [[11, 0, 400, 0]]],
  ],
  self: [
    [0, [241, 24, 53, 38, 211, 62, 0, 11, 0, 11], [[0, 0, 400, 0], [0, 0, 0, 0], [0, 0, 0, 0], [255, 0, 0, 0]]],
  ],
});

export function checkPlan(api, kind) {
  const command = api.decodeLegacyGameBattleMotion(motion(cases[kind])).commands[0];
  const plan = api.planBattleCasting(command, slot => [0, 10, 11].includes(slot) ? { vitals: [70, 100, 10, 10] } : null, 0, 0);
  assert.equal(plan.kind, 'casting-plan');
  assert.deepEqual(plan.rows.map(row => [row.slot, row.actions, row.tuples]), expected[kind]);
  assert.deepEqual(plan.hits.map(row => [row.slot, row.flags]), cases[kind]);
  return plan;
}

export async function runRepeatedPursuit(api, kind) {
  checkPlan(api, kind);
  const f = await sharedFixture(api, assets, { initialSlots: [11] });
  try {
    f.load(motion(cases[kind]));
    const born = new Map(), hp = [], mp = [], released = [], recoveries = [];
    let end = null;
    for (let pass = 1; pass <= 8100; pass++) {
      const { out, state } = f.step();
      assert.ok(!out.commands.some(row => row.kind === 'command-unavailable'));
      for (const row of out.commands) {
        if (row.wait?.recovered?.length) recoveries.push({ pass, recovered: row.wait.recovered });
      }
      for (const row of out.body.events) {
        if (row.kind === 'battle-vital') (row.field === 'HP' ? hp : mp).push([pass, row.slot, row.before, row.value]);
      }
      for (const node of state.playback.nodes.filter(row => row.casting?.family === 'pursuit')) {
        if (!born.has(node.id)) born.set(node.id, { pass, target: node.casting.tuples[0], delay: node.casting.delay,
          speed: node.casting.speed, angle: node.casting.angle });
        if (node.deleted && !released.includes(node.id)) released.push(node.id);
      }
      if (out.manager.kind === 'battle-round-drained') {
        end = { pass, round: out.manager.roundCounter, actors: state.bodies.bodies.filter(Boolean).map(row => [row.slot, row.state, row.busy, row.vitals]),
          liveProjectiles: state.playback.nodes.filter(row => row.casting?.family === 'pursuit' && !row.deleted).length };
        break;
      }
    }
    assert.ok(end, 'The actual command manager must complete or apply its sourced bounded recovery');
    assert.equal(born.size, cases[kind].length);
    assert.deepEqual(hp, []);
    assert.equal(mp.length, 1);
    assert.deepEqual(mp[0].slice(1), [0, 10, 7]);
    assert.equal(end.round, 1);
    assert.ok(end.actors.every(row => row[2] === 0));
    assert.equal(recoveries.length, kind === 'self' ? 1 : 0);
    let cleanup = 0;
    while (f.owner.copyState().playback.nodes.some(row => row.casting?.family === 'pursuit' && !row.deleted)) {
      assert.ok(cleanup < 240);
      f.step(); cleanup++;
    }
    return { kind, launches: [...born.values()], hp, mp, released: released.length, recoveries, end, cleanup };
  } finally { f.close(); }
}

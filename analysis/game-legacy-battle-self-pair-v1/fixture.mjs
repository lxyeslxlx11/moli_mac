/** Authored ordinary physical self pairs; existing owners execute every callback. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedFixture, sharedMotion } from '../game-battle-shared-storage-v1/fixture.mjs';

const assets = JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json', import.meta.url)));
export const cases = {
  plain: { category: 0, hits: [[0, 0, 1, 12]], HP: 58 },
  critical: { category: 0, hits: [[0, 0, 3, 12]], HP: 58 },
  zero: { category: 0, hits: [[0, 0, 1, 0]], HP: 70 },
  dodge: { category: 0, hits: [[0, 0, 8, 12]], HP: 70 },
  miss: { category: 0, hits: [[0, 0, 0x100, 12]], HP: 70 },
  class1: { category: 1, hits: [[0, 0, 1, 12]], HP: 58 },
  class3: { category: 3, hits: [[0, 0, 1, 12]], HP: 58 },
  leading: { category: 0, hits: [[0, 0, 1, 12], [0, 10, 1, 6]], HP: 58, targetHP: 70 },
  following: { category: 0, hits: [[0, 10, 1, 6], [0, 0, 1, 12]], HP: 58, targetHP: 64 },
  alias: { category: 0, hits: [[50, 20, 1, 12]], HP: 58, principal: 20 },
};
export const motion = (definition, level = 0) => sharedMotion('SKL', [definition.category * 100 + level, 3, 0, ...definition.hits.flat(), 255]);
export const selfFixture = api => sharedFixture(api, assets, { initialSlots: [20] });

export async function runSelfPair(api, kind) {
  const definition = cases[kind], principal = definition.principal ?? 0, f = await selfFixture(api);
  const hp = [], mp = [], recoveries = [];
  let end = null, drawCount = 0;
  try {
    f.load(motion(definition));
    for (let pass = 1; pass <= 10000; pass++) {
      const { out, state, frame } = f.step();
      f.history.length = 0;
      for (const event of out.body.events) if (event.kind === 'battle-vital') {
        (event.field === 'HP' ? hp : mp).push([pass, event.slot, event.before, event.value]);
      }
      for (const command of out.commands) {
        assert.notEqual(command.kind, 'command-unavailable', command.reason);
        if (command.wait?.recovered?.length) recoveries.push({ pass, slots: [...command.wait.recovered] });
      }
      drawCount += frame.submitted.length;
      if (out.manager.kind === 'battle-round-drained') {
        end = { pass, round: out.manager.roundCounter,
          bodies: state.bodies.bodies.filter(Boolean).map(b => [b.slot, b.busy, b.vitals]) };
        break;
      }
    }
    assert.ok(end && drawCount > 0);
    const bodies = new Map(end.bodies.map(row => [row[0], row]));
    assert.equal(bodies.get(principal)[2][0], definition.HP);
    assert.equal(bodies.get(principal)[2][2], 7);
    assert.equal(bodies.get(10)[2][0], definition.targetHP ?? 70);
    assert.deepEqual(mp, [[11, principal, 10, 7]]);
    assert.equal(end.round, 1);
    assert.ok(end.bodies.every(b => b[1] === 0));
    assert.equal(end.pass, kind === 'following' ? 7506 : ['dodge', 'miss'].includes(kind) ? 7254 : 7207);
    assert.deepEqual(recoveries, [{ pass: 7203, slots: ['leading', 'following'].includes(kind) ? [0, 10] : [principal] }]);
    assert.deepEqual(hp, ['zero', 'dodge', 'miss'].includes(kind) ? [] : kind === 'following'
      ? [[70, 10, 70, 64], [104, 0, 70, 58]] : [[32, principal, 70, 58]]);
    return { kind, hp, mp, recoveries, end, drawCount };
  } finally { f.close(); }
}

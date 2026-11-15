import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import { cases, motion, runSelfPair } from '../../analysis/game-legacy-battle-self-pair-v1/fixture.mjs';

const get = slot => [0, 10, 20].includes(slot) ? { vitals: [70, 100, 10, 10] } : null;
const plan = (definition, level) => api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(motion(definition, level)).commands[0], get, 0, 0);

test('ordinary0/1/3 self pairs use one body for the source producer queues at every level', () => {
  for (const category of [0, 1, 3]) for (let level = 0; level < 10; level++) {
    const result = plan({ ...cases.plain, category }, level);
    assert.equal(result.kind, 'physical-family-plan');
    assert.deepEqual(result.rows.map(row => row.slot), [0]);
    assert.deepEqual(result.rows[0].actions, [38, 147, 53, 24, 7, 9, 10, 242, 14, 0, 26, 7, 11, 10]);
    assert.deepEqual(result.rows[0].tuples, [[0, 1, 12, 0]]);
  }
  const alias = plan(cases.alias, 0);
  assert.equal(alias.kind, 'physical-family-plan');
  assert.equal(alias.principal, 20);
  assert.deepEqual(alias.rows.map(row => row.slot), [20]);
  assert.deepEqual(alias.rows[0].tuples, [[20, 1, 12, 0]]);
});

for (const kind of Object.keys(cases)) test('ordinary physical aliased callback ownership: ' + kind, async () => {
  console.log(JSON.stringify(await runSelfPair(api, kind)));
});

test('ordinary self pairs retain opaque result bits after the scoped native consumer audit', () => {
  for (const flags of [0x10000, 0x20000, 0x40000, 0x40000000]) {
    const result = plan({ category: 0, hits: [[0, 0, flags, 12]] }, 0);
    assert.equal(result.kind, 'physical-family-plan');
    assert.equal(result.hits[0].flags >>> 0, flags);
  }
  assert.equal(plan({ category: 95, hits: [[0, 0, 0x10000, 12]] }, 0).kind, 'physical-family-plan');
});

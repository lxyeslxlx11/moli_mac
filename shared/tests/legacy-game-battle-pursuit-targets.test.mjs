import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../index.mjs';
import { cases, checkPlan, runRepeatedPursuit, motion } from '../../analysis/game-legacy-battle-pursuit-targets-v1/fixture.mjs';
import { sharedFixture } from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import { transformationAssets } from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';
import { readFileSync } from 'node:fs';

test('SKL400 preserves a complete action and tuple segment for each repeated target occurrence', () => {
  for (const kind of Object.keys(cases)) checkPlan(api, kind);
});

for (const kind of Object.keys(cases)) test('SKL400 repeated target playback: ' + kind, async () => {
  const result = await runRepeatedPursuit(api, kind);
  assert.equal(result.kind, kind);
  console.log(JSON.stringify(result));
});

test('SKL400 merges aliases for slot20 and preserves both result entries', () => {
  const command = api.decodeLegacyGameBattleMotion(motion([[50, 0], [20, 0x100]], 0)).commands[0];
  const plan = api.planBattleCasting(command, slot => [0, 20].includes(slot) ? { vitals: [70, 100, 10, 10] } : null, 0, 0);
  assert.equal(plan.kind, 'casting-plan');
  assert.deepEqual(plan.rows.map(row => row.slot), [0, 20]);
  assert.deepEqual(plan.rows[1].actions, [0, 0, 241, 11, 0, 0, 241, 11, 74]);
  assert.deepEqual(plan.rows[1].tuples, [[20, 0, 400, 0], [20, 0, 400, 0]]);
  assert.deepEqual(plan.rows[0].tuples.slice(1, 3), [[20, 0, 0, 0], [20, 0x100, 0, 0]]);
});

test('SKL400 repeated targets retain the existing body capacity check before applying queues or MP', async () => {
  const assets = transformationAssets(JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json', import.meta.url))));
  for (const count of [49, 50]) {
    const f = await sharedFixture(api, assets);
    try {
      f.load(motion(Array.from({ length: count }, () => [10, 0])));
      const { created } = f.owner.callManager(f.context);
      assert.equal(created.length, 1);
      const before = f.owner.copyState().bodies;
      const execute = () => {
        for (let i = 0; i < 20; i++) {
          const result = f.owner.callCommand(created[0], f.context);
          if (result.kind !== 'command-delay') return result;
        }
        assert.fail('The command did not leave its source delay');
      };
      if (count === 49) {
        assert.equal(execute().kind, 'command-casting');
        assert.equal(f.owner.copyState().bodies.bodies[10].actionWrite, 195);
      } else {
        assert.throws(execute, error => error.code === 'LEGACY_BATTLE_BODY_CAPACITY');
        assert.deepEqual(f.owner.copyState().bodies, before);
      }
    } finally { f.close(); }
  }
});

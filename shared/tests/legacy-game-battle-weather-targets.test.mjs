import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import { cases, effectResource, motion, runWeather, weatherFixture } from '../../analysis/game-legacy-battle-weather-targets-v1/fixture.mjs';

const get = slot => [0, 10, 11, 20, 21].includes(slot) ? { vitals: [70, 100, 10, 10] } : null;
const command = hits => api.decodeLegacyGameBattleMotion(motion(hits)).commands[0];

test('SKL401 repeated effect targets append the source queues at all levels and merge slot aliases', () => {
  for (let code = 40100; code < 40200; code++) {
    const decoded = api.decodeLegacyGameBattleMotion(motion([[10, 0], [10, 0x80000]], { code })).commands[0];
    const plan = api.planBattleCasting(decoded, get, 0, 0);
    assert.equal(plan.kind, 'casting-plan');
    assert.deepEqual(plan.rows.map(row => row.slot), [0, 10]);
    assert.deepEqual(plan.rows[1].actions, [0, 0, 35, 207]);
    assert.deepEqual(plan.rows[1].tuples, [[effectResource, 30, 0, 23]]);
    assert.deepEqual(plan.rows[0].tuples, [[10, 0, 0, 0], [10, 0x80000, 0, 0], [255, 0, 0, 0], [0, 1, 3], [0, 1, 0]]);
  }
  const alias = api.planBattleCasting(command([[51, 0x80000], [21, 0x80000]]), get, 0, 0);
  assert.equal(alias.kind, 'casting-plan');
  assert.deepEqual(alias.rows.map(row => row.slot), [0, 21]);
  assert.deepEqual(alias.rows[1].actions, [0, 35, 207, 0, 35, 207]);
  assert.deepEqual(alias.rows[1].tuples, [[effectResource, 30, 0, 23], [effectResource, 30, 0, 23]]);
});

for (const kind of Object.keys(cases)) test('SKL401 repeated weather callback lifecycle: ' + kind, async () => {
  console.log(JSON.stringify(await runWeather(api, kind)));
});

function execute(f, id) {
  for (let i = 0; i < 20; i++) {
    const result = f.owner.callCommand(id, f.context);
    if (result.kind !== 'command-delay') return result;
  }
  assert.fail('Command stayed in its source delay');
}

test('SKL401 repeated effects retain aggregate body capacity before applying queues and MP', async () => {
  for (const count of [66, 67]) {
    const f = await weatherFixture(api);
    try {
      f.load(motion(Array.from({ length: count }, () => [10, 0x80000])));
      const { created } = f.owner.callManager(f.context), before = f.owner.copyState().bodies;
      if (count === 66) {
        assert.equal(execute(f, created[0]).kind, 'command-casting');
        assert.equal(f.owner.copyState().bodies.bodies[10].actionWrite, 197);
      } else {
        assert.throws(() => execute(f, created[0]), error => error.code === 'LEGACY_BATTLE_BODY_CAPACITY');
        assert.deepEqual(f.owner.copyState().bodies, before);
      }
    } finally { f.close(); }
  }
});

test('SKL401 self effect retains the source mixed-bank boundary before changing bodies or MP', async () => {
  const f = await weatherFixture(api);
  try {
    f.load(motion([[0, 0x80000]]));
    const { created } = f.owner.callManager(f.context), before = f.owner.copyState().bodies;
    const result = execute(f, created[0]);
    assert.equal(result.kind, 'command-unavailable');
    assert.equal(result.reason, 'skill401-self-effect-tuple');
    assert.deepEqual(f.owner.copyState().bodies, before);
  } finally { f.close(); }
});

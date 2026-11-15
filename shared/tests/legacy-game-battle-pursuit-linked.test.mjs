import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../index.mjs';
import { motion } from '../../analysis/game-legacy-battle-pursuit-targets-v1/fixture.mjs';
import { cases, runLinked } from '../../analysis/game-legacy-battle-pursuit-linked-v1/fixture.mjs';
import { sharedFixture } from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import { transformationAssets } from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';
import { readFileSync } from 'node:fs';

test('SKL400 accepts a source-defined linked group with three continuation tuples', () => {
  const command = api.decodeLegacyGameBattleMotion(motion([[10, 0x800000], [10, 0], [10, 0], [11, 0]])).commands[0];
  const plan = api.planBattleCasting(command, slot => [0, 10, 11].includes(slot) ? { vitals: [70, 100, 10, 10] } : null, 0, 0);
  assert.equal(plan.kind, 'casting-plan');
  assert.equal(plan.hits.length, 4);
});

test('SKL400 rejects incomplete active linked spans and accepts a flag inside a consumed continuation', () => {
  const get = slot => [0, 10, 11].includes(slot) ? { vitals: [70, 100, 10, 10] } : null;
  for (const length of [1, 2, 3]) {
    const hits = Array.from({ length }, (_, i) => [10, i === 0 ? 0x800000 : 0]);
    const command = api.decodeLegacyGameBattleMotion(motion(hits)).commands[0];
    assert.equal(api.planBattleCasting(command, get, 0, 0).reason, 'skill400-linked-tuple-boundary');
  }
  const hits = [[10, 0x800000], [10, 0x800000], [10, 0], [11, 0]];
  assert.equal(api.planBattleCasting(api.decodeLegacyGameBattleMotion(motion(hits)).commands[0], get, 0, 0).kind, 'casting-plan');
});

for (const kind of Object.keys(cases)) test('SKL400 linked source/child/hidden lifecycle: ' + kind, async () => {
  console.log(JSON.stringify(await runLinked(api, kind)));
});

test('SKL400 truncated linked groups leave body queues and MP unchanged', async () => {
  const assets = transformationAssets(JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json', import.meta.url))));
  const f = await sharedFixture(api, assets);
  try {
    f.load(motion([[10, 0x800000], [10, 0], [10, 0]]));
    const { created } = f.owner.callManager(f.context);
    const before = f.owner.copyState().bodies;
    let result;
    for (let i = 0; i < 20; i++) {
      result = f.owner.callCommand(created[0], f.context);
      if (result.kind !== 'command-delay') break;
    }
    assert.equal(result.kind, 'command-unavailable');
    assert.equal(result.reason, 'skill400-linked-tuple-boundary');
    assert.deepEqual(f.owner.copyState().bodies, before);
  } finally { f.close(); }
});

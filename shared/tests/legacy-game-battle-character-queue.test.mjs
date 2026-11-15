import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../index.mjs';
import { runQueueCase } from '../../analysis/game-legacy-battle-character-queue-v1/fixture.mjs';

for (const kind of ['update', 'end', 'notice', 'ordered']) test('normal C consumer during reflection: ' + kind, async () => {
  const result = await runQueueCase(api, kind);
  assert.equal(result.round, kind === 'notice' ? 0 : kind === 'ordered' ? 3 : 1);
  console.log(JSON.stringify(result));
});

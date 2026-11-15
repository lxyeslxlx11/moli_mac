import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../index.mjs';
import { runAckCase } from '../../analysis/game-legacy-battle-round-ack-v1/fixture.mjs';

for (const kind of ['registered', 'future', 'stale', 'wrap']) test('round A/P ownership: ' + kind, async () => {
  const result = await runAckCase(api, kind);
  assert.equal(result.kind, kind);
  console.log(JSON.stringify(result));
});

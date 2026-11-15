import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as api from '../../../shared/index.mjs';
import { attachedRIDMotion } from '../../game-battle-attached-rid-v1/reference.mjs';
import { sharedFixture, sharedMotion } from '../../game-battle-shared-storage-v1/fixture.mjs';

const read = file => JSON.parse(readFileSync(new URL(file, import.meta.url)));
const assets = read('../../game-battle-shared-storage-v1/original-fixtures.json');
const vectors = read('../../game-battle-attached-rid-v1/original-vectors.json');
const [ride] = vectors.traces.find(trace => trace.case.name === 'level-0').case.rids;

function motion(category, a, b) {
  if (category === 404) {
    const exchange = [a, b, 0, 'First', 100120, 0, 123, 40, 100, 8, 10, 0,
      'Second', 100121, 456, 70, 100, 10, 10, 0];
    return sharedMotion('SKL', [40401, 99, 7, a, ...exchange, b, 0x41, 12, 255]);
  }
  const flags = category === 72 ? 0x42 : 0x41;
  return attachedRIDMotion({
    category, level: 0, hits: [[a, b, flags, 12, null]], rids: [[ride[0], a, b, ...ride.slice(3)]],
  });
}

async function observe(category, a, b) {
  const fixture = await sharedFixture(api, assets, { local: a, mounts: [a], initialSlots: [a, b] });
  try {
    const raw = motion(category, a, b);
    const decoded = api.decodeLegacyGameBattleMotion(raw).commands;
    assert.equal(decoded.length, 1);
    assert.equal(decoded[0].classCode, category);
    assert.equal(decoded[0].attachedRID, category === 404 ? 0 : 1);
    const initial = fixture.owner.copyState().playback;
    const oldId = initial.nodes.find(node => node.kind === 'body' && node.slot === b).id;
    fixture.load(raw);

    let queued, published, retired, resultAfterPublish, drainedAt;
    let priorState = 0;
    for (let callback = 1; callback <= 450; callback++) {
      const { out, state } = fixture.step();
      const rideState = state.playback.attachedRID;
      const handoff = rideState?.handoffs[0];
      const oldBody = rideState?.bodies.find(node => node.id === oldId)?.body;
      const oldNode = state.playback.nodes.find(node => node.id === oldId);
      const registered = rideState?.registry[b];
      const newBody = rideState?.bodies.find(node => node.id === handoff?.secondId)?.body;
      if (!queued && oldBody?.actionWrite >= 0) {
        queued = { callback, actions: Array.from(oldBody.actions.slice(0, oldBody.actionWrite + 1)) };
      }
      if (!published && handoff && registered === handoff.secondId) {
        published = { callback, newId: handoff.secondId, oldState: oldNode?.deleted ? 'deleted' : oldBody?.state ?? null };
      }
      if (!retired && priorState === 49 && oldNode?.deleted) {
        retired = { callback, registered: registered ?? null };
      }
      if (published && !resultAfterPublish && category === 404 &&
          out.body.events.some(event => event.kind === 'battle-vital' && event.slot === b)) {
        resultAfterPublish = { callback, registered, oldHp: oldBody?.vitals[0], newHp: newBody?.vitals[0] };
      }
      priorState = oldBody?.state;
      if (out.manager.kind === 'battle-round-drained') {
        drainedAt = callback;
        break;
      }
    }
    assert.ok(drainedAt && published);
    assert.deepEqual(queued.actions.slice(0, 4), [0, 32, 50, 49]);
    if (category === 73) {
      assert.equal(published.oldState, 32);
      assert.ok(retired.callback > published.callback);
      assert.equal(retired.registered, published.newId);
    } else if (category === 72) {
      assert.ok(retired.callback < published.callback);
      assert.equal(published.oldState, null);
    } else {
      assert.equal(retired, undefined);
      assert.equal(published.oldState, 0);
      assert.equal(resultAfterPublish.registered, published.newId);
      assert.equal(resultAfterPublish.oldHp, 70);
      assert.equal(resultAfterPublish.newHp, 58);
    }
    return {
      category, a, b, oldId, input: { bytes: raw.length, sha256: createHash('sha256').update(raw).digest('hex') },
      attachedRID: decoded[0].attachedRID, queued, published, retired: retired ?? null,
      resultAfterPublish: resultAfterPublish ?? null, drainedAt,
    };
  } finally {
    fixture.close();
  }
}

const cases = [];
for (const category of [73, 72, 404]) {
  cases.push(await observe(category, 0, 5), await observe(category, 5, 0));
}
console.log(JSON.stringify({
  schema: 'moli.handoff.battle-slot-checkpoint.v1',
  productBaseline: 'stage306',
  originalExecuted: false,
  directActionInjection: false,
  cases,
}, null, 2));

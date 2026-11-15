/** Authored source-bank groups; no additional wire fields or replacement graphics. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedFixture } from '../game-battle-shared-storage-v1/fixture.mjs';
import { transformationAssets } from '../game-battle-shared-storage-v1/recovery-fixture.mjs';
import { motion } from '../game-legacy-battle-pursuit-targets-v1/fixture.mjs';

const assets = transformationAssets(JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json', import.meta.url))));
export const cases = {
  target: [[10, 0x800000], [10, 0], [10, 0], [11, 0]],
  owner: [[10, 0x802000], [10, 0], [10, 0], [11, 0]],
  repeated: [[10, 0x800000], [10, 0], [10, 0], [10, 0]],
  double: [[10, 0x800000], [10, 0], [10, 0], [10, 0], [10, 0x800000], [10, 0], [10, 0], [10, 0]],
};

export async function runLinked(api, kind) {
  const f = await sharedFixture(api, assets, { initialSlots: [11], mounts: [0, 10] });
  const born = new Map(), hp = [], mp = [], recoveries = [];
  let firstMetadata = null, firstHidden = null, end = null, firstQueue = null;
  try {
    f.load(motion(cases[kind]));
    for (let pass = 1; pass <= 12000; pass++) {
      const { out, state, frame } = f.step();
      for (const command of out.commands) if (command.wait?.recovered?.length) recoveries.push({ pass, slots: command.wait.recovered });
      for (const event of out.body.events) if (event.kind === 'battle-vital') {
        (event.field === 'HP' ? hp : mp).push([pass, event.slot, event.before, event.value]);
      }
      const projectiles = state.playback.nodes.filter(node => node.casting?.family === 'pursuit');
      for (const node of projectiles) if (!born.has(node.id)) {
        const words = Array.from(node.casting.tuples), flags = cases[kind][0][1];
        assert.deepEqual(words.slice(0, 16), [10, flags, 0, 0, 10, flags, 0, 0, 10, flags, 0, 0, 10, flags, 0, 0]);
        assert.equal(words[16], -1);
        born.set(node.id, { pass, words });
      }
      if (projectiles.length && !firstQueue) {
        firstQueue = { pass, casterRead: state.bodies.bodies[0].tupleRead,
          targetRead: state.bodies.bodies[10].actionRead, postRead: state.bodies.bodies[11].actionRead };
        assert.equal(firstQueue.casterRead, cases[kind].length + 2);
        if (kind === 'target' || kind === 'owner') assert.deepEqual([firstQueue.targetRead, firstQueue.postRead], [0, 1]);
      }
      const recipient = kind === 'owner' ? 0 : 10;
      const hidden = state.playback.nodes.find(node => node.kind === 'body' && node.slot === recipient && node.resourceId === 0);
      if (hidden && !firstMetadata) {
        firstMetadata = { pass, recipient, casterRead: state.bodies.bodies[0].tupleRead, hiddenId: hidden.id };
      }
      if (hidden && hidden.animation.graphicIndex === 0 && !firstHidden) {
        assert.equal(hidden.animation.graphicIndex, 0);
        assert.equal(hidden.animation.geometry, null);
        assert.ok(frame.skipped.some(row => row.id === hidden.id && row.reason === 'graphic-empty'));
        assert.ok(!state.playback.nodes.some(node => node.kind === 'rider' && node.parentId === hidden.id && !node.deleted));
        assert.ok(projectiles.some(node => node.casting.tupleRead === 3));
        firstHidden = { pass, recipient, hiddenId: hidden.id };
      }
      if (out.manager.kind === 'battle-round-drained') {
        end = { pass, round: out.manager.roundCounter,
          bodies: state.bodies.bodies.filter(Boolean).map(row => [row.slot, row.resourceId, row.busy, row.vitals]),
          liveProjectiles: projectiles.filter(node => !node.deleted).length };
        break;
      }
    }
    assert.ok(firstQueue && firstMetadata && firstHidden && end);
    assert.equal(born.size, kind === 'double' ? 2 : 1);
    assert.deepEqual(hp, []);
    assert.deepEqual(mp, [[4, 0, 10, 7]]);
    assert.equal(end.round, 1);
    assert.equal(end.liveProjectiles, 0);
    assert.ok(end.bodies.every(row => row[2] === 0));
    assert.ok(recoveries.length > 0);
    return { kind, firstQueue, firstMetadata, firstHidden, launches: [...born.values()], hp, mp, recoveries, end };
  } finally { f.close(); }
}

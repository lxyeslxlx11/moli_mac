/** Authored common physical self results; actual shared owners drive callbacks and recovery. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedFixture, sharedMotion } from '../game-battle-shared-storage-v1/fixture.mjs';

const assets = JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json', import.meta.url)));
export const categories = [0, 1, 3, 5, 6, 75, 76, 77, 78, 79, 80, 81, 84, 85, 87, 95, 110, 258, 259, 266];
export const cases = Object.fromEntries(categories.map(category => ['class' + category,
  { category, hits: [[0, 0, 1, 12, ...(category === 81 ? [7] : [])]], hp: 58 }]));
Object.assign(cases, {
  class5Bit4: { category: 5, hits: [[0, 0, 5, 12]], hp: 58 },
  class6Zero: { category: 6, hits: [[0, 0, 1, 0]], hp: 70 },
  class6Following: { category: 6, hits: [[0, 10, 1, 6], [0, 0, 1, 12]], hp: 58, targetMP: 4 },
  class6Leading: { category: 6, hits: [[0, 0, 1, 12], [0, 10, 1, 6]], hp: 58 },
  class84Following: { category: 84, hits: [[0, 10, 1, 6], [0, 0, 1, 12]], hp: 58 },
  class258Level9: { category: 258, level: 9, hits: [[0, 0, 1, 12]], hp: 58 },
  class259Level9: { category: 259, level: 9, hits: [[0, 0, 1, 12]], hp: 58 },
  class266Level9: { category: 266, level: 9, hits: [[0, 0, 1, 12]], hp: 58 },
  class5Alias: { category: 5, principal: 20, hits: [[50, 20, 1, 12]], hp: 58 },
  class6Alias: { category: 6, principal: 20, hits: [[50, 20, 1, 12]], hp: 58 },
  class6Dodge: { category: 6, hits: [[0, 0, 8, 12]], hp: 70 },
  class6Miss: { category: 6, hits: [[0, 0, 0x100, 12]], hp: 70 },
});
export const motion = definition => sharedMotion('SKL', [definition.category * 100 + (definition.level ?? 0), 3, 0, ...definition.hits.flat(), 255]);

export async function runSelfFamily(api, kind) {
  const definition = cases[kind], principal = definition.principal ?? 0;
  const f = await sharedFixture(api, assets, { initialSlots: [20] });
  const hp = [], mp = [], recoveries = [], resets = [];
  let end = null, drawCount = 0, previousClass = null;
  try {
    f.load(motion(definition));
    for (let pass = 1; pass <= 10000; pass++) {
      const { out, state, frame } = f.step();
      f.history.length = 0;
      const body = state.bodies.bodies[principal];
      if (body && previousClass !== body.classCode) {
        resets.push([pass, body.classCode]);
        previousClass = body.classCode;
      }
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
    assert.ok(end && drawCount > 0, 'real callback completion and drawing');
    const bodies = new Map(end.bodies.map(row => [row[0], row]));
    assert.deepEqual(bodies.get(principal)[2], [definition.hp, 100, 7, 10], kind);
    assert.deepEqual(bodies.get(10)[2], [70, 100, definition.targetMP ?? 10, 10], kind);
    assert.equal(end.round, 1);
    assert.ok(end.bodies.every(b => b[1] === 0));
    assert.deepEqual(resets.map(row => row[1]), [-1, definition.category, -1]);
    assert.equal(recoveries.length, 1);
    assert.equal(recoveries[0].pass, 7203);
    assert.deepEqual(hp.map(row => row.slice(1)), definition.hp === 70 ? [] : [[principal, 70, 58]]);
    assert.deepEqual(mp.map(row => row.slice(1)), kind === 'class6Following'
      ? [[principal, 10, 7], [10, 10, 4]] : [[principal, 10, 7]]);
    return { kind, hp, mp, resets, recoveries, end, drawCount };
  } finally { f.close(); }
}

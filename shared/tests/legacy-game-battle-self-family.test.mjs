import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import { createBattlePhysicalPlayback } from '../legacy-game-battle-physical-playback.mjs';
import { cases, runSelfFamily } from '../../analysis/game-legacy-battle-self-family-v1/fixture.mjs';

const categories = [0, 1, 3, 5, 6, 75, 76, 77, 78, 79, 80, 81, 84, 85, 87, 95, 110, 258, 259, 266];
const get = slot => [0, 10, 20].includes(slot) ? { vitals: [70, 100, 10, 10] } : null;
const plan = (category, level = 0, flags = 1, hits = null) => api.planBattlePhysicalFamily({ index: 0, attachedRID: null,
  fields: [category * 100 + level, 3, 0, ...(hits ?? [0, 0, flags, 12, ...(category === 81 ? [7] : [])]), 255] }, get, 0, 0);

test('common physical families accept aliased self ownership at all ten levels', () => {
  for (const category of categories) for (let level = 0; level < 10; level++) {
    const result = plan(category, level);
    assert.equal(result.kind, 'physical-family-plan', `${category}/${level}: ${result.reason}`);
    assert.deepEqual(result.rows.map(row => row.slot), [0]);
    assert.equal(result.rows[0].assignments.classCode, category);
    assert.equal(result.rows[0].assignments.skillLevel, level);
    assert.equal(result.rows[0].assignments.mpCost, 3);
  }
});

test('self class6 preflight requires the HP digits used after its target resets the same class', () => {
  const requested = [];
  const playback = createBattlePhysicalPlayback({ validateSpecials() {} }, {}, { image(id) {
    requested.push(id);
    assert.ok([243761, 243762].includes(id), `unexpected digit ${id}`);
  } });
  const result = playback.validate({ category: 6, principal: 0, pairMode: true, variant: 0,
    rows: [{ slot: 0, actions: [14], assignments: {} }], hits: [{ actor: 0, target: 0, flags: 1, amount: 12, guard: null }] });
  assert.equal(result.kind, 'physical-family-supported');
  assert.deepEqual(requested, [243761, 243762]);
});

test('class5 clears bit4 only on the first result and retains its message action', () => {
  const result = plan(5, 0, 5);
  assert.equal(result.kind, 'physical-family-plan');
  assert.deepEqual(result.rows[0].tuples, [[0, 1, 12, 0]]);
  assert.deepEqual(result.rows[0].actions, [38, 147, 53, 24, 7, 9, 10, 242, 66, 14, 0, 26, 7, 11, 10]);
  assert.equal(result.rows[0].assignments.messageResource, 0x5745);
  const repeated = plan(5, 0, 1, [0, 10, 1, 6, 0, 0, 5, 12]);
  assert.equal(repeated.kind, 'physical-family-plan');
  assert.equal(repeated.hits[1].flags, 5);
});

test('common self categories forward the scoped opaque result bits', () => {
  for (const category of categories) for (const flags of [0x10000, 0x20000, 0x40000, 0x40000000]) {
    const result = plan(category, 0, flags);
    assert.equal(result.kind, 'physical-family-plan');
    assert.equal(result.hits[0].flags >>> 0, flags);
  }
});

for (const kind of Object.keys(cases)) test('common physical self callback and round recovery: ' + kind, async () => {
  console.log(JSON.stringify(await runSelfFamily(api, kind)));
});

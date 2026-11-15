/** Authored repeated weather targets, using the retained source action/tuple order. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedFixture, sharedMotion } from '../game-battle-shared-storage-v1/fixture.mjs';
import { transformationAssets } from '../game-battle-shared-storage-v1/recovery-fixture.mjs';

const assets = transformationAssets(JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json', import.meta.url))));
export const effectResource = 0x1adfa;
export const cases = {
  plain_then_effect: { hits: [[10, 0], [10, 0x80000]], impacts: 30, recovery: false, release: [[10, 2, 0, 35]] },
  effect_then_plain: { hits: [[10, 0x80000], [10, 0]], impacts: 30, recovery: true, release: [[10, 2, 0, 207]] },
  effect_twice: { hits: [[10, 0x80000], [10, 0x80000]], impacts: 30, recovery: true, release: [[10, 2, 0, 207]] },
  effect_thrice: { hits: [[10, 0x80000], [10, 0x80000], [10, 0x80000]], impacts: 0, recovery: true, release: [[10, 3, 0, 0]] },
  interleaved: { hits: [[10, 0], [11, 0x80000], [10, 0x80000], [11, 0]], impacts: 60, recovery: true,
    release: [[10, 2, 0, 35], [11, 2, 0, 207]] },
};
export const motion = (hits, { caster = 0, code = 40198 } = {}) => sharedMotion('SKL', [code, 3, caster, ...hits.flat(), 255]);
export const weatherFixture = api => sharedFixture(api, assets, { initialSlots: [11, 20, 21] });

export async function runWeather(api, kind) {
  const definition = cases[kind], f = await weatherFixture(api), born = new Set(), hp = [], mp = [], recoveries = [];
  let release = null, firstImpact = null, lastImpact = null, end = null;
  try {
    f.load(motion(definition.hits));
    for (let pass = 1; pass <= 10000; pass++) {
      const { out, state } = f.step();
      f.history.length = 0;
      for (const event of out.body.events) if (event.kind === 'battle-vital') {
        (event.field === 'HP' ? hp : mp).push([pass, event.slot, event.before, event.value]);
      }
      for (const command of out.commands) if (command.wait?.recovered?.length) recoveries.push({ pass, slots: [...command.wait.recovered] });
      if (!release && state.bodies.bodies[0].tupleRead === definition.hits.length + 1) {
        const targets = [...new Set(definition.hits.map(hit => hit[0]))].sort((a, b) => a - b);
        release = { pass, casterRead: state.bodies.bodies[0].tupleRead,
          targets: targets.map(slot => { const b = state.bodies.bodies[slot]; return [slot, b.actionRead, b.tupleRead, b.state]; }) };
        assert.deepEqual(release.targets, definition.release);
      }
      for (const node of state.playback.nodes) if (node.kind === 'impact' && node.resourceId === effectResource && !born.has(node.id)) {
        born.add(node.id); firstImpact ??= pass; lastImpact = pass;
      }
      if (out.manager.kind === 'battle-round-drained') {
        end = { pass, round: out.manager.roundCounter, rainMode: state.playback.weather?.mode,
          liveImpacts: state.playback.nodes.filter(n => n.kind === 'impact' && !n.deleted).length,
          bodies: state.bodies.bodies.filter(Boolean).map(b => [b.slot, b.busy, b.vitals]) };
        break;
      }
    }
    assert.ok(release && end);
    assert.equal(born.size, definition.impacts);
    assert.deepEqual(hp, []);
    assert.deepEqual(mp, [[3, 0, 10, 7]]);
    assert.equal(end.round, 1);
    assert.equal(end.rainMode, 0);
    assert.ok(end.bodies.every(b => b[1] === 0));
    assert.equal(recoveries.length > 0, definition.recovery);
    assert.equal(end.pass, definition.recovery ? 7207 : 100);
    assert.deepEqual(recoveries, definition.recovery
      ? [{ pass: 7203, slots: kind === 'interleaved' ? [0, 10, 11] : [0, 10] }] : []);
    assert.equal(firstImpact, kind === 'plain_then_effect' ? 68 : kind === 'effect_thrice' ? null : 8);
    assert.equal(lastImpact, kind === 'effect_thrice' ? null : ['plain_then_effect', 'interleaved'].includes(kind) ? 97 : 37);
    let cleanup = 0;
    while (f.owner.copyState().playback.nodes.some(n => n.kind === 'impact' && !n.deleted) && cleanup < 120) {
      f.step(); f.history.length = 0; cleanup++;
    }
    assert.ok(!f.owner.copyState().playback.nodes.some(n => n.kind === 'impact' && !n.deleted));
    assert.equal(cleanup, kind === 'plain_then_effect' ? 4 : 0);
    return { kind, release, impacts: born.size, firstImpact, lastImpact, hp, mp, recoveries, end, cleanup };
  } finally { f.close(); }
}

import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';

const fixture = statusSlotFiles();
const ctx = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const hex = number => (number >>> 0).toString(16).toUpperCase();
const packet = (variant, caster, targets, level = 1, tail = '') =>
  Uint8Array.from('M|SKL|' + [9800 + level, 3, 15, variant, caster, ...targets, 255].map(hex).join('|') + '|' + tail,
    c => c.charCodeAt(0));
const parse = bytes => game.decodeLegacyGameBattleMotion(bytes).commands[0];

test('SKL98 slot-only records preserve the FF boundary and exact target actions at all levels', () => {
  const actor = { vitals: [70, 100, 10, 10], dynamicFlags: 0, unmodeledCharacterMask: 0 };
  for (const [variant, actions] of [[6, [78, 81, 66, 79, 54]], [8, [78, 51, 49]]]) {
    for (let level = 0; level < 10; level++) {
      const plan = game.planBattleStatusSkill(parse(packet(variant, 0, [10, 51], level)), () => actor, 0);
      assert.equal(plan.kind, 'status-skill-plan');
      assert.equal(plan.level, level);
      assert.deepEqual(plan.hits.map(hit => [hit.slot, hit.flags, hit.extra]), [[10, 0, null], [21, 0, null]]);
      assert.deepEqual(plan.rows[0].actions, [24, 53, 37, 38, 135, 62]);
      assert.deepEqual(plan.rows[0].tuples, [[10, 0, 0, 0], [21, 0, 0, 0], [-1, 0, 0, 0]]);
      assert.deepEqual(plan.rows.slice(1).map(row => row.actions), [actions, actions]);
    }
  }
});

test('SKL98 retirement resets an already dead target and gives the local pair its cache tuple', () => {
  const actor = { vitals: [0, 100, 10, 10], dynamicFlags: 2, unmodeledCharacterMask: 0 };
  const command = parse(packet(8, 0, [5, 5, 10]));
  const plan = game.planBattleStatusSkill(command, () => actor, 0);
  assert.equal(plan.kind, 'status-skill-plan');
  assert.deepEqual(plan.rows[0].tuples.map(tuple => tuple[0]), [5, 5, 10, -1]);
  assert.deepEqual([plan.rows[1].reset, plan.rows[1].actions, plan.rows[1].tuples], [true, [218, 78, 51, 49], [[-2, 0, 0, 0]]]);
  assert.deepEqual([plan.rows[2].reset, plan.rows[2].actions, plan.rows[2].tuples], [true, [78, 51, 49], []]);
  assert.equal(game.planBattleStatusSkill(command, () => actor).reason, 'status-skill98-local-slot');
});

async function runRound(input, actors, checkFrame, completed = () => true) {
  const files = originalFiles(fixture);
  const library = game.createLegacyGameResourceLibrary({ plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral' });
  const battle = game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    battle.configureBodyPlayback({ animations: library.catalogs().animations, geometry: library.geometry, seed: 12345,
      initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics: library.catalogs().graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const { slot, flags = 0, vitals = [70, 100, 10, 10], linked = [0, 0] } of actors)
      battle.applyCharacter(slot, flags, 100060, linked, vitals);
    battle.load(input, { ...ctx, substate: 5 });
    for (let pass = 0; pass < 1000; pass++) {
      const step = battle.callCallbacks(ctx), snapshot = battle.copyState();
      assert.deepEqual(step.commands.filter(row => row.kind === 'command-unavailable'), []);
      assert.deepEqual(step.body.results.filter(row => row.result.endsWith('unavailable')), []);
      checkFrame(step, snapshot);
      if (snapshot.roundCounter === 1 && completed(snapshot)) return snapshot;
    }
    assert.fail('SKL98 round did not complete');
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

test('SKL98 growth runs 61 float32 increments, sets the flag and then plays the message and second sound', async () => {
  const sounds = [], scales = [];
  let message = false, action5 = false;
  const last = await runRound(packet(6, 0, [10]), [{ slot: 0 }, { slot: 10 }], (step, snap) => {
    const target = snap.bodies.bodies[10];
    for (const event of step.body.events)
      if (event.kind === 'sound' && event.slot === 10) sounds.push(event.value);
    if (target.scale[0] !== 1 && target.scale[0] !== scales.at(-1)) scales.push(target.scale[0]);
    assert.equal(target.scale[0], target.scale[1]);
    assert.equal((target.dynamicFlags & 0x1000) !== 0, scales.length === 61);
    message ||= snap.playback.nodes.some(node => node.kind === 'message' && node.resourceId === 0x5784);
    action5 ||= target.animationAction === 5;
  });
  assert.equal(scales.length, 61);
  assert.equal(scales.at(-1), 1.3049997091293335);
  assert.deepEqual(sounds, [0x120, 0xa8]);
  assert.equal(message && action5, true);
  assert.deepEqual(last.bodies.bodies[10].vitals, [70, 100, 10, 10]);
  assert.equal(last.bodies.bodies[0].vitals[2], 7);
});

test('SKL98 retirement refreshes the paired pet cache before shrinking and removes both targets', async () => {
  const cache = [], sounds = [];
  let shrinking = false;
  const actors = [{ slot: 0 }, { slot: 5, vitals: [61, 90, 7, 12] },
    { slot: 10, flags: 2, vitals: [0, 100, 10, 10] }];
  const last = await runRound(packet(8, 0, [5, 10]), actors, (step, snap) => {
    cache.push(...step.body.events.filter(event => event.kind === 'battle-pet-cache'));
    sounds.push(...step.body.events.filter(event => event.kind === 'sound' && event.value === 0xcd).map(event => event.slot));
    const pair = snap.bodies.bodies[5];
    shrinking ||= pair !== null && pair.scale[0] > 0 && pair.scale[0] < 1;
  }, snap => snap.bodies.bodies[5] === null && snap.bodies.bodies[10] === null);
  assert.equal(last.bodies.bodies[0].vitals[2], 7);
  assert.equal(shrinking, true);
  assert.deepEqual(cache, [{ kind: 'battle-pet-cache', index: -2, refreshValues: [61, 90, 7, 12] }]);
  assert.deepEqual(sounds, [10, 5]); // The paired slot performs action 218 before its sound.
});

for (const variant of [6, 8]) {
  test('SKL98 slot variant ' + variant + ' runs its attached RID0 handoff after the caster target sentinel', async () => {
    const tail = 'RID|0|0|5|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
    let attached = 0;
    const last = await runRound(packet(variant, 0, [10], 1, tail), [{ slot: 0, linked: [100060, 0] }, { slot: 10 }], step => {
      attached += step.commands.find(row => row.kind === 'command-status-skill')?.attachedRID ?? 0;
    });
    const handoff = last.playback.attachedRID.handoffs[0];
    assert.equal(attached, 1);
    assert.deepEqual(handoff.lastReadSlots, [0, 5]);
    assert.equal(handoff.complete && handoff.containerDeleted, true);
    assert.deepEqual(last.bodies.bodies[0].vitals, [40, 100, 8, 10]);
    if (variant === 6) assert.equal(last.bodies.bodies[10].dynamicFlags & 0x1000, 0x1000);
    else assert.equal(last.bodies.bodies[10], null);
  });
}

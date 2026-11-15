import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';

const context = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const actor = { vitals: [70, 100, 10, 10], state: 0, unmodeledCharacterMask: 0 };
const prefix = [24, 53, 37, 38, 135, 62];
const impact = [147, 8, 6, 10, 78, 83, 34, 89, 84, 35, 87];
const recovery = [8, 6, 10, 62, 133, 88];

function motion(variant, assist, hits, { caster = 0, level = 1 } = {}) {
  const values = [9800 + level, 3, 15, variant, caster, assist, ...hits.flat(), 255];
  return Uint8Array.from('M|SKL|' + values.map(n => (n >>> 0).toString(16).toUpperCase()).join('|') + '|', c => c.charCodeAt(0));
}

const decode = bytes => game.decodeLegacyGameBattleMotion(bytes).commands[0];

test('SKL98 variant 12 separates the caster queue and stores resource tuples on the assisting slot', () => {
  for (let level = 0; level < 10; level++) {
    const command = decode(motion(12, 50, [[10, 0x800001, 12, 100040, 100041, 100050], [0, 0x41, 5]], { level }));
    assert.deepEqual([command.principalSlot, ...[0, 10, 20].map(slot => command.dependencyCounts[slot])], [20, 2, 1, 1]);
    const plan = game.planBattleStatusSkill(command, () => actor, 0, 0);
    assert.deepEqual([plan.principal, plan.assistSlot, plan.level], [0, 20, level]);
    const [caster, assist, target] = plan.rows;
    assert.deepEqual([caster.actions, caster.tuples, caster.assignments.assistSlot], [[...prefix, 0, 32, 244, 11], [], 20]);
    assert.deepEqual(assist.actions, [...impact, 50, 49, 72]);
    assert.deepEqual(assist.assignments.rememberedPosition, [449, 336]);
    assert.equal(Object.hasOwn(assist.assignments, 'mpCost'), false);
    assert.deepEqual(assist.tuples, [
      [10, 0x800001, 12, 100040], [10, 0x800001, 100040, 100041], [10, 0x800001, 100050, 0],
      [10, 0x800001, 12, 100040], [0, 0x41, 5, 100040], [-1, 0, 0, 0],
    ]);
    assert.deepEqual(target.actions, [26, 11]);
  }
});

test('SKL98 variant 13 keeps flags and signed amounts in fixed target triples', () => {
  const command = decode(motion(13, 1, [[0, 0x800000, 12], [51, 0, -2]]));
  assert.deepEqual([command.principalSlot, ...[0, 1, 21].map(slot => command.dependencyCounts[slot])], [1, 2, 1, 1]);
  const plan = game.planBattleStatusSkill(command, () => actor, 1);
  const [caster, assist, target] = plan.rows;
  assert.deepEqual(caster.actions, [...prefix, 0, 146, 155]);
  assert.deepEqual(assist.actions, [...recovery, 244, 72]);
  assert.deepEqual(assist.assignments.rememberedPosition, [318, 270]);
  assert.deepEqual(assist.tuples, [[0, 0x800000, 12, 0], [21, 0, -2, 0], [-1, 0, 0, 0]]);
  assert.deepEqual([caster.assignments.numberValue, target.assignments.numberValue, target.assignments.numberStyle], [12, -2, 5]);
});

async function withBattle(run, direct = false) {
  const files = originalFiles(statusSlotFiles());
  const library = game.createLegacyGameResourceLibrary({ plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral' });
  const battle = direct ? game.createLegacyGameBattleBodies() : game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    battle[direct ? 'configurePlayback' : 'configureBodyPlayback']({ animations: library.catalogs().animations,
      geometry: library.geometry, seed: 12345, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics: library.catalogs().graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const [slot, hp] of [[0, 70], [1, 70], [10, 70], [11, 98]]) {
      battle.applyCharacter(slot, 0, 100060, [0, 0], [hp, 100, 10, 10], 0, 0);
      if (direct) battle.resetQueues(1 << slot);
    }
    return await run(battle);
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

function runRound(battle, input, { caster = 0, assist = 1 } = {}) {
  battle.load(input, { ...context, substate: 5 });
  let castSignal = false, assistStarted = false, stopped = false;
  const states = new Set(), effects = new Set(), vitals = [];
  for (let pass = 0; pass < 1600; pass++) {
    const out = battle.callCallbacks(context), snap = battle.copyState();
    assert.deepEqual(out.commands.filter(row => row.kind === 'command-unavailable'), []);
    assert.deepEqual(out.body.results.filter(row => row.result.endsWith('unavailable')), []);
    castSignal ||= out.body.events.some(event => event.kind === 'signal' && event.slot === caster);
    const body = snap.bodies.bodies[assist];
    if (body?.state && body.state !== 231 && (assist !== caster || !prefix.includes(body.state))) {
      assert.ok(castSignal);
      assistStarted = true;
      states.add(body.state);
    }
    for (const node of snap.playback.nodes) effects.add(node.resourceId);
    vitals.push(...out.body.events.filter(event => event.kind === 'battle-vital'));
    stopped ||= out.body.stopRequested;
    if (out.nextSubstate === 7 || snap.roundCounter === 1) {
      assert.equal(assistStarted, true);
      return { snap, states, effects, vitals, stopped };
    }
    battle.advanceBackground();
  }
  assert.fail('The assisted round did not settle');
}

test('SKL98 variant 12 applies the assist impact and removes a nonlocal helper', async () => {
  await withBattle(battle => {
    const result = runRound(battle, motion(12, 1, [[10, 0x800001, 12, 100040, 100041, 100050], [11, 1, 7]]));
    assert.deepEqual(result.vitals.map(row => [row.slot, row.field, row.value]), [[0, 'MP', 7], [10, 'HP', 58], [11, 'HP', 91]]);
    assert.equal(result.snap.bodies.bodies[1], null);
    assert.equal(result.snap.roundCounter, 1);
    assert.ok([6, 83, 84].every(action => result.states.has(action)));
    assert.equal(result.effects.has(0x1ae4a), true);
    assert.equal(result.snap.playback.nodes.some(node => node.kind === 'rider' && !node.deleted), true);
  });
});

test('SKL98 variant 13 triggers each recovery in flight and clamps the current HP', async () => {
  await withBattle(battle => {
    const result = runRound(battle, motion(13, 1, [[10, 0x800000, 12], [11, 0, 7]]));
    assert.deepEqual(result.vitals.map(row => [row.slot, row.field, row.value]), [[0, 'MP', 7], [10, 'HP', 82], [11, 'HP', 100]]);
    assert.equal(result.snap.bodies.bodies[1], null);
    assert.equal(result.snap.roundCounter, 1);
    assert.ok([6, 133, 88].every(action => result.states.has(action)));
    assert.ok(result.effects.has(0x1ae4d) && result.effects.has(0x1ae08));
  });
});

test('SKL98 variant 13 drains an empty list and preserves the queue when caster and helper share a slot', async () => {
  for (const hits of [[], [[10, 0, 12]]]) await withBattle(battle => {
    const result = runRound(battle, motion(13, 1, hits, { caster: 1 }), { caster: 1 });
    assert.equal(result.snap.roundCounter, 1);
    assert.equal(result.snap.bodies.bodies[1], null);
    assert.deepEqual(result.vitals.map(row => [row.slot, row.field, row.value]),
      [[1, 'MP', 7], ...(hits.length ? [[10, 'HP', 82]] : [])]);
  });
});

for (const variant of [12, 13]) test(`SKL98 variant ${variant} stops at local assist action 244`, async () => {
  await withBattle(battle => {
    const result = runRound(battle, motion(variant, 0, [[10, 1, 12]], { caster: 1 }), { caster: 1, assist: 0 });
    assert.equal(result.stopped, true);
    assert.equal(result.snap.roundCounter, 0);
    assert.equal(result.snap.bodies.bodies[0].state, 244);
    assert.deepEqual(result.vitals.map(row => [row.slot, row.field, row.value]), [[1, 'MP', 7], [10, 'HP', variant === 12 ? 58 : 82]]);
  });
});

test('SKL98 assist roster and capacity failures leave both caster and assist queues intact', async () => {
  await withBattle(battle => {
    const before = battle.copyState();
    const commands = [motion(12, 2, [[10, 1, 12]]), motion(12, 1, []), motion(13, 1, [[2, 0, 12]])];
    for (const [i, reason] of ['status-skill-assist-slot', 'status-skill-assist-empty-impact', 'status-skill-target'].entries()) {
      assert.equal(battle.queueStatusSkill(decode(commands[i]), 1, 0, 0).reason, reason);
      assert.deepEqual(battle.copyState(), before);
    }
    battle.appendActions(1, 1, Array(195).fill(11));
    const full = battle.copyState();
    assert.throws(() => battle.queueStatusSkill(decode(motion(12, 1, [[10, 1, 12]])), 2, 0, 0), { code: 'LEGACY_BATTLE_BODY_CAPACITY' });
    assert.deepEqual(battle.copyState(), full);
  }, true);
});

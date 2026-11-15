import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';

const assets = statusSlotFiles();
const source = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const hex = value => value.toString(16).toUpperCase();
const motion = (caster, targets, tail = '', level = 1) => Uint8Array.from(
  'M|SKL|' + [9800 + level, 3, 15, 7, caster, ...targets, 255].map(hex).join('|') + '|' + tail, c => c.charCodeAt(0));
const parse = input => game.decodeLegacyGameBattleMotion(input).commands[0];
const actor = { vitals: [70, 100, 10, 10], state: 0, unmodeledCharacterMask: 0 };
const name = row => Buffer.from(row.nameBytes).toString('ascii');
const layout = game.LEGACY_GAME_BATTLE_SLOT_LAYOUT;

test('SKL98 variant 7 reserves both paired slots and queues by body identity at each of ten levels', () => {
  const actors = new Map([[0, actor], [5, actor], [15, actor], [20, actor]]);
  for (let level = 0; level < 10; level++) {
    const command = parse(motion(0, [0, 50], '', level));
    assert.deepEqual([0, 5, 15, 20].map(slot => command.dependencyCounts[slot]), [2, 1, 1, 1]);
    const plan = game.planBattleStatusSkill(command, slot => actors.get(slot), 0);
    assert.equal(plan.kind, 'status-skill-plan');
    assert.equal(plan.level, level);
    assert.deepEqual([plan.principal, plan.position.localSlot], [5, 5]);
    assert.deepEqual(plan.position.swaps, [
      { fromSlot: 0, toSlot: 5, movePair: true }, { fromSlot: 20, toSlot: 15, movePair: true },
    ]);
    assert.deepEqual(plan.rows.map(row => [row.slot, row.actions]), [
      [0, [24, 53, 37, 38, 135, 62, 78, 11]], [5, [11]], [20, [78, 11]], [15, [11]],
    ]);
    assert.deepEqual(plan.rows[0].tuples.map(row => row[0]), [5, 0, 15, 20, -1]);
  }
});

test('SKL98 only moves the local and caster slot markers when they equal the supplied slot', () => {
  const actors = new Map([[0, actor], [5, actor]]);
  const plan = game.planBattleStatusSkill(parse(motion(5, [0])), slot => actors.get(slot), 5);
  assert.deepEqual([plan.principal, plan.position.localSlot], [5, 5]);
  const oldCaster = plan.rows.find(row => row.slot === 5), mover = plan.rows.find(row => row.slot === 0);
  assert.deepEqual(oldCaster.tuples.map(row => row[0]), [5]);
  assert.deepEqual(mover.tuples.map(row => row[0]), [0, -1]);
  assert.deepEqual(oldCaster.actions, [24, 53, 37, 38, 135, 62, 11]);
  assert.deepEqual(mover.actions, [78, 11]);
});

async function withBattle(actors, bodyOnly, run) {
  const files = originalFiles(assets);
  const library = game.createLegacyGameResourceLibrary({ plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral' });
  const battle = bodyOnly ? game.createLegacyGameBattleBodies() : game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    battle[bodyOnly ? 'configurePlayback' : 'configureBodyPlayback']({ animations: library.catalogs().animations,
      geometry: library.geometry, seed: 12345, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics: library.catalogs().graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const { slot, label, linked = [0, 0] } of actors) {
      battle.applyCharacter(slot, 0, 100060, linked, actor.vitals, 0, 0, Uint8Array.from(label, c => c.charCodeAt(0)));
      if (bodyOnly) battle.resetQueues(1 << slot);
    }
    return await run(battle);
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

function runRound(battle, input, observe) {
  const ctx = { ...source };
  battle.load(input, { ...ctx, substate: 5 });
  for (let pass = 0; pass < 1000; pass++) {
    const step = battle.callCallbacks(ctx);
    assert.deepEqual(step.commands.filter(row => row.kind === 'command-unavailable'), []);
    assert.deepEqual(step.body.results.filter(row => row.result.endsWith('unavailable')), []);
    if (step.localSlotUpdate !== null) ctx.localSlot = step.localSlotUpdate;
    const snap = battle.copyState();
    observe(step, snap);
    if (snap.roundCounter === 1) return snap;
  }
  assert.fail('SKL98 position round did not complete');
}

test('SKL98 swaps both linked owners before the signal and walks them to their new formation', async () => {
  const actors = [{ slot: 0, label: 'Caster', linked: [100060, 100061] },
    { slot: 5, label: 'Partner', linked: [100061, 100060] }];
  await withBattle(actors, false, battle => {
    const before = battle.copyState().playback.nodes;
    const originalIds = [0, 5].map(slot => before.find(node => node.kind === 'body' && node.slot === slot).id);
    const links = before.filter(node => ['rider', 'attachment'].includes(node.kind)).map(node => [node.id, node.parentId]);
    assert.equal(links.length, 4);
    let swapPasses = 0, signal = false, walk = false;
    const updates = [], cues = [];
    const final = runRound(battle, motion(0, [0]), (step, snap) => {
      if (step.localSlotUpdate !== null) updates.push(step.localSlotUpdate);
      if (step.commands.some(row => row.kind === 'command-status-skill')) {
        swapPasses++;
        assert.deepEqual([name(snap.bodies.bodies[0]), name(snap.bodies.bodies[5])], ['Partner', 'Caster']);
        assert.deepEqual(snap.bodies.bodies[0].position, layout[5].target);
        assert.deepEqual(snap.bodies.bodies[5].position, layout[0].target);
      }
      signal ||= step.body.events.some(event => event.kind === 'signal' && event.slot === 5);
      if (snap.bodies.bodies.some(body => body?.state === 11)) { assert.ok(signal); walk = true; }
      cues.push(...step.body.events.filter(event => event.kind === 'sound' && event.value === 0xd2).map(event => event.slot));
    });
    assert.deepEqual([swapPasses, updates, walk, cues], [1, [5], true, [5]]);
    assert.deepEqual(final.bodies.bodies[0].position, layout[0].target);
    assert.deepEqual(final.bodies.bodies[5].position, layout[5].target);
    assert.deepEqual([final.bodies.bodies[0].vitals[2], final.bodies.bodies[5].vitals[2]], [10, 7]);
    assert.deepEqual([5, 0].map(slot => final.playback.nodes.find(node => node.kind === 'body' && node.slot === slot).id), originalIds);
    assert.deepEqual(final.playback.nodes.filter(node => ['rider', 'attachment'].includes(node.kind) && !node.deleted).map(node => [node.id, node.parentId]), links);
  });
});

test('SKL98 still settles two moves through a vacant destination with a final empty activation tuple', async () => {
  await withBattle([{ slot: 0, label: 'Caster' }], false, battle => {
    const firstId = battle.copyState().playback.nodes.find(node => node.kind === 'body').id;
    const updates = [], cues = [];
    const final = runRound(battle, motion(0, [0, 5]), step => {
      if (step.localSlotUpdate !== null) updates.push(step.localSlotUpdate);
      cues.push(...step.body.events.filter(event => event.kind === 'sound' && event.value === 0xd2));
    });
    assert.deepEqual(updates, []);
    assert.equal(cues.length, 2);
    assert.equal(final.playback.nodes.find(node => node.kind === 'body' && node.slot === 0).id, firstId);
    assert.equal(final.bodies.bodies[5], null);
    assert.deepEqual(final.bodies.bodies[0].position, layout[0].target);
  });
});

test('SKL98 moves a state 32 partner in the registry while keeping its old formation and queue', async () => {
  await withBattle([{ slot: 0, label: 'Caster' }, { slot: 5, label: 'Flight' }], true, battle => {
    battle.appendActions(5, 1, [32]);
    battle.activate(5);
    const result = battle.queueStatusSkill(parse(motion(0, [0])), 2, 0, 0);
    assert.deepEqual(result.swaps, [{ fromSlot: 0, toSlot: 5, movePair: false }]);
    const displaced = battle.copy(0);
    assert.deepEqual([name(displaced), displaced.formationSlot, displaced.state, displaced.actions[0]], ['Flight', 5, 32, 32]);
    assert.deepEqual(displaced.position, layout[5].target);
    assert.equal(displaced.actionWrite, 0);
  });
});

test('SKL98 retains the state 32 partner swap through a subsequent missing target and cleanup', async () => {
  await withBattle([{ slot: 0, label: 'Caster' }, { slot: 5, label: 'Flight' }], true, battle => {
    battle.appendActions(5, 1, [32]);
    battle.activate(5);
    const command = parse(motion(0, [0, 11]));
    const interrupted = battle.queueStatusSkill(command, 2, 0, 0, true);
    assert.deepEqual(interrupted.missing, { slot: 11, role: 'target' });
    assert.deepEqual(interrupted.swaps, [{ fromSlot: 0, toSlot: 5, movePair: false }]);
    assert.deepEqual([interrupted.principal, interrupted.localSlot], [5, 5]);
    assert.deepEqual([name(battle.copy(0)), battle.copy(0).formationSlot, battle.copy(0).actions[0]], ['Flight', 5, 32]);
    battle.resetQueues(command.dependencyMask);
    battle.completeSkillInterruption(interrupted, 2, true);
    const displaced = battle.copy(0), caster = battle.copy(5);
    assert.deepEqual([name(displaced), displaced.formationSlot, displaced.state, displaced.actionWrite, displaced.busy], ['Flight', 5, 32, -1, 1]);
    assert.deepEqual(displaced.position, layout[5].target);
    assert.deepEqual([name(caster), caster.state, caster.tupleWrite, caster.vitals[2]], ['Caster', 0, 1, 10]);
  });
});

test('SKL98 validates the attached RID0 parent in the relocated caster slot', async () => {
  const tail = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
  await withBattle([{ slot: 0, label: 'Caster', linked: [100060, 0] }], false, battle => {
    const updates = [];
    let attached = 0;
    const final = runRound(battle, motion(0, [0], tail), step => {
      attached += step.commands.find(row => row.kind === 'command-status-skill')?.attachedRID ?? 0;
      if (step.localSlotUpdate !== null) updates.push(step.localSlotUpdate);
    });
    assert.equal(attached, 1);
    assert.deepEqual(updates, [5]);
    const handoff = final.playback.attachedRID.handoffs[0];
    assert.deepEqual(handoff.lastReadSlots, [5, 0]);
    assert.equal(handoff.complete && handoff.containerDeleted, true);
    assert.equal(name(final.bodies.bodies[5]), 'OriginalRider');
  });
});

test('SKL98 leaves the body registry and queues intact when a later target or capacity check fails', async () => {
  await withBattle([{ slot: 0, label: 'Caster' }], true, battle => {
    const before = battle.copyState();
    assert.equal(battle.queueStatusSkill(parse(motion(0, [0, 10])), 1, 0, 0).reason, 'status-skill-target');
    assert.deepEqual(battle.copyState(), before);
    battle.appendActions(0, 1, Array(195).fill(11));
    const full = battle.copyState();
    assert.throws(() => battle.queueStatusSkill(parse(motion(0, [0])), 2, 0, 0), { code: 'LEGACY_BATTLE_BODY_CAPACITY' });
    assert.deepEqual(battle.copyState(), full);
  });
});

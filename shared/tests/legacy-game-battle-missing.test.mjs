import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';

const context = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const assets = statusSlotFiles();
const skill = (variant, caster, tail, cost = 3) =>
  'SKL|' + [9801, cost, 15, variant, caster, ...tail, 255].map(n => n.toString(16).toUpperCase()).join('|') + '|';
const motion = records => Uint8Array.from('M|' + records, c => c.charCodeAt(0));

async function withBattle(run) {
  const files = originalFiles(assets);
  const library = game.createLegacyGameResourceLibrary({ plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral' });
  const battle = game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    battle.configureBodyPlayback({ animations: library.catalogs().animations,
      geometry: library.geometry, seed: 12345, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics: library.catalogs().graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const [slot, name] of [[0, 'Caster'], [1, 'Helper'], [10, 'Target']]) {
      battle.applyCharacter(slot, 0, 100060, [0, 0], [70, 100, 10, 10], 0, 0, Buffer.from(name));
    }
    return await run(battle);
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

function play(battle, input, accept, limit = 1400) {
  const current = { ...context };
  battle.load(input, { ...current, substate: 5 });
  for (let pass = 0; pass < limit; pass++) {
    const step = battle.callCallbacks(current);
    assert.deepEqual(step.commands.filter(row => row.kind === 'command-unavailable'), []);
    assert.deepEqual(step.body.results.filter(row => row.result.endsWith('unavailable')), []);
    if (step.localSlotUpdate !== null) current.localSlot = step.localSlotUpdate;
    if (accept(step, current)) return;
    battle.advanceBackground();
  }
  assert.fail('The missing actor path did not reach the expected battle state');
}

test('SKL98 resets the queued caster on a missing first target in each of the fifteen variants', async () => {
  for (let variant = 0; variant <= 14; variant++) await withBattle(battle => {
    const assist = variant === 12 || variant === 13;
    const target = [6, 7, 8].includes(variant) ? [11] : variant === 11 ? [11, 0x80000, 12] : [11, 0x800000];
    const tail = assist ? [1, 11, 0x800000, 12, ...(variant === 12 ? [100040, 100041, 100050] : [])] : target;
    play(battle, motion(skill(variant, 0, tail)), step => {
      const stopped = step.commands.find(row => row.kind === 'command-status-skill');
      if (!stopped) return false;
      assert.deepEqual(stopped.missing, { slot: 11, role: 'target' });
      assert.equal(stopped.completion.kind, 'command-released');
      const bodies = battle.copyState().bodies.bodies;
      const caster = bodies[0];
      assert.deepEqual([caster.busy, caster.state, caster.actionWrite, caster.vitals[2]], [1, 0, -1, 10]);
      assert.equal(caster.tupleWrite, assist ? 0 : 1);
      if (assist) assert.deepEqual([bodies[1].state, bodies[1].actions[0], bodies[1].tupleWrite], [0, 72, 1]);
      return true;
    });
  });
});

test('SKL98 resumes a merged successor at its validated boundary and drops the interrupted attached RID0', async () => {
  await withBattle(battle => {
    const rid = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
    const input = motion(skill(6, 0, [11]) + rid + skill(6, 0, [10], 2));
    const commands = game.decodeLegacyGameBattleMotion(input).commands;
    assert.equal(commands[0].attachedRID, 1);
    const observed = [], mp = [];
    play(battle, input, step => {
      for (const result of step.commands.filter(row => row.kind === 'command-status-skill')) {
        observed.push(result);
        if (result.missing) {
          const owner = battle.copyState().slots[result.handle.slot];
          assert.deepEqual([owner.recordIndex, owner.phase, owner.cursor], [1, 0, commands[1].argumentOffset]);
        }
      }
      mp.push(...step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'MP'));
      return step.manager.kind === 'battle-round-drained';
    });
    assert.equal(observed.length, 2);
    assert.equal(observed[0].completion.kind, 'command-next');
    assert.equal(observed[0].handle, observed[1].handle);
    assert.equal(observed[0].attachedRID, undefined);
    assert.deepEqual(mp.map(row => [row.slot, row.before, row.value]), [[0, 10, 8]]);
    assert.equal(battle.copyState().bodies.bodies[10].dynamicFlags & 0x1000, 0x1000);
  });
});

test('SKL98 retains earlier registry swaps when a repeated selection finds the old slot vacant', async () => {
  await withBattle(battle => {
    const input = motion(skill(7, 0, [0, 0, 10]) + skill(6, 5, [10], 2));
    const observed = [];
    play(battle, input, (step, current) => {
      for (const result of step.commands.filter(row => row.kind === 'command-status-skill')) {
        observed.push(result);
        if (result.missing) {
          const bodies = battle.copyState().bodies.bodies;
          assert.deepEqual(result.missing, { slot: 0, role: 'target' });
          assert.deepEqual(result.swaps, [{ fromSlot: 0, toSlot: 5, movePair: false }]);
          assert.equal(current.localSlot, 5);
          assert.equal(bodies[0], null);
          assert.deepEqual(bodies[5].position, game.LEGACY_GAME_BATTLE_SLOT_LAYOUT[0].target);
          assert.equal(bodies[10].actionWrite, -1);
        }
      }
      return step.manager.kind === 'battle-round-drained';
    });
    assert.equal(observed.length, 2);
    assert.equal(observed[0].completion.kind, 'command-released');
    assert.notEqual(observed[0].handle, observed[1].handle);
    const caster = battle.copyState().bodies.bodies[5];
    assert.equal(Buffer.from(caster.nameBytes).toString(), 'Caster');
    assert.deepEqual(caster.position, game.LEGACY_GAME_BATTLE_SLOT_LAYOUT[5].target);
    assert.equal(caster.vitals[2], 8);
  });
});

test('SKL98 missing caster and missing helper advance without activating the interrupted spell', async () => {
  for (const [record, busy] of [[skill(6, 11, [10]), 0], [skill(13, 0, [11, 10, 0, 12]), 1]]) await withBattle(battle => {
    play(battle, motion(record + 'CFP|1|2|'), step => {
      const result = step.commands.find(row => row.kind === 'command-mp-cost');
      if (!result) return false;
      const bodies = battle.copyState().bodies.bodies;
      assert.deepEqual([bodies[0].busy, bodies[0].actionWrite, bodies[0].vitals[2]], [busy, -1, 10]);
      assert.deepEqual([bodies[1].vitals[2], bodies[10].vitals[0]], [8, 70]);
      return true;
    });
  });
});

test('SKL98 late missing target waits 7201 times before the source return actions settle the round', async () => {
  await withBattle(battle => {
    const input = motion(skill(13, 0, [1, 10, 0, 12, 11, 0, 12]));
    let waiting = 0, recovered = false;
    play(battle, input, step => {
      const result = step.manager.wait;
      if (step.manager.kind === 'manager-waiting') waiting++;
      if (result?.recovered.length) {
        assert.equal(waiting, 7201);
        assert.deepEqual(result.recovered, [0, 1, 10]);
        recovered = true;
      }
      return step.manager.kind === 'battle-round-drained';
    }, 7500);
    assert.equal(recovered, true);
    const bodies = battle.copyState().bodies.bodies;
    assert.deepEqual([bodies[0].vitals[2], bodies[10].vitals[0]], [10, 70]);
    assert.equal(bodies[1].busy, 0);
  });
});

test('SKL98 assist FF completes a terminal round without a queued caster or phantom wait', async () => {
  for (const variant of [12, 13]) await withBattle(battle => {
    const input = motion(skill(variant, 0, []));
    const [record] = game.decodeLegacyGameBattleMotion(input).commands;
    assert.deepEqual([record.principalSlot, record.dependencyMask, record.nextOffset, record.groupAdvance], [255, 1, input.length, true]);
    const observed = [];
    play(battle, input, step => {
      assert.notEqual(step.manager.kind, 'manager-waiting');
      assert.equal(step.body.events.some(row => row.kind === 'battle-vital'), false);
      observed.push(...step.commands.filter(row => row.kind === 'command-status-skill'));
      return step.manager.kind === 'battle-round-drained';
    });
    assert.equal(observed.length, 1);
    const result = observed[0];
    assert.deepEqual([result.variant, result.assistSlot, result.assistTerminator, result.hits, result.completion.kind],
      [variant, 255, true, 0, 'command-released']);
    assert.deepEqual(result.actors, []);
    const caster = battle.copyState().bodies.bodies[0];
    assert.deepEqual([caster.busy, caster.state, caster.actionWrite, caster.tupleWrite, caster.vitals], [0, 0, -1, 0, [70, 100, 10, 10]]);
  });
});

test('two SKL98 FF records on one owner continue at the second argument boundary', async () => {
  await withBattle(battle => {
    const input = motion(skill(12, 0, []) + skill(13, 1, []));
    const records = game.decodeLegacyGameBattleMotion(input).commands;
    const observed = [];
    play(battle, input, step => {
      for (const result of step.commands.filter(row => row.kind === 'command-status-skill')) {
        assert.equal(result.assistTerminator, true);
        observed.push(result);
        if (result.completion.kind === 'command-next') {
          const owner = battle.copyState().slots[result.handle.slot];
          assert.deepEqual([owner.recordIndex, owner.phase, owner.cursor], [1, 0, records[1].argumentOffset]);
        }
      }
      return step.manager.kind === 'battle-round-drained';
    });
    assert.deepEqual(observed.map(row => [row.principal, row.variant, row.completion.kind]), [[0, 12, 'command-next'], [1, 13, 'command-released']]);
    assert.equal(observed[0].handle, observed[1].handle);
  });
});

test('SKL98 assist FF leaves a following death-flag RID0 and its dependencies on a separate command', async () => {
  const rid = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
  for (const variant of [12, 13]) await withBattle(battle => {
    const input = motion(skill(variant, 0, []) + rid + skill(6, 0, [10], 2));
    const records = game.decodeLegacyGameBattleMotion(input).commands;
    assert.deepEqual(records.map(row => [row.token, row.principalSlot, row.dependencyMask, row.attachedRID]),
      [['SKL', 255, 1, 0], ['RID', 5, 33, 0], ['SKL', 0, 1025, 0]]);
    assert.equal(records[0].nextOffset, records[1].tokenOffset);
    assert.equal(records[1].nextOffset, records[2].tokenOffset);
    let sawRID = false;
    const observed = [], mp = [];
    play(battle, input, step => {
      const state = battle.copyState();
      sawRID ||= state.slots.some(owner => owner?.records[0].token === 'RID');
      observed.push(...step.commands.filter(row => row.kind === 'command-status-skill'));
      mp.push(...step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'MP'));
      return step.manager.kind === 'battle-round-drained';
    });
    assert.equal(sawRID, true);
    assert.deepEqual(observed.map(row => row.assistTerminator ?? false), [true, false]);
    assert.notEqual(observed[0].handle, observed[1].handle);
    assert.deepEqual(mp.map(row => [row.slot, row.before, row.value]), [[0, 10, 8]]);
  });
});

test('SKL98 keeps assist FF distinct from an empty target list and requires decoded ownership to complete it', () => {
  const get = slot => slot <= 1 ? { vitals: [70, 100, 10, 10] } : null;
  const parse = record => game.decodeLegacyGameBattleMotion(motion(record)).commands[0];
  const terminator = parse(skill(12, 0, []));
  assert.equal(game.planBattleStatusSkill(terminator, get, 0, 0).reason, 'status-skill-assist-slot');
  assert.equal(game.planBattleStatusSkill({ ...terminator }, get, 0, 0, true).reason, 'status-skill-assist-slot');
  assert.equal(game.planBattleStatusSkill(terminator, get, 0, 0, true).kind, 'status-skill-assist-terminator');
  assert.equal(game.planBattleStatusSkill(parse(skill(12, 0, [1])), get, 0, 0, true).reason, 'status-skill-assist-empty-impact');
  assert.equal(game.planBattleStatusSkill(parse(skill(13, 0, [1])), get, 0, 0, true).kind, 'status-skill-plan');
});

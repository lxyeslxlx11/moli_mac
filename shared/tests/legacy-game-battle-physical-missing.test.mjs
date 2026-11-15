import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as game from '../index.mjs';
import { createLegacyGameBattleExit } from '../legacy-game-battle-exit.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';
import { projectileAssets } from '../../analysis/game-battle-physical-projectiles-v1/original_assets.mjs';
import { actorTransitionAssets } from '../../analysis/game-battle-shared-storage-v1/actor-transitions-fixture.mjs';
import { rid0FallAssets } from '../../analysis/game-legacy-battle-rid0-ownership-v1/fixture.mjs';

const context = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const vitals = [70, 100, 10, 10];
const fixture = statusSlotFiles();
const base = JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json', import.meta.url)));
const projectileVectors = JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-projectiles-v1/original-vectors.json', import.meta.url)));
const projectiles = projectileAssets(base, projectileVectors);
const selfVectors = JSON.parse(readFileSync(new URL('../../analysis/game-battle-self-physical-v1/original-vectors.json', import.meta.url)));
const nestedVectors = JSON.parse(readFileSync(new URL('../../analysis/game-battle-nested-physical-v1/original-vectors.json', import.meta.url)));
const classes = [0, 1, 3, 5, 6, 72, 73, 75, 76, 77, 78, 79, 80, 81, 84, 85, 87, 94, 95, 96, 105, 110, 113, 257, 258, 259, 260, 262, 266];
const record = (category, variant, fields, level = 1) => 'SKL|' +
  [category * 100 + level, 3, variant, ...fields, 255].map(n => n.toString(16).toUpperCase()).join('|') + '|';
const motion = records => Uint8Array.from('M|' + records, c => c.charCodeAt(0));
const command = records => game.decodeLegacyGameBattleMotion(motion(records)).commands[0];
const actions = body => [...body.actions.slice(0, body.actionWrite + 1)];
const snapshot = battle => battle.copyState().bodies.bodies;

async function withBattle(run, { assets = fixture, slots = [0, 1, 10], actorResource = 100060, mountedSlots = [] } = {}) {
  const files = originalFiles(assets);
  const library = game.createLegacyGameResourceLibrary({
    plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral',
  });
  const battle = game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    const { animations, graphics } = library.catalogs();
    battle.configureBodyPlayback({ animations, geometry: library.geometry,
      seed: 12345, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const slot of slots) battle.applyCharacter(slot, 0, actorResource, [mountedSlots.includes(slot) ? 100060 : 0, 0], vitals);
    return await run(battle);
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

function first(battle, records) {
  battle.load(motion(records), { ...context, substate: 5 });
  const { created } = battle.callManager(context);
  assert.equal(created.length, 1);
  for (let step = 0; step < 24; step++) {
    const result = battle.callCommand(created[0], context);
    if (result.kind !== 'command-delay') return result;
  }
  assert.fail('The physical command did not leave its delay');
}

function stepUntil(battle, accept, limit = 200) {
  for (let pass = 0; pass < limit; pass++) {
    const step = battle.callCallbacks(context);
    assert.deepEqual(step.commands.filter(row => row.kind === 'command-unavailable'), []);
    assert.deepEqual(step.body.results.filter(row => row.result.endsWith('unavailable')), []);
    if (accept(step, pass)) return;
  }
  assert.fail('The physical recovery did not reach the expected playback state');
}

test('the 29 pair categories distinguish the first attacker and the first target before cost', async () => {
  assert.deepEqual(classes, game.LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.classes);
  for (const category of classes) {
    const extra = [81, 94].includes(category) ? [3] : [];
    await withBattle(battle => {
      const result = first(battle, record(category, 0, [11, 10, 0, 12, ...extra]));
      assert.equal(result.kind, 'command-released', String(category));
      assert.deepEqual(snapshot(battle).filter(Boolean).map(body => [body.busy, body.actionWrite, body.vitals]),
        [[0, -1, vitals], [0, -1, vitals], [0, -1, vitals]]);
    });
    await withBattle(battle => {
      const result = first(battle, record(category, 0, [0, 11, 0, 12, ...extra]));
      assert.equal(result.completion?.kind, 'command-released', String(category));
      assert.deepEqual(result.missing, { slot: 11, role: 'target', point: 'first-pair' });
      assert.equal(result.hits, 0);
      const [caster] = snapshot(battle);
      assert.deepEqual([caster.busy, caster.state, caster.actionWrite, caster.tupleWrite, caster.mpCost, caster.vitals],
        [1, 0, -1, 0, 0, vitals]);
      if (category === 105) assert.equal(caster.afterImageEnabled, 1);
      if (category === 258) assert.deepEqual(caster.rememberedPosition, [318, 270]);
    });
  }
});

test('late attacker and target absence both write the released return queue and preserve busy ownership', async () => {
  for (const [actor, target, role] of [[11, 10, 'attacker'], [1, 11, 'target']]) await withBattle(battle => {
    const result = first(battle, record(0, 0, [0, 10, 1, 12, actor, target, 1, 7]));
    assert.equal(result.completion?.kind, 'command-released');
    assert.deepEqual(result.missing, { slot: 11, role, point: 'later-pair' });
    assert.equal(result.hits, 1);
    const bodies = snapshot(battle);
    assert.deepEqual([bodies[0].state, actions(bodies[0]), bodies[0].tupleWrite, bodies[0].vitals], [7, [7, 11, 10], 0, vitals]);
    assert.deepEqual([bodies[10].busy, actions(bodies[10]), bodies[10].vitals], [1, [], vitals]);
    assert.equal(bodies[1].busy, 0);
  }, { assets: projectiles });
});

const sharedGuardPrefix = [0, 10, 0x201, 0, 1, 10, 0x201, 7, 1];
const missingLookaheadCases = [
  { records: record(72, 0, [...sharedGuardPrefix, 1, 11, 0x11, 1, 1, 10, 0x11, 2]),
    guard: 1, target: 11, hits: 1, slots: [0, 1, 10, 11] },
  { records: record(72, 0, [...sharedGuardPrefix, 1, 11, 0x211, 0, 2, 2, 12, 0x11, 2]),
    guard: 2, target: 12, hits: 2, slots: [0, 1, 2, 10, 11, 12] },
  { records: record(113, 0, [0, 10, 0x200, 0, 1, 1, 11, 0x11, 1]),
    guard: 1, target: 11, hits: 1, slots: [0, 1, 10, 11] },
];
const nestedAssets = projectileAssets(base, nestedVectors);

test('a missing look-ahead target keeps the planned turn and only plays the released return', async () => {
  for (const { records, guard, target, hits, slots } of missingLookaheadCases) {
    await withBattle(battle => {
      const input = command(records);
      const plan = game.planBattlePhysicalFamily(input, slot => snapshot(battle)[slot], 0, 0, true);
      const missing = { slot: target, role: 'target', point: 'later-pair' };
      assert.deepEqual(plan.missing, missing);
      assert.equal(plan.hits.length, hits);
      assert.equal(plan.discardedPrefixMask, input.dependencyMask);
      const turn = plan.rows.find(row => row.slot === guard);
      assert.ok(turn.actions.includes(3));
      assert.deepEqual(turn.tuples.find(tuple => tuple[0] === target), [target, 0, 0, 0]);
      assert.equal(plan.rows.some(row => row.slot === target), false);
      assert.equal(plan.guardHandoffs, undefined);
      assert.equal(plan.followingStrikes, undefined);

      const result = first(battle, records);
      assert.deepEqual([result.kind, result.missing, result.hits, result.completion.kind],
        ['command-strike', missing, hits, 'command-released']);
      const bodies = snapshot(battle);
      assert.deepEqual([bodies[0].state, actions(bodies[0])], [7, [7, 11, 10]]);
      assert.deepEqual([bodies[guard].busy, actions(bodies[guard]), bodies[guard].tupleWrite], [0, [], 0]);
      stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
      for (const body of snapshot(battle).filter(Boolean)) {
        assert.equal(body.busy, 0);
        assert.deepEqual(body.vitals, vitals);
      }
    }, { assets: nestedAssets, slots: slots.filter(slot => slot !== target) });
  }
});

test('missing look-ahead recovery requires an owned command and a queue that cleanup can clear', () => {
  const { records, guard, target } = missingLookaheadCases[0];
  const input = command(records);
  const get = slot => slot === target ? null : { vitals, dynamicFlags: 0, state: 0 };
  assert.equal(game.planBattlePhysicalFamily(input, get, 0, 0).reason, 'physical-family-actor-absent');
  assert.equal(game.planBattlePhysicalFamily({ ...input }, get, 0, 0, true).reason, 'physical-family-actor-absent');
  for (const kept of [{ dynamicFlags: 2 }, { state: 13 }]) {
    const withKeptGuard = slot => slot === guard ? { ...get(slot), ...kept } : get(slot);
    assert.equal(game.planBattlePhysicalFamily(input, withKeptGuard, 0, 0, true).reason, 'physical-family-lookahead-context');
  }
  const later = command(record(72, 0, [...sharedGuardPrefix, 2, 10, 0x11, 1, 1, 11, 0x11, 2]));
  assert.equal(game.planBattlePhysicalFamily(later, slot => slot === 2 ? null : get(slot), 0, 0, true).reason,
    'physical-family-lookahead-context');
});

test('a preceding PLV removes the look-ahead target and the grouped CFP alone changes MP', async () => {
  const assets = actorTransitionAssets(nestedAssets);
  for (const { records, target, hits, slots } of missingLookaheadCases.slice(0, 2)) {
    await withBattle(battle => {
      battle.load(motion(`PLV|${target.toString(16).toUpperCase()}|${records}CFP|0|2|`), { ...context, substate: 5 });
      let strike, cost;
      const events = [];
      stepUntil(battle, step => {
        strike ??= step.commands.find(row => row.kind === 'command-strike');
        cost ??= step.commands.find(row => row.kind === 'command-mp-cost');
        events.push(...step.body.events.filter(row => row.kind === 'battle-vital'));
        if (strike) assert.equal(snapshot(battle)[target], null);
        return step.manager.kind === 'battle-round-drained';
      }, 400);
      assert.deepEqual([strike.hits, strike.missing.slot, strike.completion.kind, strike.completion.token],
        [hits, target, 'command-next', 'CFP']);
      assert.equal(cost.handle, strike.handle);
      assert.deepEqual(events.map(row => [row.slot, row.field, row.before, row.value]), [[0, 'MP', 10, 8]]);
      assert.deepEqual(snapshot(battle).filter(Boolean).map(body => [body.slot, body.busy, body.vitals[0]]),
        slots.filter(slot => slot !== target).map(slot => [slot, 0, 70]));
    }, { assets, slots });
  }
});

const idleAttackerRound = recipient => record(72, 0, [
  ...sharedGuardPrefix, 1, 11, 0x11, 1, 2, recipient, 0x11, 3, 1, 10, 0x11, 2,
]) + 'CFP|0|2|';
const idleAttackerFixture = { assets: nestedAssets, slots: [0, 1, 2, 10, 11, 12] };

test('the return fallback can recover an idle attacker after live guard queues have finished or reached a wait', async () => {
  for (const recipient of [12, 1]) {
    await withBattle(battle => {
      const records = idleAttackerRound(recipient), skill = command(records);
      const get = slot => snapshot(battle)[slot];
      assert.deepEqual(game.planBattlePhysicalFamily(skill, get, 0, 0).idleAttackerSlots, [2]);
      assert.equal(game.planBattlePhysicalFamily({ ...skill }, get, 0, 0).idleAttackerSlots, undefined);
      const strike = first(battle, records);
      assert.deepEqual([strike.kind, strike.hits], ['command-strike', 4]);
      let before = snapshot(battle), cost;
      const recoveries = [], events = [];
      stepUntil(battle, step => {
        for (const result of step.commands) {
          if (result.wait?.recovered.length) {
            assert.equal(before[0].busy, 0);
            assert.equal(before[2].actions[0], 24);
            assert.deepEqual([before[2].state, before[2].actionRead, before[2].tupleRead], [0, 0, 0]);
            assert.ok(before.filter(Boolean).every(body => body.state === 0));
            recoveries.push([result.wait.recovery, result.wait.recovered]);
          }
          if (result.kind === 'command-mp-cost') cost = result;
        }
        events.push(...step.body.events.filter(row => row.kind === 'battle-vital'));
        before = snapshot(battle);
        return step.manager.kind === 'battle-round-drained';
      }, 1200);
      assert.deepEqual(recoveries, [['idle-attacker', recipient === 12 ? [0, 1, 2, 10, 11, 12] : [0, 1, 2, 10, 11]]]);
      assert.equal(cost.handle, strike.handle);
      const hits = [[1, 'HP', 70, 63], [11, 'HP', 70, 69]];
      if (recipient === 12) hits.push([10, 'HP', 70, 68]);
      assert.deepEqual(events.map(row => [row.slot, row.field, row.before, row.value]),
        [[0, 'MP', 10, 7], ...hits, [0, 'MP', 7, 5]]);
      assert.ok(before.filter(Boolean).every(body => !body.busy));
      assert.deepEqual([before[2].vitals, before[12].vitals], [vitals, vitals]);
    }, idleAttackerFixture);
  }
});

const lateRecipientRound = (tail = [], innerGuard = 1, incoming = [0x11, 2], attached = '') => record(72, 0, [
  ...sharedGuardPrefix.slice(0, -1), innerGuard, 1, 11, 0x11, 1, 2, 12, 0x11, 3, 1, 2, ...incoming, ...tail,
]) + attached + 'CFP|0|2|';

test('an early hit advances the idle attack head and releases its recorded wait after the outgoing strike', async () => {
  await withBattle(battle => {
    const records = lateRecipientRound(), skill = command(records), get = slot => snapshot(battle)[slot];
    const plan = game.planBattlePhysicalFamily(skill, get, 0, 0);
    assert.equal(plan.idleAttackerSlots, undefined);
    assert.deepEqual(plan.lateReceiveSlots, [2]);
    assert.equal(game.planBattlePhysicalFamily({ ...skill }, get, 0, 0).lateReceiveSlots, undefined);
    const occupied = slot => slot === 2 ? { ...get(slot), busy: 1 } : get(slot);
    assert.equal(game.planBattlePhysicalFamily(skill, occupied, 0, 0).lateReceiveSlots, undefined);
    const strike = first(battle, records);
    let before = snapshot(battle)[2], cost, advanced = false, released = false;
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      const after = snapshot(battle)[2];
      const vitals = step.body.events.filter(row => row.kind === 'battle-vital');
      if (vitals.some(row => row.slot === 2 && row.field === 'HP')) {
        assert.deepEqual([before.state, before.actionRead, before.tupleRead, before.actions[0]], [0, 0, 0, 24]);
        assert.deepEqual([after.state, after.actionRead, after.tupleRead], [3, 1, 0]);
        advanced = true;
      }
      if (before.state === 0 && before.actionRead === 5) {
        assert.deepEqual([after.state, after.actionRead, after.tupleRead], [26, 6, 1]);
        assert.equal(vitals.length, 0);
        released = true;
      }
      cost ??= step.commands.find(row => row.kind === 'command-mp-cost');
      events.push(...vitals);
      before = after;
      return step.manager.kind === 'battle-round-drained';
    }, 1200);
    assert.ok(advanced && released);
    assert.equal(cost.handle, strike.handle);
    assert.deepEqual(events.map(row => [row.slot, row.field, row.before, row.value]), [
      [0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69], [2, 'HP', 70, 68], [12, 'HP', 70, 67], [0, 'MP', 7, 5],
    ]);
  }, idleAttackerFixture);
});

test('repeated incoming hits reserve one idle start and consume the other receive wait normally', async () => {
  for (const [sender, innerGuard, expected] of [
    [1, 1, [[1, 63], [11, 69], [2, 68], [12, 67], [2, 64]]],
    [3, 3, [[3, 63], [11, 69], [2, 66], [12, 67], [2, 64]]],
  ]) await withBattle(battle => {
    first(battle, lateRecipientRound([sender, 2, 0x11, 4], innerGuard));
    const hits = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      hits.push(...step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'HP').map(row => [row.slot, row.value]));
      return step.manager.kind === 'battle-round-drained';
    }, 1300);
    assert.deepEqual(hits, expected);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
  }, { ...idleAttackerFixture, slots: [0, 1, 2, 3, 10, 11, 12] });
});

test('early hit receipts survive sender departure and are retired on replacement of the recipient', async () => {
  for (const [slot, when, expected] of [
    [1, 'hit', [[1, 63], [11, 69], [2, 68], [12, 67]]],
    [2, 'hit', [[1, 63], [11, 69], [2, 68]]],
    [12, 'hit', [[1, 63], [11, 69], [2, 68]]],
    [3, 'claim', [[3, 63], [11, 69], [2, 68], [12, 67]]],
  ]) await withBattle(battle => {
    const records = when === 'claim' ? lateRecipientRound([3, 2, 0x11, 4], 3) : lateRecipientRound();
    first(battle, records);
    let departed = false;
    const replacement = [51, 100, 4, 10], hits = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      const events = step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'HP');
      hits.push(...events.map(row => [row.slot, row.value]));
      const sender = snapshot(battle)[slot];
      const claiming = sender.state === 3 && sender.tuples[sender.tupleRead * 4] === 2 &&
        sender.tuples[sender.tupleRead * 4 + 1] !== 0;
      if (!departed && (when === 'claim' ? claiming : events.some(row => row.slot === 2))) {
        battle.removeCharacter(slot);
        battle.applyCharacter(slot, 0, 100060, [0, 0], replacement);
        departed = true;
      }
      return step.manager.kind === 'battle-round-drained';
    }, 1300);
    assert.ok(departed);
    assert.deepEqual(hits, expected);
    assert.deepEqual(snapshot(battle)[slot].vitals, replacement);
  }, { ...idleAttackerFixture, slots: [0, 1, 2, 3, 10, 11, 12] });
});

const lateResultFixture = { ...idleAttackerFixture, actorResource: 100080, assets: actorTransitionAssets(nestedAssets) };
const inlineRID = [100060, 100060, 100060];
const hpAndMp = events => events.filter(row => row.kind === 'battle-vital')
  .map(row => [row.slot, row.field, row.before, row.value]);

test('final physical result priority advances the original idle recipient with or without inline RIDs', async () => {
  for (const [bits, reaction, result] of [
    [0, 26, [[2, 'HP', 70, 68]]],
    [0x2000, 119, [[1, 'HP', 63, 61]]],
    [0x4000, 120, [[2, 'HP', 70, 72]]],
    [0x6000, 120, [[2, 'HP', 70, 72]]],
    [0x8000, 121, []],
    [0xa000, 121, []],
    [0xc000, 121, []],
    [0xe000, 121, []],
  ]) for (const inline of [false, true]) await withBattle(battle => {
    const records = lateRecipientRound([], 1, [bits | 0x11 | (inline ? 0x800000 : 0), 2, ...(inline ? inlineRID : [])]);
    const plan = game.planBattlePhysicalFamily(command(records), slot => snapshot(battle)[slot], 0, 0);
    const strike = plan.followingStrikes.find(row => row.actor === 1 && row.slot === 2);
    assert.deepEqual(plan.lateReceiveSlots, [2]);
    assert.equal(strike.tupleEnd - strike.tuple, inline ? 3 : 0);
    assert.equal(strike.last - strike.resultAction, bits === 0x2000 ? 1 : 0);
    assert.equal(first(battle, records).kind, 'command-strike');
    let prior = snapshot(battle)[2], advanced = false, released = false;
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      const next = snapshot(battle)[2], changes = hpAndMp(step.body.events);
      if (prior.state === 0 && prior.actionRead === 0 && next.actionRead === 1) {
        assert.equal(next.tupleRead, 0);
        assert.deepEqual(changes, result);
        advanced = true;
      }
      if (prior.state === 0 && prior.actionRead === strike.wait) {
        assert.deepEqual([next.state, next.actionRead], [reaction, strike.wait + 1]);
        assert.deepEqual(changes, []);
        released = true;
      }
      events.push(...changes);
      prior = next;
      return step.manager.kind === 'battle-round-drained';
    }, 1200);
    assert.ok(advanced && released);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69],
      ...result, [12, 'HP', 70, 67], [0, 'MP', 7, 5]]);
    const nodes = battle.copyState().playback.nodes;
    const metadataOwner = nodes.find(node => node.slot === (bits & 0x2000 ? 1 : 2));
    const children = nodes.filter(node => node.kind === 'rider' || node.kind === 'attachment');
    assert.equal(children.length, inline ? 2 : 0);
    assert.ok(children.every(node => !node.deleted && node.parentId === metadataOwner.id));
  }, lateResultFixture);
});

test('a resource change can restart action 14 without repeating inline metadata or losing the next strike', async () => {
  await withBattle(battle => {
    const records = lateRecipientRound([1, 11, 0x11, 4], 1, [0x806011, 2, ...inlineRID]);
    const plan = game.planBattlePhysicalFamily(command(records), slot => snapshot(battle)[slot], 0, 0);
    const strike = plan.followingStrikes.find(row => row.actor === 1 && row.slot === 2);
    first(battle, records);
    const events = [], signals = [];
    let prior = snapshot(battle)[1];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      events.push(...hpAndMp(step.body.events));
      if (prior.state === 14 && prior.actionRead === strike.resultAction) {
        signals.push(...step.body.events.filter(row => row.kind === 'signal' && row.slot === 1)
          .map(() => prior.tupleRead));
      }
      prior = snapshot(battle)[1];
      return step.manager.kind === 'battle-round-drained';
    }, 1200);
    assert.deepEqual(signals, [strike.tuple, strike.tupleEnd]);
    assert.equal(prior.resourceId, 100060);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69],
      [2, 'HP', 70, 72], [12, 'HP', 70, 67], [11, 'HP', 69, 65], [0, 'MP', 7, 5]]);
  }, lateResultFixture);
});

test('departure during an inline result skips its full tuple span and retains the next strike', async () => {
  for (const [flags, duringCharge, landed] of [
    [0x802011, true, []],
    [0x802011, false, [[1, 'HP', 63, 61]]],
    [0x804011, false, [[2, 'HP', 70, 72]]],
  ]) await withBattle(battle => {
    const records = lateRecipientRound([1, 11, 0x11, 4], 1, [flags, 2, ...inlineRID]);
    const plan = game.planBattlePhysicalFamily(command(records), slot => snapshot(battle)[slot], 0, 0);
    const next = plan.followingStrikes.at(-1), replacement = [51, 100, 4, 10];
    assert.equal(first(battle, records).kind, 'command-strike');
    const original = battle.copyState().playback.nodes.find(node => node.slot === 2).id;
    const events = [];
    let departed = false, continued = false;
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      const changes = hpAndMp(step.body.events), sender = snapshot(battle)[1];
      const charging = sender.state === 157 && sender.actions[sender.actionRead] === 113 && sender.tuples[sender.tupleRead * 4] === 2;
      const delivered = landed.length > 0 && changes.some(row => row[0] === landed[0][0] && row[3] === landed[0][3]);
      if (!departed && (duringCharge ? charging : delivered)) {
        battle.removeCharacter(2);
        battle.applyCharacter(2, 0, 100080, [0, 0], replacement);
        departed = true;
      }
      if (departed && sender.actionRead === next.action && sender.tupleRead === next.tuple) continued = true;
      events.push(...changes);
      return step.manager.kind === 'battle-round-drained';
    }, 1200);
    assert.ok(departed && continued);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69],
      ...landed, [11, 'HP', 69, 65], [0, 'MP', 7, 5]]);
    const nodes = battle.copyState().playback.nodes, body = nodes.find(node => node.slot === 2);
    assert.notEqual(body.id, original);
    assert.ok(nodes.every(node => node.parentId !== body.id));
    assert.deepEqual(snapshot(battle)[2].vitals, replacement);
  }, lateResultFixture);
});

const attachedRID0 = (a, b, name = 'AfterSplit') =>
  `RID|0|${a.toString(16).toUpperCase()}|${b.toString(16).toUpperCase()}|0|${name}|186F0|186DC|1|29|64|8|A|0|SplitPet|186DC|2|0|64|6|A|2|`;
const attachedLateRecipient = (links, tail, incoming, innerGuard) => lateRecipientRound(tail, innerGuard, incoming,
  links.map(([a, b]) => attachedRID0(a, b)).join(''));
const handoffStarted = (step, slot) => step.body.events.some(row => row.kind === 'sound' && row.value === 0x1cf && row.slot === slot);

test('the original mounted recipient takes its result and attacks before appended RID0 handback', async () => {
  for (const [incoming, tail, oldHP, hits, later] of [
    [[0x11, 2], [], 68, [[2, 'HP', 70, 68]], []],
    [[0x802011, 2, ...inlineRID], [], 70, [[1, 'HP', 63, 61]], []],
    [[0xe011, 2], [], 70, [], []],
    [[0x806011, 2, ...inlineRID], [1, 11, 0x11, 4], 72, [[2, 'HP', 70, 72]], [[11, 'HP', 69, 65]]],
  ]) await withBattle(battle => {
    const original = battle.copyState().playback.nodes.find(node => node.slot === 2).id;
    const strike = first(battle, attachedLateRecipient([[2, 5]], tail, incoming));
    assert.equal(strike.attachedRID, 1);
    const staged = battle.copyState(), attached = staged.playback.attachedRID;
    const [handoff] = attached.handoffs;
    assert.equal(handoff.sourceId, original);
    assert.equal(attached.registry[2], original);
    assert.equal(attached.registry[5], null);
    assert.equal(staged.bodies.bodies[2].actions[staged.bodies.bodies[2].actionWrite], 221);
    assert.ok(attached.bodies.filter(node => [handoff.firstId, handoff.secondId].includes(node.id))
      .every(node => !node.callbackEnabled));
    let prior = staged.bodies.bodies[2], switched = false;
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      events.push(...hpAndMp(step.body.events));
      const current = battle.copyState();
      if (handoffStarted(step, 2)) {
        assert.deepEqual([prior.state, prior.vitals[0]], [221, oldHP]);
        assert.ok(events.some(row => row[0] === 12 && row[3] === 67));
        assert.equal(current.playback.attachedRID.registry[5], handoff.secondId);
        switched = true;
      }
      prior = current.bodies.bodies[2];
      return step.manager.kind === 'battle-round-drained';
    }, 1250);
    assert.ok(switched);
    const final = battle.copyState(), completed = final.playback.attachedRID;
    assert.deepEqual(events, [[0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69],
      ...hits, [12, 'HP', 70, 67], ...later, [0, 'MP', 7, 5]]);
    assert.equal(completed.handoffs[0].complete, true);
    assert.deepEqual(completed.handoffs[0].lastReadSlots, [2, 5]);
    assert.equal(completed.registry[2], handoff.firstId);
    assert.equal(completed.registry[5], null);
    assert.deepEqual(final.bodies.bodies[2].vitals, [41, 100, 8, 10]);
    assert.deepEqual(final.bodies.bodies[2].linkedResources, [0, 100060]);
  }, { ...lateResultFixture, mountedSlots: [2] });
});

test('RID0 same-slot handback and multiple mounted bodies keep their own received strikes', async () => {
  for (const [links, tail, guard, expected] of [
    [[[2, 2]], [], 1, [[1, 63], [11, 69], [2, 68], [12, 67]]],
    [[[2, 5], [1, 6]], [], 1, [[1, 63], [11, 69], [2, 68], [12, 67]]],
    [[[2, 5]], [3, 2, 0x11, 4], 3, [[3, 63], [11, 69], [2, 66], [12, 67], [2, 64]]],
  ]) await withBattle(battle => {
    const result = first(battle, attachedLateRecipient(links, tail, undefined, guard));
    assert.equal(result.attachedRID, links.length);
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      events.push(...hpAndMp(step.body.events));
      return step.manager.kind === 'battle-round-drained';
    }, 1250);
    const final = battle.copyState(), { handoffs, registry } = final.playback.attachedRID;
    assert.deepEqual(handoffs.map(row => row.lastReadSlots), links);
    assert.ok(handoffs.every((row, i) => row.complete && registry[links[i][0]] === row.firstId));
    assert.deepEqual(events.filter(row => row[1] === 'HP').map(row => [row[0], row[3]]), expected);
    assert.equal(final.bodies.bodies[0].vitals[2], 5);
  }, { ...lateResultFixture, slots: [...lateResultFixture.slots, 3], mountedSlots: links.map(row => row[0]) });
});

test('RID0 replacement releases an unreachable attack and preserves an already started attack', async () => {
  for (const parent of [0, 1]) await withBattle(battle => {
    first(battle, attachedLateRecipient([[parent, 2]]));
    const [handoff] = battle.copyState().playback.attachedRID.handoffs;
    const original = battle.copyState().playback.attachedRID.registry[2];
    let switched = false;
    const hits = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      if (handoffStarted(step, parent)) {
        const { registry, bodies } = battle.copyState().playback.attachedRID;
        assert.equal(registry[2], handoff.secondId);
        const retained = bodies.find(row => row.id === original);
        assert.equal(retained.callbackEnabled, true);
        assert.equal(retained.body.actionRead > 0, parent === 1);
        switched = true;
      }
      for (const [slot, field, , hp] of hpAndMp(step.body.events)) {
        if (field !== 'HP') continue;
        if (slot === 12) assert.ok(switched);
        hits.push([slot, hp]);
      }
      return step.manager.kind === 'battle-round-drained';
    }, 1250);
    assert.ok(switched);
    assert.deepEqual(hits, parent === 0 ? [[1, 63], [11, 69]] : [[1, 63], [11, 69], [2, 68], [12, 67]]);
    assert.equal(snapshot(battle)[0].vitals[2], parent === 0 ? 6 : 5);
    assert.equal(snapshot(battle)[2], null);
  }, { ...lateResultFixture, mountedSlots: [parent] });
});

const interruptedRID0 = (ending, successors, padding = '') => 'SKL|1C21|3|0|0|A|10|3|' + ending + 'FF|' + padding +
  attachedRID0(0, 5, 'AfterAbort') + successors;

test('an interrupted physical owner resumes only when its abort scan reaches the attached RID0', async () => {
  for (const [ending, successors, padding, admitted, expectedMP, costs] of [
    ['1|C|0|F|', 'CFP|0|2|', '', true, 8, []],
    ['1|C|0|F|', 'CFP|0|2|CFP|0|3|', '', true, 6, [[0, 'MP', 8, 6]]],
    ['C|1|0|F|', 'CFP|0|2|', '', true, 8, []],
    ['1|C|0|2|', 'CFP|0|2|', '|', true, 8, []],
    ['1|C|0|A1|', 'CFP|0|2|', '', false, 8, [[0, 'MP', 10, 8]]],
    ['1|C|0|2|', 'CFP|0|2|', '', false, 8, [[0, 'MP', 10, 8]]],
    ['1|C|0|F|', '', '', false, 10, []],
  ]) await withBattle(battle => {
    const records = interruptedRID0(ending, successors, padding);
    const strike = first(battle, records);
    assert.equal(strike.kind, 'command-strike');
    assert.equal(strike.attachedRID, admitted ? 1 : undefined);
    const queued = battle.copyState(), parent = queued.bodies.bodies[0];
    if (admitted) {
      assert.deepEqual(actions(parent), [7, 11, 10, 221]);
      const owner = queued.slots.find(row => row?.handle === strike.handle);
      assert.deepEqual([owner.type, owner.phase, owner.records.length], [0, 1, successors.match(/CFP/g).length]);
      assert.equal(queued.playback.attachedRID.registry[5], null);
    }
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      events.push(...hpAndMp(step.body.events));
      return step.manager.kind === 'battle-round-drained';
    }, 300);
    const final = battle.copyState();
    assert.deepEqual(events, costs);
    assert.deepEqual(final.bodies.bodies[0].vitals, [admitted ? 41 : 70, 100, expectedMP, 10]);
    assert.deepEqual(final.bodies.bodies[10].vitals, vitals);
    if (admitted) {
      assert.equal(final.playback.attachedRID.handoffs[0].complete, true);
      assert.equal(String.fromCharCode(...final.bodies.bodies[0].nameBytes), 'AfterAbort');
    } else assert.equal(final.playback.attachedRID, undefined);
  }, { ...lateResultFixture, slots: [0, 1, 10], mountedSlots: [0] });

  await withBattle(battle => {
    const result = first(battle, interruptedRID0('1|C|0|F|', 'CFP|0|2|'));
    assert.deepEqual([result.kind, result.reason], ['command-unavailable', 'attached-rid-rider-context']);
    const state = battle.copyState();
    assert.equal(state.playback.attachedRID, undefined);
    assert.deepEqual(state.bodies.bodies.filter(Boolean).map(row => [row.busy, row.actionWrite, row.vitals]),
      [[0, -1, vitals], [0, -1, vitals], [0, -1, vitals]]);
  }, { ...lateResultFixture, slots: [0, 1, 10] });
});

test('departure before action 221 releases both prepared bodies and the container for every pending RID0', async () => {
  for (const links of [[[2, 5]], [[2, 5], [2, 6]]]) await withBattle(battle => {
    first(battle, attachedLateRecipient(links, [1, 11, 0x11, 4], [0x804011, 2, ...inlineRID]));
    const handoffs = battle.copyState().playback.attachedRID.handoffs;
    assert.equal(handoffs.length, links.length);
    const prepared = new Set(handoffs.flatMap(row => [row.id, row.firstId, row.secondId]));
    const replacement = [51, 100, 4, 10];
    let departed = false;
    const events = [];
    stepUntil(battle, step => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      const sender = snapshot(battle)[1];
      if (!departed && sender.state === 157 && sender.actions[sender.actionRead] === 113 && sender.tuples[sender.tupleRead * 4] === 2) {
        battle.removeCharacter(2);
        battle.applyCharacter(2, 0, 100080, [0, 0], replacement);
        departed = true;
      }
      events.push(...hpAndMp(step.body.events));
      return step.manager.kind === 'battle-round-drained';
    }, 1250);
    assert.ok(departed);
    const final = battle.copyState();
    assert.deepEqual(final.playback.attachedRID.handoffs, []);
    assert.ok(final.playback.nodes.every(node => !prepared.has(node.id)));
    assert.deepEqual(final.bodies.bodies[2].vitals, replacement);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [1, 'HP', 70, 63], [11, 'HP', 70, 69],
      [11, 'HP', 69, 65], [0, 'MP', 7, 5]]);
  }, { ...lateResultFixture, mountedSlots: [2] });
});

test('an interrupted RID0 appended to an idle body waits for the physical return queue', async () => {
  for (const [prefix, parked, running, successors, recovered, costs] of [
    ['0|C|0|F|FF|', 0, false, 'CFP|0|2|CFP|0|3|', [0], [[0, 'MP', 10, 8]]],
    ['C|1|0|F|FF|', 1, false, 'CFP|C|2|', [1], []],
    ['0|A|10|3|1|C|0|F|FF|', 1, false, 'CFP|0|2|', [0, 1, 10], []],
    ['0|A|10|3|1|C|0|F|FF|', 1, true, 'CFP|0|2|', [0, 1, 10], []],
  ]) await withBattle(battle => {
    const tail = (running ? attachedRID0(0, 5) : '') + attachedRID0(parked, 6);
    const launch = first(battle, 'SKL|1C21|3|0|' + prefix + tail + successors);
    assert.deepEqual([launch.kind, launch.attachedRID], ['command-strike', running ? 2 : 1]);
    const staged = battle.copyState();
    const original = staged.bodies.bodies[parked];
    const pending = staged.playback.attachedRID.handoffs.find(row => row.slots[0] === parked);
    assert.deepEqual([original.state, original.busy, actions(original)], [0, 1, [221]]);
    assert.equal(staged.playback.attachedRID.registry[parked], pending.sourceId);
    assert.equal(staged.playback.attachedRID.registry[6], null);
    assert.equal(staged.playback.nodes.filter(row => row.ridPresentation).length, running ? 2 : 1);
    const returns = [], events = [], splits = [];
    stepUntil(battle, (step, pass) => {
      for (const command of step.commands) {
        if (command.wait?.recovered.length) returns.push([pass + 1, command.wait.recovered]);
      }
      events.push(...hpAndMp(step.body.events));
      splits.push(...step.body.events.filter(row => row.kind === 'sound' && row.value === 0x1cf).map(row => row.slot));
      return step.manager.kind === 'battle-round-drained';
    }, 7300);
    assert.deepEqual(returns, [[7201, recovered]]);
    assert.deepEqual(events, costs);
    assert.deepEqual(splits, running ? [0] : []);
    const final = battle.copyState();
    const remaining = final.playback.attachedRID.handoffs;
    assert.deepEqual(remaining.map(row => [row.slots, row.complete]), running ? [[[0, 5], true]] : []);
    assert.equal(final.playback.attachedRID.registry[parked], pending.sourceId);
    assert.ok(final.playback.nodes.every(row => ![pending.id, pending.firstId, pending.secondId].includes(row.id)));
    assert.ok(final.playback.nodes.every(row => !row.ridPresentation));
    assert.deepEqual(final.bodies.bodies[parked].vitals, [70, 100, costs.length ? 8 : 10, 10]);
  }, { ...lateResultFixture, slots: [0, 1, 10], mountedSlots: running ? [0, 1] : [parked] });

  await withBattle(battle => {
    first(battle, 'SKL|1C21|3|0|C|A|0|F|FF|' + attachedRID0(1, 6) + 'CFP|C|2|');
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained', 30);
    assert.equal(battle.copyState().playback.attachedRID, undefined);
  }, { ...lateResultFixture, slots: [0, 1, 10], mountedSlots: [1] });
});

test('departure after action 221 registers B releases only pending allocations', async () => {
  const assets = rid0FallAssets(lateResultFixture.assets);
  const tail = 'RID|0|0|5|0|AfterAbort|186F0|186DC|1|0|64|8|A|2|SplitPet|186F1|2|23|64|6|A|0|';
  for (const replaceB of [false, true]) await withBattle(battle => {
    const launch = first(battle, 'SKL|1C21|3|0|0|A|10|3|1|C|0|F|FF|' + tail + 'CFP|0|2|');
    assert.equal(launch.attachedRID, 1);
    stepUntil(battle, step => handoffStarted(step, 0));
    const begun = battle.copyState();
    const [handoff] = begun.playback.attachedRID.handoffs;
    assert.deepEqual([handoff.complete, handoff.firstPointer, handoff.secondPointer],
      [false, handoff.firstId, null]);
    assert.deepEqual([begun.playback.attachedRID.registry[0], begun.playback.attachedRID.registry[5]],
      [handoff.sourceId, handoff.secondId]);
    assert.equal(begun.bodies.bodies[5].state, 1);
    battle.removeCharacter(0);
    battle.applyCharacter(0, 0, 100080, [0, 0], [51, 100, 4, 10]);
    if (replaceB) {
      battle.removeCharacter(5);
      battle.applyCharacter(5, 0, 100080, [0, 0], [59, 100, 3, 10]);
    }
    const returns = [];
    stepUntil(battle, (step, pass) => {
      assert.ok(!step.body.events.some(row => row.kind === 'sound' && row.value === 0x1c9));
      for (const command of step.commands) {
        if (command.wait?.recovered.length) returns.push(command.wait.recovered);
      }
      if (pass === 0) {
        const state = battle.copyState();
        assert.deepEqual(state.playback.attachedRID.handoffs, []);
        assert.ok(state.playback.nodes.every(row => ![handoff.id, handoff.firstId, handoff.sourceId].includes(row.id)));
        assert.equal(state.playback.attachedRID.registry[5] === handoff.secondId, !replaceB);
        assert.equal(state.bodies.bodies[5].state, replaceB ? 0 : 1);
      }
      return step.manager.kind === 'battle-round-drained';
    }, 7300);
    const final = battle.copyState();
    assert.deepEqual(returns, replaceB ? [] : [[0, 1, 5, 10]]);
    assert.deepEqual(final.bodies.bodies[0].vitals, [51, 100, 4, 10]);
    assert.deepEqual(final.bodies.bodies[5].vitals, replaceB ? [59, 100, 3, 10] : [35, 100, 6, 10]);
    assert.equal(final.bodies.bodies[5].busy, 0);
    assert.equal(final.playback.attachedRID.registry[5] === handoff.secondId, !replaceB);
  }, { ...lateResultFixture, assets, slots: [0, 1, 10], mountedSlots: [0] });
});

test('a multi-frame RID0 fall keeps its rider and resolves the current B slot', async () => {
  const assets = rid0FallAssets(lateResultFixture.assets);
  for (const bSlot of [0, 5]) for (const change of ['normal', 'missing', 'replaced']) await withBattle(battle => {
    const tail = `RID|0|0|${bSlot}|0|AfterAbort|186F0|186DC|1|29|64|8|A|0|SplitPet|186F1|2|0|64|6|A|2|`;
    const launch = first(battle, 'SKL|1C21|3|0|0|A|10|3|1|C|0|F|FF|' + tail + 'CFP|0|2|');
    assert.equal(launch.attachedRID, 1);
    stepUntil(battle, step => handoffStarted(step, 0));
    const begun = battle.copyState(), [handoff] = begun.playback.attachedRID.handoffs;
    const rider = begun.playback.nodes.find(node => node.kind === 'rider' && node.parentId === handoff.sourceId);
    assert.deepEqual([handoff.complete, handoff.firstPointer, handoff.secondPointer],
      [false, handoff.firstId, null]);
    assert.deepEqual([rider.deleted, rider.state, rider.counter], [false, 1, 1]);
    assert.equal(begun.playback.attachedRID.registry[bSlot], handoff.secondId);
    if (change !== 'normal') battle.removeCharacter(bSlot);
    let replacementId;
    if (change === 'replaced') {
      battle.applyCharacter(bSlot, 0, 100080, [0, 0], [59, 100, 3, 10], 0, 0, Uint8Array.of(78, 101, 119, 66));
      replacementId = battle.copyState().playback.attachedRID.registry[bSlot];
      assert.notEqual(replacementId, handoff.secondId);
    }
    const landing = [], events = [];
    stepUntil(battle, (step, pass) => {
      assert.ok(step.commands.every(row => !row.wait?.recovered.length));
      events.push(...hpAndMp(step.body.events));
      if (step.body.events.some(row => row.kind === 'sound' && row.value === 0x1c9)) landing.push(pass + 1);
      if (change === 'normal' && pass < 8) {
        const active = battle.copyState().playback;
        const falling = active.nodes.find(node => node.id === rider.id);
        assert.deepEqual([falling.deleted, falling.state, falling.counter], [false, 1, pass + 2]);
        assert.equal(active.attachedRID.registry[bSlot], handoff.secondId);
        assert.equal(active.attachedRID.handoffs[0].complete, false);
      }
      return step.manager.kind === 'battle-round-drained';
    }, 250);
    const final = battle.copyState(), retired = bSlot === 0 && change === 'missing';
    assert.deepEqual(events, []);
    assert.deepEqual(landing, retired ? [] : [change === 'normal' ? 9 : 1]);
    assert.deepEqual(final.playback.attachedRID.handoffs.map(row => row.complete), retired ? [] : [true]);
    assert.equal(final.playback.attachedRID.registry[0], retired ? null : handoff.firstId);
    assert.ok(final.playback.nodes.every(node => ![handoff.id, handoff.sourceId, handoff.secondId, rider.id].includes(node.id)));
    if (retired) {
      assert.equal(final.bodies.bodies[0], null);
      assert.ok(final.playback.nodes.every(node => node.id !== handoff.firstId));
    } else {
      assert.deepEqual(final.bodies.bodies[0].vitals, [41, 100, 8, 10]);
      assert.equal(String.fromCharCode(...final.bodies.bodies[0].nameBytes), 'AfterAbort');
    }
    if (bSlot === 5) {
      assert.equal(final.playback.attachedRID.registry[5], replacementId ?? null);
      assert.deepEqual(final.bodies.bodies[5]?.vitals, replacementId ? [59, 100, 3, 10] : undefined);
    } else if (replacementId) {
      assert.ok(final.playback.nodes.every(node => node.id !== replacementId));
    }
  }, { ...lateResultFixture, assets, slots: [0, 1, 10], mountedSlots: [0] });
});

test('casting enters its own RID0 tuple after either animation completion path', async () => {
  const assets = rid0FallAssets(lateResultFixture.assets);
  const plain = 'A|1|C|', packed = 'A|800001|C|186DC|0|0|B|1|7|';
  for (const [resource, hits, bSlot, before, handoffIndex, damage] of [
    [100060, plain, 5, 2, 2, [[10, 'HP', 70, 58]]],
    [100080, plain, 5, 1, 2, []],
    [100060, '', 5, 1, 1, []],
    [100080, '', 5, 2, 1, []],
    [100060, packed, 5, 6, 6, [[11, 'HP', 70, 63], [10, 'HP', 70, 58]]],
    [100080, packed, 5, 5, 6, []],
    [100080, plain, 0, 1, 2, []],
  ]) await withBattle(battle => {
    battle.applyCharacter(0, 0, 100080, [resource, 0], vitals);
    const tail = attachedRID0(0, bSlot, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
    const queued = first(battle, 'SKL|76C|3|0|0|' + hits + 'FF|' + tail + 'CFP|0|2|');
    assert.deepEqual([queued.kind, queued.attachedRID], ['command-casting', 1]);
    const [prepared] = battle.copyState().playback.attachedRID.handoffs;
    const cursor = [], events = [], recovered = [];
    let beforeLanding = true;
    stepUntil(battle, step => {
      for (const command of step.commands) {
        if (command.wait?.recovered.length) recovered.push(command.wait.recovered);
      }
      events.push(...hpAndMp(step.body.events));
      if (beforeLanding) {
        const playback = battle.copyState().playback, h = playback.attachedRID.handoffs[0];
        const parent = playback.attachedRID.bodies.find(row => row.id === prepared.sourceId)?.body;
        if (parent?.state === 62 || handoffStarted(step, 0)) cursor.push(parent.tupleRead);
        if (handoffStarted(step, 0)) {
          assert.deepEqual(h.lastReadSlots, [0, bSlot]);
          assert.equal(playback.attachedRID.registry[bSlot], prepared.secondId);
        }
        beforeLanding = !h.complete;
      }
      return step.manager.kind === 'battle-round-drained';
    }, 7400);
    assert.deepEqual(cursor, [before, handoffIndex]);
    assert.deepEqual(events, [[0, 'MP', 10, 7], ...damage, [0, 'MP', 8, 6]]);
    assert.equal(recovered.length, resource === 100080 && hits ? 1 : 0);
    const final = battle.copyState();
    assert.equal(final.playback.attachedRID.registry[0], prepared.firstId);
    assert.equal(final.playback.attachedRID.handoffs[0].complete, true);
    assert.deepEqual(final.bodies.bodies[0].vitals, [41, 100, 6, 10]);
    assert.equal(String.fromCharCode(...final.bodies.bodies[0].nameBytes), 'AfterCast');
    assert.equal(final.bodies.bodies[5], null);
  }, { ...lateResultFixture, assets, slots: [0, 1, 10, 11] });
});

test('reflected inline unmounting preserves the queued RID0 identity and its owned rider', async () => {
  for (const [caster, paired] of [[0, 5], [0, 0], [2, 5]]) {
    await withBattle(battle => {
      const slot = caster.toString(16).toUpperCase();
      const tail = attachedRID0(caster, paired, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
      first(battle, 'SKL|76C|3|0|' + slot + '|A|810001|C|186DC|0|0|FF|' + tail + 'CFP|' + slot + '|2|');
      const [prepared] = battle.copyState().playback.attachedRID.handoffs;
      const events = [];
      let suspendedId, resumed = false, disabledObserved = false;
      stepUntil(battle, step => {
        events.push(...hpAndMp(step.body.events));
        const playback = battle.copyState().playback, h = playback.attachedRID.handoffs[0];
        if (h.suspendedRiderId !== undefined) {
          suspendedId ??= h.suspendedRiderId;
          assert.equal(h.suspendedRiderId, suspendedId);
          const rider = playback.nodes.find(node => node.id === suspendedId);
          disabledObserved ||= step.body.results.some(row => row.id === suspendedId && row.result === 'callback-disabled');
          assert.equal(rider.actorFlags & 2, 2);
          assert.equal(h.complete, false);
          assert.equal(playback.attachedRID.registry[caster], prepared.sourceId);
        }
        if (handoffStarted(step, caster)) {
          resumed = true;
          assert.deepEqual(h.lastReadSlots, [caster, paired]);
          assert.equal(h.suspendedRiderId, undefined);
          assert.equal(playback.nodes.find(node => node.id === suspendedId).actorFlags & 2, 0);
        }
        return step.manager.kind === 'battle-round-drained';
      }, 550);
      assert.equal(typeof suspendedId, 'number');
      assert.equal(disabledObserved, true);
      assert.equal(resumed, true);
      assert.deepEqual(events, [[caster, 'MP', 10, 7], [caster, 'HP', 70, 58], [caster, 'MP', 8, 6]]);
      const final = battle.copyState();
      assert.equal(final.playback.attachedRID.registry[caster], prepared.firstId);
      assert.equal(final.playback.attachedRID.handoffs[0].complete, true);
      assert.deepEqual(final.bodies.bodies[caster].vitals, [41, 100, 6, 10]);
      assert.equal(String.fromCharCode(...final.bodies.bodies[caster].nameBytes), 'AfterCast');
      assert.equal(final.playback.nodes.some(node => node.id === suspendedId), false);
    }, { ...lateResultFixture, assets: rid0FallAssets(lateResultFixture.assets),
      slots: [0, 2, 10], actorResource: 100080, mountedSlots: [caster] });
  }
});

test('a retired source releases a suspended RID0 rider and both unregistered replacements', async () => {
  await withBattle(battle => {
    const tail = attachedRID0(0, 5, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
    first(battle, 'SKL|76C|3|0|0|A|810001|C|186DC|0|0|FF|' + tail);
    let prepared, riderId;
    stepUntil(battle, () => {
      const playback = battle.copyState().playback;
      prepared = playback.attachedRID.handoffs[0];
      riderId = prepared.suspendedRiderId;
      return riderId !== undefined && !playback.nodes.some(node => node.kind === 'casting-projectile');
    }, 150);
    battle.removeCharacter(0);
    battle.callCallbacks(context);
    const playback = battle.copyState().playback;
    const retired = new Set([prepared.sourceId, prepared.firstId, prepared.secondId, prepared.id, riderId]);
    assert.equal(playback.nodes.some(node => retired.has(node.id)), false);
    assert.equal(playback.attachedRID.handoffs.length, 0);
    assert.equal(playback.attachedRID.registry[0], null);
    assert.equal(playback.attachedRID.registry[5], null);
  }, { ...lateResultFixture, assets: rid0FallAssets(lateResultFixture.assets),
    actorResource: 100080, mountedSlots: [0] });
});

test('lethal reflection reaches the owned exit and releases pending RID0 before a fresh entry', async () => {
  for (const inline of [false, true]) await withBattle(battle => {
    const hit = inline ? 'A|810061|46|186DC|0|0|' : 'A|10061|46|';
    const tail = attachedRID0(0, 5, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
    first(battle, 'SKL|76C|3|0|0|' + hit + 'FF|' + tail + 'CFP|0|2|');
    let suspended = false;
    stepUntil(battle, step => {
      suspended ||= battle.copyState().playback.attachedRID.handoffs[0].suspendedRiderId !== undefined;
      return step.manager.kind === 'manager-stop';
    }, 500);
    const stopped = battle.copyState();
    assert.equal(stopped.roundCounter, 0);
    assert.equal(stopped.bodies.bodies[0].state, 244);
    assert.equal(stopped.playback.attachedRID.handoffs[0].complete, false);
    assert.equal(suspended, inline);
    const exit = createLegacyGameBattleExit({
      prepare: value => battle.prepareExit(value),
      markDeleted: () => battle.markExitDeleted(),
    });
    try {
      const requests = [];
      let phase = 7, complete = false;
      for (let frame = 0; frame < 100 && !complete; frame++) {
        const out = exit.step(phase, { ...context, substate: phase });
        requests.push(...out.requests);
        if (phase === 7) {
          assert.equal(out.cleanup.kind, 'battle-exit-cleanup');
          assert.equal(battle.copyState().activeMask, 0);
          assert.equal(battle.copyState().bodies.bodies.every(row => row === null), true);
        }
        complete = out.boundaryReached;
        phase = out.substate;
      }
      assert.equal(complete, true);
      assert.deepEqual(requests, [{ operationId: 'send-004f67f0', arguments: [0] }]);
      assert.equal(battle.copyState().roundCounter, 0);
      assert.equal(battle.copyState().playback.nodes.every(node => node.deleted), true);
    } finally { exit.close(); }
    battle.beginEntry(-1);
    battle.callCallbacks({ ...context, substate: 2 });
    assert.equal(battle.copyState().playback.nodes.length, 0);
    assert.equal(battle.copyState().playback.attachedRID.handoffs.length, 0);
    battle.applyCharacter(0, 0, 100080, [0, 0], vitals);
    first(battle, 'CFP|0|2|');
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
    assert.deepEqual(battle.copyState().bodies.bodies[0].vitals, [70, 100, 8, 10]);
  }, { ...lateResultFixture, assets: rid0FallAssets(lateResultFixture.assets),
    actorResource: 100080, mountedSlots: [0] });
});

test('remote lethal reflection retires its source and unregistered RID0 replacements', async () => {
  await withBattle(battle => {
    const tail = attachedRID0(2, 5, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
    first(battle, 'SKL|76C|3|0|2|A|10061|46|FF|' + tail + 'CFP|2|2|');
    const prepared = battle.copyState().playback.attachedRID.handoffs[0], events = [];
    stepUntil(battle, step => {
      events.push(...hpAndMp(step.body.events));
      assert.equal(handoffStarted(step, 2), false);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(events, [[2, 'MP', 10, 7], [2, 'HP', 70, 0], [2, 'MP', 7, 5]]);
    const retired = new Set([prepared.sourceId, prepared.firstId, prepared.secondId, prepared.id]);
    assert.equal(battle.copyState().playback.nodes.filter(node => retired.has(node.id)).every(node => node.deleted), true);
    battle.callCallbacks({ ...context, substate: 2 });
    const final = battle.copyState();
    assert.equal(final.playback.nodes.some(node => retired.has(node.id)), false);
    assert.equal(final.playback.attachedRID.handoffs.length, 0);
    assert.equal(final.bodies.bodies[2], null);
    assert.equal(final.bodies.bodies[5], null);
    assert.deepEqual(final.bodies.bodies[0].vitals, vitals);
  }, { ...lateResultFixture, assets: rid0FallAssets(lateResultFixture.assets),
    slots: [0, 2, 10], actorResource: 100080, mountedSlots: [2] });
});

test('a reflected projectile consumes the body then registered in the paired caster slot', async () => {
  await withBattle(battle => {
    const tail = attachedRID0(10, 0, 'AfterCast').replace('SplitPet|186DC|', 'SplitPet|186F1|');
    first(battle, 'SKL|76C|3|0|0|A|10001|C|FF|' + tail + 'CFP|0|2|');
    const events = [], waits = [];
    stepUntil(battle, step => {
      events.push(...hpAndMp(step.body.events));
      for (const command of step.commands) if (command.wait?.recovered.length) waits.push(command.wait.recovered);
      return step.manager.kind === 'battle-round-drained';
    }, 600);
    assert.deepEqual(waits, []);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [0, 'MP', 6, 4], [0, 'HP', 0, 0]]);
    const final = battle.copyState();
    assert.equal(final.bodies.bodies[0], null);
    assert.deepEqual(final.bodies.bodies[10].vitals, [41, 100, 8, 10]);
    assert.equal(final.playback.attachedRID.handoffs[0].complete, true);
    assert.deepEqual(final.playback.attachedRID.handoffs[0].lastReadSlots, [10, 0]);
  }, { ...lateResultFixture, assets: rid0FallAssets(lateResultFixture.assets),
    actorResource: 100080, mountedSlots: [0, 10] });
});

test('early recovery requires the original bodies in the reserved slots', async () => {
  await withBattle(battle => {
    first(battle, idleAttackerRound(12));
    battle.removeCharacter(12);
    const replacement = [51, 100, 4, 10];
    battle.applyCharacter(12, 0, 100060, [0, 0], replacement);
    for (let pass = 0; pass < 1100; pass++) {
      const step = battle.callCallbacks(context);
      assert.equal(step.commands.some(row => row.wait?.recovered.length || row.kind === 'command-unavailable'), false);
      assert.notEqual(step.manager.kind, 'battle-round-drained');
    }
    const bodies = snapshot(battle);
    assert.deepEqual([bodies[12].busy, bodies[12].vitals, bodies[2].state, bodies[2].actions[0]], [0, replacement, 0, 24]);
  }, idleAttackerFixture);
});

test('the 257 and 262 action 74 checks bracket cleanup and 262 uses the retained level', () => {
  for (const [category, dead, laterActor, laterTarget, before, after] of [
    [257, false, 11, 10, false, true],
    [257, false, 1, 11, true, true],
    [262, false, 1, 11, true, false],
    [262, true, 1, 11, true, true],
  ]) {
    const get = slot => slot === 11 ? null : { vitals, dynamicFlags: slot === 0 && dead ? 2 : 0, state: 0 };
    const input = command(record(category, 0, [0, 10, 1, 12, laterActor, laterTarget, 1, 7], 9));
    const plan = game.planBattlePhysicalFamily(input, get, 0, 0, true);
    assert.equal(plan.kind, 'physical-family-plan');
    assert.equal(plan.rows.find(row => row.slot === 0).actions.at(-1) === 74, before);
    assert.deepEqual(plan.recoveryRows[0].actions, after ? [7, 11, 10, 74] : [7, 11, 10]);
  }
});

test('a prior KO result chooses the knockout tail and the released ordinary return plays to completion', async () => {
  const input = command(record(73, 0, [0, 0, 0x20, 1, 11, 10, 1, 7]));
  const plan = game.planBattlePhysicalFamily(input, slot => slot === 11 ? null : { vitals, dynamicFlags: 0, state: 0 }, 0, 0, true);
  assert.deepEqual(plan.recoveryRows[0].actions, [11, 44]);
  await withBattle(battle => {
    const result = first(battle, record(73, 0, [0, 0, 0, 0, 11, 10, 1, 7]));
    assert.deepEqual(result.missing, { slot: 11, role: 'attacker', point: 'later-pair' });
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
    assert.deepEqual([snapshot(battle)[0].busy, snapshot(battle)[0].vitals], [0, vitals]);
  });
});

test('SKL260 missing chain target preserves only the queue prefix before the chain lookup', async () => {
  const records = record(260, 0, [0, 10, 0x80001, 12, 11, 1, 7]);
  const plan = game.planBattlePhysicalFamily(command(records), slot => slot === 11 ? null : { vitals, dynamicFlags: 0, state: 0 }, 0, 0, true);
  assert.deepEqual(plan.missing, { slot: 11, role: 'target', point: 'chain-target' });
  assert.deepEqual(plan.hits, []);
  assert.deepEqual(plan.rows.map(row => [row.slot, row.actions, row.tuples]),
    [[0, [38, 147, 53, 24, 203, 201, 242], [[10, 0x80001, 12, 0]]]]);
  await withBattle(battle => {
    const result = first(battle, records);
    assert.equal(result.completion?.kind, 'command-released');
    assert.deepEqual(actions(snapshot(battle)[0]), [7, 11, 10]);
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
    assert.deepEqual(snapshot(battle)[0].vitals, vitals);
    assert.deepEqual(snapshot(battle)[10].vitals, vitals);
  });
});

test('ordinary and related projectile variants have different released tails after a missing target', async () => {
  for (const [category, variant] of [0, 73].flatMap(category => [1, 2, 3].map(variant => [category, variant]))) await withBattle(battle => {
    const result = first(battle, record(category, variant, [0, 11, 1, 12]));
    assert.equal(result.completion?.kind, 'command-released');
    assert.deepEqual(result.missing, { slot: 11, role: 'target', point: 'target-list' });
    const body = snapshot(battle)[0];
    assert.deepEqual([body.tupleWrite, actions(body), body.vitals],
      category === 73 ? [0, [], vitals] : [1, variant === 2 ? [72, 23] : [72], vitals]);
    if (category !== 73) {
      let delaySeen = false;
      stepUntil(battle, step => {
        delaySeen ||= snapshot(battle)[0].state === 23;
        return step.manager.kind === 'battle-round-drained';
      });
      assert.equal(delaySeen, variant === 2);
    }
  });
});

test('SKL266 variant 2 replays the saved self result after cleanup and leaves the aborted foreign hit unapplied', async () => {
  await withBattle(battle => {
    const result = first(battle, record(266, 2, [0, 10, 1, 12, 0, 0x4000, 9, 11, 1, 7]));
    assert.equal(result.completion?.kind, 'command-released');
    assert.equal(result.hits, 2);
    assert.deepEqual(actions(snapshot(battle)[0]), [72, 23, 216, 72, 120]);
    stepUntil(battle, step => step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP' && row.slot === 0));
    const bodies = snapshot(battle);
    assert.deepEqual([bodies[0].vitals, bodies[10].vitals], [[79, 100, 10, 10], vitals]);
  }, { assets: projectiles });
  await withBattle(battle => {
    const result = first(battle, record(266, 2, [0, 10, 1, 12, 0, 0x4200, 9, 1, 11, 1, 7]));
    assert.equal(result.completion?.kind, 'command-released');
    const bodies = snapshot(battle);
    assert.deepEqual(actions(bodies[0]), [72, 0, 27, 62, 0, 72, 41, 23, 72]);
    assert.equal(bodies[0].physicalFamily, 1);
    assert.deepEqual(actions(bodies[1]).slice(-2), [216, 120]);
    assert.deepEqual([...bodies[1].tuples.slice(0, 4)], [0, 0x4200, 9, 0]);
    assert.deepEqual(bodies[10].vitals, vitals);
  }, { assets: projectileAssets(base, selfVectors) });
});

test('a merged successor reuses the validated boundary and drops the interrupted pair and its attached RID0', async () => {
  const rid = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
  for (const [fields, kind] of [[[0, 11, 1, 12], 'command-strike'], [[0, 10, 0x201, 12, 11], 'command-strike-skipped']]) {
    const records = record(0, 0, fields) + rid + 'CFP|0|2|';
    const parsed = game.decodeLegacyGameBattleMotion(motion(records)).commands;
    assert.equal(parsed[0].attachedRID, 1);
    await withBattle(battle => {
      const result = first(battle, records);
      assert.equal(result.kind, kind);
      assert.equal(result.completion?.kind, 'command-next');
      assert.equal(result.attachedRID, undefined);
      assert.equal(snapshot(battle)[5], null);
      const owner = battle.copyState().slots[result.handle.slot];
      assert.deepEqual([owner.recordIndex, owner.phase, owner.cursor], [1, 0, parsed[1].argumentOffset]);
      assert.equal(battle.callCommand(result.handle, context).kind, 'command-delay');
      const next = battle.callCommand(result.handle, context);
      assert.deepEqual([next.kind, next.before, next.value, next.completion.kind], ['command-mp-cost', 10, 8, 'command-released']);
    });
  }
});

test('direct and copied commands cannot claim owned recovery for an absent participant', () => {
  const get = slot => slot === 11 ? null : { vitals, state: 0, dynamicFlags: 0 };
  for (const records of [record(0, 0, [0, 11, 1, 12]), record(0, 0, [0, 10, 0x201, 12, 11]),
    record(0, 2, [11, 10, 1, 12]), record(73, 1, [11, 10, 1, 12])]) {
    const decoded = command(records);
    assert.equal(game.planBattlePhysicalFamily(decoded, get, 0, 0).reason, 'physical-family-actor-absent');
    assert.equal(game.planBattlePhysicalFamily({ ...decoded }, get, 0, 0, true).reason, 'physical-family-actor-absent');
  }
});

test('a missing live guard releases a complete record before any body queue or vital change', async () => {
  for (const [category, variant, fields, point] of [
    [0, 0, [0, 10, 0x201, 12, 51], 'pair-guard'],
    [0, 0, [0, 10, 1, 12, 1, 10, 0x201, 7, 51], 'pair-guard'],
    [260, 0, [0, 10, 0x80001, 12, 1, 0x201, 7, 51], 'chain-guard'],
    [72, 0, [0, 10, 1, 12, 1, 0x201, 7, 51], 'nested-guard'],
    [266, 2, [0, 10, 1, 12, 0, 0x4200, 9, 51], 'saved-self-guard'],
    [266, 2, [0, 10, 1, 12, 0, 0x4200, 9, 51, 11, 1, 7], 'saved-self-guard'],
  ]) {
    const records = record(category, variant, fields);
    assert.equal(command(records).dependencyCounts[21], 1, point);
    await withBattle(battle => {
      const result = first(battle, records);
      assert.deepEqual([result.kind, result.category, result.variant, result.completion.kind],
        ['command-strike-skipped', category, variant, 'command-released']);
      assert.deepEqual(result.missing, { slot: 21, role: 'guard', point });
      assert.deepEqual(snapshot(battle).filter(Boolean).map(body => [body.busy, body.actionWrite, body.tupleWrite, body.vitals]),
        [[0, -1, 0, vitals], [0, -1, 0, vitals], [0, -1, 0, vitals]]);
      stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
    });
  }
});

test('all 27 positive-variant categories read the live caster before their targets', async () => {
  for (const category of classes.filter(category => category !== 72 && category !== 113)) {
    for (const variant of [1, 2, 3]) {
      const lookups = [];
      const decoded = command(record(category, variant, [50, 10, 1, 12]));
      assert.equal(decoded.dependencyCounts[20], 1);
      const plan = game.planBattlePhysicalFamily(decoded, slot => { lookups.push(slot); return null; }, 0, 0, true);
      assert.deepEqual(lookups, [20]);
      assert.deepEqual(plan, { kind: 'physical-family-unbound', category, variant, principal: 20,
        missing: { slot: 20, role: 'caster', point: 'positive-entry' } });
    }
  }
  for (const category of [0, 73]) await withBattle(battle => {
    const result = first(battle, record(category, 2, [11, 10, 1, 12]));
    assert.equal(result.kind, 'command-strike-skipped');
    assert.deepEqual(result.missing, { slot: 11, role: 'caster', point: 'positive-entry' });
    assert.equal(result.completion.kind, 'command-released');
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
    assert.deepEqual(snapshot(battle)[10].vitals, vitals);
  });
});

test('unselected positive self guards stay reserved while only the final SKL266 guard joins the queue', async () => {
  const get = slot => slot === 11 ? null : { vitals, state: 0, dynamicFlags: 0 };
  const prefix = [0, 0, 0x4200, 9, 11, 10, 1, 12];
  for (const [category, variant, tail, selected] of [
    [0, 2, [], null], [266, 1, [], null], [266, 3, [], null],
    [266, 2, [0, 0x4000, 7], null], [266, 2, [0, 0x4200, 7, 1], 1],
  ]) {
    const decoded = command(record(category, variant, [...prefix, ...tail]));
    assert.equal(decoded.dependencyCounts[11], 1);
    const plan = game.planBattlePhysicalFamily(decoded, get, 0, 0, true);
    assert.equal(plan.kind, 'physical-family-plan', `${category}/${variant}`);
    assert.equal(plan.rows.some(row => row.slot === 11), false);
    assert.equal(plan.rows.find(row => row.actions.includes(216))?.slot, category === 266 && variant === 2 ? selected ?? 0 : undefined);
    if (selected !== null) assert.equal(plan.rows.find(row => row.slot === selected).assignments.pairedTarget, 0);
  }
  await withBattle(battle => {
    const result = first(battle, record(266, 2, [...prefix, 0, 0x4000, 7]));
    assert.equal(result.kind, 'command-strike');
    assert.deepEqual(result.actors, [0, 10]);
    assert.ok(actions(snapshot(battle)[0]).includes(216));
    assert.equal(snapshot(battle)[11], null);
    stepUntil(battle, step => step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP' && row.slot === 0));
    assert.equal(snapshot(battle)[0].vitals[0], 77);
  }, { assets: projectileAssets(base, selfVectors) });
});

test('PLV removes a registered body before a merged caster and a later guard use the same slot', async () => {
  const records = 'PLV|B|' + record(73, 2, [11, 10, 1, 12]) + record(0, 0, [0, 10, 0x201, 12, 11]) + 'CFP|0|2|';
  await withBattle(battle => {
    const start = first(battle, records);
    assert.equal(start.kind, 'command-departure-queued');
    assert.equal(start.slot, 11);
    assert.deepEqual(actions(snapshot(battle)[11]), [12, 66, 78, 13, 49]);
    const observations = [];
    stepUntil(battle, step => {
      for (const event of step.body.events) if (event.kind === 'battle-motion-body-removed') observations.push(event.slot);
      for (const result of step.commands) if (result.kind === 'command-strike-skipped') {
        assert.equal(snapshot(battle)[11], null);
        if (result.missing.role === 'caster') assert.equal(result.handle, start.handle);
        observations.push([result.missing.role, result.missing.slot, result.completion.kind]);
      }
      return step.manager.kind === 'battle-round-drained';
    }, 600);
    assert.deepEqual(observations, [11, ['caster', 11, 'command-released'], ['guard', 11, 'command-next']]);
    assert.deepEqual([snapshot(battle)[0].vitals, snapshot(battle)[10].vitals], [[70, 100, 8, 10], vitals]);
  }, { assets: actorTransitionAssets(fixture), slots: [0, 10, 11] });
});

test('SKL72 reserves its outer actors and optional guard while a missing nested target ends the owned skill', async () => {
  for (const guard of [null, 1]) {
    const fields = [0, 10, 1, 12, 11, guard === null ? 1 : 0x201, 7, ...(guard === null ? [] : [guard])];
    const records = record(72, 0, fields) + 'CFP|0|2|';
    const decoded = command(records);
    assert.equal(decoded.dependencyCounts[11], 0);
    assert.equal(decoded.dependencyCounts[1], Number(guard !== null));
    await withBattle(battle => {
      const result = first(battle, records);
      assert.equal(result.kind, 'command-strike-skipped');
      assert.deepEqual(result.missing, { slot: 11, role: 'target', point: 'nested-target' });
      assert.equal(result.completion.kind, 'command-next');
      assert.deepEqual(snapshot(battle).filter(Boolean).map(b => [b.busy, b.actionWrite, b.tupleWrite, b.vitals]),
        [[0, -1, 0, vitals], [0, -1, 0, vitals], [0, -1, 0, vitals]]);
      stepUntil(battle, step => step.manager.kind === 'battle-round-drained');
      assert.deepEqual([snapshot(battle)[0].vitals[2], snapshot(battle)[10].vitals[0]], [8, 70]);
    });
  }
});

test('a nested target removed at action 232 consumes one tuple and preserves the remaining owned queue', async () => {
  const assets = projectileAssets(base, nestedVectors);
  const records = record(72, 0, [0, 10, 1, 12, 11, 1, 7]) + 'CFP|0|2|';
  await withBattle(battle => {
    const result = first(battle, records);
    assert.equal(result.kind, 'command-strike');
    stepUntil(battle, () => snapshot(battle)[0].state === 232);
    const before = snapshot(battle)[0];
    assert.equal(before.tuples[before.tupleRead * 4], 11);
    assert.deepEqual(snapshot(battle)[11].vitals, vitals);
    battle.removeCharacter(11);
    const step = battle.callCallbacks(context), after = snapshot(battle)[0];
    assert.equal(step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP'), false);
    assert.deepEqual([after.actionRead, after.tupleRead, after.counter], [before.actionRead + 1, before.tupleRead + 1, 0]);
    stepUntil(battle, next => next.manager.kind === 'battle-round-drained', 500);
    assert.deepEqual([snapshot(battle)[0].vitals, snapshot(battle)[10].vitals], [[70, 100, 5, 10], vitals]);
  }, { assets, slots: [0, 10, 11] });
});

const skl113 = 'SKL|2C25|3|0|0|A|1|C|B|1|7|';

test('SKL113 keeps separate preflight and producer ends through a real round', async () => {
  const records = skl113 + 'FF|FF|CFP|B|2|';
  const [skill, cost] = game.decodeLegacyGameBattleMotion(motion(records)).commands;
  assert.deepEqual(skill.fields, [11301, 3, 0, 0, 10, 1, 12, 11, 1, 7, 255, 255]);
  assert.deepEqual([...skill.dependencyCounts].flatMap((count, slot) => count ? [[slot, count]] : []),
    [[0, 1], [1, 1], [10, 1], [11, 1]]);
  assert.deepEqual([skill.nextOffset, cost.tokenOffset], [35, 35]);
  const get = () => ({ vitals, unmodeledCharacterMask: 0 });
  assert.equal(game.planBattlePhysicalFamily(skill, get, 0, 0).producerFieldCount, 11);
  assert.equal(game.planBattlePhysicalFamily({ ...skill }, get, 0, 0).reason, 'physical-family-record-boundary');
  assert.throws(() => command(skl113 + 'FF|'), e => e.code === 'LEGACY_BATTLE_MOTION_TRUNCATED');
  for (const nestedFlags of ['201|7|1|', '800001|7|186DC|186DC|186DC|']) {
    assert.throws(() => command(skl113.replace('B|1|7|', 'B|' + nestedFlags) + 'FF|FF|'),
      e => e.code === 'LEGACY_BATTLE_MOTION_SLOT');
  }
  await withBattle(battle => {
    battle.load(motion(records), { ...context, substate: 5 });
    const lifecycle = [], events = [];
    let previous = snapshot(battle)[0];
    stepUntil(battle, step => {
      const state = battle.copyState();
      if (step.manager.kind === 'manager-conflict') lifecycle.push(['reserved', step.manager.slot]);
      for (const row of step.commands) {
        if (row.kind === 'command-strike') {
          assert.deepEqual([row.category, row.hits, row.producerFieldCount], [113, 1, 11]);
          assert.deepEqual([state.slots[row.handle.slot].cursor, state.cursor, state.preflightCursor], [32, 35, 43]);
          lifecycle.push(['strike', row.handle.id]);
        }
        if (row.kind === 'command-mp-cost') lifecycle.push(['cost', row.handle.id, row.slot]);
      }
      for (const row of step.body.events) if (row.kind === 'battle-vital') {
        if (row.field === 'HP') assert.equal(previous.state, 232);
        events.push([row.slot, row.field, row.before, row.value]);
      }
      previous = state.bodies.bodies[0];
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(lifecycle, [['reserved', 11], ['strike', 1], ['cost', 2, 11]]);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [11, 'HP', 70, 63], [11, 'MP', 10, 8]]);
    assert.deepEqual([0, 1, 10, 11].map(slot => snapshot(battle)[slot].vitals),
      [[70, 100, 7, 10], vitals, vitals, [63, 100, 8, 10]]);
  }, { assets: projectileAssets(base, nestedVectors), slots: [0, 1, 10, 11] });
});

test('SKL113 rejects an unreachable grouped command or attached RID before mutation', async () => {
  const rid = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
  for (const [tail, attached, reason] of [
    ['FF|FF|CFP|0|2|', 0, 'physical-family-grouped-command-boundary'],
    ['FF|2|3|0|CFPFF||CFP|0|2|', 0, 'physical-family-grouped-command-boundary'],
    ['FF|FF|' + rid, 1, 'physical-family-attached-RID-boundary'],
  ]) await withBattle(battle => {
    const records = skl113 + tail;
    assert.equal(command(records).attachedRID, attached);
    battle.load(motion(records), { ...context, substate: 5 });
    const { created, merged } = battle.callManager(context);
    assert.equal(created.length, 1);
    assert.deepEqual(merged, attached ? [] : [1]);
    const before = battle.copyState();
    let result;
    for (let pass = 0; pass < 24; pass++) {
      result = battle.callCommand(created[0], context);
      if (result.kind !== 'command-delay') break;
    }
    const after = battle.copyState();
    assert.deepEqual([result.kind, result.reason], ['command-unavailable', reason]);
    assert.deepEqual(after.bodies, before.bodies);
    assert.deepEqual(after.playback, before.playback);
    assert.deepEqual([after.slots[0].phase, after.slots[0].cursor], [0, 6]);
  }, { assets: projectileAssets(base, nestedVectors), slots: [0, 1, 5, 10, 11] });
});

test('SKL113 can resume a grouped command after an unrecognized token and separator', async () => {
  const records = skl113 + 'FF|FF||CFP|0|2|';
  const [skill, cost] = game.decodeLegacyGameBattleMotion(motion(records)).commands;
  assert.deepEqual([skill.nextOffset, cost.tokenOffset], [35, 36]);
  await withBattle(battle => {
    const strike = first(battle, records), events = [];
    assert.deepEqual([strike.kind, strike.producerFieldCount, strike.producerEnd], ['command-strike', 11, 32]);
    const object = battle.copyState().slots[0];
    assert.deepEqual([object.cursor, object.records.length], [32, 2]);
    let successor, costHandle;
    stepUntil(battle, step => {
      for (const row of step.commands) {
        if (row.kind === 'command-next') successor = row;
        if (row.kind === 'command-mp-cost') costHandle = row.handle;
      }
      for (const row of step.body.events) if (row.kind === 'battle-vital') events.push([row.slot, row.field, row.before, row.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.equal(successor?.token, 'CFP');
    assert.equal(successor.handle, strike.handle);
    assert.equal(costHandle, strike.handle);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [11, 'HP', 70, 63], [0, 'MP', 7, 5]]);
  }, { assets: projectileAssets(base, nestedVectors), slots: [0, 1, 10, 11] });
});

test('SKL113 with a common terminator keeps the signed nested result and grouped successor', async () => {
  const records = 'SKL|2C25|3|3|0|A|1|C|B|1|FFFFFFFF|0|C|201|7|2|FF|CFP|0|2|';
  const [skill, cost] = game.decodeLegacyGameBattleMotion(motion(records)).commands;
  assert.equal(skill.nextOffset, cost.tokenOffset);
  assert.deepEqual([...skill.dependencyCounts].flatMap((count, slot) => count ? [[slot, count]] : []),
    [[0, 1], [1, 1], [2, 1], [10, 1], [11, 1]]);
  await withBattle(battle => {
    const strike = first(battle, records), events = [];
    assert.deepEqual([strike.kind, strike.category, strike.hits, strike.producerFieldCount], ['command-strike', 113, 2, undefined]);
    const object = battle.copyState().slots[0];
    assert.deepEqual([object.cursor, object.records.length], [skill.nextOffset, 2]);
    let costHandle;
    stepUntil(battle, step => {
      for (const row of step.commands) if (row.kind === 'command-mp-cost') costHandle = row.handle;
      for (const row of step.body.events) if (row.kind === 'battle-vital') events.push([row.slot, row.field, row.before, row.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 550);
    assert.equal(costHandle, strike.handle);
    assert.deepEqual(events, [[0, 'MP', 10, 7], [11, 'HP', 70, 71], [2, 'HP', 70, 63], [0, 'MP', 7, 5]]);
    assert.deepEqual([0, 1, 2, 10, 11, 12].map(slot => snapshot(battle)[slot].vitals),
      [[70, 100, 5, 10], vitals, [63, 100, 10, 10], vitals, [71, 100, 10, 10], vitals]);
  }, { assets: projectileAssets(base, nestedVectors), slots: [0, 1, 2, 10, 11, 12] });
});

test('a PLV departure during nested protection lets the guard and caster finish the same round', async () => {
  const assets = actorTransitionAssets(projectileAssets(base, nestedVectors));
  const records = 'PLV|10|' + record(72, 0, [0, 10, 1, 12, 16, 0x201, 7, 1]) + 'CFP|0|2|';
  await withBattle(battle => {
    battle.load(motion(records), { ...context, substate: 5 });
    const events = [];
    stepUntil(battle, step => {
      for (const result of step.commands) if (result.kind === 'command-departure-queued' || result.kind === 'command-strike') events.push(result.kind);
      for (const row of step.body.events) if (row.kind === 'battle-motion-body-removed') events.push(row.slot);
      const bodies = snapshot(battle);
      return bodies[16] === null && bodies[1].state === 4;
    }, 420);
    assert.deepEqual(events, ['command-departure-queued', 'command-strike', 16]);
    assert.equal(snapshot(battle)[0].state, 0);
    for (const next of [42, 71, 10]) {
      battle.callCallbacks(context);
      assert.equal(snapshot(battle)[1].state, next);
    }
    assert.equal(snapshot(battle)[0].state, 24);
    stepUntil(battle, step => step.manager.kind === 'battle-round-drained', 500);
    assert.deepEqual([0, 1, 10, 16].map(slot => snapshot(battle)[slot]?.vitals ?? null),
      [[70, 100, 5, 10], [63, 100, 10, 10], vitals, null]);
  }, { assets, slots: [0, 1, 10, 16] });
});

test('a replacement in the released guard target slot keeps its own queue and vitals', async () => {
  const assets = projectileAssets(base, nestedVectors);
  const records = record(72, 0, [0, 10, 1, 12, 16, 0x201, 7, 1]) + 'CFP|0|2|';
  await withBattle(battle => {
    assert.equal(first(battle, records).kind, 'command-strike');
    stepUntil(battle, () => snapshot(battle)[1].state === 4);
    battle.removeCharacter(16);
    const replacement = [45, 100, 6, 10];
    battle.applyCharacter(16, 0, 100060, [0, 0], replacement);
    const originalPosition = snapshot(battle)[16].position;
    stepUntil(battle, step => {
      const b = snapshot(battle)[16];
      assert.deepEqual([b.actionRead, b.actionWrite, b.state, b.position, b.vitals],
        [0, -1, 0, originalPosition, replacement]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual([snapshot(battle)[0].vitals[2], snapshot(battle)[1].vitals[0]], [5, 63]);
  }, { assets, slots: [0, 1, 10, 16] });
});

test('a departing nested guard releases both waits and consumes only the missing result', async () => {
  const assets = projectileAssets(base, nestedVectors);
  const records = record(72, 0, [0, 10, 1, 12, 16, 0x201, 7, 1]) + 'CFP|0|2|';
  for (const guardState of [4, 10]) await withBattle(battle => {
    assert.equal(first(battle, records).kind, 'command-strike');
    stepUntil(battle, () => snapshot(battle)[1].state === guardState);
    const caster = snapshot(battle)[0], protectedBody = snapshot(battle)[16];
    assert.equal(caster.state, 0);
    assert.equal(caster.tuples[(caster.tupleRead + 2) * 4], 1);
    battle.removeCharacter(1);
    assert.equal(snapshot(battle)[0].state, 24);
    assert.equal(snapshot(battle)[0].tuples[(caster.tupleRead + 2) * 4], -1);
    assert.equal(snapshot(battle)[16].tupleRead, protectedBody.tupleRead + 1);
    const replacement = guardState === 10 ? [51, 100, 4, 10] : null;
    if (replacement) battle.applyCharacter(1, 0, 100060, [0, 0], replacement);
    stepUntil(battle, step => {
      assert.equal(step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP'), false);
      if (replacement) assert.deepEqual([snapshot(battle)[1].actionRead, snapshot(battle)[1].vitals], [0, replacement]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual([0, 1, 10, 16].map(slot => snapshot(battle)[slot]?.vitals ?? null),
      [[70, 100, 5, 10], replacement, vitals, vitals]);
  }, { assets, slots: [0, 1, 10, 16] });
});

test('a guard removed before its nested handoff invalidates only its owned tuples', async () => {
  const assets = projectileAssets(base, nestedVectors);
  const records = record(72, 0, [0, 10, 1, 12, 16, 0x201, 7, 1]) + 'CFP|0|2|';
  for (const earlyState of [147, 71]) await withBattle(battle => {
    assert.equal(first(battle, records).kind, 'command-strike');
    stepUntil(battle, () => {
      const caster = snapshot(battle)[0];
      return caster.state === earlyState && (earlyState !== 71 || caster.actions[caster.actionRead + 1] === 0);
    });
    const [caster, guard] = snapshot(battle), protectedBody = snapshot(battle)[16];
    assert.equal(guard.state, 0);
    const wait = actions(caster).findIndex((type, at) => at > caster.actionRead && type === 0 && caster.actions[at - 1] === 71);
    const guardTuples = Array.from({ length: caster.tupleWrite - caster.tupleRead }, (_, i) => caster.tupleRead + i)
      .filter(i => caster.tuples[i * 4] === 1);
    assert.equal(guardTuples.length, 2);
    assert.ok(wait > caster.actionRead);
    battle.removeCharacter(1);
    const [after] = snapshot(battle), expectedActions = actions(caster), expectedTuples = [...caster.tuples];
    expectedActions[wait] = 62;
    for (const i of guardTuples) expectedTuples[i * 4] = -1;
    assert.equal(after.state, earlyState);
    assert.deepEqual(actions(after), expectedActions);
    assert.deepEqual([...after.tuples], expectedTuples);
    assert.equal(snapshot(battle)[16].tupleRead, protectedBody.tupleRead + 1);
    const replacement = [51, 100, 4, 10];
    if (earlyState === 71) battle.applyCharacter(1, 0, 100060, [0, 0], replacement);
    stepUntil(battle, step => {
      assert.equal(step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP'), false);
      if (earlyState === 71) {
        const replacementBody = snapshot(battle)[1];
        assert.deepEqual([replacementBody.actionRead, replacementBody.actionWrite, replacementBody.vitals], [0, -1, replacement]);
      }
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual([0, 10, 16].map(slot => snapshot(battle)[slot].vitals), [[70, 100, 5, 10], vitals, vitals]);
  }, { assets, slots: [0, 1, 10, 16] });
});

test('early nested guard departure preserves the protected body’s earlier PLV queue', async () => {
  const assets = actorTransitionAssets(projectileAssets(base, nestedVectors));
  const records = 'PLV|10|' + record(72, 0, [0, 10, 1, 12, 16, 0x201, 7, 1]) + 'CFP|0|2|';
  await withBattle(battle => {
    battle.load(motion(records), { ...context, substate: 5 });
    stepUntil(battle, step => step.commands.some(row => row.kind === 'command-strike'));
    const before = snapshot(battle)[16], queue = actions(before);
    assert.equal(before.state, 12);
    assert.equal(before.actionRead, 0);
    assert.equal(queue.length > 6, true);
    assert.deepEqual(queue.slice(-6), [0, 27, 71, 72, 62, 1]);
    battle.removeCharacter(1);
    const after = snapshot(battle)[16];
    assert.deepEqual([after.state, after.actionRead, after.tupleRead], [before.state, before.actionRead, before.tupleRead]);
    assert.deepEqual(actions(after), [...queue.slice(0, -6), 62, 62, 62, 72, 62, 62]);
    const removed = [];
    stepUntil(battle, step => {
      for (const row of step.body.events) if (row.kind === 'battle-motion-body-removed') removed.push(row.slot);
      assert.equal(step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP'), false);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(removed, [16]);
    assert.deepEqual([0, 10, 16].map(slot => snapshot(battle)[slot]?.vitals ?? null), [[70, 100, 5, 10], vitals, null]);
  }, { assets, slots: [0, 1, 10, 16] });
});

test('SKL72 and SKL113 release the outer protected body after it reaches action 1', async () => {
  const assets = projectileAssets(base, nestedVectors);
  for (const category of [72, 113]) await withBattle(battle => {
    const separate = category === 113;
    const records = record(category, separate ? 2 : 0, [0, 10, 0x201, 12, 1, 11, 1, 7]) +
      (separate ? 'FF|CFP|B|2|' : 'CFP|0|2|');
    assert.equal(first(battle, records).kind, 'command-strike');
    const hp = [], releases = [];
    let before = snapshot(battle);
    stepUntil(battle, step => {
      const after = snapshot(battle);
      if (before[1].tupleRead === 1 && before[10].state === 62) releases.push([after[1].state, after[10].state]);
      if (before[1].tupleRead === 1 && before[1].state === 71) releases.push([after[1].state, after[10].state]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      before = after;
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(releases, [[71, 1], [72, 11]]);
    assert.deepEqual(hp, [[11, 70, 63]]);
    assert.deepEqual([0, 1, 10, 11].map(slot => before[slot].vitals),
      [[70, 100, separate ? 7 : 5, 10], vitals, vitals, [63, 100, separate ? 8 : 10, 10]]);
  }, { assets, slots: [0, 1, 10, 11] });
});

const sharedGuardRound = (guard, outer, inner) =>
  record(72, 0, [0, 10, 0x201, outer, guard, 11, 0x201, inner, guard]) + 'CFP|0|2|';

test('one SKL72 guard consumes both approaches before both returns, including zero amounts', async () => {
  const assets = projectileAssets(base, nestedVectors);
  for (const [guard, outer, inner] of [[1, 12, 7], [12, 12, 7], [1, 0, 7], [1, 12, 0]]) await withBattle(battle => {
    assert.equal(first(battle, sharedGuardRound(guard, outer, inner)).kind, 'command-strike');
    let before = snapshot(battle);
    assert.deepEqual([0, 4, 8, 12].map(index => before[guard].tuples[index]), [10, 11, 10, 11]);
    const releases = [], hp = [];
    stepUntil(battle, step => {
      const after = snapshot(battle), previous = before[guard], current = after[guard];
      if (current.actionRead > previous.actionRead && current.actions[current.actionRead - 1] === 71 &&
          (current.state === 10 || current.state === 72)) releases.push(current.tuples[current.tupleRead * 4]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') {
        assert.equal(previous.state, 0);
        assert.equal(previous.tupleRead, 3);
        hp.push([e.slot, e.before, e.value]);
      }
      before = after;
      return step.manager.kind === 'battle-round-drained';
    }, 700);
    assert.deepEqual(releases, [10, 11, 10, 11]);
    assert.deepEqual(hp, inner ? [[guard, 70, 63]] : []);
    assert.deepEqual([0, guard, 10, 11].map(slot => before[slot].vitals),
      [[70, 100, 5, 10], [inner ? 63 : 70, 100, 10, 10], vitals, vitals]);
  }, { assets, slots: [0, guard, 10, 11] });
});

test('shared guard and protected slots can be reused during either SKL72 approach', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const [slot, approach] of [[1, 0], [1, 1], [11, 1]]) await withBattle(battle => {
    assert.equal(first(battle, sharedGuardRound(1, 12, 7)).kind, 'command-strike');
    stepUntil(battle, () => {
      const guard = snapshot(battle)[1];
      return guard.state === 4 && guard.tupleRead === approach;
    }, 500);
    battle.removeCharacter(slot);
    battle.applyCharacter(slot, 0, 100060, [0, 0], replacement);
    const hp = [];
    stepUntil(battle, step => {
      const body = snapshot(battle)[slot];
      assert.deepEqual([body.actionRead, body.actionWrite, body.vitals], [0, -1, replacement]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(hp, slot === 1 ? [] : [[1, 70, 63]]);
    assert.deepEqual([snapshot(battle)[0].vitals, snapshot(battle)[10].vitals], [[70, 100, 5, 10], vitals]);
  }, { assets, slots: [0, 1, 10, 11] });
});

test('early outer guard departure keeps the distinct SKL113 nested hit and cost', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  await withBattle(battle => {
    const records = record(113, 2, [0, 10, 0x201, 12, 1, 11, 1, 7]) + 'FF|CFP|B|2|';
    assert.equal(first(battle, records).kind, 'command-strike');
    stepUntil(battle, () => snapshot(battle)[0].state === 147);
    battle.removeCharacter(1);
    battle.applyCharacter(1, 0, 100060, [0, 0], replacement);
    const hp = [];
    stepUntil(battle, step => {
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      assert.deepEqual([snapshot(battle)[1].actionRead, snapshot(battle)[1].vitals], [0, replacement]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(hp, [[11, 70, 63]]);
    assert.deepEqual([0, 10, 11].map(slot => snapshot(battle)[slot].vitals),
      [[70, 100, 7, 10], vitals, [63, 100, 8, 10]]);
  }, { assets, slots: [0, 1, 10, 11] });
});

const repeatedProtectionRound = (outerGuard, innerGuard, outer, inner, { target = 10, following = false } = {}) =>
  record(72, 0, [0, 10, 0x201, outer, outerGuard, target, 0x201, inner, innerGuard,
    ...(following ? [1, 11, 0x11, 1] : [])]) + 'CFP|0|2|';

test('repeated SKL72 protection returns the same body before the second approach', async () => {
  const assets = projectileAssets(base, nestedVectors);
  for (const [outerGuard, innerGuard, outer, inner] of [[1, 1, 12, 7], [1, 2, 12, 7], [12, 1, 12, 7],
    [12, 12, 0, 7], [1, 1, 12, 0]]) await withBattle(battle => {
    assert.equal(first(battle, repeatedProtectionRound(outerGuard, innerGuard, outer, inner)).kind, 'command-strike');
    let prior = snapshot(battle)[10];
    const hp = [], reactions = [], returns = [];
    stepUntil(battle, step => {
      const bodies = snapshot(battle), body = bodies[10];
      if (body.state === 27 && prior.state !== 27) reactions.push([body.actionRead, body.tupleRead]);
      if (body.state === 11 && prior.state === 1) returns.push(body.actionRead);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      prior = body;
      return step.manager.kind === 'battle-round-drained';
    }, 720);
    assert.deepEqual(reactions, [[1, 0], [8, 1]]);
    assert.deepEqual(returns, [6]);
    assert.deepEqual(hp, inner ? [[innerGuard, 70, 63]] : []);
    assert.deepEqual([snapshot(battle)[0].vitals, prior.vitals], [[70, 100, 5, 10], vitals]);
  }, { assets, slots: [0, ...new Set([outerGuard, innerGuard]), 10] });
});

test('the shared SKL72 guard consumes each zero-result turn before the following attack', async () => {
  const assets = projectileAssets(base, nestedVectors), turn = [11, 0, 0, 0], attack = [11, 0x11, 1, 0];
  for (const [target, inner] of [[10, 7], [10, 0], [11, 7]]) await withBattle(battle => {
    assert.equal(first(battle, repeatedProtectionRound(1, 1, 0, inner, { target, following: true })).kind, 'command-strike');
    const { tuples, tupleWrite } = snapshot(battle)[1];
    const planned = Array.from({ length: tupleWrite }, (_, i) => [...tuples.slice(4 * i, 4 * i + 4)]);
    assert.deepEqual(planned, [[10, 0x201, 0, 0], [target, 0x201, inner, 0], [10, 0x201, 0, 0], turn,
      [target, 0x201, inner, 0], ...(inner ? [] : [turn]), attack]);
    const hp = [], turns = new Set();
    stepUntil(battle, step => {
      const guard = snapshot(battle)[1];
      if (guard.state === 3 && guard.tuples[4 * guard.tupleRead + 1] === 0) turns.add(guard.tupleRead);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 820);
    assert.deepEqual([...turns], inner ? [3] : [3, 5]);
    assert.deepEqual(hp, [...(inner ? [[1, 70, 63]] : []), [11, 70, 69]]);
    assert.deepEqual([snapshot(battle)[0].vitals[2], snapshot(battle)[10].vitals[0]], [5, 70]);
  }, { assets, slots: [0, 1, 10, 11] });
});

test('repeated protection keeps the surviving result when a guard or the protected body is replaced', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const [innerGuard, removed, expectedHit] of [[1, 1, null], [1, 10, 1], [2, 1, 2], [2, 2, null]]) await withBattle(battle => {
    assert.equal(first(battle, repeatedProtectionRound(1, innerGuard, 12, 7)).kind, 'command-strike');
    stepUntil(battle, () => {
      const bodies = snapshot(battle);
      return removed === 10 ? bodies[10].state === 11 && bodies[10].actionRead === 6 : bodies[removed].state === 4;
    }, 450);
    battle.removeCharacter(removed);
    battle.applyCharacter(removed, 0, 100060, [0, 0], replacement);
    const hp = [];
    stepUntil(battle, step => {
      const body = snapshot(battle)[removed];
      assert.deepEqual([body.actionRead, body.actionWrite, body.vitals], [0, -1, replacement]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 700);
    assert.deepEqual(hp, expectedHit === null ? [] : [[expectedHit, 70, 63]]);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
  }, { assets, slots: [0, ...new Set([1, innerGuard]), 10] });
});

test('losing either owner of the shared guard’s following attack releases its waiting queue', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const [removed, phase] of [[1, 'early'], [1, 'charge'], [11, 'turn'], [11, 'charge']]) await withBattle(battle => {
    assert.equal(first(battle, repeatedProtectionRound(1, 1, 0, 7, { following: true })).kind, 'command-strike');
    stepUntil(battle, () => {
      const [caster, guard] = snapshot(battle);
      if (phase === 'early') return caster.state === 147;
      if (phase === 'turn') return guard.state === 3 && guard.tuples[4 * guard.tupleRead + 1] === 0;
      return guard.state === 157 && guard.actions[guard.actionRead] === 113;
    }, 720);
    battle.removeCharacter(removed);
    battle.applyCharacter(removed, 0, 100060, [0, 0], replacement);
    stepUntil(battle, step => {
      const body = snapshot(battle)[removed];
      assert.deepEqual([body.frozen, body.actionRead, body.actionWrite, body.vitals], [0, 0, -1, replacement]);
      assert.ok(step.body.events.every(e => e.kind !== 'battle-vital' || e.field !== 'HP' || e.slot === 1 && removed === 11));
      return step.manager.kind === 'battle-round-drained';
    }, 700);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
    if (removed === 1) assert.deepEqual([snapshot(battle)[11].vitals, snapshot(battle)[11].frozen], [vitals, 0]);
    else assert.equal(snapshot(battle)[1].vitals[0], 63);
  }, { assets, slots: [0, 1, 10, 11] });
});

const followingStrikesRound = (pairs, innerGuard = 1) =>
  record(72, 0, [0, 10, 0x201, 0, 1, 10, 0x201, 7, innerGuard, ...pairs]) + 'CFP|0|2|';

test('a guard leaving during multiple strikes preserves landed damage and releases each pending wait', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const [target, phase] of [[10, 'early'], [10, 'landed'], [11, 'early'], [11, 'charge']]) await withBattle(battle => {
    const records = followingStrikesRound([1, 11, 0x11, 1, 1, target, 0x11, 2, 1, 12, 1, 3]);
    assert.equal(first(battle, records).kind, 'command-strike');
    const hp = [];
    stepUntil(battle, step => {
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      const bodies = snapshot(battle), guard = bodies[1];
      if (phase === 'early') return bodies[0].state === 147;
      if (phase === 'landed') return bodies[11].vitals[0] === 69;
      return bodies[11].vitals[0] === 69 && guard.state === 157 && guard.actions[guard.actionRead] === 113;
    }, 850);
    battle.removeCharacter(1);
    battle.applyCharacter(1, 0, 100060, [0, 0], replacement);
    stepUntil(battle, step => {
      const bodies = snapshot(battle);
      assert.deepEqual([bodies[1].actionRead, bodies[1].actionWrite, bodies[1].frozen, bodies[1].vitals], [0, -1, 0, replacement]);
      assert.ok(step.body.events.every(e => e.kind !== 'battle-vital' || e.field !== 'HP'));
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    const bodies = snapshot(battle);
    assert.deepEqual(hp, phase === 'early' ? [] : [[1, 70, 63], [11, 70, 69]]);
    assert.deepEqual([bodies[0].vitals[2], bodies[10].vitals[0], bodies[11].vitals[0], bodies[11].frozen, bodies[12].vitals[0]],
      [5, 70, phase === 'early' ? 70 : 69, 0, 70]);
  }, { assets, slots: [0, 1, 10, 11, 12] });
});

test('replacing a charged target retires that charge and lets the next strike complete independently', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  await withBattle(battle => {
    assert.equal(first(battle, followingStrikesRound([1, 11, 0x11, 1, 1, 10, 0x11, 2])).kind, 'command-strike');
    stepUntil(battle, () => {
      const guard = snapshot(battle)[1];
      return guard.state === 157 && guard.actions[guard.actionRead] === 113 && guard.tuples[guard.tupleRead * 4] === 11;
    }, 750);
    const [cancelled] = battle.copyState().playback.nodes.filter(n => n.kind === 'physical-guard-charge');
    assert.ok(cancelled);
    assert.equal(snapshot(battle)[11].frozen, 1);
    battle.removeCharacter(11);
    battle.applyCharacter(11, 0, 100060, [0, 0], replacement);
    const hp = [], charges = new Set();
    let charging = 0;
    stepUntil(battle, step => {
      const state = battle.copyState(), bodies = state.bodies.bodies, guard = bodies[1];
      assert.deepEqual([bodies[11].frozen, bodies[11].actionRead, bodies[11].vitals], [0, 0, replacement]);
      const effects = state.playback.nodes.filter(n => n.kind === 'physical-guard-charge' && !n.deleted);
      assert.ok(effects.every(n => n.id !== cancelled.id));
      if (guard.state === 157 && guard.tuples[guard.tupleRead * 4] === 10) {
        assert.equal(effects.length, 1);
        assert.equal(bodies[10].frozen, 1);
        charges.add(effects[0].id);
        charging++;
      }
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.equal(charges.size, 1);
    assert.ok(charging > 1);
    assert.deepEqual(hp, [[10, 70, 68]]);
    assert.deepEqual([snapshot(battle)[0].vitals[2], snapshot(battle)[1].vitals[0]], [5, 63]);
  }, { assets, slots: [0, 1, 10, 11] });
});

test('two guards attacking the same body use their respective waits and only the departing hit is skipped', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const removed of [null, 1, 2]) await withBattle(battle => {
    assert.equal(first(battle, followingStrikesRound([1, 11, 0x11, 1, 2, 11, 0x11, 2], 2)).kind, 'command-strike');
    if (removed !== null) {
      stepUntil(battle, () => snapshot(battle)[0].state === 147);
      battle.removeCharacter(removed);
      battle.applyCharacter(removed, 0, 100060, [0, 0], replacement);
    }
    let blockedAtFirstWait = false;
    const hp = [];
    stepUntil(battle, step => {
      const bodies = snapshot(battle);
      blockedAtFirstWait ||= bodies[2].state === 24 && bodies[11].state === 0 && bodies[11].actionRead === 0;
      if (removed !== null) assert.deepEqual([bodies[removed].actionRead, bodies[removed].vitals], [0, replacement]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 850);
    if (removed === null) assert.equal(blockedAtFirstWait, true);
    assert.deepEqual(hp, removed === 1 ? [[2, 70, 63], [11, 70, 68]] : removed === 2 ? [[11, 70, 69]] :
      [[2, 70, 63], [11, 70, 69], [11, 69, 67]]);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
  }, { assets, slots: [0, 1, 2, 10, 11] });
});

test('a following recipient keeps its own later attack until that body leaves', async () => {
  const assets = projectileAssets(base, nestedVectors), replacement = [51, 100, 4, 10];
  for (const removed of [1, 11]) await withBattle(battle => {
    assert.equal(first(battle, followingStrikesRound([1, 11, 0x11, 1, 11, 12, 0x11, 3, 1, 10, 0x11, 2])).kind, 'command-strike');
    stepUntil(battle, () => {
      const [caster, guard] = snapshot(battle);
      return removed === 1 ? caster.state === 147 : guard.state === 157 && guard.actions[guard.actionRead] === 113;
    }, 750);
    battle.removeCharacter(removed);
    battle.applyCharacter(removed, 0, 100060, [0, 0], replacement);
    const hp = [];
    stepUntil(battle, step => {
      const body = snapshot(battle)[removed];
      assert.deepEqual([body.actionRead, body.vitals], [0, replacement]);
      for (const e of step.body.events) if (e.kind === 'battle-vital' && e.field === 'HP') hp.push([e.slot, e.before, e.value]);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual(hp, removed === 1 ? [[12, 70, 67]] : [[10, 70, 68]]);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
  }, { assets, slots: [0, 1, 10, 11, 12] });
});

test('SKL266 settles a caster who is also its guard once and releases 216 on a near return', async () => {
  const assets = projectileAssets(base, selfVectors);
  for (const [hasForeign, alias] of [[false, true], [true, true], [true, false]]) await withBattle(battle => {
    const records = record(266, 2, [0, ...(hasForeign ? [10, 1, 7] : []), 0, 0x4000, 12,
      0, ...(alias ? [0x4200, 7, 0] : [0x4000, 7])]) + 'CFP|0|2|';
    assert.equal(first(battle, records).kind, 'command-strike');
    const flights = new Set(), hp = [];
    let catchPass = -1, selfPass = -1;
    stepUntil(battle, (step, pass) => {
      const caster = snapshot(battle)[0];
      for (const node of battle.copyState().playback.nodes) {
        if (node.physical?.role === 'multi') flights.add(node.id);
        assert.notEqual(node.state, 217);
      }
      for (const row of step.body.events) {
        if (row.kind === 'battle-vital' && row.field === 'HP') {
          hp.push([row.slot, row.before, row.value]);
          if (row.slot === 0) selfPass = pass;
        }
        if (row.kind === 'sound' && row.value === 0xd8 && flights.has(row.nodeId)) {
          assert.equal(catchPass, -1);
          assert.ok(caster.state === 216 || caster.vitals[0] === 77);
          catchPass = pass;
        }
      }
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.equal(flights.size, Number(hasForeign));
    assert.ok(selfPass >= 0);
    if (hasForeign) assert.ok(catchPass >= 0 && selfPass >= catchPass && selfPass - catchPass <= 1);
    else assert.equal(catchPass, -1);
    assert.deepEqual(hp, hasForeign ? [[10, 70, 63], [0, 70, 77]] : [[0, 70, 77]]);
    assert.deepEqual([0, 10].map(slot => snapshot(battle)[slot].vitals),
      [[77, 100, 5, 10], [hasForeign ? 63 : 70, 100, 10, 10]]);
  }, { assets, slots: [0, 10] });
});

test('SKL266 reuses its flying object to release the guard and return to the caster', async () => {
  const assets = projectileAssets(base, selfVectors);
  for (const guard of [1, 10]) await withBattle(battle => {
    const records = record(266, 2, [0, 10, 1, 7, 0, 0x4200, 7, guard]) + 'CFP|0|2|';
    assert.equal(first(battle, records).kind, 'command-strike');
    const states = [], flights = new Set(), hp = [];
    stepUntil(battle, step => {
      const child = battle.copyState().playback.nodes.find(node => node.physical?.role === 'multi');
      if (child) {
        flights.add(child.id);
        if (states.at(-1) !== child.state) states.push(child.state);
      }
      hp.push(...step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'HP'));
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.equal(flights.size, 1);
    assert.deepEqual(states.slice(states.indexOf(71)), [71, 24, 217, 21, 22]);
    const beforeGuard = guard === 10 ? 63 : 70;
    assert.deepEqual(hp.map(row => [row.slot, row.before, row.value]),
      [[10, 70, 63], [guard, beforeGuard, beforeGuard + 7]]);
    assert.equal(snapshot(battle)[0].vitals[2], 5);
  }, { assets });
});

test('a guard that departs during the second flight leaves the foreign result and successor intact', async () => {
  const assets = projectileAssets(base, selfVectors);
  const records = record(266, 2, [0, 10, 1, 7, 0, 0x4200, 7, 1]) + 'CFP|0|2|';
  await withBattle(battle => {
    assert.equal(first(battle, records).kind, 'command-strike');
    stepUntil(battle, () => battle.copyState().playback.nodes.some(node => node.state === 217), 500);
    const replacement = [51, 100, 4, 10];
    battle.removeCharacter(1);
    battle.applyCharacter(1, 0, 100060, [0, 0], replacement);
    stepUntil(battle, step => {
      assert.equal(step.body.events.some(row => row.kind === 'battle-vital' && row.field === 'HP'), false);
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.deepEqual([0, 1, 10].map(slot => snapshot(battle)[slot].vitals),
      [[70, 100, 5, 10], replacement, [63, 100, 10, 10]]);
  }, { assets });
});

test('SKL266 without a flight target settles its final self result on a distinct guard', async () => {
  const records = record(266, 2, [0, 0, 0x4000, 12, 0, 0x4200, 7, 1]) + 'CFP|0|2|';
  const assets = projectileAssets(base, selfVectors);
  await withBattle(battle => {
    assert.equal(first(battle, records).kind, 'command-strike');
    const hp = [];
    let applied216 = false;
    stepUntil(battle, step => {
      const state = battle.copyState();
      applied216 ||= state.bodies.bodies[1].state === 216;
      assert.ok(state.playback.nodes.every(node => node.kind !== 'physical-arrow' && !node.physical));
      hp.push(...step.body.events.filter(row => row.kind === 'battle-vital' && row.field === 'HP'));
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.equal(applied216, true);
    assert.deepEqual(hp.map(row => [row.slot, row.before, row.value]), [[1, 70, 77]]);
    assert.deepEqual([snapshot(battle)[0].vitals, snapshot(battle)[1].vitals, snapshot(battle)[10].vitals],
      [[70, 100, 5, 10], [77, 100, 10, 10], vitals]);
  }, { assets });
});

test('positive empty and self-only producers keep their source tail without a flight wait', () => {
  const get = slot => slot === 0 ? { vitals, state: 0, dynamicFlags: 0 } : null;
  for (const category of classes.filter(category => category !== 72 && category !== 113)) {
    for (const variant of [1, 2, 3]) {
      const lists = [[]];
      if (category !== 73) lists.push([0, 0x4000, 7]);
      if (category !== 73 && (category !== 266 || variant !== 2)) lists.push([0, 0x4200, 7, 11]);
      for (const targets of lists) {
        const plan = game.planBattlePhysicalFamily(command(record(category, variant, [0, ...targets])), get, 0, 0, true);
        assert.equal(plan.kind, 'physical-family-plan');
        assert.deepEqual(plan.rows.map(row => row.slot), [0]);
        const row = plan.rows[0];
        assert.equal(row.assignments.physicalFamily, 1);
        assert.equal(row.actions.includes(41), false);
        assert.equal(row.actions.includes(216), category === 266 && variant === 2 && targets.length !== 0);
        assert.ok(row.actions.includes(variant === 3 ? 18 : 15));
        assert.equal(row.actions.includes(53), category !== 73);
      }
    }
  }
  const guarded = command(record(266, 2, [0, 0, 0x4200, 7, 1]));
  const plan = game.planBattlePhysicalFamily(guarded, () => ({ vitals, state: 0, dynamicFlags: 0 }), 0, 0, true);
  assert.equal(plan.kind, 'physical-family-plan');
  assert.ok(plan.rows.every(row => !row.actions.includes(41)));
  assert.ok(plan.rows.find(row => row.slot === 1).actions.includes(216));
  for (const category of [258, 259, 266]) {
    const levelNine = game.planBattlePhysicalFamily(command(record(category, 2, [0, 0, 0x4000, 7], 9)), get, 0, 0, true);
    assert.equal(levelNine.kind, 'physical-family-plan');
    assert.ok(levelNine.rows[0].actions.includes(240));
    assert.equal(levelNine.rows[0].actions.includes(41), false);
  }
});

test('targetless emitters still animate and finish and SKL266 settles its own result without a projectile', async () => {
  const assets = projectileAssets(base, selfVectors);
  for (const [category, variant, targets, hp, mp] of [
    [266, 1, [0, 0x4000, 7], 70, 5], [266, 2, [0, 0x4000, 12, 0, 0x4000, 7], 77, 5], [266, 3, [0, 0x4000, 7], 70, 5],
    [0, 2, [], 70, 5], [73, 2, [], 70, 8],
  ]) await withBattle(battle => {
    const result = first(battle, record(category, variant, [0, ...targets]) + 'CFP|0|2|');
    assert.equal(result.kind, 'command-strike');
    const states = new Set();
    stepUntil(battle, step => {
      states.add(snapshot(battle)[0].state);
      assert.ok(battle.copyState().playback.nodes.every(node => node.kind !== 'physical-arrow' && !node.physical));
      return step.manager.kind === 'battle-round-drained';
    }, 500);
    assert.ok(states.has(variant === 3 ? 18 : 15));
    assert.equal(states.has(41), false);
    assert.equal(states.has(216), hp === 77);
    assert.deepEqual([snapshot(battle)[0].vitals, snapshot(battle)[10].vitals], [[hp, 100, mp, 10], vitals]);
  }, { assets });
});

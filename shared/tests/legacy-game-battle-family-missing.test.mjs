import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as game from '../index.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusSlotFiles } from '../../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs';
import { castingAssets } from '../../analysis/game-battle-casting-v1/original_assets.mjs';
import { castingVectors } from '../../analysis/game-battle-casting-v1/reference.mjs';

const context = { mainState: 10, substate: 6, controlFlags: 0, localSlot: 0, resourceCode: 0, slowEffects: false };
const defaultVitals = [70, 100, 10, 10];
const status = [...Array.from({ length: 29 }, (_, n) => n + 32), 64, 65, 66, 67, 68, 86, 88];
const casting = Array.from({ length: 13 }, (_, n) => n + 19);
const numeric = [61, 62, 63, 83];
const self = new Set([50, 51, 52, 53, 88]);
const categories = [...status, ...casting, ...numeric, 82];
const fixture = statusSlotFiles();
const resourceBase = JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json', import.meta.url)));
const castingFixture = castingAssets(resourceBase, castingVectors);
const record = (category, caster, targets) => 'SKL|' +
  [category * 100 + 1, 3, 15, caster, ...targets, 255].map(n => (n >>> 0).toString(16).toUpperCase()).join('|') + '|';
const motion = records => Uint8Array.from('M|' + records, c => c.charCodeAt(0));
const actions = body => [...body.actions.slice(0, body.actionWrite + 1)];

async function withBattle(run, { slots = [0, 1, 10], assets = fixture, direct = false } = {}) {
  const files = originalFiles(assets);
  const library = game.createLegacyGameResourceLibrary({
    plan: game.createLegacyGameResourcePlan(new Uint8Array()), files: files.port, paletteMode: 'neutral',
  });
  const battle = direct ? game.createLegacyGameBattleBodies() : game.createLegacyGameBattleCommands();
  try {
    await library.initialize();
    const { animations, graphics } = library.catalogs();
    battle[direct ? 'configurePlayback' : 'configureBodyPlayback']({ animations, geometry: library.geometry,
      seed: 12345, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    battle.configureSkills({ graphics });
    battle.configureCastingContext({ entryMode: 1, labelFlag: 0, localSlot: 0 });
    for (const slot of slots) battle.applyCharacter(slot, 0, 100060, [0, 0], defaultVitals);
    return await run(battle);
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

function firstCommand(battle, records) {
  const input = motion(records);
  battle.load(input, { ...context, substate: 5 });
  const { created } = battle.callManager(context);
  assert.equal(created.length, 1);
  const [handle] = created;
  for (let pass = 0; pass < 24; pass++) {
    const result = battle.callCommand(handle, context);
    if (result.kind !== 'command-delay') return { result, input };
  }
  assert.fail('The first command did not leave its delay');
}

test('all 54 classes clear an absent caster before any body queue is written', async () => {
  assert.equal(categories.length, 54);
  for (const category of categories) await withBattle(battle => {
    const targets = self.has(category) ? [] : status.includes(category) && category !== 68 ? [10, 1] : [10, 1, 12];
    const { result } = firstCommand(battle, record(category, 11, targets));
    assert.equal(result.kind, 'command-released', String(category));
    const snapshot = battle.copyState();
    assert.equal(snapshot.activeMask, 0);
    assert.equal(snapshot.bodies.bodies[11], null);
    for (const slot of [0, 1, 10]) {
      const body = snapshot.bodies.bodies[slot];
      assert.deepEqual([body.busy, body.actionWrite, body.tupleWrite, body.vitals], [0, -1, 0, defaultVitals]);
    }
  });
});

test('49 list consumers preserve the caster busy bit and keep the family-specific released terminator', async () => {
  const listCategories = categories.filter(category => !self.has(category));
  assert.equal(listCategories.length, 49);
  for (const category of listCategories) await withBattle(battle => {
    const targets = status.includes(category) && category !== 68 ? [11, 1, 10, 1] : [11, 1, 12, 10, 1, 12];
    const { result } = firstCommand(battle, record(category, 0, targets));
    assert.equal(result.completion?.kind, 'command-released', String(category));
    assert.deepEqual(result.missing, { slot: 11, role: 'target' });
    assert.equal(result.hits, 0);
    assert.deepEqual(result.actors, [0]);
    const [caster, , , , , , , , , , target] = battle.copyState().bodies.bodies;
    assert.deepEqual([caster.busy, caster.state, caster.actionWrite, caster.tupleWrite, caster.vitals],
      [1, 0, -1, category === 82 ? 0 : 1, defaultVitals]);
    assert.deepEqual([...caster.tuples.slice(0, 4)], [-1, 0, 0, 0]);
    assert.deepEqual([target.busy, target.actionWrite, target.vitals], [0, -1, defaultVitals]);
  });
});

test('numeric interruption appends the signed reflection to the last reflector after the reset', async () => {
  for (const [category, caster] of [[61, 0], [62, 0], [63, 0], [83, 0], [83, 1]]) await withBattle(battle => {
    const { result } = firstCommand(battle, record(category, caster, [1, 0x10001, 4, 10, 0x10021, -16, 11, 0x10001, 40]));
    assert.equal(result.completion?.kind, 'command-released', String(category));
    assert.deepEqual([result.hits, result.reflectors, result.reflectedAmount], [2, [1, 10], -12]);
    const rows = battle.copyState().bodies.bodies;
    const source = rows[caster], last = rows[10];
    assert.deepEqual(actions(source), [0, 146, 155]);
    assert.deepEqual([source.tupleWrite, source.numberStyle, source.numberValue, source.vitals], [1, 5, -12, defaultVitals]);
    assert.deepEqual(actions(last), [1, 137, 72]);
    assert.deepEqual([...last.tuples.slice(0, 4)], [caster, 0x21, -12, 0]);
    if (caster === 0) assert.deepEqual([rows[1].busy, actions(rows[1])], [1, []]);
  });
});

test('casting interruption uses the missing slot for SKL31 feedback and skips action 74 on the absent body', async () => {
  const scenarios = [
    { category: 19, caster: 0, wireCaster: 0, target: 11, flags: 0x10101, end: [0, 26, 11] },
    { category: 31, caster: 20, wireCaster: 50, target: 2, flags: 0x10001, end: [0, 30, 62, 177, 155] },
  ];
  for (const { category, caster, wireCaster, target, flags, end } of scenarios) await withBattle(battle => {
    const { result } = firstCommand(battle, record(category, wireCaster, [10, flags, 12, target, 0, 0]));
    assert.equal(result.completion?.kind, 'command-released');
    assert.deepEqual(result.missing, { slot: target, role: 'target' });
    assert.deepEqual([result.hits, result.reflectedAmount], [1, 12]);
    const rows = battle.copyState().bodies.bodies;
    assert.deepEqual(actions(rows[caster]), end);
    assert.deepEqual(actions(rows[10]), [1, 137, 72]);
    assert.deepEqual([...rows[10].tuples.slice(0, 4)], [caster, flags & ~0x10000, 12, 0]);
    if (category === 31) assert.deepEqual([rows[caster].numberStyle, rows[caster].numberValue], [5, 6]);
    assert.equal(rows[10].projectileResource, game.battleCastingResources(category, 1).projectile);
  }, { slots: [caster, 10], assets: castingFixture });
});

test('a zero reflected sum emits only the caster terminator on release', async () => {
  await withBattle(battle => {
    const { result } = firstCommand(battle, record(62, 0, [10, 0x10001, 12, 10, 0x10001, -12, 11, 1, 0]));
    assert.equal(result.completion?.kind, 'command-released');
    assert.deepEqual([result.reflectors, result.reflectedAmount], [[10, 10], 0]);
    const rows = battle.copyState().bodies.bodies;
    assert.deepEqual([rows[0].tupleWrite, actions(rows[0]), rows[10].tupleWrite, actions(rows[10])], [1, [], 0, []]);
  });
});

test('a merged successor starts at its validated boundary without the interrupted reflection or attached RID0', async () => {
  const rid = 'RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|OriginalMount|186DC|1C8|0|64|0|A|2|';
  for (const category of [19, 61]) await withBattle(battle => {
    const { result, input } = firstCommand(battle, record(category, 0, [10, 0x10001, 12, 11, 1, 12]) + rid + 'CFP|0|2|');
    const commands = game.decodeLegacyGameBattleMotion(input).commands;
    assert.equal(commands[0].attachedRID, 1);
    assert.equal(result.completion?.kind, 'command-next');
    assert.equal(result.attachedRID, undefined);
    const snapshot = battle.copyState();
    const owner = snapshot.slots[result.handle.slot];
    assert.deepEqual([owner.recordIndex, owner.phase, owner.cursor], [1, 0, commands[1].argumentOffset]);
    for (const slot of [0, 10]) {
      const body = snapshot.bodies.bodies[slot];
      assert.deepEqual([body.busy, body.actionWrite, body.tupleWrite, body.vitals], [1, -1, 0, defaultVitals]);
    }
    assert.equal(battle.callCommand(result.handle, context).kind, 'command-delay');
    const next = battle.callCommand(result.handle, context);
    assert.deepEqual([next.kind, next.before, next.value, next.completion.kind], ['command-mp-cost', 10, 8, 'command-released']);
  }, { assets: castingFixture });
});

test('direct queues still reject a missing target by default and preflight the retained dead-body tail atomically', async () => {
  await withBattle(battle => {
    const command = game.decodeLegacyGameBattleMotion(motion(record(61, 0, [10, 0x10001, 12, 11, 1, 0]))).commands[0];
    const before = battle.copyState();
    assert.equal(battle.queueNumericSkill(command, 1, 0).reason, 'numeric-skill-target');
    assert.deepEqual(battle.copyState(), before);
    battle.applyCharacter(10, 2, 100060, [0, 0], defaultVitals);
    battle.appendActions(10, 7, Array(195).fill(0));
    const full = battle.copyState();
    assert.throws(() => battle.queueNumericSkill(command, 1, 0, 0, true), { code: 'LEGACY_BATTLE_BODY_CAPACITY' });
    assert.deepEqual(battle.copyState(), full);
  }, { direct: true });
});

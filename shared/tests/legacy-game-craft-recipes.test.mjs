import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as sourceAPI from '../index.mjs';
import {craftVectors, craftBytes, craftProjection, verifyCraftReceives} from '../../analysis/game-craft-recipes-v1/reference.mjs';
import {cityFixture} from '../../analysis/game-city-water-v1/fixture.mjs';
import {plain} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const api = process.env.MOLI_CRAFT_BUILD ? createRequire(import.meta.url)(resolve(process.env.MOLI_CRAFT_BUILD)) : sourceAPI;
const bytes = text => new TextEncoder().encode(text);

test('independent memory model: all56 recipe rows and280 materials across12 updates and resets', () => {
  assert.equal(verifyCraftReceives(api, assert), 12);
});

test('the skill owner applies the same reference and only resets recipe ids on skill deletion', () => {
  assert.equal(verifyCraftReceives(api, assert, 'skills'), 12);
});

test('recipe replies retain skill roster versions and cannot change another skill slot', () => {
  const owner = api.createLegacyGamePlayerSkills();
  try {
    const roster = owner.copyState(), other = craftProjection(owner.copyCraft(1));
    owner.applyCraft(0, craftBytes(craftVectors.events[1].bytesHex));
    assert.deepEqual(owner.copyState(), roster);
    assert.deepEqual(craftProjection(owner.copyCraft(1)), other);
    const snapshot = owner.copyCraft(0);
    snapshot.recipes[0].nameBytes.fill(0);
    snapshot.recipes[0].materials[0].nameBytes.fill(0);
    assert.deepEqual(craftProjection(owner.copyCraft(0)), craftVectors.events[1].expected);
  } finally { owner.close(); }
});

test('owned reply bytes, explicit slot bounds and close preserve recipe lifetime', () => {
  const owner = api.createLegacyGameCraftRecipes(), raw = craftBytes(craftVectors.events[1].bytesHex);
  owner.apply(0, raw); raw.fill(0);
  const before = craftProjection(owner.copy(0));
  assert.deepEqual(before, craftVectors.events[1].expected);
  for (const slot of [-1, 15, 100, 0.5]) {
    assert.throws(() => owner.apply(slot, bytes('1|')), {code: 'LEGACY_CRAFT_SLOT'});
    assert.deepEqual(craftProjection(owner.copy(0)), before);
  }
  owner.close(); owner.close();
  assert.throws(() => owner.copy(0), {code: 'LEGACY_CRAFT_CLOSED'});
  const fresh = api.createLegacyGameCraftRecipes();
  try { assert.deepEqual(craftProjection(fresh.copy(0)), craftVectors.events[0].expected); }
  finally { fresh.close(); }
});

test('actual client/session automatically queries kind1, receives recipes, deletes and requeries on the same connection', async () => {
  const h = await cityFixture(api), {f} = h;
  const encodeInt = n => Buffer.from(api.encodeLegacyGameInteger(n));
  const offer = (tag, args, raw) => h.send(Buffer.concat([
    Buffer.from(tag + ' '), ...args.flatMap(n => [encodeInt(n), Buffer.from(' ')]),
    Buffer.from(api.encodeLegacyGameTextField(raw)), Buffer.from(' '),
  ]));
  const header = bytes('3|1|OriginalCraft|1|2|3|4|1|1|0|5|');
  const query = async () => {
    const writes = f.writes.length;
    await offer('J<=', [], header);
    await f.drive(() => f.writes.length > writes);
    assert.equal(f.writes.length, writes + 1);
    assert.equal(Buffer.from(plain(f.writes.at(-1)), 'hex').toString(), "'<4 3 ");
  };
  try {
    const session = f.client.session(), baseline = f.client.copyPlayerCraftRecipes(3);
    assert.equal(baseline.version, 0);
    await query();
    for (const event of craftVectors.client_events) {
      if (event.label === 'requery-reply') await query();
      if (event.label === 'delete') await offer('J<=', [], bytes('3|0||-1|-1|'));
      else await offer('@_i', [3], craftBytes(event.bytesHex));
      await f.drive(() => f.client.copyPlayerCraftRecipes(3).version === event.expected.version);
      assert.deepEqual(craftProjection(f.client.copyPlayerCraftRecipes(3)), event.expected, event.label);
      assert.equal(f.client.session(), session);
      assert.equal(f.client.inspect().state, 'playing');
    }
    assert.equal(f.stats.closeCalls, 0);
    assert.equal(f.client.copyBattleState().roundCounter, 0);
  } finally { h.close(); }
  assert.throws(() => f.client.copyPlayerCraftRecipes(3), {code: 'LEGACY_CLIENT_CLOSED'});
});

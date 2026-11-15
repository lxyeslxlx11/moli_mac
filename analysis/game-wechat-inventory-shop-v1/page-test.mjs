/** Actual native Page actions, source or generated host, and independent loopback peers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEGACY_GAME_INPUT_PROFILE } from '../../shared/legacy-game-input.mjs';
import { peerFor } from '../../build/analysis/game-battle-shared-storage-v1/chat-presentation/tcp-flow.mjs';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage224-page-final';
await import('../game-wechat-creation-v1/page-test.mjs');
const { environment, until, cleared, enter, event, project, variant } = await import('../game-wechat-page-v1/page-test.mjs');

async function scriptPeer(script) {
  const child = spawn('python3', ['-B', script], { stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdin.on('error', () => {});
  let diagnostics = '';
  child.stderr.on('data', chunk => { diagnostics += chunk; });
  const lines = createInterface({ input: child.stdout }), replies = lines[Symbol.asyncIterator]();
  const exited = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', resolve);
  });
  exited.catch(() => {});
  async function next() {
    const row = await replies.next();
    assert.equal(row.done, false, diagnostics);
    return JSON.parse(row.value);
  }
  async function close() {
    child.stdin.end();
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    await exited;
    lines.close();
  }
  try {
    return {
      port: (await next()).port, close,
      send(name) { child.stdin.write(name + '\n'); },
      async stage(name) { assert.equal((await next()).stage, name); },
      async receipt() {
        const result = await next();
        assert.equal(await exited, 0, diagnostics);
        return result;
      },
    };
  } catch (error) {
    await close();
    throw error;
  }
}

const entryPeer = () => scriptPeer(fileURLToPath(new URL('commerce-entry-peer.py', import.meta.url)));

async function withGame(mode, exercise, flowPrefix = 'inventory-shop', openPeer = null) {
  const peer = await (openPeer ? openPeer() : mode === 'commerce-entry' ? entryPeer() : peerFor(mode));
  const env = environment(peer), page = env.startPage(), openedAt = Date.now();
  try {
    await enter(env, page, peer);
    const evidence = await exercise({ env, page, peer, openedAt });
    let movementElapsed = null;
    if (mode !== 'pickup') {
      await until(page, view => view.canTouch &&
        Date.now() - openedAt >= LEGACY_GAME_INPUT_PROFILE.destinationInterval);
      if (page.data.interact) page.onInteract();
      peer.send('move');
      movementElapsed = Date.now() - openedAt;
      env.tapMap(page);
      await peer.stage('moves-verified');
    }
    peer.send('release');
    await peer.stage('released');
    page.onDisconnect();
    cleared(env, page);
    assert.equal(page.data.inventory, null);
    assert.equal(page.data.shop, null);
    const receipt = await peer.receipt();
    assert.equal(receipt.normal_startup_requests_verified, 5);
    assert.equal(receipt.official_session, false);
    assert.equal(receipt.no_duplicate_or_invented_actions, true);
    console.log(JSON.stringify({ variant, flow: flowPrefix + '-' + mode, receipt,
      movement_elapsed_lower_bound_ms: movementElapsed, ...evidence }));
    return receipt;
  } finally {
    page.onUnload();
    await peer.close();
  }
}

const phase = async (peer, command, stage) => {
  peer.send(command);
  await peer.stage(stage);
};
async function phaseAndReadFrame({ env, page, peer }, command, stage) {
  const socket = env.sockets[0], fragments = [];
  const readFrame = ({ message }) => fragments.push(Buffer.from(message));
  socket.onMessage(readFrame);
  try {
    await phase(peer, command, stage);
    let frame;
    await until(page, () => {
      frame = Buffer.concat(fragments);
      return frame.length >= 4 && frame.length >= frame.readUInt16LE(2) + 6;
    });
    assert.equal(frame.length, frame.readUInt16LE(2) + 6);
    assert.equal(frame.readUInt16BE(0), 0xafef);
    assert.equal(frame.readUInt16BE(frame.length - 2), 0xefaf);
  } finally {
    socket.offMessage(readFrame);
  }
}
const bagAction = (page, action, data = {}) => page.onInventory(event({ action, ...data }));
const slot = (page, index) => page.data.inventory?.groups.flatMap(group => group.rows).find(row => row.slot === index);
const select = (page, index, revision = slot(page, index).revision) => bagAction(page, 'select', { slot: index, revision });
const choose = (page, action, row, value, revision = page.data.shop.revision) => page.onShop({
  ...event({ action, row, revision }), detail: { value },
});
const offer = async (page, direction) => (await until(page, view => view.shop?.direction === direction)).shop;
const quantity = async (page, row, value) => assert.equal(await choose(page, 'quantity', row, String(value)), true);
const service = async (page, row) => assert.equal(await choose(page, 'toggle', row), true);

async function approach({ env, page, peer, openedAt }, observed) {
  await until(page, view => view.canTouch && Date.now() - openedAt > 500);
  page.onInteract();
  env.tapMap(page);
  await peer.stage(observed);
}

async function confirm(page, peer, verified) {
  const revision = page.data.shop.revision;
  const pending = choose(page, 'confirm', undefined, undefined, revision);
  assert.equal(await choose(page, 'confirm', undefined, undefined, revision), false);
  assert.equal(await pending, true);
  await peer.stage(verified);
}

async function order(page, peer, prefix, verified = prefix + '-verified') {
  assert.equal(await choose(page, 'review'), true);
  assert.equal(page.data.shop.reviewing, true);
  await phase(peer, prefix + '-review', prefix + '-review-idle');
  await confirm(page, peer, verified);
}

async function leave(page, peer, verified) {
  assert.equal(await choose(page, 'cancel'), true);
  await peer.stage(verified);
  await until(page, view => view.shop === null);
}

export { withGame, phase, phaseAndReadFrame, approach, offer, leave, scriptPeer };

test('native inventory uses, equips, splits, swaps, targets and drops through authoritative slots', { timeout: 40000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/inventory.wxml'), 'utf8');
  assert.match(template, /bindsubmit="onInventorySplit"/);
  assert.match(template, /data-action="confirm-drop"[^>]*bindtap="onInventory"/);
  const receipt = await withGame('ordinary', async ({ env, page, peer }) => {
    assert.equal(await bagAction(page, 'toggle'), true);
    await until(page, () => slot(page, 8)?.name === 'Original Stack');
    assert.deepEqual(page.data.inventory.groups.map(group => group.rows.length), [8, 20]);
    const stale = slot(page, 14).revision;
    assert.equal(await select(page, 8), true);
    assert.equal(await select(page, 14), true);
    assert.equal(page.data.inventory.canSplit, true);
    await phase(peer, 'invalidate', 'invalidated');
    await until(page, () => slot(page, 14).revision !== stale && !page.data.inventory.canMove);
    assert.equal(await select(page, 14, stale), false);
    assert.equal(await select(page, 9), true);
    assert.equal(await bagAction(page, 'use'), true);
    await peer.stage('use-verified');
    assert.equal(slot(page, 9).name, 'Original Tonic');
    peer.send('use-reply');
    await until(page, () => slot(page, 9).name === '空');

    async function move(from, to, expected) {
      assert.equal(await select(page, from), true);
      assert.equal(await select(page, to), true);
      assert.equal(await bagAction(page, 'move'), true);
      await phaseAfterCommand(expected);
    }
    async function phaseAfterCommand(expected) {
      await peer.stage(expected + '-verified');
      peer.send(expected + '-reply');
    }

    await move(10, 2, 'equip');
    await until(page, () => slot(page, 2).name === 'Original Gear');
    await move(2, 16, 'unequip');
    await until(page, () => slot(page, 16).name === 'Original Gear');
    assert.equal(await select(page, 8), true);
    assert.equal(await select(page, 14), true);
    assert.equal(await page.onInventorySplit({ detail: { value: { amount: '7' } } }), false);
    assert.equal(await page.onInventorySplit({ detail: { value: { amount: '2' } } }), true);
    await phaseAfterCommand('split');
    await until(page, () => slot(page, 8).quantity === 4 && slot(page, 14).quantity === 2);
    await move(16, 14, 'swap');
    await until(page, () => slot(page, 14).name === 'Original Gear' && slot(page, 16).quantity === 2);

    assert.equal(await select(page, 11), true);
    const beforeTarget = env.stats.writes.length;
    assert.equal(await bagAction(page, 'use'), true);
    assert.equal(env.stats.writes.length, beforeTarget);
    assert.equal(slot(page, 12).disabled, false);
    assert.equal(await select(page, 12), true);
    await phaseAfterCommand('targeted-use');
    await until(page, () => slot(page, 11).name === '空' && slot(page, 12).name === 'Affected Tonic');
    assert.equal(await select(page, 14), true);
    const beforeDrop = env.stats.writes.length;
    assert.equal(await bagAction(page, 'drop'), true);
    assert.equal(env.stats.writes.length, beforeDrop);
    assert.equal(page.data.inventory.confirmingDrop, true);
    assert.equal(await bagAction(page, 'confirm-drop'), true);
    await phaseAfterCommand('drop');
    await peer.stage('inventory-updated');
    await until(page, () => slot(page, 14).name === '空');
    return { stale_selection_rejected: true, confirmed_drop: true, server_owned_slots: true };
  });
  assert.equal(receipt.commands_verified.length, 7);
});

test('native drop and pickup return the server-owned item to the backpack', { timeout: 40000 }, async () => {
  const receipt = await withGame('pickup', async ({ env, page, peer, openedAt }) => {
    assert.equal(await bagAction(page, 'toggle'), true);
    await until(page, () => slot(page, 8)?.name === 'FloorTonic');
    await select(page, 8);
    await bagAction(page, 'drop');
    assert.equal(await bagAction(page, 'confirm-drop'), true);
    await peer.stage('drop-verified');
    assert.equal(slot(page, 8).name, 'FloorTonic');
    await phase(peer, 'drop-reply', 'drop-applied');
    await until(page, () => slot(page, 8).name === '空');
    await bagAction(page, 'toggle');
    function tapAt(x, y) {
      env.touch(page, 'start', x * 400 / 320, y * 300 / 240);
      env.touch(page, 'end', x * 400 / 320, y * 300 / 240);
    }
    await until(page, () => Date.now() - openedAt > 500);
    const beforeWalk = env.frames.length;
    tapAt(192, 96);
    await peer.stage('walk-verified');
    await until(page, () => env.frames.length >= beforeWalk + 45);
    page.onInteract();
    tapAt(128, 144);
    await peer.stage('pickup-verified');
    const pickedAt = Date.now();
    await phase(peer, 'pickup-reply', 'pickup-applied');
    await until(page, () => Date.now() - pickedAt > 500);
    tapAt(160, 120);
    await peer.stage('coin-verified');
    await phaseAndReadFrame({ env, page, peer }, 'coin-reply', 'coin-applied');
    assert.equal(await bagAction(page, 'toggle'), true);
    await until(page, () => slot(page, 9).name === 'FloorTonic');
    return { returned_to_bag: true, ground_coin_request: true, coin_reply_received: true };
  });
  assert.equal(receipt.commands_verified.filter(([tag]) => tag === '&?S').length, 2);
});

test('native purchase and sale review check price, capacity and stale quoted slots', { timeout: 40000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/shop.wxml'), 'utf8');
  assert.match(template, /data-action="quantity"[^>]*bindinput="onShop"/);
  assert.match(template, /data-action="confirm"[^>]*bindtap="onShop"/);
  await withGame('shop', async context => {
    const { page, peer } = context;
    await approach(context, 'shop-actor-verified');
    await phase(peer, 'buy', 'buy-opened');
    await offer(page, 'buy');
    assert.equal(page.data.shop.rows[0].name, 'Herb|Leaf');
    await quantity(page, 0, 21);
    assert.equal(page.data.shop.canReview, false);
    await quantity(page, 0, 2);
    await quantity(page, 2, 1);
    assert.deepEqual([page.data.shop.quote.total, page.data.shop.quote.requiredBagSlots], [31, 2]);
    await order(page, peer, 'buy');
    await until(page, view => view.canInventory);
    assert.equal(await bagAction(page, 'toggle'), true);
    assert.equal(slot(page, 11).name, '空');
    await bagAction(page, 'toggle');
    await phase(peer, 'buy-reply', 'sale-opened');
    const stale = (await offer(page, 'sell')).revision;
    await quantity(page, 1, 2);
    assert.equal(await choose(page, 'review'), true);
    await phase(peer, 'invalidate-sale', 'sale-invalidated');
    await until(page, view => view.shop?.rows[1].maximum === 0 && !view.shop.reviewing);
    assert.equal(await choose(page, 'confirm', undefined, undefined, stale), false);
    await phase(peer, 'new-sale', 'new-sale-opened');
    await until(page, view => view.shop?.direction === 'sell' && view.shop.revision !== stale);
    await quantity(page, 1, 2);
    await quantity(page, 0, 1);
    assert.equal(page.data.shop.quote.total, 25);
    await order(page, peer, 'sale');
    await phase(peer, 'sale-reply', 'cancel-opened');
    await offer(page, 'buy');
    assert.match(page.data.shop.balance, /94/);
    await leave(page, peer, 'cancel-verified');
    assert.equal(await bagAction(page, 'toggle'), true);
    assert.equal(slot(page, 11).name, 'Herb|Leaf');
    assert.equal(slot(page, 8).quantity, 1);
    return { stale_quote_rejected: true, purchase_and_sale: true };
  });
});

test('native appraisal and repair respond to gold and slot changes', { timeout: 40000 }, async () => {
  await withGame('service', async context => {
    const { page, peer } = context;
    await approach(context, 'service-actor-verified');
    await phase(peer, 'appraise', 'appraise-opened');
    await offer(page, 'appraise');
    await service(page, 1);
    await service(page, 0);
    assert.match(page.data.shop.notice, /金币不足/);
    await phase(peer, 'appraise-funds', 'appraise-funded');
    await until(page, view => view.shop?.quote?.total === 12);
    await order(page, peer, 'appraise');
    await phase(peer, 'appraise-reply', 'repair-opened');
    const stale = (await offer(page, 'repair')).revision;
    await service(page, 0);
    assert.equal(await choose(page, 'review'), true);
    await phase(peer, 'repair-stale', 'repair-stale-sent');
    await until(page, view => view.shop?.rows[0].maximum === 0);
    assert.equal(await choose(page, 'confirm', undefined, undefined, stale), false);
    await phase(peer, 'repair-refresh', 'repair-refreshed');
    await until(page, view => view.shop?.direction === 'repair' && view.shop.revision !== stale);
    await service(page, 0);
    assert.equal(page.data.shop.quote.total, 8);
    await order(page, peer, 'repair');
    await phase(peer, 'repair-reply', 'service-cancel-opened');
    await offer(page, 'repair');
    await leave(page, peer, 'service-cancel-verified');
    await bagAction(page, 'toggle');
    assert.equal(slot(page, 8).name, 'Appraised Amulet');
    await select(page, 9);
    assert.match(page.data.inventory.description, /Durability 30\/30/);
    return { refreshed_funds: true, stale_repair_rejected: true, server_description: true };
  });
});

test('native exchange checks voucher funds and capacity released by payment', { timeout: 40000 }, async () => {
  await withGame('exchange', async context => {
    const { page, peer } = context;
    await approach(context, 'exchange-actor-verified');
    await phase(peer, 'exchange', 'exchange-opened');
    await offer(page, 'exchange');
    assert.equal(page.data.shop.freeBagSlots, 0);
    assert.match(page.data.shop.balance, /Market Token 23/);
    await quantity(page, 0, 13);
    assert.match(page.data.shop.notice, /兑换物不足/);
    await phase(peer, 'exchange-invalid', 'exchange-invalid-idle');
    await quantity(page, 0, 4);
    await quantity(page, 1, 2);
    assert.deepEqual([page.data.shop.quote.total, page.data.shop.quote.releasedBagSlots], [14, 2]);
    assert.equal(await choose(page, 'review'), true);
    await phase(peer, 'exchange-stale', 'exchange-stale-sent');
    await until(page, view => view.shop?.notice.includes('背包空位不足'));
    assert.equal(await choose(page, 'confirm'), false);
    await phase(peer, 'exchange-reprice', 'exchange-restored');
    await until(page, view => view.shop?.quote?.releasedBagSlots === 2);
    await order(page, peer, 'exchange');
    await phase(peer, 'exchange-reply', 'exchange-cancel-opened');
    await offer(page, 'exchange');
    await leave(page, peer, 'exchange-cancel-verified');
    await bagAction(page, 'toggle');
    assert.deepEqual([slot(page, 8).name, slot(page, 12).name], ['Silk', 'Dye']);
    return { exchange_space_repriced: true, server_settlement_visible: true };
  });
});

test('native conversion uses quota and holding variants with fresh limits', { timeout: 40000 }, async () => {
  await withGame('conversion', async context => {
    const { page, peer } = context;
    await approach(context, 'conversion-actor-verified');
    await phase(peer, 'conversion', 'conversion-quota-opened');
    await offer(page, 'conversion');
    await quantity(page, 0, 3);
    assert.equal(page.data.shop.quote.total, 6);
    await order(page, peer, 'quota', 'conversion-quota-verified');
    await phase(peer, 'quota-reply', 'conversion-holding-opened');
    await offer(page, 'conversion');
    await quantity(page, 0, 3);
    assert.equal(await choose(page, 'review'), true);
    await phase(peer, 'conversion-stale', 'conversion-gold-changed');
    await until(page, view => view.shop?.rows[0].maximum === 2 && !view.shop.reviewing);
    assert.equal(await choose(page, 'confirm'), false);
    await phase(peer, 'conversion-empty', 'conversion-holding-changed');
    await until(page, view => view.shop?.rows[0].maximum === 0);
    await phase(peer, 'conversion-restore', 'conversion-restored');
    await until(page, view => view.shop?.rows[0].maximum === 4);
    await quantity(page, 0, 4);
    assert.equal(page.data.shop.quote.total, 12);
    await order(page, peer, 'holding', 'conversion-holding-verified');
    await phase(peer, 'holding-reply', 'conversion-cancel-opened');
    await offer(page, 'conversion');
    await leave(page, peer, 'conversion-cancel-verified');
    return { two_conversion_variants: true, stale_gold_rejected: true };
  });
});

test('native merchant and exchange menus lead to their shop windows over TCP', { timeout: 40000 }, async () => {
  const receipt = await withGame('commerce-entry', async context => {
    const { page, peer } = context;
    await approach(context, 'commerce-actor-verified');
    await phase(peer, 'merchant', 'merchant-opened');
    const merchant = (await until(page, view => view.dialog?.title === 'Harbor Merchant')).dialog;
    assert.deepEqual(merchant.choices.map(row => row.label), ['购买', '出售', '不用了']);
    assert.equal(await page.onDialog(event({ bit: 0, choice: 1, revision: merchant.revision })), true);
    await peer.stage('merchant-offer-opened');
    await offer(page, 'buy');
    await quantity(page, 0, 1);
    assert.equal(page.data.shop.quote.total, 8);
    assert.equal(await choose(page, 'review'), true);
    await confirm(page, peer, 'merchant-order-verified');
    await phase(peer, 'exchange-menu', 'exchange-menu-opened');
    const exchange = (await until(page, view => view.dialog?.title === 'Token Trader')).dialog;
    assert.deepEqual(exchange.choices.map(row => row.label), ['兑换物品', '不用了']);
    assert.equal(await page.onDialog(event({ bit: 0, choice: 1, revision: exchange.revision })), true);
    await peer.stage('exchange-offer-opened');
    await offer(page, 'exchange');
    await leave(page, peer, 'exchange-cancel-verified');
    return { merchant_purchase_route: true, exchange_cancel_route: true };
  });
  assert.equal(receipt.commerce_actions_verified, 4);
});

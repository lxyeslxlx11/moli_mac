/** Native Page storage and trade handlers using independent loopback peers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage226-page-final';
await import('../game-wechat-map-services-v1/page-test.mjs');
const { withGame, phase, approach, scriptPeer } = await import('../game-wechat-inventory-shop-v1/page-test.mjs');
const { event, until, project } = await import('../game-wechat-page-v1/page-test.mjs');

function bankAct(page, action, value, view = page.data.bank) {
  const option = action === 'tab' || action === 'direction' ? value : undefined;
  return page.onBank({ ...event({ action, option, revision: view.revision, version: view.version }),
    detail: { value: option === undefined ? value : undefined } });
}
const bankPanel = async (page, title) => (await until(page, data => data.bank?.title === title)).bank;
const slotIn = (panel, slot) => panel?.sources.find(row => row.slot === slot);
async function chooseSlots(page, from, to, amount) {
  const index = page.data.bank.sources.findIndex(row => row.slot === from);
  assert.ok(index >= 0, 'missing source slot ' + from);
  assert.equal(await bankAct(page, 'from', String(index)), true);
  const target = page.data.bank.destinations.findIndex(row => row.slot === to);
  assert.ok(target >= 0, 'missing destination slot ' + to);
  assert.equal(await bankAct(page, 'to', String(target)), true);
  if (amount !== undefined) assert.equal(await bankAct(page, 'amount', amount), true);
}
async function submitBank(page) {
  const panel = page.data.bank;
  assert.equal(panel.canSubmit, true);
  const pending = bankAct(page, 'submit');
  assert.equal(await bankAct(page, 'submit', undefined, panel), false);
  assert.equal(await pending, true);
}

export { bankAct, bankPanel, slotIn, chooseSlots, submitBank };

test('native storage moves items, pets and gold and keeps server-owned balances', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/bank.wxml'), 'utf8');
  assert.match(template, /wx:for="{{bank.mounts}}"[^>]*data-action="from"[^>]*bindchange="onBank"/);
  assert.match(template, /data-action="submit"[^>]*bindtap="onBank"/);
  await withGame('bank', async context => {
    const { page, peer } = context;
    await approach(context, 'bank-actor');
    await phase(peer, 'bank-open', 'bank-opened');
    const opened = await bankPanel(page, '银行');
    assert.equal(page.data.dialog, null);
    assert.equal(page.data.canTouch, false);
    assert.equal(page.data.canTrade, false);
    assert.deepEqual([opened.balance, opened.wallet, slotIn(opened, 8).quantity], [999990, 50, 6]);
    assert.equal(slotIn(opened, 9), undefined);
    await chooseSlots(page, 8, 101, '7');
    assert.equal(page.data.bank.maximum, 6);
    assert.equal(await bankAct(page, 'submit'), false);
    await phase(peer, 'bank-invalid', 'bank-invalid-local');
    assert.equal(await bankAct(page, 'amount', '2'), true);
    const deposit = page.data.bank;
    await submitBank(page);
    await peer.stage('bank-item-deposited');
    assert.equal(page.data.bank.busy, true);
    assert.equal(slotIn(page.data.bank, 8).quantity, 6);
    assert.equal(slotIn(page.data.bank, 101), undefined);
    await phase(peer, 'bank-item-settle', 'bank-item-stored');
    await until(page, view => slotIn(view.bank, 101)?.quantity === 2 && slotIn(view.bank, 8)?.quantity === 4);
    assert.equal(await bankAct(page, 'from', '0', deposit), false);
    await chooseSlots(page, 103, 10);
    assert.match(page.data.bank.description, /Keep\s+sealed/);
    await submitBank(page);
    await peer.stage('bank-item-taken');
    await until(page, view => !slotIn(view.bank, 103) && slotIn(view.bank, 10)?.quantity === 7);
    assert.equal(await bankAct(page, 'tab', 'pet'), true);
    assert.equal(slotIn(page.data.bank, 1).name, 'Moth');
    await chooseSlots(page, 1, 102);
    await submitBank(page);
    await peer.stage('bank-pet-stored');
    await until(page, view => slotIn(view.bank, 102)?.name === 'Moth' && !slotIn(view.bank, 1));
    await chooseSlots(page, 104, 4);
    await submitBank(page);
    await peer.stage('bank-pet-taken');
    await until(page, view => slotIn(view.bank, 4)?.name === 'Bank Finch' && !slotIn(view.bank, 104));

    assert.equal(await bankAct(page, 'tab', 'gold'), true);
    assert.equal(page.data.bank.maximum, 10);
    assert.equal(await bankAct(page, 'amount', '11'), true);
    assert.equal(await bankAct(page, 'submit'), false);
    assert.equal(await bankAct(page, 'amount', '10'), true);
    await submitBank(page);
    await peer.stage('bank-gold-stored');
    await until(page, view => view.bank?.balance === 1000000 && view.bank.wallet === 40);
    assert.equal(await bankAct(page, 'direction', 'withdraw-gold'), true);
    assert.equal(await bankAct(page, 'amount', '5'), true);
    await submitBank(page);
    await peer.stage('bank-gold-taken');
    await until(page, view => view.bank?.balance === 999995 && view.bank.wallet === 45);
    assert.equal(page.data.bank.revision, opened.revision);
    assert.equal(await bankAct(page, 'close'), true);
    await peer.stage('bank-local-close');
    await phase(peer, 'warehouse-open', 'warehouse-opened');
    const warehouse = await bankPanel(page, '仓储');
    assert.equal(warehouse.balance, 123);
    assert.equal(await bankAct(page, 'close', undefined, opened), false);
    await phase(peer, 'warehouse-mismatch', 'warehouse-remains');
    assert.equal(page.data.bank.revision, warehouse.revision);
    await phase(peer, 'warehouse-close', 'warehouse-closed');
    await until(page, view => view.bank === null);
    return { deposit_quantity: 2, gold_cap: 1000000, warehouse_balance: 999995, wallet: 45,
      storage_version_guard: true, authoritative_settlement: true, server_close_reply: true };
  }, 'storage-trade');
});

test('native storage feed box filters sources and closes silently', { timeout: 45000 }, async () => {
  const feedPeer = fileURLToPath(new URL('./feed-box-peer.py', import.meta.url));
  await withGame('feed-box', async context => {
    const { env, page, peer } = context;
    await approach(context, 'feed-box-actor');
    await phase(peer, 'feed-box-open', 'feed-box-opened');
    const opened = await bankPanel(page, '饲料箱');
    assert.deepEqual(opened.tabs, []);
    assert.deepEqual(opened.sources.map(row => row.slot), [8, 9, 103]);
    assert.equal(await bankAct(page, 'tab', 'gold'), false);
    assert.equal(await bankAct(page, 'from', '3'), false);
    await phase(peer, 'feed-box-invalid', 'feed-box-invalid-local');
    await chooseSlots(page, 8, 101, '1');
    await submitBank(page);
    await peer.stage('feed-box-storing');
    assert.equal(page.data.bank.busy, true);
    await phase(peer, 'feed-box-settle', 'feed-box-stored');
    await until(page, view => slotIn(view.bank, 101)?.quantity === 1 && slotIn(view.bank, 8)?.quantity === 1);
    await chooseSlots(page, 103, 13);
    await submitBank(page);
    await peer.stage('feed-box-taken');
    await until(page, view => slotIn(view.bank, 13)?.quantity === 7 && !slotIn(view.bank, 103));
    const before = env.stats.writes.length;
    assert.equal(await bankAct(page, 'close'), true);
    assert.equal(env.stats.writes.length, before);
    await phase(peer, 'feed-box-local-close', 'feed-box-local-closed');
    await phase(peer, 'feed-box-reopen', 'feed-box-reopened');
    await bankPanel(page, '饲料箱');
    await phase(peer, 'feed-box-server-close', 'feed-box-server-closed');
    await until(page, view => view.bank === null);
    assert.equal(env.stats.writes.length, before);
    return { filtered_slots: [10, 11, 12], storage_settlement: true, local_and_server_close_silent: true };
  }, 'storage-trade', () => scriptPeer(feedPeer));
});

function tradeAct(page, action, value, rowRevision, view = page.data.trade) {
  return page.onTrade({ ...event({ action, revision: view?.revision, version: view?.version,
    slot: action === 'gold' ? undefined : value, rowRevision }),
    detail: { value: action === 'gold' ? value : undefined } });
}
const tradePanel = async (page, predicate) => (await until(page, view => view.trade && predicate(view.trade))).trade;

test('native trade handles both entry paths and rejects stale confirmation', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/trade.wxml'), 'utf8');
  assert.match(template, /data-action="publish"[^>]*bindtap="onTrade"/);
  assert.match(template, /data-action="confirm"[^>]*bindtap="onTrade"/);
  await withGame('trade', async ({ env, page, peer, openedAt }) => {
    await until(page, view => view.canTrade && Date.now() - openedAt > 500);
    peer.send('trade-start');
    const requestedAt = Date.now() - openedAt;
    assert.equal(await tradeAct(page, 'request'), true, 'request at ' + requestedAt + ' ms: ' + page.data.tradeNotice);
    await peer.stage('trade-query');
    await phase(peer, 'trade-list', 'trade-candidates');
    const candidates = await tradePanel(page, view => view.kind === 'candidates');
    assert.deepEqual(candidates.candidates, [{ id: 0, label: 'First' }, { id: 1, label: 'Partner|North' }]);
    assert.equal(await tradeAct(page, 'select', 2), false);
    assert.equal(await tradeAct(page, 'select', 1), true);
    await peer.stage('trade-selected');
    const opened = await tradePanel(page, view => view.kind === 'open');
    assert.match(opened.title, /Partner\|North/);
    assert.equal(page.data.canTouch, false);
    assert.deepEqual(opened.items.map(row => row.slot), [8, 10]);
    assert.deepEqual(opened.pets.map(row => row.label), ['Own Pet']);
    assert.equal(await tradeAct(page, 'close', undefined, undefined, candidates), false);
    assert.equal(await tradeAct(page, 'item', 9, 0), false);
    assert.equal(await tradeAct(page, 'gold', '26'), true);
    assert.equal(page.data.trade.canPublish, false);
    assert.equal(await tradeAct(page, 'publish'), false);
    const beforeDraft = env.stats.writes.length;
    for (const row of opened.items.toReversed()) assert.equal(await tradeAct(page, 'item', row.slot, row.revision), true);
    const pet = opened.pets[0];
    assert.equal(await tradeAct(page, 'pet', pet.slot, pet.revision), true);
    assert.equal(await tradeAct(page, 'gold', '19'), true);
    assert.equal(env.stats.writes.length, beforeDraft);
    await phase(peer, 'trade-publish', 'trade-ready-publish');
    assert.equal(await tradeAct(page, 'publish'), true);
    const publishedAt = Date.now();
    await peer.stage('trade-published');
    assert.equal(page.data.trade.localPhase, 1);
    assert.equal(page.data.trade.gold, 25);
    assert.equal(await tradeAct(page, 'confirm'), false);
    await phase(peer, 'trade-peer', 'trade-peer-ready');
    const ready = await tradePanel(page, view => view.remotePhase === 1 && Date.now() - publishedAt >= 520);
    assert.equal(ready.remoteGold, 7);
    assert.equal(ready.peerItems[0].label, 'Copper × 2');
    assert.equal(ready.peerItems[0].description, 'Offer details');
    assert.match(ready.peerPets[0].label, /Peer Pet · Pet Nick/);
    assert.equal(ready.peerPets[0].description, '技能 Guard、Bite');
    const firstConfirmElapsed = Date.now() - publishedAt;
    const confirming = tradeAct(page, 'confirm');
    assert.equal(await tradeAct(page, 'confirm', undefined, undefined, ready), false);
    assert.equal(await confirming, true);
    await peer.stage('trade-confirmed');
    await phase(peer, 'trade-peer-confirm', 'trade-peer-confirmed');
    await tradePanel(page, view => view.remotePhase === 2);
    await phase(peer, 'trade-reset', 'trade-peer-withdrawn');
    const reset = await tradePanel(page, view => view.remotePhase === 0);
    assert.deepEqual([reset.localPhase, reset.remoteGold, reset.peerItems.length, reset.peerPets.length], [1, 0, 0, 0]);
    await phase(peer, 'trade-stale', 'trade-stale');
    const stale = await tradePanel(page, view => view.remotePhase === 1 && view.offerStale);
    assert.equal(stale.canConfirm, false);
    assert.equal(await tradeAct(page, 'confirm'), false);
    await phase(peer, 'trade-withdraw', 'trade-ready-withdraw');
    assert.equal(await tradeAct(page, 'withdraw'), true);
    await peer.stage('trade-withdrawn');
    assert.deepEqual(page.data.trade.items.filter(row => row.selected).map(row => row.slot), [8]);
    assert.equal(await tradeAct(page, 'item', 10, opened.items[1].revision), false);
    assert.equal(await tradeAct(page, 'publish', undefined, undefined, stale), false);
    assert.equal(await tradeAct(page, 'publish'), true);
    const republishedAt = Date.now();
    await peer.stage('trade-republished');
    await tradePanel(page, view => view.canConfirm && Date.now() - republishedAt >= 520);
    const secondConfirmElapsed = Date.now() - republishedAt;
    assert.equal(await tradeAct(page, 'confirm'), true);
    await peer.stage('trade-reconfirmed');
    await phase(peer, 'trade-settle', 'trade-ended');
    await until(page, view => !view.trade && view.tradeNotice === '交易已结束。');
    assert.equal(await page.onInventory(event({ action: 'toggle' })), true);
    const bagSlot = () => page.data.inventory.groups.flatMap(group => group.rows).find(row => row.slot === 8);
    assert.equal(bagSlot().name, 'Silk');
    await phase(peer, 'trade-direct', 'trade-direct-opened');
    const direct = await tradePanel(page, view => view.kind === 'open' && /Direct Partner/.test(view.title));
    assert.equal(direct.gold, 20);
    assert.equal(direct.items.find(row => row.slot === 8).label, 'Received Badge × 1');
    assert.equal(page.data.inventory, null);
    assert.equal(await tradeAct(page, 'close'), true);
    await peer.stage('trade-closed');
    await until(page, view => view.trade === null && view.canTouch);
    return { selected_candidate: 1, partner_withdrawal: true, stale_offer_blocked: true, direct_entry: true,
      server_owned_settlement: true, republished_slots: [8], request_elapsed_lower_bound_ms: requestedAt,
      confirmation_elapsed_lower_bounds_ms: [firstConfirmElapsed, secondConfirmElapsed] };
  }, 'storage-trade');
});

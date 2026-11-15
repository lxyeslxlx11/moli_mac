/** WeChat Page bindings through the independent treatment and training TCP peers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage225-page-final';
const { withGame, phase, approach, offer, leave } = await import('../game-wechat-inventory-shop-v1/page-test.mjs');
const { event, until, project } = await import('../game-wechat-page-v1/page-test.mjs');

const service = async (page, kind) => (await until(page, view => view.sceneService?.kind === kind)).sceneService;
const tap = (page, action, choice, revision = page.data.sceneService.revision) =>
  page.onService(event({ action, choice, revision }));
const select = async (page, choice) => assert.equal(await tap(page, 'select', choice), true);
const dismiss = async page => {
  assert.equal(await tap(page, 'leave'), true);
  await until(page, view => view.sceneService === null);
};
const respond = (page, choice, revision = page.data.dialog.revision) =>
  page.onDialog(event({ bit: 0, choice, revision }));
const menu = async (page, title) => (await until(page, view => view.dialog?.title === title)).dialog;

async function confirm(page) {
  const revision = page.data.sceneService.revision;
  const pending = tap(page, 'confirm', undefined, revision);
  assert.equal(await tap(page, 'confirm', undefined, revision), false);
  assert.equal(await pending, true);
}

test('native map services treat one or all and retain illustrated text choices', { timeout: 40000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/services.wxml'), 'utf8');
  assert.match(template, /data-action="select"[^>]*data-choice="{{item.id}}"[^>]*bindtap="onService"/);
  assert.match(template, /data-action="confirm"[^>]*bindtap="onService"/);
  await withGame('dialog', async context => {
    const { env, page, peer } = context;
    await approach(context, 'dialog-actor-verified');
    await phase(peer, 'treatment-open', 'treatment-opened');
    const panel = await service(page, 'treatment');
    assert.equal(page.data.canTouch, false);
    assert.equal(page.data.canChat, false);
    assert.equal(page.data.dialog, null);
    assert.equal(panel.balance, '持有金币 30');
    assert.deepEqual(panel.rows.map(({ id, label }) => [id, label]), [
      [3, 'Wounded|Hero · 等级 20 · 伤势 1 级 · 5 金币'],
      [5, 'Ranger · 等级 23 · 伤势 4 级 · 8 金币'],
      [9, '完整治疗 · 13 金币'],
    ]);
    assert.equal(await tap(page, 'select', 4), false);
    await phase(peer, 'treatment-select', 'treatment-select-ready');
    await select(page, 5);
    await peer.stage('treatment-selected');
    await phase(peer, 'treatment-reopen', 'treatment-reopened');
    await service(page, 'treatment');
    await phase(peer, 'treatment-balance', 'treatment-balance-updated');
    await until(page, view => view.sceneService?.balance === '持有金币 22');
    assert.equal(await tap(page, 'select', 3, panel.revision), false);
    await select(page, 9);
    await peer.stage('treatment-all-verified');
    await phase(peer, 'treatment-cancel', 'treatment-cancel-opened');
    await service(page, 'treatment');
    await dismiss(page);
    await peer.stage('treatment-cancelled');

    await phase(peer, 'illustrate', 'illustrated-opened');
    let view = await until(page, data => data.dialog?.choices.length === 2);
    assert.equal(view.sceneService, null);
    assert.match(view.dialog.choices[1].label, /Continue west/);
    const hasGraphics = Object.hasOwn(view, 'dialogArt');
    let artwork;
    if (hasGraphics) {
      await until(page, data => data.dialogArt?.status === 'ready');
      artwork = env.dialogFrames.at(-1);
      assert.deepEqual([artwork.width, artwork.height, artwork.nonzero], [448, 240, true]);
    }
    assert.equal(await respond(page, 2), true);
    await peer.stage('illustrated-replied');
    const drawn = env.dialogFrames.length;
    await phase(peer, 'missing-art', 'missing-art-opened');
    view = await until(page, data => data.dialog?.lines.some(line => /Text survives/.test(line.text)));
    if (hasGraphics) {
      await until(page, data => data.dialogArt?.status === 'unavailable');
      assert.equal(env.dialogFrames.length, drawn);
    }
    const before = env.stats.writes.length;
    assert.equal(await page.onDismiss(event({ revision: view.dialog.revision })), true);
    assert.equal(env.stats.writes.length, before);
    return { treatment_row: 5, complete_treatment: 9, treatment_cancel: 2,
      ...(hasGraphics ? { ordinary_dialog_artwork: artwork, missing_graphic_preserved_text: true } : { illustrated_text_only: true }) };
  }, 'map-services');
});

test('native map services teach skills and revalidate the forget confirmation', { timeout: 40000 }, async () => {
  await withGame('npc', async context => {
    const { env, page, peer } = context;
    await approach(context, 'npc-actor');
    await phase(peer, 'npc-merchant', 'npc-merchant-opened');
    const merchant = await menu(page, 'Harbor Merchant');
    assert.deepEqual(merchant.choices.map(row => row.choice), [1, 2, 3]);
    const before = env.stats.writes.length;
    assert.equal(await respond(page, 3), true);
    assert.equal(env.stats.writes.length, before);
    peer.send('npc-buy');
    await menu(page, 'Harbor Merchant');
    assert.equal(await respond(page, 1, merchant.revision), false);
    assert.equal(await respond(page, 1), true);
    await peer.stage('npc-buy-opened');
    await offer(page, 'buy');
    await leave(page, peer, 'npc-buy-closed');
    peer.send('npc-leave');
    assert.deepEqual((await menu(page, 'Harbor Merchant')).choices.map(row => row.choice), [2, 3]);
    assert.equal(await respond(page, 3), true);
    await peer.stage('npc-leave-verified');
    peer.send('npc-exchange');
    await menu(page, 'Token Trader');
    assert.equal(await respond(page, 1), true);
    await peer.stage('npc-exchange-opened');
    await offer(page, 'exchange');
    await leave(page, peer, 'npc-exchange-closed');

    peer.send('npc-trainer');
    await service(page, 'trainer');
    await select(page, 1);
    await peer.stage('npc-lesson-opened');
    const lesson = await service(page, 'learn');
    assert.ok(lesson.lines.some(row => row.text === 'Wind Step'));
    assert.ok(lesson.lines.some(row => /2 个技能栏位 · 12 金币/.test(row.text)));
    assert.equal(lesson.balance, '持有金币 22');
    assert.match(lesson.slots, /等待容量同步/);
    await phase(peer, 'npc-update', 'npc-profile-sent');
    await until(page, view => view.sceneService?.balance === '持有金币 16' &&
      view.sceneService.slots === '技能栏位 3 / 8');
    await select(page, 1);
    await peer.stage('npc-learn-verified');
    peer.send('npc-back');
    await service(page, 'learn');
    await select(page, 2);
    await service(page, 'trainer');
    await select(page, 2);
    await peer.stage('npc-forget-opened');
    const forget = await service(page, 'forget');
    assert.deepEqual(forget.rows.map(row => row.id), [2, 1, 99]);
    const beforeReview = env.stats.writes.length;
    await select(page, 2);
    assert.equal(page.data.sceneService.review.text, '确认遗忘 Second？');
    assert.equal(await tap(page, 'back'), true);
    assert.equal(page.data.sceneService.review, null);
    await select(page, 2);
    assert.equal(env.stats.writes.length, beforeReview);
    await phase(peer, 'npc-forget-confirm', 'npc-forget-ready');
    await confirm(page);
    await peer.stage('npc-forget-verified');

    await phase(peer, 'npc-list', 'npc-list-opened');
    await service(page, 'forget');
    await select(page, 2);
    await phase(peer, 'npc-invalidate', 'npc-invalidated');
    const stale = (await until(page, view => view.sceneService?.notice.includes('技能列表已更新'))).sceneService;
    assert.equal(stale.review, null);
    assert.deepEqual(stale.rows.map(row => row.disabled), [true, true, false]);
    assert.equal(await tap(page, 'confirm'), false);
    assert.equal(await tap(page, 'select', 2), false);
    await select(page, 99);
    await peer.stage('npc-back-verified');
    await phase(peer, 'npc-local-close', 'npc-local-close-opened');
    await service(page, 'trainer');
    const beforeClose = env.stats.writes.length;
    await dismiss(page);
    assert.equal(env.stats.writes.length, beforeClose);
    return { forget_choice: 2, stale_confirm_rejected: true, live_capacity_and_gold: true, trainer_close_local: true };
  }, 'map-services');
});

test('native map services train pets in both layouts and guard slot replacement', { timeout: 40000 }, async () => {
  await withGame('pet', async context => {
    const { env, page, peer } = context;
    await approach(context, 'pet-actor');
    await phase(peer, 'pet-offer', 'pet-offer-opened');
    const initial = await service(page, 'pet-offer');
    assert.equal(initial.balance, '持有金币 7');
    assert.equal(initial.notice, '暂无可训练宠物。');
    assert.ok(initial.rows.every(row => row.disabled));
    assert.equal(await tap(page, 'select', 0), false);
    await phase(peer, 'pet-roster', 'pet-roster-sent');
    await until(page, view => view.sceneService?.notice === '' && view.sceneService.rows.every(row => row.disabled));
    await phase(peer, 'pet-gold', 'pet-gold-sent');
    await until(page, view => view.sceneService?.balance === '持有金币 30' &&
      view.sceneService.rows.every(row => !row.disabled));
    await select(page, 1);
    await peer.stage('pet-chooser-opened');
    const pets = await service(page, 'pet-pet');
    assert.deepEqual(pets.rows.map(row => row.disabled), [true, false]);
    assert.equal(await tap(page, 'select', 0), false);
    await select(page, 1);
    await peer.stage('pet-slots-opened');
    await service(page, 'pet-slot');
    const beforeReview = env.stats.writes.length;
    await select(page, 1);
    assert.equal(page.data.sceneService.review.text, '确认在空技能栏 2 学习？');
    assert.equal(env.stats.writes.length, beforeReview);
    await phase(peer, 'pet-confirm-empty', 'pet-empty-ready');
    await confirm(page);
    await peer.stage('pet-empty-verified');
    await phase(peer, 'pet-settlement', 'pet-settlement-sent');

    async function advanced(command, stage) {
      peer.send(command);
      const next = await service(page, 'pet-offer');
      assert.equal(next.balance, '持有金币 10');
      assert.match(next.rows[0].label, /Guard.*5 金币/);
      await select(page, 0);
      const targets = await service(page, 'pet-pet');
      assert.ok(targets.lines.some(row => row.text === '要求 野兽系'));
      assert.deepEqual(targets.rows.map(row => row.disabled), [true, false]);
      await select(page, 1);
      await peer.stage(stage);
      return service(page, 'pet-slot');
    }

    const slots = await advanced('pet-extended', 'pet-extended-slots');
    assert.ok(slots.lines.some(row => row.text === 'Hound · 技能栏 2 / 3'));
    await select(page, 0);
    assert.equal(page.data.sceneService.review.text, '确认使用技能栏 1，替换 Scratch？');
    await phase(peer, 'pet-confirm-replace', 'pet-replace-ready');
    await confirm(page);
    await peer.stage('pet-replace-verified');
    await advanced('pet-stale', 'pet-stale-slots');
    await select(page, 0);
    await phase(peer, 'pet-invalidate', 'pet-invalidated');
    const stale = (await until(page, view => view.sceneService?.notice.includes('宠物或技能栏已更新'))).sceneService;
    assert.equal(stale.review, null);
    assert.ok(stale.rows.every(row => row.disabled));
    assert.equal(await tap(page, 'confirm'), false);
    await dismiss(page);
    await peer.stage('pet-cancel-verified');
    await phase(peer, 'pet-leave', 'pet-leave-opened');
    await service(page, 'pet-offer');
    const beforeClose = env.stats.writes.length;
    await dismiss(page);
    assert.equal(env.stats.writes.length, beforeClose);
    return { pet_choice: 1, empty_slot: 1, replaced_slot: 0, extended_type_gate: true,
      stale_confirm_rejected: true, pet_offer_close_local: true };
  }, 'map-services');
});

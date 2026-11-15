/** Actual Page controls and canvas writes for source-backed special map dialogs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage228-page-final';
await import('../game-wechat-family-board-v1/page-test.mjs');
const { withGame, phase, approach, offer } = await import('../game-wechat-inventory-shop-v1/page-test.mjs');
const { event, until, project } = await import('../game-wechat-page-v1/page-test.mjs');

const dialog = async (page, test) => (await until(page, view => view.dialog && test(view.dialog))).dialog;
const titled = (page, title) => dialog(page, view => view.title === title);
const press = (page, bit, choice, revision = page.data.dialog.revision) => page.onDialog(event({ bit, choice, revision }));
const input = (page, field, value, revision = page.data.dialog.revision) =>
  page[field]({ ...event({ revision }), detail: { value } });
const shopAct = (page, action, row, value) =>
  page.onShop({ ...event({ action, row, revision: page.data.shop.revision }), detail: { value } });

async function artwork(page, env, width, height) {
  const ready = (await until(page, view => view.dialogArt?.status === 'ready')).dialogArt;
  const frame = env.dialogFrames.at(-1);
  assert.deepEqual([ready.width, ready.height, frame.width, frame.height, frame.nonzero], [width, height, width, height, true]);
  return { key: ready.key, frame };
}

test('native special dialogs hand off goods, send paired replies, edit appearance and paint artwork', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/index.wxml'), 'utf8');
  assert.match(template, /id="game-dialog-canvas" type="2d"/);
  assert.match(template, /data-revision="{{item}}" bindinput="onDialogSecondInput"/);
  assert.match(template, /data-choice="{{item.previous}}" bindtap="onDialog"/);
  await withGame('special', async context => {
    const { env, page, peer } = context;
    await approach(context, 'special-actor');
    peer.send('give');
    const give = await titled(page, 'Courier');
    assert.deepEqual(give.choices.map(row => row.label), ['给予物品', '不用了']);
    assert.equal(await press(page, 0, 1), true);
    const conversion = await offer(page, 'conversion');
    assert.equal(conversion.title, 'Paper Offering');
    assert.equal(await shopAct(page, 'quantity', 0, '2'), true);
    assert.equal(page.data.shop.quote.total, 4);
    assert.equal(await shopAct(page, 'review'), true);
    assert.equal(await shopAct(page, 'confirm'), true);
    await peer.stage('give-confirmed');
    peer.send('receive');
    const receive = await titled(page, 'Courier');
    assert.deepEqual(receive.choices.map(row => row.label), ['接受物品', '不用了']);
    assert.equal(await press(page, 0, 1, give.revision), false);
    assert.equal(await press(page, 0, 1), true);
    await peer.stage('receive-confirmed');
    peer.send('decline');
    await titled(page, 'Courier');
    assert.equal(await press(page, 0, 2), true);
    await peer.stage('decline-confirmed');

    await phase(peer, 'pair', 'pair-opened');
    const pair = await dialog(page, view => view.inputCount === 2);
    assert.equal(pair.inputBytes, 46);
    input(page, 'onDialogInput', 'Alpha');
    input(page, 'onDialogSecondInput', 'bad,separator');
    assert.equal(await press(page, 1), false);
    assert.equal(page.data.errorCode, 'LEGACY_GAME_DIALOG_TEXT');
    await phase(peer, 'pair-invalid', 'pair-invalid-local');
    // CP936 0x815c includes a backslash-valued trail byte.
    input(page, 'onDialogSecondInput', '乗');
    assert.equal(await press(page, 1), true);
    await peer.stage('pair-confirmed');
    peer.send('pair-cancel');
    await dialog(page, view => view.inputCount === 2 && view.revision !== pair.revision);
    input(page, 'onDialogInput', 'A,');
    input(page, 'onDialogSecondInput', '\\B|');
    input(page, 'onDialogSecondInput', 'stale', pair.revision);
    assert.equal(await press(page, 2), true);
    await peer.stage('pair-cancelled');

    await phase(peer, 'appearance', 'appearance-opened');
    const look = await titled(page, 'Stylist');
    assert.equal(look.appearance.code, 33000);
    assert.deepEqual(look.appearance.controls.map(row => row.key), ['variant', 'detail1', 'detail2']);
    const initialArt = await artwork(page, env, 280, 112);
    const before = env.stats.writes.length;
    for (const choice of [3, 6, 11]) assert.equal(await press(page, 0, choice), true);
    const adjusted = await dialog(page, view => view.appearance?.code === 240096);
    assert.equal(adjusted.revision, look.revision);
    const adjustedArt = await artwork(page, env, 280, 112);
    assert.notEqual(adjustedArt.key, initialArt.key);
    assert.equal(env.stats.writes.length, before);
    await phase(peer, 'appearance-draft', 'appearance-local');
    assert.equal(await press(page, 1), true);
    await peer.stage('appearance-confirmed');

    peer.send('illustration');
    const illustration = await titled(page, '图文确认');
    const confirmationArt = await artwork(page, env, 448, 240);
    assert.match(illustration.lines.map(row => row.text).join(' '), /Review the illustration/);
    assert.equal(await press(page, 1), true);
    await peer.stage('illustration-confirmed');
    peer.send('illustration-cancel');
    await dialog(page, view => view.title === '图文确认' && view.revision !== illustration.revision);
    await artwork(page, env, 448, 240);
    assert.equal(await press(page, 2), true);
    await peer.stage('illustration-cancelled');

    env.holdDialog(true);
    await phase(peer, 'special-dismiss', 'special-dismiss-opened');
    const last = await titled(page, '图文确认');
    await until(page, view => view.dialogArt?.status === 'loading' && env.dialogPending.length === 1);
    const artFrames = env.dialogFrames.length, writes = env.stats.writes.length;
    assert.equal(await page.onDismiss(event({ revision: last.revision })), true);
    await until(page, view => !view.dialog && !view.dialogArt);
    env.dialogPending.shift()();
    env.holdDialog(false);
    await phase(peer, 'special-dismiss-check', 'special-dismiss-local');
    assert.equal(env.dialogFrames.length, artFrames);
    assert.equal(env.stats.writes.length, writes);
    assert.ok(env.events.includes('dialog-clear'));
    return { handoff_give_and_receive: true, offer_total: 4, pair_confirm_cp936_trail: '815c',
      pair_cancel_current_drafts: true, final_appearance: 240096, appearance_draft_local: true,
      appearance_pixels: adjustedArt.frame, confirmation_pixels: confirmationArt.frame,
      close_rejected_late_canvas: true };
  }, 'special-dialogs');
});

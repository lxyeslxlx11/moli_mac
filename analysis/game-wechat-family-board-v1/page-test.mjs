/** Actual WeChat Page controls exercised against the fixed-sample family and board TCP peers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage227-page-final';
const { bankAct, bankPanel, slotIn, chooseSlots, submitBank } = await import('../game-wechat-storage-trade-v1/page-test.mjs');
const { withGame, phase, phaseAndReadFrame, approach } = await import('../game-wechat-inventory-shop-v1/page-test.mjs');
const { event, until, project } = await import('../game-wechat-page-v1/page-test.mjs');

const visible = async (page, field, ready = () => true) =>
  (await until(page, view => view[field] && ready(view[field])))[field];

function familyAct(page, action, value, view = page.data.family) {
  return page.onFamily({ ...event({ action, revision: view?.revision, version: view?.version, bit: value }),
    detail: { value } });
}
async function familySet(page, action, value) {
  assert.equal(await familyAct(page, action, value), true);
}
async function familySave(page, field, value, stage, peer) {
  await familySet(page, field, value);
  await familySet(page, 'save-' + field);
  await peer.stage(stage);
}
async function selectMember(page, id) {
  const index = page.data.family.member.options.findIndex(row => row.id === id);
  assert.ok(index >= 0, 'unavailable member ' + id);
  await familySet(page, 'select-member', String(index));
}
const named = (view, label) => view.members?.some(row => row.label.includes(label));

test('native family management refreshes identity, roles and pending authority', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/family.wxml'), 'utf8');
  assert.match(template, /data-action="save-role"[^>]*bindtap="onFamily"/);
  await withGame('management', async ({ page, peer }) => {
    await familySet(page, 'open');
    assert.equal(page.data.family.empty, '等待家族资料同步。');
    assert.equal(page.data.canTouch, false);
    await phase(peer, 'management-load', 'management-readonly');
    const reader = await visible(page, 'family', view => view.ownTitle === 'Reader' && view.members.length === 2);
    assert.equal(reader.identity, null);
    assert.equal(reader.role, null);
    assert.equal(reader.members[0].label, 'Iris · 附名 One · Reader · 自己');
    assert.equal(await familyAct(page, 'save-name'), false);
    await phase(peer, 'management-grant', 'management-granted');
    await visible(page, 'family', view => view.ownTitle === 'Officer' && view.identity);
    assert.equal(await familyAct(page, 'save-name', undefined, reader), false);
    assert.equal(page.data.family.role.canEditFlags, false);
    assert.equal(await familyAct(page, 'permission', 1), false);
    await familySet(page, 'name', '家'.repeat(13));
    assert.equal(await familyAct(page, 'save-name'), false);
    assert.match(page.data.family.notice, /字节长度/);
    await phase(peer, 'management-invalid', 'management-invalid-idle');
    await familySave(page, 'name', 'New Harbor', 'management-name-verified', peer);
    assert.equal(page.data.family.pending, 'name');
    assert.equal(page.data.family.name, 'Harbor');
    await phase(peer, 'management-member', 'management-member-updated');
    await visible(page, 'family', view => named(view, 'Birch New'));
    assert.equal(page.data.family.pending, 'name');
    assert.equal(await familyAct(page, 'save-hall'), false);
    await phase(peer, 'management-settle-name', 'management-name-settled');
    await visible(page, 'family', view => view.name === 'New Harbor' && !view.pending);
    await familySave(page, 'hall', 'New Hall', 'management-hall-verified', peer);
    await phase(peer, 'management-settle-hall', 'management-hall-settled');
    await visible(page, 'family', view => view.hall === 'New Hall' && !view.pending);
    await familySet(page, 'select-role', '3');
    assert.equal(page.data.family.role.name, 'Courier');
    assert.equal(page.data.family.role.permissions.find(row => row.bit === 1).selected, true);
    await familySet(page, 'permission', 4);
    await familySet(page, 'role-name', 'Courier Lead');
    await familySet(page, 'save-role');
    await peer.stage('management-role-verified');
    await phase(peer, 'management-settle-role', 'management-role-settled');
    await visible(page, 'family', view => view.role?.name === 'Courier Lead' && !view.pending);
    const officer = page.data.family;
    await phase(peer, 'management-revoke', 'management-revoked');
    const revoked = await visible(page, 'family', view => view.active && !view.identity && view.members.length === 1);
    assert.equal(await familyAct(page, 'save-role', undefined, officer), false);
    await phase(peer, 'management-unrelated', 'management-unrelated-sent');
    assert.equal(page.data.family.revision, revoked.revision);
    await phase(peer, 'management-remove', 'management-removed');
    await visible(page, 'family', view => view.empty === '当前没有家族。' && !view.active);
    await familySet(page, 'close');
    return { preserved_other_permission_bits: true, settled_by_matching_profile: true, revoked_controls: true };
  }, 'family-board');
});

test('native family members invite, assign and confirm removal with live permissions', { timeout: 45000 }, async () => {
  await withGame('members', async ({ env, page, peer, openedAt }) => {
    await familySet(page, 'open');
    await phase(peer, 'members-load', 'members-loaded');
    const roster = await visible(page, 'family', view => view.ownTitle === 'Officer' && view.members.length === 4);
    assert.deepEqual(roster.member.options.map(row => row.id), [503, 504]);
    assert.equal(await familyAct(page, 'invite'), false);
    await phase(peer, 'members-grant', 'members-granted');
    await visible(page, 'family', view => view.canInvite);
    assert.equal(await familyAct(page, 'invite'), false);
    assert.match(page.data.family.notice, /相邻玩家/);
    await phaseAndReadFrame({ env, page, peer }, 'members-neighbor', 'members-neighbor-ready');
    const framesAfterNeighbor = env.frames.length;
    await until(page, () => env.frames.length >= framesAfterNeighbor + 2 && Date.now() - openedAt > 500);
    const elapsed = Date.now() - openedAt;
    const invitation = familyAct(page, 'invite');
    assert.equal(await familyAct(page, 'invite'), false);
    assert.equal(await invitation, true, 'invite at ' + elapsed + ' ms: ' + page.data.family.notice);
    await peer.stage('members-invite-verified');
    assert.equal(page.data.family.notice, '邀请请求已发送。');
    assert.equal(await familyAct(page, 'select-member', '2'), false);
    await selectMember(page, 503);
    assert.deepEqual(page.data.family.member.roles.map(row => row.slot), [2, 4]);
    await familySet(page, 'select-member-role', '1');
    await phase(peer, 'members-invalid', 'members-invalid-idle');
    await familySet(page, 'assign-role');
    await peer.stage('members-role-verified');
    assert.equal(page.data.family.pending, 'assign-role');
    await phase(peer, 'members-unrelated', 'members-unrelated-received');
    await visible(page, 'family', view => named(view, 'Birch New · Reader'));
    assert.equal(page.data.family.pending, 'assign-role');
    await phase(peer, 'members-role-settle', 'members-role-settled');
    await visible(page, 'family', view => !view.pending && named(view, 'Birch New · Courier'));
    await phase(peer, 'members-delegate', 'members-delegated');
    await visible(page, 'family', view => view.ownTitle === 'Steward' && !view.role);
    await selectMember(page, 503);
    assert.equal(page.data.family.member.roles.length, 0);
    const beforeReview = env.stats.writes.length;
    await familySet(page, 'review-remove');
    assert.match(page.data.family.member.review, /移除 Birch New/);
    const oldReview = page.data.family;
    await familySet(page, 'cancel-remove');
    assert.equal(await familyAct(page, 'confirm-remove'), false);
    await selectMember(page, 504);
    assert.equal(await familyAct(page, 'confirm-remove', undefined, oldReview), false);
    assert.equal(env.stats.writes.length, beforeReview);
    await phase(peer, 'members-cancel', 'members-cancel-idle');
    await selectMember(page, 503);
    await familySet(page, 'review-remove');
    await familySet(page, 'confirm-remove');
    await peer.stage('members-remove-verified');
    assert.equal(page.data.family.pending, 'remove-member');
    await phase(peer, 'members-other-removal', 'members-other-removed');
    await visible(page, 'family', view => !named(view, 'Cedar'));
    assert.equal(page.data.family.pending, 'remove-member');
    await phase(peer, 'members-remove-settle', 'members-remove-settled');
    await visible(page, 'family', view => !named(view, 'Birch New') && !view.pending);
    await phase(peer, 'members-self', 'members-self-ready');
    await visible(page, 'family', view => view.ownTitle === 'Reader' && view.member?.options[0]?.id === 501);
    await selectMember(page, 501);
    assert.equal(page.data.family.member.removeLabel, '退出家族');
    await familySet(page, 'review-remove');
    await familySet(page, 'confirm-remove');
    await peer.stage('members-self-verified');
    await phase(peer, 'members-reset', 'members-reset-received');
    await visible(page, 'family', view => view.empty === '当前没有家族。' && !view.active);
    await familySet(page, 'close');
    return { invite_elapsed_lower_bound_ms: elapsed, neighbor_frame_received: true, role_target: 503, remove_target: 503, self_id: 501,
      protected_member_excluded: true, removal_cancel_local: true, matching_update_settles: true };
  }, 'family-board');
});

function petAct(page, action, value, rowRevision, view = page.data.familyPet) {
  return page.onFamilyPet({ ...event({ action, revision: view.revision, slot: value, rowRevision }),
    detail: { value } });
}
async function chooseFood(page, slot) {
  const row = page.data.familyPet.rows.find(entry => entry.slot === slot);
  assert.ok(row, 'unavailable food ' + slot);
  assert.equal(await petAct(page, 'select', slot, row.revision), true);
}

test('native family pet honors feeding and rename permissions across refresh and close', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/family-pet.wxml'), 'utf8');
  assert.match(template, /data-action="feed"[^>]*bindtap="onFamilyPet"/);
  await withGame('family', async context => {
    const { env, page, peer } = context;
    await approach(context, 'family-actor');
    await phase(peer, 'family-open', 'family-opened');
    const first = await visible(page, 'familyPet', view => view.title === 'Finch');
    assert.equal(first.lines.length, 19);
    assert.deepEqual(first.rows.map(row => row.slot), [9]);
    assert.equal(await petAct(page, 'select', 8, 0), false);
    assert.equal(await petAct(page, 'rename'), false);
    await phase(peer, 'family-restricted', 'family-restricted-local');
    await chooseFood(page, 9);
    assert.equal(await petAct(page, 'feed'), true);
    await peer.stage('family-exception-fed');
    assert.equal(page.data.familyPet.busy, true);
    assert.equal(page.data.familyPet.rows[0].quantity, 2);
    await phase(peer, 'family-feed-settle', 'family-feed-settled');
    await visible(page, 'familyPet', view => !view.busy && view.rows[0].quantity === 1);
    assert.equal(await petAct(page, 'select', 9, first.rows[0].revision), false);
    await phase(peer, 'family-grant', 'family-granted');
    await visible(page, 'familyPet', view => view.canRename && view.rows.some(row => row.slot === 8));
    await chooseFood(page, 8);
    assert.equal(await petAct(page, 'feed'), true);
    await peer.stage('family-permitted-fed');
    await visible(page, 'familyPet', view => !view.busy && view.rows.find(row => row.slot === 8)?.quantity === 2);
    assert.equal(await petAct(page, 'name', '家'.repeat(9)), true);
    assert.equal(await petAct(page, 'rename'), false);
    assert.match(page.data.familyPet.notice, /16 字节/);
    assert.equal(await petAct(page, 'name', 'A,\\B|'), true);
    assert.equal(await petAct(page, 'rename'), true);
    await peer.stage('family-name-sent');
    assert.equal(page.data.familyPet.title, 'Finch');
    assert.equal(page.data.familyPet.busy, true);
    await phase(peer, 'family-name-settle', 'family-name-updated');
    const renamed = await visible(page, 'familyPet', view => view.title === 'New Finch' && !view.busy);
    assert.equal(await petAct(page, 'close', undefined, undefined, first), false);
    await phase(peer, 'family-revoke', 'family-revoked');
    await visible(page, 'familyPet', view => !view.canRename && view.rows.every(row => row.slot === 9));
    await phase(peer, 'family-mismatch', 'family-remains');
    assert.equal(page.data.familyPet.revision, renamed.revision);
    await phase(peer, 'family-close', 'family-closed');
    await until(page, view => view.familyPet === null);

    await phase(peer, 'feed-box-open', 'feed-box-opened');
    const box = await bankPanel(page, '饲料箱');
    assert.deepEqual(box.sources.map(row => row.slot), [8, 9, 103]);
    assert.equal(await bankAct(page, 'tab', 'pet'), false);
    await phase(peer, 'feed-box-restricted', 'feed-box-restricted-local');
    await chooseSlots(page, 8, 101, '1');
    await submitBank(page);
    await peer.stage('feed-box-storing');
    await phase(peer, 'feed-box-settle', 'feed-box-stored');
    await until(page, view => slotIn(view.bank, 101)?.quantity === 1 && slotIn(view.bank, 8)?.quantity === 1);
    await chooseSlots(page, 103, 13);
    await submitBank(page);
    await peer.stage('feed-box-taken');
    await until(page, view => slotIn(view.bank, 13)?.quantity === 7 && !slotIn(view.bank, 103));
    const beforeClose = env.stats.writes.length;
    assert.equal(await bankAct(page, 'close'), true);
    await phase(peer, 'feed-box-local-close', 'feed-box-local-closed');
    await phase(peer, 'feed-box-reopen', 'feed-box-reopened');
    await bankPanel(page, '饲料箱');
    await phase(peer, 'feed-box-server-close', 'feed-box-server-closed');
    await until(page, view => view.bank === null);
    assert.equal(env.stats.writes.length, beforeClose);
    await phase(peer, 'family-reopen', 'family-reopened');
    await visible(page, 'familyPet', view => view.title === 'New Finch' && !view.canRename);
    assert.equal(await petAct(page, 'close'), true);
    await peer.stage('family-local-closed');
    await until(page, view => view.familyPet === null);
    return { exception_food: 9, permitted_food: 8, rename_waited_for_reply: true, revocation_verified: true,
      feed_box_silent_close: true, pet_close_reply: true };
  }, 'family-board');
});

function boardAct(page, action, value, view = page.data.board) {
  return page.onBoard({ ...event({ action, revision: view.revision, row: value }),
    detail: { value } });
}

test('native board refreshes pages and sends encoded posts and confirmed deletions', { timeout: 45000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/board.wxml'), 'utf8');
  assert.match(template, /data-action="draft"[^>]*bindinput="onBoard"/);
  assert.match(template, /data-action="confirm-delete"[^>]*bindtap="onBoard"/);
  await withGame('board', async context => {
    const { env, page, peer } = context;
    await approach(context, 'board-actor-verified');
    await phase(peer, 'board', 'board-opened');
    const original = await visible(page, 'board');
    assert.equal(original.title, '留言板 · Harbor Board');
    assert.equal(original.entries[0].author, 'Harbor|Guide');
    assert.equal(original.entries[0].text, 'First note\nOn the pier');
    assert.match(original.entries[0].time, /^2023-11-\d\d \d\d:\d\d$/);
    assert.equal(await boardAct(page, 'review-delete', 0), false);
    assert.equal(await boardAct(page, 'previous'), false);
    await phase(peer, 'board-refresh', 'board-refreshed');
    await visible(page, 'board', view => view.entries[0]?.text === 'Updated, on the pier');
    assert.equal(await boardAct(page, 'next', undefined, original), false);
    await phase(peer, 'board-next', 'board-next-ready');
    assert.equal(await boardAct(page, 'next'), true);
    await peer.stage('board-next-verified');
    await phase(peer, 'board-next-reply', 'board-page-two');
    const second = await visible(page, 'board', view => view.canPrevious);
    assert.deepEqual(second.entries.map(row => [row.row, row.author]), [[1, 'Keeper']]);
    await phase(peer, 'board-prev', 'board-prev-ready');
    assert.equal(await boardAct(page, 'previous'), true);
    await peer.stage('board-prev-verified');
    await phase(peer, 'board-prev-reply', 'board-page-one');
    await visible(page, 'board', view => view.canNext);
    assert.equal(await boardAct(page, 'draft', '魔'.repeat(71)), true);
    assert.equal(await boardAct(page, 'publish'), false);
    assert.match(page.data.board.notice, /70 字节/);
    await phase(peer, 'board-post', 'board-post-ready');
    assert.equal(await boardAct(page, 'draft', '魔力|,\\\nSecond'), true);
    assert.equal(await boardAct(page, 'publish'), true);
    await peer.stage('board-post-verified');
    await phase(peer, 'board-post-reply', 'board-posted');
    const posted = await visible(page, 'board', view => view.entries.some(row => row.row === 2));
    assert.equal(posted.entries.find(row => row.row === 2).text, '魔力|,\\\nSecond');
    const beforeReview = env.stats.writes.length;
    assert.equal(await boardAct(page, 'review-delete', 2), true);
    assert.match(page.data.board.review.text, /Hero/);
    assert.equal(await boardAct(page, 'cancel-delete'), true);
    assert.equal(await boardAct(page, 'confirm-delete'), false);
    assert.equal(env.stats.writes.length, beforeReview);
    await boardAct(page, 'review-delete', 2);
    await phase(peer, 'board-delete', 'board-delete-ready');
    assert.equal(await boardAct(page, 'confirm-delete'), true);
    await peer.stage('board-delete-verified');
    await phase(peer, 'board-delete-reply', 'board-empty');
    await visible(page, 'board', view => view.entries.length === 0);
    assert.equal(await boardAct(page, 'confirm-delete', undefined, posted), false);
    const beforeClose = env.stats.writes.length;
    assert.equal(await boardAct(page, 'close'), true);
    assert.equal(env.stats.writes.length, beforeClose);
    return { both_page_directions: true, selected_source_row: 2, windows936_post: true, local_close: true,
      stale_window_rejected: true };
  }, 'family-board');
});

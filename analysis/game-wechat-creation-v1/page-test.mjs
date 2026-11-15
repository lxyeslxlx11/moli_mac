/** Actual native Page handlers, using the retained independent TCP creation oracle. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_INPUT_PROFILE } from '../../shared/legacy-game-input.mjs';

process.env.MOLI_PAGE_BUILD ??= 'build/wechat-app-stage223-page';
const { environment, until, cleared, event, project, variant } = await import('../game-wechat-page-v1/page-test.mjs');
const source = new URL('../game-character-lifecycle-v1/', import.meta.url);
const vectors = JSON.parse(await readFile(new URL('original-vectors.json', source), 'utf8'));

async function withPeer(mode, index, exercise) {
  const directory = await mkdtemp(join(tmpdir(), 'moli-wechat-creation-'));
  let child, lines, exited;
  try {
    const fixtureFiles = [
      ['original_peer.py', 'original_peer.py'],
      ['original-vectors.json', 'original-vectors.json'],
      ['../game-post-login-v1/original-vectors.json', 'post-login-vectors.json'],
      ['../game-input-runtime-v1/original-vectors.json', 'scene-vectors.json'],
      ['../game-legacy-message-v1/generate_vectors.py', 'wire_reference.py'],
    ];
    await Promise.all(fixtureFiles.map(([path, name]) => copyFile(new URL(path, source), join(directory, name))));
    child = spawn('python3', ['-B', join(directory, 'original_peer.py'), mode, String(index)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let diagnostics = '';
    child.stderr.on('data', chunk => { diagnostics += chunk; });
    exited = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('close', resolve);
    });
    exited.catch(() => {});
    lines = createInterface({ input: child.stdout });
    const replies = lines[Symbol.asyncIterator]();
    async function next() {
      const row = await replies.next();
      assert.equal(row.done, false, diagnostics);
      return JSON.parse(row.value);
    }
    const env = environment(await next()), page = env.startPage();
    const pageOpenedAt = Date.now();
    const reference = vectors.flows[index];
    try {
      await until(page, view => view.canvasReady);
      assert.equal(await page.onStartup(), true);
      assert.equal(await page.onResources(), true);
      const starting = page.onConnect();
      await until(page, view => view.state === 'choosing');
      const originalRoster = page.data.characters.map(row => row.name);
      assert.equal(page.data.characters[reference.slot].present, false);
      assert.equal(page.data.characters[reference.slot].canCreate, true);
      assert.equal(page.data.characters[1 - reference.slot].canCreate, reference.initialBodyHex === '');
      const details = await exercise({ env, page, reference, originalRoster, pageOpenedAt });
      await starting;
      const receipt = await next();
      assert.equal(await exited, 0, diagnostics);
      assert.equal(receipt.creation_request_verified, true);
      assert.equal(receipt.selected_slot, reference.slot);
      assert.equal(receipt.official_session, false);
      console.log(JSON.stringify({ variant, flow: 'creation-' + mode, receipt, ...details }));
      return receipt;
    } finally {
      page.onUnload();
    }
  } finally {
    lines?.close();
    if (child?.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    try { await exited; } finally { await rm(directory, { recursive: true, force: true }); }
  }
}

const creationAction = (page, action, values = {}) => page.onCreation(event({ action, ...values }));
const review = (page, name) => page.onCreationReview({ detail: { value: { name } } });

async function begin(page, slot) {
  assert.equal(await page.onCharacter(event({ action: 'create', slot: String(slot) })), true);
  await until(page, view => view.creation?.kind === 'appearance');
  assert.equal(page.data.creation.slot, slot);
  assert.equal(page.data.characters.length, 0);
}

async function chooseDraft(page, reference, checkErrors = false) {
  await begin(page, reference.slot);
  assert.equal(page.data.appearanceChoices.length, 14);
  if (page.data.creation.family !== reference.family) assert.equal(await creationAction(page, 'family'), true);
  assert.equal(await page.onCreation({
    ...event({ action: 'appearance' }), detail: { value: String(reference.ordinal) },
  }), true);
  for (let i = 0; i < reference.color; i++) assert.equal(await creationAction(page, 'color', { delta: '1' }), true);
  assert.equal(await creationAction(page, 'continue'), true);
  assert.equal(page.data.creation.kind, 'details');
  assert.equal(page.data.creation.statRemaining, 30);
  assert.equal(page.data.creation.elementRemaining, 10);
  if (checkErrors) {
    assert.equal(await review(page, 'OriginalNew'), false);
    assert.equal(page.data.errorCode, 'LEGACY_CREATION_STAT_POINTS');
  }
  for (let i = page.data.creation.mode; i > reference.mode; i--) {
    assert.equal(await creationAction(page, 'mode', { delta: '-1' }), true);
  }
  for (const [index, value] of reference.details.entries()) {
    for (let i = 0; i < value; i++) assert.equal(await creationAction(page, 'detail', { index, delta: '1' }), true);
  }
  for (let index = 0; index < 5; index++) {
    for (let i = 0; i < 6; i++) assert.equal(await creationAction(page, 'stat', { index, delta: '1' }), true);
  }
  for (const [index, value] of [6, 4].entries()) {
    for (let i = 0; i < value; i++) assert.equal(await creationAction(page, 'element', { index, delta: '1' }), true);
  }
  assert.equal(page.data.creation.statRemaining, 0);
  assert.equal(page.data.creation.elementRemaining, 0);
  assert.equal(page.data.creation.elements[2].plus, false);
  if (checkErrors) {
    assert.equal(await review(page, '魔'.repeat(9)), false);
    assert.equal(page.data.errorCode, 'LEGACY_CREATION_NAME_BYTES');
    assert.equal(await review(page, '[GP]Original'), false);
    assert.equal(page.data.errorCode, 'LEGACY_CREATION_NAME_RESERVED');
  }
  assert.equal(await review(page, 'OriginalNew'), true);
  assert.equal(page.data.creation.kind, 'confirmation');
  assert.equal(page.data.creation.name, 'OriginalNew');
  assert.equal(page.data.creation.stats, '6 / 6 / 6 / 6 / 6');
  assert.equal(page.data.creation.elements, '6 / 4 / 0 / 0');
}

test('native creation confirms once, refreshes the server roster and enters the new character', { timeout: 30000 }, async () => {
  const template = await readFile(join(project, 'game/pages/play/index.wxml'), 'utf8');
  assert.match(template, /data-action="create"[^>]*bindtap="onCharacter"/);
  assert.match(template, /<form[^>]*bindsubmit="onCreationReview"/);
  assert.match(template, /data-action="confirm"[^>]*bindtap="onCreation"/);
  const receipt = await withPeer('duplicate', 1, async ({ env, page, reference, pageOpenedAt }) => {
    await chooseDraft(page, reference, true);
    assert.equal(await creationAction(page, 'cancel-confirmation'), true);
    assert.equal(page.data.creation.kind, 'details');
    assert.equal(page.data.creation.name, 'OriginalNew');
    assert.equal(await review(page, 'OriginalNew'), true);
    assert.equal(env.stats.writes.length, 2);
    const pending = creationAction(page, 'confirm');
    assert.equal(await creationAction(page, 'confirm'), false);
    assert.equal(await pending, true);
    await until(page, view => view.state === 'choosing');
    assert.equal(page.data.creation, null);
    assert.equal(page.data.characters[reference.slot].name, 'OriginalNew');
    assert.equal(page.data.characters[reference.slot].canCreate, false);
    assert.equal(env.stats.writes.length, 4);
    const entering = page.onCharacter(event({ action: 'enter', slot: String(reference.slot) }));
    await until(page, view => view.state === 'playing' && view.canTouch &&
      Date.now() - pageOpenedAt >= LEGACY_GAME_INPUT_PROFILE.destinationInterval);
    assert.equal(await entering, true);
    assert.ok(env.frames.some(frame => frame.nonzero));
    const touchElapsed = Date.now() - pageOpenedAt;
    env.tapMap(page);
    try {
      await until(page, view => !view.connected);
    } catch (error) {
      throw Error('After map touch the client wrote ' + env.stats.writes.length + ' frames and presented ' + env.frames.length, { cause: error });
    }
    cleared(env, page);
    return {
      confirmation_without_network: true, duplicate_confirm_blocked: true, scene_rendered: true,
      touch_elapsed_lower_bound_ms: touchElapsed, touch_gate_ms: LEGACY_GAME_INPUT_PROFILE.destinationInterval,
    };
  });
  assert.equal(receipt.roster_refresh_verified, true);
  assert.equal(receipt.entry_request_verified, true);
  assert.equal(receipt.movement_requests_verified, 2);
  assert.equal(receipt.total_client_requests, 7);
});

test('native creation denial returns to the existing list without refresh or entry', { timeout: 30000 }, async () => {
  const receipt = await withPeer('denied', 0, async ({ env, page, reference, originalRoster }) => {
    assert.equal(await page.onCharacter(event({ action: 'create', slot: String(1 - reference.slot) })), false);
    await begin(page, reference.slot);
    assert.equal(await creationAction(page, 'cancel'), true);
    await until(page, view => view.state === 'choosing');
    assert.equal(env.stats.writes.length, 2);
    await chooseDraft(page, reference);
    assert.equal(await creationAction(page, 'confirm'), false);
    await until(page, view => view.creation?.kind === 'error');
    assert.equal(page.data.errorCode, 'LEGACY_CHARACTER_CREATE_REJECTED');
    assert.equal(await creationAction(page, 'dismiss-error'), true);
    await until(page, view => view.state === 'choosing');
    assert.deepEqual(page.data.characters.map(row => row.name), originalRoster);
    assert.equal(page.data.characters[reference.slot].canCreate, true);
    assert.equal(page.data.errorCode, null);
    page.onDisconnect();
    cleared(env, page);
    return { prior_roster_preserved: true, occupied_slot_blocked: true, cancel_without_network: true };
  });
  assert.equal(receipt.roster_refresh_verified, false);
  assert.equal(receipt.entry_request_verified, false);
  assert.equal(receipt.total_client_requests, 3);
});

test('hiding the native app closes pending creation and retires the draft', { timeout: 30000 }, async () => {
  const receipt = await withPeer('abort', 0, async ({ env, page, reference }) => {
    await chooseDraft(page, reference);
    const pending = creationAction(page, 'confirm');
    await until(page, view => view.creation?.kind === 'waiting' && env.stats.writes.length === 3);
    env.application().onHide();
    assert.equal(await pending, false);
    assert.equal(page.data.creation, null);
    assert.equal(await creationAction(page, 'confirm'), false);
    cleared(env, page);
    return { pending_settled: true, resources_released: true };
  });
  assert.equal(receipt.roster_refresh_verified, false);
  assert.equal(receipt.entry_request_verified, false);
  assert.equal(receipt.total_client_requests, 3);
});

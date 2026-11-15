import test from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherCatalogPatchPlan, prepareLauncherGamePatch } from '../launcher-game-patch.mjs';
import { createWeChatLauncherCatalogPatchPlan, createWeChatLauncherPatchPreparer } from '../../adapters/wechat/launcher-patch.mjs';
import { WIN32_LAUNCHER_PATCH_PROFILE } from '../../shared/launcher-patch-current.mjs';
import { createGamePatchFixture } from './helpers/launcher-game-patch-fixture.mjs';
import { weChatPatchFixture } from './helpers/wechat-patch-fixture.mjs';
const text = value => new TextDecoder().decode(value).replace(/\0$/, '');

test('Web profile defaults remain legacy; explicit current command and native lifecycle do not alter resource binding', async () => {
  const fixture = await createGamePatchFixture();
  try {
    const input = fixture.input(), legacy = createLauncherCatalogPatchPlan(input), current = createLauncherCatalogPatchPlan({ ...input, callerProfile: 'win32-current' });
    assert.equal(legacy.processPlan.quoting, 'native-raw-unquoted');
    assert.equal(text(current.processPlan.commandLineBytes), `"C:\\Original Folder\\Client\\PATCH.BAK.EXE" 127.0.0.1 ${fixture.port}`);
    assert.deepEqual(current.binding, legacy.binding); assert.deepEqual(current.selectedPatchSource, legacy.selectedPatchSource);
    assert.equal(current.processPlan.profile, WIN32_LAUNCHER_PATCH_PROFILE);
    for (const callerProfile of ['current', '', null, 1]) assert.throws(() => createLauncherCatalogPatchPlan({ ...input, callerProfile }), error => error.code === 'GAME_PATCH_CALLER_PROFILE');
    let reads = 0; Object.defineProperty(input, 'callerProfile', { get() { reads++; return 'win32-current'; } });
    assert.throws(() => createLauncherCatalogPatchPlan(input), error => error.code === 'GAME_PATCH_INPUT'); assert.equal(reads, 0);
    assert.equal(fixture.requests.length, 0);
  } finally { await fixture.close(); }
});
test('current Web preparer snapshots caller before asynchronous source mutation and still makes only sequential byte requests', async () => {
  const fixture = await createGamePatchFixture();
  try {
    const input = fixture.input({ callerProfile: 'win32-current' });
    input.fetchImpl = (url, options) => { input.callerProfile = 'legacy'; return fetch(url, options); };
    const result = await prepareLauncherGamePatch(input);
    assert.equal(result.processPlan.profile, WIN32_LAUNCHER_PATCH_PROFILE);
    assert.deepEqual(result.candidate.files, fixture.scenario.expectedFiles);
    assert.equal(result.requests.length, 3); assert.equal(result.replacement, 'not-performed');
    fixture.reset(); fixture.set('/cg50/Update.TXT', { status: 503 });
    await assert.rejects(prepareLauncherGamePatch(fixture.input({ callerProfile: 'win32-current' })), error => error.code === 'HTTP_STATUS');
    assert.equal(fixture.requests.length, 1);
  } finally { await fixture.close(); }
});
test('WeChat fixed-current plan and actual local relay preparation cannot inherit the legacy byte policy', async () => {
  const fixture = await weChatPatchFixture();
  try {
    const input = fixture.input(), plan = createWeChatLauncherCatalogPatchPlan(input);
    assert.equal(plan.processPlan.profile, WIN32_LAUNCHER_PATCH_PROFILE);
    assert.ok(text(plan.processPlan.commandLineBytes).startsWith('"C:\\Original\\Client\\PATCH.BAK.EXE" '));
    const result = await createWeChatLauncherPatchPreparer({ wx: fixture.native.wx, routes: [fixture.route] }).prepare(input);
    assert.equal(result.processPlan.profile, WIN32_LAUNCHER_PATCH_PROFILE);
    assert.deepEqual(result.candidate.files, fixture.upstream.scenario.expectedFiles);
    assert.equal(result.requests.length, 3); assert.equal(fixture.native.stats.listeners, 0);
  } finally { await fixture.close(); }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { PUK3_PATCH_SOURCE_PROFILE, createPuk3PatchSourcePlan, computeLauncherFileMd5, parseGamePatchManifest,
  createLauncherResourceSnapshot, readLauncherResourceSnapshot, launcherResourceBindingKey } from '../../shared/index.mjs';
import { createLauncherCatalogPatchPlan, prepareLauncherGamePatch } from '../launcher-game-patch.mjs';
import { createLauncherPatchState } from '../launcher-patch-state.mjs';
import { patchCatalogs, originalPatchScenario, utf8 } from './helpers/launcher-game-patch-fixture.mjs';

const profile = PUK3_PATCH_SOURCE_PROFILE.id;
const primary = 'http://221.122.108.10', alternate = 'http://221.122.119.156';
const rejectsCode = (promise, code) => assert.rejects(promise, error => error.code === code);
function input(changes = {}) {
  const catalogs = patchCatalogs(80, { patcher: 'Patcher_PUK3.exe' });
  catalogs.regionListBytes = utf8(new TextDecoder().decode(catalogs.regionListBytes).replace('<PIP>127.0.0.1</PIP>', '<PIP>221.122.108.10</PIP>'));
  catalogs.regionListMd5 = computeLauncherFileMd5(catalogs.regionListBytes);
  return { catalogs, gameOrdinal: 0, referenceOrdinal: 0, directoryText: 'C:\\Original\\Client', pathEncoding: 'ascii',
    alreadyPatched: false, files: [], epochSeconds: 1234567890, allowedOrigins: [primary, alternate], ...changes };
}

test('fixed source fingerprint yields source0 with original port text and the observed alternate80', () => {
  const data = { address: '221.122.108.10', portText: '00081' }, plan = createPuk3PatchSourcePlan(data);
  assert.equal(plan.sourceSha256, '195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8');
  assert.deepEqual(plan.sources, [
    { sourceOrdinal: 0, address: '221.122.108.10', portText: '00081', port: 81, kind: 'configured' },
    { sourceOrdinal: 1, address: '221.122.119.156', portText: '80', port: 80, kind: 'native-alternate' },
  ]);
  data.portText = '9999'; assert.equal(plan.sources[0].portText, '00081');
  assert.ok(Object.isFrozen(plan) && Object.isFrozen(plan.sources) && plan.sources.every(Object.isFrozen));
  assert.equal(plan.automaticRequests, false); assert.equal(plan.authentication, 'unverified');
});
test('the pinned subset rejects unrelated endpoints, invalid ports and accessors without invoking them', () => {
  assert.throws(() => createPuk3PatchSourcePlan({ address: 'patch.invalid', portText: '80' }), error => error.code === 'PATCH_SOURCE_PROFILE');
  for (const portText of ['', '0', '65536', '000080', '8e1', '８０', 80, null]) {
    assert.throws(() => createPuk3PatchSourcePlan({ address: '221.122.108.10', portText }), error => error.code === 'PATCH_SOURCE_INPUT');
  }
  let invoked = 0;
  assert.throws(() => createPuk3PatchSourcePlan({ get address() { invoked++; }, portText: '80' }), error => error.code === 'PATCH_SOURCE_INPUT');
  assert.throws(() => createPuk3PatchSourcePlan(Object.create({ address: '221.122.108.10', portText: '80' })), error => error.code === 'PATCH_SOURCE_INPUT');
  assert.equal(invoked, 0);
});
test('matching metadata alone keeps the default single configured source; the pinned profile is explicit', () => {
  const normal = createLauncherCatalogPatchPlan(input());
  assert.equal(normal.patchSourceProfile, 'configured-only'); assert.equal(normal.patchSources.length, 1);
  const selected = createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, patchSourceOrdinal: 1 }));
  assert.equal(selected.patchSources.length, 2); assert.equal(selected.selectedPatchSource.address, '221.122.119.156');
  assert.equal(selected.binding.patchSourceOrdinal, 1);
  assert.equal(new TextDecoder().decode(selected.processPlan.addressBytes), '221.122.108.10');
  assert.equal(new TextDecoder().decode(selected.processPlan.backupNameBytes), 'PATCHER_PUK3.BAK.EXE');
  assert.throws(() => createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, gameOrdinal: 1 })), error => error.code === 'GAME_PATCH_SOURCE_PROFILE');
});
test('alternate permission, profile and ordinal are checked before a transport provider runs', async () => {
  let calls = 0; const fetchImpl = () => { calls++; throw Error('Unexpected request'); };
  await rejectsCode(prepareLauncherGamePatch(input({ patchSourceProfile: profile, patchSourceOrdinal: 1,
    allowedOrigins: [primary], fetchImpl })), 'HTTP_ORIGIN');
  for (const change of [{ patchSourceOrdinal: 1 }, { patchSourceProfile: profile, patchSourceOrdinal: 2 },
    { patchSourceProfile: profile, patchSourceOrdinal: -1 }, { patchSourceProfile: profile, patchSourceOrdinal: 0.5 }]) {
    await rejectsCode(prepareLauncherGamePatch(input({ ...change, fetchImpl })), 'GAME_PATCH_SOURCE_ORDINAL');
  }
  await rejectsCode(prepareLauncherGamePatch(input({ patchSourceProfile: 'unknown', fetchImpl })), 'GAME_PATCH_SOURCE_PROFILE');
  let invoked = 0; const value = input({ fetchImpl });
  Object.defineProperty(value, 'patchSourceOrdinal', { get() { invoked++; } });
  await rejectsCode(prepareLauncherGamePatch(value), 'GAME_PATCH_INPUT');
  assert.equal(invoked, 0); assert.equal(calls, 0);
});
test('explicit alternate keeps the manifest and ZIP candidate on that source despite caller mutation', async () => {
  const scenario = originalPatchScenario('create-deflate'), requests = [];
  const value = input({ patchSourceProfile: profile, patchSourceOrdinal: 1, files: scenario.files });
  const before = structuredClone(value.files);
  value.fetchImpl = async (url, options) => {
    requests.push(url); assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error');
    value.patchSourceOrdinal = 0; value.patchSourceProfile = 'configured-only';
    return new Response(url.includes('Update.TXT?') ? scenario.manifestBytes : scenario.archives[0].bytes, { status: 200 });
  };
  const result = await prepareLauncherGamePatch(value);
  assert.deepEqual(requests, [alternate + '/cg50/Update.TXT?t=1234567890', alternate + '/cg50/Bin/new.bin.bz2?time=1234567890']);
  assert.deepEqual(result.candidate.files, scenario.expectedFiles); assert.deepEqual(value.files, before);
  assert.equal(result.patchSourceOrdinal, 1); assert.equal(result.replacement, 'not-performed');
  assert.equal(result.authentication, 'unverified');
});
test('a failed selected source makes one request and does not silently switch or retry', async () => {
  for (const sourceOrdinal of [0, 1]) {
    const requests = [];
    await rejectsCode(prepareLauncherGamePatch(input({ patchSourceProfile: profile, patchSourceOrdinal: sourceOrdinal,
      fetchImpl: async url => { requests.push(url); return new Response('', { status: 503 }); } })), 'HTTP_STATUS');
    assert.deepEqual(requests, [(sourceOrdinal ? alternate : primary) + '/cg50/Update.TXT?t=1234567890']);
  }
});
test('completion skip and early cancellation do not contact either source', async () => {
  let calls = 0; const fetchImpl = () => { calls++; throw Error('Unexpected request'); };
  const skipped = await prepareLauncherGamePatch(input({ patchSourceProfile: profile, patchSourceOrdinal: 1, alreadyPatched: true, fetchImpl }));
  assert.equal(skipped.disposition, 'already-patched'); assert.equal(skipped.candidate, null);
  const controller = new AbortController(); controller.abort();
  await rejectsCode(prepareLauncherGamePatch(input({ patchSourceProfile: profile, patchSourceOrdinal: 1, signal: controller.signal, fetchImpl })), 'GAME_PATCH_ABORTED');
  assert.equal(calls, 0);
});
test('larger original manifests accept257 through512 operations and reject the next block', () => {
  const manifest = count => utf8(Array.from({ length: count }, (_, index) => `create\nname:original${index}.bin\nmd5:${'0'.repeat(32)}}`).join('\n'));
  for (const count of [257, 512]) {
    const parsed = parseGamePatchManifest(manifest(count));
    assert.equal(parsed.blockCount, count); assert.equal(parsed.operations.length, count);
    assert.equal(parsed.operations.at(-1).blockOrdinal, count - 1);
    assert.equal(new TextDecoder().decode(parsed.operations.at(-1).fields[0].valueBytes), `original${count - 1}.bin`);
  }
  assert.throws(() => parseGamePatchManifest(manifest(513)), error => error.code === 'PATCH_BUDGET');
});
test('default source retains legacyv1 cache keys while pinned source choices have distinctv2 identities', () => {
  const normal = createLauncherCatalogPatchPlan(input()).binding, legacy = { ...normal };
  delete legacy.patchSourceProfile; delete legacy.patchSourceOrdinal;
  assert.equal(launcherResourceBindingKey(normal), launcherResourceBindingKey(legacy));
  const cached = createLauncherResourceSnapshot({ binding: normal, files: [] });
  assert.equal(cached.schema, 'moli.launcher.resources.v1');
  assert.equal(Object.hasOwn(cached.binding, 'patchSourceProfile'), false);
  assert.deepEqual(readLauncherResourceSnapshot(cached), cached);
  const bindings = [0, 1].map(patchSourceOrdinal => createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, patchSourceOrdinal })).binding);
  assert.notEqual(launcherResourceBindingKey(bindings[0]), launcherResourceBindingKey(bindings[1]));
  assert.notEqual(launcherResourceBindingKey(normal), launcherResourceBindingKey(bindings[0]));
  for (const patchSourceOrdinal of [0, 1]) {
    const value = createLauncherResourceSnapshot({ binding: bindings[patchSourceOrdinal], files: [] });
    assert.equal(value.schema, 'moli.launcher.resources.v2');
    assert.equal(value.binding.patchSourceProfile, profile); assert.equal(value.binding.patchSourceOrdinal, patchSourceOrdinal);
    assert.deepEqual(readLauncherResourceSnapshot(value), value);
  }
});
test('page candidate restoration rejects another source and retains the correct source after selection', () => {
  const primaryBinding = createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, patchSourceOrdinal: 0 })).binding;
  const alternateBinding = createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, patchSourceOrdinal: 1 })).binding;
  const cached = createLauncherResourceSnapshot({ binding: primaryBinding, files: [{ path: 'original.bin', bytes: utf8('original') }] });
  const state = createLauncherPatchState();
  const wrong = state.restore(cached, alternateBinding);
  assert.equal(wrong.state, 'failed'); assert.equal(wrong.errorCode, 'RESOURCE_BINDING'); assert.equal(wrong.hasCandidate, false);
  assert.equal(state.restore(cached, primaryBinding).state, 'ready'); state.choose();
  const selected = state.copySelectedResources();
  assert.equal(selected.schema, 'moli.launcher.resources.v2'); assert.equal(selected.binding.patchSourceOrdinal, 0);
  assert.equal(new TextDecoder().decode(cached.files[0].bytes), 'original');
});
test('stored resource schema and pinned source fields must agree, including paired own data', () => {
  const binding = createLauncherCatalogPatchPlan(input({ patchSourceProfile: profile, patchSourceOrdinal: 1 })).binding;
  const cached = createLauncherResourceSnapshot({ binding, files: [] });
  const code = value => assert.throws(() => readLauncherResourceSnapshot(value), error => ['RESOURCE_FORMAT', 'RESOURCE_BINDING', 'RESOURCE_INPUT'].includes(error.code));
  code({ ...cached, schema: 'moli.launcher.resources.v1' });
  code({ ...cached, binding: { ...cached.binding, patchSourceOrdinal: 2 } });
  const unpaired = { ...cached.binding }; delete unpaired.patchSourceOrdinal;
  code({ ...cached, binding: unpaired });
  code({ ...cached, binding: { ...cached.binding, patchSourceProfile: 'configured-only', patchSourceOrdinal: 0 } });
  let called = 0; const getter = { ...cached.binding };
  Object.defineProperty(getter, 'patchSourceOrdinal', { get() { called++; return 1; } });
  code({ ...cached, binding: getter }); assert.equal(called, 0);
});

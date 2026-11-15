import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLegacyGameStartup, prepareLegacyGameStartup, snapshotLegacyGameClientContext } from '../index.mjs';
import { createLegacyGameResourcePlan, mergeLegacyGameResourceParameters } from '../legacy-game-resource-paths.mjs';
import { originalStartup } from '../../analysis/game-browser-owner-v1/original_startup.mjs';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const original = () => originalStartup({ scene: read('../../analysis/game-legacy-scene-frame-v1/original-vectors.json'), input: read('../../analysis/game-input-runtime-v1/original-vectors.json'), post: read('../../analysis/game-post-login-v1/original-vectors.json') });
test('startup owns bounded exact source fields and full explicit context without retaining caller byte aliases', () => {
  const raw = original(), copy = structuredClone(raw), handle = createLegacyGameStartup(raw), first = handle.copy();
  assert.deepEqual(raw, copy); assert.equal(handle.inspect().ownedBytes, 60); assert.equal(first.context.display.width, 320);
  raw.context.display.width = 12; first.mappingBytes.fill(0); const second = handle.copy(); assert.equal(second.mappingBytes[0], 103); assert.equal(second.context.display.width, 320);
  second.mappingBytes.fill(0); second.moduleDigestBytes.fill(0); second.resourceParameters.fill(0);
  handle.close(); assert.equal(handle.inspect().ownedBytes, 0); assert.throws(() => handle.copy(), e => e.code === 'LEGACY_CLIENT_STARTUP_CLOSED'); first.moduleDigestBytes.fill(0);
});
test('startup refuses current profile, unknown keys, malformed secret bytes and unsupported resource parameters', () => {
  for (const edit of [x => x.sourceProfile = 'win32-current', x => x.sourceSha256 = '0'.repeat(64), x => x.extra = 1, x => x.mappingHex = '00', x => x.mappingHex += 'ff'.repeat(257), x => x.moduleDigestHex = 'aa', x => x.moduleDigestHex = 'FF'.repeat(32), x => x.resourceParametersHex = '80', x => delete x.context.input]) {
    const raw = original(); edit(raw); assert.throws(() => createLegacyGameStartup(raw));
  }
});
test('explicit context validates all gates and display, freezes copies and never fills absent native values with zero', () => {
  const raw = original().context, c = snapshotLegacyGameClientContext(raw); raw.actor.bodyFlags = 1; raw.movement.nativePartyMode = 1;
  assert.equal(c.actor.bodyFlags, 0); assert.equal(c.movement.nativePartyMode, 0); assert.equal(Object.isFrozen(c.display.center), true);
  for (const edit of [x => delete x.runtime.runtimeStage, x => delete x.movement.nativeInputGuard, x => x.actor.specialState = 1, x => x.input.ownGateByte = 128, x => x.input.nativePartyMode = 1, x => x.display.width = 0, x => x.display.graphicsMode = 3, x => x.display.extra = 0]) {
    const next = original().context; edit(next); assert.throws(() => snapshotLegacyGameClientContext(next));
  }
  let read = 0; const x = original(); Object.defineProperty(x, 'mappingHex', { get() { read++; return '00'; } }); assert.throws(() => createLegacyGameStartup(x)); assert.equal(read, 0);
});

test('startup v1 keeps the explicit digest without asking the selected file port', async () => {
  const input = original();
  const startup = await prepareLegacyGameStartup(input, { stat() { assert.fail('unexpected source lookup'); } });
  const copy = startup.copy();
  assert.equal(startup.inspect().configFromSelectedFiles, false);
  assert.equal(Buffer.from(copy.moduleDigestBytes).toString('hex'), input.moduleDigestHex);
  startup.close();
});

test('startup v2 requires the exact legacy image and never falls back to a supplied digest', async () => {
  const input = original();
  input.schema = 'moli.legacy-game-startup.v2';
  delete input.moduleDigestHex;
  const moduleError = { code: 'LEGACY_CLIENT_STARTUP_MODULE' };
  await assert.rejects(prepareLegacyGameStartup(input), moduleError);
  await assert.rejects(prepareLegacyGameStartup(input, {
    stat(name) { assert.equal(name, 'cg_se_6000.exe'); return 1569279; },
    read() { assert.fail('unexpected read after size mismatch'); },
  }), moduleError);
  for (const length of [1569279, 1569280]) {
    const wrongImage = new Uint8Array(length).fill(1);
    await assert.rejects(prepareLegacyGameStartup(input, {
      stat: () => 1569280,
      read(name, offset, size) { assert.deepEqual([name, offset, size], ['cg_se_6000.exe', 0, 1569280]); return wrongImage; },
    }), moduleError);
    assert.equal(wrongImage.every(byte => byte === 1), true);
  }
  const noFiles = { stat() { assert.fail('invalid startup reached selected files'); } };
  await assert.rejects(prepareLegacyGameStartup({ ...input, moduleDigestHex: '' }, noFiles), { code: 'LEGACY_INPUT_FIELDS' });
  await assert.rejects(prepareLegacyGameStartup({ ...input, sourceSha256: '0'.repeat(64) }, noFiles), { code: 'LEGACY_CLIENT_STARTUP_PROFILE' });
});

test('legacy Config.dat uses its first visible text line, followed immediately by the command tail', () => {
  const tail = Buffer.from('folder:Artwork');
  const prefix = Buffer.from('bin');
  assert.equal(createLegacyGameResourcePlan(mergeLegacyGameResourceParameters(prefix, tail)).directory, 'Artwork');
  const command = Buffer.from('binfolder:Command graphicbin:\v+73');
  for (const [input, expected] of [
    ['binfolder:\fArtwork\r\ngraphicbin:99', 'binfolder:\fArtwork\n'],
    ['binfolder:Artwork\nignored', 'binfolder:Artwork\n'],
    ['binfolder:Artwork \rX\nignored', 'binfolder:Artwork \rX\n'],
    ['binfolder:Artwork \x1aignored', 'binfolder:Artwork '],
    ['binfolder:Artwork \0ignored\r\n', 'binfolder:Artwork '],
  ]) {
    const bytes = Buffer.from(input);
    const merged = mergeLegacyGameResourceParameters(bytes, command);
    assert.equal(Buffer.from(merged).toString('ascii'), expected + command.toString('ascii'));
    assert.equal(createLegacyGameResourcePlan(merged).directory, 'Artwork');
    assert.match(createLegacyGameResourcePlan(merged).groups[0].graphic, /Graphic_73\.bin$/i);
    assert.equal(bytes.toString('ascii'), input);
  }
});

test('legacy Config.dat retains the 255th text byte and bounds the terminated merge', () => {
  const text = Buffer.alloc(254, 32);
  for (const [suffix, retained] of [['\r\n', '\n'], ['\r', '\r'], ['AB', 'A']]) {
    const merged = mergeLegacyGameResourceParameters(Buffer.concat([text, Buffer.from(suffix)]), Buffer.alloc(4864, 32));
    assert.equal(merged.length, 5119);
    assert.equal(merged[254], retained.charCodeAt(0));
  }
  assert.throws(() => mergeLegacyGameResourceParameters(Buffer.alloc(256, 32), Buffer.alloc(4865, 32)),
    { code: 'LEGACY_ASSET_CONFIG_MERGE_LIMIT' });
  assert.throws(() => mergeLegacyGameResourceParameters(new Uint8Array(), Buffer.alloc(5120, 32)),
    { code: 'LEGACY_ASSET_CONFIG_MERGE_LIMIT' });
  const noFile = Buffer.alloc(32767, 32);
  const merged = mergeLegacyGameResourceParameters(null, noFile);
  merged[0] = 0;
  assert.equal(noFile[0], 32);
  assert.equal(merged.length, 32767);
});

test('startup v2 requires exactly one resource input form and v1 keeps explicit fields', async () => {
  const input = original(), { moduleDigestHex, resourceParametersHex, ...rest } = input;
  const noFiles = { stat() { assert.fail('invalid material reached file lookup'); } };
  const v2 = { ...rest, schema: 'moli.legacy-game-startup.v2' };
  await assert.rejects(prepareLegacyGameStartup(v2, noFiles), { code: 'LEGACY_INPUT_FIELDS' });
  await assert.rejects(prepareLegacyGameStartup({ ...v2, commandTailHex: '', resourceParametersHex }, noFiles), { code: 'LEGACY_INPUT_FIELDS' });
  await assert.rejects(prepareLegacyGameStartup({ ...input, commandTailHex: '' }, noFiles), { code: 'LEGACY_INPUT_FIELDS' });
  await assert.rejects(prepareLegacyGameStartup({ ...v2, commandTailHex: '' }), { code: 'LEGACY_CLIENT_STARTUP_MODULE' });
});

test('legacy source display is opt-in and survives a context snapshot round trip', () => {
  const input = original();
  input.context.display = 'legacy-se6000-37c4';
  const owner = createLegacyGameStartup(input);
  try {
    const context = owner.copy().context;
    assert.deepEqual(context.display, { width: 640, height: 480, center: [320, 240], initialCamera: null, graphicsMode: 2, forceRender: false });
    assert.deepEqual(snapshotLegacyGameClientContext(structuredClone(context)).display, context.display);
    assert.equal(Object.isFrozen(context.display.center), true);
  } finally { owner.close(); }
  input.context.display = 'win32-current';
  assert.throws(() => createLegacyGameStartup(input));
});

test('ordinary movement and input selections remain explicit through startup snapshots', () => {
  const input = original();
  input.context.movement = input.context.input = 'legacy-se6000-37c4';
  const owner = createLegacyGameStartup(input);
  try {
    const context = owner.copy().context;
    assert.equal(context.movement, 'legacy-se6000-37c4');
    assert.equal(context.input, 'legacy-se6000-37c4');
    assert.deepEqual(snapshotLegacyGameClientContext(structuredClone(context)), context);
  } finally { owner.close(); }
  input.context.movement = 'win32-current';
  assert.throws(() => createLegacyGameStartup(input));
});

test('the exact legacy profile selects one complete ordinary startup context', async () => {
  const input = original(), profile = input.sourceProfile;
  input.context = profile;
  const owner = createLegacyGameStartup(input);
  try {
    const { context } = owner.copy();
    assert.equal(context.input, profile);
    assert.equal(context.movement, profile);
    assert.deepEqual(context.runtime, { runtimeStage: 3, ownGateByte: 0, movementScale: 1, soundScene: 9, sparseMode: 0 });
    assert.deepEqual(context.actor, { unindexed: false, recordGateFlags: 0, recordMotionFlags: 0, recordTypeFlags: 0,
      recordDrawFlags: 0, bodyFlags: 0x34, specialState: 0, frozen: 0, childAction: null });
    assert.deepEqual(context.display, { width: 640, height: 480, center: [320, 240], initialCamera: null, graphicsMode: 2, forceRender: false });
    assert.ok(Object.isFrozen(context.runtime) && Object.isFrozen(context.actor));
    assert.deepEqual(snapshotLegacyGameClientContext(structuredClone(context)), context);
  } finally { owner.close(); }
  const { moduleDigestHex, ...fileInput } = input;
  fileInput.schema = 'moli.legacy-game-startup.v2';
  await assert.rejects(prepareLegacyGameStartup(fileInput), { code: 'LEGACY_CLIENT_STARTUP_MODULE' });
  fileInput.context = 'win32-current';
  await assert.rejects(prepareLegacyGameStartup(fileInput, { stat() { assert.fail('unknown context reached the file port'); } }), { code: 'LEGACY_INPUT_FIELDS' });
});

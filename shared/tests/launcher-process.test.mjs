import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createLauncherProcessPlan, createLauncherResourceArguments, LauncherProcessError,
  LAUNCHER_PROCESS_LIMITS, LAUNCHER_RESOURCE_GROUPS } from '../index.mjs';
const vectors = JSON.parse(await readFile(new URL('../../analysis/launcher-v23/original-process-vectors.json', import.meta.url)));
const raw = text => new TextEncoder().encode(text);
const unhex = text => Uint8Array.from(Buffer.from(text, 'hex'));
const hex = bytes => Buffer.from(bytes).toString('hex');
const entry = (name, attributes = 32) => ({ fileNameBytes: raw(name), attributes });
const resources = entries => createLauncherResourceArguments({ caseProfile: 'ascii', state: 'enumerated', entries });
function input(vector = vectors.cases[0]) {
  return { gameCode: vector.game_code, onlyRefreshWord: vector.only_refresh_word, caseProfile: 'ascii',
    ...Object.fromEntries(['directory', 'executable_path', 'args_line', 'region_args', 'galaxy_args'].map(key =>
      [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) + 'Bytes', unhex(vector[key + '_hex'])])),
    resourceGroups: vector.resource_groups.map(group => ({ id: group.id, state: group.state,
      ...(group.entries ? { entries: group.entries.map(([name, attr]) => entry(name, attr)) } : {}) })) };
}

test('48 independent process vectors preserve all bytes, branch decisions, cwd and seven native group positions', () => {
  assert.equal(vectors.cases.length, 48);
  for (const vector of vectors.cases) {
    const actual = createLauncherProcessPlan(input(vector)), expected = vector.expected;
    assert.equal(hex(actual.commandLineBytes), expected.command_line_hex, vector.name);
    assert.equal(hex(actual.workingDirectoryBytes), expected.working_directory_hex, vector.name);
    assert.equal(actual.resourceEnumerationRequested, expected.resource_enumeration_requested, vector.name);
    assert.equal(actual.clientCreationRequested, expected.client_creation_requested, vector.name);
    assert.deepEqual(actual.resourceGroups.map(group => ({ id: group.id, pattern_hex: hex(group.patternBytes), state: group.state,
      entries_seen: group.entriesSeen, skipped_directories: group.skippedDirectories,
      rows: group.rows.map(row => ({ source_ordinal: row.sourceOrdinal, file_name: row.fileName, argument: row.argument })) })),
    expected.groups.map(({ bytes_hex, ...group }) => group), vector.name);
    assert.equal(actual.authentication, 'unverified'); assert.equal(actual.upstreamReady, 'unverified');
    assert.equal(actual.gameAcceptance, 'unverified'); assert.equal(actual.execution, 'not-performed');
    assert.equal(actual.applicationName, null); assert.equal(actual.inheritHandles, false);
    assert.equal(actual.creationFlags, 0); assert.equal(actual.environment, 'inherit');
  }
});
test('four independent enumeration vectors retain final row, original order, duplicates and directory exclusions', () => {
  for (const vector of vectors.resource_cases) {
    const result = createLauncherResourceArguments({ caseProfile: 'ascii', state: vector.state,
      ...(vector.entries ? { entries: vector.entries.map(([name, attr]) => entry(name, attr)) } : {}) });
    assert.equal(hex(result.bytes), vector.expected.bytes_hex, vector.name);
    assert.equal(result.entriesSeen, vector.expected.entries_seen); assert.equal(result.skippedDirectories, vector.expected.skipped_directories);
    assert.deepEqual(result.rows.map(row => ({ source_ordinal: row.sourceOrdinal, file_name: row.fileName, argument: row.argument })), vector.expected.rows);
    assert.equal(result.enumerationOrder, 'provided'); assert.equal(result.sourceCompletion, 'unverified');
  }
});
test('manual native-rule sentinels cover last underscore, index zero, first keyword family and all occurrences', () => {
  assert.deepEqual(resources(['GraphicInfo_Joy_22.bin', 'ANIME_1_2.bin', '_ANIME.bin', '__Anime__.bin', 'InfoInfo_1.bin',
    'InfoGraphicAnime_7.bin', 'Graphic.foo.bin', '.bin', 'Title.'].map(name => entry(name))).rows.map(row => row.argument),
  ['graphicinfobin_joy:22', 'animebin_1:2', '_animebin', '__animebin_:', 'infobininfobin:1',
    'infobingraphicanime:7', 'graphicbin.foo', '', 'title']);
});
test('onlyRefresh skips the native client branch exactly for Codes0/1/2/4/11 and does not read irrelevant resource fields', () => {
  let touched = 0;
  for (let gameCode = 0; gameCode < 15; gameCode++) {
    const fields = input(); fields.gameCode = gameCode; fields.onlyRefreshWord = 1;
    Object.defineProperty(fields, 'resourceGroups', { get() { touched++; throw new Error('unused'); } });
    Object.defineProperty(fields, 'caseProfile', { get() { touched++; throw new Error('unused'); } });
    const plan = createLauncherProcessPlan(fields);
    assert.equal(plan.resourceEnumerationRequested, false); assert.equal(plan.clientCreationRequested, ![0, 1, 2, 4, 11].includes(gameCode));
  }
  assert.equal(touched, 0);
});
test('FindFile failure returns empty and never consumes an entries accessor', () => {
  let touched = false;
  const failed = { caseProfile: 'ascii', state: 'find-failed', get entries() { touched = true; throw new Error(); } };
  assert.equal(createLauncherResourceArguments(failed).bytes.length, 0);
  const fields = input();
  fields.resourceGroups = LAUNCHER_RESOURCE_GROUPS.map(group => ({ id: group.id, state: 'find-failed',
    get entries() { touched = true; throw new Error(); } }));
  assert.equal(createLauncherProcessPlan(fields).resourceGroups.every(group => group.entriesSeen === 0), true);
  assert.equal(touched, false);
});
test('resource groups require seven exact IDs in native order and reject holes or accessor elements', () => {
  for (const mutate of [groups => groups.slice(1), groups => groups.toReversed(), groups => [...groups, groups[0]],
    groups => { delete groups[3]; return groups; }, groups => { Object.defineProperty(groups, '0', { get() { throw new Error('unused'); } }); return groups; }]) {
    const fields = input(); fields.resourceGroups = mutate(fields.resourceGroups);
    assert.throws(() => createLauncherProcessPlan(fields), LauncherProcessError);
  }
});
test('raw path/args require bounded non-NUL bytes and preserve caller buffers on success or failure', () => {
  const fields = input(), original = fields.argsLineBytes.slice(); createLauncherProcessPlan(fields); assert.deepEqual(fields.argsLineBytes, original);
  for (const value of [raw('x\0y'), 'text', new Uint16Array([65]), new Proxy(raw('a'), {}), new Uint8Array(4097).fill(65)]) {
    assert.throws(() => createLauncherProcessPlan({ ...fields, argsLineBytes: value }), LauncherProcessError);
    assert.deepEqual(fields.argsLineBytes, original);
  }
  const max = new Uint8Array(4096).fill(65);
  assert.equal(createLauncherProcessPlan({ ...fields, gameCode: 3, argsLineBytes: max }).commandLineBytes.includes(65), true);
  if (typeof SharedArrayBuffer === 'function') assert.throws(() => createLauncherProcessPlan({ ...fields,
    argsLineBytes: new Uint8Array(new SharedArrayBuffer(8)).fill(65) }), { code: 'PROCESS_BYTES' });
});
test('misleading byte subclasses and later mutations cannot alter copied command or directory output', () => {
  class Misleading extends Uint8Array { get length() { throw new Error(); } [Symbol.iterator]() { throw new Error(); } }
  const fields = input(), backing = raw('zOriginalz'); fields.argsLineBytes = new Misleading(backing.buffer, 1, 8);
  const plan = createLauncherProcessPlan(fields), copy = plan.commandLineBytes.slice(); backing.fill(0); fields.directoryBytes.fill(0);
  assert.deepEqual(plan.commandLineBytes, copy); assert.equal(plan.workingDirectoryBytes.at(-1), 0);
  assert.equal(Object.isFrozen(plan), true); assert.equal(Object.isFrozen(plan.resourceGroups), true);
});
test('title255 and filename259 boundaries apply before normal directory filtering', () => {
  assert.equal(resources([entry('x'.repeat(255) + '.bin')]).rows[0].argument.length, 255);
  for (const attributes of [32, 16]) assert.throws(() => resources([entry('x'.repeat(256) + '.b', attributes)]), { code: 'RESOURCE_NAME' });
  assert.throws(() => resources([entry('x'.repeat(256) + '.bin')]), { code: 'PROCESS_BUDGET' });
  assert.equal(resources([entry('.', 16), entry('..', 16), entry('normal.bin', 16)]).bytes.length, 0);
  assert.equal(resources([entry('hidden.bin', 2), entry('system.bin', 4)]).rows.length, 2);
});
test('unsupported title encodings, path components and absent explicit case profile fail closed', () => {
  for (const name of ['a/b.bin', 'a\\b.bin', 'C:foo.bin', '\t.bin', '中文.bin']) assert.throws(() => resources([entry(name)]), LauncherProcessError);
  assert.throws(() => createLauncherResourceArguments({ state: 'enumerated', entries: [] }), { code: 'PROCESS_INPUT' });
  for (const caseProfile of ['auto', 'windows-936', 'utf8', null]) assert.throws(() => createLauncherResourceArguments({
    caseProfile, state: 'enumerated', entries: [] }), { code: 'RESOURCE_PROFILE' });
});
test('command budget includes final NUL and all seven concatenated resource groups', () => {
  const fields = input(vectors.cases.find(row => row.name === 'empty-all'));
  fields.resourceGroups[0] = { id: 'bin-anime', state: 'enumerated', entries:
    [...Array.from({ length: 127 }, () => entry('x'.repeat(255) + '.bin')), entry('x'.repeat(252) + '.bin')] };
  const plan = createLauncherProcessPlan(fields); assert.equal(plan.commandLineBytes.length, LAUNCHER_PROCESS_LIMITS.commandBytes);
  assert.equal(plan.commandLineBytes.at(-1), 0);
  fields.resourceGroups[0].entries.at(-1).fileNameBytes = raw('x'.repeat(253) + '.bin');
  assert.throws(() => createLauncherProcessPlan(fields), { code: 'PROCESS_BUDGET' });
});
test('enumeration budgets cover entry count, expansion and fixed numeric words', () => {
  assert.equal(resources(Array.from({ length: 4096 }, () => entry('d.bin', 16))).entriesSeen, 4096);
  assert.throws(() => resources(Array(4097)), { code: 'PROCESS_BUDGET' });
  assert.throws(() => resources(Array.from({ length: 80 }, () => entry('Info'.repeat(63) + '.bin'))), { code: 'PROCESS_BUDGET' });
  for (const attributes of [-1, 0x100000000, '32', NaN, 1n]) assert.throws(() => resources([entry('x.bin', attributes)]), { code: 'PROCESS_INPUT' });
});
test('invalid game/refresh scalars, inherited properties and accessors cannot be coerced or leak their contents', () => {
  for (const gameCode of [-1, 15, NaN, '11', {}, 1n]) assert.throws(() => createLauncherProcessPlan({ ...input(), gameCode }), { code: 'PROCESS_GAME' });
  for (const onlyRefreshWord of [-1, 0x100000000, Infinity, '1', 1n]) assert.throws(() => createLauncherProcessPlan({ ...input(), onlyRefreshWord }), { code: 'PROCESS_INPUT' });
  let touched = false; const fields = input();
  assert.throws(() => createLauncherProcessPlan(Object.create(fields)), { code: 'PROCESS_INPUT' });
  Object.defineProperty(fields, 'argsLineBytes', { get() { touched = true; throw new Error('never echo'); } });
  assert.throws(() => createLauncherProcessPlan(fields), { code: 'PROCESS_INPUT' }); assert.equal(touched, false);
  const error = new LauncherProcessError({ toString() { throw new Error(); } }); assert.equal(error.code, 'PROCESS_INPUT');
  assert.deepEqual(Object.keys(error).sort(), ['code', 'name']);
});
test('hostile array descriptor traps return controlled snapshot errors', () => {
  const entries = new Proxy([entry('Original.bin')], { getOwnPropertyDescriptor(target, key) {
    if (key === '0') throw new Error('Private trap text'); return Reflect.getOwnPropertyDescriptor(target, key); } });
  assert.throws(() => resources(entries), { name: 'LauncherProcessError', code: 'RESOURCE_SNAPSHOT', message: 'Resource enumeration snapshot is invalid.' });
  const hole = [entry('Original.bin')]; delete hole[0]; assert.throws(() => resources(hole), { code: 'RESOURCE_SNAPSHOT' });
});

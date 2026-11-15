import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createLauncherLaunchLease, encodeLauncherProcessField, encodeLauncherCredential,
  decodeLauncherReply, selectLauncherProfile, LAUNCHER_RESOURCE_GROUPS } from '../index.mjs';
const vectors = JSON.parse(await readFile(new URL('../../analysis/launcher-v23/original-process-vectors.json', import.meta.url)));
const handoffs = JSON.parse(await readFile(new URL('../../analysis/launcher-v22/original-handoff-vectors.json', import.meta.url)));
const unhex = text => Uint8Array.from(Buffer.from(text, 'hex')), hex = bytes => Buffer.from(bytes).toString('hex');
const raw = text => new TextEncoder().encode(text);
const selected = () => ({ profile: { nameBytes: raw('OriginalGid'), stateWord: 0, billingWord: 0, expiredWord: 0 },
  opaqueByteField: raw('OriginalOpaque'), tailWordA: 0x80000020 });
function processInput(vector = vectors.cases[0]) {
  return { gameCode: vector.game_code, onlyRefreshWord: vector.only_refresh_word, caseProfile: 'ascii',
    ...Object.fromEntries(['directory', 'executable_path', 'args_line', 'region_args', 'galaxy_args'].map(key =>
      [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) + 'Bytes', unhex(vector[key + '_hex'])])),
    resourceGroups: vector.resource_groups.map(group => ({ id: group.id, state: group.state,
      ...(group.entries ? { entries: group.entries.map(([name, attributes]) => ({ fileNameBytes: raw(name), attributes })) } : {}) })) };
}
test('45 branch contexts combine independent process vectors with the correct per-Code mapping prefix', () => {
  for (const vector of vectors.cases.slice(0, 45)) {
    const lease = createLauncherLaunchLease({ processInput: processInput(vector), selection: selected() });
    const before = lease.snapshot(), context = lease.takeContext();
    assert.equal(before.state, 'ready'); assert.equal(lease.snapshot().state, 'taken');
    assert.equal(hex(context.process.commandLineBytes), vector.expected.command_line_hex, vector.name);
    assert.equal(hex(context.process.workingDirectoryBytes), vector.expected.working_directory_hex, vector.name);
    const reference = handoffs.cases.find(row => row.name === 'mapping-' + vector.game_code).expected;
    assert.equal(context.mapping?.mappingName ?? null, reference.mapping_name);
    assert.equal(hex(context.mapping?.bytes ?? new Uint8Array()), reference.write_hex);
    assert.equal(context.authentication, 'unverified'); assert.equal(context.gameAcceptance, 'unverified'); assert.equal(context.execution, 'not-performed');
    lease.close();
  }
});
test('aggregate close wipes all lent command/cwd/pattern/mapping views and cannot expose a second context', () => {
  const lease = createLauncherLaunchLease({ processInput: processInput(), selection: selected() }), context = lease.takeContext();
  assert.throws(() => lease.takeContext(), { code: 'LAUNCH_STATE' });
  assert.ok(context.mapping.bytes.some(Boolean)); lease.close(); lease.close();
  assert.equal(context.mapping.bytes.every(byte => byte === 0), true);
  for (const view of [context.process.commandLineBytes, context.process.workingDirectoryBytes,
    ...context.process.resourceGroups.map(group => group.patternBytes)]) assert.equal(view.every(byte => byte === 0), true);
  const snapshot = lease.snapshot(); assert.equal(snapshot.state, 'closed'); assert.equal(snapshot.commandBytes, 0);
  assert.equal(snapshot.mappingWriteBytes, 0); assert.equal(snapshot.resourceRows, 0);
});
test('closing before exposure and metadata-only snapshots cannot leak raw command or mapping', () => {
  const lease = createLauncherLaunchLease({ processInput: processInput(), selection: selected() });
  assert.equal(JSON.stringify(lease.snapshot()).includes('OriginalGid'), false); assert.equal(JSON.stringify(lease.snapshot()).includes('Original Root'), false);
  assert.ok(Object.isFrozen(lease)); assert.ok(Object.isFrozen(lease.snapshot())); lease.close();
  assert.throws(() => lease.takeContext(), { code: 'LAUNCH_STATE' });
});
test('overridden byte methods and one transferred buffer cannot prevent clearing all remaining lent views', () => {
  const lease = createLauncherLaunchLease({ processInput: processInput(), selection: selected() }), context = lease.takeContext();
  const views = [context.mapping.bytes, context.process.commandLineBytes, context.process.workingDirectoryBytes,
    ...context.process.resourceGroups.map(group => group.patternBytes)];
  for (const view of views) view.fill = () => { throw new Error('Do not call consumer methods'); };
  const moved = structuredClone(context.process.commandLineBytes.buffer, { transfer: [context.process.commandLineBytes.buffer] });
  assert.doesNotThrow(() => lease.close()); assert.equal(lease.snapshot().state, 'closed');
  for (const view of views.slice(0, 1).concat(views.slice(2))) assert.equal(Uint8Array.prototype.every.call(view, byte => byte === 0), true);
  assert.ok(new Uint8Array(moved).some(Boolean)); // Transfer destination is external consumer ownership, not falsely claimed wiped.
  new Uint8Array(moved).fill(0);
});
test('caller mutation after preparation cannot alter either owned producer output', () => {
  const fields = processInput(), selection = selected(), lease = createLauncherLaunchLease({ processInput: fields, selection });
  const expected = vectors.cases[0].expected.command_line_hex;
  fields.argsLineBytes.fill(0); fields.resourceGroups[0].entries[0].fileNameBytes.fill(0);
  selection.profile.nameBytes.fill(0); selection.opaqueByteField.fill(0);
  const context = lease.takeContext(); assert.equal(hex(context.process.commandLineBytes), expected);
  assert.match(Buffer.from(context.mapping.bytes).toString('ascii'), /^gid:OriginalGid glt:OriginalOpaque:/); lease.close();
});
test('original decoded reply selection feeds an aggregate context without inventing opaque semantics', async () => {
  const fixtures = JSON.parse(await readFile(new URL('../../analysis/launcher-v8/original-login-vectors.json', import.meta.url)));
  const projection = handoffs.reply_projections[0], fixture = fixtures.profiles.find(row => row.name === projection.fixture);
  const selection = selectLauncherProfile(decodeLauncherReply(unhex(fixture.body_hex)), projection.display_ordinal);
  const fields = processInput(); fields.gameCode = 11;
  const lease = createLauncherLaunchLease({ processInput: fields, selection }), context = lease.takeContext();
  assert.equal(hex(context.mapping.bytes), projection.expected.write_hex); lease.close();
});
test('profile gates, process budgets, own inputs and accessors remain enforced by composition', () => {
  const selection = selected(); selection.profile.stateWord = 5;
  assert.throws(() => createLauncherLaunchLease({ processInput: processInput(), selection }), { code: 'HANDOFF_PROFILE' });
  const fields = processInput(); fields.argsLineBytes = new Uint8Array(4097).fill(65);
  assert.throws(() => createLauncherLaunchLease({ processInput: fields, selection: selected() }), { code: 'PROCESS_BUDGET' });
  let touched = false;
  assert.throws(() => createLauncherLaunchLease({ get processInput() { touched = true; return processInput(); }, selection: selected() }), { code: 'LAUNCH_STATE' });
  assert.equal(touched, false);
});
test('explicit process field encodings preserve tabs/newlines/spaces and known CP936/UTF8 bytes independently of credentials', () => {
  assert.equal(hex(encodeLauncherProcessField('  \t--raw\r\n ', { encoding: 'ascii' })), '2020092d2d7261770d0a20');
  assert.equal(hex(encodeLauncherProcessField('C:\\测试\\', { encoding: 'windows-936' })), '433a5cb2e2cad45c');
  assert.equal(hex(encodeLauncherProcessField('C:\\测试\\', { encoding: 'utf-8' })), '433a5ce6b58be8af955c');
  assert.equal(encodeLauncherProcessField('', { encoding: 'ascii' }).length, 0);
  assert.throws(() => encodeLauncherCredential('\tA', { encoding: 'ascii' }), { code: 'TEXT_CONTROL' });
  assert.throws(() => encodeLauncherCredential('', { encoding: 'ascii' }), { code: 'TEXT_LENGTH' });
});
test('field code-unit/encoded budgets, representation and explicit choice reject lossy or malformed input', () => {
  assert.equal(encodeLauncherProcessField('A'.repeat(4096), { encoding: 'ascii' }).length, 4096);
  assert.throws(() => encodeLauncherProcessField('A'.repeat(4097), { encoding: 'ascii' }), { code: 'TEXT_INPUT' });
  assert.throws(() => encodeLauncherProcessField('测'.repeat(2049), { encoding: 'windows-936' }), { code: 'TEXT_FIELD_LENGTH' });
  assert.throws(() => encodeLauncherProcessField('测', { encoding: 'ascii' }), { code: 'TEXT_UNREPRESENTABLE' });
  for (const value of ['\0', '\ud800', '\x01', '\x7f']) assert.throws(() => encodeLauncherProcessField(value, { encoding: 'utf-8' }));
  assert.throws(() => encodeLauncherProcessField('A', { encoding: 'auto' }), { code: 'TEXT_ENCODING' });
});

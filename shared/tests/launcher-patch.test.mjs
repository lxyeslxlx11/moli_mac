import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLauncherPatchPlan, interpretLauncherPatchExit, LauncherPatchError,
  createGamePatchCandidateRun, GamePatchError } from '../index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v27/original-entry-vectors.json',import.meta.url)));
const patches = JSON.parse(readFileSync(new URL('../../analysis/launcher-v26/original-patch-vectors.json',import.meta.url)));
const bytes = hex => Uint8Array.from(Buffer.from(hex,'hex')), hex = bytes => Buffer.from(bytes).toString('hex');
const input = row => ({ ...Object.fromEntries(Object.entries(row.input).map(([key,value]) => [key.replace('_hex','Bytes'),bytes(value)])), alreadyPatched:row.alreadyPatched,caseProfile:'ascii' });
const code = (fn, expected) => assert.throws(fn,error => error instanceof LauncherPatchError && error.code === expected);

test('32 original Python producer vectors preserve exact raw command, paths, original Code and skip disposition', () => {
  for (const row of vectors.entries) {
    const value = createLauncherPatchPlan(input(row));
    for (const [name,expected] of Object.entries(row.expected)) assert.equal(name === 'disposition' ? value.disposition : hex(value[name.replace('_hex','Bytes')]),expected,row.name+':'+name);
    assert.equal(value.execution,'not-performed');assert.equal(value.fileOperations,'not-performed');assert.equal(value.authentication,'unverified');
    assert.equal(value.quoting,'native-raw-unquoted');assert.equal(value.hiddenBackupAttribute,2);
  }
});
test('21 independent native exit-code cases model only patch bookkeeping, including three bounded attempts', () => {
  for (const row of vectors.exits) {
    const result = interpretLauncherPatchExit({exitCode:row.exitCode,attempt:row.attempt});
    assert.deepEqual(Object.fromEntries(Object.keys(row).map(key => [key,result[key]])),row);
    assert.equal(result.fileIntegrity,'unverified');assert.equal(result.authentication,'unverified');
  }
});
test('producer snapshots bytes and uses intrinsic typed-array length rather than subclass metadata', () => {
  const source = input(vectors.entries[0]), before = structuredClone(source), value = createLauncherPatchPlan(source);
  value.commandLineBytes.fill(7);value.codeTextBytes.fill(8);assert.deepEqual(source,before);
  class Wrong extends Uint8Array { get length() { return 0; } *[Symbol.iterator]() { yield 0; } }
  source.directoryBytes = new Wrong(source.directoryBytes);assert.equal(createLauncherPatchPlan(source).disposition,'patch-requested');
  source.directoryBytes = new Proxy(source.directoryBytes,{});code(() => createLauncherPatchPlan(source),'PATCH_PLAN_INPUT');
});
test('unsupported casing, NUL, missing own data and invalid flags/code text are rejected', () => {
  for (const [changes,expected] of [[{caseProfile:'native'},'PATCH_PLAN_INPUT'],[{alreadyPatched:1},'PATCH_PLAN_INPUT'],
    [{patcherBytes:new Uint8Array([0x81,0x61])},'PATCH_PLAN_CASE'],[{directoryBytes:new Uint8Array([67,0])},'PATCH_PLAN_NUL'],
    [{codeTextBytes:new TextEncoder().encode('15')},'PATCH_PLAN_INPUT'],[{directoryBytes:new Uint8Array(4097)},'PATCH_PLAN_BUDGET']]) code(() => createLauncherPatchPlan({...input(vectors.entries[0]),...changes}),expected);
  const source=input(vectors.entries[0]);Object.defineProperty(source,'portBytes',{get(){throw Error('must not invoke');}});code(() => createLauncherPatchPlan(source),'PATCH_PLAN_INPUT');
});
test('invalid exit integers and attempt numbers do not create a success flag', () => {
  for (const exitCode of [-1,0x100000000,100.5,'100']) code(() => interpretLauncherPatchExit({exitCode,attempt:1}),'PATCH_EXIT_INPUT');
  for (const attempt of [0,4,1.5,'1']) code(() => interpretLauncherPatchExit({exitCode:100,attempt}),'PATCH_EXIT_INPUT');
});
test('candidate iterator snapshots before first next and yields sequential dependent packages without exposing partial files', () => {
  const row=patches.scenarios.find(row => row.name==='sequential-create-append'), manifestBytes=bytes(row.manifest_hex), source={manifestBytes,files:[]};
  const run=createGamePatchCandidateRun(source);manifestBytes.fill(0);
  let step=run.next();assert.equal(step.done,false);assert.equal(step.value.blockOrdinal,0);assert.equal(step.value.name,'first.bin');assert.equal(step.value.files,undefined);assert.ok(Object.isFrozen(step.value));
  step=run.next(bytes(row.archives[0].hex));assert.equal(step.value.blockOrdinal,1);assert.equal(step.value.name,'final.bin');assert.equal(step.value.files,undefined);
  step=run.next(bytes(row.archives[1].hex));assert.equal(step.done,true);assert.deepEqual(step.value.files.map(file => ({path:file.path,hex:hex(file.bytes)})),row.expected_files.map(({path,hex})=>({path,hex})));
});
test('closing or failing an iterator leaves caller files unchanged and produces no partial result', () => {
  const row=patches.scenarios.find(row => row.name==='append-deflate');
  const files=row.files.map(file => ({path:file.path,bytes:bytes(file.hex)})),before=structuredClone(files);
  const run=createGamePatchCandidateRun({manifestBytes:bytes(row.manifest_hex),files});run.next();assert.equal(run.return().value,undefined);assert.deepEqual(run.next(),{value:undefined,done:true});
  assert.deepEqual(files,before);
  const bad=createGamePatchCandidateRun({manifestBytes:bytes(row.manifest_hex),files});bad.next();assert.throws(()=>bad.next(new Uint8Array()),Error);assert.deepEqual(bad.next(),{value:undefined,done:true});assert.deepEqual(files,before);
});
test('iterator received buffers retain ZIP and byte-budget checks', () => {
  const row=patches.scenarios.find(row => row.name==='create-stored');
  for (const value of [null,new Uint8Array(33554433)]) {
    const run=createGamePatchCandidateRun({manifestBytes:bytes(row.manifest_hex),files:[]});run.next();assert.throws(()=>run.next(value),GamePatchError);
  }
});

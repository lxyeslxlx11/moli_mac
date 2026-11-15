import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readLauncherPatchFiles,LauncherPatchFileError} from '../launcher-patch-files.mjs';
import {createLauncherPatchState} from '../launcher-patch-state.mjs';
import {snapshotLauncherPatchOrigins,snapshotLauncherPatchRuntime} from '../launcher-patch-source.mjs';
import {applyGamePatchCandidates} from '../../shared/index.mjs';
import {patchCatalogs} from './helpers/launcher-game-patch-fixture.mjs';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
const vector=JSON.parse(await readFile(new URL('../../analysis/launcher-v28/original-ui-patch.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex'));
const context=()=>({catalogs:patchCatalogs(12345),gameOrdinal:0,referenceOrdinal:0,directoryText:'C:\\Original',pathEncoding:'ascii',alreadyPatched:false,allowedOrigins:['http://127.0.0.1:12345'],epochSeconds:1234567890});
function prepared(){return {candidate:applyGamePatchCandidates({manifestBytes:bytes(vector.manifest_hex),files:[],archives:vector.packages.map(row=>({blockOrdinal:row.blockOrdinal,bytes:bytes(row.hex)}))}),binding:Object.freeze({directoryText:'C:\\Original'}),processPlan:{commandLineBytes:new Uint8Array([1,2,0])}};}
const noFiles=async()=>[];

test('native Blob base input strips one directory root, owns bytes and preserves zero-length files',async()=>{
  const blob=new Blob([new Uint8Array([1,0,255])]),result=await readLauncherPatchFiles([{relativePath:'Root/Bin/base.bin',file:blob},{relativePath:'Root/empty',file:new Blob()}]);
  assert.deepEqual(result.map(row=>row.path),['Bin/base.bin','empty']);assert.deepEqual([...result[0].bytes],[1,0,255]);assert.equal(result[1].bytes.length,0);
  result[0].bytes.fill(7);assert.deepEqual([...new Uint8Array(await blob.arrayBuffer())],[1,0,255]);assert.ok(Object.isFrozen(result));
  assert.deepEqual(await readLauncherPatchFiles([]),[]);
});
test('file path conflicts/traversal and inconsistent roots are rejected before reads',async()=>{
  const file=new Blob(['x']);
  for(const paths of [['Root/a','Other/b'],['Root/../a'],['Root/a','Root/A'],['Root/a','Root/a/b'],['Root/CON.bin'],['Root/\\a']]){
    await assert.rejects(readLauncherPatchFiles(paths.map(relativePath=>({relativePath,file}))));
  }
});
test('file count, per-file and aggregate budgets are checked from metadata',async()=>{
  await assert.rejects(readLauncherPatchFiles(new Array(1025)),{code:'PATCH_FILE_INPUT'});
  const large=new Blob([new Uint8Array(33554433)]);await assert.rejects(readLauncherPatchFiles([{relativePath:'Root/a',file:large}]),{code:'PATCH_FILE_BUDGET'});
  const chunk=new Blob([new Uint8Array(25*1024*1024)]);await assert.rejects(readLauncherPatchFiles(['a','b','c'].map(name=>({relativePath:'Root/'+name,file:chunk}))),{code:'PATCH_FILE_BUDGET'});
});
test('Blob overrides cannot replace reads or spoof size, and cancellation discards asynchronous reads',async()=>{
  class Wrong extends Blob{get size(){return 0;}slice(){throw Error('must not invoke');}arrayBuffer(){throw Error('must not invoke');}}
  const result=await readLauncherPatchFiles([{relativePath:'Root/a',file:new Wrong(['abc'])}]);assert.equal(result[0].bytes.length,3);
  const c=new AbortController();c.abort();await assert.rejects(readLauncherPatchFiles([{relativePath:'Root/a',file:new Blob(['abc'])}],{signal:c.signal}),{code:'PATCH_FILE_ABORTED'});
  const active=new AbortController(),pending=readLauncherPatchFiles([{relativePath:'Root/a',file:new Blob([new Uint8Array(8*1024*1024)])}],{signal:active.signal});active.abort();await assert.rejects(pending,{code:'PATCH_FILE_ABORTED'});
});
test('invalid file inputs, fake signals and invalid time policies are rejected',async()=>{
  for(const value of [null,{},'files'])await assert.rejects(readLauncherPatchFiles(value),LauncherPatchFileError);
  await assert.rejects(readLauncherPatchFiles([{relativePath:'Root/a',file:{size:3}}]),{code:'PATCH_FILE_INPUT'});
  for(const options of [{signal:{}},{timeoutMs:0},{timeoutMs:60001}])await assert.rejects(readLauncherPatchFiles([],options),{code:'PATCH_FILE_INPUT'});
});
test('candidate remains review-only until explicit choice and exposes filenames without payload aliases',async()=>{
  const owned=prepared(),state=createLauncherPatchState({prepare:async()=>owned,readFiles:noFiles});
  await state.prepare(context(),[]);assert.equal(state.snapshot().state,'ready');assert.equal(state.selectedPaths(),null);assert.equal(state.snapshot().files[0].bytes,vector.expected_files[0].hex.length/2);
  state.choose();assert.deepEqual(state.selectedPaths(),['Bin/GraphicInfo_8.bin']);assert.equal(state.snapshot().selected,true);
  assert.equal(state.snapshot().files[0].bytes instanceof Uint8Array,false);assert.ok(Object.isFrozen(state.selectedPaths()));
  state.reset();assert.equal(state.snapshot().hasCandidate,false);assert.equal(state.selectedPaths(),null);assert.ok(owned.candidate.files[0].bytes.every(value=>value===0));assert.ok(owned.processPlan.commandLineBytes.every(value=>value===0));
});
test('skipped manifest entries prevent choosing an incomplete candidate',async()=>{
  const result={candidate:applyGamePatchCandidates({manifestBytes:new TextEncoder().encode('unknown\nname:x}'),files:[],archives:[]}),binding:{},processPlan:{}};
  const state=createLauncherPatchState({prepare:async()=>result,readFiles:noFiles});await state.prepare(context(),[]);assert.equal(state.snapshot().skipped,1);assert.equal(state.snapshot().selectable,false);assert.throws(()=>state.choose());
});
test('configuration snapshot precedes deferred file reads and caller changes cannot rebind preparation',async()=>{
  let releaseRead,observed;const reading=new Promise(resolve=>{releaseRead=resolve;}),input=context(),before=new Uint8Array(input.catalogs.gameListBytes);
  const state=createLauncherPatchState({readFiles:async()=>{await reading;return[];},prepare:async value=>{observed=value;return prepared();}});
  const task=state.prepare(input,[]);input.catalogs.gameListBytes.fill(0);input.directoryText='C:\\Changed';input.allowedOrigins[0]='http://127.0.0.1:54321';releaseRead();await task;
  assert.deepEqual(observed.catalogs.gameListBytes,before);assert.equal(observed.directoryText,'C:\\Original');assert.deepEqual(observed.allowedOrigins,['http://127.0.0.1:12345']);
});
test('cancelled provider completion is discarded and its owned buffers are wiped',async()=>{
  let finish;const waiting=new Promise(resolve=>{finish=resolve;}),owned=prepared(),state=createLauncherPatchState({readFiles:noFiles,prepare:async()=>waiting});
  const task=state.prepare(context(),[]);await new Promise(resolve=>setImmediate(resolve));state.cancel();assert.equal(state.snapshot().state,'cancelled');finish(owned);await task;
  assert.equal(state.snapshot().hasCandidate,false);assert.ok(owned.candidate.files[0].bytes.every(value=>value===0));
});
test('a reset and new preparation survive an older provider resolving late',async()=>{
  let finish,calls=0;const old=new Promise(resolve=>{finish=resolve;}),first=prepared(),second=prepared();
  const state=createLauncherPatchState({readFiles:noFiles,prepare:async()=>++calls===1?old:second});
  const oldTask=state.prepare(context(),[]);await new Promise(resolve=>setImmediate(resolve));state.reset();await state.prepare(context(),[]);state.choose();finish(first);await oldTask;
  assert.equal(state.snapshot().selected,true);assert.ok(first.candidate.files[0].bytes.every(value=>value===0));assert.ok(second.candidate.files[0].bytes.some(value=>value!==0));
});
test('invalid or failed re-preparation clears the previous selection',async()=>{
  const owned=prepared(),state=createLauncherPatchState({readFiles:noFiles,prepare:async()=>owned});await state.prepare(context(),[]);state.choose();
  await state.prepare({...context(),catalogs:{}},[]);assert.equal(state.snapshot().state,'failed');assert.equal(state.selectedPaths(),null);assert.ok(owned.candidate.files[0].bytes.every(value=>value===0));
});
test('loopback patch capabilities are explicit, bounded, canonical snapshots',()=>{
  const source=['http://127.0.0.1:12345'],copy=snapshotLauncherPatchOrigins(source);source[0]='changed';assert.deepEqual(copy,['http://127.0.0.1:12345']);assert.ok(Object.isFrozen(copy));assert.equal(snapshotLauncherPatchOrigins(undefined),null);
  for(const origins of [[],new Array(17).fill('http://127.0.0.1:12345'),['https://127.0.0.1:12345'],['http://localhost:12345'],['http://192.0.2.1:12345'],['http://127.0.0.1:12345/'],['http://127.0.0.1:65536'],['http://127.0.0.1:12345','http://127.0.0.1:12345']])assert.throws(()=>snapshotLauncherPatchOrigins(origins));
  assert.throws(()=>snapshotLauncherPatchRuntime({schema:'unknown',allowedOrigins:copy}));assert.throws(()=>snapshotLauncherPatchRuntime({schema:'moli.local-game-patch.v1'}));
});
test('local server publishes and permits only explicitly configured patch HTTP origins',async()=>{
  const origins=['http://127.0.0.1:12345'],server=await createLauncherLoopbackServer({endpoints:[{address:'127.0.0.1',port:9}],gamePatchOrigins:origins});
  try{origins[0]='http://192.0.2.1:99';const response=await fetch(server.origin+'/runtime.json'),runtime=await response.json();
    assert.deepEqual(runtime.gamePatch,{schema:'moli.local-game-patch.v1',allowedOrigins:['http://127.0.0.1:12345']});assert.match(response.headers.get('content-security-policy'),/http:\/\/127\.0\.0\.1:12345/);assert.equal(server.snapshot().connectionAttempts,0);
  }finally{await server.close();}
  await assert.rejects(createLauncherLoopbackServer({endpoints:[{address:'127.0.0.1',port:9}],gamePatchOrigins:['http://192.0.2.1:99']}));
});

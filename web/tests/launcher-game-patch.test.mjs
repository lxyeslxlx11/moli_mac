import test from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherCatalogPatchPlan,prepareLauncherGamePatch } from '../launcher-game-patch.mjs';
import { computeLauncherFileMd5 } from '../../shared/index.mjs';
import { createGamePatchFixture,patchCatalogs,originalPatchScenario,utf8 } from './helpers/launcher-game-patch-fixture.mjs';
const text = bytes => new TextDecoder().decode(bytes).replace(/\0$/,'');
const rejectCode = (promise,codes) => assert.rejects(promise,error => codes.includes(error.code));
const patchOnly = fixture => fixture.requests.filter(row=>row.url.startsWith('/cg50/'));

test('selected catalog ordinals bind original Code, PatchEXE, PIP/PPort and directory to one plan', () => {
  const common={catalogs:patchCatalogs(12345),gameOrdinal:0,referenceOrdinal:0,directoryText:'C:\\Original Folder\\Client',pathEncoding:'ascii',alreadyPatched:false};
  const a=createLauncherCatalogPatchPlan(common),b=createLauncherCatalogPatchPlan({...common,gameOrdinal:1});
  assert.equal(a.binding.gameCodeText,'0011');assert.equal(b.binding.gameCodeText,'11');assert.notEqual(a.binding.gameOrdinal,b.binding.gameOrdinal);
  assert.equal(text(a.processPlan.packagedSourceRelativeBytes),'0011\\patch.exe');assert.equal(text(b.processPlan.packagedSourceRelativeBytes),'11\\other.exe');
  assert.equal(text(a.processPlan.commandLineBytes),'C:\\Original Folder\\Client\\PATCH.BAK.EXE 127.0.0.1 12345');
  assert.equal(a.patchEndpoint.portText,'12345');assert.equal(a.binding.gameListMd5,common.catalogs.gameListMd5);
  assert.ok(Object.isFrozen(a.binding));assert.equal(a.execution,'not-performed');
});
test('actual loopback GETs stream dependent create then append into a final owned candidate', async () => {
  const fixture=await createGamePatchFixture();try {
    const result=await prepareLauncherGamePatch(fixture.input());
    assert.equal(result.disposition,'game-patch-candidate');assert.deepEqual(result.candidate.files,fixture.scenario.expectedFiles);
    assert.deepEqual(patchOnly(fixture),[{method:'GET',url:'/cg50/Update.TXT?t=1234567890'},{method:'GET',url:'/cg50/Bin/first.bin.bz2?time=1234567890'},{method:'GET',url:'/cg50/Bin/final.bin.bz2?time=1234567890'}]);
    assert.equal(result.requests.length,3);assert.equal(result.replacement,'not-performed');assert.equal(result.authentication,'unverified');assert.equal(result.processPlan.execution,'not-performed');
  } finally {await fixture.close();}
});
test('declared PatchEXE text remains distinct from normalized filesystem metadata', () => {
  const catalogs=patchCatalogs(12345,{patcher:' tools.exe/patch.ExE '}),plan=createLauncherCatalogPatchPlan({catalogs,gameOrdinal:0,referenceOrdinal:0,
    directoryText:'C:\\Original Folder\\Client',pathEncoding:'ascii',alreadyPatched:false});
  assert.equal(plan.binding.patcher,'tools.exe\\patch.ExE');assert.equal(plan.binding.patcherText,' tools.exe/patch.ExE ');
  assert.equal(text(plan.processPlan.backupNameBytes),' TOOLS.BAK.EXE/PATCH.BAK.EXE ');
  assert.equal(text(plan.processPlan.packagedSourceRelativeBytes),'0011\\ tools.exe/patch.ExE ');
});
test('each of the three operations uses original ZIP bytes, exact configured URL and no implicit extra packages', async () => {
  for(const name of ['create-deflate','append-deflate','replaceto-deflate']) {
    const fixture=await createGamePatchFixture(name);try {
      const result=await prepareLauncherGamePatch(fixture.input());assert.deepEqual(result.candidate.files,fixture.scenario.expectedFiles,name);assert.equal(patchOnly(fixture).length,2);
      assert.equal(patchOnly(fixture)[1].url,'/cg50/Bin/new.bin.bz2?time=1234567890');
    } finally {await fixture.close();}
  }
});
test('native completion flag or absent PatchEXE declines requests; current file still checks manifest first', async () => {
  const fixture=await createGamePatchFixture('already-current');try {
    const skipped=await prepareLauncherGamePatch(fixture.input({alreadyPatched:true}));assert.equal(skipped.disposition,'already-patched');assert.equal(skipped.candidate,null);assert.equal(fixture.requests.length,0);
    const absent=await prepareLauncherGamePatch(fixture.input({catalogs:patchCatalogs(fixture.port,{patcher:''})}));assert.equal(absent.disposition,'no-patcher');assert.equal(fixture.requests.length,0);
    const checked=await prepareLauncherGamePatch(fixture.input());assert.equal(checked.candidate.operations[0].disposition,'current');assert.equal(patchOnly(fixture).length,1);
  } finally {await fixture.close();}
});
test('configured patch endpoint needs its own explicit origin permission and never inherits BIP approval', async () => {
  const fixture=await createGamePatchFixture();try {
    await rejectCode(prepareLauncherGamePatch(fixture.input({allowedOrigins:['http://127.0.0.1:9000']})),['HTTP_ORIGIN']);assert.equal(fixture.requests.length,0);
    await rejectCode(prepareLauncherGamePatch(fixture.input({catalogs:patchCatalogs(fixture.port,{endpoint:false})})),['GAME_PATCH_ENDPOINT']);assert.equal(fixture.requests.length,0);
  } finally {await fixture.close();}
});
test('catalog identity corruption is rejected before any request', async () => {
  const fixture=await createGamePatchFixture();try {
    const catalogs=patchCatalogs(fixture.port);catalogs.gameListBytes[0]^=1;
    await rejectCode(prepareLauncherGamePatch(fixture.input({catalogs})),['CATALOG_DIGEST']);assert.equal(fixture.requests.length,0);
  } finally {await fixture.close();}
});
test('files and catalog metadata are snapshotted before the first async provider can mutate caller state', async () => {
  const fixture=await createGamePatchFixture('append-deflate');try {
    const value=fixture.input(),before=structuredClone(value.files),nativeFetch=globalThis.fetch;
    value.fetchImpl=(url,options)=>{value.files[0].bytes.fill(0);value.catalogs.gameListBytes.fill(0);value.directoryText='C:\\Changed';return nativeFetch(url,options);};
    const result=await prepareLauncherGamePatch(value);assert.deepEqual(result.candidate.files,fixture.scenario.expectedFiles);assert.equal(result.binding.directoryText,'C:\\Original Folder\\Client');
    assert.notDeepEqual(value.files,before);assert.equal(result.binding.gameCodeText,'0011');
  } finally {await fixture.close();}
});
test('cancellation before requests or during a body returns no candidate or local-file mutation', async () => {
  const fixture=await createGamePatchFixture('append-deflate');try {
    const early=new AbortController();early.abort();await rejectCode(prepareLauncherGamePatch(fixture.input({signal:early.signal})),['GAME_PATCH_ABORTED']);assert.equal(fixture.requests.length,0);
    fixture.set('/cg50/Bin/new.bin.bz2',{bodyDelayMs:200});const controller=new AbortController(),value=fixture.input({signal:controller.signal}),before=structuredClone(value.files);
    const fetchNative=globalThis.fetch;let receivedPrefixBytes=0;
    value.fetchImpl=async(url,options)=>{
      const response=await fetchNative(url,options);if(!url.includes('.bz2?'))return response;
      const body=response.body.pipeThrough(new TransformStream({transform(chunk,output){receivedPrefixBytes+=chunk.length;output.enqueue(chunk);setTimeout(()=>controller.abort(),10);}}));
      return new Response(body,{status:response.status,headers:response.headers});
    };
    await rejectCode(prepareLauncherGamePatch(value),['GAME_PATCH_ABORTED','HTTP_ABORTED']);assert.deepEqual(value.files,before);
    assert.ok(receivedPrefixBytes>0 && receivedPrefixBytes<fixture.scenario.archives[0].bytes.length);
  } finally {await fixture.close();}
});
test('the total preparation deadline is carried across requests rather than reset per package', async () => {
  const fixture=await createGamePatchFixture('create-deflate');try {
    const value=fixture.input({timeoutMs:240});let call=0,startSecond,stoppedSecond;
    value.fetchImpl=async(url,options)=>{
      if(++call===1){await new Promise(resolve=>setTimeout(resolve,130));return new Response(fixture.scenario.manifestBytes,{status:200});}
      startSecond=performance.now();return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>{stoppedSecond=performance.now();reject(new Error('original provider cancelled'));},{once:true}));
    };
    await rejectCode(prepareLauncherGamePatch(value),['HTTP_TIMEOUT','GAME_PATCH_TIMEOUT']);assert.equal(call,2);assert.ok(stoppedSecond-startSecond<190);
  } finally {await fixture.close();}
});
test('HTTP failure, bad manifest and package corruption never return partial candidates', async () => {
  const fixture=await createGamePatchFixture();try {
    fixture.set('/cg50/Update.TXT',{status:503});await rejectCode(prepareLauncherGamePatch(fixture.input()),['HTTP_STATUS']);
    fixture.reset();fixture.set('/cg50/Update.TXT',{body:utf8('create\0\nname:x}')});await rejectCode(prepareLauncherGamePatch(fixture.input()),['PATCH_NUL']);assert.equal(patchOnly(fixture).length,1);
    fixture.reset();const bad=new Uint8Array(fixture.scenario.archives[1].bytes);bad[0]^=1;fixture.set('/cg50/Bin/final.bin.bz2',{body:bad});
    const value=fixture.input(),before=structuredClone(value.files);await rejectCode(prepareLauncherGamePatch(value),['ZIP_LOCAL_MISMATCH']);assert.deepEqual(value.files,before);assert.equal(patchOnly(fixture).length,3);
  } finally {await fixture.close();}
});
test('ambiguous URL syntax is rejected without requesting that package', async () => {
  const fixture=await createGamePatchFixture('create-deflate');try {
    const text=new TextDecoder().decode(fixture.scenario.manifestBytes).replace('name:new.bin','name:new%2ebin');fixture.set('/cg50/Update.TXT',{body:utf8(text)});
    await rejectCode(prepareLauncherGamePatch(fixture.input()),['GAME_PATCH_URL_PROFILE']);assert.equal(patchOnly(fixture).length,1);
  } finally {await fixture.close();}
});
test('invalid signal/time policies and accessors fail before a provider runs', async () => {
  const fixture=await createGamePatchFixture();try {
    for(const change of [{signal:{}},{epochSeconds:-1},{epochSeconds:0x80000000},{timeoutMs:0},{timeoutMs:60001}]) await rejectCode(prepareLauncherGamePatch(fixture.input(change)),['GAME_PATCH_INPUT']);
    const input=fixture.input();Object.defineProperty(input,'files',{get(){throw Error('must not invoke');}});await rejectCode(prepareLauncherGamePatch(input),['GAME_PATCH_INPUT']);assert.equal(fixture.requests.length,0);
  } finally {await fixture.close();}
});

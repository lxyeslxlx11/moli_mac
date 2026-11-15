import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWeChatLauncherResourceStore as createStore,WECHAT_RESOURCE_STORE as format } from '../../adapters/wechat/launcher-resource-store.mjs';
import { createWeChatLauncherCatalogStore } from '../../adapters/wechat/launcher-catalog-store.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { encodeLauncherResourceCacheRecord as encode } from '../../shared/launcher-resource-cache.mjs';
import { createLauncherResourceSnapshot } from '../../shared/launcher-resources.mjs';
import { weChatCacheFixture } from './helpers/wechat-cache-fixture.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-resource-cache-v1/original-vectors.json',import.meta.url)));
const resources=(row=vectors.cases[1])=>createLauncherResourceSnapshot({binding:row.binding,files:row.files.map(file=>({path:file.path,bytes:Uint8Array.from(Buffer.from(file.hex,'hex'))}))});
const name=(slot,profile='original')=>format.directory+'/'+profile+'.'+slot+'.bin';
const code=(pending,expected)=>assert.rejects(pending,error=>error.code===expected);
async function until(check){for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,1));}assert.fail('Owned operation did not reach expected fixture callback.');}

test('resource store explicitly checks/commits CAS and actual original files survive independent store construction',async()=>{
  const fixture=await weChatCacheFixture({real:true});try{await fixture.put('unrelated-original.txt',Uint8Array.of(7,8));
    const store=createStore({wx:fixture.wx,profile:'original'});assert.equal(fixture.stats.calls.length,0);assert.equal((await store.read()).revision,0);
    assert.equal((await store.commitResources(resources(),{expectedRevision:0})).revision,1);
    assert.equal((await store.commitResources(resources(vectors.cases[4]),{expectedRevision:1})).revision,2);
    const fresh=createStore({wx:fixture.wx,profile:'original'}),read=await fresh.read();assert.equal(read.resources.schema,'moli.launcher.resources.v2');assert.equal(read.resources.binding.patchSourceOrdinal,1);
    read.resources.files[0].bytes.fill(0);assert.notEqual(Buffer.from((await fresh.read()).resources.files[0].bytes).toString('hex'),'00'.repeat(8));
    await code(fresh.commitResources(resources(),{expectedRevision:1}),'RESOURCE_CACHE_CONFLICT');
    assert.deepEqual([...await fixture.raw('unrelated-original.txt')],[7,8]);assert.equal(fixture.stats.writes.length,2);
  }finally{await fixture.close();}
});
test('partial failed native write reports unknown outcome and keeps a prior complete resource slot recoverable',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});await store.commitResources(resources(),{expectedRevision:0});fixture.controls.holdWrite=true;
  const pending=store.commitResources(resources(vectors.cases[4]),{expectedRevision:1});await until(()=>fixture.stats.pendingWrites.length===2);await fixture.finishWrite(1,{partial:60,fail:true});
  await code(pending,'RESOURCE_CACHE_COMMIT_UNKNOWN');const read=await store.read();assert.equal(read.revision,1);assert.equal(read.recovered,true);assert.equal(read.corruptSlots,1);
  fixture.controls.holdWrite=false;assert.equal((await store.commitResources(resources(),{expectedRevision:1})).revision,2);
});
test('missing/invalid records, access errors and equal-revision resource conflicts do not trigger automatic overwrites',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});fixture.controls.failReaddir=true;
  await code(store.read(),'RESOURCE_CACHE_STORAGE');assert.equal(fixture.stats.writes.length,0);fixture.controls.failReaddir=false;
  await fixture.put(name('a'),Uint8Array.of(1,2));await code(store.read(),'RESOURCE_CACHE_CORRUPT');await code(store.commitResources(resources(),{expectedRevision:0}),'RESOURCE_CACHE_CORRUPT');
  await fixture.put(name('a'),encode({revision:1,resources:resources()}));await fixture.put(name('b'),encode({revision:1,resources:resources(vectors.cases[4])}));
  await code(store.read(),'RESOURCE_CACHE_CONFLICT');assert.equal(fixture.stats.writes.length,0);
});
test('resource write cancellation retains bytes/context exclusion until native callback and does not block separate catalog namespace',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'}),control=createWeChatAbortController();fixture.controls.holdWrite=true;
  const pending=store.commitResources(resources(),{expectedRevision:0,signal:control.signal});await until(()=>fixture.stats.pendingWrites.length===1);
  const payload=fixture.stats.pendingWrites[0].options.data;control.abort();await code(pending,'RESOURCE_CACHE_COMMIT_UNKNOWN');assert.ok(new Uint8Array(payload).some(byte=>byte!==0));
  await code(createStore({wx:fixture.wx,profile:'original'}).read(),'RESOURCE_CACHE_BUSY');
  assert.equal((await createWeChatLauncherCatalogStore({wx:fixture.wx,profile:'original'}).read()).revision,0);
  await fixture.finishWrite(0);assert.ok(new Uint8Array(payload).every(byte=>byte===0));assert.equal((await store.read()).revision,1);
});
test('resource deadline at late write is unknown; native late read buffers are cleared and cannot trigger a write',async()=>{
  const fixture=await weChatCacheFixture();let fire,wall=100;const clock=createWeChatDeadlineClock({wallNow:()=>wall,setTimer(fn){fire=fn;return fn;},clearTimer(){}});
  const store=createStore({wx:fixture.wx,profile:'original',clock});fixture.controls.holdWrite=true;
  const pending=store.commitResources(resources(),{expectedRevision:0,timeoutMs:10});await until(()=>fixture.stats.pendingWrites.length===1);wall=0;fire();
  await code(pending,'RESOURCE_CACHE_COMMIT_UNKNOWN');await fixture.finishWrite(0);assert.equal((await store.read()).revision,1);
  let held;const native=fixture.fs.readFile;fixture.fs.readFile=options=>{held=options;};const control=createWeChatAbortController(),reading=store.read({signal:control.signal});await until(()=>!!held);
  control.abort();await code(reading,'RESOURCE_CACHE_ABORTED');const delivered=Uint8Array.from([5,6,7]).buffer;held.success({data:delivered});await Promise.resolve();
  assert.deepEqual([...new Uint8Array(delivered)],[0,0,0]);fixture.fs.readFile=native;assert.equal(fixture.stats.writes.length,1);assert.equal((await store.read()).revision,1);
});
test('store snapshots revision/candidate before await and rejects foreign options/getters before IO',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});let reads=0;
  await code(store.read({password:'forbidden'}),'RESOURCE_CACHE_INPUT');await code(store.commitResources(resources(),{get expectedRevision(){reads++;return 0;}}),'RESOURCE_CACHE_INPUT');assert.equal(reads,0);assert.equal(fixture.stats.calls.length,0);
  const input=resources(),expected=Buffer.from(input.files[0].bytes).toString('hex'),options={expectedRevision:0},pending=store.commitResources(input,options);options.expectedRevision=8;input.files[0].bytes.fill(0);await pending;
  assert.equal(Buffer.from((await store.read()).resources.files[0].bytes).toString('hex'),expected);
  await code(store.commitResources(resources(),{expectedRevision:0}),'RESOURCE_CACHE_CONFLICT');assert.equal(fixture.stats.writes.length,1);
});
test('read callback crossing the deadline before its timer fires clears the delivered owned buffer',async()=>{
  const fixture=await weChatCacheFixture(),ordinary=createStore({wx:fixture.wx,profile:'original'});await ordinary.commitResources(resources(),{expectedRevision:0});
  let wall=1000,delivered;const clock=createWeChatDeadlineClock({wallNow:()=>wall,setTimer:fn=>fn,clearTimer(){}}),store=createStore({wx:fixture.wx,profile:'original',clock});
  const native=fixture.fs.readFile;fixture.fs.readFile=options=>native({...options,success(result){delivered=result.data;wall=1010;options.success(result);}});
  await code(store.read({timeoutMs:10}),'RESOURCE_CACHE_TIMEOUT');assert.ok(delivered);assert.ok(new Uint8Array(delivered).every(byte=>byte===0));
  fixture.fs.readFile=native;assert.equal((await ordinary.read()).revision,1);assert.equal(fixture.stats.writes.length,1);
});

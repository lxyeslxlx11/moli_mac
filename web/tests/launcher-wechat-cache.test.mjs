import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createWeChatLauncherCatalogStore as createStore,WECHAT_CATALOG_STORE as format } from '../../adapters/wechat/launcher-catalog-store.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { encodeLauncherCatalogCacheRecord as encode,decodeLauncherCatalogCacheRecord as decode,snapshotPortableLauncherCatalogs } from '../../shared/launcher-catalog-cache.mjs';
import { weChatCacheFixture } from './helpers/wechat-cache-fixture.mjs';
const vector=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-cache-v1/original-vectors.json',import.meta.url))).cases[0];
const catalogs=()=>decode(Uint8Array.from(Buffer.from(vector.recordHex,'hex'))).catalogs;
const name=(slot,profile='original')=>format.directory+'/'+profile+'.'+slot+'.bin';
const code=(task,expected)=>assert.rejects(task,error=>error.code===expected);
async function until(check){for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,1));}assert.fail('Original fixture did not reach expected owned write.');}

test('WeChat catalog cache supports explicit empty/read/commit CAS and independent instance byte ownership',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});
  assert.equal(fixture.stats.calls.length,0);const empty=await store.read();assert.equal(empty.revision,0);assert.equal(empty.catalogs,null);assert.equal(fixture.stats.writes.length,0);
  const input=catalogs(),receipt=await store.commitPair(input,{expectedRevision:0});assert.equal(receipt.revision,1);assert.equal(receipt.committed,true);assert.equal(receipt.durability,'unverified');input.gameListBytes.fill(0);
  const second=createStore({wx:fixture.wx,profile:'original'}),saved=await second.read();assert.equal(saved.revision,1);assert.equal(saved.catalogs.games.games[0].name,'原创目录');saved.catalogs.gameListBytes.fill(0);
  assert.equal((await second.read()).catalogs.games.games[0].name,'原创目录');
  await code(store.commitPair(catalogs(),{expectedRevision:0}),'CACHE_CONFLICT');assert.equal(fixture.stats.writes.length,1);
});

test('actual original filesystem persists complete records across store construction and preserves unrelated files',async()=>{
  const fixture=await weChatCacheFixture({real:true});
  try{await fixture.put('unrelated-original.txt',Uint8Array.of(11,22,33));const store=createStore({wx:fixture.wx,profile:'original'});
    await store.commitPair(catalogs(),{expectedRevision:0});await store.commitPair(catalogs(),{expectedRevision:1});
    const fresh=createStore({wx:fixture.wx,profile:'original'}),read=await fresh.read();assert.equal(read.revision,2);assert.equal(read.recovered,false);
    assert.equal(decode(await fixture.raw(name('a'))).revision,1);assert.equal(decode(await fixture.raw(name('b'))).revision,2);
    assert.deepEqual([...await fixture.raw('unrelated-original.txt')],[11,22,33]);assert.ok(fixture.stats.reads.every(row=>row.position===0&&row.length<=2097196));
  }finally{await fixture.close();}
});

test('partial failed write leaves the prior complete slot readable and reports an uncertain commit',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});
  await store.commitPair(catalogs(),{expectedRevision:0});fixture.controls.holdWrite=true;
  const pending=store.commitPair(catalogs(),{expectedRevision:1});await until(()=>fixture.stats.pendingWrites.length===2);
  await fixture.finishWrite(1,{partial:20,fail:true});await code(pending,'CACHE_COMMIT_UNKNOWN');
  const read=await store.read();assert.equal(read.revision,1);assert.equal(read.recovered,true);assert.equal(read.corruptSlots,1);
  fixture.controls.holdWrite=false;assert.equal((await store.commitPair(catalogs(),{expectedRevision:1})).revision,2);assert.equal((await store.read()).recovered,false);
});

test('cache does not invent absence from read errors, overwrite wholly corrupt slots, or resolve same revision conflicts',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});fixture.controls.failReaddir=true;
  await code(store.read(),'CACHE_STORAGE');await code(store.commitPair(catalogs(),{expectedRevision:0}),'CACHE_STORAGE');assert.equal(fixture.stats.writes.length,0);fixture.controls.failReaddir=false;
  await fixture.put(name('a'),Uint8Array.of(1,2));await code(store.read(),'CACHE_CORRUPT');await code(store.commitPair(catalogs(),{expectedRevision:0}),'CACHE_CORRUPT');assert.equal(fixture.stats.writes.length,0);
  await fixture.put(name('a'),encode({revision:1,catalogs:catalogs()}));const changed=catalogs();
  const gameListBytes=Buffer.from(Buffer.from(changed.gameListBytes).toString().replace('原创目录','不同目录'));
  const different=snapshotPortableLauncherCatalogs({...changed,gameListBytes,gameListMd5:createHash('md5').update(gameListBytes).digest('hex')});
  await fixture.put(name('b'),encode({revision:1,catalogs:different}));await code(store.read(),'CACHE_CONFLICT');
  await code(store.commitPair(catalogs(),{expectedRevision:1}),'CACHE_CONFLICT');assert.equal(fixture.stats.writes.length,0);
});

test('same-context profile exclusion lasts until an uncertain native write callback, preserving the owned payload',async()=>{
  const fixture=await weChatCacheFixture();fixture.controls.holdWrite=true;const store=createStore({wx:fixture.wx,profile:'original'}),other=createStore({wx:fixture.wx,profile:'original'}),control=createWeChatAbortController();
  const pending=store.commitPair(catalogs(),{expectedRevision:0,signal:control.signal});await until(()=>fixture.stats.pendingWrites.length===1);
  const native=fixture.stats.pendingWrites[0].options;assert.equal(new Uint8Array(native.data)[0],77);control.abort();await code(pending,'CACHE_COMMIT_UNKNOWN');
  await code(other.read(),'CACHE_BUSY');assert.equal(new Uint8Array(native.data)[0],77);
  await fixture.finishWrite(0);assert.ok(new Uint8Array(native.data).every(byte=>byte===0));assert.equal((await other.read()).revision,1);
});

test('late write timeout is uncertain while early abort/candidate/input validation prevents writes',async()=>{
  const fixture=await weChatCacheFixture(),control=createWeChatAbortController();control.abort();const store=createStore({wx:fixture.wx,profile:'original'});
  await code(store.read({signal:control.signal}),'CACHE_ABORTED');assert.equal(fixture.stats.calls.length,0);
  await code(store.commitPair(undefined,{expectedRevision:0}),'CACHE_CANDIDATE');assert.equal(fixture.stats.writes.length,0);
  assert.throws(()=>createStore({wx:fixture.wx,profile:'../wrong'}));await code(store.commitPair(catalogs(),{expectedRevision:-1}),'CACHE_INPUT');
  let fire,wall=1000;const clock=createWeChatDeadlineClock({wallNow:()=>wall,setTimer(fn){fire=fn;return fn;},clearTimer(){}});fixture.controls.holdWrite=true;
  const timed=createStore({wx:fixture.wx,profile:'timed',clock}),pending=timed.commitPair(catalogs(),{expectedRevision:0,timeoutMs:10});
  await until(()=>fixture.stats.pendingWrites.length===1);wall=0;fire();await code(pending,'CACHE_COMMIT_UNKNOWN');assert.equal(clock.now(),10);await fixture.finishWrite(0);
  assert.equal((await timed.read()).revision,1);
});

test('canonical identical duplicate slots are readable while over-budget files are rejected without reading payload',async()=>{
  const fixture=await weChatCacheFixture(),record=encode({revision:1,catalogs:catalogs()}),store=createStore({wx:fixture.wx,profile:'original'});
  await fixture.put(name('a'),record);await fixture.put(name('b'),record);assert.equal((await store.read()).revision,1);
  await fixture.put(name('b'),new Uint8Array(2097197));const before=fixture.stats.reads.length,read=await store.read();
  assert.equal(read.recovered,true);assert.equal(fixture.stats.reads.length,before+1);assert.equal(read.revision,1);
});

test('cancelled pending read releases context exclusion and late directory success cannot cause a write',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});await store.commitPair(catalogs(),{expectedRevision:0});
  const native=fixture.fs.readdir;let directory;fixture.fs.readdir=options=>{directory=options;};const control=createWeChatAbortController();
  const pending=store.read({signal:control.signal});assert.ok(directory);control.abort();await code(pending,'CACHE_ABORTED');
  fixture.fs.readdir=native;assert.equal((await store.read()).revision,1);directory.success({files:[]});await Promise.resolve();assert.equal(fixture.stats.writes.length,1);
});

test('cache snapshots expectedRevision before any asynchronous directory read',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});await store.commitPair(catalogs(),{expectedRevision:0});
  const options={expectedRevision:0},pending=store.commitPair(catalogs(),options);options.expectedRevision=1;
  await code(pending,'CACHE_CONFLICT');assert.equal(fixture.stats.writes.length,1);
});

test('cache options require known own data and reject accessors/secret fields before filesystem IO',async()=>{
  const fixture=await weChatCacheFixture(),store=createStore({wx:fixture.wx,profile:'original'});let reads=0;
  await code(store.commitPair(catalogs(),{get expectedRevision(){reads++;return 0;}}),'CACHE_INPUT');assert.equal(reads,0);
  await code(store.commitPair(catalogs(),Object.create({expectedRevision:0})),'CACHE_INPUT');
  await code(store.read({password:'original-forbidden-option'}),'CACHE_INPUT');assert.equal(fixture.stats.calls.length,0);
});

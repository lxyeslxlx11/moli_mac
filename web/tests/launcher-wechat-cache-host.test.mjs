import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWeChatLauncherHost,snapshotWeChatLauncherHostConfig } from '../../adapters/wechat/launcher-host.mjs';
import { createWeChatLauncherCatalogStore } from '../../adapters/wechat/launcher-catalog-store.mjs';
import { decodeLauncherCatalogCacheRecord } from '../../shared/launcher-catalog-cache.mjs';
import { createWeChatHttpFixture,weChatBootstrapConfig,WECHAT_LOCAL_LAUNCHER } from './helpers/wechat-http-fixture.mjs';
import { weChatCacheFixture } from './helpers/wechat-cache-fixture.mjs';
import { weChatHostConfig } from './helpers/wechat-host-fixture.mjs';
import { fakeWeChat,originalWeChatPeer } from './helpers/wechat-tcp-fixture.mjs';
const config=(extra={})=>weChatHostConfig({gameListXml:null,regionListXml:null,bootstrap:weChatBootstrapConfig(),catalogCacheProfile:'original',...extra});
async function setup(){const http=await createWeChatHttpFixture(),cache=await weChatCacheFixture();
  const path=await cache.put('original-selected.exe',WECHAT_LOCAL_LAUNCHER);let picks=0;
  return{http,cache,wx:{...http.wx,...cache.wx,chooseMessageFile(options){picks++;queueMicrotask(()=>options.success({tempFiles:[{path,size:WECHAT_LOCAL_LAUNCHER.length}]}));}},picks:()=>picks};}
async function until(check){for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,1));}assert.fail('Original host did not reach write.');}

test('cache profile is explicit/bounded, defaults off, and never performs startup filesystem IO',async()=>{
  const fixture=await setup();try{
    for(const catalogCacheProfile of ['../escape','',undefined,1,'a'.repeat(33)])assert.throws(()=>snapshotWeChatLauncherHostConfig(config({catalogCacheProfile})));
    const host=createWeChatLauncherHost({wx:fixture.wx,config:config()});assert.equal(host.snapshot().cacheEnabled,true);assert.equal(host.snapshot().cacheRevision,null);assert.equal(fixture.cache.stats.calls.length,0);
    const off=createWeChatLauncherHost({wx:fixture.wx,config:weChatHostConfig()});assert.equal(off.snapshot().cacheEnabled,false);await off.checkCatalogCache();assert.equal(fixture.cache.stats.calls.length,0);
  }finally{await fixture.http.close();}
});

test('actual host requires checked revision/raw bytes before saving and never silently restores its cache',async()=>{
  const fixture=await setup(),views=[],host=createWeChatLauncherHost({wx:fixture.wx,config:config(),render:value=>views.push(value)});
  try{
    assert.equal(host.snapshot().canSaveCatalogCache,false);await host.loadCatalogs();assert.equal(host.snapshot().canSaveCatalogCache,false);
    host.chooseGame(0);host.chooseRegion(0);host.inputUsername('SyntheticU1');host.inputPassword('SyntheticP1');
    host.beginReview();for(let i=0;i<3;i++)host.nextPage();host.decide(true);assert.equal(host.snapshot().accepted,true);
    await host.checkCatalogCache();assert.equal(host.snapshot().cacheRevision,0);assert.equal(host.snapshot().canSaveCatalogCache,true);assert.equal(host.snapshot().accepted,false);assert.doesNotMatch(host.snapshot().status,/已确认/);
    await host.saveCatalogCache();assert.equal(host.snapshot().cacheRevision,1);assert.equal(fixture.cache.stats.writes.length,1);
    const fresh=createWeChatLauncherHost({wx:fixture.wx,config:config()});assert.equal(fresh.snapshot().catalogsReady,false);
    await fresh.checkCatalogCache();assert.equal(fresh.snapshot().catalogsReady,false);assert.equal(fresh.snapshot().canRestoreCatalogCache,true);
    assert.equal(fresh.restoreCatalogCache(),true);assert.equal(fresh.snapshot().catalogsReady,true);assert.equal(fresh.snapshot().canLogin,false);assert.equal(fresh.snapshot().gameOrdinal,-1);
    assert.doesNotMatch(JSON.stringify(views),/SyntheticU1|SyntheticP1|original-selected|gameListBytes|regionListBytes/);
    host.hide();fresh.hide();
  }finally{await fixture.http.close();}
});

test('loaded/restored raw catalog pair feeds the real next HTTP comparison and failed refresh cannot be saved',async()=>{
  const fixture=await setup(),host=createWeChatLauncherHost({wx:fixture.wx,config:config()});
  try{await host.loadCatalogs();assert.equal(host.snapshot().catalogComparison.gameList,'unavailable');
    await host.checkCatalogCache();await host.saveCatalogCache();const fresh=createWeChatLauncherHost({wx:fixture.wx,config:config()});await fresh.checkCatalogCache();fresh.restoreCatalogCache();
    await fresh.loadCatalogs();assert.equal(fresh.snapshot().catalogComparison.gameList,'identical');assert.equal(fresh.snapshot().catalogComparison.regionList,'identical');
    const changed=weChatHostConfig().gameListXml.replace('原创联调','改名目录');fixture.http.routes.set('/gameList',{body:Buffer.from(changed)});
    await fresh.loadCatalogs();assert.equal(fresh.snapshot().catalogComparison.gameList,'different');assert.equal(fresh.snapshot().catalogComparison.regionList,'identical');
    fixture.http.routes.set('/regionList',{body:Buffer.from('<invalid>')});await fresh.loadCatalogs();assert.equal(fresh.snapshot().catalogsReady,false);assert.equal(fresh.snapshot().canSaveCatalogCache,false);assert.equal(fresh.snapshot().catalogComparison,null);
    host.hide();fresh.hide();
  }finally{await fixture.http.close();}
});

test('restored cache completes the original current exchange with unchanged explicit review/endpoint gates',async()=>{
  const fixture=await setup(),first=createWeChatLauncherHost({wx:fixture.wx,config:config()}),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});let fresh;
  try{await first.loadCatalogs();await first.checkCatalogCache();await first.saveCatalogCache();first.hide();
    fresh=createWeChatLauncherHost({wx:{...fixture.wx,...tcp.wx},config:config()});await fresh.checkCatalogCache();assert.equal(fresh.restoreCatalogCache(),true);
    fresh.chooseGame(0);fresh.chooseRegion(0);fresh.inputUsername('SyntheticU1');fresh.inputPassword('SyntheticP1');fresh.beginReview();for(let i=0;i<3;i++)fresh.nextPage();fresh.decide(true);
    const result=await fresh.login(),oracle=await peer.done;assert.equal(oracle.request_verified,true);assert.ok(result.rows.length);assert.equal(result.authentication,'unverified');
    assert.equal(fixture.picks(),1);assert.equal(fixture.http.stats.calls.length,4);
  }finally{first.hide();fresh?.hide();await peer.close();await fixture.http.close();}
});

test('host refuses cache encoding/compatibility mismatch without restoring or changing its static configuration',async()=>{
  const fixture=await setup(),vector=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-cache-v1/original-vectors.json',import.meta.url))).cases[1];
  const store=createWeChatLauncherCatalogStore({wx:fixture.wx,profile:'original'});await store.commitPair(decodeLauncherCatalogCacheRecord(Uint8Array.from(Buffer.from(vector.recordHex,'hex'))).catalogs,{expectedRevision:0});
  const host=createWeChatLauncherHost({wx:fixture.wx,config:config()});try{await host.checkCatalogCache();assert.equal(host.snapshot().cacheRevision,1);assert.match(host.snapshot().cacheStatus,/设置不符/);assert.equal(host.restoreCatalogCache(),false);assert.equal(host.snapshot().catalogsReady,false);}
  finally{host.hide();await fixture.http.close();}
});

test('hide during save reports need to recheck, retains native write lifetime and prevents late view resurrection',async()=>{
  const fixture=await setup(),host=createWeChatLauncherHost({wx:fixture.wx,config:config()});
  try{await host.loadCatalogs();await host.checkCatalogCache();fixture.cache.controls.holdWrite=true;const pending=host.saveCatalogCache();await until(()=>fixture.cache.stats.pendingWrites.length===1);
    host.hide();const expected=host.snapshot();await pending;assert.deepEqual(host.snapshot(),expected);assert.match(expected.cacheStatus,/重新检查/);
    await fixture.cache.finishWrite(0);assert.deepEqual(host.snapshot(),expected);await host.checkCatalogCache();assert.equal(host.snapshot().cacheRevision,1);assert.equal(host.snapshot().canRestoreCatalogCache,true);
  }finally{host.hide();await fixture.http.close();}
});

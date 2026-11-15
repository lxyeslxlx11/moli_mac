import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeChatLauncherHost,snapshotWeChatLauncherHostConfig } from '../../adapters/wechat/launcher-host.mjs';
import { createWeChatLauncherResourceStore,WECHAT_RESOURCE_STORE } from '../../adapters/wechat/launcher-resource-store.mjs';
import { createLauncherResourceSnapshot } from '../../shared/launcher-resources.mjs';
import { weChatResourceHostFixture } from './helpers/wechat-resource-host-fixture.mjs';
import { fakeWeChat,originalWeChatPeer } from './helpers/wechat-tcp-fixture.mjs';
const profile='original-resources',catalogProfile='original-catalogs';
const select=host=>{host.chooseGame(0);host.chooseRegion(0);assert.equal(host.choosePatchSource(0),true);};
const config=fixture=>fixture.config({resourceCacheProfile:profile,catalogCacheProfile:catalogProfile});
async function prepared(fixture){const host=createWeChatLauncherHost({wx:fixture.wx,config:config(fixture)});await host.loadCatalogs();select(host);await host.importResourceBase();await host.prepareResources();assert.equal(host.selectResources(),true);return host;}
async function until(check){for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,1));}assert.fail('Owned fixture callback missing.');}

test('resource cache configuration is explicit, requires patch settings, and never starts IO automatically',async()=>{
  const fixture=await weChatResourceHostFixture();try{const host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config()});assert.equal(host.snapshot().resourceCacheEnabled,false);
    const enabled=createWeChatLauncherHost({wx:fixture.wx,config:config(fixture)});assert.equal(enabled.snapshot().resourceCacheEnabled,true);assert.equal(enabled.snapshot().canCheckResourceCache,false);
    assert.equal(fixture.files.stats.calls.length,0);assert.equal(fixture.patch.native.stats.requests.length,0);
    for(const value of ['',undefined,'../escape','x'.repeat(33),3])assert.throws(()=>snapshotWeChatLauncherHostConfig(fixture.config({resourceCacheProfile:value})));
    assert.throws(()=>snapshotWeChatLauncherHostConfig(fixture.config({resourceCacheProfile:profile,patch:null})));host.hide();enabled.hide();
  }finally{await fixture.close();}
});
test('host saves only explicitly selected resources after a checked revision and keeps inputs out of file/view data',async()=>{
  const fixture=await weChatResourceHostFixture(),frames=[];let host;
  try{host=createWeChatLauncherHost({wx:fixture.wx,config:config(fixture),render:frame=>frames.push(frame)});await host.loadCatalogs();select(host);
    await host.checkResourceCache();assert.equal(host.snapshot().resourceCacheRevision,0);assert.equal(host.snapshot().canSaveResourceCache,false);
    await host.importResourceBase();await host.prepareResources();assert.equal(host.snapshot().canSaveResourceCache,false);host.selectResources();assert.equal(host.snapshot().canSaveResourceCache,true);
    host.inputUsername('SyntheticU1');host.inputPassword('SyntheticP1');await host.saveResourceCache();assert.equal(host.snapshot().resourceCacheRevision,1);assert.equal(host.snapshot().resourcesSelected,true);assert.equal(host.snapshot().canReview,false);
    const raw=await fixture.files.raw(WECHAT_RESOURCE_STORE.directory+'/'+profile+'.a.bin');assert.doesNotMatch(Buffer.from(raw).toString(),/SyntheticU1|SyntheticP1/);
    assert.doesNotMatch(JSON.stringify(frames),/SyntheticU1|SyntheticP1|original-resource\.zip|wxfile:\/\//);assert.equal(fixture.files.stats.writes.length,1);
  }finally{host?.hide();await fixture.close();}
});
test('actual original files restore catalogs/resources into a new host without HTTP/picker then complete original current exchange',async()=>{
  const fixture=await weChatResourceHostFixture({real:true,stableSource:true}),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});let first,second;
  try{first=await prepared(fixture);await first.checkCatalogCache();await first.saveCatalogCache();await first.checkResourceCache();await first.saveResourceCache();
    const expected=first.copySelectedResources();first.hide();const metadataCalls=fixture.metadata.requests.length,patchCalls=fixture.patch.native.stats.requests.length;
    let picks=0;const wx={...fixture.wx,...tcp.wx,chooseMessageFile(){picks++;throw Error('No picker on cache restore.');}};
    second=createWeChatLauncherHost({wx,config:config(fixture)});assert.equal(second.snapshot().resourcesSelected,false);
    await second.checkCatalogCache();assert.equal(second.restoreCatalogCache(),true);select(second);await second.checkResourceCache();
    assert.equal(second.snapshot().canRestoreResourceCache,true);assert.equal(second.restoreResourceCache(),true);assert.equal(second.snapshot().resourcesSelected,false);
    assert.equal(second.snapshot().patchFromCache,true);assert.equal(second.snapshot().baseFileCount,2);assert.equal(second.selectResources(),true);assert.deepEqual(second.copySelectedResources(),expected);
    assert.equal(fixture.metadata.requests.length,metadataCalls);assert.equal(fixture.patch.native.stats.requests.length,patchCalls);assert.equal(picks,0);
    second.inputUsername('SyntheticU1');second.inputPassword('SyntheticP1');second.beginReview();for(let i=0;i<3;i++)second.nextPage();second.decide(true);
    await second.login();assert.equal((await peer.done).request_verified,true);assert.equal(second.snapshot().resourcesSelected,true);
    // Next manifest checks the installed result. Replaying the original rename migration is not idempotent.
    const nextManifest=expected.files.map(file=>{const at=file.path.lastIndexOf('/');return `create\n{\npath:${file.path.slice(0,at)}\nname:${file.path.slice(at+1)}\nmd5:${file.md5}\n}`;}).join('');
    fixture.patch.upstream.set('/cg50/Update.TXT',{body:Buffer.from(nextManifest)});
    // A restored candidate aliases its base under one owner; preparing again must not zero that base.
    await second.prepareResources();assert.equal(second.snapshot().patchState,'ready');second.selectResources();assert.deepEqual(second.copySelectedResources(),expected);
    assert.equal(fixture.patch.native.stats.requests.length,patchCalls+1);
  }finally{first?.hide();second?.hide();await peer.close();await fixture.close();}
});
test('mismatched source/schema or changed game binding is never restored and memory reset does not delete saved files',async()=>{
  const fixture=await weChatResourceHostFixture();let host;
  try{host=await prepared(fixture);const resources=host.copySelectedResources(),different=createLauncherResourceSnapshot({binding:{...resources.binding,patchSourceProfile:'puk3-195f3afd',patchSourceOrdinal:1},files:resources.files});
    const store=createWeChatLauncherResourceStore({wx:fixture.wx,profile});await store.commitResources(different,{expectedRevision:0});
    await host.checkResourceCache();assert.equal(host.snapshot().resourceCacheRevision,1);assert.equal(host.snapshot().canRestoreResourceCache,false);assert.match(host.snapshot().resourceCacheStatus,/不符/);
    host.chooseGame(1);host.chooseRegion(0);host.choosePatchSource(0);assert.equal(host.snapshot().resourceCacheRevision,null);await host.checkResourceCache();assert.equal(host.snapshot().canRestoreResourceCache,false);
    host.clearResources();assert.equal(host.snapshot().resourceCacheRevision,null);assert.equal((await store.read()).revision,1);assert.equal(fixture.files.stats.writes.length,1);
  }finally{host?.hide();await fixture.close();}
});
test('hide during resource save reports unknown outcome and late native completion cannot resurrect selection or revision',async()=>{
  const fixture=await weChatResourceHostFixture();let host;
  try{host=await prepared(fixture);await host.checkResourceCache();fixture.files.controls.holdWrite=true;
    const pending=host.saveResourceCache();await until(()=>fixture.files.stats.pendingWrites.length===1);host.hide();const view=host.snapshot();await pending;
    assert.match(view.resourceCacheStatus,/重新检查/);assert.equal(view.resourceCacheRevision,null);assert.equal(view.resourcesSelected,false);
    await fixture.files.finishWrite(0);await Promise.resolve();assert.deepEqual(host.snapshot(),view);
    assert.equal(host.choosePatchSource(0),true);await host.checkResourceCache();assert.equal(host.snapshot().resourceCacheRevision,1);assert.equal(host.snapshot().canRestoreResourceCache,true);
  }finally{host?.hide();await fixture.close();}
});
test('late cache read after hide never restores preview and stale revision save requires a new check',async()=>{
  const fixture=await weChatResourceHostFixture();let host;
  try{host=await prepared(fixture);await host.checkResourceCache();const external=createWeChatLauncherResourceStore({wx:fixture.wx,profile});await external.commitResources(host.copySelectedResources(),{expectedRevision:0});
    await host.saveResourceCache();assert.equal(host.snapshot().resourceCacheRevision,null);assert.match(host.snapshot().resourceCacheStatus,/变化/);assert.equal(fixture.files.stats.writes.length,1);
    const original=fixture.files.fs.readdir;let held;fixture.files.fs.readdir=options=>{held=options;};const pending=host.checkResourceCache();assert.ok(held);host.hide();const view=host.snapshot();await pending;
    held.success({files:[]});await Promise.resolve();assert.deepEqual(host.snapshot(),view);fixture.files.fs.readdir=original;
  }finally{host?.hide();await fixture.close();}
});
test('empty selected file lists remain distinct from an absent cache and restore as an explicitly selectable candidate',async()=>{
  const fixture=await weChatResourceHostFixture();let host;
  try{host=await prepared(fixture);const current=host.copySelectedResources(),empty=createLauncherResourceSnapshot({binding:current.binding,files:[]});
    await createWeChatLauncherResourceStore({wx:fixture.wx,profile}).commitResources(empty,{expectedRevision:0});await host.checkResourceCache();
    assert.equal(host.restoreResourceCache(),true);assert.equal(host.snapshot().patchFileCount,0);assert.equal(host.snapshot().canSelectResources,true);assert.equal(host.selectResources(),true);assert.equal(host.copySelectedResources().files.length,0);
  }finally{host?.hide();await fixture.close();}
});

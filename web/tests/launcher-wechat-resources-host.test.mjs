import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeChatLauncherHost,snapshotWeChatLauncherHostConfig } from '../../adapters/wechat/launcher-host.mjs';
import { createLocalLauncherPatchRelay } from '../../adapters/node/launcher-patch-relay.mjs';
import { PUK3_PATCH_SOURCE_PROFILE } from '../../shared/launcher-patch-sources.mjs';
import { nativePatchHttp } from './helpers/wechat-patch-fixture.mjs';
import { weChatResourceHostFixture } from './helpers/wechat-resource-host-fixture.mjs';
const select=host=>{host.chooseGame(0);host.chooseRegion(0);assert.equal(host.choosePatchSource(0),true);};

test('resource configuration is optional/exact and no file/HTTP operation starts before an explicit action',async()=>{
  const fixture=await weChatResourceHostFixture();try{
    const host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config()});assert.equal(host.snapshot().patchEnabled,true);assert.equal(host.snapshot().canPrepareResources,false);
    assert.equal(fixture.files.stats.calls.length,0);assert.equal(fixture.patch.native.stats.requests.length,0);
    for(const patch of [{...fixture.settings,password:'forbidden'},{...fixture.settings,directoryText:'relative'},
      {...fixture.settings,routes:[fixture.patch.route,fixture.patch.route]},{...fixture.settings,pathEncoding:'automatic'}])assert.throws(()=>snapshotWeChatLauncherHostConfig(fixture.config({patch})));
    host.hide();
  }finally{await fixture.close();}
});

test('real host imports original resource ZIP, prepares/selects owned files and clears them on game change',async()=>{
  const fixture=await weChatResourceHostFixture(),views=[],host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config(),render:view=>views.push(view)});
  try{await host.loadCatalogs();select(host);assert.equal(host.snapshot().canPrepareResources,true);host.inputUsername('SyntheticU1');host.inputPassword('SyntheticP1');
    await host.importResourceBase();assert.equal(host.snapshot().baseFileCount,1);assert.equal(host.snapshot().canReview,false);assert.doesNotMatch(JSON.stringify(views),/SyntheticU1|SyntheticP1|payloadBytes|original-resource\.zip/);
    await host.prepareResources();assert.equal(host.snapshot().patchState,'ready');assert.equal(host.snapshot().patchFileCount,2);assert.equal(host.selectResources(),true);
    const copy=host.copySelectedResources();assert.equal(copy.binding.gameCodeText,'11');assert.equal(copy.files.length,2);copy.files[0].bytes.fill(0);
    assert.ok(host.copySelectedResources().files.some(row=>Buffer.from(row.bytes).toString()==='original base'));
    host.chooseGame(1);assert.equal(host.snapshot().resourcesSelected,false);assert.equal(host.snapshot().baseFileCount,0);assert.throws(()=>host.copySelectedResources());
  }finally{host.hide();await fixture.close();}
});

test('filtered alternative source passes original ordinal1 and keeps explicit source-bound resource schema',async()=>{
  const fixture=await weChatResourceHostFixture(),seen=[];
  const alternate={address:'221.122.119.156',portText:'80'},relay=await createLocalLauncherPatchRelay({routes:[{id:'alternate',source:alternate}],fetchImpl:async url=>{
    seen.push(url);assert.ok(url.startsWith('http://221.122.119.156/cg50/'));const path=new URL(url).pathname;
    if(path==='/cg50/Update.TXT')return new Response(fixture.patch.upstream.scenario.manifestBytes);
    const index=path.includes('first.bin')?0:1;return new Response(fixture.patch.upstream.scenario.archives[index].bytes);
  }}),native=nativePatchHttp(relay.port);let host;
  try{
    const games=Buffer.from(fixture.patch.catalogs.gameListBytes).toString().replace('<PatchEXE>patch.exe</PatchEXE>','<PatchEXE>Patcher_PUK3.exe</PatchEXE>');
    const regions=Buffer.from(fixture.metadata.routes.get('/regionList').body).toString().replace('<PIP>127.0.0.1</PIP>','<PIP>221.122.108.10</PIP>').replace(`<PPort>${fixture.patch.upstream.port}</PPort>`,'<PPort>80</PPort>');
    fixture.metadata.routes.set('/gameList',{body:Buffer.from(games)});fixture.metadata.routes.set('/regionList',{body:Buffer.from(regions)});
    const wx={...fixture.wx,request(options){return new URL(options.url).pathname.startsWith('/moli-patch/')?native.wx.request(options):fixture.metadata.wx.request(options);}};
    const patch={...fixture.settings,patchSourceProfile:PUK3_PATCH_SOURCE_PROFILE.id,routes:[{source:alternate,origin:'https://fixture.invalid',id:'alternate'}]};
    host=createWeChatLauncherHost({wx,config:fixture.config({patch})});await host.loadCatalogs();host.chooseGame(0);host.chooseRegion(0);
    assert.equal(host.snapshot().patchSources.length,1);assert.equal(host.snapshot().patchSources[0].sourceOrdinal,1);host.choosePatchSource(0);await host.prepareResources();
    assert.equal(host.snapshot().patchState,'ready');host.selectResources();const resources=host.copySelectedResources();assert.equal(resources.schema,'moli.launcher.resources.v2');assert.equal(resources.binding.patchSourceOrdinal,1);assert.equal(seen.length,3);
  }finally{host?.hide();native.close();await relay.close();await fixture.close();}
});

test('host hide during resource selection cancels logical work and ignores late picker completion',async()=>{
  const fixture=await weChatResourceHostFixture(),host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config()});
  try{await host.loadCatalogs();select(host);fixture.state.holdChoice=true;const pending=host.importResourceBase();assert.equal(host.snapshot().busy,true);
    host.hide();const expected=host.snapshot();fixture.state.pendingChoice.success({tempFiles:[{path:'original-late.zip',size:1}]});await pending;
    assert.deepEqual(host.snapshot(),expected);assert.equal(expected.baseFileCount,0);assert.equal(expected.resourcesSelected,false);assert.equal(fixture.patch.native.stats.requests.length,0);
  }finally{host.hide();await fixture.close();}
});

test('host resource prepare failure preserves imported base without silently choosing another route',async()=>{
  const fixture=await weChatResourceHostFixture(),host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config()});
  try{await host.loadCatalogs();select(host);await host.importResourceBase();fixture.patch.upstream.set('/cg50/Update.TXT',{status:503});await host.prepareResources();
    assert.equal(host.snapshot().patchState,'failed');assert.equal(host.snapshot().baseFileCount,1);assert.equal(host.snapshot().resourcesSelected,false);assert.equal(fixture.patch.native.stats.requests.length,1);
    host.choosePatchSource(-1);assert.equal(host.snapshot().canPrepareResources,false);assert.equal(host.snapshot().baseFileCount,0);
  }finally{host.hide();await fixture.close();}
});

test('after hide the same selected catalog can explicitly choose its resource source again',async()=>{
  const fixture=await weChatResourceHostFixture(),host=createWeChatLauncherHost({wx:fixture.wx,config:fixture.config()});
  try{await host.loadCatalogs();select(host);host.hide();assert.equal(host.snapshot().patchSourceIndex,-1);assert.equal(host.snapshot().baseFileCount,0);
    assert.equal(host.snapshot().patchSources.length,1);assert.equal(host.choosePatchSource(0),true);assert.equal(host.snapshot().canPrepareResources,true);
  }finally{host.hide();await fixture.close();}
});

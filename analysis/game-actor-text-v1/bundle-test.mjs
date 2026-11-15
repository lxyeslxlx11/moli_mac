/** Actual generated App/Page/current host. Owned loopback/file/API facades are not native WeChat/TLS. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { fakeWeChat,originalWeChatPeer } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';
import { weChatResourceHostFixture } from '../../web/tests/helpers/wechat-resource-host-fixture.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
function project(name,wx){const path=resolve(root,'build',name),cache=new Map(),frames=[];let app,definition;
  const sandbox={wx,setTimeout,clearTimeout,Uint8Array,ArrayBuffer,DataView,App:value=>{app=value;},Page:value=>{definition=value;},
    AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,crypto:undefined,
    Buffer:undefined,fetch:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined};
  function load(name){const file=resolve(path,name);if(!file.startsWith(path+'/'))throw Error('Unexpected import.');if(cache.has(file))return cache.get(file).exports;
    const module={exports:{}};cache.set(file,module);const fn=runInNewContext('(function(module,exports,require){\n'+readFileSync(file,'utf8')+'\n})',sandbox,{timeout:1000});
    fn(module,module.exports,request=>{if(!request.startsWith('.'))throw Error('External import.');return load(resolve(dirname(file),request));});return module.exports;}
  load('app.js');load('pages/launcher/index.js');const page={...definition,setData(value){this.data={...this.data,...value};frames.push(value);}};page.onLoad();return{app,page,frames};}
function ready(page){if(page.data.gameOrdinal<0)page.onGame({detail:{value:0}});if(page.data.referenceOrdinal<0)page.onRegion({detail:{value:0}});page.onUsername({detail:{value:'SyntheticU1'}});page.onPassword({detail:{value:'SyntheticP1'}});
  page.onReview();for(let i=0;i<3;i++)page.onNext();page.onAccept();assert.equal(page.data.canLogin,true);}

test('generated unconfigured project has no automatic resource/file/HTTP/entropy activity',()=>{
  const tcp=fakeWeChat(),{app,page}=project('wechat-app-stage176-final',tcp.wx);assert.equal(page.data.configured,false);assert.equal(page.data.patchEnabled,false);assert.equal(tcp.stats.created,0);
  app.onHide();page.onUnload();assert.equal(page._host,null);
});
test('generated existing local config retains current exchange without DOM APIs',async()=>{
  const peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port}),{app,page}=project('wechat-app-local-stage176-final',tcp.wx);
  try{ready(page);await page.onStart();assert.equal((await peer.done).request_verified,true);assert.ok(page.data.rows.length);app.onHide();}
  finally{page.onUnload();await peer.close();}
});
test('generated full Page loads metadata, imports actual original ZIP, prepares/selects resources then exchanges',async()=>{
  const fixture=await weChatResourceHostFixture({real:true,stableSource:true}),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});let built;
  try{built=project('wechat-app-resources-stage176-final',{...fixture.wx,...tcp.wx});const{page,app,frames}=built;
    assert.equal(fixture.files.stats.calls.length,0);await page.onLoadCatalogs();page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});
    page.onPatchSource({detail:{value:1}});await page.onImportResourceBase();assert.equal(page.data.baseFileCount,1);await page.onPrepareResources();assert.equal(page.data.patchState,'ready');
    page.onSelectResources();assert.equal(page.data.resourcesSelected,true);assert.equal(page._host.copySelectedResources().files.length,2);
    ready(page);await page.onStart();assert.equal((await peer.done).request_verified,true);assert.ok(page.data.rows.length);assert.equal(page.data.resourcesSelected,true);
    assert.equal(fixture.patch.native.stats.requests.length,3);assert.equal(fixture.patch.native.stats.listeners,0);
    assert.doesNotMatch(JSON.stringify(frames),/SyntheticU1|SyntheticP1|payloadBytes|original-resource\.zip/);
    app.onHide();assert.equal(page.data.baseFileCount,0);assert.equal(page.data.resourcesSelected,false);assert.equal(page.data.patchSources.length,1);
  }finally{built?.page.onUnload();await peer.close();await fixture.close();}
});
test('generated source picker placeholder explicitly clears source choice and imported base',async()=>{
  const fixture=await weChatResourceHostFixture({stableSource:true});let built;
  try{built=project('wechat-app-resources-stage176-final',fixture.wx);const{page}=built;await page.onLoadCatalogs();page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});
    assert.equal(page.data.patchSourceIndex,-1);page.onPatchSource({detail:{value:1}});await page.onImportResourceBase();assert.equal(page.data.baseFileCount,1);
    page.onPatchSource({detail:{value:0}});assert.equal(page.data.patchSourceIndex,-1);assert.equal(page.data.canPrepareResources,false);assert.equal(page.data.baseFileCount,0);
  }finally{built?.page.onUnload();await fixture.close();}
});
test('generated App hide cancels an active resource request and prevents late candidate resurrection',async()=>{
  const fixture=await weChatResourceHostFixture({stableSource:true});fixture.patch.upstream.set('/cg50/Update.TXT',{delayMs:200});let built;
  try{built=project('wechat-app-resources-stage176-final',fixture.wx);const{page,app}=built;await page.onLoadCatalogs();page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});page.onPatchSource({detail:{value:1}});
    const pending=page.onPrepareResources();for(let i=0;i<100&&!fixture.patch.native.stats.requests.length;i++)await new Promise(resolve=>setTimeout(resolve,1));assert.equal(fixture.patch.native.stats.requests.length,1);
    app.onHide();const expected=JSON.stringify(page.data);await pending;assert.equal(JSON.stringify(page.data),expected);assert.equal(page.data.resourcesSelected,false);assert.equal(fixture.patch.native.stats.listeners,0);
  }finally{built?.page.onUnload();await fixture.close();}
});

test('fresh generated JS context restores real original catalog/resource files and exchanges without HTTP or picker',async()=>{
  const fixture=await weChatResourceHostFixture({real:true,stableSource:true}),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});let first,second;
  try{first=project('wechat-app-resources-stage176-final',fixture.wx);const page=first.page;await page.onLoadCatalogs();page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});page.onPatchSource({detail:{value:1}});
    await page.onImportResourceBase();await page.onPrepareResources();page.onSelectResources();await page.onCheckCatalogCache();await page.onSaveCatalogCache();await page.onCheckResourceCache();await page.onSaveResourceCache();
    assert.equal(page.data.resourceCacheRevision,1);const expected=JSON.stringify(page._host.copySelectedResources());first.app.onHide();first.page.onUnload();first=null;
    const metadataCalls=fixture.metadata.requests.length,patchCalls=fixture.patch.native.stats.requests.length;let picks=0;
    second=project('wechat-app-resources-stage176-final',{...fixture.wx,...tcp.wx,chooseMessageFile(){picks++;throw Error('Unexpected new picker on file recovery.');}});
    const restored=second.page;assert.equal(restored.data.resourcesSelected,false);await restored.onCheckCatalogCache();restored.onRestoreCatalogCache();restored.onGame({detail:{value:0}});restored.onRegion({detail:{value:0}});restored.onPatchSource({detail:{value:1}});
    await restored.onCheckResourceCache();assert.equal(restored.data.canRestoreResourceCache,true);restored.onRestoreResourceCache();assert.equal(restored.data.resourcesSelected,false);assert.equal(restored.data.patchFromCache,true);restored.onSelectResources();
    assert.equal(JSON.stringify(restored._host.copySelectedResources()),expected);assert.equal(fixture.metadata.requests.length,metadataCalls);assert.equal(fixture.patch.native.stats.requests.length,patchCalls);assert.equal(picks,0);
    ready(restored);await restored.onStart();assert.equal((await peer.done).request_verified,true);assert.equal(restored.data.resourcesSelected,true);
    assert.doesNotMatch(JSON.stringify(second.frames),/SyntheticU1|SyntheticP1|original-resource\.zip/);
  }finally{first?.page.onUnload();second?.page.onUnload();await peer.close();await fixture.close();}
});
test('generated App hide during issued cache write requires recheck and cannot resurrect from late completion',async()=>{
  const fixture=await weChatResourceHostFixture({stableSource:true});let built;
  try{built=project('wechat-app-resources-stage176-final',fixture.wx);const{page,app}=built;await page.onLoadCatalogs();page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});page.onPatchSource({detail:{value:1}});
    await page.onImportResourceBase();await page.onPrepareResources();page.onSelectResources();await page.onCheckResourceCache();fixture.files.controls.holdWrite=true;
    const pending=page.onSaveResourceCache();for(let i=0;i<100&&!fixture.files.stats.pendingWrites.length;i++)await new Promise(resolve=>setTimeout(resolve,1));assert.equal(fixture.files.stats.pendingWrites.length,1);
    app.onHide();const expected=JSON.stringify(page.data);await pending;assert.match(page.data.resourceCacheStatus,/重新检查/);assert.equal(page.data.resourceCacheRevision,null);
    await fixture.files.finishWrite(0);await Promise.resolve();assert.equal(JSON.stringify(page.data),expected);
  }finally{built?.page.onUnload();await fixture.close();}
});

/** Actual generated CJS/App/Page modules; Node-backed API/HTTP/files/Python is not native WeChat. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { fakeWeChat,originalWeChatPeer } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';
import { createWeChatHttpFixture,WECHAT_LOCAL_LAUNCHER } from '../../web/tests/helpers/wechat-http-fixture.mjs';
import { weChatCacheFixture } from '../../web/tests/helpers/wechat-cache-fixture.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
function project(name,wx){const path=resolve(root,'build',name),cache=new Map(),frames=[];let app,definition;
  const sandbox={wx,setTimeout,clearTimeout,Uint8Array,ArrayBuffer,DataView,App:value=>{app=value;},Page:value=>{definition=value;},
    AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,crypto:undefined,
    Buffer:undefined,fetch:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined};
  function load(name){const file=resolve(path,name);if(!file.startsWith(path+'/'))throw Error('Unexpected import.');if(cache.has(file))return cache.get(file).exports;
    const module={exports:{}};cache.set(file,module);const fn=runInNewContext('(function(module,exports,require){\n'+readFileSync(file,'utf8')+'\n})',sandbox,{timeout:1000});
    fn(module,module.exports,request=>{if(!request.startsWith('.'))throw Error('External import.');return load(resolve(dirname(file),request));});return module.exports;}
  load('app.js');load('pages/launcher/index.js');const page={...definition,setData(value){this.data={...this.data,...value};frames.push(value);}};page.onLoad();return{app,page,frames};}
function ready(page){page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});page.onUsername({detail:{value:'SyntheticU1'}});page.onPassword({detail:{value:'SyntheticP1'}});
  page.onReview();for(let i=0;i<3;i++)page.onNext();page.onAccept();assert.equal(page.data.canLogin,true);}
async function environment(real){const http=await createWeChatHttpFixture(),files=await weChatCacheFixture({real}),path=await files.put('original-selected.exe',WECHAT_LOCAL_LAUNCHER);
  return{http,files,wx:{...http.wx,...files.wx,chooseMessageFile(options){queueMicrotask(()=>options.success({tempFiles:[{path,size:WECHAT_LOCAL_LAUNCHER.length}]}));}},async close(){await http.close();await files.close();}};}

test('generated default profile performs no automatic cache, file or session IO',async()=>{
  const files=await weChatCacheFixture(),tcp=fakeWeChat(),{app,page}=project('wechat-app-stage145',{...files.wx,...tcp.wx});
  assert.equal(page.data.configured,false);assert.equal(page.data.cacheEnabled,false);assert.equal(files.stats.calls.length,0);assert.equal(tcp.stats.created,0);
  app.onHide();page.onUnload();assert.equal(page._host,null);
});

test('generated pre-cache local config preserves the actual current exchange without DOM',async()=>{
  const peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port}),{app,page,frames}=project('wechat-app-local-stage145',tcp.wx);
  try{ready(page);await page.onStart();assert.equal((await peer.done).request_verified,true);assert.ok(page.data.rows.length);assert.doesNotMatch(JSON.stringify(frames),/SyntheticU1|SyntheticP1/);app.onHide();}
  finally{page.onUnload();await peer.close();}
});

test('generated Page saves actual original disk records, fresh JS realm restores then exchanges without another fetch',async()=>{
  const env=await environment(true),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});let first,second;
  try{first=project('wechat-app-cache-stage145',env.wx);assert.equal(env.files.stats.calls.length,0);await first.page.onLoadCatalogs();await first.page.onCheckCatalogCache();await first.page.onSaveCatalogCache();
    assert.equal(first.page.data.cacheRevision,1);first.page.onUnload();
    second=project('wechat-app-cache-stage145',{...env.wx,...tcp.wx});assert.equal(second.page.data.catalogsReady,false);await second.page.onCheckCatalogCache();assert.equal(second.page.data.catalogsReady,false);
    second.page.onRestoreCatalogCache();assert.equal(second.page.data.catalogsReady,true);ready(second.page);await second.page.onStart();assert.equal((await peer.done).request_verified,true);
    assert.ok(second.page.data.rows.length);assert.equal(env.http.stats.calls.length,4);assert.equal(env.files.stats.writes.length,1);
    assert.doesNotMatch(JSON.stringify([...first.frames,...second.frames]),/SyntheticU1|SyntheticP1|original-selected|gameListBytes|regionListBytes/);second.app.onHide();assert.equal(second.page.data.canRestoreCatalogCache,false);
  }finally{first?.page.onUnload();second?.page.onUnload();await peer.close();await env.close();}
});

test('generated App hide during write preserves unknown outcome and blocks late view updates until explicit recheck',async()=>{
  const env=await environment(false);let app;
  try{app=project('wechat-app-cache-stage145',env.wx);await app.page.onLoadCatalogs();await app.page.onCheckCatalogCache();env.files.controls.holdWrite=true;const pending=app.page.onSaveCatalogCache();
    for(let i=0;i<100&&!env.files.stats.pendingWrites.length;i++)await new Promise(resolve=>setTimeout(resolve,1));assert.equal(env.files.stats.pendingWrites.length,1);
    app.app.onHide();const expected=JSON.stringify(app.page.data);await pending;assert.equal(JSON.stringify(app.page.data),expected);assert.match(app.page.data.cacheStatus,/重新检查/);
    await app.page.onCheckCatalogCache();assert.match(app.page.data.cacheStatus,/未完成操作/);await env.files.finishWrite(0);await app.page.onCheckCatalogCache();assert.equal(app.page.data.cacheRevision,1);
  }finally{app?.page.onUnload();await env.close();}
});

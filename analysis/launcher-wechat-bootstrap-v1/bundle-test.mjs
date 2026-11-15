/** Real generated App/Page/host JS with HTTP/file/TCP ports; Node facade is not native WeChat. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { fakeWeChat, originalWeChatPeer } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';
import { createWeChatHttpFixture, weChatFileFixture, WECHAT_LOCAL_LAUNCHER } from '../../web/tests/helpers/wechat-http-fixture.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
function loadProject(name,wx){
  const path=resolve(root,'build',name),cache=new Map();let app,definition;const frames=[];
  const sandbox={wx,setTimeout,clearTimeout,Uint8Array,ArrayBuffer,DataView,
    App(value){app=value;},Page(value){definition=value;},AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,
    performance:undefined,crypto:undefined,Buffer:undefined,fetch:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined};
  function load(name){const file=resolve(path,name);if(!file.startsWith(path+'/'))throw Error('Unexpected import.');if(cache.has(file))return cache.get(file).exports;
    const module={exports:{}};cache.set(file,module);
    const fn=runInNewContext('(function(module,exports,require){\n'+readFileSync(file,'utf8')+'\n})',sandbox,{timeout:1000});
    fn(module,module.exports,request=>{if(!request.startsWith('.'))throw Error('External import.');return load(resolve(dirname(file),request));});return module.exports;}
  load('app.js');load('pages/launcher/index.js');const page={...definition,setData(value){this.data={...this.data,...value};frames.push(value);}};page.onLoad();return{app,page,frames};
}
function ready(page){page.onGame({detail:{value:0}});page.onRegion({detail:{value:0}});page.onUsername({detail:{value:'SyntheticU1'}});page.onPassword({detail:{value:'SyntheticP1'}});
  page.onReview();for(let i=0;i<3;i++)page.onNext();page.onAccept();assert.equal(page.data.canLogin,true);}

test('generated default project remains unconfigured with no file/HTTP/TCP/entropy activity',()=>{
  const tcp=fakeWeChat(),file=weChatFileFixture();const {app,page}=loadProject('wechat-app-stage144',{...tcp.wx,...file.wx});
  assert.equal(page.data.configured,false);assert.equal(page.data.canLoadCatalogs,false);assert.equal(file.stats.picks,0);assert.equal(tcp.stats.created,0);
  app.onHide();page.onUnload();assert.equal(page._host,null);
});

test('generated legacy local config still completes original current exchange without DOM globals',async()=>{
  const peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port}),{app,page,frames}=loadProject('wechat-app-local-stage144',tcp.wx);
  try{ready(page);await page.onStart();const oracle=await peer.done;assert.equal(oracle.request_verified,true);assert.ok(page.data.rows.length);
    assert.doesNotMatch(JSON.stringify(frames),/SyntheticU1|SyntheticP1/);app.onHide();assert.equal(page.data.rows.length,0);
  }finally{page.onUnload();await peer.close();}
});

test('generated remote Page event reads original local bytes, fetches a complete pair, exchanges and clears on App hide',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture(),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port});
  const {app,page,frames}=loadProject('wechat-app-http-stage144',{...http.wx,...file.wx,...tcp.wx});
  try{assert.equal(page.data.catalogsReady,false);assert.equal(http.stats.calls.length,0);assert.equal(file.stats.picks,0);
    await page.onLoadCatalogs();assert.equal(page.data.catalogsReady,true);assert.equal(page.data.games[0].label,'原创联调');
    ready(page);await page.onStart();const oracle=await peer.done;assert.equal(oracle.request_verified,true);
    const allowed=page.data.rows.find(row=>row.selectable);page.onProfile({currentTarget:{dataset:{ordinal:allowed.ordinal}}});assert.ok(page.data.selectedLabel);
    assert.equal(http.stats.calls.length,4);assert.equal(file.stats.reads[0].length,WECHAT_LOCAL_LAUNCHER.length);assert.equal(http.stats.listeners,0);
    assert.doesNotMatch(JSON.stringify(frames),/SyntheticU1|SyntheticP1|selected-not-for-logs/);app.onHide();assert.equal(page.data.rows.length,0);assert.equal(page.data.accepted,false);
  }finally{page.onUnload();await peer.close();await http.close();}
});

test('generated Page hide cancels a pending native file choice and blocks all late IO/rows',async()=>{
  const http=await createWeChatHttpFixture();let choose;const file=weChatFileFixture(undefined,{chooseMessageFile(value){choose=value;}});
  const {app,page}=loadProject('wechat-app-http-stage144',{...http.wx,...file.wx});
  try{const pending=page.onLoadCatalogs();assert.equal(page.data.loadingCatalogs,true);app.onHide();const expected=JSON.stringify(page.data);
    choose.success({tempFiles:[{path:file.path,size:WECHAT_LOCAL_LAUNCHER.length}]});await pending;
    assert.equal(JSON.stringify(page.data),expected);assert.equal(file.stats.statCalls,0);assert.equal(http.stats.calls.length,0);
  }finally{page.onUnload();await http.close();}
});

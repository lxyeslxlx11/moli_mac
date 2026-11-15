import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeChatLauncherHost,snapshotWeChatLauncherHostConfig } from '../../adapters/wechat/launcher-host.mjs';
import { weChatHostConfig } from './helpers/wechat-host-fixture.mjs';
import { createWeChatHttpFixture,weChatFileFixture,weChatBootstrapConfig } from './helpers/wechat-http-fixture.mjs';
import { fakeWeChat,originalWeChatPeer } from './helpers/wechat-tcp-fixture.mjs';
import { readFileSync } from 'node:fs';
const config=(extra={})=>weChatHostConfig({gameListXml:null,regionListXml:null,bootstrap:weChatBootstrapConfig(),...extra});

test('optional bootstrap config validates exact endpoint/origin/encoding fields without IO or implicit catalogs',()=>{
  const value=snapshotWeChatLauncherHostConfig(config());assert.equal(value.games,null);assert.equal(value.regions,null);assert.ok(value.bootstrap);
  for(const bootstrap of [weChatBootstrapConfig({token:'forbidden'}),weChatBootstrapConfig({encoding:'windows-936'}),weChatBootstrapConfig({timeoutMs:0}),
    weChatBootstrapConfig({allowedOrigins:['https://other.invalid']}),weChatBootstrapConfig({endpoints:{...weChatBootstrapConfig().endpoints,extra:'x'}})]){
    assert.throws(()=>snapshotWeChatLauncherHostConfig(config({bootstrap})));
  }
  assert.throws(()=>snapshotWeChatLauncherHostConfig(config({bootstrap:null})));
  assert.throws(()=>snapshotWeChatLauncherHostConfig(config({gameListXml:weChatHostConfig().gameListXml})));
  const source=config();let reads=0;Object.defineProperty(source.bootstrap,'timeoutMs',{get(){reads++;throw Error();}});
  assert.throws(()=>snapshotWeChatLauncherHostConfig(source));assert.equal(reads,0);
});

test('real host loads an original HTTP pair from an explicitly chosen file, then completes source-bound original exchange',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture(),peer=await originalWeChatPeer(),tcp=fakeWeChat({native:true,loopbackPort:peer.port}),views=[];
  const host=createWeChatLauncherHost({wx:{...http.wx,...file.wx,...tcp.wx},config:config(),render:view=>views.push(view)});
  try {
    assert.equal(host.snapshot().canInput,false);assert.equal(host.snapshot().canLoadCatalogs,true);assert.equal(http.stats.calls.length,0);assert.equal(file.stats.picks,0);
    const loaded=await host.loadCatalogs();assert.equal(loaded.busy,false);assert.equal(loaded.catalogsReady,true);assert.equal(loaded.games[0].label,'原创联调');
    host.chooseGame(0);host.chooseRegion(0);host.inputUsername('SyntheticU1');host.inputPassword('SyntheticP1');host.beginReview();for(let i=0;i<3;i++)host.nextPage();host.decide(true);
    assert.equal(host.snapshot().canLogin,true);const result=await host.login(),oracle=await peer.done;
    assert.equal(oracle.request_verified,true);assert.ok(result.rows.length);assert.doesNotMatch(JSON.stringify(views),/SyntheticU1|SyntheticP1|selected-not-for-logs/);
    assert.equal(file.stats.reads.length,1);assert.equal(http.stats.calls.length,4);assert.equal(http.stats.listeners,0);assert.equal(tcp.stats.closed,1);
  } finally {host.hide();await peer.close();await http.close();}
});

test('host refresh invalidates consent/input/selection and refuses a malformed half-pair without restoring old catalogs',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture();const host=createWeChatLauncherHost({wx:{...http.wx,...file.wx},config:config()});
  try {
    await host.loadCatalogs();host.chooseGame(0);host.chooseRegion(0);host.inputUsername('SyntheticU1');host.inputPassword('SyntheticP1');host.beginReview();for(let i=0;i<3;i++)host.nextPage();host.decide(true);
    assert.equal(host.snapshot().accepted,true);http.routes.set('/regionList',{body:Buffer.from('<invalid>')});
    const pending=host.loadCatalogs();assert.equal(host.snapshot().canLogin,false);assert.equal(host.snapshot().accepted,false);assert.equal(host.snapshot().canInput,false);
    const result=await pending;assert.equal(result.games.length,0);assert.equal(result.catalogsReady,false);assert.equal(result.busy,false);assert.equal(result.canReview,false);
  } finally {host.hide();await http.close();}
});

test('host hide during file selection ignores late selection and leaves no catalog network request',async()=>{
  const http=await createWeChatHttpFixture();let choose;
  const file=weChatFileFixture(undefined,{chooseMessageFile(value){choose=value;}}),host=createWeChatLauncherHost({wx:{...http.wx,...file.wx},config:config()});
  try {const pending=host.loadCatalogs();assert.equal(host.snapshot().loadingCatalogs,true);host.hide();const expected=host.snapshot();
    choose.success({tempFiles:[{path:file.path,size:1}]});await pending;assert.deepEqual(host.snapshot(),expected);assert.equal(http.stats.calls.length,0);assert.equal(file.stats.statCalls,0);
  } finally {host.hide();await http.close();}
});

test('host cancel during a held HTTP request aborts it and ignores late catalog results',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture();http.routes.set('/launcherDigest',{hold:true});
  const host=createWeChatLauncherHost({wx:{...http.wx,...file.wx},config:config()});
  try {const pending=host.loadCatalogs();for(let i=0;i<100&&!http.stats.calls.length;i++)await new Promise(resolve=>setTimeout(resolve,1));
    assert.equal(http.stats.calls.length,1);host.cancel();const expected=host.snapshot();await pending;
    assert.deepEqual(host.snapshot(),expected);assert.equal(expected.catalogsReady,false);assert.equal(http.stats.listeners,0);assert.ok(http.stats.aborts>=1);
  } finally {host.hide();await http.close();}
});

test('host retains explicit bare-amp XML policy across the remote configuration snapshot',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture();
  http.routes.set('/gameList',{body:Buffer.from(weChatHostConfig().gameListXml.replace('原创联调','原&创'))});
  const host=createWeChatLauncherHost({wx:{...http.wx,...file.wx},config:config({allowBareAmpersands:true})});
  try{const result=await host.loadCatalogs();assert.equal(result.catalogsReady,true);assert.equal(result.games[0].label,'原&创');}
  finally{host.hide();await http.close();}
});

test('host refuses unsupported platforms before file selection and stops on an update candidate without catalogs',async()=>{
  const http=await createWeChatHttpFixture(),file=weChatFileFixture();
  const unsupported=createWeChatLauncherHost({wx:{...http.wx,...file.wx,getDeviceInfo:()=>({platform:'mac'})},config:config()});
  const denied=await unsupported.loadCatalogs();assert.equal(file.stats.picks,0);assert.equal(denied.catalogsReady,false);assert.match(denied.status,/不支持/);
  const vector=JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json',import.meta.url))).cases.find(row=>row.name==='deflated-header');
  const archive=Buffer.from(vector.archive_hex,'hex'),origin=weChatBootstrapConfig().allowedOrigins[0];
  http.routes.set('/launcherDigest',{body:Buffer.from(vector.expected_md5)});http.routes.set('/updateLocator',{body:Buffer.from(origin+'/package '+archive.length)});http.routes.set('/package',{body:archive});
  const host=createWeChatLauncherHost({wx:{...http.wx,...file.wx},config:config()});
  try{const result=await host.loadCatalogs();assert.equal(result.busy,false);assert.equal(result.catalogsReady,false);assert.match(result.status,/更新候选.*未执行/);assert.equal(result.canInput,false);assert.equal(http.stats.calls.length,3);}
  finally{host.hide();await http.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWeChatLauncherHttpClient, snapshotWeChatHttpUrl, snapshotWeChatHttpOrigins } from '../../adapters/wechat/launcher-http.mjs';
import { createWeChatLauncherBootstrap } from '../../adapters/wechat/launcher-bootstrap.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { WECHAT_HTTP_ORIGIN as origin, WECHAT_LOCAL_LAUNCHER as launcherBytes, weChatBootstrapConfig,
  scriptedWeChatHttp, createWeChatHttpFixture } from './helpers/wechat-http-fixture.mjs';

const code = (task, expected) => assert.rejects(task, error => error.code === expected);
const client = (fixture, extra = {}) => createWeChatLauncherHttpClient({ wx: fixture.wx, allowedOrigins: [origin], ...extra });
const prepared = (loader, extra = {}) => loader.prepare({ launcherBytes, gameListBytes:null, regionListBytes:null,
  endpoints:weChatBootstrapConfig().endpoints, encoding:'utf-8', allowBareAmpersands:false, ...extra });

test('WeChat HTTP accepts only explicit HTTPS DNS URI/origins and gates documented manual redirect support before request', async () => {
  assert.equal(snapshotWeChatHttpUrl('https://Fixture.Invalid:443/a%20b?x=1').href,origin+'/a%20b?x=1');
  assert.deepEqual(snapshotWeChatHttpOrigins([origin]),[origin]);
  for (const url of ['http://fixture.invalid/a','https://u:p@fixture.invalid/a','https://fixture.invalid:444/a',
    'https://127.0.0.1/a','https://localhost/a','https://a.123/a','https://fixture.invalid./a','https://fixture.invalid/a#frag',
    'https://fixture.invalid/a\\b','https://fixture.invalid/a b','https://fixture.invalid/中','https://fixture.invalid/%no']) assert.throws(() => snapshotWeChatHttpUrl(url));
  const fixture = scriptedWeChatHttp(() => {});
  for (const extra of [{ getAppBaseInfo:()=>({SDKVersion:'3.2.1'}) },{ getAppBaseInfo:()=>({SDKVersion:'3.2.2-beta'}) },
    { getDeviceInfo:()=>({platform:'mac'}) },{ getDeviceInfo:()=>({platform:'windows'}) },{ getDeviceInfo:()=>({platform:'ohos'}) }]) {
    assert.throws(() => client({ wx:{...fixture.wx,...extra} }),error=>error.code==='HTTP_CAPABILITY');
  }
  const http=client(fixture);await code(http.getBytes('https://denied.invalid/'),'HTTP_ORIGIN');
  await code(http.getBytes(origin+'/',{signal:{aborted:false}}),'HTTP_INPUT');assert.equal(fixture.stats.calls.length,0);
});

for (const mode of [{finalBody:false,emitChunks:true},{finalBody:true,emitChunks:true},{finalBody:true,emitChunks:false}]) {
  test(`actual original HTTP response byte ownership and native callback shape: ${JSON.stringify(mode)}`, async () => {
    const fixture=await createWeChatHttpFixture(mode);
    try { const result=await client(fixture).getBytes(origin+'/gameList',{kind:'catalog'});
      assert.equal(Buffer.from(result.bytes).toString(),fixture.routes.get('/gameList').body.toString());
      assert.equal(result.byteLength,result.bytes.length);assert.equal(result.trust,'unverified');
      assert.equal(fixture.stats.listeners,0);assert.equal(fixture.stats.offCalls,2);assert.equal(fixture.stats.aborts,0);
    } finally { await fixture.close(); }
  });
}

test('WeChat HTTP rejects observed redirects/status/declared and actual oversize then removes listeners', async () => {
  for (const [expected,run] of [
    ['HTTP_REDIRECT',e=>e.headers({statusCode:302,header:{Location:'https://denied.invalid/'}})],
    ['HTTP_REDIRECT',e=>e.success([],301,{})],['HTTP_STATUS',e=>e.success([],404,{})],
    ['HTTP_LENGTH',e=>e.headers({header:{'content-length':'-1'}})],
    ['HTTP_LENGTH',e=>e.headers({header:{'content-length':'1','Content-Length':'1'}})],
    ['HTTP_BODY_LIMIT',e=>e.headers({header:{'content-length':'4097'}})],
    ['HTTP_BODY_LIMIT',e=>{e.chunk(new Uint8Array(4096));e.chunk([1]);}],
    ['HTTP_BODY_LIMIT',e=>e.success(new Uint8Array(4097))],
    ['HTTP_RESPONSE',e=>{e.chunk([1,2]);e.success([1,3]);}],
    ['HTTP_RESPONSE',e=>e.success([1],NaN,{})],
    ['HTTP_NETWORK',e=>e.fail({errMsg:'private platform error must not escape'})]]) {
    const fixture=scriptedWeChatHttp(run);await code(client(fixture).getBytes(origin+'/data'),expected);
    assert.equal(fixture.stats.listeners,0);assert.ok(fixture.stats.aborts>=1);
  }
});

test('actual original redirect is rejected without following its Location', async () => {
  const fixture=await createWeChatHttpFixture();fixture.routes.set('/redirect',{status:302,header:{Location:origin+'/gameList'},body:Buffer.alloc(0)});
  try { await code(client(fixture).getBytes(origin+'/redirect'),'HTTP_REDIRECT');assert.deepEqual(fixture.requests.map(row=>row.url),['/redirect']); }
  finally { await fixture.close(); }
});

test('native callback cleanup handles empty chunks/count budget, malformed task and unexpected synchronous callback', async () => {
  let fixture=scriptedWeChatHttp(e=>{for(let i=0;i<=65536;i++)e.chunk([]);});
  await code(client(fixture).getBytes(origin+'/'),'HTTP_READ_LIMIT');assert.equal(fixture.stats.listeners,0);
  fixture=scriptedWeChatHttp(()=>{}, {request(options){options.success({statusCode:200,header:{},data:new ArrayBuffer(0)});return{abort(){}};}});
  await code(client(fixture).getBytes(origin+'/'),'HTTP_CAPABILITY');
  fixture=scriptedWeChatHttp(()=>{});const nativeRequest=fixture.wx.request;
  fixture.wx.request=options=>{const task=nativeRequest(options);options.success({statusCode:200,header:{},data:new ArrayBuffer(0)});return task;};
  await code(client(fixture).getBytes(origin+'/'),'HTTP_RESPONSE');assert.equal(fixture.stats.listeners,0);
});

test('WeChat HTTP cancellation and timer-floor deadline reject without late callback resurrection', async () => {
  const callbacks=[];let wall=1000;
  const clock=createWeChatDeadlineClock({wallNow:()=>wall,setTimer(fn){callbacks.push(fn);return fn;},clearTimer(){}});
  const fixture=scriptedWeChatHttp(()=>{}),control=createWeChatAbortController();
  let pending=client(fixture,{clock}).getBytes(origin+'/',{signal:control.signal,timeoutMs:100});
  await Promise.resolve();control.abort();await code(pending,'HTTP_ABORTED');
  assert.equal(fixture.stats.listeners,0);fixture.stats.tasks[0].success([9]);
  const second=scriptedWeChatHttp(()=>{});pending=client(second,{clock}).getBytes(origin+'/',{timeoutMs:100});
  await Promise.resolve();wall=0;callbacks.at(-1)();await code(pending,'HTTP_TIMEOUT');assert.equal(clock.now(),100);
  assert.equal(second.stats.listeners,0);assert.ok(second.stats.aborts>=1);
  const before=fixture.stats.calls.length;await code(client(fixture).getBytes(origin+'/',{signal:control.signal}),'HTTP_ABORTED');assert.equal(fixture.stats.calls.length,before);
});

test('actual held original HTTP response obeys its deadline and detaches native listeners',async()=>{
  const fixture=await createWeChatHttpFixture();fixture.routes.set('/held',{hold:true});
  try{await code(client(fixture).getBytes(origin+'/held',{timeoutMs:20}),'HTTP_TIMEOUT');assert.equal(fixture.stats.listeners,0);assert.ok(fixture.stats.aborts>=1);}
  finally{await fixture.close();}
});

test('WeChat current bootstrap reuses four ordered source requests, cache ticks and complete catalog pair gates', async () => {
  const fixture=await createWeChatHttpFixture();const loader=createWeChatLauncherBootstrap({wx:fixture.wx,allowedOrigins:[origin]});
  try {
    const result=await prepared(loader);
    assert.equal(result.disposition,'catalogs-prepared');assert.equal(result.catalogs.games.games[0].name,'原创联调');
    assert.equal(result.comparison.gameList,'unavailable');assert.equal(result.authentication,'unverified');
    assert.equal(result.catalogDigestMetadata.use,'request-success-only');
    assert.deepEqual(fixture.requests.map(row=>new URL(row.url,origin).pathname),['/launcherDigest','/catalogDigests','/gameList','/regionList']);
    assert.ok(fixture.requests.every(row=>/^\?rtm=\d+$/.test(new URL(row.url,origin).search)));
    fixture.routes.set('/regionList',{body:Buffer.from('<invalid>')});await code(prepared(loader),'BOOTSTRAP_DATA');
    assert.equal(fixture.stats.listeners,0);
  } finally { await fixture.close(); }
});

test('WeChat current bootstrap decodes real GB18030 four-byte catalog content through pure ports', async () => {
  const fixture=await createWeChatHttpFixture();
  // Original ASCII XML plus U+10000 encoded by the standard's first supplementary pointer.
  fixture.routes.set('/gameList',{body:Buffer.concat([Buffer.from('<Gamelist><Games><Game Code="11"><Name>'),Buffer.from([0x90,0x30,0x81,0x30]),Buffer.from('</Name><EXE>original.exe</EXE><Regions><Region>R</Region></Regions></Game></Games></Gamelist>')])});
  fixture.routes.set('/regionList',{body:Buffer.from('<Regionlist><Regions><Region Code="1"><Name>R</Name></Region></Regions></Regionlist>')});
  try { const value=await prepared(createWeChatLauncherBootstrap({wx:fixture.wx,allowedOrigins:[origin]}),{encoding:'gb18030'});
    assert.equal(value.catalogs.games.games[0].name,'\u{10000}');assert.equal(value.catalogs.encoding,'gb18030');
  } finally { await fixture.close(); }
});

test('WeChat bootstrap update branch validates an original package without catalog requests or execution', async () => {
  const vector=JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json',import.meta.url))).cases.find(row=>row.name==='deflated-header');
  const fixture=await createWeChatHttpFixture(),archive=Buffer.from(vector.archive_hex,'hex');
  fixture.routes.set('/launcherDigest',{body:Buffer.from(vector.expected_md5)});
  fixture.routes.set('/updateLocator',{body:Buffer.from(origin+'/package '+archive.length)});fixture.routes.set('/package',{body:archive});
  try { const result=await prepared(createWeChatLauncherBootstrap({wx:fixture.wx,allowedOrigins:[origin]}));
    assert.equal(result.disposition,'launcher-update-candidate');assert.equal(result.update.actualMd5,vector.expected_md5);assert.equal(result.execution,'not-performed');
    assert.deepEqual(fixture.requests.map(row=>new URL(row.url,origin).pathname),['/launcherDigest','/updateLocator','/package']);
    assert.equal(new URL(fixture.requests[2].url,origin).search,'');assert.equal(result.catalogs,null);
  } finally { await fixture.close(); }
});

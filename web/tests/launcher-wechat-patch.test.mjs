import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeChatLauncherPatchPreparer,snapshotWeChatLauncherPatchConfig } from '../../adapters/wechat/launcher-patch.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { weChatPatchFixture } from './helpers/wechat-patch-fixture.mjs';
const code=(pending,expected)=>assert.rejects(pending,error=>error.code===expected);
for(const scenario of ['create-deflate','sequential-create-append'])test(`native-shaped HTTP through actual fixed relay reuses source-bound patch run: ${scenario}`,async()=>{
  const fixture=await weChatPatchFixture(scenario);
  try{const input=fixture.input(),before=structuredClone(input.files),loader=createWeChatLauncherPatchPreparer({wx:fixture.native.wx,routes:[fixture.route]}),result=await loader.prepare(input);
    assert.deepEqual(result.candidate.files,fixture.upstream.scenario.expectedFiles);assert.deepEqual(input.files,before);assert.equal(result.replacement,'not-performed');assert.equal(result.authentication,'unverified');
    assert.equal(fixture.native.stats.listeners,0);assert.equal(fixture.native.stats.requests.length,result.requests.length);
    assert.ok(result.requests.every(row=>row.url.startsWith('https://fixture.invalid/moli-patch/v1/original/cg50/')));
  }finally{await fixture.close();}
});
test('native patch routes reject mismatched sources and unconfigured fallback without any request',async()=>{
  const fixture=await weChatPatchFixture('create-deflate');
  try{const route=structuredClone(fixture.route);route.source.portText='12345';const loader=createWeChatLauncherPatchPreparer({wx:fixture.native.wx,routes:[route]});
    await code(loader.prepare(fixture.input()),'PATCH_ROUTE_SOURCE');assert.equal(fixture.native.stats.requests.length,0);
    for(const change of [{origin:'http://fixture.invalid'},{id:'../escape'},{source:{address:'fixture.invalid',portText:'0'}}])assert.throws(()=>snapshotWeChatLauncherPatchConfig({directoryText:'C:\\Original',pathEncoding:'ascii',patchSourceProfile:'configured-only',routes:[{...fixture.route,...change}]}));
  }finally{await fixture.close();}
});
test('native resource source failure makes one request and abort/cancel cannot resurrect a candidate',async()=>{
  const fixture=await weChatPatchFixture('create-deflate');
  try{fixture.upstream.set('/cg50/Update.TXT',{status:503});const loader=createWeChatLauncherPatchPreparer({wx:fixture.native.wx,routes:[fixture.route]});
    await code(loader.prepare(fixture.input()),'HTTP_STATUS');assert.equal(fixture.native.stats.requests.length,1);
    const control=createWeChatAbortController();control.abort();await code(loader.prepare(fixture.input({signal:control.signal})),'GAME_PATCH_ABORTED');assert.equal(fixture.native.stats.requests.length,1);
  }finally{await fixture.close();}
});

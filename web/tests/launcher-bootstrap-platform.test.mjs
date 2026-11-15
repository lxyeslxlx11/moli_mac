import test from 'node:test';
import assert from 'node:assert/strict';
import { createWin32LauncherBootstrap } from '../launcher-bootstrap.mjs';
import { createWeChatAbortController,weChatSignal } from '../../adapters/wechat/launcher-control.mjs';
import { decodeLauncherCatalogText } from '../../shared/launcher-catalog-text.mjs';
import { createLauncherHttpFixtureServer } from './helpers/launcher-http-fixture.mjs';
import { createLauncherBootstrapFixture } from './helpers/launcher-bootstrap-fixture.mjs';
import { createGamePatchFixture } from './helpers/launcher-game-patch-fixture.mjs';
const input=()=>({launcherBytes:Uint8Array.of(65),gameListBytes:null,regionListBytes:null,
  endpoints:Object.fromEntries(['launcherDigest','updateLocator','catalogDigests','gameList','regionList'].map(name=>[name,'https://fixture.invalid/'+name])),encoding:'utf-8',allowBareAmpersands:false,timeoutMs:100});

test('bootstrap ports reject missing functions/accessors before HTTP work',()=>{
  const httpClient={getBytes(){throw Error('must not call');}};
  assert.throws(()=>createWin32LauncherBootstrap({httpClient,platform:{}}),error=>error.code==='BOOTSTRAP_INPUT');
  let read=false;assert.throws(()=>createWin32LauncherBootstrap({httpClient,platform:{get now(){read=true;throw Error();}}}));assert.equal(read,false);
});

test('bootstrap deadline rejects even when an injected cancellation provider throws, and clears its timer',async()=>{
  let time=0,fire,cleared=0,calls=0;const control=createWeChatAbortController();
  const platform={now:()=>time,setTimer(fn){fire=fn;return 1;},clearTimer(){cleared++;},
    createAbortController:()=>({signal:control.signal,abort(){throw Error('original injected cleanup failure');}}),readSignal:weChatSignal,
    decodeText:(bytes,encoding)=>decodeLauncherCatalogText(bytes,{encoding})};
  const loader=createWin32LauncherBootstrap({platform,httpClient:{getBytes(){calls++;return new Promise(()=>{});}}});
  const pending=loader.prepare(input());await Promise.resolve();time=100;assert.doesNotThrow(()=>fire());
  await assert.rejects(pending,error=>error.code==='BOOTSTRAP_TIMEOUT');assert.equal(cleared,1);assert.equal(calls,1);
});

test('all three browser HTTP/bootstrap/patch fixture owners serve the extracted ESM dependency',async()=>{
  for(const create of [createLauncherHttpFixtureServer,createLauncherBootstrapFixture,createGamePatchFixture]){
    const fixture=await create();try{
      const result=await fetch(fixture.origin+'/web/launcher-http-data.mjs');assert.equal(result.status,200);assert.match(result.headers.get('content-type'),/javascript/);
      const text=await result.text();assert.match(text,/export class LauncherHttpError/);
      const denied=await fetch(fixture.origin+'/web/not-allowed.mjs');assert.equal(denied.status,404);
    }finally{await fixture.close();}
  }
});

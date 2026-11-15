import test from 'node:test';
import assert from 'node:assert/strict';
import { createLauncherGamePatchPreparer } from '../../shared/launcher-game-patch.mjs';
import { decodeLauncherCatalogText } from '../../shared/launcher-catalog-text.mjs';
import { createWeChatAbortController,weChatSignal } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { weChatPatchFixture } from './helpers/wechat-patch-fixture.mjs';

test('pure patch total deadline rejects a provider that never settles and aborts its private signal',async()=>{
  const fixture=await weChatPatchFixture('create-deflate');let timer,signal,calls=0;
  const clock=createWeChatDeadlineClock({wallNow:()=>1000,setTimer(fn){timer=fn;return fn;},clearTimer(){}});
  try{const loader=createLauncherGamePatchPreparer({decodeText:(bytes,encoding)=>decodeLauncherCatalogText(bytes,{encoding}),now:clock.now,setTimer:clock.setTimer,clearTimer:clock.clearTimer,
    createAbortController:createWeChatAbortController,readSignal:weChatSignal,clientForSource:()=>({urlForPath:path=>'https://fixture.invalid'+path,
      getBytes(path,options){calls++;signal=options.signal;return new Promise(()=>{});}})});
    const pending=loader.prepare(fixture.input({timeoutMs:10}));await Promise.resolve();assert.equal(calls,1);timer();await assert.rejects(pending,error=>error.code==='GAME_PATCH_TIMEOUT');assert.equal(signal.aborted,true);
  }finally{await fixture.close();}
});
test('native preparer snapshots source routing, epoch and local files before first asynchronous transport',async()=>{
  const fixture=await weChatPatchFixture('create-deflate');
  try{const {createWeChatLauncherPatchPreparer}=await import('../../adapters/wechat/launcher-patch.mjs');const route=structuredClone(fixture.route),input=fixture.input();
    const loader=createWeChatLauncherPatchPreparer({wx:fixture.native.wx,routes:[route]}),pending=loader.prepare(input);route.source.address='changed.invalid';input.epochSeconds=2;input.gameOrdinal=1;input.files[0].bytes.fill(0);
    const result=await pending;assert.equal(result.gameOrdinal,undefined);assert.equal(result.binding.gameOrdinal,0);assert.equal(Buffer.from(result.candidate.files.find(row=>row.path==='keep.txt').bytes).toString(),'keep');
    assert.ok(fixture.native.stats.requests.every(path=>path.endsWith('=1234567890')));
  }finally{await fixture.close();}
});

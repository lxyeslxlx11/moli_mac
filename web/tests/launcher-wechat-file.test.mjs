import test from 'node:test';
import assert from 'node:assert/strict';
import { readWeChatLauncherFile } from '../../adapters/wechat/launcher-local-file.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { createWeChatDeadlineClock } from '../../adapters/wechat/launcher-clock.mjs';
import { weChatFileFixture, WECHAT_LOCAL_LAUNCHER } from './helpers/wechat-http-fixture.mjs';
const code=(task,expected)=>assert.rejects(task,error=>error.code===expected);

test('WeChat chosen file uses bounded explicit read length, checks metadata twice and returns owned bytes without path',async()=>{
  const fixture=weChatFileFixture(),bytes=await readWeChatLauncherFile({wx:fixture.wx});
  assert.deepEqual(bytes,WECHAT_LOCAL_LAUNCHER);assert.notEqual(bytes,WECHAT_LOCAL_LAUNCHER);
  assert.equal(fixture.stats.picks,1);assert.equal(fixture.stats.statCalls,2);assert.deepEqual(fixture.stats.reads,[{position:0,length:WECHAT_LOCAL_LAUNCHER.length}]);
  assert.doesNotMatch(JSON.stringify(bytes),/original\/selected/);
});

test('file early cancellation/capability/size and shape gates do not proceed to read',async()=>{
  const fixture=weChatFileFixture(),control=createWeChatAbortController();control.abort();
  await code(readWeChatLauncherFile({wx:fixture.wx,signal:control.signal}),'FILE_ABORTED');assert.equal(fixture.stats.picks,0);
  await code(readWeChatLauncherFile({wx:{}}),'FILE_CAPABILITY');
  for(const size of [0,33554433,-1,1.5]) {
    const f=weChatFileFixture(undefined,{chooseMessageFile(options){options.success({tempFiles:[{path:'/original/fixture.exe',size}]});}});
    await code(readWeChatLauncherFile({wx:f.wx}),'FILE_SIZE');assert.equal(f.stats.reads.length,0);
  }
});

test('file read rejects a directory, truncated buffer, or changed post-read size and sanitizes platform errors',async()=>{
  for(const scenario of ['directory','truncated','changed','failure']){
    const fixture=weChatFileFixture();let stats=0;
    if(scenario==='directory')fixture.fs.stat=options=>options.success({stats:{size:WECHAT_LOCAL_LAUNCHER.length,isFile:()=>false}});
    if(scenario==='truncated')fixture.fs.readFile=options=>options.success({data:new ArrayBuffer(1)});
    if(scenario==='changed')fixture.fs.stat=options=>options.success({stats:{size:WECHAT_LOCAL_LAUNCHER.length+(++stats===2?1:0),isFile:()=>true}});
    if(scenario==='failure')fixture.fs.readFile=options=>options.fail({errMsg:'private path /original/do-not-log.exe'});
    await assert.rejects(readWeChatLauncherFile({wx:fixture.wx}),error=>{
      assert.equal(error.code,scenario==='failure'?'FILE_READ':'FILE_SIZE');assert.doesNotMatch(String(error),/do-not-log/);return true;
    });
  }
});

test('file cancel/timeout release the waiting operation; late native selection cannot start a read',async()=>{
  let chooser;const fixture=weChatFileFixture(undefined,{chooseMessageFile(options){chooser=options;}}),control=createWeChatAbortController();
  let pending=readWeChatLauncherFile({wx:fixture.wx,signal:control.signal});control.abort();await code(pending,'FILE_ABORTED');
  chooser.success({tempFiles:[{path:fixture.path,size:WECHAT_LOCAL_LAUNCHER.length}]});await Promise.resolve();assert.equal(fixture.stats.statCalls,0);
  let fire,wall=1000;const clock=createWeChatDeadlineClock({wallNow:()=>wall,setTimer(fn){fire=fn;return fn;},clearTimer(){}});
  pending=readWeChatLauncherFile({wx:fixture.wx,clock,timeoutMs:100});wall=0;fire();await code(pending,'FILE_TIMEOUT');assert.equal(clock.now(),100);
  chooser.success({tempFiles:[{path:fixture.path,size:WECHAT_LOCAL_LAUNCHER.length}]});await Promise.resolve();assert.equal(fixture.stats.statCalls,0);
});

test('file cancellation while a native read is pending cannot advance to post-read stat or return bytes',async()=>{
  const fixture=weChatFileFixture(),control=createWeChatAbortController();let pendingRead,ready;
  const entered=new Promise(resolve=>{ready=resolve;});fixture.fs.readFile=options=>{pendingRead=options;ready();};
  const pending=readWeChatLauncherFile({wx:fixture.wx,signal:control.signal});await entered;control.abort();await code(pending,'FILE_ABORTED');
  pendingRead.success({data:WECHAT_LOCAL_LAUNCHER.slice().buffer});await Promise.resolve();assert.equal(fixture.stats.statCalls,1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { createLocalLauncherPatchRelay } from '../../adapters/node/launcher-patch-relay.mjs';
import { inspectLauncherPatchResourcePath as inspect,snapshotLauncherPatchSource } from '../../shared/launcher-patch-route.mjs';
import { createGamePatchFixture } from './helpers/launcher-game-patch-fixture.mjs';

test('native resource path validator preserves root double slash and rejects target/query/path escapes',()=>{
  assert.equal(inspect('/cg50/Update.TXT?t=0').kind,'catalog');assert.equal(inspect('/cg50//root.bin.bz2?time=2147483647').kind,'package');
  for(const value of ['/elsewhere/a.bz2?time=1','/cg50/../a.bz2?time=1','/cg50/%2e%2e/a.bz2?time=1','/cg50/a.bz2?time=1&url=http://elsewhere',
    '/cg50/a.bz2?time=01','/cg50/a.bz2?time=2147483648','/cg50/a.bz2?t=1','/cg50/Update.TXT?time=1','/cg50/a.bz2?time=1#x'])assert.throws(()=>inspect(value));
  assert.throws(()=>snapshotLauncherPatchSource({address:'user@host',portText:'80'}));
});

test('actual fixed relay preserves original manifest/ZIP bytes and never forwards account headers',async()=>{
  const upstream=await createGamePatchFixture('create-deflate'),source={address:'127.0.0.1',portText:String(upstream.port)},seen=[];
  const relay=await createLocalLauncherPatchRelay({routes:[{id:'original',source}],fetchImpl:(url,options)=>{seen.push({url,options});return fetch(url,options);}});
  source.address='changed.invalid';try{
    const response=await fetch(relay.origin+'/moli-patch/v1/original/cg50/Update.TXT?t=12',{headers:{Cookie:'original-test-only',Authorization:'original-test-only'}});
    assert.equal(response.status,200);assert.deepEqual(new Uint8Array(await response.arrayBuffer()),upstream.scenario.manifestBytes);
    const zip=await fetch(relay.origin+'/moli-patch/v1/original/cg50/Bin/new.bin.bz2?time=12');assert.deepEqual(new Uint8Array(await zip.arrayBuffer()),upstream.scenario.archives[0].bytes);
    assert.equal(seen.length,2);assert.ok(seen.every(row=>row.url.startsWith(upstream.origin+'/cg50/')));
    assert.ok(seen.every(row=>row.options.credentials==='omit'&&row.options.redirect==='error'&&row.options.headers===undefined));
  }finally{await relay.close();await upstream.close();}
});

test('relay rejects method/origin/route/path before upstream, permits only explicit browser origin and does not follow redirects',async()=>{
  const upstream=await createGamePatchFixture('create-deflate'),relay=await createLocalLauncherPatchRelay({routes:[{id:'original',source:{address:'127.0.0.1',portText:String(upstream.port)}}],allowedBrowserOrigins:['http://127.0.0.1:12345']});
  try{
    const base=relay.origin+'/moli-patch/v1/original';
    assert.equal((await fetch(base+'/cg50/Update.TXT?t=1',{method:'POST'})).status,405);
    assert.equal((await fetch(base+'/cg50/Update.TXT?t=1',{headers:{Origin:'http://denied.invalid'}})).status,403);
    assert.equal((await fetch(relay.origin+'/moli-patch/v1/missing/cg50/Update.TXT?t=1')).status,404);
    assert.equal((await fetch(base+'/cg50/a.bz2?time=1&url=http://other.invalid')).status,400);assert.equal(upstream.requests.length,0);
    const allowed=await fetch(base+'/cg50/Update.TXT?t=1',{headers:{Origin:'http://127.0.0.1:12345'}});assert.equal(allowed.status,200);assert.equal(allowed.headers.get('access-control-allow-origin'),'http://127.0.0.1:12345');
    upstream.set('/cg50/Update.TXT',{status:302,headers:{Location:upstream.origin+'/cg50/Bin/new.bin.bz2'}});
    assert.equal((await fetch(base+'/cg50/Update.TXT?t=2')).status,502);assert.equal(upstream.requests.length,2);
  }finally{await relay.close();await upstream.close();}
});

test('relay client disconnect aborts its owned upstream byte operation',async()=>{
  let entered,aborted;const ready=new Promise(resolve=>{entered=resolve;}),stopped=new Promise(resolve=>{aborted=resolve;});
  const relay=await createLocalLauncherPatchRelay({routes:[{id:'original',source:{address:'fixture.invalid',portText:'80'}}],fetchImpl:(url,{signal})=>{entered();return new Promise((resolve,reject)=>{
    signal.addEventListener('abort',()=>{aborted();reject(Error('Original cancelled upstream'));},{once:true});});}});
  try{const request=httpRequest(relay.origin+'/moli-patch/v1/original/cg50/Update.TXT?t=1');request.on('error',()=>{});request.end();await ready;request.destroy();
    await Promise.race([stopped,new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Expected owned upstream cancellation')),1000);stopped.finally(()=>clearTimeout(timer));})]);
  }finally{await relay.close();}
});

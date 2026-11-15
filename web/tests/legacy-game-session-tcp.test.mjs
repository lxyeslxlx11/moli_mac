import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,copyFile,rm,readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { createConnection } from 'node:net';
import { createHash } from 'node:crypto';
import * as api from '../../shared/index.mjs';
import { createLegacyGameSession } from '../legacy-game-session.mjs';
import { createWeChatLegacyGameSession } from '../../adapters/wechat/legacy-game-session.mjs';
import { fakeWeChat } from './helpers/wechat-tcp-fixture.mjs';
import { credentials } from './helpers/legacy-game-session-fixture.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
const directory=new URL('../../analysis/game-session-runtime-v1/',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,directory)));
const [assets,scene,input]=await Promise.all([read('../game-resource-runtime-v1/original-vectors.json'),read('../game-legacy-scene-frame-v1/original-vectors.json'),read('../game-input-runtime-v1/original-vectors.json')]);
const sha=b=>createHash('sha256').update(b).digest('hex');
async function originalPeer(mode){const temp=await mkdtemp(join(tmpdir(),'moli-original-login-'));
 for(const[source,target]of [['original_peer.py','original_peer.py'],['original-vectors.json','original-vectors.json'],['../game-input-runtime-v1/original-vectors.json','scene-vectors.json'],['../game-legacy-message-v1/generate_vectors.py','wire_reference.py']])await copyFile(new URL(source,directory),join(temp,target));
 const child=spawn('python3',[join(temp,'original_peer.py'),mode],{stdio:['ignore','pipe','pipe']}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();let diagnostics='';child.stderr.on('data',b=>{diagnostics+=b;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});const port=JSON.parse((await iterator.next()).value).port;
 return{port,async receipt(){const row=await iterator.next();assert.equal(await exit,0,diagnostics);return JSON.parse(row.value);},async close(){lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
}
function tcpOpen(port){return()=>new Promise((resolve,reject)=>{const socket=createConnection({host:'127.0.0.1',port});socket.once('error',reject);socket.once('connect',()=>{const iterator=socket[Symbol.asyncIterator]();resolve({async read(){const next=await iterator.next();return next.done?null:new Uint8Array(next.value);},write(bytes){return new Promise((yes,no)=>socket.write(bytes,error=>error?no(error):yes()));},close(){socket.destroy();}});});});}
async function runScene(mode,platform){const peer=await originalPeer(mode),world=api.createLegacyGameWorldProtocol(),files=originalFiles(assets),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});let session,cut,runtime,frames=0,events=0,commands=0;const native=platform==='wechat'?fakeWeChat({native:true,loopbackPort:peer.port}):null;
 try{await library.initialize();const{graphics,animations}=library.catalogs();world.configureLocalMovement(graphics,scene.sourceContext);world.configureActorResources(8);world.configureActorFrames({graphics,animations,geometry:library.geometry,source:()=>scene.actorSource,initialPhase:0,deferImages:true});
  async function onPacket(packet){if(!packet.effect)return;events++;
   if(packet.effect.kind==='scene-transition'){const current=world.copyScene(),next=await library.readCut({checksumMode:current.checksumMode,resolvedSelector:current.resolvedSelector});world.configureSceneFrames({graphics,animations,cut:next,geometry:library.geometry,context:()=>({tileCenter:world.copyGameState().localMovement?.display??[2,3],drawPrimitives:false}),deferImages:true});cut?.close();cut=next;}
   if(events===scene.protocol.beforePlainHex.length){const ready=await session.ready;assert.equal(ready.state,'ready');runtime=api.createLegacyGameRuntime({world,initialTick:1000,initialCamera:[128,192]});runtime.move([256,48]);runtime.press(0);runtime.release(0);
    for(const row of input.worldFrames){const result=runtime.pump({tick:row.tick,runtime:scene.runtime,center:[160,120],width:320,height:240,input:input.context,graphicsMode:2,forceRender:false});assert.equal(result.error,null);const pixels=await library.startRender(result.frame.sceneLayer.drawPlan).done;assert.equal(sha(pixels.rgba),row.scene.rgbaSha256);frames++;if(result.requests.length){commands+=result.requests.length;await session.sendCommands(result.requests);}}
   }
  }
  const base={sourceProfile:'legacy-se6000-37c4',world,...credentials(),pollMilliseconds:1,onPacket};
  session=platform==='wechat'?createWeChatLegacyGameSession({...base,wx:native.wx,endpoint:{address:'fixture.invalid',port:12345}}):createLegacyGameSession({...base,endpoint:{address:'127.0.0.1',port:peer.port},openStream:tcpOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController()});
  const ready=session.start(),done=await session.done;const sourceReady=await ready;assert.equal(sourceReady.state,'ready',JSON.stringify({code:sourceReady.errorCode,reason:sourceReady.reason,io:sourceReady.io}));assert.equal(done.state,'closed');assert.equal(done.errorCode,null);assert.equal(done.sourceLoginComplete,true);assert.equal(frames,52);assert.equal(commands,2);assert.deepEqual(world.copyLocalMovement().position,[384,256]);assert.equal(world.copyLocalMovement().frames,52);assert.equal(world.inspect().state,'open');assert.equal(done.io.writes,3);assert.equal(done.io.closeCalls,1);assert.equal(done.pendingWriteBytes,0);assert.equal(done.login.credentialsCleared,true);
  const receipt=await peer.receipt();assert.equal(receipt.authentication_request_verified,true);assert.equal(receipt.movement_requests_verified,2);assert.equal(receipt.authentication_requests,1);if(native){assert.equal(native.stats.created,1);assert.equal(native.stats.closed,1);assert.equal(native.stats.entropyRequests,0);assert.equal(native.sockets[0].listenerCount(),0);}
 }finally{session?.close();runtime?.close();world.close();cut?.close();library.close();files.close();await peer.close();}
}
test('actual original Python TCP validates auth then52 range-backed scene digests/two source movement writes',{timeout:18000},()=>runScene('success','generic'));
test('WeChat-shaped native TCP port ignores duplicate auth reply and verifies identical source scene/commands',{timeout:18000},()=>runScene('duplicate','wechat'));
test('actual original TCP busy reply closes without sending scene/commands or exposing reply bytes',{timeout:18000},async()=>{const peer=await originalPeer('busy'),world=api.createLegacyGameWorldProtocol();let session;
 try{session=createLegacyGameSession({sourceProfile:'legacy-se6000-37c4',world,...credentials(),endpoint:{address:'127.0.0.1',port:peer.port},openStream:tcpOpen(peer.port),clock:()=>Math.trunc(performance.now())>>>0,setTimer:setTimeout,clearTimer:clearTimeout,createControl:()=>new AbortController(),pollMilliseconds:1});const r=await session.start();assert.equal(r.errorCode,'LEGACY_LOGIN_REJECTED');assert.equal(r.login.statusWord,1234);assert.equal((await session.done).login.replyBytes,0);const receipt=await peer.receipt();assert.equal(receipt.rejected,true);assert.equal(receipt.movement_requests_verified,0);}finally{session?.close();world.close();await peer.close();}
});

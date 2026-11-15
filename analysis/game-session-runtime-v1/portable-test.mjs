/** Actual standalone game API with browser/Node networking, text, crypto and AbortController globals absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const code=readFileSync(new URL('../../build/wechat-game-stage165/game.js',import.meta.url),'utf8'),vectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const bytes=h=>new Uint8Array(Buffer.from(h,'hex')),ascii=s=>new Uint8Array(Buffer.from(s,'ascii'));
function instance(extra={}){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,
 crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined,...extra},{timeout:1500});return module.exports;}
const credentials=()=>({mappingBytes:ascii('gid:OriginalG glt:OriginalT\0'),moduleDigestBytes:ascii(vectors.authentication.moduleDigest)});
test('neutral actual game bundle reproduces all4315 independent login states without platform APIs',()=>{const api=instance();let states=0;for(const row of vectors.traces){const f=api.createLegacyGameLogin(credentials());try{f.start(row.origin);f.connected();for(let i=0;i<row.events.length;i++){const e=row.events[i];if(e.action==='bootstrap')f.bootstrap()?.arguments.forEach(b=>b.fill(0));else if(e.action==='reply')f.observeReply(e.status,bytes(e.detailHex));else f.poll(e.tick);const actual=f.inspect();for(const[k,v]of Object.entries(row.expected[i]))if(k!=='ignored')assert.equal(actual[k],v);states++;}}finally{f.close();}}assert.equal(states,4315);});
test('actual bundled WeChat game session authenticates through native-shaped ports without browser/Abort globals',async()=>{
 const api=instance(),listeners={},writes=[];let closed=0,wall=0;
 const socket={connect(){queueMicrotask(()=>{listeners.Connect();listeners.Message({message:api.encodeLegacyGameEnvelope(bytes(vectors.wire.bootstrap.payloadHex)).buffer});});},
  write(raw){writes.push(new Uint8Array(raw).slice());assert.equal(Buffer.from(new Uint8Array(raw)).toString('hex'),vectors.wire.authFrameHex);queueMicrotask(()=>listeners.Message({message:bytes(vectors.wire.replies.success.frameHex).buffer}));},close(){closed++;}};
 for(const key of ['Connect','Message','Error','Close']){socket['on'+key]=fn=>{listeners[key]=fn;};socket['off'+key]=fn=>{if(listeners[key]===fn)delete listeners[key];};}
 const world=api.createLegacyGameWorldProtocol(),session=api.createWeChatLegacyGameSession({sourceProfile:'legacy-se6000-37c4',world,...credentials(),endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,
  wx:{createTCPSocket:()=>socket},wallNow:()=>wall,setTimer(fn,delay){return setTimeout(()=>{wall+=delay;fn();},1);},clearTimer:clearTimeout});
 try{const r=await session.start();assert.equal(r.state,'ready');assert.equal(r.sourceLoginComplete,true);assert.equal(r.officialAuthentication,'unverified');assert.equal(writes.length,1);session.close();assert.equal((await session.done).state,'closed');assert.equal(closed,1);assert.equal(Object.keys(listeners).length,0);assert.equal(world.inspect().state,'open');}finally{session.close();world.close();}
});

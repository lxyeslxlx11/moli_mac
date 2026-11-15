/** Actual standalone game API without browser/Node platform globals; injected native-shaped ports are explicit. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { contentGraphics } from './original_assets.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage166/game.js',import.meta.url),'utf8'),v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const b=h=>new Uint8Array(Buffer.from(h,'hex')),a=s=>new Uint8Array(Buffer.from(s,'ascii')),hex=x=>Buffer.from(x).toString('hex');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,
 crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const credentials=()=>({mappingBytes:a('gid:OriginalG glt:OriginalT\0'),moduleDigestBytes:a(v.authentication.moduleDigest)});
test('neutral actual bundle reproduces211native record cases/1566policies/1128preview mutations without platform APIs',()=>{
 const api=instance();for(const row of v.records){const r=api.decodeLegacyGameCharacterList(b(row.bodyHex));assert.deepEqual([...r.records].map(hex),row.expected.records);r.records.forEach(x=>x.fill(0));}
 for(const row of v.policies)assert.deepEqual(JSON.parse(JSON.stringify(api.legacyGameCharacterPolicy(row.category,row.generation))),row.expected);
 for(const row of v.previews){const r=api.prepareLegacyGameCharacterPreview(b(row.recordHex));assert.equal(hex(r.recordBytes),row.expected.recordHex);assert.equal(r.normalizedCode,row.expected.normalizedCode);r.recordBytes.fill(0);}
 const graphics=contentGraphics(api,4),flow=api.createLegacyGameCharacterFlow({graphics});try{flow.begin();flow.advance(0);assert.equal(flow.advance(0).commands[0].operationId,'send-004f86e0');flow.observe('receive-00567c20',[8]);flow.observe('receive-00567c3c',[0,b(v.flow.bodyHex)]);for(let i=0;i<4;i++)flow.advance(i);assert.equal(flow.inspect().state,'choosing');flow.select(1);flow.advance(5);assert.deepEqual([...flow.advance(6).commands[0].arguments],[502,2,33001]);flow.observe('receive-00567c40',[a('successful'),a('')]);assert.equal(flow.advance(7).snapshot.sourceEnterComplete,true);}finally{flow.close();graphics.close();}
});
test('actual bundled WeChat auth/list/second-slot entry/close works without Abort/DOM/Buffer globals and rejects foreign bundle capabilities',async()=>{
 const api=instance(),other=instance(),listeners={},writes=[];let wall=0,closed=0,created=0;
 const socket={connect(){queueMicrotask(()=>{listeners.Connect();listeners.Message({message:api.encodeLegacyGameEnvelope(b(v.bootstrap.payloadHex)).buffer});});},write(raw){const bytes=new Uint8Array(raw);writes.push(bytes.slice());
   const expected=[v.authFrameHex,v.flow.requests.list.frameHex,v.flow.requests.enter1.frameHex][writes.length-1];assert.equal(hex(bytes),expected);
   const packets=writes.length===1?[v.authReplyFrameHex]:writes.length===2?[v.flow.replies.category.frameHex,v.flow.replies.list.frameHex]:[v.flow.replies.entered.frameHex];queueMicrotask(()=>{for(const raw of packets)listeners.Message({message:b(raw).buffer});});
  },close(){closed++;}};
 for(const name of ['Connect','Message','Error','Close']){socket['on'+name]=fn=>{listeners[name]=fn;};socket['off'+name]=fn=>{if(listeners[name]===fn)delete listeners[name];};}
 const wx={createTCPSocket(){created++;return socket;}},graphics=contentGraphics(api,4),foreignWorld=other.createLegacyGameWorldProtocol();
 try{assert.throws(()=>other.createWeChatLegacyGameSession({sourceProfile:'legacy-se6000-37c4',world:foreignWorld,...credentials(),postLogin:{graphics},endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,wx,wallNow:()=>wall,setTimer:setTimeout,clearTimer:clearTimeout}));assert.equal(created,0);}finally{foreignWorld.close();}
 const world=api.createLegacyGameWorldProtocol(),session=api.createWeChatLegacyGameSession({sourceProfile:'legacy-se6000-37c4',world,...credentials(),postLogin:{graphics},endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,wx,wallNow:()=>wall,
  setTimer(fn,delay){return setTimeout(()=>{wall+=delay;fn();},1);},clearTimer:clearTimeout});
 try{assert.equal((await session.start()).sourceLoginComplete,true);assert.equal((await session.charactersReady).characters.state,'choosing');const r=await session.enterCharacter(1);assert.equal(r.sourceCharacterEntered,true);assert.equal(r.characters.selectedSlot,1);assert.equal(r.characters.nativeMainPhase,9);assert.equal(writes.length,3);assert.equal(world.copyScene(),null);session.close();assert.equal((await session.done).characters.presentSlots,0);assert.equal(closed,1);assert.equal(Object.keys(listeners).length,0);assert.equal(world.inspect().state,'open');assert.equal(api.detectLegacyGameCharacterContent(graphics),4);}finally{session.close();world.close();graphics.close();}
});

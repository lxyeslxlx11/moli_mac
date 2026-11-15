import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {clientEnter} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vectors as v,textFixture,enterText,sendText,checkTextFrame,sha,ascii,originalTextMask} from '../../web/tests/helpers/legacy-game-actor-text-fixture.mjs';
test('independent source byte widths and local/remote/NPC label selection, colors and signed-short centering',()=>{
 for(const r of v.widths)if(r.error)assert.throws(()=>api.measureLegacyGameText(new Uint8Array(Buffer.from(r.bytesHex,'hex')),r.font),e=>e.code===r.error);else assert.equal(api.measureLegacyGameText(new Uint8Array(Buffer.from(r.bytesHex,'hex')),r.font),r.expected);
 for(const r of v.labels)assert.deepEqual(api.planLegacyGameActorLabel(r.input),r.expected);
});
test('real owning client renders120 independent complete source scenes with raw Chinese labels, mode cycling and message updates',async()=>{
 const f=textFixture();try{await enterText(f);for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i))if(e.kind==='cycle')assert.equal(f.client.cycleLabels(),e.mode);else await sendText(f,e.plainHex);const e=v.full.frames[i],out=f.client.runtime().pump({...f.client.readFrame(),tick:e.tick});checkTextFrame(f.client,out,e);const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),e.rgbaSha256,'complete text scene '+(i+1));}}
 finally{f.close();}
});
test('strict text boundaries reject getters and unsupported color/font/dangling bytes, while preserving owned bytes',()=>{
 let reads=0;const r={...v.labels.find(r=>r.expected).input};Object.defineProperty(r,'screenX',{get(){reads++;return 0;}});assert.throws(()=>api.planLegacyGameActorLabel(r));assert.equal(reads,0);
 const raw=ascii('Hero'),batch=api.createLegacyGameTextBatch([{x:70000,y:-70000,font:1,color:129,bytes:raw}]);raw.fill(0);assert.deepEqual(batch.runs[0].bytes,[72,101,114,111]);assert.equal(batch.runs[0].x,4464);assert.ok(Object.isFrozen(batch.runs[0].bytes));
 for(const row of [{x:0,y:0,font:14,color:0,bytes:[]},{x:0,y:0,font:1,color:12,bytes:[]},{x:0,y:0,font:1,color:0,bytes:[],extra:1}])assert.throws(()=>api.createLegacyGameTextBatch([row]));
 assert.throws(()=>api.measureLegacyGameText(Uint8Array.of(0x81),1),e=>e.code==='LEGACY_TEXT_DANGLING_BYTE');
});
test('native lane0 keeps insertion order, black shadow flag80 and alpha-mask clipping independently of image priority',async()=>{
 const f=textFixture();try{await clientEnter(f);const colors=new Uint8Array(768);colors.set([13,31,61],3);colors.set([97,127,151],6);colors.set([173,193,223],9);const palette=api.createLegacyGamePalette32(colors,'explicit-rgb'),sprites=new Map();
  const sprite=index=>{if(sprites.has(index))return sprites.get(index);const g=f.client.library().geometry({kind:'index',value:index}),raw=new Uint8Array(16+g.width*g.height),d=new DataView(raw.buffer);raw.set([82,68]);d.setInt32(4,g.width,true);d.setInt32(8,g.height,true);d.setUint32(12,raw.length,true);raw.set(Uint8Array.from({length:g.width*g.height},(_,i)=>(i+index)%5===0?0:1+(i+index)%3),16);const image=api.decodeLegacyGameRD(raw);try{const s=api.prepareLegacyGameSprite(image,palette);sprites.set(index,s);return s;}finally{image.close();}};
  try{for(const r of v.rasterCases){const commands=r.commands.map(({index,...c})=>({...c,sprite:sprite(index)})),out=api.composeLegacyGameTextFrame(r.width,r.height,commands,api.createLegacyGameTextBatch(r.runs),originalTextMask);assert.equal(sha(out.rgba),r.expected.rgbaSha256);}}
  finally{for(const s of sprites.values())s.close();palette.close();}
 }finally{f.close();}
});

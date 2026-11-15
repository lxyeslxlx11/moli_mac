import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientFixture,clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vectors as v,textFixture,enterText,sendText,textController,ascii,sha,originalTextMask} from '../../web/tests/helpers/legacy-game-actor-text-fixture.mjs';
const raw=h=>new Uint8Array(Buffer.from(h,'hex')),label=out=>out.actors.find(a=>a.local).label,run=(s='AB')=>({x:5,y:4,font:1,color:0,bytes:ascii(s)}),
 plan=(runs=[run()])=>api.createLegacyGameDrawPlan(64,32,[],api.createLegacyGameTextBatch(runs)),action=(id,code,p=0)=>`${id}|2|3|${code}|0|${p}|0|0`,
 unit=(id,x=2,more={})=>[more.category??3,id,x,3,0,more.resource??80002,0,0,'Name',more.composite??'Title',0,0,0,'Tail',0,0,''].join('|');
async function withController(fn,options){const f=textFixture();try{await clientEnter(f);const c=textController(f,options);try{await fn(c,f);}finally{c.close();}}finally{f.close();}}
test('Hr] catalog keeps48 raw rows, source missing negatives, inner escapes, extra tokens and owned bytes',()=>{
 const b=ascii('A\\zB|99|7|Second|1|9|'+'X'.repeat(20)+'|-1|8'),d=api.decodeLegacyGameActorLabelList(b);b.fill(0);
 assert.equal(d.records.length,48);assert.deepEqual(d.records[0],{code:99,value:7,labelBytes:ascii('A|B')});assert.deepEqual(d.records[1],{code:1,value:9,labelBytes:ascii('Second')});
 for(const r of d.records.slice(2))assert.deepEqual(r,{code:-1,value:-1,labelBytes:new Uint8Array()});
 const many=Array.from({length:48},()=>['A','1','2']).flat().concat(['extra','extra']).join('|');assert.equal(api.decodeLegacyGameActorLabelList(ascii(many)).extraTokens,2);
});
test('positive catalog rows enforce the actual19-byte storage boundary atomically before replacing the owner',()=>{
 const a=api.createLegacyGameActors();try{a.applyLabelList(ascii('A|1|3'));const before=a.copyState().labelCatalog;
  assert.equal(api.decodeLegacyGameActorLabelList(ascii('X'.repeat(19)+'|1|2')).records[0].labelBytes.length,19);
  assert.throws(()=>a.applyLabelList(ascii('B|1|4|'+'X'.repeat(20)+'|1|2')),e=>e.code==='LEGACY_TEXT_LABEL_ROW_BUDGET');assert.deepEqual(a.copyState().labelCatalog,before);
  const copy=a.copyState();copy.labelCatalog.records[0].labelBytes.fill(0);assert.deepEqual(a.copyState().labelCatalog.records[0].labelBytes,ascii('A'));
 }finally{a.close();}
});
test('real Hr] single argument and E(9 field28 select the unsorted raw catalog rather than a sorted copy',async()=>{
 const f=textFixture();try{await enterText(f);await sendText(f,Buffer.from('Hr] First|99|9|Hero|1|2 ','ascii').toString('hex'));
  // Encode the evidenced field28 mask, rather than assigning a world field.
  const mask=Buffer.from(api.encodeLegacyGameInteger(0x10000000)).toString('ascii');await sendText(f,Buffer.from(`E(9 ${mask}|1 `,'ascii').toString('hex'));
  f.client.setLabelMode(3);const out=f.client.runtime().pump({...f.client.readFrame(),tick:1000});assert.equal(out.error,null);assert.deepEqual(label(out.frame.actorLayer).bytes,[72,101,114,111]);assert.equal(f.client.copyWorldState().actors.labelCatalog.records[0].code,99);
 }finally{f.close();}
});
test('invalid selected catalog indices fail only when ordinary local mode3 actually consumes them',()=>withController(c=>{
 c.a.observeLabelSelection(-1);assert.ok(label(c.frame.step(c.request,1,2)));assert.throws(()=>c.frame.step(c.request,1,3),e=>e.code==='LEGACY_ACTOR_LABEL_SELECTION_UNSUPPORTED');assert.equal(c.frame.inspect().players,0);
}));
test('local label2/3 globals survive body reconstruction and over-cap replacements retain previous source bytes',()=>withController(c=>{
 const first=label(c.frame.step(c.request,1,4)).bytes,next=label(c.frame.step(c.request,1,5)).bytes;c.a.beginScene([6,4],true);c.frame.synchronize();assert.deepEqual(label(c.frame.step(c.request,1,4)).bytes,first);assert.deepEqual(label(c.frame.step(c.request,1,5)).bytes,next);
 c.a.applyUnits(ascii(unit('1C',6,{category:1,resource:100010,composite:'Guild\\z'+'X'.repeat(33)+'\\z'+'Y'.repeat(33)})));assert.deepEqual(label(c.frame.step(c.request,1,4)).bytes,first);assert.deepEqual(label(c.frame.step(c.request,1,5)).bytes,next);
}));
test('unreceived selected row is an empty queued run and NPC resource0 still displays its ordinary name',()=>withController(c=>{
 const out=c.frame.step(c.request,1,3);assert.deepEqual(label(out).bytes,[]);assert.ok(out.drawPlan.text.runs.some(r=>r.actorId===100));c.a.applyUnits(ascii(unit('84',5,{resource:0,composite:''})));const next=c.frame.step(c.request,1,1),npc=next.actors.find(a=>a.id===500);assert.deepEqual(npc.label.bytes,[78,97,109,101]);assert.equal(npc.animation.graphicIndex,0);
}));
test('duplicate graphic callbacks retain queued names while outside-range removal skips labels and releases owners',()=>withController(c=>{
 c.a.remove(ascii('3e,4Q,6s'));c.a.applyUnits(ascii('3e|2|3|80002|0|Object|0\t4Q|2|3|80002|0|Object|0\t84|20|3|80002|0|Object|0'));
 c.a.applyUnits(ascii([unit('3e'),unit('4Q'),unit('84',20)].join('\t')));const out=c.frame.step(c.request,1,1),dup=out.actors.find(a=>a.id===300),far=out.actors.find(a=>a.id===500);
 assert.equal(dup.reason,'duplicate-graphic-cell');assert.deepEqual(dup.label.bytes,[84,105,116,108,101]);assert.ok(out.drawPlan.text.runs.some(r=>r.actorId===300));assert.equal(far.reason,'outside-local-range');assert.equal(far.label,undefined);assert.ok(!out.drawPlan.text.runs.some(r=>r.actorId===500));assert.ok(!c.a.copyState().remoteActors.some(r=>r.id===500));
}));
test('declared resource1 suppresses only the root after ordinary names were queued',async()=>{
 const f=textFixture(),index=v.full.frames[0].actors[0].graphicIndex,info=f.files.files.get('bin/graphicinfo.bin'),d=new DataView(info.buffer,info.byteOffset,info.byteLength);let found=0;
 for(let at=0;at<info.length;at+=40)if(d.getUint32(at,true)===index){d.setUint32(at+36,1,true);found++;}assert.equal(found,1);
 try{await clientEnter(f);const c=textController(f);try{c.a.remove(ascii('6s'));const out=c.frame.step(c.request,1,1);assert.ok(!out.submittedActorIds.includes(100));assert.ok(out.drawPlan.text.runs.some(r=>r.actorId===100));}finally{c.close();}}finally{f.close();}
});
test('ordinary mounted names stay at the unshifted parent screen; ride and spin handlers skip ordinary names',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',70,100007)));let out=c.frame.step(c.request,1,1);assert.equal(label(out),undefined);for(let i=0;i<35;i++)out=c.frame.step(c.request,1,1);assert.equal(c.a.copyLocalActor().ride.state,0);assert.equal(out.actors.find(a=>a.local).handler,'source-mounted');assert.equal(label(out).y,22);
 c.a.applyActions(ascii(action('1C',80,114001)));out=c.frame.step(c.request,1,1);assert.equal(label(out),undefined);assert.ok(!out.drawPlan.text.runs.some(r=>r.actorId===100));
}));
test('mode0 is explicit per-client state; cycling produces no protocol request and is limited to active gameplay',async()=>{
 const f=clientFixture();try{assert.throws(()=>f.client.cycleLabels());await clientEnter(f);assert.equal(f.client.inspect().actorLabelMode,0);const before=f.writes.length;
  for(let i=1;i<=6;i++)assert.equal(f.client.cycleLabels(),i%6);assert.equal(f.writes.length,before);for(const value of [-1,6,true,1.2])assert.throws(()=>f.client.setLabelMode(value));f.client.pause();assert.equal(f.client.setLabelMode(2),2);f.client.close();assert.throws(()=>f.client.cycleLabels());
 }finally{f.close();}
});
test('even an empty text record reserves one global command slot, without requiring a glyph backend',async()=>{
 const c={image:{index:1002,paletteSelector:0,flags:0,color:0xffffffff},x:0,y:0,priority:10},rows=Array.from({length:4096},()=>c),empty=api.createLegacyGameTextBatch([{...run(),bytes:[]}]);
 assert.equal(api.createLegacyGameDrawPlan(1,1,rows).commands.length,4096);assert.equal(api.createLegacyGameDrawPlan(1,1,rows,api.createLegacyGameTextBatch([])).commands.length,4096);assert.throws(()=>api.createLegacyGameDrawPlan(1,1,rows,empty));assert.equal(api.createLegacyGameDrawPlan(1,1,rows.slice(1),empty).commands.length,4095);
 const f=clientFixture();try{await clientEnter(f);const out=await f.client.library().startRender(plan([{...run(),bytes:[]}])).done;assert.equal(out.textRuns,1);assert.equal(out.rgba.some(n=>n!==0),false);assert.equal(f.client.library().inspect().stats.textMasks,undefined);}finally{f.close();}
});
test('missing and malformed glyph providers fail rather than substituting pixels or reading mask getters',async()=>{
 const f=clientFixture();try{await clientEnter(f);await assert.rejects(f.client.library().startRender(plan()).done,e=>e.code==='LEGACY_ASSET_TEXT_PORT_REQUIRED');}finally{f.close();}
 let reads=0;const f2=textFixture({rasterText(){return {width:1,height:1,originX:0,originY:0,get alpha(){reads++;return Uint8Array.of(255);}};}});try{await enterText(f2);await assert.rejects(f2.client.library().startRender(plan()).done);assert.equal(reads,0);}finally{f2.close();}
});
test('one asynchronous mask acquisition serves repeated source runs and borrowed alpha bytes remain owned by the provider',async()=>{
 let calls=0;const alpha=Uint8Array.of(64,255),f=textFixture({async rasterText(){calls++;return {width:2,height:1,originX:0,originY:0,alpha};}});try{await enterText(f);const p=plan([run(),{...run(),x:20}]),out=await f.client.library().startRender(p).done;assert.equal(out.textRuns,2);assert.equal(calls,1);assert.deepEqual(alpha,Uint8Array.of(64,255));assert.equal(f.client.library().inspect().stats.textMasks,1);out.rgba.fill(0);assert.ok((await f.client.library().startRender(p).done).rgba.some(n=>n>0));}finally{f.close();}
});
test('cancelling a pending glyph acquisition cannot present stale pixels and permits a new render',async()=>{
 let release,hold=true;const alpha=Uint8Array.of(255),mask={width:1,height:1,originX:0,originY:0,alpha},f=textFixture({rasterText(){return hold?new Promise(resolve=>{release=resolve;}):mask;}});try{await enterText(f);const job=f.client.library().startRender(plan());while(!release)await new Promise(resolve=>setImmediate(resolve));assert.throws(()=>f.client.library().startRender(plan()),e=>e.code==='LEGACY_ASSET_RENDER_BUSY');job.cancel();const failed=assert.rejects(job.done,e=>e.code==='LEGACY_ASSET_CANCELLED');release(mask);await failed;assert.equal(f.client.library().inspect().rendering,false);assert.deepEqual(alpha,Uint8Array.of(255));hold=false;assert.ok((await f.client.library().startRender(plan()).done).rgba.some(n=>n>0));}finally{f.close();}
});
test('closing during a glyph callback closes all owners and sanitizes external provider failures',async()=>{
 let f;f=textFixture({rasterText(){f.client.close();return {width:1,height:1,originX:0,originY:0,alpha:Uint8Array.of(255)};}});try{await enterText(f);await assert.rejects(f.client.library().startRender(plan()).done,e=>['LEGACY_ASSET_CLOSED','LEGACY_ASSET_CANCELLED'].includes(e.code));assert.equal((await f.client.done).cleanupErrors,0);}finally{f.close();}
 const bad=textFixture({rasterText(){throw Error('private provider detail');}});try{await enterText(bad);await assert.rejects(bad.client.library().startRender(plan()).done,e=>e.code==='LEGACY_ASSET_TEXT_FAILED'&&!e.message.includes('private'));}finally{bad.close();}
});
test('direct text compositor rejects image command getters before invoking a glyph provider',()=>{
 let reads=0,ports=0;const c={sprite:null,x:0,y:0,get priority(){reads++;return 210;}};assert.throws(()=>api.composeLegacyGameTextFrame(2,2,[c],api.createLegacyGameTextBatch([run()]),()=>{ports++;}));assert.equal(reads,0);assert.equal(ports,0);
});
test('prepared-sprite and deferred image paths agree with labels over12 changing source frames',()=>withController(async(c,f)=>{
 const rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map(),catalogs=f.client.library().catalogs();
 const sprite=({index})=>{if(!sprites.has(index)){const g=f.client.library().geometry({kind:'index',value:index}),raw=new Uint8Array(16+g.width*g.height),d=new DataView(raw.buffer);raw.set([82,68]);d.setInt32(4,g.width,true);d.setInt32(8,g.height,true);d.setUint32(12,raw.length,true);raw.set(Uint8Array.from({length:g.width*g.height},(_,i)=>(i+index)%5===0?0:1+(i+index)%3),16);const image=api.decodeLegacyGameRD(raw);try{sprites.set(index,api.prepareLegacyGameSprite(image,palette));}finally{image.close();}}return sprites.get(index);};
 const direct=createLegacyGameActorFrameController(c.a,{graphics:catalogs.graphics,animations:catalogs.animations,source:()=>scene.actorSource,geometry:q=>f.client.library().geometry(q),sprite,rasterText:originalTextMask,initialPhase:0,bindActorSource:true});
 try{for(let i=0;i<12;i++){const mode=1+i%5,deferred=c.frame.step(c.request,1,mode),prepared=direct.step(c.request,1,mode),image=await f.client.library().startRender(deferred.drawPlan).done;assert.equal(sha(prepared.rgba),sha(image.rgba));assert.deepEqual(prepared.submittedActorIds,deferred.submittedActorIds);}}
 finally{direct.close();for(const s of sprites.values())s.close();palette.close();}
}));

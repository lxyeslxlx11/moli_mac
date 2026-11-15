import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {scene,clientEnter} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vitalsFixture,enterVitals,textController,originalTextMask,ascii,sha} from '../../web/tests/helpers/legacy-game-actor-vitals-fixture.mjs';
async function withController(fn){const f=vitalsFixture();try{await clientEnter(f);const c=textController(f);try{await fn(c,f);}finally{c.close();}}finally{f.close();}}
const action=(id,code,p=0)=>`${id}|2|3|${code}|0|${p}|0|0`,unit=id=>`1|${id}|2|3|0|100010|0|0|Hero|Guild|0|0|0|Tail|0|0|`;
test('ordinary member data refresh happens even with hidden bars, but spin/gates skip the source hook',()=>withController(c=>{
 c.a.observeVitals([1,2,3,4]);c.frame.step(c.request,1,0,false);assert.deepEqual(c.a.copyLocalActor().vitals,[1,2,3,4]);c.a.observeVitals([5,6,7,8]);c.a.applyActions(ascii(action('1C',80,114001)));const out=c.frame.step(c.request,1,0,true);assert.equal(out.actors.find(a=>a.local).vitals,undefined);assert.deepEqual(c.a.copyLocalActor().vitals,[1,2,3,4]);assert.ok(!c.frame.copySceneOverlays().some(r=>r.id===100));
}));
test('resource1 root filtering preserves already queued ordinary global value overlays',async()=>{
 const f=vitalsFixture(),info=f.files.files.get('bin/graphicinfo.bin'),d=new DataView(info.buffer,info.byteOffset,info.byteLength);for(let at=0;at<info.length;at+=40)if(d.getUint32(at,true)===1002)d.setUint32(at+36,1,true);
 try{await clientEnter(f);const c=textController(f);try{c.a.remove(ascii('6s'));c.a.observeVitals([1,2,3,4]);const out=c.frame.step(c.request,1,0,true);assert.equal(out.submittedActorIds.filter(id=>id===100).length,3);assert.equal(c.frame.copySceneOverlays().filter(r=>r.id===100).length,3);assert.ok(out.drawPlan.commands.every(r=>r.priority===207));}finally{c.close();}}finally{f.close();}
});
test('duplicate graphic callbacks retain member bars while outside-range removal skips them and clears party body references',()=>withController(c=>{
 c.a.remove(ascii('3e,4Q,6s'));c.a.observeVitals([50,100,50,100]);c.a.applyUnits(ascii('3e|2|3|80002|0|Object|0\t4Q|2|3|80002|0|Object|0\t84|20|3|80002|0|Object|0'));
 c.a.applyUnits(ascii(['3e','4Q','84'].map((id,i)=>`3|${id}|${i===2?20:2}|3|0|80002|0|0|Name|Title|0|0|0|Tail|0|0|`).join('\t')));for(const [slot,id]of [[1,200],[2,300],[3,500]])c.a.applyParty(slot,ascii(`1|${id}|7|8|9|10|Member`));c.a.applyValues(ascii('3e|50|100|50|100|4Q|50|100|50|100|84|50|100|50|100'));
 const out=c.frame.step(c.request,1,0,true),duplicate=out.actors.find(a=>a.id===300),far=out.actors.find(a=>a.id===500);assert.equal(duplicate.reason,'duplicate-graphic-cell');assert.equal(duplicate.vitals.overlays.length,3);assert.equal(c.frame.copySceneOverlays().filter(r=>r.id===300).length,3);assert.equal(far.reason,'outside-local-range');assert.equal(far.vitals,undefined);assert.ok(!c.frame.copySceneOverlays().some(r=>r.id===500));assert.equal(c.a.copyState().party.rows[3].bound,false);
}));
test('generic int32 destinations remain distinct from signed-short actor anchors through the resource job',async()=>{
 const f=vitalsFixture();try{await enterVitals(f);const row={image:{index:1602,paletteSelector:0,flags:4,color:0xffffffff},x:65536,y:0,priority:207},short=await f.client.library().startRender(api.createLegacyGameDrawPlan(64,32,[row])).done,wide=await f.client.library().startRender(api.createLegacyGameDrawPlan(64,32,[{...row,coordinateMode:'int32'}],api.createLegacyGameTextBatch([{x:0,y:0,font:1,color:0,bytes:[]}]))).done;
  assert.ok(short.rgba.some(n=>n>0));assert.ok(wide.rgba.every(n=>n===0));assert.throws(()=>api.createLegacyGameDrawPlan(1,1,[{...row,coordinateMode:'arbitrary'}]));
 }finally{f.close();}
});
test('prepared and deferred paths agree for neutral source bars, cropped fills, source labels and12 changing frames',()=>withController(async(c,f)=>{
 c.a.observeVitals([50,100,75,100]);c.a.applyParty(1,ascii('1|200|7|8|9|10|Member'));c.a.applyValues(ascii('3e|25|100|50|100'));const catalogs=f.client.library().catalogs(),path=api.createLegacyGameResourcePlan(f.material.resourceParameters).palette,cgp=api.decodeLegacyGameCGP(f.files.files.get(path.toLowerCase())),rgb=cgp.copyOriginalRGB(),neutral=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map();rgb.fill(0);cgp.close();
 const sprite=({index,flags})=>{const key=index+':'+(flags&4);if(!sprites.has(key)){const g=catalogs.graphics.imageAt(index),raw=f.files.files.get('bin/graphic.bin').subarray(g.byteOffset,g.byteOffset+g.byteLength),image=api.decodeLegacyGameRD(raw);try{sprites.set(key,api.prepareLegacyGameSprite(image,flags&4?neutral:catalogs.palette));}finally{image.close();}}return sprites.get(key);};
 const direct=createLegacyGameActorFrameController(c.a,{animations:catalogs.animations,graphics:catalogs.graphics,source:()=>scene.actorSource,geometry:q=>f.client.library().geometry(q),sprite,rasterText:originalTextMask,initialPhase:0,bindActorSource:true});
 try{for(let i=0;i<12;i++){const mode=1+i%5,bars=i%3!==0;if(i===5)c.a.observeVitals([-100,100,50,0]);const d=c.frame.step(c.request,1,mode,bars),p=direct.step(c.request,1,mode,bars),image=await f.client.library().startRender(d.drawPlan).done;assert.equal(sha(p.rgba),sha(image.rgba));assert.deepEqual(p.submittedActorIds,d.submittedActorIds);}}
 finally{direct.close();for(const p of sprites.values())p.close();neutral.close();}
}));
test('source global overlays take slots before later root composites and share the optional text slot at4095',()=>withController(async(c,f)=>{
 c.a.remove(ascii('3e,4Q,6s'));c.a.observeVitals([50,100,50,100]);const encode=n=>Buffer.from(api.encodeLegacyGameInteger(n)).toString('ascii'),ids=Array.from({length:1000},(_,i)=>1000+i);
 for(let i=0;i<ids.length;i+=40)c.a.applyUnits(ascii(ids.slice(i,i+40).map(id=>unit(encode(id))).join('\t')));
 for(const id of ids)c.a.applyParty(1,ascii(`1|${id}|7|8|9|10|Member`));
 for(let i=0;i<ids.length;i+=5)c.a.applyValues(ascii(ids.slice(i,i+5).map(id=>`${encode(id)}|50|100|50|100`).join('|')));
 for(let i=0;i<ids.length;i+=30)c.a.applyActions(ascii(ids.slice(i,i+30).flatMap(id=>[action(encode(id),45,1),action(encode(id),47)]).join(',')));
 const out=c.frame.step(c.request,1,1,true);assert.equal(c.frame.copySceneOverlays().length,3003);assert.equal(out.drawPlan.commands.length,4095);assert.equal(out.drawPlan.text.runs.length,1001);assert.ok(out.drawPlan.commands.slice(0,3003).every(r=>r.priority===207));assert.ok(out.drawPlan.commands.slice(3003).every(r=>r.priority===10));const rendered=await f.client.library().startRender(out.drawPlan).done;assert.equal(rendered.rgba.length,307200);
}));
test('invalid party slots and value getters cannot partially replace actor or party state',()=>{
 const a=api.createLegacyGameActors();try{const before=a.copyState();assert.throws(()=>a.applyParty(5,ascii('1|100|1|2|3|4|Bad')));assert.deepEqual(a.copyState(),before);let reads=0;const values=[1,2,3,4];Object.defineProperty(values,0,{get(){reads++;return 5;}});assert.throws(()=>a.observeVitals(values));assert.equal(reads,0);assert.deepEqual(a.copyState(),before);}finally{a.close();}
});

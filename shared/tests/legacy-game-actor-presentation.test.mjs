import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vectors as v,ascii,sha,unit,action,presentationFixture,enterPresentation,send,checkPresentationFrame} from '../../web/tests/helpers/legacy-game-actor-presentation-fixture.mjs';
function controller(f,options={}){const a=api.createLegacyGameActors();a.prepareCharacterEntry();a.configureResources(8);a.configureSceneMode(1);a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,100);a.applyUnits(ascii(unit()+'\t'+unit('3e',2,100010,71)));const c=f.client.library().catalogs();
 const frame=createLegacyGameActorFrameController(a,{graphics:c.graphics,animations:c.animations,source:()=>({...scene.actorSource,...options.source?.()}),geometry:(q,actor)=>options.geometry?options.geometry(q,actor,a,f.client.library()):f.client.library().geometry(q),initialPhase:0,deferImages:true,bindActorSource:true});
 return {a,frame,request:{tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240},close(){frame.close();a.close();}};}
async function withController(fn,options){const f=presentationFixture();try{await clientEnter(f);const c=controller(f,options);try{await fn(c,f);}finally{c.close();}}finally{f.close();}}
const local=out=>out.actors.find(a=>a.local),icon=(out,kind)=>local(out).presentation.icons.find(i=>i.kind===kind);
test('independent source controls, bounded table selection, shadow remapping and every body-height row',()=>{
 for(const r of v.controls)assert.deepEqual(api.applyLegacyGameActorPresentationControl(r.input),r.expected);
 for(const r of v.plans)if(r.error)assert.throws(()=>api.planLegacyGameActorPresentation(r.input),e=>e.code===r.error);else assert.deepEqual(api.planLegacyGameActorPresentation(r.input),r.expected);
 for(const r of v.anchors)assert.deepEqual(api.planLegacyGameActorPresentationAnchor(r.input),r.expected);
 assert.deepEqual([v.controls.length,v.plans.length,v.anchors.length],[546,1540,1003]);
});
test('strict plans reject getters, extras, invalid words, unsupported variants and unsafe anchor addition',()=>{
 let reads=0;const r={...v.plans[0].input};Object.defineProperty(r,'primary',{get(){reads++;return 0;}});assert.throws(()=>api.planLegacyGameActorPresentation(r));assert.equal(reads,0);
 for(const x of [{...v.plans[0].input,extra:0},{...v.plans[0].input,secondary:65536},{...v.plans[0].input,transientPresent:1}])assert.throws(()=>api.planLegacyGameActorPresentation(x));
 assert.throws(()=>api.planLegacyGameActorPresentationAnchor({...v.anchors[0].input,screenX:2147483647,shift:100}));
 assert.equal(api.legacyGameActorPresentationGate(128,0,7),7);assert.equal(api.legacyGameActorPresentationGate(128,128,7),135);assert.equal(api.legacyGameActorPresentationGate(0,128,255),127);
});
test('actual source45..49/63/64/99 keeps local words separate, assigns facing and ignores unused packet coordinates',()=>withController(c=>{
 for(const id of ['1C','3e']){c.a.applyActions(ascii(`${id}|2147483647|-2147483648|45|7|1|0|0,${action(id,46,3)},${action(id,48,1)},${action(id,49)}`));}
 let s=c.a.copyState();for(const a of [s.localActor,...s.remoteActors]){assert.equal(a.presentation.secondary,0x5b);assert.equal(a.presentation.variant,3);assert.deepEqual(a.motion.display,[2,3]);}
 c.a.applyActions(ascii(action('1C',46,0)));assert.equal(c.a.copyLocalActor().presentation.variant,0);assert.equal(c.a.copyState().remoteActors[0].presentation.variant,3);
 c.a.applyActions(ascii(action('1C',63,0)));assert.ok(c.a.copyLocalActor().presentation.secondary&2);c.a.applyActions(ascii(action('1C',64)));assert.equal(c.a.copyLocalActor().presentation.secondary&2,0);
 c.a.applyActions(ascii(action('1C',99,-3)));assert.equal(c.a.copyLocalActor().presentation.duration,-3);assert.equal(c.a.copyLocalActor().presentation.secondary&0x180,0x180);
}));
test('remote primary priority and signed clear semantics differ from still-unmodeled local correction handlers',()=>withController(c=>{
 const row=(code,p)=>`3e|2|3|${code}|2|${p}|0|0`;
 for(const code of [40,42,44])c.a.applyActions(ascii(row(code,0)));assert.equal(c.a.copyState().remoteActors[0].presentation.primary&0xc400,0xc400);let out=c.frame.step(c.request,1);assert.equal(out.actors[1].presentation.plan.primaryResource,110403);
 c.a.applyActions(ascii(row(42,-1)));out=c.frame.step(c.request,1);assert.equal(out.actors[1].presentation.plan.primaryResource,110402);c.a.applyActions(ascii(row(44,-1)));out=c.frame.step(c.request,1);assert.equal(out.actors[1].presentation.plan.primaryResource,110401);
 c.a.applyActions(ascii(row(40,-1)));assert.equal(c.a.copyState().remoteActors[0].presentation.primary&0x1400,0);for(const code of [40,41,42,44])assert.equal(c.a.applyActions(ascii(action('1C',code,1))).changes[0].result,'unmodeled');
}));
test('force byte survives C0 default mode; clearing force in mode2 retains primary100 until mode changes',()=>withController(c=>{
 c.a.applyActions(ascii(action('3e',41,1)));c.a.applyUnits(ascii(unit('3e',2,100010,71)));assert.ok(c.a.copyState().remoteActors[0].presentation.forced);assert.ok(c.a.copyState().remoteActors[0].flagsProjection&0x100);
 const mode=unit('3e',2,100010,71).split('|');mode[14]='2';c.a.applyUnits(ascii(mode.join('|')));c.a.applyActions(ascii(action('3e',41,0)));assert.equal(c.a.copyState().remoteActors[0].presentation.forced,false);assert.ok(c.a.copyState().remoteActors[0].flagsProjection&0x100);
 c.a.applyUnits(ascii(unit('3e',2,100010,71)));assert.equal(c.a.copyState().remoteActors[0].flagsProjection&0x100,0);
}));
test('owning client matches720 independently modeled full-scene rasters and event/word/counter histories',async()=>{
 const f=presentationFixture();try{await enterPresentation(f);for(let i=0;i<v.full.frames.length;i++){for(const event of v.full.events.filter(e=>e.at===i))await send(f,Buffer.from(event.plainHex,'hex').toString('ascii'));const e=v.full.frames[i],out=f.client.runtime().pump({...f.client.readFrame(),tick:e.tick});checkPresentationFrame(f.client,out,e);const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),e.rgbaSha256,'presentation full scene '+(i+1));}}
 finally{f.close();}
});
test('icon placement uses previous frame offsets and current origin exactly once, including resource reuse',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',46,2)));let out=c.frame.step(c.request,1),first=icon(out,'primary');assert.deepEqual(first.screenPosition,[160,22]);assert.equal(first.command.x,160+first.animation.geometry.originX);
 c.a.applyActions(ascii(action('1C',46,3)));out=c.frame.step(c.request,1);const next=icon(out,'primary'),q=first.animation;assert.deepEqual(next.screenPosition,[160+q.drawOffsetX-q.geometry.originX,22+q.drawOffsetY-q.geometry.originY]);assert.equal(next.command.x,next.screenPosition[0]+next.animation.geometry.originX);assert.equal(c.frame.inspect().childPlayers,1);
}));
test('side and primary shift17 independently and force primary masks suppress the side child',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',45,1)+','+action('1C',46,2)));let out=c.frame.step(c.request,1);assert.deepEqual(icon(out,'primary').screenPosition,[143,22]);assert.deepEqual(icon(out,'side').screenPosition,[177,22]);
 c.a.applyActions(ascii('3e|2|3|42|2|0|0|0,'+action('3e',45,1)));out=c.frame.step(c.request,1);assert.equal(out.actors[1].presentation.plan.sideResource,null);assert.equal(out.actors[1].presentation.icons.length,1);
}));
test('empty and missing-action icon helpers still queue their previous bitmap; resource0 consumes a slot without pixels',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',46,2)));const first=icon(c.frame.step(c.request,1),'primary');for(const [variant,code]of [[10,-1],[11,1]]){c.a.applyActions(ascii(action('1C',46,variant)));const p=icon(c.frame.step(c.request,1),'primary');assert.equal(p.code,code);assert.equal(p.queued,true);assert.equal(p.command.image.index,first.command.image.index);}
 c.a.applyActions(ascii(action('1C',63,0)));const p=icon(c.frame.step(c.request,1),'primary');assert.equal(p.queued,true);assert.equal(p.command,null);
}));
test('transient counts while hidden and clears after601 hooks, then releases on the next hook',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',47)));let out=c.frame.step(c.request,1);assert.equal(local(out).presentation.source.icons.transient.counter,1);c.a.applyActions(ascii(action('1C',46,2)));
 for(let i=0;i<600;i++)out=c.frame.step(c.request,1);assert.equal(local(out).presentation.icons.some(i=>i.kind==='transient'),false);assert.equal(c.a.copyLocalActor().presentation.icons.transient.counter,601);assert.equal(c.a.copyLocalActor().presentation.secondary&4,0);
 out=c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().presentation.icons.transient,null);assert.equal(c.frame.inspect().childPlayers,1);
}));
test('transient creation sound and frame sounds use their real stored anchors under scene9 flags20',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',47)));const out=c.frame.step({...c.request,runtime:{...scene.runtime,soundScene:9}},1),create=out.events.find(e=>e.child==='transient-create'),sound=out.events.find(e=>e.child==='transient');assert.equal(create.value,437);assert.deepEqual(create.screenPosition,[160,120]);assert.equal(sound.value,31);assert.deepEqual(sound.screenPosition,[160,22]);assert.equal(c.a.copyLocalActor().presentation.secondary&0x20,0);
}));
test('source99 blocks actual pointer, movement, camera and helpers while retaining icon owners and duration',async()=>{
 const f=presentationFixture();try{await enterPresentation(f);const runtime=f.client.runtime();runtime.pump({...f.client.readFrame(),tick:1000});const before=f.client.copyWorldState(),position=before.actors.localActor.motion.position;await send(f,'Hx! '+action('1C',99,5)+' ');runtime.move([220,120]);runtime.press(0);const out=runtime.pump({...f.client.readFrame(),tick:1100});assert.equal(out.error,null);assert.ok(out.inputUpdates.every(i=>!i.advanceLocal&&i.destination===null));assert.equal(out.frame.movement,null);assert.deepEqual(f.client.copyWorldState().actors.localActor.motion.position,position);assert.equal(local(out.frame.actorLayer).reason,'own-gate');assert.equal(f.client.copyWorldState().actors.localActor.presentation.duration,5);assert.equal(f.client.copyWorldState().actorFrames.childPlayers,before.actorFrames.childPlayers);}
 finally{f.close();}
});
test('explicit gates, ride and spin skip ordinary icon hooks, then retained players resume',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',47)));c.frame.step(c.request,1);let count=c.a.copyLocalActor().presentation.icons.transient.counter;c.frame.step({...c.request,runtime:{...scene.runtime,ownGateByte:128}},1);assert.equal(c.a.copyLocalActor().presentation.icons.transient.counter,count);
 c.a.applyActions(ascii(action('1C',70,100007)));c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().presentation.icons.transient.counter,count);c.a.applyActions(ascii(action('1C',80,114001)));for(let i=0;i<370;i++){c.frame.step(c.request,1);if(c.a.copyLocalActor().specialSpin.state===0)break;}assert.equal(c.a.copyLocalActor().presentation.icons.transient.counter,count);c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().presentation.icons.transient.counter,count+1);
}));
test('duplicate roots still advance icon timers without queue slots; outside-range removal skips and purges them',()=>withController(c=>{
 c.a.remove(ascii('3e'));c.a.applyUnits(ascii('3e|2|3|80002|0|DupA|0\t4Q|2|3|80002|0|DupB|0\t84|20|3|80002|0|Far|0'));c.a.applyActions(ascii(['3e','4Q','84'].map(id=>action(id,47)).join(',')));const out=c.frame.step(c.request,1),dup=out.actors.find(a=>a.id===300),far=out.actors.find(a=>a.id===500);assert.equal(dup.reason,'duplicate-graphic-cell');assert.equal(dup.presentation.icons[0].queued,false);assert.equal(dup.presentation.source.icons.transient.counter,1);assert.equal(far.reason,'outside-local-range');assert.equal(far.presentation,undefined);assert.equal(c.frame.inspect().childPlayers,2);
}));
test('native transient-null condition fails explicitly and unsupported variant is not hidden by a later force override',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',46,2)+','+action('1C',47)));assert.throws(()=>c.frame.step(c.request,1),e=>e.code==='LEGACY_PRESENTATION_TRANSIENT_OWNER_REQUIRED');assert.equal(c.frame.inspect().childPlayers,0);
}));
test('source words persist across local body reconstruction but all icon players are owned and released',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',45,1)+','+action('1C',46,2)+','+action('3e',46,3)));c.frame.step(c.request,1);assert.equal(c.frame.inspect().childPlayers,3);c.a.beginScene([6,4],true);c.frame.synchronize();assert.equal(c.frame.inspect().childPlayers,0);assert.equal(c.a.copyLocalActor().presentation.secondary,3);assert.equal(c.a.copyLocalActor().presentation.icons.primary,null);c.frame.step(c.request,1);assert.equal(c.frame.inspect().childPlayers,2);
 c.a.applyActions(ascii(action('1C',99,5)));assert.equal(c.a.copyLocalActor().presentation.duration,5);c.a.beginScene([6,4],true);c.frame.synchronize();assert.equal(c.a.copyLocalActor().presentation.duration,0);assert.equal(c.a.copyLocalActor().presentation.secondary,0x183);assert.equal(local(c.frame.step(c.request,1)).reason,'own-gate');
 c.a.remove(ascii('1C'));c.frame.synchronize();assert.equal(c.frame.inspect().childPlayers,0);
}));
test('ownership changes during icon geometry fail closed and release every retained parent and child player',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',46,2)));assert.throws(()=>c.frame.step(c.request,1),e=>e.code==='LEGACY_FRAME_ACTORS_CHANGED');assert.equal(c.frame.inspect().players,0);assert.equal(c.frame.inspect().childPlayers,0);
},{geometry(q,actor,a,library){if(q.value===1002&&actor.presentation.secondary&2)a.beginScene([6,4],true);return library.geometry(q);}}));
test('unsupported native variant lookup remains explicit even when primary flags would later override the resource',()=>withController(c=>{
 c.a.applyActions(ascii('3e|2|3|42|2|0|0|0,'+action('3e',63,16)));assert.throws(()=>c.frame.step(c.request,1),e=>e.code==='LEGACY_PRESENTATION_VARIANT_UNSUPPORTED');assert.equal(c.frame.inspect().childPlayers,0);
}));
test('shadow body remaps secondary8/10/40 and consumes the original source bits for sound and expiration',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',48,1)+','+action('1C',49)));let out=c.frame.step(c.request,1);assert.equal(local(out).presentation.plan.secondary,0x25);assert.deepEqual(local(out).presentation.icons.map(i=>i.kind),['transient','side']);assert.equal(c.a.copyLocalActor().presentation.secondary,0x18);
 for(let i=0;i<600;i++)out=c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().presentation.secondary&0x10,0);assert.ok(c.a.copyLocalActor().presentation.secondary&8);c.frame.step(c.request,1);assert.equal(c.a.copyLocalActor().presentation.icons.transient,null);
},{source:()=>({bodyFlags:0x80000})}));
test('1024 shared child queue slots drop only submissions while every status helper and owned child remains live',()=>withController(c=>{
 const enc=n=>{let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;},ids=[100,200,...Array.from({length:999},(_,i)=>1000+i)];
 for(let n=1000;n<1999;n+=40)c.a.applyUnits(ascii(Array.from({length:Math.min(40,1999-n)},(_,i)=>unit(enc(n+i),0,100010,1)).join('\t')));
 for(let i=0;i<ids.length;i+=30)c.a.applyActions(ascii(ids.slice(i,i+30).flatMap(id=>[action(enc(id),45,1),action(enc(id),46,2)]).join(',')));
 const out=c.frame.step(c.request,1);assert.equal(out.actors.length,1001);assert.equal(out.helperCalls,3003);assert.equal(out.submittedActorIds.length,2025);assert.equal(out.actors.flatMap(a=>a.presentation.icons).filter(i=>i.queued).length,1024);assert.equal(c.frame.inspect().childPlayers,2002);
}));
test('prepared-sprite and deferred resource paths agree for raw previous-frame anchors, flags4 and reused icons',()=>withController(async(c,f)=>{
 const rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map(),catalogs=f.client.library().catalogs();
 const sprite=({index,flags,paletteSelector,color})=>{assert.equal(flags&~7,0);assert.equal(paletteSelector,0);assert.equal(color,0xffffffff);if(!sprites.has(index)){const g=f.client.library().geometry({kind:'index',value:index}),raw=new Uint8Array(16+g.width*g.height),view=new DataView(raw.buffer);raw.set([82,68]);view.setInt32(4,g.width,true);view.setInt32(8,g.height,true);view.setUint32(12,raw.length,true);raw.set(Uint8Array.from({length:g.width*g.height},(_,i)=>(i+index)%5===0?0:1+(i+index)%3),16);const image=api.decodeLegacyGameRD(raw);try{sprites.set(index,api.prepareLegacyGameSprite(image,palette));}finally{image.close();}}return sprites.get(index);};
 const prepared=createLegacyGameActorFrameController(c.a,{animations:catalogs.animations,graphics:catalogs.graphics,source:()=>scene.actorSource,geometry:q=>f.client.library().geometry(q),sprite,initialPhase:0,bindActorSource:true});
 try{c.a.applyActions(ascii(action('1C',45,1)+','+action('1C',46,2)+','+action('3e',47)));for(let i=0;i<12;i++){if(i===6)c.a.applyActions(ascii(action('1C',46,3)));const deferred=c.frame.step(c.request,1),direct=prepared.step(c.request,1),image=await f.client.library().startRender(deferred.drawPlan).done;assert.equal(sha(direct.rgba),sha(image.rgba));assert.deepEqual(direct.submittedActorIds,deferred.submittedActorIds);}}
 finally{prepared.close();for(const p of sprites.values())p.close();palette.close();}
}));

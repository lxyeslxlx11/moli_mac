import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {createLegacyGameActorFrameController} from '../legacy-game-frame.mjs';
import {clientEnter,scene} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vectors as v,ascii,sha,unit,action,attachmentFixture,send,enterAttachment,checkAttachmentFrame} from '../../web/tests/helpers/legacy-game-actor-attachment-fixture.mjs';
function controller(f,options={}){const a=api.createLegacyGameActors();a.prepareCharacterEntry();a.configureResources(8);a.configureSceneMode(1);a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,100);a.applyUnits(ascii(unit()+'\t'+unit('3e',2,100010,71)));const c=f.client.library().catalogs();
 const frame=createLegacyGameActorFrameController(a,{graphics:c.graphics,animations:c.animations,source:()=>({...scene.actorSource,...options.source?.()}),geometry:(q,actor)=>options.geometry?options.geometry(q,actor,a,f.client.library()):f.client.library().geometry(q),initialPhase:0,deferImages:true,bindActorSource:true});
 return {a,frame,request:{tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240},close(){frame.close();a.close();}};}
async function withController(fn,options){const f=attachmentFixture();try{await clientEnter(f);const c=controller(f,options);try{await fn(c,f);}finally{c.close();}}finally{f.close();}}
test('1760 independent source attachment action and body/mount AP anchors',()=>{assert.equal(v.purePlans.length,1760);for(const row of v.purePlans)assert.deepEqual(api.planLegacyGameActorAttachment(row.input),row.expected);});
test('strict attachment plans own their arrays, reject getters/extra fields and out-of-domain native addition',()=>{
 let reads=0;const r={parentAction:8,screenPosition:[1,2],bodyAttachment:[6,-5],mountAttachment:[8,-30]};Object.defineProperty(r,'parentAction',{get(){reads++;return 8;}});assert.throws(()=>api.planLegacyGameActorAttachment(r),api.LegacyGameActorAttachmentError);assert.equal(reads,0);
 const good={parentAction:8,screenPosition:[1,2],bodyAttachment:[6,-5],mountAttachment:null},result=api.planLegacyGameActorAttachment(good);good.screenPosition[0]=99;assert.deepEqual(result.screenPosition,[7,-3]);assert.ok(Object.isFrozen(result.screenPosition));
 for(const row of [{...good,extra:0},{...good,mountAttachment:[1]},{...good,bodyAttachment:[2147483647,0],screenPosition:[1,0]},{...good,parentAction:1.2}])assert.throws(()=>api.planLegacyGameActorAttachment(row));
});
test('source60 local/remote normalizes and owns aux34 while ignoring packet position/facing',()=>withController(c=>{
 c.a.applyActions(ascii(action()+','+action('3e')));const state=c.a.copyState();for(const a of [state.localActor,...state.remoteActors]){assert.equal(a.rawResourceId,100010);assert.equal(a.normalRawResourceId,100010);assert.equal(a.attached.rawResourceId,100006);assert.equal(a.sourceControlUnmodeled,false);assert.deepEqual(a.motion.display,[2,3]);}assert.equal(state.localActor.motion.facingCode,4);assert.equal(state.remoteActors[0].motion.facingCode,2);
}));
test('actual owning client matches540 independent full scene rasters across60 changes, rides, spin, detach and reattach',async()=>{
 const f=attachmentFixture();try{await enterAttachment(f);for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i))await send(f,Buffer.from(e.plainHex,'hex').toString('ascii'));const e=v.full.frames[i],out=f.client.runtime().pump({...f.client.readFrame(),tick:e.tick});checkAttachmentFrame(f.client,out,e);const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),e.rgbaSha256,'source60 complete scene frame '+(i+1));}}
 finally{f.close();}
});
test('ordinary body action8 selects attached action3, all other body actions select0 and always use mode0',()=>withController(c=>{
 c.a.applyActions(ascii(action()));c.a.applyActions(ascii(action('1C',8,0,0,4)));let a=c.frame.step(c.request,1).actors.find(a=>a.local);assert.equal(a.animation.mode,1);assert.equal(a.attachment.animation.mode,0);assert.equal(a.attachment.animation.lastAction,3);assert.equal(a.attachment.animation.lastFacing,4);
 c.a.applyActions(ascii(action('1C',0,0,0,7)));a=c.frame.step(c.request,1).actors.find(a=>a.local);assert.equal(a.attachment.animation.lastAction,0);assert.equal(a.attachment.animation.lastFacing,4);
}));
test('source AP anchor includes parent and mounted current AP exactly once, with type1/root/type0 traversal',()=>withController(c=>{
 c.a.applyActions(ascii(action()));c.a.applyActions(ascii(action('1C',70,100007,0)));for(let i=0;i<35;i++)c.frame.step(c.request,1);const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local),root=c.frame.copySceneRoots().find(r=>r.id===100);
 const expected=[160+a.animation.attachmentX+a.childAnimation.attachmentX,120+a.animation.attachmentY+a.childAnimation.attachmentY];assert.deepEqual(a.attachment.plan.screenPosition,expected);assert.equal(root.commands[0],a.attachment.command);assert.equal(root.commands.at(-1).image.index,a.childAnimation.graphicIndex);assert.equal(a.helperCalls,3);
}));
test('helper-1 and1 suppress attached draw even when a previous bitmap remains cached',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const first=c.frame.step(c.request,1).actors.find(a=>a.local);assert.equal(first.attachment.code,0);assert.equal(c.frame.inspect().childPlayers,1);
 for(const [resource,code]of [[100008,-1],[100009,1]]){c.a.applyActions(ascii(action('1C',60,100010,resource)));const a=c.frame.step(c.request,1).actors.find(a=>a.local);assert.equal(a.attachment.code,code);assert.equal(a.attachment.queued,false);assert.equal(a.attachment.command,null);assert.equal(a.attachment.animation.graphicIndex,first.attachment.animation.graphicIndex);assert.equal(c.frame.inspect().childPlayers,1);}
}));
test('native frame gates stall attachment entirely, but a frozen parent does not freeze its own independent attachment',()=>withController(c=>{
 c.a.applyActions(ascii(action()));let out=c.frame.step({...c.request,runtime:{...scene.runtime,ownGateByte:128}},1);assert.equal(out.actors.find(a=>a.local).state,'blocked');assert.equal(c.frame.inspect().childPlayers,0);out=c.frame.step(c.request,1);const a=out.actors.find(a=>a.local);assert.equal(a.animation.graphicIndex,-1);assert.equal(a.attachment.animation.graphicIndex,1004);assert.equal(a.helperCalls,2);
},{source:()=>({frozen:1})}));
test('ride entry/exit and spin retain cached attachment without stepping, then ordinary hook resumes it',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const before=c.frame.step(c.request,1).actors.find(a=>a.local).attachment.animation;c.a.applyActions(ascii(action('1C',70,100007,0)));let out=c.frame.step(c.request,1);assert.equal(out.actors.find(a=>a.local).attachment,undefined);c.a.applyActions(ascii(action('1C',70,-1,0)));out=c.frame.step(c.request,1);assert.equal(out.actors.find(a=>a.local).attachment,undefined);c.a.applyActions(ascii(action('1C',80,114001,0)));
 for(let i=0;i<370;i++){out=c.frame.step(c.request,1);if(c.a.copyLocalActor().specialSpin.state===0)break;}assert.equal(c.a.copyLocalActor().specialSpin.state,0);assert.equal(out.actors.find(a=>a.local).attachment,undefined);const resumed=c.frame.step(c.request,1).actors.find(a=>a.local).attachment.animation;assert.equal(resumed.nextFrame,before.nextFrame);assert.equal(resumed.delay,0);
}));
test('attachment sound uses zero-initialized child screen and flags0x34 rather than mount scene9 suppression',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const out=c.frame.step({...c.request,runtime:{...scene.runtime,soundScene:9}},1),e=out.events.find(e=>e.actorId===100&&e.child==='attachment');assert.equal(e.kind,'sound');assert.equal(e.value,23);assert.deepEqual(e.screenPosition,[0,0]);
}));
test('source60 with same child resource preserves animation identity/cadence instead of restarting',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const first=c.frame.step(c.request,1).actors.find(a=>a.local).attachment.animation;c.a.applyActions(ascii(action()));const second=c.frame.step(c.request,1).actors.find(a=>a.local).attachment.animation;assert.equal(first.nextFrame,1);assert.equal(second.nextFrame,1);assert.equal(second.delay,0);assert.equal(c.frame.inspect().childPlayers,1);
}));
test('source60 zero removes the player immediately through the actual paused session owner',async()=>{
 const f=attachmentFixture();try{await enterAttachment(f);f.client.runtime().pump({...f.client.readFrame(),tick:1000});assert.equal(f.client.copyWorldState().actorFrames.childPlayers,3);f.client.pause();await send(f,'Hx! '+action('1C',60,100010,0)+' ');const state=f.client.copyWorldState();assert.equal(state.actors.localActor.attached,null);assert.equal(state.actorFrames.childPlayers,2);assert.equal(f.client.inspect().state,'paused');}
 finally{f.close();}
});
test('actor removal, recreated scene and close release attached and mount/effect players',()=>withController(c=>{
 c.a.applyActions(ascii(action()+','+action('3e')));c.frame.step(c.request,1);assert.equal(c.frame.inspect().childPlayers,2);c.a.applyActions(ascii(action('1C',70,100007,0)));c.frame.step(c.request,1);assert.equal(c.frame.inspect().childPlayers,4);c.a.remove(ascii('3e'));c.frame.synchronize();assert.equal(c.frame.inspect().childPlayers,3);c.a.beginScene([6,4],true);c.frame.synchronize();assert.equal(c.frame.inspect().childPlayers,0);assert.equal(c.a.copyLocalActor().attached,null);c.frame.close();assert.equal(c.frame.inspect().players,0);
}));
test('duplicate graphic/cell still advances attached helper and events with root-1 and no child slot',()=>withController(c=>{
 c.a.remove(ascii('3e'));c.a.applyUnits(ascii('3e|2|3|80002|0|OriginalDupA|0\t4Q|2|3|80002|0|OriginalDupB|0'));c.a.applyActions(ascii(action('3e',60,80002,100006)+','+action('4Q',60,80002,100006)));
 const out=c.frame.step(c.request,1),duplicate=out.actors.find(a=>a.id===300);assert.equal(duplicate.state,'culled');assert.equal(duplicate.reason,'duplicate-graphic-cell');assert.equal(duplicate.helperCalls,2);assert.equal(duplicate.attachment.code,0);assert.equal(duplicate.attachment.queued,false);assert.ok(out.events.some(e=>e.actorId===300&&e.child==='attachment'));assert.equal(c.a.copyState().remoteCount,2);assert.equal(c.frame.inspect().childPlayers,2);
}));
test('outside-range owner removal returns before attachment hook and closes all owned children',()=>withController(c=>{
 c.a.remove(ascii('3e'));c.a.applyUnits(ascii('84|20|3|80002|0|OriginalFar|0'));c.a.applyActions(ascii(action('84',60,80002,100006)));const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.id===500);assert.equal(a.reason,'outside-local-range');assert.equal(a.helperCalls,1);assert.equal(a.attachment,undefined);assert.equal(c.a.copyState().remoteCount,0);assert.equal(c.frame.inspect().childPlayers,0);
}));
test('declared-resource1 root filtering preserves attachment helper and queue effects while excluding its whole composite',()=>withController(c=>{
 c.a.applyActions(ascii(action()));let out;for(let i=0;i<3;i++)out=c.frame.step(c.request,1);const a=out.actors.find(a=>a.local),root=c.frame.copySceneRoots().find(r=>r.id===100);assert.equal(root.graphicIndex,1003);assert.equal(a.attachment.code,0);assert.equal(a.attachment.queued,true);assert.equal(out.submittedActorIds.includes(100),false);
}));
test('attached coordinates take native signed-short queue conversion after AP and draw offset',()=>withController(c=>{
 c.a.applyActions(ascii(action()));const out=c.frame.step({...c.request,camera:[-65536,0]},1),a=out.actors.find(a=>a.local),q=a.attachment.animation,command=a.attachment.command;
 const expected=((a.attachment.plan.screenPosition[0]+q.drawOffsetX-q.geometry.originX+32768)%65536+65536)%65536-32768;assert.equal(command.x-q.geometry.originX,expected);assert.ok(expected>=-32768&&expected<=32767);
}));
test('resource provider ownership mutation during attached geometry validation fails closed without retained players',()=>withController(c=>{
 c.a.applyActions(ascii(action()));assert.throws(()=>c.frame.step(c.request,1),e=>e.code==='LEGACY_FRAME_ACTORS_CHANGED');assert.equal(c.frame.inspect().players,0);assert.equal(c.frame.inspect().childPlayers,0);
},{geometry(q,actor,a,library){if(q.value===1004&&actor.attached)a.beginScene([6,4],true);return library.geometry(q);}}));
test('native1024 shared child slots cover both mounted and attached submissions without skipping helper updates',()=>withController(c=>{
 const enc=n=>{let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;},ids=[100,200,...Array.from({length:999},(_,i)=>1000+i)];
 for(let n=1000;n<1999;n+=40)c.a.applyUnits(ascii(Array.from({length:Math.min(40,1999-n)},(_,i)=>unit(enc(n+i),0,100010,1)).join('\t')));
 for(let i=0;i<ids.length;i+=40)c.a.applyActions(ascii(ids.slice(i,i+40).map(id=>action(enc(id),70,100007,0)).join(',')));
 for(let i=0;i<35;i++)c.frame.step(c.request,1);for(let i=0;i<ids.length;i+=40)c.a.applyActions(ascii(ids.slice(i,i+40).map(id=>action(enc(id),60,80002,100006)).join(',')));
 const out=c.frame.step(c.request,1);assert.equal(out.actors.length,1001);assert.equal(out.helperCalls,3003);assert.equal(out.submittedActorIds.length,2025);assert.equal(c.frame.copySceneRoots().length,1001);assert.equal(c.frame.inspect().childPlayers,2002);assert.equal(out.actors.filter(a=>a.attachment.queued).length,512);
}));
test('hidden attached resource still consumes its native child slot on helper0 but submits no bitmap',()=>withController(c=>{
 c.a.applyActions(ascii(action('1C',60,100010,1)));const out=c.frame.step(c.request,1),a=out.actors.find(a=>a.local);assert.equal(a.attachment.code,0);assert.equal(a.attachment.queued,true);assert.equal(a.attachment.command,null);assert.equal(a.attachment.animation.graphicIndex,0);assert.equal(out.submittedActorIds.filter(id=>id===100).length,1);
}));
test('borrowed prepared-sprite actor renderer matches actual resource-library deferred attachment pixels',()=>withController(async(c,f)=>{
 const rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map(),catalogs=f.client.library().catalogs();
 const sprite=({index,flags,paletteSelector,color})=>{assert.equal(flags&~3,0);assert.equal(paletteSelector,0);assert.equal(color,0xffffffff);if(!sprites.has(index)){const g=f.client.library().geometry({kind:'index',value:index}),raw=new Uint8Array(16+g.width*g.height),view=new DataView(raw.buffer);raw.set([82,68]);view.setInt32(4,g.width,true);view.setInt32(8,g.height,true);view.setUint32(12,raw.length,true);raw.set(Uint8Array.from({length:g.width*g.height},(_,i)=>(i+index)%5===0?0:1+(i+index)%3),16);const image=api.decodeLegacyGameRD(raw);try{sprites.set(index,api.prepareLegacyGameSprite(image,palette));}finally{image.close();}}return sprites.get(index);};
 const prepared=createLegacyGameActorFrameController(c.a,{animations:catalogs.animations,graphics:catalogs.graphics,source:()=>scene.actorSource,geometry:q=>f.client.library().geometry(q),sprite,initialPhase:0,bindActorSource:true});
 try{c.a.applyActions(ascii(action()+','+action('3e')));for(let i=0;i<12;i++){const deferred=c.frame.step(c.request,1),direct=prepared.step(c.request,1),image=await f.client.library().startRender(deferred.drawPlan).done;assert.equal(sha(direct.rgba),sha(image.rgba));assert.deepEqual(direct.submittedActorIds,deferred.submittedActorIds);}}
 finally{prepared.close();for(const p of sprites.values())p.close();palette.close();}
}));

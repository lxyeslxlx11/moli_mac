import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';
import * as api from '../index.mjs';
import { createLegacyGameSceneFrameController } from '../legacy-game-scene-frame.mjs';
import { resources,mapBytes,actorRoots } from '../../analysis/game-legacy-scene-frame-v1/original_resources.mjs';
const directory=new URL('../../analysis/game-legacy-scene-frame-v1/',import.meta.url),v=JSON.parse(readFileSync(new URL('original-vectors.json',directory))),
 av=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-animation-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),plain=x=>JSON.parse(JSON.stringify(x)),sha=x=>createHash('sha256').update(x).digest('hex'),error=code=>e=>e.code===code;
const request=x=>({tick:0,runtime:v.runtime,camera:[160,192],center:[48,36],width:96,height:72,...x});
const config=(res,extra={})=>({graphics:res.graphics,cut:res.cut,animations:res.animations,context:()=>({tileCenter:[2,3],drawPrimitives:false}),geometry:res.geometry,sprite:res.sprite,...extra});
function compareResult(result,controller,expected,label){const x=plain(result);delete x.rgba;x.rgbaSha256=sha(result.rgba);x.mapObjectInstances=controller.inspect().mapObjectInstances;
 for(const key of ['profile','scope','width','height','currentVersionCompatibility','nativeUIAndEffects'])delete x[key];assert.deepEqual(x,expected,label);}
function world(res,extra={}){const p=api.createLegacyGameWorldProtocol();p.configureLocalMovement(null,v.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>v.actorSource,geometry:res.geometry,sprite:res.sprite,initialPhase:0});p.configureSceneFrames(config(res,extra));
 p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');const c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));try{for(const raw of v.protocol.beforePlainHex){p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));assert.equal(p.next().kind,'message');}}finally{c.close();}return p;}
test('CUT reads18B file records into source20B layout,all original fields andunfilled kindFFFF',()=>{
 const input=bytes(v.cutHex),c=api.createLegacyGameCutCatalog(input);input.fill(0);try{assert.deepEqual(c.inspect().counts,[4,4,2]);assert.equal(c.inspect().records,10);assert.equal(c.inspect().fileRecordBytes,18);assert.equal(c.inspect().runtimeRecordBytes,20);for(const row of v.cutEntries)assert.deepEqual(plain(c.entry(row.tileId)),row);
  assert.throws(()=>{c.entry(1000).anchor[0]=999;},TypeError);assert.throws(()=>c.entry(51000),error('LEGACY_SCENE_FRAME_INTEGER'));
 }finally{c.close();c.close();}assert.throws(()=>c.entry(1000),error('LEGACY_CUT_CLOSED'));
});
test('CUT bounded native data domain rejects truncation,invalid header,negative or overflowing counts andshared memory',()=>{
 for(const [change,code] of [[b=>b.slice(0,11),'LEGACY_CUT_TRUNCATED'],[b=>b.slice(0,-1),'LEGACY_CUT_TRUNCATED'],[b=>{b[0]=0;return b;},'LEGACY_CUT_HEADER'],[b=>{new DataView(b.buffer).setInt16(6,-1,true);return b;},'LEGACY_CUT_COUNT'],[b=>{for(const at of [6,8,10])new DataView(b.buffer).setUint16(at,30000,true);return b;},'LEGACY_CUT_BUDGET']])assert.throws(()=>api.createLegacyGameCutCatalog(change(bytes(v.cutHex))),error(code));
 assert.throws(()=>api.createLegacyGameCutCatalog(new Uint8Array(new SharedArrayBuffer(12))),error('LEGACY_CUT_INPUT'));assert.throws(()=>api.createLegacyGameCutCatalog(new Uint8Array(900013)),error('LEGACY_CUT_BUDGET'));
 const b=new Uint8Array(bytes(v.cutHex).length+1);b.set(bytes(v.cutHex));const c=api.createLegacyGameCutCatalog(b);assert.equal(c.inspect().trailingBytes,1);c.close();
});
test('shared render/collision window100cases and7 diagonal traversals cover every cell once',()=>{
 for(const row of v.windows){assert.deepEqual(plain(api.legacyGameSceneRectangle(row.width,row.height,row.center)),row.expected);assert.deepEqual(api.legacyGameSceneRectangle(row.width,row.height,row.center),api.legacyGameCollisionWindow(row.width,row.height,row.center));}
 for(const row of v.tileOrders){const actual=plain(api.legacyGameSceneTileOrder(row.width,row.height));assert.deepEqual(actual,row.expected);assert.equal(new Set(actual.map(p=>p.join(':'))).size,row.width*row.height);}
 assert.deepEqual(api.legacyGameSceneRectangle(100,100,[40,40]),[10,20,61,71]);assert.throws(()=>api.legacyGameSceneRectangle(10,10,[10,0]));assert.throws(()=>api.legacyGameSceneTileOrder(52,51));
});
test('600 independent multi-tile comparisons and27 source merges include1024 roots,type3tails andID1 grouping',()=>{
 for(const row of v.comparisons)assert.equal(api.compareLegacyGameSceneDepth(row.actor,row.object),row.expected);
 for(const row of v.merges)assert.deepEqual(plain(api.mergeLegacyGameSceneRoots(row.actors,row.objects,row.tails)),row.expected);
 const r={...v.comparisons[0].actor,declaredResourceId:1000,ordinal:-0,sortFlag:-0};assert.equal(Object.is(api.mergeLegacyGameSceneRoots([r],[],[])[0].ordinal,-0),false);
 assert.throws(()=>api.mergeLegacyGameSceneRoots([r,r],[],[]),error('LEGACY_SCENE_FRAME_ORDINAL'));let reads=0;assert.throws(()=>api.compareLegacyGameSceneDepth({...r,get position(){reads++;}},r),error('LEGACY_SCENE_FRAME_FIELDS'));assert.equal(reads,0);
});
test('160 independently rasterized source rectangles verify negative starts,empty/outside boxes andall flip placements',()=>{
 const res=resources(api,v,av);try{for(const row of v.sourceRectangleCases){const{index,...command}=row.command,result=api.composeLegacyGameFrame(row.width,row.height,[{sprite:res.sprite({index}),...command}]);assert.equal(sha(result.rgba),row.expected.rgbaSha256);assert.equal(result.rasterOperations,row.expected.rasterOperations);assert.deepEqual(plain(result.drawOrder),row.expected.drawOrder);}}finally{res.close();}
});
test('source rectangles reject accessors,sparse data andout-of-short bounds without invoking getters',()=>{
 const res=resources(api,v,av);let reads=0;try{const base={sprite:res.sprite({index:1002}),x:0,y:0,priority:10};for(const sourceRectangle of [new Array(4),[0,0,1,32768],{length:4},[0,0,1]])assert.throws(()=>api.composeLegacyGameFrame(8,8,[{...base,sourceRectangle}]));
 const r=[0,0,1,1];Object.defineProperty(r,'0',{get(){reads++;return 0;}});assert.throws(()=>api.composeLegacyGameFrame(8,8,[{...base,sourceRectangle:r}]),error('LEGACY_RENDER_SOURCE_RECTANGLE'));assert.equal(reads,0);
 }finally{res.close();}
});
test('6 independent source scene traces verify144 complete ordinary map/object/actor frames andanimated lifecycle',()=>{
 const res=resources(api,v,av);try{for(const trace of v.series){let context;const c=createLegacyGameSceneFrameController(config(res,{context:()=>context})),scene=Object.freeze({checksumMode:trace.mode}),planes=trace.initialPlanes.map(a=>a.slice());
  try{for(const row of trace.frames){context=row.context;for(const [p,x,y,n] of row.changes)planes[p][y*trace.width+x]=n;if(row.reset)c.reset();const map=api.createLegacyGameMapState(7,23,mapBytes(trace.width,trace.height,planes),trace.mode);
    try{compareResult(c.step(row.request,scene,map,actorRoots(row.actorRoots,res)),c,row.expected,trace.name+' frame'+row.tick);}finally{map.close();}
  }}finally{c.close();}
 }}finally{res.close();}
});
test('ordinal metadata keeps duplicate declaredID1 records distinct anduses file30kind not opaque32',()=>{
 const res=resources(api,v,av);try{assert.equal(res.graphics.image(1).index,1010);assert.equal(res.graphics.resourceIdAt(1003),1);assert.equal(res.graphics.resourceIdAt(1010),1);const m=api.legacyGameGraphicMetadataAt(res.graphics,1201);assert.deepEqual(m,{resourceId:null,index:1201,tileWidth:1,tileHeight:3,rawFlags:300,collisionClass:0});assert.equal(res.graphics.metadataAt(1200).rawFlags,100);
 }finally{res.close();}assert.throws(()=>res.graphics.metadataAt(1200),error('LEGACY_GRAPHIC_CLOSED'));
});
test('filtered placeholder roots do not request sprites;animated objectID1 remains inordinary object queue',()=>{
 const res=resources(api,v,av),trace=v.series[2],planes=trace.initialPlanes.map(a=>a.slice()),map=api.createLegacyGameMapState(7,23,mapBytes(12,12,planes),1),scene=Object.freeze({checksumMode:1});let placeholderCalls=0;
 const c=createLegacyGameSceneFrameController(config(res,{sprite:q=>{if(q.index===1010){placeholderCalls++;throw Error('Filtered placeholder must not load');}return res.sprite(q);}}));
 try{for(let i=0;i<12;i++)c.step(request({tick:i}),scene,map,[]);assert.equal(placeholderCalls,0);assert.equal(c.inspect().mapObjectInstances,3);}finally{c.close();map.close();res.close();}
});
test('source1024 object/tail caps drop extra roots without changingqueue ownership',()=>{
 const res=resources(api,v,av);try{for(const tile of [1001,1002]){const planes=[Array(2601).fill(0),Array(2601).fill(tile),Array(2601).fill(0xc000)],map=api.createLegacyGameMapState(7,23,mapBytes(51,51,planes),1),c=createLegacyGameSceneFrameController(config(res,{context:()=>({tileCenter:[30,20],drawPrimitives:false})}));
  try{const r=c.step(request(),Object.freeze({checksumMode:1}),map,[]);assert.equal(r.queues[tile===1001?'object':'tail'],1024);assert.equal(r.droppedRoots,1577);assert.equal(r.mergeOrder.length,1024);}finally{c.close();map.close();}
 }}finally{res.close();}
});
test('provider error closes scene players butborrows resources;reentrant close cannot commit pixels',()=>{
 const res=resources(api,v,av),trace=v.series[2],map=api.createLegacyGameMapState(7,23,mapBytes(12,12,trace.initialPlanes),1),scene=Object.freeze({checksumMode:1});let c;c=createLegacyGameSceneFrameController(config(res,{sprite:()=>{c.close();return res.sprite({index:1100});}}));
 try{assert.throws(()=>c.step(request(),scene,map,[]),error('LEGACY_SCENE_FRAME_CLOSED'));assert.equal(c.inspect().state,'closed');assert.equal(c.inspect().frames,0);assert.equal(c.inspect().mapObjectInstances,0);assert.equal(res.cut.inspect().records,10);}finally{c.close();map.close();res.close();}
});
test('unmodeled source primitive is explicit andnever replaced with a syntheticbackground',()=>{
 const res=resources(api,v,av),p=[Array(144).fill(200),Array(144).fill(0),Array(144).fill(0xc000)],map=api.createLegacyGameMapState(7,23,mapBytes(12,12,p),0),c=createLegacyGameSceneFrameController(config(res,{context:()=>({tileCenter:[2,3],drawPrimitives:true})}));
 try{assert.throws(()=>c.step(request(),Object.freeze({checksumMode:0}),map,[]),error('LEGACY_SCENE_FRAME_PRIMITIVE_UNMODELED'));assert.equal(c.inspect().state,'failed');}finally{c.close();map.close();res.close();}
});
test('world wire/map cache ->local motion/actor roots ->52 independently checked ordinary full-scene frames',()=>{
 const res=resources(api,v,av),p=world(res);try{p.requestLocalDestination([5,3]);const outgoing=[];for(let i=0;i<52;i++){const r=p.advanceFrame(request({tick:1000+i}));assert.equal(r.actorFrameError,null);assert.equal(r.sceneFrameError,null);outgoing.push(...r.movement.requests);
   const s=p.copyGameState().sceneFrames;compareResult(r.sceneLayer,{inspect:()=>s},v.worldFrames[i],'world frame'+i);}
  assert.equal(outgoing.length,2);assert.deepEqual(p.copyGameState().localMovement.position,[320,192]);
 }finally{p.close();res.close();}
});
test('scene-only failure preserves actual movement request,actor output andnext wire message,thenreconfigures',()=>{
 const res=resources(api,v,av),p=world(res,{sprite:()=>{throw Error('internal scene detail');}});try{p.requestLocalDestination([5,3]);const r=p.advanceFrame(request({tick:1000}));assert.equal(r.sceneLayer,null);assert.deepEqual(r.sceneFrameError,{code:'LEGACY_GAME_SCENE_FRAME_FAILED'});assert.ok(r.actorLayer.rgba.length);assert.equal(r.actorFrameError,null);assert.equal(r.movement.requests.length,1);
  assert.doesNotMatch(JSON.stringify(r.sceneFrameError),/internal/);const c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex)),reader=api.createLegacyGameEnvelopeReader();try{reader.append(p.encodeCommand(r.movement.requests[0].operationId,r.movement.requests[0].arguments));assert.equal(Buffer.from(c.decode(reader.next().payload)).toString('hex'),v.protocol.requestPlainHex[0]);p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(v.protocol.afterPlainHex[0]))));assert.equal(p.next().kind,'message');}finally{c.close();reader.close();}
  p.configureSceneFrames(config(res));assert.equal(p.advanceFrame(request({tick:1001})).sceneFrameError,null);
 }finally{p.close();res.close();}
});
test('scene providers cannot mutate/reenterworld;descriptor cancellation ishonored andgettercontextis notread',()=>{
 const res=resources(api,v,av);try{for(const action of ['next','configureSceneFrames','advanceFrame','close','error-descriptor-close','getter']){let p,reads=0;p=world(res,{context:()=>{if(action==='error-descriptor-close')throw new Proxy({},{getOwnPropertyDescriptor(){p.close();}});if(action==='getter')return{get tileCenter(){reads++;return[2,3];},drawPrimitives:false};if(action==='configureSceneFrames')p.configureSceneFrames(config(res));else if(action==='advanceFrame')p.advanceFrame(request());else p[action]();return{tileCenter:[2,3],drawPrimitives:false};}});
  try{if(action==='close'||action==='error-descriptor-close')assert.throws(()=>p.advanceFrame(request()),error('LEGACY_GAME_PROTOCOL_CLOSED'));else{const r=p.advanceFrame(request());assert.equal(r.sceneLayer,null);assert.ok(r.actorLayer);assert.equal(r.sceneFrameError.code,action==='getter'?'LEGACY_SCENE_FRAME_FIELDS':'LEGACY_GAME_FRAME_REENTRANT');assert.equal(reads,0);}}finally{p.close();}
 }}finally{res.close();}
});
test('new scene transition releases map instances immediately andraw protocol rejects sceneconfiguration',()=>{
 const res=resources(api,v,av),p=world(res),raw=api.createLegacyGameProtocol();try{p.advanceFrame(request());assert.equal(p.copyGameState().sceneFrames.mapObjectInstances,3);const c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));try{p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(v.protocol.beforePlainHex[1]))));assert.equal(p.next().kind,'message');}finally{c.close();}assert.equal(p.copyGameState().sceneFrames.mapObjectInstances,0);
  assert.throws(()=>raw.configureSceneFrames(config(res)),error('LEGACY_GAME_WORLD_REQUIRED'));
 }finally{p.close();raw.close();res.close();}
});
test('standalone original Python TCP verifies52 scene digests,2transmitted moves andserver correction',{timeout:15000},async()=>{
 const temp=await mkdtemp(join(tmpdir(),'moli-original-scene-'));for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(temp,name));await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(temp,'wire_reference.py'));
 const child=spawn('python3',[join(temp,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket,events=0,final;child.stderr.on('data',b=>{diagnostics+=b;});
 const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),res=resources(api,v,av),p=api.createLegacyGameWorldProtocol();
 p.configureLocalMovement(null,v.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>v.actorSource,geometry:res.geometry,sprite:res.sprite,initialPhase:0});p.configureSceneFrames(config(res));
 try{const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;if(!event.effect)continue;events++;
   if(events===v.protocol.beforePlainHex.length){p.requestLocalDestination(v.protocol.destination);for(let i=0;i<52;i++){const r=p.advanceFrame(request({tick:1000+i}));assert.equal(r.sceneFrameError,null);compareResult(r.sceneLayer,{inspect:()=>p.copyGameState().sceneFrames},v.worldFrames[i],'TCP frame'+i);for(const q of r.movement.requests)socket.write(p.encodeCommand(q.operationId,q.arguments));}}
   if(events===v.protocol.beforePlainHex.length+1)final=p.advanceFrame(request({tick:1100}));}}catch(error){reject(error);}});socket.once('end',resolve);});assert.equal(final.sceneFrameError,null);assert.deepEqual(final.actorLayer.actors[0].motion.position,[384,256]);const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,2);assert.equal(receipt.messages_sent,6);assert.equal(await exit,0,diagnostics);p.finish();
 }finally{p.close();res.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
});

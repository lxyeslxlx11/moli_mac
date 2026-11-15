import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { createLegacyGameActors,createLegacyGameGraphicCatalog,createLegacyGameAnimationCatalog,decodeLegacyGameRD,
  createLegacyGamePalette32,prepareLegacyGameSprite,createLegacyGameAnimationPlayer,legacyGameGraphicResourceIdAt,
  planLegacyGameActorFrame,sortLegacyGameActorDepth,snapshotLegacyGameFrameRequest,createLegacyGameWorldProtocol,
  createLegacyGamePayloadCodec,encodeLegacyGameEnvelope,createLegacyGameProtocol,createLegacyGameEnvelopeReader } from '../index.mjs';
import { createLegacyGameActorFrameController } from '../legacy-game-frame.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-frame-v1/original-vectors.json',import.meta.url))),
  av=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-animation-v1/original-vectors.json',import.meta.url))),
  nv=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-local-movement-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),ascii=s=>new Uint8Array(Buffer.from(s,'latin1')),plain=x=>JSON.parse(JSON.stringify(x)),
  sha=b=>createHash('sha256').update(b).digest('hex'),source=x=>({...v.source,...x}),runtime=x=>({...v.runtime,...x}),
  request=x=>({tick:0,runtime:runtime(),camera:[160,192],center:[48,36],width:96,height:72,...x}),error=code=>e=>e.code===code;
function base62(n){let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;}
function unit(d){return `1|${base62(d.id)}|${d.origin[0]}|${d.origin[1]}|${d.facing}|${d.resourceId}|0|0|Original||1|0|0||0|0|`;}
function resources(){
  const animations=createLegacyGameAnimationCatalog(av.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,x])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(x):x]))));
  const indices=[1002,1003,1004,2007,2008,3000],raw=new Uint8Array(indices.length*40),view=new DataView(raw.buffer),geometries=new Map(),cache=new Map();
  for(let r=0;r<indices.length;r++){const index=indices[r],g={index,originX:index%7-3,originY:index%5-2,width:4*(index%3+1),height:index%4+2};geometries.set(index,g);
    view.setInt32(r*40,index,true);view.setInt32(r*40+12,g.originX,true);view.setInt32(r*40+16,g.originY,true);view.setUint32(r*40+20,g.width,true);view.setUint32(r*40+24,g.height,true);
    view.setUint32(r*40+32,0xabcdef01,true);view.setUint32(r*40+36,index===1003?1:index===3000?30000:index+20000,true);}
  const graphics=createLegacyGameGraphicCatalog([raw],{includeImages:true}),rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=createLegacyGamePalette32(rgb,'explicit-rgb');
  const geometry=q=>{const g=graphics.imageAt(q.kind==='index'?q.value:graphics.image(q.value).index);return {index:g.index,originX:g.originX,originY:g.originY,width:g.width,height:g.height};};
  const sprite=({index})=>{if(!cache.has(index)){const g=geometries.get(index),raw=new Uint8Array(16+g.width*g.height),dv=new DataView(raw.buffer);raw.set([82,68]);dv.setInt32(4,g.width,true);dv.setInt32(8,g.height,true);dv.setUint32(12,raw.length,true);
    raw.set(Uint8Array.from({length:g.width*g.height},(_,i)=>(i+index)%5===0?0:1+(i+index)%3),16);const image=decodeLegacyGameRD(raw);try{cache.set(index,prepareLegacyGameSprite(image,palette));}finally{image.close();}}return cache.get(index);};
  return{animations,graphics,geometry,sprite,close(){cache.forEach(s=>s.close());palette.close();graphics.close();animations.close();}};
}
function owned(definitions=v.series[0].definitions){const actors=createLegacyGameActors();actors.setContext([100,0,1,0]);actors.configureResources(8);actors.observeGlobals(null,null,null,100);actors.applyUnits(ascii(definitions.map(unit).join('\t')));
 for(const d of definitions)for(const [x,y] of d.targets)actors.applyActions(ascii(`${base62(d.id)}|${x}|${y}|1|${d.facing}|100|-1|-1`));return actors;}
function configured(owner,res,overrides={}){return createLegacyGameActorFrameController(owner,{animations:res.animations,graphics:res.graphics,source:()=>source(),geometry:res.geometry,sprite:res.sprite,initialPhase:0,...overrides});}
test('1064 independently generated callback plans verify exact gates, loop modes and post-pop thresholds',()=>{
  for(const row of v.plans)assert.deepEqual(plain(planLegacyGameActorFrame(row.input)),row.expected);
});
test('44 independent source qsort traces include cutoff8, ties, reverse,1001 and1024 roots',()=>{
  for(const row of v.sorts)assert.deepEqual(plain(sortLegacyGameActorDepth(row.input)),row.expected,row.name);
});
test('7 independent actor callbacks verify448 full motion/animation/depth/event/RGBA frames',()=>{
  const res=resources();try{for(const trace of v.series){const actors=owned(trace.definitions);let sources;const frames=configured(actors,res,{source:a=>sources[trace.definitions.findIndex(d=>d.id===a.id)],initialPhase:trace.initialPhase});
    try{for(const row of trace.frames){sources=row.sources;for(const i of row.invalidateActorIndices){const d=trace.definitions[i];actors.applyActions(ascii(`${base62(d.id)}|-1|-1|31|4|-1|-1|-1`));}
      const result=frames.step(request({tick:row.tick,runtime:row.runtime}),1),actual={actors:plain(result.actors),events:plain(result.events),helperCalls:result.helperCalls,queueOrder:plain(result.queueOrder),enginePhase:result.enginePhase,
        submittedActorIds:plain(result.submittedActorIds),drawOrderActorIds:plain(result.drawOrderActorIds),rgbaSha256:sha(result.rgba),rasterOperations:result.rasterOperations};
      assert.deepEqual(actual,row.expected,trace.name+' frame'+row.tick);
    }}finally{frames.close();actors.close();}
  }}finally{res.close();}
});
test('allocator starts at graphic -1; file36 declared resource1 is skipped after participating in sort',()=>{
  const res=resources(),p=createLegacyGameAnimationPlayer(res.animations),actors=owned();let spriteCalls=0;const f=configured(actors,res,{sprite:q=>{assert.notEqual(q.index,1003);spriteCalls++;return res.sprite(q);}});
  try{assert.equal(p.copyState().graphicIndex,-1);assert.equal(res.graphics.resourceIdAt(1003),1);assert.equal(legacyGameGraphicResourceIdAt(res.graphics,3000),30000);assert.equal(res.graphics.resourceIdAt(0),0);
    let skipped=false;for(let i=0;i<10;i++){const r=f.step(request(),1);assert.equal(r.queueOrder.length,3);for(const a of r.actors)if(a.animation.graphicIndex===1003){skipped=true;assert.ok(!r.submittedActorIds.includes(a.id));}}
    assert.ok(skipped);assert.ok(spriteCalls);
  }finally{p.close();f.close();actors.close();res.close();}
});
test('removal, same-ID recreation and scene reset release players and preserve FIFO identity',()=>{
  const res=resources(),actors=owned(),f=configured(actors,res);try{f.step(request(),1);assert.equal(f.inspect().players,3);actors.remove(ascii(base62(200)));f.synchronize();assert.equal(f.inspect().players,2);
    actors.applyUnits(ascii(unit(v.series[0].definitions[0])));const r=f.step(request(),1);assert.deepEqual(r.actors.map(x=>x.id),[100,201,200]);assert.equal(r.actors[2].animation.nextFrame,1);
    actors.beginScene();f.synchronize();assert.equal(f.inspect().players,1);assert.deepEqual(f.step(request(),1).actors.map(x=>x.id),[100]);
  }finally{f.close();actors.close();res.close();}
});
test('deferred remote facing is consumed once at matching arrived display coordinates',()=>{
  const res=resources(),actors=owned([{id:200,local:false,origin:[2,3],resourceId:100001,facing:0,targets:[]}]),f=configured(actors,res);
  try{actors.applyActions(ascii(`${base62(200)}|3|3|50|7|-1|-1|-1`));let r;for(let i=0;i<16;i++)r=f.step(request(),1);assert.equal(r.actors[0].motion.facingCode,7);
    actors.applyActions(ascii(`${base62(200)}|-1|-1|2|2|-1|-1|-1`));assert.equal(f.step(request(),1).actors[0].motion.facingCode,2);
  }finally{f.close();actors.close();res.close();}
});
test('snapshot rejects getters, sparse arrays, unknown fields and pixel budgets without invoking accessors',()=>{
 let reads=0;assert.throws(()=>snapshotLegacyGameFrameRequest({...request(),get tick(){reads++;}}),error('LEGACY_FRAME_FIELDS'));assert.equal(reads,0);
 for(const bad of [request({camera:new Array(2)}),request({width:4194305}),request({height:4194304}),{...request(),extra:0},request({runtime:{...runtime(),movementScale:Infinity}})])assert.throws(()=>snapshotLegacyGameFrameRequest(bad));
 const original=request(),copy=snapshotLegacyGameFrameRequest(original);original.camera[0]=999;original.runtime.runtimeStage=250;assert.deepEqual(copy.camera,[160,192]);assert.equal(copy.runtime.runtimeStage,0);assert.ok(Object.isFrozen(copy.runtime));
});
test('depth boundaries reject duplicates, excessive roots and unsafe float32 positions',()=>{
 const row={position:[0,0],sortFlag:0,ordinal:0};for(const bad of [[row,row],Array(1025).fill(row),[{...row,position:[Infinity,0]}],[{...row,ordinal:1024}],[{...row,position:[2147483904,0]}]])assert.throws(()=>sortLegacyGameActorDepth(bad));
});
test('all source contexts are validated before motion changes; unsupported branches fail explicitly',()=>{
 const res=resources(),actors=owned(),before=actors.copyState(),f=configured(actors,res,{source:a=>source(a.local?{specialState:1}:{})});
 try{assert.throws(()=>f.step(request(),1),error('LEGACY_FRAME_SOURCE_HANDLER_UNMODELED'));assert.deepEqual(actors.copyState(),before);assert.equal(f.inspect().state,'failed');assert.equal(f.inspect().players,0);}
 finally{f.close();actors.close();res.close();}
});
test('source callback reentry and actor mutation cannot silently commit a frame',()=>{
 const res=resources();try{for(const kind of ['frame','mutation','close']){const actors=owned();let f;f=configured(actors,res,{source:()=>{if(kind==='frame')f.step(request(),1);if(kind==='mutation')actors.beginScene();if(kind==='close')f.close();return source();}});
   try{assert.throws(()=>f.step(request(),1));assert.equal(f.inspect().state,kind==='close'?'closed':'failed');assert.equal(f.inspect().frames,0);}finally{f.close();actors.close();}
 }}finally{res.close();}
});
test('owned output survives later frames; borrowed catalog/sprite handles remain independently owned',()=>{
 const res=resources(),actors=owned(),f=configured(actors,res);try{const a=f.step(request(),1),saved=sha(a.rgba);f.step(request(),1);assert.equal(sha(a.rgba),saved);a.rgba.fill(0);assert.notEqual(sha(f.step(request(),1).rgba),sha(a.rgba));f.close();assert.equal(res.graphics.resourceIdAt(1003),1);assert.equal(res.animations.inspect().resources,5);}
 finally{f.close();actors.close();res.close();}
});
test('configuration checks source handle ownership, disabled image metadata and closed resources',()=>{
 const res=resources(),actors=owned(),disabled=createLegacyGameGraphicCatalog([new Uint8Array()]);try{assert.throws(()=>configured(actors,res,{graphics:disabled}),error('LEGACY_GRAPHIC_IMAGES_DISABLED'));
   assert.throws(()=>configured({},res),error('LEGACY_ACTOR_FRAME_OWNER'));res.animations.close();assert.throws(()=>configured(actors,res),error('LEGACY_ANIMATION_CLOSED'));
 }finally{disabled.close();actors.close();res.close();}
});
function wireReady(res,overrides={}){const p=createLegacyGameWorldProtocol();p.configureLocalMovement(null,nv.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>source(),geometry:res.geometry,sprite:res.sprite,initialPhase:0,...overrides});
 p.append(encodeLegacyGameEnvelope(bytes(nv.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');for(const raw of nv.protocol.beforePlainHex){const c=createLegacyGamePayloadCodec(bytes(nv.bootstrap.keyHex));try{const plain=ascii(Buffer.from(raw,'hex').toString('latin1').replace('|100111|','|100001|'));p.append(encodeLegacyGameEnvelope(c.encode(plain)));assert.equal(p.next().kind,'message');}finally{c.close();}}return p;}
test('world advances local motion and animation once; repeated cached phase does not restart every tick',()=>{
 const res=resources(),p=wireReady(res);try{p.requestLocalDestination([5,3]);let previous;const requests=[];
   for(let i=0;i<52;i++){const r=p.advanceFrame(request({tick:1000+i}));assert.equal(r.actorFrameError,null);requests.push(...r.movement.requests);const a=r.actorLayer.actors[0];assert.ok(a.animation.geometry);assert.equal(a.motion.phase,a.animation.lastAction);if(i===1)assert.equal(a.animation.nextFrame,previous.animation.nextFrame);previous=a;}
   assert.equal(requests.length,2);assert.deepEqual(p.copyGameState().localMovement.position,[320,192]);assert.equal(p.copyGameState().actors.localActor.motion.phase,0);
 }finally{p.close();res.close();}
});
test('render failure keeps outgoing movement, remaining wire messages and explicit reconfiguration usable',()=>{
 const res=resources(),secret='private-provider-detail',p=wireReady(res,{geometry:()=>{throw Error(secret);}});try{p.requestLocalDestination([5,3]);let r=p.advanceFrame(request({tick:1000}));assert.equal(r.actorLayer,null);assert.equal(r.movement.requests.length,1);assert.deepEqual(r.actorFrameError,{code:'LEGACY_GAME_ACTOR_FRAME_FAILED'});assert.ok(!JSON.stringify(r).includes(secret));
   const c=createLegacyGamePayloadCodec(bytes(nv.bootstrap.keyHex)),reader=createLegacyGameEnvelopeReader();try{reader.append(p.encodeCommand(r.movement.requests[0].operationId,r.movement.requests[0].arguments));assert.equal(Buffer.from(c.decode(reader.next().payload)).toString('hex'),nv.protocol.requestPlainHex[0]);p.append(encodeLegacyGameEnvelope(c.encode(bytes(nv.protocol.afterPlainHex[0]))));assert.equal(p.next().kind,'message');}finally{c.close();reader.close();}
   assert.equal(p.inspect().state,'open');p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>source(),geometry:res.geometry,sprite:res.sprite,initialPhase:0});r=p.advanceFrame(request({tick:1001}));assert.equal(r.actorFrameError,null);
 }finally{p.close();res.close();}
});
test('world mutators are rejected during providers; source errors and close cannot leak actor details',()=>{
 const res=resources();try{for(const action of ['next','append','advanceFrame','configureLocalMovement','close','error-descriptor-close']){let p;p=wireReady(res,{source:()=>{if(action==='error-descriptor-close')throw new Proxy({},{getOwnPropertyDescriptor(){p.close();return undefined;}});if(action==='append')p.append(new Uint8Array());else if(action==='advanceFrame')p.advanceFrame(request());else if(action==='configureLocalMovement')p.configureLocalMovement(null,nv.sourceContext);else p[action]();return source();}});
   try{if(action==='close'||action==='error-descriptor-close')assert.throws(()=>p.advanceFrame(request()),error('LEGACY_GAME_PROTOCOL_CLOSED'));else{const r=p.advanceFrame(request());assert.equal(r.actorLayer,null);assert.equal(r.actorFrameError.code,'LEGACY_GAME_FRAME_REENTRANT');assert.equal(p.inspect().state,'open');}}finally{p.close();}
 }}finally{res.close();}
});
test('raw protocol rejects world-only configuration and advance without altering its open state',()=>{
 const p=createLegacyGameProtocol(),res=resources();try{assert.throws(()=>p.configureActorFrames({}),error('LEGACY_GAME_WORLD_REQUIRED'));assert.throws(()=>p.advanceFrame(request()),error('LEGACY_GAME_WORLD_REQUIRED'));assert.equal(p.inspect().state,'open');}finally{p.close();res.close();}
});
test('standalone Python TCP verifies2 transmitted requests and52 independent owning actor-layer frames',{timeout:15000},async()=>{
 const temp=await mkdtemp(join(tmpdir(),'moli-original-frame-')),directory=new URL('../../analysis/game-legacy-frame-v1/',import.meta.url);
 for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(temp,name));await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(temp,'wire_reference.py'));
 const child=spawn('python3',[join(temp,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket,events=0,finalFrame;
 child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),res=resources(),p=createLegacyGameWorldProtocol();
 p.configureLocalMovement(null,v.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>source(),geometry:res.geometry,sprite:res.sprite,initialPhase:0});
 try{const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});
   await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;if(!event.effect)continue;events++;
     if(events===v.protocol.beforePlainHex.length){p.requestLocalDestination(v.protocol.destination);for(let i=0;i<52;i++){const frame=p.advanceFrame(request({tick:1000+i}));assert.equal(frame.actorFrameError,null);const actual=frame.actorLayer.actors[0],expected=v.worldFrames[i];
       assert.deepEqual(plain(actual.motion.position),expected.position);assert.deepEqual(plain(actual.motion.display),expected.display);assert.deepEqual(plain(actual.animation),expected.animation);assert.deepEqual(plain(actual.screenPosition),expected.screenPosition);assert.equal(sha(frame.actorLayer.rgba),expected.rgbaSha256);
       for(const outgoing of frame.movement.requests)socket.write(p.encodeCommand(outgoing.operationId,outgoing.arguments));}}
     if(events===v.protocol.beforePlainHex.length+1){finalFrame=p.advanceFrame(request({tick:1100}));assert.equal(finalFrame.actorFrameError,null);}
   }}catch(error){reject(error);}});socket.once('end',resolve);});
   assert.deepEqual(finalFrame.actorLayer.actors[0].motion.position,[384,256]);assert.equal(finalFrame.actorLayer.actors[0].motion.facingCode,7);const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,2);assert.equal(receipt.messages_sent,6);assert.equal(await exit,0,diagnostics);p.finish();
 }finally{p.close();res.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
});

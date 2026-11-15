/** Original scene core in a neutral runtime with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
import { resources } from './original_resources.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-scene-frame-v1'),entry='build/analysis/game-legacy-scene-frame-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/index.mjs';\n");assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),bundle:true,format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'}),hash=b=>createHash('sha256').update(b).digest('hex'),inputs=[],outputs=[];
assert.ok(Object.values(built.metafile.outputs).every(row=>row.imports.length===0));for(const path of Object.keys(built.metafile.inputs)){const raw=await readFile(resolve(root,path));inputs.push({path,bytes:raw.length,sha256:hash(raw)});}
for(const row of built.outputFiles){await writeFile(row.path,row.contents);outputs.push({path:row.path.slice(root.length),bytes:row.contents.length,sha256:hash(row.contents)});}
await writeFile(resolve(directory,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_acceptance:false},null,2)+'\n');
const bundle=await readFile(resolve(directory,'portable.cjs'),'utf8'),v=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url))),av=JSON.parse(await readFile(new URL('../game-legacy-animation-v1/original-vectors.json',import.meta.url))),bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),plain=x=>JSON.parse(JSON.stringify(x));
function instance(){const module={exports:{}};runInNewContext(bundle,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 TextEncoder:undefined,TextDecoder:undefined,Buffer:undefined,URL:undefined,process:undefined,require:undefined,window:undefined,document:undefined,wx:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,performance:undefined},{timeout:1000});return module.exports;}
test('neutral CUT/window/tile/depth merge and160 clipped native-chunk pixel references match Python',()=>{
 const api=instance(),res=resources(api,v,av);try{for(const e of v.cutEntries)assert.deepEqual(plain(res.cut.entry(e.tileId)),e);for(const r of v.windows)assert.deepEqual(plain(api.legacyGameSceneRectangle(r.width,r.height,r.center)),r.expected);
  for(const r of v.tileOrders)assert.deepEqual(plain(api.legacyGameSceneTileOrder(r.width,r.height)),r.expected);for(const r of v.comparisons)assert.equal(api.compareLegacyGameSceneDepth(r.actor,r.object),r.expected);for(const r of v.merges)assert.deepEqual(plain(api.mergeLegacyGameSceneRoots(r.actors,r.objects,r.tails)),r.expected);
  for(const r of v.sourceRectangleCases){const{index,...c}=r.command,frame=api.composeLegacyGameFrame(r.width,r.height,[{sprite:res.sprite({index}),...c}]);assert.equal(hash(frame.rgba),r.expected.rgbaSha256);assert.equal(frame.rasterOperations,r.expected.rasterOperations);}
 }finally{res.close();}
});
test('neutral source scene world integrates52 original wire/local/actor/map frames and2 exact commands',()=>{
 const api=instance(),res=resources(api,v,av),p=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex)),reader=api.createLegacyGameEnvelopeReader();
 try{p.configureLocalMovement(null,v.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>v.actorSource,geometry:res.geometry,sprite:res.sprite,initialPhase:0});
  p.configureSceneFrames({graphics:res.graphics,cut:res.cut,animations:res.animations,context:()=>({tileCenter:[2,3],drawPrimitives:false}),geometry:res.geometry,sprite:res.sprite});
  p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');for(const raw of v.protocol.beforePlainHex){p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));assert.equal(p.next().kind,'message');}
  p.requestLocalDestination(v.protocol.destination);const requests=[];for(let i=0;i<52;i++){const r=p.advanceFrame({tick:1000+i,runtime:v.runtime,camera:[160,192],center:[48,36],width:96,height:72});assert.equal(r.sceneFrameError,null);assert.equal(hash(r.sceneLayer.rgba),v.worldFrames[i].rgbaSha256);assert.deepEqual(plain(r.sceneLayer.mergeOrder),v.worldFrames[i].mergeOrder);
   for(const q of r.movement.requests){reader.append(p.encodeCommand(q.operationId,q.arguments));requests.push(Buffer.from(c.decode(reader.next().payload)).toString('hex'));}}
  assert.deepEqual(requests,v.protocol.requestPlainHex);p.finish();
 }finally{p.close();c.close();reader.close();res.close();}
});

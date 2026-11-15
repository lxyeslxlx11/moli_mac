/** Frame core in a neutral runtime without Node/browser/WeChat or text codecs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
import { resources } from './original_resources.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-frame-v1'),entry='build/analysis/game-legacy-frame-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/index.mjs';\n");assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),bundle:true,format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'});
const hash=raw=>createHash('sha256').update(raw).digest('hex'),inputs=[],outputs=[];assert.ok(Object.values(built.metafile.outputs).every(row=>row.imports.length===0));
for(const path of Object.keys(built.metafile.inputs)){const raw=await readFile(resolve(root,path));inputs.push({path,bytes:raw.length,sha256:hash(raw)});}
for(const row of built.outputFiles){await writeFile(row.path,row.contents);outputs.push({path:row.path.slice(root.length),bytes:row.contents.length,sha256:hash(row.contents)});}
await writeFile(resolve(directory,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_acceptance:false},null,2)+'\n');
const bundled=await readFile(resolve(directory,'portable.cjs'),'utf8'),v=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url))),av=JSON.parse(await readFile(new URL('../game-legacy-animation-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),plain=x=>JSON.parse(JSON.stringify(x));
function instance(){const module={exports:{}};runInNewContext(bundled,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 TextEncoder:undefined,TextDecoder:undefined,Buffer:undefined,URL:undefined,process:undefined,require:undefined,window:undefined,document:undefined,wx:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,performance:undefined},{timeout:1000});return module.exports;}
test('neutral source callback and native depth sort match1108 independent Python vectors',()=>{
 const api=instance();for(const row of v.plans)assert.deepEqual(plain(api.planLegacyGameActorFrame(row.input)),row.expected);for(const row of v.sorts)assert.deepEqual(plain(api.sortLegacyGameActorDepth(row.input)),row.expected);
});
test('neutral world wire -> local motion -> actor animation ->52 RGBA frames and2 exact source commands',()=>{
 const api=instance(),res=resources(api,av),p=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex)),reader=api.createLegacyGameEnvelopeReader();
 try{p.configureLocalMovement(null,v.sourceContext);p.configureActorResources(8);p.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>v.source,geometry:res.geometry,sprite:res.sprite,initialPhase:0});
   p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');for(const raw of v.protocol.beforePlainHex){p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));assert.equal(p.next().kind,'message');}
   p.requestLocalDestination(v.protocol.destination);const requests=[];for(let i=0;i<52;i++){const frame=p.advanceFrame({tick:1000+i,runtime:v.runtime,camera:[160,192],center:[48,36],width:96,height:72});assert.equal(frame.actorFrameError,null);const a=frame.actorLayer.actors[0];
     assert.deepEqual(plain(a.animation),v.worldFrames[i].animation);assert.deepEqual(plain(a.motion.position),v.worldFrames[i].position);assert.equal(hash(frame.actorLayer.rgba),v.worldFrames[i].rgbaSha256);
     for(const q of frame.movement.requests){reader.append(p.encodeCommand(q.operationId,q.arguments));requests.push(Buffer.from(c.decode(reader.next().payload)).toString('hex'));}}
   assert.deepEqual(requests,v.protocol.requestPlainHex);p.finish();
 }finally{p.close();reader.close();c.close();res.close();}
});

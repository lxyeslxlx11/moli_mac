/** Verify original indexed graphics in a neutral runtime with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-animation-v1');
const entry='build/analysis/game-legacy-animation-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-render.mjs';\nexport * from '../../../shared/legacy-game-graphics.mjs';\nexport * from '../../../shared/legacy-game-animation.mjs';\n");
assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),bundle:true,
  format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'});
const hash=raw=>createHash('sha256').update(raw).digest('hex'),inputs=[],outputs=[];
assert.ok(Object.values(built.metafile.outputs).every(row=>row.imports.length===0));
for(const path of Object.keys(built.metafile.inputs)){const raw=await readFile(resolve(root,path));inputs.push({path,bytes:raw.length,sha256:hash(raw)});}
for(const row of built.outputFiles){await writeFile(row.path,row.contents);outputs.push({path:row.path.slice(root.length),bytes:row.contents.length,sha256:hash(row.contents)});}
await writeFile(resolve(directory,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_acceptance:false},null,2)+'\n');
const source=await readFile(resolve(directory,'portable.cjs'),'utf8');
function instance(){const module={exports:{}};runInNewContext(source,{module,Uint8Array,Uint32Array,ArrayBuffer,DataView,
  TextEncoder:undefined,TextDecoder:undefined,Buffer:undefined,URL:undefined,process:undefined,require:undefined,
  window:undefined,document:undefined,wx:undefined,fetch:undefined,crypto:undefined,
  AbortController:undefined,AbortSignal:undefined,performance:undefined},{timeout:1000});return module.exports;}
const v=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url))),bytes=hex=>new Uint8Array(Buffer.from(hex,'hex'));
const plain=x=>JSON.parse(JSON.stringify(x));
const groups=()=>v.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,x])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(x):x])));
function geometry({kind,value}){const index=kind==='index'?value:value%5000+3000;return{index,originX:index%7-3,originY:index%5-2,width:4*(index%3+1),height:index%4+2};}
function raw(w,h,pixels){const b=new Uint8Array(16+pixels.length),d=new DataView(b.buffer);b.set([82,68]);d.setInt32(4,w,true);d.setInt32(8,h,true);d.setUint32(12,b.length,true);b.set(pixels,16);return b;}
test('neutral full animation numeric catalog and1250 source helper invocations match Python',()=>{
 const api=instance(),c=api.createLegacyGameAnimationCatalog(groups());for(const row of v.animations)assert.deepEqual(plain(c.animation(row.resourceId)),row);
 for(const trace of v.series){const p=api.createLegacyGameAnimationPlayer(c);try{for(const row of trace.steps){if(row.invalidate)p.invalidate();
  if(row.error){assert.throws(()=>p.step(row.context,geometry),e=>e.code===row.error);assert.deepEqual(plain(p.copyState()),row.unchangedState);}
  else assert.deepEqual(plain(p.step(row.context,geometry)),row.expected,trace.name);
 }}finally{p.close();}}c.close();
});
test('neutral animation geometry -> owned sprite -> sourcepriority10 RGBA output matches every ordinary reference frame',()=>{
 const api=instance(),c=api.createLegacyGameAnimationCatalog(groups()),rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);
 const pal=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map();let checked=0;
 try{for(const trace of v.series){const p=api.createLegacyGameAnimationPlayer(c);try{for(const row of trace.steps){if(row.invalidate)p.invalidate();if(row.error){assert.throws(()=>p.step(row.context,geometry));continue;}
  p.step(row.context,geometry);const s=p.copyState();let commands=[];
  if(s.geometry){const g=s.geometry;if(!sprites.has(g.index)){const pixels=Uint8Array.from({length:g.width*g.height},(_,i)=>(i+g.index)%5===0?0:1+(i+g.index)%3),image=api.decodeLegacyGameRD(raw(g.width,g.height,pixels));try{sprites.set(g.index,api.prepareLegacyGameSprite(image,pal));}finally{image.close();}}
   if(row.frameDigest.startsWith('LEGACY_')){assert.throws(()=>p.drawCommand(sprites.get(g.index),16,12),e=>e.code===row.frameDigest);continue;}
   const cmd=p.drawCommand(sprites.get(g.index),16,12);if(cmd)commands=[cmd];
  }
  assert.equal(hash(api.composeLegacyGameFrame(32,24,commands).rgba),row.frameDigest,trace.name);checked++;
 }}finally{p.close();}}assert.ok(checked>1100);
 }finally{sprites.forEach(x=>x.close());pal.close();c.close();}
});

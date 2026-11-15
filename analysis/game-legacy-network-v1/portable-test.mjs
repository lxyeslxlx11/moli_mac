/** Original legacy-envelope checks in a neutral bundle with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-network-v1');
const entry='build/analysis/game-legacy-network-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-envelope.mjs';\n");
assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),
  bundle:true,format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'});
const hash=raw=>createHash('sha256').update(raw).digest('hex'),inputs=[],outputs=[];
assert.ok(Object.values(built.metafile.outputs).every(row=>row.imports.length===0));
for(const path of Object.keys(built.metafile.inputs)){const raw=await readFile(resolve(root,path));inputs.push({path,bytes:raw.length,sha256:hash(raw)});}
for(const row of built.outputFiles){await writeFile(row.path,row.contents);outputs.push({path:row.path.slice(root.length),bytes:row.contents.length,sha256:hash(row.contents)});}
await writeFile(resolve(directory,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_acceptance:false},null,2)+'\n');
const source=await readFile(resolve(directory,'portable.cjs'),'utf8');
function instance(){const module={exports:{}};runInNewContext(source,{module,Uint8Array,ArrayBuffer,DataView,
  TextEncoder:undefined,TextDecoder:undefined,Buffer:undefined,URL:undefined,process:undefined,require:undefined,
  window:undefined,document:undefined,wx:undefined,fetch:undefined,crypto:undefined,
  AbortController:undefined,AbortSignal:undefined,performance:undefined},{timeout:1000});return module.exports;}
const vectors=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url))).vectors;
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex'));
test('neutral envelope bundle matches all24 Python vectors without DOM/Node/wx/text/network APIs',()=>{
  const api=instance();
  for(const row of vectors){const wire=api.encodeLegacyGameEnvelope(bytes(row.payloadHex));assert.equal(hash(wire),hash(bytes(row.frameHex)));
    if(row.payloadBytes>=2){const stream=api.createLegacyGameEnvelopeReader();for(const value of wire)stream.append(new Uint8Array([value]));
      assert.equal(hash(stream.next().payload),row.payloadSha256);stream.finish();}}
});
test('neutral reader retains native small-frame guard, bounded queue and explicit close',()=>{
  const api=instance(),stream=api.createLegacyGameEnvelopeReader();stream.append(api.encodeLegacyGameEnvelope(new Uint8Array()));
  assert.equal(stream.next().reason,'candidate-guard');stream.append(api.encodeLegacyGameEnvelope(bytes('0102')));
  assert.equal(stream.next().payload.length,0);assert.equal(hash(stream.next().payload),hash(bytes('0102')));stream.finish();
  const noisy=api.createLegacyGameEnvelopeReader();noisy.append(new Uint8Array(262144));
  assert.throws(()=>noisy.append(new Uint8Array([1])),value=>value.code==='LEGACY_GAME_QUEUE_BUDGET');noisy.close();
  assert.equal(noisy.inspect().pendingBytes,0);assert.equal(noisy.inspect().state,'closed');
});

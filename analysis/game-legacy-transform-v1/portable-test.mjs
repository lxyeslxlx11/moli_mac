/** Original legacy payload checks in a neutral byte-only bundle, no platform crypto APIs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-transform-v1');
const entry='build/analysis/game-legacy-transform-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-payload.mjs';\nexport * from '../../../shared/legacy-game-envelope.mjs';\n");
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
const vectors=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex');
test('neutral payload bundle matches24 Python transforms and5 arbitrary wire vectors without platform APIs',()=>{
  const api=instance();for(const row of vectors.normal){const codec=api.createLegacyGamePayloadCodec(bytes(row.keyHex));try{
    assert.equal(hex(codec.encode(bytes(row.plainHex))),row.wireHex);if(row.wireHex)assert.equal(hex(codec.decode(bytes(row.wireHex))),row.decodedHex);
  }finally{codec.close();}}
  for(const row of vectors.arbitraryWire){const codec=api.createLegacyGamePayloadCodec(bytes(row.keyHex));try{assert.equal(hex(codec.decode(bytes(row.wireHex))),row.decodedHex);}finally{codec.close();}}
});
test('neutral synthetic bootstrap derives/validates codec then composes frame bytes and closes',()=>{
  const api=instance();for(const row of vectors.bootstrap){const codec=api.createLegacyGamePayloadCodecFromBootstrap(bytes(row.payloadHex));try{
    const payload=codec.encode(bytes(row.probePlainHex));assert.equal(hex(payload),row.probeWireHex);
    const stream=api.createLegacyGameEnvelopeReader();stream.append(api.encodeLegacyGameEnvelope(payload));
    assert.equal(hex(codec.decode(stream.next().payload)),row.probePlainHex);stream.finish();assert.equal(codec.inspect().officialPeerIdentity,'unverified');
  }finally{codec.close();}}
  const broken=bytes(vectors.bootstrap[0].payloadHex);broken[111]^=1;
  assert.throws(()=>api.createLegacyGamePayloadCodecFromBootstrap(broken),error=>error.code==='LEGACY_GAME_BOOTSTRAP_TAG');
});

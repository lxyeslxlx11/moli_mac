/** Map-cache and byte-protocol contracts with all platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-world-v1');
const entry='build/analysis/game-legacy-world-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-map.mjs';\nexport * from '../../../shared/legacy-game-protocol.mjs';\nexport * from '../../../shared/legacy-game-envelope.mjs';\nexport * from '../../../shared/legacy-game-payload.mjs';\n");
assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),bundle:true,
  format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'});
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
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=raw=>Buffer.from(raw).toString('hex'),plain=value=>JSON.parse(JSON.stringify(value));
test('neutral map core matches32 rectangles,96 checks and5 independent patch outputs',()=>{
  const api=instance();for(const row of vectors.rectangleCases){const read=api.readLegacyGameMapRectangle(bytes(vectors.mapHex),row.rectangle);
    assert.deepEqual(plain(read.planes.map(p=>Array.from(p))),row.planes);
    for(const c of row.checksums)assert.deepEqual(plain(api.checksumLegacyGameMapRectangle(bytes(vectors.mapHex),row.rectangle,c.mode)),c.values);}
  for(const row of vectors.patchCases)assert.equal(hex(api.applyLegacyGameMapPatch(bytes(vectors.smallMapHex),row.rectangle,bytes(row.dataHex)).bytes),row.updatedHex);
});
test('neutral protocol produces map request, applies patch, checks consistency and clears on termination',()=>{
  const api=instance(),p=api.createLegacyGameProtocol(),v=vectors.protocol,c=api.createLegacyGamePayloadCodec(bytes(vectors.bootstrap.keyHex));
  try{
    p.configureMapCache(...v.identity,bytes(v.cacheHex),v.mode);p.append(api.encodeLegacyGameEnvelope(bytes(vectors.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');
    for(const key of ['noticeHex','patchHex','finalNoticeHex']){
      p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(v[key]))));const effect=p.next().effect;
      if(key==='noticeHex'){assert.equal(effect.matches,false);const reader=api.createLegacyGameEnvelopeReader();
        reader.append(p.encodeCommand(effect.request.operationId,effect.request.arguments));assert.equal(hex(c.decode(reader.next().payload)),v.requestHex);reader.close();}
      if(key==='patchHex')assert.equal(effect.writtenCells,v.writtenCells);
      if(key==='finalNoticeHex')assert.equal(effect.matches,true);
    }
    assert.equal(hex(p.copyMapCache()),v.updatedHex);p.finish();assert.equal(p.copyGameState().map,null);assert.equal(p.inspect().keyAvailable,false);
  }finally{p.close();c.close();}
});

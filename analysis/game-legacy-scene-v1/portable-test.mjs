/** Scene and source-state contracts with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-scene-v1');
const entry='build/analysis/game-legacy-scene-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),['scene','state','map','protocol','envelope','payload'].map(name=>"export * from '../../../shared/legacy-game-"+name+".mjs';").join('\n')+'\n');
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
const v=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=raw=>Buffer.from(raw).toString('hex'),plain=value=>JSON.parse(JSON.stringify(value));
test('neutral core matches21 scene preparations,119 ordered-state vectors and20 label vectors',()=>{
  const api=instance();for(const row of v.sceneCases){const result=api.prepareLegacyGameSceneTransition(row.arguments,row.previousIdentity,row.previousHex===null?null:bytes(row.previousHex));
    assert.equal(result.cacheAction,row.expected.cacheAction);assert.equal(result.cacheBytes?hex(result.cacheBytes):null,row.expected.cacheHex);}
  for(const row of v.stateCases){const actual=api.decodeLegacyGameStateRecord(row.id,bytes(row.dataHex));
    const selected=Object.fromEntries(Object.keys(row.expected).map(key=>[key,key==='updates'?actual.updates.map(u=>({...u,value:u.value instanceof Uint8Array?{bytesHex:hex(u.value)}:u.value})):actual[key]]));
    assert.deepEqual(plain(selected),row.expected);}
  for(const row of v.labelCases){const label=api.decodeLegacyGameSceneLabel(bytes(row.dataHex));
    assert.deepEqual({labelHex:hex(label.labelBytes),code:label.code,fallbackApplied:label.fallbackApplied},row.expected);}
});
test('neutral world protocol creates/reuses scene cache, requests/applies map and retains ordered-state/label',()=>{
  const api=instance(),p=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex)),effects=[];
  try{
    p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');
    for(const raw of v.protocol.streamPlainHex){p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));const effect=p.next().effect;effects.push(effect);
      if(effect.request){const reader=api.createLegacyGameEnvelopeReader();reader.append(p.encodeCommand(effect.request.operationId,effect.request.arguments));
        assert.equal(hex(c.decode(reader.next().payload)),v.protocol.requestPlainHex);reader.close();}}
    assert.deepEqual(plain(effects.map(e=>e.kind)),v.protocol.effectKinds);assert.equal(effects[0].cacheAction,'created');assert.equal(effects[7].cacheAction,'reused');
    assert.equal(effects[4].matches,false);assert.equal(effects[6].matches,true);assert.equal(effects[11].matches,true);
    const state=p.copyGameState();assert.equal(hex(p.copyMapCache()),v.protocol.updatedCacheHex);assert.deepEqual(plain(state.scene.fields),v.protocol.finalScene);
    assert.equal(state.pose.facingCode,3);assert.equal(hex(state.label.labelBytes),v.protocol.finalLabel.labelHex);
    assert.equal(state.records.records[0].fields[0].value,17);assert.equal(state.records.records[1].fields[17].value,100);
    p.finish();assert.equal(p.copyGameState().scene,null);assert.equal(p.copyGameState().records,null);assert.equal(p.inspect().keyAvailable,false);
  }finally{p.close();c.close();}
});

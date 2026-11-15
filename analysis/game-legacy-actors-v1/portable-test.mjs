/** Actor/motion source contracts with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-actors-v1');
const entry='build/analysis/game-legacy-actors-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),['actors','motion','scene','state','map','protocol','envelope','payload'].map(name=>"export * from '../../../shared/legacy-game-"+name+".mjs';").join('\n')+'\n');
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
function normalize(value){if(value instanceof Uint8Array)return hex(value);if(Array.isArray(value))return Array.from(value,normalize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,val])=>[val instanceof Uint8Array?key+'Hex':key,normalize(val)]));return value;}
test('neutral core matches50/13/9 record vectors,466 directions,44 queue traces,637 resource and23 projection vectors',()=>{
  const api=instance();for(const [key,fn] of [['unitCases','decodeLegacyGameActorList'],['actionCases','decodeLegacyGameActorActions'],['removeCases','decodeLegacyGameActorRemovals']])
    for(const row of v[key])assert.deepEqual(normalize(api[fn](bytes(row.dataHex))),row.expected);
  for(const row of v.directionCases)assert.equal(api.legacyGameFacingCode(row.x,row.y),row.expected);
  for(const row of v.resourceCases){assert.equal(api.classifyLegacyGameActorResource(row.value),row.grade);assert.equal(api.resolveLegacyGameActorResource(row.value,row.code),row.expected);}
  for(const row of v.projectionCases)assert.deepEqual(plain(api.projectLegacyGamePosition(row.position,row.camera,row.center)),row.expected);
  for(const row of v.motionCases){const m=api.createLegacyGameActorMotion(row.origin,0,row.speed);for(const p of row.targets)m.enqueue(p);for(const expected of row.expected)assert.deepEqual(plain(m.step()),expected);m.close();}
});
test('neutral world handles actual entity/state byte stream, explicit tick, movement request, scene and deletion cleanup',()=>{
  const api=instance(),p=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex)),effects=[];
  try{p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');
    function send(raw){p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));const event=p.next();effects.push(event.effect.kind);return event;}
    for(const raw of v.protocol.beforePlainHex)send(raw);p.advanceActors();p.advanceActors();const s=p.copyGameState();
    assert.equal(s.actors.remoteCount,3);assert.equal(s.actors.localActor.motion.speed,80);assert.equal(s.records.records[0].fields[14].value,77);
    assert.deepEqual(plain(s.actors.remoteActors.find(a=>a.id===200).motion.position),[136,192]);
    const r=api.createLegacyGameEnvelopeReader();r.append(p.encodeMovement([2,3],bytes(v.protocol.directionsHex)));assert.equal(hex(c.decode(r.next().payload)),v.protocol.requestPlainHex);r.close();
    for(const raw of v.protocol.afterPlainHex)send(raw);assert.deepEqual(effects,v.protocol.effectKinds);assert.equal(p.copyGameState().actors.remoteCount,0);assert.equal(p.copyGameState().actors.localActor,null);
    assert.equal(p.copyGameState().records.records[1].fields[17].value,-2);p.finish();assert.equal(p.copyGameState().actors,null);assert.equal(p.inspect().keyAvailable,false);
  }finally{p.close();c.close();}
});

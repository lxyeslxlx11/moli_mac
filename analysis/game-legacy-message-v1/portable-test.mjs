/** Source-bound message/protocol core bundled with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-message-v1');
const entry='build/analysis/game-legacy-message-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-message.mjs';\nexport * from '../../../shared/legacy-game-protocol.mjs';\nexport * from '../../../shared/legacy-game-envelope.mjs';\nexport * from '../../../shared/legacy-game-payload.mjs';\n");
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
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=raw=>Buffer.from(raw).toString('hex');
const args=row=>row.values.map(value=>typeof value==='number'?value:bytes(value.bytesHex));
test('neutral text core matches all numeric/field vectors,60 writers and104 typed branches',()=>{
  const api=instance();for(const row of vectors.integerWrites)assert.equal(hex(api.encodeLegacyGameInteger(row.value)),row.hex);
  for(const row of vectors.integerReads)assert.equal(api.decodeLegacyGameInteger(bytes(row.hex)),row.value);
  for(const row of vectors.fields){assert.equal(hex(api.encodeLegacyGameTextField(bytes(row.rawHex))),row.escapedHex);assert.equal(hex(api.decodeLegacyGameTextField(bytes(row.escapedHex))),row.decodedHex);}
  for(const row of vectors.outgoing)assert.equal(hex(api.encodeLegacyGameCommand(row.id,args(row))),row.plainHex);
  for(const row of vectors.incoming){const actual=api.decodeLegacyGameMessage(bytes(row.plainHex));
    const converted=actual.arguments.map(value=>typeof value==='number'?value:{bytesHex:hex(value)});
    assert.equal(actual.operationId,row.id);assert.deepEqual(JSON.parse(JSON.stringify(converted)),row.decoded);}
});
test('neutral protocol bootstrap/reset/old-key/rekey and position projection compose without platform APIs',()=>{
  const api=instance(),p=api.createLegacyGameProtocol();let old=api.createLegacyGamePayloadCodec(bytes(vectors.bootstrap[0].keyHex));
  try{
    p.append(api.encodeLegacyGameEnvelope(bytes(vectors.bootstrap[0].payloadHex)));assert.equal(p.next().kind,'bootstrap');
    p.append(api.encodeLegacyGameEnvelope(old.encode(bytes(vectors.protocol.resetPlainHex))));assert.equal(p.next().message.kind,'reset-bootstrap');
    assert.equal(p.inspect().keyAvailable,true);assert.equal(p.inspect().awaitingBootstrap,true);
    const row=vectors.outgoing[0],wire=p.encodeCommand(row.id,args(row)),r=api.createLegacyGameEnvelopeReader();r.append(wire);
    assert.equal(hex(old.decode(r.next().payload)),row.plainHex);r.finish();
    p.append(api.encodeLegacyGameEnvelope(bytes(vectors.bootstrap[1].payloadHex)));assert.equal(p.next().kind,'bootstrap');old.close();old=api.createLegacyGamePayloadCodec(bytes(vectors.bootstrap[1].keyHex));
    p.append(api.encodeLegacyGameEnvelope(old.encode(bytes(vectors.protocol.newPoseHex))));assert.equal(p.next().effect.kind,'network-position');
    assert.deepEqual([...p.copyGameState().pose.scaledCoordinates],vectors.protocol.newPose.scaledCoordinates);p.finish();assert.equal(p.inspect().keyAvailable,false);
  }finally{old.close();p.close();}
});

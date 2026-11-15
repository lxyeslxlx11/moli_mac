/** Actual bundled pure configuration and existing resource codecs in a no-DOM runtime; not a native game run. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=resolve(root,'build/analysis/game-config-v1');
await mkdir(out,{recursive:true});
await writeFile(resolve(out,'portable-entry.mjs'),"export * from '../../../shared/game-config.mjs';\nexport {createLauncherResourceSnapshot} from '../../../shared/launcher-resources.mjs';\nexport {encodeLauncherResourceCacheRecord,decodeLauncherResourceCacheRecord} from '../../../shared/launcher-resource-cache.mjs';\n");
assert.equal(esbuild.version,'0.25.12');
const build=await esbuild.build({absWorkingDir:root,entryPoints:['build/analysis/game-config-v1/portable-entry.mjs'],
  outfile:resolve(out,'portable.cjs'),bundle:true,format:'cjs',platform:'neutral',target:'es2020',metafile:true,write:false,logLevel:'silent'});
assert.ok(Object.values(build.metafile.outputs).every(row=>row.imports.length===0));
for(const file of build.outputFiles)await writeFile(file.path,file.contents);
const sha=value=>createHash('sha256').update(value).digest('hex'),inputs=[];
for(const name of Object.keys(build.metafile.inputs)){const raw=await readFile(resolve(root,name));inputs.push({path:name,bytes:raw.length,sha256:sha(raw)});}
const outputs=build.outputFiles.map(file=>({path:file.path.slice(root.length),bytes:file.contents.length,sha256:sha(file.contents)}));
await writeFile(resolve(out,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_effect_acceptance:false},null,2)+'\n');
const source=await readFile(resolve(out,'portable.cjs'),'utf8'),vectors=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url),'utf8'));
function instance(){const module={exports:{}};runInNewContext(source,{module,Uint8Array,ArrayBuffer,DataView,
  TextEncoder:undefined,TextDecoder:undefined,URL:undefined,Buffer:undefined,fetch:undefined,process:undefined,require:undefined,
  wx:undefined,window:undefined,document:undefined,crypto:undefined,performance:undefined,AbortController:undefined,AbortSignal:undefined},{timeout:1000});return module.exports;}
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex'));

test('bundled configuration codec runs all64 exact writer vectors without DOM/Node/wx/text globals',()=>{
  const api=instance();for(const row of vectors.writer){const raw=api.encodeGameConfig(row.settings);assert.equal(Buffer.from(raw).toString('hex'),row.hex);
    assert.equal(JSON.stringify(api.decodeGameConfig(raw).settings),JSON.stringify(row.settings));}
});
test('bundled configuration bytes integrate into exact-source resources.v2 and original cache record',()=>{
  const api=instance(),settings=vectors.writer.at(-1).settings,binding={gameListMd5:'1'.repeat(32),regionListMd5:'2'.repeat(32),
    gameOrdinal:0,referenceOrdinal:0,regionOrdinal:0,gameCodeText:'11',directoryText:'C:\\Original',pathEncoding:'ascii',patchSourceProfile:'puk3-195f3afd',patchSourceOrdinal:1};
  const config=api.encodeGameConfig(settings),resources=api.createLauncherResourceSnapshot({binding,files:[{path:'Config.dat',bytes:config}]}),record=api.encodeLauncherResourceCacheRecord({revision:1,resources});
  config.fill(0);const saved=api.decodeLauncherResourceCacheRecord(record);assert.equal(saved.resources.schema,'moli.launcher.resources.v2');assert.equal(saved.resources.binding.patchSourceOrdinal,1);
  assert.equal(JSON.stringify(api.decodeGameConfig(saved.resources.files[0].bytes).settings),JSON.stringify(settings));assert.equal(saved.trust,'unverified');
});
test('bundled decoder retains explicit NUL/read boundaries and rejects unknown native parse states',()=>{
  const api=instance(),source=bytes('33446465766963653a3200736f756e646f6666'),parsed=api.decodeGameConfig(source);
  assert.equal(parsed.settings.deviceCode,2);assert.equal(parsed.settings.soundOff,false);assert.equal(parsed.boundary,'nul-in-read');
  assert.throws(()=>api.decodeGameConfig(new Uint8Array()),error=>error.code==='GAME_CONFIG_DEVICE_MISSING');assert.equal(api.createDefaultGameConfig().deviceCode,1);
});

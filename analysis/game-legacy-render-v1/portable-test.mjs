/** Verify original indexed graphics in a neutral runtime with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-render-v1');
const entry='build/analysis/game-legacy-render-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),"export * from '../../../shared/legacy-game-render.mjs';\nexport * from '../../../shared/legacy-game-graphics.mjs';\n");
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
test('neutral source byte decoder,palette and ordinary frame match all original Python vectors',()=>{
  const api=instance();for(const row of v.rdCases){const i=api.decodeLegacyGameRD(bytes(row.inputHex));assert.equal(hash(i.copyPixels()),row.pixelsSha256);assert.equal(Buffer.from(i.copyPalette()).toString('hex'),row.paletteHex);i.close();}
  for(const row of v.paletteCases){const t=row.lutsHex?Object.fromEntries(['red','green','blue'].map((k,i)=>[k,bytes(row.lutsHex[i])])):undefined;
    const p=api.createLegacyGamePalette32(bytes(row.inputHex),row.mode,t);assert.deepEqual(Array.from(p.copyColors()),row.colors);assert.deepEqual(Array.from(p.copyKnownMask()),row.known);p.close();}
  const cgp=api.decodeLegacyGameCGP(bytes(v.cgpCases[0].inputHex));assert.equal(hash(cgp.copyOriginalRGB()),v.cgpCases[0].originalSha256);assert.equal(hash(cgp.copyCurrentRGB()),v.cgpCases[0].currentSha256);
  const p=api.createLegacyGamePalette32(cgp.copyCurrentRGB(),'default-rgb'),images=v.spriteCases.map(r=>api.decodeLegacyGameRD(bytes(r.rdHex))),sprites=images.map(i=>api.prepareLegacyGameSprite(i,p));
  for(let n=0;n<sprites.length;n++)assert.equal(hash(sprites[n].copyRGBA()),v.spriteCases[n].rgbaSha256);
  for(const row of v.frameCases){const f=api.composeLegacyGameFrame(row.width,row.height,row.commands.map(c=>({...c,sprite:sprites[c.sprite]})));assert.equal(hash(f.rgba),row.rgbaSha256);assert.deepEqual(Array.from(f.drawOrder),row.drawOrder);}
  for(const h of [...images,...sprites,p,cgp])h.close();
});
test('neutral opt-in catalog archive binding owns its image and upstream close cannot erase sprite',()=>{
  const api=instance(),rd=bytes(v.spriteCases[0].rdHex),archive=new Uint8Array(rd.length+7);archive.set(rd,7);
  const record=new Uint8Array(40),view=new DataView(record.buffer);view.setUint32(4,7,true);view.setUint32(8,rd.length,true);view.setInt32(12,-2,true);view.setInt32(16,1,true);view.setUint32(20,4,true);view.setUint32(24,2,true);view.setUint32(36,1000,true);
  const catalog=api.createLegacyGameGraphicCatalog([record],{includeImages:true}),image=api.decodeLegacyGameGraphic(archive,catalog.image(1000)),cgp=api.decodeLegacyGameCGP(bytes(v.cgpCases[0].inputHex)),palette=api.createLegacyGamePalette32(cgp.copyCurrentRGB(),'default-rgb'),sprite=api.prepareLegacyGameSprite(image,palette);
  record.fill(0);archive.fill(0);catalog.close();image.close();palette.close();cgp.close();assert.equal(hash(sprite.copyRGBA()),v.spriteCases[0].rgbaSha256);sprite.close();assert.throws(()=>sprite.copyRGBA(),e=>e.code==='LEGACY_RENDER_CLOSED');
});

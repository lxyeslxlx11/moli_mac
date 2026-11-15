import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const generated=process.argv[2]==='generated';
const api=generated?createRequire(import.meta.url)(resolve('build/wechat-game-stage289-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('./material-profile.json',import.meta.url)));
const expected=JSON.parse(readFileSync('build/analysis/game-legacy-material-compat-v1/corpus-oracle.json'));
const fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
const sha=b=>createHash('sha256').update(b).digest('hex');
try{
 await library.initialize();
 const graphics=library.catalogs().graphics;
 assert.equal(graphics.inspect().records,expected.records);
 const metadata=createHash('sha256'),lookup=createHash('sha256'),buffer=new Uint8Array(40),v=new DataView(buffer.buffer),word=new Uint8Array(4),wv=new DataView(word.buffer);
 for(let i=0;i<expected.capacity;i++){
  const g=graphics.imageAt(i),m=graphics.metadataAt(i);
  const words=[i,g.present?g.group+1:0,g.byteOffset,g.byteLength,g.originX,g.originY,g.width,g.height,m.tileWidth|(m.tileHeight<<8)|(m.rawFlags<<16),graphics.resourceIdAt(i)];
  words.forEach((n,k)=>v.setUint32(k*4,n,true));metadata.update(buffer);
  wv.setUint32(0,graphics.lookup(i).index,true);lookup.update(word);
 }
 const md=metadata.digest('hex'),ld=lookup.digest('hex');assert.equal(md,expected.metadata_sha256);assert.equal(ld,expected.lookup_sha256);
 let accepted=0,rejected=0,libraryRenders=0,reservedIndices=0;const rows=[];
 for(const row of expected.samples){
  const raw=await archive.port.read(row.graphic,row.offset,row.length);assert.equal(sha(raw),row.input_sha256);
  const command={image:{index:row.index,paletteSelector:0,flags:0,color:0xffffffff},x:0,y:0,priority:0};
  if(row.status==='rejected'){
   assert.throws(()=>api.decodeLegacyGameRD(raw),e=>e.code===row.code);raw.fill(0);rejected++;continue;
  }
  let image,embedded,sprite;
  try{
   image=api.decodeLegacyGameRD(raw);if(image.inspect().paletteBytes)embedded=api.createLegacyGamePalette32(image.copyPalette(),'embedded-bgr');
   sprite=api.prepareLegacyGameSprite(image,embedded??library.catalogs().palette);const rgba=sprite.copyRGBA();
   assert.equal(sha(rgba),row.rgba_sha256,'prepared '+row.index);rgba.fill(0);
  }finally{sprite?.close();embedded?.close();image?.close();raw.fill(0);}
  if(row.index<1000){assert.throws(()=>api.createLegacyGameDrawPlan(row.width,row.height,[command]),e=>e.code==='LEGACY_ASSET_INTEGER');reservedIndices++;}
  else{
  const final=row.library;assert.equal(final.status,'accepted');
  const frame=await library.startRender(api.createLegacyGameDrawPlan(final.width,final.height,[command])).done;
  assert.equal(sha(frame.rgba),final.rgba_sha256,'image '+row.index);frame.rgba.fill(0);libraryRenders++;
  }
  accepted++;rows.push([row.index,row.rgba_sha256,row.library?.rgba_sha256??null]);
 }
 assert.equal(accepted,expected.accepted);assert.equal(rejected,expected.rejected);
 let animationFrames=0;const animationDigests=[];
 for(const row of expected.animation_samples){
  const a=library.catalogs().animations.animation(row.resource);
  const canonical=[a.resourceId,a.group,a.version,a.actionCount,a.byteOffset,a.consumedBytes,a.actions.map(q=>[q.direction,q.action,q.duration,q.delayTicks,q.frameCount,q.paletteSelector,q.flags,q.color,q.frames.map(f=>[f.graphicIndex,f.x,f.y,f.event])]),a.attachments.map(f=>[f.graphicIndex,f.x,f.y])];
  assert.equal(sha(Buffer.from(JSON.stringify(canonical))),row.sha256,'animation '+row.resource);animationFrames+=row.frames;animationDigests.push([row.resource,row.sha256]);
 }
 console.log(JSON.stringify({records:expected.records,capacity:expected.capacity,metadata_sha256:md,lookup_sha256:ld,samples:expected.sample_count,accepted,rejected,libraryRenders,reservedIndices,indexOverwrites:expected.index_overwrites,crossGroupOverwrites:expected.cross_group_overwrites,pixel_digest:sha(Buffer.from(JSON.stringify(rows))),animationSamples:expected.animation_samples.length,animationFrames,animationDigest:sha(Buffer.from(JSON.stringify(animationDigests))),library:library.inspect(),archive:archive.inspect(),source_generated_comparison:true}));
}finally{library.close();archive.close();}

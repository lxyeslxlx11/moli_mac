/** Unchanged RD corpus; independent placement checks capture/cached-copy pixels, not RD decoding. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const mode=process.argv[2]==='generated'?'generated':'source',api=mode==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage299-api-final/game.js')):await import('../../shared/index.mjs');
const root='build/analysis/game-battle-water-v1',out=resolve(root,'material-'+mode);fs.mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),profileBytes=fs.readFileSync('analysis/game-legacy-material-compat-v1/material-profile.json'),profile=JSON.parse(profileBytes),fd=fs.openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:fs.fstatSync(fd).size,async read(at,n){const b=new Uint8Array(n);assert.equal(fs.readSync(fd,b,0,n,at),n);return b},close(){fs.closeSync(fd)}});
const plan=api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),library=api.createLegacyGameResourceLibrary({plan,files:archive.port,paletteMode:'neutral'}),cases=[];
try{
 const catalogs=await library.initialize();
 for(const [number,id]of [5000,5001,5002,5003,5004,5005,5006,5007,5008,8946].entries()){
  const g=catalogs.graphics.image(id);assert.equal(g.index,3096+number);assert.equal(g.group,0);
  const raw=await archive.port.read('Bin/Graphic_20.bin',g.byteOffset,g.byteLength),image=api.decodeLegacyGameRD(raw),sprite=api.prepareLegacyGameSprite(image,catalogs.palette),pixels=sprite.copyRGBA();
  assert.equal(image.copyPalette().length,0);const expected=new Uint8Array(640*480*4);
  // A plain, independent integer copy into a cleared frame. No product compose call.
  for(let y=0;y<g.height;y++)for(let x=0;x<g.width;x++){const dx=320+g.originX+x,dy=240+g.originY+y,at=(y*g.width+x)*4;if(dx>=0&&dx<640&&dy>=0&&dy<480&&pixels[at+3])expected.set(pixels.subarray(at,at+4),(dy*640+dx)*4);}
  const water=api.createLegacyGameWater();for(let i=0;i<51;i++){water.advance();water.present(true,40000,[0,0],[0,0],[320,240]);}
  const b=api.createLegacyGameBattleState(null,null,null,water);
  try{
   b.configureBodyPlayback({animations:catalogs.animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});b.configureFrames({graphics:catalogs.graphics});
   b.configureWaterContext({mapId:40000,position:[0,0],camera:[0,0],center:[320,240],nativeGate:1,localPresent:false});
   b.applyEntry(1,id);b.receive(new TextEncoder().encode('C|20|'),10);b.consumeCharacters();
   const cached=b.stepFrame({width:640,height:480});assert.equal(cached.waterRequested,undefined);assert.equal(water.copyState().amplitude,100);
   const cachedOutput=await library.startRender(cached.drawPlan).done;assert.deepEqual(cachedOutput.rgba,expected);
   const before=water.copyState();b.configureEntry({entryWindowPresent:false});let captures=0;
   for(let i=0;i<54;i++){
    const step=b.advanceEntry(1000+i*16);if(!step.capturePlan)continue;captures++;assert.ok(!step.capturePlan.commands.some(c=>c.waterStrip));
    const result=await library.startRender(step.capturePlan).done;assert.deepEqual(result.rgba,expected);assert.equal(water.copyState().amplitude,0);
    fs.writeFileSync(resolve(out,id+'-capture-'+captures+'.rgba.gz'),gzipSync(result.rgba));result.rgba.fill(0);
   }
   const state=water.copyState();assert.equal(captures,2);assert.equal(state.phase,before.phase);assert.equal(state.updates,before.updates);assert.equal(state.passes-before.passes,56);assert.equal(b.copyCommands().playback.passes,0);
   cases.push({resourceId:id,...g,rdSha256:sha(raw),rgbaSha256:sha(expected),captures,cachedCopies:1,cachedCopyDoesNotTrigger:true,waterBefore:before,waterAfter:state,bodyCallbacks:0});
  }finally{b.close();water.copyState();water.close();image.close();sprite.close();raw.fill(0);pixels.fill(0);expected.fill(0);}
 }
 const result={stage:299,mode,width:640,height:480,profileSha256:sha(profileBytes),cases,archiveBytes:fs.statSync(profile.archive).size,artworkUnchanged:true,referenceScope:'Independent placement of shared-decoded unchanged sprites; no independent RD decoder and no original program execution'};
 fs.writeFileSync(resolve(root,'material-'+mode+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({stage:299,mode,resources:cases.length,captures:cases.reduce((n,r)=>n+r.captures,0),cachedCopies:cases.length,fullFrames:cases.length*3,digest:sha(JSON.stringify(cases))}));
}finally{library.close();archive.close();}

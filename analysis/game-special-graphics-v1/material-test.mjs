/** Actual unchanged RD files, authored map and ordinary owner; only compressed private rasters leave memory. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {mapBytes} from '../game-legacy-scene-frame-v1/original_resources.mjs';
const mode=process.argv[2]==='generated'?'generated':'source',api=mode==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage298-api-final/game.js')):await import('../../shared/index.mjs');
const root='build/analysis/game-special-graphics-v1',out=resolve(root,'material-'+mode);fs.mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),profileBytes=fs.readFileSync('analysis/game-legacy-material-compat-v1/material-profile.json'),profile=JSON.parse(profileBytes),fd=fs.openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:fs.fstatSync(fd).size,async read(at,n){const b=new Uint8Array(n);assert.equal(fs.readSync(fd,b,0,n,at),n);return b},close(){fs.closeSync(fd)}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
const runtime={runtimeStage:0,ownGateByte:0,movementScale:1,soundScene:0,sparseMode:0},cases=[],graphics=[];
let controller,map;
try{
 const catalogs=await library.initialize();
 for(const id of [5000,5001,5002,5003,5004,5005,5006,5007,5008,5009,8946,1099]){
  const g=catalogs.graphics.image(id),raw=await archive.port.read('Bin/Graphic_20.bin',g.byteOffset,g.byteLength);graphics.push({resourceId:id,...g,rdSha256:sha(raw)});raw.fill(0);
 }
 assert.deepEqual(graphics.slice(0,9).map(g=>g.index),Array.from({length:9},(_,i)=>3096+i));assert.equal(graphics[9].index,2912);assert.equal(graphics[10].index,3105);
 controller=api.createLegacyGameSceneFrameController({graphics:catalogs.graphics,animations:catalogs.animations,cut:null,geometry:library.geometry,context:()=>({tileCenter:[6,6],drawPrimitives:false}),deferImages:true});
 const scene={identity:[7,40000],checksumMode:0};
 for(let i=0;i<64;i++){
  const floor=Array.from({length:144},(_,j)=>i===0?5009:j%11===0?1099:5000+j%9),objects=new Array(144).fill(0);if(i>0)objects[6*12+7]=8946;
  map?.close();map=api.createLegacyGameMapState(7,40000,mapBytes(12,12,[floor,objects,new Array(144).fill(16384)]),0);
  const position=[384+i*.5,384+i*.25],request={tick:i,runtime,camera:position,center:[320,240],width:640,height:480},layer=controller.step(request,scene,map,[],undefined,[],false,position),plan=layer.drawPlan;
  assert.equal(!!layer.waterEffect,i!==0);const full=await library.startRender(plan).done;
  const low=await library.startRender(api.createLegacyGameDrawPlan(640,480,plan.commands.filter(c=>c.priority<2))).done;
  const high=await library.startRender(api.createLegacyGameDrawPlan(640,480,plan.commands.filter(c=>c.priority>=2&&!c.waterStrip))).done;
  for(let p=3;p<high.rgba.length;p+=4)assert.ok(high.rgba[p]===0||high.rgba[p]===255);
  const row={frame:i,water:layer.waterEffect??null,commands:plan.commands.length,low:sha(low.rgba),high:sha(high.rgba),full:sha(full.rgba)};
  for(const [key,value]of Object.entries({low:low.rgba,high:high.rgba,full:full.rgba})){fs.writeFileSync(resolve(out,i+'-'+key+'.rgba.gz'),gzipSync(value));value.fill(0);}
  cases.push(row);
 }
 const result={stage:298,mode,width:640,height:480,profileSha256:sha(profileBytes),graphics,cases,state:controller.copyWaterState(),archiveBytes:fs.statSync(profile.archive).size,artworkUnchanged:true,sceneAuthored:true,officialSceneObserved:false};
 fs.writeFileSync(resolve(root,'material-'+mode+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({stage:298,mode,frames:cases.length,resources:graphics.length,digest:sha(JSON.stringify(cases)),waterPasses:cases.filter(r=>r.water).length}));
}finally{controller?.close();map?.close();library.close();archive.close();}

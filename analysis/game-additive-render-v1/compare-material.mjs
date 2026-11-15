import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage293-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),v=JSON.parse(readFileSync('build/analysis/game-additive-render-v1/material-oracle.json'));
const sha=b=>createHash('sha256').update(b).digest('hex'),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
const command=(index,x,y,priority,paletteSelector=0,flags=0,extra={})=>({image:{index,paletteSelector,flags,color:0xffffffff},x,y,priority,...extra});
try{
 await library.initialize();assert.deepEqual(api.legacyGameNamedPalette(947),{selector:947,resourceId:113685});const rows=[];
 for(const row of v.frames){const commands=[];
  for(let y=0;y<row.frame_height;y+=48)for(let x=0;x<row.frame_width;x+=64)commands.push(command(v.floor.index,x,y,5,0,0,{sourceRectangle:v.floor_patch}));
  commands.push(command(row.index,4,4,10,row.selector,row.flags));const output=await library.startRender(api.createLegacyGameDrawPlan(row.frame_width,row.frame_height,commands)).done;assert.equal(sha(output.rgba),row.rgba_sha256,'actual additive '+row.action+':'+row.ordinal);assert.notEqual(sha(output.rgba),row.normal_sha256);rows.push([row.action,row.ordinal,row.index,row.rgba_sha256]);output.rgba.fill(0);
 }
 assert.equal(library.inspect().stats.namedPalettesDecoded,1);console.log(JSON.stringify({stage:293,selector:947,resource:113685,actions:v.actions.length,frames:v.frames.length,completeAdditiveRGBA:true,opaqueFloorTile:v.floor_tile,differentFromNormal:true,changedPixels:v.frames.reduce((n,r)=>n+r.changed_pixels,0),saturatedChannels:v.frames.reduce((n,r)=>n+r.saturated_channels,0),digest:sha(Buffer.from(JSON.stringify(rows))),paletteSha256:v.palette_sha256,sourceGeneratedComparable:true,originalExecution:false}));
}finally{library.close();archive.close();}

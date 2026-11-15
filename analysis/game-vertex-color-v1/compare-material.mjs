import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage294-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),v=JSON.parse(readFileSync('build/analysis/game-vertex-color-v1/material-oracle.json'));
const sha=b=>createHash('sha256').update(b).digest('hex'),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
const command=(index,x,y,priority,paletteSelector=0,flags=0,color=0xffffffff,extra={})=>({image:{index,paletteSelector,flags,color},x,y,priority,flip:flags&3,...extra});
try{
 const catalogs=await library.initialize(),rows=[];
 for(const row of v.frames){const action=catalogs.animations.animation(row.resource).actions.find(a=>a.direction===row.direction&&a.action===row.action);assert.equal(action.color,row.color);assert.equal(action.flags,row.flags);assert.equal(action.paletteSelector,row.selector);assert.equal(action.frames[row.ordinal].graphicIndex,row.index);const commands=[];
  for(let y=0;y<row.frame_height;y+=48)for(let x=0;x<row.frame_width;x+=64)commands.push(command(v.floor.index,x,y,5,0,0,0xffffffff,{sourceRectangle:v.floor_patch}));
  commands.push(command(row.index,4,4,10,row.selector,row.flags,row.color));const output=await library.startRender(api.createLegacyGameDrawPlan(row.frame_width,row.frame_height,commands)).done;assert.equal(sha(output.rgba),row.rgba_sha256,'actual ARGB '+row.resource+':'+row.direction+':'+row.ordinal);assert.notEqual(sha(output.rgba),row.opaque_sha256);if(row.flags&8)assert.notEqual(sha(output.rgba),row.alpha_reference_sha256);rows.push([row.resource,row.direction,row.ordinal,row.index,row.rgba_sha256]);output.rgba.fill(0);
 }
 assert.equal(library.inspect().stats.namedPalettesDecoded,17);console.log(JSON.stringify({stage:294,actions:v.actions.length,frames:v.frames.length,namedCarriers:17,completeReferencedRGBA:true,opaqueFloorTile:v.floor_tile,differentFromOpaque:true,changedPixels:v.frames.reduce((n,r)=>n+r.changed_pixels,0),additiveFrames:v.frames.filter(r=>r.flags&8).length,partialCarriers:Object.values(v.carriers).filter(r=>r.palette_bytes<768).map(r=>({resource:r.source.resource,bytes:r.palette_bytes})),digest:sha(Buffer.from(JSON.stringify(rows))),sourceGeneratedComparable:true,originalExecution:false}));
}finally{library.close();archive.close();}

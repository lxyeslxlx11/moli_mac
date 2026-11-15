import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage291-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),v=JSON.parse(readFileSync('build/analysis/game-legacy-minimap-v1/material-oracle.json'));
const sha=b=>createHash('sha256').update(b).digest('hex'),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
try{
 await library.initialize();const colors=await library.minimapColorTable(v.selected_colors.map(r=>r.tile));for(const row of v.selected_colors)assert.equal(colors[row.tile],row.expected,'native-order color '+row.tile);
 const aut=await library.readMinimapAUT(v.selector),identity=v.inventory.find(r=>r.path.toLowerCase()==='bin/puk2/cutdat/59529.aut');assert.equal(sha(aut),identity.sha256);assert.equal(aut.length,identity.bytes);
 const cut=await library.readCut({checksumMode:1,resolvedSelector:v.selector}),animation=library.catalogs().animations.animation(cut.entry(1116).resourceId);assert.equal(animation.resourceId,113058);assert.ok(animation.actions.some(a=>a.frameCount>1));
 const rgba=[];
 for(const row of v.RGB_cases){const w=api.legacyGameMinimapWindow(12,12,[2,3],row.zoom),planes=Array.from({length:3},()=>new Uint16Array(w.width*w.height));
  for(let y=0;y<w.height;y++)for(let x=0;x<w.width;x++)if(x+w.origin[0]>=0&&y+w.origin[1]>=0&&x+w.origin[0]<12&&y+w.origin[1]<12)planes[2][y*w.width+x]=0x4000;
  const grid=api.createLegacyGameMinimapGrid({...w,mode:1,planes,autRGB:aut}),frame=api.renderLegacyGameMinimap(grid,null,1);assert.equal(sha(new Uint8Array(grid.pixels.buffer)),row.grid_sha256);assert.equal(sha(frame.rgba),row.rgba_sha256);rgba.push(row.rgba_sha256);grid.pixels.fill(0);frame.rgba.fill(0);for(const p of planes)p.fill(0);
 }
 colors.fill(0);aut.fill(0);cut.close();console.log(JSON.stringify({stage:291,files:archive.inspect().files,CUT_files:v.CUT_files,AUT_files:v.AUT_files,colorCases:v.selected_colors.length,eligibleTiles:v.eligible_tiles,colorDigest:sha(Buffer.from(JSON.stringify(v.selected_colors.map(r=>[r.tile,r.expected])))),selector:v.selector,animation:113058,animationFrames:animation.actions.reduce((n,a)=>n+a.frameCount,0),RGBRasters:rgba,sourceGeneratedComparable:true,originalExecution:false}));
}finally{library.close();archive.close();}

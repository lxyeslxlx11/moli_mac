import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage291-api-final/game.js')):await import('../../shared/index.mjs');
const v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url))),bytes=h=>new Uint8Array(Buffer.from(h,'hex')),sha=b=>createHash('sha256').update(b).digest('hex'),rows=[];
const graphics=api.createLegacyGameGraphicCatalog([bytes(v.graphicInfoHex)]),colors=new Uint8Array(65536);for(const [id,c]of v.colors)colors[id]=c;
try{
 for(const row of v.cases){const w=api.legacyGameMinimapWindow(64,64,row.center,row.zoom),planes=row.planesHex.map(h=>{const b=bytes(h),view=new DataView(b.buffer);return Uint16Array.from({length:b.length/2},(_,i)=>view.getUint16(i*2,true));}),grid=api.createLegacyGameMinimapGrid({...w,mode:row.mode,planes,...(row.mode===1?{autRGB:bytes(v.AUTRGBHex)}:{colors,graphics})});
  assert.equal(sha(new Uint8Array(grid.pixels.buffer)),row.gridSha256);for(const r of row.rasters){const frame=api.renderLegacyGameMinimap(grid,Uint32Array.from(v.palette32),r.marker);assert.equal(sha(frame.rgba),r.rgbaSha256);rows.push(['raster',row.mode,row.zoom,r.marker,r.rgbaSha256]);frame.rgba.fill(0);}grid.pixels.fill(0);for(const p of planes)p.fill(0);
 }
 for(const row of v.averages){const color=api.legacyGameMinimapColor(bytes(row.pixelsHex),bytes(row.paletteHex));assert.equal(color,row.expected);rows.push(['average',color]);}
 const blink=api.createLegacyGameMinimapBlink();for(const row of v.clock){const color=blink.next(row.mode,row.tick);assert.equal(color,row.color);rows.push(['clock',row.mode,row.tick,color]);}blink.close();
 console.log(JSON.stringify({stage:291,grids:9,rasters:18,averages:20,clock:11,rows:rows.length,digest:sha(Buffer.from(JSON.stringify(rows))),originalExecution:false}));
}finally{graphics.close();colors.fill(0);}

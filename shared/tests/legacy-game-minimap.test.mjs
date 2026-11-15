import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {clientFixture,clientEnter} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-minimap-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex')),sha=b=>createHash('sha256').update(b).digest('hex');
const planesFor=row=>row.planesHex.map(hex=>{const b=bytes(hex),v=new DataView(b.buffer);return Uint16Array.from({length:b.length/2},(_,i)=>v.getUint16(i*2,true));});
for(const row of vectors.cases)test('independent minimap grid/raster mode'+row.mode+' zoom'+row.zoom,()=>{
 const graphics=api.createLegacyGameGraphicCatalog([bytes(vectors.graphicInfoHex)]),colors=new Uint8Array(65536),planes=planesFor(row);for(const [id,value]of vectors.colors)colors[id]=value;
 let grid;
 try{
  const window=api.legacyGameMinimapWindow(64,64,row.center,row.zoom);assert.deepEqual(window.origin,row.origin);
  grid=api.createLegacyGameMinimapGrid({...window,mode:row.mode,planes,...(row.mode===1?{autRGB:bytes(vectors.AUTRGBHex)}:{graphics,colors})});
  assert.equal(sha(new Uint8Array(grid.pixels.buffer)),row.gridSha256);
  for(const raster of row.rasters){const out=api.renderLegacyGameMinimap(grid,Uint32Array.from(vectors.palette32),raster.marker);assert.equal(out.width,row.size*4+2);assert.equal(out.height,row.size*2+2);assert.equal(sha(out.rgba),raster.rgbaSha256);out.rgba.fill(0);}
  assert.deepEqual(planes,planesFor(row));assert.equal(sha(new Uint8Array(grid.pixels.buffer)),row.gridSha256);
 }finally{grid?.pixels.fill(0);graphics.close();}
});
test('representative colour matches20 independent averages without changing borrowed bytes',()=>{
 for(const row of vectors.averages){const pixels=bytes(row.pixelsHex),palette=bytes(row.paletteHex);assert.equal(api.legacyGameMinimapColor(pixels,palette),row.expected);assert.equal(Buffer.from(pixels).toString('hex'),row.pixelsHex);assert.equal(Buffer.from(palette).toString('hex'),row.paletteHex);}
 const palette=new Uint8Array(768);palette.set([200,0,0],3);palette.set([199,0,0],16*3);palette.set([199,0,0],17*3);palette.set([200,0,0],240*3);
 assert.equal(api.legacyGameMinimapColor(Uint8Array.of(0,1,1),palette),16);
});
test('per-mode marker colour precedes the independent unsigned deadline transition',()=>{
 const blink=api.createLegacyGameMinimapBlink();for(const row of vectors.clock)assert.equal(blink.next(row.mode,row.tick),row.color);blink.close();assert.throws(()=>blink.next(0,1),{code:'LEGACY_MINIMAP_CLOSED'});
});
test('minimap overlay clips and preserves transparent source pixels',()=>{
 const target=new Uint8Array(3*3*4).fill(31),overlay={width:2,height:2,rgba:Uint8Array.from([1,2,3,255,4,5,6,0,7,8,9,255,10,11,12,255])};
 api.overlayLegacyGameMinimap(target,3,3,overlay,-1,-1);assert.deepEqual([...target.slice(0,4)],[10,11,12,255]);assert.ok(target.slice(4).every(v=>v===31));
 const before=target.slice();overlay.rgba[3]=128;assert.throws(()=>api.overlayLegacyGameMinimap(target,3,3,overlay,0,0),{code:'LEGACY_MINIMAP_ALPHA'});assert.deepEqual(target,before);
});
test('AUT ranges require bytes only for loaded cells and reject an incomplete color',()=>{
 const window=api.legacyGameMinimapWindow(64,64,[13,13],2),planes=Array.from({length:3},()=>new Uint16Array(27*27));
 let grid=api.createLegacyGameMinimapGrid({...window,mode:1,planes,autRGB:new Uint8Array()});assert.ok(grid.pixels.every(v=>v===0));grid.pixels.fill(0);
 planes[2][0]=0x4000;assert.throws(()=>api.createLegacyGameMinimapGrid({...window,mode:1,planes,autRGB:new Uint8Array()}),{code:'LEGACY_MINIMAP_AUT_TRUNCATED'});
 grid=api.createLegacyGameMinimapGrid({...window,mode:1,planes,autRGB:Uint8Array.of(11,22,33)});assert.equal(grid.pixels[0],0x0b1621);grid.pixels.fill(0);
});
test('world minimap snapshots use bounded cache reads,owned planes and real scene center',async()=>{
 const f=clientFixture();try{await clientEnter(f);const a=f.client.copyMinimapSource(0),b=f.client.copyMinimapSource(0);assert.equal(a.width,107);assert.equal(a.planes[2].filter(n=>n&0x4000).length,144);assert.deepEqual(a.center,b.center);a.planes[2].fill(0);assert.equal(b.planes[2].filter(n=>n&0x4000).length,144);for(const p of b.planes)p.fill(0);}finally{f.close();}
});
test('107-cell minimap windows cross the2601-cell cache-read bound without losing rows',()=>{
 const scene=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-scene-frame-v1/original-vectors.json',import.meta.url))),world=api.createLegacyGameWorldProtocol(),codec=api.createLegacyGamePayloadCodec(bytes(scene.bootstrap.keyHex));
 try{world.configureActorResources(8);world.append(api.encodeLegacyGameEnvelope(bytes(scene.bootstrap.payloadHex)));world.next();for(const h of scene.protocol.beforePlainHex){world.append(api.encodeLegacyGameEnvelope(codec.encode(bytes(h))));world.next();}
  const map=new Uint8Array(20+6*399*399),view=new DataView(map.buffer);map.set([77,65,80,1]);view.setUint32(12,399,true);view.setUint32(16,399,true);
  for(let y=0;y<399;y++)for(let x=0;x<399;x++){view.setUint16(20+2*(y*399+x),(x+y*13)%50000,true);view.setUint16(20+2*(2*399*399+y*399+x),0x4000,true);}
  world.configureMapCache(7,23,map,1);const source=world.copyMinimapSource(0);let loaded=0;
  for(let y=0;y<107;y++)for(let x=0;x<107;x++){const at=y*107+x,wx=x+source.origin[0],wy=y+source.origin[1];if(wx>=0&&wy>=0){assert.equal(source.planes[2][at],0x4000);assert.equal(source.planes[0][at],(wx+wy*13)%50000);loaded++;}else assert.equal(source.planes[2][at],0);}
  assert.ok(loaded>2601);for(const p of source.planes)p.fill(0);map.fill(0);
 }finally{codec.close();world.close();}
});

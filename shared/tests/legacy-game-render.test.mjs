import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { decodeLegacyGameRD, decodeLegacyGameCGP, createLegacyGamePalette32, prepareLegacyGameSprite,
  composeLegacyGameFrame, decodeLegacyGameGraphic, createLegacyGameGraphicCatalog, LegacyGameRenderError } from '../index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/game-legacy-render-v1/original-vectors.json', import.meta.url)));
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex'));
const sha = value => createHash('sha256').update(value).digest('hex');
const error = code => e => e instanceof LegacyGameRenderError && e.code === code;
function raw(width = 4, height = 1, pixels = [0, 1, 2, 3], flags = 0, palette = []) {
  const source = new Uint8Array((flags & 2 ? 20 : 16) + pixels.length + palette.length), v = new DataView(source.buffer);
  source.set([82, 68, flags]); v.setInt32(4, width, true); v.setInt32(8, height, true); v.setUint32(12, source.length, true);
  if (flags & 2) v.setUint32(16, palette.length, true); source.set(pixels, flags & 2 ? 20 : 16); source.set(palette, source.length - palette.length); return source;
}
const rgb = () => { const p = new Uint8Array(768); for (let i = 1; i < 256; i++) p.set([i, 255-i, i^53], i*3); return p; };
function fixture(pixels = [0, 1, 2, 3], width = 4, height = 1) {
  const image = decodeLegacyGameRD(raw(width, height, pixels)), palette = createLegacyGamePalette32(rgb(), 'default-rgb');
  const sprite = prepareLegacyGameSprite(image, palette); return { image, palette, sprite, close() { image.close(); palette.close(); sprite.close(); } };
}
test('all256 header flags and59 command/boundary vectors match independent Python bytes', () => {
  assert.equal(vectors.rdCases.length,315);
  for (const row of vectors.rdCases) {
    const image = decodeLegacyGameRD(bytes(row.inputHex)), info = image.inspect();
    assert.equal(sha(image.copyPixels()), row.pixelsSha256, row.name); assert.equal(Buffer.from(image.copyPalette()).toString('hex'), row.paletteHex, row.name);
    assert.equal(info.width,row.width,row.name); assert.equal(info.height,row.height,row.name); assert.equal(info.flags,row.flags,row.name);
    assert.equal(info.consumedBytes,row.consumed,row.name); assert.equal(info.ignoredBytes,row.ignored,row.name); image.close();
  }
});
test('CGP fixed colors,672 byte BGR prefix,ignored tail and original/current168 match Python', () => {
  for (const row of vectors.cgpCases) { const cgp = decodeLegacyGameCGP(bytes(row.inputHex));
    assert.equal(sha(cgp.copyOriginalRGB()),row.originalSha256); assert.equal(sha(cgp.copyCurrentRGB()),row.currentSha256);
    assert.equal(cgp.inspect().ignoredBytes,row.ignored); assert.deepEqual([...cgp.copyCurrentRGB().slice(504,507)],[0,0,0]); cgp.close(); }
});
test('23 full/partial explicit and default palettes and source RGB LUTs match Python', () => {
  for (const row of vectors.paletteCases) { const luts = row.lutsHex && Object.fromEntries(['red','green','blue'].map((key,i)=>[key,bytes(row.lutsHex[i])]));
    const p = createLegacyGamePalette32(bytes(row.inputHex),row.mode,luts ?? undefined);
    assert.deepEqual([...p.copyColors()],row.colors,row.name); assert.deepEqual([...p.copyKnownMask()],row.known,row.name);p.close(); }
});
test('four indexed frames produce independently verified top-down RGBA', () => {
  const cgp = decodeLegacyGameCGP(bytes(vectors.cgpCases[0].inputHex)), p = createLegacyGamePalette32(cgp.copyCurrentRGB(),'default-rgb');
  for (const row of vectors.spriteCases) { const image = decodeLegacyGameRD(bytes(row.rdHex)), sprite = prepareLegacyGameSprite(image,p);
    assert.equal(sha(sprite.copyRGBA()),row.rgbaSha256); assert.equal(Buffer.from(sprite.copyRGBA()).toString('hex'),row.rgbaHex); image.close();sprite.close(); }
  cgp.close();p.close();
});
test('100 independently rasterized viewports verify flip,origin,signed16,transparency and priority ties', () => {
  const cgp = decodeLegacyGameCGP(bytes(vectors.cgpCases[0].inputHex)), p = createLegacyGamePalette32(cgp.copyCurrentRGB(),'default-rgb');
  const images = vectors.spriteCases.map(row=>decodeLegacyGameRD(bytes(row.rdHex))), sprites = images.map(image=>prepareLegacyGameSprite(image,p));
  for (const row of vectors.frameCases) { const result = composeLegacyGameFrame(row.width,row.height,row.commands.map(c=>({...c,sprite:sprites[c.sprite]})));
    assert.equal(sha(result.rgba),row.rgbaSha256);assert.deepEqual(result.drawOrder,row.drawOrder);assert.equal(result.rasterOperations,row.rasterOperations); }
  images.forEach(x=>x.close());sprites.forEach(x=>x.close());cgp.close();p.close();
});
test('zero count commands advance input and all C/D/E/F aliases are actual zero bytes', () => {
  const image=decodeLegacyGameRD(raw(4,1,[0,0x80,9,0xc0,0xd0,0,0xe0,0,0,0xf0,0,4],1));
  assert.deepEqual([...image.copyPixels()],[0,0,0,0]);assert.equal(image.inspect().stats.zeroRuns,5);image.close();
});
test('raw ignores word12 while compressed honors end and leaves trailing bytes opaque', () => {
  const a=raw(),v=new DataView(a.buffer);v.setUint32(12,0xffffffff,true);const image=decodeLegacyGameRD(a);assert.equal(image.inspect().headerWord12,0xffffffff);image.close();
  const b=raw(4,1,[0x84,7,99,98],1);new DataView(b.buffer).setUint32(12,18,true);const other=decodeLegacyGameRD(b);assert.equal(other.inspect().ignoredBytes,2);assert.deepEqual([...other.copyPixels()],[7,7,7,7]);other.close();
});
test('header/magic/negative dimensions and palette budget fail at input boundary', () => {
  assert.throws(()=>decodeLegacyGameRD(new Uint8Array(15)),error('LEGACY_RD_TRUNCATED'));
  const bad=raw();bad[0]=0;assert.throws(()=>decodeLegacyGameRD(bad),error('LEGACY_RD_MAGIC'));
  const negative=raw(-1);assert.throws(()=>decodeLegacyGameRD(negative),error('LEGACY_RENDER_INTEGER'));
  const huge=raw(4194304,2);assert.throws(()=>decodeLegacyGameRD(huge),error('LEGACY_RENDER_INTEGER'));
  const pal=raw(4,1,[0,1,2,3],2);new DataView(pal.buffer).setUint32(16,769,true);assert.throws(()=>decodeLegacyGameRD(pal),error('LEGACY_RD_PALETTE_BUDGET'));
});
test('declared end,extension,value,literal and raw truncation fail without partial output', () => {
  const cases=[[raw(4,1,[0x84],1),'LEGACY_RD_TRUNCATED'],[raw(4,1,[0xd0],1),'LEGACY_RD_TRUNCATED'],
    [raw(4,1,[0xa0,7,0],1),'LEGACY_RD_TRUNCATED'],[raw(4,1,[4,1],1),'LEGACY_RD_TRUNCATED'],[raw(4,1,[0,1]),'LEGACY_RD_TRUNCATED']];
  for(const [x,code] of cases)assert.throws(()=>decodeLegacyGameRD(x),error(code));
  for(const end of [0,15,999]){const x=raw(4,1,[0x84,7],1);new DataView(x.buffer).setUint32(12,end,true);assert.throws(()=>decodeLegacyGameRD(x),error('LEGACY_RD_LENGTH'));}
});
test('native missing output bounds are replaced by strict overrun and underrun errors', () => {
  assert.throws(()=>decodeLegacyGameRD(raw(4,1,[0x85,9],1)),error('LEGACY_RD_OVERRUN'));
  assert.throws(()=>decodeLegacyGameRD(raw(4,1,[0x83,9],1)),error('LEGACY_RD_UNDERRUN'));
});
test('input budgets/shared buffers and forged types are rejected; subarray respects offset', () => {
  assert.throws(()=>decodeLegacyGameRD(new Uint8Array(33554433)),error('LEGACY_RENDER_INPUT_BUDGET'));
  assert.throws(()=>decodeLegacyGameRD(new Uint8Array(new SharedArrayBuffer(16))),error('LEGACY_RENDER_INPUT'));
  assert.throws(()=>decodeLegacyGameRD({buffer:raw().buffer}),error('LEGACY_RENDER_INPUT'));
  const padded=new Uint8Array(40);padded.set(raw(),7);const image=decodeLegacyGameRD(padded.subarray(7,27));assert.deepEqual([...image.copyPixels()],[0,1,2,3]);image.close();
});
test('image owns bytes and returned copies survive close without changing internal image', () => {
  const source=raw(),image=decodeLegacyGameRD(source);source.fill(7);const copied=image.copyPixels();copied[1]=99;
  assert.deepEqual([...image.copyPixels()],[0,1,2,3]);image.close();image.close();assert.equal(copied[1],99);assert.throws(()=>image.copyPixels(),error('LEGACY_RENDER_CLOSED'));
});
test('CGP and palettes own their bytes,return copies and close idempotently', () => {
  assert.throws(()=>decodeLegacyGameCGP(new Uint8Array(671)),error('LEGACY_CGP_TRUNCATED'));
  const cgp=decodeLegacyGameCGP(new Uint8Array(672)),a=cgp.copyOriginalRGB();a[3]=2;assert.equal(cgp.copyOriginalRGB()[3],128);cgp.close();cgp.close();assert.throws(()=>cgp.inspect(),error('LEGACY_RENDER_CLOSED'));
  const source=rgb(),p=createLegacyGamePalette32(source,'default-rgb'),colors=p.copyColors();source.fill(0);colors.fill(0);assert.notEqual(p.copyColors()[1],0);p.close();p.close();assert.throws(()=>p.copyColors(),error('LEGACY_RENDER_CLOSED'));
});
test('palette zero is always keyed; default black stays zero,explicit black becomes blue1', () => {
  const a=createLegacyGamePalette32(new Uint8Array(768),'default-rgb'),b=createLegacyGamePalette32(new Uint8Array(768),'explicit-rgb');
  assert.equal(a.copyColors()[1],0);assert.equal(b.copyColors()[1],1);assert.equal(b.copyColors()[0],0);
  const image=decodeLegacyGameRD(raw(4,1,[0,1,0,1])),sa=prepareLegacyGameSprite(image,a),sb=prepareLegacyGameSprite(image,b);
  assert.equal(sa.copyRGBA()[7],0);assert.deepEqual([...sb.copyRGBA().slice(4,8)],[0,0,1,255]);[a,b,image,sa,sb].forEach(x=>x.close());
});
test('partial embedded palette permits known used triples and rejects used unknowns', () => {
  const p=createLegacyGamePalette32(Uint8Array.of(77,88,99,1,2,3,100),'embedded-bgr'),a=decodeLegacyGameRD(raw(4,1,[0,1,1,0]));
  const sprite=prepareLegacyGameSprite(a,p);assert.deepEqual([...sprite.copyRGBA().slice(4,8)],[3,2,1,255]);assert.equal(p.inspect().unusedTailBytes,1);
  const bad=decodeLegacyGameRD(raw(4,1,[0,2,1,0]));assert.throws(()=>prepareLegacyGameSprite(bad,p),error('LEGACY_RENDER_UNKNOWN_COLOR'));[p,a,bad,sprite].forEach(x=>x.close());
});
test('palette shape/mode/LUT validation does not invoke getters or accept partial LUTs', () => {
  assert.throws(()=>createLegacyGamePalette32(new Uint8Array(767),'default-rgb'),error('LEGACY_PALETTE_LENGTH'));
  assert.throws(()=>createLegacyGamePalette32(rgb(),'rgba'),error('LEGACY_PALETTE_MODE'));
  assert.throws(()=>createLegacyGamePalette32(rgb(),'default-rgb',{}),error('LEGACY_PALETTE_DEFAULT_LUT'));
  let called=0;assert.throws(()=>createLegacyGamePalette32(rgb(),'explicit-rgb',{get red(){called++;},green:new Uint8Array(256),blue:new Uint8Array(256)}),error('LEGACY_RENDER_FIELDS'));assert.equal(called,0);
  assert.throws(()=>createLegacyGamePalette32(rgb(),'explicit-rgb',{red:new Uint8Array(255),green:new Uint8Array(256),blue:new Uint8Array(256)}),error('LEGACY_PALETTE_LUT'));
});
test('decoded unaligned width remains available while unproven native row stride is refused', () => {
  const i=decodeLegacyGameRD(raw(3,1,[1,2,3])),p=createLegacyGamePalette32(rgb(),'default-rgb');assert.equal(i.inspect().renderableStride,false);
  assert.throws(()=>prepareLegacyGameSprite(i,p),error('LEGACY_RENDER_STRIDE_UNPROVEN'));i.close();p.close();
});
test('source signed16 cache dimensions constrain drawing independently of byte decoding', () => {
  const i=decodeLegacyGameRD(raw(4,32768,new Uint8Array(4*32768))),p=createLegacyGamePalette32(rgb(),'default-rgb');
  assert.equal(i.inspect().height,32768);assert.throws(()=>prepareLegacyGameSprite(i,p),error('LEGACY_RENDER_DIMENSIONS_UNPROVEN'));i.close();p.close();
});
test('sprite owns converted pixels across upstream close and returns separate copies', () => {
  const f=fixture();f.image.close();f.palette.close();const a=f.sprite.copyRGBA();a.fill(0);assert.notEqual(f.sprite.copyRGBA()[7],0);f.sprite.close();f.sprite.close();assert.throws(()=>f.sprite.copyRGBA(),error('LEGACY_RENDER_CLOSED'));
});
test('composition rejects getters,holes,invalid scale descriptors and excessive command counts', () => {
  const f=fixture();let called=0;
  assert.throws(()=>composeLegacyGameFrame(4,1,[{sprite:f.sprite,get x(){called++;},y:0,priority:0}]),error('LEGACY_RENDER_FIELDS'));assert.equal(called,0);
  assert.throws(()=>composeLegacyGameFrame(4,1,new Array(1)),error('LEGACY_RENDER_COMMANDS'));
  assert.throws(()=>composeLegacyGameFrame(4,1,[{sprite:f.sprite,x:0,y:0,priority:0,scale:2}]),error('LEGACY_RENDER_SCALE'));
  assert.throws(()=>composeLegacyGameFrame(4,1,new Array(4097)),error('LEGACY_RENDER_INTEGER'));f.close();
});
test('sort ties draw later submitted records first and preserve transparent lower pixels', () => {
  const f=fixture([1,0,2,0]),g=fixture([3,4,0,0]);
  const frame=composeLegacyGameFrame(4,1,[{sprite:f.sprite,x:0,y:0,priority:5},{sprite:g.sprite,x:0,y:0,priority:5}]);
  assert.deepEqual(frame.drawOrder,[1,0]);assert.deepEqual([...frame.rgba.slice(0,4)],[1,254,52,255]);assert.deepEqual([...frame.rgba.slice(4,8)],[4,251,49,255]);f.close();g.close();
});
test('frame has owning bytes and transparent fresh background; negative clipping is bounded', () => {
  const f=fixture(),a=composeLegacyGameFrame(2,1,[{sprite:f.sprite,x:-2,y:0,priority:0}]);
  assert.deepEqual([...a.rgba.slice(0,4)],[2,253,55,255]);a.rgba.fill(8);assert.deepEqual([...composeLegacyGameFrame(2,1,[]).rgba],new Array(8).fill(0));f.close();
});
test('frame work budget rejects excessive overdraw before rasterization', () => {
  const f=fixture(new Uint8Array(1024*1024).fill(1),1024,1024),commands=new Array(65).fill({sprite:f.sprite,x:0,y:0,priority:0});
  assert.throws(()=>composeLegacyGameFrame(1024,1024,commands),error('LEGACY_RENDER_WORK_BUDGET'));f.close();
});
test('reentrant descriptor trap cannot turn a previously validated sprite into a blank success', () => {
  const f=fixture(),g=fixture(),second=new Proxy({sprite:g.sprite,x:0,y:0,priority:0},{ownKeys(target){f.sprite.close();return Reflect.ownKeys(target);}});
  assert.throws(()=>composeLegacyGameFrame(4,1,[{sprite:f.sprite,x:0,y:0,priority:0},second]),error('LEGACY_RENDER_CLOSED'));f.close();g.close();
});
function record(id,resource,offset,length,x=-2,y=3,w=4,h=1){const b=new Uint8Array(40),v=new DataView(b.buffer);for(const [at,n]of[[0,id],[4,offset],[8,length],[12,x],[16,y],[20,w],[24,h],[36,resource]])v.setInt32(at,n,true);return b;}
test('opt-in image catalog resolves group base,resource,last mapping and signed16 metadata', () => {
  const a=record(0,1000,7,20,-65538,65539,65540,65537),b=record(0,1000,9,20,4,-5),c=createLegacyGameGraphicCatalog([a,b],{includeImages:true});
  assert.deepEqual(c.image(1000),{resourceId:1000,index:1,group:1,byteOffset:9,byteLength:20,originX:4,originY:-5,width:4,height:1,present:true});
  assert.equal(c.image(1001).originX,-2);assert.equal(c.image(1001).originY,3);assert.equal(c.image(1001).width,4);a.fill(0);b.fill(0);assert.equal(c.image(1000).group,1);c.close();assert.throws(()=>c.image(1000),{code:'LEGACY_GRAPHIC_CLOSED'});
});
test('catalog stays compact by default and explicit image options reject accessors', () => {
  const c=createLegacyGameGraphicCatalog([record(0,1000,0,20)]);assert.throws(()=>c.image(1000),{code:'LEGACY_GRAPHIC_IMAGES_DISABLED'});c.close();let called=0;
  assert.throws(()=>createLegacyGameGraphicCatalog([new Uint8Array()],{get includeImages(){called++;return true;}}),{code:'LEGACY_GRAPHIC_OPTIONS'});assert.equal(called,0);
});
test('catalog archive range -> RD -> palette -> sprite -> frame is a complete ordinary byte path', () => {
  const archive=new Uint8Array(27);archive.set(raw(),7);const c=createLegacyGameGraphicCatalog([record(0,1000,7,20)],{includeImages:true});
  const i=decodeLegacyGameGraphic(archive,c.image(1000)),p=createLegacyGamePalette32(rgb(),'default-rgb'),sprite=prepareLegacyGameSprite(i,p),m=i.inspect().graphic;
  assert.equal(m.index,0);assert.equal(m.originX,-2);const frame=composeLegacyGameFrame(4,4,[{sprite,x:2,y:0,originX:m.originX,originY:m.originY,priority:0}]);assert.equal(frame.rgba[(3*4+1)*4+3],255);[i,p,sprite,c].forEach(x=>x.close());
});
test('archive consumer rejects missing and out of range records without invoking descriptor getters', () => {
  const c=createLegacyGameGraphicCatalog([record(0,1000,20,20)],{includeImages:true}),d=c.image(1000);
  assert.throws(()=>decodeLegacyGameGraphic(raw(),d),error('LEGACY_GRAPHIC_IMAGE_RANGE'));
  assert.throws(()=>decodeLegacyGameGraphic(raw(),{...d,present:false}),error('LEGACY_GRAPHIC_IMAGE_MISSING'));
  const missing=createLegacyGameGraphicCatalog([new Uint8Array()],{includeImages:true});assert.equal(missing.image(1000).present,false);missing.close();c.close();
});

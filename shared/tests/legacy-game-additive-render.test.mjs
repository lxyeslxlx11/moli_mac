import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-additive-render-v1/original-vectors.json',import.meta.url))),named=JSON.parse(readFileSync(new URL('../../analysis/game-animation-palette-source-v1/original-vectors.json',import.meta.url))),bytes=h=>new Uint8Array(Buffer.from(h,'hex')),sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(){const image=api.decodeLegacyGameRD(bytes(v.rdHex)),palette=api.createLegacyGamePalette32(bytes(v.paletteRGBHex),'explicit-rgb'),sprite=api.prepareLegacyGameSprite(image,palette);return {sprite,close(){sprite.close();palette.close();image.close();}};}
test('480independent full ONE+ONE frames retain clipping,flip,scale,mask,priority,ties andopacity precedence',()=>{
 const f=fixture(),base=bytes(v.backgroundRGBAHex);try{for(const row of v.cases){const out=api.composeLegacyGameFrame(v.width,v.height,row.commands.map(c=>({...c,sprite:f.sprite})),row.initial?base:undefined);assert.equal(sha(out.rgba),row.rgbaSha256,JSON.stringify(row.commands[1]));assert.deepEqual(out.drawOrder,row.drawOrder);assert.equal(out.rasterOperations,row.rasterOperations);out.rgba.fill(0);}assert.equal(Buffer.from(base).toString('hex'),v.backgroundRGBAHex);}finally{f.close();base.fill(0);}
});
test('high-layer additive sees text pixels andall later normal/additive commands in order',()=>{
 const f=fixture(),alpha=Uint8Array.of(255,128,0,64),text=api.createLegacyGameTextBatch([{x:1,y:1,font:1,color:134,bytes:[65]}]);
 try{for(const row of v.textCases){const out=api.composeLegacyGameTextFrame(v.width,v.height,row.commands.map(c=>({...c,sprite:f.sprite})),text,()=>({width:2,height:2,originX:0,originY:0,alpha}));assert.equal(sha(out.rgba),row.rgbaSha256);assert.equal(out.rasterOperations,row.rasterOperations);out.rgba.fill(0);}assert.deepEqual(alpha,Uint8Array.of(255,128,0,64));}finally{f.close();}
});
test('base frame input andreturned additive frames are independently owned',()=>{
 const f=fixture(),base=bytes(v.backgroundRGBAHex);try{const out=api.composeLegacyGameFrame(v.width,v.height,[{sprite:f.sprite,x:0,y:0,priority:1,blend:'additive'}],base),before=out.rgba.slice();base.fill(0);assert.deepEqual(out.rgba,before);out.rgba.fill(0);assert.ok(before.some(x=>x));assert.throws(()=>api.composeLegacyGameFrame(1,1,[],new Uint8Array(3)),{code:'LEGACY_RENDER_FRAME_LENGTH'});}finally{f.close();}
});
test('invalid blend andbase input reject without mutating borrowed state orcalling getters',()=>{
 const f=fixture(),base=bytes(v.backgroundRGBAHex),before=base.slice();try{for(const blend of [undefined,null,'multiply',8])assert.throws(()=>api.composeLegacyGameFrame(v.width,v.height,[{sprite:f.sprite,x:0,y:0,priority:1,blend}],base),{code:'LEGACY_RENDER_BLEND'});let calls=0;assert.throws(()=>api.composeLegacyGameFrame(v.width,v.height,[{sprite:f.sprite,x:0,y:0,priority:1,get blend(){calls++;return 'additive';}}],base));assert.equal(calls,0);assert.deepEqual(base,before);assert.throws(()=>api.composeLegacyGameFrame(1,1,[],new Uint8Array(new SharedArrayBuffer(4))));}finally{f.close();}
});
test('range-backed sameimage keeps additive style outside its shared named prepared-sprite cache',async()=>{
 const files=originalFiles(named.assets),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
 try{await library.initialize();const command=flags=>({image:{index:1600,paletteSelector:320,flags,color:0xffffffff},x:0,y:0,priority:10}),out=await library.startRender(api.createLegacyGameDrawPlan(4,1,[command(8),command(0)])).done,raw=bytes(named.palette_cases.find(r=>r.selector===320&&!r.tint).rgbaHex);
  for(let at=0;at<raw.length;at+=4)if(raw[at+3])for(let c=0;c<3;c++)raw[at+c]=Math.min(255,raw[at+c]*2);assert.deepEqual(out.rgba,raw);assert.equal(library.inspect().stats.imagesDecoded,1);assert.equal(library.inspect().stats.namedPalettesDecoded,1);out.rgba.fill(0);raw.fill(0);
 }finally{library.close();files.close();}
});
test('deferred animation plans carry named/additive styles whileprepared calls retain binding checks',()=>{
 const index=new Uint8Array(12),iv=new DataView(index.buffer),animation=new Uint8Array(30),av=new DataView(animation.buffer);iv.setUint32(0,100001,true);iv.setUint16(8,1,true);iv.setUint16(10,1,true);av.setUint32(4,16,true);av.setUint32(8,1,true);av.setUint16(12,320,true);av.setUint16(14,15,true);av.setUint32(16,0xffffffff,true);av.setUint32(20,1000,true);
 const catalog=api.createLegacyGameAnimationCatalog([{index,animation,graphicBase:0}]),player=api.createLegacyGameAnimationPlayer(catalog),f=fixture();
 try{player.step({resourceId:100001,action:0,facing:0,speedPercent:100,mode:0,frozen:0,staticFlip:false,soundScene:0,actorFlags:0},()=>({index:1000,originX:0,originY:0,width:8,height:4}));const plan=player.drawPlan(0,0);assert.equal(plan.image.paletteSelector,320);assert.equal(plan.image.flags,15);assert.equal(plan.flip,3);assert.throws(()=>player.drawCommand(f.sprite,0,0),{code:'LEGACY_ANIMATION_DRAW_STYLE'});}finally{f.close();player.close();catalog.close();}
});

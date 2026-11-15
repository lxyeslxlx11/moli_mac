import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage293-api-final/game.js')):await import('../../shared/index.mjs');
const v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url))),old=JSON.parse(readFileSync(new URL('../game-legacy-animation-v1/original-vectors.json',import.meta.url))),bytes=h=>new Uint8Array(Buffer.from(h,'hex')),sha=b=>createHash('sha256').update(b).digest('hex');
const image=api.decodeLegacyGameRD(bytes(v.rdHex)),palette=api.createLegacyGamePalette32(bytes(v.paletteRGBHex),'explicit-rgb'),sprite=api.prepareLegacyGameSprite(image,palette),rows=[];
try{
 for(const row of v.cases){const out=api.composeLegacyGameFrame(v.width,v.height,row.commands.map(c=>({...c,sprite})),row.initial?bytes(v.backgroundRGBAHex):undefined);assert.equal(sha(out.rgba),row.rgbaSha256);assert.deepEqual(out.drawOrder,row.drawOrder);assert.equal(out.rasterOperations,row.rasterOperations);rows.push(row.rgbaSha256);out.rgba.fill(0);}
 const text=api.createLegacyGameTextBatch([{x:1,y:1,font:1,color:134,bytes:[65]}]);for(const row of v.textCases){const out=api.composeLegacyGameTextFrame(v.width,v.height,row.commands.map(c=>({...c,sprite})),text,()=>({width:2,height:2,originX:0,originY:0,alpha:Uint8Array.of(255,128,0,64)}));assert.equal(sha(out.rgba),row.rgbaSha256);rows.push(row.rgbaSha256);out.rgba.fill(0);}
 const groups=old.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,v])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(v):v]))),catalog=api.createLegacyGameAnimationCatalog(groups),rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const colors=api.createLegacyGamePalette32(rgb,'explicit-rgb');
 try{for(const expected of v.promotedAnimationFrames){const trace=old.series.find(t=>t.name===expected.trace),player=api.createLegacyGameAnimationPlayer(catalog);let source,s;
   try{for(let i=0;i<=expected.step;i++){const row=trace.steps[i];if(row.invalidate)player.invalidate();player.step(row.context,({kind,value})=>{const index=kind==='index'?value:value%5000+3000;return {index,originX:index%7-3,originY:index%5-2,width:4*(index%3+1),height:index%4+2};});}
    const q=player.copyState(),g=q.geometry,pixels=Uint8Array.from({length:g.width*g.height},(_,i)=>(i+g.index)%5===0?0:1+(i+g.index)%3),raw=new Uint8Array(16+pixels.length),view=new DataView(raw.buffer);raw.set([82,68]);view.setInt32(4,g.width,true);view.setInt32(8,g.height,true);view.setUint32(12,raw.length,true);raw.set(pixels,16);source=api.decodeLegacyGameRD(raw);s=api.prepareLegacyGameSprite(source,colors);const frame=api.composeLegacyGameFrame(32,24,[player.drawCommand(s,16,12)]);assert.equal(sha(frame.rgba),expected.rgbaSha256);rows.push(expected.rgbaSha256);frame.rgba.fill(0);raw.fill(0);
   }finally{s?.close();source?.close();player.close();}}
 }finally{colors.close();catalog.close();rgb.fill(0);}
 console.log(JSON.stringify({stage:293,frames:v.cases.length,textFrames:v.textCases.length,promotedAnimationFrames:v.promotedAnimationFrames.length,rows:rows.length,digest:sha(Buffer.from(JSON.stringify(rows))),sourceGeneratedComparable:true,originalExecution:false}));
}finally{sprite.close();palette.close();image.close();}

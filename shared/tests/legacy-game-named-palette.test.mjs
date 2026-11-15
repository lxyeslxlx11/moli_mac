import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-animation-palette-source-v1/original-vectors.json',import.meta.url))),sha=b=>createHash('sha256').update(b).digest('hex'),flush=async()=>{for(let i=0;i<24;i++)await Promise.resolve();};
const query=(selector,flags=0)=>({image:{index:1600,paletteSelector:selector,flags,color:0xffffffff},x:0,y:0,priority:10});
const plan=(selector,flags=0,tint=null)=>api.createLegacyGameDrawPlan(4,1,[query(selector,flags)],undefined,tint?{rgb:new Array(768).fill(0),tint}:undefined);
async function fixture(edit){const files=originalFiles(v.assets);edit?.(files);const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();return {files,library,close(){library.close();files.close();}};}
test('all65536native selector values match the independent full-domain table digest',()=>{
 const hash=createHash('sha256'),buffer=new Uint8Array(8),view=new DataView(buffer.buffer);for(let i=0;i<65536;i++){const r=api.legacyGameNamedPalette(i);view.setUint32(0,r.selector,true);view.setUint32(4,r.resourceId,true);hash.update(buffer);}assert.equal(hash.digest('hex'),v.selector_domain_sha256);assert.deepEqual(api.legacyGameNamedPalette(320),{selector:320,resourceId:113058});for(const n of [-1,65536,1.5])assert.throws(()=>api.legacyGameNamedPalette(n));
});
test('named BGR overrides own embedded colors,opaque black remains visible andneutral bypasses tint',async()=>{
 const f=await fixture();try{for(const row of v.palette_cases){const frame=await f.library.startRender(plan(row.selector,row.flags,row.tint)).done;assert.equal(sha(frame.rgba),row.rgbaSha256,'selector '+row.selector+' flags '+row.flags);assert.equal(Buffer.from(frame.rgba).toString('hex'),row.rgbaHex);frame.rgba.fill(0);}assert.equal(f.library.inspect().namedPaletteEntries,3);}finally{f.close();}
});
test('sameimage withdifferent named palettes cannot share one prepared sprite andcache hits preserve colors',async()=>{
 const f=await fixture();try{const first=await f.library.startRender(plan(1)).done,second=await f.library.startRender(plan(320)).done;assert.notDeepEqual(first.rgba,second.rgba);const reads=f.library.inspect().stats.readCalls,again=await f.library.startRender(plan(1)).done;assert.deepEqual(again.rgba,first.rgba);assert.equal(f.library.inspect().stats.readCalls,reads);assert.equal(f.library.inspect().cacheEntries,2);first.rgba.fill(0);second.rgba.fill(0);again.rgba.fill(0);}finally{f.close();}
});
test('bounded named-palette LRU evicts onlyold raw palettes andcan restore a prepared color',async()=>{
 const f=await fixture();try{let first;for(let i=1;i<=65;i++){const frame=await f.library.startRender(plan(i)).done;if(i===1)first=frame.rgba.slice();frame.rgba.fill(0);}assert.equal(f.library.inspect().namedPaletteEntries,64);assert.equal(f.library.inspect().stats.namedPalettesDecoded,65);const last=await f.library.startRender(plan(1)).done;assert.equal(f.library.inspect().stats.namedPalettesDecoded,66);assert.deepEqual(last.rgba,first);first.fill(0);last.rgba.fill(0);}finally{f.close();}
});
test('cancel duringcarrier read retires the named result andthe next job can load normally',async()=>{
 const f=await fixture();try{f.files.controls.hold='Bin/Graphic.bin';const job=f.library.startRender(plan(320));await flush();assert.equal(f.files.pending.length,1);job.cancel();const rejected=assert.rejects(job.done,{code:'LEGACY_ASSET_CANCELLED'});f.files.pending.shift()();await rejected;assert.equal(f.library.inspect().namedPaletteEntries,undefined);const frame=await f.library.startRender(plan(320)).done;assert.equal(sha(frame.rgba),v.palette_cases.find(r=>r.selector===320&&!r.tint).rgbaSha256);frame.rgba.fill(0);}finally{f.close();}
});
test('close duringcarrier read cannot resurrect palette orprepared-image caches',async()=>{
 const f=await fixture();try{f.files.controls.hold='Bin/Graphic.bin';const job=f.library.startRender(plan(320));await flush();f.library.close();const rejected=assert.rejects(job.done,e=>['LEGACY_ASSET_CLOSED','LEGACY_ASSET_CANCELLED'].includes(e.code));f.files.pending.shift()();await rejected;assert.equal(f.library.inspect().state,'closed');assert.equal(f.library.inspect().cacheEntries,0);assert.equal(f.library.inspect().namedPaletteEntries,undefined);}finally{f.close();}
});
test('missing palette carriers orreferenced unavailable colors are explicit errors without a default fallback',async()=>{
 const missing=await fixture(f=>{const b=f.files.get('bin/graphicinfo.bin'),view=new DataView(b.buffer);for(let at=0;at<b.length;at+=40)if(view.getUint32(at+36,true)===113058)view.setUint32(at+36,0,true);});try{await assert.rejects(missing.library.startRender(plan(320)).done,{code:'LEGACY_ASSET_NAMED_PALETTE_REQUIRED'});}finally{missing.close();}
 const partial=await fixture(f=>{const info=f.files.get('bin/graphicinfo.bin'),iv=new DataView(info.buffer),b=f.files.get('bin/graphic.bin'),view=new DataView(b.buffer);for(let at=0;at<info.length;at+=40)if(iv.getUint32(at+36,true)===113058)view.setUint32(iv.getUint32(at+4,true)+16,3,true);});try{await assert.rejects(partial.library.startRender(plan(320)).done,{code:'LEGACY_RENDER_UNKNOWN_COLOR'});}finally{partial.close();}
});
test('named colors reject unproven style bits andout-of-range color values',()=>{
 assert.throws(()=>api.createLegacyGameDrawPlan(4,1,[query(320,16)]),{code:'LEGACY_ASSET_DRAW_STYLE'});assert.throws(()=>api.createLegacyGameDrawPlan(4,1,[{...query(320),image:{...query(320).image,color:0x100000000}}]),{code:'LEGACY_ASSET_INTEGER'});
});

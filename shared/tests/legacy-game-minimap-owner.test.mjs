import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
const flush=async()=>{for(let i=0;i<24;i++)await Promise.resolve();};
function fixture(){
 let key=0,mode=1,reads=0,fail=false,hold=false,release;
 const sources=[],raw=[],graphics=api.createLegacyGameGraphicCatalog([new Uint8Array()]);
 const source=zoom=>{const w=api.legacyGameMinimapWindow(64,64,[32,32],zoom),planes=Array.from({length:3},()=>new Uint16Array(w.width*w.height));
  for(let y=0;y<w.height;y++)for(let x=0;x<w.width;x++)if(x+w.origin[0]>=0&&y+w.origin[1]>=0&&x+w.origin[0]<64&&y+w.origin[1]<64)planes[2][y*w.width+x]=0x4000;
  const s={...w,mode,selector:key,identity:[7,23],revision:key,key:key+':'+zoom,planes};sources.push(s);return s;};
 const library={async readMinimapAUT(){reads++;const b=new Uint8Array(64*64*3).fill(17);raw.push(b);if(hold)await new Promise(r=>{release=r;});if(fail){b.fill(0);throw Object.assign(Error(),{code:'LEGACY_ASSET_REQUIRED_FILE'});}return b;},
  async minimapColorTable(){reads++;return new Uint8Array(65536);},catalogs(){return {graphics,palette:{copyColors:()=>new Uint32Array(256).fill(0x123456)}};}};
 const owner=api.createLegacyGameMinimapOwner({client:{copyMinimapSource:source,library:()=>library}}),frame=()=>({width:640,height:480,rgba:new Uint8Array(640*480*4)});
 return {owner,frame,sources,raw,get reads(){return reads;},set key(v){key=v;},set mode(v){mode=v;},set hold(v){hold=v;},set fail(v){fail=v;},release(){release?.();},close(){owner.close();graphics.close();}};
}
test('hidden minimap does no I/O;ready overlays use owned resources without reloading',async()=>{
 const f=fixture();try{const first=f.frame();f.owner.decorate(first,1000);assert.equal(f.reads,0);assert.equal(f.sources.length,0);f.owner.toggle();f.owner.decorate(first,1000);assert.ok(first.rgba.every(x=>x===0));await flush();assert.equal(f.owner.inspect().state,'ready');assert.ok(f.sources[0].planes.every(p=>p.every(x=>x===0)));
  f.owner.decorate(first,1001);assert.ok(first.rgba.some(x=>x));assert.equal(f.owner.inspect().presentations,1);f.owner.decorate(f.frame(),1002);assert.equal(f.reads,1);assert.ok(f.sources.at(-1).planes.every(p=>p.every(x=>x===0)));
  f.owner.toggle();f.owner.decorate(f.frame(),1003);assert.equal(f.owner.inspect().state,'hidden');assert.equal(f.reads,1);
 }finally{f.close();}assert.ok(f.raw.every(p=>p.every(x=>x===0)));
});
test('latest queued scene replaces older queued snapshots andnever paints stale data',async()=>{
 const f=fixture();try{f.hold=true;f.owner.toggle();f.owner.decorate(f.frame(),1);await flush();f.key=1;f.owner.decorate(f.frame(),2);const queued=f.sources.at(-1);f.key=2;const frame=f.frame();f.owner.decorate(frame,3);assert.ok(queued.planes.every(p=>p.every(x=>x===0)));assert.equal(f.reads,1);f.hold=false;f.release();await flush();assert.equal(f.reads,2);assert.equal(f.owner.inspect().state,'ready');assert.ok(frame.rgba.every(x=>x===0));f.owner.decorate(frame,4);assert.ok(frame.rgba.some(x=>x));
 }finally{f.close();}
});
test('range changes retire pending generations;late AUT bytes cannot survive close',async()=>{
 const f=fixture();f.hold=true;f.owner.toggle();f.owner.decorate(f.frame(),1);await flush();assert.equal(f.owner.cycleRange().zoom,2);f.owner.decorate(f.frame(),2);assert.ok(f.sources[0].planes.every(p=>p.every(x=>x===0)));f.close();f.release();await flush();assert.ok(f.raw.every(p=>p.every(x=>x===0)));assert.ok(f.sources.every(s=>s.planes.every(p=>p.every(x=>x===0))));assert.equal(f.owner.inspect().state,'closed');assert.throws(()=>f.owner.toggle(),{code:'LEGACY_MINIMAP_CLOSED'});
});
test('missing AUT is unavailable without automatic repeats;explicit toggle permits retry',async()=>{
 const f=fixture();try{f.fail=true;f.owner.toggle();f.owner.decorate(f.frame(),1);await flush();assert.equal(f.owner.inspect().errorCode,'LEGACY_ASSET_REQUIRED_FILE');for(let i=0;i<4;i++)f.owner.decorate(f.frame(),i+2);await flush();assert.equal(f.reads,1);f.fail=false;f.owner.toggle();f.owner.toggle();f.owner.decorate(f.frame(),10);await flush();assert.equal(f.owner.inspect().state,'ready');assert.equal(f.reads,2);f.owner.cycleRange();f.owner.decorate(f.frame(),11);await flush();assert.equal(f.reads,2);assert.equal(f.owner.inspect().width,27);
 }finally{f.close();}
});
test('indexed mode shares the same presentation owner andall three supported ranges',async()=>{
 const f=fixture();try{f.mode=0;f.owner.toggle();for(const zoom of [1,2,0]){f.owner.decorate(f.frame(),1);await flush();assert.equal(f.owner.inspect().zoom,zoom);assert.equal(f.owner.inspect().state,'ready');const frame=f.frame();f.owner.decorate(frame,2);assert.ok(frame.rgba.some(x=>x));f.owner.cycleRange();}assert.equal(f.raw.length,0);
 }finally{f.close();}
});
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url)));
async function resources(){const files=originalFiles(vectors),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();return {files,library,close(){library.close();files.close();}};}
test('on-demand color table deduplicates concurrent reads andreturns an owned copy',async()=>{
 const f=await resources();try{f.files.controls.hold='Bin/Graphic.bin';const first=f.library.minimapColorTable([1000,20001]),second=f.library.minimapColorTable([1000]);await flush();assert.equal(f.files.pending.length,1);f.files.pending.shift()();const [a,b]=await Promise.all([first,second]);assert.equal(a[1000],b[1000]);assert.ok(a[1000]>0);assert.ok(a[20001]>0);assert.notEqual(a,b);a.fill(0);assert.ok(b[1000]>0);assert.equal(f.files.calls.filter(r=>r.kind==='read'&&r.path==='Bin/Graphic.bin').length,2);await f.library.minimapColorTable([1000,20001]);assert.equal(f.files.calls.filter(r=>r.kind==='read'&&r.path==='Bin/Graphic.bin').length,2);
 }finally{f.close();}
});
test('library reads fixed case-insensitive AUT path to the source limit andcleans late bytes',async()=>{
 const f=await resources();try{const bytes=new Uint8Array(477606).fill(81);f.files.files.set('bin/puk2/cutdat/23.aut',bytes);const result=await f.library.readMinimapAUT(23);assert.equal(result.length,477603);assert.ok(result.every(v=>v===81));result.fill(0);assert.equal(bytes[0],81);await assert.rejects(f.library.readMinimapAUT(24),{code:'LEGACY_ASSET_REQUIRED_FILE'});
  f.files.controls.hold='bin/PUK2/cutdat/23.aut';const job=f.library.readMinimapAUT(23);await flush();f.library.close();const rejected=assert.rejects(job,{code:'LEGACY_ASSET_CLOSED'});f.files.pending.shift()();await rejected;
 }finally{f.close();}
});
test('closing a pending representative color read cannot resurrect library caches',async()=>{
 const f=await resources();try{f.files.controls.hold='Bin/Graphic.bin';const job=f.library.minimapColorTable([1000]);await flush();f.library.close();const rejected=assert.rejects(job,{code:'LEGACY_ASSET_CLOSED'});f.files.pending.shift()();await rejected;assert.equal(f.library.inspect().state,'closed');
 }finally{f.close();}
});

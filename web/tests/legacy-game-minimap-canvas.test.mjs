import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyGameCanvasResourceHost} from '../legacy-game-canvas.mjs';
import {clientFixture,clientEnter} from './helpers/legacy-game-client-fixture.mjs';
async function setup(decorate){const f=clientFixture();await clientEnter(f);const images=[],canvas={width:0,height:0,getContext(){return {createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},putImageData(image){images.push(image.data.slice());}};}};
 let host;host=createLegacyGameCanvasResourceHost({canvas,runtime:f.client.runtime(),library:f.client.library(),readFrame:f.client.readFrame,tick:()=>1000,bindPointerEvents:false,decorateFrame:(frame,tick)=>decorate(frame,tick,()=>host)});
 return {...f,host,images,close(){host.close();f.close();}};
}
test('synchronous decoration reaches actual Canvas pixels once without repeating source requests',async()=>{
 let decorated=0;const f=await setup((frame,tick)=>{assert.equal(tick,1000);decorated++;frame.rgba.set([1,2,3,255],0);});
 try{const before=f.writes.length,r=await f.host.pump();assert.equal(r.cancelled,false);assert.equal(decorated,1);assert.equal(f.images.length,1);assert.deepEqual([...f.images[0].slice(0,4)],[1,2,3,255]);assert.equal(f.writes.length,before);}finally{f.close();}
});
test('a close inside decoration prevents the prepared frame from touching Canvas',async()=>{
 const f=await setup((frame,tick,get)=>{get().close();});try{const r=await f.host.pump();assert.equal(r.cancelled,true);assert.equal(r.present,false);assert.equal(f.images.length,0);assert.equal(f.host.inspect().state,'closed');}finally{f.close();}
});
test('asynchronous decorators are rejected before Canvas presentation',async()=>{
 const f=await setup(()=>Promise.reject(Error('rejected asynchronous decorator')));try{await assert.rejects(f.host.pump(),/LEGACY_CANVAS_DECORATOR/);assert.equal(f.images.length,0);assert.equal(f.host.inspect().state,'stopped');}finally{f.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyGameCanvasTextRasterizer} from '../legacy-game-text-raster.mjs';
function fixture(decode=b=>String.fromCharCode(...b)){
 const calls=[],canvas={width:0,height:0,getContext(kind,options){calls.push({kind,options});return context;}},context={measureText(text){calls.push({measure:text});return {width:14,actualBoundingBoxLeft:1,actualBoundingBoxRight:14,actualBoundingBoxAscent:0,actualBoundingBoxDescent:14};},
  clearRect(){},fillText(text,x,y){calls.push({text,x,y,font:this.font});},getImageData(){const data=new Uint8Array(canvas.width*canvas.height*4);for(let i=3;i<data.length;i+=4)data[i]=255;return {data};}},document={createElement(kind){assert.equal(kind,'canvas');return canvas;}},port=createLegacyGameCanvasTextRasterizer({document,decode});return {port,canvas,context,calls};
}
const request={font:1,bytes:[65,66]};
test('host font port explicitly decodes owned source bytes and returns copied alpha masks with a bounded anchor',()=>{
 let raw;const f=fixture(b=>{raw=b;return '中文';});try{const m=f.port.raster(request);assert.deepEqual([...raw],[0,0]);assert.ok(m.width>0&&m.height>0);assert.equal(m.alpha.length,m.width*m.height);assert.equal(m.originX,-3);assert.equal(m.originY,-2);assert.deepEqual(request.bytes,[65,66]);assert.match(f.calls.find(r=>r.font)?.font,/14px/);assert.equal(f.calls.find(r=>r.text)?.text,'中文');assert.equal(f.calls[0].options.willReadFrequently,true);}finally{f.port.close();}
});
test('cached glyph reuse cannot be changed by a previous consumer and normal close releases owned surfaces',()=>{
 const f=fixture();const first=f.port.raster(request),saved=first.alpha.slice();first.alpha.fill(0);const second=f.port.raster(request);assert.deepEqual(second.alpha,saved);assert.equal(f.calls.filter(r=>r.measure).length,1);assert.equal(f.port.inspect().entries,1);f.port.close();assert.equal(f.canvas.width,0);assert.equal(f.canvas.height,0);assert.equal(f.port.inspect().bytes,0);assert.equal(f.port.inspect().entries,0);assert.ok(second.alpha.some(n=>n>0));assert.throws(()=>f.port.raster(request),/CLOSED/);
});
test('the GMN font uses the larger host mask and keeps identical text separate from ordinary font 1',()=>{
 const f=fixture(),notice={...request,font:0};
 try{
  const ordinary=f.port.raster(request),large=f.port.raster(notice);
  assert.equal(large.height,ordinary.height+4);
  assert.deepEqual(f.calls.filter(r=>r.font).map(r=>r.font),[
   '400 14px SimSun, "Songti SC", serif','400 18px SimSun, "Songti SC", serif',
  ]);
  assert.deepEqual(f.port.raster(notice),large);
  assert.equal(f.port.inspect().entries,2);
  assert.equal(f.calls.filter(r=>r.measure).length,2);
 }finally{f.port.close();}
});
test('decoding failures and unavailable font requests never produce fallback glyph pixels',()=>{
 const f=fixture(()=>{throw Error('private host decode detail');});try{assert.throws(()=>f.port.raster(request),e=>e.message==='LEGACY_TEXT_CANVAS_DECODE');assert.equal(f.calls.filter(r=>r.measure).length,0);assert.throws(()=>f.port.raster({...request,font:2}),/PROFILE/);assert.equal(f.port.inspect().entries,0);}finally{f.port.close();}
});
test('an unavailable Canvas context or excessive host bounds fails before any mask enters the cache',()=>{
 assert.throws(()=>createLegacyGameCanvasTextRasterizer({document:{createElement:()=>({getContext:()=>null})},decode:()=>''}),/CONTEXT/);const f=fixture();try{f.context.measureText=()=>({width:Infinity});assert.throws(()=>f.port.raster(request),/BUDGET/);assert.equal(f.port.inspect().entries,0);assert.equal(f.calls.filter(r=>r.text).length,0);}finally{f.port.close();}
});
test('reentrant close from the borrowed decoder prevents stale allocation and leaves decoded bytes cleared',()=>{
 let f,raw;f=fixture(b=>{raw=b;f.port.close();return 'AB';});assert.throws(()=>f.port.raster(request),/CLOSED/);assert.deepEqual([...raw],[0,0]);assert.equal(f.port.inspect().bytes,0);assert.equal(f.calls.filter(r=>r.measure).length,0);
});

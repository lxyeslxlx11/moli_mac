import{readFileSync,openSync,readSync,closeSync,statSync,writeFileSync}from'node:fs';
import{createRequire}from'node:module';
import{runInNewContext}from'node:vm';
import{performance}from'node:perf_hooks';
import{createHash}from'node:crypto';
import{resolve}from'node:path';
import assert from'node:assert/strict';
import*as source from'../../shared/index.mjs';
const bundle=resolve('build/wechat-game-stage296-api-final/game.js'),text=readFileSync(bundle,'utf8'),profile=JSON.parse(readFileSync('analysis/game-legacy-material-compat-v1/material-profile.json'));
function vm(math){const module={exports:{}};runInNewContext(text,{module,exports:module.exports,Uint8Array,Uint8ClampedArray,Uint16Array,Uint32Array,Int8Array,Int16Array,Int32Array,Float32Array,ArrayBuffer,DataView,setTimeout,clearTimeout,queueMicrotask,...(math?{Math}:{})},{filename:bundle});return module.exports;}
const rows=[];for(const[name,api]of[['source',source],['cjs',createRequire(import.meta.url)(bundle)],['vm',vm(false)],['vm-with-Math',vm(true)]]){
 const fd=openSync(profile.archive,'r'),start=performance.now(),archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,n){const b=new Uint8Array(n);assert.equal(readSync(fd,b,0,n,at),n);return b},close(){closeSync(fd)}}),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
 try{await library.initialize();const initialize=performance.now(),plan=api.createLegacyGameDrawPlan(640,480,[{image:{index:618381,paletteSelector:0,flags:0,color:0xffffffff},x:0,y:0,priority:0,flip:0}]);
 let digest;for(let i=0;i<3;i++){const frame=await library.startRender(plan).done;digest=createHash('sha256').update(frame.rgba).digest('hex');frame.rgba.fill(0)}const at=performance.now();for(let i=0;i<12;i++){const frame=await library.startRender(plan).done;assert.equal(createHash('sha256').update(frame.rgba).digest('hex'),digest);frame.rgba.fill(0)}rows.push({name,initializeMs:Math.round(initialize-start),render12Ms:Math.round(performance.now()-at),digest});
 }finally{library.close();archive.close()}
}
assert.ok(rows.every(r=>r.digest===rows[0].digest));writeFileSync('build/analysis/game-actual-battle-product-v1/vm-benchmark.json',JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify(rows));

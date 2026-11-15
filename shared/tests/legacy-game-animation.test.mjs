import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createLegacyGameAnimationCatalog,createLegacyGameAnimationPlayer,LegacyGameAnimationError,
  createLegacyGameGraphicCatalog,decodeLegacyGameGraphic,decodeLegacyGameRD,createLegacyGamePalette32,
  prepareLegacyGameSprite,composeLegacyGameFrame } from '../index.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-animation-v1/original-vectors.json',import.meta.url)));
const promoted=['game-additive-render-v1','game-vertex-color-v1'].flatMap(name=>JSON.parse(readFileSync(new URL('../../analysis/'+name+'/original-vectors.json',import.meta.url))).promotedAnimationFrames);
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),plain=x=>JSON.parse(JSON.stringify(x)),sha=b=>createHash('sha256').update(b).digest('hex');
const error=code=>e=>e instanceof LegacyGameAnimationError&&e.code===code;
const groups=()=>vectors.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,v])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(v):v])));
const context=(v={})=>({resourceId:100001,action:0,facing:0,speedPercent:100,mode:0,frozen:0,staticFlip:false,soundScene:0,actorFlags:0,...v});
function geometry({kind,value}){const index=kind==='index'?value:value%5000+3000;return{index,originX:index%7-3,originY:index%5-2,width:4*(index%3+1),height:index%4+2};}
function palette(){const rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);return createLegacyGamePalette32(rgb,'explicit-rgb');}
function raw(w,h,pixels){const b=new Uint8Array(16+pixels.length),v=new DataView(b.buffer);b.set([82,68]);v.setInt32(4,w,true);v.setInt32(8,h,true);v.setUint32(12,b.length,true);b.set(pixels,16);return b;}
function sprite(g,p){const pixels=Uint8Array.from({length:g.width*g.height},(_,i)=>(i+g.index)%5===0?0:1+(i+g.index)%3),image=decodeLegacyGameRD(raw(g.width,g.height,pixels));try{return prepareLegacyGameSprite(image,p);}finally{image.close();}}
function render(api,player,p,cache){const state=player.copyState();let commands=[];
  if(state.geometry){const key=state.graphicIndex;if(!cache.has(key))cache.set(key,sprite(state.geometry,p));const c=player.drawCommand(cache.get(key),16,12);if(c)commands=[c];}
  return composeLegacyGameFrame(32,24,commands).rgba;
}
function oneFrame(version=0,flags=0,count=1,duration=16,event=0){
 const index=new Uint8Array(12),iv=new DataView(index.buffer);iv.setUint32(0,100001,true);iv.setUint16(8,1,true);iv.setUint16(10,version,true);
 const animation=new Uint8Array((version===1?20:12)+Math.max(0,Math.min(count,10000))*10),v=new DataView(animation.buffer);v.setUint32(4,duration,true);v.setUint32(8,count,true);
 if(version===1){v.setUint16(14,flags,true);v.setUint32(16,0xffffffff,true);}if(count){v.setUint32(version===1?20:12,1,true);v.setUint16((version===1?20:12)+8,event,true);}
 return {index,animation,graphicBase:1000};
}
test('grouped12B indices,12/20B actions,10B frames,overrides andfirst AP matches equal Python',()=>{
 const c=createLegacyGameAnimationCatalog(groups());for(const row of vectors.animations)assert.deepEqual(plain(c.animation(row.resourceId)),row);
 assert.equal(c.inspect().resources,5);assert.equal(c.inspect().decodedFrames,106);assert.equal(c.animation(120000),null);c.close();
});
test('35 original Python traces verify1250 exact per-call states,events andanimated RGBA positions',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=palette(),cache=new Map();let steps=0,rgba=0;
 try{for(const trace of vectors.series){const player=createLegacyGameAnimationPlayer(c);try{for(const [step,row]of trace.steps.entries()){steps++;if(row.invalidate)player.invalidate();
   if(row.error){assert.throws(()=>player.step(row.context,geometry),error(row.error));assert.deepEqual(plain(player.copyState()),row.unchangedState);continue;}
   const result=player.step(row.context,geometry);assert.deepEqual(plain(result),row.expected,trace.name+' step'+steps);
   const accepted=promoted.find(r=>r.trace===trace.name&&r.step===step);
   if(accepted){assert.equal(sha(render(null,player,p,cache)),accepted.rgbaSha256);rgba++;}
   else if(row.frameDigest.startsWith('LEGACY_'))assert.throws(()=>render(null,player,p,cache),error(row.frameDigest));
   else{assert.equal(sha(render(null,player,p,cache)),row.frameDigest,trace.name+' pixels'+steps);rgba++;}
 }}finally{player.close();}}assert.equal(steps,1250);assert.ok(rgba>1100);
 }finally{cache.forEach(x=>x.close());p.close();c.close();}
});
test('same resource/action restarts only throughexplicit invalidate andnew resource/facing resets',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c);p.step(context(),geometry);p.step(context(),geometry);assert.equal(p.copyState().delay,1);
 p.invalidate();p.step(context(),geometry);assert.equal(p.copyState().nextFrame,1);assert.equal(p.copyState().delay,2);assert.equal(p.copyState().lastAction,0);
 p.step(context({facing:1}),geometry);assert.equal(p.copyState().nextFrame,1);p.close();c.close();
});
test('freeze==1 preserves previous mode andcached state; other freeze integers do notfreeze',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c);const before=p.copyState();p.step(context({frozen:1,mode:1}),()=>{throw Error('unreachable');});assert.deepEqual(p.copyState(),before);
 assert.equal(p.step(context({frozen:2}),geometry).reason,'frame');p.close();c.close();
});
test('zero actions returns native load-failure -1;empty frames once completes andloop is unsafe',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c);assert.equal(p.step(context({resourceId:100004}),geometry).code,-1);
 assert.equal(p.step(context({resourceId:100003,mode:1}),geometry).reason,'complete');assert.equal(p.copyState().delay,255);
 p.invalidate();assert.throws(()=>p.step(context({resourceId:100003}),geometry),error('LEGACY_ANIMATION_EMPTY_LOOP'));p.close();c.close();
});
test('source version values above1 normalize toshort headers without guessing an extended format',()=>{
 const g=oneFrame(0);new DataView(g.index.buffer).setUint16(10,65535,true);const c=createLegacyGameAnimationCatalog([g]);assert.equal(c.animation(100001).version,0);assert.equal(c.animation(100001).actions[0].color,0xffffffff);c.close();
});
test('event0,sound1..9999 andsignal10000+ honor scene9 actor mask andpersistent signal',()=>{
 for(const [event,scene,flags,kind]of[[0,0,0,null],[9999,0,0,'sound'],[9999,9,0x80000,null],[9999,9,0,'sound'],[10000,9,0x200,'signal']]){
  const c=createLegacyGameAnimationCatalog([oneFrame(0,0,1,16,event)]),p=createLegacyGameAnimationPlayer(c),r=p.step(context({soundScene:scene,actorFlags:flags}),geometry);assert.equal(r.event?.kind??null,kind);assert.equal(p.copyState().signal,kind==='signal'?10000:0);p.close();c.close();}
});
test('multiply wraps uint32 before divide100 andzero periods clamp toone',()=>{
 const c=createLegacyGameAnimationCatalog([oneFrame(0,0,1,1600)]),p=createLegacyGameAnimationPlayer(c);p.step(context({speedPercent:2147483647}),geometry);
 assert.equal(p.copyState().delay,Math.floor((Math.imul(100,2147483647)>>>0)/100)-1);p.invalidate();p.step(context({speedPercent:0}),geometry);assert.equal(p.copyState().delay,0);p.close();c.close();
});
test('owned catalog bytes survive caller overwrite;frozen numeric frames cannot be modified',()=>{
 const gs=groups(),c=createLegacyGameAnimationCatalog(gs);for(const g of gs)for(const v of Object.values(g))if(v instanceof Uint8Array)v.fill(0);
 const a=c.animation(100001);assert.equal(a.actions[0].frames[0].graphicIndex,1002);assert.throws(()=>{a.actions[0].frames[0].x=9;},TypeError);c.close();c.close();assert.throws(()=>c.animation(100001),error('LEGACY_ANIMATION_CLOSED'));
});
test('catalog rejects accessors,shared buffers,sparse groups andwrong record lengths',()=>{
 let reads=0;assert.throws(()=>createLegacyGameAnimationCatalog([{get index(){reads++;},animation:new Uint8Array(),graphicBase:0}]),error('LEGACY_ANIMATION_FIELDS'));assert.equal(reads,0);
 assert.throws(()=>createLegacyGameAnimationCatalog(new Array(1)),error('LEGACY_ANIMATION_GROUPS'));
 assert.throws(()=>createLegacyGameAnimationCatalog([{index:new Uint8Array(1),animation:new Uint8Array(),graphicBase:0}]),error('LEGACY_ANIMATION_INDEX_LENGTH'));
 assert.throws(()=>createLegacyGameAnimationCatalog([{index:new Uint8Array(new SharedArrayBuffer(12)),animation:new Uint8Array(),graphicBase:0}]),error('LEGACY_ANIMATION_INPUT'));
});
test('index domain,action count,archive input andruntime frame budgets are enforced',()=>{
 for(const [at,value,code]of[[0,99999,'LEGACY_ANIMATION_RESOURCE_BOUNDS'],[0,120500,'LEGACY_ANIMATION_RESOURCE_BOUNDS'],[8,10001,'LEGACY_ANIMATION_ACTION_BUDGET']]){
 const g=oneFrame();const v=new DataView(g.index.buffer);if(at===8)v.setUint16(at,value,true);else v.setUint32(at,value,true);assert.throws(()=>createLegacyGameAnimationCatalog([g]),error(code));}
 assert.throws(()=>createLegacyGameAnimationCatalog([{index:new Uint8Array(),animation:new Uint8Array(33554433),graphicBase:0}]),error('LEGACY_ANIMATION_INPUT_BUDGET'));
 const c=createLegacyGameAnimationCatalog([oneFrame(0,0,10000)]);assert.throws(()=>c.animation(100001),error('LEGACY_ANIMATION_FRAME_BUDGET'));c.close();
});
test('truncated header,frame andout-of-range graphics fail lazily without poisoning parsed budget',()=>{
 for(const kind of ['header','frame','offset','graphic']){const g=oneFrame();if(kind==='header')g.animation=g.animation.slice(0,11);if(kind==='frame')g.animation=g.animation.slice(0,-1);
 if(kind==='offset')new DataView(g.index.buffer).setUint32(4,0xffffffff,true);if(kind==='graphic')new DataView(g.animation.buffer).setUint32(12,850000,true);
 const c=createLegacyGameAnimationCatalog([g]);assert.throws(()=>c.animation(100001),error(kind==='graphic'?'LEGACY_ANIMATION_GRAPHIC_BOUNDS':'LEGACY_ANIMATION_TRUNCATED'));assert.equal(c.inspect().decodedFrames,0);c.close();}
});
test('AP pair/header/count/range are checked;unknown AP resource isignored without loading',()=>{
 const g=oneFrame();assert.throws(()=>createLegacyGameAnimationCatalog([{...g,attachmentIndex:Uint8Array.of(1)}]),error('LEGACY_ANIMATION_ATTACHMENT_PAIR'));
 assert.throws(()=>createLegacyGameAnimationCatalog([{...g,attachmentIndex:Uint8Array.of(2),attachmentData:new Uint8Array()}]),error('LEGACY_ANIMATION_ATTACHMENT_INDEX'));
 for(const [offset,count,code]of[[0,1001,'LEGACY_ANIMATION_ATTACHMENT_BUDGET'],[9,1,'LEGACY_ANIMATION_ATTACHMENT_RANGE']]){
 const idx=new Uint8Array(11),v=new DataView(idx.buffer);idx[0]=1;v.setUint32(1,100001,true);v.setUint32(5,offset,true);v.setUint16(9,count,true);
 const c=createLegacyGameAnimationCatalog([{...g,attachmentIndex:idx,attachmentData:new Uint8Array(8)}]);assert.throws(()=>c.animation(100001),error(code));c.close();}
});
test('source geometry must use matching index andactual positive signed16 dimensions',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c),before=p.copyState();
 for(const bad of [q=>({...geometry(q),index:4}),q=>({...geometry(q),width:32768})]){assert.throws(()=>p.step(context(),bad));assert.deepEqual(p.copyState(),before);}
 p.close();c.close();
});
test('source context/geometry getters are not called andfailed request keeps player state',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c),before=p.copyState();let n=0;
 assert.throws(()=>p.step({...context(),get resourceId(){n++;return 100001;}},geometry),error('LEGACY_ANIMATION_FIELDS'));assert.equal(n,0);
 assert.throws(()=>p.step(context(),q=>({...geometry(q),get originX(){n++;return 0;}})),error('LEGACY_ANIMATION_FIELDS'));assert.equal(n,0);assert.deepEqual(p.copyState(),before);p.close();c.close();
});
test('reentrant close in geometry provider cannot commit an animation update',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c);assert.throws(()=>p.step(context(),q=>{p.close();return geometry(q);}),error('LEGACY_ANIMATION_CLOSED'));c.close();
});
test('draw adapter rejects named palette/unsupported effects,wrong sprite size andclosed sprite',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c),pal=palette();let s;
 try{p.step(context({resourceId:100002,action:6}),geometry);s=sprite(p.copyState().geometry,pal);assert.throws(()=>p.drawCommand(s,0,0),error('LEGACY_ANIMATION_DRAW_STYLE'));s.close();
 p.step(context(),geometry);s=sprite({...p.copyState().geometry,width:4,height:1},pal);assert.throws(()=>p.drawCommand(s,0,0),error('LEGACY_ANIMATION_SPRITE_DIMENSIONS'));s.close();
 s=sprite(p.copyState().geometry,pal);s.close();assert.throws(()=>p.drawCommand(s,0,0),{code:'LEGACY_RENDER_CLOSED'});
 }finally{s?.close();p.close();pal.close();c.close();}
});
test('index below1000 is decoded as metadata butnative506d50 draw guard skips it',()=>{
 const g=oneFrame();g.graphicBase=0;const c=createLegacyGameAnimationCatalog([g]),p=createLegacyGameAnimationPlayer(c);p.step(context(),geometry);
 assert.equal(p.copyState().graphicIndex,1);assert.equal(p.drawCommand(null,0,0),null);p.close();c.close();
});
test('ordinal imageAt -> archive decode -> animation origin -> preparedsprite -> sourcepriority10 frame',()=>{
 const g=oneFrame(),idx=new Uint8Array(40),iv=new DataView(idx.buffer),pixels=Uint8Array.of(0,1,2,3,3,2,1,0),archive=raw(4,2,pixels);
 iv.setInt32(0,1001,true);iv.setUint32(8,archive.length,true);iv.setInt32(12,-2,true);iv.setInt32(16,1,true);iv.setUint32(20,4,true);iv.setUint32(24,2,true);
 const graphics=createLegacyGameGraphicCatalog([idx],{includeImages:true}),cat=createLegacyGameAnimationCatalog([g]),player=createLegacyGameAnimationPlayer(cat),pal=palette(),image=decodeLegacyGameGraphic(archive,graphics.imageAt(1001)),sp=prepareLegacyGameSprite(image,pal);
 try{assert.equal(graphics.imageAt(1001).resourceId,null);assert.equal(image.inspect().graphic.resourceId,null);
 player.step(context(),q=>{const d=graphics.imageAt(q.value),i=image.inspect();return{index:d.index,originX:d.originX,originY:d.originY,width:i.width,height:i.height};});
 const cmd=player.drawCommand(sp,5,3);assert.equal(cmd.priority,10);assert.equal(cmd.x,3);assert.equal(cmd.y,4);assert.equal(composeLegacyGameFrame(10,8,[cmd]).rgba[(4*10+3)*4+3],255);
 }finally{[sp,image,pal,player,cat,graphics].forEach(x=>x.close());}
});
test('catalogclose invalidates a borrowing player butdoes not close independent sprite data',()=>{
 const cat=createLegacyGameAnimationCatalog(groups()),player=createLegacyGameAnimationPlayer(cat),pal=palette(),sp=sprite(geometry({kind:'index',value:1002}),pal);cat.close();assert.throws(()=>player.copyState(),error('LEGACY_ANIMATION_CLOSED'));assert.ok(sp.copyRGBA().length);player.close();sp.close();pal.close();
});
test('source integer zero remains positive zero after flip andcontext normalization',()=>{
 const c=createLegacyGameAnimationCatalog([oneFrame(1,3)]),p=createLegacyGameAnimationPlayer(c);
 p.step(context({action:-0,facing:-0,mode:-0}),({value})=>({index:value,originX:-4,originY:-2,width:4,height:2}));
 const s=p.copyState();for(const key of ['lastAction','lastFacing','mode','drawOffsetX','drawOffsetY','attachmentX','attachmentY'])assert.equal(Object.is(s[key],-0),false,key);p.close();c.close();
});

test('actor animation copy keeps exact frame/attachment state and independent cursor ownership',()=>{
 const c=createLegacyGameAnimationCatalog(groups()),p=createLegacyGameAnimationPlayer(c);let clone;
 try{for(let i=0;i<7;i++)p.step(context(),geometry);clone=p.clone();assert.deepEqual(clone.copyState(),p.copyState());const before=clone.copyState();p.clearSignal();p.resetFrames();assert.deepEqual(clone.copyState(),before);p.close();const q=createLegacyGameAnimationPlayer(c);try{for(let i=0;i<7;i++)q.step(context(),geometry);for(let i=0;i<12;i++)assert.deepEqual(clone.step(context(),geometry),q.step(context(),geometry));}finally{q.close();}clone.close();assert.throws(()=>clone.clone(),error('LEGACY_ANIMATION_CLOSED'));}finally{p.close();clone?.close();c.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LEGACY_GAME_GRAPHIC_PROFILE as graphicProfile,LegacyGameGraphicError as GraphicError,createLegacyGameGraphicCatalog as graphics,
  resolveLegacyGameMapGraphic as primitive,LEGACY_GAME_NAVIGATION_PROFILE as navProfile,LegacyGameNavigationError as NavigationError,
  legacyGameCollisionWindow as windowFor,createLegacyGameCollisionGrid as gridFromBytes,createLegacyGameCollisionGridFromRectangle as gridFromPlanes,
  planLegacyGamePath as path,findLegacyGameMissingMapRectangles as missing,classifyLegacyGameTileEventContext as selector,
  createLegacyGameMapState as mapState } from '../index.mjs';
const v=JSON.parse(await readFile(new URL('../../analysis/game-legacy-local-movement-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),plain=value=>JSON.parse(JSON.stringify(value));
const error=(type,code)=>e=>e instanceof type&&e.code===code;
function record(index,resource,w=1,h=1,flags=0){const raw=new Uint8Array(40),d=new DataView(raw.buffer);d.setInt32(0,index,true);d.setUint32(36,resource,true);raw[28]=w;raw[29]=h;d.setUint16(30,flags,true);return raw;}
function mapBytes(width,height,planes){const raw=new Uint8Array(20+6*width*height),d=new DataView(raw.buffer);raw.set([77,65,80,1]);d.setInt32(12,width,true);d.setInt32(16,height,true);for(let p=0;p<3;p++)for(let i=0;i<width*height;i++)d.setUint16(20+(p*width*height+i)*2,planes[p][i],true);return raw;}
function routeGrid(row){const n=row.width*row.height;return gridFromPlanes(row.width,row.height,[0,0,row.width,row.height],[new Uint16Array(n),new Uint16Array(n),Uint16Array.from(row.cells,c=>0xc000|(c===1?256:0))],1);}

test('source graphic file40/runtime32 metadata and original group/resource queries match Python including conditional override',()=>{
  const inputs=v.graphicGroupsHex.map(bytes),c=graphics(inputs);assert.equal(graphicProfile.recordBytes,40);assert.equal(graphicProfile.runtimeRecordBytes,32);
  assert.deepEqual({...c.inspect(),profile:undefined,imagePixels:undefined,currentVersionCompatibility:undefined,sourceCapacity:undefined},{...v.graphicSummary,profile:undefined,imagePixels:undefined,currentVersionCompatibility:undefined,sourceCapacity:undefined});
  for(const q of v.graphicQueries)assert.deepEqual(c.lookup(q.resourceId),q);for(const input of inputs)input.fill(0);
  assert.equal(c.lookup(245040).index,0x9999d);assert.equal(c.lookup(245040).rawFlags,202);assert.equal(c.lookup(60).index,9);c.close();
});
test('all8 primitive conversion boundaries match source19999/20000 split and uint32 identity branch',()=>{
  for(const row of v.primitiveCases)assert.equal(primitive(row.input),row.expected);assert.throws(()=>primitive(-1),error(GraphicError,'LEGACY_GRAPHIC_INTEGER'));
});
test('graphic catalog retains native zero-index defaults, last resource mapping and source group row-count offset',()=>{
  const first=new Uint8Array(80);first.set(record(0,0,1,2,103));first.set(record(1,1000,3,4,102),40);const second=record(0,1000,5,6,100),c=graphics([first,second]);
  assert.equal(c.lookup(1000).index,2);assert.equal(c.lookup(1000).tileWidth,5);assert.equal(c.lookup(7000).index,0);assert.equal(c.lookup(7000).collisionClass,3);c.close();
});
test('graphic parser rejects unsafe source indices, nonwhole40B data, oversized groups and caller getters',()=>{
  assert.throws(()=>graphics([record(-1,0)]),error(GraphicError,'LEGACY_GRAPHIC_RECORD_BOUNDS'));assert.throws(()=>graphics([record(850000,0)]),error(GraphicError,'LEGACY_GRAPHIC_RECORD_BOUNDS'));
  assert.throws(()=>graphics([new Uint8Array(39)]),error(GraphicError,'LEGACY_GRAPHIC_LENGTH'));assert.throws(()=>graphics(Array.from({length:8},()=>new Uint8Array())),error(GraphicError,'LEGACY_GRAPHIC_GROUPS'));
  let called=0;const groups=[new Uint8Array(40)];Object.defineProperty(groups,0,{get(){called++;return new Uint8Array(40);}});assert.throws(()=>graphics(groups),error(GraphicError,'LEGACY_GRAPHIC_GROUPS'));assert.equal(called,0);
  const c=graphics([new Uint8Array()]);assert.throws(()=>c.lookup(850000),error(GraphicError,'LEGACY_GRAPHIC_RESOURCE_BOUNDS'));c.close();c.close();assert.throws(()=>c.lookup(1),error(GraphicError,'LEGACY_GRAPHIC_CLOSED'));
});
test('graphic input uses intrinsic typed bytes and rejects detached/shared/proxy buffers',()=>{
  class Hostile extends Uint8Array{get length(){throw Error('getter');}get buffer(){throw Error('getter');}get byteOffset(){throw Error('getter');}}
  const c=graphics([new Hostile(record(0,0))]);c.close();const detached=new Uint8Array(40);structuredClone(detached,{transfer:[detached.buffer]});
  for(const raw of [null,{},[],new Uint16Array(20),detached,new Proxy(new Uint8Array(40),{}),new Uint8Array(new SharedArrayBuffer(40))])assert.throws(()=>graphics([raw]),error(GraphicError,'LEGACY_GRAPHIC_INPUT'));
});
test('source file record-count plus10 guard is strict below850000, independent of sparse record indices',()=>{
  const raw=new Uint8Array(849990*40);assert.throws(()=>graphics([raw]),error(GraphicError,'LEGACY_GRAPHIC_BUDGET'));
  const c=graphics([raw.subarray(0,raw.length-40)]);assert.equal(c.inspect().records,849989);c.close();
});
test('all41 independent Python collisions cover both modes, special primitives, ordered footprints and final flag overrides',()=>{
  const c=graphics(v.graphicGroupsHex.map(bytes));for(const row of v.collisionCases){const inputs=row.planes.map(p=>Uint16Array.from(p)),g=gridFromPlanes(row.width,row.height,[0,0,row.width,row.height],inputs,row.mode,c);
    assert.deepEqual([...g.copyCells()],row.expected,row.name);for(const p of inputs)p.fill(0);assert.deepEqual([...g.copyCells()],row.expected);g.close();}c.close();
});
test('mode1 uses only0x100; inside2 remains walkable and every outside coordinate is blocked',()=>{
  const g=gridFromPlanes(2,2,[0,0,2,2],[new Uint16Array(4),new Uint16Array(4),new Uint16Array([0,256,0xc002,0xc000])],1);
  assert.equal(g.isBlocked(0,0),false);assert.equal(g.isBlocked(1,0),true);assert.equal(g.isBlocked(0,1),false);for(const p of [[-1,0],[2,1],[1,-1],[1,2]])assert.equal(g.isBlocked(...p),true);g.close();
});
test('normal collision cell2 overrides blocking; later object footprint may replace an earlier row final flag',()=>{
  const c=graphics(v.graphicGroupsHex.map(bytes)),w=4,h=3,ground=new Uint16Array(w*h).fill(1),objects=new Uint16Array(w*h),flags=new Uint16Array(w*h);
  ground[1]=4;objects[5]=20000;flags[0]=1;objects[4]=20001;
  const g=gridFromPlanes(w,h,[0,0,w,h],[ground,objects,flags],0,c);assert.equal(g.cellValue(1,0),2);assert.equal(g.isBlocked(1,0),false);assert.equal(g.cellValue(0,0),2);g.close();c.close();
});
test('normal resource classification needs verified catalog only for metadata branches; closed catalog rejected',()=>{
  const base=[new Uint16Array([1]),new Uint16Array([0]),new Uint16Array([0])];assert.equal(gridFromPlanes(1,1,[0,0,1,1],base,0).isBlocked(0,0),false);
  base[0][0]=1000;assert.throws(()=>gridFromPlanes(1,1,[0,0,1,1],base,0),error(NavigationError,'LEGACY_NAVIGATION_GRAPHICS_REQUIRED'));
  const c=graphics(v.graphicGroupsHex.map(bytes));c.close();assert.throws(()=>gridFromPlanes(1,1,[0,0,1,1],base,0,c),error(GraphicError,'LEGACY_GRAPHIC_CLOSED'));
});
test('source51x51 asymmetric clipped window is not a symmetric radius and unsafe short arithmetic is rejected',()=>{
  assert.deepEqual([...windowFor(100,100,[40,40])],[10,20,61,71]);assert.deepEqual([...windowFor(100,100,[0,0])],[0,0,21,31]);assert.deepEqual([...windowFor(100,100,[99,99])],[69,79,100,100]);
  assert.throws(()=>windowFor(32767,32767,[32760,4]),error(NavigationError,'LEGACY_NAVIGATION_SHORT'));assert.throws(()=>windowFor(0,10,[1,1]),error(NavigationError,'LEGACY_NAVIGATION_DIMENSIONS'));
});
test('actual MAP01 bytes and map-state rectangle API prepare identical owned collision without whole-cache copies in world',()=>{
  const w=8,h=6,planes=[new Uint16Array(w*h).fill(1),new Uint16Array(w*h),new Uint16Array(w*h).fill(0xc000)];planes[2][12]|=256;
  const raw=mapBytes(w,h,planes),direct=gridFromBytes(raw,w,h,[2,3],1),m=mapState(7,23,raw,1),rect=windowFor(w,h,[2,3]),selected=m.readRectangle(rect),projected=gridFromPlanes(w,h,rect,selected.planes,1);
  assert.deepEqual(projected.copyCells(),direct.copyCells());selected.planes[2].fill(0);assert.equal(m.readRectangle(rect).planes[2][12],0xc100);raw.fill(0);assert.equal(direct.isBlocked(4,1),true);projected.close();direct.close();m.close();
  assert.throws(()=>gridFromBytes(mapBytes(w,h,planes),w+1,h,[2,3],1),error(NavigationError,'LEGACY_NAVIGATION_MAP_DIMENSIONS'));
});
test('all149 independent Python paths prove source directional candidates, corners, merges, fallback and native limit behavior',()=>{
  for(const row of v.pathCases){const g=routeGrid(row);try{if(row.error)assert.throws(()=>path(g,row.start,row.goal),error(NavigationError,row.error));else assert.deepEqual(plain(path(g,row.start,row.goal)),row.expected,row.name);}finally{g.close();}}
});
test('same-point path retains prior route intent; blocked goal supplies final facing while native100 outer reset is distinct from unsafe fallback',()=>{
  const same=v.pathCases.find(r=>r.name==='same-point'),blocked=v.pathCases.find(r=>r.name==='blocked-goal'),reset=v.pathCases.find(r=>r.name==='native-outer-reset'),exact=v.pathCases.find(r=>r.name==='exact100');
  for(const row of [same,blocked,reset,exact]){const g=routeGrid(row),result=path(g,row.start,row.goal);
    if(row===same)assert.equal(result.preservePreviousRoute,true);if(row===blocked){assert.equal(result.reached,false);assert.equal(result.finalFacing,2);}if(row===reset)assert.equal(result.reason,'source-capacity-reset');if(row===exact)assert.equal(result.steps.length,100);g.close();}
});
test('path data and snapshots never alias grid cells or caller origin/destination',()=>{
  const row=v.pathCases[0],g=routeGrid(row),start=[...row.start],goal=[...row.goal],r=path(g,start,goal);start.fill(0);goal.fill(0);g.copyCells().fill(1);assert.deepEqual([...r.origin],row.start);assert.deepEqual([...r.destination],row.goal);assert.equal(Object.isFrozen(r.steps[0].coordinates),true);g.close();assert.throws(()=>path(g,[0,0],[1,1]),error(NavigationError,'LEGACY_NAVIGATION_CLOSED'));
});
test('all32 original leading-strip lookaheads emit source-order clipped missing-cache requests of at most2 rectangles',()=>{
  for(const row of v.lookaheadCases){const [left,top,right,bottom]=windowFor(row.width,row.height,row.origin),width=right-left,height=bottom-top,flags=new Uint16Array(width*height).fill(0xc000);
    for(const [x,y] of row.holes)flags[(y-top)*width+x-left]=0;
    const g=gridFromPlanes(row.width,row.height,[left,top,right,bottom],[new Uint16Array(flags.length),new Uint16Array(flags.length),flags],1);assert.deepEqual(plain(missing(g,row.origin,row.direction)),row.expected);g.close();}
});
test('cache lookahead is disabled on a clipped edge window and loaded flags keep exact words rather than collision mask',()=>{
  const g=gridFromPlanes(20,20,[0,0,20,20],[new Uint16Array(400),new Uint16Array(400),new Uint16Array(400)],1);assert.deepEqual([...missing(g,[2,3],6)],[]);g.close();
});
test('all32 source tile selector values retain two explicit ranges and three other branches',()=>{for(const row of v.selectorCases)assert.equal(selector(row.input),row.expected);});
test('navigation validates rectangle budgets, primitive arrays, getter-free coordinates and typed ownership',()=>{
  assert.equal(navProfile.windowCells,2601);const p=[new Uint16Array(1),new Uint16Array(1),new Uint16Array(1)];assert.throws(()=>gridFromPlanes(100,100,[0,0,52,51],p,1),error(NavigationError,'LEGACY_NAVIGATION_WINDOW'));
  assert.throws(()=>gridFromPlanes(10,10,[-1,0,1,1],p,1),error(NavigationError,'LEGACY_NAVIGATION_WINDOW'));assert.throws(()=>gridFromPlanes(1,1,[0,0,1,1],[p[0],new Uint8Array(2),p[2]],1),error(NavigationError,'LEGACY_NAVIGATION_PLANE'));
  let called=0;const origin=[0,0];Object.defineProperty(origin,0,{get(){called++;return 0;}});assert.throws(()=>windowFor(10,10,origin),error(NavigationError,'LEGACY_NAVIGATION_ARGUMENTS'));assert.equal(called,0);
  const shared=new Uint16Array(new SharedArrayBuffer(2));assert.throws(()=>gridFromPlanes(1,1,[0,0,1,1],[p[0],p[1],shared],1),error(NavigationError,'LEGACY_NAVIGATION_PLANE'));
});

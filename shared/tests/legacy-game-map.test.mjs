import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_MAP_PROFILE,LegacyGameMapError,readLegacyGameMapRectangle as read,
  checksumLegacyGameMapRectangle as checks,decodeLegacyGameMapPatch as decode,applyLegacyGameMapPatch as apply,
  createLegacyGameMapState as mapState,createLegacyGameProtocol as protocol,createLegacyGamePayloadCodec as codec,
  encodeLegacyGameEnvelope as frame } from '../index.mjs';
const directory=new URL('../../analysis/game-legacy-world-v1/',import.meta.url);
const v=JSON.parse(await readFile(new URL('original-vectors.json',directory)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=raw=>Buffer.from(raw).toString('hex'),ascii=s=>new Uint8Array(Buffer.from(s,'latin1'));
const planes=result=>result.planes.map(p=>Array.from(p));
const error=code=>value=>value instanceof LegacyGameMapError&&value.code===code;
function encrypted(plain){const c=codec(bytes(v.bootstrap.keyHex));try{return frame(c.encode(plain));}finally{c.close();}}
function prepared(){const p=protocol();p.configureMapCache(...v.protocol.identity,bytes(v.protocol.cacheHex),v.protocol.mode);
  p.append(frame(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');return p;}

test('32 independent Python rectangles prove three contiguous LE16 planes, zero clipping and request stride',()=>{
  for(const row of v.rectangleCases){const result=read(bytes(v.mapHex),row.rectangle);assert.deepEqual(planes(result),row.planes);
    assert.deepEqual([...result.rectangle],row.rectangle);assert.equal(result.width,row.rectangle[2]-row.rectangle[0]);}
  assert.equal(LEGACY_GAME_MAP_PROFILE.rectangleCells,2601);assert.equal(LEGACY_GAME_MAP_PROFILE.checksumBytes,1458);
});
test('all96 polynomial-long-division checksum vectors match fixed span and both third-plane masks',()=>{
  for(const row of v.rectangleCases)for(const expected of row.checksums)assert.deepEqual([...checks(bytes(v.mapHex),row.rectangle,expected.mode)],expected.values);
  assert.notDeepEqual(checks(bytes(v.mapHex),[0,0,27,27],0),checks(bytes(v.mapHex),[0,0,27,27],1));
});
test('checksum covers first729 cells even for a larger rectangle and masks only plane2',()=>{
  const raw=new Uint8Array(20+6*2601);raw.set([77,65,80,1]);const d=new DataView(raw.buffer);d.setUint32(12,51,true);d.setUint32(16,51,true);
  d.setUint16(20,0x9876,true);const first=checks(raw,[0,0,51,51],0);d.setUint16(20+729*2,0xbeef,true);
  assert.deepEqual(checks(raw,[0,0,51,51],0),first);d.setUint16(20+2601*4,0xf000,true);
  assert.deepEqual(checks(raw,[0,0,51,51],0),first);d.setUint16(20+2601*4,0x200,true);
  assert.notDeepEqual(checks(raw,[0,0,51,51],0),checks(raw,[0,0,51,51],1));
});
test('five original patch vectors match pair-aware separators, wrapping numbers and ignored extra data',()=>{
  for(const row of v.patchCases){const raw=bytes(row.dataHex),result=decode(raw,row.rectangle);raw.fill(0);
    assert.deepEqual(planes(result),row.planes);assert.equal(result.ignoredOuterBytes,row.ignoredOuterBytes);}
  assert.deepEqual(planes(decode(ascii('1-|--1|!'),[0,0,1,1])),[[65474],[65535],[0]]);
  assert.deepEqual(planes(decode(ascii('1|2|3\0unread'),[0,0,1,1])),[[1],[2],[3]]);
});
test('patches preserve header and original cache, clip correctly, and OR0xc000 into written plane2 only',()=>{
  for(const row of v.patchCases){const original=bytes(v.smallMapHex),result=apply(original,row.rectangle,bytes(row.dataHex));
    assert.equal(hex(result.bytes),row.updatedHex);assert.equal(result.writtenCells,row.writtenCells);assert.equal(hex(original),v.smallMapHex);
    assert.equal(hex(result.bytes.subarray(0,20)),v.smallMapHex.slice(0,40));}
  const result=apply(bytes(v.smallMapHex),[0,0,1,1],ascii('1|2|3'));
  assert.deepEqual(planes(read(result.bytes,[0,0,1,1])),[[1],[2],[49155]]);
});
test('positive signed rectangles reject overflow/zero/negative and enforce exact2601-cell budget',()=>{
  assert.equal(read(bytes(v.smallMapHex),[0,0,51,51]).planes[0].length,2601);
  for(const r of [[0,0,0,1],[2,0,1,1]])assert.throws(()=>read(bytes(v.smallMapHex),r),error('LEGACY_MAP_RECTANGLE'));
  for(const r of [[0,0,51,52],[-2147483648,0,2147483647,1]])assert.throws(()=>read(bytes(v.smallMapHex),r),error('LEGACY_MAP_RECTANGLE_BUDGET'));
  assert.throws(()=>read(bytes(v.smallMapHex),[0,0,2147483648,1]),error('LEGACY_MAP_INTEGER'));
  assert.throws(()=>checks(bytes(v.smallMapHex),[0,0,1,1],undefined),error('LEGACY_MAP_INTEGER'));
});
test('explicit MAP01 boundary validates version, positive dimensions, length and cell budget',()=>{
  for(const [mutate,code] of [[b=>b.fill(0,0,4),'LEGACY_MAP_VERSION'],[b=>b.fill(0,12,16),'LEGACY_MAP_DIMENSIONS'],
    [b=>new DataView(b.buffer).setUint32(12,0xffffffff,true),'LEGACY_MAP_CELL_BUDGET']]){
    const b=bytes(v.smallMapHex);mutate(b);assert.throws(()=>read(b,[0,0,1,1]),error(code));}
  assert.throws(()=>read(new Uint8Array(19),[0,0,1,1]),error('LEGACY_MAP_TRUNCATED'));
  assert.throws(()=>read(bytes(v.smallMapHex).subarray(0,-1),[0,0,1,1]),error('LEGACY_MAP_LENGTH'));
});
test('missing/uninitialized patch domains reject mismatched plane counts and cell counts',()=>{
  for(const s of ['1','1|2'])assert.throws(()=>decode(ascii(s),[0,0,1,1]),error('LEGACY_MAP_PATCH_PLANES'));
  for(const s of ['1,2|3|4','1|2|3,4','1,|2,3|4,5'])assert.throws(()=>decode(ascii(s),[0,0,1,1]),error('LEGACY_MAP_PATCH_CELLS'));
  assert.throws(()=>decode(ascii('1|2|\x81'),[0,0,1,1]),error('LEGACY_MAP_TEXT_PAIR'));
});
test('99-byte cell,18191-byte plane and32760-byte input boundaries are exact and never truncate',()=>{
  assert.equal(decode(ascii('0'.repeat(99)+'|0|0'),[0,0,1,1]).planes[0][0],0);
  assert.throws(()=>decode(ascii('0'.repeat(100)+'|0|0'),[0,0,1,1]),error('LEGACY_MAP_TOKEN_BUDGET'));
  const plane=Array.from({length:182},(_,i)=>'0'.repeat(i<174?99:98)).join(','),short=new Array(182).fill('0').join(',');
  assert.equal(plane.length,18191);assert.equal(decode(ascii(plane+'|'+short+'|'+short),[0,0,14,13]).planes[0].length,182);
  assert.throws(()=>decode(ascii(plane+'0|'+short+'|'+short),[0,0,14,13]),error('LEGACY_MAP_TOKEN_BUDGET'));
  assert.equal(decode(ascii('0|0|0|'+'x'.repeat(32754)),[0,0,1,1]).ignoredOuterBytes,32754);
  assert.throws(()=>decode(new Uint8Array(32761),[0,0,1,1]),error('LEGACY_MAP_BUDGET'));
});
test('input intrinsics ignore hostile typed getters and accessor rectangle arrays are never invoked',()=>{
  class Hostile extends Uint8Array{get length(){throw Error('getter');}get buffer(){throw Error('getter');}get byteOffset(){throw Error('getter');}}
  const raw=bytes(v.smallMapHex);assert.equal(read(new Hostile(raw.buffer),[0,0,1,1]).planes.length,3);
  let called=0;const r=[0,0,1,1];Object.defineProperty(r,0,{get(){called++;return 0;}});
  assert.throws(()=>read(raw,r),error('LEGACY_MAP_ARGUMENTS'));assert.equal(called,0);
  const detached=new Uint8Array(3);structuredClone(detached,{transfer:[detached.buffer]});
  for(const bad of [null,{},[],new Uint16Array(3),new DataView(new ArrayBuffer(4)),detached,new Proxy(raw,{}),new Uint8Array(new SharedArrayBuffer(4))])
    assert.throws(()=>read(bad,[0,0,1,1]),error('LEGACY_MAP_INPUT'));
});
test('one explicit cache offers source request using notice identityA while reading active cache identityA',()=>{
  const s=mapState(...v.protocol.identity,bytes(v.protocol.cacheHex),1),effect=s.applyNotice(v.protocol.initialNotice);
  assert.equal(effect.matches,false);assert.deepEqual([...effect.cacheIdentity],[7,23]);assert.deepEqual([...effect.messageIdentity],[9,23]);
  assert.equal(effect.request.operationId,'send-004f6610');assert.deepEqual([...effect.request.arguments],v.protocol.initialNotice.slice(0,6));
  assert.equal(s.applyNotice([9,24,...v.protocol.initialNotice.slice(2)]).kind,'map-cache-unavailable');
  const hostile=new Proxy([...v.protocol.initialNotice],{ownKeys(target){s.close();return Reflect.ownKeys(target);}});
  assert.throws(()=>s.applyNotice(hostile),error('LEGACY_MAP_CLOSED'));
});
test('map-state patch transactions own cache and leave bytes unchanged after invalid or unavailable patches',()=>{
  const s=mapState(...v.protocol.identity,bytes(v.protocol.cacheHex),1),row=v.patchCases[0];
  assert.throws(()=>s.applyPatch([7,23,...row.rectangle,ascii('bad')]),error('LEGACY_MAP_PATCH_PLANES'));assert.equal(hex(s.copyBytes()),v.protocol.cacheHex);
  assert.equal(s.applyPatch([8,23,0,0,1,1,null]).kind,'map-cache-unavailable');assert.equal(hex(s.copyBytes()),v.protocol.cacheHex);
  const effect=s.applyPatch([7,23,...row.rectangle,bytes(row.dataHex)]);assert.equal(effect.writtenCells,row.writtenCells);assert.equal(hex(s.copyBytes()),row.updatedHex);
  const snapshot=s.copyBytes();snapshot.fill(0);assert.equal(hex(s.copyBytes()),row.updatedHex);s.close();s.close();assert.equal(s.inspect().installed,false);
  assert.throws(()=>s.copyBytes(),error('LEGACY_MAP_CLOSED'));
});
test('protocol keeps map messages raw until configured and failed cache replacement preserves existing state',()=>{
  const p=protocol();p.append(frame(bytes(v.bootstrap.payloadHex)));p.next();p.append(encrypted(bytes(v.protocol.noticeHex)));assert.equal(p.next().effect,null);
  p.configureMapCache(...v.protocol.identity,bytes(v.protocol.cacheHex),1);assert.throws(()=>p.configureMapCache(7,23,ascii('bad'),1),error('LEGACY_MAP_TRUNCATED'));
  assert.equal(hex(p.copyMapCache()),v.protocol.cacheHex);assert.equal(p.copyGameState().map.nativeSceneSynchronization,'unmodeled');p.close();assert.equal(p.copyGameState().map,null);
});
test('in-stream bad patches fail-close map and material; EOF and close clear installed cache',()=>{
  const p=prepared();p.append(encrypted(ascii('=mJ 7 n 0 0 1 1 bad ')));
  assert.throws(()=>p.next(),error('LEGACY_MAP_PATCH_PLANES'));assert.equal(p.inspect().state,'failed');assert.equal(p.inspect().keyAvailable,false);assert.equal(p.copyGameState().map,null);
  for(const method of ['finish','close']){const q=prepared();q[method]();assert.equal(q.copyGameState().map,null);}
});
test('standalone Python TCP maps notice→source request→clipped patch→matching notice using only3 public original files',{timeout:15000},async()=>{
  const standalone=await mkdtemp(join(tmpdir(),'moli-original-map-'));
  for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(standalone,name));
  await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(standalone,'wire_reference.py'));
  const child=spawn('python3',[join(standalone,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket;
  child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),p=protocol();let finalBytes,effects=[];
  try{
    p.configureMapCache(...v.protocol.identity,bytes(v.protocol.cacheHex),v.protocol.mode);const opening=JSON.parse((await iterator.next()).value);
    socket=createConnection({host:'127.0.0.1',port:opening.port});
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;
      if(event.effect){effects.push(event.effect);if(event.effect.request)socket.write(p.encodeCommand(event.effect.request.operationId,event.effect.request.arguments));}
    }}catch(error){reject(error);}});socket.once('end',()=>{finalBytes=p.copyMapCache();resolve();});});
    assert.deepEqual(effects.map(e=>e.kind),['map-cache-notice','map-cache-patch','map-cache-notice','map-cache-unavailable']);
    assert.equal(effects[0].matches,false);assert.equal(effects[2].matches,true);assert.equal(hex(finalBytes),v.protocol.updatedHex);
    assert.equal(p.copyGameState().map.updates,1);p.finish();assert.equal(p.copyGameState().map,null);
    const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,1);assert.equal(await exit,0,diagnostics);
  }finally{p.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(standalone,{recursive:true,force:true});}
});

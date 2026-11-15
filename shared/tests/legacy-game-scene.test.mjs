import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_STATE_CATALOG as catalog,LEGACY_GAME_SCENE_PROFILE,LegacyGameSceneError,LegacyGameStateError,
  prepareLegacyGameSceneTransition as prepare,decodeLegacyGameStateRecord as decode,decodeLegacyGameSceneLabel as label,
  createLegacyGameState as state,createLegacyGameWorldProtocol as world,createLegacyGameProtocol as rawProtocol,
  createLegacyGamePayloadCodec as codec,encodeLegacyGameEnvelope as frame,encodeLegacyGameInteger as integer } from '../index.mjs';
const directory=new URL('../../analysis/game-legacy-scene-v1/',import.meta.url),v=JSON.parse(await readFile(new URL('original-vectors.json',directory)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=raw=>Buffer.from(raw).toString('hex'),ascii=s=>new Uint8Array(Buffer.from(s,'latin1'));
const error=(type,code)=>value=>value instanceof type&&value.code===code;
const normalize=value=>value instanceof Uint8Array?{bytesHex:hex(value)}:value;
function normalized(update){return Object.fromEntries(['recordId','operationId','flags','updates','ignoredFields','missingFields','extraTokenCount'].map(key=>[key,
  key==='updates'?update.updates.map(row=>({...row,value:normalize(row.value)})):key==='ignoredFields'?[...update[key]]:update[key]]));}
function encrypted(plain){const c=codec(bytes(v.bootstrap.keyHex));try{return frame(c.encode(plain));}finally{c.close();}}
function prepared(){const p=world();p.append(frame(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');return p;}
function send(p,plain){p.append(encrypted(plain));return p.next();}
function scenePlain(fields){return ascii('TfD '+fields.map(n=>Buffer.from(integer(n)).toString('ascii')).join(' ')+' ');}
function field(snapshot,record,index){return snapshot.records.find(r=>r.id===record).fields[index-1].value;}

test('source metadata freezes ordered30/18 fields, shared bit0-all masks and one sourced clamp',()=>{
  assert.deepEqual(catalog.map(r=>r.fields.length),[30,18]);assert.equal(LEGACY_GAME_SCENE_PROFILE.nativeSceneSynchronization,'unmodeled');
  for(const record of catalog)for(const [i,f] of record.fields.entries()){
    assert.equal(f.mask,(2**(i+1))|1);assert.equal(Object.isFrozen(f),true);assert.match(f.native_storage,/^0x[0-9a-f]+$/);}
  assert.equal(catalog[1].fields[17].nonpositive_replacement,100);assert.equal(catalog[0].fields[28].maximum_decoded_bytes,16);
});
test('21 original Python scene preparations match creation/reuse/identityA2/skip and own cache bytes',()=>{
  for(const row of v.sceneCases){const prior=row.previousHex===null?null:bytes(row.previousHex),result=prepare(row.arguments,row.previousIdentity,prior);
    assert.equal(result.cacheAction,row.expected.cacheAction);assert.equal(result.cacheBytes?hex(result.cacheBytes):null,row.expected.cacheHex);
    assert.deepEqual([...result.scene.fields],row.arguments);if(prior){const expected=hex(result.cacheBytes);prior.fill(0);assert.equal(hex(result.cacheBytes),expected);}}
});
test('scene header order, mode, source resource fallback and unknown facing remain explicit',()=>{
  const row=v.protocol.scene,result=prepare(row),d=new DataView(result.cacheBytes.buffer);
  assert.deepEqual([d.getInt32(4,true),d.getInt32(8,true),d.getInt32(12,true),d.getInt32(16,true)],[111,-22,5,4]);
  assert.equal(result.scene.checksumMode,1);assert.equal(result.scene.resolvedSelector,23);assert.equal(result.scene.positiveConditionalValue,null);
  const changed=[...row];changed[8]=0;changed[9]=8;changed[10]=71;const other=prepare(changed);
  assert.equal(other.scene.resolvedSelector,null);assert.equal(other.scene.positiveConditionalValue,8);assert.deepEqual([...other.scene.scaledCoordinates],[128,192]);
});
test('scene validation checks dimensions, exact cache length and complete getter-free arguments',()=>{
  const row=[...v.protocol.scene];row[2]=0;assert.throws(()=>prepare(row),error(LegacyGameSceneError,'LEGACY_SCENE_DIMENSIONS'));
  row[2]=4194305;assert.throws(()=>prepare(row),error(LegacyGameSceneError,'LEGACY_SCENE_CELL_BUDGET'));
  assert.throws(()=>prepare(v.protocol.scene,[7,23],bytes(v.protocol.initialCacheHex).subarray(0,-1)),error(LegacyGameSceneError,'LEGACY_SCENE_CACHE_LENGTH'));
  let called=0;const hostile=[...v.protocol.scene];Object.defineProperty(hostile,0,{get(){called++;return 7;}});
  assert.throws(()=>prepare(hostile),error(LegacyGameSceneError,'LEGACY_SCENE_ARGUMENTS'));assert.equal(called,0);
  assert.throws(()=>prepare(v.protocol.scene,[7,23],null),error(LegacyGameSceneError,'LEGACY_SCENE_INPUT'));
  assert.throws(()=>prepare(v.protocol.scene.slice(0,-1)),error(LegacyGameSceneError,'LEGACY_SCENE_ARGUMENTS'));
});
test('intrinsic typed input ownership rejects detached/shared/proxy buffers and ignores hostile getters',()=>{
  class Hostile extends Uint8Array{get length(){throw Error('getter');}get buffer(){throw Error('getter');}get byteOffset(){throw Error('getter');}}
  const original=bytes(v.protocol.initialCacheHex);assert.equal(prepare(v.protocol.scene,[7,23],new Hostile(original.buffer)).cacheAction,'reused');
  const detached=new Uint8Array(3);structuredClone(detached,{transfer:[detached.buffer]});
  for(const bad of [null,{},[],new Uint16Array(3),new DataView(new ArrayBuffer(4)),detached,new Proxy(original,{}),new Uint8Array(new SharedArrayBuffer(4))]){
    assert.throws(()=>prepare(v.protocol.scene,[7,23],bad),error(LegacyGameSceneError,'LEGACY_SCENE_INPUT'));
    assert.throws(()=>decode(catalog[0].operation_id,bad),error(LegacyGameStateError,'LEGACY_STATE_INPUT'));
  }
});
test('all119 independent Python state cases match selected fields, wrapping/defaults and capped tokens',()=>{
  for(const row of v.stateCases){const input=bytes(row.dataHex),actual=decode(row.id,input);input.fill(0);assert.deepEqual(normalized(actual),row.expected,row.dataHex);}
});
test('sparse updates use bit0-all and source missing-1 while unknown high bit alone is ignored',()=>{
  assert.equal(decode(catalog[0].operation_id,ascii('1')).updates.length,30);assert.equal(decode(catalog[1].operation_id,ascii('1')).updates.length,18);
  const one=decode(catalog[0].operation_id,ascii('2|17'));assert.equal(one.updates.length,1);assert.equal(one.updates[0].value,17);
  const empty=decode(catalog[1].operation_id,new Uint8Array());assert.equal(empty.flags,0xffffffff);assert.equal(empty.updates[0].value,-1);assert.equal(empty.updates.at(-1).value,100);
  assert.equal(decode(catalog[0].operation_id,ascii('2lkCB2')).updates.length,0); //2^31 selects no known source slot.
});
test('default-C decimal and32-bit overflow differ from base62 flags; byte values keep raw pairs',()=>{
  const op=catalog[0].operation_id;
  for(const [value,expected] of [['  +12tail',12],['-2147483648',-2147483648],['4294967295',-1],['+word',0],['\t-7x',-7],['\x81|',0]])
    assert.equal(decode(op,ascii('2|'+value)).updates[0].value,expected);
  const stringMask=Buffer.from(integer(2**29)).toString('ascii');
  assert.equal(hex(decode(op,ascii(stringMask+'|\x81|word')).updates[0].value),'817c776f7264');
  assert.equal(hex(decode(op,ascii(stringMask+'|tail\\')).updates[0].value),hex(ascii('tail')));
});
test('state byte16/17,255-byte cap, firstNUL and aggregate32760 boundaries preserve source policies',()=>{
  const op=catalog[0].operation_id,mask=Buffer.from(integer(2**29)).toString('ascii');
  assert.equal(decode(op,ascii(mask+'|'+'A'.repeat(16))).updates.length,1);const over=decode(op,ascii(mask+'|'+'A'.repeat(17)));
  assert.equal(over.updates.length,0);assert.deepEqual([...over.ignoredFields],['field-29']);
  assert.equal(decode(op,ascii('2|17\0ignored|99')).updates[0].value,17);
  assert.equal(decode(op,ascii('0|'+'x'.repeat(32758))).updates.length,0);
  assert.throws(()=>decode(op,new Uint8Array(32761)),error(LegacyGameStateError,'LEGACY_STATE_BUDGET'));
  assert.throws(()=>decode('unproven-current-operation',ascii('1')),error(LegacyGameStateError,'LEGACY_STATE_OPERATION'));
});
test('all20 Python label vectors prove both inner-unescape passes, fallback threshold and second numeric field',()=>{
  for(const row of v.labelCases){const input=bytes(row.dataHex),actual=label(input);input.fill(0);
    assert.deepEqual({labelHex:hex(actual.labelBytes),code:actual.code,fallbackApplied:actual.fallbackApplied},row.expected);}
  const separator=label(ascii('First\\zSecond|7'));assert.equal(hex(separator.labelBytes),hex(ascii('First')));assert.equal(separator.code,0);
});
test('state snapshots retain unselected/overlong fields and never alias inputs, effects or older snapshots',()=>{
  const s=state(),op=catalog[0].operation_id,mask=Buffer.from(integer(2**29)).toString('ascii');
  assert.equal(field(s.copyState(),catalog[0].id,1),null);
  const event=s.apply(op,ascii(mask+'|Original'));event.updates[0].value.fill(0);const first=s.copyState();assert.equal(hex(field(first,catalog[0].id,29)),hex(ascii('Original')));
  field(first,catalog[0].id,29).fill(0);s.apply(op,ascii(mask+'|'+'Z'.repeat(17)));assert.equal(hex(field(s.copyState(),catalog[0].id,29)),hex(ascii('Original')));
  s.apply(op,ascii('2|123'));assert.equal(field(s.copyState(),catalog[0].id,1),123);s.close();s.close();assert.throws(()=>s.copyState(),error(LegacyGameStateError,'LEGACY_STATE_CLOSED'));
});
test('world protocol prepares cache directly from scene while raw protocol preserves typed catalog-only scenes',()=>{
  const p=prepared(),event=send(p,bytes(v.protocol.streamPlainHex[0]));assert.equal(event.effect.kind,'scene-transition');assert.equal(event.effect.cacheAction,'created');
  assert.equal(hex(p.copyMapCache()),v.protocol.initialCacheHex);assert.equal(p.copyGameState().pose.facingCode,null);assert.equal(p.inspect().worldStateEnabled,true);p.close();
  const raw=rawProtocol();raw.append(frame(bytes(v.bootstrap.payloadHex)));raw.next();assert.equal(send(raw,bytes(v.protocol.streamPlainHex[0])).effect,null);assert.equal(raw.copyMapCache(),null);raw.close();
});
test('world scene reuse preserves filled map; identityA2 replaces it and identityB0 clears active projection',()=>{
  const p=prepared();send(p,bytes(v.protocol.streamPlainHex[0]));send(p,bytes(v.protocol.streamPlainHex[5]));
  const reuse=send(p,bytes(v.protocol.streamPlainHex[7]));assert.equal(reuse.effect.cacheAction,'reused');assert.equal(hex(p.copyMapCache()),v.protocol.updatedCacheHex);
  const special=[...v.protocol.scene];special[0]=2;send(p,scenePlain(special));send(p,ascii('=mJ 2 n 0 0 1 1 1|2|3 '));
  assert.notEqual(hex(p.copyMapCache()).slice(40),v.protocol.initialCacheHex.slice(40));assert.equal(send(p,scenePlain(special)).effect.cacheAction,'replaced');
  assert.equal(hex(p.copyMapCache()).slice(40),v.protocol.initialCacheHex.slice(40));special[1]=0;special[2]=0;special[3]=-1;
  assert.equal(send(p,scenePlain(special)).effect.cacheAction,'skipped-identityB-zero');assert.equal(p.copyMapCache(),null);p.close();
});
test('world label/state event ownership and reset preserve source state without claiming actor semantics',()=>{
  const p=prepared();for(const i of [0,1,2])send(p,bytes(v.protocol.streamPlainHex[i]));
  const event=send(p,bytes(v.protocol.streamPlainHex[1]));event.effect.labelBytes.fill(0);let snapshot=p.copyGameState();
  assert.equal(hex(snapshot.label.labelBytes),v.protocol.finalLabel.labelHex);snapshot.label.labelBytes.fill(0);
  assert.equal(hex(p.copyGameState().label.labelBytes),v.protocol.finalLabel.labelHex);assert.equal(snapshot.records.attributeNames,'unassigned');
  const before=p.copyGameState();assert.equal(send(p,ascii(']gQ ')).message.kind,'reset-bootstrap');assert.equal(p.inspect().awaitingBootstrap,true);
  assert.deepEqual(p.copyGameState().scene,before.scene);assert.deepEqual(p.copyGameState().records,before.records);p.close();
});
test('world scene errors fail-close material/cache/records/label and clean EOF/close clears projections',()=>{
  const p=prepared();for(const i of [0,1,2])send(p,bytes(v.protocol.streamPlainHex[i]));const bad=[...v.protocol.scene];bad[2]=0;
  assert.throws(()=>send(p,scenePlain(bad)),error(LegacyGameSceneError,'LEGACY_SCENE_DIMENSIONS'));assert.equal(p.inspect().state,'failed');assert.equal(p.inspect().keyAvailable,false);
  for(const key of ['scene','label','records','map','pose'])assert.equal(p.copyGameState()[key],null);
  for(const method of ['finish','close']){const q=prepared();send(q,bytes(v.protocol.streamPlainHex[0]));q[method]();assert.equal(q.copyGameState().scene,null);assert.equal(q.copyGameState().records,null);}
});
test('standalone PythonTCP drives3 scenes,3 state updates and automatic map request/patch using only3 public original files',{timeout:15000},async()=>{
  const standalone=await mkdtemp(join(tmpdir(),'moli-original-scene-'));
  for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(standalone,name));
  await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(standalone,'wire_reference.py'));
  const child=spawn('python3',[join(standalone,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket;
  child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),p=world(),effects=[];let snapshot,map;
  try{
    const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;
      if(event.effect){effects.push(event.effect);if(event.effect.request)socket.write(p.encodeCommand(event.effect.request.operationId,event.effect.request.arguments));}
    }}catch(error){reject(error);}});socket.once('end',()=>{snapshot=p.copyGameState();map=p.copyMapCache();resolve();});});
    assert.deepEqual(effects.map(e=>e.kind),v.protocol.effectKinds);assert.equal(effects[0].cacheAction,'created');assert.equal(effects[7].cacheAction,'reused');
    assert.equal(effects[4].matches,false);assert.equal(effects[6].matches,true);assert.equal(effects[11].matches,true);
    assert.equal(hex(map),v.protocol.updatedCacheHex);assert.deepEqual([...snapshot.scene.fields],v.protocol.finalScene);assert.deepEqual([...snapshot.pose.coordinates],v.protocol.finalCoordinates);
    assert.equal(snapshot.pose.facingCode,3);assert.equal(hex(snapshot.label.labelBytes),v.protocol.finalLabel.labelHex);
    assert.equal(field(snapshot.records,catalog[0].id,1),17);assert.equal(hex(field(snapshot.records,catalog[0].id,29)),hex(ascii('Original')));assert.equal(field(snapshot.records,catalog[1].id,18),100);
    p.finish();const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,1);assert.equal(receipt.messages_sent,12);assert.equal(await exit,0,diagnostics);
  }finally{p.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(standalone,{recursive:true,force:true});}
});

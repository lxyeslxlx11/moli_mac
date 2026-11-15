import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_MESSAGE_CATALOG as catalog,LegacyGameMessageError,encodeLegacyGameInteger as integer,
  decodeLegacyGameInteger as readInteger,encodeLegacyGameTextField as escape,decodeLegacyGameTextField as unescape,
  encodeLegacyGameCommand as command,decodeLegacyGameMessage as message,decodeLegacyGameBinary as binary,
  createLegacyGameProtocol as protocol,encodeLegacyGameEnvelope as frame,createLegacyGameEnvelopeReader as reader,
  createLegacyGamePayloadCodec as payloadCodec } from '../index.mjs';
const directory=new URL('../../analysis/game-legacy-message-v1/',import.meta.url);
const vectors=JSON.parse(await readFile(new URL('original-vectors.json',directory)));
const bytes=hex=>{assert.match(hex,/^(?:[0-9a-f]{2})*$/i);return new Uint8Array(Buffer.from(hex,'hex'));};
const hex=raw=>Buffer.from(raw).toString('hex'),ascii=text=>new Uint8Array(Buffer.from(text,'ascii'));
const error=code=>value=>value instanceof LegacyGameMessageError&&value.code===code;
const args=row=>row.values.map(value=>typeof value==='number'?value:bytes(value.bytesHex));
const normalized=values=>values.map(value=>typeof value==='number'?value:{bytesHex:hex(value)});
function concat(...parts){const output=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const part of parts){output.set(part,at);at+=part.length;}return output;}
function prepared(){const p=protocol();p.append(frame(bytes(vectors.bootstrap[0].payloadHex)));assert.equal(p.next().kind,'bootstrap');return p;}
function encrypted(plain,keyIndex=0){const c=payloadCodec(bytes(vectors.bootstrap[keyIndex].keyHex));try{return frame(c.encode(plain));}finally{c.close();}}
function unwrap(wire,keyIndex=0){const r=reader(),c=payloadCodec(bytes(vectors.bootstrap[keyIndex].keyHex));try{r.append(wire);return c.decode(r.next().payload);}finally{r.close();c.close();}}

test('runtime catalog contains66 frozen serializers and104 branches including7 no-ops and one reset',()=>{
  assert.equal(catalog.outgoing.length,66);assert.equal(catalog.incoming.length,104);
  assert.equal(hex(command('send-004f8840',[])),hex(ascii('4}o ')));
  assert.equal(hex(command('send-004f7dc0',[ascii('8|0'),ascii('2|0'),40])),hex(ascii('+oj 8|0 2|0 E ')));
  assert.equal(hex(command('send-004f6fd0',[2,ascii('New Harbor')])),hex(ascii('7nu 2 New\\SHarbor ')));
  assert.equal(hex(command('send-004f7040',[3,37,ascii('Courier')])),hex(ascii('80i 3 B Courier ')));
  assert.equal(hex(command('send-004f70d0',[503,4])),hex(ascii('8MV 87 4 ')));
  assert.equal(hex(command('send-004f71b0',[503])),hex(ascii('8u6 87 ')));
  assert.equal(catalog.incoming.filter(row=>row.action==='no-op').length,7);assert.equal(catalog.incoming.filter(row=>row.action==='reset-bootstrap').length,1);
  assert.equal(Math.max(...catalog.incoming.map(row=>row.fields.length)),17);assert.equal(Math.max(...catalog.outgoing.map(row=>row.fields.length)),13);
  assert.ok(catalog.incoming.some(row=>row.tag.length===2));assert.ok(Object.isFrozen(catalog.incoming[0].fields));
});
test('113 Python base62 writer vectors and265 wrapping/invalid reader vectors match',()=>{
  for(const row of vectors.integerWrites)assert.equal(hex(integer(row.value)),row.hex);
  for(const row of vectors.integerReads)assert.equal(readInteger(bytes(row.hex)),row.value,row.hex);
  for(const value of [-2147483648,2147483648,NaN,Infinity,1.5,'1',null])assert.throws(()=>integer(value),error('LEGACY_GAME_INTEGER_RANGE'));
  assert.equal(Object.is(readInteger(ascii('-')),-0),false);
});
test('all1030 Python field vectors and8 unknown/trailing escape cases preserve source loss and C prefix',()=>{
  for(const row of vectors.fields){const escaped=escape(bytes(row.rawHex));assert.equal(hex(escaped),row.escapedHex);assert.equal(hex(unescape(escaped)),row.decodedHex);}
  for(const row of vectors.unescape)assert.equal(hex(unescape(bytes(row.hex))),row.decodedHex);
  for(let lead=128;lead<256;lead++){assert.throws(()=>escape(new Uint8Array([lead])),error('LEGACY_GAME_TEXT_PAIR'));assert.throws(()=>unescape(new Uint8Array([lead])),error('LEGACY_GAME_TEXT_PAIR'));}
  assert.equal(hex(escape(bytes('815c'))),'8166');assert.equal(hex(unescape(ascii('\\q'))),'5c');
});
test('all60 source-bound outgoing serializers match independent Python byte-for-byte',()=>{
  for(const row of vectors.outgoing)assert.equal(hex(command(row.id,args(row))),row.plainHex,row.id);
  assert.throws(()=>command('send-current-version',[]),error('LEGACY_GAME_MESSAGE_OPERATION'));
  const spec=catalog.outgoing.find(row=>row.fields.length===1);let reads=0;const hostile=[];Object.defineProperty(hostile,0,{get(){reads++;return 1;}});hostile.length=1;
  assert.throws(()=>command(spec.id,hostile),error('LEGACY_GAME_MESSAGE_ARGUMENTS'));assert.equal(reads,0);
  assert.throws(()=>command(spec.id,[]),error('LEGACY_GAME_MESSAGE_ARGUMENTS'));
});
test('all104 incoming text branches decode owned typed arguments without business inference',()=>{
  for(const row of vectors.incoming){const spec=catalog.incoming.find(spec=>spec.id===row.id),decoded=message(bytes(row.plainHex));
    assert.equal(decoded.operationId,row.id);assert.equal(decoded.kind,spec.action);assert.equal(decoded.consumer,spec.consumer);
    assert.deepEqual(normalized(decoded.arguments),row.decoded,row.id);assert.equal(decoded.extraTokenCount,1);assert.equal(decoded.missingArguments,0);}
});
test('fresh token tables preserve missing0/empty, explicit empty tokens and ignore extra arguments',()=>{
  const largest=vectors.incoming.find(row=>row.decoded.length===17);message(bytes(largest.plainHex));
  for(const spec of catalog.incoming){const decoded=message(ascii(spec.tag));assert.equal(decoded.missingArguments,spec.fields.length);
    assert.deepEqual(normalized(decoded.arguments),spec.fields.map(type=>type==='int32'?0:{bytesHex:''}));}
  const spec=catalog.incoming.find(row=>row.id===vectors.protocol.poseId);assert.deepEqual(message(ascii(spec.tag+'  2 3 trailing extra')).arguments,[0,2,3]);
});
test('space-only token starts, CR/LF terminations, first NUL and bounded tag copy match source',()=>{
  const spec=catalog.incoming.find(row=>row.id===vectors.protocol.poseId),decoded=message(ascii(spec.tag+' a\nb c\rrest d\0unread'));
  assert.deepEqual(decoded.arguments,[10,12,13]);assert.equal(decoded.ignoredAfterNul,6);
  const unknown=message(ascii('unknown value'));assert.equal(unknown.kind,'unknown');assert.equal(hex(unknown.opaque),hex(ascii('unknown value')));
  const long=message(ascii('x'.repeat(1100)+' a'));assert.equal(long.tagBytes.length,1023);assert.equal(long.tagTruncated,true);
  assert.equal(message(new Uint8Array()).tokenCount,0);
});
test('binary variants own every source-length segment and reject signed/truncated ranges',()=>{
  for(const row of vectors.binary){const raw=bytes(row.hex),decoded=binary(raw);raw.fill(0);assert.deepEqual(decoded.segments.map(hex),row.segments);assert.equal(decoded.trailingBytes,row.trailingBytes);}
  for(const raw of ['5d5e69','5d506b0080','5d506b020041','5d5e690100000000000000'])assert.throws(()=>binary(bytes(raw)),error('LEGACY_GAME_BINARY_LENGTH'));
  assert.throws(()=>binary(ascii('other')),error('LEGACY_GAME_BINARY_PREFIX'));
});
test('byte intrinsics, output ownership and invalid backing stores hold across helpers',()=>{
  class Hostile extends Uint8Array{get length(){throw Error('Getter');}get buffer(){throw Error('Getter');}get byteOffset(){throw Error('Getter');}}
  const padded=ascii('xA By'),escaped=escape(new Hostile(padded.buffer,1,3));padded.fill(0);assert.equal(hex(escaped),'415c5342');
  const row=vectors.incoming.find(row=>row.decoded.some(value=>typeof value!=='number')),raw=bytes(row.plainHex),decoded=message(raw);raw.fill(0);assert.deepEqual(normalized(decoded.arguments),row.decoded);
  const detached=new Uint8Array(3);structuredClone(detached,{transfer:[detached.buffer]});
  for(const invalid of [null,[],{},new DataView(new ArrayBuffer(2)),new Uint16Array(2),new Proxy(bytes('41'),{}),detached,detached.buffer,new Uint8Array(new SharedArrayBuffer(2))])
    for(const f of [readInteger,escape,unescape,message,binary])assert.throws(()=>f(invalid),error('LEGACY_GAME_MESSAGE_INPUT'));
});
test('field/message budgets accept exact32760-byte command and never truncate oversized work',()=>{
  const spec=catalog.outgoing.find(row=>row.fields.length===1&&row.fields[0]==='bytes');
  const raw=new Uint8Array(32760-spec.tag.length-2).fill(65);assert.equal(command(spec.id,[raw]).length,32760);
  assert.throws(()=>command(spec.id,[new Uint8Array(raw.length+1).fill(65)]),error('LEGACY_GAME_MESSAGE_BUDGET'));
  assert.equal(escape(new Uint8Array(32760).fill(32)).length,65520);
  assert.equal(unescape(new Uint8Array(65520).fill(65)).length,65520);
  assert.throws(()=>message(new Uint8Array(32761)),error('LEGACY_GAME_MESSAGE_BUDGET'));
});
test('protocol requires initial material while binary prefix wins even for112-byte payload',()=>{
  const p=protocol();assert.throws(()=>p.encodeCommand(vectors.outgoing[0].id,args(vectors.outgoing[0])),error('LEGACY_GAME_PROTOCOL_KEY_REQUIRED'));
  p.append(frame(concat(bytes('5d5e690000000000000000'),new Uint8Array(101))));assert.equal(p.next().kind,'binary');
  assert.equal(p.inspect().keyAvailable,false);p.append(frame(bytes(vectors.bootstrap[0].payloadHex)));assert.equal(p.next().kind,'bootstrap');p.close();
});
test('ready112-byte normal payload stays normal; unknown text retains key and remains opaque',()=>{
  const p=prepared();p.append(encrypted(bytes(vectors.protocol.normal112PlainHex)));const event=p.next();assert.equal(event.kind,'message');
  assert.equal(event.message.operationId,vectors.protocol.normal112Operation);p.append(encrypted(ascii('unknown original')));assert.equal(p.next().message.kind,'unknown');
  assert.equal(p.inspect().keyAvailable,true);p.close();
});
test('readiness reset retains old material until valid replacement, including pending output',()=>{
  const p=prepared(),row=vectors.outgoing[0];p.append(encrypted(bytes(vectors.protocol.resetPlainHex)));assert.equal(p.next().message.kind,'reset-bootstrap');
  assert.equal(p.inspect().keyAvailable,true);assert.equal(p.inspect().awaitingBootstrap,true);assert.equal(hex(unwrap(p.encodeCommand(row.id,args(row)))),row.plainHex);
  p.append(encrypted(bytes(vectors.protocol.pendingPoseHex)));assert.equal(p.next().effect.kind,'network-position');
  p.append(frame(bytes(vectors.bootstrap[1].payloadHex)));assert.equal(p.next().kind,'bootstrap');assert.equal(p.inspect().awaitingBootstrap,false);
  assert.equal(hex(unwrap(p.encodeCommand(row.id,args(row)),1)),row.plainHex);p.close();
});
test('network position projection has sourced float32 scale and owned snapshots, without actor simulation',()=>{
  const p=prepared();p.append(encrypted(bytes(vectors.protocol.newPoseHex)));const event=p.next(),state=p.copyGameState();
  assert.equal(event.effect.kind,'network-position');assert.deepEqual([...state.pose.coordinates],vectors.protocol.newPose.coordinates);
  assert.deepEqual([...state.pose.scaledCoordinates],vectors.protocol.newPose.scaledCoordinates);assert.equal(state.pose.facingCode,3);
  assert.equal(state.pose.nativeActorSynchronization,'unmodeled');p.close();assert.equal(p.copyGameState().pose,null);assert.equal(state.pose.facingCode,3);
});
test('protocol failure/EOF/close clears key, queue and pose while append errors stay transactional',()=>{
  const p=prepared();assert.throws(()=>p.append(new Uint8Array(262145)),value=>value.code==='LEGACY_GAME_QUEUE_BUDGET');assert.equal(p.inspect().keyAvailable,true);
  const broken=bytes(vectors.bootstrap[1].payloadHex);broken[111]^=1;p.append(encrypted(bytes(vectors.protocol.resetPlainHex)));p.next();p.append(frame(broken));
  assert.throws(()=>p.next(),value=>value.code==='LEGACY_GAME_BOOTSTRAP_TAG');assert.equal(p.inspect().state,'failed');assert.equal(p.inspect().keyAvailable,false);assert.equal(p.inspect().pendingBytes,0);
  const q=prepared();q.append(bytes('af'));assert.throws(()=>q.finish(),value=>value.code==='LEGACY_GAME_INCOMPLETE');assert.equal(q.inspect().keyAvailable,false);
  for(const end of ['finish','close']){const r=prepared();r[end]();r.close();assert.throws(()=>r.next(),error('LEGACY_GAME_PROTOCOL_CLOSED'));}
});
test('outgoing validation is nonfatal and reentrant close cannot encrypt using changed state',()=>{
  const p=prepared(),row=vectors.outgoing[0];assert.throws(()=>p.encodeCommand(row.id,[]),error('LEGACY_GAME_MESSAGE_ARGUMENTS'));assert.equal(p.inspect().keyAvailable,true);
  const values=new Proxy(args(row),{ownKeys(target){p.close();return Reflect.ownKeys(target);}});
  assert.throws(()=>p.encodeCommand(row.id,values),error('LEGACY_GAME_PROTOCOL_CLOSED'));assert.equal(p.inspect().state,'closed');
});
test('standalone original Python TCP peer validates104 branches, rekey, binary, pose and all60 client serializers', {timeout:15000},async()=>{
  const standalone=await mkdtemp(join(tmpdir(),'moli-original-messages-'));
  for(const name of ['original_peer.py','generate_vectors.py','original-vectors.json','dispatch-catalog.json'])await copyFile(new URL(name,directory),join(standalone,name));
  const child=spawn('python3',[join(standalone,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket;
  child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),p=protocol();
  try{const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});const seen=new Set();let bootstraps=0,binaries=0,initial=false,noops=0,state;
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;
      if(event.kind==='bootstrap'){bootstraps++;if(bootstraps===2)for(const row of vectors.outgoing)socket.write(p.encodeCommand(row.id,args(row)));}
      else if(event.kind==='binary')binaries++;
      else if(event.kind==='message'){seen.add(event.message.operationId);if(event.message.kind==='no-op')noops++;
        if(event.effect&&!initial){initial=true;socket.write(p.encodeCommand(vectors.outgoing[0].id,args(vectors.outgoing[0])));}
        if(event.message.kind==='reset-bootstrap')socket.write(p.encodeCommand(vectors.outgoing[0].id,args(vectors.outgoing[0])));}
    }}catch(error){reject(error);}});socket.once('end',()=>{state=p.copyGameState();resolve();});});
    assert.equal(seen.size,104);assert.equal(noops,7);assert.equal(bootstraps,2);assert.equal(binaries,1);
    assert.deepEqual([...state.pose.coordinates],vectors.protocol.newPose.coordinates);assert.deepEqual([...state.pose.scaledCoordinates],vectors.protocol.newPose.scaledCoordinates);
    p.finish();assert.equal(JSON.parse((await iterator.next()).value).responses_verified,62);assert.equal(await exit,0,diagnostics);
  }finally{p.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(standalone,{recursive:true,force:true});}
});

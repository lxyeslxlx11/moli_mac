import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_ENVELOPE_PROFILE as profile, LegacyGameEnvelopeError,
  encodeLegacyGameEnvelope as encode, createLegacyGameEnvelopeReader as reader } from '../index.mjs';

const vectors = JSON.parse(await readFile(new URL('../../analysis/game-legacy-network-v1/original-vectors.json', import.meta.url))).vectors;
const bytes = hex => new Uint8Array(Buffer.from(hex, 'hex'));
const hash = value => createHash('sha256').update(value).digest('hex');
const error = code => value => value instanceof LegacyGameEnvelopeError && value.code === code;
function concat(...parts) { const output = new Uint8Array(parts.reduce((n,p) => n+p.length,0)); let at=0;
  for(const part of parts){output.set(part,at);at+=part.length;}return output; }

test('legacy envelope writer matches24 independent Python vectors and source-bound identity', () => {
  assert.equal(vectors.length,24); assert.equal(profile.sourceSha256,'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd');
  assert.equal(profile.currentVersionCompatibility,'unverified'); assert.ok(Object.isFrozen(profile));
  for(const row of vectors) assert.deepEqual(encode(bytes(row.payloadHex)),bytes(row.frameHex),row.id);
});

test('legacy reader preserves exact payloads under every small split and bytewise delivery', () => {
  for(const row of vectors.filter(row=>row.payloadBytes>=2&&row.payloadBytes<=257)){
    const wire=bytes(row.frameHex);
    for(let cut=0;cut<=wire.length;cut++){
      const stream=reader();stream.append(wire.subarray(0,cut));const early=stream.next();
      if(cut<wire.length)assert.equal(early.kind,'need-more');else assert.equal(hash(early.payload),row.payloadSha256);
      stream.append(wire.subarray(cut));if(cut<wire.length)assert.equal(hash(stream.next().payload),row.payloadSha256);
      assert.equal(stream.next().kind,'need-more');stream.finish();
    }
    const stream=reader();for(let at=0;at<wire.length;at++){stream.append(wire.subarray(at,at+1));const event=stream.next();
      assert.equal(event.kind,at===wire.length-1?'frame':'need-more');if(event.kind==='frame')assert.equal(hash(event.payload),row.payloadSha256);}
    stream.finish();
  }
});

test('native eight-byte candidate guard defers six/seven-byte frames and accepts them with following bytes', () => {
  for(const n of [0,1]){
    const stream=reader(),wire=encode(new Uint8Array(n));stream.append(wire);
    assert.equal(stream.next().reason,'candidate-guard');stream.append(encode(bytes('4142')));
    const first=stream.next();assert.equal(first.kind,'frame');assert.equal(first.payload.length,n);
    assert.equal(stream.next().payload.length,2);stream.finish();
    const eof=reader();eof.append(wire);assert.throws(()=>eof.finish(),error('LEGACY_GAME_INCOMPLETE'));
    assert.equal(eof.inspect().pendingBytes,0);
  }
});

test('source scan retains no-marker noise, waits at first AF, and reports false-marker discard', () => {
  const stream=reader();stream.append(bytes('010203'));assert.equal(stream.next().reason,'marker');
  stream.append(bytes('af00010203'));assert.equal(stream.next().reason,'candidate-guard');
  stream.append(bytes('040506'));assert.deepEqual(stream.next(),{kind:'discard',discardedBytes:4});
  assert.equal(stream.next().reason,'marker');stream.append(encode(bytes('112233')));
  const event=stream.next();assert.equal(event.discardedBytes,7);assert.equal(hash(event.payload),hash(bytes('112233')));stream.finish();
});

test('payload lengths above signed positive domain reject before undefined native accesses', () => {
  assert.throws(()=>encode(new Uint8Array(32768)),error('LEGACY_GAME_PAYLOAD_BUDGET'));
  for(const length of [32768,65535]){const stream=reader();stream.append(bytes(length===32768?'afef00800000efaf':'afefffff0000efaf'));
    assert.throws(()=>stream.next(),error('LEGACY_GAME_LENGTH_SIGN'));assert.deepEqual(stream.inspect(),{state:'failed',pendingBytes:0,queueBytes:262144});
    assert.throws(()=>stream.append(new Uint8Array()),error('LEGACY_GAME_CLOSED'));}
});

test('complete bad trailer terminates while incomplete payload retains bytes without speculative resync', () => {
  for(const at of [6,7]){const wire=encode(bytes('4142'));wire[at]^=1;const stream=reader();stream.append(concat(wire,encode(bytes('4344'))));
    assert.throws(()=>stream.next(),error('LEGACY_GAME_TRAILER'));assert.equal(stream.inspect().pendingBytes,0);}
  const stream=reader();stream.append(bytes('afef64000000efaf'));assert.equal(stream.next().reason,'payload');
  assert.equal(stream.inspect().pendingBytes,8);stream.close();assert.equal(stream.inspect().pendingBytes,0);
});

test('queue accepts exact256KiB, rejects append overflow transactionally, and compacts after consumption', () => {
  const noise=reader();noise.append(new Uint8Array(262144));assert.equal(noise.inspect().pendingBytes,262144);
  assert.throws(()=>noise.append(bytes('00')),error('LEGACY_GAME_QUEUE_BUDGET'));assert.equal(noise.inspect().pendingBytes,262144);noise.close();
  const row=vectors.find(row=>row.payloadBytes===32767),wire=bytes(row.frameHex),all=concat(...Array(8).fill(wire)),stream=reader();
  stream.append(all.subarray(0,262144));assert.equal(hash(stream.next().payload),row.payloadSha256);stream.append(all.subarray(262144));
  for(let i=0;i<7;i++)assert.equal(hash(stream.next().payload),row.payloadSha256);stream.finish();
});

test('inputs and outputs are owned, nonzero typed subviews use intrinsics without caller accessors', () => {
  const wire=encode(bytes('010203')),padded=concat(bytes('aabb'),wire,bytes('cc'));
  class Hostile extends Uint8Array {get length(){throw Error('Getter read');}get buffer(){throw Error('Getter read');}get byteOffset(){throw Error('Getter read');}}
  const stream=reader();stream.append(new Hostile(padded.buffer,2,wire.length));padded.fill(0);
  const event=stream.next();assert.deepEqual(event.payload,bytes('010203'));event.payload.fill(99);stream.finish();
  const raw=bytes('0405'),encoded=encode(raw.buffer);raw.fill(0);assert.deepEqual(encoded,bytes('afef02000405efaf'));
});

test('invalid/detached/shared/proxy inputs reject without losing a previously queued frame', () => {
  const detached=new Uint8Array(2);structuredClone(detached,{transfer:[detached.buffer]});
  const invalid=[undefined,null,[],{},new DataView(new ArrayBuffer(4)),new Uint16Array(2),new Proxy(bytes('00'),{}),detached,detached.buffer,
    new Uint8Array(new SharedArrayBuffer(2)),new SharedArrayBuffer(2)];
  const stream=reader(),wire=encode(bytes('0102'));stream.append(wire);
  for(const value of invalid){assert.throws(()=>encode(value),error('LEGACY_GAME_INPUT'));assert.throws(()=>stream.append(value),error('LEGACY_GAME_INPUT'));}
  assert.throws(()=>stream.append(new Uint8Array(262145)),error('LEGACY_GAME_QUEUE_BUDGET'));
  assert.deepEqual(stream.next().payload,bytes('0102'));stream.finish();
});

test('finish requires explicit drainage and every terminal reader rejects further work', () => {
  for(const pending of [bytes('0102'),bytes('af'),encode(bytes('0102'))]){const stream=reader();stream.append(pending);
    assert.throws(()=>stream.finish(),error('LEGACY_GAME_INCOMPLETE'));assert.equal(stream.inspect().pendingBytes,0);stream.close();}
  for(const action of ['finish','close']){const stream=reader();stream[action]();stream.close();
    for(const call of [()=>stream.next(),()=>stream.append(new Uint8Array()),()=>stream.finish()])assert.throws(call,error('LEGACY_GAME_CLOSED'));}
});

test('frame prefixes and embedded markers are opaque data; independent frame output never aliases later events', () => {
  const first=bytes('5d5e690000afefefaf'),second=bytes('5d506b0000'),stream=reader();
  stream.append(concat(bytes('0001'),encode(first),encode(second)));const a=stream.next(),b=stream.next();
  assert.equal(a.discardedBytes,2);assert.deepEqual(a.payload,first);assert.deepEqual(b.payload,second);
  a.payload.fill(0);assert.deepEqual(b.payload,second);assert.equal(a.profile,profile.id);stream.finish();
});

test('actual original Python TCP peer exchanges fragmented envelopes on loopback', {timeout:10000}, async () => {
  const child=spawn('python3',[new URL('../../analysis/game-legacy-network-v1/original_peer.py',import.meta.url).pathname],{stdio:['ignore','pipe','pipe']});
  let diagnostics='',socket;child.stderr.on('data',chunk=>{diagnostics+=chunk;});
  const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>resolve(code));});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();
  try{
    const opening=JSON.parse((await iterator.next()).value);assert.ok(opening.port>0);
    socket=createConnection({host:'127.0.0.1',port:opening.port});const stream=reader(),received=[];
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{stream.append(chunk);for(;;){const event=stream.next();
      if(event.kind==='need-more')break;assert.equal(event.kind,'frame');received.push(Buffer.from(event.payload).toString('hex'));}}catch(error){reject(error);}});
      socket.once('connect',()=>socket.write(encode(new Uint8Array(Buffer.from('original-response')))));socket.once('end',resolve);});
    stream.finish();assert.deepEqual(received,['','51',Buffer.from('original-python-payload\0\xaf\xef\xef\xaf','latin1').toString('hex')]);
    assert.equal(JSON.parse((await iterator.next()).value).response_verified,true);assert.equal(await exit,0,diagnostics);
  }finally{socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;}
});

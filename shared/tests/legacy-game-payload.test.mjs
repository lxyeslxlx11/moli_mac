import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { sha256 } from '../vendor/noble-hashes/2.4.0/sha2.js';
import { hmac } from '../vendor/noble-hashes/2.4.0/hmac.js';
import { cbc } from '../vendor/noble-ciphers/2.4.0/aes.js';
import { LEGACY_GAME_PAYLOAD_PROFILE as profile, LegacyGamePayloadError,
  createLegacyGamePayloadCodec as codec, createLegacyGamePayloadCodecFromBootstrap as bootstrap,
  createLegacyGameEnvelopeReader as reader, encodeLegacyGameEnvelope as frame } from '../index.mjs';
const vectors=JSON.parse(await readFile(new URL('../../analysis/game-legacy-transform-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>{assert.match(hex,/^(?:[0-9a-f]{2})*$/i);return new Uint8Array(Buffer.from(hex,'hex'));},hex=value=>Buffer.from(value).toString('hex');
const error=code=>value=>value instanceof LegacyGamePayloadError&&value.code===code;
const key=()=>new Uint8Array(64).fill(65);
function concat(...parts){const output=new Uint8Array(parts.reduce((n,row)=>n+row.length,0));let at=0;for(const row of parts){output.set(row,at);at+=row.length;}return output;}

test('fixed primitive dependencies match public SHA256, RFC4231 HMAC and NIST AES256-CBC vectors',()=>{
  assert.equal(hex(sha256(new Uint8Array())), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(hex(sha256(bytes('616263'))),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(hex(hmac(sha256,new Uint8Array(20).fill(11),bytes('4869205468657265'))),'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
  const raw=bytes('6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710');
  const encrypted=bytes('f58c4c04d6e5f1ba779eabfb5f7bfbd69cfc4e967edb808d679f777bc6702c7d39f23369a9d9bacfa530e26304231461b2eb05e2c39be9fcda6c19078c6a9d1b');
  const k=bytes('603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4'),iv=bytes('000102030405060708090a0b0c0d0e0f');
  assert.deepEqual(cbc(k,iv,{disablePadding:true}).encrypt(raw),encrypted);assert.deepEqual(cbc(k,iv,{disablePadding:true}).decrypt(encrypted),raw);
});

test('legacy payload profile and key ownership are explicit and closed codecs stay closed',()=>{
  const raw=key(),instance=codec(raw),reference=codec(key());raw.fill(0);
  assert.equal(profile.maximumPayloadBytes,32760);assert.ok(Object.isFrozen(profile.encodePermutation));
  assert.equal(profile.currentVersionCompatibility,'unverified');assert.equal(instance.inspect().officialPeerIdentity,'unverified');
  assert.deepEqual(instance.encode(bytes('414243')),reference.encode(bytes('414243')));instance.close();instance.close();reference.close();
  assert.equal(instance.inspect().state,'closed');for(const call of [()=>instance.encode(bytes('41')),()=>instance.decode(new Uint8Array(8))])assert.throws(call,error('LEGACY_GAME_PAYLOAD_CLOSED'));
});

test('all24 original Python payload vectors match including source lossy cases',()=>{
  assert.equal(vectors.normal.length,24);
  for(const row of vectors.normal){const instance=codec(bytes(row.keyHex));try{
    assert.equal(hex(instance.encode(bytes(row.plainHex))),row.wireHex,row.id);
    if(row.wireHex)assert.equal(hex(instance.decode(bytes(row.wireHex))),row.decodedHex,row.id);
  }finally{instance.close();}}
});

test('independent arbitrary wire vectors decode without assuming encoder roundtrip',()=>{
  for(const row of vectors.arbitraryWire){const instance=codec(bytes(row.keyHex));try{assert.equal(hex(instance.decode(bytes(row.wireHex))),row.decodedHex);}finally{instance.close();}}
});

test('source zero-byte bypass and at-most-eight terminal0x11 removal are preserved',()=>{
  const instance=codec(key());try{
    const wire=instance.encode(bytes('004243'));assert.equal(wire[7],0);assert.equal(hex(instance.decode(wire)),'414243');
    assert.equal(instance.decode(instance.encode(new Uint8Array(16).fill(17))).length,8);
    assert.equal(instance.decode(instance.encode(new Uint8Array(8).fill(17))).length,0);
    assert.equal(instance.encode(new Uint8Array()).length,0);assert.throws(()=>instance.decode(new Uint8Array()),error('LEGACY_GAME_PAYLOAD_LENGTH'));
  }finally{instance.close();}
});

test('nonzero nonterminal-padding messages roundtrip across all lengths1..145 and64-byte key boundary',()=>{
  const instance=codec(new Uint8Array(Array.from({length:64},(_,i)=>i+1)));
  try{for(let size=1;size<=145;size++){const raw=new Uint8Array(Array.from({length:size},(_,i)=>33+i%80));assert.deepEqual(instance.decode(instance.encode(raw)),raw);}}finally{instance.close();}
});

test('32760-byte limit composes with signed-positive outer frame and rejects larger work',()=>{
  const instance=codec(key()),raw=new Uint8Array(32760).fill(72);
  try{const wire=instance.encode(raw);assert.equal(wire.length,32760);assert.deepEqual(instance.decode(wire),raw);
    const stream=reader();stream.append(frame(wire));assert.equal(stream.next().wirePayloadBytes,32760);stream.finish();
    assert.throws(()=>instance.encode(new Uint8Array(32761)),error('LEGACY_GAME_PAYLOAD_BUDGET'));
    assert.throws(()=>instance.decode(new Uint8Array(32761)),error('LEGACY_GAME_PAYLOAD_BUDGET'));
    assert.throws(()=>instance.decode(new Uint8Array(7)),error('LEGACY_GAME_PAYLOAD_LENGTH'));
  }finally{instance.close();}
});

test('key length and NUL validation do not alter caller storage or publish material',()=>{
  for(const size of [0,1,63,65])assert.throws(()=>codec(new Uint8Array(size).fill(65)),error('LEGACY_GAME_PAYLOAD_KEY'));
  for(const position of [0,31,63]){const raw=key();raw[position]=0;const before=new Uint8Array(raw);assert.throws(()=>codec(raw),error('LEGACY_GAME_PAYLOAD_KEY'));assert.deepEqual(raw,before);}
  const instance=codec(key());assert.equal(JSON.stringify(instance.inspect()).includes('414141'),false);instance.close();
});

test('attached byte subviews and subclass intrinsics own all inputs/outputs without getters',()=>{
  class Hostile extends Uint8Array{get buffer(){throw Error('Getter read');}get length(){throw Error('Getter read');}get byteOffset(){throw Error('Getter read');}}
  const padded=concat(bytes('00'),key(),bytes('00')),instance=codec(new Hostile(padded.buffer,1,64));padded.fill(0);
  const raw=bytes('0058595a00'),wire=instance.encode(new Hostile(raw.buffer,1,3));raw.fill(0);
  const decoded=instance.decode(wire);wire.fill(0);instance.close();assert.deepEqual(decoded,bytes('58595a'));
  const arrayBuffer=codec(key().buffer);arrayBuffer.close();
});

test('detached/shared/proxy/nonbyte inputs are rejected and validation errors preserve usable codec',()=>{
  const detached=new Uint8Array(64);structuredClone(detached,{transfer:[detached.buffer]});
  const invalid=[null,undefined,[],{},new DataView(new ArrayBuffer(64)),new Uint16Array(32),new Proxy(key(),{}),detached,detached.buffer,
    new Uint8Array(new SharedArrayBuffer(64)),new SharedArrayBuffer(64)];const instance=codec(key());
  try{for(const value of invalid){assert.throws(()=>codec(value),error('LEGACY_GAME_PAYLOAD_INPUT'));assert.throws(()=>instance.encode(value),error('LEGACY_GAME_PAYLOAD_INPUT'));assert.throws(()=>instance.decode(value),error('LEGACY_GAME_PAYLOAD_INPUT'));}
    assert.equal(hex(instance.decode(instance.encode(bytes('4142')))),'4142');
  }finally{instance.close();}
});

test('six independent Python/OpenSSL synthetic bootstraps install the correct owned codec',()=>{
  assert.equal(vectors.bootstrap.length,6);
  for(const row of vectors.bootstrap){const payload=bytes(row.payloadHex),before=new Uint8Array(payload),instance=bootstrap(payload);
    try{assert.deepEqual(payload,before);payload.fill(0);assert.equal(hex(instance.encode(bytes(row.probePlainHex))),row.probeWireHex,row.id);
      assert.equal(hex(instance.decode(bytes(row.probeWireHex))),row.probePlainHex);assert.equal(instance.inspect().officialPeerIdentity,'unverified');}
    finally{instance.close();}}
});

test('bootstrap header/cipher/tag corruption rejects with sanitized tag error before exposing a codec',()=>{
  for(const position of [0,14,16,70,80,111]){const payload=bytes(vectors.bootstrap[0].payloadHex);payload[position]^=1;
    assert.throws(()=>bootstrap(payload),error('LEGACY_GAME_BOOTSTRAP_TAG'));}
});

test('bootstrap requires112 bytes and64 non-NUL result, never adopts partial native results',()=>{
  for(const size of [0,16,48,80,111,113,1024])assert.throws(()=>bootstrap(new Uint8Array(size)),error('LEGACY_GAME_BOOTSTRAP_FORMAT'));
  for(const row of vectors.invalidBootstrap)assert.throws(()=>bootstrap(bytes(row.payloadHex)),error(row.expectedCode));
});

test('bootstrap hostile subview is accepted without getters; invalid backing storage is rejected',()=>{
  class Hostile extends Uint8Array{get buffer(){throw Error('Getter read');}get length(){throw Error('Getter read');}get byteOffset(){throw Error('Getter read');}}
  const row=vectors.bootstrap[0],padded=concat(bytes('ff'),bytes(row.payloadHex),bytes('ee'));
  const instance=bootstrap(new Hostile(padded.buffer,1,112));padded.fill(0);assert.equal(hex(instance.encode(bytes(row.probePlainHex))),row.probeWireHex);instance.close();
  assert.throws(()=>bootstrap(new Uint8Array(new SharedArrayBuffer(112))),error('LEGACY_GAME_PAYLOAD_INPUT'));
});

test('synthetic bootstrap and opaque messages compose across fragmented/coalesced outer envelopes',()=>{
  const row=vectors.bootstrap[0],original=codec(bytes(row.keyHex)),stream=reader(),raw=bytes('6f726967696e616c207061796c6f6164');
  const wire=concat(frame(bytes(row.payloadHex)),frame(original.encode(raw)),frame(original.encode(raw)));let recovered,count=0;
  for(let at=0;at<wire.length;at+=3){stream.append(wire.subarray(at,at+3));for(;;){const event=stream.next();if(event.kind==='need-more')break;
    assert.equal(event.kind,'frame');if(!recovered)recovered=bootstrap(event.payload);else{assert.deepEqual(recovered.decode(event.payload),raw);count++;}}}
  assert.equal(count,2);stream.finish();original.close();recovered.close();
});

test('actual original Python TCP peer exchanges synthetic bootstrap and transformed messages', {timeout:10000}, async()=>{
  const standalone=await mkdtemp(join(tmpdir(),'moli-original-payload-'));
  for(const name of ['original_peer.py','generate_vectors.py','original-vectors.json'])await copyFile(new URL('../../analysis/game-legacy-transform-v1/'+name,import.meta.url),join(standalone,name));
  const child=spawn('python3',[join(standalone,'original_peer.py')],{stdio:['ignore','pipe','pipe']});
  let diagnostics='',socket,instance;child.stderr.on('data',chunk=>{diagnostics+=chunk;});
  const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();
  try{const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});const stream=reader(),received=[];
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{stream.append(chunk);for(;;){const event=stream.next();if(event.kind==='need-more')break;
      assert.equal(event.kind,'frame');if(!instance){instance=bootstrap(event.payload);socket.write(frame(instance.encode(bytes('6f726967696e616c2d726573706f6e7365'))));}
      else received.push(Buffer.from(instance.decode(event.payload)).toString('ascii'));}}catch(error){reject(error);}});socket.once('end',resolve);});
    stream.finish();assert.deepEqual(received,['original-python-message','original-second-message']);assert.equal(JSON.parse((await iterator.next()).value).response_verified,true);
    assert.equal(await exit,0,diagnostics);
  }finally{instance?.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(standalone,{recursive:true,force:true});}
});

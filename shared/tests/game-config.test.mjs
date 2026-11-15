import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_CONFIG_PROFILE,GameConfigError,createDefaultGameConfig,encodeGameConfig,decodeGameConfig} from '../index.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-config-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex'),ascii=value=>new TextEncoder().encode(value);
const code=(fn,expected)=>assert.throws(fn,error=>error instanceof GameConfigError&&error.code===expected);

test('all64 independent Python writer states exactly preserve native order, spaces and nonterminated12..52 byte output',()=>{
  for(const row of vectors.writer){const before=structuredClone(row.settings),encoded=encodeGameConfig(row.settings);assert.equal(hex(encoded),row.hex);assert.deepEqual(row.settings,before);
    assert.deepEqual(decodeGameConfig(encoded).settings,row.settings);assert.equal(encoded[0],32);assert.equal(encoded.at(-1),32);assert.equal(encoded.includes(0),false);}
  assert.equal(GAME_CONFIG_PROFILE.maximumWriterBytes,52);assert.deepEqual(createDefaultGameConfig(),vectors.writer[0].settings);
  assert.notEqual(createDefaultGameConfig(),createDefaultGameConfig());assert.ok(Object.isFrozen(createDefaultGameConfig()));
});
test('independent bounded reader vectors cover substring flags, decimal prefix, case, duplicates, NUL, overflow and read cutoffs',()=>{
  for(const row of vectors.reader){const raw=bytes(row.hex),expected=row.expected;
    if(expected.error){code(()=>decodeGameConfig(raw),expected.error);continue;}
    const result=decodeGameConfig(raw);for(const [key,value]of Object.entries(expected))assert.deepEqual(result[key],value,row.name+':'+key);
    assert.equal(result.gameEffects,'unverified');assert.equal(result.scope,'configuration-helper-only');}
});
test('reader copies only the first256 native read bytes and exposes both unread and post-NUL boundaries',()=>{
  const raw=new Uint8Array(16*1024*1024).fill(120),head=ascii('3Ddevice:4\0soundoff');raw.set(head);
  const result=decodeGameConfig(raw.buffer);assert.equal(result.readBytes,256);assert.equal(result.unreadBytes,raw.length-256);assert.equal(result.settings.soundOff,false);
  assert.equal(result.boundary,'nul-in-read');assert.equal(result.textBytes,10);assert.deepEqual(raw.subarray(0,head.length),head);
  const noNul=decodeGameConfig(ascii('3Ddevice:2'));assert.equal(noNul.boundary,'bounded-read-end');assert.equal(noNul.boundaryPolicy,'bounded-end-as-terminator');
});
test('reader and writer own bytes, ignore forged typed-array properties and preserve caller storage',()=>{
  const setting=vectors.writer.at(-1).settings,a=encodeGameConfig(setting),b=encodeGameConfig(setting);a.fill(0);assert.equal(hex(b),vectors.writer.at(-1).hex);
  class Forged extends Uint8Array{get length(){return 0;}get buffer(){throw Error('not intrinsic');}get byteOffset(){return 999;}*[Symbol.iterator](){yield 0;}}
  const input=new Forged(b),before=Uint8Array.from(b),result=decodeGameConfig(input);assert.deepEqual(result.settings,setting);assert.deepEqual(new Uint8Array(input),before);
  const padded=new Uint8Array(b.length+8);padded.set(b,4);assert.deepEqual(decodeGameConfig(padded.subarray(4,4+b.length)).settings,setting);
});
test('unshared attached byte types are required and missing/invalid device input never silently returns defaults',()=>{
  const detached=ascii('3Ddevice:1');structuredClone(detached.buffer,{transfer:[detached.buffer]});
  for(const input of [null,{},[],new DataView(new ArrayBuffer(20)),new SharedArrayBuffer(20),new Uint8Array(new SharedArrayBuffer(20)),detached,new Proxy(ascii('3Ddevice:1'),{})])code(()=>decodeGameConfig(input),'GAME_CONFIG_INPUT');
  code(()=>decodeGameConfig(new Uint8Array()),'GAME_CONFIG_DEVICE_MISSING');code(()=>decodeGameConfig(ascii('3Ddevice:oops')),'GAME_CONFIG_DEVICE_PARSE');
  code(()=>decodeGameConfig(ascii('3Ddevice:1003')),'GAME_CONFIG_DEVICE_RANGE');
});
test('writer requires exact own explicit settings and never reads a getter or converts truthy/native integer flags',()=>{
  const base=createDefaultGameConfig();let reads=0;const getter={...base};Object.defineProperty(getter,'windowMode',{get(){reads++;return true;}});
  code(()=>encodeGameConfig(getter),'GAME_CONFIG_INPUT');assert.equal(reads,0);
  for(const patch of [{deviceCode:0},{deviceCode:5},{deviceCode:'1'},{deviceCode:1.5},{windowMode:1},{onlyActive:'true'},{soundOff:null},{musicOff:new Boolean(false)},{extra:true}])code(()=>encodeGameConfig({...base,...patch}),'GAME_CONFIG_INPUT');
  code(()=>encodeGameConfig(Object.create(base)),'GAME_CONFIG_INPUT');const symbol={...base,[Symbol('extra')]:0};code(()=>encodeGameConfig(symbol),'GAME_CONFIG_INPUT');
});
test('canonical rewrite drops unknown text while keeping the source substring decisions and first device occurrence',()=>{
  const source=ascii('garbage3Ddevice:+0003again3Ddevice:1 notwindowmode soundoffice');
  const parsed=decodeGameConfig(source);assert.equal(parsed.settings.deviceCode,3);assert.equal(parsed.settings.windowMode,true);assert.equal(parsed.settings.soundOff,true);
  assert.equal(new TextDecoder().decode(encodeGameConfig(parsed.settings)),' 3Ddevice:3 windowmode soundoff ');
  assert.equal(parsed.offsets.device,7);assert.equal(parsed.offsets.onlyActive,-1);
});

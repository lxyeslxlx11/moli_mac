import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LEGACY_GAME_MOTION_PROFILE as profile,LegacyGameMotionError as ErrorType,
  legacyGameFacingCode as face,projectLegacyGamePosition as project,classifyLegacyGameActorResource as grade,
  resolveLegacyGameActorResource as resource,createLegacyGameActorMotion as motion,
  encodeLegacyGameStepDirections as directions,createLegacyGameMovementCommand as movement } from '../index.mjs';
const v=JSON.parse(await readFile(new URL('../../analysis/game-legacy-actors-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex');
const error=code=>e=>e instanceof ErrorType&&e.code===code;

test('source motion boundaries and all466 table-derived Python direction cases include zero and quadrant boundaries',()=>{
  assert.equal(profile.queueCapacity,10);assert.equal(profile.nativeX87BitIdentity,'unverified');
  for(const row of v.directionCases)assert.equal(face(row.x,row.y),row.expected,`${row.x},${row.y}`);
  assert.equal(face(0,0),2);
});
test('all23 independent Python projection cases retain signed fractional camera/world coordinates and explicit viewport center',()=>{
  for(const row of v.projectionCases)assert.deepEqual([...project(row.position,row.camera,row.center)],row.expected);
});
test('637 Python resource range boundaries and mode caps preserve holes and ordered fallback selection',()=>{
  for(const row of v.resourceCases){assert.equal(grade(row.value),row.grade);assert.equal(resource(row.value,row.code),row.expected,`${row.value}/${row.code}`);}
  assert.equal(grade(0x18a24),0); // Earlier grade-zero interval wins over a later overlapping test.
});
test('44 Python queue traces cover factors1/1.2/1.6/2, speed0/negative, overflow and diagonal float32 stores',()=>{
  for(const row of v.motionCases){const m=motion(row.origin,0,row.speed);for(const target of row.targets)m.enqueue(target);
    for(const expected of row.expected)assert.deepEqual(m.step(),expected,JSON.stringify({origin:row.origin,speed:row.speed,count:row.targets.length}));m.close();}
});
test('arriving tick keeps moving animation; next tick clears moving flag and idle without resetting phase',()=>{
  const m=motion([0,0]);m.enqueue([1,0]);for(let i=0;i<16;i++)m.step();
  assert.deepEqual([...m.copyState().position],[64,0]);assert.equal(m.copyState().animation,1);assert.equal(m.copyState().moving,true);
  assert.equal(m.step().animation,0);assert.equal(m.copyState().moving,false);assert.equal(m.copyState().phase,0);m.close();
});
test('overflow clears ten queued targets and teleports; explicit correction can retain queue',()=>{
  const m=motion([0,0]);for(let i=0;i<10;i++)m.enqueue([i+1,0]);assert.equal(m.copyState().queue.length,10);
  m.enqueue([25,-8]);assert.equal(m.copyState().queue.length,0);assert.deepEqual([...m.copyState().target],[25,-8]);
  m.enqueue([26,-8]);m.teleport([24,-8],false);assert.equal(m.copyState().queue.length,1);m.teleport([24,-8]);assert.equal(m.copyState().queue.length,0);m.close();
});
test('clearing pending targets leaves active velocity; zero speed can leave a target stalled',()=>{
  const m=motion([0,0]);m.enqueue([2,0]);m.step();m.enqueue([3,0]);m.clearQueue();assert.deepEqual([...m.copyState().velocity],[4,0]);assert.deepEqual([...m.step().position],[8,0]);m.close();
  const stalled=motion([0,0],0,0);stalled.enqueue([1,0]);stalled.step();assert.deepEqual([...stalled.copyState().position],[0,0]);assert.deepEqual([...stalled.copyState().target],[1,0]);stalled.close();
});
test('motion snapshots own queue storage and detached methods work without exposing mutable state',()=>{
  const origin=[0,0],m=motion(origin);origin[0]=99;const target=[1,1];m.enqueue(target);target[0]=99;
  const old=m.copyState();assert.equal(Object.isFrozen(old.queue[0]),true);const step=m.step;assert.ok(step().position[0]>0);assert.deepEqual([...old.position],[0,0]);m.close();m.close();assert.throws(()=>m.step(),error('LEGACY_MOTION_CLOSED'));
});
test('source byte+0x61 serializer accepts raw byte codes with modulo wrap and returns no request for empty path',()=>{
  const raw=Uint8Array.from({length:256},(_,i)=>i),out=directions(raw);for(let i=0;i<256;i++)assert.equal(out[i],(i+97)&255);
  assert.equal(movement([2,3],new Uint8Array(),99),null);const cmd=movement([2,3],bytes('0001020304050607'),99);
  assert.equal(cmd.operationId,'send-004f6470');assert.deepEqual([cmd.arguments[0],cmd.arguments[1],cmd.arguments[3]],[2,3,99]);assert.equal(hex(cmd.arguments[2]),'6162636465666768');
  raw.fill(0);assert.equal(out[7],104);
});
test('motion rejects overflow coordinates, unsafe pairs, nonfinite math and invalid resource context',()=>{
  for(const pair of [[33554432,0],[-33554433,0]])assert.throws(()=>motion(pair),error('LEGACY_MOTION_COORDINATE'));
  let calls=0;const p=[0,0];Object.defineProperty(p,0,{get(){calls++;return 0;}});assert.throws(()=>motion(p),error('LEGACY_MOTION_PAIR'));assert.equal(calls,0);
  for(const bad of [NaN,Infinity,1e100])assert.throws(()=>face(bad,0),error('LEGACY_MOTION_FLOAT'));
  for(const bad of [-1,1.5,0x100000000,null])assert.throws(()=>resource(110000,bad),error('LEGACY_MOTION_RESOURCE_CONTEXT'));
  assert.throws(()=>project([0,0],[0,0],[0.5,1]),error('LEGACY_MOTION_INTEGER'));
});
test('movement byte input uses intrinsic ownership and rejects shared/detached/proxy or oversized input',()=>{
  class Hostile extends Uint8Array{get length(){throw Error('getter');}get buffer(){throw Error('getter');}get byteOffset(){throw Error('getter');}}
  assert.equal(hex(directions(new Hostile([0,1]))),'6162');const detached=new Uint8Array(1);structuredClone(detached,{transfer:[detached.buffer]});
  for(const value of [null,{},[],new Uint16Array(1),detached,new Proxy(new Uint8Array(2),{}),new Uint8Array(new SharedArrayBuffer(2))])assert.throws(()=>directions(value),error('LEGACY_MOTION_INPUT'));
  assert.throws(()=>directions(new Uint8Array(32761)),error('LEGACY_MOTION_BUDGET'));
});

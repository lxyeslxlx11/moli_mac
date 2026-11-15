import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LEGACY_GAME_ACTOR_PROFILE as profile,LegacyGameActorError as ActorError,
  decodeLegacyGameActorList as units,decodeLegacyGameActorActions as actions,decodeLegacyGameActorRemovals as removals,
  createLegacyGameActors as actors,createLegacyGameWorldProtocol as world,createLegacyGameProtocol as rawProtocol,
  createLegacyGamePayloadCodec as codec,encodeLegacyGameEnvelope as frame,createLegacyGameEnvelopeReader as reader,
  createLegacyGameState as recordState,LEGACY_GAME_STATE_CATALOG as stateCatalog,encodeLegacyGameInteger as integer } from '../index.mjs';
const directory=new URL('../../analysis/game-legacy-actors-v1/',import.meta.url),v=JSON.parse(await readFile(new URL('original-vectors.json',directory)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex'),ascii=s=>new Uint8Array(Buffer.from(s,'latin1'));
const character=(id='1C',x=2,y=3,name='Hero',more={})=>[more.category??1,id,x,y,4,more.resource??100111,more.value7??77,8,name,more.composite??'Guild\\zBadge\\zNote',more.flag11??1,more.flag12??0,999,'Tail',more.mode??0,more.value16??0,'attachment'].join('|');
const action=(id='3e',x=5,y=3,a=1,face=7,p1=100)=>`${id}|${x}|${y}|${a}|${face}|${p1}|0|0`;
function normalize(value){if(value instanceof Uint8Array)return hex(value);if(Array.isArray(value))return value.map(normalize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,val])=>[val instanceof Uint8Array?key+'Hex':key,normalize(val)]));return value;}
const actor=(s,id)=>s.remoteActors.find(a=>a.id===id),error=code=>e=>e instanceof ActorError&&e.code===code;
function encrypted(plain){const c=codec(bytes(v.bootstrap.keyHex));try{return frame(c.encode(plain));}finally{c.close();}}
function prepared(){const p=world();p.append(frame(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');return p;}
function send(p,raw){p.append(encrypted(raw));return p.next();}
function field(s,record,n){return s.records[record].fields[n-1].value;}
function checkInitial(snapshot){
  const s=snapshot.actors;assert.equal(s.localId,100);assert.equal(s.remoteCount,3);assert.equal(s.localActor.motion.speed,80);assert.equal(hex(s.localActor.labels[0]),hex(ascii('Hero')));
  assert.deepEqual([...actor(s,200).motion.position],[136,192]);assert.equal(actor(s,201).creationKind,'graphic-object');assert.equal(actor(s,202).amount,5000);
  assert.equal(field(snapshot.records,0,15),77);assert.equal(hex(field(snapshot.records,0,29)),hex(ascii('Hero')));assert.equal(hex(field(snapshot.records,0,30)),hex(ascii('Guild')));
}

test('all50 independent Python actor lists retain tab selection, three schemas, prefix caps and inner bytes',()=>{
  assert.equal(profile.remoteCapacity,1000);for(const row of v.unitCases)assert.deepEqual(normalize(units(bytes(row.dataHex))),row.expected);
});
test('all13 independent Python action batches prove action column4, facing5 and comma-empty termination',()=>{
  for(const row of v.actionCases)assert.deepEqual(normalize(actions(bytes(row.dataHex))),row.expected);
  const event=actions(ascii(action()));assert.equal(event.records[0].action,1);assert.equal(event.records[0].facingCode,7);
});
test('all9 independent Python removals honor127-byte prefix and inner base62 minus-anywhere semantics',()=>{
  for(const row of v.removeCases)assert.deepEqual(normalize(removals(bytes(row.dataHex))),row.expected);
});
test('own identity is explicit; local actor is separate and unknown initial local speed stays null',()=>{
  const s=actors();s.applyUnits(ascii(character()));assert.equal(s.copyState().localActor,null);assert.equal(s.copyState().remoteCount,1);s.close();
  const p=actors();p.setContext([100,0,1,0]);p.applyUnits(ascii(character()));assert.equal(p.copyState().remoteCount,0);assert.equal(p.copyState().localActor.motion.speed,null);assert.equal(p.copyState().context[2],1);p.close();
});
test('observed globals seed local speed/retained labels; local records emit only the sourced field15/29/30 bridge',()=>{
  const s=actors();s.setContext([100,0,1,0]);s.observeGlobals(9,ascii('Seed'),ascii('SeedGuild'),80);
  const event=s.applyUnits(ascii(character('1C',2,3,'N'.repeat(17),{composite:'C'.repeat(17)}))),local=s.copyState().localActor;
  assert.equal(local.motion.speed,80);assert.equal(hex(local.labels[0]),hex(ascii('Seed')));assert.equal(hex(local.labels[1]),hex(ascii('SeedGuild')));
  assert.equal(event.localStateUpdates[0].value15,77);assert.equal(event.localStateUpdates[0].firstLabel,null);assert.equal(event.localStateUpdates[0].secondLabel,null);s.close();
});
test('duplicate unit records update announced coordinates without teleporting the existing body or changing creation kind',()=>{
  const s=actors();s.applyUnits(ascii(character('3e')));s.applyActions(ascii(action()));s.advance();const before=actor(s.copyState(),200).motion;
  s.applyUnits(ascii(character('3e',30,40,'Changed')));let a=actor(s.copyState(),200);assert.deepEqual([...a.announcedCoordinates],[30,40]);assert.deepEqual(a.motion,before);
  s.applyUnits(ascii('3e|1|1|7000|5|Object|7'));a=actor(s.copyState(),200);assert.equal(a.creationKind,'character');assert.equal(a.announcedKind,'graphic-object');assert.deepEqual(a.motion,before);s.close();
});
test('label caps retain previous content, category3 retains body labels, unknown resource context stays explicit',()=>{
  const s=actors();s.applyUnits(ascii(character('3e',2,3,'First',{resource:0x19e10})));let a=actor(s.copyState(),200);assert.equal(a.resolvedResourceId,null);
  s.configureResources(0);assert.equal(actor(s.copyState(),200).resolvedResourceId,0x18a24);s.configureResources(null);
  s.applyUnits(ascii(character('3e',2,3,'X'.repeat(17),{category:3,composite:'New\\zOther\\zElse',flag12:1,mode:2,value16:55})));
  a=actor(s.copyState(),200);assert.equal(hex(a.labels[0]),hex(ascii('First')));assert.equal(hex(a.labels[2]),hex(ascii('Badge')));assert.equal(a.flagsProjection&0x1c0,0x1c0);assert.equal(a.mode15,2);assert.equal(a.value16,55);
  // 4f16d0 ->443a80 clears100 on default mode when the independent force byte is0.
  s.applyUnits(ascii(character('3e',2,3,'Last')));assert.equal(actor(s.copyState(),200).flagsProjection&0x100,0);assert.equal(actor(s.copyState(),200).nativeConditionalFlags,'partial-unmodeled');s.close();
});
test('remote capacity1000 is checked atomically before a batch, replacing native allocation-failure hazards',()=>{
  const s=actors();for(let start=1;start<=1000;start+=100){const rows=[];for(let i=start;i<start+100;i++)rows.push(`${Buffer.from(integer(i)).toString('ascii')}|1|1|1`);s.applyUnits(ascii(rows.join('\t')));}
  const before=s.copyState();assert.equal(before.remoteCount,1000);assert.throws(()=>s.applyUnits(ascii('1|20|20|5\tzz|1|1|1')),error('LEGACY_ACTOR_CAPACITY'));assert.deepEqual(s.copyState(),before);s.close();
});
test('ordinary remote action queues then explicit advance interpolates; idle clears pending queue while velocity continues',()=>{
  const s=actors();s.applyUnits(ascii(character('3e')));s.applyActions(ascii(action()));assert.equal(actor(s.copyState(),200).motion.queue.length,1);assert.deepEqual([...actor(s.copyState(),200).motion.position],[128,192]);
  s.advance();assert.deepEqual([...actor(s.copyState(),200).motion.position],[132,192]);s.applyActions(ascii(action('3e',0,0,0,6)));
  let m=actor(s.copyState(),200).motion;assert.equal(m.queue.length,0);assert.equal(m.animation,0);assert.equal(m.phase,-1);assert.equal(m.facingCode,6);assert.deepEqual([...m.velocity],[4,0]);s.advance();assert.equal(actor(s.copyState(),200).motion.animation,1);s.close();
});
test('remote correction40 retains queue and optionally idles; action51 resets queue, position, face and phase',()=>{
  const s=actors();s.applyUnits(ascii(character('3e')));s.applyActions(ascii(action()));s.applyActions(ascii(action('3e',8,9,40,2,0)));
  let m=actor(s.copyState(),200).motion;assert.deepEqual([...m.position],[512,576]);assert.equal(m.queue.length,1);assert.equal(m.animation,0);assert.equal(m.phase,-1);
  s.applyActions(ascii(action('3e',1,1,51,3)));m=actor(s.copyState(),200).motion;assert.equal(m.queue.length,0);assert.deepEqual([...m.target],[1,1]);assert.equal(m.facingCode,3);s.close();
});
test('action50 filters the target, keeps prior speed and queues only near-diagonal candidates',()=>{
  const s=actors();s.applyUnits(ascii(character('3e')));s.applyActions(ascii(action('3e',4,3,50,6,900)));assert.equal(actor(s.copyState(),200).motion.queue.length,0);
  s.applyActions(ascii(action('3e',3,4,50,6,900)));const m=actor(s.copyState(),200).motion;assert.equal(m.queue.length,1);assert.equal(m.speed,100);s.close();
});
test('own movement only sets sourced animation/speed; local speed-1 becomes100 but other negative speed is preserved',()=>{
  const s=actors();s.setContext([100,0,0,0]);s.applyUnits(ascii(character()));s.applyActions(ascii(action('1C',40,50,1,7,-1)));
  let local=s.copyState().localActor;assert.equal(local.motion.speed,100);assert.equal(local.motion.phase,0);assert.equal(local.motion.queue.length,0);assert.deepEqual([...local.motion.target],[2,3]);
  s.advance();assert.deepEqual([...s.copyState().localActor.motion.position],[128,192]);const e=s.applyActions(ascii(action('1C',0,0,1,7,-2)));assert.equal(e.localStateUpdates[0].speed,-2);s.close();
});
test('native local animation facing subset is explicit; compound81/82, missing IDs and unsupported effects stay unmodeled',()=>{
  const s=actors();s.setContext([100,0,0,0]);s.applyUnits(ascii(character()));s.applyActions(ascii(action('1C',0,0,2,7)));assert.equal(s.copyState().localActor.motion.facingCode,4);
  s.applyActions(ascii(action('1C',0,0,5,7)));assert.equal(s.copyState().localActor.motion.facingCode,7);
  const before=s.copyState(),event=s.applyActions(ascii(action('1C',0,0,81)+','+action('zz')+','+action('zz')+','+action('1C',0,0,999)));
  assert.equal(event.changes[0].result,'coordinated-unmodeled');assert.equal(event.missingIds.length,1);assert.equal(event.changes.at(-1).result,'unmodeled');assert.deepEqual(s.copyState(),before);s.close();
});
test('removal frees local/remote separately, scene clears remotes and exposes conditional local reset gap',()=>{
  const s=actors();s.setContext([100,0,0,0]);s.applyUnits(ascii(character()+'\t'+character('3e')));assert.deepEqual([...s.remove(ascii('3e')).removedIds],[200]);
  s.applyUnits(ascii(character('3e')));assert.equal(s.beginScene().remoteActorsCleared,1);assert.ok(s.copyState().localActor);assert.equal(s.copyState().nativeLocalSceneReset,'conditional-unmodeled');s.remove(ascii('1C'));assert.equal(s.copyState().localActor,null);s.close();
});
test('owned bytes never alias effects/snapshots; malformed or overflow batches leave the actor state unchanged',()=>{
  const s=actors();s.applyUnits(ascii(character('3e')));const snap=s.copyState();actor(snap,200).labels[0].fill(0);assert.equal(hex(actor(s.copyState(),200).labels[0]),hex(ascii('Hero')));
  const before=s.copyState();assert.throws(()=>s.applyUnits(ascii(character('3e',5,6)+'\t'+character('3f',33554432,0))),error('LEGACY_ACTOR_COORDINATE'));assert.deepEqual(s.copyState(),before);
  s.close();s.close();assert.throws(()=>s.copyState(),error('LEGACY_ACTOR_CLOSED'));
});
test('actor input rejects detached/shared/proxy bytes and accessor contexts without invoking getters',()=>{
  const detached=new Uint8Array(1);structuredClone(detached,{transfer:[detached.buffer]});for(const value of [null,{},[],new Uint16Array(1),detached,new Proxy(new Uint8Array(1),{}),new Uint8Array(new SharedArrayBuffer(1))])assert.throws(()=>units(value),error('LEGACY_ACTOR_INPUT'));
  assert.throws(()=>units(new Uint8Array(32761)),error('LEGACY_ACTOR_BUDGET'));const s=actors(),ctx=[1,2,3,4];let called=0;Object.defineProperty(ctx,0,{get(){called++;return 1;}});assert.throws(()=>s.setContext(ctx),error('LEGACY_ACTOR_CONTEXT'));assert.equal(called,0);s.close();
});
test('state bridge changes exactly sourced slots, preserves source speed without masked-state clamp and validates before mutation',()=>{
  const s=recordState();s.applyActorGlobals(77,ascii('Hero'),ascii('Guild'),-2);const snapshot=s.copyState();assert.equal(field(snapshot,0,15),77);assert.equal(field(snapshot,1,18),-2);assert.equal(field(snapshot,0,1),null);
  assert.throws(()=>s.applyActorGlobals(88,ascii('Next'),ascii('Guild'),1.5));assert.deepEqual(s.copyState(),snapshot);s.applyActorGlobals(null,ascii('A'.repeat(17)));assert.equal(hex(field(s.copyState(),0,29)),hex(ascii('Hero')));s.close();
});
test('world protocol drives context, scene, masked speed, actor creation and interpolation then emits exact sourced movement bytes',()=>{
  const p=prepared(),c=codec(bytes(v.bootstrap.keyHex));for(const raw of v.protocol.beforePlainHex)send(p,bytes(raw));p.advanceActors();p.advanceActors();checkInitial(p.copyGameState());
  const outbound=p.encodeMovement([2,3],bytes(v.protocol.directionsHex)),r=reader();r.append(outbound);assert.equal(hex(c.decode(r.next().payload)),v.protocol.requestPlainHex);r.close();
  assert.equal(p.encodeMovement([2,3],new Uint8Array()),null);for(const raw of v.protocol.afterPlainHex)send(p,bytes(raw));assert.equal(p.copyGameState().actors.remoteCount,0);assert.equal(p.copyGameState().actors.localActor,null);assert.equal(field(p.copyGameState().records,1,18),-2);p.close();c.close();
});
test('world masked globals update existing local actor while own action updates state slots and network display remains collision-dependent',()=>{
  const p=prepared();for(const raw of v.protocol.beforePlainHex)send(p,bytes(raw));send(p,bytes(v.protocol.afterPlainHex[0]));assert.equal(p.copyGameState().actors.localActor.motion.speed,-2);assert.equal(field(p.copyGameState().records,1,18),-2);
  send(p,bytes(v.protocol.afterPlainHex[1]));const local=p.copyGameState().actors.localActor;assert.deepEqual([...local.motion.position],[256,128]);assert.equal(local.motion.display,null);assert.equal(local.motion.facingCode,6);p.close();
});
test('world helper guards preserve raw mode; errors/EOF/close clear actors and keys',()=>{
  const raw=rawProtocol();assert.equal(raw.copyGameState().actors,null);assert.throws(()=>raw.advanceActors(),e=>e.code==='LEGACY_GAME_WORLD_REQUIRED');raw.close();
  const empty=prepared();assert.throws(()=>empty.encodeMovement([0,0],new Uint8Array()),e=>e.code==='LEGACY_GAME_SCENE_REQUIRED');empty.close();
  for(const method of ['finish','close']){const p=prepared();for(const row of v.protocol.beforePlainHex)send(p,bytes(row));p[method]();assert.equal(p.copyGameState().actors,null);assert.equal(p.inspect().keyAvailable,false);}
  const p=prepared();for(const row of v.protocol.beforePlainHex)send(p,bytes(row));assert.throws(()=>send(p,ascii('H#| '+character('3e',33554432,0)+' ')),e=>e.code==='LEGACY_ACTOR_COORDINATE');assert.equal(p.inspect().state,'failed');assert.equal(p.copyGameState().actors,null);
});
test('movement encoding rejects reentrant scene replacement rather than sending an old scene flag',()=>{
  const p=prepared();for(const row of v.protocol.beforePlainHex)send(p,bytes(row));let fired=false;
  const origin=new Proxy([2,3],{ownKeys(target){if(!fired){fired=true;send(p,bytes(v.protocol.afterPlainHex[3]));}return Reflect.ownKeys(target);}});
  assert.throws(()=>p.encodeMovement(origin,bytes('00')),e=>e.code==='LEGACY_GAME_PROTOCOL_STATE_CHANGED');assert.equal(p.copyGameState().scene.fields[11],101);p.close();
});
test('standalone original Python TCP validates actual movement request between entity/action and scene/removal batches',{timeout:15000},async()=>{
  const temp=await mkdtemp(join(tmpdir(),'moli-original-actors-'));for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(temp,name));
  await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(temp,'wire_reference.py'));
  const child=spawn('python3',[join(temp,'original_peer.py')],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket,snapshot,initial,position;
  child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),p=world(),effects=[];
  try{
    const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;
      if(!event.effect)continue;effects.push(event.effect.kind);
      if(effects.length===5){p.advanceActors();p.advanceActors();initial=p.copyGameState();socket.write(p.encodeMovement([2,3],bytes(v.protocol.directionsHex)));}
      if(effects.length===7)position=p.copyGameState().actors.localActor.motion;
    }}catch(error){reject(error);}});socket.once('end',()=>{snapshot=p.copyGameState();resolve();});});
    checkInitial(initial);assert.deepEqual(effects,v.protocol.effectKinds);assert.deepEqual([...position.position],[256,128]);assert.equal(position.display,null);
    assert.equal(snapshot.actors.remoteCount,0);assert.equal(snapshot.actors.localActor,null);assert.equal(field(snapshot.records,1,18),-2);assert.deepEqual([...snapshot.scene.fields],v.protocol.finalScene);
    p.finish();const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,1);assert.equal(receipt.messages_sent,10);assert.equal(await exit,0,diagnostics);
  }finally{p.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
});

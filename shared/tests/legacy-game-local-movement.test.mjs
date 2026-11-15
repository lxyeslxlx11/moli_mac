import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,mkdtemp,copyFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createInterface } from 'node:readline';
import { LegacyGameLocalMovementError as LocalError,createLegacyGameLocalMovement as local,
  createLegacyGameCollisionGridFromRectangle as gridFromPlanes,legacyGameCollisionWindow as windowFor,
  createLegacyGameWorldProtocol as world,createLegacyGameProtocol as rawProtocol,createLegacyGamePayloadCodec as codec,
  encodeLegacyGameEnvelope as frame,createLegacyGameEnvelopeReader as envelope,createLegacyGameActors as actors,createLegacyGameActorMotion as motion } from '../index.mjs';
const directory=new URL('../../analysis/game-legacy-local-movement-v1/',import.meta.url),v=JSON.parse(await readFile(new URL('original-vectors.json',directory)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex'),ascii=value=>new Uint8Array(Buffer.from(value,'latin1'));
function normalize(value){if(value instanceof Uint8Array)return{bytesHex:hex(value)};if(Array.isArray(value))return Array.from(value,normalize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,x])=>[k,normalize(x)]));return value;}
const error=code=>e=>e instanceof LocalError&&e.code===code;
function grid(width,height,flags,center){const rect=windowFor(width,height,center),[left,top,right,bottom]=rect,words=[];for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)words.push(flags[y*width+x]);const n=words.length;
  return gridFromPlanes(width,height,rect,[new Uint16Array(n),new Uint16Array(n),new Uint16Array(words)],1);}
function localResult(effect,snapshot){return normalize({state:effect.state,requests:effect.requests,event:effect.event,...Object.fromEntries(['position','display','target','velocity','facingCode','speed','moving','animation','phase','queuedDirections','arrivedLast','frames','waitingForMap','pendingInteraction','context'].map(k=>[k,snapshot[k]])),routeCount:snapshot.route.length});}
function prepared(){const p=world();p.append(frame(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');p.configureLocalMovement(null,v.sourceContext);return p;}
function send(p,raw){const c=codec(bytes(v.bootstrap.keyHex));try{p.append(frame(c.encode(raw)));return p.next();}finally{c.close();}}
function ready(p,profile=v.protocol){for(const row of profile.beforePlainHex)send(p,bytes(row));return p;}
function decodedRequest(p,request){const c=codec(bytes(v.bootstrap.keyHex)),r=envelope();try{r.append(p.encodeCommand(request.operationId,request.arguments));return hex(c.decode(r.next().payload));}finally{c.close();r.close();}}

test('18 independent Python local traces verify403 ordinary frames including batches, fractional motion, cache waits and event guards',()=>{
  for(const row of v.localCases){const flags=new Uint16Array(row.width*row.height).fill(0xc000);for(const [x,y,n] of row.flagChanges)flags[y*row.width+x]=n;
    const m=local(row.origin,row.speed,4,row.context);m.requestDestination(row.destination);
    try{for(let i=0;i<row.frameCount;i++){
      if(row.fills&&i===row.fills.at)for(const [index,value] of row.fills.values)flags[index]=value;
      const g=grid(row.width,row.height,flags,m.copyState().display);try{const event=m.step(g,1000+i,[7,23],99);assert.deepEqual(localResult(event,m.copyState()),row.expected[i],`${row.name} frame${i}`);}finally{g.close();}
    }}finally{m.close();}
  }
});
test('local display changes at arrival, moving animation persists through snap and next tick resets phase/idle',()=>{
  const flags=new Uint16Array(144).fill(0xc000),g=grid(12,12,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([3,3]);m.step(g,1000,[7,23],99);
  assert.deepEqual([...m.copyState().position],[132,192]);assert.deepEqual([...m.copyState().display],[2,3]);for(let i=1;i<16;i++)m.step(g,1000+i,[7,23],99);
  assert.deepEqual([...m.copyState().display],[3,3]);assert.equal(m.copyState().animation,1);assert.equal(m.copyState().moving,true);m.step(g,1016,[7,23],99);assert.equal(m.copyState().animation,0);assert.equal(m.copyState().phase,-1);assert.equal(m.copyState().moving,false);m.close();g.close();
});
test('three-step route sends2-step batch then one step with updated current origin',()=>{
  const p=ready(prepared());p.requestLocalDestination([5,3]);const sent=[];for(let i=0;i<52;i++)for(const request of p.advanceLocalMovement(1000+i).requests)sent.push(decodedRequest(p,request));
  assert.deepEqual(sent,v.protocol.requestPlainHex);const s=p.copyGameState();assert.deepEqual([...s.localMovement.position],v.protocol.finalPosition);assert.deepEqual([...s.actors.localActor.motion.position],v.protocol.finalPosition);assert.deepEqual([...s.pose.coordinates],v.protocol.finalDisplay);assert.deepEqual([...s.pose.motion],[0,0]);p.close();
});
test('missing-cache frame emits movement then map request, freezes target/velocity and resumes only after patch data is complete',()=>{
  const p=ready(prepared(),v.protocolMap);p.requestLocalDestination(v.protocolMap.destination);const first=p.advanceLocalMovement(1000);assert.equal(first.state,'waiting-map');assert.deepEqual(first.requests.map(r=>decodedRequest(p,r)),v.protocolMap.requestPlainHex);
  let s=p.copyGameState().localMovement;assert.deepEqual([...s.position],[2560,2560]);assert.deepEqual([...s.target],[39,40]);assert.deepEqual([...s.velocity],[-4,0]);const before=normalize(s);
  assert.equal(p.advanceLocalMovement(1001).state,'waiting-map');assert.deepEqual(normalize(p.copyGameState().localMovement),before);
  send(p,bytes(v.protocolMap.afterPlainHex[0]));for(let i=0;i<36;i++)p.advanceLocalMovement(1003+i);s=p.copyGameState().localMovement;assert.equal(s.waitingForMap,null);assert.deepEqual([...s.display],v.protocolMap.finalDisplay);assert.deepEqual([...s.position],v.protocolMap.finalPosition);p.close();
});
test('type3 ground flag stops before entry, then emits exact sourced event fields and changes coordination guard',()=>{
  const flags=new Uint16Array(144).fill(0xc000);flags[3*12+3]=0xc002;const g=grid(12,12,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([5,3]);
  const first=m.step(g,1000,[7,23],99);assert.equal(first.requests.length,0);assert.equal(m.copyState().pendingInteraction.type,3);assert.deepEqual([...m.copyState().display],[2,3]);
  const next=m.step(g,1001,[7,23],99);assert.deepEqual(normalize(next.requests),[{operationId:'send-004f6530',arguments:[2,7,2,3,2]}]);assert.equal(m.copyState().context.nativeCoordinationGuard,1);assert.equal(m.copyState().context.nativeInteractionSequence,8);m.close();g.close();
});
test('type1 ground flag stops after entry and prior-frame arrival triggers event on the following frame',()=>{
  const flags=new Uint16Array(144).fill(0xc000);flags[3*12+3]=0xc003;const g=grid(12,12,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([5,3]);
  let first;for(let i=0;i<16;i++){const result=m.step(g,1000+i,[7,23],99);if(i===0)first=result;assert.equal(result.event,null);}
  assert.equal(hex(first.requests[0].arguments[2]),'63');assert.deepEqual([...m.copyState().display],[3,3]);const event=m.step(g,1016,[7,23],99);
  assert.deepEqual(normalize(event.requests),[{operationId:'send-004f6530',arguments:[3,7,3,3,-1]}]);assert.equal(m.copyState().context.nativeMovementGuard,1);assert.equal(m.copyState().route.length,0);m.close();g.close();
});
test('final turn uses uppercase direction only after strict lastTick+500 gate, with uint32 wrap semantics',()=>{
  const row=v.pathCases.find(r=>r.expected&&r.expected.steps.length>0&&r.expected.steps.length<10&&r.expected.finalFacing>=0&&r.expected.steps.at(-1).direction!==r.expected.finalFacing);
  assert.ok(row);const flags=Uint16Array.from(row.cells,c=>0xc000|(c===1?256:0)),g=grid(row.width,row.height,flags,row.start);
  for(const [last,now,expected] of [[1000,1500,false],[1000,1501,true],[0xffffffff-200,300,true]]){
    const m=local(row.start,100,4,{...v.sourceContext,lastTurnTick:last});m.requestDestination(row.goal);let arrived=false;
    for(let i=0;i<1000;i++){m.step(g,last,[7,23],99);const s=m.copyState();if(s.destination===null&&s.route.length===0&&s.queuedDirections.length===0&&s.position[0]===s.target[0]*64&&s.position[1]===s.target[1]*64){arrived=true;break;}}
    assert.equal(arrived,true);assert.notEqual(m.copyState().facingCode,row.expected.finalFacing);const result=m.step(g,now,[7,23],99);
    assert.equal(result.requests.length,expected?1:0);if(expected){assert.equal(hex(result.requests[0].arguments[2]),(row.expected.finalFacing+65).toString(16));assert.equal(m.copyState().facingCode,row.expected.finalFacing);}m.close();
  }g.close();
});
test('new destination waits for queued batch; same-point preserves prior route as source does',()=>{
  const flags=new Uint16Array(400).fill(0xc000),g=grid(20,20,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([8,3]);m.step(g,1000,[7,23],99);m.requestDestination([2,8]);
  assert.deepEqual([...m.copyState().destination],[2,8]);for(let i=1;i<16;i++)m.step(g,1000+i,[7,23],99);assert.deepEqual([...m.copyState().display],[3,3]);assert.deepEqual([...m.copyState().destination],[2,8]);m.close();g.close();
});
test('network correction retains queued/planned commands and uses collision to roll display back without losing packet position/target',()=>{
  const flags=new Uint16Array(144).fill(0xc000),g=grid(12,12,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([7,3]);m.step(g,1000,[7,23],99);const queued=[...m.copyState().queuedDirections],route=m.copyState().route;
  const blockedFlags=flags.slice();blockedFlags[4*12+6]|=256;const blocked=grid(12,12,blockedFlags,[6,4]);m.synchronizeNetwork(6,4,7,blocked);
  const s=m.copyState();assert.deepEqual([...s.display],[2,3]);assert.deepEqual([...s.position],[384,256]);assert.deepEqual([...s.target],[6,4]);assert.deepEqual([...s.queuedDirections],queued);assert.deepEqual(s.route,route);assert.deepEqual([...s.velocity],[0,0]);m.close();g.close();blocked.close();
});
test('explicit native context is required; party and positive arrival countdown effects fail before mutation while negative countdown is inert',()=>{
  assert.throws(()=>local([0,0],100,0),error('LEGACY_LOCAL_CONTEXT'));const flags=new Uint16Array(144).fill(0xc000),g=grid(12,12,flags,[2,3]);
  for(const [key,code] of [['nativePartyMode','LEGACY_LOCAL_PARTY_UNMODELED'],['nativeArrivalCountdown','LEGACY_LOCAL_COUNTDOWN_UNMODELED']]){const m=local([2,3],100,4,{...v.sourceContext,[key]:1});m.requestDestination([3,3]);const prior=m.copyState();assert.throws(()=>m.step(g,1000,[7,23],99),error(code));assert.deepEqual(m.copyState(),prior);m.close();}
  const m=local([2,3],100,4,{...v.sourceContext,nativeArrivalCountdown:-1});m.requestDestination([3,3]);assert.equal(m.step(g,1000,[7,23],99).state,'advanced');m.close();g.close();
});
test('control guards suppress new paths without stopping active interpolation; speed updates take effect at next segment',()=>{
  const flags=new Uint16Array(144).fill(0xc000),g=grid(12,12,flags,[2,3]),m=local([2,3],100,4,v.sourceContext);m.requestDestination([4,3]);m.step(g,1000,[7,23],99);m.setContext({...v.sourceContext,nativeInputGuard:1});m.setSpeed(50);m.step(g,1001,[7,23],99);assert.deepEqual([...m.copyState().position],[136,192]);assert.equal(m.copyState().speed,50);m.close();g.close();
});
test('local frame/state own data and validate tick/context/getters before mutation; closing is idempotent',()=>{
  const ctx={...v.sourceContext},origin=[2,3],m=local(origin,100,4,ctx);origin.fill(0);ctx.nativeInputGuard=1;assert.deepEqual([...m.copyState().display],[2,3]);assert.equal(m.copyState().context.nativeInputGuard,0);
  let called=0;const hostile={...v.sourceContext};Object.defineProperty(hostile,'nativeInputGuard',{get(){called++;return 0;}});assert.throws(()=>m.setContext(hostile),error('LEGACY_LOCAL_CONTEXT'));assert.equal(called,0);
  assert.throws(()=>m.requestDestination([32768,0]),error('LEGACY_LOCAL_SHORT'));const before=m.copyState();assert.throws(()=>m.step({},-1,[7,23],99),error('LEGACY_LOCAL_TICK'));assert.deepEqual(m.copyState(),before);m.close();m.close();assert.throws(()=>m.copyState(),error('LEGACY_LOCAL_CLOSED'));
});
test('world source corrections synchronize known actor display and exact position; raw mode and unknown actor/speed/context stay guarded',()=>{
  const raw=rawProtocol();assert.throws(()=>raw.configureLocalMovement(null,v.sourceContext),e=>e.code==='LEGACY_GAME_WORLD_REQUIRED');raw.close();const p=world();assert.throws(()=>p.advanceLocalMovement(1),e=>e.code==='LEGACY_GAME_LOCAL_CONTEXT_REQUIRED');p.close();
  const q=prepared();assert.throws(()=>q.requestLocalDestination([3,3]),e=>e.code==='LEGACY_GAME_LOCAL_ACTOR_REQUIRED');q.close();
  const r=ready(prepared());r.requestLocalDestination([5,3]);r.advanceLocalMovement(1000);send(r,bytes(v.protocol.afterPlainHex[0]));const s=r.copyGameState();assert.deepEqual([...s.actors.localActor.motion.position],[384,256]);assert.deepEqual([...s.actors.localActor.motion.display],[6,4]);assert.equal(s.actors.localActor.motion.facingCode,7);r.close();
});
test('world explicit context reconfiguration restores current motion without premature snap, and next errors/EOF/close clear navigation',()=>{
  const p=ready(prepared());p.requestLocalDestination([5,3]);p.advanceLocalMovement(1000);const position=[...p.copyGameState().localMovement.position];p.configureLocalMovement(null,v.sourceContext);p.requestLocalDestination([6,3]);assert.deepEqual([...p.copyGameState().localMovement.position],position);p.close();
  for(const method of ['finish','close']){const q=ready(prepared());q.requestLocalDestination([5,3]);q.advanceLocalMovement(1000);q[method]();assert.equal(q.copyGameState().localMovement,null);assert.equal(q.copyGameState().actors,null);}
});
test('unmodeled local/coordinated actions invalidate prediction until explicit source context is rebound',()=>{
  const p=ready(prepared());p.requestLocalDestination([5,3]);p.advanceLocalMovement(1000);send(p,ascii('Hx! 1C|0|0|999|7|0|0|0 '));assert.equal(p.copyGameState().localMovement,null);assert.equal(p.copyGameState().localMovementUnavailable,'unmodeled-local-action');assert.throws(()=>p.requestLocalDestination([5,3]),e=>e.code==='LEGACY_GAME_LOCAL_CONTEXT_STALE');p.configureLocalMovement(null,v.sourceContext);p.requestLocalDestination([5,3]);assert.ok(p.copyGameState().localMovement);p.close();
});
test('source actor bridge keeps phase/moving/fractional position and rejects invalid updates before changing state',()=>{
  const a=actors();a.setContext([100,0,0,0]);a.applyUnits(ascii('1|1C|2|3|4|100111|77|8|Hero|Guild|1|0|0||0|0|'));
  a.applyLocalMovement([132,192],[2,3],[3,3],[4,0],2,100,true,1,0);const s=a.copyLocalActor();assert.deepEqual([...s.motion.position],[132,192]);assert.equal(s.motion.moving,true);assert.equal(s.motion.phase,0);
  assert.throws(()=>a.applyLocalMovement([140,192],[2,3],[3,3],[4,0],2,1.5,true,1,0));assert.deepEqual(a.copyLocalActor(),s);a.close();
  const m=motion([0,0]);m.synchronizePosition([1.5,2.5],[0,0],[1,1],[3,4],true,7);assert.equal(m.copyState().phase,7);m.close();
});

for(const mode of ['movement','missing-map'])test(`standalone original Python TCP verifies2 actual source requests and ${mode==='movement'?'server correction':'cache wait/patch/resume'} with only3 public files`,{timeout:15000},async()=>{
  const temp=await mkdtemp(join(tmpdir(),'moli-original-local-'));for(const name of ['original_peer.py','original-vectors.json'])await copyFile(new URL(name,directory),join(temp,name));await copyFile(new URL('../../analysis/game-legacy-message-v1/generate_vectors.py',import.meta.url),join(temp,'wire_reference.py'));
  const child=spawn('python3',[join(temp,'original_peer.py'),mode],{stdio:['ignore','pipe','pipe']});let diagnostics='',socket,initial,final,events=0,resumed=false;
  child.stderr.on('data',chunk=>{diagnostics+=chunk;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),p=world(),profile=mode==='movement'?v.protocol:v.protocolMap;
  p.configureLocalMovement(null,v.sourceContext);
  try{
    const opening=JSON.parse((await iterator.next()).value);socket=createConnection({host:'127.0.0.1',port:opening.port});
    await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',chunk=>{try{p.append(chunk);for(;;){const event=p.next();if(event.kind==='need-more')break;if(!event.effect)continue;events++;
      if(events===profile.beforePlainHex.length){p.requestLocalDestination(profile.destination);const count=mode==='movement'?profile.frames:1;for(let i=0;i<count;i++)for(const request of p.advanceLocalMovement(1000+i).requests)socket.write(p.encodeCommand(request.operationId,request.arguments));initial=p.copyGameState();}
      if(mode==='missing-map'&&events===profile.beforePlainHex.length+1){for(let i=0;i<profile.framesAfterFill;i++)for(const request of p.advanceLocalMovement(1003+i).requests)socket.write(p.encodeCommand(request.operationId,request.arguments));resumed=true;}
    }}catch(error){reject(error);}});socket.once('end',()=>{final=p.copyGameState();resolve();});});
    if(mode==='movement'){assert.deepEqual([...initial.localMovement.position],profile.finalPosition);assert.deepEqual([...final.localMovement.position],[384,256]);assert.equal(final.localMovement.facingCode,7);}
    else{assert.ok(initial.localMovement.waitingForMap);assert.equal(resumed,true);assert.equal(final.localMovement.waitingForMap,null);assert.deepEqual([...final.localMovement.position],profile.finalPosition);assert.deepEqual([...final.pose.coordinates],profile.finalDisplay);}
    const receipt=JSON.parse((await iterator.next()).value);assert.equal(receipt.requests_verified,2);assert.equal(receipt.messages_sent,profile.beforePlainHex.length+profile.afterPlainHex.length);assert.equal(await exit,0,diagnostics);p.finish();assert.equal(p.copyGameState().localMovement,null);
  }finally{p.close();socket?.destroy();lines.close();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
});

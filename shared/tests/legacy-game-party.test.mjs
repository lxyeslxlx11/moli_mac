import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {partyWorld,vectors,ascii} from '../../analysis/game-party-follow-v1/original_world.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('independent wrapped-distance vectors and all native queue factors preserve integer edge behavior',()=>{
 for(const r of vectors.distances)assert.equal(api.legacyGamePartyTargetsNear(...r.points),r.near);
 for(let n=0;n<=10;n++)assert.equal(api.legacyGamePartyQueueScale(n),vectors.queueScales[n]);
 assert.equal(api.legacyGamePartyTargetsNear(2147483647,0,-2147483648,0),true);
 for(const n of [-1,11,1.5,NaN])assert.throws(()=>api.legacyGamePartyQueueScale(n));
 for(const mode of [0,1,-1,2])for(const flags of [0,0x100,0x200,0x300]){const p=api.classifyLegacyGamePartyInput(mode,flags);assert.equal(p.destinationAllowed,mode===0||!!(flags&0x100));assert.equal(p.branch,mode===0?'ordinary':flags&0x100?'leader':'follower');}
});
for(const c of vectors.cases)test(`actual wire world and runtime match independent ${c.name} motion and complete scene pixels`,()=>{
 const f=partyWorld(c);let requests=0;
 try{for(const row of c.frames){const out=f.runtime.pump(f.frame(row.tick));assert.equal(out.error,null,c.name+' frame '+row.tick);assert.equal(out.updates,1);requests+=out.requests.length;const state=f.world.copyGameState();assert.equal(state.actors.party.movementScale,row.movementScale);
  for(const expected of row.actors){const actual=expected.local?state.actors.localActor:state.actors.remoteActors.find(a=>a.id===expected.id);for(const k of ['position','target','display','velocity','queue','speed','facingCode','animation','moving'])assert.deepEqual(actual.motion[k],expected[k],`${c.name} ${row.tick} ${expected.id} ${k}`);const rendered=out.frame.actorLayer.actors.find(a=>a.id===expected.id);const badgeCalls=expected.id===c.members[0]&&row!==c.frames[0]?1:0;assert.equal(rendered.badge?.helperCalls??0,badgeCalls);assert.equal(rendered.helperCalls,row.helpers[String(expected.id)]+badgeCalls);}
  assert.equal(sha(out.frame.sceneLayer.rgba),row.rgbaSha256,`${c.name} ${row.tick} complete scene`);
 }assert.equal(requests,c.expected_requests);}finally{f.close();}
});
test('actual HFs changes the already allocated local controller context and preserves unrelated guards',()=>{
 const f=partyWorld('follower');try{const old=f.world.copyLocalMovement();assert.equal(old.context.nativePartyMode,1);assert.equal(old.context.nativePartyFlags&0x300,0x200);
  f.world.setLocalMovementContext({...old.context,nativeInputGuard:1,nativePartyMode:0,nativePartyFlags:0});let next=f.world.copyLocalMovement();assert.equal(next.context.nativeInputGuard,1);assert.equal(next.context.nativePartyMode,1);assert.equal(next.context.nativePartyFlags&0x300,0x200);assert.deepEqual(next.position,old.position);
  const out=f.runtime.pump(f.frame(1000));assert.equal(out.error,null);assert.equal(out.requests.length,0);assert.notDeepEqual(f.world.copyLocalMovement().position,old.position);
 }finally{f.close();}
});
test('source-owned party fields override stale caller input while other runtime guard mismatches remain rejected',()=>{
 const f=partyWorld('follower');try{const frame=f.frame(1000);f.runtime.move([256,48]);f.runtime.press(0);f.runtime.release(0);const out=f.runtime.pump({...frame,input:{...frame.input,nativePartyMode:0,nativePartyFlags:0}});assert.equal(out.error,null);assert.equal(out.inputUpdates[0].destination,null);assert.equal(out.requests.length,0);assert.throws(()=>f.runtime.pump({...f.frame(1017),input:{...f.frame(1017).input,nativeCoordinationGuard:1}}),e=>e.code==='LEGACY_RUNTIME_CONTEXT_MISMATCH');}finally{f.close();}
});
test('follower clicks cannot issue an autonomous path; dissolution restores the same real pointer/runtime path',()=>{
 const f=partyWorld('follower');try{f.runtime.move([256,48]);f.runtime.press(0);f.runtime.release(0);let out=f.runtime.pump(f.frame(1000));assert.equal(out.error,null);assert.equal(out.inputUpdates[0].destination,null);assert.equal(out.requests.length,0);
  f.send('HFs 4 0 ');f.send('HFs 0 0 ');assert.equal(f.world.copyLocalMovement().context.nativePartyMode,0);f.runtime.move([288,24]);f.runtime.press(0);f.runtime.release(0);out=f.runtime.pump(f.frame(1250));assert.equal(out.error,null);assert.ok(out.inputUpdates[0].destination);const requests=[...out.requests];for(let i=1;i<=80&&!requests.length;i++){out=f.runtime.pump(f.frame(1250+i*17));assert.equal(out.error,null);requests.push(...out.requests);}assert.equal(requests[0]?.operationId,'send-004f6470');
 }finally{f.close();}
});
test('own gate stops both party queue consumption and interpolation before actor rendering',()=>{
 const f=partyWorld('follower');try{const before=f.world.copyGameState().actors,out=f.runtime.pump(f.frame(1000,{runtime:{...f.frame(1000).runtime,ownGateByte:128},input:{...f.frame(1000).input,ownGateByte:128}}));assert.equal(out.error,null);assert.equal(out.frame.movement,null);const after=f.world.copyGameState().actors;for(const [i,a]of before.remoteActors.entries()){assert.deepEqual(after.remoteActors[i].motion.position,a.motion.position);assert.deepEqual(after.remoteActors[i].motion.queue,a.motion.queue);}}
 finally{f.close();}
});
test('source member bit suppresses generic motion and remains visible after active row ID replacement',()=>{
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);a.applyUnits(ascii('1|3e|2|3|4|100001|0|0|Member|Guild|0|0|0|Tail|0|0|'));a.applyParty(1,ascii('1|200|0|0|0|0|First'));a.applyParty(1,ascii('1|999|0|0|0|0|Other'));const actor=a.copyState().remoteActors[0];assert.equal(actor.sourceFrame.recordMotionMask&0x02000000,0x02000000);assert.equal(actor.sourceFrame.recordMotionValue&0x02000000,0x02000000);assert.equal(actor.flagsProjection&0x200,0x200);}finally{a.close();}
});
test('source removal transfers old targets, cascades later targets and respects near/alignment gates',()=>{
 const f=partyWorld('removal');try{const a=f.world.copyGameState().actors;assert.equal(a.party.coordinateTransfer.synchronization,'source-ordinary');assert.equal(a.party.coordinateTransfer.queued,2);assert.deepEqual(a.localActor.motion.queue,[[4,3]]);assert.deepEqual(a.remoteActors.find(a=>a.id===300).motion.queue,[[2,3]]);}finally{f.close();}
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);for(const [id,x]of [['3e',5],['4Q',4],['6s',6]])a.applyUnits(ascii(`1|${id}|${x}|3|4|100001|0|0|Member|Guild|0|0|0|Tail|0|0|`));for(const [slot,id]of [[0,200],[1,300],[4,400]])a.applyParty(slot,ascii(`1|${id}|0|0|0|0|Member`));assert.equal(a.applyParty(1,ascii('0')).coordinateTransfer.synchronization,'already-near');assert.ok(a.copyState().remoteActors.every(a=>a.motion.queue.length===0));}finally{a.close();}
});
test('party queue overflow uses native reset/teleport without inventing a network correction',()=>{
 const m=api.createLegacyGameActorMotion([0,0],4,100);try{for(let i=0;i<11;i++)m.enqueue([i,3]);const s=m.copyState();assert.equal(s.queue.length,0);assert.deepEqual(s.position,[640,192]);assert.deepEqual(s.target,[10,3]);assert.deepEqual(s.velocity,[0,0]);}finally{m.close();}
});
test('duplicate bound references and battle frames stay explicit unsupported runtime domains',()=>{
 const f=partyWorld('follower');try{f.send('HFs 3 1|200|0|0|0|0|Alias ');const out=f.runtime.pump(f.frame(1000));assert.equal(out.error.code,'LEGACY_PARTY_DUPLICATE_BODY');assert.equal(out.present,false);assert.equal(f.world.copyGameState().actors.party.rows[3].bound,true);}finally{f.close();}
 const g=partyWorld('follower');try{const out=g.runtime.pump(g.frame(1000,{runtime:{...g.frame(1000).runtime,runtimeStage:250}}));assert.equal(out.error.code,'LEGACY_PARTY_BATTLE_UNMODELED');}finally{g.close();}
});
test('body removal releases source row references while preserving records; close releases all owned party state',()=>{
 const f=partyWorld('follower');try{f.send('IZL 3e ');assert.equal(f.world.copyGameState().actors.party.rows[0].bound,false);assert.equal(f.world.copyGameState().actors.party.rows[0].actorId,200);f.world.close();assert.equal(f.world.copyGameState().actors,null);assert.throws(()=>f.runtime.pump(f.frame(1017)));}finally{f.close();}
});

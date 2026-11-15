import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {clientFixture,clientEnter,scene} from './legacy-game-client-fixture.mjs';
import {flush} from './legacy-game-session-fixture.mjs';
export const vectors=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-ride-v1/original-vectors.json',import.meta.url)));
export const ascii=s=>new Uint8Array(Buffer.from(s,'ascii'));
export const sha=b=>createHash('sha256').update(b).digest('hex');
export const unit=(id='1C',face=4,resource=100001,category=1)=>[category,id,2,3,face,resource,0,0,'OriginalRide','OriginalGuild',0,0,0,'OriginalTail',0,0,''].join('|');
export const action=(id='1C',code=70,p1=100006,p2=999,face=7)=>`${id}|99|-99|${code}|${face}|${p1}|${p2}|0`;
export function rideFixture(){const f=clientFixture();for(const r of vectors.files)f.files.files.set(r.path.toLowerCase(),new Uint8Array(Buffer.from(r.bytesHex,'hex')));return f;}
export async function send(f,plain){f.offer(f.frame(Buffer.from(plain,'ascii').toString('hex')));await flush();}
export async function enterRide(f){await clientEnter(f,false);for(const p of [...scene.protocol.beforePlainHex.slice(0,3),vectors.full.unitPlainHex,vectors.full.entryPlainHex,scene.protocol.beforePlainHex[4]]){f.offer(f.frame(p));await flush();}await f.drive(()=>f.client.inspect().state==='playing');f.client.runtime().resetClock(1000);}
export function checkRideFrame(api,client,out,expected){assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);const layer=out.frame.actorLayer,state=client.copyWorldState().actors;assert.deepEqual(layer.submittedActorIds,expected.submittedActorIds);assert.deepEqual(layer.events,expected.events);
 for(const e of expected.actors){const a=layer.actors.find(a=>a.id===e.id),live=e.id===state.localId?state.localActor:state.remoteActors.find(a=>a.id===e.id);assert.equal(a.handler??'ordinary',e.handler);assert.equal(a.helperCalls,e.helperCalls);assert.equal(a.motion.animation,e.bodyAction);assert.equal(live.resolvedResourceId,e.bodyResource);assert.equal(live.ride.state,e.state);assert.equal(live.ride.counter,e.counter);assert.equal(!!live.ride.child,e.child);assert.equal(!!live.ride.effect,e.effect);if(e.plan)assert.deepEqual(a.ridePlan,e.plan);}
 return layer;
}

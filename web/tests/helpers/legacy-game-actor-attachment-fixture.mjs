import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {clientFixture,clientEnter,scene} from './legacy-game-client-fixture.mjs';
import {flush} from './legacy-game-session-fixture.mjs';
export {ascii,sha} from './legacy-game-actor-ride-fixture.mjs';
export const vectors=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-attachment-v1/original-vectors.json',import.meta.url)));
export const unit=(id='1C',face=4,resource=100010,category=1)=>[category,id,2,3,face,resource,0,0,'OriginalAttached','OriginalGuild',0,0,0,'OriginalTail',0,0,''].join('|');
export const action=(id='1C',code=60,p1=100010,p2=100006,face=7)=>`${id}|99|-99|${code}|${face}|${p1}|${p2}|0`;
export function attachmentFixture(){const f=clientFixture();for(const r of vectors.files)f.files.files.set(r.path.toLowerCase(),new Uint8Array(Buffer.from(r.bytesHex,'hex')));return f;}
export async function send(f,plain){f.offer(f.frame(Buffer.from(plain,'ascii').toString('hex')));await flush();}
export async function enterAttachment(f){await clientEnter(f,false);for(const p of [...scene.protocol.beforePlainHex.slice(0,3),vectors.full.unitPlainHex,...vectors.full.initialPlainHex,scene.protocol.beforePlainHex[4]]){f.offer(f.frame(p));await flush();}await f.drive(()=>f.client.inspect().state==='playing');f.client.runtime().resetClock(1000);}
export function checkAttachmentFrame(client,out,expected){assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);const layer=out.frame.actorLayer,state=client.copyWorldState().actors;assert.deepEqual(layer.submittedActorIds,expected.submittedActorIds);assert.deepEqual(layer.events,expected.events);
 for(const e of expected.actors){const a=layer.actors.find(a=>a.id===e.id),live=e.id===state.localId?state.localActor:state.remoteActors.find(a=>a.id===e.id);assert.equal(a.handler??'ordinary',e.handler);assert.equal(a.helperCalls,e.helperCalls);assert.equal(a.motion.animation,e.bodyAction);assert.equal(a.motion.facingCode,e.face);assert.equal(live.resolvedResourceId,e.bodyResource);assert.equal(!!live.attached,e.attachmentPresent);if(live.attached)assert.equal(live.attached.action,e.attachmentAction);
  if(e.attachmentUpdated){assert.ok(a.attachment);assert.deepEqual(a.attachment.plan,e.attachmentPlan);assert.equal(a.attachment.code,e.attachmentCode);assert.equal(a.attachment.queued,e.attachmentQueued);assert.equal(a.attachment.animation.nextFrame,e.attachmentNextFrame);assert.equal(a.attachment.animation.graphicIndex,e.attachmentGraphic);}else assert.equal(a.attachment,undefined);
  if(e.handler==='source-ride'){assert.equal(live.ride.state,e.state);assert.equal(live.ride.counter,e.counter);}if(e.handler==='source-spin'){assert.equal(live.specialSpin.state,e.state);assert.equal(live.specialSpin.counter,e.counter);}
 }return layer;
}
/** Read-only receipt predicate: the complete action-list consumer finishes atomically. */
export function attachmentEventApplied(client,key){const s=client.copyWorldState().actors,l=s.localActor,r=s.remoteActors.find(a=>a.id===200);switch(key){
 case'rest':return l.motion.animation===0;case'empty':return r.attached?.rawResourceId===100008;case'missing':return r.attached?.rawResourceId===100009;case'restore':return r.attached?.rawResourceId===100006;
 case'ride':return l.ride?.state===1;case'exit':return l.ride?.state===2;case'spin':return l.specialSpin?.state===3;case'detach':case'remove':return l.attached===null;case'reattach':return l.attached?.rawResourceId===80004;default:throw Error('Unknown original fixture event');}}

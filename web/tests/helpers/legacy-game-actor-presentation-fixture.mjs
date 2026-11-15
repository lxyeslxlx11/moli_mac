import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {clientFixture,clientEnter,scene} from './legacy-game-client-fixture.mjs';
import {flush} from './legacy-game-session-fixture.mjs';
export {ascii,sha,unit,action,send} from './legacy-game-actor-attachment-fixture.mjs';
export const vectors=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-presentation-v1/original-vectors.json',import.meta.url)));
export function presentationFixture(){const f=clientFixture();for(const r of vectors.files)f.files.files.set(r.path.toLowerCase(),new Uint8Array(Buffer.from(r.bytesHex,'hex')));return f;}
export async function enterPresentation(f){await clientEnter(f,false);for(const p of [...scene.protocol.beforePlainHex.slice(0,3),vectors.full.unitPlainHex,...vectors.full.initialPlainHex,scene.protocol.beforePlainHex[4]]){f.offer(f.frame(p));await flush();}await f.drive(()=>f.client.inspect().state==='playing');f.client.runtime().resetClock(1000);}
export function checkPresentationFrame(client,out,expected){assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);const layer=out.frame.actorLayer,state=client.copyWorldState().actors;assert.deepEqual(layer.submittedActorIds,expected.submittedActorIds);assert.deepEqual(layer.events,expected.events);
 for(const e of expected.actors){const a=layer.actors.find(a=>a.id===e.id),live=e.id===state.localId?state.localActor:state.remoteActors.find(a=>a.id===e.id);assert.ok(a);assert.equal(live.presentation.secondary,e.secondary,'secondary '+e.id);if(e.blocked){assert.equal(a.state,'blocked');assert.equal(a.reason,e.reason);continue;}
  assert.equal(a.helperCalls,e.helperCalls,'helpers '+e.id);assert.equal(live.presentation.primary,e.primary);assert.equal(live.presentation.icons.transient?.counter??null,e.transientCounter);assert.equal(a.presentation.icons.length,e.icons.length);
  for(const icon of e.icons){const q=a.presentation.icons.find(i=>i.kind===icon.kind);assert.ok(q);assert.deepEqual(q.screenPosition,icon.screenPosition);assert.equal(q.code,icon.code);assert.equal(q.animation.graphicIndex,icon.graphicIndex);assert.equal(q.animation.nextFrame,icon.nextFrame);assert.equal(q.queued,icon.queued);}}
 return layer;}
export function presentationEventApplied(client,key){const event=vectors.full.events.find(e=>e.key===key);assert.ok(event);const s=client.copyWorldState().actors,a=event.id===s.localId?s.localActor:s.remoteActors.find(a=>a.id===event.id),p=a.presentation,c=event.code,n=event.parameter;
 if(c===99)return !!(p.secondary&128);if(c===46||c===63)return !!(p.secondary&2)&&p.variant===n;if(c===64)return !(p.secondary&2);if(c===45)return !!(p.secondary&1)===(n===1);if(c===47)return (p.secondary&0x24)===0x24;
 const bit=c===40?0x400:c===42?0x4000:c===44?0x8000:0;assert.ok(bit);return !!(p.primary&bit)===(n>=0);}

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../../../shared/index.mjs';
import {createLegacyGameActorFrameController} from '../../../shared/legacy-game-frame.mjs';
import {originalTextMask} from '../../../analysis/game-actor-text-v1/original_font.mjs';
import {clientFixture,clientEnter,scene} from './legacy-game-client-fixture.mjs';
import {flush} from './legacy-game-session-fixture.mjs';
export {ascii,sha} from './legacy-game-actor-presentation-fixture.mjs';
export {originalTextMask};
export const vectors=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-text-v1/original-vectors.json',import.meta.url)));
export function textFixture(options={}){const f=clientFixture({rasterText:originalTextMask,...options});for(const r of vectors.files)f.files.files.set(r.path.toLowerCase(),new Uint8Array(Buffer.from(r.bytesHex,'hex')));return f;}
export async function sendText(f,plainHex){f.offer(f.frame(plainHex));await flush();}
export async function enterText(f){await clientEnter(f,false);for(const p of [...scene.protocol.beforePlainHex.slice(0,3),vectors.full.unitPlainHex,...vectors.full.initialPlainHex,scene.protocol.beforePlainHex[4]]){await sendText(f,p);}await f.drive(()=>f.client.inspect().state==='playing');f.client.setLabelMode(1);f.client.runtime().resetClock(1000);}
export function textController(f,options={}){const a=api.createLegacyGameActors();a.prepareCharacterEntry();a.configureResources(8);a.configureSceneMode(1);a.setContext([100,0,1,0]);a.beginScene([2,3]);a.observeGlobals(null,null,null,100);a.applyUnits(api.decodeLegacyGameMessage(new Uint8Array(Buffer.from(vectors.full.unitPlainHex,'hex'))).arguments[0]);const c=f.client.library().catalogs();
 const frame=createLegacyGameActorFrameController(a,{graphics:c.graphics,animations:c.animations,source:()=>({...scene.actorSource,...options.source?.()}),geometry:(q,actor)=>options.geometry?options.geometry(q,actor,a,f.client.library()):f.client.library().geometry(q),initialPhase:0,deferImages:true,bindActorSource:true});
 return {a,frame,request:{tick:1000,runtime:scene.runtime,camera:[128,192],center:[160,120],width:320,height:240},close(){frame.close();a.close();}};}
export function checkTextFrame(client,out,e){assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);const layer=out.frame.actorLayer;assert.deepEqual(layer.submittedActorIds,e.submittedActorIds);assert.deepEqual(layer.events,e.events);assert.equal(client.inspect().actorLabelMode,e.mode);assert.deepEqual(out.frame.sceneLayer.drawPlan.text?.runs??[],e.runs);
 for(const row of e.actors){const a=layer.actors.find(a=>a.id===row.id);assert.ok(a);if(row.blocked){assert.equal(a.state,'blocked');assert.equal(a.reason,'record-gate');continue;}assert.equal(a.helperCalls,row.helperCalls);assert.deepEqual(a.label??null,row.label);assert.equal(a.animation.graphicIndex,row.graphicIndex);}return layer;}
export function textEventApplied(client,key){const s=client.copyWorldState(),a=s.actors,event=vectors.full.events.find(e=>e.key===key);assert.ok(event);if(event.kind==='cycle')return client.inspect().actorLabelMode===event.mode;
 if(key==='catalog')return a.labelCatalog.received;if(key==='selection')return a.labelCatalog.selectedIndex===1;if(key==='unit-labels')return Buffer.from(a.localActor.labels[0]).toString('hex')==='b8fcd0c2bcd7';
 if(key==='masked-labels')return Buffer.from(s.records.records.find(r=>r.id==='state-4efad0').fields.find(f=>f.id==='field-29').value??[]).toString('hex')==='d0c2d0d5c3fb';
 const remote=a.remoteActors.find(r=>r.id===200);if(key==='hidden-resource')return remote.rawResourceId===0;if(key==='restore')return remote.rawResourceId===100010;if(key==='gate')return !!(remote.presentation.secondary&128);if(key==='spin')return a.localActor.specialSpin?.state===3;if(key==='remove-npc')return !a.remoteActors.some(r=>r.id===300);if(key==='new-npc')return a.remoteActors.some(r=>r.id===500);throw Error('Unknown original text event');}

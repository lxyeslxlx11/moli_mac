import {readFileSync} from 'node:fs';
import {vitalsAssets} from '../../../analysis/game-actor-vitals-v1/original_assets.mjs';
import {assets,clientEnter,scene} from './legacy-game-client-fixture.mjs';
import {originalTextMask} from '../../../analysis/game-actor-vitals-v1/original_font.mjs';
import assert from 'node:assert/strict';
import {textEventApplied} from './legacy-game-actor-text-fixture.mjs';
import {textFixture,enterText,textController,vectors as oldVectors,sha,ascii} from './legacy-game-actor-text-fixture.mjs';
export {textController,sha,ascii};
export const vectors=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-vitals-v1/original-vectors.json',import.meta.url)));
export {originalTextMask};
export const numeric=JSON.parse(readFileSync(new URL('../../../analysis/game-actor-vitals-v1/numeric-vectors.json',import.meta.url)));
export function vitalsFixture(options={}){const f=textFixture({rasterText:originalTextMask,...options});for(const row of vitalsAssets(assets,vectors).files)f.files.files.set(row.path.toLowerCase(),new Uint8Array(Buffer.from(row.bytesHex,'hex')));return f;}
export async function sendVitals(f,text){f.offer(f.frame(Buffer.from(text,'latin1').toString('hex')));await new Promise(resolve=>setImmediate(resolve));}

export async function enterVitals(f){await clientEnter(f,false);for(const p of [...scene.protocol.beforePlainHex.slice(0,3),vectors.full.unitPlainHex,...vectors.full.initialPlainHex,scene.protocol.beforePlainHex[4]]){f.offer(f.frame(p));await new Promise(resolve=>setImmediate(resolve));}await f.drive(()=>f.client.inspect().state==='playing');f.client.setLabelMode(1);f.client.setBarsVisible(true);f.client.runtime().resetClock(1000);}
export function checkVitalsFrame(client,out,e){assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(out.requests.length,0);assert.equal(client.inspect().actorLabelMode,e.mode);assert.equal(client.inspect().actorBarsVisible,e.barsVisible);assert.deepEqual(out.frame.sceneLayer.drawPlan.text?.runs??[],e.runs);assert.deepEqual(out.frame.actorLayer.submittedActorIds,[...e.barDraws.map(r=>r.actorId),...e.submittedActorIds]);assert.deepEqual(out.frame.actorLayer.events,e.events);
 const actual=out.frame.sceneLayer.drawPlan.commands.filter(c=>c.priority===207).map(({image,x,y,priority,flip,sourceRectangle,coordinateMode})=>({index:image.index,x,y,priority,flip,coordinateMode,...(sourceRectangle?{sourceRectangle}:{}),actorId:0}));assert.deepEqual(actual,e.barDraws.map(r=>({...r,actorId:0})));return out.frame.actorLayer;}

export function vitalsEventApplied(client,key){const s=client.copyWorldState(),a=s.actors,r=id=>a.remoteActors.find(r=>r.id===id),field=n=>s.records.records.find(r=>r.id==='state-4efad0').fields.find(f=>f.id===n).value;
 if(key==='bars-off')return !client.inspect().actorBarsVisible;if(key==='bars-on')return client.inspect().actorBarsVisible;
 if(key==='remote-values')return r(200).vitals[0]===105;if(key==='zero-maximum')return field('field-02')===0;if(key==='npc-member')return a.party.rows[2].active&&a.party.rows[2].actorId===300;if(key==='npc-values')return r(300).vitals[0]===50;if(key==='party-partial')return a.party.rows[1].value8===99;if(key==='wrapped-values')return field('field-01')===67108863;if(key==='party-dissolve')return !a.party.active;if(key==='party-rejoin')return a.party.rows[3].active&&a.party.rows[3].actorId===200;if(key==='new-member')return a.party.rows[2].active&&a.party.rows[2].actorId===500;if(key==='new-values')return r(500)?.vitals[0]===100;return textEventApplied(client,key);}

/** Original synthetic assets and independent scheduling assertions, source or generated API. */
import assert from'node:assert/strict';import {readFileSync}from'node:fs';
import {originalFiles}from'../game-resource-runtime-v1/original_files.mjs';
import {battleBodyAssets}from'../game-battle-body-v1/original_assets.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
export const loopVectors=read('./original-vectors.json');
export const character='C|0|0|Original|186AA|0|1|1E|1E|A|A|0|0|0|A|Other|186AA|0|1|1E|1E|A|A|0|0|0|';
export const bytes=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
export async function fixture(api,{loop=true,motion='M|ACT|0|',initialRound=0}={}){
 const files=originalFiles(battleBodyAssets(read('../game-resource-runtime-v1/original-vectors.json'),read('../game-battle-body-v1/original-vectors.json'))),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();const battle=api.createLegacyGameBattleState();
 battle.configureResources(0);battle.configureBodyPlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});battle.configureFrames({graphics:library.catalogs().graphics});battle.configureEntry({entryWindowPresent:false});battle.configureInput();if(loop)battle.configureLoop();battle.applyEntry(1,1000);battle.receive(bytes('P|0|10|0|0|0|0|'),10);battle.receive(bytes(character),10);battle.receive(bytes('A|0|'+initialRound.toString(16).toUpperCase()+'|'),10);if(motion!==null)battle.receive(bytes(motion),10);
 let tick=0;const step=()=>battle.advanceEntry(tick=(tick+16)>>>0);
 for(let i=0;i<56;i++)step();assert.equal(battle.copyEntry().phase,4);
 const guard=()=>{let chosen=false,requests=[];for(let i=0;i<200&&battle.copyEntry().phase===4;i++){
   if(!chosen&&battle.copyInput().state===1&&battle.copyInput().menu.state===0){battle.chooseInputCommand('guard');chosen=true;}
   const out=step();requests.push(...Array.from(out.input.requests,r=>String.fromCharCode(...r.arguments[0])));
  }assert.equal(battle.copyEntry().phase,5);assert.deepEqual(requests,['G']);};guard();
 return{battle,library,files,step,guard,close(){battle.close();library.close();files.close();}};
}
export function checkLoopFrame(battle,out,expected,name){const state=battle.copyState(),commands=battle.copyCommands();
 assert.equal(out.phaseBefore,expected.phaseBefore,name);assert.equal(out.phaseAfter,expected.phaseAfter,name);assert.equal(out.callbacks.manager.kind,expected.manager,name);assert.deepEqual(Array.from(out.callbacks.commands,r=>r.kind),expected.commands,name);
 assert.equal(commands.activeMask,expected.activeMask,name);assert.equal(commands.ready,expected.ready,name);assert.equal(commands.inputEnded,expected.inputEnded,name);assert.equal(commands.roundCounter,expected.round,name);assert.equal(state.roundCounter,expected.round,name);assert.equal(state.motion.read,expected.Mread,name);assert.equal(out.completeMain10,false);assert.equal(out.completeBattleGameplay,false);
}
export async function runLoopReference(api,spec){const f=await fixture(api,{motion:spec.motion,initialRound:spec.initialRound});try{for(const row of spec.frames)checkLoopFrame(f.battle,f.step(),row,spec.name);assert.equal(f.battle.copyLoop().motions,1);return spec.frames.length;}finally{f.close();}}

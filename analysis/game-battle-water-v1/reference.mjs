import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {battleWaterFixture,characterText} from './fixture.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function verifyBattleWater(api,v){const digest=createHash('sha256');let frames=0,events=0;
 for(const scenario of v.scenarios){const water=api.createLegacyGameWater();for(let i=0;i<scenario.quarter;i++)water.advance();const f=await battleWaterFixture(api,scenario.index,water);
  try{f.battle.configureWaterContext({...f.context,nativeGate:scenario.gate});f.battle.applyEntry(1,scenario.background);f.battle.receive(new TextEncoder().encode(characterText),10);f.battle.consumeCharacters();f.battle.callCallbacks({mainState:10,substate:6,slowEffects:false,localSlot:0,controlFlags:0,resourceCode:0});const commands=JSON.stringify(f.battle.copyCommands());
   for(const expected of scenario.frames){const frame=f.battle.stepFrame({width:640,height:480});assert.equal(frame.waterRequested,true);assert.deepEqual(frame.waterEffect??null,expected.strip);assert.deepEqual(f.battle.copyWaterState(),expected.state);const output=await f.library.startRender(frame.drawPlan).done;assert.equal(sha(output.rgba),expected.rgbaSha256);assert.equal(JSON.stringify(f.battle.copyCommands()),commands);digest.update(expected.rgbaSha256);output.rgba.fill(0);frames++;}
  }finally{f.close();water.copyState();water.close();}
 }
 for(const trace of v.traces){const water=api.createLegacyGameWater();try{for(const row of trace.events){const result=water[row.op](...(row.args??[]));if(row.op==='consume')assert.deepEqual(result,row.result);assert.deepEqual(water.copyState(),row.state);digest.update(JSON.stringify(row.state));events++;}}finally{water.close();}}
 return {stage:299,scenarios:v.scenarios.length,completeFrames:frames,orderedEvents:events,digest:digest.digest('hex'),bodyCallbacksReplayed:false};
}

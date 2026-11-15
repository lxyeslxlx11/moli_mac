import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {controlFixture} from '../../analysis/game-battle-gmn-flags-v1/fixture.mjs';
import {verifyControlModel} from '../../analysis/game-battle-gmn-flags-v1/reference.mjs';
const api=process.env.MOLI_GMN_FLAGS_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_GMN_FLAGS_BUILD)):await import('../index.mjs');
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-battle-gmn-flags-v1/original-vectors.json',import.meta.url)));
test('body164/165 preserve raw animation and310 while independent32queues/160RGBA prove both masks',async()=>{
  const out=await verifyControlModel(api,vectors);assert.equal(out.bodyCallbacks,128);assert.equal(out.completeFrames,160);
});
test('body164/165 inherit the ordinary substate andslow-frame gates without consuming actions',async()=>{
  const f=await controlFixture(api,9);
  try{
    f.queue([164,165]);const initial=f.body.copyPlayback().nodes[0].animation;
    f.tick({substate:7});let state=f.body.copyState().bodies[0];assert.equal(state.state,164);assert.equal(state.actionRead,0);assert.equal(state.drawFlagMask,0);
    f.tick({slowEffects:true});state=f.body.copyState().bodies[0];assert.equal(state.actionRead,0);assert.equal(state.drawFlagMask,0);
    f.tick();state=f.body.copyState().bodies[0];assert.equal(state.state,165);assert.equal(state.actionRead,1);assert.equal(state.drawFlagMask,255);
    f.tick({substate:7});state=f.body.copyState().bodies[0];assert.equal(state.state,165);assert.equal(state.actionRead,1);assert.equal(state.drawFlagMask,255);
    f.tick({slowEffects:true});state=f.body.copyState().bodies[0];assert.equal(state.state,165);assert.equal(state.actionRead,1);assert.equal(state.drawFlagMask,255);
    for(let i=0;i<4&&f.body.copyPlayback().phase!==0;i++)f.tick({substate:7});
    assert.equal(f.body.copyPlayback().phase,0);
    f.tick({slowEffects:true});state=f.body.copyState().bodies[0];assert.equal(state.state,231);assert.equal(state.actionRead,2);assert.equal(state.drawFlagMask,0);
    assert.deepEqual(f.body.copyPlayback().nodes[0].animation,initial);
  }finally{f.close();}
});
test('165 restores unsupported animation bits to the existing explicit frame boundary',async()=>{
  const f=await controlFixture(api,31);
  try{
    f.queue([164,165]);f.tick();let p=f.body.copyPlayback();assert.equal(p.nodes[0].animation.drawFlags,31);assert.equal(p.nodes[0].drawFlagMask,255);
    assert.equal(f.frame.step({width:640,height:480},p,-1).drawPlan.commands[0].image.flags,0);
    f.tick();p=f.body.copyPlayback();assert.equal(p.nodes[0].animation.drawFlags,31);assert.equal(p.nodes[0].drawFlagMask,0);
    assert.throws(()=>f.frame.step({width:640,height:480},p,-1),e=>e.code==='LEGACY_BATTLE_FRAME_DRAW_STYLE');
  }finally{f.close();}
});

import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {controlFixture} from './fixture.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function verifyControlModel(api,vectors){
  const hashes=[];let callbacks=0;
  for(const trace of vectors.traces){
    const f=await controlFixture(api,trace.rawFlags,trace.value);
    try{
      f.queue();const raw=f.body.copyPlayback().nodes[0].animation;
      for(const expected of trace.states){
        if(expected.step){const out=f.tick();assert.equal(out.results.filter(r=>r.kind==='body'&&r.result==='advanced').length,1);callbacks++;}
        const body=f.body.copyState().bodies[0],p=f.body.copyPlayback(),node=p.nodes[0],before=JSON.stringify(f.body.copyState());
        assert.equal(body.state,expected.state);assert.equal(body.actionRead,expected.actionRead);
        assert.equal(node.drawFlagMask,expected.drawFlagMask);assert.equal(node.drawFlagValue,expected.drawFlagValue);
        assert.equal(node.drawColorOverride?.mask??0,expected.colorMask);assert.deepEqual(node.animation,raw);
        assert.deepEqual(node.screen,[480,360]);
        const frame=f.frame.step({width:640,height:480},p,-1),command=frame.drawPlan.commands[0];
        assert.equal(frame.drawPlan.commands.length,1);assert.equal(command.image.flags,expected.finalFlags);assert.equal(command.image.color,expected.finalColor);assert.equal(command.image.paletteSelector,320);
        assert.deepEqual([command.x,command.y],[480-(trace.rawFlags&1?4:0),360-(trace.rawFlags&2?1:0)]);
        const output=await f.library.startRender(frame.drawPlan).done;assert.equal(sha(output.rgba),expected.rgbaSha256);
        assert.equal(JSON.stringify(f.body.copyState()),before);hashes.push(expected.rgbaSha256);output.rgba.fill(0);
      }
    }finally{f.close();}
  }
  assert.equal(hashes.length,vectors.complete_frames);
  return{stage:297,bodyQueues:vectors.traces.length,bodyCallbacks:callbacks,completeFrames:hashes.length,digest:sha(Buffer.from(JSON.stringify(hashes))),sourceGeneratedComparable:true,normalWireProducerProven:false};
}

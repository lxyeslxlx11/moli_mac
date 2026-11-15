/** Independent native-equation comparison through the actual source/generated API. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {nestedPhysicalRuntimeCommand} from './reference.mjs';
import {nestedPhysicalProjection,nestedPhysicalDigest,nestedPhysicalOwned} from './projection.mjs';
import {nestedPhysicalFixture} from './fixture.mjs';
export async function verifyNestedPhysicalModel(api,v,{queueCost=4,mismatchDirectory=new URL('../../build/analysis/game-battle-nested-physical-v1/',import.meta.url)}={}){
 let queues=0,states=0,rasters=0,settled=0;
 for(const row of v.queues){const c={...row.case,cost:queueCost};
  const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  const p=api.planBattlePhysicalFamily(nestedPhysicalRuntimeCommand(api,c),get,0,0);
  assert.equal(p.kind,'physical-family-plan',JSON.stringify(c)+' '+p.reason);assert.equal(nestedPhysicalDigest(p.rows),row.expected_digest,JSON.stringify(c));queues++;
 }
 for(const trace of v.traces){const c=trace.case,f=await nestedPhysicalFixture(api,v,c);
  try{
   const q=f.owner.queuePhysicalFamily(f.command,1,c.local,0);assert.equal(q.kind,'strike-queued',c.name+' '+q.reason);
   const initial=nestedPhysicalDigest(nestedPhysicalOwned(f.owner));
   if(initial!==trace.initialOwnedDigest){writeFileSync(new URL('model-initial-mismatch.json',mismatchDirectory),JSON.stringify({case:c,actual:nestedPhysicalOwned(f.owner),expectedDigest:trace.initialOwnedDigest,actualDigest:initial},null,2));assert.fail(c.name+' initial owned storage');}
   for(let i=0;i<trace.states.length;i++){
    const step=f.step();assert.equal(step.results.some(r=>r.result.endsWith('unavailable')),false,c.name+' unavailable#'+(i+1));
    const actual=nestedPhysicalProjection(f.owner),hash=nestedPhysicalDigest(actual);
    if(hash!==trace.states[i]){writeFileSync(new URL('model-state-mismatch.json',mismatchDirectory),JSON.stringify({case:c,frame:i+1,actual,actualDigest:hash,expectedDigest:trace.states[i]},null,2));assert.fail(c.name+' state#'+(i+1));}
    for(const r of trace.rasters.filter(r=>r.frame===i+1)){
     const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
     assert.equal(nestedPhysicalDigest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' full RGBA#'+r.frame+'/'+r.selector);assert.equal(nestedPhysicalDigest(nestedPhysicalProjection(f.owner)),hash);rasters++;
    }states++;
   }
   assert.equal(f.stopped,trace.stopped,c.name);const done=f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy);assert.equal(done,trace.bodySettled,c.name);settled+=Number(done);
   assert.equal(nestedPhysicalDigest(nestedPhysicalOwned(f.owner)),trace.finalOwnedDigest,c.name+' final owned storage');
  }finally{f.close();}
 }assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);return {queues,scenarios:v.traces.length,states,rasters,settled};
}

import {assertHiddenFrame} from '../game-legacy-battle-pursuit-linked-v1/assert-hidden.mjs';
/** Independent native-equation comparison through the actual source/generated API. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {chainMotion} from './reference.mjs';
import {chainProjection,chainDigest,chainOwned} from './projection.mjs';
import {chainFixture} from './fixture.mjs';
export async function verifyChainModel(api,v,{queueCost=4,mismatchDirectory=new URL('../../build/analysis/game-battle-chain260-v1/',import.meta.url)}={}){
 let queues=0,states=0,rasters=0,settled=0;
 for(const row of v.queues){const c={...row.case,cost:queueCost};
  const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  const p=api.planBattlePhysicalFamily({index:0,attachedRID:0,fields:row.fields},get,0,0);
  assert.equal(p.kind,'physical-family-plan',JSON.stringify(c)+' '+p.reason);assert.equal(chainDigest(p.rows),row.expected_digest,JSON.stringify(c));queues++;
 }
 for(const trace of v.traces){const c=trace.case,f=await chainFixture(api,v,c);let historicalOwned=null;
  try{
   const q=f.owner.queuePhysicalFamily(f.command,1,c.local,0);assert.equal(q.kind,'strike-queued',c.name+' '+q.reason);for(const command of f.additionalCommands)assert.equal(f.owner.queuePhysicalFamily(command,1,c.local,0).kind,'strike-queued');
   const initial=chainDigest(chainOwned(f.owner));
   if(initial!==trace.initialOwnedDigest){writeFileSync(new URL('model-initial-mismatch.json',mismatchDirectory),JSON.stringify({case:c,actual:chainOwned(f.owner),expectedDigest:trace.initialOwnedDigest,actualDigest:initial},null,2));assert.fail(c.name+' initial owned storage');}
   for(let i=0;i<trace.states.length;i++){
    // The historical vector ends after callbacks, before its formerly unsupported frame.
    let historicalProjection=null;const step=f.step(trace.renderBoundary?.frame===i+1?()=>{historicalProjection=chainProjection(f.owner);historicalOwned=chainOwned(f.owner);}:undefined);if(historicalProjection)assertHiddenFrame(f.frame,f.owner.copyPlayback());assert.equal(step.results.some(r=>r.result.endsWith('unavailable')),false,c.name+' unavailable#'+(i+1));
    const actual=historicalProjection??chainProjection(f.owner),hash=chainDigest(actual);
    if(hash!==trace.states[i]){writeFileSync(new URL('model-state-mismatch.json',mismatchDirectory),JSON.stringify({case:c,frame:i+1,actual,actualDigest:hash,expectedDigest:trace.states[i]},null,2));assert.fail(c.name+' state#'+(i+1));}
    for(const r of trace.rasters.filter(r=>r.frame===i+1)){
     const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
     assert.equal(chainDigest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' full RGBA#'+r.frame+'/'+r.selector);assert.equal(chainDigest(chainProjection(f.owner)),hash);rasters++;
    }states++;
   }
   assert.equal(f.stopped,trace.stopped,c.name);const done=f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy);assert.equal(done,trace.bodySettled,c.name);settled+=Number(done);
   assert.equal(chainDigest(historicalOwned??chainOwned(f.owner)),trace.finalOwnedDigest,c.name+' final owned storage');if(trace.consumerBoundary)assert.throws(()=>f.step(),e=>e.code===trace.consumerBoundary.code,c.name+' literal consumer context boundary');
  }finally{f.close();}
 }assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);return {queues,scenarios:v.traces.length,states,rasters,settled};
}

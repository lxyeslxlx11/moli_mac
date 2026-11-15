/** Independent native-equation comparison through the actual source/generated API. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {special96Motion} from './reference.mjs';
import {special96Projection,special96Digest,special96Owned} from './projection.mjs';
import {special96Fixture} from './fixture.mjs';
export async function verifySpecial96Model(api,v,{queueCost=4,mismatchDirectory=new URL('../../build/analysis/game-battle-special96-v1/',import.meta.url)}={}){
 let queues=0,states=0,rasters=0,settled=0,styleFrames=0,configurationRejections=0,sourceOnlyStates=0,sourceOnlyRGBA=0,sourceOnlyStyle=0;
 for(const row of v.queues){const c={...row.case,cost:queueCost};
  const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  const p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(special96Motion(c)).commands[0],get,0,0);
  assert.equal(p.kind,'physical-family-plan',JSON.stringify(c)+' '+p.reason);assert.equal(special96Digest(p.rows),row.expected_digest,JSON.stringify(c));queues++;
 }
 for(const trace of v.traces){const c=trace.case;
  if(c.alternative){await assert.rejects(()=>special96Fixture(api,v,c),e=>e.code==='LEGACY_BATTLE_SKILL_CONFIGURATION',c.name+' retained explicit profile boundary');configurationRejections++;sourceOnlyStates+=trace.states.length;sourceOnlyRGBA+=trace.rasters.filter(r=>!r.unavailable).length;sourceOnlyStyle+=trace.rasters.filter(r=>r.unavailable).length;continue;}
  const f=await special96Fixture(api,v,c);
  try{
   const q=f.owner.queuePhysicalFamily(f.command,1,c.local,0);assert.equal(q.kind,'strike-queued',c.name+' '+q.reason);
   const initial=special96Digest(special96Owned(f.owner));
   if(initial!==trace.initialOwnedDigest){writeFileSync(new URL('model-initial-mismatch.json',mismatchDirectory),JSON.stringify({case:c,actual:special96Owned(f.owner),expectedDigest:trace.initialOwnedDigest,actualDigest:initial},null,2));assert.fail(c.name+' initial owned storage');}
   for(let i=0;i<trace.states.length;i++){
    const step=f.step();assert.equal(step.results.some(r=>r.result.endsWith('unavailable')),false,c.name+' unavailable#'+(i+1));
    const actual=special96Projection(f.owner),hash=special96Digest(actual);
    if(hash!==trace.states[i]){writeFileSync(new URL('model-state-mismatch.json',mismatchDirectory),JSON.stringify({case:c,frame:i+1,actual,actualDigest:hash,expectedDigest:trace.states[i]},null,2));assert.fail(c.name+' state#'+(i+1));}
    for(const r of trace.rasters.filter(r=>r.frame===i+1)){
     if(r.unavailable){assert.throws(()=>f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),e=>e.code===r.unavailable,c.name+' explicit renderer boundary');assert.equal(special96Digest(special96Projection(f.owner)),hash);styleFrames++;continue;}
     const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
     assert.equal(special96Digest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' full RGBA#'+r.frame+'/'+r.selector);assert.equal(special96Digest(special96Projection(f.owner)),hash);rasters++;
    }states++;
   }
   assert.equal(f.stopped,trace.stopped,c.name);const done=f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy);assert.equal(done,trace.bodySettled,c.name);settled+=Number(done);
   assert.equal(special96Digest(special96Owned(f.owner)),trace.finalOwnedDigest,c.name+' final owned storage');
  }finally{f.close();}
 }assert.equal(states+sourceOnlyStates,v.frames);assert.equal(rasters+sourceOnlyRGBA,v.rgbaFrames);assert.equal(styleFrames+sourceOnlyStyle,v.explicitUnavailableStyleFrames);return {queues,scenarios:v.traces.length-configurationRejections,states,rasters,styleFrames,settled,configurationRejections,sourceOnlyStates,sourceOnlyRGBA,sourceOnlyStyle};
}

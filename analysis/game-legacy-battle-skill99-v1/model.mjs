import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {vectors,skill99Fixture} from './fixture.mjs';
import {statusSkillMotion,statusSkillProjection,statusSkillDigest} from '../game-battle-status-skills-v1/reference.mjs';
export function skill99Projection(owner){
 const p=statusSkillProjection(owner),raw=owner.copyPlayback();
 for(const node of p.nodes)node.scale=[...raw.nodes.find(n=>n.id===node.id).scale];
 return p;
}
export async function verifySkill99Model(api){
 for(const row of vectors.queues){
  const c=row.case,command=api.decodeLegacyGameBattleMotion(statusSkillMotion(c)).commands[0];
  const plan=api.planBattleStatusSkill(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),c.local);
  assert.equal(plan.kind,'status-skill-plan',JSON.stringify(c));assert.deepEqual(plan.rows,row.expected.rows);
 }
 let states=0,rasters=0,settled=0;
 for(const trace of vectors.traces){const f=await skill99Fixture(api,trace.case);
  try{
   assert.equal(f.owner.queueStatusSkill(f.command,1,trace.case.local).kind,'status-skill-queued');
   for(let i=0;i<trace.states.length;i++){
    f.step();const actual=skill99Projection(f.owner),hash=statusSkillDigest(actual);
    if(hash!==trace.states[i]){
     writeFileSync(new URL('../../build/analysis/game-legacy-battle-skill99-v1/model-state-mismatch.json',import.meta.url),JSON.stringify({case:trace.case,frame:i+1,actual},null,2));
     assert.fail(trace.case.name+' callback#'+(i+1)+' '+hash+' expected '+trace.states[i]);
    }
    states++;
    for(const expected of trace.rasters.filter(r=>r.frame===i+1)){
     const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,expected.selector),
      plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,
       index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:[...d.scale]}:{})})),
       skipped:[...out.skipped],drawOrder:out.drawPlan.drawOrder.map(j=>out.submitted[j].id)};
     assert.equal(statusSkillDigest(plan),expected.planDigest,trace.case.name+' frame plan#'+(i+1));
     const render=await f.library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(render.rgba).digest('hex'),expected.rgbaSha256,trace.case.name+' complete RGBA#'+(i+1));rasters++;
    }
   }
   settled+=+f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy);
  }finally{f.close();}
 }
 return{queues:vectors.queues.length,scenarios:vectors.traces.length,states,rasters,settled};
}

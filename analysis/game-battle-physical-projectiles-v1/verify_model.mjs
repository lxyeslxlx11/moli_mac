/** Compare independent source equations against the supplied actual source/generated API. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {projectileMotion as physicalMotion} from './reference.mjs';
import {projectileAssets} from './original_assets.mjs';
import {projectileProjection,projectileDigest} from './projection.mjs';
const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
export async function verifyProjectileModel(api,v){
 let queues=0,states=0,rasters=0;
 for(const row of v.queues){const [category,level,variant,caster,target,flags]=row.input,h=[caster,target,flags,12];if(flags&0x800000)h.push([100040,100041,100050]);
  const c={category,level,variant,caster,local:0,cost:3,hits:[h]},p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(physicalMotion(c)).commands[0],()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),0,0);
  assert.equal(p.kind,'physical-family-plan',row.input.join('/')+' '+p.reason);assert.equal(projectileDigest(p.rows),row.expected_digest,row.input.join('/'));queues++;
 }
 for(const trace of v.traces){const c=trace.case,files=originalFiles(projectileAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'}),owner=api.createLegacyGameBattleBodies();let frame;
  try{
   await library.initialize();owner.configurePlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:c.offset??[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local});owner.applyCharacterFlags(c.C_flags??0);
   const slots=[...new Set([...c.hits.flatMap(h=>h.slice(0,2)),c.caster])].sort((a,b)=>a-b);
   for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource,[0,0],[70,100,10,10]);owner.resetQueues(slots.reduce((mask,s)=>mask|1<<s,0));
   const q=owner.queuePhysicalFamily(api.decodeLegacyGameBattleMotion(physicalMotion(c)).commands[0],1,c.local,0);assert.equal(q.kind,'strike-queued',c.name+' '+q.reason);
   frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});let stopped=false;
   for(let i=0;i<trace.states.length;i++){
    const step=owner.stepPlayback({mainState:10,substate:6,controlFlags:0,localSlot:c.local,resourceCode:0,slowEffects:false});stopped||=step.stopRequested;
    assert.equal(step.results.some(r=>r.result.endsWith('unavailable')),false,c.name+' unavailable callback#'+(i+1));
    owner.advanceBackground();const draw=frame.step({width:640,height:480},owner.copyPlayback(),1000);owner.applyDrawPriorities(draw.depthPriorities);
    const actual=projectileProjection(owner),hash=projectileDigest(actual);
    if(hash!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-physical-projectiles-v1/model-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual,actual_digest:hash,expected_digest:trace.states[i]},null,2));assert.fail(c.name+' state#'+(i+1));}
    for(const r of trace.rasters.filter(r=>r.frame===i+1)){
     const out=frame.step({width:640,height:480},owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
     assert.equal(projectileDigest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' full RGBA#'+r.frame+'/'+r.selector);assert.equal(projectileDigest(projectileProjection(owner)),hash);rasters++;
    }
    states++;
   }
   assert.equal(stopped,trace.stopped,c.name);assert.equal(owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),trace.bodySettled,c.name);
  }finally{frame?.close();owner.close();library.close();files.close();}
 }
 assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);return {queues,scenarios:v.traces.length,states,rasters};
}

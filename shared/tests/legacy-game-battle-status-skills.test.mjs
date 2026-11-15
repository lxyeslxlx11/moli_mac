import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {statusSkillAssets} from '../../analysis/game-battle-status-skills-v1/original_assets.mjs';
import {statusSkillVectors as v,statusSkillMotion,statusSkillProjection,statusSkillDigest} from '../../analysis/game-battle-status-skills-v1/reference.mjs';
const base=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url)));
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
async function setup(c,{commands=false}={}){const files=originalFiles(statusSkillAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();
 const owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local??0});owner.applyCharacterFlags(c.C_flags??0);
 const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
 const command=api.decodeLegacyGameBattleMotion(statusSkillMotion(c)).commands[0],frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});if(!commands)owner.resetQueues(slots.reduce((m,s)=>m|(1<<s),0));
 return{owner,files,library,frame,command,close(){frame.close();owner.close();library.close();files.close();}};
}
const sample=(category=32,extras={})=>({category,level:0,caster:0,cost:3,local:0,hits:[[10,0x80000]],...extras});
function advance(f){f.owner.stepPlayback(ctx);f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000);f.owner.applyDrawPriorities(p.depthPriorities);return p;}
function finish(f,limit=1500){let done=false;for(let i=0;i<limit;i++){advance(f);if(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy)){done=true;break;}}assert.equal(done,true);}
test('all36 status/utility classes and ten levels have independent source queues/flags/self/reset parity',()=>{
 for(const row of v.queues){const c=row.case,command=api.decodeLegacyGameBattleMotion(statusSkillMotion(c)).commands[0],p=api.planBattleStatusSkill(command,()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),c.local);assert.equal(p.kind,'status-skill-plan');assert.deepEqual(p.rows,row.expected.rows,c.name);}
 assert.equal(api.LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE.classes.length,49);assert.equal(api.LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE.completeSKL,false);
});
test('independent complete status/utility callback states and both-selector RGBA frames match actual owners',async()=>{
 let states=0,rasters=0,settled=0;
 for(const trace of v.traces){const c=trace.case,f=await setup(c);try{const queued=f.owner.queueStatusSkill(f.command,1,c.local);assert.equal(queued.kind,'status-skill-queued',c.name+':'+queued.reason);assert.equal(f.owner.copy(c.caster).vitals[2],10,'Queue construction cannot spend MP');
  for(let i=0;i<trace.states.length;i++){advance(f);const actual=statusSkillProjection(f.owner),hash=statusSkillDigest(actual);
   if(hash!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-status-skills-v1/first-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual},null,2));assert.fail(c.name+' callback#'+(i+1)+' '+hash+' expected '+trace.states[i]);}
   for(const r of trace.rasters.filter(r=>r.frame===i+1)){const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
    assert.equal(statusSkillDigest(plan),r.planDigest,c.name+' plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' RGBA#'+r.frame+'/'+r.selector);assert.equal(statusSkillDigest(statusSkillProjection(f.owner)),hash,'Rendering must not repeat a callback or RNG draw');rasters++;
   }states++;
  }assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),trace.settled,c.name);settled+=Number(trace.settled);
 }finally{f.close();}}
 console.log('status-skills-independent '+JSON.stringify({scenarios:v.traces.length,states,rasters,settled}));assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);
});
test('the real command manager drains all36 consumers once, with no physical substitution',async()=>{
 for(const trace of v.traces.filter(t=>t.case.level===0&&t.case.name.startsWith('class'))){const c=trace.case,f=await setup(c,{commands:true});try{f.owner.load(statusSkillMotion(c),{...ctx,substate:5});let drained=false,queued=0;
  for(let i=0;i<1500;i++){const r=f.owner.callCallbacks(ctx);assert.equal(r.commands.some(q=>q.kind==='command-unavailable'),false,c.name);queued+=r.commands.filter(q=>q.kind==='command-status-skill').length;if(r.manager.kind==='battle-round-drained'){drained=true;break;}f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);f.owner.applyDrawPriorities(p.depthPriorities);}
  assert.equal(drained,true,c.name);assert.equal(queued,1);assert.equal(f.owner.copyState().roundCounter,1);
 }finally{f.close();}}
});
test('real status success creates one source icon without changing HP or received C metadata, and67 clears it',async()=>{
 const f=await setup(sample());try{f.owner.queueStatusSkill(f.command,1,0);finish(f);const b=f.owner.copy(10);assert.equal(b.dynamicFlags&0x3f0,0x10);assert.equal(b.rawStatusFlags,0);assert.equal(b.vitals[0],70);assert.equal(f.owner.copy(0).vitals[2],7);let icons=f.owner.copyPlayback().nodes.filter(n=>n.kind==='status'&&!n.deleted);assert.equal(icons.length,1);assert.equal(icons[0].resourceId,0x1adfb);
  f.owner.applyCharacter(10,0,100060,[0,0],[70,100,10,10]);assert.equal(f.owner.copy(10).dynamicFlags&0x3f0,0);assert.equal(f.owner.copyPlayback().nodes.find(n=>n.id===icons[0].id).deleted,false,'Source C flags alone do not delete1050');
  f.owner.resetQueues((1<<0)|(1<<10));f.owner.queueStatusSkill(api.decodeLegacyGameBattleMotion(statusSkillMotion(sample(67))).commands[0],2,0);finish(f);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='status'&&!n.deleted),false);assert.equal(f.owner.copy(10).rawStatusFlags,0);
 }finally{f.close();}
});
test('actual C800 owns persistent overlay;54 toggles that exact child and source C0 removes it',async()=>{
 const f=await setup(sample(54,{flags:{10:0x800}}));try{let n=f.owner.copyPlayback().nodes.find(n=>n.kind==='status-skill-overlay');assert.ok(n);assert.equal(f.owner.copy(10).dynamicFlags&0x800,0x800);f.owner.queueStatusSkill(f.command,1,0);finish(f);assert.equal(f.owner.copy(10).dynamicFlags&0x800,0);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='status-skill-overlay'&&!n.deleted),false);assert.equal(f.owner.copy(10).rawStatusFlags,0x800);
  f.owner.applyCharacter(10,0x800,100060,[0,0],[70,100,10,10]);n=f.owner.copyPlayback().nodes.find(n=>n.kind==='status-skill-overlay'&&!n.deleted);assert.ok(n);f.owner.applyCharacter(10,0,100060,[0,0],[70,100,10,10]);assert.equal(f.owner.copyPlayback().nodes.find(q=>q.id===n.id).deleted,true);
 }finally{f.close();}
});
test('manager field C precedence/end/update reuses the node and only actual zero flags delete it',async()=>{
 const f=await setup(sample(50,{hits:[[0,0]]}));try{f.owner.applyCharacterFlags(7);let p=f.owner.copyPlayback(),n=p.nodes.find(n=>n.kind==='status-skill-field');assert.equal(n.resourceId,0x1ae0c);assert.deepEqual(n.position,[318,270.5]);f.owner.stepPlayback(ctx);const before=f.owner.copyPlayback().nodes.find(q=>q.id===n.id).animation;f.owner.applyCharacterFlags(4);p=f.owner.copyPlayback();assert.equal(p.statusSkills.fieldNodeId,n.id);assert.equal(p.statusSkills.fieldResource,0x1ae0a);assert.deepEqual(p.nodes.find(q=>q.id===n.id).animation,before);
  f.owner.applyCharacterFlags(0x20);assert.equal(f.owner.copyPlayback().statusSkills.fieldResource,0x1ae0a);f.owner.applyCharacterFlags(0);assert.equal(f.owner.copyPlayback().statusSkills.fieldNodeId,null);assert.equal(f.owner.copyPlayback().nodes.find(q=>q.id===n.id).deleted,true);f.owner.stepPlayback(ctx);assert.equal(f.owner.copyPlayback().nodes.some(q=>q.id===n.id),false);
 }finally{f.close();}
});
test('source32/128 particle completions drive67/68 readiness and the self68 reset preserves omitted caster cost',async()=>{
 for(const[category,total]of[[67,32],[68,128]]){const c=sample(category,{hits:[[10,0x80000,7]]}),f=await setup(c);try{f.owner.queueStatusSkill(f.command,1,0);const ids=new Set();for(let i=0;i<600;i++){advance(f);for(const n of f.owner.copyPlayback().nodes)if(n.kind.endsWith('-particle'))ids.add(n.id);if(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))break;}assert.equal(ids.size,total);assert.equal(f.owner.copy(10).busy,0);if(category===68)assert.equal(f.owner.copy(10).vitals[0],77);
 }finally{f.close();}}
 const c=sample(68,{hits:[[0,0x80000,7]]}),f=await setup(c);try{f.owner.queueStatusSkill(f.command,1,0);assert.deepEqual([...f.owner.copy(0).actions.slice(0,6)],[145,77,155,38,-1,0]);finish(f);assert.equal(f.owner.copy(0).vitals[2],10,'Source self reset removed53, so do not fabricate a cost callback');assert.equal(f.owner.copy(0).vitals[0],77);}finally{f.close();}
});
test('malformed targets/getters/attachedRID and full ordinary queues reject atomically;68 reset has source capacity',async()=>{
 const f=await setup(sample());let reads=0;try{const before=JSON.stringify(f.owner.copyState());for(const command of[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:Object.defineProperty([...f.command.fields],4,{get(){reads++;return 10;}})}]){assert.equal(f.owner.queueStatusSkill(command,1,0).kind,'status-skill-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);}assert.equal(reads,0);f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queueStatusSkill(f.command,1,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
  const c=sample(68,{hits:[[10,0x80000,7]]}),command=api.decodeLegacyGameBattleMotion(statusSkillMotion(c)).commands[0];assert.equal(f.owner.queueStatusSkill(command,1,0).kind,'status-skill-queued');assert.deepEqual([...f.owner.copy(10).actions.slice(0,5)],[145,77,155,38,-1]);
 }finally{f.close();}
});

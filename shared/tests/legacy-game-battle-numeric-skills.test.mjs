import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {numericSkillAssets} from '../../analysis/game-battle-numeric-skills-v1/original_assets.mjs';
import {numericSkillVectors as v,numericSkillMotion,numericSkillProjection,numericSkillDigest} from '../../analysis/game-battle-numeric-skills-v1/reference.mjs';
const base=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url)));
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
async function setup(c,{commands=false}={}){const files=originalFiles(numericSkillAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();
 const owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local??0});owner.applyCharacterFlags(c.C_flags??0);
 const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
 const command=api.decodeLegacyGameBattleMotion(numericSkillMotion(c)).commands[0],frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});if(!commands)owner.resetQueues(slots.reduce((m,s)=>m|(1<<s),0));
 return{owner,files,library,frame,command,phase2:true,reflectors:api.planBattleNumericSkill(command,()=>({vitals:[70,100,10,10]}),c.local).reflectors,c,close(){frame.close();owner.close();library.close();files.close();}};
}
const sample=(extras={})=>({category:61,level:0,caster:0,cost:3,local:0,hits:[[10,0,12]],...extras});
function advance(f){if(f.phase2){const list=f.reflectors,p=f.owner.copy(f.c.caster);if(!list.length)f.phase2=false;
 else if(list.slice(0,-1).every(s=>f.owner.copy(s).state===0)&&f.owner.copy(list.at(-1)).state===1&&[0,1].includes(p.state)){f.owner.popAction(list.at(-1));f.phase2=false;}}
 f.owner.stepPlayback(ctx);f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000);f.owner.applyDrawPriorities(p.depthPriorities);return p;
}
function finish(f,limit=1500){for(let i=0;i<limit;i++){advance(f);if(!f.phase2&&f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))return;}assert.fail('actual numeric callbacks did not settle');}
test('all61..63 ten-level source numeric queues, flags, special targets and reflection equal independent equations',()=>{
 for(const row of v.queues){const c=row.case,p=api.planBattleNumericSkill(api.decodeLegacyGameBattleMotion(numericSkillMotion(c)).commands[0],()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),c.local);assert.equal(p.kind,'numeric-skill-plan',c.name);assert.deepEqual(p.rows,row.expected.rows,c.name);assert.deepEqual(p.reflectors,row.expected.reflectors,c.name);assert.equal(p.reflectedAmount,row.expected.reflectedAmount,c.name);}
 assert.deepEqual(api.LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.classes.filter(n=>n>=61&&n<=63),[61,62,63]);assert.equal(api.LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.completeSKL,false);
});
test('independent numeric body/effect/reflection states and both-selector complete RGBA match actual owners',async()=>{
 let states=0,rasters=0,bodySettled=0;
 for(const trace of v.traces){const c=trace.case,f=await setup(c);try{const q=f.owner.queueNumericSkill(f.command,1,c.local);assert.equal(q.kind,'numeric-skill-queued',c.name+':'+q.reason);assert.equal(f.owner.copy(c.caster).vitals[2],10);
  for(let i=0;i<trace.states.length;i++){advance(f);const actual=numericSkillProjection(f.owner),hash=numericSkillDigest(actual);
   if(hash!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-numeric-skills-v1/first-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual},null,2));assert.fail(c.name+' callback#'+(i+1)+' '+hash+' expected '+trace.states[i]);}
   for(const r of trace.rasters.filter(r=>r.frame===i+1)){const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
    assert.equal(numericSkillDigest(plan),r.planDigest,c.name+' plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' RGBA#'+r.frame+'/'+r.selector);assert.equal(numericSkillDigest(numericSkillProjection(f.owner)),hash,'Rendering cannot repeat callbacks or spend values');rasters++;
   }states++;
  }assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),trace.settled,c.name);assert.equal(f.phase2,trace.commandPhase2Waiting,c.name+' command phase');bodySettled+=Number(trace.settled);
 }finally{f.close();}}
 console.log('numeric-skills-independent '+JSON.stringify({scenarios:v.traces.length,states,rasters,bodySettled}));assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);
});
test('real numeric command phases drain once including actual multiple reflector handoff and self target',async()=>{
 for(const name of ['class61-level0','class62-level9','class63-level4','damage-61','absorb-62','reflect-63','reflectors-61','reflect-last-plain-62','slot20-target0-0-61','slot21-target10-20000-63','self-61','self-reflect']){
  const c=v.traces.find(t=>t.case.name===name).case,f=await setup(c,{commands:true});try{f.owner.load(numericSkillMotion(c),{...ctx,substate:5});let drained=false,queued=0;
   for(let i=0;i<1500;i++){const r=f.owner.callCallbacks(ctx);assert.equal(r.commands.some(q=>q.kind==='command-unavailable'),false,name);queued+=r.commands.filter(q=>q.kind==='command-numeric-skill').length;if(r.manager.kind==='battle-round-drained'){drained=true;break;}f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);f.owner.applyDrawPriorities(p.depthPriorities);}
   assert.equal(drained,true,name);assert.equal(queued,1);assert.equal(f.owner.copyState().roundCounter,1);
  }finally{f.close();}}
});
test('received healing/damage apply only at owned number callbacks and style0 creates source message without changing vitals',async()=>{
 for(const[flags,expected]of[[0,82],[0x20000,58],[0x40000,70],[0x10000000,70],[0x10020000,70]]){const f=await setup(sample({hits:[[10,flags,12]]}));try{f.owner.queueNumericSkill(f.command,1,0);assert.equal(f.owner.copy(10).vitals[0],70);assert.equal(f.owner.copy(0).vitals[2],10);let seen=false,display=false;
   for(let i=0;i<800;i++){advance(f);const p=f.owner.copyPlayback();seen||=p.nodes.some(n=>n.kind==='numeric-skill-charge');display||=p.nodes.some(n=>n.kind==='message'&&n.resourceId===0x57bb);if(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))break;}
   assert.equal(seen,true);assert.equal(f.owner.copy(10).vitals[0],expected);assert.equal(f.owner.copy(0).vitals[2],7);assert.equal(display,!!(flags&0x10000000));
  }finally{f.close();}}
});
test('level9 secondary follows the actual16 parent and is cleaned by parent completion',async()=>{
 const f=await setup(sample({level:9}));try{f.owner.queueNumericSkill(f.command,1,0);let overlay=null,parent=null;for(let i=0;i<100;i++){advance(f);const nodes=f.owner.copyPlayback().nodes;overlay=nodes.find(n=>n.kind==='numeric-skill-overlay');if(overlay){parent=nodes.find(n=>n.id===overlay.parentId);break;}}assert.equal(parent.kind,'numeric-skill-charge');assert.equal(parent.resourceId,0x1ae05);assert.equal(overlay.resourceId,0x1ae68);assert.equal(overlay.drawPriority,203);finish(f);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='numeric-skill-overlay'),false);
 }finally{f.close();}
});
test('zero-sum and duplicate reflectors retain original phase2 waits without fabricated round completion',async()=>{
 for(const hits of[[[10,0x10000,7],[11,0x10000,-7]],[[10,0x10000,7],[10,0x10000,9]]]){const c=sample({hits}),f=await setup(c,{commands:true});try{f.owner.load(numericSkillMotion(c),{...ctx,substate:5});let waiting=0;
  for(let i=0;i<700;i++){const r=f.owner.callCallbacks(ctx);waiting+=r.commands.filter(q=>q.kind==='command-numeric-skill-reflection-wait').length;assert.notEqual(r.manager.kind,'battle-round-drained');f.owner.advanceBackground();}
  assert.ok(waiting>600);assert.equal(f.owner.copyState().roundCounter,0);
 }finally{f.close();}}
});
test('malformed fields/getters/unknown consumers and exhausted queues reject before numeric mutations',async()=>{
 const f=await setup(sample());let reads=0;try{const before=JSON.stringify(f.owner.copyState());for(const command of[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:Object.defineProperty([...f.command.fields],4,{get(){reads++;return 10;}})},{...f.command,fields:[10800,...f.command.fields.slice(1)]}]){assert.equal(f.owner.queueNumericSkill(command,1,0).kind,'numeric-skill-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);}assert.equal(reads,0);
  f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queueNumericSkill(f.command,1,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
});

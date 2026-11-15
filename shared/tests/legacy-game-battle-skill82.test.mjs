import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {skill82Assets} from '../../analysis/game-battle-skill82-v1/original_assets.mjs';
import {skill82Vectors as v,skill82Motion,skill82Projection,skill82Digest} from '../../analysis/game-battle-skill82-v1/reference.mjs';
const base=JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json',import.meta.url)));
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
const sample=(extra={})=>({category:82,level:0,caster:0,cost:3,local:0,hits:[[10,1,12]],...extra});
async function setup(c,{commands=false}={}){const files=originalFiles(skill82Assets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();
 const owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local});owner.applyCharacterFlags(c.C_flags??0);
 const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
 const command=api.decodeLegacyGameBattleMotion(skill82Motion(c)).commands[0],frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});if(!commands)owner.resetQueues(slots.reduce((m,s)=>m|(1<<s),0));
 return {c,owner,library,files,frame,command,stopped:false,events:[],close(){frame.close();owner.close();library.close();files.close();}};
}
function advance(f){const out=f.owner.stepPlayback({...ctx,localSlot:f.c.local});f.stopped||=out.stopRequested;f.events.push(...out.events);f.owner.advanceBackground();const p=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000);f.owner.applyDrawPriorities(p.depthPriorities);return p;}
function finish(f){for(let i=0;i<1600;i++){advance(f);if(f.stopped||f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))return;}assert.fail('real82 body callbacks did not settle');}
test('all source82 queues, resource packing and explicit empty-runtime rejection match independent equations',()=>{
 for(const row of v.queues){const p=api.planBattleSkill82(api.decodeLegacyGameBattleMotion(skill82Motion(row.case)).commands[0],()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0}),row.case.local,0);
  if(row.portableBoundary){assert.equal(p.kind,'skill82-unavailable');assert.equal(p.reason,row.portableBoundary);}else{assert.equal(p.kind,'skill82-plan');assert.deepEqual(p.rows,row.expected.rows,row.case.name);}}
 assert.deepEqual(api.LEGACY_GAME_BATTLE_SKILL82_PROFILE.midpoints,[[188,203],[449,336]]);assert.equal(api.LEGACY_GAME_BATTLE_SKILL82_PROFILE.completeSKL,false);
});
test('independent82 complete source states and two-selector full RGBA match actual owners',async()=>{
 let states=0,rasters=0,stops=0;for(const trace of v.traces){const c=trace.case,f=await setup(c);try{const q=f.owner.queueSkill82(f.command,1,c.local,0);
  if(trace.portableBoundary){assert.equal(q.kind,'skill82-unavailable');continue;}assert.equal(q.kind,'skill82-queued',c.name);assert.equal(f.owner.copy(c.caster).vitals[2],10);
  for(let i=0;i<trace.states.length;i++){advance(f);const actual=skill82Projection(f.owner),hash=skill82Digest(actual);
   if(hash!==trace.states[i]){writeFileSync(new URL('../../build/analysis/game-battle-skill82-v1/first-state-mismatch.json',import.meta.url),JSON.stringify({case:c,frame:i+1,actual},null,2));assert.fail(c.name+' callback#'+(i+1)+' '+hash+' expected '+trace.states[i]);}
   for(const r of trace.rasters.filter(r=>r.frame===i+1)){const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
    assert.equal(skill82Digest(plan),r.planDigest,c.name+' plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' RGBA#'+r.frame+'/'+r.selector);assert.equal(skill82Digest(skill82Projection(f.owner)),hash,'Rendering cannot repeat callbacks');rasters++;
   }states++;
  }assert.equal(f.stopped,trace.stopped,c.name);assert.equal(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy),trace.bodySettled,c.name);stops+=Number(f.stopped);
 }finally{f.close();}}
 console.log('skill82-independent '+JSON.stringify({scenarios:v.traces.length,states,rasters,stops}));assert.equal(states,v.frames);assert.equal(rasters,v.rgbaFrames);
});
test('actual82 manager preserves local244 stop versus nonlocal deletion and a real drained round',async()=>{
 for(const c of [sample(),sample({caster:1}),sample({caster:1,hits:[[0,0x41,12]]})]){const f=await setup(c,{commands:true});try{f.owner.load(skill82Motion(c),{...ctx,substate:5,localSlot:c.local});let stopped=0,exited=0,drained=false;
  for(let i=1;i<1800;i++){const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false);if(out.body.stopRequested)stopped=i;if(out.nextSubstate===7){exited=i;break;}if(out.manager.kind==='battle-round-drained'){drained=true;break;}f.owner.advanceBackground();}
  if(c.caster===0||c.hits[0][1]&0x40){assert.ok(stopped>0);assert.equal(exited,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);assert.equal(drained,false);f.owner.prepareExit({...ctx,substate:7});f.owner.markExitDeleted();}
  else{assert.equal(drained,true);assert.equal(f.owner.copyState().roundCounter,1);assert.equal(f.owner.copyState().bodies.bodies[1],null);assert.equal(f.owner.copyState().bodies.bodies[10].vitals[0],58);}
 }finally{f.close();}}
});
test('82 RID consumes metadata exactly once, then applies original amount and follows new rider/attachment',async()=>{
 for(const name of ['RID','RID-caster','RID-then-plain','RID-clear']){const c=v.traces.find(t=>t.case.name===name).case,f=await setup(c);try{f.owner.queueSkill82(f.command,1,c.local,0);finish(f);const recipient=name==='RID-caster'?0:10,body=f.owner.copy(recipient),hp=f.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP');assert.equal(hp.length,name==='RID-then-plain'?2:1);assert.equal(f.owner.copy(10).vitals[0],61);assert.equal(body.resourceId,name==='RID-clear'?100060:100041);assert.equal(f.owner.copy(c.caster).tupleRead,c.hits.length+3);
  const nodes=f.owner.copyPlayback().nodes;if(name==='RID-clear')assert.equal(nodes.some(n=>n.kind==='rider'&&!n.deleted),false);else{const rider=nodes.find(n=>n.kind==='rider'&&!n.deleted);assert.ok(rider);assert.deepEqual(rider.scale,body.scale);}
 }finally{f.close();}}
});
test('82 applies each received value literally, including duplicate, zero, signed and non-reflecting10000',async()=>{
 for(const [hits,hp,events]of [[[[10,1,7],[10,3,9]],54,2],[[[10,0x10000,12]],58,1],[[[10,0x40000,12]],58,1],[[[10,0x10000000,0]],70,1],[[[10,1,-7]],77,1],[[[10,1,-2147483648]],0,1]]){const f=await setup(sample({hits}));try{f.owner.queueSkill82(f.command,1,0,0);finish(f);assert.equal(f.owner.copy(10).vitals[0],hp);assert.equal(f.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,events);assert.equal(f.owner.copy(0).vitals[0],70);}finally{f.close();}}
});
test('82 real scaling precedes hide/result and shared background shake returns to zero',async()=>{
 const f=await setup(sample({caster:1}));try{f.owner.queueSkill82(f.command,1,0,0);let grew=false,hidden=false,impact=false,quake=false,max=0;
  for(let i=0;i<1600;i++){advance(f);const body=f.owner.copy(1),p=f.owner.copyPlayback();if(body){grew||=body.scale[0]>1.5;hidden||=!!(body.actorFlags&2);}impact||=p.nodes.some(n=>n.kind==='impact'&&n.resourceId===0x1ae4a);max=Math.max(max,p.backgroundState.amplitude);quake||=p.backgroundState.shakeFlag===1;if(f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy))break;}
  assert.ok(grew&&hidden&&impact&&quake);assert.equal(max,6);assert.equal(f.owner.copyPlayback().backgroundState.shakeFlag,0);for(let i=0;i<8;i++)advance(f);assert.equal(f.owner.copyPlayback().backgroundState.amplitude,0);
 }finally{f.close();}
});
test('82 missing ports, malformed/getter/empty/RID context and capacity failures precede mutations',async()=>{
 const bare=api.createLegacyGameBattleBodies();assert.equal(bare.queueSkill82({index:0,attachedRID:0,fields:[]},1,0,0).kind,'skill82-unavailable');bare.close();
 const f=await setup(sample());let reads=0;try{const before=JSON.stringify(f.owner.copyState());for(const command of [{...f.command,attachedRID:1},{...f.command,fields:[8200,3,0,0,255]},{...f.command,fields:f.command.fields.slice(0,-1)},{...f.command,fields:Object.defineProperty([...f.command.fields],4,{get(){reads++;return 10;}})}]){assert.equal(f.owner.queueSkill82(command,1,0,0).kind,'skill82-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);}assert.equal(reads,0);assert.equal(f.owner.queueSkill82(f.command,1,NaN,0).reason,'skill82-local-context');assert.equal(JSON.stringify(f.owner.copyState()),before);
  const rid=api.decodeLegacyGameBattleMotion(skill82Motion(sample({hits:[[10,0x800001,9,[100040,100041,100050]]]}))).commands[0];assert.equal(f.owner.queueSkill82(rid,1,0,undefined).reason,'skill82-resource-context');assert.equal(JSON.stringify(f.owner.copyState()),before);
  f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queueSkill82(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}
});

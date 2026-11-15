import assert from 'node:assert/strict';
/** Authored archives and real public body/command owners for SKL99..104. */
import {readFileSync} from 'node:fs';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {characterAssets} from '../game-post-login-v1/original_assets.mjs';
import {statusSkillAssets} from '../game-battle-status-skills-v1/original_assets.mjs';
import {statusSkillVectors,statusSkillMotion} from '../game-battle-status-skills-v1/reference.mjs';
export const vectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
export const context=Object.freeze({mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false});
export function skill99Files({omitIcons=[]}={}){
 const prior=statusSkillVectors.files,index=Buffer.from(prior.find(r=>r.path==='Bin/AnimeInfo.bin').bytesHex,'hex'),
  animation=Buffer.from(prior.find(r=>r.path==='Bin/Anime.bin').bytesHex,'hex'),indices=[index],data=[animation];
 let offset=animation.length;
 for(const row of vectors.addedAnimations){
  if(omitIcons.includes(row.resourceId))continue;
  const raw=Buffer.from(row.bytesHex,'hex'),record=Buffer.alloc(12);record.writeUInt32LE(row.resourceId);record.writeUInt32LE(offset,4);record.writeUInt16LE(1,8);
  indices.push(record);data.push(raw);offset+=raw.length;
 }
 const files=prior.map(row=>({...row,...(row.path==='Bin/AnimeInfo.bin'?{bytesHex:Buffer.concat(indices).toString('hex')}:
  row.path==='Bin/Anime.bin'?{bytesHex:Buffer.concat(data).toString('hex')}:{})}));
 return{...statusSkillVectors,files};
}
export const skill99ProductFiles=()=>characterAssets(statusSkillAssets(base,skill99Files()));
export async function skill99Fixture(api,c,{commands=false,omitIcons=[]}={}){
 const files=originalFiles(statusSkillAssets(base,skill99Files({omitIcons}))),library=api.createLegacyGameResourceLibrary({
  plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
 let owner,frame;
 try{
  await library.initialize();owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();
  owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,
   seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
  owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local});
  owner.applyCharacterFlags(0);
  const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);
  for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],[70,100,10,10]);
  if(!commands)owner.resetQueues(slots.reduce((mask,slot)=>mask|1<<slot,0));
  frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});
  const raw=statusSkillMotion(c),command=api.decodeLegacyGameBattleMotion(raw).commands[0],events=[];
  return{owner,frame,library,files,c,raw,command,events,
   step(){const out=owner.stepPlayback({...context,localSlot:c.local});events.push(...out.events);owner.advanceBackground();
    const draw=frame.step({width:640,height:480},owner.copyPlayback(),1000);owner.applyDrawPriorities(draw.depthPriorities);return{out,draw};},
   close(){frame.close();owner.close();library.close();files.close();}};
 }catch(error){frame?.close();owner?.close();library.close();files.close();throw error;}
}

export async function runSkill99Manager(api,c){
 const f=await skill99Fixture(api,c,{commands:true});let end=null,draws=0,mp=0,hp=0;const icons=new Set();
 try{
  f.owner.load(f.raw,{...context,localSlot:c.local,substate:5});
  for(let pass=1;pass<=1200;pass++){
   const out=f.owner.callCallbacks({...context,localSlot:c.local});
   for(const command of out.commands)assert.notEqual(command.kind,'command-unavailable',command.reason);
   for(const event of out.body.events)if(event.kind==='battle-vital')event.field==='HP'?hp++:mp++;
   for(const n of f.owner.copyState().playback.nodes)if(n.kind==='status-skill-modifier')icons.add(n.id);
   f.owner.advanceBackground();const frame=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);
   f.owner.applyDrawPriorities(frame.depthPriorities);draws+=frame.submitted.length;
   if(out.manager.kind==='battle-round-drained'){end={pass,round:out.manager.roundCounter};break;}
  }
  assert.ok(end&&draws>0,c.name);assert.equal(end.round,1);assert.equal(hp,0);assert.equal(mp,1);
  assert.equal(f.owner.copyState().bodies.bodies.filter(Boolean).every(b=>!b.busy&&b.vitals[0]===70),true);
  return{name:c.name,end,draws,mp,hp,icons:icons.size};
 }finally{f.close();}
}

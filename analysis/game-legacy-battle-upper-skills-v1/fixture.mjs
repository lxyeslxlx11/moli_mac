import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {characterAssets} from '../game-post-login-v1/original_assets.mjs';
import {statusSkillAssets} from '../game-battle-status-skills-v1/original_assets.mjs';
import {skill99Files} from '../game-legacy-battle-skill99-v1/fixture.mjs';
const retained=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const corrected=JSON.parse(readFileSync(new URL('../game-legacy-battle-impact-skills-v1/upper-smoke-traces.json',import.meta.url)));
const overrides=new Map(corrected.traces.map(trace=>[trace.case.name,trace]));
export const vectors={...retained,traces:retained.traces.map(trace=>overrides.get(trace.case.name)??trace)};
const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
export const context=Object.freeze({mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false});
export function upperSkillMotion(c){const slot=n=>n===20?50:n===21?51:n,fields=[c.category*100+c.level,c.cost??3,c.ignoredWord??0,slot(c.caster)];
 for(const h of c.hits)fields.push(slot(h[0]),...(c.category===108?[h[2],h[1]]:[h[1]]));fields.push(255);
 return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',ch=>ch.charCodeAt(0));
}
export function upperSkillFiles({omit=[]}={}){
 const prior=skill99Files(),files=prior.files.map(row=>({...row})),index=files.find(r=>r.path==='Bin/AnimeInfo.bin'),data=files.find(r=>r.path==='Bin/Anime.bin');
 const indices=[Buffer.from(index.bytesHex,'hex')],chunks=[Buffer.from(data.bytesHex,'hex')];let offset=chunks[0].length;
 for(const r of vectors.addedAnimations){if(omit.includes(r.resourceId))continue;const raw=Buffer.from(r.bytesHex,'hex'),record=Buffer.alloc(12);
  record.writeUInt32LE(r.resourceId);record.writeUInt32LE(offset,4);record.writeUInt16LE(r.actions??1,8);indices.push(record);chunks.push(raw);offset+=raw.length;}
 index.bytesHex=Buffer.concat(indices).toString('hex');data.bytesHex=Buffer.concat(chunks).toString('hex');
 const info=files.find(r=>r.path==='Bin/GraphicInfo.bin'),pixels=files.find(r=>r.path==='Bin/Graphic.bin'),records=[Buffer.from(info.bytesHex,'hex')],images=[Buffer.from(pixels.bytesHex,'hex')];
 const known=new Set();for(let at=0;at<records[0].length;at+=40)known.add(records[0].readUInt32LE(at+36));let pixelOffset=images[0].length;
 for(const row of vectors.addedGraphics){if(known.has(row.resourceId))continue;const record=Buffer.from(row.recordHex,'hex'),image=Buffer.from(row.bytesHex,'hex');record.writeUInt32LE(pixelOffset,4);records.push(record);images.push(image);pixelOffset+=image.length;}
 info.bytesHex=Buffer.concat(records).toString('hex');pixels.bytesHex=Buffer.concat(images).toString('hex');return {...prior,files};
}
export const upperSkillProductFiles=()=>characterAssets(statusSkillAssets(base,upperSkillFiles()));
export async function upperSkillFixture(api,c,{commands=false,omit=[]}={}){
 const files=originalFiles(statusSkillAssets(base,upperSkillFiles({omit}))),library=api.createLegacyGameResourceLibrary({
  plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});let owner,frame;
 try{
  await library.initialize();owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();
  owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,
   seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
  owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local});owner.applyCharacterFlags(0);
  const slots=[...new Set([c.caster,...c.hits.map(h=>h[0])])].sort((a,b)=>a-b);
  for(const slot of slots)owner.applyCharacter(slot,c.flags?.[slot]??0,c.resource??100060,[0,0],c.vitals?.[slot]??[70,100,10,10]);
  if(!commands)owner.resetQueues(slots.reduce((mask,slot)=>mask|1<<slot,0));
  frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});
  const raw=upperSkillMotion(c),command=api.decodeLegacyGameBattleMotion(raw).commands[0],events=[];
  return {owner,frame,library,files,c,raw,command,events,
   step(){const out=owner.stepPlayback({...context,localSlot:c.local});events.push(...out.events);owner.advanceBackground();
    const draw=frame.step({width:640,height:480},owner.copyPlayback(),1000);owner.applyDrawPriorities(draw.depthPriorities);return {out,draw};},
   close(){frame.close();owner.close();library.close();files.close();}};
 }catch(error){frame?.close();owner?.close();library.close();files.close();throw error;}
}
export async function runUpperSkillManager(api,c){const f=await upperSkillFixture(api,c,{commands:true});let end=null,draws=0;const events=[];
 try{
  f.owner.load(f.raw,{...context,localSlot:c.local,substate:5});
  for(let pass=1;pass<=8500;pass++){
   const out=f.owner.callCallbacks({...context,localSlot:c.local});
   for(const command of out.commands)assert.notEqual(command.kind,'command-unavailable',command.reason);
   for(const body of out.body.results)assert.equal(body.result.endsWith('unavailable'),false,c.name+' '+body.result);
   events.push(...out.body.events);f.owner.advanceBackground();const frame=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);
   f.owner.applyDrawPriorities(frame.depthPriorities);draws+=frame.submitted.length;
   if(out.manager.kind==='battle-round-drained'){end={pass,round:out.manager.roundCounter};break;}
  }
  assert.ok(end&&draws>0,c.name);assert.equal(end.round,1);
  return {name:c.name,end,draws,events:events.filter(e=>['battle-vital','battle-information','sound'].includes(e.kind)),
   bodies:f.owner.copyState().bodies.bodies.filter(Boolean).map(b=>({slot:b.slot,vitals:b.vitals,afterImageEnabled:b.afterImageEnabled}))};
 }finally{f.close();}
}

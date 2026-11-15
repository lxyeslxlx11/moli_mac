import {readFileSync} from 'node:fs';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {projectileAssets} from '../game-battle-physical-projectiles-v1/original_assets.mjs';
import {projectileContext} from '../game-battle-physical-projectiles-v1/fixture.mjs';
import {specialPairsMotion} from './reference.mjs';
const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
export async function specialPairsFixture(api,v,c,{commands=false}={}){
 const files=originalFiles(projectileAssets(base,v)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
 let owner,frame;
 try{
  await library.initialize();owner=commands?api.createLegacyGameBattleCommands():api.createLegacyGameBattleBodies();
  owner[commands?'configureBodyPlayback':'configurePlayback']({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:c.alternative??false,staticFlip:false,screenOffset:c.offset??[0,0]});
  owner.configureSkills({graphics:library.catalogs().graphics});owner.configureCastingContext({entryMode:1,labelFlag:0,localSlot:c.local});owner.applyCharacterFlags(c.C_flags??0);
  const slots=[...new Set([...c.hits.flatMap(h=>[...h.slice(0,2),...(h[2]&512?[h[5]]:[])]),...(c.nested?[c.nested.target,...(c.nested.guard!==null?[c.nested.guard]:[])]:[])])].sort((a,b)=>a-b);
  for(const s of slots){owner.applyCharacter(s,c.flags?.[s]??0,c.resource,[0,0],[70,100,10,10]);if(!commands)for(const fourth of c.initialFourths?.[s]??[])owner.appendTuple(s,[0,0,0,fourth]);}
  if(!commands)owner.resetQueues(slots.reduce((mask,s)=>mask|1<<s,0));frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});
  const f={api,v,c,files,library,owner,frame,events:[],stopped:false,raw:specialPairsMotion(c),
   step(){const out=owner.stepPlayback({...projectileContext,localSlot:c.local});f.lastCallbackSeed=owner.copyPlayback().seed;f.events.push(...out.events);f.stopped||=out.stopRequested;owner.advanceBackground();const draw=frame.step({width:640,height:480},owner.copyPlayback(),1000);owner.applyDrawPriorities(draw.depthPriorities);return out;},
   close(){frame.close();owner.close();library.close();files.close();}};
  f.command=api.decodeLegacyGameBattleMotion(f.raw).commands[0];return f;
 }catch(error){frame?.close();owner?.close();library.close();files.close();throw error;}
}

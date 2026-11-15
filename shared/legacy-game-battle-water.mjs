/** Fixed37c4 normal main9/3 -> main10 -> main9 return water ordering. No body callbacks. */
import {assetFields,assetInteger,assetList,assetFail} from './legacy-game-resource-values.mjs';
import {createLegacyGameWater,isLegacyGameWaterOwner,isLegacyGameWaterCommand} from './legacy-game-water.mjs';
import {createLegacyGameDrawPlan} from './legacy-game-draw-plan.mjs';
const pair=(value,read)=>{const a=assetList(value,2);if(a.length!==2)assetFail('LEGACY_BATTLE_WATER_PAIR');return Object.freeze(a.map(read));};
const float=n=>{if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))assetFail('LEGACY_BATTLE_WATER_FLOAT');return Math.fround(n);};
export function snapshotLegacyGameBattleWaterContext(value){const r=assetFields(value,['mapId','position','camera','center','nativeGate','localPresent']);
 assetInteger(r.mapId,-2147483648,2147483647);assetInteger(r.nativeGate,-2147483648,2147483647);if(typeof r.localPresent!=='boolean')assetFail('LEGACY_BATTLE_WATER_PRESENCE');
 r.position=pair(r.position,float);r.camera=pair(r.camera,float);r.center=pair(r.center,n=>assetInteger(n,-2147483648,2147483647));return Object.freeze(r);
}
function append(plan,strip){return strip?createLegacyGameDrawPlan(plan.width,plan.height,[...plan.commands,{waterStrip:strip,priority:2}],plan.text,plan.palette):plan;}
function frameWithStrip(frame,strip){if(!strip)return frame;const drawPlan=append(frame.drawPlan,strip),submitted=Object.freeze([...frame.submitted,Object.freeze({id:null,kind:'battle-water',slot:null,priority:2})]);
 return Object.freeze({...frame,drawPlan,submitted,drawOrder:Object.freeze(drawPlan.drawOrder.map(i=>submitted[i])),waterEffect:strip});
}
export function createLegacyGameBattleWater(ownerValue,contextProvider){
 const ownsWater=ownerValue===undefined,water=ownsWater?createLegacyGameWater():ownerValue;if(!isLegacyGameWaterOwner(water)||typeof contextProvider!=='function')assetFail('LEGACY_BATTLE_WATER_OWNER');
 let configured=null;
 const context=required=>{const value=configured??contextProvider();if(value===null||value===undefined){if(required)assetFail('LEGACY_BATTLE_WATER_CONTEXT_REQUIRED');return null;}return snapshotLegacyGameBattleWaterContext(value);};
 const consume=(requested,c)=>water.consume(requested,c.mapId,c.position,c.camera,c.center,c.nativeGate);
 return Object.freeze({
  configure(value){configured=snapshotLegacyGameBattleWaterContext(value);return configured;},
  capture(plan){const requested=plan.commands.some(isLegacyGameWaterCommand),c=context(requested);return c?append(plan,consume(requested,c)):plan;},
  frame(frame){const c=context(!!frame.waterRequested);if(!c)return frame;if(c.localPresent)water.advance();const result=frameWithStrip(frame,consume(!!frame.waterRequested,c));water.savePosition(c.position);return result;},
  finish(entry){
   // Activation already used the normal world update/pass. Rebuild performed
   // a nested map capture; its main-loop tick and outer empty pass remain here.
   if(entry.return?.frame&&!entry.return.capture)return entry;
   const c=context(!!entry.frame?.waterRequested);if(!c)return entry;
   if(c.localPresent)water.advance();
   const strip=consume(!!entry.frame?.waterRequested,c),result=entry.frame?frameWithStrip(entry.frame,strip):null;
   water.savePosition(c.position);return result&&result!==entry.frame?Object.freeze({...entry,frame:result}):entry;
  },
  copyState(){return water.copyState();},
  close(){configured=null;if(ownsWater)water.close();},
 });
}

/** Fixed37c4 505b70/506820 water pass. Numeric state; rendering never advances it. */
import {assetFields,assetInteger,assetList,assetFail} from './legacy-game-resource-values.mjs';
import {projectLegacyGamePosition} from './legacy-game-motion.mjs';

export const LEGACY_GAME_WATER_PROFILE=Object.freeze({id:'legacy-se6000-37c4-water-v1',width:640,height:480,strips:60,stripHeight:8,priority:2});
const wave=Object.freeze([0,1,2,3,4,5,6,7,8,9,10,10,11,11,11,12,12,12,11,11,11,10,9,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-10,-11,-11,-11,-12,-12,-12,-11,-11,-11,-10,-9,-9,-8,-7,-6,-5,-4,-3,-2,-1]);
const owners=new WeakSet(),specialCommands=new WeakSet();
export const isLegacyGameWaterGraphic=index=>Number.isInteger(index)&&index>=3096&&index<=3105;
// Prepared commands retain the same public shape and borrowed sprite ownership.
export function markLegacyGameWaterGraphic(command,index){if(command&&isLegacyGameWaterGraphic(index))specialCommands.add(command);return command;}
export const isLegacyGameWaterCommand=command=>specialCommands.has(command)||isLegacyGameWaterGraphic(command?.image?.index);
export function snapshotLegacyGameWater(value){const r=assetFields(value,['phase','amplitude']);assetInteger(r.phase,0,63);assetInteger(r.amplitude,0,100);if(r.amplitude&1)assetFail('LEGACY_WATER_AMPLITUDE');return Object.freeze(r);}
export function legacyGameWaterRows(value){const r=snapshotLegacyGameWater(value);return Object.freeze(Array.from({length:60},(_,i)=>i*8+12+Math.trunc(wave[(r.phase+i)&63]*r.amplitude/100)));}
export function isLegacyGameWaterOwner(value){return owners.has(value);}
export function createLegacyGameWater(){
 let closed=false,phase=0,amplitude=0,lastMap=0,previous=Object.freeze([0,0]),updates=0,passes=0;
 const active=()=>{if(closed)assetFail('LEGACY_WATER_CLOSED');};
 const owner=Object.freeze({
  advance(){active();phase=Math.fround(phase+0.25);updates++;},
  consume(requested,mapId,position,camera,center,nativeGate=0){active();if(typeof requested!=='boolean')assetFail('LEGACY_WATER_REQUEST');assetInteger(mapId,-2147483648,2147483647);assetInteger(nativeGate,-2147483648,2147483647);
   position=assetList(position,2);
   // The same current camera/center projects both positions in source506970.
   const before=projectLegacyGamePosition(previous,camera,center),now=projectLegacyGamePosition(position,camera,center);
   let result=null;
   if(requested){
    if(nativeGate!==0||!(mapId>=40000&&mapId<=41999||[59000,59001,59100].includes(mapId)))amplitude=0;
    else{
     if(lastMap!==mapId){lastMap=mapId;amplitude=0;}
     phase=Math.fround(phase-Math.fround((before[1]-now[1])*0.125));
     phase%=64;if(phase<0)phase=Math.fround(phase+64);if(Object.is(phase,-0))phase=0;
     result=snapshotLegacyGameWater({phase:Math.trunc(phase),amplitude});
     if(amplitude<100)amplitude+=2;
    }
   }
   passes++;return result;
  },
  savePosition(position){active();position=assetList(position,2);if(position.length!==2||position.some(n=>typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n))))assetFail('LEGACY_WATER_POSITION');previous=Object.freeze(position.map(Math.fround));},
  present(requested,mapId,position,camera,center,nativeGate=0){const result=owner.consume(requested,mapId,position,camera,center,nativeGate);owner.savePosition(position);return result;},
  copyState(){active();return Object.freeze({phase,amplitude,lastMap,previous,updates,passes});},
  close(){closed=true;phase=amplitude=lastMap=0;previous=Object.freeze([0,0]);},
 });owners.add(owner);return owner;
}

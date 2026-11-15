/** Source draw queue before image acquisition. Own immutable numeric descriptors, never substitute pixels. */
import { assetFail,assetFields,assetList,assetInteger } from './legacy-game-resource-values.mjs';
import {snapshotLegacyGameTextBatch} from './legacy-game-text.mjs';
import {snapshotLegacyGameBattlePalette} from './legacy-game-battle-palette.mjs';
import {snapshotLegacyGameWater} from './legacy-game-water.mjs';
export const LEGACY_GAME_DRAW_PLAN_PROFILE=Object.freeze({id:'legacy-se6000-37c4-draw-plan-v1',commands:4096,pixels:4194304});
const pair=(value,read)=>{const a=assetList(value,2);if(a.length!==2)assetFail('LEGACY_ASSET_PAIR');return Object.freeze(a.map(read));};
function command(value){
 if(value&&Object.hasOwn(value,'waterStrip')){
  const r=assetFields(value,['waterStrip','priority']);r.waterStrip=snapshotLegacyGameWater(r.waterStrip);assetInteger(r.priority,2,2);return Object.freeze(r);
 }
 if(value&&Object.hasOwn(value,'rainDrop')){
  const r=assetFields(value,['rainDrop','x','y','priority']);
  if(r.rainDrop!==true)assetFail('LEGACY_ASSET_RAIN_DROP');
  assetInteger(r.x,0,635);assetInteger(r.y,0,467);assetInteger(r.priority,20,20);
  return Object.freeze(r);
 }
 if(value&&Object.hasOwn(value,'blackRectangle')){
  const r=assetFields(value,['blackRectangle','x','y','priority']);
  r.blackRectangle=pair(r.blackRectangle,n=>assetInteger(n,1,4194304));
  assetInteger(r.x,-2147483648,2147483647);assetInteger(r.y,-2147483648,2147483647);assetInteger(r.priority,0,255);
  return Object.freeze(r);
 }
 const r=assetFields(value,['image','x','y','priority'],['flip','originX','originY','sourceRectangle','expectedDimensions','coordinateMode','scale','opacity']),q=assetFields(r.image,['index','paletteSelector','flags','color']);
 if(Object.hasOwn(r,'coordinateMode')&&r.coordinateMode!=='int32')assetFail('LEGACY_ASSET_COORDINATE_MODE');
 if(!Object.hasOwn(r,'flip'))r.flip=0;
 assetInteger(q.index,1000,849999);assetInteger(q.paletteSelector,0,65535);assetInteger(q.flags,0,255);assetInteger(q.color);
 if((q.flags&~15)!==0)assetFail('LEGACY_ASSET_DRAW_STYLE');r.image=Object.freeze(q);
 assetInteger(r.x,-2147483648,2147483647);assetInteger(r.y,-2147483648,2147483647);assetInteger(r.priority,0,255);assetInteger(r.flip,0,3);
 for(const k of ['originX','originY'])if(Object.hasOwn(r,k))assetInteger(r[k],-32768,32767);
 if(r.sourceRectangle!==undefined){const a=assetList(r.sourceRectangle,4);if(a.length!==4)assetFail('LEGACY_ASSET_RECTANGLE');r.sourceRectangle=Object.freeze(a.map(n=>assetInteger(n,-32768,32767)));}
 if(r.expectedDimensions!==undefined)r.expectedDimensions=pair(r.expectedDimensions,n=>assetInteger(n,1,32767));
 if(Object.hasOwn(r,'opacity'))assetInteger(r.opacity,0,255);
 if(r.scale!==undefined)r.scale=pair(r.scale,n=>{if(typeof n!=='number'||!Number.isFinite(n)||n<0||!Number.isFinite(Math.fround(n)))assetFail('LEGACY_ASSET_SCALE');return Math.fround(n);});return Object.freeze(r);
}
export function createLegacyGameDrawPlan(width,height,commands,textValue=undefined,paletteValue=undefined){
 assetInteger(width,1,4194304);assetInteger(height,1,Math.floor(4194304/width));
 const text=textValue===undefined?undefined:snapshotLegacyGameTextBatch(textValue);
 const palette=paletteValue===undefined?undefined:snapshotLegacyGameBattlePalette(paletteValue);
 const rows=Object.freeze(assetList(commands,text?.runs.length?4095:4096).map(command));
 const order=Object.freeze(rows.map((_,i)=>i).sort((a,b)=>rows[a].priority-rows[b].priority||b-a));
 return Object.freeze({profile:LEGACY_GAME_DRAW_PLAN_PROFILE.id,width,height,commands:rows,drawOrder:order,rasterOperations:null,...(text?{text}:{}),...(palette?{palette}:{})});
}
export function snapshotLegacyGameDrawPlan(value){const r=assetFields(value,['profile','width','height','commands','drawOrder','rasterOperations'],['text','palette']);if(r.profile!==LEGACY_GAME_DRAW_PLAN_PROFILE.id||r.rasterOperations!==null)assetFail('LEGACY_ASSET_DRAW_PLAN');const p=createLegacyGameDrawPlan(r.width,r.height,r.commands,r.text,r.palette),order=assetList(r.drawOrder,4096);if(order.length!==p.drawOrder.length||order.some((n,i)=>n!==p.drawOrder[i]))assetFail('LEGACY_ASSET_DRAW_ORDER');return p;}

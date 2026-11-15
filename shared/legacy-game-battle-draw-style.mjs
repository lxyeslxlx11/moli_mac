/** Fixed37c4 final actor queue style; object308 andanimation305 are independent. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
export const LEGACY_GAME_BATTLE_DRAW_STYLE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-draw-style-v1',
 sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',queueProducer:'0x506e80'});
function fields(value,required,optional=[]){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_BATTLE_DRAW_STYLE_FIELDS');}const keys=Reflect.ownKeys(d);
 if(required.some(k=>!Object.hasOwn(d,k))||keys.some(k=>!required.includes(k)&&!optional.includes(k)||!Object.hasOwn(d[k],'value')))fail('LEGACY_BATTLE_DRAW_STYLE_FIELDS');
 return Object.fromEntries(keys.map(k=>[k,d[k].value]));}
function int(value,high){if(!Number.isInteger(value)||value<0||value>high)fail('LEGACY_BATTLE_DRAW_STYLE_INTEGER');return value;}
export function legacyGameBattleDrawStyle(value){
 const r=fields(value,['drawFlags','color','paletteSelector','actorFlags','drawFlagMask','drawFlagValue'],['drawColorOverride']);
 for(const k of ['drawFlags','drawFlagMask','drawFlagValue'])int(r[k],255);for(const k of ['color','actorFlags'])int(r[k],0xffffffff);int(r.paletteSelector,65535);
 let color=r.color;
 if(Object.hasOwn(r,'drawColorOverride')){const q=fields(r.drawColorOverride,['mask','color']);int(q.mask,255);int(q.color,0xffffffff);
  const mask=((q.mask&1?0xff0000:0)|(q.mask&2?0xff00:0)|(q.mask&4?0xff:0)|(q.mask&8?0xff000000:0))>>>0;
  color=((color&~mask)|(q.color&mask))>>>0;
 }
 const flags=(r.drawFlags&~r.drawFlagMask)|(r.drawFlagValue&r.drawFlagMask);
 if(r.actorFlags&0x100000)color=((color&0xffffff)|0x80000000)>>>0;
 return Object.freeze({flags,color,paletteSelector:r.paletteSelector});
}

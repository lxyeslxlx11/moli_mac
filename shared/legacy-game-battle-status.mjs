/** Fixed37c4 PSN queue and logical signed values. Native storage encoding stays outside this port. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
export const LEGACY_GAME_BATTLE_STATUS_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-battle-status-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  selectors:Object.freeze([0,1,2]),numericStyles:Object.freeze([6,5,3]),HPHealLevels:10,completeStatusAndRID:false,
});
const unavailable=reason=>Object.freeze({kind:'status-unavailable',reason});
export function planBattleStatus(command,body){
  let d,fields;try{d=Object.getOwnPropertyDescriptors(command);if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value')))return unavailable('status-numeric-fields');
    if(d.index.value!==9||d.attachedRID.value)return unavailable('status-RID-dependency');if(!Array.isArray(d.fields.value))return unavailable('status-numeric-fields');fields=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return unavailable('status-numeric-fields');}
  if(fields.length.value!==5||Reflect.ownKeys(fields).length!==6)return unavailable('status-numeric-fields');const values=[];
  for(let i=0;i<5;i++){const f=fields[i];if(!Object.hasOwn(f??{},'value')||!Number.isInteger(f.value)||f.value< -2147483648||f.value>2147483647)return unavailable('status-numeric-fields');values.push(f.value);}
  const [selector,level,rawSlot,rawFlags,amount]=values,slot=rawSlot===50?20:rawSlot===51?21:rawSlot,flags=rawFlags>>>0;
  if(slot<0||slot>=22)return unavailable('status-body-slot');const b=body(slot);if(!b)return Object.freeze({kind:'status-absent',principal:slot});
  if(!LEGACY_GAME_BATTLE_STATUS_PROFILE.selectors.includes(selector))return unavailable('status-selector');
  if(selector===1&&(level<0||level>9))return unavailable('status-heal-level');
  if(!b.vitals)return unavailable('status-C-vitals-required');
  if(b.unmodeledCharacterMask||b.linkedResources.some(Boolean)||b.scale.some(n=>n!==1))return unavailable('status-character-branch');
  const actions=selector===0?[78,154,30,...(flags&0x20?[44,45]:[])]:selector===1?[129,155]:[78,155];
  return Object.freeze({kind:'status-plan',principal:slot,selector,level,flags,amount,style:[6,5,3][selector],
    effect:selector===0?0x111:selector===2?0x112:null,actions:Object.freeze(actions)});
}
export function battleStatusVital(vitals,style,amount){
  if(!Array.isArray(vitals)||vitals.length!==4||vitals.some(n=>!Number.isInteger(n)||n< -2147483648||n>2147483647))fail('LEGACY_BATTLE_SKILL_VITALS_REQUIRED');
  if(![3,4,5,6].includes(style)||!Number.isInteger(amount)||amount< -2147483648||amount>2147483647)fail('LEGACY_BATTLE_INTEGER');
  const index=style===3||style===4?2:0,adds=style===4||style===5,before=vitals[index],
    raw=adds?(before+amount)|0:(before-amount)|0,value=adds?Math.min(raw,vitals[index+1]):Math.max(0,raw);
  return Object.freeze({index,before,value});
}

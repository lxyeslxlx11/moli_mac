/** Source CBC logical assignment and parent-driven linked object projections. */
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_CHARACTER_CHANGE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-character-change-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',token:'CBC',fields:8,immediateCompletion:true,linkedCallbacks:Object.freeze(['0x422a40','0x422a60','0x423070']),completeCharacterChanges:false});
const unavailable=reason=>Object.freeze({kind:'character-change-unavailable',reason});
export function planBattleCharacterChange(command,get,resourceCode){let d,f;try{d=Object.getOwnPropertyDescriptors(command);if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==17||d.attachedRID.value||!Array.isArray(d.fields.value))return unavailable('character-change-fields');f=Object.getOwnPropertyDescriptors(d.fields.value);}catch{return unavailable('character-change-fields');}
 if(f.length.value!==8||Reflect.ownKeys(f).length!==9)return unavailable('character-change-fields');const v=[];for(let i=0;i<8;i++){if(!Object.hasOwn(f[i]??{},'value')||!Number.isInteger(f[i].value)||f[i].value< -2147483648||f[i].value>2147483647)return unavailable('character-change-fields');v.push(f[i].value);}
 const slot=v[0]===50?20:v[0]===51?21:v[0];if(slot<0||slot>21)return unavailable('character-change-slot');const b=get(slot);if(!b)return Object.freeze({kind:'character-change-absent',principal:slot});if(b.unmodeledCharacterMask||b.scale.some(n=>n!==1))return unavailable('character-change-character-branch');
 return Object.freeze({kind:'character-change-plan',principal:slot,resourceId:classifyLegacyGameActorResource(v[1])===0?v[1]:resolveLegacyGameActorResource(v[1],resourceCode),vitals:Object.freeze(v.slice(2,6)),riderResource:v[6],attachmentResource:v[7]});
}
export function battleLinkedAction(kind,parentAction,parentState,actorFlags,dynamicFlags){let action=kind==='rider'?({1:1,2:3,3:3,4:3,5:5,6:5,8:8,9:9,10:8}[parentAction]??0):parentAction===8?3:0;
 const advance=parentState!==0||!(dynamicFlags&0x60)&&(action!==0||!!(actorFlags&0x40));if(parentState===0)action=0;return{action,advance};
}
export const battleLinkedFlags=(child,parent,hidden=0)=>((child&0xffea7ffd)|0x820000|(parent&0x118000)|(parent&0x40002)|hidden)>>>0;

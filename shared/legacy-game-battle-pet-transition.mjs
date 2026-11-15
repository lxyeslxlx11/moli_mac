/** Fixed37c4 MON record plan. The third word stays opaque; received roster modes remain authoritative. */
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
import{pairedBattleSlot}from'./legacy-game-battle-change.mjs';
import{battleFriendMetadata,classifyBattleFriend}from'./legacy-game-battle-friends.mjs';
export const LEGACY_GAME_BATTLE_PET_TRANSITION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-pet-transition-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',token:'MON',bodyTypes:Object.freeze([39,51,52,65,218]),completePetGameplay:false,originalBackendPixelsVerified:false});
const unavailable=reason=>Object.freeze({kind:'pet-transition-unavailable',reason});
export function planBattlePetTransition(command,localSlot,resourceCode,matchFriend=null){if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21||!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff||matchFriend!==null&&typeof matchFriend!=='function')return unavailable('pet-transition-context');let d,f;try{d=Object.getOwnPropertyDescriptors(command);if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==5||d.attachedRID.value||!Array.isArray(d.fields.value))return unavailable('pet-transition-fields');f=Object.getOwnPropertyDescriptors(d.fields.value);}catch{return unavailable('pet-transition-fields');}
 const n=f.length.value;if(![3,11].includes(n)||Reflect.ownKeys(f).length!==n+1)return unavailable('pet-transition-fields');const v=[];
 for(let i=0;i<n;i++){if(!Object.hasOwn(f[i]??{},'value'))return unavailable('pet-transition-fields');const value=f[i].value;if(i===3){if(!(value instanceof Uint8Array)||value.length>28)return unavailable('pet-transition-name');v.push(value.slice());}else{if(!Number.isInteger(value)||value< -2147483648||value>2147483647)return unavailable('pet-transition-fields');v.push(value);}}
 if((v[1]===0)!==(n===3))return unavailable('pet-transition-fields');const principal=v[0]===50?20:v[0]===51?21:v[0],paired=pairedBattleSlot(principal);if(principal<0||principal>=20||paired<0||paired>=20){v[3]?.fill?.(0);return unavailable('pet-transition-slot');}
 const common={kind:'pet-transition-plan',principal,paired,mode:v[1],opaqueWord:v[2],resetActive:principal===localSlot&&(v[1]===0||v[2]!==-1)};
 if(v[1]===0)return Object.freeze(common);
 const statusMetadata=battleFriendMetadata(v[10]);
 const friend=classifyBattleFriend(paired,localSlot,v[3],statusMetadata,matchFriend);
 if(friend===null){v[3].fill(0);return unavailable('pet-transition-opposite-team-friend-roster');}
 return Object.freeze({...common,nameBytes:v[3],rawResourceId:v[4],resourceId:classifyLegacyGameActorResource(v[4])===0?v[4]:resolveLegacyGameActorResource(v[4],resourceCode),value1d0:v[5],vitals:Object.freeze(v.slice(6,10)),statusFlags:v[10]>>>0,savedFlags:Number(friend),statusMetadata:Object.freeze(statusMetadata)});
}

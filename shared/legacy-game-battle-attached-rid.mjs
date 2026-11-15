/** Fixed37c4 4236d0 attached RID0 records;separate from result RID3 metadata. */
import{battleAttachedRIDParts}from'./legacy-game-battle-motion.mjs';
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_ATTACHED_RID_PROFILE=Object.freeze({id:'legacy-se6000-37c4-attached-rid-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',producer:'0x4236d0',callback221:'0x40a120',fieldsPerRecord:21,integerBoxConstructionsPerRecord:8,completeAttachedRID:false,completeBattleGameplay:false});
const unavailable=reason=>Object.freeze({kind:'attached-rid-unavailable',reason}),slot=n=>n===50?20:n===51?21:n;
const copyName=b=>Reflect.apply(Uint8Array.prototype.slice,b,[]);
export function planBattleAttachedRID(command,get,localSlot,resourceCode){
 const parts=battleAttachedRIDParts(command);if(!parts)return unavailable('attached-rid-source-context');
 if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return unavailable('attached-rid-local-context');
 const fields=parts.fields;if(fields.length===0||fields.length%21)return unavailable('attached-rid-fields');
 const records=[];let problem=null;
 const resource=n=>{if(classifyLegacyGameActorResource(n)===0)return n;if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff){problem='attached-rid-resource-context';return n;}return resolveLegacyGameActorResource(n,resourceCode);};
 for(let at=0;at<fields.length;at+=21){const v=fields.slice(at,at+21);
  if(v.some((n,i)=>i!==4&&i!==13&&(!Number.isInteger(n)||n< -2147483648||n>2147483647)))return unavailable('attached-rid-fields');
  const a=slot(v[1]),b=slot(v[2]),flagsA=v[12]>>>0,flagsB=v[20]>>>0;
  if(v[0]!==0||a<0||a>21||b<0||b>21||!((flagsA|flagsB)&2))return unavailable('attached-rid-fields');
  const parent=get(a);if(!parent)return unavailable('attached-rid-source-body-absent');
  if(parent.unmodeledCharacterMask||((flagsA|flagsB)&~0x1f001fff))return unavailable('attached-rid-character-dependency');
  let nameA,nameB;try{nameA=copyName(v[4]);nameB=copyName(v[13]);}catch{return unavailable('attached-rid-name');}
  const first=Object.freeze({slot:a,name:nameA,resourceId:resource(v[5]),attachmentResource:resource(v[6]),value1d0:v[7],vitals:Object.freeze(v.slice(8,12)),flags:flagsA}),second=Object.freeze({slot:b,name:nameB,resourceId:resource(v[14]),value1d0:v[15],vitals:Object.freeze(v.slice(16,20)),flags:flagsB});
  records.push(Object.freeze({first,second,ignored:v[3],tuple:Object.freeze([a,0,a,b])}));
 }if(problem)return unavailable(problem);
 return Object.freeze({kind:'attached-rid-plan',core:parts.core,records:Object.freeze(records),primaryEnd:parts.primaryEnd,localSlot});
}

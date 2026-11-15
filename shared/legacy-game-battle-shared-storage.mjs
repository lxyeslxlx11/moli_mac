/** Fixed37c4 item and SKL263 producers. */
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
const unavailable=reason=>Object.freeze({kind:'shared-storage-unavailable',reason}),slot=n=>n===50?20:n===51?21:n;
export const ITEM_RECOVERY_EFFECT=0x1ae08;
export function planBattleSharedStorage(command,get,resourceCode){
 let d,fd;try{d=Object.getOwnPropertyDescriptors(command);fd=Object.getOwnPropertyDescriptors(d.fields.value);}catch{return unavailable('shared-fields');}
 if(d.attachedRID?.value!==0||!Array.isArray(d.fields?.value)||Reflect.ownKeys(fd).length!==fd.length.value+1)return unavailable('shared-fields');
 const v=[];for(let i=0;i<fd.length.value;i++){const x=fd[i];if(!Object.hasOwn(x??{},'value')||!Number.isInteger(x.value)||x.value< -2147483648||x.value>2147483647)return unavailable('shared-fields');v.push(x.value);}
 const item=d.index?.value===7?v[0]:null;
 const recovery=item===0&&v.length>=4&&v.length%2===0&&v.at(-1)===255;
 const capture=item===6&&v.length===4,animation=item===7&&v.length===2;
 const shape=d.index?.value===0&&v.length===6&&Math.trunc(v[0]/100)===263;
 if(!recovery&&!capture&&!animation&&!shape)return unavailable('shared-producer');
 const principal=slot(v[shape?2:1]),target=slot(shape?v[3]:capture?v[2]:-1);
 if(principal<0||principal>21||target< -1||target>21||capture&&target<0)return unavailable('shared-slots');
 const actor=get(principal),victim=capture?get(target):null;
 if(!actor||capture&&!victim)return Object.freeze({kind:'shared-storage-skip',principal});
 if(actor.unmodeledCharacterMask||victim?.unmodeledCharacterMask)return unavailable('shared-character-context');
 const rows=new Map(),r=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{}});return rows.get(s);},act=(s,...a)=>r(s).actions.push(...a),put=(s,...t)=>r(s).tuples.push(t);
 const resources=[];
 if(recovery){
  act(principal,24,38,134,69);
  resources.push(0x1ae18);
  for(let i=3;i<v.length-1;i+=2){
   const recipient=slot(v[i]),body=get(recipient);
   if(!body?.vitals||body.unmodeledCharacterMask)return unavailable('item-recovery-target');
   put(principal,recipient,0,0,0);
   act(recipient,146,155);
   Object.assign(r(recipient).assignments,{skillLevel:0,numberStyle:5,numberValue:v[i+1]});
  }
  put(principal,-1,0,0,0);
  if(v.length>4)resources.push(ITEM_RECOVERY_EFFECT);
 }else if(animation){
  act(principal,78,200,36,35);
  r(principal).assignments.effectResource=0x1b6;
 }else if(capture){act(principal,24,38,134,71,0);put(principal,target,0,0,0);act(target,0,150,151,152,71,72);put(target,principal,0,0,0);r(target).assignments.numberStyle=v[3];
  act(principal,66,...(v[3]===1?[55,55,55]:[56,56]),72);r(principal).assignments.messageResource=v[3]===1?0x70d0:0x573d;if(v[3]===1)act(target,49);resources.push(0x1ae0f,0x1ae11,0x1ae18,r(principal).assignments.messageResource);
 }else{let resource=v[4];if(classifyLegacyGameActorResource(resource)!==0){if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)return unavailable('shared-resource-context');resource=resolveLegacyGameActorResource(resource,resourceCode);}act(principal,24,53,38,213,72);put(principal,target,0,0,resource);Object.assign(r(principal).assignments,{classCode:263,skillLevel:v[0]%100,mpCost:v[1]});resources.push(resource,0x1af87);}
 return Object.freeze({kind:'shared-storage-plan',producer:shape?'SKL263':'ITM'+item,principal,target,resources:Object.freeze(resources),rows:Object.freeze([...rows.values()].map(x=>Object.freeze({...x,actions:Object.freeze(x.actions),tuples:Object.freeze(x.tuples.map(Object.freeze)),assignments:Object.freeze(x.assignments)})))});
}

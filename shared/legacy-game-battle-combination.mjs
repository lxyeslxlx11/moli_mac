/** Fixed37c4 opcode8 CMB:one target,ordered cooperative attackers,source cumulative tuples. */
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_COMBINATION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-combination-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',opcode:8,phases:4,maximumNonoverlappingMembers:20,completeNativeCombination:false,completeBattleGameplay:false});
const bad=reason=>Object.freeze({kind:'combination-unavailable',reason}),slot=n=>n===50?20:n===51?21:n;
export function planBattleCombination(command,get,localSlot,resourceCode){
 let d;try{d=Object.getOwnPropertyDescriptors(command);}catch{return bad('combination-fields');}
 if(d.index?.value!==8||d.attachedRID?.value!==0||!Array.isArray(d.fields?.value))return bad('combination-fields');
 const v=d.fields.value,ds=Object.getOwnPropertyDescriptors(v),values=[];for(let i=0;i<v.length;i++){const n=ds[i]?.value;if(!Object.hasOwn(ds[i]??{},'value')||!Number.isInteger(n)||n< -2147483648||n>2147483647)return bad('combination-fields');values.push(n);}
 if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return bad('combination-local-context');
 let at=0,problem=null;const number=()=>at<values.length?values[at++]:(problem='combination-fields',0),readSlot=()=>slot(number()),target=readSlot();if(target<0||target>21||!get(target))return bad('combination-target-context');
 const rows=new Map(),hits=[],order=[];let aggregate=0,scratch=null,terminated=false;
 const row=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{},unknownFourthCells:[]});return rows.get(s);},act=(s,...a)=>row(s).actions.push(...a),put=(s,t)=>{if(t[3]===null){row(s).unknownFourthCells.push(row(s).tuples.length);t[3]=0;}row(s).tuples.push(t);};
 const resource=n=>{if(classifyLegacyGameActorResource(n)===0)return n;if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff){problem='combination-resource-context';return n;}return resolveLegacyGameActorResource(n,resourceCode);};
 act(target,0);
 for(let i=0;i<1024&&!problem;i++){const actor=readSlot();if(actor===255){terminated=true;break;}if(actor<0||actor>21||!get(actor))return bad('combination-member-context');if(get(actor).unmodeledCharacterMask||get(target).unmodeledCharacterMask)return bad('combination-character-context');
  const flags=number()>>>0,amount=number(),rid=flags&0x800000?[resource(number()),resource(number()),resource(number())]:null;if(rid)scratch=rid[0];if(!(flags&0xe000))aggregate=(aggregate+amount)|0;const value=flags&0xe000?amount:aggregate;
  const r=row(actor);r.assignments.classCode=-1;r.assignments.physicalFamily=1;const original=[target,flags|0,value,scratch];put(actor,original.slice());order.push(actor);hits.push({actor,target,flags,amount,value,rid});act(actor,24,7,9,10,70,0);
  if(rid){put(actor,[target,flags|0,rid[0],rid[1]]);put(actor,[target,flags|0,rid[2],0]);put(actor,original.slice());}act(actor,14);if(!(flags&0xe000))r.assignments.cooperativePending=1;
  if(!(flags&0x40)){if(amount!==0&&(flags&3)){if(flags&0x8000)act(target,127,0);else if(flags&0x4000)act(target,126,0);else if(flags&0x2000){act(actor,flags&2?160:26);act(target,125,0);}}}
  else if((flags&3)&&(flags&0x2000)){act(actor,32);act(target,125,0);act(actor,actor===localSlot?244:50,...(actor===localSlot?[]:[49]));}
  act(actor,...(!(flags&0x20)||!(flags&0x2000)?[7,11,10]:[11,44]));
 }
 if(problem)return bad(problem);if(!terminated||at!==values.length)return bad('combination-fields');if(order.length===0)return bad('combination-empty-scratch-context');if(order.length>20)return bad('combination-native-layout-overlap');
 const last=hits.at(-1),flags=last.flags,amount=last.amount,lastActor=last.actor;row(lastActor).assignments.cooperativePending=0;
 if(!(flags&0xe000)){
  if(!(flags&0x40)){if(amount!==0){if(flags&3)act(target,flags&2?160:26);if(!(flags&0x4000)&&(!(flags&0x2000)?target!==lastActor:target===lastActor))act(target,11);}else if(flags&8){if(!(flags&0x4000)&&(!(flags&0x2000)?target!==lastActor:target===lastActor))act(target,11);}}
  else{if(flags&3){act(target,32);if(!(flags&0x2000))act(target,target===localSlot?244:50,...(target===localSlot?[]:[49]));else act(lastActor,lastActor===localSlot?244:50,...(lastActor===localSlot?[]:[49]));}
   if(amount!==0||flags&8){if(!(flags&0x4000)&&(!(flags&0x2000)?target!==lastActor:target===lastActor))act(target,11);}}
  if(flags&0x20){if(!(flags&0x2000)?target!==lastActor:target===lastActor)act(target,44);}
 }else{const r=row(target),previous=r.actions.length-2;r.actions=r.actions.slice(0,previous+1);r.actions.push(-1);}
 return Object.freeze({kind:'combination-plan',principal:target,rows:Object.freeze([...rows.values()].map(r=>Object.freeze({...r,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments),unknownFourthCells:Object.freeze(r.unknownFourthCells)}))),hits:Object.freeze(hits.map(Object.freeze)),order:Object.freeze(order),aggregate,lastFlags:flags,lastActor,lastAmount:amount,opaqueFourthPolicy:'unknown native stack scratch is explicitly tagged;portable zero storage is not original-byte evidence'});
}

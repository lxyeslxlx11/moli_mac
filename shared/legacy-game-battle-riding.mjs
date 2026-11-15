/** Fixed37c4 standalone RID/opcode22. This is distinct from following dead RID0 records. */
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
const unavailable=reason=>Object.freeze({kind:'riding-unavailable',reason}),slot=n=>n===50?20:n===51?21:n;
export const LEGACY_GAME_BATTLE_RIDING_PROFILE=Object.freeze({id:'legacy-se6000-37c4-riding-v1',opcode:22,sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',completeNativeRiding:false,completeBattleGameplay:false});
export function planBattleRiding(command,get,localSlot,resourceCode){
 let d;try{d=Object.getOwnPropertyDescriptors(command);}catch{return unavailable('riding-fields');}
 if(d.index?.value!==22||d.attachedRID?.value!==0||!Array.isArray(d.fields?.value))return unavailable('riding-fields');
 const input=d.fields.value,fd=Object.getOwnPropertyDescriptors(input),v=[],length=fd.length?.value;
 if(!Number.isInteger(length)||Reflect.ownKeys(fd).length!==length+1)return unavailable('riding-fields');
 for(let i=0;i<length;i++){if(!Object.hasOwn(fd[i]??{},'value'))return unavailable('riding-fields');v.push(fd[i].value);}
 if(v.length<4||!v.slice(0,4).every(n=>Number.isInteger(n)&&n>=-2147483648&&n<=2147483647))return unavailable('riding-fields');
 const variant=v[0],principal=slot(v[1]),target=slot(v[2]),flags=v[3]>>>0;
 if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return unavailable('riding-local-context');
 if(principal<0||principal>21||target<0||target>21)return unavailable('riding-slots');
 if(v.length!==(variant===0?21:flags&0x80000?13:4))return unavailable('riding-fields');
 let problem=null;const resource=n=>{if(!Number.isInteger(n)){problem='riding-fields';return 0;}if(classifyLegacyGameActorResource(n)===0)return n;if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff){problem='riding-resource-context';return n;}return resolveLegacyGameActorResource(n,resourceCode);};
 const record=(start,slot,extra)=>{let name;try{name=Reflect.apply(Uint8Array.prototype.slice,v[start],[]);}catch{problem='riding-name';return null;}
  if(name.length>28){problem='riding-name';return null;}const n=v.slice(start+1,start+(extra?9:8));if(n.some(x=>!Number.isInteger(x)||x< -2147483648||x>2147483647)){problem='riding-fields';return null;}
  const at=extra?3:2,bodyFlags=n.at(-1)>>>0;if(bodyFlags&~0x1f001fff)problem='riding-character-context';
  return Object.freeze({slot,name,resourceId:resource(n[0]),attachmentResource:extra?resource(n[1]):0,value1d0:n[extra?2:1],vitals:Object.freeze(n.slice(at,at+4)),flags:bodyFlags});};
 const first=variant===0||flags&0x80000?record(4,principal,true):null,second=variant===0?record(13,target,false):null;
 if(problem)return unavailable(problem);const body=get(principal);if(!body)return Object.freeze({kind:'riding-skip',reason:'source-principal-absent',principal,target});
 if(body.unmodeledCharacterMask)return unavailable('riding-character-context');
 if(variant!==0&&(flags&0x80000)&&!get(target))return Object.freeze({kind:'riding-skip',reason:'source-target-absent',principal,target});
 const mode=variant===0?'split':flags&0x80000?'merge':'return',rows=[Object.freeze({slot:principal,actions:Object.freeze(mode==='split'?[219]:mode==='merge'?[219,38]:[220,66,56,56]),tuples:Object.freeze([Object.freeze([principal,mode==='split'?0:1,principal,target])]),assignments:Object.freeze(mode==='return'?{messageResource:0x573b}:{})})];
 if(mode==='return'&&get(target)&&!(get(target).dynamicFlags&2))rows.push(Object.freeze({slot:target,actions:Object.freeze([66,63]),tuples:Object.freeze([]),assignments:Object.freeze({messageResource:0x573e})}));
 return Object.freeze({kind:'riding-plan',principal,target,variant,flags,mode,first,second,localSlot,rows:Object.freeze(rows)});
}

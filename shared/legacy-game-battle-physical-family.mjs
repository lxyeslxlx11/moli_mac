/** Fixed37c4 common physical records. Ordered plans preserve native actor and cursor ownership. */
import {buildPhysicalGuardPairs,isDirectPhysicalFollow} from './legacy-game-battle-physical-guard-plan.mjs';
import {buildPhysicalNestedPairs} from './legacy-game-battle-physical-nested-plan.mjs';
import {buildPhysicalSpecial96Pairs} from './legacy-game-battle-physical-special96-plan.mjs';
import {buildPhysicalChainPairs} from './legacy-game-battle-chain-plan.mjs';
import {battleMotionSourceLength,battlePhysicalLookAheadTail,battlePhysicalAbortReachesRID} from './legacy-game-battle-motion.mjs';
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE=Object.freeze({
 id:'legacy-se6000-37c4-physical-family-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
 classes:Object.freeze([0,1,3,5,6,72,73,75,76,77,78,79,80,81,84,85,87,94,95,96,105,110,113,257,258,259,260,262,266]),
 variants:Object.freeze([0,1,2,3]),completeProducer:false,completePlayback:false,completeSKL:false,completeBattleGameplay:false,
});
const classes=new Set(LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.classes),remap=n=>n===50?20:n===51?21:n;
const unavailable=reason=>Object.freeze({kind:'physical-family-unavailable',reason});
export const battlePhysicalEmptyIdleQueue=body=>!!body&&body.state===0&&!body.busy&&body.actionWrite===-1&&body.tupleWrite===0&&!(body.dynamicFlags&2);
const freezeRows=rows=>Object.freeze([...rows.values()].map(r=>Object.freeze({
 slot:r.slot,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments),
})));
function ordinaryGuardPrefix(hits,principal){
 const first=hits[0];
 if(!first?.nested||hits.length<2)return false;
 const ordinaryGuard=h=>h.guard!==null&&h.guard!==principal&&h.target!==principal&&h.guard!==h.target&&!(h.flags&~0x203);
 return ordinaryGuard(first)&&ordinaryGuard(first.nested);
}
function lateRecipients(hits,principal,get,mask){
 const first=hits[0],used=new Set([principal,first.target,first.guard,first.nested.target,first.nested.guard]);
 const attackHeads=new Set(),recipients=new Set();
 for(const h of hits.slice(1)){
  if(!used.has(h.actor))attackHeads.add(h.actor);
  if(attackHeads.has(h.target)&&(mask&(1<<h.target))&&battlePhysicalEmptyIdleQueue(get(h.target)))recipients.add(h.target);
  used.add(h.actor);
  used.add(h.target);
 }
 return recipients;
}
function idleAttackerSlots(rows,principal){
 // Only the principal is activated by 42988f. These heads have no
 // earlier or later tuple through which another body can advance them.
 const referenced=new Set();
 for(const row of rows.values())for(const tuple of row.tuples)referenced.add(tuple[0]);
 return [...rows.values()].filter(row=>row.slot!==principal&&row.actions[0]===24&&!referenced.has(row.slot)).map(row=>row.slot);
}
function fields(command){try{const d=Object.getOwnPropertyDescriptors(command);if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return null;
 const a=Object.getOwnPropertyDescriptors(d.fields.value),n=a.length.value;if(n<5||n>4096||Reflect.ownKeys(a).length!==n+1)return null;const values=[];
 for(let i=0;i<n;i++){const v=a[i];if(!Object.hasOwn(v??{},'value')||!Number.isInteger(v.value)||v.value< -2147483648||v.value>2147483647)return null;values.push(v.value);}return {values,attachedRID:d.attachedRID.value};
 }catch{return null;}}
export function planBattlePhysicalFamily(command,get,localSlot,resourceCode,recoverMissing=false){
 const source=fields(command);if(!source)return unavailable('physical-family-fields');if(source.attachedRID)return unavailable('physical-family-attached-RID-consumer');
 const v=source.values;let code=v[0];if(code>50000)for(const[from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
 const category=Math.trunc(code/100),level=code%10,variant=v[2];if(!classes.has(category)||level<0)return unavailable('physical-family-category');
 if(localSlot!==undefined&&(!Number.isInteger(localSlot)||localSlot<0||localSlot>21))return unavailable('physical-family-local-context');
 const pairMode=category===72||category===113||variant===0;if(!pairMode&&(variant<1||variant>3))return unavailable('physical-family-variant');
 const motionBound=battleMotionSourceLength(command)!==undefined;
 const recover=recoverMissing===true&&motionBound;
 let at=3,problem=null,missing=null;const number=()=>at<v.length?v[at++]:((problem??='physical-family-record-boundary'),0);
 const requireBody=(s,role,point)=>{
  if(get(s))return;
  if(recover&&point)missing=Object.freeze({slot:s,role,point});
  else problem??='physical-family-actor-absent';
 };
 const slot=(role,point,resolve=true)=>{
  const s=remap(number());
  if(s===255&&role!=='guard')return s;
  if(s<0||s>21)problem??='physical-family-actor-absent';
  else if(resolve)requireBody(s,role,point);
  return s;
 };
 const resource=()=>{const n=number();if(classifyLegacyGameActorResource(n)===0)return n;if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff){problem??='physical-family-resource-context';return n;}return resolveLegacyGameActorResource(n,resourceCode);};
 const result=(actor,target,kind,guardPoint='pair-guard')=>{const flags=number()>>>0,amount=number(),extra=kind===81?number():null,resources=flags&0x800000?[resource(),resource(),resource()]:null;
  const hit={actor,target,flags,amount,resources,extra,guard:null,nested:null};
  if((flags&0x200)&&guardPoint)hit.guard=slot('guard',guardPoint,pairMode);
  return hit;
 };
 const hits=[],ends=new WeakMap();let principal=-1,terminated=false,partialChain=null,savedSelf=null,selfResource=0;
 if(pairMode){let actor=slot('attacker','first-pair'),kind=category;principal=actor;
  if(missing&&!problem){
   const attachedRIDAfterAbort=category===72&&battlePhysicalAbortReachesRID(command,at);
   return Object.freeze({kind:'physical-family-absent',principal,...(attachedRIDAfterAbort?{missing,attachedRIDAfterAbort}:{})});
  }
  for(let count=0;count<1024&&!problem&&!missing;count++){
   if(actor===255){terminated=true;break;}
   const target=slot('target',hits.length?'later-pair':'first-pair');
   if(missing||problem)break;
   if(target===255){problem??='physical-family-target';break;}
   const h=result(actor,target,kind);
   if(missing||problem)break;
   if(kind===260&&(h.flags&0x80000)){
    const chainTarget=slot('target','chain-target');
    if(missing){partialChain=h;break;}
    if(chainTarget===255){h.nested={target:255};ends.set(h,at);hits.push(h);terminated=true;break;}
    h.nested=result(actor,chainTarget,-1,'chain-guard');
   }
   else if(kind===94)h.extra=number();
   else if((kind===72||kind===113)&&(h.flags&1)){
    const target=slot('target','nested-target',false);
    if(target===255){problem??='physical-family-nested-target';break;}
    h.nested=result(actor,target,-1,'nested-guard');
    if(!missing&&!problem)requireBody(target,'target','nested-target');
   }
   if(missing||problem)break;
   ends.set(h,at);hits.push(h);actor=slot('attacker','later-pair');kind=-1;
  }
 }else{
  principal=slot('caster','positive-entry');
  for(let count=0;count<1024&&!problem&&!missing;count++){
   const target=slot('target','target-list');if(missing||problem)break;
   if(target===255){terminated=true;break;}
   const self=category!==73&&target===principal;
   const hit=result(principal,target,-1,self?'saved-self-guard':null);
   if(self){savedSelf=hit;if(hit.resources)selfResource=hit.resources[0];}
   hits.push(hit);
  }
 }
 // The parser reserves every self guard. The producer dereferences only the
 // guard on the last saved self result in the SKL266 variant 2 tail.
 const savedGuard=!pairMode&&category===266&&variant===2?savedSelf?.guard??null:null;
 if(!problem&&savedGuard!==null)requireBody(savedGuard,'guard','saved-self-guard');
 if(problem)return unavailable(problem);
 if(missing&&(missing.role==='guard'||missing.role==='caster'||missing.point==='nested-target'))
  return Object.freeze({kind:'physical-family-unbound',category,variant,principal,missing});
 if(hits.some(h=>(h.flags&0x40)&&!(h.flags&0x108)||h.nested?.flags&0x40)&&localSlot===undefined)return unavailable('physical-family-local-context');
 // 435000 can read a longer SKL113 record than the producer at 424310.
 // Only a decoded M command owns the additional preflight fields.
 const producerFieldCount=motionBound&&category===113&&hits[0]?.nested&&terminated&&at<v.length?at:undefined;
 if(!missing&&(!terminated||at!==v.length&&producerFieldCount===undefined))return unavailable('physical-family-record-boundary');
 if(principal===255||pairMode&&!hits.length&&!missing)return unavailable('physical-family-empty-runtime-unobserved');
 const participants=new Set([principal]);
 for(const h of partialChain?[...hits,partialChain]:hits){
  participants.add(h.actor);participants.add(h.target);
  if(pairMode&&h.guard!==null)participants.add(h.guard);
  if(h.nested&&h.nested.target!==255){participants.add(h.nested.target);if(h.nested.guard!==null)participants.add(h.nested.guard);}
 }
 if(savedGuard!==null)participants.add(savedGuard);
 if([...participants].some(s=>!get(s)?.vitals||get(s).unmodeledCharacterMask))return unavailable('physical-family-character-dependency');
 // The complete parsed records remain available in the plan. Unported producer scripts reject before body mutation.
 if(hits.some(h=>h.nested)&&![72,113,260].includes(category))return unavailable('physical-family-guard-producer-pending');
 // Native consumers select their flag masks;retain the complete result word.
 // Role aliases still share the same body and tuple storage.
 const lateNestedTarget=[72,113].includes(category)&&missing?.point==='later-pair'&&missing.role==='target';
 const attachedRIDAfterAbort=category===72&&
  (missing?.point==='first-pair'||missing?.point==='later-pair')&&battlePhysicalAbortReachesRID(command,at);
 const cleanupMask=lateNestedTarget?command.dependencyMask:0;
 const guardPrefix=motionBound&&!missing&&category===72&&ordinaryGuardPrefix(hits,principal);
 const ordinary=guardPrefix&&hits.slice(1).every(h=>isDirectPhysicalFollow(h,principal));
 // Attached RID0 appends action 221 after the core queues are planned.
 const extendedFollowing=guardPrefix&&hits.slice(1).every(h=>isDirectPhysicalFollow(h,principal,true));
 const lateReceiveSlots=extendedFollowing?lateRecipients(hits,principal,get,command.dependencyMask):null;
 const prefixRows=new Map(),recoveryRows=new Map();
 let rows=prefixRows,guardHandoffs,followingStrikes;
 const row=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{}});return rows.get(s);};
 const act=(s,...a)=>row(s).actions.push(...a),put=(s,h)=>{const r=row(s),extra=h.resources?.[0]??0,t=[h.target,h.flags|0,h.amount,extra];r.tuples.push(t);if(h.resources)r.tuples.push([h.target,h.flags|0,h.resources[0],h.resources[1]],[h.target,h.flags|0,h.resources[2],0],[...t]);};
 const pack=()=>{
  const idle=ordinary?idleAttackerSlots(prefixRows,principal):[];
  return Object.freeze({kind:'physical-family-plan',category,level,variant,principal,cost:v[1],pairMode,
   hits:Object.freeze(hits.map(h=>Object.freeze({...h,resources:h.resources?Object.freeze(h.resources):null}))),
   rows:freezeRows(prefixRows),...(guardHandoffs?.length&&!missing?{guardHandoffs}:{}),
   ...(followingStrikes?.length&&!missing?{followingStrikes}:{}),
   ...(idle.length?{idleAttackerSlots:Object.freeze(idle)}:{}),
   ...(lateReceiveSlots?.size?{lateReceiveSlots:Object.freeze([...lateReceiveSlots])}:{}),
   ...(producerFieldCount===undefined?{}:{producerFieldCount}),
   ...(attachedRIDAfterAbort?{attachedRIDAfterAbort}:{}),
   ...(cleanupMask?{discardedPrefixMask:cleanupMask}:{}),
   ...(missing?{missing,activateAfterCleanup:true,recoveryRows:freezeRows(recoveryRows)}:{}),completeSKL:false});
 };
 const finishPair=(knocked,normalAction74=false,clampKnockout=true)=>{
  if(!missing){
   if(knocked){if(principal<20||!clampKnockout)act(principal,11,44);}
   else{if(principal<20)act(principal,7,11,10);if(normalAction74)act(principal,74);}
   return;
  }
  const firstSpecial=hits.length===1&&(category===257||category===262&&level===9);
  // 425f13 runs only after the next attacker exists and before its target lookup.
  if(firstSpecial&&missing.point==='later-pair'&&missing.role==='target')act(principal,74);
  const body=get(principal),levelRetained=!!(body.dynamicFlags&2)||body.state===13;
  rows=recoveryRows;
  if(principal<20)act(principal,...(knocked?[11,44]:[7,11,10]));
  // The 262 check re-reads the body level after 4347e0 normally cleared it.
  if(!knocked&&firstSpecial&&(category===257||levelRetained))act(principal,74);
  rows=prefixRows;
 };
 const scatter=s=>act(s,32,...(s===localSlot?[244]:[50,49]));
 const reaction=(h,kind)=>{act(h.target,0);if(!(h.flags&0x108)){
  if(h.flags&0x40){if(!pairMode||(h.flags&3))scatter(h.target);}
  else if((h.amount!==0||(pairMode&&kind===6))&&(h.flags&3)){
   if(!pairMode&&(h.flags&0xe000))act(h.target,h.flags&0x8000?121:h.flags&0x4000?120:119);
   else if(!(!pairMode&&kind!==73&&(h.flags&0x20000000)))act(h.target,!pairMode&&kind===95&&!(h.flags&0x20)?28:h.flags&2?160:26);
  }
 }
 if(h.amount!==0||(pairMode&&kind===6)||(h.flags&0x108)){
  if(pairMode){if(h.target!==principal)act(h.target,11);if(h.flags&0x100)act(h.target,74);}
  else if(!(h.flags&(kind===73?0xe000:0x2000e000))&&(!(kind===95)||h.flags&0x20)){act(h.target,11);if(kind!==95&&(h.flags&0x100))act(h.target,74);}
 }
 if((h.flags&0x20)&&(!pairMode||h.target!==principal))act(h.target,44);
 };
 const related=category===73&&!pairMode,principalRow=row(principal);
 const firstTargetMissing=missing?.point==='first-pair';
 if(!firstTargetMissing)Object.assign(principalRow.assignments,{classCode:category,skillLevel:level});
 if(!related){if(!firstTargetMissing)principalRow.assignments.mpCost=v[1];act(principal,38);}
 if(!related&&(pairMode?[0,1,3,5,6,72,75,76,77,78,79,80,81,84,85,87,94,96,113,257,258,259,260,262,266].includes(category):![94,96].includes(category)))act(principal,147);
 if(category===105){principalRow.assignments.afterImageEnabled=1;if(pairMode)act(principal,156);}
 if(pairMode&&(category===257||category===262&&level===9))act(principal,73);
 if(category===258){principalRow.assignments.rememberedPosition=Object.freeze([318,270]);act(principal,8,6,10);}
 if(firstTargetMissing)return pack();
 if(!pairMode&&level===9&&[258,259,266].includes(category)){principalRow.tuples.push([category===258?3:category===259?5:0,0,15,0]);act(principal,240);}
 if(!related)act(principal,53);
 if(pairMode&&category===260){
  const raw=(s,h)=>row(s).tuples.push([h.target,h.flags|0,h.amount,h.resources?.[0]??0]);
  const out=buildPhysicalChainPairs({category,level,principal,hits:partialChain?[partialChain]:hits,partialChain:!!partialChain,get,words:v,ends,localSlot,lookaheadTail:battlePhysicalLookAheadTail(command)},{row,act,raw});if(out.reason)return unavailable(out.reason);
  finishPair(out.knocked);
 }else if(pairMode&&category===96){
  const raw=(s,h)=>row(s).tuples.push([h.target,h.flags|0,h.amount,h.resources?.[0]??0]);
  const out=buildPhysicalSpecial96Pairs({category,level,principal,hits,get,words:v,ends,localSlot},{row,act,raw});if(out.reason)return unavailable(out.reason);
  finishPair(out.knocked);
 }else if(pairMode&&[72,113].includes(category)){
  const raw=(s,h)=>row(s).tuples.push([h.target,h.flags|0,h.amount,h.resources?.[0]??0]);
  const interruptedTarget=lateNestedTarget?missing.slot:undefined;
  const out=buildPhysicalNestedPairs({category,level,principal,hits,get,words:v,ends,localSlot,interruptedTarget,cleanupMask,lateReceiveSlots,extendedFollowing},{row,act,raw});if(out.reason)return unavailable(out.reason);
  ({handoffs:guardHandoffs,followingStrikes}=out);
  finishPair(out.knocked);
 }else if(pairMode&&[94,105,257,262].includes(category)){
  const raw=(s,h)=>row(s).tuples.push([h.target,h.flags|0,h.amount,h.resources?.[0]??0]);
  const out=buildPhysicalGuardPairs({category,level,principal,hits,get,words:v,ends,localSlot},{row,act,raw});if(out.reason)return unavailable(out.reason);
  finishPair(out.knocked,(category===257||category===262&&level===9)&&hits.length===1);
 }else if(!pairMode){
  principalRow.assignments.physicalVariant=variant;
  if(!hits.length&&!missing)principalRow.assignments.physicalFamily=1;
  // An empty result list produces no flight to release the caster's action 41.
  const waitForProjectile=missing!==null||hits.some(h=>related||h.target!==principal);
  act(principal,24,variant===3?18:15);
  if(variant===2){if(waitForProjectile)act(principal,41);if(related)act(principal,23);}
  let foreignResources=null;
  for(const h of hits){if(h.target===principal&&!related)continue;put(principal,h);reaction(h,category);if(h.flags&0xe000)row(h.target).assignments.physicalFamily=1;if(h.resources)foreignResources=h.resources;}
  if(!related){
   if(missing)rows=recoveryRows;
   const ending=row(principal);
   if(category===266&&variant===2&&savedSelf){
    // 42f8a5..42fd16 keeps only the last self record. Its RID tail comes from
    // the last foreign RID record,not from the two discarded self RID words.
    if(savedSelf.resources&&!foreignResources)return unavailable('physical-family-self-RID-prior-context');
    let flags=savedSelf.flags,recipient=principal;const amount=savedSelf.amount;
    // The same slot owns both roles. Keep one saved result without a second handoff.
    if(savedSelf.guard===principal)flags&=~0x200;
    ending.tuples.push([-1,flags|0,0,0]);act(principal,72);
    if(flags&0x200){
     if(missing)ending.assignments.physicalFamily=1;
     recipient=savedSelf.guard;const guarded=row(recipient);guarded.assignments.physicalFamily=1;
     const startWithoutFlight=!waitForProjectile;
     act(recipient,0);guarded.tuples.push([principal,flags|0,amount]);
     Object.assign(guarded.assignments,{pairedTarget:principal,effectResource:0xfc,messageResource:0x5748});
     act(recipient,39,78,67,34,73,7,4,42,71,10,74,62,24,71,72);
     // A distinct guard can take the saved result without waiting for a projectile.
     if(startWithoutFlight)act(principal,71);else act(recipient,0);
     act(principal,0,27,62,0,72);if(waitForProjectile)act(principal,41);flags&=~0x200;
     ending.tuples.push([recipient,flags|0,0,selfResource]);
    }
    act(principal,23);const r=row(recipient),packed=[recipient,flags|0,amount,selfResource];
    r.assignments.physicalFamily=1;r.tuples.push([principal,flags|0,amount,selfResource],packed);
    if(savedSelf.resources)r.tuples.push([recipient,flags|0,selfResource,foreignResources[1]],[recipient,flags|0,foreignResources[2],0],[...packed]);
    act(recipient,216);ending.tuples.push([-1,0,0]);act(principal,72);
    if(flags&0x40)scatter(recipient);
    else if(flags&0x8000)act(recipient,121);
    else if(flags&0x4000)act(recipient,120);
    else if(flags&0x2000)act(recipient,119);
    else if(amount!==0)act(recipient,flags&2?160:26,11);
    if(flags&0x20)act(recipient,44);
   }else{ending.tuples.push([-1,0,0,0]);act(principal,72,...(variant===2?[23]:[]));}
   rows=prefixRows;
  }
 }else if(category===73||hits.some(h=>h.guard!==null||h.flags&0xf010)){
  const raw=(s,h)=>row(s).tuples.push([h.target,h.flags|0,h.amount,h.resources?.[0]??0]);
  const out=buildPhysicalGuardPairs({category,level,principal,hits,get,words:v,ends,localSlot,lookaheadTail:category===73?battlePhysicalLookAheadTail(command):undefined},{row,act,raw});if(out.reason)return unavailable(out.reason);
  finishPair(out.knocked,category===262&&level===9&&hits.length===1,category===73);
 }else{let knocked=false;for(let i=0;i<hits.length;i++){const h=hits[i],kind=i===0?category:-1;row(h.actor).assignments.physicalFamily=1;if(kind===5)h.flags&=~4;
   act(h.actor,24);if(h.flags&0x1010)act(h.actor,3,113);else if(kind!==96)act(h.actor,...(i===0||h.actor!==principal?[7,kind===262?205:9,10]:kind===262?[205]:[3]));act(h.actor,242);put(h.actor,h);
   if([5,84,87].includes(kind)){row(principal).assignments.messageResource=kind===5?0x5745:kind===84?0x5747:0x5746;act(principal,66);}
   if(kind===259&&level===9){
    // 424310 first stores one raw record;72 skips it before240 consumes the tile.
    // RID metadata belongs to the re-appended result record,after the tile tuple.
    const r=row(h.actor),packed=r.tuples.splice(r.tuples.length-(h.resources?4:1));r.tuples.push([...packed[0]],[0,0,15],...packed);act(h.actor,72,240);
   }
   act(h.actor,14);reaction(h,kind);if(h.target===principal&&(h.flags&0x20))knocked=true;
   if(kind===81&&!(h.flags&0xc108)&&(!(h.flags&0x2000)||!(h.flags&0x20))){act(h.actor,62,78,155);Object.assign(row(h.actor).assignments,{effectResource:0x10f,numberValue:h.extra,numberStyle:5});}
   if(kind===262&&level===9&&i+1<hits.length)act(principal,74);
  }
  finishPair(knocked,category===257||category===262&&level===9&&hits.length===1,false);
 }
 for(const h of hits)row(h.actor).assignments.physicalFamily=1;
 return pack();
}

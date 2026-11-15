/** Fixed37c4 SKL status/utility queues; result flags never imply damage fields. */
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
import {pairedBattleSlot} from './legacy-game-battle-change.mjs';
import {battleMotionSourceLength} from './legacy-game-battle-motion.mjs';
import {appendBattleSkill82Result,LEGACY_GAME_BATTLE_SKILL82_PROFILE} from './legacy-game-battle-skill82.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_BATTLE_UPPER_SKILLS_PROFILE as upper,planBattleUpperSkill} from './legacy-game-battle-upper-skills.mjs';
const classes=Object.freeze([...Array.from({length:29},(_,i)=>32+i),64,65,66,67,68,86,88,98,99,100,101,102,103,104,...upper.classes]);
const variants98=Object.freeze(Array.from({length:15},(_,variant)=>variant));
const selfClasses=new Set([50,51,52,53,88]),tiers=Object.freeze([3,3,3,2,2,2,1,1,1,0]);
const assistMidpoint=Object.freeze([318,270]);
export const LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-status-skills-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classes,variants98,levels:10,fieldPosition:Object.freeze([318,270.5]),completeSKL:false,completeBattleGameplay:false,
});
const absent=reason=>Object.freeze({kind:'status-skill-unavailable',reason});
const slot=n=>n===50?20:n===51?21:n;

function planStatusPosition(hits,get,principal,localSlot,row,recoverMissing) {
  // Queue rows retain the starting body identity. Tuples address the live registry.
  const slotSources=Array.from({length:22},(_,index)=>index),swaps=[];
  let missingSlot=null;
  for(const {slot:fromSlot} of hits){
    const toSlot=pairedBattleSlot(fromSlot),mover=slotSources[fromSlot],partner=slotSources[toSlot];
    const movedBody=get(mover),pairedBody=get(partner);
    if(!movedBody){
      if(!recoverMissing)return absent('status-skill-target');
      missingSlot=fromSlot;
      break;
    }
    if(movedBody.unmodeledCharacterMask||!movedBody.vitals||
       pairedBody&&(pairedBody.unmodeledCharacterMask||!pairedBody.vitals))return absent('status-skill-character-dependency');
    if(localSlot===fromSlot)localSlot=toSlot;
    row(slotSources[principal]).tuples.push([toSlot,0,0,0]);
    if(principal===fromSlot)principal=toSlot;
    slotSources[fromSlot]=partner;
    slotSources[toSlot]=mover;

    const moved=row(mover),movePair=!!pairedBody&&pairedBody.state!==32;
    Object.assign(moved.assignments,{effectResource:0xd2,speed:3,speedPercent:100});
    moved.actions.push(78,11);
    if(movePair){
      row(slotSources[principal]).tuples.push([fromSlot,0,0,0]);
      const displaced=row(partner);
      Object.assign(displaced.assignments,{speed:3,speedPercent:100});
      displaced.actions.push(11);
    }
    swaps.push(Object.freeze({fromSlot,toSlot,movePair}));
  }
  if(missingSlot===null)row(slotSources[principal]).tuples.push([-1,0,0,0]);
  return Object.freeze({principal,localSlot,slotSources:Object.freeze(slotSources),swaps:Object.freeze(swaps),
    ...(missingSlot===null?{}:{missingSlot})});
}

function queueStatusAssist(variant,principal,assistSlot,localSlot,level,hits,row){
  const impact=variant===12,assist=row(assistSlot),depart=slot=>slot===localSlot?[244]:[50,49];
  row(principal).assignments.assistSlot=assistSlot;
  Object.assign(assist.assignments,{classCode:98,skillLevel:level,rememberedPosition:impact
    ?LEGACY_GAME_BATTLE_SKILL82_PROFILE.midpoints[assistSlot<10?0:1]:assistMidpoint});
  if(impact)assist.assignments.effectResource=0x120;
  assist.actions.push(...(impact?[147,8,6,10,78,83,34,89,84,35,87]:[8,6,10,62,133,88]),...depart(assistSlot));
  let extra=0;
  for(const hit of hits){
    const {slot,flags,amount}=hit,target=row(slot);
    Object.assign(target.assignments,{classCode:98,skillLevel:level});
    if(slot===principal)target.actions.push(0);
    if(impact){
      extra=appendBattleSkill82Result(assist.tuples,hit,extra);
      if(!(flags&0x108)){
        if(flags&0x40)target.actions.push(32,...depart(slot));
        else if(amount!==0&&(flags&3))target.actions.push(flags&2?160:26);
      }
      if(amount!==0||(flags&0x108))target.actions.push(11);
      if((flags&0x20)&&!(flags&0x10000))target.actions.push(44);
    }else{
      assist.tuples.push([slot,flags|0,amount,0]);
      Object.assign(target.assignments,{numberValue:amount,numberStyle:5});
      target.actions.push(146,155);
    }
  }
}

export function planBattleStatusSkill(command,get,localSlot,resourceCode,recoverMissing=false){
  let d,fd;try{d=Object.getOwnPropertyDescriptors(command);
    if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return absent('status-skill-fields');
    if(d.attachedRID.value)return absent('status-skill-attached-RID-consumer');fd=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return absent('status-skill-fields');}
  const n=fd.length.value;if(n<5||n>4096||Reflect.ownKeys(fd).length!==n+1)return absent('status-skill-fields');
  const v=[];for(let i=0;i<n;i++){const q=fd[i];if(!Object.hasOwn(q??{},'value')||!Number.isInteger(q.value)||q.value< -2147483648||q.value>2147483647)return absent('status-skill-fields');v.push(q.value);}
  let code=v[0];if(code>50000)for(const[from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
  const category=Math.trunc(code/100),level=code%10,grouped=category===98,modifier=category>=99&&category<=104;
  const variant=grouped?v[3]:null,principal=slot(v[grouped?4:3]);
  if(!classes.includes(category)||level<0)return absent('status-skill-category');
  if(upper.classes.includes(category))return planBattleUpperSkill(v,category,level,get,localSlot,recoverMissing===true);
  if(grouped&&!variants98.includes(variant))return absent('status-skill98-variant');
  if(!Number.isInteger(principal)||principal<0||principal>21)return absent('status-skill-actor-absent');
  const recover=recoverMissing===true;
  if(!get(principal))return grouped||recover?Object.freeze({kind:'status-skill-absent',principal}):absent('status-skill-actor-absent');
  const assisted=variant===12||variant===13;
  if((variant===7||variant===8||assisted)&&(!Number.isInteger(localSlot)||localSlot<0||localSlot>21))return absent('status-skill98-local-slot');
  const slotList=variant===6||variant===7||variant===8,pairedLocal=variant===8?pairedBattleSlot(localSlot):null;
  const self=selfClasses.has(category),hasExtra=category===68||grouped&&variant===11,hits=[];
  let at=grouped?5:4,terminated=false;
  const assistSlot=assisted?slot(v[at++]):null;
  if(assistSlot===255){
    if(!recover||battleMotionSourceLength(command)===undefined)return absent('status-skill-assist-slot');
    if(at!==n)return absent('status-skill-record-boundary');
    return Object.freeze({kind:'status-skill-assist-terminator',principal,category,level,variant,assistSlot,assistTerminator:true,
      hits:0,actors:Object.freeze([]),completeSKL:false});
  }
  if(assisted&&(!Number.isInteger(assistSlot)||assistSlot<0||assistSlot>21))return absent('status-skill-assist-slot');
  const missingAssist=assisted&&!get(assistSlot);
  if(missingAssist&&!recover)return absent('status-skill-assist-slot');
  let missingSlot=missingAssist?assistSlot:null;
  if(self){if(n!==5)return absent('status-skill-record-boundary');if(v[at]!==255)hits.push({slot:principal,flags:v[at]>>>0,extra:null});terminated=true;}
  else while(at<n){const target=slot(v[at++]);if(target===255){terminated=true;break;}
    if(target<0||target>21||!slotList&&at>=n||hasExtra&&at+1>=n)return absent('status-skill-target');
    if(missingSlot===null&&variant!==7&&!get(target)){
      if(!recover)return absent('status-skill-target');
      missingSlot=target;
    }
    if(missingSlot===null&&target===principal&&target===pairedLocal)return absent('status-skill98-caster-cache-tuple');
    const flags=slotList?0:v[at++]>>>0;
    if(assisted){
      if(at>=n)return absent('status-skill-record-boundary');
      const amount=v[at++];let resources=null;
      if(variant===12&&(flags&0x800000)){
        if(at+3>n)return absent('status-skill-record-boundary');
        if(missingSlot===null){
          if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)return absent('status-skill-resource-context');
          resources=Object.freeze(v.slice(at,at+3).map(value=>classifyLegacyGameActorResource(value)===0
            ?value:resolveLegacyGameActorResource(value,resourceCode)));
        }
        at+=3;
      }
      if(missingSlot===null)hits.push({slot:target,flags,amount,resources});
    }else{
      const extra=hasExtra?v[at++]:null;
      if(missingSlot===null)hits.push({slot:target,flags,extra});
    }
  }
  if(!terminated||!self&&at!==n)return absent('status-skill-record-boundary');
  if(variant===12&&!hits.length&&missingSlot===null)return absent('status-skill-assist-empty-impact');
  const actors=[principal,...(assisted&&!missingAssist?[assistSlot]:[]),...(variant===7?[]:hits.map(h=>h.slot))];
  if(actors.some(s=>get(s).unmodeledCharacterMask||!get(s).vitals))return absent('status-skill-character-dependency');
  const rows=new Map(),row=s=>{if(!rows.has(s))rows.set(s,{slot:s,reset:false,actions:[],tuples:[],assignments:{}});return rows.get(s);};
  const action=(s,...values)=>row(s).actions.push(...values),tuple=(s,target,flags)=>row(s).tuples.push(modifier?[target,flags|0,0]:[target,flags|0,0,0]);
  const chant=tiers[level]+(category===86?0x1ade4:category>=64&&category<=66||category===68?0x1ae01:0x1ade8);
  Object.assign(row(principal).assignments,{classCode:category,skillLevel:level,mpCost:v[1],chantResource:chant});
  if(grouped)row(principal).assignments.skillVariant=variant;
  action(principal,24,53,...(grouped||modifier?[37]:[]),38,135,62,...(modifier?[38]:[]));
  const position=variant===7?planStatusPosition(hits,get,principal,localSlot,row,recover):null;
  if(position?.kind==='status-skill-unavailable')return position;
  if(position?.missingSlot!==undefined){
    missingSlot=position.missingSlot;
    hits.length=position.swaps.length;
  }
  if(assisted){
    if(!missingAssist)queueStatusAssist(variant,principal,assistSlot,localSlot,level,hits,row);
    if(missingSlot===null){row(assistSlot).tuples.push([-1,0,0,0]);row(assistSlot).actions.push(72);}
  }
  else if(!position)for(const h of hits){tuple(principal,h.slot,h.flags);if(self)continue;
    const r=row(h.slot);
    if(variant===8){
      if(get(h.slot).dynamicFlags&2){r.reset=true;r.actions.length=r.tuples.length=0;}
      if(h.slot===pairedLocal){r.tuples.push([-2,0,0,0]);action(h.slot,218);}
      r.assignments.effectResource=0xcd;
      action(h.slot,78,51,49);
      continue;
    }
    Object.assign(r.assignments,{classCode:category,skillLevel:level});
    if(!grouped&&!modifier)r.assignments.numberStyle=-1;
    const special=principal===20&&h.slot<10||principal===21&&h.slot>=10;
    if(modifier){
      action(h.slot,153);
      if(h.flags&0x80000){r.assignments.effectResource=category&1?0xfd:0x112;action(h.slot,140,78,35);}
    }else if(grouped&&variant<=5){
      action(h.slot,117);
      if(h.flags&0x80000){r.assignments.skillVariant=variant;action(h.slot,138);}
    }else if(variant===6){
      Object.assign(r.assignments,{effectResource:0x120,messageResource:0x5784,secondaryEffectResource:0xa8});
      action(h.slot,78,81,66,79,54);
    }else if(grouped&&variant===9||category===86){
      action(h.slot,132);
      if(h.flags&0x80000)action(h.slot,45,43,44);
    }else if(grouped&&variant===10||category===67){
      action(h.slot,special?178:131);
      if(h.flags&0x80000)action(h.slot,139);
    }else if(grouped&&variant===11||category===68){
      r.reset=true;r.actions.length=r.tuples.length=0;action(h.slot,145);
      if(h.flags&0x80000){Object.assign(r.assignments,{speed:8,numberValue:h.extra,numberStyle:5});action(h.slot,77,155);}
      action(h.slot,38);
    }else if(category>=55&&category<=60)action(h.slot,special?185:118);
    else if(category>=64&&category<=66)action(h.slot,special?175:128);
    else if(category>=32&&category<=49){action(h.slot,117);if(h.flags&0x80000)action(h.slot,138);}
    else if(category===54){action(h.slot,143);if(h.flags&0x80000)action(h.slot,144);}
  }
  if(!position&&!assisted&&missingSlot===null)tuple(principal,-1,0);
  return Object.freeze({kind:'status-skill-plan',category,level,principal:position?.principal??principal,cost:v[1],ignoredWord:v[2],self,chantResource:chant,
    ...(position?{position}:{}),
    ...(assisted?{assistSlot}:{}),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:missingAssist?'assist':'target'})}),
    ...(grouped?{variant}:{}),hits:Object.freeze(hits.map(Object.freeze)),
    rows:Object.freeze([...rows.values()].map(r=>Object.freeze({...r,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments)})))});
}
export function battleStatusSkillEffect(type,level){
  if(!Number.isInteger(level)||level<0||level>9)fail('LEGACY_BATTLE_STATUS_SKILL_LEVEL');
  const tier=tiers[level];let kind='charge',resource,offset=false,alternate=false;
  if(type===117||type===184){resource=0x1adf7+tier;alternate=true;}
  else if(type===118||type===185)resource=0x1ae19+tier;
  else if(type===128||type===175){resource=0x1ae60+tier;alternate=offset=true;}
  else if(type===131||type===178){kind='rise-emitter';resource=0;}
  else if(type===132||type===192){resource=0x1ae4c;offset=true;}
  else if(type===143||type===196)resource=0x1ae51+tier;
  else if(type===145){kind='fall-emitter';resource=0;}
  else if(type===153)resource=0x1ae6d;
  else fail('LEGACY_BATTLE_STATUS_SKILL_BODY');
  return Object.freeze({kind,resource,offset,actorFlags:0x40000|(alternate?0x8000:0)});
}

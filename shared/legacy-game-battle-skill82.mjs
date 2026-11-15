/** Fixed37c4 SKL82. Source targets, resource metadata and real callbacks own results. */
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_SKILL82_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-skill82-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',classCode:82,
  midpoints:Object.freeze([Object.freeze([188,203]),Object.freeze([449,336])]),completeSKL:false,completeBattleGameplay:false,
});
const remap=n=>n===50?20:n===51?21:n,unavailable=reason=>Object.freeze({kind:'skill82-unavailable',reason});

export function appendBattleSkill82Result(tuples,hit,previousExtra){
  const {slot,flags,amount,resources}=hit,extra=resources?.[0]??previousExtra;
  const tuple=[slot,flags|0,amount,extra];
  tuples.push(tuple);
  if(resources)tuples.push([slot,flags|0,resources[0],resources[1]],[slot,flags|0,resources[2],0],[...tuple]);
  return extra;
}

export function planBattleSkill82(command,get,localSlot,resourceCode,recoverMissing=false){
  let d,fd;try{d=Object.getOwnPropertyDescriptors(command);
    if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return unavailable('skill82-fields');
    if(d.attachedRID.value)return unavailable('skill82-attached-RID-consumer');fd=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return unavailable('skill82-fields');}
  const n=fd.length.value;if(n<5||n>4096||Reflect.ownKeys(fd).length!==n+1)return unavailable('skill82-fields');
  const v=[];for(let i=0;i<n;i++){const q=fd[i];if(!Object.hasOwn(q??{},'value')||!Number.isInteger(q.value)||q.value< -2147483648||q.value>2147483647)return unavailable('skill82-fields');v.push(q.value);}
  let code=v[0];if(code>50000)for(const[from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
  const category=Math.trunc(code/100),level=code%10,principal=remap(v[3]);
  if(category!==82||level<0)return unavailable('skill82-category');
  if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return unavailable('skill82-local-context');
  if(principal<0||principal>21)return unavailable('skill82-actor-absent');
  if(!get(principal))return recoverMissing===true?Object.freeze({kind:'skill82-absent',principal}):unavailable('skill82-actor-absent');
  const normalize=value=>classifyLegacyGameActorResource(value)===0?value:resolveLegacyGameActorResource(value,resourceCode);
  const hits=[];let at=4,terminated=false,missingSlot=null;
  while(at<n){const slot=remap(v[at++]);if(slot===255){terminated=true;break;}
    if(slot<0||slot>21||at+2>n)return unavailable('skill82-target');
    if(missingSlot===null&&!get(slot)){
      if(recoverMissing!==true)return unavailable('skill82-target');
      missingSlot=slot;
    }
    const flags=v[at++]>>>0,amount=v[at++];let resources=null;
    if(flags&0x800000){
      if(at+3>n)return unavailable('skill82-resource-context');
      if(missingSlot===null){
        if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)return unavailable('skill82-resource-context');
        resources=v.slice(at,at+3).map(normalize);
      }
      at+=3;
    }
    if(missingSlot===null)hits.push({slot,flags,amount,resources});
  }
  if(!terminated||at!==n)return unavailable('skill82-record-boundary');
  if(!hits.length&&missingSlot===null)return unavailable('skill82-empty-target-runtime-unobserved');
  if([principal,...hits.map(h=>h.slot)].some(s=>get(s).unmodeledCharacterMask||!get(s).vitals))return unavailable('skill82-character-dependency');
  const rows=new Map(),row=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{}});return rows.get(s);};
  const push=(s,...values)=>row(s).actions.push(...values);
  Object.assign(row(principal).assignments,{classCode:82,skillLevel:level,mpCost:v[1],rememberedPosition:LEGACY_GAME_BATTLE_SKILL82_PROFILE.midpoints[principal<10?0:1],effectResource:0x120});
  push(principal,24,53,147,8,6,10,78,83,34,89,84,35,87,...(principal===localSlot?[244]:[50,49]));
  // The native fourth word carries RID1 after the first resource-bearing target.
  let extra=0;for(const h of hits){extra=appendBattleSkill82Result(row(principal).tuples,h,extra);
    Object.assign(row(h.slot).assignments,{classCode:82,skillLevel:level});
    if(!(h.flags&0x108)){if(h.flags&0x40)push(h.slot,32,...(h.slot===localSlot?[244]:[50,49]));
      else if(h.amount!==0&&(h.flags&3))push(h.slot,h.flags&2?160:26);}
    if(h.amount!==0||(h.flags&0x108))push(h.slot,11);
    if((h.flags&0x20)&&!(h.flags&0x10000))push(h.slot,44);
  }
  if(missingSlot===null)row(principal).tuples.push([-1,0,0,0]);
  return Object.freeze({kind:'skill82-plan',category,level,principal,cost:v[1],ignoredWord:v[2],hits:Object.freeze(hits.map(Object.freeze)),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:'target'})}),
    rows:Object.freeze([...rows.values()].map(r=>Object.freeze({slot:r.slot,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments)})))});
}

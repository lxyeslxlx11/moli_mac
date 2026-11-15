/** Fixed37c4 numeric SKL61..63 and moving83. Values and source action order own results. */
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
export const LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-numeric-skills-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classes:Object.freeze([61,62,63,83]),levelTable:Object.freeze([3,3,3,2,2,2,1,1,1,0]),
  completeSKL:false,completeBattleGameplay:false,
});
const remap=n=>n===50?20:n===51?21:n;
const unavailable=reason=>Object.freeze({kind:'numeric-skill-unavailable',reason});
const freezeRows=rows=>Object.freeze([...rows.values()].map(r=>Object.freeze({
  slot:r.slot,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments),
})));
export function planBattleNumericSkill(command,get,localSlot,recoverMissing=false){
  let d,fd;try{d=Object.getOwnPropertyDescriptors(command);
    if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return unavailable('numeric-skill-fields');
    if(d.attachedRID.value)return unavailable('numeric-skill-attached-RID-consumer');fd=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return unavailable('numeric-skill-fields');}
  const n=fd.length.value;if(n<5||n>4096||Reflect.ownKeys(fd).length!==n+1)return unavailable('numeric-skill-fields');
  const v=[];for(let i=0;i<n;i++){const q=fd[i];if(!Object.hasOwn(q??{},'value')||!Number.isInteger(q.value)||q.value< -2147483648||q.value>2147483647)return unavailable('numeric-skill-fields');v.push(q.value);}
  let code=v[0];if(code>50000)for(const[from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
  const category=Math.trunc(code/100),level=code%10,principal=remap(v[3]);
  if(!LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.classes.includes(category)||level<0)return unavailable('numeric-skill-category');
  if(category===83&&(!Number.isInteger(localSlot)||localSlot<0||localSlot>21))return unavailable('moving-numeric-local-context');
  if(principal<0||principal>21)return unavailable('numeric-skill-actor-absent');
  if(!get(principal))return recoverMissing===true?Object.freeze({kind:'numeric-skill-absent',principal}):unavailable('numeric-skill-actor-absent');
  const hits=[];let at=4,terminated=false,missingSlot=null;
  while(at<n){const target=remap(v[at++]);if(target===255){terminated=true;break;}
    if(target<0||target>21||at+2>n)return unavailable('numeric-skill-target');
    if(missingSlot===null&&!get(target)){
      if(recoverMissing!==true)return unavailable('numeric-skill-target');
      missingSlot=target;
    }
    const flags=v[at++]>>>0,amount=v[at++];
    if(missingSlot===null)hits.push({slot:target,flags,amount});
  }
  if(!terminated||at!==n)return unavailable('numeric-skill-record-boundary');
  if(missingSlot===null&&category===83&&principal!==localSlot){const total=hits.reduce((sum,h)=>h.flags&0x10000?(sum+h.amount)|0:sum,0);
    if(total!==0||hits.some(h=>h.slot===principal&&(h.flags&0x10000)))return unavailable('moving-numeric-removed-caster-reflection-runtime-unobserved');}
  if([principal,...hits.map(h=>h.slot)].some(s=>get(s).unmodeledCharacterMask||!get(s).vitals))return unavailable('numeric-skill-character-dependency');
  const prefixRows=new Map();
  let rows=prefixRows;
  const row=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{}});return rows.get(s);};
  const action=(s,...a)=>row(s).actions.push(...a),tuple=(s,target,flags,amount)=>row(s).tuples.push([target,flags|0,amount,0]);
  const chantResource=category===83?null:0x1ae01+LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.levelTable[level];
  Object.assign(row(principal).assignments,{classCode:category,skillLevel:level,mpCost:v[1]});action(principal,24,53,38);
  if(category===83){row(principal).assignments.rememberedPosition=Object.freeze([318,270]);action(principal,8,6,10,62,133,principal<20?88:193,...(principal===localSlot?[244]:[50,49]));}
  else{row(principal).assignments.chantResource=chantResource;action(principal,135,62);}
  const reflectors=[];let reflectedAmount=0,lastReflection=null;
  for(const original of hits){const h={...original},special=principal===20&&h.slot<10||principal===21&&h.slot>=10;
    if(h.flags&0x10000){lastReflection={...h};reflectedAmount=(reflectedAmount+h.amount)|0;reflectors.push(h.slot);h.flags=(h.flags&0xffffffdf)>>>0;}
    tuple(principal,h.slot,h.flags,h.amount);Object.assign(row(h.slot).assignments,{classCode:category,skillLevel:level});
    if(!special)action(h.slot,146);
    const specialTuple=()=>{tuple(h.slot,principal,h.flags,h.amount);action(h.slot,179,72);};
    if(h.flags&0x40000){if(special)specialTuple();action(h.slot,124);}
    else if(h.flags&0x20000){if(special)specialTuple();action(h.slot,123,154,30);
      Object.assign(row(h.slot).assignments,{numberValue:h.amount,numberStyle:h.flags&0x10000000?0:6});if(h.flags&0x20)action(h.slot,44,45);
    }else if(h.flags&0x10000){if(special)specialTuple();action(h.slot,122);}
    else{if(special)specialTuple();else action(h.slot,155);Object.assign(row(h.slot).assignments,{numberValue:h.amount,numberStyle:h.flags&0x10000000?0:5});}
  }
  // 42a305 cleans up before the terminator and any accumulated reflection.
  if(missingSlot!==null)rows=new Map();
  tuple(principal,-1,0,0);
  if(reflectedAmount!==0){const h=lastReflection,flags=(h.flags&0xfffeffff)>>>0;
    Object.assign(row(h.slot).assignments,{classCode:category,skillLevel:level});action(h.slot,1,137);action(principal,0,146,155);
    Object.assign(row(principal).assignments,{numberValue:reflectedAmount,numberStyle:5});tuple(h.slot,principal,flags,reflectedAmount);action(h.slot,72);
  }
  return Object.freeze({kind:'numeric-skill-plan',category,level,principal,cost:v[1],ignoredWord:v[2],chantResource,
    hits:Object.freeze(hits.map(Object.freeze)),reflectors:Object.freeze(reflectors),reflectedAmount,
    rows:freezeRows(prefixRows),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:'target'}),recoveryRows:freezeRows(rows)})});
}

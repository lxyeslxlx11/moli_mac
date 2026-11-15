/** Fixed37c4 upper utility consumers. Wire amounts precede flags for SKL108. */
export const LEGACY_GAME_BATTLE_UPPER_SKILLS_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-upper-skills-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classes:Object.freeze([107,108,109,112,114,117]),levels:10,
  legacyInformationPrintf:'boxed-varargs-unmodeled',completeSKL:false,completeBattleGameplay:false,
});
const absent=reason=>Object.freeze({kind:'status-skill-unavailable',reason});
const remap=value=>value===50?20:value===51?21:value;
const tiers=[3,3,3,2,2,2,1,1,1,0];

// The caller owns and validates every scalar before passing the field array.
export function planBattleUpperSkill(v,category,level,get,localSlot,recoverMissing){
  const principal=remap(v[3]);
  if(!Number.isInteger(principal)||principal<0||principal>21)return absent('status-skill-actor-absent');
  if(!get(principal))return recoverMissing?Object.freeze({kind:'status-skill-absent',principal}):absent('status-skill-actor-absent');
  const hits=[];let at=4,terminated=false,missingSlot=null;
  while(at<v.length){
    const slot=remap(v[at++]);if(slot===255){terminated=true;break;}
    if(slot<0||slot>21||at+(category===108?1:0)>=v.length)return absent('status-skill-target');
    const amount=category===108?v[at++]:0,flags=v[at++]>>>0;
    if(missingSlot===null&&!get(slot)){
      if(!recoverMissing)return absent('status-skill-target');
      missingSlot=slot;
    }
    if(missingSlot===null)hits.push(Object.freeze({slot,flags,amount}));
  }
  if(!terminated||at!==v.length)return absent('status-skill-record-boundary');
  if([principal,...hits.map(h=>h.slot)].some(slot=>get(slot).unmodeledCharacterMask||!get(slot).vitals))return absent('status-skill-character-dependency');
  const rows=new Map(),row=slot=>{
    if(!rows.has(slot))rows.set(slot,{slot,reset:false,actions:[],tuples:[],assignments:{}});
    return rows.get(slot);
  },action=(slot,...values)=>row(slot).actions.push(...values),caster=row(principal);
  Object.assign(caster.assignments,{classCode:category,skillLevel:level,mpCost:v[1]});
  const prefix=category===107?[24,147,53,102]:category===108||category===109?[24,147]:
    category===112?[24,53,156,73,107,108]:category===114?[24,53,38,135,62]:[24,53,38,147,62];
  action(principal,...prefix);
  if(category===114)caster.assignments.chantResource=tiers[level]+0x1ade8;
  const depart=slot=>slot===localSlot?[244]:[50,49];
  for(const h of hits){
    caster.tuples.push([h.slot,h.flags|0,h.amount]);
    if(category===107)continue;
    const target=row(h.slot),success=!!(h.flags&0x80000),special=principal===20&&h.slot<10||principal===21&&h.slot>=10;
    Object.assign(target.assignments,{classCode:category,skillLevel:level});
    if(category===114){
      action(h.slot,153);
      if(success){target.assignments.effectResource=0xfd;action(h.slot,140,78,35);}
    }else if(category===117){
      action(h.slot,0);
      if(success)action(h.slot,54);
      else{target.assignments.messageResource=0x573b;action(h.slot,66);}
      action(principal,71,72);
    }else if(category===112){
      action(h.slot,0);
      if(!success)action(h.slot,11);
      else if(h.flags&0x2000){action(h.slot,119);action(principal,109,35,87,...depart(principal));}
      else if(h.flags&0x4000)action(h.slot,120);
      else if(h.flags&0x8000)action(h.slot,121);
      else action(h.slot,109,35,87,...depart(h.slot));
    }else{
      if(h.slot!==principal){action(h.slot,0);action(principal,7,9,10);}
      action(principal,103);
      if(!success){
        if(category===109&&(h.flags&0x200000)){
          target.assignments.messageResource=0x5739;
          action(h.slot,...(h.flags&2?[117,66,48]:[66,30]));action(principal,57);
        }else{caster.assignments.messageResource=0x573b;action(principal,66,57);}
      }else{
        action(principal,h.slot===principal?104:55);
        action(h.slot,category===108?(special?179:146):(special?178:131));
        if(category===108){
          if(!special)action(h.slot,154);
          Object.assign(target.assignments,{chantResource:tiers[level]+0x1ae01,numberValue:h.amount,numberStyle:5});
        }
      }
      action(principal,72);
    }
  }
  const tailActions=category===108||category===109?[53]:[],tailTuples=category===107||category===114?[[-1,0,0]]:[];
  if(missingSlot===null){caster.actions.push(...tailActions);caster.tuples.push(...tailTuples);}
  return Object.freeze({kind:'status-skill-plan',category,level,principal,cost:v[1],ignoredWord:v[2],self:false,
    ...(category===114?{chantResource:caster.assignments.chantResource}:{}),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:'target'}),
      interruptionTail:Object.freeze([{slot:principal,actions:Object.freeze(tailActions),tuples:Object.freeze(tailTuples.map(Object.freeze)),assignments:Object.freeze({})}])}),
    hits:Object.freeze(hits),rows:Object.freeze([...rows.values()].map(r=>Object.freeze({...r,actions:Object.freeze(r.actions),
      tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments)})))});
}

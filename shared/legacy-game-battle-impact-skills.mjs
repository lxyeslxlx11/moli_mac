/** Fixed37c4 five result-bearing utility families. The third word is stored by four producers. */
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
import {appendBattleSkill82Result} from './legacy-game-battle-skill82.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
export const LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-impact-skills-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classes:Object.freeze([4,97,106,111,116]),levels:10,completeSKL:false,completeBattleGameplay:false,
});
const remap=n=>n===50?20:n===51?21:n,tiers=[3,3,3,2,2,2,1,1,1,0];
const absent=reason=>Object.freeze({kind:'impact-skill-unavailable',reason});
export function planBattleImpactSkill(command,get,localSlot,resourceCode,recoverMissing=false){
  let d,fd;try{
    d=Object.getOwnPropertyDescriptors(command);
    if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return absent('impact-skill-fields');
    if(d.attachedRID.value)return absent('impact-skill-attached-RID-consumer');fd=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return absent('impact-skill-fields');}
  const n=fd.length.value;if(n<5||n>4096||Reflect.ownKeys(fd).length!==n+1)return absent('impact-skill-fields');
  const v=[];for(let i=0;i<n;i++){const q=fd[i];if(!Object.hasOwn(q??{},'value')||!Number.isInteger(q.value)||q.value< -2147483648||q.value>2147483647)return absent('impact-skill-fields');v.push(q.value);}
  let code=v[0];if(code>50000)for(const [from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
  const category=Math.trunc(code/100),level=code%10,principal=remap(v[3]);
  if(!LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE.classes.includes(category)||level<0)return absent('impact-skill-category');
  if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return absent('impact-skill-local-slot');
  if(principal<0||principal>21)return absent('impact-skill-actor-absent');
  if(!get(principal))return recoverMissing===true?Object.freeze({kind:'impact-skill-absent',principal}):absent('impact-skill-actor-absent');
  const hits=[];let at=4,terminated=false,missingSlot=null;
  while(at<n){
    const slot=remap(v[at++]);if(slot===255){terminated=true;break;}
    if(slot<0||slot>21||at+2>n)return absent('impact-skill-target');
    if(missingSlot===null&&!get(slot)){if(recoverMissing!==true)return absent('impact-skill-target');missingSlot=slot;}
    const flags=v[at++]>>>0,amount=v[at++];let resources=null;
    if(flags&0x800000){
      if(at+3>n)return absent('impact-skill-resource-context');
      if(missingSlot===null){
        if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)return absent('impact-skill-resource-context');
        resources=v.slice(at,at+3).map(raw=>classifyLegacyGameActorResource(raw)===0?raw:resolveLegacyGameActorResource(raw,resourceCode));
      }
      at+=3;
    }
    if(missingSlot===null)hits.push(Object.freeze({slot,flags,amount,resources:resources?Object.freeze(resources):null}));
  }
  if(!terminated||at!==n)return absent('impact-skill-record-boundary');
  if(!hits.length&&missingSlot===null)return absent('impact-skill-empty-target-runtime-unobserved');
  if([principal,...hits.map(h=>h.slot)].some(s=>get(s).unmodeledCharacterMask||!get(s).vitals))return absent('impact-skill-character-dependency');
  const rows=new Map(),row=slot=>{
    if(!rows.has(slot))rows.set(slot,{slot,actions:[],tuples:[],assignments:{}});return rows.get(slot);
  },add=(slot,...actions)=>row(slot).actions.push(...actions),caster=row(principal);
  Object.assign(caster.assignments,{classCode:category,skillLevel:level,mpCost:v[1]});
  if(category!==97)caster.assignments.physicalVariant=v[2];
  const prefix=category===4?[24,53,147,68]:category===97?[24,53,38,147,135,62,78,86,85,84,87]:
    category===106?[24,53,156,75,34,89,101]:category===111?[24,53,156,7,9,10,73,106]:[24,53,156,...(level===9?[110,62]:[])];
  add(principal,...prefix);
  if(category===97)Object.assign(caster.assignments,{chantResource:0x1ade4+tiers[level],effectResource:5});
  const end=category===111?[74,7,11,10]:category===116?[62]:[];
  const depart=slot=>slot===localSlot?[244]:[50,49];
  // The initial fourth stack word is unobserved and unused without RID;portable zero carries the next explicit RID1.
  let extra=0;
  for(const hit of hits){
    const {slot,flags,amount}=hit;extra=appendBattleSkill82Result(caster.tuples,hit,extra);
    const target=row(slot);
    if(category===97)Object.assign(target.assignments,{classCode:category,skillLevel:level});
    else add(slot,0);
    if(category===116&&level<9)add(principal,110,72,62);
    if(!(flags&0x108)){
      if(flags&0x40)add(slot,32,...depart(slot));
      else if(amount!==0&&(flags&3)){
        if(category!==97&&(flags&0x8000))add(slot,121);
        else if(category!==97&&(flags&0x4000))add(slot,120);
        else if(category!==97&&(flags&0x2000))add(slot,119);
        else if(!(category===4&&(flags&0x20000000)))add(slot,flags&2?160:26);
      }
    }
    if((amount!==0||(flags&0x108))&&!(category===97?0:flags&(category===4?0x2000e000:0xe000))){
      add(slot,11);if(category!==97&&(flags&0x100))add(slot,74);
    }
    if((flags&0x20)&&(category!==97||!(flags&0x10000)))add(slot,44);
  }
  if(missingSlot===null)add(principal,...end);
  return Object.freeze({kind:'impact-skill-plan',category,level,principal,cost:v[1],variant:v[2],hits:Object.freeze(hits),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:'target'}),
      recoveryRows:Object.freeze([{slot:principal,actions:Object.freeze(end),tuples:Object.freeze([]),assignments:Object.freeze({})}])}),
    rows:Object.freeze([...rows.values()].map(r=>Object.freeze({...r,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments)})))});
}

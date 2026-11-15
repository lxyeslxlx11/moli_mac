/** Fixed37c4 casting queues and the SKL400–402 and SKL405 branches. */
import {BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
export const LEGACY_GAME_BATTLE_CASTING_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-casting-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classes:Object.freeze(Array.from({length:13},(_,i)=>19+i)),levelTable:Object.freeze([3,3,3,2,2,2,1,1,1,0]),
  callbacks:Object.freeze(['0x41bec0','0x41c3e0','0x41ca90','0x41d330']),completeSKL:false,completeBattleGameplay:false,
});
const remap=n=>n===50?20:n===51?21:n;
const unavailable=reason=>Object.freeze({kind:'casting-unavailable',reason});
export const battleSideCastEffect=0x1af8a;
export const battleWeatherCastEffect=0x1adfa;
export function battleCastingResources(category,level){if(!Number.isInteger(category)||(![400,401,402,405].includes(category)&&(category<19||category>31))||!Number.isInteger(level)||level<0||level>9)fail('LEGACY_BATTLE_CASTING_CATEGORY');const tier=LEGACY_GAME_BATTLE_CASTING_PROFILE.levelTable[level];
  if(category===400)return Object.freeze({chant:0x1ade4+tier,projectile:0x1addc+tier,group:3});
  if(category===401)return Object.freeze({chant:0x1ae01+tier,projectile:null,group:1});
  if(category===402)return Object.freeze({chant:0x1ade4+tier,projectile:null,group:null});
  if(category===405)return Object.freeze({chant:0x1ade4+tier,projectile:0x1addc+tier,group:null});
  const group=category===31?4:(category-19)%4,base=[0x1add0,0x1adc4,0x1ae3c,0x1addc,0x1adef][group];
  return Object.freeze({chant:0x1ade4+tier,projectile:base+tier*(group<3?3:1),group});
}

function planPursuitCast(fields,get,localSlot,level){
  if((fields.length-4)%2!==0||fields.at(-1)!==255)return unavailable('skill400-record-boundary');
  const [,cost,wirePrincipal]=fields;
  const principal=remap(wirePrincipal);
  if(principal<0||principal>21)return unavailable('skill400-caster-slot');
  const caster=get(principal);
  if(!caster)return Object.freeze({kind:'casting-skip',principal});
  if(caster.unmodeledCharacterMask||cost>0&&!caster.vitals)return unavailable('skill400-caster-context');

  const resources=battleCastingResources(400,level);
  const actions=[241,24,53,38,211,62],tuples=[[principal,0,400,0]],hits=[];
  const rows=[{slot:principal,actions,tuples,assignments:{classCode:400,skillLevel:level,mpCost:cost,
    chantResource:resources.chant,projectileResource:resources.projectile}}];
  const bySlot=new Map([[principal,rows[0]]]);
  for(let at=3;at<fields.length-1;at+=2){
    const slot=remap(fields[at]),flags=fields[at+1]>>>0;
    const target=slot>=0&&slot<=21?get(slot):null;
    if(!target||target.unmodeledCharacterMask)return unavailable('skill400-target-context');
    tuples.push([slot,flags|0,0,0]);
    hits.push({slot,flags});

    let targetRow=bySlot.get(slot);
    if(!targetRow){
      targetRow={slot,actions:[],tuples:[],assignments:{}};
      bySlot.set(slot,targetRow);rows.push(targetRow);
    }
    const targetActions=targetRow.actions;
    if(slot!==principal)targetActions.push(0);
    targetActions.push(0);
    if(slot!==principal){
      targetActions.push(241);
      targetRow.tuples.push([slot,0,400,0]);
    }
    if(flags&0x108){
      targetActions.push(11);
      if(flags&0x100)targetActions.push(74);
    }else if(!(flags&0x10000000)){
      if(flags&0x80000){
        if(!Number.isInteger(localSlot)||localSlot<0||localSlot>21)return unavailable('skill400-local-slot');
        if(slot===localSlot)targetActions.push(244);
        else targetActions.push(50,49);
      }else targetActions.push(11);
    }
  }
  // Type31 reads three subsequent rows from the caster bank before the
  // caller rereads its target. The post-read row must still name a body.
  for(let at=0;at<hits.length;at++)if(hits[at].flags&0x800000){
    if(at+3>=hits.length)return unavailable('skill400-linked-tuple-boundary');
    at+=3;
  }
  tuples.push([255,0,0,0]);
  return {kind:'casting-plan',category:400,level,principal,resources,rows,hits,reflectedAmount:0,reflectors:[]};
}

function planWeatherCast(fields,get,level){
  if((fields.length-4)%2!==0||fields.at(-1)!==255)return unavailable('skill401-record-boundary');
  const [,cost,wirePrincipal]=fields,principal=remap(wirePrincipal);
  if(principal<0||principal>21)return unavailable('skill401-caster-slot');
  const caster=get(principal);
  if(!caster)return Object.freeze({kind:'casting-skip',principal});
  if(caster.unmodeledCharacterMask||cost>0&&!caster.vitals)return unavailable('skill401-caster-context');

  const resources=battleCastingResources(401,level),hits=[];
  const actions=[24,53,38,211],tuples=[];
  const rows=new Map([[principal,{slot:principal,actions,tuples,assignments:{classCode:401,skillLevel:level,mpCost:cost,
    chantResource:resources.chant}}]]);
  for(let at=3;at<fields.length-1;at+=2){
    const slot=remap(fields[at]),flags=fields[at+1]>>>0;
    const target=slot>=0&&slot<=21?get(slot):null;
    if(!target||target.unmodeledCharacterMask)return unavailable('skill401-target-context');
    const repeatedEffect=(flags&0x80000)!==0;
    if(repeatedEffect&&slot===principal)return unavailable('skill401-self-effect-tuple');
    let row=rows.get(slot);
    if(!row){
      row={slot,actions:[],tuples:[],assignments:{classCode:401,skillLevel:level}};
      rows.set(slot,row);
    }
    tuples.push([slot,flags|0,0,0]);
    hits.push({slot,flags});
    row.actions.push(0);
    if(repeatedEffect){
      row.actions.push(35,207);
      row.tuples.push([battleWeatherCastEffect,30,0,23]);
    }
  }
  tuples.push([255,0,0,0],[0,1,3],[0,1,0]);
  actions.push(206,62,35,206);
  return {kind:'casting-plan',category:401,level,principal,resources,rows:[...rows.values()],hits,reflectedAmount:0,reflectors:[]};
}

function planSideCast(fields,get,level){
  if(fields.length!==5)return unavailable('skill402-record-boundary');
  const [,cost,,wirePrincipal,selector]=fields;
  const principal=remap(wirePrincipal);
  if(principal<0||principal>21)return unavailable('skill402-caster-slot');
  const caster=get(principal);
  if(!caster)return Object.freeze({kind:'casting-skip',principal});
  if(caster.unmodeledCharacterMask||cost>0&&!caster.vitals)return unavailable('skill402-caster-context');

  const resources=battleCastingResources(402,level),tuples=[],sideTargets=[];
  const actions=[24,53,38,135,62];
  const rows=[{slot:principal,actions,tuples,assignments:{classCode:402,skillLevel:level,mpCost:cost,chantResource:resources.chant}}];
  const first=selector===0?0:10;
  for(let slot=first;slot<first+10;slot++){
    const target=get(slot);
    if(!target)continue;
    if(target.unmodeledCharacterMask)return unavailable('skill402-target-context');
    sideTargets.push(slot);
    tuples.push([slot,0,0]);
    if(slot===principal)actions.push(212);
    else rows.push({slot,actions:[212],tuples:[],assignments:{}});
  }
  if(!sideTargets.length)return unavailable('skill402-empty-side');
  return {kind:'casting-plan',category:402,level,principal,resources,sideTargets,rows,
    hits:[],reflectedAmount:0,reflectors:[]};
}

function planTransformation(fields,get,resourceCode,level){
  const [,cost,wirePrincipal,field]=fields;
  const principal=remap(wirePrincipal);
  if(principal<0||principal>21)return unavailable('skill405-caster-slot');
  const caster=get(principal);
  if(!caster)return Object.freeze({kind:'casting-skip',principal});
  if(caster.unmodeledCharacterMask||cost>0&&!caster.vitals)return unavailable('skill405-caster-context');
  if(field!==-1&&field<1000)return unavailable('skill405-background-resource');
  if((fields.length-5)%5!==0||fields.at(-1)!==255)return unavailable('skill405-record-boundary');

  const resources=battleCastingResources(405,level);
  const tuples=[[principal,0,0,field]],transforms=[];
  const normalize=value=>resolveLegacyGameActorResource(value,resourceCode);
  for(let at=4;at<fields.length-1;at+=5){
    const slot=remap(fields[at]);
    const target=slot>=0&&slot<=21?get(slot):null;
    if(!target||target.unmodeledCharacterMask)return unavailable('skill405-target-context');
    const value1d0=fields[at+1];
    const [base,rider,attachment]=fields.slice(at+2,at+5).map(normalize);
    tuples.push([slot,0,value1d0,base],[slot,0,base,rider],[slot,0,attachment,0]);
    transforms.push({slot,base,rider,attachment});
  }
  tuples.push([-1,0,0,0]);
  return {kind:'casting-plan',category:405,level,principal,resources,field,transforms,hits:[],reflectedAmount:0,reflectors:[],
    rows:[{slot:principal,actions:[24,53,38,135,62],tuples,assignments:{classCode:405,skillLevel:level,mpCost:cost,
      chantResource:resources.chant,projectileResource:resources.projectile}}]};
}

const freezeRows=rows=>Object.freeze([...rows.values()].map(r=>Object.freeze({
  slot:r.slot,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze)),assignments:Object.freeze(r.assignments),
})));
export function planBattleCasting(command,get,localSlot,resourceCode,recoverMissing=false){
  let d,fd;try{d=Object.getOwnPropertyDescriptors(command);
    if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value'))||d.index.value!==0||!Array.isArray(d.fields.value))return unavailable('casting-fields');
    if(d.attachedRID.value)return unavailable('casting-attached-RID-consumer');fd=Object.getOwnPropertyDescriptors(d.fields.value);
  }catch{return unavailable('casting-fields');}
  const n=fd.length.value;if(n<4||n>4096||Reflect.ownKeys(fd).length!==n+1)return unavailable('casting-fields');
  const v=[];for(let i=0;i<n;i++){const q=fd[i];if(!Object.hasOwn(q??{},'value')||!Number.isInteger(q.value)||q.value< -2147483648||q.value>2147483647)return unavailable('casting-fields');v.push(q.value);}
  let code=v[0];if(code>50000)for(const [from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
  const category=Math.trunc(code/100),level=code%10,cost=v[1],principal=remap(v[3]);
  if(category===400)return planPursuitCast(v,get,localSlot,level);
  if(category===401)return planWeatherCast(v,get,level);
  if(n<5)return unavailable('casting-fields');
  if(category===402)return planSideCast(v,get,level);
  if(category===405)return planTransformation(v,get,resourceCode,level);
  if(category<19||category>31||level<0)return unavailable('casting-category');
  if(principal<0||principal>21)return unavailable('casting-actor-absent');
  if(!get(principal))return recoverMissing===true?Object.freeze({kind:'casting-absent',principal}):unavailable('casting-actor-absent');
  const normalize=n=>classifyLegacyGameActorResource(n)===0?n:resolveLegacyGameActorResource(n,resourceCode);
  const hits=[];let at=4,terminated=false,missingSlot=null;
  while(at<n){const slot=remap(v[at++]);if(slot===255){terminated=true;break;}
    if(slot<0||slot>21||at+2>n)return unavailable('casting-target');
    if(missingSlot===null&&!get(slot)){
      if(recoverMissing!==true)return unavailable('casting-target');
      missingSlot=slot;
    }
    const flags=v[at++]>>>0,amount=v[at++];let resources=null;
    if(flags&0x800000){
      if(at+3>n)return unavailable('casting-resource-context');
      if(missingSlot===null){
        if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)return unavailable('casting-resource-context');
        resources=v.slice(at,at+3).map(normalize);
      }
      at+=3;
    }
    if(missingSlot===null)hits.push({slot,flags,amount,resources});
  }
  if(!terminated||at!==n)return unavailable('casting-record-boundary');
  if([principal,...hits.map(h=>h.slot)].some(s=>get(s).unmodeledCharacterMask||!get(s).vitals))return unavailable('casting-character-dependency');
  const prefixRows=new Map();
  let rows=prefixRows;
  const row=s=>{if(!rows.has(s))rows.set(s,{slot:s,actions:[],tuples:[],assignments:{}});return rows.get(s);};
  const action=(s,...a)=>row(s).actions.push(...a),tuple=(s,target,flags,amount,resources=null,extra=0)=>{
    const r=row(s),original=[target,flags|0,amount,extra];r.tuples.push(original);
    if(flags&0x800000)r.tuples.push([target,flags|0,resources[0],resources[1]],[target,flags|0,resources[2],0],[...original]);
  };
  const feedback=(target,amount)=>{action(principal,(principal===20&&target<10||principal===21&&target>=10)?177:115,155);
    Object.assign(row(principal).assignments,{numberValue:Math.trunc(amount/2),numberStyle:5});};
  const linked31=(h,dead)=>{const {slot,flags,amount}=h;
    if(dead){if(flags&0xc00)action(slot,31);action(slot,32);}else action(slot,flags&0xc00?31:30);
    if(principal!==slot){row(slot).tuples.push([principal,flags|0,amount,0]);action(slot,24);}action(slot,71);if(principal!==slot)action(slot,72);
    action(principal,principal===slot?62:0);if(!(flags&0x20)||principal!==slot)feedback(slot,amount);
  };
  action(principal,24,53,38,135,62);let reflectedAmount=0,lastReflection=null,lastHit=null,extra=0;const reflectors=[];
  // EDI carries RID1 after a resource-bearing target. Before that the native
  // stack word is unobserved and unread by this consumer; its portable projection is0.
  for(const original of hits){const h={...original};if(h.resources)extra=h.resources[0];if(h.flags&0x10000){reflectedAmount=(reflectedAmount+h.amount)|0;lastReflection={...h,extra};reflectors.push(h.slot);h.flags=(h.flags&0xfc1fffdf)>>>0;}
    lastHit=h;tuple(principal,h.slot,h.flags,h.amount,h.resources,extra);action(h.slot,0);
    if(!(h.flags&0x108)){
      if((h.flags&0x40)&&!(h.flags&0x10000)){
        if(category===31)linked31(h,true);else action(h.slot,32);
        action(h.slot,...(localSlot===h.slot?[244]:[50,49]));
      }else if(h.amount!==0&&(h.flags&3)){
        if(h.flags&0x40000)action(h.slot,124);else if(h.flags&0x20000)action(h.slot,123);
        else if(h.flags&0x10000)action(h.slot,122);else if(!(h.flags&0x20000000)){
          if(category===31)linked31(h,false);else action(h.slot,h.flags&2?160:26);
        }
      }
    }
    if((h.amount!==0||h.flags&0x108)&&!(h.flags&0x20070000)&&category!==31){action(h.slot,11);if(h.flags&0x100)action(h.slot,74);}
    if((h.flags&0x20)&&!(h.flags&0x10000))action(h.slot,44);
  }
  const resources=battleCastingResources(category,level);
  Object.assign(row(principal).assignments,{classCode:category,skillLevel:level,mpCost:cost,chantResource:resources.chant,projectileResource:resources.projectile});
  // 42ac6f clears the prefix before the terminator and reflection queue writes.
  if(missingSlot!==null)rows=new Map();
  row(principal).tuples.push([-1,0,0,0]);
  if(reflectedAmount!==0){const h=lastHit,r=lastReflection,flags=(r.flags&0xfffeffff)>>>0;
    Object.assign(row(r.slot).assignments,{classCode:category,skillLevel:level,projectileResource:resources.projectile});action(r.slot,1,137);action(principal,0);
    if(!(flags&8)){
      if(flags&0x40)action(principal,32,...(localSlot===principal?[244]:[50,49]));
      else if(h.amount!==0){if(category===31){action(principal,h.flags&0xc00?31:30,62);if(!(flags&0x20))feedback(missingSlot??h.slot,h.amount);}
        else if(flags&3)action(principal,h.flags&2?160:26);}
    }
    tuple(r.slot,principal,flags,reflectedAmount,r.resources,r.extra);action(r.slot,72);
    if((h.amount!==0||flags&8||h.flags&0x100)&&category!==31){action(principal,11);if(h.flags&0x100&&missingSlot===null)action(h.slot,74);}
    if(flags&0x20)action(principal,44);
  }
  // Source135 consumes the final sentinel before self31 reaches71. Its following
  // target lookup is then-1; no original runtime result establishes a safe owner.
  if(category===31&&hits.some(h=>h.slot===principal)&&prefixRows.get(principal).actions.includes(71))return unavailable('casting-self-drain-cursor');
  return Object.freeze({kind:'casting-plan',category,level,cost,principal,ignoredWord:v[2],resources,hits:Object.freeze(hits.map(Object.freeze)),
    reflectors:Object.freeze(reflectors),reflectedAmount,rows:freezeRows(prefixRows),
    ...(missingSlot===null?{}:{missing:Object.freeze({slot:missingSlot,role:'target'}),recoveryRows:freezeRows(rows)})});
}

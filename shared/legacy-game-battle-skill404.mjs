/** Fixed37c4 SKL404 phase zero at 431118. Coordinates are world cells. */
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout} from './legacy-game-battle-data.mjs';
import {pairedBattleSlot} from './legacy-game-battle-change.mjs';
import {classifyLegacyGameActorResource, resolveLegacyGameActorResource} from './legacy-game-motion.mjs';

const battleSlot=slot=>slot===50?20:slot===51?21:slot;
const unavailable=reason=>Object.freeze({kind:'skill404-unavailable',reason});
const approachAnchors=[4,9,13,18];
const facingAnchors=[3,8,13,18];
const returnAnchors=[3,8,14,19];

function route(target,level){
  const group=Math.trunc(target/5);
  const side=target<10?-1:1;
  if(level===0){
    const [x,y]=layout[approachAnchors[group]].target;
    return {first:[x+side*155,y-side*35,0],second:[x+side*55,y-side*35,0],
      facingSlot:facingAnchors[group],returnSlot:returnAnchors[group]};
  }
  const front=group%2===0;
  const facingSlot=front?pairedBattleSlot(target):target;
  const [x,y]=layout[facingSlot].target;
  return {first:[x+side*110,y+side*100,0],second:[x+side*55,y+side*50,0],
    facingSlot,returnSlot:front?target:pairedBattleSlot(target)};
}

export function planBattleSkill404(command,get,localSlot,resourceCode){
  if(command.index!==0||command.classCode!==404)return unavailable('skill404-command-context');
  const fields=command.fields;
  const principal=battleSlot(fields[3]),level=fields[0]%10;
  if(!layout[principal]||level<0||level>9)return unavailable('skill404-level-or-principal');
  const parent=get(principal);
  if(!parent)return Object.freeze({kind:'skill404-skip',principal});
  if(parent.unmodeledCharacterMask)return unavailable('skill404-character-context');

  let cursor=4,firstResult=null,scratch=0;
  const number=()=>fields[cursor++];
  const normalize=value=>classifyLegacyGameActorResource(value)===0?value:resolveLegacyGameActorResource(value,resourceCode);
  const exchanges=[],hits=[],rows=new Map(),first={actions:[],tuples:[]},second={actions:[],tuples:[]};
  function row(slot){
    if(!rows.has(slot))rows.set(slot,{slot,actions:[],tuples:[]});
    return rows.get(slot);
  }
  function replacement(slot,withAttachment){
    const name=number(),rawResourceId=number();
    const rawAttachmentResource=withAttachment?number():0;
    const value1d0=number(),vitals=[number(),number(),number(),number()],flags=number()>>>0;
    return {slot,name,rawResourceId,resourceId:normalize(rawResourceId),rawAttachmentResource,
      attachmentResource:normalize(rawAttachmentResource),value1d0,vitals,flags};
  }
  function resultTuple(slot,flags,amount,resources){
    const tuple=[slot,flags|0,amount,scratch];
    second.tuples.push(tuple);
    if(resources){
      second.tuples.push([slot,flags|0,resources[0],resources[1]],[slot,flags|0,resources[2],0],tuple);
    }
  }

  for(let slot=battleSlot(number());slot!==255;slot=battleSlot(number())){
    if(!layout[slot]||!get(slot)||get(slot).unmodeledCharacterMask)return unavailable('skill404-target-body-context');
    if(slot===principal){
      const destination=battleSlot(number()),flags=number()>>>0;
      if(!layout[destination])return unavailable('skill404-destination-slot');
      exchanges.push({first:replacement(principal,true),second:replacement(destination,false),flags});
      continue;
    }
    firstResult??=slot;
    const flags=number()>>>0,amount=number();
    const rid=flags&0x800000?[normalize(number()),normalize(number()),normalize(number())]:null;
    if(rid)scratch=rid[0];
    const writesTargetHp=!(flags&0x8108)&&((flags&0x4000)||(!(flags&0x2000)&&amount!==0));
    if(writesTargetHp&&!get(slot).vitals)return unavailable('skill404-target-vitals');
    hits.push({slot,flags,amount,rid});
    second.actions.push(24,227);
    resultTuple(slot,flags,amount,rid);
    const target=row(slot);
    target.actions.push(0);
    if(!(flags&0x108)){
      if((flags&0x40)&&!(flags&0x2000))target.actions.push(32,...(slot===localSlot?[244]:[50,49]));
      else if(amount!==0&&(flags&3)){
        if(flags&0x8000)target.actions.push(38,121);
        else if(flags&0x4000)target.actions.push(38,120);
        else if(flags&0x2000)target.actions.push(38,119);
        else target.actions.push(228,38);
      }
    }else if(!(flags&0xe000)){
      target.actions.push(11);
      if(flags&0x100)target.actions.push(74);
    }
    if((flags&0x20)&&!(flags&0x2000))target.actions.push(44);
  }
  if(!exchanges.length||firstResult===null||firstResult>=20)return unavailable('skill404-exchange-or-formation-context');
  const exchange=exchanges.at(-1);
  const destination=exchange.second.slot;
  const positions=route(firstResult,level);
  const source=row(principal);
  source.actions.push(24,72,38,147,202,225,39,222);
  source.tuples.push([firstResult,0,0],positions.first,positions.second,[principal,1,principal,destination]);
  second.tuples.push([...layout[positions.returnSlot].target,0]);
  second.actions.push(202);
  if(exchange.flags&0x40)second.actions.push(229,50,49);
  else{
    first.tuples.push([destination,0,0]);
    first.actions.push(24,71,72,7,11,10);
    second.actions.push(226,34,0,7,11,10);
  }
  if(exchange.flags&0x200000){
    resultTuple(destination,exchange.flags,0,exchange.flags&0x800000?[0,0,0]:null);
    second.actions.push(230,72);
  }
  if(exchange.flags&0x20)second.actions.push(45,44);
  return {kind:'skill404-plan',principal,destination,level,localSlot,facingSlot:positions.facingSlot,
    exchanges,hits,rows:[source,...[...rows.values()].filter(entry=>entry!==source)],first,second};
}

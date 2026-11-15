/** Fixed37c4 body14 E000 routes. Order is8000,4000,2000;packet labels do not choose the recipient. */
import {recordEarlyPhysicalReceive} from './legacy-game-battle-physical-guard-playback.mjs';
export function createBattlePhysicalResultRoutes(a,common){
 function vital(body,index,amount,heal=false){const before=body.vitals[index],raw=(heal?before+amount:before-amount)|0,value=heal?Math.min(raw,body.vitals[1]):Math.max(0,raw);body.vitals[index]=value;
  a.event({kind:'battle-vital',slot:body.slot,field:index===0?'HP':'MP',before,value,delta:value-before});}
 function number(node,body,amount,style,flags,feedbackTarget=node){
  if(amount===0&&(flags&0x10000000))common.message(node,0x57bb);
  else{common.number(node,amount,style);if(flags&2)common.message(node,0x57b6);a.feedback(body,feedbackTarget);}
 }
 return Object.freeze({apply(node,victim,t,resources,signal,final,condition,advance,impact=common.impact){
  const b=node.body,other=victim.body,flags=t.flags;
  if(flags&0x108){
   if(flags&8)other.state=29;
   else if(!final||other.afterImageEnabled===0){a.sound(node,0xd2);other.afterImageEnabled=1;other.state=29;}
   return;
  }
  if(!(flags&0xc000)&&(t.amount!==0||b.classCode===6)){
   other.position=[...other.rememberedPosition];
   if(final&&(flags&0x2000)){
    if(flags&2)common.impact(node,0x1adb8);for(const resource of resources)impact(victim,resource);a.extraImpact(node,victim);b.reactionFlags=0x2000;
    if(flags&0x20){b.dynamicFlags|=2;b.auxFF8=1;a.setSlow(1);}
   }else{
    if(flags&0x100000){a.removeChild(victim,'status');other.dynamicFlags&=~0x20;}
    if(flags&2)common.impact(victim,0x1adb8);for(const resource of resources)impact(victim,resource);a.extraImpact(node,victim);
    if(!final)other.state=25;
   }
   a.sound(node,signal-(signal<20000?10000:20000));
  }
  if(!final)return;
  recordEarlyPhysicalReceive(b,other);
  if(flags&0x8000){
   a.pop(other);condition(b,victim,flags);
   if(b.classCode===6){vital(other,2,t.amount);number(victim,node,t.amount,3,flags);}
  }else if(flags&0x4000){
   a.pop(other);condition(b,victim,flags);
   if(b.classCode===6){vital(other,2,t.amount);number(victim,node,t.amount,3,flags);}
   else{vital(other,0,t.amount,true);number(victim,node,t.amount,5,flags);}
  }else{
   a.pop(b);a.pop(other);
   if(b.classCode===6){vital(b,2,t.amount);if(t.amount===0&&(flags&0x10000000))common.message(victim,0x57bb);else number(node,node,t.amount,3,flags,victim);}
   else{condition(b,node,flags);vital(b,0,t.amount);if(t.amount===0&&(flags&0x10000000))common.message(victim,0x57bb);else number(node,node,t.amount,6,flags,victim);}
   // The caller performs the source CMB owner-counter write;tuple advancement remains here.
   advance(b);
  }
 }});
}

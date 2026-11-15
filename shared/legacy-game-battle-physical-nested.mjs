/** Fixed37c4 nested72/113 actual232 and its5/56/57/58/61/79 continuations. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{waitsForSharedGuardResult}from'./legacy-game-battle-physical-guard-playback.mjs';
const types=new Set([5,56,57,58,61,79,232]);
const actions=new Set([0,1,3,4,5,7,9,10,11,14,24,26,27,30,32,34,35,38,39,42,44,49,50,53,55,56,57,58,61,62,66,67,71,72,73,74,78,79,113,119,120,121,147,160,232,242,243,244]);
export function createBattlePhysicalNested(a,c,common){
 const tuple=b=>{const i=b.tupleRead*4;return{slot:b.tuples[i],flags:b.tuples[i+1]>>>0,amount:b.tuples[i+2]};};
 const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
 function vital(b,amount,healing){const before=b.vitals[0],value=healing?Math.min(b.vitals[1],(before+amount)|0):Math.max(0,(before-amount)|0);b.vitals[0]=value;a.event({kind:'battle-vital',slot:b.slot,field:'HP',before,value,delta:value-before});}
 function hit(node,other){const b=node.body,victim=a.node(other);if(!victim)fail('LEGACY_BATTLE_BODY_OWNER');
  let t=tuple(b);a.aim(other,b.position,true);other.classCode=-1;other.attackerSlot=b.slot;other.reactionFlags=t.flags;a.metadata(node);t=tuple(b);
  if(!(t.flags&0x108)){
   if(!(t.flags&0xc000)&&t.amount!==0){other.position=[...other.rememberedPosition];
    if(!(t.flags&0x2000)){
     if(t.flags&0x100000){a.removeChild(victim,'status');other.dynamicFlags&=~0x20;}
     if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,0x1adb1+c.random.range(0,2));a.extraImpact(node,victim);
     if(t.flags&0x20){other.dynamicFlags|=2;other.auxFF8=1;a.setSlow(1);}
    }else{
     if(t.flags&2)common.impact(node,0x1adb8);common.impact(victim,0x1adb1+c.random.range(0,2));a.extraImpact(node,victim);b.reactionFlags=0x2000;
     if(t.flags&0x20){b.dynamicFlags|=2;b.auxFF8=1;a.setSlow(1);}
    }
   }
   if(t.flags&0x8000)a.pop(other);
   else if(t.flags&0x4000){
    a.pop(other);vital(other,t.amount,true);
    if(t.amount===0&&(t.flags&0x10000000))common.message(victim,0x57bb);
    else{common.number(victim,t.amount,5);if(t.flags&2)common.message(victim,0x57b6);a.feedback(node,victim);}
   }else if(t.flags&0x2000){
    a.pop(b);a.pop(other);vital(b,t.amount,false);
    if(t.amount===0&&(t.flags&0x10000000))common.message(a.node(a.get(tuple(b).slot)),0x57bb);
    else{common.number(node,t.amount,6);if(t.flags&2)common.message(node,0x57b6);a.feedback(node,victim);}
   }else{
    if(t.amount===0)common.message(victim,t.flags&0x10000000?0x57bb:0x573b);
    else{vital(other,t.amount,false);common.number(victim,t.amount,6);if(t.flags&2)common.message(victim,0x57b6);a.feedback(node,victim);}a.pop(other);
   }
  }else if(t.flags&8)other.state=29;
  else if(other.afterImageEnabled===0){a.sound(node,0xd2);other.afterImageEnabled=1;other.state=29;}
  if(!(t.flags&8)&&t.amount!==0)b.attackCooldown=(((other.dynamicFlags>>>1)&1)+1)*14;
  if(!(t.flags&0x2000)&&b.counter<16)b.state=5;advance(b);
 }
 return Object.freeze({
  validate(plan){
   for(const row of plan.rows)for(const type of row.actions)if(!actions.has(type))return Object.freeze({kind:'physical-family-unavailable',reason:'physical-family-body-consumer-pending'});
   a.validateSpecials(plan);for(const row of plan.rows)if(row.actions.includes(66)&&row.assignments.messageResource!==undefined)common.image(row.assignments.messageResource);
   const check=h=>{const f=h.flags;if(f&0x108||f&0x8000)return;const heal=!!(f&0x4000),reflect=!heal&&!!(f&0x2000);
    if(h.amount===0){common.image(f&0x10000000?0x57bb:!heal&&!reflect?0x573b:243700+(heal?5:6)*10);if(!(f&0x10000000)&&(heal||reflect)&&(f&2))common.image(0x57b6);}
    else{for(const ch of String(h.amount))common.image(243700+(heal?5:6)*10-48+ch.charCodeAt(0));if(f&2)common.image(0x57b6);}
   };
   const first=plan.hits[0];if(first.nested){check(first.nested);if((first.nested.flags&0x2000)&&(first.nested.flags&0xc108))check(first);}
   // Subsequent records run the already sourced14 consumer,including MP class
   // changes driven by actual target ownership;its finite categories are -1.
   for(const h of plan.hits.slice(1))check(h);
   return Object.freeze({kind:'physical-family-supported'});
  },
  body(node,ctx){const b=node.body;if(!b.physicalFamily||!types.has(b.state))return false;const type=b.state;
   if(type===232){
    const other=a.get(tuple(b).slot);
    if(!other){
     // The unreserved recipient can depart after the action was queued.
     advance(b);b.counter=0;a.pop(b);
    }else{
     b.animationAction=3;b.speed=10;b.speedPercent=100;
     if(b.counter<=15)a.move(b);
     if(b.counter>15||a.distance(b,other.position)<20){
      // The shared guard must finish its outer return before consuming the nested result.
      if(waitsForSharedGuardResult(b,other)){a.animate(node,0,ctx.mainState);a.screen(node);return true;}
      hit(node,other);
     }
     const before=b.counter;b.counter=(before+1)|0;if(before>15){a.pop(b);b.counter=0;}a.animate(node,0,ctx.mainState);
    }
   }else if(type===5){
    b.animationAction=3;b.speed=8;b.speedPercent=100;const before=b.counter;b.counter=(before+1)|0;
    if(before>15){a.pop(b);b.counter=0;}else a.move(b);a.animate(node,0,ctx.mainState);
   }else if(type===56||type===57){b.animationAction=type===56?14:15;if(a.animate(node,1,ctx.mainState)===1){node.player.resetFrames();a.pop(b);}}
   else if(type===58){b.animationAction=15;a.pop(b);}
   else if(type===61){b.animationAction=0;const before=b.counter;b.counter=(before+1)|0;
    if(before<70){if(b.counter===20)b.facing-=2;if(b.counter===50)b.facing+=4;if(b.facing>7)b.facing-=8;if(b.facing<0)b.facing+=8;}
    else{a.pop(b);b.counter=0;}a.animate(node,0,ctx.mainState);
   }else{a.sound(node,b.scriptSound??0);a.pop(b);}
   a.screen(node);return true;
  },
 });
}

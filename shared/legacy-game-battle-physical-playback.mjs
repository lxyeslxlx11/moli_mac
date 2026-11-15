/** Common physical direct-result owner. Variant/projectile scripts retain explicit pending boundaries. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {createBattlePhysicalResultRoutes} from './legacy-game-battle-physical-results.mjs';
import {createBattlePhysicalNested} from './legacy-game-battle-physical-nested.mjs';
import {createBattlePhysicalSpecial96} from './legacy-game-battle-physical-special96.mjs';
import {createBattleSequencePlayback} from './legacy-game-battle-sequence-playback.mjs';
import {createBattleChainPlayback} from './legacy-game-battle-chain-playback.mjs';
import {recordEarlyPhysicalReceive} from './legacy-game-battle-physical-guard-playback.mjs';
const primary=new Map([[0,0x1ae35],[1,0x1ae36],[3,0x1ae37],[5,0x1ae3b],[6,0x1ae39],[81,0x1ae5e],[84,0x1ae5f],[85,0x1ae4f],[87,0x1ae50],[105,0x1ae37]]);
const supported=new Set([0,1,3,4,7,8,6,9,10,11,14,24,26,27,28,32,34,35,38,39,42,44,49,50,53,62,66,67,71,72,73,74,78,113,119,120,121,147,155,160,205,240,242,243,244]);
const unavailable=reason=>Object.freeze({kind:'physical-family-unavailable',reason});
export function createBattlePhysicalPlayback(a,c,common){
 const resultRoutes=createBattlePhysicalResultRoutes(a,common);
 const nested=createBattlePhysicalNested(a,c,common);
 const special96=createBattlePhysicalSpecial96(a,c);
 const sequence=createBattleSequencePlayback(a,c,common);
 const chain=createBattleChainPlayback(a,c,common);
 const tuple=b=>{const at=b.tupleRead*4;return {slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2]};};
 const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
 const vital=(b,index,amount)=>{const before=b.vitals[index],value=Math.max(0,(before-amount)|0);b.vitals[index]=value;a.event({kind:'battle-vital',slot:b.slot,field:index===0?'HP':'MP',before,value,delta:value-before});};
 function resources(b,flags){if(flags&4)return [110000];if(flags&0x400)return [0x1ae12];if(b.classCode>=75&&b.classCode<=80)return [0x1adfa];
  if(b.classCode===257)return b.skillLevel===9?[0x1adbe,0x1af8c]:[0x1af8c];if(b.classCode===258)return [0x1af8d];
  if(b.classCode===259)return [0x1adb1+c.random.range(0,2),0x1af86];if(b.classCode===260||b.classCode===262)return [0x1af89];return [primary.get(b.classCode)??0x1adb1+c.random.range(0,2)];
 }
 function condition(b,node,flags){if(b.classCode===94&&b.statusScalar){a.condition(node,(0x1adfa+b.statusScalar)|0);return;}if(!(flags&0x80000))return;if(b.classCode>=75&&b.classCode<=80)a.condition(node,110000+b.classCode);else if(b.classCode===259)a.condition(node,0x1adfb);}
 function result(node,ctx){const b=node.body;let t=tuple(b);
  const signal=node.player.copyState().signal;
  if(signal>9999){const other=a.get(t.slot);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');const victim=a.node(other);if(!victim)fail('LEGACY_BATTLE_BODY_OWNER');const impactResources=resources(b,t.flags),impactFacing=b.classCode===262&&!(t.flags&0x404)?1:0,impact=(node,resource)=>common.impact(node,resource,impactFacing);other.frozen=0;other.classCode=-1;other.attackerSlot=b.slot;other.reactionFlags=t.flags;a.aim(other,b.position,true);
   const partial=signal<20000&&b.cooperativePending===1&&!(t.flags&0x2000),final=(signal<20000&&b.cooperativePending!==1)||!!(t.flags&0x2000);
   if(final){a.metadata(node);t=tuple(b);if(b.classCode===259&&b.skillLevel===9)a.tile(0,15);}
   if(t.flags&0xe000)resultRoutes.apply(node,victim,t,impactResources,signal,final,condition,advance,impact);
   else if(!(t.flags&0x108)){
    if(t.amount!==0||b.classCode===6){other.position=[...other.rememberedPosition];if(t.flags&0x100000){a.removeChild(victim,'status');other.dynamicFlags&=~0x20;}
     if(t.flags&2)common.impact(victim,0x1adb8);for(const resource of impactResources)impact(victim,resource);a.extraImpact(node,victim);
     if(final&&(t.flags&0x20)){other.dynamicFlags|=2;other.auxFF8=1;a.setSlow(1);}a.sound(node,signal-(signal<20000?10000:20000));
    }
    if(final){condition(b,victim,t.flags);recordEarlyPhysicalReceive(b,other);a.pop(other);
     if(b.classCode===6){vital(other,2,t.amount);if(t.amount===0&&(t.flags&0x10000000))common.message(victim,0x57bb);else{common.number(victim,t.amount,3);if(t.flags&2)common.message(victim,0x57b6);a.feedback(node,victim);}}
     else if(t.amount===0)common.message(victim,t.flags&0x10000000?0x57bb:0x573b);
     else if(![84,85,87].includes(b.classCode)){vital(other,0,t.amount);common.number(victim,t.amount,6);if(t.flags&2)common.message(victim,0x57b6);a.feedback(node,victim);}
    }else if(t.amount!==0||b.classCode===6)other.state=25;
   }else if(t.flags&8)other.state=29;
   else if(!final||other.afterImageEnabled===0){a.sound(node,0xd2);other.afterImageEnabled=1;other.state=29;}
   a.combinationHit(node,{signal,flags:t.flags,partial,normal:final});
   t=tuple(b);if((!(t.flags&8)&&t.amount!==0)||b.classCode===6)b.attackCooldown=(((other.dynamicFlags>>>1)&1)+1)*14;node.player.clearSignal();
  }
  if(b.attackCooldown>0)b.attackCooldown--;
  if(b.attackCooldown===0){if(b.attackFinishCounter===0){if(a.animate(node,1,ctx.mainState)!==1)return;}else if(b.attackFinishCounter>10){a.pop(b);advance(b);b.attackCooldown=b.attackFinishCounter=0;return;}b.attackFinishCounter++;}
 }
 return Object.freeze({sequenceState:sequence.snapshot,validate(plan){
   if(plan.missing?.point==='first-pair')return Object.freeze({kind:'physical-family-supported'});
   if(plan.pairMode&&[72,113].includes(plan.category))return nested.validate(plan);if(plan.variant!==0&&!plan.pairMode)return a.validateProjectiles(plan);
   const is96=plan.pairMode&&plan.category===96,extra96=new Set([45,75,76,79,80,89,90,92,93,94,95]);
   for(const row of plan.rows)for(const type of row.actions)if((!supported.has(type)&&!(is96&&extra96.has(type))&&!(plan.category===94&&type===96)&&!(plan.category===105&&[97,98,156].includes(type))&&!(plan.category===260&&[201,202,203,204].includes(type)))||type===28)return unavailable('physical-family-body-consumer-pending');
   if(is96)common.image(plan.rows.find(r=>r.slot===plan.principal).assignments.messageResource);
   const priorRecipients=new Set();for(const h of is96?plan.hits.slice(1):plan.hits){const categories=h.actor===h.target?[-1]:h.actor===plan.principal?[plan.category,...(priorRecipients.has(h.actor)?[-1]:[])]:[-1],styles=new Set();
    if(!(h.flags&0x108)&&!(h.amount===0&&(h.flags&0x10000000)))for(const category of categories){if(category===6)styles.add(3);else if(h.flags&0x8000){}else if(h.flags&0x4000)styles.add(5);else if(h.flags&0x2000||h.amount!==0&&![84,85,87].includes(category))styles.add(6);}
    for(const style of styles)for(const ch of String(h.amount))common.image(243700+style*10-48+ch.charCodeAt(0));priorRecipients.add(h.guard??h.target);
   }a.validateSpecials(plan);return Object.freeze({kind:'physical-family-supported'});
  },body(node,ctx){const b=node.body;if(!b.physicalFamily)return false;if(chain.body(node,ctx)||sequence.body(node,ctx)||special96.body(node,ctx)||nested.body(node,ctx))return true;
   if(b.state===96){b.animationAction=6;const victim=()=>{const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');return a.node(other);};if(node.player.copyState().signal>=10000){common.impact(victim(),0x1adfa);node.player.clearSignal();}if(a.animate(node,1,ctx.mainState)===1){common.impact(victim(),0x1adfa);a.pop(b);}}
   else if(b.state===14){b.animationAction=5;b.speedPercent=100;result(node,ctx);}
   else if(b.state===205){const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');b.animationAction=3;b.speed=16;b.speedPercent=50;a.aim(b,other.position,true);
    if(a.distance(b,other.position)<70){a.pop(b);b.speed=8;b.speedPercent=100;}else a.move(b);a.animate(node,0,ctx.mainState);a.reactionPuff(node,0x1adb4+(c.random.next()&3));}
   else if(b.state===8){b.animationAction=2;b.speedPercent=100;a.aim(b,b.rememberedPosition,true);if(a.animate(node,1,ctx.mainState)===1){if(b.dynamicFlags&2)b.speedPercent=200;a.pop(b);}}
   else if(b.state===6){b.animationAction=3;b.speed=8;b.speedPercent=100;a.aim(b,b.rememberedPosition,true);a.move(b);if(a.distance(b,b.rememberedPosition)<5){b.position=[...b.rememberedPosition];a.pop(b);}a.animate(node,0,ctx.mainState);}
   else return false;a.screen(node);return true;
  }});
}

/** Fixed37c4 actual201..204:the primary victim owns the secondary hit. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
const f=Math.fround,types=new Set([201,202,203,204]);
export function createBattleChainPlayback(a,c,common){
 const tuple=b=>{const i=b.tupleRead*4;return{slot:b.tuples[i],flags:b.tuples[i+1]>>>0,amount:b.tuples[i+2]};};
 const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');b.tupleRead++;};
 function hit(node){
  const b=node.body,original=a.get(b.attackerSlot),other=a.get(tuple(b).slot),attacker=original&&a.node(original),victim=other&&a.node(other);
  if(!attacker||!victim)fail('LEGACY_BATTLE_CHAIN_PARENT_CONTEXT');
  other.attackerSlot=b.slot;other.reactionFlags=tuple(b).flags;other.reactionCounter=other.skillStatus=0;a.metadata(node,b.slot);const t=tuple(b);
  if(!(t.flags&8)){
   if(!(t.flags&0x100)){
    if(!(t.flags&0xc000)&&t.amount!==0){
     if(!(t.flags&0x2000)&&(t.flags&0x100000)){a.removeChild(victim,'status');other.dynamicFlags&=~0x20;}
     if(t.flags&2)common.impact(victim,0x1adb8);
     const special=original.classCode===260&&original.skillLevel===9&&!(t.flags&0x404);
     common.impact(victim,t.flags&4?110000:t.flags&0x400?0x1ae12:special?0x1af89:0x1adb1+c.random.range(0,2),special?1:0);
     a.extraImpact(attacker,victim);if(t.flags&0x20){other.dynamicFlags|=2;other.auxFF8=1;a.setSlow(1);}
    }
    if(!(t.flags&0xe000)){
     if(t.amount===0)common.message(victim,t.flags&0x10000000?0x57bb:0x573b);
     else if(![84,85,87].includes(b.classCode)){const before=other.vitals[0],value=Math.max(0,(before-t.amount)|0);other.vitals[0]=value;a.event({kind:'battle-vital',slot:other.slot,field:'HP',before,value,delta:value-before});common.number(victim,t.amount,6);if(t.flags&2)common.message(victim,0x57b6);a.feedback(attacker,victim);}
    }
    a.pop(other);
   }else if(other.afterImageEnabled===0){a.sound(node,0xd2);other.afterImageEnabled=1;other.state=29;}
  }else other.state=29;
  a.aim(other,b.position,true);advance(b);
 }
 return Object.freeze({body(node,ctx){
  const b=node.body,type=b.state;if(!b.physicalFamily||!types.has(type))return false;
  if(type===201||type===203){const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');
   if(type===201){a.aim(b,other.position,true);a.pop(b);}
   else{const[x,y]=other.position,upper=y>=480-.75*x;b.rememberedPosition=[Math.trunc(x)+(upper?-44:44),Math.trunc(y)+(upper?-30:40)];b.state=6;}
  }else if(type===202){const t=tuple(b);b.rememberedPosition=[t.slot,t.flags|0];advance(b);b.state=6;}
  else{
   b.animationAction=b.reactionFlags&0xc04?9:8;b.speedPercent=50;const count=++b.reactionCounter,dead=(b.dynamicFlags>>>1)&1,start=(dead+1)*14;
   if(count<start){b.speed=5;b.angle=f(b.angle+180);if(b.angle>=360)b.angle=f(b.angle-360);if(dead){a.setSlow(1);b.auxFF8=1;}a.move(b);}
   else if(count<dead*14+34){
    if(b.reactionFlags&2)b.facing=(b.facing+1)&7;
    if(count===start){b.speed=5;b.counter=0;if(dead){if(a.countAux()<2)a.setSlow(0);b.auxFF8=0;}}
    if(b.counter===0)a.reactionPuff(node);if(b.counter++>1)b.counter=0;b.speed=Math.max(0,f(b.speed-f(.3)));a.move(b);
    if(count===dead*14+24)hit(node);
   }else if(count>=dead*14+54){
    b.reactionCounter=0;b.speed=dead&&!(b.reactionFlags&0x3010)?1:6;b.speedPercent=dead&&!(b.reactionFlags&0x3010)?250:100;a.pop(b);
    if(!dead&&b.state===11){b.speed=4;b.speedPercent=100;}
   }
   a.animate(node,1,ctx.mainState);
  }
  a.screen(node);return true;
 }});
}

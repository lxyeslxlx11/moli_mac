/** Fixed37c4 actual visibility/teleport/zero-HP/freeze callbacks75/76/80/89/90/92..95. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{battleIntegerBox}from'./legacy-game-battle-integer-box.mjs';
const f=Math.fround,types=new Set([75,76,80,89,90,92,93,94,95]);
export function createBattlePhysicalSpecial96(a,c){
 const target=b=>{const other=a.get(b.tuples[b.tupleRead*4]);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');return other;};
 return Object.freeze({body(node,ctx){const b=node.body,type=b.state;if(!b.physicalFamily||!types.has(type))return false;
  if(type===75||type===76){const flag=c.alternativeRenderer?0x100000:0x8000;b.actorFlags=type===75?(b.actorFlags|flag)>>>0:(b.actorFlags&~flag)>>>0;a.pop(b);}
  else if(type===89||type===90){b.actorFlags=type===89?(b.actorFlags|2)>>>0:(b.actorFlags&~2)>>>0;a.pop(b);a.animate(node,0,ctx.mainState);}
  else if(type===92){const other=target(b);b.position=[...other.position];b.angle=f(other.angle-180);if(b.angle>=360)b.angle=f(b.angle-360);else if(b.angle<0)b.angle=f(b.angle+360);b.speed=50;a.move(b);a.aim(b,other.position,true);a.pop(b);}
  else if(type===93){
   if(b.counter===0){b.animationAction=3;a.animate(node,0,ctx.mainState);}b.speed=6;const previous=b.counter;b.counter=(previous+1)|0;
   if(previous<16)a.move(b);else{a.pop(b);b.counter=0;const other=target(b),before=other.vitals[0];battleIntegerBox(0,c.random);other.vitals[0]=0;a.event({kind:'battle-vital',slot:other.slot,field:'HP',before,value:0,delta:-before});}
  }else if(type===94||type===95){target(b).frozen=type===95?1:0;a.pop(b);}
  else{a.sound(node,b.scriptAuxSound??0);a.pop(b);}a.screen(node);return true;
 }});
}

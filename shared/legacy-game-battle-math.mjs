/** Source battle geometry and CRT visual RNG. Native x87 bit identity is unverified. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_ACTOR_DATA} from './legacy-game-actor-data.mjs';
import {LEGACY_GAME_BATTLE_SINE} from './legacy-game-battle-math-data.mjs';
const f=Math.fround;
const finite=value=>{if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(f(value)))fail('LEGACY_BATTLE_FLOAT');return f(value);};
const word=value=>{if(!Number.isInteger(value)||value<0||value>0xffffffff)fail('LEGACY_BATTLE_INTEGER');return value>>>0;};
const int=value=>{if(!Number.isInteger(value)||value< -2147483648||value>2147483647)fail('LEGACY_BATTLE_INTEGER');return value|0;};
export function legacyGameBattleAngle(x,y){
  x=finite(x);y=finite(y);if(x===0&&y===0)return 0;
  const ax=Math.abs(x),ay=Math.abs(y),swap=ax<ay,ratio=(swap?ax/ay:ay/ax)*64,index=Math.trunc(ratio),fraction=f(ratio-index),table=LEGACY_GAME_ACTOR_DATA.math.direction_table;
  const a=f(table[index]*(1-fraction)+table[Math.min(index+1,64)]*fraction);
  return f(!swap?(x<0?(y<0?a+180:180-a):(y<0?360-a:a)):(x<0?(y<0?270-a:a+90):(y<0?a+270:90-a)));
}
export function legacyGameBattleFacing(angle){
  angle=finite(angle);if(angle>=360)angle=f(angle-360);if(angle<0)angle=f(angle+360);
  if(angle<0||angle>=360)fail('LEGACY_BATTLE_ANGLE');
  return angle<15||angle>=345?3:angle<60?4:angle<120?5:angle<165?6:angle<195?7:angle<240?0:angle<300?1:2;
}
export function legacyGameBattleSine(angle){
  angle=finite(angle);if(Math.abs(angle)>1000000)fail('LEGACY_BATTLE_ANGLE');
  while(angle>=360)angle=f(angle-360);while(angle<0)angle=f(angle+360);
  return LEGACY_GAME_BATTLE_SINE[Math.trunc(angle)];
}
export function legacyGameBattleMovement(x,y,angle,speed){
  x=finite(x);y=finite(y);angle=finite(angle);speed=finite(speed);
  return Object.freeze([f(legacyGameBattleSine(f(angle+90))*speed+x),f(legacyGameBattleSine(angle)*speed+y)]);
}
export function legacyGameBattleDistance(x,y,targetX,targetY){
  x=finite(x);y=finite(y);targetX=finite(targetX);targetY=finite(targetY);
  const dx=targetX-x,dy=targetY-y,distance=Math.sqrt(dx*dx+dy*dy);
  if(distance>2147483647)fail('LEGACY_BATTLE_DISTANCE');return Math.trunc(distance);
}
export function createLegacyGameBattleRandom(seed){
  let current=word(seed);
  const next=()=>{current=(Math.imul(current,0x343fd)+0x269ec3)>>>0;return(current>>>16)&0x7fff;};
  return Object.freeze({copySeed(){return current;},seed(value){current=word(value);},next,
    range(low,high){int(low);int(high);if(high===-1)return 0;const divisor=(high-low+1)|0;if(divisor===0)fail('LEGACY_BATTLE_RANDOM_RANGE');return(next()%divisor+low)|0;},
  });
}

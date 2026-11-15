/** Fixed37c4 steering/approach arithmetic. Whole native x87 equivalence remains unverified. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameBattleAngle} from './legacy-game-battle-math.mjs';
const f=Math.fround;
export function physicalAngle(value){if(value>=360)return f(value-360);return value<0?f(value+360):value;}
export function physicalAngleDifference(target,current){let d=target-current;if(d>180)d-=360;else if(d<=-180)d+=360;return d;}
export function physicalSteer(current,target,maximum){
 if(maximum===0)return target;
 const d=physicalAngleDifference(target,current);
 return f(current+(Math.abs(Math.trunc(d))>=maximum?(d<0?-maximum:maximum):d));
}
export function physicalFlightResource(angle,base){let i=Math.trunc((angle+11.25)*(2/45));if(i<0)i+=16;if(i>=16)i-=16;return base+16+i;}
// 419bd0 compares against the first two source slot coordinates,then returns signed AL.
// Its negative-reference branch performs BOTH subtractions at419c83/419c85.
export function physicalApproachSector(from,to){
 let reference=legacyGameBattleAngle(65,-35);reference=f(physicalAngleDifference(reference,0));
 let delta=legacyGameBattleAngle(f(to[0]-from[0]),f(to[1]-from[1]));
 if(reference<0)delta-=reference+360;
 delta-=reference;if(delta>180)delta-=360;else if(delta<=-180)delta+=360;
 if(Math.abs(delta)<=5||Math.abs(delta-180)<=5||Math.abs(delta+180)<=5)return 0;
 return reference<0?(delta>=0?1:-1):(delta<0?1:-1);
}
const divide=(a,b)=>{if(b===0)fail('LEGACY_BATTLE_PHYSICAL_DIVISION');const q=Math.trunc(a/b);if(q< -2147483648||q>2147483647)fail('LEGACY_BATTLE_PHYSICAL_DIVISION');return q|0;};
export function physicalApproachPoint(position,screen,first,firstScreen,second){
 let [x,y]=firstScreen;const side=physicalApproachSector(position,first);
 if(!second)return [x,y];
 const ax=first[0],bx=second[0];
 if(side===-1){if(ax<bx){y+=100;x+=20;}if(bx<ax)x+=100;}
 else if(side===0){if(bx<ax&&screen[0]<=x)x+=150;if(ax<bx&&x<=screen[0])y+=150;}
 else if(side===1){if(bx<ax){y-=100;x+=20;}if(ax<bx)x-=100;}
 if((side<0&&bx<=ax)||(side>0&&bx>ax)){
  let ratio;
  if(y<screen[1]){if(x<=screen[0])return [x,y];ratio=Math.min(100,divide(Math.imul((x-screen[0])|0,100),(screen[1]-y)|0));}
  else{if(screen[0]<=x)return [x,y];ratio=Math.min(100,divide(Math.imul((screen[0]-x)|0,100),(y-screen[1])|0));}
  if(side<0){y+=ratio;x+=divide(ratio,2);}if(side>0){y-=ratio;x-=divide(ratio,2);}
 }else{
  let ratio;
  if(x<screen[0]){if(screen[1]<=y)return [x,y];ratio=Math.min(100,divide(Math.imul((screen[1]-y)|0,100),(screen[0]-x)|0));if(side<0){x-=ratio;y+=divide(ratio,2);}}
  else{if(y<=screen[1])return [x,y];ratio=Math.min(100,divide(Math.imul((y-screen[1])|0,100),(x-screen[0])|0));if(side<0){x-=ratio;y+=divide(ratio,2);}}
  if(side>0){x+=ratio;y-=divide(ratio,2);}
 }
 return [x|0,y|0];
}

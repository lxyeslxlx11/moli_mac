/** Source-derived ordinary actor motion and mathematical helpers. One caller-driven native-style step. */
import { LEGACY_GAME_ACTOR_DATA as data } from './legacy-game-actor-data.mjs';
export const LEGACY_GAME_MOTION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-motion-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',queueCapacity:10,
  coordinateMinimum:-33554432,coordinateMaximum:33554431,nativeFrameScheduling:'unmodeled',nativeX87BitIdentity:'unverified'});
export class LegacyGameMotionError extends Error{
  constructor(code){super('Legacy motion does not match the supported bounded profile.');this.name='LegacyGameMotionError';this.code=code;}
}
const fail=code=>{throw new LegacyGameMotionError(code);},f=Math.fround;
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){
  try{let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('LEGACY_MOTION_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    if(length>32760)fail('LEGACY_MOTION_BUDGET');return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameMotionError)throw error;fail('LEGACY_MOTION_INPUT');}
}
function pair(value,validate){
  if(!Array.isArray(value))fail('LEGACY_MOTION_PAIR');let d;
  try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_MOTION_PAIR');}
  if(d.length?.value!==2||Reflect.ownKeys(d).length!==3||!Object.hasOwn(d[0]??{},'value')||!Object.hasOwn(d[1]??{},'value'))fail('LEGACY_MOTION_PAIR');
  return [validate(d[0].value),validate(d[1].value)];
}
function int32(value){if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_MOTION_INTEGER');return value;}
function coordinate(value){int32(value);if(value < -33554432||value>33554431)fail('LEGACY_MOTION_COORDINATE');return value;}
function finite(value){if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(f(value)))fail('LEGACY_MOTION_FLOAT');return f(value);}
export function legacyGameFacingCode(x,y){
  x=finite(x);y=finite(y);let angle=0;
  if(x!==0||y!==0){
    const ax=Math.abs(x),ay=Math.abs(y),swapped=ax<ay,ratio=(swapped?ax/ay:ay/ax)*64,index=Math.trunc(ratio),next=Math.min(index+1,64),fraction=f(ratio-index);
    const a=f(data.math.direction_table[index]*(1-fraction)+data.math.direction_table[next]*fraction);
    if(!swapped)angle=x<0?(y<0?a+180:180-a):(y<0?360-a:a);
    else angle=x<0?(y<0?270-a:a+90):(y<0?a+270:90-a);
  }
  angle=f(angle+data.math.direction_offset);if(angle>=360)angle=f(angle-360);if(angle<0)angle=f(angle+360);
  return Math.trunc(angle*data.math.direction_sector_multiplier);
}
export function projectLegacyGamePosition(position,camera,center){
  const [x,y]=pair(position,finite),[cx,cy]=pair(camera,finite),[sx,sy]=pair(center,int32),u=(x-cx)/64,v=(y-cy)/64;
  return Object.freeze([finite((u+v)*data.math.projection[0]+sx),finite((v-u)*data.math.projection[1]+sy)]);
}
export function classifyLegacyGameActorResource(value){
  int32(value);
  const r=data.resource;if(value>=r.base_grade_zero[0]&&value<=r.base_grade_zero[1])return 0;
  for(const [lo,hi,grade] of r.class_ranges)if(value>lo&&value<hi)return grade;
  const [lo,hi]=r.final_grade6_range,[holeLo,holeHi]=r.final_grade6_excluded_inclusive;
  return value>lo&&value<hi&&(value<holeLo||value>holeHi)?6:0;
}
export function resolveLegacyGameActorResource(value,code){
  int32(value);if(!Number.isInteger(code)||code<0||code>0xffffffff)fail('LEGACY_MOTION_RESOURCE_CONTEXT');
  const grade=classifyLegacyGameActorResource(value),cap=code<3?0:code<7?3:code===7?6:7;
  if(grade===0||cap>=grade)return value;if(grade===3)return value-5000;
  for(const [lo,hi,replacement] of data.resource.fallback_ranges)if(value>lo&&value<hi)return replacement;
  return -1;
}
export function encodeLegacyGameStepDirections(value){
  const bytes=input(value);try{return Uint8Array.from(bytes,b=>(b+97)&255);}finally{bytes.fill(0);}
}
export function createLegacyGameMovementCommand(origin,codes,sceneFlag){
  const coordinates=pair(origin,int32);int32(sceneFlag);const steps=encodeLegacyGameStepDirections(codes);
  return steps.length?Object.freeze({operationId:'send-004f6470',arguments:Object.freeze([...coordinates,steps,sceneFlag])}):null;
}
export function createLegacyGameActorMotion(origin,facing=0,speed=100){
  let target=pair(origin,coordinate),position=target.map(n=>f(n*64)),velocity=[0,0],queue=[],display=[...target],moving=false,animation=0,phase=0,closed=false;
  int32(facing);int32(speed);const active=()=>{if(closed)fail('LEGACY_MOTION_CLOSED');};
  const teleport=point=>{target=point;display=[...point];position=point.map(n=>f(n*64));velocity=[0,0];};
  const copyState=()=>{active();return Object.freeze({target:Object.freeze([...target]),position:Object.freeze([...position]),display:Object.freeze([...display]),
    velocity:Object.freeze([...velocity]),queue:Object.freeze(queue.map(p=>Object.freeze([...p]))),facingCode:facing,speed,moving,animation,phase});};
  return Object.freeze({
    enqueue(point){active();point=pair(point,coordinate);active();if(queue.length<10)queue.push(point);else{queue=[];teleport(point);}},
    teleport(point,clearQueue=true){active();point=pair(point,coordinate);if(typeof clearQueue!=='boolean')fail('LEGACY_MOTION_BOOLEAN');active();teleport(point);if(clearQueue)queue=[];},
    setSpeed(value){active();speed=int32(value);},
    setFacing(value){active();facing=int32(value);},
    setAnimation(value,resetPhase=false){active();int32(value);if(typeof resetPhase!=='boolean')fail('LEGACY_MOTION_BOOLEAN');animation=value;if(resetPhase)phase=-1;},
    synchronizePosition(nextPosition,nextDisplay,nextTarget,nextVelocity,nextMoving,nextPhase=null){
      active();const p=pair(nextPosition,finite),d=pair(nextDisplay,coordinate),t=pair(nextTarget,coordinate),v=pair(nextVelocity,finite);
      if(typeof nextMoving!=='boolean')fail('LEGACY_MOTION_BOOLEAN');if(nextPhase!==null)int32(nextPhase);
      active();position=p;display=d;target=t;velocity=v;moving=nextMoving;if(nextPhase!==null)phase=nextPhase;
    },
    clearQueue(){active();queue=[];},
    startPartyQueue(sourceSpeed,queueFactor){
      active();int32(sourceSpeed);if(typeof queueFactor!=='boolean')fail('LEGACY_MOTION_BOOLEAN');
      if(position[0]!==f(target[0]*64)||position[1]!==f(target[1]*64)||!queue.length)return false;
      const count=queue.length,next=queue.shift(),factor=queueFactor?data.math.queue_factors[count<2?0:count<4?1:count<6?2:3]:1;
      const rate=f(sourceSpeed*factor*data.math.speed_scale),dx=next[0]*64-position[0],dy=f(next[1]*64-position[1]),distance=f(Math.sqrt(dx*dx+dy*dy));
      const nx=distance>0?f(dx/distance):0,ny=distance>0?f(dy/distance):0;
      velocity=queueFactor?[f(nx*rate*4),f(ny*rate*4)]:[f(sourceSpeed*nx*4*0.01),f(sourceSpeed*ny*4*0.01)];target=next;
      if(nx!==0||ny!==0){facing=legacyGameFacingCode(nx,ny);moving=true;}return true;
    },
    shiftPartyQueue(){active();if(queue.length)queue.shift();},
    advanceParty(scale){
      active();scale=finite(scale);if(![1,f(1.2),f(1.6),2].includes(scale))fail('LEGACY_MOTION_PARTY_SCALE');
      if(velocity[0]===0&&velocity[1]===0){if(moving)animation=0;moving=false;}
      else{const dx=f(target[0]*64)-position[0],dy=f(target[1]*64)-position[1],vx=f(velocity[0]*scale),vy=f(velocity[1]*scale);
        if(vx*vx+vy*vy<dx*dx+dy*dy)position=[f(position[0]+vx),f(position[1]+vy)];else{position=target.map(n=>f(n*64));velocity=[0,0];}animation=1;}
      display=position.map(n=>Math.trunc(n*data.math.inverse_grid)|0);return copyState();
    },
    step(){
      active();
      if(position[0]===f(target[0]*64)&&position[1]===f(target[1]*64)&&queue.length){
        const count=queue.length,next=queue.shift(),factor=data.math.queue_factors[count<2?0:count<4?1:count<6?2:3];
        const rate=f(speed*factor*data.math.speed_scale),dx=next[0]*64-position[0],dy=next[1]*64-position[1],roundedDy=f(dy),distance=f(Math.sqrt(dx*dx+dy*roundedDy));
        const nx=distance>0?f(dx/distance):0,ny=distance>0?f(roundedDy/distance):0;
        velocity=[f(nx*rate*data.math.step_scale),f(ny*rate*data.math.step_scale)];target=next;
        if(nx!==0||ny!==0){facing=legacyGameFacingCode(nx,ny);moving=true;}
      }
      if(velocity[0]===0&&velocity[1]===0){if(moving)animation=0;moving=false;}
      else{
        const tx=f(target[0]*64),ty=f(target[1]*64),dx=tx-position[0],dy=ty-position[1];
        if(velocity[0]*velocity[0]+velocity[1]*velocity[1]<dx*dx+dy*dy)position=[f(position[0]+velocity[0]),f(position[1]+velocity[1])];
        else{position=[tx,ty];velocity=[0,0];}
        animation=1;
      }
      display=position.map(n=>Math.trunc(n*data.math.inverse_grid)|0);return copyState();
    },
    copyState,
    close(){if(closed)return;closed=true;target=[0,0];position=[0,0];velocity=[0,0];queue=[];display=[0,0];},
  });
}

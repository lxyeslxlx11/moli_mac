/** Fixed37c4 action80/state3 logical screen projection. Native x87 bit identity remains unverified. */
export const LEGACY_GAME_ACTOR_SPIN_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-spin-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  lastRotationCounter:360,maximumCounter:2147483646,angles:Object.freeze([45,0,315,270,225,180,135,90]),
  xScale:1.75,yScale:0.6000000238418579,baseY:-1.399999976158142,radians:0.017453292519444445});
export class LegacyGameActorSpinError extends Error{constructor(code){super('Actor spin input is outside the proven source projection.');this.name='LegacyGameActorSpinError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorSpinError(code);};
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_ACTOR_SPIN_INTEGER');return n===0?0:n;}
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_ACTOR_SPIN_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_SPIN_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_ACTOR_SPIN_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
export function planLegacyGameActorSpin(value){
  const r=fields(value,['counter','initialFacing','facingCode']),p=LEGACY_GAME_ACTOR_SPIN_PROFILE;int(r.counter,0,p.maximumCounter);int(r.facingCode,-1,7);
  if(r.counter===0){if(r.initialFacing!==null)fail('LEGACY_ACTOR_SPIN_STATE');r.initialFacing=r.facingCode;}else int(r.initialFacing,-1,7);
  if(r.counter>360)return Object.freeze({kind:'finish-probe',action:4,facingCode:r.facingCode,initialFacing:r.initialFacing,offset:Object.freeze([0,0])});
  const radius=360-r.counter,turn=Math.trunc(((radius+8)%120)/15);let facing=r.initialFacing-turn;if(facing<0)facing+=8;facing%=8;
  const angle=(p.angles[(r.initialFacing+4)%8]+radius*3)*p.radians;
  const x=Math.trunc(Math.cos(angle)*radius*p.xScale),y=Math.trunc(radius*p.baseY)+Math.trunc(-Math.sin(angle)*radius*p.yScale);
  return Object.freeze({kind:'rotation',action:3,facingCode:facing===0?0:facing,initialFacing:r.initialFacing,offset:Object.freeze([x===0?0:x,y===0?0:y])});
}
export function legacyGameActorSpinOutcome(counter,probeCode){
  int(counter,0,LEGACY_GAME_ACTOR_SPIN_PROFILE.maximumCounter);
  if(counter<=360){if(probeCode!==null)fail('LEGACY_ACTOR_SPIN_PROBE');}else int(probeCode);
  return Object.freeze({state:counter>360&&probeCode===1?0:3,counter:counter>360&&probeCode===1?1:counter+1});
}

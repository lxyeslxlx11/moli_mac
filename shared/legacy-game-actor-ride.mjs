/** Fixed37c4 source70/state1/2. No native allocation, wrapped storage or vendor material. */
export const LEGACY_GAME_ACTOR_RIDE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-ride-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',childLimit:1024,
  depthEpsilon:Math.fround(0.001),entryEffect:110096,exitEffect:110097});
export class LegacyGameActorRideError extends Error{constructor(code){super('Actor ride input is outside the proven source projection.');this.name='LegacyGameActorRideError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorRideError(code);};
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_ACTOR_RIDE_INTEGER');return n===0?0:n;}
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_ACTOR_RIDE_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_RIDE_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_ACTOR_RIDE_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
const ranges=Object.freeze([[100000,0x1874e,0x1bd50],[0x1879a,0x18848,0x1bd6c],[0x19a28,0x19ad6,0x1bd88],
  [0x19b22,0x19bd0,0x1bda4],[0x19e10,0x19ebe,0x1bdc0],[0x19f0a,0x19fb8,0x1bddc]].map(Object.freeze));
export function resolveLegacyGameMountedResource(resource){int(resource);for(const [lo,hi,base]of ranges)if(resource>=lo&&resource<hi){const n=resource-lo;return base+Math.trunc(n/25)*4+Math.trunc((n%25)/6);}
  return resource===0x18a24?0x1bdf9:resource===0x18a25?0x1bdf8:resource;}
export function projectLegacyGameMountedAction(resource,action){int(resource);int(action);let body=0,child=action;
  if(resource>=0x1bd50&&resource<=0x1bdf9){if(action===0||action===1||action===9)body=action;else if(action>=2&&action<=4)body=3;else if(action===5||action===6)body=5;else if(action===8||action===10)body=8;else child=0;}
  else if((resource>=100000&&resource<0x18a88)||(resource>=0x19a28&&resource<0x1a131)||resource===0x18a24||resource===0x18a25)body=11;
  return Object.freeze({action:body,childAction:child});}
export function legacyGameRideRestAction(resource){int(resource);return (resource>=0x1bd50&&resource<=0x1bdf9)?0:
  ((resource>=100000&&resource<0x18a88)||(resource>=0x19a28&&resource<0x1a131)||(resource>0x1af0d&&resource<0x1af26))?11:0;}
export function planLegacyGameActorRide(value){const r=fields(value,['state','counter','attachmentX','attachmentY']);int(r.state,1,2);int(r.counter,0,46340);int(r.attachmentX);int(r.attachmentY);
  const h=c=>(c-15)*(c-15)-225;let c=r.counter,y;
  if(r.state===2&&c===0)while(c<15&&h(c)>r.attachmentY)c++;
  y=h(c);int(y);const product=r.attachmentX*r.counter;int(product);let x=Math.trunc(product/30);
  if(r.state===1){if(c>15&&r.attachmentY<=y)y=r.attachmentY;}
  else{if(c>15&&y>=0)y=0;x=r.attachmentX-x;int(x);}
  return Object.freeze({state:r.state,counter:c,offset:Object.freeze([x===0?0:x,y===0?0:y]),effectResource:r.state===1?110096:110097,
    startSound:c===0?(r.state===1?465:463):null});}
export function legacyGameActorRideOutcome(state,counter,height,currentAttachmentY){int(state,1,2);int(counter,0,46340);int(height);int(currentAttachmentY);
  const complete=state===1?counter+1>=16&&height>=currentAttachmentY:counter+1>15&&height>=0;
  return Object.freeze({state:complete?0:state,counter:counter+1,complete,sound:complete?(state===1?462:457):null});}

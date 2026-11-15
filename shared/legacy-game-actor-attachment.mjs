/** Fixed37c4 source60 aux34 anchor/action, distinct from mount aux38. */
export const LEGACY_GAME_ACTOR_ATTACHMENT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-attachment-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',childType:1,flags:0x34,mode:0,priority:10});
export class LegacyGameActorAttachmentError extends Error{constructor(code){super('Actor attachment input is outside the proven source projection.');this.name='LegacyGameActorAttachmentError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorAttachmentError(code);};
function int(n){if(!Number.isInteger(n)||n < -2147483648||n>2147483647)fail('LEGACY_ACTOR_ATTACHMENT_INTEGER');return n===0?0:n;}
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_ACTOR_ATTACHMENT_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_ATTACHMENT_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_ACTOR_ATTACHMENT_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
function pair(value){if(!Array.isArray(value))fail('LEGACY_ACTOR_ATTACHMENT_PAIR');const d=Object.getOwnPropertyDescriptors(value);
  if(d.length?.value!==2||Reflect.ownKeys(d).length!==3||![0,1].every(i=>Object.hasOwn(d[i]??{},'value')))fail('LEGACY_ACTOR_ATTACHMENT_PAIR');return [int(d[0].value),int(d[1].value)];}
export function planLegacyGameActorAttachment(value){const r=fields(value,['parentAction','screenPosition','bodyAttachment','mountAttachment']);int(r.parentAction);
  const screen=pair(r.screenPosition),body=pair(r.bodyAttachment),mount=r.mountAttachment===null?[0,0]:pair(r.mountAttachment);
  const offset=body.map((n,i)=>int(n+mount[i]));return Object.freeze({action:r.parentAction===8?3:0,screenPosition:Object.freeze(screen.map((n,i)=>int(n+offset[i])))});
}

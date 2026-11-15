/** Fixed37c4 aux04 lifecycle and current-frame anchor. No assets, pointers or I/O. */
import {legacyGameActorPresentationHeight} from './legacy-game-actor-presentation.mjs';
export const LEGACY_GAME_ACTOR_BADGE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-badge-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',defaultResource:103100,childFlags:0x20,creationFrameDraw:false});
export class LegacyGameActorBadgeError extends Error{constructor(code){super('Actor badge input is outside the evidenced ordinary profile.');this.name='LegacyGameActorBadgeError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorBadgeError(code);};
const int=(n,lo=-2147483648,hi=2147483647)=>{if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_BADGE_INTEGER');return n|0;};
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_BADGE_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_BADGE_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_BADGE_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
export function planLegacyGameActorBadge(value){const r=fields(value,['primary','mode15','value16','dirty','present']);int(r.primary,0,65535);int(r.mode15);int(r.value16);if(typeof r.dirty!=='boolean'||typeof r.present!=='boolean')fail('LEGACY_BADGE_FIELDS');
  let action;if(r.dirty&&(r.primary&0x100))action='create';else if(!(r.primary&0x100))action=r.present?'remove':'absent';else if(r.present)action=r.primary&0x400?'remove':'advance';else action=(r.primary&0x4400)===0x4400&&!(r.primary&0x8000)?'absent':'create';
  return Object.freeze({action,dirty:action==='create'?false:r.dirty,resourceId:action==='create'?(r.mode15===1||r.mode15===2?r.value16:103100):null});}
export function planLegacyGameActorBadgeAnchor(value){const r=fields(value,['parentResource','screenX','screenY','offsetX','offsetY','originX','originY']);for(const n of Object.values(r))int(n);const short=n=>(n<<16)>>16;
  return Object.freeze([short(r.screenX+r.offsetX-r.originX),short(r.screenY+legacyGameActorPresentationHeight(r.parentResource)+r.offsetY-r.originY)]);}

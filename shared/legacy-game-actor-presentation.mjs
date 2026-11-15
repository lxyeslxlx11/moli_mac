/** Fixed37c4 status words and bounded ordinary icon projection; no native objects or I/O. */
export const LEGACY_GAME_ACTOR_PRESENTATION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-presentation-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',variantPrefix:16,transientFrames:600,childFlags:0x20,
  names:'unimplemented',customIcon:'ordinary-source99-gated'});
export class LegacyGameActorPresentationError extends Error{constructor(code){super('Actor presentation is outside the evidenced bounded source projection.');this.name='LegacyGameActorPresentationError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorPresentationError(code);};
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_PRESENTATION_INTEGER');return n===0?0:n;}
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_PRESENTATION_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_PRESENTATION_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_PRESENTATION_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
const height=Object.freeze([-78,-88,-88,-81,-88,-90,-99,-88,-88,-88,-79,-86,-88,-85,-88,-88,-96,-78,-88,-86,-88,-88,-81,-88,-90,-99,-79,-85,-88,-88,-96,-99,-88,-88,-88,-88,-88,-88,-88,-88]);
const variants=Object.freeze([0,103100,110401,110402,110403,110404,110405,110406,110407,110408,110409,110410,110411,110412,110413,110414]);
export function legacyGameActorPresentationHeight(resource){int(resource);return resource>=100000&&resource<101000?height[Math.trunc((resource-100000)/25)]:-88;}
export function legacyGameActorPresentationGate(secondary,knownMask,baseline){int(secondary,0,65535);int(knownMask,0,65535);int(baseline,0,255);return knownMask&0x80?(baseline&0x7f)|(secondary&0x80):baseline;}
/** A source write resolves only the bits it writes; unknown explicit context remains intact. */
export function applyLegacyGameActorPresentationControl(value){const r=fields(value,['primary','secondary','variant','forced','mode','local','action','parameter']);
  int(r.primary,0,65535);int(r.secondary,0,65535);int(r.variant);int(r.mode);int(r.action);int(r.parameter);
  if(typeof r.forced!=='boolean'||typeof r.local!=='boolean')fail('LEGACY_PRESENTATION_FIELDS');
  let {primary,secondary,variant,forced}=r,secondaryWrites=0,duration=null,parameterValue=null;const a=r.action,p=r.parameter;
  if(!r.local&&a===40){if(p<0)primary&=0xebff;else{primary|=0x400;parameterValue=p;}}
  else if(!r.local&&a===41){forced=p===1;if(forced)primary|=0x100;else if(r.mode!==2)primary&=0xfeff;}
  else if(!r.local&&(a===42||a===44)){const bit=a===42?0x4000:0x8000;if(p<0)primary&=~bit;else{primary|=bit;parameterValue=p;}}
  else if(a===45){secondaryWrites=1;secondary=p===1?secondary|1:secondary&0xfffe;}
  else if(a===46||a===63||a===64){secondaryWrites=2;if(a===64||(a===46&&p===0)){secondary&=0xfffd;variant=0;}else{secondary|=2;variant=p;}}
  else if(a===47){secondaryWrites=0x24;secondary|=0x24;}
  else if(a===48){secondaryWrites=8;secondary=p===1?secondary|8:secondary&0xfff7;}
  else if(a===49){secondaryWrites=0x50;secondary|=0x50;}
  else if(a===99){secondaryWrites=0x180;secondary|=0x180;duration=p;}
  else return null;
  return Object.freeze({primary,secondary,variant,forced,secondaryWrites,duration,parameterValue});
}
export function planLegacyGameActorPresentation(value){const r=fields(value,['primary','secondary','variant','bodyFlags','transientPresent']);
  int(r.primary,0,65535);int(r.secondary,0,65535);int(r.variant);int(r.bodyFlags,0,0xffffffff);if(typeof r.transientPresent!=='boolean')fail('LEGACY_PRESENTATION_FIELDS');
  const shadow=!!(r.bodyFlags&0x80000),primary=shadow?r.primary&0x8400:r.primary,
    secondary=shadow?((r.secondary&8?1:0)|(r.secondary&0x10?4:0)|(r.secondary&0x40?0x20:0)):r.secondary;
  let primaryResource=null;if(secondary&2){if(r.variant<0||r.variant>=variants.length)fail('LEGACY_PRESENTATION_VARIANT_UNSUPPORTED');primaryResource=variants[r.variant];}
  if(primary&0x400)primaryResource=110401;if(primary&0x8000)primaryResource=110402;if(primary&0x4000)primaryResource=110403;
  const transient=!!(secondary&4),transientVisible=transient&&primaryResource===null;
  if(transient&&!transientVisible&&!r.transientPresent)fail('LEGACY_PRESENTATION_TRANSIENT_OWNER_REQUIRED');
  return Object.freeze({primary,secondary,primaryResource,primaryShift:(secondary&1)&&!(primary&0xc400)?-17:0,
    transient,transientVisible,transientSound:transientVisible&&!r.transientPresent&&(secondary&0x20)?437:null,
    soundClearMask:shadow?0x40:0x20,expirationClearMask:shadow?0x10:4,
    sideResource:(secondary&1)&&!(primary&0xc400)?110414:null,sideShift:primaryResource===null?0:17});
}
export function planLegacyGameActorPresentationAnchor(value){const r=fields(value,['parentResource','screenX','screenY','previousOffsetX','previousOffsetY','previousOriginX','previousOriginY','shift']);
  for(const key of Object.keys(r))int(r[key]);return Object.freeze([int(r.screenX+r.previousOffsetX-r.previousOriginX+r.shift),int(r.screenY+legacyGameActorPresentationHeight(r.parentResource)+r.previousOffsetY-r.previousOriginY-20)]);}

/** Fixed37c4 known per-actor flags and ordinary graphic callback filtering. No I/O or native storage. */
export const LEGACY_GAME_ACTOR_CONTEXT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actor-context-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',drawMask:0x401700,graphicKeys:100,range:16});
export class LegacyGameActorContextError extends Error{constructor(code){super('Actor context is outside the proven ordinary source projection.');this.name='LegacyGameActorContextError';this.code=code;}}
const fail=code=>{throw new LegacyGameActorContextError(code);};
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_ACTOR_CONTEXT_INTEGER');return n===0?0:n;}
function fields(value,names){let d;try{if(!value||typeof value!=='object')fail('LEGACY_ACTOR_CONTEXT_FIELDS');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_CONTEXT_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_ACTOR_CONTEXT_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
function point(value){if(!Array.isArray(value))fail('LEGACY_ACTOR_CONTEXT_POINT');let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_CONTEXT_POINT');}
  if(d.length?.value!==2||Reflect.ownKeys(d).length!==3||![0,1].every(i=>Object.hasOwn(d[i]??{},'value')))fail('LEGACY_ACTOR_CONTEXT_POINT');return [int(d[0].value,-33554432,33554431),int(d[1].value,-33554432,33554431)];}
export function legacyGameActorRecordTypeFlags(category){int(category);return category===1?8:[6,13,27].includes(category)?17:category===32?33:category===71?257:1;}
export function legacyGameActorRecordDrawFlags(category,value7){int(category);int(value7);const base=category===1||category===32?0x100:category===3?0x200:0x1000;
  return base===0x1000&&(value7&0x140)===0x140?base|0x400000:base;}
export function legacyGameActorInitialFacing(category,resource,sceneMode,facing){int(category);int(resource);int(sceneMode);int(facing);
  return category>3&&sceneMode===0&&!(resource>=100000&&resource<200000)?0:facing;}
export function resolveLegacyGameActorFrameSource(actor,baseline){
  let descriptor;try{descriptor=Object.getOwnPropertyDescriptor(actor,'sourceFrame');}catch{fail('LEGACY_ACTOR_CONTEXT_OWNER');}
  if(!Object.hasOwn(descriptor??{},'value'))fail('LEGACY_ACTOR_CONTEXT_OWNER');
  const m=fields(descriptor.value,['profile','local','recordTypeFlags','recordDrawFlags','bodyOrMask','recordMotionMask','recordMotionValue','facingBound']);
  const s=fields(baseline,['unindexed','recordGateFlags','recordMotionFlags','recordTypeFlags','recordDrawFlags','bodyFlags','specialState','frozen','childAction']);
  if(m.profile!==LEGACY_GAME_ACTOR_CONTEXT_PROFILE.id||typeof m.local!=='boolean'||typeof m.facingBound!=='boolean'||typeof s.unindexed!=='boolean')fail('LEGACY_ACTOR_CONTEXT_FIELDS');
  if(!m.facingBound)fail('LEGACY_ACTOR_CONTEXT_SCENE_MODE_REQUIRED');
  for(const key of ['recordGateFlags','recordMotionFlags','recordDrawFlags','bodyFlags'])int(s[key],0,0xffffffff);int(s.recordTypeFlags,0,65535);int(s.specialState);int(s.frozen);if(s.childAction!==null)int(s.childAction);
  for(const key of ['bodyOrMask','recordMotionMask','recordMotionValue'])int(m[key],0,0xffffffff);
  if(m.recordTypeFlags!==null)s.recordTypeFlags=int(m.recordTypeFlags,0,65535);
  if(m.recordDrawFlags!==null)s.recordDrawFlags=((s.recordDrawFlags&~LEGACY_GAME_ACTOR_CONTEXT_PROFILE.drawMask)|(int(m.recordDrawFlags,0,0xffffffff)&LEGACY_GAME_ACTOR_CONTEXT_PROFILE.drawMask))>>>0;
  s.recordMotionFlags=((s.recordMotionFlags&~m.recordMotionMask)|(m.recordMotionValue&m.recordMotionMask))>>>0;
  s.bodyFlags=(s.bodyFlags|m.bodyOrMask)>>>0;s.unindexed=false;return Object.freeze(s);
}
/** Source440850/440860: a fresh frame stores at most100 triples; overflow is deliberately not deduplicated. */
export function createLegacyGameGraphicActorFilter(localCoordinates){
  const local=point(localCoordinates),seen=new Set();let closed=false;const active=()=>{if(closed)fail('LEGACY_ACTOR_CONTEXT_CLOSED');};
  return Object.freeze({
    submit(value){active();const r=fields(value,['local','graphicIndex','coordinates']);if(typeof r.local!=='boolean')fail('LEGACY_ACTOR_CONTEXT_FIELDS');int(r.graphicIndex);const xy=point(r.coordinates);active();
      if(!r.local&&(xy[0]<local[0]-16||xy[0]>local[0]+16||xy[1]<local[1]-16||xy[1]>local[1]+16))return Object.freeze({visible:false,remove:true,reason:'outside-local-range'});
      const key=r.graphicIndex+'/'+xy[0]+'/'+xy[1];if(seen.has(key))return Object.freeze({visible:false,remove:false,reason:'duplicate-graphic-cell'});
      if(seen.size<100)seen.add(key);return Object.freeze({visible:true,remove:false,reason:'visible'});
    },
    inspect(){return Object.freeze({state:closed?'closed':'open',tracked:seen.size,limit:100});},
    close(){if(closed)return;closed=true;seen.clear();},
  });
}

/** Fixed37c4 ordinary party branch, queue scale and wrapped-distance policy. No I/O. */
export const LEGACY_GAME_PARTY_PROFILE=Object.freeze({id:'legacy-se6000-37c4-party-follow-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',slots:5,queueCapacity:10,scope:'ordinary-input-and-following',nativeUIAndBattle:'unmodeled',nativeX87BitIdentity:'unverified'});
export class LegacyGamePartyError extends Error{constructor(code){super('Party state is outside the supported ordinary source profile.');this.name='LegacyGamePartyError';this.code=code;}}
const fail=code=>{throw new LegacyGamePartyError(code);};
const int=n=>{if(!Number.isInteger(n)||n < -2147483648||n>2147483647)fail('LEGACY_PARTY_INTEGER');return n|0;};
export function classifyLegacyGamePartyInput(mode,flags){int(mode);int(flags);if(flags<0||flags>65535)fail('LEGACY_PARTY_FLAGS');const allowed=mode===0||(flags&0x100)!==0;return Object.freeze({branch:mode===0?'ordinary':allowed?'leader':'follower',destinationAllowed:allowed});}
export function legacyGamePartyQueueScale(count){int(count);if(count<0||count>10)fail('LEGACY_PARTY_QUEUE');return Math.fround(count<2?1:count<4?1.2:count<6?1.6:2);}
export function legacyGamePartyTargetsNear(ax,ay,bx,by){[ax,ay,bx,by].forEach(int);const abs=n=>n<0?(-n)|0:n;return abs((ax-bx)|0)<2&&abs((ay-by)|0)<2;}
const directions=Object.freeze([[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]].map(Object.freeze));
/** Source467060 guards and unsigned strict timer; neighbor eligibility comes from the owned actor index. */
export function planLegacyGamePartyCommand(value){const names=['mode','flags','facing','inputGuard','movementGuard','coordinationGuard','lastTick','tick','neighborEligible'];let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_PARTY_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_PARTY_FIELDS');const r=Object.fromEntries(names.map(k=>[k,d[k].value]));
  for(const k of ['mode','flags','facing','inputGuard','movementGuard','coordinationGuard'])int(r[k]);if(r.flags<0||r.flags>65535)fail('LEGACY_PARTY_FLAGS');
  for(const k of ['lastTick','tick'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>0xffffffff)fail('LEGACY_PARTY_TICK');if(typeof r.neighborEligible!=='boolean')fail('LEGACY_PARTY_FIELDS');
  const reason=r.inputGuard||r.movementGuard||r.coordinationGuard?'guard':((r.lastTick+500)>>>0)>=r.tick?'cooldown':r.mode===0&&(r.facing<0||r.facing>7)?'facing':r.mode===0&&!r.neighborEligible?'neighbor':r.mode===0&&(r.flags&0x100)?'leader':null;
  return Object.freeze({allowed:reason===null,reason,join:r.mode===0?1:0});}
export function legacyGamePartyNeighbor(x,y,facing){[x,y,facing].forEach(int);if(facing<0||facing>7)return null;const [dx,dy]=directions[facing];return Object.freeze([(x+dx)|0,(y+dy)|0]);}

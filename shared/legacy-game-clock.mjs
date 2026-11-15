/** Source44fb60 normal pacing: presentation precedes its strict deadline wait. */
import { legacyInputFields,legacyInputInteger } from './legacy-game-input.mjs';
export const LEGACY_GAME_CLOCK_PROFILE=Object.freeze({id:'legacy-se6000-37c4-clock-v1',period:16.666666666666668,lagThreshold:16.666666666666668,maximumSkippedUpdates:19});
export class LegacyGameClockError extends Error{constructor(code){super('Clock operation is outside the source pacing sequence.');this.name='LegacyGameClockError';this.code=code;}}
const fail=code=>{throw new LegacyGameClockError(code);},tick=n=>legacyInputInteger(n,0,0xffffffff),period=LEGACY_GAME_CLOCK_PROFILE.period;
export function createLegacyGameClock(initialTick){
  let deadline=tick(initialTick),phase='ready',skipCount=1,updates=0,presentations=0,pendingPresentation=false;
  const active=()=>{if(phase==='closed')fail('LEGACY_CLOCK_CLOSED');};
  const complete=()=>{deadline+=period;skipCount=1;if(pendingPresentation)presentations++;pendingPresentation=false;phase='ready';};
  const wait=now=>Math.max(0,Math.floor(deadline-now)+1);
  return Object.freeze({
    begin(now){active();now=tick(now);if(phase==='updating')fail('LEGACY_CLOCK_SEQUENCE');if(phase==='waiting'){if(now<=deadline)return Object.freeze({ready:false,waitMilliseconds:wait(now)});complete();}phase='updating';return Object.freeze({ready:true,waitMilliseconds:0});},
    finish(now,value){active();if(phase!=='updating')fail('LEGACY_CLOCK_SEQUENCE');now=tick(now);const r=legacyInputFields(value,['graphicsMode','forceRender']);legacyInputInteger(r.graphicsMode);if(typeof r.forceRender!=='boolean')fail('LEGACY_CLOCK_ARGUMENTS');
      const mode=!r.forceRender&&r.graphicsMode===1?2:r.graphicsMode;updates++;
      if(!r.forceRender&&mode!==0&&now>deadline+period&&skipCount<=19){deadline+=period;skipCount++;phase='ready';return Object.freeze({present:false,repeat:true,graphicsMode:mode,waitMilliseconds:0});}
      pendingPresentation=r.forceRender||mode!==0;const present=pendingPresentation;
      if(now<=deadline){phase='waiting';return Object.freeze({present,repeat:false,graphicsMode:mode,waitMilliseconds:wait(now)});}
      complete();return Object.freeze({present,repeat:false,graphicsMode:mode,waitMilliseconds:0});
    },
    reset(now){active();if(phase==='updating')fail('LEGACY_CLOCK_SEQUENCE');deadline=tick(now);skipCount=1;pendingPresentation=false;phase='ready';},
    copyState(){active();return Object.freeze({deadline,phase,skipCount,updates,presentations,pendingPresentation});},
    close(){phase='closed';deadline=0;pendingPresentation=false;},
  });
}

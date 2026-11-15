/** Source437b30 case5/6 scheduling over the owned command/body callbacks. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
export const LEGACY_GAME_BATTLE_LOOP_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-motion-loop-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  phases:Object.freeze([5,6]),scope:'owned-M-callback-frame-and-round-feedback',completeMain10:false,exitReturn:'unimplemented'});
export function createLegacyGameBattleLoop(access){let closed=false,steps=0,motions=0,rounds=0,lastUnavailable=Object.freeze([]);
  const active=()=>{if(closed)fail('LEGACY_BATTLE_LOOP_CLOSED');};
  const inspect=()=>Object.freeze({profile:LEGACY_GAME_BATTLE_LOOP_PROFILE.id,status:closed?'closed':'open',steps,motions,rounds,unavailable:lastUnavailable,completeMain10:false,completeBattleGameplay:false});
  return Object.freeze({inspect,
    reset(){active();steps=motions=rounds=0;lastUnavailable=Object.freeze([]);},
    step(phase,context){active();if(phase!==5&&phase!==6)fail('LEGACY_BATTLE_LOOP_STATE');
      // Native selects the switch branch once; a callback's new global substate
      // cannot run the C consumer of case2 during this same case6 invocation.
      const callbacks=access.callbacks(context),frame=access.frame();let motion=null,nextSubstate=callbacks.nextSubstate??phase;
      if(phase===5){motion=access.consumeMotion(context);if(motion){motions++;nextSubstate=motion.nextSubstate;}}
      if(callbacks.manager.kind==='battle-round-drained')rounds++;
      lastUnavailable=Object.freeze([
        ...callbacks.commands.filter(r=>r.kind==='command-unavailable').map(r=>Object.freeze({kind:'command',token:r.token??null,reason:r.reason})),
        ...callbacks.body.results.filter(r=>r.result.endsWith('unavailable')).map(r=>Object.freeze({kind:'body',slot:r.slot,reason:r.result})),
      ]);steps++;
      return Object.freeze({profile:LEGACY_GAME_BATTLE_LOOP_PROFILE.id,callbacks,frame,motion,nextSubstate,unavailable:lastUnavailable,completeMain10:false,completeBattleGameplay:false});
    },
    close(){if(closed)return;closed=true;steps=motions=rounds=0;lastUnavailable=Object.freeze([]);},
  });
}

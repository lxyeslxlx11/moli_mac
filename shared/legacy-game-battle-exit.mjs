/** Owned437b30/7/8 ordinary branch0. Actual main9 return remains required. */
import {battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import {createLegacyGameBattleExitFade}from'./legacy-game-battle-exit-fade.mjs';
export const LEGACY_GAME_BATTLE_EXIT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-exit7-8-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',phases:Object.freeze([7,8]),ordinaryBranch:0,fadeType:12,scope:'source-cleanup-capture-fade-and-main9-boundary',ordinaryReturn:'unimplemented',completeMain10:false});
export function createLegacyGameBattleExit(access){let closed=false,fade=null,steps=0,captures=0,requestsPrepared=0,boundaryReached=false,unavailable=null;
 const active=()=>{if(closed)fail('LEGACY_BATTLE_EXIT_CLOSED');};
 const reset=()=>{fade?.close();fade=null;steps=captures=requestsPrepared=0;boundaryReached=false;unavailable=null;};
 return Object.freeze({
  inspect(){return Object.freeze({profile:LEGACY_GAME_BATTLE_EXIT_PROFILE.id,status:closed?'closed':'open',steps,captures,requestsPrepared,boundaryReached,unavailable,ordinaryReturn:'unimplemented',completeMain10:false,completeBattleGameplay:false});},
  reset(){active();reset();},
  step(phase,context){active();if(phase!==7&&phase!==8||boundaryReached)fail('LEGACY_BATTLE_EXIT_STATE');let capture=false,cleanup=null;
   if(phase===7){cleanup=access.prepare(context);if(cleanup.kind==='battle-exit-unavailable'){unavailable=cleanup.reason;fail('LEGACY_BATTLE_EXIT_DEPENDENCY_UNAVAILABLE');}
    fade=createLegacyGameBattleExitFade(12);capture=true;captures++;
   }else if(!fade)fail('LEGACY_BATTLE_EXIT_STATE');
   const frame=fade.step();let mainState=10,substate=8;const requests=[];
   if(frame.complete){access.markDeleted();access.leaveOrdinary?.();mainState=9;substate=1;boundaryReached=true;requestsPrepared++;
    requests.push(Object.freeze({operationId:'send-004f67f0',arguments:Object.freeze([0])}));}
   steps++;return Object.freeze({profile:LEGACY_GAME_BATTLE_EXIT_PROFILE.id,cleanup,capture,fade:frame,mainState,substate,requests:Object.freeze(requests),boundaryReached,ordinaryProjectionCleanup:'unmodeled-native-pool',ordinaryReturn:'unimplemented',completeMain10:false,completeBattleGameplay:false});
  },
  close(){if(closed)return;reset();closed=true;},
 });
}

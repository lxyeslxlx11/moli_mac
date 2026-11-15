/** Source501a50 normal-origin9/1->11->2->20/3. Actual world/frame ports own dependencies. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{createLegacyGameBattleEntryFade}from'./legacy-game-battle-entry-fade.mjs';
export const LEGACY_GAME_BATTLE_RETURN_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-ordinary-return-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',mainState:9,substates:Object.freeze([1,11,2,20,3]),waitThreshold:30,sourceInitialization:'derived-normal-main9-3-origin',completeNativeMain9:false,completeBattleGameplay:false});
export function createLegacyGameBattleReturn(access){let closed=false,steps=0,waitCounter=0,captures=0,readyToCommit=false,fade=null;
 const active=()=>{if(closed)fail('LEGACY_BATTLE_RETURN_CLOSED');};
 const reset=()=>{fade?.close();fade=null;steps=waitCounter=captures=0;readyToCommit=false;};
 return Object.freeze({
  inspect(){return Object.freeze({profile:LEGACY_GAME_BATTLE_RETURN_PROFILE.id,status:closed?'closed':'open',steps,waitCounter,captures,readyToCommit,completeNativeMain9:false,completeBattleGameplay:false});},
  reset(){active();reset();},
  step(phase,tick){active();let next=phase,render='clear',frame=null,fadeFrame=null,capture=false;
   if(phase===1){waitCounter=0;next=11;render='retained';}
   else if(phase===11){if(waitCounter<30)waitCounter++;else{frame=access.frame(tick,'rebuild');fade=createLegacyGameBattleEntryFade();fadeFrame=fade.step();capture=true;captures++;next=2;render='captured-scene-fade';}}
   else if(phase===2){if(!fade)fail('LEGACY_BATTLE_RETURN_STATE');fadeFrame=fade.step();if(fadeFrame.complete)next=20;render='captured-scene-fade';}
   else if(phase===20){frame=access.frame(tick,'activate');next=3;readyToCommit=true;render='ordinary-frame';}
   else if(phase===3&&readyToCommit)fail('LEGACY_BATTLE_RETURN_COMMIT_REQUIRED');else fail('LEGACY_BATTLE_RETURN_STATE');
   steps++;return Object.freeze({profile:LEGACY_GAME_BATTLE_RETURN_PROFILE.id,mainState:9,substate:next,phaseBefore:phase,waitCounter,steps,tick,render,frame,capture,fade:fadeFrame,readyToCommit,completeNativeMain9:false,completeBattleGameplay:false});
  },
  close(){if(closed)return;reset();closed=true;},
 });
}

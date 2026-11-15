/** Source437b30 entry/C/arrival and configured input/M owners. Full main10 remains incomplete. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {createLegacyGameBattleEntryFade} from './legacy-game-battle-entry-fade.mjs';
export const LEGACY_GAME_BATTLE_ENTRY_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-main10-entry-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  phases:Object.freeze([0,1,2,3,4]),scope:'source-entry-fade-C-arrival',nativeInput:'unimplemented',completeMain10:false});
export function createLegacyGameBattleEntry(access,value){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_BATTLE_ENTRY_CONTEXT');}
  if(Reflect.ownKeys(d).length!==1||!Object.hasOwn(d.entryWindowPresent??{},'value')||typeof d.entryWindowPresent.value!=='boolean')fail('LEGACY_BATTLE_ENTRY_CONTEXT');const entryWindowPresent=d.entryWindowPresent.value;
  let closed=false,busy=false,generation=null,mainState=10,phase=0,steps=0,captures=0,selectionDeadline=null,localSlot=0,unavailable=null,fade=createLegacyGameBattleEntryFade();
  const active=()=>{if(closed)fail('LEGACY_BATTLE_ENTRY_CLOSED');};
  const applyLocal=callbacks=>{const d=Object.getOwnPropertyDescriptor(callbacks??{},'localSlotUpdate');if(!d)return;if(!Object.hasOwn(d,'value'))fail('LEGACY_BATTLE_ENTRY_CONTEXT');if(d.value===null)return;if(!Number.isInteger(d.value)||d.value<0||d.value>21)fail('LEGACY_BATTLE_ENTRY_INTEGER');localSlot=d.value;};
  const reset=serial=>{fade.close();fade=createLegacyGameBattleEntryFade();generation=serial;mainState=10;phase=steps=captures=0;selectionDeadline=null;unavailable=null;};
  return Object.freeze({
    inspect(){return Object.freeze({profile:LEGACY_GAME_BATTLE_ENTRY_PROFILE.id,status:closed?'closed':'open',busy,generation,mainState,phase,steps,captures,selectionDeadline,localSlot,
      unavailable,nativeInput:access.inputEnabled()?'partial-basic-owned':'unimplemented',motionLoop:access.loopEnabled()?'partial-owned-M5/6':'unimplemented',completeMain10:false,completeBattleGameplay:false});},
    step(tick,serial){active();if(busy)fail('LEGACY_BATTLE_ENTRY_REENTRANT');if(!Number.isInteger(tick)||tick<0||tick>0xffffffff||!Number.isSafeInteger(serial)||serial<1)fail('LEGACY_BATTLE_ENTRY_INTEGER');
      if(generation!==serial)reset(serial);if(mainState!==10){if(!access.returnEnabled?.()){unavailable='native-main9-return';fail('LEGACY_BATTLE_RETURN_STATE_UNAVAILABLE');}
        busy=true;try{const before=phase,result=access.ordinaryReturn(phase,tick);mainState=result.mainState;phase=result.substate;steps++;unavailable=null;return Object.freeze({profile:LEGACY_GAME_BATTLE_ENTRY_PROFILE.id,generation,steps,mainStateBefore:9,mainStateAfter:mainState,phaseBefore:before,phaseAfter:phase,return:result,completeMain10:false,completeBattleGameplay:false});}finally{busy=false;}}
      if(phase>=5&&!((phase===5||phase===6)&&access.loopEnabled())&&!((phase===7||phase===8)&&access.exitEnabled())){unavailable='native-phase-'+phase;fail('LEGACY_BATTLE_ENTRY_STATE_UNAVAILABLE');}
      const before=phase,mainBefore=mainState;let capturePlan=null,fadeFrame=null,frame=null,callbacks=null,characters=null,arrival=null,input=null,motionLoop=null,exit=null,reoriented=Object.freeze([]);busy=true;
      try{const context=()=>({...access.context(),mainState:10,substate:phase,localSlot,slowEffects:false});
        if(phase===0){access.initialize();capturePlan=access.background();captures++;fadeFrame=fade.step();phase=1;}
        else if(phase===1){fadeFrame=fade.step();if(fadeFrame.complete){capturePlan=access.background();captures++;phase=2;access.firstBackground?.();}}
        else if(before===5||before===6){motionLoop=access.motionLoop(context());callbacks=motionLoop.callbacks;applyLocal(callbacks);frame=motionLoop.frame;phase=motionLoop.nextSubstate;unavailable=motionLoop.unavailable.length?'motion-dependency':null;}
        else if(before===7||before===8){exit=access.exit(context());mainState=exit.mainState;phase=exit.substate;unavailable=null;}
        else{
          if(phase===3&&(access.context().controlFlags&3)&&!entryWindowPresent){unavailable='native-entry-popup';fail('LEGACY_BATTLE_ENTRY_POPUP_UNAVAILABLE');}
          callbacks=access.callbacks(context());applyLocal(callbacks);if(callbacks.nextSubstate!==null)phase=callbacks.nextSubstate;
          if(before===4&&access.inputEnabled()){input=access.input(tick);if(input.requestPhase5)phase=5;}
          frame=access.frame();
          if(before===2){characters=access.consumeCharacter();if(characters){if(characters.end)phase=7;
              else{localSlot=access.localSlot();reoriented=access.orient();phase=3;}}}
          else if(before===3){arrival=access.arrivals();if(arrival.ready){selectionDeadline=(tick+30000)>>>0;access.beginInput(tick,serial);phase=4;}}
          // Native phase4 input is a separate source consumer. Queued M cannot bypass it.
        }
        if(before<7&&(before>=2||before===1&&fadeFrame?.complete)&&access.takeExitNotice())phase=7;steps++;
        return Object.freeze({profile:LEGACY_GAME_BATTLE_ENTRY_PROFILE.id,scope:LEGACY_GAME_BATTLE_ENTRY_PROFILE.scope,generation,steps,
          mainStateBefore:mainBefore,mainStateAfter:mainState,phaseBefore:before,phaseAfter:phase,capturePlan,fade:fadeFrame,frame,callbacks,characters,arrival,input,motionLoop,exit,reoriented,selectionDeadline,
          renderMode:fadeFrame?'captured-entry-row-fade':'basic-owned-battle-frame',nativeInput:access.inputEnabled()?'partial-basic-owned':'unimplemented',nativeMain10Driver:access.loopEnabled()?'partial-entry-input-and-M-loop':access.inputEnabled()?'partial-entry-and-basic-input':'partial-entry0..4',completeMain10:false,completeBattleGameplay:false});
      }finally{busy=false;}
    },
    close(){if(closed)return;closed=true;fade.close();generation=null;phase=steps=captures=0;selectionDeadline=null;unavailable=null;},
  });
}

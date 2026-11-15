/** Owning pointer/clock around a borrowed, configured world; no I/O or platform clock. */
import { LEGACY_GAME_ORDINARY_ENTRY,createLegacyGamePointer,snapshotLegacyGameInputContext,legacyInputFields,legacyInputInteger,legacyInputPair } from './legacy-game-input.mjs';
import { createLegacyGameClock } from './legacy-game-clock.mjs';
import { snapshotLegacyGameFrameRequest } from './legacy-game-frame.mjs';
import { legacyGameRuntimeWorld } from './legacy-game-protocol.mjs';
export const LEGACY_GAME_RUNTIME_PROFILE=Object.freeze({id:'legacy-se6000-37c4-runtime-v1',maximumUpdatesPerPump:20,worldOwnership:'borrowed',sourceTickSampling:'one-explicit-uint32-tick-per-pump',rightInteractions:'ordinary-turn-pickup-and-actor'});
export class LegacyGameRuntimeError extends Error{constructor(code){super('Game runtime requires a configured ordinary source world.');this.name='LegacyGameRuntimeError';this.code=code;}}
const fail=code=>{throw new LegacyGameRuntimeError(code);};
function safeCode(error){let code;try{code=Object.getOwnPropertyDescriptor(error??{},'code')?.value;}catch{code=null;}return typeof code==='string'&&/^LEGACY_[A-Z0-9_]{1,89}$/.test(code)?code:'LEGACY_RUNTIME_FRAME_FAILED';}
function ordinaryInput(movement, ownGateByte, modal) {
  const movementLock = movement.nativeMovementGuard || movement.nativeCoordinationGuard;
  return {hitIndex:modal?212:0, dialogIndex:modal?0:-1, inputOverride:0, cursorOverride:0, overlayA:0, overlayB:0, leftBlock:0,
    ownGateByte, nativePartyMode:movement.nativePartyMode, nativePartyFlags:movement.nativePartyFlags,
    nativeCoordinationGuard:modal?1:movement.nativeTurnGuard, nativeActionGuard:movement.nativeActionGuard,
    actionResetEligible:movement.nativeInputGuard===0&&!movementLock};
}
export function createLegacyGameRuntime(value,initialPointerRequestTick=0){
  const c=legacyInputFields(value,['world','initialTick','initialCamera']),world=legacyGameRuntimeWorld(c.world),clock=createLegacyGameClock(c.initialTick),pointer=createLegacyGamePointer(initialPointerRequestTick);
  const readFloat=n=>{if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))fail('LEGACY_RUNTIME_CAMERA');return Math.fround(n);};
  let camera=legacyInputPair(c.initialCamera,readFloat),status='open',busy=false,pumps=0,updates=0;
  const active=()=>{if(status!=='open')fail('LEGACY_RUNTIME_CLOSED');},entry=()=>{active();if(busy)fail('LEGACY_RUNTIME_REENTRANT');};
  return Object.freeze({
    move(value){entry();pointer.move(value);active();},
    press(button,doubleDown=false){entry();pointer.press(button,doubleDown);},
    release(button){entry();pointer.release(button);},
    resetButtons(){entry();pointer.resetButtons();},
    resetClock(tick){entry();clock.reset(tick);},
    synchronizeCamera(position){entry();camera=legacyInputPair(position,readFloat);},
    pump(value){entry();busy=true;try{
      const v=legacyInputFields(value,['tick','runtime','center','width','height','input','graphicsMode','forceRender']);
      const sourceInput = v.input === LEGACY_GAME_ORDINARY_ENTRY;
      const suppliedInput = sourceInput ? null : snapshotLegacyGameInputContext(v.input);
      const frame=snapshotLegacyGameFrameRequest({tick:v.tick,runtime:v.runtime,camera:[0,0],center:v.center,width:v.width,height:v.height});
      legacyInputInteger(v.graphicsMode);if(typeof v.forceRender!=='boolean')fail('LEGACY_RUNTIME_ARGUMENTS');active();
      if(world.inspect().state!=='open')fail('LEGACY_RUNTIME_WORLD_CLOSED');
      let input;
      if (!sourceInput) {
        const before=world.copyLocalMovement();
        input={...suppliedInput,...(world.copyPartyInputContext()??{})};
        if(input.ownGateByte!==frame.runtime.ownGateByte||['nativePartyMode','nativePartyFlags','nativeCoordinationGuard','nativeActionGuard'].some(k=>input[k]!==before.context[k]))fail('LEGACY_RUNTIME_CONTEXT_MISMATCH');
      }
      const gateBaseline = input?.ownGateByte ?? frame.runtime.ownGateByte;
      active();
      const ready=clock.begin(frame.tick);if(!ready.ready)return Object.freeze({kind:'game-runtime-pump',updates:0,requests:Object.freeze([]),inputUpdates:Object.freeze([]),frame:null,present:false,graphicsMode:v.graphicsMode,waitMilliseconds:ready.waitMilliseconds,error:null});
      const requests=[],inputUpdates=[];let count=0,selected=null,result=null,error=null,mode=v.graphicsMode;
      for(;;){
        try{
          const modal=world.mapDialogActive()||world.playerTradeActive()||world.craftActive();
          if(modal)pointer.resetButtons();
          const local=world.copyLocalMovement(),ownGateByte=world.resolveOwnGateByte(gateBaseline);
          const context=sourceInput ? ordinaryInput(local.context,ownGateByte,modal) :
            {...input,ownGateByte,nativePartyMode:local.context.nativePartyMode,nativePartyFlags:local.context.nativePartyFlags,
              nativeActionGuard:local.context.nativeActionGuard,nativeCoordinationGuard:modal?1:local.context.nativeCoordinationGuard};
          const action=pointer.step({tick:frame.tick,camera,center:frame.center,display:local.display,context});active();
          if(action.clearActionGuard&&local.context.nativeActionGuard!==0)world.setLocalMovementContext({...local.context,nativeActionGuard:0});
          if(action.rightPress&&action.advanceLocal){
            requests.push(...world.prepareMapRightClick(action.tile,frame.tick,gateBaseline));
            inputUpdates.push(Object.freeze({...action,rightInteractions:LEGACY_GAME_RUNTIME_PROFILE.rightInteractions}));
          }else inputUpdates.push(action);
          if(action.destination)world.requestLocalDestination(action.destination);
          result=world.advanceFrameFollowingLocal({...frame,camera},true);active();camera=result.camera;requests.push(...(result.movement?.requests??[]));requests.push(...world.advanceCraft(frame.tick).requests);
          pointer.endUpdate(mode);count++;updates++;
          if(result.actorFrameError||result.sceneFrameError)error=Object.freeze({code:result.sceneFrameError?.code??result.actorFrameError.code});
          const pacing=clock.finish(frame.tick,{graphicsMode:mode,forceRender:v.forceRender});mode=pacing.graphicsMode;
          if(pacing.present&&result.sceneLayer&&!error)result=world.prepareFramePresentation(result);
          selected=Object.freeze({pacing,frame:result});if(error||!pacing.repeat)break;
          if(count>=20)fail('LEGACY_RUNTIME_UPDATE_BUDGET');clock.begin(frame.tick);
        }catch(cause){const code=safeCode(cause);active();status='failed';error=Object.freeze({code});break;}
      }
      pumps++;return Object.freeze({kind:'game-runtime-pump',updates:count,requests:Object.freeze(requests),inputUpdates:Object.freeze(inputUpdates),frame:selected?.frame??null,
        present:!error&&(selected?.pacing.present??false),graphicsMode:mode,waitMilliseconds:selected?.pacing.waitMilliseconds??0,error});
    }finally{busy=false;}},
    copyScene(){entry();return world.copyScene();},
    copyState(){entry();return Object.freeze({profile:LEGACY_GAME_RUNTIME_PROFILE.id,pumps,updates,camera,pointer:pointer.copyState(),clock:clock.copyState()});},
    inspect(){return Object.freeze({profile:LEGACY_GAME_RUNTIME_PROFILE.id,state:status,busy,pumps,updates,worldOwnership:'borrowed',currentVersionCompatibility:'unverified'});},
    close(){pointer.close();clock.close();camera=Object.freeze([0,0]);if(status==='open')status='closed';},
  });
}

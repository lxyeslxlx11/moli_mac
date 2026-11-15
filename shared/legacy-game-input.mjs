/** Fixed37c4 pointer/pick and ordinary destination planning; no DOM or guessed wire commands. */
import { legacyGameFacingCode } from './legacy-game-motion.mjs';
export const LEGACY_GAME_INPUT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-input-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',playfieldY:456,destinationInterval:250,autoWalkThreshold:500});
export const LEGACY_GAME_ORDINARY_ENTRY = 'legacy-se6000-37c4';
export class LegacyGameInputError extends Error{constructor(code){super('Pointer input is outside the supported source profile.');this.name='LegacyGameInputError';this.code=code;}}
const fail=code=>{throw new LegacyGameInputError(code);};
export function legacyInputInteger(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_INPUT_INTEGER');return n===0?0:n;}
export function legacyInputFields(value,names){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_INPUT_FIELDS');}
  if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!Object.hasOwn(d[k]??{},'value')))fail('LEGACY_INPUT_FIELDS');return Object.fromEntries(names.map(k=>[k,d[k].value]));}
export function legacyInputPair(value,read=legacyInputInteger){if(!Array.isArray(value))fail('LEGACY_INPUT_PAIR');const d=legacyInputFields(value,['0','1','length']);if(d.length!==2)fail('LEGACY_INPUT_PAIR');return Object.freeze([read(d[0]),read(d[1])]);}
const float=n=>{if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))fail('LEGACY_INPUT_FLOAT');return Math.fround(n);};
const tick=n=>legacyInputInteger(n,0,0xffffffff),bool=n=>{if(typeof n!=='boolean')fail('LEGACY_INPUT_BOOLEAN');return n;};
export function unprojectLegacyGamePosition(screen,camera,center){
  const s=legacyInputPair(screen,float),c=legacyInputPair(camera,float),o=legacyInputPair(center),dx=s[0]-o[0],v=(s[1]-o[1])*Math.fround(4/3);
  return Object.freeze([float(dx-v+c[0]),float(v+dx+c[1])]);
}
export function pickLegacyGameTile(screen,camera,center){const world=unprojectLegacyGamePosition(screen,camera,center),scaled=world.map(n=>legacyInputInteger(Math.trunc(n+0.5)));
  return Object.freeze({position:world,pickedPosition:Object.freeze(scaled),tile:Object.freeze(scaled.map(n=>Math.trunc(((n+32)|0)/64)||0))});}
const contextNames=['hitIndex','dialogIndex','inputOverride','cursorOverride','overlayA','overlayB','leftBlock','ownGateByte','nativePartyMode','nativePartyFlags','nativeCoordinationGuard','nativeActionGuard','actionResetEligible'];
export function snapshotLegacyGameInputContext(value){const r=legacyInputFields(value,contextNames);for(const k of contextNames)r[k]=k==='actionResetEligible'?bool(r[k]):legacyInputInteger(r[k]);
  legacyInputInteger(r.ownGateByte,0,255);legacyInputInteger(r.nativePartyFlags,0,65535);return Object.freeze(r);}
export function createLegacyGamePointer(initialRequestTick=0){
  let state='open',screen=Object.freeze([0,0]),held=0,pressed=0,start=0,duration=0,autoWalk=0,lastRequestTick=tick(initialRequestTick),updates=0;
  const active=()=>{if(state!=='open')fail('LEGACY_INPUT_CLOSED');};
  const button=n=>{if(n!==0&&n!==2)fail('LEGACY_INPUT_BUTTON');return n===0?1:2;};
  return Object.freeze({
    move(value){active();const next=legacyInputPair(value);active();screen=next;},
    press(value,doubleDown=false){active();const mask=button(value);bool(doubleDown);held|=mask;pressed|=mask|(doubleDown?mask<<4:0);},
    release(value){active();const mask=button(value);held&=~mask;pressed|=mask<<2;},
    resetButtons(){active();held=0;pressed=0;},
    endUpdate(graphicsMode){active();legacyInputInteger(graphicsMode);if(graphicsMode!==0)pressed=0;},
    step(value){active();const r=legacyInputFields(value,['tick','camera','center','display','context']),now=tick(r.tick),display=legacyInputPair(r.display),c=snapshotLegacyGameInputContext(r.context),pick=pickLegacyGameTile(screen,r.camera,r.center);active();
      const base=c.hitIndex<212&&c.dialogIndex<0,inPlay=screen[1]<456,input=inPlay&&(base||c.inputOverride!==0||c.overlayA!==0||c.overlayB!==0),cursorTileHint=inPlay&&(base||c.cursorOverride!==0||c.overlayA!==0||c.overlayB!==0)&&autoWalk===0;
      let leftPress=false,leftHeld=false,rightPress=false,rightHeld=false;
      if(!input){duration=0;start=0;}else{
        if((pressed&1)&&c.leftBlock===0){leftPress=true;duration=0;start=now;}
        if(!(held&1)||c.leftBlock!==0){duration=0;start=0;}else{leftHeld=true;if(start!==0)duration=(now-start)>>>0;}
        if(pressed&2)rightPress=true;if((held&2)&&!rightPress)rightHeld=true;
      }
      const clearActionGuard=c.actionResetEligible,actionGuard=clearActionGuard?0:c.nativeActionGuard,advanceLocal=(c.ownGateByte&128)===0;
      let destination=null,cursorStyle=null;
      if(advanceLocal&&(c.nativePartyMode===0||(c.nativePartyFlags&256))&&c.nativeCoordinationGuard===0&&actionGuard===0){
        const request=()=>{if(((lastRequestTick+250)>>>0)<=now){lastRequestTick=now;destination=pick.tile;}};
        if(duration<500&&autoWalk!==1){if(leftPress)request();}
        else{if(duration>=500)autoWalk=1;if(!(pressed&1)){request();if(pick.tile[0]!==display[0]||pick.tile[1]!==display[1])cursorStyle=legacyGameFacingCode(pick.tile[0]-display[0],pick.tile[1]-display[1])+3;}else autoWalk=0;}
      }
      updates++;return Object.freeze({kind:'source-pointer-update',...pick,screenPosition:screen,leftPress,leftHeld,rightPress,rightHeld,duration,autoWalk,lastRequestTick,destination,cursorTileHint,cursorStyle,clearActionGuard,advanceLocal,
        rightInteractions:rightPress&&advanceLocal?'unmodeled':null,currentVersionCompatibility:'unverified'});
    },
    copyState(){active();return Object.freeze({screenPosition:screen,heldBits:held,pressedBits:pressed,startTick:start,duration,autoWalk,lastRequestTick,updates});},
    inspect(){return Object.freeze({profile:LEGACY_GAME_INPUT_PROFILE.id,state,updates});},
    close(){state='closed';screen=Object.freeze([0,0]);held=pressed=start=duration=autoWalk=lastRequestTick=0;},
  });
}

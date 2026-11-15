/** Ordinary local source frame projection. Explicit native context, cache waits and tile events; no timer or socket. */
import { LEGACY_GAME_NAVIGATION_PROFILE,planLegacyGamePath,findLegacyGameMissingMapRectangles,
  legacyGameTileFlag,classifyLegacyGameTileEventContext,legacyGameNavigationInfo } from './legacy-game-navigation.mjs';
import { legacyGameFacingCode,createLegacyGameMovementCommand } from './legacy-game-motion.mjs';
import { classifyLegacyGamePartyInput } from './legacy-game-party.mjs';
export const LEGACY_GAME_LOCAL_MOVEMENT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-local-movement-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',scope:'ordinary-local-source-frame-projection',
  nativeUIAndPartyLifecycle:'incomplete',nativeX87BitIdentity:'unverified'});
export class LegacyGameLocalMovementError extends Error{
  constructor(code){super('Local movement does not match the supported legacy source context.');this.name='LegacyGameLocalMovementError';this.code=code;}
}
const fail=code=>{throw new LegacyGameLocalMovementError(code);},f=Math.fround,directions=LEGACY_GAME_NAVIGATION_PROFILE.directions;
const facingAssignments=new WeakMap();
export function legacyGameLocalMovementFacingAssigned(owner){const control=facingAssignments.get(owner);if(!control)fail('LEGACY_LOCAL_OWNER');return control.assigned();}
export function legacyGameLocalMovementBodyFacing(owner,value){const control=facingAssignments.get(owner);if(!control)fail('LEGACY_LOCAL_OWNER');int32(value);control.body(value);}
const contextFields=['nativeInputGuard','nativeMovementGuard','nativeCoordinationGuard','nativePartyMode','nativePartyFlags','nativeTurnGuard','nativeActionGuard',
  'nativeEventSelector','nativeInteractionSequence','nativeArrivalCountdown','lastTurnTick'];
// The clock supplies nativeEventSelector after the server actor context arrives.
export const ordinaryLegacyGameMovement = Object.freeze({ nativeInputGuard: 0, nativeMovementGuard: 0,
  nativeCoordinationGuard: 0, nativePartyMode: 0, nativePartyFlags: 0, nativeTurnGuard: 0, nativeActionGuard: 0,
  nativeInteractionSequence: 0, nativeArrivalCountdown: 0, lastTurnTick: 0 });
function int32(n){if(!Number.isInteger(n)||n < -2147483648||n>2147483647)fail('LEGACY_LOCAL_INTEGER');return n|0;}
function short(n){int32(n);if(n < -32768||n>32767)fail('LEGACY_LOCAL_SHORT');return n|0;}
function tick(n){if(!Number.isInteger(n)||n<0||n>0xffffffff)fail('LEGACY_LOCAL_TICK');return n>>>0;}
function finite(n){if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(f(n)))fail('LEGACY_LOCAL_FLOAT');return f(n);}
function array(value,count,read=int32){
  if(!Array.isArray(value))fail('LEGACY_LOCAL_ARGUMENTS');let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_LOCAL_ARGUMENTS');}
  if(d.length?.value!==count||Reflect.ownKeys(d).length!==count+1)fail('LEGACY_LOCAL_ARGUMENTS');return Array.from({length:count},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_LOCAL_ARGUMENTS');return read(d[i].value);});
}
export function snapshotLegacyGameLocalDestination(value){return Object.freeze(array(value,2,short));}
export function snapshotLegacyGameLocalContext(value){
  let d;try{if(!value||typeof value!=='object')fail('LEGACY_LOCAL_CONTEXT');d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_LOCAL_CONTEXT');}
  if(Reflect.ownKeys(d).length!==contextFields.length)fail('LEGACY_LOCAL_CONTEXT');const result={};
  for(const key of contextFields){if(!Object.hasOwn(d[key]??{},'value'))fail('LEGACY_LOCAL_CONTEXT');result[key]=key==='lastTurnTick'?tick(d[key].value):int32(d[key].value);}
  if(result.nativePartyFlags<0||result.nativePartyFlags>65535)fail('LEGACY_LOCAL_CONTEXT');return Object.freeze(result);
}
const command=(id,args)=>Object.freeze({operationId:id,arguments:Object.freeze(args)});
export function createLegacyGameLocalMovement(origin,speed,facing,sourceContext,initialPhase=0,initialAnimation=0,initialMoving=false){
  if(typeof initialMoving!=='boolean')fail('LEGACY_LOCAL_ARGUMENTS');
  let display=array(origin,2,short),position=display.map(n=>f(n*64)),target=[...display],velocity=[0,0],moving=initialMoving,animation=int32(initialAnimation),phase=int32(initialPhase),closed=false;
  speed=int32(speed);facing=int32(facing);let context={...snapshotLegacyGameLocalContext(sourceContext)},route=[],queued=[],destination=null,finalFacing=-1,
    waiting=null,pendingInteraction=null,arrivedLast=false,frames=0;
  const active=()=>{if(closed)fail('LEGACY_LOCAL_CLOSED');};
  let facingAssigned=false,animationAssigned=false,bodyFacing=null;
  const copyState=()=>{active();return Object.freeze({profile:LEGACY_GAME_LOCAL_MOVEMENT_PROFILE.id,scope:LEGACY_GAME_LOCAL_MOVEMENT_PROFILE.scope,
    display:Object.freeze([...display]),position:Object.freeze([...position]),target:Object.freeze([...target]),velocity:Object.freeze([...velocity]),speed,facingCode:facing,moving,animation,phase,
    destination:destination?Object.freeze([...destination]):null,route:Object.freeze(route.map(p=>Object.freeze({direction:p.direction,coordinates:Object.freeze([...p.coordinates])}))),
    queuedDirections:Object.freeze([...queued]),finalFacing,arrivedLast,frames,context:Object.freeze({...context}),
    waitingForMap:waiting?Object.freeze({origin:Object.freeze([...waiting.origin]),direction:waiting.direction}):null,
    pendingInteraction:pendingInteraction?Object.freeze({...pendingInteraction}):null,nativeUIAndPartyLifecycle:'incomplete',currentVersionCompatibility:'unverified'});};
  function start(direction){
    const delta=directions[direction],next=[short(display[0]+delta[0]),short(display[1]+delta[1])],dx=f(next[0]*64-position[0]),dy=f(next[1]*64-position[1]),distance=f(Math.sqrt(dx*dx+dy*dy)),rate=f(speed*0.009999999776482582);
    const nx=distance>0?f(dx/distance):0,ny=distance>0?f(dy/distance):0;target=next;velocity=[f(nx*rate*4),f(ny*rate*4)];
    if(nx!==0||ny!==0){facing=legacyGameFacingCode(nx,ny);bodyFacing=facing;facingAssigned=true;moving=true;}
  }
  function advance(collision,scale=1){
    if(velocity[0]===0&&velocity[1]===0){if(moving){animation=0;phase=-1;animationAssigned=true;}moving=false;return;}
    const tx=f(target[0]*64),ty=f(target[1]*64),dx=tx-position[0],dy=ty-position[1];
    const vx=f(velocity[0]*scale),vy=f(velocity[1]*scale);
    if(vx*vx+vy*vy<dx*dx+dy*dy)position=[f(position[0]+vx),f(position[1]+vy)];
    else{
      position=[tx,ty];velocity=[0,0];arrivedLast=true;const next=position.map(n=>Math.trunc(n/64)|0);
      if(!collision.isBlocked(...next))display=next;
    }
    animation=1;animationAssigned=true;moving=true;
  }
  function interaction(requests){
    const event=pendingInteraction;pendingInteraction=null;route=[];queued=[];destination=null;target=[...display];position=display.map(n=>f(n*64));velocity=[0,0];
    context.nativeActionGuard=1;
    if(event.type===1)context.nativeMovementGuard=1;else context.nativeCoordinationGuard=1;
    requests.push(command('send-004f6530',[event.type===3?2:event.tileCode,context.nativeInteractionSequence,...display,event.type===3?event.facingCode:-1]));
    context.nativeInteractionSequence=(context.nativeInteractionSequence+1)|0;
    return Object.freeze({kind:'tile-interaction',type:event.type,tileCode:event.tileCode??2,nativeUIEffects:'unmodeled'});
  }
  function turn(direction,sceneFlag){
    facing=bodyFacing=direction;
    facingAssigned=true;
    return command('send-004f6470',[...display,new Uint8Array([direction+65]),sceneFlag]);
  }
  const api=Object.freeze({
    requestDestination(value){active();const next=array(value,2,short);active();destination=next;},
    setSpeed(value){active();speed=int32(value);},
    observeAnimation(value,nextPhase,nextFacing){active();int32(value);int32(nextPhase);int32(nextFacing);animation=value;phase=nextPhase;facing=nextFacing;bodyFacing=nextFacing;},
    turnFromRightClick(direction,sceneFlag){
      active();int32(direction);int32(sceneFlag);
      if(direction<0||direction>7)fail('LEGACY_LOCAL_FACING');
      if(velocity[0]!==0||velocity[1]!==0||context.nativeTurnGuard!==0||context.nativeActionGuard!==0)return null;
      return turn(direction,sceneFlag);
    },
    restorePosition(nextPosition,nextDisplay,nextTarget,nextVelocity,nextMoving){
      active();const p=array(nextPosition,2,finite),d=array(nextDisplay,2,short),t=array(nextTarget,2,short),v=array(nextVelocity,2,finite);
      if(typeof nextMoving!=='boolean')fail('LEGACY_LOCAL_ARGUMENTS');active();position=p;display=d;target=t;velocity=v;moving=nextMoving;
    },
    setContext(value){active();const next=snapshotLegacyGameLocalContext(value);active();context={...next};},
    synchronizeNetwork(x,y,nextFacing,collision){
      active();const point=[short(x),short(y)];int32(nextFacing);legacyGameNavigationInfo(collision);const blocked=collision.isBlocked(...point);active();
      position=point.map(n=>f(n*64));target=point;velocity=[0,0];facing=nextFacing;bodyFacing=nextFacing;if(!blocked)display=[...point];
    },
    step(collision,now,identity,sceneFlag){
      active();now=tick(now);const mapIdentity=array(identity,2);int32(sceneFlag);
      // This profile cannot silently assume native party/follower or countdown effects are absent.
      if(classifyLegacyGamePartyInput(context.nativePartyMode,context.nativePartyFlags).branch==='follower')fail('LEGACY_LOCAL_PARTY_UNMODELED');if(context.nativeArrivalCountdown>0)fail('LEGACY_LOCAL_COUNTDOWN_UNMODELED');
      legacyGameNavigationInfo(collision);active();facingAssigned=false;animationAssigned=false;const requests=[];let event=null,startedAt=null;
      if(waiting){
        if(findLegacyGameMissingMapRectangles(collision,waiting.origin,waiting.direction).length)return Object.freeze({kind:'local-movement-frame',state:'waiting-map',requests:Object.freeze([]),event:null});
        waiting=null;
      }
      const enabled=context.nativeInputGuard===0&&context.nativeMovementGuard===0&&context.nativeCoordinationGuard===0;
      if(enabled){
        if(pendingInteraction){
          if(arrivedLast&&pendingInteraction.remaining>0)pendingInteraction.remaining--;
          if(pendingInteraction.remaining<1){event=interaction(requests);frames++;return Object.freeze({kind:'local-movement-frame',state:'interaction',requests:Object.freeze(requests),event});}
        }
        if(position[0]===f(target[0]*64)&&position[1]===f(target[1]*64)){
          if(destination&&queued.length===0){
            const planned=planLegacyGamePath(collision,display,destination);destination=null;finalFacing=planned.finalFacing;
            if(!planned.preservePreviousRoute)route=[...planned.steps];
          }
          if(route.length===0&&queued.length===0){
            if(finalFacing>=0&&finalFacing<8&&velocity[0]===0&&velocity[1]===0&&context.nativeTurnGuard===0&&context.nativeActionGuard===0&&(bodyFacing??facing)!==finalFacing&&((context.lastTurnTick+500)>>>0)<now){
              requests.push(turn(finalFacing,sceneFlag));context.lastTurnTick=now;
            }
            finalFacing=-1;
          }
          if(route.length>0&&queued.length===0){
            const batch=route.slice(0,2);route=route.slice(batch.length);queued=batch.map(p=>p.direction);let [x,y]=display;
            for(let i=0;i<queued.length;i++){
              const d=directions[queued[i]];x+=d[0];y+=d[1];const code=legacyGameTileFlag(collision,[x,y]);
              const selector=classifyLegacyGameTileEventContext(context.nativeEventSelector),type1=[3,9,10,11,13].includes(code)||(code===6&&selector===3)||(code===7&&(selector===0||selector===1))||(code===8&&selector===2);
              if(code===2){pendingInteraction={type:3,remaining:i,facingCode:legacyGameFacingCode(d[0],d[1])};queued=queued.slice(0,i);route=[];break;}
              if(type1){pendingInteraction={type:1,remaining:i+1,tileCode:code};queued=queued.slice(0,i+1);route=[];break;}
            }
            const descriptor=createLegacyGameMovementCommand(display,new Uint8Array(queued),sceneFlag);if(descriptor)requests.push(descriptor);
          }
          if(queued.length){
            const direction=queued[0],missing=findLegacyGameMissingMapRectangles(collision,display,direction);
            for(const rect of missing)requests.push(command('send-004f6610',[...mapIdentity,...rect]));
            if(missing.length)waiting={origin:[...display],direction};queued=queued.slice(1);startedAt=Object.freeze([...display]);start(direction);
          }
        }
      }
      arrivedLast=false;if(!waiting)advance(collision);frames++;
      return Object.freeze({kind:'local-movement-frame',state:waiting?'waiting-map':'advanced',requests:Object.freeze(requests),event,...(startedAt?{startedAt}:{})});
    },
    copyState,
    close(){if(closed)return;closed=true;display=[0,0];position=[0,0];target=[0,0];velocity=[0,0];route=[];queued=[];destination=null;waiting=null;pendingInteraction=null;context={};},
  });
  const party=Object.freeze({
    begin(){active();if(context.nativeArrivalCountdown>0)fail('LEGACY_LOCAL_COUNTDOWN_UNMODELED');facingAssigned=false;animationAssigned=false;arrivedLast=false;},
    start(value,leaderSpeed){active();const next=array(value,2,short);int32(leaderSpeed);const dx=f(next[0]*64-position[0]),dy=f(next[1]*64-position[1]),distance=f(Math.sqrt(dx*dx+dy*dy)),nx=distance>0?f(dx/distance):0,ny=distance>0?f(dy/distance):0;
      target=next;velocity=[f(leaderSpeed*nx*4*0.01),f(leaderSpeed*ny*4*0.01)];if(nx!==0||ny!==0){facing=legacyGameFacingCode(nx,ny);bodyFacing=facing;facingAssigned=true;}},
    advance(collision,scale){active();legacyGameNavigationInfo(collision);scale=finite(scale);if(![1,f(1.2),f(1.6),2].includes(scale))fail('LEGACY_LOCAL_PARTY_SCALE');advance(collision,scale);frames++;return Object.freeze({kind:'local-movement-frame',state:'party-following',requests:Object.freeze([]),event:null});},
    hold(){active();frames++;return Object.freeze({kind:'local-movement-frame',state:'party-unbound',requests:Object.freeze([]),event:null});},
  });
  facingAssignments.set(api,{assigned(){active();return facingAssigned;},animation(){active();return animationAssigned;},body(value){active();bodyFacing=value;},party});return api;
}

/** Internal ownership bridge for actual source movement action writes. */
export function legacyGameLocalMovementAnimationAssigned(owner){const access=facingAssignments.get(owner);if(!access)fail('LEGACY_LOCAL_OWNER');return access.animation();}
/** Internal world-owned source4610f0/461370/461660 bridge; no socket or user callback. */
export function legacyGameLocalMovementPartyAccess(owner){const access=facingAssignments.get(owner);if(!access)fail('LEGACY_LOCAL_OWNER');return access.party;}

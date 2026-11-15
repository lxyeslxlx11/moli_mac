/** Fixed37c4 ordinary actor callbacks, source depth sort and owning actor-layer pixels. */
import { createLegacyGameAnimationPlayer } from './legacy-game-animation.mjs';
import { projectLegacyGamePosition } from './legacy-game-motion.mjs';
import { legacyGameActorFrameAccess } from './legacy-game-actors.mjs';
import { legacyGameGraphicResourceIdAt } from './legacy-game-graphics.mjs';
import { composeLegacyGameFrame } from './legacy-game-render.mjs';
import { createLegacyGameDrawPlan } from './legacy-game-draw-plan.mjs';
import {planLegacyGameActorRide,legacyGameActorRideOutcome,LEGACY_GAME_ACTOR_RIDE_PROFILE} from './legacy-game-actor-ride.mjs';
import {planLegacyGameActorAttachment} from './legacy-game-actor-attachment.mjs';
import {planLegacyGameActorPresentationAnchor} from './legacy-game-actor-presentation.mjs';
import {planLegacyGameActorBadgeAnchor} from './legacy-game-actor-badge.mjs';
import {createLegacyGameTextBatch} from './legacy-game-text.mjs';
import {composeLegacyGameTextFrame} from './legacy-game-text-render.mjs';
import {markLegacyGameWaterGraphic} from './legacy-game-water.mjs';
import { resolveLegacyGameActorFrameSource,createLegacyGameGraphicActorFilter } from './legacy-game-actor-context.mjs';
export const LEGACY_GAME_FRAME_PROFILE=Object.freeze({id:'legacy-se6000-37c4-ordinary-actor-frame-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',actors:1001,depthRecords:1024,sortStack:30,pixels:4194304});
export class LegacyGameFrameError extends Error{constructor(code){super('Actor frame input or ownership is outside the supported source profile.');this.name='LegacyGameFrameError';this.code=code;}}
const fail=code=>{throw new LegacyGameFrameError(code);};
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_FRAME_INTEGER');return n===0?0:n;}
function float(n){if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))fail('LEGACY_FRAME_FLOAT');return Math.fround(n);}
function fields(value,names,optional=[]){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_FRAME_FIELDS');}
  if(Reflect.ownKeys(d).some(k=>![...names,...optional].includes(k))||names.some(k=>!Object.hasOwn(d[k]??{},'value'))||Object.values(d).some(p=>!Object.hasOwn(p,'value')))fail('LEGACY_FRAME_FIELDS');return Object.fromEntries(Object.entries(d).map(([k,p])=>[k,p.value]));}
function array(value,max){if(!Array.isArray(value))fail('LEGACY_FRAME_ARRAY');let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_FRAME_ARRAY');}
  const n=int(d.length?.value,0,max);if(Reflect.ownKeys(d).length!==n+1)fail('LEGACY_FRAME_ARRAY');return Array.from({length:n},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_FRAME_ARRAY');return d[i].value;});}
function pair(value,read){const a=array(value,2);if(a.length!==2)fail('LEGACY_FRAME_PAIR');return Object.freeze(a.map(read));}
function runtime(value){const r=fields(value,['runtimeStage','ownGateByte','movementScale','soundScene','sparseMode']);
  for(const k of ['runtimeStage','soundScene','sparseMode'])r[k]=int(r[k]);r.ownGateByte=int(r.ownGateByte,0,255);r.movementScale=float(r.movementScale);return Object.freeze(r);}
function native(value){const s=fields(value,['unindexed','recordGateFlags','recordMotionFlags','recordTypeFlags','recordDrawFlags','bodyFlags','specialState','frozen','childAction']);
  if(typeof s.unindexed!=='boolean')fail('LEGACY_FRAME_BOOLEAN');for(const k of ['recordGateFlags','recordMotionFlags','recordDrawFlags','bodyFlags'])s[k]=int(s[k],0,0xffffffff);
  s.recordTypeFlags=int(s.recordTypeFlags,0,65535);s.specialState=int(s.specialState);s.frozen=int(s.frozen);if(s.childAction!==null)s.childAction=int(s.childAction);return Object.freeze(s);}
export function snapshotLegacyGameFrameRequest(value){const r=fields(value,['tick','runtime','camera','center','width','height']);r.tick=int(r.tick,0,0xffffffff);r.runtime=runtime(r.runtime);
  r.camera=pair(r.camera,float);r.center=pair(r.center,n=>int(n));r.width=int(r.width,1,4194304);r.height=int(r.height,1,Math.floor(4194304/r.width));return Object.freeze(r);}
export function planLegacyGameActorFrame(value){const p=fields(value,['local','action','queueLength','sceneMode','enginePhase','runtime','source'],['graphicCulling','sourceSpin','sourceRide','sourceMounted']);
  if(['graphicCulling','sourceSpin','sourceRide','sourceMounted'].some(k=>Object.hasOwn(p,k)&&typeof p[k]!=='boolean'))fail('LEGACY_FRAME_BOOLEAN');
  if(typeof p.local!=='boolean')fail('LEGACY_FRAME_BOOLEAN');int(p.action);int(p.queueLength,0,10);int(p.sceneMode);int(p.enginePhase,0,3);const r=runtime(p.runtime),s=native(p.source);
  const base={blocked:false,reason:'ordinary',supported:true,motionEnabled:false,helperCalls:0,mode:0,staticFlip:false,sortFlag:p.local?1:0};
  const blocked=reason=>Object.freeze({...base,blocked:true,reason});
  if((s.bodyFlags&0x40000)&&r.sparseMode===1&&p.enginePhase!==0)return blocked('engine-quarter-cadence');
  if(r.runtimeStage>=250&&r.runtimeStage<=252)return blocked('runtime-stage');
  if(p.local||s.unindexed){if(r.ownGateByte&0x80)return blocked('own-gate');}else if(s.recordGateFlags&0x80000000)return blocked('record-gate');
  if(s.specialState===3&&p.sourceSpin)return Object.freeze({...base,reason:'source-spin',helperCalls:null,sortFlag:0});
  if((s.specialState===1||s.specialState===2)&&p.sourceRide)return Object.freeze({...base,reason:'source-ride',helperCalls:null,motionEnabled:true,sortFlag:0});
  if(s.specialState!==0||(s.childAction!==null&&!p.sourceMounted)||((s.bodyFlags&0x400)&&!p.graphicCulling&&!p.sourceMounted))return Object.freeze({...base,supported:false,reason:'compound-or-culling-handler'});
  const motionSuppressed=!p.local&&(s.recordMotionFlags&0x02000000)!==0;
  const looping=!p.local&&(s.recordTypeFlags&0x100)?[3,0,1,18,19,13,15,11]:[12,13,14,15,1,0,16,3,6];
  const calls=motionSuppressed?1+Number(r.movementScale>=Math.fround(1.2))+Number(r.movementScale>=Math.fround(1.6)):
    1+Number(p.queueLength>=2)+Number(p.queueLength>=4);
  return Object.freeze({...base,motionEnabled:!p.local&&!motionSuppressed,helperCalls:calls,mode:looping.includes(p.sourceMounted&&!( !p.local&&(s.recordTypeFlags&0x100))?s.childAction:p.action)?0:1,
    staticFlip:p.sceneMode===1&&!p.local&&(s.recordDrawFlags&0x1000)!==0&&(s.recordDrawFlags&0x400380)===0});
}
function compare(a,b){const x=a.position[0]-a.position[1],y=b.position[0]-b.position[1];if(x<y)return-1;if(x>y)return 1;
  if(a.position[0]===b.position[0]&&a.position[1]===b.position[1]){if(b.sortFlag)return 1;if(a.sortFlag)return-1;}
  return a.ordinal<=b.ordinal?-1:1;
}
/** Source51c1a2 partition and51c2f6 selection paths preserve the non-reflexive comparator. */
function nativeSort(a){if(a.length<2)return a;let lo=0,hi=a.length-1;const pending=[],push=(l,h)=>{if(pending.length>=30)fail('LEGACY_FRAME_SORT_STACK');pending.push([l,h]);};const swap=(i,j)=>{if(i!==j)[a[i],a[j]]=[a[j],a[i]];};
  for(;;){const n=hi-lo+1;if(n>8){swap(lo+Math.floor(n/2),lo);let i=lo,j=hi+1;
      for(;;){do{i++;}while(i<=hi&&compare(a[i],a[lo])<=0);do{j--;}while(j>lo&&compare(a[j],a[lo])>=0);if(i>j)break;swap(i,j);}
      swap(lo,j);
      if((j-lo)*52-1<(hi-i)*52){if(i<hi)push(i,hi);if(lo+1<j){hi=j-1;continue;}}
      else{if(lo+1<j)push(lo,j-1);if(i<hi){lo=i;continue;}}
    }else{for(let end=hi;lo<end;end--){let best=lo;for(let i=lo+1;i<=end;i++)if(compare(a[i],a[best])>0)best=i;swap(best,end);}}
    if(!pending.length)return a;[lo,hi]=pending.pop();
  }
}
export function sortLegacyGameActorDepth(value){const seen=new Set(),a=array(value,1024).map(row=>{const r=fields(row,['position','sortFlag','ordinal']);
  r.position=pair(r.position,n=>{n=float(n);if(n < -2147483648||n>2147483648)fail('LEGACY_FRAME_DEPTH_BOUNDS');return n;});r.sortFlag=int(r.sortFlag,0,1);r.ordinal=int(r.ordinal,0,1023);
  if(seen.has(r.ordinal))fail('LEGACY_FRAME_DEPTH_ORDINAL');seen.add(r.ordinal);return r;});return Object.freeze(nativeSort(a).map(r=>r.ordinal));}

/** Internal world/actor composition. Providers supply source context and prepared resource handles. */
export function createLegacyGameActorFrameController(actorOwner,value){const c=fields(value,['animations','graphics','source','geometry','initialPhase'],['sprite','deferImages','bindActorSource','rasterText']);if(['deferImages','bindActorSource'].some(k=>Object.hasOwn(c,k)&&typeof c[k]!=='boolean'))fail('LEGACY_FRAME_BOOLEAN');c.deferImages??=false;c.bindActorSource??=false;if(Object.hasOwn(c,'rasterText')&&typeof c.rasterText!=='function')fail('LEGACY_FRAME_PROVIDER');
  for(const key of ['source','geometry',...(!c.deferImages||Object.hasOwn(c,'sprite')?['sprite']:[])])if(typeof c[key]!=='function')fail('LEGACY_FRAME_PROVIDER');int(c.initialPhase,0,3);
  const access=legacyGameActorFrameAccess(actorOwner);access.version();legacyGameGraphicResourceIdAt(c.graphics,0);const probe=createLegacyGameAnimationPlayer(c.animations);probe.close();
  let status='open',phase=c.initialPhase,busy=false,frames=0,last=null,lastRoots=Object.freeze([]),lastLabelRuns=Object.freeze([]),lastOverlays=Object.freeze([]);const players=new Map(),childPlayers=new Map();
  const closePlayers=()=>{for(const p of players.values())p.close();players.clear();for(const p of childPlayers.values())p.close();childPlayers.clear();};
  const active=()=>{if(status!=='open')fail('LEGACY_FRAME_CLOSED');};
  const synchronize=()=>{active();const entries=access.entries(),live=new Set(entries.map(e=>e.key)),children=new Set(entries.flatMap(e=>access.children(e.key).map(c=>c.key)));for(const [key,p]of players)if(!live.has(key)){p.close();players.delete(key);}for(const [key,p]of childPlayers)if(!children.has(key)){p.close();childPlayers.delete(key);}};
  return Object.freeze({
    synchronize,
    resetForReturn(value){active();if(busy)fail('LEGACY_FRAME_REENTRANT');int(value,0,3);closePlayers();phase=value;last=null;lastRoots=Object.freeze([]);lastLabelRuns=Object.freeze([]);lastOverlays=Object.freeze([]);},
    copySceneRoots(){active();if(busy)fail('LEGACY_FRAME_REENTRANT');return lastRoots;},
    copyLabelRuns(){active();if(busy)fail('LEGACY_FRAME_REENTRANT');return lastLabelRuns;},
    copySceneOverlays(){active();if(busy)fail('LEGACY_FRAME_REENTRANT');return lastOverlays;},
    inspect(){return Object.freeze({profile:LEGACY_GAME_FRAME_PROFILE.id,state:status,advancing:busy,enginePhase:phase,frames,players:players.size,childPlayers:childPlayers.size,last,scope:'ordinary-actor-layer',nativeSceneAndInput:'incomplete'});},
    step(request,sceneMode,labelMode=0,barsVisible=false){active();if(busy)fail('LEGACY_FRAME_REENTRANT');const r=snapshotLegacyGameFrameRequest(request);int(sceneMode);int(labelMode);if(typeof barsVisible!=='boolean')fail('LEGACY_FRAME_BOOLEAN');if((labelMode!==0||barsVisible)&&!c.bindActorSource)fail('LEGACY_FRAME_LABEL_SOURCE_REQUIRED');synchronize();
      const lease=access.version(),assert=()=>{active();if(access.version()!==lease)fail('LEGACY_FRAME_ACTORS_CHANGED');};
      const frameRuntime=c.bindActorSource?Object.freeze({...r.runtime,ownGateByte:access.ownGateByte(r.runtime.ownGateByte)}):r.runtime;
      const entries=access.entries();if(entries.length>1001)fail('LEGACY_FRAME_ACTOR_BUDGET');
      busy=true;let graphicFilter=null;
      try{const prepared=entries.map(e=>{const baseline=native(c.source(e.actor));assert();let s=c.bindActorSource?resolveLegacyGameActorFrameSource(e.actor,baseline):baseline;
          if(c.bindActorSource&&!e.actor.local&&(e.actor.presentation.secondaryKnownMask&0x80))s=Object.freeze({...s,recordGateFlags:((s.recordGateFlags&0x7fffffff)|((e.actor.presentation.secondary&0x80)?0x80000000:0))>>>0});
          const spin=c.bindActorSource&&e.actor.specialSpin?.state===3,ride=c.bindActorSource&&[1,2].includes(e.actor.ride?.state),mounted=c.bindActorSource&&!!e.actor.ride?.child;
          if(c.bindActorSource&&(e.actor.specialSpin||e.actor.ride))s=Object.freeze({...s,specialState:spin?3:e.actor.ride?.state??e.actor.specialSpin.state,childAction:mounted?e.actor.ride.child.action:s.childAction});
          const plan=planLegacyGameActorFrame({local:e.actor.local,action:e.actor.motion.animation,queueLength:e.actor.motion.queue.length,sceneMode,enginePhase:phase,runtime:frameRuntime,source:s,graphicCulling:c.bindActorSource,sourceSpin:spin,sourceRide:ride,sourceMounted:mounted});
          if(!plan.blocked&&(!plan.supported||(!spin&&c.bindActorSource&&e.actor.sourceControlUnmodeled)))fail('LEGACY_FRAME_SOURCE_HANDLER_UNMODELED');return{...e,source:s,plan,spin,ride,mounted};});
        if(c.bindActorSource&&prepared.some(e=>!e.plan.blocked&&!e.spin&&!e.mounted&&!e.ride&&(e.source.bodyFlags&0x400))){const point=entries.find(e=>e.actor.local)?.actor.motion.display;
          if(!point)fail('LEGACY_FRAME_LOCAL_CULLING_CONTEXT_REQUIRED');graphicFilter=createLegacyGameGraphicActorFilter(point);}
        const roots=[],results=[],events=[],removals=[],labelRuns=[],overlays=[],chatSpeech=[];let helperCalls=0,childSubmissions=0;
        for(const entry of prepared){assert();if(entry.plan.blocked){results.push(Object.freeze({id:entry.actor.id,local:entry.actor.local,state:'blocked',reason:entry.plan.reason,helperCalls:0}));continue;}
          const childPlayer=child=>{if(child.resolvedResourceId===null)fail('LEGACY_FRAME_RESOURCE_CONTEXT_REQUIRED');let p=childPlayers.get(child.key);if(!p){p=createLegacyGameAnimationPlayer(c.animations);childPlayers.set(child.key,p);}if(child.phase===-1)p.invalidate();return p;};
          const screenAt=actor=>projectLegacyGamePosition(actor.motion.position,r.camera,r.center).map(n=>{const k=Math.trunc(n+0.5);if(k < -2147483648||k>2147483647)fail('LEGACY_FRAME_SCREEN_BOUNDS');return k|0;});
          const short=n=>(n<<16)>>16;
          const commandFor=(p,at,actor,flags=null,rawAnchor=false)=>{const q=p.copyState();if(!q.geometry||q.graphicIndex<1000)return null;let command;
            if(c.deferImages)command=p.drawPlan(...at);else{const sprite=c.sprite(Object.freeze({index:q.graphicIndex,paletteSelector:q.paletteSelector,flags:flags??q.drawFlags,color:q.color}),actor);assert();command=p.drawCommand(sprite,...at);}
            const x=short(at[0]+(rawAnchor?0:q.drawOffsetX-q.geometry.originX))+q.geometry.originX,y=short(at[1]+(rawAnchor?0:q.drawOffsetY-q.geometry.originY))+q.geometry.originY;
            return markLegacyGameWaterGraphic(Object.freeze({...command,x,y,...(flags===null?{}:{flip:flags&3,...(command.image?{image:Object.freeze({...command.image,flags})}:command.blend||(flags&8)?{blend:flags&8?'additive':'source-over'}:{})})}),q.graphicIndex);};
          const stepChild=(child,kind,mode,facing,actor,eventPosition=[0,0])=>{const icon=['badge','primary','transient','side'].includes(kind),p=childPlayer(child),update=p.step({resourceId:child.resolvedResourceId,action:child.action,facing,speedPercent:100,mode,frozen:0,staticFlip:false,soundScene:r.runtime.soundScene,actorFlags:icon?0x20:kind==='child'?0x234:0x34},query=>{const g=c.geometry(query,actor);assert();return g;});assert();helperCalls++;
            access.childPhase(entry.key,kind,p.copyState().lastAction);if(update.event)events.push(Object.freeze({...update.event,actorId:actor.id,child:kind,screenPosition:Object.freeze([...eventPosition])}));return{player:p,update};};
          if(entry.ride){
            let actor=access.advance(entry.key,true,true);actor=access.beginRide(entry.key);assert();const child=access.child(entry.key,'child');
            if(!child){results.push(Object.freeze({id:actor.id,local:actor.local,state:'advanced',helperCalls:0,handler:'source-ride',motion:actor.motion,ride:actor.ride}));continue;}
            const cp=childPlayer(child),previous=cp.copyState(),ridePlan=planLegacyGameActorRide({state:entry.actor.ride.state,counter:entry.actor.ride.counter,attachmentX:previous.attachmentX,attachmentY:previous.attachmentY});
            let player=players.get(entry.key);if(!player){player=createLegacyGameAnimationPlayer(c.animations);players.set(entry.key,player);}if(actor.motion.phase===-1)player.invalidate();
            if(actor.resolvedResourceId===null)fail('LEGACY_FRAME_RESOURCE_CONTEXT_REQUIRED');const screen=screenAt(entry.actor),at=screen.map((n,i)=>{const v=n+ridePlan.offset[i];if(v < -2147483648||v>2147483647)fail('LEGACY_FRAME_SCREEN_BOUNDS');return v|0;});
            const update=player.step({resourceId:actor.resolvedResourceId,action:11,facing:actor.motion.facingCode,speedPercent:100,mode:0,frozen:entry.source.frozen,staticFlip:false,soundScene:r.runtime.soundScene,actorFlags:entry.source.bodyFlags},query=>{const g=c.geometry(query,actor);assert();return g;});assert();helperCalls++;
            if(update.event)events.push(Object.freeze({...update.event,actorId:actor.id,screenPosition:Object.freeze([...screen])}));const animation=player.copyState();access.phase(entry.key,animation.lastAction);
            stepChild(child,'child',0,actor.motion.facingCode,actor);const childAnimation=cp.copyState(),effect=access.effect(entry.key,ridePlan.effectResource),ep=stepChild(effect,'effect',0,0,actor).player,effectAnimation=ep.copyState();
            const before=[],after=[];if(childSubmissions++<1024)after.push(commandFor(cp,screen,actor));if(childSubmissions++<1024)before.push(commandFor(ep,screen,actor));
            const command=commandFor(player,at,actor),g=animation.geometry,ordinal=roots.length;
            roots.push(Object.freeze({position:Object.freeze([actor.motion.position[0],Math.fround(actor.motion.position[1]+LEGACY_GAME_ACTOR_RIDE_PROFILE.depthEpsilon)]),screenPosition:Object.freeze([short(at[0]+animation.drawOffsetX-(g?.originX??0)),short(at[1]+animation.drawOffsetY-(g?.originY??0))]),sortFlag:0,ordinal,command,commands:Object.freeze([...before,command,...after].filter(Boolean)),graphicIndex:animation.graphicIndex,id:actor.id}));
            const outcome=legacyGameActorRideOutcome(ridePlan.state,ridePlan.counter,ridePlan.offset[1],childAnimation.attachmentY),current=access.finishRide(entry.key,outcome);assert();
            for(const soundId of [ridePlan.startSound,outcome.sound])if(soundId!==null)events.push(Object.freeze({kind:'sound',value:soundId,actorId:actor.id,screenPosition:Object.freeze([...screen])}));
            results.push(Object.freeze({id:actor.id,local:actor.local,state:'advanced',handler:'source-ride',helperCalls:3,motion:current.motion,screenPosition:Object.freeze(at),animation,childAnimation,effectAnimation,ridePlan,ride:current.ride,code:update.code,reason:update.reason}));continue;
          }
          let actor,spinPlan=null,probeCode=null,calls=0;
          if(entry.spin){const started=access.beginSpin(entry.key);actor=started.actor;spinPlan=started.plan;}else actor=access.advance(entry.key,entry.plan.motionEnabled);
          assert();if(actor.resolvedResourceId===null)fail('LEGACY_FRAME_RESOURCE_CONTEXT_REQUIRED');
          const plan=planLegacyGameActorFrame({local:actor.local,action:actor.motion.animation,queueLength:actor.motion.queue.length,sceneMode,enginePhase:phase,runtime:frameRuntime,source:entry.mounted?{...entry.source,childAction:actor.ride.child.action}:entry.source,graphicCulling:c.bindActorSource,sourceSpin:entry.spin,sourceMounted:entry.mounted});
          let player=players.get(entry.key);if(!player){player=createLegacyGameAnimationPlayer(c.animations);players.set(entry.key,player);}
          if(actor.motion.phase===-1)player.invalidate();
          const projected=projectLegacyGamePosition(actor.motion.position,r.camera,r.center),screen=projected.map(n=>{const k=Math.trunc(n+0.5);if(k < -2147483648||k>2147483647)fail('LEGACY_FRAME_SCREEN_BOUNDS');return k|0;});
          const eventPosition=entry.spin?projected.map(n=>Math.trunc(n)|0):screen;
          if(spinPlan)for(let i=0;i<2;i++){const next=screen[i]+spinPlan.offset[i];if(next < -2147483648||next>2147483647)fail('LEGACY_FRAME_SCREEN_BOUNDS');screen[i]=next|0;}
          const context={resourceId:actor.resolvedResourceId,speedPercent:100,frozen:entry.source.frozen,staticFlip:plan.staticFlip,soundScene:r.runtime.soundScene,actorFlags:entry.source.bodyFlags};
          let update;
          const invoke=mode=>{update=player.step({...context,action:actor.motion.animation,facing:actor.motion.facingCode,mode},query=>{const g=c.geometry(query,actor);assert();return g;});helperCalls++;calls++;
            if(update.event)events.push(Object.freeze({...update.event,actorId:actor.id,screenPosition:Object.freeze([...eventPosition])}));return update;};
          if(entry.spin){if(spinPlan.kind==='finish-probe'){probeCode=invoke(1).code;actor=access.probeSpin(entry.key,probeCode);assert();}invoke(0);}
          else for(let i=0;i<plan.helperCalls;i++)invoke(plan.mode);
          let animation=player.copyState();access.phase(entry.key,animation.lastAction);assert();let command=null,childAnimation=null,childCommand=null;const baseScreen=[...screen];
          if(entry.mounted&&!entry.spin){const child=access.child(entry.key,'child'),cp=stepChild(child,'child',plan.mode,actor.motion.facingCode,actor).player;calls++;childAnimation=cp.copyState();childCommand=commandFor(cp,screen,actor);for(let i=0;i<2;i++){const v=screen[i]+(i===0?childAnimation.attachmentX:childAnimation.attachmentY);if(v < -2147483648||v>2147483647)fail('LEGACY_FRAME_SCREEN_BOUNDS');screen[i]=v|0;}
            const flags=(animation.drawFlags&~4)|((actor.resolvedResourceId>=0x1af0e&&actor.resolvedResourceId<=0x1af25)?4:0);animation=Object.freeze({...animation,drawFlags:flags});command=commandFor(player,screen,actor,flags);}

          const advanceBadge=hasRoot=>{if(!c.bindActorSource||entry.spin)return null;const projection=access.prepareBadge(entry.key);if(projection.action!=='advance')return Object.freeze({plan:projection,helperCalls:0,queued:false,command:null});
            const child=access.child(entry.key,'badge'),{player:p,update}=stepChild(child,'badge',0,0,actor,baseScreen);calls++;const q=p.copyState(),g=q.geometry,queued=hasRoot&&childSubmissions++<1024;
            const at=planLegacyGameActorBadgeAnchor({parentResource:actor.resolvedResourceId,screenX:baseScreen[0],screenY:baseScreen[1],offsetX:q.drawOffsetX,offsetY:q.drawOffsetY,originX:g?.originX??0,originY:g?.originY??0});let command=null;
            if(queued&&g&&q.graphicIndex>=1000){const image=Object.freeze({index:q.graphicIndex,paletteSelector:0,flags:0,color:0xffffffff}),style={x:at[0]+g.originX,y:at[1]+g.originY,priority:10,flip:0};
              if(c.deferImages)command=Object.freeze({...style,image,expectedDimensions:Object.freeze([g.width,g.height])});else{const sprite=c.sprite(image,actor);assert();command=Object.freeze({...style,sprite});}}
            markLegacyGameWaterGraphic(command,q.graphicIndex);return Object.freeze({plan:projection,helperCalls:1,animation:q,screenPosition:at,code:update.code,reason:update.reason,queued,command});};
          const advanceAttachment=hasRoot=>{if(!c.bindActorSource||!actor.attached||entry.spin)return null;const child=access.prepareAttachment(entry.key),projection=planLegacyGameActorAttachment({parentAction:actor.motion.animation,screenPosition:baseScreen,bodyAttachment:[animation.attachmentX,animation.attachmentY],mountAttachment:childAnimation?[childAnimation.attachmentX,childAnimation.attachmentY]:null});
            const {player,update}=stepChild(child,'attachment',0,actor.motion.facingCode,actor);calls++;const queued=hasRoot&&update.code===0&&childSubmissions++<1024;
            return Object.freeze({animation:player.copyState(),plan:projection,code:update.code,reason:update.reason,queued,command:queued?commandFor(player,projection.screenPosition,actor):null});};
          const advancePresentation=hasRoot=>{if(!c.bindActorSource||entry.spin)return null;const projection=access.preparePresentation(entry.key,entry.source.bodyFlags),icons=[],commands=[];
            if(projection.transientSound!==null)events.push(Object.freeze({kind:'sound',value:projection.transientSound,actorId:actor.id,child:'transient-create',screenPosition:Object.freeze([...baseScreen])}));
            for(const kind of ['primary','transient','side']){if(kind==='side')access.finishPresentation(entry.key,projection.expirationClearMask);const child=access.child(entry.key,kind);if(!child||(kind==='transient'&&!projection.transientVisible))continue;
              const p=childPlayer(child),prior=p.copyState(),at=planLegacyGameActorPresentationAnchor({parentResource:actor.resolvedResourceId,screenX:baseScreen[0],screenY:baseScreen[1],previousOffsetX:prior.drawOffsetX,previousOffsetY:prior.drawOffsetY,previousOriginX:prior.geometry?.originX??0,previousOriginY:prior.geometry?.originY??0,shift:kind==='primary'?projection.primaryShift:kind==='side'?projection.sideShift:0});
              const {update}=stepChild(child,kind,0,0,actor,at);calls++;const q=p.copyState(),queued=hasRoot&&childSubmissions++<1024,command=queued?commandFor(p,at,actor,q.drawFlags|4,true):null;
              if(command)commands.push(command);icons.push(Object.freeze({kind,screenPosition:at,animation:q,code:update.code,reason:update.reason,queued,command}));}
            const current=access.current(entry.key);assert();
            return Object.freeze({plan:projection,icons:Object.freeze(icons),commands:Object.freeze(commands),source:current.presentation});};
          const advanceVitals=()=>{if(!c.bindActorSource||entry.spin)return null;const plan=access.vitals(entry.key,entry.source.bodyFlags,baseScreen,barsVisible);if(!plan)return null;const rows=[];
            for(const draw of plan.draws){const g=fields(c.geometry(Object.freeze({kind:'resource',value:draw.resourceId}),actor),['index','originX','originY','width','height']);assert();int(g.index,1000,849999);int(g.originX,-32768,32767);int(g.originY,-32768,32767);int(g.width,1,32767);int(g.height,1,32767);
              const image=Object.freeze({index:g.index,paletteSelector:0,flags:4,color:0xffffffff}),position=draw.kind==='fill'?[draw.x,draw.y]:[(draw.x+g.originX)|0,(draw.y+g.originY)|0],style={x:position[0],y:position[1],priority:207,flip:0,coordinateMode:'int32',...(draw.kind==='fill'?{sourceRectangle:Object.freeze([short(-16-g.originX),short(-1-g.originY),draw.sourceWidth,2])}:{})};
              let command;if(c.deferImages)command=Object.freeze({...style,image,expectedDimensions:Object.freeze([g.width,g.height])});else{const sprite=c.sprite(image,actor);assert();command=Object.freeze({...style,sprite});}markLegacyGameWaterGraphic(command,g.index);const row=Object.freeze({id:actor.id,kind:draw.kind,command});overlays.push(row);rows.push(row);}
            return Object.freeze({plan,overlays:Object.freeze(rows)});};
          const advanceLabel=()=>{if(!c.bindActorSource||entry.spin||labelMode<1)return null;const run=access.label(entry.key,labelMode,entry.source.bodyFlags,actor.resolvedResourceId,baseScreen);if(run&&labelRuns.length<4096)labelRuns.push(run);return run;};
          if(!entry.spin&&!entry.mounted&&graphicFilter&&(entry.source.bodyFlags&0x400)){const filtered=graphicFilter.submit({local:actor.local,graphicIndex:animation.graphicIndex,coordinates:actor.motion.display});
            if(!filtered.visible){if(filtered.remove)removals.push(entry.key);const badge=filtered.remove?null:advanceBadge(false),label=filtered.remove?null:advanceLabel(),vitals=filtered.remove?null:advanceVitals(),presentation=filtered.remove?null:advancePresentation(false),attachment=filtered.remove?null:advanceAttachment(false);results.push(Object.freeze({id:actor.id,local:actor.local,state:'culled',reason:filtered.reason,helperCalls:calls,animation,...(badge?{badge}:{}),...(label?{label}:{}),...(vitals?{vitals}:{}),...(presentation?{presentation}:{}),...(attachment?{attachment}: {})}));continue;}}
          const declaredResource=animation.graphicIndex<0?0xffffffff:legacyGameGraphicResourceIdAt(c.graphics,animation.graphicIndex);
          if(!entry.mounted&&declaredResource!==1&&animation.geometry&&animation.graphicIndex>=1000){if(c.deferImages)command=player.drawPlan(...screen);else{const sprite=c.sprite(Object.freeze({index:animation.graphicIndex,paletteSelector:animation.paletteSelector,flags:animation.drawFlags,color:animation.color}),actor);assert();command=player.drawCommand(sprite,...screen);}}
          const badge=advanceBadge(true),ordinal=roots.length,g=animation.geometry,children=entry.mounted&&!entry.spin&&childSubmissions++<1024?[childCommand].filter(Boolean):[],label=advanceLabel(),presentation=advancePresentation(true),attachment=advanceAttachment(true),vitals=advanceVitals();
          if(c.bindActorSource&&!entry.spin&&!entry.mounted){
            const speech=access.copyChatSpeech(entry.key,r.tick,actor.resolvedResourceId,baseScreen,entry.source.bodyFlags);
            if(speech)chatSpeech.push(Object.freeze({actorId:actor.id,...speech}));
          }
          roots.push(Object.freeze({position:actor.motion.position,screenPosition:Object.freeze([short(screen[0]+animation.drawOffsetX-(g?.originX??0)),short(screen[1]+animation.drawOffsetY-(g?.originY??0))]),
            sortFlag:plan.sortFlag,ordinal,command,...((entry.mounted&&!entry.spin)||attachment||presentation||badge?{commands:Object.freeze([badge?.command,...(presentation?.commands??[]),attachment?.command,command,...children].filter(Boolean))}:{}),graphicIndex:animation.graphicIndex,id:actor.id}));
          const current=entry.spin?access.finishSpin(entry.key,entry.actor.specialSpin.counter,probeCode):access.current(entry.key);assert();
          results.push(Object.freeze({id:actor.id,local:actor.local,state:'advanced',helperCalls:calls,motion:current.motion,screenPosition:Object.freeze(screen),animation,code:update.code,reason:update.reason,...(badge?{badge}:{}),...(label?{label}:{}),...(vitals?{vitals}:{}),...(presentation?{presentation}:{}),...(attachment?{attachment}:{}),
            ...(entry.spin?{handler:'source-spin',specialSpin:current.specialSpin,probeCode}:entry.mounted?{handler:'source-mounted',childAnimation,ride:current.ride}:{} )}));
        }
        const queueOrder=sortLegacyGameActorDepth(roots.map(({position,sortFlag,ordinal})=>({position,sortFlag,ordinal}))),commands=[],drawActors=[],drawLimit=labelRuns.length?4095:4096;
        for(const row of overlays)if(commands.length<drawLimit){commands.push(row.command);drawActors.push(row.id);}
        for(const i of queueOrder){const root=roots[i],resource=root.graphicIndex<0?0xffffffff:legacyGameGraphicResourceIdAt(c.graphics,root.graphicIndex);
          if(resource!==1)for(const command of root.commands??[root.command])if(command&&commands.length<drawLimit){commands.push(command);drawActors.push(root.id);}}
        const text=labelRuns.length?createLegacyGameTextBatch(labelRuns):undefined;assert();const output=c.deferImages?createLegacyGameDrawPlan(r.width,r.height,commands,text):text?composeLegacyGameTextFrame(r.width,r.height,commands,text,c.rasterText):composeLegacyGameFrame(r.width,r.height,commands);assert();
        if(removals.length){access.removeEntries(removals);for(const key of removals){players.get(key)?.close();players.delete(key);}}
        synchronize();lastRoots=Object.freeze(roots);lastLabelRuns=Object.freeze(labelRuns);lastOverlays=Object.freeze(overlays);phase=(phase+1)%4;frames++;
        last=Object.freeze({actors:results.length,submitted:commands.length,helperCalls,events:events.length,...(overlays.length?{overlays:overlays.length}:{})});
        return Object.freeze({profile:LEGACY_GAME_FRAME_PROFILE.id,scope:'ordinary-actor-layer',width:output.width,height:output.height,...(c.deferImages?{drawPlan:output}:{rgba:output.rgba}),
          actors:Object.freeze(results),events:Object.freeze(events),queueOrder,submittedActorIds:Object.freeze(drawActors),drawOrderActorIds:Object.freeze(output.drawOrder.map(i=>drawActors[i])),
          ...(chatSpeech.length?{chatSpeech:Object.freeze(chatSpeech)}:{}),
          enginePhase:phase,helperCalls,rasterOperations:output.rasterOperations,currentVersionCompatibility:'unverified'});
      }catch(error){if(status==='open')status='failed';closePlayers();lastRoots=Object.freeze([]);lastLabelRuns=Object.freeze([]);lastOverlays=Object.freeze([]);throw error;}finally{graphicFilter?.close();busy=false;}
    },
    close(){if(status==='closed')return;status='closed';closePlayers();last=null;lastRoots=Object.freeze([]);lastLabelRuns=Object.freeze([]);lastOverlays=Object.freeze([]);},
  });
}

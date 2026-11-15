/** Fixed legacy actor records, ordinary movement, mounted and attached children; no original objects, assets or UI execution. */
import { splitLegacyGameStateFields as fields,unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateBase62 as base62,readLegacyGameStateDecimal as decimal } from './legacy-game-state.mjs';
import { createLegacyGameActorMotion as motion,classifyLegacyGameActorResource as grade,
  resolveLegacyGameActorResource as resolve } from './legacy-game-motion.mjs';
import { LEGACY_GAME_ACTOR_CONTEXT_PROFILE,legacyGameActorRecordTypeFlags,legacyGameActorRecordDrawFlags,legacyGameActorInitialFacing } from './legacy-game-actor-context.mjs';
import {planLegacyGameActorSpin,legacyGameActorSpinOutcome} from './legacy-game-actor-spin.mjs';
import {resolveLegacyGameMountedResource,projectLegacyGameMountedAction,legacyGameRideRestAction} from './legacy-game-actor-ride.mjs';
import {applyLegacyGameActorPresentationControl,planLegacyGameActorPresentation,legacyGameActorPresentationGate} from './legacy-game-actor-presentation.mjs';
import {planLegacyGameActorLabel,decodeLegacyGameActorLabelList} from './legacy-game-text.mjs';
import {planLegacyGameActorVitals,decodeLegacyGameActorValues,decodeLegacyGamePartyUpdate} from './legacy-game-vitals.mjs';
import {planLegacyGameActorBadge} from './legacy-game-actor-badge.mjs';
import { createLegacyGameMapSpeech, copyLegacyGameMapSpeechFrame, legacyGameMapSpeechMilliseconds } from './legacy-game-map-chat.mjs';
import {assetList} from './legacy-game-resource-values.mjs';
import {classifyLegacyGamePartyInput,legacyGamePartyQueueScale,legacyGamePartyTargetsNear} from './legacy-game-party.mjs';
export const LEGACY_GAME_ACTOR_PROFILE=Object.freeze({id:'legacy-se6000-37c4-actors-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',messageBytes:32760,recordBytes:2047,
  remoteCapacity:1000,nativeFrameGates:'unmodeled',nativeLocalSceneReset:'conditional-unmodeled',currentVersionCompatibility:'unverified'});
export class LegacyGameActorError extends Error{
  constructor(code){super('Legacy actor data does not match the supported bounded profile.');this.name='LegacyGameActorError';this.code=code;}
}
const fail=code=>{throw new LegacyGameActorError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){
  try{let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('LEGACY_ACTOR_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    if(length>32760)fail('LEGACY_ACTOR_BUDGET');return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameActorError)throw error;fail('LEGACY_ACTOR_INPUT');}
}
function int32(value){if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_ACTOR_INTEGER');return value;}
function coordinates(pair){for(const n of pair){int32(n);if(n < -33554432||n>33554431)fail('LEGACY_ACTOR_COORDINATE');}}
function point(value){
  if(!Array.isArray(value))fail('LEGACY_ACTOR_COORDINATE');const d=Object.getOwnPropertyDescriptors(value);
  if(d.length?.value!==2||Reflect.ownKeys(d).length!==3||![0,1].every(i=>Object.hasOwn(d[i]??{},'value')))fail('LEGACY_ACTOR_COORDINATE');
  const pair=[d[0].value,d[1].value];coordinates(pair);return pair;
}
const token=(row,n,cap=2047)=>row[n-1]?.subarray(0,cap)??new Uint8Array();
const zero=(row,n)=>decimal(token(row,n));
const minusOne=(row,n)=>{const t=token(row,n,127);return t.length?decimal(t):-1;};
const id=(row,n=1)=>base62(token(row,n));
const inner=(row,n,cap=255)=>unescape(token(row,n,cap));
const pairFreeze=(a,b)=>Object.freeze([a,b]);
function context(value){
  if(!Array.isArray(value))fail('LEGACY_ACTOR_CONTEXT');let d;
  try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_ACTOR_CONTEXT');}
  if(d.length?.value!==4||Reflect.ownKeys(d).length!==5)fail('LEGACY_ACTOR_CONTEXT');
  return Array.from({length:4},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_ACTOR_CONTEXT');return int32(d[i].value);});
}
export function decodeLegacyGameActorList(value){
  const raw=input(value);
  try{
    const rows=fields(raw,9),records=[];let ignored=0,truncatedRecords=0;
    for(let i=0;i<rows.length;i++){
      const original=rows[i];if(original.length===0){if(i===rows.length-1)break;ignored++;continue;}
      if(original.length>2047)truncatedRecords++;const row=fields(original.subarray(0,2047));
      if(token(row,11).length){
        records.push(Object.freeze({kind:'character',id:id(row,2),category:minusOne(row,1),coordinates:pairFreeze(zero(row,3),zero(row,4)),
          facingCode:zero(row,5),rawResourceId:zero(row,6),value7:zero(row,7),value8:minusOne(row,8),label0:inner(row,9),composite:inner(row,10),
          flag11:zero(row,11),flag12:zero(row,12),unused13:zero(row,13),label4:inner(row,14),mode15:zero(row,15),value16:zero(row,16),attachment:token(row,17).slice()}));
      }else if(token(row,6).length){
        records.push(Object.freeze({kind:'graphic-object',id:id(row),coordinates:pairFreeze(zero(row,2),zero(row,3)),rawResourceId:zero(row,4),
          facingCode:0,value5:minusOne(row,5),label:inner(row,6,1023),value7:minusOne(row,7)}));
      }else if(token(row,4).length){
        const amount=zero(row,4),thresholds=[50,100,1000,5000,10000,50000,100000,500000,1000000];let at=0;
        while(at<thresholds.length&&amount>=thresholds[at])at++;
        const text=String(amount),label=new Uint8Array(text.length+5);for(let j=0;j<text.length;j++)label[j]=text.charCodeAt(j);label.set([32,189,240,177,210],text.length);
        records.push(Object.freeze({kind:'value-object',id:id(row),coordinates:pairFreeze(zero(row,2),zero(row,3)),rawResourceId:0x6b08+at,facingCode:0,amount,label}));
      }else ignored++;
    }
    return Object.freeze({kind:'actor-list',records:Object.freeze(records),ignoredRecords:ignored,truncatedRecords});
  }finally{raw.fill(0);}
}
export function decodeLegacyGameActorActions(value){
  const raw=input(value);
  try{
    const rows=fields(raw,44),records=[];let truncatedRecords=0,terminatedAt=rows.length;
    for(let i=0;i<rows.length;i++){
      if(rows[i].length===0){terminatedAt=i;break;}if(rows[i].length>2047)truncatedRecords++;
      const row=fields(rows[i].subarray(0,2047)),action=minusOne(row,4);
      records.push(Object.freeze({id:id(row),coordinates:pairFreeze(minusOne(row,2),minusOne(row,3)),action,facingCode:minusOne(row,5),
        parameters:Object.freeze([minusOne(row,6),minusOne(row,7),minusOne(row,8)]),
        coordinated:action===81||action===82,coordinatedFields:action===81||action===82?Object.freeze(Array.from({length:7},(_,j)=>minusOne(row,j+6))):null}));
    }
    return Object.freeze({kind:'actor-actions',records:Object.freeze(records),truncatedRecords,ignoredAfterEmpty:Math.max(0,rows.length-terminatedAt-1)});
  }finally{raw.fill(0);}
}
export function decodeLegacyGameActorRemovals(value){
  const raw=input(value);
  try{const ids=[];for(const t of fields(raw,44)){const selected=t.subarray(0,127),n=selected.length?base62(selected):-1;if(n===-1)break;ids.push(n);}
    return Object.freeze({kind:'actor-removals',ids:Object.freeze(ids)});
  }finally{raw.fill(0);}
}
const copyBytes=value=>value===null?null:value.slice();
const objectRecordFlags=Object.freeze({'graphic-object':2,'value-object':4});
function clearSpeech(actor){
  if(!actor?.chatSpeech)return;
  for(const line of actor.chatSpeech.lines)line.fill(0);
  actor.chatSpeech=null;
}
function freeActor(actor){if(!actor)return;clearSpeech(actor);actor.frameLive=false;actor.specialSpin=null;actor.ride=null;actor.attached=null;actor.badge=null;actor.badgeDirty=false;if(actor.sourceStatus)actor.sourceStatus.icons={primary:null,transient:null,side:null};actor.unmodeledRide=actor.unmodeledAttachment=false;actor.motion.close();for(const value of actor.labels)if(value)value.fill(0);actor.attachment?.fill(0);actor.label?.fill(0);}
const newStatus=()=>({primary:0,secondary:0,secondaryKnownMask:0,variant:0,forced:false,parameterValue:null,icons:{primary:null,transient:null,side:null}});
const frameAccesses=new WeakMap();
export function legacyGameActorFrameAccess(owner){const access=frameAccesses.get(owner);if(!access)fail('LEGACY_ACTOR_FRAME_OWNER');return access;}
export function createLegacyGameActors(){
  let closed=false,wireContext=null,localId=null,local=null,resourceCode=null,globals={value15:null,label0:null,label1:null,label2:null,label3:null,speed:null};
  let labelSelection=null,labelCatalog=null;
  let globalVitals=[0,0,0,0],partyActive=false,partyTransfer=null,partyObserved=false,partyScale=1;
  const partyRows=Array.from({length:5},()=>({active:false,actorId:0,value8:0,value10:0,value0c:0,value14:0,labelBytes:new Uint8Array(),actorKey:null}));
  let entryPrepared=false,scenePrepared=false,awaitingSceneIdentity=false,localCoordinates=null,localFacing=null,localResource=null,materializations=0;
  let sourceSceneMode=null,localStatus=newStatus();
  let creationOrder=[],revision=0;const byFrameKey=new WeakMap(),remoteSlots=[],touch=()=>{revision=(revision+1)>>>0;};
  function registerRemote(actor){
    const free=remoteSlots.indexOf(null);
    actor.recordSlot=free===-1?remoteSlots.length:free;
    remoteSlots[actor.recordSlot]=actor;
    remotes.set(actor.id,actor);
  }
  function freeRemote(actor){
    unbindParty(actor);
    freeActor(actor);
    remoteSlots[actor.recordSlot]=null;
    remotes.delete(actor.id);
  }
  function firstRemoteAt(x,y,mask){
    active();coordinates([x,y]);
    for(const actor of remoteSlots){
      if(!actor?.frameLive||!(actor.sourceFrame.recordTypeFlags&mask))continue;
      const [actorX,actorY]=actor.motion.copyState().display;
      if(actorX===x&&actorY===y)return actor;
    }
    return null;
  }
  const remotes=new Map(),active=()=>{if(closed)fail('LEGACY_ACTOR_CLOSED');};
  const resolved=actor=>actor.transformResource?(grade(actor.rawResourceId)===0?actor.rawResourceId:resourceCode===null?null:resolve(actor.rawResourceId,resourceCode)):actor.rawResourceId;
  const lookup=id=>id===localId?local:remotes.get(id);
  const normal=a=>a.local?localResource:a.normalResource;
  const normalResolved=a=>resolved({rawResourceId:normal(a),transformResource:true});
  const childSnapshot=a=>a?Object.freeze({rawResourceId:a.rawResourceId,resolvedResourceId:resolved(a),action:a.action,phase:a.phase}):null;
  const statusSnapshot=(s,duration)=>Object.freeze({primary:s.primary,secondary:s.secondary,secondaryKnownMask:s.secondaryKnownMask,variant:s.variant,forced:s.forced,duration,parameterValue:s.parameterValue,
    icons:Object.freeze(Object.fromEntries(Object.entries(s.icons).map(([k,c])=>[k,c?Object.freeze({...childSnapshot(c),counter:c.counter??0}):null])))});
  function setAnimation(a,action,restart){if(a.ride?.child){const resource=resolved(a);if(resource===null)fail('LEGACY_ACTOR_RESOURCE_CONTEXT');const mapped=projectLegacyGameMountedAction(resource,action);
    a.ride.child.action=mapped.childAction;if(restart)a.ride.child.phase=-1;a.motion.setAnimation(mapped.action,restart);}else a.motion.setAnimation(action,restart);}
  const restoreNormal=a=>{a.rawResourceId=normal(a);a.transformResource=true;};
  const assignLabel=(actor,index,bytes,maximum)=>{if(bytes.length>maximum)return;actor.labels[index]?.fill(0);actor.labels[index]=bytes.slice();};
  const partyFlag=(a,member,leader=false)=>{const s=a?.sourceStatus??localStatus;s.primary=member?s.primary|0x200:s.primary&~0x200;if(leader){s.primary|=0x100;s.forced=true;}if(a)a.flags=s.primary;};
  const bindParty=a=>{const row=partyRows.find(r=>r.active&&r.actorId===a.id);if(row){row.actorKey=a.frameKey;partyFlag(a,true,row===partyRows[0]);}};
  const unbindParty=a=>{for(const row of partyRows)if(row.actorKey===a.frameKey)row.actorKey=null;};
  const partyBody=row=>{const a=row.actorKey?byFrameKey.get(row.actorKey):null;return a?.frameLive?a:null;};
  function transferParty(next,from){
    const head=partyBody(partyRows[0]);if(!head)return Object.freeze({nextSlot:next,synchronization:'slot0-unbound',queued:0});
    const h=head.motion.copyState(),aligned=m=>m.position.every((n,i)=>n===Math.fround(m.target[i]*64));
    if(h.queue.length||!aligned(h))return Object.freeze({nextSlot:next,synchronization:'leader-busy',queued:0});
    let previous=null;for(let i=next-1;i>=0;i--)if(partyRows[i].active&&(previous=partyBody(partyRows[i])))break;
    const first=partyBody(partyRows[next]);if(previous&&!first)return Object.freeze({nextSlot:next,synchronization:'next-unbound',queued:0});
    if(previous&&legacyGamePartyTargetsNear(...previous.motion.copyState().target,...first.motion.copyState().target))return Object.freeze({nextSlot:next,synchronization:'already-near',queued:0});
    partyScale=1;let point=[...from],queued=0;
    for(let i=next;i<5;i++){const a=partyRows[i].active?partyBody(partyRows[i]):null;if(!a)continue;const old=a.motion.copyState().target;a.motion.enqueue(point);point=[...old];queued++;}
    return Object.freeze({nextSlot:next,from:Object.freeze([...from]),nativeConsumer:'0x461f40',synchronization:'source-ordinary',queued});
  }
  function dissolveParty(){partyActive=false;partyTransfer=null;
    for(const r of partyRows){if(r.active){const a=r.actorKey?byFrameKey.get(r.actorKey):null;if(a?.frameLive&&(a.local||(localStatus.primary&0x100)))a.motion.clearQueue();if(r.actorId===localId)partyFlag(local,false);else if(a?.frameLive)partyFlag(a,false);}r.active=false;r.actorId=0;r.actorKey=null;}
    localStatus.forced=false;if(local?.mode15!==2)localStatus.primary&=~0x100;if(local)local.flags=localStatus.primary;
  }
  function snapshot(actor){
    if(!actor)return null;const state=actor.motion.copyState();
    return Object.freeze({id:actor.local?localId:actor.id,local:actor.local,creationKind:actor.creationKind,announcedKind:actor.announcedKind,
      rawResourceId:actor.rawResourceId,resolvedResourceId:resolved(actor),normalRawResourceId:normal(actor),normalResolvedResourceId:normalResolved(actor),normalFacingCode:actor.local?localFacing:null,
      attached:childSnapshot(actor.attached),badge:Object.freeze({child:childSnapshot(actor.badge),dirty:actor.badgeDirty??false}),
      presentation:statusSnapshot(actor.sourceStatus,actor.presentationDuration),
      vitals:Object.freeze([...(actor.vitals??[0,0,0,0])]),
      ride:actor.ride?Object.freeze({state:actor.ride.state,counter:actor.ride.counter,child:childSnapshot(actor.ride.child),effect:childSnapshot(actor.ride.effect)}):null,
      specialSpin:actor.specialSpin?Object.freeze({...actor.specialSpin}):null,sourceControlUnmodeled:actor.unmodeledRide||actor.unmodeledAttachment,
      announcedCoordinates:Object.freeze([...actor.announcedCoordinates]),announcedFacingCode:actor.announcedFacingCode,
      category:actor.category??null,value7:actor.value7??null,value8:actor.value8??null,mode15:actor.mode15??null,value16:actor.value16??null,
      flagsProjection:actor.flags,labels:Object.freeze(actor.labels.map(copyBytes)),labelBytes:actor.label?actor.label.slice():null,amount:actor.amount??null,
      attachmentBytes:actor.attachment?actor.attachment.slice():null,materialization:actor.materialization??'unit-record',sourceFrame:Object.freeze({...actor.sourceFrame,...(!actor.local&&partyObserved?{recordMotionMask:(actor.sourceFrame.recordMotionMask|0x02000000)>>>0,recordMotionValue:((actor.sourceFrame.recordMotionValue&~0x02000000)|((actor.sourceStatus.primary&0x200)<<16))>>>0}:{})}),motion:actor.local?Object.freeze({...state,
        speed:actor.speedKnown?state.speed:null,display:actor.displayGridUnknown?null:state.display}):state,
      nativeConditionalFlags:'partial-unmodeled',nativeAttachments:'source60-supported;other-unmodeled',nativeResourceAvailability:'unverified'});
  }
  const copyState=()=>{active();return Object.freeze({profile:LEGACY_GAME_ACTOR_PROFILE.id,context:wireContext?Object.freeze([...wireContext]):null,localId,
    localActor:snapshot(local),remoteActors:Object.freeze([...remotes.values()].map(snapshot)),resourceCode,remoteCount:remotes.size,
    localBootstrap:Object.freeze({entryPrepared,scenePrepared,identityKnown:wireContext!==null,materializations,scope:'ordinary-logical-main9-projection'}),sourceSceneMode,
    labelCatalog:Object.freeze({selectedIndex:labelSelection,received:labelCatalog!==null,records:labelCatalog===null?null:Object.freeze(labelCatalog.map(r=>Object.freeze({...r,labelBytes:r.labelBytes.slice()})))}),
    party:Object.freeze({active:partyActive,observed:partyObserved,movementScale:partyScale,rows:Object.freeze(partyRows.map(({actorKey,...row},slot)=>Object.freeze({...row,slot,labelBytes:row.labelBytes.slice(),bound:actorKey!==null}))),coordinateTransfer:partyTransfer,following:'ordinary-source',leaderBadge:'ordinary-source-aux04'}),
    nativeLocalSceneReset:'conditional-unmodeled',nativeFrameGates:'unmodeled',currentVersionCompatibility:'unverified'});};
  // 4ff080 raw resource/facing reset, then 4ff160 -> 4ff3b0 -> 43c000.
  // Physical wrapped numeric storage and native UI/party scheduling are not reproduced.
  const sourceFrame=(own,kind,category,facingBound=true)=>({profile:LEGACY_GAME_ACTOR_CONTEXT_PROFILE.id,local:own,
    recordTypeFlags:own?null:objectRecordFlags[kind]??legacyGameActorRecordTypeFlags(category),recordDrawFlags:null,
    bodyOrMask:own?0xb4:0x34,recordMotionMask:own?0:0x00c00000,recordMotionValue:0,facingBound});
  function materializeLocal(recreate=false){
    if(!entryPrepared||!scenePrepared||wireContext===null)return false;
    if(!local||recreate){
      const previous=local;
      const actor={...(previous??{}),id:localId,local:true,creationKind:'character',announcedKind:previous?.announcedKind??null,
        announcedCoordinates:previous?[...previous.announcedCoordinates]:[...localCoordinates],announcedFacingCode:previous?.announcedFacingCode??null,
        rawResourceId:localResource,transformResource:true,motion:motion([...localCoordinates],localFacing,globals.speed??0),
        speedKnown:globals.speed!==null,displayGridUnknown:false,labels:previous?previous.labels.map(copyBytes):[null,null,null,null,null],
        attachment:copyBytes(previous?.attachment??null),flags:localStatus.primary,sourceStatus:localStatus,vitals:[globalVitals[0],globalVitals[1],0,0],presentationDuration:0,frameLive:true,frameKey:Object.freeze({}),materialization:'source-main9',sourceFrame:sourceFrame(true,'character',null),specialSpin:null,ride:null,attached:null,badge:null,badgeDirty:false,mode15:0,value16:0,unmodeledRide:false,unmodeledAttachment:false,chatSpeech:null};
      if(previous)unbindParty(previous);freeActor(previous);local=actor;byFrameKey.set(actor.frameKey,actor);creationOrder=creationOrder.filter(a=>a.frameLive);creationOrder.push(actor);materializations++;
      const row=partyRows.find(r=>r.active&&r.actorId===localId);if(row)row.actorKey=actor.frameKey;
    }else{
      local.rawResourceId=localResource;local.transformResource=true;
      if(local.ride?.child){const resource=normalResolved(local);if(resource===null)fail('LEGACY_ACTOR_RESOURCE_CONTEXT');local.rawResourceId=resolveLegacyGameMountedResource(resource);local.transformResource=false;}
      local.motion.setFacing(localFacing);local.motion.teleport([...localCoordinates],false);local.displayGridUnknown=false;local.materialization='source-main9-refresh';
    }
    if(globals.value15!==null)local.value7=globals.value15;
    if(globals.label0!==null)assignLabel(local,0,globals.label0,16);
    if(globals.label1!==null)assignLabel(local,1,globals.label1,16);
    if(globals.label2!==null)assignLabel(local,2,globals.label2,32);
    if(globals.label3!==null)assignLabel(local,3,globals.label3,32);
    awaitingSceneIdentity=false;
    return true;
  }
  const api=Object.freeze({
    prepareCharacterEntry(){
      active();if(entryPrepared||scenePrepared||local||remotes.size)fail('LEGACY_ACTOR_ENTRY_STATE');touch();entryPrepared=true;localResource=0;localFacing=-1;sourceSceneMode=0;wireContext=null;localId=null;localStatus=newStatus();
      globals.value15=0;globals.speed=null;globals.label0?.fill(0);globals.label1?.fill(0);globals.label0=new Uint8Array();globals.label1=new Uint8Array();
      globals.label2?.fill(0);globals.label3?.fill(0);globals.label2=new Uint8Array();globals.label3=new Uint8Array();labelSelection=0;
      globalVitals=[0,0,0,0];partyActive=false;partyObserved=true;partyScale=1;partyTransfer=null;for(const r of partyRows){r.labelBytes.fill(0);Object.assign(r,{active:false,actorId:0,value8:0,value10:0,value0c:0,value14:0,labelBytes:new Uint8Array(),actorKey:null});}
    },
    setContext(value){active();const args=context(value);active();touch();wireContext=args;localId=args[0];if(!local&&awaitingSceneIdentity)materializeLocal();return Object.freeze({kind:'actor-context',fields:Object.freeze([...args]),localId,cacheVariant:args[2]});},
    configureResources(code){active();if(code!==null&&(!Number.isInteger(code)||code<0||code>0xffffffff))fail('LEGACY_ACTOR_RESOURCE_CONTEXT');touch();resourceCode=code;},
    configureSceneMode(mode){active();int32(mode);touch();sourceSceneMode=mode;},
    observeVitals(value){active();const values=assetList(value,4);if(values.length!==4)fail('LEGACY_ACTOR_VALUES');for(const n of values)if(n!==null)int32(n);touch();for(let i=0;i<4;i++)if(values[i]!==null)globalVitals[i]=values[i];},
    applyValues(bytes){active();const d=decodeLegacyGameActorValues(bytes);active();touch();const applied=[];for(const row of d.records){const a=remotes.get(row.id);if(a){a.vitals=[...row.values];applied.push(row.id);}}return Object.freeze({kind:d.kind,appliedIds:Object.freeze(applied),records:d.records.length,terminatedAt:d.terminatedAt,extraTokens:d.extraTokens});},
    applyParty(slot,bytes){active();const d=decodeLegacyGamePartyUpdate(slot,bytes);active();touch();partyObserved=true;const row=partyRows[slot];partyTransfer=null;
      if(d.active){row.active=true;partyActive=true;for(const u of d.updates){if(u.name==='labelBytes')row.labelBytes.fill(0);row[u.name]=u.value;}const a=lookup(row.actorId);row.actorKey=a?.frameKey??null;if(row.actorId===localId)partyFlag(local,true,slot===0);else if(a)partyFlag(a,true,slot===0);}
      else{const old=row.actorKey?byFrameKey.get(row.actorKey):null;if(row.active&&row.actorId!==localId){const a=remotes.get(row.actorId);if(a)partyFlag(a,false);}row.active=false;row.actorKey=null;
        const remaining=partyRows.filter(r=>r.active);if(remaining.length<2){dissolveParty();}
        else{const next=partyRows.findIndex((r,i)=>i>slot&&r.active);if(next>=0&&old?.frameLive){const from=old.motion.copyState().target;if(from.some(n=>n>=0))partyTransfer=transferParty(next,from);}}
      }return Object.freeze({kind:d.kind,slot,active:row.active,partyActive,updates:d.updates.length,coordinateTransfer:partyTransfer});},
    applyPartyReply(mode,result){active();int32(mode);int32(result);touch();const accepted=result===1&&(mode===0||mode===1);
      if(accepted){partyFlag(local,mode===1);if(mode===0){partyObserved=true;dissolveParty();}}
      return Object.freeze({kind:'party-reply',mode,result,accepted,partyActive,leaveAcknowledgment:accepted&&mode===0});},
    observeLabelSelection(value){active();int32(value);touch();labelSelection=value;},
    applyLabelList(bytes){active();const decoded=decodeLegacyGameActorLabelList(bytes);active();touch();if(labelCatalog)for(const row of labelCatalog)row.labelBytes.fill(0);labelCatalog=decoded.records;
      return Object.freeze({kind:decoded.kind,records:labelCatalog.length,extraTokens:decoded.extraTokens});},
    observeGlobals(value15=null,label0=null,label1=null,speed=null){
      active();if(value15!==null)int32(value15);if(speed!==null)int32(speed);
      const a=label0===null?null:input(label0),b=label1===null?null:input(label1);active();touch();
      if(value15!==null)globals.value15=value15;
      for(const [key,bytes] of [['label0',a],['label1',b]])if(bytes){if(bytes.length<=16){globals[key]?.fill(0);globals[key]=bytes.slice();}bytes.fill(0);}
      if(speed!==null){globals.speed=speed;if(local){local.motion.setSpeed(speed);local.speedKnown=true;}}
    },
    applyUnits(bytes){
      active();const decoded=decodeLegacyGameActorList(bytes);active();const pending=new Set(remotes.keys());
      for(const row of decoded.records){coordinates(row.coordinates);if(!(row.kind==='character'&&row.id===localId))pending.add(row.id);}
      if(pending.size>1000)fail('LEGACY_ACTOR_CAPACITY');
      const initial=new Map(),seen=new Set(remotes.keys());let ownSeen=local!==null;
      for(const row of decoded.records){const own=row.kind==='character'&&row.id===localId,created=own?!ownSeen:!seen.has(row.id);if(own)ownSeen=true;else seen.add(row.id);
        if(created){let facing=row.facingCode,bound=true;
          if(!own&&row.kind==='character'&&row.category>3){bound=sourceSceneMode!==null;if(sourceSceneMode===0){const normalized=resolved({rawResourceId:row.rawResourceId,transformResource:true});if(normalized===null)fail('LEGACY_ACTOR_RESOURCE_CONTEXT');facing=legacyGameActorInitialFacing(row.category,normalized,sourceSceneMode,facing);}}
          initial.set(row,{facing,bound});}}
      touch();const changes=[],localStateUpdates=[];
      for(const row of decoded.records){
        const own=row.kind==='character'&&row.id===localId,created=own?!local:!remotes.has(row.id);if(own&&!local)materializeLocal();let actor=own?local:remotes.get(row.id);
        if(!actor){const first=initial.get(row);actor={id:row.id,local:own,creationKind:row.kind,motion:motion([...row.coordinates],first.facing,own?(globals.speed??100):100),labels:[null,null,null,null,null],flags:own?localStatus.primary:0,sourceStatus:own?localStatus:newStatus(),presentationDuration:0,frameLive:true,frameKey:Object.freeze({}),sourceFrame:sourceFrame(own,row.kind,row.category,first.bound),specialSpin:null,ride:null,attached:null,badge:null,badgeDirty:false,mode15:0,value16:0,unmodeledRide:false,unmodeledAttachment:false};
          byFrameKey.set(actor.frameKey,actor);creationOrder.push(actor);
          if(own){local=actor;actor.speedKnown=globals.speed!==null;actor.value7=globals.value15;actor.labels[0]=copyBytes(globals.label0);actor.labels[1]=copyBytes(globals.label1);}else registerRemote(actor);}
        actor.announcedKind=row.kind;actor.normalResource=row.rawResourceId;actor.rawResourceId=row.rawResourceId;actor.transformResource=row.kind==='character';actor.announcedCoordinates=[...row.coordinates];actor.announcedFacingCode=row.facingCode;
        if(row.kind==='character'){
          actor.category=row.category;actor.value7=row.value7;actor.value8=row.value8;
          if(own){if(localFacing===null||localFacing<0)localFacing=row.facingCode;actor.motion.setFacing(localFacing);localResource=row.rawResourceId;}
          if(row.flag11!==0)actor.flags|=0x40;if(row.flag12!==0)actor.flags|=0x80;
          if(!own){const source=actor.sourceFrame;source.recordDrawFlags=legacyGameActorRecordDrawFlags(row.category,row.value7);source.bodyOrMask|=source.recordDrawFlags;
            source.recordMotionMask|=0xffff;source.recordMotionValue=((actor.flags&0xc0)<<16)|(row.value8&0xffff);}
          if(actor.value16!==row.value16)actor.badgeDirty=true;
          actor.mode15=row.mode15===1||row.mode15===2?row.mode15:0;actor.value16=actor.mode15?row.value16:0;
          if(actor.mode15===2&&!(actor.flags&0x200))actor.flags|=0x100;
          else if(actor.mode15!==2&&!actor.sourceStatus.forced)actor.flags&=~0x100;
          actor.sourceStatus.primary=actor.flags;
          assignLabel(actor,0,row.label0,16);const sub=fields(row.composite),labels=[0,1,2].map(i=>unescape(token(sub,i+1,255)));
          assignLabel(actor,1,labels[0],16);
          if(own||row.category!==3){assignLabel(actor,2,labels[1],32);assignLabel(actor,3,labels[2],32);assignLabel(actor,4,row.label4,16);}
          actor.attachment?.fill(0);actor.attachment=row.attachment.slice();
          if(own){
            globals.value15=row.value7;const first=row.label0.length<=16?row.label0.slice():null,second=labels[0].length<=16?labels[0].slice():null;
            if(first){globals.label0?.fill(0);globals.label0=first.slice();}if(second){globals.label1?.fill(0);globals.label1=second.slice();}
            for(const [index,key]of [[1,'label2'],[2,'label3']])if(labels[index].length<=32){globals[key]?.fill(0);globals[key]=labels[index].slice();}
            localStateUpdates.push(Object.freeze({value15:row.value7,firstLabel:first,secondLabel:second,speed:null}));
          }
        }else{
          if(!own){const source=actor.sourceFrame;source.recordDrawFlags=0x400;source.bodyOrMask|=0x400;source.recordMotionValue=((source.recordMotionValue&~0x00c00000)|((actor.flags&0xc0)<<16))>>>0;}
          if(row.label.length<=60){actor.label?.fill(0);actor.label=row.label.slice();}actor.amount=row.amount??null;
        }
        bindParty(actor);changes.push(Object.freeze({id:row.id,local:own,created,kind:row.kind}));
      }
      return Object.freeze({kind:'actor-list',changes:Object.freeze(changes),localStateUpdates:Object.freeze(localStateUpdates),ignoredRecords:decoded.ignoredRecords,truncatedRecords:decoded.truncatedRecords});
    },
    applyActions(bytes){
      active();const decoded=decodeLegacyGameActorActions(bytes);active();for(const row of decoded.records)if([1,40,42,44,50,51].includes(row.action))coordinates(row.coordinates);
      touch();const changes=[],missing=new Set(),localStateUpdates=[];
      for(const row of decoded.records){
        if(row.coordinated){changes.push(Object.freeze({id:row.id,action:row.action,result:'coordinated-unmodeled'}));continue;}
        const actor=lookup(row.id);
        if(!actor){if(row.id!==localId&&missing.size<4096)missing.add(row.id);changes.push(Object.freeze({id:row.id,action:row.action,result:'missing'}));continue;}
        if(actor.local&&actor.rawResourceId===0){changes.push(Object.freeze({id:row.id,action:row.action,result:'local-resource-zero'}));continue;}
        const m=actor.motion,a=row.action,[p1,p2]=row.parameters;let result='unmodeled';
        const setFacing=value=>{m.setFacing(value);if(actor.local)localFacing=value;};
        const s=actor.sourceStatus,control=applyLegacyGameActorPresentationControl({primary:actor.flags,secondary:s.secondary,variant:s.variant,forced:s.forced,mode:actor.mode15??0,local:actor.local,action:a,parameter:p1});
        if(control){actor.flags=s.primary=control.primary;s.secondary=control.secondary;s.secondaryKnownMask|=control.secondaryWrites;s.variant=control.variant;s.forced=control.forced;
          if(control.duration!==null)actor.presentationDuration=control.duration;if(control.parameterValue!==null)s.parameterValue=control.parameterValue;}
        if(control&&!( !actor.local&&[40,42,44].includes(a))){setFacing(row.facingCode);result='source-presentation';}
        else if(actor.local&&a===50){setFacing(row.facingCode);result='source-facing';}
        else if(a===0){if(!actor.local)m.clearQueue();setAnimation(actor,0,true);if(!actor.local)m.setFacing(row.facingCode);result='idle';}
        else if(a===1){
          const speed=actor.local&&p1===-1?100:p1;m.setSpeed(speed);setAnimation(actor,1,false);
          if(actor.local){globals.speed=speed;actor.speedKnown=true;localStateUpdates.push(Object.freeze({value15:null,firstLabel:null,secondLabel:null,speed}));}
          else m.enqueue([...row.coordinates]);result=actor.local?'local-animation-speed':'queued';
        }else if((a>=2&&a<=19)||a===30||a===31){
          const animation=a===30?1:a===31?0:a;setAnimation(actor,animation,true);
          const updatesFacing=!actor.local||([5,7,8,9,10,11,12,13,14,15,16,30,31].includes(a));if(updatesFacing)setFacing(row.facingCode);result='animation';
        }else if(!actor.local&&[40,42,44,51].includes(a)){
          m.teleport([...row.coordinates],a===51);m.setFacing(row.facingCode);if(a===51||(a===40&&p1>=0))setAnimation(actor,0,true);result='corrected';
        }else if(!actor.local&&a===50){
          actor.deferredFacing={coordinates:[...row.coordinates],facingCode:row.facingCode};const current=m.copyState().target,dx=Math.abs(row.coordinates[0]-current[0]),dy=Math.abs(row.coordinates[1]-current[1]);
          if((dx!==0||dy!==0)&&Math.abs(dx-dy)<=1&&!(actor.flags&0x200)){m.enqueue([...row.coordinates]);setAnimation(actor,1,false);result='filtered-queued';}else result='filtered-out';
        }else if(a===60){
          actor.rawResourceId=p1;actor.transformResource=true;if(actor.local)localResource=p1;else actor.normalResource=p1;if(p2!==0){if(!actor.attached)actor.attached={rawResourceId:p2,transformResource:true,action:0,phase:0,key:Object.freeze({})};else actor.attached.rawResourceId=p2;}
          else actor.attached=null;actor.unmodeledAttachment=false;result=p2===0?'resource':'resource-with-source-attachment';
        }else if(a===70){
          if(!(actor.local&&p1<0&&actor.ride?.state===2)){
            const r=actor.ride??{state:0,counter:0,child:null,effect:null};actor.ride=r;actor.specialSpin=null;r.counter=0;
            if(p1>=0){if(!r.child)r.child={rawResourceId:p1,transformResource:true,action:0,phase:0,key:Object.freeze({})};
              r.child.rawResourceId=p1;const source=normalResolved(actor);if(source===null)fail('LEGACY_ACTOR_RESOURCE_CONTEXT');actor.rawResourceId=resolveLegacyGameMountedResource(source);actor.transformResource=false;r.state=1;
            }else r.state=2;
            if(r.child)r.child.action=m.copyState().animation===1?1:0;
          }actor.unmodeledRide=false;result='source-ride';
        }else if(a===80){
          actor.rawResourceId=p1;actor.transformResource=true;actor.specialSpin={state:3,counter:0,initialFacing:null};if(actor.ride){actor.ride.state=0;actor.ride.counter=0;}result='source-spin';
        }
        changes.push(Object.freeze({id:row.id,action:a,result}));
      }
      return Object.freeze({kind:'actor-actions',changes:Object.freeze(changes),missingIds:Object.freeze([...missing]),localStateUpdates:Object.freeze(localStateUpdates)});
    },
    remove(bytes){
      active();const decoded=decodeLegacyGameActorRemovals(bytes);active();touch();const removed=[];
      for(const id of decoded.ids){if(id===localId){if(local){unbindParty(local);freeActor(local);local=null;removed.push(id);}}else{const actor=remotes.get(id);if(actor){freeRemote(actor);removed.push(id);}}}
      creationOrder=creationOrder.filter(a=>a.frameLive);return Object.freeze({kind:'actor-removals',removedIds:Object.freeze(removed)});
    },
    applyNetworkPosition(x,y,facing,collisionBlocked=null){
      active();coordinates([x,y]);int32(facing);if(collisionBlocked!==null&&typeof collisionBlocked!=='boolean')fail('LEGACY_ACTOR_COLLISION');touch();
      localCoordinates=[x,y];localFacing=facing;
      if(local){const previous=local.motion.copyState().display;local.motion.teleport([x,y],false);local.motion.setFacing(facing);
        if(collisionBlocked!==null)local.motion.synchronizePosition([Math.fround(x*64),Math.fround(y*64)],collisionBlocked?previous:[x,y],[x,y],[0,0],local.motion.copyState().moving);
        local.displayGridUnknown=collisionBlocked===null;}
    },
    applyLocalMovement(position,display,target,velocity,facing,speed,moving,animation,phase,facingAssigned=true,animationAssigned=true){
      active();int32(facing);int32(speed);int32(animation);int32(phase);if(typeof facingAssigned!=='boolean'||typeof animationAssigned!=='boolean')fail('LEGACY_ACTOR_FRAME_BOOLEAN');touch();
      if(local){local.motion.synchronizePosition(position,display,target,velocity,moving,phase);if(local.specialSpin===null||facingAssigned)local.motion.setFacing(facing);local.motion.setSpeed(speed);
        if(local.ride?.child){if(animationAssigned)setAnimation(local,animation,false);}else local.motion.setAnimation(animation,false);local.speedKnown=true;local.displayGridUnknown=false;localFacing=facing;localCoordinates=[...local.motion.copyState().display];}
    },
    copyLocalActor(){active();return snapshot(local);},
    beginBattle(){
      active();touch();const removed=remotes.size;for(const actor of remotes.values())freeRemote(actor);remoteSlots.length=0;
      if(local){unbindParty(local);freeActor(local);local=null;}creationOrder=[];localStatus.primary&=~0x100;localStatus.forced=false;partyTransfer=null;
      return Object.freeze({remoteRecordsCleared:removed,localBodyRemoved:true,localGlobalsRetained:true});
    },
    leaveBattle(){active();touch();for(const actor of remotes.values())actor.deferredFacing=null;},
    copyReturnSource(){active();return Object.freeze({ready:entryPrepared&&scenePrepared&&wireContext!==null&&localCoordinates!==null&&globals.speed!==null,coordinates:localCoordinates?Object.freeze([...localCoordinates]):null});},
    rebuildAfterBattle(){active();touch();if(!materializeLocal())fail('LEGACY_ACTOR_RETURN_GLOBALS_REQUIRED');return snapshot(local);},
    beginScene(coordinatesValue=null,recreateLocal=false,localMode='normal'){
      active();if(typeof recreateLocal!=='boolean'||!['normal','retain','clear'].includes(localMode))fail('LEGACY_ACTOR_ENTRY_STATE');const next=coordinatesValue===null?null:point(coordinatesValue);active();touch();
      const removed=remotes.size;for(const actor of remotes.values())freeRemote(actor);remoteSlots.length=0;
      if(localMode==='clear'&&local){unbindParty(local);freeActor(local);local=null;}
      creationOrder=creationOrder.filter(a=>a.frameLive);
      clearSpeech(local);
      if(next){localCoordinates=next;scenePrepared=true;awaitingSceneIdentity=entryPrepared&&wireContext===null;}
      const materialized=localMode==='normal'&&next!==null&&materializeLocal(recreateLocal);
      return Object.freeze({remoteActorsCleared:removed,localReset:materialized?'ordinary-logical-main9-projection':'conditional-unmodeled'});
    },
    advance(){active();touch();let advanced=0;for(const actor of remotes.values())if(!(actor.flags&0x200)){actor.motion.step();advanced++;}return Object.freeze({kind:'actors-advanced',remoteActors:advanced,nativeFrameGates:'unmodeled'});},
    copyState,
    close(){if(closed)return;touch();closed=true;for(const actor of remotes.values())freeActor(actor);remotes.clear();remoteSlots.length=0;freeActor(local);local=null;creationOrder=[];
      for(const k of ['label0','label1','label2','label3'])globals[k]?.fill(0);globals={value15:null,label0:null,label1:null,label2:null,label3:null,speed:null};if(labelCatalog)for(const row of labelCatalog)row.labelBytes.fill(0);labelCatalog=null;labelSelection=null;wireContext=null;localId=null;
      globalVitals.fill(0);partyActive=false;partyObserved=false;partyScale=1;partyTransfer=null;for(const r of partyRows){r.labelBytes.fill(0);r.actorKey=null;r.active=false;}
      localCoordinates=null;localFacing=null;localResource=null;sourceSceneMode=null;localStatus=newStatus();entryPrepared=scenePrepared=awaitingSceneIdentity=false;},
  });
  const actorFor=key=>{active();const a=byFrameKey.get(key);if(!a||!a.frameLive)fail('LEGACY_ACTOR_FRAME_REMOVED');return a;};
  frameAccesses.set(api,Object.freeze({
    receiveChatSpeech(id,name,body,mic,color,style,tick){
      active();
      const actor=lookup(id), actorName=actor?.labels[0];
      if(!actorName||actorName.length!==name.length||!name.every((byte,index)=>actorName[index]===byte)||mic&&!actor.local)return false;
      if(tick!==null&&(!Number.isInteger(tick)||tick<0||tick>0xffffffff))fail('LEGACY_GAME_LOCAL_TICK');
      const speech=createLegacyGameMapSpeech(body,color,style,tick);
      if(!speech)return false;
      clearSpeech(actor);
      actor.chatSpeech=speech;
      return true;
    },
    copyChatSpeech(key,tick,resource,screen,bodyFlags){
      const actor=actorFor(key), speech=actor.chatSpeech;
      if(!speech)return null;
      if(speech.tick!==null&&((tick-speech.tick)>>>0)>=legacyGameMapSpeechMilliseconds){clearSpeech(actor);return null;}
      return copyLegacyGameMapSpeechFrame(speech,tick,resource,screen,bodyFlags);
    },
    partyContext(){active();return partyObserved?Object.freeze({nativePartyMode:Number(partyActive),nativePartyFlags:localStatus.primary&0xffff}):null;},
    pickupCandidateAt(x,y){return firstRemoteAt(x,y,7)!==null;},
    interactionTargetAt(x,y){return firstRemoteAt(x,y,8)?.id??-1;},
    partyNeighborEligible(point){active();coordinates(point);for(const a of remotes.values()){const p=a.motion.copyState().display;if(a.frameLive&&(a.sourceFrame.recordTypeFlags&0x28)&&!(a.sourceStatus.primary&0x400)&&p[0]===point[0]&&p[1]===point[1])return true;}return false;},
    validateParty(stage){active();int32(stage);if(!partyActive)return;
      if(stage>=250&&stage<=252)fail('LEGACY_PARTY_BATTLE_UNMODELED');const keys=new Set();
      for(const r of partyRows){const a=r.active?partyBody(r):null;if(!a)continue;if(keys.has(a.frameKey))fail('LEGACY_PARTY_DUPLICATE_BODY');keys.add(a.frameKey);if(a.specialSpin||a.ride?.state)fail('LEGACY_PARTY_COMPOUND_UNMODELED');}
    },
    advancePartyFrame(startedAt,ports){active();
      const branch=classifyLegacyGamePartyInput(Number(partyActive),localStatus.primary&0xffff).branch;
      if(!partyActive){partyScale=1;return Object.freeze({branch,movementScale:partyScale,prepared:0,advanced:0});}
      const members=partyRows.filter(r=>r.active&&partyBody(r)).map(partyBody);touch();let prepared=0,advanced=0;
      const aligned=m=>m.position.every((n,i)=>n===Math.fround(m.target[i]*64));
      if(branch==='leader'){
        partyScale=1;if(members.length&&members[0]!==local)fail('LEGACY_PARTY_LEADER_BODY');
        if(startedAt&&members[1])members[1].motion.enqueue([...startedAt]);
      }
      const speed=branch==='leader'?globals.speed:members[0]?.motion.copyState().speed;
      for(let i=branch==='leader'?1:0;i<members.length;i++){
        const a=members[i],m=a.motion.copyState();if(!aligned(m)||!m.queue.length)continue;
        if(branch==='follower'&&i===0&&!a.local)partyScale=legacyGamePartyQueueScale(m.queue.length);
        if(a.local){if(!ports)fail('LEGACY_PARTY_LOCAL_PORT');ports.start(m.queue[0],speed);a.motion.shiftPartyQueue();}
        else a.motion.startPartyQueue(speed,branch==='leader');
        prepared++;if(members[i+1])members[i+1].motion.enqueue([...m.display]);
      }
      for(let i=branch==='leader'?1:0;i<members.length;i++){
        const a=members[i];if(a.local){if(!ports)fail('LEGACY_PARTY_LOCAL_PORT');ports.advance(partyScale);}
        else{const m=a.motion.advanceParty(partyScale);if(a.ride?.child)setAnimation(a,m.animation,false);}advanced++;
      }
      return Object.freeze({branch,movementScale:partyScale,prepared,advanced});
    },
    version(){active();return revision;},
    entries(){active();return creationOrder.map(a=>Object.freeze({key:a.frameKey,actor:snapshot(a)}));},
    current(key){return snapshot(actorFor(key));},
    beginSpin(key){const a=actorFor(key),s=a.specialSpin;if(s?.state!==3)fail('LEGACY_ACTOR_SPIN_STATE');const plan=planLegacyGameActorSpin({counter:s.counter,initialFacing:s.initialFacing,facingCode:a.motion.copyState().facingCode});
      s.initialFacing=plan.initialFacing;a.motion.setAnimation(plan.action,false);a.motion.setFacing(plan.facingCode);return Object.freeze({actor:snapshot(a),plan});},
    probeSpin(key,code){const a=actorFor(key),s=a.specialSpin;if(s?.state!==3||s.counter<=360)fail('LEGACY_ACTOR_SPIN_STATE');int32(code);
      if(code===1){s.state=0;s.counter=0;a.motion.setAnimation(0,false);}return snapshot(a);},
    finishSpin(key,counter,probeCode){const a=actorFor(key),s=a.specialSpin;if(!s)fail('LEGACY_ACTOR_SPIN_STATE');const next=legacyGameActorSpinOutcome(counter,probeCode);s.state=next.state;s.counter=next.counter;if(a.ride)a.ride.counter=next.counter;return snapshot(a);},
    ownGateByte(baseline){active();return legacyGameActorPresentationGate(localStatus.secondary,localStatus.secondaryKnownMask,baseline);},
    vitals(key,bodyFlags,screen,enabled){const a=actorFor(key);if(a.local&&!(bodyFlags&0x80000))a.vitals=[...globalVitals];return planLegacyGameActorVitals({enabled,local:a.local,bodyFlags,primary:a.sourceStatus.primary,screenX:screen[0],screenY:screen[1],values:a.vitals??[0,0,0,0]});},
    label(key,mode,bodyFlags,resourceId,screen){const a=actorFor(key);let selected=null;if(a.local&&mode===3){if(labelSelection===null)fail('LEGACY_ACTOR_LABEL_SELECTION_REQUIRED');if(labelSelection<0||labelSelection>=48)fail('LEGACY_ACTOR_LABEL_SELECTION_UNSUPPORTED');selected=labelCatalog?.[labelSelection].labelBytes??null;}
      const labels=a.local?[globals.label0,globals.label1,globals.label2,globals.label3,a.labels[4]]:a.labels;const run=planLegacyGameActorLabel({local:a.local,mode,bodyFlags,resourceId,screenX:screen[0],screenY:screen[1],labels,selectedLabel:selected});return run?Object.freeze({...run,actorId:a.id}):null;},
    children(key){const a=actorFor(key),r=a.ride;return[r?.child,r?.effect,a.attached,a.badge,...Object.values(a.sourceStatus.icons)].filter(Boolean).map(child=>Object.freeze({key:child.key,...childSnapshot(child)}));},
    child(key,kind){const a=actorFor(key),c=kind==='attachment'?a.attached:kind==='badge'?a.badge:a.sourceStatus.icons[kind]??a.ride?.[kind];return c?Object.freeze({key:c.key,...childSnapshot(c)}):null;},
    childPhase(key,kind,phase){int32(phase);const a=actorFor(key),c=kind==='attachment'?a.attached:kind==='badge'?a.badge:a.sourceStatus.icons[kind]??a.ride?.[kind];if(c)c.phase=phase;},
    prepareBadge(key){const a=actorFor(key),plan=planLegacyGameActorBadge({primary:a.sourceStatus.primary,mode15:a.mode15??0,value16:a.value16??0,dirty:a.badgeDirty??false,present:!!a.badge});a.badgeDirty=plan.dirty;
      if(plan.action==='remove')a.badge=null;else if(plan.action==='create')a.badge={rawResourceId:plan.resourceId,transformResource:false,action:0,phase:0,key:Object.freeze({})};
      return plan;},
    preparePresentation(key,bodyFlags){const a=actorFor(key),s=a.sourceStatus,plan=planLegacyGameActorPresentation({primary:s.primary,secondary:s.secondary,variant:s.variant,bodyFlags,transientPresent:s.icons.transient!==null});
      const select=(kind,resource)=>{if(resource===null){s.icons[kind]=null;return;}if(s.icons[kind])s.icons[kind].rawResourceId=resource;else s.icons[kind]={rawResourceId:resource,transformResource:false,action:0,phase:0,counter:0,key:Object.freeze({})};};
      select('primary',plan.primaryResource);if(!plan.transient)select('transient',null);else if(plan.transientVisible)select('transient',110413);select('side',plan.sideResource);
      if(plan.transientSound!==null){s.secondary&=~plan.soundClearMask;s.secondaryKnownMask|=plan.soundClearMask;}
      return plan;},
    finishPresentation(key,expirationClearMask){const a=actorFor(key),s=a.sourceStatus,c=s.icons.transient;if(c){c.counter++;if(c.counter>600){s.secondary&=~expirationClearMask;s.secondaryKnownMask|=expirationClearMask;}}return snapshot(a);},
    prepareAttachment(key){const a=actorFor(key),c=a.attached;if(!c)fail('LEGACY_ACTOR_ATTACHMENT_STATE');c.action=a.motion.copyState().animation===8?3:0;return Object.freeze({key:c.key,...childSnapshot(c)});},
    beginRide(key){const a=actorFor(key),r=a.ride;if(!r||![1,2].includes(r.state))fail('LEGACY_ACTOR_RIDE_STATE');
      const state=r.state;if(!r.child){r.state=0;a.motion.setAnimation(state===1?legacyGameRideRestAction(resolved(a)):0,false);if(state===2)restoreNormal(a);return snapshot(a);}
      a.motion.setAnimation(11,false);return snapshot(a);},
    effect(key,resource){const a=actorFor(key),r=a.ride;if(!r?.child)fail('LEGACY_ACTOR_RIDE_STATE');if(!r.effect)r.effect={rawResourceId:resource,transformResource:false,action:0,phase:0,key:Object.freeze({})};
      return Object.freeze({key:r.effect.key,...childSnapshot(r.effect)});},
    finishRide(key,outcome){const a=actorFor(key),r=a.ride;if(!r||![1,2].includes(r.state))fail('LEGACY_ACTOR_RIDE_STATE');const old=r.state;r.state=outcome.state;r.counter=outcome.counter;
      if(outcome.complete){r.effect=null;if(old===2){r.child=null;restoreNormal(a);a.motion.setAnimation(0,false);}else a.motion.setAnimation(legacyGameRideRestAction(resolved(a)),false);}return snapshot(a);},
    removeEntries(keys){const selected=keys.map(actorFor);if(selected.some(a=>a.local))fail('LEGACY_ACTOR_FRAME_CULL');if(!selected.length)return;touch();
      for(const a of selected)freeRemote(a);creationOrder=creationOrder.filter(a=>a.frameLive);},
    advance(key,enabled,forceLocal=false){const a=actorFor(key);if(typeof enabled!=='boolean'||typeof forceLocal!=='boolean')fail('LEGACY_ACTOR_FRAME_BOOLEAN');
      if(enabled&&(!a.local||forceLocal)){const before=a.motion.copyState(),after=a.motion.step();if(a.ride?.child&&(before.moving||before.velocity.some(n=>n!==0)||after.velocity.some(n=>n!==0)))setAnimation(a,after.animation,false);}
      const m=a.motion.copyState(),pending=a.deferredFacing;
      if(!a.local&&pending&&pending.facingCode!==-1&&m.velocity[0]===0&&m.velocity[1]===0&&m.display[0]===pending.coordinates[0]&&m.display[1]===pending.coordinates[1]){a.motion.setFacing(pending.facingCode);a.deferredFacing=null;}
      return snapshot(a);},
    phase(key,value){int32(value);const a=actorFor(key),m=a.motion.copyState();a.motion.synchronizePosition(m.position,m.display,m.target,m.velocity,m.moving,value);},
  }));
  return api;
}

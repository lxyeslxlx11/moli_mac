/** Owned, call-level ports of battle body queue primitives. No graphic/body callback emulator. */
import {battleFail as fail,battleOwnedBytes} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout,battleBodyFormation} from './legacy-game-battle-data.mjs';
import {legacyGameBattleAngle,legacyGameBattleFacing} from './legacy-game-battle-math.mjs';
import {createBattleBodyPlayback} from './legacy-game-battle-playback.mjs';
import {planBattleStrike} from './legacy-game-battle-strike.mjs';
import {planBattlePhysicalFamily,battlePhysicalEmptyIdleQueue} from './legacy-game-battle-physical-family.mjs';
import {clearPhysicalGuardHandoff,departPhysicalGuardHandoff,queuePhysicalGuardHandoffs} from './legacy-game-battle-physical-guard-playback.mjs';
import {battleStatusVital,planBattleStatus} from './legacy-game-battle-status.mjs';
import {planBattlePosition,planBattleEquipment} from './legacy-game-battle-change.mjs';
import {planBattlePetTransition} from './legacy-game-battle-pet-transition.mjs';
import {planBattleCharacterChange} from './legacy-game-battle-character-change.mjs';
import {planBattleCasting} from './legacy-game-battle-casting.mjs';
import {planBattleStatusSkill} from './legacy-game-battle-status-skills.mjs';
import {planBattleImpactSkill} from './legacy-game-battle-impact-skills.mjs';
import {planBattleSkill82} from './legacy-game-battle-skill82.mjs';
import {planBattleNumericSkill} from './legacy-game-battle-numeric-skills.mjs';
import {battleAttachedRIDParts,battleMotionSourceLength,battlePhysicalProducerEnd} from './legacy-game-battle-motion.mjs';
import {planBattleAttachedRID} from './legacy-game-battle-attached-rid.mjs';
import {planBattleCombination} from './legacy-game-battle-combination.mjs';
import {planBattleRiding} from './legacy-game-battle-riding.mjs';
import {planBattleSharedStorage} from './legacy-game-battle-shared-storage.mjs';
import {planBattleSkill404} from './legacy-game-battle-skill404.mjs';
import {resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
import {battleFriendMetadata,classifyBattleFriend} from './legacy-game-battle-friends.mjs';

export const LEGACY_GAME_BATTLE_BODY_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-battle-body-queues-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  slots:22,queueCells:200,maximumEntries:199,modeledFlagMask:0x3ff,callbackExecution:'unimplemented',optionalPlayback:'source-body-slice',nativeX87BitIdentity:'unverified',
});
const integer=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_BATTLE_INTEGER');return n|0;};
const unsigned=n=>{if(!Number.isInteger(n)||n<0||n>0xffffffff)fail('LEGACY_BATTLE_INTEGER');return n>>>0;};
const slotNumber=n=>{if(!Number.isInteger(n)||n<0||n>=22)fail('LEGACY_BATTLE_BODY_SLOT');return n;};
const ownerNumber=n=>{if(!Number.isSafeInteger(n)||n<0)fail('LEGACY_BATTLE_COMMAND_HANDLE');return n;};
const ownedNumbers=value=>{if(!Array.isArray(value))fail('LEGACY_BATTLE_BODY_QUEUE');
  const descriptors=Object.getOwnPropertyDescriptors(value),length=descriptors.length.value;
  if(length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');const result=[];
  for(let i=0;i<length;i++){if(!Object.hasOwn(descriptors[i]??{},'value'))fail('LEGACY_BATTLE_BODY_QUEUE');result.push(integer(descriptors[i].value));}return result;};
const maskSlots=mask=>Array.from({length:22},(_,i)=>i).filter(i=>((mask>>>i)&1)!==0);

// 419f60 -> 4668a0 -> 4199b0. The table is already bound to original53e548 bytes.
function reface(body){
  const row=battleBodyFormation(body),x=Math.fround(row.target[0]-row.entry[0]),y=Math.fround(row.target[1]-row.entry[1]);
  body.angle=legacyGameBattleAngle(x,y);body.facing=legacyGameBattleFacing(body.angle);
}
function fresh(slot){return {slot,state:0,busy:0,dynamicFlags:0,savedFlags:0,auxFF8:0,position:[...layout[slot].entry],angle:0,facing:1,speed:3,
  resourceId:100500,resource13a8:0,value1d0:0,statusMetadata:[0,0,0,0],pairedTarget:0,nextResource:0,linkedResources:[0,0],rawStatusFlags:0,unmodeledCharacterMask:0,animationAction:0,speedPercent:100,actorFlags:0x60054,drawFlagMask:0,drawFlagValue:0,attachmentHidden:0,
  frozen:0,counter:0,escapeCounter:0,classCode:0,scale:[1,1],indicatorShift:0,deleted:false,afterImageEnabled:0,afterImageCounter:0,
  vitals:null,physicalFamily:0,physicalVariant:0,skillLevel:0,mpCost:0,skillStatus:0,numberValue:0,numberStyle:0,reactionFlags:0,reactionCounter:0,attackCooldown:0,attackFinishCounter:0,sourceTimer:0,sourceHideCounter:0,attackerSlot:null,rememberedPosition:[0,0],
  owner:0,messageResource:0,effectResource:0,secondaryEffectResource:0,actions:new Int32Array(200),actionRead:0,actionWrite:0,
  tuples:new Int32Array(800),tupleRead:0,tupleWrite:0,values:new Int32Array(200),valueRead:0,valueWrite:0};}
function reset(body,strong,controlFlags){
  clearPhysicalGuardHandoff(body);
  body.speed=1;body.frozen=0;body.counter=body.escapeCounter=0;body.auxFF8=0;body.actionRead=0;body.actionWrite=-1;body.actions[0]=0;body.actions[1]=-1;
  body.physicalFamily=0;body.skillStatus=body.reactionFlags=body.reactionCounter=body.attackCooldown=body.attackFinishCounter=0;
  body.tupleRead=body.tupleWrite=body.valueRead=body.valueWrite=0;
  body.tuples[0]=-1;body.tuples[4]=-1;body.values[0]=body.values[1]=-1;
  if(body.cooperativePending!==undefined)body.cooperativePending=0;
  if(strong){body.classCode=body.skillLevel=-1;for(let i=0;i<200;i++)body.tuples[i*4]=-1;if(controlFlags&3)reface(body);}
}
const keepsQueues=body=>!!(body.dynamicFlags&2)||body.state===13;
function copy(body,execution){return body?Object.freeze({...body,...(body.nameBytes?{nameBytes:body.nameBytes.slice()}:{}),...(body.departureTarget?{departureTarget:Object.freeze([...body.departureTarget])}:{}),position:Object.freeze([...body.position]),rememberedPosition:Object.freeze([...body.rememberedPosition]),vitals:body.vitals?Object.freeze([...body.vitals]):null,scale:Object.freeze([...body.scale]),linkedResources:Object.freeze([...body.linkedResources]),statusMetadata:Object.freeze([...body.statusMetadata]),
  actions:body.actions.slice(),tuples:body.tuples.slice(),values:body.values.slice(),callbackExecution:execution}):null;}

export function createLegacyGameBattleBodies(matchFriend=null){
  if(matchFriend!==null&&typeof matchFriend!=='function')fail('LEGACY_BATTLE_FRIEND_CONTEXT');
  let closed=false,playback=null,motionSourceLength=null;const bodies=Array.from({length:22},()=>null);
  const interruptions=new WeakMap(),idlePhysicalRounds=new WeakMap();
  const active=()=>{if(closed)fail('LEGACY_BATTLE_CLOSED');if(playback?.advancing())fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');};
  const get=slot=>{active();return bodies[slotNumber(slot)];};
  const capacity=(body,count)=>{if(body.actionWrite+count>198)fail('LEGACY_BATTLE_BODY_CAPACITY');};
  const append=(body,owner,values)=>{capacity(body,values.length);for(const value of values){body.actions[++body.actionWrite]=value;body.actions[body.actionWrite+1]=-1;body.owner=owner;body.busy=1;}};
  const appendTuple=(body,values)=>{
    if(body.tupleWrite>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
    const at=body.tupleWrite++*4;
    body.tuples.set(values,at);
    body.tuples[at+4]=-1;
  };
  function assignSlot(body,slot,keepFormation){
    const formationSlot=keepFormation?(body.formationSlot??body.slot):slot;
    body.slot=slot;
    if(formationSlot===slot)delete body.formationSlot;
    else body.formationSlot=formationSlot;
    playback.reanchorSlot(body);
  }
  function swapSlots(from,to,keepPairFormation=false){
    const mover=bodies[from],pair=bodies[to];
    bodies[from]=pair;bodies[to]=mover;
    assignSlot(mover,to,false);
    if(pair)assignSlot(pair,from,keepPairFormation);
  }
  function checkSkillRow(body,row,resetQueues=row.reset){
    const actionWrite=resetQueues?-1:body.actionWrite,tupleWrite=resetQueues?0:body.tupleWrite;
    if(actionWrite+row.actions.length>198||tupleWrite+row.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
  }
  function applySkillRows(rows,owner,preserveState,discardedPrefixMask=0){
    for(const r of rows){
      const body=bodies[r.slot];
      if(r.reset){reset(body,false,0);if(!preserveState)body.state=0;}
      Object.assign(body,r.assignments);
      // Cleanup follows this interrupted prefix before a body callback can
      // use it. Keep the assignments without marking an empty queue busy.
      if((discardedPrefixMask&(1<<r.slot))&&!keepsQueues(body))continue;
      for(const values of r.tuples)appendTuple(body,values);
      append(body,owner,r.actions);
    }
  }
  function queueSkillPlan(plan,owner,kind,details={},tailRows=plan.recoveryRows??[]){
    const {position,missing,discardedPrefixMask}=plan;
    for(const r of plan.rows)checkSkillRow(bodies[r.slot],r);
    for(const tail of tailRows){
      const slot=position?.slotSources[tail.slot]??tail.slot,body=bodies[slot];
      // 4347e0 retains the prefix on a dead body or one already leaving.
      const retained=keepsQueues(body),prefix=retained?plan.rows.find(r=>r.slot===slot):null;
      const actionWrite=!retained||prefix?.reset?-1:body.actionWrite,tupleWrite=!retained||prefix?.reset?0:body.tupleWrite;
      if(actionWrite+(prefix?.actions.length??0)+tail.actions.length>198||
        tupleWrite+(prefix?.tuples.length??0)+tail.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
    }
    applySkillRows(plan.rows,owner,!!missing,discardedPrefixMask);
    if(position)for(const {fromSlot,toSlot,movePair} of position.swaps)swapSlots(fromSlot,toSlot,!movePair);
    const result=Object.freeze({kind:missing?kind.replace('-queued','-interrupted'):kind,principal:plan.principal,category:plan.category,level:plan.level,hits:plan.hits.length,
      ...details,...(missing?{missing}:{}),actors:Object.freeze(plan.rows.map(r=>position?position.slotSources.indexOf(r.slot):r.slot)),completeSKL:false});
    if(missing)interruptions.set(result,{owner,tailRows,principal:bodies[plan.principal],activate:plan.activateAfterCleanup??(missing.role==='target')});
    else api.activate(plan.principal);
    return result;
  }
  function queuePhysicalPlan(command,plan,owner,hasGroupedSuccessor){
    const {producerFieldCount}=plan;
    const producerEnd=producerFieldCount===undefined?undefined:battlePhysicalProducerEnd(command,producerFieldCount,hasGroupedSuccessor);
    if(producerEnd===null)
      return Object.freeze({kind:'physical-family-unavailable',reason:'physical-family-grouped-command-boundary'});
    const supported=playback.validatePhysicalFamily(plan.recoveryRows?{...plan,rows:[...plan.rows,...plan.recoveryRows]}:plan);
    if(supported.kind==='physical-family-unavailable')return supported;
    const idleRound=captureIdlePhysicalRound(command,plan,owner);
    const lateReceivers=plan.lateReceiveSlots?.map(slot=>bodies[slot]);
    const result=queueSkillPlan(plan,owner,'strike-queued',producerEnd===undefined?{}:{producerFieldCount,producerEnd});
    if(plan.guardHandoffs)queuePhysicalGuardHandoffs(plan,registered,lateReceivers);
    if(idleRound)idlePhysicalRounds.set(command,idleRound);
    return result;
  }
  function captureIdlePhysicalRound(command,plan,owner){
    if(!plan.idleAttackerSlots)return null;
    const mask=command.dependencyMask;
    if(plan.rows.some(row=>!(mask&(1<<row.slot))))return null;
    const members=maskSlots(mask).map(slot=>[slot,bodies[slot]]);
    if(members.some(([,body])=>!battlePhysicalEmptyIdleQueue(body)))return null;
    return {owner,mask,members,principal:bodies[plan.principal],heads:new Set(plan.idleAttackerSlots)};
  }
  function hasIdlePhysicalAttacker(command,owner,mask){
    const round=idlePhysicalRounds.get(command);
    if(!round||round.owner!==owner||round.mask!==mask||round.principal.busy)return false;
    let idle=false;
    for(const [slot,body] of round.members){
      if(bodies[slot]!==body||body.state!==0||keepsQueues(body))return false;
      if(!body.busy)continue;
      if(body.owner!==owner||body.actionRead>body.actionWrite)return false;
      const action=body.actions[body.actionRead];
      if(action===24&&round.heads.has(slot)&&body.actionRead===0&&body.tupleRead===0)idle=true;
      else if(action!==0||body.actions[body.actionRead+1]===161)return false;
    }
    return idle;
  }
  const pop=body=>{const next=++body.actionRead;body.state=next<200&&body.actions[next]!==-1?body.actions[next]:231;return body.state;};
  const registered=slot=>bodies[slot];
  function detach(body){
    if(bodies[body.slot]!==body){clearPhysicalGuardHandoff(body);return;}
    bodies[body.slot]=null;
    departPhysicalGuardHandoff(body,registered,pop);
  }
  const dispose=body=>{clearPhysicalGuardHandoff(body);body.actions.fill(0);body.tuples.fill(0);body.values.fill(0);body.nameBytes?.fill(0);};
  const api=Object.freeze({
    useMotionSource(command){active();const n=battleMotionSourceLength(command);if(n===undefined)fail('LEGACY_BATTLE_MOTION_SOURCE_REQUIRED');motionSourceLength=n;},
    applyCharacter(slot,statusFlags,resourceId=100500,linkedResources=[0,0],vitalValues=null,resource13a8=0,value1d0=0,name=null){active();slotNumber(slot);unsigned(statusFlags);integer(resourceId);integer(resource13a8);integer(value1d0);const linked=ownedNumbers(linkedResources);if(linked.length!==2)fail('LEGACY_BATTLE_BODY_LINKS');const vitals=vitalValues===null?null:ownedNumbers(vitalValues);if(vitals&&vitals.length!==4)fail('LEGACY_BATTLE_BODY_VITALS');
      const ownedName=name===null?null:battleOwnedBytes(name,28);
      const previous=bodies[slot],body=previous??fresh(slot),previousDead=!!(body.dynamicFlags&2),row=layout[slot];
      if(body.nameBytes){body.nameBytes.fill(0);delete body.nameBytes;}
      if(ownedName)body.nameBytes=ownedName;
      // 433cd0 immediately calls4348e0 after433a10, including a newly dead body.
      if(!previous){bodies[slot]=body;playback?.created(body);reset(body,false,0);}
      body.resourceId=resourceId;body.resource13a8=resource13a8;body.value1d0=value1d0;body.linkedResources=linked;body.vitals=vitals;body.rawStatusFlags=statusFlags;body.unmodeledCharacterMask=(statusFlags&~0x1f0fdfff)>>>0;body.drawFlagMask=resourceId>0x1af0d&&resourceId<0x1af26?4:0;if(body.drawFlagMask)body.drawFlagValue=4;
      if(statusFlags&1)body.position=[...row.entry];else if(!previousDead){body.position=[...row.target];reface(body);}
      body.dynamicFlags=(body.dynamicFlags&~15)|((statusFlags&1)?0:1)|(statusFlags&14);body.savedFlags=(body.savedFlags&~2)|(statusFlags&2);
      body.scale=statusFlags&0x1000?[Math.fround(1.3),Math.fround(1.3)]:[1,1];bodies[slot]=body;playback?.character(body,statusFlags,previousDead);
    },
    remove(slot){active();slotNumber(slot);const body=bodies[slot];if(body){detach(body);body.deleted=true;if(playback)playback.remove(body);else dispose(body);}},
    has(slot){return !!get(slot);},
    resetQueues(mask,controlFlags=0,force=false){active();unsigned(mask);unsigned(controlFlags);if(typeof force!=='boolean')fail('LEGACY_BATTLE_BOOLEAN');
      for(const slot of maskSlots(mask)){const body=bodies[slot];if(body&&(force||!keepsQueues(body)))reset(body,!force,controlFlags);}
    },
    appendActions(slot,owner,values){const body=get(slot);ownerNumber(owner);const owned=ownedNumbers(values);if(body)append(body,owner,owned);},
    insertAction(slot,owner,action,previousIndex){const body=get(slot);ownerNumber(owner);integer(action);integer(previousIndex);
      const next=previousIndex+1;if(next<0||next>198)fail('LEGACY_BATTLE_BODY_CAPACITY');
      if(body){body.owner=owner;body.actionWrite=next;body.actions[next]=action;body.actions[next+1]=-1;body.busy=1;}
    },
    setMessageResource(slot,value){const body=get(slot);integer(value);if(body)body.messageResource=value;},
    setEffectResource(slot,value){const body=get(slot);integer(value);if(body)body.effectResource=value;},
    finishUpperSkill(slot,category){const body=get(slot);if(!body)return;
      if(category!==112||!(body.dynamicFlags&2)){reface(body);if(category===112)body.afterImageEnabled=0;}
    },
    activate(slot){const body=get(slot);if(body)body.state=body.actions[body.actionRead];},
    popAction(slot){const body=get(slot);return body?pop(body):null;},
    appendTuple(slot,values){const body=get(slot),owned=ownedNumbers(values);if(owned.length!==3&&owned.length!==4)fail('LEGACY_BATTLE_BODY_TUPLE');
      if(body)appendTuple(body,owned);
    },
    popTuple(slot){const body=get(slot);if(!body)return null;
      if(body.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return body.tuples[++body.tupleRead*4]===-1;
    },
    appendValue(slot,value){const body=get(slot);integer(value);if(body){if(body.valueWrite>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      body.values[body.valueWrite++]=value;body.values[body.valueWrite]=-1;}
    },
    queueChat(slot,duration){active();return playback?.queueChat(slot>=0&&slot<20?bodies[slot]:null,duration)??null;},
    applyMpCost(slot,amount){
      const body=get(slot);
      if(!body)return Object.freeze({kind:'mp-cost-absent'});
      if(!body.vitals)return Object.freeze({kind:'mp-cost-unavailable',reason:'mp-cost-C-vitals-required'});
      const {index,before,value}=battleStatusVital(body.vitals,3,amount);
      body.vitals[index]=value;
      playback?.recordVital(Object.freeze({kind:'battle-vital',slot,field:'MP',before,value,delta:value-before}));
      return Object.freeze({kind:'mp-cost-applied',slot,before,value});
    },
    queueElementRebind(command,owner,resourceCode){
      const body=get(command.principalSlot);ownerNumber(owner);unsigned(resourceCode);
      if(!body)return Object.freeze({kind:'actor-transition-absent'});
      const [,flags,rawResourceId,selector]=command.fields,apply=(flags&0x80000)!==0;
      if(apply&&(selector<0||selector>3||!Number.isInteger(selector)))return Object.freeze({kind:'actor-transition-unavailable',reason:'element-selector'});
      if(!playback||body.unmodeledCharacterMask)return Object.freeze({kind:'actor-transition-unavailable',reason:'element-body-context'});
      const resourceId=resolveLegacyGameActorResource(rawResourceId,resourceCode);
      const orientation={slot:body.slot};
      reface(orientation);
      const element=apply?selector+1:0;
      if(!playback.canRebind(body,resourceId,element,orientation.facing))return Object.freeze({kind:'actor-transition-unavailable',reason:'element-graphic-resources'});
      capacity(body,4);
      appendTuple(body,[apply?selector:-1,flags,0,resourceId]);
      append(body,owner,[24,38,158,62]);
      body.state=body.actions[body.actionRead];
      return Object.freeze({kind:'element-rebind-queued',resourceId,element});
    },
    queueDeparture(slot,owner){
      const body=get(slot);ownerNumber(owner);
      if(!body)return Object.freeze({kind:'actor-transition-absent'});
      if(!playback||body.unmodeledCharacterMask)return Object.freeze({kind:'actor-transition-unavailable',reason:'departure-body-context'});
      capacity(body,5);
      playback.setDeparture(body);
      body.messageResource=0x5734;
      body.effectResource=0xd3;
      append(body,owner,[12,66,78,13,49]);
      body.state=body.actions[body.actionRead];
      return Object.freeze({kind:'departure-queued',target:Object.freeze([...body.departureTarget])});
    },
    queueBattleTime(slot,seconds,owner){
      const body=get(slot);integer(seconds);ownerNumber(owner);
      if(!body)return 'absent';
      if(body.busy||body.state!==0)return 'waiting';
      capacity(body,1);
      if(body.valueWrite>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      if(!playback?.prepareBattleTime(body,seconds))return 'unavailable';
      body.values[body.valueWrite++]=seconds;
      body.values[body.valueWrite]=-1;
      append(body,owner,[161]);
      body.state=body.actions[body.actionRead];
      return 'queued';
    },
    reface(slot){const body=get(slot);if(body)reface(body);},
    // 434b90: this inspects actual owned busy/position state; no supplied ready boolean.
    wait(mask,type,includeDead,counter,owner,controlFlags=0,command){active();unsigned(mask);integer(type);integer(counter);ownerNumber(owner);unsigned(controlFlags);
      if(typeof includeDead!=='boolean')fail('LEGACY_BATTLE_BOOLEAN');
      for(const slot of maskSlots(mask)){const body=bodies[slot];if(!body)continue;
        if(type!==23&&!includeDead&&(body.savedFlags&2)&&body.auxFF8===0&&body.state!==26)continue;
        if(body.busy===1){counter=(counter+1)|0;const recovered=[];
          // The same return queue can run once all live consumers are parked
          // behind a head that the ordinary paired script cannot activate.
          const idle=counter<=7200&&hasIdlePhysicalAttacker(command,owner,mask);
          if(counter>7200||idle){
            idlePhysicalRounds.delete(command);
            for(const affected of maskSlots(mask)){
              const b=bodies[affected];
              if(!b)continue;
              if(!idle)playback?.discardPendingAttachedRID(b);
              reset(b,false,controlFlags);
              append(b,owner,[11,38]);
              b.state=b.actions[b.actionRead];
              recovered.push(affected);
            }
            counter=0;
          }
          return Object.freeze({ready:false,counter,recovered:Object.freeze(recovered),repositioned:null,...(idle?{recovery:'idle-attacker'}:{})});
        }
        const target=layout[slot].target;if(type!==23&&(body.position[0]!==target[0]||body.position[1]!==target[1])){
          append(body,owner,[11,38]);body.state=body.actions[body.actionRead];
          return Object.freeze({ready:false,counter,recovered:Object.freeze([]),repositioned:slot});
        }
      }
      return Object.freeze({ready:true,counter,recovered:Object.freeze([]),repositioned:null});
    },
    configurePlayback(value){active();if(bodies.some(Boolean)||playback?.copyState().nodes.length)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_BUSY');
      const replacement=createBattleBodyPlayback({get:registered,pop,append,appendTuple,reface,dispose,matchFriend,motionSourceLength:()=>motionSourceLength,
        cloneBody(body){return Object.fromEntries(Object.entries(body).map(([k,v])=>[k,ArrayBuffer.isView(v)?v.slice():Array.isArray(v)?[...v]:v]));},
        createReplacement:slot=>fresh(slot),replace(slot,body){bodies[slot]=body;},copyBody:body=>copy(body,'partial'),
        createAnonymous(){const body=fresh(0);body.actorFlags=body.resourceId=body.facing=0;body.position=[0,0];return body;},
        detach},value);
      playback?.close();playback=replacement;return playback.copyState();
    },
    configureSkills(value){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');return playback.configureSkills(value);},
    applyCharacterFlags(value){active();unsigned(value);playback?.characterFlags(value);},
    queueCombination(command,owner,localSlot,resourceCode,controlFlags=0){active();ownerNumber(owner);unsigned(controlFlags);if(!playback?.skillsConfigured())return Object.freeze({kind:'combination-unavailable',reason:'combination-graphic-ports-unconfigured'});
      const plan=planBattleCombination(command,s=>bodies[s],localSlot,resourceCode);if(plan.kind!=='combination-plan')return plan;playback.validateCombination(plan,controlFlags);
      for(const r of plan.rows){capacity(bodies[r.slot],r.actions.length);if(bodies[r.slot].tupleWrite+r.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}
      for(const r of plan.rows){const b=bodies[r.slot];Object.assign(b,r.assignments);for(const t of r.tuples){const at=b.tupleWrite++*4;b.tuples.set(t,at);b.tuples[at+4]=-1;}append(b,owner,r.actions);}
      for(const slot of plan.order){const b=bodies[slot];b.state=b.actions[b.actionRead];}playback.queueCombination(plan,owner);return Object.freeze({kind:'combination-queued',principal:plan.principal,members:plan.order.length,order:plan.order,aggregate:plan.aggregate,actors:Object.freeze(plan.rows.map(r=>r.slot)),completeBattleGameplay:false});
    },
    copyCombination(owner){active();ownerNumber(owner);return playback?.copyCombination(owner)??null;},
    queueGMN(command,owner,resourceCode){
      active();ownerNumber(owner);unsigned(resourceCode);
      if(!playback?.skillsConfigured())return Object.freeze({kind:'gmn-unavailable',reason:'gmn-graphic-ports-unconfigured'});
      if(battleMotionSourceLength(command)===undefined)fail('LEGACY_BATTLE_MOTION_SOURCE_REQUIRED');
      return playback.queueGMN(command,owner,resourceCode);
    },
    isBusy(slot){return get(slot)?.busy===1;},
    queueSkill404(command,owner,localSlot,resourceCode){
      active();ownerNumber(owner);slotNumber(localSlot);unsigned(resourceCode);
      const unavailable=reason=>Object.freeze({kind:'skill404-unavailable',reason});
      if(!playback?.skillsConfigured())return unavailable('skill404-graphic-ports-unconfigured');
      if(battleMotionSourceLength(command)===undefined)fail('LEGACY_BATTLE_MOTION_SOURCE_REQUIRED');
      const getBody=slot=>bodies[slot];
      const tail=battleAttachedRIDParts(command)?planBattleAttachedRID(command,getBody,localSlot,resourceCode):null;
      if(tail&&tail.kind!=='attached-rid-plan')return unavailable(tail.reason);
      const plan=planBattleSkill404(tail?.core??command,getBody,localSlot,resourceCode);
      if(plan.kind!=='skill404-plan')return plan;
      const rejected=playback.validateSkill404(plan,tail);
      if(rejected)return rejected;
      if(tail){
        const supported=playback.validateAttachedRID(tail,plan);
        if(supported.kind==='attached-rid-unavailable')return unavailable(supported.reason);
      }
      const result=playback.queueSkill404(plan,owner);
      if(!tail)return result;
      playback.queueAttachedRID(tail,owner);
      return Object.freeze({...result,attachedRID:tail.records.length});
    },
    queueSharedStorage(command,owner,resourceCode){active();ownerNumber(owner);
      const plan=planBattleSharedStorage(command,s=>bodies[s],resourceCode);
      if(plan.kind!=='shared-storage-plan')return plan;
      if(!playback||plan.producer!=='ITM7'&&!playback.skillsConfigured())return Object.freeze({kind:'shared-storage-unavailable',reason:'shared-playback-unconfigured'});
      const source=battleMotionSourceLength(command);if(source===undefined)return Object.freeze({kind:'shared-storage-unavailable',reason:'shared-motion-source'});
      playback.validateSharedStorage(plan);for(const r of plan.rows){capacity(bodies[r.slot],r.actions.length);if(bodies[r.slot].tupleWrite+r.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}
      motionSourceLength=source;for(const r of plan.rows){const b=bodies[r.slot];Object.assign(b,r.assignments);for(const t of r.tuples)appendTuple(b,t);append(b,owner,r.actions);}const b=bodies[plan.principal];b.state=b.actions[b.actionRead];
      return Object.freeze({kind:'shared-storage-queued',producer:plan.producer,principal:plan.principal,target:plan.target,actors:Object.freeze(plan.rows.map(r=>r.slot)),completeBattleGameplay:false});
    },
    queueRiding(command,owner,localSlot,resourceCode){active();ownerNumber(owner);if(!playback)return Object.freeze({kind:'riding-unavailable',reason:'riding-playback-unconfigured'});
      const plan=planBattleRiding(command,s=>bodies[s],localSlot,resourceCode);if(plan.kind!=='riding-plan')return plan;const supported=playback.validateRiding(plan);if(supported.kind==='riding-unavailable')return supported;
      const counts=new Map();for(const r of plan.rows){const c=counts.get(r.slot)??{actions:0,tuples:0};c.actions+=r.actions.length;c.tuples+=r.tuples.length;counts.set(r.slot,c);}for(const[s,c]of counts){capacity(bodies[s],c.actions);if(bodies[s].tupleWrite+c.tuples>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}
      playback.queueRiding(plan,owner);for(const r of plan.rows){const b=bodies[r.slot];Object.assign(b,r.assignments);for(const t of r.tuples){const at=b.tupleWrite++*4;b.tuples.set(t,at);b.tuples[at+4]=-1;}append(b,owner,r.actions);}for(const r of plan.rows){const b=bodies[r.slot];b.state=b.actions[b.actionRead];}
      return Object.freeze({kind:'riding-queued',principal:plan.principal,target:plan.target,mode:plan.mode,actors:Object.freeze([...counts.keys()]),completeBattleGameplay:false});
    },
    resetCombinationCounter(owner){active();ownerNumber(owner);playback.resetCombinationCounter(owner);},
    activateNextCombination(owner,controlFlags){active();ownerNumber(owner);unsigned(controlFlags);return playback.activateNextCombination(owner,controlFlags);},
    releaseCombination(owner){active();ownerNumber(owner);playback.releaseCombination(owner);},
    queueStatusSkill(command,owner,localSlot,resourceCode,recoverMissing=false){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'status-skill-unavailable',reason:'status-skill-graphic-ports-unconfigured'});
      const plan=planBattleStatusSkill(command,slot=>bodies[slot],localSlot,resourceCode,recoverMissing);if(plan.kind!=='status-skill-plan')return plan;
      const source=plan.category===98?battleMotionSourceLength(command):null;
      if(source===undefined)return Object.freeze({kind:'status-skill-unavailable',reason:'status-skill-motion-source'});
      const position=plan.position,tailSlot=plan.missing?.role==='target'?(plan.assistSlot??plan.principal):null;
      const tailAction=tailSlot!==null&&plan.assistSlot!==undefined?72:null;
      const tailTuple=plan.category>=99&&plan.category<=104?[-1,0,0]:[-1,0,0,0];
      const tailRows=plan.interruptionTail??(tailSlot===null?[]:[{slot:tailSlot,actions:tailAction===null?[]:[tailAction],tuples:[tailTuple],assignments:{}}]);
      playback.validateStatusSkill(plan);
      const result=queueSkillPlan(plan,owner,'status-skill-queued',{self:plan.self,
        ...(plan.missing?{tailSlot,tailAction}:{}),...(position?{swaps:position.swaps,localSlot:position.localSlot}:{})},tailRows);
      if(source!==null)motionSourceLength=source;
      return result;
    },
    queueImpactSkill(command,owner,localSlot,resourceCode,recoverMissing=false){active();ownerNumber(owner);
      if(!playback?.skillsConfigured())return Object.freeze({kind:'impact-skill-unavailable',reason:'impact-skill-graphic-ports-unconfigured'});
      const plan=planBattleImpactSkill(command,slot=>bodies[slot],localSlot,resourceCode,recoverMissing);
      if(plan.kind!=='impact-skill-plan')return plan;
      const rejected=playback.validateImpactSkill(plan);if(rejected)return rejected;
      const result=queueSkillPlan(plan,owner,'impact-skill-queued');
      const length=battleMotionSourceLength(command);if(length!==undefined)motionSourceLength=length;
      return result;
    },
    finishImpactSkill(slot,category){const b=get(slot);if(b){reface(b);playback.finishImpactSkill(b,category);}},
    completeSkillInterruption(result,owner,released){active();
      const entry=interruptions.get(result);
      if(!entry||entry.owner!==owner||typeof released!=='boolean'||entry.principal!==bodies[result.principal])fail('LEGACY_BATTLE_SKILL_INTERRUPTION');
      if(released){
        for(const r of entry.tailRows){
          if(!bodies[r.slot])fail('LEGACY_BATTLE_SKILL_INTERRUPTION');
          checkSkillRow(bodies[r.slot],r);
        }
        applySkillRows(entry.tailRows,owner,true);
      }
      interruptions.delete(result);
      if(entry.activate)api.activate(result.principal);
      if(released&&entry.attachedRID)playback.queueAttachedRID(entry.attachedRID,owner);
    },
    queueSkill82(command,owner,localSlot,resourceCode,recoverMissing=false){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'skill82-unavailable',reason:'skill82-graphic-ports-unconfigured'});
      const plan=planBattleSkill82(command,slot=>bodies[slot],localSlot,resourceCode,recoverMissing);if(plan.kind!=='skill82-plan')return plan;
      playback.validateSkill82(plan);
      return queueSkillPlan(plan,owner,'skill82-queued');
    },
    queueNumericSkill(command,owner,localSlot,_resourceCode,recoverMissing=false){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'numeric-skill-unavailable',reason:'numeric-skill-graphic-ports-unconfigured'});
      const plan=planBattleNumericSkill(command,slot=>bodies[slot],localSlot,recoverMissing);if(plan.kind!=='numeric-skill-plan')return plan;
      playback.validateNumericSkill(plan.recoveryRows?{...plan,rows:[...plan.rows,...plan.recoveryRows]}:plan);
      return queueSkillPlan(plan,owner,'numeric-skill-queued',{reflectedAmount:plan.reflectedAmount,reflectors:plan.reflectors});
    },
    configureCastingContext(value){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');playback.configureCastingContext(value);},
    advanceBackground(){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');return playback.advanceBackground();},
    applyDrawPriorities(rows){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');playback.applyDrawPriorities(rows);},
    queueCasting(command,owner,localSlot,resourceCode,recoverMissing=false){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'casting-unavailable',reason:'casting-graphic-ports-unconfigured'});
      const plan=planBattleCasting(command,slot=>bodies[slot],localSlot,resourceCode,recoverMissing);if(plan.kind!=='casting-plan')return plan;
      const source=battleMotionSourceLength(command);
      const reseeds=plan.category===400||plan.category===401;
      if(reseeds&&source===undefined)return Object.freeze({kind:'casting-unavailable',reason:`skill${plan.category}-motion-source`});
      playback.validateCasting(plan.recoveryRows?{...plan,rows:[...plan.rows,...plan.recoveryRows]}:plan);
      const result=queueSkillPlan(plan,owner,'casting-queued',{reflectedAmount:plan.reflectedAmount,reflectors:plan.reflectors,
        ...(plan.transforms?{transforms:plan.transforms.length}:{}),...(plan.sideTargets?{sideTargets:Object.freeze(plan.sideTargets)}:{})});
      if(reseeds)motionSourceLength=source;
      return result;
    },
    queuePhysicalFamily(command,owner,localSlot,resourceCode,recoverMissing=false,hasGroupedSuccessor=false){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'physical-family-unavailable',reason:'physical-family-graphic-ports-unconfigured'});
      const plan=planBattlePhysicalFamily(command,slot=>bodies[slot],localSlot,resourceCode,recoverMissing);if(plan.kind!=='physical-family-plan')return plan;
      return queuePhysicalPlan(command,plan,owner,hasGroupedSuccessor);
    },
    queueStrike(command,owner){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'strike-unavailable',reason:'strike-graphic-ports-unconfigured'});const plan=planBattleStrike(command,slot=>bodies[slot]);if(plan.kind!=='strike-plan')return plan;
      playback.validateStrike(plan);for(const r of plan.rows){capacity(bodies[r.slot],r.actions.length);if(bodies[r.slot].tupleWrite+r.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}
      const first=bodies[plan.principal];first.classCode=plan.category;first.skillLevel=plan.level;first.mpCost=plan.cost;
      for(const r of plan.rows){const body=bodies[r.slot];for(const values of r.tuples){const at=body.tupleWrite++*4;body.tuples.set(values,at);body.tuples[at+4]=-1;}append(body,owner,r.actions);}first.state=first.actions[first.actionRead];return Object.freeze({kind:'strike-queued',principal:plan.principal,category:plan.category,level:plan.level,hits:plan.hits.length,actors:Object.freeze(plan.rows.map(r=>r.slot)),completeSKL:false});
    },
    queueStatus(command,owner){active();ownerNumber(owner);if(!playback?.skillsConfigured())return Object.freeze({kind:'status-unavailable',reason:'status-graphic-ports-unconfigured'});
      const plan=planBattleStatus(command,slot=>bodies[slot]);if(plan.kind!=='status-plan')return plan;const body=bodies[plan.principal];capacity(body,plan.actions.length);playback.validateStatus(plan);
      body.skillLevel=plan.level;body.numberValue=plan.amount;body.numberStyle=plan.style;if(plan.effect!==null)body.effectResource=plan.effect;
      append(body,owner,plan.actions);body.state=body.actions[body.actionRead];return Object.freeze({kind:'status-queued',principal:plan.principal,selector:plan.selector,numericStyle:plan.style,actors:Object.freeze([plan.principal])});
    },
    applyCharacterChange(command,owner,resourceCode){active();ownerNumber(owner);unsigned(resourceCode);if(!playback)return Object.freeze({kind:'character-change-unavailable',reason:'character-change-playback-required'});const plan=planBattleCharacterChange(command,slot=>bodies[slot],resourceCode);if(plan.kind!=='character-change-plan')return plan;playback.changeCharacter(bodies[plan.principal],plan);return Object.freeze({kind:'character-changed',principal:plan.principal,resourceId:bodies[plan.principal].resourceId,vitals:plan.vitals});},
    queueSummon(command,owner,localSlot,resourceCode){
      active();ownerNumber(owner);slotNumber(localSlot);unsigned(resourceCode);
      const unavailable=reason=>Object.freeze({kind:'summon-unavailable',reason});
      if(battleMotionSourceLength(command)===undefined||command.classCode!==93)return unavailable('summon-fields');
      const {principalSlot:principal,fields}=command,actor=bodies[principal];
      if(!actor)return Object.freeze({kind:'summon-absent',principal});
      if(!playback?.skillsConfigured())return unavailable('summon-playback-required');
      const mpCost=fields[1];
      if(actor.unmodeledCharacterMask||mpCost>0&&!actor.vitals)return unavailable('summon-caster-context');
      const records=[];
      for(let i=4;i<fields.length-1;i+=9){
        const [wireSlot,nameBytes,rawResourceId,value1d0,hp,maxHp,mp,maxMp,flags]=fields.slice(i,i+9);
        const slot=wireSlot===50?20:wireSlot===51?21:wireSlot,statusFlags=flags>>>0;
        if(slot===principal)return unavailable('summon-self-replacement');
        if(statusFlags&~0x0f0017ff)return unavailable('summon-character-flags');
        const statusMetadata=battleFriendMetadata(statusFlags);
        const friend=classifyBattleFriend(slot,localSlot,nameBytes,statusMetadata,matchFriend);
        if(friend===null)return unavailable('summon-friend-roster');
        records.push({slot,nameBytes,rawResourceId,resourceId:resolveLegacyGameActorResource(rawResourceId,resourceCode),
          value1d0,values:[hp,maxHp,mp,maxMp],statusFlags,statusMetadata,savedFlags:Number(friend)});
      }
      capacity(actor,4);
      if(actor.tupleWrite+records.length+1>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      const replacements=records.map(record=>{
        const {slot,nameBytes,resourceId,value1d0,values,statusFlags,statusMetadata,savedFlags}=record;
        const body=fresh(slot);
        Object.assign(body,{nameBytes:nameBytes.slice(),resourceId,value1d0,vitals:[...values],rawStatusFlags:statusFlags,
          dynamicFlags:statusFlags,statusMetadata,savedFlags,position:[...layout[slot].target],scale:[0,0],
          actionWrite:-1,effectResource:0xcc});
        body.tuples[0]=-1;
        append(body,owner,[78,52]);
        return body;
      });
      playback.createSummonBodies(replacements);
      for(const body of replacements){
        api.remove(body.slot);
        bodies[body.slot]=body;
        appendTuple(actor,[body.slot,0,0,0]);
      }
      appendTuple(actor,[-1,0,0,0]);
      Object.assign(actor,{classCode:93,skillLevel:fields[0]%10,mpCost,messageResource:0x5742});
      append(actor,owner,[24,53,66,65]);
      actor.state=actor.actions[actor.actionRead];
      const metadata=Object.freeze(records.map(({slot,nameBytes,rawResourceId,resourceId,value1d0,values,statusFlags})=>
        Object.freeze({slot,nameBytes:nameBytes.slice(),rawResourceId,resourceId,value1d0,values:Object.freeze(values),statusFlags})));
      return Object.freeze({kind:'summon-queued',principal,metadata});
    },
    queuePetTransition(command,owner,localSlot,resourceCode){active();ownerNumber(owner);slotNumber(localSlot);unsigned(resourceCode);if(!playback)return Object.freeze({kind:'pet-transition-unavailable',reason:'pet-transition-playback-required'});const plan=planBattlePetTransition(command,localSlot,resourceCode,matchFriend);if(plan.kind!=='pet-transition-plan')return plan;
      try{const actor=bodies[plan.principal],previous=bodies[plan.paired];if(!actor)return Object.freeze({kind:'pet-transition-unavailable',reason:'pet-transition-actor-absent'});if(previous?.busy===1)return Object.freeze({kind:'pet-transition-waiting',principal:plan.principal,paired:plan.paired});
        capacity(actor,plan.resetActive?4:3);if(actor.tupleWrite+(plan.resetActive?3:2)>199)fail('LEGACY_BATTLE_BODY_CAPACITY');if(plan.mode===0&&previous)capacity(previous,3);
        actor.pairedTarget=plan.paired;append(actor,owner,[39]);if(plan.resetActive){api.appendTuple(plan.principal,[-2,0,0]);append(actor,owner,[218]);}api.appendTuple(plan.principal,[plan.paired,0,0]);actor.messageResource=plan.mode===0?0x5743:0x5742;append(actor,owner,[66,65]);
        if(plan.mode===0&&!previous)return Object.freeze({kind:'pet-transition-absent',principal:plan.principal,paired:plan.paired});
        let target=previous;
        if(plan.mode===0){if(target.dynamicFlags&2)reset(target,false,0);target.effectResource=0xcd;append(target,owner,[78,51,49]);}
        else{if(!target){target=fresh(plan.paired);bodies[plan.paired]=target;playback.created(target);}
          target.nameBytes?.fill(0);target.nameBytes=plan.nameBytes.slice();
          target.resourceId=plan.resourceId;target.value1d0=plan.value1d0;target.vitals=[...plan.vitals];target.rawStatusFlags=target.dynamicFlags=plan.statusFlags;target.savedFlags=plan.savedFlags;target.statusMetadata=[...plan.statusMetadata];target.unmodeledCharacterMask=(plan.statusFlags&~0x0f0017ff)>>>0;
          playback.markFriendKnown(target);
          target.actionRead=target.tupleRead=target.tupleWrite=0;target.actionWrite=-1;target.actions[0]=target.tuples[0]=-1;target.position=[...layout[plan.paired].target];target.scale=[0,0];target.state=0;target.effectResource=0xcc;append(target,owner,[78,52]);}
        api.appendTuple(plan.principal,[-1,0,0]);actor.state=actor.actions[actor.actionRead];
        return Object.freeze({kind:'pet-transition-queued',principal:plan.principal,paired:plan.paired,mode:plan.mode,opaqueWord:plan.opaqueWord,created:plan.mode!==0&&!previous,metadata:plan.mode===0?null:Object.freeze({nameBytes:plan.nameBytes.slice(),rawResourceId:plan.rawResourceId,resourceId:plan.resourceId,value1d0:plan.value1d0,values:plan.vitals,statusFlags:plan.statusFlags})});
      }finally{plan.nameBytes?.fill(0);}
    },
    queuePosition(command,owner){active();ownerNumber(owner);if(!playback)return Object.freeze({kind:'change-unavailable',reason:'position-playback-required'});const plan=planBattlePosition(command,slot=>bodies[slot]);if(plan.kind!=='position-plan')return plan;
      const a=bodies[plan.fromSlot],b=bodies[plan.toSlot];capacity(a,2);if(plan.movePair)capacity(b,1);
      swapSlots(plan.fromSlot,plan.toSlot);a.effectResource=0xd2;append(a,owner,[78,11]);a.state=a.actions[a.actionRead];a.speed=3;a.speedPercent=100;
      if(plan.movePair){append(b,owner,[11]);b.state=b.actions[b.actionRead];b.speed=3;b.speedPercent=100;}
      return Object.freeze({kind:'position-queued',principal:plan.toSlot,fromSlot:plan.fromSlot,toSlot:plan.toSlot,movePair:plan.movePair});
    },
    queueEquipment(command,owner,resourceCode){active();ownerNumber(owner);unsigned(resourceCode);if(!playback)return Object.freeze({kind:'change-unavailable',reason:'equipment-playback-required'});const plan=planBattleEquipment(command,slot=>bodies[slot],resourceCode);if(plan.kind!=='equipment-plan')return plan;const b=bodies[plan.principal];capacity(b,3);b.nextResource=plan.nextResource;b.resource13a8=plan.resource13a8;b.messageResource=0x5731;b.effectResource=0xd1;append(b,owner,[66,78,64]);b.state=b.actions[b.actionRead];return Object.freeze({kind:'equipment-queued',principal:plan.principal,nextResource:plan.nextResource,resource13a8:plan.resource13a8});},
    stepPlayback(sourceContext){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');return playback.step(sourceContext);},
    copyPlayback(){active();return playback?.copyState()??null;},
    setIndicator(slot,first){const body=get(slot);if(typeof first!=='boolean')fail('LEGACY_BATTLE_BOOLEAN');if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');return body?playback.indicator(body,first):null;},
    beginEntry(weatherDirection){active();if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');playback.markEntryDeleted(weatherDirection);bodies.fill(null);},
    finishWeather(){active();playback?.finishWeather();},
    advanceOrdinaryRain(direction){active();return playback?.advanceOrdinaryRain(direction)??null;},
    detachExitPointers(){active();bodies.fill(null);},
    orientEntry(controlFlags){active();unsigned(controlFlags);if(!playback)fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');return playback.entryFacing(controlFlags);},
    checkArrivals(){active();const marked=[];for(let slot=0;slot<20;slot++){const body=bodies[slot];if(body&&!(body.dynamicFlags&1)){body.state=2;marked.push(slot);}}return Object.freeze({ready:marked.length===0,marked:Object.freeze(marked)});},
    clearInputTargets(){active();for(let slot=0;slot<20;slot++)if(bodies[slot])bodies[slot].actorFlags=((bodies[slot].actorFlags&~8)|4)>>>0;},
    setInputTargets(mask){active();unsigned(mask);if(mask>0xfffff)fail('LEGACY_BATTLE_INPUT_TARGET');for(let slot=0;slot<20;slot++)if(bodies[slot]&&(mask&(1<<slot)))bodies[slot].actorFlags=(bodies[slot].actorFlags|8)>>>0;},
    markInputReady(mask,reset=true){active();unsigned(mask);if(typeof reset!=='boolean')fail('LEGACY_BATTLE_BOOLEAN');for(let slot=0;slot<20;slot++)if(bodies[slot])bodies[slot].actorFlags=((reset?bodies[slot].actorFlags&~0x40:bodies[slot].actorFlags)|((mask&(1<<slot))?0x40:0))>>>0;},
    inputFlags(slot){const body=get(slot);return body?body.actorFlags:null;},
    copy(slot){return copy(get(slot),playback?'partial':'unimplemented');},
    copyState(){active();return Object.freeze({profile:LEGACY_GAME_BATTLE_BODY_PROFILE.id,bodies:Object.freeze(bodies.map(b=>copy(b,playback?'partial':'unimplemented'))),callbackExecution:playback?'partial':'unimplemented'});},
    clear(){active();for(let i=0;i<22;i++)api.remove(i);playback?.clear();},
    close(){if(closed)return;closed=true;for(const body of bodies)if(body)dispose(body);bodies.fill(null);playback?.close();playback=null;},
  });
  const queues={queueCombination:[planBattleCombination,'combination-unavailable'],queuePhysicalFamily:[planBattlePhysicalFamily,'physical-family-unavailable'],queueCasting:[planBattleCasting,'casting-unavailable'],queueImpactSkill:[planBattleImpactSkill,'impact-skill-unavailable'],queueStatusSkill:[planBattleStatusSkill,'status-skill-unavailable'],queueSkill82:[planBattleSkill82,'skill82-unavailable'],queueNumericSkill:[(command,get,localSlot,_resourceCode,recoverMissing)=>planBattleNumericSkill(command,get,localSlot,recoverMissing),'numeric-skill-unavailable'],queueStrike:[planBattleStrike,'strike-unavailable']},wrapped={...api};
  for(const[method,[planner,kind]]of Object.entries(queues))wrapped[method]=function(command,owner,localSlot,resourceCode,...rest){
    active();const parts=battleAttachedRIDParts(command);
    if(!parts||!playback?.skillsConfigured())return api[method](command,owner,localSlot,resourceCode,...rest);ownerNumber(owner);
    const {core}=parts;
    const groupedStatus=method==='queueStatusSkill'&&core.classCode===98;
    const recover=rest[0]===true;
    const planned=recover||groupedStatus&&core.fields[3]===7?planner(core,slot=>bodies[slot],localSlot,resourceCode,...rest):null;
    const resumeAttachment=method==='queuePhysicalFamily'&&rest[1]===true&&planned?.attachedRIDAfterAbort;
    if(!resumeAttachment&&planned&&(planned.missing||planned.kind.endsWith('-absent')||groupedStatus&&!planned.kind.endsWith('-plan')))
      return api[method](core,owner,localSlot,resourceCode,...rest);
    const position=planned?.position;
    const tail=planBattleAttachedRID(command,slot=>bodies[position?.slotSources[slot]??slot],position?.localSlot??localSlot,resourceCode);
    if(tail.kind!=='attached-rid-plan')return Object.freeze({kind,reason:tail.reason});
    const primary=planned??planner(core,slot=>bodies[slot],localSlot,resourceCode);
    if(!resumeAttachment&&!primary.kind.endsWith('-plan'))return api[method](core,owner,localSlot,resourceCode,...rest);
    if(primary.producerFieldCount!==undefined)return Object.freeze({kind,reason:'physical-family-attached-RID-boundary'});
    let attachmentQueues=primary;
    if(resumeAttachment){
      const rows=[];
      for(const slot of new Set(tail.records.map(row=>row.first.slot))){
        const returning=primary.recoveryRows?.find(row=>row.slot===slot);
        const startsReturn=slot===primary.principal&&returning?.actions.length;
        if(keepsQueues(bodies[slot])||(!startsReturn&&!battlePhysicalEmptyIdleQueue(bodies[slot])))
          return Object.freeze({kind,reason:'physical-family-attached-RID-interruption-context'});
        rows.push({slot,actions:returning?.actions??[],tuples:returning?.tuples??[],reset:true});
      }
      attachmentQueues={rows};
    }
    const support=playback.validateAttachedRID(tail,attachmentQueues);if(support.kind==='attached-rid-unavailable')return Object.freeze({kind,reason:support.reason});
    if(resumeAttachment){
      const absent=primary.kind==='physical-family-absent';
      const result=absent?primary:queuePhysicalPlan(core,{...primary,discardedPrefixMask:core.dependencyMask},owner,true);
      const entry=absent?{owner,tailRows:[],principal:null,activate:false}:interruptions.get(result);
      if(!entry)return result;
      const resumed=Object.freeze({...result,attachedRID:tail.records.length});
      interruptions.delete(result);
      interruptions.set(resumed,{...entry,attachedRID:tail});
      return resumed;
    }
    const result=api[method](tail.core,owner,localSlot,resourceCode,...rest);if(result.kind.endsWith('-unavailable'))return result;
    playback.queueAttachedRID(tail,owner);return Object.freeze({...result,attachedRID:tail.records.length});
  };return Object.freeze(wrapped);
}

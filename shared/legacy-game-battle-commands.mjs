import {LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE} from './legacy-game-battle-physical-family.mjs';
/** Source call-level battle manager and selected opcode queue dispatch. No automatic main10 loop. */
import {battleFail as fail,battleOwnedBytes,createBattleFieldReader} from './legacy-game-battle-bytes.mjs';
import {battleGroupedMotionToken,decodeLegacyGameBattleMotion} from './legacy-game-battle-motion.mjs';
import {createLegacyGameBattleBodies} from './legacy-game-battle-body.mjs';
import {BATTLE_MOTION_TOKENS} from './legacy-game-battle-motion-data.mjs';
import {pairedBattleSlot} from './legacy-game-battle-change.mjs';
import {LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE} from './legacy-game-battle-status-skills.mjs';
import {LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE} from './legacy-game-battle-impact-skills.mjs';
import {LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE} from './legacy-game-battle-numeric-skills.mjs';
import {battleSideEffect,createBattleSideEffects,scanBattleExitEffects,wipeBattleExitEffects} from './legacy-game-battle-side-effects.mjs';

export const LEGACY_GAME_BATTLE_COMMAND_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-battle-command-calls-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  objectSlots:32,actorSlots:22,delayPerGroup:22,waitRecoveryThreshold:7200,
  queueDispatchTokens:Object.freeze(['ESC','CLR','SUP','POS','MON','EQU','ITM','CMB','PSN','ANR','PUE','ACT','CFP','CHT','PNO','PLV','CBC','PDN','REB','BST','RID','END']),
  nativeDriver:'unimplemented',bodyCallbacks:'unimplemented',exitReturn:'unimplemented',
});
const integer=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_BATTLE_INTEGER');return n|0;};
const uint=n=>{if(!Number.isInteger(n)||n<0||n>0xffffffff)fail('LEGACY_BATTLE_INTEGER');return n>>>0;};
function context(value){
  if(!value||typeof value!=='object')fail('LEGACY_BATTLE_COMMAND_CONTEXT');const descriptors=Object.getOwnPropertyDescriptors(value),out={};
  for(const key of ['mainState','substate','controlFlags','localSlot','resourceCode']){
    if(!Object.hasOwn(descriptors[key]??{},'value'))fail('LEGACY_BATTLE_COMMAND_CONTEXT');
    out[key]=(key==='controlFlags'||key==='resourceCode'?uint:integer)(descriptors[key].value);
  }return out;
}
const bit=slot=>(2**slot)>>>0,remap=n=>n===50?20:n===51?21:n;
const copyRecord=c=>Object.freeze({...c,dependencyCounts:c.dependencyCounts.slice(),fields:Object.freeze(c.fields.map(v=>v instanceof Uint8Array?v.slice():v))});
const outcome=(kind,values={})=>Object.freeze({kind,...values});

export function createLegacyGameBattleCommands(matchFriend=null){
  let closed=false,advancing=false,exitSafe=false,raw=new Uint8Array(),plan=null,commandIndex=0,cursor=2,preflightCursor=2,mask=0,ready=0,stop=0,group=0,inputEnded=false,roundCounter=0,nextId=1;
  const internal=Symbol('owned-callback-pass');
  const bodies=createLegacyGameBattleBodies(matchFriend),slots=Array.from({length:32},()=>null),reservations=new Uint8Array(22);
  const sideEffects=createBattleSideEffects();
  const managerWait={type:0,dependencyMask:0xffffffff,waitCounter:0,id:0};
  const active=()=>{if(closed)fail('LEGACY_BATTLE_CLOSED');};
  const publicActive=()=>{active();if(advancing)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');};
  const wipePlan=()=>{raw.fill(0);raw=new Uint8Array();if(plan)for(const command of plan.commands)for(const field of command.fields)if(field instanceof Uint8Array)field.fill(0);plan=null;};
  const validateHandle=handle=>{active();const object=slots.find(o=>o?.handle===handle);if(!object)fail('LEGACY_BATTLE_COMMAND_HANDLE');return object;};
  const wait=(object,includeDead,ctx,command)=>{const result=bodies.wait(object.dependencyMask,object.type,includeDead,object.waitCounter,object.id,ctx.controlFlags,command);object.waitCounter=result.counter;return result;};
  const finish=(object,ctx)=>{
    const next=object.records[object.recordIndex+1];let token=null;
    if(next){const current=object.records[object.recordIndex],reader=createBattleFieldReader(raw,object.cursor);
      const skipUnknown=current.classCode===113&&object.phase===1&&object.cursor<current.nextOffset;
      token=battleGroupedMotionToken(reader,next,skipUnknown);
      if(!token)fail('LEGACY_BATTLE_COMMAND_CURSOR');}
    object.recordIndex++;
    bodies.resetQueues(object.dependencyMask,ctx.controlFlags);ready=0;
    if(!next){mask=(mask&~bit(object.slot))>>>0;slots[object.slot]=null;
      return outcome('command-released',{handle:object.handle,remaining:0});}
    object.type=next.index;object.phase=0;object.delay=0;object.waitCounter=0;object.cursor=token.argumentOffset;
    return outcome('command-next',{handle:object.handle,token:next.token,remaining:object.records.length-object.recordIndex});
  };
  function resumeSkill(object,ctx,command,result,kind){
    const absent=result.kind.endsWith('-absent');
    if(!absent&&!result.kind.endsWith('-interrupted'))return null;
    if(result.attachedRID){
      // The abort consumed one reserved count while the unknown token kept the SKL dispatch.
      bodies.resetQueues(object.dependencyMask,ctx.controlFlags);ready=0;
      bodies.completeSkillInterruption(result,object.id,true);
      object.records.pop();object.cursor=command.nextOffset;object.principal=result.principal;object.phase=1;object.waitCounter=0;
      return outcome(kind,{...result,kind,handle:object.handle});
    }
    // The native abort scans from inside the interrupted record. Continue from
    // the decoded boundary so an uppercase field cannot become the next token.
    object.cursor=command.nextOffset;
    const completion=finish(object,ctx);
    if(absent)return completion;
    bodies.completeSkillInterruption(result,object.id,completion.kind==='command-released');
    return outcome(kind,{...result,kind,handle:object.handle,completion});
  }
  function enqueue(effects,owner){
    const totals=new Map();for(const effect of effects)if(bodies.has(effect.slot))totals.set(effect.slot,(totals.get(effect.slot)??0)+effect.actions.length);
    for(const [slot,count]of totals){if(bodies.copy(slot).actionWrite+count>198)fail('LEGACY_BATTLE_BODY_CAPACITY');}
    for(const effect of effects){if(effect.message!==undefined)bodies.setMessageResource(effect.slot,effect.message);
      if(effect.effect!==undefined)bodies.setEffectResource(effect.slot,effect.effect);
      bodies.appendActions(effect.slot,owner,effect.actions);bodies.activate(effect.slot);}
  }
  const api=Object.freeze({
    applyCharacter(slot,statusFlags,resourceId=100500,linkedResources=[0,0],vitals=null,resource13a8=0,value1d0=0,name=null){publicActive();bodies.applyCharacter(slot,statusFlags,resourceId,linkedResources,vitals,resource13a8,value1d0,name);},
    removeCharacter(slot){publicActive();bodies.remove(slot);},
    configureRoundCounter(value){publicActive();roundCounter=uint(value);},
    configureBodyPlayback(value){publicActive();return bodies.configurePlayback(value);},
    configureSkills(value){publicActive();return bodies.configureSkills(value);},
    applyCharacterFlags(value){publicActive();bodies.applyCharacterFlags(value);},
    configureCastingContext(value){publicActive();bodies.configureCastingContext(value);},
    advanceBackground(){publicActive();return bodies.advanceBackground();},
    applyDrawPriorities(rows){publicActive();bodies.applyDrawPriorities(rows);},
    setTimer(seconds,mode,tick){publicActive();sideEffects.setTimer(integer(seconds),integer(mode),tick);},
    advanceTimer(tick){publicActive();sideEffects.advanceTimer(tick);},
    inspectSideEffects(){active();return sideEffects.inspect();},
    copyChat(){publicActive();return sideEffects.copyChat();},
    beginEntry(weatherDirection){publicActive();bodies.beginEntry(weatherDirection);wipePlan();slots.fill(null);reservations.fill(0);exitSafe=false;commandIndex=0;cursor=preflightCursor=2;mask=ready=stop=group=0;inputEnded=false;roundCounter=0;managerWait.waitCounter=0;},
    advanceOrdinaryRain(direction){publicActive();return bodies.advanceOrdinaryRain(direction);},
    prepareExit(sourceContext){publicActive();const ctx=context(sourceContext);if(ctx.mainState!==10||ctx.substate!==7)fail('LEGACY_BATTLE_EXIT_STATE');
      const slow=Object.getOwnPropertyDescriptor(sourceContext,'slowEffects');if(!slow||!Object.hasOwn(slow,'value')||typeof slow.value!=='boolean')fail('LEGACY_BATTLE_PLAYBACK_CONTEXT');
      const staged=[];
      let drainedCursor=cursor;
      try{
        if(plan){
          const known=new Map(plan.commands.map(record=>[record.tokenOffset,record]));
          for(const object of slots.filter(Boolean).sort((a,b)=>a.id-b.id)){
            const current=object.records[object.recordIndex];
            const consumes=object.phase===0&&(current.index===14||current.index===20);
            if(consumes)staged.push(battleSideEffect(current));
            const start=consumes?current.nextOffset:object.cursor;
            const remaining=object.records.length-object.recordIndex-1;
            staged.push(...scanBattleExitEffects(raw,start,known,remaining).records);
          }
          const global=scanBattleExitEffects(raw,cursor,known);
          staged.push(...global.records);
          drainedCursor=global.offset;
        }
      }catch(error){
        wipeBattleExitEffects(staged);
        if(['LEGACY_BATTLE_EXIT_SIDE_EFFECT','LEGACY_BATTLE_TEXT_PAIR'].includes(error?.code))return outcome('battle-exit-unavailable',{reason:'source-CHT-BST-drain'});
        if(['LEGACY_BATTLE_MOTION_TRUNCATED','LEGACY_BATTLE_CURSOR'].includes(error?.code))return outcome('battle-exit-unavailable',{reason:'source-abort-token-boundary'});
        throw error;
      }
      try{
        mask=0;stop=1;exitSafe=true;
        const callbacks=api.callCallbacks(sourceContext);
        let chat=0,time=0,cues=0;
        for(const record of staged){
          if(record.kind==='chat'){
            if(sideEffects.append(record))chat++;
            cues++;
          }else if(record.slot===ctx.localSlot){sideEffects.subtract(record.seconds);time++;}
        }
        bodies.finishWeather();bodies.detachExitPointers();cursor=drainedCursor;if(plan)commandIndex=plan.commands.length;
        return outcome('battle-exit-cleanup',{callbacks,bodyPointersCleared:22,sideEffects:Object.freeze({chat,time,chatSoundCues:cues})});
      }finally{wipeBattleExitEffects(staged);}
    },
    markExitDeleted(){publicActive();bodies.beginEntry(null);},
    orientEntry(controlFlags){publicActive();return bodies.orientEntry(controlFlags);},
    checkArrivals(){publicActive();return bodies.checkArrivals();},
    clearInputTargets(){publicActive();return bodies.clearInputTargets();},
    setInputTargets(mask){publicActive();return bodies.setInputTargets(mask);},
    markInputReady(mask,reset=true){publicActive();return bodies.markInputReady(mask,reset);},
    inputFlags(slot){publicActive();return bodies.inputFlags(slot);},
    load(value,sourceContext){publicActive();const ctx=context(sourceContext);
      if(ctx.mainState!==10||ctx.substate!==5)fail('LEGACY_BATTLE_COMMAND_LOAD_STATE');
      if(mask||slots.some(Boolean)||ready||stop||inputEnded)fail('LEGACY_BATTLE_COMMAND_LOAD_BUSY');
      const owned=battleOwnedBytes(value,4095);let prepared;
      try{prepared=decodeLegacyGameBattleMotion(owned);}catch(error){owned.fill(0);throw error;}
      wipePlan();raw=owned;plan=prepared;commandIndex=0;cursor=preflightCursor=2;
      if(plan.commands.length)bodies.useMotionSource(plan.commands[0]);
      return outcome('battle-motion-loaded',{commands:plan.commands.length,nextSubstate:6});
    },
    callManager(sourceContext,token){active();if(advancing&&token!==internal)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');const ctx=context(sourceContext);
      if((ctx.mainState!==10||(ctx.substate>>>0)<=5)&&stop!==1)return outcome('manager-gated');
      if(!plan&&stop!==1)return outcome('manager-unavailable',{reason:'motion-not-loaded'});
      if(mask===0)group=0;else if(ready!==0)return outcome('manager-busy');ready=1;
      if(stop===1)return outcome('manager-stop',{nextSubstate:7});
      if(inputEnded){if(mask)return outcome('manager-draining');const result=wait(managerWait,true,ctx);
        if(!result.ready)return outcome('manager-waiting',{wait:result});
        inputEnded=false;ready=0;group=0;roundCounter=(roundCounter+1)>>>0;
        return outcome('battle-round-drained',{nextSubstate:2,roundCounter});
      }
      let free=slots.findIndex(o=>o===null);if(free<0)free=32;
      reservations.fill(0);for(const object of slots)if(object)for(let i=0;i<22;i++)if(object.dependencyMask&bit(i))reservations[i]=(reservations[i]+1)&255;
      let previous=null,previousPrincipal=-1;const created=[],merged=[];
      while(free<32){const command=plan.commands[commandIndex];
        if(!command){cursor=preflightCursor=plan.consumedBytes;inputEnded=true;return outcome('manager-input-ended',{created:Object.freeze(created),merged:Object.freeze(merged)});}
        preflightCursor=command.nextOffset;
        for(let i=0;i<22;i++)if(command.dependencyCounts[i]){
          if((previousPrincipal!==command.principalSlot||i!==previousPrincipal)&&reservations[i])
            return outcome('manager-conflict',{commandIndex,slot:i,created:Object.freeze(created),merged:Object.freeze(merged)});
          reservations[i]=command.dependencyCounts[i];
        }
        if(previous&&(previousPrincipal===command.principalSlot||command.index===14||command.index===20)){
          previous.records.push(command);previous.dependencyMask=(previous.dependencyMask|command.dependencyMask)>>>0;merged.push(commandIndex);
        }else{
          if(!Number.isSafeInteger(nextId))fail('LEGACY_BATTLE_COMMAND_HANDLE');
          const id=nextId++,handle=Object.freeze({id,slot:free});
          previous={id,handle,slot:free,type:command.index,phase:0,delay:Math.imul(group,22),dependencyMask:command.dependencyMask,
            cursor:command.argumentOffset,records:[command],recordIndex:0,waitCounter:0};
          bodies.resetQueues(command.dependencyMask,ctx.controlFlags);slots[free]=previous;mask=(mask|bit(free))>>>0;created.push(handle);
          while(free<32&&slots[free])free++;
        }
        previousPrincipal=command.principalSlot;cursor=command.nextOffset;commandIndex++;
        if(command.groupAdvance)group=(group+1)|0;
      }
      return outcome('manager-capacity',{created:Object.freeze(created),merged:Object.freeze(merged)});
    },
    callCommand(handle,sourceContext,token){active();if(advancing&&token!==internal)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');const object=validateHandle(handle),ctx=context(sourceContext),command=object.records[object.recordIndex];
      if(!(mask&bit(object.slot))){if(exitSafe){slots[object.slot]=null;return outcome('command-aborted',{handle});}return outcome('command-unavailable',{reason:'exit-abort-side-effects'});}
      if(object.delay>=0){object.delay=(object.delay-1)|0;if(object.delay===0)group=(group-1)|0;
        return outcome('command-delay',{handle,remaining:object.delay});}
      if(command.index===13){
        const result=bodies.applyMpCost(command.principalSlot,command.fields[1]);
        if(result.kind==='mp-cost-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        object.cursor=command.nextOffset;
        const completion=finish(object,ctx);
        if(result.kind==='mp-cost-absent')return completion;
        return outcome('command-mp-cost',{handle,slot:result.slot,before:result.before,value:result.value,completion});
      }
      if(command.index===16||command.index===19){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          bodies.reface(object.principal);
          return finish(object,ctx);
        }
        const result=command.index===16?bodies.queueDeparture(command.principalSlot,object.id):
          bodies.queueElementRebind(command,object.id,ctx.resourceCode);
        if(result.kind==='actor-transition-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        object.cursor=command.nextOffset;
        if(result.kind==='actor-transition-absent')return finish(object,ctx);
        object.principal=command.principalSlot;
        object.phase=1;
        const {kind,...details}=result;
        return outcome('command-'+kind,{...details,handle,slot:object.principal});
      }
      if(command.index===14){
        if(object.phase===1){
          object.remainingChat=(object.remainingChat-1)|0;
          return object.remainingChat<=0?finish(object,ctx):outcome('command-chat-wait',{handle,remaining:object.remainingChat});
        }
        const record=battleSideEffect(command);
        const effectId=bodies.queueChat(record.slot,record.duration);
        const logged=sideEffects.append(record);
        object.remainingChat=record.duration;object.cursor=command.nextOffset;object.phase=1;
        return outcome('command-chat',{handle,logged,effectId});
      }
      if(command.index===20){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          bodies.reface(object.principal);
          return finish(object,ctx);
        }
        const {slot,seconds}=battleSideEffect(command);
        const queued=bodies.queueBattleTime(slot,seconds,object.id);
        if(queued==='waiting')return outcome('command-time-wait',{handle,slot});
        if(queued==='unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:'time-glyph-resources'});
        object.cursor=command.nextOffset;
        if(queued==='absent')return finish(object,ctx);
        object.principal=slot;object.phase=1;
        return outcome('command-time',{handle,slot,seconds});
      }
      if(command.index===0&&command.classCode===82){
        if(object.phase===1){const result=wait(object,false,ctx);return result.ready?finish(object,ctx):outcome('command-waiting',{handle,wait:result});}
        const result=bodies.queueSkill82(command,object.id,ctx.localSlot,ctx.resourceCode,true);
        if(result.kind==='skill82-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        const resumed=resumeSkill(object,ctx,command,result,'command-skill82');if(resumed)return resumed;
        object.principal=result.principal;object.cursor=command.nextOffset;object.phase=1;return outcome('command-skill82',{handle,...result,kind:'command-skill82'});
      }
      if(command.index===0&&command.classCode===93){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          bodies.reface(object.principal);
          return finish(object,ctx);
        }
        const result=bodies.queueSummon(command,object.id,ctx.localSlot,ctx.resourceCode);
        if(result.kind==='summon-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        object.cursor=command.nextOffset;
        if(result.kind==='summon-absent')return finish(object,ctx);
        object.principal=result.principal;
        object.phase=1;
        return outcome('command-summon',{handle,principal:result.principal,metadata:result.metadata});
      }
      if(command.index===0&&command.classCode===404){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          for(const slot of [object.principal,object.destination]){
            const body=bodies.copy(slot);
            if(body&&!(body.dynamicFlags&2))bodies.reface(slot);
          }
          return finish(object,ctx);
        }
        const result=bodies.queueSkill404(command,object.id,ctx.localSlot,ctx.resourceCode);
        if(result.kind==='skill404-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        object.cursor=command.nextOffset;
        if(result.kind==='skill404-skip')return finish(object,ctx);
        object.principal=result.principal;
        object.destination=result.destination;
        object.phase=1;
        return outcome('command-skill404',{...result,kind:'command-skill404',handle});
      }
      if(command.index===0&&LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE.classes.includes(command.classCode)){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          bodies.finishImpactSkill(object.principal,command.classCode);return finish(object,ctx);
        }
        const result=bodies.queueImpactSkill(command,object.id,ctx.localSlot,ctx.resourceCode,true);
        if(result.kind==='impact-skill-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        const resumed=resumeSkill(object,ctx,command,result,'command-impact-skill');if(resumed)return resumed;
        object.cursor=command.nextOffset;object.principal=result.principal;object.phase=1;
        return outcome('command-impact-skill',{handle,...result,kind:'command-impact-skill'});
      }
      if(command.index===0&&LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE.classes.includes(command.classCode)){
        if(object.phase===1){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          if(command.classCode===98)bodies.reface(object.principal);
          if([107,108,109,112,114,117].includes(command.classCode))bodies.finishUpperSkill(object.principal,command.classCode);
          return finish(object,ctx);
        }
        const result=bodies.queueStatusSkill(command,object.id,ctx.localSlot,ctx.resourceCode,true);
        if(result.kind==='status-skill-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        if(result.kind==='status-skill-assist-terminator'){
          // The original returns before activation and leaves its cursor past FF.
          // Complete this owned record without writing an inactive caster queue.
          object.cursor=command.nextOffset;
          return outcome('command-status-skill',{...result,kind:'command-status-skill',handle,completion:finish(object,ctx)});
        }
        const resumed=resumeSkill(object,ctx,command,result,'command-status-skill');if(resumed)return resumed;
        object.cursor=command.nextOffset;
        object.principal=result.principal;object.phase=1;return outcome('command-status-skill',{handle,...result,kind:'command-status-skill'});
      }
      if(command.index===0&&LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE.classes.includes(command.classCode)){
        if(object.phase===2){const list=object.reflectors;
          if(!list.length){object.phase=1;return outcome('command-numeric-skill-phase',{handle,phase:1});}
          const last=bodies.copy(list[list.length-1]),caster=bodies.copy(object.principal);
          if(list.slice(0,-1).some(slot=>bodies.copy(slot)?.state!==0)||last?.state!==1||!caster||caster.state!==0&&caster.state!==1)
            return outcome('command-numeric-skill-reflection-wait',{handle,reflectors:list});
          bodies.popAction(list[list.length-1]);object.phase=1;return outcome('command-numeric-skill-phase',{handle,phase:1});
        }
        if(object.phase===1){const result=wait(object,false,ctx);if(!result.ready)return outcome('command-waiting',{handle,wait:result});bodies.reface(object.principal);return finish(object,ctx);}
        const result=bodies.queueNumericSkill(command,object.id,ctx.localSlot,ctx.resourceCode,true);
        if(result.kind==='numeric-skill-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        const resumed=resumeSkill(object,ctx,command,result,'command-numeric-skill');if(resumed)return resumed;
        object.principal=result.principal;object.reflectors=result.reflectors;object.cursor=command.nextOffset;object.phase=2;
        return outcome('command-numeric-skill',{handle,...result,kind:'command-numeric-skill'});
      }
      if(command.index===0&&([400,401,402,405].includes(command.classCode)||command.classCode>=19&&command.classCode<=31)){
        const transformation=command.classCode===405;
        const directWait=command.classCode>=400&&command.classCode<=402;
        if(object.phase===2&&!directWait){const list=object.reflectors;
          if(!list.length){object.phase=1;return outcome('command-casting-phase',{handle,phase:1});}
          const last=bodies.copy(list[list.length-1]),caster=bodies.copy(object.principal);
          if(list.slice(0,-1).some(slot=>bodies.copy(slot)?.state!==0)||last?.state!==1||!caster||caster.state!==0&&caster.state!==1)
            return outcome('command-casting-reflection-wait',{handle,reflectors:list});
          bodies.popAction(list[list.length-1]);object.phase=1;return outcome('command-casting-phase',{handle,phase:1});
        }
        if(object.phase===(directWait?2:1)){
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          if(transformation)bodies.reface(object.principal);
          return finish(object,ctx);
        }
        const result=bodies.queueCasting(command,object.id,ctx.localSlot,ctx.resourceCode,true);
        if(result.kind==='casting-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        const resumed=resumeSkill(object,ctx,command,result,'command-casting');if(resumed)return resumed;
        object.cursor=command.nextOffset;
        if(result.kind==='casting-skip')return finish(object,ctx);
        object.principal=result.principal;object.reflectors=result.reflectors;object.phase=transformation?1:2;
        return outcome('command-casting',{handle,...result,kind:'command-casting'});
      }
      if(command.index===0&&LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE.classes.includes(command.classCode)){
        if(object.phase===1){const result=wait(object,false,ctx,command);if(!result.ready)return outcome('command-waiting',{handle,wait:result});const b=bodies.copy(object.principal);if(b&&!(b.dynamicFlags&2))bodies.reface(object.principal);return finish(object,ctx);}
        const hasGroupedSuccessor=object.recordIndex+1<object.records.length;
        const result=bodies.queuePhysicalFamily(command,object.id,ctx.localSlot,ctx.resourceCode,true,hasGroupedSuccessor);
        if(result.kind==='physical-family-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        if(result.kind==='physical-family-unbound'){
          // The native producer has no safe queue path for these empty slots.
          object.cursor=command.nextOffset;
          return outcome('command-strike-skipped',{...result,kind:'command-strike-skipped',handle,completion:finish(object,ctx)});
        }
        const resumed=resumeSkill(object,ctx,command,result,'command-strike');if(resumed)return resumed;
        object.principal=result.principal;object.cursor=result.producerEnd??command.nextOffset;object.phase=1;
        return outcome('command-strike',{handle,...result,kind:'command-strike'});
      }
      if(command.index===7&&[0,6,7].includes(command.fields[0])||command.index===0&&command.classCode===263){
        if(object.phase===1){const result=wait(object,false,ctx);if(!result.ready)return outcome('command-waiting',{handle,wait:result});bodies.reface(object.principal);return finish(object,ctx);}
        const result=bodies.queueSharedStorage(command,object.id,ctx.resourceCode);if(result.kind==='shared-storage-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;object.principal=result.principal;if(result.kind==='shared-storage-skip')return finish(object,ctx);object.phase=1;return outcome('command-shared-storage',{handle,...result,kind:'command-shared-storage'});
      }
      if(command.index===0){if(object.phase===1){const result=wait(object,false,ctx);if(!result.ready)return outcome('command-waiting',{handle,wait:result});const principal=bodies.copy(object.principal);if(principal&&!(principal.dynamicFlags&2))bodies.reface(object.principal);return finish(object,ctx);}
        const result=bodies.queueStrike(command,object.id,ctx.localSlot,ctx.resourceCode);if(result.kind==='strike-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.principal=result.principal;object.cursor=command.nextOffset;object.phase=1;return outcome('command-strike',{handle,...result,kind:'command-strike'});}
      if(command.index===8){
        if(object.phase===0){const result=bodies.queueCombination(command,object.id,ctx.localSlot,ctx.resourceCode,ctx.controlFlags);if(result.kind==='combination-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.principal=result.principal;object.cursor=command.nextOffset;object.phase=1;return outcome('command-combination',{handle,...result,kind:'command-combination'});}
        const state=bodies.copyCombination(object.id);if(!state)fail('LEGACY_BATTLE_COMBINATION_OWNER');
        if(object.phase===1){if(state.counter>=state.order.length){bodies.resetCombinationCounter(object.id);object.phase=2;}return outcome('command-combination-arrival',{handle,counter:state.counter,members:state.order.length,phase:object.phase});}
        if(object.phase===2){const last=bodies.activateNextCombination(object.id,ctx.controlFlags);if(last)object.phase=3;return outcome('command-combination-activation',{handle,index:state.counter,phase:object.phase});}
        const result=wait(object,false,ctx);if(!result.ready)return outcome('command-waiting',{handle,wait:result});const b=bodies.copy(object.principal);if(b&&!(b.dynamicFlags&2))bodies.reface(object.principal);bodies.releaseCombination(object.id);return finish(object,ctx);
      }
      if(command.index===21){
        if(object.phase===1){
          if(bodies.isBusy(20)||bodies.isBusy(21))return outcome('command-waiting',{handle,reason:'gmn-special-body-busy'});
          const result=wait(object,false,ctx);
          if(!result.ready)return outcome('command-waiting',{handle,wait:result});
          bodies.reface(object.principal);
          return finish(object,ctx);
        }
        const result=bodies.queueGMN(command,object.id,ctx.resourceCode);
        if(result.kind==='gmn-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});
        object.principal=result.selected??object.principal??0;
        object.cursor=command.nextOffset;
        object.phase=1;
        return outcome('command-gmn',{...result,kind:'command-gmn',handle});
      }
      if(command.index===22){if(object.phase===1){const result=wait(object,false,ctx);return result.ready?finish(object,ctx):outcome('command-waiting',{handle,wait:result});}
        const result=bodies.queueRiding(command,object.id,ctx.localSlot,ctx.resourceCode);if(result.kind==='riding-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;object.principal=result.principal;if(result.kind==='riding-skip')return finish(object,ctx);object.phase=1;return outcome('command-riding',{handle,...result,kind:'command-riding'});}
      if(command.index===5){if(object.phase===1){const result=wait(object,false,ctx),paired=bodies.copy(object.paired);if(!result.ready||paired?.busy===1)return outcome('command-waiting',{handle,wait:result,pairedBusy:paired?.busy??0});bodies.reface(object.principal);bodies.reface(object.paired);return finish(object,ctx);}
        const result=bodies.queuePetTransition(command,object.id,ctx.localSlot,ctx.resourceCode);if(result.kind==='pet-transition-waiting'){object.principal=result.principal;object.paired=result.paired;object.phase=2;const r=createBattleFieldReader(raw);r.seek(command.argumentOffset);r.number();object.cursor=r.offset;return outcome('command-pet-waiting',{handle,principal:result.principal,paired:result.paired});}
        if(result.kind==='pet-transition-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;object.principal=result.principal;object.paired=result.paired;if(result.kind==='pet-transition-absent')return outcome('command-pet-transition',{handle,...result,kind:'command-pet-transition',completion:finish(object,ctx)});object.phase=1;return outcome('command-pet-transition',{handle,...result,kind:'command-pet-transition'});}
      if(command.index===17){const result=bodies.applyCharacterChange(command,object.id,ctx.resourceCode);if(result.kind==='character-change-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;const completion=finish(object,ctx);return outcome('command-character-change',{handle,...result,kind:'command-character-change',completion});}
      if(command.index===9&&object.phase===0){const result=bodies.queueStatus(command,object.id);if(result.kind==='status-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;if(result.kind==='status-absent')return finish(object,ctx);object.principal=result.principal;object.phase=1;return outcome('command-status',{handle,...result,kind:'command-status'});}
      if((command.index===4||command.index===6)&&object.phase===0){const result=command.index===4?bodies.queuePosition(command,object.id):bodies.queueEquipment(command,object.id,ctx.resourceCode);if(result.kind==='change-unavailable')return outcome('command-unavailable',{handle,token:command.token,reason:result.reason});object.cursor=command.nextOffset;if(result.kind==='change-absent')return finish(object,ctx);object.principal=result.principal;object.phase=1;return outcome(command.index===4?'command-position':'command-equipment',{handle,...result,kind:command.index===4?'command-position':'command-equipment',...(command.index===4?{localSlot:ctx.localSlot===result.fromSlot?result.toSlot:ctx.localSlot}:{})});}
      if(command.index===7)return outcome('command-unavailable',{handle,token:command.token,reason:'item-variant-handler'});
      if(!LEGACY_GAME_BATTLE_COMMAND_PROFILE.queueDispatchTokens.includes(command.token)||command.index===12&&!bodies.copyPlayback())
        return outcome('command-unavailable',{handle,token:command.token,reason:'opcode-handler'});
      if(command.index===23){const result=wait(object,false,ctx);if(!result.ready)return outcome('command-waiting',{handle,wait:result});
        const finished=finish(object,ctx);return outcome('battle-exit-requested',{handle,finished,nextSubstate:7});}
      if(object.phase===1){const result=wait(object,command.index===2,ctx);
        if(!result.ready)return outcome('command-waiting',{handle,wait:result});
        if([4,6,9,10,11,15].includes(command.index))bodies.reface(object.principal);
        if(command.index===4){const paired=pairedBattleSlot(object.principal),body=bodies.copy(paired);if(body&&body.animationAction!==10&&body.state!==32)bodies.reface(paired);}
        return finish(object,ctx);
      }
      const reader=createBattleFieldReader(raw);reader.seek(object.cursor);const number=()=>reader.number(),readSlot=()=>remap(number()),effects=[];
      let principal;
      if(command.index===2||command.index===3){for(;;){const slot=readSlot();if(slot===255)break;
          if(!bodies.has(slot))continue;
          if(command.index===2)effects.push({slot,message:0x5730,actions:[0x42,12,13,49]});
          else{const dead=bodies.copy(slot).dynamicFlags&2;effects.push({slot,message:0x5733,effect:0xce,actions:dead?[0x42,78]:[0x42,78,55,62]});}
        }
      }else{
        principal=readSlot();if(!bodies.has(principal)){object.cursor=reader.offset;return finish(object,ctx);}
        if(command.index===12){const effectId=bodies.setIndicator(principal,false);object.cursor=reader.offset;return outcome('command-effect',{handle,effectId,finished:finish(object,ctx)});}
        if(command.index===1){const result=number(),actions=[0x42,12];let effect;
          if(result===0)actions.push(48,35,38);else if(result===1||result===2){if(result===2)actions.push(208);effect=0xd3;actions.push(78,50,13,ctx.localSlot===principal?244:49);}
          effects.push({slot:principal,message:0x5730,effect,actions});
        }else if(command.index===10)effects.push({slot:principal,actions:[139]});
        else if(command.index===11)effects.push({slot:principal,actions:[141]});
        else if(command.index===15)effects.push({slot:principal,message:0x573e,actions:[0x42,63]});
        else if(command.index===18)effects.push({slot:principal,effect:0xcd,actions:[78,82]});
      }
      enqueue(effects,object.id);object.cursor=reader.offset;object.principal=principal;object.phase=1;
      return outcome('command-queued',{handle,token:command.token,actors:Object.freeze(effects.map(e=>e.slot)),bodyExecution:bodies.copyPlayback()?'partial':'unimplemented'});
    },
    callCallbacks(sourceContext){publicActive();const ctx=context(sourceContext),d=Object.getOwnPropertyDescriptor(sourceContext,'slowEffects');
      if(!d||!Object.hasOwn(d,'value')||typeof d.value!=='boolean')fail('LEGACY_BATTLE_PLAYBACK_CONTEXT');ctx.slowEffects=d.value;
      if(!bodies.copyPlayback())fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION_REQUIRED');advancing=true;
      try{const manager=api.callManager(ctx,internal),commands=[];let nextSubstate=manager.nextSubstate??null,localSlotUpdate=null;
        if(nextSubstate!==null)ctx.substate=nextSubstate;
        for(const object of slots.filter(Boolean).sort((a,b)=>a.id-b.id)){
          const result=api.callCommand(object.handle,ctx,internal);commands.push(result);
          if((result.kind==='command-position'||result.kind==='command-status-skill')&&result.localSlot!==undefined&&result.localSlot!==ctx.localSlot){
            ctx.localSlot=result.localSlot;localSlotUpdate=ctx.localSlot;
          }
          if(result.nextSubstate!==undefined){nextSubstate=result.nextSubstate;ctx.substate=nextSubstate;}
        }
        const body=bodies.stepPlayback(ctx);if(body.events.some(e=>e.kind==='battle-riding-registry-move'))localSlotUpdate=ctx.localSlot;if(body.stopRequested){stop=1;ready=0;}
        for(const event of body.events)if(event.kind==='battle-time-feedback'&&event.local)sideEffects.subtract(event.seconds);
        return outcome('battle-callback-pass',{manager,commands:Object.freeze(commands),body,nextSubstate,localSlotUpdate,nativeDriver:'unimplemented',renderer:'unimplemented'});
      }finally{advancing=false;}
    },
    copyState(){publicActive();return Object.freeze({profile:LEGACY_GAME_BATTLE_COMMAND_PROFILE.id,loaded:!!plan,cursor,preflightCursor,commandIndex,
      activeMask:mask,ready,stop,groupIndex:group,inputEnded,roundCounter,reservations:reservations.slice(),
      slots:Object.freeze(slots.map(object=>object?Object.freeze({...object,records:Object.freeze(object.records.map(copyRecord))}):null)),
      bodies:bodies.copyState(),playback:bodies.copyPlayback(),nativeDriver:'unimplemented',bodyCallbacks:bodies.copyPlayback()?'partial':'unimplemented',exitReturn:'unimplemented'});},
    reset(){publicActive();wipePlan();slots.fill(null);reservations.fill(0);bodies.clear();commandIndex=0;cursor=preflightCursor=2;
      mask=ready=stop=group=0;inputEnded=exitSafe=false;roundCounter=0;managerWait.waitCounter=0;},
    close(){if(closed)return;closed=true;wipePlan();slots.fill(null);reservations.fill(0);sideEffects.close();bodies.close();},
  });return api;
}

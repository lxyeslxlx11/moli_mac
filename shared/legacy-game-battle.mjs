/** Fixed37c4 battle records, owned callback/frame ports and source receive rings. */
import {battleFail as fail,battleOwnedBytes as bytes,createBattleFieldReader as reader} from './legacy-game-battle-bytes.mjs';
import {createLegacyGameBattleCommands} from './legacy-game-battle-commands.mjs';
import {decodeLegacyGameBattleMotion} from './legacy-game-battle-motion.mjs';
import {createLegacyGameBattleFrameController} from './legacy-game-battle-frame.mjs';
import {createLegacyGameBattleEntry} from './legacy-game-battle-entry.mjs';
import {createLegacyGameBattleInput} from './legacy-game-battle-input.mjs';
import {createLegacyGameBattleLoop} from './legacy-game-battle-loop.mjs';
import {createLegacyGameBattleExit} from './legacy-game-battle-exit.mjs';
import {createLegacyGameBattleReturn} from './legacy-game-battle-return.mjs';
import {createBattlePetCache} from './legacy-game-battle-pet-cache.mjs';
import {createLegacyGamePets} from './legacy-game-pets.mjs';
import {createLegacyGamePlayerSkills} from './legacy-game-player-skills.mjs';
import {createLegacyGameItems} from './legacy-game-items.mjs';
import {createLegacyGamePresentation} from './legacy-game-presentation.mjs';
import {createLegacyGameBattleWater} from './legacy-game-battle-water.mjs';
export {LegacyGameBattleError} from './legacy-game-battle-bytes.mjs';
import {classifyLegacyGameActorResource,resolveLegacyGameActorResource} from './legacy-game-motion.mjs';
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT} from './legacy-game-battle-data.mjs';
export {LEGACY_GAME_BATTLE_SLOT_LAYOUT};
export const LEGACY_GAME_BATTLE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-records-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',slots:22,ringSlots:4,recordBytes:4095,nameBytes:28,mainState:10,scope:'receive-queues-and-character-records',renderer:'unimplemented',commands:'unimplemented'});
const int=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_BATTLE_INTEGER');return n|0;};
const digit=n=>n>=48&&n<=57?n-48:n>=65&&n<=70?n-55:-1;
export function decodeLegacyGameBattleCharacters(value){const raw=bytes(value,4095);try{if(raw[0]!==67)fail('LEGACY_BATTLE_CHARACTER_TAG');const r=reader(raw),flags=r.number(),records=[];if(!(flags&0x20))while(!r.done){const wireSlot=r.number(),slot=wireSlot<0||wireSlot>21?0:wireSlot,nameBytes=r.name(),values=Array.from({length:10},()=>r.number());records.push(Object.freeze({slot,wireSlot,nameBytes,rawResourceId:values[0],rawResource13a8:values[1],value1d0:values[2],values:Object.freeze(values.slice(3,7)),statusFlags:values[7]>>>0,rawLinkedResources:Object.freeze(values.slice(8,10))}));if(records.length>2048)fail('LEGACY_BATTLE_RECORD_BUDGET');}return Object.freeze({kind:'battle-characters',flags:flags>>>0,end:!!(flags&0x20),records:Object.freeze(records),consumedBytes:r.offset});}finally{raw.fill(0);}}
const hexDigit=n=>{const d=digit(n);return d>=0?d:n>=97&&n<=102?n-87:-1;};
/** Source %X assignments stop at the first failed conversion or literal delimiter. */
function scanWords(raw,count){let at=2;const words=[];for(let i=0;i<count;i++){while([9,10,11,12,13,32].includes(raw[at]))at++;let sign=1;if(raw[at]===43||raw[at]===45){if(raw[at++]===45)sign=-1;}if(raw[at]===48&&(raw[at+1]===120||raw[at+1]===88))at+=2;let n=0,seen=false;while(at<raw.length){const d=hexDigit(raw[at]);if(d<0)break;n=(Math.imul(n,16)+d)>>>0;seen=true;at++;}if(!seen)break;words.push(Math.imul(n,sign)>>>0);if(i<count-1&&raw[at++]!==124)break;}return words;}
const ring=()=>({read:0,write:0,buffers:Array.from({length:4},()=>new Uint8Array())});
const clearRing=r=>{for(const b of r.buffers)b.fill(0);r.buffers=Array.from({length:4},()=>new Uint8Array());r.read=r.write=0;};
const copyRow=r=>r?Object.freeze({...r,nameBytes:r.nameBytes.slice(),values:Object.freeze([...r.values]),rawLinkedResources:Object.freeze([...r.rawLinkedResources]),resolvedLinkedResources:Object.freeze([...r.resolvedLinkedResources])}):null;
export function createLegacyGameBattleState(ordinary=null,display=null,matchFriend=null,waterOwner=undefined){let closed=false,processing=false,frame=null,entry=null,input=null,loop=null,exit=null,returnOwner=null,ordinaryGate=0,resourceCode=null,observed=false,pending=false,entryMode=0,background=0,generation=0,firstAck=false,roundCounter=0,exitNotice=false,lastCharacterFlags=0,bodyResetPending=false,castingLabelFlag=0;
 const water=createLegacyGameBattleWater(waterOwner,()=>ordinary?.waterContext?.()??null);
 const presentation=display??createLegacyGamePresentation(),ownsPresentation=display===null;
 const commands=createLegacyGameBattleCommands(matchFriend),pets=createLegacyGamePets(),playerSkills=createLegacyGamePlayerSkills(),items=createLegacyGameItems(),petCache=createBattlePetCache(),character=ring(),motion=ring(),pWords=[0,0,0,0,0,0],aWords=[0,0],rows=Array.from({length:22},()=>null);
 const active=()=>{if(closed)fail('LEGACY_BATTLE_CLOSED');if(processing)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');};
 const freeRows=()=>{for(const r of rows)r?.nameBytes.fill(0);rows.fill(null);};
 const prepareExit=context=>{const result=commands.prepareExit(context);if(result.kind!=='battle-exit-unavailable')freeRows();return result;};
 const leaveOrdinary=()=>{ordinaryGate=0;ordinary?.leave();};
 const normalize=n=>{if(classifyLegacyGameActorResource(n)===0)return n;if(resourceCode===null)fail('LEGACY_BATTLE_RESOURCE_CONTEXT');return resolveLegacyGameActorResource(n,resourceCode);};
 const push=(r,raw)=>{if(raw.length>4095)fail('LEGACY_BATTLE_BUDGET');r.buffers[r.write].fill(0);r.buffers[r.write]=raw.slice();r.write=(r.write+1)%4;};
 const snapshotRing=r=>Object.freeze({read:r.read,write:r.write,readable:r.read!==r.write,buffers:Object.freeze(r.buffers.map(b=>b.slice()))});
 const markAck=mainState=>{
   const marked=[];
   if(mainState!==10||roundCounter!==aWords[1]||bodyResetPending)return marked;
   // 436f50 walks the current body registrations. RID can register a body
   // before the next C supplies metadata for its slot.
   for(let slot=0;slot<20;slot++)if(commands.inputFlags(slot)!==null&&((aWords[0]>>>slot)&1)){
     if(rows[slot])rows[slot].actorFlags|=0x40;
     marked.push(slot);
   }
   commands.markInputReady(aWords[0],false);
   return marked;
 };
 const pairedVitals=local=>{if(local<0||local>=20)return null;const c=commands.copyState(),body=c.bodies.bodies[local],node=c.playback?.nodes.find(n=>n.kind==='body'&&n.slot===local);if(!body||node&&c.playback.nodes.some(n=>n.kind==='rider'&&n.parentId===node.id&&!n.deleted))return null;const slot=local<5||local>=10&&local<=14?local+5:local-5;return c.bodies.bodies[slot]?.vitals??null;};
 const registerMotionRow=(slot,m,metadataOrigin)=>{
   rows[slot]?.nameBytes.fill(0);
   rows[slot]={slot,nameBytes:m.nameBytes.slice(),rawResourceId:m.rawResourceId,resolvedResourceId:m.resourceId,
     value1d0:m.value1d0,values:[...m.values],statusFlags:m.statusFlags,rawResource13a8:0,resolvedResource13a8:0,
     rawLinkedResources:[0,0],resolvedLinkedResources:[0,0],actorFlags:0x60054,metadataOrigin};
 };
 const swapRows=({fromSlot,toSlot})=>{const a=rows[fromSlot],b=rows[toSlot];rows[fromSlot]=b?{...b,slot:fromSlot}:null;rows[toSlot]=a?{...a,slot:toSlot}:null;};
 const applyCommandEffects=result=>{if(result.kind==='command-position')swapRows(result);
   else if(result.kind==='command-status-skill'&&result.swaps)for(const swap of result.swaps)swapRows(swap);
   else if(result.kind==='command-pet-transition'&&result.metadata){const m=result.metadata,stale=rows[result.paired],prior=result.created?null:stale,body=commands.copyState().bodies.bodies[result.paired];stale?.nameBytes.fill(0);rows[result.paired]={...(prior??{slot:result.paired,rawResource13a8:0,resolvedResource13a8:body.resource13a8,rawLinkedResources:[...body.linkedResources],resolvedLinkedResources:[...body.linkedResources],actorFlags:body.actorFlags}),nameBytes:m.nameBytes.slice(),rawResourceId:m.rawResourceId,resolvedResourceId:m.resourceId,value1d0:m.value1d0,values:[...m.values],statusFlags:m.statusFlags,metadataOrigin:'MON'};}
   else if(result.kind==='command-gmn'&&result.metadata)registerMotionRow(result.slot,result.metadata,'GMN');
   else if(result.kind==='command-summon')for(const row of result.metadata)registerMotionRow(row.slot,row,'SKL93');
 };
 const callbacksOwned=context=>{
   const result=commands.callCallbacks(context);
   for(const command of result.commands)applyCommandEffects(command);
   for(const event of result.body.events){
     if(event.kind==='battle-riding-registry-move'){
       const row=rows[event.from];
       if(event.target!==event.from){rows[event.target]?.nameBytes.fill(0);rows[event.target]=null;}
       if(event.to!==event.from){rows[event.to]?.nameBytes.fill(0);rows[event.to]=row?{...row,slot:event.to}:null;rows[event.from]=null;}
     }else if(event.kind==='battle-skill404-registered'){
       const {slot}=event;
       rows[slot]?.nameBytes.fill(0);
       rows[slot]={slot,nameBytes:event.nameBytes.slice(),rawResourceId:event.rawResourceId,resolvedResourceId:event.resourceId,
         value1d0:event.value1d0,values:[...event.values],statusFlags:event.statusFlags,rawResource13a8:0,resolvedResource13a8:0,
         rawLinkedResources:[0,event.rawAttachmentResource],resolvedLinkedResources:[0,event.attachmentResource],
         actorFlags:event.actorFlags,metadataOrigin:'SKL404'};
     }else if(event.kind==='battle-motion-body-removed'){
       rows[event.slot]?.nameBytes.fill(0);
       rows[event.slot]=null;
     }
     petCache.event(event);
   }
   if(result.manager.kind==='battle-round-drained')roundCounter=result.manager.roundCounter;
   return result;
 };
 const frameOwned=()=>{commands.advanceBackground();const result=frame.step({width:640,height:480},commands.copyState().playback,background,presentation.inspect().selector);commands.applyDrawPriorities(result.depthPriorities);return result;};
 const consumeCharacterOwned=()=>{if(character.read===character.write)return null;const raw=character.buffers[character.read],decoded=decodeLegacyGameBattleCharacters(raw);const prepared=[];try{if(!decoded.end)for(const r of decoded.records)prepared.push({...r,resolvedResourceId:normalize(r.rawResourceId),resolvedResource13a8:normalize(r.rawResource13a8),resolvedLinkedResources:r.rawLinkedResources.map(normalize)});const seen=new Set();if(bodyResetPending){petCache.begin(pets.copyState().records,entry?.inspect().localSlot??0);freeRows();commands.reset();commands.configureRoundCounter(roundCounter);bodyResetPending=false;}character.read=(character.read+1)%4;lastCharacterFlags=decoded.flags;if(!decoded.end){if(entry)commands.configureCastingContext({entryMode,labelFlag:castingLabelFlag,localSlot:pWords[0]|0});commands.applyCharacterFlags(decoded.flags);for(const r of prepared){commands.applyCharacter(r.slot,r.statusFlags,r.resolvedResourceId,r.resolvedLinkedResources,r.values,r.resolvedResource13a8,r.value1d0,r.nameBytes);seen.add(r.slot);const previous=rows[r.slot];previous?.nameBytes.fill(0);rows[r.slot]={...r,nameBytes:r.nameBytes.slice(),actorFlags:previous?.actorFlags??0x60054};}for(let i=0;i<22;i++)if(!seen.has(i)){commands.removeCharacter(i);rows[i]?.nameBytes.fill(0);rows[i]=null;}petCache.characters(pets.findBattlePet(),pairedVitals(pWords[0]|0));}return Object.freeze({kind:'battle-characters-applied',end:decoded.end,flags:decoded.flags,records:decoded.records.length,slots:Object.freeze([...seen])});}finally{for(const r of decoded.records)r.nameBytes.fill(0);}};
 const api=Object.freeze({
  configureResources(code){active();if(code!==null&&(!Number.isInteger(code)||code<0||code>0xffffffff))fail('LEGACY_BATTLE_RESOURCE_CONTEXT');resourceCode=code;},
  applyPetRecord(consumer,slot,value){active();return pets.apply(consumer,slot,value,resourceCode??0);},
  applyPlayerSkillRecord(consumer,slot,value){active();return playerSkills.apply(consumer,slot,value);},
  applyPlayerCraftRecord(slot,value){active();return playerSkills.applyCraft(slot,value);},
  copyPlayerCraftRecipes(slot){active();return playerSkills.copyCraft(slot);},
  workContextMode:playerSkills.craftContext,
  setWorkContext:playerSkills.setCraftContext,
  copyCraftSkills:playerSkills.craftRecords,
  copyWorkSkills:playerSkills.workRecords,
  knowsCraftProduct:playerSkills.knowsCraftProduct,
  copyPlayerSkill:playerSkills.record,
  copyCraftItems:items.copyCraftRecords,
  copyPlayerSkillRoster(){active();return playerSkills.copyRoster();},
  applyItemRecords(value){active();return items.apply(value);},
  swapItemRecords(from,to){active();return items.swap(from,to);},
  copyItemSlots:items.copySlots,
  prepareItemUse:items.prepareUse,
  prepareTargetedItemUse:items.prepareTargetedUse,
  prepareItemDrop:items.prepareDrop,
  prepareItemMove:items.prepareMove,
  copyPets(){active();return pets.copyState();},
  copyPetTrainingRoster(){active();return pets.copyTrainingRoster();},
  petVersion(){return pets.inspect().version;},
  receiveTimer(seconds,mode,tick){active();commands.setTimer(seconds,mode,tick);return Object.freeze({kind:'game-time-update',...commands.inspectSideEffects().timer});},
  advanceTimer(tick){active();commands.advanceTimer(tick);},
  copyChat(){active();return commands.copyChat();},
  applyEntry(mode,resource){active();int(mode);int(resource);observed=true;if(mode<1)return Object.freeze({kind:'battle-entry',accepted:false,mode,background:resource,pending});frame?.resetPalette();pending=true;entryMode=mode;background=resource;generation++;bodyResetPending=true;firstAck=true;exitNotice=false;lastCharacterFlags=0;clearRing(character);clearRing(motion);return Object.freeze({kind:'battle-entry',accepted:true,mode,background,pending:true,generation,ordinarySourceBranch:true});},
  receive(value,mainState){active();int(mainState);const raw=bytes(value);try{active();let kind='ignored',assignments=0,markedSlots=[];if(raw[0]===67){push(character,raw);kind='characters';}else if(raw[0]===80){const values=scanWords(raw,6);values.forEach((n,i)=>{pWords[i]=n;});assignments=values.length;kind='parameters';}else if(raw[0]===65){const values=scanWords(raw,2);values.forEach((n,i)=>{aWords[i]=n;});assignments=values.length;if(firstAck){firstAck=false;roundCounter=aWords[1];commands.configureRoundCounter(roundCounter);}markedSlots=markAck(mainState);kind='acknowledgment';}else if(raw[1]===85){exitNotice=true;kind='exit-notice';}else if(raw[0]===77){push(motion,raw);kind='motion';}observed=true;return Object.freeze({kind:'battle-data',command:kind,assignments,markedSlots:Object.freeze(markedSlots),characterReadable:character.read!==character.write,motionReadable:motion.read!==motion.write,exitNotice});}finally{raw.fill(0);}},
  consumeCharacters(){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');processing=true;try{return consumeCharacterOwned();}finally{processing=false;}},
  consumeMotion(sourceContext){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!pending||bodyResetPending||character.read!==character.write)fail('LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');if(motion.read===motion.write)return null;const result=commands.load(motion.buffers[motion.read],sourceContext);motion.read=(motion.read+1)%4;return result;},
  callCommandManager(sourceContext){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!pending||bodyResetPending)fail('LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');const result=commands.callManager(sourceContext);if(result.kind==='battle-round-drained')roundCounter=result.roundCounter;return result;},
  callCommand(handle,sourceContext){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!pending||bodyResetPending)fail('LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');processing=true;try{const result=commands.callCommand(handle,sourceContext);applyCommandEffects(result);return result;}finally{processing=false;}},
  configureBodyPlayback(value){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');return commands.configureBodyPlayback(value);},
  configureSkills(value){active();if(entry&&(entry.inspect().mainState!==10||entry.inspect().phase>2))fail('LEGACY_BATTLE_SKILL_CONFIGURATION');return commands.configureSkills(value);},
  configureFrames(value){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');const replacement=createLegacyGameBattleFrameController(value);frame?.close();frame=replacement;return frame.inspect();},
  configureWaterContext(value){active();return water.configure(value);},
  copyWaterState(){active();return water.copyState();},
  stepFrame(request){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!pending||bodyResetPending)fail('LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');if(!frame)fail('LEGACY_BATTLE_FRAME_CONFIGURATION_REQUIRED');
    processing=true;try{return water.frame(frame.step(request,commands.copyState().playback,background,presentation.inspect().selector));}finally{processing=false;}},
  callCallbacks(sourceContext){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!pending||bodyResetPending)fail('LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');processing=true;try{return callbacksOwned(sourceContext);}finally{processing=false;}},
  configureEntry(value){active();if(entry)fail('LEGACY_BATTLE_ENTRY_OWNED');if(!frame||!commands.copyState().playback)fail('LEGACY_BATTLE_ENTRY_CONFIGURATION_REQUIRED');
    entry=createLegacyGameBattleEntry({
      initialize(){castingLabelFlag=ordinary?.battleLabelValues?.().some(n=>n===1101)?5:0;const wind=ordinary?.weatherDirection?.()??-1;ordinary?.begin();ordinaryGate=1;returnOwner?.reset();freeRows();commands.beginEntry(wind);commands.configureCastingContext({entryMode,labelFlag:castingLabelFlag,localSlot:pWords[0]|0});petCache.begin(pets.copyState().records,entry.inspect().localSlot);commands.configureRoundCounter(roundCounter);loop?.reset();exit?.reset();bodyResetPending=false;},
      background(){return water.capture(frame.backgroundPlan(background));},
      context(){if(resourceCode===null)fail('LEGACY_BATTLE_RESOURCE_CONTEXT');return{controlFlags:pWords[1]>>>0,resourceCode};},
      callbacks:callbacksOwned,
      frame:frameOwned,
      firstBackground(){commands.advanceBackground();},
      consumeCharacter:consumeCharacterOwned,localSlot(){return pWords[0]|0;},
      orient(){return commands.orientEntry(pWords[1]>>>0);},arrivals(){return commands.checkArrivals();},
      inputEnabled(){return input!==null;},beginInput(tick,serial){input?.begin(tick,serial);},input(tick){return input.step(tick);},
      loopEnabled(){return loop!==null;},motionLoop(context){return loop.step(context.substate,context);},
      exitEnabled(){return exit!==null;},exit(context){return exit.step(context.substate,context);},
      takeExitNotice(){const value=exitNotice;exitNotice=false;return value;},
      returnEnabled(){return returnOwner!==null;},ordinaryReturn(phase,tick){return returnOwner.step(phase,tick);},
    },value);return entry.inspect();
  },
  advanceEntry(tick){active();if(!pending)fail('LEGACY_BATTLE_ENTRY_REQUIRED');if(!entry)fail('LEGACY_BATTLE_ENTRY_CONFIGURATION_REQUIRED');
    processing=true;
    try{
      const result=water.finish(entry.step(tick,generation));
      if(result.mainStateBefore===10&&result.phaseBefore>=4&&result.phaseBefore<=6)commands.advanceTimer(tick);
      return result;
    }finally{processing=false;}
  },
  copyEntry(){active();return entry?.inspect()??null;},
  configureInput(){active();if(!entry)fail('LEGACY_BATTLE_ENTRY_CONFIGURATION_REQUIRED');if(input||entry.inspect().phase>3)fail('LEGACY_BATTLE_INPUT_CONFIGURATION');
    input=createLegacyGameBattleInput({
      context(){return{localSlot:entry.inspect().localSlot,controlFlags:pWords[1]>>>0,playerSkillMask:pWords[2]>>>0,petSkillMask:pWords[3]>>>0,mountedPet:pWords[5]|0,sceneIdentityB:ordinary?.identity?.()[1]??0};},
      playerSkillRecord(slot){return playerSkills.record(slot);},playerSkillRecords(){return playerSkills.battleRecords();},
      itemRecord(slot){return items.battleRecord(slot);},itemRecords(){return items.battleRecords();},weaponRemoval:items.weaponRemoval,
      petRecord(slot){return pets.record(slot);},petRecords(){return pets.copyState().records;},petValues(slot){return petCache.record(slot);},findBattlePet(){return pets.findBattlePet();},
      bodyMp(slot){return commands.copyState().bodies.bodies[slot]?.vitals?.[2]??null;},
      hasLocalBody(){const slot=entry.inspect().localSlot;return rows[slot]!==null&&commands.inputFlags(slot)!==null;},
      rows(){const b=commands.copyState().bodies.bodies;return Array.from({length:20},(_,i)=>rows[i]&&b[i]?{value170:b[i].vitals?.[0]??rows[i].values[0],statusFlags:b[i].dynamicFlags,actorFlags:b[i].actorFlags}:null);},
      clearControl(mask){pWords[1]=(pWords[1]&~mask)>>>0;},clearTargets(){commands.clearInputTargets();},setTargets(mask){commands.setInputTargets(mask);},
      beginMarks(){commands.markInputReady(roundCounter===aWords[1]?aWords[0]:0);},
      // Input mode follows the live child owned by the current local body.
      special13b4(){const p=commands.copyState().playback,body=p?.nodes.find(n=>n.kind==='body'&&n.slot===entry.inspect().localSlot);return!!body&&p.nodes.some(n=>n.kind==='rider'&&n.parentId===body.id&&!n.deleted);},
    });return input.inspect();
  },
  chooseInputCommand(name,revision){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.command(name,revision);},
  chooseInputTarget(slot){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.target(slot);},
  chooseInputPet(slot){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.pet(slot);},
  chooseInputPetSkill(index){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.petSkill(index);},
  chooseInputPlayerSkill(slot){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.playerSkill(slot);},
  chooseInputPlayerSkillLevel(index){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.playerSkillLevel(index);},
  chooseInputItem(slot,revision){active();if(!input||entry.inspect().phase!==4||input.inspect().generation!==generation||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_INPUT_NOT_READY');return input.item(slot,revision);},
  copyInput(){active();return input?.inspect()??null;},
  configureLoop(){active();if(!entry||loop||entry.inspect().phase>5)fail('LEGACY_BATTLE_LOOP_CONFIGURATION');
    loop=createLegacyGameBattleLoop({callbacks:callbacksOwned,
      frame:frameOwned,
      consumeMotion(context){if(motion.read===motion.write)return null;const result=commands.load(motion.buffers[motion.read],context);motion.read=(motion.read+1)%4;return result;},
    });return loop.inspect();
  },
  copyLoop(){active();return loop?.inspect()??null;},
  configureExit(){active();if(!entry||exit||entry.inspect().mainState!==10||entry.inspect().phase>7)fail('LEGACY_BATTLE_EXIT_CONFIGURATION');
    exit=createLegacyGameBattleExit({prepare:prepareExit,markDeleted(){commands.markExitDeleted();},leaveOrdinary});return exit.inspect();},
  prepareCityExit(){
    active();const current=entry?.inspect();
    if(!pending||current?.mainState!==10||current.generation!==generation)fail('LEGACY_BATTLE_EXIT_STATE');
    const result=prepareExit({mainState:10,substate:7,localSlot:current.localSlot,controlFlags:pWords[1]>>>0,resourceCode,slowEffects:false});
    if(result.kind==='battle-exit-unavailable')fail('LEGACY_BATTLE_EXIT_DEPENDENCY_UNAVAILABLE');
  },
  retireCityBattle(){
    active();if(!pending)return false;
    commands.markExitDeleted();freeRows();clearRing(character);clearRing(motion);
    exit?.reset();returnOwner?.reset();exitNotice=bodyResetPending=pending=false;leaveOrdinary();
    return true;
  },
  copyExit(){active();return exit?.inspect()??null;},
  ordinaryGated(){active();return ordinaryGate!==0;},
  advanceOrdinaryRain(direction){active();return pending?null:commands.advanceOrdinaryRain(direction);},
  configureReturn(){active();if(!ordinary||!entry||returnOwner||entry.inspect().mainState!==10)fail('LEGACY_BATTLE_RETURN_CONFIGURATION');returnOwner=createLegacyGameBattleReturn({frame(tick,stage){return ordinary.frame(tick,stage,commands.copyState().playback.phase);}});return returnOwner.inspect();},
  copyReturn(){active();return returnOwner?.inspect()??null;},
  commitReturn(){active();if(!pending||!returnOwner?.inspect().readyToCommit||entry.inspect().mainState!==9||entry.inspect().phase!==3||entry.inspect().generation!==generation)fail('LEGACY_BATTLE_RETURN_COMMIT_REQUIRED');pending=false;return Object.freeze({kind:'ordinary-return-committed',generation,mainState:9,substate:3});},
  copyCommands(){active();return commands.copyState();},
  copyMotionQueue(){active();return snapshotRing(motion);},
  copyMotionPlan(){active();if(motion.read===motion.write)return null;return decodeLegacyGameBattleMotion(motion.buffers[motion.read]);},
  copyState(){active();return Object.freeze({profile:LEGACY_GAME_BATTLE_PROFILE.id,observed,pending,entryMode,background,generation,bodyResetPending,resourceCode,mode2:entryMode===2,mode3:entryMode===3,sourceAe2b9c:Number([2,4,5,6].includes(entryMode)),pets:pets.copyState(),playerSkills:playerSkills.copyState(),items:items.inspect(),petCache:petCache.inspect(),parameters:Object.freeze([...pWords]),acknowledgment:Object.freeze([...aWords]),firstAck,roundCounter,exitNotice,lastCharacterFlags,characters:snapshotRing(character),motion:snapshotRing(motion),rows:Object.freeze(rows.map(r=>copyRow(input&&r?{...r,actorFlags:commands.inputFlags(r.slot)??r.actorFlags}:r))),rendering:frame?'partial':'unimplemented',completeRendererAvailable:false,entry:entry?.inspect()??null,actionExecution:'unimplemented'});},
  inspect(){return Object.freeze({state:closed?'closed':'open',profile:LEGACY_GAME_BATTLE_PROFILE.id,observed,pending,generation,characterReadable:!closed&&character.read!==character.write,motionReadable:!closed&&motion.read!==motion.write,items:items.inspect(),rows:closed?0:rows.filter(Boolean).length,rendererAvailable:frame!==null,completeRendererAvailable:false,entry:entry?.inspect()??null,sideEffects:closed?null:commands.inspectSideEffects(),actionExecutionAvailable:false});},
  close(){if(closed)return;closed=true;water.close();returnOwner?.close();returnOwner=null;ordinaryGate=0;exit?.close();exit=null;loop?.close();loop=null;input?.close();input=null;entry?.close();entry=null;frame?.close();frame=null;commands.close();pets.close();playerSkills.close();items.close();petCache.close();if(ownsPresentation)presentation.close();clearRing(character);clearRing(motion);freeRows();pWords.fill(0);aWords.fill(0);resourceCode=null;observed=pending=firstAck=exitNotice=bodyResetPending=false;entryMode=background=roundCounter=lastCharacterFlags=0;},
 });return api;
}

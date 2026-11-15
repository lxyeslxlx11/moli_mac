/** Fixed37c4 source input consumers. Semantic intents do not establish native UI hit testing. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGamePlayerSkillCost} from './legacy-game-player-skills.mjs';
const int=(n,lo=-2147483648,hi=2147483647)=>{if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_BATTLE_INPUT_INTEGER');return n|0;};
const formation=Object.freeze([14,12,10,11,13,19,17,15,16,18,9,7,5,6,8,4,2,0,1,3]);
const bit=slot=>1<<slot;
export const LEGACY_GAME_BATTLE_INPUT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-basic-battle-input-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  scope:'owned-player-pet-skill-and-item-input',commands:Object.freeze(['attack','guard','position','escape','pet','skill','item']),nativeHitTesting:false,completeMain10:false});
function rows(value){if(!Array.isArray(value)||value.length!==20)fail('LEGACY_BATTLE_INPUT_ROWS');const d=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(d).length!==21)fail('LEGACY_BATTLE_INPUT_ROWS');return Array.from({length:20},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_BATTLE_INPUT_ROWS');const row=d[i].value;if(row===null)return null;
    const r=Object.getOwnPropertyDescriptors(row),names=['value170','statusFlags','actorFlags'];if(Reflect.ownKeys(r).length!==3||names.some(k=>!Object.hasOwn(r[k]??{},'value')))fail('LEGACY_BATTLE_INPUT_ROWS');
    return{value170:int(r.value170.value),statusFlags:int(r.statusFlags.value,0,0xffffffff)>>>0,actorFlags:int(r.actorFlags.value,0,0xffffffff)>>>0};});}
/** 4374e0; the owner normally clears target bits with436fc0 before invoking it. */
export function legacyGameBattleTargetMask(value,actingSlot,mask,controlFlags,localSlot){const r=rows(value);int(actingSlot,0,19);int(mask,0,0xffffffff);int(controlFlags,0,0xffffffff);int(localSlot,0,21);
  let selected=r.reduce((m,row,i)=>m|(row&&(row.actorFlags&8)?bit(i):0),0);if(!(mask&1))return Object.freeze({enabled:false,mask:selected>>>0});
  const paired=(actingSlot<5||actingSlot>=10&&actingSlot<=14)?actingSlot+5:actingSlot-5;
  const allow=i=>{if(r[i]&&(r[i].value170>0||(mask&2)))selected|=bit(i);};
  if(mask&4)allow(paired);if(mask&8)allow(actingSlot);
  if(mask&0x810)for(let i=actingSlot<10?0:10;i<(actingSlot<10?10:20);i++)if(i!==actingSlot&&i!==paired&&((mask&0x10)||(r[i]?.statusFlags&4)))allow(i);
  if(mask&0x20)for(let i=actingSlot<10?10:0;i<(actingSlot<10?20:10);i++)allow(i);
  if((mask&0x400)&&((controlFlags&0x80)||actingSlot!==localSlot)){const at=formation.indexOf(actingSlot),rank=Math.trunc(at/5),column=at%5;
    const marked=i=>!!r[i]&&!!(selected&bit(i));
    if(rank===0){const behind=formation[column+5];for(let i=0;i<5;i++)if(marked(behind)&&marked(formation[10+i])&&r[formation[15+i]])selected&=~bit(formation[15+i]);}
    else if(rank===3){const behind=formation[column+10];for(let i=0;i<5;i++)if(marked(behind)&&marked(formation[5+i])&&r[formation[i]])selected&=~bit(formation[i]);}
  }
  return Object.freeze({enabled:true,mask:selected>>>0});
}
/** 437080; semantic slot intent substitutes only for the thin adapter's native hit-index lookup. */
export function legacyGameBattleTargetCode(slot,mask,eligibleMask){int(slot,0,19);int(mask,0,0xffffffff);int(eligibleMask,0,0xfffff);if(!(eligibleMask&bit(slot)))return null;
  let code=-1,highlights=[];
  if(mask&0x40)code=slot;
  else if(mask&0x80){code=slot+20;const at=formation.indexOf(slot),rank=Math.trunc(at/5),column=at%5;
    const candidates=rank===0?[at+5,at+1,at-1]:rank===1?[at-5,at+1,at-1]:rank===2?[at+5,at+1,at-1]:[at-5,at+1,at-1];
    highlights=candidates.filter((at,i)=>i===0||i===1&&column<4||i===2&&column>0).map(at=>formation[at]);
  }else if(mask&0x100){code=slot<10?40:41;highlights=Array.from({length:10},(_,i)=>(slot<10?0:10)+i).filter(i=>i!==slot);}
  else if(mask&0x200){code=42;highlights=Array.from({length:20},(_,i)=>i).filter(i=>i!==slot);}
  highlights=highlights.filter(i=>eligibleMask&bit(i));return code<0?null:Object.freeze({code,slot,highlights:Object.freeze(highlights)});
}
const wire=text=>Object.freeze({operationId:'send-004f88f0',arguments:Object.freeze([Uint8Array.from(text,c=>c.charCodeAt(0))])});
const hex=value=>value.toString(16).toUpperCase();
const useItem=(slot,target)=>wire('I|'+hex(slot)+'|'+hex(target));
const equipItem=slot=>wire('Q|'+hex(slot)+'|');
export function createLegacyGameBattleInput(access){let closed=false,started=false,generation=null,steps=0,state=0,primaryCount=0,petCount=0,selected=0,limitedSecondary=0,
  primaryMemory=0,secondaryMemory=0,deadline=0,timerActive=false,lastSecond=0,gate=true,completed=false,selectionMask=0,eligibleMask=0,intent=null,unavailable=null,
  menuState=3,menuMode=null,menuOffset=0,menuVelocity=0,selectedFlags=Array(9).fill(0),inputMode='primary',currentSkill=-1,petStage=1,rememberedPet=-1,petPopup=null,
  playerPopup=null,playerMain=-1,playerLevel=-1,playerTargeting=false,itemPopup=null,itemSelection=null;
  const active=()=>{if(closed)fail('LEGACY_BATTLE_INPUT_CLOSED');};
  const clearTargets=()=>{access.clearTargets();eligibleMask=0;};
  const paired=slot=>(slot<5||slot>=10&&slot<=14)?slot+5:slot-5;
  const actingSlot=()=>inputMode==='pet'?paired(access.context().localSlot):access.context().localSlot;
  const petIndex=()=>inputMode==='mounted'?access.context().mountedPet:(access.findBattlePet?.()??-1);
  const petRecord=()=>access.petRecord?.(petIndex())??null;
  const skillMask=s=>((s.targetMask<<16)>>16)>>>0;
  const permitted=(s,index)=>!!s?.present&&!!((access.context().petSkillMask>>>0)&(1<<index))&&access.bodyMp?.(actingSlot())!==null&&access.bodyMp?.(actingSlot())>=s.mpCost;
  const playerRecord=()=>access.playerSkillRecord?.(playerMain)??null;
  const mainPermitted=slot=>!!((access.context().playerSkillMask>>>0)&(1<<slot));
  const levelCost=l=>legacyGamePlayerSkillCost(playerRecord()?.fields[0x34]??0,l.fields[0x7c]);
  const levelPermitted=l=>!!l?.present&&l.nameBytes.length>0&&l.fields[0x8c]!==0&&access.bodyMp?.(access.context().localSlot)!==null&&access.bodyMp?.(access.context().localSlot)>=levelCost(l);
  const target=(mask,slot=access.context().localSlot)=>{selectionMask=mask;const c=access.context(),r=legacyGameBattleTargetMask(access.rows(),slot,mask,c.controlFlags,c.localSlot);eligibleMask=r.mask;access.setTargets(eligibleMask);return r.enabled;};
  const closeMenu=()=>{if(menuState!==3){if(menuOffset>0)menuOffset=0;if(menuVelocity<0)menuVelocity=0;menuState=2;}};
  const openMenu=mode=>{menuMode=mode;menuOffset=-153;menuVelocity=17;menuState=1;};
  const advanceMenu=()=>{if(menuState===1){menuOffset+=menuVelocity;menuVelocity--;if(menuVelocity<1){menuVelocity=0;menuState=0;}}
    else if(menuState===2){menuVelocity++;menuOffset-=menuVelocity;if(menuVelocity>16){menuVelocity=17;menuState=3;}}};
  const unsupported=code=>{unavailable=code;fail('LEGACY_BATTLE_INPUT_DEPENDENCY_UNAVAILABLE');};
  const closePetPopup=()=>{petPopup=null;};
  const openPetPopup=()=>{petPopup={introCalls:0,ready:false};};
  const closePlayerPopup=()=>{playerPopup=null;};
  const openPlayerPopup=(mode='main')=>{playerPopup={introCalls:0,ready:false,mode};};
  const closeItems=()=>{itemPopup=null;itemSelection=null;};
  const openItems=()=>{itemPopup={introCalls:0,ready:false};itemSelection=null;};
  const currentItem=choice=>{
    const row=access.itemRecord?.(choice.slot);
    return row?.enabled&&row.revision===choice.revision?row:null;
  };
  const itemView=()=>Object.freeze({state:itemPopup?(itemPopup.ready?'ready':'opening'):'closed',targeting:itemSelection!==null,
    records:itemPopup?access.itemRecords?.()??Object.freeze([]):Object.freeze([]),
    weaponRemoval:itemPopup?.ready?access.weaponRemoval?.()??null:null});
  const playerView=()=>Object.freeze({state:playerPopup?(playerPopup.ready?'ready':'opening'):'closed',introCalls:playerPopup?.introCalls??0,mode:playerPopup?.mode??null,mainSlot:playerMain,levelIndex:playerLevel,targeting:playerTargeting,
    records:playerPopup?.mode==='main'?Object.freeze((access.playerSkillRecords?.()??[]).map(r=>Object.freeze({...r,enabled:mainPermitted(r.slot)}))):Object.freeze([]),
    levels:playerPopup?.mode==='levels'?Object.freeze((playerRecord()?.levels??[]).slice(0,10).map(l=>Object.freeze({...l,mpCost:levelCost(l),enabled:levelPermitted(l)}))):Object.freeze([])});
  const roster=()=>Object.freeze((access.petRecords?.()??[]).filter(r=>r.present&&[1,2].includes(r.fields[0x6aa])).map(r=>{const values=access.petValues?.(r.slot)??[0,0,0,0];return Object.freeze({slot:r.slot,mode:r.fields[0x6aa],nameBytes:r.nameBytes.slice(),values:Object.freeze([...values]),enabled:r.fields[0x6aa]===1&&values[0]>0});}));
  const popup=()=>Object.freeze({state:petPopup?(petPopup.ready?'ready':'opening'):'closed',introCalls:petPopup?.introCalls??0,recallEnabled:!!petPopup?.ready&&(access.findBattlePet?.()??-1)!==-1,records:petPopup?roster():Object.freeze([])});
  const inspect=()=>Object.freeze({profile:LEGACY_GAME_BATTLE_INPUT_PROFILE.id,status:closed?'closed':'open',started,generation,steps,state,primaryCount,petCount,selected,limitedSecondary,
    primaryMemory,secondaryMemory,deadline,timerActive,lastSecond,gate,selectionMask,eligibleMask,menu:Object.freeze({state:menuState,mode:menuMode,offset:menuOffset,velocity:menuVelocity,x:341,y:menuOffset}),
    petPopup:popup(),playerPopup:playerView(),itemPopup:itemView(),inputMode,currentSkill,petStage,rememberedPet,petIndex:petIndex(),actingSlot:actingSlot(),skills:Object.freeze((petRecord()?.skills??[]).map((s,index)=>Object.freeze({...s,index,enabled:permitted(s,index)}))),
    selectedFlags:Object.freeze([...selectedFlags]),unavailable,nativeHitTesting:false,nativeSubmenus:'partial-player-skills-pet-skills-switch-and-items',completeMain10:false});
  return Object.freeze({
    inspect,
    begin(tick,serial){active();int(tick,0,0xffffffff);int(serial,1,0x7fffffff);started=true;generation=serial;steps=state=primaryCount=petCount=limitedSecondary=lastSecond=0;
      selected=0;inputMode='primary';if(rememberedPet!==(access.findBattlePet?.()??-1))currentSkill=-1;deadline=(tick+30000)>>>0;timerActive=true;completed=false;gate=true;intent=null;unavailable=null;selectionMask=eligibleMask=0;menuState=3;menuMode=null;menuOffset=menuVelocity=0;closePetPopup();closePlayerPopup();closeItems();playerTargeting=false;selectedFlags.fill(0);access.beginMarks();},
    command(name,expectedRevision){active();if(typeof name!=='string'||name.length>32||!/^[a-z-]+$/.test(name))fail('LEGACY_BATTLE_INPUT_COMMAND');if(!started||![1,4].includes(state)||menuState!==0||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');
      if(state===4){if(!['pet-wait','pet-cancel'].includes(name))fail('LEGACY_BATTLE_INPUT_NOT_READY');intent={kind:name};return;}
      if(['pet-close','pet-recall'].includes(name)){if(!petPopup?.ready)fail('LEGACY_BATTLE_INPUT_NOT_READY');if(name==='pet-recall'&&(access.findBattlePet?.()??-1)===-1)fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:name};return;}
      if(['skill-close','skill-back'].includes(name)){if(!playerPopup?.ready||name==='skill-back'&&playerPopup.mode!=='levels')fail('LEGACY_BATTLE_INPUT_NOT_READY');intent={kind:name};return;}
      if(name==='item-close'){if(!itemPopup?.ready&&!itemSelection)fail('LEGACY_BATTLE_INPUT_NOT_READY');intent={kind:name};return;}
      if(name==='weapon-remove'){
        if(!itemPopup?.ready)fail('LEGACY_BATTLE_INPUT_NOT_READY');
        const removal=access.weaponRemoval?.();
        if(!removal||removal.reason!==null||expectedRevision!==undefined&&removal.revision!==expectedRevision)fail('LEGACY_BATTLE_INPUT_DISABLED');
        intent={kind:name,revision:removal.revision};return;
      }
      if(!LEGACY_GAME_BATTLE_INPUT_PROFILE.commands.includes(name))unsupported('native-submenu-or-command-'+name);
      if(['position','pet','skill','item'].includes(name)&&limitedSecondary)fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:'command',name};},
    item(slot,revision){
      active();int(slot,8,27);
      if(!started||state!==1||menuState!==0||!itemPopup?.ready||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');
      if(!currentItem({slot,revision}))fail('LEGACY_BATTLE_INPUT_DISABLED');
      intent={kind:'item-choice',slot,revision};
    },
    playerSkill(slot){active();int(slot,0,14);if(!started||state!==1||menuState!==0||!playerPopup?.ready||playerPopup.mode!=='main'||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');if(!mainPermitted(slot)||!(access.playerSkillRecords?.()??[]).some(r=>r.slot===slot))fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:'player-skill',slot};},
    playerSkillLevel(index){active();int(index,0,9);if(!started||state!==1||menuState!==0||!playerPopup?.ready||playerPopup.mode!=='levels'||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');if(!levelPermitted(playerRecord()?.levels[index]))fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:'player-level',index};},
    pet(slot){active();int(slot,0,4);if(!started||state!==1||menuState!==0||!petPopup?.ready||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');const row=access.petRecord?.(slot);if(!row?.present||![1,2].includes(row.fields[0x6aa]))fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:'pet-choice',slot};},
    petSkill(index){active();int(index,0,9);if(!started||state!==4||menuState!==0||petStage!==1||intent)fail('LEGACY_BATTLE_INPUT_NOT_READY');if(!permitted(petRecord()?.skills[index],index))fail('LEGACY_BATTLE_INPUT_DISABLED');intent={kind:'pet-skill',index};},
    target(slot){active();int(slot,0,19);if(!started||menuState!==0||intent||!((state===1&&gate&&(selected===0||selected===2&&playerTargeting||selected===3&&itemSelection))||(state===4&&petStage===3)))fail('LEGACY_BATTLE_INPUT_NOT_READY');
      const result=legacyGameBattleTargetCode(slot,selectionMask,eligibleMask);if(!result)fail('LEGACY_BATTLE_INPUT_TARGET');intent={kind:'target',result};return result;},
    step(tick){active();int(tick,0,0xffffffff);if(!started)fail('LEGACY_BATTLE_INPUT_NOT_READY');const c=access.context(),flags=c.controlFlags>>>0;int(c.localSlot,0,21);
      if(c.localSlot>=20)unsupported('native-observer-input');if(!access.hasLocalBody())fail('LEGACY_BATTLE_INPUT_BODY_REQUIRED');const requests=[],sounds=[];
      advanceMenu();for(const popup of [petPopup,playerPopup,itemPopup])if(popup&&!popup.ready){if(popup.introCalls>9)popup.ready=true;popup.introCalls++;}let requestPhase5=false,countdown=null;unavailable=null;
      let callbackCompleted=false;
      const finishPet=remembered=>{clearTargets();petCount++;state=5;rememberedPet=remembered;closeMenu();callbackCompleted=true;};
      const openPet=mode=>{inputMode=mode;const row=petRecord()?.skills[currentSkill];if(currentSkill===-1||(mode==='mounted'&&selected!==0)||!permitted(row,currentSkill)||!target(skillMask(row),actingSlot())){petStage=1;currentSkill=-1;}
        if(mode==='mounted'){selectedFlags.fill(0);if(selected>=0&&selected<=8)selectedFlags[selected]=1;}state=4;openMenu(mode==='mounted'?4:3);sounds.push(0x38);completed=false;};
      if(itemSelection&&!currentItem(itemSelection)){clearTargets();openItems();}
      if(intent){const event=intent;intent=null;
        if(event.kind==='skill-close'){closePlayerPopup();selectedFlags[2]=0;sounds.push(0x39);}
        else if(event.kind==='item-close'){closeItems();clearTargets();selectedFlags[3]=0;sounds.push(0x39);}
        else if(event.kind==='weapon-remove'){
          const removal=access.weaponRemoval?.();
          if(!removal||removal.revision!==event.revision||removal.reason!==null)sounds.push(0x37);
          else{requests.push(equipItem(0xff));closeItems();completed=true;sounds.push(0x39);}
        }
        else if(event.kind==='item-choice'){
          const row=currentItem(event);
          if(!row)sounds.push(0x37);
          else{
            itemPopup=null;
            if(row.action==='equip'){
              requests.push(equipItem(row.slot));completed=true;
            }else if(!target(row.targetMask>>>0)){
              requests.push(useItem(row.slot,c.localSlot));completed=true;sounds.push(0x39);
            }else itemSelection={slot:row.slot,revision:row.revision};
            sounds.push(0x4d);
          }
        }
        else if(event.kind==='skill-back'){playerPopup.mode='main';sounds.push(0x33);}
        else if(event.kind==='player-skill'){const r=access.playerSkillRecord?.(event.slot);if(r?.present&&[0,5].includes(r.fields[0x2c])){
          if(!mainPermitted(event.slot))sounds.push(0x37);
          else{if([0x7fd4,0x7fd5].includes(c.sceneIdentityB)&&r.fields[0x30]===0x62)unsupported('native-skill-special-scene-window');playerMain=event.slot;playerPopup.mode='levels';sounds.push(0x33);}}}
        else if(event.kind==='player-level'){const l=playerRecord()?.levels[event.index];if(l?.present&&l.nameBytes.length){if(!levelPermitted(l))sounds.push(0x37);
          else{playerLevel=event.index;closePlayerPopup();
            if(!target(l.fields[0x84])){requests.push(wire('S|'+playerMain.toString(16).toUpperCase()+'|'+playerLevel.toString(16).toUpperCase()+'|'+c.localSlot.toString(16).toUpperCase()));clearTargets();sounds.push(0x39);state=2;primaryCount++;sounds.push(0x33);closeMenu();callbackCompleted=true;}
            else playerTargeting=true;sounds.push(0x33);}}}
        else if(event.kind==='pet-close'){closePetPopup();}
        else if(event.kind==='pet-recall'){if((access.findBattlePet?.()??-1)!==-1){requests.push(wire('M|FF'));completed=true;closePetPopup();sounds.push(0x39);}}
        else if(event.kind==='pet-choice'){const row=access.petRecord?.(event.slot),hp=access.petValues?.(event.slot)?.[0]??0;if(row?.present&&[1,2].includes(row.fields[0x6aa])){if(row.fields[0x6aa]===2||hp<1)sounds.push(0x37);else{requests.push(wire('M|'+event.slot.toString(16).toUpperCase()));completed=true;closePetPopup();sounds.push(0x39);}}}
        else if(event.kind==='pet-cancel'){clearTargets();currentSkill=-1;petStage=1;}
        else if(event.kind==='pet-wait'){petStage=0;if(inputMode==='mounted')selected=0;sounds.push(0x39);requests.push(wire('W|FF'));sounds.push(0x39);finishPet(petIndex());}
        else if(event.kind==='pet-skill'){const row=petRecord()?.skills[event.index];if(!permitted(row,event.index))fail('LEGACY_BATTLE_INPUT_DISABLED');if(inputMode==='mounted')selected=0;currentSkill=event.index;
          if(!target(skillMask(row),actingSlot())){requests.push(wire('W|'+currentSkill.toString(16).toUpperCase()+'|'+(petIndex()>>>0).toString(16).toUpperCase()));sounds.push(0x39);finishPet(petIndex());}sounds.push(0x33);petStage=2;}
        else if(event.kind==='command'&&event.name==='skill'&&selected===2&&selectedFlags[2]){if(playerTargeting){openPlayerPopup('levels');playerTargeting=false;clearTargets();}else if(playerPopup?.ready){if(playerPopup.mode==='levels')playerPopup.mode='main';else{closePlayerPopup();selectedFlags[2]=0;}}else if(!playerPopup)openPlayerPopup();}
        else if(event.kind==='command'){const togglePet=event.name==='pet'&&selected===4&&!!petPopup,toggleItems=event.name==='item'&&selected===3&&!!itemPopup;closePetPopup();closePlayerPopup();closeItems();playerTargeting=false;selectedFlags.fill(0);clearTargets();completed=false;
          if(event.name==='pet'){selected=4;selectedFlags[4]=1;if(!togglePet)openPetPopup();sounds.push(0x33);}
          else if(event.name==='item'){selected=3;selectedFlags[3]=Number(!toggleItems);if(!toggleItems)openItems();sounds.push(0x33);}
          else if(event.name==='skill'){selected=2;selectedFlags[2]=1;openPlayerPopup();gate=false;sounds.push(0x33);}
          else
          if(event.name==='attack'){selectedFlags[0]=1;selected=0;target(0x475);gate=false;sounds.push(0x33);}
          else{selected=event.name==='position'?6:0;selectedFlags[event.name==='guard'?1:event.name==='position'?6:7]=1;
            requests.push(wire(event.name==='guard'?'G':event.name==='position'?'P':'E'));completed=true;sounds.push(0x39);}
        }else if(event.kind==='target'&&selected===3&&state===1){
          if(itemSelection){requests.push(useItem(itemSelection.slot,event.result.code));closeItems();completed=true;sounds.push(0x39);}
        }else{requests.push(wire(state===4?'W|'+currentSkill.toString(16).toUpperCase()+'|'+event.result.code.toString(16).toUpperCase():selected===2?'S|'+playerMain.toString(16).toUpperCase()+'|'+playerLevel.toString(16).toUpperCase()+'|'+event.result.code.toString(16).toUpperCase():'H|'+event.result.code.toString(16).toUpperCase()));clearTargets();playerTargeting=false;completed=true;sounds.push(0x39);}
      }
      switch(state){
      case 0:
        if(c.localSlot<20&&access.special13b4()){
          if(!(flags&8)){openPet('mounted');break;}
          requests.push(wire('N'));primaryCount++;if(flags&0x20000){requests.push(wire('N'));primaryCount++;requestPhase5=true;}else access.clearControl(8);closeMenu();completed=false;break;
        }
        inputMode='primary';
        if(flags&4){if(c.localSlot<20)requests.push(wire('N'));primaryCount++;
          if(flags&0x20){state=3;closeMenu();completed=false;break;}
          if(flags&0x10){if(c.localSlot<20)requests.push(wire('N'));primaryCount++;requestPhase5=true;closeMenu();completed=false;break;}
          access.clearControl(4);closeMenu();completed=false;break;
        }
        selected=primaryCount===0?primaryMemory:secondaryMemory;selectedFlags.fill(0);completed=false;
        if(selected<0||selected>8)unsupported('remembered-native-command');
        if(selected>=0){selectedFlags[selected]=1;clearTargets();}
        if(selected===0)target(0x475);else if(selected===4)openPetPopup();else if(selected===2){playerTargeting=false;openPlayerPopup();}else if(selected===3)openItems();
        state=1;openMenu(flags&0x10?0:primaryCount===0?1:2);sounds.push(0x38);break;
      case 1:
        if(completed){state=2;primaryCount++;clearTargets();closeMenu();completed=false;}gate=true;break;
      case 2:
        if(menuState!==3)break;
        if(primaryCount===1){if(!(flags&0x10)){state=0;primaryMemory=selected;
            if(selected===6){limitedSecondary=1;primaryMemory=secondaryMemory=0;}else if(selected>1&&selected<7){limitedSecondary=1;secondaryMemory=0;}}
          else{primaryMemory=selected===6?0:selected;state=3;}break;}
        secondaryMemory=selected===6?0:selected;requestPhase5=true;break;
      case 3:
        if(flags&0x20){if(!(flags&8)){openPet('pet');break;}requests.push(wire('W|FF'));petCount++;}requestPhase5=true;break;
      case 4:
        if(petStage===2)petStage=3;
        if(completed){finishPet(access.findBattlePet?.()??-1);completed=false;}break;
      case 5:
        if(!callbackCompleted&&menuState===3){if(access.special13b4()&&petCount<2){completed=false;state=0;}else requestPhase5=true;}break;
      default:unsupported('native-input-state-'+state);
      }
      // 48b5b0 runs after the current input state even when that state requests main10/5.
      if(!(flags&4)||!(flags&8)||!(flags&0x10)){
        let remaining=(deadline-tick)|0;
        if(timerActive){if(remaining<1){timerActive=false;remaining=0;clearTargets();closeMenu();closePetPopup();closePlayerPopup();closeItems();playerTargeting=false;let advance=false;
            if(access.special13b4()){requests.push(wire('W|FF'));advance=true;}
            else if(!(flags&0x20)){if(primaryCount===0&&!(flags&4)){requests.push(wire('N'),wire('N'));advance=true;}
              else if(primaryCount===1&&!(flags&4)){requests.push(wire('N'));advance=true;}}
            else{if(primaryCount===0&&!(flags&4)){requests.push(wire('N'));advance=true;}if(petCount===0){requests.push(wire('W|FF'));advance=true;}}
            if(advance){sounds.push(0x37);requestPhase5=true;}}
          const second=Math.trunc(remaining/1000),base=remaining>9999?0x5690:0x569a;
          if(remaining<=9999&&second!==lastSecond){sounds.push(0xca);lastSecond=second;}
          const digits=String(second).padStart(2,' ').slice(0,2);countdown=Object.freeze({remaining,seconds:second,glyphs:Object.freeze([...digits].map(c=>c===' '?null:base+c.charCodeAt(0)-48))});
        }
      }
      steps++;return Object.freeze({kind:'source-basic-battle-input',steps,state,requestPhase5,requests:Object.freeze(requests),sounds:Object.freeze(sounds),countdown,snapshot:inspect(),nativeHitTesting:false,completeMain10:false});
    },
    close(){if(closed)return;closed=true;started=false;intent=null;closePetPopup();closePlayerPopup();closeItems();playerTargeting=false;selectedFlags.fill(0);eligibleMask=selectionMask=0;},
  });
}

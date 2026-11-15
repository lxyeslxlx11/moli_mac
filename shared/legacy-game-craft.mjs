/** Ordinary manufacture for the fixed 37c4 profile. All ports are borrowed byte owners. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
import {legacyGamePlayerSkillCost} from './legacy-game-player-skills.mjs';
import {createLegacyGameBattleRandom} from './legacy-game-battle-math.mjs';
import {legacyGameWorkContextSlot,legacyGameWorkContextAvailable,legacyGameWorkDuration} from './legacy-game-work-context.mjs';
import {legacyGameWorkMode,legacyGameWorkItemEligible,legacyGameDecorationItemGroup,
  legacyGameWorkMark,decodeLegacyGameItemWorkResult} from './legacy-game-work-actions.mjs';
import {legacyGameGatherPose,decodeLegacyGameWorkPeople,
  decodeLegacyGameWorkSubjects,decodeLegacyGameTargetWorkResult,decodeLegacyGameGatherResult} from './legacy-game-work-targets.mjs';

export const LEGACY_GAME_CRAFT_PROFILE = Object.freeze({
  id:'legacy-se6000-37c4-craft-input-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  positions:6, materialGroups:5, levelRows:10, recipeLimit:56, contextMode:0,
  initialOwnedRandomSeed:1, completeCrafting:false,
});
export class LegacyGameCraftError extends Error {
  constructor(code){super('Manufacture requires a current ordinary skill, recipe and material selection.');
    this.name='LegacyGameCraftError';this.code=code;}
}
const fail=code=>{throw new LegacyGameCraftError(code);};
const integer=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_CRAFT_INTEGER');return n|0;};
const tickValue=n=>{if(!Number.isInteger(n)||n<0||n>0xffffffff)fail('LEGACY_CRAFT_TICK');return n;};
const index=(n,max)=>{if(!Number.isInteger(n)||n<0||n>=max)fail('LEGACY_CRAFT_INDEX');return n;};
const command=(operationId,args)=>Object.freeze({operationId,arguments:Object.freeze(args)});
const ascii=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
const supported=s=>legacyGameWorkMode(s)!==null;
const prefix=table=>{const out=[];for(const row of table.recipes.slice(0,56)){if(row.fields[0]<0)break;out.push(row);}return out;};
const poseFor=id=>id===215?10:id===217||id===218?12:id===219?11:9;
const wipeResult=r=>{for(const b of r?.lostItemNames??[])b.fill(0);r?.subjectNameBytes?.fill(0);r?.foundNameBytes?.fill(0);};
const copyResult=r=>r?Object.freeze({...r,rawFields:Object.freeze([...r.rawFields]),
  ...(r.subjectNameBytes?{subjectNameBytes:r.subjectNameBytes.slice()}:{}),
  ...(r.foundNameBytes?{foundNameBytes:r.foundNameBytes.slice()}:{}),
  lostItemNames:Object.freeze(r.lostItemNames.map(b=>b.slice()))}):null;

export function decodeLegacyGameCraftResult(status,value){
  integer(status);const raw=assetBytes(value,32760),names=[];
  try{
    const fields=split(raw),numbers=Array.from({length:8},(_,i)=>{
      const token=fields[i]?.subarray(0,127);return token?.length?decimal(token):-1;
    });
    let lines=Number(numbers[0]>0)+Number(numbers[2]!==0);
    for(const n of numbers.slice(3,6))if(n!==0&&lines<8)lines++;
    for(let i=8;i<14&&lines<8;i++){
      const text=unescape(fields[i]?.subarray(0,255)??new Uint8Array());
      if(!text.length){text.fill(0);break;}
      names.push(text);lines++;
    }
    return Object.freeze({success:status!==0,skillExperience:numbers[0],skillLevelUp:numbers[2]!==0,
      enduranceDelta:numbers[3],dexterityDelta:numbers[4],intelligenceDelta:numbers[5],
      injured:numbers[6]!==0,injuryVisible:numbers[6]!==0&&lines<8,
      graphicIndex:status!==0?numbers[7]:0,rawFields:Object.freeze(numbers),lostItemNames:Object.freeze(names)});
  }catch(error){for(const b of names)b.fill(0);throw error;}finally{raw.fill(0);}
}

export function createLegacyGameCraft(ports){
  const random=createLegacyGameBattleRandom(1);
  let closed=false,opened=false,revision=0,phase='closed',skillSlot=null,levelIndex=null,recipeId=null;
  let positions=Array(6).fill(null),origin=null,deadline=null,durationMilliseconds=null,result=null,lastTick=null;
  let mode=null,target=null,markBytes=new Uint8Array(),startedCost=null;
  let people=[],subjects=[],personIndex=null,gatherContinuing=false,gatherInitial=true,poseOwned=false,poseCode=null;
  let directRequestSent=false;
  const targeted=()=>['disguise','transform','first-aid','treatment'].includes(mode);
  const gathering=()=>legacyGameGatherPose(mode)!==null;
  const active=()=>{if(closed)fail('LEGACY_CRAFT_CLOSED');};
  const selectedSkill=()=>skillSlot===null?null:ports.skill(skillSlot);
  const context=()=>ports.workContext?.()??{mode:0,tier:null,remainingMilliseconds:null,rideChild:false};
  const contextMode=()=>context().mode;
  const wireSkill=()=>legacyGameWorkContextSlot(skillSlot,contextMode());
  const recipesCurrent=()=>skillSlot===null||ports.recipes(skillSlot).contextMode===contextMode();
  const timingReady=()=>contextMode()===0||Number.isInteger(context().tier)&&context().tier>=0&&context().tier<7;
  const duration=(base,unsigned=false)=>legacyGameWorkDuration(base,context().tier,contextMode(),unsigned);
  const recipes=()=>skillSlot===null||mode!=='craft'?[]:prefix(ports.recipes(skillSlot));
  const selectedRecipe=()=>recipeId===null?null:recipes().find(r=>r.fields[0]===recipeId)??null;
  const pose=code=>{poseCode=code;const {display}=ports.location();return command('send-004f7be0',[...display,code]);};
  const contextCommand=code=>command('send-004f7b50',[...ports.location().display,code]);
  const resetContext=requests=>{if(contextMode()!==0){requests.push(contextCommand(62));ports.setWorkContext(0);}};
  const inspect=()=>Object.freeze({active:opened,revision,phase,skillSlot,levelIndex,recipeId,deadline,durationMilliseconds,
    ...(mode&&mode!=='craft'?{mode,targetSlot:target?.slot??null}:{} )});
  const clearPositions=()=>{positions=Array(6).fill(null);};
  const clearResult=()=>{wipeResult(result);result=null;};
  const clearTarget=()=>{target?.nameBytes.fill(0);target=null;markBytes.fill(0);markBytes=new Uint8Array();};
  const groupFor=item=>legacyGameDecorationItemGroup(item,!!(item&&(ports.knowsProduct?.(item.exchangeCode)??false)));
  const itemTarget=()=>target?ports.items().find(r=>r.slot===target.slot)??null:null;
  const cost=(recipe=selectedRecipe(),skill=selectedSkill())=>targeted()||gathering()||mode==='direct-skill'?(skill&&levelIndex!==null?legacyGamePlayerSkillCost(skill.fields[0x34],skill.levels[levelIndex].fields[0x7c]):null):mode==='craft'?(recipe&&skill?legacyGamePlayerSkillCost(skill.fields[0x34],recipe.fields[4]):null):
    mode==='decorate'?100:mode==='engrave'?10:target?Math.imul((itemTarget()??target).level,10):null;
  const affordable=()=>{const n=cost(),mp=ports.mp();return n!==null&&mp!==null&&mp>=n;};
  const gatherReady=()=>timingReady()&&affordable()&&ports.items().filter(i=>i.present&&i.slot>=8&&i.slot<28).length<20;
  const clearChoices=()=>{for(const row of [...people,...subjects])row.nameBytes.fill(0);people=[];subjects=[];personIndex=null;};
  function queryPeople(requests){clearChoices();clearTarget();clearResult();phase='loading-people';requests.push(command('send-004f79b0',[skillSlot]));}
  function startGather(tick){
    clearResult();gatherContinuing=true;phase='working';durationMilliseconds=duration(gatherInitial?6500:4500,true);
    deadline=(tick+durationMilliseconds)>>>0;lastTick=tick;startedCost=cost();
  }
  function submitTarget(row,wireIndex,requests){
    clearTarget();target={wireIndex,nameBytes:row.nameBytes.slice()};startedCost=cost();phase='awaiting';
    requests.push(command('send-004f7c70',[wireSkill(),levelIndex,wireIndex,new Uint8Array()]));
  }
  function retire(){
    opened=false;phase='closed';skillSlot=levelIndex=recipeId=null;origin=null;
    deadline=durationMilliseconds=lastTick=startedCost=null;clearPositions();clearTarget();clearResult();clearChoices();mode=null;
    gatherContinuing=false;gatherInitial=true;poseOwned=false;poseCode=null;revision++;
    directRequestSent=false;ports.setWorkContext?.(0);
  }
  function validSelection(){
    if(skillSlot===null)return true;
    const skill=selectedSkill();if(!supported(skill)||legacyGameWorkMode(skill)!==mode)return false;
    if(levelIndex!==null){const level=skill.levels[levelIndex];if(!level?.nameBytes.length||!level.fields[0x8c])return false;}
    return recipeId===null||selectedRecipe()!==null;
  }
  const fulfilled=recipe=>recipe.materials.map((m,i)=>m.fields[0]<0||positions.some(p=>p?.group===i));
  function canBegin(recipe,skill){
    const mp=ports.mp(),required=cost(recipe,skill);
    if(!supported(skill)||!timingReady()||required===null||mp===null||mp<required)return false;
    if(mode==='craft')return !!recipe&&fulfilled(recipe).every(Boolean);
    if(mode==='decorate')return positions.some(p=>p?.group===0)&&positions.some(p=>p?.group===1);
    const item=itemTarget();if(!legacyGameWorkItemEligible(mode,item,(skill.fields[0x1c]+contextMode())|0))return false;
    if(mode==='engrave'){
      try{const raw=legacyGameWorkMark(markBytes,!!(item.qualification&0x400));raw.fill(0);}
      catch{return false;}
    }
    return true;
  }
  function synchronizeItems(){
    if(phase!=='materials')return;
    const items=ports.items(),skill=selectedSkill(),recipe=selectedRecipe(),seen=new Set();
    for(let i=0;i<6;i++){
      const p=positions[i];if(!p)continue;const item=items.find(row=>row.slot===p.slot);
      let valid=!!item;
      if(valid&&mode==='decorate'){
        const group=groupFor(item);valid=group===p.group&&!seen.has(group);if(valid)seen.add(group);
      }else if(valid&&mode==='craft'){
        if(p.group<0)valid=![215,216].includes(skill.fields[0x30])&&[25,38,39].includes(item.category);
        else{const m=recipe?.materials[p.group];valid=!!m&&item.exchangeCode===m.fields[0]&&(item.quantity===0?1:item.quantity)>=m.fields[4];}
      }
      if(!valid)positions[i]=null;
    }
    if(target&&!legacyGameWorkItemEligible(mode,items.find(row=>row.slot===target.slot),(skill.fields[0x1c]+contextMode())|0))clearTarget();
  }
  function requireEditing(){if(phase!=='materials')fail('LEGACY_CRAFT_PHASE');}
  return Object.freeze({
    active(){active();return opened;},
    inspect,
    refresh(){active();if(!opened)return;if(!validSelection()){retire();return;}synchronizeItems();revision++;},
    invalidate(){active();if(opened)retire();},
    prepare(action,expectedRevision,value,tick){
      active();tickValue(tick);const requests=[];
      if(action==='open'){
        if(opened)fail('LEGACY_CRAFT_PHASE');
        opened=true;phase='skills';revision++;
        return Object.freeze({requests:Object.freeze(requests)});
      }
      if(!opened||expectedRevision!==revision)fail('LEGACY_CRAFT_STALE');
      if(!validSelection()){retire();fail('LEGACY_CRAFT_STALE');}
      if(action==='close'){
        if(origin!==null&&poseOwned)requests.push(pose(0));resetContext(requests);retire();
        return Object.freeze({requests:Object.freeze(requests)});
      }
      if(action==='skill'){
        if(!['skills','levels','recipes'].includes(phase))fail('LEGACY_CRAFT_PHASE');
        const skill=ports.skill(index(value,15));if(!supported(skill))fail('LEGACY_CRAFT_SKILL');
        skillSlot=value;mode=legacyGameWorkMode(skill);levelIndex=recipeId=null;phase='levels';directRequestSent=false;
      }else if(action==='context'){
        const current=context();
        if(phase!=='levels'||!selectedSkill()?.fields[0x2c]||!ports.setWorkContext||!legacyGameWorkContextAvailable(current.tier,current.remainingMilliseconds))fail('LEGACY_CRAFT_CONTEXT');
        requests.push(contextCommand(current.mode===0?61:62));ports.setWorkContext(current.mode===0?1:0);directRequestSent=false;
      }else if(action==='levels-back'){
        if(phase!=='recipes')fail('LEGACY_CRAFT_PHASE');phase='levels';levelIndex=recipeId=null;
      }else if(action==='level'){
        if(!['levels','recipes'].includes(phase))fail('LEGACY_CRAFT_PHASE');
        const level=selectedSkill()?.levels[index(value,10)];
        if(!level?.nameBytes.length||!level.fields[0x8c])fail('LEGACY_CRAFT_LEVEL');
        if(mode==='direct-skill'){
          const required=legacyGamePlayerSkillCost(selectedSkill().fields[0x34],level.fields[0x7c]);
          if(!context().rideChild&&(ports.mp()===null||ports.mp()<required))fail('LEGACY_CRAFT_REQUIREMENTS');
          levelIndex=value;requests.push(command('send-004f7c70',[wireSkill(),levelIndex,-1,new Uint8Array()]));directRequestSent=true;
        }else{
        levelIndex=value;phase=mode==='craft'?'recipes':'materials';
        if(mode==='craft'&&!recipesCurrent())requests.push(command('send-004f6d00',[wireSkill()]));
        if(targeted()||gathering()){
          if(!affordable()||gathering()&&!gatherReady()){levelIndex=null;phase='levels';fail('LEGACY_CRAFT_REQUIREMENTS');}
          origin=[...ports.location().display];
          if(targeted())queryPeople(requests);
          else{requests.push(pose(legacyGameGatherPose(mode)));poseOwned=true;gatherInitial=true;startGather(tick);}
        }else if(mode!=='craft'){requests.push(pose(poseFor(selectedSkill().fields[0x30])));poseOwned=true;origin=[...ports.location().display];clearPositions();clearTarget();clearResult();}
        }
      }else if(action==='recipe'){
        if(phase!=='recipes')fail('LEGACY_CRAFT_PHASE');
        if(!recipesCurrent())fail('LEGACY_CRAFT_CONTEXT_WAIT');
        const recipe=recipes().find(r=>r.index===value);
        if(!recipe||!recipe.fields[12])fail('LEGACY_CRAFT_RECIPE');
        requests.push(pose(poseFor(selectedSkill().fields[0x30])));
        poseOwned=true;
        recipeId=recipe.fields[0];origin=[...ports.location().display];phase='materials';clearPositions();clearResult();
      }else if(action==='person'){
        if(!targeted()||phase!=='people')fail('LEGACY_CRAFT_PHASE');
        const row=people[index(value,people.length)];
        if(mode!=='disguise'&&row.type!==3){personIndex=row.index;phase='loading-subjects';requests.push(command('send-004f7a00',[row.index]));}
        else submitTarget(row,row.index,requests);
      }else if(action==='subject'){
        if(!targeted()||phase!=='subjects')fail('LEGACY_CRAFT_PHASE');
        const row=subjects[index(value,subjects.length)];submitTarget(row,row.wireIndex,requests);
      }else if(action==='people-back'){
        if(!targeted()||phase!=='subjects')fail('LEGACY_CRAFT_PHASE');queryPeople(requests);
      }else if(action==='pause'){
        if(!gathering()||!['working','awaiting','result'].includes(phase))fail('LEGACY_CRAFT_PHASE');
        gatherContinuing=false;phase='paused';deadline=durationMilliseconds=null;clearResult();
      }else if(action==='assign'){
        requireEditing();const position=index(value?.position,6),slot=index(value?.slot,28);
        if(!['craft','decorate'].includes(mode))fail('LEGACY_CRAFT_PHASE');
        const item=ports.items().find(r=>r.slot===slot);
        if(slot<8||!item?.present||!item.hasDescription||item.revision!==value.revision)fail('LEGACY_CRAFT_ITEM');
        if(positions.some(p=>p?.slot===slot))fail('LEGACY_CRAFT_ITEM_USED');
        if(mode==='decorate'){
          const group=groupFor(item);if(group<0)fail('LEGACY_CRAFT_MATERIAL');
          // Decoration frees the replaced position before checking its class quota.
          positions[position]=null;
          if(positions.some(p=>p?.group===group)){revision++;fail('LEGACY_CRAFT_MATERIAL');}
          positions[position]=Object.freeze({slot,revision:item.revision,group,quantity:1});revision++;
          return Object.freeze({requests:Object.freeze(requests)});
        }
        const recipe=selectedRecipe(),filled=fulfilled(recipe),amount=item.quantity===0?1:item.quantity;
        const group=recipe.materials.findIndex((m,i)=>!filled[i]&&m.fields[0]===item.exchangeCode&&m.fields[4]<=amount);
        const extra=group<0&&![215,216].includes(selectedSkill().fields[0x30])&&[25,38,39].includes(item.category)&&!positions.some(p=>p?.group===-1);
        // The source matches against occupied groups before it removes the old target.
        if(group<0&&!extra)fail('LEGACY_CRAFT_MATERIAL');
        positions[position]=Object.freeze({slot,revision:item.revision,group,quantity:group<0?1:recipe.materials[group].fields[4]});
      }else if(action==='target'){
        requireEditing();if(['craft','decorate'].includes(mode))fail('LEGACY_CRAFT_PHASE');
        const slot=index(value?.slot,28),item=ports.items().find(r=>r.slot===slot);
        if(!item||item.revision!==value.revision||!legacyGameWorkItemEligible(mode,item,(selectedSkill().fields[0x1c]+contextMode())|0))fail('LEGACY_CRAFT_ITEM');
        clearTarget();target={slot,revision:item.revision,level:item.level,graphicIndex:item.graphicIndex,nameBytes:item.nameBytes.slice()};
      }else if(action==='mark'){
        requireEditing();if(mode!=='engrave')fail('LEGACY_CRAFT_PHASE');
        const raw=assetBytes(value,32760);
        if(raw.length>16){raw.fill(0);fail('LEGACY_CRAFT_MARK_LENGTH');}
        markBytes.fill(0);markBytes=raw;
      }else if(action==='remove-target'){
        requireEditing();clearTarget();
      }else if(action==='remove'){
        requireEditing();positions[index(value,6)]=null;
      }else if(action==='swap'){
        requireEditing();const a=index(value?.from,6),b=index(value?.to,6);
        [positions[a],positions[b]]=[positions[b],positions[a]];
      }else if(action==='begin'){
        requireEditing();synchronizeItems();const recipe=selectedRecipe(),skill=selectedSkill();
        if(!canBegin(recipe,skill))fail('LEGACY_CRAFT_REQUIREMENTS');
        startedCost=cost(recipe,skill);
        if(mode==='engrave'){
          const text=legacyGameWorkMark(markBytes,!!(itemTarget().qualification&0x400));
          requests.push(command('send-004f7c70',[wireSkill(),0,target.slot,text]));phase='awaiting';markBytes.fill(0);markBytes=new Uint8Array();
        }else{
          const base=mode==='decorate'?8000:Math.imul((random.next()%6+5+Math.imul(mode==='craft'?recipe.fields[8]:itemTarget().level,3))|0,1000);
          durationMilliseconds=duration(base,mode==='decorate');
          deadline=(tick+durationMilliseconds)>>>0;lastTick=tick;phase='working';
          requests.push(command('send-004f8940',[Math.trunc(durationMilliseconds/1000)|0]));
        }
      }else if(action==='retry'){
        if(gathering()){
          if(phase!=='paused')fail('LEGACY_CRAFT_PHASE');if(!gatherReady())fail('LEGACY_CRAFT_REQUIREMENTS');startGather(tick);
        }else if(targeted()){
          if(phase!=='result')fail('LEGACY_CRAFT_PHASE');if(!affordable())fail('LEGACY_CRAFT_REQUIREMENTS');queryPeople(requests);
        }else{
          if(phase!=='result')fail('LEGACY_CRAFT_PHASE');
          phase='materials';deadline=durationMilliseconds=lastTick=startedCost=null;clearPositions();clearTarget();clearResult();
        }
      }else fail('LEGACY_CRAFT_ACTION');
      revision++;
      return Object.freeze({requests:Object.freeze(requests)});
    },
    tick(tick){
      active();tickValue(tick);const requests=[];
      if(!opened)return Object.freeze({requests:Object.freeze(requests)});
      if(!validSelection()){retire();return Object.freeze({requests:Object.freeze(requests)});}
      if(contextMode()!==0&&context().remainingMilliseconds!==null&&context().remainingMilliseconds<=0){
        resetContext(requests);if(mode==='craft'&&levelIndex!==null&&!recipesCurrent())requests.push(command('send-004f6d00',[wireSkill()]));revision++;
      }
      lastTick=tick;
      if(origin!==null){
        const {display,position}=ports.location();
        if(position[0]===display[0]*64&&position[1]===display[1]*64&&
            (Math.abs(display[0]-origin[0])>=1||Math.abs(display[1]-origin[1])>=1)){
          if(poseOwned)requests.push(pose(0));resetContext(requests);retire();return Object.freeze({requests:Object.freeze(requests)});
        }
      }
      if(gathering()){
        if(phase==='working'&&tick>deadline){
          requests.push(command('send-004f7c70',[wireSkill(),levelIndex,-1,new Uint8Array()]));gatherInitial=false;phase='awaiting';deadline=null;revision++;
        }else if(phase==='result'&&tick>deadline){
          if(gatherContinuing&&gatherReady())startGather(tick);
          else{gatherContinuing=false;phase='paused';deadline=durationMilliseconds=null;clearResult();}
          revision++;
        }
      }else if(phase==='working'){
        lastTick=tick;
        if(tick>=deadline){
          if(mode==='craft'){
            const ordered=[...positions.filter(p=>p&&p.group>=0),...positions.filter(p=>p?.group===-1)];
            requests.push(command('send-004f7c70',[wireSkill(),levelIndex,-1,ascii([recipeId,...ordered.map(p=>p.slot)].join('|'))]));
          }else if(mode==='decorate'){
            const base=positions.find(p=>p?.group===0),extra=positions.find(p=>p?.group===1);
            requests.push(command('send-004f7c70',[wireSkill(),0,-1,ascii(base.slot+'|'+extra.slot)]));
          }else requests.push(command('send-004f7c70',[wireSkill(),0,target.slot,new Uint8Array()]));
          phase='awaiting';revision++;
        }
      }
      return Object.freeze({requests:Object.freeze(requests)});
    },
    receivePeople(value){
      active();if(!opened||!targeted()||phase!=='loading-people')return Object.freeze({kind:'craft-targets',accepted:false,requests:Object.freeze([])});
      const next=decodeLegacyGameWorkPeople(mode,value,ports.targetContext());clearChoices();people=next;phase='people';revision++;
      const code=['first-aid','treatment'].includes(mode)?13:0,requests=code===13&&poseCode===13?[]:[pose(code)];
      poseOwned=true;return Object.freeze({kind:'craft-targets',accepted:true,requests:Object.freeze(requests)});
    },
    receiveSubjects(value){
      active();if(!opened||!targeted()||phase!=='loading-subjects'||personIndex===null)return Object.freeze({kind:'craft-targets',accepted:false,requests:Object.freeze([])});
      const next=decodeLegacyGameWorkSubjects(mode,people[personIndex],value,ports.targetContext());
      for(const row of subjects)row.nameBytes.fill(0);subjects=next;phase='subjects';revision++;
      return Object.freeze({kind:'craft-targets',accepted:true,requests:Object.freeze([])});
    },
    receive(status,kind,value,receivedTick=null){
      active();integer(kind);
      if(kind===3||kind===4){
        const accepts=opened&&origin!==null&&(kind===3?targeted()&&target!==null:gathering());
        if(!accepts)return Object.freeze({kind:'craft-result',accepted:false});
        const decoded=kind===3?decodeLegacyGameTargetWorkResult(mode,status,value):decodeLegacyGameGatherResult(status,value);
        clearResult();result=target?Object.freeze({...decoded,subjectNameBytes:target.nameBytes.slice()}):decoded;phase='result';
        if(kind===4){const tick=receivedTick??lastTick;tickValue(tick);lastTick=tick;deadline=(tick+2000)>>>0;durationMilliseconds=2000;}
        else deadline=null;
        revision++;return Object.freeze({kind:'craft-result',accepted:true,revision,success:result.success});
      }
      if(![1,2].includes(kind))return Object.freeze({kind:'craft-result',accepted:false});
      const decoded=kind===1?decodeLegacyGameCraftResult(status,value):decodeLegacyGameItemWorkResult(status,value);
      const accepts=opened&&origin!==null&&(kind===1?['craft','decorate'].includes(mode):!targeted()&&!gathering()&&!['craft','decorate'].includes(mode)&&target!==null);
      if(!accepts){wipeResult(decoded);return Object.freeze({kind:'craft-result',accepted:false});}
      const subject=mode==='decorate'?ports.items().find(i=>i.slot===positions.find(p=>p?.group===0)?.slot)?.nameBytes:target?.nameBytes;
      clearResult();result=subject?Object.freeze({...decoded,subjectNameBytes:subject.slice()}):decoded;
      clearPositions();if(kind===2&&decoded.success&&mode!=='engrave')clearTarget();phase='result';deadline=null;revision++;
      return Object.freeze({kind:'craft-result',accepted:true,revision,success:result.success});
    },
    copy(){
      active();const skill=selectedSkill(),recipe=selectedRecipe(),items=ports.items();
      return Object.freeze({...inspect(),profile:LEGACY_GAME_CRAFT_PROFILE.id,
        contextMode:contextMode(),contextTier:context().tier,contextRemainingMilliseconds:context().remainingMilliseconds,
        canToggleContext:phase==='levels'&&!!selectedSkill()?.fields[0x2c]&&!!ports.setWorkContext&&legacyGameWorkContextAvailable(context().tier,context().remainingMilliseconds),
        recipesCurrent:recipesCurrent(),directRequestSent,
        ...(targeted()?{people:Object.freeze(people.map(r=>Object.freeze({...r,nameBytes:r.nameBytes.slice()}))),subjects:Object.freeze(subjects.map(r=>Object.freeze({...r,nameBytes:r.nameBytes.slice()}))),canRetry:affordable()}:{}),
        ...(gathering()?{gatherContinuing,canRetry:phase==='paused'&&gatherReady(),canPause:['working','awaiting','result'].includes(phase)}:{}),
        skills:Object.freeze(ports.skills().filter(supported)),skill,recipe,mode,
        levels:Object.freeze((skill?.levels??[]).slice(0,10).filter(l=>l.nameBytes.length).map(l=>Object.freeze({...l,enabled:l.fields[0x8c]!==0}))),
        recipes:Object.freeze(recipes()),items:Object.freeze(items.map(item=>mode==='craft'?item:Object.freeze({...item,workEligible:mode==='decorate'?groupFor(item)>=0:legacyGameWorkItemEligible(mode,item,((skill?.fields[0x1c]??0)+contextMode())|0)}))),
        target:target?Object.freeze({...target,nameBytes:target.nameBytes.slice(),...(!targeted()?{canClearMark:!!(itemTarget()?.qualification&0x400)}:{})}):null,markBytes:markBytes.slice(),
        positions:Object.freeze(positions.map(p=>p?Object.freeze({...p}):null)),
        fulfilled:Object.freeze(mode==='decorate'?[positions.some(p=>p?.group===0),positions.some(p=>p?.group===1)]:recipe?fulfilled(recipe):[]),mp:ports.mp(),
        cost:startedCost??cost(recipe,skill),
        canBegin:phase==='materials'&&canBegin(recipe,skill),
        remainingMilliseconds:phase==='working'?Math.max(0,deadline-lastTick):null,result:copyResult(result)});
    },
    close(){if(closed)return;retire();random.seed(0);closed=true;},
  });
}

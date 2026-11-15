/** Semantic manufacture controls over the same portable client, without DOM or wx dependencies. */
import {legacyGameWorkMark} from '../shared/legacy-game-work-actions.mjs';
const messages={
  LEGACY_CRAFT_STALE:'资料已更新，请重新选择。',LEGACY_CRAFT_ITEM:'这件物品当前不能作为材料。',
  LEGACY_CRAFT_ITEM_USED:'这件物品已经放入材料位。',LEGACY_CRAFT_MATERIAL:'材料不匹配、数量不足或已放入。',
  LEGACY_CRAFT_REQUIREMENTS:'请补齐材料并确认魔力充足。',LEGACY_CRAFT_CONTEXT:'当前不能制造。',
  LEGACY_CLIENT_NOT_PLAYING:'请先恢复游戏。',
  LEGACY_CRAFT_MARK_LENGTH:'刻印文字编码后最多 16 字节。',LEGACY_CRAFT_MARK_TEXT:'刻印文字不能含换行、竖线或反斜杠。',
  LEGACY_CRAFT_MARK_BLANK:'请填写有效的刻印文字。',
  LEGACY_CRAFT_CONTEXT_WAIT:'正在等待当前技能的配方资料。',
};
const labels={craft:'制造',decorate:'装饰','repair-weapon':'武器修理','repair-armor':'防具修理',appraise:'鉴定',engrave:'刻印',
  disguise:'变装',transform:'变身','first-aid':'急救',treatment:'治疗',mine:'挖掘',hunt:'打猎',wood:'伐木','direct-skill':'施放'};
export function createLegacyGameCraftControls({client,decode,encode,notify}){
  let closed=false,position=0,busy=false,notice='';
  const text=b=>{if(!b)return '';try{return decode(b);}catch{return '无法读取名称';}finally{b.fill(0);}};
  return Object.freeze({
    async act(action,value){
      if(closed||busy)return false;
      if(action==='position'){
        if(!Number.isInteger(value)||value<0||value>=6)return false;
        position=value;notice='';notify();return true;
      }
      const state=client.copyCraft();
      busy=true;notice='';notify();
      let encoded;
      try{
        if(action==='open')position=0;
        if(action==='mark'){encoded=encode(value);const checked=legacyGameWorkMark(encoded,!!state.target?.canClearMark);checked.fill(0);value=encoded;}
        await client.actOnCraft(action,state.revision,action==='assign'?{...value,position}:value);
        return true;
      }catch(error){notice=messages[error.code]??'制造操作未完成，请检查当前状态。';return false;}
      finally{encoded?.fill(0);busy=false;if(!closed)notify();}
    },
    snapshot(enabled=true){
      if(closed)return null;
      const s=client.copyCraft();if(!s.active)return null;
      const editable=enabled&&!busy&&s.phase==='materials';
      const targetWork=s.people!==undefined,gather=s.gatherContinuing!==undefined;
      const itemWork=!!s.mode&&!targetWork&&!gather&&!['craft','decorate','direct-skill'].includes(s.mode),label=labels[s.mode]??'制造';
      const items=s.items.map(item=>({slot:item.slot,revision:item.revision,name:text(item.nameBytes)||'物品',
        quantity:item.quantity===0?1:item.quantity,selected:s.target?.slot===item.slot,
        disabled:!editable||(s.mode==='craft'?!item.hasDescription:!item.workEligible)||s.positions.some(p=>p?.slot===item.slot)}));
      const positions=s.positions.map((p,index)=>({index,selected:position===index,filled:!!p,
        name:p?items.find(i=>i.slot===p.slot)?.name??'物品':'空位',quantity:p?.quantity??0,
        optional:p?.group===-1,canSwap:editable&&index!==position,disabled:!editable}));
      const r=s.result;
      const subjectName=text(r?.subjectNameBytes);
      const outcome={unneeded:'无需'+label,'restored-hp':'生命值恢复了 '+r?.recoveryValue,'restored-health':'伤势全部恢复了',
        'improved-health':'伤势稍微恢复了',worsened:'伤势恶化了','lost-soul':'伤势恶化而掉魂了'};
      const first=r?.kind==='target'?outcome[r.outcome]??label+(r.success?'成功了':'失败了'):
        r?.kind==='gather'?(r.success?'发现了 '+text(r.foundNameBytes):'什么都没发现'):(itemWork?label:'制造')+(r?.success?'成功了':'失败了');
      const result=r?{success:r.success,lines:[first,...(subjectName?[subjectName]:[]),
        ...(r.skillExperience>0?['技能经验值 +'+r.skillExperience]:[]),...(r.skillLevelUp?['等级提升！']:[]),
        ...[['耐力',r.enduranceDelta],['灵巧',r.dexterityDelta],['智力',r.intelligenceDelta]]
          .filter(([,n])=>n!==0).map(([label,n])=>label+' '+(n>0?'+':'')+n),
        ...r.lostItemNames.map(b=>'失去 '+text(b)),...(r.injuryVisible?['受伤了']:[])]}:null;
      return {revision:s.revision,phase:s.phase,position,busy,disabled:!enabled||busy,notice,
        contextMode:s.contextMode,canToggleContext:enabled&&!busy&&s.canToggleContext,
        contextSeconds:s.contextRemainingMilliseconds===null?null:Math.max(0,Math.ceil(s.contextRemainingMilliseconds/1000)),
        recipesCurrent:s.recipesCurrent,directRequestSent:s.directRequestSent,directSkill:s.mode==='direct-skill',
        mode:s.mode,itemWork,targetWork,gather,gatherContinuing:s.gatherContinuing??false,canPause:enabled&&!busy&&!!s.canPause,
        canRetry:enabled&&!busy&&(s.canRetry??true),label,mark:text(s.markBytes),target:s.target?{slot:s.target.slot,name:text(s.target.nameBytes),canClearMark:s.target.canClearMark}:null,
        people:(s.people??[]).map(row=>({index:row.index,name:text(row.nameBytes)||'角色'})),
        subjects:(s.subjects??[]).map(row=>({index:row.index,name:text(row.nameBytes)||(row.type>=4?'宠物':'角色'),
          detail:'等级 '+(row.rawFields[0]??'待同步')+' · 生命 '+(row.rawFields[2]??'?')+'/'+(row.rawFields[3]??'?')+' · 魔力 '+(row.rawFields[4]??'?')+'/'+(row.rawFields[5]??'?')})),
        skillName:text(s.skill?.nameBytes),recipeName:text(s.recipe?.nameBytes),
        description:text(s.recipe?.descriptionBytes),mp:s.mp,cost:s.cost,canBegin:enabled&&!busy&&s.canBegin,
        skills:s.skills.map(row=>({slot:row.slot,name:text(row.nameBytes)})),
        levels:s.levels.map(row=>({index:row.index,name:text(row.nameBytes),disabled:!enabled||busy||!row.enabled})),
        recipes:s.recipes.map(row=>({index:row.index,name:text(row.nameBytes),disabled:!enabled||busy||!row.fields[12]||!s.recipesCurrent})),
        materials:s.recipe?.materials.filter(row=>row.fields[0]>=0).map(row=>({index:row.index,
          name:text(row.nameBytes)||'材料',quantity:row.fields[4],fulfilled:s.fulfilled[row.index]}))??[],
        items,positions,result,remainingSeconds:s.remainingMilliseconds===null?null:Math.ceil(s.remainingMilliseconds/1000),
      };
    },
    close(){closed=true;position=0;notice='';},
  });
}

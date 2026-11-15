/** Known ordinary item-work/decoration rules in the fixed 37c4 source. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {splitLegacyGameStateFields as split,readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
import {legacyGameTargetWorkMode} from './legacy-game-work-targets.mjs';

export const LEGACY_GAME_WORK_ACTION_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-work-actions-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  contextMode:0,sourceInitialLevelByte:0,markBytes:16,decorationCost:100,decorationMilliseconds:8000,
  completeOrdinarySkills:false,
});
export class LegacyGameWorkActionError extends Error{
  constructor(code){super('The selected item work requires current source-compatible data.');this.name='LegacyGameWorkActionError';this.code=code;}
}
const fail=code=>{throw new LegacyGameWorkActionError(code);};
export function legacyGameWorkMode(skill){
  if(!skill?.present)return null;
  if(skill.fields[0x2c]===5)return 'direct-skill';
  if(skill.fields[0x2c]===1)return skill.fields[0x30]===255?'decorate':'craft';
  if(skill.fields[0x2c]!==2)return legacyGameTargetWorkMode(skill);
  return ({217:'repair-weapon',218:'repair-armor',219:'appraise',220:'engrave'})[skill.fields[0x30]]??null;
}
export function legacyGameWorkItemEligible(mode,item,rank){
  if(!item?.present||item.slot<8||item.slot>=28)return false;
  if(mode==='repair-weapon'||mode==='repair-armor')return item.hasDescription&&item.level<=rank&&
    (mode==='repair-weapon'?item.category>=0&&item.category<=6:item.category>=7&&item.category<=14);
  if(mode==='appraise')return !item.hasDescription&&item.level<=rank;
  if(mode==='engrave'){
    const q=item.qualification;
    return item.hasDescription&&item.quantity<=0&&item.category!==47&&
      (!(q&0x100)||!!(q&0x400))&&(!(q&0x200)||!!(q&0x400));
  }
  return false;
}
export function legacyGameDecorationItemGroup(item,ownsProduct=false){
  if(!item?.present||item.slot<8||item.slot>=28||!item.hasDescription)return -1;
  if([25,38,39].includes(item.category))return 1;
  return (item.qualification&0x800)&&ownsProduct?0:-1;
}
export function legacyGameWorkMark(value,allowEmpty=false){
  const raw=assetBytes(value,32760);
  try{
    if(raw.length>16)fail('LEGACY_CRAFT_MARK_LENGTH');
    if(raw.includes(0)||raw.some(b=>b<32))fail('LEGACY_CRAFT_MARK_TEXT');
    for(let i=0;i<raw.length;i++){
      if(raw[i]>=0x81){i++;continue;}
      if(raw[i]===124||raw[i]===92)fail('LEGACY_CRAFT_MARK_TEXT');
    }
    if(raw.length&&!raw.some(b=>![32,0x81,0x40].includes(b)))fail('LEGACY_CRAFT_MARK_BLANK');
    if(!raw.length&&!allowEmpty)fail('LEGACY_CRAFT_MARK_BLANK');
    return raw.slice();
  }finally{raw.fill(0);}
}
export function decodeLegacyGameItemWorkResult(status,value){
  if(!Number.isInteger(status)||status< -2147483648||status>2147483647)fail('LEGACY_CRAFT_INTEGER');
  const raw=assetBytes(value,32760);
  try{
    const rows=split(raw),values=Array.from({length:7},(_,i)=>{const token=rows[i]?.subarray(0,127);return token?.length?decimal(token):-1;});
    return Object.freeze({success:status!==0,skillExperience:values[0],skillLevelUp:values[2]!==0,
      enduranceDelta:values[3],dexterityDelta:values[4],intelligenceDelta:values[5],
      injured:values[6]!==0,injuryVisible:values[6]!==0,graphicIndex:0,
      rawFields:Object.freeze(values),lostItemNames:Object.freeze([])});
  }finally{raw.fill(0);}
}

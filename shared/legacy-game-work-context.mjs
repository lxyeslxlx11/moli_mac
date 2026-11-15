/** File-backed skill context rules for the fixed37c4 profile. */
export const LEGACY_GAME_WORK_CONTEXT_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-work-context-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  factors:Object.freeze([100,95,90,85,80,75,70]),contextSlotOffset:100,
  enableAction:61,disableAction:62,completeSkills:false,
});
export class LegacyGameWorkContextError extends Error{
  constructor(code){super('Skill context requires current supported source data.');this.name='LegacyGameWorkContextError';this.code=code;}
}
const fail=code=>{throw new LegacyGameWorkContextError(code);};
const mode=n=>{if(n!==0&&n!==1)fail('LEGACY_WORK_CONTEXT_MODE');return n;};
export function legacyGameWorkContextSlot(slot,contextMode=0){
  if(!Number.isInteger(slot)||slot<0||slot>=15)fail('LEGACY_WORK_CONTEXT_SLOT');
  return slot+100*mode(contextMode);
}
export function legacyGameWorkContextAvailable(tier,remainingMilliseconds){
  return Number.isInteger(tier)&&tier>0&&tier<7&&Number.isInteger(remainingMilliseconds)&&remainingMilliseconds>0;
}
export function legacyGameWorkDuration(milliseconds,tier,contextMode=0,unsigned=false){
  if(!Number.isInteger(milliseconds)||milliseconds< -2147483648||milliseconds>2147483647)fail('LEGACY_WORK_CONTEXT_DURATION');
  if(typeof unsigned!=='boolean')fail('LEGACY_WORK_CONTEXT_DURATION');
  if(!mode(contextMode))return milliseconds;
  if(!Number.isInteger(tier)||tier<0||tier>=7)fail('LEGACY_WORK_CONTEXT_TIER');
  const product=Math.imul(LEGACY_GAME_WORK_CONTEXT_PROFILE.factors[tier],milliseconds);
  return unsigned?Math.trunc((product>>>0)/100)>>>0:Math.trunc(product/100)|0;
}

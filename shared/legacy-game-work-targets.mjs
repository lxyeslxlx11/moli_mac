/** Ordinary target-work and continuous gathering rules from fixed37c4 bytes. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {splitLegacyGameStateFields as split,unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
export const LEGACY_GAME_WORK_TARGET_PROFILE=Object.freeze({id:'legacy-se6000-37c4-work-targets-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  people:10,subjects:6,nameBytes:16,initialGatherMilliseconds:6500,gatherMilliseconds:4500,resultMilliseconds:2000,context:0});
export class LegacyGameWorkTargetError extends Error{
  constructor(code){super('Ordinary work needs current source-compatible targets.');this.name='LegacyGameWorkTargetError';this.code=code;}
}
const fail=code=>{throw new LegacyGameWorkTargetError(code);};
export function legacyGameTargetWorkMode(skill){
  if(!skill?.present)return null;
  const id=skill.fields[0x30],kind=skill.fields[0x2c];
  return kind===3?({221:'disguise',222:'transform',223:'first-aid',224:'treatment'})[id]??null:
    kind===4?({225:'mine',251:'mine',226:'hunt',253:'hunt',227:'wood',250:'wood'})[id]??null:null;
}
export const legacyGameGatherPose=mode=>({mine:5,hunt:7,wood:6})[mode]??null;
export function legacyGameGatherDeadline(tick,initial=false){
  if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_WORK_TICK');
  return (tick+(initial?6500:4500))>>>0;
}
const number=(fields,at)=>{const b=fields[at]?.subarray(0,127);return b?.length?decimal(b):-1;};
function ownedName(value,encoded=false,cap=16){
  const raw=encoded?unescape(value):assetBytes(value??new Uint8Array(),32760);
  try{const zero=raw.indexOf(0),b=zero<0?raw:raw.subarray(0,zero);if(b.length>cap)fail('LEGACY_WORK_TARGET_NAME');return b.slice();}
  finally{raw.fill(0);}
}
const copyLocal=(row,index,type,wireIndex)=>Object.freeze({index,type,wireIndex,nameBytes:ownedName(row?.nameBytes),
  rawFields:Object.freeze([row?.level??null,row?.health??null,row?.HP??null,row?.maxHP??null,row?.MP??null,row?.maxMP??null])});
export function decodeLegacyGameWorkPeople(mode,value,context){
  const raw=assetBytes(value,32760),out=[];
  try{
    if(mode!=='disguise')out.push(Object.freeze({index:0,type:0,nameBytes:ownedName(context.self?.nameBytes)}));
    for(const row of (context.party??[]).slice(0,5))out.push(Object.freeze({index:out.length,type:1,nameBytes:ownedName(row.nameBytes)}));
    const fields=split(raw);
    for(let at=0;at<fields.length-1&&out.length<10;at+=2){
      if(fields[at].length>=255)break;
      const flag=number(fields,at+1);if(mode==='disguise'&&flag===1)break;
      out.push(Object.freeze({index:out.length,type:flag===0?2:3,nameBytes:ownedName(fields[at],true)}));
    }
    return Object.freeze(out);
  }catch(error){for(const row of out)row.nameBytes.fill(0);throw error;}finally{raw.fill(0);}
}
export function decodeLegacyGameWorkSubjects(mode,person,value,context){
  const raw=assetBytes(value,32760),out=[];
  try{
    if(person.type===0){
      if(mode!=='transform')out.push(copyLocal(context.self,0,0,0));
      let ordinal=1;
      for(const row of (context.pets??[]).slice(0,5)){
        if(!row.present||row.mode===3)continue;
        out.push(copyLocal(row,out.length,4,ordinal++));
      }
    }else{
      const fields=split(raw);
      for(let at=0,ordinal=0;at<fields.length-1&&ordinal<6;at+=7,ordinal++){
        if(fields[at].length>=127)break;
        if(mode==='transform'&&ordinal===0)continue;
        out.push(Object.freeze({index:out.length,wireIndex:ordinal,type:person.type===1?(ordinal===0?1:5):person.type===2?(ordinal===0?2:6):3,
          nameBytes:ownedName(fields[at],true),rawFields:Object.freeze(Array.from({length:6},(_,i)=>number(fields,at+i+1)))}));
      }
    }
    return Object.freeze(out);
  }catch(error){for(const row of out)row.nameBytes.fill(0);throw error;}finally{raw.fill(0);}
}
const integer=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_WORK_INTEGER');};
function gains(status,n){return {success:status!==0,skillExperience:n[0],skillLevelUp:n[2]!==0,enduranceDelta:n[3],
  dexterityDelta:n[4],intelligenceDelta:n[5],injured:false,injuryVisible:false,graphicIndex:0,
  rawFields:Object.freeze(n),lostItemNames:Object.freeze([])};}
export function decodeLegacyGameTargetWorkResult(mode,status,value){
  integer(status);const raw=assetBytes(value,32760);
  try{
    const fields=split(raw),n=Array.from({length:7},(_,i)=>number(fields,i));let outcome=status?'success':'failure';
    if(mode==='first-aid')outcome=status?'restored-hp':n[6]===0?'unneeded':'failure';
    if(mode==='treatment')outcome=status?(n[6]===4?'restored-health':'improved-health'):
      n[6]===0?'unneeded':n[6]===2?'worsened':n[6]===3?'lost-soul':'failure';
    return Object.freeze({...gains(status,n),kind:'target',outcome,recoveryValue:n[6]});
  }finally{raw.fill(0);}
}
export function decodeLegacyGameGatherResult(status,value){
  integer(status);const raw=assetBytes(value,32760);
  try{
    if(!status)return Object.freeze({...gains(0,[0,0,0,0,0,0,-1]),kind:'gather',graphicIndex:-1,foundNameBytes:new Uint8Array()});
    const fields=split(raw),n=Array.from({length:7},(_,i)=>number(fields,i));
    let name=unescape(fields[7]?.subarray(0,255)??new Uint8Array());
    const zero=name.indexOf(0);if(zero>=0){const next=name.slice(0,zero);name.fill(0);name=next;}
    if(name.length>28){name.fill(0);name=Uint8Array.of(63,63,63);}
    return Object.freeze({...gains(status,n),kind:'gather',graphicIndex:n[6],foundNameBytes:name});
  }finally{raw.fill(0);}
}

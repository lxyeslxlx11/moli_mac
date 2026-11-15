/** Fixed 37c4 CHT/BST operands and session-owned chat and time state. */
import {battleFail as fail,createBattleFieldReader} from './legacy-game-battle-bytes.mjs';
import {BATTLE_MOTION_TOKENS} from './legacy-game-battle-motion-data.mjs';

const chatCapacity=512;
const isSideEffect=index=>index===14||index===20;
const slot=value=>value===50?20:value===51?21:value;
const tickValue=value=>{
  if(!Number.isInteger(value)||value<0||value>0xffffffff)fail('LEGACY_BATTLE_INTEGER');
  return value;
};

export function battleSideEffect(command){
  const [principal,first,style,duration,text]=command.fields;
  return command.index===14?{kind:'chat',slot:slot(principal),channel:first,style,duration,text}:
    {kind:'time',slot:slot(principal),seconds:first};
}

// 423660 advances its own argument cursor. 434770 continues scanning from
// the argument start even when the temporary command consumed some fields.
export function scanBattleExitEffects(raw,offset,known,remaining=Infinity){
  const scanner=createBattleFieldReader(raw,offset),records=[];
  try{
    for(let token;remaining>0&&(token=scanner.token());){
      const index=BATTLE_MOTION_TOKENS.indexOf(token.token);
      if(index<0)continue;
      remaining--;
      if(!isSideEffect(index))continue;
      const global=remaining===Infinity;
      const reader=global?createBattleFieldReader(raw,token.argumentOffset):scanner;
      const prepared=known.get(token.offset);
      if(prepared){
        records.push(battleSideEffect(prepared));
        if(!global)scanner.seek(prepared.nextOffset);
        continue;
      }
      const number=()=>{
        const start=reader.offset;
        const n=reader.number();
        const end=reader.offset-Number(raw[reader.offset-1]===124);
        if(start>=end)fail('LEGACY_BATTLE_EXIT_SIDE_EFFECT');
        for(let i=start;i<end;i++){
          const byte=raw[i];
          if(!(byte>=48&&byte<=57||byte>=65&&byte<=70))fail('LEGACY_BATTLE_EXIT_SIDE_EFFECT');
        }
        return n;
      };
      const principal=slot(number()),first=number();
      if(index===20){
        if(principal<0||principal>=22)fail('LEGACY_BATTLE_EXIT_SIDE_EFFECT');
        records.push({kind:'time',slot:principal,seconds:first});
      }else{
        const style=number(),duration=number();
        records.push({kind:'chat',slot:principal,channel:first,style,duration,text:reader.name(255),temporary:true});
      }
    }
    return {offset:scanner.offset,records};
  }catch(error){wipeBattleExitEffects(records);throw error;}
}

export function wipeBattleExitEffects(records){
  for(const record of records)if(record.temporary)record.text.fill(0);
}

export function createBattleSideEffects(){
  const chat=new Array(chatCapacity);
  let chatVersion=0,remainingMilliseconds=0,mode=0,lastTick=null,received=false;
  return Object.freeze({
    append(record){
      if(record.channel<0||record.channel>=12||record.style<0||record.style>=14)return false;
      const index=chatVersion%chatCapacity;
      const end=record.text.indexOf(0);
      chat[index]?.text.fill(0);
      chat[index]={slot:record.slot,channel:record.channel,style:record.style,text:record.text.slice(0,end<0?undefined:end)};
      chatVersion++;
      return true;
    },
    copyChat(){
      const count=Math.min(chatVersion,chatCapacity);
      return Object.freeze(Array.from({length:count},(_,i)=>{
        const record=chat[(chatVersion-count+i)%chatCapacity];
        return Object.freeze({...record,text:record.text.slice()});
      }));
    },
    setTimer(seconds,enabled,tick){
      if(tick!==null)tickValue(tick);
      remainingMilliseconds=Math.imul(Math.max(0,seconds),1000);
      mode=enabled;
      lastTick=tick;
      received=true;
    },
    advanceTimer(tick){
      tickValue(tick);
      if(mode!==0&&lastTick!==null){
        remainingMilliseconds=(remainingMilliseconds+lastTick-tick)|0;
        if(remainingMilliseconds<0){remainingMilliseconds=0;mode=0;}
      }
      lastTick=tick;
    },
    subtract(seconds){remainingMilliseconds=Math.max(0,(remainingMilliseconds-Math.imul(seconds,1000))|0);},
    inspect(){return Object.freeze({chatVersion,timer:received?Object.freeze({remainingMilliseconds,mode}):null});},
    close(){for(const record of chat)record?.text.fill(0);chat.fill(undefined);chatVersion=0;},
  });
}

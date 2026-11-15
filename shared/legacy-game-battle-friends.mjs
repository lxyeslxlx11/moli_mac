/** The fixed 37c4 active-character table used by 423500. */
import {pairedBattleSlot} from './legacy-game-battle-change.mjs';
import {readLegacyGameStateDecimal,splitLegacyGameStateFields} from './legacy-game-state.mjs';

const capacity=320;
const nameBytes=16;
const stringLength=bytes=>{
  const end=bytes.indexOf(0);
  return end<0?bytes.length:end;
};

export const battleFriendMetadata=flags=>Array.from({length:4},(_,i)=>(flags>>>(24+i))&1);

export function classifyBattleFriend(slot,localSlot,name,metadata,match){
  if(slot===localSlot||slot===pairedBattleSlot(localSlot))return true;
  if((slot<10)===(localSlot<10))return false;
  return match&&name?match(name,metadata):null;
}

export function createBattleFriendRoster(){
  const rows=Array(capacity).fill(null);
  let revision=0,count=0;
  function clear(index){
    const previous=rows[index];
    if(!previous)return;
    previous.name.fill(0);
    rows[index]=null;
    count--;
  }
  return Object.freeze({
    applySummary(nextRevision,bytes){
      const words=splitLegacyGameStateFields(bytes),requests=[];
      for(let word=0;word<capacity/32&&words[word]?.length;word++){
        const mask=readLegacyGameStateDecimal(words[word].subarray(0,127));
        for(let bit=0;bit<32;bit++){
          const index=word*32+bit;
          if(!(mask&(1<<bit)))clear(index);
          else if(!rows[index]||revision<nextRevision){
            requests.push(Object.freeze({operationId:'send-004f6de0',arguments:Object.freeze([index+1])}));
          }
        }
      }
      revision=nextRevision;
      return Object.freeze({kind:'battle-friend-summary',revision,requests:Object.freeze(requests)});
    },
    applyDetail(values){
      const index=values[0]-1;
      if(index<0||index>=capacity)return Object.freeze({kind:'battle-friend-detail',accepted:false});
      const raw=values[16],length=stringLength(raw);
      const name=length>nameBytes?Uint8Array.of(63,63,63):raw.slice(0,length);
      const metadata=values.slice(10,14).map(Boolean);
      clear(index);
      rows[index]={name,metadata};
      count++;
      return Object.freeze({kind:'battle-friend-detail',accepted:true,index:index+1});
    },
    match(name,metadata){
      const length=stringLength(name);
      return rows.some(row=>row&&row.name.length===length
        &&row.name.every((byte,i)=>byte===name[i])
        &&row.metadata.every((flag,i)=>flag===Boolean(metadata[i])));
    },
    inspect(){return Object.freeze({revision,rows:count});},
    close(){for(let index=0;index<capacity;index++)clear(index);revision=0;},
  });
}

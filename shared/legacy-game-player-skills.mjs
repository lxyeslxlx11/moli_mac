/** Fixed37c4 J:@/J<=/JUA consumers. Unknown header fields retain their source offsets. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {createLegacyGameCraftRecipes} from './legacy-game-craft-recipes.mjs';
import {legacyGameWorkContextSlot} from './legacy-game-work-context.mjs';
import {splitLegacyGameStateFields as split,unescapeLegacyGameInnerField as unescape,readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
export const LEGACY_GAME_PLAYER_SKILL_PROFILE=Object.freeze({id:'legacy-se6000-37c4-player-skills-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',slots:15,levelSlots:11,battleLevelRows:10,recordBytes:0x49fc,levelBytes:0x94,craftContextMode:0,nativeWindow:false,completeSkills:false});
export class LegacyGamePlayerSkillError extends Error{constructor(code){super('Player skill data is outside the evidenced bounded source profile.');this.name='LegacyGamePlayerSkillError';this.code=code;}}
const fail=code=>{throw new LegacyGamePlayerSkillError(code);};
const integer=n=>{if(!Number.isInteger(n)||n< -2147483648||n>2147483647)fail('LEGACY_PLAYER_SKILL_INTEGER');return n|0;};
const blankLevel=()=>({present:false,nameBytes:new Uint8Array(),descriptionBytes:new Uint8Array(),fields:{0x7c:0,0x80:0,0x84:0,0x88:0,0x8c:0,0x90:0}});
const blank=()=>({present:false,nameBytes:new Uint8Array(),fields:{0x19:0,0x1c:0,0x20:0,0x24:0,0x28:0,0x2c:0,0x30:0,0x34:0,0x38:0},levels:Array.from({length:11},blankLevel)});
function wipeLevel(l){l.nameBytes.fill(0);l.descriptionBytes.fill(0);}
function wipe(r){r.nameBytes.fill(0);for(const l of r.levels)wipeLevel(l);}
const clone=r=>({...r,nameBytes:r.nameBytes.slice(),fields:{...r.fields},levels:r.levels.map(l=>({...l,nameBytes:l.nameBytes.slice(),descriptionBytes:l.descriptionBytes.slice(),fields:{...l.fields}}))});
const copy=(r,slot)=>Object.freeze({slot,present:r.present,nameBytes:r.nameBytes.slice(),fields:Object.freeze({...r.fields}),levels:Object.freeze(r.levels.map((l,index)=>Object.freeze({index,present:l.present,nameBytes:l.nameBytes.slice(),descriptionBytes:l.descriptionBytes.slice(),fields:Object.freeze({...l.fields})})))});
const token=(rows,i,n)=>rows[i]?.subarray(0,n)??new Uint8Array();
const number=(rows,i)=>{const b=token(rows,i,127);return b.length?decimal(b):-1;};
function text(b,maximum){const raw=unescape(b);try{return raw.length<=maximum?raw.slice():Uint8Array.of(63,63,63);}finally{raw.fill(0);}}
function sameRosterEntry(a,b) {
  if (!a.present && !b.present) return true;
  return a.present === b.present && a.nameBytes.length === b.nameBytes.length &&
    a.nameBytes.every((byte,index) => byte === b.nameBytes[index]) &&
    Object.keys(a.fields).every(key => a.fields[key] === b.fields[key]);
}
// Native51c1a2/51c2f6, using the observed4fdf00 comparator (including its equal-key permutation).
function order(records){const rows=records.map((r,slot)=>({slot,present:r.present,key:r.fields[0x38]}));
 const cmp=(a,b)=>!b.present?-1:!a.present?1:a.key<=b.key?-1:1;
 let lo=0,hi=rows.length-1;const stack=[],swap=(a,b)=>{if(a!==b)[rows[a],rows[b]]=[rows[b],rows[a]];};
 for(;;){const n=hi-lo+1;if(n>8){swap(lo+(n>>1),lo);let l=lo,r=hi+1;
   for(;;){do{l++;}while(l<=hi&&cmp(rows[l],rows[lo])<=0);do{r--;}while(r>lo&&cmp(rows[r],rows[lo])>=0);if(l>r)break;swap(l,r);}swap(lo,r);
   if((r-lo)*4-1<(hi-l)*4){if(l<hi)stack.push([l,hi]);if(lo+1<r){hi=r-1;continue;}}
   else{if(lo+1<r)stack.push([lo,r-1]);if(l<hi){lo=l;continue;}}
  }else for(let end=hi;lo<end;end--){let max=lo;for(let i=lo+1;i<=end;i++)if(cmp(rows[i],rows[max])>0)max=i;swap(max,end);}
  if(!stack.length)return rows.map(r=>r.slot);[lo,hi]=stack.pop();
 }
}
export function legacyGamePlayerSkillCost(main,level){return Math.trunc(Math.imul(integer(level),integer(main))/100)|0;}
export function createLegacyGamePlayerSkills(){let closed=false,version=0,rosterVersion=0,headerCode=0,headerNameBytes=new Uint8Array(),records=Array.from({length:15},blank),sorted=records.map((_,i)=>i),craftContextMode=0;
 const craft=createLegacyGameCraftRecipes();
 const active=()=>{if(closed)fail('LEGACY_PLAYER_SKILL_CLOSED');};
 return Object.freeze({
  apply(consumer,slot,value){active();if(!['0x4f0210','0x4f0290','0x4f0510'].includes(consumer))fail('LEGACY_PLAYER_SKILL_CONSUMER');
   if(consumer!=='0x4f0290')integer(slot);if(consumer==='0x4f0510'&&(slot<0||slot>=15))fail('LEGACY_PLAYER_SKILL_SLOT');
   const raw=assetBytes(value,32760);let pending=null;const requests=[],changed=[],craftResetSlots=[];
   try{if(consumer==='0x4f0210'){const name=text(raw,23);headerNameBytes.fill(0);headerNameBytes=name;headerCode=slot&255;}
    else{const rows=split(raw);pending=records.map(clone);
     if(consumer==='0x4f0290'){
      for(let at=0;at<rows.length;at+=11){const index=number(rows,at);if(index<0)break;if(index>=15)fail('LEGACY_PLAYER_SKILL_SLOT');
       const row=pending[index],name=text(token(rows,at+2,255),24),a=number(rows,at+3),b=number(rows,at+4);
       row.nameBytes.fill(0);row.nameBytes=name;row.present=!!name.length;
       if(!name.length&&a<0&&b<0){row.fields[0x1c]=row.fields[0x24]=0;for(const l of row.levels)wipeLevel(l);row.levels=Array.from({length:11},blankLevel);craftResetSlots.push(index);}
       else{for(const [offset,n]of [[0x19,7],[0x1c,3],[0x20,5],[0x24,4],[0x28,6],[0x2c,8],[0x30,1],[0x34,9],[0x38,10]])row.fields[offset]=offset===0x19?number(rows,at+n)&255:number(rows,at+n);
         if(row.fields[0x2c]===1)requests.push(Object.freeze({operationId:'send-004f6d00',arguments:Object.freeze([legacyGameWorkContextSlot(index,craftContextMode)])}));
       }changed.push(index);
      }
     }else{const row=pending[slot];for(const l of row.levels)wipeLevel(l);row.levels=Array.from({length:11},blankLevel);
      for(let at=0,index=0;at<rows.length;at+=6,index++){
       // 510de0 returns1 without a delimiter or when its255-byte name read reaches capacity.
       // An empty delimiter-terminated interior name instead loops forever in4f0510.
       if(at===rows.length-1||rows[at].length>=255)break;
       if(index>=11)fail('LEGACY_PLAYER_SKILL_LEVEL_BOUNDS');const name=text(token(rows,at,255),24);if(!name.length)fail('LEGACY_PLAYER_SKILL_EMPTY_UNPROVEN');
       const description=text(token(rows,at+1,255),96),packed=number(rows,at+4);
       row.levels[index]={present:true,nameBytes:name,descriptionBytes:description,fields:{0x7c:number(rows,at+2),0x80:number(rows,at+3),0x84:packed&4095,0x88:1,0x8c:number(rows,at+5),0x90:(packed>>12)&15}};
      }changed.push(slot);
     }
     if(consumer==='0x4f0290'){
       if(pending.some((row,index)=>!sameRosterEntry(row,records[index])))rosterVersion++;
       sorted=order(pending);
     }
     for(const r of records)wipe(r);records=pending;pending=null;
     }for(const index of craftResetSlots)craft.reset(index);version++;return Object.freeze({kind:consumer==='0x4f0210'?'player-skill-header':consumer==='0x4f0290'?'player-skills-updated':'player-skill-levels-updated',consumer,version,slots:Object.freeze(changed),craftResetSlots:Object.freeze(craftResetSlots),requests:Object.freeze(requests),craftContextMode,completeSkills:false});
   }finally{raw.fill(0);if(pending)for(const r of pending)wipe(r);}
  },
  applyCraft(slot,value){active();return craft.apply(slot,value,craftContextMode);},
  setCraftContext(value){active();legacyGameWorkContextSlot(0,value);craftContextMode=value;},
  craftContext(){active();return craftContextMode;},
  copyCraft(slot){active();return craft.copy(slot);},
  record(slot){active();return Number.isInteger(slot)&&slot>=0&&slot<15?copy(records[slot],slot):null;},
  workRecords(){active();return Object.freeze(sorted.map(slot=>copy(records[slot],slot)).filter(r=>r.present&&(r.fields[0x2c]===1||r.fields[0x2c]===2&&[217,218,219,220].includes(r.fields[0x30])||r.fields[0x2c]===3&&[221,222,223,224].includes(r.fields[0x30])||r.fields[0x2c]===4&&[225,226,227,250,251,253].includes(r.fields[0x30])||r.fields[0x2c]===5)));},
  knowsCraftProduct(id){active();return records.some((r,slot)=>r.fields[0x30]>199&&r.fields[0x30]<215&&craft.containsProductId(slot,id));},
  craftRecords(){active();return Object.freeze(sorted.map(slot=>copy(records[slot],slot)).filter(r=>r.present&&r.fields[0x2c]===1&&r.fields[0x30]!==255));},
  battleRecords(){active();return Object.freeze(sorted.filter(slot=>records[slot].present&&[0,5].includes(records[slot].fields[0x2c])).map(slot=>copy(records[slot],slot)));},
  copyRoster(){
    active();
    const occupiedSlots=[];
    let usedSlotUnits=0;
    for(const [slot,row] of records.entries()){
      if(!row.present)continue;
      occupiedSlots.push(slot);
      usedSlotUnits+=(row.fields[0x19]<<24)>>24;
    }
    return Object.freeze({version:rosterVersion,usedSlotUnits,occupiedSlots:Object.freeze(occupiedSlots),
      displaySlots:Object.freeze(sorted.filter(slot=>records[slot].present))});
  },
  copyState(){active();return Object.freeze({profile:LEGACY_GAME_PLAYER_SKILL_PROFILE.id,version,headerCode,headerNameBytes:headerNameBytes.slice(),records:Object.freeze(records.map(copy)),order:Object.freeze([...sorted]),craftContextMode,completeSkills:false});},
  close(){if(closed)return;closed=true;craft.close();headerNameBytes.fill(0);for(const r of records)wipe(r);records=[];sorted=[];},
 });
}

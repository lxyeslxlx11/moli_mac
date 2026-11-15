/** Fixed37c4 received pet records and skill slots. Logical values retain source offsets. */
import{assetBytes}from'./legacy-game-resource-values.mjs';
import{splitLegacyGameStateFields as split,unescapeLegacyGameInnerField as unescape,readLegacyGameStateBase62 as base62,readLegacyGameStateDecimal as decimal}from'./legacy-game-state.mjs';
import{classifyLegacyGameActorResource,resolveLegacyGameActorResource}from'./legacy-game-motion.mjs';
export const LEGACY_GAME_PET_PROFILE=Object.freeze({id:'legacy-se6000-37c4-pet-records-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',petSlots:5,skillSlots:10,recordBytes:0x6d8,skillBytes:0x8c,nativeUI:false,completePetGameplay:false});
export class LegacyGamePetError extends Error{constructor(code){super('Pet data is outside the evidenced ordinary source profile.');this.name='LegacyGamePetError';this.code=code;}}
const fail=code=>{throw new LegacyGamePetError(code);};
const full=Object.freeze([[0x6a0,'resource'],[4,'u16'],[0x10,'i32'],[0x20,'i32'],[0x30,'i32'],[0x40,'i32'],[0x50,'i32'],[0x60,'i32'],[8,'i32'],[0x84,'i32'],[0x88,'i32'],[0x8c,'i32'],[0x90,'i32'],[0x94,'i32'],[0x98,'i32'],[0xc4,'i32'],[0xc8,'i32'],[0xcc,'i32'],[0xd0,'i32'],[0x6a4,'i32'],[2,'u16'],[0x6ac,'name'],[0x6bd,'name'],[0x6aa,'mode'],[0xd4,'i32']].map(Object.freeze));
const stats=Object.freeze([0x70,0x74,0x78,0x7c,0x80,0xb4,0xb8,0xbc,0xc0,0x9c,0xa0,0xa4,0xa8,0xac,0xb0,0x6d0]);
const token=(rows,i,n)=>rows[i]?.subarray(0,n)??new Uint8Array(),number=(rows,i)=>{const v=token(rows,i,127);return v.length?decimal(v):-1;};
const skill=()=>({present:false,id:0,flags:0,targetMask:0,mpCost:0,sortKey:0,nameBytes:new Uint8Array(),descriptionBytes:new Uint8Array()});
const fresh=()=>({present:false,fields:{},nameBytes:new Uint8Array(),nicknameBytes:new Uint8Array(),skills:Array.from({length:10},skill)});
function wipe(r){r.nameBytes.fill(0);r.nicknameBytes.fill(0);for(const s of r.skills){s.nameBytes.fill(0);s.descriptionBytes.fill(0);}}
const copySkill=s=>Object.freeze({...s,nameBytes:s.nameBytes.slice(),descriptionBytes:s.descriptionBytes.slice()});
const copyRecord=(r,slot)=>Object.freeze({slot,present:r.present,fields:Object.freeze({...r.fields}),nameBytes:r.nameBytes.slice(),nicknameBytes:r.nicknameBytes.slice(),skills:Object.freeze(r.skills.map(copySkill))});
const sameBytes=(a,b)=>a.length===b.length&&a.every((byte,index)=>byte===b[index]);
export function createLegacyGamePets(){let closed=false,version=0;const records=Array.from({length:5},fresh);
 const revisions=records.map(()=>({identity:0,skills:0}));
 const active=()=>{if(closed)fail('LEGACY_PET_CLOSED');};
 return Object.freeze({
  apply(consumer,slot,value,resourceCode=0){active();if(!['0x4f0aa0','0x4f1000','0x4f1420'].includes(consumer))fail('LEGACY_PET_CONSUMER');if(!Number.isInteger(slot)||slot< -2147483648||slot>2147483647)fail('LEGACY_PET_SLOT');if(slot<0||slot>=5)return Object.freeze({kind:'pet-ignored',reason:'slot',slot});
   const prior=records[slot];if(consumer==='0x4f1420'&&!prior.present)return Object.freeze({kind:'pet-ignored',reason:'absent',slot});const raw=assetBytes(value,32760);let pending=null;
   try{const rows=split(raw);if(consumer==='0x4f1420'){
     pending={...prior,fields:{...prior.fields},skills:Array.from({length:10},skill)};let i=0;
     for(let count=0;count<=4095;count++,i+=8){const index=number(rows,i);if(index<0)break;if(index>9)fail('LEGACY_PET_SKILL_SLOT');const name=unescape(token(rows,i+2,255)),description=unescape(token(rows,i+3,255));if(!name.length){name.fill(0);description.fill(0);fail('LEGACY_PET_SKILL_EMPTY_UNPROVEN');}
      const row={present:true,id:number(rows,i+1)&65535,flags:number(rows,i+5)&65535,targetMask:number(rows,i+6)&65535,mpCost:number(rows,i+4),sortKey:number(rows,i+7),nameBytes:name.length<25?name.slice():Uint8Array.of(63,63,63),descriptionBytes:description.length<97?description.slice():Uint8Array.of(63,63,63)};name.fill(0);description.fill(0);const old=pending.skills[index];old.nameBytes.fill(0);old.descriptionBytes.fill(0);pending.skills[index]=row;if(count===4095)fail('LEGACY_PET_SKILL_BUDGET');}
     if(pending.skills.some((skill,index)=>{
       const previous=prior.skills[index];
       return skill.present!==previous.present||skill.id!==previous.id||!sameBytes(skill.nameBytes,previous.nameBytes);
     }))revisions[slot].skills++;
     for(const s of prior.skills){s.nameBytes.fill(0);s.descriptionBytes.fill(0);}records[slot]=pending;pending=null;
    }else{const first=token(rows,0,127),mask=(first.length?base62(first):-1)>>>0;if(mask===0){
      if(prior.present)revisions[slot].identity++;
      if(consumer==='0x4f0aa0'){wipe(prior);records[slot]=fresh();}else{prior.present=false;prior.nameBytes.fill(0);prior.nicknameBytes.fill(0);prior.nameBytes=new Uint8Array();prior.nicknameBytes=new Uint8Array();}
     }else{const updates=[];let i=1;for(let n=0;n<(consumer==='0x4f0aa0'?full.length:stats.length);n++){if(!(mask&(1|(2<<n))))continue;
       const[offset,kind]=consumer==='0x4f0aa0'?full[n]:[stats[n],'i32'];let v;
       if(kind==='name'){const b=unescape(token(rows,i++,255));if(b.length<=16)updates.push({offset,bytes:b.slice()});b.fill(0);continue;}
       v=number(rows,i++);if(kind==='u16')v&=65535;else if(kind==='resource'){if(!Number.isInteger(resourceCode)||resourceCode<0||resourceCode>0xffffffff)fail('LEGACY_PET_RESOURCE_CONTEXT');if(classifyLegacyGameActorResource(v)!==0)v=resolveLegacyGameActorResource(v,resourceCode);}else if(kind==='mode'){v&=65535;updates.push({offset:0x6d4,value:(v&16)?1:0});v&=~16;}
       updates.push({offset,value:v});}
      if(!prior.present||updates.some(u=>{
        if(u.bytes)return !sameBytes(u.bytes,u.offset===0x6ac?prior.nameBytes:prior.nicknameBytes);
        return (u.offset===0x6a0||u.offset===4)&&u.value!==prior.fields[u.offset];
      }))revisions[slot].identity++;
      prior.present=true;for(const u of updates){if(u.bytes){const name=u.offset===0x6ac?'nameBytes':'nicknameBytes';prior[name].fill(0);prior[name]=u.bytes;}else prior.fields[u.offset]=u.value;}
     }}version++;return Object.freeze({kind:consumer==='0x4f1420'?'pet-skills-updated':'pet-record-updated',consumer,slot,version,present:records[slot].present});
   }finally{raw.fill(0);if(pending)for(const s of pending.skills){s.nameBytes.fill(0);s.descriptionBytes.fill(0);}}
  },
  record(slot){active();return Number.isInteger(slot)&&slot>=0&&slot<5?copyRecord(records[slot],slot):null;},
  findBattlePet(){active();return records.findIndex(r=>r.present&&r.fields[0x6aa]===2);},
  copyTrainingRoster(){
    active();
    return Object.freeze(records.flatMap((record,slot)=>record.present?[Object.freeze({slot,...revisions[slot]})]:[]));
  },
  copyState(){active();return Object.freeze({profile:LEGACY_GAME_PET_PROFILE.id,version,count:records.filter(r=>r.present).length,records:Object.freeze(records.map(copyRecord)),order:Object.freeze(records.map((r,slot)=>Object.freeze({slot,present:r.present,sortKey:r.fields[0x6d0]??0})))});},
  inspect(){return Object.freeze({state:closed?'closed':'open',version,count:closed?0:records.filter(r=>r.present).length,completePetGameplay:false});},
  close(){if(closed)return;closed=true;for(const r of records)wipe(r);records.length=0;},
 });
}

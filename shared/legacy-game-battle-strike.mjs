/** Source4260b0/424310 ordinary physical-family queue construction. No native code or assets. */
import{BATTLE_MOTION_ALIASES}from'./legacy-game-battle-motion-data.mjs';
export const LEGACY_GAME_BATTLE_STRIKE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-ordinary-physical-skills-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',classes:Object.freeze([0,1,3]),variants:Object.freeze([0]),resultFlagsMask:0x1000012f,scope:'actual-ordinary-physical-queues-animation-hit-vitals-and-KO',completeSKL:false,completeBattleGameplay:false});
const remap=n=>n===50?20:n===51?21:n,unavailable=reason=>Object.freeze({kind:'strike-unavailable',reason});
export function planBattleStrike(command,body){
 let d,fields;try{d=Object.getOwnPropertyDescriptors(command);if(['index','attachedRID','fields'].some(k=>!Object.hasOwn(d[k]??{},'value')))return unavailable('strike-numeric-fields');fields=d.fields.value;if(!Array.isArray(fields))return unavailable('strike-numeric-fields');fields=Object.getOwnPropertyDescriptors(fields);}catch{return unavailable('strike-numeric-fields');}
 if(d.index.value!==0||d.attachedRID.value)return unavailable('strike-RID-dependency');
 const length=fields.length.value;if(length<8||length>2048||Reflect.ownKeys(fields).length!==length+1)return unavailable('strike-numeric-fields');const f=[];for(let i=0;i<length;i++){if(!Object.hasOwn(fields[i]??{},'value'))return unavailable('strike-numeric-fields');const n=fields[i].value;if(!Number.isInteger(n)||n< -2147483648||n>2147483647)return unavailable('strike-numeric-fields');f.push(n);}let code=f[0];if(code>50000)for(const [from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
 const category=Math.trunc(code/100),level=code%10,cost=f[1];if(!LEGACY_GAME_BATTLE_STRIKE_PROFILE.classes.includes(category)||f[2]!==0||level<0)return unavailable('strike-category-variant');
 let at=3;const hits=[];while(at<f.length){const actor=remap(f[at++]);if(actor===255)break;const target=remap(f[at++]),flags=f[at++]>>>0,amount=f[at++];
  if((flags&~LEGACY_GAME_BATTLE_STRIKE_PROFILE.resultFlagsMask)!==0)return unavailable('strike-result-branch');
  if(!Number.isInteger(amount)||!body(actor)||!body(target)||actor===target)return unavailable('strike-body-dependency');
  if(!body(actor).vitals||!body(target).vitals)return unavailable('strike-C-vitals-required');
  if([body(actor),body(target)].some(b=>(b.rawStatusFlags&~0x401)||b.unmodeledCharacterMask||b.linkedResources.some(Boolean)||b.scale.some(n=>n!==1)))return unavailable('strike-character-branch');
  hits.push(Object.freeze({actor,target,flags,amount}));
 }if(!hits.length||f[at-1]!==255||at!==f.length)return unavailable('strike-record-boundary');
 const rows=new Map(),row=slot=>{if(!rows.has(slot))rows.set(slot,{slot,actions:[],tuples:[]});return rows.get(slot);},action=(slot,...values)=>row(slot).actions.push(...values),tuple=(slot,...values)=>row(slot).tuples.push(values),principal=hits[0].actor;
 action(principal,38,147,53);
 for(let i=0;i<hits.length;i++){const h=hits[i];action(h.actor,24,...(i===0||h.actor!==principal?[7,9,10]:[3]),242);tuple(h.actor,h.target,h.flags|0,h.amount,0);action(h.actor,14);action(h.target,0);
  if(!(h.flags&0x108)&&h.amount!==0&&(h.flags&3))action(h.target,h.flags&2?160:26);
  if(h.amount!==0||(h.flags&0x108)){if(h.target!==principal)action(h.target,11);if(h.flags&0x100)action(h.target,74);}
  if((h.flags&0x20)&&h.target!==principal)action(h.target,44);
 }
 const firstKnockedOut=hits.some(h=>h.target===principal&&(h.flags&0x20));if(firstKnockedOut)action(principal,11,44);else if(principal<20)action(principal,7,11,10);
 return Object.freeze({kind:'strike-plan',category,level,cost,principal,hits:Object.freeze(hits),rows:Object.freeze([...rows.values()].map(r=>Object.freeze({slot:r.slot,actions:Object.freeze(r.actions),tuples:Object.freeze(r.tuples.map(Object.freeze))}))),completeSKL:false});
}

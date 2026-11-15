/** Original authored targets and skill records;no account material. */
import {bytes,skillRow,itemRow} from '../game-work-actions-v1/fixture.mjs';
export {bytes,itemRow};
const ids=[221,222,223,224,225,226,227,251,253,250,999,223];
const names=['Disguise','Transform','First aid','Treatment','Mine','Hunt','Wood','Mine alternate','Hunt alternate','Wood alternate','Unknown','Wrong kind'];
export const targetHeader=ids.map((id,slot)=>skillRow(slot,id,slot<4?3:slot===11?2:4,names[slot],10)).join('');
export const levels='Level1|Original work|10|0|0|1|Level2|Original advanced work|20|0|0|1|';
export const peopleWire='Remote person|0|Direct person|1|Other person|2|';
export const subjectWire='Remote person|30|0|40|100|20|30|Remote pet|10|2|30|80|12|20|';
export const context=()=>({self:{nameBytes:bytes('Local hero'),level:20,health:0,HP:50,maxHP:100,MP:1000,maxMP:1000},
  party:[{nameBytes:bytes('Party ally')},{nameBytes:new Uint8Array()}],
  pets:Array.from({length:5},(_,slot)=>({present:[1,3,4].includes(slot),mode:slot===1?3:2,
    nameBytes:bytes(slot===3?'Fox':slot===4?'Bird':'Excluded'),level:8,health:1,HP:20,maxHP:70,MP:10,maxMP:30}))});
export function targetOwners(api){
  const skills=api.createLegacyGamePlayerSkills(),items=api.createLegacyGameItems(),local=context();
  skills.apply('0x4f0290',null,bytes(targetHeader));for(let slot=0;slot<12;slot++)skills.apply('0x4f0510',slot,bytes(levels));
  let mp=1000,location={display:[2,3],position:[128,192]};
  const owner=api.createLegacyGameCraft({skills:()=>skills.workRecords(),skill:s=>skills.record(s),recipes:s=>skills.copyCraft(s),
    items:()=>items.copyCraftRecords(),mp:()=>mp,location:()=>location,targetContext:()=>local});
  return {owner,skills,items,local,set mp(n){mp=n;local.self.MP=n;},set location(v){location=v;},
    act(action,value,tick=1000){return owner.prepare(action,owner.inspect().revision,value,tick);},
    open(slot,level=1,tick=1000){this.act('open');this.act('skill',slot);return this.act('level',level,tick);},
    people(wire=peopleWire){return owner.receivePeople(bytes(wire));},subjects(wire=subjectWire){return owner.receiveSubjects(bytes(wire));},
    close(){owner.close();skills.close();items.close();}};
}
export async function offerTargetRecords(h,api){
  const offer=(tag,args,raw)=>h.send(Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
    Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')]));
  await offer('J<=',[],targetHeader);for(let slot=0;slot<12;slot++)await offer('JUA',[slot],levels);
  await offer('E(9',[],'8|1000');return offer;
}

/** Original authored ordinary work fixtures. No real account or gameplay data. */
export {bytes} from '../game-craft-input-v1/fixture.mjs';
import {bytes} from '../game-craft-input-v1/fixture.mjs';
export const skillRow=(slot,id,kind,name,rank=2)=>[slot,id,name,rank,2,3,4,1,kind,100,slot].join('|')+'|';
export const workHeader=skillRow(0,200,1,'Forge')+skillRow(1,217,2,'Weapon repair')+
  skillRow(2,218,2,'Armor repair')+skillRow(3,219,2,'Appraisal')+
  skillRow(4,220,2,'Engraving')+skillRow(5,255,1,'Decoration');
export const levels='Level1|Original work|1|0|0|1|Level2|Original advanced work|2|0|0|1|';
export const itemRow=(slot,name,category,level=1,description='Identified',qualification=0,code=0,quantity=0)=>
  [slot,name,'',description,1000,0,0,0,level,qualification,code,category,quantity,0].join('|')+'|';
export const workItems=itemRow(8,'Sword',0)+itemRow(9,'Unknown relic',20,1,'')+
  itemRow(10,'Ring',22)+itemRow(11,'Base charm',0,1,'Made locally',0x800,501)+
  itemRow(12,'Gem',38)+itemRow(13,'Not decoratable',0,1,'Identified',0x800,999)+
  itemRow(14,'Armor',7)+itemRow(15,'High rank',0,3)+itemRow(16,'Blocked mark',22,1,'Identified',0x100);
const blankRecipe=()=>[-1,0,0,'','',0,0,-1,'',0,-1,'',0,-1,'',0,-1,'',0,-1,'',0];
export function knownProducts(){
  const rows=Array.from({length:56},blankRecipe);
  rows[40]=[501,0,0,'Known product','Original product',1,1,-1,'',0,-1,'',0,-1,'',0,-1,'',0,-1,'',0];
  return rows.map(row=>row.join('|')+'|').join('');
}
export function workOwners(api){
  const skills=api.createLegacyGamePlayerSkills(),items=api.createLegacyGameItems();
  skills.apply('0x4f0290',null,bytes(workHeader));for(let slot=0;slot<6;slot++)skills.apply('0x4f0510',slot,bytes(levels));
  skills.applyCraft(0,bytes(knownProducts()));items.apply(bytes(workItems));let mp=1000,location={display:[2,3],position:[128,192]};
  const owner=api.createLegacyGameCraft({skills:()=>skills.workRecords(),skill:s=>skills.record(s),
    recipes:s=>skills.copyCraft(s),items:()=>items.copyCraftRecords(),knowsProduct:code=>skills.knowsCraftProduct(code),mp:()=>mp,location:()=>location});
  return {owner,skills,items,set mp(n){mp=n;},set location(v){location=v;},
    act(action,value,tick=1000){return owner.prepare(action,owner.inspect().revision,value,tick);},
    open(slot,level=1){this.act('open');this.act('skill',slot);return this.act('level',level);},
    target(slot){const row=items.copyCraftRecords().find(i=>i.slot===slot);return this.act('target',{slot,revision:row.revision});},
    assign(position,slot){const row=items.copyCraftRecords().find(i=>i.slot===slot);return this.act('assign',{position,slot,revision:row.revision});},
    close(){owner.close();skills.close();items.close();}};
}
export async function offerWorkRecords(h,api){
  const offer=(tag,args,raw)=>h.send(Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
    Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')]));
  await offer('J<=',[],workHeader);for(let slot=0;slot<6;slot++)await offer('JUA',[slot],levels);
  await offer('@_i',[0],knownProducts());await offer('?l)',[],workItems);await offer('E(9',[],'8|1000');return offer;
}

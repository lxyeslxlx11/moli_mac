/** Original authored context,inventory and skill records. */
import {bytes,skillRow,itemRow} from '../game-work-actions-v1/fixture.mjs';
import {craftRecipe} from '../game-craft-input-v1/fixture.mjs';
import {context as targets} from '../game-work-targets-v1/fixture.mjs';
export {bytes,craftRecipe};
export const header=skillRow(0,200,1,'Forge')+skillRow(1,217,2,'Weapon repair')+
  skillRow(2,219,2,'Appraisal')+skillRow(3,255,1,'Decoration')+skillRow(4,220,2,'Engraving')+
  skillRow(5,225,4,'Mine')+skillRow(6,223,3,'First aid')+skillRow(7,98,5,'Original direct skill');
export const levels='Level1|Original work|1|0|0|1|Level2|Original advanced work|20|0|0|1|';
export const items=itemRow(8,'Copper',38,1,'Material',0,100,3)+itemRow(9,'Wood',25,1,'Material',0,200)+
  itemRow(10,'Sword',0,3)+itemRow(11,'Unknown relic',20,3,'')+
  itemRow(12,'Base charm',0,1,'Made locally',0x800,501)+itemRow(13,'Gem',38)+itemRow(14,'Ring',22);
export function contextOwners(api){
  const skills=api.createLegacyGamePlayerSkills(),inventory=api.createLegacyGameItems();
  skills.apply('0x4f0290',null,bytes(header));for(let slot=0;slot<8;slot++)skills.apply('0x4f0510',slot,bytes(levels));
  skills.applyCraft(0,bytes(craftRecipe(501)));inventory.apply(bytes(items));
  let mp=1000,location={display:[2,3],position:[128,192]};
  const state={tier:3,remainingMilliseconds:600000,rideChild:false};
  const owner=api.createLegacyGameCraft({skills:()=>skills.workRecords(),skill:s=>skills.record(s),
    recipes:s=>skills.copyCraft(s),items:()=>inventory.copyCraftRecords(),knowsProduct:code=>skills.knowsCraftProduct(code),
    mp:()=>mp,location:()=>location,targetContext:targets,
    workContext:()=>({...state,mode:skills.craftContext()}),setWorkContext:skills.setCraftContext});
  return {owner,skills,inventory,state,get mp(){return mp;},set mp(n){mp=n;},set location(v){location=v;},
    act(action,value,tick=1000){return owner.prepare(action,owner.inspect().revision,value,tick);},
    select(slot){this.act('open');return this.act('skill',slot);},
    target(slot){const item=inventory.copyCraftRecords().find(i=>i.slot===slot);return this.act('target',{slot,revision:item.revision});},
    assign(position,slot){const item=inventory.copyCraftRecords().find(i=>i.slot===slot);return this.act('assign',{position,slot,revision:item.revision});},
    close(){owner.close();skills.close();inventory.close();}};
}
export async function offerContextRecords(h,api){
  const offer=(tag,args,raw)=>h.send(Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
    Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),...(raw===undefined?[]:[Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')])]));
  await offer('J<=',[],header);for(let slot=0;slot<8;slot++)await offer('JUA',[slot],levels);
  await offer('@_i',[0],craftRecipe(501));await offer('?l)',[],items);await offer('E(9',[],'8|1000');
  await offer('F8%',[],'8ww|3');await offer('Xz@',[600,1]);return offer;
}

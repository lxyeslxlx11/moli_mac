/** Original synthetic manufacture records; no extracted game resources or sessions. */
export const bytes=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
export const craftHeader='3|220|Forge|1|2|3|4|1|1|125|5|';
export const craftLevels='Level1|Make a charm|8|0|0|1|Level2|Unavailable|9|0|0|0|';
export const craftRecipe=(id=700)=>[id,0,0,'Copper charm','A hand-made charm',8,1,100,'Copper',2,200,'Wood',1,-1,'',0,-1,'',0,-1,'',0].join('|')+'|';
export const itemRow=(slot,name,code,quantity,category=10,description='Material',qualification=0)=>
  [slot,name,'',description,1000,0,0,0,1,qualification,code,category,quantity,0].join('|')+'|';
export const craftItems=itemRow(8,'Copper',100,3)+itemRow(9,'Wood',200,0)+
  itemRow(10,'Catalyst',900,0,38)+itemRow(11,'Spare copper',100,2)+
  itemRow(12,'Empty description',100,3,10,'',1)+itemRow(13,'Newline first',200,1,10,'\\nDescription',1);
export function craftOwners(api){
  const skills=api.createLegacyGamePlayerSkills(),items=api.createLegacyGameItems();
  skills.apply('0x4f0290',null,bytes(craftHeader));skills.apply('0x4f0510',3,bytes(craftLevels));
  skills.applyCraft(3,bytes(craftRecipe()));items.apply(bytes(craftItems));
  let mp=1000,location={display:[2,3],position:[128,192]};
  const owner=api.createLegacyGameCraft({skills:()=>skills.craftRecords(),skill:s=>skills.record(s),
    recipes:s=>skills.copyCraft(s),items:()=>items.copyCraftRecords(),mp:()=>mp,location:()=>location});
  return {owner,skills,items,set mp(n){mp=n;},set location(v){location=v;},
    act(action,value,tick=1000){return owner.prepare(action,owner.inspect().revision,value,tick);},
    open(){this.act('open');this.act('skill',3);this.act('level',0);return this.act('recipe',0);},
    assign(position,slot){const item=items.copyCraftRecords().find(r=>r.slot===slot);return this.act('assign',{position,slot,revision:item.revision});},
    close(){owner.close();skills.close();items.close();}};
}
export async function offerCraftRecords(h,api){
  const offer=(tag,args,raw)=>h.send(Buffer.concat([Buffer.from(tag+' '),
    ...args.flatMap(n=>[Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),
    Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')]));
  await offer('J<=',[],craftHeader);await offer('JUA',[3],craftLevels);
  await offer('@_i',[3],craftRecipe());await offer('?l)',[],craftItems);
  await offer('E(9',[],'8|1000');
  return offer;
}

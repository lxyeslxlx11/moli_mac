/** Fixed37c4 420170/420130 transient sprites and41f660/41f5b0 timed tile queue. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {battleIntegerBox,battleIntegerBoxAtLeast,battleIntegerBoxIncrement,battleIntegerBoxSnapshot} from './legacy-game-battle-integer-box.mjs';
const f=Math.fround;
// Original533a74: six complete16-entry rows. Values identify graphics,not artwork.
const rows=Object.freeze([
 [28881,28881,28882,28882,28883,28883,28884,28884,28885,28885,28886,28886,28887,28887,28888,28888],
 [28889,28889,28890,28890,28891,28891,28892,28892,28893,28893,28894,28894,28895,28895,28896,28896],
 [28897,28897,28898,28898,28899,28899,28900,28900,28901,28901,28902,28902,28903,28903,28904,28904],
 [28905,28905,28906,28906,28907,28907,28908,28908,28909,28909,28910,28910,28911,28911,28912,28912],
 [28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904],
 [28913,28913,28913,28913,28914,28914,28914,28914,28915,28915,28915,28915,28916,28916,28916,28916],
].map(Object.freeze));
const rowFor=selector=>{if(!Number.isInteger(selector)||selector<0||selector>=rows.length)fail('LEGACY_BATTLE_PHYSICAL_TILE_SELECTOR');return rows[selector];};
export function createBattlePhysicalSpecials(a,c,common){
 function transient(parent,resource,x=0,y=0,lifetime=30,mainState=10){
  const origin=parent.body?parent.body.position:parent.position;
  const node=a.allocate('physical-transient',null,{position:[f(origin[0]+x),f(origin[1]+y)],screenSpace:true,
   resourceId:resource,actorFlags:0x40000,drawPriority:204,height:-8,physicalSpecial:{kind:'transient',lifetime}});
  a.animate(node,1,mainState);a.screen(node);return node;
 }
 function tile(selector,duration){
  if(duration<1)return null;rowFor(selector);
  const node=a.allocate('physical-tile',null,{screenSpace:true,state:selector,actorFlags:0x40002,drawPriority:0,speedPercent:100});
  // The two temporary boxes are constructed after allocation,limit before counter.
  const limit=battleIntegerBox(duration,c.random),counter=battleIntegerBox(0,c.random);
  node.physicalSpecial={kind:'tile',pulse:0,descending:0,limit,counter};return node;
 }
 function validate(plan){
  const check=selector=>{for(const resource of new Set(rowFor(selector)))common.image(resource);};
  if(plan.category===258&&!plan.pairMode&&plan.variant!==2)common.image(plan.level===9?0x71b2:0x71b1);
  if(plan.level===9){
   if(plan.pairMode&&[257,262].includes(plan.category))check(plan.category===257?2:3);
   if(!plan.pairMode&&[258,259,266].includes(plan.category))check(plan.category===258?3:plan.category===259?5:0);
   if(plan.category===259)check(0);
  }
  return Object.freeze({kind:'physical-family-supported'});
 }
 return Object.freeze({transient,tile,validate,
  body(node,ctx){const b=node.body;if(!b.physicalFamily)return false;
   if(b.state===240){const at=b.tupleRead*4;tile(b.tuples[at],b.tuples[at+2]);if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');b.tupleRead++;a.pop(b);}
   else if(b.state===67){transient(node,b.messageResource,0,0,30,ctx.mainState);if(!(b.dynamicFlags&0x60))a.animate(node,1,ctx.mainState);a.pop(b);}
   else return false;a.screen(node);return true;
  },
  effect(node){const special=node.physicalSpecial;if(!special)return false;
   if(special.kind==='transient'){node.counter=(node.counter+1)|0;if(node.counter>=special.lifetime)node.deleted=true;a.screen(node);return true;}
   if(special.descending===0){special.pulse++;if(special.pulse>=15)special.descending=1;}
   else{special.pulse--;if(special.pulse<=0)special.descending=0;}
   const resourceId=rowFor(node.state)[special.pulse];
   // 41f5b0 queues all100 draws before testing lifetime,including its last callback.
   for(let x=0;x<10;x++)for(let y=0;y<10;y++)a.submitDirect(Object.freeze({resourceId,x:32+64*x,y:24+48*y,priority:3}));
   if(battleIntegerBoxAtLeast(special.counter,special.limit,c.random))node.deleted=true;
   battleIntegerBoxIncrement(special.counter,c.random);return true;
  },
  snapshot(node){const s=node.physicalSpecial;if(!s)return null;
   return s.kind==='transient'?Object.freeze({kind:s.kind,lifetime:s.lifetime}):Object.freeze({kind:s.kind,pulse:s.pulse,descending:s.descending,counter:battleIntegerBoxSnapshot(s.counter),limit:battleIntegerBoxSnapshot(s.limit)});
  },
 });
}

/** Native CMB command counters,70/125..127 and420c50/derived420e50 banner ownership. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{legacyGameBattleSine as sine}from'./legacy-game-battle-math.mjs';
import{battleIntegerBox,battleIntegerBoxRead,battleIntegerBoxIncrement,battleIntegerBoxSnapshot}from'./legacy-game-battle-integer-box.mjs';
const f=Math.fround,X=[0,34,54,66,88,108,131,152,171,0],MIRROR=[0,8,7,6,5,4,3,2,1,9];
export function createBattleCombinationPlayback(a,c,common){const contexts=new Map();let used=false;
 const find=owner=>contexts.get(owner),increment=(b,required=false)=>{const x=find(b.owner);if(x)x.counter=(x.counter+1)|0;else if(required)fail('LEGACY_BATTLE_COMBINATION_OWNER');};
 function banner(count,target){count=Math.min(count,10);const reverse=target>9;
  for(let i=0;i<(count===10?10:9);i++){const letter=reverse?MIRROR[i]:i,resource=letter===0?count+0x5a62:letter===8?0x5a7a:letter===9?0x5a7d:letter+0x5a75,g=common.image(resource),n=a.allocate('combination-banner',null,{priority:11,drawPriority:205,resourceId:0,bannerGraphicResource:resource,actorFlags:letter===0||letter===9?2:0,screenSpace:true,drawFlagMask:4,drawFlagValue:4,
    position:[f((letter===9?X[4]:X[letter])+g.originX+(reverse?-203:672)),f(g.originY+(reverse?96:384)-(letter===9?32:0))],bannerState:0,bannerDelay:i*4,bannerLifetime:(8-letter)*4,bannerAngle:reverse?90:270,bannerSpeed:18,
    bannerIndex:battleIntegerBox(i,c.random),bannerCounter:{encoded:0,mask:0,reads:0}});
   battleIntegerBoxRead(n.bannerIndex,c.random);n.staticFrame=Object.freeze({...n.player.copyState(),graphicIndex:g.index,geometry:g,drawOffsetX:0,drawOffsetY:0,drawFlags:0,paletteSelector:0,color:0xffffffff});a.screen(n);
  }
 }
 function move(n){const angle=f(270-n.bannerAngle);n.position=[f(n.position[0]-sine(f(angle+90))*n.bannerSpeed),f(n.position[1]+sine(angle)*n.bannerSpeed)];a.screen(n);}
 return Object.freeze({
  validate(plan,controlFlags=0){if(!common.configured())fail('LEGACY_BATTLE_SKILL_CONFIGURATION');for(const h of plan.hits)for(const style of h.flags&0x8000?[]:h.flags&0x4000?[5]:[6])for(const ch of String(h.value))common.image(243700+style*10-48+ch.charCodeAt(0));
   if(!(controlFlags&0x404)&&plan.order.length>1)for(const reverse of[plan.lastActor>9])for(let i=0;i<(plan.order.length>=10?10:9);i++){const letter=reverse?MIRROR[i]:i;common.image(letter===0?Math.min(plan.order.length,10)+0x5a62:letter===8?0x5a7a:letter===9?0x5a7d:letter+0x5a75);}return{kind:'combination-supported'};},
  queue(plan,owner){used=true;contexts.set(owner,{owner,counter:0,target:plan.principal,order:[...plan.order],aggregate:plan.aggregate,lastFlags:plan.lastFlags,lastActor:plan.lastActor,unknownFourthCells:plan.rows.filter(r=>r.unknownFourthCells.length).map(r=>({slot:r.slot,sourceBodyId:a.node(a.get(r.slot)).id,cells:r.unknownFourthCells.map(index=>a.get(r.slot).tupleWrite-r.tuples.length+index)})),bannerCreated:false});},
  state(owner){const x=find(owner);return x?Object.freeze({...x,order:Object.freeze([...x.order]),unknownFourthCells:Object.freeze(x.unknownFourthCells.map(r=>Object.freeze({slot:r.slot,sourceBodyId:r.sourceBodyId,cells:Object.freeze([...r.cells])})))}):null;},
  resetCounter(owner){const x=find(owner);if(!x)fail('LEGACY_BATTLE_COMBINATION_OWNER');x.counter=0;},
  release(owner){contexts.delete(owner);},
  activateNext(owner,controlFlags){const x=find(owner);if(!x)fail('LEGACY_BATTLE_COMBINATION_OWNER');const slot=x.order[x.counter],b=slot===undefined?null:a.get(slot);if(!b)fail('LEGACY_BATTLE_COMBINATION_MEMBER_REMOVED');if(b.state===0)a.pop(b);
   if(x.counter>=x.order.length-1){if(!(controlFlags&0x404)&&x.order.length>1){banner(x.order.length,x.lastActor);x.bannerCreated=true;}return true;}return false;},
  hit(node,{signal,flags,partial,normal}){const b=node.body;if(partial&&signal<20000){increment(b,true);b.cooperativePending=0;}else if(normal&&!(flags&0x108))increment(b);},
  body(node,ctx){const b=node.body;if(!find(b.owner))return false;if(b.state===-1){a.screen(node);return true;}if(b.state===70){increment(b,true);a.pop(b);a.screen(node);return true;}
   if(b.state<125||b.state>127)return false;if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
   if(b.skillStatus===0){a.allocate('physical-result-charge',null,{parent:node,position:[b.position[0],f(b.position[1]+Math.trunc(node.player.copyState().drawOffsetY/2))],screenSpace:true,resourceId:0x1ae1d+(b.state-125)*8,actorFlags:c.alternativeRenderer?0x140000:0x48000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});b.skillStatus=1;}a.pop(b);a.screen(node);return true;
  },
  effect(n){if(n.kind!=='combination-banner')return false;const state=n.bannerState;n.bannerLifetime=(n.bannerLifetime+1)|0;
   if(state===0){if(n.bannerDelay!==0){n.bannerDelay--;return true;}battleIntegerBoxIncrement(n.bannerCounter,c.random);if(battleIntegerBoxRead(n.bannerCounter,c.random)>60)n.bannerState++;}
   else if(state===1){move(n);n.bannerSpeed=f(n.bannerSpeed-f(.7));if(n.bannerSpeed<=0){n.bannerState++;n.bannerCounter=battleIntegerBox(0,c.random);battleIntegerBoxRead(n.bannerCounter,c.random);}}
   else if(state===2){battleIntegerBoxIncrement(n.bannerCounter,c.random);if(n.actorFlags===0){if(n.bannerLifetime>240)n.deleted=true;}
    else if(battleIntegerBoxRead(n.bannerCounter,c.random)>50){n.actorFlags=0;n.bannerState++;n.bannerSpeed=10;n.bannerAngle=0;if(battleIntegerBoxRead(n.bannerIndex,c.random)===9)a.event({kind:'sound',value:0x40,nodeId:n.id,position:Object.freeze([320,240])});}}
   else if(state===3){move(n);battleIntegerBoxIncrement(n.bannerCounter,c.random);n.bannerSpeed=f(n.bannerSpeed-f(.3));if(n.bannerSpeed<=0){n.bannerAngle=180;n.bannerState++;}}
   else if(state===4){battleIntegerBoxIncrement(n.bannerCounter,c.random);n.bannerSpeed=f(n.bannerSpeed+f(.3));if(n.bannerSpeed>=10)n.bannerState++;move(n);}
   else{battleIntegerBoxIncrement(n.bannerCounter,c.random);if(n.bannerLifetime>240)n.deleted=true;}n.resourceId=n.bannerState;return true;
  },
  nodeState(n){return n.kind==='combination-banner'?Object.freeze({state:n.bannerState,delay:n.bannerDelay,lifetime:n.bannerLifetime,angle:n.bannerAngle,speed:n.bannerSpeed,index:battleIntegerBoxSnapshot(n.bannerIndex),counter:battleIntegerBoxSnapshot(n.bannerCounter)}):null;},
  snapshot(){return used?Object.freeze({contexts:Object.freeze([...contexts.values()].map(x=>Object.freeze({...x,order:Object.freeze([...x.order]),unknownFourthCells:Object.freeze(x.unknownFourthCells.map(r=>Object.freeze({slot:r.slot,sourceBodyId:r.sourceBodyId,cells:Object.freeze([...r.cells])})))})))}):null;},
  clear(){contexts.clear();used=false;}
 });
}

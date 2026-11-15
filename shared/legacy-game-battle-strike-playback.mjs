/** Physical body/effect callbacks from fixed37c4; real resources and child/queue completion own progress. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{legacyGameGraphicResourceIdAt}from'./legacy-game-graphics.mjs';
import{battleBodyFormation}from'./legacy-game-battle-data.mjs';
import{battleStatusVital}from'./legacy-game-battle-status.mjs';
import{legacyGameBattleFacing}from'./legacy-game-battle-math.mjs';
const f=Math.fround,types=new Set([3,7,9,10,14,24,25,26,29,30,44,46,47,49,53,72,74,129,147,154,155,157,160,209,210,242,243]);
// 41b7f0 analyst-seeded callback: X0..15, then Y0..15. No original sprite bytes.
const KO=[48,44,34,18,0,-18,-34,-44,-48,-44,-34,-18,0,18,34,44,0,14,26,44,47,33,26,14,0,-14,-26,-44,-47,-33,-26,-14];
export function createBattleStrikePlayback(a,c){let graphics=null;
 const configured=()=>graphics!==null;
 const tuple=b=>{const at=b.tupleRead*4;return{slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2]};};
 const popTuple=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');b.tupleRead++;return b.tuples[b.tupleRead*4]===-1;};
 const flip=b=>{b.angle=f(b.angle+180);if(b.angle>=360)b.angle=f(b.angle-360);};
 const vital=(b,index,amount)=>{if(!b.vitals)fail('LEGACY_BATTLE_SKILL_VITALS_REQUIRED');const before=b.vitals[index],next=Math.max(0,(before-amount)|0);b.vitals[index]=next;a.event({kind:'battle-vital',slot:b.slot,field:index===0?'HP':'MP',before,value:next,delta:next-before});};
 const image=resource=>{const g=graphics.image(resource);if(!g.present||g.index<1000)fail('LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');return g;};
 const digit=(g,position,delay,{kind='damage-digit',...options}={})=>{
  const glyph=a.allocate(kind,null,{position,screenSpace:true,actorFlags:0x40002,drawPriority:207,height:-8,delay,...options});
  glyph.staticFrame=Object.freeze({...glyph.player.copyState(),graphicIndex:g.index,geometry:g,drawOffsetX:0,drawOffsetY:0,drawFlags:0,paletteSelector:0,color:0xffffffff});
  a.screen(glyph);
 };
 const number=(node,value,style=6)=>{const text=String(value),middle=Math.trunc(text.length*9/2),p=node.screen,base=243700+style*10;
  for(let i=0;i<text.length;i++){
   const g=image(base-48+text.charCodeAt(i));
   digit(g,[g.originX+p[0]-middle+11*i,g.originY+p[1]-80],i*2);
  }
 };
 function prepareTimeGlyphs(seconds){
  const delta=(-seconds)|0,magnitude=delta<0?(-delta)|0:delta;
  const text=(delta<0?'-':'')+Math.trunc(magnitude/60)+':'+String(magnitude%60).padStart(2,'0');
  return Array.from(text,ch=>{
   const resourceId=ch==='-'?0x3b859:ch===':'?0x3b85a:0x3b7c4+ch.charCodeAt(0);
   return {resourceId,geometry:image(resourceId)};
  });
 }
 function timeGlyphs(node,glyphs){
  const [x,y]=node.screen,halfWidth=Math.trunc(glyphs.length*9/2);
  glyphs.forEach(({resourceId,geometry:g},i)=>{
   digit(g,[g.originX+x-halfWidth+11*i,g.originY+y],i*2,{kind:'time-glyph',resourceId,angle:x<320?270:90,speed:18});
  });
 }
 // 420080 reads40/44 world floats;30/34 can still contain the pre-move screen position.
 const message=(node,resource)=>{const n=a.allocate('message',null,{position:[...(node.body?node.body.position:node.position)],screenSpace:true,resourceId:resource,actorFlags:0x40000,drawPriority:204,height:-8});a.animate(n,1,10);a.screen(n);};
 const impact=(node,resource,facing=0)=>{const q=node.player.copyState(),g=q.geometry;if(!g)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');const x=c.random.range(0,Math.trunc(g.width/2))+node.screen[0]-Math.trunc(g.width/4),y=Math.trunc(q.drawOffsetY/4)+node.screen[1]-c.random.range(0,Math.trunc(q.drawOffsetY/3));
  return a.allocate('impact',null,{position:[x,y],screenSpace:true,resourceId:resource,actorFlags:0x50000,drawPriority:204,facing});
 };
 const getNode=b=>{const n=a.node(b);if(!n)fail('LEGACY_BATTLE_BODY_OWNER');return n;};
 function hit(node,ctx){const b=node.body,t=tuple(b),other=a.get(t.slot);if(!other)fail('LEGACY_BATTLE_SKILL_TARGET_REMOVED');const victim=getNode(other),signal=node.player.copyState().signal;
  if(signal>9999){other.frozen=0;other.classCode=-1;other.attackerSlot=b.slot;other.reactionFlags=t.flags;a.aim(other,b.position,true);
   if(!(t.flags&0x108)){
    if(t.amount!==0){other.position=[...other.rememberedPosition];if(t.flags&2)impact(victim,0x1adb8);impact(victim,t.flags&4?110000:b.classCode===0?0x1ae35:b.classCode===1?0x1ae36:b.classCode===3?0x1ae37:c.random.range(0,2)+0x1adb1);a.sound(node,signal-(signal<20000?10000:20000));}
    if(signal<20000){a.pop(other);if(t.amount!==0){vital(other,0,t.amount);number(victim,t.amount);if(t.flags&2)message(victim,0x57b6);}else message(victim,t.flags&0x10000000?0x57bb:0x573b);if(t.flags&0x20){other.dynamicFlags|=2;other.auxFF8=1;a.setSlow(1);}}
    else if(t.amount!==0)other.state=25;
   }else if(t.flags&8)other.state=29;
   else if(signal>=20000||other.afterImageEnabled===0){a.sound(node,0xd2);other.afterImageEnabled=1;other.state=29;}
   if(!(t.flags&8)&&t.amount!==0)b.attackCooldown=(((other.dynamicFlags>>>1)&1)+1)*14;
   node.player.clearSignal();
  }
  if(b.attackCooldown>0)b.attackCooldown--;
  if(b.attackCooldown===0){if(b.attackFinishCounter===0){if(a.animate(node,1,ctx.mainState)!==1)return;}else if(b.attackFinishCounter>10){a.pop(b);popTuple(b);b.attackCooldown=b.attackFinishCounter=0;return;}b.attackFinishCounter++;}
 }
 function reaction(node,ctx,type){const b=node.body; b.animationAction=(b.reactionFlags&0xc04)?9:8;b.speedPercent=50;const count=++b.reactionCounter,dead=(b.dynamicFlags>>>1)&1,start=(dead+1)*14,end=dead*14+34;
  if(count<start){b.speed=5;flip(b);if(dead){b.auxFF8=1;a.setSlow(1);}a.move(b);a.animate(node,1,ctx.mainState);return;}
  if(count<end){if(type===160||(b.reactionFlags&2))b.facing=(b.facing+1)&7;if(count===start){b.speed=5;b.counter=0;if(dead){if(a.countAux()<2)a.setSlow(0);b.auxFF8=0;}}if(b.counter===0)a.reactionPuff(node);if(++b.counter>2)b.counter=0;b.speed=Math.max(0,f(b.speed-f(0.3)));a.move(b);a.animate(node,1,ctx.mainState);return;}
  if(count>=dead*14+54){b.reactionCounter=0;b.speed=dead?1:6;b.speedPercent=dead?250:100;a.pop(b);if(!dead&&b.state===11){b.speed=4;b.speedPercent=100;}}
  a.animate(node,1,ctx.mainState);
 }
 function body(node,ctx){const b=node.body,type=b.state,t=tuple(b),other=a.get(t.slot);if(!configured()||!types.has(type))return false;
  switch(type){
   case 3:if(!other)fail('LEGACY_BATTLE_SKILL_TARGET_REMOVED');b.animationAction=1;b.speed=8;b.speedPercent=100;a.aim(b,other.position,true);if(a.distance(b,other.position)>=70)a.move(b);else a.pop(b);a.animate(node,0,ctx.mainState);break;
   case 7:b.animationAction=2;b.speedPercent=100;a.aim(b,other?other.position:battleBodyFormation(b).target,true);if(a.animate(node,1,ctx.mainState)===1){a.pop(b);if(b.dynamicFlags&2)b.speedPercent=200;}break;
   case 9:{b.animationAction=3;b.speed=8;b.speedPercent=100;const previous=b.actionRead>=2?b.actions[b.actionRead-2]:-1,point=previous===14?battleBodyFormation(b).target:other?.position;if(!point)fail('LEGACY_BATTLE_SKILL_TARGET_REMOVED');a.aim(b,point,true);if(a.distance(b,point)>=(previous===14?5:70))a.move(b);else a.pop(b);a.animate(node,0,ctx.mainState);break;}
   case 10:b.animationAction=4;b.speedPercent=100;if(a.animate(node,1,ctx.mainState)===1){if(b.actionRead>0&&b.actions[b.actionRead-1]===11&&!(b.dynamicFlags&2)){const registered=a.get(b.slot);if(registered)a.reface(registered);}a.pop(b);}break;
   case 14:b.animationAction=5;b.speedPercent=100;hit(node,ctx);break;
   case 24:if(!other){a.pop(b);break;}if(other===b||other.state===0){other.rememberedPosition=[...getNode(other).screen];a.pop(b);}else{b.animationAction=0;if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);}break;
   case 25:b.animationAction=(b.reactionFlags&0xc04)?9:8;b.speedPercent=50;b.speed=5;flip(b);a.move(b);a.animate(node,1,ctx.mainState);break;
   case 26:case 160:reaction(node,ctx,type);break;
   case 29:{
     b.speedPercent=100;
     const count=++b.reactionCounter,spin=(b.reactionFlags&0x8000000)!==0;
     if(spin&&(count&1)===0)b.facing=(b.facing+1)&7;
     if(count<14){b.animationAction=1;b.speed=-4;a.move(b);}
     else if(count<28)b.animationAction=0;
     else if(a.get(b.attackerSlot)?.state!==14){
       if(spin)b.facing=legacyGameBattleFacing(b.angle);
       b.animationAction=0;b.speed=b.reactionFlags&0x1010?6:4;b.reactionCounter=0;a.pop(b);
     }
     a.animate(node,1,ctx.mainState);break;
   }
   case 30:b.animationAction=8;b.speedPercent=100;if(a.animate(node,1,ctx.mainState)===1)a.pop(b);break;
   case 44:b.animationAction=10;b.speedPercent=100;if(a.animate(node,1,ctx.mainState)===1){if(b.dynamicFlags&0x1000){b.scale=[1,1];b.dynamicFlags&=~0x1000;}for(const key of ['overlay','status','special','shadow'])a.removeChild(node,key);if(b.attachmentHidden)b.state=214;else{b.savedFlags|=2;b.state=46;}}break;
   case 46:case 209:b.counter++;if(b.sourceTimer>7){b.sourceTimer=0;b.actorFlags|=0x8000;a.sound(node,0xda);const g=node.player.copyState().geometry;if(!g)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');a.allocate('knockout',null,{parent:node,priority:b.slot*10+1,position:[Math.trunc(g.width/2)+node.player.copyState().drawOffsetX+node.screen[0],node.screen[1]],screenSpace:true,actorFlags:0x40000,drawPriority:204,completedParticles:0});b.skillStatus=1;b.state=type===209?210:47;}else if(b.counter>4){b.counter=0;b.actorFlags^=2;b.sourceTimer++;}break;
   case 210:if(b.skillStatus===2){b.skillStatus=0;a.pop(b);}break;
   case 47:if(b.skillStatus===2){b.skillStatus=0;b.state=49;}break;
   case 49:a.detach(b);node.deleted=b.deleted=true;break;
   case 53:a.animate(node,1,ctx.mainState);if(b.mpCost>0){vital(b,2,b.mpCost);b.mpCost=-1;}a.pop(b);break;
   case 72:popTuple(b);a.pop(b);break;
   case 74:b.afterImageEnabled=0;a.pop(b);break;
   case 129:if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0){const resource=0x1ae55+[3,3,3,2,2,2,1,1,1,0][b.skillLevel],child=a.allocate('status-heal',null,{parent:node,position:[...b.position],resourceId:resource,actorFlags:0x48000,drawPriority:204});
     if(resource===0x1ae55)a.allocate('status-heal-overlay',null,{parent:child,position:[...child.position],resourceId:0x1ae68,actorFlags:0x48000,drawPriority:203});b.skillStatus=1;}b.state=157;break;
   case 147:if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0){const q=node.player.copyState();if(!q.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');const level=[3,3,3,2,2,2,1,1,1,0][b.skillLevel];a.allocate('charge',null,{parent:node,position:[...b.position].map((n,i)=>i?f(n+Math.trunc(q.drawOffsetY/2)):n),resourceId:0x1ae14+level,actorFlags:0x40000,drawPriority:204});b.skillStatus=1;}b.state=157;break;
   case 154:case 155:{if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.numberStyle!==0)number(node,b.numberValue,b.numberStyle);else message(node,0x57bb);if([3,5,6].includes(b.numberStyle)){const result=battleStatusVital(b.vitals,b.numberStyle,b.numberValue);b.vitals[result.index]=result.value;a.event({kind:'battle-vital',slot:b.slot,field:result.index===0?'HP':'MP',before:result.before,value:result.value,delta:result.value-result.before});}if(type===154)a.pop(b);else b.state=35;break;}
   case 157:if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===2){b.skillStatus=0;b.frozen=0;a.pop(b);}break;
   case 242:b.rememberedPosition=b.position.map(Math.trunc);a.pop(b);break;
   case 243:b.animationAction=1;b.speed=8;b.speedPercent=100;a.aim(b,b.rememberedPosition,true);a.move(b);if(a.distance(b,b.rememberedPosition)<5){b.position=[...b.rememberedPosition];a.pop(b);}a.animate(node,0,ctx.mainState);break;
  }a.screen(node);return true;
 }
 function effect(n,ctx){
  if(n.kind==='impact'){if(a.animate(n,1,ctx.mainState)===1)n.deleted=true;}
  else if(n.kind==='charge'||n.kind==='status-heal'){if(a.animate(n,1,ctx.mainState)===1){if(n.parent&&!n.parent.deleted&&n.parent.body.skillStatus!==0)n.parent.body.skillStatus=2;n.deleted=true;}}
  else if(n.kind==='status-heal-overlay'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);}
  else if(n.kind==='damage-digit'||n.kind==='time-glyph'){if(n.state===0){if(n.delay>0)n.delay--;else{const height=n.height+f(0.8);n.height=f(height);n.actorFlags&=~2;if(height>=f(7.2))n.state=1;n.position[1]=(n.position[1]+Math.trunc(height))|0;}}else if(++n.counter>49)n.deleted=true;}
  else if(n.kind==='knockout'){if(n.parent.deleted){n.deleted=true;return true;}const before=n.state++;if(before<50){if(n.state===40)n.parent.body.actorFlags|=2;const i=c.random.range(0,15),flags=c.random.range(0,1)===0?0x50000:0x48000,x=n.position[0]+KO[i],y=n.position[1]+KO[i+16];a.allocate('knockout-particle',null,{parent:n,position:[f(x),f(y)],screenSpace:true,resourceId:0x1adb4,actorFlags:flags,drawPriority:204,targetY:n.position[1]-100+KO[i+16],verticalSpeed:0,acceleration:f(0.2)});}if(n.completedParticles>=50){if(n.parent.body.skillStatus!==0)n.parent.body.skillStatus=2;n.deleted=true;}}
  else if(n.kind==='knockout-particle'){if(n.parent.deleted){n.deleted=true;return true;}n.verticalSpeed=f(n.verticalSpeed-n.acceleration);n.position[1]=f(n.position[1]+n.verticalSpeed);if(n.position[1]<n.targetY){n.parent.completedParticles++;n.deleted=true;}a.animate(n,0,ctx.mainState);}
  else return false;a.screen(n);return true;
 }
 return Object.freeze({configured,configure(value){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_BATTLE_SKILL_CONFIGURATION');}if(graphics||Reflect.ownKeys(d).length!==1||!Object.hasOwn(d.graphics??{},'value')||c.alternativeRenderer)fail('LEGACY_BATTLE_SKILL_CONFIGURATION');legacyGameGraphicResourceIdAt(d.graphics.value,0);graphics=d.graphics.value;return Object.freeze({scope:'ordinary-physical-family-and-PSN-with-real-graphic-catalog',completeSKL:false});},validate(plan){if(!configured())fail('LEGACY_BATTLE_SKILL_CONFIGURATION');for(const h of plan.hits)if(h.amount!==0)for(const ch of String(h.amount))image(243760-48+ch.charCodeAt(0));},validateStatus(plan){if(!configured())fail('LEGACY_BATTLE_SKILL_CONFIGURATION');for(const ch of String(plan.amount))image(243700+plan.style*10-48+ch.charCodeAt(0));},body,effect,image,number,impact,message,prepareTimeGlyphs,timeGlyphs});
}

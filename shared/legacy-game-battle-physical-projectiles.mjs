/** Source15/18 emitters,16/17 flight and20/21/22 multi-target owners from fixed37c4. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameBattleAngle} from './legacy-game-battle-math.mjs';
import {physicalAngle,physicalAngleDifference,physicalSteer,physicalFlightResource,physicalApproachPoint} from './legacy-game-battle-projectile-geometry.mjs';
const f=Math.fround;
const ordinaryResources=new Map([[0,0x1ae35],[1,0x1ae36],[3,0x1ae37],[5,0x1ae3b],[6,0x1ae39],[81,0x1ae5e],[84,0x1ae5f],[85,0x1ae4f],[87,0x1ae50]]);
const unavailable=reason=>Object.freeze({kind:'physical-family-unavailable',reason});
const actions=new Set([0,4,7,8,6,10,11,15,18,23,24,26,27,28,32,34,38,39,41,42,44,49,50,53,62,67,71,72,73,74,78,119,120,121,147,160,216,240,244]);

export function createBattlePhysicalProjectiles(a,c,common){
 const tuple=b=>{const i=b.tupleRead*4;return{slot:b.tuples[i],flags:b.tuples[i+1]>>>0,amount:b.tuples[i+2]};};
 const target=b=>{const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');return other;};
 const nodeOf=b=>{const n=a.node(b);if(!n)fail('LEGACY_BATTLE_BODY_OWNER');return n;};
 const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
 const frame=n=>{const q=n.player.copyState();if(!q.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');return q;};
 const aim=(b,p,maximum=0)=>{const angle=legacyGameBattleAngle(f(p[0]-b.position[0]),f(p[1]-b.position[1]));b.angle=physicalSteer(b.angle,angle,maximum);};
 const signal=n=>n.player.copyState().signal;
 const flip=b=>{b.angle=physicalAngle(f(b.angle+180));};
 function vital(b,amount,healing){
  if(!b.vitals)fail('LEGACY_BATTLE_SKILL_VITALS_REQUIRED');
  const before=b.vitals[0],value=healing?Math.min(b.vitals[1],(before+amount)|0):Math.max(0,(before-amount)|0);
  b.vitals[0]=value;a.event({kind:'battle-vital',slot:b.slot,field:'HP',before,value,delta:value-before});
 }
 function copyRecord(from,to){
  const i=from.tupleRead,t=tuple(from),count=t.flags&0x800000?4:1;
  if(i+count>199||to.tupleWrite+count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
  for(let j=0;j<count;j++){to.tuples.set(from.tuples.subarray((i+j)*4,(i+j+1)*4),to.tupleWrite++*4);to.tuples[to.tupleWrite*4]=-1;}
  from.tupleRead+=count-1;
 }
 function anonymous(role,parent,flags,priority){
  const b=a.createAnonymous();b.actorFlags=flags;b.position=[...parent.body.position];b.resourceId=0;b.speed=10;
  return a.allocate('body',b,{priority:2,drawPriority:priority,physicalRole:role,physicalFlow:{turnRate:role==='multi'?10:0,headingSign:0,waypoint:[0,0]}});
 }
 function copyIdentity(from,to){to.classCode=from.classCode;to.physicalVariant=from.physicalVariant;to.skillLevel=from.skillLevel;}
 function arrow(parent,origin,destination,resource,ctx){
  const n=a.allocate('physical-arrow',null,{parent,position:[...origin],screenSpace:true,resourceId:resource,actorFlags:0x40000,
   drawPriority:parent.drawPriority,speedPercent:10,angle:0,speed:10,drawFlagMask:resource===0x1adc0?4:0,drawFlagValue:resource===0x1adc0?4:0});
  n.screen=[0,0];aim(n,destination.map(Math.trunc));a.animate(n,0,ctx.mainState);
  if(resource===0x1adc0){a.move(n);a.move(n);}a.screen(n);return n;
 }
 // 41a8c0: one initial move; first animation precedes category/variant/level/slot copies.
 function single(parent,base,ctx){
  const original=parent.body,victim=target(original),n=anonymous('single',parent,0x60000,203),b=n.body;
  b.speedPercent=10;a.aim(b,victim.position,true);const start=frame(parent);b.speed=f(start.geometry.width*0.5);a.move(b);b.speed=10;
  b.resourceId=physicalFlightResource(b.angle,base);copyRecord(original,b);b.state=16;n.screen=[0,0];a.animate(n,0,ctx.mainState);
  copyIdentity(original,b);b.slot=original.slot;
  const end=frame(nodeOf(victim));
  arrow(n,[b.position[0],f(start.geometry.height*0.5+start.drawOffsetY+b.position[1])],
   [victim.position[0],f(end.geometry.height*0.5+end.drawOffsetY+victim.position[1])],b.resourceId-16,ctx);
  n.screen=b.position.map(v=>Math.trunc(v)|0);return n;
 }
 // 41ab20: copy all tuples,initialize through actual20 callbacks,then copy skill fields.
 function multiple(parent,ctx){
  const original=parent.body,n=anonymous('multi',parent,0x40000,205),b=n.body;
  n.parent=parent;b.slot=original.slot;b.speedPercent=100;b.resourceId=0x19258;b.facing=0;n.screen=b.position.map(v=>Math.trunc(v)|0);
  do{copyRecord(original,b);}while(!advance(original));
  const first=target(b),second=b.tupleWrite>1?a.get(b.tuples[4]):null;
  n.physicalFlow.waypoint=physicalApproachPoint(b.position,n.screen,first.position,nodeOf(first).screen,second?.position);
  aim(b,n.physicalFlow.waypoint);b.state=20;const width=frame(parent).geometry.width*0.5;
  let iterations=0;do{if(++iterations>65536)fail('LEGACY_BATTLE_PHYSICAL_INITIALIZATION_BUDGET');body(n,ctx);}while(b.state===20&&a.distance(b,original.position)<width);
  a.animate(n,0,ctx.mainState);copyIdentity(original,b);return n;
 }
 // 41a2d0: hidden result body plus a separately moving1adc0 visual.
 function impactProjectile(parent,ctx){
  const original=parent.body,victim=target(original),n=anonymous('single',parent,0x60002,203),b=n.body;
  b.resourceId=0;b.animationAction=0;b.speedPercent=100;b.speed=10;a.aim(b,victim.position,false);
  copyRecord(original,b);b.state=16;b.slot=original.slot;n.screen=[0,0];
  const start=frame(parent),end=frame(nodeOf(victim));
  arrow(n,[b.position[0],f(f(start.geometry.height*0.5)+start.drawOffsetY+b.position[1])],
    [victim.position[0],f(f(end.geometry.height*0.5)+end.drawOffsetY+victim.position[1])],0x1adc0,ctx);
  copyIdentity(original,b);a.move(b);a.move(b);a.animate(n,0,ctx.mainState);
  n.screen=b.position.map(value=>Math.trunc(value)|0);return n;
 }
 function resources(b,flags,multi){
  if(flags&4)return {primary:110000,extra:-1,face:0};
  if(!multi&&(flags&0x800))return {primary:0x1ae13,extra:-1,face:0};
  if(flags&0x400)return {primary:0x1ae12,extra:-1,face:0};
  let primary=ordinaryResources.get(b.classCode),extra=-1,face=0;
  if(b.classCode>=75&&b.classCode<=80||!multi&&b.classCode===110)primary=0x1adfa;
  else if(b.classCode===257||multi&&b.classCode===266){primary=b.skillLevel===9?0x1adbe:-1;extra=0x1af8c;}
  else if(b.classCode===258){primary=-1;extra=0x1af8d;}
  else if(b.classCode===259){primary=0x1adb1+c.random.range(0,2);extra=0x1af86;}
  else if(b.classCode===260||b.classCode===262||!multi&&b.classCode===266){primary=0x1af89;face=b.classCode===266?1:0;}
  else if(primary===undefined)primary=0x1adb1+c.random.range(0,2);
  return {primary,extra,face};
 }
 function release95(victim){const b=victim.body;if(b.state!==0){a.pop(b);b.reactionCounter=0;b.skillStatus=0;}a.pop(b);}
 function applyResult(n,ctx,multi){
  const b=n.body,other=target(b),victim=nodeOf(other),principal=nodeOf(a.get(b.slot)),r=resources(b,tuple(b).flags,multi);
  a.aim(other,b.position,true);other.attackerSlot=b.slot;other.reactionFlags=tuple(b).flags;a.metadata(n);
  if(b.classCode===259&&b.skillLevel===9)a.tile(0,15);
  const t=tuple(b),effectMask=multi?0xe000:0x7e000,skipMask=multi?0x8000:0x48000,healMask=multi?0x4000:0x24000,manaMask=multi?0x2000:0x12000;
  if(!(t.flags&0x108)){
   if(!(t.flags&effectMask)&&t.amount!==0){
    if(t.flags&2)common.impact(victim,0x1adb8);if(r.primary>=0)common.impact(victim,r.primary,r.face);if(r.extra>=0)common.impact(victim,r.extra);
    a.extraImpact(principal,victim);a.sound(n,multi?0x8f:b.physicalVariant===1?0x8d:b.physicalVariant===3?0x8e:0xff);
    vital(other,t.amount,false);if(t.flags&0x20){other.dynamicFlags|=2;other.auxFF8=1;a.setSlow(1);}
   }
   if(!(t.flags&skipMask)){
    const healing=!!(t.flags&healMask),mana=!healing&&!!(t.flags&manaMask);
    if(!healing&&!mana&&(t.flags&0x100000)){a.removeChild(victim,'status');other.dynamicFlags&=~0x20;}
    if(!multi&&b.classCode===95){
     if(!healing&&!mana){flip(other);other.speed=8;a.move(other);flip(other);}release95(victim);
    }else{if(!multi&&b.classCode===110&&(t.flags&0x80000))a.condition(victim,0x1adfb);a.pop(other);}
    if(healing)vital(other,t.amount,true);
    if(!mana){if(t.flags&0x10000000)common.message(victim,0x57bb);else{common.number(victim,t.amount,healing?5:6);if(t.flags&2)common.message(victim,0x57b6);a.feedback(principal,victim);}}
   }else if(!multi&&b.classCode===95)release95(victim);
   else{if(!multi&&b.classCode===110&&(t.flags&0x80000))a.condition(victim,0x1adfb);a.pop(other);}
   if(b.classCode===259&&(t.flags&0x80000))a.condition(victim,0x1adfb);
  }else if(!multi&&b.classCode===95)release95(victim);
  else{if(!(t.flags&8)&&(t.flags&0x100)){other.afterImageEnabled=1;a.sound(n,0xd2);}other.state=29;}
  if(!(t.flags&8)&&t.amount!==0)b.attackCooldown=multi?(((((other.dynamicFlags>>>1)&1)+1)*14)>>2):((((other.dynamicFlags>>>1)&1)+1)*14);
 }
 function deflect(n,ctx){
  const b=n.body,other=target(b),victim=nodeOf(other);n.deleted=b.deleted=true;b.state=17;
  if(b.physicalVariant===3){const old=[...b.position],speed=b.speed;b.speed=20;a.move(b);const impact=common.impact(n,0x1af85);impact.position=b.position.map(Math.trunc);impact.position[1]-=90;b.position=old;b.speed=speed;}
  else{const impact=common.impact(n,b.physicalVariant===1?0x1af85:0x1af89);impact.position[1]-=b.physicalVariant===1?103:68;}
  common.impact(victim,0x1af8a);if(other.state!==0){a.pop(other);other.reactionCounter=0;other.skillStatus=0;}a.pop(other);
 }
 // 415027..415364: the first tuple names the attacker;the next owns the
 // immediate self/guard result. No projectile,animation signal or108 gate.
 function selfResult(n){
  const b=n.body,attacker=tuple(b).slot;advance(b);const other=target(b),victim=nodeOf(other),principal=nodeOf(a.get(attacker));
  let t=tuple(b),resource=t.flags&4?110000:t.flags&0x400?0x1ae12:b.skillLevel===9?0x1adbe:-1;
  if(!(t.flags&4)&&(t.flags&0x400))common.impact(n,0x1adbe);
  other.attackerSlot=attacker;other.reactionFlags=t.flags;a.metadata(n,attacker);t=tuple(b);
  if(!(t.flags&0x8000)){
   if(t.flags&0x4000){
    vital(other,t.amount,true);
    if(t.amount===0&&(t.flags&0x10000000))common.message(victim,0x57bb);
    else{common.number(victim,t.amount,5);if(t.flags&2)common.message(victim,0x57b6);a.feedback(n,victim);}
   }else if(!(t.flags&0x2000)){
    vital(other,t.amount,false);
    if(t.amount!==0){if(t.flags&2)common.impact(victim,0x1adb8);if(resource>=0)common.impact(victim,resource);a.extraImpact(principal,victim);}
    if(t.flags&0x10000000)common.message(nodeOf(a.get(t.slot)),0x57bb);
    else{common.number(victim,t.amount,6);if(t.flags&2)common.message(n,0x57b6);a.feedback(principal,victim);}
    if(t.flags&0x20){b.dynamicFlags|=2;b.auxFF8=1;a.setSlow(1);}
   }
  }a.pop(b);advance(b);
 }
 function probe(n,ctx){let found=false;
  for(let i=0;i<65536;i++){if(a.animate(n,1,ctx.mainState)===1)break;const s=signal(n);if(s>=10000&&s<=19999){found=true;break;}if(i===65535)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');}
  n.player.invalidate();n.player.clearSignal();return found;
 }
 function emit(n,ctx,type){const b=n.body;
  if(type===15){
   if(b.attackCooldown===0){b.attackCooldown=1;b.animationAction=7;if(!probe(n,ctx))b.animationAction=5;}b.speedPercent=100;
   const t=tuple(b);if(t.slot!==-1){const victim=target(b);if(b.physicalVariant!==2)a.aim(b,victim.position,true);
    else{const point=[...nodeOf(victim).screen],s=b.slot;
     if(t.slot<10){if(s<0||s>4){if(n.screen[1]<point[1])point[0]-=100;}else if(point[1]<=n.screen[1])point[0]+=100;}
     else if(s<10||s>14){if(point[1]<n.screen[1])point[0]+=100;}else if(n.screen[1]<=point[1])point[0]-=100;
     a.aim(b,point,true);}}
   if(a.animate(n,1,ctx.mainState)===1){a.pop(b);b.attackCooldown=0;}
   const s=signal(n);if(s>=10000&&s<=19999){
    if(t.slot!==-1){
     if(b.physicalVariant===2)n.physicalChild=multiple(n,ctx);
     else{do{if(b.classCode===258)a.transient(nodeOf(target(b)),b.skillLevel===9?0x71b2:0x71b1,0,0,30,ctx.mainState);single(n,0x564a,ctx);}while(!advance(b));}
     a.sound(n,s-10000);
    }
    n.player.clearSignal();
   }
  }else{
   b.animationAction=5;b.speedPercent=b.classCode===95?33:100;
   const t=tuple(b);
   if(t.slot===-1){if(a.animate(n,1,ctx.mainState)===1)a.pop(b);}else{a.aim(b,target(b).position,true);a.animate(n,0,ctx.mainState);}
   const s=signal(n);if(s>=10000&&s<=19999){
    if(t.slot!==-1){if(b.classCode===258)a.transient(nodeOf(target(b)),b.skillLevel===9?0x71b2:0x71b1,0,0,30,ctx.mainState);single(n,0x5622,ctx);a.sound(n,s-10000);const done=advance(b);
     if(b.classCode===95&&!done)n.player.resetFrames();}
    n.player.clearSignal();
   }
  }
 }
 function abandonGuardFlight(n){
  const parent=n.parent.body,{owner,wait,parentTuple}=n.physicalFlow.guardRelay,delay=wait+6;
  if(a.get(parent.slot)===parent&&parent.owner===owner&&parent.actionRead>=wait&&
   parent.actionRead<delay&&parent.actions[delay]===23){
   if(parent.tupleRead===parentTuple)advance(parent);
   parent.actionRead=delay-1;
   a.pop(parent);
  }
  n.deleted=n.body.deleted=true;
 }
 function beginGuardFlight(n){
  const b=n.body,parent=n.parent.body,t=tuple(parent);
  // The first return has just advanced 41 to 72 at the saved-self terminator.
  if(b.classCode!==266||parent.state!==72||t.slot!==-1||!(t.flags&0x200))return false;
  const slot=parent.tuples[(parent.tupleRead+1)*4];
  if(slot===parent.slot)return false;
  const guard=a.get(slot);
  n.parent.physicalWait=0;
  advance(parent);
  a.pop(parent);
  n.physicalFlow.guardRelay={guard,owner:parent.owner,wait:parent.actionRead,parentTuple:parent.tupleRead};
  if(!guard||guard.owner!==parent.owner){
   abandonGuardFlight(n);
   return true;
  }
  a.appendTuple(b,[slot,0,0,0]);
  a.append(b,parent.owner,guard.state===0?[71,24,217]:[24,71,24,217]);
  n.physicalFlow.turnRate=10;
  a.pop(b);
  return true;
 }
 function flyToGuard(n,guard,ctx){
  const b=n.body;
  aim(b,guard.position,10);
  if(a.distance(b,guard.position)<20){
   guard.counter=0;
   a.pop(guard);
   advance(b);
   b.state=21;
   aim(b,n.parent.body.position);
   flip(b);
   b.speed=f(b.speed*0.5);
   delete n.physicalFlow.guardRelay;
  }
  a.move(b);
  a.animate(n,0,ctx.mainState);
 }
 function body(n,ctx){const b=n.body;
  if(b.state===28){b.animationAction=b.reactionFlags&0xc04?9:8;b.speedPercent=50;const count=++b.reactionCounter;
   if(count<14){b.speed=5;flip(b);a.move(b);}else if(count>43){b.reactionCounter=0;b.speedPercent=100;b.speed=4;a.pop(b);}a.animate(n,1,ctx.mainState);a.screen(n);return true;}
  if(n.physicalRole){
   const flow=n.physicalFlow;
   if(flow.guardRelay){
    const guard=a.get(tuple(b).slot),parent=n.parent.body;
    if(!guard||guard!==flow.guardRelay.guard||guard.owner!==flow.guardRelay.owner||a.get(parent.slot)!==parent){
     abandonGuardFlight(n);
    }else if(b.state===71){
     a.pop(guard);
     a.pop(b);
    }else if(b.state===217)flyToGuard(n,guard,ctx);
    else return false; // The ordinary action 24 waits for the guard to become idle.
   }else if(b.state===16){const t=tuple(b),victim=target(b);if(!(t.flags&8))a.aim(b,victim.position,false);
    if(t.flags&0x20000000&&a.distance(b,victim.position)<70&&signal(n)===0){deflect(n,ctx);a.screen(n);return true;}
    if(a.distance(b,victim.position)<20&&signal(n)===0){applyResult(n,ctx,false);n.player.setSignal(1);}
    if(b.attackCooldown>0){b.attackCooldown--;if(b.resourceId===0x1adc0)a.animate(n,0,ctx.mainState);}
    if(b.attackCooldown===0){a.animate(n,0,ctx.mainState);a.move(b);if(signal(n)===1){if(!(tuple(b).flags&0x108))n.deleted=b.deleted=true;b.state=17;}}
   }else if(b.state===17){a.move(b);if(b.position[0]<-200||b.position[0]>840||b.position[1]<-200||b.position[1]>680)n.deleted=b.deleted=true;}
   else if(b.state===20){aim(b,flow.waypoint,10);b.angle=physicalAngle(b.angle);if(a.distance(b,flow.waypoint)<20)b.state=21;a.move(b);a.animate(n,0,ctx.mainState);}
   else if(b.state===21){
    if(signal(n)===0){const other=target(b);if(flow.headingSign===0)flow.headingSign=Math.trunc(physicalAngleDifference(legacyGameBattleAngle(f(other.position[0]-b.position[0]),f(other.position[1]-b.position[1])),b.angle));
     if(a.distance(b,other.position)<60){flow.turnRate=f(flow.turnRate+0.3);aim(b,other.position,flow.turnRate);}aim(b,other.position,flow.turnRate);b.angle=physicalAngle(b.angle);
     if(n.parent.body.state!==15)a.aim(n.parent.body,b.position,true);
     if(signal(n)===0&&a.distance(b,other.position)<20){flow.turnRate=10;applyResult(n,ctx,true);if(advance(b))n.player.setSignal(1);}}
    if(b.attackCooldown>0)b.attackCooldown--;if(b.attackCooldown===0){a.animate(n,0,ctx.mainState);a.move(b);if(signal(n)===1)b.state=22;}
   }else if(b.state===22){
    const parent=n.parent.body,d=physicalAngleDifference(legacyGameBattleAngle(f(parent.position[0]-b.position[0]),f(parent.position[1]-b.position[1])),b.angle);
    let zero=false;if(flow.headingSign===0){flow.headingSign=Math.trunc(d);zero=flow.headingSign===0;}
    const df=f(d);
    if(zero||flow.headingSign<0)b.angle=f(b.angle+(df>=-flow.turnRate&&df<=f(flow.turnRate*0.2)?df:-flow.turnRate));
    else b.angle=f(b.angle+(d>flow.turnRate||df<f(flow.turnRate*-0.2)?flow.turnRate:df));
    b.angle=physicalAngle(b.angle);if(a.distance(b,parent.position)<100)flow.turnRate=f(flow.turnRate+0.3);
    if(a.distance(b,parent.position)<60){
     flow.turnRate=180;
     if(parent.state===15)a.pop(parent);
     let guardFlight=false;
     if(parent.state!==23){
      parent.animationAction=12;a.animate(n.parent,0,ctx.mainState);a.pop(parent);
      guardFlight=beginGuardFlight(n);
     }
     if(!guardFlight&&a.distance(b,parent.position)<20){
      if(b.classCode===266&&parent.actions[parent.actionRead+1]===216){
       n.parent.physicalWait=0;
       a.pop(parent);
      }
      n.deleted=b.deleted=true;
      a.sound(n,0xd8);
     }
    }
    a.move(b);a.animate(n,0,ctx.mainState);
   }else return false;
   a.screen(n);return true;
  }
  // The variant-2 delay can be enqueued after the missing-target reset.
  if(!b.physicalFamily&&!(b.state===23&&b.physicalVariant===2))return false;
  if(b.state===216)selfResult(n);
  else if(b.state===15||b.state===18)emit(n,ctx,b.state);
  else if(b.state===41){if(n.physicalChild)a.aim(b,n.physicalChild.body.position,true);b.speedPercent=100;b.animationAction=0;a.animate(n,0,ctx.mainState);}
  else if(b.state===23){n.physicalWait=((n.physicalWait??0)+1)|0;if(n.physicalWait>=21){n.physicalWait=0;a.pop(b);}}
  else return false;
  a.screen(n);return true;
 }
 return Object.freeze({body,impactProjectile,effect(n,ctx){if(n.kind!=='physical-arrow')return false;
   // Parent payloadfd0 is attackCooldown,distinct from the body's2d4 animation freeze.
   n.speed=10;if(n.parent.body.attackCooldown===0)a.move(n);if(n.parent.deleted)n.deleted=true;
   n.drawPriority=n.parent.drawPriority;a.animate(n,0,ctx.mainState);a.screen(n);return true;
  },validate(plan){
   if(plan.pairMode)return unavailable('physical-family-projectile-pair-route');
   for(const row of plan.rows)for(const type of row.actions)if(!actions.has(type))return unavailable('physical-family-body-consumer-pending');
   a.validateSpecials(plan);
   if(plan.rows.some(r=>r.assignments.messageResource===0x5748))common.image(0x5748);
   if(plan.rows.some(r=>r.actions.includes(216))){
    const h=plan.hits.filter(h=>h.target===plan.principal).at(-1),flags=h.flags;
    if(!(flags&0x8000)&&((flags&0x4000)||!(flags&0x2000))){
     const healing=!!(flags&0x4000),message=!!(flags&0x10000000)&&(!healing||h.amount===0);
     if(message)common.image(0x57bb);
     else{for(const ch of String(h.amount))common.image(243700+(healing?5:6)*10-48+ch.charCodeAt(0));if(flags&2)common.image(0x57b6);}
    }
   }
   for(const h of plan.hits)if((h.target!==plan.principal||plan.category===73)&&!(h.flags&0x108)){
    const multi=plan.variant===2,skip=multi?0x8000:0x48000,heal=multi?0x4000:0x24000,suppress=multi?0x2000:0x12000;
    if(h.flags&skip)continue;const healing=!!(h.flags&heal);if(!healing&&(h.flags&suppress))continue;
    if(h.flags&0x10000000)common.image(0x57bb);
    else{for(const ch of String(h.amount))common.image(243700+(healing?5:6)*10-48+ch.charCodeAt(0));if(h.flags&2)common.image(0x57b6);}
   }
   return Object.freeze({kind:'physical-family-supported'});
  }});
}

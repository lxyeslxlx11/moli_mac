/** Fixed37c4 physical guard callbacks4/27/34/42/71/73/113 and41b640 charge completion. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
const f=Math.fround,types=new Set([4,27,34,42,71,73,113,119,120,121]);
const guardHandoffs=new WeakMap(),followingByBody=new WeakMap(),earlyReceives=new WeakMap();
const nestedTail=[0,24,72,39,73,78,71,72,232];
const protectedTail=[0,27,71,72,62,1];
const matches=(body,index,actions)=>actions.every((action,offset)=>body.actions[index+offset]===action);
const atIdleAttackHead=body=>body.state===0&&body.actionRead===0&&body.tupleRead===0&&body.actions[0]===24;
export function clearPhysicalGuardHandoff(body){guardHandoffs.delete(body);followingByBody.delete(body);earlyReceives.delete(body);}
function addHandoff(guard,handoff){
 const existing=guardHandoffs.get(guard);
 if(existing?.[0]?.owner===handoff.owner)existing.push(handoff);
 else guardHandoffs.set(guard,[handoff]);
}

export function queuePhysicalGuardHandoffs(plan,get,lateReceivers=[]){
 for(const body of lateReceivers)earlyReceives.set(body,{owner:body.owner,claim:null,delivered:false});
 const locate=slot=>{
  const body=get(slot),row=plan.rows.find(entry=>entry.slot===slot);
  return {body,action:body.actionWrite+1-row.actions.length,tuple:body.tupleWrite-row.tuples.length};
 };
 for(const link of plan.guardHandoffs){
  const caster=locate(link.caster),guard=locate(link.guard),protectedRow=locate(link.protectedSlot),departure=link.departure;
  addHandoff(guard.body,{
   active:false,
   caster:caster.body,owner:caster.body.owner,wait:caster.action+link.wait,release:guard.action+link.release,
   tuple:guard.tuple+link.guardTuple,returnTuple:guard.tuple+link.returnTuple,
   returnAction:link.returnAction===undefined?undefined:guard.action+link.returnAction,
   resultWait:link.resultWait===undefined?undefined:guard.action+link.resultWait,
   earlyReturn:link.earlyReturn,
   previousProtectedStand:link.previousProtectedStand===undefined?undefined:protectedRow.action+link.previousProtectedStand,
   slot:link.protectedSlot,protectedBody:protectedRow.body,
   protectedWait:{action:protectedRow.action+link.protectedAction,tuple:protectedRow.tuple+link.protectedTuple},
   turn:link.turn&&{slot:link.turn.slot,body:get(link.turn.slot),tuple:guard.tuple+link.turn.tuple},
   departure:departure&&{guardSlot:link.guard,action:caster.action+departure.action,type:departure.type,
    targets:departure.targets.map(index=>caster.tuple+index)},
  });
 }
 for(const next of plan.followingStrikes??[]){
  const attacker=locate(next.actor),recipient=locate(next.slot),owner=attacker.body.owner;
  let queue=followingByBody.get(attacker.body);
  if(queue?.owner!==owner){
   queue={owner,strikes:[]};
   followingByBody.set(attacker.body,queue);
  }
  queue.strikes.push({attacker:attacker.body,slot:next.slot,body:recipient.body,wait:recipient.action+next.wait,actions:next.recipientActions,
   action:attacker.action+next.action,resultAction:attacker.action+next.resultAction,last:attacker.action+next.last,
   tuple:attacker.tuple+next.tuple,tupleEnd:attacker.tuple+next.tupleEnd});
 }
}

function claimEarlyReceive(strike,owner){
 const body=strike.body,receipt=earlyReceives.get(body);
 if(!receipt||receipt.owner!==owner||receipt.delivered||!atIdleAttackHead(body)||(body.dynamicFlags&2)||
  !matches(body,strike.wait,strike.actions))return false;
 receipt.claim??=strike;
 return receipt.claim===strike;
}

export function recordEarlyPhysicalReceive(attacker,recipient){
 const receipt=earlyReceives.get(recipient),strike=receipt?.claim;
 if(strike?.attacker===attacker&&receipt.owner===attacker.owner&&recipient.owner===receipt.owner&&
  attacker.actionRead===strike.resultAction&&attacker.tupleRead===strike.tupleEnd&&atIdleAttackHead(recipient))receipt.delivered=true;
}

export function cancelUnstartedPhysicalReceive(body,get,pop){
 const receipt=earlyReceives.get(body);
 if(receipt&&receipt.owner===body.owner&&!receipt.delivered&&atIdleAttackHead(body))
  departPhysicalGuardHandoff(body,get,pop);
}

export function waitsForSharedGuardResult(caster,guard){
 return guardHandoffs.get(guard)?.some(link=>link.active&&link.resultWait!==undefined&&
  link.caster===caster&&link.owner===caster.owner&&link.owner===guard.owner&&
  caster.actionRead===link.departure.action&&caster.tupleRead===link.departure.targets[1]&&guard.actionRead<link.resultWait);
}

export function departPhysicalGuardHandoff(guard,get,pop){
 const handoffs=guardHandoffs.get(guard),queue=followingByBody.get(guard);
 clearPhysicalGuardHandoff(guard);
 if(queue?.owner===guard.owner)for(const strike of queue.strikes){
  const {body,slot,wait,actions}=strike,receipt=earlyReceives.get(body);
  if(receipt?.claim===strike){
   if(receipt.delivered)continue;
   receipt.claim=null;
  }
  if(get(slot)===body&&body.owner===queue.owner&&body.actionRead<=wait&&matches(body,wait,actions)){
   // The attacker can no longer trigger this strike. Preserve any earlier actions.
   if(body.actionRead<wait)body.actions.fill(62,wait,wait+actions.length);
   else if(body.state===0){body.frozen=0;body.actionRead=wait+actions.length-1;pop(body);}
  }
 }
 for(const handoff of handoffs??[]){
  const {caster,owner,wait,protectedBody,protectedWait,departure}=handoff;
  if(!departure||guard.owner!==owner)continue;
  if(get(caster.slot)===caster&&caster.owner===owner&&caster.actionRead<=departure.action&&caster.actions[departure.action]===departure.type){
   // Preserve the tuple positions while invalidating only the departed actor's references.
   for(const index of departure.targets){
    if(caster.tupleRead<=index&&caster.tuples[index*4]===departure.guardSlot)caster.tuples[index*4]=-1;
   }
   if(caster.actionRead===wait&&caster.state===0)pop(caster);
   else if(caster.actionRead<wait&&caster.actions[wait]===0)caster.actions[wait]=62;
  }
  if(!protectedWait||get(protectedBody.slot)!==protectedBody||protectedBody.owner!==owner)continue;
  const {action,tuple}=protectedWait,end=action+protectedTail.length-1;
  if(!matches(protectedBody,action,protectedTail))continue;
  if(protectedBody.actionRead<action){
   // Preserve the actions already ahead of the handoff and consume its tuple at 72.
   protectedBody.actions.set([62,62,62,72,62,62],action);
   continue;
  }
  if(protectedBody.actionRead>end||protectedBody.state!==protectedBody.actions[protectedBody.actionRead])continue;
  // The protected body's last 1 would otherwise wait for the departed guard.
  if(protectedBody.tupleRead===tuple)protectedBody.tupleRead++;
  protectedBody.reactionCounter=0;
  protectedBody.counter=0;
  protectedBody.speed=4;
  protectedBody.speedPercent=100;
  protectedBody.actionRead=end;
  pop(protectedBody);
 }
}

export function createBattlePhysicalGuardPlayback(a,c,common){
 const target=b=>a.get(b.tuples[b.tupleRead*4]);
 const departed=(entry,owner)=>a.get(entry.slot)!==entry.body||entry.body.owner!==owner;
 function rememberHandoff(caster,guard){
  // 423fa0 wakes the guard at 39 and leaves the caster at 0 between 71 and 24.
  const wait=caster.actionRead,release=guard.actionRead+8;
  if(caster.state!==0||caster.actions[wait-2]!==24||caster.actions[wait+1]!==24)return;
  if(guard.state!==39||guard.owner!==caster.owner||
   guard.actions[release-2]!==4||guard.actions[release-1]!==42||guard.actions[release]!==71)return;
  const queued=guardHandoffs.get(guard)?.find(h=>h.caster===caster&&h.owner===caster.owner&&
   h.wait===wait&&h.release===release&&h.tuple===guard.tupleRead);
  if(queued){
   queued.active=true;
   return;
  }
  const protectedBody=target(guard),casterTuple=caster.tupleRead;
  let departure,protectedWait;
  if(matches(caster,wait,nestedTail)&&caster.tuples[(casterTuple+2)*4]===guard.slot){
   protectedWait=protectedBody&&protectedBody.owner===caster.owner&&protectedBody.state===0&&
    matches(protectedBody,protectedBody.actionRead,protectedTail)&&
    protectedBody.tuples[protectedBody.tupleRead*4]===caster.slot
    ?{action:protectedBody.actionRead,tuple:protectedBody.tupleRead}:null;
   departure={guardSlot:guard.slot,action:wait+nestedTail.length-1,type:232,targets:[casterTuple,casterTuple+2]};
  }
  addHandoff(guard,{active:true,caster,wait,release,owner:caster.owner,tuple:guard.tupleRead,returnTuple:guard.tupleRead+1,
   slot:guard.tuples[guard.tupleRead*4],protectedBody,protectedWait,departure});
 }
 function protectedTarget(body,handoff){
  const other=target(body);
  if(!handoff||body.tuples[body.tupleRead*4]!==handoff.slot)return other;
  return other===handoff.protectedBody?other:null;
 }
 return Object.freeze({
  validate(plan){for(const row of plan.rows)if(row.actions.includes(67)&&row.assignments.messageResource!==undefined)common.image(row.assignments.messageResource);return Object.freeze({kind:'physical-family-supported'});},
  body(node,ctx){const b=node.body,type=b.state;let handoffs=guardHandoffs.get(b);
   const receipt=earlyReceives.get(b);
   if(receipt&&(receipt.owner!==b.owner||type===231))earlyReceives.delete(b);
   else if(receipt?.delivered&&type===0&&b.actionRead===receipt.claim.wait&&matches(b,b.actionRead,receipt.claim.actions)){
    // The hit advanced the idle head earlier. Release its own wait when
    // this body reaches it, keeping its queued reaction and return.
    earlyReceives.delete(b);a.pop(b);a.screen(node);return true;
   }
   if(handoffs&&(type===231||b.owner!==handoffs[0].owner)){
    handoffs=type===231?handoffs.filter(h=>!h.active&&h.owner===b.owner):[];
    if(handoffs.length)guardHandoffs.set(b,handoffs);else guardHandoffs.delete(b);
   }
   const turn=type===3&&handoffs?.find(link=>link.turn?.tuple===b.tupleRead)?.turn;
   if(turn&&a.get(turn.slot)!==turn.body){a.pop(b);a.screen(node);return true;}
   const queue=followingByBody.get(b);
   if(queue&&(queue.owner!==b.owner||type===231))followingByBody.delete(b);
   const following=queue?.owner===b.owner&&!atIdleAttackHead(b)&&queue.strikes.find(next=>
    b.tupleRead>=next.tuple&&b.tupleRead<=next.tupleEnd&&b.actionRead>=next.action&&b.actionRead<=next.last);
   if(following){
    const starting=type===24&&b.actionRead===following.action;
    if(departed(following,b.owner)||starting&&following.body.actionRead>following.wait){
     // Skip the full result, including its inline RIDs and any queued reflection.
     if(node.guardCharge){node.guardCharge.deleted=true;delete node.guardCharge;}
     b.actionRead=following.last;b.tupleRead=following.tupleEnd+1;
     b.frozen=b.skillStatus=b.attackCooldown=b.attackFinishCounter=0;
     node.player.clearSignal();a.pop(b);a.screen(node);return true;
    }
    if(starting&&following.body.actionRead<following.wait&&!claimEarlyReceive(following,b.owner)){
     // A zero state may still belong to a different strike against this body.
     b.animationAction=0;if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
     a.screen(node);return true;
    }
    // A RID resource change can restart the animation after the result was delivered.
    if(type===14&&b.actionRead===following.resultAction&&following.tuple<following.tupleEnd&&
     b.tupleRead===following.tupleEnd&&node.player.copyState().signal>=10000)node.player.clearSignal();
   }
   const handoff=handoffs?.find(h=>h.active&&(b.tupleRead===h.tuple||b.tupleRead===h.returnTuple));
   if(!types.has(type)||!b.physicalFamily&&(type<119||type>121))return false;
   if(type===4){const other=protectedTarget(b,handoff);if(!other)a.pop(b);
    else if(handoff?.previousProtectedStand!==undefined&&b.actionRead===handoff.release-2&&other.owner===handoff.owner&&
     other.actionRead<handoff.protectedWait.action){
     // Finish the first return before starting a second approach to the same body.
     if(other.state===1&&other.actionRead===handoff.previousProtectedStand)a.pop(other);
    }
    else{b.animationAction=3;b.speed=8;b.speedPercent=100;a.aim(b,other.position,true);if(a.distance(b,other.position)>=8)a.move(b);else a.pop(b);a.animate(node,0,ctx.mainState);}}
   else if(type===27){
    b.animationAction=8;if(b.reactionCounter===0)a.sound(node,0x84);b.speedPercent=50;const count=++b.reactionCounter;
    if(count<14){b.speed=5;b.angle=f(b.angle+180);if(b.angle>=360)b.angle=f(b.angle-360);a.move(b);}
    else if(count<34){if(count===14){b.speed=5;b.counter=0;}if(b.counter===0)a.reactionPuff(node);const before=b.counter++;if(before>1)b.counter=0;b.speed=Math.max(0,f(b.speed-f(.3)));a.move(b);}
    else if(count>53){b.reactionCounter=0;b.speed=4;b.speedPercent=100;a.pop(b);}
    a.animate(node,1,ctx.mainState);
   }else if(type===34){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(++b.counter>=30){b.counter=0;a.pop(b);}}
   else if(type===42){const other=protectedTarget(b,handoff);if(other)a.aim(other,b.position,true);a.pop(b);}
   else if(type===71){
    const other=protectedTarget(b,handoff);
    const returning=other&&b.actionRead===handoff?.returnAction&&b.tupleRead===handoff.returnTuple&&other.owner===handoff.owner;
    if(returning&&
     other.state===62&&other.actionRead===handoff.protectedWait.action+4&&other.actions[other.actionRead+1]===1){
     // Let the protected body enter its own action 1 before the final release.
     a.screen(node);
     return true;
    }
    if(other){
     if(!(returning&&handoff.earlyReturn&&other.actionRead>handoff.protectedWait.action+5))a.pop(other);
    }else if(handoff?.release===b.actionRead){
     // A departed protected body cannot run its own 71 to wake this caster.
     const {caster,wait,owner}=handoff;
     if(a.get(caster.slot)===caster&&caster.owner===owner&&caster.state===0&&caster.actionRead===wait)a.pop(caster);
    }
    a.pop(b);
    if(other)rememberHandoff(b,other);
   }
   else if(type===73){b.afterImageEnabled=1;a.pop(b);}
   else if(type>=119&&type<=121){
    if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
    if(b.skillStatus===0){a.allocate('physical-result-charge',null,{parent:node,position:[b.position[0],f(b.position[1]+Math.trunc(node.player.copyState().drawOffsetY/2))],screenSpace:true,resourceId:0x1ae1d+(type-119)*8,
     actorFlags:c.alternativeRenderer?0x140000:0x48000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});b.skillStatus=1;}b.state=157;
   }else{
    b.animationAction=5;a.animate(node,1,ctx.mainState);
    if(b.skillStatus===0){const other=target(b),kind=(b.tuples[b.tupleRead*4+1]&0x1000)?3:0;if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');
     node.guardCharge=a.allocate('physical-guard-charge',null,{parent:node,position:[b.position[0],f(b.position[1]-32)],screenSpace:true,resourceId:kind===3?0x1ae49:0x1adb9,
      actorFlags:0x40000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});b.skillStatus=1;other.frozen=b.frozen=1;
    }b.state=157;
   }a.screen(node);return true;
  },
  effect(node,ctx){if(node.kind!=='physical-guard-charge'&&node.kind!=='physical-result-charge')return false;
   if(a.animate(node,1,ctx.mainState)===1){
    const parent=node.parent,guardCharge=node.kind==='physical-guard-charge',ownsCharge=!guardCharge||parent?.guardCharge===node;
    if(guardCharge&&ownsCharge)delete parent.guardCharge;
    if(parent&&!parent.deleted&&ownsCharge&&parent.body.skillStatus!==0)parent.body.skillStatus=2;
    node.deleted=true;
   }
   a.screen(node);return true;
  },
 });
}

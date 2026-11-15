/** Fixed37c4 4236d0 and body221:logical object handoff,not in-place C assignment. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout}from'./legacy-game-battle-data.mjs';
import{battleIntegerBox,battleIntegerBoxSnapshot}from'./legacy-game-battle-integer-box.mjs';
import{cancelUnstartedPhysicalReceive}from'./legacy-game-battle-physical-guard-playback.mjs';
export function createBattleAttachedRIDPlayback(a,c){
 let used=false;const handoffs=[];
 function validate(plan,primary){
  const actions=new Map(),tuples=new Map(),resets=new Set();
  const sources=primary.position?.slotSources,bodyAt=slot=>a.get(sources?.[slot]??slot);
  for(const r of primary.rows){
   const slot=sources?sources.indexOf(r.slot):r.slot;
   actions.set(slot,r.actions.length);tuples.set(slot,r.tuples.length);if(r.reset)resets.add(slot);
  }
  if(a.count()+plan.records.length*3>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
  for(const r of plan.records){const slot=r.first.slot,node=a.node(bodyAt(slot)),rider=node?.children.get('rider');
   if(!node||!rider||rider.deleted||!a.present(rider))return{kind:'attached-rid-unavailable',reason:'attached-rid-rider-context'};
   actions.set(slot,(actions.get(slot)??0)+1);tuples.set(slot,(tuples.get(slot)??0)+1);
   for(const resource of[r.first.resourceId,r.second.resourceId,...(r.first.attachmentResource>0?[r.first.attachmentResource]:[])])a.probe(resource);
  }
  for(const[s,n]of actions)if((resets.has(s)?-1:bodyAt(s).actionWrite)+n>198)fail('LEGACY_BATTLE_BODY_CAPACITY');
  for(const[s,n]of tuples)if((resets.has(s)?0:bodyAt(s).tupleWrite)+n>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
  return{kind:'attached-rid-supported'};
 }
 function birth(row,origin,owner,local,following=true){const b=a.createReplacement(row.slot),node=a.allocate('body',b,{callbackDisabled:true,ridCreated:true});a.animate(node,0,10);
  Object.assign(b,{nameBytes:row.name.slice(),resourceId:row.resourceId,value1d0:row.value1d0,vitals:[...row.vitals],rawStatusFlags:row.flags,dynamicFlags:row.flags,savedFlags:0,position:[...layout[origin].target],actionWrite:-1});node.screen=[...layout[origin].target];
  const boxes=row.vitals.map(v=>battleIntegerBoxSnapshot(battleIntegerBox(v,c.random)));a.birthMetadata(b,row.flags,local);b.actorFlags|=2;
  if(following){b.speed=row.flags&2?4:5;a.append(b,owner,row.flags&2?[11,38,44]:[7,11,10]);}
  else if(row.flags&2)a.append(b,owner,[44]);
  return{body:b,node,boxes};
 }
 function pair(container,parent,rider,first,second,row){used=true;const h={container,parent,rider,first:first.body,second:second.body,firstId:first.node.id,secondId:second.node.id,a:row.first.slot,b:row.second.slot,extra:row.first.attachmentResource,birthIntegerBoxes:[...first.boxes,...second.boxes],complete:false};handoffs.push(h);container.ridPair=h;parent.shared105c=container;return h;}
 function queue(plan,owner){used=true;
  for(const row of plan.records){const parent=a.node(a.get(row.first.slot)),rider=parent.children.get('rider'),first=birth(row.first,row.first.slot,owner,plan.localSlot);
   const previousPresentation=rider.ridPresentation;
   const presentation={nameBytes:row.first.name.slice(),value1d0:row.first.value1d0,vitals:[...row.first.vitals]};
   rider.ridPresentation=presentation;
   rider.position=[Math.fround(parent.body.position[0]+parent.player.copyState().attachmentX),parent.body.position[1]];
   const second=birth(row.second,row.first.slot,owner,plan.localSlot),container=a.allocate('attached-rid-handoff',null,{callbackDisabled:true,drawPriority:0});
   const h=pair(container,parent,rider,first,second,row);
   h.previousPresentation=previousPresentation;
   h.presentation=presentation;
   const b=parent.body,tupleIndex=b.tupleWrite;
   a.append(b,owner,[221]);
   const at=b.tupleWrite++*4;
   b.tuples.set(row.tuple,at);
   b.tuples[at+4]=-1;
   h.queued={owner,actionIndex:b.actionWrite,tupleIndex};
   const core=plan.core;
   if(core.classCode>=19&&core.classCode<=31&&core.principalSlot===h.a&&
     b.actions[b.actionWrite-2]===135&&b.actions[b.actionWrite-1]===62&&at>=4&&b.tuples[at-4]===-1){
    h.castTail={empty:core.fields.length===5};
   }
  }
 }
 function matchesQueuedRow(body,h){
  const tail=h.queued;
  if(!tail)return false;
  const at=tail.tupleIndex*4;
  return body.owner===tail.owner&&body.actionRead===tail.actionIndex&&body.actions[tail.actionIndex]===221&&
   tail.tupleIndex<body.tupleWrite&&body.tuples[at]===h.a&&body.tuples[at+1]===0&&
   body.tuples[at+2]===h.a&&body.tuples[at+3]===h.b;
 }
 function alignCastTail(body,h){
  const tail=h.queued;
  if(!h.castTail||!h.second)return;
  const read=body.tupleRead,index=tail.tupleIndex;
  // The completion branch of 135 stops on a terminator. With an empty
  // target list its first increment reaches the RID row before stopping.
  const onTerminator=(read===index-1||(h.castTail.empty&&read===index+1))&&body.tuples[read*4]===-1;
  if((read!==index&&!onTerminator)||!matchesQueuedRow(body,h))
   fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');
  if(onTerminator)body.tupleRead=index;
 }
 function suspendRider(node,rider){
  const h=node.shared105c?.ridPair;
  if(!h?.queued||!h.second||h.container.deleted||h.rider!==rider||
    h.container.kind!=='attached-rid-handoff'||node.body.owner!==h.queued.owner||a.get(h.a)!==node.body)
   return false;
  h.suspendedRider={node:rider,actorFlags:rider.actorFlags,callbackDisabled:rider.callbackDisabled};
  node.children.delete('rider');
  rider.callbackDisabled=true;
  rider.actorFlags|=2;
  return true;
 }
 function resumeRider(node){
  const h=node.shared105c?.ridPair,saved=h?.suspendedRider;
  if(!saved)return null;
  if(!h.second||h.container.deleted||!a.present(saved.node)||
    node.body.owner!==h.queued.owner||a.get(h.a)!==node.body)
   fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');
  saved.node.actorFlags=saved.actorFlags;
  saved.node.callbackDisabled=saved.callbackDisabled;
  node.children.set('rider',saved.node);
  delete h.suspendedRider;
  return saved.node;
 }
 function discardPrepared(node,retiring=true){
  const current=node?.shared105c?.ridPair;
  if(!current||current.container.kind!=='attached-rid-handoff'||(!retiring&&!current.second))return;
  for(let i=handoffs.length-1;i>=0;i--){
   const h=handoffs[i];
   if(h.parent!==node||!h.first||h.container.kind!=='attached-rid-handoff'||(!retiring&&!h.second))continue;
   a.markDeleted(h.first);
   if(h.second)a.markDeleted(h.second);
   if(h.suspendedRider)h.suspendedRider.node.deleted=true;
   if(!retiring&&h.rider.ridPresentation===h.presentation){
    if(h.previousPresentation)h.rider.ridPresentation=h.previousPresentation;
    else delete h.rider.ridPresentation;
   }
   h.container.deleted=true;delete h.container.ridPair;
   handoffs.splice(i,1);
  }
  node.shared105c=null;
 }
 function land(node,h,rider,sa,sb){
  const previous=a.get(sa);
  if(previous)a.markDeleted(previous);
  const first=h.first;
  a.replace(sa,first);
  const firstNode=a.node(first);
  firstNode.callbackDisabled=false;
  first.actorFlags&=~2;
  first.position=[...node.body.position];
  a.removeChild(firstNode,'attachment');
  if(h.extra>0){
   a.attachment(firstNode,h.extra);
   first.linkedResources[1]=h.extra;
  }
  h.first=null;
  a.reface(first);
  a.animate(firstNode,0,10);
  first.state=first.actions[first.actionRead];
  rider.state=rider.counter=0;
  rider.deleted=true;
  node.children.delete('rider');
  h.container.deleted=true;
  node.shared105c=null;
  a.restoreFlags(firstNode);
  const second=sb===null?null:a.get(sb);
  if(second)a.restoreFlags(a.node(second));
  a.sound(firstNode,0x1c9,sa);
  if(second)second.state=second.actions[second.actionRead];
  a.markDeleted(node.body);
  h.complete=true;
 }
 function body(node){const b0=node.body,h=node.shared105c?.ridPair,type=b0.state;
  if(node.children.get('rider')&&node.shared105c&&!h&&[11,44].includes(type)&&node.shared105c.sharedDataKind!=='RID-record16')fail('LEGACY_BATTLE_SHARED_DATA_CONTEXT');
  if((h||node.ridCreated)&&type===44&&(b0.dynamicFlags&0x10000000)){b0.counter=44;b0.state=159;return true;}
  if(h&&node.children.get('rider')&&!h.container.deleted&&[11,44].includes(type)&&((h.first?.dynamicFlags??0)|(h.second?.dynamicFlags??0))&2){a.pop(b0);if(b0.state===44)a.pop(b0);return true;}
  if(type!==221)return false;if(!h||h.container.deleted||!h.first)fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');
  alignCastTail(b0,h);
  const at=b0.tupleRead*4,sa=b0.tuples[at+2],sb=b0.tuples[at+3];if(sa<0||sa>21||sb<0||sb>21)fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');h.lastReadSlots=[sa,sb];
  let rider=node.children.get('rider');
  if(!rider&&h.suspendedRider){
   if(!matchesQueuedRow(b0,h)||b0.tupleRead!==h.queued.tupleIndex)
    fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');
   rider=resumeRider(node);
  }
  if(!rider||!a.present(rider))fail('LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED');
  if(rider.counter===0){const second=h.second;if(!second)fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');const previous=a.get(sb);a.replace(sb,second);
   // The replaced body stays in the pool but an unstarted queue can no longer receive its trigger.
   cancelUnstartedPhysicalReceive(previous,a.get,a.pop);
   const n=a.node(second);n.callbackDisabled=false;second.state=1;second.actorFlags&=~2;second.position=[...node.body.position];h.second=null;
   node.ridGraphicMissing=true;for(const key of['shadow','status','special','indicator','attachment'])a.removeChild(node,key);a.reface(second);rider.facing=second.facing;a.sound(rider,0x1cf,sa);
  }
  const second=a.get(sb),secondNode=a.node(second);
  if(!secondNode){
   if(second||h.second||h.container.kind!=='attached-rid-handoff'||sa!==h.a||sb!==h.b)
    fail('LEGACY_BATTLE_ATTACHED_RID_BODY_REMOVED');
   if(a.get(sa)===b0)land(node,h,rider,sa,null);
   else{
    if(a.get(b0.slot)===b0)fail('LEGACY_BATTLE_ATTACHED_RID_CONTEXT');
    discardPrepared(node);
    a.removeChild(node,'rider');
    a.markDeleted(b0);
   }
   return true;
  }
  node.body.animationAction=3;rider.state=1;rider.action=8;rider.actorFlags|=0x14;rider.screen=second.position.map((p,i)=>(Math.trunc(p)+c.screenOffset[i])|0);
  a.animate(secondNode,0,10);const y=(Math.trunc((Math.imul(rider.counter,rider.counter)|0)/5)+secondNode.player.copyState().attachmentY)|0;rider.screen[1]=(rider.screen[1]+y)|0;rider.counter=(rider.counter+1)|0;
  if(y>=0)land(node,h,rider,sa,sb);
  else a.animate(rider,0,10);
  return true;
 }
 return Object.freeze({validate,queue,body,discardPrepared,suspendRider,resumeRider,birthStandalone:(row,origin,owner,local)=>birth(row,origin,owner,local,false),bindPair:pair,snapshot(){return used?Object.freeze({handoffs:Object.freeze(handoffs.map(h=>Object.freeze({id:h.container.id,sourceId:h.parent.id,firstId:h.firstId,secondId:h.secondId,firstPointer:h.first?a.node(h.first)?.id??null:null,secondPointer:h.second?a.node(h.second)?.id??null:null,slots:Object.freeze([h.a,h.b]),lastReadSlots:h.lastReadSlots?Object.freeze([...h.lastReadSlots]):null,extraResource:h.extra,complete:h.complete,containerDeleted:h.container.deleted,birthIntegerBoxes:Object.freeze(h.birthIntegerBoxes),...(h.suspendedRider?{suspendedRiderId:h.suspendedRider.node.id}:{})}))),registry:Object.freeze(Array.from({length:22},(_,i)=>a.node(a.get(i))?.id??null)),bodies:Object.freeze(a.allBodies().map(n=>Object.freeze({id:n.id,callbackEnabled:!n.callbackDisabled,body:a.copyBody(n.body)})))}):null;},clear(){used=false;handoffs.length=0;}});
}

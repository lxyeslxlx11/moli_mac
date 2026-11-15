/** Native RID219/220 and shared105c ownership. Logical IDs are not native addresses. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout}from'./legacy-game-battle-data.mjs';
import{resolveLegacyGameMountedResource}from'./legacy-game-actor-ride.mjs';
import{battleIntegerBox,battleIntegerBoxSnapshot}from'./legacy-game-battle-integer-box.mjs';
const f=Math.fround;
export function createBattleRidingPlayback(a,c){let used=false;const records=[];
 const point=n=>n.body?n.body.position:n.position,actor=n=>n.body??n;
 const tuple=b=>{const at=b.tupleRead*4;return Array.from(b.tuples.slice(at,at+4));};
 const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');b.tupleRead++;};
 const node=b=>{const n=a.node(b);if(!n)fail('LEGACY_BATTLE_RIDING_BODY_REMOVED');return n;};
 const registered=s=>{const b=a.get(s);if(!b)fail('LEGACY_BATTLE_RIDING_BODY_REMOVED');return node(b);};
 const screen=n=>{n.screen=point(n).map((p,i)=>(Math.trunc(p)+c.screenOffset[i])|0);};
 const aim=(n,p)=>a.aim(actor(n),p,true),move=n=>a.move(actor(n)),distance=(n,p)=>a.distance(actor(n),p);
 const name=n=>n.body?.nameBytes??n.ridPresentation?.nameBytes??new Uint8Array();
 const vitals=n=>n.body?.vitals??n.ridPresentation?.vitals??[0,0,0,0];
 const value=n=>n.body?.value1d0??n.ridPresentation?.value1d0??0;
 function appearance(target,source){const data={nameBytes:name(source).slice(),value1d0:value(source),vitals:[...vitals(source)]};if(target.body)Object.assign(target.body,data);else target.ridPresentation=data;}
 function cleanup(n){for(const key of['special','status','shadow','indicator','attachment'])a.removeChild(n,key);}
 function drop(s){const b=a.get(s);if(b){a.markDeleted(b);a.replace(s,null);}}
 function enable(s,b){a.replace(s,b);const n=node(b);n.callbackDisabled=false;b.actorFlags&=~2;return n;}
 function restart(b){b.state=b.actions[b.actionRead];}
 function pair(n){const h=n.shared105c?.ridPair;if(!h||h.container.deleted)fail('LEGACY_BATTLE_RIDING_PAIR_CONTEXT');return h;}
 function rider(n){const r=n.children.get('rider');if(!r||!a.present(r))fail('LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED');return r;}
 function meta(n){const m=n.shared105c;if(!m||!a.present(m))fail('LEGACY_BATTLE_RIDING_STORAGE');return m;}
 function metadata(row,position){const m=a.allocate('riding-metadata',null,{callbackDisabled:true,manualScreen:true,drawPriority:0,sharedDataKind:row?'RID-record16':null,position:[...position],screen:[0,0],resourceId:row?.resourceId??0});
  if(row){m.ridPresentation={nameBytes:row.name.slice(),value1d0:row.value1d0,vitals:[...row.vitals]};m.ridingFlags=row.flags;m.attachmentResource=row.attachmentResource;m.birthIntegerBoxes=row.vitals.map(v=>battleIntegerBoxSnapshot(battleIntegerBox(v,c.random)));}records.push(m);return m;}
 function createRider(n,resource){a.rider(n,resource,n.body.resourceId);return rider(n);}
 function finishPair(n,h,r){r.state=r.counter=0;r.deleted=true;n.children.delete('rider');h.container.deleted=true;n.shared105c=null;h.complete=true;}
 function split(n,ctx){const b=n.body,h=pair(n),r=rider(n),t=tuple(b),sa=t[2],sb=t[3];if(!layout[sa]||!layout[sb]||!h.first||!h.second)fail('LEGACY_BATTLE_RIDING_PAIR_CONTEXT');h.lastReadSlots=[sa,sb];
  b.animationAction=3;b.speed=8;if(distance(n,layout[sb].target)<5){b.position=[...layout[sb].target];a.reface(b);b.animationAction=0;}else{aim(n,layout[sb].target);move(n);}
  r.state=1;r.action=11;r.actorFlags|=0x14;
  if(distance(r,layout[sa].target)<5)r.position=[...layout[sa].target];else{aim(r,layout[sa].target);move(r);}
  if(r.counter===0){cleanup(n);appearance(n,node(h.second));r.facing=b.facing;const y=n.player.copyState().attachmentY;while(r.counter<15&&y<Math.imul(r.counter-15,r.counter-15)-225)r.counter++;a.sound(r,0x1cf,sa);}
  screen(r);const dy=(Math.imul(r.counter-15,r.counter-15)-225)|0;r.screen[1]=(r.screen[1]+dy)|0;a.animate(n,0,ctx.mainState);const previous=r.counter;r.counter=(r.counter+1)|0;
  if(previous>=16&&dy>=0){drop(sb);const second=h.second,secondNode=enable(sb,second);h.second=null;a.restoreFlags(secondNode);a.reface(second);a.animate(secondNode,0,ctx.mainState);restart(second);
   drop(sa);const first=h.first,firstNode=enable(sa,first);h.first=null;a.removeChild(firstNode,'attachment');if(h.extra>0){a.attachment(firstNode,h.extra);first.linkedResources[1]=h.extra;}a.restoreFlags(firstNode);a.reface(first);a.animate(firstNode,0,ctx.mainState);restart(first);
   finishPair(n,h,r);a.sound(firstNode,0x1c9,sa);advance(b);a.pop(b);
  }else a.animate(r,0,ctx.mainState);
  return true;
 }
 function merge(n,ctx){const b=n.body,m=meta(n),t=tuple(b),destination=t[0],original=t[2],target=t[3];if(!layout[destination]||!layout[original]||!layout[target]||!m.ridPresentation)fail('LEGACY_BATTLE_RIDING_METADATA_CONTEXT');
  let r=n.children.get('rider');
  if(!r){r=createRider(n,m.resourceId);r.state=1;r.counter=0;r.action=11;const old=registered(original),next=registered(target);appearance(r,old);r.position=[...point(old)];screen(r);r.actorFlags|=0x14;
   appearance(n,next);b.resourceId=actor(next).resourceId;b.animationAction=0;b.position=[...point(next)];cleanup(old);cleanup(next);a.reface(b);a.animate(n,0,ctx.mainState);m.ridingOffsetX=n.player.copyState().attachmentX;
   if(distance(n,m.position)<5){b.position=[...m.position];a.reface(b);b.animationAction=0;}else aim(n,m.position);
   aim(r,[f(m.position[0]+m.ridingOffsetX),m.position[1]]);b.speed=r.speed=8;a.animate(n,0,ctx.mainState);a.animate(r,0,ctx.mainState);drop(target);a.sound(r,0x1d1,original);return true;
  }
  b.animationAction=3;if(distance(n,m.position)<5){b.position=[...m.position];a.reface(b);b.animationAction=0;}else move(n);a.animate(n,0,ctx.mainState);r.action=11;
  const p=[f(m.position[0]+(m.ridingOffsetX??0)),m.position[1]];if(distance(r,p)<5)r.position=p;else move(r);screen(r);
  const dy=(Math.imul(r.counter-15,r.counter-15)-225)|0;r.screen[1]=(r.screen[1]+dy)|0;const previous=r.counter;r.counter=(r.counter+1)|0;
  if(previous>=16&&n.player.copyState().attachmentY<=dy){r.state=r.counter=0;r.actorFlags&=~0x14;b.resourceId=m.resourceId;b.animationAction=0;appearance(n,m);b.dynamicFlags=m.ridingFlags;b.savedFlags=0;b.position=[...m.position];a.removeChild(n,'attachment');if(m.attachmentResource>0){a.attachment(n,m.attachmentResource);b.linkedResources[1]=m.attachmentResource;}
   if(destination!==original){drop(target);drop(destination);const moved=a.get(original);if(!moved)fail('LEGACY_BATTLE_RIDING_BODY_REMOVED');a.replace(destination,moved);a.replace(original,null);b.slot=destination;delete b.formationSlot;n.priority=destination*10+2;b.position=[...layout[destination].target];b.rememberedPosition=[...layout[destination].target];a.localSlotMoved(original,target,destination,ctx);}
   a.restoreFlags(n);a.birthMetadata(b,b.dynamicFlags,ctx.localSlot);a.reface(b);m.deleted=true;n.shared105c=null;a.sound(r,0x1ce,b.slot);advance(b);a.pop(b);
  }
  if(n.children.has('rider'))a.animate(r,0,ctx.mainState);return true;
 }
 function falling(n,ctx){const b=n.body,h=pair(n),r=rider(n),t=tuple(b),sa=t[2],sb=t[3],variant=t[1];if(!layout[sa]||!layout[sb]||!h.first)fail('LEGACY_BATTLE_RIDING_PAIR_CONTEXT');h.lastReadSlots=[sa,sb];
  if(r.counter===0){if(!h.second)fail('LEGACY_BATTLE_RIDING_PAIR_CONTEXT');const second=h.second,next=enable(sb,second);h.second=null;second.state=0;second.position=[...b.position];next.screen=second.position.map(Math.trunc);a.copyAnimation(n,next);a.restoreFlags(next);restart(second);a.animate(next,0,ctx.mainState);a.publishReplacement(next);n.ridGraphicMissing=true;cleanup(n);a.sound(r,0x1cf,sa);}
  const second=registered(sb);r.state=1;r.action=variant===0?11:8;r.actorFlags|=0x14;screen(r);const dy=variant===0?(Math.imul(r.counter-15,r.counter-15)-225)|0:(Math.trunc((Math.imul(r.counter,r.counter)|0)/5)+second.player.copyState().attachmentY)|0;r.screen[1]=(r.screen[1]+dy)|0;const ready=variant!==0||r.counter>15;r.counter=(r.counter+1)|0;
  if(ready&&dy>=0){drop(sa);const first=h.first,next=enable(sa,first);h.first=null;first.position=[...b.position];next.screen=[...n.screen];first.facing=b.facing;first.speed=6;a.removeChild(next,'attachment');if(h.extra>0){a.attachment(next,h.extra);first.linkedResources[1]=h.extra;}a.animate(next,0,ctx.mainState);restart(first);finishPair(n,h,r);a.restoreFlags(next);a.publishReplacement(next);a.sound(next,0x1c9,sa);a.markDeleted(b);}
  if(n.children.has('rider'))a.animate(r,0,ctx.mainState);return true;
 }
 function returning(n,ctx){const b=n.body,m=meta(n);let r=n.children.get('rider');
  if(!r){b.resource13a8=b.resourceId;r=createRider(n,b.resourceId);r.state=1;r.counter=0;r.action=11;appearance(r,n);r.position=[...b.position];screen(r);r.actorFlags|=0x14;n.ridGraphicMissing=true;a.reface(b);m.ridingOffsetX=n.player.copyState().attachmentX;aim(r,[f(m.position[0]+m.ridingOffsetX),m.position[1]]);r.speed=8;a.animate(r,0,ctx.mainState);a.sound(r,0x1d1,b.slot);return true;}
  r.action=11;const target=[f(m.position[0]+(m.ridingOffsetX??0)),m.position[1]];if(distance(r,target)<5)r.position=target;else move(r);screen(r);const dy=(Math.imul(r.counter-15,r.counter-15)-225)|0;r.screen[1]=(r.screen[1]+dy)|0;const previous=r.counter;r.counter=(r.counter+1)|0;
  if(previous>=16&&n.player.copyState().attachmentY<=dy){r.state=r.counter=0;r.actorFlags&=~0x14;r.deleted=true;n.children.delete('rider');b.position=[...m.position];b.resourceId=b.resource13a8;n.ridGraphicMissing=false;m.deleted=true;n.shared105c=null;screen(n);a.sound(n,0x1ce,b.slot);a.animate(n,0,ctx.mainState);advance(b);a.pop(b);}
  else a.animate(r,0,ctx.mainState);return true;
 }
 return Object.freeze({
  validate(plan){const n=node(a.get(plan.principal));if(plan.mode==='split'&&!n.children.has('rider'))return{kind:'riding-unavailable',reason:'riding-rider-context'};
   if(a.count()+(plan.mode==='split'?3:2)>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');for(const r of[plan.first,plan.second].filter(Boolean))for(const resource of[r.resourceId,...(r.attachmentResource>0?[r.attachmentResource]:[])])a.probe(resource);
   if(plan.mode!=='split'&&!n.children.has('rider'))a.probe(resolveLegacyGameMountedResource(plan.first?.resourceId??n.body.resourceId));return{kind:'riding-supported'};
  },
  queue(plan,owner){used=true;const parent=node(a.get(plan.principal));if(plan.mode==='split'){const container=a.allocate('riding-handoff',null,{callbackDisabled:true,manualScreen:true,drawPriority:0,screen:[0,0]}),first=a.birth(plan.first,plan.principal,owner,plan.localSlot),r=parent.children.get('rider');appearance(r,first.node);r.position=[f(parent.body.position[0]+parent.player.copyState().attachmentX),parent.body.position[1]];const second=a.birth(plan.second,plan.target,owner,plan.localSlot);a.bindPair(container,parent,r,first,second,plan);}
   else parent.shared105c=metadata(plan.mode==='merge'?plan.first:null,layout[plan.principal].target);
  },
  body(n,ctx){if(n.body.state===222)return falling(n,ctx);if(n.body.state===219)return tuple(n.body)[1]===0?split(n,ctx):merge(n,ctx);if(n.body.state===220)return returning(n,ctx);if(n.body.state===56){n.body.animationAction=14;if(a.animate(n,1,ctx.mainState)===1){n.player.resetFrames();a.pop(n.body);}a.screen(n);return true;}return false;},
  snapshot(){return used?Object.freeze({cells:Object.freeze(a.allBodies().map(n=>Object.freeze({bodyId:n.id,body105c:n.shared105c?.id??null,body13b4:n.children.get('rider')?.id??null,actor10:n.children.get('chant')?.id??null}))),metadata:Object.freeze(records.map(m=>Object.freeze({id:m.id,deleted:m.deleted,resourceId:m.resourceId,position:Object.freeze([...m.position]),flags:m.ridingFlags??null,attachmentResource:m.attachmentResource??0,birthIntegerBoxes:Object.freeze(m.birthIntegerBoxes??[])})))}):null;},
  clear(){used=false;records.length=0;}
 });
}

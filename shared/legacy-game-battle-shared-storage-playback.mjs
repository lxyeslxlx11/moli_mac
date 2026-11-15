/** Fixed37c4 shared actor fields and159 element teardown; native backend pixels remain unverified. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{LEGACY_GAME_BATTLE_ELEMENT_FOLLOWER_BASES as elementBases}from'./legacy-game-battle-data.mjs';
export const LEGACY_GAME_BATTLE_SHARED_STORAGE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-shared-storage-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',element158:true,element159:true,ordinary135UsesActor10:true,allSharedPointerConsumers:false,completeBattleGameplay:false,opacityPolicy:'source object color-mask before animation blend;shared portable byte rounding/coverage'});
const transitionResources=[0,0x1af57,0x1af63,0x1af6f,0x1af7b],sounds=[0,0x1aa,0x1ac,0x1ae,0x1b0];
const rebindResources=[0,0x1af54,0x1af60,0x1af6c,0x1af78],rebindSounds=[0,0x1a9,0x1ab,0x1ad,0x1af];
const directionOffset=facing=>Number(facing>=3&&facing<=5);
const f=Math.fround;
export function createBattleSharedStoragePlayback(a,c){let used=false,pendingBackground=null,backgroundResource=null;
 const storage=n=>{if(!n.shared105c||!a.present(n.shared105c))fail('LEGACY_BATTLE_SHARED_STORAGE_REMOVED');return n.shared105c;};
 const tuple=b=>Array.from(b.tuples.slice(b.tupleRead*4,b.tupleRead*4+4));
 function field(resource,counter,replacesBackground=false){
  const geometry=resource>=0?a.image(resource):null;
  const node=a.allocate('shared-field',null,{manualScreen:true,position:[0,0],screen:[0,0],resourceId:resource,
   drawPriority:3,drawFlagMask:0,drawFlagValue:0,actorFlags:0x40000,counter,presentationAlpha:0,presentationMask:8,replacesBackground});
  node.staticFrame=Object.freeze({...node.player.copyState(),graphicIndex:geometry?.index??-1,geometry,
   drawOffsetX:0,drawOffsetY:0,drawFlags:0,paletteSelector:0,color:0xffffffff});
  return node;
 }
 function chant(n,kind){const b=n.body,r=a.allocate(kind,null,{parent:n,position:[...b.position],resourceId:kind==='shared-growth'?0x1ae0f:0x1ae11,actorFlags:0x40000,drawPriority:kind==='shared-growth'?8:204,drawFlagMask:4,drawFlagValue:4,...(kind==='shared-growth'?{scale:[0,0]}:{})});a.screen(r);return r;}
 function oscillate(n,ctx){const b=n.body;
  if(!(b.dynamicFlags&0x60)){let count=0;while(a.animate(n,1,ctx.mainState)===0)if(++count>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');}
  if(b.skillStatus===0){const child=chant(n,'shared-chant');n.children.set('chant',child);b.skillStatus=1;a.sound(n,0xd5);
   const seed=(tuple(b)[0]+b.slot)|0;a.seedSource(seed);b.indicatorShift=f(c.random.range(1,9)*f(0.1));a.seedSource(seed);b.escapeCounter=c.random.range(5,9);b.animationAction=8;b.actorFlags|=c.alternativeRenderer?0x100000:0x8000;b.counter=0;}
  const rising=b.scale[0]<=b.indicatorShift,delta=f(0.01);b.scale=b.scale.map(x=>f(x+(rising?delta:-delta)));
  if(rising?b.scale[0]>=b.indicatorShift:b.scale[0]<=b.indicatorShift){b.scale=[b.indicatorShift,b.indicatorShift];b.counter=(b.counter+1)|0;
   if(b.counter<b.escapeCounter){if(b.counter===b.escapeCounter-1){b.indicatorShift=b.numberStyle===1?0:b.dynamicFlags&0x1000?f(1.3):1;
     // The two native directions have distinct sound branches.
     if(rising?b.numberStyle!==1:b.numberStyle===1)a.sound(n,0xd5);
    }else{const limit=Math.trunc(b.indicatorShift*10);b.indicatorShift=f(c.random.range(rising?limit:1,rising?9:limit)*f(0.1));a.sound(n,0xd5);}}
  }
  if(b.counter>=b.escapeCounter+1){if(n.children.has('chant')){a.removeChild(n,'chant');b.skillStatus=0;}storage(n).state=2;b.counter=0;b.actorFlags&=~(c.alternativeRenderer?0x100000:0x8000);a.sound(n,0xd4);b.animationAction=0;a.pop(b);}a.screen(n);return true;
 }
 function shape(n,ctx){const b=n.body,type=b.state,t=tuple(b);
  if(type===213)b.animationAction=t[0]===-1?0:6;
  if(!n.shared105c){if(type===213&&t[0]!==-1&&a.animate(n,1,ctx.mainState)!==1){a.screen(n);return true;}
   const m=a.copyActor(n);n.shared105c=m;m.resourceId=type===213?t[3]:b.resource13a8;m.action=type===213?0:10;m.presentationAlpha=0;
   if(type===213)a.animate(m,0,ctx.mainState);else if(m.resourceId>999){let count=0;while(a.animate(m,1,ctx.mainState)!==1)if(++count>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');}
   if(type===213){a.screen(n);return true;}
  }
  const m=storage(n);n.presentationMask=m.presentationMask=8;a.impact(n,0x1af87,0);if(!c.alternativeRenderer){b.actorFlags|=0x8000;m.actorFlags|=0x10000;}
  // These bytes are common actor fields even when105c currently points to another producer's actor.
  const next=(m.presentationAlpha??255)+7;if(next>254){m.deleted=true;n.shared105c=null;
   if(type===213){if(t[0]===-1){b.attachmentHidden=0;if(!(b.dynamicFlags&0x10000000))b.resourceId=t[3];}
    else{b.attachmentHidden=1;if(!(b.dynamicFlags&0x10000000)){b.resource13a8=b.resourceId;b.resourceId=t[3];}}b.animationAction=0;
   }else{b.resourceId=b.resource13a8;b.animationAction=10;b.attachmentHidden=0;}
   n.presentationMask=0;delete n.presentationAlpha;n.player.setColorAlpha(255);if(!c.alternativeRenderer)b.actorFlags&=~0x8000;
   if(type===213)a.animate(n,0,ctx.mainState);else if(b.resourceId>999){let count=0;while(a.animate(n,1,ctx.mainState)!==1)if(++count>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');}
   n.player.clearSignal();if(type===213)a.pop(b);else if(type===215)b.state=209;else{b.savedFlags|=2;if(b.dynamicFlags&0xc){a.death(n,ctx.mainState);a.sound(n,0xd7);a.pop(b);}else{a.removeChild(n,'shadow');b.state=46;}}
  }else{n.presentationAlpha=Math.max(0,(n.presentationAlpha??255)-7);m.presentationAlpha=next;}
  a.screen(n);return true;
 }
 function body(n,ctx){const b=n.body;if([150,151,152,158,159,170,171,213,214,215].includes(b.state))used=true;
  if(b.state===150){if(!(b.dynamicFlags&0x60))a.animate(n,0,ctx.mainState);if(!n.shared105c){n.shared105c=chant(n,'shared-growth');a.sound(n,0xd4);}if(storage(n).state===1)a.pop(b);a.screen(n);return true;}
  if(b.state===151)return oscillate(n,ctx);
  if(b.state===152){if(!(b.dynamicFlags&0x60))a.animate(n,0,ctx.mainState);const m=storage(n);if(m.state===3){m.deleted=true;n.shared105c=null;a.pop(b);}a.screen(n);return true;}
  if(b.state===170){n.shared105c??=field(tuple(b)[3],2);storage(n).state=0;a.pop(b);a.screen(n);return true;}
  if(b.state===171){if(n.shared105c){n.shared105c.state=2;n.shared105c=null;}a.pop(b);a.screen(n);return true;}
  if([213,214,215].includes(b.state))return shape(n,ctx);
  if(b.state===158)return rebind(n,ctx);
  if(b.state===208&&(b.dynamicFlags&0x10000000)){b.counter=208;b.state=159;a.screen(n);return true;}
  return element(n,ctx);
 }

 function transition(node,resource,ctx){
  const n=a.allocate('element-transition',null,{parent:node,position:[...node.body.position],resourceId:resource,
    actorFlags:0x40000,drawPriority:204,drawFlagMask:4,drawFlagValue:4});
  a.animate(n,0,ctx.mainState);a.screen(n);node.children.set('element0',n);
 }
 function completeRebind(node){
  const b=node.body;
  if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
  b.tupleRead++;
  a.pop(b);node.player.clearSignal();b.attackFinishCounter=0;
 }
 function clearElement(node,resource,ctx){
  const b=node.body,property=b.elementProperty??0;
  b.animationAction=6;
  a.animate(node,1,ctx.mainState);
  if(b.attackFinishCounter===0){
   if(property)a.sound(node,sounds[property]);
   for(let i=0;i<4;i++)a.removeChild(node,'element'+i);
   b.resourceId=resource;b.dynamicFlags&=~0x10000000;b.drawFlagMask=0;
   node.presentationMask=8;node.presentationAlpha=0;
   a.animate(node,1,ctx.mainState);
   if(!c.alternativeRenderer)b.actorFlags|=0x10000;
   if(property)transition(node,transitionResources[property]+directionOffset(b.facing),ctx);
   b.attackFinishCounter=1;
  }else if(b.attackFinishCounter===1){
   const alpha=node.presentationAlpha+7;
   if(alpha<256)node.presentationAlpha=alpha;
   else{
    a.removeChild(node,'element0');node.presentationMask=0;delete node.presentationAlpha;
    b.actorFlags&=~0x10000;b.elementProperty=0;
    completeRebind(node);
   }
  }
 }
 function bindElement(node,property,resource,ctx){
  const b=node.body;
  if(b.attackFinishCounter===0){
   a.sound(node,rebindSounds[property]);node.presentationMask=8;node.presentationAlpha=255;
   if(!c.alternativeRenderer)b.actorFlags|=0x8000;
   b.attackFinishCounter=1;
   transition(node,rebindResources[property]+directionOffset(b.facing),ctx);
  }else if(b.attackFinishCounter===1){
   if(b.resourceId===resource){
    const child=node.children.get('element0');
    if(!child||child.state!==0)b.attackFinishCounter=2;
    a.animate(node,0,ctx.mainState);
   }else if(node.presentationAlpha<=7){
    if(!b.attachmentHidden)b.resource13a8=b.resourceId;
    b.resourceId=resource;b.animationAction=0;
    b.drawFlagMask=b.drawFlagValue=4;
    node.presentationMask=0;delete node.presentationAlpha;node.player.setColorAlpha(255);b.dynamicFlags|=0x10000000;
    a.animate(node,0,ctx.mainState);
   }else{
    node.presentationAlpha-=7;b.animationAction=6;
    a.animate(node,1,ctx.mainState);
   }
  }else if(b.attackFinishCounter===2){
   a.removeChild(node,'element0');
   b.elementProperty=property;a.createElementFollowers(node,property,ctx.mainState);
   b.resourceId=resource;b.drawFlagMask=b.drawFlagValue=4;
   node.presentationMask=0;delete node.presentationAlpha;b.actorFlags&=~0x8000;b.dynamicFlags|=0x10000000;b.animationAction=0;
   a.animate(node,0,ctx.mainState);completeRebind(node);
  }
 }
 function rebind(node,ctx){
  const [selector,flags,,resource]=tuple(node.body);
  if(flags&0x80000)bindElement(node,selector+1,resource,ctx);
  else clearElement(node,resource,ctx);
  a.screen(node);return true;
 }
 function element(node,ctx){const b=node.body;
  if(b.state===44&&(b.dynamicFlags&0x10000000)){b.counter=44;b.state=159;a.screen(node);return true;}
  if(b.state!==159)return false;
  const property=b.elementProperty??0;if(!Number.isInteger(property)||property<0||property>4)fail('LEGACY_BATTLE_ELEMENT_PROPERTY');
  b.animationAction=0;a.animate(node,1,ctx.mainState);
  // FD4 is the same source cell used by ordinary result completion, not a private element timer.
  if(b.attackFinishCounter===0){
   if(property)a.sound(node,sounds[property]);
   for(let i=0;i<4;i++)a.removeChild(node,'element'+i);
   b.resourceId=b.resource13a8;b.dynamicFlags&=~0x10000000;b.attachmentHidden=0;
   node.presentationMask=8;node.presentationAlpha=0;a.animate(node,1,ctx.mainState);if(!c.alternativeRenderer)b.actorFlags|=0x10000;
   if(property)transition(node,transitionResources[property]+directionOffset(b.facing),ctx);
   b.attackFinishCounter=1;
  }else if(b.attackFinishCounter>0&&b.attackFinishCounter<3){
   const alpha=(node.presentationAlpha??255)+7;
   if(alpha<256)node.presentationAlpha=alpha;
   else{if(b.attackFinishCounter===1)a.removeChild(node,'element0');else node.children.delete('element0');
    node.presentationMask=0;delete node.presentationAlpha;b.actorFlags&=~0x10000;b.elementProperty=0;b.state=b.counter;b.counter=0;node.player.clearSignal();b.attackFinishCounter=0;}
  }
  a.screen(node);return true;
 }
 return Object.freeze({body,used:()=>used,
  canRebind(b,resource,element,facing){
   const property=b.elementProperty??0,offset=directionOffset(facing);
   if(property<0||property>4)return false;
   const resources=[resource];
   if(element){
    resources.push(rebindResources[element]+offset);
    for(let i=0;i<4;i++)resources.push(elementBases[element]+i);
   }else if(property)resources.push(transitionResources[property]+offset);
   return resources.every(id=>a.probe(id));
  },
  startReplacementField(resource){field(resource,1,true);},
  beginPass(substate){
   // 437b30 refreshes the cached battle background on the next main-state pass.
   if(substate>1&&substate<7&&pendingBackground!==null){
    backgroundResource=pendingBackground;
    pendingBackground=null;
   }
  },
  backgroundResource:()=>backgroundResource,
  resetBackground(){pendingBackground=backgroundResource=null;},
  reset(){used=false;pendingBackground=backgroundResource=null;},
  effect(n,ctx){
  if(n.kind==='shared-growth'){if(n.state===0){n.scale=n.scale.map(x=>f(x+f(0.02)));if(n.scale[0]>1){n.scale=[1,1];n.state=1;}}else if(n.state===2){n.scale=n.scale.map(x=>f(x-f(0.02)));if(n.scale[0]<0){n.scale=[0,0];n.state=3;}}a.animate(n,0,ctx.mainState);a.screen(n);return true;}
  if(n.kind==='shared-chant'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);a.screen(n);return true;}
  if(n.kind==='shared-field'){
   if(n.state===0){
    n.presentationAlpha=Math.min(255,n.presentationAlpha+n.counter);
    if(n.presentationAlpha===255){
     n.actorFlags&=~2;
     if(n.replacesBackground){pendingBackground=n.resourceId;n.state=4;}
    }
   }else if(n.state===1)n.actorFlags&=~2;
   else if(n.state===2){n.presentationAlpha=Math.max(0,n.presentationAlpha-n.counter);if(n.presentationAlpha===0){n.actorFlags|=2;n.deleted=true;}}
   else if(n.state===3||n.state===4)n.deleted=true;
   return true;
  }
  if(n.kind!=='element-transition')return false;
  // 41b0e0 hides on natural animation completion.159 owns deletion separately.
  if(n.state===0&&a.animate(n,1,ctx.mainState)===1){n.state=1;n.actorFlags|=2;}return true;
 }});
}

/** Source battle body callbacks. Private owner access is supplied by battle-body, never a ready callback. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {createLegacyGameAnimationPlayer} from './legacy-game-animation.mjs';
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout,LEGACY_GAME_BATTLE_ENTRY_ROW_SLOTS as entrySlots,battleBodyFormation} from './legacy-game-battle-data.mjs';
import {legacyGameBattleAngle,legacyGameBattleFacing,legacyGameBattleMovement,legacyGameBattleDistance,createLegacyGameBattleRandom} from './legacy-game-battle-math.mjs';
import{createBattleStrikePlayback}from'./legacy-game-battle-strike-playback.mjs';
import{resolveLegacyGameMountedResource}from'./legacy-game-actor-ride.mjs';
import{battleLinkedAction,battleLinkedFlags}from'./legacy-game-battle-character-change.mjs';
import{createBattleCastingPlayback}from'./legacy-game-battle-casting-playback.mjs';
import{battleSideCastEffect,battleWeatherCastEffect}from'./legacy-game-battle-casting.mjs';
import{createBattleRain}from'./legacy-game-battle-rain.mjs';
import{createBattleStatusSkillsPlayback}from'./legacy-game-battle-status-skills-playback.mjs';
import{createBattleNumericSkillsPlayback}from'./legacy-game-battle-numeric-skills-playback.mjs';
import{createBattleSkill82Playback}from'./legacy-game-battle-skill82-playback.mjs';
import{createBattleMovingNumericPlayback}from'./legacy-game-battle-moving-numeric-playback.mjs';
import{createBattlePhysicalPlayback}from'./legacy-game-battle-physical-playback.mjs';
import{createBattlePhysicalProjectiles}from'./legacy-game-battle-physical-projectiles.mjs';
import{createBattlePhysicalSpecials}from'./legacy-game-battle-physical-specials.mjs';
import{createBattleAttachedRIDPlayback}from'./legacy-game-battle-attached-rid-playback.mjs';
import{createBattleCombinationPlayback}from'./legacy-game-battle-combination-playback.mjs';
import{createBattleSharedStoragePlayback}from'./legacy-game-battle-shared-storage-playback.mjs';
import{createBattleRidingPlayback}from'./legacy-game-battle-riding-playback.mjs';
import{createBattlePhysicalGuardPlayback}from'./legacy-game-battle-physical-guard-playback.mjs';
import {createBattleGMNPlayback} from './legacy-game-battle-gmn-playback.mjs';
import {createBattleSkill404Playback} from './legacy-game-battle-skill404-playback.mjs';
import {createBattleUpperSkillsPlayback} from './legacy-game-battle-upper-skills-playback.mjs';
import {createBattleImpactSkillsPlayback} from './legacy-game-battle-impact-skills-playback.mjs';
export const LEGACY_GAME_BATTLE_PLAYBACK_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-body-playback-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',maximumNodes:4096,
  supportedBodyTypes:Object.freeze([0,1,2,11,12,13,35,36,38,39,45,48,49,50,51,52,54,55,62,63,64,65,66,69,78,79,81,82,139,141,161,200,208,218,231,244]),
  renderer:'unimplemented',main10Driver:'unimplemented',nativeX87BitIdentity:'unverified'});
const f=Math.fround;
const integer=(n,lo=-2147483648,hi=2147483647)=>{if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_BATTLE_INTEGER');return n;};
function fields(value,names){if(!value||typeof value!=='object')fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');const d=Object.getOwnPropertyDescriptors(value),out={};
  if(Reflect.ownKeys(d).some(k=>!names.includes(k)))fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');
  for(const key of names){if(!Object.hasOwn(d[key]??{},'value'))fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');out[key]=d[key].value;}return out;}
function pair(value){if(!Array.isArray(value))fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');const d=Object.getOwnPropertyDescriptors(value);
  if(d.length.value!==2||!Object.hasOwn(d[0]??{},'value')||!Object.hasOwn(d[1]??{},'value'))fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');return [integer(d[0].value),integer(d[1].value)];}

export function createBattleBodyPlayback(access,value){
  const c=fields(value,['animations','geometry','seed','initialPhase','alternativeRenderer','staticFlip','screenOffset']);
  if(typeof c.geometry!=='function'||typeof c.alternativeRenderer!=='boolean'||typeof c.staticFlip!=='boolean')fail('LEGACY_BATTLE_PLAYBACK_CONFIGURATION');
  c.screenOffset=pair(c.screenOffset);integer(c.initialPhase,0,3);const random=createLegacyGameBattleRandom(c.seed),probe=createLegacyGameAnimationPlayer(c.animations);probe.close();
  const rain=createBattleRain(random);
  let status='open',busy=false,phase=c.initialPhase,nextId=1,passes=0,events=[];
  const producerEvents=[];
  const nodes=[],bodyNodes=new Map();let directDraws=[],directDrawingUsed=false;
  const active=()=>{if(status!=='open')fail('LEGACY_BATTLE_PLAYBACK_CLOSED');};
  const begin=()=>{active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');busy=true;};
  const run=fn=>{begin();try{return fn();}catch(error){if(status!=='closed')status='failed';throw error;}finally{busy=false;}};
  function produce(fn){
    return run(()=>{
      const previous=events;
      events=[];
      try{
        const result=fn();
        producerEvents.push(...events);
        return result;
      }finally{events=previous;}
    });
  }
  function allocate(kind,body,options={}){
    active();if(nodes.length>=4096||!Number.isSafeInteger(nextId))fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
    const node={id:nextId++,kind,body,priority:kind==='body'?body.slot*10+2:2,drawPriority:kind==='body'?9:204,deleted:false,state:0,counter:0,
      position:body?[...body.position]:[0,0],screen:[0,0],actorFlags:kind==='body'?body.actorFlags:0,resourceId:0,action:0,facing:0,height:0,
      angle:0,speed:0,presentationMask:0,parent:null,children:new Map(),player:createLegacyGameAnimationPlayer(c.animations),...options};
    let i=0;while(i<nodes.length&&(nodes[i].priority<node.priority||nodes[i].priority===node.priority&&nodes[i].id<node.id))i++;
    nodes.splice(i,0,node);if(kind==='body')bodyNodes.set(body,node);screen(node);return node;
  }
  function screen(node){if(node.manualScreen)return;const position=node.kind==='body'?node.body.position:node.position;
    const offset=node.screenSpace||node.kind==='message'||node.kind==='puff'?[0,0]:c.screenOffset;
    node.screen=[(Math.trunc(position[0])+offset[0])|0,(Math.trunc(position[1])+offset[1])|0];}
  function animate(node,mode,mainState){
    active();const b=node.kind==='body'?node.body:null;
    const result=node.player.step({resourceId:b?b.resourceId:node.resourceId,action:b?b.animationAction:node.action,facing:b?b.facing:node.facing,
      speedPercent:b?b.speedPercent:node.speedPercent??100,mode,frozen:b?b.frozen:0,staticFlip:c.staticFlip,soundScene:mainState,actorFlags:b?b.actorFlags:node.actorFlags},c.geometry);
    active();if(result.event)events.push(Object.freeze({...result.event,nodeId:node.id,slot:b?.slot??null,position:Object.freeze([...node.screen])}));return result.code;
  }
  function createBodyNode(body){
    const node=allocate('body',body);
    animate(node,0,10);
    node.screen=body.position.map(n=>Math.trunc(n)|0);
    return node.id;
  }
  function removeChild(parent,key){const child=parent.children.get(key);if(child){child.deleted=true;parent.children.delete(key);}}
  function releaseTargets(body){
    while(body.tuples[body.tupleRead*4]!==-1){
      if(body.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      const target=access.get(body.tuples[body.tupleRead++*4]);
      if(target)target.state=target.actions[target.actionRead];
    }
    if(body.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
    body.tupleRead++;
  }
  function linked(parent,kind,resourceId){const node=allocate(kind,null,{parent,anchorSlot:parent.body.slot,speed:3,resourceId,actorFlags:0x860040,drawPriority:9,facing:parent.body.facing,manualScreen:true,screen:[...c.screenOffset],drawFlagMask:0,drawFlagValue:0});animate(node,0,10);parent.children.set(kind,node);return node;}
  function rider(parent,base,resource){
    if(resource>0){
      let node=parent.children.get('rider')??attachedRID.resumeRider(parent);
      if(!node)node=linked(parent,'rider',resolveLegacyGameMountedResource(base));
      node.resourceId=resolveLegacyGameMountedResource(base);
      parent.body.resourceId=resource;
    }else{
      const node=parent.children.get('rider');
      if(!node||!attachedRID.suspendRider(parent,node))removeChild(parent,'rider');
      parent.body.resourceId=base;
    }
  }
  function attachment(parent,resource){if(resource>0){let node=parent.children.get('attachment');if(!node)node=linked(parent,'attachment',resource);node.resourceId=resource;}else removeChild(parent,'attachment');}
  function activeRider(parent,node){
    const handoff=parent.shared105c?.ridPair;
    if(handoff?.rider!==node)return false;
    const state=parent.body.state,slots=handoff.lastReadSlots;
    return state===222||(state===221&&slots?.[0]===handoff.a&&slots[1]===handoff.b);
  }
  function updateLinks(parent,ctx){const b=parent.body;for(const kind of ['rider','attachment']){const node=parent.children.get(kind);if(!node||node.deleted)continue;if(access.get(node.anchorSlot)!==b&&!activeRider(parent,node)){node.deleted=true;continue;}
    let hidden=kind==='attachment'&&((b.dynamicFlags&0x10002000)||b.attachmentHidden)?2:0;
    if(kind!=='rider'||node.state===0){node.alternateY=parent.screen[1];const r=battleLinkedAction(kind,b.animationAction,b.state,b.actorFlags,b.dynamicFlags);node.action=r.action;const change=node.facing!==b.facing;node.facing=b.facing;if(change||r.advance){const code=animate(node,kind==='attachment'||node.action===5?0:parent.player.copyState().mode,ctx.mainState);if(kind==='attachment'&&code!==0)hidden=2;}
      const base=kind==='attachment'?(parent.children.get('rider')??parent):parent,q=base.player.copyState();node.screen=[(base.screen[0]+Math.trunc(q.attachmentX*b.scale[0]))|0,(base.screen[1]+Math.trunc(q.attachmentY*b.scale[kind==='attachment'&&base!==parent?0:1]))|0];}
    node.actorFlags=battleLinkedFlags(node.actorFlags,b.actorFlags,hidden);node.drawFlagMask=b.drawFlagMask;node.drawFlagValue=b.drawFlagValue;
  }}
  function effect(parent,kind,resourceId,options={}){
    const flags=kind==='puff'?(c.alternativeRenderer?0x160000:0x68000):kind==='status'?0x60000:0x40000;
    return allocate(kind,null,{parent,position:[...parent.body.position],resourceId,actorFlags:flags,drawPriority:kind==='status'?9:kind==='death'||kind==='indicator'?200:204,...options});
  }
  function deathPosition(node){const parent=node.parent,body=parent.body,state=parent.player.copyState(),g=state.geometry;
    if(!g)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
    node.position=[f(f(Math.trunc(g.width/2))+f(state.drawOffsetX)+body.position[0]),f(f(Math.trunc(g.height/2))+f(state.drawOffsetY)+body.position[1])];
  }
  function death(parent,mainState){if(parent.children.has('death'))return;
    const node=effect(parent,'death',0x1ae59);deathPosition(node);animate(node,1,mainState);screen(node);parent.children.set('death',node);}
  function ensureIndicator(parent,first,mainState){let node=parent.children.get('indicator');const resourceId=first?0x5736:0x5737;
    if(node){node.resourceId=resourceId;return node;}
    node=effect(parent,'indicator',resourceId);animate(node,1,mainState);parent.children.set('indicator',node);return node;
  }
  function particle(parent){const y=f(parent.body.position[1]+random.range(-10,10)),x=f(parent.body.position[0]+random.range(-10,10));
    effect(parent,'puff',0x1adb6,{position:[x,y]});}
  // 41f310 is the reaction smoke factory; unlike the escape path it consumes no RNG.
  function reactionPuff(parent,resourceId=0x1adb6){return allocate('puff',null,{position:[...parent.body.position],resourceId,
    actorFlags:c.alternativeRenderer?0x160000:0x68000,drawPriority:204});}
  const playIdle=(node,ctx)=>{const b=node.body;
    if(b.actionRead<=b.actionWrite&&b.actions[b.actionRead+1]===161)access.pop(b);
    b.speedPercent=100;
    if(!(b.dynamicFlags&2)){
      if(!([72,113].includes(b.classCode)&&b.actionRead>0&&[55,57].includes(b.actions[b.actionRead-1]))){
        if(b.animationAction!==0){b.animationAction=0;if(!(b.dynamicFlags&0x60))animate(node,0,ctx.mainState);}
        else if((b.actorFlags&0x40)&&!(b.dynamicFlags&0x60))animate(node,0,ctx.mainState);
      }
    }else{b.animationAction=10;animate(node,1,ctx.mainState);}
  };
  function aim(b,target,turn){b.angle=legacyGameBattleAngle(f(target[0]-b.position[0]),f(target[1]-b.position[1]));if(turn)b.facing=legacyGameBattleFacing(b.angle);}
  // 421140 allocates zero payload and copies only its selected identity fields.
  function detachedBody(parent,ctx){const p=parent.body,b=access.createAnonymous();
    Object.assign(b,{slot:p.slot,resourceId:p.resourceId,actorFlags:0x20000,angle:p.angle,facing:p.facing,
      position:[...p.position],classCode:p.classCode,physicalVariant:p.physicalVariant,speed:0});
    const node=allocate('body',b,{parent,priority:2,drawPriority:parent.drawPriority,detachedBody:true});
    animate(node,0,ctx.mainState);screen(node);return node;
  }
  function move(b){b.position=[...legacyGameBattleMovement(b.position[0],b.position[1],b.angle,b.speed)];}
  function registeredAuxCount(){let count=0;for(let slot=0;slot<22;slot++)if(access.get(slot)?.auxFF8===1)count++;return count;}
  function reached(b,target){return legacyGameBattleDistance(b.position[0],b.position[1],target[0],target[1])<5;}
  function puffCounter(b,node){if(b.counter===0)particle(node);if(++b.counter>2)b.counter=0;}
  function sound(node,value){events.push(Object.freeze({kind:'sound',value,nodeId:node.id,slot:node.body?.slot??null,position:Object.freeze([...node.screen])}));}
  function seedSource(value){
    const length=access.motionSourceLength();
    if(length===null)fail('LEGACY_BATTLE_MOTION_SOURCE_REQUIRED');
    let count=0;
    for(let slot=0;slot<20;slot++)if(access.get(slot))count++;
    random.seed(Math.imul(Math.imul(length,count),value)>>>0);
  }
  const strike=createBattleStrikePlayback({...access,allocate,screen,animate,particle,reactionPuff,sound,removeChild,aim,move,distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),node:b=>bodyNodes.get(b),countAux:()=>registeredAuxCount(),setSlow:value=>{if(castingUsed||backgroundState!==null)casting.setSlow(value);},event:value=>events.push(Object.freeze(value))},{...c,random});
  const casting=createBattleCastingPlayback({...access,allocate,screen,animate,removeChild,move,rider,attachment,seedSource,setRain:rain.setMode,
    startReplacementField:resource=>sharedStorage.startReplacementField(resource),submitDirect:draw=>directDraws.push(draw),
    node:b=>bodyNodes.get(b),countAux:()=>registeredAuxCount(),event:value=>events.push(Object.freeze(value))},{...c,random},strike);
  let castingUsed=false,backgroundState=null;
  const statusSkills=createBattleStatusSkillsPlayback({...access,probeAnimation,allocate,screen,animate,removeChild,seedSource,shake:casting.setShake,node:b=>bodyNodes.get(b),restart:body=>{body.state=body.actions[body.actionRead];},overlay:group=>{casting.submitOverlay(group);castingUsed=true;},event:value=>events.push(Object.freeze(value))},{...c,random},strike);
  const numericSkills=createBattleNumericSkillsPlayback({...access,allocate,screen,animate,removeChild,restart:body=>{body.state=body.actions[body.actionRead];},event:value=>events.push(Object.freeze(value))},c,strike);
  const movingNumeric=createBattleMovingNumericPlayback({...access,allocate,screen,animate,aim,move,distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),restart:body=>{body.state=body.actions[body.actionRead];}},c,strike);
  const skill82=createBattleSkill82Playback({...access,screen,animate,aim,removeChild,node:b=>bodyNodes.get(b),restart:b=>{b.state=b.actions[b.actionRead];},
    metadata:node=>casting.applyBodyMetadata(node),feedback:casting.bodyFeedback,message:casting.bodyMessage,shake:(flag,maximum)=>casting.setShake(flag,maximum),setSlow:casting.setSlow,event:value=>events.push(Object.freeze(value))},c,strike);
  const physicalGuard=createBattlePhysicalGuardPlayback({...access,allocate,screen,animate,aim,move,reactionPuff,sound,distance:(b,p)=>legacyGameBattleDistance(...b.position,...p)},{...c,random},strike);
  const physicalSpecials=createBattlePhysicalSpecials({...access,allocate,screen,animate,submitDirect:draw=>{directDrawingUsed=true;directDraws.push(draw);}},{...c,random},strike);
  const projectiles=createBattlePhysicalProjectiles({...access,allocate,screen,animate,aim,move,removeChild,sound,node:b=>bodyNodes.get(b),distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),
    transient:physicalSpecials.transient,tile:physicalSpecials.tile,validateSpecials:plan=>{physicalGuard.validate(plan);return physicalSpecials.validate(plan);},
    metadata:(node,ownerSlot)=>casting.applyBodyMetadata(node,ownerSlot),feedback:casting.bodyFeedback,extraImpact:casting.physicalExtraImpact,condition:statusSkills.condition,setSlow:value=>{castingUsed=true;casting.setSlow(value);},event:value=>events.push(Object.freeze(value))},{...c,random},strike);
  const physical=createBattlePhysicalPlayback({...access,allocate,screen,animate,aim,move,removeChild,sound,reactionPuff,node:b=>bodyNodes.get(b),distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),validateProjectiles:projectiles.validate,tile:physicalSpecials.tile,validateSpecials:plan=>{physicalGuard.validate(plan);return physicalSpecials.validate(plan);},
    combinationHit:(node,hit)=>combination.hit(node,hit),metadata:(node,ownerSlot)=>casting.applyBodyMetadata(node,ownerSlot),countAux:()=>registeredAuxCount(),feedback:casting.bodyFeedback,extraImpact:casting.physicalExtraImpact,condition:statusSkills.condition,setSlow:value=>{castingUsed=true;casting.setSlow(value);},event:value=>events.push(Object.freeze(value))},{...c,random},strike);
  const combination=createBattleCombinationPlayback({...access,allocate,screen,animate,node:b=>bodyNodes.get(b),event:e=>events.push(Object.freeze(e))}, {...c,random},strike);
  function copyActor(source){const b=source.body,n=allocate('actor-copy',null,{callbackDisabled:true,manualScreen:true,priority:2,drawPriority:source.drawPriority,position:[...b.position],screen:[...source.screen],resourceId:b.resourceId,action:b.animationAction,facing:b.facing,speedPercent:b.speedPercent,actorFlags:b.actorFlags,state:b.state,counter:b.sourceTimer,angle:b.angle,speed:b.speed,height:source.height,scale:[...b.scale],drawFlagMask:b.drawFlagMask,drawFlagValue:b.drawFlagValue,shared105c:source.shared105c,copiedBody:access.cloneBody(b),children:new Map(source.children)});n.priority=source.priority;n.player.close();n.player=source.player.clone();n.presentationMask=source.presentationMask;if(source.presentationColor!==undefined)n.presentationColor=source.presentationColor;if(source.presentationAlpha!==undefined)n.presentationAlpha=source.presentationAlpha;return n;}
  const sharedStorage=createBattleSharedStoragePlayback({...access,allocate,screen,animate,removeChild,sound,copyActor,present:n=>nodes.includes(n),image:strike.image,impact:strike.impact,death,seedSource,
    createElementFollowers:casting.createElementFollowers,probe:resource=>probeAnimation(resource,0).state.geometry}, {...c,random});
  function probeAnimation(resourceId,facing=1){
    const player=createLegacyGameAnimationPlayer(c.animations);
    try{return player.step({resourceId,action:0,facing,speedPercent:100,mode:0,frozen:0,staticFlip:c.staticFlip,soundScene:10,actorFlags:0x60054},c.geometry);}
    finally{player.close();}
  }
  const gmn=createBattleGMNPlayback({...access,allocate,screen,animate,sound,image:strike.image,
    count:()=>nodes.length,node:b=>bodyNodes.get(b),probe:probeAnimation,remove:b=>api.remove(b)},{...c,random});
  function restoreRIDFlags(node){const b=node.body,flags=b.dynamicFlags;for(let i=0;i<6;i++){const bit=16<<i;if(flags&bit)statusSkills.condition(node,0x1adfb+i);else b.dynamicFlags&=~bit;}
    b.scale=flags&0x1000?[f(1.3),f(1.3)]:[1,1];if(flags&0x400)ensureIndicator(node,true,10);else removeChild(node,'indicator');statusSkills.character(node,flags);}
  const attachedRID=createBattleAttachedRIDPlayback({...access,allocate,screen,animate,removeChild,attachment,node:b=>bodyNodes.get(b),count:()=>nodes.length,present:n=>nodes.includes(n),allBodies:()=>nodes.filter(n=>n.kind==='body'),birthMetadata:casting.initializeMetadata,restoreFlags:restoreRIDFlags,
    markDeleted:b=>{const n=bodyNodes.get(b);if(n)n.deleted=true;},sound:(n,value,slot)=>events.push(Object.freeze({kind:'sound',value,nodeId:n.id,slot,position:Object.freeze([...n.screen])})),
    probe:probeAnimation},{...c,random});
  function copyAnimation(source,target){target.player.close();target.player=source.player.clone();const from=source.body,to=target.body;for(const key of['speedPercent','facing','animationAction','drawFlagMask','drawFlagValue'])to[key]=from[key];target.presentationMask=source.presentationMask;if(source.presentationColor!==undefined)target.presentationColor=source.presentationColor;else delete target.presentationColor;if(source.presentationAlpha!==undefined)target.presentationAlpha=source.presentationAlpha;else delete target.presentationAlpha;if(source.gmnDrawStyle!==undefined)target.gmnDrawStyle=source.gmnDrawStyle;}
  function publishSkill404Body(node){
    if(!node.skill404Birth)return;
    const b=node.body,m=node.skill404Birth;
    events.push(Object.freeze({kind:'battle-skill404-registered',slot:b.slot,nameBytes:b.nameBytes.slice(),rawResourceId:m.rawResourceId,
      resourceId:b.resourceId,rawAttachmentResource:m.rawAttachmentResource,attachmentResource:b.linkedResources[1],
      value1d0:b.value1d0,values:Object.freeze([...b.vitals]),statusFlags:b.rawStatusFlags,actorFlags:b.actorFlags}));
  }
  const riding=createBattleRidingPlayback({...access,allocate,screen,animate,removeChild,rider,attachment,aim,move,node:b=>bodyNodes.get(b),count:()=>nodes.length,present:n=>nodes.includes(n),allBodies:()=>nodes.filter(n=>n.kind==='body'),copyAnimation,birth:attachedRID.birthStandalone,bindPair:attachedRID.bindPair,birthMetadata:casting.initializeMetadata,restoreFlags:restoreRIDFlags,
    probe:probeAnimation,publishReplacement:publishSkill404Body,
    distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),markDeleted:b=>{const n=bodyNodes.get(b);if(n)n.deleted=true;},
    localSlotMoved:(from,target,to,ctx)=>{if(ctx.localSlot===from||ctx.localSlot===target)ctx.localSlot=to;events.push(Object.freeze({kind:'battle-riding-registry-move',from,target,to,localSlot:ctx.localSlot}));},sound:(n,value,slot=n.body?.slot??n.anchorSlot??null)=>events.push(Object.freeze({kind:'sound',value,nodeId:n.id,slot,position:Object.freeze([...n.screen])}))},{...c,random});
  const skill404=createBattleSkill404Playback({...access,allocate,screen,animate,aim,move,sound,removeChild,reactionPuff,
    node:b=>bodyNodes.get(b),present:n=>nodes.includes(n),count:()=>nodes.length,probe:probeAnimation,
    bindPair:attachedRID.bindPair,birthMetadata:casting.initializeMetadata,scatter:casting.scatter,
    metadata:casting.applyBodyMetadata,feedback:casting.bodyFeedback,extraImpact:casting.physicalExtraImpact,
    countAux(){
      let count=0;
      for(let slot=0;slot<22;slot++)if(access.get(slot)?.auxFF8===1)count++;
      return count;
    },
    distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),
    event:event=>events.push(Object.freeze(event)),setSlow:value=>{castingUsed=true;casting.setSlow(value);}},
    {...c,random},strike);
  const upperSkills=createBattleUpperSkillsPlayback({...access,allocate,screen,animate,aim,move,sound,probeAnimation,detachedBody,
    distance:(b,p)=>legacyGameBattleDistance(...b.position,...p),node:b=>bodyNodes.get(b),
    metadata:casting.applyBodyMetadata,extraImpact:casting.physicalExtraImpact,
    countAux:()=>registeredAuxCount(),
    shake:casting.setShake,setSlow:value=>{castingUsed=true;casting.setSlow(value);},event:event=>events.push(Object.freeze(event))},
    {...c,random},strike);
  const impactSkills=createBattleImpactSkillsPlayback({...access,allocate,screen,animate,aim,move,sound,probeAnimation,detachedBody,removeChild,
    impactProjectile:projectiles.impactProjectile,node:b=>bodyNodes.get(b),metadata:casting.applyBodyMetadata,
    extraImpact:casting.physicalExtraImpact,feedback:casting.bodyFeedback,shake:casting.setShake,
    soundAt:(value,position,node)=>events.push(Object.freeze({kind:'sound',value,nodeId:node.id,slot:node.body?.slot??null,position:Object.freeze([...position])})),
    setSlow:value=>{castingUsed=true;casting.setSlow(value);},event:value=>events.push(Object.freeze(value))},{...c,random},strike);
  function stepBody(node,ctx){const b=node.body,type=b.state;
    if(ctx.substate===7)return 'gated';
    if(b.unmodeledCharacterMask)return 'character-branch-unavailable';
    if(combination.body(node,ctx))return 'advanced';
    if(sharedStorage.body(node,ctx))return 'advanced';
    if(gmn.body(node))return 'advanced';
    if(riding.body(node,ctx)){screen(node);return 'advanced';}
    if(attachedRID.body(node)){screen(node);return 'advanced';}
    if(skill404.body(node,ctx))return 'advanced';
    if(upperSkills.body(node,ctx)){castingUsed=true;return 'advanced';}
    if(impactSkills.body(node,ctx)){castingUsed=true;return 'advanced';}
    if(type===49&&(node.gmnDismissal||node.skill404Birth||node.pursuitRemoval||node.upperDeparture||b.departureTarget)){
      if(access.get(b.slot)===b)events.push(Object.freeze({kind:'battle-motion-body-removed',slot:b.slot}));
      if(node.upperDeparture)screen(node);
      access.detach(b);node.deleted=b.deleted=true;
      return 'advanced';
    }
    if(physicalGuard.body(node,ctx)||physicalSpecials.body(node,ctx)||projectiles.body(node,ctx))return 'advanced';
    if(skill82.body(node,ctx)){castingUsed=true;return 'advanced';}
    if(physical.body(node,ctx))return 'advanced';
    if(movingNumeric.body(node,ctx))return 'advanced';
    if(numericSkills.body(node,ctx))return 'advanced';
    if(casting.body(node,ctx)){castingUsed=true;return 'advanced';}
    if(statusSkills.body(node,ctx))return 'advanced';
    if(strike.body(node,ctx))return 'advanced';
    if(type===6&&node.travelTarget){
      const target=node.travelTarget;
      b.animationAction=3;b.speed=8;b.speedPercent=100;
      aim(b,target,true);move(b);
      if(reached(b,target)){b.position=[...target];delete node.travelTarget;access.pop(b);}
      animate(node,0,ctx.mainState);screen(node);
      return 'advanced';
    }
    if(!LEGACY_GAME_BATTLE_PLAYBACK_PROFILE.supportedBodyTypes.includes(type))return 'body-handler-unavailable';
    const formation=battleBodyFormation(b),target=formation.target,entry=b.departureTarget??formation.entry;
    switch(type){
      case 231:b.state=0;b.busy=0;playIdle(node,ctx);break;
      case 0:playIdle(node,ctx);break;
      case 1:b.speedPercent=100;b.animationAction=0;if(!(b.dynamicFlags&0x60))animate(node,0,ctx.mainState);break;
      case 2:b.animationAction=1;b.speed=4;b.speedPercent=100;aim(b,target,true);move(b);
        if(reached(b,target)){b.position=[...target];b.state=0;b.dynamicFlags|=1;}animate(node,0,ctx.mainState);break;
      case 11:
        if(!(b.dynamicFlags&2)||(b.dynamicFlags&12)){if(b.animationAction!==10)b.animationAction=1;}
        else if(b.animationAction!==10){b.state=44;break;}
        if(b.actionRead>0&&b.actions[b.actionRead-1]===7)b.animationAction=3;
        aim(b,target,b.animationAction!==10);move(b);if(reached(b,target)){b.position=[...target];access.pop(b);}animate(node,b.animationAction===10?1:0,ctx.mainState);break;
      case 12:
        if(!(b.dynamicFlags&2)){puffCounter(b,node);b.animationAction=1;animate(node,0,ctx.mainState);aim(b,entry,true);
          b.escapeCounter=(b.escapeCounter+1)|0;b.speedPercent=b.escapeCounter<71?100-b.escapeCounter:30;
          if(b.escapeCounter>119){b.escapeCounter=b.counter=0;b.speed=6;access.pop(b);}
        }else{b.animationAction=10;animate(node,1,ctx.mainState);aim(b,entry,false);b.speed=6;access.pop(b);}break;
      case 13:
        if(!(b.dynamicFlags&2)){puffCounter(b,node);b.animationAction=1;animate(node,0,ctx.mainState);aim(b,entry,true);}
        else{b.animationAction=10;animate(node,1,ctx.mainState);aim(b,entry,false);}
        b.speed=6;b.speedPercent=20;move(b);if(reached(b,entry)){b.position=[...entry];access.pop(b);}break;
      case 35:case 36:if(!(b.dynamicFlags&0x60))animate(node,0,ctx.mainState);if(++b.counter>=(type===35?60:120)){b.counter=0;access.pop(b);}break;
      case 38:access.reface(b);access.pop(b);break;
      case 39:if(!layout[b.pairedTarget])return 'pet-target-unavailable';aim(b,layout[b.pairedTarget].target,true);access.pop(b);break;
      case 45:b.dynamicFlags|=2;access.pop(b);break;
      case 48:b.animationAction=10;if(animate(node,1,ctx.mainState)===1)access.pop(b);break;
      case 49:access.detach(b);node.deleted=b.deleted=true;break;
      case 50:
        if(b.dynamicFlags&4){const paired=b.slot<=4||b.slot>=10&&b.slot<=14?b.slot+5:b.slot-5,other=access.get(paired);
          if(other){
            access.append(other,b.owner,[13,45,49]);other.state=other.actions[other.actionRead];
            if(node.pursuitRemoval)bodyNodes.get(other).pursuitRemoval=true;
          }}
        access.pop(b);break;
      case 51:case 52:{const growing=type===52,flag=c.alternativeRenderer?0x100000:0x8000;b.actorFlags|=flag;if(growing)access.reface(b);b.scale=b.scale.map(n=>f(n+(growing?f(0.02):-f(0.02))));if(growing?b.scale[0]>1:b.scale[0]<0)b.scale=growing?[1,1]:[0,0];
        if(b.skillStatus===0){const child=effect(node,'pet-transition',growing?0x1ae10:0x1ae11,{actorFlags:0x40000|flag});b.skillStatus=1;node.children.set('pet-transition',child);}
        if(b.scale[0]===(growing?1:0)){removeChild(node,'pet-transition');if(growing){b.actorFlags&=~flag;b.skillStatus=0;}access.pop(b);}animate(node,1,ctx.mainState);break;}
      case 54:b.animationAction=5;if(animate(node,1,ctx.mainState)===1){node.player.resetFrames();node.player.clearSignal();access.pop(b);}break;
      case 55:b.animationAction=13;if(animate(node,1,ctx.mainState)===1){node.player.resetFrames();access.pop(b);}break;
      case 62:b.animationAction=0;access.pop(b);break;
      case 63:{b.animationAction=0;const previous=b.counter;b.counter=(previous+1)|0;
        if(previous>69){access.pop(b);b.counter=0;}
        else if([8,32,40,64].includes(b.counter))b.facing--;
        else if([16,24,48,56].includes(b.counter))b.facing++;
        if(b.facing>7)b.facing-=8;if(b.facing<0)b.facing+=8;animate(node,0,ctx.mainState);break;}
      case 64:b.animationAction=5;b.resourceId=b.nextResource;if(animate(node,1,ctx.mainState)===1){access.pop(b);node.player.clearSignal();}break;
      case 65:{b.animationAction=6;const signal=node.player.copyState().signal;if(signal>9999&&signal<20000){releaseTargets(b);node.player.clearSignal();}if(animate(node,1,ctx.mainState)===1)access.pop(b);break;}
      case 66:{const child=effect(node,'message',b.messageResource,{height:-8});animate(child,1,ctx.mainState);screen(child);
        if(!(b.dynamicFlags&0x60))animate(node,1,ctx.mainState);access.pop(b);break;}
      case 69:releaseTargets(b);access.pop(b);break;
      case 78:case 79:sound(node,type===78?b.effectResource:b.secondaryEffectResource);access.pop(b);break;
      case 81:b.animationAction=9;b.scale=b.scale.map(value=>f(value+f(0.005)));
        if(b.scale[0]>=f(1.3)){access.pop(b);b.dynamicFlags|=0x1000;}animate(node,0,ctx.mainState);break;
      case 82:b.scale=b.scale.map(n=>f(n-f(0.01)));if(b.scale[0]<=1){b.scale=[1,1];access.pop(b);b.dynamicFlags&=~0x1000;}
        if(!(b.dynamicFlags&0x60))animate(node,0,ctx.mainState);break;
      case 139:removeChild(node,'status');b.dynamicFlags&=0xfffffc0f;animate(node,0,ctx.mainState);access.pop(b);break;
      case 141:removeChild(node,'special');b.dynamicFlags&=0xfff03fff;animate(node,0,ctx.mainState);access.pop(b);break;
      case 161:{
        if(!node.timeGlyphs)return 'time-glyph-resources-unavailable';
        const seconds=b.values[b.valueRead++];
        strike.timeGlyphs(node,node.timeGlyphs);
        delete node.timeGlyphs;
        events.push(Object.freeze({kind:'battle-time-feedback',slot:b.slot,seconds,local:b.slot===ctx.localSlot}));
        access.pop(b);
        break;
      }
      case 200:b.animationAction=16;if(animate(node,1,ctx.mainState)===1){node.player.resetFrames();access.pop(b);}break;
      case 208:b.animationAction=10;b.speedPercent=100;if(animate(node,1,ctx.mainState)===1){if(b.dynamicFlags&0x1000){b.scale=[1,1];b.dynamicFlags&=~0x1000;}
        for(const key of ['overlay','status','special','shadow'])removeChild(node,key);b.state=b.attachmentHidden?215:209;}break;
      case 218:{if(ctx.localSlot===undefined)return 'pet-cache-context-unavailable';if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');const index=b.tuples[b.tupleRead*4],local=access.get(ctx.localSlot),root=bodyNodes.get(local),paired=access.get(ctx.localSlot<5||ctx.localSlot>=10&&ctx.localSlot<=14?ctx.localSlot+5:ctx.localSlot-5),rider=root?.children.get('rider');events.push(Object.freeze({kind:'battle-pet-cache',index,refreshValues:ctx.localSlot<20&&local&&(!rider||rider.deleted)&&paired?.vitals?Object.freeze([...paired.vitals]):null}));b.tupleRead++;access.pop(b);break;}
      case 244:break;
    }
    screen(node);return type===244?'stop':'advanced';
  }
  function stepEffect(node,ctx){
    if(impactSkills.effect(node,ctx))return 'advanced';
    if(upperSkills.effect(node,ctx))return 'advanced';
    if(sharedStorage.effect(node,ctx))return 'advanced';
    if(gmn.effect(node,ctx))return 'advanced';
    if(combination.effect(node,ctx))return 'advanced';
    if(physicalGuard.effect(node,ctx)||physicalSpecials.effect(node,ctx)||projectiles.effect(node,ctx))return 'advanced';
    if(movingNumeric.effect(node))return 'advanced';
    if(node.kind==='rider'||node.kind==='attachment'){if(node.parent.deleted||access.get(node.anchorSlot)!==node.parent.body&&!activeRider(node.parent,node))node.deleted=true;return 'advanced';}
    if(numericSkills.effect(node,ctx))return 'advanced';
    if(casting.effect(node,ctx))return 'advanced';
    if(statusSkills.effect(node,ctx))return 'advanced';
    if(strike.effect(node,ctx))return 'advanced';
    if(node.kind==='message'){
      if(node.state===0){const height=node.height+f(0.8);if(height>=f(7.2))node.state=1;node.height=f(height);node.position[1]=f(node.position[1]+height);}
      else if(node.state===1&&++node.counter>59)node.deleted=true;
    }else if(node.kind==='chat-icon'){if(++node.counter>=node.duration)node.deleted=true;}
    else if(node.kind==='puff'){if(animate(node,1,ctx.mainState)===1)node.deleted=true;}
    else if(node.kind==='pet-transition'){if(node.parent.deleted)node.deleted=true;animate(node,0,ctx.mainState);}
    else if(node.parent.deleted){node.deleted=true;}
    else if(node.kind==='status'){animate(node,0,ctx.mainState);node.position=[node.parent.body.position[0],f(node.parent.body.position[1]+1)];}
    else if(node.kind==='death'){animate(node,0,ctx.mainState);deathPosition(node);}
    else if(node.kind==='indicator'){
      const target=node.parent.body.indicatorShift;if(target!==0&&node.counter> -10)node.counter--;else if(target===0&&node.counter<0)node.counter++;
      animate(node,0,ctx.mainState);node.actorFlags=ctx.mainState===10&&ctx.substate===6?node.actorFlags&~2:node.actorFlags|2;
      const appearance=node.player.copyState();if((appearance.drawFlags&8)&&(appearance.color>>>24)===0)node.actorFlags=2;
      node.position=[f(node.parent.body.position[0]+node.counter),node.parent.body.position[1]];
    }
    screen(node);return 'advanced';
  }
  const api=Object.freeze({
    advancing(){return busy;},
    configureSkills(value){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return strike.configure(value);},
    skillsConfigured(){active();return strike.configured();},
    canRebind(body,resource,element,facing){active();return sharedStorage.canRebind(body,resource,element,facing);},
    recordVital(event){active();producerEvents.push(event);},
    setDeparture(body){
      active();
      random.seed(body.slot);
      const x=layout[entrySlots[random.range(0,19)]].entry[0];
      const y=layout[entrySlots[random.range(0,19)]].entry[1];
      body.departureTarget=[x,y];
    },
    markFriendKnown(body){active();casting.markFriendKnown(body);},
    queueChat(body,duration){return produce(()=>{
      events.push(Object.freeze({kind:'sound',value:0x4a,nodeId:null,slot:null,position:Object.freeze([320,240])}));
      const speaker=bodyNodes.get(body),height=speaker?.player.copyState().geometry?.height;
      if(height===undefined||!probeAnimation(0x573f,0).state.geometry||nodes.length>=4096)return null;
      const icon=allocate('chat-icon',null,{position:[f(body.position[0]-30),f(body.position[1]-height)],screenSpace:true,
        resourceId:0x573f,actorFlags:0x40000,drawPriority:204,height:-8,duration});
      animate(icon,1,10);
      return icon.id;
    });},
    prepareBattleTime(body,seconds){
      active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');
      if(!strike.configured())return false;
      let glyphs;
      try{glyphs=strike.prepareTimeGlyphs(seconds);}
      catch(error){if(error?.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED')return false;throw error;}
      if(nodes.length+glyphs.length>4096)return false;
      bodyNodes.get(body).timeGlyphs=glyphs;
      return true;
    },
    queueGMN(command,owner,resourceCode){return produce(()=>gmn.queue(command,owner,resourceCode));},
    validateSkill404(plan,tail){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return skill404.validate(plan,tail);},
    queueSkill404(plan,owner){return produce(()=>skill404.queue(plan,owner));},
    validateStrike(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');strike.validate(plan);},
    validatePhysicalFamily(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return physical.validate(plan);},
    validateStatus(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');strike.validateStatus(plan);},
    validateCasting(plan){
      active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');
      if(plan.category===400){
        if(nodes.length+1+plan.hits.length>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
        const resources=new Set([plan.resources.chant]);
        for(let id=0x70e9;id<=0x70f0;id++)strike.image(id);
        if(plan.hits.length){
          resources.add(plan.resources.projectile);
          resources.add(plan.resources.projectile<0x1adde?0x1adb7:0x1adb6);
        }
        for(const {flags} of plan.hits){
          if((flags&0x10000008)===0x10000000)resources.add(0x57bb);
          if(flags&0x200000)resources.add(0x5739);
          if(flags&0x1400000)resources.add(0x573a);
          if(flags&0x2000000)resources.add(0x5738);
        }
        for(const resource of resources){
          if(!probeAnimation(resource,0).state.geometry)fail('LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');
        }
        return;
      }
      if(plan.category===401){
        const targets=plan.hits.filter(hit=>hit.flags&0x80000);
        if(nodes.length+1+30*targets.length>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
        for(let id=0x70d9;id<=0x70e0;id++)strike.image(id);
        if(!probeAnimation(plan.resources.chant,0).state.geometry)fail('LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');
        if(targets.length&&!probeAnimation(battleWeatherCastEffect,0).state.geometry)fail('LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');
        for(const {slot} of targets){
          if(!bodyNodes.get(access.get(slot))?.player.copyState().geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
        }
        return;
      }
      if(plan.sideTargets){
        if(nodes.length+1+plan.sideTargets.length>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
        for(const resource of [plan.resources.chant,battleSideCastEffect]){
          if(!probeAnimation(resource,0).state.geometry)fail('LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');
        }
        for(const slot of plan.sideTargets){
          if(!bodyNodes.get(access.get(slot))?.player.copyState().geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
        }
        return;
      }
      if(!plan.transforms){casting.validate(plan);return;}
      if(nodes.length+2+plan.transforms.length>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
      if(plan.field>=0)strike.image(plan.field);
      const resources=new Set([plan.resources.chant]);
      for(const {slot,base,rider:mounted,attachment:linked} of plan.transforms){
        resources.add(base);
        if(mounted>0&&bodyNodes.get(access.get(slot))?.children.has('rider')){
          resources.add(mounted);
          resources.add(resolveLegacyGameMountedResource(base));
        }
        if(linked>0)resources.add(linked);
      }
      for(const resource of resources)probeAnimation(resource);
    },
    validateStatusSkill(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');
      if(plan.category===98&&plan.variant===12)skill82.validate(plan);
      statusSkills.validate(plan);
      upperSkills.validate(plan);
    },
    validateImpactSkill(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return impactSkills.validate(plan);},
    finishImpactSkill(body,category){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');const node=bodyNodes.get(body);if(node)impactSkills.finish(node,category);},
    reanchorSlot(body){
      const node=bodyNodes.get(body);
      for(const kind of ['rider','attachment']){
        const child=node?.children.get(kind);
        if(child)child.anchorSlot=body.slot;
      }
    },
    validateSkill82(plan){active();skill82.validate(plan);},
    validateNumericSkill(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');numericSkills.validate(plan);},
    validateCombination(plan,flags){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return combination.validate(plan,flags);},
    validateSharedStorage(plan){
      active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');
      for(const resourceId of plan.resources)probeAnimation(resourceId,0);
      if(plan.producer==='ITM0')for(const {assignments} of plan.rows){
        if(assignments.numberStyle===5)strike.validateStatus({style:5,amount:assignments.numberValue});
      }
    },
    validateRiding(plan){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return riding.validate(plan);},
    queueRiding(plan,owner){return run(()=>riding.queue(plan,owner));},
    queueCombination(plan,owner){return run(()=>combination.queue(plan,owner));},
    copyCombination(owner){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return combination.state(owner);},
    resetCombinationCounter(owner){return run(()=>combination.resetCounter(owner));},
    activateNextCombination(owner,flags){return run(()=>combination.activateNext(owner,flags));},
    releaseCombination(owner){return run(()=>combination.release(owner));},
    validateAttachedRID(plan,primary){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return attachedRID.validate(plan,primary);},
    queueAttachedRID(plan,owner){return run(()=>attachedRID.queue(plan,owner));},
    discardPendingAttachedRID(body){return run(()=>attachedRID.discardPrepared(bodyNodes.get(body),false));},
    characterFlags(value){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');statusSkills.characterFlags(value);},
    configureCastingContext(value){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');const q=fields(value,['entryMode','labelFlag','localSlot']);integer(q.entryMode);integer(q.labelFlag,0,5);integer(q.localSlot,0,21);casting.configureContext(q);},
    advanceBackground(){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');backgroundState=casting.backgroundPass(phase);return backgroundState;},
    applyDrawPriorities(rows){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');if(!Array.isArray(rows))fail('LEGACY_BATTLE_FRAME_NODE_ID');const d=Object.getOwnPropertyDescriptors(rows),count=integer(d.length.value,0,4096),seen=new Set(),assignments=[];if(Reflect.ownKeys(d).length!==count+1)fail('LEGACY_BATTLE_FRAME_NODE_ID');
      for(let i=0;i<count;i++){if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_BATTLE_FRAME_NODE_ID');const r=fields(d[i].value,['id','priority']);integer(r.id,1,Number.MAX_SAFE_INTEGER);integer(r.priority,0,255);const n=nodes.find(n=>n.id===r.id);if(!n||seen.has(r.id))fail('LEGACY_BATTLE_FRAME_NODE_ID');seen.add(r.id);assignments.push([n,r.priority]);}for(const[n,priority]of assignments)n.drawPriority=priority;},
    created(body){return run(()=>createBodyNode(body));},
    createSummonBodies(bodies){return run(()=>{
      if(nodes.length+bodies.length>4096||!Number.isSafeInteger(nextId+bodies.length))fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
      for(const body of bodies){
        createBodyNode(body);
        casting.markFriendKnown(body);
      }
    });},
    character(body,rawFlags,previousDead){return run(()=>{const node=bodyNodes.get(body);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');
      rider(node,body.resourceId,body.linkedResources[0]);attachment(node,body.linkedResources[1]);body.drawFlagMask=body.resourceId>0x1af0d&&body.resourceId<0x1af26?4:0;if(body.drawFlagMask)body.drawFlagValue=4;
      if(!(rawFlags&1)&&!previousDead&&(rawFlags&2)){
        body.animationAction=10;let count=0;while(animate(node,1,10)!==1){if(++count>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');}death(node,10);
      }
      for(let i=0;i<6;i++){const bit=16<<i;if(!(rawFlags&bit))body.dynamicFlags&=~bit;
        else if(!node.children.has('status')){body.dynamicFlags|=bit;const child=effect(node,'status',0x1adfb+i,{position:[body.position[0],f(body.position[1]+1)]});animate(child,1,10);screen(child);node.children.set('status',child);}}
      if(rawFlags&0x400)ensureIndicator(node,true,10);else removeChild(node,'indicator');
      statusSkills.character(node,rawFlags);casting.character(node,rawFlags);
      // 433cd0 invokes4fd5f0(mode0) again after its character/selection updates.
      animate(node,0,10);
    });},
    changeCharacter(body,plan){return run(()=>{const node=bodyNodes.get(body);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');if(nodes.length+(plan.attachmentResource>0&&!node.children.has('attachment')?1:0)>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');body.resourceId=plan.resourceId;body.vitals=[...plan.vitals];if(node.children.has('rider')&&plan.riderResource!==0)rider(node,body.resourceId,plan.riderResource);attachment(node,plan.attachmentResource);});},
    indicator(body,first){return run(()=>{const node=bodyNodes.get(body);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');return ensureIndicator(node,first,10).id;});},
    entryFacing(controlFlags){return run(()=>{const changed=[];
      for(let slot=0;slot<20;slot++){if(!(controlFlags&(slot<10?2:1)))continue;const body=access.get(slot);if(!body)continue;const node=bodyNodes.get(body);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');
        body.angle=legacyGameBattleAngle(f(layout[slot].entry[0]-layout[slot].target[0]),f(layout[slot].entry[1]-layout[slot].target[1]));body.facing=legacyGameBattleFacing(body.angle);animate(node,1,10);changed.push(slot);}
      return Object.freeze(changed);
    });},
    markEntryDeleted(weatherDirection=-1){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');if(weatherDirection!==null)rain.reset(weatherDirection);
      producerEvents.length=0;gmn.reset();sharedStorage.resetBackground();casting.resetEntry();statusSkills.reset();backgroundState=null;directDraws=[];directDrawingUsed=false;for(const node of nodes){node.deleted=true;if(node.kind==='body')node.body.deleted=true;}},
    finishWeather(){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');rain.finish();},
    advanceOrdinaryRain(direction){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');return rain.advanceOrdinary(direction);},
    remove(body){const node=bodyNodes.get(body);if(node){node.deleted=true;for(const child of node.children.values())child.deleted=true;}},
    step(sourceContext){const d=Object.getOwnPropertyDescriptors(sourceContext),ctx={};
      for(const key of ['mainState','substate','slowEffects']){if(!Object.hasOwn(d[key]??{},'value'))fail('LEGACY_BATTLE_PLAYBACK_CONTEXT');ctx[key]=d[key].value;}
      if(Object.hasOwn(d.localSlot??{},'value'))ctx.localSlot=integer(d.localSlot.value,0,21);
      integer(ctx.mainState);integer(ctx.substate);if(typeof ctx.slowEffects!=='boolean')fail('LEGACY_BATTLE_PLAYBACK_CONTEXT');
      return run(()=>{
      const results=[];events=producerEvents.splice(0);directDraws=[];casting.beginPass();gmn.beginPass();sharedStorage.beginPass(ctx.substate);let index=0,visited=0,stopRequested=false;
      while(index<nodes.length){if(++visited>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');const node=nodes[index],flags=node.kind==='body'?node.body.actorFlags:node.actorFlags;
        if((flags&0x40000)&&(ctx.slowEffects||casting.slow()===1)&&phase!==0){results.push(Object.freeze({id:node.id,kind:node.kind,result:'quarter-gated'}));index++;continue;}
        if(node.deleted){node.player.close();if(node.copiedBody)access.dispose(node.copiedBody);if(node.kind==='body'){attachedRID.discardPrepared(node);bodyNodes.delete(node.body);access.dispose(node.body);}else if((node.kind==='rider'||node.kind==='attachment')&&node.parent.children.get(node.kind)===node)node.parent.children.delete(node.kind);nodes.splice(index,1);results.push(Object.freeze({id:node.id,kind:node.kind,result:'removed'}));continue;}
        if(node.callbackDisabled){results.push(Object.freeze({id:node.id,kind:node.kind,result:'callback-disabled'}));index++;continue;}
        const previousScreen=node.kind==='body'?[...node.screen]:null,result=node.kind==='body'?stepBody(node,ctx):stepEffect(node,ctx);if(node.kind==='body'&&result!=='gated'&&!result.endsWith('unavailable')){movingNumeric.afterBody(node,previousScreen);updateLinks(node,ctx);}if(result==='stop')stopRequested=true;
        results.push(Object.freeze({id:node.id,kind:node.kind,slot:node.body?.slot??null,result}));
        index=nodes.indexOf(node)+1;active();
      }
      if(ctx.mainState===10&&ctx.substate>=2&&ctx.substate<=6)rain.step();
      phase=(phase+1)&3;passes++;return Object.freeze({kind:'battle-body-callback-pass',passes,phase,stopRequested,results:Object.freeze(results),events:Object.freeze([...events]),renderer:'unimplemented'});
    });},
    copyState(){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');const gmnWindowSubmissions=gmn.presentation(),backgroundResource=sharedStorage.backgroundResource(),weather=rain.copyState();return Object.freeze({profile:LEGACY_GAME_BATTLE_PLAYBACK_PROFILE.id,status,phase,passes,seed:random.copySeed(),alternativeRenderer:c.alternativeRenderer,
      ...(weather?{weather}:{}),
      ...(castingUsed?{casting:casting.snapshot()}:{}),...(backgroundState?{backgroundState}:{}),
      ...(backgroundResource!==null?{backgroundResource}:{}),
      ...(gmn.snapshot()?{gmnPaletteRequest:gmn.snapshot()}:{}),
      ...(gmnWindowSubmissions?{gmnWindowSubmissions}:{}),
      ...(directDrawingUsed?{directSubmissions:Object.freeze([...directDraws])}:{}),
      ...(statusSkills.snapshot().used?{statusSkills:statusSkills.snapshot()}:{}),
      ...(physical.sequenceState()?{physicalSequence:physical.sequenceState()}:{}),
      ...(attachedRID.snapshot()?{attachedRID:attachedRID.snapshot()}:{}),
      ...(combination.snapshot()?{combination:combination.snapshot()}:{}),
      ...(riding.snapshot()||sharedStorage.used()?{sharedStorage:Object.freeze({...riding.snapshot(),cells:Object.freeze(nodes.filter(n=>n.kind==='body').map(n=>Object.freeze({bodyId:n.id,body105c:n.shared105c?.id??null,body13b4:n.children.get('rider')?.id??null,actor10:n.children.get('chant')?.id??null}))),actorCopies:Object.freeze(nodes.filter(n=>n.copiedBody).map(n=>Object.freeze({id:n.id,body:access.copyBody(n.copiedBody),body105c:n.shared105c?.id??null,childPointers:Object.freeze([...n.children].map(([kind,child])=>Object.freeze({kind,id:child.id})))})))})}:{}),
      nodes:Object.freeze(nodes.map(n=>Object.freeze({id:n.id,kind:n.kind,slot:n.body?.slot??null,parentId:n.parent?.id??null,deleted:n.deleted,priority:n.priority,drawPriority:n.drawPriority,
        state:n.kind==='body'?n.body.state:n.state,counter:n.counter,height:n.height,actorFlags:n.kind==='body'?n.body.actorFlags:n.actorFlags,
        position:Object.freeze([...(n.kind==='body'?n.body.position:n.position)]),screen:Object.freeze([...n.screen]),
        resourceId:n.kind==='body'?n.body.resourceId:n.resourceId,scale:Object.freeze(n.kind==='body'?[...n.body.scale]:n.kind==='rider'?[...n.parent.body.scale]:n.scale?[...n.scale]:[1,1]),depthKey:0,alternateY:n.alternateY??0,
        drawFlagMask:n.kind==='body'?n.body.drawFlagMask:n.drawFlagMask??4,
        drawFlagValue:n.kind==='body'?n.body.drawFlagValue:n.drawFlagValue??4,
        ...(combination.nodeState(n)?{combinationBanner:combination.nodeState(n)}:{}),
        ...gmn.nodeState(n),
        ...(n.presentationAlpha!==undefined&&n.presentationAlpha<255?{opacity:n.presentationAlpha}:{}),
        ...(n.presentationMask?{drawColorOverride:Object.freeze({mask:n.presentationMask,color:(((n.presentationColor??0xffffffff)&0xffffff)|((n.presentationAlpha??255)<<24))>>>0})}:{}),
        ...(n.ridPresentation?{ridPresentation:Object.freeze({nameBytes:n.ridPresentation.nameBytes.slice(),value1d0:n.ridPresentation.value1d0,vitals:Object.freeze([...n.ridPresentation.vitals])})}:{}),
        ...(n.physicalSpecial?{physicalSpecial:physicalSpecials.snapshot(n)}:{}),
        ...(n.physicalRole?{physical:Object.freeze({role:n.physicalRole,principal:n.body.slot,classCode:n.body.classCode,variant:n.body.physicalVariant,level:n.body.skillLevel,
          angle:n.body.angle,speed:n.body.speed,cooldown:n.body.attackCooldown,tupleRead:n.body.tupleRead,tupleWrite:n.body.tupleWrite,tuples:n.body.tuples.slice(),
          turnRate:n.physicalFlow.turnRate,headingSign:n.physicalFlow.headingSign,waypoint:Object.freeze([...n.physicalFlow.waypoint])})}:{}),
        ...(n.kind==='casting-projectile'?{casting:Object.freeze({family:n.castKind,ownerSlot:n.ownerSlot,classCode:n.classCode,level:n.skillLevel,tupleRead:n.castRead,tuples:n.castTuples.slice(),delay:n.castDelay,cooldown:n.castCooldown,trail:n.castTrail,finish:n.castFinish,angle:n.angle,speed:n.speed,turn:n.castTurn})}:{}),
        ...(n.kind.startsWith('status-skill-')?{statusSkill:Object.freeze({completed:n.completedParticles??null,emitted:n.emittedParticles??null,emitterIndex:n.emitterIndex??null,emitterSlots:n.emitterSlots?.slice()??null,velocity:n.velocity??null,acceleration:n.acceleration??null,crossing:n.crossing??null,...(n.kind==='status-skill-modifier'?{modifier:Object.freeze({kind:n.modifierType,offsetX:n.modifierX,offsetY:n.modifierY})}:{})})}:{}),
        animation:Object.freeze({...n.staticFrame??n.player.copyState(),...(n.ridGraphicMissing?{graphicIndex:-1}:{}),...(n.presentationOffset?{drawOffsetX:n.presentationOffset[0],drawOffsetY:n.presentationOffset[1]}:{})})}))),renderer:'unimplemented',main10Driver:'unimplemented'});},
    clear(){active();if(busy)fail('LEGACY_BATTLE_PLAYBACK_REENTRANT');rain.reset();producerEvents.length=0;gmn.reset();sharedStorage.reset();statusSkills.reset();attachedRID.clear();riding.clear();combination.clear();for(const node of nodes){node.player.close();if(node.copiedBody)access.dispose(node.copiedBody);if(node.kind==='body')access.dispose(node.body);}nodes.length=0;bodyNodes.clear();events=[];directDraws=[];directDrawingUsed=false;},
    close(){if(status==='closed')return;status='closed';rain.reset();producerEvents.length=0;gmn.reset();sharedStorage.reset();statusSkills.reset();attachedRID.clear();riding.clear();combination.clear();for(const node of nodes){node.player.close();if(node.copiedBody)access.dispose(node.copiedBody);if(node.kind==='body')access.dispose(node.body);}nodes.length=0;bodyNodes.clear();events=[];directDraws=[];directDrawingUsed=false;},
  });return api;
}

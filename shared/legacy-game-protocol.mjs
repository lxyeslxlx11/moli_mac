/** Legacy source-bound byte protocol. No socket, account, automatic login or native handler execution. */
import { createLegacyGameEnvelopeReader, encodeLegacyGameEnvelope } from './legacy-game-envelope.mjs';
import { createLegacyGamePayloadCodecFromBootstrap } from './legacy-game-payload.mjs';
import { LEGACY_GAME_MESSAGE_PROFILE, LegacyGameMessageError, decodeLegacyGameMessage,
  decodeLegacyGameBinary, encodeLegacyGameCommand } from './legacy-game-message.mjs';
import { createLegacyGameMapState } from './legacy-game-map.mjs';
import { legacyGameMinimapWindow } from './legacy-game-minimap.mjs';
import { prepareLegacyGameSceneTransition } from './legacy-game-scene.mjs';
import { createLegacyGameState, decodeLegacyGameSceneLabel } from './legacy-game-state.mjs';
import { createLegacyGameActors,legacyGameActorFrameAccess } from './legacy-game-actors.mjs';
import { createLegacyGameMovementCommand,legacyGameFacingCode } from './legacy-game-motion.mjs';
import { LEGACY_GAME_ORDINARY_ENTRY, legacyInputPair } from './legacy-game-input.mjs';
import { createLegacyGameMapDialog } from './legacy-game-map-dialog.mjs';
import { createLegacyGameMapChat, isLegacyGameMapChatConsumer } from './legacy-game-map-chat.mjs';
import { createLegacyGameFamily, isLegacyGameFamilyConsumer } from './legacy-game-family.mjs';
import { createLegacyGamePlayerTrade, isLegacyGamePlayerTradeConsumer } from './legacy-game-player-trade.mjs';
import { legacyGameGraphicMetadata } from './legacy-game-graphics.mjs';
import { legacyGameCollisionWindow,createLegacyGameCollisionGridFromRectangle } from './legacy-game-navigation.mjs';
import { createLegacyGameLocalMovement,ordinaryLegacyGameMovement,snapshotLegacyGameLocalContext,snapshotLegacyGameLocalDestination,legacyGameLocalMovementFacingAssigned,legacyGameLocalMovementBodyFacing,legacyGameLocalMovementAnimationAssigned,legacyGameLocalMovementPartyAccess } from './legacy-game-local-movement.mjs';
import { createLegacyGameActorFrameController,snapshotLegacyGameFrameRequest } from './legacy-game-frame.mjs';
import { createLegacyGameSceneFrameController } from './legacy-game-scene-frame.mjs';
import {createLegacyGameBattleState} from './legacy-game-battle.mjs';
import {createBattleFriendRoster} from './legacy-game-battle-friends.mjs';
import {createLegacyGameDrawPlan} from './legacy-game-draw-plan.mjs';
import {legacyGameRainDraws} from './legacy-game-battle-rain.mjs';
import {createLegacyGamePresentation} from './legacy-game-presentation.mjs';
import {createLegacyGameTextBatch} from './legacy-game-text.mjs';
import {createLegacyGameWater} from './legacy-game-water.mjs';
import {createLegacyGameCraft} from './legacy-game-craft.mjs';

import {planLegacyGamePartyCommand,legacyGamePartyNeighbor} from './legacy-game-party.mjs';

const runtimeWorlds=new WeakSet();
export function legacyGameRuntimeWorld(value){if(!runtimeWorlds.has(value))throw new LegacyGameMessageError('LEGACY_GAME_RUNTIME_WORLD_REQUIRED');return value;}
const fail=code=>{throw new LegacyGameMessageError(code);};
const binaryPrefix=bytes=>bytes.length>=3&&bytes[0]===93&&((bytes[1]===94&&bytes[2]===105)||(bytes[1]===80&&bytes[2]===107));
function poseCopy(pose){return pose?Object.freeze({coordinates:Object.freeze([...pose.coordinates]),
  scaledCoordinates:Object.freeze([...pose.scaledCoordinates]),facingCode:pose.facingCode,motion:Object.freeze([...(pose.motion??[0,0])]),
  scope:pose.scope??'network-position-projection',nativeActorSynchronization:pose.scope?'partial-source-local-movement':'unmodeled'}):null;}
const labelCopy=label=>label?Object.freeze({...label,labelBytes:label.labelBytes.slice()}):null;

function createProtocol(worldEnabled,receiveClock=null,wallSeconds=null){
  const reader=createLegacyGameEnvelopeReader();let codec=null,awaitingBootstrap=true,state='open',pose=null,mapState=null,scene=null,label=null;
  let recordState=worldEnabled?createLegacyGameState():null;
  let actorState=worldEnabled?createLegacyGameActors():null;
  const family=worldEnabled?createLegacyGameFamily():null;
  function shopGold(){
    const value=recordState.readInteger('state-4efad0','field-27');
    return value!==null&&value>=0?value:null;
  }
  const mapDialog=worldEnabled?createLegacyGameMapDialog(
    ()=>({gold:shopGold(),slots:battleState.copyItemSlots(false)}),
    ()=>({
      gold:shopGold(),capacity:recordState.readInteger('state-4f0000','field-17'),
      roster:battleState.copyPlayerSkillRoster(),
    }),
    ()=>({gold:shopGold(),roster:battleState.copyPetTrainingRoster(),version:battleState.petVersion()}),
    ()=>({code:recordState.readInteger('state-4f0000','field-16'),category:actorState.copyState().resourceCode}),
    family.petPermissions,
  ):null;
  const playerTrade=worldEnabled?createLegacyGamePlayerTrade(()=>({
    gold:shopGold(),items:battleState.copyItemSlots(),pets:battleState.copyPets(),
  })):null;
  const mapChat=worldEnabled?createLegacyGameMapChat((actorId,name,body,mic,color,style)=>{
    const tick=receiveClock?.()??null;
    active();
    return legacyGameActorFrameAccess(actorState).receiveChatSpeech(actorId,name,body,mic,color,style,tick);
  }):null;
  let battleFriends=worldEnabled?createBattleFriendRoster():null;
  function weatherDirection(){
    const motion=actorState?.copyLocalActor()?.motion;
    return motion?.moving&&Number.isInteger(motion.facingCode)&&motion.facingCode>=0&&motion.facingCode<=7?motion.facingCode:-1;
  }
  const presentation=worldEnabled?createLegacyGamePresentation():null;
  const water=worldEnabled?createLegacyGameWater():null;
  let pendingWaterFrame=null;
  let waterFrameContext=null,waterPosition=null,waterNativeGate=0;
  let battleState=worldEnabled?createLegacyGameBattleState({
    identity(){return scene?.identity??[0,0];},
    battleLabelValues(){return actorState.copyState().labelCatalog.records?.map(r=>r.value)??[];},
    weatherDirection,
    begin(){craft?.invalidate();waterPosition=actorState.copyLocalActor()?.motion.position??waterPosition??pose?.scaledCoordinates??null;waterNativeGate=1;mapDialog.clear();playerTrade.clear();actorState.beginBattle();resetLocal();resetGrid();actorFrames?.synchronize();pendingReturnFrame=null;},
    leave(){waterNativeGate=0;actorState.leaveBattle();},
    waterContext(){const context=waterFrameContext??returnContext;if(!scene||!context)return null;const local=actorState.copyLocalActor(),position=local?.motion.position??pose?.scaledCoordinates??waterPosition??scene.scaledCoordinates;
      return {mapId:scene.identity[1],position,camera:context.camera,center:context.center,nativeGate:waterNativeGate,localPresent:local!==null};},
    frame(tick,stage,phase){return advanceReturnFrame(tick,stage,phase);},
  },presentation,battleFriends.match,water):null;
  let entryAppearance=null,sourceEntryWaitMask=null,lastShortcutTick=0,lastPickupTick=0,lastRightTurnTick=0;
  let actorFrames=null,sceneFrames=null,frameBusy=false,actorLabelMode=0,actorBarsVisible=false;
  let localMovement=null,navigationGrid=null,navigationKey=null,navigationGraphics=null,navigationContext=null,localMovementUnavailable=null;
  let sourceMovement = false, calendar = null;
  let returnContext=null,pendingReturnFrame=null;
  const craft=worldEnabled?createLegacyGameCraft({
    skills:()=>battleState.copyWorkSkills(),skill:slot=>battleState.copyPlayerSkill(slot),
    knowsProduct:id=>battleState.knowsCraftProduct(id),
    recipes:slot=>battleState.copyPlayerCraftRecipes(slot),items:()=>battleState.copyCraftItems(),
    mp:()=>recordState.readInteger('state-4efad0','field-03'),
    location:()=>ensureLocal().copyState(),
    workContext:()=>({mode:battleState.workContextMode(),tier:recordState.readInteger('state-4f0000','field-15'),
      remainingMilliseconds:battleState.inspect().sideEffects?.timer?.remainingMilliseconds??null,
      rideChild:!!actorState.copyLocalActor()?.ride?.child}),
    setWorkContext:mode=>battleState.setWorkContext(mode),
    targetContext:()=>{
      const actors=actorState.copyState(),read=(id,field)=>recordState.readInteger(id,field);
      return {self:{nameBytes:recordState.copyBytes('state-4efad0','field-29')??new Uint8Array(),
        level:read('state-4efad0','field-15'),health:read('state-4f0000','field-12'),
        HP:read('state-4efad0','field-01'),maxHP:read('state-4efad0','field-02'),MP:read('state-4efad0','field-03'),maxMP:read('state-4efad0','field-04')},
        party:actors.party.rows.filter(row=>row.active&&row.actorId!==actors.localId).map(row=>({
          nameBytes:row.bound?actors.remoteActors.find(a=>a.id===row.actorId)?.labels[0]??new Uint8Array():new Uint8Array()})),
        pets:battleState.copyPets().records.map(row=>({present:row.present,mode:row.fields[0x6aa],
          nameBytes:row.nicknameBytes.length?row.nicknameBytes:row.nameBytes,level:row.fields[8],health:row.fields[0xd4],
          HP:row.fields[0x10],maxHP:row.fields[0x20],MP:row.fields[0x30],maxMP:row.fields[0x40]}))};
    },
  }):null;
  let cityReturn=false;
  const active=()=>{if(state!=='open')fail('LEGACY_GAME_PROTOCOL_CLOSED');};
  const publicActive=()=>{active();if(frameBusy||actorFrames?.inspect().advancing)fail('LEGACY_GAME_FRAME_REENTRANT');};
  const resetGrid=()=>{navigationGrid?.close();navigationGrid=null;navigationKey=null;};
  const resetLocal=reason=>{
    if (sourceMovement && localMovement) {
      const {nativeInteractionSequence,lastTurnTick} = localMovement.copyState().context;
      navigationContext = Object.freeze({...navigationContext,nativeInteractionSequence,lastTurnTick});
    }
    localMovement?.close();localMovement=null;localMovementUnavailable=reason??null;
  };
  function sampleWallSeconds() {
    const previous = frameBusy;
    frameBusy = true;
    try {
      const now = wallSeconds();
      active();
      if (!Number.isInteger(now) || now < 0 || now > 0xffffffff) fail('LEGACY_GAME_CALENDAR_CLOCK');
      return now;
    } finally { frameBusy = previous; }
  }
  function currentEventSelector() {
    if (!calendar) fail('LEGACY_GAME_CALENDAR_NOT_READY');
    const seconds = (calendar.base + sampleWallSeconds() - calendar.received) >>> 0;
    return Math.floor((seconds % 7200) / 300);
  }
  const cleanup=()=>{craft?.close();pendingWaterFrame=null;waterFrameContext=waterPosition=null;water?.close();sceneFrames?.close();sceneFrames=null;actorFrames?.close();actorFrames=null;codec?.close();codec=null;reader.close();pose=null;mapState?.close();mapState=null;scene=null;
    label?.labelBytes.fill(0);label=null;recordState?.close();recordState=null;actorState?.close();actorState=null;mapDialog?.clear();playerTrade?.clear();family?.clear();mapChat?.close();
    battleState?.close();battleState=null;battleFriends?.close();battleFriends=null;presentation?.close();returnContext=pendingReturnFrame=null;resetLocal();resetGrid();navigationGraphics=null;navigationContext=null;calendar=null;entryAppearance=null;sourceEntryWaitMask=null;actorLabelMode=0;actorBarsVisible=false;};
  const getGrid=center=>{
    if(!mapState||!scene)fail('LEGACY_GAME_NAVIGATION_MAP_REQUIRED');const metadata=mapState.inspect(),rect=legacyGameCollisionWindow(metadata.width,metadata.height,center),key=rect.join(':')+':'+metadata.updates+':'+metadata.mode;
    if(navigationGrid&&navigationKey===key)return navigationGrid;const selected=mapState.readRectangle(rect);let replacement;
    try{replacement=createLegacyGameCollisionGridFromRectangle(metadata.width,metadata.height,rect,selected.planes,metadata.mode,navigationGraphics);}
    finally{for(const p of selected.planes)p.fill(0);}
    resetGrid();navigationGrid=replacement;navigationKey=key;return replacement;
  };
  const commitLocal=(facingAssigned=true,animationAssigned=legacyGameLocalMovementAnimationAssigned(localMovement))=>{const current=localMovement.copyState();actorState.applyLocalMovement(current.position,current.display,current.target,current.velocity,
    current.facingCode,current.speed,current.moving,current.animation,current.phase,facingAssigned,animationAssigned);
    pose={coordinates:[...current.display],scaledCoordinates:[...current.position],facingCode:current.facingCode,motion:[...current.velocity],scope:'ordinary-local-movement-projection'};return current;};
  const observeLocal=()=>{if(!localMovement)return;const current=actorState.copyLocalActor();if(!current){resetLocal('local-actor-removed');return;}
    if(current.motion.speed!==null)localMovement.setSpeed(current.motion.speed);localMovement.observeAnimation(current.motion.animation,current.motion.phase,current.normalFacingCode);};
  const syncPartyContext=()=>{if(!navigationContext||!actorState)return;const party=legacyGameActorFrameAccess(actorState).partyContext();if(!party)return;
    navigationContext=Object.freeze({...navigationContext,...party});if(localMovement){const c=localMovement.copyState().context;if(c.nativePartyMode!==party.nativePartyMode||c.nativePartyFlags!==party.nativePartyFlags)localMovement.setContext({...c,...party});}};
  const ensureLocal=()=>{
    if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');if(!navigationContext)fail('LEGACY_GAME_LOCAL_CONTEXT_REQUIRED');if(localMovementUnavailable)fail('LEGACY_GAME_LOCAL_CONTEXT_STALE');
    if(sourceEntryWaitMask)fail('LEGACY_GAME_LOCAL_ENTRY_WAIT');
    syncPartyContext();if(localMovement)return localMovement;const actor=actorState.copyLocalActor();
    if(!actor)fail('LEGACY_GAME_LOCAL_ACTOR_REQUIRED');if(actor.motion.speed===null)fail('LEGACY_GAME_LOCAL_SPEED_REQUIRED');if(actor.motion.display===null)fail('LEGACY_GAME_LOCAL_POSITION_REQUIRED');
    const context = sourceMovement ? {...navigationContext,nativeEventSelector:currentEventSelector()} : navigationContext;
    const m=actor.motion,replacement=createLegacyGameLocalMovement(m.display,m.speed,actor.normalFacingCode,context,m.phase,m.animation,m.moving);
    try{getGrid(m.display);replacement.restorePosition(m.position,m.display,m.target,m.velocity,m.moving);active();localMovement=replacement;return replacement;}
    catch(error){replacement.close();throw error;}
  };
  const battleGuard=()=>{if(battleState?.inspect().pending)fail('LEGACY_GAME_BATTLE_ACTIVE');};
  const partyChatContext=()=>{
    publicActive();battleGuard();
    if(!mapChat||!scene||battleState.ordinaryGated()||mapDialog.active()||playerTrade.active())fail('LEGACY_GAME_CHAT_CONTEXT');
    return legacyGameActorFrameAccess(actorState).partyContext()?.nativePartyMode===1;
  };
  const ordinaryItems=()=>{publicActive();battleGuard();if(!battleState||!scene)fail('LEGACY_GAME_SCENE_REQUIRED');
    if(playerTrade.active())fail('LEGACY_GAME_TRADE_CONTEXT');if(craft.active())fail('LEGACY_CRAFT_CONTEXT');return battleState;};
  const inventoryTile=gateBaseline=>{
    if(legacyGameActorFrameAccess(actorState).ownGateByte(gateBaseline)&0x80)fail('LEGACY_GAME_ITEM_CONTEXT');
    return ensureLocal().copyState().display;
  };
  const advanceOwnedLocal=(tick,stage=0)=>{battleGuard();
    const controller=ensureLocal(),before=controller.copyState(),collision=getGrid(before.display),access=legacyGameActorFrameAccess(actorState),context=access.partyContext();
    if (sourceMovement) {
      const nativeEventSelector = currentEventSelector();
      if (before.context.nativeEventSelector !== nativeEventSelector) controller.setContext({...before.context,nativeEventSelector});
    }
    access.validateParty(stage);legacyGameLocalMovementBodyFacing(controller,actorState.copyLocalActor().motion.facingCode);let result=null,party=null;
    if(context?.nativePartyMode&&!(context.nativePartyFlags&0x100)){
      const port=legacyGameLocalMovementPartyAccess(controller);port.begin();
      party=access.advancePartyFrame(null,{start(point,speed){port.start(point,speed);commitLocal(legacyGameLocalMovementFacingAssigned(controller));},advance(scale){result=port.advance(collision,scale);commitLocal(legacyGameLocalMovementFacingAssigned(controller));}});
      if(!result){result=port.hold();commitLocal(false);}
    }else{result=controller.step(collision,tick,mapState.inspect().identity,scene.fields[11]);active();commitLocal(legacyGameLocalMovementFacingAssigned(controller));if(context)party=access.advancePartyFrame(result.startedAt??null,null);}
    return Object.freeze({...result,...(party?{party}:{} )});
  };
  const encodeCommand=(operationId,values)=>{
    active();if(!codec)fail('LEGACY_GAME_PROTOCOL_KEY_REQUIRED');const selected=codec;let plain,payload;
    try{plain=encodeLegacyGameCommand(operationId,values);active();if(codec!==selected)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');
      payload=selected.encode(plain);return encodeLegacyGameEnvelope(payload);}
    finally{plain?.fill(0);payload?.fill(0);}
  };
  const applyLocalUpdates=effect=>{for(const u of effect.localStateUpdates)recordState.applyActorGlobals(u.value15,u.firstLabel,u.secondLabel,u.speed);return effect;};
  const appendRain=(layer,rain)=>{
    if(!rain?.length||!layer?.drawPlan)return layer;
    const plan=layer.drawPlan,drops=legacyGameRainDraws(rain);if(!drops.length)return layer;
    const capacity=layer.waterRequested?4092:4093,objects=plan.commands.filter(c=>!c.waterStrip).length,admitted=drops.slice(0,Math.max(0,capacity-objects));
    const drawPlan=createLegacyGameDrawPlan(plan.width,plan.height,[...plan.commands,...admitted],plan.text,plan.palette),submitted=Object.freeze([...layer.submitted,...admitted.map(()=>Object.freeze({queue:'weather',kind:'battle-rain'}))]);
    return Object.freeze({...layer,drawPlan,submitted,drawOrder:Object.freeze(drawPlan.drawOrder.map(i=>submitted[i])),droppedDraws:layer.droppedDraws+drops.length-admitted.length});
  };
  const advanceFrame=(value,followLocal=false,returning=false,deferPresentation=false,waterMode='ordinary')=>{if(returning)active();else{publicActive();battleGuard();}if(typeof deferPresentation!=='boolean')fail('LEGACY_GAME_FRAME_PRESENTATION_MODE');if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');if(!actorFrames)fail('LEGACY_GAME_FRAME_CONFIGURATION_REQUIRED');if(!scene)fail('LEGACY_GAME_SCENE_REQUIRED');
      let request=snapshotLegacyGameFrameRequest(value);request=Object.freeze({...request,runtime:Object.freeze({...request.runtime,ownGateByte:legacyGameActorFrameAccess(actorState).ownGateByte(request.runtime.ownGateByte)})});const selectedScene=scene,selectedFrames=actorFrames;active();if(scene!==selectedScene||actorFrames!==selectedFrames)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');
      const wasBusy=frameBusy;frameBusy=true;try{
      let movement=null;const currentLocal=actorState.copyLocalActor();if(!returning&&navigationContext&&currentLocal&&(request.runtime.ownGateByte&128)===0){
        movement=advanceOwnedLocal(request.tick,request.runtime.runtimeStage);active();if(movement.party)request=Object.freeze({...request,runtime:Object.freeze({...request.runtime,movementScale:movement.party.movementScale})});
      }
      if(followLocal&&(request.runtime.ownGateByte&128)===0){const local=actorState.copyLocalActor();if(!local)fail('LEGACY_GAME_LOCAL_ACTOR_REQUIRED');request=Object.freeze({...request,camera:Object.freeze([...local.motion.position])});}
      let actorLayer=null,actorFrameError=null;
      try{actorLayer=selectedFrames.step(request,selectedScene.checksumMode,actorLabelMode,actorBarsVisible);active();if(scene!==selectedScene||actorFrames!==selectedFrames)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');}
      catch(error){active();let code;try{code=Object.getOwnPropertyDescriptor(error??{},'code')?.value;}catch{code=null;}
        active();
        actorFrameError=Object.freeze({code:typeof code==='string'&&/^LEGACY_[A-Z0-9_]{1,89}$/.test(code)?code:'LEGACY_GAME_ACTOR_FRAME_FAILED'});}
      if(!returning&&currentLocal)battleState.advanceTimer(request.tick);
      const rain=returning?null:battleState?.advanceOrdinaryRain(weatherDirection());
      let sceneLayer=null,sourceSceneLayer=null,sceneFrameError=null;const selectedSceneFrames=sceneFrames;
      if(selectedSceneFrames){try{if(!actorLayer)fail('LEGACY_SCENE_ACTOR_FRAME_REQUIRED');if(!mapState)fail('LEGACY_SCENE_MAP_REQUIRED');waterFrameContext=request;waterPosition=actorState.copyLocalActor()?.motion.position??pose?.scaledCoordinates??waterPosition??request.camera;const runs=selectedFrames.copyLabelRuns();sourceSceneLayer=selectedSceneFrames.step(request,selectedScene,mapState,selectedFrames.copySceneRoots(),runs.length?createLegacyGameTextBatch(runs):undefined,selectedFrames.copySceneOverlays(),deferPresentation,waterPosition,waterMode);active();
          sceneLayer=appendRain(sourceSceneLayer,rain);
          if(scene!==selectedScene||sceneFrames!==selectedSceneFrames)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');}
        catch(error){active();let code;try{code=Object.getOwnPropertyDescriptor(error??{},'code')?.value;}catch{code=null;}active();sceneFrameError=Object.freeze({code:typeof code==='string'&&/^LEGACY_[A-Z0-9_]{1,89}$/.test(code)?code:'LEGACY_GAME_SCENE_FRAME_FAILED'});}}
      if(localMovement&&actorLayer?.actors.some(a=>a.local&&a.handler==='source-ride')){const m=actorState.copyLocalActor().motion;localMovement.restorePosition(m.position,m.display,m.target,m.velocity,m.moving);pose={coordinates:[...m.display],scaledCoordinates:[...m.position],facingCode:m.facingCode,motion:[...m.velocity],scope:'ordinary-local-movement-projection'};}
      const announcements=!returning&&actorLayer?mapChat.advanceAnnouncements(request.tick):null;
      const chatPresentation=actorLayer?.chatSpeech||announcements?.length?Object.freeze({
        speech:actorLayer.chatSpeech??Object.freeze([]),announcements:announcements??Object.freeze([]),
      }):null;
      observeLocal();const result=Object.freeze({kind:'world-frame',movement,actorLayer,actorFrameError,...(selectedSceneFrames?{sceneLayer,sceneFrameError}:{}),
        ...(chatPresentation?{mapChatPresentation:chatPresentation}:{}),
        scope:selectedSceneFrames?'local-movement-and-ordinary-map-object-actor-scene':'local-movement-and-ordinary-actor-layer',currentVersionCompatibility:'unverified',...(followLocal?{camera:request.camera}:{} )});
      pendingWaterFrame=deferPresentation&&sourceSceneLayer?{result,owner:selectedSceneFrames,layer:sourceSceneLayer,rain,prepared:null}:null;return result;
      }finally{frameBusy=wasBusy;}
  };
  const advanceReturnFrame=(tick,stage,phase,context=returnContext,rebuildLocal=true)=>{active();const cached=actorState.copyReturnSource();
    if(!context||!cached.ready||!navigationContext||!scene||!mapState||!actorFrames||!sceneFrames||sourceEntryWaitMask)fail('LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE');
    const [x,y]=cached.coordinates,metadata=mapState.inspect();if(x<0||y<0||x>=metadata.width||y>=metadata.height)fail('LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE');
    const patch=mapState.readRectangle([x,y,x+1,y+1]);try{if(!(patch.planes[2][0]&0x4000))fail('LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE');}finally{for(const p of patch.planes)p.fill(0);}
    if(stage==='rebuild'){if(rebuildLocal)actorState.rebuildAfterBattle();resetLocal();resetGrid();if(rebuildLocal)actorFrames.resetForReturn(phase);sceneFrames.reset();}
    const result=advanceFrame({...context,tick},actorState.copyLocalActor()!==null,true,false,stage==='rebuild'?'capture':'ordinary');if(result.actorFrameError)fail(result.actorFrameError.code);if(result.sceneFrameError)fail(result.sceneFrameError.code);if(!result.sceneLayer)fail('LEGACY_BATTLE_RETURN_FRAME_FAILED');return result;
  };
  const api=Object.freeze({
    canBeginCityReturn(){
      active();if(!worldEnabled||!scene||cityReturn||craft.active())return false;
      const battle=battleState.inspect();
      return !battle.pending||(battle.entry?.mainState===10&&battle.entry.generation===battle.generation);
    },
    beginCityReturn(){
      publicActive();
      if(!api.canBeginCityReturn())fail('LEGACY_GAME_CITY_RETURN_STATE');
      cityReturn=true;mapDialog.clear();playerTrade.clear();
    },
    prepareCityBattleExit(){
      publicActive();if(!cityReturn)fail('LEGACY_GAME_CITY_RETURN_STATE');
      battleState.prepareCityExit();
    },
    crossCityBattleBoundary(){
      publicActive();return cityReturn&&battleState.retireCityBattle();
    },
    finishCityReturn(){publicActive();cityReturn=false;},
    advanceCityReturnWater(request){
      publicActive();if(!cityReturn)fail('LEGACY_GAME_CITY_RETURN_STATE');const context=snapshotLegacyGameFrameRequest(request),local=actorState.copyLocalActor(),position=local?.motion.position??pose?.scaledCoordinates??waterPosition??context.camera;
      if(local)water.advance();water.consume(false,scene.identity[1],position,context.camera,context.center,waterNativeGate);water.savePosition(position);
    },
    captureCityReturn(tick,request,route='boundary'){
      publicActive();
      if(!cityReturn)fail('LEGACY_GAME_CITY_RETURN_STATE');
      if(!['awaiting','scene','boundary','battle'].includes(route))fail('LEGACY_GAME_CITY_RETURN_STATE');
      const context=snapshotLegacyGameFrameRequest(request);
      if(route==='awaiting')return advanceFrame({...context,tick},actorState.copyLocalActor()!==null,true,false,'ordinary');
      return advanceReturnFrame(tick,'rebuild',0,context,route!=='scene');
    },
    prepareCharacterEntry(code){
      publicActive();if(!recordState||!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');if(!codec)fail('LEGACY_GAME_PROTOCOL_KEY_REQUIRED');
      if(entryAppearance!==null)fail('LEGACY_GAME_ENTRY_PREPARED');
      const actors=actorState.copyState();
      try{if(scene!==null||mapState!==null||actors.localActor!==null||actors.remoteCount!==0)fail('LEGACY_GAME_ENTRY_WORLD');}
      finally{for(const actor of [actors.localActor,...actors.remoteActors])if(actor){for(const b of actor.labels)b?.fill(0);actor.labelBytes?.fill(0);actor.attachmentBytes?.fill(0);}}
      recordState.applyEntryAppearance(code);actorState.prepareCharacterEntry();entryAppearance=code;sourceEntryWaitMask=3;
      return Object.freeze({kind:'source-entry-appearance',recordId:'state-4f0000',fieldId:'field-16',nativeStorage:'0xf536a4',value:code,fullNativeReset:'unmodeled'});
    },
    append(bytes){publicActive();return reader.append(bytes);},
    next(observeOnly=false){
      publicActive();let frame,plain;
      try{
        frame=reader.next();if(frame.kind!=='frame')return frame;
        const payload=frame.payload;
        if(binaryPrefix(payload))return Object.freeze({kind:'binary',binary:decodeLegacyGameBinary(payload)});
        if(awaitingBootstrap&&payload.length===112){
          const replacement=createLegacyGamePayloadCodecFromBootstrap(payload);codec?.close();codec=replacement;awaitingBootstrap=false;
          return Object.freeze({kind:'bootstrap',profile:LEGACY_GAME_MESSAGE_PROFILE.id,keyAvailable:true,officialPeerIdentity:'unverified'});
        }
        if(!codec)fail('LEGACY_GAME_PROTOCOL_KEY_REQUIRED');
        plain=codec.decode(payload);const message=decodeLegacyGameMessage(plain);let effect=null;
        if(message.kind==='reset-bootstrap')awaitingBootstrap=true;
        if(observeOnly===true)return Object.freeze({kind:'message',message,effect});
        if(cityReturn){
          if(message.consumer==='0x4f3430'){
            battleState.retireCityBattle();
            waterNativeGate=0;
            actorState.beginBattle();resetLocal();resetGrid();actorFrames?.synchronize();
            effect=Object.freeze({kind:'city-return-boundary',request:'send-004f67f0'});
          }else if(message.consumer==='0x4f46f0'){
            effect=Object.freeze({kind:'city-return-trade-decline',request:'send-004f7e90'});
          }
          if(effect||message.consumer==='0x4f4410'||message.consumer==='0x4f5c30'){
            return Object.freeze({kind:'message',message,effect});
          }
        }
        if(message.consumer==='0x4ef840'){
          const [first,second,third]=message.arguments;
          pose={coordinates:[first,second],scaledCoordinates:[Math.fround(first*64),Math.fround(second*64)],facingCode:third};
          let blocked=null;
          if(navigationContext&&mapState&&scene&&actorState.copyLocalActor()){
            const collision=getGrid([first,second]);blocked=collision.isBlocked(first,second);localMovement?.synchronizeNetwork(first,second,third,collision);
          }
          actorState?.applyNetworkPosition(first,second,third,blocked);
          if(localMovement)commitLocal();else if(blocked!==null){const current=actorState.copyLocalActor();pose.coordinates=[...current.motion.display];}
          effect=Object.freeze({kind:'network-position',pose:poseCopy(pose)});
        }
        if(worldEnabled&&message.consumer==='0x4ef870'){
          let previous,prepared;
          try{
            const identity=mapState?.inspect().identity??null;previous=mapState?.copyBytes()??null;
            prepared=prepareLegacyGameSceneTransition(message.arguments,identity,previous);
            const replacement=prepared.cacheBytes?createLegacyGameMapState(...prepared.scene.identity,prepared.cacheBytes,prepared.scene.checksumMode):null;
            mapState?.close();mapState=replacement;scene=prepared.scene;if(sceneFrames?.inspect().state==='open')sceneFrames.reset();
            resetGrid();resetLocal();mapDialog.clear();playerTrade.clear();craft?.invalidate();
            pose={coordinates:[...scene.coordinates],scaledCoordinates:[...scene.scaledCoordinates],facingCode:pose?.facingCode??null};
            actorState.configureSceneMode(scene.fields[8]);
            const actors=actorState.beginScene(scene.coordinates,sourceEntryWaitMask===0,cityReturn?(battleState.inspect().pending?'retain':'clear'):'normal');
            effect=Object.freeze({kind:'scene-transition',scene,cacheAction:prepared.cacheAction,pose:poseCopy(pose),actors});
          }finally{previous?.fill(0);prepared?.cacheBytes?.fill(0);}
        }
        if(worldEnabled&&message.consumer==='0x4ef9d0'){
          const update=decodeLegacyGameSceneLabel(message.arguments[0]);label?.labelBytes.fill(0);label=labelCopy(update);effect=update;
        }
        if(worldEnabled&&(message.consumer==='0x4efad0'||message.consumer==='0x4f0000')){
          effect=recordState.apply(message.operationId,message.arguments[0]);
          const selected=id=>effect.updates.find(u=>u.fieldId===id)?.value??null;
          if(message.consumer==='0x4efad0'){actorState.observeGlobals(selected('field-15'),selected('field-29'),selected('field-30'));actorState.observeVitals(['field-01','field-02','field-03','field-04'].map(selected));const selection=selected('field-28');if(selection!==null)actorState.observeLabelSelection(selection);}
          else actorState.observeGlobals(null,null,null,selected('field-18'));
          observeLocal();
        }
        if(worldEnabled&&message.consumer==='0x4f3430'){effect=battleState.applyEntry(...message.arguments);if(effect.accepted){pendingReturnFrame=null;playerTrade.clear();}}
        if (worldEnabled && message.consumer === '0x4f4610') {
          const code = message.arguments[0];
          if (code >= 200 && code <= 249) effect = Object.freeze({ kind: 'pending-scene-music', code });
        }
        if(worldEnabled&&message.consumer==='0x4f4410'){
          effect=scene&&!battleState.ordinaryGated()&&!playerTrade.active()&&!craft.active()?mapDialog.receive(message.arguments,
            ()=>localMovement?.copyState().display??actorState.copyLocalActor()?.motion.display):Object.freeze({kind:'map-dialog',status:'ordinary-context-required'});
        }
        if(family&&isLegacyGameFamilyConsumer(message.consumer))effect=family.receive(message.consumer,message.arguments);
        if(mapChat&&isLegacyGameMapChatConsumer(message.consumer)){
          frameBusy=true;
          try{effect=mapChat.receive(message.consumer,message.arguments,message.missingArguments);}
          finally{frameBusy=false;}
        }
        if(worldEnabled&&isLegacyGamePlayerTradeConsumer(message.consumer)){
          const battle=battleState.ordinaryGated()||battleState.inspect().pending;
          if(scene&&!battle){
            effect=playerTrade.receive(message.consumer,message.arguments);
            if(effect.status==='opened'||effect.status==='candidates'){mapDialog.clear();craft.invalidate();}
          }else if(battle&&message.consumer==='0x4f46f0'){
            const reply=Object.freeze({operationId:'send-004f7e90',arguments:Object.freeze([0])});
            effect=Object.freeze({kind:'player-trade',status:'busy-declined',requests:Object.freeze([reply])});
          }else effect=Object.freeze({kind:'player-trade',status:'ordinary-context-required'});
        }
        if(worldEnabled&&message.consumer==='0x4f36d0'){const current=battleState.inspect();effect=battleState.receive(message.arguments[0],current.pending?(current.entry?.mainState??9):9);}
        if(worldEnabled&&message.consumer==='0x4f48b0')effect=battleFriends.applySummary(...message.arguments);
        if(worldEnabled&&message.consumer==='0x4f48d0')effect=battleFriends.applyDetail(message.arguments);
        if(worldEnabled&&message.consumer==='0x4f2ae0'){
          frameBusy=true;
          try{
            const tick=receiveClock===null?null:receiveClock();
            active();
            effect=battleState.receiveTimer(...message.arguments,tick);
          }finally{frameBusy=false;}
        }
        if (worldEnabled && message.consumer === '0x4f2bb0') {
          const received = wallSeconds === null ? null : sampleWallSeconds();
          effect = actorState.setContext(message.arguments);
          if (received !== null) {
            const [,serverSeconds,,offsetSeconds] = message.arguments;
            calendar = { base: (serverSeconds - 0x3ae805e7 + offsetSeconds) >>> 0, received };
          }
        }
        if(worldEnabled&&['0x4f0aa0','0x4f1000','0x4f1420'].includes(message.consumer))effect=battleState.applyPetRecord(message.consumer,message.arguments[0],message.arguments[1]);
        if(worldEnabled&&['0x4f0210','0x4f0290','0x4f0510'].includes(message.consumer))effect=message.consumer==='0x4f0290'?battleState.applyPlayerSkillRecord(message.consumer,null,message.arguments[0]):battleState.applyPlayerSkillRecord(message.consumer,...message.arguments);
        if(worldEnabled&&message.consumer==='0x4f28b0')effect=battleState.applyPlayerCraftRecord(...message.arguments);
        if(worldEnabled&&message.consumer==='0x4f2b30')effect=!battleState.ordinaryGated()?
          craft.receive(...message.arguments,message.arguments[1]===4?(receiveClock?.()??null):null):Object.freeze({kind:'craft-result',accepted:false});
        if(worldEnabled&&message.consumer==='0x4f4640')effect=!battleState.ordinaryGated()?craft.receivePeople(message.arguments[0]):Object.freeze({kind:'craft-targets',accepted:false});
        if(worldEnabled&&message.consumer==='0x4f4660')effect=!battleState.ordinaryGated()?craft.receiveSubjects(message.arguments[0]):Object.freeze({kind:'craft-targets',accepted:false});
        if(worldEnabled&&message.consumer==='0x4f25a0')effect=battleState.applyItemRecords(message.arguments[0]);
        if(worldEnabled&&message.consumer==='0x4f2c40')effect=battleState.swapItemRecords(...message.arguments);
        if(worldEnabled&&message.consumer==='0x4f1240')effect=actorState.applyValues(message.arguments[0]);
        if(worldEnabled&&message.consumer==='0x4f07d0')effect=actorState.applyParty(message.arguments[0],message.arguments[1]);
        if(worldEnabled&&message.consumer==='0x4f3310'){
          const reply=actorState.applyPartyReply(...message.arguments),requests=[];let acknowledgmentUnavailable=null;
          if(reply.leaveAcknowledgment){const local=actorState.copyLocalActor();if(local&&local.normalFacingCode!==null){const target=localMovement?.copyState().target??local.motion.target;requests.push(Object.freeze({operationId:'send-004f8340',arguments:Object.freeze([...target,(local.normalFacingCode<<24)>>24])}));}else acknowledgmentUnavailable='local-target-facing';}
          effect=Object.freeze({...reply,requests:Object.freeze(requests),acknowledgmentUnavailable});
        }
        if(worldEnabled&&message.consumer==='0x4f06f0')effect=actorState.applyLabelList(message.arguments[0]);
        if(worldEnabled&&message.consumer==='0x4f16d0'&&!battleState.ordinaryGated()){
          effect=applyLocalUpdates(actorState.applyUnits(message.arguments[0]));
          if(effect.changes.some(c=>c.local)&&sourceEntryWaitMask!==null)sourceEntryWaitMask&=~2;
          if(effect.changes.some(c=>c.local&&c.created))resetLocal();observeLocal();
        }
        if(worldEnabled&&message.consumer==='0x4f2010'&&!battleState.ordinaryGated()){
          effect=applyLocalUpdates(actorState.applyActions(message.arguments[0]));const id=actorState.copyLocalActor()?.id;
          if(effect.changes.some(c=>c.result==='coordinated-unmodeled'||(c.id===id&&c.result==='unmodeled')))resetLocal('unmodeled-local-action');else observeLocal();
        }
        if(worldEnabled&&['0x4f16d0','0x4f2010'].includes(message.consumer)&&battleState.ordinaryGated())effect=Object.freeze({kind:'ordinary-actor-message-gated',consumer:message.consumer,sourceGate:'0x9250c8',value:1});
        if(worldEnabled&&message.consumer==='0x4f2260'){effect=actorState.remove(message.arguments[0]);if(!actorState.copyLocalActor())resetLocal();}
        if(mapState&&message.consumer==='0x4ef510'){
          effect=mapState.applyNotice(message.arguments);if(effect.kind==='map-cache-notice'&&effect.matches&&sourceEntryWaitMask!==null)sourceEntryWaitMask&=~1;
        }
        if(mapState&&message.consumer==='0x4ef580'){
          effect=mapState.applyPatch(message.arguments);if(effect.kind==='map-cache-patch'&&sourceEntryWaitMask!==null)sourceEntryWaitMask&=~1;
        }
        if(worldEnabled&&['0x4efad0','0x4f0290','0x4f0510','0x4f28b0','0x4f25a0','0x4f2c40'].includes(message.consumer))craft.refresh();
        if(craft?.active()&&(!actorState.copyLocalActor()||localMovementUnavailable))craft.invalidate();
        syncPartyContext();if(actorFrames?.inspect().state==='open')actorFrames.synchronize();return Object.freeze({kind:'message',message,effect});
      }catch(error){cleanup();state='failed';throw error;}
      finally{frame?.payload?.fill(0);plain?.fill(0);}
    },
    encodeCommand,
    configureActorResources(code){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');actorState.configureResources(code);battleState.configureResources(code);},
    advanceActors(){publicActive();battleGuard();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');return actorState.advance();},
    configureActorFrames(value){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');const selected=actorState,replacement=createLegacyGameActorFrameController(selected,value);
      try{active();if(actorState!==selected)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');actorFrames?.close();actorFrames=replacement;return actorFrames.inspect();}catch(error){replacement.close();throw error;}},
    configureSceneFrames(value){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');const selected=actorState,replacement=createLegacyGameSceneFrameController(value,water);
      try{active();if(actorState!==selected)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');sceneFrames?.close();sceneFrames=replacement;return sceneFrames.inspect();}catch(error){replacement.close();throw error;}},
    advanceFrame(value){return advanceFrame(value);},
    advanceFrameFollowingLocal(value,deferPresentation=false){return advanceFrame(value,true,false,deferPresentation);},
    prepareFramePresentation(value){publicActive();const q=pendingWaterFrame;if(!q||(q.result!==value&&q.prepared!==value)||q.owner!==sceneFrames)fail('LEGACY_GAME_FRAME_PRESENTATION_STALE');
      frameBusy=true;try{if(!q.prepared)q.prepared=Object.freeze({...value,sceneLayer:appendRain(q.owner.preparePresentation(q.layer),q.rain)});active();if(q.owner!==sceneFrames)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');return q.prepared;}finally{frameBusy=false;}},
    copyWaterState(){publicActive();if(!water)fail('LEGACY_GAME_WORLD_REQUIRED');return water.copyState();},
    configureActorLabelMode(mode){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');if(!Number.isInteger(mode)||mode<0||mode>5)fail('LEGACY_GAME_LABEL_MODE');actorLabelMode=mode;return mode;},
    cycleActorLabelMode(){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');actorLabelMode=actorLabelMode>=5?0:actorLabelMode+1;return actorLabelMode;},
    copyGameLabelMode(){return actorLabelMode;},
    configureActorBarsVisible(value){publicActive();if(!actorState||typeof value!=='boolean')fail('LEGACY_GAME_BARS_OPTION');actorBarsVisible=value;return value;},
    copyGameBarsVisible(){return actorBarsVisible;},
    copyLocalMovement(){publicActive();return ensureLocal().copyState();},
    mapDialogActive(){publicActive();return mapDialog?.active()??false;},
    playerTradeActive(){publicActive();return playerTrade?.active()??false;},
    craftActive(){publicActive();return craft?.active()??false;},
    copyCraft(){publicActive();if(!craft)fail('LEGACY_GAME_WORLD_REQUIRED');return craft.copy();},
    prepareCraft(action,revision,value,tick,gateBaseline){
      publicActive();battleGuard();
      if(!scene||!craft||cityReturn||battleState.ordinaryGated()||mapDialog.active()||playerTrade.active())fail('LEGACY_CRAFT_CONTEXT');
      const local=ensureLocal().copyState(),access=legacyGameActorFrameAccess(actorState);
      if(action!=='close'&&(access.ownGateByte(gateBaseline)&0x80||local.context.nativeInputGuard||
          local.context.nativeMovementGuard||local.context.nativeCoordinationGuard))fail('LEGACY_CRAFT_CONTEXT');
      return craft.prepare(action,revision,value,tick);
    },
    advanceCraft(tick){publicActive();return craft?.tick(tick)??Object.freeze({requests:Object.freeze([])});},
    copyPlayerTrade(){publicActive();return playerTrade?.copy()??null;},
    preparePlayerTrade(action,revision,value,tick,gateBaseline){
      publicActive();battleGuard();
      if(!scene||!playerTrade||mapDialog.active()||craft.active())fail('LEGACY_GAME_TRADE_CONTEXT');
      if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_GAME_LOCAL_TICK');
      if(action==='request'){
        const local=ensureLocal().copyState(),access=legacyGameActorFrameAccess(actorState);
        const facing=actorState.copyLocalActor().normalFacingCode??-1;
        const first=legacyGamePartyNeighbor(...local.display,facing);
        const second=first&&legacyGamePartyNeighbor(...first,facing);
        const nearby=first&&(access.interactionTargetAt(...first)!==-1||access.interactionTargetAt(...second)!==-1);
        const {nativeInputGuard,nativeMovementGuard,nativeCoordinationGuard}=local.context;
        if(!first||(!nearby&&access.partyContext()?.nativePartyMode!==1)||
            nativeInputGuard||nativeMovementGuard||nativeCoordinationGuard||access.ownGateByte(gateBaseline)&0x80) {
          fail('LEGACY_GAME_TRADE_TARGET');
        }
        if(((lastShortcutTick+500)>>>0)>=tick)fail('LEGACY_GAME_TRADE_COOLDOWN');
      }
      const request=playerTrade.prepare(action,revision,value,tick);
      if(action==='request')lastShortcutTick=tick;
      return request;
    },
    copyMapDialog(){publicActive();return mapDialog?.copy()??null;},
    copyMapChat(){publicActive();if(!mapChat)fail('LEGACY_GAME_WORLD_REQUIRED');return mapChat.copy();},
    copyMapChatBlockedNames(){publicActive();if(!mapChat)fail('LEGACY_GAME_WORLD_REQUIRED');return mapChat.copyBlocked();},
    setMapChatBlockedName(name,enabled){publicActive();if(!mapChat)fail('LEGACY_GAME_WORLD_REQUIRED');return mapChat.setBlocked(name,enabled);},
    prepareMapChat(text,options,tick){
      const inParty=partyChatContext();
      return mapChat.prepare(text,options,ensureLocal().copyState().display,tick,inParty);
    },
    preparePartyChat(enabled){const inParty=partyChatContext();return mapChat.setParty(enabled,inParty);},
    copyFamily(){publicActive();return family?.copy()??null;},
    prepareFamily(revision,action,tick,gateBaseline){
      publicActive();battleGuard();
      if(!family||!scene||battleState.ordinaryGated()||mapDialog.active()||playerTrade.active())fail('LEGACY_GAME_FAMILY_CONTEXT');
      if(action?.kind!=='invite')return family.prepare(revision,action);
      const info=family.inspect();
      if(!info||revision!==info.version)fail('LEGACY_GAME_FAMILY_STALE');
      if(!info.canInvite)fail('LEGACY_GAME_FAMILY_PERMISSION');
      if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_GAME_LOCAL_TICK');
      const local=ensureLocal().copyState(),access=legacyGameActorFrameAccess(actorState);
      const {nativeInputGuard,nativeMovementGuard,nativeCoordinationGuard}=local.context;
      const facing=actorState.copyLocalActor().normalFacingCode??-1;
      const target=legacyGamePartyNeighbor(...local.display,facing);
      if(!target||access.interactionTargetAt(...target)===-1||nativeInputGuard||nativeMovementGuard||
          nativeCoordinationGuard||access.ownGateByte(gateBaseline)&0x80)fail('LEGACY_GAME_FAMILY_TARGET');
      if(((lastShortcutTick+500)>>>0)>=tick)fail('LEGACY_GAME_FAMILY_COOLDOWN');
      lastShortcutTick=tick;
      return Object.freeze({operationId:'send-004f7140',arguments:Object.freeze([...local.display])});
    },
    replyMapDialog(revision,button,choice,text){
      publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');
      return mapDialog.reply(revision,button,choice,text,...ensureLocal().copyState().display);
    },
    quoteMapShop(revision,selections){
      publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');
      return mapDialog.quoteShop(revision,selections);
    },
    submitMapShop(revision,selections){
      publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');
      return mapDialog.submitShop(revision,selections,...ensureLocal().copyState().display);
    },
    prepareMapBank(revision,action){
      publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');
      return mapDialog.prepareBank(revision,action,...ensureLocal().copyState().display);
    },
    prepareMapFamilyPet(revision,action){
      publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');
      return mapDialog.prepareFamilyPet(revision,action,...ensureLocal().copyState().display);
    },
    dismissMapDialog(revision){publicActive();battleGuard();if(!mapDialog?.active())fail('LEGACY_GAME_DIALOG_STALE');mapDialog.dismiss(revision);},
    prepareMapRightClick(tile,tick,gateBaseline){
      publicActive();battleGuard();if(!actorState||!scene)fail('LEGACY_GAME_SCENE_REQUIRED');
      if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_GAME_LOCAL_TICK');
      const [x,y]=legacyInputPair(tile),access=legacyGameActorFrameAccess(actorState),requests=[];
      if(mapDialog.active()||playerTrade.active()||craft.active()||access.ownGateByte(gateBaseline)&0x80)return Object.freeze(requests);
      const controller=ensureLocal(),{display}=controller.copyState();
      const dx=x-display[0],dy=y-display[1],direction=legacyGameFacingCode(dx,dy);
      if((dx!==0||dy!==0)&&((lastRightTurnTick+500)>>>0)<tick){
        const turn=controller.turnFromRightClick(direction,scene.fields[11]);
        if(turn){commitLocal(true,false);lastRightTurnTick=tick;requests.push(turn);}
      }
      if(Math.abs(dx)<=1&&Math.abs(dy)<=1&&((lastPickupTick+500)>>>0)<tick&&access.pickupCandidateAt(x,y)){
        lastPickupTick=tick;
        requests.push(Object.freeze({operationId:'send-004f6a30',arguments:Object.freeze([...display,direction])}));
      }
      const actorId=access.interactionTargetAt(x,y);
      if(actorId!==-1)requests.push(Object.freeze({operationId:'send-004f74e0',arguments:Object.freeze([3,actorId])}));
      return Object.freeze(requests);
    },
    copyInventory(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyItemSlots();},
    copyPlayerCraftRecipes(slot){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyPlayerCraftRecipes(slot);},
    prepareItemUse(slot,revision,gateBaseline){
      return ordinaryItems().prepareItemUse(slot,revision,...inventoryTile(gateBaseline));
    },
    prepareTargetedItemUse(from,fromRevision,to,toRevision){
      return ordinaryItems().prepareTargetedItemUse(from,fromRevision,to,toRevision);
    },
    prepareItemDrop(slot,revision,gateBaseline){
      return ordinaryItems().prepareItemDrop(slot,revision,...inventoryTile(gateBaseline));
    },
    prepareItemMove(from,fromRevision,to,toRevision,amount){
      return ordinaryItems().prepareItemMove(from,fromRevision,to,toRevision,amount);
    },
    preparePartyCommand(tick){publicActive();battleGuard();if(playerTrade?.active())fail('LEGACY_GAME_TRADE_CONTEXT');if(craft?.active())fail('LEGACY_CRAFT_CONTEXT');if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_GAME_LOCAL_TICK');const m=ensureLocal().copyState(),actor=actorState.copyLocalActor(),access=legacyGameActorFrameAccess(actorState),party=access.partyContext();if(!party)fail('LEGACY_GAME_PARTY_CONTEXT_REQUIRED');
      const facing=actor.normalFacingCode??-1,neighbor=legacyGamePartyNeighbor(...m.display,facing),plan=planLegacyGamePartyCommand({mode:party.nativePartyMode,flags:party.nativePartyFlags,facing,inputGuard:m.context.nativeInputGuard,movementGuard:m.context.nativeMovementGuard,coordinationGuard:m.context.nativeCoordinationGuard,lastTick:lastShortcutTick,tick,neighborEligible:neighbor!==null&&access.partyNeighborEligible(neighbor)});
      if(!plan.allowed)return Object.freeze({kind:'party-command',sent:false,reason:plan.reason,join:plan.join,requests:Object.freeze([])});
      lastShortcutTick=tick;return Object.freeze({kind:'party-command',sent:false,reason:null,join:plan.join,requests:Object.freeze([Object.freeze({operationId:'send-004f77d0',arguments:Object.freeze([...m.display,plan.join])})])});},
    copyPartyInputContext(){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');return legacyGameActorFrameAccess(actorState).partyContext();},
    resolveOwnGateByte(baseline){publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');return legacyGameActorFrameAccess(actorState).ownGateByte(baseline);},
    setLocalMovementContext(value){publicActive();const next=snapshotLegacyGameLocalContext(value);active();if(!navigationContext)fail('LEGACY_GAME_LOCAL_CONTEXT_REQUIRED');localMovement?.setContext(next);navigationContext=next;syncPartyContext();},
    configureLocalMovement(graphics,sourceContext){
      publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');
      const ordinary = sourceContext === LEGACY_GAME_ORDINARY_ENTRY;
      if (ordinary && wallSeconds === null) fail('LEGACY_GAME_CALENDAR_CLOCK');
      const context = ordinary ? ordinaryLegacyGameMovement : snapshotLegacyGameLocalContext(sourceContext);
      if(graphics!==null)legacyGameGraphicMetadata(graphics,0);
      active();resetLocal();resetGrid();navigationGraphics=graphics;navigationContext=context;sourceMovement=ordinary;syncPartyContext();
    },
    requestLocalDestination(destination){
      publicActive();battleGuard();if(playerTrade?.active())fail('LEGACY_GAME_TRADE_CONTEXT');if(craft?.active())fail('LEGACY_CRAFT_CONTEXT');const selectedScene=scene,value=snapshotLegacyGameLocalDestination(destination);active();if(scene!==selectedScene)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');
      ensureLocal().requestDestination(value);
    },
    advanceLocalMovement(tick){
      publicActive();if(!Number.isInteger(tick)||tick<0||tick>0xffffffff)fail('LEGACY_GAME_LOCAL_TICK');return advanceOwnedLocal(tick);
    },
    encodeMovement(origin,codes){
      active();battleGuard();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');if(!scene)fail('LEGACY_GAME_SCENE_REQUIRED');
      const selectedScene=scene,command=createLegacyGameMovementCommand(origin,codes,selectedScene.fields[11]);
      try{active();if(scene!==selectedScene)fail('LEGACY_GAME_PROTOCOL_STATE_CHANGED');
        return command?encodeCommand(command.operationId,command.arguments):null;}finally{command?.arguments[2].fill(0);}
    },
    configureMapCache(identityA,identityB,bytes,mode){
      publicActive();const replacement=createLegacyGameMapState(identityA,identityB,bytes,mode);
      try{active();mapState?.close();mapState=replacement;resetGrid();return mapState.inspect();}catch(error){replacement.close();throw error;}
    },
    copyMapCache(){active();return mapState?mapState.copyBytes():null;},
    copyScene(){active();return scene;},
    copySceneTileCenter(){active();const point=localMovement?.copyState().display??actorState?.copyLocalActor()?.motion.display??(cityReturn?actorState?.copyReturnSource().coordinates:null);if(!point)fail('LEGACY_CLIENT_SCENE_CONTEXT');return Object.freeze([...point]);},
    copyMinimapSource(zoom=1){
      active();if(!scene||!mapState)return null;
      const center=localMovement?.copyState().display??actorState?.copyLocalActor()?.motion.display;if(!center)return null;
      const m=mapState.inspect(),window=legacyGameMinimapWindow(m.width,m.height,center,zoom),planes=Array.from({length:3},()=>new Uint16Array(window.width*window.height));
      const left=Math.max(0,window.origin[0]),top=Math.max(0,window.origin[1]),right=Math.min(m.width,window.origin[0]+window.width),bottom=Math.min(m.height,window.origin[1]+window.height);
      try{
        if(left<right&&top<bottom){const width=right-left,rows=Math.floor(2601/width);
          for(let y=top;y<bottom;y+=rows){const end=Math.min(bottom,y+rows),patch=mapState.readRectangle([left,y,right,end]);
            try{for(let p=0;p<3;p++)for(let row=0;row<end-y;row++)planes[p].set(patch.planes[p].subarray(row*width,(row+1)*width),(y+row-window.origin[1])*window.width+left-window.origin[0]);}
            finally{for(const plane of patch.planes)plane.fill(0);}
          }
        }
        return Object.freeze({...window,mode:m.mode,identity:m.identity,selector:scene.resolvedSelector,revision:m.updates,
          key:[...m.identity,m.mode,m.width,m.height,scene.resolvedSelector,m.updates,...center,zoom].join(':'),planes:Object.freeze(planes)});
      }catch(error){for(const plane of planes)plane.fill(0);throw error;}
    },
    copyLocalSceneReadiness(){
      publicActive();if(!actorState)fail('LEGACY_GAME_WORLD_REQUIRED');
      if(!scene||!mapState)return Object.freeze({ready:false,missing:'scene-map'});
      if(sourceEntryWaitMask)return Object.freeze({ready:false,missing:(sourceEntryWaitMask&2)?'source-entry-local-unit':'source-entry-map'});
      const actor=actorState.copyLocalActor();if(!actor)return Object.freeze({ready:false,missing:'local-actor'});
      try{
        const point=actor.motion.display,metadata=mapState.inspect();
        if(actor.motion.speed===null||point===null)return Object.freeze({ready:false,missing:'local-motion'});
        const [x,y]=point;if(x<0||y<0||x>=metadata.width||y>=metadata.height)return Object.freeze({ready:false,missing:'local-map-cell'});
        const patch=mapState.readRectangle([x,y,x+1,y+1]);
        try{const loaded=(patch.planes[2][0]&0x4000)!==0;return Object.freeze({ready:loaded,missing:loaded?null:'local-map-cell'});}
        finally{for(const p of patch.planes)p.fill(0);}
      }finally{for(const b of actor.labels)b?.fill(0);actor.labelBytes?.fill(0);actor.attachmentBytes?.fill(0);}
    },
    copyBattleState(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyState();},
    copyBattleChat(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyChat();},
    copyBattleMotionPlan(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyMotionPlan();},
    copyBattleCommands(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyCommands();},
    configureBattlePlayback(value){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureBodyPlayback(value);},
    configureBattleSkills(value){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureSkills(value);},
    configureBattleFrames(value){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureFrames(value);},
    configureBattleEntry(value){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureEntry(value);},
    advanceBattleEntry(tick){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');frameBusy=true;try{const result=battleState.advanceEntry(tick);if(result.return?.readyToCommit)pendingReturnFrame=result;return result;}finally{frameBusy=false;}},
    copyBattleEntry(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyEntry();},
    configureBattleInput(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureInput();},
    chooseBattleCommand(name,revision){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputCommand(name,revision);},
    chooseBattleTarget(slot){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputTarget(slot);},
    chooseBattlePet(slot){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputPet(slot);},
    chooseBattlePetSkill(index){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputPetSkill(index);},
    chooseBattlePlayerSkill(slot){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputPlayerSkill(slot);},
    chooseBattlePlayerSkillLevel(index){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputPlayerSkillLevel(index);},
    chooseBattleItem(slot,revision){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.chooseInputItem(slot,revision);},
    capturePresentation(){publicActive();if(!presentation)fail('LEGACY_GAME_WORLD_REQUIRED');return presentation.capture();},
    canPresent(stamp){publicActive();if(!presentation)fail('LEGACY_GAME_WORLD_REQUIRED');return presentation.canPresent(stamp);},
    commitPresentation(stamp){publicActive();if(!presentation)fail('LEGACY_GAME_WORLD_REQUIRED');return presentation.present(stamp);},
    invalidatePresentation(){publicActive();presentation?.invalidate();},
    copyPresentation(){publicActive();if(!presentation)fail('LEGACY_GAME_WORLD_REQUIRED');return presentation.inspect();},
    copyBattleInput(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyInput();},
    configureBattleLoop(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureLoop();},
    copyBattleLoop(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyLoop();},
    configureBattleExit(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.configureExit();},
    copyBattleExit(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyExit();},
    configureBattleReturn(value){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');const context=snapshotLegacyGameFrameRequest(value);if(context.width!==640||context.height!==480)fail('LEGACY_BATTLE_RETURN_CONFIGURATION');const result=battleState.configureReturn();returnContext=context;return result;},
    copyBattleReturn(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.copyReturn();},
    commitBattleReturn(frame){publicActive();if(!pendingReturnFrame||frame!==pendingReturnFrame||frame.generation!==battleState.inspect().generation)fail('LEGACY_BATTLE_RETURN_COMMIT_REQUIRED');const result=battleState.commitReturn();pendingReturnFrame=null;return result;},
    stepBattleFrame(request){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');frameBusy=true;try{return battleState.stepFrame(request);}finally{frameBusy=false;}},
    advanceBattleCallbacks(sourceContext){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');frameBusy=true;try{return battleState.callCallbacks(sourceContext);}finally{frameBusy=false;}},
    consumeBattleMotion(sourceContext){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.consumeMotion(sourceContext);},
    callBattleCommandManager(sourceContext){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.callCommandManager(sourceContext);},
    callBattleCommand(handle,sourceContext){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');return battleState.callCommand(handle,sourceContext);},
    consumeBattleCharacters(){publicActive();if(!battleState)fail('LEGACY_GAME_WORLD_REQUIRED');frameBusy=true;try{return battleState.consumeCharacters();}finally{frameBusy=false;}},
    copyGameState(){return Object.freeze({profile:LEGACY_GAME_MESSAGE_PROFILE.id,scope:worldEnabled?'legacy-world-projection':mapState?'network-position-and-map-cache-projection':'network-position-projection',
      pose:poseCopy(pose),map:mapState?.inspect()??null,scene,label:labelCopy(label),records:recordState?.copyState()??null,actors:actorState?.copyState()??null,battle:battleState?.copyState()??null,
      ...(state==='open'&&craft?.active()?{craft:craft.inspect()}:{}),localMovement:localMovement?.copyState()??null,localMovementUnavailable,sourceEntryWaitMask,actorLabelMode,actorBarsVisible,...(actorFrames?{actorFrames:actorFrames.inspect()}:{}),...(sceneFrames?{sceneFrames:sceneFrames.inspect()}:{}),
      otherBusinessConsumers:'unimplemented',currentVersionCompatibility:'unverified'});},
    finish(){publicActive();try{reader.finish();cleanup();state='finished';}catch(error){cleanup();state='failed';throw error;}},
    close(){cleanup();if(state==='open')state='closed';},
    inspect(){
      let dialog=mapDialog?.inspect()??null;
      const trade=playerTrade?.inspect();
      const familyState=state==='open'?family?.inspect():null;
      const chatState=state==='open'?mapChat?.inspect():null;
      if(dialog?.bank)dialog=Object.freeze({...dialog,gold:shopGold(),petVersion:battleState.petVersion()});
      else if(dialog&&(dialog.shopDirection||dialog.treatmentRows!==undefined))dialog=Object.freeze({...dialog,gold:shopGold()});
      return Object.freeze({profile:LEGACY_GAME_MESSAGE_PROFILE.id,state,keyAvailable:!!codec,awaitingBootstrap:state==='open'&&awaitingBootstrap,
        pendingBytes:reader.inspect().pendingBytes,worldStateEnabled:worldEnabled,...(state==='open'&&craft?.active()?{craft:craft.inspect()}:{}),battle:battleState?.inspect()??null,battleFriends:battleFriends?.inspect()??null,mapDialog:dialog,
        ...(familyState?{family:familyState}:{}),
        ...(chatState?.count||chatState?.flagsKnown||chatState?.blockedVersion?{mapChat:chatState}:{}),
        ...(trade?{playerTrade:Object.freeze({...trade,...(trade.kind==='open'?{gold:shopGold(),petVersion:battleState.petVersion()}:{})})}:{}),partyMode:actorState?legacyGameActorFrameAccess(actorState).partyContext()?.nativePartyMode??null:null,officialPeerIdentity:'unverified',currentVersionCompatibility:'unverified'});
    },
  });
  if(worldEnabled)runtimeWorlds.add(api);return api;
}
export function createLegacyGameProtocol(){return createProtocol(false);}
export function createLegacyGameWorldProtocol(receiveClock=null,wallSeconds=null){
  if(receiveClock!==null&&typeof receiveClock!=='function')fail('LEGACY_GAME_CLOCK');
  if (wallSeconds !== null && typeof wallSeconds !== 'function') fail('LEGACY_GAME_CALENDAR_CLOCK');
  return createProtocol(true,receiveClock,wallSeconds);
}

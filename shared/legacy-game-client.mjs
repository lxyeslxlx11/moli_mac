/** Own the proven world/resource/session/runtime lifecycle through explicit platform ports. */
import { createLegacyGameWorldProtocol } from './legacy-game-protocol.mjs';
import { createLegacyGameResourceLibrary } from './legacy-game-resource-library.mjs';
import { createLegacyGameRuntime } from './legacy-game-runtime.mjs';
import { LEGACY_GAME_ORDINARY_ENTRY, legacyInputFields } from './legacy-game-input.mjs';
import {composeLegacyGameBattleEntryFade} from './legacy-game-battle-entry-fade.mjs';
import {composeLegacyGameBattleExitFade} from './legacy-game-battle-exit-fade.mjs';
import { createLegacyGameCityReturn } from './legacy-game-city-return.mjs';
import { legacyGameBattleMusic, legacyGameSceneMusic } from './legacy-game-audio.mjs';
import { LEGACY_GAME_CLIENT_PROFILE, LegacyGameClientError, clientFail, snapshotLegacyGameClientContext } from './legacy-game-client-config.mjs';
export { LEGACY_GAME_CLIENT_PROFILE, LegacyGameClientError };
const safeCode = e => { let code; try { code = Object.getOwnPropertyDescriptor(e ?? {}, 'code')?.value; } catch { code = null; } return typeof code === 'string' && /^LEGACY_[A-Z0-9_]{1,89}$/.test(code) ? code : 'LEGACY_CLIENT_FAILED'; };
function wipe(value) { if (value instanceof Uint8Array) value.fill(0); else if (Array.isArray(value)) value.forEach(wipe); else if (value && typeof value === 'object') Object.values(value).forEach(wipe); }
export function createLegacyGameClient(value) {
  const names=['plan','files','context','createSession','clock','onState','onInvalidate'];
  for (const optional of ['rasterText','wallSeconds']) if (Object.getOwnPropertyDescriptor(value??{},optional)) names.push(optional);
  const c=legacyInputFields(value,names);
  for (const k of ['createSession', 'clock', 'onState', 'onInvalidate']) if (typeof c[k] !== 'function') clientFail('LEGACY_CLIENT_PORT');
  if(Object.hasOwn(c,'rasterText')&&typeof c.rasterText!=='function')clientFail('LEGACY_CLIENT_PORT');
  const clock = () => { const n = c.clock(); if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) clientFail('LEGACY_CLIENT_CLOCK'); return n; };
  const context = snapshotLegacyGameClientContext(c.context), sourceInput = context.input === LEGACY_GAME_ORDINARY_ENTRY;
  const sourceMovement = context.movement === LEGACY_GAME_ORDINARY_ENTRY;
  if ((sourceMovement || Object.hasOwn(c,'wallSeconds')) && typeof c.wallSeconds !== 'function') clientFail('LEGACY_CLIENT_CALENDAR_CLOCK');
  const world = createLegacyGameWorldProtocol(clock,sourceMovement ? c.wallSeconds : null);
  let library,battleWidth=context.display.width,battleHeight=context.display.height;
  let pointerRequestTick = sourceInput ? 0xffffffff : 0;
  try { library = createLegacyGameResourceLibrary({ plan: c.plan, files: c.files, paletteMode: 'neutral',
    battlePalette:true,...(c.rasterText?{rasterText:c.rasterText}:{}) }); } catch (error) { world.close(); throw error; }
  let partyAction=null,battleJob=null,battleCapture=null,captureGeneration=null,battleGeneration=null,pendingEntryFrame=null,pendingEntrySend=null,battlePresented=null,presentedGeneration=null,battleExitCapture=null,exitCaptureGeneration=null,battleReturnCapture=null,returnCaptureGeneration=null;
  const presentationJobs=new WeakMap();let presentationTicket=0;
  function recordPresentation(job,stamp,generation,ready){presentationTicket=(presentationTicket+1)>>>0;presentationJobs.set(job,{stamp,generation,ready,ticket:presentationTicket});}
  function canPresentBattle(job){const r=typeof job==='object'&&job!==null?presentationJobs.get(job):null;return!!r&&!terminal&&!paused&&r.ticket===presentationTicket&&r.ready()&&r.generation===world.copyBattleState().generation&&world.canPresent(r.stamp);}
  let state = 'idle', errorCode = null, session = null, runtime = null, cut = null, sceneReady = false, sceneLoading = false, sceneMusicCode = null, paused = false;
  let pendingSceneMusicCode = null, battleMusicInputs = null, battleMusic = null;
  let cityReturn = null;
  let inventorySending = false;
  let epoch = 0, sceneRevision = 0, runtimeRevision = 0, cleanupErrors = 0, started = false, terminal = false, readyResolve, doneResolve;
  const ready = new Promise(resolve => { readyResolve = resolve; }), done = new Promise(resolve => { doneResolve = resolve; });
  const canReturnToCity = () => !terminal && !paused && ['playing', 'battle-pending'].includes(state) && world.canBeginCityReturn();
  const inspect = () => Object.freeze({ profile: LEGACY_GAME_CLIENT_PROFILE.id, state, errorCode, paused, sceneReady, sceneLoading, sceneRevision, sceneMusicCode, battleMusic, runtimeRevision,
    partyAction,session: session?.inspect() ?? null, world: world.inspect(), library: library.inspect(), runtime: runtime?.inspect() ?? null, cleanupErrors,
    canReturnToCity: canReturnToCity(), ...(cityReturn ? { cityReturn: cityReturn.inspect() } : {}),
    ownership: 'world-library-session-runtime-cut-owned;files-borrowed',actorLabelMode:world.copyGameLabelMode(),actorBarsVisible:world.copyGameBarsVisible(),nativeContextComplete: false, currentVersionCompatibility: 'unverified', officialAcceptance: 'unverified' });
  function invoke(fn, ...args) { const r = fn(...args); if (r !== undefined) { Promise.resolve(r).catch(() => {}); clientFail('LEGACY_CLIENT_CALLBACK'); } }
  function notify() { if (terminal) return; try { invoke(c.onState, inspect()); } catch (error) { finish(safeCode(error)); } }
  function clearBattleCapture(){battleCapture?.fill(0);battleCapture=null;captureGeneration=null;}
  function clearBattlePixels(){clearBattleCapture();battlePresented?.fill(0);battlePresented=null;presentedGeneration=null;battleExitCapture?.fill(0);battleExitCapture=null;exitCaptureGeneration=null;battleReturnCapture?.fill(0);battleReturnCapture=null;returnCaptureGeneration=null;}
  function retireRuntime() {
    if (sourceInput && runtime) pointerRequestTick = runtime.copyState().pointer.lastRequestTick;
    runtime?.close(); runtime = null;
  }
  function invalidate() { battleJob?.cancel();world.invalidatePresentation();clearBattlePixels();pendingEntryFrame=null;pendingEntrySend=null;invoke(c.onInvalidate); retireRuntime(); }
  function finish(code = null) {
    if (state === 'returning-server' && code === 'LEGACY_SESSION_SERVER_RETURN') return;
    if (state === 'returning-city' && code === 'LEGACY_SESSION_CITY_RETURN') return;
    if (terminal) return; terminal = true; epoch++; state = code ? 'failed' : 'closed'; errorCode = code; sceneReady = sceneLoading = false;battleJob?.cancel();clearBattlePixels();pendingEntryFrame=null;pendingEntrySend=null;
    cityReturn?.close(); cityReturn = null;
    try { invoke(c.onInvalidate); } catch { cleanupErrors++; }
    // A platform close hook must not prevent disposal of independent owners.
    for (const owner of [session, runtime, world, cut, library]) { try { owner?.close(); } catch { cleanupErrors++; } }
    runtime = null; cut = null;
    const snapshot = inspect(); readyResolve(snapshot); doneResolve(snapshot); try { invoke(c.onState, snapshot); } catch { /* terminal observer cannot restart ownership */ }
  }
  function reconcile(initialTick=null) {
    if (terminal || !session) return;
    const s = session.inspect();
    if (s.state === 'failed' || s.state === 'closed') { finish(s.errorCode); return; }
    if (s.state === 'returning-server' || s.manualReturn) {
      if (state !== 'returning-server') {
        cityReturn?.close(); cityReturn = null;
        state = 'returning-server'; epoch++; paused = sceneReady = sceneLoading = false; partyAction = null;
        invalidate();
      }
      return;
    }
    if (cityReturn) { state = 'returning-city'; return; }
    if (!s.sourceCharacterEntered) { state = s.characters?.state === 'choosing' ? 'choosing' : s.sourceLoginComplete ? 'characters' : 'connecting'; return; }
    const pendingBattle=world.inspect().battle;
    if(pendingBattle?.pending){if(battleGeneration!==pendingBattle.generation){battleJob?.cancel();world.invalidatePresentation();clearBattlePixels();pendingEntryFrame=null;pendingEntrySend=null;battleGeneration=pendingBattle.generation;}if(runtime)invalidate();state='battle-pending';return;}
    const snapshot = world.copyGameState(); let local;
    try {
      if (!sceneReady || sceneLoading || !snapshot.scene || !snapshot.map || !snapshot.actors.localActor || !world.copyLocalSceneReadiness().ready) { if (runtime) invalidate(); state = 'preparing-scene'; return; }
      local = world.copyLocalMovement();
    } catch (e) {
      if (['LEGACY_GAME_LOCAL_ACTOR_REQUIRED', 'LEGACY_GAME_LOCAL_CONTEXT_REQUIRED', 'LEGACY_GAME_LOCAL_SPEED_REQUIRED', 'LEGACY_GAME_LOCAL_POSITION_REQUIRED'].includes(safeCode(e))) { if (runtime) invalidate(); state = 'preparing-scene'; return; }
      throw e;
    } finally { wipe(snapshot); }
    if (!runtime) {
      const initialCamera = runtimeRevision === 0 ? context.display.initialCamera ?? local.position : local.position;
      runtime = createLegacyGameRuntime({ world, initialTick: initialTick ?? clock(), initialCamera },pointerRequestTick);
      runtimeRevision++;
    }
    state = paused ? 'paused' : 'playing'; readyResolve(inspect());
  }
  function onSessionState() { if (terminal) return; try { reconcile(); notify(); } catch (e) { finish(safeCode(e)); } }
  function commitSceneMusic() {
    if (legacyGameSceneMusic(pendingSceneMusicCode) !== undefined) sceneMusicCode = pendingSceneMusicCode;
    pendingSceneMusicCode = null;
  }
  function advanceBattleMusic(entry) {
    if (battleMusicInputs?.generation !== entry.generation) return;
    if (entry.mainStateBefore === 10 && entry.phaseBefore === 0) {
      const scene = world.copyScene();
      const track = legacyGameBattleMusic(battleMusicInputs.mode, battleMusicInputs.background, scene?.checksumMode, scene?.identity[1]);
      if (track === undefined) return;
      battleMusic = Object.freeze({ kind: 'play', track });
    } else if (entry.exit?.capture) {
      battleMusic = Object.freeze({ kind: 'fade' });
    } else if (entry.return?.capture) {
      commitSceneMusic();
      battleMusic = Object.freeze({ kind: 'restore' });
    } else return;
    notify();
  }
  async function onPacket(packet) {
    if (terminal || state === 'returning-server') return;
    try {
      if (packet.effect?.kind === 'city-return-boundary') cityReturn?.begin('boundary');
      if (packet.effect?.kind === 'battle-entry' && packet.effect.accepted) {
        battleMusicInputs = packet.effect;
        battleMusic = null;
      }
      if (packet.effect?.kind === 'pending-scene-music' && session.inspect().sourceCharacterEntered) {
        pendingSceneMusicCode = packet.effect.code;
      }
      if (packet.effect?.kind === 'network-position' && context.display.initialCamera === null) {
        runtime?.synchronizeCamera(packet.effect.pose.scaledCoordinates);
      }
      if(packet.effect?.kind==='party-reply')partyAction=Object.freeze({state:packet.effect.accepted?'accepted':'rejected',join:packet.effect.mode,reason:null});
      if(packet.effect?.kind==='map-dialog'&&packet.effect.status==='opened')runtime?.resetButtons();
      if(packet.effect?.kind==='player-trade'&&['candidates','opened'].includes(packet.effect.status))runtime?.resetButtons();
      if (packet.effect?.kind === 'scene-transition') {
        const serial = ++epoch, current = world.copyScene(); sceneReady = false; sceneLoading = true;
        if (current.positiveConditionalValue !== null) pendingSceneMusicCode = current.positiveConditionalValue;
        if (cityReturn) {
          if (!world.inspect().battle?.pending) cityReturn.begin('scene');
        }
        else if(world.inspect().battle?.pending){state='battle-pending';invoke(c.onInvalidate);retireRuntime();}
        else{state='preparing-scene';invalidate();}
        notify();if(terminal||serial!==epoch)return;
        const next = await library.readCut({ checksumMode: current.checksumMode, resolvedSelector: current.resolvedSelector });
        if (terminal || serial !== epoch) { next?.close(); return; }
        try {
          const { graphics, animations } = library.catalogs();
          world.configureSceneFrames({ graphics, animations, cut: next, geometry: library.geometry,
            context: () => ({tileCenter:world.copySceneTileCenter(),drawPrimitives:false}), deferImages: true });
        } catch (e) { next?.close(); throw e; }
        cut?.close(); cut = next; sceneRevision++; sceneReady = true; sceneLoading = false;
        if (!cityReturn && !world.inspect().battle?.pending) commitSceneMusic();
      }
      reconcile(); notify();
    } catch (error) { if (!terminal) finish(safeCode(error)); }
  }
  async function sendInventoryCommand(prepare){
    if(terminal||paused||state!=='playing')clientFail('LEGACY_CLIENT_NOT_PLAYING');
    if(inventorySending)clientFail('LEGACY_CLIENT_ITEM_BUSY');
    const command=prepare();
    inventorySending=true;
    try{
      await session.sendCommands([command]);
      if(terminal)clientFail('LEGACY_CLIENT_CLOSED');
    }catch(error){
      if(!terminal)finish(safeCode(error));
      throw error;
    }finally{inventorySending=false;}
  }
  function requireMapInput(){
    if(terminal||paused||state!=='playing')clientFail('LEGACY_CLIENT_NOT_PLAYING');
  }
  async function sendOrdinaryCommand(prepare){
    requireMapInput();
    const command=prepare();
    if(!command){notify();return;}
    try{
      const sent=session.sendCommands([command]);notify();await sent;
      if(terminal)clientFail('LEGACY_CLIENT_CLOSED');
    }catch(error){if(!terminal)finish(safeCode(error));throw error;}
    finally{wipe(command.arguments);}
  }
  const api = Object.freeze({ inspect, ready, done,
    async start() {
      if (started || terminal) clientFail('LEGACY_CLIENT_STARTED'); started = true; const serial = epoch; state = 'loading-resources'; notify();
      try {
        await library.initialize(); if (terminal || serial !== epoch) return inspect();
        const { graphics, animations } = library.catalogs(); world.configureLocalMovement(graphics, context.movement);
        world.configureActorFrames({ graphics, animations, geometry: library.geometry, source: () => context.actor, initialPhase: 0, deferImages: true, bindActorSource: true });
        const created = c.createSession({ world, graphics, onPacket, onState: onSessionState });
        if (!created || typeof created.start !== 'function' || typeof created.close !== 'function' || typeof created.inspect !== 'function' || !created.done?.then) { try { if (typeof created?.close === 'function') created.close(); } finally { clientFail('LEGACY_CLIENT_SESSION'); } }
        session = created;
        if (terminal) { session.close(); return inspect(); }
        state = 'connecting'; notify(); if (terminal) return inspect();
        Promise.resolve(session.done).then(() => { if (!terminal) { const end = session.inspect(); finish(end.errorCode); } }, e => finish(safeCode(e)));
        await session.start(); if (!terminal) { reconcile(); notify(); } return inspect();
      } catch (error) { if (!terminal) finish(safeCode(error)); return inspect(); }
    },
    session() { return session; },
    runtime() { if (terminal || !runtime) clientFail('LEGACY_CLIENT_NOT_READY'); return runtime; },
    library() { if (terminal) clientFail('LEGACY_CLIENT_CLOSED'); return library; },
    copyMinimapSource(zoom=1){if(terminal||state!=='playing'||paused)return null;const source=world.copyMinimapSource(zoom);return source?Object.freeze({...source,key:sceneRevision+':'+source.key}):null;},
    configureBattlePlayback(value){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');
      const input=legacyInputFields(value,['seed','initialPhase','alternativeRenderer','staticFlip','screenOffset']),{animations}=library.catalogs();
      return world.configureBattlePlayback({...input,animations,geometry:library.geometry});
    },
    advanceBattleCallbacks(sourceContext){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');
      try{return world.advanceBattleCallbacks(sourceContext);}catch(error){if(!terminal)finish(safeCode(error));throw error;}
    },
    copyBattleCommands(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleCommands();},
    copyBattleChat(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleChat();},
    copyBattleState(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleState();},
    copyCraft(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyCraft();},
    async actOnCraft(action,revision,value){
      requireMapInput();
      const prepared=world.prepareCraft(action,revision,value,clock(),context.runtime.ownGateByte);
      try{
        const sent=prepared.requests.length?session.sendCommands(prepared.requests):Promise.resolve();notify();await sent;
        if(terminal)clientFail('LEGACY_CLIENT_CLOSED');
      }catch(error){if(!terminal)finish(safeCode(error));throw error;}
      finally{for(const request of prepared.requests)wipe(request.arguments);}
    },
    copyPlayerCraftRecipes(slot){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyPlayerCraftRecipes(slot);},
    configureBattleViewport(value){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');const v=legacyInputFields(value,['width','height']);if(v.width!==640||v.height!==480)clientFail('LEGACY_CLIENT_BATTLE_VIEWPORT');battleWidth=v.width;battleHeight=v.height;return Object.freeze({width:battleWidth,height:battleHeight});},
    configureBattleFrames(){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');
      const {graphics}=library.catalogs(),paletteSources=library.copyBattlePaletteSources();
      try{return world.configureBattleFrames({graphics,paletteSources,noticeText:!!c.rasterText});}
      finally{paletteSources?.baseRGB.fill(0);paletteSources?.guestRGB?.fill(0);}
    },
    configureBattleSkills(){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');const {graphics}=library.catalogs();return world.configureBattleSkills({graphics});},
    configureBattleEntry(value){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.configureBattleEntry(value);},
    copyBattleEntry(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleEntry();},
    configureBattleInput(){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.configureBattleInput();},
    configureBattleLoop(){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.configureBattleLoop();},
    copyBattleLoop(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleLoop();},
    configureBattleExit(){if(terminal||!['playing','paused','battle-pending'].includes(state))clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.configureBattleExit();},
    copyBattleExit(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleExit();},
    configureBattleReturn(){
      if (terminal || !['playing', 'paused', 'battle-pending'].includes(state)) clientFail('LEGACY_CLIENT_NOT_READY');
      if (battleJob || pendingEntryFrame) clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');
      const camera = context.display.initialCamera ?? runtime?.copyState().camera ?? [0, 0];
      return world.configureBattleReturn({tick:0,runtime:context.runtime,camera,center:context.display.center,width:640,height:480});
    },
    copyBattleReturn(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleReturn();},
    copyBattleInput(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyBattleInput();},
    copyPresentation(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyPresentation();},
    canPresentBattleFrame:canPresentBattle,
    presentBattleFrame(job){if(!canPresentBattle(job))return false;return world.commitPresentation(presentationJobs.get(job).stamp);},
    presentOrdinaryFrame(){if(terminal||paused||state!=='playing')return false;return world.commitPresentation(world.capturePresentation());},
    chooseBattleCommand(name,revision){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattleCommand(name,revision);},
    chooseBattleTarget(slot){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattleTarget(slot);},
    chooseBattlePet(slot){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattlePet(slot);},
    chooseBattlePetSkill(index){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattlePetSkill(index);},
    chooseBattlePlayerSkill(slot){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattlePlayerSkill(slot);},
    chooseBattlePlayerSkillLevel(index){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattlePlayerSkillLevel(index);},
    chooseBattleItem(slot,revision){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||pendingEntryFrame)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');return world.chooseBattleItem(slot,revision);},
    advanceBattleEntry(){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||library.inspect().rendering)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');
      let entry,render,sending,displayStamp;try{displayStamp=world.capturePresentation();const current=world.copyBattleEntry(),returnState=world.copyBattleReturn();if(!pendingEntryFrame&&returnState&&current.mainState===9&&(current.phase===20||current.phase===11&&returnState.waitCounter===30)&&(!sceneReady||sceneLoading))clientFail('LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE');entry=pendingEntryFrame??world.advanceBattleEntry(clock());pendingEntryFrame=entry;
        if(entry.frame&&entry.frame.bufferSelector!==displayStamp.selector)clientFail('LEGACY_CLIENT_PRESENTATION_STALE');
        if(entry.exit?.capture&&!battleExitCapture){if(!battlePresented||presentedGeneration!==entry.generation)clientFail('LEGACY_CLIENT_BATTLE_EXIT_CAPTURE');battleExitCapture=battlePresented.slice();exitCaptureGeneration=entry.generation;}
        if(entry.capturePlan)render=library.startRender(entry.capturePlan);
        else if(entry.return?.frame)render=library.startRender(entry.return.frame.sceneLayer.drawPlan);
        else if(entry.frame)render=library.startRender(entry.frame.drawPlan);
        else if(entry.fade||entry.exit?.fade||entry.return)render={done:Promise.resolve(null),cancel(){},inspect(){return Object.freeze({state:'queued',kind:entry.return?'ordinary-return-row-copy':entry.exit?'exit-captured-row-copy':'entry-captured-row-copy'});}};
        else clientFail('LEGACY_CLIENT_BATTLE_ENTRY_FRAME');
        if(!pendingEntrySend){const requests=[...(entry.input?.requests??[]),...(entry.exit?.requests??[])];pendingEntrySend=requests.length?session.sendCommands(requests):Promise.resolve();}sending=pendingEntrySend;
      }catch(error){if(!terminal&&!['LEGACY_BATTLE_ENTRY_POPUP_UNAVAILABLE','LEGACY_BATTLE_ENTRY_STATE_UNAVAILABLE','LEGACY_BATTLE_INPUT_DEPENDENCY_UNAVAILABLE','LEGACY_BATTLE_EXIT_DEPENDENCY_UNAVAILABLE','LEGACY_BATTLE_RETURN_STATE_UNAVAILABLE','LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE'].includes(safeCode(error)))finish(safeCode(error));throw error;}
      let job,cancelled=false,jobState='queued';
      let ownedOutput=null;const outputReady=render.done.then(output=>{if(terminal||paused||cancelled)output?.rgba.fill(0);ownedOutput=output;return output;});
      const done=Promise.all([outputReady,sending]).then(([output])=>{if(terminal||paused||cancelled){output?.rgba.fill(0);clientFail('LEGACY_CLIENT_NOT_READY');}
        let pixels,native;
        if(entry.capturePlan){clearBattleCapture();battleCapture=output.rgba;captureGeneration=entry.generation;}
        if(entry.return?.capture){battleReturnCapture?.fill(0);battleReturnCapture=output.rgba;returnCaptureGeneration=entry.generation;}
        if(entry.return?.fade){if(!battleReturnCapture||returnCaptureGeneration!==entry.generation)clientFail('LEGACY_CLIENT_BATTLE_RETURN_CAPTURE');native=composeLegacyGameBattleEntryFade({width:640,height:480,rgba:battleReturnCapture},entry.return.fade.rowOffsets,640,480);}
        else if(entry.return?.render==='retained'){if(!battlePresented||presentedGeneration!==entry.generation)clientFail('LEGACY_CLIENT_BATTLE_RETURN_CAPTURE');native={width:640,height:480,rgba:battlePresented.slice(),rasterOperations:0};}
        else if(entry.return?.render==='clear')native={width:640,height:480,rgba:new Uint8Array(640*480*4),rasterOperations:0};
        else if(entry.exit?.fade){if(!battleExitCapture||exitCaptureGeneration!==entry.generation)clientFail('LEGACY_CLIENT_BATTLE_EXIT_CAPTURE');native=composeLegacyGameBattleExitFade({width:640,height:480,rgba:battleExitCapture},entry.exit.fade.rowPositions,entry.exit.fade.type,640,480);}
        else if(entry.fade){if(!battleCapture||captureGeneration!==entry.generation)clientFail('LEGACY_CLIENT_BATTLE_ENTRY_CAPTURE');native=composeLegacyGameBattleEntryFade({width:640,height:480,rgba:battleCapture},entry.fade.rowOffsets,640,480);}
        else native=output;
        battlePresented?.fill(0);battlePresented=native.rgba.slice();presentedGeneration=entry.generation;
        if(battleWidth===640&&battleHeight===480)pixels=native;
        else{pixels=composeLegacyGameBattleEntryFade({width:640,height:480,rgba:native.rgba},Array(480).fill(0),battleWidth,battleHeight);native.rgba.fill(0);}
        if(pendingEntryFrame===entry){pendingEntryFrame=null;pendingEntrySend=null;}jobState='complete';
        advanceBattleMusic(entry);
        if(entry.return?.readyToCommit){world.commitBattleReturn(entry);clearBattlePixels();reconcile(entry.return.tick);notify();}
        return Object.freeze({...entry,width:pixels.width,height:pixels.height,rgba:pixels.rgba,rasterOperations:pixels.rasterOperations,renderer:'partial',completeBattleGameplay:false});
      }).catch(error=>{ownedOutput?.rgba.fill(0);jobState=terminal&&errorCode?'failed':cancelled?'cancelled':terminal?'closed':'failed';if(!cancelled&&!terminal&&!paused&&battleJob===job)finish(safeCode(error));throw error;}).finally(()=>{if(battleJob===job)battleJob=null;});
      job=Object.freeze({done,cancel(){if(['complete','cancelled','closed','failed'].includes(jobState))return;cancelled=true;jobState='cancelling';render.cancel();},inspect(){const current=render.inspect();return Object.freeze({...current,state:jobState==='queued'?current.state:jobState});}});recordPresentation(job,displayStamp,entry.generation,()=>jobState==='complete'&&!cancelled);battleJob=job;return job;
    },
    renderBattleFrame(){if(terminal||state!=='battle-pending'||paused)clientFail('LEGACY_CLIENT_NOT_READY');if(battleJob||library.inspect().rendering)clientFail('LEGACY_CLIENT_BATTLE_RENDER_BUSY');
      let frame,render,displayStamp;try{displayStamp=world.capturePresentation();frame=world.stepBattleFrame({width:context.display.width,height:context.display.height});render=library.startRender(frame.drawPlan);}
      catch(error){if(!terminal)finish(safeCode(error));throw error;}
      let job,cancelled=false,presentationReady=false;const done=render.done.then(output=>{if(terminal||paused||cancelled){output.rgba.fill(0);clientFail('LEGACY_CLIENT_NOT_READY');}
        presentationReady=true;return Object.freeze({...frame,rgba:output.rgba,rasterOperations:output.rasterOperations});},error=>{if(!cancelled&&!terminal&&!paused&&battleJob===job)finish(safeCode(error));throw error;})
        .finally(()=>{if(battleJob===job)battleJob=null;});
      job=Object.freeze({done,cancel(){cancelled=true;render.cancel();},inspect(){return render.inspect();}});recordPresentation(job,displayStamp,world.copyBattleState().generation,()=>presentationReady&&!cancelled);battleJob=job;return job;
    },
    readFrame() {
      if (state !== 'playing' || terminal || !runtime) clientFail('LEGACY_CLIENT_NOT_PLAYING');
      let input = context.input;
      if (!sourceInput) {
        const local = world.copyLocalMovement(); input = { ...input };
        for (const key of ['nativePartyMode', 'nativePartyFlags', 'nativeCoordinationGuard', 'nativeActionGuard']) input[key] = local.context[key];
        Object.freeze(input);
      }
      return Object.freeze({ runtime: context.runtime, center: context.display.center, width: context.display.width, height: context.display.height,
        input, graphicsMode: context.display.graphicsMode, forceRender: context.display.forceRender });
    },
    setLabelMode(mode){if(terminal||!['playing','paused'].includes(state))clientFail('LEGACY_CLIENT_NOT_PLAYING');const next=world.configureActorLabelMode(mode);notify();if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return next;},
    cycleLabels(){if(terminal||!['playing','paused'].includes(state))clientFail('LEGACY_CLIENT_NOT_PLAYING');const next=world.cycleActorLabelMode();notify();if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return next;},
    setBarsVisible(value){if(terminal||!['playing','paused'].includes(state))clientFail('LEGACY_CLIENT_NOT_PLAYING');const next=world.configureActorBarsVisible(value);notify();if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return next;},
    toggleBars(){if(terminal||!['playing','paused'].includes(state))clientFail('LEGACY_CLIENT_NOT_PLAYING');const next=world.configureActorBarsVisible(!world.copyGameBarsVisible());notify();if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return next;},
    async toggleParty(){if(terminal||!['playing','paused'].includes(state))clientFail('LEGACY_CLIENT_NOT_PLAYING');const prepared=world.preparePartyCommand(clock());
      if(!prepared.requests.length){partyAction=Object.freeze({state:'blocked',reason:prepared.reason,join:prepared.join});notify();return prepared;}
      const action=Object.freeze({state:'sending',reason:null,join:prepared.join});partyAction=action;notify();if(terminal)clientFail('LEGACY_CLIENT_CLOSED');
      try{await session.sendCommands(prepared.requests);if(terminal)return Object.freeze({...prepared,sent:false,reason:'closed'});if(partyAction===action)partyAction=Object.freeze({...action,state:'sent'});notify();return Object.freeze({...prepared,sent:true});}
      catch(error){if(!terminal)finish(safeCode(error));throw error;}
    },
    copyMapDialog(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyMapDialog();},
    copyMapChat(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyMapChat();},
    copyMapChatBlockedNames(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyMapChatBlockedNames();},
    setMapChatBlockedName(name,enabled){
      if(terminal)clientFail('LEGACY_CLIENT_CLOSED');
      const changed=world.setMapChatBlockedName(name,enabled);
      if(changed&&state!=='idle')notify();
      return changed;
    },
    sendMapChat(text,options){return sendOrdinaryCommand(()=>world.prepareMapChat(text,options,clock()));},
    setPartyChat(enabled){return sendOrdinaryCommand(()=>world.preparePartyChat(enabled));},
    copyFamily(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyFamily();},
    actOnFamily(revision,action){return sendOrdinaryCommand(()=>world.prepareFamily(revision,action,clock(),context.input.ownGateByte));},
    replyMapDialog(revision,button,choice=null,text=null){
      return sendOrdinaryCommand(()=>world.replyMapDialog(revision,button,choice,text));
    },
    quoteMapShop(revision,selections){requireMapInput();return world.quoteMapShop(revision,selections);},
    submitMapShop(revision,selections){return sendOrdinaryCommand(()=>world.submitMapShop(revision,selections));},
    actOnMapBank(revision,action){return sendOrdinaryCommand(()=>world.prepareMapBank(revision,action));},
    actOnMapFamilyPet(revision,action){return sendOrdinaryCommand(()=>world.prepareMapFamilyPet(revision,action));},
    dismissMapDialog(revision){
      requireMapInput();
      world.dismissMapDialog(revision);notify();
    },
    copyPlayerTrade(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyPlayerTrade();},
    actOnPlayerTrade(action,revision=null,value=null){
      return sendOrdinaryCommand(()=>world.preparePlayerTrade(action,revision,value,clock(),context.input.ownGateByte));
    },
    copyInventory(){if(terminal)clientFail('LEGACY_CLIENT_CLOSED');return world.copyInventory();},
    useInventoryItem(slot,revision){return sendInventoryCommand(()=>world.prepareItemUse(slot,revision,context.input.ownGateByte));},
    useInventoryItemOnItem(from,fromRevision,to,toRevision){
      return sendInventoryCommand(()=>world.prepareTargetedItemUse(from,fromRevision,to,toRevision));
    },
    dropInventoryItem(slot,revision){return sendInventoryCommand(()=>world.prepareItemDrop(slot,revision,context.input.ownGateByte));},
    moveInventoryItem(from,fromRevision,to,toRevision,amount=-1){
      return sendInventoryCommand(()=>world.prepareItemMove(from,fromRevision,to,toRevision,amount));
    },
    copyWorldState() { if (terminal) clientFail('LEGACY_CLIENT_CLOSED'); return world.copyGameState(); },
    requestCityReturn(previous = null) {
      if (previous !== null && (!(previous instanceof Uint8Array) || previous.length !== 640 * 480 * 4)) clientFail('LEGACY_CLIENT_CITY_CAPTURE');
      if (!canReturnToCity() || !session.beginCityReturn()) {
        previous?.fill(0);
        return false;
      }
      const origin = state === 'battle-pending' ? 'battle' : 'map';
      cityReturn = createLegacyGameCityReturn(previous, (tick,mode) => {
        if (!sceneReady || sceneLoading || library.inspect().rendering) return null;
        const request = { tick, runtime: context.runtime, camera: [0, 0], center: context.display.center, width: 640, height: 480 };
        try { return library.startRender(world.captureCityReturn(tick, request,mode==='awaiting'?'awaiting':cityReturn.inspect().route).sceneLayer.drawPlan); }
        catch (error) {
          if (safeCode(error) === 'LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE') return null;
          throw error;
        }
      }, origin,(tick,ordinaryPrepared)=>{
        if(!ordinaryPrepared)world.advanceCityReturnWater({tick,runtime:context.runtime,camera:[0,0],center:context.display.center,width:640,height:480});
      });
      if (origin === 'battle') cityReturn.begin('battle');
      state = 'returning-city'; epoch++; partyAction = null;
      try { invalidate(); notify(); } catch (error) { finish(safeCode(error)); }
      return !terminal;
    },
    async advanceCityReturn(tick) {
      const transition = cityReturn;
      if (!transition) return null;
      const before = transition.inspect();
      if (before.route === 'battle' && before.phase === 'leaving' && before.leftFrames === 0) {
        world.prepareCityBattleExit();
        battleMusic = Object.freeze({ kind: 'fade' }); notify();
      }
      const frame = await transition.advance(tick);
      if (frame && cityReturn === transition && before.origin === 'battle' && before.route !== 'scene' &&
          transition.inspect().enteredFrames === 1 && battleMusic?.kind !== 'restore') {
        commitSceneMusic(); battleMusic = Object.freeze({ kind: 'restore' }); notify();
      }
      return frame;
    },
    presentCityReturn(frame, paint) {
      if (!cityReturn?.present(frame, paint)) return;
      if (frame.battleBoundary) { session.completeCityBattleExit(); notify(); }
      if (!frame.complete) return;
      cityReturn.close(); cityReturn = null;
      session.finishCityReturn();
      commitSceneMusic(); reconcile(); notify();
    },
    requestServerReturn() {
      return !terminal && !paused && ['playing', 'battle-pending'].includes(state) && session.beginServerReturn();
    },
    completeServerReturnFade() {
      if (!terminal && session?.inspect().manualReturn === 'fading') session.completeServerReturnFade();
    },
    pause() { if (terminal) clientFail('LEGACY_CLIENT_CLOSED'); if (paused || cityReturn || state === 'returning-server') return inspect(); try { paused = true;battleJob?.cancel();world.invalidatePresentation(); invoke(c.onInvalidate); runtime?.resetButtons(); reconcile(); notify(); } catch (error) { finish(safeCode(error)); } return inspect(); },
    resume() { if (terminal) clientFail('LEGACY_CLIENT_CLOSED'); if (!paused) return inspect(); try { paused = false; runtime?.resetClock(clock()); reconcile(); notify(); } catch (error) { finish(safeCode(error)); } return inspect(); },
    fail(error) { finish(safeCode(error)); }, close() { finish(); },
  });
  return api;
}

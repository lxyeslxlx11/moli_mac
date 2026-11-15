/** Browser ownership for explicit selected Files, source session, picker and Canvas. */
import { createLegacyGameClient, createLegacyGameMapDialogGraphics, createLegacyGameResourcePlan } from '../shared/index.mjs';
import { createLegacyGameSelectedFiles } from './legacy-game-resource-files.mjs';
import { createBrowserLegacyGameSession } from './legacy-game-browser.mjs';
import { createLegacyGameCharacterPicker } from './legacy-game-character-picker.mjs';
import { createLegacyGameCanvasResourceHost } from './legacy-game-canvas.mjs';
import {createLegacyGameCanvasTextRasterizer} from './legacy-game-text-raster.mjs';
import {createLegacyGameBattleCanvasHost} from './legacy-game-battle-canvas.mjs';
import { createLegacyGameServerReturnCanvas } from './legacy-game-server-return-canvas.mjs';
import { createLegacyGameCityReturnCanvas } from './legacy-game-city-return-canvas.mjs';
import { closeLegacyGameAudioContext, createLegacyGameAudioHost } from './legacy-game-audio-host.mjs';
import { createLegacyGameMinimapOwner } from '../shared/legacy-game-minimap-owner.mjs';
export function createBrowserLegacyGameClient({ canvas, pickerRoot, files, rootPrefix, resources = null, startup, origin, token, endpoint, endpoints = [endpoint], gameStream = false, decodeName, encodeName,
  blockedChatNames = [], onMapChatFrame = () => {}, onState = () => {}, audioContext = null,
  clock = () => Math.trunc(performance.now()) >>> 0, schedule = (fn, delay) => setTimeout(fn, delay), cancel = clearTimeout }) {
  let material, selected = resources, client, picker = null, host = null, battleHost=null,battleView=null,battleConfigured=false,textRaster=null,closed = false, presentations = 0, hostPresentations = 0,battlePresentations=0,frameError = null;
  let dialogGraphics=null, audio=null, cityCanvas=null,minimap=null;
  const returnCanvas = createLegacyGameServerReturnCanvas({ canvas, clock, schedule, cancel,
    onReady() {
      try {
        if (client.inspect().session?.manualReturn === 'fading') client.completeServerReturnFade();
        else notify();
      } catch (error) { client.fail(error); }
    } });
  const clearMaterial = () => { material?.mappingBytes.fill(0); material?.moduleDigestBytes.fill(0); material?.resourceParameters.fill(0); };
  const inspect = () => Object.freeze({ state: closed ? 'closed' : 'open', client: client?.inspect() ?? null, files: selected?.inspect() ?? null,
    picker: picker?.inspect() ?? null, canvas: host?.inspect() ?? null,battle:battleHost?.inspect()??battleView,presentations, frameError,
    returnTransition: returnCanvas.inspect(),...(minimap?.inspect().visible?{minimap:minimap.inspect()}:{}) });
  function notify() { const r = onState(inspect()); if (r !== undefined) { Promise.resolve(r).catch(() => {}); throw Error('Expected synchronous game view observer.'); } }
  function clearDialogGraphics() {
    const current=dialogGraphics;
    if(!current)return;
    dialogGraphics=null;
    current.job?.cancel();
    current.renderer.close();
    current.canvas.hidden=true;
    current.context.clearRect(0,0,current.canvas.width,current.canvas.height);
  }
  function renderMapDialogGraphics() {
    const current=dialogGraphics;
    if(!current)return;
    try{
      const plan=current.renderer.advance();
      if(!plan)return;
      if(!plan.commands.length){current.canvas.hidden=true;return;}
      const job=client.library().startRender(plan);
      current.job=job;
      return job.done.then(frame=>{
        try{
          if(current!==dialogGraphics)return;
          const image=current.context.createImageData(frame.width,frame.height);
          image.data.set(frame.rgba);
          current.context.putImageData(image,0,0);
          current.canvas.hidden=false;
        }finally{frame.rgba.fill(0);}
      }).catch(()=>{if(current===dialogGraphics)clearDialogGraphics();}).finally(()=>{current.job=null;});
    }catch{clearDialogGraphics();}
  }
  function invalidate() { host?.close(); host = null;onMapChatFrame(null,canvas.width,canvas.height);clearDialogGraphics();if(battleHost){const c=client.inspect();if(c.paused&&c.state==='battle-pending')battleHost.pause();else{battleView=battleHost.inspect();battleHost.close();battleHost=null;}} }
  function dispose() {
    minimap?.close();minimap=null;
    audio?.close(); audio = null; closeLegacyGameAudioContext(audioContext); audioContext = null;
    cityCanvas?.close(); cityCanvas = null;
    returnCanvas.close();invalidate();battleView=null; picker?.close(); picker = null;textRaster?.close();textRaster=null;selected?.close(); clearMaterial();
  }
  function update() {
    if (closed) return;
    const current = client.inspect();
    if (current.state === 'closed' || current.state === 'failed') { dispose(); notify(); return; }
    audio?.sync(current);
    if (current.cityReturn) {
      cityCanvas ??= createLegacyGameCityReturnCanvas({ canvas, client, clock, schedule, cancel, onImage: returnCanvas.remember });
      cityCanvas.sync(); notify(); return;
    }
    cityCanvas?.close(); cityCanvas = null;
    if (current.state === 'returning-server') {
      returnCanvas.start();
      if (current.session.manualReturn === 'fading' && returnCanvas.inspect().state === 'unavailable') client.completeServerReturnFade();
      else notify();
      return;
    }
    if (current.session?.sourceCharacterEntered) { picker?.close(); picker = null; }
    else if (!picker && client.session()) picker = createLegacyGameCharacterPicker({ element: pickerRoot, session: client.session(), decodeName, encodeName });
    picker?.render();
    if(battleHost&&current.state!=='battle-pending'){battleHost.close();battleView=battleHost.inspect();battleHost=null;}
    if(!battleConfigured&&['playing','paused','battle-pending'].includes(current.state)){
      client.configureBattleViewport({width:640,height:480});client.configureBattlePlayback({seed:clock(),initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});client.configureBattleSkills();client.configureBattleFrames();client.configureBattleEntry({entryWindowPresent:false});client.configureBattleInput();client.configureBattleLoop();client.configureBattleExit();client.configureBattleReturn();battleConfigured=true;
    }
    if(current.state==='battle-pending'&&!current.paused){
      if(battleHost&&battleHost.generation!==current.world.battle.generation){battleHost.close();battleHost=null;}
      if(!battleHost){battlePresentations=0;const next=createLegacyGameBattleCanvasHost({canvas,client,decodeName,clock,schedule,cancel,onImage:returnCanvas.remember,onFrame:frame=>audio?.battle(frame),onState(snapshot){if(closed)return;presentations+=Math.max(0,snapshot.presentations-battlePresentations);battlePresentations=snapshot.presentations;battleView=snapshot;notify();}});battleHost=next;next.start();}
      else battleHost.sync();
    }
    if (current.state === 'playing' && !host) {
      hostPresentations = 0;
      const next = createLegacyGameCanvasResourceHost({ canvas, runtime: client.runtime(), library: client.library(), readFrame: client.readFrame,
        decorateFrame:(frame,stamp)=>minimap?.decorate(frame,stamp),
        tick: clock, schedule, cancel, renderMapDialogGraphics, onImage: returnCanvas.remember,
        onPresent(frame,tick){client.presentOrdinaryFrame();onMapChatFrame(frame.mapChatPresentation,canvas.width,canvas.height,tick);},
        onRequests(rows) { if (rows.length) client.session().sendCommands(rows).catch(error => client.fail(error)); },
        onState(state) { if (closed) return; presentations += Math.max(0, state.presentations - hostPresentations); hostPresentations = state.presentations; if (state.lastError) { frameError = state.lastError; const error = Error(); error.code = state.lastError; client.fail(error); return; } notify(); } });
      host = next; next.start();
    }
    notify();
  }
  try {
    material = startup.copy(); startup.close(); selected ??= createLegacyGameSelectedFiles(files, { rootPrefix });
    const plan = createLegacyGameResourcePlan(material.resourceParameters); material.resourceParameters.fill(0);
    audio = createLegacyGameAudioHost({ context: audioContext, files: selected.port, plan, clock, schedule, cancel });
    audioContext = null;
    client = createLegacyGameClient({ plan, files: selected.port, context: material.context, clock,
      wallSeconds: () => Math.floor(Date.now() / 1000), onState: update, onInvalidate: invalidate,
      rasterText(request){if(closed)throw Error('LEGACY_TEXT_CANVAS_CLOSED');textRaster??=createLegacyGameCanvasTextRasterizer({document:canvas.ownerDocument,decode:decodeName});return textRaster.raster(request);},
      createSession({ world, graphics, onPacket, onState }) {
        try { return createBrowserLegacyGameSession({ sourceProfile: material.sourceProfile, world, mappingBytes: material.mappingBytes, moduleDigestBytes: material.moduleDigestBytes,
          origin, token, endpoint, endpoints, gameStream, pollMilliseconds: 1, clock, onPacket, onState, postLogin: { graphics } }); }
        finally { clearMaterial(); }
      } });
    minimap=createLegacyGameMinimapOwner({client});
    for(const name of blockedChatNames)client.setMapChatBlockedName(name,true);
  } catch (error) { startup.close(); dispose(); client?.close(); throw error; }
  return Object.freeze({ inspect,
    start() { if (closed) throw Error('Game view is closed.'); return client.start(); },
    pause() { if (closed) return; client.pause(); }, resume() { if (closed) return; client.resume(); },
    requestServerReturn() { return !closed && client.requestServerReturn(); },
    requestCityReturn() {
      return !closed && client.inspect().canReturnToCity && client.requestCityReturn(returnCanvas.takeCapture());
    },
    toggleParty(){if(closed)throw Error('Game view is closed.');return client.toggleParty();},
    toggleBars(){if(closed)throw Error('Game view is closed.');return client.toggleBars();},
    cycleLabels(){if(closed)throw Error('Game view is closed.');return client.cycleLabels();},
    toggleMinimap(){if(closed||!minimap)return;minimap.toggle();notify();},
    cycleMinimapRange(){if(closed||!minimap)return;minimap.cycleRange();notify();},
    setPickupMode(enabled){if(closed||!host)return;host.setPickupMode(enabled);notify();},
    copyMapDialog(){return client.copyMapDialog();},
    copyCraft:client.copyCraft,
    actOnCraft:client.actOnCraft,
    copyFamily:client.copyFamily,
    actOnFamily:client.actOnFamily,
    setMapDialogGraphics(canvas, illustration) {
      clearDialogGraphics();
      if(closed||!illustration)return;
      const context=canvas.getContext('2d',{alpha:true});
      if(!context)return;
      canvas.width=illustration.width;
      canvas.height=illustration.height;
      const renderer=createLegacyGameMapDialogGraphics(illustration,client.library());
      dialogGraphics={canvas,context,renderer,job:null};
    },
    replyMapDialog(revision,button,choice,text){return client.replyMapDialog(revision,button,choice,text);},
    quoteMapShop(revision,selections){return client.quoteMapShop(revision,selections);},
    submitMapShop(revision,selections){return client.submitMapShop(revision,selections);},
    actOnMapBank:client.actOnMapBank,
    actOnMapFamilyPet:client.actOnMapFamilyPet,
    dismissMapDialog(revision){client.dismissMapDialog(revision);},
    copyPlayerTrade(){return client.copyPlayerTrade();},
    actOnPlayerTrade:client.actOnPlayerTrade,
    copyInventory(){
      return Object.freeze(client.copyInventory().map(({nameBytes,...row})=>{
        let name=null;
        if(nameBytes){
          try{name=decodeName(nameBytes)||'物品';}catch{name='物品';}
          finally{nameBytes.fill(0);}
        }
        return Object.freeze({...row,name});
      }));
    },
    useInventoryItem:client.useInventoryItem,
    useInventoryItemOnItem:client.useInventoryItemOnItem,
    dropInventoryItem:client.dropInventoryItem,
    moveInventoryItem:client.moveInventoryItem,
    chooseBattleCommand(name,revision){if(closed)return false;return battleHost?.command(name,revision)??false;},
    chooseBattleTarget(slot){if(closed)return false;return battleHost?.target(slot)??false;},
    chooseBattlePet(slot){if(closed)return false;return battleHost?.pet(slot)??false;},
    chooseBattlePetSkill(index){if(closed)return false;return battleHost?.petSkill(index)??false;},
    chooseBattlePlayerSkill(slot){if(closed)return false;return battleHost?.playerSkill(slot)??false;},
    chooseBattlePlayerSkillLevel(index){if(closed)return false;return battleHost?.playerSkillLevel(index)??false;},
    chooseBattleItem(slot,revision){if(closed)return false;return battleHost?.item(slot,revision)??false;},
    close() { if (closed) return; closed = true; client.close(); dispose(); notify(); },
    copyBattleChat() { return client.copyBattleChat(); },
    copyMapChat:client.copyMapChat,
    copyMapChatBlockedNames:client.copyMapChatBlockedNames,
    setMapChatBlockedName:client.setMapChatBlockedName,
    sendMapChat:client.sendMapChat,
    setPartyChat:client.setPartyChat,
    copyWorldState() { return client.copyWorldState(); },
    ready: client.ready, done: client.done,
  });
}

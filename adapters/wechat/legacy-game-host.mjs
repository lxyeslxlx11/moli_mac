/** Native game page owner. Platform bytes and frames enter the same client as the web page. */
import { createLegacyGameClient } from '../../shared/legacy-game-client.mjs';
import { createLegacyGameMinimapOwner } from '../../shared/legacy-game-minimap-owner.mjs';
import { createLegacyGameResourcePlan, legacyGameResourceAudio } from '../../shared/legacy-game-resource-paths.mjs';
import { createWeChatLegacyGameResourceArchive } from './legacy-game-resource-archive.mjs';
import { decodeLauncherProfileName, decodeLegacyGameDescriptionText, encodeLauncherProcessField } from '../../shared/launcher-text.mjs';
import { createLegacyGameCanvasResourceHost } from '../../web/legacy-game-canvas.mjs';
import { createLegacyGameBattleCanvasHost } from '../../web/legacy-game-battle-canvas.mjs';
import { createLegacyGameServerReturnCanvas } from '../../web/legacy-game-server-return-canvas.mjs';
import { createLegacyGameCityReturnCanvas } from '../../web/legacy-game-city-return-canvas.mjs';
import { createLegacyGameAudioHost, openLegacyGameAudioContext } from '../../web/legacy-game-audio-host.mjs';
import { createLegacyGameCanvasTextRasterizer } from '../../web/legacy-game-text-raster.mjs';
import { createWeChatLegacyGameSession } from './legacy-game-session.mjs';
import { readWeChatLauncherFile } from './launcher-local-file.mjs';
import { createWeChatAbortController } from './launcher-control.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { ownWeChatGameResources, readWeChatGameStartup, snapshotWeChatGameConfig } from './legacy-game-materials.mjs';
import {createLegacyGameCraftControls} from '../../web/legacy-game-craft-controls.mjs';
import { createWeChatInventory } from './legacy-game-inventory.mjs';
import { createWeChatShop } from './legacy-game-shop.mjs';
import { createWeChatMapService, isWeChatMapService } from './legacy-game-map-services.mjs';
import { createWeChatBank } from './legacy-game-bank.mjs';
import { createWeChatTrade } from './legacy-game-trade.mjs';
import { createWeChatFamily } from './legacy-game-family.mjs';
import { createWeChatFamilyPet } from './legacy-game-family-pet.mjs';
import { createWeChatBoard, weChatBoardMode } from './legacy-game-board.mjs';
import { createWeChatDialogGraphics } from './legacy-game-dialog-graphics.mjs';
import { paintWeChatMapChat, weChatBattleView, weChatCharacterCreation, weChatCharacterRows, weChatMapDialog } from './legacy-game-display.mjs';

export { snapshotWeChatGameConfig } from './legacy-game-materials.mjs';

const states = {
  'loading-resources':'正在核对游戏资源…',connecting:'正在连接…',characters:'正在读取人物…',choosing:'请选择人物。',
  'preparing-scene':'等待场景与本机角色…',playing:'已进入场景。',paused:'已暂停画面与输入，连接保持。',
  'returning-server':'服务器已结束角色会话。确认后返回连接设置。',
  'returning-city':'正在回城…',
  'battle-pending':'战斗中。',failed:'会话未完成，请检查本机对端和所选材料。',closed:'会话已结束，请重新选择材料。',
};
const returnResults = {
  'manual-server-return':'已返回连接设置，请重新选择材料。',
  'manual-return-rejected':'服务器拒绝返回选服，会话已结束。',
  'manual-return-timeout':'返回选服等待超时，会话已结束。',
};
const creationStatus = {
  appearance: '选择人物外观。',
  details: '输入人物名称并分配点数。',
  confirmation: '核对信息后确认创建。',
  waiting: '正在处理人物创建…',
  error: '人物未创建，请返回人物列表。',
};
const creationErrors = {
  LEGACY_CREATION_NAME_EMPTY: '请输入人物名称。',
  LEGACY_CREATION_NAME_BYTES: '名称编码后最多 16 字节。',
  LEGACY_CREATION_NAME_RESERVED: '名称包含不可使用的字符。',
  LEGACY_CREATION_NAME_DUPLICATE: '已有相同人物名称。',
  LEGACY_CREATION_STAT_POINTS: '请分配完第一组点数。',
  LEGACY_CREATION_ELEMENT_POINTS: '请分配完第二组点数。',
  LEGACY_CHARACTER_CREATE_REJECTED: '对端未接受该人物创建请求。',
  LEGACY_CHARACTER_CREATE_TIMEOUT: '等待创建应答超时。',
  TEXT_UNREPRESENTABLE: '当前文本编码无法表示该名称。',
};
const safeCode = error => {
  try { const code=Object.getOwnPropertyDescriptor(error??{},'code')?.value;return typeof code==='string'&&/^[A-Z0-9_]{1,96}$/.test(code)?code:null; }
  catch { return null; }
};
const clockOptions = options => Object.fromEntries(['wallNow','setTimer','clearTimer'].filter(key=>options[key]!==undefined).map(key=>[key,options[key]]));
const mapInputAvailable = view => view?.state==='playing'&&!view.world.craft&&!view.world.mapDialog&&(!view.world.playerTrade||view.world.playerTrade.kind==='ended');

export function createWeChatLegacyGameHost({wx,config=null,render,initialResources=null,...options}) {
  config = snapshotWeChatGameConfig(config);
  if (!wx || typeof render!=='function') throw new TypeError('Expected native game page ports.');
  const clockPorts = clockOptions(options), clock = createWeChatDeadlineClock(clockPorts), tick = () => clock.now()>>>0;
  const encoding = {encoding:config?.textEncoding??'ascii'};
  const decodeName = bytes => decodeLauncherProfileName(bytes,encoding);
  const decode = bytes => { try { return decodeLegacyGameDescriptionText(bytes,encoding); } catch { return '无法读取此行'; } };
  const decodeMapName = bytes => { try { return decodeName(bytes); } catch { return ''; } };
  const encode = value => encodeLauncherProcessField(value, encoding);
  let resources=null,startup=null,canvas=null,context=null,rect=null,client=null,clientView=null;
  let sceneHost=null,battleHost=null,returnCanvas=null,cityCanvas=null,raster=null,battleConfigured=false,battleView=null,audio=null;
  let closed=false,serial=0,picking=null,pointer=null,interact=false,presentations=0,scenePresented=false;
  let historyVersion=0,history=[],dialog=null,chatSending=false,dialogSending=false,lastView='';
  let inventory = null, shop = null, sceneService = null, bank = null, trade = null;
  let family = null, familyPet = null, board = null,minimap=null,lastMinimap='',craft=null;
  const dialogArt = createWeChatDialogGraphics(emit);
  let note=config?'请选择本次启动 JSON 和游戏资源。':'此构建尚未提供游戏连接配置。',errorCode=null;

  if (initialResources) {
    try {
      const selected = ownWeChatGameResources(initialResources);
      if (config) { resources=selected;note='已接收登录页选定的资源，请选择启动 JSON。'; }
      else selected.close();
    } catch { if (config) note='登录页资源未通过检查，请重新选择资源 ZIP。'; }
  }

  function snapshot() {
    const state=clientView?.state??'idle',flow=clientView?.session?.characters,world=clientView?.world;
    const returnTransition=returnCanvas?.inspect()??null;
    const manualReturn=clientView?.session?.manualReturn??null;
    let status=returnTransition?.state==='running'?'服务器已结束角色会话。正在退场…':states[clientView?.paused?'paused':state];
    if (manualReturn) status=manualReturn==='fading'?'正在退场…':'等待服务器确认返回选服…';
    const map=state==='playing', canPick=!!config&&!picking&&!client&&!closed;
    const mapAvailable=mapInputAvailable(clientView)&&!family;
    const chatAvailable=map&&!world?.mapDialog&&(!world?.playerTrade||world.playerTrade.kind==='ended')&&!family;
    const session = client?.session();
    const draft = session ? weChatCharacterCreation(session, flow, decodeName) : null;
    const draftStatus = draft && (creationErrors[draft.errorCode] ?? creationStatus[draft.kind]);
    return {
      state,status:note||draftStatus||status||'正在准备…',
      errorCode:errorCode??draft?.errorCode??null,
      endpoint:config?config.endpoint.address+':'+config.endpoint.port:'',canPick,picking:!!picking,
      hasStartup:!!startup,resourceCount:resources?.count??0,canvasReady:!!canvas,
      canConnect:canPick&&!!canvas&&!!startup&&!!resources&&typeof wx.createTCPSocket==='function',
      connected:!!client,paused:!!clientView?.paused,canPause:['playing','paused','battle-pending'].includes(state),returnTransition,manualReturn,
      canReturnToServers:!clientView?.paused&&['playing','battle-pending'].includes(state),
      canReturnToCity:client?.inspect().canReturnToCity??false,
      minimap:minimap?.inspect().visible?minimap.inspect():null,
      minimapStatus:minimap?.inspect().state==='unavailable'?'小地图资源不可用':minimap?.inspect().state==='loading'?'正在读取小地图…':'',
      characters:session?weChatCharacterRows(session,flow,decodeName):[],
      characterLoading:!!flow&&!draft&&!clientView.session.sourceCharacterEntered&&state!=='choosing',
      creation:draft,
      versionState:flow?.state??'',canUpgrade:state==='choosing'&&flow?.menuArmed===true,
      hasFrame:presentations>0||(battleView?.presentations??0)>0,map,canTouch:!!(mapAvailable&&scenePresented),interact,canLabel:!!(mapAvailable&&raster),
      dialog,dialogSending,dialogArt:dialogArt.snapshot(),chat:history,chatSending,canChat:!!chatAvailable,partySelected:!!world?.mapChat?.partySelected,
      canSetParty:!!(chatAvailable&&world.mapChat?.flagsKnown&&world.partyMode===1),
      canInventory: !!mapAvailable, inventory: inventory?.snapshot() ?? null, shop: shop?.snapshot() ?? null,
      sceneService: sceneService?.snapshot() ?? null,
      bank: bank?.snapshot() ?? null, trade: trade?.snapshot() ?? null,
      canTrade: !!(mapAvailable && scenePresented && trade?.canRequest()), tradeNotice: trade?.notice() ?? '',
      canCraft: !!(mapAvailable && scenePresented),craft: craft?.snapshot(map)??null,
      canFamily: !!(mapAvailable && scenePresented), family: family?.snapshot() ?? null,
      familyPet: familyPet?.snapshot() ?? null, board: board?.snapshot() ?? null,
      battle:state==='battle-pending'?weChatBattleView(battleView):null,
    };
  }

  function emit() {
    if (closed) return;
    const view=snapshot(), key=JSON.stringify(view);
    if (key!==lastView) { lastView=key;render(view); }
  }

  function clearPointer() {
    if (!pointer) return;
    pointer=null;
    const runtime=sceneHost&&client?.runtime();
    if (runtime?.inspect().state==='open') runtime.resetButtons();
  }

  function invalidateFrames(pausing=false) {
    pointer=null;scenePresented=false;
    dialogArt.clear();
    sceneHost?.close();sceneHost=null;
    if (pausing) { battleHost?.pause();battleView=battleHost?.inspect()??null; }
    else { battleHost?.close();battleHost=null;battleView=null; }
  }

  function closeInventory() { inventory?.close(); inventory = null; }
  function closeShop() { shop?.close(); shop = null; }
  function closeService() { sceneService?.close(); sceneService = null; }
  function closeBank() { bank?.close(); bank = null; }
  function closeTrade() { trade?.close(); trade = null; }
  function closeFamily() { family?.close(); family = null; }
  function closeMapPanels() { familyPet?.close(); board?.close(); familyPet = board = null; }

  function retire(message, code=null) {
    serial++;
    picking?.abort();picking=null;
    const owner=client;client=null;clientView=null;
    craft?.close();craft=null;
    audio?.close();audio=null;
    minimap?.close();minimap=null;lastMinimap='';
    cityCanvas?.close();cityCanvas=null;
    returnCanvas?.close();returnCanvas=null;
    invalidateFrames();owner?.close();
    closeInventory();closeShop();closeService();closeBank();closeTrade();
    closeFamily();closeMapPanels();
    resources?.close();resources=null;startup?.close();startup=null;raster?.close();raster=null;
    battleConfigured=false;history=[];historyVersion=0;dialog=null;interact=false;presentations=0;chatSending=false;dialogSending=false;
    try { context?.clearRect(0,0,canvas.width,canvas.height); } catch { /* A hidden native surface may already be detached. */ }
    note=message;errorCode=code;emit();
  }

  async function choose(extension) {
    if (!snapshot().canPick) return false;
    const control=createWeChatAbortController(), current=++serial;picking=control;
    note=extension==='json'?'请选择启动 JSON。':'请选择资源 ZIP。';errorCode=null;emit();
    let bytes;
    try {
      if (extension==='json') {
        bytes=await readWeChatLauncherFile({wx,signal:control.signal,clock,extension});
        if (current!==serial || closed) return false;
        const selected=await readWeChatGameStartup(bytes, resources?.port);
        if (current!==serial || closed) { selected.close(); return false; }
        startup?.close();startup=selected;
        note='启动材料已核对。';
      } else {
        const selected=await createWeChatLegacyGameResourceArchive({wx,signal:control.signal,clock});
        if (current!==serial || closed) { selected.close(); return false; }
        resources?.close();resources=selected;
        note='资源 ZIP 已就绪，共 '+selected.count+' 个文件。';
        if (startup?.inspect().configFromSelectedFiles) {
          startup.close(); startup=null;
          note+='请重新选择启动 JSON 以读取本次资源配置。';
        }
      }
      return true;
    } catch (error) {
      if (current===serial) {
        errorCode=safeCode(error);
        note=errorCode==='LEGACY_CLIENT_STARTUP_MODULE'?'请先选择根目录含指定旧版 cg_se_6000.exe 的资源 ZIP。':
          extension==='json'?'启动材料未通过检查。':'资源 ZIP 未通过检查。';
      }
      return false;
    } finally {
      bytes?.fill(0);
      if (current===serial) { picking=null;emit(); }
    }
  }

  function refreshMap(owner, view) {
    craft??=createLegacyGameCraftControls({client:owner,decode,encode,notify:emit});
    if (!mapInputAvailable(view)) { clearPointer();closeInventory();closeFamily(); }
    else {
      inventory?.sync(view.world.battle.items.revision);
      family?.sync(view.world.family);
    }
    const version=view.world.mapChat?.version??0;
    if (historyVersion!==version) {
      const records=owner.copyMapChat();
      try { history=records.slice(-24).map(({text},index)=>({id:version-Math.min(records.length,24)+index,text:decode(text)})); }
      finally { for (const row of records) row.text.fill(0); }
      historyVersion=version;
    }
    const info=view.state==='playing'?view.world.mapDialog:null;
    if (!info?.graphicsCount && !info?.appearance) dialogArt.clear();
    if (view.state === 'playing') {
      trade ??= createWeChatTrade({ client: owner, decodeName: decodeMapName, decode, notify: emit });
      trade.sync(view.world);
    } else closeTrade();
    if (info?.familyPet || info?.mode === weChatBoardMode) {
      dialog = null;
      closeShop();
      closeService();
      closeBank();
      if ((familyPet ?? board)?.revision !== info.revision) {
        closeMapPanels();
        const ports = { client: owner, revision: info.revision, decode, encode, notify: emit };
        if (info.familyPet) familyPet = createWeChatFamilyPet({ ...ports, decodeName: decodeMapName });
        else board = createWeChatBoard(ports);
      }
      familyPet?.sync(info.familyPet, view.world.battle.items.revision);
      return;
    }
    closeMapPanels();
    if (info?.bank) {
      dialog = null;
      closeShop();
      closeService();
      if (bank?.revision !== info.revision) {
        closeBank();
        bank = createWeChatBank({ client: owner, revision: info.revision, mode: info.mode, decodeName: decodeMapName, decode, notify: emit });
      }
      bank.sync(info, view.world.battle.items.revision);
      return;
    }
    closeBank();
    if (isWeChatMapService(info)) {
      dialog = null;
      closeShop();
      if (sceneService?.revision !== info.revision) {
        closeService();
        sceneService = createWeChatMapService({ client: owner, info, decode, notify: emit });
      } else sceneService.sync(info);
      return;
    }
    closeService();
    if (info?.shopDirection) {
      dialog = null;
      if (shop?.revision !== info.revision) {
        closeShop();
        shop = createWeChatShop({ client: owner, revision: info.revision, decode, notify: emit });
      }
      shop.sync(view.world.battle.items.revision, info.gold);
    } else {
      closeShop();
      if ((dialog?.revision??null)!==(info?.revision??null) || dialog?.appearance?.code !== info?.appearance?.appearanceCode) {
        dialog=weChatMapDialog(owner,info,decode);
      }
      dialogArt.sync(owner, dialog?.revision, dialog?.illustration);
    }
  }

  function syncFrames(owner, view) {
    if (view.cityReturn) {
      cityCanvas ??= createLegacyGameCityReturnCanvas({canvas,client:owner,clock:tick,schedule:clock.setTimer,cancel:clock.clearTimer,onImage:returnCanvas.remember});
      cityCanvas.sync();return;
    }
    cityCanvas?.close();cityCanvas=null;
    if (view.state==='returning-server') {
      returnCanvas.start();
      if (view.session.manualReturn==='fading'&&returnCanvas.inspect().state==='unavailable') owner.completeServerReturnFade();
      return;
    }
    if (!battleConfigured&&['playing','paused','battle-pending'].includes(view.state)) {
      owner.configureBattleViewport({width:640,height:480});
      owner.configureBattlePlayback({seed:tick(),initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
      owner.configureBattleSkills();owner.configureBattleFrames();owner.configureBattleEntry({entryWindowPresent:false});
      owner.configureBattleInput();owner.configureBattleLoop();owner.configureBattleExit();owner.configureBattleReturn();battleConfigured=true;
    }
    if (view.state==='battle-pending') {
      if (view.paused) return;
      if (battleHost?.generation!==view.world.battle.generation) {
        battleHost?.close();
        battleHost=createLegacyGameBattleCanvasHost({canvas,client:owner,decodeName,clock:tick,schedule:clock.setTimer,cancel:clock.clearTimer,onImage:returnCanvas.remember,onFrame:frame=>audio?.battle(frame),
          onState(value) { if (client===owner) { battleView=value;emit(); } }});
        battleHost.start();
      } else battleHost.sync();
      return;
    }
    if (battleHost) { battleHost.close();battleHost=null;battleView=null; }
    if (view.state==='playing'&&!sceneHost) {
      const host=createLegacyGameCanvasResourceHost({canvas,runtime:owner.runtime(),library:owner.library(),readFrame:owner.readFrame,
        decorateFrame:(frame,stamp)=>minimap?.decorate(frame,stamp),
        bindPointerEvents:false,tick,schedule:clock.setTimer,cancel:clock.clearTimer,onImage:returnCanvas.remember,
        renderMapDialogGraphics:dialogArt.render,
        onRequests(requests) { if (requests.length) owner.session().sendCommands(requests).catch(error=>owner.fail(error)); },
        onPresent(frame,stamp) {
          owner.presentOrdinaryFrame();paintWeChatMapChat(context,canvas,frame.mapChatPresentation,stamp,decode);
          presentations++;
          const mini=minimap?.inspect(),signature=mini?[mini.visible,mini.zoom,mini.state,mini.errorCode].join(':'):'';
          if(signature!==lastMinimap){lastMinimap=signature;emit();}
          if (clientView?.world.craft) { clientView=owner.inspect();emit(); }
          if (!scenePresented) { scenePresented=true;emit(); }
        },
        onState(value) { if (value.lastError && client===owner) owner.fail(Object.assign(new Error(),{code:value.lastError})); },
      });
      sceneHost=host;host.start();
    }
  }

  function connect() {
    if (!snapshot().canConnect) return false;
    const material=startup.copy(), selected=resources;
    startup.close();startup=null;note='';errorCode=null;
    const wipeMaterial=()=>{material.mappingBytes.fill(0);material.moduleDigestBytes.fill(0);material.resourceParameters.fill(0);};
    let owner;
    try {
      const plan=createLegacyGameResourcePlan(material.resourceParameters);material.resourceParameters.fill(0);
      const audioOptions=legacyGameResourceAudio(plan);
      if (audioOptions.sound || audioOptions.music) {
        const audioContext=openLegacyGameAudioContext(() => wx.createWebAudioContext?.());
        audio=createLegacyGameAudioHost({context:audioContext,files:selected.port,plan,clock:tick,
          schedule:clock.setTimer,cancel:clock.clearTimer});
      }
      try {
        const node=wx.createOffscreenCanvas?.({type:'2d',width:1,height:1});
        if (node) raster=createLegacyGameCanvasTextRasterizer({canvas:node,decode:decodeName});
      } catch { raster=null; }
      const textRaster=raster;
      owner=createLegacyGameClient({plan,files:selected.port,context:material.context,clock:tick,
        wallSeconds:()=>Math.floor((clockPorts.wallNow??Date.now)()/1000),
        ...(textRaster?{rasterText:textRaster.raster}:{}),
        createSession({world,graphics,onPacket,onState}) {
          try { return createWeChatLegacyGameSession({wx,sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,
            moduleDigestBytes:material.moduleDigestBytes,endpoint:config.endpoint,pollMilliseconds:1,onPacket,onState,postLogin:{graphics},...clockPorts,keepalive:true}); }
          finally { wipeMaterial(); }
        },
        onInvalidate() { if (client===owner) { const view=owner.inspect();invalidateFrames(view.paused&&view.state==='battle-pending'); } },
        onState(view) {
          if (client!==owner) return;
          if (view.state!==clientView?.state) { note='';errorCode=null; }
          clientView=view;
          if (view.state==='closed'||view.state==='failed') { retire(returnResults[view.session?.reason]??states[view.state],view.errorCode);return; }
          audio?.sync(view);refreshMap(owner,view);syncFrames(owner,view);emit();
        },
      });
      returnCanvas=createLegacyGameServerReturnCanvas({canvas,clock:tick,schedule:clock.setTimer,cancel:clock.clearTimer,
        onReady(){
          try {
            if (owner.inspect().session?.manualReturn==='fading') owner.completeServerReturnFade();
            else emit();
          } catch(error) { owner.fail(error); }
        }});
      minimap=createLegacyGameMinimapOwner({client:owner});client=owner;
      const starting=owner.start();
      starting.then(wipeMaterial,wipeMaterial);
      return starting;
    } catch (error) { wipeMaterial();retire('无法开始游戏会话。',safeCode(error));return false; }
  }

  async function character(action, slot, direction) {
    const owner=client?.session();if (!owner) return false;
    try {
      if (action==='enter') await owner.enterCharacter(slot);
      else if (action==='create') owner.beginCharacterCreation(slot);
      else if (action==='appearance') owner.changeCharacterAppearance(slot,direction);
      else if (action==='upgrade') await owner.beginVersionUpgrade();
      else if (action==='retry') await owner.retryVersionUpgrade();
      else if (action==='version-back') owner.acknowledgeVersionUpgrade();
      else return false;
      if (client?.session()!==owner) return false;
      note='';errorCode=null;emit();return true;
    } catch { if (client?.session()===owner) { note='当前人物操作暂不可用。';emit(); } return false; }
  }

  async function creation(action, value) {
    const owner = client?.session();
    const flow = clientView?.session?.characters;
    if (!owner || !(flow?.state === 'creating' || (flow?.state === 'creation-error' && action === 'dismiss-error'))) return false;
    let bytes;
    note = '';
    errorCode = null;
    try {
      if (action === 'review') {
        bytes = encodeLauncherProcessField(value, encoding);
        owner.editCharacterCreation('name', bytes);
        owner.editCharacterCreation('request-confirmation');
      } else if (action === 'confirm') {
        const result = await owner.confirmCharacterCreation();
        return client?.session() === owner && result.characters?.sourceCreationResult === 1;
      } else {
        owner.editCharacterCreation(action, value);
      }
      return client?.session() === owner;
    } catch (error) {
      if (client?.session() === owner) {
        errorCode = safeCode(error);
        note = creationErrors[errorCode] ?? '请检查当前创建步骤与输入。';
      }
      return false;
    } finally {
      bytes?.fill(0);
      if (client?.session() === owner) emit();
    }
  }

  function touch(kind, sample) {
    if (kind==='cancel') { clearPointer();return false; }
    if (family || !['start','move','end'].includes(kind) || !scenePresented || !mapInputAvailable(clientView)) return false;
    const {identifier=0,x,y,clientX,clientY}=sample??{};
    if (!Number.isInteger(identifier)||(pointer&&pointer.identifier!==identifier)) return false;
    if (kind==='start'&&pointer || kind!=='start'&&!pointer) return false;
    const localX=Number.isFinite(x)?x:clientX-rect.left,localY=Number.isFinite(y)?y:clientY-rect.top;
    if (!Number.isFinite(localX)||!Number.isFinite(localY)) { if (kind==='end') clearPointer();return false; }
    const pixel=(value,display,backing)=>Math.trunc(Math.max(0,Math.min(backing-1,value*backing/display)));
    const runtime=client.runtime();runtime.move([pixel(localX,rect.width,canvas.width),pixel(localY,rect.height,canvas.height)]);
    if (kind==='start') { pointer={identifier,button:interact?2:0};runtime.press(pointer.button); }
    else if (kind==='end') { runtime.release(pointer.button);pointer=null; }
    return true;
  }

  async function mapAction(action, value, revision, choice) {
    const owner=client;if (family || !owner || clientView.state!=='playing') return false;
    const messaging=action==='chat'||action==='party-chat',reply=action==='reply';
    if (messaging&&chatSending || reply&&(dialogSending||!dialog?.supported||dialog.revision!==revision)) return false;
    const paired = reply && dialog.inputCount === 2;
    let bytes, secondBytes;
    if (messaging) chatSending=true;
    if (reply) dialogSending=true;
    emit();
    try {
      if (action==='chat') { bytes=encodeLauncherProcessField(value.text,encoding);await owner.sendMapChat(bytes,value.options); }
      else if (action==='party-chat') await owner.setPartyChat(value);
      else if (action==='party') await owner.toggleParty();
      else if (action==='label'&&raster) owner.cycleLabels();
      else if (action==='dismiss'&&dialog?.revision===revision) owner.dismissMapDialog(revision);
      else if (reply) {
        if (dialog.input) bytes=encode(value.text);
        if (paired) secondBytes=encode(value.second ?? '');
        await owner.replyMapDialog(revision,value.bit,choice,paired?[bytes,secondBytes]:bytes??null);
      } else return false;
      if (client===owner) { note=action==='chat'?'聊天已提交。':'';errorCode=null; }
      return client===owner;
    } catch (error) {
      if (client===owner) {
        errorCode=safeCode(error);
        if (errorCode==='LEGACY_GAME_CHAT_TEXT') note='请输入编码后最多 76 字节的单行聊天。';
        else if (paired && errorCode==='LEGACY_GAME_DIALOG_TEXT') note=value.bit===1?
          '请核对两项内容，每项最多 46 字节，确认时需填写有效文本。':'每项最多 46 字节。';
        else note='该游戏操作暂不可用。';
      }
      return false;
    } finally {
      bytes?.fill(0);
      secondBytes?.fill(0);
      if (client===owner) { if (messaging) chatSending=false;if (reply) dialogSending=false;emit(); }
    }
  }

  function inventoryAction(action, value) {
    if (family || !client || !mapInputAvailable(clientView)) return false;
    if (action !== 'toggle') return inventory?.act(action, value) ?? false;
    if (inventory) {
      if (inventory.snapshot().busy) return false;
      closeInventory();
    } else {
      inventory = createWeChatInventory({ client, decodeName, decode, notify: emit });
      inventory.sync(clientView.world.battle.items.revision);
    }
    emit();
    return true;
  }

  function shopAction(action, revision, row, text) {
    return shop?.revision === revision ? shop.act(action, row, text) : false;
  }

  function serviceAction(action, revision, choice) {
    return sceneService && sceneService.revision === revision ? sceneService.act(action, choice) : false;
  }

  function bankAction(action, revision, version, value) {
    return bank && bank.revision === revision ? bank.act(action, version, value) : false;
  }

  function tradeAction(action, revision, version, value, rowRevision) {
    if (family || (action === 'request' && !scenePresented)) return false;
    return trade?.act(action, revision, version, value, rowRevision) ?? false;
  }

  function familyAction(action, revision, version, value) {
    if (action === 'open') {
      if (family || !scenePresented || !mapInputAvailable(clientView)) return false;
      clearPointer();
      closeInventory();
      family = createWeChatFamily({ client, decode, encode, notify: emit });
      family.sync(clientView.world.family);
    } else if (action === 'close') {
      if (!family) return false;
      closeFamily();
    } else return family?.act(action, revision, version, value) ?? false;
    emit();
    return true;
  }

  function familyPetAction(action, revision, value, rowRevision) {
    return familyPet && familyPet.revision === revision ? familyPet.act(action, value, rowRevision) : false;
  }

  function boardAction(action, revision, value) {
    return board && board.revision === revision ? board.act(action, value) : false;
  }

  const api=Object.freeze({
    inspect(){return Object.freeze({view:snapshot(),presentations,battlePresentations:battleView?.presentations??0,clientState:clientView?.state??null});},
    bindCanvas(node, size) {
      if (closed || !node || ![size?.width,size?.height,size?.left,size?.top].every(Number.isFinite)||size.width<=0||size.height<=0) return false;
      try {
        const selected=node.getContext('2d');
        if (!selected || typeof selected.putImageData!=='function'||typeof selected.createImageData!=='function') return false;
        if (canvas&&canvas!==node&&client) retire('画布已重新绑定，请重新选择材料。');
        canvas=node;context=selected;rect={width:size.width,height:size.height,left:size.left,top:size.top};emit();return true;
      } catch { return false; }
    },
    bindDialogCanvas:dialogArt.bind,
    chooseStartup:()=>choose('json'),chooseResources:()=>choose('zip'),connect,character,creation,touch,mapAction,
    craftAction(action,value){
      if(!craft||!client||clientView?.state!=='playing'||(action==='open'&&!snapshot().canCraft))return false;
      clearPointer();closeInventory();return craft.act(action,value);
    },
    inventoryAction,shopAction,serviceAction,bankAction,tradeAction,familyAction,familyPetAction,boardAction,
    toggleInteract(){if (clientView?.state!=='playing') return false;interact=!interact;emit();return true;},
    togglePause(){if (!client||!snapshot().canPause) return false;if (clientView.paused) client.resume();else client.pause();return true;},
    toggleMinimap(){if(clientView?.state!=='playing'||!minimap)return false;minimap.toggle();emit();return true;},
    cycleMinimapRange(){if(clientView?.state!=='playing'||!minimap)return false;minimap.cycleRange();emit();return true;},
    requestServerReturn(){return client?.requestServerReturn()??false;},
    requestCityReturn(){return !!client?.inspect().canReturnToCity&&client.requestCityReturn(returnCanvas.takeCapture());},
    battle(action, value, revision) {
      const host=battleHost;if(!host||clientView?.paused) return false;
      if (action==='command') return host.command(value,revision);
      const method={target:'target',skill:'playerSkill',level:'playerSkillLevel',item:'item',pet:'pet',petSkill:'petSkill'}[action];
      return method?host[method](value,revision):false;
    },
    disconnect(){if(!closed&&returnCanvas?.inspect().state!=='running')retire(states.closed);},
    hide(){if(!closed)retire(config?'页面已隐藏，请重新选择材料。':'此构建尚未提供游戏连接配置。');},
    close(){if(closed)return;closed=true;retire('页面已关闭。');canvas=context=rect=null;},
  });
  emit();return api;
}

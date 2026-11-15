/** Original WeChat host controller. Protocol fields and selection gates stay in the existing core. */
import { parseGameCatalog, parseRegionCatalog, listGameRegions, listGameGalaxies, selectLauncherRegion } from '../../shared/launcher.mjs';
import { createLauncherLicenseReview } from '../../shared/launcher-local.mjs';
import { encodeLauncherCredential, decodeLauncherProfileName, LAUNCHER_TEXT_ENCODINGS } from '../../shared/launcher-text.mjs';
import { snapshotSessionEndpoints } from '../../web/launcher-session-data.mjs';
import { createWeChatLauncherSession } from './launcher.mjs';
import { createWeChatLauncherBootstrap } from './launcher-bootstrap.mjs';
import { snapshotWeChatHttpOrigins, snapshotWeChatHttpUrl } from './launcher-http.mjs';
import { createWeChatAbortController } from './launcher-control.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { readWeChatLauncherFile } from './launcher-local-file.mjs';
import { createWeChatLauncherCatalogStore } from './launcher-catalog-store.mjs';
import { snapshotPortableLauncherCatalogs } from '../../shared/launcher-catalog-cache.mjs';
import { snapshotWeChatLauncherPatchConfig } from './launcher-patch.mjs';
import { createWeChatLauncherResources } from './launcher-resources.mjs';

const own = (object, name) => {
  const descriptor = Object.getOwnPropertyDescriptor(object, name);
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new TypeError('Invalid local launcher configuration.');
  return descriptor.value;
};
function bootstrapConfig(value) {
  if (value === null || value === undefined) return null;
  const fields = ['allowedOrigins','endpoints','encoding','timeoutMs'];
  if (!value || typeof value !== 'object' || Array.isArray(value) || Reflect.ownKeys(value).length !== fields.length
      || Reflect.ownKeys(value).some(name => !fields.includes(name))) throw new TypeError('Invalid initialization configuration.');
  const allowedOrigins = snapshotWeChatHttpOrigins(own(value, 'allowedOrigins')), endpoints = own(value, 'endpoints'),
    encoding = own(value, 'encoding'), timeoutMs = own(value, 'timeoutMs');
  const names = ['launcherDigest','updateLocator','catalogDigests','gameList','regionList'];
  if (!endpoints || typeof endpoints !== 'object' || Array.isArray(endpoints) || Reflect.ownKeys(endpoints).length !== names.length
      || Reflect.ownKeys(endpoints).some(name => !names.includes(name)) || !['utf-8','gb18030'].includes(encoding)
      || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) throw new TypeError('Invalid initialization configuration.');
  const urls = {};
  for (const name of names) {
    const url = snapshotWeChatHttpUrl(own(endpoints, name));
    if (!allowedOrigins.includes(url.origin)) throw new TypeError('Initialization origin was not selected.');
    urls[name] = url.href;
  }
  return Object.freeze({ allowedOrigins, endpoints: Object.freeze(urls), encoding, timeoutMs });
}
export function snapshotWeChatLauncherHostConfig(value) {
  if (value === null) return null;
  const fields = ['sourceProfile','gameListXml','regionListXml','allowBareAmpersands','allowedEndpoints','textPages','textEncoding'];
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Reflect.ownKeys(value).some(key => ![...fields,'bootstrap','catalogCacheProfile','patch','resourceCacheProfile'].includes(key))) throw new TypeError('Invalid local launcher configuration.');
  const input = Object.fromEntries(fields.map(name => [name, own(value, name)]));
  const bootstrap = bootstrapConfig(Object.hasOwn(value, 'bootstrap') ? own(value, 'bootstrap') : null);
  const catalogCacheProfile = Object.hasOwn(value,'catalogCacheProfile') ? own(value,'catalogCacheProfile') : null;
  const patch=snapshotWeChatLauncherPatchConfig(Object.hasOwn(value,'patch')?own(value,'patch'):null);
  const resourceCacheProfile=Object.hasOwn(value,'resourceCacheProfile')?own(value,'resourceCacheProfile'):null;
  if(resourceCacheProfile!==null&&(!patch||typeof resourceCacheProfile!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(resourceCacheProfile)))throw new TypeError('Invalid resource cache profile.');
  if(catalogCacheProfile!==null && (typeof catalogCacheProfile!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(catalogCacheProfile))) throw new TypeError('Invalid cache profile.');
  if (input.sourceProfile !== 'win32-current' || typeof input.allowBareAmpersands !== 'boolean' || !LAUNCHER_TEXT_ENCODINGS.includes(input.textEncoding)) throw new TypeError('Invalid source profile.');
  const remoteOnly = input.gameListXml === null && input.regionListXml === null && bootstrap !== null;
  if (!remoteOnly) for (const name of ['gameListXml', 'regionListXml']) {
    if (typeof input[name] !== 'string' || !input[name].length || input[name].length > 1048576) throw new TypeError('Invalid catalog text.');
  }
  let textPages = null;
  if (input.textPages !== null) {
    if (!Array.isArray(input.textPages) || input.textPages.length !== 4) throw new TypeError('Expected four provided pages.');
    textPages = Object.freeze(Array.from({ length: 4 }, (_, i) => {
      const text = own(input.textPages, String(i));
      if (typeof text !== 'string' || !text.length || text.length > 65536) throw new TypeError('Invalid provided page.');
      return text;
    }));
  }
  const options = { allowBareAmpersands: input.allowBareAmpersands };
  return Object.freeze({ sourceProfile: input.sourceProfile, textEncoding: input.textEncoding, allowBareAmpersands: input.allowBareAmpersands,
    allowedEndpoints: snapshotSessionEndpoints(input.allowedEndpoints), textPages, bootstrap, catalogCacheProfile,patch,resourceCacheProfile,
    games: remoteOnly ? null : parseGameCatalog(input.gameListXml, options), regions: remoteOnly ? null : parseRegionCatalog(input.regionListXml, options) });
}
const endpointKey = value => JSON.stringify([value.address, value.port]);
function profileLabel(bytes, ordinal, encoding) {
  try { return decodeLauncherProfileName(bytes, { encoding }); } catch { return `候选 ${ordinal + 1}`; }
}

export function createWeChatLauncherHost({ wx, config: source = null, render = () => {} } = {}) {
  if (typeof render !== 'function') throw new TypeError('Expected a host render callback.');
  let config = null, configError = false;
  try { config = snapshotWeChatLauncherHostConfig(source); } catch { configError = true; }
  let gameOrdinal = -1, referenceOrdinal = -1, galaxyOrdinal = -1, target = null, regions = [], galaxies = [];
  let username = '', password = '', review = null, accepted = false, active = null, busy = false, loadingCatalogs = false;
  let generation = 0, inputEpoch = 0, counter = 0, rows = [], selectedLabel = '';
  let loadedCatalogs=null,cachedCatalogs=null,cacheRevision=null,store=null,cachePhase=null,catalogComparison=null;
  let resources=null;
  let cacheStatus=config?.catalogCacheProfile ? '缓存尚未检查；不会自动保存或恢复。' : '未启用目录缓存。';
  let status = configError ? '配置不可用，请检查已提供的目录和连接设置。' : config ? config.games ? '请选择游戏与区域。' : '请先选择本地登录器文件并加载目录。' : '尚未提供连接配置，当前不能开始会话。';
  function validInputs() {
    let user, pass;
    try { user = encodeLauncherCredential(username, { encoding: config.textEncoding }); pass = encodeLauncherCredential(password, { encoding: config.textEncoding }); return true; }
    catch { return false; } finally { user?.fill(0); pass?.fill(0); }
  }
  function snapshot() {
    const reviewing = review?.snapshot().state === 'reviewing', pageOrdinal = reviewing ? review.snapshot().pageOrdinal : -1;
    return Object.freeze({ ...resources?.snapshot(),configured: config !== null, status, busy, loadingCatalogs, hasBootstrap: !!config?.bootstrap,
      cacheEnabled:!!config?.catalogCacheProfile,cacheStatus,cacheRevision,cachePhase,catalogComparison,
      canCheckCatalogCache:!!config?.catalogCacheProfile&&!busy,
      canSaveCatalogCache:!!config?.catalogCacheProfile&&!busy&&!!loadedCatalogs&&cacheRevision!==null,
      canRestoreCatalogCache:!!config?.catalogCacheProfile&&!busy&&!!cachedCatalogs,
      canLoadCatalogs: !!config?.bootstrap && !busy, catalogsReady: !!config?.games, gameOrdinal, referenceOrdinal, galaxyOrdinal,
      gameName: config?.games && gameOrdinal >= 0 ? config.games.games[gameOrdinal].name : '请选择游戏',
      regionName: referenceOrdinal >= 0 ? regions[referenceOrdinal]?.name ?? '请选择区域' : '请选择区域',
      galaxyName: galaxyOrdinal >= 0 ? galaxies[galaxyOrdinal]?.name ?? '请选择分组' : '请选择分组',
      games: Object.freeze((config?.games?.games ?? []).map((game, ordinal) => Object.freeze({ ordinal, label: game.name }))),
      regions: Object.freeze(regions.map((region, ordinal) => Object.freeze({ ordinal, label: region.name, status: region.status }))),
      galaxies: Object.freeze(galaxies.map((galaxy, ordinal) => Object.freeze({ ordinal, label: galaxy.name }))),
      canInput: !!target && !busy && !reviewing, canReview: !!target && !busy && !reviewing && validInputs() && !!config?.textPages,
      canLogin: !!target && !busy && !reviewing && accepted && validInputs(), accepted,
      reviewing, pageOrdinal, reviewText: pageOrdinal >= 0 ? config.textPages[pageOrdinal] : '',
      finalPage: pageOrdinal === 3, inputMounts: Object.freeze([inputEpoch]),
      rows: Object.freeze(rows.map(row => Object.freeze({ ...row }))), selectedLabel,
      authentication: 'unverified' });
  }
  function emit() { const value = snapshot(); render(value); return value; }
  function clearInputs() { username = ''; password = ''; inputEpoch++; }
  function invalidate() {
    generation++; try { active?.cancel(); } catch { /* State/inputs must still be cleared. */ }
    active = null; busy = false; loadingCatalogs = false; cachePhase=null; rows = []; selectedLabel = ''; review?.cancel(); review = null; accepted = false;
  }
  function releaseCatalogs(value){value?.gameListBytes.fill(0);value?.regionListBytes.fill(0);}
  function clearCached(){releaseCatalogs(cachedCatalogs);cachedCatalogs=null;}
  function clearSelection(){gameOrdinal=referenceOrdinal=galaxyOrdinal=-1;target=null;regions=[];galaxies=[];resources?.selectionChanged();}
  function cachePolicy(value){return value.allowBareAmpersands===config.allowBareAmpersands && (!config.bootstrap||value.encoding===config.bootstrap.encoding);}
  async function runCatalogCache(kind){
    if(busy||!config?.catalogCacheProfile||(kind==='save'&&(!loadedCatalogs||cacheRevision===null)))return snapshot();
    invalidate();clearInputs();clearCached();busy=true;cachePhase=kind;
    const id=generation,control=createWeChatAbortController(),operation=Object.freeze({cancel:control.abort,kind:'cache-'+kind});active=operation;
    cacheStatus=kind==='save'?'正在保存本次原始目录字节…':'正在读取并核验本机目录缓存…';status='输入和确认已清空，正在处理目录缓存。';emit();
    try{
      store??=createWeChatLauncherCatalogStore({wx,profile:config.catalogCacheProfile});
      if(kind==='save'){
        const receipt=await store.commitPair(loadedCatalogs,{expectedRevision:cacheRevision,signal:control.signal});
        if(id!==generation)return snapshot();
        cacheRevision=receipt.revision;cacheStatus=`目录缓存版本${receipt.revision}已回读核验；来源仍未验证。`;
      }else{
        const saved=await store.read({signal:control.signal});
        if(id!==generation){releaseCatalogs(saved.catalogs);return snapshot();}
        cacheRevision=saved.revision;
        if(!saved.catalogs)cacheStatus='本机目录缓存为空，可明确保存已载入的原始字节。';
        else if(!cachePolicy(saved.catalogs)){releaseCatalogs(saved.catalogs);cacheStatus='缓存与当前解码设置不符；不会恢复，可明确保存本次目录替换。';}
        else{cachedCatalogs=saved.catalogs;cacheStatus=`已核验目录缓存版本${saved.revision}${saved.recovered?'，已忽略损坏的另一份记录':''}；请明确恢复。`;}
      }
    }catch(error){if(id===generation){cacheRevision=null;clearCached();cacheStatus=error?.code==='CACHE_COMMIT_UNKNOWN'?'保存结果未知，请重新检查缓存；取消不会撤销已发出的写入。'
      :error?.code==='CACHE_CONFLICT'?'缓存已变化或版本冲突，请重新检查后再保存。'
      :error?.code==='CACHE_BUSY'?'缓存仍有未完成操作，请稍后明确检查。'
      :error?.code==='CACHE_CORRUPT'?'目录缓存未通过核验，已保留现有文件。':'目录缓存操作未完成；可继续本次已载入目录。';}}
    finally{if(id===generation&&active===operation){active=null;busy=false;cachePhase=null;
      status=target?'输入和确认已清空，请按当前目录重新填写。':config.games?'请选择游戏与区域。':'请先载入目录并选择游戏与区域。';emit();}}
    return snapshot();
  }
  function inputStatus() { status = validInputs() ? '输入已更新，请重新阅读并确认文本。' : '请按配置编码重新填写1–16字节的输入。'; }
  function bindTarget() {
    target = null;
    if (!config || gameOrdinal < 0 || referenceOrdinal < 0 || regions[referenceOrdinal]?.status !== 'available') return;
    try {
      if (galaxies.length && galaxyOrdinal < 0) { status = '请选择此区域对应的分组。'; return; }
      const gameCodeText = config.games.games[gameOrdinal].code, gameCode = Number(gameCodeText);
      if (!Number.isInteger(gameCode) || gameCode < 1 || gameCode > 14) throw new Error();
      const selected = selectLauncherRegion(config.games, gameOrdinal, config.regions, referenceOrdinal,
        galaxies.length ? { galaxyOrdinal: galaxies[galaxyOrdinal].galaxyOrdinal } : {});
      const allowed = new Set(config.allowedEndpoints.map(endpointKey));
      if (!selected.billingEndpoints.length || selected.billingEndpoints.some(value => !allowed.has(endpointKey(value)))) throw new Error();
      target = Object.freeze({ gameCodeText, gameCode, endpoints: selected.billingEndpoints });
      status = config.textPages ? '配置已就绪，请填写输入并阅读所提供的四页文本。' : '配置已载入，尚未提供阅读文本。';
    } catch { status = '所选区域的连接配置不可用。'; }
  }
  resources=createWeChatLauncherResources({wx,config:config?.patch??null,cacheProfile:config?.resourceCacheProfile??null,isBusy:()=>busy,
    getSelection(){if(!loadedCatalogs||gameOrdinal<0||referenceOrdinal<0||regions[referenceOrdinal]?.status!=='available'||galaxies.length&&galaxyOrdinal<0)return null;
      return{catalogs:loadedCatalogs,gameOrdinal,referenceOrdinal,...(galaxies.length?{galaxyOrdinal:galaxies[galaxyOrdinal].galaxyOrdinal}:{})};},
    invalidateInputs(){invalidate();clearInputs();status='输入和确认已清空，请在资源准备后重新填写。';},
    onBusy(value){busy=value;},onChange:()=>emit()});
  const host = Object.freeze({ snapshot,
    choosePatchSource:index=>resources.chooseSource(index),importResourceBase:()=>resources.importBase(),prepareResources:()=>resources.prepare(),
    clearResources:()=>resources.clear(),selectResources:()=>resources.select(),copySelectedResources:()=>resources.copySelectedResources(),
    checkResourceCache:()=>resources.checkCache(),restoreResourceCache:()=>resources.restoreCache(),saveResourceCache:()=>resources.saveCache(),
    checkCatalogCache:()=>runCatalogCache('read'),saveCatalogCache:()=>runCatalogCache('save'),
    restoreCatalogCache(){
      if(busy||!cachedCatalogs||!cachePolicy(cachedCatalogs))return false;
      let candidate;try{candidate=snapshotPortableLauncherCatalogs(cachedCatalogs);}catch{return false;}
      invalidate();clearInputs();clearSelection();releaseCatalogs(loadedCatalogs);loadedCatalogs=candidate;catalogComparison=null;
      config=Object.freeze({...config,games:candidate.games,regions:candidate.regions});
      status='已读入所检查的本机目录；请重新选择游戏与区域，来源仍未验证。';emit();return true;
    },
    async loadCatalogs() {
      if (busy || !config?.bootstrap) return snapshot();
      invalidate(); clearInputs(); clearSelection();
      const previousCatalogs=loadedCatalogs;loadedCatalogs=null;catalogComparison=null;
      config = Object.freeze({ ...config, games: null, regions: null });
      busy = loadingCatalogs = true; status = '请选择要只读核验的本地登录器文件。';
      const id = generation, control = createWeChatAbortController(), operation = Object.freeze({ cancel: control.abort }); active = operation;
      let launcherBytes;
      emit();
      try {
        const clock = createWeChatDeadlineClock(), settings = config.bootstrap;
        // Check documented HTTP support before asking for a file; never infer an allowlist or disable native checks.
        const loader = createWeChatLauncherBootstrap({ wx, allowedOrigins: settings.allowedOrigins, clock });
        launcherBytes = await readWeChatLauncherFile({ wx, signal: control.signal, clock });
        if (id !== generation) return snapshot();
        status = '正在核验初始化数据并读取目录…'; emit();
        const result = await loader.prepare({ launcherBytes, gameListBytes: previousCatalogs?.gameListBytes??null, regionListBytes: previousCatalogs?.regionListBytes??null,
          endpoints: settings.endpoints, encoding: settings.encoding, allowBareAmpersands: config.allowBareAmpersands,
          timeoutMs: settings.timeoutMs, signal: control.signal });
        if (id !== generation) return snapshot();
        if (result.disposition === 'catalogs-prepared') {
          loadedCatalogs=snapshotPortableLauncherCatalogs(result.catalogs);
          catalogComparison=Object.freeze({...result.comparison});
          config = Object.freeze({ ...config, games: result.catalogs.games, regions: result.catalogs.regions });
          status = '目录已核验并载入，请选择游戏与区域。';
        } else status = '已收到登录器更新候选；未执行，请提供匹配版本后重新加载目录。';
      } catch (error) {
        if (id === generation) status = error?.code === 'HTTP_CAPABILITY' ? '当前平台不支持所需的目录请求能力。'
          : error?.code === 'FILE_CAPABILITY' ? '当前平台不能选择并读取本地文件。' : '目录未载入，请检查所选文件、配置和连接后重试。';
      } finally {
        launcherBytes?.fill(0);
        releaseCatalogs(previousCatalogs);
        if (id === generation && active === operation) { active = null; busy = loadingCatalogs = false; emit(); }
      }
      return snapshot();
    },
    chooseGame(ordinal) {
      if (busy || !config?.games || !Number.isInteger(ordinal) || ordinal < 0 || ordinal >= config.games.games.length) return false;
      invalidate(); clearInputs(); gameOrdinal = ordinal; referenceOrdinal = galaxyOrdinal = -1; target = null; galaxies = [];
      regions = listGameRegions(config.games, ordinal, config.regions); status = '请选择可用区域。';resources.selectionChanged(); emit(); return true;
    },
    chooseRegion(ordinal) {
      if (busy || !config || gameOrdinal < 0 || !Number.isInteger(ordinal) || ordinal < 0 || ordinal >= regions.length) return false;
      invalidate(); clearInputs(); referenceOrdinal = ordinal; galaxyOrdinal = -1; target = null; galaxies = [];resources.selectionChanged();
      if (regions[ordinal].status !== 'available') { status = '该区域暂不可用，请选择其他区域。'; emit(); return false; }
      try { galaxies = listGameGalaxies(config.games, gameOrdinal, config.regions, ordinal); }
      catch { status = '区域分组配置不可用。'; emit(); return false; }
      bindTarget();resources.selectionChanged(); emit(); return target !== null || galaxies.length > 0;
    },
    chooseGalaxy(ordinal) {
      if (busy || !Number.isInteger(ordinal) || ordinal < 0 || ordinal >= galaxies.length) return false;
      invalidate(); clearInputs(); galaxyOrdinal = ordinal; bindTarget();resources.selectionChanged(); emit(); return target !== null;
    },
    inputUsername(value) { if (busy || !target) return false; invalidate(); username = typeof value === 'string' ? value.slice(0, 64) : ''; inputStatus(); emit(); return true; },
    inputPassword(value) { if (busy || !target) return false; invalidate(); password = typeof value === 'string' ? value.slice(0, 64) : ''; inputStatus(); emit(); return true; },
    beginReview() {
      if (busy || !target || !config?.textPages || !validInputs()) return false;
      let bytes;
      try {
        bytes = encodeLauncherCredential(username, { encoding: config.textEncoding });
        review = createLauncherLicenseReview({ gameCodeText: target.gameCodeText, usernameBytes: bytes,
          recordedVersion: 0, forcePrompt: true, pageAvailability: config.textPages.map(() => true) });
        if (review.snapshot().state !== 'reviewing') throw new Error();
        accepted = false; status = '请逐页阅读所提供的文本。'; emit(); return true;
      } catch { review = null; status = '当前阅读流程不可用。'; emit(); return false; }
      finally { bytes?.fill(0); }
    },
    nextPage() { if (!review || review.snapshot().pageOrdinal >= 3) return false; review.advance(); emit(); return true; },
    decide(accept) {
      if (!review || typeof accept !== 'boolean') return false;
      try { review.decide(accept); } catch { return false; }
      accepted = review.snapshot().state === 'accepted'; review = null;
      status = accepted ? '本次文本已确认，可以开始会话。' : '未确认文本，未打开连接。'; emit(); return accepted;
    },
    async login() {
      if (!snapshot().canLogin) return snapshot();
      const id = ++generation; let userBytes, passwordBytes, session;
      busy = true; status = '正在连接…'; rows = []; selectedLabel = ''; accepted = false;
      try {
        userBytes = encodeLauncherCredential(username, { encoding: config.textEncoding }); passwordBytes = encodeLauncherCredential(password, { encoding: config.textEncoding });
        session = createWeChatLauncherSession({ wx, endpoints: target.endpoints, firstEndpointOrdinal: 0,
          requestCounter: counter, gameCode: target.gameCode, usernameBytes: userBytes, passwordBytes });
        counter = (counter + 1) >>> 0; active = session;
      } catch { busy = false; status = '会话未能开始，请检查平台能力和连接设置。'; }
      finally { userBytes?.fill(0); passwordBytes?.fill(0); clearInputs(); emit(); }
      if (!session) return snapshot();
      try {
        const result = await session.start();
        if (id !== generation || active !== session) return snapshot();
        busy = false;
        const state = result.snapshot.state;
        if (state === 'profiles') {
          rows = session.getChoices().rows.map(row => ({ ordinal: row.displayOrdinal,
            label: profileLabel(row.nameBytes, row.displayOrdinal, config.textEncoding), selectable: row.selectionGate.passes }));
          status = '已收到候选，请明确选择可用项目。';
        } else status = state === 'no-profiles' ? '服务未返回候选项目。' : state === 'rejected' ? '服务拒绝了本次请求。'
          : state === 'timed-out' ? '连接已超时。' : state === 'cancelled' ? '会话已取消。' : '交换未完成，请检查配置和平台能力。';
      } catch { if (id === generation) { busy = false; status = '交换未完成，请检查配置和平台能力。'; } }
      if (id === generation) emit(); return snapshot();
    },
    selectProfile(ordinal) {
      if (busy || !active || !Number.isInteger(ordinal)) return false;
      try { active.selectProfile(ordinal); selectedLabel = rows.find(row => row.ordinal === ordinal)?.label ?? '';
        status = '候选已选择，游戏交接尚未完成。'; emit(); return true; }
      catch { status = '该候选不可选择。'; emit(); return false; }
    },
    cancel() { const saving=active?.kind==='cache-save';invalidate(); clearInputs();clearCached();cacheRevision=null;resources.hide();
      if(config?.catalogCacheProfile)cacheStatus=saving?'保存结果需重新检查；已发出的写入不能撤销。':'请重新检查目录缓存。';
      status = saving?'输入和确认已清空；保存结果需重新检查。':'会话已取消，输入和确认已清空。'; return emit(); },
    hide() { const saving=active?.kind==='cache-save';invalidate(); clearInputs();clearCached();cacheRevision=null;resources.hide();
      if(config?.catalogCacheProfile)cacheStatus=saving?'保存结果需重新检查；已发出的写入不能撤销。':'请重新检查目录缓存。';
      status = saving?'输入和确认已清空；保存结果需重新检查。':config ? config.games ? '输入和确认已清空，请重新填写。' : '输入和确认已清空，请重新加载目录。' : '尚未提供连接配置，当前不能开始会话。'; return emit(); },
  });
  emit(); return host;
}

/** Explicit configuration UI -> verified candidate -> allowlisted session target. No credential access. */
import { computeLauncherFileMd5, listGameRegions, listGameGalaxies, selectLauncherRegion, snapshotLauncherSourceProfile } from '../shared/index.mjs';
import { readLauncherCatalogBytes } from './launcher-file-io.mjs';
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
import { createLauncherCandidateStore } from './launcher-candidate-store.mjs';
import { createLauncherHttpClient } from './launcher-http.mjs';
import { createLauncherBootstrap, createWin32LauncherBootstrap } from './launcher-bootstrap.mjs';
import { bindLauncherSessionTarget } from './launcher-target.mjs';
import { createLauncherCatalogProcessInput } from './launcher-launch-data.mjs';

const labels = Object.freeze({ available: '可选择', missing: '配置缺失', ambiguous: '名称重复', closed: '已关闭' });
export function bindLoginCatalogControls({ runtime, onTarget, onBusy }) {
  const sourceProfile = snapshotLauncherSourceProfile(runtime);
  if (runtime.bootstrap && snapshotLauncherSourceProfile(runtime.bootstrap).id !== sourceProfile.id) throw new TypeError('Bootstrap source profile does not match the session.');
  const $ = id => document.getElementById(id);
  const ui = Object.fromEntries(['session-catalog-status', 'session-catalog-source', 'session-game', 'session-region',
    'session-target-status', 'prepare-session-catalogs', 'session-game-file', 'session-region-file', 'session-file-fields',
    'session-catalog-encoding', 'session-allow-bare', 'load-session-files', 'session-cache-status', 'check-session-cache',
    'save-session-cache', 'restore-session-cache', 'cancel-catalog-operation', 'session-galaxy', 'session-galaxy-field'].map(id => [id, $(id)]));
  let candidate = null, selection = null, choices = [], locked = false, operation = null, generation = 0;
  let revision = null, hasPair = false, store = null;
  try { store = createLauncherCandidateStore({ profile: 'launcher-local' }); } catch { /* File/HTTP selection remains usable. */ }
  const httpClient = createLauncherHttpClient({ allowedOrigins: [runtime.origin] });
  const bootstrap = sourceProfile.id === 'win32-current' ? createWin32LauncherBootstrap({ httpClient }) : createLauncherBootstrap({ httpClient });
  function status(text, kind = 'waiting') { ui['session-catalog-status'].textContent = text; ui['session-catalog-status'].dataset.kind = kind; }
  function controls() {
    const busy = locked || !!operation;
    ui['session-file-fields'].disabled = busy;
    ui['load-session-files'].disabled = busy || !ui['session-game-file'].files[0] || !ui['session-region-file'].files[0];
    ui['prepare-session-catalogs'].disabled = busy || !runtime.bootstrap;
    ui['session-game'].disabled = busy || !candidate;
    ui['session-region'].disabled = busy || !candidate || !choices.some(choice => choice.status === 'available');
    ui['session-galaxy'].disabled = busy || ui['session-galaxy-field'].hidden;
    ui['check-session-cache'].disabled = busy || !store;
    ui['save-session-cache'].disabled = busy || !store || revision === null || !candidate;
    ui['restore-session-cache'].disabled = busy || !store || revision === null || !hasPair;
    ui['cancel-catalog-operation'].disabled = !operation || operation.control.signal.aborted;
  }
  function clearSelection() {
    selection = null; onTarget(null);
    ui['session-target-status'].textContent = '尚未选择可用的游戏与区域。';
  }
  function clearCatalogs() {
    candidate = null; choices = []; clearSelection();
    ui['session-galaxy-field'].hidden = true; ui['session-galaxy'].replaceChildren();
    ui['session-game'].replaceChildren(); ui['session-region'].replaceChildren();
    ui['session-catalog-source'].textContent = '尚未载入配置。';
  }
  function begin(kind, clear = false) {
    if (locked || operation) return null;
    operation = { kind, generation: ++generation, control: new AbortController() };
    if (clear) clearCatalogs();
    onBusy(true); controls(); return operation;
  }
  function current(op) { return operation === op && generation === op.generation && !op.control.signal.aborted; }
  function end(op) {
    if (operation !== op) return;
    if (op.control.signal.aborted && op.kind !== 'save') {
      status('配置操作已取消，未应用迟到结果。');
      if (['check', 'restore'].includes(op.kind)) { revision = null; hasPair = false; ui['session-cache-status'].textContent = '缓存读取已取消，请重新检查。'; }
    }
    operation = null; onBusy(false); controls();
  }
  function errorStatus(op, error) {
    if (op.control.signal.aborted || error?.code === 'BOOTSTRAP_ABORTED' || error?.code === 'HTTP_ABORTED') status('配置操作已取消，未应用迟到结果。');
    else status('配置操作未完成，请核对文件、解析选项或本地配置服务。', 'error');
  }
  function option(value, text, disabled = false) {
    const node = document.createElement('option'); node.value = String(value); node.textContent = text; node.disabled = disabled; return node;
  }
  function chooseGalaxy() {
    clearSelection();
    if (!candidate || ui['session-region'].value === '') { controls(); return; }
    if (!ui['session-galaxy-field'].hidden && ui['session-galaxy'].value === '') {
      ui['session-target-status'].textContent = '请选择此游戏对应的分组。'; controls(); return;
    }
    try {
      selection = bindLauncherSessionTarget({ catalogs: candidate, gameOrdinal: Number(ui['session-game'].value),
        referenceOrdinal: Number(ui['session-region'].value), allowedEndpoints: runtime.endpoints,
        ...(!ui['session-galaxy-field'].hidden ? { galaxyOrdinal: Number(ui['session-galaxy'].value) } : {}) });
      onTarget(selection);
      ui['session-target-status'].textContent = '区域连接目标已全部匹配本地允许列表。';
      status('配置已就绪，可以填写测试账号并确认本地文本。', 'success');
    } catch (error) {
      const messages = { TARGET_DENIED: '该区域包含未获准的连接目标。请更换区域或核对本地服务设置。',
        TARGET_EMPTY: '该区域没有可用的连接目标。', TARGET_GAME: '该游戏编号暂不在已证请求范围内。' };
      ui['session-target-status'].textContent = Object.hasOwn(messages, error.code) ? messages[error.code] : '该区域配置暂不受支持。';
      status('所选区域未就绪，未打开连接。', 'error');
    }
    controls();
  }
  function chooseRegion() {
    ui['session-galaxy-field'].hidden = true; ui['session-galaxy'].replaceChildren();
    try {
      if (candidate && ui['session-region'].value !== '') {
        const rows = listGameGalaxies(candidate.games, Number(ui['session-game'].value), candidate.regions, Number(ui['session-region'].value));
        if (rows.length) {
          ui['session-galaxy-field'].hidden = false;
          ui['session-galaxy'].replaceChildren(option('', '请选择分组'), ...rows.map(row => option(row.galaxyOrdinal,
            row.status === 'available' ? row.name : `${row.name} · 名称重复`, row.status !== 'available')));
          ui['session-galaxy'].value = '';
        }
      }
    } catch { /* bind below reports the current region's existing unavailable state. */ }
    chooseGalaxy();
  }
  function chooseGame() {
    if (!candidate) return;
    choices = listGameRegions(candidate.games, Number(ui['session-game'].value), candidate.regions);
    ui['session-region'].replaceChildren(...choices.map(choice => option(choice.referenceOrdinal, `${choice.name} · ${labels[choice.status]}`, choice.status !== 'available')));
    const first = choices.find(choice => choice.status === 'available');
    ui['session-region'].value = first ? String(first.referenceOrdinal) : ''; chooseRegion();
  }
  function present(value, source) {
    candidate = snapshotLauncherCatalogCandidate(value);
    ui['session-catalog-source'].textContent = source;
    ui['session-catalog-encoding'].value = candidate.encoding;
    ui['session-allow-bare'].checked = candidate.allowBareAmpersands;
    ui['session-game-file'].value = ''; ui['session-region-file'].value = '';
    ui['session-game'].replaceChildren(...candidate.games.games.map(game => option(game.ordinal, game.name)));
    ui['session-game'].value = '0'; chooseGame();
  }
  function rememberCache(value) { revision = value.revision; hasPair = !!value.catalogs; }
  function cacheFailure(error) {
    revision = null; hasPair = false;
    const messages = { CACHE_CONFLICT: '缓存已在其他页面变化。请重新检查后再保存或恢复。',
      CACHE_CORRUPT: '缓存内容未通过校验；不会自动删除，可继续读取文件。', CACHE_SCHEMA: '缓存格式不受支持；不会自动覆盖。',
      CACHE_ABORTED: '缓存操作已取消，请重新检查后继续。' };
    ui['session-cache-status'].textContent = typeof error?.code === 'string' && Object.hasOwn(messages, error.code) ? messages[error.code] : '本机缓存暂不可用，可继续读取文件或准备配置。';
  }
  async function readCache(restore) {
    const op = begin(restore ? 'restore' : 'check', restore); if (!op) return;
    ui['session-cache-status'].textContent = '正在读取并核验本机缓存…';
    try {
      const result = await store.read({ signal: op.control.signal });
      if (!current(op)) return;
      rememberCache(result);
      ui['session-cache-status'].textContent = result.catalogs ? `缓存版本${revision}，包含${result.catalogs.games.games.length}个游戏条目。` : '本机缓存为空。';
      if (restore && result.catalogs) present(result.catalogs, '显式恢复的本机配置缓存 · 来源未验证');
      else if (restore) status('本机缓存为空，请读取文件或准备配置。');
    } catch (error) { cacheFailure(error); if (restore) errorStatus(op, error); }
    finally { end(op); }
  }
  ui['check-session-cache'].addEventListener('click', () => { void readCache(false); });
  ui['restore-session-cache'].addEventListener('click', () => { void readCache(true); });
  ui['save-session-cache'].addEventListener('click', async () => {
    if (!candidate || revision === null) return;
    const op = begin('save'); if (!op) return;
    const pair = candidate, expectedRevision = revision;
    try {
      const result = await store.commitPair(pair, { expectedRevision, signal: op.control.signal });
      revision = result.revision; hasPair = true;
      ui['session-cache-status'].textContent = result.cancellationTooLate ? `缓存版本${revision}已保存，取消未撤销已完成的保存。`
        : result.deadlineExceededAfterCommit ? `缓存版本${revision}已保存，完成确认稍有延迟。` : `已保存配置 · 缓存版本${revision}。`;
    } catch (error) { cacheFailure(error); }
    finally { end(op); }
  });
  ui['load-session-files'].addEventListener('click', async () => {
    const op = begin('files', true); if (!op) return;
    const gameFile = ui['session-game-file'].files[0], regionFile = ui['session-region-file'].files[0];
    const encoding = ui['session-catalog-encoding'].value, allowBareAmpersands = ui['session-allow-bare'].checked;
    status('正在读取本地配置文件…');
    try {
      const [gameListBytes, regionListBytes] = await Promise.all([readLauncherCatalogBytes(gameFile), readLauncherCatalogBytes(regionFile)]);
      if (!current(op)) return;
      present({ gameListBytes, regionListBytes, gameListMd5: computeLauncherFileMd5(gameListBytes), regionListMd5: computeLauncherFileMd5(regionListBytes),
        encoding, allowBareAmpersands }, '所选本地双XML · 来源未验证');
    } catch (error) { errorStatus(op, error); }
    finally { end(op); }
  });
  ui['prepare-session-catalogs'].addEventListener('click', async () => {
    if (!runtime.bootstrap) return;
    const op = begin('prepare', true); if (!op) return;
    status('正在检查启动器摘要并准备配置候选…');
    try {
      const descriptor = runtime.bootstrap;
      const deadline = performance.now() + 10000;
      const remaining = () => { const milliseconds = Math.ceil(deadline - performance.now()); if (milliseconds < 1) throw new Error(); return milliseconds; };
      const get = async (url, kind) => (await httpClient.getBytes(url, { kind, signal: op.control.signal, timeoutMs: remaining() })).bytes;
      const getCatalog = url => sourceProfile.id === 'win32-current' && url === null ? null : get(url, 'catalog');
      const [launcherBytes, gameListBytes, regionListBytes] = await Promise.all([
        get(descriptor.localInputs.launcher, 'package'), getCatalog(descriptor.localInputs.gameList), getCatalog(descriptor.localInputs.regionList)]);
      if (!current(op)) return;
      const result = await bootstrap.prepare({ launcherBytes, gameListBytes, regionListBytes, endpoints: descriptor.endpoints,
        encoding: descriptor.encoding, allowBareAmpersands: descriptor.allowBareAmpersands, signal: op.control.signal, timeoutMs: remaining() });
      if (!current(op)) return;
      remaining();
      if (result.disposition === 'catalogs-prepared') present(result.catalogs, '本地配置服务准备的完整候选 · 来源未验证');
      else if (result.disposition === 'launcher-update-candidate') status('启动器更新候选已通过字节校验；尚未安装或执行，初始化未完成。', 'update');
      else throw new Error();
    } catch (error) { errorStatus(op, error); }
    finally { end(op); }
  });
  function cancel() {
    if (!operation) return;
    operation.control.abort();
    if (operation.kind === 'save') ui['session-cache-status'].textContent = '已请求取消保存，等待事务结果…';
    else status('正在取消配置操作…');
    controls();
  }
  ui['cancel-catalog-operation'].addEventListener('click', cancel);
  ui['session-game'].addEventListener('change', chooseGame);
  ui['session-region'].addEventListener('change', chooseRegion);
  ui['session-galaxy'].addEventListener('change', chooseGalaxy);
  for (const key of ['session-game-file', 'session-region-file', 'session-catalog-encoding', 'session-allow-bare']) {
    ui[key].addEventListener('change', () => { if (operation || locked) return; generation += 1; clearCatalogs(); status('文件或解析选项已变化，请重新读取配置。'); controls(); });
  }
    ui['session-cache-status'].textContent = store ? '尚未检查缓存；只保存配置文件和解析选项。' : '本机缓存暂不可用。';
  controls();
  return Object.freeze({ setLocked(value) { locked = value; controls(); }, cancel,
    patchSelection() {
      if(!candidate||!selection)return null;
      const game=candidate.games.games[selection.gameOrdinal],selected=selectLauncherRegion(candidate.games,selection.gameOrdinal,candidate.regions,selection.referenceOrdinal,
        selection.galaxyOrdinal===undefined?{}:{galaxyOrdinal:selection.galaxyOrdinal});
      return Object.freeze({required:!!game.patcherText,patchEndpoint:selected.patchEndpoint});
    },
    createPatchInput(options) {
      if(locked||operation||!candidate||!selection)throw new Error('Configuration is unavailable.');
      return {...options,callerProfile:sourceProfile.id,catalogs:snapshotLauncherCatalogCandidate(candidate),gameOrdinal:selection.gameOrdinal,referenceOrdinal:selection.referenceOrdinal,
        ...(selection.galaxyOrdinal===undefined?{}:{galaxyOrdinal:selection.galaxyOrdinal})};
    },
    createProcessInput(options) {
      if (locked || operation || !candidate || !selection) throw new Error('Configuration is unavailable.');
      return createLauncherCatalogProcessInput({ ...options, catalogs: candidate,
        gameOrdinal: selection.gameOrdinal, referenceOrdinal: selection.referenceOrdinal,
        ...(selection.galaxyOrdinal !== undefined ? { galaxyOrdinal: selection.galaxyOrdinal } : {}) });
    },
    snapshot: () => Object.freeze({ hasCandidate: !!candidate, hasSelection: !!selection, operation: operation?.kind ?? null, revision, hasPair }) });
}

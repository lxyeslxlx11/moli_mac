import { computeLauncherFileMd5, listGameRegions, createOfflineRegionLaunchPlan } from '../shared/index.mjs';
import { readLauncherCatalogBytes } from './launcher-file-io.mjs';
import { makeSyntheticLauncher } from './launcher-fixture.mjs';
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
import { createLauncherCandidateStore } from './launcher-candidate-store.mjs';

const get = id => document.getElementById(id);
const ui = {
  gameFile: get('game-catalog-file'), regionFile: get('region-catalog-file'), encoding: get('catalog-encoding'),
  bare: get('allow-bare-ampersands'), load: get('load-catalogs'), fixture: get('load-launcher-fixture'),
  game: get('launcher-game'), region: get('launcher-region'), directory: get('launcher-directory'),
  plan: get('make-launcher-plan'), result: get('launcher-plan'), status: get('launcher-status'),
  cacheStatus: get('launcher-cache-status'), cacheSave: get('save-launcher-cache'), cacheRestore: get('restore-launcher-cache'),
  cacheRecheck: get('recheck-launcher-cache'), cacheCancel: get('cancel-launcher-cache'),
};
const state = { generation: 0, games: null, regions: null, candidate: null, choices: [], busy: false,
  cacheOperation: null, cacheControl: null, cacheRevision: null, cacheHasPair: false };
let cacheStore;
const labels = { available: '可选择', missing: '配置缺失', ambiguous: '名称重复', closed: '已关闭' };
function status(text, kind = 'waiting') { ui.status.textContent = text; ui.status.dataset.kind = kind; }
function clearPlan() { ui.result.textContent = '尚未生成计划。'; }
const dataLocked = () => ['save', 'restore'].includes(state.cacheOperation);
function cacheStatus(text, kind = 'waiting') { ui.cacheStatus.textContent = text; ui.cacheStatus.dataset.kind = kind; }
function controls() {
  const locked = dataLocked();
  for (const input of [ui.gameFile, ui.regionFile, ui.encoding, ui.bare, ui.fixture]) input.disabled = locked;
  ui.directory.disabled = state.busy || locked;
  ui.load.disabled = state.busy || locked || !ui.gameFile.files?.[0] || !ui.regionFile.files?.[0];
  ui.game.disabled = state.busy || locked || !state.games;
  ui.region.disabled = state.busy || locked || !state.games || !state.choices.some(r => r.status === 'available');
  const choice = state.choices[Number(ui.region.value)];
  ui.plan.disabled = state.busy || locked || !state.games || ui.region.value === '' || choice?.status !== 'available' || !ui.directory.value.trim();
  ui.cacheSave.disabled = !cacheStore || state.busy || !!state.cacheOperation || state.cacheRevision === null || !state.candidate;
  ui.cacheRestore.disabled = !cacheStore || state.busy || !!state.cacheOperation || state.cacheRevision === null || !state.cacheHasPair;
  ui.cacheRecheck.disabled = !cacheStore || state.busy || !!state.cacheOperation;
  ui.cacheCancel.disabled = !state.cacheOperation || !!state.cacheControl?.signal.aborted;
}
function clearCatalogs() {
  state.games = null; state.regions = null; state.candidate = null; state.choices = [];
  ui.game.replaceChildren(); ui.region.replaceChildren(); get('region-diagnostics').replaceChildren();
  get('catalog-counts').textContent = '请选择配置或载入示例。';
  clearPlan();
}
function invalidateFiles() {
  state.generation += 1; state.busy = false; clearCatalogs(); ui.directory.value = '';
  get('game-file-label').textContent = ui.gameFile.files?.[0]?.name ?? '尚未选择';
  get('region-file-label').textContent = ui.regionFile.files?.[0]?.name ?? '尚未选择';
  get('launcher-source').textContent = '所选本地文件 · 尚未解析';
  status('文件或解析选项已改变，请重新读取配置。'); controls();
}
function option(value, text, disabled = false) {
  const element = document.createElement('option'); element.value = String(value); element.textContent = text; element.disabled = disabled; return element;
}
function selectGame() {
  clearPlan();
  state.choices = listGameRegions(state.games, Number(ui.game.value), state.regions);
  ui.region.replaceChildren(...state.choices.map(choice => option(choice.referenceOrdinal, `${choice.name} · ${labels[choice.status]}`, choice.status !== 'available')));
  const first = state.choices.find(choice => choice.status === 'available');
  ui.region.value = first ? String(first.referenceOrdinal) : '';
  const items = state.choices.map(choice => {
    const li = document.createElement('li'); li.textContent = `${choice.name}：${labels[choice.status]}`; return li;
  });
  get('region-diagnostics').replaceChildren(...items);
  status(first ? '已选择游戏。确认区域与目录后可生成离线计划。' : '此游戏没有可选择的区域，请检查配置。', first ? 'waiting' : 'error');
  controls();
}
function presentCatalogs(candidate, source) {
  const { games, regions } = candidate; state.candidate = candidate;
  state.games = games; state.regions = regions;
  get('launcher-source').textContent = source;
  const compatibility = games.diagnostics.literalAmpersands + regions.diagnostics.literalAmpersands;
  get('catalog-counts').textContent = `${games.games.length} 个游戏条目 · ${regions.regions.length} 个区域 · 裸 & 兼容 ${compatibility} 处`;
  ui.game.replaceChildren(...games.games.map(game => option(game.ordinal, `${game.name} · Code ${game.code} · 序号 ${game.ordinal}`)));
  ui.game.value = '0'; selectGame();
}
async function loadFiles() {
  if (dataLocked()) return;
  const generation = ++state.generation;
  const gameFile = ui.gameFile.files?.[0], regionFile = ui.regionFile.files?.[0];
  const encoding = ui.encoding.value, allowBareAmpersands = ui.bare.checked;
  clearCatalogs(); state.busy = true; controls(); status('正在本机读取配置…');
  try {
    const [gameListBytes, regionListBytes] = await Promise.all([readLauncherCatalogBytes(gameFile), readLauncherCatalogBytes(regionFile)]);
    if (generation !== state.generation) return;
    const candidate = snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes, encoding, allowBareAmpersands,
      gameListMd5: computeLauncherFileMd5(gameListBytes), regionListMd5: computeLauncherFileMd5(regionListBytes) });
    presentCatalogs(candidate, '所选本地文件 · 已解析');
  } catch (error) {
    if (generation !== state.generation) return;
    clearCatalogs(); get('launcher-source').textContent = '所选本地文件 · 未通过解析';
    status(`读取失败${error.code ? ` [${error.code}]` : ''}：${error.message}`, 'error');
  } finally { if (generation === state.generation) { state.busy = false; controls(); } }
}
function loadFixture() {
  if (dataLocked()) return;
  state.generation += 1; state.busy = false; clearCatalogs();
  ui.gameFile.value = ''; ui.regionFile.value = '';
  get('game-file-label').textContent = '尚未选择'; get('region-file-label').textContent = '尚未选择';
  const fixture = makeSyntheticLauncher(); ui.directory.value = fixture.directory; ui.encoding.value = 'utf-8'; ui.bare.checked = false;
  const encoder = new TextEncoder(), gameListBytes = encoder.encode(fixture.games), regionListBytes = encoder.encode(fixture.regions);
  const candidate = snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes, encoding: 'utf-8', allowBareAmpersands: false,
    gameListMd5: computeLauncherFileMd5(gameListBytes), regionListMd5: computeLauncherFileMd5(regionListBytes) });
  presentCatalogs(candidate, '原创合成示例 · 不含官方配置');
}
function makePlan() {
  clearPlan();
  try {
    const ordinal = Number(ui.game.value);
    const code = state.games.games[ordinal].code;
    const plan = createOfflineRegionLaunchPlan(state.games, ordinal, state.regions, Number(ui.region.value), {
      iniText: `[Path]\nGame${code}=${ui.directory.value}\n`,
    });
    ui.result.textContent = JSON.stringify(plan, null, 2);
    status('离线计划已生成。目录与端点未访问，认证未验证。', 'success');
  } catch (error) { status(`未生成计划${error.code ? ` [${error.code}]` : ''}：${error.message}`, 'error'); }
}
function cacheFailure(error) {
  state.cacheRevision = null; state.cacheHasPair = false;
  const messages = {
    CACHE_CONFLICT: '缓存已在其他页面更改。请重新检查后再保存或恢复，当前配置已保留。',
    CACHE_ABORTED: '已取消缓存操作。请重新检查缓存后继续。',
    CACHE_TIMEOUT: '缓存操作超时。请重新检查后重试，当前缓存不会被自动替换。',
    CACHE_CORRUPT: '缓存内容未通过校验。可继续读取本地文件或载入示例。',
    CACHE_SCHEMA: '缓存格式暂不支持。可继续读取本地文件或载入示例。',
  };
  const fallback = state.candidate ? '本机缓存暂不可用。当前配置仍可使用，可重新检查后重试。' : '本机缓存暂不可用。可重新检查、读取本地文件或载入示例。';
  cacheStatus(messages[error.code] ?? fallback, error.code === 'CACHE_ABORTED' ? 'waiting' : 'error');
}
function beginCache(operation, message) {
  state.cacheOperation = operation; state.cacheControl = new AbortController(); cacheStatus(message); controls();
  return state.cacheControl.signal;
}
function finishCache() { state.cacheOperation = null; state.cacheControl = null; controls(); }
function rememberCache(result) { state.cacheRevision = result.revision; state.cacheHasPair = !!result.catalogs; }
async function inspectCache() {
  if (!cacheStore || state.cacheOperation || state.busy) return;
  const signal = beginCache('info', '正在检查本机缓存…');
  try {
    const result = await cacheStore.read({ signal }); rememberCache(result);
    cacheStatus(result.catalogs ? `本机缓存版本 ${result.revision} · ${result.catalogs.games.games.length} 个游戏 · ${result.catalogs.regions.regions.length} 个区域。` : '本机缓存为空。可保存当前已解析的配置。');
  } catch (error) { cacheFailure(error); } finally { finishCache(); }
}
async function saveCache() {
  if (ui.cacheSave.disabled) return;
  const candidate = state.candidate, expectedRevision = state.cacheRevision;
  const signal = beginCache('save', '正在保存当前配置…');
  try {
    const result = await cacheStore.commitPair(candidate, { expectedRevision, signal });
    state.cacheRevision = result.revision; state.cacheHasPair = true;
    cacheStatus(result.cancellationTooLate ? `本机缓存版本 ${result.revision} 已保存，取消未能撤销已完成的保存。`
      : result.deadlineExceededAfterCommit ? `本机缓存版本 ${result.revision} 已保存，完成确认稍有延迟。`
        : `已保存当前配置 · 本机缓存版本 ${result.revision}。`, 'success');
  } catch (error) { cacheFailure(error); } finally { finishCache(); }
}
async function restoreCache() {
  if (ui.cacheRestore.disabled) return;
  const generation = ++state.generation; clearCatalogs(); ui.directory.value = ''; get('launcher-source').textContent = '本机缓存 · 正在恢复';
  const signal = beginCache('restore', '正在恢复本机缓存…'); status('正在恢复配置…');
  try {
    const result = await cacheStore.read({ signal }); rememberCache(result);
    if (generation !== state.generation) { cacheStatus(`已检查本机缓存版本 ${result.revision}；页面配置已改变，未替换当前选择。`); return; }
    if (!result.catalogs) { cacheStatus('本机缓存为空，请读取文件或载入示例。'); status('尚未恢复配置。'); return; }
    ui.gameFile.value = ''; ui.regionFile.value = '';
    get('game-file-label').textContent = '来自本机缓存'; get('region-file-label').textContent = '来自本机缓存';
    ui.encoding.value = result.catalogs.encoding; ui.bare.checked = result.catalogs.allowBareAmpersands;
    presentCatalogs(result.catalogs, `本机候选缓存 · 版本 ${result.revision} · 来源未验证`);
    cacheStatus(`已恢复本机缓存版本 ${result.revision}。请确认游戏、区域并填写目录。`, 'success');
  } catch (error) {
    cacheFailure(error);
    if (generation === state.generation) { clearCatalogs(); get('launcher-source').textContent = '本机缓存 · 尚未恢复'; status('未恢复配置，请读取文件或载入示例。', 'error'); }
  } finally {
    finishCache();
    if (state.games && document.activeElement === document.body) ui.game.focus();
  }
}
for (const input of [ui.gameFile, ui.regionFile, ui.encoding, ui.bare]) input.addEventListener('change', invalidateFiles);
ui.game.addEventListener('change', selectGame);
ui.region.addEventListener('change', () => { clearPlan(); status('区域已改变，请重新生成计划。'); controls(); });
ui.directory.addEventListener('input', () => { clearPlan(); status('目录已改变，请重新生成计划。'); controls(); });
ui.load.addEventListener('click', loadFiles); ui.fixture.addEventListener('click', loadFixture); ui.plan.addEventListener('click', makePlan);
ui.cacheSave.addEventListener('click', saveCache); ui.cacheRestore.addEventListener('click', restoreCache); ui.cacheRecheck.addEventListener('click', inspectCache);
ui.cacheCancel.addEventListener('click', () => {
  if (!state.cacheControl || !state.cacheOperation) return;
  state.cacheControl.abort(); cacheStatus('正在取消缓存操作…'); controls();
});
try { cacheStore = createLauncherCandidateStore({ profile: 'launcher-local' }); }
catch { cacheStatus('当前浏览器未提供本机缓存。仍可读取本地配置和生成计划。', 'error'); }
loadFixture();
if (cacheStore) inspectCache();

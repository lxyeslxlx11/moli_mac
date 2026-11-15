import { createLauncherLicenseReview, planLauncherUserModeInitialization, planLauncherUserModeChange } from '../shared/launcher-local.mjs';
import { readLauncherCatalogBytes } from './launcher-file-io.mjs';
import { createLauncherSession } from './launcher-session.mjs';
import { createBrowserLauncherTransport } from './launcher-websocket.mjs';
import { LAUNCHER_TEXT_ENCODINGS, encodeLauncherCredential, decodeLauncherProfileName } from '../shared/launcher-text.mjs';
import { bindLoginCatalogControls } from './login-catalog.mjs';
import { createLauncherPreferenceStore } from './launcher-preferences.mjs';
import { createLauncherHandoffLease } from '../shared/launcher-handoff.mjs';
import { createLauncherLaunchLease } from '../shared/launcher-launch.mjs';
import { bindLoginLaunchControls } from './login-launch.mjs';
import { bindLoginPatchControls } from './login-patch.mjs';
import { snapshotLauncherSourceProfile } from '../shared/launcher-source-profile.mjs';

const $ = id => document.getElementById(id);
const user = $('login-username'), password = $('login-password');
const rememberUser = $('remember-username'), rememberPassword = $('remember-password');
let selectedEncoding = 'ascii';
const textProfile = () => ({ encoding: selectedEncoding });
let runtime = null, transport = null, texts = null, review = null, accepted = false, busy = false;
let sourceProfile = null;
let session = null, counter = 0, textGeneration = 0, mode = 2, loadingText = false;
let target = null, catalogView = null, catalogBusy = false;
let preferenceStore = null, savedMode = null, pendingModeChange = null;
let pendingHandoff = null, pendingLaunch = null, launchView = null;
let patchView=null,patchBusy=false;
const testTexts = Object.freeze([
  '原创测试文本 · 第1页\n\n本内容由本项目原创，仅验证四页阅读流程。它不是官方服务条款，也不会建立真实账号。',
  '原创测试文本 · 第2页\n\n本地对端只核对公开的合成用户名和密码。连接仅使用127.0.0.1，不访问游戏服务器。',
  '原创测试文本 · 第3页\n\n输入和本页确认不写入存储。关闭或刷新本页后，所有确认需要重新进行。',
  '原创测试文本 · 第4页\n\n点击确认只完成这四份原创测试说明的本页确认。返回候选不会运行游戏，也不代表官方认证。',
]);
function status(text, kind = 'waiting') { $('login-status').textContent = text; $('login-status').dataset.kind = kind; }
function refreshInputCounts() {
  for (const [field, id] of [[user, 'username-byte-count'], [password, 'password-byte-count']]) {
    const counter = $(id); let bytes;
    try {
      if (!field.value) { counter.textContent = '0 / 16 字节'; counter.dataset.kind = 'waiting'; continue; }
      bytes = encodeLauncherCredential(field.value, textProfile());
      counter.textContent = `${bytes.length} / 16 字节`; counter.dataset.kind = 'waiting';
    } catch (error) {
      counter.textContent = error.code === 'TEXT_LENGTH' && error.byteLength !== null ? `${error.byteLength} / 16 字节，超出范围` : '当前编码无法表示此输入';
      counter.dataset.kind = 'error';
    } finally { bytes?.fill(0); }
  }
}
function controls() {
  $('account-fields').disabled = accountLocked();
  $('text-fields').disabled = accountLocked();
  $('start-login').disabled = accountLocked() || !accepted;
  $('begin-review').disabled = !texts || loadingText;
  $('cancel-login').disabled = !busy;
  $('review-panel').hidden = !review;
  catalogView?.setLocked(busy || patchBusy || !!review || loadingText || $('mode-dialog').open);
  launchView?.setLocked(baseLocked()||patchBusy);
  patchView?.setLocked(baseLocked());
  refreshInputCounts();
}
function baseLocked() {
  return !target || catalogBusy || busy || !!review || loadingText || $('mode-dialog').open;
}
function accountLocked(){return baseLocked()||patchBusy||(patchView&&!patchView.ready());}
function modeStorageStatus(text) { $('mode-storage-status').textContent = text; }
function closeModeDialog() {
  pendingModeChange = null;
  if ($('mode-dialog').open) $('mode-dialog').close();
}
function invalidateConsent() {
  review?.cancel(); review = null; accepted = false;
  $('consent-status').textContent = '请先准备并逐页确认四份本地文本。';
  controls();
}
function clearResult() {
  pendingHandoff?.close(); pendingHandoff = null;
  pendingLaunch?.close(); pendingLaunch = null;
  session?.cancel(); session = null;
  $('profile-list').replaceChildren(); $('selection-status').hidden = true;
}
function applyMode(plan) {
  mode = plan.mode; $('device-mode').value = String(mode);
  rememberUser.checked = plan.retention.rememberUsername;
  rememberPassword.checked = plan.retention.rememberPassword;
  $('retention-options').hidden = !plan.retention.passwordControlVisible;
  modeStorageStatus(savedMode === mode ? '当前保留方式与已保存的一致。' : '当前选择仅在本页生效；保存后可在刷新时恢复。');
  if (plan.clearInputs) {
    user.value = ''; password.value = ''; invalidateConsent(); clearResult();
    status('输入保留方式已切换，输入已清空。');
  }
}
function renderReview() {
  const ordinal = review.snapshot().pageOrdinal;
  $('review-title').textContent = `第${ordinal + 1}页 / 共4页`;
  $('review-text').textContent = texts[ordinal]; $('review-text').scrollTop = 0;
  $('next-page').hidden = ordinal === 3; $('accept-texts').hidden = ordinal !== 3;
  controls(); $('review-title').focus();
}
function renderProfiles(choices, encoding) {
  const owner = session;
  for (const row of choices.rows) {
    const item = document.createElement('li'), description = document.createElement('div');
    const name = document.createElement('span'), note = document.createElement('small'), button = document.createElement('button');
    let label, readable = true;
    try { label = decodeLauncherProfileName(row.nameBytes, { encoding }); }
    catch { label = `名称编码待确认（${row.nameBytes.length}字节）`; readable = false; }
    name.textContent = label;
    note.textContent = !readable ? '名称无法按当前编码无损读取，暂不能选择' : row.selectionGate.passes ? '通过已证候选选择检查' : row.selectionGate.blockedReason === 'billing-expired' ? '计费状态限制选择' : '候选状态限制选择';
    description.append(name, note); button.type = 'button'; button.textContent = '选择';
    button.disabled = !readable || !row.selectionGate.passes;
    button.addEventListener('click', () => {
      if (!readable || !row.selectionGate.passes || session !== owner) return;
      try {
        const selected = session.selectProfile(row.displayOrdinal);
        try {
          const processInput = launchView?.getInput();
          if (processInput) pendingLaunch = createLauncherLaunchLease({ processInput, selection: selected.selection });
          else pendingHandoff = createLauncherHandoffLease({ gameCode: target.gameCode, selection: selected.selection });
        }
        finally { selected.selection.opaqueByteField.fill(0); selected.selection.profile.nameBytes.fill(0); }
        const handoff = pendingHandoff?.snapshot(), complete = pendingLaunch?.snapshot();
        for (const control of $('profile-list').querySelectorAll('button')) control.disabled = true;
        $('selection-status').textContent = complete
          ? complete.clientCreationRequested
          ? `已选择 ${label}。完整交接数据已准备：命令${complete.commandBytes}字节，${complete.resourceRows}项资源，映射${complete.mappingWriteBytes}字节；尚未交给游戏，认证状态未验证。`
          : `已选择 ${label}。仅刷新交接已准备：命令${complete.commandBytes}字节，${complete.resourceRows}项资源，映射${complete.mappingWriteBytes}字节；当前分支不请求游戏进程，认证状态未验证。`
          : handoff.state === 'ready'
          ? `已选择 ${label}。交接写入已准备：${handoff.mappingName}，${handoff.writeBytes}字节；尚未交给游戏，认证状态未验证。`
          : `已选择 ${label}。此编号分支没有命名映射写入；游戏消费者与认证状态未验证。`;
        $('selection-status').hidden = false;
        session.cancel(); session = null;
      } catch { clearResult(); status('该候选当前无法准备交接。', 'error'); }
    });
    item.append(description, button); $('profile-list').append(item);
    row.nameBytes.fill(0);
  }
}
user.addEventListener('input', () => {
  invalidateConsent(); clearResult(); status('用户名已变化，请重新确认本地文本。');
});
password.addEventListener('input', () => { clearResult(); refreshInputCounts(); status(accepted ? '可以显式开始本地交换。' : '等待本地文本确认。'); });
$('login-text-encoding').addEventListener('change', () => {
  const requested = $('login-text-encoding').value;
  if (accountLocked() || !LAUNCHER_TEXT_ENCODINGS.includes(requested)) {
    $('login-text-encoding').value = selectedEncoding; return;
  }
  selectedEncoding = requested;
  user.value = ''; password.value = ''; clearResult(); invalidateConsent();
  status('编码已切换，请重新填写输入并确认本地文本。');
});
for (let i = 0; i < 4; i++) $('license-file-' + i).addEventListener('change', () => {
  textGeneration += 1; texts = null; loadingText = false; invalidateConsent();
  clearResult();
  $('texts-status').textContent = '文件选择已变化，请重新读取四份文本。'; controls();
});
$('load-test-texts').addEventListener('click', () => {
  textGeneration += 1; texts = testTexts; invalidateConsent();
  clearResult();
  for (let i = 0; i < 4; i++) $('license-file-' + i).value = '';
  $('texts-status').textContent = '已载入四页原创测试说明；未提供真实服务条款。'; controls();
});
$('load-license-files').addEventListener('click', async () => {
  const generation = ++textGeneration; texts = null; invalidateConsent(); loadingText = true; controls();
  clearResult();
  $('texts-status').textContent = '正在读取本地文本…';
  try {
    const files = Array.from({ length: 4 }, (_, i) => $('license-file-' + i).files[0]);
    if (files.some(file => !file || !Number.isSafeInteger(file.size) || file.size < 1 || file.size > 65536)) throw new Error();
    const loaded = await Promise.all(files.map(async file => {
      const bytes = await readLauncherCatalogBytes(file);
      try {
        if (bytes.length > 65536) throw new Error();
        const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        if (!text.trim() || text.includes('\0')) throw new Error();
        return text;
      } finally { bytes.fill(0); }
    }));
    if (generation !== textGeneration) return;
    texts = Object.freeze(loaded); $('texts-status').textContent = '四份本地UTF-8文本已读取，内容与来源由你核对。';
  } catch { if (generation === textGeneration) $('texts-status').textContent = '读取失败：请选择四份非空、每份不超过64 KiB的有效UTF-8文本。'; }
  finally { if (generation === textGeneration) { loadingText = false; controls(); } }
});
$('begin-review').addEventListener('click', () => {
  let bytes;
  try {
    bytes = encodeLauncherCredential(user.value, textProfile());
    clearResult();
    review = createLauncherLicenseReview({ gameCodeText: target.gameCodeText, usernameBytes: bytes,
      recordedVersion: 0, forcePrompt: true, pageAvailability: [true, true, true, true] });
    if (review.snapshot().state !== 'reviewing') { review = null; status('当前游戏槽位没有已证的四页文本规格。', 'error'); controls(); return; }
    accepted = false; renderReview();
  } catch (error) { status(error.code === 'LOCAL_GAME_CODE' ? '当前游戏编号的文本规格尚未支持。' : '请先输入当前编码可表示的1至16字节测试用户名。', 'error'); }
  finally { bytes?.fill(0); }
});
$('next-page').addEventListener('click', () => { review.advance(); renderReview(); });
$('decline-texts').addEventListener('click', () => {
  review.decide(false); review = null; accepted = false;
  $('consent-status').textContent = '已拒绝本页文本确认，未开始交换。'; controls(); user.focus();
});
$('accept-texts').addEventListener('click', () => {
  review.decide(true); review = null; accepted = true;
  $('consent-status').textContent = '四份文本已在本页确认；未保存接受记录。';
  status('可以显式开始本地交换。'); controls(); $('start-login').focus();
});
$('device-mode').addEventListener('change', () => {
  const requestedMode = Number($('device-mode').value);
  if (accountLocked() || ![1, 2].includes(requestedMode)) { $('device-mode').value = String(mode); return; }
  const plan = planLauncherUserModeChange({ currentMode: mode, requestedMode, settingsSection: 'LocalLauncher' });
  if (plan.state === 'confirmation-required') {
    pendingModeChange = { currentMode: mode, target };
    $('device-mode').value = String(mode); $('mode-dialog').showModal(); controls();
  }
  else applyMode(plan);
});
$('confirm-mode').addEventListener('click', () => {
  if (!$('mode-dialog').open || !pendingModeChange || pendingModeChange.currentMode !== mode
      || pendingModeChange.target !== target || !target || busy || catalogBusy || review || loadingText) return;
  applyMode(planLauncherUserModeChange({ currentMode: mode, requestedMode: 1, settingsSection: 'LocalLauncher', confirmMode1: true }));
  closeModeDialog(); controls(); user.focus();
});
$('cancel-mode').addEventListener('click', closeModeDialog);
$('mode-dialog').addEventListener('close', () => {
  pendingModeChange = null; $('device-mode').value = String(mode); controls();
});
$('save-input-mode').addEventListener('click', () => {
  if (accountLocked() || !preferenceStore) return;
  const receipt = preferenceStore.saveMode(mode);
  if (receipt.state === 'saved') {
    savedMode = mode;
    modeStorageStatus(`已保存保留方式：${mode === 1 ? '本页可保留' : '每次清空'}。账号仍只在本页使用。`);
  } else if (receipt.state === 'unconfirmed') {
    savedMode = null;
    modeStorageStatus('保存结果尚未确认；本页选择仍有效，刷新后按实际记录恢复。');
  } else modeStorageStatus('本机设置暂不可用；当前选择仍只在本页生效。');
});
$('cancel-login').addEventListener('click', () => { session?.cancel(); status('正在取消并关闭本地连接…'); });
$('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (accountLocked() || !accepted) return;
  let usernameBytes, passwordBytes, poll;
  try {
    const encoding = textProfile().encoding;
    usernameBytes = encodeLauncherCredential(user.value, { encoding }); passwordBytes = encodeLauncherCredential(password.value, { encoding });
    clearResult();
    if (counter > 0xffffffff) throw new Error();
    session = createLauncherSession({ endpoints: target.endpoints, firstEndpointOrdinal: 0, requestCounter: counter++,
      gameCode: target.gameCode, usernameBytes, passwordBytes, openStream: transport.openStream, handshakeProfile: sourceProfile.handshakeProfile });
    usernameBytes.fill(0); passwordBytes.fill(0);
    if (!rememberPassword.checked) password.value = '';
    busy = true; controls(); status('正在连接并执行字节交换…');
    poll = setInterval(() => {
      const state = session?.snapshot().state;
      if (state === 'connecting') status('正在连接本地对端…');
      else if (['awaiting-challenge', 'challenge-ready', 'awaiting-reply'].includes(state)) status('连接已打开，正在交换字节…');
    }, 100);
    const result = await session.start();
    clearInterval(poll); poll = null;
    const state = result.snapshot.state;
    if (state === 'profiles') { renderProfiles(result.choices, encoding); status(`交换完成：收到${result.choices.rows.length}个候选，认证状态未验证。`, 'success'); }
    else if (state === 'no-profiles') status('交换完成：对端返回空候选列表，认证状态未验证。');
    else if (state === 'rejected') status('对端返回非零结果，未产生可选候选。', 'error');
    else if (state === 'cancelled') status('交换已取消，本地连接已请求关闭。');
    else if (state === 'timed-out') status('交换超过10秒总时限，连接已请求关闭。', 'error');
    else status('交换未完成。请核对本地对端和已证协议范围。', 'error');
  } catch { status('无法开始交换：请核对所选编码、字节长度与本地服务设置。', 'error'); }
  finally {
    clearInterval(poll); usernameBytes?.fill(0); passwordBytes?.fill(0);
    if (busy) {
      if (!rememberUser.checked) { user.value = ''; invalidateConsent(); }
      if (!rememberPassword.checked) password.value = '';
    }
    busy = false; controls();
  }
});
window.addEventListener('pagehide', () => {
  catalogView?.cancel(); clearResult(); closeModeDialog();
  patchView?.end();
  launchView?.reset();
  password.value = ''; user.value = ''; texts = null;
  $('texts-status').textContent = '页面会话已结束，请重新读取本地文本。';
  status('页面会话已结束，请重新准备本地文本。'); invalidateConsent();
});

try {
  const response = await fetch('/runtime.json', { credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer' });
  if (!response.ok) throw new Error();
  const value = await response.json();
  if (value.schema !== 'moli.loopback.v3' || value.origin !== location.origin || typeof value.label !== 'string' || value.label.length > 80
      || !Array.isArray(value.credentialEncodings) || value.credentialEncodings.length !== LAUNCHER_TEXT_ENCODINGS.length
      || !LAUNCHER_TEXT_ENCODINGS.every((encoding,index) => value.credentialEncodings[index] === encoding)) throw new Error();
  sourceProfile = snapshotLauncherSourceProfile(value);
  transport = createBrowserLauncherTransport(value); runtime = value;
  $('login-text-encoding').value = 'ascii';
  catalogView = bindLoginCatalogControls({ runtime,
    onTarget(value) {
      closeModeDialog();
      target = value; clearResult(); user.value = ''; password.value = ''; texts = null; loadingText = false; textGeneration += 1;
      launchView?.reset();
      patchView?.refresh();
      for (let i = 0; i < 4; i++) $('license-file-' + i).value = '';
      $('texts-status').textContent = '配置或区域已变化，请重新准备本地文本。';
      invalidateConsent();
      $('target-label').textContent = value ? `${value.gameName} · ${value.regionName}${value.galaxyName !== undefined ? ' · ' + value.galaxyName : ''}` : '请先载入配置并选择可用区域。';
      status(value ? '请选择本地文本并逐页确认。' : '等待可用的配置与区域。');
    },
    onBusy(value) { catalogBusy = value; controls(); },
  });
  launchView = bindLoginLaunchControls({ createInput: options => catalogView.createProcessInput(options),
    selectedPaths:()=>patchView?.selectedPaths()??null,
    onChange(change) { clearResult();if(change?.kind==='field'&&['directory','encoding'].includes(change.field))patchView?.invalidate();controls(); } });
  patchView=bindLoginPatchControls({runtime,getSelection:()=>catalogView.patchSelection(),createInput:options=>catalogView.createPatchInput(options),
    onChange(snapshot){
      patchBusy=snapshot.busy;clearResult();launchView?.invalidate();invalidateConsent();
      if(snapshot.state==='selected'&&!snapshot.busy){controls();launchView?.prepare();status('本页补丁候选已选择，请确认本地文本后继续。');}
      else if(snapshot.busy)status(snapshot.phase==='cache'?'请先完成或取消资源缓存操作。':'请先完成或取消补丁准备。');
      controls();
    }});
  patchView.refresh();
  preferenceStore = createLauncherPreferenceStore();
  const preference = preferenceStore.readMode();
  savedMode = preference.state === 'loaded' ? preference.userMode : null;
  applyMode(planLauncherUserModeInitialization({ recordedMode: savedMode ?? -1, initialRememberUsername: false, settingsSection: 'LocalLauncher', choice: 2 }));
  if (preference.state === 'loaded') modeStorageStatus(`已恢复保留方式：${mode === 1 ? '本页可保留' : '每次清空'}。账号和勾选未恢复。`);
  else if (preference.state === 'invalid') modeStorageStatus('已有保留方式记录无效，未自动覆盖；本次使用每次清空，可明确保存新选择。');
  else if (preference.state === 'unavailable') modeStorageStatus('本机设置暂不可用；当前选择仅在本页生效。');
  $('runtime-status').textContent = '会话服务已就绪 · 仅允许启动时明确指定的回环对端';
} catch {
  $('runtime-status').textContent = '本页需要从专用本地会话服务启动。请按web/README中的命令启动后打开其地址。';
  $('runtime-status').dataset.kind = 'error';
}
controls();

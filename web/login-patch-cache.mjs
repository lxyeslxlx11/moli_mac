/** Explicit resource cache controls. No credentials, authentication or installed-client filesystem access. */
import { createLauncherResourceStore } from './launcher-resource-store.mjs';
import { launcherResourceBindingKey } from '../shared/launcher-resources.mjs';
const fill = Uint8Array.prototype.fill;
const release = value => { for (const row of value?.files ?? []) Reflect.apply(fill, row.bytes, [0]); };
export function bindLoginPatchCache({ getCurrentBinding, getSelectedResources, restore, onBusy }) {
  const $ = id => document.getElementById(id);
  let store; try { store = createLauncherResourceStore({ profile: 'login-patch-local' }); } catch { store = null; }
  let revision = null, cached = null, generation = 0, operation = null, locked = true, patchBusy = false, selected = false;
  const status = text => { $('patch-cache-status').textContent = text; };
  function render() {
    $('check-patch-cache').disabled = !store || locked || patchBusy || !!operation;
    $('save-patch-cache').disabled = !store || locked || patchBusy || !!operation || !selected || revision === null;
    $('restore-patch-cache').disabled = !store || locked || patchBusy || !!operation || !cached;
    $('cancel-patch-cache').disabled = !operation;
  }
  function reset(reason = 'changed') {
    generation++; const pending = operation; operation = null; pending?.control.abort();
    release(cached); cached = null; revision = null;
    status(!store ? '浏览器资源缓存暂不可用，可继续本页准备。' : reason === 'cancelled'
      ? pending?.kind === 'save' ? '已请求取消保存；若事务已提交，取消不会撤销，请重新检查。' : '资源缓存读取已取消，请重新检查。'
      : '填写当前目录后检查资源缓存；不会自动恢复或选择。');
    render(); if (pending) onBusy(false);
  }
  function failure(error) {
    const messages = {
      RESOURCE_CACHE_CONFLICT: '资源缓存已在其他页面变化。请重新检查后再明确保存。',
      RESOURCE_CACHE_CORRUPT: '已有资源缓存未通过格式或摘要核验，已保留原记录。',
      RESOURCE_CACHE_SCHEMA: '资源缓存版本不受支持，已保留原记录。',
      RESOURCE_CACHE_ABORTED: '资源缓存操作已取消，请重新检查。',
      RESOURCE_CACHE_TIMEOUT: '资源缓存操作超过时限，请重新检查。',
      RESOURCE_CACHE_BLOCKED: '资源缓存被其他页面占用，请关闭相关页面后重新检查。',
    };
    status(messages[error?.code] ?? '资源缓存操作未完成，可继续使用本页候选。');
  }
  async function run(kind) {
    if (!store || locked || patchBusy || operation || (kind === 'save' && (!selected || revision === null))) return;
    let expected, resources;
    try {
      expected = getCurrentBinding();
      if (kind === 'save') {
        resources = getSelectedResources();
        if (launcherResourceBindingKey(resources.binding) !== launcherResourceBindingKey(expected)) throw new Error();
      }
    } catch { release(resources); status('请先核对当前目录、编码及所选补丁候选。'); return; }
    const op = { id: generation, kind, control: new AbortController() }; operation = op;
    release(cached); cached = null; render(); onBusy(true);
    const current = () => operation === op && generation === op.id;
    status(kind === 'save' ? '正在保存所选资源…' : '正在读取并核验资源缓存…');
    try {
      if (kind === 'save') {
        const saved = await store.commitResources(resources, { expectedRevision: revision, signal: op.control.signal });
        if (!current()) return;
        revision = saved.revision;
        status(saved.cancellationTooLate ? `资源缓存版本${revision}已提交；取消没有撤销保存。`
          : saved.deadlineExceededAfterCommit ? `资源缓存版本${revision}已提交，完成确认稍有延迟。`
          : `所选资源已保存 · 版本${revision}。重新检查可读取本机副本；来源仍未验证。`);
      } else {
        const saved = await store.read({ signal: op.control.signal });
        if (!current()) { release(saved.resources); return; }
        revision = saved.revision;
        if (!saved.resources) status('本机资源缓存为空。可明确保存所选候选。');
        else if (launcherResourceBindingKey(saved.resources.binding) !== launcherResourceBindingKey(expected)) {
          release(saved.resources); status(`资源缓存版本${revision}与当前配置或目录不符，不会恢复；可明确保存所选候选替换。`);
        } else {
          cached = saved.resources;
          const total = cached.files.reduce((sum, row) => sum + row.bytes.length, 0);
          status(`已核验资源缓存版本${revision} · ${cached.files.length}个文件 · ${total}字节。可读入候选后再次明确选择；来源仍未验证。`);
        }
      }
    } catch (error) { if (current()) { revision = null; release(cached); cached = null; failure(error); } }
    finally { release(resources); if (current()) { operation = null; render(); onBusy(false); } }
  }
  $('check-patch-cache').addEventListener('click', () => { void run('read'); });
  $('save-patch-cache').addEventListener('click', () => { void run('save'); });
  $('cancel-patch-cache').addEventListener('click', () => reset('cancelled'));
  $('restore-patch-cache').addEventListener('click', () => {
    if (locked || patchBusy || operation || !cached) return;
    try {
      const expected = getCurrentBinding();
      if (launcherResourceBindingKey(cached.binding) !== launcherResourceBindingKey(expected)) throw new Error();
      const restored = restore(cached, expected);
      if (restored.state !== 'ready') throw new Error();
      status(`资源缓存版本${revision}已读入本页候选；请核对文件列表并再次明确选择。`);
    } catch { status('资源缓存与当前选择不符或未通过核验，请重新检查。'); }
    finally { release(cached); cached = null; render(); }
  });
  reset();
  return Object.freeze({ reset, end: () => reset('page-ended'),
    render(value) { locked = value.locked; patchBusy = value.busy; selected = value.selected; render(); } });
}

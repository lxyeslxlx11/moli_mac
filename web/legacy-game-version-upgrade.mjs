/** Small source version-upgrade view. The session owns requests; this view owns only DOM/listeners. */
export function createLegacyGameVersionUpgradeView({ element, session }) {
  const document = element?.ownerDocument;
  if (!document) throw TypeError('Expected a version view element.');
  const root = document.createElement('div'), status = document.createElement('p'), controls = document.createElement('div');
  root.className = 'legacy-version-upgrade'; status.setAttribute('role', 'status'); root.append(status, controls); element.append(root);
  let closed = false, view = null, failed = false; const listeners = [];
  function clear() { for (const [button, handler] of listeners) button.removeEventListener('click', handler); listeners.length = 0; controls.replaceChildren(); }
  function button(label, action) {
    const item = document.createElement('button'); item.type = 'button'; item.textContent = label;
    const click = () => {
      if (closed || item.disabled) return; failed = false;
      try { const pending = action(); if (pending?.then) Promise.resolve(pending).then(() => { if (!closed) render(); }, () => { if (!closed) { failed = true; render(); } }); }
      catch { failed = true; }
      render();
    };
    item.addEventListener('click', click); listeners.push([item, click]); controls.append(item); return item;
  }
  function render() {
    if (closed) return;
    const current = session.inspect(), flow = current.characters;
    const next = current.state !== 'ready' || flow?.nativeMainPhase !== 13 ? 'ended' : flow.state === 'upgrade-success' ? 'success' : flow.state === 'upgrade-error' ? 'error' : 'waiting';
    if (next !== view) {
      clear(); view = next;
      if (view === 'success') button('返回人物列表', () => session.acknowledgeVersionUpgrade());
      if (view === 'error') button('重试升级', () => session.retryVersionUpgrade());
    }
    status.textContent = failed ? '当前操作未完成' : view === 'success' ? '服务端已确认升级请求，请重新读取人物列表' : view === 'error' ? '版本升级请求未成功' : view === 'ended' ? '版本升级流程已结束' : '正在请求版本升级…';
    if (view === 'error' && !flow.versionUpgrade.requestSupported) { status.textContent = '当前缺少升级所需的版本信息'; for (const [item] of listeners) item.disabled = true; }
  }
  render();
  return Object.freeze({ render, close() { if (closed) return; closed = true; clear(); root.remove(); }, inspect() { return Object.freeze({ state: closed ? 'closed' : 'open', view, listeners: listeners.length }); } });
}

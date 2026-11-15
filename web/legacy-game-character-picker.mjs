/** Thin accessible character selection from the source flow. No guessed stats/art, storage or game acceptance claim. */
import { createLegacyGameCharacterCreator } from './legacy-game-character-creator.mjs';
import { createLegacyGameVersionUpgradeView } from './legacy-game-version-upgrade.mjs';
export function createLegacyGameCharacterPicker({ element, session, decodeName, encodeName, onEntered = () => {} }) {
  const document = element?.ownerDocument;
  if (!document || typeof element.append !== 'function' || typeof session?.copyCharacters !== 'function' || typeof decodeName !== 'function' || (encodeName !== undefined && typeof encodeName !== 'function') || typeof onEntered !== 'function') throw TypeError('Expected explicit character UI ports.');
  const section = document.createElement('section'), heading = document.createElement('h2'), status = document.createElement('p'), list = document.createElement('ul'), creation = document.createElement('div'), version = document.createElement('div');
  heading.textContent = '选择人物'; section.className = 'legacy-character-picker'; section.setAttribute('aria-label', '人物选择'); status.setAttribute('role', 'status'); section.append(heading, status, list, creation, version); element.append(section);
  let closed = false, generation = 0, lastError = false, creator = null, upgrade = null, optionNotice = null; const listeners = [];
  function clear() { for (const [target, handler] of listeners) target.removeEventListener('click', handler); listeners.length = 0; list.replaceChildren(); }
  function wipe(rows) { for (const row of rows) { row.nameBytes.fill(0); row.field16Bytes.fill(0); row.recordBytes.fill(0); } }
  function render() {
    if (closed) return; const focus = document.activeElement?.dataset?.characterOption; clear(); const current = session.inspect(), flow = current.characters;
    if (creator && (current.state !== 'ready' || flow?.nativeMainPhase !== 4)) { creator.close(); creator = null; }
    if (upgrade && (current.state !== 'ready' || flow?.nativeMainPhase !== 13)) { upgrade.close(); upgrade = null; }
    if (!flow) { status.textContent = '当前无法读取人物'; return; }
    if (current.state === 'failed' || current.state === 'closed') { status.textContent = '连接已结束，请重新登录'; return; }
    if (current.state !== 'ready') { status.textContent = current.state === 'idle' ? '尚未登录' : '正在登录…'; return; }
    if (flow.state !== 'choosing') optionNotice = null;
    if (flow.nativeMainPhase === 13) {
      status.textContent = '版本升级'; if (!upgrade) upgrade = createLegacyGameVersionUpgradeView({ element: version, session }); upgrade.render(); return;
    }
    if (flow.nativeMainPhase === 4 && encodeName) {
      status.textContent = '创建人物';
      if (!creator) creator = createLegacyGameCharacterCreator({ element: creation, session, decodeName, encodeName });
      creator.render(); return;
    }
    if (optionNotice) status.textContent = optionNotice;
    else if (lastError) status.textContent = flow.sourceEnterComplete ? '场景尚未准备好' : '当前无法选择该人物';
    else if (flow.sourceEnterComplete) status.textContent = '人物已确认，正在读取场景';
    else if (flow.state === 'choosing') status.textContent = '请选择要进入的人物';
    else if (flow.state === 'preparing-entry' || flow.state === 'waiting-entry') status.textContent = '正在进入游戏…';
    else status.textContent = '正在读取人物…';
    if (!['choosing', 'preparing-entry', 'waiting-entry', 'entered'].includes(flow.state)) return;
    const rows = session.copyCharacters();
    try {
      for (const row of rows) {
        const item = document.createElement('li'), name = document.createElement('span'), actions = document.createElement('div'); actions.className = 'legacy-character-actions'; let readable = true, label = '暂无人物';
        if (row.present) { try { label = decodeName(row.nameBytes); if (typeof label !== 'string' || !label.length) throw Error(); } catch { label = '人物名称无法读取'; readable = false; } }
        name.textContent = label; item.className = 'legacy-character-row'; item.append(name, actions);
        if (row.present) {
          const button = document.createElement('button'); button.type = 'button'; button.textContent = '进入游戏'; button.setAttribute('aria-label', '进入 ' + label);
          button.disabled = !readable || !flow.menuArmed || current.state !== 'ready';
          const click = () => {
            if (closed || button.disabled) return; const serial = generation; lastError = false;
            const pending = session.enterCharacter(row.slot); render();
            Promise.resolve(pending).then(result => { if (closed || serial !== generation) return;
              try {
                if (result.state === 'ready' && result.sourceCharacterEntered && session.inspect().state === 'ready') {
                  const returned = onEntered(result);
                  if (returned !== undefined) Promise.resolve(returned).catch(() => { if (!closed && serial === generation) { lastError = true; render(); } });
                }
              } catch { lastError = true; }
              render();
            }, () => { if (closed || serial !== generation) return; lastError = true; render(); });
          };
          button.addEventListener('click', click); listeners.push([button, click]); actions.append(button);
          for (const [action, title, enabled] of [[3, '上一外观', row.options.previous], [4, '下一外观', row.options.next], [5, '切换样式', row.options.togglePreview]]) {
            if (!enabled) continue;
            const control = document.createElement('button'); control.type = 'button'; control.textContent = title; control.setAttribute('aria-label', title + ' ' + label); control.dataset.characterOption = row.slot + ':' + action; control.disabled = !flow.menuArmed;
            const choose = () => {
              if (closed || control.disabled) return; optionNotice = null;
              try { session.changeCharacterAppearance(row.slot, action); optionNotice = '外观选择已更新'; } catch { optionNotice = '当前外观选项暂不可用'; }
              render();
            };
            control.addEventListener('click', choose); listeners.push([control, choose]); actions.append(control);
          }
        } else if (encodeName) {
          const button = document.createElement('button'); button.type = 'button'; button.textContent = '创建人物'; button.setAttribute('aria-label', '在位置 ' + (row.slot + 1) + ' 创建人物'); button.disabled = !flow.menuArmed;
          const click = () => { if (closed || button.disabled) return; lastError = false; try { session.beginCharacterCreation(row.slot); } catch { lastError = true; } render(); };
          button.addEventListener('click', click); listeners.push([button, click]); actions.append(button);
        }
        list.append(item);
      }
      if (flow.state === 'choosing' && flow.nativeAuxiliaryOption) {
        const item = document.createElement('li'), button = document.createElement('button'); button.type = 'button'; button.textContent = '请求版本升级'; button.disabled = !flow.versionUpgrade.enabled;
        if (button.disabled) button.title = '当前缺少升级所需的版本信息';
        const click = () => { if (closed || button.disabled) return; const serial = generation; lastError = false;
          Promise.resolve(session.beginVersionUpgrade()).then(() => { if (!closed && serial === generation) render(); }, () => { if (!closed && serial === generation) { lastError = true; render(); } }); render(); };
        button.addEventListener('click', click); listeners.push([button, click]); item.append(button); list.append(item);
      }
      if (focus) [...list.querySelectorAll('button')].find(button => button.dataset.characterOption === focus && !button.disabled)?.focus();
    } finally { wipe(rows); }
  }
  render();
  return Object.freeze({ render, close() { if (closed) return; closed = true; generation++; clear(); creator?.close(); creator = null; upgrade?.close(); upgrade = null; section.remove(); },
    inspect() { return Object.freeze({ state: closed ? 'closed' : 'open', controls: listeners.length, lastError }); } });
}

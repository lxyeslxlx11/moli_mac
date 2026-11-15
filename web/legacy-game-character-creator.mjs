/** Source-backed creation controls. Names cross explicit byte-codec ports; no guessed stat labels or preview art. */
export function createLegacyGameCharacterCreator({ element, session, encodeName, decodeName }) {
  const doc = element?.ownerDocument;
  if (!doc || typeof encodeName !== 'function' || typeof decodeName !== 'function') throw TypeError('Expected explicit creation text ports.');
  const root = doc.createElement('div'), status = doc.createElement('p'), body = doc.createElement('div');
  root.className = 'legacy-character-creator'; status.setAttribute('role', 'status'); root.append(status, body); element.append(root);
  let closed = false, kind = null, nameInput = null, appearanceSelect = null, localError = null;
  let familyLabel, colorLabel, modeLabel, details = [], allocations = [], budgets = [], confirmationName;
  const listeners = [];
  function listen(target, name, handler) { target.addEventListener(name, handler); listeners.push([target, name, handler]); }
  function clear() {
    for (const [target, name, handler] of listeners) target.removeEventListener(name, handler);
    listeners.length = 0; if (nameInput) nameInput.value = ''; body.replaceChildren(); nameInput = appearanceSelect = null;
    details = []; allocations = []; budgets = []; familyLabel = colorLabel = modeLabel = confirmationName = null;
  }
  function code(error) { try { return Object.getOwnPropertyDescriptor(error ?? {}, 'code')?.value; } catch { return null; } }
  function message(error) {
    return ({ LEGACY_CREATION_NAME_EMPTY: '请输入人物名称', LEGACY_CREATION_NAME_BYTES: '名称最多占用 16 字节，请缩短或修改名称',
      LEGACY_CREATION_NAME_RESERVED: '名称包含不可使用的字符，请修改', LEGACY_CREATION_NAME_DUPLICATE: '已有相同人物名称，请修改',
      LEGACY_CREATION_STAT_POINTS: '请分配完第一组点数', LEGACY_CREATION_ELEMENT_POINTS: '请分配完第二组点数' })[code(error)] ?? '当前操作未完成，请检查输入';
  }
  function edit(action, value) {
    if (closed) return false;
    localError = null;
    try { session.editCharacterCreation(action, value); return true; }
    catch (error) { localError = message(error); return false; }
    finally { render(); }
  }
  function readName() {
    let value;
    try {
      value = encodeName(nameInput.value);
      if (!(value instanceof Uint8Array)) throw TypeError();
      return edit('name', value);
    } catch { localError = '名称暂不支持，请修改名称'; render(); return false; }
    finally { if (value instanceof Uint8Array) value.fill(0); }
  }
  function text(tag, value, parent = body) { const item = doc.createElement(tag); item.textContent = value; parent.append(item); return item; }
  function button(label, action, parent = body) {
    const item = text('button', label, parent); item.type = 'button'; listen(item, 'click', () => { if (!closed && !item.disabled) action(); }); return item;
  }
  function cycle(label, action, index) {
    const row = doc.createElement('div'); row.className = 'legacy-creation-cycle'; body.append(row);
    const before = button('上一' + label, () => edit(action, index === undefined ? -1 : { index, delta: -1 }), row);
    const value = text('span', '', row);
    const after = button('下一' + label, () => edit(action, index === undefined ? 1 : { index, delta: 1 }), row);
    return { value, before, after, label };
  }
  function build(next) {
    clear(); kind = next;
    if (kind === 'appearance') {
      const label = doc.createElement('label'); label.textContent = '造型 '; appearanceSelect = doc.createElement('select'); appearanceSelect.setAttribute('aria-label', '造型'); label.append(appearanceSelect); body.append(label);
      for (let i = 0; i < 14; i++) { const option = doc.createElement('option'); option.value = String(i); option.textContent = '造型 ' + (i + 1); appearanceSelect.append(option); }
      listen(appearanceSelect, 'change', () => edit('appearance', Number(appearanceSelect.value)));
      const family = doc.createElement('div'); body.append(family); familyLabel = text('span', '', family); familyLabel.toggle = button('切换外观组', () => edit('family'), family);
      colorLabel = cycle('配色', 'color');
      button('下一步', () => edit('continue')); button('取消创建', () => edit('cancel'));
    } else if (kind === 'details') {
      const label = doc.createElement('label'); label.textContent = '人物名称 '; nameInput = doc.createElement('input'); nameInput.type = 'text'; nameInput.autocomplete = 'off'; nameInput.setAttribute('aria-label', '人物名称'); label.append(nameInput); body.append(label);
      listen(nameInput, 'input', readName);
      const groups = doc.createElement('div'); groups.className = 'legacy-creation-groups'; body.append(groups);
      for (let group = 0; group < 2; group++) {
        const fieldset = doc.createElement('fieldset'); text('legend', group ? '第二组分配' : '第一组分配', fieldset); budgets.push(text('p', '', fieldset)); groups.append(fieldset); const rows = [];
        for (let i = 0; i < (group ? 4 : 5); i++) {
          const row = doc.createElement('div'); row.className = 'legacy-creation-allocation'; text('span', '分配项 ' + (i + 1), row);
          const minus = button('−', () => edit(group ? 'element' : 'stat', { index: i, delta: -1 }), row); minus.setAttribute('aria-label', `${group ? '第二' : '第一'}组第${i + 1}项减少`);
          const value = text('output', '0', row); value.setAttribute('aria-label', `${group ? '第二' : '第一'}组第${i + 1}项数值`);
          const plus = button('+', () => edit(group ? 'element' : 'stat', { index: i, delta: 1 }), row); plus.setAttribute('aria-label', `${group ? '第二' : '第一'}组第${i + 1}项增加`);
          fieldset.append(row); rows.push({ minus, value, plus });
        }
        allocations.push(rows);
      }
      modeLabel = cycle('造型类型', 'mode'); details = [cycle('细节一', 'detail', 0), cycle('细节二', 'detail', 1)];
      button('检查创建信息', () => { if (readName()) edit('request-confirmation'); }); button('返回外观', () => edit('back'));
    } else if (kind === 'confirmation') {
      confirmationName = text('p', '');
      button('确认创建', () => {
        localError = null;
        let pending;
        try { pending = session.confirmCharacterCreation(); } catch (error) { localError = message(error); render(); return; }
        Promise.resolve(pending).then(() => { if (!closed) render(); }, error => { if (!closed) { localError = message(error); render(); } }); render();
      });
      button('返回修改', () => edit('cancel-confirmation'));
    } else if (kind === 'error') button('返回人物选择', () => edit('dismiss-error'));
  }
  function render() {
    if (closed) return;
    const current = session.inspect(), flow = current.characters;
    if (current.state !== 'ready' || !flow || flow.nativeMainPhase !== 4) { if (kind !== 'ended') build('ended'); status.textContent = '创建流程已结束'; return; }
    let copy;
    try {
      copy = session.copyCharacterCreation();
      const next = flow.state === 'creation-error' ? 'error' : copy?.state ?? 'waiting';
      if (next !== kind) build(next);
      for (const control of body.querySelectorAll('button,input,select')) control.disabled = false;
      status.textContent = localError ?? (next === 'appearance' ? '选择外观' : next === 'details' ? '输入名称并分配点数' : next === 'confirmation' ? '确认后将提交创建请求' : next === 'error' ? '人物未创建，请返回选择' : '正在创建人物…');
      if (!copy) return;
      if (kind === 'appearance') {
        appearanceSelect.value = String(copy.appearance); familyLabel.textContent = '外观组 ' + (copy.family + 1) + ' '; familyLabel.toggle.disabled = !copy.canToggleFamily;
        colorLabel.value.textContent = '配色 ' + (copy.color + 1);
      } else if (kind === 'details') {
        if (doc.activeElement !== nameInput) { try { nameInput.value = decodeName(copy.nameBytes); } catch { nameInput.value = ''; } }
        budgets[0].textContent = '剩余点数：' + copy.statRemaining; budgets[1].textContent = '剩余点数：' + copy.elementRemaining;
        for (let group = 0; group < 2; group++) for (let i = 0; i < allocations[group].length; i++) {
          const n = (group ? copy.elements : copy.stats)[i], controls = allocations[group][i], enabled = group ? copy.elementControls[i] : true;
          controls.value.value = String(n); controls.minus.disabled = !enabled || n === 0; controls.plus.disabled = !enabled || (group ? n >= 10 : !copy.statRemaining || n >= 15);
        }
        modeLabel.value.textContent = '造型类型 ' + (copy.mode + 1); modeLabel.before.disabled = modeLabel.after.disabled = !copy.canCycleMode;
        details.forEach((row, i) => { row.value.textContent = row.label + ' ' + (copy.details[i] + 1); });
      } else if (kind === 'confirmation') {
        let name; try { name = decodeName(copy.nameBytes); } catch { name = '名称无法显示'; }
        confirmationName.textContent = '人物名称：' + name;
      }
      if (flow.state === 'preparing-creation') for (const control of body.querySelectorAll('button,input,select')) control.disabled = true;
    } finally { copy?.nameBytes.fill(0); }
  }
  render();
  return Object.freeze({ render, close() { if (closed) return; closed = true; clear(); root.remove(); }, inspect() { return Object.freeze({ state: closed ? 'closed' : 'open', view: kind, listeners: listeners.length }); } });
}

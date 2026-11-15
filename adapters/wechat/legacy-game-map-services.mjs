import { clearLegacyGameMapNpcService } from '../../shared/legacy-game-map-npc-services.mjs';
import { clearLegacyGamePetTraining } from '../../shared/legacy-game-map-pet-training.mjs';

const npcTitles = { trainer: '技能师范', learn: '学习技能', forget: '遗忘技能' };
const npcActions = { learn: '想学习技能', forget: '想遗忘技能', leave: '不用了', 'confirm-learn': '确认学习', back: '返回' };
const petTitles = { offer: '宠物技能师范', pet: '选择宠物', slot: '选择宠物技能栏' };
const petTypes = ['人形系', '龙系', '不死系', '飞行系', '昆虫系', '植物系', '野兽系', '特殊系', '金属系', '邪魔系'];

export function isWeChatMapService(info) {
  return !!info && (info.treatmentRows !== undefined || Object.hasOwn(npcTitles, info.npcServiceKind) || !!info.petTrainingStep);
}

function treatmentPanel(treatment, decode) {
  const { rows, allChoice, allFee } = treatment;
  try {
    const options = rows.map(({ name, level, injuryGrade, fee, choice }) => {
      const injury = injuryGrade === 0 ? '健康' : `伤势 ${injuryGrade} 级`;
      return { id: choice, label: `${decode(name) || '角色'} · 等级 ${level} · ${injury} · ${fee} 金币` };
    });
    options.push({ id: allChoice, label: `完整治疗 · ${allFee} 金币` });
    return { kind: 'treatment', title: '请选择治疗对象', lines: [], options, leave: '取消治疗' };
  } finally {
    for (const row of rows) row.name.fill(0);
  }
}

function npcPanel(service, decode) {
  try {
    const { kind, title, lines, choices } = service;
    const messages = lines.map(decode);
    if (kind === 'learn') {
      messages.push(decode(service.name), ...service.description.map(decode),
        `需要 ${service.slotUnits} 个技能栏位 · ${service.fee} 金币`);
    }
    const options = (service.rows ?? []).map(({ id, name }) => {
      const skill = decode(name) || '技能';
      return { id, label: '遗忘 ' + skill, review: `确认遗忘 ${skill}？` };
    });
    if (kind === 'forget' && !options.length) messages.push('当前没有可遗忘的技能。');
    options.push(...choices.map(({ id, action }) => ({ id, label: npcActions[action] })));
    return { kind, title: decode(title) || npcTitles[kind], lines: messages, options,
      leave: '关闭窗口', confirm: '确认遗忘' };
  } finally {
    clearLegacyGameMapNpcService(service);
  }
}

function petPanel(training, decode) {
  const { step, title, lines, rows, lesson, selectedPet, requiredType } = training;
  try {
    const messages = lines.map(decode);
    if (lesson) messages.push(`已选技能 ${decode(lesson.name)} · ${lesson.fee} 金币`);
    if (petTypes[requiredType]) messages.push('要求 ' + petTypes[requiredType]);
    if (selectedPet) {
      const occupied = rows.filter(row => row.occupied).length;
      messages.push(`${decode(selectedPet.name)} · 技能栏 ${occupied} / ${selectedPet.capacity}`);
    }
    const options = rows.map(row => {
      const { id } = row, name = decode(row.name);
      const description = row.description?.map(decode).join('\n');
      if (step === 'offer') return { id, label: `选择技能 ${name} · ${row.fee} 金币`, description, fee: row.fee };
      if (step === 'pet') {
        const type = petTypes[row.type];
        const label = `选择宠物 ${name} · ${row.capacity} 个技能栏位` + (type ? ' · ' + type : '');
        return { id, label, eligible: row.eligible };
      }
      const label = `技能栏 ${id + 1} · ${row.occupied ? name : '空栏位'}`;
      const review = row.occupied ? `确认使用技能栏 ${id + 1}，替换 ${name}？` : `确认在空技能栏 ${id + 1} 学习？`;
      return { id, label, description, review };
    });
    return { kind: 'pet-' + step, title: decode(title) || petTitles[step], lines: messages, options,
      leave: step === 'offer' ? '不用了' : '取消训练', confirm: '确认学习' };
  } finally {
    clearLegacyGamePetTraining(training);
    lesson?.name.fill(0);
    selectedPet?.name.fill(0);
  }
}

export function createWeChatMapService({ client, info, decode, notify }) {
  const { revision } = info;
  const model = client.copyMapDialog();
  const panel = model.treatment ? treatmentPanel(model.treatment, decode) :
    model.npcService ? npcPanel(model.npcService, decode) : petPanel(model.petTraining, decode);
  const { kind, title, options, confirm, leave } = panel;
  const lines = panel.lines.map((text, id) => ({ id, text }));
  let selected = null, busy = false, closed = false, failed = false;

  function available(option) {
    if (info.petTrainingStale || (info.skillListStale && option.review) || option.eligible === false) return false;
    return option.fee === undefined || (info.petCount > 0 && option.fee <= (info.gold ?? 0));
  }

  function snapshot() {
    let notice = '';
    if (info.skillListStale) notice = '技能列表已更新，请返回后重新打开。';
    else if (info.petTrainingStale) notice = '宠物或技能栏已更新，请重新打开训练。';
    else if (failed) notice = '该操作暂不可用。';
    else if (kind === 'pet-offer' && !info.petCount) notice = '暂无可训练宠物。';
    const balance = info.gold === undefined ? '' : info.gold === null ? '等待金币同步' : '持有金币 ' + info.gold;
    const slots = info.skillUsed === undefined ? '' : info.skillCapacity === null ?
      `已用技能栏位 ${info.skillUsed} · 等待容量同步` : `技能栏位 ${info.skillUsed} / ${info.skillCapacity}`;
    return {
      revision, kind, title, lines, balance, slots, notice, busy, leave,
      rows: options.map(option => ({
        id: option.id, label: option.label, description: option.description ?? '', disabled: !available(option),
      })),
      review: selected ? { text: selected.review, confirm } : null,
    };
  }

  async function act(action, id) {
    if (closed || busy) return false;
    if (action === 'back' && selected) {
      selected = null;
      notify();
      return true;
    }
    const option = action === 'confirm' ? selected :
      action === 'select' && !selected ? options.find(row => row.id === id) : null;
    if (action !== 'leave' && (!option || !available(option))) return false;
    if (action === 'select' && option.review) {
      selected = option;
      failed = false;
      notify();
      return true;
    }
    busy = true;
    failed = false;
    notify();
    try {
      if (action !== 'leave') await client.replyMapDialog(revision, 0, option.id);
      else if (Object.hasOwn(npcTitles, kind)) client.dismissMapDialog(revision);
      else await client.replyMapDialog(revision, 2);
      return true;
    } catch {
      failed = true;
      return false;
    } finally {
      busy = false;
      if (!closed) notify();
    }
  }

  return Object.freeze({
    revision, snapshot, act,
    sync(current) {
      info = current;
      if (selected && !available(selected)) selected = null;
    },
    close() {
      closed = true;
      selected = null;
    },
  });
}

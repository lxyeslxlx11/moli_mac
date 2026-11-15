import { LEGACY_GAME_TEXT_COLORS, legacyGameTextFontMetrics } from '../../shared/legacy-game-text.mjs';
import { legacyGameMapSpeechMilliseconds } from '../../shared/legacy-game-map-chat.mjs';
import { clearLegacyGameMapNpcService } from '../../shared/legacy-game-map-npc-services.mjs';

const battleCommands = [
  ['attack','攻击'],['guard','防御'],['skill','技能','skillEnabled'],['item','物品','itemEnabled'],
  ['position','换位','positionEnabled'],['pet','更换宠物','petEnabled'],['escape','逃跑'],
];
const dialogButtons = {1:'确定',2:'取消',4:'是',8:'否',16:'返回',32:'下一页'};
const commerceChoices = { buy: '购买', sell: '出售', exchange: '兑换物品', give: '给予物品', receive: '接受物品', leave: '不用了' };
const appearanceChoices = [
  ['variant', '脸型', 3, 5], ['detail1', '眼睛', 6, 8], ['detail2', '嘴型', 9, 11],
];

export function weChatCharacterRows(session, flow, decode) {
  if (!flow || !['choosing','preparing-entry','waiting-entry'].includes(flow.state)) return [];
  return session.copyCharacters().map(row=>{
    let name = '空位', readable = false;
    try { if (row.present) { name = decode(row.nameBytes); readable = !!name; } }
    catch { name = '名称无法读取'; }
    finally { row.nameBytes.fill(0); row.field16Bytes.fill(0); row.recordBytes.fill(0); }
    return {
      slot: row.slot, name, present: row.present, enabled: !!(readable && flow.menuArmed),
      canCreate: !row.present && flow.menuArmed, options: row.options,
    };
  });
}

export function weChatCharacterCreation(session, flow, decode) {
  if (flow?.nativeMainPhase !== 4) return null;
  const slot = flow.selectedSlot;
  if (flow.state === 'creation-error') return { kind: 'error', slot, errorCode: flow.errorCode };
  const draft = flow.creation;
  if (flow.state !== 'creating' || !draft) return { kind: 'waiting', slot };

  const { state: kind, family, appearance, color, mode, details } = draft;
  const view = { kind, slot, family, appearance, color, mode, details };
  if (kind === 'appearance') return { ...view, canToggleFamily: draft.canToggleFamily };

  const copy = session.copyCharacterCreation();
  let name = '';
  try { if (copy?.nameBytes.length) name = decode(copy.nameBytes); }
  catch { name = '名称无法显示'; }
  finally { copy?.nameBytes.fill(0); }
  if (kind === 'confirmation') return {
    ...view, name, stats: draft.stats.join(' / '), elements: draft.elements.join(' / '),
  };
  return {
    ...view, name, statRemaining: draft.statRemaining, elementRemaining: draft.elementRemaining,
    canCycleMode: draft.canCycleMode,
    stats: draft.stats.map((value, index) => ({
      index, value, minus: value > 0, plus: draft.statRemaining > 0 && value < 15,
    })),
    elements: draft.elements.map((value, index) => ({
      index, value, minus: draft.elementControls[index] && value > 0,
      plus: draft.elementControls[index] && value < 10,
    })),
  };
}

export function weChatBattleView(view) {
  if (!view) return null;
  const {ready,blocked,countdown,actors,skills,playerPopup,itemPopup,petPopup,inputMode,round} = view;
  const secondary = inputMode==='mounted'||inputMode==='pet';
  return {ready,blocked,countdown,actors,skills,playerPopup,itemPopup,petPopup,secondary,round,
    commands:secondary?[]:battleCommands.map(([action,label,gate])=>({action,label,enabled:ready&&(!gate||view[gate])})),
    targets:ready?actors.filter(actor=>actor.eligible):[]};
}

export function weChatMapDialog(client, info, decode) {
  if (!info) return null;
  const {revision,mode} = info;
  if (['merchant', 'exchange', 'handoff'].includes(info.npcServiceKind)) {
    const { npcService } = client.copyMapDialog();
    try {
      return {
        revision, supported: true, title: decode(npcService.title) || '地图服务', input: false,
        lines: npcService.lines.map((bytes, id) => ({ id, text: decode(bytes) })),
        choices: npcService.choices.map(({ id, action }) => ({ choice: id, label: commerceChoices[action] })),
        buttons: [],
      };
    } finally { clearLegacyGameMapNpcService(npcService); }
  }
  if (![0,1,2,10,11,0x23,0x24,0x25].includes(mode)) return {revision,supported:false};
  const model = client.copyMapDialog();
  const lines = model.lines.map(bytes=>{try{return decode(bytes);}finally{bytes.fill(0);}});
  if (model.appearance) {
    const { appearanceCode, canChangeVariant, graphicResource, previewResourceId, title } = model.appearance;
    const controls = appearanceChoices.filter(([key]) => key !== 'variant' || canChangeVariant)
      .map(([key, label, previous, next]) => ({ key, label, previous, next, value: model.appearance[key] + 1 }));
    const graphics = [
      { resourceId: graphicResource, facing: 0, x: 70, y: 82 },
      { resourceId: previewResourceId, facing: 0, x: 210, y: 82 },
    ].filter(({ resourceId }) => resourceId >= 1000 && resourceId <= 120500);
    try {
      return {
        revision, supported: true, title: decode(title) || '调整外观', input: false,
        lines: lines.map((text, id) => ({ id, text })), choices: [],
        buttons: [{ bit: 1, label: '确认外观' }], appearance: { code: appearanceCode, controls },
        illustration: graphics.length ? { width: 280, height: 112, graphics } : null,
      };
    } finally { title.fill(0); }
  }
  const split = mode===2 && model.header>0 ? model.header : lines.length;
  return {revision,supported:true,title:mode===0x25?'图文确认':'场景对话',
    lines:lines.slice(0,split).map((text,id)=>({id,text})),input:!!model.input,inputCount:model.inputCount??(model.input?1:0),
    inputBytes:model.inputByteLimit??254,illustration:model.illustration??null,
    choices:lines.slice(split).map((label,index)=>({label,choice:index+1})).filter(row=>row.label),
    buttons:model.buttons.map(bit=>({bit,label:dialogButtons[bit]}))};
}

function color(index) { return 'rgb('+LEGACY_GAME_TEXT_COLORS[index].join(',')+')'; }
function setFont(ctx, style, index) {
  const height = legacyGameTextFontMetrics(style).doubleHeight;
  ctx.font = height+'px sans-serif';ctx.textBaseline='top';ctx.fillStyle=color(index);
  return height;
}
const fit = (position,span,limit) => Math.max(1,Math.min(position,limit-span-1));

export function paintWeChatMapChat(ctx, canvas, frame, tick, decode) {
  if (!frame) return;
  ctx.save();
  try {
    for (const row of frame.speech) {
      if (((tick-row.tick)>>>0)>=legacyGameMapSpeechMilliseconds) continue;
      const width = Math.min(row.width??34, Math.max(12,canvas.width-2)), height = row.height??18;
      const x = fit(row.x,width,canvas.width), y = fit(row.y,height,canvas.height);
      ctx.fillStyle = 'rgba(20,38,49,0.88)';ctx.fillRect(x,y,width,height);
      const lineHeight = setFont(ctx,row.style??1,row.color??0);
      if (row.kind==='icon') ctx.fillText('…',x+5,y+2,width-10);
      else row.lines.forEach((line,index)=>ctx.fillText(decode(line),x+5,y+5+index*lineHeight,width-10));
    }
    ctx.scale(canvas.width/640,canvas.height/480);
    for (const row of frame.announcements) {
      setFont(ctx,row.style,row.color);ctx.fillText(decode(row.text),row.x,row.y);
    }
  } finally { ctx.restore(); }
}

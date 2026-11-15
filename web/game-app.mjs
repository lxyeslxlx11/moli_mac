import {
  prepareLegacyGameStartup, decodeLauncherProfileName, decodeLegacyGameChatText, decodeLegacyGameDescriptionText,
  encodeLauncherCredential, encodeLauncherProcessField,
} from '../shared/index.mjs';
import { canStoreLegacyGameFeedBoxItem, legacyGameBankGoldLimit, legacyGameFeedBoxMode } from '../shared/legacy-game-map-bank.mjs';
import { canFeedLegacyGameFamilyPet, legacyGameFamilyPetNameBytes } from '../shared/legacy-game-map-family-pet.mjs';
import { legacyGameFamilyNameBytes, legacyGameFamilyRoleCapacity, legacyGameFamilyRoleNameBytes } from '../shared/legacy-game-family.mjs';
import { legacyGameMapChatInputBytes, legacyGameMapChatBlockedNameBytes } from '../shared/legacy-game-map-chat.mjs';
import {createLegacyGameCraftPanel} from './legacy-game-craft-panel.mjs';
import { createBrowserLegacyGameClient } from './legacy-game-client.mjs';
import { closeLegacyGameAudioContext, openLegacyGameAudioContext } from './legacy-game-audio-host.mjs';
import { createLegacyGameSelectedFiles } from './legacy-game-resource-files.mjs';
import { createBrowserLegacyGameResourceArchive } from './legacy-game-resource-archive.mjs';
import { createMapChatOverlay, readMapChatBlacklist, saveMapChatBlacklist } from './legacy-game-map-chat.mjs';
const byId = id => document.getElementById(id), status = byId('game-status'), startupInput = byId('game-startup'), folderInput = byId('game-folder'), archiveInput = byId('game-archive'), endpointInput = byId('game-endpoint');
const connect = byId('game-connect'), pause = byId('game-pause'), disconnect = byId('game-disconnect'), canvas = byId('game-canvas'), stage = byId('game-stage'), picker = byId('game-picker'), setup = byId('game-setup');
const returnServers = byId('game-return-servers');
const returnCity = byId('game-return-city');
const encodingInput=byId('game-text-encoding'),labels=byId('game-labels'),bars=byId('game-bars'),party=byId('game-party'),partyStatus=byId('game-party-status');
const minimapButton=byId('game-minimap'),minimapRange=byId('game-minimap-range'),minimapStatus=byId('game-minimap-status');
const pickupMode=byId('game-pickup-mode');
const mapDialog=byId('game-map-dialog'),mapDialogLines=byId('game-map-dialog-lines'),mapDialogButtons=byId('game-map-dialog-buttons');
const mapDialogInput=byId('game-map-dialog-input'),mapDialogInputLabel=byId('game-map-dialog-input-label'),mapDialogStatus=byId('game-map-dialog-status');
const mapDialogInputCaption=byId('game-map-dialog-input-caption');
const mapDialogSecondInput=byId('game-map-dialog-second-input'),mapDialogSecondLabel=byId('game-map-dialog-second-label');
const mapDialogTitle=byId('game-map-dialog-title'),mapDialogDismiss=byId('game-map-dialog-dismiss');
const mapDialogGraphics=byId('game-map-dialog-graphics');
const tradeOpen=byId('game-trade-open'),tradeDialog=byId('game-player-trade'),tradeTitle=byId('game-player-trade-title');
const tradeContent=byId('game-player-trade-content'),tradeActions=byId('game-player-trade-actions');
const tradeStatus=byId('game-player-trade-status'),tradeNotice=byId('game-player-trade-notice');
const familyOpen=byId('game-family-open'),familyDialog=byId('game-family-dialog');
const familyContent=byId('game-family-content'),familyStatus=byId('game-family-status');
const mapDialogLabels={1:'确定',2:'取消',4:'是',8:'否',16:'返回',32:'下一页'};
const shopActionLabels={buy:'购买',sell:'出售',appraise:'鉴定',repair:'修理',exchange:'兑换',conversion:'给予'};
const inventoryToggle=byId('game-inventory-toggle'),inventoryPanel=byId('game-inventory'),inventoryStatus=byId('game-inventory-status');
const inventoryDescription=byId('game-inventory-description');
const equipmentSlots=byId('game-equipment-slots'),inventorySlots=byId('game-inventory-slots');
const inventoryUse=byId('game-inventory-use'),inventoryMove=byId('game-inventory-move'),inventoryClear=byId('game-inventory-clear');
const inventoryDrop=byId('game-inventory-drop'),inventoryDropConfirm=byId('game-inventory-drop-confirm');
const inventorySplit=byId('game-inventory-split'),inventoryAmount=byId('game-inventory-amount'),inventoryMoveAmount=byId('game-inventory-move-amount');
const battle=byId('game-battle'),battleStatus=byId('game-battle-status'),battleCountdown=byId('game-battle-countdown'),battleActors=byId('game-battle-actors'),inputHint=byId('game-input-hint'),battleButtons=Object.fromEntries(['attack','skill','item','guard','position','pet','escape'].map(n=>[n,byId('game-battle-'+n)])),actorButtons=new Map();
const gameTime=byId('game-time'),chat=byId('game-chat'),chatHistory=byId('game-chat-history');
const mapChat=byId('game-map-chat'),mapChatHistory=byId('game-map-chat-history'),mapChatStatus=byId('game-map-chat-status');
const mapChatFields=byId('game-map-chat-fields'),mapChatInput=byId('game-map-chat-input'),mapChatMode=byId('game-map-chat-mode');
const mapChatRange=byId('game-map-chat-range'),mapChatColor=byId('game-map-chat-color'),mapChatSize=byId('game-map-chat-size');
const mapChatBlacklist=byId('game-map-chat-blacklist'),mapChatBlocked=byId('game-map-chat-blocked');
const mapChatBlockName=byId('game-map-chat-block-name'),mapChatBlockStatus=byId('game-map-chat-block-status');
mapChatInput.maxLength=legacyGameMapChatInputBytes;
mapChatBlockName.maxLength=legacyGameMapChatBlockedNameBytes;
const playerPanel=byId('game-battle-player-skills'),playerLabel=byId('game-battle-player-skill-label'),playerRows=byId('game-battle-player-skill-rows'),playerLevels=byId('game-battle-player-levels'),playerBack=byId('game-battle-skill-back'),playerClose=byId('game-battle-skill-close'),playerButtons=new Map(),levelButtons=new Map();
playerBack.addEventListener('click',()=>view?.chooseBattleCommand('skill-back'));playerClose.addEventListener('click',()=>view?.chooseBattleCommand('skill-close'));
const itemPanel=byId('game-battle-items'),itemLabel=byId('game-battle-item-label'),itemRows=byId('game-battle-item-rows'),itemClose=byId('game-battle-item-close'),itemButtons=new Map();
const removeWeapon=byId('game-battle-weapon-remove');
itemClose.addEventListener('click',()=>view?.chooseBattleCommand('item-close'));
removeWeapon.addEventListener('click',()=>{
  if(!removeWeapon.disabled)view?.chooseBattleCommand('weapon-remove',state.battle.itemPopup.weaponRemoval.revision);
});
const petPanel=byId('game-battle-pets'),petLabel=byId('game-battle-pet-label'),petSkills=byId('game-battle-skills'),petWait=byId('game-battle-pet-wait'),petCancel=byId('game-battle-pet-cancel'),skillButtons=new Map();
petWait.addEventListener('click',()=>view?.chooseBattleCommand('pet-wait'));petCancel.addEventListener('click',()=>view?.chooseBattleCommand('pet-cancel'));
const switchPanel=byId('game-battle-switch'),switchLabel=byId('game-battle-switch-label'),petRoster=byId('game-battle-roster'),petRecall=byId('game-battle-recall'),switchClose=byId('game-battle-switch-close'),rosterButtons=new Map();
petRecall.addEventListener('click',()=>view?.chooseBattleCommand('pet-recall'));switchClose.addEventListener('click',()=>view?.chooseBattleCommand('pet-close'));
let ports = null, view = null, preparing = false, generation = 0, state = null, materialError = false;
const craftPanel=createLegacyGameCraftPanel({open:byId('game-craft-open'),dialog:byId('game-craft-dialog'),
  content:byId('game-craft-content'),status:byId('game-craft-status'),
  owner:()=>({client:view,state,familyOpen:familyDialog.open}),decode:bytes=>dialogText(bytes,encodingInput.value),encode:value=>encodeLauncherProcessField(value,{encoding:encodingInput.value})});
let chatVersion=0;
let bag=null,mapDialogRevision=null,mapShop=null,mapTreatmentBalance=null,mapServicePanel=null;
const setText=(element,value)=>{if(element.textContent!==value)element.textContent=value;};
const live = () => !!view && !['closed', 'failed'].includes(state?.client?.state) && state?.state !== 'closed';
const slotLabel=row=>row.equipment?'装备槽 '+(row.slot+1):'背包槽 '+(row.slot-7);
function closeInventory(){
  bag=null;
  inventoryPanel.hidden=true;
  inventoryToggle.setAttribute('aria-expanded','false');
  equipmentSlots.replaceChildren();
  inventorySlots.replaceChildren();
  setText(inventoryDescription,'');
}
function clearInventorySelection(current){
  current.source=current.destination=current.mode=null;
}
function selectInventorySlot(slot){
  if(!bag||bag.busy||bag.mode==='drop')return;
  const row=bag.rows[slot];
  bag.notice='';
  if(bag.mode==='use-on-item'){
    if(!row.canReceiveItemUse||row.slot===bag.source.slot)return;
    bag.destination=row;
    void sendInventory('use-on-item');
    return;
  }
  if(bag.source?.slot===slot)clearInventorySelection(bag);
  else if(!bag.source){if(row.present)bag.source=row;}
  else{bag.destination=row;inventoryAmount.value='1';}
  renderInventory();
}
function renderInventory(){
  const {rows,source,destination,busy,notice,buttons,mode}=bag;
  const targeting=mode==='use-on-item',confirmingDrop=mode==='drop';
  for(const row of rows){
    let button=buttons.get(row.slot);
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.dataset.inventorySlot=String(row.slot);
      button.addEventListener('click',()=>selectInventorySlot(row.slot));
      buttons.set(row.slot,button);
      (row.equipment?equipmentSlots:inventorySlots).append(button);
    }
    const picked=source?.slot===row.slot,target=destination?.slot===row.slot;
    const content=slotLabel(row)+' · '+(row.present?row.name+(row.quantity>0?' ×'+row.quantity:''):'空');
    setText(button,content);
    button.disabled=busy||confirmingDrop||(targeting?!row.canReceiveItemUse||picked:!source&&!row.present);
    button.setAttribute('aria-pressed',String(picked));
    button.dataset.destination=String(target);
    button.setAttribute('aria-label',content+(target&&!targeting?'，移动目标':''));
  }
  const split=!mode&&destination&&!destination.equipment&&!destination.present&&!source.equipment&&source.quantity>0;
  inventoryUse.disabled=busy||!!mode||!(source?.canUse||source?.canUseOnItem)||!!destination;
  inventoryMove.disabled=busy||!!mode||!destination;
  inventoryDrop.disabled=busy||!!mode||!source||!!destination;
  inventoryDropConfirm.hidden=!confirmingDrop;
  inventoryDropConfirm.disabled=busy||!confirmingDrop;
  inventoryClear.disabled=busy||!source;
  inventorySplit.hidden=!split;
  inventoryAmount.disabled=busy||!split;
  inventoryAmount.max=split?String(source.quantity):'';
  inventoryMoveAmount.disabled=busy||!split||!inventoryAmount.validity.valid;
  let hint='选择要操作的物品';
  if(targeting)hint='请选择要使用 '+source.name+' 的背包物品';
  else if(confirmingDrop)hint='将 '+source.name+' 丢在当前位置？';
  else if(destination)hint='将 '+source.name+' 移到'+slotLabel(destination);
  else if(source)hint='已选 '+source.name+'，选择操作或移动目标';
  setText(inventoryStatus,notice||hint);
  setText(inventoryDescription,source?.description??'');
}
function syncInventory(){
  const c=state?.client,available=c?.state==='playing'&&!c.paused&&!c.world?.craft&&state.state==='open';
  inventoryToggle.hidden=!available;
  if(!available){if(bag)closeInventory();return;}
  const revision=c.world.battle.items.revision;
  if(!bag||bag.revision===revision)return;
  const encoding=encodingInput.value;
  bag.rows=view.copyInventory().map(({descriptionBytes,...row})=>({
    ...row,description:descriptionBytes?dialogText(descriptionBytes,encoding):'',
  }));
  bag.revision=revision;
  if([bag.source,bag.destination].some(row=>row&&row.revision!==bag.rows[row.slot].revision)){
    clearInventorySelection(bag);
    if(!bag.busy)bag.notice='槽位已更新，请重新选择';
  }
  renderInventory();
}
async function sendInventory(action,amount=-1){
  if(!bag?.source||bag.busy)return;
  const current=bag,{source,destination}=current;
  current.busy=true;
  current.notice='正在发送…';
  renderInventory();
  try{
    if(action==='use')await view.useInventoryItem(source.slot,source.revision);
    else if(action==='use-on-item')await view.useInventoryItemOnItem(source.slot,source.revision,destination.slot,destination.revision);
    else if(action==='drop')await view.dropInventoryItem(source.slot,source.revision);
    else await view.moveInventoryItem(source.slot,source.revision,destination.slot,destination.revision,amount);
    clearInventorySelection(current);
    current.notice='请求已发送';
  }catch(error){
    current.notice=error.code==='LEGACY_GAME_ITEM_CONTEXT'?'当前状态无法进行此操作':
      error.code==='LEGACY_GAME_ITEM_STALE'?'槽位已更新，请重新选择':'物品请求未完成';
    if(error.code==='LEGACY_GAME_ITEM_STALE')clearInventorySelection(current);
  }finally{
    current.busy=false;
    if(bag===current)renderInventory();
  }
}
function dialogButton(label,action){
  const button=document.createElement('button');
  button.type='button';setText(button,label);button.addEventListener('click',action);
  return button;
}
function dialogText(bytes,encoding){
  try{return decodeLegacyGameDescriptionText(bytes,{encoding});}
  catch{return '无法读取此行';}
  finally{bytes.fill(0);}
}
function dialogParagraph(text){
  const row=document.createElement('p');
  setText(row,text);
  return row;
}
function setDialogOptions(select,options,placeholder){
  select.replaceChildren(...[['',placeholder],...options].map(([value,label])=>{
    const option=document.createElement('option');
    option.value=String(value);setText(option,label);return option;
  }));
}
let tradeDraft=null,tradePending=null;
async function actOnTrade(action,revision=null,value=null){
  if(!view||tradePending)return;
  const owner=view,token={};
  tradePending=token;
  const feedback=action==='request'?tradeNotice:tradeStatus;
  setText(feedback,'');
  try{await owner.actOnPlayerTrade(action,revision,value);}
  catch(error){
    if(view===owner)setText(feedback,{
      LEGACY_GAME_TRADE_TARGET:'请面向附近可交易的玩家。',
      LEGACY_GAME_TRADE_COOLDOWN:'请稍候再试。',
      LEGACY_GAME_TRADE_SELECTION:'物品或宠物已更新，请重新选择。',
      LEGACY_GAME_TRADE_GOLD:'请核对可用金币和报价金额。',
      LEGACY_GAME_TRADE_OFFER_STALE:'报价对应的物品、宠物或金币已变动，请撤回并重新报价。',
      LEGACY_GAME_TRADE_STALE:'交易页面已更新，请重新核对。',
    }[error.code]??'交易操作未完成。');
  }finally{if(tradePending===token)tradePending=null;}
}
tradeOpen.addEventListener('click',()=>actOnTrade('request'));
tradeDialog.addEventListener('cancel',event=>{
  event.preventDefault();
  const current=state?.client?.world?.playerTrade;
  if(current)void actOnTrade('close',current.revision);
});
function tradeGroup(title){
  const group=document.createElement('fieldset'),heading=document.createElement('legend');
  group.className='game-trade-group';setText(heading,title);group.append(heading);return group;
}
function tradeLine(group,value){
  const line=document.createElement('p');setText(line,value);group.append(line);
}
function renderTradeOffer(model,draft,encoding){
  const remote=tradeGroup('对方报价'),local=tradeGroup('我的报价');
  tradeLine(remote,'金币 '+model.remoteGold+' · '+['编辑中','已发布','已确认'][model.remotePhase]);
  for(const row of model.remoteItems){
    const name=dialogText(row.nameBytes,encoding)||'物品';
    const alternate=dialogText(row.nicknameBytes,encoding),description=dialogText(row.descriptionBytes,encoding);
    tradeLine(remote,name+(alternate&&alternate!==name?' · '+alternate:'')+(row.quantity>0?' × '+row.quantity:'')+(description?'\n'+description:''));
  }
  for(const row of model.remotePets){
    const name=dialogText(row.nameBytes,encoding)||'宠物',nickname=dialogText(row.nicknameBytes,encoding);
    const skills=row.skills.map(bytes=>dialogText(bytes,encoding)).filter(Boolean);
    tradeLine(remote,'宠物 '+(nickname?name+' · '+nickname:name)+(skills.length?'\n技能 '+skills.join('、'):''));
  }
  const buttons=[];
  if(model.localPhase===0){
    let changed=false;
    const selectable=(rows,selected,kind)=>{
      for(const [slot,revision] of selected){
        if(!rows.some(row=>row.slot===slot&&row.revision===revision)){selected.delete(slot);changed=true;}
      }
      for(const row of rows){
        const label=document.createElement('label'),check=document.createElement('input');
        check.type='checkbox';check.checked=selected.has(row.slot);
        check.addEventListener('change',()=>{if(check.checked)selected.set(row.slot,row.revision);else selected.delete(row.slot);});
        const name=dialogText(row.nameBytes,encoding)||kind;
        label.append(check,kind+' '+name+(row.quantity>0?' × '+row.quantity:''));local.append(label);
      }
    };
    selectable(model.availableItems,draft.items,'物品');
    selectable(model.availablePets,draft.pets,'宠物');
    const label=document.createElement('label'),amount=document.createElement('input');
    label.append('金币 ');amount.type='number';amount.min='0';amount.max=String(model.gold??0);amount.step='1';amount.inputMode='numeric';
    amount.value=draft.gold;
    amount.addEventListener('input',()=>{draft.gold=amount.value;});
    label.append(amount);local.append(label);
    tradeLine(local,model.gold===null?'等待金币同步':'持有金币 '+model.gold);
    if(changed)setText(tradeStatus,'物品或宠物已更新，请重新选择。');
    buttons.push(dialogButton('发布报价',()=>{
      const selections=rows=>Array.from(rows,([slot,revision])=>({slot,revision}));
      return actOnTrade('publish',model.revision,{items:selections(draft.items),pets:selections(draft.pets),gold:Number(draft.gold)});
    }));
  }else{
    const {items,pets,gold}=model.offer;
    tradeLine(local,'金币 '+gold+' · '+(model.localPhase===1?'已发布':'已确认'));
    for(const row of items)tradeLine(local,'物品 '+dialogText(row.nameBytes,encoding)+(row.quantity>0?' × '+row.quantity:''));
    for(const row of pets)tradeLine(local,'宠物 '+dialogText(row.nameBytes,encoding));
    if(model.offerStale)tradeLine(local,'报价对应的持有记录已变动，请撤回后重新报价。');
    const confirm=dialogButton('确认交易',()=>actOnTrade('confirm',model.revision));
    confirm.disabled=model.localPhase!==1||model.remotePhase<1||model.offerStale;
    buttons.push(confirm,dialogButton('撤回报价',()=>actOnTrade('withdraw',model.revision)));
  }
  tradeContent.replaceChildren(remote,local);
  tradeActions.replaceChildren(...buttons,dialogButton('退出交易',()=>actOnTrade('close',model.revision)));
}
function syncPlayerTrade(){
  const client=state?.client,world=client?.world,current=client?.state==='playing'?world?.playerTrade:null;
  const active=current&&current.kind!=='ended';
  tradeOpen.disabled=client?.state!=='playing'||!!world?.mapDialog||!!world?.craft||!!active;
  if(!active){
    if(tradeDialog.open)tradeDialog.close();
    if(tradeDraft){tradeContent.replaceChildren();tradeActions.replaceChildren();setText(tradeStatus,'');tradeDraft=null;}
    if(current?.kind==='ended')setText(tradeNotice,'交易已结束。');
    else if(client?.state!=='playing')setText(tradeNotice,'');
    return;
  }
  const stamp=[current.revision,current.gold,world.battle.items.revision,current.petVersion].join('/');
  if(tradeDraft?.stamp===stamp&&tradeDraft.owner===view)return;
  const model=view.copyPlayerTrade(),encoding=encodingInput.value;
  if(tradeDraft?.session!==model.session||tradeDraft.owner!==view){
    const refs=rows=>new Map((rows??[]).map(row=>[row.slot,row.revision]));
    tradeDraft={owner:view,session:model.session,items:refs(model.offer?.items),pets:refs(model.offer?.pets),gold:String(model.offer?.gold??0)};
  }
  tradeDraft.stamp=stamp;
  setText(tradeStatus,'');setText(tradeNotice,'');
  if(model.kind==='candidates'){
    setText(tradeTitle,'选择交易对象');
    const choices=model.candidates.filter(row=>row.nameBytes.length).map(row=>dialogButton(dialogText(row.nameBytes,encoding),()=>actOnTrade('select',model.revision,row.index)));
    tradeContent.replaceChildren(...choices);
    if(!choices.length)tradeLine(tradeContent,'附近没有可交易的玩家。');
    tradeActions.replaceChildren(dialogButton('关闭列表',()=>actOnTrade('close',model.revision)));
  }else{
    setText(tradeTitle,'玩家交易 · '+(dialogText(model.partner,encoding)||'交易对象'));
    renderTradeOffer(model,tradeDraft,encoding);
  }
  if(!tradeDialog.open)tradeDialog.showModal();
}
const familyPermissions=[[1,'邀请入会'],[2,'移除成员'],[4,'喂食家族兽'],[8,'管理仓储'],[16,'删除留言']];
let familyStamp=null,familyRoleSlot=0;
function dismissFamily(){
  if(familyDialog.open)familyDialog.close();
  familyStamp=null;familyRoleSlot=0;
  familyContent.replaceChildren();setText(familyStatus,'');
}
familyOpen.addEventListener('click',()=>{
  if(familyOpen.disabled||familyDialog.open)return;
  familyDialog.showModal();syncFamilyDialog();
});
byId('game-family-dismiss').addEventListener('click',dismissFamily);
familyDialog.addEventListener('cancel',event=>{event.preventDefault();dismissFamily();});
async function submitFamily(version,action,value,encoding){
  const owner=view;
  let name;
  try{
    if(value!==undefined)name=encodeLauncherProcessField(value,{encoding});
    setText(familyStatus,'');
    await owner.actOnFamily(version,{...action,name});
    if(action.kind==='invite'&&owner===view&&familyDialog.open&&state?.client?.world?.family?.version===version)
      setText(familyStatus,'邀请请求已发送。');
  }catch(error){
    if(owner!==view||!familyDialog.open)return;
    const messages={LEGACY_GAME_FAMILY_BUSY:'等待家族资料更新。',LEGACY_GAME_FAMILY_STALE:'家族资料已更新，请重新编辑。',
      LEGACY_GAME_FAMILY_NAME:'请检查名称的字节长度和字符。',LEGACY_GAME_FAMILY_PERMISSION:'当前权限无法执行此操作。',
      LEGACY_GAME_FAMILY_ROLE:'请核对当前称号和可选称号。',LEGACY_GAME_DIALOG_TEXT:'请检查名称的字符。',
      LEGACY_GAME_FAMILY_MEMBER:'名单已更新，请重新选择成员。',LEGACY_GAME_FAMILY_TARGET:'请先面向相邻玩家。',
      LEGACY_GAME_FAMILY_COOLDOWN:'请稍候再试。'};
    setText(familyStatus,messages[error.code]??(error.code?.startsWith('TEXT_')?'名称含有当前编码无法使用的字符。':'家族操作暂不可用。'));
  }finally{name?.fill(0);}
}
function familyField(label,control){
  const field=document.createElement('label');
  setText(field,label);field.append(control);
  return field;
}
function familyTextInput(value,maxLength){
  const input=document.createElement('input');
  input.type='text';input.maxLength=maxLength;input.value=value;input.autocomplete='off';
  return input;
}
function familyFields(legend,pending){
  const fields=document.createElement('fieldset'),heading=document.createElement('legend');
  fields.className='game-family-fields';fields.disabled=!!pending;
  setText(heading,legend);fields.append(heading);
  return fields;
}
function familyRoleEditor(model,roles,encoding){
  const fields=familyFields('编辑称号和权限',model.pending);
  const selector=document.createElement('select'),box=document.createElement('div');
  const input=familyTextInput('',legacyGameFamilyRoleNameBytes);
  box.className='game-family-permissions';
  for(let slot=0;slot<legacyGameFamilyRoleCapacity;slot++){
    const option=document.createElement('option');
    option.value=String(slot);setText(option,(slot+1)+' · '+(roles.get(slot)?.name||'空称号'));
    selector.append(option);
  }
  const checks=familyPermissions.map(([bit,label])=>{
    const check=document.createElement('input');
    check.type='checkbox';box.append(familyField(label,check));
    return {bit,check};
  });
  function selectRole(){
    familyRoleSlot=Number(selector.value);
    const row=roles.get(familyRoleSlot),flags=row?.flags??0;
    input.value=row?.name??'';
    for(const {bit,check} of checks){
      check.checked=!!(flags&bit);check.disabled=familyRoleSlot===0||!!(flags&0x80);
    }
  }
  selector.value=String(familyRoleSlot);selector.addEventListener('change',selectRole);selectRole();
  fields.append(familyField('选择称号',selector),familyField('称号名称',input),box,dialogButton('保存称号',()=>{
    const slot=Number(selector.value),permissions=checks.reduce((mask,{bit,check})=>check.checked?mask|bit:mask,0);
    const value=input.value===(roles.get(slot)?.name??'')?undefined:input.value;
    submitFamily(model.version,{kind:'role',slot,permissions},value,encoding);
  }));
  return fields;
}
function familyMemberEditor(model,members,roles){
  const fields=familyFields('管理成员',model.pending);
  const memberSelect=document.createElement('select'),roleSelect=document.createElement('select');
  const confirmation=document.createElement('div'),prompt=dialogParagraph('');
  confirmation.hidden=true;
  setDialogOptions(memberSelect,members.map(row=>[row.id,row.label]),'选择成员');
  const target=()=>memberSelect.value===''?null:members.find(row=>row.id===Number(memberSelect.value));
  const assign=dialogButton('分配称号',()=>{
    submitFamily(model.version,{kind:'assign-role',memberId:target()?.id,slot:Number(roleSelect.value)});
  });
  const remove=dialogButton('移除成员',()=>{
    setText(prompt,'确认将 '+target().label+' 从家族名单移除？');
    confirmation.hidden=false;
  });
  confirmation.append(prompt,dialogButton('确认移除',()=>{
    confirmation.hidden=true;submitFamily(model.version,{kind:'remove-member',memberId:target()?.id});
  }),dialogButton('取消移除',()=>{confirmation.hidden=true;}));
  function selectMember(){
    const row=target();
    confirmation.hidden=true;
    remove.disabled=!row?.canRemove;
    setText(remove,row?.self?'退出家族':'移除成员');
    const choices=row?.canAssignRole?[...roles].filter(([slot,role])=>slot>0&&role.name&&slot!==row.roleSlot)
      .map(([slot,role])=>[slot,role.name]):[];
    setDialogOptions(roleSelect,choices,'选择新称号');
    roleSelect.disabled=choices.length===0;
    assign.disabled=true;
  }
  memberSelect.addEventListener('change',selectMember);selectMember();
  roleSelect.addEventListener('change',()=>{assign.disabled=roleSelect.value==='';});
  const actions=document.createElement('div');actions.className='battle-commands';actions.append(assign,remove);
  fields.append(familyField('选择成员',memberSelect),familyField('新称号',roleSelect),actions,confirmation);
  return fields;
}
function syncFamilyDialog(){
  const client=state?.client,world=client?.world,info=world?.family;
  familyOpen.disabled=client?.state!=='playing'||!!world?.battle?.pending||!!world?.craft||!!world?.mapDialog||
    !!(world?.playerTrade&&world.playerTrade.kind!=='ended');
  if(familyOpen.disabled&&familyDialog.open)dismissFamily();
  if(!familyDialog.open)return;
  const stamp=(info?.version??0)+'/'+(info?.pending??'');
  if(familyStamp===stamp)return;
  familyStamp=stamp;
  setText(familyStatus,info?.pending?'请求已发送，等待家族资料更新。':'');
  const model=view.copyFamily(),encoding=encodingInput.value;
  if(!model||model.id===null||model.id<0){
    familyContent.replaceChildren(dialogParagraph(model?.id<0?'当前没有家族。':'等待家族资料同步。'));
    return;
  }
  const name=dialogText(model.name,encoding),hall=dialogText(model.hall,encoding);
  const roles=new Map(model.roles.map(row=>[row.slot,{name:dialogText(row.name,encoding),flags:row.flags}]));
  const title=slot=>roles.get(slot)?.name||'未同步';
  const heading=document.createElement('h3'),members=document.createElement('ul'),editableMembers=[];
  setText(heading,'家族成员');members.className='game-family-members';
  for(const row of model.members){
    const member=document.createElement('li');
    const name=dialogText(row.name,encoding),secondary=dialogText(row.secondaryName,encoding);
    const label=(name||'未命名')+(secondary?' · 附名 '+secondary:'')+' · '+title(row.roleSlot)+(row.self?' · 自己':'');
    setText(member,label);
    if(row.canRemove||row.canAssignRole)editableMembers.push({...row,label});
    members.append(member);
  }
  familyContent.replaceChildren(dialogParagraph('家族 '+(name||'未同步')),dialogParagraph('会馆 '+(hall||'未同步')),
    dialogParagraph('我的称号 '+title(model.ownRole)),heading,members.childElementCount?members:dialogParagraph('暂无成员记录。'));
  if(model.canInvite){
    const invite=dialogButton('邀请面前玩家',()=>submitFamily(model.version,{kind:'invite'}));
    invite.disabled=!!model.pending;
    familyContent.append(invite);
  }
  if(editableMembers.length)familyContent.append(familyMemberEditor(model,editableMembers,roles));
  if(!model.canManage)return;
  const fields=familyFields('编辑家族资料',model.pending);
  for(const [kind,label,value] of [['name','家族名称',name],['hall','会馆名称',hall]]){
    const input=familyTextInput(value,legacyGameFamilyNameBytes);
    fields.append(familyField(label,input),dialogButton('保存'+label,()=>{
      if(input.value!==value)submitFamily(model.version,{kind},input.value,encoding);
    }));
  }
  familyContent.append(fields,familyRoleEditor(model,roles,encoding));
}
function openMapBoard(dialog,encoding){
  const owner=view,{revision,board}=dialog,title=dialogText(board.title,encoding);
  setText(mapDialogTitle,title?'留言板 · '+title:'留言板');
  const label=document.createElement('label'),draft=document.createElement('textarea');
  label.className='game-board-compose';
  setText(label,'写留言');
  draft.rows=2;
  draft.maxLength=140;
  label.append(draft);
  let busy=false;
  async function send(button,choice=null){
    if(busy)return;
    busy=true;mapDialogDismiss.disabled=true;
    let text=null;
    try{
      if(button===1)text=encodeLauncherProcessField(draft.value.replaceAll('\n','\r'),{encoding});
      await owner.replyMapDialog(revision,button,choice,text);
    }catch(error){
      if(view===owner&&mapDialogRevision===revision){
        const message=error.code==='LEGACY_GAME_BOARD_TEXT'||error.code==='LEGACY_GAME_DIALOG_TEXT'?
          '请将留言缩短至两行，每行最多 70 字节。':'操作未完成，请核对留言与当前编码。';
        setText(mapDialogStatus,message);
      }
    }finally{
      busy=false;text?.fill(0);
      if(view===owner&&mapDialogRevision===revision)mapDialogDismiss.disabled=false;
    }
  }
  const entries=board.entries.map(entry=>{
    const article=document.createElement('article'),author=document.createElement('strong');
    article.className='game-board-entry';
    article.dataset.boardRow=String(entry.row);
    const name=dialogText(entry.name,encoding)||'留言 '+(entry.row+1);
    setText(author,name);
    article.append(author);
    if(entry.timestamp!==null){
      const time=document.createElement('time'),date=new Date(entry.timestamp*1000);
      time.dateTime=date.toISOString();
      setText(time,date.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}));
      article.append(time);
    }
    const body=document.createElement('p');
    setText(body,entry.lines.map(line=>dialogText(line,encoding)).join('\n'));
    article.append(body);
    if(entry.canDelete){
      const controls=document.createElement('div');
      controls.hidden=true;
      const remove=dialogButton('删除',()=>{controls.hidden=false;remove.hidden=true;confirm.focus();});
      remove.setAttribute('aria-label','删除 '+name);
      const confirm=dialogButton('确认删除',()=>send(0x40,entry.row));
      controls.append(confirm,dialogButton('取消删除',()=>{controls.hidden=true;remove.hidden=false;remove.focus();}));
      article.append(remove,controls);
    }
    return article;
  });
  if(!entries.length){
    const empty=document.createElement('p');
    setText(empty,'本页暂无留言。');
    entries.push(empty);
  }
  const publish=dialogButton('发布留言',()=>send(1));
  publish.disabled=true;
  draft.addEventListener('input',()=>{publish.disabled=draft.value.length===0;});
  const pages=dialog.buttons.filter(button=>button!==1).map(button=>dialogButton(button===0x10?'上一页':'下一页',()=>send(button)));
  mapDialogLines.replaceChildren(...entries,label);
  mapDialogButtons.replaceChildren(publish,...pages);
}
function shopNotice(code){
  return {
    LEGACY_GAME_SHOP_BALANCE_UNKNOWN:'等待服务器同步金币。',
    LEGACY_GAME_SHOP_FUNDS:'金币不足。',
    LEGACY_GAME_SHOP_EXCHANGE_FUNDS:'兑换物不足。',
    LEGACY_GAME_SHOP_CONVERSION_ITEMS:'等待匹配的持有物品。',
    LEGACY_GAME_SHOP_SPACE:'背包空位不足。',
    LEGACY_GAME_SHOP_GOLD_LIMIT:'出售后将超过金币上限。',
    LEGACY_GAME_SHOP_SLOT_CHANGED:'背包槽位已更新，请重新打开商店。',
    LEGACY_GAME_SHOP_QUANTITY:'请核对可交易的数量。',
    LEGACY_GAME_SHOP_ORDER:'请输入有效数量。',
  }[code]??'无法提交订单。';
}
function openMapShop(dialog,encoding,inventoryRevision){
  const owner=view,{revision,shop}=dialog,exchange=shop.direction==='exchange',conversion=Boolean(shop.conversion);
  const purchase=shop.direction==='buy'||exchange;
  const service=shop.direction==='appraise'||shop.direction==='repair',action=shopActionLabels[shop.direction];
  const unit=exchange?(dialogText(shop.currency.label,encoding)||'兑换物'):'金币';
  const balance=document.createElement('p'),summary=document.createElement('p'),items=document.createElement('div');
  items.className='game-shop-items';
  const title=dialogText(shop.title,encoding);
  setText(mapDialogTitle,title?action+' · '+title:action);
  const notes=shop.messages.map(bytes=>{
    const note=document.createElement('p');setText(note,dialogText(bytes,encoding));return note;
  }).filter((note,index)=>note.textContent&&(!conversion||index===0));
  if(service){
    const note=document.createElement('p');
    setText(note,shop.rows.length?'选择需要'+action+'的背包物品。':'没有可选的背包物品。');
    notes.push(note);
  }
  const rows=shop.rows.map(row=>{
    const label=document.createElement('label'),name=document.createElement('strong'),details=document.createElement('span');
    const quantity=document.createElement('input');
    const itemName=dialogText(row.name,encoding),alternate=row.alternateLabel?dialogText(row.alternateLabel,encoding):'';
    const title=alternate||itemName||'未命名物品',description=dialogText(row.description,encoding);
    setText(name,row.slot===null?title:title+' · 背包槽 '+(row.slot-7));
    if(service){
      quantity.type='checkbox';
      quantity.setAttribute('aria-label','选择'+title);
    }else{
      quantity.type='number';quantity.min='0';quantity.step='1';quantity.value='0';quantity.inputMode='numeric';
      quantity.setAttribute('aria-label',title+'数量');
    }
    quantity.dataset.shopRow=String(row.row);
    quantity.addEventListener('input',update);
    const text=document.createElement('span');text.append(name,details);
    label.append(text,quantity);items.append(label);
    return { id:row.row,title,description,quantity,details };
  });
  let reviewing=false,busy=false,gold=shop.gold;
  function readOrder(){
    const selections=[];
    for(const row of rows){
      if(row.quantity.disabled)continue;
      const quantity=service?Number(row.quantity.checked):row.quantity.valueAsNumber;
      if(!service&&(row.quantity.validity.badInput||(row.quantity.value!==''&&!row.quantity.validity.valid)))throw Object.assign(new Error(),{code:'LEGACY_GAME_SHOP_ORDER'});
      if(quantity>0)selections.push({row:row.id,quantity});
    }
    return selections;
  }
  const primary=dialogButton('核对订单',async()=>{
    if(!reviewing){reviewing=true;update();return;}
    if(busy)return;
    busy=true;primary.disabled=true;back.disabled=true;mapDialogDismiss.disabled=true;
    let notice='';
    try{await owner.submitMapShop(revision,readOrder());}
    catch(error){notice=shopNotice(error.code);}
    finally{
      busy=false;
      if(mapDialogRevision===revision){
        back.disabled=false;mapDialogDismiss.disabled=false;update();
        if(notice)setText(mapDialogStatus,notice);
      }
    }
  });
  function edit(){
    if(!reviewing||busy)return false;
    reviewing=false;update();primary.focus();return true;
  }
  const back=dialogButton('返回修改',edit);
  function update(){
    let quote=null,notice='';
    try{
      const order=readOrder();
      if(order.length)quote=owner.quoteMapShop(revision,order);
    }catch(error){notice=shopNotice(error.code);}
    if(!quote)reviewing=false;
    items.hidden=reviewing;
    back.hidden=!reviewing;
    setText(primary,reviewing?'确认'+action:'核对订单');
    primary.disabled=!quote||busy;
    setText(mapDialogStatus,notice);
    let total='';
    if(quote){
      total=conversion?'折算值 '+quote.total:'合计 '+quote.total+' '+unit;
      if(purchase)total+=' · 需要 '+quote.requiredBagSlots+' 个空格';
      if(exchange&&quote.releasedBagSlots)total+=' · 付款腾出 '+quote.releasedBagSlots+' 格';
    }
    const order=reviewing?quote.lines.map(line=>rows.find(row=>row.id===line.row).title+(service?'':' × '+line.quantity)).join('\n')+'\n':'';
    setText(summary,order+total);
  }
  function show(next){
    let held=exchange?'持有 '+unit+' '+next.currency.balance:'持有金币 '+(next.gold??'待同步');
    if(conversion){
      const {variant,held:count,quotaLimit,quotaCount}=next.conversion;
      held=variant===0?'限量 '+count+' · 配额 '+quotaCount+'/'+quotaLimit:'持有物品 '+count+' · '+held;
    }
    setText(balance,held+(purchase?' · 背包空格 '+next.freeBagSlots:''));
    for(let i=0;i<rows.length;i++){
      const row=rows[i],offer=next.rows[i];
      if(!service)row.quantity.max=String(offer.maximum);
      row.quantity.disabled=offer.maximum===0;
      if(row.quantity.disabled){
        if(service)row.quantity.checked=false;
        else row.quantity.value='0';
      }
      let details=conversion&&offer.unavailable?shopNotice(offer.unavailable):offer.unavailable==='slot-changed'?'槽位已更新':'不可交易';
      if(!offer.unavailable){
        if(service)details='费用 '+offer.unitPrice+' 金币';
        else if(conversion)details='折算比例 '+offer.unitPrice+' · 最多 '+offer.maximum+' 件';
        else{
          const amount=exchange?'每格 '+offer.stackSize+' 件':'最多 '+offer.maximum+' 件';
          details='单价 '+offer.unitPrice+' '+unit+' · '+amount;
        }
      }
      const equipNotice=offer.canEquip===false?'\n当前无法装备':'';
      setText(row.details,details+equipNotice+(row.description?'\n'+row.description:''));
    }
    update();
  }
  mapDialogLines.replaceChildren(...notes,balance,items,summary);
  mapDialogButtons.replaceChildren(primary,back);
  show(shop);
  return {
    edit,
    refresh(next,nextInventoryRevision){
      if(gold===next.gold&&inventoryRevision===nextInventoryRevision)return;
      const latest=owner.copyMapDialog().shop;
      latest.title.fill(0);
      latest.currency?.label.fill(0);
      for(const bytes of latest.messages)bytes.fill(0);
      for(const row of latest.rows){
        row.name.fill(0);row.description.fill(0);row.alternateLabel?.fill(0);
      }
      gold=next.gold;inventoryRevision=nextInventoryRevision;
      reviewing=false;show(latest);
    },
  };
}
const npcServiceTitles={merchant:'商店',trainer:'技能师范',exchange:'物品兑换',handoff:'物品交接',learn:'学习技能',forget:'遗忘技能'};
const npcServiceActions={
  buy:'购买',sell:'出售',learn:'想学习技能',forget:'想遗忘技能',exchange:'兑换物品',leave:'不用了','confirm-learn':'确认学习',back:'返回',
  give:'给予物品',receive:'接受物品',
};
function openMapNpcService(dialog,encoding,send){
  const service=dialog.npcService,{kind,choices}=service;
  const paragraph=dialogParagraph;
  setText(mapDialogTitle,dialogText(service.title,encoding)||npcServiceTitles[kind]);
  const content=service.lines.map(line=>paragraph(dialogText(line,encoding)));
  const skills=kind==='learn'||kind==='forget'?paragraph(''):null;
  const balance=kind==='learn'?paragraph(''):null;
  if(kind==='learn'){
    content.push(paragraph(dialogText(service.name,encoding)));
    content.push(...service.description.map(line=>paragraph(dialogText(line,encoding))));
    content.push(paragraph(`需要 ${service.slotUnits} 个技能栏位 · ${service.fee} 金币`),balance);
  }
  if(skills)content.push(skills);
  const rows=service.rows?.map(row=>({id:row.id,name:dialogText(row.name,encoding)||'技能'}))??[];
  const actions=choices.map(option=>dialogButton(npcServiceActions[option.action],()=>send(0,option.id)));
  let stale=dialog.skillListStale,selected=null;
  const refreshChoices=()=>{
    if(selected){
      const {id,name}=selected;
      const confirm=dialogButton('确认遗忘',()=>send(0,id));
      const cancel=dialogButton('取消选择',()=>{
        selected=null;
        refreshChoices();
      });
      mapDialogLines.replaceChildren(...content,paragraph('确认遗忘 '+name+'？'));
      mapDialogButtons.replaceChildren(confirm,cancel);
      cancel.focus();
      return;
    }
    const list=rows.map(row=>{
      const control=dialogButton('遗忘 '+row.name,()=>{
        selected=row;
        refreshChoices();
      });
      control.disabled=Boolean(stale);
      return control;
    });
    if(kind==='forget'&&!list.length)list.push(paragraph('当前没有可遗忘的技能'));
    mapDialogLines.replaceChildren(...content,...list);
    mapDialogButtons.replaceChildren(...actions);
  };
  const refresh=current=>{
    if(skills)setText(skills,current.skillCapacity===null?`已用技能栏位 ${current.skillUsed} · 等待容量同步`:
      `技能栏位 ${current.skillUsed} / ${current.skillCapacity}`);
    if(balance)setText(balance,current.gold===null?'等待金币同步':'持有金币 '+current.gold);
    if(current.skillListStale!==stale){
      stale=current.skillListStale;
      selected=null;
      refreshChoices();
    }
    if(stale)setText(mapDialogStatus,'技能列表已更新，请返回后重新打开。');
  };
  refreshChoices();
  refresh(dialog);
  return {refresh};
}
const petTrainingTitles={offer:'宠物技能师范',pet:'选择宠物',slot:'选择宠物技能栏'};
const petTrainingTypes=['人形系','龙系','不死系','飞行系','昆虫系','植物系','野兽系','特殊系','金属系','邪魔系'];
function openMapPetTraining(dialog,encoding,send){
  const {step,title,lines,rows,lesson,selectedPet,requiredType}=dialog.petTraining;
  const paragraph=dialogParagraph;
  setText(mapDialogTitle,dialogText(title,encoding)||petTrainingTitles[step]);
  const content=lines.map(line=>paragraph(dialogText(line,encoding)));
  const balance=paragraph(''),availability=paragraph('');
  if(lesson)content.push(paragraph(`已选技能 ${dialogText(lesson.name,encoding)} · ${lesson.fee} 金币`));
  if(step==='pet'&&petTrainingTypes[requiredType])content.push(paragraph('要求 '+petTrainingTypes[requiredType]));
  if(selectedPet){
    const occupied=rows.filter(row=>row.occupied).length;
    content.push(paragraph(`${dialogText(selectedPet.name,encoding)} · 技能栏 ${occupied} / ${selectedPet.capacity}`));
  }
  content.push(balance);
  if(step==='offer')content.push(availability);
  const leave=dialogButton(step==='offer'?'不用了':'取消训练',()=>send(2));
  let stale=dialog.petTrainingStale,selected=null;
  const controls=rows.map(row=>{
    const name=dialogText(row.name,encoding);
    const label=step==='offer'?`选择技能 ${name} · ${row.fee} 金币`:
      step==='pet'?`选择宠物 ${name} · ${row.capacity} 个技能栏位`+(petTrainingTypes[row.type]?' · '+petTrainingTypes[row.type]:''):
      `技能栏 ${row.id+1} · ${row.occupied?name:'空栏位'}`;
    const button=dialogButton(label,()=>{
      if(step==='slot'){
        selected={id:row.id,name,occupied:row.occupied};
        show();
      }else send(0,row.id);
    });
    const descriptions=row.description?.map(line=>paragraph(dialogText(line,encoding)))??[];
    return {row,button,descriptions};
  });
  function show(){
    if(selected){
      const {id,name,occupied}=selected;
      const confirm=dialogButton('确认学习',()=>send(0,id));
      const cancel=dialogButton('取消选择',()=>{
        selected=null;
        show();
      });
      const review=occupied?`确认使用技能栏 ${id+1}，替换 ${name}？`:`确认在空技能栏 ${id+1} 学习？`;
      mapDialogLines.replaceChildren(...content,paragraph(review));
      mapDialogButtons.replaceChildren(confirm,cancel);
      cancel.focus();
      return;
    }
    mapDialogLines.replaceChildren(...content,...controls.flatMap(({button,descriptions})=>[button,...descriptions]));
    if(!controls.length)mapDialogLines.append(paragraph('当前没有可选项目'));
    mapDialogButtons.replaceChildren(leave);
  }
  const refresh=current=>{
    setText(balance,current.gold===null?'等待金币同步':'持有金币 '+current.gold);
    if(step==='offer')setText(availability,current.petCount?'':'暂无可训练宠物');
    if(stale!==current.petTrainingStale){
      stale=current.petTrainingStale;
      selected=null;
      show();
    }
    for(const {row,button} of controls){
      button.disabled=stale||(step==='pet'&&!row.eligible)||
        (step==='offer'&&(row.fee>(current.gold??0)||!current.petCount));
    }
    if(stale)setText(mapDialogStatus,'宠物或技能栏已更新，请重新打开训练。');
  };
  show();
  refresh(dialog);
  return {refresh};
}
function openMapAppearance(dialog,encoding,send){
  const {appearance}=dialog;
  setText(mapDialogTitle,dialogText(appearance.title,encoding)||'调整外观');
  const preview=dialogParagraph('');
  const controls=[['脸型','variant',3,5],['眼睛','detail1',6,8],['嘴型','detail2',9,11]].map(([label,key,left,right])=>{
    const row=document.createElement('div'),value=dialogParagraph('');
    row.className='appearance-controls';
    row.append(value,dialogButton('上一个'+label,()=>send(0,left)),dialogButton('下一个'+label,()=>send(0,right)));
    return {label,key,row,value};
  });
  mapDialogLines.replaceChildren(...dialog.lines.map(line=>dialogParagraph(dialogText(line,encoding))),preview,...controls.map(c=>c.row));
  mapDialogButtons.replaceChildren(dialogButton('确认外观',()=>send(1)));
  let drawn;
  const refresh=({appearance:current})=>{
    setText(preview,`外观编号 ${current.appearanceCode}`);
    for(const {label,key,row,value} of controls){
      row.hidden=key==='variant'&&!current.canChangeVariant;
      setText(value,`${label} ${current[key]+1}`);
    }
    if(drawn===current.previewResourceId)return;
    drawn=current.previewResourceId;
    const graphics=[
      {resourceId:current.graphicResource,facing:0,x:70,y:82},
      {resourceId:drawn,facing:0,x:210,y:82},
    ].filter(({resourceId})=>resourceId!==null&&resourceId>=1000&&resourceId<=120500);
    view.setMapDialogGraphics(mapDialogGraphics,graphics.length?{width:280,height:112,graphics}:null);
  };
  refresh(dialog);
  return {refresh};
}
function openMapBank(dialog,encoding){
  const owner=view,revision=dialog.revision,feedBox=dialog.mode===legacyGameFeedBoxMode;
  let current=null,stamp=null,tab='item';
  setText(mapDialogTitle,feedBox?'饲料箱':dialog.mode===0x17?'银行':'仓储');
  const tabs=document.createElement('div'),fields=document.createElement('div');
  tabs.className='battle-commands';fields.className='game-bank-fields';
  const controls=(feedBox?[]:Object.entries({item:'物品',pet:'宠物',gold:'金币'})).map(([kind,label])=>{
    const control=dialogButton(label,()=>{tab=kind;render();});
    tabs.append(control);
    return [kind,control];
  });
  mapDialogLines.replaceChildren(feedBox?dialogParagraph('选择背包和饲料箱槽位移动物品。'):tabs,fields);
  function field(title,element){
    const label=document.createElement('label');
    label.append(title,element);fields.append(label);
    return element;
  }
  function amountInput(label){
    const input=document.createElement('input');
    input.type='number';input.min='1';input.step='1';input.inputMode='numeric';
    return field(label,input);
  }
  async function send(action){
    if(view!==owner||mapDialogRevision!==revision||current.bank.pending)return;
    setText(mapDialogStatus,'');
    try{await owner.actOnMapBank(revision,{...action,version:current.bank.version});}
    catch(error){if(view===owner&&mapDialogRevision===revision)setText(mapDialogStatus,{
      LEGACY_GAME_BANK_STALE:'仓储或持有记录已更新，请重新选择。',
      LEGACY_GAME_BANK_SLOT:'请选择可移动的来源和目标槽位。',
      LEGACY_GAME_BANK_AMOUNT:'请核对数量和余额上限。',
      LEGACY_GAME_BANK_BUSY:'正在等待仓储更新。',
    }[error.code]??'仓储操作未完成。');}
  }
  function goldFields(){
    const balance=current.bank.balance,wallet=current.gold;
    fields.append(dialogParagraph('持有金币 '+(wallet??'等待同步')+' · 仓储余额 '+(balance??'等待同步')));
    const direction=field('金币操作',document.createElement('select'));
    setDialogOptions(direction,[['deposit-gold','存入金币'],['withdraw-gold','取出金币']],'选择操作');
    const amount=amountInput('金币金额'),limit=dialogParagraph('');
    fields.append(limit);
    const confirm=dialogButton('确认金币操作',()=>send({kind:direction.value,amount:Number(amount.value),wallet}));
    function update(){
      const maximum=balance===null||wallet===null||!direction.value?0:Math.max(0,direction.value==='deposit-gold'?
        Math.min(wallet,legacyGameBankGoldLimit-balance):Math.min(balance,legacyGameBankGoldLimit-wallet));
      amount.max=String(maximum);amount.disabled=maximum===0||current.bank.pending;
      setText(limit,'可操作金额 '+maximum);
      confirm.disabled=amount.disabled||!amount.value||!amount.validity.valid;
    }
    direction.disabled=current.bank.pending;
    direction.addEventListener('change',update);amount.addEventListener('input',update);update();
    return confirm;
  }
  function slotFields(){
    const items=tab==='item',bank=owner.copyMapDialog().bank;
    const stored=(items?bank.items:bank.pets).map((row,index)=>({slot:100+index,occupied:!!row,canMove:!!row,
      label:(feedBox?'饲料箱槽 ':'仓储槽 ')+(index+1),name:row?dialogText(row.name,encoding):'',quantity:row?.quantity,
      detail:row?.lines?.map(line=>dialogText(line,encoding)).join('\n')??''}));
    for(const row of items?bank.pets:bank.items){
      row?.name.fill(0);for(const line of row?.lines??[])line.fill(0);
    }
    const own=items?owner.copyInventory().filter(row=>!row.equipment).map(row=>({slot:row.slot,occupied:row.present,
      canMove:feedBox?canStoreLegacyGameFeedBoxItem(row):row.canStore,
      label:'背包槽 '+(row.slot-7),name:row.name,quantity:row.quantity,revision:row.revision})):
      owner.copyWorldState().battle.pets.records.map(row=>({slot:row.slot,occupied:row.present,canMove:row.present,
        label:'携带宠物槽 '+(row.slot+1),name:dialogText(row.nameBytes,encoding)}));
    const rows=[...own,...stored],label=row=>row.label+' · '+(row.name||(row.occupied?(items?'物品':'宠物'):'空'))+
      (row.quantity>0?' × '+row.quantity:'');
    const from=field('来源槽位',document.createElement('select'));
    const to=field('目标槽位',document.createElement('select'));
    const amount=items?amountInput('移动数量（留空表示整组）'):null;
    const details=dialogParagraph('');fields.append(details);
    const get=select=>select.value?rows.find(row=>row.slot===Number(select.value)):null;
    const confirm=dialogButton(items?'确认移动物品':'确认移动宠物',()=>{
      const source=get(from),destination=get(to);
      if(!source||!destination)return;
      void send({kind:tab,from:source.slot,to:destination.slot,amount:amount?.value?Number(amount.value):-1,
        fromRevision:source.revision,toRevision:destination.revision,petVersion:current.petVersion});
    });
    setDialogOptions(from,rows.filter(row=>row.canMove).map(row=>[row.slot,label(row)]),'选择来源');
    from.disabled=current.bank.pending;
    function updateAmount(){
      const source=get(from),destination=get(to);
      if(amount){
        amount.disabled=!destination||destination.occupied||!(source?.quantity>0)||current.bank.pending;
        amount.max=String(source?.quantity??0);
        if(amount.disabled)amount.value='';
      }
      confirm.disabled=!source||!destination||current.bank.pending||Boolean(amount?.value&&!amount.validity.valid);
    }
    function updateTarget(){
      const source=get(from);
      const targets=source?rows.filter(row=>row.slot!==source.slot&&(source.slot>=100||row.slot>=100)):[];
      setDialogOptions(to,targets.map(row=>[row.slot,label(row)]),'选择目标');
      to.disabled=!source||current.bank.pending;
      setText(details,source?.detail??'');
      if(amount)amount.value='';
      updateAmount();
    }
    from.addEventListener('change',updateTarget);to.addEventListener('change',updateAmount);
    amount?.addEventListener('input',updateAmount);updateTarget();
    return confirm;
  }
  function render(){
    for(const [kind,control] of controls)control.setAttribute('aria-pressed',String(kind===tab));
    fields.replaceChildren();
    mapDialogButtons.replaceChildren(tab==='gold'?goldFields():slotFields());
    setText(mapDialogStatus,current.bank.pending?'正在等待仓储更新。':'');
  }
  return {refresh(next,inventoryRevision){
    const key=[next.bank.version,next.bank.pending,next.gold,next.petVersion,inventoryRevision].join('|');
    if(key===stamp)return;
    current=next;stamp=key;render();
  }};
}
function openMapFamilyPet(dialog,encoding){
  const owner=view,revision=dialog.revision,{title,lines}=dialog.familyPet;
  let current=dialog.familyPet,slots=new Map(),optionStamp=null;
  setText(mapDialogTitle,dialogText(title,encoding)||'家族兽');
  setText(mapDialogInputCaption,'家族兽名称');
  mapDialogInput.maxLength=legacyGameFamilyPetNameBytes;
  const body=document.createElement('div');
  body.className='game-family-pet-content';body.tabIndex=0;
  body.setAttribute('role','region');body.setAttribute('aria-label','家族兽信息');
  body.replaceChildren(...lines.map(line=>dialogParagraph(dialogText(line,encoding))));
  const fields=document.createElement('div'),label=document.createElement('label'),select=document.createElement('select');
  fields.className='game-bank-fields';
  label.append('饲料物品',select);fields.append(label);
  const feed=dialogButton('确认喂食',()=>{
    const slot=slots.get(select.value);
    if(slot)void send({kind:'feed',slot:slot.slot,revision:slot.revision});
  });
  const rename=dialogButton('提交名称',()=>void send({kind:'rename'}));
  mapDialogLines.replaceChildren(body,fields);
  mapDialogButtons.replaceChildren(feed,rename);
  async function send(action){
    if(view!==owner||mapDialogRevision!==revision||current.pending)return;
    let name;
    setText(mapDialogStatus,'');
    try{
      if(action.kind==='rename')name=encodeLauncherProcessField(mapDialogInput.value,{encoding});
      await owner.actOnMapFamilyPet(revision,{...action,name});
    }catch(error){if(view===owner&&mapDialogRevision===revision)setText(mapDialogStatus,{
      LEGACY_GAME_FAMILY_PET_PERMISSION:'当前家族兽权限不允许此操作。',
      LEGACY_GAME_FAMILY_PET_STALE:'背包已更新，请重新选择。',
      LEGACY_GAME_FAMILY_PET_NAME:'名称最多 16 字节，请检查输入。',
    }[error.code]??'家族兽操作未完成。');}
    finally{name?.fill(0);}
  }
  function updateFeed(){feed.disabled=current.pending||!slots.has(select.value);}
  select.addEventListener('change',updateFeed);
  return {refresh({familyPet},inventoryRevision){
    current=familyPet;
    const key=[current.canFeed,inventoryRevision].join('|');
    if(key!==optionStamp){
      const allowed=owner.copyInventory().filter(row=>canFeedLegacyGameFamilyPet(row,current.canFeed));
      slots=new Map(allowed.map(row=>[String(row.slot),row]));
      setDialogOptions(select,allowed.map(row=>[row.slot,'背包槽 '+(row.slot-7)+' · '+row.name]),'选择饲料物品');
      optionStamp=key;
    }
    select.disabled=current.pending||slots.size===0;
    updateFeed();
    mapDialogInputLabel.hidden=rename.hidden=!current.canRename;
    mapDialogInput.disabled=rename.disabled=current.pending;
    if(!current.canRename)mapDialogInput.value='';
    setText(mapDialogStatus,current.pending?'正在等待家族兽或背包更新。':'');
  }};
}
function syncMapDialog() {
  const current=state?.client?.state==='playing'?state.client.world.mapDialog:null;
  if(!current){
    if(mapDialogRevision===null)return;
    mapDialogRevision=null;mapShop=null;mapTreatmentBalance=null;mapServicePanel=null;view?.setMapDialogGraphics(mapDialogGraphics,null);mapDialog.close();mapDialogInput.value='';mapDialogSecondInput.value='';mapDialogLines.replaceChildren();mapDialogButtons.replaceChildren();
    setText(mapDialogStatus,'');return;
  }
  if(!view)return;
  const inventoryRevision=state.client.world.battle.items.revision;
  if(current.revision===mapDialogRevision){
    mapShop?.refresh(current,inventoryRevision);
    if(mapTreatmentBalance)setText(mapTreatmentBalance,current.gold===null?'等待金币同步':'持有金币 '+current.gold);
    mapServicePanel?.refresh(current,inventoryRevision);
    return;
  }
  const dialog=current.bank?current:view.copyMapDialog(),encoding=encodingInput.value;
  const paired=dialog.inputCount===2;
  mapDialogRevision=dialog.revision;
  mapDialogInput.value='';mapDialogSecondInput.value='';
  mapDialogInput.disabled=false;
  mapDialogInputLabel.hidden=!dialog.input;mapDialogSecondLabel.hidden=!paired;
  mapDialogInput.maxLength=dialog.inputByteLimit??254;
  setText(mapDialogInputCaption,paired?'第一项':'回复');setText(mapDialogStatus,'');
  view.setMapDialogGraphics(mapDialogGraphics,dialog.illustration);
  mapDialogDismiss.disabled=false;
  mapTreatmentBalance=null;
  mapServicePanel=null;
  setText(mapDialogDismiss,dialog.mode===legacyGameFeedBoxMode?'离开饲料箱':
    dialog.bank?'离开仓储':dialog.shop?'离开商店':dialog.board?'关闭留言板':'关闭对话');
  mapShop=dialog.shop?openMapShop(dialog,encoding,inventoryRevision):null;
  if(dialog.board)openMapBoard(dialog,encoding);
  if(mapShop||dialog.board){if(!mapDialog.open)mapDialog.showModal();return;}
  if(dialog.bank){
    mapServicePanel=openMapBank(dialog,encoding);mapServicePanel.refresh(current,inventoryRevision);
    if(!mapDialog.open)mapDialog.showModal();
    return;
  }
  if(dialog.familyPet){
    mapServicePanel=openMapFamilyPet(dialog,encoding);mapServicePanel.refresh(current,inventoryRevision);
    if(!mapDialog.open)mapDialog.showModal();
    return;
  }
  const owner=view;
  const send=async (bit,choice=null)=>{
    if(view!==owner||mapDialogRevision!==dialog.revision)return;
    const values=[];
    try{
      if(dialog.input)values.push(encodeLauncherProcessField(mapDialogInput.value,{encoding}));
      if(paired)values.push(encodeLauncherProcessField(mapDialogSecondInput.value,{encoding}));
      await owner.replyMapDialog(dialog.revision,bit,choice,paired?values:values[0]??null);
    }catch(error){if(mapDialogRevision===dialog.revision){
      const invalidPair=paired&&error.code==='LEGACY_GAME_DIALOG_TEXT';
      setText(mapDialogStatus,invalidPair&&bit===1?`请填写两项，每项最多 ${dialog.inputByteLimit} 字节，确认时不能含逗号、竖线或反斜线。`
        :invalidPair?`每项最多 ${dialog.inputByteLimit} 字节。`:'无法发送，请核对输入内容后重试。');
    }}finally{for(const value of values)value.fill(0);}
  };
  if(dialog.npcService||dialog.petTraining||dialog.appearance){
    if(dialog.appearance)mapServicePanel=openMapAppearance(dialog,encoding,send);
    else mapServicePanel=dialog.petTraining?openMapPetTraining(dialog,encoding,send):openMapNpcService(dialog,encoding,send);
    if(!mapDialog.open)mapDialog.showModal();
    return;
  }
  setText(mapDialogTitle,dialog.treatment?'请选择治疗对象':dialog.graphicReply!==undefined?'图文确认':'对话');
  if(dialog.treatment){
    const {rows,allChoice,allFee}=dialog.treatment;
    mapTreatmentBalance=document.createElement('p');
    setText(mapTreatmentBalance,current.gold===null?'等待金币同步':'持有金币 '+current.gold);
    const options=rows.map(({name,level,injuryGrade,fee,choice})=>{
      const label=dialogText(name,encoding)||'角色';
      return dialogButton(`${label} · 等级 ${level} · ${injuryGrade===0?'健康':'伤势 '+injuryGrade+' 级'} · ${fee} 金币`,()=>send(0,choice));
    });
    mapDialogLines.replaceChildren(...options,dialogButton(`完整治疗 · ${allFee} 金币`,()=>send(0,allChoice)),mapTreatmentBalance);
  }else{
    mapDialogLines.replaceChildren(...dialog.lines.map((line,index)=>{
      const label=dialogText(line,encoding);
      if(dialog.mode===2&&dialog.header>0&&index>=dialog.header&&label)return dialogButton(label,()=>send(0,index-dialog.header+1));
      const row=document.createElement('p');setText(row,label);return row;
    }));
  }
  mapDialogButtons.replaceChildren(...dialog.buttons.map(bit=>dialogButton(mapDialogLabels[bit],()=>send(bit))));
  if(!mapDialog.open)mapDialog.showModal();
  if(dialog.input)mapDialogInput.focus();
}
async function dismissMapDialog(){
  const revision=mapDialogRevision;
  if(revision===null||mapDialogDismiss.disabled)return;
  try{
    if(mapShop)await view.replyMapDialog(revision,2);
    else if(state.client.world.mapDialog.bank||state.client.world.mapDialog.familyPet)await view.replyMapDialog(revision,0);
    else view.dismissMapDialog(revision);
  }catch{if(mapDialogRevision===revision)setText(mapDialogStatus,'无法关闭，请重试。');}
}
mapDialogDismiss.addEventListener('click',dismissMapDialog);
mapDialog.addEventListener('cancel',event=>{event.preventDefault();if(!mapShop?.edit())dismissMapDialog();});
function controls() {
  const busy = preparing || live(); startupInput.disabled = folderInput.disabled = archiveInput.disabled = endpointInput.disabled = busy || !ports;
  pickupMode.hidden=state?.client?.state!=='playing'||state?.canvas?.state!=='running';
  const picking=!pickupMode.hidden&&state.canvas.pickupMode;
  pickupMode.setAttribute('aria-pressed',String(picking));
  setText(pickupMode,picking?'退出交互模式':'交互模式');
  encodingInput.disabled=busy||!ports;labels.disabled=!view||!['playing','paused'].includes(state?.client?.state);labels.textContent=state?.client?.actorLabelMode?'切换标签':'显示标签';bars.disabled=labels.disabled;bars.textContent=state?.client?.actorBarsVisible?'隐藏状态条':'显示状态条';
  party.disabled=labels.disabled||!!state?.client?.world?.craft;party.textContent=state?.client?.world?.partyMode?'离开队伍':'加入队伍';
  const mini=state?.minimap;minimapButton.disabled=labels.disabled;setText(minimapButton,mini?'关闭小地图':'小地图');minimapRange.hidden=!mini;minimapRange.disabled=labels.disabled;
  setText(minimapRange,'范围 '+[107,54,27][mini?.zoom??1]+' 格');setText(minimapStatus,mini?.state==='unavailable'?'小地图资源不可用':mini?.state==='loading'?'正在读取小地图…':'');
  connect.disabled = busy || !ports || startupInput.files.length !== 1 || (folderInput.files.length === 0 && archiveInput.files.length !== 1);
  pause.disabled = !view || !['playing', 'paused','battle-pending'].includes(state?.client?.state); pause.textContent = state?.client?.paused ? '继续' : '暂停';
  returnServers.disabled = !view || state?.client?.paused || !['playing', 'battle-pending'].includes(state?.client?.state);
  returnCity.disabled = !view || !state?.client?.canReturnToCity;
  disconnect.disabled = (!preparing && !live()) || state?.returnTransition?.state === 'running';
  disconnect.textContent = state?.client?.state === 'returning-server' && !state.client.session.manualReturn ? '返回连接设置' : '断开';
}
function renderBattle(next){const pending=next.client?.state==='battle-pending'&&!!next.client?.world?.battle?.pending,live=pending&&!next.client.paused,b=next.battle;battle.hidden=!pending;
  const petInput=b?.inputMode==='mounted'||b?.inputMode==='pet';petPanel.hidden=!pending||!petInput;
  for(const[name,button]of Object.entries(battleButtons)){button.hidden=!!petInput;button.disabled=!live||!b?.ready||petInput||name==='position'&&!b.positionEnabled||name==='pet'&&!b.petEnabled||name==='skill'&&!b.skillEnabled||name==='item'&&!b.itemEnabled;}
  const items=b?.itemPopup;
  const showItems=pending&&!petInput&&items&&(items.state!=='closed'||items.targeting);
  const itemStatus=showItems?(items.targeting?'请选择物品目标':items.state==='opening'?'正在展开物品栏…':
    items.records.length?'选择物品':'背包没有物品'):'';
  itemPanel.hidden=!showItems;
  setText(itemLabel,itemStatus);
  itemClose.disabled=!live||!b?.ready||items?.state!=='ready'&&!items?.targeting;
  removeWeapon.disabled=!live||!items?.weaponRemoval?.enabled;
  const removalReason=items?.weaponRemoval?.reason;
  removeWeapon.title=removalReason==='space'?'背包空位不足':removalReason==='empty'?'没有可卸下的武器':'';
  const usedItems=new Set();
  let itemOrdinal=0;
  for(const item of items?.records??[]){
    usedItems.add(item.slot);
    let button=itemButtons.get(item.slot);
    if(!button){
      const slot=item.slot;
      button=document.createElement('button');
      button.type='button';
      button.dataset.battleItem=String(slot);
      button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattleItem(slot,Number(button.dataset.revision));});
      itemButtons.set(slot,button);
    }
    const previous=itemRows.children[itemOrdinal++];
    if(previous!==button)itemRows.insertBefore(button,previous??null);
    button.dataset.revision=String(item.revision);
    setText(button,item.name+' · '+(item.action==='equip'?'装备':'使用'));
    button.disabled=!live||!item.enabled;
  }
  for(const [slot,button] of itemButtons)if(!usedItems.has(slot)){button.remove();itemButtons.delete(slot);}
  const player=b?.playerPopup,choosingSkill=pending&&!petInput&&!!player&&player.state!=='closed';playerPanel.hidden=!choosingSkill;setText(playerLabel,player?.state==='opening'?'正在展开技能列表…':player?.mode==='levels'?'选择技能等级':'选择人物技能');playerBack.hidden=player?.mode!=='levels';playerBack.disabled=playerClose.disabled=!live||!b?.ready||player?.state!=='ready';
  const usedPlayer=new Set();let playerOrdinal=0;for(const skill of player?.records??[]){usedPlayer.add(skill.slot);let button=playerButtons.get(skill.slot);if(!button){button=document.createElement('button');button.type='button';button.dataset.playerSkill=String(skill.slot);button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattlePlayerSkill(skill.slot);});playerButtons.set(skill.slot,button);playerRows.append(button);}setText(button,skill.name);button.disabled=!live||!skill.enabled;if(playerRows.children[playerOrdinal]!==button)playerRows.insertBefore(button,playerRows.children[playerOrdinal]??null);playerOrdinal++;}
  for(const[slot,button]of playerButtons)if(!usedPlayer.has(slot)){button.remove();playerButtons.delete(slot);}
  const usedLevels=new Set();let levelOrdinal=0;for(const level of player?.levels??[]){usedLevels.add(level.index);let button=levelButtons.get(level.index);if(!button){button=document.createElement('button');button.type='button';button.dataset.playerLevel=String(level.index);button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattlePlayerSkillLevel(level.index);});levelButtons.set(level.index,button);playerLevels.append(button);}setText(button,level.name+' · MP '+level.mpCost);button.title=level.description;button.disabled=!live||!level.enabled;if(playerLevels.children[levelOrdinal]!==button)playerLevels.insertBefore(button,playerLevels.children[levelOrdinal]??null);levelOrdinal++;}
  for(const[index,button]of levelButtons)if(!usedLevels.has(index)){button.remove();levelButtons.delete(index);}
  petWait.disabled=petCancel.disabled=!live||!b?.ready||!petInput;setText(petLabel,b?.inputMode==='mounted'?'骑乘行动 '+Math.min((b?.petCount??0)+1,2)+'/2':'宠物行动');
  const presentSkills=new Set();for(const skill of b?.skills??[]){presentSkills.add(skill.index);let button=skillButtons.get(skill.index);if(!button){button=document.createElement('button');button.type='button';button.dataset.petSkill=String(skill.index);button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattlePetSkill(skill.index);});skillButtons.set(skill.index,button);petSkills.append(button);}setText(button,skill.name+' · MP '+skill.mpCost);button.disabled=!live||!skill.enabled;}
  for(const[index,button]of skillButtons)if(!presentSkills.has(index)){button.remove();skillButtons.delete(index);}
  const popup=b?.petPopup,switching=pending&&!petInput&&popup?.state!=='closed'&&!!popup;switchPanel.hidden=!switching;setText(switchLabel,popup?.state==='opening'?'正在展开宠物列表…':'选择出战宠物');petRecall.disabled=!live||!popup?.recallEnabled;switchClose.disabled=!live||!b?.ready||popup?.state!=='ready';
  const usedPets=new Set();for(const pet of popup?.records??[]){usedPets.add(pet.slot);let button=rosterButtons.get(pet.slot);if(!button){button=document.createElement('button');button.type='button';button.className='battle-actor';button.dataset.petChoice=String(pet.slot);button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattlePet(pet.slot);});rosterButtons.set(pet.slot,button);petRoster.append(button);}setText(button,pet.name+' · HP '+pet.values[0]+'/'+pet.values[1]+' · MP '+pet.values[2]+'/'+pet.values[3]+(pet.mode===2?' · 出战中':''));button.disabled=!live||!pet.enabled;}
  for(const[slot,button]of rosterButtons)if(!usedPets.has(slot)){button.remove();rosterButtons.delete(slot);}
  if(!pending){battleActors.replaceChildren();actorButtons.clear();setText(battleStatus,'');setText(battleCountdown,'');
    setText(inputHint,next.canvas?.pickupMode?'点击或轻触角色进行交互，或拾取附近的地面物品。':'点击或轻触场景移动。右键或交互模式可与角色交互、拾取附近物品。');return;}
  inputHint.textContent='战斗期间使用下方指令与目标按钮。';
  setText(battleStatus,next.client.paused?'已暂停画面与输入':b?.blocked==='resources'?'等待场景资料…':b?.blocked?'当前战斗流程尚未支持，连接保持':b?.ready?(itemStatus?itemStatus:petInput?(b.petStage===3?'请选择技能目标':'请选择宠物技能或待机'):switching?'选择出战宠物或收回当前宠物':choosingSkill?(player.mode==='levels'?'选择技能等级':'选择人物技能'):player?.targeting?'请选择技能目标':b.selected===0?'选择指令或目标':'请选择指令'):b?.mainState===9?'正在返回场景…':b?.phase===2&&b.round>0?'等待下一轮…':b?.phase===4?'等待行动…':b?.phase>=5?'正在处理本轮行动…':'正在进入战斗…');
  setText(battleCountdown,b?.countdown?b.countdown.seconds+' 秒':'');
  const used=new Set();for(const actor of b?.actors??[]){used.add(actor.slot);let row=actorButtons.get(actor.slot);if(!row){const button=document.createElement('button'),name=document.createElement('strong'),values=document.createElement('span');button.type='button';button.className='battle-actor';button.dataset.battleSlot=String(actor.slot);button.append(name,values);button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattleTarget(actor.slot);});row={button,name,values};actorButtons.set(actor.slot,row);battleActors.append(button);}
    row.button.disabled=!live||!actor.eligible;setText(row.name,actor.name+(actor.local?' · 你':''));setText(row.values,'HP '+actor.vitals[0]+'/'+actor.vitals[1]+' · MP '+actor.vitals[2]+'/'+actor.vitals[3]);row.button.setAttribute('aria-label',actor.name+(actor.eligible?'，选择目标':'')+'，'+row.values.textContent);}
  for(const[slot,row]of actorButtons)if(!used.has(slot)){row.button.remove();actorButtons.delete(slot);}
}
function renderSideEffects(effects){
  const timer=effects?.timer;
  gameTime.hidden=!timer?.mode;
  const minutes=Math.floor(Math.max(0,timer?.remainingMilliseconds??0)/60000);
  setText(gameTime,timer?.mode?'剩余时间 '+Math.floor(minutes/60)+' 小时 '+minutes%60+' 分钟':'');
  const version=effects?.chatVersion??0;
  if(version===chatVersion)return;
  const rows=[];
  if(version&&view){
    for(const {text} of view.copyBattleChat()){
      const row=document.createElement('li');
      try{row.textContent=decodeLegacyGameChatText(text,{encoding:encodingInput.value});}
      catch{row.textContent='聊天内容无法按当前编码显示';}
      finally{text.fill(0);}
      rows.push(row);
    }
  }
  chatHistory.replaceChildren(...rows);
  chatHistory.scrollTop=chatHistory.scrollHeight;
  chat.hidden=rows.length===0;
  chatVersion=version;
}
let mapChatVersion=0,mapChatAction=null,mapChatBlockVersion=0,mapChatEndpoint=null;
const drawMapChatOverlay=createMapChatOverlay(byId('game-chat-overlay'),byId('game-chat-announcement-live'),bytes=>{
  try{return decodeLegacyGameDescriptionText(bytes,{encoding:encodingInput.value});}
  catch{return '无法读取此行';}
});
function changeMapChatBlacklist(name,enabled){
  try{
    if(!view?.setMapChatBlockedName(name,enabled)){
      setText(mapChatBlockStatus,enabled?'该角色已在黑名单中。':'该角色已移出黑名单。');
      return false;
    }
    const saved=saveMapChatBlacklist(mapChatEndpoint,view.copyMapChatBlockedNames());
    setText(mapChatBlockStatus,saved?(enabled?'已加入黑名单。':'已移出黑名单。'):'当前会话已更新，浏览器未能保存。');
    return true;
  }catch(error){
    setText(mapChatBlockStatus,error.code==='LEGACY_GAME_CHAT_BLACKLIST_FULL'?'黑名单已满（100 项）。':'请输入编码后最多 16 字节的角色名。');
    return false;
  }
}
function syncMapChatBlacklist(version){
  if(mapChatBlockVersion===version)return;
  const rows=[];
  for(const name of version?view.copyMapChatBlockedNames():[]){
    const row=document.createElement('li'),label=dialogText(name.slice(),encodingInput.value);
    const remove=dialogButton('移除',()=>{
      if(changeMapChatBlacklist(name,false))mapChatBlockName.focus();
    });
    remove.setAttribute('aria-label','移除 '+label);
    row.append(label,remove);rows.push(row);
  }
  mapChatBlocked.replaceChildren(...rows);
  mapChatBlockVersion=version;
}
function syncMapChat(){
  const client=state?.client,world=client?.world,info=world?.mapChat;
  const ended=!client||client.state==='failed'||client.state==='closed';
  const inParty=world?.partyMode===1;
  mapChat.hidden=!['playing','paused','battle-pending'].includes(client?.state);
  mapChatFields.disabled=client?.state!=='playing'||!!world?.mapDialog||
    !!(world?.playerTrade&&world.playerTrade.kind!=='ended')||!!mapChatAction;
  mapChatMode.disabled=!info?.flagsKnown||mapChatFields.disabled;
  mapChatMode.options[1].disabled=!inParty;
  mapChatMode.value=info?.partySelected&&inParty?'party':'ordinary';
  if(ended){
    mapChatAction=null;mapChatInput.value='';setText(mapChatStatus,'');
    mapChatRange.value='1';mapChatColor.value='0';mapChatSize.value='0';
    mapChatBlockName.value='';mapChatBlacklist.open=false;setText(mapChatBlockStatus,'');
  }
  syncMapChatBlacklist(info?.blockedVersion??0);
  const version=info?.version??0;
  if(mapChatVersion===version)return;
  const rows=[];
  if(version){
    for(const {text} of view.copyMapChat()){
      const row=document.createElement('li');
      setText(row,dialogText(text,encodingInput.value));rows.push(row);
    }
  }
  mapChatHistory.replaceChildren(...rows);
  mapChatHistory.hidden=rows.length===0;
  mapChatHistory.scrollTop=mapChatHistory.scrollHeight;
  mapChatVersion=version;
}
async function submitMapChat(party){
  if(!view||mapChatFields.disabled)return;
  const owner=view,token={};mapChatAction=token;
  const draft=mapChatInput.value,options={range:Number(mapChatRange.value),color:Number(mapChatColor.value),size:Number(mapChatSize.value)};
  const current=()=>owner===view&&mapChatAction===token;
  let bytes;
  setText(mapChatStatus,'');syncMapChat();
  try{
    if(party===undefined){
      bytes=encodeLauncherProcessField(draft,{encoding:encodingInput.value});
      await owner.sendMapChat(bytes,options);
      if(current()){mapChatInput.value='';setText(mapChatStatus,'已发送。');}
    }else await owner.setPartyChat(party);
  }catch(error){
    if(current()){
      const messages={LEGACY_GAME_CHAT_TEXT:'请输入一行，编码后最多 76 字节。',LEGACY_GAME_CHAT_MODE:'请等待频道设置同步。',
        LEGACY_GAME_CHAT_RATE:'普通聊天发送过快，三分钟后可再发送。',LEGACY_GAME_CHAT_MUTED:'普通聊天仍在禁言时间内。',
        LEGACY_GAME_DIALOG_TEXT:'请检查聊天内容的编码。'};
      setText(mapChatStatus,messages[error.code]??(error.code?.startsWith('TEXT_')?'当前编码无法发送其中的字符。':'聊天请求未完成。'));
    }
  }finally{
    bytes?.fill(0);
    if(current()){mapChatAction=null;syncMapChat();}
  }
}
byId('game-map-chat-form').addEventListener('submit',event=>{event.preventDefault();submitMapChat();});
mapChatMode.addEventListener('change',()=>submitMapChat(mapChatMode.value==='party'));
byId('game-map-chat-block-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(!view||mapChat.hidden)return;
  let name;
  try{
    name=encodeLauncherProcessField(mapChatBlockName.value,{encoding:encodingInput.value});
    if(changeMapChatBlacklist(name,true))mapChatBlockName.value='';
  }catch{setText(mapChatBlockStatus,'角色名含有当前编码无法使用的字符。');}
  finally{name?.fill(0);}
});
function render(next) {
  state = next; const c = next.client;
  const messages = { idle: '已准备本轮会话', 'loading-resources': '正在读取本地资源…', connecting: '正在连接…', characters: '正在处理人物流程…', choosing: '请选择人物', 'preparing-scene': '正在读取场景…', 'battle-pending':'已收到战斗数据，战斗画面尚不可用，连接保持', playing: '已进入场景', paused: '已暂停画面与输入，连接保持', closed: '连接已结束，请重新选择启动材料', failed: '本轮会话未完成，请核对材料后重新连接' };
  const returning = c?.state === 'returning-server';
  let returnMessage = next.returnTransition?.state === 'running' ? '服务器已结束角色会话。正在退场…' : '服务器已结束角色会话。确认后返回连接设置。';
  if (c?.session?.manualReturn) returnMessage = c.session.manualReturn === 'fading' ? '正在退场…' : '等待服务器确认返回选服…';
  const returnResult = {
    'manual-server-return': '已返回连接设置，请重新选择启动材料',
    'manual-return-rejected': '服务器拒绝返回选服，会话已结束',
    'manual-return-timeout': '返回选服等待超时，会话已结束',
  }[c?.session?.reason];
  const message = returning ? returnMessage : c?.cityReturn ? '正在回城…' : returnResult ??
    (c?.world?.battle?.pending ? (c.paused ? '已暂停画面与输入，连接保持' : next.battle?.blocked === 'resources' ?
      '等待场景资料，连接保持' : next.battle?.blocked ? '当前战斗流程尚未支持，连接保持' : '战斗中') : messages[c?.state] ?? '会话已结束');
  setText(status,next.frameError?'画面无法继续，已结束本轮会话':message);
  if (next.presentations > 0) stage.hidden = false;renderBattle(next);syncInventory();syncFamilyDialog();syncMapDialog();syncPlayerTrade();craftPanel.sync();renderSideEffects(returning?null:c?.world?.battle?.sideEffects);syncMapChat();
  if (c?.state === 'closed' || c?.state === 'failed' || next.state === 'closed') { preparing = false; startupInput.value = ''; folderInput.value = ''; archiveInput.value = ''; setup.open = true; }
  const action=c?.partyAction,blocked={neighbor:'请面向相邻人物后加入队伍',guard:'当前状态无法组队',cooldown:'请稍候再试',facing:'请先确定面向的人物',leader:'当前状态无法加入其他队伍'};
  partyStatus.textContent=c?.state==='battle-pending'?'':!action?'':action.state==='blocked'?(blocked[action.reason]??'当前无法组队'):action.state==='sending'?'正在发送组队请求…':action.state==='sent'?'请求已发送，等待队伍更新':action.state==='rejected'?'服务器未接受本次请求':action.join===0?'服务器已确认离队':c.world.partyMode?'已加入队伍':'服务器已接受请求，等待队伍更新';
  controls();
}
async function begin() {
  if (connect.disabled) return; const serial = ++generation; preparing = true; materialError = false; status.textContent = '正在核对本地启动材料…'; controls();
  let startup, raw, selected, blockedChatNames, audioContext = openLegacyGameAudioContext(() => new AudioContext());
  try {
    const file = startupInput.files[0], archive = archiveInput.files[0], files = [...folderInput.files],encoding=encodingInput.value;if(!['ascii','windows-936'].includes(encoding))throw Error();
    if (!file || file.size < 1 || file.size > 65536 || (!files.length && !archive) || files.length && archive) throw Error();
    raw = new Uint8Array(await file.arrayBuffer()); if (serial !== generation) return;
    let parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)); raw.fill(0); raw = null;
    if (archive) selected = await createBrowserLegacyGameResourceArchive(archive);
    else {
      const roots = new Set(files.map(f => f.webkitRelativePath.split('/')[0]));
      if (roots.size !== 1 || files.some(f => !f.webkitRelativePath.includes('/'))) throw Error();
      selected = createLegacyGameSelectedFiles(files, { rootPrefix: [...roots][0] });
    }
    if (serial !== generation) return;
    startup = await prepareLegacyGameStartup(parsed, selected.port); parsed = null;
    if (serial !== generation) return;
    view?.close(); stage.hidden = true; const selectedEndpoint = ports.endpoints[Number(endpointInput.value)]; if (!selectedEndpoint) throw Error();
    blockedChatNames=readMapChatBlacklist(selectedEndpoint);
    const selectedAudio = audioContext; audioContext = null;
    const next = createBrowserLegacyGameClient({ canvas, pickerRoot: picker, resources: selected, startup, origin: ports.origin, token: ports.token, endpoint: selectedEndpoint, endpoints: ports.endpoints, gameStream: ports.gameStream,
      decodeName: bytes => decodeLauncherProfileName(bytes, { encoding }), encodeName: text => encodeLauncherCredential(text, { encoding }),
      blockedChatNames,onMapChatFrame:drawMapChatOverlay,audioContext:selectedAudio,
      onState: snapshot => { if (serial === generation) render(snapshot); } });
    selected = null; view = next; mapChatEndpoint=selectedEndpoint; preparing = false; startupInput.value = ''; folderInput.value = ''; archiveInput.value = ''; setup.open = false; state = next.inspect(); controls(); await next.start();
  } catch (error) {
    if (serial === generation) {
      view?.close(); preparing = false; materialError = true;
      status.textContent = error?.code === 'LEGACY_CLIENT_STARTUP_MODULE' ? '请在资源中包含指定旧版 cg_se_6000.exe' : '启动材料或资源未通过检查，请重新选择';
      controls();
    }
  }
  finally { closeLegacyGameAudioContext(audioContext); selected?.close(); raw?.fill(0); startup?.close(); for(const name of blockedChatNames??[])name.fill(0); }
}
function close(message) { generation++; preparing = false; view?.close();renderSideEffects(null); state = view?.inspect() ?? null; syncInventory();syncFamilyDialog();syncMapDialog();syncPlayerTrade();craftPanel.sync();syncMapChat(); startupInput.value = ''; folderInput.value = ''; archiveInput.value = ''; setup.open = true; controls(); if (message) status.textContent = message; }
connect.addEventListener('click', begin); disconnect.addEventListener('click', () => { if (!disconnect.disabled) close('已断开，请重新选择启动材料'); });
returnServers.addEventListener('click', () => { if (!returnServers.disabled) view?.requestServerReturn(); });
returnCity.addEventListener('click', () => { if (!returnCity.disabled) view?.requestCityReturn(); });
pause.addEventListener('click', () => { if (!view || pause.disabled) return; if (state.client.paused) view.resume(); else view.pause(); });
pickupMode.addEventListener('click',()=>{if(!pickupMode.hidden)view?.setPickupMode(!state.canvas.pickupMode);});
inventoryToggle.addEventListener('click',()=>{
  if(bag){closeInventory();return;}
  if(inventoryToggle.hidden)return;
  bag={revision:null,rows:[],buttons:new Map(),source:null,destination:null,busy:false,notice:'',mode:null};
  syncInventory();
  inventoryPanel.hidden=false;
  inventoryToggle.setAttribute('aria-expanded','true');
});
inventoryClear.addEventListener('click',()=>{
  if(inventoryClear.disabled)return;
  clearInventorySelection(bag);bag.notice='';renderInventory();
});
inventoryAmount.addEventListener('input',()=>{inventoryMoveAmount.disabled=!bag||bag.busy||!inventoryAmount.validity.valid;});
inventoryUse.addEventListener('click',()=>{
  if(inventoryUse.disabled)return;
  if(bag.source.canUseOnItem){bag.mode='use-on-item';bag.notice='';renderInventory();}
  else void sendInventory('use');
});
inventoryDrop.addEventListener('click',()=>{
  if(inventoryDrop.disabled)return;
  bag.mode='drop';bag.notice='';renderInventory();
});
inventoryDropConfirm.addEventListener('click',()=>{if(!inventoryDropConfirm.disabled)void sendInventory('drop');});
inventoryMove.addEventListener('click',()=>{if(!inventoryMove.disabled)void sendInventory('move');});
inventoryMoveAmount.addEventListener('click',()=>{if(!inventoryMoveAmount.disabled)void sendInventory('move',Number(inventoryAmount.value));});
for(const[name,button]of Object.entries(battleButtons))button.addEventListener('click',()=>{if(view&&!button.disabled)view.chooseBattleCommand(name);});
party.addEventListener('click',async()=>{if(!view||party.disabled)return;try{await view.toggleParty();}catch{close('组队请求未完成，请重新连接');}});
bars.addEventListener('click',()=>{if(!view||bars.disabled)return;try{view.toggleBars();}catch{close('状态条显示未完成，请重新连接');}});
labels.addEventListener('click',()=>{if(!view||labels.disabled)return;try{view.cycleLabels();}catch{close('标签显示未完成，请重新连接');}});
minimapButton.addEventListener('click',()=>{if(view&&!minimapButton.disabled)view.toggleMinimap();});
minimapRange.addEventListener('click',()=>{if(view&&!minimapRange.disabled)view.cycleMinimapRange();});
for (const input of [startupInput, folderInput, archiveInput]) input.addEventListener('change', () => {
  if (input === folderInput && folderInput.files.length) archiveInput.value = '';
  if (input === archiveInput && archiveInput.files.length) folderInput.value = '';
  if (materialError) { status.textContent = '已更换本地材料'; materialError = false; } controls();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && ['playing','battle-pending'].includes(state?.client?.state)) view?.pause(); });
addEventListener('pagehide', () => close());
export function inspectGamePage() { return Object.freeze({ preparing, configured: !!ports, materialError, view: view?.inspect() ?? null }); }
export function copyGamePageWorld() { return view?.copyWorldState() ?? null; }
try {
  const response = await fetch('/runtime.json', { cache: 'no-store' }); if (!response.ok) throw Error(); const value = await response.json();
  if (value.schema !== 'moli.loopback.v3' || value.sourceProfile !== 'legacy' || value.origin !== location.origin || !/^http:\/\/127\.0\.0\.1:[0-9]+$/.test(value.origin)
    || !/^[a-f0-9]{64}$/.test(value.token) || !Array.isArray(value.endpoints) || !value.endpoints.length || value.endpoints.some(e => e.address !== '127.0.0.1' || !Number.isInteger(e.port) || e.port < 1 || e.port > 65535)) throw Error();
  if (value.gameStream !== undefined && typeof value.gameStream !== 'boolean') throw Error();
  ports = { origin: value.origin, token: value.token, gameStream: value.gameStream === true, endpoints: value.endpoints.map(e => ({ address: e.address, port: e.port })) };
  for (const [index, endpoint] of ports.endpoints.entries()) { const option = document.createElement('option'); option.value = String(index); option.textContent = endpoint.address + ':' + endpoint.port; endpointInput.append(option); }
  status.textContent = '选择本地启动材料和资源后连接';
} catch { status.textContent = '本机会话服务不可用，请从项目本地服务打开'; }
controls();

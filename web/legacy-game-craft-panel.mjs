import {createLegacyGameCraftControls} from './legacy-game-craft-controls.mjs';

export function createLegacyGameCraftPanel({open,dialog,content,status,owner,decode,encode}){
  let controls=null,client=null,stamp='';
  const dismiss=dialog.querySelector('#game-craft-dismiss');
  const paragraph=value=>{const p=document.createElement('p');p.textContent=value;return p;};
  const liveParagraph=value=>{const p=paragraph(value);p.setAttribute('role','status');return p;};
  function button(label,action,value,disabled=false){
    const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;
    b.dataset.craftAction=action;b.dataset.craftValue=JSON.stringify(value)??'';
    b.addEventListener('click',()=>controls?.act(action,value));return b;
  }
  function group(label,buttons){
    const section=document.createElement('section'),h=document.createElement('h3'),grid=document.createElement('div');
    h.textContent=label;grid.className='game-craft-grid';grid.append(...buttons);section.append(h,grid);return section;
  }
  function render(){
    const current=owner(),world=current?.state?.client?.world,playing=current?.state?.client?.state==='playing';
    const available=playing&&!world?.mapDialog&&(!world?.playerTrade||world.playerTrade.kind==='ended')&&!current.familyOpen;
    open.disabled=!available||!!world?.craft;
    if(!current?.client||!['playing','paused'].includes(current?.state?.client?.state)){
      controls?.close();controls=null;client=null;stamp='';if(dialog.open)dialog.close();content.replaceChildren();status.textContent='';return;
    }
    if(client!==current.client){controls?.close();client=current.client;controls=createLegacyGameCraftControls({client,decode,encode,notify:render});stamp='';}
    const model=controls.snapshot(playing);
    if(!model){if(dialog.open)dialog.close();stamp='';content.replaceChildren();status.textContent='';return;}
    const next=JSON.stringify(model);
    if(stamp===next)return;stamp=next;
    const focused=dialog.contains(document.activeElement)?document.activeElement:null;
    const focusKey=focused?.dataset?.craftAction,focusValue=focused?.dataset?.craftValue;
    const rows=[],disabled=model.disabled;
    if(model.contextMode===1)rows.push(paragraph('精灵变身已启用'+(model.contextSeconds===null?'':' · 剩余 '+model.contextSeconds+' 秒')));
    if(model.phase==='skills'){
      rows.push(group('选择生产技能',model.skills.map(s=>button(s.name,'skill',s.slot,disabled))));
      if(!model.skills.length)rows.push(paragraph('当前没有可用的生产技能。'));
    }else if(model.phase==='levels'){
      rows.push(group(model.skillName+' · 选择等级',model.levels.map(l=>button(l.name,'level',l.index,l.disabled))));
      if(model.directSkill)rows.push(paragraph('当前魔力 '+(model.mp??'等待同步')));
      if(model.canToggleContext)rows.push(button(model.contextMode?'解除精灵变身':'进行精灵变身','context',undefined,disabled));
      if(model.directRequestSent)rows.push(liveParagraph('技能请求已发送，等待角色状态同步。'));
    }
    else if(model.phase==='recipes'){
      rows.push(group(model.skillName+' · 选择配方',model.recipes.map(r=>button(r.name,'recipe',r.index,r.disabled))));
      if(!model.recipes.length||!model.recipesCurrent)rows.push(paragraph('等待当前技能的配方资料。'));
      rows.push(button('返回技能等级','levels-back',undefined,disabled));
    }else{
      rows.push(paragraph(model.recipeName||model.skillName),paragraph(model.description),paragraph('消耗魔力 '+(model.cost??'选择物品后显示')+' · 当前 '+(model.mp??'等待同步')));
      if(['loading-people','loading-subjects'].includes(model.phase))rows.push(liveParagraph('等待可用目标资料。'));
      else if(model.phase==='people'){
        rows.push(group('选择角色',model.people.map(row=>button(row.name,'person',row.index,disabled))));
        if(!model.people.length)rows.push(paragraph('当前没有可用的角色。'));
      }else if(model.phase==='subjects'){
        rows.push(group('选择角色或宠物',model.subjects.map(row=>button(row.name+' · '+row.detail,'subject',row.index,disabled))));
        if(!model.subjects.length)rows.push(paragraph('当前没有可用的角色或宠物。'));
        rows.push(button('返回角色列表','people-back',undefined,disabled));
      }else if(model.phase==='paused')rows.push(paragraph('已暂停'+model.label+'。'),button('继续'+model.label,'retry',undefined,!model.canRetry));
      else if(model.phase==='materials'){
        if(model.itemWork){
          rows.push(paragraph('选择要'+model.label+'的物品。'));
          rows.push(group('背包物品',model.items.map(i=>button(i.name,'target',{slot:i.slot,revision:i.revision},i.disabled))));
          if(model.target)rows.push(paragraph('已选择：'+model.target.name),button('取消物品选择','remove-target',undefined,disabled));
          if(model.mode==='engrave'){
            const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('input'),save=document.createElement('button');
            input.name='mark';input.type='text';input.maxLength=16;input.value=model.mark;input.disabled=disabled||!model.target;
            label.textContent='刻印文字（编码后最多 16 字节）';label.append(input);save.type='submit';save.textContent='确认刻印文字';save.disabled=disabled||!model.target;
            form.className='game-craft-mark';form.append(label,save);form.addEventListener('submit',event=>{event.preventDefault();void controls?.act('mark',input.value);});
            rows.push(form,paragraph(model.target?.canClearMark?'留空并确认可清除原有刻印。':'确认有效文字后可以刻印。'));
          }
        }else{
        if(model.mode==='decorate')rows.push(paragraph('选择一件可装饰的主体和一件附加品；消耗 100 魔力。'));
        rows.push(group('所需材料',model.materials.map(m=>paragraph((m.fulfilled?'✓ ':'○ ')+m.name+' × '+m.quantity))));
        rows.push(paragraph('先选材料位，再选背包物品。附加材料最多一件。'));
        rows.push(group('材料位',model.positions.map(p=>{
          const box=document.createElement('div');box.className='game-craft-position';
          const choose=button((p.index+1)+' · '+p.name+(p.filled?' × '+p.quantity:''),'position',p.index,p.disabled);
          choose.setAttribute('aria-pressed',String(p.selected));box.append(choose);
          if(p.filled)box.append(button('移除材料 '+(p.index+1),'remove',p.index,disabled));
          if(p.canSwap)box.append(button('交换至此位','swap',{from:model.position,to:p.index},disabled));
          return box;
        })));
        rows.push(group('选择背包材料',model.items.map(i=>button(i.name+' × '+i.quantity,'assign',{slot:i.slot,revision:i.revision},i.disabled))));
        }
        rows.push(button('开始'+model.label,'begin',undefined,!model.canBegin));
      }else if(model.phase==='working')rows.push(liveParagraph('正在'+model.label+'… 剩余 '+model.remainingSeconds+' 秒。'));
      else if(model.phase==='awaiting')rows.push(liveParagraph('请求已发送，等待结果。'));
      else if(model.result){rows.push(...model.result.lines.map(paragraph),button('再次'+model.label,'retry',undefined,!model.canRetry));}
      if(model.gatherContinuing&&model.phase==='result')rows.push(liveParagraph('稍后将继续'+model.label+'，也可暂停。'));
      if(model.canPause)rows.push(button('暂停'+model.label,'pause',undefined,disabled));
    }
    dismiss.disabled=disabled;
    content.replaceChildren(...rows);status.textContent=model.notice;
    if(!dialog.open)dialog.showModal();
    if(focusKey&&content.contains(focused))focused.focus();
    else if(focusKey&&focused!==dismiss){
      const restore=[...content.querySelectorAll('button')].find(b=>b.dataset.craftAction===focusKey&&b.dataset.craftValue===focusValue&&!b.disabled);
      (restore??content.querySelector('button:not(:disabled)')??dismiss).focus();
    }
  }
  open.addEventListener('click',()=>controls?.act('open'));
  dismiss.addEventListener('click',()=>controls?.act('close'));
  dialog.addEventListener('cancel',event=>{event.preventDefault();void controls?.act('close');});
  return Object.freeze({sync:render,close(){controls?.close();controls=null;client=null;stamp='';if(dialog.open)dialog.close();}});
}

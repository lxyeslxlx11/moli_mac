/** Rendered patch review/choice, backed by real configuration and owned candidate bytes. No credential access. */
import { createLauncherPatchState } from './launcher-patch-state.mjs';
import { snapshotLauncherPatchRuntime } from './launcher-patch-source.mjs';
import { createLauncherCatalogPatchPlan } from './launcher-game-patch.mjs';
import { bindLoginPatchCache } from './login-patch-cache.mjs';
export function bindLoginPatchControls({runtime,getSelection,createInput,onChange}) {
  const $=id=>document.getElementById(id),panel=$('game-patch-panel'),fields=$('patch-fields');
  const directory=$('launch-directory'),encoding=$('launch-path-encoding'),folder=$('patch-folder');
  const config=snapshotLauncherPatchRuntime(runtime.gamePatch);
  let locked=true,required=false,selection=null,configured=false;
  let state,cache,cacheBusy=false;
  const status=(text,kind='waiting')=>{$('patch-status').textContent=text;$('patch-status').dataset.kind=kind;};
  function render(snapshot){
    fields.disabled=locked||snapshot.busy||cacheBusy||!configured||!required;
    $('prepare-patch').disabled=fields.disabled||!directory.value;
    $('cancel-patch').disabled=!snapshot.busy;
    $('choose-patch').disabled=locked||cacheBusy||!snapshot.selectable;
    $('discard-patch').disabled=locked||cacheBusy||!snapshot.hasCandidate;
    cache?.render({locked:locked||!configured||!required,busy:snapshot.busy,selected:snapshot.selected});
    $('patch-result').hidden=!snapshot.hasCandidate;
    $('patch-file-list').replaceChildren(...snapshot.files.slice(0,12).map(row=>{const node=document.createElement('li');node.textContent=`${row.path} · ${row.bytes}字节`;return node;}));
    $('patch-summary').textContent=`${snapshot.fileCount}个文件 · ${snapshot.totalBytes}字节 · ${snapshot.updated}项更新 / ${snapshot.current}项已是当前 / ${snapshot.skipped}项跳过`;
    if(snapshot.busy)status(snapshot.phase==='files'?'正在读取本地基文件…':'正在下载并核验补丁候选…');
    else if(snapshot.state==='selected')status('已选择本页补丁候选。资源参数将使用此文件列表；尚未写入安装目录。','success');
    else if(snapshot.state==='ready')status(snapshot.selectable?snapshot.reason==='cache'?'本机资源候选已读入，请核对文件列表并明确选择。':'候选已准备，请核对文件列表并明确选择。':'候选包含跳过条目，请补齐基文件或核对清单后重新准备。',snapshot.selectable?'success':'error');
    else if(snapshot.state==='cancelled')status('准备已取消，未保留部分候选。');
    else if(snapshot.state==='failed'){
      const messages={HTTP_ORIGIN:'该补丁来源未获本地服务许可，未发出请求。',GAME_PATCH_ENDPOINT:'配置未提供补丁来源。',PATCH_FILE_BUDGET:'基文件超过大小预算，请只选择本轮需要的基文件。',GAME_PATCH_TIMEOUT:'准备超过10秒总时限，请重新操作。',HTTP_TIMEOUT:'准备超过10秒总时限，请重新操作。'};
      status(messages[snapshot.errorCode]??'补丁候选未准备：请核对基文件、路径编码及本地补丁服务。','error');
    }else status(snapshot.reason==='discarded'?'已放弃本页候选，请重新准备。':snapshot.reason==='changed'?'配置、目录或基文件已变化，旧候选已清除。':required?'提供目录和可选基文件夹，然后检查补丁。':'当前游戏无需准备补丁。');
  }
  const notify=()=>{const snapshot=state.snapshot();render(snapshot);onChange({...snapshot,busy:snapshot.busy||cacheBusy,phase:cacheBusy?'cache':snapshot.phase});};
  state=createLauncherPatchState({onChange(){notify();}});
  const patchInput=()=>createInput({directoryText:directory.value,pathEncoding:encoding.value,alreadyPatched:false,
    allowedOrigins:config.allowedOrigins,epochSeconds:Math.floor(Date.now()/1000)});
  cache=bindLoginPatchCache({getCurrentBinding:()=>createLauncherCatalogPatchPlan(patchInput()).binding,
    getSelectedResources:()=>state.copySelectedResources(),restore:(resources,binding)=>state.restore(resources,binding),
    onBusy(value){cacheBusy=value;notify();}});
  function refresh(){
    selection=getSelection();required=!!selection?.required;configured=!!config;
    panel.hidden=!configured||!selection||!required;
    if(!panel.hidden)document.querySelector('.launch-details').open=true;
    $('patch-source').textContent=selection?.patchEndpoint?`配置的补丁来源：http://${selection.patchEndpoint.address}:${selection.patchEndpoint.portText}`:'所选区域没有补丁来源。';
    folder.value='';state.reset('changed');cache.reset();
  }
  folder.addEventListener('change',()=>{if(locked||cacheBusy)return;state.reset('changed');cache.reset();});
  $('prepare-patch').addEventListener('click',async()=>{
    if(locked||cacheBusy||!configured||!required)return;
    try{
      const input=patchInput();
      const getter=Object.getOwnPropertyDescriptor(File.prototype,'webkitRelativePath')?.get;if(!getter)throw new Error();
      const entries=Array.from(folder.files,file=>({file,relativePath:Reflect.apply(getter,file,[])}));
      await state.prepare(input,entries);
    }catch{state.reset('changed');status('无法开始准备，请核对当前配置、目录和文件选择。','error');}
  });
  $('cancel-patch').addEventListener('click',()=>state.cancel());
  $('choose-patch').addEventListener('click',()=>{if(!locked&&!cacheBusy)state.choose();});
  $('discard-patch').addEventListener('click',()=>{if(!locked&&!cacheBusy)state.reset('discarded');});
  render(state.snapshot());
  return Object.freeze({refresh,setLocked(value){locked=value;render(state.snapshot());},
    invalidate(){state.reset('changed');cache.reset();},end(){folder.value='';state.reset('page-ended');cache.end();},
    required:()=>configured&&required,ready:()=>!configured||!required||state.snapshot().selected,
    selectedPaths:()=>state.selectedPaths(),snapshot:()=>state.snapshot()});
}

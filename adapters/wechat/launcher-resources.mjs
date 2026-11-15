/** Page-owned resource base/candidate lifecycle. Never writes an installation or runs an executable. */
import { createLauncherResourceSnapshot,launcherResourceBindingKey } from '../../shared/launcher-resources.mjs';
import { LAUNCHER_RESOURCE_CACHE_FORMAT } from '../../shared/launcher-resource-cache.mjs';
import { createWeChatLauncherResourceStore } from './launcher-resource-store.mjs';
import { importLauncherResourceArchive } from '../../shared/launcher-resource-import.mjs';
import { launcherPatchSourceKey } from '../../shared/launcher-patch-route.mjs';
import { createWeChatLauncherCatalogPatchPlan,createWeChatLauncherPatchPreparer,snapshotWeChatLauncherPatchConfig } from './launcher-patch.mjs';
import { readWeChatLauncherFile } from './launcher-local-file.mjs';
import { createWeChatAbortController } from './launcher-control.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
const release=files=>{for(const file of files??[])file.bytes.fill(0);};
export function createWeChatLauncherResources({wx,config,cacheProfile=null,getSelection,isBusy,invalidateInputs,onBusy,onChange}={}){
  if([getSelection,isBusy,invalidateInputs,onBusy,onChange].some(value=>typeof value!=='function'))throw new TypeError('Expected resource host ports.');
  config=snapshotWeChatLauncherPatchConfig(config??null);
  if(cacheProfile!==null&&(!config||typeof cacheProfile!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(cacheProfile)))throw new TypeError('Invalid resource cache profile.');
  let base=[],result=null,sources=[],sourceIndex=-1,state='empty',active=null,generation=0;
  let cached=null,cacheRevision=null,cachePhase=null,store=null;
  const initialCacheStatus=()=>cacheProfile?'资源缓存尚未检查；不会自动保存或恢复。':'未启用资源缓存。';
  let cacheStatus=initialCacheStatus();
  let status=config?'请选择目录中的游戏、区域和资源来源。':'尚未提供资源准备配置。';
  function dropResult(){if(result?.candidate?.files!==base)release(result?.candidate?.files);result=null;}
  function dropBase(){dropResult();release(base);base=[];}
  function dropCached(){release(cached?.files);cached=null;}
  function resetCache(){dropCached();cacheRevision=null;cachePhase=null;cacheStatus=initialCacheStatus();}
  function fixedInput(selection,ordinal){return{...selection,directoryText:config.directoryText,pathEncoding:config.pathEncoding,
    patchSourceProfile:config.patchSourceProfile,patchSourceOrdinal:ordinal,alreadyPatched:false};}
  function snapshot(){const ready=!!config&&sourceIndex>=0&&!!getSelection(),busy=isBusy();
    return Object.freeze({patchEnabled:!!config,patchStatus:status,patchState:state,patchSourceIndex:sourceIndex,
      patchSourceName:sourceIndex>=0?sources[sourceIndex]?.label??'请选择资源来源':'请选择资源来源',
      patchSources:Object.freeze(sources.map(({sourceOrdinal,label},ordinal)=>Object.freeze({ordinal,sourceOrdinal,label}))),
      patchPickerChoices:Object.freeze([{label:'请选择资源来源'},...sources.map(row=>({label:row.label}))]),
      canImportResources:ready&&!busy,canPrepareResources:ready&&!busy,canClearResources:ready&&!busy&&(base.length>0||!!result),
      canSelectResources:state==='ready'&&!busy,resourcesSelected:state==='selected',
      patchFromCache:!!result?.fromCache,
      resourceCacheEnabled:!!cacheProfile,resourceCacheStatus:cacheStatus,resourceCacheRevision:cacheRevision,resourceCachePhase:cachePhase,
      canCheckResourceCache:!!cacheProfile&&ready&&!busy,
      canRestoreResourceCache:!!cacheProfile&&ready&&!busy&&!!cached,
      canSaveResourceCache:!!cacheProfile&&ready&&!busy&&state==='selected'&&cacheRevision!==null&&cacheRevision<LAUNCHER_RESOURCE_CACHE_FORMAT.maximumRevision,
      baseFileCount:base.length,baseBytes:base.reduce((sum,row)=>sum+row.bytes.length,0),
      patchFileCount:result?.candidate?.files.length??0,patchBytes:result?.candidate?.files.reduce((sum,row)=>sum+row.bytes.length,0)??0,
      patchSkippedOperations:result?.candidate?.operations?.filter(row=>row.disposition.startsWith('skipped')).length??0});
  }
  function changed(){onChange();return snapshot();}
  function reset(){generation++;active?.abort();active=null;dropBase();resetCache();state='empty';sourceIndex=-1;sources=[];}
  function selectionChanged(){reset();
    const selection=getSelection();if(config&&selection){try{const plan=createWeChatLauncherCatalogPatchPlan(fixedInput(selection,0));
      if(plan.processPlan.disposition==='patch-requested')sources=plan.patchSources.filter(source=>config.routes.some(route=>launcherPatchSourceKey(route.source)===launcherPatchSourceKey(source)))
        .map(source=>({sourceOrdinal:source.sourceOrdinal,label:source.kind==='native-alternate'?'已证备用来源':'目录声明来源'}));
    }catch{/* A selected catalog without a supported patch plan cannot authorize a request. */}}
    status=!config?'尚未提供资源准备配置。':sources.length?'请明确选择资源来源。':'当前选择没有已配置的资源连接。';changed();
  }
  async function operate(kind){
    if(!(kind==='import'?snapshot().canImportResources:snapshot().canPrepareResources))return snapshot();
    const selection=getSelection(),ordinal=sources[sourceIndex].sourceOrdinal;invalidateInputs();dropResult();
    const id=++generation,control=createWeChatAbortController(),clock=createWeChatDeadlineClock(),deadline=clock.now()+(kind==='import'?60000:10000);active=control;
    state=kind==='import'?'importing':'preparing';status=kind==='import'?'请选择要只读导入的本地资源ZIP。':'正在准备资源候选…';onBusy(true);changed();let bytes,completed;
    const current=()=>id===generation&&active===control&&!control.signal.aborted;
    try{
      if(kind==='import'){
        bytes=await readWeChatLauncherFile({wx,signal:control.signal,clock,extension:'zip'});if(!current())return snapshot();
        const merged=importLauncherResourceArchive(bytes,base);if(clock.now()>=deadline){release(merged);throw Object.assign(new Error(),{code:'RESOURCE_IMPORT_TIMEOUT'});}
        release(base);base=merged;state='base-ready';status=`已读入${base.length}个基础文件，可准备资源候选。`;
      }else{
        const loader=createWeChatLauncherPatchPreparer({wx,routes:config.routes,clock});
        completed=await loader.prepare({...fixedInput(selection,ordinal),files:base,epochSeconds:Math.floor(Date.now()/1000),timeoutMs:10000,signal:control.signal});
        if(!current()){release(completed?.candidate?.files);completed=null;return snapshot();}
        if(!completed.candidate){state='failed';status='当前目录未产生资源候选。';}
        else{result=completed;completed=null;state='ready';status=`资源候选已准备：${result.candidate.files.length}个文件；请明确选择。`;}
      }
    }catch(error){release(completed?.candidate?.files);if(current()){state='failed';status=error?.code==='HTTP_CAPABILITY'?'当前平台不支持所需资源请求能力。'
      :kind==='import'?'资源ZIP未能导入，请核对文件、路径和预算；已有基础文件保留。':'资源准备未完成，请核对所选来源和基础文件后重试。';}}
    finally{bytes?.fill(0);if(id===generation&&active===control){active=null;onBusy(false);changed();}}
    return snapshot();
  }
  function currentBinding(){const selection=getSelection();if(!selection||sourceIndex<0)throw new Error('Choose a resource source.');
    return createWeChatLauncherCatalogPatchPlan(fixedInput(selection,sources[sourceIndex].sourceOrdinal)).binding;}
  async function operateCache(kind){
    if(!(kind==='save'?snapshot().canSaveResourceCache:snapshot().canCheckResourceCache))return snapshot();
    const bindingKey=launcherResourceBindingKey(currentBinding()),expectedRevision=cacheRevision;
    invalidateInputs();dropCached();const id=++generation,control=createWeChatAbortController();active=control;cachePhase=kind;
    cacheStatus=kind==='save'?'正在保存已选择的资源并回读核验…':'正在读取并核验本机资源缓存…';onBusy(true);changed();let selected,saved;
    const current=()=>id===generation&&active===control&&!control.signal.aborted;
    try{
      store??=createWeChatLauncherResourceStore({wx,profile:cacheProfile});
      if(kind==='save'){
        selected=createLauncherResourceSnapshot({binding:result.binding,files:result.candidate.files});
        const receipt=await store.commitResources(selected,{expectedRevision,signal:control.signal});
        if(!current())return snapshot();cacheRevision=receipt.revision;cacheStatus=`资源缓存版本${receipt.revision}已回读核验；来源仍未验证。`;
      }else{
        saved=await store.read({signal:control.signal});if(!current())return snapshot();cacheRevision=saved.revision;
        if(!saved.resources)cacheStatus='资源缓存为空，可明确保存已选择的资源。';
        else if(launcherResourceBindingKey(saved.resources.binding)!==bindingKey)cacheStatus='资源缓存与当前选择不符；不会恢复，可明确保存本次资源替换。';
        else{const recovered=saved.recovered;cached=saved.resources;saved=null;cacheStatus=`已核验资源缓存版本${cacheRevision}${recovered?'，已忽略损坏的另一份记录':''}，请明确恢复${cached.files.length}个文件${cached.files.length?'':'（空列表）'}。`;}
      }
    }catch(error){if(current()){cacheRevision=null;cacheStatus=error?.code==='RESOURCE_CACHE_COMMIT_UNKNOWN'?'本次保存结果尚不确定，请重新检查资源缓存。'
      :error?.code==='RESOURCE_CACHE_CONFLICT'?'资源缓存版本已变化，请重新检查。':error?.code==='RESOURCE_CACHE_BUSY'?'资源缓存仍在处理，请稍后重新检查。':'资源缓存操作未完成，请核对存储和当前选择后重新检查。';}}
    finally{release(selected?.files);release(saved?.resources?.files);if(id===generation&&active===control){active=null;cachePhase=null;onBusy(false);changed();}}
    return snapshot();
  }
  function restoreCache(){
    if(!snapshot().canRestoreResourceCache)return false;
    if(launcherResourceBindingKey(cached.binding)!==launcherResourceBindingKey(currentBinding())){resetCache();changed();return false;}
    invalidateInputs();generation++;dropBase();base=cached.files;
    result={binding:cached.binding,candidate:{files:base,operations:null},fromCache:true};cached=null;
    state='ready';status='缓存资源已恢复为本页候选，请核对并明确选择。';cacheStatus='已恢复所检查的资源；可以作为下一次补丁的基础文件。';changed();return true;
  }
  return Object.freeze({snapshot,selectionChanged,
    chooseSource(index){if(isBusy()||!Number.isInteger(index)||index< -1||index>=sources.length)return false;
      invalidateInputs();generation++;dropBase();resetCache();sourceIndex=index;state='empty';status=index<0?'请明确选择资源来源。':'来源已选择，可导入基础资源或准备候选。';changed();return index>=0;},
    importBase:()=>operate('import'),prepare:()=>operate('prepare'),
    checkCache:()=>operateCache('check'),saveCache:()=>operateCache('save'),restoreCache,
    clear(){if(isBusy())return false;invalidateInputs();generation++;dropBase();resetCache();state='empty';status='本页基础资源和候选已清空。';changed();return true;},
    select(){if(!snapshot().canSelectResources)return false;state='selected';status=cacheProfile?'资源候选已选择，可明确保存到本机；当前选择保留在本页内存。':'资源候选已选择，仍只保留在本页内存。';changed();return true;},
    copySelectedResources(){if(state!=='selected'||!result?.candidate)throw new Error('Select a complete resource candidate first.');return createLauncherResourceSnapshot({binding:result.binding,files:result.candidate.files});},
    hide(){const wasActive=!!active,saving=cachePhase==='save';selectionChanged();if(saving)cacheStatus='本次保存已取消，写入结果需重新检查。';status=config?'本页资源和候选已清空，请重新选择来源。':'尚未提供资源准备配置。';if(wasActive)onBusy(false);changed();},
  });
}

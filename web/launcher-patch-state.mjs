/** Page-local candidate ownership and generation control. No credentials or persistent storage. */
import { prepareLauncherGamePatch } from './launcher-game-patch.mjs';
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
import { readLauncherPatchFiles } from './launcher-patch-files.mjs';
import { createLauncherResourceSnapshot, readLauncherResourceSnapshot, launcherResourceBindingKey } from '../shared/launcher-resources.mjs';
import { applyGamePatchCandidates } from '../shared/game-patch.mjs';
const fill=Uint8Array.prototype.fill;
function release(result){
  for(const row of result?.candidate?.files??[])Reflect.apply(fill,row.bytes,[0]);
  for(const operation of result?.candidate?.manifest?.operations??[])for(const field of operation.fields){Reflect.apply(fill,field.keyBytes,[0]);Reflect.apply(fill,field.valueBytes,[0]);}
  for(const value of Object.values(result?.processPlan??{}))if(value instanceof Uint8Array)Reflect.apply(fill,value,[0]);
}
export function createLauncherPatchState({prepare=prepareLauncherGamePatch,readFiles=readLauncherPatchFiles,onChange=()=>{}}={}) {
  let generation=0,operation=null,result=null,state='idle',reason=null,errorCode=null,phase=null;
  function snapshot(){
    const files=result?.candidate?.files??[],operations=result?.candidate?.operations??[];
    const skipped=operations.filter(row=>!['updated','current'].includes(row.disposition)).length+(result?.candidate?.manifest?.skippedBlocks.length??0);
    return Object.freeze({state,phase,reason,errorCode,busy:!!operation,hasCandidate:!!result?.candidate,selectable:state==='ready'&&!!result?.candidate&&skipped===0,
      selected:state==='selected',fileCount:files.length,totalBytes:files.reduce((total,row)=>total+row.bytes.length,0),
      updated:operations.filter(row=>row.disposition==='updated').length,current:operations.filter(row=>row.disposition==='current').length,skipped,
      files:Object.freeze(files.map(row=>Object.freeze({path:row.path,bytes:row.bytes.length}))),binding:result?.binding??null});
  }
  const notify=()=>onChange(snapshot());
  function reset(why='changed'){
    generation++;operation?.controller.abort();operation=null;release(result);result=null;state='idle';reason=why;errorCode=null;phase=null;notify();
  }
  return Object.freeze({snapshot,reset,
    cancel(){if(!operation)return;reset('cancelled');state='cancelled';notify();},
    choose(){if(!snapshot().selectable)throw new Error('No complete candidate is ready.');state='selected';reason=null;notify();},
    selectedPaths(){return state==='selected'?Object.freeze(result.candidate.files.map(row=>row.path)):null;},
    copySelectedResources(){
      if(state!=='selected')throw new Error('Choose a complete candidate first.');
      return createLauncherResourceSnapshot({binding:result.binding,files:result.candidate.files});
    },
    restore(resources,expectedBinding){
      reset('restore');let owned;
      try{
        owned=readLauncherResourceSnapshot(resources);
        if(launcherResourceBindingKey(owned.binding)!==launcherResourceBindingKey(expectedBinding))throw Object.assign(new Error(),{code:'RESOURCE_BINDING'});
        const candidate=applyGamePatchCandidates({manifestBytes:new Uint8Array(),files:owned.files,archives:[]});
        result={binding:owned.binding,candidate};state='ready';reason='cache';notify();return snapshot();
      }catch(error){state='failed';errorCode=typeof error?.code==='string'?error.code:'RESOURCE_INPUT';notify();return snapshot();}
      finally{for(const row of owned?.files??[])Reflect.apply(fill,row.bytes,[0]);}
    },
    async prepare(input,entries){
      if(operation)throw new Error('Preparation already running.');
      reset('prepare');const op={id:generation,controller:new AbortController()};operation=op;state='preparing';phase='files';reason=null;notify();
      const deadline=performance.now()+10000;let files,completed;
      const remaining=()=>{const value=Math.ceil(deadline-performance.now());if(value<1)throw Object.assign(new Error(),{code:'GAME_PATCH_TIMEOUT'});return value;};
      const current=()=>operation===op&&generation===op.id&&!op.controller.signal.aborted;
      try{
        // All configuration scalars and catalogs are captured before asynchronous file reads.
        const fixed={...input,catalogs:snapshotLauncherCatalogCandidate(input.catalogs),allowedOrigins:[...input.allowedOrigins]};
        files=await readFiles(entries,{signal:op.controller.signal,timeoutMs:remaining()});if(!current())return snapshot();
        phase='download';notify();
        completed=await prepare({...fixed,files,signal:op.controller.signal,timeoutMs:remaining(),alreadyPatched:false});
        if(!current()){release(completed);completed=null;return snapshot();}
        remaining();result=completed;completed=null;operation=null;state=result.candidate?'ready':'failed';phase=null;
        if(!result.candidate)errorCode='PATCH_NO_CANDIDATE';notify();return snapshot();
      }catch(error){
        release(completed);
        if(current()){operation=null;state='failed';phase=null;errorCode=typeof error?.code==='string'&&/^[A-Z_0-9]{1,64}$/.test(error.code)?error.code:'PATCH_PREPARE_FAILED';notify();}
        return snapshot();
      }finally{for(const row of files??[])Reflect.apply(fill,row.bytes,[0]);}
    },
  });
}

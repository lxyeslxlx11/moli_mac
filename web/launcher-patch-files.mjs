/** Explicit browser Blob/File base inputs. Own bounded bytes only; no upload or filesystem write. */
import { GAME_PATCH_LIMITS, applyGamePatchCandidates } from '../shared/index.mjs';
export class LauncherPatchFileError extends Error {
  constructor(code) { super('Patch base files could not be read within the selected profile.'); this.name='LauncherPatchFileError';this.code=code; }
}
const fail=code=>{throw new LauncherPatchFileError(code);};
const blobSize=Object.getOwnPropertyDescriptor(Blob.prototype,'size').get,blobSlice=Blob.prototype.slice,blobRead=Blob.prototype.arrayBuffer;
const bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
const aborted=Object.getOwnPropertyDescriptor(AbortSignal.prototype,'aborted').get;
const own=(value,key)=>{let d;try{d=Object.getOwnPropertyDescriptor(value,key);}catch{fail('PATCH_FILE_INPUT');}if(!d||!Object.hasOwn(d,'value'))fail('PATCH_FILE_INPUT');return d.value;};
export async function readLauncherPatchFiles(entries,{signal,timeoutMs=10000}={}) {
  if(!Array.isArray(entries)||entries.length>GAME_PATCH_LIMITS.files||!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)fail('PATCH_FILE_INPUT');
  if(signal!==undefined){try{Reflect.apply(aborted,signal,[]);}catch{fail('PATCH_FILE_INPUT');}}
  let root,total=0;const files=[],metadata=[];
  // Complete metadata snapshot, budgets and path validation precede the first read.
  for(let i=0;i<entries.length;i++){
    const row=own(entries,String(i)),relativePath=own(row,'relativePath'),file=own(row,'file');let size;
    try{size=Reflect.apply(blobSize,file,[]);}catch{fail('PATCH_FILE_INPUT');}
    if(typeof relativePath!=='string'||relativePath.length>4096||/[\\\x00-\x1f]/.test(relativePath))fail('PATCH_FILE_PATH');
    const parts=relativePath.split('/');if(parts.length<2||parts.some(part=>!part||part==='.'||part==='..'))fail('PATCH_FILE_PATH');
    if(root===undefined)root=parts[0];else if(root!==parts[0])fail('PATCH_FILE_PATH');
    if(size>GAME_PATCH_LIMITS.fileBytes||(total+=size)>GAME_PATCH_LIMITS.totalBytes)fail('PATCH_FILE_BUDGET');
    metadata.push({path:parts.slice(1).join('/'),file,size});
  }
  applyGamePatchCandidates({manifestBytes:new Uint8Array(),files:metadata.map(({path})=>({path,bytes:new Uint8Array()})),archives:[]});
  const deadline=performance.now()+timeoutMs;let stopped,rejectStop;
  const stop=code=>{if(stopped)return;stopped=new LauncherPatchFileError(code);rejectStop(stopped);};
  const stopping=new Promise((_,reject)=>{rejectStop=reject;});stopping.catch(()=>{});
  const cancel=()=>stop('PATCH_FILE_ABORTED'),timer=setTimeout(()=>stop('PATCH_FILE_TIMEOUT'),timeoutMs);
  const check=()=>{if(performance.now()>=deadline)stop('PATCH_FILE_TIMEOUT');if(signal!==undefined&&Reflect.apply(aborted,signal,[]))cancel();if(stopped)throw stopped;};
  try{
    signal?.addEventListener('abort',cancel,{once:true});check();
    for(const row of metadata){
      check();const slice=Reflect.apply(blobSlice,row.file,[0,row.size]);
      const pending=Reflect.apply(blobRead,slice,[]).then(buffer=>{
        if(stopped){new Uint8Array(buffer).fill(0);throw stopped;}return buffer;
      });
      const buffer=await Promise.race([pending,stopping]);check();
      if(Reflect.apply(bufferLength,buffer,[])!==row.size||Reflect.apply(blobSize,row.file,[])!==row.size)fail('PATCH_FILE_READ');
      files.push(Object.freeze({path:row.path,bytes:new Uint8Array(buffer)}));
    }
    check();return Object.freeze(files);
  }catch(error){for(const row of files)row.bytes.fill(0);if(error?.code)throw error;fail('PATCH_FILE_READ');}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel);}
}

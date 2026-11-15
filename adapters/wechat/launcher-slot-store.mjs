/** Complete two-slot callback store shared by catalog/resource adapters. Writes retain payload and context lock until native completion. */
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { weChatSignal } from './launcher-control.mjs';
const locks = new Map(), bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function sameBytes(a,b) { if (a.length !== b.length) return false; for(let i=0;i<a.length;i++) if(a[i]!==b[i]) return false; return true; }
function optionsSnapshot(value,writing,fail){
  const allowed=writing?['timeoutMs','signal','expectedRevision']:['timeoutMs','signal'],result={};
  try{if(!value||typeof value!=='object'||Array.isArray(value)||Reflect.ownKeys(value).some(name=>!allowed.includes(name)))fail('INPUT');
    for(const name of allowed){const field=Object.getOwnPropertyDescriptor(value,name);if(!field)continue;
      if(!Object.hasOwn(field,'value'))fail('INPUT');result[name]=field.value;}
  }catch{fail('INPUT');}
  return Object.freeze(result);
}
export function createWeChatSlotStore({ wx,profile,format,codec,ErrorClass,prefix,clock = createWeChatDeadlineClock() } = {}) {
  if (typeof ErrorClass !== 'function' || !['CACHE_','RESOURCE_CACHE_'].includes(prefix)) throw new TypeError('Invalid internal store error contract.');
  const makeError = code => new ErrorClass(prefix + code), fail = code => { throw makeError(code); };
  if (!format || typeof format.directory !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(format.directory) || !Number.isInteger(format.minimumBytes) || format.minimumBytes < 1
      || !Number.isInteger(format.recordBytes) || format.recordBytes < format.minimumBytes || format.recordBytes > 68157488
      || !Number.isSafeInteger(format.maximumRevision) || format.maximumRevision < 1 || format.maximumRevision > Number.MAX_SAFE_INTEGER - 1
      || !Number.isInteger(format.timeoutMs) || format.timeoutMs < 1 || format.timeoutMs > 60000
      || !codec || ['snapshot','encode','decode','release'].some(name => typeof codec[name] !== 'function')) fail('INPUT');
  if (typeof profile !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(profile)) fail('INPUT');
  let fs,root;
  try { root=wx.env.USER_DATA_PATH; fs=wx.getFileSystemManager(); } catch { fail('UNAVAILABLE'); }
  if (typeof root !== 'string' || root.length < 1 || root.length > 2048 || /[\0\r\n]/.test(root)
      || !fs || ['readdir','stat','readFile','mkdir','writeFile'].some(name=>typeof fs[name]!=='function')) fail('UNAVAILABLE');
  if(!clock||['now','setTimer','clearTimer'].some(name=>typeof clock[name]!=='function'))fail('INPUT');
  root=root.replace(/\/+$/,''); if(!root) fail('UNAVAILABLE');
  const directory=root+'/'+format.directory, lockKey=directory+'\0'+profile, names=[profile+'.a.bin',profile+'.b.bin'];
  async function operate(writing,candidate,options = {}) {
    const fixed=optionsSnapshot(options,writing,fail),timeoutMs=fixed.timeoutMs??format.timeoutMs,expectedRevision=fixed.expectedRevision;
    if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000) fail('INPUT');
    if(writing && (!Number.isSafeInteger(expectedRevision)||expectedRevision<0
        || expectedRevision>=format.maximumRevision)) fail('INPUT');
    let external;try{external=weChatSignal(fixed.signal);}catch{fail('INPUT');}
    if(external?.aborted()) fail('ABORTED');
    let started;try{started=clock.now();}catch{fail('INPUT');}
    if(!Number.isSafeInteger(started)||started<0||!Number.isSafeInteger(started+timeoutMs))fail('INPUT');
    if(locks.has(lockKey)) fail('BUSY');
    const token={};locks.set(lockKey,token);
    let stopped, timer, rejectStop, writeIssued=false, writePending=false, returned=false, payload, owned, rows=[];
    const deadline=started+timeoutMs, stopPromise=new Promise((resolve,reject)=>{rejectStop=reject;});stopPromise.catch(()=>{});
    const unlock=()=>{if(locks.get(lockKey)===token)locks.delete(lockKey);};
    function stop(code){if(stopped)return;stopped=makeError(writeIssued?'COMMIT_UNKNOWN':code);rejectStop(stopped);}
    function check(){if(clock.now()>=deadline)stop('TIMEOUT');if(stopped)throw stopped;}
    const abort=()=>stop(clock.now()>=deadline?'TIMEOUT':'ABORTED');
    function releaseRead(name,result){if(name!=='readFile')return;
      try{Reflect.apply(bufferLength,result?.data,[]);new Uint8Array(result.data).fill(0);}catch{/* No owned ordinary ArrayBuffer was returned. */}}
    function invoke(name,input){check();const pending=new Promise((resolve,reject)=>{
      try{fs[name]({...input,success:result=>{if(stopped||returned){releaseRead(name,result);reject(stopped??makeError('STORAGE'));return;}resolve(result);},fail:()=>reject(makeError(writeIssued?'COMMIT_UNKNOWN':'STORAGE'))});}
      catch{reject(makeError(writeIssued?'COMMIT_UNKNOWN':'STORAGE'));}
    });return Promise.race([pending,stopPromise]).then(result=>{try{check();return result;}catch(error){releaseRead(name,result);throw error;}});}
    async function entries(dirPath){const result=await invoke('readdir',{dirPath});
      if(!Array.isArray(result?.files)||result.files.length>4096||result.files.some(name=>typeof name!=='string'||name.length>512)) fail('STORAGE');
      return result.files;
    }
    async function readSlot(index){
      const filePath=directory+'/'+names[index],first=await invoke('stat',{path:filePath,recursive:false}),stat=first?.stats;
      if(!stat||typeof stat.isFile!=='function'||!stat.isFile()||!Number.isInteger(stat.size)||stat.size<format.minimumBytes||stat.size>format.recordBytes) return {index,corrupt:true};
      const length=stat.size;let result=await invoke('readFile',{filePath,position:0,length}),bytes;
      try{if(Reflect.apply(bufferLength,result?.data,[])!==length)return{index,corrupt:true};bytes=new Uint8Array(new Uint8Array(result.data));}
      catch{return{index,corrupt:true};}
      finally{releaseRead('readFile',result);result=null;}
      try{const last=(await invoke('stat',{path:filePath,recursive:false}))?.stats;
        if(!last||typeof last.isFile!=='function'||!last.isFile()||last.size!==length){bytes.fill(0);return{index,corrupt:true};}
        let record;try{record=codec.decode(bytes);}catch{bytes.fill(0);return{index,corrupt:true};}
        return{index,bytes,record};
      }catch(error){bytes.fill(0);throw error;}
    }
    function nativeWrite(filePath){
      check();writeIssued=writePending=true;
      const pending=new Promise((resolve,reject)=>{let completed=false;
        function finish(ok){if(completed)return;completed=true;writePending=false;
          if(returned){payload?.fill(0);payload=null;unlock();}
          if(ok)resolve();else reject(makeError('COMMIT_UNKNOWN'));
        }
        try{fs.writeFile({filePath,data:payload.buffer,success:()=>finish(true),fail:()=>finish(false)});}catch{finish(false);}
      });return Promise.race([pending,stopPromise]).then(()=>check());
    }
    try{
      timer=clock.setTimer(()=>stop('TIMEOUT'),timeoutMs);external?.add(abort);if(external?.aborted())abort();check();
      if(writing){try{owned=codec.snapshot(candidate);}catch{fail('CANDIDATE');}check();}
      const rootNames=await entries(root),hasDirectory=rootNames.includes(format.directory);
      const files=hasDirectory?await entries(directory):[];
      for(let i=0;i<2;i++)if(files.includes(names[i])){rows.push(await readSlot(i));check();}
      const valid=rows.filter(row=>row.record),corruptSlots=rows.length-valid.length;
      if(!valid.length&&rows.length)fail('CORRUPT');
      valid.sort((a,b)=>b.record.revision-a.record.revision);
      if(valid.length===2&&valid[0].record.revision===valid[1].record.revision&&!sameBytes(valid[0].bytes,valid[1].bytes))fail('CONFLICT');
      const current=valid[0],revision=current?.record.revision??0;
      if(!writing){let value;
        try{value=current?codec.snapshot(current.record.value):null;check();
          return Object.freeze({revision,value,recovered:corruptSlots>0,corruptSlots,trust:'unverified'});}
        catch(error){codec.release(value);throw error;}}
      if(revision!==expectedRevision)fail('CONFLICT');
      payload=codec.encode({revision:revision+1,value:owned});check();
      if(!hasDirectory)await invoke('mkdir',{dirPath:directory,recursive:true});
      const target=current?1-current.index:0,filePath=directory+'/'+names[target];
      await nativeWrite(filePath);
      const confirmed=await readSlot(target);rows.push(confirmed);check();
      if(!confirmed.record||confirmed.record.revision!==revision+1||!sameBytes(confirmed.bytes,payload))fail('COMMIT_UNKNOWN');
      return Object.freeze({revision:revision+1,committed:true,recovered:corruptSlots>0,verification:'readback-in-this-context',
        durability:'unverified',trust:'unverified'});
    }catch(error){
      if(stopped)throw stopped;
      if(writeIssued)throw makeError('COMMIT_UNKNOWN');
      if(error instanceof ErrorClass)throw error;
      throw makeError('STORAGE');
    }finally{
      returned=true;try{clock.clearTimer(timer);}catch{/* Continue owned cleanup. */}external?.remove(abort);codec.release(owned);
      for(const row of rows){row.bytes?.fill(0);codec.release(row.record?.value);}
      if(!writePending){payload?.fill(0);payload=null;unlock();}
    }
  }
  return Object.freeze({read:options=>operate(false,undefined,options),commit:(catalogs,options)=>operate(true,catalogs,options)});
}

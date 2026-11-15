/** Original native-shaped filesystem facade. Optional real files are confined to its freshly created test directory. */
import * as disk from 'node:fs/promises';
import { resolve } from 'node:path';
let serial=0;
const arrayBuffer=value=>Uint8Array.from(value).buffer;
export async function weChatCacheFixture({ real=false }={}){
  const parent=resolve('build/analysis/launcher-wechat-cache-v1');
  if(real)await disk.mkdir(parent,{recursive:true});
  const root=real?await disk.mkdtemp(parent+'/original-fs-'):'wxfile://original-cache-'+(++serial);
  const files=new Map(),directories=new Set([root]),stats={calls:[],writes:[],reads:[],pendingWrites:[]},controls={holdWrite:false,failReaddir:false};
  async function list(path){if(real)return disk.readdir(path);if(!directories.has(path))throw Error('Original missing directory');
    const prefix=path+'/';return [...new Set([...directories,...files.keys()].filter(name=>name.startsWith(prefix)).map(name=>name.slice(prefix.length).split('/')[0]).filter(Boolean))];}
  async function stat(path){if(real){const value=await disk.stat(path);return{size:value.size,isFile:()=>value.isFile()};}
    if(files.has(path))return{size:files.get(path).length,isFile:()=>true};if(directories.has(path))return{size:0,isFile:()=>false};throw Error('Original missing file');}
  async function read(path,position,length){if(real){const file=await disk.open(path,'r');try{const bytes=Buffer.alloc(length),result=await file.read(bytes,0,length,position);return Uint8Array.from(bytes.subarray(0,result.bytesRead));}finally{await file.close();}}
    if(!files.has(path))throw Error('Original missing file');return files.get(path).slice(position,position+length);}
  async function write(path,bytes){if(real){if(!path.startsWith(root+'/'))throw Error('Unexpected fixture path');await disk.writeFile(path,bytes);}else files.set(path,Uint8Array.from(bytes));}
  async function mkdir(path){if(real){if(!path.startsWith(root+'/'))throw Error('Unexpected fixture path');await disk.mkdir(path,{recursive:true});}else directories.add(path);}
  const settle=(options,work)=>queueMicrotask(async()=>{try{options.success(await work());}catch{options.fail?.({errMsg:'original private filesystem detail'});}});
  async function finishWrite(index=stats.pendingWrites.length-1,{partial,fail=false}={}){
    const pending=stats.pendingWrites[index];if(!pending||pending.done)return;pending.done=true;
    try{const bytes=new Uint8Array(pending.options.data);await write(pending.options.filePath,partial===undefined?bytes:bytes.subarray(0,partial));
      if(fail)pending.options.fail({errMsg:'original private quota or write error'});else pending.options.success({});}
    catch{pending.options.fail({errMsg:'original private write error'});}
  }
  const fs={
    readdir(options){stats.calls.push({method:'readdir',path:options.dirPath});settle(options,async()=>{if(controls.failReaddir)throw Error();return{files:await list(options.dirPath)};});},
    stat(options){stats.calls.push({method:'stat',path:options.path});settle(options,async()=>({stats:await stat(options.path)}));},
    readFile(options){stats.reads.push({filePath:options.filePath,position:options.position,length:options.length});stats.calls.push({method:'readFile',path:options.filePath});
      settle(options,async()=>({data:arrayBuffer(await read(options.filePath,options.position,options.length))}));},
    mkdir(options){stats.calls.push({method:'mkdir',path:options.dirPath});settle(options,async()=>{await mkdir(options.dirPath);return{};});},
    writeFile(options){stats.calls.push({method:'writeFile',path:options.filePath});stats.writes.push(options.filePath);const index=stats.pendingWrites.push({options,done:false})-1;
      if(!controls.holdWrite)queueMicrotask(()=>{void finishWrite(index);});},
  };
  return{root,fs,stats,controls,wx:{env:{USER_DATA_PATH:root},getFileSystemManager:()=>fs},finishWrite,
    async put(name,bytes){const path=name.startsWith(root+'/')?name:root+'/'+name,parent=path.slice(0,path.lastIndexOf('/'));if(parent!==root)await mkdir(parent);await write(path,bytes);return path;},
    async raw(name){const path=root+'/'+name,value=await stat(path);return read(path,0,value.size);},
    async close(){if(real)await disk.rm(root,{recursive:true,force:true});},
  };
}

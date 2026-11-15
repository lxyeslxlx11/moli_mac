/** Read-only user ZIP to owned resource base; same path/tree/budgets as existing game patch candidates. */
import { decodeGamePatchArchive } from './launcher-update.mjs';
import { applyGamePatchCandidates } from './game-patch.mjs';
import { GamePatchError } from './game-patch-data.mjs';
import { gamePatchPath as path,gamePatchKey as key,validateGamePatchTree as validateTree } from './game-patch-paths.mjs';
const fail=()=>{throw new GamePatchError('PATCH_PATH_ALIAS','Imported resource paths are duplicated or ambiguous.');};
export function importLauncherResourceArchive(archive,files){
  const base=applyGamePatchCandidates({manifestBytes:new Uint8Array(),files,archives:[]}).files;let decoded;
  try{decoded=decodeGamePatchArchive(archive);const extracted=new Map(),directories=new Set();
    for(const row of decoded.entries){let name='';for(const byte of row.entry.nameBytes)name+=String.fromCharCode(byte);
      const entryPath=path(row.entry.directory?name.replace(/[\\/]$/,''):name);
      if(key(extracted,entryPath)!==null||directories.has(entryPath.toLowerCase()))fail();
      if(row.entry.directory)directories.add(entryPath.toLowerCase());else extracted.set(entryPath,row.payloadBytes);
    }
    validateTree(extracted);
    const merged=new Map(base.map(row=>[row.path,row.bytes]));
    for(const [name,bytes]of extracted){if(key(merged,name)!==null)fail();merged.set(name,bytes);}
    for(const directory of directories){let current=directory;while(current){if(key(merged,current)!==null)fail();const at=current.lastIndexOf('/');if(at<0)break;current=current.slice(0,at);}}
    validateTree(merged);return applyGamePatchCandidates({manifestBytes:new Uint8Array(),files:[...merged].map(([path,bytes])=>({path,bytes})),archives:[]}).files;
  }finally{for(const row of base)row.bytes.fill(0);for(const row of decoded?.entries??[])row.payloadBytes.fill(0);}
}

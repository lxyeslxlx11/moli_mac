/** Read-only slices of explicitly selected browser Files; no picker or automatic filesystem access. */
import { assetFail,assetFields,assetPath,assetKey,assetInteger } from '../shared/legacy-game-resource-values.mjs';
export function createLegacyGameSelectedFiles(values,options){
 const settings=options===undefined?{}:assetFields(options,[],['rootPrefix']);let prefix=settings.rootPrefix??null;
 if(prefix!==null){if(typeof prefix!=='string'||prefix.length<1||prefix.length>255||/[\x00-\x1f:*?"<>|]/.test(prefix))assetFail('LEGACY_ASSET_ROOT');prefix=prefix.replace(/\\/g,'/');if(prefix.split('/').some(p=>!p||p==='.'||p==='..'))assetFail('LEGACY_ASSET_ROOT');}
 if(!values||typeof values[Symbol.iterator]!=='function')assetFail('LEGACY_ASSET_FILES');const files=new Map();let state='open';
 for(const value of values){if(files.size>=65536)assetFail('LEGACY_ASSET_FILES_BUDGET');let path=value.webkitRelativePath||value.name;if(typeof path!=='string'||path.length>1024)assetFail('LEGACY_ASSET_PATH');path=path.replace(/\\/g,'/');if(prefix!==null){if(!path.toLowerCase().startsWith(prefix.toLowerCase()+'/'))assetFail('LEGACY_ASSET_ROOT');path=path.slice(prefix.length+1);}path=assetPath(path);const key=assetKey(path);
  if(files.has(key)||typeof value.slice!=='function'||!Number.isSafeInteger(value.size)||value.size<0||value.size>0xffffffff)assetFail('LEGACY_ASSET_FILE_ALIAS');files.set(key,value);}
 for(const key of files.keys()){let at=key.indexOf('/');while(at>=0){if(files.has(key.slice(0,at)))assetFail('LEGACY_ASSET_FILE_ALIAS');at=key.indexOf('/',at+1);}}
 const active=()=>{if(state!=='open')assetFail('LEGACY_ASSET_FILES_CLOSED');};
 // The selected root is explicit: directory names are never guessed or stripped.
 const stat=async path=>{active();return files.get(assetKey(path))?.size??null;};
 const read=async(path,offset,length)=>{active();assetInteger(offset);assetInteger(length,0,33554432);const file=files.get(assetKey(path));if(!file||offset>file.size||length>file.size-offset)assetFail('LEGACY_ASSET_FILE_RANGE');const raw=await file.slice(offset,offset+length).arrayBuffer();active();if(raw.byteLength!==length)assetFail('LEGACY_ASSET_SHORT_READ');return new Uint8Array(raw);};
 return Object.freeze({port:Object.freeze({stat,read}),inspect(){return Object.freeze({state,files:files.size,access:'selected-read-only'});},close(){state='closed';files.clear();}});
}

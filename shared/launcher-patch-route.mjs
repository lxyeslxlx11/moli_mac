/** Original explicit transport binding and native resource URI subset. No network or source authentication. */
import { gamePatchPath } from './game-patch-paths.mjs';
export class LauncherPatchRouteError extends Error {
  constructor(code='PATCH_ROUTE_INPUT'){super('Patch transport binding is invalid.');this.name='LauncherPatchRouteError';this.code=code;}
}
const fail=code=>{throw new LauncherPatchRouteError(code);};
export function ownPatchRouteFields(value,names){
  if(!value||typeof value!=='object'||Array.isArray(value)||Reflect.ownKeys(value).length!==names.length||Reflect.ownKeys(value).some(key=>!names.includes(key)))fail();
  const result={};for(const name of names){const field=Object.getOwnPropertyDescriptor(value,name);if(!field||!Object.hasOwn(field,'value'))fail();result[name]=field.value;}return result;
}
export function snapshotLauncherPatchSource(value){
  const {address,portText}=ownPatchRouteFields(value,['address','portText']);
  if(typeof address!=='string'||!address.length||address.length>253||!/^[A-Za-z0-9.-]+$/.test(address)
      ||address.split('.').some(part=>!part.length||part.length>63||!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(part))
      ||typeof portText!=='string'||!/^[0-9]{1,5}$/.test(portText)||Number(portText)<1||Number(portText)>65535)fail();
  return Object.freeze({address,portText});
}
export const launcherPatchSourceKey=value=>JSON.stringify([value.address,value.portText]);
export function launcherPatchRouteId(value){if(typeof value!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(value))fail();return value;}
export function inspectLauncherPatchResourcePath(value){
  if(typeof value!=='string'||value.length>4096||/[\x00-\x20\x7f#%\\]/.test(value))fail('PATCH_ROUTE_PATH');
  const pieces=value.split('?');if(pieces.length!==2)fail('PATCH_ROUTE_PATH');const [path,query]=pieces;
  const manifest=path==='/cg50/Update.TXT',match=/^(t|time)=(0|[1-9][0-9]{0,9})$/.exec(query);
  if(!match||match[1]!== (manifest?'t':'time')||Number(match[2])>0x7fffffff)fail('PATCH_ROUTE_PATH');
  if(!manifest){if(!path.startsWith('/cg50/')||!path.endsWith('.bz2'))fail('PATCH_ROUTE_PATH');
    let relative=path.slice(6,-4);if(relative.startsWith('/'))relative=relative.slice(1);
    try{if(gamePatchPath(relative)!==relative)fail('PATCH_ROUTE_PATH');}catch{fail('PATCH_ROUTE_PATH');}}
  return Object.freeze({kind:manifest?'catalog':'package',epochSeconds:Number(match[2])});
}

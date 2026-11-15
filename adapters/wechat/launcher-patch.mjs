/** Native HTTPS bridge is explicit and tied to the selected declared source; no implicit upgrade/fallback. */
import { createLauncherCatalogPatchPlan, createLauncherGamePatchPreparer } from '../../shared/launcher-game-patch.mjs';
import { PUK3_PATCH_SOURCE_PROFILE } from '../../shared/launcher-patch-sources.mjs';
import { localDirectoryPath } from '../../shared/local-paths.mjs';
import { decodeLauncherCatalogText } from '../../shared/launcher-catalog-text.mjs';
import { LAUNCHER_TEXT_ENCODINGS } from '../../shared/launcher-text.mjs';
import { ownPatchRouteFields, snapshotLauncherPatchSource,launcherPatchSourceKey,launcherPatchRouteId,inspectLauncherPatchResourcePath } from '../../shared/launcher-patch-route.mjs';
import { snapshotWeChatHttpOrigins,createWeChatLauncherHttpClient } from './launcher-http.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { createWeChatAbortController,weChatSignal } from './launcher-control.mjs';
const decodeText=(bytes,encoding)=>decodeLauncherCatalogText(bytes,{encoding});
export function snapshotWeChatLauncherPatchConfig(value){
  if(value===null)return null;
  const input=ownPatchRouteFields(value,['directoryText','pathEncoding','patchSourceProfile','routes']);
  if(!LAUNCHER_TEXT_ENCODINGS.includes(input.pathEncoding)||!['configured-only',PUK3_PATCH_SOURCE_PROFILE.id].includes(input.patchSourceProfile)
      )throw new TypeError('Invalid patch configuration.');
  return Object.freeze({directoryText:localDirectoryPath(input.directoryText),pathEncoding:input.pathEncoding,patchSourceProfile:input.patchSourceProfile,routes:snapshotWeChatLauncherPatchRoutes(input.routes)});
}
export function snapshotWeChatLauncherPatchRoutes(values){
  if(!Array.isArray(values)||values.length<1||values.length>2)throw new TypeError('Invalid patch route list.');
  const sources=new Set(),ids=new Set(),routes=Array.from({length:values.length},(_,i)=>{
    const field=Object.getOwnPropertyDescriptor(values,String(i));if(!field||!Object.hasOwn(field,'value'))throw new TypeError('Invalid patch route.');
    const route=ownPatchRouteFields(field.value,['source','origin','id']),source=snapshotLauncherPatchSource(route.source),origin=snapshotWeChatHttpOrigins([route.origin])[0],id=launcherPatchRouteId(route.id),key=launcherPatchSourceKey(source);
    if(sources.has(key)||ids.has(origin+'/'+id))throw new TypeError('Ambiguous patch route.');sources.add(key);ids.add(origin+'/'+id);return Object.freeze({source,origin,id});
  });
  return Object.freeze(routes);
}
export function createWeChatLauncherCatalogPatchPlan(input){return createLauncherCatalogPatchPlan(input,{decodeText,callerProfile:'win32-current'});}
export function createWeChatLauncherPatchPreparer({wx,routes,clock=createWeChatDeadlineClock()}={}){
  // Snapshot with the same exact route validator, independent of later caller mutation.
  const fixed=snapshotWeChatLauncherPatchRoutes(routes);
  return createLauncherGamePatchPreparer({decodeText,callerProfile:'win32-current',now:clock.now,setTimer:clock.setTimer,clearTimer:clock.clearTimer,
    createAbortController:createWeChatAbortController,readSignal:weChatSignal,
    clientForSource(source){const key=launcherPatchSourceKey(source),route=fixed.find(row=>launcherPatchSourceKey(row.source)===key);
      if(!route)throw Object.assign(new Error('No explicitly configured source route.'),{code:'PATCH_ROUTE_SOURCE'});
      const client=createWeChatLauncherHttpClient({wx,allowedOrigins:[route.origin],clock}),base=route.origin+'/moli-patch/v1/'+route.id;
      const urlForPath=path=>{inspectLauncherPatchResourcePath(path);return base+path;};
      return Object.freeze({urlForPath,getBytes:(path,options)=>client.getBytes(urlForPath(path),options)});
    }});
}

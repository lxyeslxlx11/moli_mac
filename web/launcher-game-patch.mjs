/** Browser defaults over the shared catalog-bound patch plan and sequential byte executor. */
import { createLauncherCatalogPatchPlan as plan, createLauncherGamePatchPreparer, ownLauncherPatchInput as own,
  LauncherGamePatchError } from '../shared/launcher-game-patch.mjs';
import { createLauncherHttpClient } from './launcher-http.mjs';
export { LauncherGamePatchError } from '../shared/launcher-game-patch.mjs';
const decodeText=(bytes,encoding)=>new TextDecoder(encoding,{fatal:true}).decode(bytes);
export function createLauncherCatalogPatchPlan(input){return plan(input,{decodeText,callerProfile:own(input,'callerProfile','legacy',true)});}
function readSignal(value){if(value===undefined)return null;
  try{const getter=Object.getOwnPropertyDescriptor(AbortSignal.prototype,'aborted').get;Reflect.apply(getter,value,[]);
    return{aborted:()=>Reflect.apply(getter,value,[]),add:fn=>value.addEventListener('abort',fn,{once:true}),remove:fn=>value.removeEventListener('abort',fn)};
  }catch{throw new LauncherGamePatchError('GAME_PATCH_INPUT','Expected an actual AbortSignal.');}}
const ports=Object.freeze({decodeText,now:()=>performance.now(),setTimer:(fn,ms)=>setTimeout(fn,ms),clearTimer:token=>clearTimeout(token),
  createAbortController:()=>new AbortController(),readSignal,
  clientForSource(source,input){let origin;try{origin=new URL(`http://${source.address}:${source.portText}`).origin;}catch{throw new LauncherGamePatchError('GAME_PATCH_ENDPOINT','Configured patch endpoint is not an HTTP origin.');}
    const client=createLauncherHttpClient({allowedOrigins:own(input,'allowedOrigins'),fetchImpl:own(input,'fetchImpl',globalThis.fetch,true)});
    return Object.freeze({urlForPath:path=>origin+path,getBytes:(path,options)=>client.getBytes(origin+path,options)});
  }});
export async function prepareLauncherGamePatch(input){return createLauncherGamePatchPreparer({...ports,callerProfile:own(input,'callerProfile','legacy',true)}).prepare(input);}

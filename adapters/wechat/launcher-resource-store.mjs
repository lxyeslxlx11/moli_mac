/** Explicit profile resource cache. The two-slot codec does not execute or install cached contents. */
import { encodeLauncherResourceCacheRecord,decodeLauncherResourceCacheRecord,LAUNCHER_RESOURCE_CACHE_FORMAT } from '../../shared/launcher-resource-cache.mjs';
import { readLauncherResourceSnapshot } from '../../shared/launcher-resources.mjs';
import { createWeChatSlotStore } from './launcher-slot-store.mjs';
export const WECHAT_RESOURCE_STORE=Object.freeze({directory:'moli-launcher-resources-v1',timeoutMs:10000,maximumTimeoutMs:60000,entries:4096});
export class WeChatResourceStoreError extends Error {
  constructor(code){super('Local resource cache operation could not complete.');this.name='WeChatResourceStoreError';this.code=code;}
}
const codec=Object.freeze({snapshot:readLauncherResourceSnapshot,
  encode:({revision,value})=>encodeLauncherResourceCacheRecord({revision,resources:value}),
  decode(bytes){const record=decodeLauncherResourceCacheRecord(bytes);return{revision:record.revision,value:record.resources};},
  release(value){for(const row of value?.files??[])row.bytes.fill(0);},
});
export function createWeChatLauncherResourceStore({wx,profile,clock}={}){
  const store=createWeChatSlotStore({wx,profile,clock,format:{...WECHAT_RESOURCE_STORE,
    minimumBytes:50,recordBytes:LAUNCHER_RESOURCE_CACHE_FORMAT.recordBytes,maximumRevision:LAUNCHER_RESOURCE_CACHE_FORMAT.maximumRevision},
    codec,ErrorClass:WeChatResourceStoreError,prefix:'RESOURCE_CACHE_'});
  return Object.freeze({async read(options){const{value,...saved}=await store.read(options);return Object.freeze({...saved,resources:value});},
    commitResources:(resources,options)=>store.commit(resources,options)});
}

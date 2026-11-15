/** Catalog-specific binding over the existing complete two-slot lifecycle. Public API/format/error codes remain unchanged. */
import { encodeLauncherCatalogCacheRecord, decodeLauncherCatalogCacheRecord, snapshotPortableLauncherCatalogs,
  LAUNCHER_CATALOG_CACHE_FORMAT } from '../../shared/launcher-catalog-cache.mjs';
import { createWeChatSlotStore } from './launcher-slot-store.mjs';
export const WECHAT_CATALOG_STORE = Object.freeze({ directory:'moli-launcher-catalog-v1',timeoutMs:10000,maximumTimeoutMs:60000,entries:4096 });
export class WeChatCatalogStoreError extends Error {
  constructor(code) { super('Local catalog cache operation could not complete.'); this.name = 'WeChatCatalogStoreError'; this.code = code; }
}
const codec = Object.freeze({
  snapshot: snapshotPortableLauncherCatalogs,
  encode: ({revision,value}) => encodeLauncherCatalogCacheRecord({revision,catalogs:value}),
  decode(bytes) { const record=decodeLauncherCatalogCacheRecord(bytes);return{revision:record.revision,value:record.catalogs}; },
  release(value) { value?.gameListBytes.fill(0);value?.regionListBytes.fill(0); },
});
export function createWeChatLauncherCatalogStore({wx,profile,clock}={}) {
  const store=createWeChatSlotStore({wx,profile,clock,format:{...WECHAT_CATALOG_STORE,
    minimumBytes:46,recordBytes:LAUNCHER_CATALOG_CACHE_FORMAT.recordBytes,maximumRevision:LAUNCHER_CATALOG_CACHE_FORMAT.maximumRevision},
    codec,ErrorClass:WeChatCatalogStoreError,prefix:'CACHE_'});
  return Object.freeze({async read(options){const {value,...saved}=await store.read(options);return Object.freeze({...saved,catalogs:value});},
    commitPair:(catalogs,options)=>store.commit(catalogs,options)});
}

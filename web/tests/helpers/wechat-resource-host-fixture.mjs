/** Entirely original host inputs, private file facade, loopback metadata/relay/upstream. */
import { readFileSync } from 'node:fs';
import { weChatPatchFixture } from './wechat-patch-fixture.mjs';
import { createWeChatHttpFixture,weChatBootstrapConfig,WECHAT_LOCAL_LAUNCHER } from './wechat-http-fixture.mjs';
import { weChatCacheFixture } from './wechat-cache-fixture.mjs';
import { weChatHostConfig } from './wechat-host-fixture.mjs';
const packs=JSON.parse(readFileSync(new URL('../../../analysis/launcher-wechat-patch-v1/original-resources.json',import.meta.url)));
export async function weChatResourceHostFixture({real=false,stableSource=false}={}){
  const patch=await weChatPatchFixture('sequential-create-append',{declaredSource:stableSource?{address:'patch-source.invalid',portText:'80'}:null}),metadata=await createWeChatHttpFixture(),files=await weChatCacheFixture({real});
  const gameListBytes=patch.catalogs.gameListBytes,regionText=Buffer.from(patch.catalogs.regionListBytes).toString().replace('Port="9000">127.0.0.1</BIP>','Port="12345">fixture.invalid</BIP>'),regionListBytes=Buffer.from(regionText);
  metadata.routes.set('/gameList',{body:Buffer.from(gameListBytes)});metadata.routes.set('/regionList',{body:regionListBytes});
  const exe=await files.put('original-launcher.exe',WECHAT_LOCAL_LAUNCHER),zip=await files.put('original-resource.zip',Buffer.from(packs.cases.base,'hex'));
  const state={holdChoice:false,pendingChoice:null};
  const wx={...metadata.wx,...files.wx,request(options){return new URL(options.url).pathname.startsWith('/moli-patch/')?patch.native.wx.request(options):metadata.wx.request(options);},
    chooseMessageFile(options){if(state.holdChoice){state.pendingChoice=options;return;}const path=options.extension[0]==='zip'?zip:exe;
      const size=options.extension[0]==='zip'?packs.cases.base.length/2:WECHAT_LOCAL_LAUNCHER.length;queueMicrotask(()=>options.success({tempFiles:[{path,size}]}));}};
  const settings={directoryText:'C:\\Original\\Client',pathEncoding:'ascii',patchSourceProfile:'configured-only',routes:[patch.route]};
  return{patch,metadata,files,state,wx,settings,
    config(extra={}){return weChatHostConfig({gameListXml:null,regionListXml:null,bootstrap:weChatBootstrapConfig(),patch:settings,...extra});},
    async close(){await patch.close();await metadata.close();await files.close();}};
}

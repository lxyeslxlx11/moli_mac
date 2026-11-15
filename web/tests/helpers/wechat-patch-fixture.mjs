/** Owned upstream -> fixed relay -> native-shaped HTTP. HTTPS fixture name is not actual TLS/WeChat. */
import { request as httpRequest } from 'node:http';
import assert from 'node:assert/strict';
import { createLocalLauncherPatchRelay } from '../../../adapters/node/launcher-patch-relay.mjs';
import { createGamePatchFixture,patchCatalogs } from './launcher-game-patch-fixture.mjs';
import { snapshotPortableLauncherCatalogs } from '../../../shared/launcher-catalog-cache.mjs';
import { computeLauncherFileMd5 } from '../../../shared/launcher-manifest.mjs';
const buffer=value=>Uint8Array.from(value).buffer;
export function nativePatchHttp(port){
  const active=new Set(),stats={requests:[],aborts:0,listeners:0};
  const wx={getAppBaseInfo:()=>({SDKVersion:'3.2.2'}),getDeviceInfo:()=>({platform:'devtools'}),
    request(options){const url=new URL(options.url);assert.equal(url.origin,'https://fixture.invalid');assert.equal(options.redirect,'manual');assert.equal(options.responseType,'arraybuffer');
      stats.requests.push(url.pathname+url.search);let headerListener,chunkListener;
      const request=httpRequest({host:'127.0.0.1',port,method:'GET',path:url.pathname+url.search},response=>{
        const header=Object.fromEntries(Object.entries(response.headers).filter(([,value])=>typeof value==='string'));
        headerListener?.({statusCode:response.statusCode,header});response.on('data',data=>chunkListener?.({data:buffer(data)}));
        response.on('end',()=>options.success({data:new ArrayBuffer(0),statusCode:response.statusCode,header}));response.on('error',options.fail);
      });active.add(request);request.on('close',()=>active.delete(request));request.on('error',options.fail);request.end();
      return{abort(){stats.aborts++;request.destroy();},onHeadersReceived(fn){headerListener=fn;stats.listeners++;},offHeadersReceived(fn){if(headerListener===fn){headerListener=null;stats.listeners--; }},
        onChunkReceived(fn){chunkListener=fn;stats.listeners++;},offChunkReceived(fn){if(chunkListener===fn){chunkListener=null;stats.listeners--;}}};
    }};
  return{wx,stats,close(){for(const request of active)request.destroy();}};
}
export async function weChatPatchFixture(scenario='sequential-create-append',{declaredSource=null}={}){
  const upstream=await createGamePatchFixture(scenario),source=declaredSource??{address:'127.0.0.1',portText:String(upstream.port)};
  const fetchImpl=declaredSource?async(url,options)=>{const parsed=new URL(url),expected=new URL(`http://${source.address}:${source.portText}`).origin;assert.equal(parsed.origin,expected);
    const response=await fetch(upstream.origin+parsed.pathname+parsed.search,options);
    // Test-only DNS alias: body/status/headers from owned source, no unrelated loopback final URL.
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers:response.headers});}:undefined;
  const relay=await createLocalLauncherPatchRelay({routes:[{id:'original',source}],fetchImpl}),native=nativePatchHttp(relay.port),raw=patchCatalogs(upstream.port,{code:'11'});
  if(declaredSource){raw.regionListBytes=Buffer.from(Buffer.from(raw.regionListBytes).toString().replace('<PIP>127.0.0.1</PIP>',`<PIP>${source.address}</PIP>`).replace(`<PPort>${upstream.port}</PPort>`,`<PPort>${source.portText}</PPort>`));raw.regionListMd5=computeLauncherFileMd5(raw.regionListBytes);}
  const catalogs=snapshotPortableLauncherCatalogs(raw);
  const route={source,origin:'https://fixture.invalid',id:'original'};
  return{upstream,relay,native,catalogs,route,
    input(extra={}){return{catalogs,gameOrdinal:0,referenceOrdinal:0,directoryText:'C:\\Original\\Client',pathEncoding:'ascii',alreadyPatched:false,
      files:upstream.scenario.files,epochSeconds:1234567890,...extra};},
    async close(){native.close();await relay.close();await upstream.close();}};
}

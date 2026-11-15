/** Read-only, startup-fixed source relay. No account headers, arbitrary target parameter, file writes or public deployment. */
import { createServer } from 'node:http';
import { createLauncherHttpClient } from '../../web/launcher-http.mjs';
import { ownPatchRouteFields,snapshotLauncherPatchSource,launcherPatchRouteId,inspectLauncherPatchResourcePath } from '../../shared/launcher-patch-route.mjs';
export function createLauncherPatchRelayHandler({routes,allowedBrowserOrigins=[],fetchImpl=globalThis.fetch}={}){
  if(!Array.isArray(routes)||routes.length<1||routes.length>16)throw new TypeError('Supply fixed relay routes.');
  const fixed=new Map();
  for(const value of routes){const row=ownPatchRouteFields(value,['id','source']),id=launcherPatchRouteId(row.id),source=snapshotLauncherPatchSource(row.source);
    if(fixed.has(id))throw new TypeError('Duplicate relay route.');
    const url=new URL(`http://${source.address}:${source.portText}`);if(url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new TypeError('Invalid fixed source.');
    const client=createLauncherHttpClient({allowedOrigins:[url.origin],fetchImpl});fixed.set(id,Object.freeze({origin:url.origin,client}));
  }
  if(!Array.isArray(allowedBrowserOrigins)||allowedBrowserOrigins.length>16)throw new TypeError('Invalid browser origin list.');
  const browserOrigins=new Set(allowedBrowserOrigins.map(value=>{const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.origin!==value||url.username||url.password)throw new TypeError('Invalid browser origin.');return value;}));
  return async function handler(req,res){
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'");
    const end=status=>{if(!res.headersSent)res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8'});if(!res.destroyed)res.end(status===204?'':'Resource request unavailable.');};
    const origin=req.headers.origin;
    if(origin!==undefined){if(typeof origin!=='string'||!browserOrigins.has(origin)){req.resume();end(403);return;}res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
    if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET');res.setHeader('Access-Control-Allow-Headers','Accept');req.resume();end(204);return;}
    if(req.method!=='GET'){req.resume();end(405);return;}
    const match=typeof req.url==='string'&&req.url.length<=4096&&/^\/moli-patch\/v1\/([A-Za-z0-9_-]{1,32})(\/.*)$/.exec(req.url);
    if(!match||!fixed.has(match[1])){end(404);return;}
    let resource;try{resource=inspectLauncherPatchResourcePath(match[2]);}catch{end(400);return;}
    const route=fixed.get(match[1]),control=new AbortController();let response;
    const disconnect=()=>{if(!res.writableFinished)control.abort();};req.on('aborted',disconnect);res.on('close',disconnect);
    try{
      response=await route.client.getBytes(route.origin+match[2],{kind:resource.kind,signal:control.signal,timeoutMs:10000});
      if(control.signal.aborted||res.destroyed)return;
      res.writeHead(200,{'Content-Type':'application/octet-stream','Content-Length':String(response.bytes.length)});
      await new Promise(resolve=>{const complete=()=>{res.off('finish',complete);res.off('close',complete);resolve();};res.once('finish',complete);res.once('close',complete);res.end(response.bytes);});
    }catch{if(!res.destroyed)end(control.signal.aborted?499:502);}
    finally{req.off('aborted',disconnect);res.off('close',disconnect);response?.bytes.fill(0);}
  };
}
export async function createLocalLauncherPatchRelay(options){
  const handler=createLauncherPatchRelayHandler(options),server=createServer((req,res)=>{handler(req,res).catch(()=>{if(!res.headersSent)res.writeHead(500);res.end();});});
  server.requestTimeout=15000;server.headersTimeout=10000;
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return Object.freeze({origin:`http://127.0.0.1:${server.address().port}`,port:server.address().port,
    async close(){server.closeAllConnections();await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}});
}

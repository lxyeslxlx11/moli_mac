/** Original catalogs, ZIPs and loopback HTTP only; no executable or official payload. Also serves an ESM browser harness. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { computeLauncherFileMd5 } from '../../../shared/index.mjs';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const vectors = JSON.parse(await readFile(resolve(root, 'analysis/launcher-v26/original-patch-vectors.json'), 'utf8'));
const bytes = hex => Uint8Array.from(Buffer.from(hex,'hex'));
export const utf8 = value => new TextEncoder().encode(value);
export function originalPatchScenario(name = 'sequential-create-append') {
  const row = vectors.scenarios.find(row => row.name === name);
  return { manifestBytes:bytes(row.manifest_hex), files:row.files.map(file => ({ path:file.path, bytes:bytes(file.hex) })),
    archives:row.archives.map(archive => ({ blockOrdinal:archive.blockOrdinal, bytes:bytes(archive.hex) })),
    expectedFiles:row.expected_files.map(file => ({ path:file.path, bytes:bytes(file.hex) })) };
}
export function patchCatalogs(port, { patcher = 'patch.exe', code = '0011', endpoint = true } = {}) {
  const games = utf8('<Gamelist><Head><Version>original-patch-1</Version></Head><Games>'
    + `<Game Code="${code}"><Name>Original Patch A</Name><EXE>client.exe</EXE>${patcher ? `<PatchEXE>${patcher}</PatchEXE>` : ''}<Regions><Region>Original Local</Region></Regions></Game>`
    + '<Game Code="11"><Name>Original Patch B</Name><EXE>other.exe</EXE><PatchEXE>other.exe</PatchEXE><Regions><Region>Original Local</Region></Regions></Game>'
    + '</Games></Gamelist>');
  const regions = utf8('<Regionlist><Head><Version>original-patch-1</Version></Head><Regions><Region Code="71"><Name>Original Local</Name>'
    + '<BList><BIP Port="9000">127.0.0.1</BIP></BList>' + (endpoint ? `<PIP>127.0.0.1</PIP><PPort>${port}</PPort>` : '')
    + '<Arglist><Args Gamecode="11"> original </Args></Arglist></Region></Regions></Regionlist>');
  return { gameListBytes:games, regionListBytes:regions, gameListMd5:computeLauncherFileMd5(games), regionListMd5:computeLauncherFileMd5(regions), encoding:'utf-8', allowBareAmpersands:false };
}
export async function createGamePatchFixture(name = 'sequential-create-append') {
  const scenario = originalPatchScenario(name), overrides = new Map(), timers = new Set(), requests = [];let browserOrigin=null;
  const bodies = new Map([['/cg50/Update.TXT', scenario.manifestBytes]]);
  for (const archive of scenario.archives) bodies.set(name === 'sequential-create-append' ? archive.blockOrdinal === 0 ? '/cg50/Bin/first.bin.bz2' : '/cg50/Bin/final.bin.bz2' : '/cg50/Bin/new.bin.bz2', archive.bytes);
  const web = new Set(['launcher-game-patch.mjs','launcher-catalog-data.mjs','launcher-http.mjs','launcher-http-data.mjs']);
  const server = createServer(async (req,res) => {
    const path = new URL(req.url,'http://127.0.0.1').pathname; requests.push({ method:req.method, url:req.url });
    if(req.headers.origin){
      if(req.headers.origin!==browserOrigin){res.writeHead(403);res.end();return;}
      res.setHeader('Access-Control-Allow-Origin',browserOrigin);res.setHeader('Vary','Origin');
    }
    res.setHeader('Cache-Control','no-store'); res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'");
    if (path === '/harness') { res.setHeader('Content-Type','text/html'); res.end('<!doctype html><html><meta charset="utf-8"><title>Original game patch harness</title><body>Original ESM patch harness</body></html>'); return; }
    if (path === '/favicon.ico') { res.writeHead(204);res.end();return; }
    if (path.startsWith('/shared/') || (path.startsWith('/web/') && web.has(path.slice(5)))) {
      const file = resolve(root,'.'+path);
      if (!file.endsWith('.mjs') || (path.startsWith('/shared/') && !file.startsWith(resolve(root,'shared')+sep))) { res.writeHead(404);res.end();return; }
      try { const data = await readFile(file);res.setHeader('Content-Type','text/javascript');res.end(data); } catch { res.writeHead(404);res.end(); } return;
    }
    const override = overrides.get(path) ?? {}, body = override.body ?? bodies.get(path);
    if (body === undefined) { res.writeHead(404);res.end();return; }
    const send = () => {
      if (res.destroyed) return;
      res.writeHead(override.status ?? 200, { 'Content-Type':'application/octet-stream', ...(override.headers ?? {}) });
      if (override.bodyDelayMs) {
        const cut = Math.max(1, Math.floor(body.length/2)); res.write(body.subarray(0,cut));
        const timer = setTimeout(() => { timers.delete(timer);if (!res.destroyed) res.end(body.subarray(cut)); },override.bodyDelayMs);timers.add(timer);
      } else res.end(body);
    };
    if (override.delayMs) { const timer = setTimeout(() => { timers.delete(timer);send(); },override.delayMs);timers.add(timer); } else send();
  });
  await new Promise((yes,no) => { server.once('error',no);server.listen(0,'127.0.0.1',yes); });
  const port = server.address().port, origin = `http://127.0.0.1:${port}`;
  return { origin, port, scenario, requests,
    allowBrowserOrigin(value){const url=new URL(value);if(url.origin!==value||url.protocol!=='http:'||url.hostname!=='127.0.0.1')throw new TypeError('Expected exact original browser origin.');browserOrigin=value;},
    input(changes = {}) { return { catalogs:patchCatalogs(port), gameOrdinal:0, referenceOrdinal:0, directoryText:'C:\\Original Folder\\Client', pathEncoding:'ascii', alreadyPatched:false,
      allowedOrigins:[origin], files:scenario.files, epochSeconds:1234567890, ...changes }; },
    set(path,value) { overrides.set(path,value); }, reset() { overrides.clear();requests.length=0; },
    async close() { for (const timer of timers) clearTimeout(timer);timers.clear();const done=new Promise((yes,no) => server.close(error => error ? no(error) : yes()));server.closeAllConnections();await done; } };
}

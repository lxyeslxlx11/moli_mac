/** Original valid catalogs and packages served on an ephemeral loopback port only. */
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { makeSyntheticLauncher } from '../../launcher-fixture.mjs';
const root = fileURLToPath(new URL('../../../', import.meta.url)), utf8 = text => new TextEncoder().encode(text);
const source = makeSyntheticLauncher(), hash = data => createHash('md5').update(data).digest('hex');
const zip = JSON.parse(await readFile(resolve(root, 'analysis/launcher-v11/original-update-vectors.json'), 'utf8')).cases[1];
export const BOOTSTRAP_FIXTURES = Object.freeze({ launcher: utf8('Original bootstrap identity\0'),
  oldGames: utf8(source.games.replace('original-demo-1', 'old-games-1')), newGames: utf8(source.games.replace('original-demo-1', 'new-games-2')),
  oldRegions: utf8(source.regions.replace('original-demo-1', 'old-regions-1')), newRegions: utf8(source.regions.replace('original-demo-1', 'new-regions-2')),
  packageBytes: Uint8Array.from(Buffer.from(zip.archive_hex, 'hex')), packageMd5: zip.expected.md5 });
export function bootstrapCandidate(games = BOOTSTRAP_FIXTURES.newGames, regions = BOOTSTRAP_FIXTURES.newRegions) {
  return { gameListBytes: games, regionListBytes: regions, gameListMd5: hash(games), regionListMd5: hash(regions), encoding: 'utf-8', allowBareAmpersands: false };
}
export async function createLauncherBootstrapFixture() {
  const overrides = new Map(), requests = [], timers = new Set(); let origin;
  const webModules = new Set(['launcher-http.mjs', 'launcher-http-data.mjs', 'launcher-bootstrap.mjs', 'launcher-catalog-data.mjs', 'launcher-candidate-store.mjs', 'launcher-catalog-refresh.mjs']);
  const server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://127.0.0.1').pathname; requests.push({ path, method: req.method });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'");
    if (path === '/harness') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html><meta charset="utf-8"><title>Original bootstrap fixture</title><body>Original candidate fixture</body></html>'); return; }
    if (path === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (path.startsWith('/shared/') || (path.startsWith('/web/') && webModules.has(path.slice(5)))) {
      const file = resolve(root, '.' + path), shared = resolve(root, 'shared') + sep;
      if (!file.endsWith('.mjs') || (path.startsWith('/shared/') && !file.startsWith(shared))) { res.writeHead(404); res.end(); return; }
      try { const data = await readFile(file); res.setHeader('Content-Type', 'text/javascript'); res.end(data); } catch { res.writeHead(404); res.end(); }
      return;
    }
    const game = overrides.get('/games')?.body ?? BOOTSTRAP_FIXTURES.newGames, region = overrides.get('/regions')?.body ?? BOOTSTRAP_FIXTURES.newRegions;
    const defaults = { '/self': utf8(hash(BOOTSTRAP_FIXTURES.launcher)), '/hashes': utf8(`${hash(game)}\n${hash(region)}\n`),
      '/locator': utf8(`${origin}/package 372`), '/games': game, '/regions': region, '/package': BOOTSTRAP_FIXTURES.packageBytes };
    const value = overrides.get(path) ?? {}, body = value.body ?? defaults[path];
    if (body === undefined) { res.writeHead(404); res.end(); return; }
    const send = () => { if (!res.destroyed) { res.writeHead(value.status ?? 200, { 'Content-Type': 'application/octet-stream' }); res.end(body); } };
    if (value.delayMs) { const timer = setTimeout(() => { timers.delete(timer); send(); }, value.delayMs); timers.add(timer); } else send();
  });
  await new Promise((yes, no) => { server.once('error', no); server.listen(0, '127.0.0.1', yes); }); origin = `http://127.0.0.1:${server.address().port}`;
  const endpoints = Object.freeze({ launcherDigest: origin + '/self', updateLocator: origin + '/locator', catalogDigests: origin + '/hashes', gameList: origin + '/games', regionList: origin + '/regions' });
  return { origin, endpoints, requests, set(path, value) { overrides.set(path, value); }, reset() { overrides.clear(); requests.length = 0; },
    async close() { for (const t of timers) clearTimeout(t); timers.clear(); const done = new Promise((yes, no) => server.close(e => e ? no(e) : yes())); server.closeAllConnections(); await done; } };
}

/** Original loopback-only HTTP fixture. Never proxies requests or serves official material. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const utf8 = text => new TextEncoder().encode(text), digest = data => createHash('md5').update(data).digest('hex');
const zipCase = JSON.parse(await readFile(resolve(root, 'analysis/launcher-v11/original-update-vectors.json'), 'utf8')).cases[1];
if (zipCase.name !== 'stored-bytes') throw Error('Unexpected original ZIP fixture.');
export const HTTP_PACKAGE_EXPECTED = Object.freeze({ ...zipCase.expected });
export const HTTP_FIXTURES = Object.freeze({ launcher: utf8('Original launcher fixture\0\xff'),
  gameList: utf8('<Games fixture="original"/>\r\n'), regionList: utf8('<Regions fixture="local"/>\n'),
  nextRegion: utf8('<Regions fixture="updated"/>\n'), binary: Uint8Array.of(0, 255, 65, 0, 66),
  chunks: Uint8Array.from({ length: 5000 }, (_, i) => (i * 31 + 17) & 255), package: Uint8Array.from(Buffer.from(zipCase.archive_hex, 'hex')) });

export async function createLauncherHttpFixtureServer() {
  const requests = [], timers = new Set(); let origin;
  const delayed = fn => { const timer = setTimeout(() => { timers.delete(timer); fn(); }, 160); timers.add(timer); };
  const server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://127.0.0.1').pathname;
    requests.push({ method: req.method, path, cookiePresent: !!req.headers.cookie,
      authorizationPresent: !!req.headers.authorization, refererPresent: !!req.headers.referer });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'");
    const bytes = (data, headers = {}) => { res.writeHead(200, { 'Content-Type': 'application/octet-stream', ...headers }); res.end(data); };
    if (path === '/harness') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Original HTTP adapter fixture</title><body>Original loopback fixture</body></html>'); return; }
    if (path === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    const httpModule = ['/web/launcher-http.mjs','/web/launcher-http-data.mjs'].includes(path);
    if (httpModule || path.startsWith('/shared/')) {
      const file = resolve(root, '.' + path), shared = resolve(root, 'shared') + sep;
      if (!file.endsWith('.mjs') || (!httpModule && !file.startsWith(shared))) { res.writeHead(404); res.end(); return; }
      try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': 'text/javascript' }); res.end(data); }
      catch { res.writeHead(404); res.end(); }
      return;
    }
    if (path === '/self-digest') return bytes(utf8(digest(HTTP_FIXTURES.launcher)));
    if (path === '/catalog-digests') return bytes(utf8(`${digest(HTTP_FIXTURES.gameList)}\n${digest(HTTP_FIXTURES.nextRegion)}\n`));
    if (path === '/locator') return bytes(utf8(`${origin}/package 4096`));
    if (path === '/region') return bytes(HTTP_FIXTURES.nextRegion);
    if (path === '/package') return bytes(HTTP_FIXTURES.package);
    if (path === '/binary') {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.write(HTTP_FIXTURES.binary.subarray(0, 2)); res.write(HTTP_FIXTURES.binary.subarray(2, 4)); res.end(HTTP_FIXTURES.binary.subarray(4)); return;
    }
    if (path === '/chunks') { res.writeHead(200); for (let i = 0; i < 5000; i += 127) res.write(HTTP_FIXTURES.chunks.subarray(i, i + 127)); res.end(); return; }
    if (path === '/oversize') return bytes(new Uint8Array(4097));
    if (path === '/large-length') { res.writeHead(200, { 'Content-Length': '4097' }); res.flushHeaders(); return; }
    if (path === '/gzip-small') return bytes(gzipSync(HTTP_FIXTURES.binary), { 'Content-Encoding': 'gzip' });
    if (path === '/gzip-large') return bytes(gzipSync(new Uint8Array(5000).fill(65)), { 'Content-Encoding': 'gzip' });
    if (path === '/empty') { res.writeHead(204); res.end(); return; }
    if (path.startsWith('/status/')) { res.writeHead(Number(path.split('/').at(-1))); res.end('Original failure fixture'); return; }
    if (path === '/redirect') { res.writeHead(302, { Location: '/redirect-target' }); res.end(); return; }
    if (path === '/redirect-target') return bytes(utf8('This route must not be followed.'));
    if (path === '/truncated') { res.writeHead(200, { 'Content-Length': '100', Connection: 'close' }); res.end('short'); return; }
    if (path === '/disconnect') { res.destroy(); return; }
    if (path === '/slow-headers') { delayed(() => { if (!res.destroyed) bytes(Uint8Array.of(1)); }); return; }
    if (path === '/slow-body') { res.writeHead(200); res.write(Uint8Array.of(1)); delayed(() => { if (!res.destroyed) res.end(Uint8Array.of(2)); }); return; }
    res.writeHead(404); res.end();
  });
  await new Promise((yes, no) => { server.once('error', no); server.listen(0, '127.0.0.1', yes); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, requests, async close() { for (const t of timers) clearTimeout(t); timers.clear(); const done = new Promise((yes, no) => server.close(error => error ? no(error) : yes())); server.closeAllConnections(); await done; } };
}

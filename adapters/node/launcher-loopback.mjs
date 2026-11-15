/** Explicit local bridge for the launcher and the legacy game. */
import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from './vendor/ws/wrapper.mjs';
import { createNodeLauncherTransport } from './launcher-stream.mjs';
import { snapshotSessionEndpoints } from '../../web/launcher-session-data.mjs';
import { snapshotLauncherBootstrapSource } from './launcher-bootstrap-source.mjs';
import { snapshotLauncherPatchOrigins } from './launcher-patch-origins.mjs';
import { snapshotLauncherSourceProfile } from '../../shared/launcher-source-profile.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CHUNK = 65536, BUDGET = 4 * 1024 * 1024, MESSAGES = 8192, LIFETIME = 10000, MAX_LIFETIME = 60000;
const GAME_PATH = '/game-stream';
const MIME = Object.freeze({ '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' });
const inputError = () => { throw new TypeError('Expected explicit loopback launcher settings.'); };
const CACHE_TICK_ROUTES = new Set(['/bootstrap/self', '/bootstrap/update-locator', '/bootstrap/catalog-digests', '/bootstrap/games', '/bootstrap/regions']);

export async function createLauncherLoopbackServer(input) {
  const sourceProfile = snapshotLauncherSourceProfile(input);
  const endpoints = snapshotSessionEndpoints(input?.endpoints);
  if (endpoints.some(value => value.address !== '127.0.0.1')) inputError();
  const gameCode = input?.gameCode ?? null, port = input?.port ?? 0, label = input?.label ?? '原创本地测试区';
  const gameStream = input?.gameStream === undefined ? false : input.gameStream;
  if (typeof gameStream !== 'boolean' || (gameStream && sourceProfile.id !== 'legacy')) inputError();
  const lifetimeMilliseconds = input?.lifetimeMilliseconds === undefined ? LIFETIME : input.lifetimeMilliseconds;
  if (!Number.isInteger(lifetimeMilliseconds) || lifetimeMilliseconds < 1 || lifetimeMilliseconds > MAX_LIFETIME) inputError();
  if ((gameCode !== null && (!Number.isInteger(gameCode) || gameCode < 0 || gameCode > 14)) || !Number.isInteger(port)
      || port < 0 || port > 65535 || (port > 0 && port < 1024) || typeof label !== 'string'
      || label.length < 1 || label.length > 80 || /[\x00-\x1f\x7f]/.test(label)) inputError();
  const transport = createNodeLauncherTransport({ allowedEndpoints: endpoints });
  const bootstrap = snapshotLauncherBootstrapSource(input?.bootstrap, { sourceProfile: sourceProfile.id });
  const gamePatchOrigins = snapshotLauncherPatchOrigins(input?.gamePatchOrigins);
  const token = randomBytes(32).toString('hex');
  const sockets = new Set(), jobs = new Set();
  let origin, closing = false, attempts = 0, completed = 0;
  const websocket = new WebSocketServer({ noServer: true, maxPayload: CHUNK,
    perMessageDeflate: false, clientTracking: true });
  websocket.on('error', () => {});

  function headers(response, type) {
    response.setHeader('Content-Type', type);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' ${origin.replace('http:', 'ws:')}${gamePatchOrigins?' '+gamePatchOrigins.join(' '):''}; base-uri 'none'; form-action 'none'; object-src 'none'; frame-ancestors 'none'`);
  }
  const server = createServer(async (request, response) => {
    headers(response, 'text/plain; charset=utf-8');
    const deny = status => { response.writeHead(status); response.end('Unavailable'); };
    if (closing || request.headers.host !== new URL(origin).host) { deny(403); return; }
    if (request.method !== 'GET') { deny(405); return; }
    if (request.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(request.headers['sec-fetch-site'])) { deny(403); return; }
    let path;
    try {
      const url = new URL(request.url, origin);
      if (url.origin !== origin || url.hash) { deny(404); return; }
      const queryAt = request.url.indexOf('?'), rawPath = queryAt === -1 ? request.url : request.url.slice(0, queryAt);
      if (queryAt !== -1) {
        const query = request.url.slice(queryAt);
        if (sourceProfile.id !== 'win32-current' || !CACHE_TICK_ROUTES.has(rawPath)
            || !/^\?rtm=(0|[1-9][0-9]{0,9})$/.test(query) || Number(query.slice(5)) > 0xffffffff) { deny(404); return; }
      }
      path = decodeURIComponent(rawPath);
      if (!path.startsWith('/') || path.includes('\\') || path.includes('\0') || path.split('/').includes('..')) { deny(404); return; }
    } catch { deny(404); return; }
    if (path === '/runtime.json') {
      headers(response, 'application/json; charset=utf-8');
      response.end(JSON.stringify({ schema: 'moli.loopback.v3', sourceProfile: sourceProfile.id, origin, token, endpoints, gameCode, label,
        bootstrap: bootstrap?.describe(origin) ?? null,
        ...(gameStream ? { gameStream: true } : {}),
        ...(gamePatchOrigins?{gamePatch:{schema:'moli.local-game-patch.v1',allowedOrigins:gamePatchOrigins}}:{}),
        credentialEncodings: ['ascii', 'windows-936', 'utf-8'], accountStorage: 'none', authentication: 'unverified' }));
      return;
    }
    if (path.startsWith('/bootstrap/')) {
      const bytes = bootstrap?.read(path, origin);
      if (!bytes) { deny(404); return; }
      headers(response, 'application/octet-stream'); response.end(bytes); return;
    }
    if (path === '/') { response.writeHead(302, { Location: '/web/login.html' }); response.end(); return; }
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(ROOT, path.slice(1)), extension = extname(file);
    if (!MIME[extension] || !['web', 'shared'].some(prefix => file.startsWith(resolve(ROOT, prefix) + sep))) { deny(404); return; }
    try {
      if (await realpath(file) !== file) { deny(404); return; }
      const data = await readFile(file);
      headers(response, MIME[extension]); response.end(data);
    } catch { deny(404); }
  });
  server.maxHeadersCount = 64;
  server.headersTimeout = 5000; server.requestTimeout = 10000; server.keepAliveTimeout = 1000;
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  server.on('clientError', (_error, socket) => { socket.destroy(); });
  server.on('upgrade', (request, socket, head) => {
    const reject = () => { socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n'); };
    const game = gameStream && request.url === GAME_PATH;
    if (closing || request.headers.host !== new URL(origin).host || request.headers.origin !== origin
        || (!game && request.url !== '/stream') || request.headers['sec-websocket-protocol'] !== 'moli-launcher-v1'
        || websocket.clients.size >= 8) { reject(); return; }
    try { websocket.handleUpgrade(request, socket, head, ws => websocket.emit('connection', ws, game)); }
    catch { socket.destroy(); }
  });
  websocket.on('connection', (ws, game) => {
    const controller = new AbortController();
    const job = { finish: null }; jobs.add(job);
    let stream = null, state = 'authorize', writing = false, ordinal = 0, incoming = 0, outgoing = 0, count = 0;
    let linger;
    const timer = setTimeout(() => finish('BRIDGE_TIMEOUT'), lifetimeMilliseconds);
    function send(value, binary = false) {
      return new Promise((done, failed) => {
        if (ws.readyState !== WebSocket.OPEN) { failed(new Error('Closed')); return; }
        ws.send(value, { binary, compress: false }, error => error ? failed(new Error('Write failed')) : done());
      });
    }
    function finish(code = null) {
      if (state === 'closed') return;
      state = 'closed'; clearTimeout(timer); controller.abort();
      try { stream?.close(); } catch { /* Owned stream cleanup remains best effort. */ }
      stream = null; jobs.delete(job);
      if (ws.readyState === WebSocket.OPEN) {
        if (code) ws.send(JSON.stringify({ type: 'failed', code }), { binary: false, compress: false }, () => {});
        ws.close(code ? 1008 : 1000);
      } else if (ws.readyState === WebSocket.CONNECTING) ws.terminate();
      linger = setTimeout(() => { if (ws.readyState !== WebSocket.CLOSED) ws.terminate(); }, 250);
      linger.unref();
    }
    job.finish = finish;
    ws.on('error', () => finish('BRIDGE_SOCKET'));
    ws.on('close', () => { finish(); clearTimeout(linger); });
    ws.on('message', async (data, binary) => {
      if (state === 'closed') return;
      if (!game) {
        count += 1;
        if (count > MESSAGES) { finish('BRIDGE_BUDGET'); return; }
      }
      if (state === 'authorize') {
        state = 'opening';
        let message;
        try {
          if (binary || data.length > 256) throw new Error();
          message = JSON.parse(data.toString('utf8'));
          if (!message || Object.keys(message).sort().join(',') !== 'endpointOrdinal,token,v'
              || message.v !== 1 || typeof message.token !== 'string' || !/^[a-f0-9]{64}$/.test(message.token)
              || !timingSafeEqual(Buffer.from(token), Buffer.from(message.token))
              || !Number.isInteger(message.endpointOrdinal) || message.endpointOrdinal < 0 || message.endpointOrdinal >= endpoints.length) throw new Error();
        } catch { finish('BRIDGE_DENIED'); return; }
        attempts += 1;
        try {
          const opened = await transport.openStream(endpoints[message.endpointOrdinal], { signal: controller.signal });
          if (state === 'closed') { opened.close(); return; }
          stream = opened; state = 'ready'; await send(JSON.stringify({ type: 'ready' }));
          if (state === 'closed') return;
          if (game) clearTimeout(timer);
          while (state === 'ready') {
            const bytes = await opened.read({ signal: controller.signal });
            if (state !== 'ready') { bytes?.fill(0); return; }
            if (bytes === null) { await send(JSON.stringify({ type: 'eof' })); completed += 1; finish(); return; }
            if (!game) {
              outgoing += bytes.length;
              if (outgoing > BUDGET) { bytes.fill(0); finish('BRIDGE_BUDGET'); return; }
            }
            try { await send(bytes, true); } finally { bytes.fill(0); }
          }
        } catch { if (state !== 'closed') finish(stream ? 'BRIDGE_READ' : 'BRIDGE_CONNECT'); }
        return;
      }
      if (state !== 'ready' || !binary || writing || data.length === 0 || data.length > CHUNK) { finish('BRIDGE_MESSAGE'); return; }
      if (!game) {
        incoming += data.length;
        if (incoming > BUDGET) { finish('BRIDGE_BUDGET'); return; }
      }
      writing = true;
      try {
        await stream.write(data, { signal: controller.signal });
        if (state === 'ready') await send(JSON.stringify({ type: 'written', ordinal: ordinal++ }));
      } catch { if (state !== 'closed') finish('BRIDGE_WRITE'); }
      finally { data.fill(0); writing = false; }
    });
  });
  try {
    await new Promise((ready, failed) => {
      server.once('error', failed); server.listen(port, '127.0.0.1', () => { server.removeListener('error', failed); ready(); });
    });
  } catch { websocket.close(); bootstrap?.dispose(); throw new Error('The local launcher port could not open.'); }
  origin = `http://127.0.0.1:${server.address().port}`;
  let closePromise;
  return Object.freeze({
    origin,
    snapshot: () => Object.freeze({ activeStreams: jobs.size, connectionAttempts: attempts, peerEOFs: completed }),
    close() {
      if (closePromise) return closePromise;
      closing = true;
      bootstrap?.dispose();
      for (const job of jobs) job.finish();
      for (const ws of websocket.clients) ws.terminate();
      closePromise = new Promise(done => {
        server.close(() => { websocket.close(() => done()); });
        server.closeAllConnections();
        for (const socket of sockets) socket.destroy();
      });
      return closePromise;
    },
  });
}

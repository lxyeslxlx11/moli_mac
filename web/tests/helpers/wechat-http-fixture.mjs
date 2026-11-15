/** Original HTTP/file facade. Only the test's owned loopback service is reachable; this is not native WeChat. */
import { createServer, request as httpRequest } from 'node:http';
import assert from 'node:assert/strict';
import { computeLauncherFileMd5 } from '../../../shared/launcher-manifest.mjs';
import { weChatHostConfig } from './wechat-host-fixture.mjs';

export const WECHAT_HTTP_ORIGIN = 'https://fixture.invalid';
export function weChatBootstrapConfig(extra = {}) {
  return { allowedOrigins: [WECHAT_HTTP_ORIGIN], endpoints: Object.fromEntries(['launcherDigest','updateLocator','catalogDigests','gameList','regionList']
    .map(name => [name, WECHAT_HTTP_ORIGIN + '/' + name])), encoding: 'utf-8', timeoutMs: 5000, ...extra };
}
export const WECHAT_LOCAL_LAUNCHER = new TextEncoder().encode('Original local launcher bytes, never executed.');
const arrayBuffer = value => Uint8Array.from(value).buffer;
export function scriptedWeChatHttp(run, extra = {}) {
  const stats = { calls: [], aborts: 0, listeners: 0, offCalls: 0, tasks: [] };
  const wx = { getAppBaseInfo: () => ({ SDKVersion: '3.2.2' }), getDeviceInfo: () => ({ platform: 'devtools' }),
    request(options) {
      stats.calls.push(options); let headers, chunk;
      const task = { abort() { stats.aborts++; }, onHeadersReceived(fn) { headers = fn; stats.listeners++; },
        offHeadersReceived(fn) { if (headers === fn) { headers = null; stats.listeners--; } stats.offCalls++; },
        onChunkReceived(fn) { chunk = fn; stats.listeners++; }, offChunkReceived(fn) { if (chunk === fn) { chunk = null; stats.listeners--; } stats.offCalls++; } };
      const emit = { headers: value => headers?.(value), chunk: value => chunk?.({ data: arrayBuffer(value) }),
        success: (bytes = [], statusCode = 200, header = {}) => options.success({ statusCode, header, data: arrayBuffer(bytes) }), fail: options.fail };
      stats.tasks.push(emit); queueMicrotask(() => run(emit, options, task)); return task;
    }, ...extra };
  return { wx, stats };
}
export function weChatFileFixture(bytes = WECHAT_LOCAL_LAUNCHER, extra = {}) {
  const stats = { picks: 0, reads: [], statCalls: 0 }, path = '/original/selected-not-for-logs.exe';
  const fs = { stat(options) { stats.statCalls++; queueMicrotask(() => options.success({ stats: { size: bytes.length, isFile: () => true } })); },
    readFile(options) { stats.reads.push({ position: options.position, length: options.length });
      assert.equal(options.filePath, path); assert.equal(options.encoding, undefined); assert.equal(options.length, bytes.length);
      queueMicrotask(() => options.success({ data: arrayBuffer(bytes) })); } };
  return { wx: { chooseMessageFile(options) { stats.picks++; assert.equal(options.count,1); assert.equal(options.type,'file');
      assert.deepEqual(Array.from(options.extension),['exe']); queueMicrotask(() => options.success({ tempFiles: [{ path, size: bytes.length }] })); },
    getFileSystemManager: () => fs, ...extra }, fs, stats, path };
}
export async function createWeChatHttpFixture({ finalBody = false, emitChunks = true } = {}) {
  const requests = [], routes = new Map(), host = weChatHostConfig(), active = new Set();
  const defaults = () => {
    routes.clear(); routes.set('/launcherDigest', { body: Buffer.from(computeLauncherFileMd5(WECHAT_LOCAL_LAUNCHER)) });
    routes.set('/catalogDigests', { body: Buffer.from('Original request-success marker; not digests.') });
    routes.set('/gameList', { body: Buffer.from(host.gameListXml) }); routes.set('/regionList', { body: Buffer.from(host.regionListXml) });
  }; defaults();
  const server = createServer((req,res) => {
    requests.push({ url: req.url, method: req.method }); const route = routes.get(new URL(req.url, WECHAT_HTTP_ORIGIN).pathname);
    if (!route) { res.writeHead(404); res.end(); return; }
    if (route.hold) return;
    const body = route.body ?? Buffer.alloc(0), header = { 'content-length': String(body.length), ...route.header };
    res.writeHead(route.status ?? 200, header);
    const pieces = route.chunks ?? [body.subarray(0,7), body.subarray(7)];
    let index = 0;
    function send() { if (res.destroyed) return; if (index === pieces.length) { res.end(); return; } res.write(pieces[index++]); setImmediate(send); }
    send();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); const port = server.address().port;
  const stats = { calls: [], aborts: 0, listeners: 0, offCalls: 0 };
  const wx = { getAppBaseInfo: () => ({ SDKVersion: '3.2.2' }), getDeviceInfo: () => ({ platform: 'devtools' }),
    request(options) {
      assert.equal(options.redirect,'manual'); assert.equal(options.method,'GET'); assert.equal(options.responseType,'arraybuffer');
      assert.equal(options.enableChunked,true); assert.equal(options.enableCache,false); assert.equal(options.dataType,'text');
      assert.deepEqual(Object.fromEntries(Object.entries(options.header)), { Accept: 'application/octet-stream' });
      const url = new URL(options.url); assert.equal(url.origin,WECHAT_HTTP_ORIGIN); stats.calls.push(options);
      let headerCallback, chunkCallback;
      const req = httpRequest({ host:'127.0.0.1', port, path: url.pathname + url.search, method:'GET', headers: options.header }, res => {
        const header = Object.fromEntries(Object.entries(res.headers).filter(([,value]) => typeof value === 'string'));
        headerCallback?.({ statusCode:res.statusCode, header }); const chunks = [];
        res.on('data', value => { chunks.push(value); if (emitChunks) chunkCallback?.({ data:arrayBuffer(value) }); });
        res.on('end', () => options.success({ statusCode: res.statusCode, header, data: finalBody || !emitChunks ? arrayBuffer(Buffer.concat(chunks)) : new ArrayBuffer(0) }));
        res.on('error', options.fail);
      }); active.add(req); req.on('close', () => active.delete(req)); req.on('error', options.fail); req.end();
      return { abort() { stats.aborts++; req.destroy(); }, onHeadersReceived(fn) { headerCallback=fn; stats.listeners++; },
        offHeadersReceived(fn) { if (headerCallback===fn) { headerCallback=null;stats.listeners--; }stats.offCalls++; },
        onChunkReceived(fn) { chunkCallback=fn;stats.listeners++; }, offChunkReceived(fn) { if (chunkCallback===fn) { chunkCallback=null;stats.listeners--; }stats.offCalls++; } };
    } };
  return { wx, stats, requests, routes, defaults,
    async close() { for (const req of active) req.destroy(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } };
}

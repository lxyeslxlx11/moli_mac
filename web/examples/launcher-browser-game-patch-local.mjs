/** Original loopback patch -> explicit choice -> session example. No installed-client writes. */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { createPatchUiSource } from '../tests/helpers/launcher-patch-ui-fixture.mjs';

if (process.argv.length !== 2) {
  console.error('Usage: node web/examples/launcher-browser-game-patch-local.mjs');
  process.exit(1);
}
const peer = spawn('python3', [fileURLToPath(new URL('../../analysis/launcher-v17/original_tcp_peer.py', import.meta.url)),
  '--case', 'profiles', '--input-profile', 'ui-catalog', '--connections', '1', '--lifetime-seconds', '600'],
{ stdio: ['pipe', 'pipe', 'pipe'] });
let server, source, closing = false, pending = '', result, readyResolve, readyReject;
const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
async function stop() {
  if (closing) return;
  closing = true;
  peer.stdin.end('stop\n');
  await server?.close();
  await source?.close();
}
process.once('SIGINT', () => { void stop(); });
process.once('SIGTERM', () => { void stop(); });
peer.stderr.resume(); peer.stdin.on('error', () => {}); peer.stdout.setEncoding('utf8');
peer.on('error', () => { readyReject(new Error('Original local peer unavailable.')); });
peer.stdout.on('data', part => {
  pending += part;
  if (pending.length > 8192) { readyReject(new Error('Original peer metadata budget.')); void stop(); return; }
  while (pending.includes('\n')) {
    const at = pending.indexOf('\n'), line = pending.slice(0, at); pending = pending.slice(at + 1);
    try {
      const item = JSON.parse(line);
      if (item.kind === 'ready' && item.address === '127.0.0.1' && Number.isInteger(item.port)) {
        readyResolve({ address: item.address, port: item.port });
      }
      if (item.kind === 'result') {
        result = item;
        console.log(JSON.stringify({ originalPeerVerified: item.passed && !item.stopped && item.connections === 1
          && item.rows?.length === 1 && item.rows.every(row => row.request_verified && row.client_closed),
        connections: item.connections, stopped: item.stopped === true }));
        if (!item.passed) process.exitCode = 1;
      }
    } catch { readyReject(new Error('Original peer metadata invalid.')); void stop(); }
  }
});
peer.once('exit', code => {
  readyReject(new Error('Original local peer ended.'));
  if (code !== 0 || (!closing && !result?.passed)) process.exitCode = 1;
  void stop();
});
try {
  const endpoint = await ready;
  source = await createPatchUiSource();
  server = await createLauncherLoopbackServer({ endpoints: [endpoint], bootstrap: source.bootstrap([endpoint]),
    gamePatchOrigins: [source.origin], port: 4174 });
  source.allowBrowserOrigin(server.origin);
  if (closing) { await server.close(); await source.close(); }
  else {
    console.log(`Open ${server.origin}/`);
    console.log('Original test only: prepare catalogs, enter C:\\Original, prepare patch, inspect Bin/GraphicInfo_8.bin, then choose it.');
    console.log('No base folder is needed for this create-then-append fixture. Selected files stay in page memory.');
    console.log('Then use SyntheticU1 / SyntheticP1 and original test texts, read all4, confirm, start and choose a profile.');
    console.log('The original local peer verifies one exchange and closes. No official endpoint, installed write or executable.');
  }
} catch {
  console.error('Original patch example could not start or verify.'); process.exitCode = 1; await stop();
}

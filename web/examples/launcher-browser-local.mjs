/** Original public test peer and real browser stream server; no official endpoint or executable. */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { makeSyntheticSessionLauncher } from '../launcher-fixture.mjs';
const arguments_ = process.argv.slice(2);
const selectedProfile = arguments_.length === 0 ? 'ascii' : arguments_.length === 2 && arguments_[0] === '--text-profile' ? arguments_[1] : null;
if (!['ascii', 'windows-936', 'utf-8'].includes(selectedProfile)) {
  console.error('Usage: node web/examples/launcher-browser-local.mjs [--text-profile ascii|windows-936|utf-8]'); process.exit(1);
}
const inputProfile = selectedProfile === 'ascii' ? 'ui-catalog' : selectedProfile === 'windows-936' ? 'ui-cp936' : 'ui-utf8';
const peer = spawn('python3', [fileURLToPath(new URL('../../analysis/launcher-v17/original_tcp_peer.py', import.meta.url)),
  '--case', 'profiles', '--input-profile', inputProfile, '--lifetime-seconds', '600'], { stdio: ['pipe', 'pipe', 'pipe'] });
let server = null, pending = '', stopped = false;
peer.stderr.resume(); peer.stdin.on('error', () => {});
async function stop() {
  if (stopped) return;
  stopped = true; peer.stdin.end('stop\n'); await server?.close();
}
process.once('SIGINT', stop); process.once('SIGTERM', stop);
peer.on('error', () => { console.error('Original local peer unavailable.'); process.exitCode = 1; void stop(); });
peer.stdout.setEncoding('utf8');
peer.stdout.on('data', async part => {
  pending += part;
  if (pending.length > 8192) { process.exitCode = 1; await stop(); return; }
  while (pending.includes('\n')) {
    const at = pending.indexOf('\n'), line = pending.slice(0, at); pending = pending.slice(at + 1);
    try {
      const item = JSON.parse(line);
      if (item.kind === 'ready' && item.address === '127.0.0.1' && Number.isInteger(item.port)) {
        const endpoints = [{ address: item.address, port: item.port }], original = makeSyntheticSessionLauncher(endpoints);
        server = await createLauncherLoopbackServer({ endpoints, bootstrap: original.bootstrap, port: 4174 });
        if (stopped) { await server.close(); return; }
        console.log(`Open ${server.origin}/`);
        console.log(selectedProfile === 'ascii' ? 'Original test only: prepare catalogs, then SyntheticU1 / SyntheticP1.'
          : `Original test only: prepare catalogs, explicitly choose ${selectedProfile}, then 合成用户甲 / 测试口令甲.`);
        console.log('Use original test texts, read all4, confirm, then start. Selected fixture is not evidence of the actual Windows ACP.');
      }
      if (item.kind === 'result') {
        console.log(JSON.stringify({ originalPeerVerified: item.passed && !item.stopped && item.connections === 1
          && item.rows?.length === 1 && item.rows.every(row => row.request_verified && row.client_closed),
          connections: item.connections, stopped: item.stopped === true }));
        if (!item.passed) process.exitCode = 1;
      }
    } catch { console.error('Local example could not start or verify.'); process.exitCode = 1; await stop(); }
  }
});
peer.once('exit', async code => { if (code !== 0) process.exitCode = 1; await stop(); });

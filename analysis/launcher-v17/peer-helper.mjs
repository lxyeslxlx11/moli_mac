/** Starts only the reviewed original Python loopback oracle; bounded metadata output, normal stdin stop. */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export async function startOriginalPeer(mode = 'profiles', connections = 1) {
  const process = spawn('python3', [fileURLToPath(new URL('./original_tcp_peer.py', import.meta.url)), '--case', mode, '--connections', String(connections)], { stdio: ['pipe', 'pipe', 'pipe'] });
  let readyResolve, readyReject, doneResolve, doneReject, buffer = '', result = null, exited = false;
  const ready = new Promise((yes, no) => { readyResolve = yes; readyReject = no; });
  const done = new Promise((yes, no) => { doneResolve = yes; doneReject = no; });
  done.catch(() => {});
  process.stdout.setEncoding('utf8');
  process.stderr.resume();
  process.stdout.on('data', part => {
    buffer += part;
    if (buffer.length > 8192) { readyReject(new Error('Original peer metadata budget exceeded.')); process.stdin.end('stop\n'); return; }
    while (buffer.includes('\n')) {
      const at = buffer.indexOf('\n'), line = buffer.slice(0, at); buffer = buffer.slice(at + 1);
      try {
        const item = JSON.parse(line);
        if (item.kind === 'ready' && item.address === '127.0.0.1' && Number.isInteger(item.port) && item.port > 0 && item.port <= 65535) readyResolve(Object.freeze({ address: item.address, port: item.port }));
        if (item.kind === 'result') result = item;
      } catch { readyReject(new Error('Invalid original peer metadata.')); process.stdin.end('stop\n'); }
    }
  });
  process.once('error', () => { exited = true; readyReject(new Error('Original peer could not start.')); doneReject(new Error('Original peer could not start.')); });
  process.once('exit', code => {
    exited = true;
    if (code === 0 && result?.passed) doneResolve(result);
    else { readyReject(new Error('Original peer did not become ready.')); doneReject(new Error('Original peer verification failed.')); }
  });
  process.stdin.on('error', () => {});
  const endpoint = await ready;
  return Object.freeze({ endpoint, done, pid: process.pid,
    async stop() { if (!exited) process.stdin.end('stop\n'); return done; },
  });
}

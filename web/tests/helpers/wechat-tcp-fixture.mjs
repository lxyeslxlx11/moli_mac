/** Original native-API-shaped fixture. Only optional Node plumbing opens fixed loopback, never vendor endpoints. */
import { createConnection } from 'node:net';
import { randomFillSync } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function fakeWeChat({ native = false, loopbackPort, exponent, entropyFailure = false } = {}) {
  const sockets = [], stats = { created: 0, closed: 0, entropyRequests: 0, writes: [] };
  const wx = {
    getUserCryptoManager: () => ({ getRandomValues(options) {
      stats.entropyRequests++;
      if (entropyFailure) { queueMicrotask(() => options.fail({ errMsg: 'private platform detail' })); return; }
      const bytes = exponent ? new Uint8Array(exponent) : randomFillSync(new Uint8Array(options.length));
      queueMicrotask(() => options.success({ randomValues: bytes.buffer }));
    } }),
    createTCPSocket() {
      stats.created++;
      const listeners = Object.fromEntries(['Connect','Message','Error','Close'].map(name => [name, new Set()]));
      let actual, closed = false;
      const socket = { options: null, writes: [], closeCalls: 0,
        emit(name, value) { for (const fn of [...listeners[name]]) fn(value); },
        listenerCount() { return Object.values(listeners).reduce((n, set) => n + set.size, 0); },
        connect(options) {
          this.options = options;
          if (native) {
            if (options.address !== 'fixture.invalid' || options.port !== 12345 || !Number.isInteger(loopbackPort)) throw new Error('Unexpected test mapping.');
            actual = createConnection({ host: '127.0.0.1', port: loopbackPort });
            actual.on('connect', () => this.emit('Connect'));
            actual.on('data', bytes => this.emit('Message', { message: Uint8Array.from(bytes).buffer }));
            actual.on('error', () => this.emit('Error', {})); actual.on('close', () => this.emit('Close'));
          }
        },
        write(bytes) { this.writes.push(bytes); stats.writes.push(Uint8Array.from(new Uint8Array(bytes))); if (native) actual.write(new Uint8Array(bytes)); },
        close() { this.closeCalls++; if (closed) return; closed = true; stats.closed++; actual?.destroy(); },
      };
      for (const name of Object.keys(listeners)) {
        socket['on' + name] = listener => listeners[name].add(listener);
        socket['off' + name] = listener => listeners[name].delete(listener);
      }
      sockets.push(socket); return socket;
    },
  };
  return { wx, sockets, stats };
}

export async function originalWeChatPeer(scenario = 'profiles') {
  const child = spawn('python3', [fileURLToPath(new URL('../../../analysis/launcher-current-page-v1/original_peer.py', import.meta.url)),
    '--source-profile', 'win32-current', '--case', scenario, '--lifetime-seconds', '20'], { stdio: ['pipe','pipe','pipe'] });
  let readyResolve, readyReject, doneResolve, doneReject, pending = '', result, exited = false;
  const ready = new Promise((yes,no) => { readyResolve = yes; readyReject = no; });
  const done = new Promise((yes,no) => { doneResolve = yes; doneReject = no; }); done.catch(() => {});
  child.stderr.resume(); child.stdout.setEncoding('utf8'); child.stdin.on('error', () => {});
  child.stdout.on('data', value => {
    pending += value;
    if (pending.length > 4096) { readyReject(new Error('Original peer metadata budget.')); child.stdin.end('stop\n'); return; }
    while (pending.includes('\n')) {
      const at = pending.indexOf('\n'), line = pending.slice(0, at); pending = pending.slice(at + 1);
      try {
        const item = JSON.parse(line);
        if (item.kind === 'ready' && item.address === '127.0.0.1' && Number.isInteger(item.port)) readyResolve(item.port);
        else if (item.kind === 'result') result = item;
      } catch { readyReject(new Error('Invalid original peer metadata.')); child.stdin.end('stop\n'); }
    }
  });
  child.on('error', () => { exited = true; readyReject(new Error('Original peer start failed.')); doneReject(new Error('Original peer start failed.')); });
  child.on('exit', code => { exited = true;
    if (code === 0 && result?.passed) doneResolve(result);
    else { readyReject(new Error('Original peer failed.')); doneReject(new Error('Original peer failed.')); }
  });
  try {
    const port = await ready;
    return { port, done, async close() { if (!exited) child.stdin.end('stop\n'); return done; } };
  } catch (error) { if (!exited) child.stdin.end('stop\n'); await done.catch(() => {}); throw error; }
}

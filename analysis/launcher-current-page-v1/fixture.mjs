/** Original loopback-only page fixture. Public synthetic inputs only; normal stdin cleanup. */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { makeSyntheticSessionLauncher } from '../../web/launcher-fixture.mjs';
import { snapshotLauncherSourceProfile } from '../../shared/launcher-source-profile.mjs';

export async function createCurrentPageFixture({ sourceProfile = 'win32-current', scenario = 'profiles', lifetimeSeconds = 20, port = 0 } = {}) {
  const profile = snapshotLauncherSourceProfile({ sourceProfile });
  if (!['profiles', 'wrong-group'].includes(scenario) || (scenario === 'wrong-group' && profile.id !== 'win32-current')
      || !Number.isInteger(lifetimeSeconds) || lifetimeSeconds < 20 || lifetimeSeconds > 600) throw new TypeError('Expected a declared original page fixture.');
  const child = spawn('python3', [fileURLToPath(new URL('./original_peer.py', import.meta.url)), '--source-profile', profile.id,
    '--case', scenario, '--lifetime-seconds', String(lifetimeSeconds)], { stdio: ['pipe', 'pipe', 'pipe'] });
  let readyResolve, readyReject, doneResolve, doneReject, pending = '', result = null, exited = false;
  const ready = new Promise((yes, no) => { readyResolve = yes; readyReject = no; });
  const done = new Promise((yes, no) => { doneResolve = yes; doneReject = no; }); done.catch(() => {});
  child.stderr.resume(); child.stdin.on('error', () => {}); child.stdout.setEncoding('utf8');
  child.stdout.on('data', part => {
    pending += part;
    if (pending.length > 4096) { readyReject(new Error('Original fixture metadata exceeded its budget.')); child.stdin.end('stop\n'); return; }
    while (pending.includes('\n')) {
      const at = pending.indexOf('\n'), line = pending.slice(0, at); pending = pending.slice(at + 1);
      try {
        const item = JSON.parse(line);
        if (item.kind === 'ready' && item.address === '127.0.0.1' && Number.isInteger(item.port) && item.port > 0 && item.port <= 65535) readyResolve({ address: item.address, port: item.port });
        else if (item.kind === 'result') result = item;
        else throw new Error();
      } catch { readyReject(new Error('Invalid original fixture metadata.')); child.stdin.end('stop\n'); }
    }
  });
  child.once('error', () => { exited = true; readyReject(new Error('Original fixture could not start.')); doneReject(new Error('Original fixture could not start.')); });
  child.once('exit', code => {
    exited = true;
    if (code === 0 && result?.passed) doneResolve(result);
    else { readyReject(new Error('Original fixture did not become ready.')); doneReject(new Error('Original fixture verification failed.')); }
  });
  let server;
  try {
    const endpoint = await ready, original = makeSyntheticSessionLauncher([endpoint]);
    const bootstrap = profile.id === 'win32-current' ? { ...original.bootstrap, localGameListBytes: null, localRegionListBytes: null,
      catalogDigestBytes: new Uint8Array() } : original.bootstrap;
    server = await createLauncherLoopbackServer({ endpoints: [endpoint], sourceProfile: profile.id, bootstrap, port });
    let closing;
    return Object.freeze({ origin: server.origin, done, peerPid: child.pid, snapshot: server.snapshot,
      close() { return closing ??= (async () => { if (!exited) child.stdin.end('stop\n'); try { await server.close(); } finally { await done; } })(); } });
  } catch (error) {
    if (!exited) child.stdin.end('stop\n');
    await server?.close(); await done.catch(() => {}); throw error;
  }
}

/** One8-byte pre-auth hello; metadata only. Never answers a challenge or accepts credentials. */
import net from 'node:net';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { encodeLauncherHandshakeHello, decodeLauncherCurrentHandshakeChallenge,
  LAUNCHER_CURRENT_CHANNEL_PROFILE } from '../../shared/index.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
function completeLength(value) {
  if (value.length < 4) return null;
  if (value.readUInt32BE(0) !== 0) throw Object.assign(new Error(), { code: 'HANDSHAKE_REJECTED' });
  let at = 4;
  for (let field = 0; field < 3; field++) {
    if (value.length < at + 4) return null;
    const length = value.readUInt32BE(at); at += 4;
    if (length < 1 || length > 256) throw Object.assign(new Error(), { code: 'HANDSHAKE_HEX_BUDGET' });
    if (value.length < at + length) return null;
    at += length;
  }
  return at;
}
const safeCode = error => typeof error?.code === 'string' && /^[A-Z0-9_]{1,48}$/.test(error.code) ? error.code : 'PROBE_ERROR';

export async function probeLauncherPreauth({ host, port, timeoutMs = 10000 }) {
  if (typeof host !== 'string' || net.isIPv4(host) !== true || !Number.isInteger(port) || port < 1 || port > 65535 ||
      !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 10000) throw new Error('Invalid explicit probe endpoint or budget');
  const started = performance.now(), startedUtc = new Date().toISOString();
  const retained = Buffer.alloc(LAUNCHER_CURRENT_CHANNEL_PROFILE.challengeBytes);
  const hello = Buffer.from(encodeLauncherHandshakeHello());
  const facts = { schema: 'moli.pre-auth-hello.observation.v1', started_utc: startedUtc, host, port,
    deadline_ms: timeoutMs, connection_calls: 1, connection_attempt_events: 0, connected: false,
    outbound_requested_bytes: 0, write_callback_completed: false, observed_inbound_bytes: 0,
    peak_retained_inbound_bytes: 0, challenge_validated: false, error_code: null,
    status: null, close_event_observed: false, authentication: 'unverified',
    public_key_answer_sent: false, account_request_sent: false, raw_challenge_retained: false };
  return await new Promise(resolveDone => {
    const socket = new net.Socket(); let used = 0, done = false;
    const finish = status => {
      if (done) return;
      done = true; facts.status = status; clearTimeout(timer); socket.destroy();
    };
    const timer = setTimeout(() => finish('timed-out'), timeoutMs);
    socket.on('connectionAttempt', () => facts.connection_attempt_events++);
    socket.once('connect', () => {
      if (done) return;
      facts.connected = true; facts.outbound_requested_bytes = hello.length;
      socket.write(hello, error => {
        if (error) { facts.error_code = safeCode(error); finish('write-error'); }
        else facts.write_callback_completed = true;
      });
    });
    socket.on('data', chunk => {
      if (done) return;
      facts.observed_inbound_bytes += chunk.length;
      if (chunk.length > retained.length - used) { finish('input-budget'); return; }
      chunk.copy(retained, used); used += chunk.length;
      facts.peak_retained_inbound_bytes = Math.max(facts.peak_retained_inbound_bytes, used);
      try {
        const length = completeLength(retained.subarray(0, used));
        if (length === null) return;
        if (length !== used) throw Object.assign(new Error(), { code: 'HANDSHAKE_LENGTH' });
        const challenge = decodeLauncherCurrentHandshakeChallenge(retained.subarray(0, used));
        facts.challenge_validated = true;
        facts.challenge_bytes = used; facts.challenge_sha256 = hash(retained.subarray(0, used));
        facts.field_lengths = { generator: challenge.generatorHex.length, modulus: challenge.modulusHex.length,
          peer_public: challenge.peerPublicHex.length };
        finish('challenge-validated');
      } catch (error) { facts.error_code = safeCode(error); finish('protocol-rejected'); }
    });
    socket.once('end', () => finish(used ? 'incomplete-challenge' : 'eof'));
    socket.on('error', error => { facts.error_code = safeCode(error); finish(facts.connected ? 'read-error' : 'connect-error'); });
    socket.once('close', () => {
      clearTimeout(timer); facts.status ??= 'closed'; facts.close_event_observed = true;
      facts.elapsed_ms = Math.round((performance.now() - started) * 1000) / 1000;
      retained.fill(0); hello.fill(0); resolveDone(Object.freeze(facts));
    });
    // LiteralIPv4 plus explicit false prevents automatic attempts to additional families/addresses.
    try { socket.connect({ host, port, family: 4, autoSelectFamily: false }); }
    catch (error) { facts.error_code = safeCode(error); finish('connect-error'); }
  });
}

async function observePlan() {
  const here = fileURLToPath(new URL('./', import.meta.url));
  const planFile = resolve(here, 'plan.json'), output = resolve(here, 'network-observation.json');
  const plan = JSON.parse(await readFile(planFile, 'utf8')), target = plan.network_probe.target;
  if (plan.network_probe.connections_used !== 0 || plan.network_probe.maximum_connections !== 1) throw new Error('Probe allowance already used or invalid');
  if (target?.host !== '221.122.108.12' || target?.port !== 9030) throw new Error('Target does not match the reviewed source-bound endpoint');
  const source = await readFile(new URL('../../build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe', import.meta.url));
  if (hash(source) !== plan.source.analysis_sha256) throw new Error('Source identity changed');
  const catalog = await readFile(new URL('../../build/analysis/launcher-current-channel-v1/RegionList.public.xml', import.meta.url));
  if (hash(catalog) !== target.catalog_sha256) throw new Error('Catalog identity changed');
  const reservation = await writeFile(output, JSON.stringify({ status: 'reserved-before-connect', target_connections_started: false }) + '\n', { flag: 'wx' });
  void reservation;
  plan.network_probe.connections_used = 1;
  plan.network_probe.allowance_note = 'Conservatively consumed before one socket call; never replay after an uncertain interruption.';
  plan.network_probe.probe_started_utc = new Date().toISOString();
  await writeFile(planFile, JSON.stringify(plan, null, 2) + '\n');
  const result = await probeLauncherPreauth({ host: target.host, port: target.port, timeoutMs: 10000 });
  const receipt = { ...result, source_plan: 'analysis/launcher-current-channel-v1/plan.json',
    catalog_sha256: target.catalog_sha256, peer_identity_authenticated: false,
    limits: ['Single hello only; no challenge answer, credentials, account request or game bytes',
      'Client close event is not a server application acknowledgement',
      'Matching public group is not proof of server identity, login or compatibility'] };
  await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.length !== 3 || process.argv[2] !== '--observe-plan') throw new Error('Use the reviewed --observe-plan once');
  await observePlan();
}

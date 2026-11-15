/** Stream/timer owner around a borrowed37c4 world. No automatic endpoint, current handoff, renderer or official acceptance. */
import { createLegacyGameLogin, LEGACY_GAME_LOGIN_PROFILE } from '../shared/legacy-game-login.mjs';
import { createLegacyGameCharacterFlow, LEGACY_GAME_CHARACTER_PROFILE } from '../shared/legacy-game-characters.mjs';
import { LEGACY_GAME_CHARACTER_CREATION_PROFILE } from '../shared/legacy-game-character-creation.mjs';
import { LEGACY_GAME_CHARACTER_OPTIONS_PROFILE } from '../shared/legacy-game-character-options.mjs';
import { legacyGameRuntimeWorld } from '../shared/legacy-game-protocol.mjs';
import { snapshotSessionEndpoint, ownSessionValue, ownedSessionBytes } from './launcher-session-data.mjs';

export const LEGACY_GAME_SESSION_LIMITS = Object.freeze({ chunkBytes: 65536, queuedBytes: 1048576, commandsPerBatch: 256 });
export class LegacyGameSessionError extends Error {
  constructor(code) { super('Legacy game session could not complete its bounded operation.'); this.name = 'LegacyGameSessionError'; this.code = code; }
}
const fail = code => { throw new LegacyGameSessionError(code); };
const STOP = Symbol('stopped');
const SKIP_WRITE = Symbol('skipped gameplay write');
const serverReturnRequest = 'send-004f8720';
const cityReturnRequest = 'send-004f8840';
const keepaliveRequest = 'send-004f8760';
const keepaliveArgument = Uint8Array.of(0x6e, 0x72);
const keepaliveDelay = 30001; // The legacy pump uses a strict 30000 ms threshold.
const serverReturnSuccess = 'successful';
const serverReturnTimeout = 600000;
const zero = bytes => Uint8Array.prototype.fill.call(bytes, 0);
function safeCode(error, fallback) {
  let code;
  try { code = Object.getOwnPropertyDescriptor(error ?? {}, 'code')?.value; } catch { /* No raw exception data. */ }
  return typeof code === 'string' && /^LEGACY_[A-Z0-9_]{1,89}$/.test(code) ? code : fallback;
}
function clearPacket(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (value instanceof Uint8Array) { zero(value); return; }
  for (const child of Object.values(value)) clearPacket(child, seen);
}
function method(value, name) {
  const fn = Object.getOwnPropertyDescriptor(value ?? {}, name)?.value;
  if (typeof fn !== 'function') fail('LEGACY_SESSION_STREAM');
  return (...args) => Reflect.apply(fn, value, args);
}
export function createLegacyGameSession(input) {
  const required = ['sourceProfile', 'world', 'mappingBytes', 'moduleDigestBytes', 'endpoint', 'openStream', 'clock', 'setTimer', 'clearTimer', 'createControl', 'pollMilliseconds'];
  const allowed = [...required, 'onPacket', 'onState', 'postLogin', 'keepalive'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).some(k => !allowed.includes(k))) fail('LEGACY_SESSION_INPUT');
  const v = {};
  for (const name of required) v[name] = ownSessionValue(input, name);
  const onPacket = ownSessionValue(input, 'onPacket', true) ?? (() => {});
  const onState = ownSessionValue(input, 'onState', true) ?? (() => {});
  const keepalive = ownSessionValue(input, 'keepalive', true);
  if (keepalive !== undefined && typeof keepalive !== 'boolean') fail('LEGACY_SESSION_INPUT');
  if (v.sourceProfile !== 'legacy-se6000-37c4') fail('LEGACY_SESSION_PROFILE');
  const world = legacyGameRuntimeWorld(v.world), endpoint = snapshotSessionEndpoint(v.endpoint);
  for (const name of ['openStream', 'clock', 'setTimer', 'clearTimer', 'createControl']) if (typeof v[name] !== 'function') fail('LEGACY_SESSION_INPUT');
  const openStream = v.openStream, clock = v.clock, schedule = v.setTimer, unschedule = v.clearTimer, createControl = v.createControl;
  if (typeof onPacket !== 'function' || typeof onState !== 'function' || !Number.isInteger(v.pollMilliseconds) || v.pollMilliseconds < 1 || v.pollMilliseconds > 1000) fail('LEGACY_SESSION_INPUT');
  const initial = world.inspect();
  if (initial.state !== 'open' || initial.keyAvailable || !initial.awaitingBootstrap || initial.pendingBytes) fail('LEGACY_SESSION_WORLD');
  const post = ownSessionValue(input, 'postLogin', true); let characters = null, login;
  if (post !== undefined) {
    if (!post || typeof post !== 'object' || Reflect.ownKeys(post).length !== 1) fail('LEGACY_SESSION_CHARACTER_INPUT');
    characters = createLegacyGameCharacterFlow({ graphics: ownSessionValue(post, 'graphics') });
  }
  try { login = createLegacyGameLogin({ mappingBytes: v.mappingBytes, moduleDigestBytes: v.moduleDigestBytes }); }
  catch (error) { characters?.close(); throw error; }
  // Retain only the owning login's copies, never the caller's credential arrays/options object.
  v.mappingBytes = v.moduleDigestBytes = v.world = null;
  let state = 'idle', errorCode = null, reason = null, started = false, loginCompleted = false;
  let manualReturn = null, returnTick = 0, cityReturn = false;
  let stream = null, control = null, timer = null, origin = 0, generation = 0, currentWrite = null, writing = false, activePacket = null;
  let lastWriteTick = 0;
  let queuedBytes = 0, readyResolve, doneResolve, charactersResolve, enteredResolve, creationResolve = null, upgradeResolve = null;
  const queue = [], closedStreams = new WeakSet();
  const pendingStops = new Set();
  const ready = new Promise(resolve => { readyResolve = resolve; });
  const done = new Promise(resolve => { doneResolve = resolve; });
  const charactersReady = characters ? new Promise(resolve => { charactersResolve = resolve; }) : Promise.resolve(null);
  const characterEntered = characters ? new Promise(resolve => { enteredResolve = resolve; }) : Promise.resolve(null);
  const stats = { opensRequested: 0, opensCompleted: 0, reads: 0, inboundBytes: 0, packets: 0,
    writes: 0, outboundBytes: 0, closeCalls: 0, cleanupErrors: 0 };
  const terminal = () => state === 'closed' || state === 'failed';
  function inspect() {
    return Object.freeze({ profile: 'legacy-se6000-37c4-session-v1', state, errorCode, reason,
      sourceLoginComplete: loginCompleted, login: login.inspect(), pendingWriteBytes: queuedBytes,
      io: Object.freeze({ ...stats }), worldOwnership: 'borrowed', officialAuthentication: 'unverified', currentVersionCompatibility: 'unverified',
      ...(manualReturn ? { manualReturn } : {}),
      ...(characters ? { characters: characters.inspect(), sourceCharacterEntered: characters.inspect().sourceEnterComplete } : {}) });
  }
  function closeRaw(raw) {
    if (!raw || typeof raw !== 'object' || closedStreams.has(raw)) return;
    closedStreams.add(raw);
    try {
      const close = method(raw, 'close'); stats.closeCalls++;
      const result = close();
      if (result !== undefined) Promise.resolve(result).catch(() => { stats.cleanupErrors++; });
    } catch { stats.cleanupErrors++; }
  }
  function clearTimer() {
    const old = timer; timer = null;
    if (!old) return; old.active = false;
    try { unschedule(old.handle); } catch { stats.cleanupErrors++; }
  }
  function settleWrite(entry, success, code = errorCode ?? 'LEGACY_SESSION_CLOSED') {
    if (entry.settled) return;
    entry.settled = true; queuedBytes -= entry.bytes.length; zero(entry.bytes);
    if (success) entry.resolve(); else entry.reject(new LegacyGameSessionError(code));
  }
  function retireGameplayWrites(code = 'LEGACY_SESSION_SERVER_RETURN') {
    clearTimer();
    for (const entry of queue.splice(0)) settleWrite(entry, false, code);
  }
  function finish(code, endReason) {
    if (terminal()) return;
    state = code ? 'failed' : 'closed'; errorCode = code; reason = endReason; generation++;
    clearTimer(); login.close(); characters?.close();
    if (cityReturn) {
      try { world.finishCityReturn(); } catch { stats.cleanupErrors++; }
      cityReturn = false;
    }
    if (activePacket) { clearPacket(activePacket); activePacket = null; }
    for (const stop of pendingStops) stop();
    pendingStops.clear();
    try { control?.abort(); } catch { stats.cleanupErrors++; }
    closeRaw(stream?.raw); stream = null;
    if (currentWrite) settleWrite(currentWrite, false);
    for (const entry of queue) settleWrite(entry, false);
    queue.length = 0;
    const snapshot = inspect(); readyResolve(snapshot); doneResolve(snapshot); charactersResolve?.(snapshot); enteredResolve?.(snapshot);
    creationResolve?.(snapshot); creationResolve = null;
    upgradeResolve?.(snapshot); upgradeResolve = null;
    try {
      const returned = onState(snapshot);
      if (returned?.then) Promise.resolve(returned).catch(() => { stats.cleanupErrors++; });
    } catch { stats.cleanupErrors++; }
  }
  function notify() {
    if (terminal()) return;
    try {
      const returned = onState(inspect());
      if (returned !== undefined) { Promise.resolve(returned).catch(() => {}); fail('LEGACY_SESSION_CALLBACK'); }
    } catch { finish('LEGACY_SESSION_CALLBACK', 'observer-failed'); }
  }
  function now() {
    const tick = clock();
    if (!Number.isInteger(tick) || tick < 0 || tick > 0xffffffff) fail('LEGACY_SESSION_CLOCK');
    return tick;
  }
  function checkWorld() { if (world.inspect().state !== 'open') fail('LEGACY_SESSION_WORLD'); }
  function returnRemaining(tick) { return serverReturnTimeout + 1 - ((tick - returnTick) >>> 0); }
  function keepaliveRemaining(tick) {
    if (!keepalive || !characters || state !== 'ready' || manualReturn || cityReturn || writing || !world.inspect().keyAvailable) return Infinity;
    return keepaliveDelay - ((tick - lastWriteTick) >>> 0);
  }
  function beginServerReturn() {
    if (state !== 'ready' || manualReturn || cityReturn || !characters?.inspect().sourceEnterComplete) return false;
    manualReturn = 'fading';
    retireGameplayWrites();
    notify();
    return true;
  }
  function beginCityReturn() {
    if (state !== 'ready' || manualReturn || cityReturn || !characters?.inspect().sourceEnterComplete) return false;
    try {
      world.beginCityReturn();
      cityReturn = true;
      retireGameplayWrites('LEGACY_SESSION_CITY_RETURN');
      void enqueue([world.encodeCommand(cityReturnRequest, [])], true);
      return !terminal();
    } catch (error) {
      finish(safeCode(error, 'LEGACY_SESSION_CITY_RETURN_FAILED'), 'city-return-failed');
      return false;
    }
  }
  function finishCityReturn() {
    if (state !== 'ready' || !cityReturn) return false;
    world.finishCityReturn(); cityReturn = false;
    if (keepalive) arm();
    return true;
  }
  function completeCityBattleExit() {
    if (state !== 'ready' || !cityReturn) return;
    try {
      if (world.crossCityBattleBoundary()) void enqueue([world.encodeCommand('send-004f67f0', [0])], true);
    } catch (error) { finish(safeCode(error, 'LEGACY_SESSION_CITY_RETURN_FAILED'), 'city-return-failed'); }
  }
  function completeServerReturnFade() {
    if (terminal() || manualReturn !== 'fading') return;
    if (state === 'returning-server') { finish(null, 'manual-server-return'); return; }
    try {
      returnTick = now();
      const bytes = world.encodeCommand(serverReturnRequest, []);
      manualReturn = 'waiting';
      void enqueue([bytes], true);
      arm();
      notify();
    } catch (error) { finish(safeCode(error, 'LEGACY_SESSION_SERVER_RETURN_FAILED'), 'manual-return-failed'); }
  }
  function checkCharacterWorld() {
    const snapshot = world.copyGameState();
    try {
      if (snapshot.scene !== null || snapshot.map !== null || snapshot.actors.localActor !== null || snapshot.actors.remoteCount !== 0) fail('LEGACY_SESSION_CHARACTER_WORLD');
    } finally { clearPacket(snapshot); }
  }
  function race(action) {
    return new Promise((resolve, reject) => {
      // Retire the cancellation listener as soon as the operation settles.
      const stop = () => resolve(STOP);
      if (terminal()) stop(); else pendingStops.add(stop);
      Promise.resolve(action).then(value => {
        pendingStops.delete(stop); resolve(value);
      }, error => {
        pendingStops.delete(stop); reject(error);
      });
    });
  }
  function adoptLogin() {
    const auth = login.inspect();
    if (auth.state === 'failed') { finish(auth.errorCode, 'source-login-failed'); return; }
    if (auth.state === 'accepted') {
      loginCompleted = true; state = 'ready'; clearTimer();
      if (characters) { characters.begin(); world.configureActorResources(0); }
      notify();
      if (!terminal()) readyResolve(inspect());
    } else if (auth.state !== 'closed') {
      state = ({ 'awaiting-connection': 'connecting', 'awaiting-bootstrap': 'awaiting-bootstrap',
        'awaiting-reply': 'authenticating', delaying: 'post-authentication' })[auth.state] ?? state;
    }
  }
  function poll() {
    if (terminal() || !started) return;
    try {
      checkWorld(); const tick = now();
      if (manualReturn === 'waiting') {
        if (returnRemaining(tick) <= 0) finish('LEGACY_SESSION_RETURN_TIMEOUT', 'manual-return-timeout');
      } else if (!loginCompleted) { login.poll(tick); adoptLogin(); if (!terminal() && !loginCompleted) notify(); }
      else if (characters?.inspect().requiresPolling) {
        const step = characters.advance(tick);
        try {
          if (step.effect?.kind === 'native-entry-reset-boundary') {
            checkCharacterWorld();
            // First entry into a fresh projection; native main5's complete UI/global reset is not emulated.
            world.configureActorResources(step.snapshot.category);
            world.prepareCharacterEntry(step.effect.selectedAppearanceCode);
          } else if (step.effect?.kind === 'native-creation-profile-boundary') checkCharacterWorld();
          if (step.commands.length) {
            const frames = [];
            try { for (const command of step.commands) frames.push(world.encodeCommand(command.operationId, command.arguments)); }
            catch (error) { for (const bytes of frames) zero(bytes); throw error; }
            void enqueue(frames);
          }
        } finally { clearPacket(step.commands); }
        if (step.snapshot.state === 'failed' || step.snapshot.state === 'blocked-content') { finish(step.snapshot.errorCode, 'source-character-failed'); return; }
        notify();
        if (!terminal() && step.snapshot.state === 'choosing') charactersResolve?.(inspect());
        if (!terminal() && step.snapshot.sourceEnterComplete) enteredResolve?.(inspect());
        if (!terminal() && creationResolve && step.snapshot.sourceCreationResult !== null) { const resolve = creationResolve; creationResolve = null; resolve(inspect()); }
        if (!terminal() && upgradeResolve && ['upgrade-success', 'upgrade-error'].includes(step.snapshot.state)) { const resolve = upgradeResolve; upgradeResolve = null; resolve(inspect()); }
      }
      if (keepaliveRemaining(tick) <= 0) void enqueue([world.encodeCommand(keepaliveRequest, [keepaliveArgument])]);
    }
    catch (error) { finish(safeCode(error, 'LEGACY_SESSION_CLOCK'), 'poll-failed'); }
  }
  function deadline() {
    if (manualReturn === 'waiting' && returnRemaining(now()) <= 0) poll();
    else if (!loginCompleted && ((now() - origin) >>> 0) >= LEGACY_GAME_LOGIN_PROFILE.timeoutMilliseconds) poll();
    else if (loginCompleted && characters?.inspect().pendingRequest && characters.remainingMilliseconds(now()) === 0) poll();
    return !terminal();
  }
  function arm() {
    if (terminal() || (timer && !keepalive)) return;
    const waitingToReturn = manualReturn === 'waiting';
    if (!keepalive && !waitingToReturn && loginCompleted && !characters?.inspect().requiresPolling) return;
    let arming = true, synchronous = false;
    try {
      const tick = now();
      let delay = keepaliveRemaining(tick);
      if (waitingToReturn) delay = returnRemaining(tick);
      else if (!loginCompleted) delay = Math.min(v.pollMilliseconds, LEGACY_GAME_LOGIN_PROFILE.timeoutMilliseconds - ((tick - origin) >>> 0));
      else if (characters?.inspect().requiresPolling) delay = Math.min(delay, v.pollMilliseconds, characters.remainingMilliseconds(tick) ?? v.pollMilliseconds);
      if (terminal()) return;
      if (delay === Infinity) { clearTimer(); return; }
      delay = Math.max(1, delay);
      if (timer && timer.delay - ((tick - timer.tick) >>> 0) <= delay) return;
      clearTimer();
      const token = { active: true, handle: null, tick, delay }; timer = token;
      token.handle = schedule(() => {
        if (arming) { synchronous = true; return; }
        if (!token.active || timer !== token || terminal()) return;
        token.active = false; timer = null; poll(); if (!terminal()) arm();
      }, delay);
      arming = false;
      if (synchronous) fail('LEGACY_SESSION_TIMER');
    } catch (error) { arming = false; finish(safeCode(error, 'LEGACY_SESSION_TIMER'), 'timer-failed'); }
  }
  async function drain() {
    if (writing || !stream || terminal()) return;
    writing = true;
    try {
      while (queue.length && !terminal()) {
        const entry = queue.shift(); currentWrite = entry;
        const result = await race(Promise.resolve().then(() => {
          if (terminal() || !deadline()) return STOP;
          if (state === 'returning-server' || (manualReturn && !entry.transitionWrite)) {
            settleWrite(entry, false, 'LEGACY_SESSION_SERVER_RETURN');
            return SKIP_WRITE;
          }
          if (cityReturn && !entry.transitionWrite) {
            settleWrite(entry, false, 'LEGACY_SESSION_CITY_RETURN');
            return SKIP_WRITE;
          }
          return stream.write(entry.bytes, { signal: control.signal });
        }));
        if (result === STOP || terminal()) return;
        if (result === SKIP_WRITE) continue;
        if (result !== undefined) fail('LEGACY_SESSION_WRITE_RESULT');
        if (keepalive) lastWriteTick = now();
        stats.writes++; stats.outboundBytes += entry.bytes.length; settleWrite(entry, true); currentWrite = null;
      }
    } catch (error) {
      if (state === 'returning-server') settleWrite(currentWrite, false, 'LEGACY_SESSION_SERVER_RETURN');
      else finish(safeCode(error, 'LEGACY_SESSION_WRITE'), 'write-failed');
    }
    finally { currentWrite = null; writing = false; if (keepalive) arm(); }
  }
  function enqueue(frames, transitionWrite = false) {
    const total = frames.reduce((n, bytes) => n + bytes.length, 0);
    if (terminal() || queuedBytes + total > LEGACY_GAME_SESSION_LIMITS.queuedBytes) {
      for (const bytes of frames) zero(bytes);
      if (!terminal()) finish('LEGACY_SESSION_QUEUE', 'outbound-limit');
      const rejected = Promise.reject(new LegacyGameSessionError(errorCode ?? 'LEGACY_SESSION_CLOSED'));
      rejected.catch(() => {}); return rejected;
    }
    const promises = frames.map(bytes => new Promise((resolve, reject) => {
      const entry = { bytes, resolve, reject, settled: false, transitionWrite }; queuedBytes += bytes.length; queue.push(entry);
    }));
    const result = Promise.all(promises).then(() => inspect()); result.catch(() => {});
    void drain(); return result;
  }
  async function dispatch(packet) {
    activePacket = packet;
    try {
      if (packet.kind === 'message' && packet.message.operationId === 'receive-00567c34' &&
          state === 'ready' && characters?.inspect().sourceEnterComplete) {
        const result = packet.message.arguments[0];
        const accepted = result.length === serverReturnSuccess.length && result.every((byte, i) => byte === serverReturnSuccess.charCodeAt(i));
        if (manualReturn === 'waiting') {
          finish(accepted ? null : 'LEGACY_SESSION_RETURN_REJECTED', accepted ? 'manual-server-return' : 'manual-return-rejected');
          return;
        }
        if (accepted) {
          state = 'returning-server';
          retireGameplayWrites();
          notify();
          return;
        }
      }
      if (manualReturn) return;
      if (cityReturn) {
        let written;
        if (packet.effect?.kind === 'city-return-boundary' || packet.effect?.kind === 'city-return-trade-decline') {
          written = enqueue([world.encodeCommand(packet.effect.request, [0])], true);
        }
        if (!terminal()) await race(onPacket(packet));
        if (written && !terminal()) await race(written);
        return;
      }
      if (packet.kind === 'bootstrap') {
        if (keepalive && loginCompleted) arm();
        const command = login.bootstrap();
        if (command) {
          let bytes;
          try { bytes = world.encodeCommand(command.operationId, command.arguments); }
          finally { for (const arg of command.arguments) zero(arg); }
          adoptLogin(); notify();
          if (terminal()) { zero(bytes); return; }
          const written = await race(enqueue([bytes])); if (written === STOP || terminal()) return;
        }
      } else if (packet.kind === 'message' && packet.message.operationId === LEGACY_GAME_LOGIN_PROFILE.reply) {
        login.observeReply(...packet.message.arguments); // Auth detail never reaches an observer or a log.
        return;
      } else if (packet.kind === 'message' && characters && characters.observe(packet.message.operationId, packet.message.arguments)) {
        if (packet.message.operationId === LEGACY_GAME_CHARACTER_PROFILE.category) world.configureActorResources(characters.inspect().category);
        notify();
        return; // Roster names and entry error detail stay with the owning source flow.
      }
      if (terminal()) return;
      if(packet.kind==='message'&&packet.message.operationId==='receive-00567cd8'&&packet.effect?.kind==='player-skills-updated'){
        const rows=packet.effect.requests;if(rows.length){const written=await race(enqueueGameCommands(rows,'send-004f6d00'));if(written===STOP||terminal())return;}
      }
      if(packet.kind==='message'&&packet.message.operationId==='receive-00567cc0'&&packet.effect?.kind==='party-reply'&&packet.effect.leaveAcknowledgment&&characters?.inspect().sourceEnterComplete){
        const rows=packet.effect.requests;if(rows.length){const written=await race(sendCommands(rows));if(written===STOP||terminal())return;}
      }
      if(packet.kind==='message'&&packet.effect?.kind==='player-trade'&&packet.effect.status==='busy-declined'){
        const written=await race(sendCommands(packet.effect.requests));if(written===STOP||terminal())return;
      }
      if(packet.kind==='message'&&['map-dialog','craft-targets'].includes(packet.effect?.kind)&&packet.effect.requests?.length){
        const written=await race(sendCommands(packet.effect.requests));if(written===STOP||terminal())return;
      }
      if(packet.kind==='message'&&packet.message.operationId==='receive-00567d6c'&&packet.effect?.kind==='battle-friend-summary'&&state==='ready'){
        const rows=packet.effect.requests,limit=LEGACY_GAME_SESSION_LIMITS.commandsPerBatch;
        for(let start=0;start<rows.length;start+=limit){
          const written=await race(enqueueGameCommands(rows.slice(start,start+limit),'send-004f6de0'));
          if(written===STOP||terminal())return;
        }
      }
      await race(Promise.resolve().then(() => terminal() || manualReturn ? STOP : onPacket(packet)));
    } finally { clearPacket(packet); if (activePacket === packet) activePacket = null; }
  }
  async function run(serial) {
    let raw;
    try {
      stats.opensRequested++;
      const opening = Promise.resolve().then(() => terminal() ? STOP : openStream(endpoint, { signal: control.signal }));
      opening.then(value => { if (terminal() && value !== STOP) closeRaw(value); }, () => {});
      raw = await race(opening); if (raw === STOP || terminal()) return;
      stats.opensCompleted++;
      stream = { raw, read: method(raw, 'read'), write: method(raw, 'write') }; method(raw, 'close');
      if (!deadline()) return;
      login.connected(); adoptLogin(); notify();
      while (!terminal() && generation === serial) {
        const reading = Promise.resolve().then(() => terminal() ? STOP : stream.read({ signal: control.signal }));
        reading.then(bytes => { if (terminal() && bytes instanceof Uint8Array) zero(bytes); }, () => {});
        let inputBytes = await race(reading); if (inputBytes === STOP || terminal()) return;
        if (!deadline()) { if (inputBytes instanceof Uint8Array) zero(inputBytes); return; }
        if (inputBytes === null) {
          finish(world.inspect().pendingBytes ? 'LEGACY_SESSION_TRUNCATED' : loginCompleted && !manualReturn && !cityReturn ? null : 'LEGACY_SESSION_EOF', 'peer-eof'); return;
        }
        let bytes;
        try {
          bytes = ownedSessionBytes(inputBytes, LEGACY_GAME_SESSION_LIMITS.chunkBytes); checkWorld();
          stats.reads++; stats.inboundBytes += bytes.length; world.append(bytes);
        } finally { bytes?.fill(0); if (inputBytes instanceof Uint8Array) zero(inputBytes); inputBytes = null; }
        while (!terminal()) {
          checkWorld(); const packet = world.next(manualReturn !== null);
          if (packet.kind !== 'message' && packet.kind !== 'bootstrap' && packet.kind !== 'binary') break;
          stats.packets++;
          try { await dispatch(packet); }
          catch (error) {
            const code = safeCode(error, '');
            if (!(manualReturn && code === 'LEGACY_SESSION_SERVER_RETURN') && !(cityReturn && code === 'LEGACY_SESSION_CITY_RETURN')) throw error;
          }
          if (state === 'returning-server') return;
        }
      }
    } catch (error) { if (!terminal()) finish(safeCode(error, 'LEGACY_SESSION_IO'), 'stream-failed'); }
    finally { if (terminal()) closeRaw(raw); }
  }
  function sendCommands(commands) { return enqueueGameCommands(commands); }
  function enqueueGameCommands(commands,sourceOperation=null) {
    const frames = [];
    try {
      if (state === 'returning-server' || manualReturn) fail('LEGACY_SESSION_SERVER_RETURN');
      if (cityReturn) fail('LEGACY_SESSION_CITY_RETURN');
      if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
      if (characters && !characters.inspect().sourceEnterComplete&&!sourceOperation) fail('LEGACY_SESSION_GAME_NOT_ENTERED');
      if (!Array.isArray(commands) || commands.length > LEGACY_GAME_SESSION_LIMITS.commandsPerBatch) fail('LEGACY_SESSION_COMMANDS');
      const descriptors = [];
      for (let i = 0; i < commands.length; i++) {
        const row = Object.getOwnPropertyDescriptor(commands, String(i));
        if (!row || !Object.hasOwn(row, 'value')) fail('LEGACY_SESSION_COMMANDS');
        const operationId = ownSessionValue(row.value, 'operationId'), args = ownSessionValue(row.value, 'arguments');
        if(sourceOperation&&operationId!==sourceOperation)fail('LEGACY_SESSION_COMMANDS');
        if (operationId === serverReturnRequest) fail('LEGACY_SESSION_SERVER_RETURN_REPLAY');
        if (operationId === cityReturnRequest) fail('LEGACY_SESSION_CITY_RETURN_REPLAY');
        if (operationId === LEGACY_GAME_LOGIN_PROFILE.command) fail('LEGACY_SESSION_AUTH_REPLAY');
        if (characters && [LEGACY_GAME_CHARACTER_PROFILE.query, LEGACY_GAME_CHARACTER_PROFILE.enter, LEGACY_GAME_CHARACTER_CREATION_PROFILE.request, LEGACY_GAME_CHARACTER_OPTIONS_PROFILE.upgradeRequest].includes(operationId)) fail('LEGACY_SESSION_CHARACTER_REPLAY');
        descriptors.push({ operationId, arguments: args });
      }
      checkWorld();
      for (const command of descriptors) frames.push(world.encodeCommand(command.operationId, command.arguments));
      return enqueue(frames);
    } catch (error) {
      for (const bytes of frames) zero(bytes);
      const code = safeCode(error, 'LEGACY_SESSION_COMMANDS');
      if (frames.length && !terminal()) finish(code, 'command-encoding-failed');
      const rejected = Promise.reject(new LegacyGameSessionError(code)); rejected.catch(() => {}); return rejected;
    }
  }
  function versionRequest(method) {
    try {
      if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
      if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
      if (upgradeResolve) fail('LEGACY_SESSION_UPGRADE_PENDING');
      checkCharacterWorld(); characters[method]();
      const pending = new Promise(resolve => { upgradeResolve = resolve; }); notify(); if (!terminal()) arm(); return pending;
    } catch (error) { const rejected = Promise.reject(new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_UPGRADE'))); rejected.catch(() => {}); return rejected; }
  }
  return Object.freeze({ inspect, done, ready, sendCommands, charactersReady, characterEntered, beginServerReturn, completeServerReturnFade,
    beginCityReturn, completeCityBattleExit, finishCityReturn,
    copyCharacters() { if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED'); return characters.copySlots(); },
    enterCharacter(slot) {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
        if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        checkCharacterWorld();
        characters.select(slot); notify(); if (!terminal()) arm(); return characterEntered;
      } catch (error) { const rejected = Promise.reject(new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_SELECT'))); rejected.catch(() => {}); return rejected; }
    },
    changeCharacterAppearance(slot, action) {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY'); if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        checkWorld(); characters.changeAppearance(slot, action); notify(); return inspect();
      } catch (error) { throw new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_OPTION')); }
    },
    beginVersionUpgrade() { return versionRequest('beginVersionUpgrade'); },
    retryVersionUpgrade() { return versionRequest('retryVersionUpgrade'); },
    acknowledgeVersionUpgrade() {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY'); if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        characters.acknowledgeVersionUpgrade(); notify(); if (!terminal()) arm(); return inspect();
      } catch (error) { throw new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_UPGRADE')); }
    },
    copyCharacterCreation() { if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED'); return characters.copyCreation(); },
    beginCharacterCreation(slot) {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
        if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        checkCharacterWorld(); characters.beginCreation(slot); notify(); if (!terminal()) arm(); return inspect();
      } catch (error) { throw new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_CREATE')); }
    },
    editCharacterCreation(action, value) {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
        if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        characters.creationAction(action, value); notify(); if (!terminal()) arm(); return inspect();
      } catch (error) { throw new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_CREATE')); }
    },
    confirmCharacterCreation() {
      try {
        if (state !== 'ready') fail('LEGACY_SESSION_NOT_READY');
        if (!characters) fail('LEGACY_SESSION_CHARACTERS_DISABLED');
        checkCharacterWorld(); characters.confirmCreation();
        const pending = new Promise(resolve => { creationResolve = resolve; });
        notify(); if (!terminal()) arm(); return pending;
      } catch (error) { const rejected = Promise.reject(new LegacyGameSessionError(safeCode(error, 'LEGACY_SESSION_CHARACTER_CREATE'))); rejected.catch(() => {}); return rejected; }
    },
    sendCommand(operationId, args) { return sendCommands([{ operationId, arguments: args }]); },
    start() {
      if (started || terminal()) return ready; started = true;
      try {
        checkWorld(); origin = now(); lastWriteTick = origin; login.start(origin); state = 'connecting'; control = createControl();
        if (!control || typeof control.abort !== 'function' || !control.signal) fail('LEGACY_SESSION_CONTROL');
        notify(); if (!terminal()) { arm(); if (!terminal()) void run(generation); }
      } catch (error) { finish(safeCode(error, 'LEGACY_SESSION_START'), 'start-failed'); }
      return ready;
    },
    close() { finish(null, state === 'returning-server' ? 'source-server-return' : 'caller-closed'); },
  });
}

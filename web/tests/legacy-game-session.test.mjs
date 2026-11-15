import test from 'node:test';
import assert from 'node:assert/strict';
import { harness,sourceReady,flush,bytes,ascii,original,bootstrap,plain } from './helpers/legacy-game-session-fixture.mjs';
import { clientEnter, clientFixture } from './helpers/legacy-game-client-fixture.mjs';
import { createLegacyGameSession,LegacyGameSessionError } from '../legacy-game-session.mjs';
const rejected=code=>e=>e instanceof LegacyGameSessionError&&e.code===code;

function fireSessionTimer(fixture, tick) {
  const timer = fixture.timers.keys().next().value;
  assert.ok(timer);
  fixture.timers.delete(timer);
  fixture.tick = tick >>> 0;
  timer.fn();
}

test('game keepalive follows the last successful write across tick wrap and ignores inbound traffic', async () => {
  const f = clientFixture({ keepalive: true });
  try {
    await clientEnter(f);
    const session = f.client.session(), writeTick = 0xfffffff0;
    f.tick = writeTick;
    await session.sendCommand('send-004f6710', [7, 8]);
    const beforeIdle = f.writes.length;
    f.tick = (writeTick + 29999) >>> 0;
    f.offer(bytes(original.wire.replies.busy.frameHex));
    await flush();
    fireSessionTimer(f, writeTick + 30000);
    await flush();
    assert.equal(f.writes.length, beforeIdle);
    assert.equal(f.timers.keys().next().value.delay, 1);
    f.fire(); await flush();
    assert.deepEqual(f.writes.slice(beforeIdle).map(plain), ['33247d206e7220']);
    assert.equal(f.timers.keys().next().value.delay, 30001);
    const stale = f.timers.keys().next().value;
    f.eof();
    const end = await session.done;
    assert.deepEqual([end.state, end.reason, f.stats.opens, f.stats.closeCalls, f.timers.size], ['closed', 'peer-eof', 1, 1, 0]);
    stale.fn(); await flush();
    assert.equal(f.writes.length, beforeIdle + 1);
  } finally { f.close(); }
});

test('game keepalive waits for a pending write and retires on return', async () => {
  let hold = false, release;
  const f = clientFixture({ keepalive: true, write: () => hold ? new Promise(resolve => { release = resolve; }) : undefined });
  try {
    await clientEnter(f);
    const session = f.client.session(), initialWrites = f.writes.length;
    hold = true;
    const pending = session.sendCommand('send-004f6710', [7, 8]);
    await flush();
    fireSessionTimer(f, f.tick + 30001);
    await flush();
    assert.equal(f.writes.length, initialWrites + 1);
    assert.equal(f.timers.size, 0);
    hold = false; release(); await pending; await flush();
    assert.equal(f.timers.keys().next().value.delay, 30001);
    const stale = f.timers.keys().next().value;
    assert.equal(f.client.requestServerReturn(), true);
    f.tick = (f.tick + 30001) >>> 0;
    stale.fn(); await flush();
    assert.equal(f.writes.length, initialWrites + 1);
    assert.equal(f.timers.size, 0);
    f.client.completeServerReturnFade();
    await flush();
    assert.deepEqual(f.writes.slice(initialWrites).map(plain), ['234d692037203820', '315e7420']);
  } finally { f.close(); }
});

test('game playback ports opt in to live keepalive timing', async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    assert.equal(f.timers.size, 0);
    f.tick += 60002;
    await f.client.session().sendCommand('send-004f6710', [7, 8]);
    assert.equal(f.timers.size, 0);
    assert.equal(f.writes.length, 4);
    assert.equal(plain(f.writes.at(-1)), '234d692037203820');
  } finally { f.close(); }
});

test('battle city return cancels an uncommitted terminal frame when a flagged boundary arrives', { timeout: 5000 }, async () => {
  const f = clientFixture(), capture = new Uint8Array(640 * 480 * 4).fill(7);
  try {
    await clientEnter(f);
    const battle = () => f.offer(f.frame(Buffer.from('>HY 1 g8 ').toString('hex')));
    battle(); await flush();
    assert.equal(f.client.inspect().canReturnToCity, false);
    f.client.configureBattleViewport({ width: 640, height: 480 });
    f.client.configureBattlePlayback({ seed: 1000, initialPhase: 0, alternativeRenderer: false, staticFlip: false, screenOffset: [0, 0] });
    f.client.configureBattleFrames();
    f.client.configureBattleEntry({ entryWindowPresent: false });
    const first = f.client.advanceBattleEntry();
    (await first.done).rgba.fill(0);
    assert.equal(f.client.inspect().canReturnToCity, true);
    const writes = f.writes.length;
    assert.equal(f.client.requestCityReturn(capture), true);
    for (let step = 0; step < 49; step++) {
      const frame = await f.client.advanceCityReturn(f.tick);
      f.client.presentCityReturn(frame, () => {});
    }
    const stale = await f.client.advanceCityReturn(f.tick);
    assert.equal(stale.battleBoundary, true);
    await flush();
    assert.equal(f.writes.length, writes + 1);
    assert.equal(f.client.inspect().world.battle.pending, true);
    battle(); await flush();
    f.client.presentCityReturn(stale, () => assert.fail('superseded battle frame was painted'));
    await flush();
    assert.deepEqual(f.writes.slice(writes).map(plain), ['347d6f20', '24217e203020']);
    assert.equal(f.client.inspect().world.battle.pending, false);
    assert.equal(f.client.inspect().cityReturn.route, 'boundary');
    assert.ok(capture.every(byte => byte === 0));
    for (let step = 0; step < 80; step++) {
      const frame = await f.client.advanceCityReturn(f.tick);
      if (frame) f.client.presentCityReturn(frame, () => {});
    }
    assert.equal(f.client.inspect().state, 'playing');
    battle(); await flush();
    const next = await f.client.advanceBattleEntry().done;
    assert.deepEqual([next.generation, next.phaseBefore, f.stats.opens], [2, 0, 1]);
    next.rgba.fill(0);
  } finally { f.close(); }
});

test('city return owns the request and can rebuild twice on one character session', { timeout: 5000 }, async () => {
  let hold = false, release;
  const f = clientFixture({ write: () => hold ? new Promise(resolve => { release = resolve; }) : undefined });
  try {
    await clientEnter(f);
    const session = f.client.session();
    await assert.rejects(session.sendCommand('send-004f8840', []), rejected('LEGACY_SESSION_CITY_RETURN_REPLAY'));
    for (let trip = 0; trip < 2; trip++) {
      const writes = f.writes.length;
      const queued = session.sendCommand('send-004f6710', [7, 8]);
      assert.equal(f.client.requestCityReturn(), true);
      assert.equal(f.client.requestCityReturn(), false);
      await assert.rejects(queued, rejected('LEGACY_SESSION_CITY_RETURN'));
      await flush();
      assert.equal(plain(f.writes[writes]), Buffer.from('4}o ').toString('hex'));
      hold = true;
      f.offer(f.frame(Buffer.from('>HY 1 g8 ').toString('hex')));
      await flush();
      assert.equal(plain(f.writes[writes + 1]), Buffer.from('$!~ 0 ').toString('hex'));
      assert.equal(f.client.inspect().world.battle.pending, false);
      assert.equal(f.client.inspect().cityReturn.route, 'boundary');
      hold = false; release(); await flush();
      let blank = 0, drawn = 0;
      for (let step = 0; step < 80; step++) {
        f.tick = (f.tick + 17) >>> 0;
        const frame = await f.client.advanceCityReturn(f.tick);
        if (frame) f.client.presentCityReturn(frame, rgba => { if (rgba) drawn++; else blank++; });
      }
      assert.deepEqual([blank, drawn, f.client.inspect().state, f.writes.length], [30, 49, 'playing', writes + 2]);
    }
    assert.deepEqual([f.stats.opens, f.stats.closeCalls], [1, 0]);
  } finally { f.close(); }
});

test('city return yields to a server return and releases its old image', { timeout: 5000 }, async () => {
  const f = clientFixture(), capture = new Uint8Array(640 * 480 * 4).fill(7);
  try {
    await clientEnter(f);
    assert.equal(f.client.requestCityReturn(capture), true);
    await flush();
    f.offer(f.frame(Buffer.from('VKW successful detail ').toString('hex')));
    await flush();
    assert.equal(f.client.inspect().cityReturn, undefined);
    assert.equal(f.client.inspect().state, 'returning-server');
    assert.ok(capture.every(byte => byte === 0));
    assert.equal(f.stats.closeCalls, 0);
    f.client.close();
    assert.equal((await f.client.done).session.reason, 'source-server-return');
  } finally { f.close(); }
});

test('manual server return freezes gameplay and submits one request only after the fade', { timeout: 5000 }, async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    const session = f.client.session();
    const runtime = f.client.runtime();
    const writes = f.writes.length;
    await assert.rejects(session.sendCommand('send-004f8720', []), rejected('LEGACY_SESSION_SERVER_RETURN_REPLAY'));
    const queued = session.sendCommand('send-004f6710', [7, 8]);
    assert.equal(f.client.requestServerReturn(), true);
    assert.equal(f.client.requestServerReturn(), false);
    await assert.rejects(queued, rejected('LEGACY_SESSION_SERVER_RETURN'));
    await assert.rejects(session.sendCommand('send-004f6710', [7, 8]), rejected('LEGACY_SESSION_SERVER_RETURN'));
    assert.equal(runtime.inspect().state, 'closed');
    assert.equal(f.client.inspect().state, 'returning-server');
    const pose = f.client.copyWorldState().pose;
    f.offer(f.frame(Buffer.from('=X# 1 2 3 ').toString('hex')));
    f.offer(f.frame(Buffer.from('VKW refused successful ').toString('hex')));
    await flush();
    assert.deepEqual(f.client.copyWorldState().pose, pose);
    assert.equal(f.client.inspect().sceneRevision, 1);
    assert.equal(session.inspect().manualReturn, 'fading');
    assert.equal(f.writes.length, writes);
    f.client.completeServerReturnFade();
    f.client.completeServerReturnFade();
    await flush();
    assert.equal(session.inspect().manualReturn, 'waiting');
    assert.equal(f.writes.length, writes + 1);
    assert.equal(plain(f.writes.at(-1)), Buffer.from('1^t ').toString('hex'));
    f.offer(f.frame(Buffer.from('VKW successful detail ').toString('hex')));
    const end = await f.client.done;
    assert.deepEqual([end.state, end.session.reason, end.session.pendingWriteBytes, f.stats.closeCalls, f.timers.size],
      ['closed', 'manual-server-return', 0, 1, 0]);
  } finally { f.close(); }
});

test('manual server return skips the request when a successful VKW arrives during the fade', { timeout: 5000 }, async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    const session = f.client.session(), writes = f.writes.length;
    assert.equal(f.client.requestServerReturn(), true);
    f.offer(f.frame(Buffer.from('VKW successful detail ').toString('hex')));
    await flush();
    assert.deepEqual([session.inspect().state, session.inspect().manualReturn, f.stats.closeCalls],
      ['returning-server', 'fading', 0]);
    f.client.completeServerReturnFade();
    assert.equal((await session.done).reason, 'manual-server-return');
    assert.equal(f.writes.length, writes);
    assert.equal(f.stats.closeCalls, 1);
  } finally { f.close(); }
});

test('manual server return drains an accepted write and drops queued gameplay before a refusal', { timeout: 5000 }, async () => {
  let hold = false, release;
  const f = clientFixture({ write: () => hold ? new Promise(resolve => { release = resolve; }) : undefined });
  try {
    await clientEnter(f);
    const session = f.client.session();
    hold = true;
    const submitted = session.sendCommand('send-004f6710', [7, 8]);
    const queued = session.sendCommand('send-004f6780', [9, 10]);
    await flush();
    assert.equal(typeof release, 'function');
    const writes = f.writes.length;
    assert.equal(f.client.requestServerReturn(), true);
    f.client.completeServerReturnFade();
    await assert.rejects(queued, rejected('LEGACY_SESSION_SERVER_RETURN'));
    assert.equal(f.writes.length, writes);
    hold = false; release();
    await submitted; await flush();
    assert.equal(f.writes.length, writes + 1);
    assert.equal(plain(f.writes.at(-1)), Buffer.from('1^t ').toString('hex'));
    f.offer(f.frame(Buffer.from('VKW successful! successful ').toString('hex')));
    const end = await session.done;
    assert.deepEqual([end.state, end.reason, end.errorCode, f.stats.closeCalls],
      ['failed', 'manual-return-rejected', 'LEGACY_SESSION_RETURN_REJECTED', 1]);
  } finally { f.close(); }
});

test('manual server return expires strictly after 600000 milliseconds across clock wrap', { timeout: 5000 }, async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    const session = f.client.session();
    f.tick = 0xfffffff0;
    assert.equal(f.client.requestServerReturn(), true);
    f.client.completeServerReturnFade();
    await flush();
    const [timer] = f.timers.keys();
    assert.equal(timer.delay, 600001);
    f.tick = (f.tick + 600000) >>> 0;
    f.timers.delete(timer); timer.fn();
    assert.equal(session.inspect().manualReturn, 'waiting');
    assert.equal(session.inspect().state, 'ready');
    assert.equal(f.timers.keys().next().value.delay, 1);
    f.fire();
    const end = await session.done;
    assert.deepEqual([end.reason, end.errorCode, f.stats.closeCalls, f.timers.size],
      ['manual-return-timeout', 'LEGACY_SESSION_RETURN_TIMEOUT', 1, 0]);
  } finally { f.close(); }
});

test('manual server return treats peer EOF before VKW as a failed return', { timeout: 5000 }, async () => {
  const f = clientFixture();
  try {
    await clientEnter(f);
    assert.equal(f.client.requestServerReturn(), true);
    f.client.completeServerReturnFade();
    await flush();
    f.eof();
    const end = await f.client.done;
    assert.deepEqual([end.state, end.session.reason, end.errorCode, f.stats.closeCalls],
      ['failed', 'peer-eof', 'LEGACY_SESSION_EOF', 1]);
  } finally { f.close(); }
});

test('owned stream performs source auth exactly once and only becomes ready after native delay; observers omit auth detail',async()=>{
 const f=harness();try{assert.equal(f.stats.opens,0);const started=f.session.start();assert.equal(f.session.start(),started);await flush();assert.equal(f.stats.opens,1);f.offer(bootstrap());await flush();assert.equal(f.writes.length,1);assert.equal(Buffer.from(f.writes[0]).toString('hex'),original.wire.authFrameHex);assert.equal(f.session.inspect().login.credentialsCleared,true);
 f.offer(bytes(original.wire.replies.success.frameHex));await flush();assert.equal(f.session.inspect().state,'authenticating');for(let i=0;i<18;i++){f.fire();await flush();}assert.equal(f.session.inspect().login.nativeStage,99);assert.equal(f.session.inspect().state,'post-authentication');f.fire();await flush();const ready=await started;assert.equal(ready.state,'ready');assert.equal(ready.sourceLoginComplete,true);assert.equal(ready.officialAuthentication,'unverified');assert.equal(f.timers.size,0);assert.equal(f.packets.length,1);assert.ok(!JSON.stringify(f.states).includes('OriginalLabel'));
 f.offer(bytes(original.wire.replies.busy.frameHex));await flush();assert.equal(f.session.inspect().state,'ready');assert.equal(f.writes.length,1);f.session.close();const done=await f.session.done;assert.equal(done.state,'closed');assert.equal(f.world.inspect().state,'open');assert.equal(f.world.inspect().keyAvailable,true);assert.equal(f.stats.closeCalls,1);
 }finally{f.close();}
});
test('source rejection and exact busy WORD close promptly, retain no raw reply and settle both promises',async()=>{
 const f=harness();try{f.session.start();await flush();f.offer(bootstrap());await flush();f.offer(bytes(original.wire.replies.busy.frameHex));await flush();f.fire();await flush();const r=await f.session.ready;assert.equal(r.errorCode,'LEGACY_LOGIN_REJECTED');assert.equal(r.login.statusWord,1234);assert.equal(r.login.nativeResult,-7);assert.equal(r.login.replyBytes,0);assert.equal((await f.session.done).state,'failed');assert.equal(f.stats.closeCalls,1);assert.equal(f.timers.size,0);}finally{f.close();}
});
test('pending open is bounded at20001ms and a late valid stream closes exactly once without reads',async()=>{
 let resolveOpen;const f=harness({openStream:()=>new Promise(r=>{resolveOpen=r;})});try{f.session.start();await flush();f.tick=20100;f.fire();await flush();const r=await f.session.ready;assert.equal(r.errorCode,'LEGACY_LOGIN_TIMEOUT');assert.equal(f.stats.closeCalls,0);resolveOpen(f.port);await flush();assert.equal(f.stats.closeCalls,1);assert.equal(f.stats.reads,0);assert.equal(f.session.inspect().io.opensCompleted,0);}finally{f.close();}
});
test('pending auth write times out, zeroes transferred wire and suppresses late writer completion',async()=>{
 let resolveWrite;const f=harness({write:()=>new Promise(r=>{resolveWrite=r;})});try{f.session.start();await flush();f.offer(bootstrap());await flush();assert.ok(f.session.inspect().pendingWriteBytes>0);assert.equal(f.writeRefs[0].every(b=>b===0),false);f.tick=20100;f.fire();await flush();const r=await f.session.done;assert.equal(r.errorCode,'LEGACY_LOGIN_TIMEOUT');assert.equal(r.pendingWriteBytes,0);assert.equal(f.writeRefs[0].every(b=>b===0),true);resolveWrite();await flush();assert.equal(f.session.inspect().io.writes,0);assert.equal(f.writes.length,1);}finally{f.close();}
});
test('close settles pending read and prevents stale timer/late bytes from touching borrowed world',async()=>{
 let offerLate;const raw={read:()=>new Promise(r=>{offerLate=r;}),write(){},close(){}};const f=harness({openStream:()=>Promise.resolve(raw)});try{f.session.start();await flush();const stale=f.allTimers[0];f.session.close();const saved=f.session.inspect();const late=bootstrap();offerLate(late);stale.fn();stale.fn();await flush();assert.equal(late.every(b=>b===0),true);assert.equal(f.world.inspect().pendingBytes,0);assert.deepEqual(f.session.inspect(),saved);assert.equal((await f.session.ready).reason,'caller-closed');}finally{f.close();}
});
test('ready commands serialize in invocation order, copy caller input and prohibit automatic auth replay',async()=>{
 const f=harness();try{await sourceReady(f);const a=f.session.sendCommand('send-004f6710',[7,8]),b=f.session.sendCommand('send-004f6780',[9,10]);await Promise.all([a,b]);assert.equal(Buffer.from(bytes(plain(f.writes[1]))).toString(),'#Mi 7 8 ');assert.equal(Buffer.from(bytes(plain(f.writes[2]))).toString(),'#^o 9 a ');await assert.rejects(f.session.sendCommand('send-004f83d0',[ascii('x'),ascii('y'),ascii('z')]),rejected('LEGACY_SESSION_AUTH_REPLAY'));assert.equal(f.writes.length,3);assert.equal(f.session.inspect().state,'ready');assert.equal(f.session.inspect().pendingWriteBytes,0);}finally{f.close();}
});
test('batch encoding failure does not send an earlier encoded command or silently resume source state',async()=>{
 const f=harness();try{await sourceReady(f);await assert.rejects(f.session.sendCommands([{operationId:'send-004f6710',arguments:[1,2]},{operationId:'unknown',arguments:[]}]),LegacyGameSessionError);await flush();assert.equal(f.writes.length,1);assert.equal(f.session.inspect().state,'failed');assert.equal(f.session.inspect().pendingWriteBytes,0);}finally{f.close();}
});
test('malformed EOF is distinct from clean ready EOF and never closes a borrowed source world',async()=>{
 const f=harness();try{await sourceReady(f);f.offer(new Uint8Array([175,239,2]));await flush();f.offer(null);const r=await f.session.done;assert.equal(r.errorCode,'LEGACY_SESSION_TRUNCATED');assert.equal(f.world.inspect().state,'open');assert.equal(f.world.inspect().pendingBytes,3);}finally{f.close();}
 const clean=harness();try{await sourceReady(clean);clean.offer(null);const r=await clean.session.done;assert.equal(r.state,'closed');assert.equal(r.reason,'peer-eof');assert.equal(r.sourceLoginComplete,true);}finally{clean.close();}
});
test('packet callback is borrowed only until close; late completion does not resume stream or retain packet bytes',async()=>{
 let entered=false,resume,packet;const f=harness({onPacket:p=>{if(p.kind==='message'){entered=true;packet=p;return new Promise(r=>{resume=r;});}}});try{await sourceReady(f);
 // Original protocol unknown message carries independent opaque bytes.
 const {createLegacyGamePayloadCodec,encodeLegacyGameEnvelope}=await import('../../shared/index.mjs');const c=createLegacyGamePayloadCodec(bytes(original.wire.bootstrap.keyHex));let raw;try{raw=encodeLegacyGameEnvelope(c.encode(ascii('unknown OriginalOpaque')));}finally{c.close();}f.offer(raw);await flush();assert.equal(entered,true);f.session.close();await f.session.done;assert.equal(packet.message.opaque.every(b=>b===0),true);const reads=f.stats.reads;resume();await flush();assert.equal(f.stats.reads,reads);
 }finally{f.close();}
});
test('observer close before opening, foreign source profiles and already bootstrapped worlds do not execute ports',async()=>{
 let owner;const f=harness({onState:s=>{if(s.state==='connecting')owner.close();}});owner=f.session;f.session.start();assert.equal((await f.session.done).state,'closed');await flush();assert.equal(f.stats.opens,0);f.close();
 const g=harness();try{assert.throws(()=>createLegacyGameSession({...g.settings,sourceProfile:'win32-current'}),rejected('LEGACY_SESSION_PROFILE'));g.world.append(bootstrap());g.world.next();assert.throws(()=>createLegacyGameSession(g.settings),rejected('LEGACY_SESSION_WORLD'));assert.equal(g.stats.opens,0);}finally{g.close();}
});
test('raw transport and observer exceptions are sanitized and pending state always settles',async()=>{
 for(const options of [{openStream:()=>Promise.reject(new Error('OriginalPrivateRaw'))},{onState:()=>{throw Error('OriginalPrivateRaw');}},{onPacket:()=>{throw Error('OriginalPrivateRaw');}}]){const f=harness(options);try{f.session.start();await flush();if(!['failed','closed'].includes(f.session.inspect().state))f.offer(bootstrap());await flush();const r=await f.session.done;assert.equal(r.state,'failed');assert.equal(JSON.stringify(r).includes('OriginalPrivateRaw'),false);assert.equal(r.login.credentialsCleared,true);assert.equal(r.pendingWriteBytes,0);}finally{f.close();}}
});
test('synchronous/stale scheduler callbacks and invalid write results cannot replay lifecycle effects',async()=>{
 const f=harness({settings:{setTimer(fn){fn();return 1;},clearTimer(){}}});try{f.session.start();const r=await f.session.done;assert.equal(r.errorCode,'LEGACY_SESSION_TIMER');assert.equal(f.stats.opens,0);}finally{f.close();}
 const g=harness({write:()=>1});try{g.session.start();await flush();g.offer(bootstrap());const r=await g.session.done;assert.equal(r.errorCode,'LEGACY_SESSION_WRITE_RESULT');assert.equal(g.stats.closeCalls,1);}finally{g.close();}
});
test('outbound batch limit settles ownership without sending or retaining an oversized source-command batch',async()=>{
 const f=harness();try{await sourceReady(f);const value=ascii('a'.repeat(8192));await assert.rejects(f.session.sendCommands(Array.from({length:130},()=>({operationId:'send-004f7f80',arguments:[value]}))),rejected('LEGACY_SESSION_QUEUE'));await flush();assert.equal(f.session.inspect().state,'failed');assert.equal(f.session.inspect().pendingWriteBytes,0);assert.equal(f.writes.length,1);assert.equal(value.every(b=>b===97),true);}finally{f.close();}
});
test('source key-reset/bootstrap updates the world codec without replaying initial auth or resetting readiness',async()=>{
 const f=harness();try{await sourceReady(f);const api=await import('../../shared/index.mjs'),row=api.LEGACY_GAME_MESSAGE_CATALOG.incoming.find(r=>r.action==='reset-bootstrap'),codec=api.createLegacyGamePayloadCodec(bytes(original.wire.bootstrap.keyHex));let reset;try{reset=api.encodeLegacyGameEnvelope(codec.encode(ascii(row.tag+' ')));}finally{codec.close();}f.offer(reset);await flush();assert.equal(f.world.inspect().awaitingBootstrap,true);f.offer(bootstrap());await flush();assert.equal(f.world.inspect().awaitingBootstrap,false);assert.equal(f.session.inspect().state,'ready');assert.equal(f.writes.length,1);}finally{f.close();}
});
test('clock/control/scheduler/open ports are invoked without an artificial receiver',async()=>{
 const f=harness();let session;const s=f.settings;try{const wrap=fn=>function(...args){assert.equal(this,undefined);return fn(...args);};session=createLegacyGameSession({...s,clock:wrap(s.clock),setTimer:wrap(s.setTimer),clearTimer:wrap(s.clearTimer),createControl:wrap(s.createControl),openStream:wrap(s.openStream)});session.start();await flush();assert.equal(session.inspect().state,'awaiting-bootstrap');assert.equal(f.stats.opens,1);session.close();assert.equal((await session.done).io.cleanupErrors,0);}finally{session?.close();f.close();}
});

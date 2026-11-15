/** Independent Python peer in a fresh private directory; only original vectors and caller-owned loopback. */
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { createConnection } from 'node:net';
import assert from 'node:assert/strict';
const directory = new URL('../../../analysis/', import.meta.url);
export async function clientOriginalPeer(mode, flow = 0, { sceneMusic = false, reentry = false } = {}) {
  const temp = await mkdtemp(join(tmpdir(), 'moli-client-peer-'));
  for (const [source, target] of [['game-browser-owner-v1/original_peer.py', 'original_peer.py'], ['game-character-options-v1/original-vectors.json', 'original-vectors.json'], ['game-post-login-v1/original-vectors.json', 'post-login-vectors.json'], ['game-input-runtime-v1/original-vectors.json', 'scene-vectors.json'], ['game-legacy-message-v1/generate_vectors.py', 'wire_reference.py'], ['game-legacy-battle-reentry-v1/original-fixture.json', 'reentry-vectors.json']]) await copyFile(new URL(source, directory), join(temp, target));
  const child = spawn('python3', [join(temp, 'original_peer.py'), mode, String(flow), String(Number(sceneMusic)), ...(reentry ? ['1'] : [])], { stdio: ['pipe', 'pipe', 'pipe'] }), lines = createInterface({ input: child.stdout }), iterator = lines[Symbol.asyncIterator]();
  let diagnostics = ''; child.stderr.on('data', b => { diagnostics += b; }); const exit = new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
  const first = await iterator.next(); if (first.done) throw Error('Original peer did not listen: ' + diagnostics); const port = JSON.parse(first.value).port;
  return { port, diagnostics() { return diagnostics; }, release() { child.stdin.write('release\n'); },
    async waitKeepalives() {
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      const { keepalive_intervals_ms } = JSON.parse(row.value);
      assert.equal(keepalive_intervals_ms.length, 2);
      return keepalive_intervals_ms;
    },
    entryReady() { child.stdin.write('entry-ready\n'); },
    queueMusic() { child.stdin.write('queue-music\n'); },
    nextBattleRound() { child.stdin.write('next-round\n'); },
    async waitNativeExit() {
      child.stdin.write('await-native-exit\n');
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      assert.deepEqual(JSON.parse(row.value), { native_exit_verified: true });
      return true;
    },
    nextBattle() { child.stdin.write('next-battle\n'); },
    async verifySecondGuard() {
      const row = await iterator.next(); assert.equal(row.done, false, diagnostics);
      assert.deepEqual(JSON.parse(row.value), { second_guard_verified: true });
    },
    async finishSecondBattle() {
      child.stdin.write('finish-second-battle\n');
      const row = await iterator.next(); assert.equal(row.done, false, diagnostics);
      const value = JSON.parse(row.value);
      assert.equal(value.second_exit_verified, true);
      assert.ok(Number.isInteger(value.battle_keepalives_verified) && value.battle_keepalives_verified >= 0);
      assert.deepEqual(value, { second_exit_verified: true, battle_keepalives_verified: value.battle_keepalives_verified });
      return value;
    },
    async finishBattle({ observeKeepalives = false } = {}) {
      child.stdin.write('finish-battle\n');
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      const result = JSON.parse(row.value);
      if (observeKeepalives) {
        assert.ok(Number.isInteger(result.battle_keepalives_verified) && result.battle_keepalives_verified >= 0);
        assert.deepEqual(result, { battle_exit_verified: true, battle_keepalives_verified: result.battle_keepalives_verified });
      } else assert.deepEqual(result, { battle_exit_verified: true });
      return result;
    },
    returnNotice() { child.stdin.write('return-notice\n'); },
    async checkReturnParked() {
      child.stdin.write('check-return\n');
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      assert.deepEqual(JSON.parse(row.value), { return_parked: true });
    },
    async waitReturnRequest() {
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      assert.deepEqual(JSON.parse(row.value), { return_request_verified: true });
    },
    acknowledgeReturn() { child.stdin.write('ack-return\n'); },
    supplyCityMap() { child.stdin.write('city-map\n'); },
    async waitCityBoundary(count) {
      const row = await iterator.next();
      assert.equal(row.done, false, diagnostics);
      assert.deepEqual(JSON.parse(row.value), { city_boundary_verified: count });
    },
    async receipt() { const row = await iterator.next(); assert.equal(await exit, 0, diagnostics); assert.equal(row.done, false, diagnostics); return JSON.parse(row.value); },
    async close() { lines.close(); child.stdin.end(); if (child.exitCode === null) child.kill('SIGTERM'); await exit; await rm(temp, { recursive: true, force: true }); } };
}
export const clientTCPOpen = port => () => new Promise((resolve, reject) => {
  const socket = createConnection({ host: '127.0.0.1', port }); socket.once('error', reject); socket.once('connect', () => { const iterator = socket[Symbol.asyncIterator](); resolve({
    async read() { const next = await iterator.next(); return next.done ? null : new Uint8Array(next.value); },
    write(b) { return new Promise((yes, no) => socket.write(b, error => error ? no(error) : yes())); }, close() { socket.destroy(); },
  }); });
});
export async function clientWait(predicate) { for (let i = 0; i < 1500 && !predicate(); i++) await new Promise(r => setTimeout(r, 1)); assert.equal(predicate(), true); }

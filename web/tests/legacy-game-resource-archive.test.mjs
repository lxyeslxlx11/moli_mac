import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as flush } from 'node:timers/promises';
import { createBrowserLegacyGameResourceArchive } from '../legacy-game-resource-archive.mjs';
import { createWeChatLegacyGameResourceArchive } from '../../adapters/wechat/legacy-game-resource-archive.mjs';
import { createWeChatAbortController } from '../../adapters/wechat/launcher-control.mjs';
import { vectors, bytes } from '../../analysis/game-legacy-resource-archive-v1/fixture.mjs';

function wxFile(raw, options = {}) {
  const reads = [], returned = []; let choose = 0;
  return { reads, returned, get choose() { return choose; }, wx: {
    chooseMessageFile(input) {
      choose++; assert.deepEqual(input.extension, ['zip']);
      queueMicrotask(() => input.success({ tempFiles: [{ path: 'wxfile://original-resources.zip', size: raw.length }] }));
    },
    getFileSystemManager() { return {
      stat(input) { queueMicrotask(() => input.success({ stats: { size: raw.length, isFile: () => true } })); },
      readFile(input) {
        reads.push({ position: input.position, length: input.length });
        queueMicrotask(async () => {
          const data = raw.slice(input.position, input.position + input.length); returned.push(data);
          await options.beforeRead?.(input, data);
          input.success({ data: data.buffer });
        });
      },
    }; },
  } };
}

for (const kind of ['browser', 'wx']) for (const name of ['ordinary', 'descriptor64', 'end64']) test(kind+' selected '+name+' is read through bounded file slices', async () => {
  const raw = bytes(vectors.cases[name].hex), f = wxFile(raw);
  const a = kind === 'browser' ? await createBrowserLegacyGameResourceArchive(new File([raw], 'game.zip')) : await createWeChatLegacyGameResourceArchive({ wx: f.wx });
  assert.equal(a.count, 3); assert.ok(a.inspect().physicalBytes < raw.length);
  assert.deepEqual(await a.port.read('Bin/b.bin', 99991, 31), bytes(vectors.payloadHex).slice(99991, 100022));
  assert.equal(a.inspect().cachedBytes, 150000);
  a.close(); assert.equal(a.inspect().state, 'closed');
  if (kind === 'wx') { assert.equal(f.choose, 1); assert.ok(f.reads.every(r => r.length <= 65536 + 98)); }
});

test('wx selection abort rejects pending metadata and clears a late native ArrayBuffer', async () => {
  const raw = bytes(vectors.cases.ordinary.hex), control = createWeChatAbortController();
  let release, entered; const ready = new Promise(resolve => { entered = resolve; });
  const f = wxFile(raw, { async beforeRead() { entered(); await new Promise(resolve => { release = resolve; }); } });
  const opening = createWeChatLegacyGameResourceArchive({ wx: f.wx, signal: control.signal });
  await ready; control.abort(); await assert.rejects(opening, { code: 'FILE_ABORTED' });
  release(); await flush(); assert.ok(f.returned.every(b => b.every(n => n === 0)));
});

test('browser archive closure clears a late selected file slice and never publishes it', async () => {
  const raw = bytes(vectors.cases.ordinary.hex); let paused = false, release, entered, late;
  const ready = new Promise(resolve => { entered = resolve; });
  const file = { size: raw.length, slice(at, end) { return { async arrayBuffer() {
    const data = raw.slice(at, end);
    if (paused) { late = data; entered(); await new Promise(resolve => { release = resolve; }); }
    return data.buffer;
  } }; } };
  const a = await createBrowserLegacyGameResourceArchive(file); paused = true;
  const reading = a.port.read('Bin/a.bin', 0, 5); await ready; a.close(); release();
  await assert.rejects(reading); assert.ok(late.every(n => n === 0));
});

test('wx short native reads reject the package without manufacturing zero-filled metadata', async () => {
  const raw = bytes(vectors.cases.ordinary.hex), f = wxFile(raw);
  const short = Uint8Array.of(3, 4, 5);
  const old = f.wx.getFileSystemManager;
  f.wx.getFileSystemManager = () => ({ ...old(), readFile(input) { queueMicrotask(() => input.success({ data: short.buffer })); } });
  await assert.rejects(createWeChatLegacyGameResourceArchive({ wx: f.wx }), { code: 'FILE_SIZE' });
  assert.ok(short.every(b => b === 0));
});

test('wx zero-length ranges return empty bytes without asking the native reader for data', async () => {
  const f = wxFile(bytes(vectors.cases.ordinary.hex)), a = await createWeChatLegacyGameResourceArchive({ wx: f.wx });
  assert.deepEqual(await a.port.read('Bin/a.bin', 0, 0), new Uint8Array());
  assert.ok(f.reads.every(row => row.length > 0)); a.close();
});

test('wx unavailable filesystem is reported before opening a resource selection', async () => {
  const f = wxFile(bytes(vectors.cases.ordinary.hex)); f.wx.getFileSystemManager = () => { throw Error('fixture unavailable'); };
  await assert.rejects(createWeChatLegacyGameResourceArchive({ wx: f.wx }), { code: 'FILE_CAPABILITY' }); assert.equal(f.choose, 0);
});

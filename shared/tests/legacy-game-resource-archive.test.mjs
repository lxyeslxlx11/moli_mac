import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, openSync, readSync, closeSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLegacyGameResourceArchive } from '../legacy-game-resource-archive.mjs';
import { vectors, bytes, sourceFor, openCase } from '../../analysis/game-legacy-resource-archive-v1/fixture.mjs';

for (const name of ['ordinary', 'local64', 'known-size64', 'descriptor32', 'descriptor64', 'descriptor32-no-signature', 'descriptor64-no-signature', 'prefix-comment', 'end64', 'end64-prefix']) test('lazy resources preserve Python '+name+' slices,empty files and owned bytes', async () => {
  const { archive, stats, expected, raw } = await openCase(name), original = raw.slice();
  assert.equal(archive.inspect().physicalReads, name.startsWith('end64') ? 3 : 2); assert.equal(archive.count, 3);
  assert.ok(stats.returned.every(b => b.every(v => v === 0)));
  for (const row of expected) {
    const wanted = bytes(row.bytesHex); assert.equal(await archive.port.stat(row.path), wanted.length);
    for (const [at, length] of [[0, Math.min(6, wanted.length)], [Math.max(0, wanted.length - 101), Math.min(101, wanted.length)], [0, wanted.length]]) {
      const read = await archive.port.read(row.path, at, length); assert.deepEqual(read, wanted.slice(at, at + length));
      read.fill(7); assert.deepEqual(await archive.port.read(row.path, at, length), wanted.slice(at, at + length));
    }
  }
  assert.equal(await archive.port.stat('Bin/missing'), null); assert.deepEqual(raw, original);
  archive.close(); archive.close(); assert.equal(stats.closed, 1); assert.equal(archive.inspect().cachedBytes, 0);
  await assert.rejects(archive.port.stat('Bin/a.bin'), { code: 'LEGACY_ASSET_ARCHIVE_CLOSED' });
});

test('1200 actual files initialize without reading their bodies or applying update limits', async () => {
  const f = await openCase('many'); assert.equal(f.archive.count, 1200); assert.equal(f.stats.reads.length, 2);
  assert.equal(await f.archive.port.stat('BIN/items/1199.dat'), 7);
  assert.deepEqual(await f.archive.port.read('Bin/items/1199.dat', 1, 3), new Uint8Array(3).fill(1199 % 256)); f.archive.close();
});

test('Deflate crosses compressed input chunks and caches an independent decoded entry', async () => {
  const f = await openCase('chunked-deflate'), wanted = bytes(f.expected[0].bytesHex);
  const first = await f.archive.port.read('Bin/random.bin', 65500, 1000);
  assert.deepEqual(first, wanted.slice(65500, 66500)); first.fill(0);
  const reads = f.stats.reads.length;
  assert.deepEqual(await f.archive.port.read('Bin/random.bin', 90000, 10), wanted.slice(90000, 90010));
  assert.equal(f.stats.reads.length, reads); assert.equal(f.archive.inspect().cachedBytes, wanted.length); f.archive.close();
});

test('a33MiB Deflate entry returns small ranges without retaining its whole decoded body', async () => {
  const f = await openCase('large-deflate');
  assert.equal(await f.archive.port.stat('Bin/large.bin'), 33 * 1024 * 1024);
  assert.deepEqual(await f.archive.port.read('Bin/large.bin', 32 * 1024 * 1024 + 13, 41), new Uint8Array(41).fill(120));
  assert.equal(f.archive.inspect().cachedBytes, 0);
  await assert.rejects(f.archive.port.read('Bin/large.bin', 0, 33 * 1024 * 1024), { code: 'LEGACY_ASSET_ARCHIVE_FILE_RANGE' }); f.archive.close();
});

for (const name of ['wrapped', 'unicode-root']) test(name+' installation root follows the module location', async () => {
  const f = await openCase(name); assert.equal(f.archive.count, 2);
  assert.equal(await f.archive.port.stat('cg_se_6000.exe'), 22);
  assert.deepEqual(await f.archive.port.read('Bin/a.bin', 1, 40), bytes(f.expected[1].bytesHex).slice(1, 41)); f.archive.close();
});

test('explicit resource root resolves a package containing two independent installations', async () => {
  await assert.rejects(openCase('multiple-root'), { code: 'LEGACY_ASSET_ARCHIVE_ROOT' });
  const f = await openCase('multiple-root', { rootPrefix: 'A' }); assert.equal(f.archive.count, 1);
  assert.deepEqual(await f.archive.port.read('cg_se_6000.exe', 0, 1), Uint8Array.of(97)); f.archive.close();
});

for (const name of ['duplicate', 'file-directory', 'parent', 'absolute', 'missing-zip64']) test('resource directory rejects '+name+' before publication', async () => {
  const source = sourceFor(bytes(vectors.cases[name].hex)); await assert.rejects(createLegacyGameResourceArchive(source.input)); assert.equal(source.stats.closed, 1);
});

for (const [name, path, code] of [['local-name', 'Bin/a.bin', 'LOCAL'], ['stored-crc', 'Bin/a.bin', 'CRC'], ['deflate-crc', 'Bin/b.bin', 'CRC'], ['bad-descriptor', 'Bin/a.bin', 'DESCRIPTOR']]) test(name+' is rejected when its local entry or CRC is consumed', async () => {
  const f = await openCase(name);
  await assert.rejects(f.archive.port.read(path, 0, await f.archive.port.stat(path)), { code: 'LEGACY_ASSET_ARCHIVE_'+code }); f.archive.close();
});

test('close cancels a pending archive range and clears its late returned bytes', async () => {
  const raw = bytes(vectors.cases.ordinary.hex); let release, enter, paused = false;
  const entered = new Promise(resolve => { enter = resolve; });
  const source = sourceFor(raw, { async beforeRead() { if (paused) { enter(); await new Promise(resolve => { release = resolve; }); } } });
  const archive = await createLegacyGameResourceArchive(source.input); paused = true;
  const reading = archive.port.read('Bin/a.bin', 0, 3); await entered;
  archive.close(); release(); assert.equal(source.stats.closed, 1);
  await assert.rejects(reading, { code: 'LEGACY_ASSET_ARCHIVE_CLOSED' });
  assert.ok(source.stats.returned.at(-1).every(b => b === 0));
});

test('real sparse ZIP64 reads a file beyond4GiB without narrowing offsets or loading the bank', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'moli-resource-zip64-')), path = join(directory, 'original.zip'), rows = join(directory, 'rows.json');
  writeFileSync(rows, JSON.stringify([{ path: 'Bin/marker.dat', bytesHex: '0123456789abcdef' }]));
  const generated = spawnSync('python3', ['-B', fileURLToPath(new URL('../../analysis/game-legacy-resource-archive-v1/large_fixture.py', import.meta.url)), path, rows], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const fd = openSync(path, 'r'); let a;
  try {
    a = await createLegacyGameResourceArchive({ size: statSync(path).size, async read(at, length) {
      const b = new Uint8Array(length); assert.equal(readSync(fd, b, 0, length, at), length); return b;
    }, close() { closeSync(fd); } });
    assert.equal(a.inspect().zip64, true); assert.equal(a.count, 2);
    assert.equal(await a.port.stat('Bin/original-padding.bin'), 0x100000000 + 123);
    assert.deepEqual(await a.port.read('Bin/marker.dat', 2, 4), bytes('456789ab'));
    assert.deepEqual(await a.port.read('Bin/original-padding.bin', 0x100000000 + 77, 11), new Uint8Array(11));
    assert.ok(a.inspect().physicalBytes < 100000);
  } finally { a?.close(); if (!a) closeSync(fd); rmSync(directory, { recursive: true, force: true }); }
});

test('range arithmetic and imprecise64-bit metadata are rejected before allocating file data', async () => {
  const f = await openCase('ordinary');
  for (const [offset, length] of [[-1, 1], [0.5, 1], [0, -1], [149999, 2], [0, 33554433], [Number.MAX_SAFE_INTEGER, 1]])
    await assert.rejects(f.archive.port.read('Bin/a.bin', offset, length), { code: 'LEGACY_ASSET_ARCHIVE_FILE_RANGE' });
  f.archive.close();
  const raw = bytes(vectors.cases.end64.hex), marker = raw.findIndex((_, i) => i + 4 <= raw.length && new DataView(raw.buffer).getUint32(i, true) === 0x06064b50);
  new DataView(raw.buffer).setUint32(marker + 36, 0x200000, true);
  const source = sourceFor(raw); await assert.rejects(createLegacyGameResourceArchive(source.input), { code: 'LEGACY_ASSET_ARCHIVE_INTEGER' });
  assert.equal(source.stats.closed, 1);
});

test('closing during a second Deflate chunk discards partial output and the pending cache', async () => {
  const raw = bytes(vectors.cases['chunked-deflate'].hex); let release, enter, chunks = 0;
  const entered = new Promise(resolve => { enter = resolve; });
  const source = sourceFor(raw, { async beforeRead(at, length) {
    if (length === 65536 || length > 30000 && length < 65536) {
      if (++chunks === 2) { enter(); await new Promise(resolve => { release = resolve; }); }
    }
  } });
  const a = await createLegacyGameResourceArchive(source.input);
  const reading = a.port.read('Bin/random.bin', 80000, 20); await entered; a.close(); release();
  await assert.rejects(reading, { code: 'LEGACY_ASSET_ARCHIVE_CLOSED' });
  assert.equal(a.inspect().cachedBytes, 0); assert.ok(source.stats.returned.at(-1).every(b => b === 0));
});

test('resource packer preserves inputs and rejects colliding or existing receipts before creating an archive', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'moli-resource-pack-'));
  const root = join(directory, 'game'), source = join(root, 'config.dat');
  const archive = join(directory, 'resources.zip'), receipt = join(directory, 'pack.json');
  const tool = fileURLToPath(new URL('../../tools/pack-game-resources.py', import.meta.url));
  mkdirSync(root); writeFileSync(source, bytes('0123456789abcdef'));
  const original = readFileSync(source);
  const pack = target => spawnSync('python3', ['-B', tool, '--root', root, '--output', archive, '--receipt', target], { encoding: 'utf8' });
  try {
    writeFileSync(receipt, 'original receipt');
    for (const target of [source, join(root, 'new.json'), archive, receipt]) {
      const result = pack(target);
      assert.notEqual(result.status, 0); assert.equal(existsSync(archive), false);
      assert.deepEqual(readFileSync(source), original);
      assert.equal(readFileSync(receipt, 'utf8'), 'original receipt');
      assert.equal(existsSync(join(root, 'new.json')), false);
    }
    rmSync(receipt);
    const result = pack(receipt); assert.equal(result.status, 0, result.stderr);
    const record = JSON.parse(readFileSync(receipt, 'utf8'));
    assert.equal(record.files, 1); assert.equal(record.content_bytes, original.length);
    assert.deepEqual(readFileSync(source), original);
    const f = sourceFor(new Uint8Array(readFileSync(archive))), a = await createLegacyGameResourceArchive(f.input);
    try { assert.deepEqual(await a.port.read('config.dat', 0, original.length), new Uint8Array(original)); }
    finally { a.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

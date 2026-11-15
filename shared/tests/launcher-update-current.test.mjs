import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { decodeLauncherUpdatePackage, decodeWin32LauncherUpdatePackage, LauncherUpdateError, LAUNCHER_UPDATE_LIMITS } from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json', import.meta.url))).cases;
const bytes = row => Uint8Array.from(Buffer.from(row.archive_hex, 'hex'));
const options = row => ({ expectedMd5: row.expected_md5, expectedArchiveBytes: row.expected_archive_bytes });
const good = vectors.find(row => row.name === 'deflated-header');
const code = (action, expected) => assert.throws(action, error => error instanceof LauncherUpdateError && error.code === expected);

for (const row of vectors) {
  test(`current updater independent Python vector: ${row.name}`, () => {
    const input = bytes(row), saved = input.slice();
    if (row.expected_error) code(() => decodeWin32LauncherUpdatePackage(input, options(row)), row.expected_error);
    else {
      const candidate = decodeWin32LauncherUpdatePackage(input, options(row));
      assert.equal(candidate.payloadBytes.length, row.expected_payload.bytes);
      assert.equal(createHash('sha256').update(candidate.payloadBytes).digest('hex'), row.expected_payload.sha256);
      assert.equal(candidate.actualMd5, row.expected_md5);
      assert.equal(candidate.executable.peOffset, row.expected_payload.pe_offset);
      assert.deepEqual(candidate.executable, { peOffset: row.expected_payload.pe_offset, machine: 0x14c, optionalHeaderMagic: 0x10b, subsystem: 2, headerBytes: 248, validation: 'header-profile-only' });
      assert.equal(candidate.profile, 'win32-gui-single-exe-v1');
      assert.equal(candidate.archiveSizeMatches, true);
      assert.equal(candidate.expectedArchiveBytes, input.length);
      assert.equal(candidate.digestMatches, true);
      assert.equal(candidate.crcVerified, true);
      assert.equal(candidate.authentication, 'unverified');
      assert.equal(candidate.trust, 'unverified');
      assert.equal(candidate.replacement, 'not-performed');
      assert.ok(Object.isFrozen(candidate) && Object.isFrozen(candidate.executable));
    }
    assert.deepEqual(input, saved);
  });
}

test('current profile snapshots own options and rejects accessors, inherited values, extras and bad budgets', () => {
  let reads = 0;
  const accessor = { expectedArchiveBytes: good.expected_archive_bytes, get expectedMd5() { reads++; throw new Error('must not read'); } };
  for (const input of [null, [], true, 'options', accessor, Object.create(options(good)),
    { ...options(good), unknown: 1 }, { ...options(good), [Symbol('extra')]: 1 }]) {
    code(() => decodeWin32LauncherUpdatePackage(bytes(good), input), 'UPDATE_PROFILE_INPUT');
  }
  assert.equal(reads, 0);
  for (const expectedArchiveBytes of [0, -1, 1.5, NaN, Infinity, '100', LAUNCHER_UPDATE_LIMITS.archiveBytes + 1]) {
    code(() => decodeWin32LauncherUpdatePackage(bytes(good), { ...options(good), expectedArchiveBytes }), 'UPDATE_PROFILE_INPUT');
  }
  for (const expectedMd5 of [null, 1, 'f'.repeat(31), 'g'.repeat(32), `${good.expected_md5}\n`]) {
    code(() => decodeWin32LauncherUpdatePackage(bytes(good), { ...options(good), expectedMd5 }), 'UPDATE_PROFILE_INPUT');
  }
  const plain = Object.assign(Object.create(null), options(good));
  assert.equal(decodeWin32LauncherUpdatePackage(bytes(good), Object.freeze(plain)).actualMd5, good.expected_md5);
});

test('current profile accepts uppercase digests, offset views and ArrayBuffers with independent owned results', () => {
  const source = bytes(good), padded = new Uint8Array(source.length + 11); padded.set(source, 5);
  const input = padded.subarray(5, 5 + source.length);
  const candidate = decodeWin32LauncherUpdatePackage(input, { ...options(good), expectedMd5: good.expected_md5.toUpperCase() });
  candidate.payloadBytes.fill(0); candidate.entry.nameBytes.fill(0);
  assert.deepEqual(input, source);
  const repeated = decodeWin32LauncherUpdatePackage(source.buffer, options(good));
  assert.equal(createHash('sha256').update(repeated.payloadBytes).digest('hex'), good.expected_payload.sha256);
  assert.equal(Buffer.from(repeated.entry.nameBytes).toString(), 'Probe.exe');
});

test('legacy first-entry decoder still accepts a non-EXE payload and multiple central entries', () => {
  for (const name of ['wrong-extension', 'two-entries']) {
    const row = vectors.find(item => item.name === name);
    const candidate = decodeLauncherUpdatePackage(bytes(row), { expectedMd5: row.expected_md5 });
    assert.equal(candidate.actualMd5, row.expected_md5);
    assert.equal(candidate.profile, undefined);
  }
});

test('header-only validation does not require executable sections or authenticate synthetic content', () => {
  const candidate = decodeWin32LauncherUpdatePackage(bytes(good), options(good));
  const header = new DataView(candidate.payloadBytes.buffer), pe = candidate.executable.peOffset;
  assert.equal(header.getUint16(pe + 6, true), 0); // Original fixture deliberately has no sections.
  assert.equal(header.getUint16(pe + 20, true), 0); // No loader-compatible optional-header declaration.
  assert.equal(candidate.executable.validation, 'header-profile-only');
  assert.equal(candidate.authentication, 'unverified');
});

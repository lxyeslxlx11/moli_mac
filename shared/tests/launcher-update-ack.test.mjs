import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { decodeWin32LauncherUpdatePackage, LauncherUpdateError } from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-startup-ack-v1/resource-vectors.json', import.meta.url))).cases;
for (const row of vectors) {
  test(`current updater startup declaration: ${row.name}`, () => {
    const archive = Uint8Array.from(Buffer.from(row.archive_hex, 'hex')), saved = archive.slice();
    const decode = () => decodeWin32LauncherUpdatePackage(archive,
      { expectedMd5: row.expected_md5, expectedArchiveBytes: row.expected_archive_bytes });
    if (row.expected_error) {
      assert.throws(decode, error => error instanceof LauncherUpdateError && error.code === row.expected_error);
    } else {
      const result = decode();
      assert.deepEqual(result.startupAcknowledgement, { declaration: row.declaration, languageCount: row.languages,
        validation: 'resource-declaration-only', acknowledgement: 'not-observed' });
      assert.ok(Object.isFrozen(result.startupAcknowledgement));
      assert.equal(createHash('sha256').update(result.payloadBytes).digest('hex'), row.payload_sha256);
      assert.equal(result.trust, 'unverified');
      assert.equal(result.authentication, 'unverified');
      assert.equal(result.replacement, 'not-performed');
      result.payloadBytes.fill(0);
      assert.equal(result.startupAcknowledgement.acknowledgement, 'not-observed');
    }
    assert.deepEqual(archive, saved);
  });
}

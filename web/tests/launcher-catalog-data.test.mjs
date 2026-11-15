import test from 'node:test';
import assert from 'node:assert/strict';
import { computeLauncherFileMd5 } from '../../shared/index.mjs';
import { snapshotLauncherCatalogCandidate } from '../launcher-catalog-data.mjs';
import { BOOTSTRAP_FIXTURES, bootstrapCandidate } from './helpers/launcher-bootstrap-fixture.mjs';
test('candidate pair checks raw hashes then parses owned explicitly decoded catalogs', () => {
  const input = bootstrapCandidate(); const value = snapshotLauncherCatalogCandidate(input);
  assert.equal(value.games.games.length, 2); assert.equal(value.regions.regions.length, 3); assert.equal(value.trust, 'unverified');
  assert.notEqual(value.gameListBytes, input.gameListBytes); assert.deepEqual(value.gameListBytes, input.gameListBytes);
});
test('digest match alone cannot admit bad XML, NUL or invalid UTF8 candidates', () => {
  for (const bytes of [new TextEncoder().encode('<Wrong/>'), Uint8Array.of(0), Uint8Array.of(255)]) {
    const input = bootstrapCandidate(bytes, BOOTSTRAP_FIXTURES.newRegions);
    assert.throws(() => snapshotLauncherCatalogCandidate(input), e => e.code === 'CATALOG_PARSE');
  }
  assert.throws(() => snapshotLauncherCatalogCandidate({ ...bootstrapCandidate(), gameListMd5: '0'.repeat(32) }), e => e.code === 'CATALOG_DIGEST');
});
test('candidate validation enforces byte/encoding/options boundaries before caching', () => {
  for (const extra of [{ encoding: 'guess' }, { allowBareAmpersands: 1 }, { gameListMd5: 'A'.repeat(32) }, { gameListBytes: new Uint8Array(0) }, { regionListBytes: new Uint8Array(1024 * 1024 + 1) }]) assert.throws(() => snapshotLauncherCatalogCandidate({ ...bootstrapCandidate(), ...extra }));
  class Wrong extends Uint8Array { get byteLength() { return 1; } *[Symbol.iterator]() { yield 0; } }
  const bytes = new Wrong(BOOTSTRAP_FIXTURES.newGames); assert.equal(snapshotLauncherCatalogCandidate({ ...bootstrapCandidate(), gameListBytes: bytes }).gameListMd5, computeLauncherFileMd5(bytes));
});

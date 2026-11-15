import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bindLauncherSessionTarget, LauncherTargetError } from '../launcher-target.mjs';
import { makeSyntheticSessionLauncher } from '../launcher-fixture.mjs';
import { snapshotLauncherCatalogCandidate } from '../launcher-catalog-data.mjs';
import { computeLauncherFileMd5, createLauncherLicenseIdentity } from '../../shared/index.mjs';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { snapshotLauncherBootstrapSource } from '../../adapters/node/launcher-bootstrap-source.mjs';
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createLauncherBootstrap } from '../launcher-bootstrap.mjs';
const endpoint = { address: '127.0.0.1', port: 9031 }, other = { address: '127.0.0.1', port: 9032 };
const utf8 = value => new TextEncoder().encode(value);
function candidate(source) {
  const gameListBytes = utf8(source.games), regionListBytes = utf8(source.regions);
  return snapshotLauncherCatalogCandidate({ gameListBytes, regionListBytes, gameListMd5: computeLauncherFileMd5(gameListBytes),
    regionListMd5: computeLauncherFileMd5(regionListBytes), encoding: 'utf-8', allowBareAmpersands: false });
}
function bind(catalogs, gameOrdinal = 0, referenceOrdinal = 0, allowedEndpoints = [endpoint]) {
  return bindLauncherSessionTarget({ catalogs, gameOrdinal, referenceOrdinal, allowedEndpoints });
}
async function prepare(server) {
  const runtime = await (await fetch(server.origin + '/runtime.json')).json(), source = runtime.bootstrap;
  const client = createLauncherHttpClient({ allowedOrigins: [server.origin] });
  const get = async (url, kind) => (await client.getBytes(url, { kind })).bytes;
  const [launcherBytes, gameListBytes, regionListBytes] = await Promise.all([
    get(source.localInputs.launcher, 'package'), get(source.localInputs.gameList, 'catalog'), get(source.localInputs.regionList, 'catalog')]);
  return { runtime, result: await createLauncherBootstrap({ httpClient: client }).prepare({ launcherBytes, gameListBytes,
    regionListBytes, endpoints: source.endpoints, encoding: source.encoding, allowBareAmpersands: source.allowBareAmpersands }) };
}

test('configuration Code11 drives request word11 and exact Game11 license identity, not12', () => {
  const target = bind(candidate(makeSyntheticSessionLauncher([endpoint])));
  assert.equal(target.gameCode, 11); assert.equal(target.gameCodeText, '11');
  const license = createLauncherLicenseIdentity({ gameCodeText: target.gameCodeText, usernameBytes: utf8('SyntheticU1') });
  assert.equal(license.section, 'Game11_License'); assert.deepEqual(license.resourceIds, [335, 329, 331, 332]);
  assert.equal(target.authentication, 'unverified');
});
test('duplicate codes retain selected game ordinal and original leading-zero license text', () => {
  const source = makeSyntheticSessionLauncher([endpoint]), target = bind(candidate(source), 1);
  assert.equal(target.gameOrdinal, 1); assert.equal(target.gameName, '重复编号示例'); assert.equal(target.gameCode, 11);
  const leading = bind(candidate({ ...source, games: source.games.replace('Code="11"', 'Code="0011"') }));
  assert.equal(leading.gameCode, 11); assert.equal(leading.gameCodeText, '0011');
  assert.equal(createLauncherLicenseIdentity({ gameCodeText: leading.gameCodeText, usernameBytes: utf8('A') }).section, 'Game0011_License');
});
test('binding preserves configured BIP order and snapshots allowlist/candidate data', () => {
  const allowed = [{ ...endpoint }, { ...other }], catalogs = candidate(makeSyntheticSessionLauncher([other, endpoint]));
  const result = bind(catalogs, 0, 0, allowed); allowed[0].port = 1; catalogs.gameListBytes.fill(0);
  assert.deepEqual(result.endpoints, [other, endpoint]); assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.endpoints)); assert.ok(Object.isFrozen(result.endpoints[0]));
});
test('closed, missing, ambiguous and unsupported Galaxy regions cannot become targets', () => {
  const source = makeSyntheticSessionLauncher([endpoint]), catalogs = candidate(source);
  for (const ordinal of [1, 2, 20]) assert.throws(() => bind(catalogs, 0, ordinal), { code: 'TARGET_REGION' });
  const duplicate = source.regions.replace('</Regions>', '<Region><Name>本地测试区</Name></Region></Regions>');
  assert.throws(() => bind(candidate({ ...source, regions: duplicate })), { code: 'TARGET_REGION' });
  const galaxy = source.regions.replace('<BList>', '<Galaxylist><Galaxy Name="Original" Gamecode="11">original</Galaxy></Galaxylist><BList>');
  assert.throws(() => bind(candidate({ ...source, regions: galaxy })), { code: 'TARGET_REGION' });
});
test('every BIP must be approved; empty/mixed targets are rejected without pruning', () => {
  const source = makeSyntheticSessionLauncher([endpoint, other]);
  assert.throws(() => bind(candidate(source)), { code: 'TARGET_DENIED' });
  assert.throws(() => bind(candidate(makeSyntheticSessionLauncher([endpoint])), 0, 3), { code: 'TARGET_DENIED' });
  assert.throws(() => bind(candidate({ ...source, regions: source.regions.replace(/<BList>.*?<\/BList>/, '') })), { code: 'TARGET_EMPTY' });
});
test('catalog hash/model mutations and inherited selection fields cannot grant a target', () => {
  const catalogs = candidate(makeSyntheticSessionLauncher([endpoint]));
  assert.throws(() => bindLauncherSessionTarget(Object.create({ catalogs, gameOrdinal: 0, referenceOrdinal: 0, allowedEndpoints: [endpoint] })), { code: 'TARGET_INPUT' });
  let accessed = false;
  assert.throws(() => bindLauncherSessionTarget({ get catalogs() { accessed = true; return catalogs; }, gameOrdinal: 0, referenceOrdinal: 0, allowedEndpoints: [endpoint] }), { code: 'TARGET_INPUT' });
  assert.equal(accessed, false);
  catalogs.gameListBytes[0] = 0; assert.throws(() => bind(catalogs), { code: 'TARGET_INPUT' });
  assert.equal(new LauncherTargetError({ toString() { throw new Error('Never coerce'); } }).code, 'TARGET_INPUT');
});
test('configuration code outside message slots is rejected before session creation', () => {
  const source = makeSyntheticSessionLauncher([endpoint]);
  assert.throws(() => bind(candidate({ ...source, games: source.games.replace('Code="11"', 'Code="15"') })), { code: 'TARGET_GAME' });
});
test('owned bootstrap source snapshots bytes, exposes fixed routes and disposes only its copies', () => {
  const fixture = makeSyntheticSessionLauncher([endpoint]), source = snapshotLauncherBootstrapSource(fixture.bootstrap);
  const original = fixture.bootstrap.gameListBytes.slice(), path = '/bootstrap/games';
  fixture.bootstrap.gameListBytes.fill(0);
  const copy = source.read(path, 'http://127.0.0.1:1'); assert.deepEqual(copy, original); copy.fill(0);
  assert.deepEqual(source.read(path, 'http://127.0.0.1:1'), original); assert.equal(source.read('/other', ''), null);
  source.dispose(); assert.equal(source.read(path, ''), null); source.dispose();
  assert.equal(fixture.bootstrap.regionListBytes.length > 0, true);
});
test('bootstrap source rejects getters, malformed options and oversized metadata before listening', async () => {
  const fixture = makeSyntheticSessionLauncher([endpoint]); let accessed = false;
  assert.throws(() => snapshotLauncherBootstrapSource({ ...fixture.bootstrap, get gameListBytes() { accessed = true; return utf8('x'); } }));
  assert.equal(accessed, false);
  for (const change of [{ encoding: 'automatic' }, { allowBareAmpersands: 1 }, { launcherDigestBytes: new Uint8Array(4097) }, { gameListBytes: new Uint8Array(0) }]) {
    await assert.rejects(createLauncherLoopbackServer({ endpoints: [endpoint], bootstrap: { ...fixture.bootstrap, ...change } }));
  }
});
test('actual local HTTP bootstrap prepares new pair which binds to the exact allowed target', async () => {
  const fixture = makeSyntheticSessionLauncher([endpoint]), server = await createLauncherLoopbackServer({ endpoints: [endpoint], bootstrap: fixture.bootstrap });
  try {
    const { runtime, result } = await prepare(server);
    assert.equal(runtime.schema, 'moli.loopback.v3'); assert.equal(result.disposition, 'catalogs-prepared');
    assert.equal(result.catalogs.games.declaredVersion, 'original-session-2');
    assert.equal(bind(result.catalogs).gameCodeText, '11');
    assert.equal(server.snapshot().connectionAttempts, 0);
    assert.equal((await fetch(server.origin + '/bootstrap/games', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
    assert.equal((await fetch(server.origin + '/bootstrap/package')).status, 404);
  } finally { await server.close(); }
});
test('actual self-update branch returns a validated candidate without a usable catalog or execution', async () => {
  const fixture = makeSyntheticSessionLauncher([endpoint]);
  const vector = JSON.parse(await readFile(new URL('../../analysis/launcher-v11/original-update-vectors.json', import.meta.url))).cases[1];
  const source = { ...fixture.bootstrap, launcherDigestBytes: utf8(vector.expected.md5), packageBytes: Uint8Array.from(Buffer.from(vector.archive_hex, 'hex')) };
  const server = await createLauncherLoopbackServer({ endpoints: [endpoint], bootstrap: source });
  try {
    const { result } = await prepare(server);
    assert.equal(result.disposition, 'launcher-update-candidate'); assert.equal(result.catalogs, null);
    assert.equal(result.update.digestMatches, true); assert.equal(result.update.crcVerified, true);
    assert.equal(result.update.replacement, 'not-performed'); assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});

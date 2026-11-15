import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { makeSyntheticSessionLauncher } from '../launcher-fixture.mjs';
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createWin32LauncherBootstrap } from '../launcher-bootstrap.mjs';
import { createCurrentPageFixture } from '../../analysis/launcher-current-page-v1/fixture.mjs';
import { createBrowserLauncherTransport } from '../launcher-websocket.mjs';
import { createLauncherSession } from '../launcher-session.mjs';
import { snapshotLauncherSourceProfile } from '../../shared/index.mjs';
import { WebSocket } from '../../adapters/node/vendor/ws/wrapper.mjs';

const endpoints = [{ address: '127.0.0.1', port: 9 }];
const text = value => new TextEncoder().encode(value);
const original = () => makeSyntheticSessionLauncher(endpoints).bootstrap;
async function open(sourceProfile, bootstrap = original()) {
  return createLauncherLoopbackServer({ endpoints, bootstrap, ...(sourceProfile === undefined ? {} : { sourceProfile }) });
}

test('explicit current bridge exposes one profile and admits its bounded cache-tick routes', async () => {
  const server = await open('win32-current');
  try {
    const runtime = await (await fetch(server.origin + '/runtime.json')).json();
    assert.equal(runtime.sourceProfile, 'win32-current');
    assert.equal(runtime.bootstrap.sourceProfile, 'win32-current');
    for (const route of ['/bootstrap/self', '/bootstrap/catalog-digests', '/bootstrap/games', '/bootstrap/regions']) {
      for (const tick of ['0', '4294967295']) assert.equal((await fetch(server.origin + route + '?rtm=' + tick)).status, 200);
    }
    for (const route of ['/runtime.json', '/web/login.html', '/bootstrap/local-launcher', '/bootstrap/local-games', '/bootstrap/package']) {
      assert.equal((await fetch(server.origin + route + '?rtm=1')).status, 404);
    }
    for (const query of ['?', '?x=1', '?rtm=-1', '?rtm=4294967296', '?rtm=01', '?rtm=1&rtm=2', '?rtm=1&x=2', '?%72tm=1', '?rtm=1.0']) {
      assert.equal((await fetch(server.origin + '/bootstrap/self' + query)).status, 404, query);
    }
    assert.equal(server.snapshot().connectionAttempts, 0);
  } finally { await server.close(); }
});

test('legacy default retains its query rejection and source selection is explicit', async () => {
  const server = await open();
  try {
    const runtime = await (await fetch(server.origin + '/runtime.json')).json();
    assert.equal(runtime.sourceProfile ?? 'legacy', 'legacy');
    assert.equal((await fetch(server.origin + '/bootstrap/self')).status, 200);
    assert.equal((await fetch(server.origin + '/bootstrap/self?rtm=1')).status, 404);
  } finally { await server.close(); }
});

test('unknown, inherited and accessor source profiles fail before listen without reading a getter', async () => {
  let reads = 0;
  const inputs = ['current', '', null, undefined, false, {}, 'WIN32-CURRENT'].map(sourceProfile => ({ endpoints, sourceProfile }));
  inputs.push(Object.assign(Object.create({ sourceProfile: 'win32-current' }), { endpoints }));
  inputs.push({ endpoints, get sourceProfile() { reads++; return 'win32-current'; } });
  for (const input of inputs) {
    let server;
    try { await assert.rejects(async () => { server = await createLauncherLoopbackServer(input); }, TypeError); }
    finally { await server?.close(); }
  }
  assert.equal(reads, 0);
});

test('current marker is request-only and an absent old catalog needs no local fetch', async () => {
  const server = await open('win32-current', { ...original(), localGameListBytes: null, localRegionListBytes: null, catalogDigestBytes: new Uint8Array() });
  try {
    const runtime = await (await fetch(server.origin + '/runtime.json')).json();
    const descriptor = runtime.bootstrap;
    assert.equal(descriptor.localInputs.gameList, null); assert.equal(descriptor.localInputs.regionList, null);
    const client = createLauncherHttpClient({ allowedOrigins: [server.origin] });
    const launcherBytes = (await client.getBytes(descriptor.localInputs.launcher, { kind: 'package' })).bytes;
    const result = await createWin32LauncherBootstrap({ httpClient: client, cacheTick: () => 17 }).prepare({
      launcherBytes, gameListBytes: null, regionListBytes: null, endpoints: descriptor.endpoints,
      encoding: descriptor.encoding, allowBareAmpersands: descriptor.allowBareAmpersands,
    });
    assert.equal(result.disposition, 'catalogs-prepared');
    assert.equal(result.comparison.gameList, 'unavailable'); assert.equal(result.comparison.regionList, 'unavailable');
    assert.equal(result.catalogDigestMetadata.bytes, 0); assert.equal(result.authentication, 'unverified');
    assert.equal((await fetch(server.origin + '/bootstrap/local-games')).status, 404);
  } finally { await server.close(); }
});

test('current update locator reports archive bytes and only prepares an original candidate', async () => {
  const vector = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-updater-v1/original-current-update-vectors.json', import.meta.url)))
    .cases.find(row => row.name === 'deflated-header');
  const packageBytes = Uint8Array.from(Buffer.from(vector.archive_hex, 'hex'));
  const server = await open('win32-current', { ...original(), launcherDigestBytes: text(vector.expected_md5), packageBytes });
  try {
    const runtime = await (await fetch(server.origin + '/runtime.json')).json(), descriptor = runtime.bootstrap;
    const locator = await (await fetch(descriptor.endpoints.updateLocator + '?rtm=1')).text();
    assert.equal(locator, server.origin + '/bootstrap/package ' + packageBytes.length);
    const client = createLauncherHttpClient({ allowedOrigins: [server.origin] });
    const local = await Promise.all(Object.values(descriptor.localInputs).map(url => client.getBytes(url, { kind: url.endsWith('launcher') ? 'package' : 'catalog' })));
    const result = await createWin32LauncherBootstrap({ httpClient: client, cacheTick: () => 1 }).prepare({
      launcherBytes: local[0].bytes, gameListBytes: local[1].bytes, regionListBytes: local[2].bytes,
      endpoints: descriptor.endpoints, encoding: descriptor.encoding, allowBareAmpersands: descriptor.allowBareAmpersands,
    });
    assert.equal(result.disposition, 'launcher-update-candidate'); assert.equal(result.catalogs, null);
    assert.equal(result.update.expectedArchiveBytes, packageBytes.length); assert.equal(result.update.replacement, 'not-performed');
    assert.equal(result.execution, 'not-performed'); assert.equal(result.authentication, 'unverified');
    assert.equal((await fetch(server.origin + '/bootstrap/package?rtm=1')).status, 404);
  } finally { await server.close(); }
});

for (const sourceProfile of ['legacy', 'win32-current']) {
  test(`runtime-selected ${sourceProfile} exchanges over actual WebSocket/TCP against an independent Python oracle`, async () => {
    const fixture = await createCurrentPageFixture({ sourceProfile });
    let session;
    try {
      const runtime = await (await fetch(fixture.origin + '/runtime.json')).json();
      const profile = snapshotLauncherSourceProfile(runtime);
      class BrowserSocket extends WebSocket { constructor(url, protocol) { super(url, protocol, { origin: fixture.origin }); } }
      const transport = createBrowserLauncherTransport({ ...runtime, WebSocket: BrowserSocket });
      session = createLauncherSession({ endpoints: runtime.endpoints, firstEndpointOrdinal: 0, requestCounter: 0,
        gameCode: 11, usernameBytes: text('SyntheticU1'), passwordBytes: text('SyntheticP1'),
        handshakeProfile: profile.handshakeProfile, openStream: transport.openStream });
      const result = await session.start(), peer = await fixture.done;
      assert.equal(result.snapshot.state, 'profiles'); assert.equal(result.choices.rows.length, 4);
      assert.equal(result.snapshot.authentication, 'unverified');
      assert.equal(result.snapshot.entropy, 'platform-csprng');
      assert.equal(peer.request_verified, true); assert.equal(peer.client_closed, true);
      assert.equal(peer.current_extra_block_verified, sourceProfile === 'win32-current');
      assert.equal(peer.record_cipher_bytes, sourceProfile === 'win32-current' ? 48 : 40);
      assert.ok(Object.isFrozen(profile));
    } finally { session?.cancel(); await fixture.close(); }
  });
}

test('current runtime rejects a mismatched public group before any synthetic account request', async () => {
  const fixture = await createCurrentPageFixture({ scenario: 'wrong-group' });
  let session;
  try {
    const runtime = await (await fetch(fixture.origin + '/runtime.json')).json();
    class BrowserSocket extends WebSocket { constructor(url, protocol) { super(url, protocol, { origin: fixture.origin }); } }
    const transport = createBrowserLauncherTransport({ ...runtime, WebSocket: BrowserSocket });
    session = createLauncherSession({ endpoints: runtime.endpoints, firstEndpointOrdinal: 0, requestCounter: 0, gameCode: 11,
      usernameBytes: text('SyntheticU1'), passwordBytes: text('SyntheticP1'), openStream: transport.openStream,
      handshakeProfile: snapshotLauncherSourceProfile(runtime).handshakeProfile });
    const result = await session.start(), peer = await fixture.done;
    assert.equal(result.snapshot.state, 'failed'); assert.equal(peer.request_verified, false);
    assert.equal(peer.group_rejected_before_request, true); assert.equal(peer.client_closed, true);
    assert.equal(result.snapshot.authentication, 'unverified');
  } finally { session?.cancel(); await fixture.close(); }
});

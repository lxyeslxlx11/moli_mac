/** Runs only an owned original loopback fixture and closes it after byte comparisons. */
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createLauncherMetadataPlan } from '../../shared/index.mjs';
import { createLauncherHttpFixtureServer, HTTP_FIXTURES } from '../tests/helpers/launcher-http-fixture.mjs';

const fixture = await createLauncherHttpFixtureServer();
try {
  const client = createLauncherHttpClient({ allowedOrigins: [fixture.origin] });
  const self = await client.getBytes(fixture.origin + '/self-digest');
  const pair = await client.getBytes(fixture.origin + '/catalog-digests');
  const inputs = { launcherBytes: HTTP_FIXTURES.launcher, launcherDigestResponseBytes: self.bytes,
    gameListBytes: HTTP_FIXTURES.gameList, regionListBytes: HTTP_FIXTURES.regionList, catalogDigestResponseBytes: pair.bytes };
  const before = createLauncherMetadataPlan(inputs);
  const candidate = await client.getBytes(fixture.origin + '/region', { kind: 'catalog' });
  const candidatePlan = createLauncherMetadataPlan({ ...inputs, regionListBytes: candidate.bytes });
  console.log(JSON.stringify({ requests: fixture.requests.length, initialDisposition: before.disposition,
    refreshOrder: before.catalogs.refreshOrder, candidateDisposition: candidatePlan.disposition,
    candidateBytes: candidate.byteLength, trust: candidate.trust, filesWritten: 0, authentication: candidatePlan.authentication }, null, 2));
} finally { await fixture.close(); }

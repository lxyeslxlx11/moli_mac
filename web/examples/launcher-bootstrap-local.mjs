/** Prepares original local HTTP catalogs; browser candidate storage is verified separately. */
import { createLauncherHttpClient } from '../launcher-http.mjs';
import { createLauncherBootstrap } from '../launcher-bootstrap.mjs';
import { BOOTSTRAP_FIXTURES, createLauncherBootstrapFixture } from '../tests/helpers/launcher-bootstrap-fixture.mjs';
const fixture = await createLauncherBootstrapFixture();
try {
  const bootstrap = createLauncherBootstrap({ httpClient: createLauncherHttpClient({ allowedOrigins: [fixture.origin] }) });
  const value = await bootstrap.prepare({ launcherBytes: BOOTSTRAP_FIXTURES.launcher, gameListBytes: BOOTSTRAP_FIXTURES.oldGames,
    regionListBytes: BOOTSTRAP_FIXTURES.oldRegions, endpoints: fixture.endpoints, encoding: 'utf-8', allowBareAmpersands: false });
  console.log(JSON.stringify({ disposition: value.disposition, requests: fixture.requests.length, refreshOrder: value.initialPlan.catalogs.refreshOrder,
    games: value.catalogs.games.games.length, regions: value.catalogs.regions.regions.length, trust: value.trust,
    authentication: value.authentication, execution: value.execution, cacheCommitted: false, originalFilesWritten: 0 }, null, 2));
} finally { await fixture.close(); }

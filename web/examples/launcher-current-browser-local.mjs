/** Current-source page with one independent original peer; never an official account or game session. */
import { createCurrentPageFixture } from '../../analysis/launcher-current-page-v1/fixture.mjs';
const args = process.argv.slice(2);
const sourceProfile = args.length === 0 ? 'win32-current' : args.length === 2 && args[0] === '--source-profile' ? args[1] : null;
if (!['legacy', 'win32-current'].includes(sourceProfile)) {
  console.error('Usage: node web/examples/launcher-current-browser-local.mjs [--source-profile legacy|win32-current]'); process.exit(1);
}
let fixture;
try {
  fixture = await createCurrentPageFixture({ sourceProfile, lifetimeSeconds: 600, port: 4176 });
  const stop = () => { void fixture.close().catch(() => { process.exitCode = 1; }); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  console.log(`Open ${fixture.origin}/`);
  console.log('Original fixture only: prepare catalogs, enter SyntheticU1 / SyntheticP1, read all4 original test texts, confirm, then start.');
  const result = await fixture.done;
  console.log(JSON.stringify({ originalPeerVerified: result.request_verified === true && result.client_closed === true,
    sourceProfile, currentExtraBlockVerified: result.current_extra_block_verified === true, stopped: result.stopped === true }));
} catch { console.error('Original current-page fixture could not complete.'); process.exitCode = 1; }
finally { await fixture?.close().catch(() => { process.exitCode = 1; }); }

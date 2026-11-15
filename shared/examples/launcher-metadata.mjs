import { readFileSync } from 'node:fs';
import { createLauncherMetadataPlan } from '../index.mjs';
const fixture = JSON.parse(readFileSync(new URL('../../analysis/launcher-v12/original-manifest-vectors.json', import.meta.url)));
const bytes = value => Uint8Array.from(Buffer.from(value, 'hex'));
const plan = createLauncherMetadataPlan({ launcherBytes: bytes(fixture.inputs.launcher_hex), launcherDigestResponseBytes: new TextEncoder().encode(fixture.inputs.launcher_md5),
  gameListBytes: bytes(fixture.inputs.game_list_hex), regionListBytes: bytes(fixture.inputs.region_list_hex), catalogDigestResponseBytes: bytes(fixture.catalog_plans[3].catalog_response_hex) });
console.log(JSON.stringify({ fixtureOnly: true, disposition: plan.disposition, refreshOrder: plan.catalogs.refreshOrder,
  trust: plan.trust, execution: plan.execution, authentication: plan.authentication }, null, 2));

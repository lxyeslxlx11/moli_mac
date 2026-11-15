/** Original local fixture only. Fetches and verifies candidates, then closes its loopback service; no installed client is accessed. */
import { createGamePatchFixture } from '../tests/helpers/launcher-game-patch-fixture.mjs';
import { prepareLauncherGamePatch } from '../launcher-game-patch.mjs';
const fixture = await createGamePatchFixture();
try {
  const result = await prepareLauncherGamePatch(fixture.input());
  console.log(JSON.stringify({ disposition:result.disposition, binding:result.binding, requests:result.requests,
    operations:result.candidate.operations, files:result.candidate.files.map(file => ({path:file.path,bytes:file.bytes.length})),
    trust:result.trust, authentication:result.authentication, replacement:result.replacement, execution:result.processPlan.execution },null,2));
} finally { await fixture.close(); }

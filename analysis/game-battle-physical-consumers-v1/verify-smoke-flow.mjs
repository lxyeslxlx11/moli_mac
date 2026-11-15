/** Source41f310 contract exercised through the supplied actual source or neutral generated API. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {physicalAssets} from '../../analysis/game-battle-physical-family-runtime-v1/original_assets.mjs';
import {physicalVectors} from '../../analysis/game-battle-physical-family-runtime-v1/reference.mjs';

const base = JSON.parse(readFileSync(new URL('../../analysis/game-resource-runtime-v1/original-vectors.json', import.meta.url)));
const context = {mainState:10, substate:6, controlFlags:0, localSlot:0, resourceCode:0, slowEffects:false};

export async function verifyReactionSmoke(api) {
  for (const action of [26, 160, 12]) {
    const files = originalFiles(physicalAssets(base, physicalVectors));
    const library = api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()), files:files.port, paletteMode:'neutral'});
    const bodies = api.createLegacyGameBattleBodies();
    try {
      await library.initialize();
      bodies.configurePlayback({animations:library.catalogs().animations, geometry:library.geometry, seed:12345,
        initialPhase:0, alternativeRenderer:false, staticFlip:false, screenOffset:[11,-7]});
      bodies.configureSkills({graphics:library.catalogs().graphics});
      bodies.applyCharacter(10, 0, 100080, [0,0], [70,100,10,10]);
      bodies.resetQueues(1 << 10);
      bodies.appendActions(10, 1, [action]);
      bodies.activate(10);
      for (let i=0; i<(action===12 ? 0 : 13); i++) bodies.stepPlayback(context);
      const before = bodies.copy(10), seed = bodies.copyPlayback().seed;
      bodies.stepPlayback(context);
      const after = bodies.copyPlayback(), smoke = after.nodes.filter(n=>n.kind==='puff');
      assert.equal(smoke.length, 1, 'first source-owned emission');
      if (action===12) {
        assert.notEqual(after.seed, seed, 'ordinary escape still uses its random position generator');
      } else {
        assert.equal(after.seed, seed, 'reaction factory makes no RNG call');
        assert.deepEqual(smoke[0].position, before.position, 'factory precedes the body movement in this callback');
        assert.deepEqual(smoke[0].screen, before.position.map(Math.trunc), '41f2d0 publishes truncated world coordinates without the body offset');
        assert.equal(smoke[0].parentId, null, 'source factory does not write a parent pointer');
        assert.equal(smoke[0].resourceId, 0x1adb6);
      }
    } finally {
      bodies.close();
      library.close();
      files.close();
    }
  }
}

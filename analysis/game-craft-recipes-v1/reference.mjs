/** Compare every exposed row and material with the independent byte-memory reference. */
import {readFileSync} from 'node:fs';
export const craftVectors = JSON.parse(readFileSync(new URL('./original-vectors.json', import.meta.url)));
export const craftBytes = hex => new Uint8Array(Buffer.from(hex, 'hex'));
export const craftProjection = value => ({
  profile: value.profile, slot: value.slot, version: value.version, contextMode: value.contextMode,
  recipes: value.recipes.map(row => ({
    index: row.index, fields: {...row.fields}, nameHex: Buffer.from(row.nameBytes).toString('hex'),
    descriptionHex: Buffer.from(row.descriptionBytes).toString('hex'),
    materials: row.materials.map(m => ({
      index: m.index, fields: {...m.fields}, nameHex: Buffer.from(m.nameBytes).toString('hex'),
    })),
  })),
});
export function verifyCraftReceives(api, assert, owner = 'core') {
  const state = owner === 'core' ? api.createLegacyGameCraftRecipes() : api.createLegacyGamePlayerSkills();
  try {
    for (const event of craftVectors.events) {
      if (event.kind === 'apply') {
        const result = owner === 'core' ? state.apply(event.slot, craftBytes(event.bytesHex)) :
          state.applyCraft(event.slot, craftBytes(event.bytesHex));
        assert.equal(result.kind, 'player-craft-recipes-updated');
        assert.deepEqual(result.requests, []);
      } else if (event.kind === 'reset') {
        if (owner === 'core') state.reset(event.slot);
        else state.apply('0x4f0290', null, new TextEncoder().encode(`${event.slot}|0||-1|-1|`));
      }
      const actual = owner === 'core' ? state.copy(event.slot) : state.copyCraft(event.slot);
      assert.deepEqual(craftProjection(actual), event.expected, event.label + '/' + owner);
    }
    return craftVectors.events.length;
  } finally { state.close(); }
}

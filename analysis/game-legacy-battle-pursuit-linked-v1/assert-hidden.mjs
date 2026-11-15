/** Portable rendering of the source animation helper's graphic-zero marker. */
import assert from 'node:assert/strict';

export function assertHiddenFrame(frame, playback) {
  const hidden = playback.nodes.filter(node => !node.deleted && node.resourceId >= 0 && node.resourceId < 1000 && node.animation?.graphicIndex === 0);
  assert.ok(hidden.length > 0, 'source reserved-resource hidden marker is present');
  const out = frame.step({ width: 640, height: 480 }, playback, 1000);
  for (const node of hidden) {
    assert.equal(node.animation.geometry, null);
    assert.ok(out.skipped.some(row => row.id === node.id && row.reason === 'graphic-empty'));
    assert.ok(!out.submitted.some(row => row.id === node.id));
  }
  return out;
}

/** Select source-corrected continuations of the archived stage219 vectors. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(path, import.meta.url));
const raw = read('../game-battle-attached-rid-v1/original-vectors.json');
const original = JSON.parse(raw);
const digest = createHash('sha256').update(raw).digest('hex');
const replacements = new Map();
for (const path of ['./retained-current-vectors.json', '../game-legacy-battle-rid0-flight-v1/reference.json']) {
  const receipt = JSON.parse(read(path));
  assert.equal(receipt.base_original.sha256, digest);
  for (const trace of receipt.traces) {
    assert.ok(!replacements.has(trace.case.name));
    replacements.set(trace.case.name, trace);
  }
}

export function currentAttachedRIDReference(v) {
  const traces = v.traces.map(trace => {
    const next = replacements.get(trace.case.name);
    if (!next) return trace;
    const source = original.traces.find(row => row.case.name === trace.case.name);
    const count = next.preserved_original_prefix_states;
    assert.deepEqual(trace.case, source.case);
    assert.deepEqual(next.case, source.case);
    assert.deepEqual(next.initial, source.initial);
    assert.deepEqual(next.states.slice(0, count), source.states.slice(0, count));
    return next;
  });
  return { ...v, traces };
}

/** Exact local reads and independent Python hash comparison; emits no source pixels. */
import assert from 'node:assert/strict';
import { readFile, open, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeRDRunModel, getRecord, frameRange } from '../../shared/index.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const sourceRoot = resolve(process.argv[2]);
const metadataPath = resolve(process.argv[3]);
const rawMetadata = await readFile(metadataPath), oracle = JSON.parse(rawMetadata);
assert.equal(oracle.schema, 'moli.rd-run-python-corpus.v1');
const sha = value => createHash('sha256').update(value).digest('hex');
const result = { schema: 'moli.rd-run-corpus-comparison.v1', oracleMetadataSha256: sha(rawMetadata), pairs: [],
  sourcePixelsExported: false, nativeOrVisualAcceptance: false, scope: 'structural-model-only' };
let compared = 0, rejected = 0;
for (const pair of oracle.pairs) {
  const identities = [];
  for (const expected of pair.sources) {
    const raw = await readFile(resolve(sourceRoot, expected.path));
    identities.push({ path: expected.path, bytes: raw.length, sha256: sha(raw) });
  }
  assert.deepEqual(identities, pair.sources);
  const index = await readFile(resolve(sourceRoot, pair.index));
  const source = await open(resolve(sourceRoot, pair.graphic), 'r');
  const summary = { graphic: pair.graphic, index: pair.index, sources: identities,
    recordCount: pair.recordCount, versions: pair.versions, compared: 0, accepted: 0, rejected: [],
    knownPixelBytes: 0, unknownPixelBytes: 0, knownPaletteBytes: 0, unknownPaletteBytes: 0, opcodeCounts: {},
    aggregateSha256: null };
  const aggregate = createHash('sha256');
  try {
    for (const row of pair.rows) {
      const record = getRecord(index, row.ordinal, { pairedByteCount: identities[0].bytes });
      assert.equal(record.id, row.id); assert.equal(record.byteOffset, row.offset);
      const range = frameRange(record, { pairedByteCount: identities[0].bytes });
      const bytes = new Uint8Array(range.byteLength);
      assert.equal((await source.read(bytes, 0, bytes.length, range.start)).bytesRead, bytes.length);
      if (row.status === 'rejected') {
        assert.throws(() => decodeRDRunModel(bytes, { record }), error => error.code === row.code);
        summary.rejected.push({ ordinal: row.ordinal, bytes: row.bytes, code: row.code }); rejected++;
        aggregate.update([row.ordinal, row.code].join('|') + '\n');
      } else {
        const decoded = decodeRDRunModel(bytes, { record });
        const observed = {
          pixelsSha256: sha(decoded.pixels), pixelKnownSha256: sha(decoded.pixelKnown),
          paletteSha256: sha(decoded.opaque.paletteBytes), paletteKnownSha256: sha(decoded.opaque.paletteKnown),
          knownPixelBytes: decoded.stats.knownPixelBytes, knownPaletteBytes: decoded.stats.knownPaletteBytes,
          literalBytes: decoded.stats.literalBytes, repeatBytes: decoded.stats.repeatBytes, unknownBytes: decoded.stats.unknownBytes,
          commandCount: decoded.stats.commandCount,
        };
        for (const [key, value] of Object.entries(observed)) assert.equal(value, row[key], pair.graphic + ':' + row.ordinal + ':' + key);
        for (const [opcode, count] of Object.entries(decoded.stats.opcodeCounts)) {
          assert.equal(count, row.opcodeCounts[opcode] ?? 0); summary.opcodeCounts[opcode] = (summary.opcodeCounts[opcode] ?? 0) + count;
        }
        assert.equal(decoded.consumedBytes, bytes.length); assert.equal(decoded.width, row.width); assert.equal(decoded.height, row.height);
        for (const key of ['knownPixelBytes', 'unknownPixelBytes', 'knownPaletteBytes', 'unknownPaletteBytes']) summary[key] += decoded.stats[key];
        summary.accepted++;
        aggregate.update([row.ordinal, ...Object.values(observed)].join('|') + '\n');
        decoded.pixels.fill(0); decoded.pixelKnown.fill(0); decoded.opaque.paletteBytes.fill(0); decoded.opaque.paletteKnown.fill(0);
      }
      bytes.fill(0); compared++; summary.compared++;
    }
  } finally { await source.close(); }
  summary.aggregateSha256 = aggregate.digest('hex');
  for (const identity of identities) {
    const raw = await readFile(resolve(sourceRoot, identity.path)); assert.equal(raw.length, identity.bytes); assert.equal(sha(raw), identity.sha256);
  }
  result.pairs.push(summary);
}
Object.assign(result, { compared, rejected, accepted: compared - rejected, allComparisonsMatched: true });
await writeFile(new URL('./corpus-comparison.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ compared, accepted: compared - rejected, rejected, allComparisonsMatched: true }));

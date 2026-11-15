// Explicit local integration-test adapter. Node IO is confined to this test helper.
// Usage: node shared/tests/validate-local-samples.mjs oracle.json index.bin graphic.bin
import { open, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { LIMITS, inspectIndex, getRecord, frameRange, decodeRD } from '../index.mjs';

const [oraclePath, indexPath, graphicPath, ...extra] = process.argv.slice(2);
assert.ok(oraclePath && indexPath && graphicPath && extra.length === 0, 'Provide exactly oracle, index, and graphic local paths.');
const oracle = JSON.parse(await readFile(oraclePath, 'utf8'));
const indexStat = await stat(indexPath);
assert.ok(indexStat.isFile() && indexStat.size <= LIMITS.indexBytes, 'Index must be a bounded regular file.');
const indexBytes = new Uint8Array(await readFile(indexPath));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
assert.equal(sha256(indexBytes), oracle.index_sha256);
const graphicStat = await stat(graphicPath);
assert.ok(graphicStat.isFile(), 'Graphic must be a regular file.');
assert.equal(graphicStat.size, oracle.graphic_bytes);
const summary = inspectIndex(indexBytes, { pairedByteCount: graphicStat.size });
assert.equal(summary.recordCount, oracle.total_records);
const file = await open(graphicPath, 'r');
const verified = [];
try {
  for (const expected of oracle.raw_records) {
    const record = getRecord(indexBytes, expected.record, { pairedByteCount: graphicStat.size });
    const range = frameRange(record, { pairedByteCount: graphicStat.size });
    const frameBytes = new Uint8Array(range.byteLength);
    let read = 0;
    while (read < frameBytes.length) {
      const result = await file.read(frameBytes, read, frameBytes.length - read, range.start + read);
      assert.ok(result.bytesRead > 0, 'Graphic frame truncated during test.');
      read += result.bytesRead;
    }
    const result = decodeRD(frameBytes, { record });
    const pixelSHA256 = sha256(result.pixels);
    const paletteSHA256 = result.opaque.paletteBytes.length ? sha256(result.opaque.paletteBytes) : null;
    assert.equal(result.version, expected.version);
    assert.equal(result.width, expected.width);
    assert.equal(result.height, expected.height);
    assert.equal(result.opaque.headerByte3, expected.opaque_byte3);
    assert.equal(result.opaque.headerWord12, expected.opaque_word12);
    assert.equal(result.pixels.length, expected.pixel_bytes);
    assert.equal(pixelSHA256, expected.pixel_sha256);
    assert.equal(result.opaque.paletteBytes.length, expected.candidate_palette_bytes);
    assert.equal(paletteSHA256, expected.candidate_palette_sha256);
    verified.push({ ordinal: record.ordinal, version: result.version, width: result.width, height: result.height,
      pixelSHA256, opaquePaletteBytes: result.opaque.paletteBytes.length, opaquePaletteSHA256: paletteSHA256 });
  }
} finally {
  await file.close();
}
console.log(JSON.stringify({ index: oracle.index, graphic: oracle.graphic, summary,
  checkedRawFrames: verified.length, status: 'all matched independent Python oracle', verified }, null, 2));

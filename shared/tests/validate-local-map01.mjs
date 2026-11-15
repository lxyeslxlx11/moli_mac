/** Explicit-path validation adapter only. Core modules have no Node/FS dependencies. */
import { open, constants } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parseMAP01, MAP01_LIMITS } from '../index.mjs';

async function readBounded(path, limit) {
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = await file.stat();
    if (!before.isFile() || before.size <= 0 || before.size > limit) throw new Error('Not a bounded regular file.');
    const bytes = new Uint8Array(before.size);
    let read = 0;
    while (read < bytes.length) {
      const result = await file.read(bytes, read, bytes.length - read, read);
      if (!result.bytesRead) throw new Error('Short read.');
      read += result.bytesRead;
    }
    const after = await file.stat();
    if (before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error('Input changed.');
    return bytes;
  } finally { await file.close(); }
}
const hash = value => createHash('sha256').update(value).digest('hex');
try {
  const [oraclePath, ...paths] = process.argv.slice(2);
  if (!oraclePath || paths.length !== 4) throw new Error('Usage: node shared/tests/validate-local-map01.mjs oracle.json map1 map2 map3 map4');
  const oracle = JSON.parse(new TextDecoder().decode(await readBounded(oraclePath, 65536)));
  if (oracle.schema !== 'moli.map01.fixed-oracle.v1' || !Array.isArray(oracle.rows) || oracle.rows.length !== 4) throw new Error('Wrong fixed oracle.');
  const rows = [];
  for (const [index, path] of paths.entries()) {
    const expected = oracle.rows[index];
    const bytes = await readBounded(path, MAP01_LIMITS.bytes);
    if (bytes.byteLength !== expected.bytes || hash(bytes) !== expected.sha256) throw new Error('Fixed sample identity mismatch.');
    const result = parseMAP01(bytes);
    const headerHex = Array.from(result.opaque.headerBytes4to11, byte => byte.toString(16).padStart(2, '0')).join('');
    if (result.width !== expected.candidate_width || result.height !== expected.candidate_height
      || headerHex !== expected.opaque_header_hex || result.opaque.bodyBytes.length !== expected.opaque_body_bytes
      || hash(result.opaque.bodyBytes) !== expected.opaque_body_sha256) throw new Error('Independent oracle comparison failed.');
    rows.push({ name: expected.name, sha256: expected.sha256, width: result.width, height: result.height,
      opaqueBodyBytes: result.opaque.bodyBytes.length, opaqueBodySha256: hash(result.opaque.bodyBytes), passed: true });
  }
  console.log(JSON.stringify({ fixedSamples: rows.length, passed: true, rows, limit: 'No plane/color/collision/coordinate semantics established.' }, null, 2));
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}

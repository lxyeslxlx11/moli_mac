/** Runs only the project's original synthetic ZIP vectors, never an installed client. */
import { readFileSync } from 'node:fs';
import { applyGamePatchCandidates } from '../index.mjs';
const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-v26/original-patch-vectors.json', import.meta.url)));
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex'));
for (const row of vectors.scenarios.filter(row => ['create-deflate', 'append-deflate', 'replaceto-deflate'].includes(row.name))) {
  const result = applyGamePatchCandidates({ manifestBytes: bytes(row.manifest_hex),
    files: row.files.map(file => ({ path: file.path, bytes: bytes(file.hex) })),
    archives: row.archives.map(archive => ({ blockOrdinal: archive.blockOrdinal, bytes: bytes(archive.hex) })) });
  console.log(JSON.stringify({ example: row.name, operations: result.operations,
    files: result.files.map(file => ({ path: file.path, bytes: file.bytes.length })),
    trust: result.trust, replacement: result.replacement, authentication: result.authentication }));
}

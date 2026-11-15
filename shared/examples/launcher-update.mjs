import { readFileSync } from 'node:fs';
import { decodeLauncherUpdatePackage } from '../index.mjs';
const row = JSON.parse(readFileSync(new URL('../../analysis/launcher-v11/original-update-vectors.json', import.meta.url))).cases[1];
const bytes = Uint8Array.from(Buffer.from(row.archive_hex, 'hex'));
const result = decodeLauncherUpdatePackage(bytes, { expectedMd5: row.expected.md5 });
console.log(JSON.stringify({ fixtureOnly: true, entryCount: result.archive.entries.length, candidateBytes: result.payloadBytes.length,
  method: result.entry.method, crcVerified: result.crcVerified, digestMatches: result.digestMatches,
  trust: result.trust, replacement: result.replacement, authentication: result.authentication }, null, 2));

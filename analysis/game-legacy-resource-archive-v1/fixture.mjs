import { readFileSync } from 'node:fs';
import { createLegacyGameResourceArchive } from '../../shared/legacy-game-resource-archive.mjs';
export const vectors = JSON.parse(readFileSync(new URL('./original-fixtures.json', import.meta.url)));
export const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex'));
export function sourceFor(raw, extra = {}) {
  const reads = [], returned = []; let closed = 0;
  return { input: { size: raw.length, async read(at, length) {
    reads.push([at, length]); await extra.beforeRead?.(at, length);
    const b = raw.slice(at, at + length); returned.push(b); return b;
  }, close() { closed++; } }, stats: { reads, returned, get closed() { return closed; } } };
}
export async function openCase(name, options, api = { createLegacyGameResourceArchive }) {
  const row = vectors.cases[name], raw = bytes(row.hex), source = sourceFor(raw);
  const archive = await api.createLegacyGameResourceArchive(source.input, options);
  return { raw, ...source, archive, expected: row.files?.map(f => ({ ...f,
    ...('payloadBytes' in f ? { bytesHex: vectors.payloadHex.slice(0, f.payloadBytes * 2) } : {}) })) };
}

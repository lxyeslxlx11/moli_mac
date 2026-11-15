import { source } from '../game-legacy-battle-audio-v1/reference.mjs';
import { cueBytes } from '../game-legacy-audio-v1/original-audio.mjs';
export function completeSoundRows() {
  const unique = new Map(source.catalog.map(row => [row.path, row]));
  return [...unique.values()].map(row => {
    const bytes = cueBytes(), view = new DataView(bytes.buffer);
    for (let at = 44; at < bytes.length; at += 2) view.setInt16(at, (row.id + 1) * 64, true);
    return { path: 'Bin/' + row.path, bytesHex: Buffer.from(bytes).toString('hex') };
  });
}

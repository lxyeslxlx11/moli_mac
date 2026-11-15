/** Extend the original test archives with an observable fall for the RID0 B actor. */
import { Buffer } from 'node:buffer';

export function rid0FallAssets(input) {
  const info = Buffer.from(input.files.find(row => row.path === 'Bin/AnimeInfo.bin').bytesHex, 'hex');
  const animation = Buffer.from(input.files.find(row => row.path === 'Bin/Anime.bin').bytesHex, 'hex');
  for (let index = 0; index < info.length; index += 12) {
    if (info.readUInt32LE(index) !== 100081) continue;
    let cursor = info.readUInt32LE(index + 4);
    const actions = info.readUInt16LE(index + 8);
    const header = info.readUInt16LE(index + 10) === 1 ? 20 : 12;
    for (let i = 0; i < actions; i++) {
      const action = animation.readUInt16LE(cursor + 2);
      const frames = animation.readUInt32LE(cursor + 8);
      cursor += header;
      for (let frame = 0; frame < frames; frame++, cursor += 10) {
        if (action === 0) animation.writeInt16LE(-16, cursor + 6);
      }
    }
    return { ...input, files: input.files.map(row => row.path === 'Bin/Anime.bin'
      ? { ...row, bytesHex: animation.toString('hex') } : row) };
  }
  throw new Error('RID0 test animation 100081 is missing');
}

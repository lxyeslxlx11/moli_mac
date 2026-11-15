/** Add the growth message's resource key to the synthetic status skill fixture. */
import { statusVariantFiles } from '../game-legacy-battle-status-variant-v1/original_assets.mjs';

export function statusSlotFiles() {
  const fixture = statusVariantFiles();
  const path = 'Bin/GraphicInfo.bin';
  const graphics = Buffer.from(fixture.files.find(row => row.path === path).bytesHex, 'hex');
  let source, index = 0;
  for (let at = 0; at < graphics.length; at += 40) {
    if (graphics.readUInt32LE(at + 36) === 0x5742) source = graphics.subarray(at, at + 40);
    index = Math.max(index, graphics.readUInt32LE(at) + 1);
  }
  const message = Buffer.from(source);
  message.writeUInt32LE(index, 0);
  message.writeUInt32LE(0x5784, 36);
  const bytesHex = Buffer.concat([graphics, message]).toString('hex');
  return { ...fixture, files: fixture.files.map(row => row.path === path ? { ...row, bytesHex } : row) };
}

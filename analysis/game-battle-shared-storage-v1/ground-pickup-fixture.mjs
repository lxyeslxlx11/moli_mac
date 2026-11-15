/** Original resource markers for local ground item and value-object fixtures. */
import { Buffer } from 'node:buffer';

export const groundItemResource = 87000;

export function groundPickupAssets(input) {
  const files = new Map(input.files.map(({ path, bytesHex }) => [path, Buffer.from(bytesHex, 'hex')]));
  const art = files.get('Bin/Graphic.bin');
  const info = files.get('Bin/GraphicInfo.bin');
  const palette = files.get('Bin/pal/palet_00.cgp');
  let index = 1000, offset = art.length;
  for (let at = 0; at < info.length; at += 40) index = Math.max(index, info.readUInt32LE(at) + 1);

  const images = [art], records = [info];
  const markers = [[groundItemResource, 70, [220, 88, 239]], [0x6b08, 71, [63, 201, 255]]];
  for (const [resource, entry, color] of markers) {
    const width = 12, height = 10;
    const rd = Buffer.alloc(16 + width * height, entry), row = Buffer.alloc(40);
    rd.set([82, 68, 0, 0]);
    rd.writeInt32LE(width, 4);
    rd.writeInt32LE(height, 8);
    rd.writeUInt32LE(rd.length, 12);
    [index, offset, rd.length, -6, -5, width, height].forEach((value, field) => row.writeInt32LE(value, field * 4));
    row.writeUInt32LE(resource, 36);
    palette.set(color, (entry - 16) * 3);
    images.push(rd);
    records.push(row);
    index++;
    offset += rd.length;
  }
  files.set('Bin/GraphicInfo.bin', Buffer.concat(records));
  files.set('Bin/Graphic.bin', Buffer.concat(images));
  return { ...input, files: [...files].map(([path, bytes]) => ({ path, bytesHex: bytes.toString('hex') })) };
}

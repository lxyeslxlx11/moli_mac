// Original synthetic data, created here to verify the parser and display path.
// No bytes, images or palette entries from official assets are embedded.
export function makeSyntheticPair() {
  const width = 64;
  const height = 48;
  const frame = new Uint8Array(16 + width * height);
  const header = new DataView(frame.buffer);
  frame.set([0x52, 0x44, 0, 0]);
  header.setUint32(4, width, true);
  header.setUint32(8, height, true);
  // This word is deliberately not interpreted as a byte length.
  header.setUint32(12, 0x12345678, true);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = Math.floor(x / 8) * 32;
      if (y >= 32) value = ((Math.floor(x / 4) + Math.floor((y - 32) / 4)) % 2) * 255;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) value = 255;
      frame[16 + y * width + x] = value;
    }
  }
  const index = new Uint8Array(40);
  const record = new DataView(index.buffer);
  record.setUint32(0, 1001, true);
  record.setUint32(4, 0, true);
  record.setUint32(8, frame.byteLength, true);
  record.setInt32(20, width, true);
  record.setInt32(24, height, true);
  return { index, frame };
}

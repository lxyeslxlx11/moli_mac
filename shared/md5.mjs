/** Internal compatibility digest. Callers provide owned, bounded Uint8Array input; never a trust decision. */
const constants = Object.freeze(Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0));
const shifts = Object.freeze([[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]].map(Object.freeze));
export function md5Hex(bytes) {
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  function block(view) {
    const initial = [a, b, c, d];
    for (let index = 0; index < 64; index += 1) {
      const round = index >>> 4;
      const f = round === 0 ? (b & c) | (~b & d) : round === 1 ? (b & d) | (~d & c) : round === 2 ? b ^ c ^ d : c ^ (b | ~d);
      const word = round === 0 ? index : round === 1 ? (5 * index + 1) % 16 : round === 2 ? (3 * index + 5) % 16 : (7 * index) % 16;
      const sum = (a + f + constants[index] + view.getUint32(word * 4, true)) >>> 0, shift = shifts[round][index % 4];
      const next = (b + ((sum << shift) | (sum >>> (32 - shift)))) >>> 0;
      a = d; d = c; c = b; b = next;
    }
    a = (a + initial[0]) >>> 0; b = (b + initial[1]) >>> 0; c = (c + initial[2]) >>> 0; d = (d + initial[3]) >>> 0;
  }
  let at = 0;
  for (; at + 64 <= bytes.length; at += 64) block(new DataView(bytes.buffer, bytes.byteOffset + at, 64));
  const tail = new Uint8Array(64), view = new DataView(tail.buffer), remaining = bytes.length - at;
  tail.set(bytes.subarray(at)); tail[remaining] = 0x80;
  if (remaining >= 56) { block(view); tail.fill(0); }
  view.setUint32(56, (bytes.length * 8) >>> 0, true); view.setUint32(60, Math.floor(bytes.length / 0x20000000), true); block(view);
  for (const [index, word] of [a, b, c, d].entries()) view.setUint32(index * 4, word, true);
  const result = Array.from(tail.subarray(0, 16), byte => byte.toString(16).padStart(2, '0')).join('');
  tail.fill(0); return result;
}

/**
 * Bounded RD v1/v3 structural model, inferred from the retained local corpus.
 * C/D/E runs have no assigned byte value. Their masks are zero; stored zero
 * bytes are placeholders, never a recovered palette index or alpha value.
 * This is deliberately separate from the observed raw decodeRD API.
 */
export const RD_RUN_MODEL = Object.freeze({
  id: 'rd-runs-structural-v1', scope: 'structural-model-only',
  inputBytes: 32 * 1024 * 1024, pixels: 4 * 1024 * 1024, paletteBytes: 768,
  versions: Object.freeze([1, 3]), opcodes: Object.freeze([0, 1, 8, 9, 10, 12, 13, 14]),
  gameConsumer: 'unverified', color: 'unverified', direction: 'unverified',
});

export class RDRunError extends Error {
  constructor(code) {
    super('RD input does not match the bounded structural run model.');
    this.name = 'RDRunError';
    this.code = code;
  }
}
const fail = code => { throw new RDRunError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const offsetOf = Object.getOwnPropertyDescriptor(typed, 'byteOffset').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;

function copyInput(value) {
  let buffer, length, offset = 0;
  try {
    if (value instanceof ArrayBuffer) {
      buffer = value;
      length = Reflect.apply(bufferLength, value, []);
    } else {
      if (!(value instanceof Uint8Array)) fail('RD_RUN_INPUT');
      buffer = Reflect.apply(bufferOf, value, []);
      Reflect.apply(bufferLength, buffer, []); // SharedArrayBuffer is not accepted.
      length = Reflect.apply(lengthOf, value, []);
      offset = Reflect.apply(offsetOf, value, []);
    }
    if (length > RD_RUN_MODEL.inputBytes) fail('RD_RUN_INPUT_BUDGET');
    return new Uint8Array(new Uint8Array(buffer, offset, length));
  } catch (error) {
    if (error instanceof RDRunError) throw error;
    fail('RD_RUN_INPUT');
  }
}

function selectedRecord(options) {
  if (options === undefined) return undefined;
  if (options === null || typeof options !== 'object') fail('RD_RUN_OPTIONS');
  let fields;
  try { fields = Object.getOwnPropertyDescriptors(options); }
  catch { fail('RD_RUN_OPTIONS'); }
  const names = Reflect.ownKeys(fields);
  if (names.length === 0) return undefined;
  if (names.length !== 1 || names[0] !== 'record' || !Object.hasOwn(fields.record, 'value')) fail('RD_RUN_OPTIONS');
  const record = fields.record.value;
  if (record === undefined) return undefined;
  let result;
  try {
    result = Object.fromEntries(['byteLength', 'width', 'height'].map(name => {
      const field = Object.getOwnPropertyDescriptor(record, name);
      if (!field || !Object.hasOwn(field, 'value')) fail('RD_RUN_RECORD');
      const value = field.value;
      if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) fail('RD_RUN_RECORD');
      return [name, value];
    }));
  } catch { fail('RD_RUN_RECORD'); }
  return result;
}

/**
 * Expand command positions with strict length checking. Known=1 means literal
 * or explicit repeat data; known=0 means an uninterpreted C/D/E run position.
 * Byte order in these arrays is stream order, without row or color transforms.
 */
export function decodeRDRunModel(input, options) {
  const record = selectedRecord(options);
  const source = copyInput(input);
  let pixels, pixelKnown, palette, paletteKnown, returned = false;
  try {
    if (source.length < 16) fail('RD_RUN_TRUNCATED');
    if (source[0] !== 0x52 || source[1] !== 0x44) fail('RD_RUN_MAGIC');
    const version = source[2];
    if (version !== 1 && version !== 3) fail('RD_RUN_VERSION');
    const headerBytes = version === 3 ? 20 : 16;
    if (source.length < headerBytes) fail('RD_RUN_TRUNCATED');
    const data = new DataView(source.buffer);
    const width = data.getUint32(4, true), height = data.getUint32(8, true);
    if (!width || !height) fail('RD_RUN_DIMENSIONS');
    if (width > RD_RUN_MODEL.pixels || height > Math.floor(RD_RUN_MODEL.pixels / width)) fail('RD_RUN_PIXEL_BUDGET');
    if (data.getUint32(12, true) !== source.length) fail('RD_RUN_LENGTH');
    if (record && (record.width !== width || record.height !== height || record.byteLength !== source.length)) fail('RD_RUN_RECORD_MISMATCH');
    const pixelBytes = width * height;
    const paletteBytes = version === 3 ? data.getUint32(16, true) : 0;
    if (version === 3 && (!paletteBytes || paletteBytes > RD_RUN_MODEL.paletteBytes || paletteBytes % 3 !== 0)) fail('RD_RUN_PALETTE');
    const expected = pixelBytes + paletteBytes;
    pixels = new Uint8Array(pixelBytes); pixelKnown = new Uint8Array(pixelBytes);
    palette = new Uint8Array(paletteBytes); paletteKnown = new Uint8Array(paletteBytes);
    let cursor = headerBytes, output = 0, commandCount = 0, literalBytes = 0, repeatBytes = 0, unknownBytes = 0;
    let knownPixelBytes = 0, knownPaletteBytes = 0;
    const opcodeCounts = Object.fromEntries(RD_RUN_MODEL.opcodes.map(opcode => [opcode.toString(16), 0]));
    while (cursor < source.length) {
      const command = source[cursor++], opcode = command >>> 4;
      if (!Object.hasOwn(opcodeCounts, opcode.toString(16))) fail('RD_RUN_OPCODE');
      const extensions = opcode & 3, repeat = opcode >= 8 && opcode <= 10, literal = opcode <= 1;
      if (source.length - cursor < extensions + Number(repeat)) fail('RD_RUN_TRUNCATED');
      const value = repeat ? source[cursor++] : 0;
      let count = command & 15;
      for (let i = 0; i < extensions; i++) count = count * 256 + source[cursor++];
      if (count === 0) fail('RD_RUN_ZERO_COUNT');
      if (count > expected - output) fail('RD_RUN_OVERRUN');
      if (literal && count > source.length - cursor) fail('RD_RUN_TRUNCATED');
      const pixelPart = Math.max(0, Math.min(count, pixelBytes - output));
      const palettePart = count - pixelPart;
      if (literal || repeat) {
        if (pixelPart) {
          if (literal) pixels.set(source.subarray(cursor, cursor + pixelPart), output);
          else pixels.fill(value, output, output + pixelPart);
          pixelKnown.fill(1, output, output + pixelPart);
        }
        if (palettePart) {
          const start = Math.max(0, output - pixelBytes);
          if (literal) palette.set(source.subarray(cursor + pixelPart, cursor + count), start);
          else palette.fill(value, start, start + palettePart);
          paletteKnown.fill(1, start, start + palettePart);
        }
        knownPixelBytes += pixelPart; knownPaletteBytes += palettePart;
      }
      if (literal) { cursor += count; literalBytes += count; }
      else if (repeat) repeatBytes += count;
      else unknownBytes += count;
      output += count; commandCount++; opcodeCounts[opcode.toString(16)]++;
    }
    if (output !== expected) fail('RD_RUN_UNDERRUN');
    const result = Object.freeze({
      profile: RD_RUN_MODEL.id, scope: RD_RUN_MODEL.scope, version, width, height,
      inputBytes: source.length, consumedBytes: cursor, pixels, pixelKnown,
      opaque: Object.freeze({ headerByte3: source[3], headerWord12: data.getUint32(12, true), paletteBytes: palette, paletteKnown }),
      stats: Object.freeze({ commandCount, literalBytes, repeatBytes, unknownBytes,
        knownPixelBytes, unknownPixelBytes: pixelBytes - knownPixelBytes,
        knownPaletteBytes, unknownPaletteBytes: paletteBytes - knownPaletteBytes,
        opcodeCounts: Object.freeze(opcodeCounts) }),
      gameConsumer: 'unverified', color: 'unverified', direction: 'unverified',
    });
    returned = true;
    return result;
  } finally {
    source.fill(0);
    if (!returned) { pixels?.fill(0); pixelKnown?.fill(0); palette?.fill(0); paletteKnown?.fill(0); }
  }
}

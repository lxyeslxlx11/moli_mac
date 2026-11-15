/** Fixed37c4 ordinary indexed-image path. Source contract: analysis/game-legacy-render-v1. */
import {snapshotLegacyGameWater,legacyGameWaterRows} from './legacy-game-water.mjs';
export const LEGACY_GAME_RENDER_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-indexed-render-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  inputBytes: 32 * 1024 * 1024, pixels: 4 * 1024 * 1024, paletteBytes: 768,
  commands: 4096, rasterOperations: 64 * 1024 * 1024,
});
export class LegacyGameRenderError extends Error {
  constructor(code) {
    super('Image data or drawing request is outside the supported legacy profile.');
    this.name = 'LegacyGameRenderError'; this.code = code;
  }
}
const fail = code => { throw new LegacyGameRenderError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const offsetOf = Object.getOwnPropertyDescriptor(typed, 'byteOffset').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const images = new WeakMap(), palettes = new WeakMap(), sprites = new WeakMap();
function inputView(value) {
  try {
    let buffer, length, offset = 0;
    if (value instanceof ArrayBuffer) {
      buffer = value; length = Reflect.apply(bufferLength, value, []);
    } else {
      if (!(value instanceof Uint8Array)) fail('LEGACY_RENDER_INPUT');
      buffer = Reflect.apply(bufferOf, value, []);
      Reflect.apply(bufferLength, buffer, []); // Reject shared memory.
      length = Reflect.apply(lengthOf, value, []); offset = Reflect.apply(offsetOf, value, []);
    }
    return new Uint8Array(buffer, offset, length);
  } catch (error) {
    if (error instanceof LegacyGameRenderError) throw error;
    fail('LEGACY_RENDER_INPUT');
  }
}
function bytes(value, maximum) {
  const view = inputView(value);
  if (view.length > maximum) fail('LEGACY_RENDER_INPUT_BUDGET');
  return new Uint8Array(view);
}
function integer(value, low, high) {
  if (!Number.isInteger(value) || value < low || value > high) fail('LEGACY_RENDER_INTEGER');
  return value;
}
function fields(value, required, optional = []) {
  let d;
  try { d = Object.getOwnPropertyDescriptors(value); } catch { fail('LEGACY_RENDER_FIELDS'); }
  const keys = Reflect.ownKeys(d);
  if (keys.some(k => !required.includes(k) && !optional.includes(k)) || required.some(k => !Object.hasOwn(d, k)) ||
      keys.some(k => !Object.hasOwn(d[k], 'value'))) fail('LEGACY_RENDER_FIELDS');
  return Object.fromEntries(keys.map(k => [k, d[k].value]));
}
function active(store, handle) {
  const s = store.get(handle);
  if (!s) fail('LEGACY_RENDER_HANDLE');
  if (s.closed) fail('LEGACY_RENDER_CLOSED');
  return s;
}
function dimensions(width, height) {
  integer(width, 1, LEGACY_GAME_RENDER_PROFILE.pixels);
  integer(height, 1, Math.floor(LEGACY_GAME_RENDER_PROFILE.pixels / width));
}
function imageHandle(width, height, flags, pixels, palette, extra) {
  const s = { closed: false, width, height, flags, pixels, palette, ...extra };
  const handle = Object.freeze({
    inspect() { const q = active(images, handle); return Object.freeze({ profile: LEGACY_GAME_RENDER_PROFILE.id,
      width, height, flags, rowOrder: 'bottom-up', paletteBytes: q.palette.length,
      headerByte3: q.headerByte3, headerWord12: q.headerWord12, consumedBytes: q.consumedBytes,
      ignoredBytes: q.ignoredBytes, stats: q.stats, graphic: q.graphic ?? null,
      renderableStride: width % 4 === 0, currentVersionCompatibility: 'unverified' }); },
    copyPixels() { return new Uint8Array(active(images, handle).pixels); },
    copyPalette() { return new Uint8Array(active(images, handle).palette); },
    close() { if (s.closed) return; s.closed = true; s.pixels.fill(0); s.palette.fill(0); },
  });
  images.set(handle, s); return handle;
}

/** Native 511470 flags/commands, with independent bounds and exact expansion checks. */
export function decodeLegacyGameRD(value) {
  const source = bytes(value, LEGACY_GAME_RENDER_PROFILE.inputBytes);
  let expanded;
  try {
    if (source.length < 16) fail('LEGACY_RD_TRUNCATED');
    if (source[0] !== 0x52 || source[1] !== 0x44) fail('LEGACY_RD_MAGIC');
    const flags = source[2], header = flags & 2 ? 20 : 16;
    if (source.length < header) fail('LEGACY_RD_TRUNCATED');
    const view = new DataView(source.buffer), width = view.getInt32(4, true), height = view.getInt32(8, true);
    dimensions(width, height);
    const count = width * height, paletteCount = flags & 2 ? view.getUint32(16, true) : 0;
    if (paletteCount > LEGACY_GAME_RENDER_PROFILE.paletteBytes) fail('LEGACY_RD_PALETTE_BUDGET');
    const expected = count + paletteCount, headerWord12 = view.getUint32(12, true);
    let cursor = header, output = 0, commands = 0, literalBytes = 0, repeatBytes = 0, zeroBytes = 0, zeroRuns = 0;
    const opcodeCounts = new Array(16).fill(0);
    expanded = new Uint8Array(expected);
    if (!(flags & 1)) {
      if (source.length - header < expected) fail('LEGACY_RD_TRUNCATED');
      expanded.set(source.subarray(header, header + expected)); cursor += expected; output = expected;
    } else {
      const end = headerWord12;
      if (end < header || end > source.length) fail('LEGACY_RD_LENGTH');
      while (cursor < end) {
        const command = source[cursor++], fill = (command & 128) !== 0, zero = fill && (command & 64) !== 0;
        let value = 0, run = command & 15;
        if (fill && !zero) { if (cursor >= end) fail('LEGACY_RD_TRUNCATED'); value = source[cursor++]; }
        const extensions = fill && (command & 32) ? 2 : command & 16 ? 1 : 0;
        if (end - cursor < extensions) fail('LEGACY_RD_TRUNCATED');
        for (let i = 0; i < extensions; i++) run = run * 256 + source[cursor++];
        if (run > expected - output) fail('LEGACY_RD_OVERRUN');
        if (fill) {
          expanded.fill(value, output, output + run);
          if (zero) zeroBytes += run; else repeatBytes += run;
        } else {
          if (end - cursor < run) fail('LEGACY_RD_TRUNCATED');
          expanded.set(source.subarray(cursor, cursor + run), output); cursor += run; literalBytes += run;
        }
        output += run; commands++; opcodeCounts[command >>> 4]++; if (!run) zeroRuns++;
      }
      if (output !== expected) fail('LEGACY_RD_UNDERRUN');
    }
    return imageHandle(width, height, flags, expanded.slice(0, count), expanded.slice(count), {
      headerByte3: source[3], headerWord12, consumedBytes: cursor, ignoredBytes: source.length - cursor,
      stats: Object.freeze({ commands, literalBytes, repeatBytes, zeroBytes, zeroRuns, opcodeCounts: Object.freeze(opcodeCounts) }),
    });
  } finally { source.fill(0); expanded?.fill(0); }
}

/** One caller-selected Graphic archive, using the opt-in catalog.image descriptor. */
export function decodeLegacyGameGraphic(archive, descriptor) {
  const d = fields(descriptor, ['resourceId', 'index', 'group', 'byteOffset', 'byteLength', 'originX', 'originY', 'width', 'height', 'present']);
  if (d.resourceId !== null) integer(d.resourceId, 0, 849999);
  integer(d.index, 0, 849999); integer(d.group, 0, 6);
  integer(d.byteOffset, 0, 0xffffffff); integer(d.byteLength, 0, LEGACY_GAME_RENDER_PROFILE.inputBytes);
  integer(d.originX, -32768, 32767); integer(d.originY, -32768, 32767);
  integer(d.width, 0, 65535); integer(d.height, 0, 65535);
  if (d.present !== true) fail('LEGACY_GRAPHIC_IMAGE_MISSING');
  const view = inputView(archive);
  if (d.byteOffset > view.length || d.byteLength > view.length - d.byteOffset) fail('LEGACY_GRAPHIC_IMAGE_RANGE');
  const image = decodeLegacyGameRD(view.subarray(d.byteOffset, d.byteOffset + d.byteLength));
  const s = images.get(image); s.graphic = Object.freeze(d);
  // The native decoder uses RD dimensions. Preserve index dimensions as metadata.
  return image;
}

const FIXED_RGB = [
  [0,0,0],[128,0,0],[0,128,0],[128,128,0],[0,0,128],[128,0,128],[0,128,128],[192,192,192],
  [192,220,192],[166,202,240],[222,0,0],[255,95,0],[255,255,160],[0,95,210],[80,210,255],[40,225,40],
  [245,195,150],[225,160,95],[195,125,70],[155,85,30],[70,65,55],[40,35,30],[255,251,240],[160,160,164],
  [128,128,128],[255,0,0],[0,255,0],[255,255,0],[0,0,255],[255,0,255],[0,255,255],[255,255,255],
];
/** 449cf0 first-load CGP projection. Trailing bytes are counted, never interpreted. */
export function decodeLegacyGameCGP(value) {
  const source = bytes(value, LEGACY_GAME_RENDER_PROFILE.inputBytes);
  try {
    if (source.length < 672) fail('LEGACY_CGP_TRUNCATED');
    const originalRGB = new Uint8Array(768);
    for (let i = 0; i < 16; i++) { originalRGB.set(FIXED_RGB[i], i * 3); originalRGB.set(FIXED_RGB[i + 16], (i + 240) * 3); }
    for (let i = 0; i < 224; i++) {
      const at = (i + 16) * 3; originalRGB[at] = source[i * 3 + 2];
      originalRGB[at + 1] = source[i * 3 + 1]; originalRGB[at + 2] = source[i * 3];
    }
    const currentRGB = new Uint8Array(originalRGB); currentRGB.fill(0, 168 * 3, 169 * 3);
    let closed = false;
    const check = () => { if (closed) fail('LEGACY_RENDER_CLOSED'); };
    return Object.freeze({
      inspect() { check(); return Object.freeze({ profile: LEGACY_GAME_RENDER_PROFILE.id, consumedBytes: 672,
        ignoredBytes: source.length - 672, currentBlackIndex: 168 }); },
      copyOriginalRGB() { check(); return new Uint8Array(originalRGB); },
      copyCurrentRGB() { check(); return new Uint8Array(currentRGB); },
      close() { if (closed) return; closed = true; originalRGB.fill(0); currentRGB.fill(0); },
    });
  } finally { source.fill(0); }
}

/** 449cf0 default32 or 447b10 explicit32. LUTs, when supplied, are source context. */
export function createLegacyGamePalette32(value, mode, transforms) {
  if (!['default-rgb', 'explicit-rgb', 'embedded-bgr'].includes(mode)) fail('LEGACY_PALETTE_MODE');
  const source = bytes(value, 768), luts = [];
  try {
    if (mode !== 'embedded-bgr' && source.length !== 768) fail('LEGACY_PALETTE_LENGTH');
    if (transforms !== undefined) {
      if (mode === 'default-rgb') fail('LEGACY_PALETTE_DEFAULT_LUT');
      const d = fields(transforms, ['red', 'green', 'blue']);
      for (const key of ['red', 'green', 'blue']) { const lut = bytes(d[key], 256); luts.push(lut); if (lut.length !== 256) fail('LEGACY_PALETTE_LUT'); }
    }
    const colors = new Uint32Array(256), known = new Uint8Array(256), entries = Math.floor(source.length / 3);
    for (let i = 0; i < entries; i++) {
      const at = i * 3, embedded = mode === 'embedded-bgr';
      let r = source[at + (embedded ? 2 : 0)], g = source[at + 1], b = source[at + (embedded ? 0 : 2)];
      if (luts.length && (embedded || (i >= 16 && i < 240))) { r = luts[0][r]; g = luts[1][g]; b = luts[2][b]; }
      const word = r * 65536 + g * 256 + b; colors[i] = word === 0 && mode !== 'default-rgb' ? 1 : word; known[i] = 1;
    }
    colors[0] = 0; known[0] = 1;
    const s = { closed: false, colors, known, mode, entries, unusedTailBytes: source.length % 3 };
    const handle = Object.freeze({
      inspect() { const q = active(palettes, handle); return Object.freeze({ profile: LEGACY_GAME_RENDER_PROFILE.id,
        mode, completeTriples: entries, unusedTailBytes: q.unusedTailBytes, transformed: luts.length !== 0 }); },
      copyColors() { return new Uint32Array(active(palettes, handle).colors); },
      copyKnownMask() { return new Uint8Array(active(palettes, handle).known); },
      close() { if (s.closed) return; s.closed = true; colors.fill(0); known.fill(0); },
    });
    palettes.set(handle, s); return handle;
  } finally { source.fill(0); for (const lut of luts) lut.fill(0); }
}

/** Ordinary native32 upload: source rows descend; native surface color key is zero. */
export function prepareLegacyGameSprite(image, palette) {
  const s = active(images, image), p = active(palettes, palette);
  if (s.width > 32767 || s.height > 32767) fail('LEGACY_RENDER_DIMENSIONS_UNPROVEN');
  if (s.width % 4 !== 0) fail('LEGACY_RENDER_STRIDE_UNPROVEN');
  const rgba = new Uint8Array(s.width * s.height * 4);
  try {
    for (let y = 0; y < s.height; y++) for (let x = 0; x < s.width; x++) {
      const index = s.pixels[(s.height - 1 - y) * s.width + x];
      if (!p.known[index]) fail('LEGACY_RENDER_UNKNOWN_COLOR');
      const color = p.colors[index], at = (y * s.width + x) * 4;
      rgba[at] = color >>> 16; rgba[at + 1] = color >>> 8; rgba[at + 2] = color; rgba[at + 3] = color ? 255 : 0;
    }
  } catch (error) { rgba.fill(0); throw error; }
  return ownPreparedSprite(s.width,s.height,rgba);
}

function ownPreparedSprite(width,height,rgba) {
  const q = { closed: false, width, height, rgba };
  const handle = Object.freeze({
    inspect() { active(sprites, handle); return Object.freeze({ profile: LEGACY_GAME_RENDER_PROFILE.id,
      width: q.width, height: q.height, rowOrder: 'top-down', format: 'RGBA8', scope: 'ordinary-native32' }); },
    copyRGBA() { return new Uint8Array(active(sprites, handle).rgba); },
    close() { if (q.closed) return; q.closed = true; rgba.fill(0); },
  });
  sprites.set(handle, q); return handle;
}

// 44abe0 writes color index zero into the destination surface for the GMN border.
export function prepareLegacyGameBlackSprite() {
  return ownPreparedSprite(1,1,Uint8Array.of(0,0,0,255));
}

/** The four opaque pixels of the fixed32 type-one weather primitive. */
export function prepareLegacyGameRainSprite(rgb) {
  integer(rgb,0,0xffffff);
  const rgba=new Uint8Array(2*4*4);
  const color=[rgb>>>16,(rgb>>>8)&255,rgb&255,255];
  for(const offset of [0,8,20,28])rgba.set(color,offset);
  return ownPreparedSprite(2,4,rgba);
}

/** Internal source-animation bridge; verifies an owned prepared-sprite handle. */
export function legacyGamePreparedSpriteDimensions(sprite) {
  const s = active(sprites, sprite); return Object.freeze({ width: s.width, height: s.height });
}

/** Original portable framebuffer adapter for the source ordinary full-sprite path. */
export function composeLegacyGameFrame(width, height, commands, initialRGBA=undefined) {
  dimensions(width, height);
  if (!Array.isArray(commands)) fail('LEGACY_RENDER_COMMANDS');
  let d;
  try { d = Object.getOwnPropertyDescriptors(commands); } catch { fail('LEGACY_RENDER_COMMANDS'); }
  const count = d.length?.value;
  integer(count, 0, LEGACY_GAME_RENDER_PROFILE.commands);
  if (Reflect.ownKeys(d).length !== count + 1) fail('LEGACY_RENDER_COMMANDS');
  const queue = []; let work = 0;
  const short = n => (n << 16) >> 16;
  for (let ordinal = 0; ordinal < count; ordinal++) {
    if (!Object.hasOwn(d[ordinal] ?? {}, 'value')) fail('LEGACY_RENDER_COMMANDS');
    const value=d[ordinal].value;
    if(value&&Object.hasOwn(value,'waterStrip')){
      const c=fields(value,['waterStrip','priority']);integer(c.priority,2,2);
      const rows=legacyGameWaterRows(snapshotLegacyGameWater(c.waterStrip));
      // Source uses a fixed640x480 temporary surface. Smaller portable viewports
      // crop that surface; outside the viewport the temporary pixels are zero.
      work+=640*480+rows.filter(y=>y>=0&&y+8<=480).length*640*8;
      if(work>LEGACY_GAME_RENDER_PROFILE.rasterOperations)fail('LEGACY_RENDER_WORK_BUDGET');
      queue.push({water:rows,priority:2,ordinal});continue;
    }
    const c = fields(d[ordinal].value, ['sprite', 'x', 'y', 'priority'], ['originX', 'originY', 'flip', 'sourceRectangle','coordinateMode','scale','opacity','blend','color']);
    if(Object.hasOwn(c,'blend')&&!['source-over','additive'].includes(c.blend))fail('LEGACY_RENDER_BLEND');
    const blend=c.blend??'source-over';
    if(Object.hasOwn(c,'coordinateMode')&&c.coordinateMode!=='int32')fail('LEGACY_RENDER_COORDINATE_MODE');
    const destination=c.coordinateMode==='int32'?n=>n|0:short;
    const s = active(sprites, c.sprite), flip = integer(c.flip ?? 0, 0, 3),color=Object.hasOwn(c,'color')?integer(c.color,0,0xffffffff):0xffffffff;
    // Source ARGB is per draw. Byte rounding and transparent framebuffer coverage
    // are portable choices, documented in analysis/game-vertex-color-v1.
    const opacity=Math.floor(((Object.hasOwn(c,'opacity')?integer(c.opacity,0,255):255)*(color>>>24)+127)/255),tint=[color>>>16&255,color>>>8&255,color&255];let scaleX=1,scaleY=1;
    if(Object.hasOwn(c,'scale')){let sd;try{sd=Object.getOwnPropertyDescriptors(c.scale);}catch{fail('LEGACY_RENDER_SCALE');}
      if(!Array.isArray(c.scale)||sd.length?.value!==2||Reflect.ownKeys(sd).length!==3||[0,1].some(i=>!Object.hasOwn(sd[i]??{},'value')))fail('LEGACY_RENDER_SCALE');
      const values=[0,1].map(i=>{const n=sd[i].value;if(typeof n!=='number'||!Number.isFinite(n)||n<0||!Number.isFinite(Math.fround(n)))fail('LEGACY_RENDER_SCALE');return Math.fround(n);});[scaleX,scaleY]=values;
    }
    let x = destination(integer(c.x, -2147483648, 2147483647) + integer(c.originX ?? 0, -32768, 32767));
    let y = destination(integer(c.y, -2147483648, 2147483647) + integer(c.originY ?? 0, -32768, 32767));
    let sourceX=0,sourceY=0,sourceWidth=s.width,sourceHeight=s.height;
    if(Object.hasOwn(c,'sourceRectangle')){
      let rect;try{rect=Object.getOwnPropertyDescriptors(c.sourceRectangle);}catch{fail('LEGACY_RENDER_SOURCE_RECTANGLE');}
      if(!Array.isArray(c.sourceRectangle)||rect.length?.value!==4||Reflect.ownKeys(rect).length!==5||[0,1,2,3].some(i=>!Object.hasOwn(rect[i]??{},'value')))fail('LEGACY_RENDER_SOURCE_RECTANGLE');
      [sourceX,sourceY,sourceWidth,sourceHeight]=[0,1,2,3].map(i=>integer(rect[i].value,-32768,32767));
      // Native506030 intersects the source box before tile copies; negative starts shift destination.
      if(sourceX<0){x-=Math.trunc(sourceX*scaleX);sourceWidth+=sourceX;sourceX=0;}if(sourceY<0){y-=Math.trunc(sourceY*scaleY);sourceHeight+=sourceY;sourceY=0;}
      sourceWidth=Math.max(0,Math.min(sourceWidth,s.width-sourceX));sourceHeight=Math.max(0,Math.min(sourceHeight,s.height-sourceY));
      if(flip&1)x+=Math.trunc((s.width-sourceWidth)*scaleX);if(flip&2)y+=Math.trunc((s.height-sourceHeight)*scaleY);
      if(c.coordinateMode==='int32'){x|=0;y|=0;}
    }
    // 447330 supplies integer rectangle endpoints. Sampling here is the portable
    // nearest-neighbor policy, not a claim about a particular DDRAW/D3D driver.
    const destinationRight=Math.trunc(x+sourceWidth*scaleX),destinationBottom=Math.trunc(y+sourceHeight*scaleY);
    if(!Number.isSafeInteger(destinationRight)||!Number.isSafeInteger(destinationBottom)||((scaleX!==1||scaleY!==1)&&(destinationRight< -2147483648||destinationRight>2147483647||destinationBottom< -2147483648||destinationBottom>2147483647)))fail('LEGACY_RENDER_SCALE_RANGE');
    const destinationWidth=destinationRight-x,destinationHeight=destinationBottom-y;
    const priority = integer(c.priority, 0, 255), left = Math.max(0, x), top = Math.max(0, y);
    const right = Math.min(width, destinationRight), bottom = Math.min(height, destinationBottom);
    work += Math.max(0, right - left) * Math.max(0, bottom - top);
    if (work > LEGACY_GAME_RENDER_PROFILE.rasterOperations) fail('LEGACY_RENDER_WORK_BUDGET');
    queue.push({ s, x, y, flip, opacity, tint, blend, priority, ordinal, left, top, right, bottom,sourceX,sourceY,sourceWidth,sourceHeight,destinationWidth,destinationHeight });
  }
  if (queue.some(c => c.s?.closed)) fail('LEGACY_RENDER_CLOSED');
  queue.sort((a, b) => a.priority - b.priority || b.ordinal - a.ordinal);
  const rgba = initialRGBA===undefined?new Uint8Array(width * height * 4):bytes(initialRGBA,width*height*4);
  if(rgba.length!==width*height*4){rgba.fill(0);fail('LEGACY_RENDER_FRAME_LENGTH');}
  for (const c of queue) {
    if(c.water){
      const snapshot=new Uint8Array(640*480*4),copyWidth=Math.min(width,640),copyHeight=Math.min(height,480);
      try{
        for(let y=0;y<copyHeight;y++)snapshot.set(rgba.subarray(y*width*4,(y*width+copyWidth)*4),y*640*4);
        for(let i=0;i<60;i++){const fromY=c.water[i],toY=i*8;
          // BltFast cannot clip; an invalid native source strip leaves its
          // destination untouched. Only the final portable viewport is cropped.
          if(fromY<0||fromY+8>480)continue;
          for(let row=0;row<8&&toY+row<copyHeight;row++)rgba.set(snapshot.subarray((fromY+row)*640*4,((fromY+row)*640+copyWidth)*4),(toY+row)*width*4);
        }
      }finally{snapshot.fill(0);}continue;
    }
    for (let y = c.top; y < c.bottom; y++) for (let x = c.left; x < c.right; x++) {
    const dx=Math.min(c.sourceWidth-1,Math.floor((x-c.x)*c.sourceWidth/c.destinationWidth)),dy=Math.min(c.sourceHeight-1,Math.floor((y-c.y)*c.sourceHeight/c.destinationHeight));
    const sx = c.sourceX+(c.flip & 1 ? c.sourceWidth - 1 - dx : dx);
    const sy = c.sourceY+(c.flip & 2 ? c.sourceHeight - 1 - dy : dy);
    const from = (sy * c.s.width + sx) * 4, to = (y * width + x) * 4;
    if (c.s.rgba[from + 3]&&(c.opacity||c.blend==='additive')) {
      if(c.blend==='additive'){
        // Source446e00/447330 select ONE+ONE before the vertex-alpha branch.
        for(let channel=0;channel<3;channel++)rgba[to+channel]=Math.min(255,rgba[to+channel]+Math.floor((c.s.rgba[from+channel]*c.tint[channel]+127)/255));
        rgba[to+3]=255;
      }else if(c.opacity===255){for(let channel=0;channel<3;channel++)rgba[to+channel]=Math.floor((c.s.rgba[from+channel]*c.tint[channel]+127)/255);rgba[to+3]=255;}
      else {const a=c.opacity,da=rgba[to+3],inv=255-a,den=a*255+da*inv;
        // Portable straight-alpha source-over; original DDRAW/D3D rounding is unverified.
        for(let channel=0;channel<3;channel++){const src=Math.floor((c.s.rgba[from+channel]*c.tint[channel]+127)/255);rgba[to+channel]=Math.floor((src*a*255+rgba[to+channel]*da*inv+den/2)/den);}
        rgba[to+3]=Math.floor((den+127)/255);}
    }
  }
  }
  return Object.freeze({ profile: LEGACY_GAME_RENDER_PROFILE.id, width, height, format: 'RGBA8',
    rgba, drawOrder: Object.freeze(queue.map(c => c.ordinal)), rasterOperations: work,
    currentVersionCompatibility: 'unverified' });
}

import { LAUNCHER_LIMITS } from '../shared/index.mjs';

export const LAUNCHER_FILE_BYTES = 4 * LAUNCHER_LIMITS.catalogChars;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
export async function readLauncherCatalogBytes(file) {
  const size = file?.size;
  if (!file || !Number.isSafeInteger(size) || size <= 0 || size > LAUNCHER_FILE_BYTES || typeof file.slice !== 'function') {
    throw new Error('配置必须为非空本地文件，大小不超过 1 MiB。');
  }
  const buffer = await file.slice(0, size).arrayBuffer();
  let actual;
  try { actual = Reflect.apply(bufferLength, buffer, []); } catch { throw new Error('配置读取未返回完整字节。'); }
  if (actual !== size || file.size !== size) throw new Error('配置读取不完整，请重新选择稳定副本。');
  return new Uint8Array(new Uint8Array(buffer));
}
export async function readLauncherText(file, encoding) {
  if (!['gb18030', 'utf-8'].includes(encoding)) throw new Error('请选择受支持的文本编码。');
  return new TextDecoder(encoding, { fatal: true }).decode(await readLauncherCatalogBytes(file));
}

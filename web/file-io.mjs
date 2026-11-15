import { LIMITS } from '../shared/index.mjs';

function requireFileShape(file) {
  if (!file || !Number.isSafeInteger(file.size) || file.size < 0 || typeof file.slice !== 'function') {
    throw new Error('请选择有效的本地文件。');
  }
}

export async function readIndexFile(file) {
  requireFileShape(file);
  if (!file.size || file.size > LIMITS.indexBytes || file.size % LIMITS.recordBytes !== 0) {
    throw new Error('索引必须非空、包含完整的 40 字节记录，且不超过 64 MiB。');
  }
  const bytes = new Uint8Array(await file.slice(0, file.size).arrayBuffer());
  if (bytes.byteLength !== file.size) throw new Error('索引读取长度发生变化，请重新选择稳定副本。');
  return bytes;
}

export async function readFrameFile(file, range) {
  requireFileShape(file);
  if (!range || ![range.start, range.end, range.byteLength].every(Number.isSafeInteger) ||
      range.start < 0 || range.byteLength <= 0 || range.end <= range.start ||
      range.end - range.start !== range.byteLength || range.end > file.size ||
      range.byteLength > LIMITS.frameBytes) {
    throw new Error('记录范围无效、超过配对文件，或超过单帧读取上限。');
  }
  const bytes = new Uint8Array(await file.slice(range.start, range.end).arrayBuffer());
  if (bytes.byteLength !== range.byteLength) throw new Error('图形记录读取不完整，请重新选择稳定副本。');
  return bytes;
}

export function formatBytes(value) {
  if (value < 1024) return `${value.toLocaleString('zh-CN')} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MiB`;
}

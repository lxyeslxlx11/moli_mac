/** Keep the explicitly chosen archive in the native filesystem; read bounded slices. */
import { createLegacyGameResourceArchive } from '../../shared/legacy-game-resource-archive.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { weChatSignal } from './launcher-control.mjs';
import { WeChatLauncherFileError } from './launcher-local-file.mjs';
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const fail = code => { throw new WeChatLauncherFileError(code); };

export async function createWeChatLegacyGameResourceArchive({ wx, signal, clock = createWeChatDeadlineClock(), timeoutMs = 60000 } = {}) {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) fail('FILE_INPUT');
  let external;
  try { external = weChatSignal(signal); } catch { fail('FILE_INPUT'); }
  if (external?.aborted()) fail('FILE_ABORTED');
  if (typeof wx?.chooseMessageFile !== 'function' || typeof wx.getFileSystemManager !== 'function') fail('FILE_CAPABILITY');
  let fs;
  try { fs = wx.getFileSystemManager(); } catch { fail('FILE_CAPABILITY'); }
  if (typeof fs?.stat !== 'function' || typeof fs.readFile !== 'function') fail('FILE_CAPABILITY');
  let closed = false;
  const pending = new Set();
  function close() {
    if (closed) return; closed = true; external?.remove(close);
    for (const job of [...pending]) job.reject(new WeChatLauncherFileError('FILE_ABORTED'));
  }
  function invoke(target, name, args) {
    if (closed) return Promise.reject(new WeChatLauncherFileError('FILE_ABORTED'));
    return new Promise((resolve, reject) => {
      let timer = null, settled = false;
      const finish = (error, value) => {
        if (settled) {
          if (value?.data instanceof ArrayBuffer) new Uint8Array(value.data).fill(0);
          return;
        }
        settled = true; pending.delete(job); if (timer !== null) clock.clearTimer(timer);
        if (error) reject(error); else resolve(value);
      };
      const job = { reject: error => finish(error) }; pending.add(job);
      timer = clock.setTimer(() => finish(new WeChatLauncherFileError('FILE_TIMEOUT')), timeoutMs);
      try {
        target[name]({ ...args, success: result => finish(null, result), fail: () => finish(new WeChatLauncherFileError('FILE_READ')) });
      } catch { finish(new WeChatLauncherFileError('FILE_READ')); }
    });
  }
  external?.add(close);
  if (external?.aborted()) close();
  try {
    const selected = await invoke(wx, 'chooseMessageFile', { count: 1, type: 'file', extension: ['zip'] });
    const file = selected?.tempFiles?.length === 1 && selected.tempFiles[0];
    if (!file || typeof file.path !== 'string' || !file.path.length || file.path.length > 4096 || !Number.isSafeInteger(file.size) || file.size < 22) fail('FILE_SIZE');
    const status = await invoke(fs, 'stat', { path: file.path, recursive: false });
    if (typeof status?.stats?.isFile !== 'function' || !status.stats.isFile() || status.stats.size !== file.size) fail('FILE_SIZE');
    return await createLegacyGameResourceArchive({ size: file.size,
      async read(position, length) {
        if (closed) fail('FILE_ABORTED');
        if (length === 0) return new Uint8Array();
        const result = await invoke(fs, 'readFile', { filePath: file.path, position, length });
        let data;
        try {
          const size = Reflect.apply(bufferLength, result?.data, []);
          data = new Uint8Array(result.data);
          if (size !== length) fail('FILE_SIZE');
          if (closed) { data.fill(0); fail('FILE_ABORTED'); }
          return data;
        } catch (error) { data?.fill(0); if (error instanceof WeChatLauncherFileError) throw error; fail('FILE_SIZE'); }
      }, close,
    });
  } catch (error) { close(); throw error; }
}

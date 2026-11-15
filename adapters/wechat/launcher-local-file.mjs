/** Read bytes from an explicit platform file selection. */
import { LAUNCHER_BOOTSTRAP_LIMITS } from '../../web/launcher-bootstrap.mjs';
import { createWeChatDeadlineClock } from './launcher-clock.mjs';
import { weChatSignal } from './launcher-control.mjs';

export class WeChatLauncherFileError extends Error {
  constructor(code) { super('The selected local file could not be read.'); this.name = 'WeChatLauncherFileError'; this.code = code; }
}
const fail = code => { throw new WeChatLauncherFileError(code); };
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
export async function readWeChatLauncherFile({ wx, signal, clock = createWeChatDeadlineClock(), timeoutMs = 60000, extension = 'exe' } = {}) {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) fail('FILE_INPUT');
  if (!['exe','zip','json'].includes(extension)) fail('FILE_INPUT');
  const maximum = extension === 'json' ? 65536 : LAUNCHER_BOOTSTRAP_LIMITS.launcherBytes;
  let external;
  try { external = weChatSignal(signal); } catch { fail('FILE_INPUT'); }
  if (external?.aborted()) fail('FILE_ABORTED');
  if (!wx || typeof wx.chooseMessageFile !== 'function' || typeof wx.getFileSystemManager !== 'function') fail('FILE_CAPABILITY');
  let fs;
  try { fs = wx.getFileSystemManager(); } catch { fail('FILE_CAPABILITY'); }
  if (!fs || typeof fs.stat !== 'function' || typeof fs.readFile !== 'function') fail('FILE_CAPABILITY');
  const deadline = clock.now() + timeoutMs;
  let stopped = null, timer, rejectStop;
  const stopPromise = new Promise((resolve, reject) => { rejectStop = reject; }); stopPromise.catch(() => {});
  function stop(code) { if (!stopped) { stopped = new WeChatLauncherFileError(code); rejectStop(stopped); } }
  function check() { if (clock.now() >= deadline) stop('FILE_TIMEOUT'); if (stopped) throw stopped; }
  const abort = () => stop(clock.now() >= deadline ? 'FILE_TIMEOUT' : 'FILE_ABORTED');
  function invoke(target, name, input) {
    check();
    const result = new Promise((resolve, reject) => {
      try { target[name]({ ...input, success(value) { if (!stopped) resolve(value); }, fail() { reject(new WeChatLauncherFileError('FILE_READ')); } }); }
      catch { reject(new WeChatLauncherFileError('FILE_READ')); }
    });
    return Promise.race([result, stopPromise]).then(value => { check(); return value; });
  }
  function size(value, expected) {
    const stat = value?.stats;
    if (!stat || typeof stat.isFile !== 'function' || !stat.isFile() || !Number.isInteger(stat.size)
        || stat.size < 1 || stat.size > maximum || stat.size !== expected) fail('FILE_SIZE');
    return stat.size;
  }
  try {
    timer = clock.setTimer(() => stop('FILE_TIMEOUT'), timeoutMs); external?.add(abort); if (external?.aborted()) abort(); check();
    const selected = await invoke(wx, 'chooseMessageFile', { count: 1, type: 'file', extension: [extension] });
    const file = selected?.tempFiles?.length === 1 && selected.tempFiles[0];
    if (!file || typeof file.path !== 'string' || !file.path.length || file.path.length > 4096
        || !Number.isInteger(file.size) || file.size < 1 || file.size > maximum) fail('FILE_SIZE');
    const length = size(await invoke(fs, 'stat', { path: file.path, recursive: false }), file.size);
    const result = await invoke(fs, 'readFile', { filePath: file.path, position: 0, length });
    let bytes;
    try { if (Reflect.apply(bufferLength, result?.data, []) !== length) fail('FILE_SIZE'); bytes = new Uint8Array(new Uint8Array(result.data)); }
    catch { fail('FILE_SIZE'); }
    try {
      size(await invoke(fs, 'stat', { path: file.path, recursive: false }), length); check();
      return bytes;
    } catch (error) { bytes.fill(0); throw error; }
  } catch (error) {
    if (stopped) throw stopped;
    if (error instanceof WeChatLauncherFileError) throw error;
    throw new WeChatLauncherFileError('FILE_READ');
  } finally {
    if (!stopped) stopped = new WeChatLauncherFileError('FILE_ABORTED');
    try { clock.clearTimer(timer); } finally { external?.remove(abort); }
  }
}

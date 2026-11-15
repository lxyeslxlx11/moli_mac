/** Explicit independent input subset, not an inferred Windows ACP encoder. Preserves case and spaces. */
import { encodeLauncherCredential } from '../shared/launcher-text.mjs';
export function encodeLauncherASCII(value) {
  try { return encodeLauncherCredential(value, { encoding: 'ascii' }); }
  catch {
    const error = new Error('请输入1至16个ASCII可显示字符；当前不推测Windows代码页。');
    error.code = 'INPUT_ASCII'; throw error;
  }
}

/** Fixed Patcher_PUK3 source data. No requests, retries, process or filesystem operations. */
export const PUK3_PATCH_SOURCE_PROFILE = Object.freeze({ id: 'puk3-195f3afd', patcherName: 'Patcher_PUK3.exe',
  sha256: '195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8' });
export class LauncherPatchSourceError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherPatchSourceError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherPatchSourceError(code, message); };
function own(value, name) {
  let descriptor;
  try { descriptor = Object.getOwnPropertyDescriptor(value, name); } catch { fail('PATCH_SOURCE_INPUT', 'Expected own endpoint data.'); }
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('PATCH_SOURCE_INPUT', 'Expected own endpoint data.');
  return descriptor.value;
}

/** Exact configured-address subset of native 0x409528..0x4095a8; profile selection is not source authentication. */
export function createPuk3PatchSourcePlan(value) {
  const address = own(value, 'address'), portText = own(value, 'portText');
  if (address !== '221.122.108.10') fail('PATCH_SOURCE_PROFILE', 'The fixed profile supports only its traced configured address.');
  if (typeof portText !== 'string' || !/^[0-9]{1,5}$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
    fail('PATCH_SOURCE_INPUT', 'Expected decimal port text in 1..65535.');
  }
  return Object.freeze({ profileId: PUK3_PATCH_SOURCE_PROFILE.id, sourceSha256: PUK3_PATCH_SOURCE_PROFILE.sha256,
    sources: Object.freeze([
      Object.freeze({ sourceOrdinal: 0, address, portText, port: Number(portText), kind: 'configured' }),
      Object.freeze({ sourceOrdinal: 1, address: '221.122.119.156', portText: '80', port: 80, kind: 'native-alternate' }),
    ]), automaticRequests: false, trust: 'unverified', authentication: 'unverified' });
}

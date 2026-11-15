/** Observed Win32 updater's exact journal header. Reads bytes only; never inspects files or performs recovery. */
export const WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE = Object.freeze({
  name: 'win32-updater-journal-header-v1', headerBytes: 16, magic: 0x554c4f50, version: 1, xorMask: 0xf016ea0b,
});
export class LauncherUpdateJournalError extends Error {
  constructor(code) { super('Update journal header is outside the supported profile.'); this.name = 'LauncherUpdateJournalError'; this.code = code; }
}
const fail = code => { throw new LauncherUpdateJournalError(code); };
const typed = Object.getPrototypeOf(Uint8Array.prototype);
const typedLength = Object.getOwnPropertyDescriptor(typed, 'length').get;
const typedBuffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
const bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
const phases = Object.freeze(['before-replacement', 'backup-moved', 'replacement-installed', 'awaiting-startup-ack', 'commit-recorded']);

function headerSnapshot(input) {
  let buffer, length, array;
  try {
    if (input instanceof ArrayBuffer) {
      buffer = input; length = Reflect.apply(bufferLength, input, []);
    } else {
      if (!(input instanceof Uint8Array)) fail('JOURNAL_INPUT');
      buffer = Reflect.apply(typedBuffer, input, []);
      Reflect.apply(bufferLength, buffer, []); // Rejects shared storage without reading shadowable properties.
      length = Reflect.apply(typedLength, input, []);
    }
    new Uint8Array(buffer, 0, 0); // Detached and attached empty buffers have different input semantics.
  } catch { fail('JOURNAL_INPUT'); }
  if (length !== WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE.headerBytes) fail('JOURNAL_HEADER_LENGTH');
  try { array = input instanceof ArrayBuffer ? new Uint8Array(input) : input; return new Uint8Array(array); }
  catch { fail('JOURNAL_INPUT'); }
}

/** A recorded stage is historical metadata. It does not establish the present files, a successful ACK or a completed update. */
export function parseWin32LauncherUpdateJournalHeader(input) {
  const bytes = headerSnapshot(input), view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const magic = view.getUint32(0, true), version = view.getUint32(4, true);
  const recordedStage = view.getUint32(8, true), check = view.getUint32(12, true);
  if (magic !== WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE.magic) fail('JOURNAL_MAGIC');
  if (version !== WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE.version) fail('JOURNAL_VERSION');
  if (check !== ((recordedStage ^ WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE.xorMask) >>> 0)) fail('JOURNAL_CHECKSUM');
  if (recordedStage < 1 || recordedStage > phases.length) fail('JOURNAL_STAGE');
  return Object.freeze({ profile: WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE.name, headerBytes: bytes.length, version,
    recordedStage, recordedPhase: phases[recordedStage - 1], integrity: 'xor-consistency-only',
    authentication: 'unverified', fileState: 'not-inspected', startupAcknowledgement: 'not-proven', recovery: 'not-performed' });
}

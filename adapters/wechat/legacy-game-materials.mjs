import { prepareLegacyGameStartup } from '../../shared/legacy-game-client-config.mjs';
import { legacyInputFields } from '../../shared/legacy-game-input.mjs';
import { assetKey, assetInteger, assetFail } from '../../shared/legacy-game-resource-values.mjs';
import { snapshotWeChatTCPEndpoint } from './launcher-stream.mjs';

export function snapshotWeChatGameConfig(value) {
  if (value === null) return null;
  const {endpoint,textEncoding} = legacyInputFields(value,['endpoint','textEncoding']);
  if (!['ascii','windows-936'].includes(textEncoding)) throw new TypeError('Invalid game text encoding.');
  return Object.freeze({endpoint:snapshotWeChatTCPEndpoint(legacyInputFields(endpoint,['address','port'])),textEncoding});
}

export function readWeChatGameStartup(bytes, files) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 1 || bytes.length > 65536) throw new TypeError('Invalid game startup.');
  let text = '';
  const start = bytes[0]===239 && bytes[1]===187 && bytes[2]===191 ? 3 : 0;
  for (let index=start;index<bytes.length;index++) {
    if (bytes[index]>127) throw new TypeError('Invalid game startup.');
    text += String.fromCharCode(bytes[index]);
  }
  return prepareLegacyGameStartup(JSON.parse(text), files);
}

/** Takes ownership of bytes from an imported archive or copied resource candidate. */
export function ownWeChatGameResources(rows) {
  const files = new Map();
  try {
    if (!Array.isArray(rows) || !rows.length || rows.length>65536) assetFail('LEGACY_ASSET_FILES_BUDGET');
    for (const {path,bytes} of rows) {
      const key = assetKey(path);
      if (files.has(key) || !(bytes instanceof Uint8Array)) assetFail('LEGACY_ASSET_FILE_ALIAS');
      files.set(key,bytes);
    }
  } catch (error) {
    if (Array.isArray(rows)) for (const row of rows) if (row?.bytes instanceof Uint8Array) row.bytes.fill(0);
    throw error;
  }
  let closed = false;
  const open = () => { if (closed) assetFail('LEGACY_ASSET_FILES_CLOSED'); };
  return Object.freeze({count:files.size,port:Object.freeze({
    async stat(path) { open(); return files.get(assetKey(path))?.length??null; },
    async read(path,offset,length) {
      open();assetInteger(offset);assetInteger(length,0,33554432);
      const bytes = files.get(assetKey(path));
      if (!bytes || offset>bytes.length || length>bytes.length-offset) assetFail('LEGACY_ASSET_FILE_RANGE');
      return new Uint8Array(bytes.subarray(offset,offset+length));
    },
  }),close() {
    if (closed) return;
    closed = true;
    for (const bytes of files.values()) bytes.fill(0);
    files.clear();
  }});
}

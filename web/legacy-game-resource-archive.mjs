/** Explicit selected browser File; bytes are sliced only as the resource reader requests. */
import { createLegacyGameResourceArchive } from '../shared/legacy-game-resource-archive.mjs';
import { assetFail } from '../shared/legacy-game-resource-values.mjs';

export async function createBrowserLegacyGameResourceArchive(file, options) {
  if (!file || !Number.isSafeInteger(file.size) || file.size < 22 || typeof file.slice !== 'function') assetFail('LEGACY_ASSET_ARCHIVE_FILE');
  let closed = false;
  return createLegacyGameResourceArchive({ size: file.size,
    async read(offset, length) {
      if (closed) assetFail('LEGACY_ASSET_ARCHIVE_CLOSED');
      const buffer = await file.slice(offset, offset + length).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (closed || bytes.length !== length) { bytes.fill(0); assetFail('LEGACY_ASSET_ARCHIVE_SHORT_READ'); }
      return bytes;
    },
    close() { closed = true; file = null; },
  }, options);
}

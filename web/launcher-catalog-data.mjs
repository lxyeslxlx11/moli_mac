/** Browser compatibility wrapper over the shared byte/digest/XML candidate contract. */
import { snapshotLauncherCatalogCandidate as snapshot } from '../shared/launcher-catalog-data.mjs';
export { CATALOG_CANDIDATE_BYTES, LauncherCatalogError, ownLauncherInputBytes } from '../shared/launcher-catalog-data.mjs';
const nativeDecodeText = (bytes, encoding) => new TextDecoder(encoding, { fatal: true }).decode(bytes);
export function snapshotLauncherCatalogCandidate(value, { decodeText = nativeDecodeText } = {}) {
  return snapshot(value, { decodeText });
}

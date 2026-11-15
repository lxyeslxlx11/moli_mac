/** Owned original-source bytes at fixed local routes. No filesystem reads or upstream proxy. */
import { ownLauncherInputBytes } from '../../web/launcher-catalog-data.mjs';
import { snapshotLauncherSourceProfile } from '../../shared/launcher-source-profile.mjs';
const TOTAL = 36 * 1024 * 1024;
const fields = Object.freeze({ localLauncherBytes: [32 * 1024 * 1024, '/bootstrap/local-launcher', true],
  localGameListBytes: [1024 * 1024, '/bootstrap/local-games', true], localRegionListBytes: [1024 * 1024, '/bootstrap/local-regions', true],
  launcherDigestBytes: [4096, '/bootstrap/self', false], catalogDigestBytes: [4096, '/bootstrap/catalog-digests', false],
  gameListBytes: [1024 * 1024, '/bootstrap/games', false], regionListBytes: [1024 * 1024, '/bootstrap/regions', false] });
const invalid = () => { throw new TypeError('Expected bounded explicit local bootstrap source bytes.'); };
export function snapshotLauncherBootstrapSource(input, sourceSettings = {}) {
  if (input === undefined) return null;
  const profile = snapshotLauncherSourceProfile(sourceSettings), current = profile.id === 'win32-current';
  const routeBytes = new Map(); let total = 0;
  let encoding, allowBareAmpersands, packageBytes;
  function own(name, optional = false) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
    const property = Object.getOwnPropertyDescriptor(input, name);
    if (!property && optional) return undefined;
    if (!property || !Object.hasOwn(property, 'value')) invalid();
    return property.value;
  }
  try {
    encoding = own('encoding'); allowBareAmpersands = own('allowBareAmpersands');
    if (!['utf-8', 'gb18030'].includes(encoding) || typeof allowBareAmpersands !== 'boolean') invalid();
    for (const [name, [maximum, path, allowEmpty]] of Object.entries(fields)) {
      const value = own(name);
      if (current && ['localGameListBytes', 'localRegionListBytes'].includes(name) && value === null) continue;
      const copy = ownLauncherInputBytes(value, maximum, { allowEmpty: allowEmpty || (current && name === 'catalogDigestBytes') });
      total += copy.length; if (total > TOTAL) invalid(); routeBytes.set(path, copy);
    }
    const value = own('packageBytes', true);
    if (value !== undefined) {
      packageBytes = ownLauncherInputBytes(value, 32 * 1024 * 1024);
      total += packageBytes.length; if (total > TOTAL) invalid();
      routeBytes.set('/bootstrap/package', packageBytes);
    }
  } catch {
    for (const value of routeBytes.values()) value.fill(0); packageBytes?.fill(0); invalid();
  }
  return Object.freeze({
    describe(origin) {
      return Object.freeze({ schema: 'moli.local-bootstrap.v1', sourceProfile: profile.id, encoding, allowBareAmpersands,
        localInputs: Object.freeze({ launcher: origin + '/bootstrap/local-launcher',
          gameList: routeBytes.has('/bootstrap/local-games') ? origin + '/bootstrap/local-games' : null,
          regionList: routeBytes.has('/bootstrap/local-regions') ? origin + '/bootstrap/local-regions' : null }),
        endpoints: Object.freeze({ launcherDigest: origin + '/bootstrap/self', updateLocator: origin + '/bootstrap/update-locator',
          catalogDigests: origin + '/bootstrap/catalog-digests', gameList: origin + '/bootstrap/games', regionList: origin + '/bootstrap/regions' }) });
    },
    read(path, origin) {
      if (path === '/bootstrap/update-locator' && packageBytes) return new TextEncoder().encode(`${origin}/bootstrap/package ${current ? packageBytes.length : 100}`);
      const value = routeBytes.get(path); return value ? new Uint8Array(value) : null;
    },
    dispose() { for (const value of routeBytes.values()) value.fill(0); routeBytes.clear(); packageBytes = null; },
  });
}

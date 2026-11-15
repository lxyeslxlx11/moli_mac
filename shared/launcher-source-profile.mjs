/** Independent explicit source-version selection; never a wire field or authentication result. */
const profiles = Object.freeze({
  legacy: Object.freeze({ id: 'legacy', bootstrapProfile: 'legacy', handshakeProfile: 'generic' }),
  'win32-current': Object.freeze({ id: 'win32-current', bootstrapProfile: 'win32-current-metadata-v1', handshakeProfile: 'current' }),
});

export function snapshotLauncherSourceProfile(input) {
  const invalid = () => { throw new TypeError('Expected an explicit supported launcher source profile.'); };
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
  const property = Object.getOwnPropertyDescriptor(input, 'sourceProfile');
  if (!property) {
    if ('sourceProfile' in input) invalid();
    return profiles.legacy;
  }
  if (!Object.hasOwn(property, 'value') || typeof property.value !== 'string' || !Object.hasOwn(profiles, property.value)) invalid();
  return profiles[property.value];
}

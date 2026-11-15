/** Original explicit startup fixture for local client/page tests. Never imported by product code. */
export function originalStartup({ scene, input, post }) {
  const hex = s => [...new TextEncoder().encode(s)].map(x => x.toString(16).padStart(2, '0')).join('');
  return { schema: 'moli.legacy-game-startup.v1', sourceProfile: 'legacy-se6000-37c4', sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
    mappingHex: hex('gid:OriginalG glt:OriginalT\0'), moduleDigestHex: hex(post.authentication.moduleDigest), resourceParametersHex: '',
    context: { movement: { ...scene.sourceContext }, runtime: { ...scene.runtime }, actor: { ...scene.actorSource }, input: { ...input.context },
      display: { width: 320, height: 240, center: [160, 120], initialCamera: [128, 192], graphicsMode: 2, forceRender: false } } };
}

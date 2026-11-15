/** Real TCP only to the original local oracle; fresh platform entropy; no private material output. */
import { readFile } from 'node:fs/promises';
import { createLauncherSession } from '../launcher-session.mjs';
import { createNodeLauncherTransport } from '../../adapters/node/launcher-stream.mjs';
import { startOriginalPeer } from '../../analysis/launcher-v17/peer-helper.mjs';
const fixtures = JSON.parse(await readFile(new URL('../../analysis/launcher-v9/original-flow-vectors.json', import.meta.url))).flows;
const bytes = value => new Uint8Array(Buffer.from(value, 'hex'));
const runs = [];
for (const [index, mode] of ['profiles', 'empty', 'rejected'].entries()) {
  const peer = await startOriginalPeer(mode);
  let session;
  try {
    const transport = createNodeLauncherTransport({ allowedEndpoints: [peer.endpoint] });
    const fields = fixtures[index].request_fields;
    session = createLauncherSession({ endpoints: [peer.endpoint], firstEndpointOrdinal: 0,
      requestCounter: fields.counter, gameCode: fields.game_code,
      usernameBytes: bytes(fields.username_hex), passwordBytes: bytes(fields.password_hex), openStream: transport.openStream });
    const result = await session.start();
    const selection = result.snapshot.state === 'profiles' ? session.selectProfile(3) : null;
    const verified = await peer.done;
    runs.push({ mode, state: result.snapshot.state, entropy: result.snapshot.entropy,
      rows: result.choices?.rows.length ?? 0, selectedSourceOrdinal: selection?.selection.profile.sourceOrdinal ?? null,
      io: session.snapshot().io, peerVerified: verified.rows.every(row => row.request_verified && row.client_closed),
      authentication: result.snapshot.authentication });
    if (result.snapshot.state !== (mode === 'empty' ? 'no-profiles' : mode === 'rejected' ? 'rejected' : 'profiles') || !verified.rows.every(row => row.request_verified)) throw new Error('Original exchange did not pass.');
  } finally { session?.cancel(); await peer.stop(); }
}
console.log(JSON.stringify({ scope: 'Original loopback TCP oracle only; no official connection or real account.', runs }, null, 2));

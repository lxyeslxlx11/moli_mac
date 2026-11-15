/** Serve the persistent game page for one explicitly supplied original loopback peer. No peer/account defaults. */
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
const args = process.argv.slice(2), match = args.length === 2 && args[0] === '--endpoint' ? /^127\.0\.0\.1:([1-9][0-9]{0,4})$/.exec(args[1]) : null;
if (!match || Number(match[1]) > 65535) {
  console.error('Usage: node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<port>'); process.exitCode = 1;
} else {
  const server = await createLauncherLoopbackServer({ sourceProfile: 'legacy', endpoints: [{ address: '127.0.0.1', port: Number(match[1]) }],
    gameCode: 2, gameStream: true, label: 'Explicit original game peer' });
  let stopping = false;
  const stop = async () => { if (stopping) return; stopping = true; await server.close(); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  console.log(JSON.stringify({ url: server.origin + '/web/game.html', sourceProfile: 'legacy-se6000-37c4', target: args[1], scope: 'original-loopback-only', startupStorage: 'none' }));
}

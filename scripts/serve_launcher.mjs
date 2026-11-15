/** Opt-in launcher development server. Explicit numeric loopback targets only. */
import { createLauncherLoopbackServer } from '../adapters/node/launcher-loopback.mjs';
const args = process.argv.slice(2), endpoints = [];
let port = 4174, gameCode;
try {
  for (let i = 0; i < args.length; i += 2) {
    const name = args[i], value = args[i + 1];
    if (name === '--target' && /^127\.0\.0\.1:[1-9][0-9]{0,4}$/.test(value)) endpoints.push({ address: '127.0.0.1', port: Number(value.split(':')[1]) });
    else if (name === '--port' && /^[0-9]{1,5}$/.test(value)) port = Number(value);
    else if (name === '--game-code' && /^(?:[0-9]|1[0-4])$/.test(value)) gameCode = Number(value);
    else throw new Error();
  }
  const server = await createLauncherLoopbackServer({ port, gameCode, endpoints });
  console.log(`Local launcher: ${server.origin}/ (explicit loopback peers only)`);
  const stop = async () => { await server.close(); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
} catch {
  console.error('Usage: node scripts/serve_launcher.mjs --target 127.0.0.1:PORT [--port 4174]; select a game from explicit XML in the page.');
  process.exitCode = 1;
}

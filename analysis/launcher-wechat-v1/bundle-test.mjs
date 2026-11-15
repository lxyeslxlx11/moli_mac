/** Build-specific check, run explicitly after the documented local build. This is not native WeChat acceptance. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { fakeWeChat, originalWeChatPeer } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';

test('WeChat CommonJS bundle completes original exchange without browser or Node runtime APIs', async () => {
  const source = readFileSync(new URL('../../build/wechat-launcher/launcher.js', import.meta.url), 'utf8');
  const sandbox = { module: { exports: {} }, setTimeout, clearTimeout, Uint8Array, ArrayBuffer, DataView,
    AbortController: undefined, AbortSignal: undefined, EventTarget: undefined, performance: undefined, crypto: undefined,
    Buffer: undefined, require: undefined, fetch: undefined, URL: undefined, TextEncoder: undefined, TextDecoder: undefined };
  runInNewContext(source, sandbox, { timeout: 1000 });
  assert.equal(typeof sandbox.module.exports.createWeChatLauncherSession, 'function');
  const peer = await originalWeChatPeer(), fixture = fakeWeChat({ native: true, loopbackPort: peer.port });
  const session = sandbox.module.exports.createWeChatLauncherSession({ wx: fixture.wx,
    endpoints: [{ address: 'fixture.invalid', port: 12345 }], firstEndpointOrdinal: 0, requestCounter: 0, gameCode: 11,
    usernameBytes: Uint8Array.from(Buffer.from('SyntheticU1')), passwordBytes: Uint8Array.from(Buffer.from('SyntheticP1')) });
  try {
    const result = await session.start(), oracle = await peer.done;
    assert.equal(result.snapshot.state, 'profiles'); assert.equal(oracle.request_verified, true);
    assert.equal(result.snapshot.authentication, 'unverified'); assert.equal(fixture.stats.closed, 1);
  } finally { session.cancel(); await peer.close(); }
});

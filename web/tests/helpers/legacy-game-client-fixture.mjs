/** Controlled ports around actual portable client and actual game session; original protocol/resources only. */
import { readFileSync } from 'node:fs';
import * as api from '../../../shared/index.mjs';
import { createLegacyGameSession } from '../../legacy-game-session.mjs';
import { originalFiles } from '../../../analysis/game-resource-runtime-v1/original_files.mjs';
import { characterAssets } from '../../../analysis/game-post-login-v1/original_assets.mjs';
import { originalStartup } from '../../../analysis/game-browser-owner-v1/original_startup.mjs';
import { flush, bytes } from './legacy-game-session-fixture.mjs';
const read = name => JSON.parse(readFileSync(new URL('../../../analysis/' + name + '/original-vectors.json', import.meta.url)));
export const post = read('game-post-login-v1'), scene = read('game-legacy-scene-frame-v1'), input = read('game-input-runtime-v1');
export const assets = characterAssets(read('game-resource-runtime-v1'));
export const startup = () => originalStartup({ post, scene, input });
export function clientFixture(options = {}) {
  const selection = startup();
  for (const field of ['display','movement','input']) if (options[field] !== undefined) selection.context[field] = options[field];
  if (options.context !== undefined) selection.context = options.context;
  const prepared = api.createLegacyGameStartup(selection), material = prepared.copy();
  prepared.close();
  const files = originalFiles(options.assets ?? assets), timers = new Map(), allTimers = [], writes = [], states = [];
  let tick = 1000, pending = null, eof = false, opens = 0, closeCalls = 0, invalidations = 0, factories = 0;
  const incoming = [], stream = { read() { if (incoming.length) return Promise.resolve(incoming.shift()); if (eof) return Promise.resolve(null); return new Promise(resolve => { pending = resolve; }); },
    write(b) { writes.push(b.slice()); return options.write?.(b) ?? Promise.resolve(); }, close() { closeCalls++; eof = true; pending?.(null); pending = null; } };
  const client = api.createLegacyGameClient({ plan: api.createLegacyGameResourcePlan(material.resourceParameters), files: files.port, context: material.context, clock: () => tick,
    ...(options.wallSeconds!==undefined?{wallSeconds:options.wallSeconds}:{}),
    ...(options.rasterText?{rasterText:options.rasterText}:{}),
    onInvalidate() { invalidations++; options.onInvalidate?.(); }, onState(s) { states.push(s); options.onState?.(s); },
    createSession({ world, graphics, onState, onPacket }) {
      factories++;
      if (options.invalidSession) return { start() {} };
      return createLegacyGameSession({ sourceProfile: material.sourceProfile, world, mappingBytes: material.mappingBytes, moduleDigestBytes: material.moduleDigestBytes,
        endpoint: { address: '127.0.0.1', port: 32123 }, pollMilliseconds: 1, postLogin: { graphics }, keepalive: options.keepalive,
        clock: () => tick, createControl: () => new AbortController(),
        openStream() { opens++; return Promise.resolve(stream); }, setTimer(fn, delay) { const t = { fn, delay }; timers.set(t, t); allTimers.push(t); return t; }, clearTimer(t) { timers.delete(t); }, onState, onPacket });
    } });
  const fixture = { client, files, timers, allTimers, writes, states, material,
    get stats() { return { opens, closeCalls, factories, invalidations }; }, get tick() { return tick; }, set tick(t) { tick = t; },
    offer(value) { const next = pending; pending = null; if (next) next(value); else incoming.push(value); },
    eof() { eof = true; const next = pending; pending = null; next?.(null); },
    fire() { const t = timers.keys().next().value; if (!t) return false; timers.delete(t); tick = (tick + t.delay) >>> 0; t.fn(); return true; },
    async drive(predicate, n = 150) { for (let i = 0; i < n && !predicate(); i++) { fixture.fire(); await flush(); } if (!predicate()) throw Error('Client fixture condition not reached: ' + JSON.stringify(client.inspect())); },
    frame(plain) { const codec = api.createLegacyGamePayloadCodec(bytes(post.bootstrap.keyHex)); try { return api.encodeLegacyGameEnvelope(codec.encode(bytes(plain))); } finally { codec.close(); } },
    close() { client.close(); material.mappingBytes.fill(0); material.moduleDigestBytes.fill(0); material.resourceParameters.fill(0); files.close(); },
  };
  return fixture;
}
export async function clientMenu(f) {
  f.startResult = f.client.start(); await f.drive(() => f.stats.opens === 1);
  f.offer(api.encodeLegacyGameEnvelope(bytes(post.bootstrap.payloadHex))); await flush(); f.offer(bytes(post.authReplyFrameHex)); await flush();
  await f.drive(() => f.writes.length === 2); f.offer(bytes(post.flow.replies.category.frameHex)); await flush(); f.offer(bytes(post.flow.replies.list.frameHex)); await flush();
  await f.drive(() => f.client.inspect().state === 'choosing'); return f.client.inspect();
}
export async function clientEnter(f, withScene = true) {
  await clientMenu(f); f.client.session().enterCharacter(0); await f.drive(() => f.writes.length === 3);
  f.offer(bytes(post.flow.replies.entered.frameHex)); await flush(); await f.drive(() => f.client.inspect().session.sourceCharacterEntered);
  if (withScene) { for (const plain of scene.protocol.beforePlainHex) { f.offer(f.frame(plain)); await flush(); } await f.drive(() => f.client.inspect().state === 'playing'); }
  return f.client.inspect();
}

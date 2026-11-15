/** Explicit fixed-profile client context and startup. File access uses a selected read-only port. */
import { ordinaryLegacyGameMovement, snapshotLegacyGameLocalContext } from './legacy-game-local-movement.mjs';
import { snapshotLegacyGameFrameRequest, planLegacyGameActorFrame } from './legacy-game-frame.mjs';
import { LEGACY_GAME_ORDINARY_ENTRY, snapshotLegacyGameInputContext, legacyInputFields } from './legacy-game-input.mjs';
import { readLegacyGameHandoff, createLegacyGameLogin } from './legacy-game-login.mjs';
import { createLegacyGameResourcePlan, legacyGameConfigReadBytes, mergeLegacyGameResourceParameters } from './legacy-game-resource-paths.mjs';
import { assetBytes, assetInteger } from './legacy-game-resource-values.mjs';
import { md5Hex } from './md5.mjs';
import { sha256 } from './vendor/noble-hashes/2.4.0/sha2.js';
import { bytesToHex } from './vendor/noble-hashes/2.4.0/utils.js';
export const LEGACY_GAME_CLIENT_PROFILE = Object.freeze({ id: 'legacy-se6000-37c4-client-v1', sourceProfile: 'legacy-se6000-37c4',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd', context: 'explicit-supported-ordinary-projection', nativeContextComplete: false });
export class LegacyGameClientError extends Error { constructor(code) { super('The game client requires explicit supported startup and lifecycle ports.'); this.name = 'LegacyGameClientError'; this.code = code; } }
export const clientFail = code => { throw new LegacyGameClientError(code); };
const startupSchema = 'moli.legacy-game-startup.v1';
const fileStartupSchema = 'moli.legacy-game-startup.v2';
const startupFields = ['schema', 'sourceProfile', 'sourceSha256', 'mappingHex', 'context'];
const sourceModule = Object.freeze({ name: 'cg_se_6000.exe', size: 1569280 });
const sourceDisplay = Object.freeze({ width: 640, height: 480, center: Object.freeze([320, 240]),
  initialCamera: null, graphicsMode: 2, forceRender: false });
const sourceContext = Object.freeze({
  movement: LEGACY_GAME_ORDINARY_ENTRY,
  runtime: Object.freeze({ runtimeStage: 3, ownGateByte: 0, movementScale: 1, soundScene: 9, sparseMode: 0 }),
  actor: Object.freeze({ unindexed: false, recordGateFlags: 0, recordMotionFlags: 0, recordTypeFlags: 0,
    recordDrawFlags: 0, bodyFlags: 0x34, specialState: 0, frozen: 0, childAction: null }),
  input: LEGACY_GAME_ORDINARY_ENTRY,
  display: sourceDisplay,
});
export function snapshotLegacyGameClientContext(value) {
  const c = value === LEGACY_GAME_ORDINARY_ENTRY ? sourceContext :
    legacyInputFields(value, ['movement', 'runtime', 'actor', 'input', 'display']);
  const display = c.display === LEGACY_GAME_CLIENT_PROFILE.sourceProfile ? sourceDisplay :
    legacyInputFields(c.display, ['width', 'height', 'center', 'initialCamera', 'graphicsMode', 'forceRender']);
  const positionCamera = display.initialCamera === null;
  const frame = snapshotLegacyGameFrameRequest({ tick: 0, runtime: c.runtime, camera: positionCamera ? [0, 0] : display.initialCamera,
    center: display.center, width: display.width, height: display.height });
  if (!Number.isInteger(display.graphicsMode) || display.graphicsMode < 0 || display.graphicsMode > 2 || typeof display.forceRender !== 'boolean') clientFail('LEGACY_CLIENT_CONTEXT');
  const actor = legacyInputFields(c.actor, ['unindexed', 'recordGateFlags', 'recordMotionFlags', 'recordTypeFlags', 'recordDrawFlags', 'bodyFlags', 'specialState', 'frozen', 'childAction']);
  const sourceMovement = c.movement === LEGACY_GAME_ORDINARY_ENTRY, sourceInput = c.input === LEGACY_GAME_ORDINARY_ENTRY;
  const movement = sourceMovement ? ordinaryLegacyGameMovement : snapshotLegacyGameLocalContext(c.movement);
  const input = sourceInput ? c.input : snapshotLegacyGameInputContext(c.input);
  const policy = planLegacyGameActorFrame({ local: true, action: 0, queueLength: 0, sceneMode: 0, enginePhase: 0, runtime: frame.runtime, source: actor });
  if (!policy.supported || (!sourceInput && (input.ownGateByte !== frame.runtime.ownGateByte ||
    ['nativePartyMode', 'nativePartyFlags', 'nativeCoordinationGuard', 'nativeActionGuard'].some(k => input[k] !== movement[k])))) clientFail('LEGACY_CLIENT_CONTEXT');
  return Object.freeze({ movement: sourceMovement ? c.movement : movement, runtime: frame.runtime, actor: Object.freeze(actor), input,
    display: Object.freeze({ width: frame.width, height: frame.height, center: frame.center, initialCamera: positionCamera ? null : frame.camera,
      graphicsMode: display.graphicsMode, forceRender: display.forceRender }) });
}
function hex(value, maximum, minimum = 0) {
  if (typeof value !== 'string' || value.length % 2 || value.length < minimum * 2 || value.length > maximum * 2 || !/^[0-9a-f]*$/.test(value)) clientFail('LEGACY_CLIENT_STARTUP_BYTES');
  const bytes = new Uint8Array(value.length / 2); for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16); return bytes;
}
export function createLegacyGameStartup(value) {
  const c = legacyInputFields(value, [...startupFields, 'resourceParametersHex', 'moduleDigestHex']);
  if (c.schema !== startupSchema || c.sourceProfile !== LEGACY_GAME_CLIENT_PROFILE.sourceProfile || c.sourceSha256 !== LEGACY_GAME_CLIENT_PROFILE.sourceSha256) clientFail('LEGACY_CLIENT_STARTUP_PROFILE');
  return ownStartup(c, snapshotLegacyGameClientContext(c.context));
}

function ownStartup(c, context, digest, parameters) {
  const profile = c.sourceProfile, configFromSelectedFiles = parameters !== undefined;
  let mapping, closed = false;
  try {
    mapping = hex(c.mappingHex, 256, 1); digest ??= hex(c.moduleDigestHex, 32); parameters ??= hex(c.resourceParametersHex, 32767);
    const fields = readLegacyGameHandoff(mapping); fields.gidBytes.fill(0); fields.gltBytes.fill(0);
    const login = createLegacyGameLogin({ mappingBytes: mapping, moduleDigestBytes: digest }); login.close(); createLegacyGameResourcePlan(parameters);
  } catch (error) { mapping?.fill(0); digest?.fill(0); parameters?.fill(0); throw error; }
  finally { c.mappingHex = c.moduleDigestHex = c.resourceParametersHex = c.context = null; }
  return Object.freeze({
    copy() { if (closed) clientFail('LEGACY_CLIENT_STARTUP_CLOSED'); return Object.freeze({ sourceProfile: profile, context, mappingBytes: mapping.slice(), moduleDigestBytes: digest.slice(), resourceParameters: parameters.slice() }); },
    inspect() { return Object.freeze({ state: closed ? 'closed' : 'open', sourceProfile: profile, context: LEGACY_GAME_CLIENT_PROFILE.context, configFromSelectedFiles, ownedBytes: closed ? 0 : mapping.length + digest.length + parameters.length }); },
    close() { if (closed) return; closed = true; mapping.fill(0); digest.fill(0); parameters.fill(0); },
  });
}

async function readResourceParameters(commandTailHex, files) {
  const tail = hex(commandTailHex, 32767);
  let prefix;
  try {
    const size = await files.stat('Config.dat');
    if (size === null) return mergeLegacyGameResourceParameters(null, tail);
    const count = Math.min(assetInteger(size), legacyGameConfigReadBytes);
    prefix = count === 0 ? new Uint8Array() : assetBytes(await files.read('Config.dat', 0, count), count);
    if (prefix.length !== count) clientFail('LEGACY_CLIENT_STARTUP_CONFIG_READ');
    return mergeLegacyGameResourceParameters(prefix, tail);
  } finally {
    prefix?.fill(0);
    tail.fill(0);
  }
}

/** Resolve the legacy module field from a read-only port over the caller's selected files. */
export async function prepareLegacyGameStartup(value, files) {
  if (Object.getOwnPropertyDescriptor(value ?? {}, 'schema')?.value !== fileStartupSchema) return createLegacyGameStartup(value);

  const useConfig = Object.hasOwn(value, 'commandTailHex');
  const c = legacyInputFields(value, [...startupFields, useConfig ? 'commandTailHex' : 'resourceParametersHex']);
  if (c.sourceProfile !== LEGACY_GAME_CLIENT_PROFILE.sourceProfile || c.sourceSha256 !== LEGACY_GAME_CLIENT_PROFILE.sourceSha256) clientFail('LEGACY_CLIENT_STARTUP_PROFILE');
  const context = snapshotLegacyGameClientContext(c.context);
  c.context = null;
  const { name, size } = sourceModule;
  if (await files?.stat(name) !== size) clientFail('LEGACY_CLIENT_STARTUP_MODULE');
  const image = assetBytes(await files.read(name, 0, size), size);
  let digest;
  try {
    if (image.length !== size || bytesToHex(sha256(image)) !== c.sourceSha256) clientFail('LEGACY_CLIENT_STARTUP_MODULE');
    digest = Uint8Array.from(md5Hex(image), character => character.charCodeAt(0));
  } finally {
    image.fill(0);
  }
  try {
    const parameters = useConfig ? await readResourceParameters(c.commandTailHex, files) : undefined;
    return ownStartup(c, context, digest, parameters);
  } catch (error) {
    digest.fill(0);
    throw error;
  }
}

/**
 * Offline, environment-independent resource probes and launcher-data exports.
 * No filesystem, network, DOM, Node, Buffer, or platform dependencies.
 * RD v0/v2 are observed raw index-byte layouts, not a complete image decoder.
 */
export const LIMITS = Object.freeze({
  indexBytes: 64 * 1024 * 1024,
  frameBytes: 32 * 1024 * 1024,
  pixels: 4 * 1024 * 1024,
  paletteBytes: 768,
  recordBytes: 40,
});

export class ResourceError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ResourceError';
    this.code = code;
    this.details = details;
  }
}

function fail(code, message, details) {
  throw new ResourceError(code, message, details);
}

function bytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  fail('INVALID_INPUT', 'Expected Uint8Array or ArrayBuffer.');
}

function boundedIndex(input) {
  const value = bytes(input);
  if (value.byteLength > LIMITS.indexBytes) {
    fail('INDEX_BUDGET', 'Index exceeds the 64 MiB budget.', { actual: value.byteLength });
  }
  if (value.byteLength === 0 || value.byteLength % LIMITS.recordBytes !== 0) {
    fail('INDEX_LENGTH', 'Index must contain whole, nonempty 40-byte records.', { actual: value.byteLength });
  }
  return value;
}

function view(value) {
  return new DataView(value.buffer, value.byteOffset, value.byteLength);
}

function copyBytes(value, start, end = value.byteLength) {
  // Construct a plain Uint8Array copy even for Uint8Array subclasses with view-returning slice().
  return new Uint8Array(new Uint8Array(value.buffer, value.byteOffset + start, end - start));
}

function unsigned32(value, field) {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
    fail('INVALID_RECORD', `${field} must be an unsigned 32-bit integer.`, { field, value });
  }
  return value;
}

function pairedSize(value) {
  if (value !== undefined && (!Number.isSafeInteger(value) || value < 0)) {
    fail('INVALID_PAIRED_SIZE', 'Paired byte count must be a nonnegative safe integer.');
  }
  return value;
}

function rawRange(record, pairedByteCount) {
  if (!record || typeof record !== 'object') fail('INVALID_RECORD', 'A record is required.');
  const start = unsigned32(record.byteOffset, 'byteOffset');
  const byteLength = unsigned32(record.byteLength, 'byteLength');
  // Each operand is UInt32. JS Number represents their sum exactly, without UInt32 wrapping.
  const end = start + byteLength;
  const paired = pairedSize(pairedByteCount);
  if (paired !== undefined && end > paired) {
    fail('PAIRED_BOUNDS', 'Record range exceeds the paired file.', { start, end, pairedByteCount: paired });
  }
  return { start, end, byteLength };
}

function pixelCount(width, height) {
  unsigned32(width, 'width');
  unsigned32(height, 'height');
  if (width === 0 || height === 0) fail('ZERO_DIMENSION', 'Dimensions must be positive.');
  // Divide before multiplying; an attacker-controlled UInt32×UInt32 need not be a safe Number.
  if (width > LIMITS.pixels || height > Math.floor(LIMITS.pixels / width)) {
    fail('PIXEL_BUDGET', 'Dimensions exceed the 4 Mi-pixel budget.', { width, height });
  }
  return width * height;
}

function readRecord(value, ordinal) {
  const start = ordinal * LIMITS.recordBytes;
  const data = view(value);
  return {
    ordinal,
    id: data.getUint32(start, true),
    byteOffset: data.getUint32(start + 4, true),
    byteLength: data.getUint32(start + 8, true),
    width: data.getUint32(start + 20, true),
    height: data.getUint32(start + 24, true),
    opaque: {
      indexBytes12to19: copyBytes(value, start + 12, start + 20),
      indexBytes28to39: copyBytes(value, start + 28, start + 40),
    },
  };
}

/** Read one ordinal from a bounded complete index. IDs need not equal ordinals. */
export function getRecord(input, ordinal, { pairedByteCount } = {}) {
  const value = boundedIndex(input);
  const recordCount = value.byteLength / LIMITS.recordBytes;
  if (!Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal >= recordCount) {
    fail('ORDINAL_BOUNDS', 'Record ordinal is outside the index.', { ordinal, recordCount });
  }
  const record = readRecord(value, ordinal);
  rawRange(record, pairedByteCount);
  return record;
}

/** Metadata observations only. Gaps, shared ranges, and zero lengths are not invented format errors. */
export function inspectIndex(input, { pairedByteCount } = {}) {
  const value = boundedIndex(input);
  pairedSize(pairedByteCount);
  const data = view(value);
  const recordCount = value.byteLength / LIMITS.recordBytes;
  let minimumOffset = Infinity;
  let maximumEndOffset = 0;
  let contiguousAdjacentPairs = 0;
  let zeroLengthRecords = 0;
  let previousEnd;
  // Sorting 32-bit ordinals avoids an object per record for large mobile indices.
  const order = new Uint32Array(recordCount);
  for (let ordinal = 0; ordinal < recordCount; ordinal += 1) {
    const start = ordinal * LIMITS.recordBytes;
    const byteOffset = data.getUint32(start + 4, true);
    const byteLength = data.getUint32(start + 8, true);
    const range = rawRange({ byteOffset, byteLength }, pairedByteCount);
    minimumOffset = Math.min(minimumOffset, range.start);
    maximumEndOffset = Math.max(maximumEndOffset, range.end);
    if (previousEnd === range.start) contiguousAdjacentPairs += 1;
    if (byteLength === 0) zeroLengthRecords += 1;
    previousEnd = range.end;
    order[ordinal] = ordinal;
  }
  order.sort((a, b) => data.getUint32(a * 40 + 4, true) - data.getUint32(b * 40 + 4, true));
  let overlappingAdjacentRanges = 0;
  for (let i = 1; i < order.length; i += 1) {
    const previous = order[i - 1] * 40;
    const previousEnd = data.getUint32(previous + 4, true) + data.getUint32(previous + 8, true);
    if (previousEnd > data.getUint32(order[i] * 40 + 4, true)) overlappingAdjacentRanges += 1;
  }
  return {
    recordCount, minimumOffset, maximumEndOffset, contiguousAdjacentPairs,
    noncontiguousAdjacentPairs: recordCount - 1 - contiguousAdjacentPairs,
    zeroLengthRecords, overlappingAdjacentRanges,
    pairedByteCount: pairedByteCount ?? null,
  };
}

/** Validate a selected frame before reading a bounded File.slice(start, end). End is exclusive. */
export function frameRange(record, { pairedByteCount } = {}) {
  const range = rawRange(record, pairedByteCount);
  if (range.byteLength < 16) fail('FRAME_TRUNCATED', 'Frame is shorter than the minimum 16-byte header.');
  if (range.byteLength > LIMITS.frameBytes) fail('FRAME_BUDGET', 'Frame exceeds the 32 MiB budget.');
  pixelCount(record.width, record.height);
  return range;
}

/**
 * Read only observed RD v0/v2 raw index bytes. Pixels and opaque fields are owned copies.
 * No color channel, transparency, origin, row direction, or drawing offset is inferred.
 */
export function decodeRD(input, { record } = {}) {
  const value = bytes(input);
  if (value.byteLength > LIMITS.frameBytes) fail('FRAME_BUDGET', 'Frame exceeds the 32 MiB budget.');
  if (value.byteLength < 16) fail('FRAME_TRUNCATED', 'RD header requires at least 16 bytes.');
  if (value[0] !== 0x52 || value[1] !== 0x44) fail('RD_MAGIC', 'Missing RD magic bytes.');
  const version = value[2];
  if (version !== 0 && version !== 2) {
    fail('UNSUPPORTED_VERSION', 'Only observed RD v0/v2 raw layouts are supported; compressed versions are unverified.', { version });
  }
  const data = view(value);
  const width = data.getUint32(4, true);
  const height = data.getUint32(8, true);
  const count = pixelCount(width, height);
  if (record !== undefined) {
    const range = frameRange(record);
    if (record.width !== width || record.height !== height) {
      fail('DIMENSION_MISMATCH', 'RD dimensions disagree with the selected index record.', {
        indexWidth: record.width, indexHeight: record.height, width, height,
      });
    }
    if (range.byteLength !== value.byteLength) {
      fail('RECORD_LENGTH_MISMATCH', 'Selected frame bytes disagree with index byteLength.', {
        expected: range.byteLength, actual: value.byteLength,
      });
    }
  }
  let headerBytes = 16;
  let paletteByteLength = 0;
  if (version === 2) {
    if (value.byteLength < 20) fail('FRAME_TRUNCATED', 'RD v2 header requires 20 bytes.');
    headerBytes = 20;
    paletteByteLength = data.getUint32(16, true);
    if (paletteByteLength === 0 || paletteByteLength % 3 !== 0 || paletteByteLength > LIMITS.paletteBytes) {
      fail('PALETTE_LAYOUT', 'RD v2 opaque palette length must be positive, divisible by 3, and at most 768 bytes.', { paletteByteLength });
    }
  }
  const expectedLength = headerBytes + count + paletteByteLength;
  if (value.byteLength !== expectedLength) {
    fail('FRAME_LENGTH', 'RD payload has truncated or trailing bytes for the supported raw layout.', {
      expected: expectedLength, actual: value.byteLength,
    });
  }
  const pixels = copyBytes(value, headerBytes, headerBytes + count);
  return {
    version, width, height, pixels,
    opaque: {
      headerByte3: value[3],
      headerWord12: data.getUint32(12, true),
      paletteBytes: copyBytes(value, headerBytes + count),
    },
  };
}

export {
  LAUNCHER_LIMITS, LauncherError, parseGameCatalog, parsePathOverrides, inspectWin32LauncherCatalogContainers,
  resolveGameDirectory, createOfflineLaunchPlan,
  REGION_LIMITS, parseRegionCatalog, listGameRegions, listGameGalaxies, selectLauncherRegion, createOfflineRegionLaunchPlan,
} from './launcher.mjs';
export { MAP01_LIMITS, Map01Error, parseMAP01 } from './map01.mjs';
export { INVENTORY_LIMITS, InventoryError, verifyInstallInventory } from './install-inventory.mjs';
export {
  LAUNCHER_MESSAGE_LIMITS, LauncherMessageError, encodeLauncherRequest10, decodeLauncherRequest10,
  encodeLauncherRequest10Frame, decodeLauncherRequest10Frame,
} from './launcher-message10.mjs';
export {
  LAUNCHER_REPLY_LIMITS, encodeLauncherRequest1, decodeLauncherReply,
  decodeLauncherReplyFrame, createLauncherReplyStream,
} from './launcher-replies.mjs';
export {
  LAUNCHER_CHANNEL_LIMITS, encodeLauncherHandshakeHello, decodeLauncherHandshakeChallenge,
  answerLauncherHandshake, createLauncherRecordCodec, createLauncherRecordStream,
  LAUNCHER_CURRENT_CHANNEL_PROFILE, decodeLauncherCurrentHandshakeChallenge, answerLauncherCurrentHandshake,
  LAUNCHER_CURRENT_RECORD_PROFILE, createLauncherCurrentRecordCodec, createLauncherCurrentRecordStream,
} from './launcher-channel.mjs';
export {
  LAUNCHER_LOGIN_LIMITS, encodeLauncherLoginRequest, encodeLauncherLoginRequestFrame,
  createLauncherProfileChoices, decodeLauncherProfileChoices, selectLauncherProfile,
} from './launcher-login.mjs';
export { LAUNCHER_FLOW_LIMITS, createLauncherLoginFlow } from './launcher-flow.mjs';
export { LAUNCHER_LOCAL_LIMITS, createLauncherLicenseIdentity, createLauncherLicenseReview, resetLauncherLoginInputs,
  planLauncherUserModeInitialization, planLauncherUserModeChange } from './launcher-local.mjs';
export { LAUNCHER_UPDATE_LIMITS, LauncherUpdateError, inspectLauncherUpdateArchive, decodeLauncherUpdatePackage, decodeWin32LauncherUpdatePackage, decodeGamePatchArchive } from './launcher-update.mjs';
export { LAUNCHER_CATALOG_PAIR_LIMITS, LauncherCatalogPairError, compareWin32LauncherCatalogPair } from './launcher-catalog.mjs';
export { GAME_PATCH_LIMITS, GamePatchError, parseGamePatchManifest, applyGamePatchCandidates, createGamePatchCandidateRun } from './game-patch.mjs';
export { LAUNCHER_PATCH_LIMITS, LauncherPatchError, createLauncherPatchPlan, interpretLauncherPatchExit } from './launcher-patch.mjs';
export { WIN32_LAUNCHER_PATCH_PROFILE, Win32LauncherPatchError, createWin32LauncherPatchPlan,
  encodeWin32LauncherPatchCommand, interpretWin32LauncherPatchPoll, interpretWin32LauncherPatchExit } from './launcher-patch-current.mjs';
export { LAUNCHER_RESOURCE_CACHE_FORMAT, LauncherResourceCacheError, encodeLauncherResourceCacheRecord,
  decodeLauncherResourceCacheRecord } from './launcher-resource-cache.mjs';
export { GAME_CONFIG_PROFILE, GameConfigError, createDefaultGameConfig, decodeGameConfig, encodeGameConfig } from './game-config.mjs';
export { RD_RUN_MODEL, RDRunError, decodeRDRunModel } from './rd-runs.mjs';
export { LEGACY_GAME_ENVELOPE_PROFILE, LegacyGameEnvelopeError,
  encodeLegacyGameEnvelope, createLegacyGameEnvelopeReader } from './legacy-game-envelope.mjs';
export { LEGACY_GAME_PAYLOAD_PROFILE, LegacyGamePayloadError,
  createLegacyGamePayloadCodec, createLegacyGamePayloadCodecFromBootstrap } from './legacy-game-payload.mjs';
export { LEGACY_GAME_MESSAGE_CATALOG, LEGACY_GAME_MESSAGE_PROFILE, LegacyGameMessageError,
  encodeLegacyGameInteger, decodeLegacyGameInteger, encodeLegacyGameTextField, decodeLegacyGameTextField,
  encodeLegacyGameCommand, decodeLegacyGameMessage, decodeLegacyGameBinary } from './legacy-game-message.mjs';
export { createLegacyGameProtocol, createLegacyGameWorldProtocol } from './legacy-game-protocol.mjs';
export { LEGACY_GAME_MAP_PROFILE, LegacyGameMapError, readLegacyGameMapRectangle,
  checksumLegacyGameMapRectangle, decodeLegacyGameMapPatch, applyLegacyGameMapPatch,
  createLegacyGameMapState } from './legacy-game-map.mjs';
export { LEGACY_GAME_SCENE_PROFILE, LegacyGameSceneError, prepareLegacyGameSceneTransition } from './legacy-game-scene.mjs';
export { LEGACY_GAME_STATE_CATALOG, LEGACY_GAME_STATE_PROFILE, LegacyGameStateError,
  decodeLegacyGameStateRecord, decodeLegacyGameSceneLabel, createLegacyGameState } from './legacy-game-state.mjs';
export { LEGACY_GAME_ACTOR_PROFILE, LegacyGameActorError, decodeLegacyGameActorList,
  decodeLegacyGameActorActions, decodeLegacyGameActorRemovals, createLegacyGameActors } from './legacy-game-actors.mjs';
export { LEGACY_GAME_ACTOR_CONTEXT_PROFILE, LegacyGameActorContextError, legacyGameActorRecordTypeFlags, legacyGameActorRecordDrawFlags,
  legacyGameActorInitialFacing, resolveLegacyGameActorFrameSource, createLegacyGameGraphicActorFilter } from './legacy-game-actor-context.mjs';
export {LEGACY_GAME_ACTOR_SPIN_PROFILE,LegacyGameActorSpinError,planLegacyGameActorSpin,legacyGameActorSpinOutcome} from './legacy-game-actor-spin.mjs';
export {LEGACY_GAME_ACTOR_PRESENTATION_PROFILE,LegacyGameActorPresentationError,legacyGameActorPresentationHeight,legacyGameActorPresentationGate,
  applyLegacyGameActorPresentationControl,planLegacyGameActorPresentation,planLegacyGameActorPresentationAnchor} from './legacy-game-actor-presentation.mjs';
export {LEGACY_GAME_TEXT_PROFILE,LEGACY_GAME_TEXT_COLORS,LegacyGameTextError,legacyGameTextFontMetrics,measureLegacyGameText,planLegacyGameActorLabel,
  createLegacyGameTextBatch,snapshotLegacyGameTextBatch,decodeLegacyGameActorLabelList} from './legacy-game-text.mjs';
export {snapshotLegacyGameTextMask,composeLegacyGameTextFrame} from './legacy-game-text-render.mjs';
export {LEGACY_GAME_VITALS_PROFILE,LegacyGameVitalsError,legacyGameActorValueWidth,planLegacyGameActorVitals,decodeLegacyGameActorValues,decodeLegacyGamePartyUpdate} from './legacy-game-vitals.mjs';
export {LEGACY_GAME_PARTY_PROFILE,LegacyGamePartyError,classifyLegacyGamePartyInput,legacyGamePartyQueueScale,legacyGamePartyTargetsNear} from './legacy-game-party.mjs';
export { LEGACY_GAME_MOTION_PROFILE, LegacyGameMotionError, legacyGameFacingCode,
  projectLegacyGamePosition, classifyLegacyGameActorResource, resolveLegacyGameActorResource,
  createLegacyGameActorMotion, encodeLegacyGameStepDirections, createLegacyGameMovementCommand } from './legacy-game-motion.mjs';
export { LEGACY_GAME_GRAPHIC_PROFILE, LegacyGameGraphicError, resolveLegacyGameMapGraphic, createLegacyGameGraphicCatalog, legacyGameGraphicResourceIdAt,legacyGameGraphicMetadataAt } from './legacy-game-graphics.mjs';
export { LEGACY_GAME_NAVIGATION_PROFILE, LegacyGameNavigationError, legacyGameCollisionWindow,
  createLegacyGameCollisionGrid, createLegacyGameCollisionGridFromRectangle, planLegacyGamePath,
  findLegacyGameMissingMapRectangles, classifyLegacyGameTileEventContext } from './legacy-game-navigation.mjs';
export { LEGACY_GAME_LOCAL_MOVEMENT_PROFILE, LegacyGameLocalMovementError, createLegacyGameLocalMovement } from './legacy-game-local-movement.mjs';
export { PUK3_PATCH_SOURCE_PROFILE, LauncherPatchSourceError, createPuk3PatchSourcePlan } from './launcher-patch-sources.mjs';
export { LAUNCHER_FIRST_CONFIG_LIMITS, LauncherFirstConfigError, createLauncherFirstConfigPlan, interpretLauncherFirstConfigOutcome } from './launcher-first-config.mjs';
export { LAUNCHER_RESOURCE_FORMAT, LauncherResourceError, snapshotLauncherResourceBinding, launcherResourceBindingKey, createLauncherResourceSnapshot, readLauncherResourceSnapshot } from './launcher-resources.mjs';
export { LAUNCHER_MANIFEST_LIMITS, WIN32_LAUNCHER_MANIFEST_LIMITS, LauncherManifestError, parseLauncherDigestResponse, parseLauncherCatalogDigestResponse,
  parseLauncherUpdateLocatorResponse, createLauncherMetadataPlan, computeLauncherFileMd5, parseWin32LauncherDigestResponse,
  parseWin32LauncherUpdateLocatorResponse, createWin32LauncherMetadataPlan } from './launcher-manifest.mjs';
export { LAUNCHER_TEXT_ENCODINGS, LAUNCHER_TEXT_LIMITS, LauncherTextError, encodeLauncherCredential,
  encodeLauncherProcessField, decodeLauncherProfileName, decodeLegacyGameChatText, decodeLegacyGameDescriptionText } from './launcher-text.mjs';
export { LAUNCHER_PREFERENCE_FORMAT, LauncherPreferenceError, encodeLauncherUserModePreference,
  decodeLauncherUserModePreference } from './launcher-preferences.mjs';
export { LAUNCHER_HANDOFF_LIMITS, LauncherHandoffError, encodeLauncherHandoffWrite,
  createLauncherHandoffLease } from './launcher-handoff.mjs';
export { LAUNCHER_PROCESS_LIMITS, LAUNCHER_RESOURCE_GROUPS, LauncherProcessError,
  createLauncherResourceArguments, createLauncherProcessPlan } from './launcher-process.mjs';
export { LauncherLaunchError, createLauncherLaunchLease } from './launcher-launch.mjs';
export { WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE, LauncherUpdateJournalError,
  parseWin32LauncherUpdateJournalHeader } from './launcher-update-journal.mjs';
export { snapshotLauncherSourceProfile } from './launcher-source-profile.mjs';
export { WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE, LauncherUpdateArgumentError,
  encodeWin32LauncherUpdateArguments } from './launcher-update-arguments.mjs';
export { LEGACY_GAME_RENDER_PROFILE, LegacyGameRenderError, decodeLegacyGameRD, decodeLegacyGameGraphic,
  decodeLegacyGameCGP, createLegacyGamePalette32, prepareLegacyGameSprite, composeLegacyGameFrame } from './legacy-game-render.mjs';
export { LEGACY_GAME_ANIMATION_PROFILE, LegacyGameAnimationError, createLegacyGameAnimationCatalog,
  createLegacyGameAnimationPlayer } from './legacy-game-animation.mjs';
export { LEGACY_GAME_FRAME_PROFILE, LegacyGameFrameError, snapshotLegacyGameFrameRequest,
  planLegacyGameActorFrame, sortLegacyGameActorDepth } from './legacy-game-frame.mjs';
export { LEGACY_GAME_SCENE_FRAME_PROFILE,LegacyGameSceneFrameError,createLegacyGameCutCatalog,legacyGameSceneRectangle,
  legacyGameSceneTileOrder,compareLegacyGameSceneDepth,mergeLegacyGameSceneRoots } from './legacy-game-scene-frame.mjs';
export { LEGACY_GAME_INPUT_PROFILE,LegacyGameInputError,unprojectLegacyGamePosition,pickLegacyGameTile,
  snapshotLegacyGameInputContext,createLegacyGamePointer } from './legacy-game-input.mjs';
export { LEGACY_GAME_CLOCK_PROFILE,LegacyGameClockError,createLegacyGameClock } from './legacy-game-clock.mjs';
export { LEGACY_GAME_RUNTIME_PROFILE,LegacyGameRuntimeError,createLegacyGameRuntime } from './legacy-game-runtime.mjs';
export { LegacyGameResourceError } from './legacy-game-resource-values.mjs';
export { LEGACY_GAME_RESOURCE_PROFILE,createLegacyGameResourcePlan,legacyGameCutPath } from './legacy-game-resource-paths.mjs';
export { LEGACY_GAME_DRAW_PLAN_PROFILE,createLegacyGameDrawPlan } from './legacy-game-draw-plan.mjs';
export {LEGACY_GAME_WATER_PROFILE,createLegacyGameWater,isLegacyGameWaterGraphic,snapshotLegacyGameWater,legacyGameWaterRows} from './legacy-game-water.mjs';
export {createLegacyGameSceneFrameController} from './legacy-game-scene-frame.mjs';
export { createLegacyGameMapDialogGraphics } from './legacy-game-map-dialog-graphics.mjs';
export { createLegacyGameResourceLibrary } from './legacy-game-resource-library.mjs';
export { LEGACY_GAME_LOGIN_PROFILE,LegacyGameLoginError,readLegacyGameHandoff,createLegacyGameLogin } from './legacy-game-login.mjs';
export { LEGACY_GAME_CHARACTER_PROFILE,LegacyGameCharacterError,decodeLegacyGameCharacterList,detectLegacyGameCharacterContent,
  legacyGameCharacterPolicy,prepareLegacyGameCharacterPreview,createLegacyGameCharacterFlow } from './legacy-game-characters.mjs';
export { LEGACY_GAME_CHARACTER_CREATION_PROFILE,LegacyGameCharacterCreationError,createLegacyGameCharacterDraft } from './legacy-game-character-creation.mjs';
export { LEGACY_GAME_CHARACTER_OPTIONS_PROFILE,LegacyGameCharacterOptionError,legacyGameCharacterOptionPolicy,transformLegacyGameCharacterOption,
  legacyGameVersionUpgradeCapability,createLegacyGameVersionUpgradeCommand } from './legacy-game-character-options.mjs';
export { LEGACY_GAME_CLIENT_PROFILE,LegacyGameClientError,snapshotLegacyGameClientContext,createLegacyGameStartup,prepareLegacyGameStartup } from './legacy-game-client-config.mjs';
export { createLegacyGameClient } from './legacy-game-client.mjs';

export {LEGACY_GAME_ACTOR_RIDE_PROFILE,LegacyGameActorRideError,resolveLegacyGameMountedResource,projectLegacyGameMountedAction,legacyGameRideRestAction,planLegacyGameActorRide,legacyGameActorRideOutcome} from './legacy-game-actor-ride.mjs';

export {LEGACY_GAME_ACTOR_ATTACHMENT_PROFILE,LegacyGameActorAttachmentError,planLegacyGameActorAttachment} from './legacy-game-actor-attachment.mjs';

export {LEGACY_GAME_ACTOR_BADGE_PROFILE,LegacyGameActorBadgeError,planLegacyGameActorBadge,planLegacyGameActorBadgeAnchor} from './legacy-game-actor-badge.mjs';
export {planLegacyGamePartyCommand,legacyGamePartyNeighbor} from './legacy-game-party.mjs';

export {LEGACY_GAME_BATTLE_PROFILE,LEGACY_GAME_BATTLE_SLOT_LAYOUT,LegacyGameBattleError,decodeLegacyGameBattleCharacters,createLegacyGameBattleState} from './legacy-game-battle.mjs';

export {LEGACY_GAME_BATTLE_MOTION_PROFILE,decodeLegacyGameBattleMotion} from './legacy-game-battle-motion.mjs';

export {LEGACY_GAME_BATTLE_BODY_PROFILE,createLegacyGameBattleBodies} from './legacy-game-battle-body.mjs';
export {LEGACY_GAME_BATTLE_COMMAND_PROFILE,createLegacyGameBattleCommands} from './legacy-game-battle-commands.mjs';

export {LEGACY_GAME_BATTLE_PLAYBACK_PROFILE} from './legacy-game-battle-playback.mjs';
export {LEGACY_GAME_BATTLE_FRAME_PROFILE,sortLegacyGameBattleDepth,createLegacyGameBattleFrameController} from './legacy-game-battle-frame.mjs';
export {LEGACY_GAME_BATTLE_ENTRY_FADE_PROFILE,createLegacyGameBattleEntryFade,composeLegacyGameBattleEntryFade} from './legacy-game-battle-entry-fade.mjs';
export {LEGACY_GAME_BATTLE_LOOP_PROFILE} from './legacy-game-battle-loop.mjs';
export {LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE,createLegacyGameBattleExitFade,composeLegacyGameBattleExitFade} from './legacy-game-battle-exit-fade.mjs';
export {LEGACY_GAME_BATTLE_EXIT_PROFILE} from './legacy-game-battle-exit.mjs';
export {LEGACY_GAME_BATTLE_RETURN_PROFILE} from './legacy-game-battle-return.mjs';
export {LEGACY_GAME_BATTLE_UPPER_SKILLS_PROFILE} from './legacy-game-battle-upper-skills.mjs';
export {LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE,planBattleImpactSkill} from './legacy-game-battle-impact-skills.mjs';
export {LEGACY_GAME_BATTLE_STRIKE_PROFILE} from './legacy-game-battle-strike.mjs';
export {LEGACY_GAME_BATTLE_STATUS_PROFILE} from './legacy-game-battle-status.mjs';
export {LEGACY_GAME_BATTLE_CHANGE_PROFILE} from './legacy-game-battle-change.mjs';
export {LEGACY_GAME_BATTLE_CHARACTER_CHANGE_PROFILE} from './legacy-game-battle-character-change.mjs';
export {LEGACY_GAME_BATTLE_ENTRY_PROFILE} from './legacy-game-battle-entry.mjs';
export {LEGACY_GAME_BATTLE_INPUT_PROFILE,legacyGameBattleTargetMask,legacyGameBattleTargetCode} from './legacy-game-battle-input.mjs';
export {LEGACY_GAME_PET_PROFILE,LegacyGamePetError,createLegacyGamePets} from './legacy-game-pets.mjs';
export {LEGACY_GAME_PRESENTATION_PROFILE,createLegacyGamePresentation} from './legacy-game-presentation.mjs';
export {legacyGameBattleAngle,legacyGameBattleFacing,legacyGameBattleSine,legacyGameBattleMovement,legacyGameBattleDistance,createLegacyGameBattleRandom} from './legacy-game-battle-math.mjs';

export {LEGACY_GAME_BATTLE_PET_TRANSITION_PROFILE,planBattlePetTransition} from './legacy-game-battle-pet-transition.mjs';

export {LEGACY_GAME_PLAYER_SKILL_PROFILE,LegacyGamePlayerSkillError,createLegacyGamePlayerSkills,legacyGamePlayerSkillCost} from './legacy-game-player-skills.mjs';
export {LEGACY_GAME_CRAFT_RECIPE_PROFILE,LegacyGameCraftRecipeError,createLegacyGameCraftRecipes} from './legacy-game-craft-recipes.mjs';
export {createLegacyGameItems} from './legacy-game-items.mjs';
export {LEGACY_GAME_BATTLE_CASTING_PROFILE,battleCastingResources,planBattleCasting} from './legacy-game-battle-casting.mjs';
export {legacyGameBattleHomingAngle} from './legacy-game-battle-casting-playback.mjs';
export {LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE,planBattleStatusSkill,battleStatusSkillEffect} from './legacy-game-battle-status-skills.mjs';
export {LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE,planBattleNumericSkill} from './legacy-game-battle-numeric-skills.mjs';
export {LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE} from './legacy-game-battle-moving-numeric-playback.mjs';
export {LEGACY_GAME_BATTLE_SKILL82_PROFILE,planBattleSkill82} from './legacy-game-battle-skill82.mjs';
export {LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE,planBattlePhysicalFamily} from './legacy-game-battle-physical-family.mjs';
export {LEGACY_GAME_BATTLE_ATTACHED_RID_PROFILE,planBattleAttachedRID} from './legacy-game-battle-attached-rid.mjs';
export {LEGACY_GAME_BATTLE_COMBINATION_PROFILE,planBattleCombination} from './legacy-game-battle-combination.mjs';
export {LEGACY_GAME_BATTLE_SHARED_STORAGE_PROFILE} from './legacy-game-battle-shared-storage-playback.mjs';
export {LEGACY_GAME_BATTLE_RIDING_PROFILE,planBattleRiding} from './legacy-game-battle-riding.mjs';

export {planBattleSharedStorage} from './legacy-game-battle-shared-storage.mjs';

export { LEGACY_GAME_BATTLE_AUDIO_PROFILE, legacyGameSound, legacyGameSoundPan, createLegacyGameBattleAudio } from './legacy-game-battle-audio.mjs';

export { LEGACY_GAME_RESOURCE_ARCHIVE_PROFILE, createLegacyGameResourceArchive } from './legacy-game-resource-archive.mjs';
export { LEGACY_GAME_MINIMAP_PROFILE, legacyGameMinimapWindow, legacyGameMinimapColor, createLegacyGameMinimapGrid, renderLegacyGameMinimap, overlayLegacyGameMinimap, createLegacyGameMinimapBlink } from './legacy-game-minimap.mjs';
export { createLegacyGameMinimapOwner } from './legacy-game-minimap-owner.mjs';
export { LEGACY_GAME_NAMED_PALETTE_PROFILE, legacyGameNamedPalette } from './legacy-game-named-palette.mjs';

export {LEGACY_GAME_BATTLE_DRAW_STYLE_PROFILE,legacyGameBattleDrawStyle} from './legacy-game-battle-draw-style.mjs';
export { createLegacyGameCityReturn } from './legacy-game-city-return.mjs';

export {LEGACY_GAME_CRAFT_PROFILE,LegacyGameCraftError,createLegacyGameCraft,decodeLegacyGameCraftResult} from './legacy-game-craft.mjs';
export {LEGACY_GAME_WORK_CONTEXT_PROFILE,LegacyGameWorkContextError,legacyGameWorkContextSlot,legacyGameWorkContextAvailable,legacyGameWorkDuration} from './legacy-game-work-context.mjs';

export {LEGACY_GAME_WORK_ACTION_PROFILE,LegacyGameWorkActionError,legacyGameWorkMode,legacyGameWorkItemEligible,legacyGameDecorationItemGroup,legacyGameWorkMark,decodeLegacyGameItemWorkResult} from './legacy-game-work-actions.mjs';
export {LEGACY_GAME_WORK_TARGET_PROFILE,LegacyGameWorkTargetError,legacyGameTargetWorkMode,legacyGameGatherPose,legacyGameGatherDeadline,decodeLegacyGameWorkPeople,decodeLegacyGameWorkSubjects,decodeLegacyGameTargetWorkResult,decodeLegacyGameGatherResult} from './legacy-game-work-targets.mjs';

/** Select the source movement and input contexts through the product routes and walk with real TCP. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { createLauncherLoopbackServer } from '../../adapters/node/launcher-loopback.mjs';
import { assets, startup } from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import { clientOriginalPeer } from '../../web/tests/helpers/legacy-game-client-tcp-fixture.mjs';
import { observeAudio, originalAudioRows } from '../game-legacy-audio-v1/original-audio.mjs';
import { originalMusicPhaseRows } from '../game-legacy-music-phases-v1/original-music.mjs';
import { battleFiles } from '../game-battle-web-v1/browser-fixture.mjs';
import { petTransitionFiles } from '../game-battle-pet-transition-v1/tcp-flow.mjs';
import { statusVariantFiles } from '../game-legacy-battle-status-variant-v1/original_assets.mjs';
import { statusSlotFiles } from '../game-legacy-battle-status-slots-v1/original_assets.mjs';
import { actorTransitionAssets } from '../game-battle-shared-storage-v1/actor-transitions-fixture.mjs';
import { rid0FallAssets } from '../game-legacy-battle-rid0-ownership-v1/fixture.mjs';
import { taggedSoundRows, observeSoundAudio, verifyPlayedSounds } from '../game-legacy-battle-audio-v1/reference.mjs';
import { completeSoundRows } from '../game-legacy-resource-archive-v1/product-fixture.mjs';

const battleSummon = process.env.MOLI_BATTLE_SUMMON === '1';
const sustainedStream = process.env.MOLI_ORDINARY_STREAM === '1';
const statusBattle = process.env.MOLI_BATTLE_STATUS_VARIANT;
const statusSwap = statusBattle === 'swap';
const statusRegistry = statusBattle === 'missing-physical-registry';
const statusDeparture = statusBattle === 'missing-physical-departed';
const statusAliasFlight = statusBattle === 'physical-self-alias-flight';
const statusDirectSelf = statusAliasFlight || ['physical-self-only', 'physical-self-alias-only'].includes(statusBattle);
const statusNestedGuard = statusBattle === 'physical-nested-guard-departed';
const statusNestedAligned = statusBattle === 'physical-skl113-aligned';
const statusOuterGuard = statusBattle === 'physical-skl113-outer-guard';
const statusSharedGuard = statusBattle === 'physical-skl72-shared-guard';
const statusDeathExit = statusBattle === 'casting-skl19-lethal-rid0';
const statusCasterPaired = statusBattle === 'casting-skl19-caster-paired-rid0';
const statusQueuedAck = statusBattle === 'casting-skl19-queued-ack';
const statusPursuitLinked = statusBattle === 'casting-pursuit-linked';
const statusWeatherStacked = statusBattle === 'casting-weather-stacked';
const statusSelfMetadata = statusBattle?.startsWith('physical-self-metadata-');
const statusCommonSelfGuard = statusBattle?.startsWith('physical-common-self-guard');
const statusSelfFlags = statusBattle?.startsWith('physical-self-flags-');
const statusModifier = statusBattle?.startsWith('modifier-');
const statusUpper = statusBattle?.startsWith('upper-');
const statusImpact = statusBattle?.startsWith('impact-');
const statusDetachedRID = ['impact-106-RID', 'impact-106-RID-wait'].includes(statusBattle);
const statusDetachedRIDWait = statusBattle === 'impact-106-RID-wait';
const statusBasicSelf = statusSelfFlags || statusCommonSelfGuard || statusSelfMetadata || ['physical-basic-self', 'physical-basic-self-following', 'physical-class5-self', 'physical-class6-self-following', 'physical-class84-self-following', 'physical-self-reflect-following', 'physical-self-heal-following', 'physical-self-skip-priority', 'physical-self-control-charge', 'physical-self-control-charged-reflect', 'physical-self-control-scatter-stop'].includes(statusBattle);
const battleReentry = process.env.MOLI_BATTLE_REENTRY === '1';
const reentryVectors = JSON.parse(readFileSync(new URL('../game-legacy-battle-reentry-v1/original-fixture.json', import.meta.url)));
if (battleReentry) assert.ok(['physical-self-control-charge', 'physical-self-control-charged-reflect', 'physical-self-control-scatter-stop'].includes(statusBattle));
const statusSelfStop = statusBattle === 'physical-self-control-scatter-stop';
const statusSelfReflect = ['physical-self-flags-opaque', 'physical-self-reflect-following', 'physical-self-control-charged-reflect', 'physical-self-metadata-messages', 'physical-self-metadata-RID'].includes(statusBattle);
const statusLongResult = statusDetachedRIDWait || statusPursuitLinked || statusWeatherStacked || (statusBasicSelf && !statusSelfReflect && !statusSelfStop);
const statusObservedKeepalives = statusLongResult || statusSelfReflect || statusSelfStop || statusModifier || statusUpper || statusImpact;
const statusQueuedUpdate = statusQueuedAck || statusBattle === 'casting-skl19-queued-update';
const statusRid0Casting = statusDeathExit || statusCasterPaired || statusQueuedUpdate ||
  ['casting-skl19-rid0', 'casting-skl19-reflected-rid0'].includes(statusBattle);
const statusRid0 = statusRid0Casting || statusBattle?.startsWith('physical-skl72-rid0-');
const statusRid0Abort = statusBattle?.startsWith('physical-skl72-rid0-interrupt');
const statusRid0AliasFlight = statusBattle === 'physical-skl72-rid0-alias-flight';
const splitSlot = statusCasterPaired ? 10 : statusRid0Abort ? 1 : 2;
const splitName = statusRid0Casting ? 'AfterCast' : statusRid0Abort ? 'AfterAbort' : 'AfterSplit';
const departedLookaheadSlot = { 'physical-skl72-missing-lookahead': 11, 'physical-skl72-missing-later-lookahead': 12 }[statusBattle];
const longGuardRound = statusRid0 || statusBattle?.startsWith('casting-pursuit-') || statusBattle?.startsWith('casting-weather-') || ['physical-skl72-idle-attacker', 'physical-skl72-idle-guard-wait',
  'physical-skl72-late-recipient', 'physical-skl72-late-recipient-two-sources',
  'physical-skl72-late-reflect-rid', 'physical-skl72-late-heal-rid', 'physical-skl72-late-skip'].includes(statusBattle);
const repeatedGuardActors = new Map([
  ...['impact-106-RID','impact-106-RID-wait'].map(mode=>[mode,[[0,70,100,5,10],[10,70,100,10,10]]]),
  ...[4,97,106,111,116].map(k=>['impact-'+k,[[0,70,100,5,10],[10,58,100,10,10]]]),
  ['upper-107', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['upper-108', [[0,70,100,5,10],[10,77,100,10,10]]],
  ['upper-109', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['upper-112', [[0,70,100,5,10]]],
  ['upper-114', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['upper-117', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['modifier-99', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['modifier-104', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['modifier-existing', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['physical-self-flags-impact', [[0,58,100,5,10],[10,70,100,10,10]]],
  ['physical-self-flags-partial', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['physical-self-flags-opaque', [[0,58,100,5,10],[10,70,100,10,10]]],
  ['physical-common-self-guard', [[0,70,100,5,10],[1,70,100,10,10],[10,70,100,10,10]]],
  ['physical-common-self-guard-all', [[0,70,100,5,10],[10,70,100,10,10]]],
  ['physical-common-self-guard-charge', [[0,70,100,5,10],[1,70,100,10,10],[10,70,100,10,10]]],
  ['physical-self-metadata-messages', [[0,58,100,5,10],[10,70,100,10,10]]],
  ['physical-self-metadata-RID', [[0,58,100,5,10],[10,70,100,10,10]]],
  ['physical-self-metadata-cleanup', [[0,58,100,5,10],[10,70,100,10,10]]],
  ['physical-skl72-repeat-protected', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [10, 70, 100, 10, 10]]],
  ['physical-skl72-repeat-two-guards', [[0, 70, 100, 5, 10], [1, 70, 100, 10, 10], [2, 63, 100, 10, 10], [10, 70, 100, 10, 10]]],
  ['physical-skl72-repeat-following', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10]]],
  ['physical-skl72-following-series', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [10, 68, 100, 10, 10], [11, 69, 100, 10, 10]]],
  ['physical-skl72-following-shared-target', [[0, 70, 100, 5, 10], [1, 70, 100, 10, 10], [2, 63, 100, 10, 10], [10, 70, 100, 10, 10], [11, 67, 100, 10, 10]]],
  ['physical-skl72-missing-lookahead', [[0, 70, 100, 8, 10], [1, 70, 100, 10, 10], [10, 70, 100, 10, 10]]],
  ['physical-skl72-missing-later-lookahead', [[0, 70, 100, 8, 10], [1, 70, 100, 10, 10], [2, 70, 100, 10, 10], [10, 70, 100, 10, 10], [11, 70, 100, 10, 10]]],
  ['physical-skl72-idle-attacker', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 70, 100, 10, 10], [10, 68, 100, 10, 10], [11, 69, 100, 10, 10], [12, 70, 100, 10, 10]]],
  ['physical-skl72-idle-guard-wait', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 70, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10]]],
  ['physical-skl72-late-recipient', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 68, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-late-recipient-two-sources', [[0, 70, 100, 5, 10], [1, 70, 100, 10, 10], [2, 64, 100, 10, 10], [3, 63, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-late-reflect-rid', [[0, 70, 100, 5, 10], [1, 61, 100, 10, 10], [2, 70, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-late-heal-rid', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 72, 100, 10, 10], [10, 70, 100, 10, 10], [11, 65, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-late-skip', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 70, 100, 10, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-rid0-late', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 41, 100, 8, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-rid0-inline', [[0, 70, 100, 5, 10], [1, 63, 100, 10, 10], [2, 41, 100, 8, 10], [10, 70, 100, 10, 10], [11, 65, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-rid0-alias', [[0, 70, 100, 5, 10], [1, 61, 100, 10, 10], [2, 41, 100, 8, 10], [10, 70, 100, 10, 10], [11, 69, 100, 10, 10], [12, 67, 100, 10, 10]]],
  ['physical-skl72-rid0-interrupt', [[0, 70, 100, 10, 10], [1, 41, 100, 8, 10], [10, 70, 100, 10, 10]]],
  ['physical-skl72-rid0-interrupt-two', [[0, 70, 100, 10, 10], [1, 41, 100, 6, 10], [10, 70, 100, 10, 10]]],
  ['casting-skl19-rid0', [[0, 70, 100, 10, 10], [2, 41, 100, 6, 10], [10, 58, 100, 10, 10]]],
  ['casting-skl19-reflected-rid0', [[0, 70, 100, 10, 10], [2, 41, 100, 6, 10], [10, 70, 100, 10, 10]]],
  ['casting-skl19-lethal-rid0', [[0, 0, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['casting-skl19-caster-paired-rid0', [[0, 70, 100, 10, 10], [10, 41, 100, 8, 10]]],
  ['casting-skl19-queued-update', [[0, 70, 100, 10, 10], [2, 41, 100, 6, 10], [10, 70, 100, 10, 10]]],
  ['casting-skl19-queued-ack', [[0, 70, 100, 10, 10], [2, 41, 100, 6, 10], [10, 70, 100, 10, 10]]],
  ['casting-pursuit-repeated', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['casting-pursuit-notice-repeated', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-self-control-charge', [[0, 58, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-self-control-charged-reflect', [[0, 58, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-self-control-scatter-stop', [[0, 58, 100, 7, 10], [10, 70, 100, 10, 10]]],
  ['physical-self-reflect-following', [[0, 58, 100, 5, 10], [10, 70, 100, 4, 10]]],
  ['physical-self-heal-following', [[0, 82, 100, 5, 10], [10, 70, 100, 4, 10]]],
  ['physical-self-skip-priority', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-class5-self', [[0, 58, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-class6-self-following', [[0, 58, 100, 5, 10], [10, 70, 100, 4, 10]]],
  ['physical-class84-self-following', [[0, 58, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-basic-self', [[0, 58, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['physical-basic-self-following', [[0, 58, 100, 5, 10], [10, 64, 100, 10, 10]]],
  ['casting-weather-repeat', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['casting-weather-stacked', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
  ['casting-pursuit-linked', [[0, 70, 100, 5, 10], [10, 70, 100, 10, 10]]],
]).get(statusRid0AliasFlight ? 'physical-skl72-rid0-alias' : statusBattle);
const statusNestedSeparate = statusOuterGuard || statusBattle === 'physical-skl113-separate';
const statusNestedWire = statusNestedAligned || statusNestedSeparate || statusSharedGuard || !!repeatedGuardActors || statusBattle === 'physical-skl113-grouped';
const statusSelfGuard = statusBattle === 'physical-self-guard';
const statusFlightTarget = statusBattle === 'physical-self-guard-flight-target';
const statusGuardFlight = statusFlightTarget || statusBattle === 'physical-self-guard-flight';
const physicalGuard = statusNestedGuard || statusSelfGuard || statusGuardFlight;
const guardSlot = statusFlightTarget ? 10 : 1;
const guardHP = statusNestedGuard ? 63 : statusFlightTarget ? 70 : 77;
const guardTargetHP = statusGuardFlight && !statusFlightTarget ? 63 : 70;
const secondRound = statusSwap || statusRegistry || statusQueuedUpdate;
const statusAssist = ['impact', 'recovery'].includes(statusBattle);
const familyMissing = ['missing-status', 'missing-magic', 'missing-numeric', 'missing-82',
  'missing-physical-attacker', 'missing-physical-first', 'missing-physical-late', 'missing-physical-chain',
  'missing-physical-projectile', 'missing-physical-nested'].includes(statusBattle) || statusRegistry || statusDeparture;
const statusMissing = familyMissing || ['missing-target', 'missing-swap', 'assist-ff-impact', 'assist-ff-recovery'].includes(statusBattle);
const statusSlotBattle = statusAssist || statusMissing || statusDirectSelf || physicalGuard || statusNestedWire || ['grow', 'retire', 'swap'].includes(statusBattle);
const battleResult = battleSummon || !!statusBattle;
const battleWrites = secondRound || statusDeathExit ? 10 : 9;
const battleActors = statusUpper || statusImpact ? 2 : repeatedGuardActors ? repeatedGuardActors.length + Number(statusCasterPaired) + Number(departedLookaheadSlot !== undefined) : (statusNestedAligned ? 6 : statusNestedGuard || statusNestedWire ? 4 :
  statusAssist || statusRegistry || statusDeparture || (physicalGuard && !statusFlightTarget) ? 3 : 2);
const statusTargetHP = { revive: 100, grow: 70, swap: 70, impact: 58, recovery: 82, 'physical-self-only': 70,
  'physical-self-alias-only': 70, 'physical-self-alias-flight': 63,
  'physical-skl113-separate': 70, 'physical-skl113-grouped': 70, 'physical-skl113-aligned': 70,
  'physical-skl113-outer-guard': 70, 'physical-skl72-shared-guard': 70,
  'physical-skl72-repeat-protected': 70, 'physical-skl72-repeat-two-guards': 70, 'physical-skl72-repeat-following': 70,
  'physical-skl72-following-series': 68, 'physical-skl72-following-shared-target': 70,
  'physical-skl72-missing-lookahead': 70, 'physical-skl72-missing-later-lookahead': 70,
  'physical-skl72-idle-attacker': 68, 'physical-skl72-idle-guard-wait': 70,
  'physical-skl72-late-recipient': 70, 'physical-skl72-late-recipient-two-sources': 70,
  'physical-skl72-late-reflect-rid': 70, 'physical-skl72-late-heal-rid': 70, 'physical-skl72-late-skip': 70,
  'physical-skl72-rid0-late': 70, 'physical-skl72-rid0-inline': 70, 'physical-skl72-rid0-alias': 70, 'physical-skl72-rid0-alias-flight': 70,
  'physical-skl72-rid0-interrupt': 70, 'physical-skl72-rid0-interrupt-two': 70, 'casting-skl19-rid0': 58,
  'casting-skl19-reflected-rid0': 70, 'casting-skl19-lethal-rid0': 70, 'casting-skl19-caster-paired-rid0': 41,
  'casting-pursuit-repeated': 70, 'casting-pursuit-notice-repeated': 70, 'casting-pursuit-linked': 70, 'casting-weather-repeat': 70, 'casting-weather-stacked': 70, 'physical-self-control-charge': 70, 'physical-self-control-charged-reflect': 70, 'physical-self-control-scatter-stop': 70, 'physical-self-reflect-following': 70, 'physical-self-heal-following': 70, 'physical-self-skip-priority': 70, 'physical-class5-self': 70, 'physical-class6-self-following': 70, 'physical-class84-self-following': 70, 'physical-basic-self': 70, 'physical-basic-self-following': 64 };
if (statusModifier || statusUpper || statusImpact || statusSelfFlags || statusSelfMetadata || statusCommonSelfGuard) statusTargetHP[statusBattle] = statusDetachedRID ? 70 : statusImpact ? 58 : statusBattle === 'upper-108' ? 77 : statusBattle === 'upper-112' ? null : 70;
if (statusBattle) assert.ok(statusSlotBattle || ['ko', 'revive'].includes(statusBattle));
const manualReturn = process.env.MOLI_ORDINARY_MANUAL_RETURN === '1';
const cityRoute = process.env.MOLI_ORDINARY_CITY_RETURN;
const battleCity = ['battle-transfer', 'battle-early', 'battle-late'].includes(cityRoute);
const cityReturn = battleCity || cityRoute === 'scene' || cityRoute === 'boundary';
const cityTransfer = ['scene', 'battle-transfer', 'battle-late'].includes(cityRoute);
const cityRequests = cityRoute === 'boundary' || cityRoute === 'battle-late' ? 3 : battleCity ? 2 : 1;
const serverReturn = !cityReturn && (manualReturn || process.env.MOLI_ORDINARY_SERVER_RETURN === '1');
const musicPhases = serverReturn && !manualReturn && process.env.MOLI_ORDINARY_MUSIC_PHASES === '1';
const sceneMusic = musicPhases || (serverReturn || cityReturn) && process.env.MOLI_ORDINARY_AUDIO === '1';
const battleAudio = ['on', 'muted'].includes(process.env.MOLI_BATTLE_AUDIO);
const mutedBattleAudio = process.env.MOLI_BATTLE_AUDIO === 'muted';
const resourceArchive = process.env.MOLI_RESOURCE_ARCHIVE;
if (resourceArchive) assert.ok(['stored', 'deflated'].includes(resourceArchive));
const resourceArchivePath = resourceArchive ? resolve('build/analysis/game-legacy-resource-archive-v1/product-' + resourceArchive + '.zip') : null;
const battleReturn = serverReturn && (manualReturn || process.env.MOLI_ORDINARY_HOST === 'wechat') && process.env.MOLI_ORDINARY_RETURN_BATTLE === '1';
const peerMode = sustainedStream ? 'browser-stream' : statusBattle ? 'battle-status-' + statusBattle :
  battleSummon ? 'battle-summon' : cityReturn ? 'city-return-' + cityRoute : manualReturn ? (battleReturn ? 'manual-return-battle' : 'manual-return') :
  musicPhases ? 'music-phases' : battleReturn ? 'server-return-battle' : serverReturn ? 'server-return' : 'browser';
const scenario = sustainedStream ? 'keeps one game stream through two idle sends and walks' : statusDeathExit ? 'plays lethal reflection, exits battle and resumes movement' : statusBattle ? 'plays ' + (familyMissing || statusDirectSelf || physicalGuard || statusNestedWire ? 'SKL ' : 'SKL98 ') + statusBattle + ', settles the round and resumes movement' :
  battleSummon ? 'plays SKL93, settles the round and resumes movement' :
  cityReturn ? `returns to town through the ${cityRoute} path and resumes movement` :
  manualReturn ? `returns to server selection from ${battleReturn ? 'battle' : 'the map'}` :
  musicPhases ? 'plays lobby, battle and ordinary return music' :
  battleReturn ? 'enters battle and plays server return' : serverReturn ? 'enters, walks and plays server return' : 'enters and walks';
const extraAudio = [
  ...(battleAudio ? resourceArchive ? completeSoundRows() : taggedSoundRows() : []),
  ...(sceneMusic ? originalAudioRows() : []),
  ...(musicPhases ? originalMusicPhaseRows() : (battleReturn || battleCity) && sceneMusic ? originalMusicPhaseRows().filter(row => row.path.endsWith('puk2_battle1.wav')) : []),
];
const exitMusicIndex = musicPhases ? 3 : battleReturn ? 1 : 0;
const phaseSequence = [0.25, 0.75, 0.5, -0.25];
const peerOptions = { sceneMusic: sceneMusic && !musicPhases, reentry: battleReentry };
const nestedAssets = statusNestedGuard || statusNestedWire ? (await import('../game-battle-nested-physical-v1/tcp-flow.mjs')).nestedPhysicalFiles() : null;
const resultAssets = nestedAssets && (statusNestedGuard || statusRid0 || departedLookaheadSlot !== undefined)
  ? actorTransitionAssets(nestedAssets) : nestedAssets;
let resultFiles = statusImpact ? (await import('../game-legacy-battle-impact-skills-v1/fixture.mjs')).impactSkillProductFiles().files : statusUpper ? (await import('../game-legacy-battle-upper-skills-v1/fixture.mjs')).upperSkillProductFiles().files : statusModifier ? (await import('../game-legacy-battle-skill99-v1/fixture.mjs')).skill99ProductFiles().files : resultAssets ? (statusRid0AliasFlight || statusRid0Casting ? rid0FallAssets(resultAssets) : resultAssets).files :
  statusDirectSelf || statusSelfGuard || statusGuardFlight ? (await import('../game-battle-self-physical-v1/tcp-flow.mjs')).selfPhysicalFiles().files :
  statusDeparture ? actorTransitionAssets(statusSlotFiles()).files :
  statusSlotBattle ? statusSlotFiles().files : statusBattle ? statusVariantFiles().files : battleSummon ? petTransitionFiles().files : null;
const battleDrawStyle=process.env.MOLI_BATTLE_DRAW_STYLE;
if(battleDrawStyle){const fixture=(await import('../game-battle-draw-style-v1/product-fixture.mjs')).battleDrawStyleFiles(resultFiles,battleDrawStyle);resultFiles=fixture.files;console.log(JSON.stringify({battleDrawStyleFixture:fixture.receipt}));}

function material() {
  const value = startup(), profile = 'legacy-se6000-37c4';
  if (mutedBattleAudio) value.resourceParametersHex += Buffer.from(' soundoff').toString('hex');
  if (process.env.MOLI_ORDINARY_CONTEXT === 'profile') value.context = profile;
  else Object.assign(value.context, { movement: profile, input: profile, display: profile });
  return JSON.stringify(value);
}

async function checkPeer(peer, battleKeepalives = 0) {
  const receipt = await peer.receipt();
  assert.equal(receipt.total_client_requests, sustainedStream || battleResult ? battleWrites + (battleReentry ? 4 : 0) + battleKeepalives : cityReturn ? 9 + cityRequests : musicPhases || manualReturn ? 8 : 7);
  assert.equal(receipt.entry_request_verified, true);
  assert.equal(receipt.movement_requests_verified, cityReturn || battleReentry ? 4 : 2);
  assert.equal(receipt.scene_reloaded, cityReturn ? cityTransfer : !serverReturn && !battleResult);
  if (cityReturn) assert.deepEqual([receipt.city_return_verified, receipt.city_return_requests], [true, cityRequests]);
  if (serverReturn) assert.equal(receipt.server_return_confirmed, true);
  if (manualReturn) assert.equal(receipt.return_request_verified, true);
  if (musicPhases) assert.equal(receipt.battle_exit_verified, true);
  if (battleSummon) assert.deepEqual([receipt.summon_guards_verified, receipt.battle_exit_verified], [1, true]);
  if (statusBattle) assert.deepEqual([statusDeathExit ? receipt.status_pet_waits_verified : receipt.status_guards_verified,
    receipt.battle_exit_verified], [secondRound || statusDeathExit || battleReentry ? 2 : 1, true]);
  assert.equal(receipt.official_session, false);
  if (battleReentry) assert.deepEqual([receipt.battles_verified, receipt.accepted_connections, receipt.second_battle_verified], [2, 1, true]);
  if (statusObservedKeepalives) {
    assert.equal(receipt.battle_keepalives_verified, battleKeepalives);
    if (statusLongResult) assert.ok(battleKeepalives >= 3, 'real native wait continues normal keepalive requests');
    console.log(JSON.stringify({ [statusImpact ? 'impactTCP' : statusUpper ? 'upperTCP' : statusModifier ? 'modifierTCP' : statusPursuitLinked ? 'linkedTCP' : statusWeatherStacked ? 'weatherTCP' : 'selfPairTCP']: true, requests: receipt.total_client_requests,
      keepalives: battleKeepalives, guards: receipt.status_guards_verified,
      exit: receipt.battle_exit_verified, movement: receipt.movement_requests_verified, official: false }));
  }
  if (statusQueuedUpdate) console.log(JSON.stringify({ queuedTCP: true, requests: receipt.total_client_requests,
    guards: receipt.status_guards_verified, exit: receipt.battle_exit_verified,
    movement: receipt.movement_requests_verified, official: receipt.official_session }));
}

async function startLocalGameBridge(port) {
  const child = spawn(process.execPath, ['web/examples/legacy-game-browser-local.mjs', '--endpoint', '127.0.0.1:' + port]);
  const lines = createInterface({ input: child.stdout });
  let errors = '';
  child.stderr.on('data', chunk => { errors += chunk; });
  child.on('error', error => { errors += error.message; });
  const exited = new Promise(resolve => child.once('close', resolve));
  async function close() {
    lines.close();
    child.kill('SIGTERM');
    await exited;
  }
  try {
    const first = await lines[Symbol.asyncIterator]().next();
    assert.equal(first.done, false, errors);
    const url = new URL(JSON.parse(first.value).url);
    assert.equal(url.pathname, '/web/game.html');
    assert.equal(url.hostname, '127.0.0.1');
    return { origin: url.origin, close };
  } catch (error) { await close(); throw error; }
}

function summonSettled(battle) {
  if (battle?.blocked) assert.fail(JSON.stringify(battle.blocked));
  const enemy = battle?.actors.find(row => row.slot === 10);
  if (enemy?.vitals[2] !== 5) return false;
  assert.equal(enemy.name, 'NewEnemy');
  assert.deepEqual(enemy.vitals, [61,90,5,12]);
  const pet = battle.actors.find(row => row.slot === 5);
  assert.equal(pet.name, 'NewPet');
  assert.deepEqual(pet.vitals, [61,90,7,12]);
  assert.equal(battle.actors.find(row => row.slot === 0).vitals[2], 7);
  return true;
}

const namedActorVitals = battle => battle.actors.map(row => [row.slot, row.name, [...row.vitals]]).sort((a,b) => a[0]-b[0]);
function reentryReady(battle) {
  if (battle?.blocked) assert.fail(JSON.stringify(battle.blocked));
  return !!battle?.ready && battle.round === 0 && JSON.stringify(namedActorVitals(battle)) === JSON.stringify(reentryVectors.initial);
}
function reentrySettled(battle) {
  if (battle?.blocked) assert.fail(JSON.stringify(battle.blocked));
  return battle?.round === 1 && JSON.stringify(namedActorVitals(battle)) === JSON.stringify(reentryVectors.result);
}

const actorVitals = battle => battle.actors.map(row => [row.slot, ...row.vitals]).sort((a, b) => a[0] - b[0]);

function resultSettled(battle) {
  if (battleSummon) return summonSettled(battle);
  if (battle?.blocked) assert.fail(JSON.stringify(battle.blocked));
  if (statusQueuedUpdate) return queuedSettled(battle, 9);
  if (statusSwap) return swapSettled(battle, 5, 7);
  if (statusRegistry) return battle?.actors.some(row => row.slot === 11) && battle.actors.find(row => row.local)?.vitals[2] === 9;
  if (repeatedGuardActors) {
    if (battle?.actors.find(row => row.local)?.vitals[2] !== repeatedGuardActors[0][3]) return false;
    if (statusSelfStop && battle.actors.find(row => row.local)?.vitals[0] !== repeatedGuardActors[0][1]) return false;
    if (statusDeathExit) {
      if (battle.actors.find(row => row.local)?.vitals[0] !== 0) return false;
      assert.deepEqual(actorVitals(battle), repeatedGuardActors);
      return true;
    }
    if (statusRid0 && (battle.actors.length !== repeatedGuardActors.length ||
        battle.actors.find(row => row.slot === splitSlot)?.name !== splitName)) return false;
    if (statusRid0Casting && battle.actors.find(row => row.slot === splitSlot)?.vitals[2] !== (statusCasterPaired ? 8 : 6)) return false;
    assert.deepEqual(actorVitals(battle), repeatedGuardActors);
    return true;
  }
  if (statusNestedWire) {
    const caster = battle?.actors.find(row => row.local), nested = battle?.actors.find(row => row.slot === 11);
    const casterMP = statusNestedSeparate ? 7 : 5, nestedMP = statusNestedSeparate ? 8 : 10;
    if (caster?.vitals[2] !== casterMP || nested?.vitals[2] !== nestedMP) return false;
    assert.deepEqual(caster.vitals, [70, 100, casterMP, 10]);
    assert.deepEqual(nested.vitals, [statusNestedAligned ? 71 : statusSharedGuard ? 70 : 63, 100, nestedMP, 10]);
    for (const slot of statusNestedAligned ? [1, 10, 12] : [1, 10]) {
      const hp = statusSharedGuard && slot === 1 ? 63 : 70;
      assert.deepEqual(battle.actors.find(row => row.slot === slot)?.vitals, [hp, 100, 10, 10]);
    }
    if (statusNestedAligned) assert.deepEqual(battle.actors.find(row => row.slot === 2)?.vitals, [63, 100, 10, 10]);
    return true;
  }
  if (physicalGuard) {
    const caster = battle?.actors.find(row => row.local);
    if (caster?.vitals[2] !== 5) return false;
    assert.deepEqual(caster.vitals, [70, 100, 5, 10]);
    assert.deepEqual(battle.actors.find(row => row.slot === guardSlot)?.vitals, [guardHP, 100, 10, 10]);
    assert.deepEqual(battle.actors.find(row => row.slot === 10)?.vitals, [guardTargetHP, 100, 10, 10]);
    assert.deepEqual(battle.actors.map(row => row.slot).sort((a, b) => a - b), statusFlightTarget ? [0, 10] : [0, 1, 10]);
    return true;
  }
  if (statusMissing) return swapSettled(battle, statusBattle === 'missing-swap' ? 5 : 0, 8);
  if (statusDirectSelf) {
    if (!swapSettled(battle, 0, 5, statusTargetHP[statusBattle])) return false;
    assert.deepEqual(battle.actors.find(row => row.local).vitals, [77, 100, 5, 10]);
    return true;
  }
  if (battle?.actors.find(row => row.slot === 0)?.vitals[2] !== 7) return false;
  const target = battle.actors.find(row => row.slot === 10);
  if (statusBattle === 'ko' || statusBattle === 'retire') return target === undefined;
  if (statusAssist && battle.actors.some(row => row.slot === 1)) return false;
  const vitals = [statusTargetHP[statusBattle], 100, statusBattle === 'revive' ? 8 : 10, 10];
  if (target?.vitals[0] !== vitals[0]) return false;
  assert.deepEqual(target.vitals, vitals);
  return true;
}

function swapSettled(battle, slot, mp, targetHP = 70) {
  const caster = battle?.actors.find(row => row.local);
  if (caster?.slot !== slot || caster.vitals[2] !== mp) return false;
  assert.equal(battle.actors.length, 2);
  assert.equal(caster.name, 'Original');
  assert.deepEqual(battle.actors.find(row => row.slot === 10)?.vitals, [targetHP, 100, 10, 10]);
  return true;
}

function queueInProgress(battle) {
  const caster = battle?.actors.find(row => row.slot === 2);
  return caster?.name === 'Extra2' && caster.vitals[0] === 70 && caster.vitals[2] === 7;
}

function queuedSettled(battle, mp) {
  const localSlot = statusQueuedAck ? 5 : 0;
  if (battle?.actors.find(row => row.slot === 0)?.name !== 'Queued0' ||
      battle.actors.find(row => row.slot === localSlot)?.vitals[2] !== mp) return false;
  assert.deepEqual(actorVitals(battle), statusQueuedAck ? [[0, 90, 100, 9, 10], [5, 90, 100, mp, 10]]
    : [[0, 90, 100, mp, 10], [2, 90, 100, 9, 10]]);
  assert.equal(battle.actors.find(row => row.slot === (statusQueuedAck ? 5 : 2)).name, statusQueuedAck ? 'Queued5' : 'Queued2');
  assert.equal(battle.actors.find(row => row.local)?.slot, localSlot);
  return true;
}

function logBattleResult(surface, battle, followup) {
  if (statusQueuedUpdate) {
    console.log(JSON.stringify({ surface, statusVariant: statusBattle, queuedDuringMotion: true,
      firstRoundActors: actorVitals(battle), nextRoundActors: actorVitals(followup),
      completedRound: battle.round, nextCompletedRound: followup.round, resumedMovement: true,
      ...(statusQueuedAck ? { nextLocalSlot: followup.actors.find(row => row.local).slot } : {}) }));
    return;
  }
  const result = statusBattle ? {statusVariant:statusBattle,targetHP:physicalGuard ? guardTargetHP : statusMissing ? 70 : statusTargetHP[statusBattle] ?? null}
    : {summonBodies:2,replacementMP:5};
  let casterMP = 7;
  if (statusMissing || statusDirectSelf || physicalGuard || statusNestedWire) {
    const caster = battle.actors.find(row => row.local);
    result.localSlot = caster.slot;
    casterMP = caster.vitals[2];
    if (statusDirectSelf || physicalGuard || statusNestedWire) result.casterHP = caster.vitals[0];
  }
  if (physicalGuard) result.guardHP = battle.actors.find(row => row.slot === guardSlot).vitals[0];
  if (statusGuardFlight) result.guardSlot = guardSlot;
  if (statusAssist) Object.assign(result, { assistRemoved: !battle.actors.some(row => row.slot === 1) });
  if (statusDeparture) result.departedSlot = 11;
  if (statusNestedGuard) result.departedSlot = 16;
  if (departedLookaheadSlot !== undefined) result.departedSlot = departedLookaheadSlot;
  if (repeatedGuardActors) result.actors = actorVitals(battle);
  if (statusBasicSelf || statusModifier || statusUpper || statusImpact) result.completedRound = battle.round;
  if (statusSelfMetadata) result.metadataPath = true;
  if (statusSelfFlags) result.selfFlagsPath = true;
  if (statusModifier) result.modifierPath = true;
  if (statusUpper) result.upperSkillPath = true;
  if (statusImpact) result.impactSkillPath = true;
  if (statusDetachedRID) { result.detachedRIDPath = true; result.sourceWait = statusDetachedRIDWait; }
  if (statusCommonSelfGuard) result.selfGuardAliasPath = true;
  if (!statusBasicSelf && !statusModifier && !statusUpper && !statusImpact && statusNestedWire) {
    const nested = battle.actors.find(row => row.slot === 11);
    Object.assign(result, {nestedSlot:11,nestedHP:nested.vitals[0],nestedMP:nested.vitals[2]});
    if (statusNestedAligned) result.guardHP = battle.actors.find(row => row.slot === 2).vitals[0];
    if (statusOuterGuard || statusSharedGuard) result.guardHP = battle.actors.find(row => row.slot === 1).vitals[0];
  }
  if (statusRegistry) Object.assign(result, {
    removedByC: battle.actors.some(row => row.slot === 11) && !followup.actors.some(row => row.slot === 11),
    nextCasterMP: followup.actors.find(row => row.local).vitals[2],
    ...(followup.round === undefined ? {} : { nextCompletedRound: followup.round }),
  });
  if (statusSwap) Object.assign(result, {
    targetHP: 70, localSlot: battle.actors.find(row => row.local).slot,
    nextLocalSlot: followup.actors.find(row => row.local).slot,
    nextCasterMP: followup.actors.find(row => row.local).vitals[2],
    ...(followup.round === undefined ? {} : { nextCompletedRound: followup.round }),
  });
  if (statusRid0 && !statusDeathExit) result.splitName = battle.actors.find(row => row.slot === splitSlot).name;
  if (statusDeathExit) result.automaticDeathExit = true;
  if (statusSelfStop) result.automaticStopExit = true;
  console.log(JSON.stringify({surface,...result,...(battle?{completedRound:battle.round}:{}),casterMP,resumedMovement:true}));
}

if (process.env.MOLI_ORDINARY_HOST === 'web') {
  const require = createRequire(import.meta.url);
  const { chromium } = require(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  async function untilWebView(page, predicate) {
    let lastDeathView;
    for (let i = 0; i < (statusLongResult ? 20000 : statusAssist || statusMissing || longGuardRound ? 1000 : statusBattle ? 650 : 300); i++) {
      const view = await page.evaluate(async () => (await import('/web/game-app.mjs')).inspectGamePage().view);
      if (statusDeathExit) {
        const observation = JSON.stringify({ state: view?.client.state, phase: view?.battle?.phase,
          round: view?.battle?.round, actors: view?.battle?.actors.map(row => [row.slot, ...row.vitals]) });
        if (observation !== lastDeathView) console.log('death-view ' + observation);
        lastDeathView = observation;
      }
      if (predicate(view)) return view;
      if (view?.client.errorCode) assert.fail(view.client.errorCode);
      await delay(20);
    }
    assert.fail('Did not reach the expected game view');
  }
  const untilScene = (page, revision) => untilWebView(page, view => view?.client.state === 'playing' && view.client.sceneRevision === revision);
  function observeBrowserAudio() {
    const NativeAudio = globalThis.AudioContext;
    const contexts = [], starts = [];
    globalThis.originalAudio = { contexts, starts };
    globalThis.AudioContext = class extends NativeAudio {
      constructor() { super(); contexts.push(this); }
      createGain() { this.lastGain = super.createGain(); return this.lastGain; }
      createBufferSource() {
        const source = super.createBufferSource();
        const start = source.start.bind(source), stop = source.stop.bind(source);
        let played;
        source.start = (...args) => {
          const analyser = this.createAnalyser();
          this.lastGain.connect(analyser);
          played = { source, gain: this.lastGain, analyser, stopped: false, initialGain: this.lastGain.gain.value };
          start(...args);
          starts.push(played);
        };
        source.stop = (...args) => { if (played) played.stopped = true; stop(...args); };
        return source;
      }
    };
  }
  async function untilBrowserSong(page, index, sample) {
    await page.waitForFunction(index => {
      const { contexts, starts } = globalThis.originalAudio;
      if (contexts[0]?.state !== 'running' || starts.length !== index + 1) return false;
      const { analyser } = starts[index];
      const pcm = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(pcm);
      return pcm.some(value => Math.abs(value) > 0.05);
    }, index);
    assert.deepEqual(await page.evaluate(index => {
      const { source } = globalThis.originalAudio.starts[index];
      return [source.buffer.length, source.buffer.sampleRate, source.buffer.numberOfChannels,
        source.loop, source.loopStart, source.loopEnd, source.buffer.getChannelData(0)[0]];
    }, index), [22050, 22050, 2, true, 0.1, 0.5, sample]);
  }
  for (const mobile of [false, true]) {
    test(`legacy ordinary startup ${scenario} in ${mobile ? 'mobile' : 'desktop'} Web`, { timeout: statusLongResult ? 400000 : sustainedStream ? 100000 : 45000 }, async () => {
      const temp = await mkdtemp(join(tmpdir(), 'moli-ordinary-entry-'));
      let peer, bridge, browser;
      try {
        const folder = join(temp, 'Game'), startupPath = join(temp, 'startup.json');
        for (const row of [...(resultFiles ?? (battleCity ? battleFiles : assets).files), ...extraAudio]) {
          const path = join(folder, row.path);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, Buffer.from(row.bytesHex, 'hex'));
        }
        await writeFile(startupPath, material());
        peer = await clientOriginalPeer(peerMode, 0, peerOptions);
        bridge = sustainedStream ? await startLocalGameBridge(peer.port) : await createLauncherLoopbackServer({ sourceProfile: 'legacy', gameCode: 2, label: 'Original ordinary movement',
          ...(statusSlotBattle ? { gameStream: true } : statusBattle ? { lifetimeMilliseconds: 45000 } : {}),
          endpoints: [{ address: '127.0.0.1', port: peer.port }] });
        browser = await chromium.launch({ channel: 'chrome', headless: true });
        const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1100, height: 850 }, isMobile: mobile, hasTouch: mobile });
        const unexpected = [];
        await context.route('**/*', route => {
          if (new URL(route.request().url()).origin === bridge.origin) return route.continue();
          unexpected.push(route.request().url()); return route.abort();
        });
        const page = await context.newPage();
        const consoleErrors = [];
        const drawStyleWarnings=[];
        if(battleDrawStyle)page.on('console',event=>{if(event.type()==='error')consoleErrors.push(event.text());if(event.type()==='warning')drawStyleWarnings.push(event.text());});
        else if (resourceArchive) page.on('console', event => { if (['error','warning'].includes(event.type())) consoleErrors.push(event.text()); });
        const sockets = [];
        if (sustainedStream) page.on('websocket', socket => { sockets.push(new URL(socket.url()).pathname); });
        page.on('pageerror', error => unexpected.push(error.message));
        if (sceneMusic || battleAudio) await page.addInitScript(observeBrowserAudio);
        await page.goto(bridge.origin + '/web/game.html');
        if(battleDrawStyle){assert.equal(await page.title(),'Moli · 游戏');assert.equal(new URL(page.url()).origin,bridge.origin);assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);assert.deepEqual(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})),{scrollY:0,overflow:false});await mkdir('/tmp/moli-stage295-qa',{recursive:true});await page.screenshot({path:join('/tmp/moli-stage295-qa',`${battleDrawStyle}-${mobile?'mobile':'desktop'}-initial.png`)});}
        await page.locator('#game-startup').setInputFiles(startupPath);
        if (resourceArchive) {
          await page.locator('#game-folder').setInputFiles(folder);
          await page.locator('#game-archive').setInputFiles(resourceArchivePath);
          assert.equal(await page.locator('#game-folder').evaluate(input=>input.files.length),0);
          await page.locator('#game-folder').setInputFiles(folder);
          assert.equal(await page.locator('#game-archive').evaluate(input=>input.files.length),0);
          await page.locator('#game-archive').setInputFiles(resourceArchivePath);
        }
        else await page.locator('#game-folder').setInputFiles(folder);
        if (resourceArchive) {
          assert.equal(await page.title(), 'Moli · 游戏');
          assert.equal(new URL(page.url()).origin, bridge.origin);
          assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));
          assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(), 0);
          const directory='/tmp/moli-stage289-qa'; await mkdir(directory,{recursive:true});
          await page.screenshot({path:join(directory,`${resourceArchive}-${mutedBattleAudio?'muted':'on'}-${mobile?'mobile':'desktop'}-resources.png`),fullPage:false});
        }
        await page.locator('#game-connect').click();
        if (resourceArchive) {
          const selected=await untilWebView(page,value=>value?.client.state==='choosing');
          assert.equal(selected.files.files,273);assert.equal(selected.files.zip64,true);
          assert.ok(selected.files.archiveBytes>2147483647&&selected.files.physicalBytes<1048576);
        }
        if (musicPhases) await untilBrowserSong(page, 0, phaseSequence[0]);
        await page.getByRole('button', { name: '请求版本升级', exact: true }).click();
        await page.getByRole('button', { name: '返回人物列表', exact: true }).click();
        await page.getByRole('button', { name: '下一外观 OriginalA', exact: true }).click();
        await page.getByRole('button', { name: '进入 OriginalA', exact: true }).click();
        if (musicPhases) {
          await page.waitForFunction(() => {
            const [lobby] = globalThis.originalAudio.starts;
            return lobby.gain.gain.value < lobby.initialGain;
          });
          peer.entryReady();
        }
        await untilScene(page, 1);
        const keepalives = sustainedStream ? await peer.waitKeepalives() : null;
        if (sceneMusic) await untilBrowserSong(page, musicPhases ? 1 : 0, 0.75);
        const canvas = page.locator('#game-canvas');
        await canvas.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => performance.now() > 300);
        async function walk() {
          await canvas.scrollIntoViewIfNeeded();
          const box = await canvas.boundingBox();
          const x = box.x + box.width * 416 / 640, y = box.y + box.height * 168 / 480;
          if (mobile) await page.touchscreen.tap(x, y);
          else await page.mouse.click(x, y);
        }
        if (!battleResult) await walk();
        peer.release();
        if (battleResult) {
          const guard = page.locator(statusDeathExit ? '#game-battle-pet-wait' : '#game-battle-guard');
          const initial = await untilWebView(page, view => view?.battle?.actors.length === battleActors);
          if (statusRegistry || statusDeparture) assert.ok(initial.battle.actors.some(row => row.slot === 11));
          if (departedLookaheadSlot !== undefined) assert.ok(initial.battle.actors.some(row => row.slot === departedLookaheadSlot));
          await guard.click();
          if (statusDeathExit) {
            await untilWebView(page, view => view?.battle?.petCount === 1 && view.battle.ready);
            await guard.click();
          }
          if (statusQueuedUpdate) {
            const casting = await untilWebView(page, view => queueInProgress(view?.battle));
            assert.equal(casting.battle.phase, 6);
            assert.equal(casting.battle.round, 0);
            peer.nextBattleRound();
          }
          const beforeExit = await untilWebView(page, view => resultSettled(view?.battle) && view.battle.round === (statusDeathExit || statusSelfStop ? 0 : 1));
          assert.ok(beforeExit.battle.presentations > 0);
          if(battleDrawStyle){await canvas.scrollIntoViewIfNeeded();const screenshot=join('/tmp/moli-stage295-qa',`${battleDrawStyle}-${mobile?'mobile':'desktop'}-battle.png`);await page.screenshot({path:screenshot});assert.deepEqual(consoleErrors,[]);console.log(JSON.stringify({battleDrawStyleQA:true,style:battleDrawStyle,surface:mobile?'mobile-web':'desktop-web',url:bridge.origin+'/web/game.html',title:'Moli · 游戏',viewport:mobile?[390,844]:[1100,850],notBlank:true,noOverlay:true,consoleErrors:0,warnings:drawStyleWarnings,screenshot,round:beforeExit.battle.round,presentations:beforeExit.battle.presentations,browserAvailability:'Browser plugin not available'}));}
          let followup;
          if (secondRound) {
            if (!statusQueuedUpdate) peer.nextBattleRound();
            await untilWebView(page, view => statusQueuedUpdate ? queuedSettled(view?.battle, 9) && view.battle.ready
              : swapSettled(view?.battle, 0, statusSwap ? 7 : 10));
            await guard.click();
            followup = await untilWebView(page, view => (statusQueuedUpdate ? queuedSettled(view?.battle, 8)
              : swapSettled(view?.battle, 0, statusSwap ? 6 : 8)) && view.battle.round === 2);
          }
          if (statusSelfStop) { assert.equal(await peer.waitNativeExit(), true); console.log(JSON.stringify({nativeStopTCP:true,exitBeforeFinish:true,round:beforeExit.battle.round})); }
          const finished = await peer.finishBattle({ observeKeepalives: statusObservedKeepalives });
          let battleKeepalives = finished.battle_keepalives_verified ?? 0;
          await untilScene(page, 1);
          const movementStart = battleReentry ? (await untilWebView(page, value => typeof value?.canvas?.updates === 'number')).canvas.updates : 0;
          await walk();
          await untilWebView(page, view => view?.client.session.io.writes === battleWrites + battleKeepalives);
          if (battleReentry) await untilWebView(page, value => value?.canvas?.updates >= movementStart + reentryVectors.movement.settleFrames);
          if (battleReentry) {
            peer.nextBattle();
            const fresh = await untilWebView(page, value => reentryReady(value?.battle));
            assert.ok(fresh.battle.generation > beforeExit.battle.generation);
            await guard.click(); await peer.verifySecondGuard();
            const result = await untilWebView(page, value => reentrySettled(value?.battle));
            assert.ok(result.battle.presentations > fresh.battle.presentations);
            const second = await peer.finishSecondBattle(); battleKeepalives += second.battle_keepalives_verified;
            await untilScene(page, 1); await walk();
            await untilWebView(page, value => value?.client.session.io.writes === battleWrites + 4 + battleKeepalives);
            console.log(JSON.stringify({secondBattleTCP:true,surface:mobile?'mobile-web':'desktop-web',
              firstRound:beforeExit.battle.round,roundBefore:fresh.battle.round,roundAfter:result.battle.round,
              generations:[beforeExit.battle.generation,fresh.battle.generation],initial:namedActorVitals(fresh.battle),result:namedActorVitals(result.battle),resumedMovement:true}));
          }
          if (battleAudio) {
            const rows = await page.evaluate(() => globalThis.originalAudio.starts.map(({source}) => {
              const left = source.buffer.getChannelData(0)[0];
              const right = source.buffer.getChannelData(source.buffer.numberOfChannels === 1 ? 0 : 1)[0];
              return { id: Math.round(Math.max(left, right) * 512) - 1, channels: source.buffer.numberOfChannels,
                left, right, rate: source.buffer.sampleRate };
            }));
            console.log(JSON.stringify({battleAudio:true,surface:mobile?'mobile-web':'desktop-web',...verifyPlayedSounds(rows,mutedBattleAudio)}));
          }
          if (resourceArchive) {
            const selected=await untilWebView(page,value=>value?.client.state==='playing');
            assert.ok(selected.files.physicalBytes<33554432);assert.deepEqual(consoleErrors,[]);
            const screenshot=join('/tmp/moli-stage289-qa',`${resourceArchive}-${mutedBattleAudio?'muted':'on'}-${mobile?'mobile':'desktop'}-playing.png`);
            await page.screenshot({path:screenshot,fullPage:false});
            console.log(JSON.stringify({resourceArchive:true,surface:mobile?'mobile-web':'desktop-web',mode:resourceArchive,
              files:selected.files.files,archiveBytes:selected.files.archiveBytes,readBytes:selected.files.physicalBytes,
              title:'Moli · 游戏',notBlank:true,noOverlay:true,consoleErrors:0,screenshot,browserAvailability:'Browser plugin not available',QA:true}));
          }
          await page.locator('#game-disconnect').click();
          if (battleAudio) await page.waitForFunction(() => globalThis.originalAudio.contexts.every(context => context.state === 'closed'));
          assert.deepEqual(unexpected, []);
          await checkPeer(peer, battleKeepalives);
          logBattleResult(mobile ? 'mobile-web' : 'desktop-web', beforeExit.battle, followup?.battle);
          return;
        }
        if (cityReturn) {
          const before = await untilWebView(page, view => view?.client.session.io.writes === 7 &&
            (!battleCity || view.battle?.phase === 4 && view.battle.actors.length === 2 && view.client.canReturnToCity));
          if (battleCity && sceneMusic) await untilBrowserSong(page, 1, phaseSequence[2]);
          const action = page.locator('#game-return-city');
          await action.click();
          await peer.waitReturnRequest();
          assert.equal(await action.isDisabled(), true);
          await walk(); await peer.checkReturnParked();
          if (battleCity) await peer.waitCityBoundary(cityRequests - 1);
          if (cityTransfer) {
            const route = cityRoute === 'battle-transfer' ? 'battle' : 'scene';
            const waiting = await untilWebView(page, view => view?.client.cityReturn?.route === route &&
              view.client.cityReturn.leftFrames === 50);
            assert.equal(waiting.client.state, 'returning-city');
            assert.equal(waiting.client.world.battle.pending, false);
            await delay(140); // Let the five blank frames finish with the new map cell still absent.
            assert.equal(await action.isDisabled(), true);
            peer.supplyCityMap();
          }
          const active = await untilWebView(page, view => view?.client.state === 'playing' &&
            view.client.runtimeRevision > before.client.runtimeRevision && view.canvas?.presentations > 0);
          assert.equal(active.client.session.io.opensCompleted, 1);
          assert.equal(active.client.sceneRevision, cityTransfer ? 2 : 1);
          if (sceneMusic) {
            if (battleCity) await untilBrowserSong(page, 3, 0.75);
            assert.equal(await page.evaluate(battle => {
              const starts = globalThis.originalAudio.starts, cue = starts[battle ? 2 : 1];
              return !cue.source.loop && cue.source.buffer.getChannelData(0)[0] === -0.5 &&
                (battle ? starts[0].stopped && starts[1].stopped && starts[1].gain.gain.value < starts[1].initialGain : !starts[0].stopped) &&
                starts.length === (battle ? 4 : 2);
            }, battleCity), true);
          }
          await walk();
          await untilWebView(page, view => view?.client.session.io.writes === 9 + cityRequests);
          await page.locator('#game-disconnect').click();
          assert.deepEqual(unexpected, []);
          await checkPeer(peer);
          console.log(JSON.stringify({ surface: mobile ? 'mobile-web' : 'desktop-web', route: cityRoute, sameConnection: true,
            resumedMovement: true, mapWaitVerified: cityTransfer, cueStarts: Number(sceneMusic),
            ...(battleCity ? { liveBattleBodies: 2, exitReplies: cityRequests - 1 } : {}) }));
          return;
        }
        if (musicPhases) {
          await untilBrowserSong(page, 2, phaseSequence[2]);
          const battle = await untilWebView(page, view => view?.client.state === 'battle-pending');
          peer.queueMusic();
          const queued = await untilWebView(page, view => view?.client.session.io.packets >= battle.client.session.io.packets + 2);
          assert.equal(queued.client.sceneMusicCode, null);
          assert.equal(await page.evaluate(() => globalThis.originalAudio.starts.length), 3);
          await peer.finishBattle();
          await untilScene(page, 1);
          await untilBrowserSong(page, 3, phaseSequence[3]);
          assert.equal(await page.evaluate(() => {
            const [lobby, map, battle] = globalThis.originalAudio.starts;
            return lobby.stopped && map.stopped && battle.stopped && battle.gain.gain.value < battle.initialGain;
          }), true);
          peer.returnNotice();
        }
        if (manualReturn) {
          await untilWebView(page, view => view?.client.session.io.writes === 7);
          if (battleReturn) {
            await untilWebView(page, view => view?.client.state === 'battle-pending' && view.battle?.presentations > 0);
            if (sceneMusic) await untilBrowserSong(page, 1, phaseSequence[2]);
          }
          await page.locator('#game-return-servers').click();
          assert.equal(await page.locator('#game-return-servers').isDisabled(), true);
        }
        if (serverReturn) {
          const button = page.locator('#game-disconnect');
          await page.getByText(manualReturn ? '正在退场…' : '服务器已结束角色会话。正在退场…', { exact: true }).waitFor();
          assert.equal(await button.isDisabled(), true);
          await peer.checkReturnParked();
          await untilWebView(page, view => view?.returnTransition.state === 'complete');
          const exit = await page.evaluate(async () => {
            const { returnTransition } = (await import('/web/game-app.mjs')).inspectGamePage().view;
            const screen = document.querySelector('#game-canvas');
            const pixels = screen.getContext('2d').getImageData(0, 0, screen.width, screen.height).data;
            return { returnTransition, cleared: pixels.every(byte => byte === 0) };
          });
          assert.deepEqual(exit, { returnTransition: { state: 'complete', frames: 50 }, cleared: true });
          assert.equal(await button.isEnabled(), true);
          if (sceneMusic) {
            await page.waitForFunction(index => globalThis.originalAudio.starts[index]?.stopped, exitMusicIndex);
            assert.deepEqual(await page.evaluate(index => {
              const music = globalThis.originalAudio.starts[index], cue = globalThis.originalAudio.starts[index + 1];
              const extra = globalThis.originalAudio.starts[index + 2];
              return [music.gain.gain.value, cue.source.loop, cue.source.buffer.numberOfChannels,
                cue.source.buffer.getChannelData(0)[0], !!extra, music.initialGain > 0];
            }, exitMusicIndex), [0, false, 1, -0.5, false, true]);
          }
        } else await untilScene(page, 2);
        assert.deepEqual(unexpected, []);
        if (manualReturn) {
          await peer.waitReturnRequest();
          await untilWebView(page, view => view?.client.session.manualReturn === 'waiting' && view.client.state === 'returning-server');
          peer.acknowledgeReturn();
          await untilWebView(page, view => view?.client.state === 'closed' && view.client.session.reason === 'manual-server-return');
          assert.equal(await page.locator('#game-setup').getAttribute('open'), '');
        } else await page.locator('#game-disconnect').click();
        if (sceneMusic) {
          await page.waitForFunction(() => globalThis.originalAudio.contexts.every(context => context.state === 'closed'));
          console.log(JSON.stringify({ surface: mobile ? 'mobile-web' : 'desktop-web', contextRunning: true,
            renderedPcm: true, musicLoop: [0.1, 0.5], cueStarts: 1, musicStoppedAtZero: true, audioClosed: true,
            ...(manualReturn ? { battle: battleReturn, fadeFrames: 50, returnRequests: 1, closedAfterReply: true } : {}),
            ...(musicPhases ? { phaseSequence, deferredSelection: true, nativeBattleExitRequest: true } : {}) }));
        }
        if (serverReturn && !manualReturn) assert.equal(await page.evaluate(async () => (await import('/web/game-app.mjs')).inspectGamePage().view.client.session.reason), 'source-server-return');
        await checkPeer(peer);
        if (sustainedStream) {
          assert.deepEqual(sockets, ['/game-stream']);
          console.log(JSON.stringify({ surface: mobile ? 'mobile-web' : 'desktop-web', sockets, keepalive_intervals_ms: keepalives,
            movementVerified: true, sceneReloaded: true, peerObservedClose: true }));
        }
      } finally { await browser?.close(); await bridge?.close(); await peer?.close(); await rm(temp, { recursive: true, force: true }); }
    });
  }
}

if (process.env.MOLI_ORDINARY_HOST === 'wechat') {
  const { environment, until, cleared, event } = await import('../game-wechat-page-v1/page-test.mjs');
  test(`legacy ordinary startup ${scenario} in WeChat Page`, { timeout: statusLongResult ? 400000 : sustainedStream ? 100000 : 45000 }, async () => {
    const peer = await clientOriginalPeer(peerMode, 1, peerOptions);
    const env = environment(peer, extraAudio, resultFiles ?? undefined, resourceArchivePath);
    const audio = battleAudio ? observeSoundAudio() : sceneMusic ? observeAudio() : null;
    if (audio) env.wx.createWebAudioContext = () => audio.context;
    const page = env.startPage();
    async function untilPageSong(index, sample) {
      await until(page, () => audio.starts.length === index + 1);
      const music = audio.starts[index];
      assert.deepEqual([music.buffer.length, music.buffer.sampleRate, music.buffer.samples.length,
        music.loop, music.loopStart, music.loopEnd, music.buffer.samples[0][0]], [22050, 22050, 2, true, 0.1, 0.5, sample]);
    }
    try {
      await until(page, view => view.canvasReady);
      env.select(new Uint8Array(Buffer.from(material())));
      assert.equal(await page.onStartup(), true);
      assert.equal(await page.onResources(), true, page.data.status);
      if (resourceArchive) { assert.equal(page.data.resourceCount,273); assert.ok(env.reads.filter(r=>r.filePath.endsWith('-zip')).reduce((n,r)=>n+r.length,0)<1048576); }
      const started = page.onConnect();
      if (musicPhases) await untilPageSong(0, phaseSequence[0]);
      await until(page, view => view.state === 'choosing');
      await page.onCharacter(event({ action: 'upgrade' }));
      await until(page, view => view.versionState === 'upgrade-success');
      await page.onCharacter(event({ action: 'version-back' }));
      await until(page, view => view.state === 'choosing' && view.characters[1]?.options.previous);
      await page.onCharacter(event({ action: 'appearance', slot: '1', direction: '3' }));
      const entered = page.onCharacter(event({ action: 'enter', slot: '1' }));
      if (musicPhases) {
        await until(page, () => audio.gains[0].changes.at(-1) < audio.gains[0].changes[0]);
        peer.entryReady();
      }
      await until(page, view => view.state === 'playing' && view.hasFrame && view.canTouch);
      assert.equal(await entered, true);
      await started;
      const keepalives = sustainedStream ? await peer.waitKeepalives() : null;
      if (sceneMusic) await untilPageSong(musicPhases ? 1 : 0, 0.75);
      await delay(300);
      if (!battleResult) {
        env.touch(page, 'start', 260, 105);
        env.touch(page, 'end', 260, 105);
        await until(page, () => env.stats.writes.length === (sustainedStream ? 9 : 7));
      }
      const states = [], before = env.frames.length, update = page.setData;
      page.setData = function observeScene(patch, done) {
        if (patch.state) states.push(patch.state);
        return update.call(this, patch, done);
      };
      peer.release();
      if (battleResult) {
        const firstAction = statusDeathExit ? 'pet-wait' : 'guard';
        await until(page, view => statusDeathExit
          ? view.battle?.secondary && view.battle.ready
          : view.battle?.commands.some(row => row.action === firstAction && row.enabled));
        assert.equal(page.data.battle.actors.length, battleActors);
        if (statusRegistry || statusDeparture) assert.ok(page.data.battle.actors.some(row => row.slot === 11));
        if (departedLookaheadSlot !== undefined) assert.ok(page.data.battle.actors.some(row => row.slot === departedLookaheadSlot));
        assert.equal(page.onBattle(event({action:'command',value:firstAction})), true);
        if (statusDeathExit) {
          await until(page, view => env.stats.writes.length === 6 && view.battle?.secondary && view.battle.ready);
          assert.equal(page.onBattle(event({action:'command',value:firstAction})), true);
        }
        if (statusQueuedUpdate) {
          await until(page, view => queueInProgress(view.battle));
          peer.nextBattleRound();
        }
        const framesBeforeResult = env.frames.length;
        const { battle: beforeExit } = await until(page, view => resultSettled(view.battle) &&
          (!(statusBasicSelf || statusModifier || statusUpper || statusImpact) || view.battle.round === (statusSelfStop ? 0 : 1)) &&
          (statusBattle !== 'grow' || env.frames.length - framesBeforeResult >= 360), statusLongResult ? 50000 : longGuardRound ? 2600 : undefined);
        let followup;
        if (secondRound) {
          if (!statusQueuedUpdate) peer.nextBattleRound();
          await until(page, view => (statusQueuedUpdate ? queuedSettled(view.battle, 9)
            : swapSettled(view.battle, 0, statusSwap ? 7 : 10)) && view.battle.commands.some(row => row.action === 'guard' && row.enabled));
          assert.equal(page.onBattle(event({action:'command',value:'guard'})), true);
          followup = (await until(page, view => statusQueuedUpdate ? queuedSettled(view.battle, 8)
            : swapSettled(view.battle, 0, statusSwap ? 6 : 8))).battle;
        }
        assert.ok(env.frames.slice(before).some(frame => frame.nonzero));
        if (statusSelfStop) { assert.equal(await peer.waitNativeExit(), true); console.log(JSON.stringify({nativeStopTCP:true,exitBeforeFinish:true,round:beforeExit.round})); }
        const finished = await peer.finishBattle({ observeKeepalives: statusObservedKeepalives });
        let battleKeepalives = finished.battle_keepalives_verified ?? 0;
        await until(page, view => view.state === 'playing' && view.canTouch && view.hasFrame);
        assert.equal(env.stats.created, 1);
        const movementStart = env.frames.length;
        env.touch(page, 'start', 260, 105); env.touch(page, 'end', 260, 105);
        await until(page, () => env.stats.writes.length === battleWrites + battleKeepalives);
        if (battleReentry) {
          await until(page, () => env.frames.length >= movementStart + reentryVectors.movement.settleFrames);
          peer.nextBattle();
          const fresh = (await until(page, value => reentryReady(value.battle), 2600)).battle;
          const secondFrames = env.frames.length;
          assert.equal(page.onBattle(event({action:'command',value:'guard'})), true);
          await peer.verifySecondGuard();
          const result = (await until(page, value => reentrySettled(value.battle), 2600)).battle;
          assert.ok(env.frames.slice(secondFrames).some(frame => frame.nonzero));
          const second = await peer.finishSecondBattle(); battleKeepalives += second.battle_keepalives_verified;
          await until(page, value => value.state === 'playing' && value.canTouch && value.hasFrame, 2600);
          assert.equal(env.stats.created, 1);
          env.touch(page, 'start', 260, 105); env.touch(page, 'end', 260, 105);
          await until(page, () => env.stats.writes.length === battleWrites + 4 + battleKeepalives).catch(error => { console.log('second-peer ' + peer.diagnostics()); throw error; });
          console.log(JSON.stringify({secondBattleTCP:true,surface:'wechat-page',firstRound:beforeExit.round,
            roundBefore:fresh.round,roundAfter:result.round,initial:namedActorVitals(fresh),result:namedActorVitals(result),resumedMovement:true}));
        }
        if (battleAudio) {
          const rows = audio.starts.map(node => {
            const [left, right = left] = node.buffer.samples.map(channel => channel[0]);
            return { id: Math.round(Math.max(left,right)*512)-1, channels:node.buffer.samples.length,
              left,right,rate:node.buffer.sampleRate };
          });
          console.log(JSON.stringify({battleAudio:true,surface:'wechat-page',...verifyPlayedSounds(rows,mutedBattleAudio)}));
        }
        if (resourceArchive) {
          const readBytes=env.reads.filter(r=>r.filePath.endsWith('-zip')).reduce((n,r)=>n+r.length,0);
          assert.ok(readBytes<33554432);
          console.log(JSON.stringify({resourceArchive:true,surface:'wechat-page',mode:resourceArchive,files:page.data.resourceCount,
            readBytes,largeOffset:env.reads.some(r=>r.position>2147483647),QA:true}));
          assert.ok(env.reads.some(r=>r.position>2147483647));
        }
        page.onDisconnect();
        if (battleAudio) assert.equal(audio.closed,1);
        cleared(env, page);
        await checkPeer(peer, battleKeepalives);
        logBattleResult('wechat-page', statusSwap || statusAssist || statusMissing || statusDirectSelf || physicalGuard || statusNestedWire ? beforeExit : undefined, followup);
        return;
      }
      if (cityReturn) {
        if (battleCity) {
          await until(page, view => view.state === 'battle-pending' && view.canReturnToCity &&
            view.battle?.actors.length === 2 && view.battle.commands.some(row => row.enabled));
          if (audio) await untilPageSong(1, phaseSequence[2]);
        }
        assert.equal(page.data.canReturnToCity, true);
        const beforeCity = env.frames.length;
        page.onReturnToCity();
        await peer.waitReturnRequest();
        assert.equal(page.data.canTouch, false);
        assert.equal(page.data.connected, true);
        env.touch(page, 'start', 260, 105); env.touch(page, 'end', 260, 105);
        await peer.checkReturnParked();
        if (battleCity) {
          assert.equal(page.data.battle, null);
          await peer.waitCityBoundary(cityRequests - 1);
        }
        if (cityTransfer) {
          const waitFrames = cityRoute === 'battle-transfer' ? 80 : cityRoute === 'battle-late' ? 105 : 55;
          await until(page, () => env.frames.length >= beforeCity + waitFrames);
          assert.equal(page.data.state, 'returning-city');
          assert.ok(env.frames.slice(-5).every(frame => !frame.nonzero));
          peer.supplyCityMap();
        }
        await until(page, view => view.state === 'playing' && view.canTouch && view.hasFrame);
        assert.ok(states.includes('returning-city'));
        assert.equal(env.stats.created, 1);
        if (audio) {
          if (battleCity) await untilPageSong(3, 0.75);
          assert.equal(audio.starts.length, battleCity ? 4 : 2);
          assert.equal(audio.starts[0].stopped, battleCity);
          assert.equal(audio.starts[battleCity ? 2 : 1].buffer.samples[0][0], -0.5);
          if (battleCity) {
            assert.equal(audio.starts[1].stopped, true);
            assert.ok(audio.starts[1].connected.changes.length > 2);
          }
        }
        env.touch(page, 'start', 260, 105); env.touch(page, 'end', 260, 105);
        await until(page, () => env.stats.writes.length === 9 + cityRequests);
        page.onDisconnect();
        cleared(env, page);
        await checkPeer(peer);
        console.log(JSON.stringify({ surface: 'wechat-page', route: cityRoute, sameConnection: true,
          resumedMovement: true, mapWaitVerified: cityTransfer, cueStarts: Number(sceneMusic),
          ...(battleCity ? { liveBattleBodies: 2, exitReplies: cityRequests - 1 } : {}) }));
        return;
      }
      if (serverReturn) {
        if (musicPhases) {
          await untilPageSong(2, phaseSequence[2]);
          assert.equal(page.data.state, 'battle-pending');
          peer.queueMusic();
          await delay(80);
          assert.equal(audio.starts.length, 3);
          await peer.finishBattle();
          await until(page, view => view.state === 'playing' && view.hasFrame && view.canTouch);
          await untilPageSong(3, phaseSequence[3]);
          const [lobby, map, battle] = audio.starts;
          assert.ok(lobby.stopped && map.stopped && battle.stopped && battle.connected.changes.length > 2);
          peer.returnNotice();
        } else if (battleReturn) {
          await until(page, view => view.state === 'battle-pending' && view.battle !== null);
          const battleStart = env.frames.length;
          await until(page, view => view.state === 'battle-pending' && env.frames.length > battleStart && env.frames.at(-1).nonzero);
          if (audio) await untilPageSong(1, phaseSequence[2]);
          if (!manualReturn) peer.returnNotice();
        }
        if (manualReturn) {
          assert.equal(page.data.canReturnToServers, true);
          page.onReturnToServers();
          assert.equal(page.data.canReturnToServers, false);
        }
        await until(page, view => view.state === 'returning-server' && view.connected && !view.canTouch && view.returnTransition?.state === 'running');
        assert.match(page.data.status, /正在退场/);
        page.onDisconnect();
        assert.equal(page.data.connected, true);
        await peer.checkReturnParked();
        await until(page, view => view.returnTransition?.state === 'complete');
        assert.deepEqual(page.data.returnTransition, { state: 'complete', frames: 50 });
        const rendered = env.frames.slice(-50);
        assert.equal(rendered.length, 50);
        assert.ok(rendered[0].nonzero);
        assert.equal(rendered.at(-1).nonzero, false);
        if (audio) {
          await until(page, () => audio.starts[exitMusicIndex]?.stopped);
          const music = audio.starts[exitMusicIndex], cue = audio.starts[exitMusicIndex + 1];
          assert.equal(audio.starts.length, exitMusicIndex + 2);
          assert.deepEqual([audio.resumed, music.connected.changes.at(-1), cue.loop, cue.buffer.samples[0][0]],
            [1, 0, false, -0.5]);
          assert.ok(music.connected.changes.length > 2);
        }
      } else await until(page, view => view.state === 'playing' && view.canTouch && states.includes('preparing-scene') && env.frames.length > before);
      assert.ok(env.frames.some(frame => frame.width === 640 && frame.height === 480 && frame.nonzero));
      if (manualReturn) {
        await peer.waitReturnRequest();
        await until(page, view => view.manualReturn === 'waiting' && view.connected);
        peer.acknowledgeReturn();
        await until(page, view => !view.connected && view.status.startsWith('已返回连接设置'));
      } else page.onDisconnect();
      cleared(env, page);
      if (audio) {
        assert.equal(audio.closed, 1);
        console.log(JSON.stringify({ surface: 'wechat-page', battle: battleReturn || musicPhases, observedPcm: true,
          musicLoop: [0.1, 0.5], cueStarts: 1, musicStoppedAtZero: true, audioClosed: true,
          ...(manualReturn ? { fadeFrames: 50, returnRequests: 1, closedAfterReply: true } : {}),
          ...(musicPhases ? { phaseSequence, deferredSelection: true, nativeBattleExitRequest: true } : {}) }));
      }
      await checkPeer(peer);
      if (sustainedStream) {
        assert.equal(env.stats.created, 1);
        console.log(JSON.stringify({ surface: 'wechat-page', sockets: env.stats.created, keepalive_intervals_ms: keepalives,
          movementVerified: true, sceneReloaded: true, peerObservedClose: true }));
      }
    } finally { page.onUnload(); await peer.close(); }
  });
}

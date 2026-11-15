/** Original public byte snapshots. Prints data; never accesses game files or executes a process. */
import { createLauncherProcessPlan, LAUNCHER_RESOURCE_GROUPS } from '../index.mjs';
const raw = value => new TextEncoder().encode(value);
const plan = createLauncherProcessPlan({ gameCode: 11, onlyRefreshWord: 0, caseProfile: 'ascii',
  directoryBytes: raw('D:\\Original'), executablePathBytes: raw('D:\\Original\\OriginalClient.exe'),
  argsLineBytes: raw('--original'), regionArgsBytes: raw('--region 2'), galaxyArgsBytes: raw(''),
  resourceGroups: LAUNCHER_RESOURCE_GROUPS.map(({ id }, index) => ({ id, state: 'enumerated', entries: index ? [] :
    [{ fileNameBytes: raw('AnimeInfo_1.bin'), attributes: 32 }, { fileNameBytes: raw('Anime_2.bin'), attributes: 32 }] })) });
console.log(JSON.stringify({ command: new TextDecoder().decode(plan.commandLineBytes.subarray(0, -1)),
  cwd: new TextDecoder().decode(plan.workingDirectoryBytes.subarray(0, -1)),
  resourceRows: plan.resourceGroups.reduce((count, group) => count + group.rows.length, 0),
  clientCreationRequested: plan.clientCreationRequested, upstreamReady: plan.upstreamReady,
  authentication: plan.authentication, gameAcceptance: plan.gameAcceptance, execution: plan.execution }, null, 2));

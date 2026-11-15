/** Original public snapshots; metadata only. No process, file, account or network access. */
import { createLauncherLaunchLease, LAUNCHER_RESOURCE_GROUPS } from '../index.mjs';
const raw = value => new TextEncoder().encode(value);
const lease = createLauncherLaunchLease({ processInput: { gameCode: 11, onlyRefreshWord: 0, caseProfile: 'ascii',
  directoryBytes: raw('C:\\Original'), executablePathBytes: raw('C:\\Original\\Original.exe'),
  argsLineBytes: raw('--original'), regionArgsBytes: raw(''), galaxyArgsBytes: raw(''),
  resourceGroups: LAUNCHER_RESOURCE_GROUPS.map(({ id }) => ({ id, state: 'find-failed' })) },
  selection: { profile: { nameBytes: raw('OriginalName'), stateWord: 0, billingWord: 0, expiredWord: 0 },
    opaqueByteField: raw('OriginalOpaque'), tailWordA: 0x80000020 } });
console.log(JSON.stringify({ prepared: lease.snapshot() }, null, 2));
lease.takeContext(); lease.close();
console.log(JSON.stringify({ afterClose: lease.snapshot() }, null, 2));

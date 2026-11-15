/** One owned game-entry context built from the proven process and mapping producers. No execution or I/O. */
import { createLauncherProcessPlan } from './launcher-process.mjs';
import { createLauncherHandoffLease } from './launcher-handoff.mjs';
export class LauncherLaunchError extends Error {
  constructor() { super('The prepared game-entry context is unavailable.'); this.name = 'LauncherLaunchError'; this.code = 'LAUNCH_STATE'; }
}
const own = (value, key) => {
  let property;
  try { property = Object.getOwnPropertyDescriptor(value, key); } catch { throw new LauncherLaunchError(); }
  if (!property || !Object.hasOwn(property, 'value')) throw new LauncherLaunchError();
  return property.value;
};
const fillBytes = Uint8Array.prototype.fill;
function erase(value) {
  try { Reflect.apply(fillBytes, value, [0]); }
  catch { /* A detached/transferred view must not prevent erasing the other owned views. */ }
}
function wipe(plan) {
  if (!plan) return;
  erase(plan.commandLineBytes); erase(plan.workingDirectoryBytes);
  for (const group of plan.resourceGroups) erase(group.patternBytes);
}
/** takeContext lends the owned views once; close wipes those same views. External copies remain caller-owned. */
export function createLauncherLaunchLease(input) {
  let process, handoff;
  try {
    process = createLauncherProcessPlan(own(input, 'processInput'));
    handoff = createLauncherHandoffLease({ gameCode: process.gameCode, selection: own(input, 'selection') });
  } catch (error) { wipe(process); handoff?.close(); throw error; }
  let state = 'ready';
  return Object.freeze({
    snapshot() {
      const mapping = handoff.snapshot();
      return Object.freeze({ state, gameCode: process.gameCode, commandBytes: state === 'closed' ? 0 : process.commandLineBytes.length,
        workingDirectoryBytes: state === 'closed' ? 0 : process.workingDirectoryBytes.length,
        mappingName: mapping.mappingName, mappingWriteBytes: mapping.writeBytes,
        resourceRows: state === 'closed' ? 0 : process.resourceGroups.reduce((sum, group) => sum + group.rows.length, 0),
        clientCreationRequested: process.clientCreationRequested, upstreamReady: 'unverified',
        authentication: 'unverified', gameAcceptance: 'unverified', execution: 'not-performed' });
    },
    takeContext() {
      if (state !== 'ready') throw new LauncherLaunchError();
      const mapping = handoff.snapshot().state === 'ready' ? handoff.takeWrite() : null;
      state = 'taken';
      return Object.freeze({ process, mapping, authentication: 'unverified', gameAcceptance: 'unverified', execution: 'not-performed' });
    },
    close() { if (state === 'closed') return; state = 'closed'; wipe(process); handoff.close(); },
  });
}

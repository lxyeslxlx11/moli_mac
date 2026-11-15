/** Original public exchange vectors only. No socket, account input, external timer or raw material output. */
import { readFileSync } from 'node:fs';
import { createLauncherLoginFlow } from '../index.mjs';

const fixture = JSON.parse(readFileSync(new URL('../../analysis/launcher-v9/original-flow-vectors.json', import.meta.url), 'utf8')).flows[0];
const bytes = hex => Uint8Array.from(hex.match(/../g) ?? [], value => Number.parseInt(value, 16));
const input = fixture.request_fields;
const flow = createLauncherLoginFlow({ endpointCount: 2, firstEndpointOrdinal: 0,
  requestCounter: input.counter, gameCode: input.game_code,
  usernameBytes: bytes(input.username_hex), passwordBytes: bytes(input.password_hex) });
const states = [], writeLengths = [];
const note = step => { states.push(step.snapshot.state); writeLengths.push(...step.writes.map(write => write.bytes.length)); };
note(flow.start(0)); note(flow.openFailed(1, 1)); note(flow.opened(2, 2));
note(flow.receive(bytes(fixture.challenge_hex), 2, 3));
note(flow.answerChallenge(bytes(fixture.fixture_exponent_hex), 2, 4));
const wire = bytes(fixture.peer_wire_hex);
for (let at = 0; at < wire.length; at += 17) {
  const result = flow.receive(wire.subarray(at, at + 17), 2, 5);
  if (result.snapshot.state === 'profiles') note(result);
}
const choices = flow.getChoices(), selected = flow.selectProfile(3);
console.log(JSON.stringify({ scope: 'original offline exchange only', states, writeLengths,
  displayedRows: choices.rows.length, attemptsMade: selected.snapshot.attemptsMade,
  selectedSourceOrdinal: selected.selection.profile.sourceOrdinal, finalState: selected.snapshot.state,
  authentication: selected.selection.authentication }, null, 2));

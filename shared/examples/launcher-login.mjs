/** Original public fixture only. No account input, connection, persistence, credential output or launch action. */
import { readFileSync } from 'node:fs';
import { encodeLauncherLoginRequestFrame, decodeLauncherProfileChoices, selectLauncherProfile } from '../index.mjs';

const fixture = JSON.parse(readFileSync(new URL('../../analysis/launcher-v8/original-login-vectors.json', import.meta.url), 'utf8'));
const bytes = hex => Uint8Array.from(hex.match(/../g) ?? [], value => Number.parseInt(value, 16));
const request = fixture.requests[0];
const frame = encodeLauncherLoginRequestFrame({ requestCounter: request.counter, gameCode: request.game_code,
  usernameBytes: bytes(request.username_hex), passwordBytes: bytes(request.password_hex) });
const choices = decodeLauncherProfileChoices(bytes(fixture.profiles[0].body_hex));
const selected = selectLauncherProfile(choices.reply, 3);
console.log(JSON.stringify({ scope: 'original offline test constants only', requestFrameBytes: frame.length,
  displayedRows: choices.rows.length, rowsPassingObservedSelectionChecks: choices.rows.filter(row => row.selectionGate.passes).length,
  selectedSourceOrdinal: selected.profile.sourceOrdinal, authentication: selected.authentication }, null, 2));

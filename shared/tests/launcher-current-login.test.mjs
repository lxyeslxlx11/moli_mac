import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decodeLauncherReply, createLauncherProfileChoices, selectLauncherProfile,
  encodeLauncherHandoffWrite, createLauncherHandoffLease } from '../index.mjs';

const vectors = JSON.parse(readFileSync(new URL('../../analysis/launcher-current-login-v1/state-vectors.json', import.meta.url), 'utf8'));
const bytes = hex => Uint8Array.from(Buffer.from(hex, 'hex'));
const hex = value => Buffer.from(value).toString('hex');

test('updated launcher raw state words follow the native16-bit gate through reply, selection and handoff', () => {
  assert.equal(vectors.case_count, 48);
  for (const v of vectors.cases) {
    const reply = decodeLauncherReply(bytes(v.reply_body_hex));
    const model = createLauncherProfileChoices(reply), row = model.rows[0];
    assert.equal(row.stateWord, v.state_word, v.name);
    assert.equal(row.state, v.native_signed16_state, v.name);
    assert.equal(row.selectionGate.passes, v.passes, v.name);
    assert.equal(row.selectionGate.blockedReason, v.blocked_reason, v.name);
    assert.equal(model.authentication, 'unverified');
    // W0 has low16=1 and must stay opaque; state is taken from W1.
    assert.equal(model.reply.wordLists[0][0], 0x80000001);
    const direct = { gameCode: 11, selection: { profile: { ...row, selectionGate: { passes: true } },
      opaqueByteField: reply.byteField, tailWordA: reply.tailWordA } };
    if (v.passes) {
      const selection = selectLauncherProfile(reply, 0);
      assert.equal(selection.authentication, 'unverified');
      const write = encodeLauncherHandoffWrite({ gameCode: 11, selection });
      assert.equal(hex(write.bytes), v.expected_handoff_hex, v.name);
      assert.equal(hex(encodeLauncherHandoffWrite(direct).bytes), v.expected_handoff_hex, v.name);
      assert.equal(write.mappingName, 'CGSharedMem');
      assert.equal(write.authentication, 'unverified');
      assert.equal(write.gameAcceptance, 'unverified');
    } else {
      assert.throws(() => selectLauncherProfile(reply, 0), { code: 'PROFILE_RESTRICTED' }, v.name);
      assert.throws(() => encodeLauncherHandoffWrite(direct), { code: 'HANDOFF_PROFILE' }, v.name);
    }
  }
});

test('upper-bit state variants retain the lease cleanup and UInt32 input boundaries', () => {
  const v = vectors.cases.find(row => row.state_word === 0x1234fffc && row.passes);
  const selection = selectLauncherProfile(decodeLauncherReply(bytes(v.reply_body_hex)), 0);
  const lease = createLauncherHandoffLease({ gameCode: 11, selection });
  const write = lease.takeWrite();
  assert.equal(hex(write.bytes), v.expected_handoff_hex);
  lease.close();
  assert.ok(write.bytes.every(value => value === 0));
  assert.equal(selection.profile.stateWord, 0x1234fffc);
  for (const stateWord of [-1, 0x100000000, 1.5, '0', NaN, Infinity]) {
    const invalid = { ...selection, profile: { ...selection.profile, stateWord } };
    assert.throws(() => encodeLauncherHandoffWrite({ gameCode: 11, selection: invalid }), { code: 'HANDOFF_INPUT' });
  }
});

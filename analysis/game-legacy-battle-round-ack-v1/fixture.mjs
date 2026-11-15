/** Independent round/registry assertions over the actual owned entry and input. */
import assert from 'node:assert/strict';
import { fixture, bytes, bodyRows, play, character } from '../game-legacy-battle-character-queue-v1/fixture.mjs';
import { fixture as loopFixture, character as loopCharacter } from '../game-battle-loop-v1/reference-flow.mjs';

const marked = battle => bodyRows(battle).filter(Boolean).filter(row => row.actorFlags & 0x40).map(row => row.slot);

export async function runAckCase(api, kind) {
  if (kind === 'wrap') {
    const f = await loopFixture(api, { initialRound: 0xffffffff });
    const b = f.battle;
    try {
      assert.equal(b.copyState().roundCounter, 0xffffffff);
      assert.equal(b.copyState().firstAck, false);
      b.receive(bytes(loopCharacter), 10);
      assert.deepEqual(b.receive(bytes('A|400|0|'), 10).markedSlots, []);
      while (b.copyEntry().phase !== 2) f.step();
      assert.equal(b.copyState().roundCounter, 0);
      f.step();
      while (b.copyEntry().phase !== 4) f.step();
      assert.deepEqual(marked(b), [10]);
      assert.deepEqual(b.receive(bytes('A|1|FFFFFFFF|'), 10).markedSlots, []);
      assert.deepEqual(b.receive(bytes('A|400|0|'), 9).markedSlots, []);
      assert.deepEqual(b.receive(bytes('A|400|'), 10).markedSlots, [10]);
      assert.deepEqual(b.copyState().acknowledgment, [0x400, 0]);
      return { kind, initialRound: 0xffffffff, round: 0, marked: marked(b), partialAssignments: 1 };
    } finally { f.close(); }
  }
  const f = await fixture(api), b = f.battle;
  try {
    if (kind === 'registered') {
      const second = f.until(() => !!play(b).attachedRID?.registry[5]);
      const rid = play(b).attachedRID, sourceId = rid.handoffs[0].sourceId;
      const secondId = rid.registry[5];
      assert.equal(b.copyState().rows[5], null);
      assert.ok(bodyRows(b)[5]);
      assert.deepEqual(b.receive(bytes('A|20|0|'), 10).markedSlots, [5]);
      const first = f.until(() => play(b).attachedRID.registry[2] !== sourceId);
      const firstId = play(b).attachedRID.registry[2];
      assert.notEqual(firstId, sourceId);
      const old = () => play(b).nodes.find(row => row.id === sourceId);
      const flags = old()?.actorFlags ?? null;
      assert.deepEqual(b.receive(bytes('A|4|1|'), 10).markedSlots, []);
      assert.deepEqual(b.receive(bytes('A|4|0|'), 10).markedSlots, [2]);
      assert.equal(old()?.actorFlags ?? null, flags);
      assert.deepEqual(b.receive(bytes('A|24|0|'), 10).markedSlots, [2, 5]);
      assert.ok(bodyRows(b)[2].actorFlags & 0x40);
      assert.ok(bodyRows(b)[5].actorFlags & 0x40);
      assert.equal(b.copyState().roundCounter, 0);
      return { kind, secondRegistered: second.at, firstRegistered: first.at, sourceId, firstId, secondId,
        CMetadataForB: false, marked: [2, 5], oldSourceFlagsPreserved: true, round: 0 };
    }
    const flying = f.until(() => play(b).nodes.some(row => row.kind === 'casting-projectile' &&
      !row.deleted && row.casting.ownerSlot === 10 && row.casting.tuples[row.casting.tupleRead * 4] === 2));
    const initialMarks = marked(b);
    b.receive(bytes('P|5|10|123|456|7|8|'), 10);
    const partialP = b.receive(bytes('P|5|10|Z|'), 10);
    assert.equal(partialP.assignments, 2);
    assert.deepEqual(b.copyState().parameters, [5, 0x10, 0x123, 0x456, 7, 8]);
    assert.equal(b.copyEntry().localSlot, 0);
    const ackRound = kind === 'future' ? '1' : 'FFFFFFFF';
    assert.deepEqual(b.receive(bytes('A|20|' + ackRound + '|'), 10).markedSlots, []);
    assert.deepEqual(marked(b), initialMarks);
    b.receive(bytes(character('Next', 90, 9, [0, 5, 10])), 10);
    b.receive(bytes('M|CFP|5|1|'), 10);
    const drained = f.until(out => {
      assert.equal(out.characters, null);
      assert.equal(b.copyEntry().localSlot, 0);
      return out.callbacks?.manager.kind === 'battle-round-drained';
    });
    assert.deepEqual([drained.phaseBefore, drained.phaseAfter, b.copyState().roundCounter], [6, 2, 1]);
    const applied = f.step();
    assert.equal(applied.characters.records, 3);
    assert.equal(b.copyEntry().localSlot, 5);
    f.until(() => b.copyEntry().phase === 4);
    const marksAtInput = marked(b);
    assert.deepEqual(marksAtInput, kind === 'future' ? [5] : []);
    assert.deepEqual(b.receive(bytes('A|400|0|'), 10).markedSlots, []);
    assert.deepEqual(b.receive(bytes('A|20|1|'), 10).markedSlots, [5]);
    assert.deepEqual(b.receive(bytes('A|0|1|'), 10).markedSlots, []);
    assert.deepEqual(marked(b), [5]);
    f.guard();
    f.until(out => out.callbacks?.manager.kind === 'battle-round-drained');
    assert.equal(b.copyState().roundCounter, 2);
    assert.deepEqual(bodyRows(b)[5].vitals, [90, 100, 8, 10]);
    b.receive(bytes('P|0|10|'), 10);
    assert.equal(f.step().characters, null);
    assert.equal(b.copyEntry().localSlot, 5);
    return { kind, flying: flying.at, drained: drained.at, consumed: applied.at, priorLocal: 0,
      inputLocal: 5, candidateLocal: 0, marksAtInput, partialPAssignments: 2,
      finalVitals: bodyRows(b)[5].vitals, finalRound: 2 };
  } finally { f.close(); }
}

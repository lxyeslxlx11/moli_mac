#!/usr/bin/env python3
"""Bind manufacturing observations to the fixed PE and separately seeded callback bytes."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
A = ROOT / 'analysis/game-craft-input-v1'
P = ROOT / 'build/analysis/game-craft-input-v1'
DIGEST = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def identity(path):
    h = sha256()
    with path.open('rb') as file:
        for chunk in iter(lambda: file.read(1048576), b''):
            h.update(chunk)
    return dict(path=str(path.relative_to(ROOT)), bytes=path.stat().st_size, sha256=h.hexdigest())


def verify():
    source = ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    original_identity = identity(source)
    assert original_identity['bytes'] == 1569280 and original_identity['sha256'] == DIGEST
    data = source.read_bytes()
    pe = struct.unpack_from('<I', data, 60)[0]
    base = struct.unpack_from('<I', data, pe + 52)[0]
    assert base == 0x400000
    table = pe + 24 + struct.unpack_from('<H', data, pe + 20)[0]
    sections = [struct.unpack_from('<4I', data, table + i * 40 + 8)
                for i in range(struct.unpack_from('<H', data, pe + 6)[0])]

    def offset(address, size):
        return next(at + address - base - va for _, va, length, at in sections
                    if 0 <= address - base - va <= length - size)

    def raw(address, size):
        at = offset(address, size)
        return data[at:at + size]

    def admitted(record):
        assert record['subject']['digest']['sha256'] == DIGEST
        assert record['analysis_profile']['digest'] == PROFILE
        return record

    functions = []
    for path in sorted(P.glob('function-*.json')):
        d = admitted(read(path))
        entry = d['normalized_result']['procedure']['address']
        body = d['normalized_result']['procedure']['body']
        observations = read(P / ('bytes-' + entry[2:] + '.json'))
        assert body['available'] and len(body['ranges']) == len(observations)
        ranges = []
        for bounds, observation in zip(body['ranges'], observations):
            r = admitted(observation)
            start = int(bounds['start'], 16)
            length = int(bounds['end'], 16) - start + 1
            value = r['normalized_result']
            decoded = bytes.fromhex(value['bytes_hex'])
            assert value['complete'] and value['returned_bytes'] == length
            assert decoded == raw(start, length)
            ranges.append(dict(start=hex(start), bytes=length, file_offset=offset(start, length),
                               sha256=sha256(decoded).hexdigest(), evidence_id=r['evidence_id']))
        assert sum(r['bytes'] for r in ranges) == body['total_bytes']
        functions.append(dict(entry=entry, evidence_id=d['evidence_id'], ranges=ranges))
    assert len(functions) == 30
    assert sum(r['bytes'] for f in functions for r in f['ranges']) == 7597

    derived, instructions = [], {}
    for filename in ['derived-callbacks.json', 'derived-window-callbacks.json',
                     'derived-level-init.json', 'derived-level-choice.json']:
        report = read(P / filename)
        assert not report['originalExecution'] and not report['originalBytePatches']
        entries = []
        for entry in report['entries']:
            assert entry['status'] == 'derived-static-export' and entry['decompileCompleted']
            count = 0
            for row in entry['instructions']:
                at = int(row['address'], 16)
                b = bytes.fromhex(row['bytesHex'])
                assert raw(at, len(b)) == b
                instructions[at] = row
                count += len(b)
            assert count == entry['derivedBodyBytes']
            entries.append(dict(entry='0x' + entry['requestedEntry'].lstrip('0'), bytes=count,
                                instruction_count=len(entry['instructions']),
                                existed_in_independent_project_before_seed=entry['functionExistedBeforeSeed'],
                                canonical_REA_function_claimed=False))
        derived.append(dict(artifact=identity(P / filename), entries=entries))
    assert sum(len(r['entries']) for r in derived) == 15
    assert sum(e['bytes'] for r in derived for e in r['entries']) == 14373
    parent = ROOT / 'build/analysis/game-battle-player-skills-v1/derived-callbacks.json'
    prior = read(ROOT / 'analysis/game-battle-player-skills-v1/source-check.json')
    expected = next(r for r in prior['artifacts'] if r['path'] == str(parent.relative_to(ROOT)))
    assert identity(parent) == expected
    for entry in read(parent)['entries']:
        if entry['requestedEntry'] in ['004712a0', '00472610']:
            for row in entry['instructions']:
                b = bytes.fromhex(row['bytesHex'])
                assert raw(int(row['address'], 16), len(b)) == b
    assert instructions[0x476a5c]['text'] == 'MOV ECX,0xf53568'
    assert raw(0x501182, 5).hex() == 'b9e022bf00'
    assert raw(0x501177, 5).hex() == 'b9d022bf00'

    windows = []
    for name in ['craft303-pointer-table', 'craft303-window11-pointer',
                 'craft303-window11-candidate', 'craft303-window11-template',
                 'craft303-result-labels', 'craft303-status-result-labels',
                 'craft303-recipe-format', 'craft303-slot-format',
                 'pose-tag', 'craft-tag', 'timer-tag', 'query-tag']:
        record = admitted(read(P / (name + '.json')))
        v = record['normalized_result']
        b = bytes.fromhex(v['bytes_hex'])
        at = int(v['address'], 16)
        assert v['complete'] and b == raw(at, len(b))
        windows.append(dict(address=hex(at), bytes=len(b), sha256=sha256(b).hexdigest(),
                            evidence_id=record['evidence_id']))
    assert struct.unpack('<I', raw(0x559a24, 4))[0] == 0x52dfc8
    descriptor = struct.unpack('<12I', raw(0x52dfc8, 48))
    assert descriptor[7:] == (29, 0x541b18, 0x476170, 0x4767e0, 0x4760f0)
    assert raw(0x5331ac, 3) == b'%d\0' and raw(0x5633f4, 4) == b'|%d\0'
    for at, value in [(0x567b8c, b':J@\0'), (0x567b90, b'+>L\0'),
                      (0x567c00, b'7ba\0'), (0x567b14, b"'<4\0")]:
        assert raw(at, 4) == value
    closure = read(P / 'rea-closure.json')
    assert not closure['open'] and not closure['cleanup_pending']
    evidence, snapshot = identity(P / 'rea-evidence.json'), identity(P / 'rea.snapshot.json')
    assert evidence['bytes'] == closure['export']['bytes']
    assert snapshot['bytes'] == closure['close']['bytes']
    assert closure['export']['records'] == closure['close']['evidence_records'] == 1287
    facts = [
        '4731a0 admits nonnegative recipe ids and nonzero recipe+0xc availability in matching context;472a10 requires named level and nonzero level+0x8c.',
        '473f90 selects skill/recipe/level;501160 sends tileX,tileY,work pose9 for ordinary manufacturing,10 for skill0xd7,12 for0xd9/0xda and11 for0xdb.',
        '4746a0 initializes five required-material flags;478220 matches first unfilled requirement by exchange id and sufficient count,with zero stack count interpreted as1.',
        '478220 admits one extra category0x19/0x26/0x27 material except skills0xd7/0xd8;normal materials cannot reuse a bag slot.',
        'Material eligibility uses native f53d20,derived from the first description line via4fee90/4e9e20,not the separate f53d1e qualification bits.',
        '4769d0 requires all five requirement flags and current MP at wrapped f53568;cost=trunc(int32(recipe+4 * skill+0x34)/100).',
        '4748e0 draws CRT rand once;duration=int32((rand%6+5+int32(recipe+8*3))*1000),sends7ba(duration/1000),then stores uint32(now+duration).',
        '476170 at uint32(now)>=deadline sends+>L(skill,level,-1,decimalRecipeId|bagSlots);required-associated positions are serialized before extras,each in six-position order.',
        '4f2b30 Lor(status,kind,bytes) dispatches kind1 to4da060 in ordinary ungated state;first8 decimal fields and at most6 lost-name fields are decoded.',
        'Result fields1/3/4/5/6/7/8 are skill experience/level-up/endurance/dexterity/intelligence/injury/graphic;field2 remains unnamed.Failure forces graphic0.',
        '4750a0/474be0 update an existing work window and release assigned material references;the reply does not update item records or current MP.',
        '477540 retries through4746a0;4760f0 releases selections and restores work pose0 when closing the final work window.',
    ]
    result = dict(stage=303, source=original_identity, tool='REA6.7.0/Ghidra12.1.4',
                  analysis_profile=PROFILE, functions=functions, canonical_function_bytes=7597,
                  derived=derived, derived_entry_count=15, derived_bytes=14373,
                  parent_callback_anchors=identity(parent), windows=windows,
                  raw_window_bytes=sum(r['bytes'] for r in windows), facts=facts,
                  snapshot=snapshot, evidence=evidence, closure=identity(P / 'rea-closure.json'),
                  retained_records=1287, ancestor_retained_records=1153, REA_closed=True,
                  limitations=['Separate seeded callback bodies are static derivations,not new canonical REA procedures.',
                               'Normal kind1/non-0xff/context0 manufacturing is the implementation path;repair/combine/other contexts remain required.',
                               'Native unbounded recipe-prefix scans and inventory indices<100 do not prove adjacent reads or expand the current28-slot portable inventory.',
                               'The separate4dac70 display-count helper uses other UI selection globals;no complete native UI alias identity is claimed.',
                               'Global native RNG/window cadence,all original UI animations and actual platform/current/official acceptance remain unverified.'],
                  original_execution=0, VM_actions=0, official_sessions=0, full_goal_complete=False)
    (A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return dict(stage=303, canonical_functions=30, canonical_bytes=7597,
                derived_entries=15, derived_bytes=14373, raw_window_bytes=result['raw_window_bytes'],
                retained_records=1287, REA_closed=True)


if __name__ == '__main__':
    print(json.dumps(verify()))

#!/usr/bin/env python3
"""Bind CFP and ITM to the fixed PE, its dispatchers, and retained REA observations."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'mp-items'
WINDOWS = {
    'dispatch': (0x433650, 96), 'tokens': (0x533e54, 96),
    'cfp_token': (0x53409c, 4), 'item_token': (0x5340b4, 4),
    'cfp': (0x4289bc, 195), 'release': (0x4293f6, 22), 'C_vitals': (0x433e22, 211),
    'item': (0x432616, 1468), 'item0_wait': (0x432e51, 49),
    'action_36': (0x40e7cc, 81), 'timer_completion': (0x41026f, 24),
    'action_69': (0x40ef88, 111), 'tuple_completion': (0x40f4de, 24),
    'action_146': (0x411f0a, 533), 'action_155': (0x41283b, 412),
    'action_200': (0x413e0c, 63),
    **{f'body_table_{n}': (0x419434 + 4*n, 20 if n == 155 else 4)
       for n in (36, 69, 146, 155, 200)},
}
HELPERS = (0x4032f0, 0x4033e0, 0x403450, 0x403470, 0x4034f0, 0x403530, 0x419820,
           0x41b640, 0x41dc00, 0x434670, 0x434a30, 0x434a70, 0x434a90, 0x434b60, 0x4fd5f0)


def main():
    prior = read(A / 'actor-transitions-source-check.json')
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe+52)[0]
    table = pe+24+struct.unpack_from('<H', sample, pe+20)[0]
    count = struct.unpack_from('<H', sample, pe+6)[0]
    sections = [struct.unpack_from('<4I', sample, table+i*40+8) for i in range(count)]

    def original(address, length):
        for _, va, size, offset in sections:
            at = address-base-va
            if 0 <= at <= size-length:
                return sample[offset+at:offset+at+length]
        raise AssertionError((hex(address), length))

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    def call(address, target):
        data = original(address, 5)
        assert data[0] == 0xe8 and address+5+struct.unpack('<i', data[1:])[0] == target, hex(address)

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    closure = read(PRIVATE / 'rea-closure.json')
    assert before <= after.keys()
    assert len(before) == 736 and len(after) == closure['close']['evidence_records'] == 779
    assert not closure['open'] and not closure['cleanup_pending']
    assert closure['close']['bytes'] == snapshot.stat().st_size
    windows = {}
    for name, (address, length) in WINDOWS.items():
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['returned_bytes'] == length))
        value = row['normalized_result']
        data = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and data == original(address, length)
        windows[name] = dict(address=hex(address), bytes=length, sha256=sha(data), evidence_id=row['evidence_id'])
    assert [word(0x433650+4*i) for i in (7, 13)] == [0x432616, 0x4289bc]
    assert [original(word(0x533e54+4*i), 4) for i in (7, 13)] == [b'ITM\0', b'CFP\0']
    assert [word(0x419434+4*i) for i in (36, 69, 146, 155, 200)] == [0x40e7cc, 0x40ef88, 0x411f0a, 0x41283b, 0x413e0c]
    for address, target in [
        (0x4289fb, 0x403470), (0x428a15, 0x4033e0), (0x428a2b, 0x4032f0),
        (0x428a55, 0x419820), (0x428a72, 0x436930), (0x4293f7, 0x436930),
        (0x433e8e, 0x433bd0), (0x433e98, 0x4032f0), (0x433ec4, 0x433bd0),
        (0x432645, 0x434b90), (0x432e54, 0x434b90),
        (0x432b0d, 0x434a90), (0x432bab, 0x434a90), (0x432bbe, 0x434a70),
        (0x40efa6, 0x434a70), (0x40efac, 0x434b60), (0x40f4df, 0x434b60),
        (0x40f4e5, 0x434a30), (0x41210b, 0x41dc00), (0x413e19, 0x4fd5f0),
        (0x413e39, 0x434a30), (0x41027a, 0x434a30),
    ]:
        call(address, target)
    assert original(0x433ea9, 6) == bytes.fromhex('888ebc010000')
    assert original(0x433eb9, 6) == bytes.fromhex('8986b8010000')
    assert original(0x40e7ef, 3) == bytes.fromhex('83f878')
    assert original(0x411f7e, 2) == bytes.fromhex('6a10')

    helpers, dossiers = {}, {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        result = row['normalized_result']
        dossiers[address] = result
        body = result['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            data = original(start, end-start+1)
            spans.append(dict(**span, bytes=len(data), sha256=sha(data)))
        assert sum(r['bytes'] for r in spans) == body['total_bytes']
        helpers[hex(address)] = dict(ranges=spans, evidence_id=row['evidence_id'])
    assert '0x4033e9: SETL AL' in dossiers[0x4033e0]['assembly']
    assert 'iVar1 - param_1' in dossiers[0x403470]['pseudocode']
    assert '0x1ae05' in dossiers[0x41dc00]['pseudocode'] and 'param_3 == 0x10' in dossiers[0x41dc00]['pseudocode']
    assert '0x1024) = 2' in dossiers[0x41b640]['pseudocode']
    assert any('0x2c4], 0xff' in line for line in dossiers[0x4fd5f0]['assembly'])

    ref = read(A / 'source-check.json')['retained_derived_main']['evidence']
    same(ref)
    main_code = next(r['instructions'] for r in read(R / ref['path'])['entries']
                     if r['requestedEntry'] == '004260b0')
    checked, instructions = {}, {}
    for key in ('cfp', 'item'):
        start, length = WINDOWS[key]
        rows = [r for r in main_code if start <= int(r['address'], 16) < start+length]
        assert sum(len(r['bytesHex'])//2 for r in rows) == length
        for row in rows:
            address = int(row['address'], 16)
            data = bytes.fromhex(row['bytesHex'])
            assert data == original(address, len(data))
            instructions[address] = row['text']
        checked[key] = dict(instructions=len(rows), bytes=length)
    queues = {
        'ITM7': [0x4326cd, 0x4326f2, 0x43270b, 0x432720],
        'ITM0_actor': [0x432a62, 0x432a71, 0x432a86, 0x432a9f],
        'ITM0_target': [0x432b18, 0x432b46],
    }
    assert [[int(instructions[a].split()[1], 0) for a in q] for q in queues.values()] == [
        [78, 200, 36, 35], [24, 38, 134, 69], [146, 155],
    ]
    body_cases = R / 'build/analysis/game-battle-physical-family-v1/body-cases-private.json'
    style = next(r for r in read(body_cases) if r['case'] == 155)
    assert sha(style['text'].encode()) == style['sha256'] == '01a7598a8586957cc97187937f817fd68903c89e015e8a9bfd74492743679eb5'
    assert all(term in style['text'] for term in ('iVar21 == 5', 'param_1 + 0x170', 'param_1 + 0x180', 'FUN_00403450'))
    proof = dict(
        schema='moli.37c4-battle-mp-items-source.v1', source=prior['source'], analysis_profile=prior['analysis_profile'],
        tool='REA 6.7.0 / Ghidra 12.1.4', closed=True, snapshot=info(snapshot),
        session_closure=info(PRIVATE / 'rea-closure.json'), retained_records=len(after), new_retained_records=len(after)-len(before),
        raw_windows=windows, helpers=helpers, retained_command_assembly=dict(source=ref, checked=checked),
        retained_numeric_result=dict(source=info(body_cases), case=155, fragment_sha256=style['sha256']),
        facts=dict(
            CFP='4289bc subtracts a signed 32-bit value from C current MP at actor+1b0, floors a negative result at zero and releases immediately.',
            ITM0='432a35 consumes actor, one ignored field and target/amount pairs through FF. Action 69 releases the listed queues after 134.',
            heal='146 uses effect type 16 with tier table entry 3 for level zero. 1ae08 completes before state 155 applies style 5 to HP, capped at max HP.',
            ITM7='43269d sets cue 1b6 and queues 78/200/36/35. 200 plays action 16 once and resets frame cursor/delay. 36 waits 120 passes.',
        ),
        pending=['Native masked integer RNG progression and aliased interruption contexts', 'Native live, current samples and platform parity'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'mp-items-source-check.json').write_text(json.dumps(proof, indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(windows)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()

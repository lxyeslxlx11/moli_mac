#!/usr/bin/env python3
"""Bind ordinary inventory actions and the field correction to the fixed PE."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'ordinary-items'
WINDOWS = (
    (0x4f2731, 184), (0x4f27cf, 36), (0x48d309, 26),
    (0x47cb15, 230), (0x47d290, 285), (0x47cbc0, 55), (0x47d350, 54),
    (0x4034d0, 29), (0x43b420, 32), (0x567af8, 4),
    (0x47c990, 70), (0x47d11d, 48), (0x47b900, 265),
    (0x47b9ee, 34), (0x47b7e0, 35), (0x567b10, 4),
)
HELPERS = (
    0x4034d0, 0x43b420, 0x45f2f0, 0x461370, 0x461660,
    0x47b7e0, 0x47b900, 0x47e040, 0x47e4e0, 0x4f25a0,
    0x4f68b0, 0x4f6c70, 0x501a50,
)


def main():
    prior_path = A / 'item-input-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    section_table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, section_table + i * 40 + 8) for i in range(count)]

    def original(address, size):
        for _, va, raw_size, raw in sections:
            offset = address - base - va
            if 0 <= offset <= raw_size - size:
                return sample[raw + offset:raw + offset + size]
        raise AssertionError((hex(address), size))

    def check(address, data):
        raw = bytes.fromhex(data)
        assert original(address, len(raw)) == raw, hex(address)

    def check_call(address, target):
        opcode, offset = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + offset == target, hex(address)

    def admit(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert not closure['open'] and not closure['cleanup_pending']
    assert len(before) == 841 and before <= after.keys()
    assert len(after) == closure['close']['evidence_records'] == 894
    assert snapshot.stat().st_size == closure['close']['bytes']

    windows = []
    for address, size in WINDOWS:
        row = admit(next(r for r in after.values() if r['operation'] == 'read_bytes'
                         and r['normalized_result']['address'] == hex(address)
                         and r['normalized_result']['requested_bytes'] == size))
        value = row['normalized_result']
        raw = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(raw) == value['returned_bytes'] == size
        assert raw == original(address, size)
        windows.append(dict(address=hex(address), bytes=size, sha256=sha(raw), evidence_id=row['evidence_id']))

    # Index starts at one. Each LEA advances from the row's one-based slot field.
    check(0x4f25bd, 'be01000000')
    fields = (
        (5, 0x4f2731, '8d4e04', 0x4f2738, 0x4f2740, '8983043df500', 0xf53d04),
        (6, 0x4f273d, '8d5605', 0x4f274a, 0x4f274f, '668983183df500', 0xf53d18),
        (7, 0x4f2756, '8d4606', 0x4f275d, 0x4f2765, '6689831a3df500', 0xf53d1a),
        (8, 0x4f2762, '8d4e07', 0x4f2770, 0x4f2778, '6689831c3df500', 0xf53d1c),
        (10, 0x4f278e, '8d4609', 0x4f2795, 0x4f27a0, '6689831e3df500', 0xf53d1e),
        (12, 0x4f27b0, '8d560b', 0x4f27bd, 0x4f27c2, '8983143df500', 0xf53d14),
        (13, 0x4f27c8, '8d460c', 0x4f27cf, 0x4f27e8, '8983103df500', 0xf53d10),
    )
    for index, offset, lea, parse, store, write, cell in fields:
        assert bytes.fromhex(lea)[-1] == index - 1
        assert struct.unpack('<I', bytes.fromhex(write)[-4:])[0] == cell
        check(offset, lea)
        check_call(parse, 0x510e50)
        check(store, write)
    check(0x48d309, '8b8ef46ff50085c9')
    check(0x48d317, '83f907')
    assert 0xf56ff4 - 8 * 0x65c == fields[-2][-1]
    check(0x47cb30, '81b8e46ff500c9670000')
    check(0x47d2c1, '81b8043df500c9670000')
    assert 0xf56fe4 - 8 * 0x65c == fields[0][-1]
    check(0x47cb23, 'f680f86ff50001')
    check(0x47d2b4, 'f680183df50001')
    assert 0xf56ff8 - 8 * 0x65c == fields[1][-1]

    assert original(0x567af8, 4) == b'$fa\0' and original(0x567b10, 4) == b"'#Q\0"
    for address, target in (
        (0x47cbbb, 0x43b420), (0x47d351, 0x43b420),
        (0x47cbd4, 0x4034d0), (0x47cbdf, 0x4034d0), (0x47cbec, 0x4f68b0),
        (0x47d367, 0x4034d0), (0x47d372, 0x4034d0), (0x47d37f, 0x4f68b0),
        (0x47c9c1, 0x47b900), (0x47d12e, 0x47b900),
        (0x47b9e3, 0x47e4e0), (0x47b9fb, 0x47b7e0), (0x47b80b, 0x4f6c70),
    ):
        check_call(address, target)
    for address in (0x47cbb2, 0x47d348):
        check(address, 'f605b636f50080')
    for address in (0x47cbca, 0x47d35c):
        check(address, 'b9e0b99600')
    for address in (0x47cbda, 0x47d36d):
        check(address, 'b9c8b99600')
    check(0x47cbc4, '8d46086a0050')
    check(0x47d356, '85c0755c5055')
    check(0x47b955, '8b3c95103df500')
    check(0x47b987, '0fbf1495cc36f500')
    check(0x47b9c1, '68e0b74700')
    check(0x47b9ee, '6aff')
    check(0x4616be, 'b9e022bf00')
    check(0x4616ce, 'b9d022bf00')
    check(0x4617a4, 'a3ccb99600')
    check(0x4617e5, 'a3e4b99600')

    helpers, pseudocode = {}, {}
    for address in HELPERS:
        row = admit(next(r for r in after.values() if r['operation'] == 'analyze_function'
                         and r['normalized_result']['procedure']['address'] == hex(address)))
        value = row['normalized_result']
        body = value['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            raw = original(start, end - start + 1)
            spans.append(dict(**span, bytes=len(raw), sha256=sha(raw)))
        assert sum(s['bytes'] for s in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)
        pseudocode[address] = value['pseudocode']
    assert all(token in pseudocode[0x47b900] for token in ('DAT_00f53d10', 'DAT_00f536cc', '7 < param_3',
                                                          '7 < param_4', 'FUN_0047b7e0(0xffffffff)'))
    assert all(token in pseudocode[0x43b420] for token in ('0xf9 < DAT_00f5f1a0', 'DAT_00f5f1a0 < 0xfd'))
    assert pseudocode[0x4f68b0].count('FUN_004fca70(') == 4
    assert pseudocode[0x4f6c70].count('FUN_004fca70(') == 3

    proof = dict(
        schema='moli.37c4-ordinary-items-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path),
        closed=True, snapshot=info(snapshot), session_closure=info(closure_path),
        retained_records=len(after), new_retained_records=len(after) - len(before),
        raw_windows=windows, helpers=helpers,
        item_fields=[dict(index=n, index_instruction=hex(a), parse_call=hex(p), store=hex(s), cell=hex(c))
                     for n, a, _, p, s, _, c in fields],
        facts=dict(
            correction='Field 12 writes +648 (f53d14), read at 48d309 with the bag +8 bias and a 0–7 range. Field 5 writes +638 (f53d04), compared to code 0x67c9 in ordinary use. This supersedes the previous field-5 category claim.',
            use='47cb15 and 47d2a6 test presence and field 6 bit 0. The special code 0x67c9 takes another branch. Ordinary direct use checks f536b6 bit 7 and main-state 250–252, then 4f68b0 sends $fa with current logical X, Y, item slot and zero.',
            coordinates='4034d0 reads wrapped logical tiles at 96b9c8/96b9e0. 461370 updates separate target cells. 461660 advances scaled position, then writes logical tiles at arrival.',
            move="47c9c1 and 47d12e call 47b900. 47b7e0 sends '#Q through 4f6c70 for two local slots with source, destination and amount. The whole-move call pushes -1. A positive field 13 quantity and empty destination with both indices >=8 can open the native quantity chooser with its modifier condition.",
        ),
        pending=['Special-target item use, native modal and pointer parity, shop slots and drop',
                 'Battle weapon-removal shortcut, current build and real device acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'ordinary-items-source-check.json').write_text(json.dumps(proof, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()

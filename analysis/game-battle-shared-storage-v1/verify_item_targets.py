#!/usr/bin/env python3
"""Verify the ordinary item target, drop, and battle weapon send paths."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'item-targets'
WINDOWS = (
    (0x47cb3c, 114), (0x47d2cd, 123), (0x47d6f0, 128), (0x47d864, 245),
    (0x47d971, 104), (0x4f7ae0, 100), (0x567b84, 4), (0x47cc36, 53),
    (0x47d210, 25), (0x47d3c0, 62), (0x47f5f0, 30), (0x47f430, 192), (0x567b04, 4),
    (0x48cf50, 131), (0x48cfd3, 224), (0x48aa80, 395), (0x48d0ac, 45),
    (0x48d3af, 45), (0x48bd43, 44), (0x563ee0, 32), (0x534184, 6), (0x567bfc, 4),
)
HELPERS = (
    0x437410, 0x46c780, 0x46c7b0, 0x46c7c0, 0x46cf20, 0x47f5f0,
    0x48b810, 0x4f6ac0, 0x4f7ae0, 0x4f88f0,
)


def main():
    prior_path = A / 'ordinary-items-source-check.json'
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

    def call(address, target):
        opcode, offset = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + offset == target, hex(address)

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = records(R / prior['snapshot']['path'])
    after = records(snapshot)
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == 894 and before.keys() <= after.keys()
    assert len(after) == closure['close']['evidence_records'] == 949
    assert snapshot.stat().st_size == closure['close']['bytes']

    raw = []
    for address, size in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['requested_bytes'] == size))
        value = row['normalized_result']
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['returned_bytes'] == size
        assert content == original(address, size)
        raw.append(dict(address=hex(address), bytes=size, sha256=sha(content), evidence_id=row['evidence_id']))

    checks = {
        0x47cb42: 'c605581ac20001', 0x47cb58: 'c7828c000000f0d64700',
        0x47cb8f: 'a3d0e6c100fe804ce9c500', 0x47d2d3: 'c605581ac20001',
        0x47d2e9: 'c7828c000000f0d64700', 0x47d323: '892dd0e6c100',
        0x47d864: 'b9fe6ff500', 0x47d86f: '6683b9aef9ffff00',
        0x47d87d: '8a8354e9c50084c0', 0x47d88b: '8379f62f',
        0x47d89a: '81e200010000', 0x47d8a9: '8b51f285d2',
        0x47d8b6: '81e200020000', 0x47d8c1: '2500040000',
        0x47d93a: '81c15c0600004381f92eeff500',
        0x47d960: '83e102', 0x47d9b2: '3c01751e',
        0x47d9b6: '8b0dd0e6c100', 0x47d9c1: '8d5508515250',
        0x47cc51: '66833c95ac69f50000', 0x47cc5c: '8d46086a0150',
        0x47d210: 'bf01000000', 0x47d3e7: '66833c95cc36f50000',
        0x47d3f2: '5755', 0x47f5f8: '6830f44700516a02a3cc24c200',
        0x47f464: '83e802', 0x47f46d: 'a1cc24c20085c0', 0x47f47a: 'f605b636f50080',
        0x47f494: '8b4c242051', 0x47f499: 'b9e0b99600', 0x47f4a4: 'b9c8b99600',
        0x48cfb4: 'bd01000000', 0x48cfc0: '83f802', 0x48cfd3: 'f6c340',
        0x48cfe6: '83f802740983f803', 0x48cff6: '66392d8443f500',
        0x48cfff: '393dcc49f500', 0x48d009: '66392de049f500',
        0x48d012: '393d2850f500', 0x48d020: '3bc67c6685f6',
        0x48d038: '68ff000000', 0x48d041: '6884415300',
        0x48d07a: '892d989d5900', 0x48d3c0: '893d989d5900',
        0x48bd51: '391d989d5900', 0x48bd5e: 'c705609d59000200000040a3189d5900',
    }
    for address, expected in checks.items():
        check(address, expected)
    fields = {r['index']: int(r['cell'], 16) for r in prior['item_fields']}
    assert fields[10] + 8 * 0x65c == 0xf56ffe
    assert 0xf56ffe - 0x652 == 0xf536cc + 8 * 0x65c
    assert 0xf56ffe - 0xa == fields[12] + 8 * 0x65c
    assert 0xf56ffe - 0xe == fields[13] + 8 * 0x65c
    assert 0xf56ffe + 20 * 0x65c == 0xf5ef2e
    for index, present, category in ((2, 0xf54384, 0xf549cc), (3, 0xf549e0, 0xf55028)):
        assert present == 0xf536cc + index * 0x65c and category == fields[12] + index * 0x65c
    for address, target in (
        (0x47d926, 0x4eac80), (0x47d9c7, 0x4f7ae0), (0x47cc62, 0x47f5f0),
        (0x47d3f4, 0x47f5f0), (0x47f605, 0x46c7c0), (0x47f487, 0x43b420),
        (0x47f49e, 0x4034d0), (0x47f4a9, 0x4034d0), (0x47f4b6, 0x4f6ac0),
        (0x48ab70, 0x46c6b0), (0x48cfbb, 0x46c780), (0x48cfe1, 0x46c7b0),
        (0x48d01b, 0x437410), (0x48d069, 0x4f88f0), (0x48d0ac, 0x46cf20),
    ):
        call(address, target)
    for address, literal in ((0x567b84, b'6=L\0'), (0x567b04, b'&E1\0'),
                             (0x534184, b'Q|%X|\0'), (0x567bfc, b'$T5\0')):
        assert original(address, len(literal)) == literal

    helpers, pseudocode = {}, {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        value = row['normalized_result']
        body = value['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            content = original(start, end - start + 1)
            spans.append(dict(**span, bytes=len(content), sha256=sha(content)))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)
        pseudocode[address] = value['pseudocode']
    assert 'DAT_005599dc' in pseudocode[0x46c7b0] and 'DAT_005599dc = param_2' in pseudocode[0x46c7c0]
    assert 'DAT_00c224cc = param_2' in pseudocode[0x47f5f0]
    assert 'psVar2 + 0x32e' in pseudocode[0x437410] and '0xf5e8dc' in pseudocode[0x437410]
    assert pseudocode[0x4f7ae0].count('FUN_004fca70(') == 2
    assert pseudocode[0x4f6ac0].count('FUN_004fca70(') == 3
    assert 'DAT_00599d98 == 1' in pseudocode[0x48b810] and 'DAT_00599d60 = 2' in pseudocode[0x48b810]

    proof = dict(
        schema='moli.37c4-item-targets-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path),
        closed=True, snapshot=info(snapshot), session_closure=info(closure_path),
        retained_records=len(after), new_retained_records=len(after) - len(before), raw_windows=raw, helpers=helpers,
        facts=dict(
            target='Code 0x67c9 and ordinary-use bit 0 install 47d6f0 and mark the source slot. Mode 1 checks a present unmarked bag target, category != 47, quantity <= 0, qualification bit 8 clear, and bit 10 present when bit 9 is set. The confirmed branch calls 4f7ae0 with target then source.',
            drop='Ordinary inventory selection sets drag type 2 with the present slot and nonzero drop-enabled value. Event 2 in 47f430 checks that flag, f536b6 bit 7 and the 43b420 main state before sending current logical X, Y and slot through 4f6ac0.',
            weapon='In battle inventory callback 48cf50, drag event 0x40 requires type 2 and origin slot 2 or 3. Both hand rows present with category != 7 are counted. At least that many bag slots must be empty and one weapon must be present. 48d069 sends $T5 containing Q|FF|, sets the same completion latch as ordinary battle equipment, then leaves drag state.',
        ),
        pending=['Native pointer and modal parity, independent outstanding native item locks and the separate mode 2 shop branch',
                 'Ground pickup, other gameplay consumers, current release and platform acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'item-targets-source-check.json').write_text(json.dumps(proof, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(raw)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()

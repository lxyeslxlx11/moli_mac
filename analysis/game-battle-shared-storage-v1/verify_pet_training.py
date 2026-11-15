#!/usr/bin/env python3
"""Check pet skill offers, pet selection and slot confirmation against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'pet-training'
HELPERS = (
    0x48fce0, 0x4afaa0, 0x4afd60, 0x4b0020, 0x4b0200, 0x4b0490,
    0x4b0be0, 0x4b0ed0, 0x4b11e0, 0x4b1710, 0x4b18d0, 0x4b2ea0,
    0x4f0aa0, 0x4f1000, 0x4f1420, 0x4fde20, 0x4ff000, 0x4f8240, 0x510d80, 0x510e50, 0x4855a0,
)


def main():
    prior_path = A / 'npc-services-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def file_offset(address, size):
        for _, va, raw_size, raw in sections:
            offset = address - base - va
            if 0 <= offset <= raw_size - size:
                return raw + offset
        raise AssertionError((hex(address), size))

    def original(address, size):
        at = file_offset(address, size)
        return sample[at:at + size]

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == prior['retained_records'] and before <= after.keys()
    assert len(after) == closure['close']['evidence_records'] and snapshot.stat().st_size == closure['close']['bytes']

    windows = []
    for label, size, evidence_id in read(PRIVATE / 'rea-windows.json'):
        address = int(label, 16)
        row = admitted(after[evidence_id])
        assert row['operation'] == 'read_bytes'
        assert row['normalized_result']['address'] == label
        assert row['normalized_result']['requested_bytes'] == size
        value = row['normalized_result']
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['returned_bytes'] == size
        assert content == original(address, size)
        windows.append(dict(address=hex(address), file_offset=file_offset(address, size), bytes=size,
                            sha256=sha(content), evidence_id=row['evidence_id']))

    helpers = {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        body = row['normalized_result']['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            size = end - start + 1
            spans.append(dict(**span, bytes=size, file_offset=file_offset(start, size), sha256=sha(original(start, size))))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)

    def call(address, target):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    modes = {
        0x18: (0x490040, 0x4afaa0), 0x19: (0x49004f, 0x4b0020), 0x1a: (0x490173, 0x4b0490),
        0x2a: (0x490155, 0x4afd60), 0x2b: (0x490164, 0x4b0200), 0x2c: (0x490173, 0x4b0490),
    }
    cases = original(0x49026c, 45)
    for mode, (target, parser) in modes.items():
        assert word(0x4901f8 + 4 * cases[mode]) == target
        call(target + 1, parser)
    calls = (
        (0x4fb795, 0x4f4410), (0x4afac0, 0x510e50), (0x4afad6, 0x510d80),
        (0x4afbf1, 0x510d80), (0x4afc74, 0x510e50), (0x4afc83, 0x510e50), (0x4afcbe, 0x4e9e20),
        (0x4afd46, 0x46c6b0), (0x4afd16, 0x4b0be0), (0x4affd6, 0x4b0be0),
        (0x4b01eb, 0x4b0ed0), (0x4b0348, 0x510e50), (0x4b0471, 0x4b0ed0),
        (0x4b0515, 0x4e9e20), (0x4b0552, 0x510d80), (0x4b05df, 0x510e50),
        (0x4b05f8, 0x510d80), (0x4b0660, 0x4b11e0), (0x4b13f9, 0x4b18d0),
        (0x4b3120, 0x4f8240), (0x4b2e3f, 0x4f8240), (0x4b32fe, 0x4f8240),
        (0x4b2103, 0x4f8240), (0x4f0fdf, 0x4fde20), (0x4f122b, 0x4fde20),
        (0x4f0fe7, 0x4855a0), (0x4f1233, 0x4855a0),
    )
    for address, target in calls:
        call(address, target)
    anchors = {
        0x4afaca: '6a106a02', 0x4afb24: '81ff0907c200', 0x4afb6b: '81ff4d08c200',
        0x4afbb2: '81ff9109c200', 0x4afbf9: '83f801', 0x4afc23: '83f918',
        0x4afcb3: '6a1c', 0x4afcca: '83fe02', 0x4afcd9: '81fbe44dc400',
        0x4afcfd: 'c6056c7fc00002', 0x4affbd: 'c6056c7fc0000c',
        0x4b0020: 'a17413c100', 0x4b01b6: '81fd4ce3c500', 0x4b01cb: 'c7051862c100ffffffff',
        0x4b01df: 'c6056c7fc00003', 0x4b0350: 'a31862c100', 0x4b0446: '81fb4ce3c500',
        0x4b0465: 'c6056c7fc0000d', 0x4b0490: 'a17413c100',
        0x4b050a: '6a15', 0x4b0535: 'bd04000000', 0x4b0548: '68ff010000',
        0x4b056c: '66c743f80000', 0x4b058e: '83f910', 0x4b05e8: '8943fc',
        0x4b0654: 'c6056c7fc00004', 0x4b1004: '8a0e2aca888f1cb6c300',
        0x4b1210: 'a1987ac000', 0x4b1218: '8b04cd80e2c500', 0x4b18e8: '8b0cc580e2c500',
        0x4b1946: 'c78418d4090000a02e4b00', 0x4b1961: '66837af800',
        0x4b2d2b: '0fbe9401d7b5c300', 0x4b2d47: '6683b878e2c50000',
        0x4b2d51: '8a8895e2c500', 0x4b2d5b: '8b0d1862c100', 0x4b2d65: '398898e2c500',
        0x4b2d8c: '8a889ce2c500', 0x4b2def: '8915987ac000', 0x4b2e1e: '6a00',
        0x4b2f10: '890d9880c000', 0x4b2f6f: '8d54019d', 0x4b2f83: '8a8de447c400',
        0x4b3041: '8b0d2436f500', 0x4b3047: '8b85e047c400', 0x4b304d: '3bc8',
        0x4b307e: 'b8f035ef00', 0x4b308f: '3d2858ef00', 0x4b30c5: '8915643fc400',
        0x4b30ff: '6a00', 0x4b32ba: 'a19880c000', 0x4b32de: '55',
        0x4b20e2: '6a02', 0x4f0fd5: '68b02fd700', 0x4f1221: '68b02fd700',
        0x4fde37: '668b39', 0x4fde3a: '81c1d8060000', 0x4fde44: '668950fe',
    }
    for address, expected in anchors.items():
        raw = bytes.fromhex(expected)
        assert original(address, len(raw)) == raw, (hex(address), original(address, len(raw)).hex())

    assert word(0x559ad0) == 0x52e808
    assert word(0x52e828) == 0x554838
    assert (word(0x554854), word(0x5548b4)) == (0x4b31d0, 0x4b1f60)
    assert (word(0x4b178b), word(0x4b17b9)) == (0x4b2f60, 0x4b2f60)
    assert (word(0x4b21d4), word(0x4b21d8)) == (0x4b20c9, 0x4b20d2)
    cancel_cases = original(0x4b21e0, 14)
    assert [cancel_cases[i] for i in (2, 3, 4, 12, 13)] == [2, 3, 3, 2, 3]
    assert original(0x5331ac, 3) == b'%d\0'
    assert original(0x53459c, 4) == b'???\0'
    assert (0xc44de4 - 0xc447e4) // 0x60 == 16
    assert (0xc5e34c - 0xc5e284) // 0x28 == 5
    assert (0xc5e0b8 - 0xc5dd20) // 0x5c == 10
    for address, label in (
        (0x564ea8, '把要学习的技能放在这一栏。'),
        (0x564eec, '购入金额 %7d金币'), (0x564f20, '使用『空字段』的位置'),
        (0x564f38, '使用『%s』的位置'), (0x564f70, '学习『%s』'),
    ):
        encoded = label.encode('gbk') + b'\0'
        assert original(address, len(encoded)) == encoded
    for index, label in enumerate(('人形系','龙系','不死系','飞行系','昆虫系','植物系','野兽系','特殊系','金属系','邪魔系')):
        encoded = label.encode('gbk') + b'\0'
        assert original(word(0x55a3fc + index*4), len(encoded)) == encoded

    destination = A / 'pet-training-source-check.json'
    receipt = dict(
        source=prior['source'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), windows_index=info(PRIVATE / 'rea-windows.json'),
        analysis_profile=prior['analysis_profile'], tool=prior['tool'], package=closure['package'],
        closed=True, retained_records=len(after), new_retained_records=len(after.keys() - before),
        raw_windows=windows, helpers=helpers, call_checks=len(calls)+len(modes), instruction_checks=len(anchors),
        modes={hex(mode): {'dispatch':hex(target), 'parser':hex(parser)} for mode,(target,parser) in modes.items()},
        VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only', 'Callback entry bodies 0x4b2d00, 0x4b2f60 and 0x4b31d0 verified with raw instruction ranges',
                     'Native field semantics limited to their observed uses', 'No native execution or official server evidence'])
    destination.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: receipt[key] for key in ('retained_records','new_retained_records','call_checks','instruction_checks')},
                     ensure_ascii=False), len(windows), len(helpers))


if __name__ == '__main__':
    main()

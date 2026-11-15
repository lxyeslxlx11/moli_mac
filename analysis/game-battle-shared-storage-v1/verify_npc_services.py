#!/usr/bin/env python3
"""Check NPC entry and ordinary skill windows against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'npc-services'
HELPERS = (
    0x48fce0, 0x4926f0, 0x492b90, 0x492d50, 0x492ea0, 0x4af7d0, 0x4af910,
    0x4b1590, 0x4f0000, 0x4f0290, 0x4f4410, 0x4f8240, 0x4fdea0,
)


def main():
    prior_path = A / 'map-dialog-services-source-check.json'
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
        0x05: (0x48ff73, 0x492b90), 0x10: (0x48ff46, 0x492d50),
        0x11: (0x48ff55, 0x4af7d0), 0x12: (0x48ff64, 0x4af910),
        0x1b: (0x49005e, 0x492ea0),
    }
    cases = original(0x49026c, 45)
    for mode, (target, parser) in modes.items():
        assert word(0x4901f8 + 4 * cases[mode]) == target
        call(target + 1, parser)
    calls = (
        (0x4fb795, 0x4f4410), (0x492767, 0x46c6b0),
        (0x492cc0, 0x4926f0), (0x492dfe, 0x4926f0), (0x492f4e, 0x4926f0),
        (0x492b7c, 0x4f8240), (0x492d36, 0x4f8240), (0x492e8a, 0x4f8240),
        (0x492ba6, 0x510e50), (0x492bbc, 0x510d80), (0x492bda, 0x510d80),
        (0x492bc6, 0x5111a0), (0x492be4, 0x5111a0), (0x492c03, 0x4e9e20),
        (0x492c21, 0x510e50), (0x4af847, 0x4e9e20), (0x4af8a9, 0x4e9e20),
        (0x4af8c2, 0x510e50), (0x4af8d1, 0x510e50), (0x4af8fe, 0x46c6b0),
        (0x4af9c8, 0x510d80), (0x4af9ce, 0x5111a0), (0x4afa15, 0x510e50),
        (0x4afa2b, 0x510e50), (0x4b1b3e, 0x4b08a0), (0x4b0b9f, 0x4b1590),
        (0x4b1f11, 0x4f8240), (0x4b2044, 0x4f8240), (0x4b20b3, 0x4f8240),
        (0x4b2c9c, 0x4f8240), (0x4f04ed, 0x4fdea0), (0x4fdee7, 0x51c1a2),
    )
    for address, target in calls:
        call(address, target)

    anchors = {
        0x492765: '6a34', 0x4927e1: '8b0d7c01c100', 0x492adb: 'ffd0',
        0x492b1b: '83f801', 0x492b20: '0fbe8018bdc500',
        0x492bb0: '6a156a026a7c', 0x492bd0: '68ff0000006a036a7c',
        0x492bf8: '6a14', 0x492c14: '81fe5a07c200', 0x492c2b: 'a801',
        0x492c4b: 'c60518bdc50001', 0x492c57: 'a802', 0x492c74: 'c68118bdc50002',
        0x492c9a: 'c68118bdc50003', 0x492cdb: '83f801',
        0x492e17: '85c0', 0x492f3a: '6a026860bc5500',
        0x4af7f9: '6a156a026a7c', 0x4af819: '68ff0100006a036a7c',
        0x4af83c: '6a15', 0x4af860: '6a506a046a7c', 0x4af87b: '68ff0100006a056a7c',
        0x4af89e: '6a20', 0x4af8b5: '81fe260bc200', 0x4af8cc: 'a3080fc200',
        0x4af8de: 'a310b6c300', 0x4af8f7: 'c6056c7fc00000', 0x4af99e: 'bb05000000',
        0x4af9c2: '6a15516a7c', 0x4afa25: '89873cdfc100', 0x4afa33: '898768e6c100',
        0x4afa53: '83c303', 0x4afa5c: '83fb32', 0x4afa6f: 'c6056c7fc00001',
        0x4b06cf: '0fbe04adbddfea00', 0x4b06e5: '8b0d9436f500', 0x4b07f3: '8b15080fc200',
        0x4b08e8: '803800', 0x4b08fa: '888f3425c200', 0x4b0b78: 'b9c02b4b00',
        0x4b160b: '0fbe84063425c200', 0x4b161f: '833c853cdfc10000',
        0x4b16aa: '8b148d68e6c100', 0x4b1ed3: '682c635300', 0x4b1ef0: '6a00',
        0x4b1ff2: '8a88e0214b00', 0x4b2006: '68704e5600', 0x4b205d: '6a63',
        0x4b2be5: '8a8401ef24c200', 0x4b2bf7: '8b04953cdfc100', 0x4b2c3b: 'f644243402',
        0x4b2c46: '42', 0x4b2c7b: '6a00', 0x4f01b8: 'f7c301000200', 0x4f01cc: 'a39436f500',
        0x4fdeb8: '8a1e33d284db0f95c2', 0x4fdec8: '8b5638', 0x4fdede: '6800df4f00',
    }
    for address, expected in anchors.items():
        raw = bytes.fromhex(expected)
        assert original(address, len(raw)) == raw, (hex(address), original(address, len(raw)).hex())

    assert [word(0x559ad0), word(0x554894), word(0x5548b4)] == [0x52e808, 0x4b1e70, 0x4b1f60]
    assert struct.unpack('<4I', original(0x52e828, 16)) == (0x554838, 0x4b1a70, 0x4b1c00, 0x4af790)
    assert original(0x4b21e0, 2) == b'\x00\x01'
    assert (word(0x4b21cc), word(0x4b21d0)) == (0x4b1fff, 0x4b205d)
    assert original(0x53632c, 2) == b'1\0' and original(0x564e70, 2) == b'2\0'
    assert original(0x534130, 4) == b'%2d\0'
    for address, labels in (
        (0x55bc30, ('买','卖','不用了')),
        (0x55bc48, ('想学习技能','想遗忘技能','不用了')),
        (0x55bc60, ('交易','不用了')),
    ):
        for i, label in enumerate(labels):
            encoded = label.encode('gbk') + b'\0'
            assert original(word(address + 4*i), len(encoded)) == encoded
    assert 0xc224ef + 69 == 0xc22534
    assert len(range(5, 0x32, 3)) == 15

    destination = A / 'npc-services-source-check.json'
    receipt = dict(
        source=prior['source'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), windows_index=info(PRIVATE / 'rea-windows.json'),
        analysis_profile=prior['analysis_profile'], tool=prior['tool'], package=closure['package'],
        closed=True, retained_records=len(after), new_retained_records=len(after.keys() - before),
        raw_windows=windows, helpers=helpers, call_checks=len(calls)+len(modes), instruction_checks=len(anchors),
        modes={hex(mode): {'dispatch':hex(target), 'parser':hex(parser)} for mode,(target,parser) in modes.items()},
        VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only', 'Some callbacks have no provider-recognized function entry and use byte evidence',
                     'No native drawing, runtime behavior, official settlement or physical-device acceptance'])
    destination.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: receipt[key] for key in ('retained_records','new_retained_records','call_checks','instruction_checks')},
                     ensure_ascii=False), len(windows), len(helpers))


if __name__ == '__main__':
    main()

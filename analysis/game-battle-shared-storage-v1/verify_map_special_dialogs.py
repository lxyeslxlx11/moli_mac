#!/usr/bin/env python3
"""Check fixed-PE dialog dispatch, callbacks, and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'map-special-dialogs'
HELPERS = (
    0x445120, 0x456330, 0x46d160, 0x48efb0, 0x48f060, 0x48f080, 0x48f0a0, 0x4908e0, 0x492f60,
    0x4b3640, 0x4b36d0, 0x4b3780, 0x4b4010, 0x4f0000, 0x4f4410, 0x4f8240, 0x500d40, 0x500e90,
    0x501200, 0x5012d0, 0x507690, 0x511060, 0x511180,
)


def main():
    prior_path = A / 'pet-training-source-check.json'
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
        offset = file_offset(address, size)
        return sample[offset:offset + size]

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    before = set(records(R / prior['snapshot']['path']))
    bundle = PRIVATE / 'rea-evidence-bundle.json'
    after = {row['evidence_id']: row for row in read(bundle)['records']}
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert closure['open'] is False and closure['cleanup_pending'] is False and closure['package'] == '6.7.0'
    assert len(before) == prior['retained_records'] and before <= after.keys()
    assert len(after) == closure['export']['records'] and bundle.stat().st_size == closure['export']['bytes']

    windows_path = PRIVATE / 'rea-windows.json'
    windows = []
    for label, size, evidence_id in read(windows_path):
        address = int(label, 16)
        row = admitted(after[evidence_id])
        value = row['normalized_result']
        assert row['operation'] == 'read_bytes' and value['address'] == label
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['requested_bytes'] == value['returned_bytes'] == size
        assert content == original(address, size)
        windows.append(dict(address=label, bytes=size, file_offset=file_offset(address, size),
                            sha256=sha(content), evidence_id=evidence_id))

    helpers = {}
    for address in HELPERS:
        row = admitted(next(row for row in after.values() if row['operation'] == 'analyze_function'
                            and row['normalized_result']['procedure']['address'] == hex(address)))
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

    modes = {
        0x1e: (0x49007c, 0x49007d, 0x492f60), 0x23: (0x48fefc, 0x48ff13, 0x4908e0),
        0x24: (0x490132, 0x490135, 0x4b3780), 0x25: (0x490143, 0x490147, 0x4b4010),
    }
    for mode, (branch, site, parser) in modes.items():
        assert word(0x4901f8 + 4 * original(0x49026c + mode, 1)[0]) == branch
        call(site, parser)
    calls = (
        (0x493037, 0x4926f0), (0x492d36, 0x4f8240), (0x490b17, 0x48f0a0),
        (0x48f15a, 0x48f080), (0x49048e, 0x46d160), (0x4904a7, 0x46d160),
        (0x4904c0, 0x456330), (0x4904dc, 0x456330), (0x490532, 0x511180),
        (0x490573, 0x511180), (0x4905ac, 0x511060), (0x4905e4, 0x4f8240),
        (0x4b387b, 0x500e90), (0x4b3881, 0x5012d0), (0x4b3aae, 0x4b36d0),
        (0x4b3ad4, 0x4b3640), (0x4b3c29, 0x4b3640), (0x4b3c72, 0x4f8240),
        (0x4b3d22, 0x4b3640), (0x4b3df8, 0x4b3640), (0x4b3ec7, 0x4b3640),
        (0x4b4103, 0x48efb0), (0x4b3fca, 0x4f8240),
    )
    for address, target in calls:
        call(address, target)

    anchors = {
        0x492ce0: '40', 0x492d16: '6a00', 0x492fa4: '8b0d78bc5500', 0x492fb7: '8b157cbc5500',
        0x490469: 'f6c301', 0x490966: '8d488a83c0bd', 0x48f367: '8b1558e8c100',
        0x48f399: 'a310bc5500', 0x49059e: '68ff000000', 0x507690: 'c3',
        0x4b386d: 'a0404f9200', 0x4f4a74: 'a2404f9200', 0x4f01b2: 'a3a436f500',
        0x4b388b: '3df8ae0300', 0x4b38a3: '83fe05', 0x4b38b4: '83fe07',
        0x4b3c52: '6a01', 0x4b3cd7: '83fe04', 0x4b3db7: '83fe07', 0x4b3e87: '83fe0a',
        0x4b3faa: '56', 0x4b40fa: '6a626a566a00516a01', 0x4b410e: '68303f4b00',
    }
    for address, expected in anchors.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)
    assert original(0x5681c8, 1) == b'\xff'
    assert original(0x563f34, 6) == b'%s|%s\0'
    assert original(0x56bd40, 8) == b'\x0an,c|z\\y'
    for pointer, address, label in ((0x55bc78, 0x56275c, '给予物品'), (0x55bc7c, 0x562750, '接受物品'),
                                    (0x55bc84, 0x562814, '不用了')):
        encoded = label.encode('cp936') + b'\0'
        assert word(pointer) == address and original(address, len(encoded)) == encoded

    descriptor = word(0x559ad8)
    assert descriptor == 0x52e838
    widgets, initialize, draw, close = struct.unpack('<4I', original(descriptor + 32, 16))
    assert (widgets, initialize, draw, close) == (0x5556e0, 0x4b3840, 0x4b3b20, 0x4b3bb0)
    for widget, callback in ((0, 0x4b3be0), (3, 0x4b3cb0), (5, 0x4b3cb0), (6, 0x4b3d90),
                             (8, 0x4b3d90), (9, 0x4b3e60), (11, 0x4b3e60)):
        assert word(widgets + widget * 32 + 28) == callback
    for widget, label in ((4, b'Face\0'), (7, b'Eyes\0'), (10, b'Mouth\0')):
        assert original(word(word(widgets + widget * 32 + 24) + 4), len(label)) == label

    receipt = dict(source=prior['source'], previous_observation=info(prior_path), previous_snapshot=prior['snapshot'],
        evidence_bundle=info(bundle), session_closure=info(closure_path), windows_index=info(windows_path),
        analysis_profile=prior['analysis_profile'], tool=prior['tool'], package=closure['package'], closed=True,
        retained_records=len(after), new_retained_records=len(after.keys() - before), raw_windows=windows, helpers=helpers,
        call_checks=len(calls) + len(modes), instruction_checks=len(anchors),
        modes={hex(mode): dict(dispatch=hex(branch), call=hex(site), parser=hex(parser))
               for mode, (branch, site, parser) in modes.items()},
        VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only', 'Some callbacks are bounded raw instruction observations without Ghidra function bodies',
                     'Full snapshot save failed validation; canonical REA Evidence bundle exported and verified instead',
                     'Composite appearance renderer and original runtime are unverified'])
    destination = A / 'map-special-dialogs-source-check.json'
    destination.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: receipt[key] for key in ('retained_records', 'new_retained_records', 'call_checks', 'instruction_checks')}),
          len(windows), len(helpers))


if __name__ == '__main__':
    main()

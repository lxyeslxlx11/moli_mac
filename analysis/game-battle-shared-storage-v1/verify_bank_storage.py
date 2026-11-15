#!/usr/bin/env python3
"""Check the fixed PE bank records, transfer branches and window destruction."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'bank-storage'


def main():
    prior_path = A / 'map-special-dialogs-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def offset(address, size):
        for _, va, raw_size, raw in sections:
            position = address - base - va
            if 0 <= position <= raw_size - size:
                return raw + position
        raise AssertionError((hex(address), size))

    def original(address, size):
        position = offset(address, size)
        return sample[position:position + size]

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    def call(site, target):
        opcode, relative = struct.unpack('<Bi', original(site, 5))
        assert opcode == 0xe8 and site + 5 + relative == target, (hex(site), hex(target))

    bundle = PRIVATE / 'rea-evidence-bundle.json'
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    ledger = {row['evidence_id']: row for row in read(bundle)['records']}
    assert closure['open'] is False and closure['cleanup_pending'] is False and closure['package'] == '6.7.0'
    assert len(ledger) == closure['export']['records'] and bundle.stat().st_size == closure['export']['bytes']
    for row in ledger.values():
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']

    index = PRIVATE / 'rea-windows.json'
    windows = []
    for label, size, evidence_id in read(index):
        address = int(label, 16)
        row = ledger[evidence_id]
        value = row['normalized_result']
        assert row['operation'] == 'read_bytes' and value['address'] == label and value['complete']
        material = bytes.fromhex(value['bytes_hex'])
        assert len(material) == value['requested_bytes'] == value['returned_bytes'] == size
        assert material == original(address, size)
        windows.append(dict(address=label, bytes=size, file_offset=offset(address, size),
                            sha256=sha(material), evidence_id=evidence_id))

    helpers = {}
    for row in ledger.values():
        if row['operation'] != 'analyze_function':
            continue
        procedure = row['normalized_result']['procedure']
        body = procedure['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            first, last = int(span['start'], 16), int(span['end'], 16)
            size = last - first + 1
            spans.append(dict(**span, bytes=size, file_offset=offset(first, size), sha256=sha(original(first, size))))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[procedure['address']] = dict(evidence_id=row['evidence_id'], ranges=spans)
    assert {'0x49aad0','0x49dfb0','0x47b900','0x47b7e0','0x47f330','0x4f8240','0x468190','0x467fc0'} <= helpers.keys()

    modes = {0x17: (0x490000, 0x490001), 0x21: (0x4900ba, 0x4900bb), 0x22: (0x4900e5, 0x4900e6)}
    for mode, (branch, site) in modes.items():
        assert word(0x4901f8 + original(0x49026c + mode, 1)[0] * 4) == branch
        call(site, 0x49aad0)
    cases = {'A':0x49b0ac,'G':0x49b08d,'I':0x49ab44,'P':0x49ad1c}
    for key, branch in cases.items():
        assert word(0x49b5b8 + original(0x49b5cc + ord(key) - 65, 1)[0] * 4) == branch
    calls = (
        (0x49001e,0x49dfb0), (0x490105,0x49f080), (0x49a9db,0x468190), (0x49dfe8,0x49a9d0),
        (0x49f0bd,0x49e180), (0x4f4456,0x468f00), (0x468f41,0x467fc0), (0x49aa7a,0x4f8240),
        (0x47b841,0x51b2f7), (0x47b858,0x511180), (0x47b8ea,0x4f8240),
        (0x49c1c4,0x47b900), (0x49c3b8,0x47b900), (0x49c882,0x47b900),
        (0x49d417,0x47f330), (0x49d96b,0x47f330), (0x47f3e3,0x4f8240), (0x49dabd,0x4f8240),
        (0x49dd96,0x51b2f7), (0x49de09,0x51b2f7), (0x49de5c,0x4f8240),
        (0x49ace1,0x4c6b60), (0x49b217,0x4c6b60), (0x49b59a,0x510e50), (0x49b092,0x510e50),
    )
    for site, target in calls:
        call(site, target)
    anchors = {
        0x49b0c7:'bb06000000', 0x49b227:'83c306', 0x49b231:'83fb7e', 0x49b24e:'be90000000',
        0x49b262:'8d4eea', 0x49b579:'83c621', 0x49b582:'81fe35010000', 0x49b592:'681f010000',
        0x49b5a2:'a37ca9c200', 0x49b09a:'a37ca9c200', 0x49aced:'83c007', 0x49b062:'83c022',
        0x49c873:'f604951e3df50060', 0x4f27a0:'6689831e3df500', 0x49c3ad:'83c164',
        0x49d40f:'83c164', 0x47b9ee:'6aff', 0x47f359:'83f964', 0x49dc9f:'be40420f00',
        0x49dcf8:'be40420f00', 0x49dd90:'6884455600', 0x49de03:'687c455600',
        0x49aa3c:'6894455300', 0x468282:'894f38', 0x467fc6:'ff5638', 0x52ea41:'02',
    }
    for address, expected in anchors.items():
        material = bytes.fromhex(expected)
        assert original(address, len(material)) == material, hex(address)
    for address, value in ((0x56367c,b'I|%d|%d|%d'), (0x5637c8,b'P|%d|%d'), (0x56457c,b'D|%d'),
                           (0x564584,b'G|%d'), (0x534594,b'C')):
        assert original(address, len(value) + 1) == value + b'\0'
    for index, pointer, descriptor, destroy in ((0x29,0x559a9c,0x52e688,0x49aa00), (0x26,0x559a90,0x52e6b8,0x49e1b0)):
        assert 0x5599f8 + index * 4 == pointer and word(pointer) == descriptor and word(descriptor + 44) == destroy

    receipt = dict(source=prior['source'], previous_observation=info(prior_path), evidence_bundle=info(bundle),
        session_closure=info(closure_path), windows_index=info(PRIVATE / 'rea-windows.json'), tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], package=closure['package'], closed=True, retained_records=len(ledger),
        raw_windows=windows, helpers=helpers, call_checks=len(calls)+len(modes), instruction_checks=len(anchors),
        modes={hex(mode): dict(dispatch=hex(branch), call=hex(site)) for mode,(branch,site) in modes.items()},
        record_branches={key:hex(value) for key,value in cases.items()}, VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only', 'Unrecognized callback entries checked as file-backed instruction ranges',
                     'Window 0x26 and the numeric password control are separate unported paths',
                     'No original execution or server settlement observations'])
    destination = A / 'bank-storage-source-check.json'
    destination.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(len(ledger), len(windows), len(helpers), receipt['call_checks'], receipt['instruction_checks'])


if __name__ == '__main__':
    main()

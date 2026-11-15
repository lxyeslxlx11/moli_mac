#!/usr/bin/env python3
"""Check the fixed PE family pet permissions, storage, replies and window ownership."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'family-pet'


def main():
    prior_path = A / 'bank-storage-source-check.json'
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
    assert {'0x49aad0','0x49f380','0x49f670','0x49e180','0x49f080','0x47b7e0','0x4f4af0',
            '0x511060','0x511180','0x444b80','0x4f8240'} <= helpers.keys()
    for mode, branch in ((0x20, 0x4900a9), (0x22, 0x4900e5)):
        assert word(0x4901f8 + original(0x49026c + mode, 1)[0] * 4) == branch
    for mode, branch in ((0x20, 0x48fe88), (0x22, 0x48fdf9)):
        assert word(0x4901d0 + original(0x4901e8 + mode - 0x15, 1)[0] * 4) == branch

    calls = (
        (0x4900ac,0x49f380), (0x48fe92,0x49f670), (0x49f3b0,0x510d80), (0x49f3ce,0x5111a0),
        (0x49f40b,0x510d80), (0x49f415,0x5111a0), (0x49f659,0x46c6b0), (0x49fa82,0x49f2f0),
        (0x4f9b29,0x4f4af0), (0x4f4c7f,0x510e50),
        (0x4a0597,0x46cf90), (0x4a0337,0x511180), (0x4a034e,0x51b2f7),
        (0x4a0365,0x511060), (0x4a03a1,0x4f8240), (0x4a0485,0x51b2f7), (0x4a04be,0x4f8240),
        (0x49f980,0x49f290), (0x49f9e5,0x4f8240), (0x4f4456,0x468f00),
        (0x4900e6,0x49aad0), (0x490105,0x49f080), (0x48fdfa,0x49aad0), (0x48fe1d,0x49f080),
        (0x49f0bd,0x49e180), (0x49f063,0x49e180), (0x49e530,0x47b900),
        (0x49e71a,0x47b900), (0x49ec0d,0x47b900), (0x47b897,0x51b2f7),
        (0x47b8ae,0x511180), (0x47b8ea,0x4f8240),
        (0x49e1de,0x4ea170), (0x49e1ef,0x445220),
    )
    for site, target in calls:
        call(site, target)
    anchors = {
        0x48fd15:'837c241820741a',
        0x49f3a6:'68ff0300006a016a7c', 0x49f401:'68ff0300006a026a7c',
        0x49f657:'6a33', 0x49f366:'81fa44010000', 0x49f461:'83fd1e',
        0x4f4c74:'a901010000', 0x4f4c87:'a364b0fb00',
        0x49fb65:'f6c180', 0x4a0699:'f60564b0fb0004', 0x4a06b1:'833c95143df50035',
        0x4a0474:'8b0d64c35500', 0x4a047f:'68cc455600', 0x4a0348:'68b0455600',
        0x49f9ab:'a16023c20085c07439', 0x49f9bf:'6894455300',
        0x49e1b0:'833dd4e4550022', 0x49e686:'6683bfac69f50000',
        0x49e6ed:'f687fe6ff50060', 0x49e700:'83ff26', 0x49e709:'83ff34',
        0x49ebde:'f604951e3df50060', 0x49ebfe:'83f826', 0x49ec03:'83f834',
        0x47b879:'8b15340ec100', 0x47b8b3:'8b0d400ec1008b153c0ec100',
    }
    for address, expected in anchors.items():
        actual = original(address, len(expected) // 2)
        assert actual == bytes.fromhex(expected), (hex(address), actual.hex(), expected)
    for mode, descriptor, destroy in ((0x26,0x52e6b8,0x49e1b0), (0x33,0x52e6e8,0x49f980)):
        assert word(0x5599f8 + mode * 4) == descriptor and word(descriptor + 44) == destroy
    assert tuple(word(0x55c584 + i * 4) for i in range(2)) == (1,16)
    assert word(0x551938 + 21 * 32 + 28) == 0x4a01f0
    assert word(0x551938 + 22 * 32 + 28) == 0x4a0420
    for address, value in ((0x567d48,b'Y&3'), (0x5645cc,b'I|%d'), (0x5645b0,b'N|%s'),
                           (0x56367c,b'I|%d|%d|%d'), (0x534594,b'C')):
        assert original(address,len(value)+1) == value + b'\0'
    assert '饲料箱'.encode('gbk') in original(0x56458c,36)

    receipt = dict(source=prior['source'], previous_observation=info(prior_path), evidence_bundle=info(bundle),
        session_closure=info(closure_path), windows_index=info(index), tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], package=closure['package'], closed=True, retained_records=len(ledger),
        raw_windows=windows, helpers=helpers, call_checks=len(calls), instruction_checks=len(anchors),
        permissions=dict(tag='Y&3', consumer='0x4f4af0', store='0xfbb064', mask='base62',
                         field_selector='0x101', flags='decimal', feed_bit=4, rename_bit=128),
        info_window=dict(mode=0x20, window=0x33, initial='0x49f380', refresh='0x49f670',
                         fields=['title','body'], field_limit=1023, wrap_bytes=30, visible_rows=9,
                         name_bytes=16, feed_category_exception=0x35, feed_body='I|slot', rename_body='N|name',
                         destructor='0x49f980', close_body='C'),
        feed_box=dict(mode=0x22, window=0x26, parser='0x49aad0', slots=20,
                      owned_deposit_disallow_categories=[0x26,0x34], owned_deposit_disallow_mask='0x60',
                      item_body='I|source|destination|quantity', destructor='0x49e1b0', close_body=None),
        VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only', 'Indirect callbacks checked as original instruction ranges',
                     'Exact original visual, drag, proximity and sound behavior remains separate',
                     'No original execution or server settlement observations'])
    (A / 'family-pet-source-check.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(len(ledger), len(windows), len(helpers), len(calls), len(anchors))


if __name__ == '__main__':
    main()

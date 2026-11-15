#!/usr/bin/env python3
"""Check fixed PE family profile, title, membership and editor wire contracts."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'family-management'


def main():
    prior_path = A / 'family-pet-source-check.json'
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
    assert {'0x4f4af0','0x4f4de0','0x4f4ef0','0x4f5150','0x4f5210','0x4f53d0','0x4f5520',
            '0x4a1c10','0x496030','0x4a20d0','0x46d160','0x456330','0x4678a0'} <= helpers.keys()
    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    incoming = {row['consumer']: row for row in catalog['incoming']}
    routes = (
        ('Y&3',0x4f9b29,0x4f4af0,['bytes']), ('Y0[',0x4f9ba5,0x4f4de0,['bytes']),
        ('[qD',0x4f9c21,0x4f4ef0,['bytes']), (']^M',0x4f9cb0,0x4f5150,['int32','bytes']),
        ('ZCY',0x4f9d16,0x4f53d0,['int32']), ('Zi8',0x4f9e1d,0x4f5520,['int32']),
    )
    for tag, site, target, fields in routes:
        row = incoming[hex(target)]
        address = int(row['tag_address'],16)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(address,4) == tag.encode('ascii') + b'\0'
        assert row['tag_file_offset'] == offset(address,4)
        call(site,target)

    calls = (
        (0x49530c,0x46c6b0), (0x4a0db2,0x4a1c10), (0x4a0db7,0x4a1430),
        (0x496025,0x496030), (0x4a1e0c,0x46d160), (0x4a1e21,0x456330),
        (0x4a1e67,0x511180), (0x4a1e7d,0x4f6fd0),
        (0x4a1efc,0x46d160), (0x4a1f11,0x456330), (0x4a1f57,0x511180), (0x4a1f6d,0x4f6fd0),
        (0x4a1fb0,0x4a20d0), (0x4a1fbd,0x46d160), (0x4a1fce,0x456330),
        (0x4a206f,0x511180), (0x4a208b,0x4f7040),
        (0x4f6fdb,0x4fcea0), (0x4f6fef,0x4fca70), (0x4f6ffe,0x4fca20),
        (0x4f7012,0x4fcab0), (0x4f7021,0x4fca20), (0x4f7032,0x4fce00),
        (0x4f704b,0x4fcea0), (0x4f705f,0x4fca70), (0x4f706e,0x4fca20),
        (0x4f7082,0x4fca70), (0x4f7091,0x4fca20), (0x4f70a5,0x4fcab0),
        (0x4f70b4,0x4fca20), (0x4f70c5,0x4fce00),
        (0x4f51a1,0x4f5210), (0x4f51a9,0x4f51f0), (0x4f4f99,0x511000),
    )
    for site,target in calls:
        call(site,target)
    assert original(0x4f552d,5) == b'\xe9' + struct.pack('<i',0x516c40-0x4f5532)
    anchors = {
        0x495303:'6a30', 0x4a1e7a:'6a02', 0x4a1f6a:'6a03', 0x4a2087:'50515352',
        0x4a20a4:'83c5304381fd00060000', 0x4a2128:'a880',
        0x4a0eeb:'8d48ee', 0x4a0f0a:'b905000000', 0x4a0fd0:'33ca',
        0x4f4e3b:'83fbff', 0x4f4e43:'c1e004', 0x4f4f67:'83f8ff',
        0x4f5176:'83c17c4281f9b017fc00', 0x4f5189:'8338ff',
        0x4931cf:'8b0cb5c4b6fb00', 0x4931dc:'8a99c4b0fb00',
        0x4f6fd5:'682c7b5600', 0x4f7045:'68307b5600', 0x4678a0:'b801000000c3',
    }
    for address, expected in anchors.items():
        actual = original(address,len(expected)//2)
        assert actual == bytes.fromhex(expected), (hex(address), actual.hex(), expected)
    for mode,descriptor,init in ((0x30,0x52e718,0x4a0d90),(0x15,0x52e508,0x493080)):
        assert word(0x5599f8+mode*4)==descriptor
        assert word(descriptor+36)==init and word(descriptor+44)==0x4678a0
    assert word(0x551e68+64*32+28)==word(0x551e68+65*32+28)==word(0x551e68+72*32+28)==0x4a0ff0
    for i in range(9):
        size=24 if i<2 else 16
        assert struct.unpack('<II',original(0x55c598+i*0x22c+0x21c,8))==(1,size)
    assert original(0x567b2c,8)==b'7nu\0' + b'80i\0'
    assert (0xfbb6c4-0xfbb0c4)//48==32 and (0xfc17b0-0xfbb6d0)//124==200

    receipt = dict(source=prior['source'], previous_observation=info(prior_path), evidence_bundle=info(bundle),
        session_closure=info(closure_path), windows_index=info(index), tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], package=closure['package'], closed=True, retained_records=len(ledger),
        raw_windows=windows, helpers=helpers, call_checks=len(calls)+len(routes), instruction_checks=len(anchors),
        incoming={tag:dict(consumer=hex(target),fields=fields,call=hex(site)) for tag,site,target,fields in routes},
        profile=dict(window='0x30',descriptor='0x52e718',open_call='0x49530c',consumer='0x4f4af0',
                     mask_encoding='base62',name_mask=4,hall_mask=8,own_role_mask=16,role_admin_bit=128,
                     family_name_input_bytes=24,hall_input_bytes=24),
        roles=dict(consumer='0x4f4de0',capacity=32,stride=48,fields=['slot','flags','title'],
                   incoming_title_bytes=40,editor_bytes=16,permission_bits=[1,2,4,8,16],admin_bit=128),
        roster=dict(window='0x15',capacity=200,stride=124,snapshot='0x4f4ef0',upsert='0x4f5150',
                    remove='0x4f53d0',reset='0x4f5520',member_fields=8,name_bytes=16,title_slot_field=8),
        outgoing={'7nu':dict(producer='0x4f6fd0',fields=['int32','bytes'],name_action=2,hall_action=3),
                  '80i':dict(producer='0x4f7040',fields=['int32','int32','bytes'],meaning=['title slot','permission mask','title'])},
        VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE only','Unrecognized UI callbacks and senders checked by file-backed instruction ranges',
                     'Member applications, dismissal, title assignment and other family panes remain separate',
                     'No original execution or server settlement observations'])
    (A/'family-management-source-check.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(len(ledger),len(windows),len(helpers),receipt['call_checks'],len(anchors))


if __name__=='__main__':
    main()

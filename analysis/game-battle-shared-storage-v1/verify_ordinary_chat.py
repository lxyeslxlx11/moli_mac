#!/usr/bin/env python3
"""Check fixed PE family ordinary chat input, settings, receive and wire contracts."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'ordinary-chat'


def main():
    prior_path = A / 'family-members-source-check.json'
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
    assert {'0x444930','0x452350','0x4f2c80','0x4f2df0','0x4f30d0','0x444f20','0x43cfd0',
            '0x4ffc90','0x4f7680','0x4f7780','0x4f22e0','0x469a10','0x469d20','0x511180',
            '0x511060','0x5111a0','0x511000','0x499390','0x46cf90','0x443ab0'} <= helpers.keys()
    calls = (
        (0x4523cb,0x444930),(0x444a1e,0x4f2c80),(0x4993fb,0x46cf90),
        (0x4f2ce1,0x444f20),(0x4f2d56,0x511180),(0x4f2d6d,0x51b2f7),
        (0x4f2d90,0x4034d0),(0x4f2d9b,0x4034d0),(0x4f2da8,0x4f7680),
        (0x4f768b,0x4fcea0),(0x4f769f,0x4fca70),(0x4f76c2,0x4fca70),(0x4f76e5,0x4fcab0),
        (0x4f7708,0x4fca70),(0x4f772b,0x4fca70),(0x4f774e,0x4fca70),(0x4f776e,0x4fce00),
        (0x469d32,0x4f7780),(0x4f778b,0x4fcea0),(0x4f779f,0x4fca70),(0x4f77bf,0x4fce00),
        (0x4fad62,0x4f22e0),(0x4fa4ca,0x4f2df0),(0x4fa546,0x4f30d0),
        (0x4f2e1d,0x510d80),(0x4f2e40,0x510d80),(0x4f2e4d,0x5111a0),(0x4f301d,0x444f20),
        (0x4f307f,0x4ffc90),(0x4f30af,0x43cfd0),(0x4f3195,0x51bb40),(0x4f31af,0x444f20),
        (0x4f31fb,0x445530),(0x4fa39c,0x4f5c30),(0x4f5c69,0x4902a0),
    )
    for site,target in calls:
        call(site,target)
    anchors = {
        0x4f2c8e:'83fe047505be05000000',0x4f2ca1:'66833d70f1f500007409f605bc36f500087561',
        0x4f2cd1:'3de8030000736c',0x4f2d06:'c605a0d7d50001',0x4f2d21:'3d20bf02007609',
        0x4f2d72:'8b155c737200a14c465300',0x4f2d8b:'b9e0b99600',0x4f2d96:'b9c8b99600',
        0x4f2e29:'3c50',0x4f2e36:'68e7070000',0x4f2ffb:'8bb4246810000085f67d0933f6bf01000000eb07',
        0x444f26:'83fd0c0f8d0b',0x444f33:'83fb0e0f8dfe00',0x44500f:'81fa00020000',
        0x4f22ed:'25fdff000066a3bc36f500',0x469a10:'8a0dbc36f500b80800000084c8',
        0x499392:'c7054c46530001000000',0x499973:'83f804',0x499989:'83f809',
        0x499860:'83f802',0x4e39f5:'83f805',0x4e3a45:'83f801',
    }
    for address,expected in anchors.items():
        assert original(address,len(expected)//2)==bytes.fromhex(expected),hex(address)
    assert word(0x55bec8)==0x60fda8
    assert struct.unpack('<II',original(0x55bec8+0x21c,8))==(1,76)
    assert original(0x5678f8,5)==b'P|%s\x00'
    assert original(0x56bd40,8)==bytes.fromhex('0a6e2c637c7a5c79')
    assert original(0x567b60,8)==b')bX\x00*(2\x00'
    assert original(0x567cc8,4)==b'K0c\x00'
    assert original(0x567d08,8)==b'DMK\x00Cz>\x00'
    assert original(0x567928,7)==b'[\xb9\xab\xb8\xe6]\x00'
    assert original(0x567930,11)==b'[\xcd\xe6\xbc\xd2\xb9\xab\xb8\xe6]\x00'
    assert (0x60b190-0x5e4990)//0x134==512 and 0x5e4ab4-0x5e4990==292
    catalog = read(A.parent/'game-legacy-message-v1/dispatch-catalog.json')
    routes = {'0x4f22e0':('K0c',['int32']),'0x4f2df0':('Cz>',['int32','bytes','int32','int32']),
              '0x4f30d0':('DMK',['bytes']),'0x4f7680':(')bX',['int32','int32','bytes','int32','int32','int32']),
              '0x4f7780':('*(2',['int32'])}
    for r in catalog['incoming']+catalog['outgoing']:
        key=r.get('consumer') or r.get('producer')
        if key in routes:
            assert (r['tag'],r['fields'])==routes[key]

    receipt=dict(source=prior['source'],previous_observation=info(prior_path),evidence_bundle=info(bundle),
        session_closure=info(closure_path),windows_index=info(index),tool=prior['tool'],
        analysis_profile=prior['analysis_profile'],package=closure['package'],closed=True,retained_records=len(ledger),
        raw_windows=windows,helpers=helpers,call_checks=len(calls),instruction_checks=len(anchors),
        send=dict(producer='0x4f7680',tag=')bX',input_bytes=76,body_prefix='P|',arguments=['local X','local Y',
            'prefixed inner-escaped text','color','range','font size'],color=[0,1,2,3,5,6,7,8,9],
            range=[1,5],size=[0,2],ordinary_interval_ms=1000,muted_until_elapsed_gt=180000),
        party_setting=dict(incoming='K0c',producer='0x4f7780',outgoing='*(2',receive_mask=65533,party_bit=8,
                           source_party_mode='0xf5f170'),
        receive=dict(player='Cz>',system='DMK',native_log_capacity=512,native_record_stride=308,text_storage_bytes=292,
                     native_player_prefix='P',native_bubble_calls=['0x4f307f','0x4f30af'],
                     system_excludes=['[公告]','prefix [玩家公告]']),
        invite_followup=dict(candidate='_&`',callee='0x4902a0',modes=[38,39,40],
                             result='The examined modes consume record tables. No invite-response binding was proved.'),
        VM_actions=0,original_execution=0,official_sessions=0,
        limitations=['Fixed PE only','Ordinary and party text submission and log projection',
                     'Native overhead bubbles, blacklist, marquee timing, sound and real server delivery remain unverified'])
    (A/'ordinary-chat-source-check.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(len(ledger),len(windows),len(helpers),receipt['call_checks'],receipt['instruction_checks'])


if __name__=='__main__':
    main()

#!/usr/bin/env python3
"""Check fixed PE family member actions and invite wire contracts."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'family-members'


def main():
    prior_path = A / 'family-management-source-check.json'
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
    assert {'0x4930f0','0x4b4170','0x4673e0','0x43f100','0x4034d0','0x496030',
            '0x496060','0x4f7140','0x4f4ef0','0x4f5150','0x4f53d0','0x4f5210'} <= helpers.keys()
    calls = (
        (0x493171,0x496020), (0x4931a5,0x496020), (0x496025,0x496030),
        (0x493a9d,0x496030), (0x493ab5,0x496060),
        (0x494caa,0x495f90), (0x495fc4,0x4feda0), (0x49600e,0x468190),
        (0x495a51,0x495b50), (0x495bf9,0x46c6b0), (0x495d4a,0x4f71b0), (0x496ab7,0x4f70d0),
        (0x466d60,0x4673e0), (0x4b46c8,0x4673e0), (0x4b5192,0x4673e0),
        (0x467418,0x43f100), (0x46744c,0x403330), (0x46748a,0x4034d0),
        (0x467495,0x4034d0), (0x4674a2,0x4f7140),
        (0x467173,0x4f77d0), (0x46738b,0x4f7d30),
        (0x4f70db,0x4fcea0), (0x4f70ef,0x4fca70), (0x4f7112,0x4fca70), (0x4f7132,0x4fce00),
        (0x4f714b,0x4fcea0), (0x4f715f,0x4fca70), (0x4f7182,0x4fca70), (0x4f71a2,0x4fce00),
        (0x4f71bb,0x4fcea0), (0x4f71cf,0x4fca70), (0x4f71ef,0x4fce00),
        (0x4f9c21,0x4f4ef0), (0x4f9cb0,0x4f5150), (0x4f9d16,0x4f53d0), (0x4f9e1d,0x4f5520),
        (0x516853,0x4f70d0), (0x516898,0x4f70d0), (0x513542,0x4f71b0),
    )
    for site,target in calls:
        call(site,target)
    anchors = {
        0x4931e8:'f6c3808b49', 0x493a89:'6a02', 0x493aaf:'6880000000', 0x493adc:'a168b0fb003bc87512',
        0x495bb6:'c705d41bc200305d4900', 0x495d41:'8b148dd0b6fb005250', 0x495fed:'8b0c95d0b6fb00',
        0x496001:'8b0495c4b6fb0048a3', 0x496ab3:'42525051', 0x496926:'8d4411eda3ecb5c300',
        0x496b4f:'83f815', 0x496c25:'81c7f8b0fb00', 0x4673fe:'6a08', 0x467429:'66833df857920000',
        0x467437:'66833d4e8a970000', 0x467464:'f680c4b0fb0001', 0x46747b:'81c1f4010000',
        0x467485:'b9e0b99600', 0x467490:'b9c8b99600', 0x514449:'6a60a32018fc00',
        0x467144:'8b0d8448610081c1f4010000', 0x467375:'8b158448610081c2f4010000',
        0x516844:'a12018fc008b0d248ecd00', 0x516891:'a12018fc005051e8',
        0x4f70d5:'68347b5600', 0x4f7145:'68387b5600', 0x4f71b5:'683c7b5600',
    }
    for address, expected in anchors.items():
        assert original(address,len(expected)//2) == bytes.fromhex(expected),hex(address)

    for mode,desc,controls in ((0x15,0x52e508,0x54d108),(0x37,0x52e538,0x54f830)):
        assert word(0x5599f8+mode*4)==desc and word(desc+32)==controls
    assert all(word(0x54d108+slot*32+28)==0x494c00 for slot in range(21,27))
    assert word(0x54d108+29*32+28)==0x4959b0 and word(0x54f9cc)==0x496a30 and word(0x54faac)==0x4968e0
    assert original(0x567b34,12)==b'8MV\x008^J\x008u6\x00'
    assert struct.unpack('<16h',original(0x53d4d4,32))==(0,-1,1,-1,1,0,1,1,0,1,-1,1,-1,0,-1,-1)
    for address, size, phrase in ((0x562ed4,28,'邀请对方加入自己的家族'),(0x564268,96,'从家族会员名单中删除'),
                                  (0x5640f8,28,'变更此家族成员的称号'),(0x564378,24,'设定已选择的称号')):
        assert phrase.encode('gbk') in original(address,size).split(b'\0',1)[0],hex(address)
    catalog = read(A.parent/'game-legacy-message-v1/dispatch-catalog.json')
    assert next(r for r in catalog['outgoing'] if r.get('producer')=='0x4f7140')['tag']=='8^J'

    receipt = dict(source=prior['source'], previous_observation=info(prior_path), evidence_bundle=info(bundle),
        session_closure=info(closure_path), windows_index=info(index), tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], package=closure['package'], closed=True, retained_records=len(ledger),
        raw_windows=windows, helpers=helpers, call_checks=len(calls), instruction_checks=len(anchors),
        invite=dict(callback='0x4673e0',call='0x4674a2',producer='0x4f7140',tag='8^J',
                    arguments=['local tile X','local tile Y'],permission=1,neighbor_type_mask=8,strict_cooldown_ms=500,
                    shared_shortcut_tick='0x614884',other_checks=['0x467144','0x467375']),
        remove=dict(control='0x4959b0',confirmation='0x495b50',confirmed_call='0x495d4a',producer='0x4f71b0',
                    tag='8u6',arguments=['member ID'],permission=2,target_protection=128,self_branch='0x493ad6'),
        assign_role=dict(control='0x494c00',select_member='0x495f90',title_window='0x37',confirmed_call='0x496ab7',
                         producer='0x4f70d0',tag='8MV',arguments=['member ID','role slot'],slots=[1,31],
                         own_permission=128,target_protection=128),
        roster_inputs=['[qD',']^M','ZCY','Zi8'], VM_actions=0, original_execution=0, official_sessions=0,
        limitations=['Fixed PE and established ordinary roster controls only',
                     'The 0x516844 branch reads an existing roster index and may clear or set its title. No admission evidence.',
                     'No invitation response or explicit rejection route verified; no original execution or real settlement'])
    (A/'family-members-source-check.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(len(ledger),len(windows),len(helpers),receipt['call_checks'],receipt['instruction_checks'])


if __name__=='__main__':
    main()

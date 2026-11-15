#!/usr/bin/env python3
"""Check appraisal, repair and item text against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'shop-service'
WINDOWS = (
    (0x48ffbf, 35), (0x4a9c80, 1057), (0x4aa0b0, 1057), (0x4a9e02, 333), (0x4aa232, 333),
    (0x4a9fbe, 110), (0x4aa3ee, 110), (0x56490c, 126), (0x4ac226, 31), (0x4acbac, 24),
    (0x4ac90f, 77), (0x4aca57, 123), (0x4ac11c, 24), (0x4ac00b, 164), (0x5331ac, 6),
    (0x4ac0af, 109), (0x4acc2b, 70), (0x4acd56, 7), (0x4acf74, 24), (0x4ace06, 208),
    (0x4acf08, 20), (0x4f26d6, 52), (0x4fee90, 146),
)
HELPERS = (
    0x4f4410, 0x48fce0, 0x4a9c80, 0x4aa0b0, 0x4aa960, 0x4aadc0, 0x4aae30,
    0x4f25a0, 0x4fee90, 0x4e9e20, 0x4f2c40,
)


def main():
    prior_path = A / 'map-shop-source-check.json'
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
    for address, size in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['requested_bytes'] == size))
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

    for address, expected in {
        0x4a9c86: 'c605f021c20004', 0x4aa0b6: 'c605f021c20005',
        0x4a9d71: 'bd03000000', 0x4aa1a1: 'bd03000000',
        0x4a9eeb: 'c7833306000001000000', 0x4aa31b: 'c7833306000001000000',
        0x4a9ef6: 'c6833b06000001', 0x4aa326: 'c6833b06000001',
        0x4a9fbe: 'bf08000000', 0x4aa3ee: 'bf08000000',
        0x4ac226: '8b157c7fc000', 0x4ac90f: 'a12436f5008b0d5c3ec4003bc1',
        0x4ac017: '8a85d8f9ffff84c0747c837d0000', 0x4ac059: '8b45048d4c24185068ac315300',
        0x4ac09d: '81c558060000', 0x4ac0db: '526a005051', 0x4acc3e: '68c84958006a025152',
        0x4f26d7: '8d46035268ff020000506a7c55',
    }.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)
    for address, target in (
        (0x48ffc6, 0x4a9c80), (0x48ffd5, 0x4aa0b0),
        (0x4acf12, 0x4aadc0), (0x4acf17, 0x4aae30), (0x4ac0c1, 0x511180),
        (0x4ac0fd, 0x4f8240), (0x4acc63, 0x4f8240),
        (0x4f26e4, 0x510d80), (0x4f26f1, 0x5111a0), (0x4f2703, 0x4fee90),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)
    assert struct.unpack('<6I', original(0x4acbac, 24))[4:] == (0x4ac90f, 0x4ac90f)
    assert struct.unpack('<6I', original(0x4ac11c, 24))[4:] == (0x4ac00b, 0x4ac00b)
    assert original(0x5331ac, 3) == b'%d\0' and original(0x564754, 2) == b'|\0'
    for address, label in ((0x564940, '鉴定'), (0x564964, '修理')):
        text = original(address, 24).split(b'\0', 1)[0].decode('cp936')
        assert label in text

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('incoming', 'consumer', '0x4f4410', 'Q?m', ['int32'] * 4 + ['bytes']),
        ('incoming', 'consumer', '0x4f25a0', '?l)', ['bytes']),
        ('outgoing', 'producer', '0x4f8240', '/1I', ['int32'] * 5 + ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    proof = dict(
        schema='moli.37c4-appraisal-repair-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after) - len(before), raw_windows=windows, helpers=helpers,
        facts=dict(
            dispatch='48fce0 maps Q?m mode 0x14 to appraisal (4a9c80, internal 4) and mode 0x16 to repair (4aa0b0, internal 5). The two service names are verified by the CP936 prompts at 564940 and 564964.',
            rows='Both parsers read the window graphic and title, then at most 20 rows of seven fields: name, graphic, fee, absolute bag slot, flags, alternate label, and description. Native prompts are local. Each parsed row has selection maximum and availability one. The first matching row is used for each bag slot 8 through 27.',
            fee='4acf12 and 4acf17 update cost and selected count. Confirmation is shared at 4ac90f. It checks that the sum of the fees is at most the current gold at f53624. Gold and the existing close rule are covered by the prior ordinary shop proof.',
            response='Internal modes 4 and 5 route the accepted callback to 4ac00b. The loop emits selected absolute bag slot numbers using %d, scans source order, and puts the pipe delimiter between entries. The common send applies inner escaping and emits /1I [X,Y,sequence,actor,0,text]. The existing button 2 cancellation sends empty text.',
            item_text='The ?l) consumer 4f25a0 reads row field 4 at 4f26d7 with a limit of 767 bytes, unescapes at 4f26f1 and stores the item description via 4fee90 at 4f2703. The native description path uses sixteen lines of width 32.',
        ),
        portable_choices=['Require a live bag row and its opening revision for a service quote. Reject unknown gold or malformed prices.',
                          'Store the bounded unescaped item description and use browser wrapping. Apply item text and gold only from their inbound owners.'],
        pending=['Live appraisal and repair replies, remaining shop and trade modes, native resource presentation',
                 'Physical mobile, WeChat game page and devices, current release, official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'shop-service-source-check.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

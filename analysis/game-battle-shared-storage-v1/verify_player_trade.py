#!/usr/bin/env python3
"""Check player trade against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'player-trade'
WINDOWS = (
    (0x467350, 71), (0x467290, 289), (0x43f100, 129), (0x4cb660, 32),
    (0x4cb680, 19), (0x491200, 235), (0x4919a9, 38), (0x4f46c0, 35),
    (0x4f46f0, 71), (0x4cbe20, 238), (0x4a23c0, 29), (0x4f4740, 34),
    (0x4f4770, 33), (0x4f47a0, 35), (0x4f47d0, 42), (0x4f4800, 42),
    (0x4f4830, 58), (0x4f4870, 59), (0x4cbf10, 82), (0x4cbff0, 510),
    (0x4cc1f0, 646), (0x4cc480, 207), (0x4a2480, 44), (0x4a24c9, 35),
    (0x4a2290, 22), (0x4a23a0, 22), (0x4a2d5e, 191), (0x4a2e0a, 230),
    (0x4a2fe1, 59), (0x4a30ab, 99), (0x4a3128, 68), (0x4a3e80, 84),
    (0x4a44af, 80), (0x4cf652, 12), (0x4f278e, 37), (0x4f0afe, 38),
    (0x4f7d30, 60), (0x4f7d70, 72), (0x4f7dc0, 142), (0x4f7e50, 60),
    (0x4f7e90, 72), (0x567b94, 20), (0x564754, 28), (0x5633ec, 6),
    (0x4a2eeb, 48), (0x4ccc20, 57), (0x4ccd0b, 72), (0x4e2e57, 10),
    (0x510de0, 129), (0x4fb14c, 5), (0x4fb1da, 5), (0x4fb231, 5),
    (0x4fb2ad, 5), (0x4fb313, 5), (0x4fb3a2, 5), (0x4fb431, 5),
    (0x4fb488, 5), (0x4fb4ee, 5), (0x4a4a5e, 47), (0x4cc3ca, 164),
)
HELPERS = (
    0x43f100, 0x491200, 0x4cb680, 0x4cbe20, 0x4cbff0, 0x4cc1f0,
    0x4cc480, 0x4cbf10, 0x4a2480, 0x4a23c0, 0x4f7d30, 0x4f7d70,
    0x4f7e50, 0x4f7e90, 0x4f46f0, 0x4f4830, 0x4f4870, 0x4f46c0,
    0x4f4740, 0x4f4770, 0x4f47a0, 0x4f47d0, 0x4f4800,
)


def main():
    prior_path = A / 'message-board-source-check.json'
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

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')

    def branch(address, target, opcode=0xe8):
        instruction, relative = struct.unpack('<Bi', original(address, 5))
        assert instruction == opcode and address + 5 + relative == target, hex(address)

    incoming = []
    for call, consumer, tag, fields in (
        (0x4fb14c, 0x4f46c0, 'LsH', ['bytes']),
        (0x4fb1da, 0x4f46f0, 'M6c', ['bytes', 'int32']),
        (0x4fb231, 0x4f4740, 'MP?', []),
        (0x4fb2ad, 0x4f47a0, 'Mlt', ['bytes']),
        (0x4fb313, 0x4f4770, 'Mv@', ['int32']),
        (0x4fb3a2, 0x4f47d0, 'N)u', ['int32', 'bytes']),
        (0x4fb431, 0x4f4800, 'N4(', ['int32', 'bytes']),
        (0x4fb488, 0x4f4830, 'O#3', []),
        (0x4fb4ee, 0x4f4870, 'Ofl', ['int32']),
    ):
        row = next(r for r in catalog['incoming'] if r['consumer'] == hex(consumer))
        assert (row['tag'], row['fields']) == (tag, fields)
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'
        branch(call, consumer)
        incoming.append(dict(tag=tag, fields=fields, call=hex(call), consumer=hex(consumer)))

    outgoing = []
    for producer, literal, tag, fields, callers in (
        (0x4f7d30, 0x567b94, '+BQ', [], (0x46738b,)),
        (0x4f7d70, 0x567b98, '+i@', ['int32'], (0x4cb66c,)),
        (0x4f7dc0, 0x567b9c, '+oj', ['bytes','bytes','int32'], (0x4a2f09,)),
        (0x4f7e50, 0x567ba0, ',3K', [], (0x4a2fe8, 0x4a312f, 0x4ccc9a)),
        (0x4f7e90, 0x567ba4, ',ua', ['int32'], (0x4a30eb, 0x4ccd2f, 0x4a24da, 0x4f470a)),
    ):
        assert original(literal, 4) == tag.encode() + b'\0'
        assert original(producer+5, 5) == b'\x68' + struct.pack('<I', literal)
        for call in callers:
            branch(call, producer)
        if producer != 0x4f7dc0:
            row = next(r for r in catalog['outgoing'] if r['producer'] == hex(producer))
            assert (row['tag'], row['fields']) == (tag, fields)
        outgoing.append(dict(tag=tag, fields=fields, producer=hex(producer), callers=[hex(call) for call in callers]))

    for address, target in (
        (0x4cb676, 0x4cbe20), (0x4f46dc, 0x4cb680), (0x4f4727, 0x5111a0), (0x4f472d, 0x4cbe20),
        (0x4f47bc, 0x4cbff0), (0x4f47f1, 0x4cc1f0), (0x4f4821, 0x4cc480), (0x4f484d, 0x4cbf10),
        (0x4f7ddf, 0x4fcab0), (0x4f7e02, 0x4fcab0), (0x4f7e25, 0x4fca70),
    ):
        branch(address, target)
    for address in (0x4f4896, 0x4f48a6):
        branch(address, 0x4a2480, 0xe9)
    assert original(0x5633ec, 6) == b'%d|%d\0'
    assert original(0x564754, 2) == b'|\0'
    for address, expected in {
        0x4a3e8c: 'f6048dfe6ff50001',
        0x4a44ba: '66833cd5f035ef0000',
        0x4a30b5: '833da41bc20001',
        0x4f46f9: 'a118ecc500',
        0x4f4757: 'c705a41bc20001000000',
        0x4f478b: 'a3a0b2c300',
        0x4f4848: 'a3a41bc200',
        0x4f485f: 'c705fc44c40001000000',
        0x4f489b: 'c705a41bc20002000000',
    }.items():
        data = bytes.fromhex(expected)
        assert original(address, len(data)) == data, hex(address)

    proof = dict(
        schema='moli.37c4-player-trade-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after)-len(before), raw_windows=windows, helpers=helpers,
        incoming=incoming, outgoing=outgoing,
        facts=dict(
            request='467290 checks ordinary world state and either finds a mask-8 actor at distance one or two in the current direction through 43f100 or uses the native party-mode condition. The +BQ path uses a 500 ms interval.',
            candidates='4f46c0 passes through 4cb680 to 491200 and window 0x2c. The 510de0 delimiter search requires pipe-terminated tokens. The window carries up to ten 16-byte names. 4919a9 selects the source index and calls 4cb660. The latter sends +i@ and enters 4cbe20.',
            invitation='4f46f0 uses the decoded name and opens 4cbe20. The second integer does not feed that call. If c5ec18 is set, it sends ,ua 0. The same window 0x2b begins with empty offers and both phases zero.',
            peer_records='4cbff0 accepts 20 item positions with 14 fields per row. Item position, name, description, graphic, flags, exchange code, quantity and alternate name are fields 1,2,4,5,10,11,13,14. 4cc1f0 accepts pet positions 0–4 and 23 ordered fields. Name is field 1, graphic field 2 and nickname field 13. Negative graphic clears the pet. 4cc480 reads up to ten pipe-terminated skill names for an existing pet.',
            own_offer='4a3e8c tests bit 0 of the original item word written by 4f27a0 from field 10. The ordinary bag paths use slots 8–27. 4a44ba checks pet presence in the five FBY roster slots. 4a2d5e and 4a2e0a loop 20 and 5 rows, respectively. The format at 5633ec is %d|%d with owned slot first and offer position second. 4a2f09 sends the two byte sequences and the gold amount through 4f7dc0.',
            phases='The offer action sets local phase 1. MP? sets peer phase 1 and Ofl value 1 sets peer phase 2. Confirmation requires local phase 1, peer phase at least 1 and the 500 ms interval, then sends ,ua 1 and sets local phase 2. O#3 clears peer data and moves local phase 2 back to 1. Local ,3K sets local phase 0 and moves peer phase 2 back to 1.',
            close='Both 0 and 2 of Ofl branch to 4a2480, which suppresses the window close reply. A direct local close can send ,ua 0. The standard bag, pet and ordinary gold consumers own the corresponding records.',
        ),
        portable_choices=[
            'Use the facing-actor branch for outgoing invitations and the server-list index for selection.',
            'Pack offer positions densely in selection order. Invalidate item selections per slot and pet selections on any roster version change.',
            'Retain the remote pet numeric fields in source order. Display the named fields and skill list and keep settlement record updates separate from the close result.',
        ],
        pending=['Original party-mode initiation shortcut and detailed trade rendering; exact server result semantics and settlement rules',
                 'Physical mobile, WeChat game page and devices, current release and official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A/'player-trade-source-check.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

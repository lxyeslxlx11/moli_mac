#!/usr/bin/env python3
"""Check map dialogue graphics and treatment against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'map-dialog-services'
WINDOWS = (
    (0x49026c, 45), (0x4901f8, 116), (0x48feef, 13), (0x48fefc, 37),
    (0x48ff21, 37), (0x48ffa0, 37), (0x4908e0, 667), (0x490760, 383),
    (0x48ef70, 61), (0x48efb0, 171), (0x48f411, 185), (0x48f0a0, 272),
    (0x445390, 193), (0x4e9e20, 149), (0x563f3c, 2), (0x4fd5f0, 1266),
    (0x490db0, 842), (0x490b80, 556), (0x4fee60, 45), (0x4903e0, 886),
    (0x48fc03, 156), (0x48f255, 69), (0x48f8ec, 47), (0x563f40, 239),
    (0x564028, 32), (0x53459c, 4), (0x55a424, 20), (0x510de0, 109),
    (0x510e50, 77), (0x4fb795, 5), (0x4f4410, 133), (0x4f8240, 247),
    (0x5331ac, 3), (0x48f060, 27), (0x48f080, 29),
)
HELPERS = (
    0x4908e0, 0x490760, 0x490db0, 0x48f060, 0x48f080, 0x445390,
    0x4e9e20, 0x48fce0, 0x48ef70, 0x48efb0, 0x48f0a0, 0x510d80,
    0x510e50, 0x4fee60, 0x4f8240,
)


def main():
    prior_path = A / 'player-trade-source-check.json'
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

    def call(address, target):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    cases = original(0x49026c, 45)
    assert len(set(cases)) == 29
    for mode in (0, 1, 2, 10, 11, 0x13, 0x23):
        target = 0x48ffa0 if mode == 0x13 else 0x48ff21 if mode in (10, 11) else 0x48fefc
        assert word(0x4901f8 + 4*cases[mode]) == target
    for address, target in (
        (0x4fb795, 0x4f4410), (0x48ff13, 0x4908e0), (0x48ff38, 0x4908e0), (0x48ffb7, 0x490db0),
        (0x49090d, 0x5111a0), (0x4909e5, 0x445390), (0x490a15, 0x445390), (0x490a39, 0x490760),
        (0x4907c0, 0x51c63d), (0x490810, 0x51c63d), (0x490827, 0x51c380),
        (0x49083d, 0x51c380), (0x49087f, 0x51c63d), (0x4908bb, 0x51c63d), (0x4908cf, 0x48efb0),
        (0x490ab5, 0x4e9e20), (0x490e26, 0x510e50), (0x490e40, 0x510e50),
        (0x490e5c, 0x510d80), (0x490e69, 0x5111a0), (0x490ed6, 0x510e50),
        (0x4910e7, 0x48f0a0), (0x490c40, 0x4fee60), (0x490c64, 0x506ac0),
        (0x490683, 0x4f8240), (0x490725, 0x4f8240),
    ):
        call(address, target)
    for address, expected in {
        0x48feef: '8a886c024900ff248df8014900',
        0x48ff05: '68f000000068c0010000',
        0x48ff2a: '68b00100006840020000',
        0x4909fb: '3c407506c64601ff',
        0x490a05: '3c677557807e012c',
        0x490a29: 'c60700d1f8',
        0x490a45: '8d7eff83c102',
        0x490a7e: '80f9ff740a',
        0x4907d3: '8a4e0146',
        0x48efb5: '3c0a',
        0x48efe0: '89b0a023c2008890a423c2006689b8a623c2006689a8a823c200',
        0x48f42d: '89bea8020000',
        0x48f445: '89b7b8020000',
        0x4fd6a7: '3da0860100',
        0x4fd831: '8b96b8020000',
        0x490e2e: '8943f485c00f8c',
        0x490e82: '83f910',
        0x490ef2: '03f803f183c320',
        0x490efa: '81fbfce1c500',
        0x490f31: 'c705f0e1c50001000000',
        0x490f3b: '8915f8e1c500',
        0x49108b: 'c70524ecc10002000000',
        0x4910a5: '68800b490068e0034900',
        0x4910bf: '8d5109',
        0x4910d9: '6a02',
        0x490c7f: '8b152436f500',
        0x490cf9: '83f808',
        0x4fee69: '83f81a',
        0x4fee74: '83f833',
        0x4fee81: '83f84c',
        0x48fc8e: '2beb52556a00ffd0',
        0x4906c6: '408d5424085068ac315300',
        0x490704: '6a00',
    }.items():
        expected = bytes.fromhex(expected)
        assert original(address, len(expected)) == expected, hex(address)
    assert original(0x563f3c, 2) == b'@\0'
    assert original(0x5331ac, 3) == b'%d\0'
    assert original(0x53459c, 4) == b'???\0'
    for address, length in ((0x563f40, 24),(0x563f80, 28),(0x563fd0, 20),(0x564028, 31)):
        assert '治疗' in original(address, length).split(b'\0',1)[0].decode('cp936')
    assert b'Health' in original(0x563ffc, 44) and b'Gold' in original(0x563ffc, 44)
    injury_icons = list(struct.unpack('<5I', original(0x55a424, 20)))

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, key, address, tag, fields in (
        ('incoming','consumer','0x4f4410','Q?m',['int32']*4+['bytes']),
        ('outgoing','producer','0x4f8240','/1I',['int32']*5+['bytes']),
    ):
        row = next(row for row in catalog[side] if row[key] == address)
        assert (row['tag'], row['fields']) == (tag, fields)
        assert original(int(row['tag_address'],16),4) == tag.encode()+b'\0'

    proof = dict(
        schema='moli.37c4-map-dialog-services-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after)-len(before), raw_windows=windows, helpers=helpers,
        facts=dict(
            treatment='Q?m mode 0x13 dispatches through 48ffb7 to 490db0. Each of six slots has a 0x20-byte record and reads level, injury, name and fee through the 0x7c delimiter. A negative level stops the list. Level zero does not produce a selectable display line. The name is individually unescaped and falls back to ??? beyond 16 bytes.',
            treatment_view='490b80 shows fees and f53624. The five injury display classes at 4fee60 are zero, below 26, below 51, below 76 and at least 76. The parser sums the injury and fee fields separately. The aggregate row is source display row 8 and the configured selectable section starts at source display row 2.',
            treatment_reply='4910e7 binds callback 4903e0 and button mask 2 independently of the inbound mask. The menu path 48fc94 passes button zero and the display position, and 4906c6 adds one before formatting decimal text. Treatment rows thus send 3–8 and the aggregate row sends 9. Button 2 sends the same context with empty text at 490683.',
            illustrations='4908e0 unescapes the text, scans for @ after the optional menu header and calls 490760 for terminated @g, segments. A double @ overwrites the following byte with ff. The marked bytes are compacted before wrapping through 4e9e20. The normal window has width 448 and height 240, the wide one width 576 and height 432.',
            graphic_fields='490760 reads a decimal resource, defaults facing to zero and uses half the window width and height as the position. A comma after the resource advances past one more byte before the facing read. A following parenthesis pair can provide two decimal coordinates. 48efb0 retains ten rows and stores signed byte facing plus signed word coordinates. 48f42d and 48f445 install the resource and direction into the window sprites.',
            resource='4fd5f0 has a static path below resource 100000 and matches the direction and action in the animation path. The existing graphic and animation resource readers resolve the referenced assets.',
        ),
        injury_icon_native_ids=injury_icons,
        portable_choices=[
            'Render the source anchors on a separate responsive illustration canvas and keep HTML text, controls and treatment injury grades accessible.',
            'Parse bounded decimal graphics fields within the directive terminator. Advance the idle animation once per ordinary presentation step, and keep the text dialog available if a graphic is unavailable.',
            'Keep the treatment balance live from the ordinary gold record and send the source selection without applying local healing or spending.',
        ],
        pending=['Original treatment icon pixels, native dialog composition, mode 0x23 and remaining special map dialogs',
                 'Physical mobile, native WeChat game page and device, current release and official treatment settlement'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A/'map-dialog-services-source-check.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

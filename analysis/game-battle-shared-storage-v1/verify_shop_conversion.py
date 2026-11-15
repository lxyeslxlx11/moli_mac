#!/usr/bin/env python3
"""Check single-item conversion against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'shop-conversion'
WINDOWS = (
    (0x48feef, 13), (0x49028b, 1), (0x4901f8, 80), (0x49008c, 5),
    (0x4a99ca, 8), (0x4a9b2d, 271), (0x4ab4c0, 75), (0x4ab49b, 22),
    (0x4abfa3, 104), (0x4ac11c, 24), (0x4acbac, 24), (0x4ac226, 20),
    (0x4ac80b, 34), (0x4adfb0, 169), (0x4ae047, 47), (0x4adcc4, 115),
    (0x55e964, 4), (0x56499c, 5), (0x564a54, 23), (0x53459c, 4),
    (0x4acc63, 64), (0x4abd10, 30), (0x4ac1d8, 7), (0x4ac240, 23),
    (0x4ad850, 123), (0x4ac0fd, 25), (0x4a99b0, 192), (0x4abb6b, 43),
    (0x4a9c24, 85), (0x564a6c, 45), (0x4adfc7, 26), (0x4ae04f, 35),
    (0x490248, 4), (0x4acc30, 56), (0x4ac7d3, 68), (0x4ac186, 7),
    (0x4abdc0, 10),
)
HELPERS = (0x4f4410, 0x48fce0, 0x4a99b0, 0x4ab310, 0x4ab470, 0x4ab4c0, 0x4f25a0, 0x4f8240)


def main():
    prior_path = A / 'shop-exchange-source-check.json'
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
        0x48feef: '8a886c024900ff248df8014900',
        0x4a99bd: 'c605f021c20003',
        0x4a99e4: '6a106a026a7c56',
        0x4a9b3c: 'a3c418c200',
        0x4a9b8d: '689812c200',
        0x4a9bbd: 'bfb512c200',
        0x4a9bf9: 'a3bc18c200',
        0x4a9c08: 'a3b818c200',
        0x4a9c17: 'a3c818c200',
        0x4a9c24: 'a3cc18c200',
        0x4a9c2e: 'c7052c38c40000000000',
        0x4ab4e2: 'b80c3df5006683b8c0f9ffff00',
        0x4ab4f5: '034804055c0600003d1ceff500',
        0x4ab4a4: '0faf152c38c40089155c3ec400',
        0x4ac226: '8b157c7fc0008a44242885d20f8e03090000a802',
        0x4adfbc: 'a17c7fc0002bc23bc67e57',
        0x4adfc7: '8b0dcc18c2008b3dc818c20003ca3bcf7d413b1564e955007d39',
        0x4ae047: '3b15bc18c2007dcf',
        0x4ae04f: 'a1cc18c2002bc23bc67e208b0d5c3ec4008b3d2436f5003bcf7d0c3b1564e955000f8c',
        0x4abfa3: 'a12c38c4008d4c243850689c495600',
        0x4abfe4: '516a005250',
        0x4acc3e: '68c84958006a025152',
    }.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)

    for address, target in (
        (0x49008c, 0x4a99b0), (0x4a99da, 0x510e50), (0x4a99f0, 0x510d80),
        (0x4abb6b, 0x4ab4c0), (0x4ae00b, 0x4ab470), (0x4abfb3, 0x51b2f7),
        (0x4abfca, 0x511180), (0x4ac0fd, 0x4f8240), (0x4acc63, 0x4f8240),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    index = original(0x49026c + 0x1f, 1)[0]
    assert index == 20 and struct.unpack('<I', original(0x4901f8 + 4 * index, 4))[0] == 0x49008b
    assert struct.unpack('<6I', original(0x4acbac, 24))[3] == 0x4ac7d3
    assert struct.unpack('<6I', original(0x4ac11c, 24))[3] == 0x4abfa3
    assert struct.unpack('<I', original(0x55e964, 4))[0] == 999
    assert original(0x56499c, 5) == b'1|%d\0'
    assert original(0x53459c, 4) == b'???\0'
    assert '给予' in original(0x564a54, 23).split(b'\0', 1)[0].decode('cp936')
    assert 0xf5ef1c - 0xf53d0c == 28 * 0x65c

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
        schema='moli.37c4-item-conversion-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after) - len(before), raw_windows=windows, helpers=helpers,
        facts=dict(
            dispatch='Q?m mode 0x1f uses byte-table index 20 and target 49008b. The call at 49008c enters 4a99b0, which sets mode 3 and resets c4382c.',
            fields=['portrait', 'title', 'branch flag', 'normal message', 'second message', 'third message',
                    'fourth message', 'conversion rate', 'matching item code', 'item name', 'description',
                    'count limit', 'confirmation graphic', 'zero-flag quota ceiling', 'branch-specific quota count'],
            zero_flag='4ab4c0 copies field 12 into c07f7c. 4adfbc checks it against the current count. 4adfc7 checks field 15 plus the current count against field 14.',
            nonzero_flag='4ab4dc scans all 28 occupied item slots for field 9 equal to item field 11 and totals item field 13. 4ac226 requires a positive displayed count before confirmation. 4ae047 and 4ae04f compare the current count to fields 12 and 15, then the current converted value to gold. Field 14 is absent from that increment branch.',
            limits='Both increment branches check the limit of 999 at 55e964 before incrementing. 4ab470 writes field 8 times the current count. The pre-increment comparison against gold admits ceil(gold / rate) for positive values, subject to the other limits. E(9 mask 0x08000001 owns gold at f53624.',
            response='Confirmation at 4ac7d3 displays item name, graphic and count and installs the callback at 4abd10. Its internal mode 3 accept path formats 1|%d at 4abfa3 and uses the existing /1I [X,Y,sequence,actor,0,escaped text]. 4acc63 sends cancel button 2 with empty text.',
        ),
        portable_choices=[
            'Use direct quantity entry bounded by the native increment path. Keep only the normal message visible and use local validation messages. The native decrement-at-zero shortcut is not replayed.',
            'Require complete field shape and bounded decimals. Treat empty numeric fields as zero and reject negative rates, codes and limits. Clamp selection to a nonnegative signed 32-bit converted value.',
            'Recheck live holdings and gold before sending. The gold threshold constrains selection, while the selected value is a projection. Apply inventory and gold only from inbound events.',
        ],
        pending=['Other trade modes, actual settlement and quota behavior, original art and control shortcuts',
                 'Physical mobile, WeChat game page and devices, current release, official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'shop-conversion-source-check.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

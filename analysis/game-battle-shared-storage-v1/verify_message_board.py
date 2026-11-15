#!/usr/bin/env python3
"""Check message board against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'message-board'
WINDOWS = (
    (0x48feef, 13), (0x490281, 1), (0x490220, 4), (0x48ffe3, 22),
    (0x48fd3a, 43), (0x48fe41, 69), (0x4a8b40, 182), (0x4a8be0, 141),
    (0x4a8cb7, 101), (0x4a8dc1, 35), (0x4a7ca0, 117), (0x4a7e10, 39),
    (0x4a8430, 40), (0x4a8458, 34), (0x4a7ea1, 7), (0x4a7f12, 7),
    (0x4a7f83, 4), (0x4a7ff1, 117), (0x4a80d8, 145), (0x4a8283, 72),
    (0x4a835b, 72), (0x4a8203, 14), (0x4a8419, 10), (0x4a8df0, 43),
    (0x4a85f0, 15), (0x4a877a, 15), (0x4a8904, 15), (0x4a8a8e, 15),
    (0x4a8ab5, 86), (0x4a84d0, 65), (0x55db70, 24), (0x55dd8c, 16),
    (0x5648b0, 68), (0x5648f4, 21), (0x56bd40, 8), (0x5331ac, 3),
    (0x559ac0, 4), (0x4a3079, 5), (0x4a3de8, 5), (0x4a595c, 5),
    (0x52e7a8, 84), (0x444b80, 37), (0x444c40, 237), (0x4a8b5e, 43),
    (0x511000, 86), (0x511180, 32), (0x564770, 11), (0x56477c, 34),
    (0x56483c, 23), (0x4f4410, 133), (0x4a7ea8, 8), (0x553518, 1092),
    (0x4a8197, 29), (0x4a821d, 26),
)
HELPERS = (
    0x4f4410, 0x48fce0, 0x46c6b0, 0x4a8b40, 0x4a8480, 0x4a8df0,
    0x511000, 0x5111a0, 0x511180, 0x51b509, 0x444b80, 0x4f8240,
)


def main():
    prior_path = A / 'shop-conversion-source-check.json'
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
        0x48fe41: '8915d4e45500892d24b9c300893de003c2008935cc40c400',
        0x4a8b59: 'a3605dc400',
        0x4a8b68: '6a10b9b000000033c0bf585ac4006a016a7c56',
        0x4a8bd7: '89836c61c400',
        0x4a8c0a: '83f910',
        0x4a8cb7: '81f98c0000000f8782000000',
        0x4a8dc1: '8b442410050c0400003d30100000',
        0x4a85f0: '391d6c61c400',
        0x4a877a: '391d7865c400',
        0x4a8904: '391d8469c400',
        0x4a8a8e: '391d906dc400',
        0x4a8ab5: 'f605605dc40020',
        0x4a8ade: 'f605605dc40010',
        0x4a7ea1: '6a00e94b010000',
        0x4a7f12: '6a01e9da000000',
        0x4a7f83: '6a02eb6c',
        0x4a7ff1: '6a038d94241001000068ac315300',
        0x4a802e: '526a405051',
        0x4a8135: '506a015152',
        0x4a8293: 'c644240c00506a205152',
        0x4a836b: 'c644240c00506a105152',
        0x4a8df5: 'c705d4e45500ffffffff',
        0x56bd40: '0a6e2c637c7a5c79',
    }.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)

    trade_calls = ((0x4a2f09, 0x4f7dc0), (0x4a2fe8, 0x4f7e50), (0x4a30eb, 0x4f7e90), (0x4a312f, 0x4f7e50))
    for address, target in (
        (0x48ffe5, 0x4a8b40), (0x48fff2, 0x46c6b0),
        (0x48fe71, 0x4a8b40), (0x48fe7e, 0x46c6b0),
        (0x4a8b5e, 0x511000), (0x4a8baa, 0x500f60),
        (0x4a8bf4, 0x5111a0), (0x4a8c67, 0x5111a0),
        (0x4a7cf5, 0x4a8480), (0x4a84e2, 0x51b509),
        (0x4a8000, 0x51b2f7), (0x4a8017, 0x511180),
        (0x4a811d, 0x511180), (0x4a8050, 0x4f8240),
        (0x4a8156, 0x4f8240), (0x4a82b9, 0x4f8240), (0x4a8391, 0x4f8240),
        (0x4a820c, 0x4a8df0), (0x4a841e, 0x4a8df0),
        *trade_calls,
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    index = original(0x49026c + 0x15, 1)[0]
    assert index == 10 and struct.unpack('<I', original(0x4901f8 + 4 * index, 4))[0] == 0x48ffe3
    window_pointer = struct.unpack('<I', original(0x5599f8 + 4 * 0x32, 4))[0]
    assert window_pointer == 0x52e7a8
    assert struct.unpack('<4I', original(window_pointer + 0x20, 16)) == (0x553518, 0x4a7ca0, 0x4a7d20, 0x4a7d30)
    callbacks = struct.unpack('<10I', original(0x4a8430, 40))
    kinds = original(0x4a8458, 34)
    assert [callbacks[kinds[i]] for i in (0, 5, 12, 19, 26, 30, 31, 32, 33)] == [
        0x4a83c9, 0x4a7e37, 0x4a7ea8, 0x4a7f19, 0x4a7f87, 0x4a806e, 0x4a81a2, 0x4a821d, 0x4a82f5,
    ]
    for address in (0x553534, 0x5535d4, 0x5536b4, 0x553794, 0x553874, 0x5538f4, 0x553914, 0x553934, 0x553954):
        assert struct.unpack('<I', original(address, 4))[0] == 0x4a7e10
    assert struct.unpack('<4I', original(0x55dd8c, 16)) == (2, 70, 16, 0)
    assert original(0x5331ac, 3) == b'%d\0'
    assert original(0x5648f4, 24) == b'%4d/%02d/%02d/%02d:%02d\0'
    for address, size, label in (
        (0x5648b0, 12, '写下讯息'), (0x5648bc, 20, '上一页'), (0x5648d0, 20, '下一页'), (0x5648e4, 16, '删除此讯息'),
    ):
        assert label in original(address, size).split(b'\0', 1)[0].decode('cp936')

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('incoming', 'consumer', '0x4f4410', 'Q?m', ['int32'] * 4 + ['bytes']),
        ('outgoing', 'producer', '0x4f8240', '/1I', ['int32'] * 5 + ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    trade_candidates = []
    for address, target, length in ((0x4a3079, 0x564770, 11), (0x4a3de8, 0x56477c, 34), (0x4a595c, 0x56483c, 23)):
        assert original(address + 1, 4) == struct.pack('<I', target)
        assert '交易' in original(target, length).split(b'\0', 1)[0].decode('cp936', errors='ignore')
        trade_candidates.append(dict(instruction=hex(address), tooltip=hex(target)))
    trade_formatters = []
    for producer, literal, tag, fields in (
        (0x4f7dc0, 0x567b9c, '+oj', ['bytes', 'bytes', 'int32']),
        (0x4f7e50, 0x567ba0, ',3K', []),
        (0x4f7e90, 0x567ba4, ',ua', ['int32']),
    ):
        assert original(producer + 5, 5) == b'\x68' + struct.pack('<I', literal)
        assert original(literal, 4) == tag.encode() + b'\0'
        trade_formatters.append(dict(producer=hex(producer), tag=tag, fields=fields,
                                     callers=[hex(site) for site, target in trade_calls if target == producer]))
    for call, target in ((0x4f7ddf, 0x4fcab0), (0x4f7e02, 0x4fcab0), (0x4f7e25, 0x4fca70)):
        opcode, relative = struct.unpack('<Bi', original(call, 5))
        assert opcode == 0xe8 and call + 5 + relative == target
    for row in trade_formatters[1:]:
        catalogued = next(entry for entry in catalog['outgoing'] if entry['producer'] == row['producer'])
        assert row['tag'] == catalogued['tag'] and row['fields'] == catalogued['fields']

    proof = dict(
        schema='moli.37c4-message-board-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after) - len(before), raw_windows=windows, helpers=helpers,
        facts=dict(
            dispatch='Q?m 0x15 selects index 10 and calls 4a8b40 at 48ffe5, then opens 0x32. The same-mode branch at 48fe41 installs the new context and calls the parser again. The window descriptor binds 4a7ca0 and the 4a7e10 widget callbacks.',
            fields='4a8b40 first unescapes the full payload at 511000. Title is the first 16-byte field, then four groups of five fields at stride 0x40c: graphic selector, signed epoch seconds, delete control flag, author and message. Author and message use 5111a0 for a further field-level unescape.',
            render='4a8480 displays positive times through 51b509 and the date format at 5648f4. Nonzero row flags enable the matching delete controls. Mask bits 0x20 and 0x10 enable next and previous. Long author becomes ???. The parser copies messages through three lines of at most 70 bytes when the decoded length is at most 140.',
            post='The editor at 55db70 has two rows of 70 bytes and 444b80 treats CR as a line break. 4a80d8 requires nonempty content. At 4a811d the 511180 escape wrapper receives a 256-byte destination budget, then 4a8156 sends button 1.',
            other_replies='4a7ea1, 4a7f12, 4a7f83 and 4a7ff1 select source positions 0 to 3 for button 0x40 with decimal text. 4a82b9 and 4a8391 send empty text for next 0x20 and previous 0x10. Both board close controls call 4a8df0 directly. The existing mask -1 rule compares mode and actor.',
        ),
        portable_choices=[
            'Treat each complete group as one source position, allow omitted trailing positions and one terminal delimiter, retain a valid page on malformed same-mode refresh.',
            'Use the encoded byte limits and reject excess text instead of truncating it. The web composer converts line breaks to CR and asks for explicit confirmation before delete.',
            'Display dates in local time. Expose the incoming graphic selector for a future resource-profile projection. Server pages provide the displayed content after each action.',
        ],
        player_trade_candidates=dict(tooltips=trade_candidates, outgoing=trade_formatters,
                                     boundary='Call sites and formatter shape only. Offer fields and inbound trade state remain unresolved.'),
        pending=['Player trade offer and settlement protocol, original board portraits and edit behavior, server-side board permissions and settlement',
                 'Physical mobile, WeChat game page and devices, current release, official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A/'message-board-source-check.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

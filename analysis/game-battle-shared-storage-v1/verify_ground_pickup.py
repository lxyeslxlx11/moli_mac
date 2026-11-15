#!/usr/bin/env python3
"""Bind retained REA ground-pickup observations to the exact fixed PE bytes."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'ground-pickup'
WINDOWS = (
    (0x4667d4, 54), (0x460c70, 81), (0x500860, 336), (0x43f100, 129),
    (0x4622d0, 319), (0x4f2c10, 37), (0x5024b7, 17), (0x43fd26, 39),
    (0x43ff46, 37), (0x4f1e53, 25), (0x4f1fdf, 29), (0x567b00, 4),
    (0x55e4d4, 4), (0x567adc, 4), (0x4fa854, 5), (0x567cf0, 4),
    (0x567ce0, 4), (0x4faa57, 5),
)
HELPERS = (
    0x460c40, 0x4665b0, 0x500860, 0x43f100, 0x43fcd0, 0x43fef0, 0x4f16d0, 0x4f2260,
    0x4622d0, 0x462410, 0x463d30, 0x462c80, 0x4ff700, 0x4f2c10, 0x4f6470, 0x4f6a30,
)


def main():
    prior_path = A / 'item-targets-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def original(address, size):
        for _, va, raw_size, raw in sections:
            offset = address - base - va
            if 0 <= offset <= raw_size - size:
                return sample[raw + offset:raw + offset + size]
        raise AssertionError((hex(address), size))

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before, after = records(R / prior['snapshot']['path']), records(snapshot)
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == 949 and before.keys() <= after.keys()
    assert len(after) == closure['close']['evidence_records'] == 1015
    assert snapshot.stat().st_size == closure['close']['bytes']

    raw = []
    for address, size in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['requested_bytes'] == size))
        value = row['normalized_result']
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['returned_bytes'] == size
        assert content == original(address, size)
        raw.append(dict(address=hex(address), bytes=size, sha256=sha(content), evidence_id=row['evidence_id']))

    for address, expected in {
        0x4667d1: '8a0d2cfbc500b00284c8', 0x4667e5: '891dc078c000840528fbc500',
        0x460c70: 'f605b636f50080', 0x460c7d: 'a1c078c00085c07438', 0x460c9b: '6a085051',
        0x460cb3: '6a0352', 0x500860: 'a1d4e4550083ec0883f8ff',
        0x5008ad: '83f8010f8ff4000000', 0x5008f0: '83f8010f8fb1000000', 0x500904: '6a075051',
        0x50096d: '8b0d74f1f50081c1f40100003bc8732d', 0x5009a3: 'ffd7a374f1f500',
        0x43f117: 'be24a459006683bee4feffff00743a8b0685c0',
        0x43f12d: '8d88e0010000', 0x43f13f: '81c1f0010000',
        0x43f14e: '668b86e6feffff8b54241c23c26685c0', 0x43f166: '81c628010000',
        0x43fd2c: 'b80200000066898108a35900', 0x43fd43: '6689810aa35900',
        0x43ff4c: '66c78108a359000200', 0x43ff60: '66c7810aa359000400',
        0x4622d0: 'a1dce8f50083ec0c85c0', 0x4622e2: 'd9051cba9600d81d00d45200',
        0x4622f9: 'd90520ba9600d81d00d45200', 0x462310: '66833d8248610000',
        0x46231e: '66833d3cf3bf0000', 0x462359: '0f85a9000000',
        0x4623b4: '8b0d54f3bf0081c1f40100003bc87344', 0x4623ca: '6a0156', 0x462401: 'ffd7a354f3bf00',
        0x462483: '8b0d58f3bf0081c1f40100003bc87344', 0x462c8f: '0441c3',
        0x4f2c10: 'a118ba9600', 0x4f6a35: '68007b5600', 0x55e4d4: 'ffffffff',
    }.items():
        expected = bytes.fromhex(expected)
        assert original(address, len(expected)) == expected, hex(address)
    for address, target in (
        (0x5024bf, 0x460c40), (0x460c86, 0x4622d0), (0x460c8b, 0x500860),
        (0x460c9f, 0x43f190), (0x460cb6, 0x4f74e0), (0x500908, 0x43f100),
        (0x50095b, 0x463d30), (0x500983, 0x4034d0), (0x50098e, 0x4034d0), (0x50099b, 0x4f6a30),
        (0x43f133, 0x403330), (0x43f145, 0x403330), (0x4623a2, 0x463d30), (0x4623c5, 0x4ff700),
        (0x4623cd, 0x462c80), (0x4623f9, 0x4f2c10), (0x4f2c2c, 0x4f6470),
        (0x4fa854, 0x4f16d0), (0x4f1e66, 0x43fcd0), (0x4f1ff4, 0x43fef0), (0x4faa57, 0x4f2260),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('outgoing', 'producer', '0x4f6470', '!0b', ['int32', 'int32', 'bytes', 'int32']),
        ('outgoing', 'producer', '0x4f6a30', '&?S', ['int32'] * 3),
        ('outgoing', 'producer', '0x4f74e0', ';JE', ['int32'] * 2),
        ('incoming', 'consumer', '0x4f16d0', 'H#|', ['bytes']),
        ('incoming', 'consumer', '0x4f2260', 'IZL', ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    helpers = {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        body = row['normalized_result']['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            content = original(start, end - start + 1)
            spans.append(dict(**span, bytes=len(content), sha256=sha(content)))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)

    proof = dict(
        schema='moli.37c4-ground-pickup-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path),
        closed=True, snapshot=info(snapshot), session_closure=info(closure_path),
        retained_records=len(after), new_retained_records=len(after) - len(before), raw_windows=raw, helpers=helpers,
        facts=dict(
            input='Main 9 calls 460c40. The right-press bit in c5fb2c feeds c078c0, distinct from the held bit in c5fb28. The own f536b6 bit 7 gates the branch, which calls 4622d0 then 500860.',
            turn='4622d0 requires a live local body, zero velocity on both axes, two zero native guards and a different tile. The unsigned bff354 + 500 must be less than the tick. 4ff700 changes facing, 462c80 emits A plus the direction, and 4f2c10 forwards X, Y, the byte string and the scene flag through 4f6470. 462410 uses separate bff358 storage.',
            pickup='500860 requires 55e4d4 == -1, each absolute coordinate delta <= 1 and 43f100 with mask 7. The unsigned f5f174 + 500 must be less than the tick. 4f6a30 sends current logical X, Y and the numeric direction. There is no target ID argument.',
            records='43f100 scans active entries with a live body at 0x128 stride, comparing body cells +0x1e0/+0x1f0 and record flags. H#| dispatches to 4f16d0. Creation helpers 43fcd0 and 43fef0 set flag 2 and 4 respectively. IZL dispatches to 4f2260.',
            separate='After pickup the right branch independently checks mask 8 and can call 4f74e0 with 3 and an actor ID. That actor interaction requires separate receive and presentation evidence.',
        ),
        pending=['Full native pointer/modal and actor-interaction behavior',
                 'Other consumers, physical devices, WeChat game-page runtime and current official release'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'ground-pickup-source-check.json').write_text(json.dumps(proof, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(raw)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()

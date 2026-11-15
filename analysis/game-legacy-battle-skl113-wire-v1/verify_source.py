"""Bind the two SKL113 cursors to the fixed PE and replay their bounded reads."""

from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


class Cursor:
    def __init__(self, raw, offset):
        self.raw = raw
        self.offset = offset

    def number(self):
        value, started = 0, False
        for byte in self.raw[self.offset:]:
            self.offset += 1
            if 48 <= byte <= 57 or 65 <= byte <= 70:
                value = (value * 16 + (byte - (48 if byte <= 57 else 55))) & 0xffffffff
                started = True
            elif started or byte == 124:
                return value if value < 0x80000000 else value - 0x100000000
        raise ValueError('bounded-number')

    def token(self):
        for offset in range(self.offset, len(self.raw)):
            if 65 <= self.raw[offset] <= 90:
                if offset + 3 > len(self.raw):
                    return None
                self.offset = offset + 4
                return self.raw[offset:offset + 3].decode('ascii'), offset
        return None


def pair_view(raw, preview):
    cursor = Cursor(raw, 6)
    code, cost, variant = (cursor.number() for _ in range(3))
    category = code // 100
    assert category in (72, 113)
    reserved = Counter()
    hits = []

    def slot(*, end=False):
        wire = cursor.number()
        value = {50: 20, 51: 21}.get(wire, wire)
        if 0 <= value <= 21 or end and value == 255:
            return value
        raise ValueError(f'slot-{value}')

    def result(target):
        flags, amount = cursor.number(), cursor.number()
        resources = [cursor.number() for _ in range(3)] if flags & 0x800000 else []
        guard = slot() if flags & 0x200 else None
        if preview and guard is not None:
            reserved[guard] += 1
        return dict(target=target, flags=flags, amount=amount, resources=resources, guard=guard)

    while (actor := slot(end=True)) != 255:
        target = slot()
        if preview:
            reserved.update((actor, target))
        hit = dict(actor=actor, **result(target))
        if not hits and hit['flags'] & 1 and (category == 72 or not preview):
            hit['nested'] = result(slot())
        hits.append(hit)
    return dict(end=cursor.offset, code=code, cost=cost, variant=variant,
                reservations=sorted(reserved.items()), hits=hits)


def checked_views(tokens):
    prefix = b'M|SKL|2C25|3|0|0|A|1|C|B|1|7|'
    inputs = {
        'padded': prefix + b'FF|FF|',
        'separate': prefix + b'FF|FF|CFP|B|2|',
        'grouped_lost': prefix + b'FF|FF|CFP|0|2|',
        'grouped_resumed': prefix + b'FF|FF||CFP|0|2|',
        'grouped_wrong_known': prefix + b'FF|2|3|0|CFPFF||CFP|0|2|',
        'aligned': b'M|SKL|2C25|3|3|0|A|1|C|B|1|FFFFFFFF|0|C|201|7|2|FF|CFP|0|2|',
        'class72': prefix.replace(b'2C25', b'1C21') + b'FF|CFP|0|2|',
        'early_RID': prefix + b'FF|FF|RID|0|',
    }
    views = {}
    for name, raw in inputs.items():
        preview, producer = pair_view(raw, True), pair_view(raw, False)
        following = Cursor(raw, preview['end']).token()
        scanner, scanned = Cursor(raw, producer['end']), []
        while token := scanner.token():
            scanned.append(token)
            if token[0] in tokens:
                break
        views[name] = dict(raw=raw.decode(), preview=preview, producer=producer,
                           preview_next=following, grouped_scan=scanned,
                           same_successor=bool(following and scanned and scanned[-1] == following))
    for name in ('padded', 'separate', 'grouped_lost', 'grouped_resumed', 'early_RID'):
        row = views[name]
        assert (row['producer']['end'], row['preview']['end']) == (32, 35)
        assert row['preview']['reservations'] == [(0, 1), (1, 1), (10, 1), (11, 1)]
        assert row['producer']['hits'][0]['nested'] == dict(target=11, flags=1, amount=7, resources=[], guard=None)
    assert views['separate']['preview_next'] == ('CFP', 35)
    assert views['grouped_lost']['grouped_scan'] == [('FF|', 32), ('FP|', 36)]
    assert not views['grouped_lost']['same_successor']
    assert views['grouped_resumed']['grouped_scan'] == [('FF|', 32), ('CFP', 36)]
    assert views['grouped_resumed']['same_successor']
    wrong = views['grouped_wrong_known']
    assert wrong['grouped_scan'][0][0] == wrong['preview_next'][0] == 'CFP'
    assert wrong['grouped_scan'][0][1] < wrong['preview_next'][1] and not wrong['same_successor']
    aligned = views['aligned']
    assert aligned['producer']['end'] == aligned['preview']['end'] == 51 and aligned['same_successor']
    assert aligned['preview']['reservations'] == [(0, 1), (1, 1), (2, 1), (10, 1), (11, 1)]
    assert aligned['producer']['hits'][0]['nested']['amount'] == -1 and aligned['producer']['hits'][1]['guard'] == 2
    assert views['class72']['producer']['end'] == views['class72']['preview']['end']
    assert views['class72']['preview']['reservations'] == [(0, 1), (10, 1)]
    assert views['early_RID']['preview_next'] == ('RID', 35)
    assert views['early_RID']['grouped_scan'][0] == ('FF|', 32)

    rejected = {}
    for name, raw, expected in (
        ('single_terminator', prefix + b'FF|', 'bounded-number'),
        ('nested_guard', prefix.replace(b'B|1|7|', b'B|201|7|1|') + b'FF|FF|', 'slot-513'),
        ('nested_RID', prefix.replace(b'B|1|7|', b'B|800001|7|186DC|186DC|186DC|') + b'FF|FF|', 'slot-8388609'),
    ):
        try:
            pair_view(raw, True)
        except ValueError as error:
            assert str(error) == expected
            rejected[name] = dict(raw=raw.decode(), reservation_problem=str(error))
        else:
            raise AssertionError(name)
    return views, rejected


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    identity = startup['identity']
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closure.json'
    ledger = json.loads(bundle.read_text())
    assert ledger['artifacts'][0]['digest']['sha256'] == network['SHA'] and not ledger['unknowns']
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    memory, references, windows = [], {}, []
    for record in ledger['records']:
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, size = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, size)
        assert result['complete'] and result['returned_bytes'] == size and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=size,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + size))
    assert (len(memory), len(references)) == (49, 6)
    assert references['0x424310']['addresses'] == ['0x42987d']
    assert references['0x435000']['addresses'] == ['0x435dc2']
    assert '0x429898' in references['0x4236d0']['addresses']

    def cover(address, size):
        assert any(low <= address and address + size <= high for low, high in windows), hex(address)
        return image.locate(hex(address), size)

    def verify(address, expected):
        data = bytes.fromhex(expected)
        offset, raw = cover(address, len(data))
        assert raw == data, (hex(address), expected, raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(data))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if len(prefix) == 1 and prefix[0] != 0xe9 else 4
        relative = target - address - len(prefix) - width
        return dict(**verify(address, (prefix + relative.to_bytes(width, 'little', signed=True)).hex()), target=hex(target))

    table = {}
    for name, address, target in (
        ('SKL-preflight', 0x43630c, 0x43559c),
        ('class113-preflight', 0x4363fc + (113 - 99) * 4, 0x435cf2),
        ('class113-execution', 0x43390c + (113 - 99) * 4, 0x42f098),
        ('action232', 0x419434 + 232 * 4, 0x417e59),
    ):
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        table[name] = dict(address=hex(address), file_offset=offset, target=hex(target))

    operands = [verify(address, raw) for address, raw in (
        (0x435218, 'ff24850c634300'), (0x4355c1, 'b81f85eb51'), (0x435af0, '8d439d'),
        (0x435afc, 'ff2485fc634300'), (0x435d00, '83fb71'), (0x435ddc, 'c7450001000000'),
        (0x435024, 'fe0430'), (0x435106, '83f848'), (0x43510b, 'f6c301'), (0x435174, '3dff000000'),
        (0x43517b, 'fe0430'), (0x435191, '880c30'), (0x4351a0, 'f7c300008000'), (0x4350c2, 'f6c702'),
        (0x42947d, 'a1a08b5900'), (0x42da19, '83c09d'), (0x42da25, 'ff24850c394300'),
        (0x42f0b5, '83f871'), (0x424b8e, '83f871'), (0x424f54, '83e501'), (0x424f94, 'a900008000'),
        (0x424fd2, 'f6c402'), (0x425115, '68e8000000'), (0x425eb4, '3dff000000'),
        (0x43467d, '8b5664'), (0x4346d6, 'ff4664'), (0x434cf1, '8b35888b5900'),
        (0x434d4f, '8935888b5900'), (0x4234e4, '83f832'), (0x4234ef, '83f833'),
        (0x43650c, 'a3888b5900'), (0x4365a9, '8a98708b5900'), (0x43683b, 'a1888b5900'),
        (0x436844, 'a3648b5900'), (0x4368cf, '8b15648b5900'), (0x4368db, '895664'),
        (0x42620f, 'ff4e5c'), (0x426216, '8b415c'), (0x423668, '8b4664'),
        (0x42368d, '83f841'), (0x423692, '83f85a'), (0x4236be, '83c004894664'),
        (0x423724, '83ff16'), (0x423f4d, '894d64'), (0x434fdc, '891d888b5900'),
    )]
    branches = [branch(address, op, target) for address, op, target in (
        (0x4355dc, '0f8f', 0x435ae1), (0x435d03, '0f84', 0x435dc0), (0x435109, '75', 0x43515e),
        (0x435179, '74', 0x4351c3), (0x429488, '0f8f', 0x42da0a), (0x42f0b8, '0f84', 0x42fdb0),
        (0x42fdcd, 'e9', 0x42987c), (0x424b91, '0f84', 0x424f4e), (0x424f63, '0f84', 0x425039),
        (0x425ebf, '0f84', 0x425fc1), (0x4365b1, '75', 0x4365c1),
        (0x42621b, '0f8e', 0x42634d), (0x42625c, '7c', 0x42623e), (0x42625e, 'eb', 0x426212),
        (0x423727, '0f85', 0x423f48), (0x434ead, '0f85', 0x434fda),
    )]
    calls = []
    for address, target in (
        (0x43559c, 0x434cf0), (0x435cf2, 0x434cf0), (0x435dc2, 0x435000), (0x435dcd, 0x434e60),
        (0x435166, 0x434cf0), (0x435184, 0x4234e0), (0x42f099, 0x434670), (0x42987d, 0x424310),
        (0x429898, 0x4236d0), (0x424f6a, 0x434670), (0x424f70, 0x4234e0),
        (0x424f7a, 0x434670), (0x424f84, 0x434670), (0x42510e, 0x434af0),
        (0x425123, 0x434990), (0x425ea6, 0x434670), (0x425eac, 0x4234e0),
        (0x436515, 0x434df0), (0x436586, 0x4351d0), (0x43672c, 0x436500),
        (0x436742, 0x434770), (0x4367f1, 0x436880), (0x426227, 0x423660),
        (0x4236f5, 0x423660), (0x434e7b, 0x434df0),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    token_offset, token_table = image.locate('0x533e54', 24 * 4)
    tokens = {image.locate(hex(pointer), 3)[1].decode('ascii') for pointer in unpack('<24I', token_table)}
    assert len(tokens) == 24 and {'SKL', 'RID', 'CFP'} <= tokens
    views, rejected = checked_views(tokens)
    prior = identity(HERE.parent / 'game-legacy-battle-guard-alias-v1/source-check.json')
    assert prior['sha256'] == '5f456768e5534aa79d6e093631096cf6b2025e20a347041d4b6b5c33cab16678'
    result = dict(
        stage=256, source=identity(network['TARGET']), evidence=identity(bundle), prior=prior,
        closure=identity(closure), rea='6.7.0', provider='Ghidra 12.1.4',
        memory=memory, references=references, table=table, operands=operands, branches=branches, calls=calls,
        token_table=dict(address='0x533e54', file_offset=token_offset, sha256=sha256(token_table).hexdigest(),
                         tokens=len(tokens)),
        cursors=dict(manager='0x598b64', preflight='0x598b88', command_payload_offset='0x64',
                     preflight_end_committed_at='0x436844', grouped_unknown_continuation='0x42625e',
                     attached_RID_single_lookahead='0x4236d0'),
        views=views, bounded_rejections=rejected,
        limits=dict(original_execution_replayed=False, shapes_are_authored=True,
                    permits_out_of_range_native_dependency_indices=False, current_wire_validated=False),
        original_execution=0, VM_actions=0, official_sessions=0,
    )
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'table', 'operands', 'branches', 'calls', 'views', 'bounded_rejections')})


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Original inputs checked against an independent fixed-layout byte-memory model."""
from pathlib import Path
import json
import re
import struct

A = Path(__file__).resolve().parent
SLOT_BYTES = 0x49fc
memory = bytearray(15 * SLOT_BYTES)
versions = [0] * 15


def put(at, value):
    struct.pack_into('<I', memory, at, value & 0xffffffff)


def word(at):
    return struct.unpack_from('<i', memory, at)[0]


def reset(slot, initial=False):
    put(slot * SLOT_BYTES + 0x49f8, 0)
    for index in range(56):
        at = slot * SLOT_BYTES + 0x698 + index * 0x134
        put(at, -1)
        for material in range(5):
            put(at + 0x6c + material * 0x28, -1)
    if not initial:
        versions[slot] += 1


for slot in range(15):
    reset(slot, True)


def fields(raw):
    raw = raw.split(b'\0', 1)[0]
    result, start, at = [], 0, 0
    while at < len(raw):
        if raw[at] >= 128:
            at += 2
            continue
        if raw[at] == 124:
            result.append(raw[start:at])
            start = at + 1
        at += 1
    return [*result, raw[start:]]


def unescape(raw):
    out, at = bytearray(), 0
    while at < len(raw):
        b = raw[at]
        at += 1
        if b >= 128:
            out.append(b)
            if at < len(raw):
                out.append(raw[at])
                at += 1
        elif b == 92:
            if at < len(raw):
                out.append({110: 10, 99: 44, 122: 124, 121: 92}.get(raw[at], raw[at]))
                at += 1
        else:
            out.append(b)
    return out


def receive(slot, raw):
    tokens = fields(raw)

    def token(index, capacity):
        return tokens[index][:capacity] if index < len(tokens) else b''

    def number(index):
        raw = token(index, 127)
        if not raw:
            return -1
        found = re.match(rb'[\x09-\x0d ]*([+-]?[0-9]+)', raw)
        return int(found[1]) & 0xffffffff if found else 0

    def text(at, index, maximum):
        value = unescape(token(index, 255))
        if len(value) <= maximum:
            memory[at:at + len(value) + 1] = value + b'\0'

    for index in range(56):
        base = slot * SLOT_BYTES + 0x698 + index * 0x134
        first = index * 22
        for offset, field in [(0, 0), (4, 5), (8, 1), (12, 6), (16, 2)]:
            put(base + offset, number(first + field))
        text(base + 20, first + 3, 28)
        text(base + 49, first + 4, 56)
        for material in range(5):
            at, field = base + 0x6c + material * 0x28, first + 7 + material * 3
            put(at, number(field))
            put(at + 4, number(field + 2))
            text(at + 8, field + 1, 28)
    put(slot * SLOT_BYTES + 0x49f8, 0)
    versions[slot] += 1


def cstring(at):
    end = memory.index(0, at)
    return memory[at:end].hex()


def snapshot(slot):
    rows = []
    for index in range(56):
        at = slot * SLOT_BYTES + 0x698 + index * 0x134
        materials = []
        for material in range(5):
            base = at + 0x6c + material * 0x28
            materials.append(dict(index=material, fields={0: word(base), 4: word(base + 4)},
                                  nameHex=cstring(base + 8)))
        rows.append(dict(index=index, fields={n: word(at + n) for n in [0, 4, 8, 12, 16]},
                         nameHex=cstring(at + 20), descriptionHex=cstring(at + 49),
                         materials=materials))
    return dict(profile='legacy-se6000-37c4-craft-recipes-v1', slot=slot,
                version=versions[slot], contextMode=word(slot * SLOT_BYTES + 0x49f8), recipes=rows)


def recipe(index=0, name=None, description=None):
    row = [str(1000 + index).encode(), str(-index).encode(), str(index + 3).encode(),
           name if name is not None else f'Original-{index}'.encode(),
           description if description is not None else f'Authored description {index}'.encode(),
           str(index * 17).encode(), b'4294967295']
    for material in range(5):
        row.extend([str(index * 5 + material).encode(), f'Material-{index}-{material}'.encode(),
                    str(material + 1).encode()])
    return row


def packet(rows):
    return b'|'.join([field for row in rows for field in row]) + b'|'


full = packet([recipe(i) for i in range(56)])
long = recipe(name=b'X' * 29, description=b'Y' * 57)
long[8] = b'Z' * 29
boundary = [recipe(i, b'N' * 28, b'D' * 56) for i in range(56)]
for row in boundary:
    for index in range(8, 22, 3):
        row[index] = b'M' * 28
escaped = recipe(name=b'A\\zB\\cC\\yD\\nE', description=b'\\n' * 56)
escaped[8] = b'\\z' * 28
paired = recipe(name=bytes([0x81, 0x7c]) + b'Pair')
paired[:3] = [b' -2147483649tail', b'', b' +42tail']
paired[5:7] = [b'not-a-number', b'2147483648']
operations = [
    ('initial', 0, None), ('full', 0, full), ('overlong-retention-and-missing', 0, packet([long])),
    ('escaped-byte-lengths', 0, packet([escaped])), ('all56-boundaries', 0, packet(boundary)),
    ('partial-reset', 0, None), ('last-skill-paired-and-signed', 14, packet([paired])),
    ('empty-reply', 14, b''), ('refill', 0, full), ('extra-fields-ignored', 0, full + b'999|ignored|'),
    ('nul-prefix', 0, packet([recipe(8)]) + b'\0' + full), ('blank-skill-reset', 2, None),
]
events = []
for label, slot, raw in operations:
    kind = 'copy' if label == 'initial' else 'reset' if raw is None else 'apply'
    if kind == 'apply':
        receive(slot, raw)
    elif kind == 'reset':
        reset(slot)
    events.append(dict(label=label, kind=kind, slot=slot,
                       **({'bytesHex': raw.hex()} if raw is not None else {}), expected=snapshot(slot)))
client_events = []
for label, raw in [('full', full), ('overlong-retention-and-missing', packet([long])),
                   ('delete', None), ('requery-reply', packet([escaped]))]:
    if raw is None:
        reset(3)
    else:
        receive(3, raw)
    client_events.append(dict(label=label, **({'bytesHex': raw.hex()} if raw is not None else {}),
                              expected=snapshot(3)))
result = dict(stage=302, authority='independent fixed-layout byte-memory model from source offsets',
              original_synthetic_only=True, events=events,
              client_events=client_events, complete_row_snapshots=(len(events) + len(client_events)) * 56,
              complete_material_snapshots=(len(events) + len(client_events)) * 56 * 5)
(A / 'original-vectors.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
print(json.dumps({key: result[key] for key in ['stage', 'complete_row_snapshots', 'complete_material_snapshots']}))

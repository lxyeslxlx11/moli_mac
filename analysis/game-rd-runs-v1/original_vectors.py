#!/usr/bin/env python3
"""Original independent encodings and expected masks. No game bytes are fixtures."""
import hashlib
import json
import struct
from pathlib import Path


def encode(parts, version=1, width=None, height=1, palette_bytes=0):
    payload, values, known = bytearray(), bytearray(), bytearray()
    opcodes = {}
    for kind, count, value, extension in parts:
        group = {'literal': 0, 'repeat': 8, 'unknown': 12}[kind]
        opcode = group + extension
        assert opcode != 2 and extension in (0, 1, 2)
        assert 0 < count < 16 * 256 ** extension
        count_bytes = count.to_bytes(extension + 1, 'big')
        payload.append((opcode << 4) | count_bytes[0])
        if kind == 'repeat':
            payload.append(value)
        payload.extend(count_bytes[1:])
        if kind == 'literal':
            chunk = bytes((i * 73 + value) % 256 for i in range(count))
            payload.extend(chunk)
        else:
            chunk = bytes([value if kind == 'repeat' else 0]) * count
        values.extend(chunk)
        known.extend(bytes([kind != 'unknown']) * count)
        key = format(opcode, 'x')
        opcodes[key] = opcodes.get(key, 0) + 1
    if width is None:
        width = (len(values) - palette_bytes) // height
    assert width * height + palette_bytes == len(values)
    size = (20 if version == 3 else 16) + len(payload)
    header = struct.pack('<2sBBIII', b'RD', version, 91, width, height, size)
    if version == 3:
        header += struct.pack('<I', palette_bytes)
    split = width * height
    return {'hex': (header + payload).hex(), 'version': version, 'width': width, 'height': height,
            'paletteBytes': palette_bytes, 'pixelsSha256': hashlib.sha256(values[:split]).hexdigest(),
            'pixelKnownSha256': hashlib.sha256(known[:split]).hexdigest(),
            'paletteSha256': hashlib.sha256(values[split:]).hexdigest(),
            'paletteKnownSha256': hashlib.sha256(known[split:]).hexdigest(),
            'knownPixels': sum(known[:split]), 'knownPalette': sum(known[split:]),
            'commandCount': len(parts), 'opcodeCounts': opcodes}


def vectors():
    rows = []
    for kind in ['literal', 'repeat', 'unknown']:
        for extension in ([0, 1] if kind == 'literal' else [0, 1, 2]):
            ceiling = 16 * 256 ** extension - 1
            counts = sorted(set(n for n in [1, 15, 16, 255, 256, 4095, 4096, 65535, ceiling] if n <= ceiling))
            for count in counts:
                row = encode([(kind, count, 0 if kind == 'repeat' else 19, extension)])
                row['id'] = '%s-%d-%d' % (kind, extension, count)
                rows.append(row)
    mixed = [
        ('mixed-known-zero-and-unknown', [('literal', 2, 0, 0), ('unknown', 3, 0, 0), ('repeat', 3, 0, 0), ('literal', 6, 19, 0)], 8, 6),
        ('repeat-crosses-palette', [('literal', 6, 19, 0), ('repeat', 4, 33, 0), ('literal', 4, 71, 0)], 8, 6),
        ('unknown-crosses-palette', [('literal', 6, 19, 0), ('unknown', 7, 0, 0), ('repeat', 1, 0, 0)], 8, 6),
        ('literal-crosses-palette', [('repeat', 7, 0, 0), ('literal', 7, 19, 0)], 8, 6),
        ('short-palette', [('repeat', 12, 2, 0), ('literal', 3, 0, 0)], 12, 3),
        ('full-palette', [('repeat', 16, 0, 1), ('literal', 768, 1, 1)], 16, 768),
    ]
    for name, parts, width, palette in mixed:
        row = encode(parts, 3, width, palette_bytes=palette)
        row['id'] = name
        rows.append(row)
    return {'schema': 'moli.rd-run-original-vectors.v1', 'producer': 'Python struct/bytes/hashlib original encoder', 'vectors': rows}


if __name__ == '__main__':
    target = Path(__file__).with_name('original-vectors.json')
    result = vectors()
    target.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'vectors': len(result['vectors']), 'path': str(target), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}))

#!/usr/bin/env python3
"""Read selected local RD archives; emit metadata/hashes, never pixel data.

An independent Python implementation of the existing structural model.
C/D/E positions remain unknown rather than being assigned transparency.
Usage: inspect_corpus.py APP_BIN_DIRECTORY > PRIVATE_METADATA_JSON
"""
import collections
import hashlib
import json
import struct
import sys
from pathlib import Path

MAX_INPUT = 32 * 1024 * 1024
MAX_PIXELS = 4 * 1024 * 1024
EXPECTED = {
    'Graphic_Joy_22.bin': (47168682, 'febe67d2a09c4b06b144442d5939917b682ffc1dbe680f3196b9e32d410a7656'),
    'GraphicInfo_Joy_22.bin': (332320, '456c0d4321968a1466b5dbf3a22a106c8562cddf4d3aa23a205a9ca430ae2e68'),
    'GraphicV3_18.bin': (68321498, '34711ea1e5134e540a0a4479f2e27aebd230f016910473b5dcc215dce2b993e1'),
    'GraphicInfoV3_18.bin': (781840, 'bd80c12e99af0945bef572301ccd3b2d0dbd2adb4e130c801fe85619dc5b83aa'),
}


class Rejected(ValueError):
    pass


def digest(value):
    return hashlib.sha256(value).hexdigest()


def identify(path):
    with path.open('rb') as source:
        sha = hashlib.sha256()
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            sha.update(chunk)
    result = {'path': path.name, 'bytes': path.stat().st_size, 'sha256': sha.hexdigest()}
    if (result['bytes'], result['sha256']) != EXPECTED[path.name]:
        raise ValueError('Source identity differs: ' + path.name)
    return result


def decode(body, expected):
    """List command contributions; bounds checked before each allocation."""
    cursor, output = 0, 0
    chunks, masks = [], []
    counts = collections.Counter()
    totals = collections.Counter()
    while cursor != len(body):
        command = body[cursor]
        cursor += 1
        operation, initial = divmod(command, 16)
        if operation not in (0, 1, 8, 9, 10, 12, 13, 14):
            raise Rejected('RD_RUN_OPCODE')
        mode = 'literal' if operation < 8 else 'repeat' if operation < 12 else 'unknown'
        extensions = operation % 4
        if len(body) - cursor < extensions + (mode == 'repeat'):
            raise Rejected('RD_RUN_TRUNCATED')
        if mode == 'repeat':
            value = body[cursor]
            cursor += 1
        else:
            value = 0
        count = int.from_bytes(bytes([initial]) + body[cursor:cursor + extensions], 'big')
        cursor += extensions
        if count == 0:
            raise Rejected('RD_RUN_ZERO_COUNT')
        if count > expected - output:
            raise Rejected('RD_RUN_OVERRUN')
        if mode == 'literal':
            chunk = body[cursor:cursor + count]
            if len(chunk) != count:
                raise Rejected('RD_RUN_TRUNCATED')
            cursor += count
        else:
            chunk = bytes([value]) * count
        chunks.append(chunk)
        masks.append(bytes([mode != 'unknown']) * count)
        counts[format(operation, 'x')] += 1
        totals[mode] += count
        output += count
    if output != expected:
        raise Rejected('RD_RUN_UNDERRUN')
    return b''.join(chunks), b''.join(masks), dict(counts), totals


def inspect_pair(directory, graphic_name, index_name):
    graphic_path, index_path = directory / graphic_name, directory / index_name
    sources = [identify(graphic_path), identify(index_path)]
    index = index_path.read_bytes()
    if not index or len(index) % 40:
        raise ValueError('Invalid selected index')
    rows, versions = [], collections.Counter()
    with graphic_path.open('rb') as source:
        for ordinal in range(len(index) // 40):
            identity, offset, length, width, height = struct.unpack_from('<III8xII', index, ordinal * 40)
            if length < 16 or length > MAX_INPUT or offset + length > sources[0]['bytes']:
                raise ValueError('Record outside bounded source')
            source.seek(offset)
            raw = source.read(length)
            if len(raw) != length or raw[:2] != b'RD':
                raise ValueError('No complete RD record')
            version = raw[2]
            versions[str(version)] += 1
            if struct.unpack_from('<II', raw, 4) != (width, height):
                raise ValueError('Dimensions disagree')
            if version not in (1, 3):
                if version not in (0, 2):
                    raise ValueError('Unrecognized corpus version')
                continue
            if not width or not height or width > MAX_PIXELS // height:
                raise ValueError('Dimensions outside model budget')
            if struct.unpack_from('<I', raw, 12)[0] != length:
                raise ValueError('Compressed record length differs')
            palette = struct.unpack_from('<I', raw, 16)[0] if version == 3 else 0
            if version == 3 and (not 0 < palette <= 768 or palette % 3):
                raise ValueError('Unsupported palette size')
            row = {'ordinal': ordinal, 'id': identity, 'offset': offset, 'bytes': length,
                   'version': version, 'width': width, 'height': height, 'paletteBytes': palette}
            try:
                values, known, commands, totals = decode(raw[20 if version == 3 else 16:], width * height + palette)
                split = width * height
                row.update(status='accepted', pixelsSha256=digest(values[:split]), pixelKnownSha256=digest(known[:split]),
                           paletteSha256=digest(values[split:]), paletteKnownSha256=digest(known[split:]),
                           commandCount=sum(commands.values()), opcodeCounts=commands,
                           literalBytes=totals['literal'], repeatBytes=totals['repeat'], unknownBytes=totals['unknown'],
                           knownPixelBytes=sum(known[:split]), knownPaletteBytes=sum(known[split:]))
            except Rejected as error:
                row.update(status='rejected', code=str(error))
            rows.append(row)
    if [identify(graphic_path), identify(index_path)] != sources:
        raise ValueError('Source changed during inspection')
    return {'graphic': graphic_name, 'index': index_name, 'sources': sources,
            'recordCount': len(index) // 40, 'versions': dict(versions), 'rows': rows}


if __name__ == '__main__':
    directory = Path(sys.argv[1]).resolve(strict=True)
    result = {'schema': 'moli.rd-run-python-corpus.v1', 'interpretation': 'structural-model-only',
              'pairs': [inspect_pair(directory, 'Graphic_Joy_22.bin', 'GraphicInfo_Joy_22.bin'),
                        inspect_pair(directory, 'GraphicV3_18.bin', 'GraphicInfoV3_18.bin')]}
    print(json.dumps(result, separators=(',', ':')))

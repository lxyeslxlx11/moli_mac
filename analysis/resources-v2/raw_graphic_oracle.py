#!/usr/bin/env python3
"""Independent bounded RD v0/v2 byteplane oracle. Metadata/hashes only on stdout.

Usage: python3 raw_graphic_oracle.py INDEX GRAPHIC [--record ORDINAL]
Without --record, inspect all records and report only supported raw records.
No image export, networking, installer execution, or color/orientation claims.
"""
import argparse
import hashlib
import json
import struct
from dataclasses import dataclass
from pathlib import Path

MAX_INDEX_BYTES = 16 * 1024 * 1024
MAX_DIMENSION = 4096
MAX_PIXELS = 16 * 1024 * 1024

class InvalidGraphic(ValueError):
    pass

class UnsupportedVersion(InvalidGraphic):
    pass

@dataclass(frozen=True)
class Record:
    ordinal: int
    identifier: int
    offset: int
    length: int
    origin_x: int
    origin_y: int
    width: int
    height: int

def parse_record(index, ordinal, graphic_size):
    if not index or len(index) % 40:
        raise InvalidGraphic('index must contain complete 40-byte records')
    if not isinstance(ordinal, int) or ordinal < 0 or ordinal >= len(index)//40:
        raise InvalidGraphic('record ordinal out of bounds')
    identifier, offset, size, x, y, width, height = struct.unpack_from('<IIIiiII', index, ordinal*40)
    if size < 16 or offset > graphic_size or size > graphic_size-offset:
        raise InvalidGraphic('record range outside archive')
    if not (0 < width <= MAX_DIMENSION and 0 < height <= MAX_DIMENSION):
        raise InvalidGraphic('dimension outside supported budget')
    if width*height > MAX_PIXELS:
        raise InvalidGraphic('pixel budget exceeded')
    return Record(ordinal, identifier, offset, size, x, y, width, height)

def decode_raw(record, payload):
    if len(payload) != record.length or len(payload) < 16:
        raise InvalidGraphic('record byte length mismatch')
    magic, version, opaque_byte3, width, height, opaque_word12 = struct.unpack_from('<2sBBIII', payload)
    if magic != b'RD':
        raise InvalidGraphic('RD magic missing')
    if version not in (0, 2):
        raise UnsupportedVersion(f'version {version} not supported by raw oracle')
    if (width, height) != (record.width, record.height):
        raise InvalidGraphic('header and index dimensions disagree')
    if not (0 < width <= MAX_DIMENSION and 0 < height <= MAX_DIMENSION):
        raise InvalidGraphic('dimension outside supported budget')
    pixel_count = width*height
    if pixel_count > MAX_PIXELS:
        raise InvalidGraphic('pixel budget exceeded')
    header_bytes = 16
    palette_bytes = 0
    if version == 2:
        if len(payload) < 20:
            raise InvalidGraphic('truncated v2 header')
        header_bytes = 20
        palette_bytes = struct.unpack_from('<I', payload, 16)[0]
        if palette_bytes <= 0 or palette_bytes > 768 or palette_bytes % 3:
            raise InvalidGraphic('unsupported candidate palette byte count')
    if len(payload) != header_bytes+pixel_count+palette_bytes:
        raise InvalidGraphic('raw size equation mismatch')
    pixels = payload[header_bytes:header_bytes+pixel_count]
    palette = payload[header_bytes+pixel_count:]
    if palette_bytes and max(pixels) >= palette_bytes//3:
        raise InvalidGraphic('index byte outside candidate palette extent')
    metadata = {'record': record.ordinal, 'id': record.identifier,
                'file_offset': record.offset, 'record_bytes': record.length,
                'version': version, 'width': width, 'height': height,
                'origin_x': record.origin_x, 'origin_y': record.origin_y,
                'header_bytes': header_bytes, 'opaque_byte3': opaque_byte3,
                'opaque_word12': opaque_word12,
                'pixel_bytes': pixel_count, 'pixel_sha256': hashlib.sha256(pixels).hexdigest(),
                'pixel_min': min(pixels), 'pixel_max': max(pixels),
                'candidate_palette_bytes': palette_bytes,
                'candidate_palette_sha256': hashlib.sha256(palette).hexdigest() if palette else None}
    return pixels, metadata

def inspect(index_path, graphic_path, ordinal=None):
    index_path = Path(index_path)
    graphic_path = Path(graphic_path)
    if index_path.stat().st_size > MAX_INDEX_BYTES:
        raise InvalidGraphic('index exceeds metadata budget')
    index = index_path.read_bytes()
    if not index or len(index)%40:
        raise InvalidGraphic('invalid index record count')
    graphic_size = graphic_path.stat().st_size
    result = {'index': index_path.name, 'index_sha256': hashlib.sha256(index).hexdigest(),
              'graphic': graphic_path.name, 'graphic_bytes': graphic_size,
              'total_records': len(index)//40, 'version_counts': {}, 'raw_records': [],
              'rejections': []}
    ordinals = [ordinal] if ordinal is not None else range(len(index)//40)
    with graphic_path.open('rb') as graphic:
        for position in ordinals:
            try:
                record = parse_record(index, position, graphic_size)
                graphic.seek(record.offset)
                prefix = graphic.read(16)
                if len(prefix)<16 or prefix[:2] != b'RD':
                    raise InvalidGraphic('missing bounded RD header')
                version = prefix[2]
                key = str(version)
                result['version_counts'][key] = result['version_counts'].get(key, 0)+1
                if version not in (0, 2):
                    if ordinal is not None:
                        raise UnsupportedVersion(f'version {version} not supported by raw oracle')
                    continue
                # Bound before allocating, even if an adversarial index claims a huge length.
                if record.length > 20+MAX_PIXELS+768:
                    raise InvalidGraphic('raw record exceeds byte budget')
                graphic.seek(record.offset)
                _, metadata = decode_raw(record, graphic.read(record.length))
                result['raw_records'].append(metadata)
            except InvalidGraphic as error:
                result['rejections'].append({'record': position, 'reason': str(error)})
    return result

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('index')
    parser.add_argument('graphic')
    parser.add_argument('--record', type=int)
    args = parser.parse_args()
    print(json.dumps(inspect(args.index, args.graphic, args.record), indent=2))

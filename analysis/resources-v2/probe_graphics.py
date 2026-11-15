#!/usr/bin/env python3
"""Local bytes-only RD experiments. No target execution and no image export.

The run-length model below was inferred from the provided local samples. It is
experimental; success means exact bounded stream expansion, not proven visual
compatibility. Results contain hashes/statistics only, never official pixels.
"""
from pathlib import Path
import collections
import hashlib
import json
import struct

HERE = Path(__file__).resolve().parent
ROOT = Path('/tmp/moli-analysis/crossgate/app/bin')
PAIRS = [('Graphic_Joy_22.bin', 'GraphicInfo_Joy_22.bin'),
         ('GraphicV3_18.bin', 'GraphicInfoV3_18.bin')]

class Rejected(ValueError):
    pass

def expand_rle(data, expected, value_first=True):
    if expected <= 0 or expected > 16_777_216:
        raise Rejected('invalid output budget')
    output = bytearray()
    cursor = 0
    commands = collections.Counter()
    while cursor < len(data):
        command = data[cursor]
        cursor += 1
        opcode = command >> 4
        count = command & 15
        value = 0
        if opcode not in (0, 1, 2, 8, 9, 10, 12, 13, 14):
            raise Rejected(f'unknown opcode 0x{command:02x} at body+{cursor-1}')
        extension_bytes = opcode & 3
        repeat = 8 <= opcode <= 10
        required = extension_bytes + int(repeat)
        if cursor + required > len(data):
            raise Rejected('truncated command operands')
        if repeat and value_first:
            value = data[cursor]
            cursor += 1
        for _ in range(extension_bytes):
            count = count * 256 + data[cursor]
            cursor += 1
        if repeat and not value_first:
            value = data[cursor]
            cursor += 1
        if count == 0:
            raise Rejected('zero-count command')
        if len(output) + count > expected:
            raise Rejected(f'output exceeds budget: {len(output)}+{count}>{expected}')
        if opcode <= 2:
            if cursor + count > len(data):
                raise Rejected('truncated literal data')
            output.extend(data[cursor:cursor+count])
            cursor += count
        else:
            output.extend(bytes([value]) * count)
        commands[f'{opcode:x}'] += 1
    if len(output) != expected:
        raise Rejected(f'short expansion: {len(output)}!={expected}')
    return output, commands

def probe_pair(graphic_name, index_name):
    graphic = (ROOT / graphic_name).read_bytes()
    index = (ROOT / index_name).read_bytes()
    assert len(index) % 40 == 0
    result = {'graphic': graphic_name, 'graphic_bytes': len(graphic),
              'graphic_sha256': hashlib.sha256(graphic).hexdigest(),
              'index': index_name, 'index_sha256': hashlib.sha256(index).hexdigest(),
              'records': len(index)//40, 'versions': {}, 'rle_rejections': [],
              'bounded_header_failures': [], 'raw_records': [],
              'rle_success_examples': [], 'rle_command_counts': {},
              'compressed_length_field_mismatches': 0,
              'version3_palette_extent_violations': 0,
              'alternative_count_first_successes': 0,
              'alternative_count_first_tested': 0}
    versions = collections.defaultdict(lambda: {'total': 0, 'accepted': 0, 'rejected': 0})
    commands = collections.Counter()
    for position, record in enumerate(struct.iter_unpack('<IIIiiII4BII', index)):
        identifier, offset, size, dx, dy, iw, ih, *_ = record
        summary = {'record': position, 'id': identifier, 'file_offset': offset,
                   'index_bytes': size, 'index_width': iw, 'index_height': ih}
        if size < 16 or offset > len(graphic) or size > len(graphic)-offset:
            result['bounded_header_failures'].append(summary)
            continue
        payload = graphic[offset:offset+size]
        magic, version, opaque_byte, w, h, word12 = struct.unpack_from('<2sBBIII', payload)
        if magic != b'RD' or (w, h) != (iw, ih) or not (0 < w <= 4096 and 0 < h <= 4096):
            result['bounded_header_failures'].append(summary)
            continue
        versions[version]['total'] += 1
        summary.update(version=version, width=w, height=h, opaque_byte3=opaque_byte,
                       word12=word12, header_bytes=20 if version in (2, 3) else 16)
        palette_bytes = struct.unpack_from('<I', payload, 16)[0] if version in (2, 3) else 0
        summary['candidate_palette_bytes'] = palette_bytes
        if version in (1, 3) and word12 != size:
            result['compressed_length_field_mismatches'] += 1
        expected = w*h + palette_bytes
        body = payload[summary['header_bytes']:]
        try:
            if version in (0, 2):
                if len(body) != expected:
                    raise Rejected('raw payload length mismatch')
                decoded = body
            elif version in (1, 3):
                decoded, counts = expand_rle(body, expected)
                commands.update(counts)
            else:
                raise Rejected('unsupported version')
        except Rejected as e:
            versions[version]['rejected'] += 1
            result['rle_rejections'].append({**summary, 'reason': str(e)})
            continue
        versions[version]['accepted'] += 1
        pixels = decoded[:w*h]
        summary['pixel_sha256'] = hashlib.sha256(pixels).hexdigest()
        summary['pixel_min'] = min(pixels)
        summary['pixel_max'] = max(pixels)
        if palette_bytes:
            summary['candidate_palette_sha256'] = hashlib.sha256(decoded[w*h:]).hexdigest()
            if max(pixels) >= palette_bytes//3:
                result['version3_palette_extent_violations'] += int(version == 3)
        if version in (0, 2):
            result['raw_records'].append(summary)
        elif len(result['rle_success_examples']) < 16:
            result['rle_success_examples'].append(summary)
        if position < 400 and version in (1, 3):
            result['alternative_count_first_tested'] += 1
            try:
                expand_rle(body, expected, value_first=False)
                result['alternative_count_first_successes'] += 1
            except Rejected:
                pass
    result['versions'] = dict(versions)
    result['rle_command_counts'] = dict(commands)
    return result

if __name__ == '__main__':
    results = [probe_pair(*pair) for pair in PAIRS]
    (HERE/'graphics-probe-results.json').write_text(json.dumps(results, indent=2)+'\n')
    for result in results:
        print(result['graphic'], result['versions'], 'rejected', len(result['rle_rejections']))
        for rejected in result['rle_rejections'][:8]:
            print(' ', rejected['record'], rejected['reason'])

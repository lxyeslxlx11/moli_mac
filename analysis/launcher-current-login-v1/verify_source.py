"""Read-only identity and selected-anchor verifier for the exact updated PE32 copy.

This is not a general PE parser or behavioral-equivalence test. It reads no guest
memory, executes no vendor code and accepts no other source identity.
"""
from pathlib import Path
import argparse
import hashlib
import json
import struct


def verify(sample):
    specification = json.loads(Path(__file__).with_name('source-anchors.json').read_text())
    data = Path(sample).read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != specification['analysis_sha256']:
        raise ValueError('Source identity mismatch')
    if len(data) < 64 or data[:2] != b'MZ':
        raise ValueError('Unsupported PE header')
    pe = struct.unpack_from('<I', data, 60)[0]
    if pe + 24 > len(data) or data[pe:pe + 4] != b'PE\0\0':
        raise ValueError('Invalid PE header bounds')
    machine, count = struct.unpack_from('<HH', data, pe + 4)
    optional_size = struct.unpack_from('<H', data, pe + 20)[0]
    optional = pe + 24
    sections_at = optional + optional_size
    if machine != 0x14c or optional_size < 96 or not 1 <= count <= 96 or sections_at + count * 40 > len(data):
        raise ValueError('Unsupported PE32 section layout')
    if struct.unpack_from('<H', data, optional)[0] != 0x10b:
        raise ValueError('Expected PE32 optional header')
    image_base = struct.unpack_from('<I', data, optional + 28)[0]
    sections = []
    for index in range(count):
        position = sections_at + index * 40
        virtual, size, offset = struct.unpack_from('<III', data, position + 12)
        if offset + size > len(data):
            raise ValueError('Section raw bytes exceed source')
        sections.append((virtual, size, offset))
    results = []
    for anchor in specification['anchors']:
        expected = bytes.fromhex(anchor['hex'])
        rva = int(anchor['address'], 16) - image_base
        candidates = [offset + rva - virtual for virtual, size, offset in sections
                      if virtual <= rva and rva + len(expected) <= virtual + size]
        if len(candidates) != 1 or data[candidates[0]:candidates[0] + len(expected)] != expected:
            raise ValueError('Selected source anchor mismatch: ' + anchor['id'])
        results.append({'id': anchor['id'], 'address': anchor['address'], 'file_offset': candidates[0],
                        'bytes': len(expected), 'sha256': hashlib.sha256(expected).hexdigest(), 'passed': True})
    return {'schema': 'moli.current-launcher-login.source-verification.v1', 'passed': True,
            'source_sha256': digest, 'anchor_count': len(results), 'anchors': results,
            'scope': 'Exact source identity and five selected anchors; not runtime authentication or game compatibility'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sample', required=True)
    arguments = parser.parse_args()
    try:
        result = verify(arguments.sample)
    except (ValueError, OSError, struct.error) as error:
        parser.exit(1, str(error) + '\n')
    print(json.dumps(result, ensure_ascii=False, indent=2))

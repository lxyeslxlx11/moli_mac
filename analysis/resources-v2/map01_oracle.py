#!/usr/bin/env python3
"""Independent fixed-corpus MAP01 observations; explicit paths only, metadata output only."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import struct

MAX_MAP_BYTES = 32 * 1024 * 1024


def read_regular(path, limit):
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        before = os.fstat(stream.fileno())
        if not stat.S_ISREG(before.st_mode) or not 0 < before.st_size <= limit:
            raise ValueError('Not a bounded nonempty regular file')
        data = stream.read(before.st_size + 1)
        after = os.fstat(stream.fileno())
        if len(data) != before.st_size or (before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns):
            raise ValueError('Input changed or short read')
        return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('observations')
    parser.add_argument('maps', nargs=4)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    known = json.loads(read_regular(args.observations, 65536))
    if len(known) != 4:
        raise ValueError('Expected the four documented samples')
    rows = []
    for path, expected in zip(args.maps, known):
        data = read_regular(path, MAX_MAP_BYTES)
        digest = hashlib.sha256(data).hexdigest()
        if digest != expected['sha256'] or len(data) != expected['bytes']:
            raise ValueError('Fixed sample identity mismatch')
        if len(data) < 20 or data[:4] != b'MAP\x01':
            raise ValueError('Wrong fixed sample header')
        width, height = struct.unpack_from('<II', data, 12)
        if (width, height) != (expected['candidate_width'], expected['candidate_height']) or len(data) != 20 + 6 * width * height:
            raise ValueError('Fixed observations do not match')
        rows.append({'name': Path(path).name, 'bytes': len(data), 'sha256': digest,
                     'candidate_width': width, 'candidate_height': height,
                     'opaque_header_hex': data[4:12].hex(),
                     'opaque_body_bytes': len(data) - 20,
                     'opaque_body_sha256': hashlib.sha256(data[20:]).hexdigest()})
    result = {'schema': 'moli.map01.fixed-oracle.v1',
              'method': 'Independent Python struct/hashlib on four hash-bound explicit regular files; no plane semantics',
              'rows': rows}
    # An existing result is never silently replaced.
    with open(args.output, 'x', encoding='utf-8') as output:
        json.dump(result, output, ensure_ascii=False, indent=2)
        output.write('\n')
    print(json.dumps({'fixed_samples': len(rows), 'output': args.output}))


if __name__ == '__main__':
    main()

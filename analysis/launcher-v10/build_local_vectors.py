#!/usr/bin/env python3
"""Independent hashlib fixtures: original public constants, never an account/profile read."""
from pathlib import Path
import hashlib
import json


def main():
    inputs = [('rfc1321-a', b'a'), ('rfc1321-abc', b'abc'), ('original-name', b'SyntheticU1'),
              ('original-case', b'syntheticU1'), ('original-space', b' A a '),
              ('original-high-bytes', bytes(range(128, 144))), ('original-max', b'ABCDEFGHIJKLMNOP')]
    inputs += [(f'original-length-{n}', bytes((i * 17 + n) % 255 + 1 for i in range(n))) for n in range(1, 17)]
    vectors = [{'name': name, 'username_hex': data.hex(), 'key': hashlib.md5(data).hexdigest()} for name, data in inputs]
    result = {'schema': 'moli.launcher-v10.original-local-vectors.v1',
              'identity': 'All input values are original public fixtures or short RFC1321 test constants, not real users/credentials.',
              'oracle': 'Python hashlib.md5, independent of JavaScript implementation.', 'vectors': vectors}
    Path(__file__).with_name('original-local-vectors.json').write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()

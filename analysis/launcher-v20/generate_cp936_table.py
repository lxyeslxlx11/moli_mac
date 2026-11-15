#!/usr/bin/env python3
"""Generate a deterministic data-only CP936 table from one pinned public mapping. No network/execution."""
from pathlib import Path
import argparse
import hashlib
import json
import re

EXPECTED = 'b86f601c575e9ab457380b6f7abef03c75499cc6075bdc8b4b27f3f2de74bf6a'

def generate(path):
    raw = path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != EXPECTED:
        raise ValueError('The mapping differs from the reviewed source.')
    mapping = {}
    for line in raw.decode('ascii').splitlines():
        match = re.match(r'^0x([0-9a-fA-F]+)\s+0x([0-9a-fA-F]+)', line)
        if match:
            byte, scalar = (int(x, 16) for x in match.groups())
            assert byte not in mapping
            mapping[byte] = scalar
    assert len(mapping) == 21920 and len(set(mapping.values())) == len(mapping)
    assert all(mapping[i] == i for i in range(128)) and mapping[0x80] == 0x20ac
    header = ('/** Generated from Microsoft CP936 table2.01, Unicode2.0; source date text1/7/2000.\n'
              ' * Source: https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP936.TXT\n'
              ' * Source SHA256: ' + EXPECTED + '\n'
              ' * Unicode License V3; see LICENSE.txt.\n'
              ' * Rows81..FE; trails40..FE excluding7F. Each UTF16 unit is one mapped BMP scalar;0 is undefined.\n'
              ' * ASCII00..7F and single80=U+20AC are handled by the codec. No best-fit or GB18030 extensions. */\n')
    rows = []
    for lead in range(0x81, 0xff):
        points = [mapping.get((lead << 8) | trail, 0) for trail in range(0x40, 0xff) if trail != 0x7f]
        assert len(points) == 190 and all(0 <= value < 0x10000 and not 0xd800 <= value <= 0xdfff for value in points)
        rows.append('"' + ''.join('\\u%04x' % value for value in points) + '"')
    return header + 'export const WINDOWS_936_DOUBLE =\n' + ' +\n'.join(rows) + ';\n'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    text = generate(args.source)
    if args.check:
        assert args.output.read_text() == text
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text)
    print(json.dumps({'bytes': len(text.encode()), 'sha256': hashlib.sha256(text.encode()).hexdigest(), 'checked': args.check}))

"""Generate the pinned public WHATWG index representation; no network or game data."""
from pathlib import Path
import argparse
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
COMMIT = 'be17ac5c49881336538acfc7b40dba3c8009144b'
HASHES = {
    'index-gb18030.txt': '746b3c55f1a8ec4b90b451f384437a17fd37cd51cd668456a28071a758d10784',
    'index-gb18030-ranges.txt': '874c6b6f6f74cf7d427ad228d5b41ddd9354fffd92a2259bf429f86e6baa7a1e',
    'LICENSE': '85dc6f5ccb57a6fe8c33d158f9fc8fc7ee5655a5d3db2cdd131c6a3d0f48a864',
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    source = parser.parse_args().source_dir
    raw = {name: (source / name).read_bytes() for name in HASHES}
    for name, data in raw.items():
        if hashlib.sha256(data).hexdigest() != HASHES[name]:
            raise ValueError('Pinned source hash mismatch: ' + name)
    def rows(name):
        return [(int(a), int(b, 16)) for a, b in re.findall(r'^\s*(\d+)\s+0x([0-9A-F]+)\b', raw[name].decode(), re.M)]
    double = rows('index-gb18030.txt')
    ranges = rows('index-gb18030-ranges.txt')
    assert len(double) == 23940 and [p for p, _ in double] == list(range(23940))
    assert len(ranges) == 207 and ranges[0] == (0, 0x80)
    assert all(0 < cp <= 0xffff and not 0xd800 <= cp <= 0xdfff for _, cp in double)
    assert all(ranges[i][0] < ranges[i+1][0] for i in range(len(ranges)-1))
    license_text = raw['LICENSE'].decode()
    bsd = license_text[license_text.index('\nBSD 3-Clause License\n') + 1:].split('\n- - - -')[0].strip()
    assert 'THIS SOFTWARE IS PROVIDED' in bsd and 'Redistribution and use' in bsd
    notice = 'Copyright © WHATWG (Apple, Google, Mozilla, Microsoft).\n' + bsd
    chunks = [''.join('\\u%04x' % cp for _, cp in double[i:i+96]) for i in range(0, len(double), 96)]
    text = '/*!\n' + notice + '\n*/\n// Generated from public WHATWG indexes at ' + COMMIT + '.\n'
    text += 'export const GB18030_DOUBLE =\n' + ' +\n'.join('  "' + chunk + '"' for chunk in chunks) + ';\n'
    text += 'export const GB18030_RANGES = Object.freeze(' + json.dumps([v for row in ranges for v in row], separators=(',', ':')) + ');\n'
    output = ROOT / 'shared/vendor/whatwg-gb18030'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'table.mjs').write_text(text)
    (output / 'LICENSE.txt').write_bytes(raw['LICENSE'])
    provenance = {'repository': 'https://github.com/whatwg/encoding', 'commit': COMMIT,
        'two_byte_profile': 'WHATWG GB18030-2022 table, including A3 A0 -> U+3000 compatibility mapping',
        'four_byte_profile': '207 ranges with pointer limits and 7457 -> U+E7C7 per Encoding Standard',
        'source_files': [{'name': name, 'url': f'https://raw.githubusercontent.com/whatwg/encoding/{COMMIT}/{name}',
            'bytes': len(raw[name]), 'sha256': digest} for name, digest in HASHES.items()],
        'representation': '23940 BMP code units plus frozen flat pointer/codepoint range pairs',
        'table_sha256': hashlib.sha256(text.encode()).hexdigest(), 'generator': 'tools/generate-gb18030.py',
        'license': 'WHATWG LICENSE: source portions under BSD-3-Clause; full notice retained'}
    (output / 'provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
    print(json.dumps({'double_entries': len(double), 'ranges': len(ranges), 'table_bytes': len(text.encode()), 'sha256': provenance['table_sha256']}))


if __name__ == '__main__':
    main()

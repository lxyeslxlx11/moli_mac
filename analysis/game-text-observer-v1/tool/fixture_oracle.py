"""Offline byte oracle for the pinned original fixture, never for vendor code.

PE HIGHLOW rules: https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#the-reloc-section-image-only
Only creates expected bytes in Python memory. Does not write or execute a PE.
"""
from pathlib import Path
import argparse
import hashlib
import json
import struct
import sys

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'analysis/game-entry-v1/probe'))
from pe_layout import validate_own_x86_layout

FIXTURE = ROOT / 'build/analysis/game-entry-v1/probe-stage101/entry-fixture.exe'
FIXTURE_SHA = 'cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a'


def expected_fixture_text(image, observed_base):
    if hashlib.sha256(image).hexdigest() != FIXTURE_SHA:
        raise ValueError('Only the pinned original fixture is accepted.')
    layout = validate_own_x86_layout(image)
    if (not isinstance(observed_base, int) or isinstance(observed_base, bool)
            or observed_base < 0x10000 or observed_base % 0x10000
            or observed_base + 0xe82000 > 0x100000000):
        raise ValueError('Invalid observed x86 fixture image base.')
    pe = struct.unpack_from('<I', image, 60)[0]
    optional = pe + 24
    preferred = struct.unpack_from('<I', image, optional + 28)[0]
    selected = next(s for s in layout['sections'] if s['rva'] == 4096)
    assert selected['virtual_bytes'] == 6624 and selected['raw_bytes'] == 6656
    text = bytearray(image[selected['file_offset']:selected['file_offset'] + 6624])
    reloc_rva, reloc_bytes = struct.unpack_from('<II', image, optional + 96 + 5 * 8)
    owners = [s for s in layout['sections']
              if s['rva'] <= reloc_rva and reloc_rva + reloc_bytes <= s['rva'] + s['raw_bytes']]
    if len(owners) != 1:
        raise ValueError('Invalid original relocation range.')
    cursor = owners[0]['file_offset'] + reloc_rva - owners[0]['rva']
    limit = cursor + reloc_bytes
    fixups = set()
    while cursor < limit:
        if cursor + 8 > limit:
            raise ValueError('Truncated relocation block.')
        page, size = struct.unpack_from('<II', image, cursor)
        if size < 8 or size % 4 or cursor + size > limit or page % 4096:
            raise ValueError('Invalid relocation block.')
        for at in range(cursor + 8, cursor + size, 2):
            item = struct.unpack_from('<H', image, at)[0]
            kind, rva = item >> 12, page + (item & 4095)
            if kind == 0 or not 4096 <= rva < 4096 + len(text):
                continue
            if kind != 3 or rva + 4 > 4096 + len(text) or rva in fixups:
                raise ValueError('Unsupported or overlapping fixture .text fixup.')
            fixups.add(rva)
            value = struct.unpack_from('<I', text, rva - 4096)[0]
            struct.pack_into('<I', text, rva - 4096, (value + observed_base - preferred) & 0xffffffff)
        cursor += size
    assert len(fixups) == 245
    return bytes(text), {'fixture_sha256': FIXTURE_SHA, 'preferred_base': preferred,
                         'observed_base': observed_base, 'text_rva': 4096,
                         'text_bytes': len(text), 'highlow_fixups': len(fixups),
                         'expected_sha256': hashlib.sha256(text).hexdigest(),
                         'scope': 'Original fixture expected bytes only; no Windows execution proof.'}


def verify_fixture_snapshot(image, observed_base, snapshot):
    expected, report = expected_fixture_text(image, observed_base)
    report.update({'snapshot_bytes': len(snapshot),
                   'snapshot_sha256': hashlib.sha256(snapshot).hexdigest(),
                   'bytes_equal': snapshot == expected})
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', required=True, type=lambda x: int(x, 0))
    parser.add_argument('--snapshot', required=True, type=Path)
    args = parser.parse_args()
    private = (ROOT / 'build/analysis/game-text-observer-v1').resolve()
    path = args.snapshot.resolve(strict=True)
    if args.snapshot.is_symlink() or not path.is_relative_to(private) or not path.is_file():
        parser.error('Snapshot must be a regular local file in this phase private build directory.')
    result = verify_fixture_snapshot(FIXTURE.read_bytes(), args.base, path.read_bytes())
    print(json.dumps(result))
    raise SystemExit(0 if result['bytes_equal'] else 1)

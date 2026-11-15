#!/usr/bin/env python3
"""Read-only verification of short static anchors; never loads or executes the PE.

Usage: python3 verify_lifecycle.py /path/to/LauncherUpdater.unpacked.exe
The manifest is tied to one SHA256. Import names are read from the PE, while
MFC ordinal names remain separately attributed analysis annotations.
"""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys


def verify(path, manifest):
    data = Path(path).read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != manifest['sample']['sha256']:
        raise ValueError('sample SHA256 mismatch; refusing to apply version-specific anchors')
    u16 = lambda p: struct.unpack_from('<H', data, p)[0]
    u32 = lambda p: struct.unpack_from('<I', data, p)[0]
    pe = u32(0x3c)
    if data[:2] != b'MZ' or data[pe:pe + 4] != b'PE\x00\x00':
        raise ValueError('not PE')
    opt = pe + 24
    if u16(opt) != 0x10b or u16(pe + 4) != 0x14c:
        raise ValueError('not PE32/i386')
    base = u32(opt + 28)
    sections = []
    sh = opt + u16(pe + 20)
    for i in range(u16(pe + 6)):
        p = sh + 40 * i
        sections.append((u32(p + 12), u32(p + 20), u32(p + 16)))

    def offset(va, length=1):
        rva = va - base
        for section_rva, raw, size in sections:
            if section_rva <= rva and rva + length <= section_rva + size:
                p = raw + rva - section_rva
                if p + length <= len(data):
                    return p
        raise ValueError(f'VA {va:#x} lacks raw-file coverage')

    def cstr_rva(rva):
        p = offset(base + rva)
        end = data.index(0, p)
        return data[p:end].decode('ascii')

    imports = {}
    desc = offset(base + u32(opt + 104))
    while any(data[desc:desc + 20]):
        original_thunk, _, _, name_rva, first_thunk = struct.unpack_from('<IIIII', data, desc)
        dll = cstr_rva(name_rva)
        thunk = original_thunk or first_thunk
        i = 0
        while True:
            value = u32(offset(base + thunk + i * 4, 4))
            if value == 0:
                break
            imported = {'dll': dll}
            if value & 0x80000000:
                imported['ordinal'] = value & 0xffff
            else:
                imported['name'] = cstr_rva(value + 2)
            imports[base + first_thunk + i * 4] = imported
            i += 1
        desc += 20

    results = []
    for anchor in manifest['anchors']:
        va = int(anchor['va'], 16)
        p = offset(va)
        if p != int(anchor['file_offset'], 16):
            raise ValueError(f"{anchor['id']}: file offset mismatch")
        expected = anchor['expected']
        kind = anchor['kind']
        if kind == 'iat_call':
            if data[p:p + 2] != b'\xff\x15':
                raise ValueError(f"{anchor['id']}: not absolute IAT call")
            iat = u32(p + 2)
            assert iat == int(expected['iat_va'], 16), anchor['id']
            imported = imports[iat]
            assert imported['dll'].lower() == expected['dll'].lower(), anchor['id']
            key = 'ordinal' if 'ordinal' in expected else 'name'
            assert imported[key] == expected[key], anchor['id']
        elif kind == 'direct_call':
            assert data[p] == 0xe8, anchor['id']
            relative = struct.unpack_from('<i', data, p + 1)[0]
            assert va + 5 + relative == int(expected['target_va'], 16), anchor['id']
        elif kind == 'ascii_literal':
            literal = expected.encode('ascii') + b'\x00'
            assert data[p:p + len(literal)] == literal, anchor['id']
        elif kind == 'bytes':
            anchor_bytes = bytes.fromhex(expected)
            assert data[p:p + len(anchor_bytes)] == anchor_bytes, anchor['id']
        else:
            raise ValueError(f'unknown anchor kind {kind}')
        results.append({'id': anchor['id'], 'passed': True})
    for region in manifest['reviewed_ranges']:
        start, stop = int(region['start_va'], 16), int(region['end_va_exclusive'], 16)
        p = offset(start, stop - start)
        assert hashlib.sha256(data[p:p + stop - start]).hexdigest() == region['sha256'], region['id']
    return {'sample_sha256': digest, 'anchors_passed': len(results),
            'reviewed_range_hashes_passed': len(manifest['reviewed_ranges']),
            'results': results,
            'limits': 'Anchor matches verify locations and encodings, not runtime success or full control-flow semantics.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sample')
    parser.add_argument('--manifest', default=str(Path(__file__).with_name('lifecycle-evidence.json')))
    args = parser.parse_args()
    try:
        manifest = json.loads(Path(args.manifest).read_text())
        result = verify(args.sample, manifest)
    except (AssertionError, ValueError, KeyError, IndexError, OSError, struct.error) as error:
        print(json.dumps({'passed': False, 'error': str(error)}, ensure_ascii=False))
        return 1
    print(json.dumps({'passed': True, **result}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())

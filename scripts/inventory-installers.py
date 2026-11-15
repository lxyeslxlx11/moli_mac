#!/usr/bin/env python3
"""Read only the two named local installers. Never execute or download a target."""
import argparse
import datetime
import hashlib
import json
import pathlib
import struct
import subprocess


def inspect(path):
    size = path.stat().st_size
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        while chunk := stream.read(1024 * 1024):
            digest.update(chunk)
        stream.seek(0)
        dos = stream.read(64)
        if len(dos) != 64 or dos[:2] != b'MZ':
            raise ValueError(f'{path.name}: missing DOS header')
        pe_offset = struct.unpack_from('<I', dos, 60)[0]
        if pe_offset < 64 or pe_offset + 24 > size:
            raise ValueError(f'{path.name}: invalid PE offset')
        stream.seek(pe_offset)
        coff = stream.read(24)
        if coff[:4] != b'PE\0\0':
            raise ValueError(f'{path.name}: invalid PE signature')
        machine, sections, timestamp = struct.unpack_from('<HHI', coff, 4)
        optional_size = struct.unpack_from('<H', coff, 20)[0]
        optional = stream.read(optional_size)
        if len(optional) != optional_size or optional_size < 2:
            raise ValueError(f'{path.name}: truncated optional header')
        magic = struct.unpack_from('<H', optional)[0]
        data_directory = {0x10B: 96, 0x20B: 112}.get(magic)
        certificate = None
        if data_directory is not None and len(optional) >= data_directory + 40:
            count = struct.unpack_from('<I', optional, data_directory - 4)[0]
            if count >= 5:
                offset, length = struct.unpack_from('<II', optional, data_directory + 32)
                certificate = {'file_offset': offset, 'byte_length': length}
    quarantine = subprocess.run(['/usr/bin/xattr', '-p', 'com.apple.quarantine', str(path)],
                                capture_output=True, text=True)
    return {'name': path.name, 'path': str(path.resolve()), 'byte_size': size,
            'sha256': digest.hexdigest(), 'pe_header_offset': hex(pe_offset),
            'machine': hex(machine), 'section_count': sections,
            'optional_header_magic': hex(magic), 'coff_timestamp': timestamp,
            'certificate_directory': certificate,
            'quarantine_hint': quarantine.stdout.strip() if quarantine.returncode == 0 else None}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=pathlib.Path, help='Directory containing both installer EXEs')
    args = parser.parse_args()
    files = [inspect(args.directory / name) for name in ('POLCN_Setup.exe', 'CrossGate_Setup.exe')]
    print(json.dumps({'observed_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                      'authenticity': 'Not verified; local hash and quarantine are not official attestation',
                      'files': files}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

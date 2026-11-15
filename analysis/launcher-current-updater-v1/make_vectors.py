"""Original ZIP/PE-header fixtures; no vendor bytes and no loadable program."""
from pathlib import Path
import hashlib
import io
import json
import struct
import zipfile


def header_payload(pe_offset=128, size=None):
    data = bytearray(size if size is not None else pe_offset + 248)
    struct.pack_into('<H', data, 0, 0x5A4D)
    struct.pack_into('<I', data, 60, pe_offset)
    struct.pack_into('<I', data, pe_offset, 0x4550)
    struct.pack_into('<H', data, pe_offset + 4, 0x14C)
    struct.pack_into('<H', data, pe_offset + 24, 0x10B)
    struct.pack_into('<H', data, pe_offset + 92, 2)
    return bytes(data)


def archive(entries, method=zipfile.ZIP_DEFLATED):
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=method) as target:
        for name, payload, attributes in entries:
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.compress_type = method
            if attributes is not None:
                info.external_attr = attributes
            target.writestr(info, payload)
    return output.getvalue()


cases = []


def add(name, payload=None, entry='Probe.exe', error=None, method=zipfile.ZIP_DEFLATED,
        attributes=None, second=None, size_delta=0, wrong_md5=False, corrupt_crc=False):
    payload = header_payload(size=512) if payload is None else payload
    entries = [(entry, payload, attributes)]
    if second is not None:
        entries.append(('extra.txt', second, None))
    packed = archive(entries, method)
    if corrupt_crc:
        packed = bytearray(packed)
        filename_bytes, extra_bytes = struct.unpack_from('<HH', packed, 26)
        packed[30 + filename_bytes + extra_bytes] ^= 1
        packed = bytes(packed)
    row = {
        'name': name, 'archive_hex': packed.hex(),
        'expected_md5': '0' * 32 if wrong_md5 else hashlib.md5(payload).hexdigest(),
        'expected_archive_bytes': len(packed) + size_delta,
        'expected_error': error,
    }
    if error is None:
        row['expected_payload'] = {
            'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest(),
            'pe_offset': struct.unpack_from('<I', payload, 60)[0],
        }
    cases.append(row)


add('stored-minimum-header', header_payload(64), method=zipfile.ZIP_STORED)
add('deflated-header', header_payload(size=512))
add('uppercase-extension', entry='Alternate.EXE')
add('dot-exe-name', entry='.exe')
add('maximum-nt-offset', header_payload(1048575))
add('wrong-archive-size', error='UPDATE_ARCHIVE_SIZE', size_delta=1)
add('two-entries', second=b'original extra entry', error='UPDATE_ENTRY_COUNT')
for entry, name in [('Probe.bin', 'wrong-extension'), ('dir/Probe.exe', 'slash'),
                    ('dir\\Probe.exe', 'backslash'), ('C:Probe.exe', 'colon'),
                    ('\u542f\u52a8.exe', 'non-ascii-policy'), ('bad\t.exe', 'control-name')]:
    add(name, entry=entry, error='UPDATE_ENTRY_NAME')
add('directory', entry='Probe.exe/', attributes=0x10, error='ZIP_ENTRY_TYPE')
add('symlink', attributes=(0xA1FF << 16), error='ZIP_ENTRY_TYPE')
add('empty-candidate', payload=b'', error='UPDATE_EXPANSION_BUDGET')
add('expansion-budget', payload=header_payload(size=2 * 1024 * 1024), error='UPDATE_EXPANSION_BUDGET')
add('wrong-md5', wrong_md5=True, error='UPDATE_DIGEST_MISMATCH')
add('wrong-crc', method=zipfile.ZIP_STORED, corrupt_crc=True, error='ZIP_CRC_MISMATCH')
for name, data in [('short-dos', header_payload(size=512)[:63]),
                   ('short-nt', header_payload(size=512)[:128 + 247])]:
    add(name, payload=data, error='UPDATE_EXECUTABLE_HEADER')
for name, offset, fmt, value in [('wrong-mz', 0, '<H', 0),
                                ('nt-offset-below-min', 60, '<I', 63),
                                ('nt-offset-above-max', 60, '<I', 1048576),
                                ('wrong-pe-signature', 128, '<I', 0x4551),
                                ('amd64-machine', 132, '<H', 0x8664),
                                ('pe32plus-magic', 152, '<H', 0x20B),
                                ('console-subsystem', 220, '<H', 3)]:
    payload = bytearray(header_payload(size=512))
    struct.pack_into(fmt, payload, offset, value)
    add(name, payload=bytes(payload), error='UPDATE_EXECUTABLE_HEADER')

result = {'schema': 'moli.original-win32-update-vectors.v1',
          'generator': 'Python standard-library zipfile/struct/hashlib',
          'notice': 'Synthetic header profiles are not complete or loadable PE executables.',
          'cases': cases}
destination = Path(__file__).with_name('original-current-update-vectors.json')
with destination.open('x', encoding='utf-8') as target:
    json.dump(result, target, ensure_ascii=False, indent=2)
    target.write('\n')
print(json.dumps({'cases': len(cases), 'path': str(destination),
                  'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()}))

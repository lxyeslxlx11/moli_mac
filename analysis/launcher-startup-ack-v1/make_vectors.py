"""Original synthetic PE/ZIP fixtures for the selected startup resource declaration."""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import struct
import zipfile

MARKER = b'POLCN_LAUNCHER_ACK_V1'
NAME = 'POLCN_LAUNCHER_ACK_PROTOCOL'
PE = 0x80
OPT = PE + 24
RAW = 0x200
RVA = 0x1000


def image(payloads=(MARKER,), name=NAME, directory=True):
    data = bytearray(0x600)
    data[:2] = b'MZ'
    struct.pack_into('<I', data, 60, PE)
    data[PE:PE + 4] = b'PE\0\0'
    struct.pack_into('<HH', data, PE + 4, 0x14c, 1)
    struct.pack_into('<HH', data, PE + 20, 224, 2)
    struct.pack_into('<H', data, OPT, 0x10b)
    struct.pack_into('<H', data, OPT + 68, 2)
    struct.pack_into('<I', data, OPT + 92, 16)
    struct.pack_into('<II', data, OPT + 112, RVA if directory else 0, 0x400 if directory else 0)
    section = OPT + 224
    data[section:section + 8] = b'.rsrc\0\0\0'
    struct.pack_into('<IIII', data, section + 8, 0x400, RVA, 0x400, RAW)
    if not directory:
        return data
    struct.pack_into('<HH', data, RAW + 12, 0, 1)
    struct.pack_into('<II', data, RAW + 16, 10, 0x80000020)
    struct.pack_into('<HH', data, RAW + 32 + 12, 1, 0)
    struct.pack_into('<II', data, RAW + 48, 0x800000c0, 0x80000040)
    struct.pack_into('<HH', data, RAW + 64 + 12, 0, len(payloads))
    for ordinal, payload in enumerate(payloads):
        struct.pack_into('<II', data, RAW + 80 + ordinal * 8, 1033 + ordinal * 1019, 128 + ordinal * 16)
        struct.pack_into('<IIII', data, RAW + 128 + ordinal * 16, RVA + 0x180 + ordinal * 64, len(payload), 0, 0)
        data[RAW + 0x180 + ordinal * 64:RAW + 0x180 + ordinal * 64 + len(payload)] = payload
    encoded = name.encode('utf-16le')
    struct.pack_into('<H', data, RAW + 192, len(name))
    data[RAW + 194:RAW + 194 + len(encoded)] = encoded
    return data


def changed(data, at, value, fmt='<I'):
    struct.pack_into(fmt, data, at, value)
    return data


cases = []


def add(name, payload, error=None, declaration=None, languages=0, policy='source marker or absence'):
    archive = BytesIO()
    entry = zipfile.ZipInfo('CurrentProbe.exe', (2020, 1, 1, 0, 0, 0))
    entry.create_system = 0
    entry.external_attr = 0x20
    entry.compress_type = zipfile.ZIP_STORED
    with zipfile.ZipFile(archive, 'w') as writer:
        writer.writestr(entry, payload)
    data = archive.getvalue()
    cases.append({'name': name, 'archive_hex': data.hex(), 'expected_md5': hashlib.md5(payload).hexdigest(),
                  'expected_archive_bytes': len(data), 'payload_sha256': hashlib.sha256(payload).hexdigest(),
                  'expected_error': error, 'declaration': declaration, 'languages': languages, 'coverage': policy})


add('no-declared-directory', image(directory=False), declaration='absent')
add('other-resource-name', image(name='OTHER_PROTOCOL'), declaration='absent')
add('marker21', image(), declaration='v1', languages=1)
add('marker22-with-nul', image((MARKER + b'\0',)), declaration='v1', languages=1)
add('marker22-nonzero', image((MARKER + b'x',)), 'UPDATE_ACK_RESOURCE')
add('marker-case-mismatch', image((b'p' + MARKER[1:],)), 'UPDATE_ACK_RESOURCE')
add('short-marker', image((MARKER[:-1],)), 'UPDATE_ACK_RESOURCE')
add('long-marker', image((MARKER + b'\0\0',)), 'UPDATE_ACK_RESOURCE')
add('all-languages-agree', image((MARKER, MARKER + b'\0')), declaration='v1', languages=2,
    policy='independent all-selected-language profile; no locale fallback')
add('mixed-language-markers', image((MARKER, b'x' + MARKER[1:])), 'UPDATE_ACK_RESOURCE',
    policy='independent all-selected-language profile')
duplicate = changed(image(), RAW + 44, 2, '<H')
struct.pack_into('<II', duplicate, RAW + 56, 0x800000c0, 0x80000040)
add('duplicate-protocol-name', duplicate, 'UPDATE_ACK_RESOURCE_FORMAT', policy='independent unique selected path')
add('case-alias-resource-name', image(name=NAME.lower()), 'UPDATE_ACK_RESOURCE_FORMAT',
    policy='independent exact-name support; never silent legacy for a case alias')
add('selected-directory-cycle', changed(image(), RAW + 20, 0x80000000), 'UPDATE_ACK_RESOURCE_FORMAT')
add('unmapped-marker-rva', changed(image(), RAW + 128, 0x5000), 'UPDATE_ACK_RESOURCE_FORMAT')
overlap = changed(image(), PE + 6, 2, '<H')
overlap[OPT + 264:OPT + 304] = overlap[OPT + 224:OPT + 264]
add('ambiguous-section-mapping', overlap, 'UPDATE_ACK_RESOURCE_FORMAT')
add('half-empty-directory-pair', changed(image(), OPT + 112, 0), 'UPDATE_ACK_RESOURCE_FORMAT')
add('directory-entry-budget', changed(image(), RAW + 14, 2049, '<H'), 'UPDATE_ACK_RESOURCE_BUDGET')
add('resource-name-budget', changed(image(), RAW + 192, 257, '<H'), 'UPDATE_ACK_RESOURCE_BUDGET')
add('named-language-leaf', changed(image(), RAW + 80, 0x800000c0), 'UPDATE_ACK_RESOURCE_FORMAT')
add('missing-language-leaves', changed(image(), RAW + 78, 0, '<H'), 'UPDATE_ACK_RESOURCE_FORMAT')
add('virtual-resource-bound', changed(image(), OPT + 232, 0x100), 'UPDATE_ACK_RESOURCE_FORMAT')
add('undeclared-directory-header', changed(image(), PE + 20, 119, '<H'), 'UPDATE_ACK_RESOURCE_FORMAT')
unrelated = changed(image(), RAW + 14, 2, '<H')
struct.pack_into('<II', unrelated, RAW + 24, 3, 0x800003ff)
add('unrelated-payload-not-traversed', unrelated, declaration='v1', languages=1,
    policy='selected declaration only; no global PE/resource-loader validation')

output = {'schema': 'moli.synthetic-startup-ack-resource-vectors.v1',
          'producer': 'Python struct and zipfile; all executable-shaped bytes are original fixtures and are never executed.',
          'cases': cases}
Path(__file__).with_name('resource-vectors.json').write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps({'cases': len(cases), 'positive': sum(row['expected_error'] is None for row in cases)}))

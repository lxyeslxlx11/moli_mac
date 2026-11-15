"""Original journal headers from Python struct, with an independent native first-read predicate."""
from pathlib import Path
import json
import struct

MAGIC = 0x554C4F50
MASK = 0xF016EA0B


def header(stage=1, magic=MAGIC, version=1, checksum=None, endian='<'):
    return struct.pack(endian + 'IIII', magic, version, stage,
                       (stage ^ MASK) if checksum is None else checksum)


def native_predicate(data):
    if len(data) < 16:
        return False
    magic, version, stage, check = struct.unpack('<IIII', data[:16])
    return magic == MAGIC and version == 1 and 1 <= stage <= 5 and check == stage ^ MASK


def profile_error(data):
    if len(data) != 16:
        return 'JOURNAL_HEADER_LENGTH'
    magic, version, stage, check = struct.unpack('<IIII', data)
    if magic != MAGIC:
        return 'JOURNAL_MAGIC'
    if version != 1:
        return 'JOURNAL_VERSION'
    if check != stage ^ MASK:
        return 'JOURNAL_CHECKSUM'
    if not 1 <= stage <= 5:
        return 'JOURNAL_STAGE'
    return None


cases = []


def add(name, data):
    error = profile_error(data)
    cases.append({'name': name, 'header_hex': data.hex(), 'native_first16_accepts': native_predicate(data),
                  'expected_error': error, 'expected_stage': None if error else struct.unpack('<IIII', data)[2]})


for stage in range(1, 6):
    add('recorded-stage-' + str(stage), header(stage))
add('wrong-magic', header(magic=0x554C4F51))
for version in [0, 2, 0xFFFFFFFF]:
    add('wrong-version-' + str(version), header(version=version))
for stage in [0, 6, 0x80000000, 0xFFFFFFFF]:
    add('out-of-range-stage-' + str(stage), header(stage))
for stage in [1, 5]:
    add('wrong-check-' + str(stage), header(stage, checksum=stage ^ MASK ^ 1))
for count in [0, 1, 3, 4, 7, 8, 11, 12, 15]:
    add('short-header-' + str(count), header()[:count])
add('extra-byte-is-not-an-exact-header', header() + b'\x00')
add('extra16bytes-is-not-an-exact-header', header(5) + bytes(16))
add('big-endian-is-not-the-observed-layout', header(endian='>'))
output = {'schema': 'moli.launcher-update-recovery-v1.original-vectors.v1',
          'producer': 'Python stdlib struct; original synthetic headers, no shipped payload or credentials',
          'profile': 'Exact16byte header. Native selected ReadFile consumes only first16bytes, so two tail cases differ explicitly.',
          'cases': cases}
Path(__file__).with_name('original-vectors.json').write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps({'vectors': len(cases), 'native_accepts': sum(x['native_first16_accepts'] for x in cases),
                  'exact_header_accepts': sum(x['expected_error'] is None for x in cases)}))

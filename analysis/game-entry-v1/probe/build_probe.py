"""Build only original host tests/x86 Windows fixture+observer; never execute a PE or control a VM."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import struct
import subprocess
from pe_layout import validate_own_x86_layout

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).resolve().parent
OUTPUT = ROOT / 'build/analysis/game-entry-v1/probe-stage101'
OUTPUT.mkdir(parents=True, exist_ok=True)
CC = shutil.which('i686-w64-mingw32-gcc')
CLANG = shutil.which('clang')
NM = shutil.which('i686-w64-mingw32-nm')
assert CC and CLANG and NM, 'Existing compiler tools are required; no implicit installation.'
commands = []


def run(args):
    result = subprocess.run([str(x) for x in args], cwd=ROOT, text=True, capture_output=True, check=False)
    commands.append({'argv': [str(x) for x in args], 'exit_code': result.returncode,
                     'stdout': result.stdout, 'stderr': result.stderr})
    if result.returncode:
        (OUTPUT / 'build-attempt.json').write_text(json.dumps(commands, indent=2) + '\n')
        raise RuntimeError('Build/test step failed; see private build-attempt.json.')
    return result.stdout


def identity(path):
    data = path.read_bytes()
    return {'path': str(path.relative_to(ROOT)), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def pe(path):
    data = path.read_bytes()
    layout = validate_own_x86_layout(data)
    at = struct.unpack_from('<I', data, 60)[0]
    assert data[at:at + 4] == b'PE\0\0'
    optional = at + 24
    out = {'machine': struct.unpack_from('<H', data, at + 4)[0], 'optional_magic': struct.unpack_from('<H', data, optional)[0],
           'image_base': struct.unpack_from('<I', data, optional + 28)[0],
           'image_bytes': struct.unpack_from('<I', data, optional + 56)[0],
           'dll_characteristics': struct.unpack_from('<H', data, optional + 70)[0],
           'layout_validation': layout, 'sections': []}
    size = struct.unpack_from('<H', data, at + 20)[0]
    for index in range(struct.unpack_from('<H', data, at + 6)[0]):
        row = optional + size + index * 40
        virtual_bytes, rva, raw_bytes, offset = struct.unpack_from('<IIII', data, row + 8)
        out['sections'].append({'name': data[row:row + 8].split(b'\0')[0].decode('ascii'), 'rva': rva,
                                'virtual_bytes': virtual_bytes, 'raw_bytes': raw_bytes, 'file_offset': offset})
    assert out['machine'] == 0x14c and out['optional_magic'] == 0x10b
    assert out['dll_characteristics'] & 0x140 == 0x140, 'ASLR/NX must remain enabled.'
    return out


flags = ['-std=c11', '-O2', '-Wall', '-Wextra', '-Werror', '-Wl,--no-insert-timestamp,--dynamicbase,--nxcompat']
run([CLANG, '-std=c11', '-O2', '-Wall', '-Wextra', '-Werror', SOURCE / 'probe_core_test.c', '-o', OUTPUT / 'probe-core-test'])
host_output = run([OUTPUT / 'probe-core-test'])
assert 'assertions=26 pass=26 win32_execution=0' in host_output
fixture = OUTPUT / 'entry-fixture.exe'
fixture_flags = flags + ['-Wl,--image-base,0x400000', '-Wl,-T,' + str(SOURCE / 'entry_fixture.ld')]
run([CC, *fixture_flags, SOURCE / 'entry_fixture.c', SOURCE / 'entry_fixture_slots.S', '-o', fixture])
first_fixture = fixture.read_bytes()
run([CC, *fixture_flags, SOURCE / 'entry_fixture.c', SOURCE / 'entry_fixture_slots.S', '-o', fixture])
assert first_fixture == fixture.read_bytes(), 'Fixture builds differ.'
fixture_pe = pe(fixture)
section = next(x for x in fixture_pe['sections'] if x['name'] == '.slots')
assert section['rva'] <= 0xe65db8 and 0xe65dc0 <= section['rva'] + section['virtual_bytes']
assert section['raw_bytes'] == 0, 'Fixture padding must remain zero-filled virtual data.'
symbols = run([NM, '-n', fixture])
expected = {}
for name in ['fixture_entry', 'fixture_cleanup', 'fixture_slots']:
    found = re.search(r'^([0-9a-fA-F]+) [A-Za-z] _' + name + r'$', symbols, re.M)
    assert found, name
    expected[name + '_rva'] = int(found.group(1), 16) - fixture_pe['image_base']
assert expected['fixture_slots_rva'] + 0xdb8 == 0xe65db8
fixture_digest = hashlib.sha256(first_fixture).digest()
(OUTPUT / 'fixture_identity.h').write_text('#ifndef MOLI_FIXTURE_IDENTITY_H\n#define MOLI_FIXTURE_IDENTITY_H\n'
    '#define FIXTURE_IMAGE_BYTES ' + hex(fixture_pe['image_bytes']) + '\n'
    'static const unsigned char fixture_sha[32] = {' + ','.join(hex(x) for x in fixture_digest) + '};\n#endif\n')
observer = OUTPUT / 'callback-probe.exe'
run([CC, *flags, '-I', OUTPUT, SOURCE / 'callback_probe.c', '-lbcrypt', '-o', observer])
first_observer = observer.read_bytes()
run([CC, *flags, '-I', OUTPUT, SOURCE / 'callback_probe.c', '-lbcrypt', '-o', observer])
assert first_observer == observer.read_bytes(), 'Observer builds differ.'
observer_pe = pe(observer)
report = {'schema': 'moli.game-entry-v1.observer-build.v1', 'result': 'prepared-only-not-Windows-executed',
          'compiler': CC, 'host_compiler': CLANG, 'host_test_output': host_output.strip(), 'host_test_exit': 0,
          'fixture': identity(fixture) | {'pe': fixture_pe, 'expected_rvas': expected, 'repeat_build_identical': True},
          'observer': identity(observer) | {'pe': observer_pe, 'repeat_build_identical': True},
          'sources': [identity(SOURCE / name) for name in ['probe_core.h', 'probe_core_test.c', 'entry_fixture.c', 'entry_fixture_slots.S', 'entry_fixture.ld', 'callback_probe.c', 'pe_layout.py', 'build_probe.py']],
          'Win32_APIs_or_game_executed': False, 'scope': 'Only own native host core tests ran. Both PE files are analysis/data artifacts.'}
(OUTPUT / 'build-commands.json').write_text(json.dumps(commands, indent=2) + '\n')
(OUTPUT / 'build-report.json').write_text(json.dumps(report, indent=2) + '\n')
(ROOT / 'analysis/game-entry-v1/observer-build-stage101.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'host_assertions': 26, 'fixture': report['fixture']['sha256'], 'observer': report['observer']['sha256'],
                  'deterministic_builds': True, 'Win32_execution': False}))
